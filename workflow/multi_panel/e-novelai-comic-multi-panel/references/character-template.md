# 多 Panel 角色资料模板

角色资料在全篇和跨格出场中提供稳定身份锚点。当前会使用的固定身份、识别特征或 Wardrobe 有缺口时，必须等待用户填写或明确选择 `OPEN`。

## 状态

```text
TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN
TODO [CONFLICT] — 来源互相矛盾，请用户确认
OPEN — 用户允许该项不固定，不作为连续性事实
N/A — 本角色不适用
```

`OPEN`／`N/A` 是元数据，不进入最终 Prompt。阻塞或冲突未解决时，不制作最终页面规划、Storyboard 或 Prompt。

## 格式

````markdown
# Character Definitions — [漫画标题]

## Character 1: [Name]

**Source Facts**:
- Story role: [身份]
- Relationships: [关系]
- Source references: [story.md 段落]
- User-confirmed additions: [无／内容]
- Project decisions: [无／内容]

**Base (fixed, identity)**:
- Subject cue: [1girl / 1boy / ...]
- Face: [值 / TODO / OPEN]
- Hair: [颜色、发型、长度 / TODO / OPEN]
- Eyes: [值 / TODO / OPEN]
- Skin tone: [值 / TODO / OPEN]
- Build: [来源事实 / TODO / OPEN]
- Permanent marks/accessories: [值 / TODO / OPEN / N/A]

**Prompt Tags (identity)**:
- [确认后的固定可见身份标签]

**Wardrobe A - [名称]**:
- Source references: [来源]
- Upper body: [值 / TODO / OPEN]
- Lower body: [值 / TODO / OPEN]
- Legwear: [值 / TODO / OPEN / N/A]
- Footwear: [值 / TODO / OPEN / N/A]
- Outerwear: [值 / TODO / OPEN / N/A]
- Accessories: [值 / TODO / OPEN / N/A]
- Prompt: [完整、可独立理解的当前服装片段]

**Expression Range**:
- Neutral: [说明]
- [其他已知表情]: [说明]

**TODO Summary**:
- [ ] [待用户处理]
````

全身式服装可用 `One-piece garment`，不强行拆成上装和下装。

## 规则

- Base 只包含稳定身份，不包含当前动作、表情、机位、背景、光线或临时状态。
- Wardrobe 完整且独立，不写“同 A 去掉外套”等相对差异。
- 持续多个 Panel／Page 的明确换装建立新 Wardrobe；一次性湿衣、污渍、敞开、脱下或临时持物留在 Panel 状态。
- `Prompt Tags` 只包含已确认的固定可见身份，不放风格、质量、环境或动作。
- 用户选择 `OPEN` 后，可以在具体 Panel 使用不带颜色、材质、图案或设计的通用类别，但不能把它写回固定事实。
- 具体年龄数值是否需要固定由故事和用户要求决定；主体人数标签不是年龄证明。

## 解除阻塞

- [ ] 当前出场角色都有可用 Base。
- [ ] Storyboard 引用的 Outfit ID 全部存在。
- [ ] 被引用 Wardrobe 完整且可独立理解。
- [ ] 没有 `TODO [BLOCKING]`／`TODO [CONFLICT]`。
- [ ] Prompt Tags 和 Wardrobe Prompt 已按确认事实生成。
- [ ] 用户处理后重新读取了完整人物文件。
