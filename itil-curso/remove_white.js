const { Jimp } = require('jimp');

async function removeWhite() {
    try {
        const image = await Jimp.read('/home/adminetec/.openclaw/workspace/itil-curso/assets/netec_logo.png');
        
        // Define tolerance for "white"
        const tolerance = 15;
        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];
            const alpha = this.bitmap.data[idx + 3];

            if (red > 255 - tolerance && green > 255 - tolerance && blue > 255 - tolerance) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0
            }
        });

        await image.write('/home/adminetec/.openclaw/workspace/itil-curso/assets/netec_logo_transparent.png');
        console.log('Logo background removed successfully.');
    } catch (error) {
        console.error(error);
    }
}

removeWhite();