import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type YesNo = "yes" | "no";
type Options = {
  root: string;
  title: string;
  source: string;
  modeSelectedBy: "user-confirmed" | "user-explicit";
  modifySource: YesNo;
  beatReview: YesNo;
  storyboardReview: YesNo;
  promptSummary: YesNo;
  promptIdMeaning: string;
  maxMajor: number;
  visibleTextTypes: string;
  readingDirection: string;
  pageOrientation: string;
  layoutRestrictions: string;
  dryRun: boolean;
};

function usage(): void {
  console.log(`Usage:
  bun <baseDir>/scripts/new-multi_panel-comic.ts <topic-slug> [options]

Required:
  <topic-slug>                         2-4 lowercase kebab-case words

Project options:
  --root <dir>                         Project parent directory (default: comic)
  --title <text>                       Project title (default: slug)
  --source <path-or-note>              Source record (default: story.md)
  --mode-selected-by user-confirmed|user-explicit  How the user selected the mode (default: user-confirmed)
  --dry-run                            Print proposed project-settings.md; create nothing
  --show-options                       Show all Multi Panel choices and examples

Common options:
  --modify-source yes|no               Modify the source story file (default: no)
  --beat-review yes|no                 Pause after Beat review (default: yes)
  --storyboard-review yes|no           Pause after Storyboard review (default: yes)
  --prompt-summary yes|no              Summarize final Prompts (default: yes)
  --prompt-id-meaning <text>            Meaning of NNN-MMM within this project (default: chapter-page)

Multi-panel defaults:
  --max-major-characters 6
  --visible-text-types none|all|<comma-separated-types>
  --reading-direction <quoted-value>
  --page-orientation portrait|landscape|square|vertical-scroll|custom:<description>
  --layout-restrictions <quoted-free-text>

Run --show-options for visible-text, reading-direction, orientation, and layout-restriction examples.
Running without --dry-run accepts the displayed settings and creates the project.
If the project directory already exists, initialization stops and requires a new slug.`);
}

function showOptions(): void {
  console.log(`Multi Panel selectable options

Character blocks:
  Character N is an independent local prompt block. It may describe a Panel base image, one or more detailed subjects in the same Panel, a repeated subject in another Panel, a prop, an environment detail, or an overlay. Character count is not derived from person count or Panel count.

Visible text types (comma-separated):
  none
  speech-bubble
  jagged-speech-bubble
  thought-bubble
  narrator-box
  sound-effect
  prop-text
  environment-text
  all  -> expands to every type above except none

Reading direction examples:
  "left-to-right, top-to-bottom"   Default western/left-reading page
  "right-to-left, top-to-bottom"  Right-reading manga
  "top-to-bottom"                 Single-column or vertical sequence
  "custom: top center, then clockwise"  Free-form project-specific order

Page orientation:
  portrait
  landscape
  square
  vertical-scroll
  custom:<description>

Additional layout restrictions are free text. Examples:
  "每页固定四格"
  "只使用 2×2"
  "禁止斜格"
  "禁止破框"
  "禁止前景覆盖"
  "每页最多三个 Panel"
  "最后一个 Panel 必须是全宽格"
  "全部页面保持相同网格"
  "必须使用四格漫画结构"

Quote values containing spaces or shell punctuation.`);
}

