# CORTINILLA ESTÁNDAR (INTRO) PARA VIDEOS DE ITIL v5

**Duración estandarizada:** 00:00 - 00:08 (8 segundos máximo)
**Uso:** Debe insertarse al inicio de TODOS los videos del curso antes de que hable el locutor.

---

## 🎬 ESTRUCTURA DE LA CORTINILLA

### [00:00 - 00:03] APARICIÓN DE LOGOS
**Visual:** 
- Fondo corporativo Netec (Azul oscuro / Blanco).
- Animación de entrada (Fade in / Slide up): Logo de **Netec** (archivo: `NETEC Logotipo (a color) 2.png`).
- Animación secundaria: Logo oficial de **PeopleCert / ITIL®**.
**Audio:**
- Efecto de sonido de transición sutil (Whoosh / Glitch corporativo).
- Inicia música de fondo institucional (Loop optimista/tecnológico) que se desvanecerá (fade out) a volumen bajo durante la narración.

### [00:03 - 00:06] TÍTULO DEL CURSO
**Visual:** 
- Los logos se minimizan hacia las esquinas superiores.
- Aparece en el centro (Tipografía limpia, Sans-serif corporativa): 
  **"Curso Oficial ITIL® Foundation (versión 5)"**
- Debajo, un separador horizontal dinámico.

### [00:06 - 00:08] TÍTULO DEL MÓDULO/VIDEO
**Visual:** 
- El título del curso sube ligeramente.
- Aparece el título específico del video (Ej. *Módulo 1.1: ¿Qué es ITIL?*).
- Transición de barrido (Wipe) hacia la primera diapositiva de contenido del guion.
**Audio:**
- La música corporativa baja su volumen al 10% (ducking) para dar paso a la voz del narrador.

---

## 🔧 ESPECIFICACIONES TÉCNICAS (EQUIPO DE EDICIÓN)

1. **Resolución:** 1920x1080 (1080p) o 4K si es requerido por OpenLMS.
2. **FPS:** 30 o 60 fps (Consistente con el resto del video).
3. **Música:** Licencia Royalty-Free (Ejemplo: AudioJungle / Envato - Estilo "Corporate Tech").
4. **Logos:** Usar SIEMPRE los archivos ubicados en `assets/`:
   - `assets/NETEC Logotipo (a color) 2.png`
   - `assets/netec_logo_transparent.png`
5. **Transición final:** Siempre terminar con un corte limpio o disolvencia suave hacia el primer cuadro del guion principal.

---

*Nota para el equipo de ensamble automático (FFmpeg):* 
Esta cortinilla puede pre-renderizarse como un archivo `.mp4` base (ej. `intro_netec_itil.mp4`) sin el texto del módulo, y luego sobreponer el título del video programáticamente usando filtros de texto de FFmpeg (`drawtext`).
