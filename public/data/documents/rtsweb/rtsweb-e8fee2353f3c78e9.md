# UI 预制体重做蓝图

## 为什么重做

当前 UI 已收口到“一套 Prefab + 运行时数据绑定”的方向。只要代码继续决定锚点、位置、大小和静态子节点数量，Prefab 就很容易出现入口错位、按钮不可见、文字残留和运行时覆盖 Inspector 参数的问题。

新的做法是按功能模块重做：一个模块一个大 Prefab，内部再拆小 Prefab 或固定子节点。代码只做绑定、写动态数据和绑定点击事件，不再负责模块内布局。

## 总规则

1. 每个可见页面先有一个大 Prefab。
   - 首页：`MainMenuHomePage_Prefab`
   - 副本/关卡选择：`LevelSelectPage_Prefab`
   - 图鉴：`CodexPage_Prefab`
   - 设置：`SettingsPanel_Prefab`
   - 战斗 HUD：`MainHudRoot_Prefab`
   - 战斗结算：`SettlementRoot_Prefab`
2. 大 Prefab 内部使用固定节点名，代码按名字查找。
3. 位置、大小、锚点、图片、颜色、字体、静态标题都在 Prefab 内配置。
4. 代码只允许写动态文本、按钮事件、显示隐藏、列表数据、进度条数值。
5. 旧的 `CreatePanel/CreateLabel/CreateButton` 不得再拼出可见旧 UI；缺失节点只记录错误或创建非可见逻辑宿主。
6. Prefab 中禁止模板说明文字：`GenericPanel`、`xxxPanel`、`世界HUD`、`可绑定数据`、`类型/用途` 都不能显示在运行时 Text 上。
7. 通用面板、按钮、卡片和资源牌默认使用 `Assets/Resources/UI/Skins/WarfareClassic/` 皮肤。需要换整体风格时优先替换该目录下的同名 PNG，或在具体 Prefab 中手动指定 `Image.sprite`，不要把新风格硬写进业务脚本。

## 运行时绑定规则

主菜单相关页面遵循“先找同名节点，再绑定动态数据”的规则：

```text
CreatePanel(name, parent, ...)
CreateLabel(name, parent, ...)
CreateButton(name, parent, ...)
```

调用时会先执行 `parent.Find(name)`。如果 Prefab 内已经有同名节点，代码只绑定动态数据和事件；如果没有，只允许记录错误、隐藏对应区域或创建非可见逻辑宿主，不允许生成替代可见界面。

### 锚点约定

生成器里的主菜单按钮使用统一坐标约定，后续新增按钮必须遵守：

- `size.x < 0`：按钮左右拉伸，`anchorMin=(0,1)`、`anchorMax=(1,1)`，用于快捷按钮这类横向自适应节点。
- `anchoredPosition.x >= 0`：按钮以父节点左上角为原点，`anchor=(0,1)`、`pivot=(0,1)`。
- `anchoredPosition.x < 0`：按钮以父节点右上角为原点，`anchor=(1,1)`、`pivot=(1,1)`，用于右侧工具按钮和顶部右侧按钮。
- 子面板如 `ModelControlGroup` 这类已经贴右的容器，内部按钮应使用正 x 左上坐标，避免“父节点贴右 + 子按钮再贴右”造成二次偏移。

### 禁止覆盖规则

带 `UiPrefabSlot` 的节点视为 Prefab 拥有布局和样式，运行时代码不得覆盖：

```text
anchorMin / anchorMax / pivot
anchoredPosition / sizeDelta / offsetMin / offsetMax
Image.color / Image.sprite / Text.fontSize / Text.alignment / Text.color
```

允许运行时写入的内容只包括动态文字、动态图片、按钮事件、列表条目、显示隐藏和进度数值。

## 重做顺序

1. 首页：首页入口、顶部栏、右侧快捷入口、底部提示。
2. 副本/关卡选择：竞技、生存、战役三张模式卡和底部返回。
3. 设置：设置页大 Prefab、设置行、滑条、按钮。
4. 图鉴：搜索、筛选、列表、预览、详情。
5. 战斗 HUD：资源栏、小地图、选择面板、命令栏、提示条。
6. 结算：结果面板、统计卡、明细列表、按钮。

## 首页功能清单

首页当前承载这些功能：

