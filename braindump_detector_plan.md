# Plan: Detector de Braindumps y Exposición de Exámenes (Netec)

## 🎯 Objetivo
Crear una herramienta automatizada que audite bancos de preguntas de certificación (200-1000 preguntas) para detectar si han sido filtradas o expuestas en internet, asegurando la fiabilidad y calidad de las evaluaciones de Netec.

## 📊 Especificaciones del Requerimiento
1. **Entrada:** Archivos Excel (XLSX/CSV) y PDF.
2. **Volumen:** Bancos de 200 a 1000 preguntas por ejecución.
3. **Alcance de búsqueda:**
   - Web abierta (Google/Bing/DuckDuckGo).
   - Sitios sospechosos conocidos (ej. ExamTopics, Quizlet, VCE, foros, Reddit).
4. **Análisis de similitud:**
   - **Búsqueda Exacta:** Para detectar copy-paste literal.
   - **Similitud Semántica (IA):** Para detectar preguntas escritas de memoria o parafraseadas.
5. **Salida:** Reporte en Excel detallando el estado de cada pregunta.

---

## 🛠️ Arquitectura Propuesta (Pipeline)

El sistema operará en 4 fases principales:

### Fase 1: Ingesta y Parsing (Lectura)
- **Para Excel:** Script en Python (`pandas`) que lea las columnas (Ej: ID, Pregunta, Opción A, B, C, D).
- **Para PDF:** Script (`pdfplumber` / OCR) para extraer el texto y estructurarlo usando IA (Claude/GPT) si el formato no es tabular.

### Fase 2: Búsqueda (Scraping/APIs)
- Usar un motor de búsqueda web (ej. *Google Custom Search API* o *DuckDuckGo/SerpApi*) para hacer consultas automatizadas por cada pregunta.
- **Optimización de consultas:**
   - Usar el texto de la pregunta entre comillas (para encontrar copias exactas).
   - Usar las "palabras clave" más importantes de la pregunta (para encontrar parafraseos).
   - Restringir búsquedas a dominios específicos si se tiene una lista de sitios "sospechosos".

### Fase 3: Evaluación de Similitud Semántica (NLP/IA)
- Por cada resultado encontrado en la web, descargar el "snippet" o el texto de la página.
- Usar un modelo de **Embeddings** (ej. *OpenAI embeddings* o un modelo local tipo *SentenceTransformers*) para comparar vectorialmente la pregunta original de Netec vs. el texto encontrado en la web.
- Calcular un **"Score de Exposición"** (0% a 100%):
  - > 90%: Copia casi idéntica (Alerta Roja).
  - 70% - 90%: Parafraseo altamente probable (Alerta Naranja).
  - < 70%: Riesgo bajo/falso positivo (Alerta Verde).

### Fase 4: Reporte y Exportación (Excel)
- Generar un archivo XLSX de salida con:
  - `ID Pregunta`
  - `Texto de la Pregunta`
  - `Nivel de Exposición (Riesgo: Alto/Medio/Bajo)`
  - `Similitud Máxima Encontrada (%)`
  - `URLs Evidencia (Links a los sitios donde se encontró)`
  - `Acción Sugerida` (Reescribir / Eliminar / Mantener)

---

## ⚙️ Stack Tecnológico Sugerido
- **Lenguaje:** Python 3.10+
- **Librerías de Datos:** `pandas`, `openpyxl` (para leer/escribir Excel)
- **Librerías PDF:** `pdfplumber` o `PyMuPDF`
- **Búsquedas Web:** `SerpApi` (Búsqueda de Google) o DuckDuckGo (para prototipo sin costo).
- **Similitud Semántica:** `sentence-transformers` (HuggingFace, gratis y local) o la API de OpenAI/Claude.

---

## 🚧 Desafíos y Consideraciones
1. **Límites de API (Rate Limits):** Buscar 1000 preguntas en Google puede ser bloqueado si se hace muy rápido. Se necesitarán APIs de pago (como SerpApi) o proxies si el volumen es alto.
2. **Extracción de PDFs:** Los PDFs de exámenes a veces tienen formatos irregulares. Se requerirá un buen parser.
3. **Foros cerrados/Telegram:** La herramienta solo puede buscar en la web indexable (pública). No podrá ver dentro de grupos de WhatsApp, Telegram o sitios detrás de muros de pago estrictos.

## 🚀 Plan de Acción Inmediato
1. Crear un **Prototipo Funcional** en Python (MVP) que reciba un CSV de prueba con 5 preguntas, busque en la web y aplique similitud semántica.
2. Generar el reporte Excel de prueba para que Gabriel valide el formato.
3. Escalar la solución para manejar archivos reales y agregar el parser de PDF.