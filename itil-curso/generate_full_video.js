const fs = require('fs');
const path = require('path');
const { EdgeTTS } = require('node-edge-tts');
const { execSync } = require('child_process');

const FFMPEG_BIN = '/home/adminetec/.openclaw/workspace/tools/ffmpeg/ffmpeg';
const WORK_DIR = '/home/adminetec/.openclaw/workspace/itil-curso';
const OUT_DIR = path.join(WORK_DIR, 'videos', 'full_video');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Guion completo V1.1
const sections = [
  {
    id: '01_intro',
    title: '¿Qué es ITIL?',
    color: 'black',
    text: 'Hola, soy tu guía en este viaje por ITIL Fundamentos. Y la primera pregunta que debes hacerte es: ¿Qué es ITIL y por qué sigue siendo relevante después de 40 años? Spoiler: La respuesta te sorprenderá. En este video vamos a viajar desde 1989 hasta hoy, y entender cómo ITIL evolucionó de una simple librería de infraestructura a un framework que hoy gestiona productos y servicios digitales en empresas mundiales.'
  },
  {
    id: '02_historia',
    title: 'El Nacimiento (1989)',
    color: 'darkblue',
    text: 'Viajemos a 1989, Reino Unido. El gobierno británico enfrentaba un problema común en esa época: caos en la gestión de tecnología. Cada departamento manejaba sus sistemas IT de forma diferente. No había estándar, no había consistencia. Entonces, se hicieron una pregunta simple: ¿Cómo estandarizamos la gestión de TI?'
  },
  {
    id: '03_library',
    title: 'IT Infrastructure Library',
    color: 'darkred',
    text: 'Y así nació ITIL: IT Infrastructure Library. La palabra "Librería" es clave aquí. Inicialmente, ITIL fue una colección de libros con mejores prácticas para gestionar la infraestructura de TI. Durante los años 90 y 2000, ITIL se convirtió en el estándar mundial. Pero aquí viene lo interesante...'
  },
  {
    id: '04_evolucion_1',
    title: 'Evolución: Etapas 1 y 2',
    color: '#004080',
    text: 'ITIL ha evolucionado 4 veces, porque el mundo cambió. Etapa 1, de 1989 a 2000: Gestión de servidores, redes y hardware, con foco en que la tecnología simplemente funcione. Etapa 2, de 2000 a 2010: IT Service Management. Llegan los primeros servicios digitales con un enfoque en procesos y calidad.'
  },
  {
    id: '05_evolucion_2',
    title: 'Evolución: Etapas 3 y 4',
    color: '#0066cc',
    text: 'Etapa 3, de 2010 a 2019: ITIL 4, Valor y Colaboración. Nacen metodologías como Agile y DevOps enfocadas en crear valor. Y finalmente, Etapa 4, año 2026: ITIL v5, Gestión Digital Integral. Hablamos de productos digitales, Inteligencia Artificial y Sostenibilidad. El foco ahora es colaborar con la tecnología para crear impacto real.'
  },
  {
    id: '06_hoy',
    title: 'ITIL en la actualidad',
    color: '#2d8659',
    text: 'Hoy en día, todo es digital. Una aplicación móvil, un servicio en la nube, un algoritmo de IA. Y aquí está el punto clave: No es solo TI. Es negocio. Si eres un empresario, un gestor de productos o un profesional de TI, la tecnología define tu éxito y tu capacidad de crear valor.'
  },
  {
    id: '07_framework',
    title: 'Un framework para todos',
    color: '#1f5c3d',
    text: 'El nombre dejó de ser "IT Infrastructure Library" hace más de 10 años, pero muchos aún no lo saben. Hoy, ITIL es simplemente un framework para gestionar productos y servicios digitales. Ya no es solo para equipos de TI. Es para todos.'
  },
  {
    id: '08_cierre',
    title: 'Resumen',
    color: 'black',
    text: 'Entonces, ¿Qué es ITIL hoy? Es el lenguaje común que conecta personas, tecnología, socios y procesos. Estudiarlo te abre puertas, te da perspectiva y te hace valioso en el mercado. En el próximo video, exploraremos los 7 módulos de ITIL v5. Gracias por ver. Nos vemos en el siguiente video.'
  }
];

async function run() {
  console.log("Iniciando generación de video completo con Edge TTS (Voz: Jorge Neural)...");
  
  const videoFiles = [];
  
  // Instanciar TTS
  const tts = new EdgeTTS({
    voice: 'es-MX-JorgeNeural',
    lang: 'es-MX',
    outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
  });
  
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    console.log(`\nProcesando sección ${i + 1}/${sections.length}: ${sec.id}`);
    
    const audioPath = path.join(OUT_DIR, `${sec.id}.mp3`);
    const videoPath = path.join(OUT_DIR, `${sec.id}.mp4`);
    videoFiles.push(videoPath);
    
    // 1. Generar Audio con Edge TTS
    console.log("  - Generando audio...");
    try {
      await tts.ttsPromise(sec.text, audioPath);
    } catch(err) {
      console.error("  - Error en TTS:", err);
      return;
    }
    
    // 2. Generar Video (Fondo color + audio)
    console.log("  - Compilando video con FFmpeg...");
    const textSafe = sec.title.replace(/'/g, "\\'");
    
    const ffmpegCmd = `"${FFMPEG_BIN}" -y -f lavfi -i color=c='${sec.color}':s=1280x720 -i "${audioPath}" -c:v libx264 -c:a aac -shortest "${videoPath}"`;
    
    try {
      execSync(ffmpegCmd, { stdio: 'ignore' });
      console.log("  - OK!");
    } catch(err) {
      console.error("  - Error en FFmpeg:", err.message);
    }
  }
  
  // 3. Concatenar los videos
  console.log("\nUniendo videos...");
  const listPath = path.join(OUT_DIR, 'list.txt');
  const listContent = videoFiles.map(v => `file '${v}'`).join('\n');
  fs.writeFileSync(listPath, listContent);
  
  const finalVideoPath = path.join(OUT_DIR, 'VIDEO_1_1_COMPLETO.mp4');
  const concatCmd = `"${FFMPEG_BIN}" -y -f concat -safe 0 -i "${listPath}" -c copy "${finalVideoPath}"`;
  
  try {
    execSync(concatCmd, { stdio: 'ignore' });
    console.log(`\n🎉 ¡VIDEO COMPLETO GENERADO CON ÉXITO!`);
    console.log(`Ruta: ${finalVideoPath}`);
  } catch(err) {
    console.error("Error al concatenar:", err.message);
  }
}

run();