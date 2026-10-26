# 漫画提示词文本工具

本目录只处理本地 Markdown，不联网、不提交图片任务、不读取服务配置。需要 Bun。
以下 `<baseDir>` 是本 Skill 目录，`<comic-dir>` 是具体文本项目目录；均可使用绝对路径。

## 初始化项目

```bash
bun <baseDir>/scripts/new-single-shot-comic.ts cat-cafe-day --root ./comic --dry-run
bun <baseDir>/scripts/new-single-shot-comic.ts cat-cafe-day --root ./comic
```

第一次使用 `--dry-run` 输出完整建议设置但不创建文件；用户确认默认值或给出覆盖选项后，去掉 `--dry-run` 创建项目级 `project-settings.md`、story、terms、beats、storyboard、characters 和 prompts。脚本内置共同默认值与单分镜默认值，可用 `--help` 查看覆盖选项；不创建图片生成配置。人物缺口仍必须逐项等待用户填写或选择 OPEN。
slug 使用 2–4 个小写英文／数字单词的 kebab-case。如果同名项目目录已经存在，初始化会直接失败；应继续使用已有项目或由用户提供新的 slug，不会自动追加时间戳创建副本。初始化只提供待填写骨架，不会创作内容；占位符不是已完成提示词。

新项目在设置中记录 `Mode selected by: user-confirmed`；原始请求明确指定模式时使用 `--mode-selected-by user-explicit`。生成单位由 `Mode` 决定，不维护第二份模式文件。项目创建后，后续工作只读取项目 `project-settings.md`，不回退使用初始化默认值。

## 人物提示词

```bash
bun <baseDir>/scripts/cast.ts <comic-dir> --list
bun <baseDir>/scripts/cast.ts <comic-dir> --show "Lin" A
bun <baseDir>/scripts/cast.ts <comic-dir> --prompt "Lin" A --extra "holding umbrella"
```

只读，向标准输出打印结果。`--prompt` 使用明确的 `Prompt Tags (identity)` 和指定 Wardrobe，拼接并去重，不将人读 Base 自动当作提示词。
选中的 Base／Wardrobe／身份标签含 TODO 时拒绝输出；OPEN／N/A 元数据行不进入输出。仍须人工检查来源、可见性和跨镜头状态。

**输入格式必须遵循本 Skill 的 [人物模板](../references/character-template.md)**：`## Character 1: Lin`、`**Base ...**:`、`**Prompt Tags (identity)**:`、`**Wardrobe A - ...**:`，标签放在 `- ...` 行中。工具不支持任意 Markdown 或另一套多 Panel 的三级标题模板。

## 最终文本检查

```bash
bun <baseDir>/scripts/check.ts <comic-dir>
```

只读检查：

- `project-settings.md` 存在且恰好一条 `Mode: single-shot`，模式与确认依据只读取该文件；
- Page／Shot 编号、重复编号；
- 人物和 Outfit 引用、项目设置中的每 Shot 具名角色上限及多人例外；
- 被使用人物的显式 BLOCKING／CONFLICT；
- 每个 Shot 的 `Prompt ID` 使用唯一 `NNN-MMM`；
- Prompt 文件存在性、孤立文件和文件名格式；
- 必需的 `Main` fenced code block；
- 任意数量、从 1 连续编号的 `Character N` fenced code blocks；
- Main／Character 中未解决的 TODO、OPEN、N/A。

退出码 0 表示机器检查通过，1 表示有错误。不要求 Source、Cast、Summary、Review、Prompting Pass 或其他追踪章节。
完整 Prompt 格式见 [Prompt 记录模板](../references/prompt-record-template.md)。纯环境镜头可以只有 `Main`。

**限制**：不会验证 Source 引用真实存在、画面可画性、服装状态合理性、Character 块与人物／局部画面的语义映射或审校过程真实性。检查通过不代替人工审稿。

## 重编号

```bash
bun <baseDir>/scripts/renumber.ts <comic-dir>
```

按文档顺序更新 Page／Shot 标题编号。Storyboard 中的稳定 `Prompt ID` 和 `prompts/NNN-MMM.md` 文件名保持不变。修改前备份 `storyboard.md` 到项目内唯一的 `.renumber-backup-*` 目录。

重复 Shot ID 或 Shot 没有 Page 时在修改前拒绝执行。正文中的自由文本旧编号、元数据计数及外部引用仍需人工核对。

## 本地测试

```bash
bun test <baseDir>/scripts/text-tools.test.ts
```

测试使用临时目录并自动清理，不触碰真实项目，也不调用外部服务。

## 本次清理

- 删除仅用于出图参数验证的 `config.ts`。
- 移除 Skill、Workflow、TODO 和本说明中的图片提交、队列恢复、服务地址、配置、下载与结果回填步骤。
- 删除 Prompt 格式中的 Route、Output File Stem、请求／结果字段。
- 保留四个文本工具，并补充 TODO 闸门、重编号备份与冲突保护。
- 仅修改此整理副本，未修改 collection 的原始 Skill；副本已不再与原始文件逐字节相同，根目录旧来源映射应视为初次复制记录。
