# 新漫画项目模式选择

> 本文件只负责全新项目的模式分流。不要在这里收集标题、slug、Source 或其他项目设置。

## 1. 仅用于全新项目

已有项目返回 [总入口](start.md)，读取：

```text
./comic/<COMIC_NAME>/project-settings.md
```

不要使用本文件重新初始化已有项目，也不要重新询问已经记录的模式。

## 2. 选择生成单位

全新项目必须由用户选择一种模式：

```text
1. single-shot
   每个 Shot 一份独立 Prompt。

2. multi-panel-page
   每个 Page 包含多个 Panel，整页一份 Prompt。
```

“漫画”“分镜”“多张图”等说法不能代替模式选择。没有默认模式，Agent 不得自动推断，也不得同时启动两套流程。

用户可以直接回复：

```text
single-shot
```

或：

```text
multi-panel-page
```

## 3. 选择后只读取一份初始化文档

### `single-shot`

只读取：

- [Single-shot 新项目设置](single-shot/setup.md)

由该文档负责收集初始化字段、展示默认设置、处理用户确认并运行 Single-shot 初始化脚本。

### `multi-panel-page`

只读取：

- [Multi Panel 新项目设置](multi-panel-page/setup.md)

由该文档负责收集初始化字段、展示默认设置、处理用户确认并运行 Multi Panel 初始化脚本。

不要再返回共同设置流程，也不要读取另一种模式的初始化文档。

## 4. 模式切换

模式切换不属于新项目初始化。用户要求切换已有项目模式时，返回 [总入口](start.md)，先说明现有 Storyboard 和 Prompt 可能需要重建，再等待用户确认。
