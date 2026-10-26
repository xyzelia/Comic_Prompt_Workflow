# Comic Prompt Workflow

> 从故事与分镜到最终漫画提示词的纯文本工作流

本项目用于从零建立漫画项目，整理故事、人物与连续性，完成 Storyboard，并生成结构化的最终 Prompt。工作流到 Prompt 文件和文本检查结束，不包含图片生成、任务提交、下载或结果回填。

## 目录

```text
.pi/       # 当前工作流实际使用的文本 Skills
comic/     # 本地漫画项目目录；项目内容默认不提交 Git
workflow/  # 制作流程、单分镜与多分镜模式文档及文本工具
temp/      # 日志和临时文件；不提交 Git
```

核心工作流目录：

```text
workflow/
├── start/                  # 总入口、模式选择、初始化和恢复指南
├── single-shot/            # Single-shot 文本流程、模板和工具
└── multi_panel/            # Multi-panel 页面文本流程、模板和工具
```

`.pi/skills/` 中纳入当前流程的 Skill：

```text
nai5-writing
nai5-costume-writing
nai5-comic-storyboard
nai5-comic-writing
```

## 工作模式

| 模式 | 生成单位 | 用途 |
|---|---|---|
| `single-shot` | 一个 Shot 一份 Prompt | 单幅连续镜头、逐 Shot 生成 |
| `multi-panel-page` | 一个 Page 一份 Prompt | 一次生成包含多个 Panel 的完整漫画页面 |

两种模式使用相同的最终 Prompt 基础结构：

```text
prompts/NNN-MMM.md
├── Main
└── Character 1 ... Character N
```

`Main` 必须且只能有一个；`Character N` 可省略，也可有任意多个，编号从 1 连续递增。每个字段的内容放在独立的非空 fenced code block 中。

`NNN-MMM` 是项目定义的稳定 Prompt ID。`Character N` 是通用局部提示块，其数量不与人物数量或 Panel 数量绑定。

## 入口

让 AI 首先读取：

[`workflow/start/start.md`](workflow/start/start.md)

完整使用说明：

[`workflow/README.md`](workflow/README.md)

所有命令默认从项目根目录执行。漫画项目位于：

```text
comic/<slug>/
```

## 常用文本工具

运行以下工具需要安装 Bun；核心脚本没有外部 npm 包依赖，无需先运行 `npm install`。

查看初始化工具帮助：

```bash
bun workflow/single-shot/e-novelai-comic-single-shot/scripts/new-single-shot-comic.ts --help
bun workflow/multi_panel/e-novelai-comic-multi-panel/scripts/new-multi_panel-comic.ts --help
```

检查已有项目：

```bash
# Single-shot
bun workflow/single-shot/e-novelai-comic-single-shot/scripts/check.ts comic/<slug>

# Multi-panel
bun workflow/multi_panel/e-novelai-comic-multi-panel/scripts/check.ts comic/<slug>
```

运行文本工具测试：

```bash
bun test \
  workflow/single-shot/e-novelai-comic-single-shot/scripts/text-tools.test.ts \
  workflow/multi_panel/e-novelai-comic-multi-panel/scripts/text-tools.test.ts
```
