---
name: novelai-comic-multi-panel
description: 将故事整理为整页多 Panel 漫画分镜和页面级提示词；一个 Page 对应一份 Prompt 记录。仅制作与检查文本，不生成图片。
version: 0.1.0
---

# 整页多分镜漫画提示词制作

本 Skill 的提示词单位是一个完整 Page。每页包含一个或多个 Panel；Layout、阅读顺序、逐格内容、漫画文字和跨格连续性都在页面记录中表达。它不把每个 Panel 当成独立单图任务，也不处理图片生成服务。

## 入口与边界

- 先确认漫画名字和项目目录，优先读取 `comic/<漫画名字>/project-settings.md`。
- 项目设置必须包含唯一的 `Mode: multi-panel-page`；只读取 `project-settings.md`，不读取其他模式记录。
- 全新项目先通过 `workflow/start/project-mode-selection.md` 选择 `multi-panel-page`，然后只读 `workflow/start/multi-panel-page/setup.md`；先用 `new-multi_panel-comic.ts --show-options` 查看可选值和自由输入示例，再用 `--dry-run` 展示建议设置，确认后创建项目。
- 当前人物身份、识别特征或会使用的 Wardrobe 有缺口时标记 `TODO [BLOCKING]`；来源冲突标记 `TODO [CONFLICT]`。列出问题并等待用户填写或选择 `OPEN`，闸门未解除时不写最终 Storyboard 或页面 Prompt。
- 不包含服务器地址、请求字段、下载路径、模型参数、采样设置或图片结果。

## 项目结构

```text
comic/<漫画名字>/
├── project-settings.md
├── story.md
├── analysis.md
├── terms.md
├── beats.md
├── page-plan.md
├── characters/
│   └── characters.md
├── storyboard.md
└── prompts/
    ├── 001-001.md
    ├── 001-002.md
    └── ...
```

一个 Page 只有一份当前 Prompt 记录。每页在 Storyboard 中记录稳定 `Prompt ID`，文件名统一使用 `NNN-MMM.md`；横杠两侧含义由项目决定。无章节项目默认可使用 `001-NNN`，未来可扩展为 `chapter-page`。

## 工作阶段

1. 读取项目设置和 [Skill 检查清单](../../start/skill-check.md)。
2. 保存故事，按 [来源分析与 Beat](references/source-analysis-and-beats.md) 建立 `analysis.md`、`terms.md` 和 `beats.md`。
3. 按 [人物模板](references/character-template.md) 建立人物和 Wardrobe，执行强制人工确认闸门。
4. 按 [页面规划](references/page-planning.md) 把 Beat 分配到 Page，建立 `page-plan.md`。
5. 按 [Layout](references/layout.md) 和 [逐格 Storyboard 模板](references/panel-storyboard-template.md) 编写 `storyboard.md`。
6. 用户审阅页面结构后，按 [页面 Prompt 模板](references/prompt-record-template.md) 编写 `prompts/NNN-MMM.md`。
7. 按 [文字归属规则](references/text-and-dialogue.md) 和完整工作流审校，运行文本检查并交付报告。

## 多 Panel 核心规则

- 一个 Page 是一个完整生成／提示词单位；修改某格时，必须重新核对该页 Layout、阅读顺序和相邻连续性。
- 先确定页面目的和阅读节拍，再决定 Panel 数；不为了丰富排版机械增加格子。
- 每个 Panel 冻结一个主要可读时刻。连续动作只有在过程本身重要时拆成多个 Panel。
- 每页明确 Panel Count、Reading Order、Layout、每格位置和相对大小。
- 页面主要人物数量按 `project-settings.md`；默认最多 6 名不同身份。背景群众不计，承担剧情、动作或对白的人物必须计入。
- `Character N` 是独立局部提示块，可以描述 Panel 基础画面、同格多个详细人物、跨格重复主体、道具、环境、局部特写或覆盖画面。Character 数量不等于人物数量或 Panel 数量，不设置一一对应规则。
- `Visible text types`、`Reading direction`、`Default Page orientation` 和 `Additional layout restrictions` 以项目设置为准；自由 Layout 限制必须转成可检查条件，不能只写模糊审美要求。
- 多格页面的 Main 必须包含完整 Layout。当前 NAI5 Profile 下，多格页使用 `borderless panels`；只有一个 Panel 的页面不写该词。任何单词都不能代替完整布局描述。
- 漫画文字保留用户指定原文和语言。对白归属说话者及 Panel；旁白、拟声词和道具文字明确承载 Panel；静默格不添加文字。
- 不把人物完整身份和 Wardrobe 重复放入 Global；不把整页环境、光线和相机信息塞入 Character Prompt。

## 可选第三方增强

按实际安装路径读取：

- [`nai5-comic-storyboard`](../../../.pi/skills/nai5-comic-storyboard/SKILL.md)：页面结构、Layout、阅读顺序和连续性。
- [`nai5-writing`](../../../.pi/skills/nai5-writing/SKILL.md)：普通视觉表达。
- [`nai5-comic-writing`](../../../.pi/skills/nai5-comic-writing/SKILL.md)：多 Panel 页面 Prompt 编译。
- [`nai5-costume-writing`](../../../.pi/skills/nai5-costume-writing/SKILL.md)：服装专项表达，按需。

链接允许在安装前暂时不存在。缺失时使用本 Skill 的基础流程继续并报告；存在时先读取实际版本。第三方建议不得覆盖来源事实、用户设置、人物闸门或已确认 Storyboard。

## 文本工具

| 脚本 | 作用 |
|---|---|
| `scripts/new-multi_panel-comic.ts` | 输出／创建带默认用户设置的多 Panel 文本项目骨架 |
| `scripts/cast.ts` | 查看人物并组装身份／Wardrobe 基础片段 |
| `scripts/check.ts` | 只读校验页面、Panel、人物引用和 Prompt 结构 |
| `scripts/renumber.ts` | 备份后整理 Page／Panel 及页面 Prompt 编号 |

命令和限制见 [scripts/README.md](scripts/README.md)。完整阶段说明见 [references/workflow.md](references/workflow.md)。
