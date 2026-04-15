const fs = require('fs');
const path = require('path');
const { EdgeTTS } = require('node-edge-tts');
const { execSync } = require('child_process');
const { createCanvas, registerFont, loadImage } = require('canvas');

const FFMPEG_BIN = '/home/adminetec/.openclaw/workspace/tools/ffmpeg/ffmpeg';
const WORK_DIR = '/home/adminetec/.openclaw/workspace/itil-curso';
const OUT_DIR = path.join(WORK_DIR, 'videos', 'dynamic_video');
const ASSETS_DIR = path.join(WORK_DIR, 'assets');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Registrar fuente
registerFont('/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf', { family: 'Ubuntu', weight: 'bold' });
registerFont('/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf', { family: 'Ubuntu', weight: 'normal' });

const sections = [
  {
    id: '01_intro',
    photo: 'photo_01.jpg',
    text: 'Hola, soy tu guía en este viaje por ITIL Fundamentos. Y la primera pregunta que debes hacerte es: ¿Qué es ITIL y por qué sigue siendo relevante después de 40 años? Spoiler: La respuesta te sorprenderá. En este video vamos a viajar desde 1989 hasta hoy, y entender cómo ITIL evolucionó de una simple librería de infraestructura a un framework que hoy gestiona productos y servicios digitales en empresas mundiales.',
    slide: { title: '¿Qué es ITIL?', subtitle: 'Historia y Evolución', bullets: ['Relevancia después de 40 años', 'De Librería a Framework Global', 'Gestión de Productos Digitales'] }
  },
  {
    id: '02_historia',
    photo: 'photo_02.jpg',
    text: 'Viajemos a 1989, Reino Unido. El gobierno británico enfrentaba un problema común en esa época: caos en la gestión de tecnología. Cada departamento manejaba sus sistemas IT de forma diferente. No había estándar, no había consistencia. Entonces, se hicieron una pregunta simple: ¿Cómo estandarizamos la gestión de TI?',
    slide: { title: 'El Nacimiento (1989)', subtitle: 'Gobierno Británico', bullets: ['Caos en la gestión tecnológica', 'Falta de estándares y consistencia', 'Búsqueda de la estandarización'] }
  },
  {
    id: '03_library',
    photo: 'photo_03.jpg',
    text: 'Y así nació ITIL: IT Infrastructure Library. La palabra "Librería" es clave aquí. Inicialmente, ITIL fue una colección de libros con mejores prácticas para gestionar la infraestructura de TI. Durante los años 90 y 2000, ITIL se convirtió en el estándar mundial. Pero aquí viene lo interesante...',
    slide: { title: 'IT Infrastructure Library', subtitle: 'La primera versión', bullets: ['Colección física de libros', 'Mejores prácticas de infraestructura', 'Se convierte en el estándar mundial'] }
  },
  {
    id: '04_evolucion_1',
    photo: 'photo_04.jpg',
    text: 'ITIL ha evolucionado 4 veces, porque el mundo cambió. Etapa 1, de 1989 a 2000: Gestión de servidores, redes y hardware, con foco en que la tecnología simplemente funcione. Etapa 2, de 2000 a 2010: IT Service Management. Llegan los primeros servicios digitales con un enfoque en procesos y calidad.',
    slide: { title: 'La Evolución (Parte 1)', subtitle: 'Adaptándose al cambio', bullets: ['Etapa 1 (1989-2000): Hardware', 'Foco: "Que funcione"', 'Etapa 2 (2000-2010): Service Management', 'Foco: "Que funcione bien"'] }
  },
  {
    id: '05_evolucion_2',
    photo: 'photo_05.jpg',
    text: 'Etapa 3, de 2010 a 2019: ITIL 4, Valor y Colaboración. Nacen metodologías como Agile y DevOps enfocadas en crear valor. Y finalmente, Etapa 4, año 2026: ITIL v5, Gestión Digital Integral. Hablamos de productos digitales, Inteligencia Artificial y Sostenibilidad. El foco ahora es colaborar con la tecnología para crear impacto real.',
    slide: { title: 'La Evolución (Parte 2)', subtitle: 'Agilidad y Era Digital', bullets: ['Etapa 3 (2010-2019): Valor y Agile', 'Foco: "Que cree valor"', 'Etapa 4 (2026): ITIL v5', 'Foco: IA y Sostenibilidad'] }
  },
  {
    id: '06_hoy',
    photo: 'photo_06.jpg',
    text: 'Hoy en día, todo es digital. Una aplicación móvil, un servicio en la nube, un algoritmo de IA. Y aquí está el punto clave: No es solo TI. Es negocio. Si eres un empresario, un gestor de productos o un profesional de TI, la tecnología define tu éxito y tu capacidad de crear valor.',
    slide: { title: 'Todo es Digital', subtitle: 'La tecnología ES el negocio', bullets: ['Apps, Cloud, Algoritmos de IA', 'Dejó de ser "solo para TI"', 'Define el éxito del negocio'] }
  },
  {
    id: '07_framework',
    photo: 'photo_07.jpg',
    text: 'El nombre dejó de ser "IT Infrastructure Library" hace más de 10 años, pero muchos aún no lo saben. Hoy, ITIL es simplemente un framework para gestionar productos y servicios digitales. Ya no es solo para equipos de TI. Es para todos.',
    slide: { title: 'ITIL en la actualidad', subtitle: 'Gestión de Servicios Digitales', bullets: ['Ya no es "Librería de Infraestructura"', 'Framework integral de gestión', 'Aplicable a todos los departamentos'] }
  },
  {
    id: '08_cierre',
    photo: 'photo_08.jpg',
    text: 'Entonces, ¿Qué es ITIL hoy? Es el lenguaje común que conecta personas, tecnología, socios y procesos. Estudiarlo te abre puertas, te da perspectiva y te hace valioso en el mercado. En el próximo video, exploraremos los 7 módulos de ITIL v5. Gracias por ver. Nos vemos en el siguiente video.',
    slide: { title: '¿Por qué estudiar ITIL?', subtitle: 'Beneficios clave', bullets: ['Te abre puertas globales', 'Te da perspectiva digital', 'Te hace valioso en el mercado'] }
  }
];

