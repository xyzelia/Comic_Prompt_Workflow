# Multi Panel 文本工具

本目录只处理本地 Markdown，不联网、不生成图片。需要 Bun。

## 初始化项目

```bash
bun <baseDir>/scripts/new-multi_panel-comic.ts story-name --root ./comic --dry-run
bun <baseDir>/scripts/new-multi_panel-comic.ts story-name --root ./comic
```

查看可选文字类型、阅读方向、页面方向、Layout 限制和 Character 块说明：

```bash
bun <baseDir>/scripts/new-multi_panel-comic.ts --show-options
```

初始化创建：

```text
project-settings.md
story.md
analysis.md
terms.md
beats.md
page-plan.md
storyboard.md
characters/characters.md
prompts/
```

默认设置只是待核对起点；创建后以项目 `project-settings.md` 为唯一设置来源。Storyboard 中每个 Page 记录稳定的三位 `Prompt ID`，默认示例为 `001-001`。

## 人物提示词片段

```bash
bun <baseDir>/scripts/cast.ts <comic-dir> --list
bun <baseDir>/scripts/cast.ts <comic-dir> --show "Lin" A
bun <baseDir>/scripts/cast.ts <comic-dir> --prompt "Lin" A --extra "looking left"
```

工具只组装固定身份、完整 Wardrobe 和可选局部状态，不决定最终 Character 块数量或 Panel 映射。选中资料含 TODO 时拒绝输出。

## 最终文本检查

```bash
bun <baseDir>/scripts/check.ts <comic-dir>
```

检查内容包括：

- `project-settings.md` 的唯一 `Mode: multi-panel-page`；
- Page／Panel 编号、Panel Count、Reading Order 和 Layout 必填字段；
- 人物、Outfit、文字类型和主要人物预算；
- 每个 Page 的唯一 `Prompt ID`，格式为 `NNN-MMM`；
- `prompts/NNN-MMM.md` 存在性、孤立文件和文件名格式；
- 必需的 `Main` fenced code block；
- 任意数量、从 1 连续编号的 `Character N` fenced code blocks；
- Main／Character 中未解决的 TODO、OPEN、N/A；
- 多格页 Main 的 `borderless panels` 要求。

检查器不要求 Source、Cast、Summary、Layout 摘要、Review 或 Prompting Pass 等附加章节，也不强制 Character 数量与人物、局部出场或 Panel 数量相等。

完整格式见 [页面 Prompt 模板](../references/prompt-record-template.md)。

## 重编号

```bash
bun <baseDir>/scripts/renumber.ts <comic-dir>
```

备份后按文档顺序整理 Page／Panel 标题编号。Storyboard 中的稳定 Prompt ID 和 `prompts/NNN-MMM.md` 文件名保持不变。自由文本中的旧编号、`page-plan.md` 和其他外部引用仍需人工核对。

## 本地测试

```bash
bun test <baseDir>/scripts/text-tools.test.ts
```

测试使用临时目录并自动清理，不触碰真实项目。
