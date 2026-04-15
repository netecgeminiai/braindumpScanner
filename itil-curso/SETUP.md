# Setup: Integración Completa ITIL v5 → OpenLMS

## 🎯 Resumen
El prototipo `video_generator.py` convierte contenido ITIL → videos MP4 listos para OpenLMS.

## 📋 Pipeline Actual

```
PDF (ITIL_FND_Version5_OfficialBook_ES_wtmd.pdf)
    ↓
[1] EXTRACTOR → Extrae módulos/temas
    ↓
[2] SCRIPT GENERATOR → Genera scripts (1ª persona, casual)
    ↓
[3] AUDIO GENERATOR → TTS (ElevenLabs) → MP3
    ↓
[4] VISUAL GENERATOR → Crea diapositivas PNG
    ↓
[5] VIDEO COMPILER → FFmpeg (Audio + Visuals) → MP4
    ↓
[6] OPENLMS UPLOADER → Carga videos al LMS
```

---

## 🔧 Configuración (Pasos para Producción)

### 1️⃣ Instalar Dependencias

```bash
# Extraer PDFs
pip install pdfplumber PyPDF2

# TTS (ElevenLabs)
pip install elevenlabs

# Generación de imágenes
pip install Pillow pillow-heif

# Video
pip install opencv-python imageio-ffmpeg

# OpenLMS API
pip install requests

# Otras
pip install python-dotenv
```

### 2️⃣ Variables de Entorno (.env)

```bash
# ElevenLabs (TTS)
ELEVENLABS_API_KEY=sk_xxx...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Rachel (español natural)

# OpenLMS
OPENLMS_URL=https://tuaula.openlms.com
OPENLMS_API_KEY=token_xxx...
OPENLMS_COURSE_ID=12345

# Procesamiento
FFMPEG_PATH=/usr/bin/ffmpeg
MAX_VIDEO_RESOLUTION=1080p
AUDIO_BITRATE=128k
```

### 3️⃣ Actualizar `video_generator.py`

Reemplazar los métodos `generate()` con llamadas reales:

#### A. AudioGenerator (ElevenLabs TTS)

```python
def generate(self, script):
    """Genera audio con ElevenLabs"""
    from elevenlabs import generate, stream
    
    audio_file = self.output_dir / f"{script['module_id']}_audio.mp3"
    
    # Concatenar todo el texto
    full_text = " ".join([s["text"] for s in script["sections"]])
    
    # Generar audio
    audio = generate(
        text=full_text,
        voice=os.getenv("ELEVENLABS_VOICE_ID"),
        model="eleven_monolingual_v1"
    )
    
    # Guardar
    with open(audio_file, 'wb') as f:
        f.write(audio)
    
    return str(audio_file)
```

#### B. VisualGenerator (Pillow + Matplotlib)

```python
def generate(self, script):
    """Genera slides con Pillow"""
    from PIL import Image, ImageDraw, ImageFont
    
    visuals = []
    
    for i, section in enumerate(script["sections"]):
        # Crear imagen
        img = Image.new('RGB', (1920, 1080), color='white')
        draw = ImageDraw.Draw(img)
        
        # Agregar texto
        draw.text(
            (960, 540),
            section.get("text", ""),
            fill='black',
            anchor="mm"
        )
        
        # Guardar
        slide_file = self.output_dir / f"{script['module_id']}_slide_{i:02d}.png"
        img.save(slide_file)
        
        visuals.append({
            "file": str(slide_file),
            "duration": section["duration"]
        })
    
    return visuals
```

#### C. VideoCompiler (FFmpeg)

```python
def compile(self, script, audio_file, visuals):
    """Compila con FFmpeg"""
    import subprocess
    
    output_file = self.output_dir / f"{script['module_id']}_video.mp4"
    
    # Crear lista de imágenes
    concat_file = self.output_dir / f"{script['module_id']}_concat.txt"
    with open(concat_file, 'w') as f:
        for visual in visuals:
            duration = int(visual["duration"] * 60)  # segundos
            f.write(f"file '{visual['file']}'\nduration {duration}\n")
    
    # Ejecutar FFmpeg
    cmd = [
        "ffmpeg",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_file),
        "-i", audio_file,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-shortest",
        str(output_file)
    ]
    
    subprocess.run(cmd, check=True)
    return str(output_file)
```

