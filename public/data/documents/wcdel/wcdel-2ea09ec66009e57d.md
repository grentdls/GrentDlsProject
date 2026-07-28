# Player Resource And HUD Sync

## 目标

补齐战斗 HUD 最核心的资源读条闭环，让玩家拥有最小可用的 MP 运行时资源，并让技能 1 真正消耗法力、HUD 真正显示 HP / MP 条。

## 本次范围

### 玩家资源运行时

- 新增 `PlayerResourceRuntime`
- 提供最大法力、当前法力、每秒回蓝、可否消耗和实际扣蓝入口
- 保持为轻量原型实现，方便后续替换为更正式的属性/资源系统

### 技能耗蓝接入

- 扩展 `PlayerSkillController`
- 在技能触发前校验法力是否足够
- 在技能实际生效时扣除 `SkillDefinition.ManaCost`
- 提供 `HasEnoughManaForSlot` 给 HUD 查询

### Canvas HUD 读条

- 扩展 `CombatHudDataSource`，暴露 `PlayerResourceRuntime`
- 扩展 `CombatCanvasHudPresenter`
- 左上状态卡新增正式 `HP` 和 `MP` 条
- 技能 1 在法力不足时显示 `No Mana`
- 技能 1 按钮会在法力不足时进入不可点击状态

### 编辑器测试脚手架

- 扩展 `Setup Starter Test Slice`
- 自动给玩家挂接 `PlayerResourceRuntime`
- 自动配置默认法力上限、初始法力和回蓝速度

## 本次不做

- 正式属性系统驱动的法力成长
- 蓝量消耗数字、缺蓝提示动效、冷却遮罩
- 技能 2~4 的正式法力闭环

## 后续建议

1. 把 `PlayerResourceRuntime` 并入后续正式属性/战斗资源系统。
2. 给技能按钮补充缺蓝闪烁、冷却扇形遮罩和图标表现。
3. 在世界空间玩家血条侧同步补 `MP` 或护盾层展示。
