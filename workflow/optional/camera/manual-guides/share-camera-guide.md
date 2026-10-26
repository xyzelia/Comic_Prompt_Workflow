# Share Camera Guide

本文件整理 `single-shot` 与 `multi-panel-page` 都可以使用的项目自研 Camera 规则，包括 Scope、镜头选择顺序、标签预算、冲突处理、叙事配方和 canonical 输出约定。

模式专用规则不在这里重复：

- `single-shot`：见 [`single-shot-camera-guide.md`](single-shot-camera-guide.md)
- `multi-panel-page`：以 [Multi-panel 制作指南](../../../start/multi-panel-page/guide.md) 和 [Layout 规范](../../../multi_panel/e-novelai-comic-multi-panel/references/layout.md) 为准

当前正式 Camera 资料：

- [Camera 完整增量与 canonical catalog](../camera_improve.md)
- [Camera 资料索引](../camera_reference_skill.md)
- [Camera tag 数据集](../dataset-camera-tag/)

本文件不包含已删除的第三方 Skill 内容，也不是第二套漫画工作流入口。

---

## 1. 共同边界

Camera 决策把已经确定的叙事画面转换为明确的摄影表达，不负责重写剧情、人物关系、服装事实、对白或页面节拍。

| Scope | 用途 | 建议标签预算 | 主要内容 |
|---|---|---:|---|
| Page Scope | 定义页面媒介、格数、阅读顺序和总体 Layout | 1–2 个页面标签 | `comic_layout` 类别与完整自然语言 Layout |
| Panel／Shot Scope | 定义一个 Shot 或页面内一个 Panel 的摄影与取景 | 2–5 个 Camera 标签 | 景别、角度、朝向、透视、构图、焦点和效果 |

共同规则：

- `single-shot` 的 Shot 是实际生成单元，不加入整页分格标签。
- `multi-panel-page` 的 Page 是实际生成单元；Page 的 `Main` 负责完整 Layout，局部块按阅读顺序表达各 Panel。
- 页面内的 Panel 有独立镜头设计，但不自动成为独立输出文件。
- 已确认的 Storyboard Camera 决策优先于自动标签推荐。
- Camera 标签不能补造来源中没有的剧情事实。

---

## 2. Camera 选择顺序

按以下顺序决策：

```text
1. 确认 Scope：Page 或 Panel／Shot
2. Page Scope 时选择页面 Layout
3. 选择一个主要景别
4. 选择最多一个垂直角度
5. 选择主体朝向或 POV
6. 按需选择透视或镜头畸变
7. 按需选择构图与裁切
8. 按需选择焦点与景深
9. 按需选择运动线或光学效果
```

后面的步骤不能推翻前面已经确定的主要 Camera 关系。例如，确定 `from above` 后不得再加入 `from below`；选择纯第一人称 POV 后，不得同时要求观察者完整背影出现在画面中。

---

## 3. 主要景别

每个 Panel／Shot 选择一个主要景别：

| 叙事需求 | 推荐标签 | 用途 |
|---|---|---|
| 表情、眼神、细小物件 | `close-up` | 强调局部和情绪变化 |
| 头像或肩部情绪 | `portrait` | 对白、告白、静态情绪 |
| 手势与上半身互动 | `upper body` | 常规对话和动作基线 |
| 腰部、裙裤、拔枪等动作 | `cowboy shot` | 保留上身表情和腰部动作 |
| 全套服装、跑跳、格斗 | `full body` | 展示完整身体动作 |
| 地点、空间关系、群体 | `wide shot`、`scenery` | 建立环境和人物位置 |

可见性规则：

- 需要读清面部表情时优先 `close-up` 或 `portrait`。
- 需要手部动作或上半身服装时至少使用 `upper body`。
- 需要腰部、裙裤或胯部动作时至少使用 `cowboy shot`。
- 需要鞋子或从头到脚的完整服装时使用 `full body`。
- 需要环境布局时使用 `wide shot`。
- 小道具细节应使用独立特写，或明确把道具设为焦点。
- 不得在 `close-up` 中同时声称鞋子或完整全身清晰可见。
- 两个重要信息需要互斥景别时，应拆 Shot、拆 Panel 或调整信息优先级。

---

## 4. 垂直角度

每个 Panel／Shot 最多选择一个主要垂直角度：

| 标签 | 作用 |
|---|---|
| `straight-on` | 客观、稳定、直接的平视基线；自然语言“eye level”在 tags 字段中归一为该 canonical tag |
| `from above` | 脆弱、受压、环境俯瞰或地面关系 |
| `from below` | 强势、威胁、英雄感或高大感 |
| `worm's eye view` | 极低机位和夸张高度 |
| `high up` | 高空俯瞰和大范围空间关系 |

互斥示例：

