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

print("Iniciando Prototipo de Detección de Braindumps para ISTQB...")

# 1. Leer el Excel nativamente (sin pandas)
file_path = "/home/adminetec/.openclaw/media/inbound/ISTQB_Completo_V1.2---231164ae-bad3-4eed-9e94-62453271c73e.xlsx"
preguntas = []

try:
    with zipfile.ZipFile(file_path, 'r') as z:
        # Extraer los strings del archivo
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            with z.open('xl/sharedStrings.xml') as f:
                tree = ET.parse(f)
                for si in tree.getroot().findall('.//{*}t'):
                    if si.text:
                        shared_strings.append(si.text)
        
        # En el formato visto, las preguntas son textos muy largos.
        # Vamos a filtrar heurísticamente las primeras 5 "preguntas" verdaderas.
        # Asumimos que una pregunta de examen tiene al menos 50 caracteres
        # y termina en '?' o tiene la palabra 'Which'/'Cual'
        for text in shared_strings:
            texto = text.strip().replace('\n', ' ')
            if len(texto) > 60 and ("Which" in texto or "What" in texto or "?" in texto or "Cuál" in texto or "Qué" in texto):
                preguntas.append(texto)
                if len(preguntas) >= 5: # Tomar solo 5 para el prototipo rápido
                    break

except Exception as e:
    print(f"Error leyendo el archivo: {e}")
    sys.exit(1)

print(f"\n[Fase 1] {len(preguntas)} preguntas extraídas para el prototipo.")

# 2. Motor de Búsqueda Web Simple (DuckDuckGo Lite API o Scraper HTML)
def buscar_en_web(query):
    # Buscamos usando DuckDuckGo HTML Lite (no bloquea tan rápido como Google)
    url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(f'"{query}"')
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        response = urllib.request.urlopen(req, timeout=10)
        html = response.read().decode('utf-8')
        
        # Parseo muy básico (sin BeautifulSoup)
        # Buscar links en los resultados (clases .result__url)
        resultados = []
        partes = html.split('class="result__url"')
        for parte in partes[1:]:
            link = parte.split('href="')[1].split('"')[0]
            # DuckDuckGo a veces ofusca los links, si está limpio, lo usamos.
            if link.startswith("http"):
                resultados.append(link)
        
        return resultados[:3] # Retornar los primeros 3 links
    except Exception as e:
        return [f"Error buscando: {str(e)}"]

# 3. Analizar y generar reporte CSV
reporte = []

print("\n[Fase 2 y 3] Buscando preguntas en Internet y calculando Exposición...\n")

for i, pregunta in enumerate(preguntas, 1):
    print(f"Buscando Pregunta {i}...")
    
    # Reducimos la longitud de la query para que el buscador no falle (max 32 palabras)
    palabras = pregunta.split(" ")
    query_corta = " ".join(palabras[:20])
    
    links = buscar_en_web(query_corta)
    
    # Lógica de Semántica y Riesgo Simulada para este prototipo (basado en links encontrados)
    estado = "VERDE (Seguro)"
    riesgo = "0%"
    evidencia = "Ninguna"
    accion = "Mantener"

    links_filtrados = [l for l in links if not l.startswith("Error")]
    
    if len(links_filtrados) > 0:
        estado = "ROJO (Filtrada)"
        riesgo = "100%"
        evidencia = " | ".join(links_filtrados)
        accion = "Sustituir"
        
        # Sitios de braindumps muy conocidos
        if "examtopics" in evidencia.lower() or "quizlet" in evidencia.lower() or "certlibrary" in evidencia.lower() or "vce" in evidencia.lower():
            riesgo = "CRÍTICO (100% Braindump)"
            accion = "Eliminar Inmediatamente"

    reporte.append({
        "ID": i,
        "Pregunta": pregunta,
        "Nivel_Exposicion": riesgo,
        "Estado": estado,
        "URLs_Evidencia": evidencia,
        "Accion_Sugerida": accion
    })
    
    # Pausa para no ser bloqueados por el buscador
    time.sleep(2)

# 4. Guardar Reporte
csv_path = "/home/adminetec/.openclaw/workspace/Reporte_Exposicion_ISTQB.csv"
try:
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=["ID", "Pregunta", "Nivel_Exposicion", "Estado", "URLs_Evidencia", "Accion_Sugerida"])
        writer.writeheader()
        writer.writerows(reporte)
    print(f"\n[Fase 4] ¡Reporte Generado con Éxito!")
    print(f"Archivo guardado en: {csv_path}")
except Exception as e:
    print(f"Error al guardar CSV: {e}")

# Imprimir un resumen
print("\n--- RESUMEN DEL PROTOTIPO ---")
for r in reporte:
    texto_corto = r['Pregunta'][:50] + "..." if len(r['Pregunta']) > 50 else r['Pregunta']
    print(f"Q{r['ID']} [{r['Estado']}]: {texto_corto}")
    if "ROJO" in r['Estado']:
        print(f"  └─ Encontrada en: {r['URLs_Evidencia'][:100]}...")
