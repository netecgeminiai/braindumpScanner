#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json
import time
import zipfile
import xml.etree.ElementTree as ET
import csv
import sys
import subprocess
from pathlib import Path

print("==================================================")
print("🧠 ESCÁNER PRO DE BRAINDUMPS (SerpApi + Gemini) 🧠")
print("==================================================\n")

# Configuración
SERPAPI_KEY = "190e54b51877ec5252189a5b3c8d4463be9ed53c0c874886d9188f9f6dac2573"
FILE_PATH = "/home/adminetec/.openclaw/media/inbound/ISTQB_Completo_V1.2---231164ae-bad3-4eed-9e94-62453271c73e.xlsx"
OUTPUT_CSV = "/home/adminetec/.openclaw/workspace/Reporte_Exposicion_ISTQB_AI.csv"
MAX_PREGUNTAS_A_PROCESAR = 3 # Reducido a 3 para probar la API de Gemini rápidamente

# ==========================================
# 1. LECTURA Y EXTRACCIÓN DEL EXCEL (Nativo)
# ==========================================
print("[1/4] Extrayendo preguntas del banco (Excel)...")
preguntas = []

try:
    with zipfile.ZipFile(FILE_PATH, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            with z.open('xl/sharedStrings.xml') as f:
                tree = ET.parse(f)
                for si in tree.getroot().findall('.//{*}t'):
                    if si.text:
                        shared_strings.append(si.text)
        
        for text in shared_strings:
            texto = text.strip().replace('\n', ' ')
            if len(texto) > 40 and ("?" in texto or "¿" in texto or "Cuál" in texto or "Qué" in texto or "Which" in texto or "What" in texto):
                if texto not in preguntas:
                    preguntas.append(texto)

    print(f"✓ Extraídas {len(preguntas)} preguntas potenciales del archivo.")
    
except Exception as e:
    print(f"❌ Error leyendo el archivo: {e}")
    sys.exit(1)

preguntas_a_procesar = preguntas[:MAX_PREGUNTAS_A_PROCESAR]
print(f"✓ Procesaremos las primeras {MAX_PREGUNTAS_A_PROCESAR} para probar la integración con Gemini.\n")

# ==========================================
# 2. MOTOR DE BÚSQUEDA (SerpApi)
# ==========================================
def buscar_serpapi(query):
    palabras = query.split()
    query_corta = " ".join(palabras[:25]) if len(palabras) > 25 else query
    query_url = urllib.parse.quote(f'"{query_corta}"')
    url = f"https://serpapi.com/search.json?q={query_url}&api_key={SERPAPI_KEY}&engine=google&hl=es"
    
    try:
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req, timeout=15)
        data = json.loads(response.read().decode('utf-8'))
        
        resultados = []
        if "organic_results" in data:
            for item in data["organic_results"]:
                resultados.append({
                    "url": item.get("link", ""),
                    "snippet": item.get("snippet", ""),
                    "title": item.get("title", "")
                })
        return resultados
    except Exception as e:
        print(f"  [!] Error de SerpApi: {e}")
        return []

# ==========================================
# 3. ANÁLISIS SEMÁNTICO (Gemini vía OpenClaw CLI)
# ==========================================
def evaluar_con_gemini(pregunta_original, resultados_web):
    if not resultados_web:
        return 0, "No hay resultados en la web para evaluar."
        
    # Preparamos el contexto para Gemini
    contexto = "\n".join([f"Snippet {i+1}: {r['snippet']}" for i, r in enumerate(resultados_web[:3])])
    
    prompt = f"""Eres un auditor de seguridad de exámenes de certificación.
Tu tarea es comparar la PREGUNTA ORIGINAL del examen con los RESULTADOS DE BÚSQUEDA WEB encontrados.
Determina si la pregunta ha sido filtrada (braindump) o si hay alta similitud semántica.

PREGUNTA ORIGINAL: "{pregunta_original}"

RESULTADOS DE BÚSQUEDA EN LA WEB:
{contexto}

Evalúa la similitud y devuelve SOLO un JSON válido con este formato exacto:
{{"riesgo_porcentaje": 0-100, "justificacion": "breve explicacion de por que"}}"""

    try:
        # Usamos el CLI de openclaw para invocar a Gemini
        cmd = ["openclaw", "agent", "--local", "--message", prompt]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        # Extraer la respuesta del agente (evitando JSON complejo, buscando solo los valores)
        reply_text = result.stdout.strip()
        
        # Buscar el porcentaje y la justificación con expresiones regulares simples
        import re
        riesgo = 50
        justificacion = "Evaluado por IA"
        
        # Buscar algo como "riesgo_porcentaje": 85
        match_riesgo = re.search(r'"riesgo_porcentaje"\s*:\s*(\d+)', reply_text)
        if match_riesgo:
            riesgo = int(match_riesgo.group(1))
            
        # Buscar la justificación
        match_just = re.search(r'"justificacion"\s*:\s*"([^"]+)"', reply_text)
        if match_just:
            justificacion = match_just.group(1)
            
        return riesgo, justificacion
            
    except Exception as e:
        print(f"  [!] Error invocando a Gemini: {e}")
        return 0, "Fallo en llamada a IA"

