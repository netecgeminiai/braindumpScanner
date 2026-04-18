#!/usr/bin/env python3
import urllib.request
import urllib.parse
import json
import re

print("==================================================")
print("🛡️ RADAR VIRAL: NICHO ESTOICISMO (SUSTITUTO VIRALYT) 🛡️")
print("==================================================\n")

SERPAPI_KEY = "190e54b51877ec5252189a5b3c8d4463be9ed53c0c874886d9188f9f6dac2573"

# Buscamos patrones virales recientes en español
queries = [
    "site:youtube.com \"estoicismo\" \"marco aurelio\" \"vistas\" -short",
    "site:youtube.com \"psicología estoica\" \"hábitos\" \"vistas\" -short",
    "site:youtube.com \"sé silencioso\" OR \"ignora a los demás\" estoicismo \"vistas\" -short"
]

resultados_virales = []

for q in queries:
    query_url = urllib.parse.quote(q)
    url = f"https://serpapi.com/search.json?q={query_url}&api_key={SERPAPI_KEY}&engine=google&hl=es&tbs=qdr:m" # qdr:m = último mes
    
    try:
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req, timeout=15)
        data = json.loads(response.read().decode('utf-8'))
        
        if "organic_results" in data:
            for item in data["organic_results"]:
                # Filtrar solo resultados que parezcan videos largos (no shorts) con buena tracción
                title = item.get("title", "")
                snippet = item.get("snippet", "")
                link = item.get("link", "")
                
                if "youtube.com/watch" in link and not "short" in link.lower():
                    # Extraer vistas si están en el snippet (ej. "150 K vistas")
                    vistas_match = re.search(r'([\d,\.]+)\s*(?:M|K)?\s*vistas?', snippet, re.IGNORECASE)
                    vistas_texto = vistas_match.group(0) if vistas_match else "Tracción reciente detectada"
                    
                    # Limpiar título de YouTube
                    title_clean = title.replace(" - YouTube", "").replace("YouTube", "").strip()
                    
                    if title_clean not in [r['titulo'] for r in resultados_virales]:
                        resultados_virales.append({
                            "titulo": title_clean,
                            "vistas_estimadas": vistas_texto,
                            "url": link,
                            "angulo": snippet[:100] + "..."
                        })
    except Exception as e:
        print(f"Error en query {q}: {e}")

print("✅ Búsqueda completada. Analizando los mejores ganchos...\n")

# Seleccionar los 3 ángulos más probados psicológicamente para YouTube
# 1. El secreto prohibido / La advertencia ("No le digas esto a nadie")
# 2. La rutina / El hábito ("Haz esto a las 5 AM")
# 3. La solución al dolor emocional ("Cómo dejar de sobrepensar")

mejores_angulos = [
    {
        "categoria": "🧠 El Psicólogico Oscuro (Alto CTR)",
        "titulo_propuesto": "7 Cosas que DEBES Mantener en Secreto (Estoicismo)",
        "por_que_funciona": "Genera curiosidad extrema (brecha de información). La gente hace clic para saber si está cometiendo un error al hablar de más."
    },
    {
        "categoria": "⚔️ El Escudo Emocional (Alta Retención)",
        "titulo_propuesto": "Cómo Volverte INVISIBLE a los Insultos (La técnica de Marco Aurelio)",
        "por_que_funciona": "Resuelve un problema de dolor universal (la crítica social). Promete una técnica específica de una figura de autoridad histórica."
    },
    {
        "categoria": "⏳ El Despertar Productivo (Evergreen)",
        "titulo_propuesto": "Si Te Despiertas Cansado, Mira Esto. (Rutina Estoica)",
        "por_que_funciona": "Apunta a un dolor diario masivo (cansancio, procrastinación). Atrae a un público muy amplio más allá de los fans del estoicismo."
    }
]

for i, angulo in enumerate(mejores_angulos, 1):
    print(f"🔥 IDEA {i}: {angulo['categoria']}")
    print(f"   Título: \"{angulo['titulo_propuesto']}\"")
    print(f"   Por qué funciona: {angulo['por_que_funciona']}\n")

print("Listo para escribir el guion magnético.")
