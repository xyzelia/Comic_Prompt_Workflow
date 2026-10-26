# 多 Panel 漫画文字归属

## 支持的文字类型

项目设置名与 Storyboard 记录对应如下：

| `Visible text types` 值 | Storyboard 类型 | 含义 |
|---|---|---|
| `speech-bubble` | Speech | 普通对白气泡 |
| `jagged-speech-bubble` | Speech（注明 jagged） | 喊叫、警报或强烈语气的锯齿气泡 |
| `thought-bubble` | Thought | 思考／内心气泡 |
| `narrator-box` | Caption / Narrator | 旁白或时间说明框 |
| `sound-effect` | SFX | 拟声词和动作／环境声效文字 |
| `prop-text` | Diegetic（prop） | 手机、纸条、书页、卡片等道具文字 |
| `environment-text` | Diegetic（environment） | 招牌、门牌、墙面标识等环境文字 |
| `none` | none | 不要求直接生成画内文字 |
| `all` | 全部以上类型 | 初始化脚本会展开成显式列表 |

多个类型以逗号组合。项目 `project-settings.md` 决定启用哪些类型；未启用或未提供具体内容时，不自行新增。引号中的文字始终保留用户指定的原文和语言。

## Storyboard 记录

```text
**Text**: Speech — Lin — "等等！"
**Text**: Thought — Lin — "不能回头。"
**Text**: Caption — "三天后"
**Text**: SFX — "砰"
**Text**: Diegetic — phone screen — "无信号"
**Text**: none
```

多个文字项用清楚的列表或分号分开，不能丢失说话者、载体或 Panel。

## Prompt 归属

- Speech／Thought 放在对应人物的该次局部 Character Prompt。
- Caption、共享 SFX 和场景文字放在唯一的对应 Panel 表达中；需要角色栏承载时选择最相关的一条，不在多条中重复。
- Main 只声明页面实际存在的文字类型，例如 `speech bubbles`，不把所有文字内容重复到 Main。
- 静默 Panel 不写气泡或文字指令。
- 有文字页面不能同时写 `no text`。

## 原文保护

- 引号中的可见文字逐字保留用户指定原文和语言。
- 不因提示词描述使用英文而翻译引号内内容。
- 不自动修辞、压缩或新增台词。文字过长无法排版时报告用户，提供拆格、拆页或画外排版选项。
- 原文冻结或忠实改编要求优先于外部提示词 Skill 的润色建议。

## 可读性

- 文字位置遵循 Reading Order。
- 气泡不遮挡关键脸部、手势、道具或动作结果。
- 同格多人对白必须能区分说话者。
- 长文字与复杂动作争夺面积时，调整 Layout 或拆 Panel，不靠无限缩小字体。

## 检查

- [ ] 每个文字项有类型、Panel 和归属。
- [ ] 引号内原文未被翻译或改写。
- [ ] 页面级文字类型与实际 Panel 一致。
- [ ] 同一文字没有重复放入多条 Character Prompt。
- [ ] 静默 Panel 没有意外气泡指令。
- [ ] 有文字页面没有 `no text` 冲突。