async function createOverlayImage(slideData, outputPath) {
  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext('2d');

  // Fondo transparente inicial
  ctx.clearRect(0, 0, 1280, 720);

  // Gradiente semi-transparente izquierdo (crea el efecto panel moderno)
  const grd = ctx.createLinearGradient(0, 0, 1000, 0);
  grd.addColorStop(0, "rgba(10, 25, 47, 0.95)"); // Azul oscuro casi solido
  grd.addColorStop(0.5, "rgba(10, 25, 47, 0.85)");
  grd.addColorStop(1, "rgba(10, 25, 47, 0)"); // Faded edge
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1280, 720);

  // Barra lateral izquierda decorativa
  ctx.fillStyle = "#64ffda"; // Teal accent
  ctx.fillRect(0, 0, 15, 720);

  // Logo de Netec (Si existe)
  try {
    const logoImg = await loadImage(path.join(ASSETS_DIR, 'netec_logo.png'));
    // Dibujar logo escalado (manteniendo aspecto)
    const ratio = 200 / logoImg.width;
    ctx.drawImage(logoImg, 50, 40, 200, logoImg.height * ratio);
  } catch(e) {
    // Fallback texto si no carga el logo
    ctx.fillStyle = "#8892b0";
    ctx.font = 'bold 30px Ubuntu';
    ctx.fillText('ITIL Fundamentos v5', 50, 70);
  }
  
  // Título Principal
  ctx.fillStyle = '#ffffff'; 
  ctx.font = 'bold 70px Ubuntu';
  ctx.fillText(slideData.title, 60, 200);

  // Subtítulo
  if (slideData.subtitle) {
    ctx.fillStyle = '#64ffda';
    ctx.font = 'bold 40px Ubuntu';
    ctx.fillText(slideData.subtitle, 60, 270);
  }

  // Viñetas (Bullets)
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'normal 35px Ubuntu';
  let y = 370;
  slideData.bullets.forEach(bullet => {
    // Viñeta
    ctx.fillStyle = "#64ffda";
    ctx.fillRect(70, y - 22, 10, 10);
    // Texto
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(bullet, 100, y);
    y += 65;
  });

  // Footer / Paginación
  ctx.fillStyle = '#8892b0';
  ctx.font = 'normal 22px Ubuntu';
  ctx.fillText('Módulo 1 - Historia y Evolución', 50, 680);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

