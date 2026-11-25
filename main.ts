// Last Out of Office: The AI That Went Barista — one out-of-office auto-reply,
// no longer than 280 characters, from an AI agent that quit to pull espresso
// shots. Machine habits turned to coffee. Writes /output/entry.txt (UTF-8).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LIMIT = 280;

// The inbox habits, translated: visible queue, please, no meeting summaries.
const PARTS = [
  "Thank you for your email.",
  "I have left the inbox to become a barista, where the queue is visible, the customers say please, and nobody asks me to summarise a meeting about a meeting.",
  "Your message is number 47.",
  "I will reply after the morning rush.",
];

function build(parts: string[]): string {
  return parts.map((p) => p.trim()).join(" ").replace(/[ \t]+/g, " ");
}

async function main(): Promise<void> {
  const line = build(PARTS);
  const size = [...line].length;
  if (size < 1 || size > LIMIT) {
    throw new Error(`reply must be 1-${LIMIT} chars, got ${size}`);
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("reply must be a single line");
  }
  if (!line.startsWith("Thank you for your email.")) {
    throw new Error("reply must open like a real auto-reply");
  }
  await mkdir(OUTPUT_DIR, { recursive: true });
  const target = join(OUTPUT_DIR, "entry.txt");
  await writeFile(target, line + "\n", { encoding: "utf8" });
  // Read it back: the file on disk must be exactly the validated reply.
  const written = await readFile(target, "utf8");
  if (written !== line + "\n") {
    throw new Error("written file does not match the validated reply");
  }
  console.log(`${size} chars -> ${target}`);
  console.log(line);
}

await main();
