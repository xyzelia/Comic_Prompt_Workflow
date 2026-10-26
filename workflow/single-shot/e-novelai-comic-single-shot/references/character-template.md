# Character Template (Base + Wardrobe + Prompt Tags)

`Base` is fixed for the whole story. If a currently used character identity, distinguishing feature, or Wardrobe has a missing required fact, record `TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN` and wait for the user. Conflicting sources use `TODO [CONFLICT]` with both sources. The user may supply a value, explicitly choose `OPEN`, or use `N/A` when the field does not apply. Do not choose a concrete design for the user. `OPEN` and `N/A` are metadata, never prompt tags. Unresolved blocking or conflict items stop final Storyboard and prompt writing. After user updates, reread the entire character file.

`Wardrobe` holds complete outfit variants. Storyboard shots
reference Wardrobe by ID. Human-readable fields preserve provenance; English Prompt Tags are the
machine-ready identity anchor used during prompt assembly.

## Document Format

```markdown
# Character Definitions - [Comic Title]

---

## Character 1: [Name]

**Base (fixed, identity)**:
- Face: [shape, distinguishing features]
- Hair: [color, style, length]
- Eyes: [color, shape]
- Build: [age range, height/body type]
- Marks: [glasses, scar, accessories that never change]

**Prompt Tags (identity)**:
- 1girl, black hair, bob cut, brown eyes, twenties female, slim waist

**Wardrobe A - [label, e.g. 日常]**:
- Prompt: white shirt, navy skirt, black tights, black pumps

**Wardrobe B - [label, e.g. 脱外套]**:
- Prompt: white shirt, navy skirt, black tights, black pumps, jacket tied around waist

**Expression Range**:
- Neutral: [description]
- Happy: [description]
- Sad / Determined: [description]
```

## Rules

- `Base` never changes mid-story. It is the identity anchor and may contain Chinese notes. Missing required facts use `TODO [BLOCKING]`, not an unqualified TODO.
- `Prompt Tags (identity)` is one English comma-separated positive-tag line. Include a subject cue
  such as `1girl` or `1boy`; include only fixed visible identity traits. No quality/style, scene,
  lighting, camera, pose, action or temporary expression tags.
- Each Wardrobe is complete and standalone, head to toe where known. Its `Prompt:` value is English
  comma-separated positive tags. Never write a relative delta such as “same as A minus jacket.”
- Unknown fixed identity or Wardrobe attributes remain blocking until the user supplies them or explicitly chooses `OPEN`; do not convert them into specific identity claims. `OPEN` may permit an unqualified generic category such as `coat` when needed, but never an invented color, material, pattern, brand, or exact design.
- One-shot visible states may be handled by the AI normalization step during prompt assembly: remove contradicted clothing tags, retain established layers, and optionally add an unqualified generic garment category for NovelAI to resolve. Persistent or specifically designed changes require a new complete Wardrobe set.
- Do not put all of `Expression Range` into every prompt. Pick only the expression visible in that shot.
- Keep identity and wardrobe concise. Do not copy generic boosters such as `masterpiece`,
  `best quality`, `detailed`, or `highres` into either block.

## Example

```markdown
## Character 1: Lin

**Base (fixed, identity)**:
- Face: round, small mole under left eye
- Hair: black bob, chin-length
- Eyes: dark brown, large
- Build: twenties female, 160cm, slim
- Marks: thin silver hoop earrings

**Prompt Tags (identity)**:
- 1girl, twenties female, round face, mole under left eye, black hair, bob cut, chin-length hair, dark brown eyes, slim, silver hoop earrings

**Wardrobe A - 日常**:
- Prompt: mustard yellow hooded jacket, white t-shirt, navy shorts, white sneakers

**Wardrobe B - 脱外套**:
- Prompt: white t-shirt, navy shorts, white sneakers, mustard yellow jacket tied around waist

**Expression Range**:
- Neutral: calm, slight smile
- Happy: wide grin, squinted eyes
- Determined: furrowed brows, mouth set
```
