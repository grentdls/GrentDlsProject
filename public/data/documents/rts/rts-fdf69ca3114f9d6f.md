# Task Log

## 2026-05-26 - 建筑操作按钮点击链路再次修复

### 修改内容
- 补齐 `SelectionPanel` 动态建筑操作按钮缺失的 `BuildingActionButtonForwarder`，让升级、集结点、拆除等按钮即使 prefab 子层级或详情提示组件影响 Unity Button 点击，也能直接转发到统一建筑动作入口。
- 建筑动作按钮现在同时保留 `Button.onClick` 兜底绑定，并在 `TriggerBuildingActionFromButton` 中做短时间去重，避免同一次点击触发两次升级或集结点。
- 强化 `BuildingActionButton` 的射线归属：按钮根 `Graphic` 负责接收点击，子级图标、文本、装饰图层统一关闭 `raycastTarget`，减少 prefab 视觉层遮挡导致的“显示但点不动”。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中后的统一建筑操作区按钮，包括升级、集结点、拆除、城墙链升级、范围/优先级等动态按钮。
- PC 与移动端共用的 `SelectionPanel` 内嵌建筑操作页点击响应。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 运行态重点验证可生产建筑的“集结点”是否进入地面点选模式，以及可升级建筑的“升级”是否立即扣资源并开始升级进度。
- 如果某个按钮仍表现为不可执行，需要优先看按钮是否被置为 disabled，以及 `BuildingUiUtility.BuildActionDescriptors` 给出的 `Warning` 是否说明资源、建筑等级、阵营规则或施工状态不满足。

## 2026-05-26 - 建筑升级与集结点按钮点击恢复

### 修改内容
- 修复 `SelectionPanel` 统一建筑操作按钮在 HUD prefab 化后点击无反应的问题，确保升级、集结点等按钮在重建时先清空旧 `onClick` 再绑定当前建筑动作。
- 强化运行时建筑动作按钮的射线与交互配置：按钮主 `Image` 重新作为 `targetGraphic`，文本和图标关闭射线拦截，避免详情触发器或子节点抢占主按钮点击。
- 放宽选择面板入场动画阶段的 `CanvasGroup` 交互门槛，避免刚选中建筑时右侧操作页已显示但仍处于不可点击的短暂空窗。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中后右侧统一操作区中的升级、集结点、拆除、升级城墙链等按钮点击链路。
- `SelectionPanel` 动态按钮在重用 / 销毁重建时的事件绑定稳定性。
- 选择面板出现动画期间的按钮交互可用性。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行态重点验证：选中可升级建筑后点击“升级”；选中可生产建筑后点击“集结点”；连续切换不同建筑后再次点击这些按钮，确认不会无反应或串动作。

### 后续注意事项
- 当前修复收口在统一 `SelectionPanel` 动作按钮链路，没有恢复旧移动端/旧建造窗口分叉逻辑。
- 如果 Unity 运行态仍有个别建筑按钮无反应，下一步应优先检查对应 prefab 上是否还有额外透明 `Image` / `CanvasGroup` 覆盖在 `BuildingControlPage_Standalone/ActionButtonArea` 之上。

## 2026-05-24 - 图鉴模型预览与查看按钮完善

### 修改内容
- 为 prefab 化后的图鉴页补齐右侧模型预览链路：选中建筑/单位条目时通过 `ContentCatalogManager.ResolveBuildingPrefabOrDefault` / `ResolveUnitPrefabOrDefault` 解析真实模型 prefab，并渲染到 `RightPreviewPanel`。
- 图鉴预览区新增运行时 `ModelPreviewTexture` 显示层、隔离预览世界、独立摄像机和灯光，模型实例会禁用玩法脚本、碰撞、音源和物理，避免进入主菜单图鉴时触发战斗逻辑。
- 右侧 `ModelControlGroup` 的重置、放大、缩小、详情、仅模型按钮现在会强制保持可见并按当前条目/模型状态切换可交互；拖拽、滚轮缩放、按钮缩放会作用到真实模型预览。
- 无模型条目仍回退为图文说明和图标，不显示空白 RenderTexture，地形/玩法条目不会误开仅模型模式。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.Codex.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单图鉴页 `CodexPage_Prefab` 的右侧预览区运行时绑定。
- 建筑/单位条目的 prefab 模型展示、缩放、旋转、重置和仅模型查看。
- 地形/玩法条目的无模型回退显示与按钮可用状态。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "RefreshCodexModelPreview|ModelPreviewTexture|ResolveCodexPreviewPrefab|RefreshCodexPreviewControls" Assets/Scripts/UI/MainMenuUI.Codex.cs`

### 后续注意事项
- 当前模型预览显示层是运行时内容，位置仍由 `RightPreviewPanel` prefab 决定；如果需要更细的遮罩、边框或专属背景，应继续在 `CodexPage_Prefab` 中加固定美术节点。
- Unity 运行态需要重点验收不同尺寸建筑和单位的镜头距离，如果某些特殊模型比例极端，可以在后续为数据资产补预览偏移/缩放配置。

## 2026-05-24 - 图鉴界面预制体绑定重建与编译恢复

### 修改内容
- 重建 `MainMenuUI.Codex.cs`，替换已损坏且无法继续维护的旧图鉴 partial，实现稳定的 prefab 驱动图鉴页。
- 新图鉴页改为优先复用 `CodexPage_Prefab` 及其固定子节点，只负责动态数据绑定、搜索、筛选、列表刷新、预览区摘要和详情弹层，不再恢复旧的代码拼布局逻辑。
- 接回 `ShowPage(MenuPage.Codex)` 所需的状态字段与接口，包括仅模型模式、详情展开、预览拖拽/缩放、列表选择与返回键行为。
- 用 `RTSGameConfig`、`FactionTechTreeData`、`TerrainRuleSetData`、`ContentCatalogManager` 和 `RuntimeIconFactory` 重建图鉴数据源，覆盖建筑、单位、地形和玩法条目。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.Codex.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单图鉴页 `CodexPage_Prefab` 的运行时绑定链。
- 图鉴页的一级标签、二级分类、阵营/时代过滤、搜索框、左侧卡片列表、右侧预览和底部摘要。
- 图鉴页在 prefab 存在时不再重复创建第二套可见 UI。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "CreateCodex|CleanupCodexPreview|UpdateCodexPreviewPresentation|codexOnlyModelMode|codexDetailOpen" Assets/Scripts/UI/MainMenuUI.cs Assets/Scripts/UI/MainMenuUI.Codex.cs`

### 后续注意事项
- 当前这一轮先优先恢复图鉴页整体结构、数据绑定和编译稳定性；下一步应在 Unity 运行态继续核对 prefab 位置、滚动区尺寸、详情弹层尺寸和仅模型模式的实际视觉表现。
- `MainMenuUI.Codex.cs` 现在已经回到“prefab 优先、代码只绑数据”的路径，后续继续修图鉴 UI 时应直接改 `CodexPage_Prefab` 与组件 prefab，不要再把布局写回脚本。

## 2026-05-24 - 图鉴详情文案与状态表现继续修复

### 修改内容
- 继续重写并清理 `MainMenuUI.Codex.cs`，移除图鉴页中已污染的乱码文案，恢复建筑、单位、地形、玩法条目的可读中文信息。
- 补齐图鉴底部详情按钮文案与详情展开状态，新增 `CloseCodexDetailOverlay()` 与按钮返回链收口，避免详情态和仅模型态互相残留。
- 统一图鉴详情文案生成逻辑，恢复建筑/单位属性摘要、建造与制造成本、玩法说明等运行时文本输出。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.Codex.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单图鉴页右侧预览提示文案。
- 图鉴底部 `BtnDetailLarge` 的文案和详情展开状态。
- 图鉴详情浮层中的建筑/单位/地形/玩法文本输出。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "CloseCodexDetailOverlay|HandleCodexBackFromButton|BuildCodexDetailText|AppendBuildingDetail|AppendUnitDetail|AddGameplaySystemEntries" Assets/Scripts/UI/MainMenuUI.Codex.cs`

### 后续注意事项
- 当前脚本侧的乱码和详情状态问题已收口；下一步应优先在 Unity 运行态检查 `FloatingDetailPanel` 尺寸、搜索框、分类按钮与左侧列表滚动区的真实排布。
- 若图鉴页仍有位置不对或组件重叠，后续应优先改 `CodexPage_Prefab`、`CodexDetailPanel_Prefab` 与相关组件 prefab，不要回退到脚本写布局。

## 2026-05-24 - 图鉴动态筛选条与列表排布兜底继续优化

### 修改内容
- 为图鉴页动态生成的二级分类按钮、阵营按钮、时代按钮补上脚本侧排布兜底：当 prefab 容器未启用 `LayoutGroup` 时，运行时按多行按钮条规则自动换行，避免所有按钮堆在左上角重叠。
- 为左侧 `CodexCardScroll/Viewport/Content` 动态卡片列表补上纵向列表兜底布局：每张卡片按顶部顺排、固定间距刷新，并同步刷新内容高度，避免 0/1/多条目时内容区高度和滚动范围异常。
- 保持 prefab 优先规则：如果容器本身已经带有效 `LayoutGroup`，脚本不覆盖该布局，只在缺失布局组件时兜底。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.Codex.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 图鉴页 `SecondaryTabBar`、`FactionBar`、`EraBar` 的动态按钮排布。
- 图鉴页左侧 `CodexCardScroll/Viewport/Content` 的卡片顺序、高度和滚动内容尺寸。
- 没有完整布局组件或运行态按钮数量变化较大时的图鉴 UI 稳定性。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "LayoutCodexButtonStrip|LayoutCodexCardList|HasActiveLayoutGroup" Assets/Scripts/UI/MainMenuUI.Codex.cs`

### 后续注意事项
- 当前是脚本侧兜底布局，目的在于保证图鉴页运行态不重叠；如果 Unity 中看到按钮尺寸、换行节奏或卡片高度仍不理想，下一步应把最终视觉规则落到 `CodexPage_Prefab` 和相关组件 prefab 上。
- 图鉴页真实视觉验收仍需要在 Unity 运行态确认 `PrimaryTabs`、`SecondaryTabBar`、`FactionBar`、`EraBar`、`CodexCardScroll` 与 `FloatingDetailPanel` 的最终尺寸与间距。

## 2026-05-21 - 预建造放置确认 HUD 恢复

### 修改内容
- 修复从内嵌建造页点击建筑后，`BuildingPlacer` 已进入放置态但 `BuildDevelopmentRoot` 被旧窗口清理逻辑隐藏的问题。
- `BuildDevelopmentPanelUI` 新增放置态专用 `OpenPlacementOverlay(...)`，PC 与移动端只要处于 `BuildingPlacer.IsPlacing` 都构建 `PlacementCenterGuide`、确认、取消、旋转、状态提示和更换建筑面板。
- `GameUI` 在放置态不再把 `BuildDevelopmentRoot` 当作旧完整建造窗口关闭，普通选择刷新、关闭旧建造窗口和隐藏高级面板不会误关放置确认 HUD。
- `SelectionPanel` 的建造卡点击链在 `BeginPlacement(...)` 后主动唤起放置确认 HUD。
- `UiPrefabWorkflowGenerator` 补齐 `BuildDevelopmentRoot_Prefab/PlacementGhostCommandRoot` 下的 `CancelPlacement`、`ConfirmPlacement`、`RotatePlacement` 固定按钮节点生成规则。
- 更新 UI 预制体规范，明确普通建造列表归 `SelectionPanel` 内嵌页，`BuildDevelopmentRoot` 只保留预建造放置确认 overlay。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `docs/UI/游戏内UI预制体化规范.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击单位建造页中的建筑卡后，预建造放置态的中心提示、确认、取消、旋转、更换建筑和状态提示显示链路。
- `BuildDevelopmentRoot` 在战斗 HUD 中的职责边界：不恢复旧完整建造窗口，只服务放置确认 overlay。
- 后续通过 `UiPrefabWorkflowGenerator` 重建 `BuildDevelopmentRoot_Prefab` 时的放置按钮固定结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "OpenPlacementOverlay|ShouldKeepBuildPlacementOverlayVisible|OpenBuildPlacementOverlay|CancelPlacement|ConfirmPlacement|RotatePlacement|PlacementGhostCommandRoot" Assets/Scripts/UI Assets/Scripts/Editor`

### 后续注意事项
- 当前实际 `BuildDevelopmentRoot_Prefab` 资源本体仍可通过 Unity 菜单 `Tools/RTS/UI/Rebuild Modular Screen Prefabs` 或 `Generate Editable UI Prefabs` 重建，以落地生成器新增的三个固定按钮节点；运行时已会从 `BuildPlacementCommandButton_Prefab` 补齐缺失按钮并绑定事件。
- 不要把普通建造列表重新接回 `BuildDevelopmentRoot`；它已经收口到 `SelectionPanel` 内嵌建造页。

## 2026-05-21 - 内嵌建造与造兵列表刷新链修复

### 修改内容
- 修复 `SelectionPanel` 内嵌建造页和造兵页共用 `ProductionGridContent` 时，旧逻辑同时执行建造列表布局与造兵列表布局，导致后一种布局覆盖前一种列表宽度和显隐状态的问题。
- 新增 PC 内嵌目录模式：单位选中自动打开建造页时只布局 `BuildBuilding` 卡；建筑选中打开造兵页时只布局 `TrainUnit` 卡，不再把两个目录混在同一轮刷新里。
- 建筑造兵页的标题、分类栏、生产队列显隐改为跟随当前目录模式，避免旧残留按钮让建造/造兵两个页面状态同时出现。
- 修复动态卡片同帧刷新时的同名旧对象复用问题：销毁 `PcQuickBuild_*` / `PcQuickTrain_*` / 建筑动作按钮前先改名为 `_PendingDestroy`，避免 Unity 帧末销毁前 `parent.Find(objectName)` 捞到即将销毁的旧按钮。
- 保持 prefab 作为固定宿主与卡片样式来源，脚本只负责数据绑定、显隐、点击、横向内容宽度和运行时状态刷新。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击建造单位后，`BuildingUnitProductionPage_Standalone/ProductionGridContent` 中的可建造建筑卡列表。
- 点击造兵建筑后，同一内嵌造兵页中的可训练士兵卡列表和生产队列显示。
- PC 与移动端通过 `SelectionPanel` 打开的内嵌建造/造兵目录刷新链。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "PcEmbeddedCatalogMode|ResolvePcEmbeddedCatalogMode|_PendingDestroy|LayoutPcBuildableCatalog\\(\\)|LayoutPcProductionCatalog\\(\\)|pcEmbeddedCatalogMode" Assets/Scripts/UI/SelectionPanel.cs`

### 后续注意事项
- 如果运行态某个具体建筑仍然没有士兵卡，应优先查看 `ProductionCatalogUtility.ResolveTrainableUnits(building)` 返回数量和 `BuildProductionDiagnostic(building)` 的诊断文本；本轮已排除列表刷新链互相覆盖和同名旧卡复用导致的空白。

## 2026-05-21 - 内嵌造兵页面完整高度与横向列表修复

### 修改内容
- 将 `SelectionBuildingProductionPage_Prefab` 从旧的压缩高度改为 `420x312`，让造兵卡列表区获得完整 `152px` 可视高度，不再裁掉 `BuildingProductionButton_Prefab`。
- 造兵页内部 `BuildCategoryTabsViewport`、`ProductionGridViewport`、`ProductionQueueViewport` 改为左上固定锚点，内容根保持左上滚动内容规则，避免横向列表在宿主内被拉伸或偏移。
- 生产队列区同步放宽到 `392x56`，`CurrentProduction` 和 `WaitingQueueViewport/WaitingQueueContent` 保持横向并列，等待队列内容宽度按条目数量与 viewport 宽度刷新。
- `SelectionActionPanel_Prefab` 的右侧页面容器高度提高到 `760`，科技树、造兵页、建筑操作页改为顶部顺排固定高度，避免造兵页被百分比槽压成小块。
- `SelectionPanel` 与 `UiPrefabWorkflowGenerator` 同步更新同一套造兵页尺寸、位置、移动端兜底布局和 prefab 修复逻辑。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/InGame/SelectionActionPanel_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/InGame/SelectionPanel_Prefab.prefab`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 选中造兵建筑后的内嵌 `BuildingUnitProductionPage_Standalone`。
- 可训练单位卡的横向可视区域、0/1/多个单位时的内容宽度，以及当前生产/等待队列横向显示。
- 后续通过 `UiPrefabWorkflowGenerator` 重建选择面板和造兵页 prefab 时的默认布局。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "RallyPointFloatingButton|m_SizeDelta: \\{x: 516, y: 252\\}|m_SizeDelta: \\{x: 444, y: 98\\}|m_SizeDelta: \\{x: 444, y: 50\\}|m_AnchoredPosition: \\{x: 58, y: -188\\}|m_AnchoredPosition: \\{x: 58, y: -168\\}" Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab Assets/Scripts/UI/SelectionPanel.cs Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `rg -n "value: 0\\.17|value: 0\\.48|value: 0\\.49|value: 0\\.77|value: 0\\.16|m_SizeDelta: \\{x: 420, y: 620\\}|value: 620" Assets/Resources/UI/Prefabs/InGame/SelectionActionPanel_Prefab.prefab Assets/Resources/UI/Prefabs/InGame/SelectionPanel_Prefab.prefab Assets/Scripts/UI/SelectionPanel.cs Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`

### 后续注意事项
- 本轮继续保持造兵内容页不包含 `RallyPointFloatingButton`，集结点仍属于建筑操作/tap 层。
- 下一步如果 Unity 运行态仍看不到单位卡，应优先检查具体建筑的 `ProductionCatalogUtility.ResolveTrainableUnits(building)` 是否返回了可训练单位数据。

## 2026-05-21 - 战斗 HUD 建造造兵科技树旧窗口入口收口

### 修改内容
- 单位选中后的建造入口不再打开旧 `BuildDevelopmentPanelUI` / `BuildDevelopmentRoot`，改为直接刷新 `SelectionPanel` 内嵌 `BuildingUnitProductionPage_Standalone` 建造列表。
- 建造卡横向内容宽度会按可见卡数量刷新，避免 0/1/多个建造项时滚动内容宽度不对。
- 建筑造兵、科技树、建筑树等普通 HUD 动作入口不再弹独立 `BuildingUnitProductionWindow` / `TechTreeRoot` / `BuildDevelopmentRoot` 旧窗口，统一停留在 `SelectionPanel` 内嵌造兵页、科技页和操作页。
- `GameUI` 的旧主面板打开链路改为清理旧窗口；`BuildMenuPanel`、`BuildDevelopmentRoot`、`BuildingUnitProductionWindow`、`TechTreeRoot` 宿主会被统一隐藏并关闭射线。
- 移动端 action bar 不再显示旧 `Build Menu`、`Production`、`Technology Tree` 入口，避免和内嵌选择面板重复。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 中单位建造页、建筑造兵页、建筑科技树页的打开路径。
- 旧 `BuildDevelopmentRoot`、`BuildingUnitProductionWindow`、`TechTreeRoot` 高级窗口宿主的运行时可见性。
- PC 与移动端选择对象后的建造/造兵/科技入口显示规则。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "SetMainPanel\\(MainHudPanel\\.(BuildMenu|ProductionMenu|TechTree)|OpenForBuilding\\(|techTreePanelUI\\.Open|buildDevelopmentPanelUI\\?\\.Open" Assets/Scripts/UI/GameUI.cs Assets/Scripts/UI/SelectionPanel.cs`

### 后续注意事项
- 当前普通战斗 HUD 入口已经收口到内嵌 prefab 页；后续如果确实需要全屏科技树或独立生产窗口，应新增明确入口和状态规则，不要再复用选择刷新时的自动打开链路。
- 造兵页、科技页具体视觉比例继续优先调整 `SelectionBuildingProductionPage_Prefab` 与 `SelectionBuildingTechTreePage_Prefab`，脚本只负责动态数据、显隐和点击。

## 2026-05-20 - 独立造兵窗口宿主识别与窗口壳兼容修复

### 修改内容
- 修复 `BuildingUnitProductionWindowUI` 将 `BuildingUnitProductionWindow` 外层宿主误判为 `UnitProductionPanel` 根的问题，改为优先绑定 `ProductionPagePanel`，只有在确实没有窗口壳时才退回旧的纯面板根识别。
- `BuildingUnitProductionWindowUI` 对 `PanelDepthShadow`、`PanelEdgeHighlight`、`BottomBorder` 改为非阻断 chrome 绑定：节点存在就应用样式，不存在时跳过，不再因为装饰节点缺失导致独立造兵窗口整窗初始化失败。
- `UiPrefabWorkflowGenerator` 的 `BuildingUnitProductionWindow` 生成链补齐 `ProductionPagePanel/PanelDepthShadow`、`ProductionPagePanel/PanelEdgeHighlight`、`NavHeader/BottomBorder`，保证后续重建出来的主 HUD 造兵窗口壳结构完整。

### 修改文件
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 中 `ContextLayer_AdvancedPanels/BuildingUnitProductionWindow` 的独立造兵窗口打开链路。
- `ProductionPagePanel`、`NavHeader`、`StandaloneUnitProductionPanel` 的运行时识别顺序。
- 后续通过生成器重建主 HUD 时的独立造兵窗口固定壳体结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "ProductionPagePanel|LooksLikeUnitProductionPanelRoot|BottomBorder|PanelDepthShadow|PanelEdgeHighlight" Assets\Scripts\UI\BuildingUnitProductionWindowUI.cs Assets\Scripts\Editor\UiPrefabWorkflowGenerator.cs`

### 后续注意事项
- 当前实际运行时主 HUD prefab 仍可能是旧资源，但脚本已能兼容缺少装饰节点的窗口壳，不会再因为 `PanelDepthShadow` / `BottomBorder` 缺失直接报错失效。
- 后续在 Unity 空闲时重建 `MainHudRoot_Prefab`，应确认 `BuildingUnitProductionWindow` 实例已同步带上 `PanelDepthShadow`、`PanelEdgeHighlight`、`BottomBorder` 三个固定节点。

## 2026-05-20 - HUD 纯 Layer 与造兵页操作按钮收口

### 修改内容
- 清理战斗 HUD 主 prefab 的 layer 节点职责，`TopLayer`、`LeftLayer`、`RightLayer`、`CenterLayer`、`ContextLayer`、`MobileLayer`、`OverlayLayer` 只保留层级管理与布局标记，不再带 `Image` / `CanvasRenderer` 等美术表现组件。
- `UiPrefabWorkflowGenerator` 同步改为生成纯 `RectTransform` HUD layer，避免后续重建 `MainHudRoot_Prefab` 时重新给 layer 加背景或可射线组件。
- `SelectionBuildingProductionPage_Prefab` 移除 `RallyPointFloatingButton`，HUD 内嵌造兵页只负责展示分类、可生产单位列表和生产队列。
- `UnitProductionPanel_Prefab` 移除 standalone 造兵窗口里的 `RallyPointButton` / `RallyPointStatus`，队列页收口为 `ProductionQueuePage`，列表和队列直接显示。
- `UnitProductionPanel` 删除 standalone 造兵页内部集结点按钮绑定逻辑，保留对旧 prefab 中 Rally 子节点的隐藏兼容，集结点操作统一走建筑动作区与移动端操作层。
- 更新 HUD 与造兵页相关 UI 文档，明确“内容页面不混入额外操作按钮，操作按钮放到 action/control 区域”的当前规则。

### 修改文件
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/InGame/UnitProductionPanel_Prefab.prefab`
- `docs/UI/游戏内UI预制体化规范.md`
- `docs/UI/HUD预制体开发规则.md`
- `docs/UI/建筑选中后的造兵页面UI详细规则文档.md`
- `docs/UI/造兵页面UI预制体布局结构说明.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 主 prefab 的 layer 结构与后续生成规则。
- HUD 内嵌造兵页与独立 `BuildingUnitProductionPage_Standalone` 的页面内容边界。
- 集结点等建筑操作入口的显示位置，PC 端走建筑动作区，移动端走 tap/action 操作层。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "RallyPointFloatingButton|RallyPointButton|RallyPointStatus|ProductionQueueAndRallyPage" Assets\Resources\UI\Prefabs\Components\SelectionBuildingProductionPage_Prefab.prefab Assets\Resources\UI\Prefabs\InGame\UnitProductionPanel_Prefab.prefab Assets\Scripts\UI\UnitProductionPanel.cs`
- `rg -n "GenericPanel|WorldHudItem|世界HUD|Prefab模板|可绑定数据|用途：|类型：" Assets\Resources\UI\Prefabs\Pages\MainHudRoot_Prefab.prefab Assets\Resources\UI\Prefabs\Components\SelectionBuildingProductionPage_Prefab.prefab Assets\Resources\UI\Prefabs\InGame\UnitProductionPanel_Prefab.prefab`

### 后续注意事项
- `UnitProductionPanel.cs` 中的 `ProductionQueueAndRallyPage` 仅作为旧 prefab 名称兼容 fallback 保留。
- `UnitProductionPanel.cs` 中的 `RallyPointButton` / `RallyPointStatus` 字符串仅用于隐藏旧 prefab 残留节点，不代表当前页面还会显示集结点按钮。
- 不要删除 `MobileActionBar` / 建筑动作区中的 Rally 动作入口；当前规则是“从造兵内容页移走”，不是取消集结点功能。

## 2026-05-20 - 战斗 HUD top 层小地图与目标提示排布继续优化

### 修改内容
- 继续优化战斗 HUD top 层固定模块的相对关系，资源条改为顶部居中，不再以左侧坐标占用小地图区域。
- `TopStatusBar` 运行时兜底布局同步为顶部居中，并调整 sibling 顺序，避免资源条盖在小地图和设置按钮上方。
- `ObjectiveHintPanel` 改为跟随小地图放在左上小地图下方，桌面端与移动端分别使用对应的 prefab/config 坐标兜底，避免与小地图重叠。
- `UiPrefabWorkflowGenerator` 与 `UiScreenLayoutConfig.asset` 同步写入 top 层推荐布局，后续重建 `MainHudRoot_Prefab` 时不会回到旧坐标。
- 确认移动端设置按钮仍复用 `TopLayer_ResourcesAndStatus/InGameSettingsButton`，旧 `MobileActionBar/SettingsActionButton` 保持 inactive。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Assets/Resources/UI/Configs/UiScreenLayoutConfig.asset`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 顶部资源条、小地图、目标提示、设置按钮的默认层级和位置关系。
- 移动端 top 层 HUD 的左上小地图与右上设置入口。
- 后续通过 `UiPrefabWorkflowGenerator` 重建主 HUD 与屏幕布局配置时的默认结果。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "ObjectiveHintPanel.*-84|new Vector2\\(18f, -84f\\)|new Vector2\\(22f, 0f\\)|TopStatusBar.*0f, 0\\.5f" Assets\\Scripts\\UI\\GameUI.cs Assets\\Scripts\\Editor\\UiPrefabWorkflowGenerator.cs Assets\\Resources\\UI\\Prefabs\\Pages\\MainHudRoot_Prefab.prefab Assets\\Resources\\UI\\Configs\\UiScreenLayoutConfig.asset`
- `rg -n "GenericPanel|WorldHudItem|世界HUD|Prefab模板|可绑定数据|用途：|类型：" Assets\\Resources\\UI\\Prefabs\\Pages\\MainHudRoot_Prefab.prefab Assets\\Resources\\UI\\Configs\\UiScreenLayoutConfig.asset`

### 后续注意事项
- 小地图的具体左上角偏移仍优先在 `MinimapCanvas_Prefab/MinimapPanel` 或 `UiScreenLayoutConfig.asset` 中调整。
- `ObjectiveHintPanel` 的位置应继续跟随小地图下沿调整，不要再恢复到 top 层左上较高位置。
- `TopStatusBar` 的视觉宽度和内部资源 chip 排布优先改 `ResourceHud_Prefab`，主 HUD 只负责整体 top 层停靠关系。

## 2026-05-20 - 移动端设置入口与小地图 top 层归位

### 修改内容
- 将战斗 HUD 的 `MinimapCanvas` 从 `RightLayer_MinimapAndAlerts` 移到 `TopLayer_ResourcesAndStatus`，小地图模块根改为 stretch，由 `MinimapCanvas_Prefab/MinimapPanel` 继续控制左上角具体位置。
- 移动端设置入口统一复用 `TopLayer_ResourcesAndStatus/InGameSettingsButton`，右上角显示，不再在 `MobileActionBar` 中创建或刷新 `Settings` action。
- `GameUI` 默认 HUD 层解析改为小地图走 top 层，运行时会隐藏并注销旧 `MobileActionBar/SettingsActionButton`。
- `UiPrefabWorkflowGenerator` 同步更新主 HUD 生成规则、小地图布局默认值，并停止生成移动 action bar 里的设置按钮。
- 当前 `MobileActionBar_Prefab` 中历史 `SettingsActionButton` 已设为 inactive，避免旧资源实例化时三处设置按钮同时显示。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/InGame/MobileActionBar_Prefab.prefab`
- `docs/UI/游戏内UI预制体化规范.md`
- `docs/UI/HUD预制体开发规则.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 移动端战斗 HUD 设置按钮入口。
- 小地图模块在主 HUD 内的父层级和默认位置。
- 后续重建 `MainHudRoot_Prefab` / `MobileActionBar_Prefab` 时的生成结果。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "CreateMobileActionButton\\(\"Settings\"|SetMobileActionButtonVisible\\(\"Settings\"|UpdateMobileActionButtonState\\(\"Settings\"" Assets/Scripts/UI/GameUI.cs Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `rg -n "GenericPanel|WorldHudItem|世界HUD|Prefab模板|可绑定数据|用途：|类型：" Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab Assets/Resources/UI/Prefabs/InGame/MobileActionBar_Prefab.prefab Assets/Resources/UI/Prefabs/Pages/MinimapCanvas_Prefab.prefab`

### 后续注意事项
- `MinimapPanel` 的具体左上角偏移仍优先在 `MinimapCanvas_Prefab` 或 `UiScreenLayoutConfig.asset` 中调整，不要在 `GameUI` 中硬写新坐标。
- 如果后续决定彻底删除旧 `SettingsActionButton` 节点，应在 Unity 空闲时通过 prefab 编辑器或生成器重建确认引用稳定；本轮先保持隐藏以降低 YAML 删除风险。

## 2026-05-20 - 选择信息页 prefab 宿主落地与属性卡宽度收敛

### 修改内容
- 继续优化单位和建筑选中信息页，把上一轮生成器中已补齐的 `ProgressRows` / `AttributeCards` 固定宿主实际落到 `SelectionInfoPanel_Prefab.prefab` 资源本体。
- `HPMPArea/ProgressRows` 与 `AttributeArea/AttributeCards` 现在是真实 prefab 子节点，并带有 `UiPrefabSlot` 与 `UiLayoutBinding` 标记，运行时不再必须依赖临时宿主兜底。
- 新增 `ResolveGridCardWidth(...)`，属性卡两列布局会按 `AttributeCards` 宿主实际宽度收敛，避免 `248px * 2 + spacing` 在当前内容槽里轻微溢出。
- 保留 `HealthText` / `AttributeText` 文本兜底；当血条或属性卡 prefab 缺失时仍能显示基础信息。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Resources/UI/Prefabs/InGame/SelectionInfoPanel_Prefab.prefab`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 左侧单位/建筑信息页的 HP 条显示宿主。
- 攻击、护甲、魔抗、射程、攻速、移速等属性卡的两列排布。
- `SelectionInfoPanel_Prefab` 后续在 Unity 中直接调整血条/属性卡宿主位置的生效边界。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "m_Name: (HPMPArea|ProgressRows|HealthText|AttributeArea|AttributeCards|AttributeText)|slotId: (ProgressRows|AttributeCards|HealthText|AttributeText)" Assets\Resources\UI\Prefabs\InGame\SelectionInfoPanel_Prefab.prefab`
- `rg -n "ResolveGridCardWidth|ProgressRows|AttributeCards|SelectionProgressRow|SelectionAttributeCard" Assets\Scripts\UI\SelectionPanel.cs Assets\Scripts\Editor\UiPrefabWorkflowGenerator.cs Assets\Resources\UI\Prefabs\InGame\SelectionInfoPanel_Prefab.prefab`

### 后续注意事项
- Unity 编辑器仍在运行并持有 `Temp/UnityLockfile`，本轮没有强行关闭编辑器，也没有跑 Unity batchmode 重建。
- 这次是窄范围 YAML 补齐真实 prefab 宿主；后续 Unity 空闲时仍可运行 `Tools/RTS/UI/Rebuild Selection Info Panel Prefab`，用于确认生成器输出和手工补丁一致。
- 若继续调视觉，优先改 `SelectionInfoPanel_Prefab`、`SelectionProgressRow_Prefab`、`SelectionAttributeCard_Prefab`，脚本只负责数据、显隐和动态列表排布。

## 2026-05-20 - 选择信息页血条与属性卡显示修复

### 修改内容
- 修复单位和建筑选中信息页中血量条、属性参数卡片不显示的问题。
- `SelectionPanel` 现在会把 `SelectionProgressRow_Prefab` 和 `SelectionAttributeCard_Prefab` 的根节点按运行时数据顺序重新排布，避免条目 prefab 根声明 preserve layout 后全部停在默认中心点或跑出宿主区域。
- `ProgressRows` / `AttributeCards` 缺失时，运行时临时宿主会被正确 stretch 到父区域，不再因为父级 preserve layout 继承而变成 0 尺寸容器。
- 血条或属性卡 prefab 成功实例化时隐藏旧文本兜底；如果 prefab 缺失或实例化失败，则保留 `HealthText` / `AttributeText` 显示原始信息，避免整块信息页空白。
- `UiPrefabWorkflowGenerator` 补齐 `SelectionInfoPanel_Prefab` 生成规则，在 `HPMPArea` 下生成 `ProgressRows`，在 `AttributeArea` 下生成 `AttributeCards`。
- 新增单独菜单入口 `Tools/RTS/UI/Rebuild Selection Info Panel Prefab`，用于只重建选择信息页和它依赖的血条/属性卡 prefab。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位选中后的左侧信息页 HP 条、攻击/护甲/魔抗/射程/攻速/移速属性卡。
- 建筑选中后的左侧信息页 HP 条、护甲/视野/生命/建筑类型属性卡。
- 后续重建 `SelectionInfoPanel_Prefab` 时的信息页固定动态宿主结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "RebuildSelectionInfoPanelPrefab|ProgressRows|AttributeCards|ResolveLayoutPreferredWidth|ResolveLayoutPreferredHeight|CreateInfoProgressRow|CreateInfoAttributeCard|createdRoot" Assets\Scripts\UI\SelectionPanel.cs Assets\Scripts\Editor\UiPrefabWorkflowGenerator.cs`

### 后续注意事项
- 当前 Unity 编辑器进程正在占用项目锁，本轮未强行关闭编辑器，也未强行删除 `Temp/UnityLockfile`。
- 当时实际资源文件尚未补上固定 `ProgressRows / AttributeCards` 宿主；后续任务已通过窄范围 prefab 资源补丁补齐。
- 即使实际 prefab 被旧资源覆盖，运行时代码仍能在缺宿主时创建正确尺寸的非最终宿主并显示血条/属性卡。

## 2026-05-20 - 机械改造页分类栏状态与空态继续优化

### 修改内容
- 继续优化机械阵营改造页面的分类栏和空态表现。
- `SelectionPanel` 现在会按当前选中单位/建筑的真实机械改造模块列表刷新分类 Tab 状态。
- 当前分类在当前目标下没有模块时，会自动回退到 `All`，避免分类高亮和列表内容错位。
- 机械改造分类 Tab 会控制 `Image_SelectedLine` 的显隐，并按分类是否有内容控制按钮可交互状态；`Image_NewDot` 默认隐藏，等待后续新模块提示数据接入。
- `MechanicalGridContent/EmptyLabel` 现在会强制 `ignoreLayout`，只在可见改造卡数量为 0 时显示，避免空态文本参与横向布局挤压卡片。
- 空列表时 `MechanicalGridContent` 会临时按 viewport 尺寸撑开并关闭 `ContentSizeFitter` fit，避免空态提示被 0 宽内容裁切；有卡片时恢复横向 preferred size。
- `ProductionCategoryTab_Prefab` 补齐 `Image_SelectedLine` 和 `Image_NewDot` 固定节点。
- `ProductionCategoryTabPrefabView` 与 `UiPrefabWorkflowGenerator` 同步补齐分类 Tab 状态节点引用和生成规则。
- 独立造兵窗口的分类 Tab 也开始绑定 `SelectedLine/NewDot`，保持共用 prefab 的状态节点可用。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/ProductionCategoryTabPrefabView.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/ProductionCategoryTab_Prefab.prefab`
- `docs/UI/机械改造页面UI预制体布局结构说明.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 机械建筑和机械单位改造页的分类 Tab 状态、分类切换和空态显示。
- 共用的 `ProductionCategoryTab_Prefab`，会影响建造页、机械改造页和独立造兵窗口分类 Tab 的固定状态节点。
- 后续通过 `UiPrefabWorkflowGenerator` 重建 `ProductionCategoryTab_Prefab` 时的分类状态结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "Image_SelectedLine|Image_NewDot|SelectedLine|NewDot" Assets\Scripts\UI\ProductionCategoryTabPrefabView.cs Assets\Scripts\Editor\UiPrefabWorkflowGenerator.cs Assets\Resources\UI\Prefabs\Components\ProductionCategoryTab_Prefab.prefab`

### 后续注意事项
- `Image_NewDot` 本轮只补固定节点和默认隐藏逻辑；如果要做“新解锁模块/单位/建筑”提示，需要先明确数据来源再接显隐。
- 机械改造分类 Tab 的颜色和尺寸应继续在 `ProductionCategoryTab_Prefab` 中调整，代码只负责选中、禁用、显隐状态。

## 2026-05-20 - 机械改造页可改造列表显示修复

### 修改内容
- 修复机械阵营改造页面中“可以改造的列表”不显示的问题。
- `SelectionPanel` 现在刷新机械改造卡时只清理 `mechanicalModButtonViews` 对应的动态卡，不再调用整页动态按钮清理，避免误删造兵、科技或普通动作页动态内容。
- `MechanicalGridContent` 运行时会统一规范为左上锚点 / 左上 pivot，并重新绑定 `MechanicalGridViewport` 的 `ScrollRect.content`。
- 机械改造卡刷新后会按可见卡数量写入 `MechanicalGridContent.sizeDelta`，确保横向滚动列表真实覆盖全部卡片。
- 旧机械卡销毁前会先改名为 `_PendingDestroy`，避免同一帧重建同名卡时被 `Transform.Find` 误复用到待销毁对象。
- `SelectionBuildingControlPage_Prefab` 中 `MechanicalCategoryTabsContent`、`MechanicalSlotsContent`、`MechanicalGridContent` 改为左上基准。
- `UiPrefabWorkflowGenerator` 同步补齐机械改造页横向 Content 基准和 `ScrollRect` 绑定修复逻辑，后续重建 prefab 不会打回旧布局。
- 更新机械改造 prefab 布局文档，记录列表宿主、滚动绑定和排查规则。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingControlPage_Prefab.prefab`
- `docs/UI/机械改造页面UI预制体布局结构说明.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 机械建筑和机械单位改造页的分类栏、槽位栏、可改造模块横向列表。
- `MechanicalGridViewport/MechanicalGridContent` 的滚动内容绑定和动态卡片显示。
- 后续通过 `UiPrefabWorkflowGenerator` 重建 `SelectionBuildingControlPage_Prefab` 时的机械改造页结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "MechanicalCategoryTabsContent|MechanicalGridContent|MechanicalSlotsContent|m_Pivot: \{x: 0, y: 1\}" Assets\Resources\UI\Prefabs\Components\SelectionBuildingControlPage_Prefab.prefab`

### 后续注意事项
- 本轮修复的是“有机械改造定义但列表 UI 不显示/被裁剪/同帧销毁”的 HUD 绑定问题；如果某个机械建筑确实没有任何模块，还需检查 `MechanicalModificationUtility` 的适用 token 和科技解锁条件。
- `docs/UI/机械族单位与建筑改造页面UI详细规则文档.md` 历史编码不是纯 UTF-8，本轮未强行改写，避免整文件编码被洗掉；规则补充已写入 `机械改造页面UI预制体布局结构说明.md`。

## 2026-05-19 - 造兵页生产队列结构继续 prefab 化

### 修改内容
- 继续收口 HUD 内嵌造兵页，把生产队列区从旧的单一横向 `ProductionQueueContent` 进一步拆成 prefab 固定结构。
- `SelectionBuildingProductionPage_Prefab` 现在真实包含：
  - `ProductionQueueContent/CurrentProduction`
  - `ProductionQueueContent/WaitingQueueViewport/WaitingQueueContent`
  - `ProductionQueueContent/EmptyLabel`
- `SelectionPanel` 现在优先绑定 `WaitingQueueViewport`，当前生产槽固定在左侧，等待队列只在右侧独立滚动槽内横向滚动。
- `SelectionPanel` 清理队列时只清动态条目，不再误删 `CurrentProduction / WaitingQueueViewport / WaitingQueueContent / EmptyLabel` 等 prefab 固定节点。
- `UiPrefabWorkflowGenerator` 补齐造兵页队列结构生成与修复逻辑，并新增单独重建造兵页 prefab 的菜单入口。
- 造兵页默认尺寸同步收口：根高度调整为 `516 x 252`，造兵卡区为 `444 x 98`，生产队列区为 `444 x 50`。
- 更新造兵页规则文档，明确推荐结构与旧结构兼容边界。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `docs/UI/建筑选中后的造兵页面UI详细规则文档.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击拥有造兵功能的建筑后，HUD 内嵌造兵页的生产队列显示。
- 当前生产项、等待生产项、空队列提示的 prefab 绑定结构。
- 等待队列多项横向滚动时的内容宽度与滚动槽绑定。
- 后续通过 `UiPrefabWorkflowGenerator` 重建 `SelectionBuildingProductionPage_Prefab` 时的队列固定结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "CurrentProduction|WaitingQueueViewport|WaitingQueueContent|EmptyLabel" Assets\Resources\UI\Prefabs\Components\SelectionBuildingProductionPage_Prefab.prefab`
- `rg -n "GenericPanel|WorldHudItem|世界HUD|Prefab模板|可绑定数据|用途：|类型：" Assets\Resources\UI\Prefabs\Components\SelectionBuildingProductionPage_Prefab.prefab`

### 后续注意事项
- Unity batchmode 重建本轮多次被 `Library/ArtifactDB` 锁拦截，最终对 `SelectionBuildingProductionPage_Prefab.prefab` 做了窄范围 YAML 补丁；后续首次打开 Unity 后建议检查该 prefab 是否正常反序列化，并可在锁释放后运行 `Tools/RTS/UI/Rebuild Selection Building Production Page Prefab`。
- 进入运行态后建议重点测试三种状态：空队列、只有当前生产、当前生产加多个等待项。
- 若继续微调生产队列视觉，优先改 `SelectionBuildingProductionPage_Prefab` 和 `ProductionQueueEntry_Prefab`，不要把固定位置和样式重新写回脚本。

## 2026-05-19 - 造兵页单位列表显示修复

### 修改内容
- 修复建筑造兵页中“可创造单位列表”不显示的问题。
- `SelectionPanel` 现在在刷新 HUD 内嵌造兵列表时会规范化 `ProductionGridContent` 的滚动内容基准，确保它固定使用左上锚点和左上 pivot。
- `LayoutPcProductionCatalog()` 现在会在存在 `PcQuickTrain_*` 训练卡时重新激活 `ProductionGridViewport` / `ProductionGridContent`，把 `ScrollRect.content` 指回 `ProductionGridContent`，并按训练卡数量写入可滚动内容宽度。
- `UiPrefabWorkflowGenerator` 更新 `SelectionBuildingProductionPage_Prefab` 生成逻辑，保证 `BuildCategoryTabsContent`、`ProductionGridContent`、`ProductionQueueContent` 后续重建时仍保持左上 pivot。
- 手工修正 `SelectionBuildingProductionPage_Prefab` 中三个滚动 Content 节点的 pivot，保留 Viewport 本体布局由 prefab 控制。
- 补充造兵页规则文档，记录单位列表滚动内容根的绑定和排查规则。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `docs/UI/建筑选中后的造兵页面UI详细规则文档.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击拥有造兵功能的建筑后，HUD 内嵌造兵页的单位卡列表显示。
- `ProductionGridViewport` 横向滚动内容绑定与训练卡布局。
- 后续通过 `UiPrefabWorkflowGenerator` 重建造兵页 prefab 时的滚动内容基准。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- 检查 `SelectionBuildingProductionPage_Prefab` 中 `BuildCategoryTabsContent`、`ProductionGridContent`、`ProductionQueueContent` 的 `m_Pivot` 为 `{x: 0, y: 1}`。

### 后续注意事项
- 本轮修复的是“有可训练单位但训练卡列表不可见”的 HUD 列表绑定/布局问题；如果某个建筑本身没有任何可训练单位，仍需要检查阵营科技树或建筑数据。
- 进入 Unity 运行态时建议重点选中一个确认有 `ProductionQueue` 和训练单位配置的建筑，观察 `ProductionGridViewport` 是否能横向滚动显示所有训练卡。

## 2026-05-19 - 战斗 HUD 设置入口去重

### 修改内容
- 处理战斗 HUD 中设置按钮重复显示的问题，明确 PC 与移动端设置入口互斥。
- `GameUI` 现在直接复用 `MainHudRoot_Prefab/TopLayer_ResourcesAndStatus/InGameSettingsButton` 本体，不再在同名 prefab 槽下额外创建第二个按钮。
- 新增运行时重复设置按钮清理：若 HUD 内存在多余同名 `InGameSettingsButton`，会隐藏非首选实例。
- PC HUD 下显示唯一 `InGameSettingsButton`；移动 HUD 下隐藏 PC 设置按钮，只保留 `MobileActionBar` 内的 `SettingsActionButton`。
- `UiPrefabWorkflowGenerator` 重建主 HUD 时，将嵌套的 `MobileActionBar` 默认设为 inactive，避免 PC 初始态把移动端设置入口一起亮出来。
- 重新运行 Unity prefab 重建，确认 `MainHudRoot_Prefab` 内只有 1 个 `InGameSettingsButton`，且不直接展开 `SettingsActionButton`。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/InGame/MobileActionBar_Prefab.prefab`
- `Assets/Resources/UI/Configs/UiPrefabLibrary.asset`
- `Assets/Resources/UI/UiPrefabMigrationReport.txt`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 桌面端设置按钮显示与点击绑定
- 移动端 `MobileLayer_TouchControls/MobileActionBar` 设置入口显示
- `RightLayer_MinimapAndAlerts` 不再承载设置按钮入口

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- Unity batchmode 执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildModularScreenPrefabs`
- `Select-String` 确认 `MainHudRoot_Prefab.prefab` 中 `m_Name: InGameSettingsButton` 仅 1 个
- `Select-String` 确认 `MainHudRoot_Prefab.prefab` 中 `m_Name: SettingsActionButton` 为 0 个
- 检查 `MainHudRoot_Prefab` 对嵌套 `MobileActionBar` 的 override：`propertyPath: m_IsActive` / `value: 0`

### 后续注意事项
- `MobileActionBar_Prefab` 本体仍保留 `SettingsActionButton`，这是移动端入口，不应删除；真正需要保证的是它只在移动 HUD 条件下打开。
- 如果后续要把设置入口改到右上角或小地图旁，应只移动唯一 `InGameSettingsButton` 的 prefab 位置，不要在 `RightLayer_MinimapAndAlerts` 再补第二个按钮。
- Unity 日志仍提示 `LiberationSans SDF - Fallback` 字体资产序列化信息，本轮未发现 `Assets/TextMesh Pro` 下字体资源被实际改写。

## 2026-05-19 - 科技页预制体布局继续扩容收口

### 修改内容
- 继续围绕建筑科技页的底部 HUD 形态收口，重点修正“科技卡规格已经放大，但科技列表视口和内容区仍偏矮”的问题。
- 扩大 `SelectionBuildingTechTreePage_Prefab` 的整体高度，并同步下移研究队列区，让科技列表区真正获得更接近文档建议值的可视高度，不再像被压扁的横条。
- 提高 `ResearchGridViewport` 与 `ResearchGridContent` 的高度，配合当前科技卡规格，减少卡片在滚动列表中的裁切感。
- 继续细化分类栏：略微加高分类滚动区域、补上左右内边距和更合理的横向间距，让紧凑 tab 排布不再发挤。
- 略微提高 `CurrentResearch` 模板高度，并同步扩大研究队列视口高度，让当前研究条在底部队列区里更稳。

### 修改文件
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingTechTreePage_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 科技页中部横向科技卡列表的可视高度和滚动阅读体验
- 分类 tab 在分类栏内的排布留白
- 当前研究条与研究队列区在底部 HUD 中的占位稳定性

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 检查关键节点命名保持不变：`ResearchCategoryTabsViewport`、`ResearchCategoryTabsContent`、`ResearchGridViewport`、`ResearchGridContent`、`ResearchQueueViewport`、`ResearchQueueContent`、`CurrentResearch`

### 后续注意事项
- 这轮仍然只调 prefab 默认布局，没有恢复任何旧运行时可见 fallback，也没有新增等待研究队列的运行时绑定逻辑。
- 后续如果继续精修，优先建议在 Unity 运行态观察“科技较多时横向滚动”“当前研究进行中”“空研究队列”三种状态下的新高度是否足够，再决定是否继续细调科技卡本体高度。

## 2026-05-19 - 科技页预制体布局继续收紧

### 修改内容
- 继续围绕建筑科技页的底部紧凑 HUD 形态做排版收口，优先修正 prefab 内部真实布局尺寸与视觉尺寸不一致的问题。
- 修正 `TechBranchTab_Prefab` 的 `LayoutElement` 仍停留在旧 `180x48` 的问题，让分类 tab 在滚动容器里真正按新规格 `132x40` 排布，并同步下调标签字号，减少分类栏拥挤感。
- 继续细调 `ResearchButton_Prefab` 的卡片纵向节奏：略微拉高卡片高度，重新分配标题区与消耗区的底部占位，减轻标题、图标、消耗三层之间的挤压。
- 微调 `SelectionBuildingTechTreePage_Prefab` 的分类栏和科技卡横向列表间距，并提升研究队列标题字号，让上中下三个区域的层级更稳定。

### 修改文件
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingTechTreePage_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/ResearchButton_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/TechBranchTab_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 科技分类 tab 在横向滚动栏中的实际占位与滚动节奏
- 科技卡标题、图标、资源消耗三层内容的默认阅读顺序
- 科技页分类栏、科技卡区、研究队列标题的整体视觉密度

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 检查关键节点命名保持不变：`ResearchCategoryTabsContent`、`ResearchGridContent`、`ResearchQueueTitle`、`Label`、`CostRow`、`TechBranchTab_Prefab`

### 后续注意事项
- 这轮仍然只收口 prefab 默认布局，没有恢复任何旧运行时可见 fallback，也没有改动科技页的绑定节点名。
- `ResearchQueueContent` 目前仍主要承载 `CurrentResearch` 与 `EmptyLabel`，如果后续要继续加入等待研究队列，优先补 prefab 固定节点与绑定逻辑，不要再回到旧式动态拼面板。

## 2026-05-19 - 科技页预制体布局继续优化

### 修改内容
- 继续按 `Docs/UI/科技页面UI预制体布局结构说明.md` 与 `Docs/UI/建筑选中后的科技树页面UI详细规则文档.md` 优化建筑科技页的 prefab 默认布局。
- 调整 `SelectionBuildingTechTreePage_Prefab` 的整体高度、分类栏、科技卡列表区与当前研究区的空间分配，让科技页更接近“中下方紧凑 HUD 面板”的目标，而不是压扁的旧布局。
- 修正科技页三个 `ScrollRect` 的 `Viewport` 引用，并把科技列表区切回横向滚动，避免裁剪和滚动方向与文档目标不一致。
- 提升 `CurrentResearch` 模板的可读性：放大图标、拉开名称/状态/剩余时间/进度条与进度百分比之间的间距，让当前研究条不再过度拥挤。
- 收紧 `TechBranchTab_Prefab` 的宽高，避免分类按钮过宽挤占主内容区。
- 微调 `ResearchButton_Prefab` 的卡片尺寸、标题区与图标区比例，让科技卡更像独立卡片并与造兵页卡片尺度更接近。

### 修改文件
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingTechTreePage_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/ResearchButton_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/TechBranchTab_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击拥有科技功能的建筑后出现的 HUD 内嵌科技页默认布局
- 科技分类栏的横向排布密度
- 科技卡片的默认视觉比例与横向滚动阅读体验
- 当前研究区与空状态文案的占位和可读性

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 检查 prefab 关键节点名保持不变：`ResearchSectionTitle`、`ResearchCategoryTitle`、`ResearchCategoryTabsViewport`、`ResearchGridViewport`、`ResearchQueueViewport`、`ResearchQueueContent`、`CurrentResearch`、`EmptyLabel`

### 后续注意事项
- 这轮仍然只调整 prefab 默认布局，没有恢复任何旧的运行时可见 fallback。
- 当前研究队列逻辑在 `SelectionPanel` 中仍主要只绑定 `CurrentResearch` 与 `EmptyLabel`，还没有补成“当前研究 + 等待研究队列”完整结构；如果后续要继续扩展等待队列展示，优先补 prefab 固定节点和绑定逻辑，不要再回到旧式运行时拼 UI。
- 建议后续进入 Unity 运行态继续观察三种真实状态：无研究、研究进行中、科技数量较多横向滚动时的卡片密度，再决定是否继续压缩分类 tab 或进一步拉高研究页。

## 2026-05-19 - 科技页预制体布局继续细化

### 修改内容
- 在上一轮科技页 prefab 收口基础上继续补强观感层级，重点细化科技卡的状态表达与当前研究区、空状态的阅读感。
- `ResearchButton_Prefab` 继续放大为更稳定的科技卡尺寸，补强图标区、状态角标、时间标记、状态说明和底部进度条的占位，让锁定/警告/已研究等状态更容易在卡片上落位。
- `SelectionBuildingTechTreePage_Prefab` 继续提升空状态文案与进度百分比文本的可读性，减少不必要的射线拦截，避免静态文本层影响交互。
- 维持 `TechBranchTab_Prefab` 的紧凑尺寸，同时微调默认底色，让分类条在科技页上方更统一，不抢主内容注意力。

### 修改文件
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingTechTreePage_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/ResearchButton_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/TechBranchTab_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 科技卡在“锁定 / 警告 / 说明 / 研究中”几种状态下的默认视觉承载能力
- 科技页空状态提示与当前研究进度文本的观感
- 科技分类条与科技卡区域之间的整体视觉统一性

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 检查科技卡和科技页关键节点仍保持原命名：`Label`、`CostRow`、`Icon`、`StatusBadge`、`TimeLabel`、`ProgressBar`、`Text_StateReason`、`ResearchQueueContent`、`CurrentResearch`、`EmptyLabel`

### 后续注意事项
- 这轮仍然没有扩写研究等待队列逻辑，只是在 prefab 上把科技卡状态承载能力和当前研究区观感继续做实。
- 如果后续要继续优化，优先建议在 Unity 运行态实际观察四类科技状态：可研究、资源不足、未解锁、研究中，确认 `Text_StateReason` 与角标是否真的被运行时逻辑利用，再决定是否继续加深状态层样式。

## 2026-05-19 - 造兵页预制体布局继续微调

### 修改内容
- 继续按 `Docs/UI/造兵页面UI预制体布局结构说明.md` 优化 HUD 内嵌造兵页的预制体默认布局，进一步把视觉重心收回 prefab。
- 调整 `SelectionBuildingProductionPage_Prefab` 的造兵卡区与生产队列区比例，给右侧集结点按钮让出更明确的独立区域。
- 收紧 `ProductionQueueContent` 内部的“当前生产 / 等待队列”默认宽度占比，让当前生产卡更稳、等待队列更容易横向扩展。
- 微调集结点按钮默认位置和尺寸，让它更像页面右侧独立功能钮，而不是压在线性内容区边上。

### 修改文件
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击造兵建筑后出现的 HUD 内嵌造兵页默认布局
- 生产队列区与造兵卡区的空间分配
- 集结点按钮在造兵页中的视觉落点

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 检查 `SelectionBuildingProductionPage_Prefab` 中 `CurrentProduction`、`WaitingQueueContent`、`EmptyLabel`、`RallyPointFloatingButton` 的节点仍存在且命名不变

### 后续注意事项
- 这轮仍然只动 prefab 默认布局，没有恢复任何旧运行时可见 fallback。
- 后续若继续精修，优先在 Unity 运行态看“空队列 / 单项生产 / 多项排队”三种状态下的真实占位，再决定是否继续压缩 `ProductionQueueEntry_Prefab` 细节。

## 2026-05-19 - 造兵页预制体布局继续收口

### 修改内容
- 继续按 `Docs/UI/造兵页面UI预制体布局结构说明.md` 收口 HUD 内嵌造兵页，旧的空壳式队列布局开始真正切回 prefab 主导结构。
- `SelectionBuildingProductionPage_Prefab` 补齐并接通新的生产队列固定节点：
- `ProductionQueueContent/CurrentProduction`
- `ProductionQueueContent/WaitingQueueContent`
- `ProductionQueueContent/EmptyLabel`
- 调整造兵页主面板的列表区、队列区与右侧集结点按钮布局尺寸，让页面更接近“上队列、下横向造兵卡、右侧独立集结点”的文档目标。
- `SelectionPanel` 继续收口造兵页运行时布局覆盖边界：
- 结构化队列内容区改为按布局层级判断是否保留 prefab 布局。
- 空队列提示改为优先显示“队列为空”文案。
- 队列条目在结构化队列下补齐 `LayoutElement` 尺寸，避免被旧默认宽度拖坏。
- 优化 `BuildingProductionButton_Prefab` 的卡片比例，让单位名、单位图和资源消耗的层次更清楚。
- 优化 `ProductionQueueEntry_Prefab` 的宽度和信息区占比，让当前生产与等待队列共用同一组件时更易读。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/BuildingProductionButton_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/ProductionQueueEntry_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击造兵建筑后出现的 HUD 内嵌造兵页
- 造兵队列的“当前生产 / 等待队列 / 空状态”显示结构
- 造兵卡的图文比例与资源区排布
- 集结点按钮在造兵页中的相对布局位置

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 检查 prefab 关键节点名：`CurrentProduction`、`WaitingQueueContent`、`EmptyLabel`、`RallyPointFloatingButton`

### 后续注意事项
- 这轮已经把造兵页队列结构补回 prefab，但 `SelectionPanel` 里仍保留页面级标题和区块显隐控制；后续如果继续细调视觉，优先改 prefab，不要再把静态位置写回脚本。
- `SelectionBuildingProductionPage_Prefab` 当前已经适合继续在 Unity 中做细节微调，例如队列边框、背景图层、集结点按钮图标和空状态文案样式。
- 仍建议进 Unity 运行态检查两类情况：空队列时是否只显示 `EmptyLabel`；有当前生产和等待队列时，`CurrentProduction` 与 `WaitingQueueContent` 是否按预期分区显示。


## 2026-05-19 - HUD旧式运行时UI创建继续清理

### 修改内容
- 延续上一轮 HUD 预制体化清理，继续排查“旧式运行时拼 UI”与“界面未打开却露出底图”的来源。
- `GameUI` / `BuildDevelopmentPanelUI` / `TechTreePanelUI` / `BuildingUnitProductionWindowUI` / `UnitProductionPanel` 的上一轮清理结果补齐到本次任务记录：
  - 高级 HUD 页面宿主在启动时先强制隐藏
  - 缺失 HUD prefab 宿主时不再偷偷回退到独立 runtime canvas
  - 缺失关键固定节点时不再补出可见旧页面壳
- `BattleAlertUI` 改为严格依赖 HUD/prefab 宿主：
  - 不再创建 `BattleAlertCanvas`、`GateAlertBanner`、`CombatStatusPanel`、`CombatAlertFeed`、`CombatFeedEntry`、边缘闪烁条的可见 runtime fallback
  - `CombatStatusPanel` 改为仅在“重压 / 推进 / 低血量提示”时激活，空闲态不再常驻显示底板
- `OperationDetailCardView` 不再在缺失 `OperationDetailCard` prefab 时创建运行时详情卡根面板。
- `BuildingResearchPanel` 不再在缺失 `ResearchButton` prefab 时创建运行时研究卡。
- `SelectionPanel` 收紧建筑右侧页显隐：
  - 不再因为“只是选中了建筑”就强行显示右侧建筑操作壳
  - 只有建造、造兵、研究、建筑操作、机械改造等真实内容存在时才显示对应右侧页
  - 关闭静态页时会额外隐藏生产/研究队列视口与机械改造页，避免残留底图
- 更新 `Docs/UI/HUD运行时UI旧创建清理补充说明.md`，记录第二轮继续收口的模块和可见问题来源。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Assets/Scripts/UI/OperationDetailCardView.cs`
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/UI/HUD运行时UI旧创建清理补充说明.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 高级页面宿主的启动显隐
- 造兵页 / 科技页 / 建造详情页缺失 prefab 节点时的降级行为
- 战斗预警条、战斗态势提示、战斗播报条目的显示方式
- 操作详情卡、研究卡在 prefab 缺失时的显示行为
- `SelectionPanel` 右侧建筑页在空内容状态下的容器显隐

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- `BuildingProductionUI` 仍保留较多页面级固定结构自动补建逻辑，下一轮应继续按 prefab 节点逐块清理。
- 当前 `BuildingProductionPanel_Prefab` / `BuildingDetailsPanel_Prefab` 里还缺少不少 `BuildingProductionUI` 依赖的固定子节点命名，不能直接把该脚本的所有结构性 fallback 一次性删光；应先按节点清单补齐 prefab，再继续收紧。
- `SelectionPanel` 右侧建造/研究/功能页仍需继续排查无内容状态下的根节点显隐，确认不会再只剩背景图。
- 本轮 `BattleAlertUI` 已经去掉空闲态常驻底板，但仍建议在 Unity 场景中实测“开局无警报”“受压”“推进”“低血量提示”三类状态切换。

## 2026-05-18 - HUD造兵页面队列结构收口

### 修改内容
- 继续按新增的“造兵页面UI预制体布局结构说明”收口点击建筑后的 HUD 造兵页。
- SelectionPanel 新增对造兵队列固定模板节点的识别，优先绑定：
  - ProductionQueueContent/CurrentProduction
  - ProductionQueueContent/WaitingQueueContent
  - ProductionQueueContent/EmptyLabel
- 造兵队列刷新逻辑改为“当前生产槽 + 等待队列”两段式绑定：
  - 第 0 项单独绑定到当前生产槽
  - 第 1 项及以后绑定到等待队列
  - 空队列时优先显示 EmptyLabel
- 收紧 RallyPointFloatingButton 的样式覆盖边界；若 prefab 已保留样式，代码不再强改按钮文字样式。
- 更新 HUD 和造兵页规则文档，明确造兵页内部固定布局由 prefab 维护，代码只做数据绑定和显隐。

### 修改文件
- Assets/Scripts/UI/SelectionPanel.cs
- Docs/UI/建筑选中后的造兵页面UI详细规则文档.md
- Docs/UI/HUD预制体开发规则.md
- Docs/05_TASK_LOG.md

### 新增文件
- 无

### 影响范围
- 战斗 HUD 中点击造兵建筑后出现的内嵌造兵页面
- 造兵队列显示方式
- 集结点按钮运行时样式覆盖边界

### 验证方式
- dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false

### 后续注意事项
- 当前代码已支持新结构，但 SelectionBuildingProductionPage_Prefab 仍需要在 Unity 中补齐 CurrentProduction / WaitingQueueContent / EmptyLabel 这些固定节点，才能完整切换到新队列布局。
- 在 prefab 补齐这些节点前，运行时会继续兼容旧的横向队列 fallback，以保证不崩。
鏈枃浠惰褰曟瘡娆′换鍔＄殑瀹為檯淇敼鍐呭銆佸奖鍝嶈寖鍥村拰楠岃瘉鏂瑰紡銆?
## 2026-05-15 - 鍗曚綅寤虹瓚澶撮《 HUD銆佹妧鑳藉啋娉°€佷激瀹宠烦瀛楅鍒朵綋鍖栨暣鐞?
### 淇敼鍐呭
- 琛ラ綈 `AGENTS.md` 瑕佹眰鐨勫熀纭€寮€鍙戞枃妗ｃ€?- 澶撮《 HUD 鏀逛负蹇呴』浣跨敤 `WorldHudItem_Prefab`锛岀己 Prefab 鎴栧叧閿妭鐐规椂鍙姤閿欙紝涓嶅啀鍒涘缓鏃х殑鍙 UI銆?- 鎶€鑳藉枈鍚嶅啋娉¤ˉ鍏?`Background`銆乣Accent`銆乣TypeLabel`銆乣MergeCount` 绛夊彲閰嶇疆鑺傜偣銆?- 浼ゅ璺冲瓧鏀逛负 `DamagePopupData` 鏁版嵁鍏ュ彛锛屾敮鎸佺被鍨嬫爣绛俱€佸己搴﹀垎绾с€佽嚧鍛芥爣璁般€佸彂鍏夎妭鐐瑰拰 prefab 鍖栧瓙鑺傜偣銆?- 鏂板涓撶敤 Unity batch 閲嶅缓鍏ュ彛 `RebuildOverheadCombatFeedbackPrefabs`锛屽彧閲嶅缓鏈涓変釜鐩爣 Prefab銆?
### 淇敼鏂囦欢
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Assets/Scripts/UI/SkillCalloutBubbleManager.cs`
- `Assets/Scripts/Combat/CombatVisualManager.cs`
- `Assets/Scripts/Combat/AttackManager.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/InGame/WorldHudItem_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/DamagePopupItem_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/SkillCalloutBubble_Prefab.prefab`
- `Assets/Resources/UI/Configs/UiPrefabLibrary.asset`

### 鏂板鏂囦欢
- `Docs/00_PROJECT_OVERVIEW.md`
- `Docs/01_ARCHITECTURE.md`
- `Docs/02_CODING_RULES.md`
- `Docs/03_UI_RULES.md`
- `Docs/04_ASSET_RULES.md`
- `Docs/UI/HUD鍗曚綅寤虹瓚澶撮《HUD妯″潡.md`
- `Docs/UI/HUD鎶€鑳藉枈鍚嶅啋娉″疄鐜版枃妗?md`
- `Docs/UI/HUD浼ゅ璺冲瓧瀹炵幇鏂囨。.md`

### 褰卞搷鑼冨洿
- 鎴樻枟涓崟浣?寤虹瓚澶撮《琛€鏉°€佸悕瀛椼€佺姸鎬佽銆?- 鍗曚綅鎶€鑳介噴鏀炬椂鐨勫ご椤跺枈鍚嶅啋娉°€?- 鏀诲嚮浼ゅ璺冲瓧鐨勬樉绀虹粨鏋勩€侀鑹层€佹爣绛惧拰瀵硅薄姹犳潯鐩€?
### 楠岃瘉鏂瑰紡
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- Unity batch 鎵ц `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildOverheadCombatFeedbackPrefabs`
- 鎵弿鐩爣 Prefab 鑺傜偣锛歚NumberText|TypeTag|CritMark|Glow|MergeCount|TypeLabel|Accent|Background|HpFill|StatusProgressText`

### 鍚庣画娉ㄦ剰浜嬮」
- 鏁翠綋 `RebuildModularScreenPrefabs` 浠嶄細閬囧埌鍘嗗彶缂哄け鑴氭湰锛歚SelectionPanel_Prefab/GroupShortcutContent`銆傛湰娆′笓鐢ㄥ叆鍙ｅ凡缁曞紑锛屽悗缁暣鐞?SelectionPanel 鏃堕渶瑕佸崟鐙竻鐞嗚缂哄け鑴氭湰銆?- 鑻ョ户缁帴鍏ユ毚鍑汇€佹不鐤椼€佹姢鐩剧瓑鏇寸粏鎴樻枟缁撴灉锛屽簲浼樺厛鎵╁睍 `DamagePopupData`锛屼笉瑕佸洖閫€鍒版牴 Text 璺冲瓧銆?
## 2026-05-15 - HUD CanvasGroup 缂哄け鎶ラ敊淇

### 淇敼鍐呭
- 淇 `InGameSettingsUI.Rebuild()` 鍦ㄥ鐢?HUD 瀹瑰櫒鏃惰闂己澶?`CanvasGroup` 瀵艰嚧鐨?`MissingComponentException`銆?- 淇 `MinimapUI.UpdateVisibility()` 鍦ㄥ鐢?HUD 瀹瑰櫒鏃惰闂己澶?`CanvasGroup` 瀵艰嚧鐨?`MissingComponentException`銆?- 涓や釜鑴氭湰鏂板 `EnsureCanvasGroup()`锛屾瘡娆℃樉闅愬墠閮戒細閲嶆柊鏍￠獙骞惰ˉ榻愮粍浠躲€?
### 淇敼鏂囦欢
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/MinimapUI.cs`
- `Docs/05_TASK_LOG.md`

### 鏂板鏂囦欢
- 鏃犮€?
### 褰卞搷鑼冨洿
- 鎴樻枟鍐呰缃寜閽?鏆傚仠璁剧疆闈㈡澘鏄鹃殣銆?- 灏忓湴鍥?HUD 鏄鹃殣銆?
### 楠岃瘉鏂瑰紡
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 鍚庣画娉ㄦ剰浜嬮」
- 濡傛灉鍦烘櫙閲岀殑椤跺眰 `HUD` 瀵硅薄缁х画浣滀负澶氫釜妯″潡瀹夸富锛屽悗缁柊鑴氭湰璁块棶 `CanvasGroup` 鍓嶄篃蹇呴』璧板悓绫诲厹搴曟柟娉曘€?
## 2026-05-15 - 寤洪€犮€侀€犲叺銆佺鎶€鏍戣鎯呴〉鎸夌粺涓€瑙勫垯閲嶆瀯

### 淇敼鍐呭
- 鏂板 `OperationDetailTextFormatter`锛屾妸 `OperationDetailData` 杞垚椤甸潰鍐呰鎯呭尯鍙洿鎺ユ樉绀虹殑绱у噾鏂囨湰銆?- `BuildDevelopmentPanelUI` 鐨?PC 寤洪€犺鎯呴〉銆佸畬鏁村缓閫犺鎯呴〉銆佺Щ鍔ㄧ寤洪€犺鎯呴〉鍏ㄩ儴鏀逛负璇诲彇 `OperationDetailDataFactory.ForBuilding(...)`锛屼笉鍐嶆墜宸ョ淮鎶ゅ彟涓€濂楄鎯呴『搴忋€?- `UnitProductionPanel` 鐨?`ProductionDetailTipsPage` 鏀逛负璇诲彇 `OperationDetailDataFactory.ForUnit(...)`锛岄〉闈㈠唴璇︽儏涓庢偓鍋?闀挎寜璇︽儏鍗＄粺涓€銆?- `TechTreePanelUI` 鐨?`FloatingTechTipsPage` 鏀逛负璇诲彇 `OperationDetailDataFactory.ForTech(...)`锛屽墠缃潯浠躲€佺爺绌舵晥鏋溿€侀檺鍒惰鏄庣粺涓€骞跺叆鍚屼竴鏁版嵁缁撴瀯銆?- 鏇存柊 `Docs/UI/RTS鎿嶄綔鎸夐挳璇︽儏椤礥I璁捐瑙勮寖.md`銆乣HUD鍗曚綅寤洪€犻〉妯″潡.md`銆乣HUD寤虹瓚閫犲叺椤垫ā鍧?md`銆乣HUD寤虹瓚绉戞妧鏍戦〉妯″潡.md`锛岃ˉ鍏呴〉闈㈠唴璇︽儏涓庤鎯呭崱鍏辩敤鏁版嵁缁撴瀯鐨勮鍒欍€?
### 淇敼鏂囦欢
- `Assets/Scripts/UI/OperationDetailTextFormatter.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assembly-CSharp.csproj`
- `Docs/UI/RTS鎿嶄綔鎸夐挳璇︽儏椤礥I璁捐瑙勮寖.md`
- `Docs/UI/HUD鍗曚綅寤洪€犻〉妯″潡.md`
- `Docs/UI/HUD寤虹瓚閫犲叺椤垫ā鍧?md`
- `Docs/UI/HUD寤虹瓚绉戞妧鏍戦〉妯″潡.md`
- `Docs/05_TASK_LOG.md`

### 鏂板鏂囦欢
- `Assets/Scripts/UI/OperationDetailTextFormatter.cs`

### 褰卞搷鑼冨洿
- 鎴樻枟鍐呭缓閫犺彍鍗曞彸渚ц鎯呴〉
- 鎴樻枟鍐呭缓绛戦€犲叺绐楀彛鐨勫崟浣嶈鎯呴〉
- 鎴樻枟鍐呯鎶€鏍戠獥鍙ｇ殑绉戞妧璇︽儏椤?- 鍚屼竴鎵规寜閽殑鎮仠/闀挎寜璇︽儏鍗′笌椤甸潰鍐呰鎯呯殑涓€鑷存€?
### 楠岃瘉鏂瑰紡
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 鍚庣画娉ㄦ剰浜嬮」
- `Assembly-CSharp.csproj` 褰撳墠涓烘樉寮忔簮鐮佸垪琛紝鏂板鑴氭湰鑻ユ湭琚?Unity 閲嶆柊鐢熸垚宸ョ▼鏂囦欢锛岄渶瑕佸悓姝ヨˉ杩?`Compile Include` 鎵嶈兘鐢?`dotnet build` 鏈湴楠岃瘉銆?- 杩欐涓昏缁熶竴浜嗚鎯呮暟鎹拰鏂囨湰椤哄簭锛涘鏋滃悗缁繕瑕佹妸璇︽儏鍖鸿繘涓€姝ユ媶鎴愭爣绛惧鍣ㄣ€佸垎娈靛崱鐗囥€佺‘璁ゅ尯绛夊彲瑙嗗瓙妯″潡锛屼紭鍏堝湪瀵瑰簲 Prefab 涓ˉ鑺傜偣锛屽啀璁?`OperationDetailTextFormatter` 鎴栦笓鐢ㄧ粦瀹氬櫒鍐欏叆杩欎簺鑺傜偣銆?
## 2026-05-15 - 鍗曚綅寤洪€犻〉鍒嗙被鏍忎笌寤洪€犲崱瑙勫垯淇

### 淇敼鍐呭
- 淇 `SelectionPanel.cs` 鍐呮畫鐣欑殑澶ч噺鎹熷潖瀛楃涓蹭笌閿欒鏂囨锛屼娇 HUD 閫夋嫨闈㈡澘閲嶆柊鎭㈠鍙紪璇戙€?- 琛ラ綈鍗曚綅寤洪€犻〉浣跨敤鐨?`PcBuildCategory` / `PcBuildCategoryTabView` 缁撴瀯锛屾帴閫氬缓閫犲垎绫绘爮杩愯鏃堕€昏緫銆?- 璋冩暣鍗曚綅寤洪€犻〉瑙勫垯锛氬缓閫犲崱灏哄浼樺厛璇诲彇 `BuildButton_Prefab` 褰撳墠灏哄锛屼唬鐮佷笉鍐嶅己鍒惰鐩栧缓閫犲崱鍐呴儴甯冨眬銆?- 璋冩暣 `ProductionGridViewport` 鐨勫崟浣嶅缓閫犳ā寮忚涓猴紝杩涘叆鍗曚綅寤洪€犻〉鏃跺己鍒朵负妯悜婊氬姩锛屽尮閰嶁€滃崟浣嶉€変腑鍚庣殑寤洪€犻〉闈?UI 璇︾粏瑙勫垯鏂囨。鈥濄€?- 鐩存帴淇敼 `SelectionBuildingProductionPage_Prefab.prefab`锛岃ˉ鍏?`BuildCategoryTabsViewport` / `BuildCategoryTabsContent` 缁撴瀯锛屽苟涓哄垎绫绘爮璁╁嚭鐙珛鍖哄煙銆?- 鐩存帴淇敼 `BuildButton_Prefab.prefab`锛屾妸鏃у皬鎸夐挳瑙勬牸鎻愬崌涓哄缓绛戝崱瑙勬牸锛屽浘鏍囥€佹爣棰樸€佽垂鐢ㄥ尯鍙湪 prefab 鍐呯洿鎺ヨ皟鑺傘€?- 鏇存柊 `Docs/UI/HUD鍗曚綅寤洪€犻〉妯″潡.md`锛岃ˉ鍏?`BuildCategoryTabsViewport`銆乣BuildCategoryTabsContent`銆乣BuildButton_Prefab` 鐨勭粨鏋勪笌鑱岃矗杈圭晫銆?
### 淇敼鏂囦欢
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/BuildButton_Prefab.prefab`
- `Docs/UI/HUD鍗曚綅寤洪€犻〉妯″潡.md`
- `Docs/05_TASK_LOG.md`

### 鏂板鏂囦欢
- 鏃?
### 褰卞搷鑼冨洿
- 鎴樻枟 HUD 涓€滈€変腑鍙缓閫犲崟浣嶅悗鈥濈殑寤洪€犻〉鍒嗙被鏍忔樉绀轰笌鍒囨崲
- 寤洪€犲崱妯悜鍒楄〃鐨勫昂瀵告帶鍒朵笌婊氬姩鏂瑰紡
- 寤洪€犻〉 prefab 鍐呭彲鐩存帴缂栬緫鐨勫垎绫绘爮浣嶇疆銆佸缓閫犲崱灏哄銆佹爣棰樺尯鍜岃垂鐢ㄥ尯
- 寤洪€犻〉鐩稿叧璇︽儏鎸夐挳銆佽嚜鍔ㄥ寲鎸夐挳銆佹満姊?鑷劧/鎶€鑳界姸鎬佹枃妗堢殑绋冲畾鎬?
### 楠岃瘉鏂瑰紡
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 鍚庣画娉ㄦ剰浜嬮」
- 褰撳墠宸叉妸寤洪€犻〉閫昏緫鎭㈠鍒板彲缂栬瘧骞舵帴閫氬垎绫绘爮锛屼笖宸叉妸鍏抽敭鍒嗙被鏍忔Ы浣嶅拰寤虹瓚鍗″昂瀵告斁鍥?prefab锛涘悗缁缓璁户缁湪 Unity 鍐呭仛鏈€缁堣瑙夊井璋冨拰鍥剧墖鏇挎崲銆?- 鍚庣画濡傜户缁墿灞曞缓閫犳潵婧愬垏鎹€佸寤洪€犲崟浣嶆潵婧愭爣绛撅紝浠嶅簲澶嶇敤 `PcBuildCategory` 杩欎竴灞傦紝涓嶈鍐嶅崟鐙捣鏂扮殑寤洪€犲垪琛ㄧ郴缁熴€?
## 2026-05-15 - 鍗曚綅寤洪€犲崱璧勬簮琛屾ā鏉垮寲

### 淇敼鍐呭
- 缁х画鎺ㄨ繘 HUD 鍗曚綅寤洪€犻〉 prefab 鍖栵紝鎶?`BuildButton_Prefab` 鐨?`CostRow` 浠庘€滆繍琛屾椂瑁稿垱寤鸿祫婧愰」鈥濆崌绾т负鈥減refab 妯℃澘 + 杩愯鏃跺～鍏呮暟鎹€濄€?- 鍦?`BuildButton_Prefab.prefab` 涓柊澧?`CostSlotTemplate`锛屽苟琛ラ綈鍏跺唴閮?`Icon`銆乣Amount` 瀛愯妭鐐癸紝榛樿闅愯棌锛屼笓渚涜繍琛屾椂鍏嬮殕銆?- 鍦?`BuildButton_Prefab.prefab` 涓柊澧?`FreeLabel`锛岀敤浜庡厤璐瑰缓绛戞椂鐩存帴鏄剧ず锛屼笉鍐嶄复鏃剁敓鎴愭暣鍧楁枃鏈粨鏋勩€?- 璋冩暣 `SelectionPanel.ConfigurePcCostRow(...)`锛?  - 浼樺厛鏌ユ壘骞跺鐢?`CostSlotTemplate`
  - 浠呭～鍏呭浘鏍囥€佹暟瀛楀拰鍙礋鎷呴鑹?  - 璐圭敤涓虹┖鏃朵紭鍏堟樉绀?`FreeLabel`
  - 浠呭湪妯℃澘缂哄け鏃舵墠鍥為€€鍒版棫鐨勮繍琛屾椂 `GameObject + Image + Text` 鐢熸垚閫昏緫
- 閲嶅啓 `Docs/UI/HUD鍗曚綅寤洪€犻〉妯″潡.md`锛岃ˉ鍏?`CostRow` 瀛愭ā鏉跨粨鏋勩€乸refab 浼樺厛杈圭晫鍜岄獙璇佽鍒欍€?
### 淇敼鏂囦欢
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Resources/UI/Prefabs/Components/BuildButton_Prefab.prefab`
- `Docs/UI/HUD鍗曚綅寤洪€犻〉妯″潡.md`
- `Docs/05_TASK_LOG.md`

### 鏂板鏂囦欢
- 鏃?
### 褰卞搷鑼冨洿
- 鍗曚綅閫変腑鍚庣殑 HUD 寤洪€犻〉寤洪€犲崱璧勬簮琛屾樉绀?- 鍏嶈垂寤虹瓚鐨勨€滃厤璐光€濇枃妗堟樉绀烘柟寮?- 寤洪€犲崱璧勬簮琛岀殑鍥炬爣澶у皬銆佹暟瀛楀搴︺€侀棿璺濆拰鏁翠綋浣嶇疆鍙紪杈戞€?
### 楠岃瘉鏂瑰紡
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- Unity 鍐呮鏌?`BuildButton_Prefab/CostRow/CostSlotTemplate` 鐨勪綅缃€佸ぇ灏忋€侀棿璺濅慨鏀规槸鍚︿細鐩存帴浣撶幇鍦ㄨ繍琛屾椂寤洪€犲崱涓?
### 鍚庣画娉ㄦ剰浜嬮」
- 鏈烘鏀归€犲崱褰撳墠浠嶆湁鐙珛鐨?`RebuildMechanicalModCostRow(...)` 缁撴瀯锛屽缓璁笅涓€杞篃缁熶竴杩佺Щ鍒扮浉鍚岃祫婧愯妯℃澘閫昏緫銆?- 濡傛灉鍚庣画缁х画缁嗗寲璧勬簮琛岃〃鐜帮紝搴旂户缁湪 `BuildButton_Prefab` 鍐呰皟鏁达紝涓嶈鍐嶆妸鍥炬爣浣嶃€侀噾棰濅綅鍜岄棿璺濆啓鍥炰唬鐮併€?
## 2026-05-15 - 寤虹瓚閫犲叺椤佃缁冨崱涓庣敓浜ч槦鍒?prefab 瑙勫垯淇

### 淇敼鍐呭
- 鎸?`Docs/UI/寤虹瓚閫変腑鍚庣殑閫犲叺椤甸潰UI璇︾粏瑙勫垯鏂囨。.md` 閲嶅仛寤虹瓚閫犲叺椤佃缁冨崱 prefab锛屾妸 `BuildingProductionButton_Prefab` 浠庢棫灏忔寜閽崌绾т负鍙紪杈戠殑澶у崱鐗囥€?- 涓?`BuildingProductionButton_Prefab` 琛ラ綈骞跺浐瀹?`CostRow/CostSlotTemplate/FreeLabel` 缁撴瀯锛岃璧勬簮鍥炬爣銆佹暟瀛椼€侀棿璺濈洿鎺ュ湪 prefab 鍐呭彲璋冦€?- 璋冩暣 `SelectionPanel.cs`锛?  - 寤虹瓚閫犲叺璁粌鍗℃敼涓哄崟琛屾í鍚戞粴鍔紝涓嶅啀鎸変袱琛屽皬缃戞牸甯冨眬
  - `PcQuickTrain_*` 璁粌鍗′笉鍐嶈杩愯鏃朵唬鐮侀噸鍐?`Label` / `Icon` / `CostRow` 甯冨眬
  - 璁粌鍗″昂瀵镐紭鍏堣鍙?prefab 褰撳墠灏哄
  - HUD 鐢熶骇闃熷垪鏉＄洰鏀逛负浼樺厛澶嶇敤 `ProductionQueueEntry_Prefab`
- 鏇存柊 `Docs/UI/HUD寤虹瓚閫犲叺椤垫ā鍧?md`锛岃ˉ鍏呰缁冨崱銆佺敓浜ч槦鍒楁潯鐩殑 prefab 缁撴瀯涓庤繍琛屾椂杈圭晫銆?
### 淇敼鏂囦欢
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Resources/UI/Prefabs/Components/BuildingProductionButton_Prefab.prefab`
- `Docs/UI/HUD寤虹瓚閫犲叺椤垫ā鍧?md`
- `Docs/05_TASK_LOG.md`

### 鏂板鏂囦欢
- 鏃?
### 褰卞搷鑼冨洿
- 鎴樻枟 HUD 涓€変腑閫犲叺寤虹瓚鍚庣殑璁粌鍗″睍绀?- 寤虹瓚閫犲叺椤电殑妯悜婊氬姩甯冨眬
- HUD 鐢熶骇闃熷垪鏉＄洰鐨?prefab 鍖栨樉绀轰笌鍙栨秷鎿嶄綔
- 寤虹瓚閫犲叺鍗¤祫婧愯銆佸浘鏍囧尯銆佸悕绉板尯鐨?prefab 鍙紪杈戞€?
### 楠岃瘉鏂瑰紡
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- Unity 鍐呮鏌ワ細
  - 閫変腑閫犲叺寤虹瓚鍚庤缁冨崱鏄惁涓烘í鍚戝崟琛屽崱鐗囧垪琛?  - 淇敼 `BuildingProductionButton_Prefab` 鐨勫浘鏍囧尯銆佹爣棰樺尯銆佽祫婧愯浣嶇疆鍚庯紝杩愯鏃舵槸鍚︾洿鎺ョ敓鏁?  - 鐢熶骇闃熷垪鏉＄洰鏄惁浣跨敤 `ProductionQueueEntry_Prefab` 鐨勫竷灞€鍜屽彇娑堟寜閽?
### 鍚庣画娉ㄦ剰浜嬮」
- 杩欒疆涓昏鎶?HUD 鍐呭祵閫犲叺椤垫敹鍥炲埌 prefab 椹卞姩锛涜嫢鍚庣画缁х画缁嗗寲璁粌鏃堕棿銆佸壇鏍囬銆佺姸鎬佽鏍囷紝搴斾紭鍏堢户缁湪 `BuildingProductionButton_Prefab` 鍐呰ˉ鑺傜偣锛屽啀鐢变唬鐮佸彧鍋氱粦瀹氥€?- `ProductionQueueEntry_Prefab` 鐩墠宸叉帴鍏?HUD 闃熷垪鍒锋柊閫昏緫锛屽悗缁嫢瑕佹墿鍏呪€滃埗閫犱腑 / 绛夊緟涓?/ 鏆傚仠涓€濊瑙夊樊寮傦紝浼樺厛缁х画鎵╁睍璇?prefab 涓庡叾瀛楁缁戝畾锛屼笉瑕佸洖鍒拌繍琛屾椂鎵嬪伐鎷兼潯鐩€?
## 2026-05-15 - 澶ч€犲叺绐楀彛璇︽儏鍖?prefab 缁戝畾琛ュ己

### 淇敼鍐呭
- 缁х画妫€鏌ュ缓绛戦€犲叺浣撶郴涓€滃ぇ閫犲叺绐楀彛鈥濇畫鐣欑殑鏃у紡杩愯鏃跺垱寤洪€昏緫銆?- 璋冩暣 `UnitProductionPanel.BindExistingPrefabChildren(...)`锛岃ˉ鍏呬紭鍏堢粦瀹氫互涓?prefab 璇︽儏鑺傜偣锛?  - `DetailIcon`
  - `DetailTitle`
  - `DetailSubtitle`
  - `DetailBody`
  - `DetailTrainButton`
  - `DetailCloseButton`
  - `RallyPointButton`
  - `RallyPointStatus`
- 璁?`UnitProductionPanel_Prefab` 涓凡缁忓瓨鍦ㄧ殑璇︽儏鍖?闆嗙粨鐐瑰尯鑺傜偣浼樺厛琚繍琛屾椂澶嶇敤锛岄伩鍏嶅啀娆″垱寤虹浜屽鍚屽悕鎺т欢瀵艰嚧 prefab 鏀瑰姩涓嶇敓鏁堛€?- 鏇存柊 `Docs/UI/HUD寤虹瓚閫犲叺椤垫ā鍧?md`锛岃ˉ鍏呭ぇ閫犲叺绐楀彛璇︽儏鍖哄繀椤讳紭鍏堢粦瀹?prefab 鑺傜偣鐨勮鍒欍€?
### 淇敼鏂囦欢
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Docs/UI/HUD寤虹瓚閫犲叺椤垫ā鍧?md`
- `Docs/05_TASK_LOG.md`

### 鏂板鏂囦欢
- 鏃?
### 褰卞搷鑼冨洿
- 澶ч€犲叺绐楀彛璇︽儏椤电殑鏍囬銆佹鏂囥€佽缁冩寜閽?- 澶ч€犲叺绐楀彛闆嗙粨鐐规寜閽笌鐘舵€佸尯
- Unity 鍐呴€氳繃 `UnitProductionPanel_Prefab` 鐩存帴璋冩暣璇︽儏鍖哄竷灞€鏃剁殑鐢熸晥涓€鑷存€?
### 楠岃瘉鏂瑰紡
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- Unity 鍐呮鏌?`UnitProductionPanel_Prefab` 涓鎯呭尯鍜岄泦缁撶偣鍖鸿妭鐐规槸鍚﹁鐩存帴澶嶇敤锛岃€屼笉鏄繍琛屾椂鍐嶇敓鎴愰噸澶嶆帶浠?
### 鍚庣画娉ㄦ剰浜嬮」
- 褰撳墠宸茶ˉ寮哄ぇ閫犲叺绐楀彛璇︽儏鍖虹殑 prefab 缁戝畾鍏ュ彛锛涗笅涓€杞鏋滅户缁彂鐜版煇浜涜鎯呭瓙鍧椾粛琚?fallback 鍒涘缓锛屽簲浼樺厛琛?`BindExistingPrefabChildren(...)`锛屼笉瑕佺洿鎺ュ湪澶栧眰鍔犳洿澶氳繍琛屾椂甯冨眬浠ｇ爜銆?
## 2026-05-15 - 澶ч€犲叺绐楀彛閫氱敤鎸夐挳妯℃澘璇敤淇

### 淇敼鍐呭
- 缁х画娓呯悊寤虹瓚閫犲叺澶х獥鍙ｄ腑娈嬬暀鐨勯敊璇?fallback锛屾妸 `UnitProductionPanel` 涓?`BuildingUnitProductionWindowUI` 閲屽師鍏堥敊璇鐢?`UiPrefabType.BuildingProductionButton` 鐨勯€氱敤鎸夐挳鍒涘缓閫昏緫鏀逛负 `UiPrefabType.GenericButton`銆?- 璋冩暣涓や釜鑴氭湰涓殑鎸夐挳鏂囨湰甯冨眬閫昏緫锛氬彧鏈夊湪 prefab 鏈０鏄庝繚鐣欏竷灞€鏃讹紝浠ｇ爜鎵嶄細鏀瑰啓 `Label` 鐨勬媺浼稿尯鍩熷拰杈硅窛锛岄伩鍏嶈繍琛屾椂瑕嗙洊 prefab 鍐呭凡璋冨ソ鐨勬枃瀛椾綅缃€?- 鍦?`UnitProductionPanel` 涓柊澧?`detailPageTitleText` 搴忓垪鍖栧瓧娈碉紝骞惰 `BindExistingPrefabChildren(...)` 浼樺厛缁戝畾 `DetailPageTitle`锛屽噺灏戣鎯呴〉鏍囬琚繍琛屾椂閲嶅鍒涘缓鐨勬鐜囥€?- 鐩存帴琛ラ綈 `UnitProductionPanel_Prefab.prefab` 涓己澶辩殑 `DetailCloseButton` 涓?`RallyPointStatus` 鍥哄畾鑺傜偣锛岃璇︽儏鍖哄叧闂寜閽€侀槦鍒楅〉闆嗙粨鐐圭姸鎬佹枃妗堥兘鍙洿鎺ュ湪 prefab 涓紪杈戙€?- 鏇存柊 `Docs/UI/HUD寤虹瓚閫犲叺椤垫ā鍧?md`锛岃ˉ鍏呪€滃ぇ閫犲叺绐楀彛閫氱敤鎿嶄綔鎸夐挳蹇呴』浣跨敤 `GenericButton`銆佽缁冨崱 prefab 浠呯敤浜庤缁冨崱鈥濈殑瑙勫垯銆?
### 淇敼鏂囦欢
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Resources/UI/Prefabs/InGame/UnitProductionPanel_Prefab.prefab`
- `Docs/UI/HUD寤虹瓚閫犲叺椤垫ā鍧?md`
- `Docs/05_TASK_LOG.md`

### 鏂板鏂囦欢
- 鏃?
### 褰卞搷鑼冨洿
- 澶ч€犲叺绐楀彛璇︽儏椤垫爣棰樸€佸叧闂寜閽€佽缁冩寜閽殑 prefab 缁戝畾涓€鑷存€?- 澶ч€犲叺绐楀彛闃熷垪椤电殑闆嗙粨鐐圭姸鎬佹枃妗?prefab 鍖?- 閫氱敤鎿嶄綔鎸夐挳涓庤缁冨崱鎸夐挳鐨勮亴璐ｈ竟鐣?
### 楠岃瘉鏂瑰紡
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- Unity 鍐呮鏌ワ細
  - `UnitProductionPanel_Prefab` 涓?`DetailCloseButton` 涓?`RallyPointStatus` 鏄惁鐩存帴鐢熸晥
  - 淇敼 `DetailPageTitle`銆乣DetailTrainButton`銆乣RallyPointButton`銆乣RallyPointStatus` 鐨勪綅缃ぇ灏忓悗锛岃繍琛屾椂鏄惁涓嶅啀琚唬鐮佽鐩?  - 澶ч€犲叺绐楀彛涓鎯呮寜閽€侀泦缁撶偣鎸夐挳鏄惁涓嶅啀濂楃敤璁粌鍗″瑙?
### 鍚庣画娉ㄦ剰浜嬮」
- 褰撳墠鍙槸鎶娾€滈€氱敤鎸夐挳璇敤璁粌鍗?prefab鈥濊繖涓€灞傛敹鍥炴纭亴璐ｏ紱涓嬩竴杞嫢缁х画瀹屽杽璇︽儏椤佃瑙夛紝搴旂户缁洿鎺ョ紪杈?`UnitProductionPanel_Prefab` 涓殑鐜版湁鑺傜偣锛屼笉瑕佸啀閫氳繃浠ｇ爜鎷兼柊鐨勫彲瑙佹寜閽€?- 濡傛灉鍚庣画杩樺彂鐜?`CancelButton`銆乣CloseButton` 绛夋帶浠惰瑙夊紓甯革紝搴斾紭鍏堟鏌ュ搴?prefab 绫诲瀷鏄惁浠嶈閿欒鏄犲皠锛岃€屼笉鏄户缁湪鑴氭湰閲屽啓甯冨眬琛ヤ竵銆?
## 2026-05-15 - 鏈烘鏃忓崟浣嶄笌寤虹瓚鏀归€犻〉缁熶竴涓?HUD 妯″潡椤?
### 淇敼鍐呭
- 閲嶆柊姊崇悊鏈烘鏀归€犻〉瑙勫垯鏂囨。涓?`SelectionPanel` 褰撳墠瀹炵幇锛岀‘璁ゆ棫瀹炵幇浠嶅仠鐣欏湪鈥滄櫘閫氬缓绛戞搷浣滄寜閽尯閲屽鏀归€犲崱鈥濋樁娈点€?- 璋冩暣 `SelectionPanel.cs`锛屾妸鏈烘鍗曚綅涓庢満姊板缓绛戠殑鏀归€犲睍绀虹粺涓€鏀舵暃鍒?`MechanicalModificationPage` 妯″潡锛屼笉鍐嶆妸鏀归€犲崱鐩存帴浣滀负鏈€缁?UI 娣峰湪鏅€氬姩浣滄寜閽閲屻€?- 涓?`SelectionPanel` 澧炲姞鏈烘鏀归€犻〉涓撶敤鑺傜偣缁戝畾锛屽寘鎷細
  - 鍒嗙被鏍?  - 妲戒綅鍖?  - 妯″潡鍗℃í鍚戝垪琛?  - 鐘舵€佹爮
- 涓?`MechanicalModificationState` 澧炲姞鍙璁块棶鎺ュ彛锛屼究浜?UI 鐩存帴璇诲彇褰撳墠鏀归€犱腑妯″潡涓庡凡瑁呮Ы浣嶃€?- 灏嗘満姊版敼閫犲崱鐨勮繍琛屾椂鍒楄〃浠庨€氱敤 `actionButtonViews` 涓媶鍒嗕负鐙珛鍒楄〃锛岄伩鍏嶅埛鏂版満姊版敼閫犻〉鏃惰鍒犳垨姹℃煋鏅€氬缓绛戞搷浣滄寜閽€?- 鏇存柊 `Docs/UI/HUD閫夋嫨鍔ㄤ綔椤垫ā鍧?md` 涓?`Docs/UI/鏈烘鏃忓崟浣嶄笌寤虹瓚鏀归€犻〉闈I璇︾粏瑙勫垯鏂囨。.md`锛岃ˉ鍏呭綋鍓嶉」鐩腑鐨勬満姊版敼閫犻〉鎸傜偣缁撴瀯銆佽妭鐐硅鍒欏拰浠ｇ爜鑱岃矗杈圭晫銆?
### 淇敼鏂囦欢
- `Assets/Scripts/Core/MechanicalModificationState.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/UI/HUD閫夋嫨鍔ㄤ綔椤垫ā鍧?md`
- `Docs/UI/鏈烘鏃忓崟浣嶄笌寤虹瓚鏀归€犻〉闈I璇︾粏瑙勫垯鏂囨。.md`
- `Docs/05_TASK_LOG.md`

### 鏂板鏂囦欢
- 鏃?
### 褰卞搷鑼冨洿
- 鏈烘鍗曚綅鐐瑰嚮鈥滄敼閫犫€濆悗鐨?HUD 鍙充晶璇︽儏椤?- 鏈烘寤虹瓚鐐瑰嚮鍚庣殑鏀归€犳ā鍧楀睍绀烘柟寮?- 鏀归€犳Ы浣嶃€佹敼閫犲崱銆佹敼閫犵姸鎬佹爮鐨勬暟鎹粦瀹氭柟寮?- 鏈烘鏀归€犻〉涓庢櫘閫氬缓绛戞搷浣滃尯鐨勮亴璐ｈ竟鐣?
### 楠岃瘉鏂瑰紡
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 鍚庣画娉ㄦ剰浜嬮」
- 杩欒疆宸茬粡鎶婃満姊版敼閫犻〉浠庢棫鎸夐挳鍫嗗彔閫昏緫涓墺绂诲嚭鏉ワ紝骞舵妸缁熶竴妯″潡椤电殑浠ｇ爜缁戝畾鍑嗗濂斤紱鍚庣画搴旂户缁洿鎺ュ湪 `SelectionBuildingControlPage_Prefab.prefab` 涓ˉ榻?`MechanicalModificationPage` 鐨勫彲瑙嗙粨鏋勶紝鑰屼笉鏄洖閫€鍒拌繍琛屾椂鎷?UI銆?- 褰撳墠缂栬瘧宸查€氳繃锛屼絾 prefab 瑙嗚灞備粛寤鸿鍦?Unity 涓户缁牳瀵?`MechanicalModificationPage` 鐨勫疄闄呰妭鐐瑰竷灞€銆佸浘鐗囥€佹粴鍔ㄥ尯涓庣姸鎬佹爮琛ㄧ幇銆?
## 2026-05-16 - 鏈烘鏀归€犻〉鏃?UI 鍒涘缓涓庢棫甯冨眬鍏ュ彛缁х画娓呯悊

### 淇敼鍐呭
- 缁х画娓呯悊 `SelectionPanel.cs` 涓満姊版敼閫犻〉娈嬬暀鐨勬棫 UI 鍒涘缓鏂瑰紡锛岀鐢ㄨ繍琛屾椂鍒涘缓 `MechanicalModificationPage` 鏍硅妭鐐圭殑鏃ч€昏緫锛屾敼涓虹己鑺傜偣鐩存帴鎶ラ敊銆?- 灏嗘満姊版敼閫犻〉妯℃澘鑺傜偣缁戝畾浠庘€滅己浠€涔堣ˉ浠€涔堚€濇敹绱т负鈥滀紭鍏堢粦瀹?prefab 鍥哄畾鑺傜偣鈥濓紝鍑忓皯杩愯鏃跺伔鍋风敓鎴愬彲瑙佹棫缁撴瀯鐨勯棶棰樸€?- 娓呯悊 `LayoutPcMechanicalModificationPage()` 涓户缁鐩栨敼閫犻〉瀛愬尯鍧椾綅缃€佸昂瀵哥殑纭紪鐮侊紝璁?`MechanicalModificationPage` 鐨勫瓙鑺傜偣甯冨眬灏介噺鍥炲埌 prefab 鑷韩缁存姢銆?- 娓呯悊寤虹瓚鎿嶄綔鍖烘棫鐨勨€滄満姊版敼閫犲崱娣锋帓澶у崱甯冨眬鈥濆叆鍙ｏ紝涓嶅啀璁╂満姊版敼閫犲崱浠庢櫘閫氬缓绛戞搷浣滄寜閽璧版棫娓叉煋璺緞銆?- 灏嗘満姊版敼閫犲崱璐圭敤琛屽垏鎹㈠埌妯℃澘鍖栫粦瀹氭€濊矾锛屾敼涓轰緷璧?`CostRow/CostSlotTemplate/FreeLabel`锛屼笉鍐嶇函杩愯鏃堕噸寤烘暣鏉¤垂鐢ㄨ銆?- 鏇存柊鏈烘鏀归€犻〉涓?HUD 閫夋嫨鍔ㄤ綔椤垫枃妗ｏ紝琛ュ厖鍥哄畾鎸傜偣銆佸浐瀹氳妭鐐瑰拰浠ｇ爜鑱岃矗杈圭晫銆?
### 淇敼鏂囦欢
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/UI/HUD閫夋嫨鍔ㄤ綔椤垫ā鍧?md`
- `Docs/UI/鏈烘鏃忓崟浣嶄笌寤虹瓚鏀归€犻〉闈I璇︾粏瑙勫垯鏂囨。.md`
- `Docs/05_TASK_LOG.md`

### 鏂板鏂囦欢
- 鏃?
### 褰卞搷鑼冨洿
- HUD 鍙充晶鏈烘鏀归€犻〉鐨勬牴鑺傜偣鑾峰彇鏂瑰紡
- 鏈烘鏀归€犻〉鍒嗙被鏍忋€佹Ы浣嶅尯銆佹ā鍧楀崱鍖恒€佺姸鎬佹爮鐨?prefab 缁戝畾杈圭晫
- 寤虹瓚鎿嶄綔鍖烘棫鐨勬満姊版敼閫犲崱娣锋帓鍏ュ彛
- 鏈烘鏀归€犲崱璧勬簮琛岀殑 prefab 鍖栫▼搴?
### 楠岃瘉鏂瑰紡
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 鍚庣画娉ㄦ剰浜嬮」
- 鏈疆涓昏鍏堟妸鑴氭湰涓殑鏃у垱寤轰笌鏃у竷灞€鍏ュ彛缁х画鏀舵帀锛屼笅涓€杞粛闇€鐩存帴淇敼 `Assets/Resources/UI/Prefabs/Components/SelectionBuildingControlPage_Prefab.prefab` 涓?`MechanicalModificationCard_Prefab.prefab`锛屾妸鏈烘鏀归€犻〉瀹屾暣鍙紪杈戠粨鏋勭湡姝ｈˉ鍒?prefab 鏈綋涓€?- 鍚庣画缁х画鎺掓煡鍏朵粬椤甸潰鏃讹紝浼樺厛澶嶇敤杩欐鐨勮鍒欙細缂?prefab 鍥哄畾鑺傜偣鏃跺彧鎶ラ敊锛屼笉鍐嶈杩愯鏃惰ˉ涓€濂楁渶缁堝彲瑙?UI銆?
## 2026-05-16 - 鏈烘鏀归€犻〉 Prefab 璧勬簮缁撴瀯鏍″噯

### 淇敼鍐呭
- 缁х画鎺掓煡鏈烘鏀归€犻〉 prefab 鍖栭摼璺紝纭 `SelectionPanel.cs` 宸茶姹?`MechanicalSlotsContent/MechanicalSlotTemplate` 蹇呴』瀛樺湪锛屼絾鏃ц祫婧愭湰浣撲竴搴︽病鏈夌湡瀹炲啓鍏ヨ鑺傜偣銆?- 鏇存柊 `UiPrefabWorkflowGenerator.GenerateEditableUiPrefabs()`锛屽湪鏁村寘 UI prefab 閲嶅缓鍚庤拷鍔犳満姊版敼閫犻〉缁撴瀯鏍″噯姝ラ锛岄噸鐐规牎楠屽苟琛ラ綈锛?  - `ActionButtonArea`
  - `MechanicalModificationPage`
  - `MechanicalSlotsViewport/MechanicalSlotsContent/MechanicalSlotTemplate`
- 閲嶆柊鎵ц Unity batch 閲嶅缓鍙紪杈?UI prefab锛岀‘璁?`SelectionBuildingControlPage_Prefab.prefab` 宸插疄闄呭寘鍚細
  - `MechanicalSlotTemplate`
  - `SlotTitle`
  - `SlotValue`
- 鏇存柊 HUD 閫夋嫨鍔ㄤ綔椤垫枃妗ｄ笌鏈烘鏀归€犻〉瑙勫垯鏂囨。锛岃ˉ鍏呪€滅敓鎴愬櫒澹版槑瀛樺湪鈥濅笌鈥減refab 璧勬簮鏈綋鐪熷疄瀛樺湪鈥濆繀椤诲悓鏃舵垚绔嬬殑鏍￠獙瑙勫垯銆?
### 淇敼鏂囦欢
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingControlPage_Prefab.prefab`
- `Docs/UI/HUD閫夋嫨鍔ㄤ綔椤垫ā鍧?md`
- `Docs/UI/鏈烘鏃忓崟浣嶄笌寤虹瓚鏀归€犻〉闈I璇︾粏瑙勫垯鏂囨。.md`
- `Docs/05_TASK_LOG.md`

### 鏂板鏂囦欢
- 鏃?
### 褰卞搷鑼冨洿
- 鏈烘鏀归€犻〉妲戒綅鍖烘ā鏉垮厠闅嗛摼璺?- 寤虹瓚鎺у埗椤靛唴 `ActionButtonArea` 涓?`MechanicalModificationPage` 鐨?prefab 璧勬簮瀹屾暣鎬?- 鍚庣画鏁村寘 UI prefab 閲嶅缓鏃剁殑鏈烘鏀归€犻〉绋冲畾鎬?
### 楠岃瘉鏂瑰紡
- `powershell.exe -NoProfile -Command "Set-Location -LiteralPath 'G:\\TestProject\\TestRTS2'; dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false"`
- Unity batch 鎵ц `RTSGame.Editor.UiPrefabWorkflowGenerator.GenerateEditableUiPrefabs`
- 鎵弿鐩爣 prefab 鍏抽敭瀛楋細
  - `MechanicalSlotTemplate`
  - `SlotTitle`
  - `SlotValue`
  - `ActionButtonArea`
  - `MechanicalModificationPage`

### 鍚庣画娉ㄦ剰浜嬮」
- 鍚庣画缁х画娓?HUD 鍏朵粬妯″潡鏃讹紝鍑℃槸浠ｇ爜宸茬粡瑕佹眰鈥減refab 鍥哄畾鑺傜偣蹇呴』瀛樺湪鈥濈殑椤甸潰锛岄兘搴斿悓姝ユ牳瀵硅祫婧愭枃浠舵湰浣擄紝涓嶈鍙湅鐢熸垚鍣ㄤ唬鐮併€?- `Temp/ui_prefab_rebuild_verify.log` 宸插彲浣滀负鏈烘鏀归€犻〉 prefab 閲嶅缓鐨勬壒澶勭悊楠岃瘉璁板綍銆?## 2026-05-16 - HUD 多选与编队模块旧 UI 创建方式继续清理

### 修改内容
- 继续清理 `SelectionPanel.cs` 中多选头像条、编队快捷条、编队选择弹层、编队管理弹层的旧式运行时 UI 创建入口。
- `CreateMultiPortraitBar()`、`CreateGroupShortcutBar()`、`CreateGroupPickerPanel()`、`CreateGroupManagePanel()` 改为优先强绑定 prefab 固定节点；缺失时只记录错误并创建透明占位，不再补一套可见旧 UI。
- `CreateMultiPortraitView()` 与 `CreateGroupShortcutView()` 改为强依赖条目 prefab 内的 `Icon`、`Health`、`Count`、`Number`、`Status` 等固定子节点，代码只负责写入动态数据与事件。
- `ConfigurePcCostRow()` 改为强依赖按钮 prefab 内的 `CostRow/CostSlotTemplate/FreeLabel`；缺模板时直接报错，不再运行时拼资源图标和数值行。
- 多选头像项和编队快捷项的宽高改为优先读取 prefab 当前尺寸，减少代码对固定卡片大小的覆盖。
- 补充 HUD 多选、编队、HUD prefab 规则文档，明确这些模块的 prefab 强绑定边界。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/UI/HUD多选单位显示模块.md`
- `Docs/UI/HUD编队显示模块.md`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 中的多选头像条
- 编队快捷条、编队选择弹层、编队管理弹层
- 建造/造兵/科技/改造等按钮卡片的费用行模板绑定

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- `SelectionPanel.cs` 中技能条、Buff 条、自动化按钮区仍有部分旧式 `ResolveOrCreate*` 与布局覆盖入口，下一轮继续按同样规则模块化清理。
- 后续若继续调整多选/编队样式，应优先直接编辑对应 prefab，不要再把固定位置、大小和静态文案写回代码。

## 2026-05-16 - HUD 造兵窗口 prefab fallback 继续收口

### 修改内容
- 继续清理 `UnitProductionPanel.cs` 中训练卡、队列卡、分类页签的旧式可见 fallback。
- `RebuildCategoryTabs()` 改为强依赖分类 Tab prefab；缺少 `Button/Label` 时直接报错并跳过该页签，不再回退生成旧按钮。
- `GetOrCreateProductionCard()` 改为优先且仅接受 `UnitProductionCard_Prefab` 有效实例；prefab 无效时不再生成旧训练卡。
- `CreateQueueEntry()` 改为优先且仅接受 `ProductionQueueEntry_Prefab` 有效实例；prefab 无效时不再生成旧队列卡。
- `EnsureProductionCardPrefabContent()`、`EnsureQueueEntryPrefabContent()`、`EnsureCategoryTabPrefabContent()` 改为只校验和绑定现有 prefab 节点，不再补出新的可见 `Icon/Text/Button/Progress` 结构。
- `ProductionUnitListPage`、`ProductionDetailTipsPage`、`ProductionQueueAndRallyPage` 以及 `UnitButtons`、`QueueScrollRect`、`QueueEntries` 缺失时，统一改为透明占位并输出错误日志，不再补带底图描边的旧窗口。

### 修改文件
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Docs/UI/HUD建筑造兵页模块.md`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 右侧建筑造兵窗口
- 大造兵窗口中的训练卡、队列卡、分类页签
- `UnitProductionPanel_Prefab` 缺失节点时的运行时表现

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- `SelectionPanel.cs` 和 `WorldHudManager.cs` 仍有一批旧式可见 fallback 与布局覆盖入口，下一轮继续按相同规则清理。
- 这轮之后，如果造兵窗口仍显示不对，优先检查 `UnitProductionPanel_Prefab`、`UnitProductionCard_Prefab`、`ProductionQueueEntry_Prefab`、分类 Tab prefab 的节点是否齐全，而不是回到代码里补可见结构。
## 2026-05-16 - HUD 选择面板与世界HUD prefab强绑定继续收口

### 修改内容
- 继续清理 `SelectionPanel.cs` 中 PC 详情区、统一头像块、研究当前项与 Buff 详情弹层的旧式可见 fallback。
- `selectionSubtitleText`、`selectionPrimaryStatsText`、`selectionSecondaryStatsText`、`currentActionText`、`unitTagsText`、`unitRoleText` 改为优先绑定 prefab 固定文本节点；缺失时只记录错误并保留透明占位，不再运行时创建可见文本。
- `CreatePcSelectionStructure()` 中的 `HeaderTitle`、`HeaderSubtitle`、`HealthText`、`AttributeText`、`ExtraInfoText`、`ActionHint`、`UpgradeInfoText` 以及建造/造兵/科技/建筑操作标题改为强依赖对应 prefab 子节点，不再回退生成旧文字节点。
- `CreateUnifiedPortraitBlock()` 改为强依赖 `PortraitFrame_Unified`、`PortraitIcon`、`PortraitBadge`、`PortraitFaction`；不再运行时新建头像框、图标和说明文本。
- `BindPcResearchQueueTemplateNodes()` 改为强依赖 `CurrentResearch` 下的 `Icon`、`NameLabel`、`StatusLabel`、`RemainingLabel`、`ProgressLabel`、`CancelButton` 与 `EmptyLabel`，不再使用 `ResolveOrCreate*` 补旧结构。
- `CreateBuffDetailsPanel()` 改为优先绑定 `SelectionBuffDetailsPanel_Prefab` 的固定图标、文本与按钮节点；缺 prefab 或缺节点时只允许最小透明占位，不再生成旧的 Frame / Icon / Text / Button 可见结构。
- 清理 `WorldHudManager.cs` 中未再使用的 `CreateText`、`FindOrCreateText`、`FindOrCreateRect`、`CreateRect`、`GetRuntimeFont` 等旧运行时创建工具，避免后续误回退到非 prefab 路径。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/UI/HUD选择动作页模块.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 左侧单位/建筑信息详情区
- 右侧动作页中的研究当前项
- 统一头像块
- Buff / 技能 / 改造详情弹层
- 单位与建筑头顶世界 HUD 的旧 fallback 工具链

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- `SelectionBuffDetailsPanel_Prefab` 当前资源内节点仍需与脚本期望完全对齐，否则会只剩透明占位并输出错误；下一轮应优先补 prefab 本体，而不是把旧界面逻辑写回代码。
- `SelectionPanel.cs` 里仍有若干历史布局覆盖函数（尤其移动端/详情弹层一带）需要继续按同样思路收紧，让位置、大小、静态说明尽量回到 prefab 内维护。

## 2026-05-16 - 科技树研究队列与Buff详情页对齐

### 修改内容
- 继续按“一个功能页一个功能页”方式排查 HUD prefab 错配，先处理建筑科技树页与 Buff 详情弹层。
- 调整 `SelectionPanel.cs`：
  - Buff 详情弹层优先绑定新节点名，兼容旧 prefab 中的 `Icon/Title/Meta/Description`。
  - 当详情 prefab 只有单个 `Description` 文本时，将效果说明与逻辑说明合并写入，不再创建旧说明块。
  - `LayoutBuffDetails(...)` 改为仅在 prefab 未声明保留布局/样式时才覆盖，减少代码对 prefab 内位置、大小、字号的反写。
- 调整 `UiPrefabWorkflowGenerator.cs`：
  - `CreateSelectionBuildingTechTreePagePrefab(...)` 新增 `ResearchCategoryTitle`。
  - 为 `ResearchQueueContent` 新增 `CurrentResearch` 固定模块及其 `Icon/NameLabel/StatusLabel/RemainingLabel/ProgressBar/Fill/ProgressLabel/CancelButton` 子节点。
  - 新增 `EmptyLabel`，让“无当前研究”状态也回到 prefab 内维护。
- 执行 Unity batch 重建 modular screen prefabs，并回扫确认 `SelectionBuildingTechTreePage_Prefab.prefab` 已实际写入上述节点。
- 调整 `MinimapUI.cs`：标题、时间、图例、提示文案优先读取现有 prefab 子节点，开始收口小地图文本的旧运行时创建入口。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/MinimapUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingTechTreePage_Prefab.prefab`
- `Docs/UI/HUD建筑科技树页模块.md`
- `Docs/UI/HUD选择动作页模块.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 右侧建筑科技树页
- 科技树当前研究条目显示区
- Buff / 状态详情弹层
- 小地图标题、时间、图例、提示文字绑定方式

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- Unity batch：`RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildModularScreenPrefabs`
- 扫描 prefab 关键节点：
  - `ResearchCategoryTitle`
  - `CurrentResearch`
  - `NameLabel`
  - `StatusLabel`
  - `RemainingLabel`
  - `ProgressLabel`
  - `CancelButton`
  - `EmptyLabel`

### 后续注意事项
- `SelectionBuffDetailsPanel_Prefab` 资源本体目前仍是四节点旧结构，只是脚本已兼容；下一轮应把关闭/固定/使用技能按钮和逻辑文本区真正补回 prefab 本体。
- `MinimapUI.cs` 中缩放按钮 `Label` 与部分文本 fallback 仍有残余旧路径，下一轮继续彻底清掉，确保小地图也完全回到 prefab 强绑定。


## 2026-05-16 - 小地图缩放按钮与 Buff 详情页 prefab 重建链修复

### 修改内容
- 继续排查 HUD 中残留的旧式可见 fallback 与 prefab 未实际落地问题，先处理小地图缩放按钮和 Buff 详情页。
- 调整 MinimapUI.cs：MinimapZoomButton 的 Label 改为必须直接来自 prefab，代码不再运行时创建可见文字节点；同时合并重复的缩放文案刷新逻辑。
- 调整 UiPrefabWorkflowGenerator.cs：
  - SavePrefab() 保存前递归清理 missing script，避免历史残留脚本阻塞 SelectionPanel_Prefab、MainHudRoot_Prefab 等 HUD prefab 重建。
  - RebuildModularScreenPrefabs() 补入 SelectionBuffDetailsPanel，让 Buff 详情页真正参与批量重建。
- 重新执行 Unity batch 重建，确认 SelectionGroupBar_Prefab、SelectionPanel_Prefab、MainHudRoot_Prefab 不再因 GroupShortcutContent 的 missing script 报错，批量重建日志正常输出 Modular screen prefabs rebuilt。
- 回扫确认当前运行时 Buff 详情页 prefab 已实际写入新版节点：BuffIcon、BuffDetailsTitle、BuffDetailsType、BuffDetailsEffect、BuffDetailsLogic、BuffDetailsClose、BuffDetailsPin、BuffDetailsUseSkill。
- 补充 HUD prefab 开发规则文档，明确 Buff 详情页的真实运行时 prefab 路径与旧资源路径区别。

### 修改文件
- Assets/Scripts/UI/MinimapUI.cs
- Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs
- Assets/Resources/UI/Prefabs/InGame/SelectionBuffDetailsPanel_Prefab.prefab
- Docs/UI/HUD预制体开发规则.md
- Docs/05_TASK_LOG.md

### 新增文件
- 无

### 影响范围
- 小地图缩放按钮文案与 prefab 绑定方式
- Buff / 状态详情弹层的真实运行时 prefab 结构
- SelectionPanel_Prefab、MainHudRoot_Prefab 的批量重建稳定性

### 验证方式
- dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false
- dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false
- Unity batch：RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildModularScreenPrefabs
- 回扫日志：Logs/RebuildModularScreenPrefabs_20260516_g.log
- 扫描 prefab 关键节点：
  - BuffIcon
  - BuffDetailsTitle
  - BuffDetailsType
  - BuffDetailsEffect
  - BuffDetailsLogic
  - BuffDetailsClose
  - BuffDetailsPin
  - BuffDetailsUseSkill

### 后续注意事项
- Assets/Resources/UI/Prefabs/Components/SelectionBuffDetailsPanel_Prefab.prefab 仍是历史旧资源；后续若继续改 Buff 详情页，必须优先编辑 Assets/Resources/UI/Prefabs/InGame/SelectionBuffDetailsPanel_Prefab.prefab。
- 小地图缩放按钮后续若还出现文案或布局异常，应优先检查 MinimapZoomButton_Prefab/Label，不要再把可见文字 fallback 写回代码。
## 2026-05-16 - HUD Buff详情页运行时映射与旧资源清理

### 修改内容
- 复核 SelectionBuffDetailsPanel 的运行时链路，确认 UiPrefabLibrary.asset 中 `PrefabType: 132` 已明确指向 `Assets/Resources/UI/Prefabs/InGame/SelectionBuffDetailsPanel_Prefab.prefab`，不再指向历史 Components 目录资源。
- 删除不再被任何资源引用的历史旧 prefab：`Assets/Resources/UI/Prefabs/Components/SelectionBuffDetailsPanel_Prefab.prefab`，避免后续继续误改到错误目标。
- 清理 `SelectionPanel.cs` 中未再使用的旧 helper（`ResolveRectChild`、`ResolveOrCreateText`），减少继续回退到旧式运行时补节点思路的风险。
- 更新 `UiPrefabResolver` 注释，明确当前规则是“可见结构必须来自 prefab，缺失时只允许非可视占位”，不再暗示可以继续沿用旧可见 fallback。
- 回扫 `SelectionBuffDetailsPanel` 全项目引用，确认当前仅剩 InGame 运行时 prefab 与生成器/绑定代码链路。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/UiPrefabResolver.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuffDetailsPanel_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuffDetailsPanel_Prefab.prefab.meta`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD Buff / 状态详情弹层的真实编辑目标与运行时映射
- 后续 HUD prefab 排查时对旧 duplicate 资源的误判风险
- SelectionPanel 内部固定节点绑定 helper 的维护边界

### 验证方式
- `rg -n "SelectionBuffDetailsPanel_Prefab|SelectionBuffDetailsPanel" Assets -g "*.asset" -g "*.prefab" -g "*.unity" -g "*.cs"`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 检查 `Assets/Resources/UI/Configs/UiPrefabLibrary.asset` 中 `PrefabType: 132` 的 guid 是否对应 InGame prefab 的 guid `b34bb25f9e484964abda546bb2c35389`

### 后续注意事项
- 后续继续改 Buff 详情页时，只应编辑 `Assets/Resources/UI/Prefabs/InGame/SelectionBuffDetailsPanel_Prefab.prefab`。
- 若后续再发现 HUD 详情页节点缺失，应继续沿用“报错 + 透明占位”策略，不允许为了兜底再恢复一套可见旧 UI。
- 本轮已额外验证 `dotnet build Assembly-CSharp-Editor.csproj` 可通过；若之后再次出现 editor 工程引用异常，再优先检查是否使用了带 `/p:BuildProjectReferences=false` 的构建方式。
## 2026-05-16 - HUD 信息条与属性卡 prefab 化继续收口

### 修改内容
- 调整 `SelectionPanel.cs` 中的 `CreateInfoProgressRow()` 与 `CreateInfoAttributeCard()`，不再运行时新建可见 `Track`、`Fill`、`Label`、`Value`、`Icon` 子节点，而是优先绑定 prefab 固定节点并仅刷新数据。
- 为兼容当前项目里仍可能保留的历史通用卡片 prefab 结构，增加旧节点名兼容绑定：
  - 进度条兼容 `Meta/Description/Icon`
  - 属性卡兼容 `Meta/Description/Icon`
  兼容逻辑只复用旧节点，不再继续补建新的可见结构。
- 扩展 `UiPrefabWorkflowGenerator.cs`，新增 `CreateSelectionProgressRowPrefab()` 与 `CreateSelectionAttributeCardPrefab()`，并把两者纳入 `RebuildModularScreenPrefabs()` 与通用 prefab 生成分支，明确后续目标结构应为：
  - `SelectionProgressRow`: `Label/Track/Fill/Value`
  - `SelectionAttributeCard`: `Icon/Label/Value`
- 回扫确认当前这两个 prefab 资源本体仍停留在历史通用卡片结构，故本轮先以“运行时不再造新可见节点 + 保留旧节点兼容”为主，避免 HUD 再被代码抢布局。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 左侧单位/建筑信息区的 HP/进度条显示
- HUD 左侧属性卡（攻击、防御、抗性、范围、攻速、移速等）显示
- 后续 `SelectionProgressRow_Prefab` 与 `SelectionAttributeCard_Prefab` 的真实编辑目标结构

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj`
- 检查 `SelectionPanel.cs` 中进度条/属性卡逻辑不再创建新的可见子节点
- 回扫 prefab 关键节点与旧节点兼容情况

### 后续注意事项
- 当前运行时已不再继续补建这两个模块的可见子节点，但 prefab 资源本体仍需在后续一次 Unity 重建中真正刷成专用结构。
- 等 `SelectionProgressRow_Prefab` 与 `SelectionAttributeCard_Prefab` 确认已更新为专用节点后，应删除这轮保留的旧节点名兼容逻辑，避免长期双结构并存。

## 2026-05-16 - HUD 信息条与属性卡专用 prefab 资源落地

### 修改内容
- 复核并确认 `SelectionProgressRow_Prefab` 与 `SelectionAttributeCard_Prefab` 两个资源本体已不再是历史 `Title/Meta/Description/Icon` 通用卡片结构，而是实际落地为专用 HUD 信息模块结构。
- 继续收口 `SelectionPanel.cs`：
  - `CreateInfoProgressRow()` 只绑定 `Label/Track/Fill/Value`
  - `CreateInfoAttributeCard()` 只绑定 `Icon/Label/Value`
  - 移除这两个模块对 `Meta/Description/Icon` 的旧结构兼容路径
- 保留项目统一策略：若 prefab 节点缺失，只允许报错并创建透明占位，不允许恢复可见旧 UI。
- 补充 HUD 开发规则文档，明确这两个模块当前已经进入“资源本体 + 运行时代码”一致的新终态。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionProgressRow_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/SelectionAttributeCard_Prefab.prefab`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 左侧单位/建筑信息中的血量/进度条显示
- HUD 左侧属性卡中的图标、标签、数值显示
- 后续在 Unity 中直接编辑这两个 prefab 的位置、大小、文本区和配色时的生效路径

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- 扫描 prefab 节点名，确认仅保留：
  - `SelectionProgressRow_Prefab`: `Label/Track/Fill/Value`
  - `SelectionAttributeCard_Prefab`: `Icon/Label/Value`
- 扫描 `SelectionPanel.cs`，确认这两个模块已移除 `usingLegacyProgressPrefab` / `usingLegacyAttributePrefab` 与旧节点名兼容绑定

### 后续注意事项
- 后续如果这两个模块显示还有偏移、宽度、字体样式问题，应优先直接改 prefab，不要再把这些参数写回 `SelectionPanel.cs`。
- 继续排查 HUD 其他模块时，沿用同一规则：先确认运行时实际读取的是哪一份 prefab 资源，再移除旧兼容路径，避免“代码改了但资源本体没落地”的假完成状态。

## 2026-05-16 - SelectionPanel 固定子布局改为尊重 prefab 层级

### 修改内容
- 继续排查 `SelectionPanel` 运行时覆盖 prefab 布局的问题，确认根因不是单个节点，而是大量固定子节点仍在脚本里直接写 `anchorMin / anchorMax / anchoredPosition / sizeDelta`。
- 在 `SelectionPanel.cs` 中新增 `ShouldPreserveLayoutHierarchy(RectTransform rect)`，把布局保护规则从“只看当前节点”扩展为“只要当前节点或任意父层 prefab 区块声明 PreserveLayout，就不再改这个节点布局”。
- 收口 `ApplyControlSchemeLayout()`、`LayoutPcText()`、`LayoutPcPanelChild()`、`LayoutPcFloatingPanel()`、`LayoutPcTextInside()`、`LayoutPcSectionTitle()`、`LayoutPcBlock()`、`LayoutPcPanelRoot()`、`LayoutPcUnitCommandPanel()`、`LayoutPcRallyPointButton()` 等关键入口。
- 这轮重点先稳住真正影响 prefab 编辑体验的固定模块：
  - 左右主面板
  - 标题/属性/信息块
  - 技能条
  - 编队条 / 多选条
  - Buff 详情
  - 自动化条
  - 攻击移动按钮
- 保留代码对动态列表、条目数量、滚动内容尺寸和数据绑定的职责，不把这些一并误删。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- `SelectionPanel_Prefab` 及其内部固定子节点在 Unity 中调整位置、大小、锚点后的运行时生效路径
- 建造 / 造兵 / 科技 / 机械改造等 HUD 固定容器的 prefab 编辑体验
- 多选条、编队条、Buff 详情等浮层的 prefab 编辑体验

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 扫描 `SelectionPanel.cs` 中关键布局入口，确认已改为优先使用 `ShouldPreserveLayoutHierarchy(...)`
- 重点关注运行时曾经覆盖 prefab 的模块：
  - `pcLeftPanelRoot`
  - `pcRightPanelRoot`
  - `pcActionAreaRoot`
  - `skillBarRoot`
  - `groupShortcutBarRoot`
  - `multiPortraitBarRoot`
  - `buffDetailsRoot`
  - `groupPickerRoot`
  - `groupManageRoot`

### 后续注意事项
- 这轮先解决“父 prefab 已声明保留布局，但子节点仍被 `SelectionPanel` 抢位置”的根问题；`SelectionPanel.cs` 里仍有部分更深层的按钮卡片、Buff 图标、机械卡片等细粒度布局入口，下一轮继续逐块收口。
- 如果后续某些固定节点还会被改位置，优先沿用本轮的层级保护规则，而不是继续给单点写死坐标。

## 2026-05-16 - SelectionPanel 固定子节点第二轮布局收口

### 修改内容
- 继续收口 `SelectionPanel` 中更深层的固定子节点布局代码，把第二批最常需要在 prefab 里直接调整的内部节点切到层级 PreserveLayout 规则。
- 本轮覆盖：
  - `CreateSkillButton()` 中 `Icon / Cooldown / Label / Status`
  - `LayoutAutomationButtons()` 中自动化按钮本体、标题和副标题
  - `LayoutBuffDetails()` 中 Buff 详情页图标、标题、类型、效果、逻辑、固定按钮、使用技能按钮
  - `LayoutPcBuildingOperationPanels()` 中建筑操作页标题
- 继续保留动态排布职责：
  - 技能按钮数量和绑定
  - 自动化按钮顺序和显隐
  - 目录横向滚动内容尺寸

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 技能条按钮内部结构的 prefab 编辑体验
- HUD 自动化按钮内部结构的 prefab 编辑体验
- Buff 详情页内部文本和按钮的 prefab 编辑体验
- 建筑操作页标题区的 prefab 编辑体验

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 扫描 `SelectionPanel.cs`，确认上述模块的固定子节点布局已改为使用 `ShouldPreserveLayoutHierarchy(...)`

### 后续注意事项
- `SelectionPanel.cs` 里仍有部分目录 Tab、研究/建造/生产卡片、机械改造卡片、Buff 图标列表等深层节点还在直接检查 `UiPrefabResolver.ShouldPreserveLayout(...)`；后续继续按模块逐块收口。
- 当前对横向/网格目录内容的排布逻辑还由代码掌控，这是有意保留的动态职责，不应与固定 prefab 布局规则混淆。

## 2026-05-16 - SelectionPanel 固定子节点第三轮布局收口

### 修改内容
- 继续把 `SelectionPanel` 深层固定子节点从“只尊重当前节点 preserve”收口为“尊重父层 prefab preserve”。
- 本轮覆盖：
  - 建造 / 造兵 / 研究卡片内部的 `Label / Icon / CostRow`
  - 建筑操作按钮内部的 `Label / Icon`
  - 机械改造卡内部的 `Title / Icon / Meta`
  - Buff 图标内部的 `Glow / Icon / Polarity / Duration`
  - 多选头像项与编队快捷项的 fallback 尺寸判定
  - 机械改造槽位与机械改造卡列表本体
- 继续保留目录内容、横向列表和网格的动态排列职责，不误伤运行时数据驱动部分。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造 / 造兵 / 研究卡片在 prefab 内调整内部图标、标题、费用区后的运行时生效路径
- 机械改造卡与机械改造槽位在 prefab 内调整后的运行时生效路径
- Buff 图标条目在 prefab 内调整边框发光、图标、极性角标、持续时间文本后的运行时生效路径
- 多选头像和编队快捷项在 prefab 内调整尺寸后的运行时生效路径

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 回扫 `SelectionPanel.cs` 中剩余 `UiPrefabResolver.ShouldPreserveLayout(...)` 调用数量，确认已进一步缩减

### 后续注意事项
- 当前 `SelectionPanel.cs` 剩余直接使用 `UiPrefabResolver.ShouldPreserveLayout(...)` 的点位已经很少，主要集中在信息条/属性卡专用 prefab、透明占位入口和极少数动态列表逻辑；下一轮继续收最后这批。
- 对目录内容区的横向/网格排列不要误删，那部分仍是代码职责，不属于“固定子节点布局回 prefab”的范畴。

## 2026-05-17 - SelectionPanel 与 UnitProductionPanel 节点绑定修复

### 修改内容
- 修复 `SelectionPanel` 仍按旧顶层结构强制查找 `SelectionSubtitle / PrimaryStats / SecondaryStats / CurrentAction / UnitTags / UnitRole` 导致的连续报错。
- 将上述旧字段收口为历史兼容别名，统一复用当前 `SelectionInfoPanel_Prefab` 内的 `HeaderSubtitle / HealthText / AttributeText / ExtraInfoText`。
- 移除单选/多选单位显示流程里对这批旧字段的重复写入，避免与现有 PC 信息面板双写。
- 修复 `SelectionPanel` 技能条根节点查找路径，改为优先从 `RightActionArea` 绑定 `SkillBar`。
- 更新 `UiPrefabWorkflowGenerator.CreateSelectionActionPanelPrefab()`，把 `SkillBar / SkillHint` 正式写入 `SelectionActionPanel_Prefab` 规则。
- 直接补齐 `Assets/Resources/UI/Prefabs/InGame/SelectionActionPanel_Prefab.prefab` 中缺失的 `SkillBar / SkillHint`，避免当前打开中的 Unity 项目因锁文件未重建而继续报错。
- 修复 `UnitProductionPanel` 中 `QueueScrollRect` 的 viewport 绑定错误，不再把 scroll 根节点覆盖成 viewport。
- 修复 `UnitProductionPanel` 对 `QueueEntries` / `UnitButtons` 的布局覆写，若 prefab 已声明 PreserveLayout，则运行时不再重写锚点和尺寸。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/InGame/SelectionActionPanel_Prefab.prefab`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 选中单位/建筑时左侧信息面板的旧文本节点兼容绑定
- 右侧动作区技能条容器的 prefab 化结构
- 造兵窗口的队列滚动区与单位列表容器绑定
- HUD 预制体重建规则与当前运行时 prefab 一致性

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 检索 `Assets/Resources/UI/Prefabs/InGame/SelectionActionPanel_Prefab.prefab`，确认存在：
  - `m_Name: SkillBar`
  - `m_Name: SkillHint`
  - `slotId: SkillBar`
  - `slotId: SkillHint`

### 后续注意事项
- `Logs/RebuildModularScreenPrefabs_20260516_skillbar.log` 显示当前项目正被另一实例占用，所以这轮批量重建没有真正执行成功；已同时修改生成器规则和运行时 prefab 本体，等 Unity 空闲后可再手动执行一次 `RebuildModularScreenPrefabs` 做全量同步。
- 当前已优先解决本轮用户贴出的 UI prefab 绑定报错；`NavMesh` 与 `UnitData` 相关报错属于独立玩法运行时问题，后续应分任务单独排查，不要混在 HUD prefab 修复里一起判断。

## 2026-05-17 - 造兵窗口运行时报错与单位生成时序修复

### 修改内容
- 修复 `BuildingUnitProductionWindowUI` 绑定大造兵窗口时仍可能再次实例化一层 `UnitProductionPanel` 的旧路径，改为优先复用 `ProductionPagePanel/StandaloneUnitProductionPanel` 现有嵌套 prefab。
- 修复 `UnitProductionPanel` 对 `UnitButtons` / `QueueEntries` 的查找范围过窄问题，增加对 viewport 与 scroll 根节点两层结构的兼容查找。
- 修复 `UnitProductionPanel` 在 prefab 节点存在但缺最小滚动组件时的半失效状态，运行时会补齐 `Mask / ScrollRect` 的必要设置，不再直接误报整块缺失。
- 更新 `UiPrefabWorkflowGenerator` 中快捷卡片按钮规则，给 `BuildButton / BuildingProductionButton / ResearchButton` 的 `CostRow` 补入 `CostSlotTemplate / FreeLabel` 终态结构。
- 修复 `BaseUnit` 在 `Awake()` 阶段尚未分配 `UnitData` 时就执行完整成长/表现初始化的问题，改为仅在已有 `UnitData` 时执行初始完整状态同步，`AssignUnitData()` 后再统一重建。
- 调整 `ModeMapRuntimeGenerator` 的运行顺序，在生成首批 session 单位前先执行一次 `RebuildNavMesh()`，减少初始单位 `NavMeshAgent` 出生时找不到有效导航面的报错。

### 修改文件
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Scripts/Units/BaseUnit.cs`
- `Assets/Scripts/Core/ModeMapRuntimeGenerator.cs`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 中建筑大造兵窗口的绑定链路
- 快捷建造 / 造兵 / 科技按钮的费用行模板要求
- 运行时单位列表和生产队列滚动区
- 首批出生单位的运行时 `UnitData` 初始化与 `NavMeshAgent` 启动顺序

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 本轮已经把脚本侧的旧绑定路径和运行时初始化顺序收紧，但 `BuildButton_Prefab`、`BuildingProductionButton_Prefab`、`ResearchButton_Prefab` 的资源本体仍需在 Unity 内或批量重建后确认 `CostSlotTemplate / FreeLabel` 已真正落地。
- 若运行中仍出现 `ArgumentException: Mesh can not have more than 65000 vertices`，下一轮优先检查造兵/建造快捷按钮是否在刷新时反复重复实例化，重点排查 `PcQuickTrain_*`、`PcQuickBuild_*`、`PcQuickResearch_*` 这三类目录内容。

## 2026-05-17 - HUD运行时报错继续收口

### 修改内容
- 继续针对游戏内实际运行时报错收口 `SelectionPanel`、`UnitProductionPanel`、`BaseUnit`、`UnitController`。
- 收紧 `SelectionPanel` 的费用行规则：`EnsureCostRowTemplate(...)` 不再在运行时创建新的可见 `CostSlotTemplate / FreeLabel`，缺失时直接报错，要求真实节点必须来自 prefab。
- 收紧 `UnitProductionPanel` 的滚动区规则：`UnitButtons`、`QueueScrollRect`、`QueueEntries` 缺失时不再创建新的可见运行时面板，只报错并停止该区绑定。
- 修复 `UnitController.Start()` 对 `BaseUnit.Start()` 的遮挡，改为 `override + base.Start()`，保证 `UnitData` 缺失检查与基类启动流程实际生效。
- 直接补齐三份快捷按钮 prefab 资源本体中的费用模板节点：
  - `BuildButton_Prefab`
  - `BuildingProductionButton_Prefab`
  - `ResearchButton_Prefab`
  现在三者都已包含 `CostSlotTemplate / CostSlotTemplate/Icon / CostSlotTemplate/Amount / FreeLabel`。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/Units/BaseUnit.cs`
- `Assets/Scripts/Units/UnitController.cs`
- `Assets/Resources/UI/Prefabs/Components/BuildButton_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/BuildingProductionButton_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/ResearchButton_Prefab.prefab`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造 / 造兵 / 科技快捷卡片的费用行显示
- 建筑大造兵窗口的滚动区绑定
- 运行时旧 UI fallback 是否继续抢回可见结构
- 单位出生后 `UnitData` 检查与启动时序

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "CostSlotTemplate|FreeLabel" Assets/Resources/UI/Prefabs/Components/BuildButton_Prefab.prefab Assets/Resources/UI/Prefabs/Components/BuildingProductionButton_Prefab.prefab Assets/Resources/UI/Prefabs/Components/ResearchButton_Prefab.prefab`

### 后续注意事项
- 这轮已经把三份快捷按钮 prefab 的资源本体直接补齐；后续调费用行位置、大小、颜色时，应直接改 prefab，不要再把布局参数写回 `SelectionPanel.cs`。
- `UnitProductionPanel_Prefab` 的滚动区虽然当前节点名与关键组件已存在，但如果 Unity 内仍发现 viewport/content 连接异常，应优先直接修 prefab 本体，不要恢复运行时代码创建整块可见滚动区的旧思路。

## 2026-05-17 - HUD运行时报错与刷新性能继续收口

### 修改内容
- 修复 `SelectionPanel.ConfigurePcCostRow(...)` 在每帧快捷按钮状态刷新时反复销毁/实例化费用槽的问题，改为复用已有 `RuntimeCostSlot_*`，降低同帧 UI 顶点堆积风险。
- 调整快捷造兵 / 快捷研究点击后的刷新方式，只刷新建筑信息、队列和快捷按钮状态，不再整页销毁重建 `PcQuickTrain_* / PcQuickResearch_*` 卡片。
- 继续收紧 `UnitProductionPanel`：`UnitScrollRect` 与 `UnitButtons` 缺失时只报错，不再运行时创建可见旧滚动区或旧列表根。
- 调整 `UnitController` 的 `NavMeshAgent` 启用时机：`Awake()` 不再立即启用 agent，改为在已有 NavMesh 数据并能采样到位置后再启用和 `Warp`，移动前也会再次尝试恢复。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/Units/UnitController.cs`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造 / 造兵 / 科技快捷卡片费用行刷新
- 建筑快捷造兵和快捷研究点击后的 HUD 刷新路径
- 大造兵窗口滚动区 prefab 强绑定规则
- 首批单位生成和后续移动前的 `NavMeshAgent` 启用流程

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg` 扫描确认 `UnitProductionPanel` 不再创建 `UnitScrollRect / QueueScrollRect / UnitButtons` 旧可见结构

### 后续注意事项
- 如果仍出现 `Mesh can not have more than 65000 vertices`，下一步优先在 Unity Profiler / Hierarchy 中确认是否还有其它 HUD 动态列表在高频 `Destroy + Instantiate`。
- 如果仍出现 `NavMeshAgent` 无有效 NavMesh，继续检查运行时 `NavMeshSurface` 是否实际 build 成功，以及出生点附近是否被地形/建筑 collider 排除。

## 2026-05-17 - HUD建造详情页旧入口清理

### 修改内容
- 移除 `MainHudRoot_Prefab` 中旧的 `BuildingDetailsPanel` 实例，HUD 建造详情页统一收口到 `BuildDevelopmentRoot/BuildDetailPanel_PC`。
- `GameUI.ReturnToBuildingDetails(...)` 保持关闭造兵/科技窗口后回到 SelectionPanel 建筑选择信息，不再打开旧 `BuildingProductionUI` 建筑详情窗。
- `UiPrefabWorkflowGenerator.CreateMainHudRootPrefab()` 的主 HUD 结构不再自动嵌入 `BuildingDetailsPanel`。
- `BuildDevelopmentPanelUI.PopulatePcBuildingGrid()` 的可建造建筑改为纵向列表卡片。
- `PcBuildIcon_*` / `BuildCard_*` 继续使用 `BuildButton_Prefab`，内部 `Icon / Label / CostRow` 改为优先绑定 prefab 节点，代码只刷新数据和状态。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/UI/游戏内UI预制体化规范.md`
- `Docs/UI/UI预制体重做蓝图.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Docs/UI/HUD建造详情页模块.md`

### 影响范围
- 战斗 HUD 建造发展页
- PC 可建造建筑列表
- 建造详情页入口与旧建筑详情页兼容路径
- `BuildButton_Prefab` 在建造列表中的绑定规则

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "BuildingDetailsPanel|6792812581641005768|7527813930562384764" Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab Assets/Scripts/UI/GameUI.cs Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`

### 后续注意事项
- `BuildingDetailsPanel_Prefab` 仍可能作为历史兼容资源或独立生成器类型存在，但不能再挂入 `MainHudRoot_Prefab` 或作为建造详情页运行时入口。
- 建造卡内部布局后续必须改 `BuildButton_Prefab`，不要再在 `BuildDevelopmentPanelUI` 中写 `Icon / Label / CostRow` 的固定偏移和尺寸。

## 2026-05-17 - ContextLayer旧建造面板清理与横向建造列表

### 修改内容
- 清理 `GameUI` 中旧 `BuildMenuPanel` 的按钮容器、滚动区、标题和可见 fallback 创建逻辑，不再运行时生成 `BuildingPanel_Auto / BuildMenuViewport / BuildMenuContent`。
- `BuildMenuPanel` 和 `BuildingProductionPanel` 不再作为 `MainHudRoot_Prefab/ContextLayer_AdvancedPanels` 的当前页面；保留历史资源但不作为 HUD 入口。
- `BuildDevelopmentPanelUI` 的 PC 建造卡与备用/移动建造卡列表统一为横向排列/横向滚动。
- 资源变化时刷新当前打开的 `BuildDevelopmentRoot`，不再刷新旧 BuildMenu 按钮绑定列表。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/UI/HUD建造详情页模块.md`
- `Docs/UI/游戏内UI预制体化规范.md`
- `Docs/UI/UI预制体重做蓝图.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 的高级页面层 `ContextLayer_AdvancedPanels`
- 建造发展页 `BuildDevelopmentRoot`
- 可建造建筑横向列表与建造卡刷新
- 旧建造菜单和旧建筑生产面板兼容路径

### 验证方式
- `rg -n "buildingButtonContainer|BuildingPanel_Auto|BuildMenuViewport|BuildMenuContent|CreateFallbackButtonContainer|EnsureBuildMenuLayout" Assets/Scripts/UI/GameUI.cs`
- `rg -n "BuildMenuPanel|BuildingProductionPanel" Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- `BuildMenuPanel_Prefab`、`BuildingDetailsPanel_Prefab`、`BuildingProductionPanel_Prefab` 暂作为历史兼容资源保留；后续确认无引用后再做资源级删除。
- 建造卡内部图标、文字、费用行的位置和图片继续改 `BuildButton_Prefab`，代码只允许控制动态条目的数量、顺序、宽高和数据绑定。

## 2026-05-17 - 竞技模式设置页列表排版修复

### 修改内容
- 修复点击竞技模式后 `CompetitiveSetup` 设置项全部堆在中间的问题：动态生成的 `Row_*` 根节点现在按行号纵向排列，不再保留 `MainMenuOptionRow_Prefab` 的模板中心坐标。
- 修正主菜单设置行内按钮 prefab 选择，`Next / Minus / Plus / Toggle / Rename` 等按钮改用 `MainMenuButton_Prefab`，不再误用整行 `MainMenuOptionRow_Prefab`。
- 调整 `MainMenuOptionRow_Prefab` 根节点的 preserve 规则：根节点不保留布局，行内子节点仍保留 prefab 布局和样式，方便调整文字、说明和按钮区域。
- 同步更新 prefab 生成器，后续重建 `MainMenuOptionRow_Prefab` 时不会恢复错误的根布局保留。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/MainMenuOptionRow_Prefab.prefab`
- `Docs/UI/UI预制体重做蓝图.md`
- `Docs/UI/游戏内UI预制体化规范.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单竞技模式设置页
- 生存模式设置页和其它使用 `CreateOptionRow(...)` 的动态设置列表
- 主菜单设置行 prefab 的根布局规则
- 行内按钮 prefab 绑定规则

### 验证方式
- `rg -n "MainMenuOptionRow|ResolveMainMenuButtonPrefabType|CreateOptionRow" Assets/Scripts/UI/MainMenuUI.cs`
- `rg -n "preservePrefabLayout: 0" Assets/Resources/UI/Prefabs/Components/MainMenuOptionRow_Prefab.prefab`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 如果后续要把竞技设置页整体 prefab 化，应新增完整页面 prefab 或设置页模块 prefab；动态行根仍应由列表容器控制排列，行内结构继续由 `MainMenuOptionRow_Prefab` 控制。
- 固定页面上预置好的按钮和行节点可以保留布局；运行时按数据克隆出来的列表条目不能保留模板中心坐标。

## 2026-05-18 - HUD 顶部资源栏与小地图布局调整

### 修改内容
- 将战斗 HUD 的资源栏 `TopStatusBar` 调整为屏幕顶部居中显示，并同步 desktop / mobile 布局兜底配置。
- 将小地图 `MinimapPanel` 调整为左上角显示，同时把任务目标提示 `ObjectiveHintPanel` 挂到小地图下方。
- 同步修正 `GameUI` 中任务目标提示卡的 fallback 坐标，避免 prefab 缺失时退回旧位置。
- 更新 HUD 开发文档，明确这三个模块后续应优先修改的 prefab / config 文件和推荐布局值。

### 修改文件
- `Assets/Resources/UI/Configs/UiScreenLayoutConfig.asset`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Pages/MinimapCanvas_Prefab.prefab`
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 顶层资源栏
- 左上角小地图模块
- 任务目标提示卡
- HUD 顶层 prefab 布局与运行时 fallback 布局一致性

### 验证方式
- `rg -n "TopStatusBar|MinimapPanel|ObjectiveHintPanel" Assets/Resources/UI/Configs/UiScreenLayoutConfig.asset Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab Assets/Resources/UI/Prefabs/Pages/MinimapCanvas_Prefab.prefab Assets/Scripts/UI/GameUI.cs`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 这三块位置后续优先改 prefab 和 `UiScreenLayoutConfig`，不要再往 `GameUI` 里单独写新的锚点和偏移。
- 如果后续希望任务目标区域继续细分成“简要提示卡”和“完整任务面板”，应继续保留 `ObjectiveHintPanel` 作为轻量入口，`SurvivalTaskPanel` 作为展开页，不要把两者重新混到一个层级职责里。

## 2026-05-18 - 建造页与造兵页横向大卡收口

### 修改内容
- 将建造页动态建造卡改为横向容器排布，移除运行时按索引手工写入卡片位置和尺寸的旧逻辑。
- 调整 `BuildButton_Prefab` 为大卡结构，统一为“大图标 + 底部资源 + 名字”的可编辑 prefab 形态。
- 将造兵大页训练列表从固定四列 `GridLayoutGroup` 改为单行横向列表，运行时优先服从 prefab 卡片尺寸。
- 调整 `BuildingProductionButton_Prefab` 为大卡结构，并移除 `UnitProductionPanel` 对 prefab 卡片高度和宽度的强制覆盖。
- 更新 HUD 建造页与 HUD 造兵页模块文档，补充本轮 prefab 优先规则。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Resources/UI/Prefabs/Components/BuildButton_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/BuildingProductionButton_Prefab.prefab`
- `Docs/UI/HUD单位建造页模块.md`
- `Docs/UI/HUD建筑造兵页模块.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 建造页的建筑卡排版
- HUD 建筑选中后的快捷造兵卡排版
- 建筑造兵大页的训练单位列表排版
- prefab 与运行时布局职责边界

### 验证方式
- `rg -n "ProductionGridCellSize|dynamicBuildEntry|GridLayoutGroup|HorizontalLayoutGroup" Assets/Scripts/UI/BuildDevelopmentPanelUI.cs Assets/Scripts/UI/UnitProductionPanel.cs`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 后续继续调建造卡、造兵卡的位置、大小、图标区、名字区、费用区时，优先直接修改 prefab，不要再往脚本中补新的 `sizeDelta`、`anchoredPosition` 或固定网格尺寸。
- `UnitProductionCard_Prefab` 仍是大造兵窗口的主卡模板，后续如果还要进一步统一视觉，应继续沿这套 prefab 结构收口，不要重新恢复小按钮网格思路。

## 2026-05-18 - HUD 内嵌建造页与造兵页容器布局继续收口

### 修改内容
- 继续收口 `SelectionPanel` 中 HUD 内嵌建造页、造兵页、分类页签和生产队列的列表排布逻辑，改为由内容容器统一进行横向布局。
- `BuildCategoryTabsContent`、`ProductionGridContent`、`ProductionQueueContent` 现在都优先使用容器布局，不再依赖脚本按索引手工写入卡片横坐标。
- 统一内嵌 HUD 页与大造兵窗口的职责边界：卡片尺寸、图标区、名字区、费用区优先由 prefab 控制，脚本只负责显隐、顺序、数据绑定和点击事件。
- 同步更新建造页与造兵页模块文档，补充内嵌 HUD 页的容器布局规则。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/UI/HUD单位建造页模块.md`
- `Docs/UI/HUD建筑造兵页模块.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 内嵌建造页的分类页签与建造卡排版
- HUD 内嵌造兵页的快捷造兵卡排版
- HUD 内嵌生产队列排版
- prefab 与运行时布局职责的一致性

### 验证方式
- `rg -n "LayoutPcBuildableCatalog|LayoutPcProductionCatalog|RefreshPcProductionQueueRow|CreatePcCatalogContent|ConfigurePcCatalogContentLayout" Assets/Scripts/UI/SelectionPanel.cs`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- `SelectionBuildingProductionPage_Prefab` 里的 `BuildCategoryTabsContent`、`ProductionGridContent`、`ProductionQueueContent` 后续如果还要继续调间距、padding、对齐方式，应优先直接在 prefab 或容器布局组件上处理，不要再往 `SelectionPanel` 补新的逐项坐标代码。
- 科技树页、改造页如果后续继续做同类优化，也应优先复用这套“容器布局 + prefab 卡片”的模式。

## 2026-05-18 - 科技树页与机械改造页容器布局收口

### 修改内容
- 继续收口 `SelectionPanel` 中科技树页和机械改造页残留的旧式运行时排布逻辑，移除研究分类页签、研究卡片、机械分类页签、机械槽位、机械改造卡的逐项横坐标写入。
- 扩展 `ConfigurePcCatalogContentLayout(...)`，让 `ResearchCategoryTabsContent`、`ResearchGridContent`、`ResearchQueueContent`、`MechanicalCategoryTabsContent`、`MechanicalSlotsContent`、`MechanicalGridContent` 统一走内容容器横向布局。
- 更新 `UiPrefabWorkflowGenerator.CreateSelectionBuildingTechTreePagePrefab(...)`，补齐研究分类栏 viewport/content，并为研究列表和研究队列内容节点补上布局组件，防止后续重建 prefab 时回退到旧结构。
- 更新科技树页与机械改造页模块文档，明确“代码只负责数据、显隐、顺序和事件，容器位置/大小/间距优先由 prefab 维护”的规则。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Docs/UI/HUD建筑科技树页模块.md`
- `Docs/UI/机械族单位与建筑改造页面UI详细规则文档.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 内嵌科技树页的分类页签排版
- HUD 内嵌科技树页的研究卡横向列表排版
- HUD 内嵌机械改造页的分类栏、槽位栏、改造卡列表排版
- 研究页 prefab 生成链路与运行时布局职责边界

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "LayoutPcResearchCategoryTabs|LayoutPcResearchCatalog|RebuildPcMechanicalModSlots|LayoutPcMechanicalModCards|ConfigurePcCatalogContentLayout" Assets/Scripts/UI/SelectionPanel.cs`
- `rg -n "ResearchCategoryTabsViewport|ResearchCategoryTabsContent|ResearchGridContent|ResearchQueueContent" Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`

### 后续注意事项
- 下一轮应继续检查 `SelectionPanel` 中其它仍会覆盖 prefab 的老布局代码，优先处理研究详情页之外的剩余 HUD 模块。
- 如果需要正式把研究页本体 prefab 资源也重建落盘，应在 Unity 内执行对应 UI prefab 重建菜单，确认 `SelectionBuildingTechTreePage_Prefab` 实际写回了 `ResearchCategoryTabsViewport/ResearchCategoryTabsContent`。

## 2026-05-18 - 研究页 prefab 本体补实

### 修改内容
- 确认 Unity batch 重建未实际执行的根因是项目当前被其它 Unity 实例占用，batch 日志报错 `It looks like another Unity instance is running with this project open.`。
- 在 `SelectionBuildingTechTreePage_Prefab.prefab` 中直接补齐 `ResearchCategoryTabsViewport` 与 `ResearchCategoryTabsContent` 资源节点，避免研究分类栏继续依赖运行时兜底创建。
- 为 `ResearchCategoryTabsContent`、`ResearchGridContent`、`ResearchQueueContent` 直接补入内容容器布局组件，使研究页 prefab 本体与 `SelectionPanel` 的容器布局逻辑一致。
- 保持研究页布局职责边界一致：代码负责数据、显隐、顺序、点击；prefab 负责分类栏、研究卡列表、研究队列容器的位置、大小、间距和滚动区域结构。

### 修改文件
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingTechTreePage_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 内嵌科技树页研究分类栏
- HUD 内嵌科技树页研究卡横向容器
- HUD 内嵌科技树页当前研究队列容器
- 研究页 prefab 本体与运行时绑定的一致性

### 验证方式
- `rg -n "ResearchCategoryTabsViewport|ResearchCategoryTabsContent|m_HorizontalFit: 2|m_VerticalFit: 2" Assets/Resources/UI/Prefabs/Components/SelectionBuildingTechTreePage_Prefab.prefab`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 检查 `SelectionBuildingTechTreePage_Prefab.prefab` 的时间戳已更新为本次修改时间

### 后续注意事项
- 后续如果要继续用 Unity batch 重建 prefab，先确保项目没有被其它 Unity 实例占用，否则 batch 不会真正执行到资源保存。
- 研究页这块后续调布局优先直接改 `SelectionBuildingTechTreePage_Prefab.prefab` 的 viewport/content 和布局组件，不要再往 `SelectionPanel` 里补逐项坐标逻辑。

## 2026-05-18 - 建造页页面 prefab 本体补实与布局权回收

### 修改内容
- 按 `Docs/UI/建造页面UI预制体布局结构说明.md` 继续收口 HUD 内嵌建造页，把 `SelectionBuildingProductionPage_Prefab` 缺失的建造分类栏节点正式补回资源本体。
- 在 `SelectionBuildingProductionPage_Prefab.prefab` 中直接新增：
  - `BuildCategoryTabsViewport`
  - `BuildCategoryTabsContent`
- 为 `BuildCategoryTabsContent`、`ProductionGridContent`、`ProductionQueueContent` 直接补入横向容器布局组件，让分类栏、建造卡列表、队列列表的 spacing/padding/对齐方式回到 prefab 管理。
- 同步更新 `UiPrefabWorkflowGenerator.CreateSelectionBuildingProductionPagePrefab(...)`，防止后续重建 prefab 时又回退成没有分类栏的旧版本。
- 调整 `SelectionPanel.ConfigurePcCatalogContentLayout(...)`：
  - prefab 已声明保留布局时，不再覆写已有 `HorizontalLayoutGroup` 和 `ContentSizeFitter` 参数
  - 仅在内容节点缺少布局组件时补默认组件
- 修复 `BuildButton_Prefab.prefab` 的结构性错误：
  - `Label` 不再错误自嵌套
  - `FreeLabel` 重新挂回 `CostRow`

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/BuildButton_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 内嵌建造页的分类栏本体结构
- HUD 内嵌建造页的建造卡横向列表布局
- HUD 内嵌建造页的生产队列横向列表布局
- 建造卡 `BuildButton_Prefab` 的资源行模板结构稳定性
- prefab 与运行时代码的布局职责边界

### 验证方式
- `rg -n "BuildCategoryTabsViewport|BuildCategoryTabsContent|ProductionGridContent|ProductionQueueContent" Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `rg -n "m_Father: {fileID: 5949822356666289957}|FreeLabel|Label" Assets/Resources/UI/Prefabs/Components/BuildButton_Prefab.prefab`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 后续继续调建造页分类栏、建造卡列表、队列列表时，优先直接改 `SelectionBuildingProductionPage_Prefab.prefab` 的 viewport/content 和布局组件，不要再往 `SelectionPanel` 补新的 spacing、padding、sizeDelta 或 anchoredPosition。
- `BuildButton_Prefab.prefab` 后续如果继续扩展状态遮罩、推荐框、不可建造原因等，也应基于当前稳定层级继续加节点，不要再破坏 `Icon` / `Label` / `CostRow` / `CostSlotTemplate` / `FreeLabel` 这套固定绑定结构。

## 2026-05-18 - 建造页横向布局修正与建造卡状态层 prefab 化

### 修改内容
- 继续按 `Docs/UI/建造页面UI预制体布局结构说明.md` 与 `Docs/UI/单位选中后的建造页面UI详细规则文档.md` 收口 HUD 内嵌建造页。
- 修正 `SelectionBuildingProductionPage_Prefab.prefab` 中建造分类栏、建造列表、生产队列的布局关系，并补齐对应 `ScrollRect.viewport` 绑定。
- 将建造页可建造列表滚动方向改回横向，避免运行时仍按纵向列表显示。
- 为 `BuildButton_Prefab` 正式补入状态层节点：
  - `Image_RecommendGlow`
  - `State_Overlay`
  - `Image_DarkMask`
  - `Image_LockIcon`
  - `Image_WarningIcon`
  - `Text_StateReason`
  - `Image_SelectedBorder`
- 调整 `SelectionPanel`，让 HUD 建造/造兵/科技卡片优先使用 prefab 状态节点显隐和文案绑定，而不是只靠代码硬改底色。
- 调整 `BuildDevelopmentPanelUI`，让独立建造页与 HUD 建造页使用同一套建造卡状态层表达。
- 更新 `UiPrefabWorkflowGenerator` 中快速卡片按钮生成逻辑，避免后续重建 prefab 时回退到旧的小卡尺寸和缺失状态层的版本。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/BuildButton_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 中单位选中后的建造页面
- HUD 中建筑选中后的造兵/科技卡片状态表现
- 独立建造页中的建造卡状态表现
- 后续通过生成器重建 `BuildButton` / `BuildingProductionButton` / `ResearchButton` 类 prefab 的结果

### 验证方式
- `rg -n "Image_RecommendGlow|State_Overlay|Image_DarkMask|Image_LockIcon|Image_WarningIcon|Text_StateReason|Image_SelectedBorder" Assets/Resources/UI/Prefabs/Components/BuildButton_Prefab.prefab`
- `rg -n "m_Viewport: \{fileID: 6001000000000000002\}|m_Viewport: \{fileID: 4819038934587114982\}|m_Horizontal: 1|m_Vertical: 0" Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 本轮已把 HUD 建造页的列表方向、状态层和生成器三处对齐；下一轮建议直接在 Unity 中检查 `BuildButton_Prefab` 新增状态层的具体贴图、描边和图标资源。
- `BuildingProductionButton_Prefab`、`ResearchButton_Prefab` 目前脚本已可复用同类状态节点逻辑，但资源本体还未完全同步成与 `BuildButton_Prefab` 同级的完整状态结构，后续应继续补齐。
- 当前 `SelectionPanel` 已尽量减少对卡片样式的硬覆盖，但研究页、造兵页若还有旧的独立视觉字段，后续仍需逐模块继续清理。

## 2026-05-18 - 造兵卡与科技卡 prefab 本体补全

### 修改内容
- 将 `BuildingProductionButton_Prefab` 直接收口为与 `BuildButton_Prefab` 同级的大卡结构，修复旧 prefab 的脏层级问题，并补齐状态层节点：
  - `Image_RecommendGlow`
  - `State_Overlay`
  - `Image_DarkMask`
  - `Image_LockIcon`
  - `Image_WarningIcon`
  - `Text_StateReason`
  - `Image_SelectedBorder`
- 将 `ResearchButton_Prefab` 从旧小卡升级为大卡 prefab，统一卡片尺寸、图标区、名称区、费用区和状态遮罩结构。
- 为 `ResearchButton_Prefab` 正式补齐研究状态节点：
  - `StatusBadge`
  - `TimeLabel`
  - `ProgressBar`
  - `ProgressBar/Fill`
- 同步更新 `UiPrefabWorkflowGenerator.CreateGenericButtonPrefab(...)`，让后续重建 `ResearchButton` 时自动生成研究状态节点，不再回退到缺节点版本。

### 修改文件
- `Assets/Resources/UI/Prefabs/Components/BuildingProductionButton_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/ResearchButton_Prefab.prefab`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 内嵌造兵页快捷训练卡
- HUD 内嵌科技页研究卡
- 建筑造兵 / 科技页与 `SelectionPanel` 的 prefab 节点绑定一致性
- 后续通过 prefab 生成器重建按钮卡片时的输出结构稳定性

### 验证方式
- `rg -n "m_Name: BuildingProductionButton_Prefab|slotId: BuildingProductionButton|m_Name: Image_RecommendGlow|m_Name: State_Overlay|m_Name: Image_DarkMask|m_Name: Image_LockIcon|m_Name: Image_WarningIcon|m_Name: Text_StateReason|m_Name: Image_SelectedBorder|m_Name: ResearchButton_Prefab|slotId: ResearchButton|m_Name: StatusBadge|m_Name: TimeLabel|m_Name: ProgressBar|m_Name: Fill" Assets/Resources/UI/Prefabs/Components/BuildingProductionButton_Prefab.prefab Assets/Resources/UI/Prefabs/Components/ResearchButton_Prefab.prefab`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 研究卡当前已经具备状态角标、时间和进度条本体；后续继续调位置、字号、颜色时，优先直接改 `ResearchButton_Prefab`，不要再把这些静态布局写回脚本。
- 造兵卡和研究卡本轮已经与建造卡对齐成统一大卡结构；下一轮继续排查 HUD 里剩余仍在运行时覆写位置和尺寸的旧逻辑时，应优先围绕 `SelectionPanel` 和相关页面容器做收口。

## 2026-05-18 - HUD quick card 样式权继续回收

### 修改内容
- 继续收口 `SelectionPanel` 中 HUD 内嵌建造卡、造兵卡、研究卡的旧式样式覆盖逻辑。
- `PcQuickBuild_*`、`PcQuickTrain_*`、`PcQuickResearch_*` 三类按钮在 `CreateAutomationButton(...)`、`EnsureActionButtonIcon(...)`、`CreatePcCatalogButton(...)`、`LayoutPcCatalogButton(...)`、`ConfigurePcQuickOperationButton(...)` 这条链路上，不再被运行时代码强行覆写：
  - 字体
  - 文字对齐
  - 图标 tint
  - 图标 `preserveAspect`
  - 按钮描边
  - `ColorBlock` 默认配色
- 保留代码职责为：
  - 图标 sprite 绑定
  - 文案绑定
  - 费用数据绑定
  - 状态节点显隐
  - 研究进度刷新
  - 点击事件与详情卡绑定
- 更新 HUD 预制体规则文档和游戏内 UI 预制体化规范，明确这三类 quick card 的静态样式以后必须直接在 prefab 内调整。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/UI/游戏内UI预制体化规范.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 内嵌建造页快捷建造卡
- HUD 内嵌造兵页快捷训练卡
- HUD 内嵌科技页研究卡
- quick card prefab 与运行时样式职责边界

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "IsPcQuickCatalogButton|CreatePcCatalogButton|LayoutPcCatalogButton|ConfigurePcQuickOperationButton|EnsureActionButtonIcon" Assets/Scripts/UI/SelectionPanel.cs`

### 后续注意事项
- 下一轮继续排查 `SelectionPanel` 中仍会影响 quick card 视觉表现的旧逻辑时，优先检查状态刷新和大页窗口复用链，不要再把静态样式写回脚本。
- 如果 Unity 里继续出现“改 prefab 不生效”，优先检查当前运行时是否命中了 `PcQuickBuild_* / PcQuickTrain_* / PcQuickResearch_*` 之外的旧按钮入口，而不是先在代码里补新的样式覆盖。

## 2026-05-18 - 选择信息页屏幕自适应防越界

### 修改内容
- 修复点击单位或建筑后左下信息页可能超出屏幕的问题。
- 调整 `SelectionPanel.LayoutPcPanelRoot(...)`，让左右选择面板在写入显示位置前，统一先根据当前 Canvas 尺寸和安全边距做 clamp。
- 新增选择面板布局辅助方法：
  - `ResolveClampedPanelPosition(...)`
  - `ResolveCanvasRect(...)`
  - `ResolveSelectionPanelSafeInset(...)`
- 现在 `pcLeftPanelShownPosition` 和 `pcRightPanelShownPosition` 都使用 clamp 后的位置，进出场动画也跟着使用安全位置，不会再把左下信息页滑到屏幕外。
- 移动端额外参考 `Screen.safeArea` 的左/下安全区，避免异形屏或手势区把选择面板压出可见范围。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 左下单位/建筑信息页
- HUD 右侧动作页
- 选择面板的进出场动画目标位置
- 不同分辨率、不同画布尺寸、移动端安全区下的显示稳定性

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "ResolveClampedPanelPosition|ResolveCanvasRect|ResolveSelectionPanelSafeInset|LayoutPcPanelRoot" Assets/Scripts/UI/SelectionPanel.cs`

### 后续注意事项
- 这轮是“防越界”收口，不替代具体排版；后续如果左下信息页还需要更贴边或更紧凑，优先继续改 prefab 默认位置和尺寸。
- 如果别的 HUD 模块后续也出现分辨率变化后越界的问题，优先复用同类 clamp 思路，不要再单独写死某个分辨率坐标。

## 2026-05-18 - 独立造兵窗口宿主兼容与滚动容器绑定修复

### 修改内容
- 修复独立大造兵窗口在不同 prefab 宿主结构下的识别问题。
- `BuildingUnitProductionWindowUI` 现在兼容两种运行时宿主：
  - 完整窗口结构：`BuildingUnitProductionWindow -> ProductionPagePanel -> StandaloneUnitProductionPanel`
  - 裸 `UnitProductionPanel_Prefab` 结构：根节点直接作为造兵页本体
- 避免在已存在真实 prefab 结构时继续创建透明的 `StandaloneUnitProductionPanel` 占位节点。
- 收口 `UnitProductionPanel` 的 scroll/content 绑定逻辑：
  - 训练列表内容节点兼容 `UnitButtons` / `TrainContent`
  - 队列内容节点兼容 `QueueEntries` / `WaitingQueueContent` / `ProductionQueueContent`
  - 先复用 prefab 上已有的 viewport/content，再做最小兜底
- 对已声明 `preservePrefabLayout` 的滚动区和内容容器，不再由脚本强制覆写滚动方向、布局组件和静态尺寸。

### 修改文件
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击建筑后打开的独立造兵大窗口
- 大窗口内部训练列表与生产队列的 prefab 节点绑定
- `UnitButtons` / `QueueEntries` 缺失类报错的触发条件
- prefab 与运行时代码的布局职责边界

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 这轮主要先把错误宿主识别和旧式兜底绑定收住；如果 Unity 运行时仍然报某个具体节点缺失，应优先检查当前实际实例化的是哪份 prefab 资源，以及该资源是否真的缺 `ScrollRect` 组件或固定子节点。
- 后续继续优化独立造兵窗口布局时，优先直接改对应 prefab，不要再往 `UnitProductionPanel` 里补新的 `anchoredPosition`、`sizeDelta`、滚动方向或布局参数覆盖。



## 2026-05-18 - ??????????? prefab ?????

### ????
- ???? `UnitProductionPanel`????????????????????????? + ??????????????????
- ?? `UnitProductionPanel` ???????
  - `UnitScrollRect` ???? preserve ?????????
  - ???????????????????????? `verticalNormalizedPosition`
- ?? `ProductionQueueEntry_Prefab` ?????????
  - ???????? prefab ??? `RectTransform/LayoutElement` ??
  - ?? prefab ????????????????
  - ?????????????????????
- ?? `UnitProductionPanel.cs` ????????????????????????? UI ???

### ????
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Docs/UI/HUD???????.md`
- `Docs/UI/??????????UI??????.md`
- `Docs/05_TASK_LOG.md`

### ????
- ?

### ????
- ??????????????
- `UnitProductionPanel_Prefab` ??????????
- `ProductionQueueEntry_Prefab` ???????????????
- ???????????????

### ????
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### ??????
- ????????????????????????????????????????????????????????????? prefab?
- `UnitProductionPanel.cs` ?????????????????????????????????????????????????????????

## 2026-05-18 - 独立造兵窗口 prefab 样式权继续收口

### 修改内容
- 继续清理 `UnitProductionPanel` 里会覆盖独立造兵窗口 prefab 样式的旧逻辑。
- 移除分类页签 `Label` 的运行时 `best-fit / overflow` 强制写入，改回由 `ProductionCategoryTab_Prefab` 决定。
- 移除独立造兵卡 `Button.colors` 和卡片底色的无条件重写，避免运行时把 `UnitProductionCard_Prefab` 的按钮过渡样式刷回旧值。
- 移除队列条目 `ProgressFill.type / fillMethod / fillOrigin` 的无条件重写，改由 `ProductionQueueEntry_Prefab` 自己定义进度条结构。
- 新增样式层级保护：当节点或其父层级声明 `preservePrefabStyle` 时，`UnitProductionPanel` 不再重写文本颜色、底图颜色、描边颜色、角标底色等静态样式，只保留动态文本、sprite、fillAmount、交互和状态数据绑定。
- 保留未声明样式保留节点的状态兜底逻辑，避免旧 prefab 在未补全样式标记前完全失去可读性。

### 修改文件
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/UI/建筑选中后的造兵页面UI详细规则文档.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击建筑后打开的独立造兵大窗口
- `ProductionCategoryTab_Prefab`
- `UnitProductionCard_Prefab`
- `ProductionQueueEntry_Prefab`
- prefab 样式权与运行时状态刷新之间的职责边界

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "ShouldPreserveStyleHierarchy|RefreshCategoryTabStates|TryCreateProductionCardFromPrefab|TryCreateQueueEntryFromPrefab" Assets/Scripts/UI/UnitProductionPanel.cs`

### 后续注意事项
- 这轮收掉的是独立造兵窗口里最典型的样式覆盖点；后续继续排查时，优先看 `UnitProductionPanel` 是否还在改 prefab 的静态视觉，而不是先去 prefab 里重复调同一套参数。
- 旧的 fallback 生成路径还在，只用于防崩；真正需要可编辑的界面，仍然要把目标 prefab 节点补齐并挂好 `preservePrefabLayout / preservePrefabStyle`。

## 2026-05-18 - 科技树页面切回预制体主导布局

### 修改内容
- 重新梳理 `TechTreePanelUI` 的主流程，新增 `RebuildPrefabDrivenLayout()`，让科技页优先走 `TechTreeRoot_Prefab` 现有结构。
- 新增科技页 Header / Category / TechList 的 prefab 绑定逻辑：
  - Header 负责标题、建筑名、ResearchableToggle、ResetView
  - Category 负责横向分类按钮列表
  - TechList 负责横向科技卡列表
- 科技卡改为统一复用 `ResearchButton_Prefab`，并绑定：名称、图标、CostRow、状态角标、锁定/警告遮罩、选中框、进度条。
- 新增科技卡资源消耗模板克隆逻辑，保留 `CostSlotTemplate` 作为 prefab 内可编辑模板，不再整行销毁 prefab 结构。
- 新增本地辅助方法 `FindImageAny` / `FindTextAny` / `HasEnoughResources`，避免科技页继续依赖旧面板的局部实现。
- 保留旧 PC 科技画布相关方法作为兜底历史代码，但当前 `Rebuild()` 已不再走旧的大画布科技树主流程。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/UI/科技页面UI预制体布局结构说明.md`
- `Docs/UI/建筑选中后的科技树页面UI详细规则文档.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击科研建筑后弹出的科技树页面
- 科技分类栏与科技卡列表的 prefab 绑定方式
- `ResearchButton_Prefab` 的运行时数据填充职责边界
- 科技页后续继续做纯 prefab 调整时的维护方式

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前研究后端仍只有单研究位，没有真实等待队列与取消接口；本轮先把队列区的 prefab 结构和当前研究显示收住，后续如果要做等待队列，需要先扩 `ResearchQueue`。
- `TechTreePanelUI.cs` 里仍残留旧 PC 画布树相关方法，下一轮建议继续清理不可达旧路径，避免后续维护时混淆。
- 后续如继续调科技页位置、大小、背景、区块间距，优先改 `TechTreeRoot_Prefab` 与相关组件 prefab，不再往 `TechTreePanelUI` 回填新的 `anchoredPosition` 或 `sizeDelta`。
## 2026-05-18 - 科技树页面 prefab 绑定继续收口

### 修改内容
- 继续按科技页两份 UI 文档收口 `TechTreePanelUI`，重点修正科技卡 prefab 类型、滚动宿主绑定方式、研究队列区的 prefab 优先级。
- `TechNode_*` 运行时科技卡改为优先实例化 `ResearchButton_Prefab`，避免继续走旧 `TechNode` 结构导致卡片固定子节点不完整。
- `EnsureLinearScrollContent(...)` 调整为优先复用页面 prefab 内已有的 `TechScrollView / CategoryScrollView / WaitingResearchScrollView` 及其 `Viewport / Content`，减少代码直接改最外层页面布局。
- 科技卡状态绑定继续收口：名称、图标、CostRow、状态角标、锁定/警告遮罩、选中框、进度条继续走 `ResearchButton_Prefab` 固定子节点。
- 研究队列区新增 prefab 优先绑定逻辑：
  - 优先绑定 `QueueTitle / QueueStatus`
  - 优先绑定 `ResearchingSlot / CurrentResearch / CurrentResearchSlot`
  - 优先绑定 `EmptyLabel`
  - 等待队列内容区只清理 runtime 子项并保留结构，不再伪造等待研究条目
- 为避免这轮再次引入回退，暂时用条件编译隔离 `TechTreePanelUI` 中两段旧的不可达历史逻辑，先保证当前 prefab 主路径稳定编译。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/UI/科技页面UI预制体布局结构说明.md`
- `Docs/UI/建筑选中后的科技树页面UI详细规则文档.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击科研建筑后弹出的科技树页面
- 科技分类栏、科技卡列表、研究队列区的 prefab 绑定优先级
- `ResearchButton_Prefab` 在科技页中的实际运行时使用路径

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前 `ResearchQueue` 后端依旧只有单研究位，没有真实等待队列和取消研究接口；本轮只是先把页面结构与当前研究显示收回到 prefab 节点上。
- `TechTreePanelUI.cs` 里仍有历史 PC 大画布科技树方法，虽然当前主流程已不走它们，后续建议继续分轮清理。
- 下一轮如果你继续调科技页排版，应优先直接改 `TechTreeRoot_Prefab`、`ResearchButton_Prefab`、`TechBranchTab_Prefab`，不要再往脚本补 `anchoredPosition / sizeDelta` 一类静态布局值。

## 2026-05-18 - 科技页动态清理边界继续收紧

### 修改内容
- 继续排查科技页为何“补了 prefab 容器也会被运行时删掉”。
- 修正 `TechTreePanelUI` 中分类区与科技列表区的清理方式：
  - `BuildCategoryTabs(...)` 不再 `ClearRuntimeChildren(parent)`
  - 改为只清理 `CategoryContent` 内的动态子项
  - `BindResearchList(...)` 继续只清理 `TechContent` 内动态科技卡
- 明确科技页后续的 prefab 结构补齐方向：
  - `TechTabs / BranchNav_PC` 内允许固定存在 `CategoryScrollView / Viewport / CategoryContent`
  - `TechResearchListPage / TechResearchListPage_PC` 内允许固定存在 `TechScrollView / Viewport / TechContent`
  - 这些宿主节点应由 prefab 维护，不再被运行时整块销毁

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/UI/科技页面UI预制体布局结构说明.md`
- `Docs/UI/建筑选中后的科技树页面UI详细规则文档.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 科技树页面的分类栏与科技列表滚动容器
- 后续在 Unity 中直接编辑科技页容器位置、大小、留白时的生效边界

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 这轮先收紧了“不要误删 prefab 宿主节点”的代码边界；下一轮可继续直接补 `TechTreeRoot_Prefab` 内的 `CategoryScrollView / TechScrollView / ResearchingSlot` 等固定结构。
- `ResearchQueuePage / ResearchQueue_PC` 目前仍是大容器外壳，后续继续补固定子节点时，也要沿用“只清动态内容，不删宿主”的规则。

## 2026-05-18 - 科技页研究队列区接入现成组件 prefab 结构

### 修改内容
- 继续推进科技页研究队列区 prefab 化，优先复用项目里已经存在的 `SelectionBuildingTechTreePage_Prefab` 队列结构。
- `PopulateQueue(...)` 新增 `EnsureQueuePrefabNodes(...)`：
  - 当 `ResearchQueuePage / ResearchQueue_PC` 还是空壳时
  - 运行时优先从 `SelectionBuildingTechTreePage_Prefab` 克隆：
    - `ResearchQueueTitle`
    - `ResearchQueueViewport`
    - `ResearchQueueContent`
    - `CurrentResearch`
    - `EmptyLabel`
- 研究队列绑定进一步兼容现成组件 prefab 的命名：
  - 当前研究名称支持 `NameLabel`
  - 剩余时间支持 `RemainingLabel`
  - 当前研究根节点支持从 `ResearchQueueViewport/ResearchQueueContent/CurrentResearch` 查找
- 这样做后，科技页研究队列区内部结构开始回到 prefab 节点上，而不是继续纯代码拼标题、滚动区和当前研究槽位。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/UI/科技页面UI预制体布局结构说明.md`
- `Docs/UI/建筑选中后的科技树页面UI详细规则文档.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 科技树页面的研究队列区
- `SelectionBuildingTechTreePage_Prefab` 与 `TechTreeRoot_Prefab` 之间的结构复用关系
- 当前研究名称、剩余时间、进度条的绑定入口

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 这轮仍然是“优先复用现成组件 prefab 子结构”，还不是把这些节点永久直接写回 `TechTreeRoot_Prefab`；后续可以继续把这套固定节点真正补到 `ResearchQueuePage / ResearchQueue_PC` 里，最终减少运行时克隆。
- 当前 `ResearchQueue` 后端依旧没有真实等待队列和取消接口，所以 `CurrentResearch + EmptyLabel` 仍是这轮最稳定的交付边界。

## 2026-05-18 - 机械改造页头部入口与取消逻辑收口

### 修改内容
- 继续按新增的“机械改造页面UI预制体布局结构说明”收口 HUD 机械族改造页。
- `SelectionPanel` 机械改造页不再强制写死页面根节点位置和高度，页面根布局交回 `MechanicalModificationPage` prefab 本体。
- `SelectionPanel` 新增机械改造页头部绑定逻辑，优先写入：
  - `SelectedTargetLabel`
  - `ModifyCountLabel`
- 机械改造状态区文案收口为“目标名 / 改造次数 / 进度或待机摘要”，避免继续把页面静态文案和布局职责留在脚本里。
- `MechanicalModificationCard_Prefab` 继续回收为 prefab 主导结构：
  - 保留 `Title / Meta / Description / CostRow` 的数据绑定
  - 不再由脚本重写卡片内标题、图标、Meta 的位置尺寸
  - 不再给卡片额外强挂运行时描边作为静态视觉主结构
- `MechanicalModificationState` 新增取消改造接口，`MechanicalStatusPanel/CancelButton` 已接通：
  - 仅在当前存在进行中的改造时显示
  - 点击后停止改造、返还消耗、清空进度并刷新选择页
- `SelectionBuildingControlPage_Prefab` 的 `MechanicalModificationPage` 现在固定补齐：
  - `SelectedTargetLabel`
  - `ModifyCountLabel`
- 更新机械改造 UI 布局文档，明确上述节点和职责边界。

### 修改文件
- `Assets/Scripts/Core/MechanicalModificationState.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingControlPage_Prefab.prefab`
- `Docs/UI/机械改造页面UI预制体布局结构说明.md`
- `Docs/UI/机械族单位与建筑改造页面UI详细规则文档.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 中机械族单位 / 建筑的改造页面
- 机械改造页顶部“当前目标 / 改造次数”显示入口
- 机械改造状态区的取消按钮与取消改造流程
- 机械改造卡片的 prefab 样式权边界

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前机械改造页头部已经补齐固定文本节点；后续如果还要继续调头部排版、字号、留白，优先直接改 `SelectionBuildingControlPage_Prefab.prefab`。
- 机械改造卡片仍然可以继续补 richer 状态层（如锁定遮罩、互斥角标、高风险角标），但应先补 prefab 节点，再由脚本只做显隐和数据绑定。

## 2026-05-18 - 机械改造卡状态层 prefab 化继续收口

### 修改内容
- 继续按机械改造两份 UI 文档收口 HUD 机械改造页的卡片级 UI。
- `SelectionPanel` 为机械改造卡新增 prefab 节点绑定：
  - `Text_SlotType`
  - `Text_ModifyTime`
  - `State_Overlay`
  - `Image_DarkMask`
  - `Image_LockIcon`
  - `Image_WarningIcon`
  - `Image_MutexIcon`
  - `Image_InstalledIcon`
  - `Text_StateReason`
  - `Image_SelectedBorder`
  - `Image_RecommendGlow`
  - `Image_HighRiskMark`
- 机械改造卡现在会把“未解锁 / 资源不足 / 互斥 / 已安装 / 改造中 / 推荐 / 高风险”落到 prefab 节点显隐中。
- 新增槽位标签与改造时间文案绑定，后续可以直接在 prefab 里调整它们的位置、大小和样式。
- `MechanicalModificationCard_Prefab` 补齐状态层和信息区结构，避免后续再把这些可见内容写回代码布局。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Resources/UI/Prefabs/Components/MechanicalModificationCard_Prefab.prefab`
- `Docs/UI/机械改造页面UI预制体布局结构说明.md`
- `Docs/UI/机械族单位与建筑改造页面UI详细规则文档.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 中机械族单位 / 建筑的改造卡显示
- 机械改造卡的状态遮罩、角标、槽位标签、改造时间
- 机械改造卡 prefab 与运行时代码的职责边界

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 这轮已经把机械改造卡需要长期可编辑的节点补到 prefab；下一轮如果还要继续优化视觉，优先直接改 `MechanicalModificationCard_Prefab.prefab`。
- 由于 `dotnet build` 不会校验 prefab 显示结果，后续仍需要在 Unity 里重点检查状态层是否都能按预期显示，以及新节点是否被现有 prefab 流程正确实例化。

## 2026-05-18 - 机械改造卡静态样式继续交回 prefab

### 修改内容
- 继续收口机械改造卡中仍由脚本控制的静态视觉。
- `SelectionPanel` 移除机械改造卡以下运行时样式强写：
  - 卡片背景默认色
  - Title 的字号、字重、对齐、换行规则
  - Meta 的对齐与默认颜色
  - 阻塞态 CanvasGroup alpha 强制压暗
- 保留机械改造卡运行时代码职责为：
  - 标题 / 摘要 / Meta / 槽位类型 / 改造时间文案绑定
  - 图标 sprite 与必要状态 tint 兜底
  - 状态层节点显隐与状态文字绑定
- 修复 `MechanicalModificationCard_Prefab.prefab` 中 `Text_StateReason` 段落的 yaml 文本粘连问题，降低 prefab 资源损坏风险。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Resources/UI/Prefabs/Components/MechanicalModificationCard_Prefab.prefab`
- `Docs/UI/机械改造页面UI预制体布局结构说明.md`
- `Docs/UI/机械族单位与建筑改造页面UI详细规则文档.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 机械改造卡的标题、Meta、背景、状态遮罩职责边界
- 机械改造卡 prefab 后续在 Unity 中直接调整的生效一致性
- prefab 资源本身的稳定性

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前机械改造卡还有少量“图标 tint 状态兜底”仍在脚本里，这属于状态反馈，不属于静态布局；后续如要继续收口，可以在 prefab 内补更细的状态图层后再继续减代码。
- 下一轮更适合进入 Unity 运行态检查这张卡的真实显示效果，而不是继续盲补节点。

## 2026-05-18 - 机械改造卡主图标改为强依赖 prefab 节点

### 修改内容
- 继续清理机械改造卡残留的旧式运行时 UI 兜底。
- `SelectionPanel` 中机械改造卡主图标不再走 `EnsureStaticActionButtonIcon(...)` 的“缺了就创建”路径。
- 新增 `BindMechanicalModCardIcon(...)`，改为：
  - 强制复用 `MechanicalModificationCard_Prefab` 自带的 `Icon`
  - 运行时只绑定 sprite、显隐和必要状态 tint
  - 缺失 `Icon` 时直接报 prefab 结构错误
- 这样机械改造卡图标的最终位置、大小、层级和显示方式继续交回 prefab 本体管理。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/UI/机械改造页面UI预制体布局结构说明.md`
- `Docs/UI/机械族单位与建筑改造页面UI详细规则文档.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 机械改造卡主图标的绑定入口
- 机械改造卡图标 prefab 与运行时旧兜底逻辑的职责边界

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前 `EnsureStaticActionButtonIcon(...)` 仍可能服务于其他历史按钮路径，这轮只先把机械改造卡从这条旧链上拆下来。
- 下一轮如果继续清理旧入口，建议按按钮类型逐个拆，不要一次性全局替换，避免误伤别的 HUD 模块。
## 2026-05-19 - 建造页分类栏与建造卡状态层继续收口

### 修改内容
- 继续按“建造页面UI预制体布局结构说明”收口单位选中后的 HUD 建造页。
- `SelectionPanel` 新增 `HasAnyBuildInCategory(...)`，建造分类页签会按当前可建建筑决定是否可交互。
- 当当前选中分类在新目标上没有任何建造内容时，建造页会自动回退到 `All`，避免分类高亮与列表内容错位。
- `ProductionCategoryTab_Prefab` 直接补齐固定节点：
  - `Image_SelectedLine`
  - `Image_NewDot`
- `ApplyPcBuildCategoryTabStyle(...)` 继续收口为“prefab 控静态样式，代码控状态”：
  - 保留分类选中、空分类禁用、选中线显隐
  - 若页签声明 `preservePrefabStyle`，不再强制覆盖背景色、文字色、字重和选中线颜色
- `ConfigurePcCatalogStateVisual(...)` 继续收紧建造卡状态层样式覆盖边界：
  - 对 `State_Overlay`
  - `Image_DarkMask`
  - `Image_LockIcon`
  - `Image_WarningIcon`
  - `Text_StateReason`
  - `Image_SelectedBorder`
  - `Image_RecommendGlow`
  在 prefab 已声明样式保留时，代码只做显隐和文本绑定，不再强改静态色值。
- 新增建造分类栏补充文档，明确分类页签固定节点和运行时职责边界。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Resources/UI/Prefabs/Components/ProductionCategoryTab_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Docs/UI/建造页面UI预制体分类栏补充说明.md`

### 影响范围
- 单位选中后的 HUD 建造页分类栏
- `ProductionCategoryTab_Prefab`
- `BuildButton_Prefab` 的状态层样式权边界
- 切换不同 builder 时的建造分类可用性与默认选中分类

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "HasAnyBuildInCategory|Image_SelectedLine|Image_NewDot|ConfigurePcCatalogStateVisual" Assets/Scripts/UI/SelectionPanel.cs Assets/Resources/UI/Prefabs/Components/ProductionCategoryTab_Prefab.prefab`

### 后续注意事项
- `Image_NewDot` 这轮先只把 prefab 节点和运行时入口补齐，默认保持隐藏；后续如果要做“新解锁建筑”提示，需要先明确数据来源再接显示逻辑。
- 当前建造分类“无内容灰态”在 preserve style 路径下优先依赖 prefab 本体表现；后续若觉得灰态不明显，应优先改 `ProductionCategoryTab_Prefab`，不要再回到 `SelectionPanel` 里补新的静态配色硬写。
## 2026-05-19 - 造兵页预制体布局继续优化

### 修改内容
- 继续按 `Docs/UI/造兵页面UI预制体布局结构说明.md` 微调造兵页主预制体比例，让页面更接近“上队列、下横向造兵卡、右侧独立集结点按钮”的目标结构。
- 拉高 `SelectionBuildingProductionPage_Prefab` 根高度，并同步放宽造兵卡区与生产队列区的默认占位，让整体留白和层级更稳定。
- 调整 `ProductionQueueContent` 的“当前生产 / 等待队列”默认配比：
- `CurrentProduction` 更宽更高，当前生产项更稳更易读
- `WaitingQueueContent` 改为较轻的默认宽度，但保留横向扩展能力
- `EmptyLabel` 加宽，避免空队列提示在更宽队列区内显得过短
- 微调 `RallyPointFloatingButton` 的尺寸和位置，让它从内容区边缘再退开一点，形成更明确的右侧独立功能块。
- 同步放大 `BuildingProductionButton_Prefab` 与 `ProductionQueueEntry_Prefab` 的默认尺寸，让卡片和队列条目与新页面比例一致，避免主面板放松后内部条目仍显得偏小。

### 修改文件
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/BuildingProductionButton_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/ProductionQueueEntry_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击造兵建筑后出现的 HUD 内嵌造兵页默认布局
- 生产队列区的“当前生产 / 等待队列 / 空状态”占位比例
- 造兵卡默认尺寸、图标区和底部消耗区的视觉呼吸感
- 队列条目在当前生产槽和等待队列中的可读性
- 集结点按钮在造兵页右侧的视觉独立性

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 检查 prefab 关键节点名仍保持不变：`CurrentProduction`、`WaitingQueueContent`、`EmptyLabel`、`RallyPointFloatingButton`

### 后续注意事项
- 这轮仍然只动 prefab 默认布局，没有恢复任何旧运行时可见 fallback。
- 目前更适合进 Unity 运行态检查三种真实状态：空队列、单项生产、多项排队；如果还需要继续压缩或放宽比例，优先继续改 prefab，不要把静态位置重新写回脚本。

## 2026-05-19 - 造兵页预制体布局继续细修

### 修改内容
- 在上一轮基础上继续细修 `SelectionBuildingProductionPage_Prefab`，重点收口左侧内容列边界与“当前生产 / 等待队列”的主次关系。
- 继续拉开造兵卡区与队列区的左侧统一起点，让分类栏、卡片区、队列区看起来更像同一条内容列。
- 进一步提高 `CurrentProduction` 默认宽度，把当前生产槽做成更明确的主信息块。
- 对应收窄 `WaitingQueueContent` 默认宽度，保留弹性扩展，但让它在默认状态下更像紧凑等待队列而不是和主槽抢视觉权重。
- 再次微调 `ProductionQueueTitle` 与 `RallyPointFloatingButton` 的位置和尺寸，让队列标题、队列本体、右侧功能按钮的相互关系更顺。
- 小幅增加根面板高度，给队列区和右侧按钮补出更多呼吸感。

### 修改文件
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 造兵页左侧主体内容列的对齐感
- 当前生产槽与等待队列的默认视觉主次
- 集结点按钮在页面右侧的独立观感

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 这轮仍未改运行时脚本绑定逻辑，继续保持 prefab 主导布局。
- 如果下一轮继续优化，建议优先进入 Unity 运行态，直接观察“有 1 项当前生产 + 2~4 项等待队列”时的真实占位，而不是继续只看 prefab 文本参数。
## 2026-05-20 - 独立造兵页可创建士兵列表直接显示修复

### 修改内容
- 修复 `UnitProductionPanel` 中 `UnitButtons` / `QueueEntries` 这类横向滚动内容根节点被 `preservePrefabLayout` 阻断后，不再补齐运行时必需布局组件的问题。
- 新增 `RequiresHorizontalScrollContentLayout(...)` 检查：如果 prefab 内容根缺少 `HorizontalLayoutGroup`、`ContentSizeFitter` 或不是左上内容锚点，就按横向滚动内容规则补齐。
- `UnitButtons` 的运行时基准统一为左上锚点 / 左上 pivot，避免造兵卡创建成功后堆在错误坐标或被 viewport 裁掉，看起来像“列表没显示”。
- `QueueEntries` 同步套用同一修复，避免后续生产队列条目在旧 prefab 上继续出现同类布局问题。
- `UiPrefabWorkflowGenerator` 同步更新 `UnitProductionPanel_Prefab` 生成规则，新生成的 `UnitButtons` / `QueueEntries` 会直接带横向布局组与 `ContentSizeFitter`，不再依赖运行时补洞。
- 继续把同一结构正式落回 `UnitProductionPanel_Prefab.prefab` 资源本体：`UnitButtons`、`QueueEntries` 现在已经是左上内容锚点，并补齐 `HorizontalLayoutGroup` 与 `ContentSizeFitter`，避免旧资源继续表现异常。
- 修复顶部资源栏仍显示 prefab 占位值 `999` 的问题：`GameUI` 的公共资源 HUD 现在会优先复用 `ResourceHud_Prefab` 里的 `Icon` / `Value` 固定节点，把真实资源数值直接写进 prefab 文本，不再错误走 `SpecialResourceText` 临时文本链路。
- `ResourceHud_Prefab` 中 6 个资源槽的 `Value` 默认文本占位已从 `999` 收口为 `0`，避免绑定失效时再次把假数据暴露到界面上。

### 修改文件
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/InGame/UnitProductionPanel_Prefab.prefab`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Resources/UI/Prefabs/InGame/ResourceHud_Prefab.prefab`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 中独立造兵窗口 `UnitProductionPanel_Prefab` 的可训练单位横向列表显示。
- 独立造兵窗口底部生产队列的横向内容排布。
- 后续通过 `UiPrefabWorkflowGenerator` 重建 `UnitProductionPanel_Prefab` 时的动态内容根结构。
- 战斗 HUD 顶部公共资源栏的金币 / 木材 / 石材 / 铁矿实时显示。
- `TopStatusBar` 复用 `ResourceHud_Prefab` 时的 prefab 节点绑定优先级。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "RequiresHorizontalScrollContentLayout|ConfigureUnitButtonContainer|ConfigureQueueContainer|UnitButtons|QueueEntries" Assets/Scripts/UI/UnitProductionPanel.cs Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `rg -n "m_Name: (UnitButtons|QueueEntries)|m_AnchorMax: \\{x: 0, y: 1\\}|m_Pivot: \\{x: 0, y: 1\\}|guid: 30649d3a9faa99c48a7b1166b86bf2a0|guid: 3245ec927659c4140ac4f8d17403cc18" Assets/Resources/UI/Prefabs/InGame/UnitProductionPanel_Prefab.prefab`
- `rg -n "EnsureExistingOrRuntimeResourceHudIcon|EnsureExistingOrRuntimeFactionHudIcon|EnsureExistingOrRuntimeResourceHudValueText" Assets/Scripts/UI/GameUI.cs`
- `rg -n "m_Text: 999|m_Text: 0" Assets/Resources/UI/Prefabs/InGame/ResourceHud_Prefab.prefab`

### 后续注意事项
- 当前 `UnitProductionPanel_Prefab.prefab` 已经同步补齐内容根结构；后续如果 Unity 里继续调造兵卡尺寸、间距、padding，优先直接改这个 prefab，而不是再往脚本里塞静态布局值。
- 仍建议在 Unity 运行态重点核一次：可训练单位 0 个、1 个、多个，以及有队列 / 无队列时的横向内容宽度和滚动体验。
- 顶部资源栏这轮只修公共资源真实数值接入；如果后续发现阵营专属承载资源也显示了错误占位，应沿同样思路优先复用 prefab 固定节点，不要再分叉出第三套文本路径。

## 2026-05-21 - 独立造兵窗口面板绑定与横向列表刷新修复

### 修改内容
- 修复 `BuildingUnitProductionWindowUI` 对独立造兵页根节点的识别链路，改为优先按 `UnitProductionPanel` 组件递归查找，再兼容 `StandaloneUnitProductionPanel`、`UnitProductionPanel`、`UnitProductionPanel_Prefab` 命名，避免主 HUD 中嵌套 prefab 时把外层窗口壳误当成内容面板。
- `UnitProductionPanel` 在 `UnitButtons` 与 `QueueEntries` 绑定、造兵卡重建、生产队列重建后，都会强制刷新横向内容根、viewport 与 scroll root 的布局，减少“卡片已创建但内容宽度未更新、看起来像没显示”的情况。
- 这次修复重点覆盖用户要求核查的三类状态：造兵建筑打开后士兵卡直接横向显示、0/1/多个单位时滚动内容宽度更新、存在生产队列时 `QueueEntries` 按横向列表排开。

### 修改文件
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 中 `BuildingUnitProductionWindow -> ProductionPagePanel -> StandaloneUnitProductionPanel` 的独立造兵窗口绑定链。
- 独立造兵页的 `UnitButtons`、`QueueEntries` 横向内容根在运行时的尺寸刷新与滚动可见性。
- 主 HUD 内通过嵌套 prefab 承载 `UnitProductionPanel_Prefab` 时的组件识别稳定性。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "ResolveUnitProductionPanelRoot|RefreshHorizontalContentLayout" Assets\\Scripts\\UI\\BuildingUnitProductionWindowUI.cs Assets\\Scripts\\UI\\UnitProductionPanel.cs`

### 后续注意事项
- 本轮先修脚本绑定与布局刷新，未直接改 `MainHudRoot_Prefab` 或 `UnitProductionPanel_Prefab` 的资源结构。
- 下一步更适合在 Unity 运行态重点复核 0 个 / 1 个 / 多个可训练单位，以及 0 个 / 1 个 / 多个队列项时的真实显示效果；如果仍有空白，更可能是具体建筑的 `ProductionCatalogUtility.ResolveTrainableUnits(building)` 数据链而不是滚动布局本身。

## 2026-05-21 - 建造与造兵卡片详情 Tips 显示修复

### 修改内容
- 按 `Docs/UI` 中建造页、造兵页和通用操作详情卡规则，继续复用 `OperationDetailCard_Prefab` 作为建造/造兵卡片详情 Tips，不新增另一套详情 UI。
- `SelectionPanel` 新增统一的 `CreatePcQuickOperationDetailData(...)` / `ShowPcQuickOperationDetail(...)` / `FindPcQuickOperationSource(...)`，让建造、造兵、科技卡片的 hover、长按、点击不可用路径共用同一份详情数据。
- 修复造兵卡不可生产时只写动作提示、不打开单位详情 Tips 的问题；现在点击不可生产单位会固定打开对应单位详情卡，并在条件/限制区显示失败原因。
- 修复建造卡不可建造时直接返回、不显示建筑详情 Tips 的问题；现在点击不可建建筑会固定打开对应建筑详情卡，并同步写入动作提示。
- `OperationDetailCardTrigger` 增加左键点击不可执行卡片时固定打开详情卡的通用兜底，保证建造页、造兵页以及后续同类操作卡都符合“不可用点击打开 Tips”的规则。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/OperationDetailCardView.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 内嵌建造页的建筑卡片详情 Tips。
- 战斗 HUD 内嵌造兵页的单位卡片详情 Tips。
- 复用 `OperationDetailCardTrigger` 的不可执行操作卡左键点击行为。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "CreatePcQuickOperationDetailData|ShowPcQuickOperationDetail|FindPcQuickOperationSource|OperationDetailCardView\\.Show\\(data, transform as RectTransform, ownerRoot|!data\\.CanExecute" Assets/Scripts/UI/SelectionPanel.cs Assets/Scripts/UI/OperationDetailCardView.cs`

### 后续注意事项
- 这轮没有重做详情卡 prefab 结构；当前运行时库仍应指向 `Assets/Resources/UI/Prefabs/InGame/OperationDetailCard_Prefab.prefab`。
- 建议在 Unity 运行态复核三条交互：PC 悬停 0.25 秒显示、手机长按 0.35 秒显示、不可用卡左键点击后详情卡固定并可关闭。

## 2026-05-22 - 造兵队列显示与预建造确认按钮修复

### 修改内容
- 修复 `BuildDevelopmentPanelUI` 中预建造命令按钮的布局应用规则：`ConfirmPlacement`、`CancelPlacement`、`RotatePlacement`、`ChangeBuilding` 这类放置态命令按钮现在强制应用运行时传入的位置与尺寸，不再被通用按钮 prefab 的保留布局吞掉，避免只显示旋转按钮、确认和取消跑偏或重叠看不见。
- `SelectionPanel` 的生产队列刷新完成后，新增对 `CurrentProduction`、`WaitingQueueContent`、`WaitingQueueViewport`、`ProductionQueueContent`、`ProductionQueueViewport` 的强制布局重建，减少“队列条目已创建但横向区域没重新排版”的情况。
- `SelectionPanel` 的科技页当前研究槽刷新后，同步强制重建 `CurrentResearch`、`ResearchQueueContent`、`ResearchQueueViewport` 布局，并恢复当前研究取消按钮的可见与可点击状态。
- `SelectionPanel` 的当前研究取消按钮点击现在走回建筑详情刷新链，避免按钮一直隐藏导致科技页队列区看起来像没接上。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 预建造状态下的确认 / 取消 / 旋转 / 更换建筑按钮显隐与位置。
- `SelectionPanel` 内嵌造兵页的当前生产与等待队列显示。
- `SelectionPanel` 内嵌科技页的当前研究队列槽显示与取消按钮交互。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "forceRuntimeLayout|RefreshPcQueueLayout|HandlePcCurrentResearchCancelClicked|pcResearchCancelButton\\.gameObject\\.SetActive\\(true\\)" Assets/Scripts/UI/BuildDevelopmentPanelUI.cs Assets/Scripts/UI/SelectionPanel.cs`

### 后续注意事项
- 当前 `ResearchQueue` 后端仍只有“当前研究”这一项，没有真正的等待研究列表数据结构；这轮修的是科技页队列槽显示与取消交互，不是新增多项研究排队系统。
- 下一轮适合在 Unity 运行态分别核：造兵页 1 项当前生产 + 2~4 项等待队列，科技页当前研究槽与取消按钮，以及预建造状态下确认 / 取消 / 旋转三个按钮是否都稳定出现在中心虚影周围。

## 2026-05-22 - 独立造兵页与科技页 Prefab 队列显示继续收口

### 修改内容
- 继续按 `Docs/UI` 的 prefab 结构修正独立造兵页与科技页，不再依赖旧的运行时隐藏/兜底行为。
- `UnitProductionPanel` 补强 `UnitScrollRect`、`QueueScrollRect` 的 `Viewport` / `Content` 识别链：即使 prefab 的 `ScrollRect.viewport` 没直接手工回填，也会优先绑定真实的 `Viewport` 子节点，再定位 `UnitButtons`、`TrainContent`、`QueueEntries`、`WaitingQueueContent`、`ProductionQueueContent`，减少“有 prefab 节点但列表空白”的情况。
- `UnitProductionPanel` 现在会对横向滚动容器使用更稳的 viewport 解析逻辑，确保可造单位卡列表和队列条目实例化后能落到正确的 prefab 容器内并立即重建布局。
- `ResearchManager` 新增取消当前研究的 active 标记接口，`ResearchQueue` 新增 `CancelCurrentResearch(...)`：取消当前研究时会清空当前研究状态、移除 `ResearchManager` 中的进行中标记，并按当前建筑实际研究成本规则退款。
- `TechTreePanelUI` 恢复当前研究取消按钮的 prefab 驱动绑定，不再进入后直接隐藏；按钮点击现在会真正取消当前研究并重建科技页队列区。
- `TechTreePanelUI` 对当前研究槽补充强制布局刷新，减少“当前研究信息已写入但 prefab 区域没更新显示”的情况。

### 修改文件
- `Assets/Scripts/Technology/ResearchManager.cs`
- `Assets/Scripts/Technology/ResearchQueue.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 独立 `UnitProductionPanel_Prefab` 的可造单位横向列表、生产队列横向列表及其 viewport/content 绑定稳定性。
- 独立 `TechTreePanel_Prefab` 的当前研究槽、取消按钮和队列区显示。
- 当前研究取消后的资源退款与进行中研究标记清理。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "CancelCurrentResearch|CancelResearch\\(|HandleCancelCurrentResearchClicked|ResolveScrollViewport\\(" Assets\\Scripts\\Technology\\ResearchManager.cs Assets\\Scripts\\Technology\\ResearchQueue.cs Assets\\Scripts\\UI\\TechTreePanelUI.cs Assets\\Scripts\\UI\\UnitProductionPanel.cs`

### 后续注意事项
- 当前科技系统仍然只有“单项当前研究”，没有真正的等待研究列表；这轮把 prefab 队列区做到了“当前研究可见、可取消、状态真实”，没有伪造多项等待研究。
- 如果 Unity 运行态里造兵页单位卡仍为空，下一优先级要看具体建筑的 `ProductionQueue.TrainableUnits` / `ProductionCatalogUtility` 数据链，而不是继续先怀疑滚动布局。
- 预建造确认/取消/旋转按钮、独立造兵页、独立科技页现在都已经有代码侧 prefab 绑定修正，下一轮更适合进 Unity 真机/编辑器分别点建筑做联调，而不是继续只看静态代码。

## 2026-05-22 - CombatAlertFeed 与 MobileSkillCancel 空状态显隐修复

### 修改内容
- 检查 `CombatAlertFeed` 常驻显示问题后，确认不是事件报错，而是 HUD 右侧宿主 prefab 默认可见、空列表时缺少自动隐藏逻辑。
- `BattleAlertUI` 现在在创建 `CombatAlertFeed` 时会把 feed 根 `CanvasGroup` 初始化为隐藏，并在没有任何 feed 条目时自动淡出并隐藏宿主；有新战斗提示时再恢复显示。
- `BattleAlertUI` 的 `PushCombatFeed(...)` 会在真正写入战斗提示条目前主动唤醒 feed 根，避免出现“空面板一直挂着”。
- 检查 `MobileSkillCancel` 常驻显示问题后，确认当前 `GameUI.RefreshMobileSkillCancelArea()` 被一段“先销毁再 return”的旧短路逻辑拦住，导致 prefab 默认可见状态没有被运行时状态逻辑接管。
- 移除该短路逻辑后，`MobileSkillCancel` 重新按真实条件刷新：只有移动端 HUD、生效的技能瞄准状态、且移动控制条可见时才显示；否则会隐藏并同步清空 `InputHandler` 中的取消区域。
- `EnsureMobileSkillCancelArea()` 现在在初次绑定 prefab 后会先把节点设为隐藏，避免未进入技能瞄准态时 prefab 默认状态直接漏出来。
- HUD 整体隐藏时，`UpdateInGameHudVisibility()` 也会顺带立即压掉 `MobileSkillCancel` 并清空取消拖拽区域，减少状态切换闪现。

### 修改文件
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- `MainHudRoot_Prefab/RightLayer_MinimapAndAlerts/CombatAlertFeed` 的空状态显示行为。
- `MainHudRoot_Prefab/MobileLayer_TouchControls/MobileSkillCancel` 的默认显隐与技能瞄准取消区域上报。
- 战斗 HUD 切换显隐时这两个模块的初始化与收尾状态。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "CreateAlertFeedPanel|UpdateCombatFeed|PushCombatFeed|EnsureMobileSkillCancelArea|RefreshMobileSkillCancelArea" Assets\\Scripts\\UI\\BattleAlertUI.cs Assets\\Scripts\\UI\\GameUI.cs`

### 后续注意事项
- `CombatAlertFeed` 现在会在无条目时自动隐藏；如果运行态仍然看到空壳，下一步应重点检查 `MainHudRoot_Prefab` 中该嵌套实例是否还有额外的可见底板或重复宿主。
- `MobileSkillCancel` 当前已恢复运行时状态控制；如果运行态仍会无条件显示，更可能是 `SkillTargetPreview_Prefab` 本体里还带有默认可见子节点或另一个脚本也在改它的 `CanvasGroup` / `SetActive`。

## 2026-05-22 - CombatAlertFeed 与 MobileSkillCancel 初始化即关闭修正

### 修改内容
- 继续排查后确认，这两个模块不只是“空状态时应隐藏”，而是“HUD 初始化完成后就应先关闭，等真实状态触发再打开”。
- `BattleAlertUI.CreateAlertFeedPanel()` 改为优先接管 `MainHudRoot_Prefab/RightLayer_MinimapAndAlerts/CombatAlertFeed` 这一份真实 HUD 宿主，而不是只在 `BattleAlertCanvas` 根下查找，这样空状态隐藏和后续唤醒会直接作用到玩家实际看到的右侧战斗提示区域。
- `GameUI.RefreshMobileUnitControlBar()` 现在会先调用 `EnsureMobileSkillCancelArea()`，确保 `MobileSkillCancel` 真正被运行时脚本接管后，再按技能瞄准状态刷新显隐。
- `GameUI.EnsureMainHudPrefabSlots()` 在主 HUD prefab 接入完成后，会立即对 `CombatAlertFeed`、`MobileSkillCancel`、`MobileSkillCancelArea` 执行一次宿主级隐藏，避免 prefab 默认可见状态在第一帧直接漏出来。

### 修改文件
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主 HUD 右侧 `CombatAlertFeed` 的初始化宿主绑定与首帧显隐。
- 主 HUD 移动端 `MobileSkillCancel` 的首次绑定、首帧隐藏与后续状态接管。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "CreateAlertFeedPanel|EnsureMobileSkillCancelArea\\(|RefreshMobileUnitControlBar\\(|HideHudModuleHost\\(\"CombatAlertFeed\"|HideHudModuleHost\\(\"MobileSkillCancel\"" Assets\\Scripts\\UI\\BattleAlertUI.cs Assets\\Scripts\\UI\\GameUI.cs`

### 后续注意事项
- 如果这轮之后运行态还会在开局看到它们，优先怀疑 prefab 资源本体上仍带有可见默认底板或某个 `playShowOnEnable` / 动画在首帧把它重新打开，而不是继续怀疑这两处脚本的基本显隐条件。

## 2026-05-22 - 建造页 PC 与移动端显示分叉收口

### 修改内容
- `BuildDevelopmentPanelUI` 不再把建造浏览区当作 `BuildCommandBar_PC` / `BuildDetailPanel_PC` 这类 PC 专用可见面板处理，统一改为 `BuildCommandBar`、`BuildingGrid`、`BuildDetailPanel` 三个共享节点名。
- 建造页详情渲染不再区分一套移动端 `PopulateMobileRightDetails(...)` 和一套桌面端详情逻辑，现统一走同一个 `PopulateDetails(...) -> PopulateCompactDetails(...)` 显示规则。
- `BuildDevelopmentPanelUI.CreatePanel(...)` 新增对旧 prefab 名称的兼容查找，会优先找统一命名节点，必要时回退复用历史 `*_PC` 节点，避免运行时重复生成两套可见宿主。
- `UiPrefabWorkflowGenerator` 的 `BuildDevelopmentRoot_Prefab` 生成规则同步改为输出统一命名节点，防止后续重建 prefab 时再次产出 `*_PC` 可见层。
- 运行时 prefab 本体 `BuildDevelopmentRoot_Prefab` 中对应节点与 `slotId` 也已同步改名，和新的共享命名规则保持一致。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Pages/BuildDevelopmentRoot_Prefab.prefab`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 中 `BuildDevelopmentRoot` 的建造浏览条、建造卡列表、建造详情区在 PC 与移动端的宿主命名和显示规则。
- 后续通过生成器重建 `BuildDevelopmentRoot_Prefab` 时的节点结构稳定性。
- 移动端点击建造时误看到 `BuildCommandBar_PC`、`BuildDetailPanel_PC` 这类 PC 分叉界面的情况。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "BuildCommandBar_PC|BuildDetailPanel_PC|BuildingGrid_PC|BuildCommandBar|BuildDetailPanel|BuildingGrid" Assets\\Scripts\\UI\\BuildDevelopmentPanelUI.cs Assets\\Scripts\\Editor\\UiPrefabWorkflowGenerator.cs Assets\\Resources\\UI\\Prefabs\\Pages\\BuildDevelopmentRoot_Prefab.prefab`

### 后续注意事项
- 这轮先把建造页的 PC/mobile 可见分叉收口到一套共享宿主与共享详情规则；如果后面还要继续优化手机端尺寸或停靠位置，应只改 prefab 布局和少量响应式参数，不要再恢复独立的移动端可见页面分支。

## 2026-05-22 - CombatAlertFeed 空壳与 CombatFeedEntry 结构收口

### 修改内容
- 排查确认 `CombatAlertFeed` 持续可见不只是显隐条件问题，还包含 prefab 本体结构问题：`CombatAlertFeedPanel_Prefab` 默认就是可见可射线的卡片壳，`CombatFeedEntry_Prefab` 也带着与脚本不匹配的大卡片占位子节点。
- `BattleAlertUI.CreateAlertFeedPanel()` 现在在绑定 `CombatAlertFeed` 宿主后，会主动关闭 feed 根里不属于动态条目的历史占位子节点，并递归关闭整棵 feed 子树的 `raycastTarget`。
- `BattleAlertUI.CreateCombatFeedEntry()` 新增 entry 预处理：优先把旧 `Title` 文本节点收编为 `Label`，隐藏其余不该显示的 `Icon`、`Meta`、`Description` 等占位子节点，并确保 entry 根 `CanvasGroup` 不接收交互。
- `CombatAlertFeedPanel_Prefab` 与 `CombatFeedEntry_Prefab` 的默认 `CanvasGroup` 改为 `alpha=0 / interactable=0 / blocksRaycasts=0`，同时将 prefab 中残留的 `raycastTarget=1` 默认值收紧为 `0`，避免脚本尚未接管的首帧先显示空壳。

### 修改文件
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Assets/Resources/UI/Prefabs/Components/CombatAlertFeedPanel_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/CombatFeedEntry_Prefab.prefab`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主 HUD `RightLayer_MinimapAndAlerts/CombatAlertFeed` 的空状态可见性与射线行为。
- `CombatFeedEntry` 动态条目生成后的可见子节点集合、点击穿透和横向/纵向紧凑布局表现。
- 战斗提示链在无消息、有消息、消息过期后自动隐藏这三个阶段的视觉稳定性。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "HideUnusedCombatFeedRootChildren|PrepareCombatFeedEntryRect|DisableGraphicRaycastRecursive|CombatAlertFeedPanel|CombatFeedEntry" Assets\\Scripts\\UI\\BattleAlertUI.cs Assets\\Resources\\UI\\Prefabs\\Components\\CombatAlertFeedPanel_Prefab.prefab Assets\\Resources\\UI\\Prefabs\\Components\\CombatFeedEntry_Prefab.prefab`

### 后续注意事项
- 这轮先把 `CombatAlertFeed` 收成“空时绝不显示”的安全形态，但 `CombatFeedEntry_Prefab` 仍然是从历史大卡片资源兼容裁剪出来的；后续如果要继续打磨视觉，建议在 Unity 里把它直接重做成脚本当前使用的紧凑条目结构，而不是继续背着旧占位层级。

## 2026-05-22 - 头顶血条 HUD 重复与掉血表现修复

### 修改内容
- 修复部分建筑头顶出现双重血条 HUD 的问题：`UnitOverheadUI` 不再只删除两个固定旧节点名，而是会在 owner 层级内清理整类历史头顶 HUD / 世界空间血条残留对象，避免旧 `UnitOverheadCanvas`、`BuildingProductionStatusCanvas`、`UnitOverheadHud` 等与当前 `WorldHudManager` 同时显示。
- 修复 `WorldHudManager` 中 `WorldHudItem` 的血条层级顺序，明确为 `HpBar` 背景在后、`HpDelayFill` 在主血条后、`HpFill` 在最前、`HpBarFrame` 在最上，恢复并强化掉血延迟条可见性。
- 调整建筑/状态行的视觉边界，避免 `StatusRow` 在建造中、升级中、生产中看起来像第二根生命条；同时将运行时状态行默认尺寸与背景样式细化，降低与主血条的混淆。
- 同步更新 `UiPrefabWorkflowGenerator` 的 `WorldHudItem_Prefab` 生成规则，保证后续重建 prefab 时继续保持新的状态行尺寸与布局，不会回退到旧样式。

### 修改文件
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位与建筑头顶 HUD 的唯一显示链路：`UnitOverheadUI -> WorldHudManager -> WorldHudItem_Prefab`
- 建筑建造/升级/生产状态在头顶 HUD 中的状态行表现
- 头顶生命条主血条、延迟掉血条、边框的运行时层级与可见性
- 后续通过 `UiPrefabWorkflowGenerator` 重建 `WorldHudItem_Prefab` 的默认结果

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：建筑是否还会同时出现旧头顶条与新 `WorldHudItem`；建筑建造中/生产中状态条是否不再像第二根生命条；受击后 `HpDelayFill` 是否明显滞后回落

### 后续注意事项
- 当前旧头顶 HUD 资源 `Assets/Resources/UI/Prefabs/InGame/UnitOverheadHud_Prefab.prefab` 仍留作历史资源，但战斗运行态不应再把它作为可见 HUD 使用；如果后续确认完全无引用，可再做资源级清理。
- 如果 Unity 资源本体里仍存在个别建筑 prefab 带有非标准命名的历史世界空间血条对象，下一轮应直接清理具体 prefab，而不要重新加回新的运行时 fallback。

## 2026-05-22 - 华夏步兵营双 WorldHudItem 根因收口

### 修改内容
- 继续排查华夏步兵营出现两个 `WorldHudItem`，其中一个 `NameText` 为正常“步兵营”，另一个为 `Barracks(Clone)` 的问题。
- 确认根因方向是“建筑运行时视觉子树被当成了第二个建筑 owner”：`BaseBuilding` 自身会在 `OnEnable()` 自动注册到 `BuildingManager`，只要视觉实例里残留 `BaseBuilding` / `UnitOverheadUI` / `BuildingProductionStatusUI`，就会被额外挂第二套头顶 HUD。
- 在 `ContentCatalogManager.StripBuildingVisualOnlyRuntimeConflicts(...)` 中新增对 `UnitOverheadUI` 和 `BuildingProductionStatusUI` 的清理，与原本的 `BaseBuilding` 清理一起收口，防止运行时组合建筑 prefab 或视觉替换时把可注册 gameplay 组件留在视觉子树里。
- 在 `BuildingVisualProgressionController` 的视觉实例化链路中新增 `StripVisualRuntimeGameplayConflicts(...)`，对每次 `Instantiate` 出来的 `VisualPrefab` 子树再次剥离 `BaseBuilding`、`UnitOverheadUI`、`BuildingProductionStatusUI`，避免某个错误配置的 `VisualPrefab` 直接把完整 `Barracks.prefab` 或其他 gameplay 物体塞进 `VisualRoot` 后再次注册。

### 修改文件
- `Assets/Scripts/Core/ContentCatalogManager.cs`
- `Assets/Scripts/Buildings/BuildingVisualProgressionController.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑运行时组合 prefab、视觉覆盖 prefab、Building Visual Progression 等所有“把视觉子树实例化到建筑根下”的链路。
- 建筑视觉子物体错误携带 `BaseBuilding` / `UnitOverheadUI` / `BuildingProductionStatusUI` 时造成的重复注册、重复 `WorldHudItem`、名称回退到 `xxx(Clone)` 的问题。
- 华夏步兵营以及其他可能复用同类错误视觉 prefab 的建筑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：华夏步兵营是否仍出现第二个 `Barracks(Clone)` 头顶 HUD；切换建筑等级或重进场景后，`VisualRoot` 下实例化的视觉对象是否不再带可注册 gameplay 组件。

### 后续注意事项
- 本轮优先从运行时逻辑上做硬防护，避免同类错误 visual prefab 继续污染战斗 HUD；后续有空仍建议在 Unity 里核查华夏步兵营对应的 `BuildingVisualProgressionData` / `VisualPrefab` 配置，确认没有把完整建筑 prefab 当作纯视觉 prefab 使用。

## 2026-05-22 - 战斗 HUD 运行时卡顿首轮收口

### 修改内容
- 排查战斗内点击单位响应慢、UI 拖动卡顿的问题，确认主因之一是 `SelectionPanel.Update()` 在存在选中上下文时每帧刷新技能栏、Buff 栏、自动化栏、快捷操作按钮状态与详情按钮文案，导致输入和 UI 拖动与重 UI 刷新竞争主线程。
- 将 `SelectionPanel` 的运行时 HUD 刷新改为“轻量每帧 + 脏标记即时触发 + 限频重算”的模式：保留动画、提示生命周期、热键处理与编队栏显示，但把技能栏 / Buff 栏 / 自动化栏 / PC 快捷操作状态从每帧强刷改为按脏标记和短间隔刷新。
- 在选中对象切换、检查对象切换、`BindUnit` / `BindBuilding` / `BindSkillController` 切换以及技能列表变化时主动标记运行时 HUD 脏状态，确保不会因为限频刷新导致面板内容“慢一拍”。
- 对 `WorldHudManager` 增加普通单位 overhead 内容的低频刷新策略：选中、重要、英雄、Boss、建筑、警报对象继续保持高频；普通单位的名称/状态内容刷新降频，减少全场单位较多时 `WorldHudItem` 文本和状态行反复重算造成的主线程压力。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 选中单位 / 建筑后的选择面板实时刷新链路。
- 技能栏、Buff 栏、自动化按钮、快捷操作按钮状态在战斗内的运行时更新频率。
- 场上大量普通单位存在时 `WorldHudManager` 的 overhead 内容刷新负载。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：点击单位或建筑后信息面板是否仍能及时更新；拖动 HUD / 滚动 UI 时是否比之前顺滑；大量单位同屏时普通单位头顶 HUD 是否仍正常显示且不再持续拖慢输入。

### 后续注意事项
- 这轮先收掉了最明显的“每帧重 UI 刷新”热点，但 `SelectionPanel` 里仍有队列重建、cost row 重建、布局强刷等较重方法；如果现场仍有卡顿，下一轮应继续把生产队列 / 科技队列 / 快捷按钮 cost row 收成真正的事件驱动更新。
- `UnitManager` 目前仍会给满足条件的单位统一挂 `UnitOverheadUI`，如果后续实机压测下仍存在大量单位场景掉帧，需要继续评估普通单位 overhead 的注册范围，而不是只调刷新频率。

## 2026-05-22 - 造兵页当前制造与等待队列刷新链修复

### 修改内容
- 继续排查“造兵页面的正在制造和后续制造列表没有正常显示”，确认 `SelectionPanel` 的生产队列 UI 并不是宿主节点缺失，而是运行时没有正式订阅 `ProductionQueue` / `ResearchQueue` 的变化事件。
- 在 `SelectionPanel` 中新增对当前绑定建筑的 `ProductionQueue` 与 `ResearchQueue` 事件绑定/解绑逻辑；当队列变化、开始生产、生产进度变化、开始研究、研究进度变化、研究完成时，面板会立即刷新对应的生产队列或研究队列区域。
- 在切换 `boundBuilding`、关闭面板、点击造兵按钮、点击研究按钮、点击当前研究取消按钮后，补充运行时队列重绑与即时刷新，避免第一次动态添加 `ProductionQueue` / `ResearchQueue` 组件后 UI 仍停留在旧状态。
- 静态核对 `SelectionBuildingProductionPage_Prefab` 与 `ProductionQueueEntry_Prefab`，确认 `CurrentProduction`、`WaitingQueueViewport`、`WaitingQueueContent`、`ProgressLabel`、`CancelButton` 等关键节点命名与脚本一致，本轮不需要改 prefab 结构。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑造兵页的“当前制造”与“等待制造队列”显示刷新链路。
- 科技树页的当前研究刷新链路。
- 首次点击造兵 / 研究后动态挂载 `ProductionQueue` / `ResearchQueue` 组件的建筑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：点击造兵建筑后，加入第一个单位时 `CurrentProduction` 是否立刻显示；加入第二个及以上单位时 `WaitingQueueContent` 是否立刻出现横向队列；生产进度推进、取消等待项、完成当前项切到下一项时队列 UI 是否同步变化。

### 后续注意事项
- 当前 `SelectionPanel` 的生产 / 研究队列刷新仍采用“事件触发后整体重绘当前区域”的策略，功能上已经比之前稳定，但如果后续要继续做性能收口，可以再把等待队列项改成对象池复用而不是每次重建。

## 2026-05-23 - MobileActionBar 分组标题清理

### 修改内容
- 清理手机端 `MobileActionBar` 中不需要显示的分组标题。
- 在 `GameUI` 的 `CreateMobileActionGroup(...)` 与 `RefreshMobileActionGroupVisibility()` 中加入分组标题可见性规则，让 `BuildingGroup` 和 `DevelopmentGroup` 的 `Title` 始终隐藏，避免 prefab 默认可见或运行时刷新后再次出现。
- 保留 `MobileActionBar` 的分组根结构、按钮分组逻辑和布局刷新链路，只调整标题显示，不改按钮或宿主层级。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 手机端 `MobileActionBar` 下 `BuildingGroup` 与 `DevelopmentGroup` 的标题显示。
- `MobileActionBar` 运行时分组刷新后标题是否会被重新打开。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：手机端打开 `MobileActionBar` 时，`BuildingGroup` 和 `DevelopmentGroup` 仍保留按钮分组，但不再显示 `Title` 文本；切换选中建筑、刷新动作条后标题也不会重新出现。

### 后续注意事项
- 这次只隐藏了两个指定 group 的标题；如果后续希望 `MobileActionBar` 统一做成“所有 group 都无标题”的风格，可以再把 `Command` / `System` 一并收掉，但那会影响更广的移动端识别节奏，建议单独评估。

## 2026-05-23 - 战斗内操控设置面板交互修复

### 修改内容
- 修复战斗内 `InGameSettingsUI` 在 HUD 预制体接管模式下“按钮和功能都无效”的问题，确认主因是设置根层在隐藏状态下仍沿用同一套 prefab 容器，反复 `Rebuild()` 时会留下不可交互的宿主状态，导致再次打开后按钮、页签和滑条可见但不响应。
- 调整 `InGameSettingsUI.Rebuild()` 的显示规则：当战斗 HUD 已提供独立的 `InGameSettingsButton` 入口时，`InGameSettingsRoot` 在未真正打开页面前保持关闭，不再作为常驻透明整层留在 HUD 上；打开暂停/设置/存档页时再显式启用，并提升到 HUD 叠层最前，避免被同层旧模块覆盖或吃掉点击。
- 为设置面板运行时复用的 prefab 节点补上统一交互恢复：`Panel(...)`、`Button(...)`、`SliderControl(...)` 每次复用时都会重置 `CanvasGroup`、`Graphic.raycastTarget`、`Button.interactable`、`Slider.interactable` 等状态，确保页签、应用、默认、返回、保存关闭和各设置项本轮实例都能正常接收事件。
- 保留现有 prefab-first 结构，不改资源路径和节点命名，只修运行时显隐与交互状态管理。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗内暂停菜单、操控设置页、存档管理页的按钮点击与滑条交互。
- HUD 预制体模式下 `InGameSettingsRoot` 的显隐、层级和射线拦截行为。
- 设置保存后 `UserInputSettingsStore` / `ControlSchemeManager` 的立即生效链路。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：点击右上角设置按钮后暂停页能正常打开；`Control Settings` 能切页；页签、开关、滑条、`Apply`、`Default`、`Back`、`Save & Close` 能响应；保存后再次打开仍能看到已保存值。

### 后续注意事项
- 这轮先把“可见但不可点”的交互根因收掉；如果后续还发现个别设置项虽然能点击但没有驱动具体系统，需要继续按项核对这些设置是否已经被对应的运行时模块真正消费。

## 2026-05-23 - 战斗内设置页移动端放大与版式优化

### 修改内容
- 继续优化 `InGameSettingsUI` 的手机端可用性，解决“页面和按钮都太小，手机上看不到”的问题。
- 为战斗内暂停页、设置页、存档页增加明确的移动端布局分支：面板在手机端改为更接近全屏的大面板，顶部标题、副标题、页签列、滚动内容区和底部操作区都放大并重新分配空间。
- 放大移动端交互密度：菜单按钮、设置页页签、开关按钮、枚举切换按钮、滑条、底部 `Apply` / `Default` / `Back` / `Save & Close`、存档页按钮与状态提示都提升了点击尺寸、字号和留白，减少手机端误触和难以辨认的问题。
- 保持 prefab-first 结构不变，不改路径与模块入口；本轮通过 `InGameSettingsUI` 的移动端运行时排版收口，让现有战斗 HUD 设置界面先达到可读、可点、观感更稳的状态。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 手机端战斗内暂停菜单、操控设置页面、存档管理页面的整体尺寸、字号和按钮触达面积。
- `Control Scheme = Mobile` 或移动平台运行时的设置界面观感与操作效率。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：手机端打开设置后，暂停页是否接近全屏且按钮明显变大；设置页左侧页签、右侧每一行配置项、底部主按钮是否足够大且不重叠；存档页列表和按钮是否可读可点。

### 后续注意事项
- 这轮优先把手机端尺寸和布局节奏拉到可用区间；如果你后续还想继续做“更美观”的第二轮，可以再把 icon、分组标题、分隔线、选中态高亮和按钮材质统一往同一套视觉语言上收。

## 2026-05-23 - 战斗内设置入口与移动端视觉层次二次优化

### 修改内容
- 继续优化手机端战斗内设置页的易用性和观感。
- 放大 `GameUI` 中移动端右上角 `InGameSettingsButton` 的尺寸、位置与字号，让入口在战斗 HUD 里更容易发现和点按。
- 在 `InGameSettingsUI` 中为手机端暂停页、设置页、存档页增加更明显的头部/底部分区带和分隔线，强化标题区、内容区、操作区的层次，让整页不再像单块放大的桌面面板。
- 提高手机端设置页滚动灵敏度，配合放大的行高和按钮尺寸，改善长列表设置项的触控滚动体验。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 手机端战斗 HUD 顶部设置入口按钮的可见性与点击命中面积。
- 战斗内暂停菜单、设置页、存档页在移动端的视觉分区与整体观感。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：右上角设置按钮是否比上一轮更醒目、更容易点击；打开后的暂停/设置/存档页头尾层次是否更清楚；长设置列表在手机端滚动是否顺手。

### 后续注意事项
- 这轮已经把“入口、尺寸、层次”这三件最影响手机端观感的问题继续往前推了一步；如果还要再做更完整的美术统一，下一轮建议直接收按钮底板、图标语言、页签选中态和滑条材质。

## 2026-05-23 - 手机端设置页 Tab 结构改上方与入口布局配置同步

### 修改内容
- 继续优化手机端战斗内设置页结构，不再沿用“左侧窄页签栏 + 右侧内容区”的桌面式布局。
- 将手机端设置页的 `Tabs` 区改为顶部横向分栏，`ContentFrame` 改为下方全宽内容区，让设置项在手机端拿回更完整的横向空间，减少前几轮放大后仍显拥挤的问题。
- 同步更新 `UiScreenLayoutConfig.asset` 中 `InGameSettingsButton` 的 mobile override，把右上角设置入口的实际配置尺寸也放大到与运行时代码一致，避免布局配置把按钮压回旧的小尺寸。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Resources/UI/Configs/UiScreenLayoutConfig.asset`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 手机端战斗内设置页的页签结构、内容区可用宽度和横向阅读体验。
- 右上角 `InGameSettingsButton` 在移动端的最终实际尺寸与位置。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：手机端设置页页签是否已移到上方；右侧内容是否变成更宽的全宽列表；右上角设置按钮是否按新尺寸显示，而不是被旧 layout config 缩回去。

### 后续注意事项
- 如果这轮结构调整后仍觉得页签拥挤，下一轮可以继续把 7 个 tab 收成 2 行，或改成可横向滚动的 segmented bar，而不是继续压缩单个按钮宽度。

## 2026-05-23 - HUD与单位状态表现优化

### 修改内容
- 优化 `WorldHudManager` 的头顶 HUD 状态行表现：单位活动状态与 Buff 摘要不再挤成一行，建筑生产/研究状态的主文案与右侧进度说明分离显示，状态行尺寸、颜色、字重和空白层次按单位/建筑/改造状态分别细化。
- 调整头顶 HUD 根高度与重叠避让策略，让带状态行或警报文本的 `WorldHudItem` 有更稳定的占位和上移间距，减少头顶信息互相压住的情况。
- 扩展 `BuildingProductionStatusUI`：除了建造中、升级中、造兵中，现在也会显示研究中的建筑状态；造兵状态改为显示当前单位名、排队数量、百分比和剩余时间，而不是只显示笼统的 `Train xN`。
- 优化 `SelectionPanel` 左侧信息块：生命区扩成双行，可同时显示 HP 和当前关键状态；单位会显示施法/采集/巡逻/攻击或 Buff 摘要，建筑会显示建造/升级/生产/研究/改造进度。
- 多选单位时新增专用信息可视化，显示平均生命、焦点单位生命，以及近战/远程/辅助/空中/总数等编成卡片，不再沿用单个焦点单位的整套血量卡。
- 单位详情附加状态摘要文本，保持 prefab 承载静态结构，脚本只负责动态状态绑定、显隐和进度值刷新。

### 修改文件
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Assets/Scripts/UI/BuildingProductionStatusUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位/建筑头顶 `WorldHudItem_Prefab` 的运行时状态展示密度与可读性。
- 建筑造兵、研究、升级、施工、机械改造等状态在头顶 HUD 和选中详情中的同步表现。
- 单选单位、单选建筑、多选单位时左侧信息面板的生命/属性/状态层次。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - 头顶 HUD 的活动状态、Buff 摘要、建筑生产/研究状态是否比之前更清楚且不再挤成一团
  - 选中单位/建筑后左侧信息区是否出现第二条状态进度行
  - 多选单位时是否显示平均血量与编成卡，而不是只照抄焦点单位
  - 研究中的建筑头顶是否也会出现状态行与进度

### 后续注意事项
- 本轮主要是运行时动态展示优化，没有改 prefab 资源路径；如果后续要继续强化视觉样式，应优先在 `WorldHudItem_Prefab`、选择面板子 prefab 里微调字体、底板和间距，不要回退到代码里硬造可见 UI。
- 建筑状态目前仍然优先显示单一“最重要状态”；如果后续希望同时并列展示生产和研究，需要在 prefab 上明确扩容状态容器，而不是继续把更多信息塞进同一条状态行。

## 2026-05-23 - 战斗内旧建造页回流与独立窗口挂载收口

### 修改内容
- 继续收口战斗 HUD 中残留的旧建造/造兵/科技窗口路径，避免移动端和放置态再次回到旧的独立页面规则。
- `BuildDevelopmentPanelUI` 的放置态 `ChangeBuilding` 不再重新打开旧的 `BuildCommandBar` / `BuildDetailPanel` 浏览页；现在会取消当前预建造并返回 `SelectionPanel` 的内嵌建造页，和 PC/手机端共用同一套 prefab 页面规则。
- `SelectionPanel` 新增公开入口，用于在保持当前选择的前提下直接切回内嵌建造页，供放置态返回使用。
- `GameUI` 不再在 `EnsureAdvancedPanels()` 阶段主动给 `BuildingUnitProductionWindow` 和 `TechTree` 宿主补挂运行时组件；未被显式使用的旧独立窗口不会再在启动时参与初始化、报 prefab 缺节点错误或增加额外运行负担。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 预建造放置态点击“更换建筑”后的返回路径。
- 战斗 HUD 内嵌建造页与旧 `BuildDevelopmentRoot` 浏览页的职责边界。
- 旧 `BuildingUnitProductionWindow` / `TechTreeRoot` 在正常战斗 HUD 流程中的启动时初始化行为。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：预建造时点击“更换建筑”是否直接回到 `SelectionPanel` 内嵌建造页，而不是出现旧 `BuildCommandBar` / `BuildDetailPanel`；进入战斗时是否不再因为独立造兵窗或科技树壳体缺节点而报初始化错误。

### 后续注意事项
- `BuildDevelopmentRoot` 当前继续只承担放置确认 overlay，不要再把普通建造浏览列表接回去。
- 旧独立造兵窗和科技树窗口的宿主节点仍保留在 HUD 里做兼容隐藏；后续若确认完全无显式入口，可继续做资源级清理，但不要影响现有 prefab 路径。

## 2026-05-23 - 不同阵营特殊玩法表现增强

### 修改内容
- 继续优化战斗 HUD 中不同阵营特殊玩法的可见性，把原本主要藏在长文本摘要里的运行时状态，抬到头顶 HUD 状态行和选择面板进度区。
- `UnitOverheadUI` 新增统一的阵营特殊状态读取：华夏单位升星进度、妖兽单位吞噬/可进化、机械单位充能/过载、妖兽建筑献祭/圣祭、机械建筑电路/过载、自然建筑共鸣层数、自然单位融合状态。
- `WorldHudManager` 现在会在常规活动状态之外，优先显示这些阵营特殊机制状态，使玩家不点开详情也能看到关键玩法节奏。
- `SelectionPanel` 的左侧进度条状态区改为优先显示阵营玩法进度：华夏升星、妖兽吞噬/献祭、机械充能/电路、自然融合/共鸣等；同时补充 PC 信息块里的紧凑阵营摘要，让特殊玩法不再只靠长段说明文字传达。

### 修改文件
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位/建筑头顶 `WorldHudItem_Prefab` 的阵营特色状态展示。
- 选择面板左侧生命/状态进度区与 PC 额外信息块中的阵营玩法摘要。
- 华夏、机械、妖兽、自然这几类已有运行时特殊机制的战斗内可读性。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - 华夏单位是否能看到升星进度或满星状态
  - 机械单位/建筑是否能看到充能、过载、电路接入等提示
  - 妖兽单位是否能看到吞噬/可进化，妖兽建筑是否能看到献祭/圣祭
  - 自然单位/建筑是否能看到融合/共鸣层数，而不必只读长文本说明

### 后续注意事项
- 这轮主要增强的是“状态可见化”，没有新开独立 UI 模块；如果后续要进一步做阵营专属视觉语言，优先在对应 prefab 的状态图标、色条和徽记上继续深化。
- 当前融合阵营与更多组合阵营的特色表现仍以现有组合摘要为主；下一轮可以继续把融合英雄/组合科技的运行时状态也接进同一套 HUD 状态行规则。

## 2026-05-23 - 融合阵营运行时状态接入HUD与选择面板

### 修改内容
- 继续完善融合/组合阵营在战斗内的可见性，把原先主要停留在说明摘要里的路线状态，接入 `UnitOverheadUI` 与 `SelectionPanel` 现有统一状态条。
- 组合单位现在会优先显示路线激活状态：未激活时显示融合阶级与路线，完成组合科技后显示“组合激活”，满足三重联动科技后显示“三重联动”。
- 组合建筑现在会优先显示占领保护倒计时、断供状态、融合阶级、可用组合科技数量，以及三重联动可用状态，不再只依赖下方长段说明文字。
- `SelectionPanel` 的紧凑阵营 badge 和摘要也补上了组合阵营规则，让单位/建筑详情左侧生命区与功能区能直接读出当前路线节奏。

### 修改文件
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 组合单位与组合建筑头顶 `WorldHudItem_Prefab` 的状态行优先级与文案。
- 选择面板左侧进度条状态区、PC 信息块中的组合路线 badge / 摘要 / 阶段提示。
- 融合阵营的占领保护、断供、路线科技和三重联动在战斗中的即时辨识度。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - 组合建筑刚占领后头顶 HUD 是否显示“占领保护”倒计时
  - 组合建筑正常运行时是否显示 `融合T1/T2/T3`、科技数或三重联动状态
  - 组合单位选中后左侧状态区是否显示“组合激活”或“三重联动”，而不是只剩通用属性
  - 占领核心被摧毁后，相关融合建筑/单位是否能明显显示“断供”

### 后续注意事项
- 这轮仍然沿用现有 prefab 结构，只增强动态状态绑定；如果后续想让组合阵营更醒目，优先在 `WorldHudItem_Prefab` 和选择面板子 prefab 上增加专属图标或徽记槽位。
- 当前断供分支已显示状态，但未单独展示 60 秒废墟化剩余时间；若后续需要更强运营提示，可以继续从 `CaptiveCityManager` 补出断供剩余时长并接入同一状态条。

## 2026-05-23 - 融合科技研究与组合英雄状态增强

### 修改内容
- 继续完善融合/组合阵营在战斗内的节奏可见性，把“组合科技研究中”和“组合英雄状态”也接入头顶 HUD 与选择面板的统一状态规则。
- `UnitOverheadUI` 现在会优先显示组合建筑当前进行中的 `combo.pair` / `combo.triple` 研究状态与百分比，不再只显示静态的融合阶段和科技数量。
- 终局融合建筑会额外暴露组合英雄状态：英雄在场、英雄复活中、未召唤，会按运行时英雄生命周期切换。
- 组合英雄单位本身也从普通组合单位分支中分流出来，状态条与左侧摘要会显示“组合英雄 / 英雄激活 / 终局路线”这类更准确的提示。
- `SelectionPanel` 同步补上组合科技研究中的状态条、组合英雄 badge、组合英雄摘要和终局建筑的英雄状态摘要。

### 修改文件
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 组合建筑头顶 `WorldHudItem_Prefab` 对融合研究进度、终局英雄状态的运行时展示。
- 组合英雄单位与终局组合建筑在选择面板左侧状态区和 PC 信息块中的摘要文案。
- 玩家在组合路线推进、三重研究和终局英雄出场/复活阶段的局内辨识度。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - 组合建筑研究 `combo.pair` / `combo.triple` 时，头顶 HUD 是否优先显示“融合研究/三重研究 + 百分比”
  - 终局融合建筑是否会显示组合英雄“在场 / 复活中 / 未召唤”
  - 组合英雄被选中后，左侧状态区是否显示“组合英雄/英雄激活/终局路线”而不是普通组合单位提示
  - 组合英雄死亡并进入复活期时，建筑和相关状态摘要是否同步切换成倒计时

### 后续注意事项
- 这轮主要强化的是“研究中/英雄态”的动态绑定，仍未增加组合阵营专属图标资源；如果后续继续做美术深化，优先在 prefab 上补组合研究 icon 和英雄徽记槽位。
- 当前组合英雄状态通过现有 `HeroLifecycleManager` 的英雄 HUD 数据复用；如果后续需要显示更细的英雄技能冷却或专属资源，建议继续沿用这一入口而不是另起独立缓存。

## 2026-05-23 - 融合断供倒计时与组合英雄技能节奏增强

### 修改内容
- 继续补齐融合阵营的战斗内节奏可见性，把文档里要求的“断供 42s”这一类倒计时，正式接入 `CaptiveCityManager`、头顶 HUD 和选择面板状态条。
- `CaptiveCityManager` 新增断供剩余时间只读入口，复用现有 `SupplyBrokenTime` 与 60 秒断供规则，不额外引入新状态缓存。
- `UnitOverheadUI` 中的融合建筑断供状态不再只显示“核心失联”，现在会优先显示断供剩余秒数；组合英雄单位也会优先显示终极技能节奏：终极就绪、终极冷却、终极施法。
- `SelectionPanel` 同步补上断供倒计时、组合英雄终极技能 badge 和摘要，让头顶 HUD、左侧状态区、PC 信息块里的运行时提示保持一致。

### 修改文件
- `Assets/Scripts/Core/CaptiveCityManager.cs`
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 融合建筑断供状态在头顶 `WorldHudItem_Prefab` 与选择面板中的倒计时可见性。
- 组合英雄终极技能在场上的冷却、施法、就绪节奏表现。
- 玩家对“还能抢救多久”“英雄大招什么时候能放”的即时判断能力。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - 占领核心被摧毁后，相关融合建筑头顶 HUD 是否显示类似“断供 42s”
  - 选择面板建筑摘要里是否同步显示断供剩余时间，而不是只写“核心失联”
  - 组合英雄终极技能冷却时，头顶/左侧状态是否显示冷却秒数
  - 组合英雄施放终极技能时，状态是否切到“终极施法”

### 后续注意事项
- 当前断供剩余时间按固定 60 秒规则显示，若后续把“断供延迟 +30 秒”科技做成真实运行时修正，应优先在 `CaptiveCityManager` 这一入口继续扩展。
- 组合英雄技能节奏目前只优先暴露终极技能；如果后续还要显示主动技能连段或专属资源，建议继续复用 `UnitSkillController.GetDisplaySkills()` 而不是分散到多个 UI 层各自计算。

## 2026-05-24 - 融合状态图标与视觉识别增强

### 修改内容
- 继续强化融合阵营已有状态的视觉识别，不新增 UI 结构，直接复用 `WorldHudItem_Prefab` 现有的 `StatusIcon` 和状态条底板。
- `UnitOverheadUI` 新增阵营状态图标解析入口：融合研究会优先使用科技 icon，组合英雄终极状态会优先使用技能 icon，断供与融合路线状态会使用更贴近含义的 faction / tech icon，而不再统一退回默认占位图标。
- `WorldHudManager` 在 faction-status 分支里改为真正使用 `FactionStatusIcon`，并按断供、三重研究、组合英雄/终极、普通融合研究分别拉开状态条底板颜色，让同一套状态行在战斗中更容易一眼区分。
- 这轮没有修改 prefab 路径和层级，只增强运行时绑定与表现收口，保持 prefab-first 规则不回退。

### 修改文件
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 组合建筑与组合英雄头顶 `WorldHudItem_Prefab` 的状态图标与底板颜色区分度。
- 断供、三重研究、终极就绪/施法等融合状态在战场中的第一眼辨识效率。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - 断供状态是否不再是默认方块 icon，而是更明确的警示 icon，并带更深的危险底色
  - `combo.pair` / `combo.triple` 研究中是否显示科技 icon，而不是通用占位 icon
  - 组合英雄终极冷却/施法/就绪时是否显示对应技能 icon，并且底板与普通融合阶段有明显区分

### 后续注意事项
- 当前视觉强化仍然基于运行时 fallback icon；如果后续美术资源补齐，应优先让 `TechData.Icon`、组合英雄技能 icon 和专属 faction crest 接管这些状态槽位。
- 这轮只增强头顶 HUD 的视觉层；如果后续还想继续统一移动端体验，可以把同样的 icon 语义同步到 `SelectionPanel` 里的左侧状态小图标槽，而不是新增文字说明。

## 2026-05-24 - 战斗内设置界面失效项排查与收口

### 修改内容
- 排查战斗内 `InGameSettingsUI` 的保存链路，确认原本“能保存但很多项不生效”的核心问题主要来自设置页暴露了大量尚未接入运行时消费的选项，而不只是 Apply 按钮本身失效。
- `UserInputSettingsStore` 新增安全拷贝与设置变更事件；保存时不再把界面草稿对象直接作为运行时缓存复用，避免设置页编辑态和全局运行时状态混用。
- `InGameSettingsUI` 改为使用克隆草稿编辑，并把当前没有真实运行时支撑的高级设置项从页面里暂时收口，只保留已经有明确运行时效果的设置；对应分组改为信息提示，避免继续出现“看起来可点、实际无效”的假开关。
- `GameUI` 订阅设置变更事件，在 Apply 后即时刷新控制方案布局、选择面板、移动端命令栏/动作栏与嵌入式设置按钮文本，不必等重新开局才生效。
- `CameraController` 订阅设置变更事件，默认镜头高度在战斗内应用设置后可立刻刷新。
- `BattleAlertUI` 现在遵守 `CombatCameraHintsEnabled`，关闭相关提示后不会继续弹出全局战斗警报表现。

### 修改文件
- `Assets/Scripts/Core/UserInputSettings.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Utils/CameraController.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗内设置界面的可用性与可信度。
- 设置应用后的 HUD 即时刷新行为。
- 镜头默认高度、战斗警报提示开关等已接线设置的即时运行时反馈。
- 页面上原先未真正实现的若干“未来设置项”的显示策略。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - 战斗中打开设置页后，镜头相关选项 Apply 是否立刻生效
  - `Show Stop` 开关调整后，相关 HUD/命令区刷新是否及时
  - 关闭战斗提示后，`BattleAlertUI` 是否不再继续弹出提示
  - 设置页是否不再显示一批实际无效的高级开关，减少“点了没反应”的假功能

### 后续注意事项
- 本轮优先目标是把设置页收口成“真实可用页面”，不是把所有预留设置一次性补成完整玩法系统；后续继续做技能施法、编队自动分组、建造页交互等高级设置时，应先补运行时消费逻辑，再重新把对应项放回页面。
- `MainMenuUI` 里仍有一部分同源输入设置入口；后续若继续统一，应让主菜单设置页也复用同一套“只暴露已接线项”的规则，避免两边出现能力不一致。

## 2026-05-24 - 战斗内建造设置恢复首批运行时接线

### 修改内容
- 补建了 `docs/features/IN_GAME_SETTINGS.md`，作为战斗内设置功能的最小入口文档，明确“只有接好运行时消费的设置项才能出现在战斗设置页里”。
- `BuildingPlacer` 不再把“移动端一定预览后确认”写死；现在正式读取 `UserInputSettings.PlacementConfirmMode`，`PlaceOnTap` 和 `PreviewThenConfirm` 会真实影响局内建造放置流程。
- `GameUI` 恢复 `AutoOpenProductionPanel` 的运行时消费：玩家选中可造兵建筑时，如果该设置开启且当前没有别的主面板占用，会自动切到统一造兵页；关闭时则保持只显示 HUD 详情，不自动弹造兵界面。
- `InGameSettingsUI` 的 Build / Train 页签重新放回 `Placement Confirm` 和 `Open Production Panel` 两项，因为它们现在已经有真实运行时行为，不再是占位设置。

### 修改文件
- `Assets/Scripts/Buildings/BuildingPlacer.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `docs/features/IN_GAME_SETTINGS.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- `docs/features/IN_GAME_SETTINGS.md`

### 影响范围
- 战斗内建筑预放置的确认方式。
- 选中可生产单位的建筑时，是否自动切入统一造兵页。
- 战斗内设置页 Build / Train 分组的真实可用项范围。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - 将 `Placement Confirm` 切成即时放置后，点击地面是否直接下建筑，不再强制走确认按钮
  - 将 `Placement Confirm` 切回预览确认后，是否恢复虚影预览与确认/取消按钮流程
  - 打开 `Open Production Panel` 后，选中兵营/兵种建筑时是否自动进入统一造兵页
  - 关闭 `Open Production Panel` 后，选中同类建筑时是否只停留在 HUD 详情，不自动打开造兵界面

### 后续注意事项
- `ProductionQueueInput` 仍未恢复；后续若继续补造兵交互设置，建议直接在 `UnitProductionPanel` 里做点击/长按重复的统一规则，不要再回到旧独立窗口那套路径。
- 技能施法类设置仍是下一组重点，适合继续从 `InputHandler.BeginSkillTargeting()` 与 `SelectionPanel` / `GameUI` 的技能按钮入口往下接。

## 2026-05-24 - 造兵队列输入设置恢复运行时交互

### 修改内容
- 继续补战斗内设置页中被隐藏的 `ProductionQueueInput`，把它从“仅保存配置值”恢复成真实会影响造兵页交互的运行时设置。
- `UnitProductionPanel` 现在为每张造兵卡绑定了局部的长按重复输入转发器，不改 prefab 结构、不引入新全局输入系统，只在现有统一造兵页内增加队列输入规则。
- `ProductionQueueInputMode.SingleTapAddOne` 下保留原有单击加一逻辑；`HoldToRepeat` 与 `Both` 会在按住造兵卡一段短延迟后持续重复加入队列，直到松手、拖离或加入失败。
- 重复加入队列时会复用现有训练校验与 `ProductionQueue.AddToQueue()`，不会绕过资源、前置条件和人口上限检查；失败时会自然停止重复，不会无限刷报错。
- `InGameSettingsUI` 的 Build / Train 页签重新放回 `Queue Input` 设置项，并同步更新 `docs/features/IN_GAME_SETTINGS.md`，将其列为已验证的运行时设置。

### 修改文件
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `docs/features/IN_GAME_SETTINGS.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 统一造兵页中单位卡片的点击/长按交互。
- 战斗内设置页 Build / Train 分组中的 `Queue Input` 真实可用性。
- 造兵队列的连续加入体验，尤其是手机端或触屏调试模式下的长按连点行为。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - `SingleTapAddOne` 下点击单位卡是否只加入 1 个
  - `HoldToRepeat` 下单击是否不再立即加队列，长按是否持续加入
  - `Both` 下单击是否加入 1 个，长按是否继续重复加入
  - 资源不足、人口不足或前置未满足时，长按重复是否会停止，而不是持续刷无效队列

### 后续注意事项
- 当前 `HoldToRepeat` 模式仍保留按钮原始 click 回调，因此实际体验需要重点验证触屏设备/编辑器模拟下 click 与长按是否完全符合预期；如果后续发现单击仍会先触发一次，可继续在 forwarder 里补 suppress-click 规则。
- 下一组最值得继续接回的是技能施法设置，尤其 `SkillCastInput`、`SkillCancelInput` 和 `ShowAreaSkillPreview`，它们已经有明确的 `InputHandler` 入口，适合按这轮同样的思路逐项恢复。

## 2026-05-24 - 战斗内技能施法设置恢复首批运行时接线

### 修改内容
- 继续把战斗内设置页中的施法项从“只保存不生效”补到真实运行时，优先恢复低风险且已有统一入口的两项：`ShowAreaSkillPreview` 与 `SkillCancelInput`。
- `InputHandler` 现在统一读取 `UserInputSettingsStore.Current.ShowAreaSkillPreview`；关闭后，范围技能仍可正常进入选点/施法流程，但不会再显示地面圆形/扇形/直线预览，只保留必要的目标状态处理。
- `InputHandler` 新增“再次点同一个技能取消当前施法”的统一入口，并根据 `UserInputSettings.SkillCancelInput` 决定是否允许通过空地/右键取消、重复点击技能取消，或两者都允许。
- `SelectionPanel` 的技能栏点击与热键施法、`GameUI` 的移动端技能按钮点击现在都复用同一套取消判定，不再出现 PC 和移动端各走一套技能取消规则的分叉。
- `InGameSettingsUI` 的 Casting 页签重新放回 `Area Preview` 和 `Cancel Skill`，其余尚未完全接入运行时的施法模式与智能施法设置继续隐藏，避免再次出现假设置。
- 同步更新 `docs/features/IN_GAME_SETTINGS.md`，将这两项列为已验证的战斗内运行时设置。

### 修改文件
- `Assets/Scripts/Core/InputHandler.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `docs/features/IN_GAME_SETTINGS.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗内单位技能的目标预览显示。
- PC 技能栏点击、技能热键与移动端技能按钮的取消施法规则一致性。
- 战斗内设置页 Casting 分组当前真实可用项的范围。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - 关闭 `Area Preview` 后，范围技能是否仍可正常选点和施法，但不再显示地面预览
  - `Cancel Skill = Tap Skill Again` 时，再次点击同一技能是否取消施法，空地/右键是否不再负责取消
  - `Cancel Skill = Tap Empty Space` 时，空地/右键是否可以取消，重复点击同一技能是否不会取消
  - `Cancel Skill = Either` 时，两种取消路径是否都可用

### 后续注意事项
- `SkillCastInput`、`SmartCastAssistEnabled`、`DirectionalSkillAssist` 仍未完整接到共享 HUD 的所有技能入口；它们比这轮两项更大，后续应继续沿 `InputHandler` 和移动端技能按钮转发链统一设计，不要局部补一半。
- 当前 `SkillCancelInput` 的“空地取消”在 PC 端沿用右键取消语义；如果后续要把它扩展到更多触屏空白区域手势，应继续保持由 `InputHandler` 统一消费，避免再次分裂成多套规则。

## 2026-05-24 - 单位和建筑操作按钮重复显示收口

### 修改内容
- 将旧 `MobileActionBar` 收口为仅在需要关闭/取消当前上下文时显示 `Close`，普通单位/建筑命令不再从旧移动操作条显示。
- `EnsureMobileActionBar()` 创建或绑定旧移动操作条后会立即隐藏 `Build Menu`、`Production`、`Technology Tree`、`Gather`、`Attack`、`Attack Move`、`Stop`、`Rally`、`Upgrade` 等旧按钮，避免 prefab 初始可见导致短暂露出。
- 保持 `SelectionPanel` 作为单位/建筑普通操作的唯一显示入口，避免移动端旧圆形按钮和新 HUD 操作页并排出现。
- 修正 `SelectionPanel` 操作按钮和详情卡里与本次操作区相关的乱码文案，包括吞噬、献祭、改造、拆除、升级，以及移动端短字图标。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 手机端单位/建筑操作按钮显示规则。
- PC/移动端共用的 `SelectionPanel` 操作详情卡文案。
- 旧 `MobileActionBar_Prefab` 的运行时可见性控制，不改动 prefab 资源结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - 选中单位后，只显示 `SelectionPanel` 的单位操作按钮，不再同时显示旧 `MobileActionBar` 的 Gather/Attack/Stop 等按钮
  - 选中建筑后，只显示 `SelectionPanel` 的建筑操作/生产/科技入口，不再同时显示旧 Production/Rally/Upgrade 按钮
  - 预建造、施法选点、主面板打开等需要关闭上下文的场景，旧 `MobileActionBar` 最多只显示 Close
  - 操作详情卡中的“建筑操作/单位操作/吞噬/献祭/改造/拆除/升级”等文案不再乱码

### 后续注意事项
- `MobileActionBar_Prefab` 仍保留旧按钮节点用于兼容绑定，但普通命令已由运行时统一隐藏；后续若彻底清理资源，应同步检查 `UiPrefabWorkflowGenerator`，避免生成器再次生成旧按钮。
- 本轮没有改动预建造确认覆盖层，确认/取消/旋转/更换仍由 `BuildDevelopmentPanelUI` 的放置覆盖层负责。

## 2026-05-24 - 造兵队列显示稳定性和间距优化

### 修改内容
- 修复 HUD 内嵌造兵页生产队列闪烁：`OnProductionProgressChanged` 不再整行清空并重建队列 UI，只更新现有条目的进度文字和进度填充。
- 为 `SelectionPanel` 增加生产队列运行时签名缓存，只有建筑、队列数量或队列单位顺序变化时才重建条目。
- 切换绑定建筑或生产队列时会清理队列 UI 缓存，避免复用到旧建筑的条目引用。
- 放宽造兵队列条目尺寸和横向间距，当前生产项与等待项分别使用更宽的运行时尺寸，减少图标、名称、进度和取消按钮挤压。
- 对 `ProductionQueueEntry` 动态条目补充运行时排版约束：图标、名称、进度文字、进度条和取消按钮分区摆放，队列内容更易读。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中后 HUD 内嵌造兵页的生产队列显示。
- 队列进度刷新性能和视觉稳定性。
- PC 与移动端共用的 `SelectionBuildingProductionPage_Prefab` 动态队列条目布局。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- 运行时重点检查：
  - 正在生产单位时，当前生产条进度变化不再闪烁或重置
  - 连续加入多个单位后，等待队列只在队列内容变化时新增/移除条目
  - 当前生产条、等待队列条目、取消按钮和进度文字不再互相挤压
  - 切换不同造兵建筑后，队列内容不会残留上一栋建筑的条目

### 后续注意事项
- 本轮只调整运行时动态条目的刷新和必要排版；如果后续继续细化视觉尺寸，优先在 `ProductionQueueEntry_Prefab` 和 `SelectionBuildingProductionPage_Prefab` 中调固定样式。
- 独立大造兵窗口 `UnitProductionPanel` 仍有自己的队列刷新路径；如果之后发现独立窗口也闪烁，应按同样“进度只更新，结构变化才重建”的规则处理。

## 2026-05-24 - 图鉴建筑与单位选择列表恢复显示

### 修改内容
- 修复主菜单图鉴页建筑/单位列表为空的问题：图鉴数据源现在在 `GameManager.Instance.Config` 不存在时会回退加载 `Resources/Data/RTSGameConfig`，避免主菜单阶段只生成地形/玩法条目。
- 图鉴数据缓存如果先在无配置状态下生成过，会在配置可用后重新构建，保证建筑与单位条目不会被早期空缓存卡住。
- 强化 `CodexCardScroll` 的 prefab 绑定：运行时会兼容多种 `Viewport/Content` 层级，重新绑定 `ScrollRect.content`，并确保滚动节点与内容节点保持可见。
- 修复无 `LayoutGroup` 兜底排布时卡片宽度被设置为 0 的问题，避免条目已经实例化但左侧列表不可见。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.Codex.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单图鉴页的建筑列表、单位列表、左侧滚动列表绑定与数据刷新。
- `CodexPage_Prefab` 中 `CodexCardScroll/Viewport/Content` 的运行时兼容绑定。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 本轮不改 prefab 静态布局，只修运行时数据、节点绑定和兜底可见性；如果 Unity 运行态仍觉得卡片尺寸或间距不理想，继续优先调整 `CodexPage_Prefab` 与 `CodexEntryCard_Prefab`。

## 2026-05-24 - 主菜单页面显示时序修复

### 修改内容
- 修复主界面打开后整页不可见的问题：`ShowPage()` 现在在明确显示主菜单页面时会主动恢复 `MainMenuCanvas` 的 `CanvasGroup` 可见、可交互状态。
- 保留进入战斗加载中的隐藏规则：如果 `GameSessionManager.IsSessionTransitionInProgress` 为 true，主菜单仍保持隐藏，避免加载/战斗过程中误露出。
- 避免主菜单页生成依赖 `GameManager.CurrentState` 事件先后顺序；即使状态切回 `MainMenu` 的事件晚于 `ShowPage(Home)`，页面也不会被 `RefreshVisibility()` 卡成透明。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单首页、图鉴、设置、副本选择等 `MainMenuUI.ShowPage()` 创建的页面可见性。
- 从战斗/结算/启动阶段返回主界面的 CanvasGroup 状态恢复。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 如果 Unity 运行态仍出现空白，应继续看当时 Console 是否有 `UiPrefabResolver` 实例化异常或页面 prefab 根节点 CanvasGroup 被自定义动效置 0；本轮已先修最可能导致整页透明的状态时序。

## 2026-05-25 - 建筑视觉进阶嵌套完整运行体报错修复

### 修改内容
- 修复 `BuildingVisualProgressionController` 在剥离视觉 prefab 冲突组件时误删 `BaseBuilding` 导致的运行时报错。
- 当前有一类错误配置的 `VisualPrefab` 不只是纯视觉节点，而是直接塞进了带 `ProductionQueue`、`ResearchQueue`、`BuildingSelectionFeedback`、`RallyPoint` 的完整建筑运行体；此前逻辑尝试只删 `BaseBuilding` 组件，Unity 会因为依赖链存在而拒绝删除。
- 现在运行时会优先删除这类嵌套的完整建筑子对象；只有在确实是孤立 `BaseBuilding` 组件、且没有依赖型玩法脚本时，才删除组件本身。
- 对无法安全剥离的情况保留警告日志，提示资源本身应改成 visual-only prefab，避免再次把完整 gameplay 建筑当作视觉层使用。

### 修改文件
- `Assets/Scripts/Buildings/BuildingVisualProgressionController.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 所有使用 `BuildingVisualProgressionController` 的建筑等级视觉替换链路。
- 错误配置为完整建筑 prefab 的 `BuildingVisualProgressionData.levelVisuals[].VisualPrefab`。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 本轮修的是运行时硬防护，不代表这些 `VisualPrefab` 资源配置已经正确；后续仍建议在 Unity 里检查对应 `BuildingVisualProgressionData`，把完整建筑 prefab 换成纯视觉 prefab。

## 2026-05-25 - 顶部资源栏特殊资源命名与图标显示整理

### 修改内容
- 修复 HUD 顶部特殊资源条目中文名不稳定的问题，特殊资源现在统一按阵营映射为稳定名称：华夏 `人口`、妖兽 `妖核`、机械 `电力`、自然 `灵智`。
- 特殊资源条目不再强依赖旧的 `SpecialResourceText` 运行时节点；优先复用资源条 prefab 内现有的 `Value` 文本节点，和普通资源统一成同一套“前置图标 + 名称/数值”显示规则。
- 顶部资源条的图标包装节点保留为布局容器，但去掉 `ResourceIconFrame` 的可见底板/描边表现，避免多余视觉内容继续显示。
- 普通资源和特殊资源都会确保资源图标显示在最前面，同时隐藏旧的 `TextStack`、`Name`、`InlineText`、`SpecialResourceText` 等冗余文本输出。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 顶部公共资源与阵营特殊资源条目的名称、图标顺序和冗余节点可见性。
- `SpecialResource_Human_Huaxia` 及其他 `SpecialResource_*` 条目在 prefab 化资源栏中的运行时绑定。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 本轮主要收敛运行时显示逻辑，没有直接改 prefab 静态层级；如果 Unity 里仍有个别资源条 prefab 自带额外装饰节点，可继续在对应 prefab 中把冗余节点彻底移除。

## 2026-05-25 - 移动端巡逻命令点击无效修复

### 修改内容
- 修复单位点击巡逻后在移动端/触摸式输入下不生效的问题。
- 根因是 `InputHandler.TryHandleMobileTapCommand()` 在巡逻待命时，仍会优先把点击到的己方单位/建筑当成重新选中，导致巡逻命令还没进入 `IssuePatrolOrders()` 就被吃掉。
- 现在当 `patrolQueued` 或其他显式命令模式（移动、攻击、攻击移动、采集）已挂起时，战场点击会优先执行命令，不再先被友方重选逻辑截走。

### 修改文件
- `Assets/Scripts/Core/InputHandler.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 手机端与触摸式输入下的巡逻、移动、攻击、攻击移动、采集这类“先点按钮再点战场”的交互优先级。
- 己方单位/建筑被点到时的命令执行顺序。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 本轮修的是输入优先级，不涉及巡逻路径算法本身；如果 Unity 运行中仍出现“点地后单位只走到点位不循环巡逻”，需要继续看 `UnitController.UpdatePatrol()` 与地形/NavMesh 的运行态日志。

## 2026-05-25 - 巡逻模式设置接入与两点巡逻补全

### 修改内容
- 继续完善巡逻逻辑，把设置页里原本存在但未接入运行时的 `PatrolCommandInput` 真正接回命令系统。
- `InputHandler` 现在会根据 `UserInputSettingsStore.Current.PatrolCommandInput` 决定巡逻行为：
  - `TwoPointPatrol`：以当前选中编队中心为起点、玩家点击位置为终点，执行两点往返巡逻。
  - `OneTapNearbyArea`：保留现有“围绕目标区域环绕巡逻”的行为。
- `UnitController` 新增两点往返巡逻支持，避免设置页显示支持两种模式、运行时却始终只有一种模式。
- `InGameSettingsUI` 的输入设置页重新显示 `Patrol Command` 选项，避免设置项存在于数据结构里但界面无法调整。

### 修改文件
- `Assets/Scripts/Core/InputHandler.cs`
- `Assets/Scripts/Units/UnitController.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位巡逻命令的输入方式与运行态路径行为。
- 操作设置界面里的巡逻模式配置项。
- 手机端/触摸与 PC 共用的巡逻命令分发。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 两点巡逻当前以“当前编队中心 -> 玩家点击点”作为往返点；如果后续需要更传统的“第一次点 A、第二次点 B”双击定点流程，可在现有结构上继续扩展，而不用再重写单位巡逻状态机。

## 2026-05-25 - 自动采集搜索节流与分阶段扩圈优化

### 修改内容
- 优化 `GathererUnit` 的自动采集实现，解决点击自动采集后频繁全表扫描 `ResourceNode.ActiveNodes` 导致的明显卡顿。
- 旧逻辑是常驻协程轮询：目标一旦为空，就每隔短时间重新扫一遍资源节点列表；多个工人同时自动采集时，会重复进行高频全图搜索。
- 新逻辑改为“按需搜索”：
  - 开启自动采集时先搜索自身附近的小范围资源；
  - 找不到再按阶段逐步扩大搜索半径；
  - 找到目标后停止搜索，不在采集过程中持续检索；
  - 采空当前资源点或目标失效后，才重新触发下一轮搜索；
  - 当已经扩到最大搜索半径仍未找到资源时，延长下一次重试等待，避免空转扫描。
- 新增自动采集搜索参数：初始半径、扩圈步长、最大半径、普通重试延迟、最大范围失败后的延迟，便于后续继续调优。

### 修改文件
- `Assets/Scripts/Units/GathererUnit.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 所有玩家工人单位的自动采集性能与目标获取节奏。
- 自动采集按钮点击后的响应方式，以及资源点采空后的续采行为。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 本轮优化优先解决高频持续检索带来的卡顿，还没有做多工人之间的资源点占用协调；如果后续出现大量工人反复抢同一资源点的问题，可以继续在 `FindNearestResourceNode(...)` 上增加“已被过多采集者占用时降权”的策略。

## 2026-05-25 - 自动采集资源点分流与搜索错峰优化

### 修改内容
- 在上一轮自动采集节流基础上，继续优化多工人同时自动采集时的目标分配，减少多个工人反复抢同一个资源点造成的来回抖动和额外搜索开销。
- `ResourceNode` 对外暴露当前激活采集者数量，供自动采集搜索阶段做轻量评分。
- `GathererUnit` 现在在选自动采集目标时，不再只按纯距离排序，而是按“距离 + 拥挤惩罚”评分：
  - 近的资源点仍然优先；
  - 但如果某个点已经有更多采集者，会被适度降权，鼓励工人分散到附近其他可采点。
- 自动采集启用时、以及采空后重新搜索时加入很轻的随机错峰延迟，避免大量工人在同一帧同时重搜。

### 修改文件
- `Assets/Scripts/Core/ResourceNode.cs`
- `Assets/Scripts/Units/GathererUnit.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 多工人自动采集时的资源点分配稳定性。
- 自动采集重搜时的同帧尖峰开销。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前“拥挤惩罚”是轻量软约束，不会完全禁止多个工人采同一点；如果后续想更强地限制同点拥挤，可以继续增加“单资源点最大推荐采集人数”或“同目标锁定时间”的策略。

## 2026-05-25 - 战斗 HUD 刷新节流与事件化优化

### 修改内容
- 检查战斗内 UI 的 `Update` 刷新路径，优先处理没有状态变化也持续写 UI 或扫描层级的热点。
- `GameUI` 不再每帧调用已经禁用内容的 `RefreshCombatSelectionSummary()`，避免持续重复隐藏同一组 UI。
- `GameUI` 的战斗 HUD 显隐与层级射线策略增加缓存：只有显隐变化或 HUD 根首次建立时才重新应用 CanvasGroup 与透明 Graphic 扫描，避免每帧 `GetComponentsInChildren<Graphic>`。
- `SelectionPanel` 的控制编队快捷栏从每帧刷新改为事件/脏标记刷新，并保留 0.5 秒低频兜底，用于覆盖没有专门 UI 事件的单位状态变化。
- 降低建筑详情面板与造兵面板的完整兜底刷新频率，保留队列变化、开始生产、完成生产等事件即时刷新，以及生产进度视觉更新。
- `BattleAlertUI` 减少空状态下的重复写入：根 CanvasGroup 只在游戏状态可见性变化时更新，边缘闪烁/横幅结束后不再每帧重复写 0，空 CombatFeed 直接早退。
- `MinimapUI` 缓存静态标题/图例文本和显隐状态，避免小地图常驻时每帧重复设置文本、CanvasGroup 和射线开关。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Assets/Scripts/UI/MinimapUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 显隐、资源/主 HUD 层级射线策略、选择面板编队快捷栏、建筑详情面板、造兵面板、战斗提示、小地图。
- 降低无事件时的 UI CPU 开销，保留必要的进度条、动画、世界 HUD 和小地图点位刷新。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 本轮是第一批低风险 UI 刷新收口；如果真机仍有卡顿，下一步应结合 Unity Profiler 重点看 `WorldHudManager`、`UnitOverheadUI`、`MinimapUI.RefreshImmediate()`、生产/科技列表重建次数和 Canvas rebuild 峰值。

## 2026-05-25 - 科技建筑内嵌科技页入口修复

### 修改内容
- 修复拥有科技树功能的建筑点击后不显示科技页的问题。
- 统一科技页数据来源：`TechTreePanelUI` 新增公共 `ResolveDisplayableTechs(...)`，优先读取建筑显式 `AvailableTechnologies` 与融合科技；当建筑标记为 `CanResearchTech` 或 `BuildingType.Research` 但显式列表为空时，会从 `Resources/Data` 中按 `TechData.ResearchBuildingType` 兜底解析可显示科技。
- `SelectionPanel` 的内嵌研究卡列表改为使用同一套科技解析规则，避免普通科技建筑被 UI 当作“无研究内容”。
- 建筑信息摘要与建筑 UI 分类同步使用统一科技数量判断，避免详情里不显示“可研究科技”。
- 保持普通战斗 HUD 入口收口到 `SelectionPanel` 内嵌科技页，不恢复旧 `TechTreeRoot` 独立窗口链路。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildingUiUtility.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击研究建筑后的右侧/底部内嵌科技页显示。
- 研究卡列表、建筑详情里的科技摘要、建筑分类与动作描述。
- 兼容只配置 `CanResearchTech` 或 `BuildingType.Research`、但没有直接填 `AvailableTechnologies` 的科技建筑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 兜底解析会按 `TechData.ResearchBuildingType` 显示通用科技；如果某个科技建筑需要更精确的专属科技列表，仍应优先在对应 `BuildingData.AvailableTechnologies` 或阵营同步工具中补显式配置。

## 2026-05-25 - 造兵等待队列显示修复

### 修改内容
- 修复造兵页面生产队列显示不全、后续等待制造项容易看不到的问题。
- `SelectionPanel` 绑定造兵队列固定节点时改为支持深层查找，兼容 `ProductionQueueContent/WaitingQueueViewport/WaitingQueueContent` 的推荐 prefab 结构。
- 造兵队列运行时条目尺寸优先读取 `CurrentProduction` 与 `WaitingQueueContent` 槽位尺寸，避免当前制造卡片宽度覆盖右侧等待队列。
- 提高内嵌造兵页队列 viewport 的运行时兜底高度，避免当前制造和等待队列条目被 56px 高度裁切。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击造兵建筑后的 HUD 内嵌造兵页。
- 当前制造项、后续等待制造队列、队列横向滚动区域。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 如果实机仍有队列项被遮挡，优先检查 `SelectionBuildingProductionPage_Prefab` 中 `CurrentProduction`、`WaitingQueueViewport`、`WaitingQueueContent` 的槽位宽度和 `preservePrefabLayout` 设置。

## 2026-05-25 - 世界血条扣血反馈与战斗表现增强

### 修改内容
- 修复角色/建筑头顶血条容易出现两套的问题：`UnitOverheadUI` 在启用和运行中会清理旧 `UnitOverheadHud`、`HealthBarCanvas`、`CombinedHealthBar` 等遗留子 HUD，避免旧世界空间血条和统一 `WorldHudItem` 同时显示。
- `WorldHudManager` 为每个 HUD 条目记录上一帧血量比例和受击脉冲，掉血时会保留黄色延迟扣血条，并让血条与边框短暂提亮。
- 调整血条层级，让 `HpDelayFill` 位于 `HpFill` 上方，扣血区段不再被当前血条遮住。
- 增强受击闪光反馈：`HitFlashFeedback` 改为更明显的暖色闪烁，持续时间略增、最小间隔降低，连续受击更容易看见。
- 强化伤害跳字可读性：根据伤害强度动态放大字号、加粗描边、提高弹出起点和持续时间，并将击破/暴击/重创标记改成可读中文。

### 修改文件
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Assets/Scripts/Combat/CombatVisualManager.cs`
- `Assets/Scripts/Combat/HitFlashFeedback.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位/建筑头顶血条、扣血延迟条、受击闪光、战斗伤害跳字。
- 统一世界 HUD 管线与旧头顶 HUD 残留清理。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 如果某些单位仍出现两套血条，优先检查该单位视觉 prefab 是否在运行后动态实例化了旧 `UnitOverheadHud_Prefab` 或自带 Canvas；当前运行时会每 1 秒清理一次已知旧 HUD 名称。

## 2026-05-25 - 占位音效与阵营 BGM 配置接入

### 修改内容
- 生成一套运行时可用的占位音频资源，覆盖 UI 点击、确认、取消、错误、页签、单位/建筑选择、移动、攻击、采集、巡逻、建造、造兵入队、研究开始/完成、事件提示、战斗攻击/受击/死亡、技能起手/命中，以及主菜单/战斗/四阵营 BGM。
- 新增 `RuntimeAudioManager`，统一加载 `Resources/Audio/RuntimeAudioLibrary.json`，按 cue id 播放 2D UI/SFX、战斗 fallback 音效和阵营 BGM。
- UI Button 点击音效改为运行时低频自动绑定；按钮名称包含取消、返回、关闭、确认、开始、页签等关键词时会自动选择对应 cue。
- 单位/建筑选择、移动、攻击、采集、巡逻、建筑放置/完成、造兵入队、研究开始/完成、受攻击、资源耗尽、胜利、失败等音效改为事件驱动播放。
- `CombatFeedbackProfile`、`DeathFeedbackUtility`、`UnitSkillController` 保留数据字段优先级，在单位/建筑/技能没有配置专属音效时，改为优先使用运行时占位音效，再退回原本的代码生成音。
- 新增造兵入队和研究开始事件，避免 UI 页面自己承担音效触发。
- 补充音频占位资源和替换规则文档，说明同名替换 `.wav` 或修改 JSON `resourcePath` 的配置方式。

### 修改文件
- `Assets/Scripts/Core/GameManager.cs`
- `Assets/Scripts/Core/GameEvents.cs`
- `Assets/Scripts/Production/ProductionQueue.cs`
- `Assets/Scripts/Technology/ResearchQueue.cs`
- `Assets/Scripts/Combat/CombatFeedbackProfile.cs`
- `Assets/Scripts/Combat/DeathFeedbackUtility.cs`
- `Assets/Scripts/Units/UnitSkillController.cs`
- `Assembly-CSharp.csproj`
- `docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Scripts/Core/RuntimeAudioManager.cs`
- `Assets/Resources/Audio/RuntimeAudioLibrary.json`
- `Assets/Resources/Audio/Placeholders/UI/*.wav`
- `Assets/Resources/Audio/Placeholders/Commands/*.wav`
- `Assets/Resources/Audio/Placeholders/Events/*.wav`
- `Assets/Resources/Audio/Placeholders/Combat/*.wav`
- `Assets/Resources/Audio/Placeholders/BGM/*.wav`
- `docs/features/audio_placeholder_and_replacement_rules.md`

### 影响范围
- 所有战斗内 HUD/Button 点击音效、单位和建筑操作提示、事件提示音、战斗 fallback 音效、技能 fallback 音效、死亡 fallback 音效和阵营 BGM。
- 新增的音频配置不改动现有 `UnitData`、`BuildingData`、`SkillDefinitionData` 的专属音效字段优先级。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 最终音频替换时优先保持同名文件路径，避免改配置；如果要移动到正式音频目录，则同步修改 `RuntimeAudioLibrary.json` 的 `resourcePath`。
- 设置界面的音频滑条还未接入本轮管理器，后续可直接调用 `RuntimeAudioManager` 增加分组音量 API。

## 2026-05-25 - 缺失特效运行时占位表现替换

### 修改内容
- 新增 `RuntimeVfxFactory`，统一负责缺失特效时的运行时占位 VFX。
- 保留现有数据字段优先级：单位攻击/受击/死亡、建筑建造/升级/死亡、技能起手/命中/视觉 prefab 已配置时仍然优先使用正式 prefab。
- 将战斗攻击 fallback 从临时球体/柱体/胶囊替换为粒子冲击、挥砍弧光、投射物核心和拖尾。
- 将单位/建筑死亡 fallback 从临时球体/柱体替换为粒子爆散、冲击环和火花。
- 将建筑建造中/升级中 fallback 从旋转圆柱环替换为循环建造火花、升级能量粒子和环形粒子。
- 将技能起手 fallback 从临时球体脉冲替换为粒子聚能；技能命中 fallback 在原范围提示基础上增加粒子爆发。
- 清理 `CombatVisualManager` 中不再使用的旧临时几何体动画辅助，避免后续误用。
- 新增运行时特效占位与替换规则文档，说明正式特效应通过数据字段配置，不直接改共享 fallback。

### 修改文件
- `Assets/Scripts/Combat/CombatVisualManager.cs`
- `Assets/Scripts/Combat/DeathFeedbackUtility.cs`
- `Assets/Scripts/Units/UnitSkillController.cs`
- `Assets/Scripts/UI/BuildingProductionStatusUI.cs`
- `Assembly-CSharp.csproj`
- `docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Scripts/Combat/RuntimeVfxFactory.cs`
- `docs/features/runtime_vfx_placeholder_rules.md`

### 影响范围
- 单位攻击、投射物、命中、技能起手/命中、单位死亡、建筑死亡、建筑建造中和升级中的缺失特效表现。
- 不影响已经在数据资产中配置好的正式特效 prefab。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 这轮处理的是运行时缺失特效 fallback；如果希望每个阵营/单位都有完全不同的专属表现，应继续把正式 VFX prefab 填入对应 `UnitData`、`BuildingData`、`SkillDefinitionData` 字段。

## 2026-05-25 - 科技树阵营与建筑内容过滤修复

### 修改内容
- 修复科技树面板兜底扫描 `Resources/Data` 时只按 `BuildingType` 过滤的问题，避免研究建筑把其他阵营科技一起显示出来。
- 科技显示入口统一经过当前建筑所属阵营、组合建筑状态、科技阵营标识和生成式科技建筑 token 校验。
- `latest.{faction}.{building}.tech.xx` 这类生成式科技现在必须匹配当前建筑资产名或阵营科技树 entry，才会出现在该建筑科技树中。
- 组合科技仅允许组合建筑显示，普通建筑不再混入 `combo`/`combination` 科技。
- 科技卡、PC 节点、详情标题、研究队列、搜索和排序统一使用科技显示名。
- 中文环境下为部分仍写英文的科技名增加中文兜底，并对阵营生成式科技提供“阵营科技 - 名称”显示 fallback。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中后的科技树面板。
- 选择面板中复用 `TechTreePanelUI.ResolveDisplayableTechs` 的科技列表。
- 科技卡片、详情页标题、研究队列和搜索结果显示。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 如果某个建筑需要显示跨阵营科技，应优先通过组合建筑身份或显式 `BuildingData.AvailableTechnologies` 配置，并确保科技命名/阵营归属清晰。
- 长期建议给 `TechData` 增加显式阵营和中文名字段，减少继续依赖资源名/`techId` 推断。

## 2026-05-25 - 战斗运行时 UI 高频刷新优化

### 修改内容
- 检查战斗内 HUD、世界血条、设置页、音频自动绑定、生产/科技队列和选择面板的高频刷新逻辑。
- `InGameSettingsUI` 不再每帧 `FindFirstObjectByType<GameUI>()`，改为缓存并低频重试。
- `UnitOverheadUI` 移除每个单位/建筑每秒扫描子层级清理旧 HUD 的常驻逻辑，旧 HUD 只在 Awake/OnEnable 时清理。
- 世界 HUD 的建筑生产状态组件改为缓存，减少每次刷新时的 `GetComponent`。
- 世界 HUD 重叠解算增加优先级数量上限，避免大量单位同屏时出现 O(n²) UI 峰值。
- `RuntimeAudioManager` 的 UI Button 自动绑定扫描频率从 0.8 秒放宽到 2.5 秒，降低全场景 Button 扫描成本。
- `BuildingProductionStatusUI` 的空闲状态检查改为低频兜底，生产/研究/建造事件仍然即时刷新。
- 科技队列布局刷新移除全局 `Canvas.ForceUpdateCanvases()`，保留局部 LayoutRebuilder。
- 选择面板的常规兜底刷新间隔放宽，选择/队列/研究事件仍可立即标脏刷新。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Assets/Scripts/Core/RuntimeAudioManager.cs`
- `Assets/Scripts/UI/BuildingProductionStatusUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD、头顶血条、建筑生产/研究状态、科技队列布局、设置入口按钮、UI 点击音效自动绑定和选择面板刷新。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 如果仍然越玩越卡，下一轮应在 Unity Profiler 中重点看 `MinimapUI`、`FogOfWarSystem`、`HighlightSystem`、`GameUI` 和大量单位 AI 的 Update 占比。
- 这轮没有改玩法 Tick，只先处理了明显的运行时 UI/HUD 常驻刷新成本。

## 2026-05-25 - 英雄 HUD 按钮交互修复

### 修改内容
- 修复英雄单位生成后左侧英雄 HUD 按钮显示但点击无反应的问题。
- `HeroHudRowButtonForwarder` 改为直接实现 `IPointerClickHandler`，不再只依赖根 `Button.onClick`。
- 英雄 HUD 行刷新时会重新绑定根按钮和 prefab 子按钮，避免子节点 Button/Image 抢占点击后没有回调。
- 英雄 HUD 刷新时增加在场英雄兜底解析，记录中 `ActiveUnit` 丢失时会按 `UnitData` 从玩家单位列表找回。
- `HeroLifecycleManager` 增加轻量在场英雄重扫入口，避免生产事件错过后英雄按钮没有可操作单位。
- 英雄生命周期的英雄判定收紧为真正英雄、神话单位或组合英雄，避免高级普通单位误进英雄栏。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Core/HeroLifecycleManager.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 左侧英雄 HUD 行。
- 英雄生产完成、英雄复活、英雄按钮选择/连续点击聚焦。
- 英雄生命周期 HUD 数据源。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 如果仍有某个阵营英雄按钮不可用，优先检查对应 `UnitData.Profession` 是否为 `Hero`/`Mythic`，或运行时组合英雄资源名是否包含 `combination_..._hero`。

## 2026-05-25 - 世界 HUD 血条扣血与信息完整性修复

### 修改内容
- 修复世界 HUD 血条扣血视觉不明显的问题，确保 `HpDelayFill` 位于当前血量 `HpFill` 下层，当前血条和边框始终显示在上方。
- 世界 HUD 刷新血量时持续校正血条层级，避免 prefab 或复用池状态导致延迟血条盖住当前血条。
- 为选中单位、建筑、英雄、精英和 Boss 增加基础状态行兜底显示，补充 `HP 当前/最大`、攻击、护甲、射程等核心信息。
- `UnitOverheadUI` 增加世界 HUD 所需的攻击、护甲、射程动态属性出口，统一从单位/建筑运行时属性读取。
- 世界 HUD 注册时触发一次旧运行时头顶 HUD 清理，减少旧血条与 prefab 世界 HUD 同时显示的问题。

### 修改文件
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位/建筑头顶世界 HUD。
- 当前血量、延迟扣血条、受击闪白和边框反馈显示。
- 选中单位/建筑、英雄、精英和 Boss 的基础信息展示。
- 旧式运行时头顶血条的入口式清理。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 若 Unity 实机仍看到双血条，优先检查具体单位/建筑 prefab 是否还有非标准命名的旧 Canvas 血条节点，并补充到 `UnitOverheadUI.ShouldRemoveLegacyHudObject` 规则。
- 本轮没有重建 `WorldHudItem_Prefab`，仅修复 prefab 实例化后的绑定、层级、动态文本和显隐规则。

## 2026-05-26 - 科技树打开与建造放置详情修复

### 修改内容
- 修复科技树入口只关闭不打开的问题，点击有科技树功能的建筑后会重新校验并打开 `TechTreePanelUI`。
- `TechTreeRoot` 曾被 HUD 隐藏逻辑关闭时，科技树打开流程会重新激活 prefab host，避免 CanvasGroup 已打开但 GameObject 仍不可见。
- 建造放置阶段不再创建 `PlacementFoldedBuildPanel_Right` 旧详情面板。
- 建造卡悬停/不可用点击/进入放置后的建筑说明统一走 `OperationDetailOverlayCanvas/OperationDetailCardView`。
- 建造列表不再额外生成 `BuildDetailPanel` 旧详情面板，减少与通用详情卡重复显示。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中后的科技树面板打开/关闭。
- 建造建筑卡片详情展示。
- 建筑预放置阶段确认、取消、旋转按钮与通用建筑信息卡显示。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 若 Unity 实机仍看到 `BuildCommandBar` 或 `BuildDetailPanel`，优先检查对应 prefab 是否有静态激活节点未被运行时隐藏逻辑接管。
- `BuildDevelopmentPanelUI` 中旧 prefab 类型映射仍保留，仅用于兼容已有 prefab/旧命名，不再作为当前放置详情显示入口。

## 2026-05-26 - 建筑放置旧建造面板关闭修复

### 修改内容
- 检查建造放置入口，确认运行时放置流程只通过 `OpenPlacementOverlay` 打开确认/取消/旋转层级，没有继续创建 `PlacementFoldedBuildPanel_Right`。
- 建造放置态打开和重建时强制关闭 `BuildCommandBar`、`BuildCommandBar_PC`、`BuildDetailPanel`、`BuildDetailPanel_PC`、`PlacementFoldedBuildPanel_Right`，避免 prefab 静态子节点被保留后继续显示。
- `CreatePanel` 复用 prefab 子节点时会恢复 active 和 CanvasGroup 交互状态，避免关闭旧节点后影响非放置态建造列表正常显示。
- `BuildDevelopmentRoot_Prefab` 中旧的命令栏、详情面板和折叠放置信息面板默认改为 inactive。
- 同步 prefab 生成器，后续重建 `BuildDevelopmentRoot` 时这些旧节点也默认关闭。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Resources/UI/Prefabs/Pages/BuildDevelopmentRoot_Prefab.prefab`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 点击建筑进入预放置后的建造 HUD 显隐。
- `BuildDevelopmentRoot` prefab 的初始激活状态。
- Editor UI prefab 生成流程。

### 验证方式
- `rg -n -F 'CreatePanel("PlacementFoldedBuildPanel_Right"' Assets/Scripts`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- `UiScreenLayoutConfig.asset` 中仍保留 `PlacementFoldedBuildPanel_Right` 的旧布局项用于兼容旧 prefab 类型映射；当前运行时不再主动创建该面板。

## 2026-05-26 - 建造旧 UI Prefab 清理

### 修改内容
- 删除旧建造菜单、旧建造命令栏、旧建造详情面板和旧放置折叠详情面板 prefab 资源。
- `BuildDevelopmentRoot_Prefab` 中移除 `BuildCommandBar`、`BuildDetailPanel`、`PlacementFoldedBuildPanel_Right` 静态子树，放置态只保留中心引导、确认、取消、旋转和状态提示。
- `UiPrefabType` 保留旧枚举数值但改名为 `Deprecated...` 占位，避免 Unity 序列化数字错位。
- `UiPrefabWorkflowGenerator` 不再生成、注册或布局这些废弃 prefab，并让自动生成数量检查跳过废弃类型，防止 Unity 重新打开后把旧资源补回来。
- `UiPrefabLibrary.asset` 和 `UiScreenLayoutConfig.asset` 移除旧类型条目，避免资源库和布局配置保留无效引用。
- `BuildDevelopmentPanelUI` 中旧节点名仍作为兼容清理名保留，但解析 prefab 类型时只回退到 `GenericPanel`，不再请求旧 UI prefab。

### 修改文件
- `Assets/Scripts/UI/UiPrefabSlot.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Configs/UiPrefabLibrary.asset`
- `Assets/Resources/UI/Configs/UiScreenLayoutConfig.asset`
- `Assets/Resources/UI/Prefabs/Pages/BuildDevelopmentRoot_Prefab.prefab`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造放置 HUD prefab 结构。
- UI prefab 生成器和 UI prefab 资源库。
- 旧 `BuildMenuPanel`、`BuildDevelopmentCommandBar`、`BuildDevelopmentDetailPanel`、`BuildPlacementInfoPanel` 资源引用。

### 验证方式
- `rg --files Assets/Resources/UI/Prefabs | rg "BuildDevelopmentCommandBar|BuildDevelopmentDetailPanel|BuildPlacementInfoPanel|BuildMenuPanel"`
- `rg -n "PrefabType: 2$|PrefabType: 59$|PrefabType: 65$|PrefabType: 66$|SlotId: BuildMenuPanel|SlotId: PlacementFoldedBuildPanel_Right" Assets/Resources/UI/Configs/UiPrefabLibrary.asset Assets/Resources/UI/Configs/UiScreenLayoutConfig.asset`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- `Deprecated...` 枚举项不要删除或重排，只作为旧资源编号占位，避免已有 Unity 序列化资产数值错位。
- 如果后续还要清其它旧 UI prefab，应先确认其 `UiPrefabType` 数值是否被资源序列化引用，再采用同样的废弃占位方式。

## 2026-05-26 - Mobile SystemGroup 清理与预建造按钮恢复

### 修改内容
- 移除 `MobileLayer_TouchControls` 旧 `SystemGroup` 生成逻辑，不再创建或显示 `Close` 系统按钮组，并在运行时清理遗留的 `SystemGroup` / `CloseActionButton`。
- 同步清理 `MobileActionBar_Prefab` 中遗留的 `SystemGroup`、`CloseActionButton` 以及挂在旧系统组下的隐藏 `SettingsActionButton`，避免 prefab 层级残留失效父节点。
- 恢复 `BuildDevelopmentRoot_Prefab` 里的预建造 overlay 固定节点：`CenterGuideText`、`CancelPlacement`、`ConfirmPlacement`、`RotatePlacement`、`PlacementStatus`。
- 修正 `UiPrefabWorkflowGenerator` 对 `BuildDevelopmentRoot` 的生成结果，后续重新生成 prefab 时会保持预建造按钮和状态提示结构完整。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Pages/BuildDevelopmentRoot_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/InGame/MobileActionBar_Prefab.prefab`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 手机端 HUD 右下角旧系统操作组显示逻辑。
- 建筑预建造阶段的确认、取消、旋转和状态提示 UI。
- Editor 侧 UI prefab 重建流程。

### 验证方式
- `rg -n "SystemGroup|CloseActionButton|SettingsActionButton" Assets/Resources/UI/Prefabs/InGame/MobileActionBar_Prefab.prefab`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 现在移动端关闭上下文主要由统一的 prefab/HUD 流程接管，后续如果要恢复独立关闭按钮，应重新设计宿主层级，而不是把 `SystemGroup` 塞回 `MobileActionBar`。
- `BuildDevelopmentPanelUI` 仍保留运行时兜底查找逻辑，但预建造主结构已经回到 prefab 本体，后续优先维护 prefab，不要再只删资源不补宿主槽位。

## 2026-05-26 - 资源反馈迭代异常与建筑状态粒子修复

### 修改内容
- 修复 `GameUI.UpdateResourceHudFeedback()` 在遍历 `resourcePulseTimers` 时直接回写字典导致的 `InvalidOperationException`，改为先复制资源类型快照再更新/移除。
- 修复 `RuntimeVfxFactory.CreateParticleSystem()` 在新建粒子系统后立即修改 duration 触发的 Unity 警告，先显式 `StopEmittingAndClear` 再写入模块参数。
- 调整 `BuildingProductionStatusUI` 的 fallback 建筑状态特效，在施工/升级模式切换时会先清掉旧实例再重建，避免旧循环特效状态串用。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Combat/RuntimeVfxFactory.cs`
- `Assets/Scripts/UI/BuildingProductionStatusUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 顶部资源 HUD 的跳字/高亮反馈刷新。
- 建筑施工与升级状态的运行时粒子特效创建流程。
- 建筑世界 HUD 活动状态表现。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 资源 HUD 的反馈定时器后续如果继续扩展，仍应避免在 `Dictionary` 枚举过程中直接增删改。
- 运行时粒子工厂若以后加入对象池，仍应在复用实例前统一 `StopEmittingAndClear`，避免模块参数与播放态冲突。

## 2026-05-27 - 技能投射物配置扩展

### 修改内容
- 扩展 `SkillDefinitionData`，新增多段 `projectileEmissions` 投射物配置。
- 新增投射物瞄准、发射布局、飞行方式、敌人碰撞、环境碰撞等枚举。
- 支持目标方向/施法者前方/目标位置/锁定目标/随机散射等发射方向。
- 支持单发、扇形、并列、Grid、Ring、随机锥形等多数量布局。
- 支持直线、抛物线、跟踪飞行，以及穿透、首碰销毁、穿透次数后销毁、墙体/障碍碰撞销毁。
- 新增 `SkillProjectileRuntime`，运行时处理投射物移动、碰撞、命中伤害、爆炸范围伤害、伤害跳字、受击反馈和 `DamageResolvedEvent`。
- `UnitSkillController` 接入配置化投射物；伤害技能启用投射物后不再在出手事件立即结算伤害，避免重复伤害。
- 技能编辑器的投射物页显示 `Projectile Emissions / 多段投射物配置`，并增加基础字段校验。
- 新增投射物配置规则文档，说明后续替换 prefab 和配置扩展方式。

### 修改文件
- `Assembly-CSharp.csproj`
- `Assets/Scripts/Data/SkillDefinitionData.cs`
- `Assets/Scripts/Units/UnitSkillController.cs`
- `Assets/Scripts/Editor/SkillEditorWindow.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Scripts/Combat/SkillProjectileRuntime.cs`
- `docs/features/skill_projectile_configuration.md`

### 影响范围
- 单位技能配置资产。
- 角色技能配置工具投射物页。
- 单位技能释放、动画事件、投射物命中、爆炸和伤害表现。
- 旧技能在未配置 `projectileEmissions` 时保持原有即时结算逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 现有技能不会自动生成投射物配置，需要在技能编辑器中逐个补 `projectileEmissions`。
- 若需要投射物碰撞墙体或障碍，必须配置 `environmentMask`；默认不检测环境碰撞，避免误伤性能和地图层级。
- 没有配置投射物 prefab 时会使用运行时占位特效，后续可以逐步替换为正式美术 prefab。
## 2026-05-27 - 技能 Buff 配置扩展

### 修改内容
- 扩展 `SkillDefinitionData`，新增 `buffConfig` 高级 Buff 配置。
- 新增 Buff 刷新规则、触发类型、效果类型和效果目标枚举。
- 支持 Buff 持续时间、无限持续、可驱散标记、叠层、最大层数、重复应用刷新规则。
- 支持间隔触发、受击触发、攻击触发、移动触发、跳跃触发占位、应用触发和到期触发。
- 支持属性修改、回血、回能占位、范围伤害、持续伤害、直接伤害和播放特效等效果节点。
- `UnitSkillController` 的 Buff 状态升级为可执行触发器和效果列表的运行时状态。
- 受击/攻击触发复用 `DamageResolvedEvent`，避免大改攻击系统。
- 技能编辑器 Buff 页显示 `Advanced Buff Config / 完整Buff配置`，并增加高级 Buff 校验。
- 新增 Buff 配置规则文档，说明运行时规则和后续扩展点。

### 修改文件
- `Assets/Scripts/Data/SkillDefinitionData.cs`
- `Assets/Scripts/Units/UnitSkillController.cs`
- `Assets/Scripts/Editor/SkillEditorWindow.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- `docs/features/skill_buff_configuration.md`

### 影响范围
- 单位技能 Buff/Debuff 配置资产。
- 角色技能配置工具 Buff 页。
- 单位 Buff 持续时间、触发器、效果节点和战斗反馈表现。
- 旧 Buff 技能在未开启 `buffConfig.useAdvancedBuff` 时保持旧的单一属性修改逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前项目没有统一能量/法力资源接口，`RestoreEnergy` 已作为配置和特效占位接入；后续补能量系统后可在该效果节点内落地数值回复。
- `OnJump` 已作为配置入口保留；后续如果移动系统暴露跳跃事件，可直接接入同一触发器执行路径。
- 高级 Buff 需要显式开启 `useAdvancedBuff`，否则继续走旧版 `affectedStat/effectValue/duration`。

## 2026-05-27 - 建造造兵科技树页面布局与滚动优化

### 修改内容
- 放大建筑选中右侧内嵌科技树、建造/造兵页面和右侧操作容器，扩大卡片可视区域，减少原先 420 宽窄面板导致的挤压。
- 调整内嵌建造/造兵、科技卡列表和生产/研究队列的 viewport 尺寸、队列位置与 prefab 生成器默认值，后续重建 prefab 时保持新布局。
- 优化建造页、造兵页、科技树页滚动手感：提高滚轮/拖动灵敏度，统一惯性减速，减少 `ContentSizeFitter` 与强制 Canvas 刷新造成的滑动卡顿。
- 放大独立造兵窗口和独立建造窗口的卡片兜底尺寸，科技树研究卡改为更大的自适应列数网格。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/InGame/SelectionPanel_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/InGame/SelectionActionPanel_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/InGame/UnitProductionPanel_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingTechTreePage_Prefab.prefab`

### 新增文件
- 无

### 影响范围
- 建筑选中后的内嵌建造页面、造兵页面、科技树页面。
- 独立建造窗口、独立造兵窗口和独立科技树窗口的卡片尺寸与滚动体验。
- PC 与移动端共用的横向卡片列表、生产队列和研究队列滑动手感。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- Unity 运行态重点验收 16:9、较窄分辨率和移动端横屏下右侧操作容器是否压住左侧信息面板；如需更大面板，建议下一步改为可折叠/分页而不是继续横向扩张。
- 如果仍有个别列表卡顿，下一步应在 Unity Profiler 中确认是否由卡片详情 Tooltip、图标加载或生产/研究状态刷新触发。

## 2026-05-28 - 敌方 AI 建造造兵与进攻链路修复

### 修改内容
- 全面检查敌方 AI 的经济决策、建造、造兵、集结进攻和生产校验链路。
- 修复敌方生产建筑识别过窄的问题：运行时敌营兵营不再只接受 `BarracksData`，可识别各阵营科技树中 `BuildingType.Barracks` 的普通 `BuildingData`。
- 拆分工人生产队列与军事生产队列，避免主基地/工人队列被误计为兵营，导致 AI 误判已有足够军营而不继续补军事建筑。
- 军事队列统计改为只统计能生产 `militaryRoster` 单位的建筑，造兵选择不再被工人生产建筑干扰。
- 攻击波发起门槛改用已规范化的 `minimumArmyBeforeAttack`，避免早期阶段因为重新计算波次目标过高而迟迟不主动进攻。

### 修改文件
- `Assets/Scripts/Core/EnemyFactionController.cs`
- `Assets/Scripts/Core/ModeMapRuntimeGenerator.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 敌方阵营运行时营地生成。
- 敌方 AI 建造兵营、训练工人、训练军事单位、统计军队规模和发起攻击波。
- 多阵营科技树中使用普通 `BuildingData` 表示兵营/军营的生产链路。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 编译仍有第三方示例脚本与旧特效脚本的既有 warning，本次未处理。
- Unity 运行态建议重点观察不同敌方阵营开局 1-3 分钟内是否会补军营、持续造兵并按冷却发起攻击波。

## 2026-05-28 - 敌方 AI 进攻目标二次检查

### 修改内容
- 继续复查敌方 AI 的资源采集、建造施工、生产队列、单位注册、攻击移动和战争迷雾目标选择链路。
- 确认敌方工人会自动按资源缺口选择采集点，施工规则按阵营与可用工人推进，初始与产出单位均会注册到 `UnitManager`。
- 补强攻击波目标选择：当敌方视野内没有玩家建筑/单位时，正式攻击波会使用玩家主基地/最近玩家实体作为推断战略目标，避免只在战略点间侦察而不压向玩家基地。
- 保留战斗寻敌的视野限制；推断目标只用于行军目的地，不让单位隔着战争迷雾直接锁定攻击目标。

### 修改文件
- `Assets/Scripts/Core/EnemyFactionController.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 敌方周期性攻击波目的地选择。
- 敌方在未侦察到玩家基地时的战略推进方向。
- 战争迷雾下的敌方进攻节奏，不影响单兵交战目标校验。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前编译仍有第三方 Fishman 示例脚本和旧特效脚本 warning，非本次 AI 改动引入。
- Unity 运行态建议观察敌方未开视野时是否仍能组织波次向玩家基地推进，接近后再通过正常视野/索敌进入战斗。

## 2026-05-28 - 单位信息页 Buff 显示与详情交互完善

### 修改内容
- 完善单位信息页 Buff 图标条目：显示 Buff 图标、增益/减益/控制/光环标识、剩余时间文本、持续时间进度环和层数角标。
- Buff 持续时间读取兼容旧版技能 duration 与高级 BuffConfig duration / infiniteDuration，常驻效果不再显示错误倒计时。
- Buff 详情页补充高级 Buff 的刷新方式、叠层上限、触发器摘要和效果节点摘要，避免只显示旧版属性修正信息。
- PC 端保留悬浮延迟显示详情；移动端新增手指长按显示详情、松手隐藏、拖动取消，减少误触。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位选中信息页 Buff/状态栏显示。
- Buff 详情浮层内容和 PC/移动端交互。
- 兼容战略光环状态显示，不改变 Buff 运行时结算逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- Unity 运行态建议重点检查不同图标贴图下进度环透明度、移动端长按手感，以及高级 Buff 多效果节点的摘要是否足够策划阅读。
- 当前编译仍有第三方 Fishman 示例脚本和旧特效脚本 warning，非本次 UI 改动引入。
## 2026-05-28 - 建造造兵科技树点击响应修复

### 修改内容
- 全面检查 `SelectionPanel` 内嵌建造页、造兵页、科技树页的按钮生成、事件绑定、页面显隐和 ScrollRect 射线链路。
- 新增运行时 UI 射线归一化：按钮根节点 Graphic 负责接收点击，文本、图标、遮罩、状态层和装饰子图统一不再抢占按钮点击。
- 归一化目录 viewport/content 与右侧页面显示时的射线状态，保留 ScrollRect viewport 接收拖拽/滚轮，避免 prefab 根图层或说明图层盖住卡片。
- 修复嵌套按钮场景的射线处理，生产队列条目中的取消按钮不会被父条目按钮的子图关闭。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造页面建筑卡点击进入放置态。
- 造兵页面单位卡点击加入生产队列。
- 科技树页面科技卡点击开始研究。
- 建造/科技分类 Tab、生产队列取消按钮和相关 ScrollRect 滚动/拖拽命中。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- Unity 运行态建议重点验证：单位选中打开建造页、建筑选中打开造兵页/科技树页后，点击卡片、切换分类、拖动滚动区域和取消队列是否都能响应。
- 后续调整 prefab 时应继续保持“真实交互节点接射线，装饰节点不接射线”的规则，避免透明层再次吞点击。

## 2026-05-28 - 关卡选择与列表界面整理

### 修改内容
- 复查关卡选择页 `LevelSelectPage_Prefab` 绑定链路，运行时隐藏旧版 `Title/Description/UsageNote/LevelList` 等直系残留节点，避免完整 prefab 与旧内容叠层。
- 将竞技设置、生存设置、存档管理、设置 fallback、教程帮助等动态列表统一放入运行时 ScrollRect 内容容器，按累计高度排布行项目，内容超出时可滚动而不是挤压或截断。
- 清理动态列表面板和行 prefab 带出的 `Title/Meta/Description/Icon` 模板子节点，避免旧模板文字/图标在列表界面露出。
- 设置页 prefab 绑定后显式隐藏超出当前数据数量的 `Row_*`，并统一主菜单页面射线归属：按钮和滚动视口接收输入，其它装饰/文本不拦截。
- 更新 prefab 生成器中设置页预置行默认文案，后续重建不再把 `Option/Change` 模板文字作为静态内容带入。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单关卡/副本选择界面。
- 竞技、生存、设置、存档管理、教程帮助等主菜单列表页面。
- 主菜单列表行、存档行和设置页 prefab 后续生成默认内容。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- Unity 运行态建议重点检查：副本选择页是否只剩三张模式卡；竞技/生存设置项是否可滚动且不重叠；存档超过 7 个时是否能继续向下滚；设置页不应显示未绑定的 `Option` 模板行。
- 后续如果把更多主菜单页面完整 prefab 化，应继续保留“页面壳体 prefab，动态列表内容运行时填充并清理模板节点”的规则。

## 2026-05-29 - 建造造兵科技树点击二次修复

### 修改内容
- 复查 `SelectionPanel` 内嵌建造、造兵、科技树目录卡片的按钮创建、状态刷新、成本行动态节点和详情触发器链路。
- 为建造/造兵/科技卡片统一改为显式清理并重新绑定点击事件，避免 prefab 自带事件或重复刷新残留导致点击无效。
- 新增 PC 快捷目录按钮点击转发器，直接兜底触发建造放置、加入生产队列、开始研究，避免 Button.onClick 被子节点射线或详情触发器链路影响。
- 在成本行动态生成和按钮状态刷新后再次归一化按钮射线，确保只有按钮根节点接收点击，成本图标、遮罩、状态文本不抢输入。
- 刷新状态时保持目录卡片可点击，未满足条件时仍能显示失败原因和详情，而不是表现为完全无响应。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造页面建筑卡片点击进入放置态。
- 造兵页面单位卡片点击加入生产队列。
- 科技树页面科技卡片点击开始研究或展示不可研究原因。
- 卡片成本行、锁定/资源不足状态层、详情悬浮/按压提示与点击输入的优先级。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前编译仍有第三方 Fishman 示例脚本和旧特效脚本 warning，非本次 UI 改动引入。
- Unity 运行态建议重点验证：打开建造/造兵/科技树页后点击卡片、点击不可用卡片、切换分类、滚动目录，以及生产队列取消按钮是否都正常响应。

## 2026-05-29 - 关卡选择与列表内容可见性修复

### 修改内容
- 复查主菜单关卡选择页与竞技、生存、存档、设置、教程等动态列表页的 prefab 绑定和运行时排布链路。
- 修复动态列表内容看不到的问题：运行时列表面板、ScrollRect viewport、Content 和行项目不再依赖 prefab 保留布局，统一强制恢复到可见尺寸与顶部顺排位置。
- 为关卡选择页增加可见性兜底：绑定 `LevelSelectPage_Prefab` 后显式恢复根节点、背景、标题、三张模式卡和底部按钮的激活状态与屏幕锚点。
- 为设置页 prefab 固定行增加运行时强制排布，避免旧行位置、0 高度或隐藏状态导致设置项消失。
- 保留旧模板内容清理，但不再让清理逻辑影响当前有效的模式卡、列表行和按钮内容显示。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单副本/关卡选择界面的三模式卡片显示。
- 竞技设置、生存设置、存档管理、设置、教程帮助等列表页的内容可见性与滚动区域。
- 主菜单列表行、按钮、标题文本在 prefab 旧布局下的运行时兜底排布。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前编译仍有第三方 Fishman 示例脚本和旧特效脚本 warning，非本次 UI 改动引入。
- Unity 运行态建议重点检查：副本页是否能看到三张模式卡，竞技/生存/设置列表是否从顶部开始显示并可滚动，存档为空和有存档时是否都有内容。
## 2026-06-03 - 建造造兵科技树图卡布局优化

### 修改内容
- 重做建筑选中内嵌建造、造兵、科技树目录卡片布局，卡片改为大图主视觉，底部半透明信息层显示名称、成本、状态与失败原因。
- 放大 PC 右侧建筑操作页面容器、研究页和生产页尺寸，并按页面宽度动态计算列表 viewport，减少卡片窄小和滚动拥挤。
- 优化独立造兵面板单位卡：单位原画/图标占主要视野，名称、职业、成本、人口/时间和提示信息进入半透明覆盖层。
- 优化独立建造面板建筑卡：建筑图标铺满主体，成本、阶段、状态信息压入底部覆盖层，状态遮罩限制在图片区，不再遮挡文字和点击。
- 优化独立科技树研究卡：科技图标主视觉、底部信息层、右上状态/时间角标和研究进度条统一布局。
- 补强卡片节点递归查找与射线归属，移动到覆盖层后的 Label、CostRow、状态文本仍可刷新，装饰/成本/遮罩不抢按钮点击。
- 同步调整 `UiPrefabWorkflowGenerator` 的单位生产卡默认生成结构，避免后续重建 prefab 回退为旧横条布局。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中后的内嵌建造页、造兵页、科技树页。
- 独立建造窗口、独立造兵窗口、独立科技树窗口的卡片可视性、点击响应和滚动体验。
- PC 与移动端共用的卡片图标、成本、状态、遮罩和详情触发器层级。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- Unity 运行态建议重点验收：造兵卡图片是否足够大、底部半透明文字是否清晰、不可用遮罩是否不盖住信息层，以及建造/造兵/科技卡点击、拖动滚动、悬浮/长按详情是否都正常。
- 当前使用现有图标作为主视觉；如果后续补正式兵种/建筑原画，只需替换数据图标或 catalog 资源即可复用这套布局。

## 2026-06-04 - 建造造兵科技树点击遮挡修复

### 修改内容
- 全面复查建筑选中后的建造、造兵、科技树内嵌页点击链路，定位到右侧旧动作区 `RightActionArea` 会被信息刷新重新激活并可能透明拦截页面卡片点击。
- 将右侧根容器显隐统一为“存在真实右侧页面或 PC 单位命令时才接收射线”，避免空旧 UI 结构继续挡住建造/造兵/科技树卡片。
- 将 PC 单位命令区和建筑内嵌页解耦：单位命令仍使用旧动作区，建筑建造/造兵/科技树/基础操作页走独立页面，不再互相覆盖。
- 调整右侧页面层级刷新，只把当前需要显示的生产页、科技页、基础操作页置顶，避免隐藏页抢层级或射线。
- 复查独立建造、独立造兵、独立科技树和旧建筑详情窗口引用链，暂不删除仍被运行入口引用的旧 UI，优先禁用/关闭其射线和显示干扰。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中后的内嵌造兵页、建造页、科技树页卡片点击。
- PC 单位命令区与建筑右侧页面的显隐、射线拦截和层级。
- 旧独立建造/造兵/科技树窗口与内嵌页面并存时的遮挡风险。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前编译仍有第三方 Fishman 示例脚本和旧特效脚本 warning，非本次 UI 改动引入。
- Unity 运行态建议重点验证：选择工人打开建造页后点击建筑卡、选择生产建筑后点击造兵卡、点击科技卡开始研究、切换分类和滚动时页面不再被透明区域吞点击。
- 旧 UI 结构仍有运行入口引用，本次只处理遮挡和射线问题；后续如要物理删除旧窗口，需要先逐个替换 `GameUI` 中的公开入口。

## 2026-06-04 - 全局 UI 结构视觉优化

### 修改内容
- 新增轻量运行时 UI 视觉工具，统一动态面板、按钮、卡片的信息带、边框、阴影、高光和文字阴影表现，并继续尊重 prefab 的 PreserveLayout / PreserveStyle 规则。
- 升级运行时 fallback 图标生成，从 48px 纯色小图改为 96px 圆角战略图标，包含渐变、内框、纹理、glyph 描边、阴影和高光，改善缺正式原画时的图片观感。
- 优化主菜单、关卡选择和动态列表的运行时兜底视觉，模式卡增加大视觉图层、阵营色光面和更清晰的按钮反馈。
- 优化造兵、建造、科技树独立页面卡片：主图区域增加光面和卡片 chrome，底部半透明信息带更清晰，按钮状态反馈统一。
- 优化建筑选中后的内嵌建造、造兵、科技页：右侧页面和目录卡片统一使用战术面板质感，减少旧式扁平 UI 的割裂感，同时保持点击射线归属在按钮根节点。
- 优化战斗 HUD 资源条等动态面板 atmosphere，让资源 chip 和 tooltip 使用统一边线、阴影和柔光。

### 修改文件
- `Assets/Scripts/UI/UiVisualPolishUtility.cs`
- `Assets/Scripts/UI/RuntimeIconFactory.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assembly-CSharp.csproj`
- `docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Scripts/UI/UiVisualPolishUtility.cs`
- `Assets/Scripts/UI/UiVisualPolishUtility.cs.meta`

### 影响范围
- 主菜单、关卡选择、设置/存档等动态列表页的兜底视觉。
- 战斗 HUD 资源条、资源 tooltip、建筑选中信息面板、内嵌建造/造兵/科技页面。
- 独立建造页面、独立造兵页面、独立科技树页面的动态卡片、按钮和信息带。
- 所有缺正式图标的数据项的运行时 fallback 图标质量。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前没有直接批量改 prefab 静态资源；如果后续要进一步“重做”，建议在 Unity 中基于这套运行时视觉方向继续替换正式兵种/建筑/科技原画。
- 当前编译仍有第三方 Fishman 示例脚本和旧特效脚本 warning，非本次 UI 改动引入。
- Unity 运行态建议重点检查：关卡选择三模式卡是否有大视觉层、建造/造兵/科技卡片文字是否清晰、滚动和点击是否仍正常、缺图标单位/建筑/科技是否显示为新 fallback 图标。

## 2026-06-04 - 建造科技编队点击链路全面修复

### 修改内容
- 强化 `SelectionPanel` 建造、造兵、科技树卡片的射线归属：按钮根节点强制作为 `targetGraphic`，子级文字、图标、信息带、遮罩和运行时装饰层不再抢占点击。
- 将建筑选中后的建造/造兵/科技/建筑操作容器从右侧竖栏改为屏幕中下方横向面板，并在多个页面同时存在时自动分栏，避免页面互相覆盖。
- 去掉右侧页面动画阶段的射线等待阈值，页面显示后立即可点，避免“看得到但点不了”的短暂假死。
- 修复编队条、编队选择弹层和编队管理弹层的按钮射线归一化，确保快捷编队、绑定、定位、重绑、清空等按钮都由按钮根接收点击。
- 收紧全局 HUD 射线策略：透明/装饰 Graphic 不再因为祖先存在事件组件就保留射线，减少旧 UI 层和运行时 chrome 透明遮挡战斗 HUD。
- 为独立建造、造兵、科技树窗口补充统一按钮根射线兜底，并将独立科技树面板收口到屏幕中下方，根宿主不再拦截点击。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/UiVisualPolishUtility.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造页面建筑卡点击进入放置态、造兵页面单位卡加入生产队列、科技树页面科技卡开始研究。
- 建筑选中后的内嵌建造/造兵/科技/基础操作面板位置、分栏、显隐、滚动和点击。
- 编队快捷条、编队选择弹层、编队管理弹层的点击响应。
- 独立建造、独立造兵、独立科技树窗口的按钮点击与宿主遮挡。
- 主 HUD 透明装饰层、运行时 chrome、旧模块宿主对鼠标/触摸射线的影响。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前编译仍有第三方 Fishman 示例脚本和旧特效脚本 warning，非本次 UI 改动引入。
- Unity 运行态建议重点验证：选择工人打开建造页后点击建筑卡、选择生产建筑后点击造兵卡、点击科技卡、点击编队条/编队弹层按钮，以及拖动建造/造兵/科技列表时不会被透明层吞输入。

## 2026-06-05 - 移除旧 MobileActionBar 点击遮挡

### 修改内容
- 移除 MobileActionBar_Prefab / MobileActionButton_Prefab 的资源、Prefab 库配置、布局配置和 MainHudRoot_Prefab 嵌套引用，避免透明旧 UI 挡住建造、造兵、科技树和编队界面点击。
- GameUI 保留运行时保险：如果场景或旧 prefab 中仍出现 MobileActionBar，启动/刷新时立即禁用并销毁，不再创建旧移动动作按钮。
- UiPrefabResolver 为运行时实例添加 UiRuntimePrefabInstance 标记；GameUI.ResolveHudModuleHost 对 HUD 模块优先使用 UiPrefabLibrary 中的新 prefab，并禁用被替换的旧嵌入节点。
- UiPrefabResolver.ShouldPreserveLayout / ShouldPreserveStyle 默认保留运行时实例化 prefab 根节点；带 UiPrefabSlot 的节点仅在 PreservePrefabLayout / PreservePrefabStyle 开启时保留，避免动态列表布局被误锁。
- UiPrefabWorkflowGenerator 将 MobileActionBar / MobileActionButton 标为废弃类型，避免后续生成器重新创建旧 UI。

### 修改文件
- Assets/Scripts/UI/GameUI.cs
- Assets/Scripts/UI/UiPrefabResolver.cs
- Assets/Scripts/UI/UiRuntimePrefabInstance.cs
- Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs
- Assets/Resources/UI/Configs/UiPrefabLibrary.asset
- Assets/Resources/UI/Configs/UiScreenLayoutConfig.asset
- Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab
- Assets/Resources/UI/UiPrefabMigrationReport.txt
- Assembly-CSharp.csproj
- docs/UI/游戏内UI预制体化规范.md
- docs/UI/HUD预制体开发规则.md
- docs/UI/UI预制体重做蓝图.md
- docs/UI/造兵页面UI预制体布局结构说明.md
- docs/UI/建筑选中后的造兵页面UI详细规则文档.md
- docs/05_TASK_LOG.md

### 新增文件
- Assets/Scripts/UI/UiRuntimePrefabInstance.cs
- Assets/Scripts/UI/UiRuntimePrefabInstance.cs.meta

### 影响范围
- 建造页面、造兵页面、科技树页面、编队界面和移动端 HUD 点击遮挡。
- HUD prefab 替换、位置、缩放和 layout preserve 策略。
- UI prefab 生成器和 prefab 库中旧移动动作条资源。

### 验证方式
- `rg -n "MobileActionBar_Prefab|MobileActionButton_Prefab|c87b4d381a0a37344a40852851095782|65e5db72074139647a13e8cff88957b3|PrefabType: 41|PrefabType: 42" Assets/Scripts Assets/Resources docs/UI`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- Unity 运行态重点验收：建造/造兵/科技树/编队按钮能点击，拖动滚动不被透明层吞输入。
- 如需移动端建筑快捷操作，应该在 SelectionPanel 或 MobileUnitActionOverlay 重新设计，不要恢复 MobileActionBar_Prefab。
- 后续调整 UI 位置和缩放优先改 prefab；带 UiPrefabSlot 的根节点默认不会被运行时布局覆盖。

## 2026-06-05 - 竞技选项页面可见性与排版修复

### 修改内容
- 修复竞技/生存设置页动态列表看不到的问题：滚动 viewport 从透明 `Mask` 改为稳定的 `RectMask2D`，避免透明遮罩把选项内容整体裁掉。
- 放大竞技/生存选项面板宽度，减少旧窄面板导致的文字挤压。
- 优化选项行排版为左侧标题、中间当前值、右侧操作按钮，AI 数量和保存名等行同步调整。
- 将竞技/生存设置页 Back 按钮返回副本选择页，而不是直接回主页，减少操作跳转混乱。
- 动态生成的文字和按钮不再被新实例化 prefab 的默认小字号/默认对齐锁死，确保运行时设置项内容清晰可见。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `docs/UI/UI预制体重做蓝图.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单副本入口下的竞技设置页、以及同一动态列表链路上的生存设置页。
- 动态设置列表的滚动裁剪、行间距、行内按钮和文字可读性。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- Unity 运行态重点检查：副本 -> 竞技模式 -> Start 后是否能看到所有选项，滚动是否正常，Change / +/- / Start Battle / Back 是否可点击。
- 如果后续为竞技/生存单独做完整 prefab，应保留 `RectMask2D` 或等价稳定裁剪，不要恢复透明 `Mask`。

## 2026-06-05 - 战争风格 UI 皮肤资源接入

### 修改内容
- 新增 `WarfareClassic` 统一 UI 皮肤贴图，包含石质金边面板、羊皮纸面板、深色按钮、主按钮、信息带、卡片框、圆形命令按钮、选中圆按钮、金色高光框和资源牌。
- `UiVisualPolishUtility` 接入皮肤资源加载，动态面板、按钮、建造/造兵/科技卡片信息带、资源条和移动圆形命令按钮优先使用项目内皮肤 sprite。
- 保留 Prefab 优先规则：Prefab/Inspector 已手动设置 `Image.sprite` 的节点不会被运行时覆盖；保留样式但缺 sprite 的节点只补缺失皮肤。
- 优化顶部资源 HUD 和移动命令按钮视觉，让资源 chip、小图标框、圆形命令按钮更接近参考图的深色金属/金边风格。
- `UiPrefabWorkflowGenerator` 增加 WarfareClassic 默认皮肤路径，后续重建 prefab 时面板、按钮、卡片类节点默认使用统一皮肤，图标、进度条、遮罩等功能节点不套皮肤。
- 更新 UI 规范和重做蓝图，明确后续调整位置/缩放仍以 Prefab 为准，整体风格优先替换皮肤 PNG 或具体 Prefab 图片。

### 修改文件
- `Assets/Scripts/UI/UiVisualPolishUtility.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `docs/UI/游戏内UI预制体化规范.md`
- `docs/UI/UI预制体重做蓝图.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Resources/UI/Skins.meta`
- `Assets/Resources/UI/Skins/WarfareClassic.meta`
- `Assets/Resources/UI/Skins/WarfareClassic/Panel_StoneGold.png`
- `Assets/Resources/UI/Skins/WarfareClassic/Panel_StoneGold.png.meta`
- `Assets/Resources/UI/Skins/WarfareClassic/Panel_Parchment.png`
- `Assets/Resources/UI/Skins/WarfareClassic/Panel_Parchment.png.meta`
- `Assets/Resources/UI/Skins/WarfareClassic/Button_DarkGold.png`
- `Assets/Resources/UI/Skins/WarfareClassic/Button_DarkGold.png.meta`
- `Assets/Resources/UI/Skins/WarfareClassic/Button_PrimaryGold.png`
- `Assets/Resources/UI/Skins/WarfareClassic/Button_PrimaryGold.png.meta`
- `Assets/Resources/UI/Skins/WarfareClassic/InfoBand_DarkGold.png`
- `Assets/Resources/UI/Skins/WarfareClassic/InfoBand_DarkGold.png.meta`
- `Assets/Resources/UI/Skins/WarfareClassic/Card_FrameGold.png`
- `Assets/Resources/UI/Skins/WarfareClassic/Card_FrameGold.png.meta`
- `Assets/Resources/UI/Skins/WarfareClassic/RoundButton_Frame.png`
- `Assets/Resources/UI/Skins/WarfareClassic/RoundButton_Frame.png.meta`
- `Assets/Resources/UI/Skins/WarfareClassic/RoundButton_Selected.png`
- `Assets/Resources/UI/Skins/WarfareClassic/RoundButton_Selected.png.meta`
- `Assets/Resources/UI/Skins/WarfareClassic/Glow_FrameGold.png`
- `Assets/Resources/UI/Skins/WarfareClassic/Glow_FrameGold.png.meta`
- `Assets/Resources/UI/Skins/WarfareClassic/ResourceChip_Gold.png`
- `Assets/Resources/UI/Skins/WarfareClassic/ResourceChip_Gold.png.meta`

### 影响范围
- 主菜单、战斗 HUD、资源条、移动命令按钮、建造/造兵/科技动态卡片、运行时 fallback 面板和按钮的统一视觉表现。
- 后续通过 UI 生成器重建的面板、按钮和卡片 prefab 默认风格。
- Prefab 自定义 sprite、位置、缩放和锚点不会被本次改动强制覆盖。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- Unity 首次打开后需要让新 PNG 完成导入；如果某张图没有按 Sprite 显示，重新导入 `Assets/Resources/UI/Skins/WarfareClassic/`。
- 如果要进一步复刻用户参考图，可继续把用户原始 UI 图片放进项目，然后替换 `WarfareClassic` 同名 PNG，或在具体 Prefab 的 `Image.sprite` 中指定更精细的切片图。
- 运行态建议重点检查资源条、建造/造兵/科技卡片、移动命令按钮和主菜单大面板的颜色层次，以及点击/滚动是否仍正常。

## 2026-06-06 - 游戏内页面安全区与图标统一替换

### 修改内容
- 新增 `UiSafeAreaUtility`，为运行时 HUD/页面提供画布安全区尺寸收束和底部居中停靠能力。
- 修复建造页、造兵页、科技树页、建筑操作页在小屏/移动布局下使用固定 920/1080 宽度和移动端 -390/-780 硬堆叠导致超出屏幕的问题。
- 内嵌建筑页面现在按当前画布自动限制宽高，并只对当前可见页横向分栏，移动端不再把隐藏页排到屏幕外。
- 独立造兵窗口和科技树窗口增加安全区兜底，默认停靠到屏幕中下方并在小窗口/异形屏下自动缩到可见区域内。
- 生成一批 `WarfareClassic` 金边战争风格通用单位、建筑、技能、Buff、科技图标，并接入运行时图标解析。
- 单位图标、建筑图标、技能图标、Buff 图标和科技图标在主要战斗 UI 中优先使用统一风格图标，数据旧图标仅作为兜底。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/RuntimeIconFactory.cs`
- `Assembly-CSharp.csproj`
- `docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Scripts/UI/UiSafeAreaUtility.cs`
- `Assets/Scripts/UI/UiSafeAreaUtility.cs.meta`
- `Assets/Resources/UI/Icons.meta`
- `Assets/Resources/UI/Icons/WarfareClassic.meta`
- `Assets/Resources/UI/Icons/WarfareClassic/*.png`
- `Assets/Resources/UI/Icons/WarfareClassic/*.png.meta`

### 影响范围
- 建筑选中后的内嵌建造、造兵、科技树和建筑操作页面布局、滚动与点击可见区域。
- 独立造兵窗口和科技树窗口在 PC、移动端、小分辨率和安全区屏幕下的位置与尺寸。
- 选择面板、造兵页、建造页、科技树页、移动技能按钮、Buff 条、英雄 HUD、编队/多选头像等主要图标显示。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- Unity 首次打开项目后需要导入 `Assets/Resources/UI/Icons/WarfareClassic/` 下的新 PNG；如果某张图没有显示为 Sprite，重新导入该目录。
- 运行态重点验收 1280x720、移动端横屏和窗口缩放下：打开建造/造兵/科技树/建筑操作页后内容是否都在屏幕内、卡片是否可点击、横向滚动是否顺滑。
- 当前是统一风格通用图标替换；如果后续有更精细的兵种/建筑专属原画，可继续按同名 Resources 规则扩展，而不需要改 UI 布局代码。

## 2026-06-15 - UI 单规则清理与旧保底移除

### 修改内容
- 移除旧 UI 迁移报告资源与生成菜单，避免再次生成旧的双轨迁移说明。
- 清理 `Assembly-CSharp.csproj` 中已删除报告资源引用。
- 收口 UI 规则文档：可见 UI 只允许来自现行 Prefab，`UiPrefabSlot` 作为唯一 Prefab 标记；不再保留 `UiLayoutBinding`、`UiScreenLayoutConfig`、运行时 layout override、preserve 开关、默认 UI 或保底可见 UI 规则。
- 重写 HUD 预制体开发规则，明确建造页、造兵页、科技树、编队、Buff、移动端操作入口都走当前 Prefab/Overlay 体系，不恢复旧移动动作条。
- 更新建造、造兵、科技、图鉴和根架构文档里的旧 fallback / preserve 表述，改为缺失节点只报错、隐藏对应区域或使用非可见逻辑宿主。

### 修改文件
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assembly-CSharp.csproj`
- `docs/01_ARCHITECTURE.md`
- `docs/02_CODING_RULES.md`
- `docs/UI/游戏内UI预制体化规范.md`
- `docs/UI/HUD预制体开发规则.md`
- `docs/UI/UI预制体重做蓝图.md`
- `docs/UI/建造页面UI预制体分类栏补充说明.md`
- `docs/UI/建筑选中后的造兵页面UI详细规则文档.md`
- `docs/UI/科技页面UI预制体布局结构说明.md`
- `docs/UI/造兵页面UI预制体布局结构说明.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 删除文件
- `Assets/Resources/UI/UiPrefabMigrationReport.txt`
- `Assets/Resources/UI/UiPrefabMigrationReport.txt.meta`

### 影响范围
- UI Prefab 生成器菜单、UI 资源引用、HUD/页面开发规则和后续 UI 调整流程。
- 建造页面、造兵页面、科技树页面、编队界面、Buff 详情和移动端操作入口的规则统一。

### 验证方式
- `rg -n "UiLayoutBinding|UiScreenLayoutConfig|UiRuntimeLayoutApplier|UiRuntimePrefabInstance|ShouldPreserveLayout|ShouldPreserveStyle|preservePrefabLayout|preservePrefabStyle|PreservePrefabLayout|PreservePrefabStyle|ApplyConfiguredLayout|UiPrefabMigrationReport|MobileActionBar_Prefab|MobileActionButton_Prefab|PrefabType: 41|PrefabType: 42" Assets/Scripts Assets/Resources/UI docs/UI docs/01_ARCHITECTURE.md docs/02_CODING_RULES.md docs/03_UI_RULES.md docs/04_ASSET_RULES.md Assembly-CSharp.csproj Assembly-CSharp-Editor.csproj`
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 精准残留扫描只剩 `docs/UI/HUD预制体开发规则.md` 中“禁止恢复旧项”和检查命令里的旧关键词，属于主动防回归说明。
- 后续调整 UI 位置、缩放、图片和风格只改对应 Prefab 或 `WarfareClassic` 皮肤资源；不要再添加第二套默认 UI、旧 UI 或运行时可见保底结构。
- Unity 运行态建议重点验收：建造、造兵、科技树、编队、Buff 详情和移动端操作入口是否全部显示在屏幕内且可点击。

## 2026-06-16 - 战斗 HUD 底部布局与点击区域重整

### 修改内容
- 将战斗选择 HUD 收敛为底部信息区 + 底部右侧动作页布局，扩大可视面积并避免建造、造兵、科技、建筑操作页超出屏幕。
- 修复 `SelectionActionPanel_Prefab` 旧的 `590 x 820` 竖向溢出尺寸，统一为 `590 x 374` 底部横向动作容器。
- 同步 `SelectionPanel_Prefab`、`MainHudRoot_Prefab` 和 `UiPrefabWorkflowGenerator`，避免后续重建 prefab 回退到旧布局。
- 调整 `SelectionPanel` 运行时安全区夹取逻辑：Prefab 布局默认保留，仅在越界时夹到画布安全区内。
- 清理 `MainHudRoot_Prefab` 中对 `SelectionPanel` 子树的旧射线覆盖，避免透明容器或错误覆盖影响建造、造兵、科技、编队等按钮点击。
- 修复 UI 生成器 HUD 射线策略，真实 `Selectable` / `ScrollRect` 子节点不再因位于 `SelectionPanel` 下被整体禁用。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/InGame/SelectionPanel_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/InGame/SelectionActionPanel_Prefab.prefab`
- `docs/UI/HUD选择详情模块.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗中选中单位/建筑后的信息面板、技能/命令区、建造页、造兵页、科技树页、建筑操作页、多选条和编队入口。
- HUD 顶部资源/目标提示区域、左下选择区域和右下小地图/预警区域的默认 prefab 重建布局。
- 后续通过 `UiPrefabWorkflowGenerator` 重建 HUD prefab 时的默认尺寸、位置和射线策略。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "UiLayoutBinding|UiScreenLayoutConfig|UiRuntimeLayoutApplier|UiRuntimePrefabInstance|ShouldPreserveLayout|ShouldPreserveStyle|preservePrefabLayout|preservePrefabStyle|ApplyConfiguredLayout|MobileActionBar_Prefab|MobileActionButton_Prefab" Assets/Scripts Assets/Resources/UI docs/UI docs/01_ARCHITECTURE.md docs/02_CODING_RULES.md docs/03_UI_RULES.md docs/04_ASSET_RULES.md Assembly-CSharp.csproj Assembly-CSharp-Editor.csproj`
- `rg -n "GenericPanel|WorldHudItem|世界HUD|Prefab模板|可绑定数据|用途：|类型：" Assets/Resources/UI/Prefabs -g "*.prefab"`
- `rg -n "590f, 820f|1008f, 656f|value: 820|m_SizeDelta: \{x: 590, y: 820\}|MobileActionBar|MobileActionButton" Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs Assets/Scripts/UI/SelectionPanel.cs Assets/Resources/UI/Prefabs docs/UI`

### 后续注意事项
- Unity 运行态重点验收 1280x720、窗口缩放和移动横屏：建造、造兵、科技、建筑操作、编队按钮是否都在底部可见区域内且可点击。
- 如果继续微调 HUD 位置、缩放或图片，优先编辑 `MainHudRoot_Prefab`、`SelectionPanel_Prefab` 和 `SelectionActionPanel_Prefab`；生成器已同步为同一套规则。
- 透明 HUD 容器不要开启 `Image.raycastTarget`；只有按钮、滚动视口、小地图内容和打开状态面板背景应接收射线。
## 2026-06-16 - 全局 UI 悬停点击反馈统一

### 修改内容
- 重写 `UiPressFeedback` 为统一交互反馈状态机，支持 Normal、Hover、Pressed、Selected、Disabled 和 Dragging 状态。
- 修复旧反馈脚本启用后自我禁用导致事件接收不稳定的问题，悬停/点击现在不再依赖额外业务脚本。
- `UiPrefabResolver` 在实例化 Prefab 后会自动为子级 `Selectable` 补齐反馈，覆盖 Button、Toggle、Slider、Dropdown、InputField 等控件。
- 建造、造兵、科技、编队、主菜单、设置和结算等动态按钮统一走 `EnsurePressFeedback`，不再散落直接 `AddComponent<UiPressFeedback>`。
- 新增 `UiMotionConfig` 可调字段：悬停缩放、选中缩放、悬停发光和选中发光；同步现有默认 MotionConfig 资产与 UI Prefab 生成器。
- 反馈组件空闲态会收养外部对颜色、缩放、描边的调整，避免覆盖 Prefab/Inspector 中的位置、缩放、图片和运行时高亮。
- 悬停反馈接入 `RuntimeAudioManager.PlayUi(UiAudioCue.Hover)`，并加全局冷却，避免列表扫过时音效过密。

### 修改文件
- `Assets/Scripts/UI/UiPressFeedback.cs`
- `Assets/Scripts/UI/UiMotionConfig.cs`
- `Assets/Scripts/UI/UiPrefabResolver.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Configs/ButtonMotion_Default.asset`
- `Assets/Resources/UI/Configs/PanelMotion_Default.asset`
- `docs/UI/游戏内UI预制体化规范.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- `docs/UI/UI交互反馈规范.md`

### 影响范围
- 全游戏运行时 UI 的按钮、页签、卡片、滑条、开关、下拉和输入框基础交互反馈。
- 建造页、造兵页、科技树、编队、战斗 HUD、主菜单、副本选择、竞技/生存设置、图鉴和结算页的统一悬停/按下/禁用表现。
- 后续通过 `UiPrefabWorkflowGenerator` 重建的按钮和卡片 prefab 默认使用同一套反馈参数。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "UiLayoutBinding|UiScreenLayoutConfig|UiRuntimeLayoutApplier|UiRuntimePrefabInstance|ShouldPreserveLayout|ShouldPreserveStyle|preservePrefabLayout|preservePrefabStyle|ApplyConfiguredLayout|MobileActionBar_Prefab|MobileActionButton_Prefab" Assets/Scripts Assets/Resources/UI docs/UI docs/01_ARCHITECTURE.md docs/02_CODING_RULES.md docs/03_UI_RULES.md docs/04_ASSET_RULES.md Assembly-CSharp.csproj Assembly-CSharp-Editor.csproj`
- `rg -n "GenericPanel|WorldHudItem|世界HUD|Prefab模板|可绑定数据|用途：|类型：" Assets/Resources/UI/Prefabs -g "*.prefab"`

### 后续注意事项
- Unity 运行态重点验收：建造/造兵/科技/编队按钮悬停有高亮、按下有缩放、禁用状态明显变暗，且点击链路不被反馈组件影响。
- 如果某个 Prefab 需要更强或更弱的手感，优先调整对应 `UiMotionConfig` 或 Prefab Library entry，不要新增第二套按钮反馈脚本。
- 关键词扫描中 `HUD预制体开发规则.md` 的旧 UI 名称属于禁止恢复说明；`GenericPanel_Prefab` 和 `WorldHudItem_Prefab` 命中为资源名/slotId，不是可见模板文案。

## 2026-06-18 - 建造造兵科技卡片可读性与按钮图标重做

### 修改内容
- 优化造兵卡、建造卡和科技卡运行时布局，卡片主视觉区域只放单位/建筑/科技图标，底部半透明信息带显示名称、职业/状态和资源消耗。
- 调整 `SelectionPanel` 内 PC 快捷建造、造兵、科技卡的布局，避免图标覆盖文字，按钮根仍负责点击射线，子级图标/文字不抢点击。
- 同步 `UiPrefabWorkflowGenerator` 中 BuildButton、BuildingProductionButton、ResearchButton、UnitProductionCard 的默认生成尺寸和底部信息带结构，避免后续重建回退到旧小图标布局。
- 重新生成 `WarfareClassic` 风格单位、建筑、科技按钮图标 PNG，保留同名文件和 `.meta`，避免资源引用断裂。
- 确认运行时图标解析优先从 `Resources/UI/Icons/WarfareClassic/` 加载通用单位/建筑/科技图标，再进入程序化兜底。

### 修改文件
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Icons/WarfareClassic/building_defense.png`
- `Assets/Resources/UI/Icons/WarfareClassic/building_military.png`
- `Assets/Resources/UI/Icons/WarfareClassic/building_resource.png`
- `Assets/Resources/UI/Icons/WarfareClassic/building_special.png`
- `Assets/Resources/UI/Icons/WarfareClassic/building_technology.png`
- `Assets/Resources/UI/Icons/WarfareClassic/tech_building.png`
- `Assets/Resources/UI/Icons/WarfareClassic/tech_economy.png`
- `Assets/Resources/UI/Icons/WarfareClassic/tech_faction.png`
- `Assets/Resources/UI/Icons/WarfareClassic/tech_military.png`
- `Assets/Resources/UI/Icons/WarfareClassic/unit_caster.png`
- `Assets/Resources/UI/Icons/WarfareClassic/unit_cavalry.png`
- `Assets/Resources/UI/Icons/WarfareClassic/unit_hero.png`
- `Assets/Resources/UI/Icons/WarfareClassic/unit_infantry.png`
- `Assets/Resources/UI/Icons/WarfareClassic/unit_ranged.png`
- `Assets/Resources/UI/Icons/WarfareClassic/unit_siege.png`
- `Assets/Resources/UI/Icons/WarfareClassic/unit_worker.png`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造页、造兵页、科技树页，以及选中面板内 PC 快捷建造/造兵/科技卡片。
- `WarfareClassic` 通用单位、建筑、科技图标在运行时的显示效果。
- 后续通过 `UiPrefabWorkflowGenerator` 重建相关卡片 prefab 时的默认布局。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "GenericPanel|WorldHudItem|世界HUD|Prefab模板|可绑定数据|用途：|类型：" Assets/Resources/UI/Prefabs -g "*.prefab"`
- 生成并人工查看 `Temp/ui_icon_preview_warfareclassic.png` 图标总览。

### 后续注意事项
- 当前环境没有可用的内置 `image_gen` 工具，图标采用本地 Pillow 绘制强化版；如需真正 AI 写实资产，可在有 `image_gen` 或美术源图环境下替换同名 PNG，`.meta` 保持不变即可。
- 项目声明 Unity 版本为 `6000.0.61f1`，本机仅发现 2021/2023 编辑器；不要用低版本 Unity 批处理保存 Prefab，避免序列化降级。
- Unity 首次打开后需要重新导入 `Assets/Resources/UI/Icons/WarfareClassic/`；运行态重点验收建造、造兵、科技卡片是否都显示“图标 + 底部名字”。

## 2026-06-25 - 全项目 UI 规范化基座重构

### 修改内容
- 根据 `Docs/unity_ui_beauty_layout_docs/` 新增规范，重构运行时 UI 共享基座：Prefab 实例化后统一规范文本、按钮、滚动区和装饰图层的射线行为。
- `UiVisualPolishUtility` 新增 `NormalizeResolvedUiHierarchy`，统一关闭文本/装饰图层 `raycastTarget`、给 ScrollRect 补裁剪、保证 Selectable 根图形接收点击，并为按钮保底 48px 交互热区。
- `UiPrefabResolver` 在所有 prefab 实例化后自动执行 UI 层级规范化，并在按钮实例化时确保按钮根拥有点击射线，减少透明装饰层或子文本抢点击。
- `UiPressFeedback` 和默认 MotionConfig 调整为更克制的 RTS 面板手感：轻微 hover、按下缩放、选中高亮，避免密集操作界面中过度动效抢主视觉焦点。
- `UiPrefabWorkflowGenerator` 保存 prefab 前统一执行生成 UI 规范化，生成器创建的 ScrollRect 视口改用 `RectMask2D`，并按名称/用途收敛默认 raycast 策略。

### 修改文件
- `Assets/Scripts/UI/UiVisualPolishUtility.cs`
- `Assets/Scripts/UI/UiPrefabResolver.cs`
- `Assets/Scripts/UI/UiPressFeedback.cs`
- `Assets/Scripts/UI/UiMotionConfig.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Configs/ButtonMotion_Default.asset`
- `Assets/Resources/UI/Configs/PanelMotion_Default.asset`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单、图鉴、战斗 HUD、选择面板、建造/造兵/科技页面、设置、结算等所有通过 `UiPrefabResolver` 或 `UiPrefabWorkflowGenerator` 创建/实例化的 UI。
- 所有 Button/Toggle/Slider/ScrollRect 等 Selectable/滚动控件的基础点击归属、裁剪和交互反馈。
- 后续通过 `Tools/RTS/UI/Generate Editable UI Prefabs` 或 `Rebuild Modular Screen Prefabs` 重建的 prefab 默认继承新的 UI 规范。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n "GenericPanel|WorldHudItem|世界HUD|Prefab模板|可绑定数据|用途：|类型：" Assets/Resources/UI/Prefabs -g "*.prefab"`
- `rg -n "HoverScale: 1\\.045|PressedScale: 0\\.94|SelectedScale: 1\\.025|HoverGlowAlpha: 0\\.48|SelectedGlowAlpha: 0\\.74|HoverScale = 1\\.045f|PressedScale = 0\\.94f|SelectedScale = 1\\.025f" Assets/Scripts Assets/Resources/UI/Configs -g "*.cs" -g "*.asset"`
- `rg -n "AddComponent<Mask>|showMaskGraphic" Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`

### 后续注意事项
- 当前本机只有 Unity 2021.3.24f1 和 2023.2.13f1，项目版本是 `6000.0.61f1`，因此未用低版本 Unity 批量保存 prefab，避免序列化降级。
- 需要在安装 Unity `6000.0.61f1` 的环境中运行 `Tools/RTS/UI/Rebuild Modular Screen Prefabs` 或 `Tools/RTS/UI/Generate Editable UI Prefabs`，让生成器规范完整落盘到 prefab 资源。
- Unity 运行态重点验收：建造、造兵、科技、图鉴、主菜单和移动端 HUD 中按钮是否可点、滚动区是否裁剪、文本/图标是否不再抢点击。
## 2026-06-27 - 主页面、关卡配置与敌方 AI 发展链路重构

### 修改内容
- 将启动页重做为真正的主页面 + 关卡选择两层菜单，首页可直接切换阵营、查看当前配置、进入关卡或快速开局。
- 为关卡选择页补入三档关卡预设，关卡参数包含资源密度、敌人难度、敌人数量、波次间隔、敌方开局资源和敌方建筑/单位初始配置。
- 敌方 AI 从单纯造兵升级为会经营的对手：增加独立资源池、独立科技池、敌方建造决策、研究决策、生产决策、资源采集和建筑扩张。
- 统一玩家/敌方的训练、研究、战斗倍率与关卡参数读取，降低默认敌方压迫感，同时让关卡难度真正可配。
- 保存/读取补入关卡 preset、敌方资源和敌方科技状态，继续存档时不丢失关卡配置。

### 修改文件
- `index.html`
- `styles.css`
- `game.js`
- `Docs/05_TASK_LOG.md`

### 验证方式
- `node --check game.js`
- 浏览器打开 `http://localhost:4173/`，确认主页、关卡页、开局流程和战斗 HUD 切换正常，控制台无错误
