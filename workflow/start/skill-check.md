# 漫画提示词工作流 Skill 检查

选择漫画模式后、正式整理故事前，检查项目根目录的 `.pi/skills/`。不能只看到目录名就认定可用；至少确认对应 `SKILL.md` 存在并可读取。

第三方 Skill 应保留安装包提供的 `LICENSE`、`NOTICE` 和 `SOURCE.json`，不要删除或改写来源信息。

## 1. 本工作流会使用的 Skill 名单

| Skill | 适用模式 | 用途 | 要求 |
|---|---|---|---|
| `nai5-writing` | 单分镜、多分镜 | 普通画面、动作、镜头和关系的提示词表达审校 | 推荐增强；缺少时可使用本地基础审校继续 |
| `nai5-costume-writing` | 单分镜、多分镜 | 服装状态或服装措辞需要专项处理时使用 | 条件可选；普通任务不强制 |
| `nai5-comic-storyboard` | 多分镜 | 页面结构、阅读顺序、Panel 分配和连续性辅助 | 多分镜推荐；缺少时按本地页面规划文档继续并报告 |
| `nai5-comic-writing` | 多分镜 | 把已确认的多 Panel Storyboard 编译为页面级 Prompt | 多分镜推荐；单分镜禁止使用其页面格式 |

预期入口路径：

```text
.pi/skills/nai5-writing/SKILL.md
.pi/skills/nai5-costume-writing/SKILL.md
.pi/skills/nai5-comic-storyboard/SKILL.md
.pi/skills/nai5-comic-writing/SKILL.md
```

当前流程只使用以上 4 个第三方文本 Skill。漫画总入口为 [`start.md`](start.md)，模式选择由本目录共同文档负责；单分镜初始化与指南位于 `single-shot/`，多分镜页面初始化与指南位于 `multi-panel-page/`；详细制作流程使用项目内 `single-shot/`、`multi_panel/` 文档。不再通过独立 Router 或旧漫画生成 Skill 分流。

本工作流不安装、不检查、不调用图片服务、图片生成、提交、下载或恢复工具。

第三方原文中可能提到其他构思、角色设计、服装设计或构图 Skill；这些是可选创作接续，不是当前流程的必需依赖。未安装时不得去其他项目查找同名 Skill，不自动安装或假称执行；若当前任务确实需要新的设计决定，按项目内容边界列出缺口并询问用户。用户明确要求引入额外工具时，再单独确认安装范围。

## 2. 单分镜检查

```text
[ ] .pi/skills/nai5-writing/SKILL.md
[ ] .pi/skills/nai5-costume-writing/SKILL.md（仅服装专项任务）
```

检查顺序：

1. 确认 `nai5-writing/SKILL.md` 是否存在并可读。
2. 本次涉及复杂服装状态或服装措辞时，再检查 `nai5-costume-writing/SKILL.md`。
3. 单分镜不得加载 `nai5-comic-writing` 的页面编译规则。

## 3. 多分镜检查

```text
[ ] .pi/skills/nai5-comic-storyboard/SKILL.md
[ ] .pi/skills/nai5-writing/SKILL.md
[ ] .pi/skills/nai5-comic-writing/SKILL.md
[ ] .pi/skills/nai5-costume-writing/SKILL.md（仅服装专项任务）
```

检查顺序：

1. 页面规划和逐格 Storyboard 使用 `nai5-comic-storyboard`。
2. 普通视觉表达使用 `nai5-writing`。
3. 页面级 Prompt 编译使用 `nai5-comic-writing`。
4. 复杂服装表达按需使用 `nai5-costume-writing`。

## 4. 检查结果格式

开始工作前输出简短结果：

```text
Skill 检查：
- 模式：single-shot / multi-panel-page
- 已安装：[列表]
- 缺少但推荐：[列表]
- 本次条件不适用：[列表]
- 使用方案：本地基础流程／本地流程 + 已安装增强
```

## 5. 缺失和冲突处理

- 不自动安装，不声称缺失 Skill 已执行；需要安装时先报告。
- 推荐增强缺失不会绕过人物确认闸门，也不会阻止本地基础流程；最终报告说明哪些增强未执行。
- Skill 已安装时先读取其实际 `SKILL.md`，再按其中链接读取本次必要的 references；不要根据旧摘要或 Skill 名称猜测规则。
- 第三方建议与本工作流冲突时，原文事实、用户设定、人物 TODO 闸门、已确认 Storyboard 和当前模式边界优先。
- `optimized` 可以表示实际完成的本地提示词审校；如果记录第三方 Profile，则必须确实读取并使用了对应 Skill。
- Skill 目录存在但 `SKILL.md` 缺失或不可读时，按未安装处理并报告。
