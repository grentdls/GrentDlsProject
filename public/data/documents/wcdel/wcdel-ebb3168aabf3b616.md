# Backend Menu MVP Foundation Sync

## 目标

为项目补齐第一个可运行的后台菜单基础层，让玩家能够在测试场景中通过 `Pause / Esc` 或 HUD 菜单按钮打开独立的后台菜单 Canvas，并在不破坏现有战斗 HUD 的前提下完成暂停、页签切换、数据查看和返回游戏。

## 本次范围

### 后台菜单基础层
- 新增 `BackendMenuCanvasPresenter`
- 运行时动态搭建独立的 `Canvas_Menu` 菜单层
- 支持 `Character / Equipment / Skill / Quest / Map / Settings` 六个主页面
- 支持顶部标题、金币显示、返回按钮、继续游戏按钮和底部提示栏

### 暂停与恢复

- 将 `PlayerActorController` 的 `Pause` 输入桥接到后台菜单切换
- 打开菜单时：
  - 缓存当前 `GameSession.FlowState`
  - 切换到 `GameFlowState.Paused`
  - 停止命中停顿残留
  - 设置 `Time.timeScale = 0`
- 关闭菜单时：
  - 恢复缓存的流程状态
  - 设置 `Time.timeScale = 1`

### 多端入口预留

- 保留 `Esc / Pause` 键盘和手柄语义入口
- 在 `CombatCanvasHudPresenter` 里新增 `Menu` 按钮，作为移动端菜单入口占位
- 菜单本体继续复用 `SafeAreaLayoutFitter`
- 当前测试切片中，战斗 HUD 顶部按钮已调整为更直接的 `Bag` 入口，点击后会直接打开后台菜单的 `Equipment` 页，方便优先体验背包 / 装备闭环
- `GameInputReader` 额外保留 `Escape` 作为暂停菜单兜底按键，即使 InputAction 资源未正确绑定也能进入后台菜单

### 现有运行时数据复用

- 角色页读取 `GameSession`、`CombatHudDataSource`、`Health`、`PlayerResourceRuntime`、`Combatant`
- 技能页读取 `PlayerSkillController` 和 `PlayerRuntimeData.LearnedSkillIds`
- 任务页读取 `GameSession.ActiveQuestIds`、`QuestRuntimeState`、`QuestDefinitionRegistry`
- 地图页读取 `MapRuntimeData`
- 不新建第二套会话或 UI 数据通道

### 第二阶段补充

- 扩展 `PlayerRuntimeData`，补充当前已装备槽位和 `SkillSlot1` 运行时字段
- 扩展 `GameSession`，补充：
  - `TryEquipItem`
  - `TryAssignSkillSlot1`
  - 当前装备和技能的解析入口
- 扩展 `Combatant`，增加 `OverrideStats`，让后台菜单换装能真正回写角色战斗属性
- 后台菜单 `Equipment` 和 `Skill` 页升级为可操作页：
  - `Prev / Next / Apply` 切换候选
  - 应用后立即同步 `GameSession`、`PlayerSkillController` 和战斗 HUD
- 扩展编辑器脚手架，新增第二个测试技能和多件测试装备，保证菜单里有真实候选项

### 编辑器脚手架同步

- 扩展 `Setup Starter Test Slice`
- 自动创建：
  - `Canvas_Menu`
  - `SafeAreaRoot`
  - `BackendMenuHUD`
- 让测试场景默认同时具备战斗 HUD 和后台菜单入口

## 当前边界

- 装备页、技能页现在已经支持最小 `Prev / Next / Apply` 闭环，但仍不是最终正式背包式布局
- 设置页当前只展示分类摘要，未接真实音量、画质、按键保存逻辑
- 还未接入存档页、主菜单页、死亡页、确认弹窗和商店详情页
- 菜单 UI 仍以代码动态构建为主，后续应迁移到正式 Prefab

## 后续建议

1. 把 `Equipment` 页从按钮式切换升级成正式槽位列表、对比面板和背包来源。
2. 把 `Skill` 页扩展为 4 槽位技能配置页，并补技能升级和锁定条件显示。
3. 接入通用确认弹窗和存档页，为“返回标题 / 读取 / 覆盖”做统一保护。
4. 将后台菜单页拆成独立组件，减少单个 Presenter 的职责膨胀。

## 2026-05-15 - Skill Slot 1~4 Extension

### Scope
- Extended `PlayerRuntimeData` with equipped ids for skill slots 2, 3 and 4.
- Extended `GameSession` with generic assign and resolve helpers for skill slots 1~4 while keeping slot 1 compatibility methods.
- Extended `PlayerSkillController` so slots 1~4 each have independent assigned definition and cooldown tracking.
- Updated `CombatCanvasHudPresenter` to display and refresh assigned state for all four skill buttons instead of hardcoded locked text.
- Updated `BackendMenuCanvasPresenter` skill page to support selecting a target slot first, then cycling candidate skills and applying to that slot.

### Notes
- The menu still uses the current MVP two-row control pattern instead of a final grid layout.
- Cooldown mask visuals remain implemented only for the first skill button, but runtime cooldown state now exists for all four slots.
- This iteration continues to reuse `GameSession + PlayerRuntimeData + CombatHudDataSource + PlayerSkillController` without introducing a second UI data path.

## 2026-05-15 - Equipment Compare And HP MP Sync

### Scope
- Upgraded the backend equipment page text summary with explicit current item, candidate item and stat delta comparison lines.
- Extended equipment application so `BonusHp` and `BonusMp` now flow into runtime player `Health` and `PlayerResourceRuntime`, not only combat attack/magic/armor stats.
- Added minimal runtime max-value update APIs that preserve current HP/MP ratio when equipment changes.

### Notes
- This remains a lightweight MVP comparison panel, not the final inventory grid or card layout.
- Equipment bonuses still come from the current bootstrap-owned candidate list and not a full backpack source yet.
- Runtime stat application continues to stay centralized in the backend menu sync path instead of introducing a second attribute pipeline.

## 2026-05-17 - Settings Key Binding Summary

### Scope
- Expanded the settings page content from a short placeholder into graphics, audio, controls, key binding and language sections.
- Added visible default input mapping summaries for keyboard / mouse, gamepad and mobile controls.
- Reused the existing settings control row as a key binding configuration entry point while keeping the language toggle action available.

### Notes
- This pass intentionally does not save runtime Input System rebinding overrides yet.
- The settings page is now ready for a later dedicated rebinding workflow without changing the menu page structure again.