```text
进入副本 -> ShowPage(InstanceSelection)
继续存档 -> ContinueLatestSave
存档管理 -> ShowPage(SaveManagement)
图鉴 -> ShowPage(Codex)
教程/帮助 -> ShowPage(Tutorial)
设置 -> ShowPage(Settings)
退出游戏 -> ExitGame
顶部设置 -> ShowPage(Settings)
顶部帮助 -> ShowPage(Tutorial)
```

## 首页 Prefab 结构

`Assets/Resources/UI/Prefabs/Pages/MainMenuHomePage_Prefab.prefab`

```text
MainMenuHomePage_Prefab
  Background
    MythicGlow
    BackdropText
    LeftWarmGlow
    LowerBlueHaze
    DiagonalScanA
    DiagonalScanB
  TopBar
    TopBarGoldLine
    Logo
    Version
    SettingsTop
      Label
    HelpTop
      Label
  HomeFeature
    FeatureEyebrow
    FeatureTitle
    FeatureDesc
    FeatureModes
    InstanceEntry
      Label
    ContinueEntry
      Label
  QuickActions
    QuickTitle
    Quick_0
      Label
    Quick_1
      Label
    Quick_2
      Label
    Quick_3
      Label
    Quick_4
      Label
  BottomInfo
    Hint
```

### 首页绑定规则

- `Logo`：运行时写入 `localizedTitle + gameTitle`。
- `Version`：运行时写入 `versionLabel`。
- `SettingsTop`：绑定打开设置。
- `HelpTop`：绑定打开帮助。
- `InstanceEntry`：绑定进入副本选择。
- `ContinueEntry`：绑定继续最近存档。
- `Quick_0`：绑定存档管理。
- `Quick_1`：绑定图鉴。
- `Quick_2`：绑定教程/帮助。
- `Quick_3`：绑定设置。
- `Quick_4`：绑定退出游戏。
- 其他文字可在 Prefab 中直接改，代码只在节点存在时写必要动态值。

## 首页重做验收标准

1. 首页显示不依赖运行时代码创建布局。
2. `MainMenuHomePage_Prefab` 内可以直接调整首页所有区域的位置、大小、图片和颜色。
3. 顶部栏、首页主入口、快捷入口、底部提示都在同一个大 Prefab 内。
4. 运行时没有 `GenericPanel`、`MainMenuPanel`、`可绑定数据` 等模板文字。
5. 缺失某个节点时只允许记录错误或隐藏对应区域，正常 Prefab 不应缺节点。

## 后续模块文档要求

每重做一个模块，都在本文档补充：

```text
模块名称
Prefab 路径
节点树
代码绑定点
允许动态更新的字段
禁止代码覆盖的字段
验收标准
```

## 设置界面 Prefab 结构

`Assets/Resources/UI/Prefabs/InGame/SettingsPanel_Prefab.prefab`

```text
SettingsPanel_Prefab
  SettingsBackground
  SettingsHeader
    SetupTitle
    SetupSubtitle
  SettingsPanel
    PanelTitle
    SettingsRows
      Row_0..Row_9
        Label
        Value
        Action
          Label
  Footer
    PrimaryFooter
    SecondaryFooter
    TertiaryFooter
```

绑定规则：代码只写每行 Label/Value、绑定 Action/保存/默认/返回按钮。`SettingsPanel_Prefab` 内预置的 `Row_0..Row_9` 固定行可以直接在 prefab 中调整位置、大小和颜色；竞技/生存设置页这类运行时动态生成的 `Row_*` 根节点由代码按行号纵向排列，行内 `Label / Value / Action` 的偏移、字号、图片和基础样式继续来自 `MainMenuOptionRow_Prefab`。

动态设置页规则：

- `CompetitiveSetup`、`SurvivalSetup`、`Tutorial` 等没有完整页面 prefab 的设置列表，`Row_*` 根节点不保留模板中心坐标，必须按列表行号展开。
- `Next / Minus / Plus / Toggle / Rename` 等行内按钮使用 `MainMenuButton_Prefab`，不得使用 `MainMenuOptionRow_Prefab` 当按钮。
- 调整行高、行内文字和按钮位置时改 `MainMenuOptionRow_Prefab`；调整整页列表区域时改对应页面 prefab 或 `CreatePanel("CompetitiveOptions"... )` 的父容器规则。
- 动态设置页滚动区域使用 `RectMask2D + ScrollRect`，不能使用透明 `Mask` 裁剪内容，避免竞技/生存选项页在运行时只显示空面板。
- 竞技/生存选项页面板横向占 84% 左右屏宽，行内采用“左侧标题 + 中部值 + 右侧按钮”的三段式排版，页脚 Back 返回副本选择页。

