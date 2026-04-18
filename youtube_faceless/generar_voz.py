#!/usr/bin/env python3
import os
import json
import urllib.request
import time
from pathlib import Path

print("==================================================")
print("🎙️ GENERADOR DE VOZ: ESTOICISMO (ELEVENLABS) 🎙️")
print("==================================================\n")

# CONFIGURACIÓN
ELEVENLABS_API_KEY = "sk_43501899deda5a22252fdec1bb9e9a41b0ec9dc52195254c"
VOICE_ID = "IKne3meq5aSn9XLyUdCD"  # Charlie - Voz natural, profunda y madura de ElevenLabs
OUTPUT_DIR = Path("/home/adminetec/.openclaw/workspace/youtube_faceless/audio")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# EL GUION DIVIDIDO EN PÁRRAFOS PARA NO CORTAR LA API
# (Limpio de notas de producción y acotaciones visuales)
guion_partes = [
    "Hay un proverbio antiguo que dice: Somos dueños de nuestros silencios y esclavos de nuestras palabras. Vivimos en un mundo donde todos gritan sus planes, exhiben sus problemas y exponen su vida entera a extraños. Pero el estoicismo nos enseña algo radicalmente diferente: el verdadero poder, reside en lo que no dices.",
    
    "Séneca y Marco Aurelio sabían que revelar ciertas partes de tu vida te vuelve vulnerable, te quita energía y le da a los demás un control innecesario sobre tu mente. Hoy descubriremos las 7 cosas que, por tu propia paz mental, debes mantener en absoluto secreto a partir de este preciso momento. Número uno.",
    
    "Tus planes más grandes. Cuando cuentas tus grandes proyectos antes de empezarlos, tu cerebro libera dopamina, dándote la misma satisfacción que si ya los hubieras logrado. Esto destruye tu motivación real. Además, invitas la envidia y el escepticismo de los demás. Como diría Epicteto: No hables de tu filosofía, encárnala. Trabaja en silencio. Que tus resultados hagan todo el ruido.",
    
    "Número dos. Tus buenas acciones. El ego humano busca aplausos constantes. Hacemos algo bueno y corremos a publicarlo para recibir validación. El estoico sabe que la verdadera bondad se hace por deber, no por reconocimiento. Si haces un favor y lo presumes, acabas de convertir un acto noble en una simple transacción de relaciones públicas. Ayuda en silencio, y olvida que lo hiciste.",
    
    "Número tres. Los secretos que otros te han confiado. Nada revela más rápido la falta de carácter de una persona que su incapacidad para guardar un secreto ajeno. Un estoico es una fortaleza. Si alguien deposita su confianza en ti, esa información debe morir contigo. Ser un chismoso no te hace interesante, te hace indigno de confianza. Protege el honor de los demás, incluso si ellos no están presentes.",
    
    "Número cuatro. Tus resentimientos y quejas diarias. Marco Aurelio escribió: No pierdas más tiempo discutiendo sobre cómo debe ser un buen hombre. Sé uno. Quejarte del clima o de tu situación financiera no cambia el obstáculo, solo debilita tu mente frente a él. Las quejas constantes te vuelven una víctima a los ojos del mundo y a tus propios ojos. Sufre con dignidad y busca soluciones en silencio.",
    
    "Número cinco. Los detalles de tus finanzas. Ya sea que tengas mucho o muy poco, tu dinero es asunto tuyo. Presumir tu riqueza atrae amistades falsas y envidia. Hablar constantemente de tu pobreza atrae lástima y cierra puertas. La tranquilidad financiera estoica no viene de que los demás sepan cuánto tienes, sino de saber que lo que tienes, es suficiente para ti.",
    
    "Número seis. Las disputas de tu hogar. El fuego de la familia se apaga en casa. Involucrar a extraños en tus conflictos íntimos solo echa más leña al fuego y destruye la lealtad de tu círculo cerrado.",
    
    "Y número siete. Tus prácticas de desarrollo personal. No tienes que decirle al mundo que te levantas a las cinco de la mañana a meditar. Simplemente hazlo. El crecimiento personal es una batalla privada, no un espectáculo público.",
    
    "El silencio no es debilidad. El silencio es control. Es elegir cuidadosamente qué batallas pelear y qué información entregar al mundo. A partir de hoy, sé el dueño absoluto de tus silencios. Si este mensaje resonó contigo, no digas nada... simplemente deja un Me gusta, suscríbete para más sabiduría atemporal, y sigue trabajando en la mejor versión de ti mismo. Hasta la próxima."
]

def generar_audio_elevenlabs(texto, output_path, indice):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    # Configuración de voz optimizada para Documental / Narración seria
    data = {
        "text": texto,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.45,       # Más bajo para más expresividad y emoción
            "similarity_boost": 0.85, # Para mantener el tono grave de la voz original
            "style": 0.15,           # Un toque de dramatismo narrativo
            "use_speaker_boost": True
        }
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req) as response:
            with open(output_path, 'wb') as f:
                f.write(response.read())
        print(f"  ✅ Parte {indice:02d} generada con éxito.")
        return True
    except Exception as e:
        print(f"  ❌ Error en parte {indice:02d}: {e}")
        return False

archivos_generados = []

print("⏳ Conectando con la API de ElevenLabs (Modelo Multilingüe v2)...")
print("🗣️  Voz seleccionada: Charlie (Profunda/Documental)")

for i, parrafo in enumerate(guion_partes, 1):
    archivo_salida = OUTPUT_DIR / f"estoicismo_parte_{i:02d}.mp3"
    
    if generar_audio_elevenlabs(parrafo, archivo_salida, i):
        archivos_generados.append(str(archivo_salida))
    
    # Pausa ligera para no saturar la API
    time.sleep(1)

print(f"\n==================================================")
print(f"🎉 LOCUCIÓN COMPLETADA ({len(archivos_generados)}/10 partes)")
print(f"📁 Guardado en: {OUTPUT_DIR}")
print(f"==================================================")

# Crear una lista para concatenar si se usa ffmpeg después
with open(OUTPUT_DIR / "lista_audios.txt", "w") as f:
    for archivo in archivos_generados:
        f.write(f"file '{os.path.basename(archivo)}'\n")
