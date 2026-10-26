# Camera Reference Index

本文件只索引与 Camera 规划直接相关的资料。它不是 Skill 自动加载清单，也不负责判断当前项目是否启用 Camera。

项目只有在 `project-settings.md` 中明确设置以下内容时，才视为启用本模块：

```markdown
## Optional Modules

- camera: required
```

## 模块内资料

建议从以下文件开始：

1. [`README.md`](README.md) — 模块身份、设置、边界和检查器说明；
2. [`manual-guides/share-camera-guide.md`](manual-guides/share-camera-guide.md) — 通用 Camera 选择规则；
3. [`manual-guides/single-shot-camera-guide.md`](manual-guides/single-shot-camera-guide.md) — 独立 Shot Camera 规则；
4. [`references/prompt-integration.md`](references/prompt-integration.md) — `optional.camera.tags` 到 `Main` 的编译规则；
5. [`camera_improve.md`](camera_improve.md) — 详细 Camera 规则与 canonical catalog；
6. [`dataset-camera-tag/camera_tags.yaml`](dataset-camera-tag/camera_tags.yaml) — 本地 Camera tag 数据。

## 直接相关的已安装 Skills

以下 Skills 可以为 Camera 决策或 Prompt 编译提供输入，但不能自动启用本模块，也不能覆盖用户要求、来源事实或已确认 Storyboard。

### Storyboard 与漫画构图

- [`nai5-comic-storyboard/SKILL.md`](../../../.pi/skills/nai5-comic-storyboard/SKILL.md)
- [`composition.md`](../../../.pi/skills/nai5-comic-storyboard/references/composition.md)
- [`comic-story.md`](../../../.pi/skills/nai5-comic-storyboard/references/comic-story.md)
- [`comic-layout.md`](../../../.pi/skills/nai5-comic-storyboard/references/comic-layout.md)
- [`comic-continuity.md`](../../../.pi/skills/nai5-comic-storyboard/references/comic-continuity.md)

用途：确定景别、机位、逐格构图、阅读顺序和镜头连续性。

### 单幅构图

- [`nai5-illustration-composition/SKILL.md`](../../../.pi/skills/nai5-illustration-composition/SKILL.md)
- [`composition.md`](../../../.pi/skills/nai5-illustration-composition/references/composition.md)

用途：把已确定的画面意图转成具体观看距离、机位、遮挡、透视和视觉主次。

### Prompt 表达

- [`nai5-writing/SKILL.md`](../../../.pi/skills/nai5-writing/SKILL.md)
- [`illustration.md`](../../../.pi/skills/nai5-writing/references/illustration.md)
- [`conventions.md`](../../../.pi/skills/nai5-writing/references/conventions.md)
- [`nai5-comic-writing/SKILL.md`](../../../.pi/skills/nai5-comic-writing/SKILL.md)
- [`comics.md`](../../../.pi/skills/nai5-comic-writing/references/comics.md)

用途：把已确认 Camera 转换成最终 Prompt 中的英文 tag 或短语。Prompt 编写阶段不应重新决定已经确认的镜头。

## 当前漫画工作流资料

这些文件可以帮助理解项目现有 Storyboard 结构，但 Camera 模块不会根据它们自动判断自身是否适用：

### 独立 Shot

- [Storyboard 模板](../../single-shot/e-novelai-comic-single-shot/references/storyboard-template.md)
- [镜头提取](../../single-shot/e-novelai-comic-single-shot/references/shot-extraction.md)
- [制作指南](../../start/single-shot/guide.md)

### 多 Panel Page

- [Storyboard 模板](../../multi_panel/e-novelai-comic-multi-panel/references/panel-storyboard-template.md)
- [页面规划](../../multi_panel/e-novelai-comic-multi-panel/references/page-planning.md)
- [Layout](../../multi_panel/e-novelai-comic-multi-panel/references/layout.md)
- [制作指南](../../start/multi-panel-page/guide.md)

## 优先级

Camera 决策发生冲突时，按以下顺序处理：

1. 用户明确要求；
2. 当前项目中已经确认的事实和设置；
3. 已确认 Storyboard 与连续性；
4. Camera 模块规则和数据；
5. 实际读取后的相关 Skill；
6. 示例和历史材料。

无法解决的 Camera 冲突必须保留为 `TODO [CONFLICT]`，等待用户选择，不得由模块静默覆盖。
