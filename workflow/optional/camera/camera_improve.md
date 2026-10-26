# Camera Improve：独立 Camera 规则与完整 Canonical Catalog

## 1. 文档目的

本文件汇总项目自研 Camera 信息。原始自研资料已按适用范围整理为：

- [`manual-guides/share-camera-guide.md`](manual-guides/share-camera-guide.md)：`single-shot` 与 `multi-panel-page` 共用规则；
- [`manual-guides/single-shot-camera-guide.md`](manual-guides/single-shot-camera-guide.md)：Single-shot 专用规则；
- [`references/prompt-integration.md`](references/prompt-integration.md)：`optional.camera.tags` 到最终 `Main` 的编译规则；
- [`dataset-camera-tag/`](dataset-camera-tag/)：camera-tag catalog 与结构 schema。

它是 Single-shot 与 Multi Panel 共用的补充资料。第三方或已安装 Skill 中已有的原文不在这里再次复制；相关 Skill 路径见 [`camera_reference_skill.md`](camera_reference_skill.md)。

本文件只负责 Storyboard 与最终 Prompt 的 Camera 决策，不执行图片生成。

## 2. 数据集当前位置

```text
final_version_comic_skill/workflow/optional/camera/dataset-camera-tag/
├── camera_tags.schema.json
└── camera_tags.yaml
```

Catalog 声明版本为 `1.0.0`，包含 9 个功能组、212 个唯一 canonical tags。它是项目保留的本地策展快照，不代表 NovelAI 官方在线数据。

## 3. Scope：Panel 与 Page 分开

| Scope | 职责 | 默认预算 | 主要类别 |
|---|---|---:|---|
| Page | 页面媒介、分格格式和读向倾向 | 1–2 个 | `comic_layout` |
| Panel | 单个 Shot／Panel 的摄影与取景 | 2–5 个建议预算 | 除 `comic_layout` 外的八组 |

- 整页生成时，页面级 layout tag 与逐格自然语言说明同时存在。
- 单格生成时省略页面 layout tag，只处理该格镜头。
- Layout tag 不能替代 Panel Count、Reading Direction、Reading Order、Panel Position 与大小。
- Tag 数量是防止过度指定的建议，不是必须填满的配额。

## 4. 九步选择流程

1. **Determine Scope**：确认 Page 或 Panel。
2. **Comic Layout**：仅 Page 选择页面格式与读向倾向。
3. **Primary Shot Size**：Panel 选择一个主要景别。
4. **Vertical Camera Angle**：最多一个主要垂直机位。
5. **Orientation／POV**：选择主体朝向或主观视点。
6. **Perspective & Lens**：需要明显空间动力时添加。
7. **Framing & Composition**：按需添加过肩、裁切、框景、排列或留白。
8. **Focus & Depth**：确定焦点目标与景深。
9. **Camera Effects**：最后才添加动态线和光学效果。

选择顺序的意义是让高优先级镜头结构先稳定，避免效果词反过来覆盖景别、人物关系与动作。

## 5. 默认组合限制

| 轴／类型 | 默认规则 |
|---|---|
| Shot Size | 一个主要选择 |
| Vertical Angle | 零或一个；禁止相反俯仰同时出现 |
| Orientation | 每个主体一个主要朝向；多人必须写清归属 |
| POV | 主观 POV 覆盖观察者的普通第三人称朝向 |
| Perspective | 一般零或一个主要空间动力；Catalog 上限为 2 |
| Framing | 按需 0–2 个 |
| Focus | 按需 0–2 个 |
| Camera Effect | 按需 0–2 个；强 distortion 通常不超过 1–2 个 |
| Comic Layout | Page scope 0–2 个 |

### 尚未统一的景别口径

项目 guide 把 `wide shot` 与 `full body` 放在同一个互斥轴；部分 Skill 资料和 catalog 兼容字段则允许两者表达不同维度。未获得项目 profile 或用户确认前：

- Storyboard 分开记录人物可见范围和环境距离；
- 最终 tag 默认只选一个主要景别；
- 需要 `full body, wide shot` 组合时标记 `TODO [CONFLICT]`，等待确认。

## 6. POV 覆盖规则

1. `pov`／`pov hands` 表示相机位于观察者眼睛位置。
2. 纯 POV 不应同时显示观察者的完整背影或全身。
3. 面向观察者的另一人物可以使用 `facing viewer`，但是否直视镜头仍按剧情说明。
4. 希望观察者肩背出现在前景时，使用 `over shoulder`，必要时配 `blurry foreground`，不要继续称作纯 POV。
5. 必须写清观察者的手从哪侧进入、持有什么、接触谁或什么。

## 7. 独立叙事配方

这些是起点，不是固定公式；使用前仍需核对 catalog 兼容关系和当前 Storyboard。

| 叙事时刻 | 候选组合 | 主要目的 |
|---|---|---|
| 紧张对峙 | `cowboy shot, straight-on, weapon focus, depth of field` | 同时显示腰间动作和备战关系 |
| 高潮打击 | `full body, from below, foreshortening, motion lines` | 完整动作、仰视力量与纵深爆发 |
| 震惊领悟 | `close-up, facing viewer, eye focus, notice lines` | 把阅读注意集中在脸和眼睛 |
| 心理失衡 | `upper body, dutch angle, vignetting, chromatic aberration` | 倾斜与光学异常共同表达不稳定 |
| 亲密告白 | `portrait, facing viewer, soft focus, bokeh, blurry background` | 降低背景竞争并保留面部亲近感 |
| 普通对话 | `upper body, three quarter view, depth of field` | 表情、手势和人物体积平衡 |
| 过肩对话 | `upper body, facing viewer, over shoulder, blurry foreground` | 建立双方空间与反打关系 |
| 到达新地点 | `wide shot, scenery, atmospheric perspective, vanishing point` | 建立地点、尺度和路线 |
| 孤独／疏离 | `wide shot, from behind, negative space, scenery` | 用人物与环境比例表达距离 |
| 第一人称调查 | `pov, pov hands, object focus, depth of field` | 让观察动作和目标物统一 |
| 回忆 | `portrait, black border, flashback, sepia, film grain` | 用边框、色调和介质感标记记忆 |
| 四格笑点 | `4koma, chibi inset, emphasis lines` | 明确漫画格式和包袱强调 |
| 章节 Splash | `splash page, full composition, full body, bloom` | 页面级展示和放大重点 |

## 8. Canonical 输出合同

- 最终 tag 必须与 `camera_tags.yaml` 精确拼写一致。
- 只输出 catalog 已存在的英文 canonical string；不得按中文直译自造 tag。
- 当前 catalog 使用 `straight-on`，不能把历史写法 `straight on` 当作同一项而不复核。
- 查询不到 tag 时保留自然语言方案，并记录查询失败，不伪造结果。
- `post_count` 是策展时的训练数据频率，不是当前生成成功率。
- `reliability` 是数据集经验分级，不是效果保证。

## 9. 来源与策展增量

Catalog 是从项目历史结构化标签资料中整理出的本地快照。当前模块不保存、连接或依赖原始服务地址，也不提供在线复现脚本。

### 收录标准

- 直接影响相机位置、视野、焦深、主体朝向、透视投影或漫画页面结构；
- canonical string 与来源 API 精确一致；
- 每个 tag 只归入一个主要功能组；
- 保留提取时的 `post_count`；
- 排除露骨／性癖解剖焦点、IP 专属项、无关姿势道具和明显目录误分类。

### 已知限制

- API 单次查询上限为 500，需要按子树查询；
- `restricted: false` 不等于内容必然 SFW；
- 来源分类树存在重叠和误分类；
- API 不提供 alias，因此只能信任精确 canonical；
- 高 `post_count` 往往较常见，但不能替代实际 Prompt 测试；
- Catalog 元数据的提取日期和 post count 是快照，不应声称实时最新。

## 10. Catalog 元数据与受控词表

### 元数据

| 字段 | Catalog 声明值 |
|---|---|
| Name | `NovelAI Comic Camera & Framing Knowledge Base` |
| Version | `1.0.0` |
| Last Updated | `2026-10-06` |
| Total Tags | `212` |
| Authoritative Source | Curated local structured tag catalog snapshot |

日期和频率数据仅表示策展快照，不代表当前已完成实时复验。

### Scope

- `panel`
- `page`
- `both`

### Tier

| Tier | 数据集定义 |
|---|---|
| `core` | 高频、基础摄影和漫画 tag，适合建立基线构图。 |
| `specialized` | 针对特定叙事时刻、风格或调度方式的专门 tag。 |
| `experimental` | 低频、复杂或容易产生组合干扰的 tag，需要谨慎测试。 |

### Reliability

| Reliability | 数据集定义 |
|---|---|
| `high` | 在不同 seed 和 Prompt 中通常能稳定产生预期取景或机位。 |
| `medium` | 一般有效，但容易受复杂姿势、背景细节或人物密度影响。 |
| `low` | 对权重、主体复杂度或模型偏向敏感，宜迭代验证。 |

Reliability 是策展判断，不是统计成功率或保证。

### Visual Priority

| Priority | 数据集职责 |
|---:|---|
| 1 | 主要景别、POV 和焦点主体 |
| 2 | 垂直机位和主体朝向 |
| 3 | 镜头投影、透视汇聚和景深 |
| 4 | 裁切、空间排列、边框和插格 |
| 5 | Lens flare、快门动态线和 Camera visual effects |
| 6 | 页面布局结构、Panel 配置和读序 |

### Axis

```text
shot_size
camera_angle
orientation
viewpoint
perspective
framing
focus
camera_effect
comic_layout
```

### Catalog 默认预算

| Scope | Min | Recommended | Max |
|---|---:|---:|---:|
| Panel | 2 | 3 | 5 |
| Page | 1 | 2 | 3 |

这里保留 dataset 的原始预算。项目 guide 对 Page 建议 1–2 个；二者不一致时，不把最低数量设为硬阻塞，并优先避免互相冲突的 layout tag。

### Catalog 原始冲突处理原则

- **POV Override**：主观 POV 覆盖普通第三人称 orientation；面对观察者的人物可用 `facing viewer`。
- **One Primary Shot Size**：不要组合矛盾景别，例如 `full body` 与 `close-up`／`upper body`。
- **One Primary Angle**：不要组合 `from above`、`from below`、`straight-on` 等相反垂直角度。
- **Strong Effect Limit**：`fisheye`、`dutch angle`、`motion blur`、`distortion` 等强效果每格最多保留少量，通常不超过 1–2 个。
- **Environment vs Character**：环境／风景建立镜头默认不与紧贴人物的 close-up 同时承担主要任务；需要同时出现时应使用明确层级或插格方案。

## 11. 策展类别清单

以下为 catalog 保留的来源分类与策展数量：

| Category Path | 功能 | Curated Count |
|---|---|---:|
| `composition.camera_angle.orientation` | 主体水平朝向与垂直机位来源 | 15 |
| `composition.camera_angle.perspective` | 投影、缩短与消失点 | 8 |
| `composition.camera_angle.situated_view` | 窗、转角等环境观察位 | 13 |
| `composition.camera_angle.subjective_view` | 第一人称与 viewer-relative 视点 | 14 |
| `composition.camera_angle.mediated_view` | 镜子、眼镜、手机和固定相机视点 | 6 |
| `composition.framing.shot_size` | 从 close-up 到 very wide 的景别 | 17 |
| `composition.framing.focus` | 焦点目标 | 20 |
| `composition.framing.crop` | 主动裁切与画面边界 | 13 |
| `composition.framing.arrangement` | 多视图、排列与图形构图 | 27 |
| `composition.framing.border` | 边框与遮幅处理 | 8 |
| `composition.framing.inset` | Chibi、参考、照片、截图和投影插格 | 6 |
| `composition.framing.body_part_anchor.shoulder.over_shoulder` | 过肩取景 | 1 |
| `composition.visual_effect.effect.blur` | 景深与模糊 | 9 |
| `composition.visual_effect.effect.glow_light` | Flare、glint、bloom 和 diffraction | 5 |
| `composition.visual_effect.effect.line_effect` | Motion、notice、emphasis、speed 和 zoom lines | 6 |
| `composition.visual_effect.effect.reflection` | Reflection effect | 1 |
| `composition.visual_effect.effect.color_effect` | Chromatic aberration、grain、sepia 等 | 5 |
| `composition.visual_effect.effect.general` | 其他光学与时间效果 | 13 |
| `production.format.comic_format` | 漫画结构、读序和 Panel 格式 | 20 |
| `production.format.general` | 其他生产格式 | 3 |

合计为 212 个策展 canonical tags。来源分类数量与本文件最终九组数量不同，是因为策展阶段把多个历史分类重新映射到单一功能组。

## 12. 验证边界

当前保留的 `camera_tags.schema.json` 用于记录 catalog 结构，Camera 项目检查器直接读取 `camera_tags.yaml` 中的 canonical tags。模块不连接外部或内网服务，也不声称对 tag 频率和视觉效果做了实时复验。

---

# 完整 Canonical Catalog

以下内容从移动后的 `dataset-camera-tag/camera_tags.yaml` 自动展开，保留每个条目的描述、使用条件、避免条件、叙事效果、来源类别、频率、兼容／排斥关系和组内扩展字段。Catalog 更新后应重新生成本节，不能手工假设仍为 212 项。

## Shot Size／景别（17 项）

- Scope：`panel`
- Max Selected：`1`
- 组说明：Framing distance and scale of the subject relative to the frame boundary.

### `full body`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Frames the entire character from head to toe within the scene.
- **适用**：Action scenes requiring full body posture or movement；Showcasing full character outfit or footwear；Establishing character physical scale in an environment
- **避免**：Subtle facial emotional expressions are the main focus；Close intimate conversations in compact panels
- **叙事效果**：Provides complete spatial awareness of the subject；Emphasizes stance, dynamic movement, and physical action
- **来源类别**：composition.framing.shot_size
- **Post Count**：1105562
- **主体覆盖**：head_to_toe
- **视野**：medium_wide
- **典型用途**：action_establishing
- **兼容**：from above；from below；straight-on；wide shot；isometric；dutch angle
- **互斥**：upper body；cowboy shot；portrait；close-up；headshot；head only

### `upper body`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Frames character from the waist or mid-torso upwards to the top of the head.
- **适用**：Standard conversational dialogue scenes；Balancing hand gestures with facial expression clarity；General comic storytelling panels
- **避免**：Full body martial arts or footwork actions；Extreme macro detail on eye or facial features
- **叙事效果**：Natural storytelling baseline for character interaction；Balances character emotion and bodily gesture
- **来源类别**：composition.framing.shot_size
- **Post Count**：1043118
- **主体覆盖**：waist_to_head
- **视野**：medium
- **典型用途**：standard_dialogue
- **兼容**：facing viewer；from side；three quarter view；depth of field；blurry background
- **互斥**：full body；feet only；lower body；wide shot

### `cowboy shot`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Frames character from mid-thigh up, capturing hip-level weapons, holsters, or hand placement.
- **适用**：Duel or showdown standoffs；Displaying belt-mounted weapons, gear, or pockets；Slightly broader framing than upper body without showing feet
- **避免**：Tight emotional close-ups；Extreme wide environmental establishing shots
- **叙事效果**：Conveys tension, readiness for combat, and assertive presence；Western and action cinematic pacing
- **来源类别**：composition.framing.shot_size
- **Post Count**：738833
- **主体覆盖**：mid_thigh_to_head
- **视野**：medium_wide
- **典型用途**：standoff_action
- **兼容**：from below；straight-on；weapon focus；dutch angle
- **互斥**：close-up；portrait；headshot；full body

### `portrait`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Frames the head and upper shoulders with high emphasis on facial presence.
- **适用**：Character introduction or emotional monologue；Key dialogue reveals and dramatic reactions；Focusing on facial expression and styling
- **避免**：Scenes emphasizing physical action or limb movement；Complex multi-character interactions
- **叙事效果**：Creates emotional intimacy and direct character connection；Highlights internal thoughts and psychological states
- **来源类别**：composition.framing.shot_size
- **Post Count**：118108
- **主体覆盖**：chest_to_head
- **视野**：medium_close
- **典型用途**：character_focus
- **兼容**：depth of field；blurry background；soft focus；lens flare
- **互斥**：full body；cowboy shot；wide shot；scenery

### `close-up`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Tightly frames the head, face, or a specific key subject detail filling most of the frame.
- **适用**：Intense emotional shock, realization, or epiphany；Highlighting subtle eye expressions, tears, or smirks；Dramatic reaction panels in comic pacing
- **避免**：Establishing the location or surrounding context；Choreographing multi-character body movements
- **叙事效果**：Amplifies dramatic intensity and emotional resonance；Forces reader attention directly onto minute nuances
- **来源类别**：composition.framing.shot_size
- **Post Count**：57308
- **主体覆盖**：face_or_detail
- **视野**：close
- **典型用途**：dramatic_reaction
- **兼容**：eye focus；depth of field；motion lines；dutch angle
- **互斥**：full body；cowboy shot；wide shot；scenery；very wide shot

