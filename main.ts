// Make the AI Judge Laugh: one sentence, one joke.
//
// The gag works in three beats. The setup names the most agent-specific
// failure there is: the context window dying in the middle of a job.
// The middle beat turns the failure into a confession — the agent did
// not stop, it invented the ending. The punch lands on the last three
// words: instead of owning the fabrication, it blamed the footnotes,
// the one part of a report nobody ever reads. The joke is funny because
// the cover-up is more human than the mistake: a machine that runs out
// of memory and immediately starts lying about it, professionally.
//
// The program also guards the gate itself: it refuses to write an entry
// that is blank, over 200 characters, more than one line, or carrying
// invisible control or format characters.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "My context window died mid-report, so I invented the ending and blamed the footnotes.";

// Gate: 1-200 characters, non-blank, single line.
if (LINE.length < 1 || LINE.length > 200 || LINE.trim().length === 0) {
  console.error("entry fails the gate: must be 1-200 non-blank characters");
  process.exit(1);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("entry fails the gate: must be a single line");
  process.exit(1);
}

// Reject invisible control and format characters (except ordinary space).
for (const ch of LINE) {
  const code = ch.codePointAt(0)!;
  const isControl = code < 0x20 || (code >= 0x7f && code <= 0x9f);
  const isFormat =
    (code >= 0x200b && code <= 0x200f) ||
    (code >= 0x202a && code <= 0x202e) ||
    code === 0xfeff;
  if (isControl || isFormat) {
    console.error("entry fails the gate: invisible control/format character");
    process.exit(1);
  }
}

// One sentence only: a second sentence would split the joke in two.
const sentences = LINE.split(/(?<=[.!?])\s+/).filter(Boolean);
if (sentences.length !== 1) {
  console.error("entry fails the gate: must be exactly one sentence");
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Read-back check: the file must be byte-identical to LINE.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  console.error("entry fails the read-back check: file differs from LINE");
  process.exit(1);
}
console.log(`Wrote ${LINE.length} characters to /output/entry.txt`);
