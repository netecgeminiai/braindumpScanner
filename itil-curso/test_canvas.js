const fs = require('fs');
const { createCanvas, registerFont } = require('canvas');

// Registrar fuente de Ubuntu
registerFont('/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf', { family: 'Ubuntu' });

const canvas = createCanvas(1280, 720);
const ctx = canvas.getContext('2d');

// Fondo: Gradiente Azul-Negro
const grd = ctx.createLinearGradient(0, 0, 1280, 720);
grd.addColorStop(0, "#001a33");
grd.addColorStop(1, "#000000");
ctx.fillStyle = grd;
ctx.fillRect(0, 0, 1280, 720);

// Barra de Título superior
ctx.fillStyle = "#004080";
ctx.fillRect(0, 0, 1280, 120);
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 50px Ubuntu';
ctx.fillText('ITIL Fundamentos', 50, 80);

// Título del Slide
ctx.fillStyle = '#4da6ff';
ctx.font = 'bold 70px Ubuntu';
ctx.fillText('¿Qué es ITIL?', 100, 260);

// Viñetas
ctx.fillStyle = '#FFFFFF';
ctx.font = '40px Ubuntu';
ctx.fillText('• IT Infrastructure Library', 120, 360);
ctx.fillText('• Creado en 1989 en Reino Unido', 120, 440);
ctx.fillText('• Framework de gestión de servicios digitales', 120, 520);

// Footer
ctx.fillStyle = '#808080';
ctx.font = '25px Ubuntu';
ctx.fillText('Módulo 1 - Historia y Evolución', 50, 690);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./slide_test2.png', buffer);
console.log('Slide creado exitosamente en slide_test2.png');
