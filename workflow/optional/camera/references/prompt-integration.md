# Camera Storyboard Field and Prompt Integration

本文件定义 Camera 模块如何在不改变最终 Prompt artifact 结构和图片提交接口的前提下，把 Storyboard 中确认的 Camera tags 编译进 `Main`。

## 1. 字段名称

Camera 模块唯一声明的 Storyboard 编译字段是：

```text
optional.camera.tags
```

Markdown 写法：

```markdown
**optional.camera.tags**: upper body, straight-on, three quarter view
```

命名结构：

```text
optional.<module-id>.<field-id>
optional.camera.tags
```

规则：

- `optional` 是 Optional 模块字段的保留前缀；
- `camera` 必须与 Camera 的 Module ID 完全一致；
- `tags` 表示该值是准备编译进 Prompt 的 tags；
- 核心 Storyboard 字段不得使用 `optional.` 前缀；
- Camera 模块不得声明或修改 `optional.<other-module>.*`；
- 同一个 Shot／Panel 中最多出现一个 `optional.camera.tags`。

不要使用以下非规范字段：

```markdown
**Camera Tags**: ...
**camera**: ...
**optional.camera.camera-tags**: ...
```

## 2. 值格式

字段值使用一行英文、逗号分隔的 Prompt-ready Camera tags：

```markdown
**optional.camera.tags**: full body, straight-on, facing viewer, depth of field
```

要求：

- 使用 canonical spelling；
- 不包含字段名称或说明句；
- 不包含人物、服装、动作、环境或对白；
- 不包含 `TODO`、`OPEN` 或 `N/A`；
- 不同时包含互斥景别、互斥角度或互斥 POV；
- `camera: required` 时，相关生成单位不得缺失该字段。

## 3. Scene 边界

启用 Camera 模块后，推荐把画面事实和 Prompt-ready Camera tags 分开：

```markdown
**Scene**: Lin 站在便利店门口看雨，手里握着合拢的伞。
**optional.camera.tags**: upper body, straight-on, three quarter view
```

`Scene` 负责：

- 人物与动作；
- 表情与互动；
- 环境和道具；
- 当前可见状态与连续性事实。

`optional.camera.tags` 负责：

- 景别；
- 角度和朝向；
- POV；
- 透视；
- 构图和裁切；
- 焦点、景深和镜头效果。

如果旧 Storyboard 的 `Scene` 仍包含自然语言 Camera，必须与 `optional.camera.tags` 一致；冲突时记录 `TODO [CONFLICT]`，不得生成最终 Prompt。

## 4. Single-shot 编译

Storyboard：

```markdown
### Shot 03-01 — 起跑

**Prompt ID**: 003-001
**Cast**: Lin (Outfit B)
**Source**: story.md 第 3 段
**Scene**: Lin 朝 Camera 跑来，身后是夜晚天台和城市灯火。
**optional.camera.tags**: full body, straight-on, facing viewer, depth of field
```

Prompt：

````markdown
## Main

```text
1girl, full body, straight-on, facing viewer, depth of field,
running toward the camera, rooftop at night, city lights in the background
```
````

编译规则：

1. 按 `Prompt ID` 找到对应 Prompt 文件；
2. 原样复制字段值，不翻译、不改写、不重新选择；
3. 把 tags 合并到 `Main`；
4. 不把字段名 `optional.camera.tags` 写进 Prompt；
5. 不把 Camera tags 写入 `Character N`；
6. 完全相同的 tag 在同一语义范围只保留一次。

## 5. Multi-panel Page 编译

每个 Panel 记录自己的 Camera tags：

```markdown
### Panel 01-01 — 等雨

**Position**: top-left panel
**Scene**: Lin 站在便利店门口看雨。
**optional.camera.tags**: upper body, straight-on, three quarter view

### Panel 01-02 — 伞尖

**Position**: top-right panel
**Scene**: 雨水从伞尖滴落。
**optional.camera.tags**: close-up, from above, object focus
```

Page 的 `Main` 按 Reading Order 合并：

```text
three-panel comic page, borderless panels,
top-left panel: upper body, straight-on, three quarter view;
top-right panel: close-up, from above, object focus;
...
```

规则：

- Camera tags 必须和 Panel 的 `Position` 绑定；
- 不把某个 Panel 的 Camera tags 提升为整页共同 Camera；
- 不遗漏 Page 中的任何 Panel；
- Page 内所有 Panel 都完成后，才视为该 Page 的 Camera plan 完成；
- 字段名本身不进入 `Main`。

## 6. Prompt artifact 与图片提交

Camera 模块不增加新的最终 Prompt 机器字段。输出仍然是：

````markdown
## Main

```text
...
```

## Character 1

```text
...
```
````

Camera 只改变 `Main` 的文本内容，不改变：

- Prompt 文件名；
- `Main + Character N` 结构；
- Prompt parser；
- 图片请求字段；
- 图片提交、队列、重试或结果记录流程。

现有图片提交工具读取 `Main` 并把它作为 global prompt 发送，因此不需要识别 Camera 模块。

## 7. Agent 编译约束

Agent 在生成 Prompt 时必须把 `optional.camera.tags` 当作编译字面量，而不是灵感建议：

```text
读取 → 原样复制 → 按 Shot／Panel 定位 → 合并进 Main
```

禁止：

- 同义改写；
- 翻译为其他英文表达；
- 擅自增加或删除 tag；
- 把 Camera tags 移到 Character 块；
- 用新 Camera 覆盖已确认 tags；
- 在冲突未解决时生成最终 Prompt。

Camera 模块提供两个独立检查器：

- `scripts/check-module.ts`：只验证模块 manifest、schema、字段命名空间和 Prompt 目标；
- `scripts/check-project.ts`：读取具体项目设置，并在 `camera: required` 时核对 Storyboard 的 `optional.camera.tags` 是否正确编译进对应 Prompt 的 `Main`。

两个检查器均只读，不修改 Storyboard、Prompt 或图片提交配置。
