# AI 工作指南：整页多分镜漫画提示词

**生成单位：一个 Page → 一份页面 Prompt 记录。**

一个 Page 可以包含多个 Panel；Layout、阅读顺序、逐格内容、对白和连续性属于同一页面设计。Panel 不是独立单图 Prompt。本流程只交付文本，不负责图片生成。

## 1. 进入条件

1. 先完成 [总入口](../start.md) 的项目确认。
2. 读取项目：

   ```text
   ./comic/<COMIC_NAME>/project-settings.md
   ```

3. 该文件必须包含唯一的 `Mode: multi-panel-page`。已记录为 `single-shot` 的项目不得进入本流程。
4. Scope、Review Gate、人物预算、跨格角色策略、文字类型、阅读方向、页面方向和 Layout 限制全部以项目 `project-settings.md` 为准，不使用共享初始化文档中的默认值覆盖项目设置。
5. 如果 `project-settings.md` 缺失、字段不完整或模式冲突，返回总入口处理，不直接制作最终 Prompt。
6. 按 [Skill 检查](../skill-check.md) 检查当前模式所需 Skill。

全新项目的初始化应已由 [Multi Panel 新项目设置](setup.md) 完成；进入本指南后不再重复收集初始化字段或重新运行模式选择。

## 2. 按阶段读取文件

不需要一次加载所有内容，只读取当前阶段所需文件：

1. [多 Panel Skill](../../multi_panel/e-novelai-comic-multi-panel/SKILL.md)。
2. [完整工作流](../../multi_panel/e-novelai-comic-multi-panel/references/workflow.md)。
3. 来源和 Beat：[source-analysis-and-beats.md](../../multi_panel/e-novelai-comic-multi-panel/references/source-analysis-and-beats.md)。
4. 人物：[character-template.md](../../multi_panel/e-novelai-comic-multi-panel/references/character-template.md)。
5. 页面分配：[page-planning.md](../../multi_panel/e-novelai-comic-multi-panel/references/page-planning.md)。
6. Layout：[layout.md](../../multi_panel/e-novelai-comic-multi-panel/references/layout.md)。
7. Storyboard：[panel-storyboard-template.md](../../multi_panel/e-novelai-comic-multi-panel/references/panel-storyboard-template.md)。
8. 页面 Prompt：[prompt-record-template.md](../../multi_panel/e-novelai-comic-multi-panel/references/prompt-record-template.md)。
9. 漫画文字：[text-and-dialogue.md](../../multi_panel/e-novelai-comic-multi-panel/references/text-and-dialogue.md)。
10. 术语：[terms.md](../../multi_panel/e-novelai-comic-multi-panel/references/terms.md)。
11. 文本工具：[scripts/README.md](../../multi_panel/e-novelai-comic-multi-panel/scripts/README.md)。
12. 第三方增强的实际读取范围以 [`../skill-check.md`](../skill-check.md) 和对应 Skill 的 `SKILL.md` 为准。

## 3. 标准执行路线

```text
读取项目 project-settings.md
→ 验证 multi-panel-page 和项目设置
→ 按 skill-check.md 检查 Skill
→ 读取或保存 Source
→ 建立 analysis.md + terms.md + beats.md
→ 整理 characters/characters.md
→ 按 Multi Panel 项目规则处理人物、服装、文字和冲突
→ 建立 page-plan.md
→ 设计 Layout
→ 编写逐页逐格 storyboard.md
→ 按项目 Review Gate 等待审阅
→ 为每页记录 Prompt ID，并编写 prompts/NNN-MMM.md
→ 文本检查
→ 交付报告
```

具体是否暂停审阅、最终交付范围及摘要要求，读取项目 `project-settings.md`。

## 4. 页面规划重点

- 先确定本页目的、开始状态、核心变化和页尾承接，再决定格数。
- 每个 Panel 通常冻结一个主要可读时刻；动作过程只有影响理解时才拆格。
- 重要表情、复杂互动、关键细节或大量文字需要更大格和更少 Panel。
- 每页的 Panel Count、Reading Direction、Reading Order、Page Orientation 和 Layout 必须符合项目 `project-settings.md`。
- 页面人物预算读取项目设置，按不同身份去重；局部出场次数另行统计。
- Character N 是灵活的局部提示块；同一 Panel 可以使用多个块，同一角色也可以跨多个块出现。
- Storyboard 使用的文字类型必须包含在项目允许的 Visible text types 中。
- 页面过载时调整焦点或拆页，不静默漏人、删事件或压缩关键文字。
- 人物、服装、文字和剧情边界直接执行项目 `project-settings.md` 中的 Confirmed Content Boundaries；存在未解除的阻塞时不得进入最终页面规划、Storyboard 或 Prompt。

## 5. 页面 Prompt

页面在 Storyboard 中记录稳定 `Prompt ID`，文件保存为 `prompts/NNN-MMM.md`。完整格式见本模式的 [页面 Prompt 模板](../../multi_panel/e-novelai-comic-multi-panel/references/prompt-record-template.md)。

```text
Main
= Panel 数／Reading Order／完整 Layout
+ 页面共同环境、光线、互动和文字类型

Character N
= 按需要组织的 Panel 基础画面、详细人物、跨格状态、道具、局部特写或覆盖画面
```

要求：

- 当前 NAI5 Profile 下，多格页 Main 写 `borderless panels`，单格页不写；两者都必须完整描述 Layout；
- Layout、阅读顺序、文字类型和页面方向必须与项目设置及 Storyboard 一致；
- 一个 Panel 可以使用多个 Character 块；Character 数量不等于人物数量或 Panel 数量；
- Character 编号从 1 连续递增，不设置数量上限；
- 对白／思考归属说话者；旁白、拟声词和道具文字有唯一承载 Panel；
- 引号内文字保留用户指定原文和语言；
- 不加入模型、尺寸、采样、服务器、请求或结果字段；
- Source、Cast、Summary、Review 等追踪章节均为可选；
- 第三方规则与来源事实、用户设定、项目设置或确认闸门冲突时，后四者优先。

## 6. 检查和交付

如环境支持 Bun，可从项目根目录运行：

```bash
bun workflow/multi_panel/e-novelai-comic-multi-panel/scripts/check.ts <comic-dir>
```

`<comic-dir>` 通常为 `comic/<slug>`。机器检查覆盖 Page／Panel 编号、布局字段、人物引用、预算、Prompt 映射、分格词和未解决元数据，但不能证明叙事质量或实际画面效果。

交付时报告：

- 项目路径、模式和实际 Scope；
- Page／Panel 数；
- 人物预算和跨格角色策略；
- Storyboard 和 Prompt 文件位置；
- 第三方 Skill 使用情况；
- 未完成项和检查结果；
- 哪些内容仅是草案，不能冒充用户已确认设定。
