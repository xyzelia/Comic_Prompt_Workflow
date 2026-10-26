# Multi Panel 新项目设置

> 用户已经选择 `multi-panel-page` 后直接进入本文件，不再填写共同设置表，也不读取 Single-shot 设置。
>
> [总入口](../start.md) · [Skill 检查](../skill-check.md) · [初始化后工作指南](guide.md)

## 1. 只确认三个初始化信息

```text
Project title: 漫画标题
Project slug: 2–4 个小写英文／数字单词的 kebab-case
Source: 故事、剧本或已有 Storyboard 的路径／说明
```

Slug 可以根据标题提出建议，但必须展示给用户。Source 未提供时可以建议新建 `story.md`，不能伪造已有来源。

模式固定为：

```text
Mode: multi-panel-page
```

创建的 `project-settings.md` 记录 `Mode selected by: user-confirmed`，表示用户已在模式选择中确认。原始请求已明确生成单位时，使用 `--mode-selected-by user-explicit`；不得用该参数冒充尚未发生的用户确认。生成单位由 `Mode` 推导，不另存一份可能冲突的设置。

## 2. 输出完整默认值

从项目根目录运行：

```bash
bun workflow/multi_panel/e-novelai-comic-multi-panel/scripts/new-multi_panel-comic.ts \
  <slug> \
  --title "<项目标题>" \
  --source "<来源>" \
  --root ./comic \
  --dry-run
```

`--dry-run` 输出建议的 `project-settings.md` 和主要可选值提醒，不创建文件；因此 `Visible text types: none` 后会同时显示其他可选文字类型，不应把 `none` 误认为唯一选择。

向用户说明：

```text
如果不需要修改，请回复“按默认值继续”；
也可以只列出需要修改的项目。
```

## 3. 初始化设置

`--dry-run` 会展示准备写入项目 `project-settings.md` 的完整设置。当前建议值包括：

```text
Scope: final-prompts
Beat review gate: yes
Storyboard review gate: yes
Prompt summary required: yes
Prompt ID format: NNN-MMM
Prompt ID meaning: chapter-page (default chapter/section 001 when the project has no chapters)

Max major characters per Page: 6
Visible text types: none
Reading direction: left-to-right, top-to-bottom
Default Page orientation: portrait
Additional layout restrictions: none
```

这些值只在初始化阶段展示和确认。项目创建后，以下文件是该项目设置的唯一事实来源：

```text
./comic/<slug>/project-settings.md
```

后续不得用本模板中的建议值覆盖项目文件。用户修改设置时，先更新项目 `project-settings.md`，之后重新读取该文件再继续。

### Scope、Prompt ID 与事件顺序

- 当前初始化建议 `Scope: final-prompts`。初始化后只读取项目文件中的实际 Scope。
- `Prompt ID format: NNN-MMM` 是固定文件名格式。`Prompt ID meaning` 由项目决定；默认无章节项目使用 `chapter-page` 且第一部分为 `001`，也可用 `--prompt-id-meaning` 记录 volume-page 或其他含义。工具不得从两段数字推断业务语义。
- 不设置全局 `Event reorder allowed: yes/no`。默认按故事叙述顺序规划页面；遇到复杂回忆、插叙、倒叙或非线性结构，需要改变呈现顺序时，针对具体段落询问用户并把决定写入项目记录。

## 4. Multi Panel 可选值

脚本提供完整选项说明（从项目根目录运行）：

```bash
bun workflow/multi_panel/e-novelai-comic-multi-panel/scripts/new-multi_panel-comic.ts --show-options
```

### 4.1 Character 块组织

最终 Prompt 使用统一的 `Main + Character N` 格式。`Character N` 是独立局部提示块，不等于唯一人物，也不要求与 Panel 一一对应。

一个页面可以按实际需要组织：

- Panel 基础画面块；
- 同一 Panel 中一个或多个详细人物块；
- 同一角色跨不同 Panel 的当前状态块；
- 道具、环境、局部身体、特写或覆盖画面块。

Character 数量不从人物数量、主要人物预算或 Panel 数量推导，也不设置这类上限。编号只需从 1 连续递增。完整格式由 Multi-panel 的页面 Prompt 模板维护。

### 4.2 可见漫画文字类型

完整可选值：

```text
none
speech-bubble
jagged-speech-bubble
thought-bubble
narrator-box
sound-effect
prop-text
environment-text
all
```

含义：

- `none`：页面不直接生成画内文字；
- `speech-bubble`：普通对白气泡；
- `jagged-speech-bubble`：喊叫、警报或强烈语气的锯齿气泡；
- `thought-bubble`：思考／内心气泡；
- `narrator-box`：旁白或时间说明框；
- `sound-effect`：拟声词和动作／环境声效文字；
- `prop-text`：纸条、手机、书页、卡片等道具上的文字；
- `environment-text`：招牌、门牌、墙面标识等环境文字；
- `all`：展开为全部可见文字类型。

