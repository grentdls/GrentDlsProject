# Combat Canvas HUD Input Bridge Sync

## 目标

让战斗 Canvas HUD 从“只显示状态”推进到“可直接触发最小战斗操作”的阶段，先打通攻击、翻滚、交互和技能 1 的 UI 到角色控制链路。

## 本次范围

### 玩家控制器 UI 入口

- 扩展 `PlayerActorController`
- 新增 `TryUiAttack`
- 新增 `TryUiDodge`
- 新增 `TryUiInteract`
- 新增 `TryUiSkillSlot`

### Canvas HUD 按钮桥接

- 扩展 `CombatCanvasHudPresenter`
- 右下战斗区改为真正的 UGUI `Button` 组件，而不是纯文本块
- 将按钮点击事件绑定到玩家控制器的 UI 行为入口
- 根据当前攻击冷却、翻滚冷却、技能可用状态和可交互目标刷新按钮 `interactable`

## 本次不做

- 移动端摇杆输入
- 技能 2~4 的正式技能定义和可用逻辑
- 正式按钮图标、按压动画、冷却遮罩和无蓝量表现

## 后续建议

1. 把当前纵向列表式按钮布局替换为真正的移动端战斗按钮排布。
2. 为按钮补充图标、冷却遮罩、禁用态和按压反馈。
3. 将按钮状态刷新逐步从 `Update` 轮询改为事件驱动。
