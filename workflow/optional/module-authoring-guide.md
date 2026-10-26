# Optional Module Authoring Guide

本文件规定如何在 `Comic Prompt Workflow` 中创建松散、自包含的 Optional 模块，包括模块身份、项目设置、字段命名空间、内容编译关系以及模块自身检查器和项目检查器。

Optional 模块是否启用，只由具体漫画项目的 `project-settings.md` 决定。模块不能根据目录存在、文件存在、漫画模式或 Storyboard 内容自动启用自己。

---

## 1. 模块设计原则

每个模块必须满足以下原则：

1. **自包含**：manifest、schema、文档、检查器、数据和参考资料保存在自己的目录中。
2. **稳定身份**：使用唯一且稳定的 Module ID。
3. **项目控制**：是否启用以及使用哪个 option，由项目设置决定。
4. **命名隔离**：新增 Storyboard 字段时，只使用自己的字段命名空间。
5. **明确编译关系**：说明模块内容从哪里读取、写入哪个目标，以及如何关联。
6. **双重检查职责**：模块自身检查和具体项目检查分开。
7. **只关注自己**：不解释、修改或检查其他 Optional 模块。
8. **只读检查**：检查器报告问题，但不自动修改项目内容。
9. **不绑定漫画模式**：模块不需要声明适用于哪一种漫画模式；是否启用由用户判断。
10. **不修改无关接口**：能够在已有 Prompt 内容中解决的功能，不要求图片提交脚本理解模块。

---

## 2. Module ID 与显示名称

每个模块区分：

- **Module ID**：机器使用的稳定唯一标识；
- **Display Name**：给人阅读的模块名称。

例如：

```text
Module ID: camera
Display Name: Camera
```

Module ID 使用小写 kebab-case：

```regex
^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$
```

合法示例：

```text
camera
color-script
continuity-audit
dialogue-review
```

不合法示例：

```text
Camera
color_script
continuity audit
camera-v1.0
```

规则：

- 目录名必须与 Module ID 完全相同；
- 版本号不进入 Module ID；
- Display Name 可以调整，Module ID 在项目使用后原则上不再更改；
- Module ID 不应使用过于宽泛或容易与其他功能冲突的名称。

---

## 3. 标准目录结构

每个模块位于：

```text
workflow/optional/<module-id>/
```

最小结构：

```text
workflow/optional/<module-id>/
├── module.json
├── module.schema.json
├── README.md
└── scripts/
    ├── check-module.ts
    └── check-project.ts
```

模块可以按需要增加：

```text
dataset/
manual-guides/
references/
templates/
```

所有模块专用文件都应留在模块目录中。不要把模块 schema、检查器或业务数据放入 `workflow/share/`。

---

## 4. 项目设置

项目在 `project-settings.md` 的独立章节中配置 Optional 模块：

```markdown
## Optional Modules

- camera: required
- color-script: off
```

格式：

```text
- <module-id>: <module-option>
```

规则：

- 每个 Module ID 最多出现一次；
- 没有对应设置时，使用模块 manifest 声明的默认值；
- 默认值通常为 `off`；
- option 由模块自己的 `module.json` 和 schema 定义；
- 不支持的 option 必须报错；
- 只解析 `## Optional Modules` 章节，不从其他章节推断；
- 模块不能通过某个字段或文件已经存在来反推自己已启用。

---

## 5. module.json

`module.json` 是模块的机器可读 manifest。它至少需要描述：

- schema 路径；
- module spec 版本；
- Module ID；
- Display Name；
- 模块版本；
- 简短说明；
- 项目设置默认值和 options；
- 模块入口文档；
- 模块自身检查器；
- 项目检查器。

如果模块增加 Storyboard 字段或向其他文件编译内容，还应声明：

- 模块字段；
- 来源字段；
- 目标文件或章节；
- 是否复制字段名。

Camera 示例：

```json
{
  "$schema": "./module.schema.json",
  "moduleSpecVersion": 1,
  "id": "camera",
  "name": "Camera",
  "version": "1.0.0",
  "description": "Optional Camera planning rules and validation.",
  "projectSetting": {
    "default": "off",
    "options": [
      "off",
      "required"
    ]
  },
  "storyboardFields": {
    "tags": "optional.camera.tags"
  },
  "promptIntegration": {
    "sourceField": "optional.camera.tags",
    "targetSection": "Main",
    "includeFieldName": false
  },
  "entry": "README.md",
  "moduleChecker": "scripts/check-module.ts",
  "projectChecker": "scripts/check-project.ts"
}
```

