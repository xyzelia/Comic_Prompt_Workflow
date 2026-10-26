# 页面 Prompt 记录模板

每个实际页面生成单元在 Storyboard 中记录唯一 `Prompt ID`，并对应一份：

```text
prompts/NNN-MMM.md
```

文件名横杠两侧含义由项目决定。没有章节的 Multi-panel 项目默认可以使用 `001-NNN`，把第一部分作为默认章节／分组 `001`，第二部分作为 Page 编号；有章节时可以自然扩展为 `chapter-page`。

本文件包含当前模式所需的完整 Prompt 字段规则。

## 最小格式

````markdown
# Page 001 — [页面标题]

## Main

```text
borderless panels, 3 panels, read left to right then top to bottom,
two small panels across the top, one wide panel across the bottom
```

## Character 1

```text
In the top-left panel, medium shot: Lin stands at the convenience-store entrance and watches the rain.
```

## Character 2

```text
In the top-left panel, Lin has black bob-cut hair and wears a white shirt with a navy skirt.
```

## Character 3

```text
In the top-right panel, close-up of rain dripping from the closed umbrella.
```

## Character 4

```text
In the wide bottom panel, Mei enters from the right while Lin turns toward her.
```

## Character 5

```text
In the wide bottom panel, Mei has brown hair, wears a blue dress, and has a speech bubble saying "还不回去吗？"
```
````

## Main 规则

包含：

- 实际 Panel 数和完整 Layout；
- Reading Order 必要说明；
- 多格页的 `borderless panels`；单格页省略；
- 页面共同环境、光线、气氛和全局关系；
- 页面实际存在的文字类型。

不包含：

- 与具体局部块冲突的完整主体细节；
- 模型、分辨率、采样、Seed、服务器或请求字段；
- 未配置的画风和质量词。

## Character N 规则

`Character N` 是独立的局部提示块，不等于唯一人物，也不要求与 Panel 一一对应。

一个 Panel 可以使用：

- 一个基础画面块；
- 多个详细人物块；
- 道具、环境或局部特写块；
- 前景覆盖或其他局部内容块。

同一角色跨格时可以在多个块中分别写当前可见状态；同一个 Panel 中也可以用多个块补充不同人物或细节。不得用人物数量或 Panel 数量限制 Character 数量。

Character 编号按当前生成单元的组织顺序从 1 连续递增。Multi-panel 通常先按阅读顺序组织 Panel，再在同一 Panel 内排列基础画面与详细主体块。所有定位词必须与 Storyboard Layout 一致。

## 可选记录

以下章节可以按项目需要附加，但检查器和 Prompt 解析器不强制：

```text
Source
Layout
Panel Storyboard
Cast
Summary
Review
Prompting Pass
```

最终机器字段只有 `Main` 和连续编号的 `Character N`。

## 禁止进入最终字段

```text
TODO
OPEN
N/A
未替换占位符
模型或图片生成参数
请求和结果状态
```