async function run() {
  console.log("🎬 Iniciando generación de Video Dinámico (Fotos + Animación + Logos)...");
  
  const videoFiles = [];
  const tts = new EdgeTTS({ voice: 'es-MX-JorgeNeural', lang: 'es-MX', outputFormat: 'audio-24khz-48kbitrate-mono-mp3' });
  
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    console.log(`\nProcesando [${i + 1}/${sections.length}]: ${sec.id}`);
    
    const audioPath = path.join(OUT_DIR, `${sec.id}.mp3`);
    const overlayPath = path.join(OUT_DIR, `${sec.id}_ui.png`);
    const videoPath = path.join(OUT_DIR, `${sec.id}.mp4`);
    const photoPath = path.join(ASSETS_DIR, sec.photo);
    videoFiles.push(videoPath);
    
    // 1. Crear Audio
    console.log("  - TTS: Generando voz...");
    try {
      if (!fs.existsSync(audioPath)) {
        await tts.ttsPromise(sec.text, audioPath);
      }
    } catch(err) { console.error("Error en TTS:", err); return; }
    
    // 2. Crear Overlay Transparente (UI)
    console.log("  - Visuals: Generando UI (Overlay)...");
    await createOverlayImage(sec.slide, overlayPath);
    
    // 3. Crear Clip de Video Animado (Fondo Ken Burns + UI Overlay + Audio)
    console.log("  - Compilando clip animado con FFmpeg...");
    
    // FFmpeg Filtergraph explanation:
    // [0:v] -> scale/crop y aplica zoompan para acercar la foto lentamente (movimiento dinámico). Colorize oscuro para dejar leer.
    // [1:v] -> overlay de la UI (títulos/logo) encima del video animado.
    // fade -> añade un leve fade-in en el primer segundo del clip.
    const filtergraph = `
      [0:v]scale=1280x720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='min(zoom+0.0015,1.5)':d=1000:s=1280x720,eq=brightness=-0.1:saturation=0.8[bg];
      [bg][1:v]overlay=0:0[outv]
    `;

    const ffmpegCmd = `"${FFMPEG_BIN}" -y \
      -i "${photoPath}" \
      -loop 1 -i "${overlayPath}" \
      -i "${audioPath}" \
      -filter_complex "${filtergraph}" \
      -map "[outv]" -map 2:a \
      -c:v libx264 -pix_fmt yuv420p -tune stillimage \
      -c:a aac -b:a 192k \
      -shortest "${videoPath}"`;
      
    try { 
      execSync(ffmpegCmd, { stdio: 'ignore' }); 
      console.log("  - OK!");
    } 
    catch(err) { console.error("Error FFmpeg:", err.message); }
  }
  
  // 4. Unir clips
  console.log("\nUniendo clips finales...");
  const listPath = path.join(OUT_DIR, 'list.txt');
  fs.writeFileSync(listPath, videoFiles.map(v => `file '${v}'`).join('\n'));
  
  const finalPath = path.join(OUT_DIR, 'VIDEO_1_1_NETEC.mp4');
  try {
    execSync(`"${FFMPEG_BIN}" -y -f concat -safe 0 -i "${listPath}" -c copy "${finalPath}"`, { stdio: 'ignore' });
    console.log(`\n🎉 ¡VIDEO DINÁMICO GENERADO CON ÉXITO!`);
    console.log(`Ruta: ${finalPath}`);
  } catch(err) { console.error("Error al concatenar:", err.message); }
}

run();