# 统一 Prompt 输出规范

本规范同时适用于 `single-shot` 和 `multi-panel-page`。它只规定最终 Prompt 文件的机器可读字段；来源、Cast、摘要、审校记录等追踪信息均为可选附加章节。

## 1. 文件名

每个实际生成单元对应一份 Markdown 文件：

```text
prompts/NNN-MMM.md
```

规则：

- 横杠两侧固定为三位十进制数字，不足三位左侧补零；
- 文件名必须匹配 `^\d{3}-\d{3}\.md$`；
- 完整 stem（例如 `001-027`）是稳定、唯一的生成单元 ID；
- 横杠两侧的业务含义由项目决定，提交或文本解析工具不得自行推断；
- 常见 Single-shot 项目可使用 `page-shot`；有章节的项目可使用 `chapter-page`；其他项目可以记录自己的含义；
- 标题写在文件内部，修改标题不要求修改文件名。

Storyboard 应为每个最终生成单元记录明确的 `Prompt ID`，并与文件名 stem 完全一致。

## 2. 必需字段

最小有效文件：

````markdown
## Main

```text
完整主提示词，可以多行
```
````

含局部提示块时：

````markdown
# 可选标题

## Main

```text
完整主提示词，可以多行
```

## Character 1

```text
第一个局部提示块
```

## Character 2

```text
第二个局部提示块
```
````

硬性规则：

1. 必须且只能有一个 `## Main`。
2. `Main` 必须是非空 fenced code block；推荐使用 `text` fence。
3. `## Character N` 可以没有，也可以有任意多个。
4. Character 编号从 1 开始连续递增，不得重复或跳号。
5. 每个 Character 内容必须是非空 fenced code block。
6. `Main` 和 Character 内容不得包含未解决的 `TODO`、`OPEN` 或 `N/A` 元数据。
7. Main 和 Character 都允许多行；不要求压成一行。

## 3. Character N 的含义

`Character N` 是一个独立的局部提示块或目标工具输入块，不等于唯一人物，也不强制与 Panel 一一对应。

它可以用于：

- 描述一个 Single-shot 中的主体；
- 描述一个 Multi-panel 页面中的某个 Panel 或局部画面；
- 为同一 Panel 增加一个或多个详细人物描述块；
- 描述同一角色在不同 Panel 的不同可见状态；
- 描述环境、道具、局部身体、前景覆盖或其他局部内容。

因此不得强制：

```text
Character 数量 = 人物数量
Character 数量 = Panel 数量
一个角色只能出现一次
一个 Panel 只能使用一个 Character
```

Character 顺序由当前生成单元的表达需要决定。Multi-panel 通常先按阅读顺序组织 Panel，再在同一 Panel 内安排基础画面块和详细主体块。

## 4. 模式语义

### Single-shot

- `Main`：当前单幅画面的整体人数、关系、环境、道具、光线、构图和镜头。
- `Character N`：按需要拆分的主体或局部细节块。

### Multi-panel-page

- `Main`：页面格数、阅读顺序、完整 Layout、页面共同环境和全局关系。
- `Character N`：Panel 基础画面、同格人物细节、跨格重复人物、局部特写、道具或覆盖画面等独立局部块。

模式差异由内容表达，不使用不同 Markdown 字段格式。

## 5. 可选章节

以下章节可以存在，但不是最终 Prompt 的硬性输入：

```text
Source
Cast
Summary
Layout
Panel Storyboard
Review
Prompting Pass
Image Server
其他项目记录
```

解析器只读取 `Main` 和连续编号的 `Character N`，忽略其他章节。

`UC`／Negative 章节可以为兼容旧记录而保留，但不属于本规范的必需字段；具体工具是否使用它由该工具单独说明。

## 6. 示例

### Single-shot

````markdown
# Shot 001-003 — Encounter

## Main

```text
1girl, nighttime street, rain, wide shot,
Character 1 stands beneath a streetlight and looks toward the alley
```

## Character 1

```text
adult woman, long black hair, blue coat, holding a closed umbrella
```
````

### Multi-panel

````markdown
# Page 001 — The Letter

## Main

```text
manga page, 3 panels, read left to right then top to bottom,
two small panels across the top, one wide panel across the bottom
```

## Character 1

```text
In the top-left panel, wide shot: a woman enters the room.
```

## Character 2

```text
In the top-left panel, the woman has long black hair, blue eyes, and a white coat.
```

## Character 3

```text
In the top-left panel, a man beside her has short blond hair and a black jacket.
```

## Character 4

```text
In the wide bottom panel, close-up of the woman reading the letter with a shocked expression.
```
````
