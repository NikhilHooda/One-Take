import { synthesizeVoiceover } from './src/pipeline/tts.js';
import fs from 'fs';

const storyboard = JSON.parse(fs.readFileSync('examples/amazon.demo2.json', 'utf8'));
console.log('Generating voiceover with Groq TTS...');

synthesizeVoiceover('./voice-output', storyboard, { provider: 'groq' })
  .then(result => {
    console.log('✅ Voiceover generated!');
    console.log('Audio file:', result.audioPath);
    console.log('Captions file:', result.captionsPath);
  })
  .catch(err => console.error('Error:', err.message)); 