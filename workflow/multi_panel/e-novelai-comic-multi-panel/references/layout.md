# 多 Panel 页面 Layout

Layout 描述页面中各格的数量、位置、相对大小和阅读顺序。分格关键词不能替代完整 Layout。开始规划前先读取项目的 `Reading direction`、`Default Page orientation` 和 `Additional layout restrictions`。

## 1. 必填信息

每页至少记录：

```text
Panel Count
Reading Direction
Reading Order
Page Orientation
Layout
```

示例：

```text
Panel Count: 3
Reading Direction: left-to-right, top-to-bottom
Reading Order: Panel 01-01 → Panel 01-02 → Panel 01-03
Page Orientation: portrait
Layout: two small panels across the top, one wide panel across the bottom
```

## 2. 定位词必须统一

Storyboard、Main 和 Character N 应复用相同的 canonical 定位，例如：

```text
top-left panel
top-right panel
wide bottom panel
full-width top panel
left vertical panel
right vertical panel
```

不要在同一页分别使用 `lower panel`、`bottom frame`、`third panel` 指代同一格，除非项目术语明确规定它们等价。

同格多名角色必须使用完全相同的 Panel 定位；不同 Panel 不能使用无法区分的相同定位。

## 3. 设置可选值

常用 Reading Direction：

- `left-to-right, top-to-bottom`；
- `right-to-left, top-to-bottom`；
- `top-to-bottom`；
- `custom:<description>`，用于明确特殊阅读路线。

常用 Page Orientation：

- `portrait`；
- `landscape`；
- `square`；
- `vertical-scroll`；
- `custom:<description>`。

`Additional layout restrictions` 是自由输入、可组合的项目级限制，例如固定四格、只用 `2×2`、禁止斜格、禁止破框、禁止前景覆盖、每页最多三个 Panel、最后一个 Panel 必须全宽、全部页面保持相同网格。`none` 才表示无附加限制。

## 4. 常见基础布局

这些只是描述起点，不是强制模板：

- 2 格横向：one full-width top panel, one full-width bottom panel。
- 2 格纵向：one left panel, one right panel。
- 3 格：two small top panels, one wide bottom panel。
- 3 格侧重：one large left panel, two stacked right panels。
- 4 格：2×2 grid，按项目读向声明顺序。
- 单格：one full-page panel；视为页面记录，但不使用多格分格词。

需要不规则格、插格、覆盖或破框时，说明：

- 覆盖范围；
- 它承载的时刻；
- 何时阅读；
- 是否遮挡底层格的关键信息。

## 5. 页面节奏

- 大格用于建立环境、关键动作、揭示或需要视觉停留的细节。
- 小格适合短反应、节奏加速或连续细小变化。
- 相似机位可以用于比较变化，但重复必须有阅读作用。
- 复杂动作、多角色或大量文字不能同时塞进最小格。
- 重要细节若要求互斥景别，应拆格，不在一格同时声称全部清楚可见。

## 6. 当前 NAI5 Profile 提示

当页面实际包含两个或更多 Panel 时，页面 Main 默认加入：

```text
borderless panels
```

只有一个 Panel 的页面不写。该词是当前目标 Profile 的提示，不保证单独产生正确分格，也不意味着自动包含 `manga`、边框样式或完整 Layout。最终仍必须写清 Panel 数、阅读顺序和格位。

## 7. 自检

- [ ] Panel Count 与实际 Panel 数一致。
- [ ] 每格位置唯一且可区分。
- [ ] Reading Order 覆盖所有 Panel，且无重复／遗漏。
- [ ] 同格角色定位一致。
- [ ] 格子面积能容纳人物、动作和文字。
- [ ] Layout 与页面叙事重点一致。
- [ ] 单格页没有误用多格分格词。
