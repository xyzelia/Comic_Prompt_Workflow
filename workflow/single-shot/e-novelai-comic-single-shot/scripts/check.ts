import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PROMPT_FILE_PATTERN = /^\d{3}-\d{3}\.md$/;
const PROMPT_ID_PATTERN = /^\d{3}-\d{3}$/;

type PromptSection = { heading: string; body: string };

function parsePromptArtifact(markdown: string) {
  const errors: string[] = [];
  const headings = [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)];
  const sections: PromptSection[] = headings.map((match, index) => ({
    heading: match[1].trim(),
    body: markdown.slice(
      match.index! + match[0].length,
      headings[index + 1]?.index ?? markdown.length,
    ).trim(),
  }));
  const fenced = (body: string) =>
    body.match(/^```[^\r\n]*\r?\n([\s\S]*?)\r?\n```[ \t]*$/)?.[1].trim() ||
    undefined;
  const mainSections = sections.filter((section) => section.heading === "Main");
  if (mainSections.length !== 1) {
    errors.push(`expected exactly one Main section; found ${mainSections.length}`);
  }
  const main = mainSections.length === 1 ? fenced(mainSections[0].body) : undefined;
  if (mainSections.length === 1 && !main) {
    errors.push("Main must contain one non-empty fenced code block");
  }
  const numbered = sections.flatMap((section) => {
    const match = section.heading.match(/^Character\s+(\d+)$/);
    return match ? [{ number: Number(match[1]), body: section.body }] : [];
  });
  const seen = new Set<number>();
  for (const item of numbered) {
    if (seen.has(item.number)) errors.push(`duplicate Character ${item.number} section`);
    seen.add(item.number);
  }
  const sorted = [...seen].sort((a, b) => a - b);
  for (let index = 0; index < sorted.length; index++) {
    if (sorted[index] !== index + 1) {
      errors.push(
        `Character sections must be consecutive from Character 1; found ${sorted.join(", ")}`,
      );
      break;
    }
  }
  const characters: string[] = [];
  if (!errors.some((error) => error.startsWith("duplicate Character") || error.startsWith("Character sections"))) {
    for (const number of sorted) {
      const value = fenced(numbered.find((entry) => entry.number === number)!.body);
      if (!value) errors.push(`Character ${number} must contain one non-empty fenced code block`);
      else characters.push(value);
    }
  }
  if ([main, ...characters].filter(Boolean).some((value) => /\b(?:TODO|OPEN|N\/A)\b/i.test(value!))) {
    errors.push("Main or Character content contains unresolved TODO/OPEN/N/A metadata");
  }
  return errors.length || !main ? { errors } : { artifact: { main, characters }, errors };
}

function usage(): void {
  console.log(`Usage:
  bun <baseDir>/scripts/check.ts <comic-dir>

Read-only checks. Exits 1 on numbering, reference, or prompt-format errors.
No network access or file changes.`);
}

type Shot = {
  id: string;
  nn: string;
  mm: string;
  cast: string;
  promptId: string;
  line: number;
  page: number;
};
type CastEntry = { name: string; outfit: string };

