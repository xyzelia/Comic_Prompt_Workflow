export const PROMPT_FILE_PATTERN = /^\d{3}-\d{3}\.md$/;
export const PROMPT_ID_PATTERN = /^\d{3}-\d{3}$/;

export interface PromptArtifact {
  main: string;
  characters: string[];
}

export interface PromptArtifactResult {
  artifact?: PromptArtifact;
  errors: string[];
}

type Section = { heading: string; body: string };

function sections(markdown: string): Section[] {
  const headings = [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)];
  return headings.map((match, index) => {
    const start = match.index! + match[0].length;
    const end = headings[index + 1]?.index ?? markdown.length;
    return { heading: match[1].trim(), body: markdown.slice(start, end).trim() };
  });
}

function fencedValue(body: string): string | undefined {
  const match = body.match(/^```[^\r\n]*\r?\n([\s\S]*?)\r?\n```[ \t]*$/);
  const value = match?.[1].trim();
  return value || undefined;
}

export function parsePromptArtifact(markdown: string): PromptArtifactResult {
  const errors: string[] = [];
  const all = sections(markdown);
  const mainSections = all.filter((section) => section.heading === "Main");
  if (mainSections.length !== 1) {
    errors.push(`expected exactly one Main section; found ${mainSections.length}`);
  }
  const main = mainSections.length === 1
    ? fencedValue(mainSections[0].body)
    : undefined;
  if (mainSections.length === 1 && !main) {
    errors.push("Main must contain one non-empty fenced code block");
  }

  const numbered = all.flatMap((section) => {
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
      const item = numbered.find((entry) => entry.number === number)!;
      const value = fencedValue(item.body);
      if (!value) errors.push(`Character ${number} must contain one non-empty fenced code block`);
      else characters.push(value);
    }
  }

  const finalValues = [main, ...characters].filter((value): value is string => Boolean(value));
  if (finalValues.some((value) => /\b(?:TODO|OPEN|N\/A)\b/i.test(value))) {
    errors.push("Main or Character content contains unresolved TODO/OPEN/N/A metadata");
  }

  return errors.length || !main
    ? { errors }
    : { artifact: { main, characters }, errors };
}
