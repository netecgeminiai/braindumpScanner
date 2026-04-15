const fs = require('fs');
const PImage = require('pureimage');

async function createSlide() {
    const fnt = PImage.registerFont('/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf', 'Ubuntu');
    
    fnt.load(() => {
        const img = PImage.make(1280, 720);
        const ctx = img.getContext('2d');
        
        // Background
        ctx.fillStyle = '#1A1A2E'; // Dark blue
        ctx.fillRect(0, 0, 1280, 720);
        
        // Header bar
        ctx.fillStyle = '#0F3460';
        ctx.fillRect(0, 0, 1280, 100);
        
        // Title text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = "48pt 'Ubuntu'";
        ctx.fillText('¿Qué es ITIL?', 50, 70);
        
        // Body text (simulated multiline)
        ctx.font = "32pt 'Ubuntu'";
        ctx.fillStyle = '#E94560';
        ctx.fillText('• IT Infrastructure Library', 100, 250);
        ctx.fillText('• Creado en 1989', 100, 320);
        ctx.fillText('• Estándar mundial de gestión IT', 100, 390);
        
        // Footer
        ctx.font = "24pt 'Ubuntu'";
        ctx.fillStyle = '#888888';
        ctx.fillText('Módulo 1: Introducción', 50, 680);
        
        PImage.encodePNGToStream(img, fs.createWriteStream('slide_test.png')).then(() => {
            console.log('Slide created');
        });
    });
}

createSlide();