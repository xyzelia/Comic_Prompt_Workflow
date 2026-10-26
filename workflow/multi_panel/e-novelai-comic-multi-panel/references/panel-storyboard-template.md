# 多 Panel Storyboard 模板

## 文档格式

```markdown
---
title: "[Comic Title]"
topic: "[topic-slug]"
page_count: [N]
generated: "YYYY-MM-DD HH:mm"
---

# [Comic Title] — Multi-Panel Storyboard

## Page 01 — [页面标题]

**Prompt ID**: 001-001
**Source**: story.md [段落／场次]
**Panel Count**: 3
**Reading Direction**: left-to-right, top-to-bottom
**Reading Order**: 01-01 → 01-02 → 01-03
**Page Orientation**: portrait
**Layout**: two small panels across the top, one wide panel across the bottom
**Page Purpose**: [本页主要变化或揭示]

### Panel 01-01 — [短标题]

**Position**: top-left panel
**Size**: small
**Cast**: Lin (Outfit A)
**Source**: story.md 第 1 段
**Scene**: 半身，平视，Lin 站在便利店门口看雨，手里握着未打开的伞。
**Text**: none
**Continuity**: 进入时外套穿着完整，伞保持合拢。

### Panel 01-02 — [短标题]

**Position**: top-right panel
**Size**: small
**Cast**: none
**Source**: story.md 第 1 段
**Scene**: 特写，雨水从伞尖滴落到地面。
**Text**: SFX — "滴答"
**Continuity**: 同一地点和时间。

### Panel 01-03 — [短标题]

**Position**: wide bottom panel
**Size**: large
**Cast**: Lin (Outfit A), Mei (Outfit B)
**Source**: story.md 第 2 段
**Scene**: 中景，侧面，Mei 从右侧进入，Lin 转头看向她。
**Text**: Speech — Mei — "还不回去吗？"
**Continuity**: Lin 仍握着合拢的伞；Mei 从画面右侧进入。
```

## 字段规则

- Page 和 Panel 的 Storyboard 编号继续使用两位十进制：`Page 01`、`Panel 01-01`。
- 每个 Page 另有唯一的三位 `Prompt ID`，对应 `prompts/NNN-MMM.md`；横杠两侧含义由项目决定。
- Page Source 可以包含多个段落；每个 Panel 仍保留自己的 Source。
- Position 使用 Layout 中的 canonical 定位。
- Size 说明相对面积，不代替 Position。
- Cast 使用 `Name (Outfit ID)`；纯场景、道具或无需身份控制的群众写 `none`。
- Scene 以景别和机位开始，描述一个主要可读时刻。
- Text 使用 `none`，或明确类型、归属和原文。
- Continuity 写进入本格时需要延续的完整状态，不只写“同上一格”。

## 多格连续性

- 同一角色跨格出现时，每格都重新写当前可见状态。
- 换机位不会重置 Outfit、持物、污渍、湿衣或道具位置。
- 持续换装建立新 Outfit；一次性状态留在 Panel。
- 位置变化必须有可理解的动作或中间信息，不能无解释瞬移。
- 阅读顺序中的动作结果必须在后格保持，除非 Storyboard 明确发生新的变化。

## 检查表

- [ ] Page 编号连续，Panel ID 唯一。
- [ ] Panel Count、Reading Order 和实际格数一致。
- [ ] 每个 Panel 有 Position、Cast、Source、Scene、Text 和 Continuity。
- [ ] Position 与 Layout 一致且可区分。
- [ ] Cast 和 Outfit 均存在。
- [ ] 每格只有一个主要可读时刻。
- [ ] 对白、旁白、拟声词和道具文字归属明确。
- [ ] 跨格人物、服装、持物和环境状态连续。
- [ ] 没有未解决的角色 TODO 被带入最终 Storyboard。