## 图鉴界面 Prefab 结构

`Assets/Resources/UI/Prefabs/Pages/CodexPage_Prefab.prefab`

```text
CodexPage_Prefab
  CodexBackground
  Canvas_Root_SafeArea
    TopBar
      CodexBack
        Label
      CodexTitle
      PrimaryTabs
        PrimaryTab_Buildings
          Label
        PrimaryTab_Units
          Label
        PrimaryTab_Terrain
          Label
        PrimaryTab_Gameplay
          Label
      CodexSearchBox
        Placeholder
        Text
      CodexSearchClear
        Label
      CodexClearFilter
        Label
      CodexOnlyModelTop
        Label
      CodexCount
    LeftPanel
      LeftTitle
      LeftCount
      SecondaryTabBar
      FactionBar
      EraBar
      CodexCardScroll
        Viewport
          Content
    RightPreviewPanel
      StageGlow
      ModelControlGroup
        BtnResetView
          Label
        BtnZoomIn
          Label
        BtnZoomOut
          Label
        BtnDetail
          Label
        BtnOnlyModel
          Label
      QuickActionGroup
        GestureHint
    BottomInfoBar
      BottomEmpty
      Name
      MetaInfoRow
      Desc
      BtnDetailLarge
        Label
```

绑定规则：代码复用 `Canvas_Root_SafeArea`、`TopBar`、`LeftPanel`、`RightPreviewPanel`、`BottomInfoBar`，以及上述同名固定子节点。`CreatePanel/CreateLabel/CreateButton` 已改为先查找父节点下同名子节点，存在时只绑定动态数据和点击事件，不再重复生成第二套 UI。

允许动态更新：`CodexCount`、`LeftTitle`、`LeftCount`、搜索框输入值、分类/阵营/时代按钮状态、列表 `Content` 动态条目、预览模型/图片、底部 `Name/MetaInfoRow/Desc`、详情弹窗内容。

禁止代码覆盖：`TopBar`、`PrimaryTabs`、`CodexSearchBox`、`LeftPanel`、`SecondaryTabBar`、`FactionBar`、`EraBar`、`CodexCardScroll/Viewport`、`RightPreviewPanel`、`ModelControlGroup`、`QuickActionGroup`、`BottomInfoBar` 的锚点、位置、大小、基础图片、颜色和静态文案都以 Prefab 为准。缺失节点只报错或隐藏对应区域。

本次修正：图鉴的 `CreateCodexRect/CreateCodexStretchRect/CreateCodexText/CreateScrollContent/CreateCodexSearchBox` 已按 `UiPrefabSlot` 判断 Prefab 拥有权，不会再覆盖 Prefab 中设置好的偏移、尺寸和样式。搜索清空按钮在无搜索内容时隐藏，底部未选中提示在选中条目后隐藏，避免文字叠层。

### 图鉴布局规则

- `TopBar`：高度约 11.5% 屏幕，放返回、标题、一级标签、搜索和右侧操作。
- `PrimaryTabs`：锚在顶部栏中部偏左，四个页签固定宽度，避免和搜索框互相挤压。
- `LeftPanel`：宽度约 30%，放筛选和列表，不再由代码按屏幕宽度强制改写。
- `CodexCardScroll/Viewport/Content`：滚动框位置由 Prefab 控制，代码只调整 `Content.sizeDelta.y` 来容纳动态条目。
- `RightPreviewPanel`：从 33.5% 宽度处开始，预留右侧模型控制组。
- `ModelControlGroup`：容器贴右下，内部按钮使用正 x 左上坐标。
- `BottomInfoBar`：与右侧预览区左边缘对齐，显示当前选中条目的摘要。

验收标准：

1. 打开图鉴时只出现一套 `TopBar/LeftPanel/RightPreviewPanel/BottomInfoBar`。
2. 搜索框、清空按钮、仅模型按钮不重叠。
3. 左侧筛选条和列表滚动区不压住标题。
4. 右侧模型按钮纵向排列在预览区右下，不跑出面板。
5. 选中条目后 `BottomEmpty` 隐藏，只显示条目名、元信息、简介和详情按钮。

## 副本/关卡选择 Prefab 结构

