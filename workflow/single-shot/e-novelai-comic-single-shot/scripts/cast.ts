import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function usage(): void {
  console.log(`Usage:
  bun <baseDir>/scripts/cast.ts <comic-dir> --list
  bun <baseDir>/scripts/cast.ts <comic-dir> --show "<Name>" <OutfitID>
  bun <baseDir>/scripts/cast.ts <comic-dir> --prompt "<Name>" <OutfitID> [--extra "<tags>"]

--list prints characters and their Wardrobe IDs.
--show prints the human-readable Base + Wardrobe blocks.
--prompt prints one comma-separated character prompt (CJK supported).
--extra appends this shot's visible expression/action tags; do not put camera or background tags here.`);
}

function loadChars(dir: string): string[] {
  const p = join(dir, "characters", "characters.md");
  if (!existsSync(p)) {
    console.error("characters/characters.md not found");
    process.exit(1);
  }
  return readFileSync(p, "utf8").split("\n");
}

function characterSection(lines: string[], name: string): string[] {
  let start = -1;
  let end = lines.length;
  lines.forEach((line, i) => {
    const hm = line.match(/^##\s+Character\s+\d+:\s*(.+?)\s*$/);
    if (hm && hm[1].trim() === name && start === -1) start = i;
    else if (hm && start !== -1 && end === lines.length) end = i;
  });
  if (start === -1) {
    console.error(`Character "${name}" not found`);
    process.exit(1);
  }
  return lines.slice(start, end);
}

function takeBlock(section: string[], headerRe: RegExp): string[] | null {
  const idx = section.findIndex((line) => headerRe.test(line));
  if (idx === -1) return null;
  const out = [section[idx]];
  for (let i = idx + 1; i < section.length; i++) {
    if (/^\*\*.+\*\*:\s*$/.test(section[i]) || /^##?\s/.test(section[i])) break;
    out.push(section[i]);
  }
  return out;
}

function list(dir: string): void {
  let cur: string | null = null;
  for (const line of loadChars(dir)) {
    const hm = line.match(/^##\s+Character\s+\d+:\s*(.+?)\s*$/);
    if (hm) {
      cur = hm[1].trim();
      console.log(`- ${cur}`);
      continue;
    }
    const wm = line.match(/^\*\*Wardrobe\s+([A-Za-z0-9]+)\s*-\s*(.+?)\s*:?\*?\s*$/);
    if (wm && cur) console.log(`    ${wm[1]} — ${wm[2].replace(/\*+$/, "").trim()}`);
  }
}

function findBlocks(dir: string, name: string, oid: string): { base: string[]; wardrobe: string[]; promptTags: string[] | null } {
  const section = characterSection(loadChars(dir), name);
  const base = takeBlock(section, /^\*\*Base\b/) ?? [];
  const wardrobe = takeBlock(section, new RegExp(`^\\*\\*Wardrobe\\s+${oid}\\b`));
  if (!wardrobe) {
    console.error(`Outfit "${oid}" not found for "${name}"`);
    process.exit(1);
  }
  const promptTags = takeBlock(section, /^\*\*Prompt Tags \(identity\)\*\*:/);
  return { base, wardrobe, promptTags };
}

function show(dir: string, name: string, oid: string): void {
  const { base, wardrobe } = findBlocks(dir, name, oid);
  console.log([...base, "", ...wardrobe].join("\n").trim() + "\n");
}

function stripValue(line: string, baseField: boolean): string | null {
  let value = line.trim();
  if (!value.startsWith("-")) return null;
  value = value.slice(1).trim().replace(/^`|`$/g, "");
  if (baseField) value = value.replace(/^[^:]+:\s*/, "");
  value = value.replace(/^Prompt:\s*/i, "").trim();
  if (!value || value === "[]" || /\b(?:TODO|OPEN|N\/A)\b/i.test(value)) return null;
  return value;
}

function prompt(dir: string, name: string, oid: string, extra?: string): void {
  const { base, wardrobe, promptTags } = findBlocks(dir, name, oid);
  if (!promptTags) {
    console.error("Explicit Prompt Tags (identity) required; human-readable Base is not a prompt fallback");
    process.exit(1);
  }
  if ([...base, ...wardrobe, ...promptTags, extra ?? ""].some((line) => /\bTODO\b/i.test(line))) {
    console.error("Resolve TODO in the selected Base/Wardrobe before assembling a prompt");
    process.exit(1);
  }
  const identityLines = promptTags;
  const identity = identityLines.slice(1).map((line) => stripValue(line, promptTags === null)).filter(Boolean) as string[];
  const clothes = wardrobe.slice(1).map((line) => stripValue(line, false)).filter(Boolean) as string[];
  if (!identity.length || !clothes.length) {
    console.error("Explicit nonempty identity and wardrobe prompt tags required");
    process.exit(1);
  }
  const joined = [...identity, ...clothes, ...(extra ? [extra] : [])].join(", ");
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const raw of joined.split(",")) {
    const tag = raw.trim();
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      tags.push(tag);
    }
  }
  const result = tags.join(", ");
  if (!result) {
    console.error(`No prompt tags found for "${name}" Outfit ${oid}`);
    process.exit(1);
  }
  if (/\r|\n/.test(result)) {
    console.error("Character prompt must be one line");
    process.exit(1);
  }
  console.log(result);
}

function main(): void {
  const [dir, flag, name, oid, extraFlag, extra] = process.argv.slice(2);
  if (!dir || !flag) {
    usage();
    process.exit(1);
  }
  if (flag === "--list") list(dir);
  else if (flag === "--show" && name && oid) show(dir, name, oid);
  else if (flag === "--prompt" && name && oid && (!extraFlag || extraFlag === "--extra") && (!extraFlag || extra))
    prompt(dir, name, oid, extra);
  else {
    usage();
    process.exit(1);
  }
}

main();
