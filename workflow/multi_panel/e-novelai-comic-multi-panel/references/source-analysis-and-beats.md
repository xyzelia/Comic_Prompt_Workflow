# 来源分析与可画 Beat

## 1. `analysis.md`

先记录来源事实，不写提示词：

```markdown
# Source Analysis — [标题]

## Story Order
- [事件与揭示顺序]

## Characters and Relationships
- [角色、关系、出现段落]

## Fixed Character Facts
- [原文明示外貌／身份／固定饰品及来源]

## Wardrobe Facts
- [服装、换装点、来源]

## Locations and Props
- [地点、重复道具、来源]

## Comic Text
- Dialogue: [原文与说话者]
- Thoughts: [原文与人物]
- Captions: [原文]
- SFX / diegetic text: [原文与载体]

## Conflicts and Unknowns
- [冲突／缺口]
```

严格区分原文事实、用户补充、用户确认的项目设定、未知项和 OPEN。分析文件不能把推测写成来源事实。

## 2. `beats.md`

Beat 是读者完成一次认识、动作、反应、停顿或揭示，不等于原文段落，也不等于固定 Panel 数。

```markdown
## Beat 1 — [标题]

**Source**: story.md 第 1 段
**Purpose**: [建立／动作／反应／停顿／揭示]
**Drawable Moment**: [可见完整句]
**Text**: [对白／旁白／none]
**Continuity In**: [进入状态]
**Continuity Out**: [结束状态]
**Page Notes**: [需要大格、特写、页尾等／无]
```

## 3. 转译规则

- 心理活动转成眼神、姿势、距离、手势、道具或环境变化；内心文字只有原文／用户提供时保留。
- 信息交代优先用可见道具、人物反应或旁白；不擅自新增剧情证据。
- 时间跳跃用环境、服装、光线或道具状态对比，并记录连续性断点。
- 抽象关系用人物距离、朝向、遮挡和互动表现。
- 不字面化比喻。
- 不可画内容要说明合并、旁白或省略去向，不静默删除。

## 4. 从 Beat 到 Panel 的边界

- 一个 Panel 通常冻结一个主要可读时刻。
- 动作过程只有每一步都影响理解时才拆成多个 Panel；否则选择代表瞬间。
- 反应、停顿和揭示可以单独成格。
- 同一人物不能在一格中同时处于互斥时间状态。
- 重要细节需要足够面积；细节、复杂多人互动或大量文字不应挤进过小格。
- Beat 先完整记录，具体 Page 和 Panel 分配留到 `page-plan.md`。

## 5. 自检

- [ ] 事件与阅读顺序清楚。
- [ ] 每个 Beat 有叙事作用和可见时刻。
- [ ] 原文文字及归属完整保留。
- [ ] 未知人物固定事实没有被补造。
- [ ] 冲突和缺口已经列出。
- [ ] 前后状态足以支持后续连续性检查。
- [ ] 没有为了预定格数删掉必要 Beat。
