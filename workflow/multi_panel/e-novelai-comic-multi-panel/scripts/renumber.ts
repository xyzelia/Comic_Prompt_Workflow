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
    "Usage: bun scripts/renumber.ts <comic-dir>\nBacks up and renumbers Page/Panel headings. Stable Prompt IDs and prompt filenames are not changed.",
  );
  process.exit(["-h", "--help"].includes(dir) ? 0 : 1);
}

const board = join(dir, "storyboard.md");
const original = readFileSync(board, "utf8");
const lines = original.split("\n");
const pageMap = new Map<string, string>();
const panelMap = new Map<string, string>();
let currentOld = "";
let currentNew = "";
let pageNo = 0;
let panelNo = 0;

for (const line of lines) {
  const page = line.match(/^##\s+Page\s+(\d{2})\b/);
  if (page) {
    if (pageMap.has(page[1])) throw new Error(`Duplicate Page ${page[1]}`);
    currentOld = page[1];
    currentNew = String(++pageNo).padStart(2, "0");
    pageMap.set(currentOld, currentNew);
    panelNo = 0;
    continue;
  }
  const panel = line.match(/^###\s+Panel\s+(\d{2}-\d{2})\b/);
  if (panel) {
    if (!currentOld) throw new Error("Panel before Page");
    if (panelMap.has(panel[1])) throw new Error(`Duplicate Panel ${panel[1]}`);
    panelMap.set(
      panel[1],
      `${currentNew}-${String(++panelNo).padStart(2, "0")}`,
    );
  }
}
if (!pageMap.size) throw new Error("No Page headings found");

const replaceIds = (value: string, map: Map<string, string>) => {
  let out = value;
  const tokens = new Map<string, string>();
  let index = 0;
  for (const [oldId, newId] of map) {
    const token = `__RENUMBER_${index++}__`;
    tokens.set(token, newId);
    out = out.replace(
      new RegExp(`(?<!\\d)${oldId.replace("-", "\\-")}(?!\\d)`, "g"),
      token,
    );
  }
  for (const [token, newId] of tokens) out = out.replaceAll(token, newId);
  return out;
};
const replacePageHeadings = (value: string) => {
  let out = value;
  const tokens = new Map<string, string>();
  let index = 0;
  for (const [oldId, newId] of pageMap) {
    const token = `__PAGE_RENUMBER_${index++}__`;
    tokens.set(token, newId);
    out = out.replace(
      new RegExp(`^(##\\s+Page\\s+)${oldId}\\b`, "gm"),
      `$1${token}`,
    );
  }
  for (const [token, newId] of tokens) out = out.replaceAll(token, newId);
  return out;
};

const promptIdLines = new Map<string, string>();
for (const match of original.matchAll(/^\*\*Prompt ID\*\*:\s*(\S+)\s*$/gm)) {
  promptIdLines.set(`__PROMPT_ID_${promptIdLines.size}__`, match[0]);
}
let protectedText = original;
for (const [token, line] of promptIdLines) protectedText = protectedText.replace(line, token);
let updated = replacePageHeadings(replaceIds(protectedText, panelMap));
for (const [token, line] of promptIdLines) updated = updated.replace(token, line);

if (updated === original) {
  console.log("Already sequential, no changes.");
  process.exit(0);
}
const backup = join(dir, `.renumber-backup-${Date.now()}-${process.pid}`);
mkdirSync(backup);
copyFileSync(board, join(backup, "storyboard.md"));
writeFileSync(board, updated);
console.log(`Renumbered Page/Panel headings. Backup: ${backup}`);
console.log("Prompt IDs and prompts/NNN-MMM.md filenames remain stable.");
