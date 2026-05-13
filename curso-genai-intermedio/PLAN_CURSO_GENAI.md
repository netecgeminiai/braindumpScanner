
==================================================
🗺️ MAPA GENERAL DEL CURSO: IA GENERATIVA INTERMEDIO
==================================================

📋 INFORMACIÓN DEL CURSO
- Audiencia: Desarrolladores de Software
- Nivel: Intermedio (Requiere conocimientos de Python)
- Enfoque: Hands-on (Código, Arquitectura, APIs, RAG, Agentes)
- Estilo Visual Propuesto: Dark Mode (IDE VS Code style), fragmentos de código en pantalla.

--------------------------------------------------
ESTRUCTURA DE CAPÍTULOS Y MÓDULOS (Extraída del Syllabus Oficial)
--------------------------------------------------

Inteligencia
 Artificial 
Generativa
Intermediate
Curso diseñado para desarrolladores. 
Se aborda 
el uso de interfaces de chat a la arquitectura de sistemas, consumo de 
APIs
, implementación de RA
G
, orquestación de agentes y despliegue escalable de soluciones en producción.
Objetivos del curso
Construir aplicaciones consumiendo 
APIs
 de modelos 
como 
OpenAI
 y 
Gemini.
Implementar arquitecturas de recuperación de información (RAG) y persistencia vectorial.
Desarrollar y desplegar agentes autónomos orquestados con Python y protocolos modernos.
Perfil de audiencia
Usuarios
 que desean construir, integrar, evaluar y desplegar soluciones
con IA generativa
.
Prerrequisitos
Haber tomado el curso IA GEN ESS
Programación en Python
ESQUEMA DEL CURSO
CAPÍTULO 1: DE USUARIO AVANZADO A ARQUITECTO GenAI
Transicionar
 del uso consciente de IA a la toma de decisiones técnicas sobre modelos, proveedores, costos y arquitecturas.
Módulo 1: Ecosistema y Estrategia de Selección de Modelos
Objetivo: Comparar modelos comerciales y open 
source
 para seleccionar la opción adecuada según costos, control, privacidad y despliegue.
Modelos comerciales vs. Open 
Source
 (GPT, Gemini, Claude, Llama)
Hugging
Face
 como 
Hub
Rol de los proveedores 
cloud
 (Azure, AWS, GCP)
Análisis de Costo-Beneficio de Tokens (latencia vs. ventana de contexto vs. precio).
Práctica: Desarrollar un script 
en Python 
que evalúe y compare automáticamente el costo estimado de procesar un 
dataset
 específico entre 
OpenAI
, Gemini y 
Anthropic
.
Módulo 2: Arquitectura Moderna de Soluciones GenAI
Objetivo: Diseñar arquitecturas GenAI considerando modelos, contexto, agentes y despliegue.
Componentes de una solución GenAI
Backend con Python 
Patrones arquitectónicos
Identificación de riesgos y cuellos de botella técnicos.
Práctica: Crear el 
boilerplate
 de una arquitectura en 
FastAPI
 que implemente un "
Router
 de Modelos" para optimizar la carga de trabajo según la complejidad del 
prompt
.
CAPÍTULO 2: CONSUMO DE APIS Y GENERACIÓN DE CÓDIGO
Implementar soluciones GenAI mediante 
APIs
 y utilizar la IA como apoyo real en el ciclo de vida del desarrollo.
Módulo 3: Consumo de 
APIs
 de 
OpenAI
 y Gemini con Python
Objetivo: Consumir modelos vía API y controlar su comportamiento determinista desde código.
Uso de 
SDKs
Manejo de 
prompts
 como código
Control de parámetros (
Temperature
, Top-p)
Manejo de errores y límites de tasa (Rate 
Limits
).
Práctica: Implementar un cliente Python asíncrono con 
Pydantic
 para forzar respuestas estructuradas y manejo de reintentos exponenciales.