`Assets/Resources/UI/Prefabs/Pages/LevelSelectPage_Prefab.prefab`

```text
LevelSelectPage_Prefab
  Background
    LeftWarmGlow
    LowerBlueHaze
    BackdropText
  SetupHeader
    SetupTitle
    SetupSubtitle
  InstanceModeCards
    ModeCard_Competitive
      Accent
      Title
      Sub
      Desc
      Tags
      Primary
        Label
      Secondary
        Label
    ModeCard_Survival
      Accent
      Title
      Sub
      Desc
      Tags
      Primary
        Label
      Secondary
        Label
    ModeCard_Campaign
      Accent
      Title
      Sub
      Desc
      Tags
      Primary
        Label
      Secondary
        Label
  Footer
    PrimaryFooter
      Label
```

绑定规则：`InstanceSelection` 页面会优先识别完整的 `LevelSelectPage_Prefab`，识别成功后不再额外创建背景和顶部栏。代码只写三张卡的动态文案和按钮事件。

按钮绑定：

- `ModeCard_Competitive/Primary`：进入竞技设置。
- `ModeCard_Competitive/Secondary`：用最近配置直接开始竞技。
- `ModeCard_Survival/Primary`：进入生存设置。
- `ModeCard_Survival/Secondary`：继续最近存档。
- `ModeCard_Campaign/Primary`：进入战役设置。
- `ModeCard_Campaign/Secondary`：直接开始战役。
- `Footer/PrimaryFooter`：返回主页。

禁止代码覆盖：`Background`、`SetupHeader`、`InstanceModeCards`、三张 `ModeCard_*`、`Footer/PrimaryFooter` 的位置、大小、图片、颜色和静态文案以 Prefab 为准。缺失完整结构时只报错或隐藏对应区域。

### 关卡选择布局规则

- `SetupHeader`：位于页面上方 80%-93% 区域，作为页面标题和说明。
- `InstanceModeCards`：位于 20%-76% 区域，内部三张卡按 1/3 宽度均分。
- `ModeCard_*`：每张卡内部固定包含标题、英文副标题、说明、标签、主按钮、次按钮。
- 卡片按钮使用左上锚点，主按钮和次按钮都在卡片底部附近，避免说明文字较长时压住按钮。
- `Footer/PrimaryFooter`：底部返回主页按钮，独立于卡片区域，避免被卡片遮挡。

验收标准：

1. 页面不再显示旧的 `Title/Description/UsageNote` 模板壳。
2. 三张模式卡横向均分，标题、说明、标签和按钮不互相遮挡。
3. 进入竞技、生存、战役按钮能正常跳转或开始游戏。
4. 调整 `ModeCard_*` 的位置、大小、图片、颜色后，运行时不会被代码覆盖。
5. `InstanceSelection` 页面使用完整 Prefab 时，不再额外创建旧背景或旧顶部栏。

## 结算界面 Prefab 结构

`Assets/Resources/UI/Prefabs/Pages/SettlementRoot_Prefab.prefab`

```text
SettlementRoot_Prefab
  Dim
  SettlementPanel
    Title
    Subtitle
    SummaryCards
    Tabs
      Tab_Overview
        Label
      Tab_Economy
        Label
      Tab_Military
        Label
      Tab_BuildingsTech
        Label
      Tab_HeroesTowers
        Label
      Tab_Timeline
        Label
    Details
    Actions
      PrimaryAction
        Label
      SecondaryAction
        Label
      ReturnMainMenu
        Label
```

绑定规则：运行时保留 `Dim`、`SettlementPanel`、`SummaryCards`、`Tabs`、`Details`、`Actions` 这些 Prefab 节点，不再先清空整棵结算 Prefab。代码只清空 `SummaryCards` 和 `Details` 的动态数据内容，页签按钮和底部操作按钮优先复用 Prefab 中的同名节点，只更新文案、高亮状态和点击事件。

禁止代码覆盖：`SettlementRoot_Prefab`、`SettlementPanel`、`Tabs`、`Actions`、`Tab_*`、`PrimaryAction`、`SecondaryAction`、`ReturnMainMenu` 的锚点、位置、大小、基础图片和基础颜色都应在 Prefab 中调整。缺失节点时只允许记录错误或隐藏对应区域。

## 战斗 HUD Prefab 结构

`Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`

