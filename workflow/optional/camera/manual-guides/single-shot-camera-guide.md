# Single-shot Camera Guide

本文件只整理 `single-shot` 模式的自研 Camera 规则。共同的景别、角度、POV、构图、焦点、标签预算和 canonical 输出规则见 [`share-camera-guide.md`](share-camera-guide.md)。

当前 Single-shot 正式工作流：

- [新项目设置](../../../start/single-shot/setup.md)
- [制作指南](../../../start/single-shot/guide.md)
- [Storyboard 模板](../../../single-shot/e-novelai-comic-single-shot/references/storyboard-template.md)
- [统一 Prompt 格式](../../../share/prompt-format/prompt-output-format.md)

---

## 1. 生成单位

`single-shot` 中：

```text
一个 Shot = 一个实际生成单元 = 一份 prompts/NNN-MMM.md
```

因此：

- 不写整页 Panel grid、gutter 或页面 Layout 标签；
- Camera 只服务当前 Shot；
- Storyboard 的 Page 用于组织阅读和叙事，不表示整页必须一次生成；
- 每个 Shot 在 Storyboard 中记录稳定 `Prompt ID`；
- Prompt ID 与 `prompts/NNN-MMM.md` 文件名一致。

---

## 2. Storyboard Camera 字段

Camera 模块使用唯一、带命名空间的 Prompt-ready 字段：

```text
optional.camera.tags
```

`Scene` 写画面事实，`optional.camera.tags` 写准备原样合并进最终 `Main` 的英文 canonical tags：

```markdown
## Page 3 — 天台追逐

### Shot 03-01 — 起跑
**Prompt ID**: 003-001
**Cast**: Lin (Outfit B)
**Source**: story.md 第 3 段
**Scene**: Lin 朝 Camera 跑来，身后是夜晚天台和城市灯火。
**optional.camera.tags**: full body, straight-on, facing viewer, depth of field

### Shot 03-02 — 接住
**Prompt ID**: 003-002
**Cast**: Lin (Outfit B)
**Source**: story.md 第 3 段
**Scene**: Lin 蹲下抱住猫，头发被风吹动。
**optional.camera.tags**: upper body, from side
```

同一个 Shot 最多出现一次 `optional.camera.tags`。字段值只包含英文 Camera tags，不包含动作、环境、人物、说明句或字段名。Agent 生成 Prompt 时必须原样复制，不重新翻译、改写或选择 Camera。

完整编译约定见 [`../references/prompt-integration.md`](../references/prompt-integration.md)。

---

## 3. Single-shot 常用 Camera 词汇

| 中文 | 推荐英文表达 |
|---|---|
| 特写 | `close-up` |
| 肖像／肩部特写 | `portrait` |
| 半身 | `upper body` |
| 七分身 | `cowboy shot` |
| 全身 | `full body` |
| 远景 | `wide shot` |
| 平视 | `straight-on`（自然语言可称 eye level） |
| 俯视 | `from above` |
| 仰视 | `from below` |
| 过肩 | `over shoulder` |
| 背面 | `from behind` |
| 侧面 | `from side`、`profile` |
| 三分之四侧面 | `three quarter view` |
| 第一人称 | `pov` |

具体 canonical spelling 以 [`camera_tags.yaml`](../dataset-camera-tag/camera_tags.yaml) 为准。

---

## 4. 信息与景别匹配

- 面部表情或眼神变化：`close-up`／`portrait`。
- 手部动作和上半身服装：至少 `upper body`。
- 腰部动作、裙裤或拔枪：至少 `cowboy shot`。
- 鞋子、完整服装或全身动作：`full body`。
- 环境布局、人物与地点关系：`wide shot`。
- 小道具细节：独立 `close-up`，或明确 `object focus`。

如果一个 Shot 同时要求互斥的可见范围，例如“面部极近特写”与“完整鞋子清晰可见”，不得堆叠矛盾标签。应选择以下方法之一：

1. 拆成两个 Shot；
2. 调整主要叙事信息；
3. 使用能同时承载信息的较宽景别；
4. 把次要信息留给前后 Shot。