### `wide shot`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Captures characters within their full environmental context with ample surrounding space.
- **适用**：Establishing scene location and environmental atmosphere；Showing distance between multiple characters；Battlefield or group formation overviews
- **避免**：Intimate dialogue requiring facial nuance；Fast-paced quick reaction beats
- **叙事效果**：Establishes spatial orientation, geography, and scale；Conveys isolation, grandeur, or vastness
- **来源类别**：composition.framing.shot_size
- **Post Count**：20837
- **主体覆盖**：environment_and_subjects
- **视野**：wide
- **典型用途**：establishing_spatial
- **兼容**：scenery；landscape；from above；perspective；atmospheric perspective
- **互斥**：close-up；portrait；headshot；upper body

### `very wide shot`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Extremely distant framing where characters appear tiny against an expansive landscape.
- **适用**：Epic scale world reveals and chapter establishing panels；Emphasizing overwhelming wilderness or colossal architecture；Conveying loneliness or journey progression across terrain
- **避免**：Any character-driven conversation or combat engagement；Small panels with limited resolution
- **叙事效果**：Subordinates the character to the immense world；Evokes awe, solitude, or cinematic scope
- **来源类别**：composition.framing.shot_size
- **Post Count**：1964
- **主体覆盖**：vast_environment
- **视野**：extreme_wide
- **典型用途**：epic_establishing
- **兼容**：landscape；scenery；atmospheric perspective；full page comic
- **互斥**：close-up；portrait；cowboy shot；upper body；full body

### `scenery`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Focuses on environmental background elements and scenery rather than character foreground.
- **适用**：Scene-setting panels without active character focus；Transitions between locations or time of day；Atmospheric mood pieces
- **避免**：Character-centric emotional beats；Close dialogue exchanges
- **叙事效果**：Grounds the reader in the world lore and mood；Serves as narrative breathing room between intense sequences
- **来源类别**：composition.framing.shot_size
- **Post Count**：68184
- **主体覆盖**：environment_only
- **视野**：wide
- **典型用途**：scene_transition
- **兼容**：wide shot；landscape；vanishing point；depth of field
- **互斥**：portrait；close-up；headshot

### `landscape`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Horizontal nature or outdoor vista framing focusing on terrain, sky, and horizon.
- **适用**：Natural environment establishing panels (mountains, oceans, forests)；Panoramic background vistas in horizontal panels
- **避免**：Indoor tight room dialogues；Close character portraits
- **叙事效果**：Conveys natural beauty, journey progress, and tranquility
- **来源类别**：composition.framing.shot_size
- **Post Count**：9144
- **主体覆盖**：natural_vista
- **视野**：panoramic_wide
- **典型用途**：environment_vista
- **兼容**：wide shot；very wide shot；atmospheric perspective；sky focus
- **互斥**：portrait；close-up；headshot；upper body

### `still life`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Static framing of inanimate objects arranged on a surface or in a room.
- **适用**：Cutaway panels focusing on meaningful props (teacup, letter, weapon)；Environmental storytelling through abandoned or arranged items
- **避免**：Dynamic action or active character dialogue
- **叙事效果**：Imparts symbolic meaning and contemplative pacing；Provides narrative clues through object placement
- **来源类别**：composition.framing.shot_size
- **Post Count**：9164
- **主体覆盖**：inanimate_objects
- **视野**：medium_close
- **典型用途**：symbolic_cutaway
- **兼容**：object focus；depth of field；blurry background
- **互斥**：full body；cowboy shot；wide shot

### `lower body`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Frames the character from hips or waist down to feet.
- **适用**：Walking or running approach panels building suspense；Emphasizing footwork, kicking actions, or lower armor/clothing
- **避免**：Panels requiring facial expressions or dialogue delivery
- **叙事效果**：Builds suspense and mystery before revealing identity；Focuses attention on locomotion and physical stance
- **来源类别**：composition.framing.shot_size
- **Post Count**：7422
- **主体覆盖**：waist_to_feet
- **视野**：medium
- **典型用途**：suspense_footwork
- **兼容**：from below；motion lines；foot focus
- **互斥**：portrait；close-up；upper body；headshot

### `head only`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Severely isolated framing showing only the subject's head, omitting neck and torso.
- **适用**：Surreal or disembodied head compositions；Peeking head cut-ins or comedic floating head motifs
- **避免**：Standard realistic comic dialogue framing
- **叙事效果**：Creates quirky, comedic, or uncanny visual isolation
- **来源类别**：composition.framing.shot_size
- **Post Count**：3562
- **主体覆盖**：head_isolated
- **视野**：tight
- **典型用途**：quirky_cutin
- **兼容**：cut-in；chibi inset；split crop
- **互斥**：full body；cowboy shot；upper body

### `headshot`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Clean, framed composition focusing tightly on head and neck.
- **适用**：Character status panels, profile cards, or dossier graphics；Clear identity portraits for comic cast sheets
- **避免**：Dynamic action or sweeping environment sequences
- **叙事效果**：Formal and clear character presentation
- **来源类别**：composition.framing.shot_size
- **Post Count**：515
- **主体覆盖**：head_and_neck
- **视野**：close
- **典型用途**：dossier_profile
- **兼容**：facing viewer；depth of field；framed
- **互斥**：full body；wide shot；cowboy shot

### `feet only`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Extreme downward crop framing only feet and ground contact point.
- **适用**：Sudden stop or step forward beat；Puddle stepping, crossing a threshold, or stealth creeping
- **避免**：Dialogue interactions and broad scene reveals
- **叙事效果**：Signals immediate movement change, arrival, or departure
- **来源类别**：composition.framing.shot_size
- **Post Count**：913
- **主体覆盖**：feet_and_floor
- **视野**：close_downward
- **典型用途**：movement_punctuation
- **兼容**：from above；foot focus；motion lines
- **互斥**：upper body；portrait；close-up；headshot

### `mugshot`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Strict frontal or profile booking photo composition against a measurement backdrop.
- **适用**：Arrest or criminal booking scenes；Comedic police lineup or wanted poster vignettes
- **避免**：Fluid narrative storytelling panels
- **叙事效果**：Institutional, sterile, or comedic criminal framing
- **来源类别**：composition.framing.shot_size
- **Post Count**：878
- **主体覆盖**：chest_to_head_formal
- **视野**：medium_close
- **典型用途**：booking_lineup
- **兼容**：facing viewer；profile；straight-on
- **互斥**：dutch angle；fisheye；scenery

### `family portrait`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Formal group portrait arrangement of characters posed together.
- **适用**：Commemorative framed photograph inside a story；Flashback memories of family or team unity
- **避免**：Solo character inner monologue
- **叙事效果**：Evokes nostalgia, bonds of affection, or lost happiness
- **来源类别**：composition.framing.shot_size
- **Post Count**：152
- **主体覆盖**：group_posed
- **视野**：medium_wide
- **典型用途**：memory_photo
- **兼容**：photo inset；group picture；framed
- **互斥**：close-up；headshot；feet only

### `tachi-e`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Visual novel style standing character sprite against a neutral or transparent background.
- **适用**：Dialogue cut-in overlays mimicking adventure/visual novel games；Character design showcase in supplementary comic pages
- **避免**：Immersive natural comic environmental panels
- **叙事效果**：Gives a crisp, game-like character presentation
- **来源类别**：composition.framing.shot_size
- **Post Count**：58870
- **主体覆盖**：full_or_three_quarter_standing
- **视野**：medium_wide
- **典型用途**：visual_novel_overlay
- **兼容**：facing viewer；three quarter view；full body；upper body
- **互斥**：scenery；very wide shot


## Camera Angle／垂直机位（7 项）

- Scope：`panel`
- Max Selected：`1`
- 组说明：Vertical camera elevation and pitch angle relative to the subject.

### `from above`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：2
- **说明**：High-angle camera looking down onto the subject from an elevated vantage point.
- **适用**：Conveying vulnerability, defeat, smallness, or introspection；Overview of ground layouts, desks, maps, or floor combat；Dramatic bird's-eye perspective on emotional crisis
- **避免**：Subject is meant to look imposing, dominant, or towering；Standard eye-level horizontal conversational dialogue
- **叙事效果**：Diminishes subject scale and psychological dominance；Enhances vulnerability, despair, or detached surveillance feeling
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：126439
- **垂直轴**：elevated
- **相机高度**：high_angle
- **Pitch**：-30_to_-60
- **兼容**：full body；upper body；dutch angle；depth of field
- **互斥**：from below；under shot；worm's eye view；straight-on

### `from below`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：2
- **说明**：Low-angle camera tilted upwards looking up at the subject.
- **适用**：Heroic entrances, power reveals, and imposing antagonists；Emphasizing authority, dominance, monumental scale, or towering stature；Dynamic upward combat attacks and jumping scenes
- **避免**：Subject is helpless, cowering, or defeated；Flat neutral informational panels
- **叙事效果**：Magnifies power, heroism, menace, and commanding presence；Imparts dramatic grandeur and physical scale
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：104802
- **垂直轴**：depressed
- **相机高度**：low_angle
- **Pitch**：+30_to_+60
- **兼容**：full body；cowboy shot；foreshortening；dutch angle；sky focus
- **互斥**：from above；high up；straight-on

### `straight-on`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：2
- **说明**：Eye-level camera perpendicular to the subject with zero vertical pitch.
- **适用**：Neutral, grounded, and objective storytelling panels；Direct confrontation eye-to-eye dialogue；Clear informational baseline before dramatic angle shifts
- **避免**：Exaggerated verticality or dynamic overhead/underfoot action
- **叙事效果**：Creates direct emotional honesty and objective clarity；Provides an uneditorialized, eye-to-eye connection
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：45352
- **垂直轴**：neutral
- **相机高度**：eye_level
- **Pitch**：'0'
- **兼容**：upper body；facing viewer；portrait；side-by-side
- **互斥**：from above；from below；high up；under shot；worm's eye view

### `high up`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：2
- **说明**：Extreme elevated viewpoint positioned significantly above the ground level.
- **适用**：Rooftop perches, cliff edges, or aerial observation；Looking down from a skyscraper or balcony into the streets below
- **避免**：Ground-level intimate dialogues
- **叙事效果**：Emphasizes height, vertigo, detachment, and spatial scope
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：309
- **垂直轴**：extreme_elevated
- **相机高度**：aerial_high
- **Pitch**：-45_to_-80
- **兼容**：from above；wide shot；scenery；depth of field
- **互斥**：from below；under shot；straight-on

### `under shot`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：2
- **说明**：Steep upward camera angle placed directly beneath the subject looking up.
- **适用**：Dramatic leaping overhead, glass floor perspectives, or colossal giants；Extreme dynamic action beats with foreshortened upward limbs
- **避免**：Ordinary conversation scenes
- **叙事效果**：Creates intense kinetic drama and towering physical presence
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：285
- **垂直轴**：steep_low
- **相机高度**：ground_sublevel
- **Pitch**：+60_to_+85
- **兼容**：foreshortening；from below；motion lines
- **互斥**：from above；high up；straight-on

### `chest height`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：2
- **说明**：Camera positioned at the character's chest level, slightly lower than eye level.
- **适用**：Subtle grounding effect in dialogue panels；Emphasizing subtle character stature without dramatic low angle tilt
- **避免**：Extreme high/low angle cinematic sequences
- **叙事效果**：Imparts a grounded, sturdy observational perspective
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：201
- **垂直轴**：mid_torso_level
- **相机高度**：chest_level
- **Pitch**：0_to_+10
- **兼容**：upper body；cowboy shot；facing viewer
- **互斥**：from above；high up；worm's eye view

### `worm's eye view`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：2
- **说明**：Extreme ground-level perspective looking directly upward from floor level.
- **适用**：Colossal scale emphasizing towering giants or architecture；Crawl/floor perspective during intense survival or knockdown moments
- **避免**：Standard talking head panels
- **叙事效果**：Maximizes feelings of intimidation, monumental scale, and vertical thrust
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：157
- **垂直轴**：floor_level
- **相机高度**：ground_zero
- **Pitch**：+75_to_+90
- **兼容**：foreshortening；from below；wide shot；dutch angle
- **互斥**：from above；high up；straight-on


## Orientation／主体朝向（8 项）

- Scope：`panel`
- Max Selected：`1`
- 组说明：Horizontal subject facing direction and rotational yaw relative to the camera.

### `facing viewer`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：2
- **说明**：Subject is oriented directly toward the camera and reader.
- **适用**：Direct emotional confrontation, address, or dramatic realization；Introducing character appearance clearly to the audience；Direct eye contact moments in intimate or shocking scenes
- **避免**：Characters walking away or conversing sideways with another character
- **叙事效果**：Engages the reader directly, commanding full visual attention；Builds immediate empathetic connection or confrontational intensity
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：87956
- **水平轴**：frontal
- **主体朝向**：forward
- **Yaw**：'0'
- **兼容**：upper body；portrait；straight-on；close-up
- **互斥**：from behind；profile；sideways

### `from side`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：2
- **说明**：Subject viewed from a lateral side perspective.
- **适用**：Two-character dialogue facing each other across the frame；Side-scrolling locomotion, walking, running, or sword swings；Observational framing of ongoing character actions
- **避免**：Direct reader-address or symmetrical character portraits
- **叙事效果**：Establishes theatrical staging and lateral movement flow；Provides an observational, third-person cinematic viewpoint
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：291504
- **水平轴**：lateral
- **主体朝向**：lateral_90deg
- **Yaw**：'90'
- **兼容**：upper body；full body；motion lines；side-by-side
- **互斥**：facing viewer；from behind

### `profile`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：2
- **说明**：Strict side silhouette/profile view showing exact lateral facial contours.
- **适用**：Contemplative silhouettes, gazing toward horizon or into the distance；Striking graphic panels highlighting nose, lip, and chin silhouette；Opposing profile split panels during verbal clashes
- **避免**：Full facial emotional readability from both eyes
- **叙事效果**：Conveys stoicism, pensive reflection, or iconic silhouette aesthetics；Dramatizes intense standoffs when paired with split compositions
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：163773
- **水平轴**：strict_lateral
- **主体朝向**：profile_90deg
- **Yaw**：'90'
- **兼容**：portrait；close-up；straight-on；depth of field
- **互斥**：facing viewer；three quarter view；from behind

### `from behind`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：2
- **说明**：Camera positioned behind the character looking at their back.
- **适用**：Departure scenes, walking away, or facing down a distant army/horizon；Concealing character facial reaction to build dramatic mystery；Over-the-shoulder perspective precursors
- **避免**：Dialogue scenes requiring facial emotion readability
- **叙事效果**：Evokes mystery, solemn resolve, burden, or emotional detachment；Invites reader to share the character's forward field of view
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：292437
- **水平轴**：dorsal
- **主体朝向**：away_from_camera
- **Yaw**：'180'
- **兼容**：full body；upper body；scenery；wide shot
- **互斥**：facing viewer；three quarter view；profile

### `three quarter view`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：2
- **说明**：Subject angled approximately 45 degrees between frontal and lateral orientation.
- **适用**：Default standard angle for rich facial depth and dynamic volume；Conversational panels where character looks slightly off-camera；Action stances that require volumetric body presentation
- **避免**：Strictly flat graphic symmetry or pure silhouette shots
- **叙事效果**：Maximizes three-dimensional volumetric depth and naturalism；Prevents stiff frontal flat staging in comic panels
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：6208
- **水平轴**：oblique
- **主体朝向**：oblique_45deg
- **Yaw**：'45'
- **兼容**：upper body；portrait；cowboy shot；depth of field
- **互斥**：profile；from behind

### `sideways`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：2
- **说明**：Subject oriented horizontally or leaning distinctly sideways across the frame.
- **适用**：Lying down poses, falling through the air, or dramatic evasive rolls；Dynamic horizontal flow along wide comic panels
- **避免**：Upright formal standing poses
- **叙事效果**：Disrupts vertical stability, evoking motion, relaxation, or disequilibrium
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：5074
- **水平轴**：horizontal_tilt
- **主体朝向**：transverse
- **Yaw**：variable
- **兼容**：motion blur；motion lines；dutch angle
- **互斥**：mugshot；headshot

### `three quarter profile`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：2
- **说明**：Steep oblique angle nearly reaching profile, showing only the tip of the opposite eyelash/cheek.
- **适用**：Dramatic looking-away gestures or brooding expressions；Glancing over the shoulder just before turning
- **避免**：Clear bilateral facial analysis
- **叙事效果**：Adds dramatic tension and guarded emotional distance
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：465
- **水平轴**：steep_oblique
- **主体朝向**：oblique_70deg
- **Yaw**：'70'
- **兼容**：portrait；close-up；depth of field
- **互斥**：facing viewer；from behind

### `looking past viewer`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：2
- **说明**：Subject faces forward but shifts eye gaze slightly beyond or past the camera.
- **适用**：Realizing someone has appeared behind the observer；Distracted reverie, daydreaming, or thousand-yard stare
- **避免**：Direct intense eye contact with the reader
- **叙事效果**：Creates subtle suspense, detachment, or peripheral realization
- **来源类别**：composition.camera_angle.orientation
- **Post Count**：310
- **水平轴**：frontal_deflected_gaze
- **主体朝向**：forward_offset_gaze
- **Yaw**：5_to_15
- **兼容**：portrait；upper body；close-up
- **互斥**：from behind


