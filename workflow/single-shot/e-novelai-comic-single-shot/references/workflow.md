# 漫画提示词文本工作流

## 1. 建立项目设定并保存输入

先确认漫画名字和 `comic/<漫画名字>/` 项目目录。已有项目优先读取其 `project-settings.md`；文件缺失时提示用户添加，或询问是否允许根据当前对话和现有文件生成，未确认前不制作最终 Prompt。

全新项目先通过 `workflow/start/project-mode-selection.md` 选择 `single-shot`，然后只读取 `workflow/start/single-shot/setup.md`。使用 `new-single-shot-comic.ts --dry-run` 一次性展示单分镜项目设置，用户确认后创建项目 `project-settings.md`。确认项目设置中只有一条 `Mode: single-shot`；模式、生成单位、文字策略和确认依据只读取项目 `project-settings.md`，不创建或读取第二份模式记录。

保存 `story.md`；使用 [terms.md](terms.md) 建立人名、地名和重复道具词表。已有项目确认本次修改范围并备份要覆盖的文本，不自动重写全项目。项目设定不能替代后续人物缺口的逐项用户选择。

## 2. 提取 Beat

按 [shot-extraction.md](shot-extraction.md) 创建一份 `beats.md`。
长文按场景分段阅读，但最终写入同一文件并统一编号。心理与抽象信息转成可见演出，保留来源和转译说明；未知事实标 TODO。先让用户审阅低成本草稿。

## 3. 角色与 Storyboard

使用 [character-template.md](character-template.md) 和 [storyboard-template.md](storyboard-template.md)。
Base 是固定身份；Wardrobe 是完整独立服装；一次性状态属于具体 Shot。
每镜一个主要时刻和机位；具名角色上限读取项目 `project-settings.md`，默认 6 名，用户可按场景复杂度调小。上限不是凑人数目标，镜头只保留当前时刻真正需要的人物；纯环境可用 `Cast: none`。
镜头必须能看见要求呈现的细节。Page 只是文本组织层，不是多格页面指令；按剧情与阅读节奏安排镜头，不为了凑页数机械拆分。

当前会使用的角色身份、识别特征或 Wardrobe 有缺口时标 `TODO [BLOCKING]`，来源冲突标 `TODO [CONFLICT]`，列出问题并等待用户。用户可以填写具体内容，或明确选择 `OPEN`；不适用字段可标 `N/A`。不得替用户自动具体化。阻塞与冲突未解决不进入最终 Storyboard 或 Prompt；用户处理后重新读取完整人物文件。

## 4. 编写 Prompt

每个 Shot 在 Storyboard 中记录唯一的 `Prompt ID`，最终文件保存为 `prompts/NNN-MMM.md`。文件名两侧数字的项目含义由 `project-settings.md` 或项目记录决定；Single-shot 默认使用 `page-shot`。使用 [Single-shot Prompt 模板](prompt-record-template.md)。

1. `Main` 写当前画面的整体人数／互动、环境／道具、光线、构图和镜头。
2. 使用 `cast.ts --prompt` 取得固定身份和指定完整服装片段。
3. 按表达需要建立任意数量的 `Character N` 局部提示块；它们不必与人物数量一一对应。
4. AI 对照 Scene 处理当前可见状态，例如移除已经脱下的外套，保留内层；不得修改固定事实。持续变化需新 Wardrobe。
5. 通用补充只写无具体属性的类别，不增添剧情关键物，也不回写为原文事实。
6. 使用已锁定术语，检查相互矛盾的标签、归属混淆与跨镜头状态。

<a id="prompt-review"></a>

### 提示词审校

本流程不依赖外部提示词 Skill 才能完成。对照 `story.md`、Storyboard、人物资料和术语表审校最终字段：

- 保留已确认事实、镜头和归属，不为改善措辞重写剧情；
- 核对用户锚点、完整 Wardrobe、当前可见状态和跨镜头连续性；
- `Main` 与各 `Character N` 分工清楚，不相互制造冲突；
- 用简洁标签或清楚自然语言表达，允许多行；
- 不加入模型、尺寸、采样、服务器模板或请求字段；
- Tag 查询等辅助功能不可用时继续使用已知常用表达，但不得伪造查询结果。

可选第三方增强安装在项目 `.pi/skills/` 后，可以读取 `nai5-writing/SKILL.md` 处理普通单画面表达，服装措辞需要时读取 `nai5-costume-writing/SKILL.md`。不要使用 `nai5-comic-writing` 的整页导演规则替代已确认的 Single-shot Storyboard。

Source、Cast、Summary、Review 或 Prompting Pass 等追踪章节可以按项目需要附加，但不属于最终 Prompt 的硬性机器字段。

### Prompt 格式

````markdown
# Shot 001-001 — 等雨

## Main

```text
1girl, convenience store entrance, rain, upper body, eye level
```

## Character 1

```text
Lin has black hair, a bob cut, a white shirt and a navy skirt, holding an umbrella.
```
````

纯场景镜头可以只有 `Main`。身份和服装只来自已确认人物资料；画内文字若启用，保留原文并明确载体和位置。

## 5. 检查与交付

执行 `bun <baseDir>/scripts/check.ts <comic-dir>`。
检查器验证编号、Cast／Wardrobe、Prompt 的存在、顺序、单行格式、TODO 和审校状态；不会验证剧情质量、事实真实性或审校是否真正执行。

报告故事、Beat、人物、分镜和 Prompt 的路径、镜头数及未完成事项，到此结束。
仅完成 Beat 或 Storyboard 的项目不要求通过最终 Prompt 检查。

## 修改已有稿

- 修改镜头：备份对应分镜和 Prompt，修改后重新审校。
- 增删镜头：同步分镜及人物引用，使用 `renumber.ts` 整理编号，再检查；重复旧编号必须先人工解决。
- 改术语：更新所有受影响文本，不只修改词表。