```text
MainHudRoot_Prefab
  TopLayer_ResourcesAndStatus
    TopStatusBar                         -> nested ResourceHud_Prefab
    ObjectiveHintPanel                   -> nested ObjectiveHintPanel_Prefab
    InGameSettingsButton
  LeftLayer_SelectionAndCommands
    SelectionPanel                       -> nested SelectionPanel_Prefab
      Header_SelectedEntity
      StatsGrid
      ActionGrid_Buttons
      UnitBuildingInfoPanel_Left         -> nested SelectionInfoPanel_Prefab
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
      UnitBuildingActionPages_RightContainer -> nested SelectionActionPanel_Prefab
        RightActionArea
          ActionHint
          UpgradeInfoText
        BuildingTechTreePage_Standalone      -> nested SelectionBuildingTechTreePage_Prefab
          ResearchSectionTitle
          ResearchGridViewport
            ResearchGridContent
          ResearchQueueTitle
          ResearchQueueViewport
            ResearchQueueContent
        BuildingUnitProductionPage_Standalone -> nested SelectionBuildingProductionPage_Prefab
          BuildableSectionTitle
          ProductionSectionTitle
          ProductionGridViewport
            ProductionGridContent
          ProductionQueueTitle
          ProductionQueueViewport
            ProductionQueueContent
          RallyPointFloatingButton
        BuildingControlPage_Standalone       -> nested SelectionBuildingControlPage_Prefab
          BuildingActionSectionTitle
          ActionButtonArea
    HeroHudPanel                       -> nested HeroHudPanel_Prefab
  RightLayer_MinimapAndAlerts
    MinimapCanvas                      -> nested MinimapCanvas_Prefab
      MinimapPanel                     -> nested MinimapPanel_Prefab
        Title
        MatchTimeBadge                 -> nested MinimapTimeBadge_Prefab
          MatchTime
        MinimapZoomButton              -> nested MinimapZoomButton_Prefab
          Label
        MapContent                     -> nested MinimapMapContent_Prefab
          TerrainPreview               -> nested MinimapTerrainPreview_Prefab
        Legend
        AlertHint
    CombatAlertFeed                    -> nested CombatAlertFeedPanel_Prefab
  CenterLayer_ContextPanels
    SurvivalTaskPanel                  -> nested SurvivalTaskPanel_Prefab
      SurvivalTaskPanelTitle
      SurvivalTaskSummary
      Close
        Label
      SurvivalTaskTabs
        MainlineTab
          Label
        DevelopmentTab
          Label
        RandomTab
          Label
        EventTab
          Label
        CompletedTab
          Label
      SurvivalTaskList
  ContextLayer_AdvancedPanels
    BuildDevelopmentRoot               -> nested BuildDevelopmentRoot_Prefab
    BuildingUnitProductionWindow
      ProductionDimBackground
      ProductionPagePanel
        NavHeader
          Title
          Status
        StandaloneUnitProductionPanel  -> nested UnitProductionPanel_Prefab
    TechTreeRoot                       -> nested TechTreeRoot_Prefab
  MobileLayer_TouchControls
    MobileUnitActionOverlay            -> nested MobileUnitActionOverlay_Prefab
    MobileSkillCancel
  OverlayLayer_ModalsAndTooltips
    BattleAlertCanvas                  -> nested BattleAlertCanvas_Prefab
    InGameSettingsRoot                 -> nested InGameSettingsRoot_Prefab
    ResourceTooltip                    -> nested ResourceTooltip_Prefab
```

绑定规则：`GameUI` 启动时优先实例化/复用 `MainHudRoot_Prefab`。战斗内所有固定 HUD 模块都必须挂在这个总 Prefab 的分层内；大模块必须是 nested Prefab，不再把小地图、选择面板、建造页、生产页等平铺成纯代码节点。代码只写资源数值、匹配时间、任务文本、英雄状态、选择状态、按钮事件和动态列表；模块槽位的位置、大小、背景、图片和静态节点在 Prefab 中调整。

当前接入规则：

