import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir || process.argv.length !== 3 || ["-h", "--help"].includes(dir)) {
  console.log(
    "Usage: bun scripts/renumber.ts <comic-dir>\nBacks up and renumbers Page/Shot headings. Stable Prompt IDs and prompt filenames are not changed.",
  );
  process.exit(dir === "--help" || dir === "-h" ? 0 : 1);
}

const boardPath = join(dir, "storyboard.md");
const original = readFileSync(boardPath, "utf8");
let page = 0;
let shot = 0;
const seen = new Set<string>();
const changes: Array<[string, string]> = [];
const updated = original.split("\n").map((line) => {
  if (/^##\s+Page\s+\d+\b/.test(line)) {
    page++;
    shot = 0;
    return line.replace(/^##\s+Page\s+\d+\b/, `## Page ${page}`);
  }
  const match = line.match(/^###\s+Shot\s+(\d+-\d+)\b(.*)$/);
  if (!match) return line;
  if (!page) throw new Error("Shot must follow a Page heading");
  if (seen.has(match[1])) throw new Error(`Duplicate Shot id ${match[1]}; resolve manually`);
  seen.add(match[1]);
  const id = `${String(page).padStart(2, "0")}-${String(++shot).padStart(2, "0")}`;
  if (match[1] !== id) changes.push([match[1], id]);
  return `### Shot ${id}${match[2]}`;
}).join("\n");

if (!seen.size) throw new Error("No Shot headings found");
if (updated === original) {
  console.log("Already sequential, no changes.");
  process.exit(0);
}

const backup = join(dir, `.renumber-backup-${Date.now()}-${process.pid}`);
mkdirSync(backup);
copyFileSync(boardPath, join(backup, "storyboard.md"));
writeFileSync(boardPath, updated);
console.log(`Renumbered Page/Shot headings. Backup: ${backup}`);
console.log("Prompt IDs and prompts/NNN-MMM.md filenames remain stable.");
for (const [oldId, id] of changes) console.log(`${oldId} -> ${id}`);
