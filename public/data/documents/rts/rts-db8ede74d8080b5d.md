# 游戏内 UI 预制体化规范

## 目标

所有可见 UI 只遵循一套 Prefab 规则。位置、大小、锚点、图片、颜色、字体和静态初始文字全部放在 Unity Prefab/Inspector 内调整；代码只负责实例化、查找固定子节点、刷新动态数据、绑定点击逻辑、控制显隐和播放必要动效。

Canvas、EventSystem、动态列表 Content、Scrollbar Handle、运行时音源、世界坐标点、伤害跳字和临时特效可以由代码创建或驱动。面板、按钮、卡片、行、提示条和 HUD 模块必须优先走 `UiPrefabResolver`。

## 目录规范

```text
Assets/Resources/UI/
  Configs/
    UiPrefabLibrary.asset
    PanelMotion_Default.asset
    ButtonMotion_Default.asset

  Prefabs/
    Pages/        整页根节点：主界面、关卡选择、图鉴、结算、加载、整页 HUD 根
    InGame/       战斗 HUD、选择面板、建造、生产、科技、小地图、世界 HUD
    Components/   按钮、卡片、行、跳字、气泡、弹窗、提示条、列表组件
  Skins/
    WarfareClassic/  统一战争风格 UI 皮肤贴图
```

新增 UI 必须先加入 `UiPrefabType`，再通过 `UiPrefabWorkflowGenerator` 生成或维护 Prefab。Prefab 根节点必须挂：

```text
UiPrefabSlot
```

## 统一皮肤资源

当前默认运行时皮肤为 `Assets/Resources/UI/Skins/WarfareClassic/`。它提供深色石质面板、金色边框按钮、半透明信息带、卡片框、圆形命令按钮、资源牌和高光框，用来贴近东方/战争 RTS 参考风格。

- 运行时动态实例通过 `UiVisualPolishUtility` 读取 `Resources/UI/Skins/WarfareClassic`，给面板、按钮、卡片、资源条和移动圆形按钮补统一皮肤。
- 已经在 Prefab/Inspector 中手动设置过 `Image.sprite` 的节点不会被运行时替换；如果节点保留样式但没有 sprite，运行时只补缺失皮肤，不覆盖颜色、位置和缩放。
- 后续重建 prefab 时，`UiPrefabWorkflowGenerator` 会给面板、按钮、卡片类节点默认挂 WarfareClassic 皮肤；图标、进度条、遮罩、Glow、Viewport、Content 等功能节点不会自动套面板皮肤。
- 调整位置、缩放、锚点只改 Prefab；调整通用质感、按钮框和资源牌优先改 `WarfareClassic` 贴图或具体 Prefab 图片。

## 统一交互反馈

所有可交互 UI 只使用 `UiPressFeedback` + `UiMotionConfig` 这一套反馈规则。`UiPrefabResolver` 实例化 Prefab 后会给子级 `Selectable` 自动补齐悬停、按下、选中、禁用和拖拽反馈；动态按钮和卡片继续调用 `EnsurePressFeedback()`。详细数值与状态规范见 `docs/UI/UI交互反馈规范.md`。

- 反馈动画只改局部 `localScale`、根 `Graphic.color`、根 `Outline/Shadow`，不改布局尺寸、锚点或图片资源。
- 位置、缩放、图片更换仍以 Prefab/Inspector 为准；反馈组件在空闲态会收养外部对颜色和缩放的调整。
- 不允许为按钮、卡片、页签再新增第二套平行 hover/click 动画系统。

## 当前硬规则

1. Prefab 内禁止显示模板说明文字。
   - `Title`、`Label`、`Description`、`UsageNote` 不能写 `GenericPanel`、`WorldHudItem`、`xxxPanel`、`可绑定数据`、`类型：...用途：...`。
   - 需要给策划/美术看的说明写在本文档或 Inspector Tooltip，不写进运行时 Text。
2. 模块级 Prefab 是布局和样式唯一来源。
   - 挂有 `UiPrefabSlot` 的节点视为 Prefab 拥有节点；代码不得覆盖锚点、位置、大小。
   - 挂有 `UiPrefabSlot` 的节点视为 Prefab 拥有样式；代码不得覆盖图片、颜色、字体等基础样式。
   - 运行时只写动态数据，例如资源数值、血量填充、倒计时、按钮可用状态、列表内容。
