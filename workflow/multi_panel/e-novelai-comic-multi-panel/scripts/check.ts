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

type Cast = { name: string; outfit: string };
type Panel = {
  id: string;
  position: string;
  cast: Cast[];
  fields: Record<string, string>;
};
type Page = {
  id: string;
  promptId: string;
  panels: Panel[];
  fields: Record<string, string>;
};

const text = (path: string) => readFileSync(path, "utf8");
const field = (block: string, name: string) =>
  block.match(new RegExp(`^\\*\\*${name}\\*\\*:\\s*(.+)$`, "mi"))?.[1]
    .trim() ?? "";

function cast(value: string): Cast[] | null {
  if (/^(none|—|-|无)$/i.test(value.trim())) return [];
  const out: Cast[] = [];
  for (const part of value.split(",").map((item) => item.trim())) {
    const match = part.match(/^(.+?)\s*\(Outfit\s+([A-Za-z0-9]+)\)$/);
    if (!match) return null;
    out.push({ name: match[1].trim(), outfit: match[2] });
  }
  return out;
}

function parseStoryboard(doc: string): Page[] {
  const heads = [...doc.matchAll(/^##\s+Page\s+(\d{2})\b.*$/gm)];
  return heads.map((heading, index) => {
    const block = doc.slice(heading.index!, heads[index + 1]?.index ?? doc.length);
    const panelHeads = [...block.matchAll(/^###\s+Panel\s+(\d{2}-\d{2})\b.*$/gm)];
    const panels = panelHeads.map((panelHeading, panelIndex) => {
      const part = block.slice(
        panelHeading.index!,
        panelHeads[panelIndex + 1]?.index ?? block.length,
      );
      const raw = field(part, "Cast");
      const parsed = cast(raw);
      return {
        id: panelHeading[1],
        position: field(part, "Position"),
        cast: parsed ?? [],
        fields: {
          cast: raw,
          size: field(part, "Size"),
          source: field(part, "Source"),
          scene: field(part, "Scene"),
          text: field(part, "Text"),
          continuity: field(part, "Continuity"),
        },
      };
    });
    return {
      id: heading[1],
      promptId: field(block, "Prompt ID"),
      panels,
      fields: {
        source: field(block, "Source"),
        count: field(block, "Panel Count"),
        direction: field(block, "Reading Direction"),
        order: field(block, "Reading Order"),
        orientation: field(block, "Page Orientation"),
        layout: field(block, "Layout"),
        purpose: field(block, "Page Purpose"),
      },
    };
  });
}

export function validateMultiPanel(dir: string) {
  const errors: string[] = [];
  const infos: string[] = [];
  const settings = join(dir, "project-settings.md");
  const settingText = existsSync(settings) ? text(settings) : "";
  const settingModes = [
    ...settingText.matchAll(/^\s*(?:[-*]\s+)?Mode:\s*(\S+)\s*$/gmi),
  ].map((match) => match[1]);
  if (settingModes.length !== 1 || settingModes[0] !== "multi-panel-page") {
    errors.push(
      "A: project-settings.md must exist and specify exactly one Mode: multi-panel-page",
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
  const setting = (name: string) =>
    settingText.match(new RegExp(`^-\\s+${name}:\\s*(.+)$`, "mi"))?.[1]
      .trim() ?? "";
  const maxMajor = Number(setting("Max major characters per Page") || 6);
  const allowedText = new Set([
    "speech-bubble",
    "jagged-speech-bubble",
    "thought-bubble",
    "narrator-box",
    "sound-effect",
    "prop-text",
    "environment-text",
  ]);
  const visibleRaw = setting("Visible text types");
  const visibleTypes = new Set(
    visibleRaw === "all"
      ? [...allowedText]
      : visibleRaw.split(",").map((value) => value.trim()).filter(Boolean),
  );
  if (
    !visibleRaw ||
    (visibleTypes.has("none") && visibleTypes.size !== 1) ||
    [...visibleTypes].some((value) =>
      value !== "none" && !allowedText.has(value)
    )
  ) {
    errors.push(
      "A: Visible text types contains an unsupported value or mixes none with other types",
    );
  }
  const projectDirection = setting("Reading direction");
  if (
    ![
      "left-to-right, top-to-bottom",
      "right-to-left, top-to-bottom",
      "top-to-bottom",
    ].includes(projectDirection) &&
    !(projectDirection.startsWith("custom:") && projectDirection.slice(7).trim())
  ) {
    errors.push(
      "A: Reading direction must use a documented value or custom:<description>",
    );
  }
  const orientation = setting("Default Page orientation");
  if (
    !["portrait", "landscape", "square", "vertical-scroll"].includes(
      orientation,
    ) &&
    !(orientation.startsWith("custom:") && orientation.slice(7).trim())
  ) {
    errors.push(
      "A: Default Page orientation must use a documented value or custom:<description>",
    );
  }
  if (!setting("Additional layout restrictions")) {
    errors.push(
      "A: Additional layout restrictions must be present; use none when unrestricted",
    );
  }

  const board = join(dir, "storyboard.md");
  if (!existsSync(board)) {
    return { errors: [...errors, "storyboard.md missing"], infos, pages: [] };
  }
  const pages = parseStoryboard(text(board));
  if (!pages.length) errors.push("B: storyboard has no Page records");

  const chars = join(dir, "characters", "characters.md");
  const names = new Set<string>();
  const outfits = new Map<string, Set<string>>();
  const characterBlocks = new Map<string, string>();
  const blockedReported = new Set<string>();
  if (!existsSync(chars)) errors.push("C: characters/characters.md missing");
  else {
    const characterText = text(chars);
    let current = "";
    for (const block of characterText.split(/(?=^##\s+Character\s+\d+:)/m)) {
      const heading = block.match(/^##\s+Character\s+\d+:\s*(.+)$/m);
      if (heading) characterBlocks.set(heading[1].trim(), block);
    }
    for (const line of characterText.split("\n")) {
      const heading = line.match(/^##\s+Character\s+\d+:\s*(.+)$/);
      if (heading) {
        current = heading[1].trim();
        names.add(current);
        outfits.set(current, new Set());
        continue;
      }
      const wardrobe = line.match(/^\*\*Wardrobe\s+([A-Za-z0-9]+)\b/);
      if (wardrobe && current) outfits.get(current)!.add(wardrobe[1]);
    }
  }

  const promptIds = new Set<string>();
  pages.forEach((page, pageIndex) => {
    const want = String(pageIndex + 1).padStart(2, "0");
    if (page.id !== want) errors.push(`B: Page ${page.id} should be ${want}`);
    if (!PROMPT_ID_PATTERN.test(page.promptId)) {
      errors.push(
        `B: Page ${page.id} must record Prompt ID as NNN-MMM; found ${
          page.promptId || "missing"
        }`,
      );
    } else if (promptIds.has(page.promptId)) {
      errors.push(`B: duplicate Prompt ID ${page.promptId}`);
    } else promptIds.add(page.promptId);

    for (const [key, value] of Object.entries(page.fields)) {
      if (!value) errors.push(`B: Page ${page.id} missing ${key}`);
    }
    if (projectDirection && page.fields.direction !== projectDirection) {
      errors.push(
        `B: Page ${page.id} Reading Direction must match project-settings.md`,
      );
    }
    if (Number(page.fields.count) !== page.panels.length) {
      errors.push(
        `B: Page ${page.id} Panel Count does not match actual panels`,
      );
    }
    const ids = page.panels.map((panel) => panel.id);
    const order = page.fields.order.match(/\d{2}-\d{2}/g) ?? [];
    if (JSON.stringify(order) !== JSON.stringify(ids)) {
      errors.push(
        `B: Page ${page.id} Reading Order must list panels in document order`,
      );
    }

    const positions = new Set<string>();
    const major = new Set<string>();
    page.panels.forEach((panel, panelIndex) => {
      const wantId = `${page.id}-${String(panelIndex + 1).padStart(2, "0")}`;
      if (panel.id !== wantId) {
        errors.push(`B: Panel ${panel.id} should be ${wantId}`);
      }
      for (const [key, value] of Object.entries(panel.fields)) {
        if (!value) errors.push(`B: Panel ${panel.id} missing ${key}`);
      }
      const panelText = panel.fields.text;
      if (panelText && !/^(?:none|—|-|无)$/i.test(panelText)) {
        if (visibleTypes.has("none")) {
          errors.push(
            `B: Panel ${panel.id} contains visible text but project-settings.md enables none`,
          );
        }
        if (
          /^Speech\b/i.test(panelText) &&
          !visibleTypes.has("speech-bubble") &&
          !visibleTypes.has("jagged-speech-bubble")
        ) errors.push(`B: Panel ${panel.id} uses Speech but no speech-bubble type is enabled`);
        if (/^Thought\b/i.test(panelText) && !visibleTypes.has("thought-bubble")) {
          errors.push(`B: Panel ${panel.id} uses Thought but thought-bubble is not enabled`);
        }
        if (/^(?:Caption|Narrator)\b/i.test(panelText) && !visibleTypes.has("narrator-box")) {
          errors.push(`B: Panel ${panel.id} uses Caption but narrator-box is not enabled`);
        }
        if (/^SFX\b/i.test(panelText) && !visibleTypes.has("sound-effect")) {
          errors.push(`B: Panel ${panel.id} uses SFX but sound-effect is not enabled`);
        }
        if (
          /^Diegetic\b/i.test(panelText) &&
          !visibleTypes.has("prop-text") &&
          !visibleTypes.has("environment-text")
        ) errors.push(`B: Panel ${panel.id} uses Diegetic text but prop-text/environment-text is not enabled`);
      }
      if (!panel.position) errors.push(`B: Panel ${panel.id} missing position`);
      else if (positions.has(panel.position.toLowerCase())) {
        errors.push(
          `B: duplicate Panel position on Page ${page.id}: ${panel.position}`,
        );
      } else positions.add(panel.position.toLowerCase());

      const parsed = cast(panel.fields.cast);
      if (parsed === null) errors.push(`C: Panel ${panel.id} Cast format invalid`);
      for (const entry of panel.cast) {
        major.add(entry.name);
        if (!names.has(entry.name)) {
          errors.push(`C: Panel ${panel.id} character "${entry.name}" missing`);
        } else {
          if (!outfits.get(entry.name)!.has(entry.outfit)) {
            errors.push(
              `C: Panel ${panel.id} Outfit ${entry.outfit} missing for ${entry.name}`,
            );
          }
          if (
            !blockedReported.has(entry.name) &&
            /\bTODO\s*\[(?:BLOCKING|CONFLICT)\]/i.test(
              characterBlocks.get(entry.name) ?? "",
            )
          ) {
            errors.push(
              `C: unresolved blocking/conflict TODO for ${entry.name}`,
            );
            blockedReported.add(entry.name);
          }
        }
      }
    });
    if (major.size > maxMajor) {
      errors.push(
        `C: Page ${page.id} has ${major.size} major characters; max ${maxMajor}`,
      );
    }

    if (!PROMPT_ID_PATTERN.test(page.promptId)) return;
    const filename = `${page.promptId}.md`;
    const path = join(dir, "prompts", filename);
    if (!existsSync(path)) {
      errors.push(`D: missing prompts/${filename}`);
      return;
    }
    const parsed = parsePromptArtifact(text(path));
    for (const error of parsed.errors) {
      errors.push(`D: prompts/${filename} ${error}`);
    }
    const main = parsed.artifact?.main ?? "";
    if (page.panels.length > 1 && !/\bborderless panels\b/i.test(main)) {
      errors.push(
        `D: prompts/${filename} multi-panel Main needs borderless panels`,
      );
    }
    if (page.panels.length === 1 && /\bborderless panels\b/i.test(main)) {
      errors.push(
        `D: prompts/${filename} Page with one Panel must omit borderless panels`,
      );
    }
  });

  const promptDir = join(dir, "prompts");
  if (existsSync(promptDir)) {
    for (const filename of readdirSync(promptDir)) {
      if (filename.includes("-backup-")) continue;
      if (
        filename.endsWith(".md") && filename !== "README.md" &&
        !PROMPT_FILE_PATTERN.test(filename)
      ) errors.push(`D: prompt filename must use NNN-MMM.md: ${filename}`);
      if (
        PROMPT_FILE_PATTERN.test(filename) &&
        !promptIds.has(filename.slice(0, -3))
      ) errors.push(`D: orphan prompt file ${filename}`);
    }
  }
  return { errors, infos, pages: pages.map((page) => page.id) };
}

if (import.meta.main) {
  const [dir, ...extra] = process.argv.slice(2);
  if (!dir || extra.length) {
    console.log("Usage: bun scripts/check.ts <comic-dir>");
    process.exit(1);
  }
  const result = validateMultiPanel(dir);
  console.log(`Pages: ${result.pages.length}`);
  for (const error of result.errors) console.log(`✗ ${error}`);
  if (!result.errors.length) console.log("✓ all checks passed");
  process.exitCode = result.errors.length ? 1 : 0;
}