## Viewpoint／主观与环境视点（34 项）

- Scope：`panel`
- Max Selected：`1`
- 组说明：Subjective first-person POV, situated environmental vantage points, or mediated camera perspectives.

### `pov`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：First-person point-of-view placing the reader directly inside the character's eyes.
- **适用**：High-immersion subjective experiences (waking up, being approached, being attacked)；Direct emotional confession or threat received firsthand
- **避免**：Third-person objective choreography where the viewpoint character must be seen
- **叙事效果**：Maximizes visceral immersion and subjective emotional stakes；Erases the boundary between reader and protagonist
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：168189
- **POV 类型**：first_person
- **观察者关系**：embodied_first_person
- **沉浸级别**：maximum
- **兼容**：pov hands；facing viewer；depth of field；motion blur
- **互斥**：full body；from behind；profile

### `pov hands`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：First-person POV showing the observer's own hands reaching into the frame.
- **适用**：Examining an object held in hands (letter, weapon, smartphone, key)；Reaching out to grasp another character's hand or open a door；Shocked examination of one's own trembling or transformed hands
- **避免**：Hands are not actively performing an action in the foreground
- **叙事效果**：Reinforces first-person physical grounding and tactile engagement
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：35321
- **POV 类型**：first_person_hands
- **观察者关系**：embodied_tactile
- **沉浸级别**：maximum
- **兼容**：pov；hand focus；object focus；depth of field
- **互斥**：full body；from behind

### `female pov`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：First-person point of view explicitly framed from a female character's perspective.
- **适用**：Romance or drama scenes emphasizing the heroine's viewpoint；Situating perspective with visible female protagonist body/cues
- **避免**：Gender-neutral or third-person objective sequences
- **叙事效果**：Anchors reader perspective specifically to the female lead's subjective gaze
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：7073
- **POV 类型**：first_person_gendered
- **观察者关系**：embodied_female
- **沉浸级别**：high
- **兼容**：pov；pov hands；facing viewer
- **互斥**：full body；from behind

### `pov doorway`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：First-person POV framed looking through an open doorway into a room.
- **适用**：Arriving at a room to discover a scene or surprise inside；Peeking into someone's room or witnessing a secret conversation
- **避免**：Outdoor open field sequences
- **叙事效果**：Creates threshold tension, voyeuristic discovery, and spatial transition
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：2761
- **POV 类型**：first_person_situated
- **观察者关系**：threshold_observer
- **沉浸级别**：high
- **兼容**：pov；framed；depth of field
- **互斥**：scenery；landscape

### `pov across table`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：First-person POV seated directly across a dining, meeting, or interrogation table from the subject.
- **适用**：Cafe/dinner dates, business negotiations, or interrogation confrontations；Intimate seated conversational exchanges
- **避免**：Active standing action or outdoor travel
- **叙事效果**：Establishes conversational intimacy, tension, or interrogation pressure
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：1594
- **POV 类型**：first_person_seated
- **观察者关系**：tablemate_interlocutor
- **沉浸级别**：high
- **兼容**：pov；upper body；facing viewer；depth of field
- **互斥**：full body；from behind；wide shot

### `against fourth wall`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Character pressed against or interacting directly with the metaphorical fourth wall/screen boundary.
- **适用**：Meta-commentary, comedic fourth-wall breaks, or claustrophobic trapped scenes
- **避免**：Pure immersion realistic serious drama
- **叙事效果**：Breaks narrative barrier, evoking comedic awareness or uncanny entrapment
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：1239
- **POV 类型**：meta_subjective
- **观察者关系**：fourth_wall_boundary
- **沉浸级别**：meta
- **兼容**：facing viewer；close-up；framed
- **互斥**：scenery；very wide shot

### `pov peephole`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Circular masked first-person viewpoint looking through a door peephole or optical scope.
- **适用**：Answering a knock on the door with suspicious visitors outside；Spying or surveillance through a keyhole or peephole
- **避免**：Open unobstructed scene compositions
- **叙事效果**：Builds intense suspense, paranoia, and voyeuristic restriction
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：820
- **POV 类型**：first_person_aperture
- **观察者关系**：peephole_voyeur
- **沉浸级别**：high
- **兼容**：round border；fisheye；vignetting；distortion
- **互斥**：wide shot；full body

### `pov across bed`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：First-person perspective lying down or seated on a bed looking across at another person.
- **适用**：Morning wake-up scenes, hospital bedside visits, or bedroom dialogue
- **避免**：Public outdoor bustling scenes
- **叙事效果**：Evokes vulnerability, tenderness, recovery, or domestic intimacy
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：804
- **POV 类型**：first_person_recumbent
- **观察者关系**：bedside_companion
- **沉浸级别**：high
- **兼容**：pov；upper body；facing viewer；depth of field
- **互斥**：full body；scenery

### `taker pov`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：POV of the person taking a photo or recording video of the subject.
- **适用**：Photographing friends during a trip or event；Documentary or in-universe camera capture moments
- **避免**：Non-mediated narrative storytelling
- **叙事效果**：Frames the subject as being actively documented by the protagonist
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：674
- **POV 类型**：first_person_photographer
- **观察者关系**：camera_operator
- **沉浸级别**：high
- **兼容**：viewfinder；facing viewer；upper body
- **互斥**：from behind

### `pov dating`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：POV simulating an otome/galge dating simulation perspective opposite a love interest.
- **适用**：Romantic date scenes, amusement park outings, or walk-and-talk dating beats
- **避免**：Grim battle action sequences
- **叙事效果**：Heightens romantic immersion and emotional focus
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：287
- **POV 类型**：first_person_dating
- **观察者关系**：romantic_partner
- **沉浸级别**：high
- **兼容**：pov；upper body；facing viewer；blurry background
- **互斥**：from behind；scenery

### `pov shadow`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：First-person view where the observer's shadow falls onto the foreground subject or ground.
- **适用**：Intimidating approach where the observer looms over someone；Sunny day walking where observer's silhouette is projected forward
- **避免**：Diffused lighting or darkness without shadows
- **叙事效果**：Asserts presence and spatial proximity without showing the full observer body
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：240
- **POV 类型**：first_person_silhouette
- **观察者关系**：looming_presence
- **沉浸级别**：high
- **兼容**：pov；from above
- **互斥**：from behind

### `lap pov`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：POV looking down directly into one's own lap or looking up from someone's lap (lap pillow).
- **适用**：Lap pillow resting scenes or looking down at hands resting on knees
- **避免**：Standing dynamic athletic action
- **叙事效果**：Creates extreme warmth, comfort, vulnerability, or introspection
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：159
- **POV 类型**：first_person_lap
- **观察者关系**：resting_intimate
- **沉浸级别**：high
- **兼容**：pov；close-up
- **互斥**：full body；wide shot

### `pov adoring`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Subjective viewpoint looking up at an admired, loved, or revered figure.
- **适用**：Mentee looking up at mentor, or lover looking admiringly at partner
- **避免**：Hostile standoff or antagonistic confrontation
- **叙事效果**：Infuses the panel with affection, wonder, and reverence
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：158
- **POV 类型**：first_person_affective
- **观察者关系**：adoring_admirer
- **沉浸级别**：high
- **兼容**：pov；from below；portrait；sparkle；bloom
- **互斥**：from behind

### `multiple pov`

- **层级**：experimental
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Panel arrangement displaying simultaneous first-person perspectives from different characters.
- **适用**：Mutual recognition beats showing both characters' eyes-view side-by-side
- **避免**：Standard single-camera panels
- **叙事效果**：Highlights dual perspective and shared emotional realization
- **来源类别**：composition.camera_angle.subjective_view
- **Post Count**：136
- **POV 类型**：multi_subjective
- **观察者关系**：dual_observers
- **沉浸级别**：high
- **兼容**：split screen；side-by-side；cut-in
- **互斥**：mugshot

### `under table`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Camera situated underneath a desk or table looking out into the room or at hidden feet/items.
- **适用**：Hiding beneath furniture during stealth, hide-and-seek, or danger；Secret hand/foot messages passed under the table during a meeting
- **避免**：Open fields or standard stand-up dialogue
- **叙事效果**：Creates claustrophobic suspense, secrecy, and covert observation
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：3886
- **POV 类型**：situated_subterranean
- **观察者关系**：concealed_underneath
- **沉浸级别**：high
- **兼容**：framed；depth of field
- **互斥**：wide shot；scenery

### `partially underwater shot`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Split waterline framing showing both above-water surface and submerged world simultaneously.
- **适用**：Swimming, beach, hot springs, or pool scenes showing surface and subsurface action
- **避免**：Dry land indoor scenes
- **叙事效果**：Creates striking visual bifurcation between air and aquatic depth
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：2565
- **POV 类型**：situated_waterline
- **观察者关系**：aquatic_interface
- **沉浸级别**：medium
- **兼容**：refraction；depth of field
- **互斥**：scenery

### `from outside`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Camera positioned outdoors or exterior to a structure looking in toward occupants.
- **适用**：Looking into a cozy cafe/home from a rainy street outside；Surveillance from outside a building
- **避免**：Deep interior intimate conversations with no building exterior
- **叙事效果**：Establishes physical distance, longing, isolation, or voyeuristic separation
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：1934
- **POV 类型**：situated_exterior
- **观察者关系**：exterior_bystander
- **沉浸级别**：medium
- **兼容**：through window；framed；wide shot
- **互斥**：from inside

### `through window`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Framed looking through a glass windowpane with glass reflections or raindrops visible.
- **适用**：Melancholy character gazing through rain-streaked glass；Looking into a storefront or looking out at a changing city
- **避免**：Unobstructed open outdoor action
- **叙事效果**：Adds emotional melancholy, barrier, reflection, and quiet contemplation
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：491
- **POV 类型**：situated_glass_barrier
- **观察者关系**：window_mediated
- **沉浸级别**：medium
- **兼容**：reflection；depth of field；from outside
- **互斥**：fisheye

### `from inside`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Camera positioned inside a room, vehicle, or structure looking toward an entrance or window.
- **适用**：Looking out from a room at someone arriving or passing by outside；Interior car/train cabin perspective looking out at scenery
- **避免**：Pure outdoor vistas with no interior framing
- **叙事效果**：Establishes safe haven enclosure or interior spatial grounding
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：309
- **POV 类型**：situated_interior
- **观察者关系**：interior_occupant
- **沉浸级别**：medium
- **兼容**：framed；depth of field
- **互斥**：from outside

### `around corner`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Camera peeking around an architectural wall corner or hallway bend.
- **适用**：Stealth stalking, tailing suspects, or preparing an ambush；Timid character gathering courage before entering a room
- **避免**：Open fields without architectural corners
- **叙事效果**：Injects immediate suspense, tactical awareness, and covert observation
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：271
- **POV 类型**：situated_occluded
- **观察者关系**：corner_peeker
- **沉浸级别**：high
- **兼容**：framed；shoulder peek；depth of field
- **互斥**：wide shot

### `refrigerator interior`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Camera placed inside an open refrigerator looking outward at character's illuminated face.
- **适用**：Late-night snacking, searching for food, or dramatic fridge light glow beats
- **避免**：Outdoor or fantasy action scenes
- **叙事效果**：Iconic cinematic framing providing strong interior lighting onto the subject
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：259
- **POV 类型**：situated_appliance
- **观察者关系**：fridge_interior
- **沉浸级别**：high
- **兼容**：facing viewer；close-up；framed
- **互斥**：scenery；landscape

### `through ground`

- **层级**：experimental
- **可靠度**：low
- **视觉优先级**：1
- **说明**：Cross-section underground view looking upward through transparent soil or floor.
- **适用**：Buried objects, fantasy subterranean roots, or burrowing creatures
- **避免**：Standard realistic scenes
- **叙事效果**：Reveals hidden subterranean dimensions
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：244
- **POV 类型**：situated_subsurface
- **观察者关系**：underground_observer
- **沉浸级别**：medium
- **兼容**：from below；under shot
- **互斥**：portrait

### `behind tree`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Camera positioned behind a tree trunk with bark/leaves partially framing the subject.
- **适用**：Park or forest spying, secret surveillance, or timid love confession stalking
- **避免**：Indoor rooms or urban alleys without greenery
- **叙事效果**：Creates voyeuristic staging and organic foreground depth
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：228
- **POV 类型**：situated_foliage
- **观察者关系**：forest_voyeur
- **沉浸级别**：high
- **兼容**：framed；blurry foreground；depth of field
- **互斥**：scenery

### `behind curtains`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Framed peeking through or behind parted fabric window curtains.
- **适用**：Stealthily watching street events from a dark bedroom；Theatrical stage backstage waiting
- **避免**：Outdoor open scenes
- **叙事效果**：Adds dramatic secrecy, domestic intrigue, and rich foreground framing
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：164
- **POV 类型**：situated_drapery
- **观察者关系**：curtain_peeker
- **沉浸级别**：high
- **兼容**：framed；blurry foreground；depth of field
- **互斥**：wide shot

### `through portal`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Framed looking across a magical portal or dimensional rift into another world.
- **适用**：Isekai transitions, summoning rituals, or cross-realm communication
- **避免**：Grounded mundane slice-of-life scenes
- **叙事效果**：Contrasts two starkly different realities across a single boundary
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：125
- **POV 类型**：situated_dimensional
- **观察者关系**：interdimensional_viewer
- **沉浸级别**：medium
- **兼容**：framed；bloom；double exposure
- **互斥**：mugshot

### `in trunk`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Camera positioned inside a vehicle trunk or chest looking upward at person opening the lid.
- **适用**：Kidnapping, contraband inspection, or treasure chest opening scenes
- **避免**：General open dialogue
- **叙事效果**：Iconic cinematic framing evoking crime drama or suspenseful discovery
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：120
- **POV 类型**：situated_enclosure
- **观察者关系**：trunk_interior
- **沉浸级别**：high
- **兼容**：from below；facing viewer；framed
- **互斥**：landscape；wide shot

### `in refrigerator`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Situated directly inside a cold refrigerator compartment looking out.
- **适用**：Variant of refrigerator interior emphasizing claustrophobic storage placement
- **避免**：Outdoor daylight scenes
- **叙事效果**：Emphasizes cold illumination and intimate domestic humor
- **来源类别**：composition.camera_angle.situated_view
- **Post Count**：102
- **POV 类型**：situated_appliance
- **观察者关系**：fridge_interior
- **沉浸级别**：high
- **兼容**：refrigerator interior；facing viewer
- **互斥**：landscape

### `mirror selfie`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Character holding a phone photographing their reflection in a mirror.
- **适用**：Social media posts, outfit checks, bedroom selfies, or casual comic vignettes
- **避免**：Historical or high-fantasy settings without smartphones/mirrors
- **叙事效果**：Creates modern, casual, relatable character-driven self-presentation
- **来源类别**：composition.camera_angle.mediated_view
- **Post Count**：1296
- **POV 类型**：mediated_selfie
- **观察者关系**：self_mediated
- **沉浸级别**：medium
- **兼容**：viewer holding phone；reflection；upper body
- **互斥**：from behind；scenery

### `viewer holding phone`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Framed with the reader's hands holding a smartphone displaying an on-screen image.
- **适用**：Reading a text message, reviewing a photo, or watching a video call
- **避免**：Direct unmediated narrative scenes
- **叙事效果**：Embeds mediated electronic communication directly into reader hands
- **来源类别**：composition.camera_angle.mediated_view
- **Post Count**：784
- **POV 类型**：mediated_device
- **观察者关系**：device_user
- **沉浸级别**：high
- **兼容**：pov hands；depth of field
- **互斥**：scenery；landscape

### `against mirror`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Subject leaning directly against a reflective mirror surface.
- **适用**：Dressing room melancholy, psychological dual-identity, or introspective moments
- **避免**：Outdoor natural settings
- **叙事效果**：Doubles visual presence and suggests psychological duality or vanity
- **来源类别**：composition.camera_angle.mediated_view
- **Post Count**：222
- **POV 类型**：mediated_reflective
- **观察者关系**：mirror_adjacent
- **沉浸级别**：medium
- **兼容**：reflection；depth of field；portrait
- **互斥**：scenery

### `eyewear view`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Viewpoint framed through eyeglasses, sunglasses, or goggles showing tint/frame edges.
- **适用**：Putting on glasses, HUD tactical goggles, or tinted sunglass perspectives
- **避免**：Character does not wear eyewear
- **叙事效果**：Filters the scene through optical tint and distinctive frame geometry
- **来源类别**：composition.camera_angle.mediated_view
- **Post Count**：215
- **POV 类型**：mediated_optic
- **观察者关系**：eyewear_wearer
- **沉浸级别**：high
- **兼容**：pov；vignetting；depth of field
- **互斥**：full body

