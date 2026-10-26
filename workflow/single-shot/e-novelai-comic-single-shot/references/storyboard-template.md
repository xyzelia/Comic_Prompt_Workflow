# Storyboard Template (Single-Shot)

Single image per shot. No panel grids, no gutters, no on-image text.

Traceability: every Shot records a stable three-digit `Prompt ID` matching `NNN-MMM`. The ID meaning is project-defined; Single-shot defaults to `page-shot`. The shot title lives here and may also appear in the prompt file header. Use `Source` to link back to `story.md`.

## Document Format

```markdown
---
title: "[Comic Title]"
topic: "[topic-slug]"
page_count: [N]
shot_count: [M]
generated: "YYYY-MM-DD HH:mm"
---

# [Comic Title] - Storyboard

## Page 1 - [page title]

### Shot 01-01 — [short title]
**Prompt ID**: 001-001
**Cast**: [Name] (Outfit [ID])
**Source**: story.md [paragraph / act reference, optional]
**Scene**: [景别]，[角度]，[人物的一项动作]，[环境与可见道具]。

### Shot 01-02 — [short title]
**Prompt ID**: 001-002
**Cast**: none
**Source**: story.md [reference]
**Scene**: 远景，平视，空车厢和散落的杯子。
```

Use `Cast: none` only for scenery/objects/crowds whose members do not need independent identity
control.

## Camera Vocabulary

Put shot size and angle at the start of every `Scene`. Translate them to these exact English tags at
prompt time:

| 中文 | English tag |
|---|---|
| 特写 | close-up |
| 半身 | upper body |
| 七分身 | cowboy shot |
| 全身 | full body |
| 远景 | wide shot |
| 平视 | eye level |
| 俯视 | from above |
| 仰视 | from below |
| 过肩 | over-the-shoulder shot |
| 背面 | from behind |
| 侧面 | side view |

Framing must contain the information the shot needs:

- facial expression → `close-up`;
- upper-body clothing or hand action → at least `upper body`;
- waist, skirt/trousers or hip action → at least `cowboy shot`;
- shoes or head-to-toe outfit → `full body`;
- small prop detail → separate `close-up`, or explicitly make the prop the focal point;
- environment/layout → `wide shot`.

Do not use a close-up while claiming shoes or a full outfit are visible. If two important details
need incompatible framing, split the shot.

## Rules

- 2–4 shots per page-equivalent. One shot = one image.
- Each shot has one subject focus, one moment and one camera. No multi-panel descriptions.
- `Cast` 数量按项目设置处理；它只描述 Storyboard 中需要身份连续性的角色，不决定最终 `Character N` 块数量。
- Person/place/prop names in English prompts must match `terms.md`; do not invent variants.
- Every Outfit ID must exist in `characters/characters.md`.
- No dialogue/caption fields. Story text lives outside the image.
- Temporary state must be concrete and complete in `Scene`, not a bare delta such as “jacket off.”
- Keep source-unknown facts identifiable as TODO. Prompt assembly may later add coarse, non-plot generic elements for NovelAI to resolve; do not present those additions as source facts in the storyboard.
- A character's action/expression goes into that character's prompt by default; follow the confirmed project Policy if it differs. Environment,
  interaction, relative placement, lighting and camera go into the global prompt.

## Example

```markdown
## Page 3 - 天台追逐

### Shot 03-01 — 起跑
**Prompt ID**: 003-001
**Cast**: Lin (Outfit B)
**Source**: story.md 第3段
**Scene**: 全身，平视，Lin 朝镜头跑来，身后是夜晚天台和城市灯火。

### Shot 03-02 — 接住
**Prompt ID**: 003-002
**Cast**: Lin (Outfit B)
**Source**: story.md 第3段
**Scene**: 半身，侧面，Lin 蹲下抱住猫，头发被风吹动。
```
