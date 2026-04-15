# Plan: Automatización de Aula ITIL Fundamentos v5 → OpenLMS

## 🎯 Objetivo
Convertir material de ITIL Foundation v5 en videos de 3-10 min para OpenLMS (Spanish, TTS, casual-técnico)

## 📊 Stack Recomendado
- **Python 3** → orquestación principal
- **Claude API** → extracción + generación de scripts
- **ElevenLabs TTS** → narración en español (natural, casual)
- **FFmpeg** → compilación video (audio + visuals)
- **Pillow/ImageMagick** → diapositivas + infografías

## 🔄 Pipeline (MVP)

```
1. EXTRACT (PDF → Contenido)
   └─ Claude parse PDFs
   └─ Identificar módulos/temas
   └─ Extraer estructuras

2. SCRIPT (Contenido → Script)
   └─ Claude genera script (1ª persona, casual)
   └─ Ajustar timing (3-10 min)
   └─ Marcar secciones visuales

3. AUDIO (Script → MP3)
   └─ ElevenLabs TTS
   └─ Voces Spanish (Natural, warm)
   └─ Exportar con timing

4. VISUALS (Script → Slides)
   └─ Generar diapositivas desde script
   └─ Agregar infografías/imágenes
   └─ Timing sincronizado

5. VIDEO (Audio + Visuals → MP4)
   └─ FFmpeg compile
   └─ Video MP4 listo

6. UPLOAD (MP4 → OpenLMS)
   └─ API calls or manual import
   └─ Metadatos (título, duración, módulo)
```

## 📋 Ejemplo: Modulo 1 (Introducción ITIL v5)
- **Duración:** 5-7 min
- **Secciones:**
  1. Intro (30s)
  2. ¿Qué es ITIL? (1.5m)
  3. Historia + Evolución (1.5m)
  4. Framework actual (2m)
  5. Cierre + Resumen (30s)

## 🔑 Decisiones Pendientes
- [ ] Fuente de contenido (¿Dónde están los PDFs?)
- [ ] Estilo de visuals (minimalista, colorido, formal?)
- [ ] OpenLMS API disponible?
- [ ] Budget para ElevenLabs TTS?
- [ ] Estructura de módulos en el aula

## 🚀 Siguiente Paso
**Compartir los PDFs de contenido** para analizar estructura + comenzar prototipo