### `fixed-point camera`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Static surveillance camera or fixed security angle mounted high on a wall.
- **适用**：CCTV security footage, interrogation monitoring, or detached clinical recording
- **避免**：Fluid emotional cinematic storytelling
- **叙事效果**：Conveys clinical surveillance, cold detachment, and ominous observation
- **来源类别**：composition.camera_angle.mediated_view
- **Post Count**：208
- **POV 类型**：mediated_surveillance
- **观察者关系**：security_system
- **沉浸级别**：low
- **兼容**：from above；camera feed；scanlines；time lapse
- **互斥**：close-up；portrait

### `through mirror`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Viewpoint looking through a two-way mirror or into a mirror reflection from behind glass.
- **适用**：Interrogation observation rooms or surreal mirror world transitions
- **避免**：Unreflective standard rooms
- **叙事效果**：Builds psychological separation, secret observation, and uncanny reflection
- **来源类别**：composition.camera_angle.mediated_view
- **Post Count**：109
- **POV 类型**：mediated_two_way
- **观察者关系**：mirror_voyeur
- **沉浸级别**：medium
- **兼容**：reflection；depth of field
- **互斥**：wide shot

### `camera feed`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Displays live camera recording interface with timestamp, REC indicator, or battery icons.
- **适用**：Found footage style storytelling, live broadcasting, or body-cam scenes
- **避免**：Traditional fantasy or historical settings
- **叙事效果**：Provides technological realism, urgency, and live documentation feeling
- **来源类别**：composition.framing.arrangement
- **Post Count**：105
- **POV 类型**：mediated_hud
- **观察者关系**：broadcast_viewer
- **沉浸级别**：high
- **兼容**：fixed-point camera；viewfinder；scanlines
- **互斥**：scenery


## Perspective／透视与投影（9 项）

- Scope：`panel`
- Max Selected：`2`
- 组说明：Optical lens projection, linear perspective convergence, and spatial distortion.

### `dutch angle`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：3
- **说明**：Camera is tilted on its roll axis so the horizon line is slanted.
- **适用**：Psychological instability, shock, disorientation, or madness；Intense fast-paced combat dynamic diagonal energy；Unease, supernatural danger, or narrative crisis
- **避免**：Calm, peaceful slice-of-life scenes requiring horizontal stability
- **叙事效果**：Injects immediate psychological tension, urgency, and kinetic instability；Breaks horizontal complacency and accelerates visual flow
- **来源类别**：composition.camera_angle.perspective
- **Post Count**：144659
- **镜头投影**：canted_roll
- **畸变级别**：moderate
- **空间压缩**：diagonal_tilt
- **兼容**：upper body；full body；from below；from above；motion lines
- **互斥**：isometric；straight-on

### `foreshortening`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：3
- **说明**：Strong optical perspective compression where limbs or weapons extending toward camera appear dramatically enlarged.
- **适用**：Punches, kicks, sword thrusts, or reaching hands directed at the viewer；Dynamic action poses bursting out of the panel plane
- **避免**：Static neutral standing poses
- **叙事效果**：Pushes action directly into the reader's face, creating extreme kinetic pop
- **来源类别**：composition.camera_angle.perspective
- **Post Count**：62736
- **镜头投影**：wide_angle_foreshortened
- **畸变级别**：high
- **空间压缩**：depth_exaggeration
- **兼容**：from below；hand focus；weapon focus；motion lines；dutch angle
- **互斥**：isometric

### `perspective`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：3
- **说明**：Strong architectural or spatial linear perspective emphasizing converging geometric lines.
- **适用**：Long hallways, urban avenues, railway tracks, or futuristic corridors；Emphasizing spatial depth and architectural grandeur
- **避免**：Abstract flat background compositions
- **叙事效果**：Draws the reader's eye deep into the background vanishing point
- **来源类别**：composition.camera_angle.perspective
- **Post Count**：8929
- **镜头投影**：linear_converging
- **畸变级别**：medium
- **空间压缩**：depth_extension
- **兼容**：vanishing point；wide shot；from above；scenery
- **互斥**：isometric

### `fisheye`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：3
- **说明**：Ultra wide-angle barrel distortion curving straight lines outward in a spherical projection.
- **适用**：Claustrophobic indoor spaces, chaotic skate/action energy, or peephole views；Exaggerating close proximity of a character looming right against the lens
- **避免**：Realistic proportion architectural renderings or serious stoic portraits
- **叙事效果**：Creates striking curvilinear distortion, intense intimacy, or psychedelic dizziness
- **来源类别**：composition.camera_angle.perspective
- **Post Count**：6245
- **镜头投影**：curvilinear_barrel
- **畸变级别**：extreme
- **空间压缩**：spherical_expansion
- **兼容**：pov peephole；close-up；from below；vignetting
- **互斥**：isometric；straight-on

### `vanishing point`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：3
- **说明**：Strong one-point perspective where all orthogonal lines converge to a single focal point.
- **适用**：Endless roads, tunnels, colonnades, or solitary walks into destiny；Focusing reader gaze directly down a corridor toward a focal subject
- **避免**：Organic chaotic outdoor natural forests without clean linear lines
- **叙事效果**：Commands absolute gaze guidance toward the central vanishing destination
- **来源类别**：composition.camera_angle.perspective
- **Post Count**：1443
- **镜头投影**：one_point_linear
- **畸变级别**：medium
- **空间压缩**：infinite_depth
- **兼容**：perspective；scenery；wide shot；from behind
- **互斥**：isometric；fisheye

### `isometric`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：3
- **说明**：Axonometric parallel projection without perspective convergence or vanishing points.
- **适用**：Tactical battle maps, dollhouse cutaways, retro RPG game aesthetics；Overview room diagrams and architectural cross-sections
- **避免**：Cinematic dynamic emotional action sequences
- **叙事效果**：Imparts technical precision, video-game charm, and spatial clarity
- **来源类别**：composition.camera_angle.perspective
- **Post Count**：1340
- **镜头投影**：parallel_axonometric
- **畸变级别**：none_affine
- **空间压缩**：infinite_focal_length
- **兼容**：full body；from above；dollhouse view
- **互斥**：dutch angle；fisheye；vanishing point；perspective；foreshortening

### `forced perspective`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：3
- **说明**：Optical illusion trick aligning foreground and background objects to manipulate apparent scale.
- **适用**：Comedic photo poses (holding the sun, pinching a giant, crushing miniature people)；Visual tricks manipulating scale perception
- **避免**：Grounded standard narrative panels
- **叙事效果**：Creates playful optical wit and imaginative scale interplay
- **来源类别**：composition.camera_angle.perspective
- **Post Count**：259
- **镜头投影**：depth_scale_illusion
- **畸变级别**：high
- **空间压缩**：plane_superimposition
- **兼容**：size comparison；hand focus；depth of field
- **互斥**：isometric

### `dollhouse view`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：3
- **说明**：Cutaway architectural cross-section revealing multiple rooms simultaneously like a dollhouse.
- **适用**：Showing simultaneous actions across different rooms in a house/building；Mansion floorplans or cross-section comic infographics
- **避免**：Standard single-room conversational storytelling
- **叙事效果**：Provides omniscient multi-room situational awareness
- **来源类别**：composition.camera_angle.perspective
- **Post Count**：183
- **镜头投影**：architectural_cutaway
- **畸变级别**：low
- **空间压缩**：planar_cross_section
- **兼容**：isometric；full composition；wide shot
- **互斥**：close-up；portrait；fisheye

### `atmospheric perspective`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：3
- **说明**：Gradual loss of contrast and shifting toward pale blue/haze in distant background layers.
- **适用**：Epic mountain ranges, vast fantasy horizons, and expansive outdoor vistas
- **避免**：Indoor rooms or close character shots
- **叙事效果**：Imparts immense geographic depth, scale, and atmospheric realism
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：299
- **镜头投影**：aerial_haze_depth
- **畸变级别**：low
- **空间压缩**：deep_layering
- **兼容**：landscape；scenery；very wide shot；wide shot
- **互斥**：close-up；portrait


## Framing／裁切与构图（54 项）

- Scope：`panel`
- Max Selected：`2`
- 组说明：Deliberate crops, spatial staging arrangements, internal frames, borders, and insets.

### `over shoulder`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Camera positioned behind one character's shoulder looking at a second facing subject.
- **适用**：Dialogue exchanges establishing spatial relation between two speakers；Confrontations where the facing character reacts to the foreground speaker
- **避免**：Solo character introspective scenes
- **叙事效果**：Connects conversational partners and establishes directional eye-lines
- **来源类别**：composition.framing.body_part_anchor.shoulder.over_shoulder
- **Post Count**：15041
- **取景类型**：spatial_anchor
- **构图装置**：ots_shot
- **裁切边界**：shoulder_foreground
- **兼容**：facing viewer；upper body；portrait；depth of field
- **互斥**：full body；scenery

### `faceless`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Character's face is obscured, cropped out, or left featureless.
- **适用**：Anonymous mob characters, mysterious antagonists, or emotional depersonalization
- **避免**：Expressive lead character dialogue
- **叙事效果**：Creates eerie anonymity, emotional numbness, or threatening menace
- **来源类别**：composition.framing.arrangement
- **Post Count**：60695
- **取景类型**：occlusion
- **构图装置**：facial_obscurity
- **裁切边界**：face_masked
- **兼容**：upper body；full body；from behind
- **互斥**：eye focus；close-up

### `shoulder peek`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Character peeking out from behind another person's shoulder.
- **适用**：Timid companions seeking protection, cute peeking moments
- **避免**：Dominant solo protagonist actions
- **叙事效果**：Highlights shyness, dependence, or playful curiosity
- **来源类别**：composition.framing.arrangement
- **Post Count**：2733
- **取景类型**：spatial_anchor
- **构图装置**：peeking_figure
- **裁切边界**：partial_shoulder
- **兼容**：behind another；upper body
- **互斥**：scenery

### `behind another`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：One character positioned directly behind another in depth.
- **适用**：Bodyguard protecting client, mentor standing behind student, stalking shadow
- **避免**：Solo single-character scenes
- **叙事效果**：Establishes hierarchy, protection, manipulation, or looming threat
- **来源类别**：composition.framing.arrangement
- **Post Count**：4939
- **取景类型**：depth_layering
- **构图装置**：foreground_background_pairing
- **裁切边界**：layered_subjects
- **兼容**：depth of field；upper body；full body
- **互斥**：scenery

### `feet out of frame`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Crops the character just above the feet or ankles.
- **适用**：Keeping focus on full outfit and body gesture while simplifying floor drawing
- **避免**：Footwork or kicking choreography
- **叙事效果**：Clean vertical framing prioritizing posture over floor contact
- **来源类别**：composition.framing.crop
- **Post Count**：201142
- **取景类型**：deliberate_crop
- **构图装置**：lower_boundary_trim
- **裁切边界**：above_ankles
- **兼容**：cowboy shot；upper body；from below
- **互斥**：feet only；foot focus

### `cropped torso`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Tightly crops the midsection/torso, cutting off head and legs.
- **适用**：Showing hands fiddling with belt, drawing a sword, or fastening a jacket
- **避免**：Dialogue requiring facial emotions
- **叙事效果**：Focuses attention on attire manipulation, gear adjustment, or physical posture
- **来源类别**：composition.framing.crop
- **Post Count**：63401
- **取景类型**：deliberate_crop
- **构图装置**：midsection_isolation
- **裁切边界**：chest_to_hips
- **兼容**：hand focus；weapon focus；out of frame
- **互斥**：portrait；close-up；headshot

### `cropped legs`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Frames the lower limbs while cropping out the upper body.
- **适用**：Showing stride, running shoes, knee stockings, or martial arts stances
- **避免**：Facial dialogue scenes
- **叙事效果**：Highlights kinetic locomotion and lower body action
- **来源类别**：composition.framing.crop
- **Post Count**：62791
- **取景类型**：deliberate_crop
- **构图装置**：lower_limb_isolation
- **裁切边界**：waist_down
- **兼容**：lower body；leg focus；foot focus
- **互斥**：portrait；upper body

### `out of frame`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Part of the subject deliberately extends outside the panel boundaries.
- **适用**：Dynamic action overflowing panel borders, or someone entering/exiting the shot
- **避免**：Neat, fully self-contained formal portraits
- **叙事效果**：Conveys expansive motion that cannot be contained by the frame
- **来源类别**：composition.framing.crop
- **Post Count**：40286
- **取景类型**：deliberate_crop
- **构图装置**：border_overflow
- **裁切边界**：unbounded
- **兼容**：foreshortening；motion lines；dutch angle
- **互斥**：framed

### `foot out of frame`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：One foot extends beyond the bottom or side border.
- **适用**：Dynamic stepping or kicking motions breaking the frame
- **避免**：Static seated poses
- **叙事效果**：Adds kinetic dynamism to movement
- **来源类别**：composition.framing.crop
- **Post Count**：35315
- **取景类型**：deliberate_crop
- **构图装置**：single_limb_crop
- **裁切边界**：foot_edge
- **兼容**：motion lines；full body
- **互斥**：feet only

### `head out of frame`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Subject's head is cropped out above the upper border.
- **适用**：De-emphasizing identity, highlighting an imposing physical build, or showing chest-level props
- **避免**：Standard talking scenes
- **叙事效果**：Builds suspense and depersonalization
- **来源类别**：composition.framing.crop
- **Post Count**：25855
- **取景类型**：deliberate_crop
- **构图装置**：decapitated_framing
- **裁切边界**：below_chin
- **兼容**：cropped torso；cowboy shot；weapon focus
- **互斥**：portrait；close-up；headshot

### `cropped shoulders`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Tightly trims outer shoulders to emphasize neck and head.
- **适用**：Narrow vertical panel framing for close character beats
- **避免**：Broad athletic poses
- **叙事效果**：Tightens focal concentration around the head
- **来源类别**：composition.framing.crop
- **Post Count**：6970
- **取景类型**：deliberate_crop
- **构图装置**：lateral_shoulder_trim
- **裁切边界**：inner_neck_base
- **兼容**：close-up；portrait
- **互斥**：full body

### `eyes out of frame`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Frames the face from nose or lips downward, deliberately cutting off the eyes.
- **适用**：Sinister smirks, dark monologues, or hidden weeping
- **避免**：Clear open communication
- **叙事效果**：Conceals emotion, evoking dark mystery, despair, or villainy
- **来源类别**：composition.framing.crop
- **Post Count**：2914
- **取景类型**：deliberate_crop
- **构图装置**：eye_occlusion_crop
- **裁切边界**：below_eyes
- **兼容**：mouth focus；close-up
- **互斥**：eye focus

### `cropped head`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Crops the top of the hair/head while keeping the face in view.
- **适用**：Extremely intense close-up emphasizing eyes and mouth
- **避免**：Full hairstyle showcase
- **叙事效果**：Creates immediate, claustrophobic emotional intimacy
- **来源类别**：composition.framing.crop
- **Post Count**：2015
- **取景类型**：deliberate_crop
- **构图装置**：top_of_head_trim
- **裁切边界**：forehead_edge
- **兼容**：close-up；eye focus
- **互斥**：full body

### `cropped arms`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Lateral crop cutting off outstretched arms at elbows or forearms.
- **适用**：Narrow panels where character reaches outward
- **避免**：Complete hand gesture readability
- **叙事效果**：Focuses energy into the central torso and head
- **来源类别**：composition.framing.crop
- **Post Count**：1872
- **取景类型**：deliberate_crop
- **构图装置**：lateral_arm_trim
- **裁切边界**：mid_arm
- **兼容**：upper body；portrait
- **互斥**：full body

### `knees out of frame`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Crops the body above the knee line (similar to cowboy shot).
- **适用**：Standard medium-long framing for dialogue and stance
- **避免**：Full leg action choreography
- **叙事效果**：Balances character presence with efficient panel space
- **来源类别**：composition.framing.crop
- **Post Count**：1632
- **取景类型**：deliberate_crop
- **构图装置**：knee_boundary_trim
- **裁切边界**：above_knees
- **兼容**：cowboy shot；upper body
- **互斥**：feet only；full body

### `arm out of frame`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：One arm extends outside the panel edge.
- **适用**：Reaching out to someone off-panel, swinging a weapon, or pointing
- **避免**：Centered self-contained poses
- **叙事效果**：Connects current panel with off-panel space or neighboring panel
- **来源类别**：composition.framing.crop
- **Post Count**：388
- **取景类型**：deliberate_crop
- **构图装置**：single_arm_overflow
- **裁切边界**：lateral_edge
- **兼容**：out of frame；motion lines
- **互斥**：framed

### `cropped arm`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Single arm is partially cropped by the framing edge.
- **适用**：Dynamic off-center character placement in tight panels
- **避免**：Symmetrical formal poses
- **叙事效果**：Adds spontaneous, candid framing feel
- **来源类别**：composition.framing.crop
- **Post Count**：279
- **取景类型**：deliberate_crop
- **构图装置**：asymmetrical_crop
- **裁切边界**：arm_edge
- **兼容**：upper body；portrait
- **互斥**：framed

### `multiple views`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Displays multiple angles or expressions of the character within a single image.
- **适用**：Character design model sheets, expressions showcase, or multi-angle study
- **避免**：Standard single continuous timeline comic panel
- **叙事效果**：Provides comprehensive visual breakdown from several vantage points
- **来源类别**：composition.framing.arrangement
- **Post Count**：232250
- **取景类型**：multi_view
- **构图装置**：composite_layout
- **裁切边界**：multi_panel_composite
- **兼容**：turnaround；lineup；side-by-side
- **互斥**：scenery