Módulo 4: Generación y Asistencia de Código con IA
Objetivo: Usar IA como asistente para escribir, revisar, refactorizar y auditar código.
OpenAI
 Codex, 
GitHub Copilot, 
Google AI Studio y Claude para revisión de código
Riesgos de seguridad y auditoría de calidad de código generado.
Práctica: Configurar un pipeline de revisión automática que utilice un LLM para realizar auditorías de seguridad en 
commits
 de código Python.
CAPÍTULO 3: CONTEXTO, RAG Y PERSISTENCIA
Gestionar el contexto, la memoria a largo plazo y la recuperación de información externa.
Módulo 5: RAG Moderno y Construcción de Asistentes
Objetivo: Implementar asistentes con recuperación de información relevante (
Retrieval
Augmented
Generation
).
RAG 
Estrategias de 
Chunking
 y 
Embeddings
UltraRAG
Riesgos y límites.
Práctica: Construir un pipeline de ingesta con 
Semantic
Chunking
 para un asistente que responda sobre una base documental técnica de 
PDFs
.
Módulo 6: Bases de Datos para Soluciones GenAI
Objetivo: Seleccionar e integrar bases de datos adecuadas para contexto y almacenamiento vectorial.
Bases tradicionales para logs
Bases vectoriales (
Pinecone
, FAISS, Chroma)
Trade-offs
 de almacenamiento.
Práctica: Desarrollar una aplicación que integre 
ChromaDB
 para persistir conversaciones y recuperar contexto mediante búsquedas semánticas.
CAPÍTULO 4: ESPECIALIZACIÓN DE MODELOS (FINE-TUNING)
Comprender cuándo y cómo aplicar el ajuste fino de modelos frente a la arquitectura RAG.
Módulo 7: Fine-Tuning de Modelos Generativos
Objetivo: Aplicar fine-
tuning
 de forma informada y evaluar su impacto técnico y económico.
Fine-
tuning
 vs. RAG
Preparación de 
datasets
 (JSONL)
Entrenamiento, validación y costos computacionales
Herramientas comerciales y Open 
Source
.
Práctica: Script de preprocesamiento de datos para convertir una base de datos de preguntas y respuestas en un 
dataset
 validado para fine-
tuning
.
CAPÍTULO 5: AGENTIC AI Y ORQUESTACIÓN AVANZADA
Diseñar agentes inteligentes capaces de razonar y ejecutar herramientas externas.
Módulo 8: 
Agentic
 AI y Orquestación con Python
Objetivo: Implementar flujos 
agentic
 (basados en agentes) controlados y reutilizables.
Agentes
 vs. Workflows
Function Calling
Interacción Humano-IA
Frameworks
 (
LangGraph
, 
CrewAI
).
Práctica: Implementar un agente con 
Function
Calling
 que acceda a una API externa o función local para resolver tareas matemáticas o de consulta de datos.
Módulo 9: Model 
Context
Protocol
 (MCP)
Objetivo: Separar modelo, contexto y herramientas mediante el estándar MCP para soluciones escalables.
Arquitectura MCP
Casos de uso
Integración con agentes.
Práctica: Desarrollar un Servidor MCP en Python que permita a un agente interactuar de forma segura con 
un
 sistema de archivos.
CAPÍTULO 6: EVALUACIÓN, CALIDAD Y OBSERVABILIDAD
Medir, monitorear y asegurar la calidad de las soluciones GenAI en producción.
Módulo 10: Medición de Calidad en Respuestas
Objetivo: Aplicar métricas cuantitativas y cualitativas para evaluar resultados.
ROUGE, BLEU y métricas basadas en IA (G-Eval)
Evaluación con Python.
Práctica: Crear un script que evalúe la fidelidad de las respuestas de un 
chatbot
 comparándolas contra un "Golden 
Dataset
" 
Módulo 11: 
Observabilidad
 y Evaluación en Operación