3. 允许动态驱动的例外必须明确。
   - 伤害跳字、技能气泡、世界坐标 HUD 根位置、单位头顶 HUD、战场边缘闪烁、建造放置预览、技能目标预览、小地图点位和路线等，位置或数值需要跟随世界/动画更新。
   - 这些对象也可以做 Prefab，但只把可调外观、固定子节点和基础尺寸放进 Prefab。
4. Prefab 缺失时不得生成替代可见 UI。
   - 如果 Prefab 存在，运行时不得再生成一套旧 UI 覆盖它。
   - 如果 Prefab 缺失或固定节点缺失，只允许记录错误、隐藏对应区域或创建非可见逻辑宿主。

## 固定绑定节点

Prefab 内这些节点名不要随意改名，代码会按名字查找：

```text
Background
Header
Title
Subtitle
Icon
Label
Value
Content
Viewport
ScrollContent
Close
CloseButton
ConfirmButton
CancelButton
ProgressFill
CooldownFill
StateRing
LockMark
CostRow
Template
Tags
Sections
FactionBorder
Power
Tail
Placeholder
Text
Fill
Track
Handle
```

复杂 Prefab 后续优先加 View 组件暴露引用；小按钮、跳字、气泡、筛选条可以继续使用固定节点名绑定。

## 已模块化范围

主界面与关卡：

```text
MainMenuRoot_Prefab
MainMenuHomePage_Prefab
MainMenuTopBar_Prefab
MainMenuFooter_Prefab
MainMenuModeCard_Prefab
MainMenuQuickActionPanel_Prefab
MainMenuOptionRow_Prefab
MainMenuSaveRow_Prefab
MainMenuSlider_Prefab
LevelSelectPage_Prefab
LevelCard_Prefab
LevelSelectButton_Prefab
CampaignMapNode_Prefab
CampaignMapRoute_Prefab
```

主菜单设置列表规则：

- 固定页面 prefab 中已经预置的行节点，可以在页面 prefab 内直接调整位置和大小。
- 竞技/生存设置页等运行时动态生成的 `Row_*`，根节点由代码按列表顺序排列；`MainMenuOptionRow_Prefab` 只负责行内背景、Label、Value、说明文字等结构和样式。
- `Next / Minus / Plus / Toggle / Rename` 等行内按钮必须使用 `MainMenuButton_Prefab`，不能把整行 prefab 当按钮用。

图鉴：

```text
CodexPage_Prefab
CodexSearchBox_Prefab
CodexFilterPanel_Prefab
CodexFilterChip_Prefab
CodexTabButton_Prefab
CodexEntryCard_Prefab
CodexPreviewPanel_Prefab
CodexDetailPanel_Prefab
CodexDetailCard_Prefab
```

设置：

```text
SettingsPanel_Prefab
SettingsRow_Prefab
MainMenuSlider_Prefab
InGameSettingsRoot_Prefab
InGameSettingsTab_Prefab
InGameSettingsOptionRow_Prefab
InGameSettingsSlider_Prefab
InGameSettingsSaveRow_Prefab
InGameSettingsContentPanel_Prefab
InGameSettingsFooter_Prefab
InGameSettingsScrollView_Prefab
```

战斗 HUD：

```text
MainHudRoot_Prefab
ResourceHud_Prefab
ResourceChip_Prefab
ResourceDeltaText_Prefab
ResourceTooltip_Prefab
MinimapCanvas_Prefab
MinimapPanel_Prefab
MinimapTimeBadge_Prefab
MinimapMapContent_Prefab
MinimapTerrainPreview_Prefab
AlertBanner_Prefab
CombatStatusPanel_Prefab
CombatFeedEntry_Prefab
BattleEdgeFlash_Prefab
ObjectiveHintPanel_Prefab
HeroHudPanel_Prefab
HeroHudRow_Prefab
SurvivalTaskPanel_Prefab
SurvivalTaskCard_Prefab
SurvivalTaskButton_Prefab
WorldHudItem_Prefab
```

