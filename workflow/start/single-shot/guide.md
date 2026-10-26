# AI 工作指南：单分镜漫画提示词

**生成单位：一个 Shot → 一份独立 Prompt 记录。**

多个 Shot 可以组成漫画；Page 只用于组织阅读顺序，不把多个 Shot 编译为一张多 Panel 页面。本流程只交付故事整理、人物资料、Storyboard 和最终提示词，不负责生成图片。

## 1. 进入条件

1. 先完成 [总入口](../start.md) 的项目确认。
2. 读取项目：

   ```text
   ./comic/<COMIC_NAME>/project-settings.md
   ```

3. 该文件必须包含唯一的 `Mode: single-shot`。已记录为 `multi-panel-page` 的项目不得进入本流程。
4. Scope、Review Gate、人数限制、文字策略、Prompt 字段策略和语言设置全部以项目 `project-settings.md` 为准，不使用共享初始化文档中的默认值覆盖项目设置。
5. 如果 `project-settings.md` 缺失、字段不完整或模式冲突，返回总入口处理，不直接制作最终 Prompt。
6. 按 [Skill 检查](../skill-check.md) 检查当前模式所需 Skill。

全新项目的初始化应已由 [Single-shot 新项目设置](setup.md) 完成；进入本指南后不再重复收集初始化字段或重新运行模式选择。

## 2. 按阶段读取文件

不需要一次加载所有内容，只读取当前阶段所需文件：

1. [单分镜 Skill](../../single-shot/e-novelai-comic-single-shot/SKILL.md)：范围、目录和总流程。
2. [完整工作流](../../single-shot/e-novelai-comic-single-shot/references/workflow.md)：具体步骤与 Prompt 格式。
3. 故事转镜头时读 [镜头提取](../../single-shot/e-novelai-comic-single-shot/references/shot-extraction.md)。
4. 整理人物时读 [人物模板](../../single-shot/e-novelai-comic-single-shot/references/character-template.md)。
5. 写 Storyboard 时读 [分镜模板](../../single-shot/e-novelai-comic-single-shot/references/storyboard-template.md)。
6. 统一名称时读 [术语表](../../single-shot/e-novelai-comic-single-shot/references/terms.md)。
7. 需要初始化以外的文本工具、格式检查或重编号时读 [文本工具说明](../../single-shot/e-novelai-comic-single-shot/scripts/README.md)。
8. 第三方增强的实际读取范围以 [`../skill-check.md`](../skill-check.md) 和对应 Skill 的 `SKILL.md` 为准。单分镜不使用 `nai5-comic-writing` 的多 Panel 页面格式。

## 3. 标准执行路线

```text
读取项目 project-settings.md
→ 验证 single-shot 和项目设置
→ 按 skill-check.md 检查 Skill
→ 读取或保存 Source
→ 建立 terms.md
→ 提取 beats.md
→ 整理 characters/characters.md
→ 按 Single-shot 项目规则处理人物、服装、文字和冲突
→ 编写 storyboard.md
→ 按项目 Review Gate 等待审阅
→ 为每个 Shot 记录 Prompt ID，并编写 prompts/NNN-MMM.md
→ 文本检查
→ 交付报告
```

具体是否暂停审阅、最终交付范围及摘要要求，读取项目 `project-settings.md`。

### 3.1 故事与 Beat

- 原文按事件或情绪转折拆 Beat，不机械按段落拆分。
- 把心理、抽象关系和信息交代转成可见动作、距离、表情、道具或环境变化。
- 不字面化比喻，不静默删除不可画内容；说明其合并或转译去向。
- `beats.md` 是给人审阅的画面草稿，不写最终 Prompt 或技术参数。

### 3.2 Storyboard

- 一个 Shot 只有一个主要时刻、主体焦点和机位。
- `Cast` 使用 `Name (Outfit ID)`；纯场景可写 `none`。
- Outfit ID 必须存在于人物资料中。
- 镜头景别必须能看见要求表达的信息；互斥景别应拆 Shot。
- 当前可见状态写成完整事实，不只写“和上一张一样”“脱掉了”等相对变化。
- 每个 Shot 保留 Source，便于追溯原文或用户补充。
- 人物、服装、文字和剧情边界直接执行项目 `project-settings.md` 中的 Confirmed Content Boundaries；存在未解除的阻塞时不得进入最终 Storyboard 或 Prompt。

### 3.3 最终 Prompt

每个 Shot 在 Storyboard 中记录稳定 `Prompt ID`，并保存为：

```text
prompts/NNN-MMM.md
```

完整格式见本模式的 [Prompt 记录模板](../../single-shot/e-novelai-comic-single-shot/references/prompt-record-template.md)。使用默认策略时：

```text
Main
= 当前画面的整体人数／互动 + 环境／道具 + 光线／气氛 + 构图／镜头

Character N
= 按需要拆分的主体、人物细节或其他局部提示块
```

要求：

- `Main` 必须存在；`Character N` 可以没有或有任意多个；
- Character 编号从 1 连续递增，不设置人物数量上限；
- Character 块数量不要求与 Cast 一致，一个主体可以使用多个块；
- 临时服装状态输出当前完整可见结果，不写相对差异；
- 人名、地点和重复道具使用 `terms.md` 的统一写法；
- 不加入模型、分辨率、采样、服务器模板或图片请求字段；
- Source、Cast、Summary、Review 等追踪章节均为可选；
- 外部 Tag 查询或提示词辅助不可用时，可以使用明确自然语言和已知常用标签继续，但不得声称已执行不存在的查询或优化；
- 第三方规则与来源事实、用户设定、项目设置或确认闸门冲突时，后四者优先。

## 4. 检查与交付

如环境支持 Bun，可从项目根目录运行：

```bash
bun workflow/single-shot/e-novelai-comic-single-shot/scripts/check.ts <comic-dir>
```

`<comic-dir>` 通常为 `comic/<slug>`。脚本只做结构和格式检查，不能代替人工判断画面合理性与事实真实性。

交付时报告：

- 项目路径、模式和实际 Scope；
- Beat、人物、Storyboard 和 Prompt 文件位置；
- Page／Shot 数量；
- 是否仍有 TODO、OPEN 或待确认内容；
- 是否完成机器检查及检查结果；
- 使用了哪些第三方 Skill；
- 哪些内容仅是草案，不能冒充用户已确认设定。
