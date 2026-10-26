# Single-shot Prompt 记录模板

每个 Shot 在 Storyboard 中记录唯一 `Prompt ID`，并对应一份：

```text
prompts/NNN-MMM.md
```

Single-shot 默认可把 ID 解释为 `page-shot`，但完整 stem 始终作为稳定、不拆解的生成单元 ID 使用。

## 最小格式

````markdown
# Shot 001-001 — [镜头标题]

## Main

```text
当前单幅画面的整体人数与互动、环境、道具、光线、构图和镜头
```
````

## 含局部块的格式

````markdown
# Shot 001-001 — [镜头标题]

## Main

```text
1girl, convenience-store entrance, rain, upper body, eye level
```

## Character 1

```text
Lin has black bob-cut hair and wears a white shirt with a navy skirt, holding a closed umbrella.
```

## Character 2

```text
close detail of Lin's hand gripping the umbrella handle
```
````

## 规则

- 必须且只能有一个非空 `Main` fenced code block；
- `Character N` 可以没有或有任意多个；
- Character 编号从 1 连续递增；
- Character 是通用局部提示块，不等于人物数量，也不要求与 Cast 一一对应；
- Main 和 Character 都允许多行；
- 不得包含未解决的 TODO、OPEN 或 N/A；
- Source、Cast、Summary、Review、Prompting Pass 等追踪章节均为可选；
- UC／Negative 可以为兼容旧记录而保留，但不是统一规范必需字段。
