# 漫画提示词工作流总入口

本工作流把故事、人物资料或已有分镜整理为漫画 Storyboard 和最终提示词；流程在生成 Prompt 文件后结束，不包含图片生成、请求提交、下载或结果回填。

本文件是项目唯一总入口。模式分流由本目录文档完成，制作流程使用工作流目录内 `single-shot/`、`multi_panel/` 的对应文档；不再加载独立的漫画 Router 或旧图片生成流程。项目根目录的 `.pi/skills/` 只提供 [Skill 检查清单](skill-check.md) 列出的第三方文本增强，不作为第二套总入口。

除 Markdown 相对链接外，本工作流中的 `./comic/`、`./temp/` 和命令路径都以项目根目录 `final_version_comic_skill/` 为基准。

## 1. 先确认项目

开始 Skill 检查或故事整理前，先确认项目是全新创建，还是继续已有项目。

项目目录统一为：

```text
./comic/<COMIC_NAME>/
```

标题不适合作为目录名时，使用用户确认的稳定 slug。不得自行改用其他名称创建重复项目。

### 已有项目

先确认 COMIC_NAME，然后优先读取：

```text
./comic/<COMIC_NAME>/project-settings.md
```

该文件是当前项目设置的唯一事实来源。模式、Scope、Review Gate、Prompt 设置及其他项目选项，都以该文件当前内容为准；用户之后修改设置时，也应先更新并重新读取该文件。

已有项目不需要重新读取 `start/single-shot/setup.md` 或 `start/multi-panel-page/setup.md` 初始化文档，除非：

- 项目设置缺少必要字段；
- 用户明确要求修改设置；
- 当前模式新增了需要补录的设置项。

如果项目目录存在但缺少 `project-settings.md`：

1. 告知用户项目设置文件缺失；
2. 请用户提供现有设置，或询问是否允许根据当前对话和项目文件生成；
3. 获得授权后，先展示并写入设置，再继续制作；
4. 未确认前不得猜测模式或其他项目设置。

### 全新项目

读取 [新项目模式选择](project-mode-selection.md)，只完成模式分流：

```text
single-shot
```

或：

```text
multi-panel-page
```

模式确认后，只读取对应的一份初始化文档：

- `single-shot` → [Single-shot 新项目设置](single-shot/setup.md)
- `multi-panel-page` → [Multi Panel 新项目设置](multi-panel-page/setup.md)

按照该文档完成 `--dry-run`、用户确认和正式创建。初始化完成后，以新建项目中的 `./comic/<COMIC_NAME>/project-settings.md` 为唯一项目设置来源，不再把项目答案写回共享模板。

## 2. 按项目模式进入工作流

读取项目 `project-settings.md` 中唯一的 `Mode`：

- `Mode: single-shot` → [单分镜工作流](single-shot/guide.md)
- `Mode: multi-panel-page` → [多分镜页面工作流](multi-panel-page/guide.md)

“漫画”“分镜”“多张图”等说法本身不能确定模式。全新项目必须由用户选择；已有项目必须使用项目设置记录的模式。

项目只使用 `project-settings.md` 保存设置和模式确认依据，不创建或读取额外的模式文件。生成单位由 `Mode` 唯一决定：`single-shot` 对应 Shot，`multi-panel-page` 对应 Page。两种模式的最终 Prompt 使用相同的 `Main + Character N` 结构，并由 Storyboard 中的稳定 `Prompt ID` 对应 `prompts/NNN-MMM.md`。

用户要求切换模式时，先说明现有 Storyboard 和 Prompt 通常不能直接复用，再确认备份和重建方式，并首先更新项目 `project-settings.md`。

## 3. 检查已安装的 Skill

模式确认后，按 [Skill 检查清单](skill-check.md) 检查当前模式所需 Skill，并输出简短结果。

缺失的推荐增强不得冒充已执行，但不会阻止本地基础提示词流程。具体 Skill 名单和缺失处理只以 `skill-check.md` 为准。

## 4. 判断从哪个阶段继续

根据用户要求、项目设置和已有资料，从最早缺失阶段继续，不无意义地重做：

1. 只有故事或剧本：从来源整理和可画节拍开始。
2. 已有人物资料：先校验来源、固定身份、服装和缺口。
3. 已有 Storyboard：先校验模式、人物／服装引用、镜头可见性和连续性。
4. 已有 Prompt：先校验对应 Storyboard、事实边界、字段归属、术语和 TODO。

具体 Scope、Review Gate 和输出要求只读取项目 `project-settings.md`，不得使用共享文档中的旧默认值覆盖项目设置。

修改现有文件前先备份，不得把模型推测改写成原文事实。

## 5. 共同制作原则

- 每次进入项目先读取项目 `project-settings.md`，再读取当前阶段所需文档。
- 区分原文明示、用户补充、用户确认的项目设定和未解决内容。
- 人物、服装、文字和剧情边界直接执行项目 `project-settings.md` 中已写入的当前模式规则。
- 固定人物资料与动作、表情、机位、环境及临时状态分开。
- 人名、地点和重复道具使用统一术语。
- Storyboard 先确定画面事实并记录稳定 Prompt ID，Prompt 只表达已确定内容，不借优化改写剧情。
- 最终 Prompt 的机器字段只有一个 `Main` 和零个或多个连续编号的 `Character N`；Character 块是通用局部提示块，不与人物或 Panel 数量绑定。
- 不把模型、采样器、分辨率等技术参数写入漫画内容 Prompt。
- Tag 查询不可用时仍可使用明确自然语言／常用标签，不得伪造查询结果。
- 第三方 Skill 尚未安装时按缺失增强处理；安装后读取实际版本。

## 6. 新项目初始结构

```text
comic/<COMIC_NAME>/
├── project-settings.md
├── story.md
├── terms.md
├── beats.md
├── characters/
│   └── characters.md
├── storyboard.md
└── prompts/
```

多分镜项目还会创建 `analysis.md` 和 `page-plan.md`。实际创建内容以对应初始化脚本和项目 `project-settings.md` 为准。

## 7. 入口完成标准

- 已确认全新项目或已有项目；
- 已确认 COMIC_NAME 和项目目录；
- 项目 `project-settings.md` 已创建或读取；
- `Mode` 唯一且已进入对应工作流；
- Scope 和其他项目选项均来自项目 `project-settings.md`；
- 已按 `skill-check.md` 报告当前模式的 Skill 状态；
- 已确定从哪个制作阶段继续；
- 没有创建重复项目，也没有用共享模板覆盖项目设置。
