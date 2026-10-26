# Single-shot 新项目设置

> 用户已经选择 `single-shot` 后直接进入本文件，不再填写共同设置表，也不读取 Multi Panel 设置。
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
Mode: single-shot
```

创建的 `project-settings.md` 记录 `Mode selected by: user-confirmed`，表示用户已在模式选择中确认。原始请求已明确生成单位时，使用 `--mode-selected-by user-explicit`；不得用该参数冒充尚未发生的用户确认。生成单位由 `Mode` 推导，不另存一份可能冲突的设置。

## 2. 输出完整默认值

从项目根目录运行：

```bash
bun workflow/single-shot/e-novelai-comic-single-shot/scripts/new-single-shot-comic.ts \
  <slug> \
  --title "<项目标题>" \
  --source "<来源>" \
  --root ./comic \
  --dry-run
```

`--dry-run` 只输出建议的 `project-settings.md`，不创建文件。

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
Prompt ID meaning: page-shot

Max named cast per Shot: 6
Multi-character exception allowed: no
On-image text: off
Prompt field policy: default
Storyboard language: user-working-language
Final Prompt language: concise-English-tags-phrases
```

这些值只在初始化阶段展示和确认。项目创建后，以下文件是该项目设置的唯一事实来源：

```text
./comic/<slug>/project-settings.md
```

后续不得用本模板中的建议值覆盖项目文件。用户修改设置时，先更新项目 `project-settings.md`，之后重新读取该文件再继续。

### Scope 与事件顺序

- 当前初始化建议 `Scope: final-prompts`，表示工作流以最终 Prompt 为目标，并完成缺少的前置文本阶段。初始化后只读取项目文件中的实际 Scope。
- 不设置全局 `Event reorder allowed: yes/no`。默认按故事叙述顺序处理；遇到复杂回忆、插叙、倒叙或非线性结构，只有在需要重新编排才能清楚分镜时，才针对具体段落询问用户，并把决定写入项目记录。

### Single-shot 设置解释

- `Prompt ID format: NNN-MMM`：固定文件名格式，不可改成两位编号。
- `Prompt ID meaning: page-shot`：仅为默认业务含义；项目可用 `--prompt-id-meaning` 记录 chapter-page、volume-shot 或其他自定义含义，工具把完整 stem 当作不透明稳定 ID。
- `Max named cast per Shot: 6`：默认允许每个 Shot 最多 6 名需要独立身份控制的具名角色。用户可按漫画类型、场景复杂度或目标工具能力把数字调小。
- `Multi-character exception allowed: no`：当前 Shot 超过项目设定上限时，默认必须调整镜头、拆 Shot 或询问用户；改为 `yes` 只表示允许明确记录的例外，不表示自动把所有 Shot 做成多人镜头。
- `On-image text: off`：默认不要求模型生成对白、旁白或气泡；用户指定部分 Shot 有字时改为 `selected-shots`。
- `Prompt field policy: default`：Main 负责当前画面的整体人数／互动、环境／道具、光线和镜头；Character N 按需要承载主体、人物细节或其他局部提示块。Character 数量不与人物数量绑定。自定义分工必须由用户明确提供。
- `Storyboard language: user-working-language`：Storyboard 使用用户当前交流语言。
- `Final Prompt language: concise-English-tags-phrases`：最终 Prompt 默认使用简洁英文标签／短语，必要时加入清楚自然语言。

完整可修改选项由脚本维护，需要时从项目根目录运行：

```bash
bun workflow/single-shot/e-novelai-comic-single-shot/scripts/new-single-shot-comic.ts --help
```

不要在文档和脚本之外再维护第三套默认值。

## 4. 用户确认后创建

使用与 `--dry-run` 完全相同的参数，去掉 `--dry-run`：

```bash
bun workflow/single-shot/e-novelai-comic-single-shot/scripts/new-single-shot-comic.ts \
  <slug> \
  --title "<项目标题>" \
  --source "<来源>" \
  --root ./comic
```

脚本创建项目级 `project-settings.md` 和 Single-shot 文本骨架。

如果 `./comic/<slug>/` 已存在，初始化必须停止并提示用户使用已有项目或提供新的 slug；不得自动追加时间戳或创建重复项目。

## 5. 初始化内容边界

以下规则在模式确认后由本文件统一说明，并写入新项目的 `project-settings.md`：

- 当前会使用的人物缺少固定身份、识别特征或 Wardrobe 时，记录 `TODO [BLOCKING]`，等待用户补充具体内容，或明确选择 `OPEN`；确实不适用时可使用 `N/A`。
- 来源互相矛盾时记录 `TODO [CONFLICT]`，列出冲突来源并等待用户选择，不得自行合并或裁定。
- `OPEN` 表示不固定具体设计，不能编译成模型自行补出的固定颜色、材质、发型、服装或其他身份特征。
- 未提供的对白、旁白、气泡文字和其他画内文字不得自行编写。
- 不得新增、删除或改变剧情事件、事件顺序、来源事实和人物关系；如确需调整，必须先获得用户明确批准并写入项目记录。
- 当前使用的人物或服装仍有 `TODO [BLOCKING]`／`TODO [CONFLICT]` 时，不得进入最终 Storyboard 或 Prompt；用户处理后重新读取完整人物文件。
- 超过项目 `Max named cast per Shot` 时，是否拆 Shot、调整镜头或允许例外，读取项目设置并在必要时询问用户。

项目创建后优先执行项目 `project-settings.md` 中保存的这些边界；无需再次读取本初始化模板。

## 6. 创建后直接进入 Single-shot

```text
检查 project-settings.md
→ 检查 Single-shot Skills
→ 整理 Source、术语、人物和 Beat
→ 一 Shot 一份 Storyboard
→ 一 Shot 一份 Prompt
→ 文本检查
```

不再询问漫画模式，也不返回共同设置流程。
