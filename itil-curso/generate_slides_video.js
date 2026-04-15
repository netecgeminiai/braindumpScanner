const fs = require('fs');
const path = require('path');
const { EdgeTTS } = require('node-edge-tts');
const { execSync } = require('child_process');
const { createCanvas, registerFont } = require('canvas');

const FFMPEG_BIN = '/home/adminetec/.openclaw/workspace/tools/ffmpeg/ffmpeg';
const WORK_DIR = '/home/adminetec/.openclaw/workspace/itil-curso';
const OUT_DIR = path.join(WORK_DIR, 'videos', 'slides_video');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Registrar fuente
registerFont('/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf', { family: 'Ubuntu', weight: 'bold' });
registerFont('/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf', { family: 'Ubuntu', weight: 'normal' });

const sections = [
  {
    id: '01_intro',
    text: 'Hola, soy tu guía en este viaje por ITIL Fundamentos. Y la primera pregunta que debes hacerte es: ¿Qué es ITIL y por qué sigue siendo relevante después de 40 años? Spoiler: La respuesta te sorprenderá. En este video vamos a viajar desde 1989 hasta hoy, y entender cómo ITIL evolucionó de una simple librería de infraestructura a un framework que hoy gestiona productos y servicios digitales en empresas mundiales.',
    slide: { title: '¿Qué es ITIL?', subtitle: 'Historia y Evolución', bullets: ['Relevancia después de 40 años', 'De Librería a Framework Global', 'Gestión de Productos Digitales'] }
  },
  {
    id: '02_historia',
    text: 'Viajemos a 1989, Reino Unido. El gobierno británico enfrentaba un problema común en esa época: caos en la gestión de tecnología. Cada departamento manejaba sus sistemas IT de forma diferente. No había estándar, no había consistencia. Entonces, se hicieron una pregunta simple: ¿Cómo estandarizamos la gestión de TI?',
    slide: { title: 'El Nacimiento (1989)', subtitle: 'Gobierno Británico', bullets: ['Caos en la gestión tecnológica', 'Falta de estándares y consistencia', 'Búsqueda de la estandarización'] }
  },
  {
    id: '03_library',
    text: 'Y así nació ITIL: IT Infrastructure Library. La palabra "Librería" es clave aquí. Inicialmente, ITIL fue una colección de libros con mejores prácticas para gestionar la infraestructura de TI. Durante los años 90 y 2000, ITIL se convirtió en el estándar mundial. Pero aquí viene lo interesante...',
    slide: { title: 'IT Infrastructure Library', subtitle: 'La primera versión', bullets: ['Colección física de libros', 'Mejores prácticas de infraestructura', 'Se convierte en el estándar mundial'] }
  },
  {
    id: '04_evolucion_1',
    text: 'ITIL ha evolucionado 4 veces, porque el mundo cambió. Etapa 1, de 1989 a 2000: Gestión de servidores, redes y hardware, con foco en que la tecnología simplemente funcione. Etapa 2, de 2000 a 2010: IT Service Management. Llegan los primeros servicios digitales con un enfoque en procesos y calidad.',
    slide: { title: 'La Evolución (Parte 1)', subtitle: 'Adaptándose al cambio', bullets: ['Etapa 1 (1989-2000): Infraestructura y Hardware', 'Foco: "Que funcione"', 'Etapa 2 (2000-2010): IT Service Management', 'Foco: "Que funcione bien con calidad"'] }
  },
  {
    id: '05_evolucion_2',
    text: 'Etapa 3, de 2010 a 2019: ITIL 4, Valor y Colaboración. Nacen metodologías como Agile y DevOps enfocadas en crear valor. Y finalmente, Etapa 4, año 2026: ITIL v5, Gestión Digital Integral. Hablamos de productos digitales, Inteligencia Artificial y Sostenibilidad. El foco ahora es colaborar con la tecnología para crear impacto real.',
    slide: { title: 'La Evolución (Parte 2)', subtitle: 'Agilidad y Era Digital', bullets: ['Etapa 3 (2010-2019): ITIL 4 (Valor y Agile)', 'Foco: "Que cree valor"', 'Etapa 4 (2026): ITIL v5 (Gestión Digital)', 'Foco: IA, Sostenibilidad e Impacto Real'] }
  },
  {
    id: '06_hoy',
    text: 'Hoy en día, todo es digital. Una aplicación móvil, un servicio en la nube, un algoritmo de IA. Y aquí está el punto clave: No es solo TI. Es negocio. Si eres un empresario, un gestor de productos o un profesional de TI, la tecnología define tu éxito y tu capacidad de crear valor.',
    slide: { title: 'Todo es Digital', subtitle: 'La tecnología ES el negocio', bullets: ['Apps, Cloud, Algoritmos de IA', 'Dejó de ser "solo para TI"', 'Define el éxito del negocio entero'] }
  },
  {
    id: '07_framework',
    text: 'El nombre dejó de ser "IT Infrastructure Library" hace más de 10 años, pero muchos aún no lo saben. Hoy, ITIL es simplemente un framework para gestionar productos y servicios digitales. Ya no es solo para equipos de TI. Es para todos.',
    slide: { title: 'ITIL en la actualidad', subtitle: 'Gestión de Servicios Digitales', bullets: ['Ya no es "Librería de Infraestructura"', 'Es un framework integral de gestión', 'Aplicable a todos los departamentos'] }
  },
  {
    id: '08_cierre',
    text: 'Entonces, ¿Qué es ITIL hoy? Es el lenguaje común que conecta personas, tecnología, socios y procesos. Estudiarlo te abre puertas, te da perspectiva y te hace valioso en el mercado. En el próximo video, exploraremos los 7 módulos de ITIL v5. Gracias por ver. Nos vemos en el siguiente video.',
    slide: { title: '¿Por qué estudiar ITIL?', subtitle: 'Beneficios clave', bullets: ['Te abre puertas (200+ países)', 'Te da perspectiva digital', 'Te hace valioso en el mercado moderno'] }
  }
];

