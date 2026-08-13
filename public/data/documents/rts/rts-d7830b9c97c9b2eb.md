# HUD 预制体开发规则

## 目标

战斗 HUD 统一从 `MainHudRoot_Prefab` 开始。所有固定可见 UI 的位置、大小、锚点、图片、颜色、字体和静态文字都在 Prefab 内调整；代码只负责找节点、挂控制脚本、写动态数据、绑定点击事件、控制显隐和必要动效。

本项目不再保留旧 UI、默认 UI、保底可见 UI 或可调整/默认两套规则。可见 HUD 只允许来自现行 Prefab。

## 总结构

```text
MainHudRoot_Prefab
  TopLayer_ResourcesAndStatus
    TopStatusBar -> ResourceHud_Prefab
    ObjectiveHintPanel -> ObjectiveHintPanel_Prefab
    MinimapCanvas -> MinimapCanvas_Prefab
    InGameSettingsButton
  LeftLayer_SelectionAndCommands
    SelectionPanel -> SelectionPanel_Prefab
    HeroHudPanel -> HeroHudPanel_Prefab
  RightLayer_MinimapAndAlerts
    CombatAlertFeed -> CombatAlertFeedPanel_Prefab
  CenterLayer_ContextPanels
    SurvivalTaskPanel -> SurvivalTaskPanel_Prefab
  ContextLayer_AdvancedPanels
    BuildDevelopmentRoot -> BuildDevelopmentRoot_Prefab
    BuildingUnitProductionWindow
      ProductionDimBackground
      ProductionPagePanel
        NavHeader
        StandaloneUnitProductionPanel -> UnitProductionPanel_Prefab
    TechTreeRoot -> TechTreeRoot_Prefab
  MobileLayer_TouchControls
    MobileUnitActionOverlay -> MobileUnitActionOverlay_Prefab
    MobileSkillCancel -> SkillTargetPreview_Prefab
  OverlayLayer_ModalsAndTooltips
    BattleAlertCanvas -> BattleAlertCanvas_Prefab
      DamagePopupItems -> DamagePopupItem_Prefab
    InGameSettingsRoot -> InGameSettingsRoot_Prefab
    ResourceTooltip -> ResourceTooltip_Prefab
    OperationDetailCard -> OperationDetailCard_Prefab
```

## 运行时规则

1. `GameUI.EnsureMainHudPrefabSlots()` 只负责找到 `MainHudRoot_Prefab` 和七个层级，不负责重新摆 UI。
2. `ResolveHudModuleHost()` 和 `ResolveExistingHudModuleHost()` 只复用 `MainHudRoot_Prefab` 内同名模块；固定模块缺失时记录错误并返回空值，不得实例化替代模块。
3. 模块根必须挂 `UiPrefabSlot`；`UiPrefabSlot` 是唯一 Prefab 标记组件。
4. 已存在的模块根直接挂控制脚本，例如 `SelectionPanel`、`BuildingUnitProductionWindowUI`、`TechTreePanelUI`，不得再套第二层运行时壳。
5. Prefab 缺失或固定节点缺失时，只允许记录错误、隐藏对应区域或创建非可见逻辑宿主，不允许生成替代可见旧 UI。

## HUD 显隐与射线规则

1. `MainHudRoot_Prefab` 只能在 `GameState.Playing` 和 `GameState.Paused` 显示；主界面、关卡选择、图鉴、设置、结算等非战斗状态必须 `alpha=0`、`interactable=false`、`blocksRaycasts=false`。
2. HUD 可见时，`MainHudRoot_Prefab` 的 CanvasGroup 可以允许子节点接收点击，但根节点自身和七个 Layer 的 `Image.raycastTarget` 必须关闭。
3. 透明或全屏容器不允许拦截战场点击，包括七个 Layer、`SelectionPanel` 总壳、`MinimapCanvas`、`BattleAlertCanvas`、`InGameSettingsRoot`、`BuildDevelopmentRoot`、`TechTreeRoot`。
4. 只有实际可交互对象可以接收射线：`Button`、`Toggle`、`Slider`、`Dropdown`、`ScrollRect/Viewport`、打开状态的面板背景、资源 Tooltip 触发区、小地图 `MapContent`。
5. 如果需要整屏拦截，必须使用打开状态下的显式 `Dim` / `Backdrop` 节点，并在关闭时恢复 `blocksRaycasts=false`。
6. 伤害跳字必须挂在 `MainHudRoot_Prefab/OverlayLayer_ModalsAndTooltips/BattleAlertCanvas` 下，条目通过 `DamagePopupItem_Prefab` 对象池实例化；不得创建 `DamagePopupOverlayCanvas` 等运行时可见 Canvas。
7. 头顶血条和技能呼叫气泡必须复用 `MainHudRoot_Prefab/OverlayLayer_ModalsAndTooltips` 现有 Canvas 宿主；不得创建 `WorldHudCanvas`、`SkillCalloutCanvas` 等运行时可见 Canvas。

