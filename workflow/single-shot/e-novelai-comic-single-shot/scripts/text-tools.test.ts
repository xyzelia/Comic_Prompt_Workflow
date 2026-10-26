import { expect, test } from "bun:test";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateComic } from "./check.ts";

function sandbox(run: (root: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "comic-text-"));
  try {
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
function cli(script: string, ...args: string[]) {
  return Bun.spawnSync([process.execPath, join(import.meta.dir, script), ...args]);
}

const chars = `# Characters
## Character 1: Lin
**Base (fixed, identity)**:
- Hair: black
**Prompt Tags (identity)**:
- 1girl, black hair
**Wardrobe A - daily**:
- Prompt: white shirt
`;

const record = (id: string) => `# Shot ${id}: hello

## Main

\`\`\`text
1girl, 店门口, upper body, eye level
\`\`\`

## Character 1

\`\`\`text
1girl, black hair, white shirt
\`\`\`
`;

function project(root: string) {
  const result = cli("new-single-shot-comic.ts", "test-comic", "--root", root);
  expect(result.exitCode).toBe(0);
  const dir = join(root, "test-comic");
  writeFileSync(join(dir, "characters/characters.md"), chars);
  writeFileSync(
    join(dir, "storyboard.md"),
    "## Page 1\n### Shot 01-01 — hello\n**Prompt ID**: 001-001\n**Cast**: Lin (Outfit A)\n",
  );
  writeFileSync(join(dir, "prompts/001-001.md"), record("001-001"));
  return dir;
}

test("scaffold is text only; finalized fixture validates", () =>
  sandbox((root) => {
    const dir = project(root);
    expect(existsSync(join(dir, ".novelai-image.json"))).toBe(false);
    expect(existsSync(join(dir, "style.md"))).toBe(false);
    expect(validateComic(dir).errors).toEqual([]);
    expect(cli("check.ts", dir).exitCode).toBe(0);
  }));

test("initializer writes Prompt ID defaults and supports dry-run overrides", () =>
  sandbox((root) => {
    const dry = cli(
      "new-single-shot-comic.ts",
      "preview-comic",
      "--root",
      root,
      "--dry-run",
      "--title",
      "Preview Comic",
      "--max-cast-per-shot",
      "3",
    );
    expect(dry.exitCode).toBe(0);
    expect(dry.stdout.toString()).toContain("Max named cast per Shot: 3");
    expect(dry.stdout.toString()).toContain("Prompt ID format: NNN-MMM");
    expect(readdirSync(root)).toEqual([]);

    const made = cli(
      "new-single-shot-comic.ts",
      "custom-comic",
      "--root",
      root,
      "--title",
      "Custom Comic",
      "--beat-review",
      "no",
      "--on-image-text",
      "selected-shots",
      "--prompt-id-meaning",
      "chapter-unit",
      "--mode-selected-by",
      "user-explicit",
    );
    expect(made.exitCode).toBe(0);
    const dir = join(root, "custom-comic");
    const setting = readFileSync(join(dir, "project-settings.md"), "utf8");
    expect(setting).toContain("# Project Settings — Custom Comic");
    expect(setting).toContain("- Prompt ID meaning: chapter-unit");
    expect(setting).toContain("- Beat review gate: no");
    expect(setting).toContain("- Mode selected by: user-explicit");
    expect(readFileSync(join(dir, "storyboard.md"), "utf8")).toContain(
      "**Prompt ID**: 001-001",
    );
    expect(existsSync(join(dir, "workflow-mode.md"))).toBe(false);

    const duplicate = cli(
      "new-single-shot-comic.ts",
      "custom-comic",
      "--root",
      root,
    );
    expect(duplicate.exitCode).not.toBe(0);
    expect(duplicate.stderr.toString()).toContain("Project already exists:");
  }));

test("mode provenance is recorded, validated, and never AI-default", () =>
  sandbox((root) => {
    const dry = cli(
      "new-single-shot-comic.ts",
      "preview-comic",
      "--root",
      root,
      "--dry-run",
    );
    expect(dry.stdout.toString()).toContain(
      "- Mode selected by: user-confirmed",
    );
    expect(
      cli(
        "new-single-shot-comic.ts",
        "invalid-comic",
        "--root",
        root,
        "--mode-selected-by",
        "AI-default",
      ).exitCode,
    ).not.toBe(0);
    const dir = project(root);
    const settings = join(dir, "project-settings.md");
    writeFileSync(
      settings,
      readFileSync(settings, "utf8").replace(
        "Mode selected by: user-confirmed",
        "Mode selected by: AI-default",
      ),
    );
    expect(validateComic(dir).errors).toContain(
      "A: Mode selected by must be user-confirmed or user-explicit",
    );
  }));

test("checker reads only project-settings and ignores obsolete mode records", () =>
  sandbox((root) => {
    const dir = project(root);
    writeFileSync(join(dir, "workflow-mode.md"), "- Mode: multi-panel-page\n");
    expect(validateComic(dir).errors).toEqual([]);
    rmSync(join(dir, "project-settings.md"));
    expect(validateComic(dir).errors).toContain(
      "A: project-settings.md must exist and specify exactly one Mode: single-shot",
    );
  }));

test("cast assembles Unicode and deduplicates tags", () =>
  sandbox((root) => {
    const dir = project(root);
    const result = cli(
      "cast.ts",
      dir,
      "--prompt",
      "Lin",
      "A",
      "--extra",
      "black hair, 微笑",
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString().trim()).toBe(
      "1girl, black hair, white shirt, 微笑",
    );
  }));

test("cast refuses unresolved TODO and human Base fallback", () =>
  sandbox((root) => {
    const dir = project(root);
    const path = join(dir, "characters/characters.md");
    writeFileSync(path, chars.replace("Hair: black", "Hair: TODO [BLOCKING]"));
    expect(cli("cast.ts", dir, "--prompt", "Lin", "A").exitCode).not.toBe(0);
    expect(
      validateComic(dir).errors.some((error) =>
        error.includes("blocking/conflict")
      ),
    ).toBe(true);
  }));

test("checker accepts optional metadata and arbitrary Character count", () =>
  sandbox((root) => {
    const dir = project(root);
    const extended = record("001-001") + `
## Source
story.md paragraph 1

## Character 2

\`\`\`text
same shot, detailed hand holding a letter
\`\`\`

## Character 3

\`\`\`text
same shot, close detail of the letter seal
\`\`\`
`;
    writeFileSync(join(dir, "prompts/001-001.md"), extended);
    expect(validateComic(dir).errors).toEqual([]);
  }));

test("checker rejects missing Main, Character gaps and unresolved metadata", () =>
  sandbox((root) => {
    const dir = project(root);
    writeFileSync(
      join(dir, "prompts/001-001.md"),
      `## Main

\`\`\`text
TODO scene
\`\`\`

## Character 2

\`\`\`text
subject
\`\`\`
`,
    );
    const errors = validateComic(dir).errors.join("\n");
    expect(errors).toContain("consecutive from Character 1");
    expect(errors).toContain("unresolved TODO/OPEN/N/A");
  }));

test("scenery record needs only Main", () =>
  sandbox((root) => {
    const dir = project(root);
    writeFileSync(
      join(dir, "storyboard.md"),
      "## Page 1\n### Shot 01-01\n**Prompt ID**: 001-001\n**Cast**: none\n",
    );
    writeFileSync(
      join(dir, "prompts/001-001.md"),
      "## Main\n\n```text\nempty room\n```\n",
    );
    expect(validateComic(dir).errors).toEqual([]);
  }));

test("renumber preserves stable Prompt IDs and prompt filenames", () =>
  sandbox((root) => {
    const dir = project(root);
    writeFileSync(
      join(dir, "storyboard.md"),
      "## Page 3\n### Shot 03-02 — hello\n**Prompt ID**: 003-002\n**Cast**: Lin (Outfit A)\n",
    );
    rmSync(join(dir, "prompts/001-001.md"));
    writeFileSync(join(dir, "prompts/003-002.md"), record("003-002"));
    writeFileSync(join(dir, "03-02.png"), "unchanged");
    expect(cli("renumber.ts", dir).exitCode).toBe(0);
    expect(readFileSync(join(dir, "storyboard.md"), "utf8")).toContain(
      "### Shot 01-01",
    );
    expect(readFileSync(join(dir, "storyboard.md"), "utf8")).toContain(
      "**Prompt ID**: 003-002",
    );
    expect(existsSync(join(dir, "prompts/003-002.md"))).toBe(true);
    expect(readFileSync(join(dir, "03-02.png"), "utf8")).toBe("unchanged");
    expect(validateComic(dir).errors).toEqual([]);
  }));

test("invalid initializer args do not create projects", () =>
  sandbox((root) => {
    expect(
      cli(
        "new-single-shot-comic.ts",
        "test-comic",
        "--bad",
        "--root",
        root,
      ).exitCode,
    ).not.toBe(0);
    expect(readdirSync(root)).toEqual([]);
  }));