function createSlideImage(slideData, outputPath) {
  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext('2d');

  // Gradiente de fondo
  const grd = ctx.createLinearGradient(0, 0, 1280, 720);
  grd.addColorStop(0, "#0a192f"); // Dark navy
  grd.addColorStop(1, "#020c1b"); // Darker navy
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1280, 720);

  // Barra lateral izquierda decorativa
  ctx.fillStyle = "#64ffda"; // Teal accent
  ctx.fillRect(0, 0, 15, 720);

  // Título del curso superior
  ctx.fillStyle = "#8892b0";
  ctx.font = 'bold 30px Ubuntu';
  ctx.fillText('ITIL Fundamentos v5', 50, 60);
  
  // Línea separadora
  ctx.fillStyle = "#233554";
  ctx.fillRect(50, 80, 1180, 2);

  // Título Principal
  ctx.fillStyle = '#ccd6f6'; // Light text
  ctx.font = 'bold 75px Ubuntu';
  ctx.fillText(slideData.title, 60, 220);

  // Subtítulo
  if (slideData.subtitle) {
    ctx.fillStyle = '#64ffda';
    ctx.font = 'bold 40px Ubuntu';
    ctx.fillText(slideData.subtitle, 60, 290);
  }

  // Viñetas (Bullets)
  ctx.fillStyle = '#a8b2d1';
  ctx.font = 'normal 38px Ubuntu';
  let y = 400;
  slideData.bullets.forEach(bullet => {
    // Dibujar viñeta (cuadrito)
    ctx.fillStyle = "#64ffda";
    ctx.fillRect(70, y - 25, 12, 12);
    // Texto
    ctx.fillStyle = '#a8b2d1';
    ctx.fillText(bullet, 110, y);
    y += 70;
  });

  // Footer
  ctx.fillStyle = '#495670';
  ctx.font = 'normal 25px Ubuntu';
  ctx.fillText('Módulo 1 - Historia y Evolución', 50, 690);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

async function run() {
  console.log("🎬 Iniciando generación de Video con Slides Reales...");
  
  const videoFiles = [];
  const tts = new EdgeTTS({ voice: 'es-MX-JorgeNeural', lang: 'es-MX', outputFormat: 'audio-24khz-48kbitrate-mono-mp3' });
  
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    console.log(`\nProcesando [${i + 1}/${sections.length}]: ${sec.id}`);
    
    const audioPath = path.join(OUT_DIR, `${sec.id}.mp3`);
    const slidePath = path.join(OUT_DIR, `${sec.id}.png`);
    const videoPath = path.join(OUT_DIR, `${sec.id}.mp4`);
    videoFiles.push(videoPath);
    
    // 1. Crear Audio
    console.log("  - TTS: Generando voz...");
    try {
      if (!fs.existsSync(audioPath)) {
        await tts.ttsPromise(sec.text, audioPath);
      }
    } catch(err) { console.error("Error en TTS:", err); return; }
    
    // 2. Crear Slide (PNG)
    console.log("  - Visuals: Dibujando slide...");
    createSlideImage(sec.slide, slidePath);
    
    // 3. Crear Clip de Video (Imagen + Audio)
    console.log("  - Compilando clip con FFmpeg...");
    const ffmpegCmd = `"${FFMPEG_BIN}" -y -loop 1 -i "${slidePath}" -i "${audioPath}" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest "${videoPath}"`;
    try { execSync(ffmpegCmd, { stdio: 'ignore' }); } 
    catch(err) { console.error("Error FFmpeg:", err.message); }
  }
  
  // 4. Unir clips
  console.log("\nUniendo clips finales...");
  const listPath = path.join(OUT_DIR, 'list.txt');
  fs.writeFileSync(listPath, videoFiles.map(v => `file '${v}'`).join('\n'));
  
  const finalPath = path.join(OUT_DIR, 'VIDEO_1_1_SLIDES.mp4');
  try {
    execSync(`"${FFMPEG_BIN}" -y -f concat -safe 0 -i "${listPath}" -c copy "${finalPath}"`, { stdio: 'ignore' });
    console.log(`\n🎉 ¡VIDEO CON DIAPOSITIVAS GENERADO CON ÉXITO!`);
    console.log(`Ruta: ${finalPath}`);
  } catch(err) { console.error("Error al concatenar:", err.message); }
}

run();