### `side-by-side`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Two or more characters/elements placed horizontally adjacent across the frame.
- **适用**：Companions walking together, comparing two rivals, or romantic couples
- **避免**：Solo character focus
- **叙事效果**：Emphasizes equality, comparison, camaraderie, or direct confrontation
- **来源类别**：composition.framing.arrangement
- **Post Count**：13960
- **取景类型**：arrangement
- **构图装置**：horizontal_pairing
- **裁切边界**：dual_character
- **兼容**：upper body；full body；facing viewer
- **互斥**：close-up

### `viewfinder`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Overlays camera viewfinder graphics, crosshairs, battery, or grid markings.
- **适用**：Sniping target lock, photographing events, or in-camera POV recording
- **避免**：Historical or naturalistic fantasy panels
- **叙事效果**：Frames the action through an optical lens device
- **来源类别**：composition.framing.arrangement
- **Post Count**：8831
- **取景类型**：overlay_interface
- **构图装置**：camera_hud_overlay
- **裁切边界**：viewfinder_mask
- **兼容**：crosshair；camera feed；pov
- **互斥**：scenery

### `lineup`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Characters arranged in a horizontal row across the panel.
- **适用**：Team introductions, ensemble cast showcases, or police suspect lineups
- **避免**：Intimate single-character moments
- **叙事效果**：Presents the collective strength, diversity, or unity of a group
- **来源类别**：composition.framing.arrangement
- **Post Count**：5338
- **取景类型**：arrangement
- **构图装置**：horizontal_lineup
- **裁切边界**：group_row
- **兼容**：full body；size comparison；side-by-side；group picture
- **互斥**：close-up；portrait

### `group picture`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Posed or dynamic group composition containing multiple characters gathered together.
- **适用**：Cast celebration photos, team gatherings, or ensemble cast introductions
- **避免**：Single character solo monologue
- **叙事效果**：Highlights camaraderie, team unity, and shared social connection
- **来源类别**：composition.framing.arrangement
- **Post Count**：4424
- **取景类型**：arrangement
- **构图装置**：group_ensemble
- **裁切边界**：group_cluster
- **兼容**：family portrait；lineup；side-by-side；wide shot
- **互斥**：close-up；portrait

### `turnaround`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Character shown from front, side, and back views for complete design reference.
- **适用**：Costume reference sheets, character design concept pages
- **避免**：Standard narrative story panels
- **叙事效果**：Shows 360-degree costume and silhouette design
- **来源类别**：composition.framing.arrangement
- **Post Count**：4231
- **取景类型**：multi_view
- **构图装置**：rotational_reference
- **裁切边界**：full_body_turnaround
- **兼容**：multiple views；full body
- **互斥**：scenery

### `framed`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Subject is neatly framed within an internal geometric shape, doorway, or picture frame.
- **适用**：Using natural architecture (arches, windows, gates) to create a frame-within-a-frame
- **避免**：Unconstrained chaotic action
- **叙事效果**：Directs visual focus and adds structural elegance to panel composition
- **来源类别**：composition.framing.arrangement
- **Post Count**：4140
- **取景类型**：internal_frame
- **构图装置**：frame_within_frame
- **裁切边界**：geometric_enclosure
- **兼容**：through window；pov doorway；depth of field
- **互斥**：out of frame

### `column lineup`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Characters arranged in a vertical stack or column formation.
- **适用**：Tall vertical comic panels or phone-scroll webtoon format
- **避免**：Wide horizontal panorama panels
- **叙事效果**：Guides reader eye vertically through sequential character tiers
- **来源类别**：composition.framing.arrangement
- **Post Count**：3097
- **取景类型**：arrangement
- **构图装置**：vertical_lineup
- **裁切边界**：vertical_stack
- **兼容**：vertical comic；lineup
- **互斥**：wide shot

### `split screen`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Panel is divided into distinct sub-sections showing different characters or locations.
- **适用**：Phone conversations, simultaneous parallel actions, or rival showdown reactions
- **避免**：Unified single space scene
- **叙事效果**：Synchronizes separate storylines and contrasts immediate reactions
- **来源类别**：composition.framing.arrangement
- **Post Count**：2585
- **取景类型**：sub_panel_split
- **构图装置**：divided_frame
- **裁切边界**：split_border
- **兼容**：cut-in；split crop；multiple views
- **互斥**：scenery

### `negative space`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Composition dominated by empty, open space surrounding a small focal subject.
- **适用**：Loneliness, melancholy, vast isolation, or dramatic pauses in comic rhythm
- **避免**：Crowded party scenes or dense urban street life
- **叙事效果**：Evokes silence, emptiness, contemplation, and emotional weight
- **来源类别**：composition.framing.arrangement
- **Post Count**：1535
- **取景类型**：compositional_balance
- **构图装置**：empty_space_dominance
- **裁切边界**：expanded_void
- **兼容**：wide shot；very wide shot；scenery
- **互斥**：crowded；cramped

### `surrounded`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Focal subject is encircled on all sides by enemies, crowds, or items.
- **适用**：Encirclement combat, overwhelming odds, or mobbing
- **避免**：One-on-one solo duels
- **叙事效果**：Creates extreme peril, entrapment, and desperate resistance
- **来源类别**：composition.framing.arrangement
- **Post Count**：1444
- **取景类型**：spatial_staging
- **构图装置**：radial_encirclement
- **裁切边界**：perimeter_flocking
- **兼容**：from above；full body；crowded
- **互斥**：negative space

### `full composition`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Richly packed, fully realized composition utilizing all visual planes (foreground, midground, background).
- **适用**：Climax splash pages, elaborate cityscapes, or grand party scenes
- **避免**：Simple minimalist dialogue panels
- **叙事效果**：Delivers high visual density, world immersion, and artistic luxury
- **来源类别**：composition.framing.arrangement
- **Post Count**：784
- **取景类型**：compositional_balance
- **构图装置**：full_plane_utilization
- **裁切边界**：edge_to_edge
- **兼容**：splash page；full page comic；wide shot
- **互斥**：negative space

### `cut-in`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Small secondary panel or horizontal eye-strip inserted into the main panel.
- **适用**：Sudden shock eye-reaction during broad action, special attack trigger
- **避免**：Static single-view compositions
- **叙事效果**：Punctuate high-speed action with critical emotional or tactical detail
- **来源类别**：composition.framing.arrangement
- **Post Count**：650
- **取景类型**：inset_panel
- **构图装置**：cutaway_insert
- **裁切边界**：inset_strip
- **兼容**：eye focus；close-up；motion lines
- **互斥**：scenery

### `split crop`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Character or scene is fractured across separated crop segments.
- **适用**：Psychological fragmentation, time-skip transitions, or contrasting before/after
- **避免**：Continuous realistic framing
- **叙事效果**：Creates visual tension and stylized conceptual division
- **来源类别**：composition.framing.arrangement
- **Post Count**：556
- **取景类型**：sub_panel_split
- **构图装置**：fragmented_crop
- **裁切边界**：segmented_frame
- **兼容**：split screen；multiple views
- **互斥**：full composition

### `size comparison`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Staging contrasting tiny and gigantic characters/objects side by side.
- **适用**：Showing colossal monsters compared to humans, height differences in couples
- **避免**：Characters of identical stature
- **叙事效果**：Clarifies physical scale disparity and power dynamics
- **来源类别**：composition.framing.arrangement
- **Post Count**：425
- **取景类型**：spatial_staging
- **构图装置**：scale_contrast
- **裁切边界**：dual_scale
- **兼容**：full body；lineup；side-by-side
- **互斥**：close-up

### `crowded`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Frame is filled with numerous characters, bodies, or dense objects.
- **适用**：Bustling market streets, packed festival crowds, or chaotic battle mekes
- **避免**：Solitary quiet moments
- **叙事效果**：Creates sensory overload, vibrant bustling energy, or suffocating overwhelm
- **来源类别**：composition.framing.arrangement
- **Post Count**：366
- **取景类型**：density
- **构图装置**：crowd_congestion
- **裁切边界**：dense_packing
- **兼容**：wide shot；full body；from above
- **互斥**：negative space

### `cramped`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Characters squeezed tightly into a restricted narrow spatial container or panel.
- **适用**：Hiding inside a locker, packed into a crowded elevator, or tiny tent
- **避免**：Grand panoramic expanses
- **叙事效果**：Evokes claustrophobia, awkward physical proximity, and comic tension
- **来源类别**：composition.framing.arrangement
- **Post Count**：308
- **取景类型**：density
- **构图装置**：spatial_confinement
- **裁切边界**：restricted_box
- **兼容**：close-up；upper body
- **互斥**：wide shot；negative space

### `opposing sides`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Two opposing factions or characters staged on opposite left/right sides of the frame.
- **适用**：Pre-battle standoff, debate showdown, or faction conflict
- **避免**：Friendly unified group scenes
- **叙事效果**：Visualizes sharp ideological, physical, or romantic tension across a divide
- **来源类别**：composition.framing.arrangement
- **Post Count**：212
- **取景类型**：spatial_staging
- **构图装置**：bilateral_opposition
- **裁切边界**：left_right_split
- **兼容**：side-by-side；wide shot；full body
- **互斥**：close-up

### `group profile`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Multiple characters all shown in profile looking in the same or opposite directions.
- **适用**：Marching armies, heroic squad gazing into battle, or layered profile lineup
- **避免**：Frontal dialogue
- **叙事效果**：Striking graphic rhythm conveying unified purpose or contrasting ideals
- **来源类别**：composition.framing.arrangement
- **Post Count**：208
- **取景类型**：arrangement
- **构图装置**：rhythmic_profile_stack
- **裁切边界**：multi_profile
- **兼容**：profile；lineup
- **互斥**：facing viewer

### `front and back`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Shows one character facing forward and another facing away, or same character front/back.
- **适用**：Back-to-back combat trust, parting ways, or dual-aspect design sheet
- **避免**：Simple single-direction staging
- **叙事效果**：Symbolizes mutual reliance, diverging paths, or comprehensive character design
- **来源类别**：composition.framing.arrangement
- **Post Count**：143
- **取景类型**：arrangement
- **构图装置**：contrasting_facing
- **裁切边界**：dual_stance
- **兼容**：multiple views；full body
- **互斥**：scenery

### `panorama`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Extra-wide horizontal aspect ratio capturing an uninterrupted sweeping vista.
- **适用**：Double-page spreads, epic battlefield vistas, or horizon sunset sweeps
- **避免**：Narrow vertical webtoon panels
- **叙事效果**：Delivers sweeping cinematic grandeur and horizon immersion
- **来源类别**：composition.framing.arrangement
- **Post Count**：136
- **取景类型**：aspect_ratio
- **构图装置**：ultrawide_panorama
- **裁切边界**：wide_horizontal_sweep
- **兼容**：landscape；wide shot；scenery
- **互斥**：vertical comic；close-up

### `montage`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Collage of several disparate scenes, memories, or actions blended into one visual field.
- **适用**：Training montages, passage of time, travel progression, or memory retrospectives
- **避免**：Single real-time moment
- **叙事效果**：Compresses time, narrative events, and emotional journey into a unified graphic
- **来源类别**：composition.framing.arrangement
- **Post Count**：134
- **取景类型**：multi_scene
- **构图装置**：montage_blend
- **裁切边界**：blended_facets
- **兼容**：flashback；multiple views；split screen
- **互斥**：scenery

### `border`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Explicit visual frame or border enclosing the artwork.
- **适用**：Classic framed comic panel look with clean outer margins
- **避免**：Borderless full-bleed illustrations
- **叙事效果**：Provides clean containment and traditional comic panel structure
- **来源类别**：composition.framing.border
- **Post Count**：210362
- **取景类型**：border_style
- **构图装置**：framed_boundary
- **裁切边界**：bordered_box
- **兼容**：comic；4koma；letterboxed
- **互斥**：borderless panels

### `white border`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Clean white outer margin separating the image from the page background.
- **适用**：Standard manga/comic gutter and border formatting
- **避免**：Dark flashback panels requiring black borders
- **叙事效果**：Classic comic page aesthetic with high contrast against artwork
- **来源类别**：composition.framing.border
- **Post Count**：132430
- **取景类型**：border_style
- **构图装置**：white_margin
- **裁切边界**：white_frame
- **兼容**：comic；4koma
- **互斥**：black border；borderless panels

### `outside border`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Artwork or character elements burst outside the defined panel border into the gutter.
- **适用**：High-impact action hits, explosive magic, or dramatic foreground figure overlays
- **避免**：Strictly neat formal 4koma panels
- **叙事效果**：Delivers high-impact kinetic pop and spatial dominance over the page
- **来源类别**：composition.framing.border
- **Post Count**：81674
- **取景类型**：border_style
- **构图装置**：gutter_bleed
- **裁切边界**：frame_breaking
- **兼容**：out of frame；foreshortening；comic
- **互斥**：framed

### `letterboxed`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Horizontal black cinematic bars across the top and bottom of the frame.
- **适用**：Cinematic cutscenes, widescreen dramatic beats, or movie-like pacing
- **避免**：Standard square comic panels
- **叙事效果**：Imparts distinct cinematic prestige and theatrical widescreen feel
- **来源类别**：composition.framing.border
- **Post Count**：64998
- **取景类型**：aspect_framing
- **构图装置**：matte_bars
- **裁切边界**：top_bottom_black_bars
- **兼容**：wide shot；dutch angle；depth of field
- **互斥**：pillarboxed

### `black border`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Black gutter borders surrounding the panel, traditional in manga for flashbacks.
- **适用**：Flashback memories, tragic past sequences, or grim nightmares
- **避免**：Bright ongoing present-timeline comedy
- **叙事效果**：Universal manga convention signaling memory, past events, or dark tone
- **来源类别**：composition.framing.border
- **Post Count**：22122
- **取景类型**：border_style
- **构图装置**：black_matte
- **裁切边界**：black_frame
- **兼容**：flashback；sepia；comic
- **互斥**：white border

### `pillarboxed`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Vertical black bars placed on the left and right sides of the image.
- **适用**：Simulating 4:3 retro CRT monitor/TV display in a widescreen frame
- **避免**：Wide panoramic vistas
- **叙事效果**：Evokes retro broadcasting, vintage gaming, or narrow focus
- **来源类别**：composition.framing.border
- **Post Count**：7922
- **取景类型**：aspect_framing
- **构图装置**：side_matte_bars
- **裁切边界**：left_right_black_bars
- **兼容**：scanlines；film grain
- **互斥**：letterboxed；panorama

### `inset border`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Decorative or nested border set inside the outer panel edges.
- **适用**：Antique book framing, ornate fantasy scrolls, or card frames
- **避免**：Clean modern minimalist comic pages
- **叙事效果**：Adds decorative craftsmanship and stylistic elegance
- **来源类别**：composition.framing.border
- **Post Count**：3878
- **取景类型**：border_style
- **构图装置**：nested_border
- **裁切边界**：inner_frame
- **兼容**：framed；portrait
- **互斥**：borderless panels

### `round border`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Circular or oval shaped panel frame.
- **适用**：Peephole views, telescope/binocular scopes, cameo memories, or chibi vignettes
- **避免**：Standard rectangular grid layout
- **叙事效果**：Softens panel transition and evokes optical lens devices or intimate memories
- **来源类别**：composition.framing.border
- **Post Count**：1157
- **取景类型**：border_style
- **构图装置**：circular_mask
- **裁切边界**：round_mask
- **兼容**：pov peephole；fisheye；chibi inset
- **互斥**：letterboxed

### `chibi inset`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Small secondary inset bubble showing a miniature super-deformed (chibi) reaction.
- **适用**：Comedic commentary, exaggerated embarrassment, or explanatory mini-guides
- **避免**：Deadly serious grimdark climaxes
- **叙事效果**：Adds comedic levity, cute contrast, and playful authorial commentary
- **来源类别**：composition.framing.inset
- **Post Count**：26246
- **取景类型**：inset_vignette
- **构图装置**：chibi_sub_bubble
- **裁切边界**：inset_circle
- **兼容**：comic；4koma；upper body
- **互斥**：scenery

### `reference inset`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Inset box displaying a costume detail, weapon blueprint, or reference graphic.
- **适用**：Explaining intricate mechanics, weapon details, or accessory zoom-ins
- **避免**：Fast emotional dialogue
- **叙事效果**：Provides technical exposition and detailed item context
- **来源类别**：composition.framing.inset
- **Post Count**：10777
- **取景类型**：inset_vignette
- **构图装置**：technical_inset
- **裁切边界**：inset_box
- **兼容**：full body；weapon focus
- **互斥**：scenery

### `photo inset`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：4
- **说明**：Inset graphic styled as a printed photograph pinned or floating over the panel.
- **适用**：Remembering a past event, displaying evidence photo, or memento
- **避免**：Pure real-time action
- **叙事效果**：Grounds narrative memory in a physical photographic artifact
- **来源类别**：composition.framing.inset
- **Post Count**：4026
- **取景类型**：inset_vignette
- **构图装置**：polaroid_inset
- **裁切边界**：photo_frame
- **兼容**：family portrait；flashback；framed
- **互斥**：scenery