## 子模块规则

### 选择面板

```text
SelectionPanel_Prefab
  UnitBuildingInfoPanel_Left -> SelectionInfoPanel_Prefab
  UnitBuildingActionPages_RightContainer -> SelectionActionPanel_Prefab
    BuildingTechTreePage_Standalone -> SelectionBuildingTechTreePage_Prefab
    BuildingUnitProductionPage_Standalone -> SelectionBuildingProductionPage_Prefab
    BuildingControlPage_Standalone -> SelectionBuildingControlPage_Prefab
```

- `SelectionPanel` 总壳不拦截点击。
- `UnitBuildingInfoPanel_Left` 和 `UnitBuildingActionPages_RightContainer` 的位置、大小、基础图片和静态节点都由 Prefab 决定。
- 代码只写单位/建筑数据、技能状态、Buff 状态、编队状态、按钮显隐和点击事件。

### 小地图

```text
MinimapCanvas_Prefab
  MinimapPanel -> MinimapPanel_Prefab
    MatchTimeBadge -> MinimapTimeBadge_Prefab
    MinimapZoomButton -> MinimapZoomButton_Prefab
    MapContent -> MinimapMapContent_Prefab
      TerrainPreview -> MinimapTerrainPreview_Prefab
      MinimapFogOverlay -> RawImage
```

- `MinimapCanvas` 和 `MinimapPanel` 不拦截战场点击。
- `MapContent` 保留 `raycastTarget=true`，用于点击/拖动跳转视角。
- 小地图点位、路线、预警 ping、摄像机框和地形像素刷新属于动态数据。

### 建造、造兵、科技

- 建造页、造兵页、科技树页默认位于屏幕中下方或 Prefab 指定位置，最终位置以 Prefab 为准。
- `BuildDevelopmentRoot` 只保留建造放置确认 overlay，不再承载旧完整建造列表。
- 普通建造列表走 `SelectionBuildingProductionPage_Prefab`。
- 造兵列表走 `SelectionBuildingProductionPage_Prefab` 或 `UnitProductionPanel_Prefab`。
- 科技树走 `SelectionBuildingTechTreePage_Prefab` 或 `TechTreeRoot_Prefab`。
- `BuildButton_Prefab`、`BuildingProductionButton_Prefab`、`ResearchButton_Prefab` 必须提供 `Icon`、`Label`、`CostRow` 和状态层；代码只写图标、文本、费用、进度、可用状态和点击事件。

### 多选与编队

- 多选头像条必须在 `SelectionPanel_Prefab/MultiPortraitBar` 内完成，动态头像条目挂到 `MultiPortraitContent/PortraitList`。
- 编队快捷条必须在 `SelectionPanel_Prefab/GroupShortcutBar` 内完成，动态编队条目挂到 `GroupShortcutContent/GroupShortcutList`。
- 编队选择弹层和管理弹层分别是 `SelectionPanel_Prefab/GroupPickerPanel`、`SelectionPanel_Prefab/GroupManagePanel`。
- 动态条目只允许代码控制数量、排序、显隐、数据和点击/长按事件；条目自身静态结构必须来自 Prefab。

### Buff 与详情

- Buff 图标使用 `SelectionBuffIcon_Prefab`，必须提供图标、持续时间进度、层数和增益/减益表现节点。
- Buff 详情使用 `SelectionBuffDetailsPanel_Prefab`，悬浮或长按时显示，关闭时不得拦截战场点击。
- 代码只写 Buff 名称、类型、效果、逻辑说明、剩余时间、层数和显隐状态。

## 禁止项

