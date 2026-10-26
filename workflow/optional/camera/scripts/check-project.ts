import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export interface CameraProjectCheck {
  enabled: boolean;
  setting: string;
  errors: string[];
  warnings: string[];
  infos: string[];
  promptIds: string[];
}

type CameraContext = {
  label: string;
  position?: string;
  tags: string[];
};

type PromptExpectation = {
  promptId: string;
  contexts: CameraContext[];
};

const PROMPT_ID_PATTERN = /^\d{3}-\d{3}$/;
const CAMERA_FIELD_PATTERN = /^\*\*optional\.camera\.tags\*\*:\s*(.*)$/gm;

function text(path: string): string {
  return readFileSync(path, "utf8");
}

function field(block: string, name: string): string {
  return block.match(new RegExp(`^\\*\\*${name}\\*\\*:\\s*(.+)$`, "m"))?.[1]
    .trim() ?? "";
}

function optionalCameraSetting(settings: string, errors: string[]): string {
  const headings = [...settings.matchAll(/^##\s+Optional Modules\s*$/gm)];
  if (headings.length > 1) {
    errors.push("project-settings.md contains duplicate Optional Modules sections");
  }
  if (!headings.length) return "off";
  const start = headings[0].index! + headings[0][0].length;
  const next = settings.slice(start).search(/^##\s+/m);
  const block = settings.slice(start, next < 0 ? settings.length : start + next);
  const values = [...block.matchAll(/^[-*]\s+camera:\s*(\S+)\s*$/gm)].map(
    (match) => match[1],
  );
  if (values.length > 1) errors.push("camera setting must appear at most once");
  for (const value of values) {
    if (!new Set(["off", "required"]).has(value)) {
      errors.push(`camera setting must be off or required; found ${value}`);
    }
  }
  return values[0] ?? "off";
}

function parseTags(
  value: string,
  label: string,
  catalog: Set<string>,
  errors: string[],
): string[] {
  if (!value.trim()) {
    errors.push(`${label} has an empty optional.camera.tags field`);
    return [];
  }
  if (/\b(?:TODO|OPEN|N\/A)\b/i.test(value)) {
    errors.push(`${label} optional.camera.tags contains unresolved TODO/OPEN/N/A`);
  }
  const tags = value.split(",").map((tag) => tag.trim()).filter(Boolean);
  if (!tags.length) errors.push(`${label} optional.camera.tags contains no tags`);
  const duplicates = [...new Set(tags.filter((tag, index) => tags.indexOf(tag) !== index))];
  for (const tag of duplicates) {
    errors.push(`${label} optional.camera.tags repeats tag: ${tag}`);
  }
  for (const tag of tags) {
    if (!catalog.has(tag)) {
      errors.push(`${label} optional.camera.tags uses unknown canonical tag: ${tag}`);
    }
  }
  return tags;
}

function cameraContext(
  block: string,
  label: string,
  catalog: Set<string>,
  errors: string[],
  position?: string,
): CameraContext {
  const matches = [...block.matchAll(CAMERA_FIELD_PATTERN)];
  if (matches.length !== 1) {
    errors.push(
      `${label} must contain exactly one optional.camera.tags field; found ${matches.length}`,
    );
  }
  return {
    label,
    position,
    tags: matches.length === 1
      ? parseTags(matches[0][1], label, catalog, errors)
      : [],
  };
}

function parseStoryboard(
  markdown: string,
  catalog: Set<string>,
  errors: string[],
): PromptExpectation[] {
  const shotHeads = [...markdown.matchAll(/^###\s+Shot\s+([^\s—]+).*$/gm)];
  const pageHeads = [...markdown.matchAll(/^##\s+Page\s+([^\s—]+).*$/gm)];
  const hasPanels = /^###\s+Panel\s+/m.test(markdown);

  if (shotHeads.length && hasPanels) {
    errors.push("storyboard.md mixes Shot and Panel records; Camera checker cannot map prompts");
    return [];
  }

  if (shotHeads.length) {
    return shotHeads.map((heading, index) => {
      const block = markdown.slice(
        heading.index!,
        shotHeads[index + 1]?.index ?? markdown.length,
      );
      const promptId = field(block, "Prompt ID");
      const label = `Shot ${heading[1]}`;
      if (!PROMPT_ID_PATTERN.test(promptId)) {
        errors.push(`${label} must record Prompt ID as NNN-MMM`);
      }
      return {
        promptId,
        contexts: [cameraContext(block, label, catalog, errors)],
      };
    });
  }

  if (hasPanels) {
    return pageHeads.map((heading, pageIndex) => {
      const block = markdown.slice(
        heading.index!,
        pageHeads[pageIndex + 1]?.index ?? markdown.length,
      );
      const firstPanel = block.search(/^###\s+Panel\s+/m);
      const pageHeader = firstPanel < 0 ? block : block.slice(0, firstPanel);
      const promptId = field(pageHeader, "Prompt ID");
      const pageLabel = `Page ${heading[1]}`;
      if (!PROMPT_ID_PATTERN.test(promptId)) {
        errors.push(`${pageLabel} must record Prompt ID as NNN-MMM`);
      }
      const panelHeads = [...block.matchAll(/^###\s+Panel\s+([^\s—]+).*$/gm)];
      if (!panelHeads.length) errors.push(`${pageLabel} has no Panel records`);
      const contexts = panelHeads.map((panelHeading, panelIndex) => {
        const panelBlock = block.slice(
          panelHeading.index!,
          panelHeads[panelIndex + 1]?.index ?? block.length,
        );
        const label = `Panel ${panelHeading[1]}`;
        const position = field(panelBlock, "Position");
        if (!position) errors.push(`${label} must record Position for Camera compilation`);
        return cameraContext(panelBlock, label, catalog, errors, position);
      });
      return { promptId, contexts };
    });
  }

  errors.push("storyboard.md has no Shot or Panel records for Camera checking");
  return [];
}

function fencedSection(markdown: string, heading: string): string | undefined {
  const headings = [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)];
  const matches = headings
    .map((match, index) => ({
      name: match[1].trim(),
      body: markdown.slice(
        match.index! + match[0].length,
        headings[index + 1]?.index ?? markdown.length,
      ).trim(),
    }))
    .filter((section) => section.name === heading);
  if (matches.length !== 1) return undefined;
  return matches[0].body.match(
    /^```[^\r\n]*\r?\n([\s\S]*?)\r?\n```[ \t]*$/,
  )?.[1].trim();
}

function characterValues(markdown: string): string[] {
  const headings = [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)];
  return headings.flatMap((heading, index) => {
    if (!/^Character\s+\d+$/.test(heading[1].trim())) return [];
    const body = markdown.slice(
      heading.index! + heading[0].length,
      headings[index + 1]?.index ?? markdown.length,
    ).trim();
    const value = body.match(/^```[^\r\n]*\r?\n([\s\S]*?)\r?\n```[ \t]*$/)?.[1]
      .trim();
    return value ? [value] : [];
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countTag(value: string, tag: string): number {
  const pattern = new RegExp(
    `(^|[^a-z0-9])${escapeRegExp(tag)}(?=$|[^a-z0-9])`,
    "gi",
  );
  return [...value.matchAll(pattern)].length;
}

function panelClause(main: string, position: string): string | undefined {
  const match = main.match(
    new RegExp(`${escapeRegExp(position)}\\s*:\\s*([^;]+)(?:;|$)`, "i"),
  );
  return match?.[1];
}

function loadCatalog(moduleDir: string, errors: string[]): Set<string> {
  const path = join(moduleDir, "dataset-camera-tag", "camera_tags.yaml");
  if (!existsSync(path)) {
    errors.push("Camera canonical catalog is missing");
    return new Set();
  }
  const tags = new Set<string>();
  for (const line of text(path).split("\n")) {
    const match = line.match(/^\s*-\s+tag:\s*(.*?)\s*$/);
    if (match?.[1]) tags.add(match[1]);
  }
  if (!tags.size) errors.push("Camera canonical catalog contains no tags");
  return tags;
}

export function validateCameraProject(projectDir: string): CameraProjectCheck {
  const errors: string[] = [];
  const warnings: string[] = [];
  const infos: string[] = [];
  const root = resolve(projectDir);
  const settingsPath = join(root, "project-settings.md");
  if (!existsSync(settingsPath)) {
    return {
      enabled: false,
      setting: "missing",
      errors: ["project-settings.md is missing"],
      warnings,
      infos,
      promptIds: [],
    };
  }

  const setting = optionalCameraSetting(text(settingsPath), errors);
  const enabled = setting === "required";
  if (!enabled) {
    if (!errors.length) infos.push(`Camera module is ${setting}; project Camera checks skipped`);
    return { enabled, setting, errors, warnings, infos, promptIds: [] };
  }
  infos.push("Camera module is enabled with option required");

  const storyboardPath = join(root, "storyboard.md");
  if (!existsSync(storyboardPath)) {
    return {
      enabled,
      setting,
      errors: [...errors, "storyboard.md is missing"],
      warnings,
      infos,
      promptIds: [],
    };
  }

  const moduleDir = resolve(import.meta.dir, "..");
  const catalog = loadCatalog(moduleDir, errors);
  const expected = parseStoryboard(text(storyboardPath), catalog, errors);
  const promptIds = expected.map((item) => item.promptId).filter(Boolean);
  const duplicates = [...new Set(promptIds.filter((id, index) => promptIds.indexOf(id) !== index))];
  for (const id of duplicates) errors.push(`duplicate Storyboard Prompt ID: ${id}`);

  const promptsDir = join(root, "prompts");
  if (!existsSync(promptsDir)) {
    errors.push("prompts directory is missing");
    return { enabled, setting, errors, warnings, infos, promptIds };
  }

  for (const item of expected) {
    if (!PROMPT_ID_PATTERN.test(item.promptId)) continue;
    const filename = `${item.promptId}.md`;
    const path = join(promptsDir, filename);
    if (!existsSync(path)) {
      errors.push(`${filename} is missing for Camera-enabled Storyboard unit`);
      continue;
    }
    const markdown = text(path);
    if (markdown.includes("optional.camera.tags")) {
      errors.push(`${filename} must not copy the optional.camera.tags field name`);
    }
    const main = fencedSection(markdown, "Main");
    if (!main) {
      errors.push(`${filename} must contain exactly one non-empty fenced Main section`);
      continue;
    }
    const characters = characterValues(markdown);
    const expectedCounts = new Map<string, number>();
    for (const context of item.contexts) {
      for (const tag of context.tags) {
        expectedCounts.set(tag, (expectedCounts.get(tag) ?? 0) + 1);
        if (characters.some((value) => countTag(value, tag) > 0)) {
          errors.push(`${filename} Camera tag must not be written in Character blocks: ${tag}`);
        }
      }
      if (context.position && context.tags.length) {
        const clause = panelClause(main, context.position);
        if (!clause) {
          errors.push(
            `${filename} missing Camera clause for ${context.label} position: ${context.position}`,
          );
        } else {
          for (const tag of context.tags) {
            if (countTag(clause, tag) < 1) {
              errors.push(
                `${filename} ${context.label} Camera clause is missing tag: ${tag}`,
              );
            }
          }
        }
      }
    }
    for (const [tag, count] of expectedCounts) {
      const actual = countTag(main, tag);
      if (actual < count) {
        errors.push(
          `${filename} Main contains Camera tag ${actual}/${count} required times: ${tag}`,
        );
      }
    }
  }

  if (!errors.length) {
    infos.push(
      `Camera project check passed for ${expected.length} Prompt unit(s) and ${promptIds.length} Prompt ID(s)`,
    );
  }
  return { enabled, setting, errors, warnings, infos, promptIds };
}

function usage(): void {
  console.log(`Usage:
  bun workflow/optional/camera/scripts/check-project.ts <comic-project-dir>

Reads project-settings.md. When camera is required, validates Storyboard optional.camera.tags and their compilation into prompts/NNN-MMM.md Main blocks.`);
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.includes("-h") || args.includes("--help")) {
    usage();
    return;
  }
  if (args.length !== 1) {
    usage();
    process.exit(2);
  }
  const result = validateCameraProject(args[0]);
  for (const info of result.infos) console.log(`INFO: ${info}`);
  for (const warning of result.warnings) console.warn(`WARNING: ${warning}`);
  for (const error of result.errors) console.error(`ERROR: ${error}`);
  console.log(
    `Camera project check: setting=${result.setting}, enabled=${result.enabled}, prompts=${result.promptIds.length}, errors=${result.errors.length}`,
  );
  if (result.errors.length) process.exit(1);
}

if (import.meta.main) main();