`MainHudRoot_Prefab` 是战斗 HUD 唯一总根。战斗内固定 UI 必须放进它的分层结构中：

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
      ProductionPagePanel
        StandaloneUnitProductionPanel -> UnitProductionPanel_Prefab
    TechTreeRoot -> TechTreeRoot_Prefab
  MobileLayer_TouchControls
    MobileUnitActionOverlay -> MobileUnitActionOverlay_Prefab
    MobileSkillCancel
  OverlayLayer_ModalsAndTooltips
    BattleAlertCanvas -> BattleAlertCanvas_Prefab
    InGameSettingsRoot -> InGameSettingsRoot_Prefab
    ResourceTooltip -> ResourceTooltip_Prefab
```

总 HUD 只负责分层和模块槽位。子模块的细节继续拆成小 Prefab，不允许回退成“代码生成一整块 UI”。

移动端战斗 HUD 的设置入口同样使用 `TopLayer_ResourcesAndStatus/InGameSettingsButton`，固定停靠右上角；已删除的旧移动动作条不得在生成器或主 HUD 中恢复。小地图模块根 `MinimapCanvas` 固定放在 `TopLayer_ResourcesAndStatus`，内部 `MinimapPanel` 在 `MinimapCanvas_Prefab` 中控制左上角位置。

HUD 显隐和点击规则：

```text
非战斗状态(MainMenu/Victory/GameOver等)
  MainHudRoot_Prefab CanvasGroup: alpha=0, interactable=false, blocksRaycasts=false

战斗状态(Playing/Paused)
  MainHudRoot_Prefab CanvasGroup: alpha=1, interactable=true, blocksRaycasts=true
  MainHudRoot 与各 Layer 的 Image.raycastTarget=false
  透明容器/模块壳 Image.raycastTarget=false
  只有按钮、ScrollRect、打开面板、资源 Tooltip 触发区、小地图 MapContent 接收射线
```

不得让这些节点拦截战场点击：`MainHudRoot_Prefab`、七个 Layer、`SelectionPanel` 总壳、`MinimapCanvas`、`BattleAlertCanvas`、`InGameSettingsRoot`、`BuildDevelopmentRoot`、`TechTreeRoot`。如果需要整屏拦截，必须是打开状态下的显式 Dim/Backdrop 节点，并由对应 UI 控制器在关闭时恢复 `blocksRaycasts=false`。

选择与操作：

```text
SelectionPanel_Prefab
SelectionInfoPanel_Prefab
SelectionActionPanel_Prefab
SelectionBuildingTechTreePage_Prefab
SelectionBuildingProductionPage_Prefab
SelectionBuildingControlPage_Prefab
SelectionProgressRow_Prefab
SelectionAttributeCard_Prefab
SelectionGroupBar_Prefab
SelectionGroupPanel_Prefab
SelectionBuffBar_Prefab
SelectionBuffIcon_Prefab
SelectionBuffDetailsPanel_Prefab
SelectionCatalogViewport_Prefab
SelectionCatalogContent_Prefab
UnitCommandButton_Prefab
SkillButton_Prefab
MobileCommandBar_Prefab
MobileCommandButton_Prefab
MobileUnitControlBar_Prefab
MobileUnitActionOverlay_Prefab
OperationDetailCard_Prefab
```

`ContextLayer_AdvancedPanels` 只放当前仍有运行时入口的高级页面：`BuildDevelopmentRoot`、`BuildingUnitProductionWindow`、`TechTreeRoot`。`BuildMenuPanel` 和 `BuildingProductionPanel` 是历史兼容资源，不再挂入主 HUD，不允许运行时创建空面板或旧滚动列表。

`SelectionPanel_Prefab` 的固定结构：

```text
SelectionPanel_Prefab
  UnitBuildingInfoPanel_Left -> SelectionInfoPanel_Prefab
    HeaderArea
      PortraitFrame_Unified
        PortraitIcon
        PortraitBadge
        PortraitFaction
      HeaderTitle
      HeaderSubtitle
    HPMPArea
      HealthText
    AttributeArea
      AttributeText
    DetailTextArea
      ExtraInfoText
  UnitBuildingActionPages_RightContainer -> SelectionActionPanel_Prefab
    RightActionArea
      ActionHint
      UpgradeInfoText
    BuildingTechTreePage_Standalone -> SelectionBuildingTechTreePage_Prefab
    BuildingUnitProductionPage_Standalone -> SelectionBuildingProductionPage_Prefab
    BuildingControlPage_Standalone -> SelectionBuildingControlPage_Prefab
