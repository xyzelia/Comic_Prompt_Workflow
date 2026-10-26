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
import { validateMultiPanel } from "./check.ts";

const box = (run: (root: string) => void) => {
  const root = mkdtempSync(join(tmpdir(), "multi-text-"));
  try {
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};
const cli = (script: string, ...args: string[]) =>
  Bun.spawnSync([process.execPath, join(import.meta.dir, script), ...args]);

const characters = `# Characters
## Character 1: Lin
**Source Facts**:
- Story role: lead
**Base (fixed, identity)**:
- Hair: black
**Prompt Tags (identity)**:
- 1girl, black hair
**Wardrobe A - daily**:
- Prompt: white shirt

## Character 2: Mei
**Source Facts**:
- Story role: friend
**Base (fixed, identity)**:
- Hair: brown
**Prompt Tags (identity)**:
- 1girl, brown hair
**Wardrobe B - daily**:
- Prompt: blue dress
`;

const board = `# Test — Multi-Panel Storyboard
## Page 01 — meeting
**Prompt ID**: 001-001
**Source**: story.md 1-2
**Panel Count**: 2
**Reading Direction**: left-to-right, top-to-bottom
**Reading Order**: 01-01 → 01-02
**Page Orientation**: portrait
**Layout**: one left panel, one right panel
**Page Purpose**: meeting
### Panel 01-01 — wait
**Position**: left panel
**Size**: medium
**Cast**: Lin (Outfit A)
**Source**: story.md 1
**Scene**: upper body, eye level, Lin waits
**Text**: none
**Continuity**: holding no props
### Panel 01-02 — arrive
**Position**: right panel
**Size**: medium
**Cast**: Lin (Outfit A), Mei (Outfit B)
**Source**: story.md 2
**Scene**: medium shot, side view, Mei arrives
**Text**: Speech — Mei — "Hi"
**Continuity**: Lin remains on the left
`;

const prompt = `# Page 01: meeting

## Main

\`\`\`text
borderless panels, 2 panels, one left panel, one right panel, speech bubbles
\`\`\`

## Character 1

\`\`\`text
In the left panel, upper body: Lin waits by the window.
\`\`\`

## Character 2

\`\`\`text
In the left panel, Lin has black hair and wears a white shirt.
\`\`\`

## Character 3

\`\`\`text
In the right panel, medium shot: Mei arrives while Lin turns toward her.
\`\`\`

## Character 4

\`\`\`text
In the right panel, Mei has brown hair, wears a blue dress, and has a speech bubble saying "Hi".
\`\`\`
`;

function project(root: string) {
  const result = cli(
    "new-multi_panel-comic.ts",
    "test-comic",
    "--root",
    root,
    "--visible-text-types",
    "speech-bubble",
  );
  expect(result.exitCode).toBe(0);
  const dir = join(root, "test-comic");
  writeFileSync(join(dir, "characters/characters.md"), characters);
  writeFileSync(join(dir, "storyboard.md"), board);
  writeFileSync(join(dir, "prompts/001-001.md"), prompt);
  return dir;
}

test("valid two-panel project passes", () =>
  box((root) => {
    const dir = project(root);
    expect(validateMultiPanel(dir).errors).toEqual([]);
    expect(cli("check.ts", dir).exitCode).toBe(0);
  }));

test("initializer lists choices, Prompt ID defaults and dry-run overrides", () =>
  box((root) => {
    const options = cli("new-multi_panel-comic.ts", "--show-options");
    expect(options.exitCode).toBe(0);
    const optionText = options.stdout.toString();
    expect(optionText).toContain("Character N is an independent local prompt block");
    expect(optionText).toContain("speech-bubble");
    expect(optionText).toContain("right-to-left, top-to-bottom");
    expect(optionText).not.toContain("custom-reviewed");

    const dry = cli(
      "new-multi_panel-comic.ts",
      "preview-comic",
      "--root",
      root,
      "--dry-run",
      "--max-major-characters",
      "8",
      "--reading-direction",
      "right-to-left-top-to-bottom",
      "--visible-text-types",
      "all",
    );
    expect(dry.exitCode).toBe(0);
    expect(dry.stdout.toString()).toContain("Prompt ID format: NNN-MMM");
    expect(dry.stdout.toString()).toContain("Max major characters per Page: 8");
    expect(dry.stdout.toString()).not.toContain("Repeated-character strategy");
    expect(readdirSync(root)).toEqual([]);

    const made = cli(
      "new-multi_panel-comic.ts",
      "custom-comic",
      "--root",
      root,
      "--title",
      "Custom Comic",
      "--max-major-characters",
      "4",
      "--prompt-id-meaning",
      "volume-page",
      "--visible-text-types",
      "speech-bubble,sound-effect",
      "--page-orientation",
      "landscape",
      "--layout-restrictions",
      "每页固定四格；只使用 2×2；禁止破框",
      "--mode-selected-by",
      "user-explicit",
    );
    expect(made.exitCode).toBe(0);
    const dir = join(root, "custom-comic");
    const setting = readFileSync(join(dir, "project-settings.md"), "utf8");
    expect(setting).toContain("- Prompt ID meaning: volume-page");
    expect(setting).not.toContain("Repeated-character strategy");
    expect(readFileSync(join(dir, "storyboard.md"), "utf8")).toContain(
      "**Prompt ID**: 001-001",
    );
  }));

test("mode provenance is recorded, validated, and never AI-default", () =>
  box((root) => {
    const dry = cli(
      "new-multi_panel-comic.ts",
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
        "new-multi_panel-comic.ts",
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
    expect(validateMultiPanel(dir).errors).toContain(
      "A: Mode selected by must be user-confirmed or user-explicit",
    );
  }));

test("initializer refuses duplicate projects", () =>
  box((root) => {
    expect(
      cli("new-multi_panel-comic.ts", "duplicate-comic", "--root", root)
        .exitCode,
    ).toBe(0);
    const duplicate = cli(
      "new-multi_panel-comic.ts",
      "duplicate-comic",
      "--root",
      root,
    );
    expect(duplicate.exitCode).not.toBe(0);
    expect(duplicate.stderr.toString()).toContain("Project already exists:");
  }));

test("project-settings is the only mode authority", () =>
  box((root) => {
    const dir = project(root);
    writeFileSync(join(dir, "workflow-mode.md"), "- Mode: single-shot\n");
    expect(validateMultiPanel(dir).errors).toEqual([]);
    writeFileSync(join(dir, "project-settings.md"), "- Mode: single-shot\n");
    expect(validateMultiPanel(dir).errors).toContain(
      "A: project-settings.md must exist and specify exactly one Mode: multi-panel-page",
    );
  }));

test("visible text and reading direction obey project settings", () =>
  box((root) => {
    const dir = project(root);
    const settingPath = join(dir, "project-settings.md");
    const boardPath = join(dir, "storyboard.md");
    const setting = readFileSync(settingPath, "utf8");
    writeFileSync(
      settingPath,
      setting.replace("Visible text types: speech-bubble", "Visible text types: none"),
    );
    expect(
      validateMultiPanel(dir).errors.some((error) =>
        error.includes("contains visible text")
      ),
    ).toBe(true);
    writeFileSync(settingPath, setting);
    writeFileSync(
      boardPath,
      board.replace(
        "left-to-right, top-to-bottom",
        "right-to-left, top-to-bottom",
      ),
    );
    expect(
      validateMultiPanel(dir).errors.some((error) =>
        error.includes("Reading Direction must match")
      ),
    ).toBe(true);
  }));

test("multiple Character blocks may describe the same Panel or subject", () =>
  box((root) => {
    const dir = project(root);
    const extra = prompt + `
## Character 5

\`\`\`text
In the right panel, close detail of Lin's hand holding the letter.
\`\`\`
`;
    writeFileSync(join(dir, "prompts/001-001.md"), extra);
    expect(validateMultiPanel(dir).errors).toEqual([]);
  }));

test("Character numbering must be consecutive", () =>
  box((root) => {
    const dir = project(root);
    writeFileSync(
      join(dir, "prompts/001-001.md"),
      prompt.replace("## Character 4", "## Character 5"),
    );
    expect(
      validateMultiPanel(dir).errors.some((error) =>
        error.includes("consecutive from Character 1")
      ),
    ).toBe(true);
  }));

test("multi page needs borderless panels and one-panel page omits it", () =>
  box((root) => {
    const dir = project(root);
    writeFileSync(
      join(dir, "prompts/001-001.md"),
      prompt.replace("borderless panels, ", ""),
    );
    expect(
      validateMultiPanel(dir).errors.some((error) =>
        error.includes("needs borderless panels")
      ),
    ).toBe(true);

    const one = board
      .replace("**Panel Count**: 2", "**Panel Count**: 1")
      .replace("**Reading Order**: 01-01 → 01-02", "**Reading Order**: 01-01")
      .replace(/### Panel 01-02[\s\S]*$/m, "");
    writeFileSync(join(dir, "storyboard.md"), one);
    writeFileSync(
      join(dir, "prompts/001-001.md"),
      `## Main\n\n\`\`\`text\none full-page panel\n\`\`\`\n`,
    );
    expect(validateMultiPanel(dir).errors).toEqual([]);
  }));

test("character budget and unresolved Prompt metadata are rejected", () =>
  box((root) => {
    const dir = project(root);
    const settingPath = join(dir, "project-settings.md");
    writeFileSync(
      settingPath,
      readFileSync(settingPath, "utf8").replace(
        "Max major characters per Page: 6",
        "Max major characters per Page: 1",
      ),
    );
    expect(validateMultiPanel(dir).errors.join("\n")).toContain("max 1");
    writeFileSync(
      settingPath,
      readFileSync(settingPath, "utf8").replace(
        "Max major characters per Page: 1",
        "Max major characters per Page: 6",
      ),
    );
    writeFileSync(
      join(dir, "prompts/001-001.md"),
      prompt.replace("Lin waits", "TODO Lin waits"),
    );
    expect(validateMultiPanel(dir).errors.join("\n")).toContain(
      "unresolved TODO/OPEN/N/A",
    );
  }));

test("cast tool assembles base wardrobe text", () =>
  box((root) => {
    const dir = project(root);
    const result = cli(
      "cast.ts",
      dir,
      "--prompt",
      "Lin",
      "A",
      "--extra",
      "smiling",
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString().trim()).toBe(
      "1girl, black hair, white shirt, smiling",
    );
  }));

test("renumber preserves stable Prompt IDs and prompt filenames", () =>
  box((root) => {
    const dir = project(root);
    writeFileSync(
      join(dir, "storyboard.md"),
      board
        .replace("Page 01", "Page 03")
        .replace("01-01 → 01-02", "03-01 → 03-02")
        .replace("Panel 01-01", "Panel 03-01")
        .replace("Panel 01-02", "Panel 03-02"),
    );
    expect(cli("renumber.ts", dir).exitCode).toBe(0);
    expect(readFileSync(join(dir, "storyboard.md"), "utf8")).toContain(
      "Panel 01-01",
    );
    expect(readFileSync(join(dir, "storyboard.md"), "utf8")).toContain(
      "**Prompt ID**: 001-001",
    );
    expect(existsSync(join(dir, "prompts/001-001.md"))).toBe(true);
    expect(validateMultiPanel(dir).errors).toEqual([]);
  }));

test("initializer rejects invalid args", () =>
  box((root) => {
    expect(
      cli("new-multi_panel-comic.ts", "bad", "--root", root).exitCode,
    ).not.toBe(0);
    expect(
      cli(
        "new-multi_panel-comic.ts",
        "bad",
        "--root",
        root,
        "--visible-text-types",
        "none,speech-bubble",
      ).exitCode,
    ).not.toBe(0);
    expect(readdirSync(root)).toEqual([]);
  }));
