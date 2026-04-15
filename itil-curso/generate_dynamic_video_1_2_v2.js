const fs = require('fs');
const path = require('path');
const { EdgeTTS } = require('node-edge-tts');
const { execSync } = require('child_process');
const { createCanvas, registerFont, loadImage } = require('canvas');

const FFMPEG_BIN = '/home/adminetec/.openclaw/workspace/tools/ffmpeg/ffmpeg';
const WORK_DIR = '/home/adminetec/.openclaw/workspace/itil-curso';
const OUT_DIR = path.join(WORK_DIR, 'videos', 'dynamic_video_1_2_v2');
const ASSETS_DIR = path.join(WORK_DIR, 'assets');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

registerFont('/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf', { family: 'Ubuntu', weight: 'bold' });
registerFont('/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf', { family: 'Ubuntu', weight: 'normal' });

const sections = [
  {
    id: '01_intro_1_2',
    photo: 'photo_1_2_1.jpg', // Usamos el fondo animado
    text: 'Bienvenidos de vuelta. En este momento estás tomando el curso de Fundamentos, que es tu puerta de entrada. Sin embargo, para no confundirnos, es crucial entender que el track completo de certificación de ITIL (versión 5) está compuesto por 7 cursos especializados posteriores. Cada curso profundiza en un área crítica de la gestión digital.',
    slide: { title: 'El Track de Certificación', subtitle: 'Fundamentos vs Especialidades', bullets: ['Fundamentos: Tu punto de partida', '7 Cursos especializados posteriores', 'Abarcan toda la gestión digital'] },
    isScheme: true
  },
  {
    id: '02_curso1',
    photo: 'photo_1_2_2.jpg',
    text: 'El primer curso especializado es Producto ITIL. Aquí aprenderás a gestionar el ciclo de vida completo de un producto digital, desde que es una idea hasta que se retira del mercado. Está pensado para Product Managers que necesitan asegurar el retorno de inversión.',
    slide: { title: 'Curso 1: Producto ITIL', subtitle: 'Gestión del Ciclo de Vida', bullets: ['De la idea al retiro', 'Creación de productos viables', 'Enfoque en el ROI'] },
    courseCover: { title: 'PRODUCTO', color: '#E84C3D' }
  },
  {
    id: '03_curso2',
    photo: 'photo_1_2_3.jpg',
    text: 'El segundo curso es Servicio ITIL. Aquí el enfoque cambia a cómo entregas ese producto. Se centra en la provisión, el soporte y la operación diaria para garantizar que los servicios fluyan sin interrupciones.',
    slide: { title: 'Curso 2: Servicio ITIL', subtitle: 'Provisión y Soporte', bullets: ['Entrega continua de valor', 'Gestión de incidentes', 'Operación fluida'] },
    courseCover: { title: 'SERVICIO', color: '#3498DB' }
  },
  {
    id: '04_curso3',
    photo: 'photo_1_2_4.jpg',
    text: 'El tercer curso es Experiencia ITIL. Un servicio perfecto no sirve si el usuario final lo odia. Este curso te enseña a diseñar y medir cada punto de contacto para garantizar la máxima satisfacción del cliente.',
    slide: { title: 'Curso 3: Experiencia ITIL', subtitle: 'El Usuario al Centro', bullets: ['Diseño de puntos de contacto', 'Medición de satisfacción', 'Optimización continua'] },
    courseCover: { title: 'EXPERIENCIA', color: '#9B59B6' }
  },
  {
    id: '05_curso4',
    photo: 'photo_1_2_5.jpg',
    text: 'El cuarto curso es Estrategia ITIL. Diseñado para líderes y directores, este curso te enseña a alinear la tecnología con los objetivos financieros del negocio y a tomar decisiones de inversión inteligentes.',
    slide: { title: 'Curso 4: Estrategia ITIL', subtitle: 'Visión Directiva', bullets: ['Alineación TI y Negocio', 'Decisiones de inversión', 'Gestión de riesgos'] },
    courseCover: { title: 'ESTRATEGIA', color: '#34495E' }
  },
  {
    id: '06_curso5',
    photo: 'photo_1_2_6.jpg',
    text: 'El quinto curso es Transformación ITIL. Cambiar la cultura organizacional es el mayor reto. Este curso te prepara para liderar iniciativas de transformación digital masivas en tu empresa.',
    slide: { title: 'Curso 5: Transformación', subtitle: 'Gestión del Cambio Digital', bullets: ['Liderazgo transformacional', 'Evolución cultural', 'Nuevas formas de trabajo'] },
    courseCover: { title: 'TRANSFORMACIÓN', color: '#F1C40F' }
  },
  {
    id: '07_curso6',
    photo: 'photo_1_2_7.jpg',
    text: 'El sexto curso es Prácticas ITIL. Es la caja de herramientas técnicas con las 34 prácticas de gestión detalladas que los equipos necesitan para ejecutar el trabajo diario con excelencia.',
    slide: { title: 'Curso 6: Prácticas ITIL', subtitle: 'La Caja de Herramientas', bullets: ['34 prácticas detalladas', 'Ejecución del trabajo diario', 'Excelencia operativa'] },
    courseCover: { title: 'PRÁCTICAS', color: '#E67E22' }
  },
  {
    id: '08_curso7',
    photo: 'photo_1_2_8.jpg',
    text: 'El séptimo curso es Gobierno de IA en ITIL. Te enseña a implementar, gobernar y asegurar éticamente las soluciones de Inteligencia Artificial dentro de los servicios digitales de tu organización.',
    slide: { title: 'Curso 7: Gobierno de IA', subtitle: 'El Futuro es Hoy', bullets: ['Implementación corporativa', 'Gobernanza ética de datos', 'IA en servicios digitales'] },
    courseCover: { title: 'GOBIERNO DE IA', color: '#1ABC9C' }
  },
  {
    id: '09_cierre_1_2',
    photo: 'photo_1_2_9.jpg',
    text: 'Como puedes ver, el esquema completo de ITIL (versión 5) te permite especializarte. Empiezas con Fundamentos, y luego eliges los cursos que más le sirvan a tu carrera. ¡Nos vemos en la siguiente lección!',
    slide: { title: 'Esquema de Certificación', subtitle: 'Tu ruta profesional', bullets: ['Inicia con Fundamentos', 'Elige tu especialidad', 'Certificaciones internacionales'] },
    isScheme: true
  }
];

