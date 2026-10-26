import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateCameraModule } from "./check-module.ts";

function sandbox(run: (root: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "camera-module-"));
  try {
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function fixture(root: string, changes: Record<string, unknown> = {}) {
  const moduleDir = join(root, "camera");
  mkdirSync(join(moduleDir, "scripts"), { recursive: true });
  const manifest = {
    $schema: "./module.schema.json",
    moduleSpecVersion: 1,
    id: "camera",
    name: "Camera",
    version: "1.0.0",
    description: "Camera module",
    projectSetting: { default: "off", options: ["off", "required"] },
    storyboardFields: { tags: "optional.camera.tags" },
    promptIntegration: {
      sourceField: "optional.camera.tags",
      targetSection: "Main",
      includeFieldName: false,
    },
    entry: "README.md",
    moduleChecker: "scripts/check-module.ts",
    projectChecker: "scripts/check-project.ts",
    ...changes,
  };
  writeFileSync(join(moduleDir, "module.json"), JSON.stringify(manifest));
  writeFileSync(
    join(moduleDir, "module.schema.json"),
    JSON.stringify({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "object",
    }),
  );
  writeFileSync(join(moduleDir, "README.md"), "# Camera\n");
  writeFileSync(join(moduleDir, "scripts/check-module.ts"), "export {};\n");
  writeFileSync(join(moduleDir, "scripts/check-project.ts"), "export {};\n");
  return moduleDir;
}

test("current Camera module package is valid", () => {
  expect(validateCameraModule().errors).toEqual([]);
});

test("module checker rejects an id that does not match its directory", () => {
  sandbox((root) => {
    const moduleDir = fixture(root, { id: "camera-planning" });
    expect(validateCameraModule(moduleDir).errors.join("\n")).toContain(
      "this module id must be camera",
    );
    expect(validateCameraModule(moduleDir).errors.join("\n")).toContain(
      "module directory name must match id",
    );
  });
});

test("module checker rejects invalid options and escaping paths", () => {
  sandbox((root) => {
    const moduleDir = fixture(root, {
      projectSetting: { default: "enabled", options: ["enabled"] },
      entry: "../README.md",
    });
    const errors = validateCameraModule(moduleDir).errors.join("\n");
    expect(errors).toContain("Camera options must be exactly off and required");
    expect(errors).toContain("Camera projectSetting.default must be off");
    expect(errors).toContain("entry must not leave the module directory");
  });
});

test("module checker rejects invalid storyboard namespace and Prompt target", () => {
  sandbox((root) => {
    const moduleDir = fixture(root, {
      storyboardFields: { tags: "Camera Tags" },
      promptIntegration: {
        sourceField: "Camera Tags",
        targetSection: "Character 1",
        includeFieldName: true,
      },
    });
    const errors = validateCameraModule(moduleDir).errors.join("\n");
    expect(errors).toContain("storyboardFields.tags must be optional.camera.tags");
    expect(errors).toContain(
      "promptIntegration.sourceField must be optional.camera.tags",
    );
    expect(errors).toContain("promptIntegration.targetSection must be Main");
    expect(errors).toContain("promptIntegration.includeFieldName must be false");
  });
});

test("module checker rejects missing declared files", () => {
  sandbox((root) => {
    const moduleDir = fixture(root, {
      moduleChecker: "scripts/missing-module.ts",
      projectChecker: "scripts/missing-project.ts",
    });
    const errors = validateCameraModule(moduleDir).errors.join("\n");
    expect(errors).toContain("moduleChecker target missing");
    expect(errors).toContain("projectChecker target missing");
  });
});
