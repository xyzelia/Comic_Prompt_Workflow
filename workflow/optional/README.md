# Optional Modules

`workflow/optional/` 保存松散、自包含的可选模块。模块是否启用只由具体漫画项目的 `project-settings.md` 决定；主工作流不能根据目录存在、文件存在或漫画模式自动启用模块。

完整的新模块创建规范见：

[`module-authoring-guide.md`](module-authoring-guide.md)

## 项目设置

项目在 `project-settings.md` 的独立章节中配置模块：

```markdown
## Optional Modules

- camera: required
```

格式：

```text
- <module-id>: <module-option>
```

规则：

- 没有对应设置时，模块使用自己的默认值；
- Module ID 和 option 由模块自己的 `module.json` 定义；
- 是否启用、启用哪个 option，由用户针对当前项目决定；
- Optional 系统不根据 `single-shot`、`multi-panel-page` 或其他项目字段替用户选择模块；
- 模块不得修改其他模块的设置或解释其他模块的业务规则。

## 标准结构

```text
workflow/optional/<module-id>/
├── module.json
├── module.schema.json
├── README.md
└── scripts/
    ├── check-module.ts
    └── check-project.ts
```

模块可以在自己的目录中继续保存：

```text
dataset/
manual-guides/
references/
templates/
```

## 字段命名空间

模块需要向 Storyboard 增加内容时，使用：

```text
optional.<module-id>.<field-id>
```

例如：

```markdown
**optional.camera.tags**: upper body, straight-on
```

模块只能管理自己的命名空间。核心 Storyboard 字段不得使用 `optional.` 前缀。

## 两个检查器

### 模块自身检查器

```text
scripts/check-module.ts
```

检查 manifest、schema、Module ID、目录、设置、字段声明、目标声明和模块内部路径是否合法。不接收漫画项目路径。

### 项目检查器

```text
scripts/check-project.ts <project-dir>
```

检查当前项目是否启用模块，并在启用后验证模块来源内容是否准确引用和写入目标文件。项目检查器只关注本模块，保持只读，不承担跨模块调度。

## 当前模块

```text
camera/
```

Camera 模块使用：

```text
Module ID: camera
Storyboard field: optional.camera.tags
Prompt target: Main
```

模块说明：

[`camera/README.md`](camera/README.md)