function drawCourseCover(ctx, x, y, coverData) {
  // Draw a 3D looking book/box
  const width = 280;
  const height = 400;
  
  // Sombra
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(x + 15, y + 15, width, height);

  // Lomo del libro
  ctx.fillStyle = '#bdc3c7';
  ctx.beginPath();
  ctx.moveTo(x - 20, y + 10);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x - 20, y + height + 10);
  ctx.fill();

  // Portada frontal
  ctx.fillStyle = coverData.color;
  ctx.fillRect(x, y, width, height);

  // Header de la portada
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(x, y, width, 80);

  // Textos de la portada
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Ubuntu';
  ctx.fillText('ITIL (versión 5)', x + 20, y + 40);
  ctx.font = 'normal 16px Ubuntu';
  ctx.fillText('CURSO OFICIAL', x + 20, y + 65);

  ctx.font = 'bold 32px Ubuntu';
  // Wrap text simply
  const words = coverData.title.split(' ');
  let lineY = y + 150;
  words.forEach(w => {
    ctx.fillText(w, x + 20, lineY);
    lineY += 40;
  });

  // Footer portada
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 20, y + height - 50, 40, 5);
}

function drawScheme(ctx, x, y) {
  // Draw a hierarchy scheme
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(x, y, 450, 500);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Ubuntu';
  ctx.fillText('ESQUEMA ITIL (versión 5)', x + 30, y + 50);

  // Base
  ctx.fillStyle = '#E84C3D';
  ctx.fillRect(x + 50, y + 400, 350, 60);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Ubuntu';
  ctx.fillText('FUNDAMENTOS', x + 130, y + 438);

  // Arrow up
  ctx.fillStyle = '#ffffff';
  ctx.fillText('↑', x + 215, y + 380);

  // Cursos Especializados (dibujar cajitas)
  const colors = ['#E84C3D', '#3498DB', '#9B59B6', '#34495E', '#F1C40F', '#E67E22', '#1ABC9C'];
  let cy = y + 100;
  let cx = x + 30;
  for(let i=0; i<7; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(cx, cy, 180, 35);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Ubuntu';
    ctx.fillText(`CURSO ${i+1}`, cx + 60, cy + 22);
    
    cx += 190;
    if (cx > x + 300) {
      cx = x + 30;
      cy += 45;
    }
  }
}