# ==========================================
# 4. PROCESAMIENTO PRINCIPAL
# ==========================================
reporte = []

print(f"[2/4] Consultando motor de búsqueda (SerpApi) y analizando con IA (Gemini)...")

sitios_sospechosos = ["examtopics.com", "quizlet.com", "vce", "certlibrary.com", "briefmenow.org", "itexams.com"]

for i, pregunta in enumerate(preguntas_a_procesar, 1):
    print(f"  🔍 Analizando Q{i}: {pregunta[:50]}...")
    
    # 1. Buscar en la web
    resultados = buscar_serpapi(pregunta)
    
    # 2. Evaluar con Gemini
    riesgo_porcentaje, justificacion = evaluar_con_gemini(pregunta, resultados)
    
    evidencias = [res["url"] for res in resultados]
    
    # Penalización adicional si está en sitio de braindumps
    is_braindump = any(sospechoso in url.lower() for url in evidencias for sospechoso in sitios_sospechosos)
    if is_braindump and riesgo_porcentaje < 90:
        riesgo_porcentaje = max(riesgo_porcentaje + 30, 100)
        justificacion += " (Penalización por sitio de Braindump conocido)"
        
    # Clasificación final
    if riesgo_porcentaje >= 85:
        estado = "🔴 FILTRADA (CRÍTICO)"
        accion = "Eliminar / Sustituir inmediatamente"
    elif riesgo_porcentaje >= 60:
        estado = "🟠 RIESGO MEDIO (Parafraseada)"
        accion = "Reescribir fuertemente"
    elif riesgo_porcentaje >= 30:
        estado = "🟡 RIESGO BAJO (Similitud parcial)"
        accion = "Revisión manual sugerida"
    else:
        estado = "🟢 SEGURO"
        accion = "Mantener"
        
    reporte.append({
        "ID_Pregunta": i,
        "Pregunta": pregunta,
        "Estado_Seguridad": estado,
        "Nivel_Riesgo_%": f"{riesgo_porcentaje}%",
        "Sitios_Braindump": "SÍ" if is_braindump else "NO",
        "Accion_Sugerida": accion,
        "Justificacion_IA": justificacion,
        "URLs_Evidencia": " | ".join(evidencias[:3]) if evidencias else "Ninguna"
    })
    
    time.sleep(1)

print("\n[3/4] Generando archivo de reporte CSV...")

try:
    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        campos = ["ID_Pregunta", "Pregunta", "Estado_Seguridad", "Nivel_Riesgo_%", "Sitios_Braindump", "Accion_Sugerida", "Justificacion_IA", "URLs_Evidencia"]
        writer = csv.DictWriter(f, fieldnames=campos)
        writer.writeheader()
        writer.writerows(reporte)
    print(f"✓ Archivo guardado exitosamente en: {OUTPUT_CSV}")
except Exception as e:
    print(f"❌ Error al guardar CSV: {e}")

print("\n[4/4] RESUMEN DE LA AUDITORÍA (IA):")
for r in reporte:
    print(f"  ➤ Q{r['ID_Pregunta']}: {r['Estado_Seguridad']} ({r['Nivel_Riesgo_%']})")
    print(f"      Razón: {r['Justificacion_IA']}")

print("\n==================================================")
print("✅ ANÁLISIS COMPLETADO. REPORTE LISTO.")
print("==================================================")
