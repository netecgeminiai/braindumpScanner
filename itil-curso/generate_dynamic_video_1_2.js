const fs = require('fs');
const path = require('path');
const { EdgeTTS } = require('node-edge-tts');
const { execSync } = require('child_process');
const { createCanvas, registerFont, loadImage } = require('canvas');

const FFMPEG_BIN = '/home/adminetec/.openclaw/workspace/tools/ffmpeg/ffmpeg';
const WORK_DIR = '/home/adminetec/.openclaw/workspace/itil-curso';
const OUT_DIR = path.join(WORK_DIR, 'videos', 'dynamic_video_1_2');
const ASSETS_DIR = path.join(WORK_DIR, 'assets');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Registrar fuente
registerFont('/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf', { family: 'Ubuntu', weight: 'bold' });
registerFont('/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf', { family: 'Ubuntu', weight: 'normal' });

const sections = [
  {
    id: '01_intro_1_2',
    photo: 'photo_1_2_1.jpg',
    text: 'Bienvenidos de vuelta. En el video anterior descubrimos qué es ITIL. Ahora, entraremos de lleno a la estructura de ITIL (versión 5). Este framework no es un bloque único, sino que está compuesto por 7 módulos especializados. Cada uno está diseñado para abordar un área crítica de la gestión digital moderna. Vamos a conocerlos uno por uno.',
    slide: { title: 'Los 7 Módulos', subtitle: 'Estructura de ITIL (versión 5)', bullets: ['Framework modular y flexible', 'Abarca toda la gestión digital', 'Certificaciones especializadas'] }
  },
  {
    id: '02_mod1',
    photo: 'photo_1_2_2.jpg',
    text: 'El primer módulo es Producto ITIL. Aquí aprendemos cómo gestionar todo el ciclo de vida de un producto digital, desde su concepción hasta su retiro. Es ideal para Product Managers y líderes técnicos que necesitan asegurar que lo que construyen realmente resuelva un problema del mercado y genere un retorno de inversión claro.',
    slide: { title: '1. Producto ITIL', subtitle: 'Gestión del Ciclo de Vida', bullets: ['De la concepción al retiro', 'Creación de productos viables', 'Enfoque en el ROI'] }
  },
  {
    id: '03_mod2',
    photo: 'photo_1_2_3.jpg',
    text: 'El segundo módulo es Servicio ITIL. No basta con tener un buen producto, hay que saber entregarlo. Este módulo se enfoca en la provisión, soporte y mejora de los servicios digitales. Aprenderás a estructurar centros de servicio y garantizar que la operación diaria fluya sin interrupciones.',
    slide: { title: '2. Servicio ITIL', subtitle: 'Provisión y Soporte', bullets: ['Entrega continua de valor', 'Gestión de incidentes y soporte', 'Operación sin interrupciones'] }
  },
  {
    id: '04_mod3',
    photo: 'photo_1_2_4.jpg',
    text: 'El tercer módulo es Experiencia ITIL. Hoy en día, la experiencia del usuario lo es todo. Este módulo te enseña a medir, diseñar y optimizar cada punto de contacto entre el cliente y tu tecnología. Porque un servicio técnicamente perfecto no sirve de nada si el usuario lo odia.',
    slide: { title: '3. Experiencia ITIL', subtitle: 'El Usuario al Centro', bullets: ['Diseño de puntos de contacto', 'Medición de la satisfacción', 'Optimización de la interacción'] }
  },
  {
    id: '05_mod4',
    photo: 'photo_1_2_5.jpg',
    text: 'El cuarto módulo es Estrategia ITIL. Aquí subimos de nivel. Este módulo está diseñado para directores y líderes que necesitan alinear la tecnología con los objetivos financieros y estratégicos del negocio. Aprenderás a tomar decisiones de inversión y a evaluar riesgos tecnológicos a gran escala.',
    slide: { title: '4. Estrategia ITIL', subtitle: 'Visión Directiva', bullets: ['Alineación TI y Negocio', 'Decisiones de inversión', 'Gestión de riesgos tecnológicos'] }
  },
  {
    id: '06_mod5',
    photo: 'photo_1_2_6.jpg',
    text: 'El quinto módulo es Transformación ITIL. Cambiar la cultura de una empresa es difícil. Este módulo te da las herramientas para liderar iniciativas de transformación digital masivas, asegurando que las personas, las herramientas y los procesos evolucionen juntos hacia el futuro.',
    slide: { title: '5. Transformación', subtitle: 'Gestión del Cambio Digital', bullets: ['Liderazgo en la transformación', 'Evolución cultural y técnica', 'Nuevas formas de trabajo'] }
  },
  {
    id: '07_mod6',
    photo: 'photo_1_2_7.jpg',
    text: 'El sexto módulo es Prácticas ITIL. Es la caja de herramientas. Aquí se detallan las 34 prácticas de gestión, desde el control de cambios hasta la resolución de incidentes. Es el conocimiento técnico puro que los equipos necesitan para ejecutar el trabajo del día a día con excelencia.',
    slide: { title: '6. Prácticas ITIL', subtitle: 'La Caja de Herramientas', bullets: ['34 prácticas de gestión', 'Ejecución del trabajo diario', 'Excelencia operativa en equipos'] }
  },
  {
    id: '08_mod7',
    photo: 'photo_1_2_8.jpg',
    text: 'Y finalmente, la gran novedad: El séptimo módulo, Gobierno de Inteligencia Artificial en ITIL. La IA ya no es ciencia ficción, es una realidad corporativa. Este módulo te enseña a implementar, gobernar y asegurar éticamente las soluciones de Inteligencia artificial dentro de tus servicios digitales.',
    slide: { title: '7. Gobierno de IA', subtitle: 'El Futuro es Hoy', bullets: ['Implementación corporativa', 'Gobernanza y ética de datos', 'Integración en servicios digitales'] }
  },
  {
    id: '09_cierre_1_2',
    photo: 'photo_1_2_9.jpg',
    text: 'Como ves, ITIL (versión 5) no te obliga a aprenderlo todo de golpe. Puedes certificarte en los módulos que más le sirvan a tu carrera actual. Ya sea que te enfoques en el producto, la experiencia o la inteligencia artificial, ITIL tiene un camino para ti. Nos vemos en la siguiente lección.',
    slide: { title: 'Caminos de Certificación', subtitle: 'Especialízate a tu ritmo', bullets: ['Aprende lo que necesitas', 'Impulsa tu carrera específica', 'Certificaciones internacionales'] }
  }
];

