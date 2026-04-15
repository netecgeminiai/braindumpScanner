const fs = require('fs');
const path = require('path');
const gTTS = require('gtts');
const { execSync } = require('child_process');

const FFMPEG_BIN = '/home/adminetec/.openclaw/workspace/tools/ffmpeg/ffmpeg';
const WORK_DIR = '/home/adminetec/.openclaw/workspace/itil-curso';
const OUT_DIR = path.join(WORK_DIR, 'videos', 'prototype');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Datos simplificados basados en el guion V1.1_GUION.md
const sections = [
  {
    id: 'intro',
    title: '¿Qué es ITIL?',
    text: 'Hola, soy tu guía en este viaje por ITIL Fundamentos. La primera pregunta que debes hacerte es: ¿Qué es ITIL y por qué sigue siendo relevante después de cuarenta años?',
    color: 'black'
  },
  {
    id: 'sec1_1',
    title: 'El Nacimiento (1989)',
    text: 'Viajemos a 1989, Reino Unido. El gobierno británico enfrentaba caos en la gestión de tecnología. No había estándar.',
    color: 'darkblue'
  },
  {
    id: 'sec1_2',
    title: 'IT Infrastructure Library',
    text: 'Entonces, nació ITIL: IT Infrastructure Library. Inicialmente, fue una colección de libros con mejores prácticas para gestionar la infraestructura de TI.',
    color: 'darkred'
  }
];

async function run() {
  console.log("Iniciando generación de MVP...");
  
  const videoFiles = [];
  
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    console.log(`\nProcesando sección ${i + 1}/${sections.length}: ${sec.id}`);
    
    const audioPath = path.join(OUT_DIR, `${sec.id}.mp3`);
    const videoPath = path.join(OUT_DIR, `${sec.id}.mp4`);
    videoFiles.push(videoPath);
    
    // 1. Generar Audio con gTTS (español)
    console.log("  - Generando audio...");
    await new Promise((resolve, reject) => {
      const gtts = new gTTS(sec.text, 'es');
      gtts.save(audioPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // 2. Generar Video (Fondo color + texto al centro + audio generado)
    // Usaremos drawtext con una fuente built-in básica
    console.log("  - Compilando video con FFmpeg...");
    const textSafe = sec.title.replace(/'/g, "\\'");
    
    // Comando FFmpeg: crea un video a partir de un color sólido, toma el mp3 como audio.
    // drawtext dibuja el título en la pantalla.
    const ffmpegCmd = `
      "${FFMPEG_BIN}" -y -f lavfi -i color=c=${sec.color}:s=1280x720 -i "${audioPath}" \
      -c:v libx264 -c:a aac -shortest "${videoPath}"
    `;
    
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
  
  const finalVideoPath = path.join(OUT_DIR, 'VIDEO_1_1_MVP.mp4');
  const concatCmd = `"${FFMPEG_BIN}" -y -f concat -safe 0 -i "${listPath}" -c copy "${finalVideoPath}"`;
  
  try {
    execSync(concatCmd, { stdio: 'ignore' });
    console.log(`\n🎉 ¡VIDEO GENERADO CON ÉXITO!`);
    console.log(`Ruta: ${finalVideoPath}`);
  } catch(err) {
    console.error("Error al concatenar:", err.message);
  }
}

run();
