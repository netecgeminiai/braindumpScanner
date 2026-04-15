#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json
import time
import zipfile
import xml.etree.ElementTree as ET
import csv
import sys
import os
import glob
from pathlib import Path
from difflib import SequenceMatcher

print("==================================================")
print("🛡️ ESCÁNER AUTOMATIZADO DE BRAINDUMPS (NETEC) 🛡️")
print("==================================================\n")

# Configuración y Rutas
SERPAPI_KEY = "190e54b51877ec5252189a5b3c8d4463be9ed53c0c874886d9188f9f6dac2573"
CARPETA_ENTRADAS = Path("./entradas")
CARPETA_RESULTADOS = Path("./resultados")

# Asegurar que las carpetas existan
CARPETA_ENTRADAS.mkdir(parents=True, exist_ok=True)
CARPETA_RESULTADOS.mkdir(parents=True, exist_ok=True)

# Buscar archivos Excel en la carpeta de entradas
archivos_excel = list(CARPETA_ENTRADAS.glob("*.xlsx"))

if not archivos_excel:
    print(f"❌ No se encontraron archivos .xlsx en la carpeta: {CARPETA_ENTRADAS.absolute()}")
    print("   👉 Instrucciones: Coloca tus archivos Excel de exámenes en esa carpeta y vuelve a ejecutar el script.")
    sys.exit(0)

print(f"✓ Encontrados {len(archivos_excel)} bancos de preguntas para analizar.\n")

# ==========================================
# FUNCIONES AUXILIARES
# ==========================================
def extraer_preguntas_excel(file_path):
    preguntas = []
    try:
        with zipfile.ZipFile(file_path, 'r') as z:
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
                    if texto not in preguntas: # Evitar duplicados
                        preguntas.append(texto)
        return preguntas
    except Exception as e:
        print(f"  [!] Error leyendo el archivo {file_path.name}: {e}")
        return []

def buscar_serpapi(query):
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

def calcular_similitud(texto1, texto2):
    return SequenceMatcher(None, texto1.lower(), texto2.lower()).ratio()

# ==========================================
# PROCESAMIENTO BATCH (Todos los archivos)
# ==========================================
sitios_sospechosos = ["examtopics.com", "quizlet.com", "vce", "certlibrary.com", "briefmenow.org", "itexams.com"]

for archivo in archivos_excel:
    print(f"\n▶ PROCESANDO BANCO: {archivo.name}")
    print("-" * 50)
    
    preguntas = extraer_preguntas_excel(archivo)
    if not preguntas:
        print("  [!] No se encontraron preguntas válidas en este archivo. Saltando...")
        continue
        
    print(f"  ✓ {len(preguntas)} preguntas extraídas. Iniciando escaneo web...\n")
    
    reporte = []
    
    # Procesar cada pregunta
    for i, pregunta in enumerate(preguntas, 1):
        palabras = pregunta.split()
        query = " ".join(palabras[:25]) if len(palabras) > 25 else pregunta
            
        print(f"  🔍 Analizando Q{i}/{len(preguntas)}: {query[:45]}...")
        
        resultados = buscar_serpapi(query)
        
        riesgo = 0.0
        evidencias = []
        accion = "Mantener"
        mejor_snippet = "Sin resultados en la web"
        
        for res in resultados:
            sim = calcular_similitud(query, res["snippet"])
            
            is_braindump = any(sospechoso in res["url"].lower() for sospechoso in sitios_sospechosos)
            if is_braindump:
                sim += 0.30 # Penalización severa
                
            # Si esta similitud es la mayor hasta ahora, guardamos el riesgo y el texto encontrado
            if sim > riesgo:
                riesgo = sim
                mejor_snippet = res["snippet"]
            
            if sim > 0.40:
                evidencias.append(res["url"])
        
        # Clasificación
        riesgo_porcentaje = int(riesgo * 100)
        
        if riesgo_porcentaje >= 85:
            estado = "🔴 FILTRADA (CRÍTICO)"
            accion = "Eliminar / Sustituir"
        elif riesgo_porcentaje >= 60:
            estado = "🟠 RIESGO MEDIO"
            accion = "Reescribir"
        elif riesgo_porcentaje >= 30:
            estado = "🟡 RIESGO BAJO"
            accion = "Revisión manual"
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
            "URLs_Evidencia": " | ".join(evidencias[:3]) if evidencias else "Ninguna",
            "Texto_Encontrado_Web": mejor_snippet if riesgo > 0 else "Sin resultados relevantes"
        })
        
        time.sleep(1.5) # Respetar rate limit de la API
    
    # Generar el reporte para este archivo
    nombre_salida = f"Reporte_{archivo.stem}.csv"
    ruta_salida = CARPETA_RESULTADOS / nombre_salida
    
    try:
        with open(ruta_salida, 'w', newline='', encoding='utf-8') as f:
            campos = ["ID_Pregunta", "Pregunta", "Estado_Seguridad", "Nivel_Riesgo_%", "Sitios_Braindump", "Accion_Sugerida", "URLs_Evidencia", "Texto_Encontrado_Web"]
            writer = csv.DictWriter(f, fieldnames=campos)
            writer.writeheader()
            writer.writerows(reporte)
        print(f"\n  ✅ Reporte guardado en: {ruta_salida}")
    except Exception as e:
        print(f"\n  ❌ Error al guardar CSV: {e}")

print("\n==================================================")
print("🏁 AUDITORÍA BATCH COMPLETADA.")
print("==================================================")