```text
from above × from below
straight-on × 明确的高／低机位
worm's eye view × high up
```

角度服务于叙事，不应只为“更有冲击力”而覆盖用户指定机位。

---

## 5. 主体朝向与 POV

### 第三人称朝向

最多选择一个主要朝向：

```text
facing viewer
from side
profile
three quarter view
from behind
```

### 第一人称 POV

常用表达：

```text
pov
pov hands
pov across table
```

规则：

1. 纯 POV 表示 Camera 位于观察者眼睛位置。
2. 不同时展示该观察者的完整身体或背影。
3. 面对观察者的其他人物通常使用 `facing viewer`。
4. 需要看到观察者肩膀或背部前景时，改用 `over shoulder` 和可选的 `blurry foreground`，不要继续当作纯 POV。

---

## 6. 透视与镜头动态

仅在叙事需要时加入一个主要透视／镜头动态：

| 标签 | 适用情况 |
|---|---|
| `dutch angle` | 心理失衡、危机、混乱或不稳定 |
| `foreshortening` | 拳头、武器、手臂朝 Camera 冲出的纵深 |
| `fisheye` | 狭窄空间、狂乱能量或夸张广角 |
| `vanishing point` | 走廊、道路、城市街道等线性透视 |
| `atmospheric perspective` | 远景、城市或自然环境的纵深层次 |

不要无目的堆叠 `dutch angle`、`fisheye`、`foreshortening` 和强运动模糊。

---

## 7. 构图、裁切与空间组织

按需选择 0–2 个辅助构图标签：

### 对话与前景锚点

```text
over shoulder
behind another
shoulder peek
blurry foreground
```

### 裁切

```text
feet out of frame
cropped torso
out of frame
faceless
```

### 空间排列

```text
side-by-side
framed
split screen
cut-in
negative space
surrounded
```

规则：

- 裁切必须符合主要景别，不能同时要求 `full body` 和 `feet out of frame`。
- `over shoulder` 表示前景人物的一部分参与构图，不等于纯 POV。
- `negative space` 应服务于孤独、压迫、文字留白或方向感。
- `split screen`、`cut-in` 等结构词不能代替完整 Layout 描述。

---

## 8. 焦点与景深

按需选择 0–2 个焦点／景深标签：

```text
eye focus
hand focus
weapon focus
object focus
sky focus
depth of field
blurry background
blurry foreground
bokeh
soft focus
```

规则：

- 焦点标签必须对应当前叙事重点。
- 一个镜头通常只设置一个主要焦点对象。
- `blurry foreground` 常用于过肩构图；`blurry background` 常用于人物或物件特写。
- `soft focus` 和 `bokeh` 不适合要求清晰空间信息的建立镜头。

---

## 9. Camera 与线条效果

按需选择 0–2 个效果：

```text
motion lines
speed lines
notice lines
emphasis lines
zoom layer
lens flare
glint
bloom
chromatic aberration
film grain
vignetting
```

规则：

- `motion lines`／`speed lines` 用于真实运动方向。
- `notice lines`／`emphasis lines` 用于视觉注意或突然反应。
- 强光学效果应有明确情绪依据。
- 效果不能代替景别、角度和主体动作。

---

## 10. 标签预算与冲突处理

| 项目 | 建议限制 |
|---|---:|
| Panel／Shot Camera 标签 | 2–5 个 |
| Page Layout 标签 | 1–2 个 |
| 强畸变／强光学效果 | 1–2 个 |
| 主要景别 | 恰好 1 个 |
| 主要垂直角度 | 最多 1 个 |
| 主要朝向或 POV | 最多 1 个 |

最小有效组合通常为：

```text
主要景别 + 角度／朝向
```

例如：

```text
upper body, three quarter view
close-up, facing viewer, eye focus
wide shot, from behind, negative space
```

冲突优先级：

1. 用户明确要求；
2. 已确认 Storyboard；
3. 叙事信息的可见性需求；
4. 当前项目 Camera 规则；
5. 标签推荐和示例。

无法自动解决时记录 `TODO [CONFLICT]`，不得默默选择其中一方。

---

## 11. 常见叙事配方

