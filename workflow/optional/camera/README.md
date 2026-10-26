# Camera Optional Module

Camera 是 `Comic Prompt Workflow` 的松散可选模块。模块只负责 Camera 规划、资料和自身合法性，不替用户判断项目是否应该启用它，也不根据漫画模式自动启用。

## 模块身份

```text
Module ID: camera
Display Name: Camera
Version: 1.0.0
Default option: off
Available options: off | required
Storyboard field: optional.camera.tags
Prompt target: Main
```

模块目录名与 Module ID 保持一致：

```text
workflow/optional/camera/
```

身份、设置和入口的机器可读定义见 [`module.json`](module.json)，其 JSON Schema 见 [`module.schema.json`](module.schema.json)。

## 项目启用方式

项目只通过自己的 `project-settings.md` 决定是否启用 Camera：

```markdown
## Optional Modules

- camera: required
```

设置含义：

- `camera: off`：不启用本模块；
- `camera: required`：当前项目明确启用 Camera，并要求项目中的相关生成单位完成 Camera 决策；
- 未写 `camera`：使用模块默认值 `off`。

当前阶段不让模块根据 `single-shot`、`multi-panel-page` 或其他项目字段自行判断是否适用。用户选择 `required` 后，模块只按当前项目实际存在的 Page、Panel 或 Shot 结构处理 Camera。

## Storyboard 字段与 Prompt 目标

Camera 模块使用带 Module ID 命名空间的唯一 Storyboard 字段：

```markdown
**optional.camera.tags**: upper body, straight-on, three quarter view
```

命名结构是：

```text
optional.<module-id>.<field-id>
```

Camera 模块只能管理 `optional.camera.*`，核心 Storyboard 字段和其他模块不得复用这个命名空间。当前只声明 `optional.camera.tags`；同一个 Shot／Panel 中最多出现一次。

该字段保存英文、逗号分隔、准备直接进入 Prompt 的 Camera tags。生成最终 Prompt 时，Agent 原样复制字段值并合并进现有 `Main`，不复制字段名，不创建 `## Camera`，也不把 Camera tags 写入 `Character N`。

完整编译规则见 [`references/prompt-integration.md`](references/prompt-integration.md)。

## Camera 业务边界

本模块用于在 Storyboard 阶段明确景别、机位、朝向、视点、构图、焦点和镜头效果，并把确认后的 Camera 决策编译进最终 Prompt。

启用后不能只处理少数重点画面：

- 项目使用独立 Shot 时，每个 Shot 都应有明确 Camera；
- 项目使用包含多个 Panel 的 Page 时，每个 Page 应有完整 Camera plan，且 Page 内每个 Panel 都应有明确 Camera。

包含多个 Panel 的 Page 通常有多个不同镜头。“Page 已完成 Camera”表示该页所有 Panel 的 Camera 决策完整，不表示整页只有一个统一机位。

每个 Shot／Panel 的最小 Camera 决策至少包括：

1. 一个主要景别；
2. 一个主要角度、朝向或 POV。

按叙事需要再补充：

- 透视或镜头畸变；
- 构图与裁切；
- 焦点与景深；
- 运动线或光学效果。

Camera 决策必须与主体动作、人物位置、可见服装、道具、环境和连续性一致。互斥机位、互斥景别以及尚未解决的 Camera 冲突不能进入最终 Prompt。

本模块不负责：

- 判断用户应选择哪种漫画模式；
- 自动修改剧情、人物事实、服装、对白或页面节拍；
- 自动启用自身；
- 检查或管理其他 Optional 模块；
- 执行图片生成、提交、下载或结果回填。

## 模块内容

```text
camera/
├── module.json
├── module.schema.json
├── README.md
├── camera_improve.md
├── camera_reference_skill.md
├── dataset-camera-tag/
├── references/
│   └── prompt-integration.md
├── manual-guides/
│   ├── share-camera-guide.md
│   └── single-shot-camera-guide.md
└── scripts/
    ├── check-module.ts
    ├── check-module.test.ts
    ├── check-project.ts
    └── check-project.test.ts
```

- [`manual-guides/share-camera-guide.md`](manual-guides/share-camera-guide.md)：通用 Camera 选择规则；
- [`manual-guides/single-shot-camera-guide.md`](manual-guides/single-shot-camera-guide.md)：独立 Shot 的 Camera 规则；
- [`camera_improve.md`](camera_improve.md)：详细规则与完整 canonical catalog；
- [`camera_reference_skill.md`](camera_reference_skill.md)：Camera 相关资料索引；
- [`dataset-camera-tag/`](dataset-camera-tag/)：Camera tag catalog 与结构 schema；
- [`references/prompt-integration.md`](references/prompt-integration.md)：`optional.camera.tags` 到 `Main` 的编译规则；
- [`scripts/check-module.ts`](scripts/check-module.ts)：Camera 模块包自身合法性检查器；
- [`scripts/check-project.ts`](scripts/check-project.ts)：具体漫画项目的 Camera 启用与 Prompt 编译检查器。

## 模块自身检查器

运行：

```bash
bun workflow/optional/camera/scripts/check-module.ts
```

该检查器只检查 Camera 模块包本身是否合法：

- manifest 和 schema 是合法 JSON；
- Module ID 合法并与目录名一致；
- 版本、默认 option 和 options 合法；
- Storyboard 字段只能是 `optional.camera.tags`；
- Prompt 目标只能是 `Main`，且不得复制字段名；
- manifest 声明的入口、模块检查器和项目检查器存在；
- 声明路径没有离开 Camera 模块目录。

它不接收漫画项目路径，也不检查其他 Optional 模块。

## 项目 Camera 检查器

运行：

```bash
bun workflow/optional/camera/scripts/check-project.ts comic/<slug>
```

该检查器读取项目 `project-settings.md` 中的 `## Optional Modules`：

- 未写 `camera` 时按默认值 `off` 处理；
- `camera: off` 时报告未启用并跳过 Camera 内容检查；
- `camera: required` 时检查 Storyboard 和对应 Prompt；
- Camera 设置重复或不是 `off|required` 时报告错误。

启用后检查：

- 每个实际 Shot／Panel 恰好有一个 `optional.camera.tags`；
- 字段值不为空，不含 `TODO`、`OPEN` 或 `N/A`；
- tags 没有重复，并存在于本模块 canonical catalog；
- Storyboard 的 `Prompt ID` 对应 `prompts/NNN-MMM.md`；
- 每个 Camera tag 已按要求写入该文件的 fenced `Main`；
- Multi-panel Camera tags 与 Panel `Position` 位于同一 Main clause；
- `optional.camera.tags` 字段名没有被复制进 Prompt；
- Camera tags 没有写入 `Character N`。

项目检查器根据 Storyboard 中实际存在的 Shot 或 Panel 结构工作，不读取项目 Mode，也不会修改任何文件。
