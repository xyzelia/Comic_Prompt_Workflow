---
name: novelai-comic
description: 将故事整理为单镜头分镜、角色资料和分离式漫画提示词。仅制作与检查文本，不生成图片。
version: 0.5.0
---

# 单镜头漫画提示词制作

本副本是纯文本工作流：`故事 → Beat → Storyboard + Characters → Prompts → 检查与报告`。
一个 Shot 对应一个画面时刻，不编译整页多 Panel。默认文字留在图外；用户明确要求画内文字时保留原文并明确载体。

## 输入与边界

- 输入故事／剧本，或已有分镜和角色资料。
- 只读取项目 `project-settings.md` 中唯一的 `Mode: single-shot`，不读取其他模式记录；用户需要整页多 Panel 时停止，转交相应工作流。
- 固定事实来自原文或用户确认。当前角色身份、识别特征或会使用的 Wardrobe 有缺口时标记 `TODO [BLOCKING]`，列出问题并等待用户选择填写或改为 `OPEN`；来源冲突标记 `TODO [CONFLICT]`。阻塞项和冲突项未解决，不写最终 Storyboard 或最终提示词。
- `OPEN` 必须由用户明确选择，表示允许该项不固定；不得自动转为固定事实，也不把 `OPEN`／`N/A` 字样拼入提示词。用户处理后重新读取完整人物文件。
- 当前项目 Character Prompt Policy 优先于这里的默认字段分工。启用的 Policy 如果不同，应同步适配工具与模板后再执行。
- 不提供服务地址、模型参数、图片提交、下载或请求结果回填。

## 项目结构

```text
comic/{topic-slug}/
├── project-settings.md
├── story.md
├── terms.md
├── beats.md
├── storyboard.md
├── characters/characters.md
└── prompts/NNN-MMM.md
```

每个 Shot 在 Storyboard 中记录独立的 `Prompt ID`。文件名使用固定三位的 `NNN-MMM`，横杠两侧含义由项目决定；Single-shot 默认采用 `page-shot`。标题供人阅读，不参与文件名。修改已有文件前先备份。

## 工作阶段

1. 先确认漫画名字和项目目录。已有项目优先读取其 `project-settings.md`；缺失时提示用户添加，或取得授权后根据当前资料生成。全新项目先选择 `single-shot`，再按对应设置和初始化脚本建立该文件，然后保存故事和术语表。
2. 按 [shot-extraction.md](references/shot-extraction.md) 提取节拍，交用户审阅。
3. 按 [character-template.md](references/character-template.md) 建立 Base、Prompt Tags 和完整 Wardrobe；按 [storyboard-template.md](references/storyboard-template.md) 写镜头。每镜具名角色上限读取项目设置，默认 6 名；用户可按漫画和场景复杂度调小。
4. 先运行 `cast.ts --prompt` 得到身份／服装片段，再由 AI 根据镜头处理可见状态、动作和表情，写独立 Prompt 记录。脚本不负责故事创作或语义优化。
5. 执行提示词审校，运行 `check.ts`，报告文本产物和仍需人工处理的问题，至此结束。

可按用户要求停在 Beat 或 Storyboard 阶段；对应阶段文件不齐时不要运行最终 Prompt 全量检查。

## 默认提示词分工

```text
Main = 当前生成单元的整体人数／互动 + 环境／道具 + 光线／气氛 + 构图／镜头
Character N = 按需要拆分的主体、局部细节或其他局部提示块
```

- `Character N` 数量不等于人物数量，也不要求和 Cast 一一对应；一个主体或局部画面可以使用多个块。
- 支持英文、中文及其他 Unicode；Main 和 Character 都允许多行。
- 临时服装变化应输出当前完整可见状态，不用“同上一镜头”等相对描述。持续换装建立新 Wardrobe。
- 可在授权范围补充不带颜色、材质、品牌或剧情含义的通用类别；不得冒充原文事实。
- 本模板只记录画面内容正向词，不包含技术参数，也不假定其他系统会自动补全它们。最终格式使用一个 `Main` 和零个或多个连续编号的 `Character N`。

## 提示词审校

本 Skill 自身即可完成基础审校，不把外部 Tag 查询或第三方提示词资料作为硬依赖。审校必须保留故事事实、用户锚点、人物身份、Wardrobe、镜头和连续性；检查字段归属、术语一致、可见性、同一主体的矛盾标签及无意义同义词堆叠。

辅助资料可用时可以增强用词；不可用时使用明确自然语言和已知常用标签继续，不得伪造查询结果。预期的可选第三方入口为 [`nai5-writing`](../../../.pi/skills/nai5-writing/SKILL.md)，服装专项表达为 [`nai5-costume-writing`](../../../.pi/skills/nai5-costume-writing/SKILL.md)；链接允许在安装前暂时不存在。普通单镜头不使用 `nai5-comic-writing` 的多 Panel 页面编译格式。

安装后先读取实际文件再使用。第三方资料不得覆盖来源事实、用户设定、人物确认闸门或本 Skill 的字段边界。审校结果可以记录在可选的 Review 或 Prompting Pass 章节中，但不属于最终 Prompt 的硬性机器字段。格式检查器只验证 `Main`、连续编号的 `Character N` 和未解决元数据，不能证明审校质量。

## 脚本

`{baseDir}` 为当前 SKILL.md 所在目录，使用 Bun 运行：

| 脚本 | 作用 |
|---|---|
| `scripts/new-single-shot-comic.ts` | 输出／创建带默认用户设置的单分镜文本项目骨架，不覆盖原项目 |
| `scripts/cast.ts` | 列出／查看人物，组装身份和服装提示词 |
| `scripts/check.ts` | 只读校验编号、引用和 Prompt 格式 |
| `scripts/renumber.ts` | 备份后整理 Page／Shot 标题编号；稳定 Prompt ID 和文件名保持不变 |

完整命令、限制与测试见 [scripts/README.md](scripts/README.md)。
完整流程见 [references/workflow.md](references/workflow.md)，文件模板见 [references/prompt-record-template.md](references/prompt-record-template.md)。
术语表见 [references/terms.md](references/terms.md)。
