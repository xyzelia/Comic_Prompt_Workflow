import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateCameraProject } from "./check-project.ts";

function sandbox(run: (root: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "camera-project-"));
  try {
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function settings(value?: string): string {
  return `# Project Settings

- Mode: single-shot

## Optional Modules

${value === undefined ? "" : `- camera: ${value}`}
`;
}

function prompt(main: string, character = ""): string {
  return `# Prompt

## Main

\`\`\`text
${main}
\`\`\`
${character ? `
## Character 1

\`\`\`text
${character}
\`\`\`
` : ""}`;
}

function writeProject(
  root: string,
  setting: string,
  storyboard?: string,
  prompts: Record<string, string> = {},
): void {
  writeFileSync(join(root, "project-settings.md"), setting);
  if (storyboard !== undefined) writeFileSync(join(root, "storyboard.md"), storyboard);
  mkdirSync(join(root, "prompts"), { recursive: true });
  for (const [name, value] of Object.entries(prompts)) {
    writeFileSync(join(root, "prompts", name), value);
  }
}

test("project checker reports off and skips project content", () => {
  sandbox((root) => {
    writeProject(root, settings("off"));
    const result = validateCameraProject(root);
    expect(result.enabled).toBe(false);
    expect(result.setting).toBe("off");
    expect(result.errors).toEqual([]);
    expect(result.infos.join("\n")).toContain("checks skipped");
  });
});

test("project checker treats an omitted camera setting as off", () => {
  sandbox((root) => {
    writeProject(root, settings());
    const result = validateCameraProject(root);
    expect(result.enabled).toBe(false);
    expect(result.setting).toBe("off");
    expect(result.errors).toEqual([]);
  });
});

test("required Camera passes when Shot tags are copied into Main", () => {
  sandbox((root) => {
    writeProject(
      root,
      settings("required"),
      `## Page 1

### Shot 01-01 — hello
**Prompt ID**: 001-001
**Scene**: Lin waits outside.
**optional.camera.tags**: upper body, straight-on, three quarter view
`,
      {
        "001-001.md": prompt(
          "1girl, upper body, straight-on, three quarter view, waiting outside",
          "Lin, black hair",
        ),
      },
    );
    const result = validateCameraProject(root);
    expect(result.enabled).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.promptIds).toEqual(["001-001"]);
  });
});

test("required Camera rejects missing, unknown, misplaced, and leaked tags", () => {
  sandbox((root) => {
    writeProject(
      root,
      settings("required"),
      `## Page 1

### Shot 01-01 — hello
**Prompt ID**: 001-001
**Scene**: Lin waits outside.
**optional.camera.tags**: upper body, imaginary camera tag
`,
      {
        "001-001.md": prompt(
          "1girl, straight-on, waiting outside, optional.camera.tags",
          "Lin, upper body",
        ),
      },
    );
    const errors = validateCameraProject(root).errors.join("\n");
    expect(errors).toContain("unknown canonical tag: imaginary camera tag");
    expect(errors).toContain("must not copy the optional.camera.tags field name");
    expect(errors).toContain("must not be written in Character blocks: upper body");
    expect(errors).toContain("Main contains Camera tag 0/1 required times: upper body");
  });
});

test("required Camera checks each Panel clause in a Page Main", () => {
  sandbox((root) => {
    writeProject(
      root,
      settings("required"),
      `## Page 01 — rain
**Prompt ID**: 001-001

### Panel 01-01 — wait
**Position**: top-left panel
**Scene**: Lin waits.
**optional.camera.tags**: upper body, straight-on

### Panel 01-02 — umbrella
**Position**: top-right panel
**Scene**: Rain falls from the umbrella.
**optional.camera.tags**: close-up, from above, object focus
`,
      {
        "001-001.md": prompt(
          "two-panel comic, top-left panel: upper body, straight-on; top-right panel: close-up, from above, object focus; rainy night",
        ),
      },
    );
    expect(validateCameraProject(root).errors).toEqual([]);
  });
});

test("required Camera rejects incomplete Panel placement", () => {
  sandbox((root) => {
    writeProject(
      root,
      settings("required"),
      `## Page 01 — rain
**Prompt ID**: 001-001

### Panel 01-01 — wait
**Position**: top-left panel
**Scene**: Lin waits.
**optional.camera.tags**: upper body, straight-on

### Panel 01-02 — umbrella
**Position**: top-right panel
**Scene**: Rain falls from the umbrella.
**optional.camera.tags**: close-up, from above
`,
      {
        "001-001.md": prompt(
          "two-panel comic, top-left panel: upper body, straight-on; close-up, from above",
        ),
      },
    );
    const errors = validateCameraProject(root).errors.join("\n");
    expect(errors).toContain(
      "missing Camera clause for Panel 01-02 position: top-right panel",
    );
  });
});

test("project checker rejects duplicate and unsupported camera settings", () => {
  sandbox((root) => {
    writeProject(
      root,
      `## Optional Modules

- camera: required
- camera: strict
`,
    );
    const errors = validateCameraProject(root).errors.join("\n");
    expect(errors).toContain("camera setting must appear at most once");
    expect(errors).toContain("camera setting must be off or required; found strict");
  });
});
