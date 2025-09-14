import fs from "fs";
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

export async function synthesizeWithGroq(text, outPath) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const response = await groq.audio.speech.create({
    model: "playai-tts",
    voice: "Chip-PlayAI", 
    input: text,
    response_format: "wav"
  });
  
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.writeFile(outPath, buffer);
}

 