function parseShots(board: string): Shot[] {
  const lines = board.split("\n");
  const shots: Shot[] = [];
  let page = 0;
  for (let i = 0; i < lines.length; i++) {
    const pm = lines[i].match(/^##\s+Page\s+(\d+)\b/);
    if (pm) page = parseInt(pm[1], 10);
    const sm = lines[i].match(/^###\s+Shot\s+(\d+)-(\d+)\b/);
    if (sm) {
      shots.push({
        id: `${sm[1]}-${sm[2]}`,
        nn: sm[1],
        mm: sm[2],
        cast: "",
        promptId: "",
        line: i + 1,
        page,
      });
    }
    const cm = lines[i].match(/^\*\*Cast\*\*:\s*(.+)$/);
    if (cm && shots.length > 0) shots[shots.length - 1].cast = cm[1].trim();
    const im = lines[i].match(/^\*\*Prompt ID\*\*:\s*(\S+)\s*$/);
    if (im && shots.length > 0) shots[shots.length - 1].promptId = im[1];
  }
  return shots;
}

function parseCast(cast: string): CastEntry[] | null {
  if (/^(none|—|-|无)$/i.test(cast.trim())) return [];
  const entries: CastEntry[] = [];
  for (const part of cast.split(",").map((value) => value.trim())) {
    const match = part.match(/^(.+?)\s*\(Outfit\s+([A-Za-z0-9]+)\)\s*$/);
    if (!match) return null;
    entries.push({ name: match[1].trim(), outfit: match[2] });
  }
  return entries;
}

export interface ComicCheck {
  errors: string[];
  infos: string[];
  shotIds: string[];
  pageCount: number;
}

/** Importable, offline and read-only text validation. */
export function validateComic(dir: string): ComicCheck {
  const errors: string[] = [];
  const infos: string[] = [];
  const boardPath = join(dir, "storyboard.md");
  if (!existsSync(boardPath)) {
    return {
      errors: [`storyboard.md missing in ${dir}`],
      infos,
      shotIds: [],
      pageCount: 0,
    };
  }

  const shots = parseShots(readFileSync(boardPath, "utf8"));
  if (!shots.length) errors.push("A: storyboard has no Shot records");
  const settingPath = join(dir, "project-settings.md");
  const settingText = existsSync(settingPath)
    ? readFileSync(settingPath, "utf8")
    : "";
  const settingModes = [
    ...settingText.matchAll(/^\s*(?:[-*]\s+)?Mode:\s*(\S+)\s*$/gmi),
  ].map((match) => match[1]);
  if (settingModes.length !== 1 || settingModes[0] !== "single-shot") {
    errors.push(
      "A: project-settings.md must exist and specify exactly one Mode: single-shot",
    );
  }
  const selectedBy = settingText.match(
    /^[-*]\s+Mode selected by:\s*(\S+)\s*$/mi,
  )?.[1];
  if (
    selectedBy && !["user-confirmed", "user-explicit"].includes(selectedBy)
  ) {
    errors.push(
      "A: Mode selected by must be user-confirmed or user-explicit",
    );
  }
  const maxNamedCast = Number(
    settingText.match(/^[-*]\s+Max named cast per Shot:\s*(\d+)/mi)?.[1] ??
      6,
  );
  const multiCharacterException =
    /^[-*]\s+Multi-character exception allowed:\s*yes\s*$/im.test(
      settingText,
    );

  const byPage = new Map<number, Shot[]>();
  for (const shot of shots) {
    if (!byPage.has(shot.page)) byPage.set(shot.page, []);
    byPage.get(shot.page)!.push(shot);
  }
  const pages = [...byPage.keys()].sort((a, b) => a - b);
  pages.forEach((page, index) => {
    if (page !== index + 1) {
      errors.push(
        `A: page order gap (found Page ${page} at position ${index + 1})`,
      );
    }
    byPage.get(page)!.forEach((shot, shotIndex) => {
      const wantNN = String(page).padStart(2, "0");
      const wantMM = String(shotIndex + 1).padStart(2, "0");
      if (shot.nn !== wantNN || shot.mm !== wantMM) {
        errors.push(
          `A: Shot ${shot.id} (line ${shot.line}) should be ${wantNN}-${wantMM} — run renumber.ts`,
        );
      }
    });
  });
  const ids = shots.map((shot) => shot.id);
  for (
    const id of [
      ...new Set(ids.filter((value, index) => ids.indexOf(value) !== index)),
    ]
  ) errors.push(`A: duplicate Shot id ${id}`);

  const promptIds = new Set<string>();
  for (const shot of shots) {
    if (!PROMPT_ID_PATTERN.test(shot.promptId)) {
      errors.push(
        `A: Shot ${shot.id} must record Prompt ID as NNN-MMM; found ${
          shot.promptId || "missing"
        }`,
      );
    } else if (promptIds.has(shot.promptId)) {
      errors.push(`A: duplicate Prompt ID ${shot.promptId}`);
    } else promptIds.add(shot.promptId);
  }

  const charsPath = join(dir, "characters", "characters.md");
  const charNames = new Set<string>();
  const outfits = new Map<string, Set<string>>();
  if (!existsSync(charsPath)) {
    errors.push("B: characters/characters.md missing");
  } else {
    let current: string | null = null;
    const characterText = readFileSync(charsPath, "utf8");
    for (const block of characterText.split(/(?=^##\s+Character\s+\d+:)/m)) {
      const name = block.match(/^##\s+Character\s+\d+:\s*(.+)/m)?.[1]
        .trim();
      if (
        !name ||
        !shots.some((shot) =>
          (parseCast(shot.cast) ?? []).some((entry) => entry.name === name)
        )
      ) continue;
      if (/\bTODO\s*\[(?:BLOCKING|CONFLICT)\]/i.test(block)) {
        errors.push(`B: unresolved blocking/conflict TODO for ${name}`);
      }
    }
    for (const line of characterText.split("\n")) {
      const heading = line.match(/^##\s+Character\s+\d+:\s*(.+?)\s*$/);
      if (heading) {
        current = heading[1].trim();
        charNames.add(current);
        outfits.set(current, new Set());
        continue;
      }
      const wardrobe = line.match(/^\*\*Wardrobe\s+([A-Za-z0-9]+)\b/);
      if (wardrobe && current) outfits.get(current)!.add(wardrobe[1]);
    }
  }

  for (const shot of shots) {
    if (!shot.cast) {
      errors.push(`B: Shot ${shot.id} (line ${shot.line}) has no Cast line`);
      continue;
    }
    const entries = parseCast(shot.cast);
    if (entries === null) {
      errors.push(
        `B: Shot ${shot.id} Cast must be "Name (Outfit ID)" entries or "none"`,
      );
      continue;
    }
    if (entries.length > maxNamedCast && !multiCharacterException) {
      errors.push(
        `B: Shot ${shot.id} has ${entries.length} cast (max ${maxNamedCast}; multi-character exception is not enabled)`,
      );
    }
    for (const entry of entries) {
      if (!charNames.has(entry.name)) {
        errors.push(
          `B: Shot ${shot.id} character "${entry.name}" not in characters.md`,
        );
      } else if (!outfits.get(entry.name)!.has(entry.outfit)) {
        errors.push(
          `B: Shot ${shot.id} outfit "${entry.outfit}" not in ${entry.name}'s Wardrobe`,
        );
      }
    }
  }

  const promptsDir = join(dir, "prompts");
  const referenced = new Set(shots.map((shot) => shot.promptId).filter(Boolean));
  if (existsSync(promptsDir)) {
    for (const file of readdirSync(promptsDir)) {
      if (file.includes("-backup-")) continue;
      if (file.endsWith(".md") && file !== "README.md" && !PROMPT_FILE_PATTERN.test(file)) {
        errors.push(`C: prompt filename must use NNN-MMM.md: ${file}`);
      }
      if (PROMPT_FILE_PATTERN.test(file) && !referenced.has(file.slice(0, -3))) {
        errors.push(`C: prompt not referenced by storyboard Prompt ID: ${file}`);
      }
    }
  }

  const missingPrompts: string[] = [];
  for (const shot of shots) {
    if (!PROMPT_ID_PATTERN.test(shot.promptId)) continue;
    const filename = `${shot.promptId}.md`;
    const path = join(promptsDir, filename);
    if (!existsSync(path)) {
      missingPrompts.push(shot.promptId);
      continue;
    }
    const parsed = parsePromptArtifact(readFileSync(path, "utf8"));
    for (const error of parsed.errors) {
      errors.push(`D: prompts/${filename} ${error}`);
    }
  }
  if (missingPrompts.length) {
    errors.push(`C: missing prompts for Prompt IDs: ${missingPrompts.join(", ")}`);
  }

  return { errors, infos, shotIds: ids, pageCount: pages.length };
}

function main(): void {
  const [dir, ...extra] = process.argv.slice(2);
  if (extra.length) throw new Error("Expected exactly one comic directory");
  if (!dir || dir === "-h" || dir === "--help") {
    usage();
    process.exitCode = 1;
    return;
  }
  const { errors, infos, shotIds, pageCount } = validateComic(dir);
  console.log(`Shots: ${shotIds.length} | Pages: ${pageCount}`);
  if (errors.length === 0) console.log("✓ all checks passed");
  else {
    console.log("Errors:");
    for (const error of errors) console.log(`  ✗ ${error}`);
  }
  for (const info of infos) console.log(`  · ${info}`);
  process.exitCode = errors.length === 0 ? 0 : 1;
}

if (import.meta.main) main();