---

## 5. 单 Shot 单一摄影关系

一个 Shot 默认只有：

- 一个主要时刻；
- 一个主要主体焦点；
- 一个主要景别；
- 一个主要垂直角度；
- 一个主要朝向或 POV。

以下情况应拆 Shot 或重新设计：

- 同时要求相反机位；
- 同时要求多个互斥景别；
- 同一画面塞入先后发生的多个动作；
- 重要人物、道具和环境都需要独立特写；
- 当前构图无法清楚表达施受关系。

具名 Cast 数量由项目 `project-settings.md` 决定，Camera 规范不设置固定两人上限，也不决定最终 `Character N` 块数量。

---

## 6. POV 与过肩镜头

纯 POV：

```text
pov, pov hands, object focus
```

适合：

- 观察手中道具；
- 看向对面的角色；
- 第一人称进入空间。

过肩镜头：

```text
upper body, over shoulder, blurry foreground
```

适合：

- 对话中的空间锚定；
- 前景保留一名角色，焦点落在对面角色；
- 需要半主观视点但仍看到观察者肩背。

纯 POV 不应同时要求观察者完整背影或全身出现在画面中。

---

## 7. 连续性

连续 Shot 之间检查：

- 人物左右位置是否无理由翻转；
- 视线方向是否连续；
- 道具在哪只手；
- 服装临时状态是否保持；
- Camera 切换是否有叙事目的；
- 建立镜头之后的近景是否仍能辨认地点；
- 动作进入与动作结果是否属于正确 Shot。

Camera 变化应承担信息变化：

```text
wide shot     → 建立地点
upper body    → 展示互动
close-up      → 强调反应或关键物件
from behind   → 隐藏表情或强化距离
from below    → 强化威胁或力量
from above    → 强化脆弱或空间压迫
```

不要让连续多个 Shot 只改变文字描述而保持完全相同的景别、角度和人物站位，除非项目明确需要稳定重复构图。

---

## 8. 最终 Prompt 中的 Camera

Single-shot Prompt 使用统一格式：

````markdown
## Main

```text
1girl, rooftop at night, full body, straight-on,
running toward the camera, city lights in the background
```

## Character 1

```text
Lin has black hair and wears Outfit B, hair blowing in the wind
```
````

默认分工：

- `Main`：整体人数／关系、环境、光线、构图，以及从 `optional.camera.tags` 原样编译的 Camera tags。
- `Character N`：按需要拆分的主体、人物细节、道具特写或其他局部提示块。

Camera 模块只把 tags 合并到 `Main`，不创建新的 `## Camera` 章节，也不把 Camera tags 写入 `Character N`。字段名 `optional.camera.tags` 本身不进入 Prompt。

---

## 9. Single-shot 检查清单

- [ ] 每个 Shot 有唯一 `Prompt ID`。
- [ ] 当前 Shot 只有一个主要时刻。
- [ ] 已选择一个主要景别。
- [ ] 景别能够覆盖所有必须可见的信息。
- [ ] 垂直角度和主体朝向不冲突。
- [ ] POV 与观察者可见范围一致。
- [ ] 动作、道具手位、服装状态和人物位置与前后 Shot 连续。
- [ ] Camera 改动没有改变剧情事实。
- [ ] 每个 Shot 最多有一个 `optional.camera.tags`，且不存在未解决标记。
- [ ] `optional.camera.tags` 的值已原样合并进 `Main`，字段名没有进入 Prompt。
- [ ] Camera tags 没有写入 `Character N`。
- [ ] 最终文件符合 `prompts/NNN-MMM.md` 和统一 Prompt 格式。

---

## 10. 自研来源

本文件整理自历史 Single-shot Storyboard Camera 模板：

```text
/workspace/example_proj_test/comic_skill/comic_skill_collection/
.pi/skills/novelai-comic/references/storyboard-template.md
```

原模板中的旧 `NN-MM` 文件编号、固定 Cast 数量、旧 Prompt 字段、Image Server 分工和其他过时约束没有保留；当前规则以现行 Single-shot 工作流和统一 Prompt 格式为准。