- 不得恢复 `MobileActionBar_Prefab`、`MobileActionButton_Prefab` 或旧移动动作条层级。
- 不得恢复 `UiScreenLayoutConfig.asset`、`UiLayoutBinding`、运行时 layout override 或 preserve 开关策略。
- 不得为了修布局在代码里给 Prefab 根强行设置 `anchorMin`、`anchorMax`、`anchoredPosition`、`sizeDelta`。
- 不得创建可见的旧 `Image/Mask/ScrollRect` 面板来替代缺失 Prefab。
- Prefab 可见 Text 不得写 `GenericPanel`、`WorldHudItem`、`世界HUD`、`类型：`、`用途：`、`Prefab模板`、`可绑定数据`。

## 检查命令

```powershell
dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false
dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false
rg -n "GenericPanel|WorldHudItem|世界HUD|Prefab模板|可绑定数据|用途：|类型：" Assets/Resources/UI/Prefabs -g "*.prefab"
rg -n "UiLayoutBinding|UiScreenLayoutConfig|UiRuntimeLayoutApplier|UiRuntimePrefabInstance|ShouldPreserveLayout|ShouldPreserveStyle|preservePrefabLayout|preservePrefabStyle|ApplyConfiguredLayout|MobileActionBar_Prefab|MobileActionButton_Prefab" Assets/Scripts Assets/Resources/UI docs/UI
```

## 修改入口

- 调整全局 HUD 层级：改 `MainHudRoot_Prefab`。
- 调整模块内部布局：改对应子 Prefab。
- 调整统一皮肤：改 `Assets/Resources/UI/Skins/WarfareClassic/` 或具体 Prefab 图片。
- 新增可见 UI：先补 `UiPrefabType`、`UiPrefabWorkflowGenerator`、`UiPrefabLibrary.asset` 和文档，再接入运行时数据绑定。

## 2026-07-23 战斗 HUD 全量重置补充

1. `MainHudRoot_Prefab` 是战斗 HUD 唯一总根。只有 `GameManager.EnsureRuntimeHud()` 可以实例化它；`GameUI` 必须挂在该 Prefab 根上，找不到根时记录错误并停用，不得再创建第二份 HUD 根。
2. 固定面板、固定文字、固定按钮、滚动区、装饰节点和控制脚本必须由生成器写入 Prefab。运行时只查找现有节点、写入动态数据、绑定事件和控制显隐；固定结构缺失时记录错误并停用对应模块。
3. 动态列表只能克隆隐藏模板或通过 `UiPrefabResolver` 实例化专用条目 Prefab。允许运行时创建的对象仅限小地图点位/路线、科技连接线、世界坐标 HUD、伤害跳字、技能表现、行为转发器、`ResearchQueue`/`ProductionQueue` 数据组件等动态对象。
4. `MinimapMapContent_Prefab/MinimapFogOverlay` 是固定 `RawImage` 节点。`MinimapFogRenderer` 只绑定并刷新该节点，不得运行时创建雾层 GameObject；该控制器必须使用独立同名脚本以确保 Unity 能序列化到 `MinimapCanvas_Prefab`。
5. 生成器入口 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs` 必须在保存后校验根组件、固定层级、滚动区、隐藏模板和控制组件。校验失败不得报告成功。

## 建筑详情/生产面板固定结构

`BuildingProductionPanel_Prefab` 与 `BuildingDetailsPanel_Prefab` 必须同时提供以下固定节点和组件：

```text
BuildingHeader
  BuildingIconFrame / BuildingIcon
  BuildingTitle / BuildingStatus
  BuildingTags/FactionTag/Label
  BuildingTags/EraTag/Label
  CloseButton
BuildingDetailsScroll (ScrollRect)
  Viewport (RectMask2D)
    Content (VerticalLayoutGroup + ContentSizeFitter)
      QuickOperationCard
      DescriptionCard/BuildingDescription
      StatsCard/BuildingStats
      FunctionCard/BuildingFunctions
      UpgradeCard/UpgradeStatus
BuildingActionBar (ScrollRect)
  ActionViewport
    ActionButtons
FixedUpgradeBar
  UpgradeTitle / UpgradeCost
  FixedUpgradeButton
```

`BuildingProductionUI` 只绑定这些节点并写入动态数据、状态和事件；节点或组件缺失时必须停用面板，不得在运行时创建可见替代节点。