不同模块可以定义不同业务字段，但必须由自己的 schema 和检查器解释。

---

## 6. module.schema.json

每个模块在自己的目录保存自己的 JSON Schema：

```text
workflow/optional/<module-id>/module.schema.json
```

Schema 至少约束：

- 必填字段；
- Module ID；
- manifest 版本；
- 模块版本格式；
- 项目设置 options 和默认值；
- 声明路径；
- 模块字段；
- 内容集成目标。

Schema 只描述当前模块，不放入 Optional 根目录，也不尝试统一解释其他模块的业务字段。

---

## 7. Storyboard 字段命名空间

模块需要向 Storyboard 增加内容时，字段必须使用：

```text
optional.<module-id>.<field-id>
```

例如 Camera：

```markdown
**optional.camera.tags**: upper body, straight-on, three quarter view
```

命名规则：

- `optional.` 是 Optional 模块字段的保留前缀；
- 第二段必须是当前 Module ID；
- 第三段是当前模块定义的字段 ID；
- 模块只能管理 `optional.<自己的-id>.*`；
- 核心 Storyboard 字段不得使用 `optional.` 前缀；
- 一个模块不得声明或修改另一个模块的命名空间；
- Display Name 不参与机器字段命名。

未来扩展示例：

```markdown
**optional.camera.tags**: close-up, from above
**optional.camera.intent**: 强调人物意识到真相的瞬间。

**optional.color-script.palette**: muted blue, warm amber accents
**optional.continuity-audit.state**: umbrella closed, held in right hand
```

每个字段的允许数量、格式、是否必需以及如何编译，由对应模块自行定义。

---

## 8. 来源与目标关系

模块会影响其他文件时，必须明确说明：

1. **来源**：从哪个字段或模块文件读取；
2. **关联**：通过哪个稳定 ID 找到目标；
3. **目标**：写入哪个文件或章节；
4. **写入规则**：追加、合并、替换或只复制值；
5. **禁止项**：不能写入哪些位置；
6. **冲突处理**：发生矛盾时如何阻止最终输出。

Camera 示例：

```text
来源字段：optional.camera.tags
关联方式：Storyboard Prompt ID
目标文件：prompts/NNN-MMM.md
目标章节：Main
写入方式：原样合并字段值
不写入：Character N
不复制：optional.camera.tags 字段名
```

如果 Camera 信息已经进入最终 `Main`，图片提交工具只需要继续读取 `Main`，不需要识别 Camera 模块。

---

## 9. 模块自身检查器

每个模块提供：

```text
scripts/check-module.ts
```

用途是检查模块包自身是否合法。

应检查：

- `module.json` 和 `module.schema.json` 存在且是合法 JSON；
- Module ID 符合格式；
- 目录名与 Module ID 一致；
- 版本格式合法；
- 默认 option 属于允许 options；
- manifest 没有不支持的字段；
- 模块字段位于自己的命名空间；
- 来源字段和目标声明一致；
- 入口、模块检查器和项目检查器存在；
- manifest 相对路径没有离开模块目录。

模块自身检查器：

- 不接收漫画项目路径；
- 不检查 Storyboard 或 Prompt；
- 不判断项目是否启用了模块；
- 不检查其他模块。

运行形式：

```bash
bun workflow/optional/<module-id>/scripts/check-module.ts
```

---

## 10. 项目检查器

每个模块提供：

```text
scripts/check-project.ts
```

项目检查器供具体漫画项目使用：

```bash
bun workflow/optional/<module-id>/scripts/check-project.ts comic/<slug>
```

它必须：

1. 读取项目 `project-settings.md`；
2. 只解析 `## Optional Modules` 中自己的 Module ID；
3. 未配置时使用 manifest 默认值；
4. 模块关闭时明确报告 skipped；
5. 模块启用时检查自己的来源内容；
6. 通过稳定 ID 找到当前项目的目标文件；
7. 验证目标内容准确引用当前项目来源；
8. 验证内容没有遗漏、错误改写、错误重复或写错位置；
9. 保持只读，不自动修复文件；
10. 不检查或解释其他模块。