#### D. OpenLMSUploader (API REST)

```python
def upload(self, video_file, metadata):
    """Carga a OpenLMS"""
    import requests
    
    with open(video_file, 'rb') as f:
        files = {'video': f}
        response = requests.post(
            f"{self.lms_url}/api/v1/courses/{os.getenv('OPENLMS_COURSE_ID')}/videos",
            headers={"Authorization": f"Bearer {self.api_key}"},
            files=files,
            json=metadata
        )
    
    if response.status_code == 201:
        print(f"✓ Video subido: {response.json()['id']}")
    else:
        print(f"✗ Error: {response.status_code} - {response.text}")
```

---

## 🚀 Uso

### Opción A: Procesar Todo

```bash
python3 video_generator.py
```

Genera 3 módulos × 5-8 minutos = ~20 minutos de contenido.

### Opción B: Procesar Específico

```python
from video_generator import ITILVideoOrchestrator

orchestrator = ITILVideoOrchestrator(pdf_path="path/to/ITIL.pdf")

# Procesar módulo 1 solo
module = {
    "id": "M1",
    "title": "Introducción",
    "duration_min": 7,
    "topics": ["¿Qué es ITIL?", "Historia"]
}

video = orchestrator.process_module(module, upload_to_lms=True)
```

---

## 📊 Estimaciones de Tiempo

| Tarea | Tiempo | Notas |
|-------|--------|-------|
| Extractar PDF | 5 min | Depende del tamaño |
| Generar 1 script | 1 min | AI automático |
| Generar 1 audio TTS | 5 min | ElevenLabs (tiempo real) |
| Generar visuals | 2 min | Pillow (local) |
| Compilar 1 video | 10 min | FFmpeg (H.264) |
| **Total por módulo** | ~25 min | 1 video de 7 min |
| **3 módulos** | ~75 min | 3 videos listos |

---

## ✨ Mejoras Futuras

- [ ] Agregar **watermarks** (logo Netec)
- [ ] Incluir **captions automáticas** (Whisper AI)
- [ ] **Animaciones** en transiciones (Manim)
- [ ] **Glosario interactivo** en OpenLMS
- [ ] **Quizzes automáticos** basados en script
- [ ] **Subtítulos en inglés** (traducción automática)
- [ ] **Temas de colores** personalizables
- [ ] **Estadísticas de visualización** desde OpenLMS

---

## 🔍 Archivos Importantes

```
itil-curso/
├── video_generator.py       ← Pipeline principal
├── PLAN.md                  ← Arquitectura
├── SETUP.md                 ← Este archivo
├── videos/
│   ├── audio/               ← MP3 generados
│   ├── visuals/             ← PNG slides
│   ├── output/              ← MP4 finales
│   └── config.json          ← Metadatos
└── .env                     ← Variables de entorno (no versionar)
```

---

## 🆘 Troubleshooting

**Problema:** "ElevenLabs API key inválida"
```
✓ Solución: Verificar ELEVENLABS_API_KEY en .env
```

**Problema:** "FFmpeg no encontrado"
```
# Linux
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
choco install ffmpeg
```

**Problema:** "OpenLMS API rechaza videos"
```
✓ Verificar formato: MP4 H.264, AAC audio
✓ Tamaño máximo: Consultar configuración LMS
✓ Permisos: Bearer token válido
```

---

## 📞 Próximos Pasos

1. **Subir el PDF oficial** de ITIL v5 (cuando llegue)
2. **Configurar credenciales** (ElevenLabs, OpenLMS)
3. **Personalizar estilos** (colores, fuentes, logo)
4. **Generar 1 video de prueba** (M1)
5. **Validar en OpenLMS** (reproducción, metadatos)
6. **Escalar a todos los módulos**

¿Listo para empezar? 🚀