可使用逗号组合：

```bash
--visible-text-types speech-bubble,thought-bubble,sound-effect
```

或者：

```bash
--visible-text-types all
```

脚本会检查拼写；`none` 不能与其他类型同时使用。

### 4.3 阅读方向

常用值：

```text
left-to-right, top-to-bottom
right-to-left, top-to-bottom
top-to-bottom
custom: top center, then clockwise
```

- `left-to-right, top-to-bottom`：默认左读页面；
- `right-to-left, top-to-bottom`：日式右读页面；
- `top-to-bottom`：单列、条状或纵向阅读；
- `custom: ...`：特殊阅读路线，冒号后写清顺序。

包含空格或标点时应使用引号：

```bash
--reading-direction "right-to-left, top-to-bottom"
```

阅读方向决定 Panel 顺序和文字先后，不等于人物移动方向。

### 4.4 页面方向

可选值：

```text
portrait
landscape
square
vertical-scroll
custom:<description>
```

- `portrait`：竖版页面，默认值；
- `landscape`：横版页面；
- `square`：方形页面；
- `vertical-scroll`：手机条漫／纵向滚动；
- `custom:<description>`：用户自定义页面方向说明。

示例：

```bash
--page-orientation landscape
```

### 4.5 附加 Layout 限制

`Additional layout restrictions` 是自由输入字段，不是固定枚举。`none` 表示没有额外项目级限制。

可以输入一个或多个具体限制，例如：

```text
每页固定四格
只使用 2×2
禁止斜格
禁止破框
禁止前景覆盖
每页最多三个 Panel
最后一个 Panel 必须是全宽格
全部页面保持相同网格
必须使用四格漫画结构
```

CLI 示例：

```bash
--layout-restrictions "每页固定四格；只使用 2×2；禁止破框"
```

自由输入的限制必须具体、可检查；不要只写“布局好看”或“更有漫画感”。多个限制互相冲突时必须等待用户处理。

完整参数摘要仍可查看：

```bash
bun workflow/multi_panel/e-novelai-comic-multi-panel/scripts/new-multi_panel-comic.ts --help
```

不要在文档和脚本之外再维护第三套默认值。

## 5. 用户确认后创建

使用与 `--dry-run` 完全相同的参数，去掉 `--dry-run`：

```bash
bun workflow/multi_panel/e-novelai-comic-multi-panel/scripts/new-multi_panel-comic.ts \
  <slug> \
  --title "<项目标题>" \
  --source "<来源>" \
  --root ./comic
```

脚本创建项目级 `project-settings.md` 和 Multi Panel 文本骨架。

如果 `./comic/<slug>/` 已存在，初始化必须停止并提示用户使用已有项目或提供新的 slug；不得自动追加时间戳或创建重复项目。

## 6. 初始化内容边界

以下规则在模式确认后由本文件统一说明，并写入新项目的 `project-settings.md`：

- 当前会使用的人物缺少固定身份、识别特征或 Wardrobe 时，记录 `TODO [BLOCKING]`，等待用户补充具体内容，或明确选择 `OPEN`；确实不适用时可使用 `N/A`。
- 来源互相矛盾时记录 `TODO [CONFLICT]`，列出冲突来源并等待用户选择，不得自行合并或裁定。
- `OPEN` 表示不固定具体设计，不能编译成模型自行补出的固定颜色、材质、发型、服装或其他身份特征。
- 未提供的对白、旁白、气泡文字、拟声词、道具文字和环境文字不得自行编写。
- 不得新增、删除或改变剧情事件、事件顺序、来源事实和人物关系；如确需调整，必须先获得用户明确批准并写入项目记录。
- 当前使用的人物或服装仍有 `TODO [BLOCKING]`／`TODO [CONFLICT]` 时，不得进入最终页面规划、Storyboard 或 Prompt；用户处理后重新读取完整人物文件。
- 超过项目人物上限后是拆页、修改镜头还是调整焦点，必须按项目设置处理并在必要时询问用户。
- 不采用项目默认跨格角色方案时，必须记录具体替代方案和用户确认。
- 多个复杂 Layout 方案之间不能自动替用户选择。

项目创建后优先执行项目 `project-settings.md` 中保存的这些边界；无需再次读取本初始化模板。

## 7. 创建后直接进入 Multi Panel

```text
检查 project-settings.md
→ 检查 Multi Panel Skills
→ 分析 Source、术语、人物和 Beat
→ page-plan.md
→ Layout 与逐格 Storyboard
→ 一 Page 一份 Prompt
→ 文本检查
```

不再询问漫画模式，也不返回共同设置流程。