- `TopStatusBar`：资源和状态条父节点，代码只创建/刷新资源 chip、时间、人口等动态条目。
- `ObjectiveHintPanel`：目标提示模块，代码复用 `ObjectiveText`、`HintText`，没有时才生成。
- `SelectionPanel`：选择详情模块槽位，内部继续嵌 `SelectionInfoPanel_Prefab`、`SelectionActionPanel_Prefab`、科技页、造兵页和建筑控制页。单位/建筑信息、头像框、标题、血量文本、属性文本、详情文本、右侧页位置都在 Prefab 中调整。
- `HeroHudPanel`：英雄 HUD 模块槽位，英雄行仍是动态列表，但父面板位置和样式由 Prefab 控制。
- `SurvivalTaskPanel`：生存任务详情大面板，`Title/Summary/Close/Tabs/List` 都优先复用 Prefab 节点。
- `MinimapCanvas`：小地图模块槽位，内部嵌 `MinimapPanel_Prefab`；`MatchTimeBadge`、`MinimapZoomButton`、`MapContent`、`TerrainPreview` 都是可单独编辑的小 Prefab。
- `ContextLayer_AdvancedPanels`：只挂 `BuildDevelopmentRoot`、`BuildingUnitProductionWindow`、`TechTreeRoot`。建造详情走 `BuildDevelopmentRoot`，建筑造兵大窗走 `BuildingUnitProductionWindow`，科技树走 `TechTreeRoot`；旧 `BuildMenuPanel` 和 `BuildingProductionPanel` 不再作为主 HUD 子节点。
- `MobileLayer_TouchControls`：移动端操作条、单位操作覆盖层、技能取消区域都挂在这里。
- `OverlayLayer_ModalsAndTooltips`：战斗预警、战斗内设置、资源 Tooltip 都挂在这里。`BattleAlertCanvas` 不放在小地图层。

动态例外：

- 资源 chip、英雄行、生存任务行、建造按钮、生产单位卡、生产队列、科技节点、建筑操作按钮、小地图点位/路线、地形刷新、世界 HUD、伤害跳字仍由运行时按数据刷新。
- 这些动态项的父容器、基础图片、尺寸和静态子节点必须来自 Prefab；只有数量、文本、图标、进度、可用状态、点击事件允许代码刷新。

禁止代码覆盖：`MainHudRoot_Prefab` 七个大层、所有 nested 模块根、`SelectionInfoPanel` 内部信息区、`SelectionActionPanel` 内部页区、`MinimapPanel/MatchTimeBadge/MinimapZoomButton/MapContent/TerrainPreview`、`BuildDevelopmentRoot`、`BuildingUnitProductionWindow`、`StandaloneUnitProductionPanel`、`TechTreeRoot`、`BattleAlertCanvas`、`InGameSettingsRoot` 的锚点、位置、大小和基础图片必须以 Prefab 为准。缺失节点只报错或隐藏对应区域。

## 本次修正记录

1. 修复首页 `Quick_1` 图鉴按钮：生成器现在先用正宽创建按钮，再把负宽按钮明确写成左右拉伸锚点，`Quick_1` 当前为 `anchorMin=(0,1)`、`anchorMax=(1,1)`、`sizeDelta=(-40,48)`。
2. 结算界面改为保留大 Prefab 结构，运行时只清动态内容，不再删除整棵 `SettlementRoot_Prefab`。
3. 结算页签和底部按钮已预置到 Prefab，代码优先复用同名节点。
4. 战斗 HUD 根 Prefab 已补充关键模块槽位，`GameUI` 会优先实例化/复用 `MainHudRoot_Prefab` 并把模块挂入对应层。
5. 生存任务面板内部 `Title/Summary/Close/Tabs/List` 已改为可复用 Prefab 节点，代码只绑定文本、点击事件和任务列表数据。
6. HUD 总 Prefab 已改为完整 nested Prefab 结构：选择面板、小地图、建造页、生产页、建筑详情、战斗预警、设置、移动端操作都嵌在 `MainHudRoot_Prefab` 对应层内。
7. `SelectionPanel_Prefab` 已继续拆分为 `SelectionInfoPanel_Prefab`、`SelectionActionPanel_Prefab`、`SelectionBuildingTechTreePage_Prefab`、`SelectionBuildingProductionPage_Prefab`、`SelectionBuildingControlPage_Prefab`。运行时优先复用头像、标题、属性、详情、科技页、造兵页、控制页节点。
8. `MinimapCanvas_Prefab` 已继续拆分为 `MinimapPanel_Prefab`、`MinimapTimeBadge_Prefab`、`MinimapZoomButton_Prefab`、`MinimapMapContent_Prefab`、`MinimapTerrainPreview_Prefab`，时间、放大按钮、文字、地图底板都可以在 Prefab 中单独调整。

## 建造页 Prefab 结构