async function createOverlayImage(slideData, outputPath) {
  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 1280, 720);

  const grd = ctx.createLinearGradient(0, 0, 1000, 0);
  grd.addColorStop(0, "rgba(10, 25, 47, 0.95)"); 
  grd.addColorStop(0.5, "rgba(10, 25, 47, 0.85)");
  grd.addColorStop(1, "rgba(10, 25, 47, 0)"); 
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1280, 720);

  ctx.fillStyle = "#64ffda"; 
  ctx.fillRect(0, 0, 15, 720);

  try {
    const logoImg = await loadImage(path.join(ASSETS_DIR, 'netec_logo.png'));
    const ratio = 250 / logoImg.width;
    ctx.drawImage(logoImg, 50, 40, 250, logoImg.height * ratio);
  } catch(e) {
    ctx.fillStyle = "#8892b0";
    ctx.font = 'bold 30px Ubuntu';
    ctx.fillText('ITIL (versión 5)', 50, 70);
  }
  
  ctx.fillStyle = '#ffffff'; 
  ctx.font = 'bold 70px Ubuntu';
  ctx.fillText(slideData.title, 60, 210);

  if (slideData.subtitle) {
    ctx.fillStyle = '#64ffda';
    ctx.font = 'bold 40px Ubuntu';
    ctx.fillText(slideData.subtitle, 60, 280);
  }

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'normal 35px Ubuntu';
  let y = 380;
  slideData.bullets.forEach(bullet => {
    ctx.fillStyle = "#64ffda";
    ctx.fillRect(70, y - 22, 10, 10);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(bullet, 100, y);
    y += 65;
  });

  ctx.fillStyle = '#8892b0';
  ctx.font = 'normal 22px Ubuntu';
  ctx.fillText('Módulo 1 - Los 7 Módulos de ITIL (versión 5)', 50, 680);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

async function run() {
  console.log("🎬 Iniciando generación de Video 1.2...");
  
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
    
    console.log("  - TTS: Generando voz...");
    try {
      if (!fs.existsSync(audioPath)) {
        await tts.ttsPromise(sec.text, audioPath);
      }
    } catch(err) { console.error("Error en TTS:", err); return; }
    
    console.log("  - Visuals: Generando UI (Overlay)...");
    await createOverlayImage(sec.slide, overlayPath);
    
    console.log("  - Compilando clip animado con FFmpeg...");
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
  
  console.log("\nUniendo clips finales...");
  const listPath = path.join(OUT_DIR, 'list.txt');
  fs.writeFileSync(listPath, videoFiles.map(v => `file '${v}'`).join('\n'));
  
  const finalPath = path.join(OUT_DIR, 'VIDEO_1_2_NETEC.mp4');
  try {
    execSync(`"${FFMPEG_BIN}" -y -f concat -safe 0 -i "${listPath}" -c copy "${finalPath}"`, { stdio: 'ignore' });
    console.log(`\n🎉 ¡VIDEO 1.2 GENERADO CON ÉXITO!`);
    console.log(`Ruta: ${finalPath}`);
  } catch(err) { console.error("Error al concatenar:", err.message); }
}

run();