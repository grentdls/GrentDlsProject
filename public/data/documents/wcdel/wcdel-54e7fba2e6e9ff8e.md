# Skill Cooldown HUD Sync

## 目标

补齐技能按钮最关键的冷却可读性，让技能 1 不再只有文本状态，而是具备真实冷却计时、遮罩和倒计时文案。

## 本次范围

### 技能运行时冷却

- 扩展 `PlayerSkillController`
- 新增技能槽 1 的独立冷却计时
- 提供 `GetSkillSlotCooldownRemaining`
- 让技能触发时真正进入 `SkillDefinition.CooldownSeconds` 对应的冷却状态

### Canvas HUD 冷却表现

- 扩展 `CombatCanvasHudPresenter`
- 技能 1 按钮新增冷却遮罩层
- 技能 1 按钮新增倒计时文本
- 技能状态优先级调整为 `Locked -> Cooldown -> No Mana -> Global Cooldown / Casting -> Ready`

## 本次不做

- 技能 2~4 的正式冷却闭环
- 正式扇形遮罩、美术图标、按钮弹跳和 Ready 闪光
- 缺蓝抖动、冷却完成音效和升级提示

## 后续建议

1. 把技能 2~4 也接入统一槽位冷却结构。
2. 将当前纵向原型按钮升级为真正的圆形或圆角按钮布局。
3. 为冷却完成补充轻量视觉和音效反馈。