```

单位信息、建筑信息、建造页、造兵页、科技页、建筑控制页的位置和基础图片都在上述 Prefab 内调整。代码只刷新选中对象数据、按钮列表、队列、研究/生产状态和点击事件。

建造、生产、科技：

```text
BuildDevelopmentRoot_Prefab
BuildButton_Prefab
BuildPlacementOverlay_Prefab
BuildPlacementCommandButton_Prefab
BuildPlacementInfoPanel_Prefab
BuildPlacementStatusPanel_Prefab
BuildPlacementCenterGuide_Prefab
BuildingProductionButton_Prefab
BuildingActionButton_Prefab
UnitProductionPanel_Prefab
UnitProductionCard_Prefab
ProductionQueueEntry_Prefab
ProductionCategoryTab_Prefab
ResearchPanel_Prefab
ResearchButton_Prefab
TechTreePanel_Prefab
TechNode_Prefab
TechBranchTab_Prefab
```

`BuildMenuPanel_Prefab`、`BuildingDetailsPanel_Prefab`、`BuildingProductionPanel_Prefab` 当前只作为历史兼容资源保留，不属于主 HUD 的 `ContextLayer_AdvancedPanels`。

普通建造列表固定显示在 `SelectionPanel_Prefab/UnitBuildingActionPages_RightContainer/BuildingUnitProductionPage_Standalone` 内，不再打开旧 `BuildDevelopmentRoot` 完整建造窗口。`BuildDevelopmentRoot_Prefab` 在战斗 HUD 内只保留建筑放置确认 overlay：`PlacementCenterGuide`、`PlacementGhostCommandRoot/CancelPlacement`、`PlacementGhostCommandRoot/ConfirmPlacement`、`PlacementGhostCommandRoot/RotatePlacement`、`PlacementStatusPanel`、`PlacementFoldedBuildPanel_Right/ChangeBuilding`、`ContinuousBuildToggle`。进入 `BuildingPlacer.IsPlacing` 后该 overlay 必须保持显示；普通选择刷新、关闭旧建造窗口、隐藏高级面板时不得把它一起关掉。

小地图固定结构：

```text
MinimapCanvas_Prefab
  MinimapPanel -> MinimapPanel_Prefab
    Title
    MatchTimeBadge -> MinimapTimeBadge_Prefab
      MatchTime
    MinimapZoomButton -> MinimapZoomButton_Prefab
      Label
    MapContent -> MinimapMapContent_Prefab
      TerrainPreview -> MinimapTerrainPreview_Prefab
    Legend
    AlertHint
