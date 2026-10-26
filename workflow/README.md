# Comic Prompt Workflow — 使用说明

> 从故事与分镜到最终漫画提示词的纯文本工作流

本目录保存从零开始建立漫画项目、整理来源、设计人物、制作 Storyboard，并生成最终 Prompt 所需的文本流程。

项目内容保存在项目根目录的 `comic/`，临时文件保存在 `temp/`。

## 入口

让 AI 首先读取：

[`start/start.md`](start/start.md)

模式选择后，只进入对应的一套流程：

| 模式 | 新项目初始化 | 初始化后制作 |
|---|---|---|
| `single-shot` | [单分镜设置](start/single-shot/setup.md) | [单分镜指南](start/single-shot/guide.md) |
| `multi-panel-page` | [多分镜页面设置](start/multi-panel-page/setup.md) | [多分镜页面指南](start/multi-panel-page/guide.md) |

两种模式的最终 Prompt 都使用统一结构：每个生成单元输出一份 `prompts/NNN-MMM.md`，包含一个 `Main` 和零个或多个连续编号的 `Character N`。

## 从零开始的文件路线

### 共同入口

```text
start/
├── start.md
├── project-mode-selection.md
├── skill-check.md
├── single-shot/
│   ├── setup.md
│   └── guide.md
└── multi-panel-page/
    ├── setup.md
    └── guide.md
```

### Single-shot

```text
single-shot/e-novelai-comic-single-shot/
├── SKILL.md
├── references/
└── scripts/
```

生成路线：

```text
project-settings.md
→ story.md
→ terms.md
→ beats.md
→ characters/characters.md
→ storyboard.md
→ prompts/
```

### Multi-panel

```text
multi_panel/e-novelai-comic-multi-panel/
├── SKILL.md
├── references/
└── scripts/
```

生成路线：

```text
project-settings.md
→ story.md
→ analysis.md + terms.md + beats.md
→ characters/characters.md
→ page-plan.md
→ storyboard.md
→ prompts/
```

## 第三方文本 Skills

当前流程只使用项目根目录 `.pi/skills/` 中的以下 Skills：

- `nai5-writing`
- `nai5-costume-writing`
- `nai5-comic-storyboard`
- `nai5-comic-writing`

具体用途和读取时机见 [`start/skill-check.md`](start/skill-check.md)。第三方许可和来源文件应保留在各 Skill 目录中。

## 关闭后继续已有项目

重新开启会话后，提供工作流目录、漫画项目目录和本次任务：

```text
请继续已有漫画项目，不要重新初始化。

工作流目录：/workspace/example_proj_test/final_version_comic_skill/workflow
项目目录：/workspace/example_proj_test/final_version_comic_skill/comic/<slug>

先读取 workflow/start/start.md，
再读取项目 project-settings.md，
按其中 Mode 进入对应 guide.md。
检查已有文件和未解决事项后，报告当前阶段与下一步。
```

恢复顺序：

1. 读取 `start/start.md` 和项目 `project-settings.md`。
2. 根据 `Mode` 只读取一份模式指南。
3. 按当前任务读取 story、terms、characters、beats、页面规划、storyboard 和相关 prompts。
4. 检查未解决的 `TODO [BLOCKING]`／`TODO [CONFLICT]`。
5. 先报告已完成内容、待确认内容和本次继续范围，再继续修改。

已有项目通常不重新读取模式选择和初始化设置，也不重新运行初始化脚本。

## 工具

核心文本工具使用 Bun。当前脚本没有外部 npm 包依赖，不需要先运行 `npm install`。

从项目根目录运行：

```bash
# 初始化工具帮助
bun workflow/single-shot/e-novelai-comic-single-shot/scripts/new-single-shot-comic.ts --help
bun workflow/multi_panel/e-novelai-comic-multi-panel/scripts/new-multi_panel-comic.ts --help

# 测试
bun test \
  workflow/single-shot/e-novelai-comic-single-shot/scripts/text-tools.test.ts \
  workflow/multi_panel/e-novelai-comic-multi-panel/scripts/text-tools.test.ts

# 项目检查
bun workflow/single-shot/e-novelai-comic-single-shot/scripts/check.ts comic/<slug>
bun workflow/multi_panel/e-novelai-comic-multi-panel/scripts/check.ts comic/<slug>
```

机器检查用于发现结构、编号、引用和未解决元数据问题，不能替代人工审查故事事实、构图和连续性。