function requireValue(args: string[], index: number, option: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${option} requires a value`);
  return value;
}
function yesNo(value: string, option: string): YesNo {
  if (value !== "yes" && value !== "no") throw new Error(`${option} must be yes or no`);
  return value;
}
function oneOf<T extends string>(value: string, allowed: readonly T[], option: string): T {
  if (!allowed.includes(value as T)) throw new Error(`${option} must be one of: ${allowed.join(", ")}`);
  return value as T;
}
function positiveInt(value: string, option: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) throw new Error(`${option} must be a positive integer`);
  return n;
}

const VISIBLE_TEXT_TYPES = [
  "speech-bubble",
  "jagged-speech-bubble",
  "thought-bubble",
  "narrator-box",
  "sound-effect",
  "prop-text",
  "environment-text",
] as const;

function visibleTextTypes(value: string, option: string): string {
  if (value === "none") return value;
  if (value === "all") return VISIBLE_TEXT_TYPES.join(",");
  const values = [...new Set(value.split(",").map((v) => v.trim()).filter(Boolean))];
  if (!values.length || values.includes("none") || values.some((v) => !VISIBLE_TEXT_TYPES.includes(v as typeof VISIBLE_TEXT_TYPES[number])))
    throw new Error(`${option} must be none, all, or a comma-separated list from: ${VISIBLE_TEXT_TYPES.join(", ")}`);
  return values.join(",");
}

function readingDirection(value: string, option: string): string {
  const aliases: Record<string, string> = {
    "left-to-right-top-to-bottom": "left-to-right, top-to-bottom",
    "right-to-left-top-to-bottom": "right-to-left, top-to-bottom",
  };
  const normalized = aliases[value] ?? value;
  if (["left-to-right, top-to-bottom", "right-to-left, top-to-bottom", "top-to-bottom"].includes(normalized)) return normalized;
  if (normalized.startsWith("custom:") && normalized.slice("custom:".length).trim()) return normalized;
  throw new Error(`${option} must be a documented direction or custom:<description>; run --show-options`);
}

function pageOrientation(value: string, option: string): string {
  if (["portrait", "landscape", "square", "vertical-scroll"].includes(value)) return value;
  if (value.startsWith("custom:") && value.slice("custom:".length).trim()) return value;
  throw new Error(`${option} must be portrait, landscape, square, vertical-scroll, or custom:<description>`);
}

function parseArgs(args: string[]): { slug: string; options: Options } {
  const positional: string[] = [];
  const options: Options = {
    root: "comic", title: "", source: "story.md", modeSelectedBy: "user-confirmed",
    modifySource: "no", beatReview: "yes", storyboardReview: "yes", promptSummary: "yes",
    promptIdMeaning: "chapter-page (default chapter/section 001 when the project has no chapters)",
    maxMajor: 6, visibleTextTypes: "none",
    readingDirection: "left-to-right, top-to-bottom", pageOrientation: "portrait", layoutRestrictions: "none",
    dryRun: false,
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") { options.dryRun = true; continue; }
    if (!arg.startsWith("--")) { positional.push(arg); continue; }
    const value = requireValue(args, i, arg); i++;
    switch (arg) {
      case "--root": options.root = value; break;
      case "--title": options.title = value; break;
      case "--source": options.source = value; break;
      case "--mode-selected-by":
        if (value !== "user-confirmed" && value !== "user-explicit") throw new Error(`${arg} must be user-confirmed or user-explicit`);
        options.modeSelectedBy = value; break;
      case "--modify-source": options.modifySource = yesNo(value, arg); break;
      case "--beat-review": options.beatReview = yesNo(value, arg); break;
      case "--storyboard-review": options.storyboardReview = yesNo(value, arg); break;
      case "--prompt-summary": options.promptSummary = yesNo(value, arg); break;
      case "--prompt-id-meaning": options.promptIdMeaning = value; break;
      case "--max-major-characters": options.maxMajor = positiveInt(value, arg); break;
      case "--visible-text-types": options.visibleTextTypes = visibleTextTypes(value, arg); break;
      case "--reading-direction": options.readingDirection = readingDirection(value, arg); break;
      case "--page-orientation": options.pageOrientation = pageOrientation(value, arg); break;
      case "--layout-restrictions": options.layoutRestrictions = value; break;
      default: throw new Error(`Unknown option: ${arg}`);
    }
  }
  if (positional.length !== 1) throw new Error("Expected exactly one topic slug");
  const slug = positional[0];
  if (!/^[a-z0-9]+(-[a-z0-9]+){1,3}$/.test(slug)) throw new Error("Use 2-4 words in lowercase kebab-case");
  if (!options.title) options.title = slug;
  return { slug, options };
}

function renderProjectSettings(slug: string, o: Options): string {
  return `# Project Settings — ${o.title}

- Project slug: ${slug}
- Project state: new
- Mode: multi-panel-page
- Mode selected by: ${o.modeSelectedBy}
- Scope: final-prompts
- Source: ${o.source}
- Create missing workflow files: yes
- Overwrite existing files: no
- Modify source story files: ${o.modifySource}
- Preserve source facts separately: yes
- Beat review gate: ${o.beatReview}
- Storyboard review gate: ${o.storyboardReview}
- Prompt summary required: ${o.promptSummary}
- Prompt ID format: NNN-MMM
- Prompt ID meaning: ${o.promptIdMeaning}

## Multi-panel Settings

- Max major characters per Page: ${o.maxMajor}
- Visible text types: ${o.visibleTextTypes}
- Reading direction: ${o.readingDirection}
- Default Page orientation: ${o.pageOrientation}
- Additional layout restrictions: ${o.layoutRestrictions}

## Confirmed Content Boundaries

- Missing identity, recognizable-feature, or Wardrobe facts: TODO [BLOCKING]; the user must provide a value or choose OPEN / N/A where applicable.
- Conflicting source facts: TODO [CONFLICT]; preserve the conflicting sources until the user chooses.
- OPEN is not a concrete design and must not be compiled into invented fixed colors, materials, hairstyles, or clothing details.
- Unprovided dialogue, captions, and other visible comic text must not be invented.
- Story events, order, character relationships, and source facts must not be changed without explicit user approval recorded in the project.
- Unresolved TODO [BLOCKING] / TODO [CONFLICT] for the current cast or Wardrobe prevents final page planning, Storyboard, and Prompt creation. After the user resolves them, reread the complete character file.
- Over-budget pages and competing complex Layout plans require user confirmation where project settings do not already resolve the choice.
`;
}

function printProposal(slug: string, o: Options, setting: string): void {
  console.log(`Multi-panel project proposal:
- Title: ${o.title}
- Slug: ${slug}
- Source: ${o.source}
- Mode: multi-panel-page
- Scope: final-prompts
- Reading direction: ${o.readingDirection}
- Page orientation: ${o.pageOrientation}
- Existing project directories: initialization stops; choose a new slug

--- project-settings.md ---
${setting}
Choice reminder:
- Character N is a flexible local prompt block; its count is not tied to person or Panel count.
- Visible text types: none | speech-bubble | jagged-speech-bubble | thought-bubble | narrator-box | sound-effect | prop-text | environment-text | all
- Reading direction: left-to-right, top-to-bottom | right-to-left, top-to-bottom | top-to-bottom | custom:<description>
- Page orientation: portrait | landscape | square | vertical-scroll | custom:<description>
- Additional layout restrictions: free text, e.g. 每页固定四格；只使用 2×2；禁止破框
Run --show-options for explanations and the complete example list.`);
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--show-options") { showOptions(); return; }
  if (!args.length || args.includes("-h") || args.includes("--help")) { usage(); process.exit(args.length ? 0 : 1); }
  try {
    const { slug, options } = parseArgs(args);
    const setting = renderProjectSettings(slug, options);
    printProposal(slug, options, setting);
    if (options.dryRun) {
      console.log("Dry run: no files created. Run again without --dry-run to accept these values.");
      return;
    }

    mkdirSync(options.root, { recursive: true });
    const dir = join(options.root, slug);
    if (existsSync(dir)) {
      throw new Error(`Project already exists: ${dir}/. Use the existing project or provide a new slug.`);
    }
    mkdirSync(dir);
    mkdirSync(join(dir, "characters"));
    mkdirSync(join(dir, "prompts"));
    const stub = (name: string, content: string) => writeFileSync(join(dir, name), content, { flag: "wx" });

    stub("project-settings.md", setting);
    stub("story.md", `# Story — ${options.title}\n\n[Paste source story here]\n`);
    stub("analysis.md", `# Source Analysis — ${options.title}\n\n## Story Order\n\n## Characters and Relationships\n\n## Fixed Character Facts\n\n## Wardrobe Facts\n\n## Locations and Props\n\n## Comic Text\n\n## Conflicts and Unknowns\n`);
    stub("terms.md", `# Terms — ${options.title}\n\n## Characters\n| Source | Prompt value |\n|---|---|\n\n## Locations\n| Source | Prompt value |\n|---|---|\n\n## Props\n| Source | Prompt value |\n|---|---|\n\n## Panel Positions\n| Storyboard label | Prompt phrase |\n|---|---|\n`);
    stub("beats.md", `# Beats — ${options.title}\n\n## Beat 1 — [title]\n\n**Source**: ${options.source} [reference]\n**Purpose**: [establish/action/reaction/pause/reveal]\n**Drawable Moment**: []\n**Text**: none\n**Continuity In**: []\n**Continuity Out**: []\n**Page Notes**: []\n`);
    stub("page-plan.md", `# Page Plan — ${options.title}\n\n## Page 01 — [purpose]\n\n- Source Beats: Beat 1\n- Opening State: []\n- Core Change: []\n- Ending State / Page Turn: []\n- Suggested Panel Count: 1\n- Major Characters: []\n- Local Appearances: 0\n- Text Load: ${options.visibleTextTypes}\n- Detail Priority: []\n- Notes: []\n`);
    stub("storyboard.md", `# ${options.title} — Multi-Panel Storyboard\n\n## Page 01 — [title]\n\n**Prompt ID**: 001-001\n**Source**: ${options.source} [reference]\n**Panel Count**: 1\n**Reading Direction**: ${options.readingDirection}\n**Reading Order**: 01-01\n**Page Orientation**: ${options.pageOrientation}\n**Layout**: one full-page panel\n**Page Purpose**: []\n\n### Panel 01-01 — [title]\n\n**Position**: full-page panel\n**Size**: large\n**Cast**: none\n**Source**: ${options.source} [reference]\n**Scene**: []\n**Text**: none\n**Continuity**: []\n`);
    stub("characters/characters.md", `# Character Definitions — ${options.title}\n\n## Character 1: [Name]\n\n**Source Facts**:\n- Story role: []\n- Relationships: []\n- Source references: []\n\n**Base (fixed, identity)**:\n- Subject cue: TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN\n- Face: TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN\n- Hair: TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN\n- Eyes: TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN\n- Build: TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN\n- Permanent marks/accessories: TODO [BLOCKING] — 请用户补充、选择 OPEN 或标记 N/A\n\n**Prompt Tags (identity)**:\n- TODO [BLOCKING] — 等待用户处理 Base 缺口\n\n**Wardrobe A - [name]**:\n- Prompt: TODO [BLOCKING] — 请用户补充完整服装或选择 OPEN 项\n\n**Expression Range**:\n- Neutral: OPEN — 用户未要求固定默认表情\n\n**TODO Summary**:\n- [ ] Complete character facts\n`);
    console.log(`Created ${dir}/`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    usage();
    process.exit(1);
  }
}

main();