当前 HUD 建造入口是 `Assets/Resources/UI/Prefabs/Pages/BuildDevelopmentRoot_Prefab.prefab`。

```text
BuildDevelopmentRoot_Prefab
  BuildCommandBar_PC
    CategoryTabs_PC
    BuildingGrid_PC
  BuildDetailPanel_PC
  PlacementOverlay / PlacementInfoPanel / PlacementStatusPanel
```

绑定规则：建筑按钮列表是动态数据，进入 `BuildingGrid_PC`，以 `PcBuildIcon_*` 横向排列；移动/备用列表的 `BuildCard_*` 也使用横向滚动。`BuildMenuPanel_Prefab` 仅作为历史兼容资源保留，不再挂入 `MainHudRoot_Prefab/ContextLayer_AdvancedPanels`。

## 建筑详情/生产页 Prefab 结构

旧 `BuildingDetailsPanel_Prefab` / `BuildingProductionPanel_Prefab` 仅作为历史兼容资源保留，主 HUD 当前不再挂载。

```text
BuildDevelopmentRoot_Prefab        -> 建造详情
BuildingUnitProductionWindow       -> 建筑造兵大窗
TechTreeRoot_Prefab                -> 科技树
SelectionPanel_Prefab              -> 选中建筑后的嵌入式信息/快捷操作
```

绑定规则：代码只刷新建筑名、状态、图标、标签、属性文本、升级状态、生产/科技/建造数据和按钮事件。固定窗口壳、滚动区域、卡片容器、底部操作栏的布局与基础样式都以当前有效 Prefab 为准；旧 `BuildingProductionPanel` 不再接收动态按钮或动态文本。

## 造兵页 Prefab 结构

`Assets/Resources/UI/Prefabs/InGame/UnitProductionPanel_Prefab.prefab`

```text
UnitProductionPanel_Prefab
  ProductionUnitListPage
    TrainUnitsTitle
    TrainUnitsHint
    CategoryTabs
    UnitScrollRect
      UnitButtons
  ProductionDetailTipsPage
    DetailPageTitle
    DetailIcon
    DetailTitle
    DetailSubtitle
    DetailBody
    DetailTrainButton
      Label
  ProductionQueueAndRallyPage
    QueueTitle
    QueueStatus
    RallyPointButton
      Label
    QueueScrollRect
      QueueEntries
```

绑定规则：`UnitProductionPanel` 启动时优先绑定上述同名节点，不再强制覆盖这些节点的 Prefab 布局。代码只动态生成单位卡片到 `UnitButtons`，生成队列条目到 `QueueEntries`，刷新详情文本、按钮事件和分类页签状态；集结点等建筑操作不进入造兵内容页。

## 造兵弹窗外层规则

`BuildingUnitProductionWindowUI` 运行时优先复用：

```text
ProductionPagePanel
  NavHeader 或 UnitProductionHeader
    Title
    Status
    BottomBorder
  StandaloneUnitProductionPanel 或 UnitProductionPanel
```

这些节点如果来自 Prefab 且设置了保留布局，代码不再强制写死位置、大小和偏移。

## 操作详情卡 Prefab 结构

`Assets/Resources/UI/Prefabs/InGame/OperationDetailCard_Prefab.prefab`

```text
OperationDetailCard_Prefab
  Icon
  Title
  Subtitle
  Summary
  Tags
  Sections
  Close
    Label
```

绑定规则：代码只写技能/建造/训练/研究等详情数据，标签进入 `Tags`，详细段落进入 `Sections`，卡片整体尺寸、背景、阴影、图标占位、关闭按钮位置在 Prefab 中调。

## 建造/生产模块本次修正记录

1. `Rebuild Modular Screen Prefabs` 已扩展到建造、建筑详情、建筑生产、造兵、操作详情卡、单位卡、分类页签和队列条目。
2. `BuildingUnitProductionWindowUI` 现在优先复用 `ProductionPagePanel/NavHeader/StandaloneUnitProductionPanel`，并尊重 Prefab 布局。
3. `UnitProductionPanel` 的三大区域、标题、页签、滚动框、详情按钮、队列按钮已改为尊重 Prefab 布局。
4. `BuildMenuPanel_Prefab`、`BuildingDetailsPanel_Prefab`、`BuildingProductionPanel_Prefab`、`UnitProductionPanel_Prefab`、`OperationDetailCard_Prefab` 已重建为可编辑模块结构。