```

`MinimapPanel`、时间徽章、放大按钮、说明文字、地图底板和地形预览都可在 Prefab 中单独调整。小地图点位、预警 ping、摄像机框、路线和地形像素刷新是动态数据，继续由运行时驱动。

结算：

```text
SettlementRoot_Prefab
SettlementPanel_Prefab
SettlementStatCard_Prefab
SettlementTab_Prefab
SettlementActionButton_Prefab
SettlementRow_Prefab
SettlementScrollView_Prefab
SettlementDetailPanel_Prefab
SettlementMetricTable_Prefab
SettlementTimelinePanel_Prefab
SettlementOutcomeBadge_Prefab
```

## 本次补充规则

- `UiPrefabWorkflowGenerator.CreateUiRoot` 默认为生成根节点挂 `UiPrefabSlot`，运行时按 Prefab 拥有布局和样式处理。
- `CreateGenericPanelPrefab`、`CreateGenericCardPrefab`、`CreateGenericButtonPrefab`、目录型面板标题默认文本必须为空。
- `WorldHudItem_Prefab` 是专用功能模块 Prefab，内部包含 `AlertText`、`TypeText`、`NameText`、`LevelBadge`、`HpBarFrame`、`HpBar`、`HpDelayFill`、`HpFill`、`StatusRow`、`StatusIcon`、`StatusProgress`、`StatusFill`、`StatusText`、`StatusProgressText`。代码只写名称、血量、状态和进度，不覆盖这些节点的样式和静态布局。
- `MainHudRoot_Prefab` 必须嵌套子 Prefab，而不是复制平铺节点。调整全局 HUD 层级时改 `MainHudRoot_Prefab`；调整某个模块内部时改对应子 Prefab；只需要针对某个总 HUD 实例微调时使用 nested Prefab override。
- 运行时复用规则：如果同名子节点存在，代码必须复用它；缺失时只允许非可见逻辑宿主保持流程。`MinimapCanvas` 固定在 `TopLayer_ResourcesAndStatus`，`BattleAlertCanvas` 固定在 `OverlayLayer_ModalsAndTooltips`，`MobileUnitActionOverlay` 固定在 `MobileLayer_TouchControls`，`BuildDevelopmentRoot / BuildingUnitProductionWindow / TechTreeRoot` 固定在 `ContextLayer_AdvancedPanels`。
- 现有 Prefab 已清理类型名模板文字和 `可绑定数据` 占位文字。后续如果看到 `GenericPanel`、`世界HUD`、`xxxPanel` 出现在游戏画面，优先检查该 Prefab 的 Text 初始值，而不是在代码里隐藏。
- 若某个元素确实必须运行时移动或缩放，要在代码旁注明原因，并只对该具体动态节点处理，不得影响模块根和静态子节点。

## HUD 规则文档

HUD 总结构、运行时复用规则、子模块嵌套方式和排查命令已拆到独立开发文档：

```text
Assets/DM/UI/HUD预制体开发规则.md
```

后续改战斗 HUD 时先看该文档，再改 `MainHudRoot_Prefab` 或对应子 Prefab。

## 2026-05-18 - quick card 追加规则

- HUD 内嵌 quick card 追加固定映射：
  - `PcQuickBuild_* -> BuildButton_Prefab`
  - `PcQuickTrain_* -> BuildingProductionButton_Prefab`
  - `PcQuickResearch_* -> ResearchButton_Prefab`
- 这三类运行时实例的静态样式必须完全以 prefab 为准，代码不得再重写：
  - 字体大小
  - 文字对齐
  - 图标颜色
  - 图标 `preserveAspect` 默认值
  - 按钮描边
  - `ColorBlock` 默认 hover / pressed / disabled 配色
  - 卡片内部 `Icon / Label / CostRow` 的 anchoredPosition / sizeDelta
- 代码仍允许写入的内容只包括：
  - 图标 sprite
  - 名称文本
  - 费用列表
  - 可用/不可用状态
  - 锁定/警告/推荐/选中显隐
  - 研究状态文案与进度条数值
  - 点击行为与详情绑定

## 2026-05-20 - HUD Layer 与造兵页操作入口补充规则

- `MainHudRoot_Prefab` 下的七个 Layer 节点只用于管理层级和模块宿主，不允许挂 `Image`、`CanvasRenderer` 或任何可见美术表现：
  - `TopLayer_ResourcesAndStatus`
  - `LeftLayer_SelectionAndCommands`
  - `RightLayer_MinimapAndAlerts`
  - `CenterLayer_ContextPanels`
  - `ContextLayer_AdvancedPanels`
  - `MobileLayer_TouchControls`
  - `OverlayLayer_ModalsAndTooltips`
- Layer 节点不得接收射线；需要点击的区域必须放在真实交互模块内部，例如按钮、滚动区、小地图 `MapContent`、打开状态的面板内容。
- `SelectionBuildingProductionPage_Prefab` / `BuildingUnitProductionPage_Standalone` 只负责造兵分类、可训练单位列表、生产队列和空态，不再包含 `RallyPointFloatingButton`。
- `UnitProductionPanel_Prefab` 的队列区统一命名为 `ProductionQueuePage`，不再包含 `RallyPointButton` 或 `RallyPointStatus`。
- 集结点、升级、拆除、科技入口等建筑操作按钮必须放到建筑操作区；移动端入口走 `SelectionPanel` 的建筑操作区或 `MobileUnitActionOverlay`，不得再恢复已删除的旧移动动作条。