async function createOverlayImage(slideData, outputPath, isScheme, courseCover) {
  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 1280, 720);

  // UI panel left
  const grd = ctx.createLinearGradient(0, 0, 900, 0);
  grd.addColorStop(0, "rgba(10, 25, 47, 0.95)"); 
  grd.addColorStop(0.6, "rgba(10, 25, 47, 0.85)");
  grd.addColorStop(1, "rgba(10, 25, 47, 0)"); 
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1280, 720);

  ctx.fillStyle = "#64ffda"; 
  ctx.fillRect(0, 0, 15, 720);

  // Título Principal
  ctx.fillStyle = '#ffffff'; 
  ctx.font = 'bold 65px Ubuntu';
  ctx.fillText(slideData.title, 60, 210);

  if (slideData.subtitle) {
    ctx.fillStyle = '#64ffda';
    ctx.font = 'bold 35px Ubuntu';
    ctx.fillText(slideData.subtitle, 60, 280);
  }

  // Viñetas
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'normal 30px Ubuntu';
  let yPos = 380;
  slideData.bullets.forEach(bullet => {
    ctx.fillStyle = "#64ffda";
    ctx.fillRect(70, yPos - 20, 10, 10);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(bullet, 100, yPos);
    yPos += 60;
  });

  // Footer inferior izquierdo
  ctx.fillStyle = '#8892b0';
  ctx.font = 'normal 22px Ubuntu';
  ctx.fillText('Módulo 1 - Los 7 Cursos de ITIL (versión 5)', 50, 680);

  // Logo de Netec (Arriba a la DERECHA, SIN FONDO BLANCO)
  try {
    const logoImg = await loadImage(path.join(ASSETS_DIR, 'netec_logo_transparent.png'));
    const targetWidth = 250;
    const ratio = targetWidth / logoImg.width;
    const targetHeight = logoImg.height * ratio;
    // Posicionamos a la derecha (1280 - 250 - 50 margen = 980)
    ctx.drawImage(logoImg, 980, 40, targetWidth, targetHeight);
  } catch(e) {
    console.log("No se pudo cargar el logo transparente:", e.message);
  }

  // Dibujar en el espacio derecho (portada del curso o esquema)
  if (courseCover) {
    drawCourseCover(ctx, 880, 200, courseCover);
  } else if (isScheme) {
    drawScheme(ctx, 780, 150);
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

async function run() {
  console.log("🎬 Iniciando generación de Video 1.2 v2 (Logos arreglados y Portadas)...");
  
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
    
    console.log("  - TTS...");
    try {
      if (!fs.existsSync(audioPath)) {
        await tts.ttsPromise(sec.text, audioPath);
      }
    } catch(err) { console.error("Error TTS:", err); return; }
    
    console.log("  - Visuals (Logo a la derecha, Portadas)...");
    await createOverlayImage(sec.slide, overlayPath, sec.isScheme, sec.courseCover);
    
    console.log("  - FFmpeg Animación...");
    const filtergraph = `
      [0:v]scale=1280x720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='min(zoom+0.0015,1.5)':d=1000:s=1280x720,eq=brightness=-0.15:saturation=0.7[bg];
      [bg][1:v]overlay=0:0[outv]
    `;

    const ffmpegCmd = `"${FFMPEG_BIN}" -y -i "${photoPath}" -loop 1 -i "${overlayPath}" -i "${audioPath}" -filter_complex "${filtergraph}" -map "[outv]" -map 2:a -c:v libx264 -pix_fmt yuv420p -tune stillimage -c:a aac -b:a 192k -shortest "${videoPath}"`;
      
    try { execSync(ffmpegCmd, { stdio: 'ignore' }); console.log("  - OK!"); } 
    catch(err) { console.error("Error FFmpeg:", err.message); }
  }
  
  console.log("\nUniendo clips finales...");
  const listPath = path.join(OUT_DIR, 'list.txt');
  fs.writeFileSync(listPath, videoFiles.map(v => `file '${v}'`).join('\n'));
  
  const finalPath = path.join(OUT_DIR, 'VIDEO_1_2_V2_NETEC.mp4');
  try {
    execSync(`"${FFMPEG_BIN}" -y -f concat -safe 0 -i "${listPath}" -c copy "${finalPath}"`, { stdio: 'ignore' });
    console.log(`\n🎉 ¡VIDEO 1.2 V2 GENERADO CON ÉXITO!`);
    console.log(`Ruta: ${finalPath}`);
  } catch(err) { console.error("Error concatenar:", err.message); }
}

run();