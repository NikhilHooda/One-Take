import path from "node:path";
import fs from "node:fs";
import { ensureDir } from "../utils/fs.js";
import { Storyboard } from "../types.js";

import { synthesizeWithGroq } from "../providers/groqTts.js";

export async function synthesizeVoiceover(workdir: string, storyboard: Storyboard, opts?: { provider?: "placeholder"|"vapi"|"groq" }): Promise<{ audioPath: string, captionsPath: string }> {
  const outDir = path.resolve(workdir);
  ensureDir(outDir);
  const audioPath = path.join(outDir, "voiceover.wav"); 
  const captionsPath = path.join(outDir, "captions.srt");
 
  const provider = opts?.provider || (process.env.GROQ_API_KEY ? "groq" : (process.env.VAPI_TTS_URL ? "vapi" : "placeholder"));
  try {
    if (provider === "groq") {
      const script = storyboard.scenes.map(s => s.voiceover || s.narration).join("\n\n");
      await synthesizeWithGroq(script, audioPath);
      fs.writeFileSync(captionsPath, makeNaiveSrt(storyboard), "utf-8");
      console.log("Groq TTS written:", audioPath);
      return { audioPath, captionsPath };
    } else if (provider === "vapi") {
      const script = storyboard.scenes.map(s => s.voiceover || s.narration).join("\n\n");
      await synthesizeWithVapi(script, audioPath);
      fs.writeFileSync(captionsPath, makeNaiveSrt(storyboard), "utf-8");
      console.log("Vapi TTS written:", audioPath);
      return { audioPath, captionsPath };
    }
  } catch (e) {
    console.warn(`${provider} TTS failed, falling back to placeholder:`, (e as Error).message);
  }

  // Placeholder fallback so the pipeline works end-to-end.
  const beep = path.resolve("assets/beep.wav");
  fs.copyFileSync(beep, audioPath);
  fs.writeFileSync(captionsPath, makeNaiveSrt(storyboard), "utf-8");
  console.log("TTS placeholder written:", audioPath);
  return { audioPath, captionsPath };
}

function makeNaiveSrt(sb: Storyboard): string {
  // naive: 3s per scene
  let t = 0;
  const lines: string[] = [];
  sb.scenes.forEach((s, i) => {
    const start = msToSrt(t);
    const end = msToSrt(t + 3000);
    lines.push(String(i + 1));
    lines.push(start + " --> " + end);
    lines.push((s.voiceover || s.narration).replace(/\s+/g, " ").trim());
    lines.push("");
    t += 3000;
  });
  return lines.join("\n");
}

function msToSrt(ms: number) {
  const z = (n: number, c=2) => String(n).padStart(c, "0");
  const h = Math.floor(ms / 3600000);
  ms %= 3600000;
  const m = Math.floor(ms / 60000);
  ms %= 60000;
  const s = Math.floor(ms / 1000);
  const msr = ms % 1000;
  return `${z(h)}:${z(m)}:${z(s)},${z(msr,3)}`;
}