### `screenshot inset`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Inset graphic showing a digital screen capture or video frame.
- **适用**：Showing video call participant, surveillance camera footage, or gaming UI
- **避免**：Pre-modern fantasy without technology
- **叙事效果**：Brings technological mediation directly into the scene
- **来源类别**：composition.framing.inset
- **Post Count**：3739
- **取景类型**：inset_vignette
- **构图装置**：digital_screen_inset
- **裁切边界**：screen_box
- **兼容**：camera feed；scanlines
- **互斥**：scenery

### `projected inset`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Holographic projection or ethereal thought bubble floating over the panel.
- **适用**：Sci-fi holographic briefings, psychic projections, or distant caller holograms
- **避免**：Grounded realistic scenes
- **叙事效果**：Visualizes futuristic telecommunication or ethereal thought transmission
- **来源类别**：composition.framing.inset
- **Post Count**：3099
- **取景类型**：inset_vignette
- **构图装置**：hologram_inset
- **裁切边界**：ethereal_inset
- **兼容**：bloom；upper body
- **互斥**：scenery

### `inset`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：4
- **说明**：General secondary sub-panel inset nested inside the main image area.
- **适用**：Simultaneous secondary reaction or item detail shown alongside main action
- **避免**：Single uncluttered minimalist panels
- **叙事效果**：Enables multi-track visual storytelling within a single shot budget
- **来源类别**：composition.framing.inset
- **Post Count**：2859
- **取景类型**：inset_vignette
- **构图装置**：generic_sub_frame
- **裁切边界**：nested_box
- **兼容**：comic；upper body；close-up
- **互斥**：scenery

### `doodle inset`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：4
- **说明**：Casual chibi sketch or stick figure doodle added in the margins or corner.
- **适用**：Humorous character thoughts, simplified diagrams, or playful author commentary
- **避免**：Solemn tragic moments
- **叙事效果**：Provides humorous meta-commentary and comedic contrast
- **来源类别**：production.format.general
- **Post Count**：1758
- **取景类型**：inset_vignette
- **构图装置**：sketch_doodle_inset
- **裁切边界**：sketch_bubble
- **兼容**：4koma；comic
- **互斥**：scenery


## Focus／焦点与景深（28 项）

- Scope：`panel`
- Max Selected：`2`
- 组说明：Subject/element focal target and optical depth-of-field blur cues.

### `eye focus`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Camera focus placed explicitly on the character's eyes and gaze.
- **适用**：Realization, sudden shock, hypnotic trance, tears, or piercing glare
- **避免**：Broad physical combat choreography
- **叙事效果**：Commands reader attention to the psychological soul and gaze of the subject
- **来源类别**：composition.framing.focus
- **Post Count**：3689
- **焦点目标**：eyes
- **深度线索**：shallow_eye_plane
- **焦平面**：facial_front
- **兼容**：close-up；portrait；depth of field
- **互斥**：eyes out of frame；faceless；feet only

### `hand focus`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Focal emphasis on hands performing an action, holding an item, or gesturing.
- **适用**：Holding hands, grasping a weapon, writing a letter, or magic casting gestures
- **避免**：Scenes focused on subtle facial expressions
- **叙事效果**：Emphasizes tactile agency, decision-making, and physical connection
- **来源类别**：composition.framing.focus
- **Post Count**：2000
- **焦点目标**：hands
- **深度线索**：hand_plane
- **焦平面**：gesture_plane
- **兼容**：pov hands；depth of field；foreshortening
- **互斥**：head only；portrait

### `weapon focus`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Focus sharply targeted on a sword, gun, staff, or combat weapon.
- **适用**：Weapon draw reveals, inspecting weapon craftsmanship, or aiming down the barrel
- **避免**：Peaceful slice-of-life tea scenes
- **叙事效果**：Heightens combat readiness, deadly threat, and martial power
- **来源类别**：composition.framing.focus
- **Post Count**：1166
- **焦点目标**：weapon
- **深度线索**：weapon_plane
- **焦平面**：object_foreground
- **兼容**：foreshortening；cowboy shot；depth of field
- **互斥**：scenery

### `object focus`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Focus placed on a specific inanimate prop or key narrative item.
- **适用**：Plot-critical McGuffins (amulet, key, mysterious letter, potion bottle)
- **避免**：Character-centric dialogues with no props
- **叙事效果**：Highlights narrative clues and symbolic significance of items
- **来源类别**：composition.framing.focus
- **Post Count**：2457
- **焦点目标**：prop
- **深度线索**：prop_plane
- **焦平面**：foreground_object
- **兼容**：still life；depth of field；hand focus
- **互斥**：scenery

### `vehicle focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Composition centered on a car, motorcycle, aircraft, or ship.
- **适用**：High-speed chase scenes, vehicle reveals, or travel transport shots
- **避免**：Indoor room dialogue
- **叙事效果**：Emphasizes speed, mechanical power, and travel progression
- **来源类别**：composition.framing.focus
- **Post Count**：14366
- **焦点目标**：vehicle
- **深度线索**：vehicle_hull
- **焦平面**：midground_vehicle
- **兼容**：motion blur；speed lines；wide shot
- **互斥**：close-up

### `mecha focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Composition focusing on giant robots, armored suits, or cybernetic machinery.
- **适用**：Mecha launch sequences, giant robot battles, or cockpit boarding
- **避免**：Historical fantasy without machinery
- **叙事效果**：Highlights technological power, colossal scale, and mechanical complexity
- **来源类别**：composition.framing.focus
- **Post Count**：8232
- **焦点目标**：mecha
- **深度线索**：mecha_chassis
- **焦平面**：colossal_foreground
- **兼容**：from below；wide shot；foreshortening
- **互斥**：portrait

### `animal focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Framing focused primarily on an animal, pet, or mascot creature.
- **适用**：Mascot reactions, companion animals, horses in travel, or wild beast encounters
- **避免**：Human-only drama scenes
- **叙事效果**：Brings charm, companion warmth, or animal instinct into the scene
- **来源类别**：composition.framing.focus
- **Post Count**：39583
- **焦点目标**：animal
- **深度线索**：animal_subject
- **焦平面**：creature_plane
- **兼容**：upper body；close-up；depth of field
- **互斥**：scenery

### `food focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Appetizing focus on prepared meals, pastries, snacks, or beverages.
- **适用**：Cooking manga feast reveals, cafe dates, or character tasting moments
- **避免**：Combat battlefields
- **叙事效果**：Evokes delicious culinary appeal, sensory pleasure, and hospitality
- **来源类别**：composition.framing.focus
- **Post Count**：14477
- **焦点目标**：food
- **深度线索**：culinary_plane
- **焦平面**：tabletop_foreground
- **兼容**：depth of field；still life；close-up
- **互斥**：scenery

### `sky focus`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Composition dominated by the expanse of clouds, stars, sunset, or celestial sky.
- **适用**：Looking up at sky in contemplation, weather transitions, or shooting star wishes
- **避免**：Underground or indoor rooms
- **叙事效果**：Evokes freedom, yearning, boundless dreams, and cosmic scale
- **来源类别**：composition.framing.focus
- **Post Count**：1028
- **焦点目标**：sky
- **深度线索**：infinite_horizon
- **焦平面**：celestial_plane
- **兼容**：from below；landscape；scenery；wide shot
- **互斥**：under table；refrigerator interior

### `plant focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Focus placed on foliage, branches, vines, or indoor houseplants.
- **适用**：Botanical garden scenes, herbalism, or framing through leafy vines
- **避免**：Barren sci-fi metal corridors
- **叙事效果**：Adds lush organic atmosphere and natural tranquility
- **来源类别**：composition.framing.focus
- **Post Count**：771
- **焦点目标**：flora
- **深度线索**：botanical_plane
- **焦平面**：vegetation_layer
- **兼容**：flower focus；depth of field；scenery
- **互斥**：scenery

### `flower focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Tightly focused framing on blossoms, bouquets, or flower petals.
- **适用**：Romantic flower gifting, funeral tributes, or symbolic blossom motifs
- **避免**：Gritty industrial sequences
- **叙事效果**：Injects romantic poetry, transience, elegance, or bittersweet symbolism
- **来源类别**：composition.framing.focus
- **Post Count**：853
- **焦点目标**：flowers
- **深度线索**：macro_blossom
- **焦平面**：petal_plane
- **兼容**：plant focus；depth of field；portrait；bokeh
- **互斥**：scenery

### `hair focus`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Framing emphasizing flowing hair strands, elaborate hairstyles, or hair accessories.
- **适用**：Hair brushing, wind blowing hair across the frame, or hair styling beats
- **避免**：Bald characters or full helmet armor
- **叙事效果**：Highlights elegance, sensory tactility, and wind dynamics
- **来源类别**：composition.framing.focus
- **Post Count**：711
- **焦点目标**：hair
- **深度线索**：strand_plane
- **焦平面**：head_silhouette
- **兼容**：portrait；close-up；from behind
- **互斥**：feet only

### `foot focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Camera focused sharply on bare feet or socks/foot placement on the ground.
- **适用**：Stepping out of bed, dipping toes into water, or martial arts footing
- **避免**：Standard conversational dialogue
- **叙事效果**：Draws attention to ground contact, barefoot vulnerability, or martial footing
- **来源类别**：composition.framing.focus
- **Post Count**：33209
- **焦点目标**：feet
- **深度线索**：ground_plane
- **焦平面**：floor_contact
- **兼容**：feet only；lower body；from above
- **互斥**：portrait；headshot

### `leg focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Focus placed on character's legs in motion or standing pose.
- **适用**：Kicking action, walking stride, or showing stockings/leggings
- **避免**：Head-and-shoulder conversational scenes
- **叙事效果**：Emphasizes leg athletics, locomotion, and stance
- **来源类别**：composition.framing.focus
- **Post Count**：584
- **焦点目标**：legs
- **深度线索**：limb_plane
- **焦平面**：lower_body
- **兼容**：lower body；cowboy shot；motion lines
- **互斥**：portrait；headshot

### `mouth focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Tightly focused framing on lips, smile, biting, or speaking mouth.
- **适用**：Whispering secrets, bitter smirks, biting lips in anxiety, or dramatic declarations
- **避免**：Broad overview action shots
- **叙事效果**：Amplifies spoken words, whispered intimacy, or subtle sneers
- **来源类别**：composition.framing.focus
- **Post Count**：350
- **焦点目标**：mouth
- **深度线索**：lip_plane
- **焦平面**：lower_face
- **兼容**：close-up；eyes out of frame；depth of field
- **互斥**：eye focus；feet only

### `ear focus`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Focus placed on animal ears, elf ears, ear piercings, or earrings.
- **适用**：Twitching animal ear reactions, admiring earrings, or elf ear gestures
- **避免**：Standard non-ear-related scenes
- **叙事效果**：Highlights fantasy ear traits or delicate jewelry details
- **来源类别**：composition.framing.focus
- **Post Count**：154
- **焦点目标**：ears
- **深度线索**：ear_plane
- **焦平面**：lateral_head
- **兼容**：portrait；close-up；profile
- **互斥**：feet only

### `cloud focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Focus centered on towering cumulonimbus, fluffy clouds, or storm fronts.
- **适用**：Summer anime nostalgia (thunderheads), weather shifts, or sky contemplation
- **避免**：Indoor scenes
- **叙事效果**：Evokes summer nostalgia, impending storms, or quiet daydreaming
- **来源类别**：composition.framing.focus
- **Post Count**：373
- **焦点目标**：clouds
- **深度线索**：atmospheric_cloud_layer
- **焦平面**：distant_sky
- **兼容**：sky focus；scenery；landscape
- **互斥**：under table；refrigerator interior

### `book focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Focus centered on an open grimoire, novel, library volume, or diary.
- **适用**：Library research, studying ancient spells, or reading love letters
- **避免**：High-speed vehicle chases
- **叙事效果**：Highlights intellectual study, arcane discovery, and quiet scholarship
- **来源类别**：composition.framing.focus
- **Post Count**：379
- **焦点目标**：book
- **深度线索**：page_plane
- **焦平面**：reading_foreground
- **兼容**：object focus；still life；depth of field
- **互斥**：scenery

### `footwear focus`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：1
- **说明**：Focus on shoes, boots, high heels, or specialized footwear.
- **适用**：Lacing boots before battle, admiring new shoes, or heel clicking strides
- **避免**：Barefoot characters or close portraits
- **叙事效果**：Emphasizes sartorial style, martial readiness, and walking stride
- **来源类别**：composition.framing.focus
- **Post Count**：765
- **焦点目标**：footwear
- **深度线索**：shoe_plane
- **焦平面**：floor_contact
- **兼容**：feet only；lower body；foot focus
- **互斥**：portrait；headshot

### `reflection focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Focus sharply dialed onto a reflection in a puddle, mirror, glass, or blade.
- **适用**：Seeing a hidden assassin in a puddle, checking reflection in a sword blade
- **避免**：Direct matte non-reflective environments
- **叙事效果**：Adds poetic indirect observation and layered psychological depth
- **来源类别**：composition.framing.focus
- **Post Count**：2442
- **焦点目标**：reflection
- **深度线索**：reflected_virtual_plane
- **焦平面**：specular_surface
- **兼容**：reflection；depth of field；through window
- **互斥**：scenery

### `text focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：1
- **说明**：Focus sharpened onto written words, signs, smartphone texts, or documents.
- **适用**：Reading shocking news headlines, text message reveals, or warning signs
- **避免**：Textless pure visual action
- **叙事效果**：Delivers direct written narrative information directly to reader
- **来源类别**：production.format.general
- **Post Count**：18558
- **焦点目标**：text
- **深度线索**：typography_plane
- **焦平面**：document_foreground
- **兼容**：book focus；viewer holding phone；depth of field
- **互斥**：scenery

### `blurry background`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：3
- **说明**：Background is rendered soft and out-of-focus, isolating sharp foreground subject.
- **适用**：Separating character from cluttered environments, emphasizing solo monologue
- **避免**：Detailed environment establishing shots where background context is vital
- **叙事效果**：Directs absolute visual focus onto the character and creates photographic depth
- **来源类别**：composition.visual_effect.effect.blur
- **Post Count**：167710
- **焦点目标**：foreground_subject
- **深度线索**：background_defocus
- **焦平面**：shallow_foreground
- **兼容**：portrait；upper body；depth of field；bokeh
- **互斥**：scenery；landscape；very wide shot

### `depth of field`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：3
- **说明**：Cinematic shallow depth of field with distinct sharp focal plane and smooth defocus gradient.
- **适用**：Cinematic storytelling panels, emphasizing spatial layering and photography aesthetic
- **避免**：Flat 2D graphic comic styles or isometric maps
- **叙事效果**：Imparts a high-end cinematic lens aesthetic and realistic optical depth
- **来源类别**：composition.visual_effect.effect.blur
- **Post Count**：118498
- **焦点目标**：focal_subject
- **深度线索**：optical_depth_of_field
- **焦平面**：variable_plane
- **兼容**：blurry background；blurry foreground；portrait；close-up
- **互斥**：isometric

### `blurry foreground`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：3
- **说明**：Foreground objects (leaves, shoulders, frames) are out-of-focus in front of the sharp subject.
- **适用**：Over-the-shoulder framing, peeking through foliage, or layered depth staging
- **避免**：Flat unlayered simple compositions
- **叙事效果**：Enhances three-dimensional depth and voyeuristic perspective
- **来源类别**：composition.visual_effect.effect.blur
- **Post Count**：37898
- **焦点目标**：midground_subject
- **深度线索**：foreground_defocus
- **焦平面**：midground
- **兼容**：over shoulder；behind tree；behind curtains；depth of field
- **互斥**：scenery

### `bokeh`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：3
- **说明**：Aesthetic circular or polygonal luminous blur discs in the out-of-focus background.
- **适用**：Night city lights, festive illuminations, romantic confessions, or magical sparkle
- **避免**：Harsh flat daylight scenes without point light sources
- **叙事效果**：Infuses panels with romantic warmth, glamour, and aesthetic photographic beauty
- **来源类别**：composition.visual_effect.effect.blur
- **Post Count**：9885
- **焦点目标**：point_lights
- **深度线索**：specular_bokeh_blur
- **焦平面**：shallow_foreground
- **兼容**：blurry background；depth of field；portrait；sparkle
- **互斥**：scenery；isometric

### `back focus`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：3
- **说明**：Focus is locked onto the background elements while foreground character remains out-of-focus.
- **适用**：Focusing on someone arriving in the doorway while foreground character is blurred
- **避免**：Standard foreground character dialogue
- **叙事效果**：Shifts dramatic priority to an impending arrival or background development
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：2474
- **焦点目标**：background_element
- **深度线索**：foreground_defocus_shift
- **焦平面**：deep_background
- **兼容**：blurry foreground；depth of field；wide shot
- **互斥**：close-up；portrait

