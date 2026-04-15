#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json
import time
import zipfile
import xml.etree.ElementTree as ET
import csv
import sys
from pathlib import Path
from difflib import SequenceMatcher

print("==================================================")
print("🛡️ INICIANDO ESCÁNER PRO DE BRAINDUMPS (NETEC) 🛡️")
print("==================================================\n")

# Configuración
SERPAPI_KEY = "190e54b51877ec5252189a5b3c8d4463be9ed53c0c874886d9188f9f6dac2573"
FILE_PATH = "/home/adminetec/.openclaw/media/inbound/ISTQB_Completo_V1.2---231164ae-bad3-4eed-9e94-62453271c73e.xlsx"
OUTPUT_CSV = "/home/adminetec/.openclaw/workspace/Reporte_Exposicion_ISTQB_Pro.csv"
MAX_PREGUNTAS_A_PROCESAR = 10 # Límite para la prueba inicial

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
        
        # Filtro heurístico mejorado para detectar preguntas
        for text in shared_strings:
            texto = text.strip().replace('\n', ' ')
            if len(texto) > 40 and ("?" in texto or "¿" in texto or "Cuál" in texto or "Qué" in texto or "Which" in texto or "What" in texto):
                if texto not in preguntas: # Evitar duplicados
                    preguntas.append(texto)

    print(f"✓ Extraídas {len(preguntas)} preguntas potenciales del archivo.")
    
except Exception as e:
    print(f"❌ Error leyendo el archivo: {e}")
    sys.exit(1)

preguntas_a_procesar = preguntas[:MAX_PREGUNTAS_A_PROCESAR]
print(f"✓ Procesaremos las primeras {MAX_PREGUNTAS_A_PROCESAR} para esta prueba de calidad.\n")

# ==========================================
# 2. MOTOR DE BÚSQUEDA (SerpApi)
# ==========================================
def buscar_serpapi(query):
    # Optimizar query: tomamos las palabras más relevantes o la frase exacta
    query_url = urllib.parse.quote(f'"{query}"')
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
        print(f"  [!] Error de API: {e}")
        return []

# ==========================================
# 3. ANÁLISIS DE SIMILITUD (Léxica)
# ==========================================
def calcular_similitud(texto1, texto2):
    # Calcula la similitud de secuencias (0.0 a 1.0)
    # En producción se reemplazará por Embeddings Semánticos (OpenAI)
    return SequenceMatcher(None, texto1.lower(), texto2.lower()).ratio()

# ==========================================
# 4. PROCESAMIENTO Y GENERACIÓN DE REPORTE
# ==========================================
reporte = []

print(f"[2/4] Consultando motor de búsqueda (SerpApi) y analizando riesgo...")

for i, pregunta in enumerate(preguntas_a_procesar, 1):
    # Recortar pregunta si es extremadamente larga (Google max 32 words)
    palabras = pregunta.split()
    if len(palabras) > 25:
        query = " ".join(palabras[:25])
    else:
        query = pregunta
        
    print(f"  🔍 Analizando Q{i}: {query[:50]}...")
    
    resultados = buscar_serpapi(query)
    
    estado = "🟢 SEGURO"
    riesgo = 0.0
    evidencias = []
    accion = "Mantener"
    
    sitios_sospechosos = ["examtopics.com", "quizlet.com", "vce", "certlibrary.com", "briefmenow.org", "itexams.com"]
    
    for res in resultados:
        # Calcular similitud entre la pregunta original y el snippet de Google
        sim = calcular_similitud(query, res["snippet"])
        
        # Penalización si está en un sitio de braindumps conocido
        is_braindump = any(sospechoso in res["url"].lower() for sospechoso in sitios_sospechosos)
        if is_braindump:
            sim += 0.30 # Aumentar drásticamente el riesgo si está en Quizlet/Examtopics
            
        riesgo = max(riesgo, min(sim, 1.0)) # Mantener el riesgo más alto encontrado (max 100%)
        
        if sim > 0.40: # Umbral mínimo para considerarlo evidencia relevante
            evidencias.append(res["url"])
    
    # Clasificación final
    riesgo_porcentaje = int(riesgo * 100)
    
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
        "Sitios_Braindump": "SÍ" if any(sospechoso in url.lower() for url in evidencias for sospechoso in sitios_sospechosos) else "NO",
        "Accion_Sugerida": accion,
        "URLs_Evidencia": " | ".join(evidencias[:3]) if evidencias else "Ninguna"
    })
    
    # Respetar rate limits de la API
    time.sleep(1.5)

print("\n[3/4] Generando archivo de reporte CSV...")

try:
    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        campos = ["ID_Pregunta", "Pregunta", "Estado_Seguridad", "Nivel_Riesgo_%", "Sitios_Braindump", "Accion_Sugerida", "URLs_Evidencia"]
        writer = csv.DictWriter(f, fieldnames=campos)
        writer.writeheader()
        writer.writerows(reporte)
    print(f"✓ Archivo guardado exitosamente en: {OUTPUT_CSV}")
except Exception as e:
    print(f"❌ Error al guardar CSV: {e}")

print("\n[4/4] RESUMEN DE LA AUDITORÍA:")
for r in reporte:
    print(f"  ➤ Q{r['ID_Pregunta']}: {r['Estado_Seguridad']} ({r['Nivel_Riesgo_%']})")

print("\n==================================================")
print("✅ ANÁLISIS COMPLETADO. REPORTE LISTO.")
print("==================================================")
