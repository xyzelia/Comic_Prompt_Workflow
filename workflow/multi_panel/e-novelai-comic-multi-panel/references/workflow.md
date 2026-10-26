# 多 Panel 漫画提示词文本工作流

## 1. 项目入口

1. 确认漫画名字和 `comic/<漫画名字>/`。
2. 全新项目先在 `workflow/start/project-mode-selection.md` 选择 `multi-panel-page`，然后只读 `workflow/start/multi-panel-page/setup.md`；使用 `new-multi_panel-comic.ts --dry-run` 展示默认值，用户确认后创建项目。
3. 已有项目优先读取其 `project-settings.md`；缺失时提示用户添加，或询问是否允许根据当前资料生成。
4. 只读取项目 `project-settings.md`，确认唯一模式为 `multi-panel-page`；不创建或读取第二份模式记录。
5. 按 `workflow/start/skill-check.md` 检查可选第三方 Skill，并报告实际可用项。

## 2. 保存与分析来源

保存原始故事为 `story.md`，已有文件替换前备份。按 [来源分析与 Beat](source-analysis-and-beats.md) 建立：

```text
analysis.md
terms.md
beats.md
```

`analysis.md` 保存故事顺序、人物关系、来源事实、文字内容、地点道具和冲突；`beats.md` 保存可画事件、反应、停顿和揭示。不要在来源分析中补造固定人物或服装事实。

## 3. 人物资料和强制闸门

按 [人物模板](character-template.md) 建立 `characters/characters.md`。

当前会使用的身份、识别特征或 Wardrobe 缺失时写：

```text
TODO [BLOCKING] — 原文未交代，请用户补充或选择 OPEN
```

冲突写 `TODO [CONFLICT]` 并列来源。向用户列出清单后停止；用户可以填写、选择 `OPEN` 或在不适用时用 `N/A`。用户处理后重新读取整个文件，更新 Prompt Tags 和 Wardrobe Prompt，再扫描一次。闸门未解除时不写最终页面规划、Storyboard 或 Prompt。

## 4. 页面规划

按 [页面规划](page-planning.md) 把 Beat 分配到 `page-plan.md`：

- 每页的叙事目的；
- 页面开始和结束状态；
- Page 核心 Beat；
- 建议 Panel 数；
- 页尾揭示或承接；
- 不同主要人物数量；
- 预计局部出场次数；
- 页面文字类型。

先按叙事和可读性安排，不用 Character 块数量反向删剧情。页面过载时拆页或重新分配，结构变化按项目审阅设置交用户确认。

## 5. Layout 与逐格 Storyboard

按 [Layout](layout.md) 和 [逐格 Storyboard 模板](panel-storyboard-template.md) 写 `storyboard.md`。

每页必须明确：

- Panel Count；
- Reading Order；
- Layout；
- 每格位置和相对大小；
- Source；
- Cast 与 Outfit；
- 景别和机位；
- 一个主要可读时刻；
- 环境、道具、动作、表情和当前状态；
- 文字归属；
- 前后格连续性。

人物和 Outfit 只能引用已确认资料。`OPEN` 不能偷偷变成固定颜色、发型或服装设计。

## 6. 页面 Prompt

每个 Page 在 Storyboard 中记录稳定 `Prompt ID`，并写一份：

```text
prompts/NNN-MMM.md
```

文件名含义由项目决定。默认无章节项目可使用 `001-NNN`；未来有章节时可使用 `chapter-page`。按 [页面 Prompt 模板](prompt-record-template.md) 编写。

### Main

负责页面共同信息：

- 页面级人数／互动概况；
- Panel Count、Reading Order 和完整 Layout；
- 多格页面所需的分格表达；
- 页面共同环境、光线和气氛；
- 页面确实存在的气泡、旁白框等文字类型。

### Character N

`Character N` 是一个独立局部提示块，可以表达：

- 某个 Panel 的基础画面；
- 同一 Panel 中一个或多个详细人物；
- 同一角色在其他 Panel 的当前状态；
- 道具、环境、局部身体、特写或覆盖画面。

一个 Panel 可以使用多个 Character 块；一个角色也可以出现在多个块中。Character 数量不等于人物数量或 Panel 数量，不设置此类上限。编号按当前页面组织顺序从 1 连续递增，定位词与 Layout 保持一致。

## 7. 漫画文字

按 [文字归属规则](text-and-dialogue.md)：

- 引号内可见文字保持用户指定原文和语言；
- 不提供文字时不擅自写新台词；
- 对白、思考、旁白、拟声词和道具文字各自有唯一承载位置；
- 页面有文字时不写与其冲突的 `no text`；
- 静默 Panel 省略文字指令。

## 8. 提示词审校

本地基础审校检查：

- 来源事实和用户锚点无丢失；
- Layout 与 Panel 定位一致；
- Cast、Outfit、动作、表情、文字归属一致；
- 跨格状态连续；
- 同一主体没有互斥动作、机位或服装状态；
- Main 与各 Character N 块没有互相矛盾；
- Character 块的 Panel 定位与 Layout 一致；
- 没有 TODO、OPEN、N/A 或占位符进入最终 Prompt；
- 没有模型参数、请求字段或服务器配置。

第三方 Skill 已安装时可在事实草稿之后增强：先 `nai5-comic-storyboard`，再 `nai5-writing` 和 `nai5-comic-writing`，服装按需使用 `nai5-costume-writing`。只有实际读取和使用后才记录对应 Profile。缺失时完成本地审校并如实报告。

## 9. 检查与交付

如环境支持 Bun：

```bash
bun <baseDir>/scripts/check.ts <comic-dir>
```

检查器只验证可机器判断的结构，不证明叙事质量或模型效果。交付报告列出：

- 项目路径、漫画名字和模式；
- Page／Panel 数量；
- 人物预算和 Character 块组织方式；
- analysis、beats、page-plan、characters、storyboard 和 prompts 路径；
- 第三方 Skill 实际使用情况；
- TODO／OPEN／待确认项；
- 机器检查结果；
- 仅供草案使用的内容。

本工作流到最终页面提示词和检查报告为止。