### `blurry edges`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：3
- **说明**：Soft optical blur radiating around the outer perimeter of the frame.
- **适用**：Dreamy recollections, fainting/dizziness spells, or gentle nostalgia
- **避免**：Crisp technical diagrams
- **叙事效果**：Evokes gentle nostalgia, disorientation, or soft romantic atmosphere
- **来源类别**：composition.visual_effect.effect.blur
- **Post Count**：545
- **焦点目标**：center_focal_point
- **深度线索**：peripheral_defocus
- **焦平面**：central_plane
- **兼容**：vignetting；soft focus；flashback
- **互斥**：isometric

### `soft focus`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：3
- **说明**：Gentle, glowing spherical lens diffusion softening all sharp edges across the image.
- **适用**：Heavenly visions, romantic daydreams, fairy tale memories, or glamor shots
- **避免**：Gritty high-contrast tactical action
- **叙事效果**：Wraps the scene in ethereal beauty, tender romanticism, or nostalgic warmth
- **来源类别**：composition.visual_effect.effect.blur
- **Post Count**：267
- **焦点目标**：overall_scene
- **深度线索**：glow_diffusion
- **焦平面**：diffuse_field
- **兼容**：portrait；bloom；sparkle
- **互斥**：scanlines；motion lines


## Camera Effect／动态与光学效果（34 项）

- Scope：`panel`
- Max Selected：`2`
- 组说明：Kinetic shutter motion lines, optical flares, chromatic artifacts, and temporal visual styles.

### `motion lines`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Dynamic speed streaks indicating trajectory and rapid movement.
- **适用**：Dashing, punching, leaping, dodging, or high-speed comic action
- **避免**：Completely stationary quiet dialogue
- **叙事效果**：Injects kinetic energy, velocity, and comic action excitement
- **来源类别**：composition.visual_effect.effect.line_effect
- **Post Count**：98485
- **效果类型**：kinetic_drawing
- **运动动力**：linear_velocity
- **快门／线条风格**：manga_speed_lines
- **兼容**：foreshortening；dutch angle；full body；speed lines
- **互斥**：still life

### `notice lines`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Radial emphasis lines directing reader gaze toward a specific startling point.
- **适用**：Sudden shocking realization, spotting an intruder, or exclamation beats
- **避免**：Subtle quiet background scenes
- **叙事效果**：Punctuate dramatic realization, shock, and sudden awareness
- **来源类别**：composition.visual_effect.effect.line_effect
- **Post Count**：44376
- **效果类型**：attention_guidance
- **运动动力**：radial_shock
- **快门／线条风格**：manga_focus_lines
- **兼容**：emphasis lines；close-up；portrait；cut-in
- **互斥**：scenery

### `emphasis lines`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Dense convergent speed lines radiating inward to highlight a central subject.
- **适用**：High-impact climactic punch, epic power declaration, or comedic shock
- **避免**：Calm conversation
- **叙事效果**：Magnifies dramatic weight and commands explosive visual attention
- **来源类别**：composition.visual_effect.effect.line_effect
- **Post Count**：42155
- **效果类型**：attention_guidance
- **运动动力**：convergent_radiance
- **快门／线条风格**：manga_sunburst_lines
- **兼容**：notice lines；close-up；facing viewer
- **互斥**：scenery

### `motion blur`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Directional photographic optical smear of fast-moving subjects or panning camera.
- **适用**：High-speed chases, evasive flips, sword slashes, or camera whip pans
- **避免**：Static portraits where crisp facial clarity is desired
- **叙事效果**：Imparts physical velocity, realistic kinetic momentum, and cinematic tempo
- **来源类别**：composition.visual_effect.effect.blur
- **Post Count**：31461
- **效果类型**：optical_shutter
- **运动动力**：directional_blur
- **快门／线条风格**：slow_shutter_streak
- **兼容**：motion lines；speed lines；dutch angle
- **互斥**：still life

### `zoom layer`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Radial zoom blur streaks creating an intense snap-zoom effect toward the center.
- **适用**：Dramatic snap-zoom on someone's shocked face or critical incoming threat
- **避免**：Gentle continuous panning
- **叙事效果**：Simulates an explosive optical crash-zoom, amplifying immediate shock
- **来源类别**：composition.visual_effect.effect.line_effect
- **Post Count**：32486
- **效果类型**：lens_movement
- **运动动力**：crash_zoom
- **快门／线条风格**：radial_zoom_streak
- **兼容**：close-up；notice lines；facing viewer
- **互斥**：scenery

### `speed lines`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Dense parallel comic speed lines spanning the background plane.
- **适用**：Sprinting down a hallway, vehicles accelerating, or rushing forward
- **避免**：Stationary peaceful moments
- **叙事效果**：Replaces background scenery with raw kinetic momentum
- **来源类别**：composition.visual_effect.effect.line_effect
- **Post Count**：12838
- **效果类型**：kinetic_drawing
- **运动动力**：parallel_velocity
- **快门／线条风格**：parallel_speed_lines
- **兼容**：motion lines；upper body；full body
- **互斥**：still life

### `screen zoom`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：5
- **说明**：Digital zoom crop simulating a user zooming in on a digital screen or camera feed.
- **适用**：Investigating surveillance photos, magnifying clue details on phone
- **避免**：Non-digital historical scenes
- **叙事效果**：Emphasizes forensic analysis and targeted digital magnification
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：303
- **效果类型**：digital_optical
- **运动动力**：digital_magnification
- **快门／线条风格**：digital_crop_step
- **兼容**：camera feed；close-up；viewfinder
- **互斥**：scenery

### `zooming in`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：5
- **说明**：Dynamic in-camera forward zoom motion moving closer to the subject.
- **适用**：Tightening focus during an emotional revelation or approaching danger
- **避免**：Static wide establishing scenes
- **叙事效果**：Increases emotional tension by pulling reader closer
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：483
- **效果类型**：lens_movement
- **运动动力**：forward_zoom
- **快门／线条风格**：forward_optical_zoom
- **兼容**：zoom layer；close-up
- **互斥**：zooming out

### `zooming out`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：5
- **说明**：Dynamic backward pull-back camera motion revealing surrounding context.
- **适用**：Pulling back to reveal a character is actually surrounded or in vast wilderness
- **避免**：Tight isolated close-ups
- **叙事效果**：Reveals broader spatial reality, creating surprise or sense of isolation
- **来源类别**：composition.framing.arrangement
- **Post Count**：124
- **效果类型**：lens_movement
- **运动动力**：backward_zoom
- **快门／线条风格**：pull_back_optical_zoom
- **兼容**：wide shot；surrounded；negative space
- **互斥**：zooming in

### `scanlines`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Horizontal phosphor raster scan lines simulating a CRT monitor, television, or digital HUD screen.
- **适用**：CCTV surveillance footage, retro gaming displays, sci-fi HUD viewfinders
- **避免**：Pristine historical fantasy art
- **叙事效果**：Renders the image through an authentic electronic screen texture
- **来源类别**：composition.visual_effect.effect.line_effect
- **Post Count**：916
- **效果类型**：electronic_raster
- **运动动力**：raster_lines
- **快门／线条风格**：crt_scanline_grid
- **兼容**：camera feed；fixed-point camera；viewfinder
- **互斥**：soft focus；haze；refraction

### `lens flare`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Optical light scattering and polygonal ghost artifacts caused by direct bright light hitting lens.
- **适用**：Sunny outdoor vistas, dramatic stage lights, explosion flashes, or heroic backlit entrances
- **避免**：Dark dim underground dungeons with no intense point light
- **叙事效果**：Adds cinematic realism, solar brilliance, and heroic photographic flair
- **来源类别**：composition.visual_effect.effect.glow_light
- **Post Count**：45787
- **效果类型**：optical_artifact
- **运动动力**：static_specular
- **快门／线条风格**：optical_glare
- **兼容**：bloom；glint；portrait；wide shot
- **互斥**：night vision

### `glint`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Sharp point-light starburst reflection off a tooth, blade edge, glasses, or eye.
- **适用**：Smirking confident grin, blade glinting before strike, glasses pushing flash
- **避免**：Dull diffuse non-reflective surfaces
- **叙事效果**：Punctuate sharp wit, deadly weapon danger, or anime glasses anime trope
- **来源类别**：composition.visual_effect.effect.glow_light
- **Post Count**：34072
- **效果类型**：specular_sparkle
- **运动动力**：punctual_flash
- **快门／线条风格**：cross_starburst
- **兼容**：close-up；weapon focus；eye focus
- **互斥**：scenery

### `sparkle`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Luminous shimmering glitters, radiant stars, or magical sparkles floating around the subject.
- **适用**：Shoujo romantic introductions, glamorous appearances, or magical awakenings
- **避免**：Gritty grimdark battles
- **叙事效果**：Adds glamour, charm, wonder, and romantic radiance
- **来源类别**：composition.visual_effect.effect.glow_light
- **Post Count**：201142
- **效果类型**：specular_sparkle
- **运动动力**：shimmering_particles
- **快门／线条风格**：glitter_specular
- **兼容**：bloom；bokeh；portrait；diffraction spikes
- **互斥**：night vision

### `sunburst`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Blinding sun flare bursting from behind a character's silhouette or horizon.
- **适用**：Dawn of a new day, heroic backlit arrival, or sunrise climax
- **避免**：Night indoor scenes
- **叙事效果**：Imparts breathtaking awe, triumph, and radiant dawn majesty
- **来源类别**：composition.visual_effect.effect.glow_light
- **Post Count**：4551
- **效果类型**：solar_flare
- **运动动力**：radiant_rays
- **快门／线条风格**：solar_aperture_burst
- **兼容**：lens flare；wide shot；from below
- **互斥**：night vision

### `light trail`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Long-exposure luminous streaks left by fast-moving energy, weapons, or vehicles.
- **适用**：Energy blade swings, magic projectile trajectories, or night traffic speed streaks
- **避免**：Static quiet dialogues
- **叙事效果**：Traces kinetic motion with brilliant luminous velocity
- **来源类别**：composition.visual_effect.effect.glow_light
- **Post Count**：5311
- **效果类型**：shutter_persistence
- **运动动力**：long_exposure_trail
- **快门／线条风格**：light_painting_streak
- **兼容**：motion blur；speed lines；time lapse
- **互斥**：still life

### `reflection`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Specular optical reflection in water, mirrors, polished floors, or glass surfaces.
- **适用**：Mirror scenes, rainy asphalt reflections, water surface reflections, or dual identity motifs
- **避免**：Matte non-reflective environments
- **叙事效果**：Doubles visual presence and adds aesthetic spatial reflection
- **来源类别**：composition.visual_effect.effect.reflection
- **Post Count**：48354
- **效果类型**：specular_reflection
- **运动动力**：mirror_surface
- **快门／线条风格**：optical_specularity
- **兼容**：reflection focus；through window；mirror selfie；against mirror
- **互斥**：scenery

### `sepia`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Warm monochromatic reddish-brown tone evoking antique photographs or historical memories.
- **适用**：Distant historical flashbacks, aged photo mementos, or nostalgic memories
- **避免**：Vibrant modern full-color action
- **叙事效果**：Immediately signals past timeline, nostalgia, and antique memory
- **来源类别**：composition.visual_effect.effect.color_effect
- **Post Count**：9311
- **效果类型**：color_palette_toning
- **运动动力**：warm_monochrome
- **快门／线条风格**：sepia_wash
- **兼容**：flashback；film grain；black border；heavy film grain
- **互斥**：bloom

### `chromatic aberration`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Optical lens color fringing splitting red/cyan or blue/yellow channels at high-contrast edges.
- **适用**：Cyberpunk glitches, digital distress, psychic shock, or extreme wide lens edges
- **避免**：Clean traditional historical watercolor manga
- **叙事效果**：Imparts optical imperfection, sci-fi distortion, or psychic instability
- **来源类别**：composition.visual_effect.effect.color_effect
- **Post Count**：33852
- **效果类型**：color_optical
- **运动动力**：edge_dispersion
- **快门／线条风格**：prism_dispersion
- **兼容**：fisheye；dutch angle；vignetting
- **互斥**：soft focus

### `film grain`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Organic photographic film texture speckles distributed across the image.
- **适用**：Vintage retro aesthetic, gritty noir drama, horror suspense, or cinema feel
- **避免**：Ultra-clean smooth digital anime cel style
- **叙事效果**：Adds tactile film texture, cinematic weight, and gritty analog atmosphere
- **来源类别**：composition.visual_effect.effect.color_effect
- **Post Count**：22649
- **效果类型**：analog_texture
- **运动动力**：stochastic_noise
- **快门／线条风格**：analog_emulsion
- **兼容**：sepia；vignetting；flashback；black border
- **互斥**：scanlines

### `bloom`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Luminous glow bleeding from bright highlights over adjacent darker areas.
- **适用**：Dreamlike sunshine, magical spellcasting, heavenly visions, or radiant beauty
- **避免**：Harsh crisp silhouette noir scenes
- **叙事效果**：Infuses panels with ethereal radiance, divine majesty, and magical luminescence
- **来源类别**：composition.visual_effect.effect.glow_light
- **Post Count**：4910
- **效果类型**：luminescence
- **运动动力**：specular_bleeding
- **快门／线条风格**：photographic_bloom
- **兼容**：lens flare；sparkle；soft focus；portrait
- **互斥**：night vision

### `vignetting`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Gradual darkening toward the corners and edges of the frame.
- **适用**：Claustrophobic mood, horror suspense, tunnel vision shock, or vintage lens look
- **避免**：Bright evenly-lit comedy panels
- **叙事效果**：Focuses reader gaze tightly into center and builds psychological constriction
- **来源类别**：composition.visual_effect.effect.blur
- **Post Count**：2260
- **效果类型**：optical_falloff
- **运动动力**：corner_shadow
- **快门／线条风格**：aperture_shading
- **兼容**：film grain；depth of field；dutch angle；fisheye
- **互斥**：borderless panels

### `haze`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Atmospheric mist, heat shimmer, or smoke softening background contrast.
- **适用**：Scorching summer heat waves, foggy morning mystery, or post-battle smoke
- **避免**：Crisp indoor dialogue
- **叙事效果**：Adds tangible atmospheric temperature, mystery, and environmental depth
- **来源类别**：composition.visual_effect.effect.blur
- **Post Count**：238
- **效果类型**：atmospheric_optical
- **运动动力**：particulate_diffusion
- **快门／线条风格**：atmospheric_haze
- **兼容**：atmospheric perspective；scenery；landscape
- **互斥**：scanlines

### `double exposure`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Two distinct photographic exposures superimposed transparently into a single image.
- **适用**：Character portrait blended with landscape memories, psychological duality, or premonitions
- **避免**：Literal concrete reality storytelling
- **叙事效果**：Creates poetic metaphor, psychological superposition, and surreal artistic resonance
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：904
- **效果类型**：superimposition
- **运动动力**：dual_exposure_blend
- **快门／线条风格**：multi_exposure
- **兼容**：portrait；scenery；flashback
- **互斥**：isometric

### `overexposure`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Extreme brightness blowing out highlight details to pure luminous white.
- **适用**：Emerging from dark cave into blinding sun, flashbang grenades, or nuclear explosion
- **避免**：Standard balanced daylight lighting
- **叙事效果**：Simulates optical blindness, overwhelming radiance, and disorienting shock
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：582
- **效果类型**：luminescence_extreme
- **运动动力**：whiteout
- **快门／线条风格**：sensor_saturation
- **兼容**：bloom；lens flare；facing viewer
- **互斥**：night vision

### `crosshair`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Sniper rifle or targeting reticle overlay centered on the target.
- **适用**：Sniper assassination suspense, missile lock-on, or tactical aiming
- **避免**：Unarmed peaceful scenes
- **叙事效果**：Creates extreme lethal peril, sniper suspense, and tactical target focus
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：779
- **效果类型**：overlay_interface
- **运动动力**：target_lock
- **快门／线条风格**：reticle_overlay
- **兼容**：viewfinder；close-up；weapon focus
- **互斥**：scenery

### `distortion`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：5
- **说明**：Optical or digital warping bending geometric forms in the image.
- **适用**：Psychological hallucination, reality warping magic, or heat waves
- **避免**：Straightforward realistic documentation
- **叙事效果**：Signals mental breakdown, reality disruption, or surreal phenomena
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：1405
- **效果类型**：spatial_warp
- **运动动力**：nonlinear_bending
- **快门／线条风格**：optical_distortion
- **兼容**：fisheye；chromatic aberration；dutch angle
- **互斥**：isometric

### `refraction`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Light rays bending through glass, water, prisms, or crystals causing offset images.
- **适用**：Looking through water glasses, swimming underwater, or crystal magic
- **避免**：Dry non-refractive air
- **叙事效果**：Adds optical elegance, liquid realism, and prismatic light beauty
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：1081
- **效果类型**：optical_artifact
- **运动动力**：ray_bending
- **快门／线条风格**：specular_refraction
- **兼容**：partially underwater shot；depth of field
- **互斥**：scanlines