| 叙事 Beat | 建议组合 | 目的 |
|---|---|---|
| 紧张对峙 | `cowboy shot, straight-on, weapon focus, depth of field` | 保留腰部武器和双方压力 |
| 英雄式重击 | `full body, from below, foreshortening, motion lines` | 强化力量、纵深和速度 |
| 震惊领悟 | `close-up, facing viewer, eye focus, notice lines` | 集中面部和突然反应 |
| 心理危机 | `upper body, dutch angle, vignetting, chromatic aberration` | 制造失衡和精神压力 |
| 亲密告白 | `portrait, facing viewer, soft focus, bokeh` | 柔和的人物情绪特写 |
| 常规对话 | `upper body, three quarter view, depth of field` | 自然对话基线 |
| 过肩对话 | `upper body, facing viewer, over shoulder, blurry foreground` | 明确说话双方空间关系 |
| 到达新地点 | `wide shot, scenery, atmospheric perspective, vanishing point` | 建立环境和纵深 |
| 孤独／忧郁 | `wide shot, from behind, negative space, scenery` | 用空白和比例压缩人物 |
| 第一人称调查 | `pov, pov hands, object focus, depth of field` | 强调观察者正在检查的物件 |
| 回忆 | `portrait, flashback, sepia, film grain` | 建立时间和质感差异 |
| 喜剧节拍 | `4koma, chibi inset, emphasis lines` | 用明确节奏和强调线完成笑点 |
| 宣传页／章节扉页 | `splash page, full composition, full body, bloom` | 建立展示性全页构图 |

配方只是起点，使用前必须删除与当前 Storyboard 冲突的标签。

---

## 12. Storyboard 字段与 Prompt 编译

Camera 模块使用唯一的 Storyboard 编译字段：

```markdown
**optional.camera.tags**: upper body, straight-on, three quarter view
```

字段命名遵循：

```text
optional.<module-id>.<field-id>
```

规则：

- 同一个 Shot／Panel 最多出现一次 `optional.camera.tags`；
- 值只包含英文、逗号分隔的 Prompt-ready Camera tags；
- `Scene` 保留动作、人物、环境和连续性事实；
- Agent 原样复制 tags，不翻译、不改写、不重新选择；
- Single-shot 直接把当前 Shot 的 tags 合并进 `Main`；
- Multi-panel Page 按 Reading Order 把每个 Panel 的 Position 与 tags 组合进页面 `Main`；
- 字段名不进入 Prompt；
- Camera tags 不进入 `Character N`；
- 最终 Prompt 不增加 `## Camera` 或其他机器字段。

完整规则见 [`../references/prompt-integration.md`](../references/prompt-integration.md)。

---

## 13. Canonical 标签输出

需要输出 Camera 标签时：

1. 使用 [`camera_tags.yaml`](../dataset-camera-tag/camera_tags.yaml) 中存在的 canonical spelling；
2. 标签使用英文；
3. 不把解释文字混入逗号分隔的最终标签串；
4. 不发明不存在的标签；
5. 无法确认 catalog 状态时，不声称已完成实时验证。

文本示例：

```text
upper body, facing viewer, depth of field, blurry background
```

结构化示例：

```json
{
  "scope": "shot",
  "shot_size": "upper body",
  "orientation": "facing viewer",
  "focus": ["depth of field", "blurry background"]
}
```

---

## 14. 数据集

```text
workflow/optional/camera/dataset-camera-tag/
├── camera_tags.schema.json
└── camera_tags.yaml
```

`camera_tags.yaml` 是项目保留的策展快照，`camera_tags.schema.json` 记录其结构。Camera 项目检查器直接读取 catalog 中的 canonical tags，不连接远程或内网服务。

数据集不代表 NovelAI 官方在线能力，也不保证每个标签在所有模型、组合和权重下都同样稳定。

---

## 15. 自研来源

| 内容 | 历史来源 |
|---|---|
| Camera customization overview | `/workspace/example_proj_test/comic_skill/extracted_experience_doc/customization/01_camera_composition/camera-overview.md` |
| Camera selection guide | `/workspace/example_proj_test/comic_skill/extracted_experience_doc/customization/01_camera_composition/camera-selection-guide.md` |
| Collection 中的同内容副本 | `/workspace/example_proj_test/comic_skill/comic_skill_collection/customization/camera/` |
| Camera tag dataset | `/workspace/example_proj_test/comic_skill/comic_skill_collection/dataset/camera-tag/` |

第三方 Skill 来源、许可证和重复文件 SHA 映射不属于本自研文档，已不再保留在 `manual-guides/`。

---

## 16. 共同检查清单

- [ ] 已确认 Page 或 Panel／Shot Scope。
- [ ] 已选择且只选择一个主要景别。
- [ ] 垂直角度没有互斥。
- [ ] 朝向与 POV 没有冲突。
- [ ] 画面可见范围足以承载动作、服装和道具信息。
- [ ] 强畸变和效果没有无目的堆叠。
- [ ] Camera 标签与 Storyboard Layout、人物站位和连续性一致。
- [ ] 使用 canonical spelling，或明确说明尚未验证。
- [ ] 同一个 Shot／Panel 最多有一个 `optional.camera.tags`。
- [ ] tags 已原样合并到 `Main`，字段名未进入 Prompt。
- [ ] Camera tags 没有写入 `Character N`。
- [ ] 没有用 Camera 优化改变剧情事实。
