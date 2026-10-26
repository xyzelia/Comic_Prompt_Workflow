import { existsSync, readFileSync } from "node:fs";
import { basename, isAbsolute, join, resolve, sep } from "node:path";

export interface CameraModuleCheck {
  errors: string[];
  infos: string[];
}

type JsonObject = Record<string, unknown>;

const MODULE_ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const MANIFEST_KEYS = new Set([
  "$schema",
  "moduleSpecVersion",
  "id",
  "name",
  "version",
  "description",
  "projectSetting",
  "storyboardFields",
  "promptIntegration",
  "entry",
  "moduleChecker",
  "projectChecker",
]);

function object(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readJson(path: string, label: string, errors: string[]): unknown {
  if (!existsSync(path)) {
    errors.push(`${label} missing: ${path}`);
    return undefined;
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(
      `${label} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
    return undefined;
  }
}

function modulePath(
  moduleDir: string,
  value: unknown,
  field: string,
  errors: string[],
): string | undefined {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${field} must be a non-empty relative path`);
    return undefined;
  }
  if (isAbsolute(value)) {
    errors.push(`${field} must be relative to the module directory`);
    return undefined;
  }
  const root = resolve(moduleDir);
  const target = resolve(root, value);
  if (target !== root && !target.startsWith(`${root}${sep}`)) {
    errors.push(`${field} must not leave the module directory: ${value}`);
    return undefined;
  }
  if (!existsSync(target)) errors.push(`${field} target missing: ${value}`);
  return target;
}

export function validateCameraModule(
  moduleDir = resolve(import.meta.dir, ".."),
): CameraModuleCheck {
  const errors: string[] = [];
  const infos: string[] = [];
  const manifestPath = join(moduleDir, "module.json");
  const schemaPath = join(moduleDir, "module.schema.json");
  const manifestValue = readJson(manifestPath, "module.json", errors);
  const schemaValue = readJson(schemaPath, "module.schema.json", errors);

  if (schemaValue !== undefined && !object(schemaValue)) {
    errors.push("module.schema.json root must be an object");
  }
  if (object(schemaValue)) {
    if (schemaValue.$schema !== "https://json-schema.org/draft/2020-12/schema") {
      errors.push("module.schema.json must declare JSON Schema draft 2020-12");
    }
    if (schemaValue.type !== "object") {
      errors.push("module.schema.json must describe an object manifest");
    }
  }

  if (manifestValue !== undefined && !object(manifestValue)) {
    errors.push("module.json root must be an object");
  }
  if (!object(manifestValue)) return { errors, infos };

  for (const key of MANIFEST_KEYS) {
    if (!(key in manifestValue)) errors.push(`module.json missing required field: ${key}`);
  }
  for (const key of Object.keys(manifestValue)) {
    if (!MANIFEST_KEYS.has(key)) errors.push(`module.json contains unsupported field: ${key}`);
  }

  if (manifestValue.$schema !== "./module.schema.json") {
    errors.push("module.json $schema must be ./module.schema.json");
  }
  if (manifestValue.moduleSpecVersion !== 1) {
    errors.push("moduleSpecVersion must be 1");
  }

  const id = manifestValue.id;
  if (typeof id !== "string" || !MODULE_ID_PATTERN.test(id)) {
    errors.push("id must use lowercase kebab-case");
  } else {
    if (id !== "camera") errors.push("this module id must be camera");
    if (basename(resolve(moduleDir)) !== id) {
      errors.push(`module directory name must match id: ${id}`);
    }
  }

  if (typeof manifestValue.name !== "string" || !manifestValue.name.trim()) {
    errors.push("name must be a non-empty string");
  }
  if (
    typeof manifestValue.version !== "string" ||
    !SEMVER_PATTERN.test(manifestValue.version)
  ) {
    errors.push("version must use MAJOR.MINOR.PATCH without prefixes");
  }
  if (
    typeof manifestValue.description !== "string" ||
    !manifestValue.description.trim()
  ) {
    errors.push("description must be a non-empty string");
  }

  const setting = manifestValue.projectSetting;
  if (!object(setting)) {
    errors.push("projectSetting must be an object");
  } else {
    const keys = Object.keys(setting).sort();
    if (keys.join(",") !== "default,options") {
      errors.push("projectSetting may contain only default and options");
    }
    const options = setting.options;
    if (
      !Array.isArray(options) ||
      options.some((value) => typeof value !== "string")
    ) {
      errors.push("projectSetting.options must be an array of strings");
    } else {
      const unique = [...new Set(options)];
      if (unique.length !== options.length) {
        errors.push("projectSetting.options must not contain duplicates");
      }
      if (
        unique.length !== 2 ||
        !unique.includes("off") ||
        !unique.includes("required")
      ) {
        errors.push("Camera options must be exactly off and required");
      }
      if (!unique.includes(setting.default as string)) {
        errors.push("projectSetting.default must be one of projectSetting.options");
      }
    }
    if (setting.default !== "off") {
      errors.push("Camera projectSetting.default must be off");
    }
  }

  const storyboardFields = manifestValue.storyboardFields;
  if (!object(storyboardFields)) {
    errors.push("storyboardFields must be an object");
  } else {
    const keys = Object.keys(storyboardFields);
    if (keys.length !== 1 || keys[0] !== "tags") {
      errors.push("storyboardFields may declare only tags");
    }
    if (storyboardFields.tags !== "optional.camera.tags") {
      errors.push("storyboardFields.tags must be optional.camera.tags");
    }
  }

  const promptIntegration = manifestValue.promptIntegration;
  if (!object(promptIntegration)) {
    errors.push("promptIntegration must be an object");
  } else {
    const keys = Object.keys(promptIntegration).sort();
    if (keys.join(",") !== "includeFieldName,sourceField,targetSection") {
      errors.push(
        "promptIntegration may contain only sourceField, targetSection, and includeFieldName",
      );
    }
    if (promptIntegration.sourceField !== "optional.camera.tags") {
      errors.push("promptIntegration.sourceField must be optional.camera.tags");
    }
    if (promptIntegration.targetSection !== "Main") {
      errors.push("promptIntegration.targetSection must be Main");
    }
    if (promptIntegration.includeFieldName !== false) {
      errors.push("promptIntegration.includeFieldName must be false");
    }
  }

  modulePath(moduleDir, manifestValue.$schema, "$schema", errors);
  modulePath(moduleDir, manifestValue.entry, "entry", errors);
  modulePath(moduleDir, manifestValue.moduleChecker, "moduleChecker", errors);
  modulePath(moduleDir, manifestValue.projectChecker, "projectChecker", errors);

  if (!errors.length) {
    infos.push(
      "Camera module manifest, schema, storyboard namespace, prompt integration, directory name, and declared files are valid",
    );
  }
  return { errors, infos };
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.includes("-h") || args.includes("--help")) {
    console.log("Usage: bun workflow/optional/camera/scripts/check-module.ts\n\nValidates the Camera optional module package. It does not inspect comic projects.");
    return;
  }
  if (args.length) {
    console.error("Camera module package checker does not accept a project path");
    process.exit(2);
  }
  const result = validateCameraModule();
  for (const info of result.infos) console.log(`INFO: ${info}`);
  for (const error of result.errors) console.error(`ERROR: ${error}`);
  if (result.errors.length) process.exit(1);
}

if (import.meta.main) main();
