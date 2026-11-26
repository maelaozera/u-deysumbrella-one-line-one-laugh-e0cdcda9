// One Line, One Laugh — entry builder
// Assembles the chosen one-line joke from labeled parts and writes it
// to /output/entry.txt, after validating it against the competition gate
// (UTF-8 text, 1 to 140 characters, not only whitespace, single line).

import { mkdirSync, writeFileSync } from "node:fs";

const MAX_CHARS = 140;
const OUTPUT_PATH = "/output/entry.txt";

// One beat of the joke: a label, its text, and the separator that joins
// it to the next beat. The beats in order are the setup, the turn, and
// the punchline.
interface Beat {
  label: string;
  text: string;
  joiner: string;
}

const beats: Beat[] = [
  { label: "setup", text: "My plants died, so I bought plastic ones", joiner: " — " },
  { label: "turn", text: "now even the fake ones", joiner: " " },
  { label: "punchline", text: "look disappointed in me.", joiner: "" },
];

function buildEntry(parts: Beat[]): string {
  let line = "";
  for (const part of parts) {
    line += part.text + part.joiner;
  }
  return line;
}

function charCount(line: string): number {
  // Count Unicode code points, so an em dash counts as one character.
  return [...line].length;
}

function validateLine(line: string): string {
  const trimmed = line.trim();
  if (trimmed.length === 0) {
    throw new Error("Entry must not be only whitespace.");
  }
  const count = charCount(line);
  if (count < 1 || count > MAX_CHARS) {
    throw new Error(
      `Entry must be 1 to ${MAX_CHARS} characters, got ${count}.`,
    );
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
  if (trimmed !== line) {
    throw new Error("Entry must not start or end with whitespace.");
  }
  return line;
}

function main(): void {
  const entry = validateLine(buildEntry(beats));
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, entry, "utf8");
  console.log(`Wrote ${charCount(entry)} characters to ${OUTPUT_PATH}`);
}

main();
