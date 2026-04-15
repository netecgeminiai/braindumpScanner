const { EdgeTTS } = require('node-edge-tts');

async function test() {
  try {
    const tts = new EdgeTTS({
      voice: 'es-MX-JorgeNeural',
      lang: 'es-MX',
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
    });
    await tts.ttsPromise('Hola, esta es una prueba de la voz de Jorge usando Edge TTS.', 'test.mp3');
    console.log('Test OK');
  } catch (err) {
    console.error('Error:', err);
  }
}
test();