### `wet lens`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：5
- **说明**：Water droplets or condensation clinging directly to the camera lens surface.
- **适用**：Heavy rainstorms, emerging from pool, ocean splashes, or crying over camera
- **避免**：Dry indoor rooms
- **叙事效果**：Places the camera physically in the harsh weather or wet environment
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：105
- **效果类型**：lens_surface_artifact
- **运动动力**：droplet_adhesion
- **快门／线条风格**：aqueous_lens_obstruction
- **兼容**：from below；partially underwater shot；refraction
- **互斥**：scenery

### `diffraction spikes`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Sharp 4-point or 6-point star spikes radiating from intense point light sources.
- **适用**：Dazzling jewelry, night stars, twinkling gems, or street lamps
- **避免**：Soft diffuse cloudy daylight
- **叙事效果**：Emphasizes dazzling brightness, luxury sparkle, and celestial wonder
- **来源类别**：composition.visual_effect.effect.glow_light
- **Post Count**：5698
- **效果类型**：optical_artifact
- **运动动力**：aperture_diffraction
- **快门／线条风格**：stellar_spikes
- **兼容**：glint；sparkle；bokeh；lens flare
- **互斥**：night vision

### `heavy chromatic aberration`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Severe RGB channel separation producing dramatic red/cyan edge displacement.
- **适用**：System error crashes, glitch art, cybernetic corruption, or intense visual shock
- **避免**：Clean realistic styles
- **叙事效果**：Signals critical technological failure, extreme sensory overload, or digital breach
- **来源类别**：composition.visual_effect.effect.color_effect
- **Post Count**：369
- **效果类型**：color_optical_extreme
- **运动动力**：channel_offset
- **快门／线条风格**：heavy_rgb_split
- **兼容**：chromatic aberration；dutch angle；distortion
- **互斥**：soft focus

### `heavy film grain`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Pronounced, gritty analog grain texture across the whole composition.
- **适用**：Grindhouse film look, dark psychological horror, or aged historical archival photos
- **避免**：Glossy modern digital webtoons
- **叙事效果**：Creates visceral raw grit, archival authenticity, and ominous suspense
- **来源类别**：composition.visual_effect.effect.color_effect
- **Post Count**：231
- **效果类型**：analog_texture_heavy
- **运动动力**：heavy_noise
- **快门／线条风格**：high_iso_grain
- **兼容**：film grain；sepia；flashback
- **互斥**：bloom

### `flashback`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Visual styling indicating a memory or past timeline sequence.
- **适用**：Revealing backstory, childhood memories, or previous narrative events
- **避免**：Present real-time linear storytelling
- **叙事效果**：Clearly demarcates historical retrospection and emotional memory
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：1976
- **效果类型**：narrative_temporal
- **运动动力**：temporal_shift
- **快门／线条风格**：memory_wash
- **兼容**：black border；sepia；film grain；double exposure
- **互斥**：camera feed

### `time lapse`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：5
- **说明**：Visualizing passage of time through shifting light streaks or multi-phase clouds/shadows.
- **适用**：Waiting for hours, day-to-night transitions in one frame, or long journeys
- **避免**：Single instant split-second combat
- **叙事效果**：Compresses the passage of hours or seasons into a single evocative frame
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：324
- **效果类型**：temporal_compression
- **运动动力**：light_trails
- **快门／线条风格**：long_exposure_timelapse
- **兼容**：scenery；landscape；light trail
- **互斥**：close-up

### `night vision`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：5
- **说明**：Monochrome green phosphor or IR glow with scanlines representing night-vision goggles.
- **适用**：Special forces night raids, covert infiltration, or nocturnal monster hunts
- **避免**：Bright daylight scenes
- **叙事效果**：Creates tactical military immersion and tense dark-ops suspense
- **来源类别**：composition.visual_effect.effect.general
- **Post Count**：113
- **效果类型**：electro_optical_sensor
- **运动动力**：green_phosphor_ir
- **快门／线条风格**：nvg_sensor
- **兼容**：viewfinder；vignetting；eyewear view
- **互斥**：bloom；lens flare；sunburst


## Comic Layout／漫画页面格式（21 项）

- Scope：`page`
- Max Selected：`2`
- 组说明：Comic page format, panel grid configuration, reading flow direction, and cover formats.

### `comic`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：6
- **说明**：General comic / manga page format with panel divisions, speech bubble rhythm, and sequential storytelling.
- **适用**：Generating multi-panel comic pages with panels and sequential action
- **避免**：Single standalone full-bleed illustration
- **叙事效果**：Establishes comic medium conventions and sequential reading flow
- **来源类别**：production.format.comic_format
- **Post Count**：655754
- **页面结构**：multi_panel_sequential
- **Panel 数**：variable_multi
- **阅读流向**：comic_sequence
- **兼容**：border；white border；black border；4koma
- **互斥**：tachi-e

### `4koma`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Classic 4-panel vertical gag manga layout following Kishotenketsu structure (Intro, Development, Twist, Punchline).
- **适用**：Four-panel comedic skits, episodic slice-of-life vignettes, or punchline-driven stories
- **避免**：Sprawling non-linear multi-tier graphic novel spreads
- **叙事效果**：Delivers tight four-beat comedic or narrative timing
- **来源类别**：production.format.comic_format
- **Post Count**：111268
- **页面结构**：four_panel_column
- **Panel 数**：4_panels
- **阅读流向**：top_to_bottom
- **兼容**：comic；chibi inset；border；white border
- **互斥**：full page comic；2koma；3koma；5koma；6koma

### `2koma`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Two-panel vertical or horizontal comic layout pairing setup and immediate punchline/reaction.
- **适用**：Before-and-after punchlines, question-and-answer gags, or expectation-vs-reality contrasts
- **避免**：Complex multi-stage long narratives
- **叙事效果**：Provides maximum punchline snappiness and immediate contrast
- **来源类别**：production.format.comic_format
- **Post Count**：42063
- **页面结构**：two_panel_stack
- **Panel 数**：2_panels
- **阅读流向**：setup_punchline
- **兼容**：comic；border；side-by-side
- **互斥**：4koma；3koma；5koma

### `silent comic`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Comic narrative completely devoid of speech bubbles and text dialogue, driven purely by visual action.
- **适用**：Pure visual storytelling, pantomime humor, atmospheric journey, or wordless emotional climaxes
- **避免**：Expository dialogue-heavy legal/detective conversations
- **叙事效果**：Elevates visual language, emotional nuance, and universal readability
- **来源类别**：production.format.comic_format
- **Post Count**：24785
- **页面结构**：textless_sequential
- **Panel 数**：variable
- **阅读流向**：visual_pantomime
- **兼容**：comic；4koma；full page comic
- **互斥**：text focus

### `3koma`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Three-panel comic structure (Setup, Build-up, Punchline).
- **适用**：Three-beat jokes, short transformation sequences, or escalating gag trio
- **避免**：Four-beat traditional Kishotenketsu
- **叙事效果**：Fast-paced three-step narrative progression
- **来源类别**：production.format.comic_format
- **Post Count**：23236
- **页面结构**：three_panel_column
- **Panel 数**：3_panels
- **阅读流向**：top_to_bottom
- **兼容**：comic；border
- **互斥**：4koma；2koma；5koma

### `multiple 4koma`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Page layout featuring two parallel columns of 4koma strips side-by-side.
- **适用**：Standard manga magazine 4-koma publication page (2 strips per page)
- **避免**：Single strip publication
- **叙事效果**：Standard authentic 4-koma tankobon layout
- **来源类别**：production.format.comic_format
- **Post Count**：6399
- **页面结构**：dual_column_4koma
- **Panel 数**：8_panels_dual_strip
- **阅读流向**：right_column_then_left_column
- **兼容**：comic；4koma
- **互斥**：full page comic

### `1koma`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Single-shot cartoon gag or standalone satirical illustration.
- **适用**：Single-shot political cartoon, one-shot gag, or standalone comic punchline
- **避免**：Multi-panel sequential narrative
- **叙事效果**：Packs full humor or thematic punch into a single self-contained frame
- **来源类别**：production.format.comic_format
- **Post Count**：5655
- **页面结构**：single-shot-gag
- **Panel 数**：1_panel
- **阅读流向**：single_glance
- **兼容**：comic；border
- **互斥**：4koma；2koma；3koma；5koma；6koma

### `segmented comic`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Comic page broken into irregularly shaped dynamic panel shards and slashes.
- **适用**：High-octane shonen action battles, shattering emotional moments, or complex battle choreography
- **避免**：Orderly calm comedic 4koma
- **叙事效果**：Accelerates reading tempo and shatters panel rigidity with dynamic diagonal energy
- **来源类别**：production.format.comic_format
- **Post Count**：4538
- **页面结构**：irregular_dynamic_panels
- **Panel 数**：variable_dynamic
- **阅读流向**：dynamic_diagonal
- **兼容**：comic；dutch angle；cut-in
- **互斥**：4koma；square 4koma

### `5koma`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：6
- **说明**：Five-panel comic layout adding an afterword/aftermath reaction panel to the standard four-beat structure.
- **适用**：4koma gag with an extra bonus aftermath reaction beat
- **避免**：Standard 4-panel strictly bounded formats
- **叙事效果**：Allows an extended punchline aftermath or double-twist
- **来源类别**：production.format.comic_format
- **Post Count**：4533
- **页面结构**：five_panel_extended
- **Panel 数**：5_panels
- **阅读流向**：top_to_bottom
- **兼容**：comic；4koma
- **互斥**：1koma；2koma；4koma

### `square 4koma`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Four-panel layout arranged in a 2x2 square grid rather than a single vertical strip.
- **适用**：Square format publications, social media carousels, or four-grid balance
- **避免**：Tall vertical mobile scrolling strips
- **叙事效果**：Provides balanced quadrant reading flow
- **来源类别**：production.format.comic_format
- **Post Count**：3757
- **页面结构**：two_by_two_grid
- **Panel 数**：4_panels_grid
- **阅读流向**：z_pattern_or_n_pattern
- **兼容**：comic；4koma
- **互斥**：vertical comic

### `left-to-right manga`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Western comic reading direction (left to right, top to bottom).
- **适用**：Western comic formats, manhwa/webtoons, or localized graphic novels
- **避免**：Traditional Japanese right-to-left manga
- **叙事效果**：Enforces Western reading order across panels and dialogue bubbles
- **来源类别**：production.format.comic_format
- **Post Count**：2874
- **页面结构**：western_reading_order
- **Panel 数**：variable
- **阅读流向**：left_to_right
- **兼容**：comic；numbered panels
- **互斥**：right-to-left comic

### `manga cover`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Front cover illustration for a manga volume with title logo placement space and dynamic hero art.
- **适用**：Volume cover art, promotional chapter title splash, or magazine cover design
- **避免**：Internal narrative sequential panels
- **叙事效果**：Commands maximum shelf appeal, character charisma, and commercial impact
- **来源类别**：production.format.comic_format
- **Post Count**：2542
- **页面结构**：single_page_cover
- **Panel 数**：1_cover
- **阅读流向**：cover_focal_point
- **兼容**：full body；portrait；bloom；full composition
- **互斥**：4koma；2koma；segmented comic

### `comic cover`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Western style comic book cover illustration featuring dramatic hero action and title framing.
- **适用**：Issue cover art, collector variant covers, or chapter cover pages
- **避免**：Internal dialogue sequences
- **叙事效果**：Creates explosive promotional hook and iconic hero presentation
- **来源类别**：production.format.comic_format
- **Post Count**：1749
- **页面结构**：single_page_cover
- **Panel 数**：1_cover
- **阅读流向**：cover_focal_point
- **兼容**：foreshortening；from below；full body
- **互斥**：4koma；2koma

### `borderless panels`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Panels rendered without black enclosing frame borders, floating directly on the page background.
- **适用**：Poetic introspective sequences, dreamscapes, memory float, or modern airy webtoon layouts
- **避免**：Strict traditional grid layouts
- **叙事效果**：Creates open, limitless, atmospheric flow without rigid boundaries
- **来源类别**：production.format.comic_format
- **Post Count**：1650
- **页面结构**：borderless_bleed
- **Panel 数**：variable
- **阅读流向**：unconstrained_flow
- **兼容**：comic；soft focus；flashback
- **互斥**：border；white border；black border

### `right-to-left comic`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Traditional Japanese manga reading direction (right to left, top to bottom).
- **适用**：Authentic Japanese manga page layouts and traditional tankobon reading flow
- **避免**：Western left-to-right comics
- **叙事效果**：Enforces authentic Japanese manga eye-flow dynamics
- **来源类别**：production.format.comic_format
- **Post Count**：1258
- **页面结构**：traditional_manga_reading_order
- **Panel 数**：variable
- **阅读流向**：right_to_left
- **兼容**：comic；4koma；white border
- **互斥**：left-to-right manga

### `full page comic`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Single illustration occupying the entire page area as a grand narrative beat or splash.
- **适用**：Grand location reveal, emotional climax confession, or epic boss entrance
- **避免**：Rapid multi-panel back-and-forth dialogue
- **叙事效果**：Halts reading tempo for maximum dramatic weight and visual awe
- **来源类别**：production.format.comic_format
- **Post Count**：805
- **页面结构**：single_full_page_splash
- **Panel 数**：1_splash_page
- **阅读流向**：full_page_immersion
- **兼容**：splash page；full composition；wide shot；full body
- **互斥**：4koma；2koma；3koma；multiple 4koma

### `numbered panels`

- **层级**：specialized
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Panel borders clearly labeled with sequential numbers (1, 2, 3...) to guide reading order.
- **适用**：Instructional how-to comics, educational guides, or complex non-standard panel flows
- **避免**：Immersive cinematic graphic novels
- **叙事效果**：Eliminates reading order ambiguity in complex or educational comic layouts
- **来源类别**：production.format.comic_format
- **Post Count**：619
- **页面结构**：numbered_sequential
- **Panel 数**：variable_numbered
- **阅读流向**：explicit_numerical_order
- **兼容**：comic；4koma；left-to-right manga
- **互斥**：borderless panels

### `vertical comic`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Vertical scrolling comic format optimized for mobile webtoons with generous vertical gutters.
- **适用**：Webtoons, smartphone scroll comics, and continuous vertical pacing
- **避免**：Two-page landscape book spreads
- **叙事效果**：Optimizes pacing for downward scroll and mobile reading momentum
- **来源类别**：production.format.comic_format
- **Post Count**：509
- **页面结构**：vertical_scroll_strip
- **Panel 数**：variable_vertical
- **阅读流向**：continuous_vertical_scroll
- **兼容**：comic；column lineup
- **互斥**：panorama；square 4koma

### `6koma`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：6
- **说明**：Six-panel comic strip layout providing room for expanded setup and twin punchlines.
- **适用**：Extended comedic skits requiring deeper character interaction before the punchline
- **避免**：Simple two-beat jokes
- **叙事效果**：Accommodates richer narrative development within a strip format
- **来源类别**：production.format.comic_format
- **Post Count**：471
- **页面结构**：six_panel_column
- **Panel 数**：6_panels
- **阅读流向**：top_to_bottom
- **兼容**：comic；border
- **互斥**：1koma；2koma；4koma

### `panel gag`

- **层级**：specialized
- **可靠度**：medium
- **视觉优先级**：6
- **说明**：Comic structure focused specifically on visual sight gags and slapstick punchlines.
- **适用**：Slapstick humor, sudden funny visual transformations, or comedic punchlines
- **避免**：Serious tragic narrative climaxes
- **叙事效果**：Maximizes comedic timing and sight-gag payoff
- **来源类别**：production.format.comic_format
- **Post Count**：265
- **页面结构**：gag_sequential
- **Panel 数**：variable_gag
- **阅读流向**：slapstick_timing
- **兼容**：comic；4koma；chibi inset
- **互斥**：scenery

### `splash page`

- **层级**：core
- **可靠度**：high
- **视觉优先级**：6
- **说明**：Large, dramatic full-page illustration designed to capture immediate attention and highlight major narrative events.
- **适用**：Chapter opening spreads, dramatic character entrances, or grand climaxes
- **避免**：Casual low-stakes conversation
- **叙事效果**：Maximizes visual grandeur, emotional impact, and artistic spectacle
- **来源类别**：production.format.general
- **Post Count**：1323
- **页面结构**：full_splash
- **Panel 数**：1_splash
- **阅读流向**：central_impact
- **兼容**：full page comic；full composition；wide shot；full body
- **互斥**：4koma；2koma；3koma

---

## 使用要求

- Storyboard 先决定画面任务和自然语言几何，再查询本 Catalog。
- 确认后的 Prompt-ready tags 写入唯一字段 `optional.camera.tags`。
- 生成最终 Prompt 时原样把字段值合并进 `Main`；不复制字段名，不创建 Camera 章节，不写入 `Character N`。
- 读取条目时同时检查 `use_when`、`avoid_when`、`compatible_with` 与 `exclusive_with`。
- 同一角色跨 Panel 的镜头变化不得重置人物、服装、道具和空间状态。
- 用户指定镜头与可见细节发生冲突时，标记 `TODO [CONFLICT]` 并等待选择。
- 未运行实际生成时只能报告 Prompt／Storyboard 检查，不能声称视觉效果已经验证。