项目检查不能只检查“字段存在”。如果模块内容需要写入目标文件，还必须核对来源值和目标值。

例如 Camera 项目检查器需要确认：

```text
Storyboard optional.camera.tags
→ 对应 Prompt ID
→ prompts/NNN-MMM.md
→ Main
```

并检查：

- Camera 设置是否为 `required`；
- 每个相关 Storyboard 单位有且只有一个字段；
- tags 合法并来自 Camera catalog；
- 对应 Prompt 文件存在；
- tags 写入正确 `Main`；
- Multi-panel 内容绑定到正确 Position；
- 字段名没有进入 Prompt；
- tags 没有进入禁止的 Character 块。

---

## 11. 模块 README

每个模块的 `README.md` 至少说明：

- Module ID、Display Name 和版本；
- 默认 option 和允许 options；
- 项目启用方式；
- 模块负责的内容；
- 模块明确不负责的内容；
- 模块声明的 Storyboard 字段；
- 来源内容如何编译到目标文件；
- 模块自身检查器命令；
- 项目检查器命令；
- 数据、参考资料和限制。

模块入口文档应让 Agent 在只读取该模块目录的情况下，仍能理解如何应用和检查该模块。

---

## 12. 新建模块的执行步骤

### 步骤 1：选择 Module ID

确认名称稳定、唯一，创建同名目录。

### 步骤 2：创建 manifest 和 schema

创建：

```text
module.json
module.schema.json
```

定义模块身份、设置和检查器入口。

### 步骤 3：编写模块 README

明确模块职责、启用方式、字段和目标。

### 步骤 4：定义模块字段

如果模块需要 Storyboard 内容，使用：

```text
optional.<module-id>.<field-id>
```

并在 manifest 和 schema 中记录。

### 步骤 5：定义来源到目标的编译关系

说明稳定 ID、目标文件、目标章节和禁止位置。

### 步骤 6：编写模块自身检查器

确保模块包结构、manifest、schema 和声明文件合法。

### 步骤 7：编写项目检查器

确保项目设置正确，并验证模块内容准确引用当前项目来源和目标文件。

### 步骤 8：完成模块文档和资料整理

把数据、指南、参考资料和限制保留在模块目录中。

### 步骤 9：运行检查

```bash
bun workflow/optional/<module-id>/scripts/check-module.ts
bun workflow/optional/<module-id>/scripts/check-project.ts comic/<slug>
```

项目检查应分别覆盖模块关闭和模块启用的项目。

---

## 13. 必要要素清单

每个新模块至少具备：

- [ ] 稳定、唯一的 Module ID；
- [ ] 与 Module ID 相同的目录名；
- [ ] `module.json`；
- [ ] 模块内部的 `module.schema.json`；
- [ ] 默认 option 和允许 options；
- [ ] 模块入口 `README.md`；
- [ ] `scripts/check-module.ts`；
- [ ] `scripts/check-project.ts`；
- [ ] 模块字段使用 `optional.<module-id>.*`；
- [ ] 明确来源字段或来源文件；
- [ ] 明确目标文件或目标章节；
- [ ] 使用稳定 ID 关联来源与目标；
- [ ] 项目检查器验证内容准确引用和写入；
- [ ] 检查器只读且只关注本模块；
- [ ] 模块不根据漫画模式自动启用；
- [ ] 模块不修改其他模块的设置、字段或文件。

---

## 14. Camera 模块作为参考实现

当前 Camera 模块可以作为新模块的参考：

```text
workflow/optional/camera/
```

其中：

```text
module.json
→ 声明 camera、off|required、optional.camera.tags、Main 和两个检查器

module.schema.json
→ 约束 Camera manifest

scripts/check-module.ts
→ 检查 Camera 模块包

scripts/check-project.ts
→ 检查项目是否启用 Camera，以及 Storyboard tags 是否准确进入 Prompt Main
```

Camera 只把 `optional.camera.tags` 的值编译进现有 `Main`，因此不要求图片生成或提交脚本理解 Camera 模块。这是 Optional 模块保持松散耦合的推荐方式。