Objetivo: Monitorear y auditar soluciones GenAI en tiempo real.
Evaluación de consistencia
Introducción a 
LangSmith
Análisis de regresiones.
Práctica: Instrumentar una cadena de 
LangChain
 con 
LangSmith
 para identificar cuellos de botella y errores en el flujo de pensamiento de un agente.
CAPÍTULO 7: DESPLIEGUE Y PROYECTO FINAL
Desplegar soluciones GenAI de forma segura, escalable y eficiente en la nube.
Módulo 12: Despliegue de Soluciones GenAI en la Nube
Objetivo: Diseñar arquitecturas de despliegue productivo.
Cloud (Azure, AWS, GCP)
Contenedores (Docker)
Seguridad (P
rompt
Injection
 Defense)
Escalabilidad.
Práctica: Crear un 
Dockerfile
 para una solución GenAI y diseñar el esquema de seguridad de los secretos y 
APIs
.
Módulo 13: Proyecto Integrador Técnico
Desarrollo de un sistema completo: API + RAG avanzado + Agente funcional + Métricas de evaluación + Documentación técnica.
Debido a las constantes actualizaciones de los contenidos de los cursos por parte del fabricante, el contenido de este temario puede variar con respecto al publicado en el sitio oficial, sin embargo, Netec siempre entregará la versión actualizada de éste. 

--------------------------------------------------
PROPUESTA DE DIVISIÓN POR VIDEOS (MICRO-LEARNING)
--------------------------------------------------

🟣 CAPÍTULO 1: DE USUARIO AVANZADO A ARQUITECTO GenAI
  - V1.1: El Ecosistema Actual: Modelos Comerciales vs Open Source (4 min)
  - V1.2: Anatomía del Costo: Tokens, Latencia y Contexto (5 min)
  - V1.3: Arquitectura Moderna GenAI: Componentes y Patrones (5 min)
  - V1.4: [Laboratorio] Creando un Router de Modelos con FastAPI (6 min)
  ▶ Subtotal: 4 Videos

🔵 CAPÍTULO 2: CONSUMO DE APIS Y GENERACIÓN DE CÓDIGO
  - V2.1: Integrando OpenAI y Gemini en Python: SDKs y Control (4 min)
  - V2.2: Manejo de Errores, Rate Limits y Pydantic (5 min)
  - V2.3: IA como Asistente de Desarrollo (Copilot, Code Review) (4 min)
  - V2.4: [Laboratorio] Pipeline de Auditoría de Seguridad de Código (6 min)
  ▶ Subtotal: 4 Videos

🟢 CAPÍTULO 3: RAG (RETRIEVAL-AUGMENTED GENERATION)
  - V3.1: Arquitectura RAG: Superando los límites del LLM (4 min)
  - V3.2: Embeddings y Bases de Datos Vectoriales (Pinecone, Chroma) (5 min)
  - V3.3: Estrategias de Chunking y Búsqueda Semántica (5 min)
  - V3.4: [Laboratorio] Construyendo un Chatbot corporativo con RAG (6 min)
  ▶ Subtotal: 4 Videos

🟠 CAPÍTULO 4: ORQUESTACIÓN Y AGENTES AUTÓNOMOS
  - V4.1: Frameworks de Orquestación: LangChain vs LlamaIndex (5 min)
  - V4.2: Diseño de Agentes Autónomos y Herramientas (Tools) (5 min)
  - V4.3: [Laboratorio] Desarrollando un Agente con acceso a Base de Datos (6 min)
  ▶ Subtotal: 3 Videos

==================================================
📊 TOTALES DEL CURSO
- Total de Capítulos: 4
- Total de Videos Proyectados: 15
- Laboratorios Prácticos (Hands-on): 4
- Duración Promedio: ~5 minutos por video
- Duración Total Estimada: ~75 minutos de contenido altamente técnico
==================================================
