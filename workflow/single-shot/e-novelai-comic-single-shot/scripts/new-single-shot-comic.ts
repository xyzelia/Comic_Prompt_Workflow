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
  maxCast: number;
  multiCharacterException: YesNo;
  onImageText: "off" | "selected-shots";
  promptFieldPolicy: "default" | "custom";
  storyboardLanguage: string;
  finalPromptLanguage: string;
  dryRun: boolean;
};

function usage(): void {
  console.log(`Usage:
  bun <baseDir>/scripts/new-single-shot-comic.ts <topic-slug> [options]

Required:
  <topic-slug>                         2-4 lowercase kebab-case words

Project options:
  --root <dir>                         Project parent directory (default: comic)
  --title <text>                       Project title (default: slug)
  --source <path-or-note>              Source record (default: story.md)
  --mode-selected-by user-confirmed|user-explicit  How the user selected the mode (default: user-confirmed)
  --dry-run                            Print proposed project-settings.md; create nothing

Common options:
  --modify-source yes|no               Modify the source story file (default: no)
  --beat-review yes|no                 Pause after Beat review (default: yes)
  --storyboard-review yes|no           Pause after Storyboard review (default: yes)
  --prompt-summary yes|no              Summarize final Prompts (default: yes)
  --prompt-id-meaning <text>            Meaning of NNN-MMM within this project (default: page-shot)

Single-shot defaults:
  --max-cast-per-shot 6
  --multi-character-exception no
  --on-image-text off|selected-shots
  --prompt-field-policy default|custom
  --storyboard-language user-working-language
  --final-prompt-language concise-English-tags-phrases

Running without --dry-run accepts the displayed settings and creates the project.
If the project directory already exists, initialization stops and requires a new slug.`);
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

function parseArgs(args: string[]): { slug: string; options: Options } {
  const positional: string[] = [];
  const options: Options = {
    root: "comic",
    title: "",
    source: "story.md",
    modeSelectedBy: "user-confirmed",
    modifySource: "no",
    beatReview: "yes",
    storyboardReview: "yes",
    promptSummary: "yes",
    promptIdMeaning: "page-shot",
    maxCast: 6,
    multiCharacterException: "no",
    onImageText: "off",
    promptFieldPolicy: "default",
    storyboardLanguage: "user-working-language",
    finalPromptLanguage: "concise-English-tags-phrases",
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
      case "--mode-selected-by": options.modeSelectedBy = oneOf(value, ["user-confirmed", "user-explicit"], arg); break;
      case "--modify-source": options.modifySource = yesNo(value, arg); break;
      case "--beat-review": options.beatReview = yesNo(value, arg); break;
      case "--storyboard-review": options.storyboardReview = yesNo(value, arg); break;
      case "--prompt-summary": options.promptSummary = yesNo(value, arg); break;
      case "--prompt-id-meaning": options.promptIdMeaning = value; break;
      case "--max-cast-per-shot": options.maxCast = positiveInt(value, arg); break;
      case "--multi-character-exception": options.multiCharacterException = yesNo(value, arg); break;
      case "--on-image-text": options.onImageText = oneOf(value, ["off", "selected-shots"] as const, arg); break;
      case "--prompt-field-policy": options.promptFieldPolicy = oneOf(value, ["default", "custom"] as const, arg); break;
      case "--storyboard-language": options.storyboardLanguage = value; break;
      case "--final-prompt-language": options.finalPromptLanguage = value; break;
      default: throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (positional.length !== 1) throw new Error("Expected exactly one topic slug");
  const slug = positional[0];
  if (!/^[a-z0-9]+(-[a-z0-9]+){1,3}$/.test(slug))
    throw new Error(`Invalid slug "${slug}". Use 2-4 words kebab-case, e.g. cat-cafe-day.`);
  if (!options.title) options.title = slug;
  return { slug, options };
}

function renderProjectSettings(slug: string, o: Options): string {
  return `# Project Settings — ${o.title}

- Project slug: ${slug}
- Project state: new
- Mode: single-shot
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

## Single-shot Settings

- Max named cast per Shot: ${o.maxCast}
- Multi-character exception allowed: ${o.multiCharacterException}
- On-image text: ${o.onImageText}
- Prompt field policy: ${o.promptFieldPolicy}
- Storyboard language: ${o.storyboardLanguage}
- Final Prompt language: ${o.finalPromptLanguage}

## Confirmed Content Boundaries

- Missing identity, recognizable-feature, or Wardrobe facts: TODO [BLOCKING]; the user must provide a value or choose OPEN / N/A where applicable.
- Conflicting source facts: TODO [CONFLICT]; preserve the conflicting sources until the user chooses.
- OPEN is not a concrete design and must not be compiled into invented fixed colors, materials, hairstyles, or clothing details.
- Unprovided dialogue, captions, and other on-image text must not be invented.
- Story events, order, character relationships, and source facts must not be changed without explicit user approval recorded in the project.
- Unresolved TODO [BLOCKING] / TODO [CONFLICT] for the current cast or Wardrobe prevents final Storyboard and Prompt creation. After the user resolves them, reread the complete character file.
`;
}

function printProposal(slug: string, o: Options, setting: string): void {
  console.log(`Single-shot project proposal:
- Title: ${o.title}
- Slug: ${slug}
- Source: ${o.source}
- Mode: single-shot
- Scope: final-prompts
- Existing project directories: initialization stops; choose a new slug

--- project-settings.md ---
${setting}`);
}

function main(): void {
  const args = process.argv.slice(2);
  if (!args.length || args.includes("-h") || args.includes("--help")) {
    usage(); process.exit(args.length ? 0 : 1);
  }

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
    mkdirSync(dir, { recursive: false });
    mkdirSync(join(dir, "characters"), { recursive: true });
    mkdirSync(join(dir, "prompts"), { recursive: true });

    const stub = (name: string, content: string) => {
      const path = join(dir, name);
      if (!existsSync(path)) writeFileSync(path, content);
    };

    stub("project-settings.md", setting);
    stub("story.md", `# Story - ${options.title}\n\n[Paste source story here]\n`);
    stub("terms.md", `# Terms - ${options.title}\n\n## Characters\n| Source | Prompt value |\n|---|---|\n|  |  |\n\n## Locations\n| Source | Prompt value |\n|---|---|\n|  |  |\n\n## Props\n| Source | Prompt value |\n|---|---|\n|  |  |\n`);
    stub("beats.md", `---\ntitle: "${options.title}"\nsource: ${options.source}\nbeat_count: 0\nshot_count: 0\n---\n\n# ${options.title} — 分镜草稿\n\n> [一句话故事] · 主要人物：[] · 预计 [] 张\n\n---\n\n## Beat 1 — [标题]\n\n**原文**：${options.source} [引用]\n**可画**：是\n**画面**：[]\n**转译**：[]\n**镜头**：\n- 1-1 景别 · 内容\n`);
    stub("storyboard.md", `---\ntitle: "${options.title}"\ntopic: "${slug}"\npage_count: 0\nshot_count: 0\ngenerated: ""\n---\n\n# ${options.title} - Storyboard\n\n## Page 1 - [page title]\n\n### Shot 01-01 — [short title]\n**Prompt ID**: 001-001\n**Cast**: [Name] (Outfit [ID])\n**Source**: ${options.source} []\n**Scene**: []\n`);
    stub("characters/characters.md", `# Character Definitions - ${options.title}\n\n## Character 1: [Name]\n\n**Source Facts**:\n- Story role: []\n- Relationships: []\n- Source references: []\n\n**Base (fixed, identity)**:\n- Subject cue: TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN\n- Face: TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN\n- Hair: TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN\n- Eyes: TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN\n- Build: TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN\n- Marks: TODO [BLOCKING] — 原文未交代，请用户补充、选择 OPEN 或标记 N/A\n\n**Prompt Tags (identity)**:\n- TODO [BLOCKING] — 等待用户处理 Base 缺口\n\n**Wardrobe A - []**:\n- Prompt: TODO [BLOCKING] — 请用户补充完整服装或选择 OPEN 项\n\n**Expression Range**:\n- Neutral: OPEN — 用户未要求固定默认表情\n`);

    console.log(`Created ${dir}/`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    usage();
    process.exit(1);
  }
}

main();
