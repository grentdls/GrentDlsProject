# Task Log

## 2026-08-07 - 修复 HUD Prefab 导入缓存导致的绑定失败

### 修改内容
- 为 `UiPrefabWorkflowGenerator` 增加运行时 HUD Prefab 合约修复入口，编辑器加载后强制重新导入小地图、生产页、目录内容及其嵌套 HUD Prefab。
- 修复入口使用 `PrefabUtility` 确保 `SelectionCatalogContent`、`ProductionQueueContent` 的布局组件和 `MinimapFogOverlay/RawImage` 固定节点存在，并重新导入资源缓存。
- 保留运行时严格 Prefab 绑定策略，不在 `SelectionPanel` 或小地图代码中创建可见替代界面。

### 修改文件
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 当前 Unity 编辑器使用旧 Prefab 导入缓存时，战斗 HUD 小地图和选择面板生产队列的初始化绑定。
- 选中单位或建筑后，`SelectionPanel` 不再因旧导入结构误报而整体禁用；固定详情和操作界面继续来自现有 Prefab。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，保留项目既有 Unity API 弃用警告。
- 静态确认三个 Prefab 合约节点及组件存在，生成器提供 `Tools/RTS/UI/Repair Runtime HUD Prefab Contracts` 菜单入口，并在编辑器非 Play Mode 自动检查导入缓存。
- 当前 Unity 已有进程正在运行，本轮未启动第二个 Unity；停止 Play Mode 后等待脚本编译/资源导入，再进入战斗验证小地图与单位/建筑详情操作面板。

### 后续注意事项
- 若当前编辑器未自动执行修复，可在停止 Play Mode 后执行 `Tools/RTS/UI/Repair Runtime HUD Prefab Contracts`，再重新进入战斗。
- 移动端操作模式和 PC 强制模式配置不受本次修复影响。

## 2026-08-06 - 战斗 HUD 运行时池与小地图缓冲复用

### 修改内容
- 伤害跳字池在 `BattleAlertCanvas` Prefab 成功解析后分帧预热少量 `DamagePopupItem`，并以 0.5 秒间隔重试宿主解析，降低首次连续伤害造成的 Instantiate 峰值且避免常驻查找。
- 删除伤害跳字暴击标记的重复文本写入，保留单一的致死/暴击/重创状态赋值。
- 小地图地形预览按 72/128 分辨率复用 `Color[]` 缓冲，避免每次周期刷新重新分配颜色数组。

### 修改文件
- `Assets/Scripts/Combat/CombatVisualManager.cs`
- `Assets/Scripts/UI/MinimapUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 伤害跳字首次出现和高频命中场景。
- 小地图地形纹理周期刷新与展开/收起分辨率切换。
- 不改变固定可见 UI 的 Prefab 来源；动态跳字和小地图点位仍使用既有允许的运行时内容机制。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`
- 静态确认伤害跳字预热仅调用 `UiPrefabResolver.InstantiateRect`，小地图颜色缓冲仅在分辨率变化时重新分配。
- 上一轮 Unity `RebuildAllBattleHudPrefabs` 已成功更新并校验 86 个战斗 HUD Prefab；本轮因项目已有 Unity 实例持锁未重复启动 batchmode。

### 后续注意事项
- 仍需在 Unity Play Mode/Profiler 中确认不同设备上伤害跳字池大小与小地图刷新耗时；不能仅凭编译结果宣称运行态卡顿已彻底解决。
- 低血量态势目前保留 0.75 秒低频扫描，后续若有统一实体注册/健康事件入口，可再改为事件脏标记维护。

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

## 2026-06-28 - 战斗 HUD 三栏布局与建造放置按钮修复

### 修改内容
- 将选中 HUD 改为底部三栏：左侧单位/建筑详情，中间建造/造兵/科技操作页，右侧单位技能、采集、巡逻、建筑升级、集结点等动作按钮。
- 将编队快捷条布局到详情页上方，避免继续占用底部中间操作页空间。
- `SelectionPanel` 新增中间操作页模式，建造、造兵、科技页同一时间只显示当前页，避免重叠。
- 修复建造放置 overlay 的保活逻辑，进入 `BuildingPlacer.IsPlacing` 后保持 `CancelPlacement`、`ConfirmPlacement`、`RotatePlacement` 可见并可交互。
- 同步 `UiPrefabWorkflowGenerator` 的标准 HUD/选择面板生成尺寸，后续重建 prefab 时生成三栏结构。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `docs/UI/HUD选择详情模块.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 选中单位、选中建筑、多选编队、工人建造、建筑造兵、建筑科技、建筑普通操作和单位操作按钮布局。
- 建造放置过程中的确认、取消、旋转按钮显示和点击链路。
- 后续通过 UI prefab 生成器重建的 `MainHudRoot`、`SelectionPanel`、`SelectionActionPanel`、`SelectionBuildingControlPage` 默认布局。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- `rg -n 'CancelPlacement|ConfirmPlacement|RotatePlacement|PlacementGhostCommandRoot|OpenBuildPlacementOverlay|ShouldKeepBuildPlacementOverlayVisible|EnsureHierarchyVisibleForPlacementOverlay' Assets/Scripts/UI/BuildDevelopmentPanelUI.cs Assets/Scripts/UI/GameUI.cs Assets/Resources/UI/Prefabs -g '*.cs' -g '*.prefab'`
- `rg -n 'GenericPanel|WorldHudItem|世界HUD|Prefab模板|可绑定数据|用途：|类型：' Assets/Resources/UI/Prefabs -g '*.prefab'`

### 后续注意事项
- 当前环境没有项目指定的 Unity `6000.0.61f1`，未用低版本 Unity 批量保存 prefab；运行时布局和生成器已更新，资源落盘重建需在正确 Unity 版本执行。
- `docs/UI/HUD选择动作页模块.md` 存在历史非 UTF-8 字节，本次未用补丁工具直接改写，避免破坏原文编码；新的三栏布局规则已记录到 `docs/UI/HUD选择详情模块.md`。
- Unity 运行态重点验收：选择工人打开建造页、选择建筑切换造兵/科技页、右侧建筑操作按钮、右侧单位技能/采集/巡逻按钮，以及建造放置时确认/取消/旋转按钮是否一直显示。

## 2026-06-29 - AI发育建造与地图关键资源修复

### 修改内容
- 修复敌方工人经济目标只覆盖部分资源的问题，AI 现在会按 `Wood`、`Gold`、`Stone`、`Iron` 的动态需求采集，并用统一资源归一化兼容旧资源节点。
- 强化敌方发育建造链路：AI 建筑实例化后接入 `FactionConstructionController` 和 `FactionConstructionRules.CreateTask(...)`，建造落点同时检查地形和阵营建造规则。
- 扩展敌方建造决策，按难度与攻势阶段补容量、生产、资源、科技、防御建筑，并在缺资源、缺前置建筑、缺前置科技时反向补链。
- 为阵营科技树建筑前置增加专用校验，优先使用 `FactionBuildingEntry.PrerequisiteBuildingIds` 和 `PrerequisiteTechIds`，避免旧 `BuildingData.PrerequisiteBuildingTypes` 与新阵营树重复卡锁。
- 为前置建筑递归解析增加循环保护，避免错误配置形成 A/B 循环时卡住 AI 决策。
- 地图生成和固定地图加载后都会为玩家与敌方出生点补齐关键资源，确保附近至少有木材、金币、石材、铁矿节点。

### 修改文件
- `Assets/Scripts/Units/EnemyWorkerAI.cs`
- `Assets/Scripts/Core/EnemyFactionController.cs`
- `Assets/Scripts/Core/ModeMapRuntimeGenerator.cs`
- `Assets/Scripts/Production/RequirementValidator.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- `docs/features/ai_enemy_development_and_map_resource_safety.md`

### 影响范围
- 敌方 AI 的资源采集、库存目标、建筑建造、前置链路补齐、侦察巡逻和进攻波次准备。
- 程序地图、编辑器生成地图和固定地图进入战斗时的出生点资源安全。
- 建筑建造条件验证，包括阵营科技树建筑和旧非阵营树建筑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `rg -n "RequiredSpawnResourceTypes|EnsureCriticalSpawnResources|TryInstantiateBuilding|AreBuildingPrerequisitesSatisfied|Enemy build prerequisite chain contains a cycle" Assets/Scripts`
- `rg -n "ResourceRuleUtility.NormalizeResourceType\\(node.ResourceType\\)" Assets/Scripts/Units/EnemyWorkerAI.cs Assets/Scripts/Core/ModeMapRuntimeGenerator.cs`

### 后续注意事项
- Unity 运行态重点验收：敌人开局是否采木/金/石/铁，是否按难度补经济和生产建筑，是否能从侦察过渡到攻击玩家。
- 固定地图和随机地图都要检查玩家/敌方出生点附近是否有四类关键资源，避免某个地图资产自身缺资源导致 AI 或玩家卡死。
- 如果仍有某个建筑无法建造，优先检查对应 `FactionTechTreeData` 的 entry id、前置建筑 id、前置科技 id 是否真实存在，避免数据层循环或拼写错误。

## 2026-07-23 - 战斗 HUD 全量预制体重置

### 修改内容
- 将战斗 HUD 收敛到唯一的 `MainHudRoot_Prefab`，固定模块、层级和控制组件均由 Prefab 提供；`GameUI` 不再生成第二份 HUD 根。
- 将资源栏、目标提示、英雄栏、选择栏、建造、科技、设置、小地图、警报、造兵和操作详情的固定结构改为严格 Prefab 绑定；缺少固定节点时记录错误并停用对应模块。
- 设置行与存档行、操作详情标签与章节改为克隆隐藏模板；动态卡片、列表和战斗信息继续从专用 Prefab 实例化。
- 将 `MinimapFogRenderer` 拆分为可序列化的独立组件，`MinimapFogOverlay` 改为 `MinimapMapContent_Prefab` 中固定的 `RawImage`，移除运行时创建雾层。
- 生成器新增根组件、固定节点、滚动区、模板、雾层与控制器校验，并重建验证全部战斗 HUD Prefab。

### 修改文件
- `Assets/Scripts/Core/GameManager.cs`
- `Assets/Scripts/Core/FogOfWarSystem.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/MinimapUI.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/OperationDetailCardView.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Pages/MinimapCanvas_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/InGame/MinimapMapContent_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/` 下由 HUD 生成器重建的战斗模块与组件 Prefab
- `docs/UI/HUD预制体开发规则.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Scripts/Core/MinimapFogRenderer.cs`

### 影响范围
- 战斗进入时的 HUD 根创建、所有固定 HUD 模块的节点绑定、设置和详情动态列表、小地图战争迷雾、科技/建造/造兵/选择操作与战斗警报。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`
- 使用 Unity `6000.0.61f1` 执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs`，日志输出 `All battle HUD prefabs rebuilt and validated. Updated prefab count: 86`。
- 静态扫描固定 HUD 脚本中的实例化与运行时创建调用，确认仅保留小地图点位、科技连接线、动态条目、行为转发器和数据队列等允许项。

### 后续注意事项
- 新增固定战斗 HUD 节点时，必须同时更新 `UiPrefabWorkflowGenerator` 与其验证清单，不能在运行时补建可见节点。
- 小地图雾层节点名 `MinimapFogOverlay` 为固定绑定名，不得重命名或删除。
- 仍需在编辑器 Play Mode 下人工验收 PC 与移动端的选择、建造、科技、设置、小地图和警报完整交互。

## 2026-08-06 - 战斗 HUD 分区刷新与战斗热路径优化

### 修改内容
- 将资源变化从 `GameUI.MarkHudDirty()` 全量刷新改为资源栏即时刷新、选中操作区经济状态脏标记和建造面板合并刷新。
- `SelectionPanel` 增加经济状态局部刷新入口，资源变化不再重建选择详情、英雄栏、生存任务和主面板上下文。
- `ResourceManager.TrySpend` 将一次扣费事务合并为每种资源一次事件，避免重复资源行产生多轮 UI/事件调用。
- `RuntimeStatCollection` 缓存已评估数值，仅在基础值或修正器变化时失效并重算；移除无变化的修正器事件通知。
- `UnitController` 仅在地形移动/视野倍率实际变化时替换地形修正，避免每 0.2 秒重复移除和添加相同 modifier。
- `EventManager` 对单监听器事件走直接调用路径，减少高频事件的监听器数组分配。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/Core/ResourceManager.cs`
- `Assets/Scripts/Stats/RuntimeStatCollection.cs`
- `Assets/Scripts/Units/UnitController.cs`
- `Assets/Scripts/Core/EventManager.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 资源栏、建造/生产/科技操作可用状态、选中面板刷新频率。
- 单位地形属性更新、运行时属性读取和战斗/资源事件分发的运行时开销。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 仍需在 Unity Play Mode 中用 Profiler 对资源扣费、连续攻击、单位跨地形和移动端 HUD 进行基准对比。
- 新增 HUD 资源依赖时应调用局部经济脏标记，不要恢复 `MarkHudDirty()` 全量刷新路径。

## 2026-08-06 - 战斗 HUD 任务列表与小地图刷新继续收敛

### 修改内容
- `SurvivalTaskManager.TasksChanged` 事件改为只标记 HUD 脏状态，避免生存任务计时每帧触发任务卡列表销毁与重建。
- `GameUI` 为生存任务卡增加结构签名和实例缓存：任务增删、分类或状态变化时才重建卡片，计时与进度变化只更新已有卡片文本、背景和领取按钮。
- 生存任务 HUD 更新频率统一为 0.5 秒，保留任务完成/领取等状态变化的及时响应。
- 生存任务面板关闭时暂停隐藏卡片的动态文本刷新，重新打开时再同步当前任务状态。
- 小地图地形纹理改为按 1.2/2.5 秒计时或展开状态变化刷新，不再随单位点位 0.25 秒刷新重复生成像素数组。
- 小地图战略点附近单位统计改用 `UnitManager.GetUnitsForTeam(..., results)` 填充式 API，复用已有列表，减少 GC 分配。
- `AttackManager` 的范围目标查询继续复用填充式单位搜索缓存，降低连续攻击与溅射查询分配。
- 溅射目标列表增加可重入对象池，伤害事件嵌套触发时使用独立借出列表，避免每次范围伤害分配新列表。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/MinimapUI.cs`
- `Assets/Scripts/Core/SurvivalTaskManager.cs`
- `Assets/Scripts/Combat/AttackManager.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 生存模式任务面板的计时、进度、完成和领取状态显示。
- 战斗小地图地形、单位、建筑、资源、战略点和迷雾刷新开销。
- 连续攻击和范围伤害的目标查询临时列表分配。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`：0 错误，8 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`：0 错误，2 个既有警告。
- 静态扫描确认生存任务事件处理器只设置脏标记，资源刷新保持单资源入口，小地图地形纹理不在 0.25 秒点位刷新中重复生成。

### 后续注意事项
- 当前环境未安装项目指定的 Unity `6000.0.61f1`，尚未执行 Unity Play Mode 与 Profiler；需要重点验证生存任务计时、资源连续扣费、连续攻击/溅射、小地图展开、PC 与移动端 HUD 操作。
- 新增任务卡固定结构时必须先更新对应 `SurvivalTaskCard_Prefab`，脚本只允许绑定动态文本、状态和按钮事件。

## 2026-08-06 - 建筑详情 HUD 固定节点预制体化与属性缓存复用

### 修改内容
- `BuildingProductionUI` 只接受带 `UiPrefabSlot` 的建筑详情/生产面板根，并解析固定标题、滚动区、操作区、升级栏、标签和按钮节点；固定节点缺失时记录错误并停用面板。
- 移除建筑详情 HUD 的运行时可见节点创建路径，动态按钮和文本仅通过专用 Prefab 解析器实例化。
- `UiPrefabWorkflowGenerator` 为建筑详情/生产面板补充固定装饰、滚动组件、内容布局、卡片文本、快捷操作槽位和升级栏文本生成逻辑，供正确 Unity 版本重建资源。
- `RuntimeStatCollection` 复用统计键缓存，移除修正器时不再为字典键创建临时列表。

### 修改文件
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Scripts/Stats/RuntimeStatCollection.cs`
- `docs/UI/HUD预制体开发规则.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中后的详情、生产、快捷操作、升级按钮和移动端建筑 HUD 的固定结构来源与缺失资源行为。
- 高频属性修正器移除和清理路径的 GC 分配。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；编译输出包含项目既有 Unity API 弃用等警告。
- `rg -n "new GameObject" Assets/Scripts/UI/BuildingProductionUI.cs`：无运行时可见节点创建调用。
- 编辑器程序集检查受当前 Unity Plastic 依赖缺失影响，`ColorShifter.cs` 的既有 `PlasticGui.Help` 引用无法解析；非本轮代码错误。
- Unity 生成器尝试执行时检测到项目已被其他 Unity 实例打开，未写入 Prefab 资源；需在项目主 Unity `6000.0.61f1` 中执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs`。

### 后续注意事项
- 在正确 Unity 版本执行生成器后，确认 `BuildingProductionPanel_Prefab` 与 `BuildingDetailsPanel_Prefab` 包含 `ScrollRect`、`Viewport/Content`、卡片动态文本、快捷操作槽位、标签和升级栏文本，并重新查看生成器校验日志。
- Play Mode/Profiler 仍需验证建筑详情开关、快捷生产/研究、升级扣费，以及 PC 与移动端 HUD 的布局和射线行为。

## 2026-08-06 - 战斗 HUD 热路径缓存与伤害跳字 Prefab 宿主收口

### 修改内容
- `SelectionPanel` 在无选择上下文时只执行一次隐藏操作；选中恢复后解除隐藏状态，避免每帧重复显隐、按钮状态和动态对象清理。
- `SelectionPanel.RefreshBuffBar()` 复用 Buff 状态 scratch 列表，不再复制 `ActiveBuffs` 集合。
- `GameUI` 复用资源跳字活跃键和过期键列表，避免资源反馈更新期间反复分配临时列表。
- `UnitSkillController` 复用过期 Buff 键、Buff 目标列表和状态快照列表；Buff 治疗、即时伤害、范围伤害及清理路径均在 finally 中归还对象池，支持嵌套伤害事件。
- `CombatVisualManager` 的伤害跳字改为挂载到 `MainHudRoot_Prefab/OverlayLayer_ModalsAndTooltips/BattleAlertCanvas`，缺失时记录错误并停用跳字；移除运行时创建 `DamagePopupOverlayCanvas` 的可见 HUD fallback。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Units/UnitSkillController.cs`
- `Assets/Scripts/Combat/CombatVisualManager.cs`
- `docs/UI/HUD预制体开发规则.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 连续攻击、Buff 触发、资源扣费和选中面板空闲帧的 GC Alloc 与脚本开销。
- 伤害跳字的 HUD 宿主、Prefab 缺失行为以及战斗 Canvas 射线规则。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；编译输出包含项目既有 Unity API 弃用等警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：受既有 `Assets/InfinityPBR/Editor/ColorShifter.cs` 缺失 `PlasticGui.Help` 依赖阻塞。
- 静态检查确认 `CombatVisualManager` 不再创建 `DamagePopupOverlayCanvas`，`SelectionPanel` 与 `GameUI` 不再在对应热点复制 Buff/资源键列表。

### 后续注意事项
- 当前工作区有多个 Unity 进程占用项目，Prefab 生成器尚未重新写入资源；需在项目主 Unity `6000.0.61f1` 释放后执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs`。
- 仍需在 Unity Play Mode/Profiler 中验证连续单体攻击、溅射、Buff、资源跳字、PC/移动端 HUD 的 GC Alloc、Canvas/Layout rebuild 和射线行为。

## 2026-08-06 - 头顶健康 HUD 脏标记与刷新边界收敛

### 修改内容
- `UnitOverheadUI` 订阅单位/建筑 `OnHealthChanged`，记录健康版本号，供 HUD 判断单对象健康脏状态。
- `WorldHudManager` 仅在健康版本变化或受击延迟动画运行时写入健康条，静止健康条跳过填充、颜色和显隐写入。
- 移除头顶 HUD 健康刷新中的每帧层级重排，并缓存屏幕缩放值，降低 Canvas 层级和布局重建。
- 新增战斗 HUD 性能与刷新边界文档，明确单资源、单对象健康、伤害事件和动态条目的刷新契约。

### 修改文件
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Docs/features/战斗HUD性能与刷新规范.md`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Docs/features/战斗HUD性能与刷新规范.md`

### 影响范围
- 单位/建筑头顶血条、受击延迟条、伤害反馈颜色和 HUD 屏幕缩放更新。
- 战斗 HUD 事件刷新契约和后续 Prefab/动态条目开发边界。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有 Unity API 弃用警告。
- 静态检查确认 `WorldHudManager.RefreshHealth` 不再每帧调用 `SetAsFirstSibling`/`SetAsLastSibling`，且健康静止时直接返回。

### 后续注意事项
- 需在正确 Unity 版本的 Play Mode/Profiler 中验证单位移动、连续单体/溅射攻击、治疗、死亡和 PC/移动端头顶 HUD。
- Prefab 生成器仍需在释放项目占用后执行，并确认 `WorldHudItem_Prefab` 的固定节点顺序已写回资源。

## 2026-08-06 - 选中面板健康值局部刷新修正

### 修改内容
- 修正 `SelectionPanel.SetHealthFill`，不再因健康变化销毁血条父节点，只更新已有 Prefab 血条的 `fillAmount`。
- 选中单位/建筑绑定健康事件，健康变化时只更新健康进度条和数值文本，不重建整块选中面板。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端选中面板健康条、健康数值和 Prefab 结构稳定性。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有 Unity API 弃用警告。
- 静态检查确认 `SetHealthFill` 不再调用 `Destroy`，健康事件处理器只访问现有进度行节点。

### 后续注意事项
- 多选组的平均生命值仍应在多选成员集合发生健康变化时补充集合级脏标记；当前事件绑定优先覆盖焦点单位与单选对象。
- 运行时程序集已通过；编辑器程序集仍受既有 Plastic 依赖/中间 DLL 缺失阻塞。尝试用 `G:\\unity\\Editor\\Unity.exe` 执行 Prefab 生成器时，Unity 6000.4 在授权与包初始化阶段退出，关键 Prefab 时间戳未更新，需在项目指定 Unity 版本的正常编辑器会话中重建。

## 2026-08-06 - 伤害事件目标直达与战斗 Feed Prefab 严格绑定

### 修改内容
- `DamageResolvedEvent` 增加运行时来源与目标引用；攻击、技能投射物和 Buff 伤害在发布事件时填充引用。
- `UnitSkillController` 优先使用事件目标/来源引用触发 Buff，只有旧事件没有引用时才回退到位置距离判断，减少无关单位的伤害事件计算。
- `BattleAlertUI` 的战斗 Feed 条目只接受 `CombatFeedEntry_Prefab/Label` 固定节点；缺少 `Image` 或其他必需组件时销毁刚实例化的条目，不创建可见替代节点，也不再运行时改名 `Title`。
- 更新战斗 HUD 性能规范，明确伤害事件的直接对象匹配契约。

### 修改文件
- `Assets/Scripts/Core/GameEvents.cs`
- `Assets/Scripts/Combat/AttackManager.cs`
- `Assets/Scripts/Combat/SkillProjectileRuntime.cs`
- `Assets/Scripts/Units/UnitSkillController.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Docs/features/战斗HUD性能与刷新规范.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 连续单体攻击、溅射、技能投射物和 Buff 伤害的事件订阅扇出，以及战斗 Feed 动态条目的 Prefab 绑定失败行为。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有 Unity API 弃用警告。
- 静态检查确认所有伤害事件发布点填充来源/目标引用，Feed 条目失败路径会销毁实例且不创建运行时可见文本。

### 后续注意事项
- 仍需在项目指定 Unity `6000.0.61f1` 中重建并校验战斗 HUD Prefab，再用 Play Mode/Profiler 验证 GC、Canvas/Layout rebuild、连续攻击/溅射/Buff、治疗/死亡及 PC/移动端射线行为。

## 2026-08-06 - 头顶 HUD 宿主移除运行时 Canvas

### 修改内容
- `WorldHudManager` 改为复用 `MainHudRoot_Prefab/OverlayLayer_ModalsAndTooltips` 作为 `WorldHudItem_Prefab` 的固定宿主。
- 移除运行时创建 `WorldHudCanvas`、CanvasScaler 和覆盖层的路径；主 HUD 或宿主缺失时记录错误并跳过头顶 HUD 注册。

### 修改文件
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Docs/features/战斗HUD性能与刷新规范.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位/建筑头顶血条和状态条的 Canvas 宿主、Prefab 缺失行为以及跨场景 HUD 生命周期。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有 Unity API 弃用警告。
- `rg -n "new GameObject|WorldHudCanvas" Assets/Scripts/UI/WorldHudManager.cs`：不再存在运行时可见 Canvas 创建调用。

### 后续注意事项
- `MainHudRoot_Prefab` 必须保留 `OverlayLayer_ModalsAndTooltips` 层，并在指定 Unity 版本 Play Mode 中确认头顶 HUD 与伤害跳字不会相互遮挡或拦截战场射线。

## 2026-08-06 - 技能呼叫气泡宿主 Prefab 化

### 修改内容
- `SkillCalloutBubbleManager` 改为复用 `MainHudRoot_Prefab/OverlayLayer_ModalsAndTooltips`，技能气泡条目仍通过 `SkillCalloutBubble_Prefab` 对象池实例化。
- 移除运行时创建 `SkillCalloutCanvas` 和 CanvasScaler 的可见 UI 路径；宿主缺失时记录错误并停用气泡显示。

### 修改文件
- `Assets/Scripts/UI/SkillCalloutBubbleManager.cs`
- `Docs/features/战斗HUD性能与刷新规范.md`
- `Docs/UI/HUD预制体开发规则.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 技能释放/被动触发呼叫气泡的 Canvas 宿主、对象池创建和缺失 Prefab 行为。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有 Unity API 弃用警告。
- 静态检查确认 `SkillCalloutBubbleManager` 不再创建运行时可见 Canvas。

### 后续注意事项
- 在指定 Unity 版本中确认技能气泡、头顶 HUD 和伤害跳字共用 Overlay 层时的排序、布局和射线设置。

## 2026-08-06 - 战斗 HUD 刷新收敛与小地图告警对象池

### 修改内容
- 编队快捷栏只在 `groupShortcutDirty` 时重建，不再按固定周期整栏刷新。
- `WorldHudManager` 的头顶 HUD 重叠布局、文本、进度和显隐更新改为脏标记与值变化驱动，静止对象跳过重复写入。
- `MinimapUI` 的告警 Ping 改为复用动态 Image 对象池，过期条目只隐藏不销毁，减少 GC 和 Canvas 层级变化。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Assets/Scripts/UI/MinimapUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 连续战斗时的头顶 HUD 布局、血条和状态文本刷新开销。
- 编队快捷栏和小地图预警的动态对象生命周期与 GC Alloc。
- PC 与移动端共用的战斗 HUD Prefab 宿主和射线边界不变。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有 Unity API 弃用警告。
- 静态扫描确认 `MinimapUI` 告警过期路径不再调用 `Destroy`，战斗 HUD 宿主未新增运行时 Canvas 创建。

### 后续注意事项
- 仍需在项目指定 Unity `6000.0.61f1` 的编辑器会话中执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs`，并在 Play Mode/Profiler 中验证连续攻击、溅射、Buff、治疗、生产/研究、小地图和 PC/移动端射线行为。

## 2026-08-06 - 建筑详情固定组件缺失路径收口

### 修改内容
- `BuildingProductionUI` 移除固定建筑详情面板对 `Image`、`ScrollRect`、布局组件、标题/标签和升级栏的运行时注入路径。
- 建筑详情 Prefab 现在校验固定节点与必要布局组件；缺失时记录错误并让模块保持停用，不执行空对象操作或可见 fallback 创建。
- 动态建筑动作按钮仍通过现有专用按钮 Prefab 实例化，固定宿主与滚动结构继续由 `BuildingProductionPanel_Prefab` 提供。

### 修改文件
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中详情、生产操作栏、升级栏和滚动内容的 Prefab 绑定稳定性。
- 缺失 Prefab 节点时的错误处理与运行时 HUD 结构边界。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留既有 Unity API 弃用警告。
- `rg` 静态扫描确认 `BuildingProductionUI.cs` 不再包含固定 HUD 的 `new GameObject`、`AddComponent<Image/Text/ScrollRect>` 或空对象占位创建。

### 后续注意事项
- 需在指定 Unity `6000.0.61f1` 中打开 `BuildingProductionPanel_Prefab`，确认 `ActionViewport`、`ActionButtons`、`FixedUpgradeBar` 的组件配置满足运行时校验，再进行生产、研究、升级和移动端操作验收。

## 2026-08-06 - 战斗目标查询与资源刷新局部化

### 修改内容
- `UnitController` 的自动目标查询增加 0.15 秒短周期缓存；强制目标仍即时生效，移动、巡逻、死亡和关键战斗属性变化会清空缓存。
- `BuildDevelopmentPanelUI` 收到资源变化时只刷新放置确认状态，不再重建整个固定 HUD Prefab。
- `UnitProductionPanel` 与 `BuildingResearchPanel` 仅在绑定有效队列/建筑时订阅资源事件，解绑或禁用时立即取消订阅。

### 修改文件
- `Assets/Scripts/Units/UnitController.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 多单位战斗中的自动索敌扫描频率与目标有效性。
- 资源扣费事件对建造、生产和研究 HUD 的事件扇出、Canvas 重建和 GC 压力。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有 Unity API 弃用警告。
- 静态检查确认建造放置资源刷新路径不再调用 `Rebuild()`，生产/研究资源监听受绑定状态控制。

### 后续注意事项
- 仍需在 Unity `6000.0.61f1` 中执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs`，并用 Profiler/Play Mode 验证连续攻击、溅射、Buff、治疗、死亡、生产、研究和小地图场景。

## 2026-08-06 - 战斗 HUD 资源事件与目标查询继续收敛

### 修改内容
- `GameUI` 缓存最近渲染的资源值，同一数值事件不重复写入文本、图标、颜色和显隐状态。
- `EnemyAIController` 在单位已有有效自动目标时跳过重复的完整单位/建筑索敌扫描。
- `TowerController` 将领域光环改为持久跟踪范围内建筑，只在进入、离开、等级/配置变化或禁用时更新属性。
- `CombatVisualManager` / `AttackManager` 减少伤害跳字层级重排，并优先读取根 Collider。
- `BuildingProductionUI` 仅在面板打开且绑定有效建筑时监听资源变化。
- `SurvivalTaskManager` 的资源事件只刷新匹配资源类型的库存目标，不再为每个成本项扫描全部任务。
- `UnitSkillController` 的单位范围目标查询复用实例 scratch 列表，避免技能范围效果反复分配临时单位列表。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Units/EnemyAIController.cs`
- `Assets/Scripts/Buildings/TowerController.cs`
- `Assets/Scripts/Combat/CombatVisualManager.cs`
- `Assets/Scripts/Combat/AttackManager.cs`
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/Core/SurvivalTaskManager.cs`
- `Assets/Scripts/Units/UnitSkillController.cs`
- `Assets/InfinityPBR/Editor/ColorShifter.cs`
- `Docs/features/战斗HUD性能与刷新规范.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 资源栏、建造/生产面板、塔防领域光环、连续攻击伤害反馈和生存任务进度事件的运行时刷新与分配开销。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有 Unity/API 弃用警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有 API 弃用和未使用字段警告。
- 静态扫描确认固定战斗 HUD 模块仍只从 `MainHudRoot_Prefab` 和对应组件 Prefab 解析，未恢复固定可见节点 fallback。
- Unity `6000.4.8f1` batch mode 执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs`：成功校验并更新 86 个战斗 HUD Prefab。

### 后续注意事项
- 当前批处理使用项目实际版本 `6000.4.8f1`；尚未完成 Play Mode/Profiler。需在该版本中复核资源连续扣费、连续攻击/溅射、塔防光环、生存任务和 PC/移动端 HUD 射线行为。

## 2026-08-06 - 固定 HUD 文字绑定改为严格 Prefab

### 修改内容
- `BuildDevelopmentPanelUI` 和 `TechTreePanelUI` 的通用文字绑定不再调用 `InstantiateLabel` 创建运行时可见替代节点。
- 建造放置确认、科技树固定标题和动态条目文字缺失时统一记录 Prefab 绑定错误并停用对应模块；动态条目仍通过专用按钮/卡片 Prefab 实例化。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造放置确认层、科技树面板以及其 Prefab 动态按钮/卡片的文字节点绑定边界。
- 缺少固定文字节点时不再生成可见 GenericLabel fallback。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误。
- Unity batch mode `6000.4.8f1` 执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs`：成功校验并更新 86 个战斗 HUD Prefab。
- 静态扫描确认 Minimap 的 `new GameObject` 仅保留动态点位/相机框/告警 Ping，科技树 `new GameObject` 仅保留动态连线；项目存在 `MainScene.unity` 等可执行场景，但本轮未完成 Play Mode/Profiler 自动化验证，未发现专用 HUD 运行态测试入口。

### 后续注意事项
- `ProjectSettings/ProjectVersion.txt` 当前为 Unity `6000.4.8f1`；需在该版本编辑器会话中打开 `MainScene.unity` 或 `Demo.unity`，使用 Play Mode/Profiler 验证连续攻击、溅射、Buff、治疗、生产/研究、小地图和 PC/移动端射线行为。

## 2026-08-06 - 战斗数值事件与 HUD 高频刷新收敛

### 修改内容
- `SelectionPanel` 的研究进度事件改为只更新剩余时间、百分比和进度条，不再在每帧进度通知中重建研究行或强制重建三层布局；生产队列进度也改为数值变化时才写入文本和填充。
- `EventManager` 新增按 `IAttackable` 来源/目标定向分发的伤害事件路由；`UnitSkillController` 的 Buff 监听从全局伤害广播切换为定向监听，保留其它系统所需的全局广播。
- `AttackManager`、`SkillProjectileRuntime` 和 `UnitSkillController` 的四个伤害发布点统一走定向路由。
- `BaseUnit.TakeDamage` 在致死路径交由 `Die()` 发出唯一一次最终血量通知，避免 0 HP 重复刷新选中面板和头顶 HUD。
- `GameUI` 对特殊资源 HUD 文本增加按阵营缓存，`BattleAlertUI` 对态势标题、详情和颜色增加差异判断，避免无变化写入 Canvas。

### 修改文件
- `Assets/Scripts/Core/EventManager.cs`
- `Assets/Scripts/Units/BaseUnit.cs`
- `Assets/Scripts/Units/UnitSkillController.cs`
- `Assets/Scripts/Combat/AttackManager.cs`
- `Assets/Scripts/Combat/SkillProjectileRuntime.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 伤害计算后的事件扇出、Buff 触发过滤、死亡血量事件、研究/生产进度 HUD、特殊资源 HUD 和战斗态势提示的运行时刷新成本。
- 固定 HUD 结构和 Prefab 宿主路径未改变；本次仅收敛事件分发与差异更新。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有 Unity API 弃用警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有编辑器警告。
- Unity `6000.4.8f1` batch mode 执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs`：成功校验并更新 86 个战斗 HUD Prefab。
- 静态扫描确认研究进度处理器不再调用 `ForceRebuildLayoutImmediate`，所有 `DamageResolvedEvent` 发布点使用 `TriggerDamageResolvedEvent`，致死路径仅保留 `Die()` 的最终健康通知，特殊资源文本仅在缓存值变化时写入。

### 后续注意事项
- 尚未完成 Play Mode/Profiler 自动化采样；需在 `MainScene.unity` 或 `Demo.unity` 中验证连续攻击、溅射、Buff、治疗、死亡、研究/生产和 PC/移动端 HUD 交互，并对比 Canvas rebuild、GC Alloc 和事件回调数量。

## 2026-08-06 - 战斗 HUD 查询与建筑面板差异刷新续修

### 修改内容
- `UnitSkillController.ResolveAlliedUnits` 改为复用控制器级查询缓存，使用 `UnitManager.GetUnitsForTeam(team, results)`，移除治疗、盟友 Buff 和自动施法判定中的临时列表分配。
- `BuildingProductionUI` 的固定升级按钮监听仅在绑定建筑或升级/时代推进模式变化时重绑，避免经济状态轮询重复移除并添加监听器。
- `BuildingProductionUI` 的动作按钮保存上次描述，仅在动作类型、可用状态、标签、警告或载荷变化时重新写入按钮视觉和点击回调。
- `BuildDevelopmentPanelUI` 的放置确认视觉、预览命令位置和连续建造 Toggle 继续遵循 Prefab 固定节点边界；缺失固定节点时记录绑定错误并停用，不创建可见 fallback。

### 修改文件
- `Assets/Scripts/Units/UnitSkillController.cs`
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 技能盟友目标查询、建造/生产面板升级状态轮询、动作按钮状态更新和战斗 HUD 建造放置层的运行时分配与 UI 重绘频率。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误；保留项目既有编辑器警告。
- Unity `6000.4.8f1` batch mode 执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs`：日志确认 `Updated prefab count: 86` 和 `Exiting batchmode successfully now!`。
- 静态扫描确认伤害事件发布点均走 `TriggerDamageResolvedEvent`，技能盟友路径不再直接调用返回新列表的 `GetUnitsForTeam(team)`。

### 后续注意事项
- 仍需在 `MainScene.unity` 或 `Demo.unity` 的 Play Mode/Profiler 中采样 Canvas rebuild、GC Alloc、伤害事件回调和 PC/移动端 HUD 交互；本轮没有把未经运行态证据的性能结论扩大为全链路完成。

## 2026-08-06 - 战斗 HUD Prefab 化与数值刷新性能续修

### 修改内容
- `UnitManager`、`BuildingManager` 增加按阵营分组缓存，注册、注销和运行时换阵营时同步维护；战斗索敌、范围查询、技能范围 Buff、炮塔领域和存活计数复用分组数据。
- `BaseUnit.SetTeam`、`BaseBuilding.SetTeam` 增加阵营分组变更通知，保留原有视觉和 Modifier 刷新逻辑。
- `AttackManager`、`SkillProjectileRuntime`、`UnitSkillController` 的建筑目标查询改用按阵营缓存；墙体邻接和科技树前置建筑查询不再扫描全部建筑。
- 研究卡片、生产卡片、生产状态和生产分类页签增加状态/文本差异判断，避免经济或进度变化导致整套卡片视觉重复写入。
- 世界 HUD 在单次内容刷新内缓存机械改造状态和阵营状态，减少重复组件查询、字符串构建和进度计算。
- 执行战斗 HUD Prefab 全量生成与校验，保持固定可见 UI 由现行 Prefab 提供，缺失固定节点仅记录错误并停用对应模块。

### 修改文件
- `Assets/Scripts/Units/UnitManager.cs`
- `Assets/Scripts/Units/BaseUnit.cs`
- `Assets/Scripts/Units/UnitSkillController.cs`
- `Assets/Scripts/Buildings/BuildingManager.cs`
- `Assets/Scripts/Buildings/BaseBuilding.cs`
- `Assets/Scripts/Buildings/TowerController.cs`
- `Assets/Scripts/Buildings/WallSegment.cs`
- `Assets/Scripts/Combat/AttackManager.cs`
- `Assets/Scripts/Combat/SkillProjectileRuntime.cs`
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗伤害事件扇出、单位/建筑目标筛选、技能范围处理、研究/生产 HUD、世界头顶 HUD 和 Prefab 固定节点绑定。
- 未改变公开业务接口和现行 Prefab 资源路径；动态小地图点位、科技连线、世界 HUD 和伤害跳字仍按规则保留为动态对象。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误。
- Unity `6000.4.8f1` batch mode 执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs`：日志确认 `All battle HUD prefabs rebuilt and validated. Updated prefab count: 86`，并正常退出。
- 静态扫描确认战斗模块不再直接调用 `GetAllBuildings()`，伤害发布点统一使用 `TriggerDamageResolvedEvent`；HUD 规则扫描未发现旧 layout override 代码。

### 后续注意事项
- 尚未完成 Play Mode/Profiler 运行态采样；仍需在 `MainScene.unity` 或 `Demo.unity` 验证连续攻击、溅射、Buff、治疗、死亡、生产/研究、阵营切换及 PC/移动端 HUD 交互，并记录 Canvas rebuild、GC Alloc 和事件回调数量。

## 2026-08-06 - 战斗 HUD Prefab 批处理与结算页 fallback 清理

### 修改内容
- 修复 `UiPrefabWorkflowGenerator` 对战斗 HUD 根节点重复添加 `CanvasGroup` 的批处理错误，统一复用已有组件。
- `MatchSettlementUI` 的结算壳、动态面板、文本、按钮、滚动容器和图标全部改为严格依赖 Prefab；Prefab/固定节点缺失时只记录错误并跳过，不创建可见运行时 fallback。
- 结算滚动区域只使用预制体自带的 `Image`、`ScrollRect` 和 `Content`，不再运行时创建 Scrollbar、Handle、Mask 或边框对象。
- 复核健康事件、选中面板健康节点缓存、世界 HUD 内容跳过、共享状态 Sprite 和局部差异刷新链路。

### 修改文件
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Assets/Scripts/Units/BaseUnit.cs`
- `Assets/Scripts/Buildings/BaseBuilding.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Assets/Scripts/UI/BuildingProductionStatusUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD Prefab 批处理稳定性、结算页可见 UI 来源、伤害/治疗后的健康通知、选中单位健康条、世界头顶 HUD 和状态图标刷新成本。
- 运行时仍允许创建非可见逻辑宿主 Canvas/Manager；固定可见节点缺失时不会被代码补建。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，保留项目既有 Unity API 警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，保留项目既有编辑器警告。
- Unity `6000.4.8f1` batch mode 执行 `RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildAllBattleHudPrefabs`：日志确认 `All battle HUD prefabs rebuilt and validated. Updated prefab count: 86` 与 `Exiting batchmode successfully now!`。
- 静态扫描确认结算页和战斗 HUD 相关可见创建路径不再使用缺失节点 fallback；伤害发布点统一使用 `TriggerDamageResolvedEvent`。

### 后续注意事项
- 尚未完成 Play Mode/Profiler 运行态采样；不能仅凭静态检查声称卡顿已彻底消除。仍需记录连续攻击、溅射、Buff、治疗、死亡、生产/研究和 PC/移动端交互下的 GC Alloc、Canvas rebuild、事件回调数量和帧率。

## 2026-08-07 - 战斗 HUD 资源事件过滤与动作描述复用

### 修改内容
- 生产、研究和建筑详情面板按 `ResourceChangedEvent.ResourceType` 过滤无关资源事件，避免每次资源变化都遍历整套卡片状态。
- 保留 `MarkEconomyStateDirty()` 的强制刷新语义，用于容量、阵营、队列等非资源依赖状态变化。
- 为 `BuildingUiUtility.BuildActionDescriptors` 增加调用方提供列表的重载，建筑详情面板复用动作描述和过滤结果 scratch 列表，减少经济状态刷新时的临时分配。
- 固定 HUD 结构、Prefab 宿主路径和动态 UI 例外规则未改变。

### 修改文件
- `Assets/Scripts/UI/BuildingUiUtility.cs`
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑生产/升级快捷操作、单位生产卡、科技研究卡的资源变化刷新成本和 GC 分配。
- 不改变公开旧重载接口；固定可见 HUD 仍全部由现有 Prefab 提供。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，保留项目既有 Unity API 弃用警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，保留项目既有编辑器警告。
- 静态扫描确认资源事件处理器使用资源类型依赖过滤，建筑动作刷新调用 caller-owned scratch 列表。
- 静态扫描确认世界 HUD 默认状态图标读取 `WorldHudItem_Prefab/StatusIcon` Sprite，不再创建运行时纹理。
- Unity 当前仍有运行中的编辑器进程和 `Temp/UnityLockfile`，本轮未启动第二个 Unity；上轮已完成 86 个战斗 HUD Prefab 重建与校验。

### 后续注意事项
- 尚未完成 Play Mode/Profiler 运行态采样；仍需在连续攻击、溅射、Buff、治疗、死亡、生产/研究以及 PC/移动端交互下记录 GC Alloc、Canvas rebuild、事件回调数量和帧率。

## 2026-08-07 - 修复战斗启动科技树面板遮挡

### 修改内容
- 将 `TechTreeRoot_Prefab` 根节点默认状态改为 inactive，CanvasGroup 默认 alpha/interactable/blocksRaycasts 全部关闭，科技树不再在进入战斗时覆盖战场。
- `GameUI.EnsureAdvancedPanels()` 在当前主面板不是科技树时强制关闭 `TechTreePanelUI`，防止旧场景状态或初始化顺序重新显示大面板。
- 保留 `TechTreePanelUI.Open()` 作为唯一显式打开入口，打开时仍使用现有科技树 Prefab 和固定节点绑定。

### 修改文件
- `Assets/Resources/UI/Prefabs/Pages/TechTreeRoot_Prefab.prefab`
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗开始时的科技树 HUD 显隐、射线拦截和主面板状态同步。
- 不改变科技树数据、研究逻辑、Prefab 节点结构或打开科技树的业务入口。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，保留项目既有编辑器警告。
- 静态确认 `TechTreeRoot_Prefab` 根节点为 `m_IsActive: 0`，CanvasGroup 为隐藏且不可交互；旧 `TechTreePanel_Prefab` 无运行时代码实例化路径。
- 当前 Unity 已有进程持有 `Temp/UnityLockfile`，本轮未启动第二个 Unity；需要在现有编辑器中重新导入 Prefab 后进入战斗确认视觉结果。

### 后续注意事项
- 仍需在 `MainScene.unity` 或 `Demo.unity` Play Mode 中确认进入战斗首帧不再出现大科技树，并测试从建筑详情正常打开、关闭和返回科技树。

## 2026-08-07 - 修复科技树初始化误激活与子节点宿主报错

### 修改内容
- 移除 `GameUI` 对 `TechTreePanel` 子节点的独立宿主隐藏和重挂逻辑；只由 `TechTreeRoot` 统一控制科技树窗口。
- `TechTreePanelUI` 的关闭和初始化流程改为不激活隐藏根节点，关闭时停用 `TechTreeRoot`，仅 `Open()` 显式激活并显示科技树。
- 保留科技树根 Prefab 的 inactive、透明、不可交互默认状态，避免战斗首帧覆盖战场。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗启动时科技树旧独立窗口的显隐、CanvasGroup 射线状态和初始化顺序。
- 消除 `HUD Prefab 'TechTreePanel' is missing its required CanvasGroup component` 错误；不改变 SelectionPanel 内嵌科技页及科技树数据逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，保留项目既有 Unity API 警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误。
- 静态确认 `HideAdvancedHudModuleHosts()` 只处理 `TechTreeRoot`，`TryUseHudPrefabRoot(false)` 不会激活根节点，`Close()` 会停用根节点。

### 后续注意事项
- 仍需在 Unity `6000.4.8f1` Play Mode 中确认战斗首帧科技树不可见、战场点击不被拦截，并从建筑详情打开后能正常关闭返回。

## 2026-08-07 - PC 操作模式固定与小地图/生产队列 Prefab 报错修复

### 修改内容
- 新增 PC 调试强制开关并默认启用，PC 编辑器/桌面运行时优先解析为 PC 操作，覆盖已保存的移动端设置；关闭鼠标模拟触摸和 PC 移动性能预算。
- 小地图雾层解析支持嵌套 Prefab 子树查找 `MinimapFogOverlay`，仍只接受 Prefab 中的 `RawImage` 节点，不创建运行时可见替代节点。
- 修正生产队列 Prefab 生成逻辑，不再删除 `ProductionQueueContent` 的 `HorizontalLayoutGroup` 与 `ContentSizeFitter`，并补齐当前生产页 Prefab 的两个组件。

### 修改文件
- `Assets/Scripts/Core/ControlSchemeManager.cs`
- `Assets/Resources/ControlSchemeDebugConfig.json`
- `Assets/Scripts/Core/MinimapFogRenderer.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 编辑器/桌面端的 HUD 布局、鼠标输入、快捷键和控制面板选择。
- 战斗 HUD 小地图战争迷雾渲染初始化。
- 选中面板生产队列的水平布局和内容尺寸计算。
- 移动端运行时仍按 Android/iOS 平台解析为 Mobile；移动端调试开关仍保留，可通过配置关闭 PC 强制覆盖后使用。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，保留既有 Unity API 警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，保留既有编辑器警告。
- 静态确认 `ControlSchemeDebugConfig.json` 已启用 PC 强制模式，`MinimapMapContent_Prefab` 含 `MinimapFogOverlay`/`RawImage`，`ProductionQueueContent` 含 `HorizontalLayoutGroup`/`ContentSizeFitter`。
- 当前 Unity 编辑器仍持有项目锁，本轮未启动第二个 Unity 进程；需在现有编辑器重新导入资源并进入战斗确认运行态日志与 PC 交互。

### 后续注意事项
- 如需在 PC 上预览移动端 UI，将 `ForcePcOnPc` 改为 `false`，再按需打开移动布局/控制调试开关。
- 运行态仍需验证小地图迷雾、生产队列和选择面板在 PC 战斗流程中无新增 Prefab 绑定错误。

## 2026-08-09 - 战斗 HUD 面板入口与生产窗口状态优化

### 修改内容
- 修复建造面板入口只刷新状态、不打开页面的问题；PC 快捷键 `B` 现在支持打开/关闭建造页。
- 修复生产面板入口未绑定并打开 `BuildingUnitProductionWindowUI` 的问题，并使生产面板与建造/科技面板互斥切换。
- 将高级面板初始化与主动关闭逻辑分离，避免资源刷新、重新绑定选中对象时意外关闭当前生产/详情窗口。
- 为嵌入式建造/生产/科技操作区补充默认操作提示，并保留悬停提示转发入口。
- 清理建造、生产、研究以及兽族/自然目标选择反馈中的乱码提示，统一为可读中文状态文案。
- 暂停菜单仅在生存模式显示保存/读档入口，并为保存 API 增加模式保护，避免竞技/战役模式调用生存存档系统。
- 修复主菜单 `Exit Game` 只记录日志、不退出正式包的问题；编辑器保留日志行为，正式包调用 `Application.Quit()`。
- 生产窗口 Prefab 默认隐藏、不可交互；打开时才激活根节点，避免战斗开始时覆盖战场或拦截点击。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 战斗 HUD 的建造快捷键、嵌入式操作页、生产窗口和面板互斥状态。
- 生产窗口的 Prefab 默认显隐、CanvasGroup 输入拦截和打开时的生命周期。
- 选中建筑/单位后的 PC 操作提示；移动端继续复用现有 SelectionPanel 状态，不新增第二套 UI。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，12 个既有警告。
- 静态确认 `MainHudRoot_Prefab/BuildingUnitProductionWindow` 默认 `m_IsActive: 0`，其 CanvasGroup 默认不交互且不拦截射线。
- 当前 Unity 编辑器已有 `G:\TestProject\TestRTS2` 实例并持有项目锁，本轮未启动第二个 Unity 进程；PlayMode 与 Prefab 生成器验证需在现有编辑器中执行。

### 后续注意事项
- 在 Unity PlayMode 依次验证：选中建造单位按 `B` 打开/关闭建造页、选中生产建筑打开生产页、切换科技页后返回详情、资源变化时当前面板保持不被意外关闭。
- 继续清理主菜单缺失页面 Prefab 的运行时可见兜底，并在 Unity 空闲后重建/校验对应页面 Prefab。

## 2026-08-09 - 全局界面逻辑与页面兜底收敛

### 修改内容
- 主菜单主页、副本选择、设置和图鉴页改为严格依赖对应 Prefab；Prefab 或关键节点缺失时记录错误并隐藏页面，不再生成可见运行时备用布局。
- 图鉴页移除缺失节点时的可见面板/列表内容兜底，避免同一页面出现第二套结构。
- 资源、计时等 HUD 重刷新不再强制关闭当前建造/生产/科技面板；仅当面板对应建筑失效时自动关闭。
- 主菜单继续存档在无存档系统或无存档时统一进入生存设置页；存档管理页不再显示无法在主菜单执行的“手动保存”按钮。
- 暂停菜单隐藏未实现的图形/音频入口，并移除没有可配置内容的 Groups 设置页签。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单页面绑定、设置/图鉴入口、存档入口和页面异常保护。
- 战斗 HUD 高级面板在资源刷新、建筑失效和选择上下文变化时的生命周期。
- PC 与移动端暂停设置的可见选项数量和操作路径；未改变已验证的输入设置数据结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，12 个既有编辑器警告。
- 静态确认主页、副本选择、图鉴、设置和结算 Prefab 均包含代码要求的关键节点；MainHudRoot 七层名称按现有 HUD 规范复核通过。
- 当前 Unity 编辑器仍持有项目锁，尚未完成 PlayMode 页面跳转、移动端布局和战斗点击回归。

### 后续注意事项
- 在现有 Unity 编辑器中进入 PlayMode，验证主页/副本/设置/图鉴页面切换、继续存档无存档分支、资源刷新保持高级面板，以及移动端六个有效设置页签的布局。

## 2026-08-09 - 加载界面 Prefab 绑定收敛

### 修改内容
- 加载界面改为使用现有 `LoadingScreen_Prefab` 的完整布局，不再在运行时创建备用背景、标题或详情控件。
- 详情文本按实际内容显隐，避免空详情占位和加载层样式跳变。
- Prefab 或关键文本节点缺失时记录错误并禁用加载界面。

### 修改文件
- `Assets/Scripts/UI/LoadingScreenUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 场景切换、战斗加载和其他使用全局加载遮罩的流程。
- 加载界面的视觉结构、输入拦截和异常保护。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，0 个警告。
- 静态确认 `LoadingScreen_Prefab` 绑定 `Title` 与 `Description` 节点；Unity 编辑器仍持有项目锁，PlayMode 视觉回归待在现有编辑器中执行。

### 后续注意事项
- Unity 空闲后验证加载界面显示/隐藏、带详情与无详情两种状态，以及加载时不误触战场的输入拦截。

## 2026-08-09 - 全局 HUD 异常隔离与选择面板交互文案优化

### 修改内容
- 图鉴卡片、详情弹层和列表滚动容器改为严格使用现有 Prefab；缺少固定结构时禁用图鉴页，不再生成可见运行时备用结构。
- 战斗预警 HUD 增加固定边缘节点、标题/副标题、战斗状态和消息列表的完整绑定校验；绑定失败时整块隐藏并关闭交互，避免半初始化残留。
- 选择面板的兽族突变/吞噬、机械改造、技能目标与范围、单位战术定位、属性修正和操作详情改为可读的上下文说明。
- 清理重复写入的乱码提示，并修复自动采集、兽族目标选择、自然融合和机械改造等移动/PC 操作反馈文案。
- 修复建造旋转、机械主城改造槽、生产阵营徽标等直接可见的状态文案。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 图鉴页缺失 Prefab 结构时的错误隔离与页面可用性。
- 战斗预警、选择面板、建造/生产操作提示和移动端上下文反馈。
- 不改变战斗数据、生产队列、科技研究和存档数据结构；动态数据仍由现有控制器绑定。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，12 个警告。
- 静态确认图鉴关键 Prefab 节点、战斗预警固定节点、HUD 层级和默认射线策略；确认图鉴固定结构不再添加运行时 `ScrollRect`/可见面板兜底。
- 当前 TestRTS2 Unity 编辑器进程仍持有 `Temp/UnityLockfile`，未启动第二个实例；PlayMode、分辨率切换和移动设备触控回归仍待在现有编辑器中执行。

### 后续注意事项
- 在现有 Unity 编辑器进入 PlayMode，依次验证图鉴卡片/详情、战斗预警触发、选择单位后的兽族/机械/自然操作、建造放置旋转与取消，以及暂停/结算页反复打开关闭。
- 需要补充真实分辨率下的 PC、窄屏移动布局和输入穿透检查；当前证据等级为编译 + 静态检查，不能替代视觉验收。

## 2026-08-09 - 高频操作界面文案与空数据分支收敛

### 修改内容
- 建造放置的取消、确认、更换建筑和连续建造状态改为本地化文本；自然共鸣、俘获入口和承载建筑提示统一可读。
- 生产卡修复单位数据为空时的空引用分支，统一组合单位、俘获阵营来源和无可生产单位提示。
- 编队栏移动端槽位提示、机械改造进行中/空列表提示、移动技能状态改为本地化文本。
- 科技树 PC 入口的可研究筛选、重置视图和交互说明移除英文硬编码并补齐语言表。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造放置、单位生产、科技树、编队、机械改造、移动技能状态和结算统计反馈；不改变战斗、生产、研究、结算数据结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，12 个既有编辑器警告。
- 静态确认结算页统计标题、动态指标、空数据提示和单位/建筑类型标签均走本地化键；同时复核固定 HUD、战斗预警、图鉴和 WorldHudItem Prefab 绑定未被改动。
- Unity 编辑器仍持有项目锁，不启动第二个实例；PlayMode、分辨率和触控视觉回归仍需在现有编辑器中执行。

### 后续注意事项
- 进入现有 Unity 编辑器后重点检查窄屏下放置按钮、连续建造开关、科技树筛选和生产空列表的换行与点击区域。

## 2026-08-09 - PC 快捷操作状态与队列反馈逻辑收敛

### 修改内容
- 修复 PC 快捷生产/研究入口重复覆盖反馈的问题，保持生产队列真实入队与研究只启动一次。
- 建造/生产/研究快捷入口切换到可读实现，增加空数据、只读状态和放置器缺失保护。
- 统一单位自动化栏的巡逻、自动技能、兽族吞噬/献祭、自然融合、机械改造状态和副标题。
- 统一研究卡状态徽标、队列反馈和 PC 操作提示的本地化。
- 保留旧实现但确认不再由活动入口调用，避免删除旧接口。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动共用的 SelectionPanel 自动化与 PC 快捷建造/生产/研究操作。
- 不改变战斗、生产、研究数据结构；生产入队、研究启动和建造放置业务入口仍复用既有系统。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，12 个既有编辑器警告。
- 静态确认活动入口调用 `HandlePcQuick*Readable`，生产调用 `AddToQueue`，研究调用 `StartResearch`，建造使用 `FindAnyObjectByType<BuildingPlacer>`，旧 Legacy 方法无调用方。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，未启动第二个实例；PlayMode、分辨率和触控视觉回归仍待在现有编辑器中执行。

### 后续注意事项
- 在现有 Unity 编辑器中验证选中建筑后 PC 快捷生产/研究、无资源/未解锁提示、生产队列长度变化、选中单位后的自动化状态，以及建造卡进入/取消放置。

## 2026-08-09 - 主菜单输入边界与战斗 HUD 状态本地化

### 修改内容
- 修复主菜单隐藏在战斗期间仍响应 Escape 的逻辑，避免从非主页进入战斗后误重新打开主菜单覆盖战场。
- 英雄 HUD 状态改为统一的可用、复活中、生命值和未登场本地化文本，并移除重复状态写入。
- 移动端技能取消提示、技能状态和失败原因统一通过 LocalizationManager 绑定，支持语言切换后即时刷新。
- 保持固定 UI 结构由现有 Prefab 提供，未新增运行时可见界面兜底。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单返回输入、战斗英雄 HUD、移动技能操作提示和语言切换。
- 不改变战斗、技能或英雄数据结构；仅收敛输入门控和动态文案绑定。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /t:Rebuild /p:BuildProjectReferences=false --no-restore`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /t:Rebuild /p:BuildProjectReferences=false --no-restore`：0 错误，12 个既有编辑器警告。
- 静态确认主菜单 Escape 必须满足可见 MainMenu 状态；英雄 HUD 仅保留按模式分流的状态写入；技能提示和失败原因均引用本地化键。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，未启动第二个实例；PlayMode、分辨率、触控和射线遮挡视觉回归仍需在现有编辑器中执行。

### 后续注意事项
- 在现有 Unity 编辑器中从非主页设置页进入战斗后按 Escape，确认不会重新打开主菜单；同时切换语言检查英雄复活/生命值和技能取消、冷却、失败文案。

## 2026-08-09 - 战斗预警与小地图提示刷新优化

### 修改内容
- 将战斗预警标题、副标题、战斗态势卡和战斗 Feed 的固定文案统一改为本地化键，避免英文模式混入中文。
- 战斗预警监听语言状态变化，切换语言后当前 Banner 和态势文本立即刷新，不需要等待下一次事件。
- 将小地图资源耗尽、建造完成、单位就绪、受袭、摧毁、战略点和缩放提示统一走本地化刷新。
- 修复设置 Prefab 缺失时 `InGameSettingsUI` 在刷新检查中访问空根节点的潜在空引用路径。

### 修改文件
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Assets/Scripts/UI/MinimapUI.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗预警 Banner、战斗态势提示、战斗 Feed、小地图事件提示和战斗设置入口的异常路径。
- 不改变战斗事件、资源、战略点或设置数据结构；只调整 UI 文案解析、语言刷新和缺失 Prefab 的安全处理。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，0 个警告。
- 静态确认 `BattleAlertUI`、`MinimapUI` 的固定提示均引用本地化键，语言变化会使战斗态势缓存失效并刷新；设置 UI 的空根节点访问已加保护。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，未启动第二个实例；PlayMode、分辨率、触控和射线遮挡视觉回归仍需在现有编辑器中执行。

### 后续注意事项
- 在现有 Unity 编辑器中触发受袭、建造完成、单位就绪、战略点争夺、小地图缩放和低血量态势；切换中英文确认当前 Banner、Feed 和小地图提示即时更新且不遮挡战场点击。

## 2026-08-09 - 科技树快捷操作与生产面板自动打开边界优化

### 修改内容
- 接通科技树 PC 快捷操作的实际 Update 入口，使 Escape 返回、V 切换可研究、F 聚焦当前研究和空格重置等行为真正生效。
- 科技树搜索框获得焦点时不再抢夺 V/F/空格快捷键，避免输入搜索词触发页面操作。
- 修复科技树页面反复重建时重复注册拖拽事件的问题，避免拖动回调叠加。
- 记录玩家手动关闭或切换离开的生产页，防止 `AutoOpenProductionPanel` 在下一次 HUD 刷新中立刻重新打开；切换到其他建筑后仍可正常自动打开。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 科技树键盘/滚轮输入、科技树拖拽、科技树搜索框，以及建筑生产页的自动打开和手动关闭行为。
- 不改变科技、生产或设置数据结构；只修复现有 UI 状态机和输入事件生命周期。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore`：0 错误，12 个既有编辑器警告。
- 静态确认 `TechTreePanelUI.Update()` 调用 PC 输入处理、文本框焦点有保护、拖拽事件注册前会清理旧事件；生产自动打开条件排除当前被玩家关闭的建筑。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，未启动第二个实例；PlayMode、分辨率、触控和射线遮挡视觉回归仍需在现有编辑器中执行。

### 后续注意事项
- 在现有 Unity 编辑器中打开科技树，验证 PC Escape/V/F/空格/滚轮、拖拽和搜索输入；开启自动生产后手动关闭生产页，确认不会立即弹回，再切换建筑确认自动打开仍生效。

## 2026-08-09 - 跨页面返回栈与加载状态体验优化

### 修改内容
- 修复战役地图双指缩放会误响应到地图外按钮区域的问题，并避免双指缩放期间叠加单指拖拽。
- 为战役地图补充分层返回逻辑：确认弹窗、章节弹窗、图例/筛选弹窗和节点详情会先逐层关闭，最后才离开战役页。
- 会话过渡期间禁止重复启动战斗，避免快速连点开始按钮重复重建会话。
- 加载标题和阶段进度改用本地化键；暂停设置的保存、恢复默认、读取失败和生存存档提示统一本地化。
- 结算页检测语言变化并重绘当前页签，避免切换语言后停留在旧文案。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/LoadingScreenUI.cs`
- `Assets/Scripts/Core/GameSessionManager.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单战役地图的 PC/移动端拖拽、缩放和返回操作。
- 主菜单到战斗的会话启动边界、加载页状态提示、局内暂停设置反馈和结算页语言刷新。
- 不改变战斗数据、会话配置或结算统计结构；只收敛 UI 输入状态、过渡状态和动态文案绑定。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查通过：战役弹窗返回栈、地图视口双指约束、会话重复启动保护、加载/设置本地化和结算语言刷新均存在。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，未启动第二个实例；PlayMode、不同分辨率、实际触控和 UI 射线遮挡视觉回归仍需在现有编辑器中执行。

### 后续注意事项
- 在现有 Unity 编辑器中验证战役地图连续打开确认/章节/图例/节点弹窗后按 Escape 的逐层关闭顺序。
- 在移动端验证地图外双指操作不会缩放地图，地图内双指缩放不会同时产生明显漂移。
- 在中英文下分别启动一次战斗并观察加载三阶段；结算页切换语言后检查当前页签和操作按钮文案。

## 2026-08-09 - 小地图动态文案与战斗详情返回栈优化

### 修改内容
- 小地图标题、图例和展开/缩小按钮改为统一本地化键，支持运行中切换语言后立即刷新。
- 修复 Prefab 样式所有权导致运行时按钮文案不更新的问题，动态文案与字体样式解耦。
- 将战斗选择面板的详情卡、编队选择和编队管理弹层纳入移动端 Escape 返回栈，按“最上层弹层优先”关闭。
- 选择面板的采集按钮和技能详情操作按钮改用本地化键，避免英文界面残留中文或乱码。

### 修改文件
- `Assets/Scripts/UI/MinimapUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 小地图的中英文显示、展开/收起状态和动态语言切换。
- 移动端选择单位/建筑后的详情卡、控制组弹层和 Escape 返回行为。
- 不改变战斗数据或控制组数据，仅调整 UI 状态归属、返回顺序和文案绑定。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- 静态检查通过：小地图语言跟踪、动态缩放文案绑定、SelectionPanel 返回接口、返回栈接入和新增本地化键均存在。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，未启动第二个实例；PlayMode、不同分辨率、实际触控和 UI 射线遮挡视觉回归仍需在现有编辑器中执行。

### 后续注意事项
- 在移动端验证详情卡、编队管理、编队选择连续打开后按 Escape 的逐层关闭顺序，再确认下一次 Escape 才打开设置。
- 在中英文下分别验证小地图收起/展开和语言切换，确认标题、图例、按钮不出现旧语言或乱码。
- 在真实设备上确认小地图地图区域仍可拖动定位，面板背景和动态标记不会遮挡战场点击。

## 2026-08-09 - 跨面板 Escape、队列刷新与动态本地化优化

### 修改内容
- 为 PC 战斗 HUD 统一 Escape 关闭顺序：选择详情弹层优先，其次关闭生产、科技和建造页面，避免生产页只能点击关闭按钮。
- 科技树增加轻量研究队列刷新：以 0.25 秒间隔更新队列内容；研究项目开始/结束或语言变化时才重建页面。
- 生产、建造、科技和单位生产页面支持运行中切换语言后重新绑定动态标题、状态、分类和按钮文案。
- 建造页面的放置状态、旋转按钮、空分类提示和详情提示改用本地化键。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端战斗 HUD 的面板关闭路径、建造/科技/生产交互状态、研究队列动态显示和运行中语言切换。
- 不改变战斗数据、生产/研究规则或资源路径；仅优化现有 UI 状态机、限频刷新和文案绑定。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查通过：PC Escape 关闭优先级、科技队列限频刷新、语言刷新入口和放置状态本地化键均存在；未增加每帧完整科技树重建。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，未启动第二个实例；PlayMode、不同分辨率、实际触控、射线遮挡和视觉回归需在现有编辑器/设备执行。

### 后续注意事项
- 在 PC 验证生产/科技/建造页面和详情卡连续打开后按 Escape，确认逐层关闭。
- 在中英文下分别验证科技研究进度、研究完成后的节点状态、生产队列和建造放置提示实时变化。
- 在移动端验证语言切换不改变队列滚动位置和按钮可操作性，小地图及面板仍不遮挡战场点击。

## 2026-08-09 - 操作详情卡返回栈与战斗语义本地化优化

### 修改内容
- 将单位、建筑、科技和通用操作详情卡中的统计、效果、条件、风险、职业和状态文案统一改为 `LocalizationManager` 键，消除英文模式下的大量中文残留。
- 操作详情卡加入战斗 HUD 最高优先级返回栈；PC/移动端按 Escape 时先关闭当前详情卡，再处理 Buff、编队弹层和生产/科技/建造页面。
- 技能喊名气泡的类型标签、切换前缀和空技能名回退改为本地化。
- 机械电网状态标签及过载、断电、接入反馈改为本地化。

### 修改文件
- `Assets/Scripts/UI/OperationDetailDataFactory.cs`
- `Assets/Scripts/UI/OperationDetailCardView.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/SkillCalloutBubbleManager.cs`
- `Assets/Scripts/UI/MechanicalCircuitVisualIndicator.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位/建筑/科技/操作详情卡的 PC 悬停、移动端长按、风险提示和 Escape 返回行为。
- 技能战斗气泡和机械阵营建筑头顶状态反馈的中英文一致性。
- 不改变战斗、研究、生产或机械电网规则；只调整 HUD 语义绑定和覆盖层关闭顺序。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误。
- 静态检查通过：详情卡 99 个本地化调用均有注册键，详情工厂不再包含硬编码中文；详情卡返回入口已接入 `SelectionPanel.TryCloseTopOverlay`。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，本轮未启动第二个实例；PlayMode、分辨率、触控和视觉回归仍需在现有编辑器/设备中执行。

### 后续注意事项
- 在 PC 和移动端分别验证悬停/长按打开详情后连续按 Escape，确认详情卡先关闭且不会误关闭父页面。
- 在中英文下检查单位属性、建筑放置、科技条件、技能气泡和机械电网过载/断电提示，不应出现混合语言。
- 若详情正文在窄屏仍被截断，应优先调整 `OperationDetailCard_Prefab` 的正文区域或增加滚动容器，不要在代码中恢复可见旧版兜底布局。

## 2026-08-09 - 建造放置返回优先级与生产窗口自动重开优化

### 修改内容
- 将建造放置态提升为 PC/移动端 Escape 返回栈中详情浮层之后、主面板之前的状态；按一次 Escape 即取消当前放置，不再先关闭父面板或留下放置预览。
- 取消放置时同步关闭 `BuildDevelopmentPanelUI` 的放置覆盖层并刷新 HUD 宿主，保留建造目录作为下一层返回目标。
- 生产窗口关闭时记录其当前绑定建筑，即使主面板状态已经是 `None`，也不会在下一帧被自动生产设置重新打开。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端建造放置的 Escape、生产窗口返回和自动打开状态机。
- 不改变建造、生产和资源规则；仅修正面板互斥、返回优先级和关闭状态记录。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有编辑器警告。
- 静态检查通过：PC/移动端放置取消均先于主面板关闭，取消路径会关闭放置覆盖层，生产窗口会记录绑定建筑且 `ReturnToBuildingDetails` 无重复局部声明。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，本轮未启动第二个实例；PlayMode、不同分辨率、实际触控、射线遮挡和视觉回归需在现有编辑器/设备执行。

### 后续注意事项
- 在 PC 和移动端分别从建造目录进入放置态，确认按一次 Escape 取消预览、第二次 Escape 才关闭建造目录或打开设置。
- 开启自动打开生产窗口后，手动返回一次，确认生产窗口不会在下一帧自动弹回；切换到其他建筑后应恢复正常自动打开。

## 2026-08-09 - 战斗 HUD 跨平台返回与暂停输入一致性优化

### 修改内容
- 修复移动端返回键与 `InGameSettingsUI` 同帧竞争的问题：`GameUI` 打开暂停页后，设置页会消费本次 Escape，不再立即恢复游戏。
- 统一 PC 与移动端的 Escape 心智模型：详情、放置、生产、科技和建造层关闭完毕后，PC Escape 进入暂停页。
- 移动端关闭遗留生产窗口改走 `GameUI.CloseBuildingProductionWindow()`，保留自动生产设置的手动关闭记录，避免窗口下一帧重开。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端战斗 HUD 的返回键、暂停页打开、生产窗口回退和主面板返回栈。
- 不改变游戏暂停规则或生产规则；仅修正跨组件输入消费和关闭状态同步。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有编辑器警告。
- 静态检查通过：移动端遗留生产窗口使用统一关闭入口，PC Escape 在所有高层界面之后打开暂停页，设置页单帧消费同一次返回输入。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，本轮未启动第二个实例；PlayMode、不同分辨率、实际触控、射线遮挡和视觉回归需在现有编辑器/设备执行。

### 后续注意事项
- 在 PC/移动端分别测试：无面板按 Escape 打开暂停页；暂停页按 Escape 恢复；设置页和存档页按 Escape 返回暂停页。
- 测试生产窗口、详情卡、建造放置和科技树连续打开/返回，确认一次输入只消费一层，不出现同帧打开后立即关闭。

## 2026-08-09 - 战斗 HUD 输入射线检测缓存优化

### 修改内容
- 将 `InputUtility.IsPointerOverUi()` 的 UI 射线结果缓存到当前帧和当前指针位置，复用 `RaycastResult` 临时列表。
- 保留按钮、滚动容器、滑块、Toggle、输入框和大面积 UI 的原有拦截规则，不改变战场点击语义。
- 减少相机、单位选中、建造放置和技能目标输入在同一帧重复创建列表及重复 Raycast 的开销。

### 修改文件
- `Assets/Scripts/Utils/Singleton.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端战场指针输入与 HUD 射线判定的运行时性能。
- 不改变 UI 层级、按钮可点击范围或战斗规则；仅复用同帧判定结果。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有编辑器警告。
- 静态检查通过：`IsPointerOverUi()` 复用单个临时列表，并按帧、EventSystem 和指针位置缓存；原有 `ShouldBlockWorldInput` 规则未变。
- 本轮未运行 Unity Profiler；Unity 编辑器仍持有 `Temp/UnityLockfile`，实际 GC Alloc、Canvas rebuild、触控和射线遮挡需在现有编辑器/设备中测量。

### 后续注意事项
- 在 Unity Profiler 中对连续框选、拖动画面、建造预览和技能指向分别记录 GC Alloc 与 Scripts CPU，确认缓存命中并无跨场景残留。
- 在 PC/移动端确认指针从 HUD 按钮快速移动到战场时，UI 判定随位置变化立即更新。

## 2026-08-09 - 建造与建筑详情高频文案本地化

### 修改内容
- 将建造栏标题、PC/移动端操作提示、分类空状态、建造状态芯片和放置确认提示接入 `LocalizationManager`。
- 将俘虏建筑路线说明、阵营路线徽章和机械主城改造槽提示接入中英文语言表。
- 将建筑详情中的核心状态、建筑定位、功能能力、快捷操作、生产能力、升级能力、建造状态和交互提示接入本地化键，减少英文模式下中英混排。
- 为动态生产数量、升级上限、主城时代限制和俘虏主城交互提示补充格式化语言键。
- 将建筑分类角色摘要、生产/科技快速卡片、队列反馈和科技前置/效果提示接入本地化键，并清除这两个界面脚本中的直接中文文案。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端建造目录、建筑详情卡、生产/升级状态摘要和高频操作提示的中英文显示。
- 不改变建造、生产、科技和升级规则，仅替换可见文案来源并保留原有条件分支与格式化数据。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有编辑器警告。
- 静态检查通过：本批新增本地化键均由建造/建筑详情代码引用，动态占位符通过 `string.Format` 填充。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，本轮未启动第二个实例；PlayMode、不同分辨率、实际触控和中英文视觉回归需在现有编辑器/设备执行。

### 后续注意事项
- 继续扫描 `BuildingUiUtility.cs`、生产/科技卡片之外的长提示和主菜单剩余硬编码文案，避免低频路径继续出现中英混排。
- 在 PC/移动端切换中英文，检查窄屏详情卡、生产数量提示、升级状态和俘虏建筑路线是否完整显示且不溢出。

## 2026-08-09 - 选中面板生命周期与科技树操作确认优化

### 修改内容
- 修复 `SelectionPanel` 在面板重新启用后事件监听丢失的问题，并为 EventManager、ControlGroupManager 增加独立订阅状态与缺失重试。
- 为选中单位技能快捷键增加 UI 输入占用判断：主面板、生产/科技子面板、详情卡、输入框和交互模式打开时不再误触发技能。
- 修复科技树搜索框重建时重复注册 `onEndEdit` 的问题。
- 对高风险科技改为先打开详情，详情按钮显示“确认研究”，避免点击科技节点直接启动研究。
- 修复科技树淡入阶段透明面板提前拦截 HUD 点击的问题；统一组合单位、融合阶段和兽族吞噬计数的可见文案入口，并清除相关明显乱码/中英混排。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/BuildingUiUtility.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 的选中面板生命周期、PC 技能热键、科技树搜索/高风险研究、组合建筑和兽族单位信息展示。
- 不改变资源、研究和技能规则；仅补齐 UI 状态边界、输入优先级、确认语义和文案来源。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有编辑器警告。
- 静态检查通过：事件订阅有 Enable/Disable 对称路径，科技树搜索监听先移除再添加，高风险节点不再自动启动，UI 输入期间技能热键被阻断，本地化键均有定义。
- Unity 编辑器仍持有 `Temp/UnityLockfile`，本轮未启动第二个实例；PlayMode、分辨率适配、实际触控、射线遮挡和视觉回归需在现有编辑器/设备中执行。

### 后续注意事项
- 在 PC/移动端分别验证选中面板反复打开/关闭后，单位事件、编组事件和技能热键仍可用且不会重复触发。
- 在科技树中验证搜索框、拖拽/缩放、节点详情和高风险研究确认按钮；确认淡入期间点击底层 HUD 不会误触发。
- 继续扫描 `SelectionPanel.cs`、`UnitOverheadUI.cs` 和 `MainMenuUI.cs` 的低频硬编码文案，并在现有 Unity 编辑器中完成运行时视觉回归。

## 2026-08-09 - 全局 HUD 输入边界与头顶状态本地化优化

### 修改内容
- 主菜单事件监听增加 Enable/Disable 对称状态和延迟实例化重试，避免 `EventManager` 晚于主菜单创建时导致页面状态不再同步。
- 战斗 HUD 的 PC `B`/`U` 快捷键增加 UI 焦点与射线占用判断，输入框、按钮、滚动区或其他交互面板处不会误打开建造/升级操作。
- 单位/建筑头顶 HUD 的高频阵营、融合、英雄、研究、能量、进化、采集和 Buff 状态接入现有本地化表。
- 头顶 HUD 状态背景改为按当前语言状态键判断，不再依赖中文字符串匹配，保证中英文状态颜色和危险层级一致。
- 核对头顶 HUD 建筑生产状态聚合分支，确保生产状态作为独立状态源参与显示条件。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单状态同步、战斗 HUD PC 快捷键、单位/建筑头顶信息、阵营状态视觉反馈和中英文显示。
- 不改变战斗数值、研究规则、生产规则或输入绑定；仅收紧 UI 优先级、修正状态显示条件并统一文案来源。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有编辑器警告。
- 静态检查通过：主菜单订阅有重试与对称解绑，B/U 热键有 UI 阻断，头顶状态颜色不再硬编码依赖中文，新增本地化键均被代码引用。
- `Temp/UnityLockfile` 仍存在；本轮未启动第二个 Unity 实例，PlayMode、不同分辨率、实际触控和视觉回归需在现有编辑器/设备中执行。

### 后续注意事项
- 在英文模式下确认头顶 HUD 的断供、终极、三重研究和融合研究状态仍显示正确颜色与状态图标。
- 在输入框、科技搜索、建造/生产按钮和滚动区输入 `B`/`U`，确认不会触发战斗快捷键；离开 UI 后快捷键应恢复。
- 继续处理 `MainMenuUI.cs`、`SelectionPanel.cs` 中剩余低频硬编码文案，并检查主菜单各页面的移动端安全区与返回栈。

## 2026-08-09 - 选中面板快速研究高风险确认统一

### 修改内容
- 将选中面板底部 PC 快速研究入口与独立科技树统一为高风险科技二次确认流程。
- 首次点击高风险科技只展示详情并标记“确认研究”，确认窗口有效期为 3 秒；再次点击同一科技才进入研究队列。
- 切换建筑、关闭面板、验证失败或确认窗口超时会清理待确认状态，避免跨选择残留或误研究。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中后的 PC 快速科技卡、科技详情反馈和研究队列入口。
- 不改变高风险判定规则和研究队列规则，只增加 UI 层确认状态与过期清理。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有编辑器警告。
- 静态检查通过：高风险判定与 `OperationDetailDataFactory.ForTech` 使用同一阈值，待确认状态在切换/禁用/超时路径清理，卡片状态徽章与确认窗口同步。
- Unity 仍持有 `Temp/UnityLockfile`，本轮未执行实际点击、移动端触控和 PlayMode 研究队列回归。

### 后续注意事项
- 在 PC 快速研究卡上验证首次点击、二次确认、点击其他科技、等待超时和切换建筑五条路径。
- 确认低风险科技仍保持单击启动，高风险科技与独立科技树的提示文案和状态颜色一致。

## 2026-08-09 - 主菜单主页与模式选择本地化键统一

### 修改内容
- 修复主页和模式选择页把中文直传给本地化服务的问题，避免英文模式下未注册中文直接回退。
- 统一主页标题、模式入口、继续存档、快捷操作、图鉴、底部提示和模式卡片文案的本地化键。
- 复核 `SelectionPanel` 统计卡片旧逻辑：当前可见入口均明确隐藏，且没有创建调用，暂不重新启用未接入的旧组件。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单主页、统一模式选择页及其 Prefab/运行时回退路径的中英文显示。
- 不改变页面层级、按钮路由、模式配置或存档逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有编辑器警告。
- 静态检查通过：主页/模式选择路径不再包含中文硬编码显示参数；新增本地化键均已注册并被代码引用；事件订阅、UI 热键阻断和高风险研究确认回归点仍存在。
- `Temp/UnityLockfile` 仍存在；本轮未启动第二个 Unity 实例，PlayMode、移动端触控、实际安全区和视觉回归需在现有编辑器/设备中执行。

### 后续注意事项
- 在中文/英文两种语言下打开主页和模式选择页，确认 Prefab 路径与运行时回退路径文案一致。
- 继续处理主菜单 Codex、战役地图和设置页的低频硬编码文案，并在现有 Unity 编辑器中完成页面返回栈与移动端安全区回归。

## 2026-08-09 - 暂停设置与图鉴本地化/状态一致性优化

### 修改内容
- 修复暂停设置页事件订阅可能晚于页面启用的问题，并补齐对称取消订阅，避免重复监听和状态不同步。
- 设置页通用枚举选项改为通过本地化键显示，修复英文模式直接显示代码枚举名的问题。
- 统一 Codex 的静态控件、筛选器、计数、空状态、预览提示、详情标签和玩法条目的本地化键，覆盖中英文显示路径。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗内暂停设置页、设置枚举控件和主菜单 Codex 的搜索/筛选/详情/模型预览交互文案。
- 不改变设置数据、页面路由、图鉴数据来源和模型预览逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，保留项目既有编辑器警告。
- 静态检查通过：设置页订阅具备启用、延迟补订阅和禁用取消路径；枚举值通过 `LocalizationManager.Get`；Codex 控件和详情使用稳定本地化键。
- `Temp/UnityLockfile` 仍存在；本轮未启动第二个 Unity 实例，PlayMode、移动端触控、安全区和视觉回归需在现有编辑器/设备中执行。

### 后续注意事项
- 在中文/英文两种语言下验证暂停页打开/关闭、设置枚举切换和页面重进，确认事件只触发一次。
- 在 Codex 中验证搜索、分类/阵营/时代筛选、清除筛选、详情展开、模型预览和返回路径，并继续回归战役地图及剩余低频界面文案。

## 2026-08-09 - 生产研究面板事件生命周期与建筑头顶状态绑定优化

### 修改内容
- 为建筑生产详情面板补充 EventManager 的延迟订阅重试和对称取消订阅，避免 UI 先启用时丢失选中/取消选中事件。
- 为单位生产面板和建筑研究面板补充资源监听重试，修复 EventManager 晚到时资源变化不刷新按钮状态的问题。
- 为建筑头顶生产状态 HUD 增加生产队列/研究队列的动态引用检测、事件重绑定和节流检查，支持运行时新增或替换队列后立即恢复状态显示。

### 修改文件
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Assets/Scripts/UI/BuildingProductionStatusUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗内建筑生产详情、单位生产卡片、建筑研究卡片和建筑头顶活动状态 HUD 的生命周期与状态刷新。
- 不改变生产/研究数据结构、队列 API、Prefab 路径或资源扣除逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查通过：迟到事件订阅存在唯一启用/禁用路径；生产和研究队列事件各有一套订阅/解绑；资源监听与动态队列绑定重试入口均存在。
- `Temp/UnityLockfile` 仍存在；本轮未启动第二个 Unity 实例。

### 后续注意事项
- 在现有 Unity 编辑器中验证 EventManager 晚到、资源变化、运行时添加/替换队列、关闭重开面板，以及 PC/移动端操作。
- 继续审计战役地图、主菜单剩余动态页面和低频界面的输入优先级、返回栈、安全区与 Prefab 结构。

## 2026-08-09 - 主菜单与战斗 HUD 返回栈及移动地图交互优化

### 修改内容
- 统一竞技、生存、战役设置页的 Escape 返回路径，使其与页面可见的“返回”按钮一致地回到模式选择页。
- 将放大状态的小地图纳入 PC Escape 和移动端系统返回栈；在更高层弹层关闭后，优先收起小地图而不是直接打开暂停设置。
- 补齐战役地图双指操作的双指中心位移，缩放时保持地图跟随手势中心，并继续使用原有边界限制。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/MinimapUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单模式设置页、战役地图移动端双指缩放、小地图展开状态和战斗内 PC/移动端返回键处理。
- 不改变游戏模式配置、相机目标计算、地图数据或战斗暂停逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查通过：模式设置页 Escape 路由、小地图收起入口、双指中心位移和前一轮生命周期修复入口均存在；`BuildingProductionStatusUI` 队列事件各保持一套订阅/解绑路径。
- `Temp/UnityLockfile` 仍存在；本轮未启动第二个 Unity 实例。

### 后续注意事项
- 在现有 Unity 编辑器和移动设备中验证模式设置返回、战斗内小地图展开/返回、双指缩放中心、节点点击与地图边界。
- 战役地图仍有较多动态中文文案和旧的代码生成回退路径，下一轮继续按 Prefab 优先、本地化和输入优先级规则处理。

## 2026-08-09 - 战斗主 HUD 事件生命周期统一优化

### 修改内容
- 将 `GameUI` 的资源、游戏状态、选中/检查、任务、战役教程和英雄生命周期事件订阅集中到可重试入口。
- 在 HUD 每帧更新前补订阅迟到的管理器，并在禁用时按订阅状态对称解绑，避免 HUD 因初始化顺序丢失刷新驱动或重复监听。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗主 HUD 的资源显示、选中面板联动、检查状态、游戏状态文字、任务提示、战役教程提示和英雄 HUD。
- 不改变事件定义、战斗状态机、任务数据或英雄生命周期逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查通过：GameUI 的中心事件和三类辅助事件各有唯一订阅入口与对称解绑入口，更新循环包含迟到管理器重试。
- `Temp/UnityLockfile` 仍存在；本轮未启动第二个 Unity 实例。

### 后续注意事项
- 在现有 Unity 编辑器中验证 HUD 先启用后管理器出现、禁用/重启 HUD、资源变化、选中/检查切换、任务变化和英雄变化不会重复刷新。
- 继续处理战役动态文案本地化、Prefab 回退路径及剩余低频 UI 的状态一致性。

## 2026-08-09 - 小地图与战斗告警事件迟到重连优化

### 修改内容
- 为小地图补充 EventManager 迟到时的告警事件重试，恢复敌袭、建筑完成、单位生产和单位死亡提示。
- 为战斗告警条补充同类事件重试，避免战斗开始阶段 HUD 初始化顺序变化导致告警条静默。

### 修改文件
- `Assets/Scripts/UI/MinimapUI.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 小地图告警点/提示和战斗告警横幅的事件驱动刷新。
- 不改变告警节流、迷雾判定、显示内容或音频播放逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- 静态检查通过：小地图和战斗告警均保留单一订阅/解绑路径，并在更新入口重试迟到的 EventManager。
- `Temp/UnityLockfile` 仍存在；本轮未启动第二个 Unity 实例。

### 后续注意事项
- 在现有 Unity 编辑器中验证先启用 HUD 后生成 EventManager 的场景，以及战斗中敌袭、生产、建造完成和单位死亡告警。
- 继续审计战役地图动态本地化、Prefab 结构和其余 HUD 的遮挡/输入优先级。

## 2026-08-09 - 全局界面安全区与战役地图交互优化

### 修改内容
- 将通用 UI 安全区计算扩展为左、下、右、上四侧，避免横屏刘海和系统手势区只落在单侧时仍发生越界。
- 让选择面板和底部居中面板使用四侧安全区进行尺寸与位置收束。
- 移除战役地图进入时自动弹出的章节详情，改为点击章节/城市节点后再打开详情，降低首次进入的遮挡和返回层级负担。
- 让战役地图 PC 滚轮和手机双指缩放围绕当前指针/双指中心调整视图。

### 修改文件
- `Assets/Scripts/UI/UiSafeAreaUtility.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 移动端异形屏下的选择面板、生产/科技等底部面板边界。
- 战役地图首次进入、PC/手机地图缩放和章节详情打开方式。
- 不改变 Prefab 节点归属、战役章节数据或进入战斗流程。

### 验证方式
- 静态检查确认安全区 API 已使用四侧数据，旧的选择面板单向安全区辅助方法已移除，战役页不再在进入时调用自动弹窗。
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- `Temp/UnityLockfile` 仍存在；本轮未启动第二个 Unity 实例。

### 后续注意事项
- 在现有 Unity 编辑器中验证 19.5:9、18:9、16:9 和 4:3 分辨率下的选择面板、生产窗口、科技树与设置按钮。
- 继续处理战役动态文案本地化、战役页固定 UI 的 Prefab 化，以及剩余弹层输入优先级。

## 2026-08-09 - 战役地图活动路径双语文案收口

### 修改内容
- 为战役地图的进度、统计、图例、筛选、地图操作、地区和节点类型增加稳定的中英文 key 与格式化模板。
- 让实际活动的战役地图页面使用 UI 层本地化 helper，避免把展示语言写入 `CampaignWorldDefinitions` 的缓存数据。
- 保留战役数据定义原始文本的领域所有权，避免切换语言后已缓存的任务目标被错误固定成另一种语言。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/Core/CampaignWorldDefinitions.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战役地图进入页、右侧统计、底部操作条、地区名和节点类型在中英文模式下的展示。
- 不改变战役章节、任务和世界节点数据结构。

### 验证方式
- runtime 目标程序集编译通过：0 错误，182 个既有警告。
- editor 目标程序集编译通过：0 错误，12 个既有编辑器警告。
- 静态检查确认 `MainMenuUI` 已使用活动路径本地化 helper，领域定义未保留运行时语言依赖。

### 后续注意事项
- 继续补齐战役章节/任务数据正文的本地化资源，并检查长文本在小屏幕上的换行和滚动。
- 在现有 Unity 编辑器中验证中文/英文切换后重新打开战役地图，确认动态节点和弹层文字同步刷新。

## 2026-08-09 - 全局弹层输入边界与移动端设置按钮优化

### 修改内容
- 修复 UI 射线判定依赖 `RectTransform.sizeDelta` 的问题，拉伸全屏遮罩、暂停层和小地图内容现在按 `Graphic.raycastTarget` 作为明确的世界输入边界。
- 保留 HUD 装饰层的穿透规则：非交互图形由既有 HUD 射线策略设为不可射线，不会因为全局判定变严格而吞掉战场点击。
- 将战斗 HUD 设置按钮 Prefab 触控尺寸调整为 `112×54`，移动端文本启用自适应并设置安全区偏移，避免刘海/手势区遮挡和英文按钮文字裁切。

### 修改文件
- `Assets/Scripts/Utils/Singleton.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 暂停、设置、科技树、生产窗口、结算遮罩、小地图和战场点击之间的输入优先级。
- PC 与移动端战斗 HUD 设置入口的触控尺寸、文字可读性和异形屏边界。
- 不改变战斗命令、资源计算或 Prefab 节点归属。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误。
- 静态检查确认射线边界、安全区偏移和设置按钮尺寸均已生效。
- `Temp/UnityLockfile` 仍存在；本轮未启动第二个 Unity 实例，也未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在现有 Unity 编辑器中验证暂停遮罩、科技树/生产弹层、小地图点击和结算页背景点击不会穿透到战场。
- 在 19.5:9、18:9、16:9 和 4:3 分辨率下检查移动设置按钮、结算页按钮和长文本布局。

## 2026-08-09 - 全局菜单与结算页移动端缩放优化

### 修改内容
- 为主菜单和战斗结算 Canvas 增加可切换的移动端缩放档位：运行时移动平台或手机操控方案使用宽度优先缩放，桌面端保持原有居中缩放。
- 修复移动端竖屏下固定宽度页面、战役地图控制条和结算页标签横向溢出的高风险路径；操控方案切换后会重新应用对应缩放档位。
- 将结算页六个固定标签的 Prefab 宽度从 206 调整为 184、间距收紧并提高触控高度，保留 Prefab-owned 布局，不在运行时覆盖固定结构。
- 将战役地区、章节节点、世界节点和章节列表状态改为稳定的本地化 key，避免英文模式残留“未解锁/当前主线/可挑战”等中文状态。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Assets/Resources/UI/Prefabs/Pages/SettlementRoot_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单主页、玩法选择、设置、图鉴和战役地图在窄屏/竖屏下的整体缩放。
- 结算页标签切换和结算操作区在移动端的可见性与触控可达性。
- 不改变战斗结算数据、战役进度或页面返回栈。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查确认移动/桌面缩放档位、6 个结算标签位置与尺寸均已写入，并确认 `Temp/UnityLockfile` 存在。
- 静态检查确认活动战役地图路径使用章节状态与地区本地化 helper。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在现有 Unity 编辑器中使用 19.5:9、18:9、16:9 和 4:3 分辨率分别验证主菜单战役页、结算标签、长文本和安全区。
- 继续收口战役章节/任务正文的本地化与移动端滚动/换行体验。
- 结算页与战役弹层仍需在中英文切换和移动端设备上进行实际视觉检查。

## 2026-08-09 - 战役弹层与结算滚动容器逻辑收口

### 修改内容
- 收口主菜单通用 `Panel`、`Label`、`Button` 以及战役地图节点、路线、装饰层、坐标/地区标签的 Prefab 回退逻辑：缺少资源时记录错误并跳过视觉元素或保留不可见占位，不再动态生成另一套可见 UI。
- 修复战役弹层复用 Prefab 默认 `360×112` 预览尺寸的问题，弹层外壳继续复用 Prefab 的视觉样式，但由当前节点/确认/章节/说明场景控制页面锚点，避免按钮落在弹层边界外。
- 将战役节点详情、进入确认、章节总览中的标题、状态、条件、奖励和操作按钮统一接入本地化模板，并补齐敌方阵营、地图类型、胜负条件等中英文资源。
- 修复结算页 `SettlementScrollView` 忽略调用方 `position/size` 的问题，使资源表、洞察区和战斗时间线按各自布局参数落位；结算统计短值增加移动端优先的紧凑显示并限制固定行溢出。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单战役地图节点、路线、地区标识、节点详情弹层、进入确认和章节总览的布局稳定性、回退行为与中英文文本。
- 结算页资源/洞察/时间线滚动区域的定位、尺寸、裁剪和移动端长值展示。
- 不改变战役进度、结算统计数据和既有页面返回栈。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查确认可见战役节点/路线/标签与主菜单通用 UI 已移除缺失 Prefab 时的可见 `GameObject` 回退；仅保留预览相机、非视觉占位等明确运行时结构。
- 静态检查确认结算滚动容器的四个调用点均把位置和尺寸写入 viewport，并确认 `Temp/UnityLockfile` 存在。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在现有 Unity 编辑器中验证主菜单战役节点、右侧弹层、确认弹层和章节总览的点击、关闭、返回顺序，以及中英文切换后的文本刷新。
- 在 19.5:9、18:9、16:9 和 4:3 分辨率下检查结算资源表、洞察面板、时间线滚动、按钮触控区域和长文本裁剪。
- 继续审计主菜单旧版战役详情分支、设置滑块和其它动态列表的固定文本/Prefab 资源一致性。

## 2026-08-09 - 小地图与战斗告警 HUD 输入边界收口

### 修改内容
- 修复 Prefab-owned 小地图展开按钮只更新标题和图例、实际尺寸不变化的问题：保留 Prefab 的锚点/尺寸归属，使用运行时缩放表达展开态，并按当前 Canvas/屏幕可用空间限幅，避免窄屏裁切。
- 将小地图交互限制为 `GameState.Playing`；暂停时保留可见状态但关闭 `CanvasGroup` 与 `MapContent` 射线，避免小地图抢占暂停菜单或其它 UI 的点击。
- 离开战斗状态时清理动态点位、摄像机框、预警 ping、战略点状态和世界范围缓存，下一局重新进入时不会带入上一局视觉状态。
- 修正战斗告警“友军受袭”使用错误本地化 key 的问题，并将告警标题、副标题、战斗状态和 feed 条目的固定高度文本改为截断，避免中英文长文案溢出卡片。

### 修改文件
- `Assets/Scripts/UI/MinimapUI.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Assets/Resources/UI/Prefabs/Components/AlertBanner_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/CombatStatusPanel_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/CombatFeedEntry_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 小地图展开/收起、点击跳转、拖拽视角、暂停输入边界和跨局状态清理。
- 战斗告警横幅、战斗状态条和右侧战斗 feed 的多语言文本显示与溢出行为。
- 不改变地图单位/建筑数据、摄像机规则或战斗事件，只调整 UI 状态与呈现边界。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查确认小地图展开使用缩放限幅、暂停态关闭交互射线、隐藏态清理动态对象，并确认 `Friendly Unit Under Attack` key 与本地化表一致。
- 静态检查确认告警 Prefab 固定文本的 `m_VerticalOverflow` 已改为截断，`Temp/UnityLockfile` 仍存在。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在现有 Unity 编辑器中验证小地图展开/收起、点击/拖拽跳转、暂停返回以及下一局重新进入时的点位清理。
- 在 19.5:9、18:9、16:9 和 4:3 分辨率下检查展开小地图和战斗告警中英文长文本的可读性。
- 继续审计战斗 HUD 设置滑块、动态队列和旧版生产/科技分支的输入边界与固定文本。

## 2026-08-09 - 战斗内设置遮罩与滑块状态优化

### 修改内容
- 修复暂停菜单 `Dim` 节点被设置为不可射线的问题：打开暂停/设置/存档页后，点击弹层空白区域不再穿透到战场。
- 修复设置页重建时滑块重复注册 `onValueChanged` 的问题，避免一次拖动触发多次写入与重建；同时复用已有滑块条目，减少反复打开设置页产生的重复对象。
- 保留按钮 Prefab 的 Label 布局归属，不再用运行时代码覆盖 Prefab-owned 文本锚点；固定行文本按可用高度选择截断策略，避免英文描述覆盖控件。
- 扩大移动端设置页和存档页的底部操作区，并同步调整内容区边界，给双行按钮和状态提示留出稳定触控空间。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗内暂停、控制设置、存档页的遮罩点击、滑块交互、页面重建和移动端底部按钮布局。
- 不改变用户设置字段、存档数据、暂停/恢复状态机或战斗逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误。
- 静态检查确认 `Dim` 使用可拦截射线、滑块清理监听器并使用 `SetValueWithoutNotify`、移动端设置/存档 footer 高度已调整，`Temp/UnityLockfile` 仍存在。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在现有 Unity 编辑器中验证暂停遮罩空白点击不会选中战场对象，连续打开设置页后滑块仍只触发一次更新。
- 在移动端窄屏检查设置页底部四按钮、存档页按钮与状态提示是否都在安全区内。
- 继续审计生产/科技/选择面板的重复事件绑定与动态条目回收。

## 2026-08-09 - 科技树模态输入与 Prefab 布局归属优化

### 修改内容
- 修复科技树全屏 `Dim` 节点关闭射线的问题，打开科技树后点击面板外区域不会再穿透到战场。
- 悬浮科技详情页仅在非 Prefab-owned 根节点上应用运行时位置和尺寸；Prefab-owned 页面保留编辑器布局，避免不同分辨率/设备打开时被代码覆盖。
- 搜索框正文和占位文本仅在非 Prefab-owned 文本节点上应用运行时内边距，保留 Prefab 对文本区域的布局控制。
- 悬浮详情页的运行时颜色和描边也遵守 Prefab style ownership，动态内容仍按当前科技节点刷新。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 科技树 PC/移动端的模态点击边界、悬浮详情页布局、搜索框文本布局和 Prefab 可编辑性。
- 不改变科技解锁、研究队列、搜索筛选或返回流程。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查确认 `Dim` 射线拦截、悬浮详情页布局/样式归属保护、搜索框文本布局保护均命中，并确认 `Temp/UnityLockfile` 存在。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在现有 Unity 编辑器中验证科技树点击面板外区域、搜索输入、悬浮详情页关闭和研究按钮操作。
- 在 19.5:9、18:9、16:9 和 4:3 分辨率下检查科技树详情页是否保持 Prefab 预设位置且不遮挡研究列表。
- 继续审计生产/选择面板的动态条目回收、长文本和模态输入边界。

## 2026-08-09 - 选中面板队列本地化与标题一致性优化

### 修改内容
- 为选中面板补齐 `Waiting`、`Current Research`、`Production Queue`、`Unit Production`、`Building Actions`、`Categories` 和队列空态相关本地化 key。
- 生产队列与研究队列的等待、研究中、剩余时间和空队列提示统一使用本地化文本，避免英文模式出现中英混排。
- PC/移动端生产、研究、建筑操作和分类标题改用稳定的本地化 key；Prefab-owned 标题也经过同一入口刷新，不再直接写入中文展示文本。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 选中建筑的生产/研究页面、队列空态、队列进度以及 PC/移动端页面标题。
- 不改变生产队列、研究队列、取消操作或筛选逻辑，只统一展示文本来源。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查确认队列空态、等待、研究中、剩余时间和标题均命中本地化入口，并确认 `Temp/UnityLockfile` 存在。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在现有 Unity 编辑器中切换中英文，检查生产/研究页标题、队列空态、等待条目和剩余时间刷新。
- 在窄屏移动端确认队列空态和长标题不覆盖卡片按钮或滚动区域。
- 继续核对动态队列条目是否只清理运行时对象，并检查页面关闭时的射线状态。

## 2026-08-09 - 生产面板动态按钮容错与 Prefab 布局保护

### 修改内容
- 动态生产/研究按钮 Prefab 缺失时立即隔离失败，不再继续绑定监听器和布局，避免把配置错误升级为运行时 `NullReferenceException`。
- 快速操作行只在至少成功创建一个按钮时显示，避免出现空白操作行或不可点击的残留容器。
- 生产操作按钮、快速按钮及其标签、图标遵守 Prefab-owned 布局和样式，不再覆盖 Prefab 中的锚点、尺寸、字体和视觉配置；动态名称与图标仍由运行时绑定。

### 修改文件
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 选中建筑的生产按钮、研究按钮、快速操作行和按钮重建失败路径。
- 不改变生产/研究数据、队列状态或按钮业务回调，只收口动态节点创建失败和布局归属。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，0 个警告。
- 静态检查确认工厂返回值、空按钮保护、快速行可见性、Prefab 布局/样式保护均命中，并确认 `Temp/UnityLockfile` 存在。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在现有 Unity 编辑器中验证生产 Prefab 正常时按钮仍可点击，缺失动态按钮 Prefab 时页面不报错且不显示空白行。
- 在窄屏移动端检查生产按钮文字、图标和队列区域不会被运行时重排覆盖。
- 继续审计选中面板剩余硬编码文本、页面关闭后的射线状态和长文本摘要。

## 2026-08-09 - 选中面板动态状态本地化与关闭射线核对

### 修改内容
- 将操作详情卡的建筑/单位分组、可用性、风险提示、停止/巡逻/采集/自动技能/建造/集结/改造/献祭/拆除等动态文案统一接入 `LocalizationManager`。
- 将 PC 建筑操作标题、研究空态、机械改造分类空态、目标/槽位/改造次数/进度/待机状态统一接入本地化入口，避免切换英文后出现中英混排。
- 核对选中面板关闭动画的 `CanvasGroup.interactable` 与 `blocksRaycasts`，确保面板隐藏过程中及完全关闭后不会继续拦截战场输入；保留现有 Prefab 布局与交互节点归属。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 选中单位/建筑的 PC 操作详情、生产/研究页面标题与空态、机械改造页面状态、面板关闭输入边界。
- 不改变选择、生产、研究、改造或按钮回调逻辑，只统一动态展示来源并确认关闭状态的输入隔离。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查确认操作详情/机械状态/研究空态/PC 标题命中本地化入口，并确认关闭动画同步清理 `interactable` 与 `blocksRaycasts`；`Temp/UnityLockfile` 仍存在。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在现有 Unity 编辑器中切换中英文，检查操作详情卡、机械改造页和研究空态是否完全一致。
- 验证选中面板关闭动画期间点击原面板区域不会阻挡战场操作；重新打开后按钮仍可操作。
- 继续审计其余战斗 HUD 的长文本截断、移动端安全区和页面之间的返回栈一致性。

## 2026-08-09 - 世界 HUD 短标签本地化与窄空间适配

### 修改内容
- 世界血条的攻击、护甲、射程摘要改用现有本地化短标签，英文模式不再显示固定中文缩写。
- 英雄与建筑类型徽记使用独立的短标签本地化 key：中文保持单字标记，英文使用 `H/B`，避免窄 HUD 中出现长文本挤压。
- 保留 WorldHudItem Prefab 的字体、锚点和样式归属，运行时只绑定状态值与短文本。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗场景世界单位/建筑 HUD 的类型徽记和核心属性摘要。
- 不改变血条刷新节奏、单位状态判断、Prefab 结构或世界点击输入。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查确认核心属性和类型徽记均命中本地化 key，并确认 `Temp/UnityLockfile` 存在。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在现有 Unity 编辑器中切换中英文，检查世界 HUD 的属性摘要、英雄/建筑徽记在窄屏下不溢出。
- 在高密度单位场景检查 HUD 文字刷新不会遮挡名称、血条或战斗提示。
- 继续审计战斗 HUD 的长状态文本截断和移动端安全区。

## 2026-08-09 - 战斗告警 HUD 移动端安全区适配

### 修改内容
- 为战斗告警 banner、战斗状态条和右侧告警 feed 增加安全区动态重算，适配刘海、系统手势区和横竖屏/分辨率变化。
- 只调整非 Prefab-owned 根节点的运行时位置与尺寸，Prefab-owned 布局继续由资源控制。
- 使用缓存的屏幕尺寸、安全区和移动布局状态，避免每帧重复写入布局属性。

### 修改文件
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗中顶部告警、战斗状态提示和右侧战斗 feed 的移动端位置与分辨率切换行为。
- 不改变告警事件、持续时间、音频、射线关闭或 Prefab 固定结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 错误，12 个既有编辑器警告。
- 静态检查确认安全区缓存、三处 HUD 根节点的 Prefab 布局保护和 `UiSafeAreaUtility` 调用均命中，并确认 `Temp/UnityLockfile` 存在。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在实际带刘海/手势区的移动设备或模拟器中验证告警条不贴边、不遮挡系统区域。
- 在 19.5:9、横屏和 4:3 分辨率切换时检查告警 feed 与战斗状态条不会跳位或压住核心 HUD。
- 继续审计战斗 HUD 的动态状态长文本和移动端触控安全区。

## 2026-08-09 - 世界 HUD 状态文本溢出收口

### 修改内容
- 将世界 HUD Prefab 的告警、状态和状态进度文本垂直溢出策略改为截断，避免英文长状态在固定血条行内换行并覆盖其他信息。
- 保留横向换行与现有字号、颜色、锚点和 Prefab-owned 样式，动态状态仍由 `WorldHudManager` 绑定。

### 修改文件
- `Assets/Resources/UI/Prefabs/InGame/WorldHudItem_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 世界单位/建筑 HUD 的告警文本、活动状态、核心属性摘要和状态进度文本。
- 不改变战斗状态判断、刷新频率、血条数值或世界交互。

### 验证方式
- 静态检查确认 `AlertText`、`StatusText`、`StatusProgressText` 三个固定节点的 `m_VerticalOverflow` 均为截断模式。
- 前一批运行时代码与编辑器代码编译均已通过：运行时 0 错误、182 个既有警告；编辑器 0 错误、12 个既有警告。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在高密度单位场景和英文模式下检查状态文本是否被合理截断且不影响名称、血条和属性摘要阅读。
- 继续审计移动端触控安全区及战斗 HUD 页面切换后的输入状态。

## 2026-08-09 - 研究卡详情文本溢出保护

### 修改内容
- 将建筑研究卡详情文本从强制垂直溢出改为非 Prefab-owned 时的截断模式，长科技描述不会越出卡片并覆盖状态角标或相邻卡片。
- 保留 ResearchButton Prefab 的字体、颜色和布局归属，运行时继续只绑定科技名称、详情、图标、状态和点击回调。

### 修改文件
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中后的研究卡详情文本，尤其是英文模式和窄屏移动端。
- 不改变科技解锁、研究队列、验证条件或点击行为。

### 验证方式
- 前一批运行时代码与编辑器代码编译均已通过：运行时 0 错误、182 个既有警告；编辑器 0 错误、12 个既有警告。
- 静态检查确认详情文本仅在非 Prefab-owned 样式时设置 `Wrap + Truncate`，并确认 `Temp/UnityLockfile` 存在。
- 现有 Unity 编辑器已占用项目，本轮未启动第二个 Unity 实例，未宣称 PlayMode/设备视觉验证已完成。

### 后续注意事项
- 在建筑研究页检查详情长文案截断位置、状态角标和研究按钮点击区域。
- 继续审计移动端触控安全区及页面切换后旧面板的输入状态。

## 2026-08-09 - 建造卡 Prefab 布局归属保护

### 修改内容
- 收口建造卡、分类按钮、图标、阵营徽章、信息带、费用行和状态文本的运行时布局/样式写入，仅在非 Prefab-owned 节点上重排或套用装饰。
- 修复通用建造面板、按钮和固定高度文本仍会绕过归属保护的问题，避免反复切换分类或重建页面后覆盖 Prefab 设计、长文案溢出或造成移动端卡片挤压。
- 保留动态名称、状态、费用、图标和点击回调更新，不改变建造条件、选中和放置逻辑。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端建造页的分类栏、建造卡和详情卡在重建、切换状态、选中与语言变化时的视觉稳定性和文本可读性。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认按钮文字、图标、卡片信息带、费用行、叠加层和面板装饰均经过 Prefab-owned 保护；`Temp/UnityLockfile` 存在，未启动第二个 Unity 实例。
- 未宣称 PlayMode、设备触控或视觉回归验证已完成。

### 后续注意事项
- 在 Unity 中分别检查 PC/移动布局下的分类按钮、卡片费用行、选中描边和长名称截断。
- 继续审计移动端触控安全区及页面切换后旧面板的输入状态。

## 2026-08-09 - 研究卡与科技树 Prefab 布局保护

### 修改内容
- 修复研究卡调用方在 `CreateIcon` 已完成保护后仍直接覆盖 Accent、科技图标、阵营图标的锚点、样式和图片比例的问题。
- 研究卡的动态高度只在非 Prefab-owned 卡片上写入，保留已配置的 LayoutElement 和固定视觉结构。
- 科技树重建时不再对 Prefab-owned 主面板强制执行 `DockBottomCenter`，避免每次打开、搜索或切换分类时覆盖 PC/移动端 authored 布局。

### 修改文件
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑研究列表与科技树页面的卡片刷新、分类切换、搜索和移动端重建流程。
- 不改变研究条件、队列、科技解锁、搜索过滤或点击行为。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认研究卡图标/Accent/Badge 和科技树底部停靠均遵守 Prefab-owned 边界；`Temp/UnityLockfile` 存在，未启动第二个 Unity 实例。
- 未宣称 PlayMode、设备触控或视觉回归验证已完成。

### 后续注意事项
- 在 Unity 中检查研究卡长文案、状态徽章、科技树底部队列和安全区边缘的实际位置。
- 继续审计移动端触控安全区及页面切换后旧面板的输入状态。

## 2026-08-09 - 生产详情页升级区布局刷新保护

### 修改内容
- 修复生产详情页 `RefreshLayoutHeights()` 在每次选中、资源或语言刷新时无条件写入升级区 LayoutElement 和固定升级条位置/高度的问题。
- 仅对非 Prefab-owned 节点保留运行时布局重排，避免页面切换或状态刷新造成升级条跳动、覆盖 authored 布局或移动端底部区域错位。

### 修改文件
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑生产/详情页的升级区、固定升级条和页面刷新流程。
- 不改变升级条件、资源扣除、生产队列、研究队列或关闭动画。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认升级区 LayoutElement 与固定升级条位置写入均有 Prefab-owned 保护；`Temp/UnityLockfile` 存在，未启动第二个 Unity 实例。
- 未宣称 PlayMode、设备触控或视觉回归验证已完成。

### 后续注意事项
- 在 Unity 中切换不同建筑、资源不足/充足和升级进行中状态，确认固定升级条不跳动且仍可点击。
- 继续审计移动端触控安全区及页面切换后旧面板的输入状态。

## 2026-08-09 - 战斗 HUD 设置按钮模板保护

### 修改内容
- 设置按钮保留 Prefab-owned 文本的字号、对齐、缩放和溢出配置，运行时仅刷新本地化按钮文案。
- 继续保留移动端安全区对按钮根节点的环境内缩逻辑，避免刘海/系统手势区遮挡，同时不重写按钮模板的固定视觉样式。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 右上角设置入口在 PC/移动模式切换、语言切换和 HUD 重建时的稳定性与可读性。
- 不改变设置页打开、暂停、返回键或输入拦截逻辑。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认设置按钮文本样式写入有 Prefab-owned 保护，`Temp/UnityLockfile` 存在，未启动第二个 Unity 实例。
- 未宣称 PlayMode、设备触控或视觉回归验证已完成。

### 后续注意事项
- 在 Unity 中检查移动横屏刘海/手势区、PC 模式和中英文按钮文案的实际可读性。
- 继续审计移动端触控安全区及页面切换后旧面板的输入状态。

## 2026-08-09 - 主菜单页面布局辅助函数保护

### 修改内容
- 为主菜单公共 `ForceFullStretch`、`ForceStretchLayout`、`ForceDynamicListRowLayout`、`ForceTopAnchoredLayout` 和 `ForceButtonLayout` 增加 Prefab-owned 判断。
- 保留动态页面节点的原有布局计算，同时避免设置、实例选择、模式卡和 Codex 预制页面在 `ShowPage()`/切换语言后被运行时几何写入覆盖。
- 不改变页面导航、返回键、按钮回调、页面可见性或运行时动态内容绑定。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单 Home、实例选择、设置、Codex 和模式设置页的 PC/移动端重建与页面切换布局稳定性。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认五个公共布局辅助函数均跳过 Prefab-owned RectTransform；`Temp/UnityLockfile` 存在，未启动第二个 Unity 实例。
- 未宣称 PlayMode、设备触控或视觉回归验证已完成。

### 后续注意事项
- 在 Unity 中切换主菜单各页、语言和移动/PC 控制方案，确认预制页面布局不被重建抖动。
- 继续审计移动端触控安全区及页面切换后旧面板的输入状态。

## 2026-08-09 - 主菜单动态绑定样式归属保护

### 修改内容
- `CreatePanel`、`CreateLabel`、`CreateButton` 和 `BindButton` 在复用预制节点时不再无条件覆盖面板装饰、文字字体/阴影、按钮 ColorBlock 和按钮 Chrome。
- 保留运行时本地化文案、按钮事件、按压反馈和动态非 Prefab 节点的视觉处理。
- 为 Accent Strip 的直接 pivot 写入增加布局归属判断，避免页面重建再次覆盖 authored 几何。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单 Home、设置、实例选择、Codex 和模式页的预制视觉稳定性、文本可读性与按钮交互反馈。
- 不改变导航路径、返回键、页面可见性或动态本地化逻辑。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认主菜单按钮/面板/文本的样式写入均经过 Prefab-owned 判断；`Temp/UnityLockfile` 存在，未启动第二个 Unity 实例。
- 未宣称 PlayMode、设备触控或视觉回归验证已完成。

### 后续注意事项
- 在 Unity 中切换各主菜单页面并反复进入设置/Codex，确认事件不重复、布局不抖动、预制样式保持一致。
- 继续审计移动端触控安全区及页面切换后旧面板的输入状态。

## 2026-08-09 - 小地图时间徽章样式保护

### 修改内容
- 小地图时间徽章的 Outline 仅在非 Prefab-owned 时设置颜色和描边距离，避免刷新地图或切换展开状态时覆盖预制视觉配置。
- 保留比赛时间动态文本和小地图交互逻辑不变。

### 修改文件
- `Assets/Scripts/UI/MinimapUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 小地图时间徽章的视觉稳定性。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认 Outline 样式写入有 Prefab-owned 保护；`Temp/UnityLockfile` 存在，未启动第二个 Unity 实例。
- 未宣称 PlayMode、设备触控或视觉回归验证已完成。

### 后续注意事项
- 在 Unity 中检查小地图展开/收起、比赛时间刷新和英文模式下徽章边框是否保持一致。
- 继续审计移动端触控安全区及页面切换后旧面板的输入状态。

## 2026-08-09 - 战斗设置移动端布局辅助保护

### 修改内容
- 为战斗设置页的 `SetStretchRect`、`SetTopStretchRect`、`SetTopLeftRect`、`SetTopRightRect` 和 `SetGridCellRect` 增加 Prefab-owned 布局保护，避免移动端重建覆盖固定控件几何。
- 为 `ApplyTextStyle` 和按钮标签样式增加 Prefab-owned 样式保护，同时保留动态行根节点的按索引定位，确保设置项/存档项不会叠行。
- 对滚动内容根节点仅在非 Prefab-owned 时初始化几何，继续保留 ScrollRect 的绑定和动态内容高度更新。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗内设置、存档管理的 PC/移动端行布局、按钮触控区、滚动内容和长文案显示。
- 不改变滑块监听器修复、返回键、暂停遮罩或设置保存逻辑。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认公共布局/文字辅助函数具备 Prefab-owned 判断，并确认动态行根节点仍按索引定位；`Temp/UnityLockfile` 存在，未启动第二个 Unity 实例。
- 未宣称 PlayMode、设备触控或视觉回归验证已完成。

### 后续注意事项
- 在 Unity 中反复打开设置/存档页、切换移动布局与语言，确认行不叠加、按钮仍可拖动/点击、长文案合理截断。
- 继续审计移动端触控安全区及页面切换后旧面板的输入状态。

## 2026-08-09 - 独立生产窗口装饰层 Prefab 归属保护

### 修改内容
- `BuildingUnitProductionWindowUI` 的面板阴影和顶边高光仅在非 Prefab-owned 时写入几何、层级与颜色，避免每次打开生产窗口覆盖桌面/移动端模板。
- 保留阴影、高光的非交互射线设置，确保装饰层不会截断生产窗口内部输入。

### 修改文件
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 独立生产窗口的面板深度阴影、边缘高光和移动端/PC 模板稳定性。
- 不改变生产队列、关闭按钮、模态遮罩或生产逻辑。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认固定装饰的布局/样式写入经过 Prefab-owned 判断；`Temp/UnityLockfile` 存在，未启动第二个 Unity 实例。
- Unity MCP 当前不可用，未宣称 PlayMode、设备触控或视觉回归验证已完成。

### 后续注意事项
- 在 Unity 中打开独立生产窗口并切换 PC/移动布局，确认阴影、高光、标题和生产面板均保持 Prefab 配置。
- 继续审计剩余战斗 HUD 动态容器，区分运行时数据布局与固定 Prefab 几何。

## 2026-08-09 - 高频 UI 文案本地化与动态模板保护

### 修改内容
- 建造开发面板的建造卡状态改为通过本地化键显示，避免英文模式出现固定 `LOCK` / `MISS` 文案。
- 建造卡图标仅在非 Prefab-owned 样式时由运行时写入颜色和比例属性，保留 Prefab 的图标模板表现。
- 移动端取消施法区域改用本地化标题/提示，并避免每帧覆盖 Prefab-owned 字体字号。
- 战役教程目标、科技树研究列表、机械改造卡/槽位/状态、增益图标短标签统一接入本地化键，减少中英混排和固定中文写入。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造、移动端技能施法、战役教程、科技树、机械改造和战斗增益提示的动态文案与模板样式稳定性。
- 不改变资源消耗、研究/改造逻辑、点击行为或动态数据刷新流程。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认 UI `.text =` 直接写入没有残留中文，关键动态模板保护和本地化入口均命中。
- `Temp/UnityLockfile` 存在；Unity 当前已有编辑器占用，未启动第二个实例。
- Unity MCP 当前不可用，未宣称 PlayMode、设备触控或视觉回归验证已完成。

### 后续注意事项
- Unity 可用后回归中文/英文、PC/移动端的建造卡、取消施法、战役教程、科技树和机械改造卡。
- 继续审计剩余页面的输入状态、动态布局和 Prefab-owned 写入边界。

## 2026-08-09 - 主菜单间接本地化键补齐与 UI 预制体库审计

### 修改内容
- 补齐主菜单设置页、章节模板和节点模板通过 `SetText` 间接使用的本地化键，避免中文模式回退到英文原文。
- 对 UI 预制体库进行静态完整性检查，确认非废弃类型无重复条目、无空 Prefab 引用，并覆盖当前枚举范围。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单设置、战役章节/节点信息、中文/英文切换后的 UI 文案一致性。
- 不改变页面导航、研究/生产队列和游戏玩法逻辑。

### 验证方式
- `SetText` 间接本地化键静态检查：缺失键 0 个。
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- UI 预制体库静态检查：146 个条目、无重复类型、无空 Prefab 引用；`Temp/UnityLockfile` 存在，未启动第二个 Unity 实例。

### 后续注意事项
- Unity 可用后回归主菜单设置页语言切换、战役章节/节点页面以及 PC/移动端布局。
- 继续进行 Unity PlayMode、触控与视觉回归，当前未宣称这些验证已完成。

## 2026-08-09 - 动态取消按钮事件绑定收敛

### 修改内容
- 研究队列取消按钮和机械改造取消按钮由 `RemoveAllListeners` 改为只移除对应运行时处理器后再绑定，避免页面重建时重复触发，同时保留 Prefab 持久化事件。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 科技树当前研究取消、建筑机械改造取消的重复打开/刷新行为。
- 不改变取消操作本身和队列数据逻辑。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 静态检查确认取消按钮仅移除对应运行时处理器。
- Unity 当前已有编辑器占用，未启动第二个 Unity 实例；未宣称 PlayMode、设备触控或视觉回归已完成。

### 后续注意事项
- 在 Unity 中反复打开科技树和机械改造页，确认取消按钮单击只执行一次且模板事件仍保留。

## 2026-08-09 - 生产研究空状态与 SelectionPanel 生命周期收敛

### 修改内容
- 建筑研究面板始终初始化本地化标题，并根据建筑、研究队列和科技列表状态显示准确的空状态提示，避免残留“请选择研究卡片”或上一建筑内容。
- SelectionPanel 在自身被禁用时进入生命周期清理状态，解绑技能/单位时跳过自动化栏和动作按钮重新布局，避免 prefab 绑定异常触发二次布局错误。

### 修改文件
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑研究页的标题、无建筑/无队列/无研究内容空状态。
- SelectionPanel 的异常禁用、技能解绑和 UI 清理流程；不改变正常选择、生产或研究逻辑。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认 SelectionPanel 生命周期保护只在 OnDisable 清理期间生效，关键 UI prefab 已具备生产队列布局、按钮 Outline/Mask 和小地图雾层 RawImage。
- Unity 当前已有编辑器占用，未启动第二个 Unity 实例；未宣称 PlayMode、设备触控或视觉回归已完成。

### 后续注意事项
- Unity 可用后验证 SelectionPanel 绑定异常不会触发重复布局，并回归建筑研究页的三种空状态。
- 继续进行 PC/移动端 UI 的实际点击、触控和视觉回归。

## 2026-08-09 - 模态页面切换清理瞬态战斗输入

### 修改内容
- 打开暂停/设置页时清除攻击移动、巡逻、集结点、技能瞄准及移动端指令模式，避免恢复游戏后的首个点击误执行旧指令。
- 打开建造、生产和科技树主页面时同步清除瞬态世界指令，统一页面切换与战斗输入的交互边界。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 暂停菜单、建造页、生产页和科技树页的打开行为及页面切换后的首个点击处理。
- 不改变建造、生产、研究数据和指令执行逻辑，只清理已离开当前交互上下文的瞬态状态。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认四个 UI 入口均调用 `CancelInteractiveModes`；Unity 当前已有编辑器占用，未启动第二个 Unity 实例。

### 后续注意事项
- Unity 可用后验证处于攻击移动、集结点、技能瞄准或移动端指令模式时打开上述页面，恢复后不会执行旧目标。
- 继续进行 PC/移动端 UI 的实际点击、触控和视觉回归。

## 2026-08-09 - 存档删除与认输操作二次确认

### 修改内容
- 局内存档管理和主菜单存档管理的删除按钮改为三秒内再次点击确认，避免误触造成不可逆存档删除。
- 局内“放弃比赛”改为三秒内再次点击确认，切换页面、恢复游戏或游戏状态变化时自动取消待确认状态。
- 确认提示与删除/认输状态补充中英文本地化键，并清理页面切换后残留的旧状态文案。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 生存模式局内存档、主菜单存档管理和暂停菜单的高风险操作。
- 不改变存档数据格式或比赛结束逻辑，只增加用户确认门槛和状态清理。

### 验证方式
- 运行时代码编译通过：0 个错误、182 个既有警告。
- 编辑器代码编译通过：0 个错误、12 个既有警告。
- 静态检查确认 UI 中的 `DeleteSave` 均经过二次确认入口，确认文案本地化键已注册；Unity 当前已有编辑器占用，未启动第二个 Unity 实例。

### 后续注意事项
- Unity 可用后分别验证主菜单、局内 PC 点击和移动端触控下的首次点击、二次确认、超时取消及返回页面行为。
- 继续进行全局 UI 的页面视觉、空状态和触控回归。

## 2026-08-09 - 结算返回栈与主菜单切页生命周期优化

### 修改内容
- 结算页接入统一返回键行为：非总览页先返回总览，总览页再返回当前模式设置页，覆盖 PC ESC 与移动端系统返回输入。
- 结算页仅在非 Prefab-owned 文本上使用运行时字体，保留结算 Prefab 的字体和视觉样式。
- 主菜单切页销毁旧页面前先禁用旧根节点，避免延迟销毁期间旧页面与新页面同帧可见或继续拦截射线。

### 修改文件
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 结算页的返回路径、字体样式保留和 PC/移动端页面栈体验。
- 主菜单页面切换首帧的可见性与输入命中；不改变比赛结果、页面数据和导航目标。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，12 个警告。
- 静态检查确认返回键分层、Prefab-owned 字体保护和主菜单旧页销毁前禁用逻辑均命中。
- Unity 当前已有编辑器占用，未启动第二个 Unity 实例；未宣称 PlayMode、设备触控或视觉回归已完成。

### 后续注意事项
- Unity 可用后验证结算总览/详情页的 ESC 与移动端系统返回顺序，并检查预制字体仍保持一致。
- 在主菜单快速连续切换首页、设置、存档和图鉴，确认旧页不闪现、不抢射线。

## 2026-08-09 - 生产详情动态按钮回收防重叠

### 修改内容
- 快速生产/研究按钮和建筑操作按钮在延迟销毁前先禁用，避免生产详情页重建过程中旧条目继续参与布局或拦截点击。

### 修改文件
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑详情页切换建筑、资源状态刷新和语言刷新时的动态操作列表生命周期。
- 不改变按钮数据、生产/研究条件或建筑操作逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个既有警告。
- 静态检查确认两个动态按钮清理路径均在 `Destroy` 前移除 active、布局和射线参与。
- Unity 当前已有编辑器占用，未启动第二个 Unity 实例；未宣称 PlayMode、设备触控或视觉回归已完成。

### 后续注意事项
- Unity 可用后快速切换不同建筑并在资源变化时观察操作按钮是否只保留当前建筑条目，且移动端点击区域不重叠。

## 2026-08-09 - 全局动态 UI 条目销毁生命周期优化

### 修改内容
- 统一生产、建造、科技树、选择、研究、Codex、设置、求生任务和战斗提示等动态列表的清理行为：在 Unity 延迟销毁前先禁用旧条目。
- 覆盖动态按钮、队列项、成本槽、分类标签、任务卡和战斗提示流，避免重建期间旧内容继续显示、参与布局或拦截点击。
- 修正移动端攻击移动按钮的可见性条件：仅对可操作的移动单位显示，恢复已存在的点击处理和圆形移动端布局入口。
- 保留现有 Prefab-first 结构和动态数据绑定方式，不新增依赖，不改变游戏数据与指令规则。

### 修改文件
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 所有会因选中对象、资源、语言、科技/生产队列或模式状态变化而重建动态 UI 条目的页面。
- 改善页面快速切换和刷新时的首帧视觉稳定性、射线命中和移动端点击可靠性；不改变条目生成规则和业务校验。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个既有警告。
- 静态检查确认本轮动态子项清理路径均在 `Destroy` 前调用 `SetActive(false)`；Unity 当前已有编辑器占用，未启动第二个 Unity 实例。
- 尚未宣称 Unity PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证快速切换建筑/单位、资源刷新、科技筛选、Codex 分类、设置页和求生任务列表时，不出现旧条目闪现、重叠或点击落到上一批内容。
- 继续进行全局 UI 的实际输入、分辨率、安全区和视觉回归。

## 2026-08-09 - 页面栈与暂停设置可选节点复位

### 修改内容
- 主菜单战役页的返回键只关闭当前实际显示的弹层；隐藏但仍存在于层级中的弹层不再消耗一次返回输入，并在延迟销毁前立即禁用。
- 暂停页每次重建前先禁用未使用的 `Menu_0` 至 `Menu_9` 预置按钮，避免非生存模式显示多余操作入口。
- 暂停、设置和存档页重建前复位可选 `Status` 节点，避免上一页或上一轮操作的旧状态文案残留并继续参与射线。
- 保持现有 Prefab-first 页面结构、按钮绑定和移动端布局，不新增依赖或改变业务操作规则。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单战役弹层返回栈、暂停菜单的模式差异、设置/存档页的状态提示生命周期。
- 改善 PC ESC、移动端返回和快速切页时的输入消费、可见性与射线命中；不改变存档、认输和返回目标。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个既有警告。
- 静态检查确认战役弹层关闭条件包含 `activeInHierarchy`，暂停菜单按钮和状态节点均在页面重建前复位。
- Unity 当前仍有编辑器占用，未启动第二个 Unity 实例；未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证竞技/生存两种暂停菜单、设置与存档页来回切换，确认按钮数量、状态提示和 ESC/系统返回顺序正确。
- 继续进行主菜单全部页面、不同分辨率安全区和真实移动端触控的视觉回归。

## 2026-08-09 - 战斗设置状态重建与键盘焦点优化

### 修改内容
- 调整暂停/恢复页面与 `GameStateChangedEvent` 的状态顺序：先写入目标页面，再由同步状态事件负责一次重建；没有事件订阅时才使用主动重建兜底，避免同一次操作重复销毁/创建 UI。
- 打开暂停、控制设置和存档页时，将 EventSystem 焦点交给页面内首个可用按钮，改善 PC 键盘/手柄打开页面后的连续导航。
- 关闭战斗设置或离开暂停状态时清空已销毁页面留下的旧选中对象，避免输入继续落到失效控件。
- 保留现有设置 Prefab、移动端点击区域和业务操作，不新增依赖或改变游戏状态规则。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 局内暂停菜单、控制设置、存档页的打开/关闭生命周期、ESC/系统返回和 PC 键盘/手柄导航。
- 减少页面切换时的重复重建和首帧不稳定；不改变暂停、恢复、设置保存和存档逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个既有警告。
- 静态检查确认 `SetGameState` 后仅在未订阅事件时主动 `Rebuild()`，页面焦点只从当前可见页的 Prefab 按钮中选择。
- Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证 Playing→Paused、暂停页→设置页→存档页→返回和 Paused→Playing 的重建次数、焦点跳转与 ESC/系统返回顺序。
- 继续审计主菜单非战斗页面的 Prefab 覆盖、移动端安全区和实际设备视觉布局。

## 2026-08-09 - 主菜单与结算页跨页面焦点恢复

### 修改内容
- 主菜单切页和同页重建后，优先按重建前的控件名称恢复键盘/手柄焦点；控件不存在或不可交互时，自动选择当前页面首个可交互控件。
- 进入战斗时清除主菜单的 EventSystem 选中对象，避免旧页面销毁后继续保留失效焦点。
- 结算页重建后优先恢复原标签/按钮焦点；首次进入或原控件不可用时，优先聚焦主要操作按钮，再回退到结算标签。
- 结算页隐藏时清空选中对象；移动端跳过强制焦点设置，保留触控操作的自然状态。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单 Home、模式选择、设置、存档、Codex、战役页和结算页的页面切换、同页刷新、ESC 返回与 PC 键盘/手柄导航。
- 改善页面重建后的输入连续性，避免焦点落到已销毁控件；不改变移动端点击路径、页面返回栈和游戏业务逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误。
- 静态检查确认主菜单/结算页均包含焦点恢复、移动端跳过条件和隐藏时清理选中对象。
- Unity 当前仍有编辑器锁和已有进程，未启动第二个 Unity 实例；未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证主菜单所有页面、结算详情标签、键盘/手柄连续导航及不同分辨率下焦点高亮位置。
- 继续审计非 Prefab 覆盖的主菜单页面，补齐可维护的页面 Prefab 资源，而不是恢复运行时可见兜底壳。

## 2026-08-09 - 战斗详情浮层返回与动态内容生命周期优化

### 修改内容
- 移除操作详情卡自身重复的 ESC 监听，统一由 `GameUI`/`SelectionPanel` 消费最高层返回输入，避免详情卡关闭后同一帧误打开暂停设置。
- 操作详情卡重建标签和分段内容时，在延迟销毁前先禁用旧节点，避免旧文案、布局和射线在新内容生成期间残留一帧。
- 详情卡、Buff 详情和编组弹层的关闭/技能热键判断改用 `activeInHierarchy`，隐藏在已关闭父节点下的节点不再拦截返回或快捷键。
- 保留现有详情卡 Prefab、悬停/长按/右键固定行为和移动端触控路径。

### 修改文件
- `Assets/Scripts/UI/OperationDetailCardView.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 的单位、建筑、科技、技能和机械改造详情浮层，以及 PC ESC、技能快捷键和移动端返回行为。
- 修复同一输入被多个 Update 生命周期重复消费、隐藏弹层截断返回栈和动态详情内容短暂重叠的问题。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个既有警告。
- 静态检查确认操作详情卡仅由统一 HUD 返回链关闭，动态条目销毁前会先禁用，并且隐藏父层不再满足顶层弹层条件。
- Unity 当前仍有编辑器锁和已有进程，未启动第二个 Unity 实例；未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证悬停详情、长按固定、右键固定、ESC 连续返回，以及详情内容快速切换时无旧内容闪现或点击串页。
- 继续审计战斗 HUD 的状态同步、快捷键边界、移动端安全区和 Prefab 覆盖完整性。

## 2026-08-09 - 检查模式技能快捷键边界修复

### 修改内容
- `SelectionPanel` 在绑定只读检查单位时屏蔽 Q/W/E/R/F 技能快捷键，确保检查态与已隐藏/禁用的动作按钮保持一致。
- 不改变可操作单位的技能热键、自动施法和移动端按钮行为。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 查看敌方或被检查单位时的技能快捷键输入边界，避免只读界面执行实际战斗指令。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个既有警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个既有警告。
- 静态检查确认 `boundUnitReadOnly` 在技能快捷键入口优先拦截。
- Unity 当前仍有编辑器锁和已有进程；未宣称 PlayMode、设备触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证选中己方单位、检查敌方单位、切回己方单位三种状态下 Q/W/E/R/F 的可用性切换。

## 2026-08-09 - 移动端技能拖拽取消区状态同步优化

### 修改内容
- 将移动端技能拖拽取消区的显示条件从已停用的旧单位控制条可见度，改为现代 `MobileUnitActionOverlay` 的实际层级可见状态。
- 在 `GameUI.Update` 中持续刷新取消区的淡入淡出、屏幕命中矩形和 HUD 隐藏清理，覆盖技能拖拽开始、结束、页面切换与暂停返回等状态变化。
- 移除已不再参与逻辑的旧移动端控制条可见度字段，避免旧状态继续误导输入判断。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 移动端战斗 HUD 的技能按钮拖拽施法、释放到取消区、取消区屏幕命中判断，以及 HUD/暂停状态切换时的输入清理。
- 不改变 PC 技能快捷键、移动端技能点击施法和现有 Prefab 布局；取消区仍由 `SkillTargetPreview_Prefab` 提供视觉结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个警告。
- 静态检查确认取消区不再依赖 `mobileUnitControlBarVisibility`，并且由 `SelectionPanel.IsMobileActionOverlayVisible` 与每帧刷新路径共同约束。
- Unity 当前仍有编辑器锁和已有进程；未启动第二个 Unity 实例，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证移动端技能按钮点击、长按拖拽到地图释放、拖拽到取消区释放、拖回按钮区域释放，以及暂停/返回期间取消区不残留。

## 2026-08-09 - 选中详情摘要本地化与乱码修复

### 修改内容
- 将选中单位、建筑的战术摘要改为使用本地化键，修复定位、存活、输出、功能、状态和耐久标签的乱码显示。
- 将运行时属性修正摘要的来源、属性名称和分隔符改为本地化输出，覆盖科技、Buff、建筑光环、单位升级、英雄光环和地形来源。
- 将妖兽突变、吞噬、体质、进化阶段/分支和成长提示改为本地化输出；不改变数值计算、进化条件或吞噬规则。
- 将 PC 详情底部的阵营状态摘要改为本地化输出，覆盖组合阵营、妖兽吞噬进度、机械充能/电路和自然融合/共鸣状态。
- 在 `LocalizationManager` 中补充本次详情摘要所需的中英文键，并使用显式覆盖避免旧资源乱码继续污染显示。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端选中详情面板中的单位、建筑和妖兽摘要文本；战斗逻辑、属性值、技能和生产逻辑不变。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个警告。
- 静态检查确认上述活跃调用点已切换到 `Localized` 摘要路径；旧乱码 helper 不再被详情调用。
- Unity 当前仍有编辑器锁和已有进程；未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证单位、建筑、妖兽三类选中详情在中英文切换、窄屏和长文本下的换行与布局。

## 2026-08-09 - 主菜单设置滑块反馈与 Prefab 缺失保护

### 修改内容
- 修复主菜单设置页滑块拖动时数值标签不刷新的问题，滑块值现在会实时显示并保持本地化标签。
- 清理滑块运行时监听后再设置初始值，避免重复打开页面或 Prefab 自带运行时监听造成重复回调。
- 移除缺失滑块 Prefab 时的运行时替代创建逻辑；`MainMenuSlider_Prefab` 或其固定 `Slider/Background/Fill` 节点缺失时隐藏该设置行并记录错误。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单设置页的 Camera Speed、Box Select Sensitivity、Default Camera Height 三个滑块的数值反馈、事件绑定和缺失资源行为；不改变设置存储或运行时消费者。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，12 个警告。
- 静态检查确认滑块入口统一使用 `MainMenuSlider_Prefab`，不再包含 `CreateSliderImage` 或 `new GameObject("Slider")` 替代路径。
- Unity 当前仍有编辑器锁和已有进程；未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证三个滑块拖动时文本、配置保存、重新打开设置页和中英文切换的反馈一致性。

## 2026-08-09 - 主菜单按钮事件状态同步

### 修改内容
- 主菜单动态/复用按钮统一先清理旧点击监听，再绑定当前页面 action。
- 没有 action 的按钮现在明确设为不可交互，避免残留点击行为与当前页面状态不一致。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单首页、设置、存档、战役和模式配置页面的按钮绑定与不可用状态；不改变按钮对应的业务 action。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个警告。
- 静态检查确认 `CreateButton` 统一调用 `RemoveAllListeners`，并由当前 action 决定 `interactable`。
- Unity 当前仍有编辑器锁和已有进程；未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证页面重复打开、键盘导航、返回再进入和空 action 按钮的焦点行为。

## 2026-08-09 - 竞技与生存配置枚举本地化修复

### 修改内容
- 将竞技/生存配置页的难度、地图、地图规模、资源丰度、地形起伏、盆地密度、地表野性、敌人强度和事件频率显示统一改为本地化键。
- 将竞技与生存配置页副标题从乱码硬编码改为中英文本地化键；保留原有枚举值、步进操作和配置写入逻辑。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单竞技设置页和生存设置页的可见文案与枚举步进反馈；不改变模式配置数据或开局逻辑。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个警告。
- 静态检查确认上述枚举显示入口对有效枚举值统一返回 `LocalizationManager.Get(...)`，旧乱码分支仅保留为非法枚举值的兼容兜底。
- Unity 当前仍有编辑器锁和已有进程；未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证竞技/生存设置页中英文切换、窄屏换行、步进按钮焦点和最终启动配置一致性。

## 2026-08-09 - 战役页面弹层与章节状态逻辑优化

### 修改内容
- 战役节点、章节总览、图例/筛选和进入确认弹层统一采用“立即禁用后延迟销毁”的关闭路径，避免关闭或替换时残留一帧视觉与射线。
- 战役页面进入时将草稿章节限制在当前阵营已解锁章节范围内，避免已解锁到后续章节时错误回退到第一章。
- 锁定章节的定位、进入和开始按钮明确设为不可交互，避免出现可点击但没有结果的操作反馈。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单战役地图、章节总览、节点详情和进入确认流程；不改变战役进度存储、章节解锁数据或开局配置结构。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个警告。
- 静态检查确认战役弹层关闭入口均经过 `DestroyCampaignOverlay`，有效解锁状态才绑定定位/进入 action；Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证不同解锁进度进入战役页、章节切换、节点详情与确认弹层的 Esc/关闭按钮返回顺序，以及锁定按钮的键盘和触控反馈。

## 2026-08-09 - 战斗警报与研究取消交互修复

### 修改内容
- 修复 PC 研究队列取消按钮只刷新详情、不实际取消研究的问题；现在调用研究队列取消接口并显示成功/失败反馈。
- 战斗警报只在 Playing/Paused 状态接收事件与生成提示，避免主菜单、结算等非战斗状态继续积累战斗反馈。
- 离开战斗状态时清理警报横幅、边缘闪烁、战况统计、低血量提示和战斗 Feed，避免跨场景/下一局残留。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗内 PC 建筑研究队列、战斗警报 HUD、结算/主菜单切换和下一局 HUD 初始状态；不改变研究成本、退款和科技解锁规则。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个警告。
- 静态检查确认取消按钮调用 `ResearchQueue.CancelCurrentResearch`，战斗警报事件入口与 Feed 入口均受战斗状态门控；Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证研究取消后的资源退款、队列刷新和按钮反馈，并验证战斗→结算→下一局时警报 HUD 不残留。

## 2026-08-09 - 建造与科技页面状态反馈优化

### 修改内容
- 建造放置确认层读取 `BuildingPlacer` 的连续建造权威状态，避免 Toggle 显示与实际放置逻辑不一致。
- 建筑科技研究失败时在面板状态栏显示原因，并立即刷新按钮可用状态，避免只写日志而没有用户反馈。
- 科技树监听资源变化并合并刷新当前可见节点，避免资源变化后科技卡状态滞后。
- 高风险科技研究改为三秒内二次确认，避免按钮文案要求确认但第一次点击直接扣除资源并开始研究。
- 移除移动单位操作层在每次布局刷新时重复调用 `SetAsLastSibling`，减少不必要的 Canvas/Layout 重排并遵守 HUD 预制体层级规则。

### 修改文件
- `Assets/Scripts/Buildings/BuildingPlacer.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗内建造放置确认、建筑科技研究页、科技树资源校验和移动单位操作层；不改变建造成本、科技数据或研究队列规则。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个警告。
- 静态检查确认连续建造状态、研究失败反馈、资源监听注销和高风险确认路径均有明确入口；Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证连续建造 Toggle 的开关/重建状态、资源不足/资源恢复后的科技卡按钮、三秒确认超时，以及移动操作层在不同分辨率和触控下的点击区域。

## 2026-08-09 - 战斗 HUD 返回输入与跨局状态清理

### 修改内容
- 将 Buff 详情、建造页、科技页和所有目标选择模式的 ESC 处理统一收口到 `GameUI`，避免一次返回同时关闭多层或误打开暂停设置。
- `GameUI` 的 PC/移动端返回逻辑统一识别 `InputHandler.HasPendingInteractiveMode`，覆盖集结点、攻击移动、技能瞄准、妖兽目标、自然融合和机械建筑移动等临时模式。
- 离开 Playing/Paused 状态进入结算或主菜单时，清理建造放置、临时指令、生产/研究/建造主面板和选择 HUD，避免下一局继承上一局的界面状态。
- 科技树关闭时清空绑定建筑与研究队列，资源监听只在可见状态注册，避免隐藏科技页持续接收资源变化事件。

### 修改文件
- `Assets/Scripts/Core/InputHandler.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 的 PC/移动端 ESC 返回、世界目标选择取消、暂停入口、结算/主菜单切换和下一局 HUD 初始状态；不改变攻击、技能、建造、研究和生产的业务规则。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，12 个警告。
- 静态检查确认目标模式的 ESC 入口已移除，统一返回只保留在 `GameUI`/对应菜单状态层；确认科技树监听在关闭后不会由 `Update()` 重新注册。
- Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证每种目标模式按一次 ESC 只取消当前模式、再按一次才进入上一层；验证 Playing→结算→主菜单→新局时无旧页面、旧放置预览或旧选择详情残留。

## 2026-08-09 - 交互模式即时反馈与研究确认状态收口

### 修改内容
- 为巡逻、妖兽吞噬/献祭和自然融合目标选择增加可查询的待执行状态，选择面板在进入或取消目标模式后立即刷新按钮高亮与提示。
- 让 `GameUI` 和 `SelectionPanel` 监听交互提示内容变化，目标选择、攻击移动和移动端指令模式变化后即时更新顶部提示，减少等待其他 HUD 刷新造成的“点击无响应”感受。
- 修复同一建筑先点高风险科技、再点普通科技时旧确认状态残留的问题；切换到普通科技会清除旧确认，避免后续点击绕过确认。
- 修复自然融合移动提示的编码乱码，并补充 PC 攻击移动的即时提示。

### 修改文件
- `Assets/Scripts/Core/InputHandler.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗内 PC/移动端目标选择提示、单位自动化按钮状态和建筑科技快捷研究确认流程；不改变单位命令、资源消耗或研究规则。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，12 个既有编辑器警告。
- `git diff --check`：通过；已静态复核提示状态从 `InputHandler` 到顶部 HUD/选择面板的刷新链路。
- Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证巡逻/吞噬/献祭/融合进入与取消时按钮高亮和顶部提示同步，并验证高风险科技切换普通科技后确认不会残留。

## 2026-08-09 - 技能与增益详情的多语言 UX 收口

### 修改内容
- 将选中单位的技能详情从固定中文改为跟随当前语言显示，覆盖施法方式、目标、范围、半径、效果、冷却、持续时间、自动施放状态和操作提示。
- 将 Buff 详情的类型、来源、逻辑、运行说明、效果、影响、当前数值、层数、范围、消耗和高级触发摘要同步到中英文展示。
- 保留 SelectionPanel 的 Prefab 严格绑定行为；确认缺失节点时不会创建新的可见运行时 UI 壳，而是记录错误并禁用对应 HUD。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 的单位技能提示、Buff 详情浮层和高级 Buff 运行摘要；不改变技能施法、Buff 计算、资源消耗或目标选择规则。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，12 个既有编辑器警告。
- 静态复核确认详情入口统一走 `BuildCleanBuff*` / `BuildCleanSkillTip*`，并确认缺失 Prefab 节点仍走错误禁用路径。
- Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后切换中英文分别检查技能详情、Buff 详情、长按/悬停提示的换行和面板高度，并验证窄屏下长英文不会遮挡关闭与固定按钮。

## 2026-08-09 - 主菜单动态设置布局与 SettingsPanel 生成链路修复

### 修改内容
- 修复竞技、生存、存档管理等主菜单动态列表的行根节点布局：动态行可以覆盖通用行 Prefab 的默认尺寸和位置，保留 Prefab 的背景、动效与样式。
- 修复运行时创建的主菜单标题/说明文字和设置滑块仍停留在通用 Prefab 默认位置的问题，避免内容重叠、集中到中心或无法点击。
- 修复编辑器全量生成 UI Prefab 时，旧的目录面板生成器覆盖主菜单 `SettingsPanel_Prefab` 的问题；`SettingsPanel` 类型统一生成主菜单设置页契约。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单竞技/生存配置、存档管理、帮助页和设置页的动态布局，以及 UI Prefab 全量生成流程；不改变对局配置数据、保存数据或设置保存规则。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，12 个既有编辑器警告。
- 静态复核确认固定设置页的 Prefab 行仍使用原布局，只有动态行/运行时标签/运行时滑块允许代码排列；确认 `CreatePrefabForType(SettingsPanel)` 不再调用冲突的旧目录面板生成器。
- Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后在 16:9、18:9/19.5:9 和窄屏下检查竞技/生存设置滚动、滑块、页脚按钮和键盘焦点；验证重新生成 Editable UI Prefabs 后主菜单设置页仍保持 `SettingsHeader/SettingsPanel/SettingsRows/Footer` 结构。

## 2026-08-10 - 局内暂停/设置/存档移动端响应式布局修复

### 修改内容
- 修复局内暂停、设置和存档页面在移动端无法应用响应式锚点的问题：移动分支现在可以覆盖同一套固定 Prefab 节点的运行时位置、尺寸和锚点。
- 修复移动端页面的标题区、页脚区及分隔线仍停留在桌面布局的问题，保证暂停按钮、Tab、滑块、存档操作和返回/应用按钮落在可触摸区域内。
- 保留桌面端 Prefab authored layout；运行时布局覆盖只在 `IsMobileLayout` 调用链下生效，没有改变固定 UI 的 Prefab 样式归属。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 局内暂停、设置和存档管理的移动端布局与触摸可达性；不改变设置数据、存档数据或暂停/恢复状态机。

### 验证方式
- `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，182 个警告。
- `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，12 个既有编辑器警告。
- 静态复核确认移动页面的 `SetStretchRect`、`SetTop*Rect`、`SetGridCellRect` 不再被 Prefab 布局所有权短路，且桌面分支不调用这些覆盖方法。
- Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后用窄屏/刘海屏实机或模拟器检查暂停页、设置页和存档页的滚动、滑块、Tab、页脚按钮和返回流程；同时验证切换横竖屏时 authored layout 不产生残留偏移。

## 2026-08-10 - 全局 UI 移动端平台判定与控制方案切换收口

### 修改内容
- 统一 GameUI、选择面板、生产面板、科技面板、建造面板、详情卡、技能呼叫气泡和结算相关 UI 的移动端判定：真实 Android/iOS 平台即使控制方案管理器尚未完成初始化，也使用移动布局与触摸策略。
- 修复局内设置页应用 Control Scheme 后仍保留旧桌面/移动布局的问题；检测到布局 profile 改变时会重建当前页面，避免按钮位置、Tab、滑块和页脚操作继续使用旧布局。
- 保留 PC 编辑器的控制方案覆盖逻辑，不改变输入设置存储格式和已有 Prefab 结构。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/OperationDetailCardView.cs`
- `Assets/Scripts/UI/OperationDetailCardTrigger.cs`
- `Assets/Scripts/UI/SkillCalloutBubbleManager.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 全局 UI 的 PC/移动端布局选择、触摸交互边界、技能/详情提示密度，以及局内设置应用后的即时视觉状态；不改变战斗、生产、研究或设置数据规则。

### 验证方式
- 串行执行 `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，182 个警告。
- 随后执行 `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，12 个既有编辑器警告。
- 静态复核确认 UI 中的直接移动端判定均包含 `ControlSchemeManager.IsRuntimeMobilePlatform`，局内设置的布局变化检测位于状态重建路径之前。
- Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后分别在 PC、编辑器强制 Mobile、Android/iOS profile 下切换 Control Scheme，验证选择/生产/科技/详情/结算页面不会在同一帧或下一帧落回桌面布局，并检查刘海屏安全区。

## 2026-08-10 - 局内控制方案切换时已打开页面同步重建

### 修改内容
- 修复战斗告警层只按屏幕分辨率判断移动端的问题；编辑器或桌面窗口切换 Mobile Control Scheme 后，告警条、战斗状态条和告警列表会重新应用移动布局与安全区。
- 为选择面板、建造详情、生产详情、独立生产窗口、科技树和单位生产列表补充控制方案变化刷新入口。
- GameUI 检测到 Control Scheme 真正变化时，统一刷新当前已打开页面和动态列表，保留当前选择、生产队列和研究上下文，避免 UI 仍显示旧平台布局或旧交互入口。

### 修改文件
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 局内 PC/移动端控制方案切换时的页面布局、动态列表、按钮可达性和战斗告警安全区；不改变生产、研究、选择或设置数据。

### 验证方式
- 串行执行 `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，182 个警告。
- 随后执行 `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，12 个既有编辑器警告。
- 静态复核确认刷新入口只在 `HandleControlSchemeChange` 检测到方案变化时调用，并确认生产队列、科技树和选择面板均有对应的重建调用。
- Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后分别打开选择、建造详情、生产、科技树页面，再切换 PC/Mobile Control Scheme，检查当前选项和滚动位置是否符合预期；在窄屏/刘海屏检查战斗告警列表和状态条不遮挡操作区。

## 2026-08-10 - 主菜单与结算返回链去重及战斗输入射线复用

### 修改内容
- 修复 MainMenuUI 启动、回到首页和 GameStateChanged 三处重复重建同一页面的问题；状态事件只更新可见性，Home 导航由现有 SessionManager/启动流程负责。
- 为 GameSessionManager 增加保留默认行为的可选 `showHomePage` 返回入口；结算“返回模式选择”直接进入模式页，不再先创建 Home。
- InputHandler 复用 PointerEventData 和 RaycastResult 列表，避免战斗中每次点击 UI 穿透检查产生短生命周期 GC；命中规则不变。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/Core/GameSessionManager.cs`
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Assets/Scripts/Core/InputHandler.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单启动/返回首页、结算返回模式选择、战斗 PC/移动端输入与 UI 穿透检测；不改变游戏状态、对局配置或实际命令规则。

### 验证方式
- 串行执行 `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，182 个警告。
- 随后执行 `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`：0 个错误，12 个警告。
- 静态复核确认只有 GameSessionManager 设置 MainMenu 状态；MainMenuUI 状态监听不再重建页面；结算返回模式选择使用 `showHomePage:false`；InputHandler 不再在每次点击中创建 RaycastResult 列表或 PointerEventData。
- Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、PC/移动端触控或视觉回归完成。

### 后续注意事项
- Unity 可用后验证启动、Playing→Settlement→Mode Selection、结算→MainMenu、MainMenu ESC/焦点恢复，以及 PC/移动端战场按钮、缩略图和浮层上的点击不会穿透。

## 2026-08-10 - 局内建造页状态机与生产窗口宿主显隐修复

### 修改内容
- 修复 PC 建造目录打开时 SelectionPanel 反向关闭 GameUI BuildMenu 状态的问题；现在由 GameUI 先确立主面板状态，SelectionPanel 只负责渲染目录，ESC/B 键、输入拦截和关闭流程保持一致。
- 建造按钮统一通过 GameUI 的主面板入口打开，避免同一帧重复刷新建造目录；选中对象刷新时不再把已打开的 BuildMenu 错误重置为 None。
- 修复 `RefreshBuildMenuVisibility()` 无条件隐藏 `BuildingUnitProductionWindow` Prefab 宿主的问题；生产窗口打开后会持续保留宿主，关闭时仍按原流程隐藏。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 局内 PC/移动端建造目录的主面板状态、建造页关闭与输入拦截，以及建筑生产窗口的打开后显隐；不改变建造、生产、资源或研究规则。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认 BuildMenu 状态在 `OpenEmbeddedBuildPageForCurrentSelection()` 前已写入；SelectionPanel 不再从目录渲染路径关闭宿主；生产窗口仅在 `ProductionMenu + IsOpen` 时跳过隐藏。
- Unity 当前仍有编辑器锁和已有进程，未宣称 PlayMode、视觉和 PC/移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证选中建造单位打开/关闭建造目录、连续按 B/ESC、切换单位后目录状态，以及建筑→生产窗口→返回/关闭；确认生产窗口不会在资源或选择刷新后消失，且背景不会穿透。

## 2026-08-10 - 暂停设置与结算模态状态收口

### 修改内容
- InGameSettingsRoot 在 `Awake` 阶段先强制进入不可见、不可交互状态，避免 HUD Prefab 默认 CanvasGroup 在首帧短暂拦截战场点击。
- 当其他系统直接将对局切换到 Paused 时，局内设置页自动收敛到暂停首页并恢复首个可操作控件焦点，避免出现“游戏已暂停但没有暂停菜单”的状态。
- MatchSettlementUI 每帧校验当前 GameState；若结算事件在换局/加载过程中丢失，会主动清理旧结算层、动态内容和射线拦截，避免挡住下一局或模式选择页。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 局内暂停/设置入口的首帧输入安全、外部暂停状态同步、结算页与下一局/主菜单之间的模态层生命周期；不改变对局规则、设置数据或结算统计。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个既有编辑器警告。
- 静态复核确认 InGameSettingsRoot 初始化会设置 `alpha=0/interactable=false/blocksRaycasts=false`，Paused 外部状态会进入 Pause 页，结算层对非 Victory/GameOver 状态具备主动隐藏路径。
- Unity 当前仍有编辑器锁和已有进程，尚未宣称 PlayMode、视觉、键鼠和移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证 Playing→Paused、Paused→Playing、外部暂停入口、结算→新局/模式选择，以及首帧点击不会被透明设置根拦截；在移动端确认暂停页恢复焦点不会影响触控区域。

## 2026-08-10 - 局内模态输入边界与摄像机 UI 抢焦修复

### 修改内容
- 为 SelectionPanel 增加“是否真正阻断玩法输入”的统一状态：分组选择/管理、置顶技能或 Buff 详情、置顶操作详情会交给 GameUI 的全局输入边界；常驻的 PC 建筑生产/研究/动作页仍保持 HUD 属性，不会错误禁用键盘镜头移动。
- OperationDetailCardView 暴露置顶状态，避免普通悬浮说明卡被误判为模态层。
- CameraController 在暂停、建造放置、交互目标选择、全屏玩法窗口或置顶详情期间清理拖拽惯性和移动触控状态；当指针位于可交互 UI 上时，屏蔽边缘平移、鼠标拖拽平移、滚轮缩放、右键旋转和双指缩放，键盘 WASD 移动保持可用。
- CameraController 对当前输入框焦点和 GameUI 输入边界做缓存查询，避免输入框/模态页仍触发战场镜头。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/OperationDetailCardView.cs`
- `Assets/Scripts/Utils/CameraController.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 局内 PC/移动端战场镜头、选择详情浮层、分组操作，以及建造/生产/科技树相关页面的玩法输入优先级；不改变摄像机速度配置、建造生产研究规则或普通 HUD 页面布局。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认 GameUI 只把明确的模态选择层加入全局阻断；普通 PC 右侧选择页不进入全局阻断；CameraController 对 UI 指针、输入框焦点、模态状态、拖拽惯性和移动触控状态均有对应分支。
- Unity 当前仍有编辑器锁和已有进程，尚未宣称 PlayMode、视觉、键鼠和移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证选中建筑时的右侧生产/研究/动作页：键盘 WASD 可移动镜头，鼠标停在 UI 上不会边缘平移或缩放；打开建造、生产、科技树、分组管理和置顶详情时，镜头输入应完全让位，关闭后不会带出旧拖拽惯性。

## 2026-08-10 - 设置与主菜单页面焦点保持及重建链修复

### 修改内容
- 局内设置页重建前记录当前选中控件相对于设置页根节点的层级路径，重建后优先恢复同一控件，避免切换标签、开关、枚举或状态提示后键盘/手柄导航丢失。
- 恢复焦点时只查找重建后仍处于激活状态的控件，避开 Unity 延迟销毁期间残留的旧页面节点；原控件不存在或不可交互时回退到当前页首个可交互控件。
- 主菜单同页重建改用页面根节点内的层级路径恢复焦点，避免多个动态页面重复使用通用控件名称时把焦点恢复到错误按钮；跨页切换仍回退到首个可交互控件。
- 移动端不通过该恢复链强行夺取键盘焦点，保持触控输入边界不变。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单、局内暂停、控制设置、存档管理页面的 PC 键盘/手柄导航连续性；不改变页面数据、设置数据、存档规则或移动端触控布局。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认焦点路径只从各自页面 root 捕获，恢复时校验 `Selectable` 激活状态与可交互状态，并对移动平台跳过恢复。
- Unity 当前仍有编辑器锁和已有进程，尚未宣称 PlayMode、视觉、键鼠和移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证主菜单同页刷新、暂停页→设置页→各标签切换、开关/枚举修改、保存提示刷新，以及返回暂停页；PC 键盘/手柄焦点应保持在当前控件或合理回退到首控件，移动端不应出现触控被焦点状态干扰。

## 2026-08-10 - 结算与科技树上下文保持修复

### 修改内容
- 结算页重建前按页面根节点记录当前选中控件的层级路径，重建后仅在同一结算结果下恢复仍激活且可交互的控件；跨结果或控件失效时回退到主要操作按钮。
- 科技树切换建筑时清理旧建筑的选中科技，避免打开新建筑后残留旧详情；关闭科技树时同步清理详情状态。
- 科技树因资源、研究队列或语言变化刷新时，保留同一建筑/分类下的选中科技详情和滚动位置；分类、搜索、筛选等主动改变可见内容的操作仍清空详情并使用新页面上下文。

### 修改文件
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 结算页 PC 键盘/手柄导航、科技树详情弹层、研究列表滚动位置和建筑上下文切换；不改变结算统计、研究规则、资源扣除或研究队列数据。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认结算焦点路径只在结算 root 内捕获；科技树仅在 `isVisible` 且分类未改变时恢复滚动，并在建筑切换/关闭时清空选中科技。
- Unity 当前仍有编辑器锁和已有进程，尚未宣称 PlayMode、视觉、键鼠和移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证结算页概览/详情 Tab、结算刷新、结算结果切换，以及科技树资源变化、研究开始/取消、语言切换、分类/搜索/筛选、建筑切换和关闭后重开；确认详情、焦点和滚动位置符合上述边界。

## 2026-08-10 - 科技树焦点与输入框边界修复

### 修改内容
- 科技树重建前记录当前选中控件相对于科技树根节点的层级路径，资源、队列、语言或研究状态刷新后优先恢复原控件；控件失效时回退到当前科技树首个可交互控件。
- 科技树首次打开完成过渡后，在桌面端自动选择首个可交互控件，保证键盘/手柄可以直接开始导航；移动端不强行设置 EventSystem 焦点。
- GameUI、SelectionPanel 与 TechTreePanelUI 的输入框焦点判断改为向父层查找 `InputField`，避免文本输入子节点导致玩法热键或科技树快捷键误触。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 科技树 PC 键盘/手柄导航、科技树动态刷新后的焦点连续性，以及局内搜索输入对 B/U、V/F 等玩法/科技树快捷键的输入边界；不改变移动端触控操作、研究规则或资源逻辑。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认科技树焦点路径只从自身 root 捕获，恢复时校验控件激活/可交互状态；Unity Editor.log 最近尾部未发现新的 UI Prefab、射线或 EventSystem 错误，但仍有既有 `UnitAnimationController` Animator 参数警告。
- Unity 当前仍有编辑器锁和已有进程，尚未宣称 PlayMode、视觉、键鼠和移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证科技树首次打开、资源变化、研究开始/取消、语言切换、搜索输入、分类/筛选、详情按钮与关闭重开；确认 PC 焦点连续、输入框不触发快捷键，移动端触控区域和过渡期间的射线边界正常。

## 2026-08-10 - 造兵页焦点与滚动上下文修复

### 修改内容
- 造兵页分类 Tab、单位卡和固定详情控件重建前记录当前 PC 键盘/手柄焦点；重建后优先按单位数据、分类或固定控件层级路径恢复，控件失效时回退到首个可交互控件。
- 造兵页在同一生产队列、同一分类下因控制方案刷新而重建时保留单位列表滚动位置；主动切换分类或绑定新队列时仍从列表顶部开始，避免把旧分类的滚动上下文带入新列表。
- 解绑生产队列时同步清理焦点和滚动上下文缓存，避免旧建筑/旧队列的 UI 状态泄漏到下一次打开。

### 修改文件
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑生产窗口的 PC 键盘/手柄导航、单位卡分类切换、控制方案切换、生产队列重绑和滚动位置；不改变生产队列数据、训练规则、资源扣除或移动端触控逻辑。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认焦点恢复仅在桌面/手柄模式且当前选中控件属于生产页时触发；同队列同分类才恢复滚动，分类切换和解绑路径清理旧上下文。
- Unity 当前仍有编辑器锁和 12 个既有 Unity 进程，尚未宣称 PlayMode、视觉、键鼠和移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证生产页单位卡、分类 Tab、详情训练按钮、控制方案切换、资源变化、队列完成、关闭后重开，以及移动端横向列表触控；确认焦点不跳页、分类切换从顶部开始且旧队列状态不残留。

## 2026-08-10 - 连续建造放置覆盖层状态修复

### 修改内容
- 修复连续建造模式下确认一次建筑后 UI 无条件关闭的问题；当 `BuildingPlacer` 成功放置后仍处于放置状态时，保留并重建放置确认覆盖层。
- 非连续建造成功、放置取消或放置器不存在时继续关闭覆盖层，保持 ESC、取消和 Change Building 的既有退出路径。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造放置覆盖层、连续建造确认按钮、移动端/PC 放置操作；不改变建筑扣费、放置验证、预览或连续建造规则。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认成功放置后按 `buildingPlacer.IsPlacing` 分流：连续放置调用 `OpenPlacementOverlay`，普通放置调用 `Close`；Unity 当前仍有编辑器锁和既有进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证连续建造连续确认、资源不足、非法位置、取消、Change Building、旋转以及移动端放置按钮的覆盖层和射线边界；确认每次成功放置后预览和按钮仍可操作。

## 2026-08-10 - 建造分类筛选状态保持修复

### 修改内容
- 修复 `ClearPcDynamicActionButtons` 在选择详情、语言或控制方案刷新时强制把建造分类重置为 `All` 的问题。
- 将分类重置移动到 `CloseEmbeddedBuildPage` 的明确关闭路径；普通动态按钮重建继续保持玩家当前分类，并在当前分类无可用建造项时沿用既有回退到 `All` 的边界逻辑。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 建造目录分类 Tab、语言切换、控制方案刷新、选择详情刷新和建造页重开；不改变建造验证、资源扣除、建筑数据或移动端触控规则。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认分类重置只存在于 `CloseEmbeddedBuildPage` 和既有的“当前分类无可用项”回退逻辑，低层清理函数不再修改 `pcSelectedBuildCategory`；Unity 当前仍有编辑器锁和既有进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证建造页切换分类后进行语言切换、控制方案切换、重新选择建造单位/详情刷新、关闭再打开，确认同一页刷新保持分类、明确关闭后回到 All，并检查移动端分类触控。

## 2026-08-10 - 选择面板动态操作焦点保持修复

### 修改内容
- 修复 `SelectionPanel` 重建建造卡、造兵卡、科技卡和建筑操作按钮时直接销毁当前焦点对象，导致 PC 键盘/手柄导航在资源、语言或操作状态刷新后失焦的问题。
- 重建前按操作类型及对应 `UnitData`、`TechData`、`BuildingData` 或建筑动作类型与载荷记录焦点；重建后优先恢复同一语义按钮，目标失效时回退到右侧面板首个可交互控件。
- 移动端不设置 `EventSystem` 键盘焦点；关闭页面或选择面板隐藏路径仍可清理动态按钮，不恢复已关闭页面的焦点。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 选择面板右侧建造、造兵、科技和建筑操作页的键盘/手柄导航，以及这些页面在资源变化、语言切换、控制方案切换和操作结果刷新后的焦点连续性；不改变移动端触控、按钮业务规则或动态 Prefab 来源。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认焦点捕获先于动态按钮销毁、恢复晚于布局完成；语义匹配覆盖建造/造兵/科技数据和建筑动作载荷，且移动端焦点链路有显式平台保护。Unity 当前仍有编辑器锁和既有进程，尚未宣称 PlayMode、视觉、键鼠和移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证 PC 键盘/手柄聚焦建造卡、造兵卡、科技卡和建筑操作按钮，触发资源变化、语言/控制方案切换、研究/生产/升级状态刷新，确认焦点保持在同一语义控件；再验证控件失效时能回退、关闭页面后不会把焦点带回隐藏面板，并检查移动端没有被强制选中状态干扰。

## 2026-08-10 - 主菜单输入框返回层级修复

### 修改内容
- 修复主菜单按 Escape 时未区分页面导航和输入框编辑状态的问题。
- 当 Codex 搜索框或其他当前选中的 `InputField` 正在输入时，第一次 Escape 只退出输入焦点并清理 `EventSystem` 选中对象；没有输入框焦点时继续沿用现有的弹窗、Codex 模式和页面返回顺序。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单 Codex 搜索、Escape 返回、键盘/手柄焦点；不改变搜索过滤内容、页面状态或移动端触控按钮逻辑。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认 Escape 处理先尝试释放当前输入框，再进入既有页面返回分支；Unity 当前仍有编辑器锁和既有进程，尚未宣称 PlayMode、视觉、键鼠和移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证 Codex 搜索框输入、第一次 Escape 释放焦点、第二次 Escape 返回首页，以及鼠标点击搜索框后切换其他页面时焦点不残留。

## 2026-08-10 - 战斗高级页上下文与主菜单焦点连续性修复

### 修改内容
- 修复 `GameUI.RefreshMainPanelContext()` 在收到选择/检查刷新事件时无条件关闭当前高级页的问题。
- 当建造页仍有可建造单位选择、生产页仍绑定当前选中建筑且入口有效、科技页仍绑定当前选中建筑且入口有效时，保留当前页面；仅在上下文改变或页面失去打开资格时关闭。
- 修复主菜单切换或重建页面时旧按钮/输入框在 `Destroy` 延迟帧仍被 `EventSystem` 选中的问题；销毁旧页面前先清理当前 UI 选中对象，再由新页面恢复焦点。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 建造、生产、科技高级页的选择刷新和重复选择行为。
- 主菜单页面切换、动态页面重建、PC 键盘/手柄导航和输入框焦点。
- 不改变不同单位/建筑之间切换时的关页逻辑，也不改变移动端触控按钮业务行为。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认高级页保留逻辑同时校验页面类型、当前建筑引用和入口资格；主菜单确认 `ClearCurrentUiSelection()` 先于 `ClearRoot()` 执行。Unity 当前仍有编辑器锁和 12 个既有 Unity 进程，尚未宣称 PlayMode、视觉、键鼠和移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证同一建筑重复点击不会关闭生产/科技页；切换到其他建筑或失去建造资格时页面会正确关闭或按自动打开设置重新决策。
- 验证主菜单快速切换 Codex、设置、关卡选择和战役页时无旧控件抢焦点，并补做 PC、手柄和移动端触控回归。

## 2026-08-10 - 战斗 HUD 文案本地化与资源标签统一

### 修改内容
- 修复多单位战斗摘要在英文模式仍显示中文“存活 / 平均生命 / 残血”的问题，改为统一从 `LocalizationManager` 读取状态标签。
- 修复移动端技能按钮的终极技能、自动施法按钮仍使用硬编码中文的问题。
- 统一自动采集按钮、采集目标按钮和战斗 HUD 通用资源标签的中英文来源；普通资源使用独立 HUD 资源键，阵营专属资源继续回退到既有阵营资源显示逻辑。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 多单位摘要、移动端单位操作按钮、自动采集按钮、通用资源栏、资源提示和资源卡标题；不改变资源数值、采集状态、技能施放、按钮入口或 Prefab 布局。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认本轮目标字符串已由本地化键提供，普通资源 HUD 与自动采集按钮共用同一组资源键；Unity 当前仍有编辑器锁和 12 个既有 Unity 进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证中英文切换、多单位低生命摘要、终极技能按钮、自动采集资源循环及普通资源 Tooltip/卡片标题；重点检查英文窄屏下 `Auto Gather` 与资源名换行是否仍清晰。

## 2026-08-10 - 建造放置返回页状态同步修复

### 修改内容
- 修复建造放置覆盖层点击“更换建筑”后直接重建 `SelectionPanel` 建造列表、但没有同步 `GameUI.activeMainPanel` 的问题。
- 返回建造列表时优先通过 `GameUI.OpenBuildDevelopmentWindow()` 重新进入建造页；这样可见建造目录、Escape 返回、B 键切换和后续选择刷新继续由同一主页面状态机管理。
- 保留无父级 `GameUI` 时的旧兼容回退路径，不改变 Prefab 节点、建造数据或放置验证逻辑。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端建造放置覆盖层的“更换建筑”返回流程，以及建造页的页面状态、快捷键和后续刷新；不改变取消放置、连续建造和资源扣除规则。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认存在 `GameUI` 主状态机优先路径，并保留无父级控制器时的兼容回退；Unity 当前仍有 12 个既有 Unity 进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。
- Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别从建造目录和非建造目录入口进入放置，点击“更换建筑”，确认返回页可见且 Escape/B 键仍能正确关闭或切换；同时检查移动端返回按钮和连续建造状态。

## 2026-08-10 - 系统级暂停输入状态清理修复

### 修改内容
- 修复系统级或其他模块直接进入 `GameState.Paused` 时，`GameUI` 只刷新暂停显示、却保留旧建造预览和交互目标模式的问题。
- 所有进入非 `Playing` 状态的路径现在都会清理建造放置、攻击移动、巡逻、集结点、技能目标、阵营特殊目标和移动端框选状态；暂停页仍保留原有页面状态并可正常恢复。
- 结算、主菜单和下一局路径继续执行原有主页面关闭、选择面板隐藏和自动生产状态清理。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 局内暂停/恢复、外部暂停入口、建造放置、技能指向、攻击移动、集结点、机械建筑移动、兽族/自然目标选择和移动端框选；不改变暂停页面布局、设置保存或玩法规则。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认清理逻辑位于 `GameStateChangedEvent` 的统一入口，且仅在非 Playing 状态执行；Unity 当前仍有既有 Unity 进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证 Playing→Paused、外部暂停→恢复，以及暂停前分别处于建造、技能、攻击移动、集结点和移动端框选状态时，恢复后的第一下输入不会执行旧命令。

## 2026-08-10 - 页面刷新时嵌入页状态保持修复

### 修改内容
- 修复建筑选中面板刷新动态按钮时无条件回到建筑默认页面的问题：玩家主动打开的生产页或科技页，在资源变化、队列变化和其他同一选中上下文刷新后继续保持。
- 当原页面对应的操作已不再可用时，才回退到当前建筑可用的默认页面，避免恢复到失效页面或显示空目录。
- 不改变生产、研究、资源校验和 Prefab 结构，只调整 `SelectionPanel` 的页面状态连续性。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 建筑选择面板中的生产目录、科技目录、队列状态刷新及页面切换体验；移动端和实际生产/研究规则不变。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认动态按钮重建前保存嵌入页意图，重建后仅在对应操作仍可用时恢复；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别在生产建筑和科研建筑中打开非默认页面，触发资源变化、开始/取消队列和重复选择刷新，确认页面不会跳回默认目录；再检查失去对应能力时能正确回退。

## 2026-08-10 - HUD 装饰层射线拦截修复

### 修改内容
- 修复 HUD 射线策略只处理透明 Graphic 的缺陷：可见文字、Glow、Sheen、Shadow、Border、Line、Mask 等装饰层不再作为地图输入边界。
- 保留按钮根 Graphic、ScrollRect、资源 Tooltip、拖拽对象和模态遮罩的真实交互边界，避免地图点击穿透到仍需操作的 UI。
- 继续由 `GameUI` 统一维护 HUD 射线策略，不新增输入系统或平行 UI 状态。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 的地图选择、右键指令、建造/科技/生产面板和弹窗交互边界；不改变按钮动作、滚动逻辑或模态页面阻挡规则。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认装饰层只在 `ShouldKeepHudGraphicRaycast` 判定为非交互时关闭，按钮、滚动容器、Tooltip 和模态遮罩仍保留射线；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证地图空白处点击选中/框选、地图右键移动、打开生产/科技/建造页后的面板点击，以及弹窗遮罩下的地图点击不会误穿透；同时检查移动端拖拽和触控取消区域。

## 2026-08-10 - 科技树过渡期间世界输入隔离修复

### 修改内容
- 修复科技树打开和关闭动画期间 `CanvasGroup.blocksRaycasts` 为 `false` 的问题，避免面板已经可见但地图仍接收选中、移动或其他指令输入。
- 过渡动画期间保持科技树模态边界，内部控件仍保持 `interactable = false`，动画完成后才恢复键鼠/手柄焦点和控件操作。
- 与生产窗口、建造放置覆盖层的现有过渡行为保持一致，不改变科技树页面布局、研究规则或返回回调。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端科技树打开、关闭、返回详情页和过渡动画期间的地图输入隔离与页面交互顺序。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认打开/关闭过渡期间保持 `blocksRaycasts = true`、`interactable = false`，完成后由既有状态机恢复交互；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证科技树快速打开/关闭、点击返回详情页和连续切换建筑时，动画期间不会误选地图、发出移动/攻击指令，也不会把焦点留在已隐藏的科技树控件上。

## 2026-08-10 - 生产面板过渡期间交互隔离修复

### 修改内容
- 修复生产面板滑入动画开始后仍立即允许内部按钮交互的问题，避免首帧误点导致重复生产或错误操作。
- 修复生产面板关闭动画期间仍可点击队列/生产控件的问题；动画期间继续阻挡战场输入，但仅在动画完成后恢复面板控件交互。
- 将生产面板的 `CanvasGroup` 过渡状态与科技树模态页统一，保持现有生产数据、布局和回调不变。

### 修改文件
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端生产面板打开、关闭和返回详情页时的点击时序与地图输入隔离。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认生产面板打开/关闭过渡期间为 `interactable = false`、`blocksRaycasts = true`，完成打开后才恢复交互；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证快速打开/关闭生产面板、连续点击生产按钮和返回详情页，确认动画期间不会重复入队、地图不会收到穿透输入，且动画结束后控件可正常操作。

## 2026-08-10 - 技能指向与选择面板焦点边界修复

### 修改内容
- 修复 PC 技能指向期间点击 HUD 按钮仍会被 `InputHandler` 当作世界目标并施法的问题；左键 UI 现在只保留 UI 事件，不提交技能目标。
- 修复 PC 技能指向期间右键点击 HUD 可能误取消技能的问题；只有点击非 UI 区域才执行空地取消规则。
- 修复进入结算、主菜单等非战斗状态时 `SelectionPanel.HideImmediate()` 未清理 `EventSystem` 当前选中对象的问题，避免隐藏按钮继续占用键盘/手柄焦点。

### 修改文件
- `Assets/Scripts/Core/InputHandler.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 技能目标选择、HUD 按钮点击、技能取消操作，以及战斗 HUD 隐藏后的键盘/手柄焦点恢复。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认 PC 技能分支只在 `!InputUtility.IsPointerOverUi()` 时提交/取消，并确认 `HideImmediate()` 在停用面板前清理当前 UI 选中对象；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证 PC 进入技能指向后点击生产/科技/设置按钮不会额外施法，点击地图仍能正常提交；再从结算或主菜单返回战斗，确认焦点不会落在已隐藏的选择按钮上，并补做手柄导航回归。

## 2026-08-10 - 移动操作提示本地化一致性修复

### 修改内容
- 修复战斗 HUD 统一读取移动操作提示时，英文模式仍显示中文硬编码提示的问题。
- 将框选、攻击移动、巡逻、集结点、机械建筑移动、妖族吞噬/献祭、自然融合、技能目标选择及移动命令模式提示接入 `LocalizationManager`。
- 保留 `GetMobileInteractionHintAsciiSafe()` 作为兼容入口，但其输出现在会随当前语言和技能名称一起变化，不改变现有 HUD 刷新调用。

### 修改文件
- `Assets/Scripts/Core/InputHandler.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 移动端战场操作提示、技能指向提示、英文模式 HUD 文案和语言切换后的即时提示刷新。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认 `GameUI.RefreshInteractionHintIfNeeded()` 仍使用兼容入口，而入口内部已全部改为本地化 key；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别在中英文模式下进入框选、攻击移动、巡逻、集结点和技能目标选择，确认提示语言、技能名称及换行布局符合移动屏幕宽度；同时补做真实触控和语言切换回归。

## 2026-08-10 - 通用资源 Tooltip 本地化修复

### 修改内容
- 修复金币、木材、石头、铁资源 Tooltip 中的乱码和硬编码中文。
- 将资源名称、当前数量、用途和来源接入 `LocalizationManager`，中英文模式使用同一套资源数值来源。
- 修复移动技能取消区销毁时输入层矩形延迟清空的问题，避免控制方案或 HUD 切换瞬间误判触控位置。
- 不改变资源计算、容量或 HUD 点击逻辑。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 顶部资源 HUD 的通用资源 Tooltip、英文模式可读性、语言切换后的提示文案，以及移动技能取消区的输入边界。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认资源 HUD 调用新的本地化入口，并确认五个资源模板 key 均已注册；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。
- 静态复核确认 `DestroyMobileSkillCancelArea()` 会同步清空 `InputHandler` 的取消区矩形。

### 后续注意事项
- Unity 可用后验证中英文模式下点击/悬停金币、木材、石头和铁资源条，确认 Tooltip 的 safe-area 位置、换行和长文本布局；后续可继续清理特殊资源 Tooltip 的旧硬编码文案。

## 2026-08-10 - 特殊资源 Tooltip 跨阵营本地化修复

### 修改内容
- 修复机械、电力；自然、灵蕴；人族、人口；妖族、妖核等特殊资源名称在中文模式下的乱码问题。
- 将机械电网负载/过载状态、自然五行与相生共鸣、人族军阵、妖族狂化等 Tooltip 文案接入 `LocalizationManager`，英文模式不再回退到中文硬编码。
- 保留机械电网、自然运行时、人族运行时和妖族运行时的实时数值与分支逻辑，只替换展示层模板和状态标签映射。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 特殊资源条的名称、Tooltip 内容、阵营状态说明和中英文语言切换。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认 `ShowSpecialResourceTooltip()` 与特殊资源 HUD 文本刷新均使用新的本地化入口，模板参数覆盖机械、自然、人族和妖族的所有动态字段；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别在中英文模式下查看四种阵营资源 Tooltip，覆盖电网断电/过载、自然共鸣、人族成阵、妖族狂化/冷却等状态，确认长文本 safe-area 位置、换行和数值刷新正常。

## 2026-08-10 - 交互提示 API 路径统一

### 修改内容
- 修复 `InputHandler.GetActiveInteractionHint()` 和 `GetMobileInteractionHint()` 仍保留乱码硬编码的问题。
- 两个公开兼容 API 现在统一转发到 `GetMobileInteractionHintAsciiSafe()`，与 `GameUI`、`SelectionPanel` 当前使用的本地化提示路径保持一致。
- 将旧实现降为私有遗留方法，避免破坏已有方法签名，同时阻断旧调用路径再次把乱码写入 HUD。

### 修改文件
- `Assets/Scripts/Core/InputHandler.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端交互提示 API、旧 HUD 调用兼容性、语言切换后的操作提示一致性。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认公开 API 均只返回 `GetMobileInteractionHintAsciiSafe()`，且项目内 HUD 调用方没有继续使用旧乱码实现；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在中英文模式下分别通过技能指向、攻击移动、集结、巡逻和框选触发提示，确认旧 Prefab/外部调用入口与当前 HUD 显示完全一致。

## 2026-08-10 - 移动资源 Tooltip 重复触控修复

### 修改内容
- 移除 `ResourceHudTooltipTrigger` 移动端重复的 `PointerClick` 监听。
- 保留 `PointerDown` 的即时反馈，使资源 Tooltip 在按下时立即出现，同时避免一次触控重复重建内容和重置 3 秒隐藏计时。
- 不改变 PC 端悬停显示、移动端 Tooltip 文案或 safe-area 定位逻辑。

### 修改文件
- `Assets/Scripts/UI/ResourceHudTooltipTrigger.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 移动端资源 HUD 点击反馈、Tooltip 动画稳定性和自动隐藏计时。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认移动端只保留 `IPointerDownHandler` 显示路径，`IPointerClickHandler` 不再参与 Tooltip 生命周期；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在移动设备/模拟触控下连续点击不同资源条，确认 Tooltip 立即出现、不会闪烁，并在最后一次按下约 3 秒后隐藏。

## 2026-08-10 - 单位只读详情内容修复

### 修改内容
- 修复进入单位只读详情后仍使用普通选择摘要的问题。
- `ShowSingleUnitInspection()` 现在使用完整的 `BuildUnitInspectionSummary()`，与建筑只读详情保持一致。
- 保留只读绑定和动作按钮禁用逻辑，不改变普通选择、多人选择或战斗指令路径。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端单位详情页的阵营、等级、战斗属性、特殊系统状态和描述信息展示。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，182 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，12 个警告。
- 静态复核确认只读单位路径调用 `BuildUnitInspectionSummary()`，同时仍传入 `readOnly: true` 并沿用只读动作按钮刷新；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别从 PC 和移动端检查敌方单位详情，确认长摘要可滚动/换行，且详情模式不会出现可执行的移动、攻击、生产或技能按钮。

## 2026-08-10 - 单位只读详情技能交互封锁

### 修改内容
- 修复单位只读详情仍可通过技能按钮、右键自动施法或快捷键进入执行路径的问题。
- 只读详情继续显示技能资料，但技能按钮不可交互，详情卡中的“使用技能”入口隐藏。
- 对点击、右键和快捷键入口增加统一的 `boundUnitReadOnly` 防线，避免手势转发器绕过按钮禁用状态。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端单位只读详情的技能显示、长按/悬停详情、右键自动施法和 Q/W/E/R/F 技能入口。
- 不改变普通选中单位的技能施法、自动施法和技能详情行为。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，保留项目既有 Unity API 弃用警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，保留项目既有 Editor 警告。
- 静态确认技能按钮交互状态、左右键/快捷键入口及详情卡使用按钮均受 `boundUnitReadOnly` 约束；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后验证敌方单位只读详情：技能仍可查看说明但应呈禁用态，长按/悬停不应出现可执行提示，且不会触发施法、自动施法或目标选择模式。

## 2026-08-10 - 选择面板可见标签本地化一致性修复

### 修改内容
- 修复无选中对象时选择面板固定显示英文 `No Selection` 的问题，改用现有本地化键。
- 修复机械改造页面分类标题直接写入硬编码中文标签的问题，统一使用现有 `Category` 本地化键。
- 不改变选择状态、机械改造数据和按钮执行逻辑。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端无选中状态提示。
- 机械改造页面分类标题在中英文切换时的显示一致性。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，保留项目既有 Unity API 弃用警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，保留项目既有 Editor 警告。
- 静态确认空选择和机械改造分类标题均调用 `LocalizationManager.Get(...)`；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后切换中英文并进入/退出单位选择、机械改造页，确认无选中提示和分类标题无英文/乱码残留。

## 2026-08-10 - 生产与科技页面玩家归属边界修复

### 修改内容
- 修复 `GameUI` 生产页面入口只校验建筑功能、不校验建筑归属的问题。
- 修复 `GameUI` 科技树页面入口同样缺少玩家建筑归属校验的问题。
- 只读观察目标仍可显示详情数据，但不能通过页面入口进入可生产、可研究或可改变建筑状态的操作界面。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中/只读观察后的生产页面、科技树页面打开条件。
- 自动打开生产页面、移动端上下文入口和公共页面调用入口的安全边界。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，保留项目既有 Unity API 弃用警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，保留项目既有 Editor 警告。
- 静态确认生产/科技页面能力判断均包含 `building.Team == Team.Player`；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别选中玩家建筑、观察敌方建筑，确认玩家建筑仍能正常打开生产/科技页面，敌方建筑只保留只读详情，不出现可执行页面入口。

## 2026-08-10 - 战场快捷键与模态界面输入边界修复

### 修改内容
- 修复生产、科技、建造页面或固定详情弹层打开时，`InputHandler` 仍处理 A 键、编队数字键和右键战场指令的问题。
- 将普通战场输入接入 `GameUI` 的模态页面边界，避免键盘或地图点击穿透 UI 页面。
- 将页面模态阻断状态与攻击移动、集结点、技能目标等待确认交互模式拆分，确保目标点击仍能完成当前交互，不被自身状态误阻断。

### 修改文件
- `Assets/Scripts/Core/InputHandler.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端生产、科技、建造页面及固定详情弹层打开期间的战场选择、移动/攻击指令和全局快捷键。
- 保留页面按钮操作、ESC 返回链路和已有攻击移动/技能/集结点目标点击流程。

### 验证方式
- Runtime/Editor 串行编译及静态检查；Unity 当前仍有既有编辑器进程，不能宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后打开生产、科技、建造页面，确认按 A/编队数字键或在地图右键不会改变战场状态；关闭页面后快捷键和右键指令恢复正常，正在进行的攻击移动/技能目标点击仍可完成。

## 2026-08-10 - 科技树搜索体验与页面状态修复

### 修改内容
- 修复 PC 科技树搜索框只在结束编辑后才过滤的问题，改为带短暂防抖的即时过滤。
- 防止每次按键都立即重建整个页面，减少输入框焦点、光标和组合输入被打断的风险。
- 切换到新的建筑科技树时清除旧建筑遗留的搜索词，避免重新打开页面直接得到误导性的空结果。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 科技树搜索、科技节点过滤和不同建筑之间的科技树切换。
- 不改变科技节点解锁、研究队列、高风险确认和移动端科技树布局。

### 验证方式
- Runtime/Editor 串行编译及静态检查；Unity 当前仍有既有编辑器进程，不能宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在 PC 科技树中连续输入、删除和快速修改搜索词，确认列表约 0.12 秒后更新且输入框不丢焦点；切换建筑后搜索框应恢复为空。

## 2026-08-10 - 目标提示面板监听生命周期修复

### 修改内容
- 审计游戏内 UI 动态按钮重建、页面反复打开和输入绑定路径，确认主要生产、科技、建造和选择页面已有监听清理机制。
- 修复目标提示面板首次创建分支未先移除旧监听的问题，使生存任务面板切换按钮在引用重新解析或编辑器域重载后保持幂等。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 游戏内顶部目标提示面板与生存任务面板的打开/关闭切换。
- 不改变生存任务数据、任务分类或奖励逻辑。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，保留项目既有 Unity API 弃用及静态分析警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:minimal`，0 个错误，保留项目既有 Editor 警告。
- 静态确认目标按钮绑定包含 `RemoveListener(ToggleSurvivalTaskPanel)` 后再 `AddListener`；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后重复进入/退出生存任务面板，并在重新编译脚本或重新加载场景后点击目标提示按钮，确认每次点击只发生一次切换。

## 2026-08-10 - 游戏内页面导航焦点与输入优先级优化

### 修改内容
- 修复科技树搜索框处于编辑状态时首个 Escape 直接关闭整个页面的问题；现在先退出输入态，再由下一次 Escape 返回页面。
- 修复建造、生产、科技页面切换或直接关闭时可能遗留隐藏控件焦点的问题，避免键盘/手柄确认键作用到旧页面。
- 为嵌入式建造目录和生产页面提供确定的 PC/键盘首个焦点，生产页在转场完成后才恢复可操作焦点，避免透明转场期间误操作。
- 保持移动端不强制抢占焦点，并让移动端返回键同样遵守输入框优先级。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 的建造、生产、科技页面之间的 PC 键盘/手柄导航、Escape 返回层级和页面切换输入边界。
- 不改变建造、生产、研究数据逻辑，也不改变移动端触控布局。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- 静态检查页面焦点清理、输入框优先级和首个控件焦点入口；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别用 PC 键盘/手柄打开建造、生产、科技页面，确认焦点不落到已关闭页面；在科技树搜索框输入后连续按两次 Escape，确认第一次只退出输入态、第二次才返回页面。

## 2026-08-10 - 详情弹层关闭焦点清理修复

### 修改内容
- 修复固定操作详情卡、Buff/技能详情和编队选择/管理面板关闭时只隐藏对象、未同步清理 EventSystem 当前焦点的问题。
- 修复编队选择按钮通过同一入口收起时绕过统一关闭路径的问题，避免键盘/手柄确认键继续作用于隐藏控件。
- 保持已有详情层 ESC 顺序、移动端显示逻辑和编队数据逻辑不变。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/OperationDetailCardView.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 的固定操作详情、Buff/技能详情、编队选择和编队管理弹层的 PC 键盘/手柄焦点及关闭行为。
- 不改变游戏玩法状态、技能/Buff 数据或编队绑定逻辑。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- 静态确认四类详情/编队关闭路径均包含所属控件焦点清理；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后用 PC 键盘/手柄分别打开并关闭固定详情、Buff/技能详情、编队选择和编队管理面板，确认关闭后确认键不会触发隐藏按钮，且 ESC 仍按由内到外的层级返回。

## 2026-08-10 - 设置入口真实可用项统一收口

### 修改内容
- 核对 `UserInputSettings` 字段在运行时代码中的实际消费者，隐藏长按详情、选择优先级、移动/攻击指令样式、自动存档间隔/槽位/危险前存档以及战役对话/教学等尚未接线的设置，避免玩家修改后产生“设置已生效”的误解。
- 战斗内设置保留已接入的巡逻模式和生存返回菜单自动存档，并将长按框选延迟改用已有本地化 key，修复该行在中文模式下回退英文的问题。
- 主菜单设置移除 Smart Cast Assist、Tower Auto Cast 和 Long Press Details 伪选项，补齐点击容错、长按框选延迟和 Control Scheme，并同步更新 fallback 与固定 Settings Prefab 两条绑定路径。
- 更新战斗内设置功能文档，明确当前可展示项和待接线项边界。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `docs/features/IN_GAME_SETTINGS.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单设置页与战斗内暂停设置页的可见选项、PC/移动端设置入口一致性和中英文标签显示。
- 不改变尚未接线字段的存储结构，不改变已接线的镜头、选中、巡逻、建造、生产、施法和战斗警报运行时逻辑。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- 静态确认两套设置 UI 不再引用未接线伪选项，主菜单固定 Prefab 行数组与动态 fallback 均为 10 项且动作索引一致；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别从主菜单和战斗内设置页切换中英文、Auto/PC/Mobile 操控方案及三项输入容错参数，确认保存后重新打开仍保留数值；进入生存模式确认“退出时存档”仍只影响返回菜单前的自动存档。

## 2026-08-10 - 页面模态边界覆盖 B/U 快捷键

### 修改内容
- 修复建造、生产、科技或固定详情弹层打开时，B/U 快捷键仍可能绕过页面边界改变建造页或直接执行建筑升级的问题。
- B 在建造页打开时仍作为明确的关闭快捷键；其他页面打开时不再让战场快捷键穿透到页面下方。
- 让 `GameUI` 的快捷键判断与 `InputHandler` 共用战场模态状态，同时保留鼠标悬停 UI 和输入框焦点拦截。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 键盘在游戏内建造、生产、科技及详情页面期间的 B/U 快捷键边界。
- 不改变 B 关闭建造页、ESC 分层返回或建筑升级本身的执行条件。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- 静态确认 B 分支先保留建造页关闭路径，U 分支与页面模态状态共用 `IsGameplayHotkeyBlockedByUi()`；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后打开生产、科技和固定详情页，把鼠标移到战场区域按 U/B，确认不会执行升级或切换页面；在建造页按 B 应关闭页面。

## 2026-08-10 - 未保存设置不影响退出存档

### 修改内容
- 修复局内设置页修改 `Save On Exit` 后尚未点击 Apply/Save & Close，直接返回主菜单时仍读取草稿值的问题。
- 返回主菜单现在只依据 `UserInputSettingsStore.Current` 的已保存设置决定是否自动保存生存模式，保持设置草稿与 Apply/Save & Close 的语义一致。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 生存模式暂停设置页的“返回主菜单”和“退出时存档”行为。
- 不改变保存设置、手动保存、“保存并返回主菜单”及“保存并退出游戏”的既有入口。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- 静态确认 `ReturnToMainMenu()` 使用已保存设置而非未提交的 `draft.AutoSaveOnExit`；Unity 当前仍有既有编辑器进程，尚未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在生存模式暂停页修改“退出时存档”但不应用，分别点击“返回主菜单”和“保存并返回主菜单”，确认前者不保存未提交草稿、后者仍执行明确的保存流程。

## 2026-08-10 - 结算页动态节点生命周期收口

### 修改内容
- 将结算页动态面板、滚动容器和异常节点的运行时清理从 `DestroyImmediate` 统一为“立即禁用交互、交给 Unity 延迟销毁”。
- 保留结算根 Prefab 与固定节点结构，避免切换结算分页、语言或快速返回模式选择时破坏运行时对象生命周期。

### 修改文件
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 胜负结算页的动态内容重建、隐藏和缺失节点清理；不改变结算统计、分页、继续/重试/返回按钮逻辑。

### 验证方式
- 静态确认 `MatchSettlementUI.cs` 不再使用运行时 `DestroyImmediate`，所有结算动态节点销毁前都会先取消激活。
- 待 Unity 可用后验证重复打开结算页、切换分页/语言以及快速返回模式选择时无残留节点、无重复按钮响应；当前仍未宣称 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- 若后续扩展结算页动态节点，继续通过现有 Prefab Resolver 创建，并纳入 `ClearSettlementDynamicContent` 的生命周期清理范围。

## 2026-08-10 - 生产页默认 Prefab 库回退

### 修改内容
- 修复 `UnitProductionPanel` 将可选 `prefabLibrary` 误当作必填导致的生产页 Prefab 解析失败。
- 未配置局部覆盖时统一回退 `UiPrefabResolver.DefaultLibrary`，恢复生产分类标签、单位生产卡和队列项的 Prefab 实例化；显式覆盖仍优先。
- 生产卡、队列项及其动画配置同步使用同一默认库回退链。

### 修改文件
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑生产页分类筛选、可生产单位列表、生产队列动态项及其按钮绑定。
- 不改变生产规则、资源校验、队列数据或显式 Prefab 覆盖入口。

### 验证方式
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- 静态确认三个生产 Prefab 的 GUID 均存在于 `UiPrefabLibrary.asset`，且未配置局部库时四个解析入口都回退到 `UiPrefabResolver.DefaultLibrary`。
- Unity 当前仍有既有编辑器进程，尚未用新的 PlayMode session 验证生产页视觉与点击回归。

### 后续注意事项
- Unity 可用后选中可生产建筑，确认 All/Infantry/Ranged 分类标签出现，点击单位卡可加入队列，取消队列按钮可用，并重复打开/关闭生产页确认无残留。

## 2026-08-10 - 移动端选择操作按钮 Prefab 契约修复

### 修改内容
- 修复移动端圆形单位操作按钮缺少 `Outline` 组件时，`SelectionPanel` 在布局阶段抛错并整体禁用的问题。
- 让 `UiPrefabWorkflowGenerator` 的单位操作按钮修复流程始终补齐并配置 `Outline`，保证后续重新生成 Prefab 时不会回归。
- 当前实际使用的 `SelectionAutomationBar_Prefab` 中七个自动化操作按钮同步补齐 `Outline` 组件，运行时圆形按钮样式仍由 `SelectionPanel` 统一覆盖。

### 修改文件
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/InGame/SelectionAutomationBar_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 移动端选择单位后的巡逻、自动采集、自动技能、吞噬、献祭、自然融合和机械改造按钮。
- 不改变按钮可用条件、命令入口或战斗规则；仅恢复缺失的视觉边框组件和 Prefab 契约。

### 验证方式
- 静态确认七个自动化按钮均包含 `Mask` 与 `Outline`，生成器的 `RepairUnitCommandButtonPrefab` 同时维护两者。
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- 静态核对七个 `Outline` 的 `m_GameObject` 均对应所属按钮；Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后切换到 Mobile 操控方案，选择可移动单位，确认七个圆形按钮均显示且可点击；再切换回 PC 方案确认自动化栏仍保持原有横向布局。

## 2026-08-10 - 科技树页面中英文状态一致性修复

### 修改内容
- 修复科技树 PC 页面节点画布标题在英文模式下仍显示中文的问题，统一使用现有 `Technology Tree` 本地化键。
- 为筛选无结果状态新增独立本地化键，避免英文模式显示中文空状态，并区分“建筑没有科技节点”和“当前筛选没有匹配节点”。
- 将科技详情浮层标题从硬编码 `Tips` 收口到现有 `Beginner Tips` 本地化键，保证中英文标题一致。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/移动端科技树页面的节点画布标题、筛选空状态和详情浮层标题。
- 不改变科技节点过滤、研究校验、研究队列或高风险确认逻辑。

### 验证方式
- 静态确认科技树固定标题、筛选空状态和详情标题均通过 `LocalizationManager.Get(...)` 解析，中英文键值均已登记。
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别切换中文/英文，打开科技树、输入无匹配搜索词、打开节点详情，确认标题和空状态不再中英混杂。

## 2026-08-10 - 主菜单图鉴语言缓存与地形标签一致性修复

### 修改内容
- 为主菜单图鉴数据缓存记录生成语言；切换语言后重新生成标题、分类、描述和搜索索引，同时按条目 ID 恢复当前选中项，避免图鉴保留旧语言或跳回错误条目。
- 图鉴一级分类、二级分类、建筑分类和单位分类统一通过 `LocalizationManager` 解析，修复英文模式下分类标签残留中文的问题。
- 地形图鉴标题、元信息和无配置时的 fallback 说明接入本地化键；配置中的地形说明也会先经过本地化解析。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单图鉴页面的语言切换、建筑/单位/地形分类筛选、地形条目标题与说明。
- 不改变图鉴条目筛选规则、模型预览、搜索输入或条目数据来源。

### 验证方式
- 静态确认图鉴缓存仅在数据源或当前语言变化时重建，并按稳定条目 ID 恢复选择。
- 静态确认分类和地形 fallback 文案均使用已登记的本地化键。
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别在中文/英文模式打开图鉴、切换分类和搜索地形，确认页面不混用旧语言且当前选中条目保持不跳变。

## 2026-08-10 - HUD 模态边界与临时交互状态清理

### 修改内容
- 将战场输入被 HUD 模态页面拦截的判断前置到所有待处理目标模式之前。
- 当生产、科技、建造或固定详情等页面拥有交互边界时，统一取消残留的集结、机械移动、妖兽进阶、自然融合、技能瞄准、攻移和移动端手势状态，避免页面点击被误判为战场指令。

### 修改文件
- `Assets/Scripts/Core/InputHandler.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端 HUD 页面打开期间的战场选择、目标点击、右键命令和临时交互模式。
- 不改变无模态页面时的目标模式完成逻辑；仅收紧 UI 拥有交互边界时的输入清理。

### 验证方式
- 静态确认 `InputHandler.Update()` 在处理所有 pending target mode 前先检查 `GameUI.IsBattlefieldInputBlockedByUi`，并在命中模态边界时调用 `CancelInteractiveModes()`。
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- 静态回归确认模态边界判断位于所有 pending target mode 分支之前；Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别在目标模式中打开建造、生产、科技树、固定详情和暂停设置页面，确认退出后第一下点击不会执行旧目标命令。

## 2026-08-10 - 世界 HUD 标签本地化与可读性修复

### 修改内容
- 修复战斗世界 HUD 中精英、首领、英雄、建筑和普通单位类型标签在英文模式下仍显示中文/符号的问题，统一使用短标签本地化键。
- 将单位等级标签从硬编码 `Lv.` 改为中英文可读格式，避免等级前缀与当前语言混用。
- 将机械改造状态改为统一的本地化格式字符串，修复状态名称与分隔符混用的问题。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/UnitOverheadUI.cs`
- `Assets/Scripts/UI/WorldHudManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗中单位、建筑和重要目标头顶 HUD 的类型标签、等级标签和机械改造状态。
- 不改变目标分类、血条刷新、状态优先级或 HUD 条目回收逻辑。

### 验证方式
- 静态确认 `WorldHudManager.RefreshContent` 的活动类型、等级路径均通过 `LocalizationManager.Get(...)` 解析，并确认机械改造状态使用已登记的格式键。
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别切换中文/英文，在战斗中查看普通单位、精英、首领、英雄和建筑的头顶标签，以及机械单位改造中的状态文字，确认不再出现语言混用或布局溢出。

## 2026-08-10 - 活动 UI 本地化缺口修复

### 修改内容
- 补齐生产面板、科技树、建造放置、建筑研究和战斗 HUD 活动路径中调用但未登记的本地化键。
- 为生产队列空状态、单位筛选空状态、生产提示、队列状态、融合/俘获单位标签、科技树功能分类、放置状态和通用关闭/完成按钮提供中英文文案。
- 不改变生产校验、科技节点筛选、建造放置或研究流程，只修复显示层语言回退问题。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 中文模式下生产、科技树、建筑研究、建造放置和相关战斗 HUD 不再直接显示未翻译的英文原文。
- 英文模式保持原有英文文案，页面逻辑和输入行为不变。

### 验证方式
- 静态提取 `Assets/Scripts/UI` 中字面量 `LocalizationManager.Get(...)` 键并与登记表比对，确认本次缺失键全部补齐。
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别切换中文/英文，打开生产面板、科技树、建筑研究、建造放置和相关空状态，确认新文案长度在 PC 与移动端布局中均不溢出。

## 2026-08-10 - 移动端选择操作 glyph 本地化修复

### 修改内容
- 将移动端选择面板圆形操作按钮的巡逻、自动采集、自动技能、妖兽进阶/献祭、自然融合、机械改造、停止、攻移和默认指令 glyph 从硬编码中文改为短标签本地化键。
- 中文模式保留原有单字 glyph，英文模式显示紧凑英文字母，避免移动端高频操作按钮出现语言混用。
- 不改变按钮显隐条件、圆形布局、点击回调或临时交互模式。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 移动端单位选择 HUD 的圆形操作按钮视觉标签。
- PC 布局、战斗指令执行、技能/自动化状态和移动端按钮位置保持不变。

### 验证方式
- 静态确认 `ResolveMobileUnitActionGlyph` 的所有分支均通过 `LocalizationManager.Get(...)`，并确认 10 个短标签键已登记中英文值。
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后切换英文与 Mobile 操控方案，选择不同阵营单位，确认圆形操作按钮显示 P/G/S/D/F/M/A 等短标签且不会因英文长度溢出；切回中文确认原有单字 glyph 保持可读。

## 2026-08-10 - 选择详情状态进度本地化收口

### 修改内容
- 将选择详情左侧第二条状态进度行中的升星、妖兽进化/吞噬、机械充能/过载、自然融合、妖兽献祭、电路/断电/共鸣、融合路线、俘虏城供给、融合科技和终极技能状态统一接入既有本地化键。
- 为融合阶级短标签补充中英文格式键，避免英文模式显示“融合T2”等中文状态；保持原有进度比例、颜色、优先级和状态判定不变。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位/建筑选中详情的高频状态进度行，以及融合单位、融合建筑的状态摘要。
- 中文模式保留原有短标签含义，英文模式不再混入中文状态；不改变战斗状态、进度计算、按钮入口或交互模式。

### 验证方式
- 静态确认目标状态进度方法中不再存在中文显示字面量，且所有状态键均已登记中英文值。
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后切换英文/中文，分别选择华夏、妖兽、机械、自然和融合单位/建筑，确认状态行标签与数值在固定详情面板宽度内不溢出，并核对状态切换时进度条颜色与文案同步。

## 2026-08-10 - 移动端详情长按取消误点击

### 修改内容
- 修复 `OperationDetailCardTrigger` 在移动端长按显示操作详情后，松手仍可能触发底层 Button `onClick` 的问题。
- 长按达到 0.35 秒时清除 Unity pointer press，并在 click 回调层保留保护判断；普通短按仍正常执行，PC 悬停和右键固定详情行为不变。

### 修改文件
- `Assets/Scripts/UI/OperationDetailCardTrigger.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造卡、生产卡、科技卡和选择面板操作按钮的移动端详情长按行为。
- 防止“查看详情”误变成一次生产、研究、建造或其他按钮操作，尤其保护高风险操作；不改变详情内容或按钮可用性判定。

### 验证方式
- 静态确认长按阈值触发 `CancelPendingClick()`，同时清理 `pointerPress`、`rawPointerPress` 和 `eligibleForClick`，并保留 click 层保护判断。
- Runtime 串行编译：`dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 183 个警告。
- Editor 串行编译：`dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false --no-restore --nologo -t:Rebuild -v:q`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在移动端分别长按建造、生产、科技和高风险操作卡，确认只打开详情且不执行按钮；短按仍应立即执行，PC 悬停详情仍按 0.25 秒出现。

## 2026-08-10 - 操作详情卡滚动与移动端布局优化

### 修改内容
- 将操作详情卡的 `Sections` 改为 `ScrollRect + RectMask2D + Content` 结构，动态详情段落统一挂载到内容节点，并在每次刷新后重置到顶部。
- 根据正文长度估算可视行数，取消正文的截断显示，让多段高风险、建造、生产和研究说明可以通过详情卡内部纵向滚动完整阅读。
- 移动端详情卡按屏幕宽高自适应，使用居中 pivot 与安全边距，避免固定尺寸在窄屏上偏移出屏或压住顶部资源栏。
- 编辑器 UI 生成器同步生成同一滚动结构，并保留旧版 `Sections/SectionTemplate` 的运行时兼容路径。

### 修改文件
- `Assets/Scripts/UI/OperationDetailCardView.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/InGame/OperationDetailCard_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 悬停/固定详情卡、移动端长按详情卡、建造/生产/科技/快速操作的详情内容承载与阅读范围。
- 详情卡关闭逻辑、按钮点击链路和详情数据生成逻辑不变；只调整内容布局、滚动和移动端位置尺寸。

### 验证方式
- 静态确认当前生效的 InGame 详情卡预制体包含 `ScrollRect`、`RectMask2D`、`Sections/Content/SectionTemplate`，`Sections` 指向 `Content`，文件 ID 无重复。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo`，0 个错误，保留项目既有 183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别在 PC 与移动端打开单段长正文、四段以上高风险详情，确认可纵向滚动到末尾；在窄屏确认卡片居中、顶部资源栏可见、关闭后战场输入恢复。

## 2026-08-10 - 图鉴展开标题与建筑详情语言一致性修复

### 修改内容
- 修复主菜单图鉴展开详情层标题未经过 `LocalizationManager` 的问题，避免英文模式出现标题中文、正文英文的混排。
- 修复建筑选中详情摘要中华夏等级摘要和地形标签的当前显示路径，使其与其他建筑统计字段共用本地化键。
- 确认选择面板当前通用操作详情入口使用 `BuildGenericOperationDetailReadable`；旧私有方法没有调用点，本轮不改变其历史代码，避免扩大无关逻辑范围。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/BuildingUiUtility.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单图鉴的展开详情标题。
- 选中建筑的状态摘要、等级摘要和地形信息；不改变等级计算、建筑状态判定、详情卡交互或战斗逻辑。

### 验证方式
- 静态确认图鉴展开层不再直接赋值 `codexSelectedEntry.Title`，建筑详情路径包含本地化的地形、华夏等级和等级上限显示。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo`，0 个错误，保留项目既有 183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后切换中英文，分别打开图鉴展开详情并选择华夏建筑，确认标题、等级摘要、地形标签和其他统计字段语言一致，且窄屏下没有新增换行溢出。

## 2026-08-10 - 独立生产页关闭入口与返回链路补齐

### 修改内容
- 为独立生产页补齐固定的 `CloseButton`，并在 `BuildingUnitProductionWindowUI` 中绑定 `RequestBack()`，避免玩家只能依赖 ESC 或系统返回退出页面。
- 关闭按钮文本随语言刷新同步更新，并在预制体缺失时记录错误并安全隐藏生产页，避免运行时生成未纳入 UI 资源规范的临时按钮。
- UI 预制体生成器同步创建并校验生产页关闭按钮路径，当前生效的 `MainHudRoot_Prefab` 已加入对应节点。

### 修改文件
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Pages/MainHudRoot_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 独立生产页的 PC 与移动端退出入口、返回事件绑定和中英文显示；生产队列、生产资格判定和生产逻辑不变。

### 验证方式
- 静态确认 `NavHeader/CloseButton` 路径、Button 组件、运行时绑定逻辑和生成器校验均存在；预制体文件 ID 无重复。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo`，0 个错误，保留项目既有 183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在中英文下分别打开独立生产页，点击关闭按钮确认返回建筑详情；检查按钮不遮挡标题/状态文本，返回后键盘焦点和战场输入恢复，并在移动端确认点击区域足够明确。

## 2026-08-10 - 科技树页面关闭入口与返回链路补齐

### 修改内容
- 为科技树 PC `TopBar_PC` 和移动端 `NavHeader` 补齐固定的 `CloseButton`，避免独立科技页只能依赖 ESC 或系统返回退出。
- 在 `TechTreePanelUI.BindHeader` 中校验关闭节点、绑定 `RequestBack()`，并在语言切换/页面重建时刷新关闭按钮文本。
- UI 预制体生成器同步创建并校验两个平台的关闭按钮，当前生效的 `TechTreeRoot_Prefab` 已加入对应节点；按钮保留统一 `UiPressFeedback` 反馈和键盘焦点链路。

### 修改文件
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Pages/TechTreeRoot_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 独立科技树页面 PC 与移动端的关闭入口、返回建筑详情链路和中英文按钮显示；科技筛选、搜索、研究确认和队列逻辑不变。

### 验证方式
- 静态确认 PC/移动关闭节点分别挂在 `TopBar_PC`/`NavHeader`，均包含 Button、UiPressFeedback、UiPrefabSlot，父子层级正确且文件 ID 无重复。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo`，0 个错误，保留项目既有 183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在 PC 与移动端分别打开科技树，点击关闭按钮确认返回建筑详情；检查搜索输入焦点、研究确认状态、滚动位置和关闭后战场输入均恢复正常。

## 2026-08-10 - 单位建造目录关闭入口与状态清理补齐

### 修改内容
- 为单位选中的 PC 嵌入式建造目录补齐固定 `CloseButton`，让鼠标/触控用户不必依赖 B 键、ESC 或系统返回退出页面。
- 在 `SelectionPanel` 中绑定关闭回调：优先交给 `GameUI` 结束 BuildMenu 状态，否则执行本地建造目录关闭；关闭时清理页面内 EventSystem 焦点并恢复建造按钮。
- 关闭按钮只在 `PcEmbeddedCatalogMode.Build` 生效，造兵目录继续复用同一生产页但不会显示错误的建造关闭入口。
- UI 预制体生成器与当前生效组件 Prefab 同步加入并校验按钮节点、按压反馈和 PrefabSlot。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位选中后的 PC 建造目录关闭入口、返回状态和焦点清理；建造资格、建筑卡片、分类筛选和放置逻辑不变。

### 验证方式
- 静态确认 `CloseButton` 位于生产页根节点，Button、UiPressFeedback、UiPrefabSlot、父节点引用均有效，文件 ID 无重复；生成器创建/路径校验和运行时绑定均存在。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo`，0 个错误。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo`，0 个错误。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在 PC 下选中可建造单位，打开建造目录并点击右上角关闭按钮，确认页面、焦点、B/ESC 行为和战场输入均恢复；同时确认造兵目录不显示该按钮。

## 2026-08-10 - 建筑内嵌造兵/研究页返回链收口

### 修改内容
- 为建筑选中的 PC 内嵌造兵页和研究页统一补齐固定 `CloseButton`，并让按钮文本随语言刷新更新。
- 新增建筑内嵌目录的 dismissed 状态：关闭后保留建筑选择和操作详情，不会因 ESC/移动端返回误打开设置，也不会在普通刷新时自动重新打开目录。
- 统一 PC ESC、移动端返回和页面关闭按钮的处理顺序；关闭时清理生产/研究页焦点，重新点击造兵或研究操作后再打开对应页面。
- UI 预制体生成器与当前生效的生产页、研究页 Prefab 同步加入并校验关闭按钮节点。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingProductionPage_Prefab.prefab`
- `Assets/Resources/UI/Prefabs/Components/SelectionBuildingTechTreePage_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建筑选中后的内嵌造兵/研究页面关闭入口、返回链、键盘/移动端返回行为和焦点恢复；建筑选择、生产、研究资格与队列逻辑保持不变。

### 验证方式
- 静态确认两个 Prefab 的 `CloseButton` 均位于根节点，包含 Button、UiPressFeedback、UiPrefabSlot，父节点引用正确且文件 ID 无重复；源代码与生成器绑定/校验逻辑存在。
- Runtime 编译：0 个错误，保留项目既有 183 个警告。
- Editor 编译：0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别测试建筑选中、内嵌造兵/研究、关闭按钮、PC ESC、移动端返回、返回建筑操作详情，以及重新点击操作后再次打开页面；同时确认独立生产页/科技树页和单位建造页的既有返回语义不受影响。

## 2026-08-10 - 生存任务面板返回栈与战场输入边界修复

### 修改内容
- 将已打开的生存任务面板接入 GameUI 统一返回栈，PC `ESC` 和移动端返回会优先关闭任务面板，不再直接打开设置。
- 关闭按钮、快捷返回共用关闭入口，并在关闭后清理 EventSystem 当前焦点，避免焦点停留在已隐藏的任务按钮上。
- 生存任务面板打开时纳入 `IsBattlefieldInputBlockedByUi`，阻止战场选择、快捷键和临时指令与任务面板并行执行；任务数据刷新、分类页签和奖励领取逻辑保持不变。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- Survival 模式任务面板的打开/关闭、PC 与移动端返回行为、焦点恢复和战场输入隔离。

### 验证方式
- 静态确认任务面板关闭按钮、PC/移动端返回入口、输入阻断属性和统一关闭方法均已接入；现有 `SurvivalTaskPanel_Prefab` 的 Close、Tabs、List 节点仍存在。
- Runtime 编译：0 个错误，保留项目既有 183 个警告。
- Editor 编译：0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在 Survival 模式打开任务面板，分别验证关闭按钮、PC `ESC`、移动端返回、焦点清理，以及面板打开时点击战场/按 `B`、`U` 不会触发游戏指令。

## 2026-08-10 - Buff 详情操作按钮本地化收口

### 修改内容
- 将 `SelectionPanel` Buff/技能详情中的固定、取消固定和使用技能按钮统一改为读取 `LocalizationManager` 词条。
- 覆盖详情面板首次创建、固定状态切换和语言刷新后的所有按钮文本更新路径。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 移动端 Buff/技能详情卡的操作按钮中英文显示；详情固定、技能使用和关闭逻辑不变。

### 验证方式
- 静态确认不再使用直接的 `Pin Details`、`Unpin Details`、`Use Skill` 按钮文本，所有路径均通过本地化键解析。
- Runtime 编译：0 个错误，保留项目既有 183 个警告。
- Editor 编译：0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在中文和英文下分别打开 Buff/技能详情，切换固定状态并确认按钮文本实时更新，随后验证使用技能和关闭详情的焦点行为。

## 2026-08-10 - 生存任务列表滚动与分类状态优化

### 修改内容
- 将 `SurvivalTaskList` 从平面 `VerticalLayoutGroup` 改为 Prefab 驱动的 `ScrollRect` + `RectMask2D` viewport + `ContentSizeFitter` content 结构。
- 将动态任务卡改挂到 `SurvivalTaskList/Content`，任务数量超过面板高度时可通过鼠标滚轮或触控拖动查看，避免任务内容直接溢出面板。
- 切换任务分类或重新打开任务面板时回到列表顶部；普通任务刷新保持当前位置，避免阅读过程中被刷新打断。
- 同步更新 UI 生成器、运行时节点/组件合约检查和当前生效 Prefab。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/InGame/SurvivalTaskPanel_Prefab.prefab`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- Survival 模式任务面板的任务列表滚动、分类切换和动态任务卡布局；任务数据、筛选和奖励领取逻辑保持不变。

### 验证方式
- 静态确认 `SurvivalTaskList` 具有 `ScrollRect`、`RectMask2D`，`SurvivalTaskList/Content` 具有 `VerticalLayoutGroup`、`ContentSizeFitter`，ScrollRect content/viewport 引用和父子路径一致，Prefab 文件 ID 无重复。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore`，0 个错误，保留项目既有 183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在 Survival 模式准备超过可视高度的任务数量，验证鼠标滚轮、触控拖动、分类切换重置顶部、重新打开面板和滚动后点击领取奖励；同时确认任务卡文本不会被 viewport 裁剪错误。

## 2026-08-10 - 战斗设置页可见选项收口

### 修改内容
- 移除战斗设置页中“功能正在重建/暂不可配置”等开发过程说明，避免将内部实现状态暴露给玩家。
- 保留 Casting、Build/Train、Assist、Controls 中已经有运行时消费者的设置；Groups 保留代码枚举兼容性，但从可见页签和当前生效 Prefab 移除。
- 更新设置功能规则，明确待接入设置必须隐藏而不是显示占位说明。
- UI 生成器与当前生效 `InGameSettingsRoot_Prefab` 同步。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/Editor/UiPrefabWorkflowGenerator.cs`
- `Assets/Resources/UI/Prefabs/InGame/InGameSettingsRoot_Prefab.prefab`
- `Docs/features/IN_GAME_SETTINGS.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗设置页的页签可见性、说明内容和设置页 Prefab 初始状态；已验证设置的读取、编辑、保存、Apply/Save & Close 和返回逻辑不变。

### 验证方式
- 静态确认 `InGameSettingsUI.cs` 不再包含开发占位说明；生成器只创建六个可用页签，`Tab_Groups` 在当前生效 Prefab 中禁用；Prefab 文件 ID 无重复；Prefab library `PrefabType: 86` 仍指向 InGame 目录资源。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore`，0 个错误，保留项目既有 183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore`，0 个错误，保留项目既有 12 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或移动端触控回归完成。

### 后续注意事项
- Unity 可用后在 PC 与移动端分别打开战斗设置，确认页签只显示 Controls/Camera/Casting/Build/Assist/Other，滚动设置项可见且可保存；确认未出现 Groups 或开发状态提示，并验证暂停/恢复、ESC、移动端返回链路。

## 2026-08-10 - 建筑操作详情本地化与上下文标签修复

### 修改内容
- 收口建筑操作描述、阵营专属动作、机械改造/飞行/电网过载、妖兽狂化、自然共鸣和俘虏城状态的中英文显示，补齐此前会回退成英文的建筑详情词条。
- 移除 \`SelectionPanel\` 对建筑动作 descriptor 标签的硬编码中文覆盖，保留升级按钮中的费用、缺口和进度上下文。
- 将旧的建筑操作详情入口转发到当前本地化实现，并移除“等美术准备好再接入”这类开发占位提示。

### 修改文件
- \`Assets/Scripts/Core/LocalizationManager.cs\`
- \`Assets/Scripts/UI/BuildingUiUtility.cs\`
- \`Assets/Scripts/UI/SelectionPanel.cs\`
- \`Docs/05_TASK_LOG.md\`

### 新增文件
- 无

### 影响范围
- 选中建筑的 PC 动作按钮、机械/妖兽/自然专属动作、俘虏城摘要、城墙/城门操作和建筑操作详情卡；动作可用性判定、生产、研究和建造逻辑不变。

### 验证方式
- 静态确认 \`BuildingUiUtility\` 的 \`L(...)\` 字面量键全部在 \`LocalizationManager\` 注册，结果为 \`missing=0\`；建筑动作按钮不再覆盖 descriptor 标签；旧操作详情入口已统一转发到本地化实现。
- Runtime 编译：\`dotnet build Assembly-CSharp.csproj --no-restore --nologo -t:Rebuild -v:q\`，0 个错误，183 个警告。
- Editor 编译：\`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -t:Rebuild -v:q\`，0 个错误，195 个警告（包含共享 Runtime 警告）。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或移动端触控回归完成。

### 后续注意事项
- Unity 可用后切换中英文，分别选择普通建筑、华夏主城、机械建筑、妖兽建筑、自然建筑、城墙/城门和俘虏主城，确认动作按钮、禁用原因、操作详情和过载/改造提示语言一致且不溢出。

## 2026-08-10 - 机械改造详情卡本地化与决策信息补齐

### 修改内容
- 将机械改造按钮的 PC 悬停和移动端长按详情卡改为读取现有本地化词条，消除 Mechanical module、Effect、Warning 等英文混排。
- 为详情卡补充改造消耗和安装时长区块，继续复用 MechanicalModificationUtility 的资源格式化与 OperationDetailCard_Prefab。
- 根据改造类别显示 Survival、Attack、Production、Power、Flight 等本地化标签，不改变短按执行、长按抑制点击和警告状态逻辑。

### 修改文件
- Assets/Scripts/UI/MechanicalModTipForwarder.cs
- Docs/05_TASK_LOG.md

### 新增文件
- 无

### 影响范围
- 机械单位/建筑改造卡片的悬停、长按详情、成本/时长信息、风险区和类别标签；改造执行、资源扣除和按钮点击链路不变。

### 验证方式
- 静态确认 MechanicalModTipForwarder 使用的 13 个本地化字面量键全部已注册，missing=0；详情卡不再直接写入英文标题、标签或区块名。
- Runtime 编译：dotnet build Assembly-CSharp.csproj --no-restore --nologo -t:Rebuild -v:q，0 个错误，183 个警告。
- Editor 编译：dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -t:Rebuild -v:q，0 个错误，195 个警告（包含共享 Runtime 警告）。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别在中文/英文、PC 悬停和移动端长按下打开机械改造卡，确认消耗、改造时长、类别、效果和警告区块完整且不溢出；验证长按后松手不会误触发改造。

## 2026-08-10 - 战役地图跨分辨率拖拽缩放校准

### 修改内容
- 将战役地图 PC 拖拽、滚轮缩放锚点和移动端双指平移统一从屏幕像素换算为 Canvas 本地 UI 单位，避免 CanvasScaler 在非参考分辨率下造成拖动速度、缩放锚点和边界偏差。
- 保留原有缩放范围、拖拽边界、节点点击和焦点定位逻辑。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单战役地图的鼠标拖拽、滚轮缩放、双指缩放和双指平移。

### 验证方式
- 静态确认四个屏幕像素位移入口均经过 Canvas `scaleFactor` 换算，原有 `ClampAnchoredPosition` 和缩放范围未改变。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，195 个警告（包含共享 Runtime 警告）。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或移动端触控回归完成。

### 后续注意事项
- Unity 可用后至少在 1920x1080、1366x768 和移动端战役地图分别验证拖拽、滚轮/双指缩放、Reset View、Focus Current，以及节点点击不被地图拖拽吞掉。

## 2026-08-10 - 战役页面动态内容本地化收口

### 修改内容
- 将活动战役地图的章节标题、章节副标题、目标、玩法重点、奖励和节点名称接入 `LocalizationManager` 的源文本回退入口；中文保留策划数据，英文按稳定章节/节点 ID 显示翻译。
- 收口地图卡片、节点弹窗、章节总览、进入确认和章节行的直接数据绑定，避免英文模式外层标签为英文但核心内容仍为中文。
- 不改变战役解锁、章节选择、地图节点点击、存档或关卡启动逻辑。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单战役设置页的地图、章节节点、节点详情、进入关卡确认和章节总览。

### 验证方式
- 静态确认 16 个章节和 20 个地图节点均有稳定 ID 的英文数据注册；活动路径不再直接把章节标题、章节副标题、目标、玩法重点、奖励或节点名称写入 UI。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，195 个警告（包含共享 Runtime 警告）。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、语言切换视觉、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后在中文/英文下分别切换华夏、妖兽、机械、自然四个战役阵营，打开地图节点弹窗和进入确认，确认长文本不溢出、节点名称/章节内容语言一致，并验证返回、焦点和解锁状态不变。

## 2026-08-10 - 战役节点次要目标语言一致性修复

### 修改内容
- 修复战役节点详情弹窗在英文模式下仍直接显示 `CampaignMissionDefinition.SecondaryObjective` 中文内容的问题。
- 为 16 个章节首个任务增加稳定任务 ID 的英文次要目标翻译；中文继续显示任务数据原文，缺失翻译时回退到已本地化的章节玩法重点，避免英文界面混入中文或显示键名。
- 保持任务目标、完成条件、解锁条件和关卡启动逻辑不变，仅调整节点弹窗的展示解析。

### 修改文件
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单战役地图节点详情弹窗的任务摘要区域，覆盖华夏、妖兽、机械、自然四个阵营的 16 个章节。

### 验证方式
- 静态确认 16 个任务 ID 均有英文注册，节点弹窗不再直接读取 `chapterMissions[0].SecondaryObjective`。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，195 个警告（包含共享 Runtime 警告）。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、语言切换视觉、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后在中英文下逐一打开四个阵营的章节节点弹窗，确认次要目标、章节目标、奖励和节点名称语言一致、长文本不溢出，并验证弹窗关闭及进入确认链路不变。

## 2026-08-10 - 战斗 HUD 移动端返回状态收口

### 修改内容
- 修复移动端返回在科技树或建造面板仍可见、但 `GameUI` 主页面状态已被清空时，直接关闭视觉面板而绕过统一状态机的问题。
- 让科技树和生产页关闭入口在独立面板仍打开时也清理 `activePanelBuilding`，避免下一次选择继承旧页面上下文。
- 保持现有返回优先级、建造放置取消、生产队列和科技树业务逻辑不变。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 移动端返回、科技树/生产页关闭、页面上下文和 HUD 可见性同步。

### 验证方式
- 静态确认移动端独立科技树/建造面板关闭路径已改为调用 `GameUI` 统一关闭入口，且生产页/科技树页在面板仍打开时会清理主页面上下文。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，195 个警告（包含共享 Runtime 警告）。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别在移动端打开建造、生产、科技树页面，模拟页面状态切换和返回键，确认页面关闭、底部 HUD、下一次选中建筑以及自动打开生产设置均不继承旧上下文。

## 2026-08-10 - 战斗 HUD 主页面与孤儿面板状态同步

### 修改内容
- 统一 `GameUI` 清空主页面状态时的嵌入式建造页关闭逻辑，避免页面仍显示但返回键、快捷键和输入边界已经切换到其他状态。
- 在选择建筑消失后的刷新兜底中关闭残留的独立生产页和科技树页，避免继续显示已失效建筑的操作入口。
- 保持生产队列、科技树和建造业务逻辑不变，仅收口页面生命周期和上下文清理。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 主页面切换、移动端返回、选择变化后的生产/科技页面生命周期、嵌入式建造目录可见性和输入边界。

### 验证方式
- 静态确认 `SetMainPanel(None)` 会关闭嵌入式建造页；无选中建筑时会清理独立生产页和科技树页；选中建筑但主页面状态为空时也会清理残留科技树页。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，195 个警告（包含共享 Runtime 警告）。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉或移动端触控回归完成。

### 后续注意事项
- Unity 可用后分别在 PC 和移动端打开建造、生产、科技树页面，再通过返回键、选择变化和暂停/结算切换验证页面、焦点、输入阻塞和下一次选中建筑的上下文一致。

## 2026-08-10 - 生存存档摘要与主菜单教程本地化统一

### 修改内容
- 为生存存档摘要增加稳定的 `FactionKey`，新存档不再只依赖保存时的本地化阵营名称；旧存档仍通过中英文名称回退解析。
- 统一主菜单存档管理页与局内暂停存档页的摘要格式，按当前语言解析阵营、地图规模、敌人强度，并将 ISO 时间改为本地时间的可读格式。
- 修复生存世界默认名称、存档管理副标题和主菜单教程内容在中文界面显示英文或硬编码文本的问题。

### 修改文件
- `Assets/Scripts/Core/SurvivalSaveSystem.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单存档管理、主菜单教程/帮助、局内设置的存档列表，以及语言切换后的存档元数据展示。

### 验证方式
- 静态确认两套存档列表均调用 `SurvivalSaveSummaryUtility.FormatForUi`，新存档写入 `FactionKey`，教程与存档管理提示均使用已注册本地化键。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，195 个警告（包含共享 Runtime 警告）。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、语言切换、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后分别在中文/英文下创建新存档并读取旧存档，确认阵营、地图规模、敌人强度、保存时间和默认名称均随当前语言刷新；同时检查窄屏下三行摘要不被按钮遮挡。

## 2026-08-10 - 主菜单同页重建保留滚动位置

### 修改内容
- 修复竞技/生存配置、主菜单设置、存档管理和教程等页面在步进、切换或刷新后滚动位置被重置的问题。
- 在现有 `ShowPage` 页面重建链路中捕获并恢复当前页面的纵向 `ScrollRect` 位置；跨页面导航仍从新页面顶部开始，同页刷新则保留用户阅读位置。
- 恢复前主动停止旧的惯性运动并刷新 Canvas 布局，避免移动端修改一项设置后跳回列表顶部或出现滚动位置竞态。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单配置页、设置页、存档管理、教程、图鉴列表以及同页重建场景的 PC 鼠标滚轮、键盘导航和移动端触控滚动体验。

### 验证方式
- 静态确认同页 `ShowPage` 会在清理旧页面前捕获纵向滚动值，并在新页面布局完成后恢复；跨页导航不会继承旧页面滚动位置。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，183 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -t:Rebuild -v:q`，0 个错误，195 个警告（包含共享 Runtime 警告）。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后在 PC 与移动端分别滚动竞技/生存配置和设置列表，修改底部选项后确认仍停留在原阅读位置；再切换到其他页面确认不会错误继承上一页滚动位置。

## 2026-08-10 - 战斗 HUD 安全区与分辨率变化自动重排

### 修改内容
- 修复战斗 HUD 只在控制方案改变时刷新布局的问题；屏幕旋转、窗口尺寸变化、分屏尺寸变化或移动端安全区变化现在会触发一次统一重排。
- 复用 `GameUI` 现有控制方案布局入口，同步更新顶部资源栏、设置按钮、选中面板和移动端布局，并刷新已打开的建造、生产、科技树和战斗摘要页面。
- 使用屏幕宽高与 `Screen.safeArea` 做变化检测，避免在每帧重复执行布局重建。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 在 PC 窗口缩放、移动端横竖屏切换、刘海/系统手势区域变化时的按钮位置、顶部状态栏、选中操作区和已打开功能页。

### 验证方式
- 静态确认 `GameUI.Update` 接入屏幕尺寸/安全区变化检测，变化后会调用现有布局入口并通知打开的子面板；未变化时不执行重排。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo -v:q`，0 个错误，0 个警告。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -v:q`，0 个错误，12 个既有警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后分别在 1920x1080、1366x768、移动端横竖屏和带安全区的设备模拟器中验证布局重排，重点检查设置按钮、资源栏、选中操作区和打开中的生产/科技树页面不被裁切或遮挡。

## 2026-08-10 - 局内设置说明本地化缺口修复

### 修改内容
- 补齐局内设置页范围预览、技能取消、拖拽阈值、同类型双击选择和巡逻指令的标题与说明本地化键。
- 保持现有设置草稿、应用和持久化逻辑不变，避免设置行为与界面文本修复相互耦合。

### 修改文件
- Assets/Scripts/Core/LocalizationManager.cs
- Docs/05_TASK_LOG.md

### 新增文件
- 无

### 影响范围
- 局内设置的 Camera、Casting、Controls 页面在中文环境下的标题和说明展示；英文环境继续使用原英文文本。

### 验证方式
- 静态确认 InGameSettingsUI 使用的所有字面量标题/说明均已注册，本次检查结果为 missing=0。
- Runtime 编译：dotnet build Assembly-CSharp.csproj --no-restore --nologo -v:q，0 个错误，183 个既有警告。
- Editor 编译：dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -v:q，0 个错误，12 个既有警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、语言切换或触控回归完成。

### 后续注意事项
- Unity 可用后在中文/英文之间切换局内设置页，检查新增说明在窄屏滚动容器中完整显示，并确认切换语言不改变草稿设置值。

## 2026-08-10 - 局内设置未保存修改确认

### 修改内容
- 修复局内设置页修改草稿后点击 Back 或按 ESC 会静默丢失修改的问题。
- 首次离开设置页时保留当前页面并显示未保存提示，3 秒内再次确认才放弃草稿；Apply、Save & Close、恢复默认和继续编辑会清除确认状态。
- 复用现有危险操作确认窗口、本地化和页面重建链路，不改变设置的应用与持久化语义。

### 修改文件
- Assets/Scripts/UI/InGameSettingsUI.cs
- Assets/Scripts/Core/LocalizationManager.cs
- Docs/05_TASK_LOG.md

### 新增文件
- 无

### 影响范围
- 局内暂停菜单的设置页、Back/ESC 返回、PC 键盘导航和移动端按钮返回。

### 验证方式
- 静态确认设置草稿通过 JSON 值比较识别未保存状态，Back/ESC 共用确认入口，确认超时会清理状态，确认键文案和提示已注册本地化。
- Runtime 编译：dotnet build Assembly-CSharp.csproj --no-restore --nologo -v:q，0 个错误，183 个既有警告。
- Editor 编译：dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -v:q，0 个错误，12 个既有警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、语言切换或触控回归完成。

### 后续注意事项
- Unity 可用后在 PC 与移动端分别修改一个设置，点击 Back/按 ESC，确认首次只提示不离开，二次确认才丢弃；再验证 Apply 与 Save & Close 不触发确认。

## 2026-08-10 - 科技树返回与自动生产面板状态修复

### 修改内容
- 修复启用自动打开生产面板时，从科技树使用 PC ESC、关闭按钮或移动端返回后，生产页在下一次选择刷新中错误重开的状态冲突。
- 关闭科技树或返回建筑详情时记录一次性生产页 dismiss 状态；用户随后主动点击生产操作仍会清除该状态并正常打开生产页。
- 保持科技树、建筑详情和生产队列本身的打开/关闭入口不变，仅修正页面返回后的上下文状态。

### 修改文件
- Assets/Scripts/UI/GameUI.cs
- Docs/05_TASK_LOG.md

### 新增文件
- 无

### 影响范围
- 战斗 HUD 建筑详情、科技树页面、生产页面之间的 PC ESC、按钮关闭、移动端返回和自动生产设置。

### 验证方式
- 静态确认 PC 关闭科技树、共享 ReturnToBuildingDetails 和显式 OpenProductionPanel 三条路径均覆盖一次性 dismiss/清除逻辑。
- Runtime 编译：dotnet build Assembly-CSharp.csproj --no-restore --nologo -v:q，0 个错误，183 个既有警告。
- Editor 编译：dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -v:q，0 个错误，12 个既有警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后启用 Auto Open Production Panel，分别从建筑详情进入科技树，再用 PC ESC、科技树关闭按钮和移动端返回验证回到详情页不会自动重开生产页；随后主动点击生产按钮确认仍可打开。

## 2026-08-10 - 结算与战斗告警状态收敛

### 修改内容
- 修复旧版 `UIManager` 结算层只显示、不随离开胜负态自动隐藏的问题，避免返回主菜单或进入下一局时残留遮挡和射线拦截。
- 强化 `BattleAlertUI` 的可见性生命周期：首次处于非战斗状态、组件禁用后重新启用以及结算/返回菜单时，都会清理告警计时器、战斗 feed、边缘闪烁和 CanvasGroup 交互状态。
- 保持结算页、暂停页和小地图现有的返回、输入阻塞与状态清理链路不变，仅补齐跨页面状态边界。

### 修改文件
- `Assets/Scripts/UI/UIManager.cs`
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD、结算页、暂停后恢复、返回主菜单和开始下一局时的 UI 可见性、射线阻塞与焦点上下文。

### 验证方式
- 静态确认 `UIManager` 对 Victory/GameOver 显示结算层，对 Playing/Paused/MainMenu 等非终结状态隐藏结算层并关闭交互。
- 静态确认 `BattleAlertUI` 在首次绑定、非战斗状态切换和 `OnDisable` 路径均重置根 CanvasGroup 与瞬时告警状态。
- Runtime 编译：`dotnet build Assembly-CSharp.csproj --no-restore --nologo -v:q`，183 个既有警告，0 个错误。
- Editor 编译：`dotnet build Assembly-CSharp-Editor.csproj --no-restore --nologo -v:q`，195 个既有警告，0 个错误。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后验证胜利/失败 → 结算 → 重试/下一关/返回模式选择/主菜单四条路径，确认旧结算层、战斗告警、小地图、时间流速和 EventSystem 当前选中对象均不残留。

## 2026-08-10 - 主菜单关键节点校验与建筑详情滚动连续性

### 修改内容
- 修复同一建筑的详情/生产面板在选择事件、语言切换、控制方案或布局刷新后无条件回到滚动顶部的问题；切换到新建筑时仍重置到顶部，避免继承上一栋建筑的阅读位置。
- 为 Home、InstanceSelection 和 Settings 页面补充关键 Button/Label Prefab 节点校验；Prefab 不完整时整页停止交互并记录不可用原因，避免显示可见但按钮无响应的半成品页面。
- 复用现有页面 Prefab、ScrollRect、EventSystem 和页面禁用链路，没有新增依赖或改变现有页面入口。

### 修改文件
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/UI/MainMenuUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 建筑详情/生产面板刷新时的阅读连续性；主菜单首页、模式选择页和设置页的 Prefab 完整性与可操作性。

### 验证方式
- 静态检查确认 Home 9 个关键入口、InstanceSelection 6 个模式按钮与返回按钮、Settings 10 个设置操作行与 3 个底部按钮均经过 Button/Label 校验。
- 静态检查确认同一建筑刷新保留 ScrollRect normalized position，新建筑通过 `RefreshBinding(resetDetailsScroll: true)` 明确回到顶部；检查结果全部 PASS。
- Runtime 编译：0 个错误，完整编译输出 184 个既有警告。
- Editor 编译：0 个错误，完整编译输出 195 个既有警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后验证主菜单三个页面的键盘/触控入口；在建筑详情滚动到中下部后触发选择刷新、语言切换与移动/桌面控制方案切换，确认滚动位置保持且切换建筑时回到顶部。

## 2026-08-10 - 战斗指令模式非战斗状态收敛

### 修改内容
- 修复 InputHandler 在暂停、结算、返回主菜单或场景过渡时直接返回、却可能保留攻击移动、巡逻、技能目标、集结点、特殊目标和移动端拖拽状态的问题。
- 将待处理交互模式的清理责任补回 InputHandler 自身；非 Playing 状态会取消所有交互模式，若没有待处理模式也会重置移动端指针跟踪。
- 保留 GameUI 的事件级清理和移动端 Back 关闭层级，新增逻辑作为输入层的生命周期兜底，不改变正常 Playing 状态下的指令行为。

### 修改文件
- `Assets/Scripts/Core/InputHandler.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端的攻击移动、巡逻、技能选点、集结点、特殊目标选择，以及暂停/结算/返回主菜单后的首次输入。

### 验证方式
- 静态检查确认非 Playing 状态会进入 InputHandler 清理分支，移动端 Back 的关闭层级和 SelectionPanel 模态输入边界保持有效，检查结果全部 PASS。
- Runtime 编译：0 个错误，184 个既有警告。
- Editor 编译：0 个错误，195 个既有警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后分别在 PC 和移动控制方案下进入攻击移动、巡逻或技能选点，再暂停/打开结算/返回主菜单；恢复或开始下一局后确认第一点击不会执行旧指令。

## 2026-08-10 - 设置与存档列表滚动状态连续性

### 修改内容
- 修复 InGameSettingsUI 在设置项重建、语言/控制方案切换、状态提示和存档删除后滚动位置跳回顶部的问题。
- 同一页面且同一设置分类保留 ScrollRect normalized position；切换页面或设置分类时明确从顶部开始，避免把旧上下文错误带入新内容。
- 在内容重建完成并刷新 Canvas 布局后恢复滚动，并停止旧的惯性移动，保持 PC 键盘导航与移动端滑动上下文一致。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗暂停菜单的控制设置页、设置分类切换、存档管理列表，以及 PC/移动端的长列表操作体验。

### 验证方式
- 静态检查确认滚动位置在 ClearRoot 前捕获、在新内容布局刷新后恢复，并确认设置分类切换会重置滚动；检查结果全部 PASS。
- Runtime 编译：0 个错误；增量输出 0 个警告，完整编译时仍有 184 个既有警告。
- Editor 编译：0 个错误；增量输出 0 个警告，完整编译时仍有 195 个既有警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后在设置页滚动到中下部，切换同分类内的开关/枚举、切换语言或控制方案，确认位置保持；再切换设置分类确认从顶部开始，并在存档删除后确认列表位置合理。

## 2026-08-10 - 暂停状态拦截建造页快捷键

### 修改内容
- 修复 `BuildDevelopmentPanelUI` 在暂停遮罩出现后仍通过独立 `Update` 消费 Q/W/E/R/T 建造分类快捷键的问题。
- 将建造页快捷键入口与 `GameUI`、`TechTreePanelUI`、`InputHandler` 统一到 `GameState.Playing` 边界；暂停前的建造页上下文仍保留，恢复后不会被后台输入修改。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 建造页分类快捷键、暂停菜单期间的键盘输入隔离，以及恢复战斗后的建造页上下文一致性。

### 验证方式
- 静态检查确认建造快捷键入口先判断 `GameState.Playing`，并确认 TechTree 的既有状态边界、InputHandler 非 Playing 清理和移动端 Back 关闭层级仍通过；检查结果全部 PASS。
- Runtime 编译：0 个错误，183 个既有警告。
- Editor 编译：0 个错误；本次增量编译输出 0 个警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后打开建造页，暂停游戏并按 Q/W/E/R/T，确认分类不变化；恢复游戏后再确认快捷键仍能正常切换分类。

## 2026-08-10 - 建造详情卡输入模态边界

### 修改内容
- 修复建造页打开置顶操作详情卡后，Q/W/E/R/T 仍能修改底层建造分类的问题。
- 置顶 `OperationDetailCardView` 现在作为建造页快捷键的最高输入层；关闭详情卡前不会改变底层建造页上下文。
- 与暂停状态边界合并在同一快捷键入口，避免暂停或模态详情期间出现后台 UI 状态变更。

### 修改文件
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 建造目录分类快捷键、建造详情卡的模态交互，以及暂停/详情/恢复流程中的页面状态一致性。

### 验证方式
- 静态检查确认 Playing 状态和置顶详情卡判断均位于 Q/W/E/R/T 输入之前，检查结果全部 PASS。
- Runtime 编译：0 个错误，183 个既有警告。
- Editor 编译：0 个错误，12 个既有警告。
- Unity 当前仍存在既有编辑器进程，尚未宣称新的 PlayMode、视觉、分辨率或触控回归完成。

### 后续注意事项
- Unity 可用后在建造页悬停并置顶详情卡，按 Q/W/E/R/T 确认分类不变化；关闭详情卡后确认快捷键恢复正常。

## 2026-08-10 - 修复生产与科技详情文案乱码

### 修改内容
- 修复建造页 PC 快捷操作提示、单位生产提示、科技研究提示和科技效果摘要中的实际乱码。
- 保留原有消耗、时间、属性、校验结果和快捷操作逻辑，仅恢复玩家可读文案并统一提示语气。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 建造页的建筑快捷操作、单位生产、科技研究、建造校验和科技效果详情提示。

### 验证方式
- 针对本次修改范围执行乱码模式检查，结果 PASS。
- Runtime 编译：0 个错误，183 个既有警告。
- Editor 编译：0 个错误，12 个既有警告。
- `git diff --check` 通过。

### 后续注意事项
- Unity 可用后需在不同分辨率下实际查看生产/研究悬停卡，确认字体、换行和移动端详情区域没有溢出。

## 2026-08-10 - 统一技能与机械改造详情面板归属

### 修改内容
- 修复技能按钮悬停/长按同时打开 `SelectionPanel` 详情面板和通用 `OperationDetailCard` 的重复显示问题。
- 修复机械改造按钮的同类重复详情问题，避免两个面板竞争焦点、关闭时互相影响。
- 删除技能通用英文占位卡片，并将无效技能标题回退到本地化文本。

### 修改文件
- `Assets/Scripts/UI/SkillButtonTipForwarder.cs`
- `Assets/Scripts/UI/MechanicalModTipForwarder.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 技能栏、机械改造卡、悬停/长按详情、移动端详情固定和 PC 焦点/模态输入边界。

### 验证方式
- 静态检查确认技能与机械改造 Forwarder 不再直接创建或关闭全局 `OperationDetailCard`，技能回退标题本地化检查通过。
- Runtime 编译：0 个错误，183 个既有警告。
- Editor 编译：0 个错误，0 个警告。
- `git diff --check` 通过。

### 后续注意事项
- Unity 可用后分别在 PC 悬停、移动端长按、拖动离开和置顶详情场景中确认只出现一个详情面板，且不会影响其他控件的详情卡。

## 2026-08-10 - 暂停期间收敛战斗警报 HUD

### 修改内容
- 修复 `BattleAlertUI` 把暂停态当作持续战斗态的问题。
- 进入暂停后隐藏并清空瞬时边缘闪烁、横幅、战斗 Feed、低生命提示和音频冷却；暂停期间拒绝新的战斗警报事件。
- 恢复到 Playing 后重新接受警报，避免暂停时消耗倒计时或在恢复瞬间显示过期信息。

### 修改文件
- `Assets/Scripts/UI/BattleAlertUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗警报横幅、边缘提示、战斗 Feed、低生命提示、警报音效，以及暂停/恢复状态切换。

### 验证方式
- 静态检查确认警报显隐和事件入口均严格要求 `GameState.Playing`，结果 PASS。
- Runtime 编译：0 个错误，183 个既有警告。
- Editor 编译：0 个错误，12 个既有警告。
- `git diff --check` 通过。

### 后续注意事项
- Unity 可用后验证：先触发警报再暂停、暂停时触发攻击/伤害事件、恢复后触发新警报；确认暂停期间不显示/不播放旧警报，恢复后新警报正常出现。

## 2026-08-10 - 收敛主菜单状态与输入边界

### 修改内容
- 为 `MainMenuUI` 增加页面成功渲染状态；没有可用页面时保持菜单隐藏，避免空 Canvas 拦截输入。
- 菜单进入隐藏态时清除 EventSystem 当前焦点，避免战斗、结算或会话过渡期间残留键盘/手柄输入。
- `ShowModeSetupPage` 增加会话过渡和游戏状态校验，不再强制绕过状态机显示模式设置页。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 主菜单 Home、实例选择、模式设置、设置、图鉴页面，以及战斗/结算/返回主菜单的状态切换。

### 验证方式
- 静态检查：页面状态、隐藏焦点清理、过渡拦截和强制显隐移除均 PASS。
- Runtime 编译：0 个错误，183 个既有警告。
- Editor 编译：0 个错误，12 个既有警告。
- `git diff --check` 通过。

### 后续注意事项
- Unity 可用后验证：从主菜单进入战斗、暂停、结算、返回主菜单和直接返回模式设置；确认菜单不会在过渡中抢焦点或拦截战场输入。

## 2026-08-10 - 修复 HUD 状态同步与隐藏焦点残留

### 修改内容
- 将 `GameUI` 的胜负结算、暂停清理和恢复刷新从可选的状态文本节点判空中解耦，避免 Prefab 缺少状态文字时状态机不收敛。
- HUD 进入非战斗隐藏态时清理 EventSystem 当前选中控件，避免不可见输入框或按钮继续保留键盘/手柄焦点。
- 科技树在暂停或其他非 Playing 状态自动关闭时，同步清理 `GameUI` 的主面板状态，避免恢复后出现镜头锁定、Escape 只关闭幽灵页面等问题。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- HUD 状态文本、胜负结算入口、暂停/恢复、科技树页面、PC 与移动端页面边界及 EventSystem 焦点。

### 验证方式
- 静态检查确认状态副作用不再依赖 `gameStateText` 存在，科技树关闭路径与 `activeMainPanel` 收口一致。
- Runtime 编译：0 个错误，183 个既有警告。
- Editor 编译：0 个错误，12 个既有警告。
- `git diff --check` 通过。

### 后续注意事项
- Unity 可用后验证：缺少状态文本节点的 HUD、暂停时打开科技树、恢复后镜头移动与 Escape、结算后返回主菜单，以及移动端返回键路径。

## 2026-08-10 - 收敛小地图暂停预警与战役终章结算

### 修改内容
- 暂停时保留小地图作为空间参照，但冻结战斗预警、提示计时和动态战术状态；恢复战斗时重新建立刷新计时，避免暂停期间出现过期或持续跳动的预警。
- 小地图所有战斗事件入口统一限制在 Playing 状态，并在暂停/离开战斗时清理预警、提示和展开态，避免不可交互的 HUD 残留战斗反馈。
- 战役终章胜利结算不再显示会回到当前章节的“下一关”；主操作返回战役地图，次操作改为重试当前关卡。
- “下一关”流程增加终章保护，避免章节索引被定义层钳制后重复启动最后一关。

### 修改文件
- `Assets/Scripts/UI/MinimapUI.cs`
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD、小地图预警与展开态、暂停/恢复状态、战役胜利结算、终章重试和战役地图入口。

### 验证方式
- 静态检查确认小地图事件与提示均受 Playing 状态门控，终章结算按钮与章节边界均有明确分支。
- Runtime 编译：0 个错误，183 个既有警告。
- Editor 编译：0 个错误，12 个既有警告。
- `git diff --check` 通过。

### 后续注意事项
- Unity 可用后验证：战斗中触发预警、暂停/恢复、展开/收起小地图、离开战斗，以及战役第 4 章胜利后的战役地图和重试路径。

## 2026-08-10 - 收口选择面板与科技树的战斗状态门控

### 修改内容
- 为选择面板的技能释放、自动施法、巡逻、自动采集、兽类/自然/机械操作、停止/攻击移动、生产、研究、取消研究、建筑操作和建造入口增加 Playing 状态门控。
- 为按钮转发器入口增加同样的状态检查，避免暂停/结算切换同帧的迟到点击绕过页面层拦截。
- 为科技树研究入口增加 Playing 状态检查，保证暂停或结算状态不会启动研究。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 移动端与 PC 选择面板操作、生产/研究队列、科技树、技能与单位自动化操作，以及暂停/结算切换期间的输入安全边界。

### 验证方式
- 静态检查确认所有会改变战斗状态的选择面板入口统一调用 Playing 状态门控。
- Runtime 编译：0 个错误，183 个既有警告。
- Editor 编译：0 个错误，12 个既有警告。
- `git diff --check` 通过。

### 后续注意事项
- Unity 可用后验证：暂停状态尝试点击/触发技能、生产、研究、自动化和建筑操作；恢复后确认正常操作仍可用，结算后确认不会写入新队列或进入建造模式。

## 2026-08-10 - 收口生产页与队列操作状态边界

### 修改内容
- 实际生产页 `UnitProductionPanel` 的生产卡、详情训练、长按重复生产和取消队列入口统一要求 `GameState.Playing`。
- 暂停或结算时禁用生产卡、队列取消按钮和重复生产转发器，避免迟到点击继续修改生产队列。
- 旧 `BuildingProductionUI` 的快捷生产、研究、建筑动作和升级入口增加相同保护，并在暂停切换时同步刷新按钮交互状态。
- 生产页统一入口增加 `Playing` 校验，暂停或结算期间不再打开可修改队列的生产页面。

### 修改文件
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Assets/Scripts/UI/BuildingUnitProductionWindowUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端生产页、旧建筑详情生产页、单位生产队列、研究/建筑快捷操作、升级入口，以及暂停/结算状态切换。

### 验证方式
- Runtime 工程编译：0 个错误；输出仅包含项目既有警告。
- Editor 工程编译：0 个错误；输出仅包含项目既有警告。
- `git diff --check` 通过。
- Unity 运行时视觉、触控和完整流程回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后验证：移动端生产页滑动、点卡、详情训练、长按连点和取消队列；暂停/结算期间确认按钮不可交互且队列不变，恢复 Playing 后生产与取消恢复正常。

## 2026-08-10 - 收口选择动作页与建造预览的暂停交互

### 修改内容
- 选择详情页在暂停/结算时统一刷新 PC 生产、研究、建造、建筑动作、队列取消、机械改造、技能和单位自动化按钮为不可交互状态。
- 为选择页状态切换增加一次性 UI 刷新，避免状态已经暂停但按钮仍保留上一帧可用视觉；恢复 Playing 后自动恢复正常交互。
- 建造放置覆盖层在非 Playing 状态自动取消并关闭，直接调用放置入口也不会绕过战斗状态门控。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/BuildDevelopmentPanelUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端选择详情动作区、生产/研究队列、机械改造卡、技能/自动化按钮，以及建造预览和暂停/恢复状态切换。

### 验证方式
- Runtime 工程顺序编译：0 个错误，0 个警告。
- Editor 工程顺序编译：0 个错误，0 个警告。
- `git diff --check` 通过。
- Unity 运行时视觉、触控和完整流程回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后验证：暂停时选择单位/建筑、打开生产/研究/改造页、尝试取消队列和点击自动化按钮；确认按钮显示 Disabled、不会改变状态，恢复后焦点和操作可正常返回。

## 2026-08-10 - 统一移动端暂停设置页安全区布局

### 修改内容
- 暂停、控制设置、存档三个移动端模态页统一基于 `UiSafeAreaUtility` 避让刘海、圆角和系统手势区域，保留桌面端原有布局。
- 独立创建的暂停按钮根据右侧和顶部安全区自动向内收缩，避免贴边误触或被系统区域遮挡。
- 暂停页状态提示改为贴底布局，移除小屏上可能跑出面板的固定纵向定位。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 移动端暂停菜单、控制设置、存档管理的面板边界、状态提示和暂停入口触控区域；不改变 Prefab 节点结构和桌面端布局。

### 验证方式
- Runtime 工程顺序编译：0 个错误，输出包含项目既有警告。
- Editor 工程顺序编译：0 个错误，输出包含项目既有警告。
- `git diff --check` 通过。
- Unity 移动端视觉、旋转、刘海/手势区和触控回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后验证竖屏/横屏和不同安全区设备上的暂停、设置、存档页；确认按钮不被遮挡、状态提示可见、滚动区域和底部操作按钮仍可触控。

## 2026-08-10 - 收口 GameUI 建造与科技树入口状态边界

### 修改内容
- `GameUI` 的建造目录、建造放置覆盖层、科技树公开入口统一要求 `GameState.Playing`，暂停、结算和场景过渡期间不再打开可交互战斗页面。
- 建筑集结点、升级动作以及建造/科技树可保持判定增加同一状态门控，防止移动端按钮、键盘入口或迟到回调绕过页面层 disabled 状态。
- 非 Playing 状态尝试打开建造放置覆盖层时主动取消放置并刷新建造入口可见性，避免残留放置模式拦截下一次输入。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端建造目录、建造预览、科技树、集结点和建筑升级入口，以及暂停/结算/过渡状态下的战斗 UI 输入边界。

### 验证方式
- Runtime 工程顺序编译：0 个错误，输出包含项目既有警告。
- Editor 工程顺序编译：0 个错误，输出包含项目既有警告。
- 静态检查确认所有新增入口门控位于实际状态改变前。
- Unity PlayMode、视觉、分辨率和触控回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后分别在 Playing、Paused、Victory/GameOver 和场景切换瞬间尝试打开建造/科技树、设置集结点和升级；确认暂停/结算不会出现可交互页面，恢复 Playing 后入口仍正常工作。

## 2026-08-10 - 收口生产科技页的状态刷新与队列同步

### 修改内容
- 独立科技树和建筑详情页公开入口增加 `GameState.Playing` 门控，暂停、结算和场景过渡期间不会重新打开战斗操作页。
- 独立造兵页记录 Playing 状态边界；暂停切入或恢复时重新刷新生产卡、取消按钮和详情训练按钮，避免沿用上一帧的可交互状态。
- 建筑详情页绑定生产/研究队列事件，队列开始、进度、完成、取消或外部变化会通过节流刷新摘要、快捷操作和升级状态，避免面板数据滞后。

### 修改文件
- `Assets/Scripts/UI/UnitProductionPanel.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/BuildingProductionUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端建筑详情、独立造兵页、科技树详情操作、生产/研究队列状态，以及暂停/恢复期间的按钮可用性和信息及时性。

### 验证方式
- Runtime 工程顺序编译：0 个错误，输出包含项目既有警告。
- Editor 工程顺序编译：0 个错误，输出包含项目既有警告。
- 静态检查确认队列事件在绑定变化时先解除旧监听，再注册新监听；隐藏面板和组件禁用时清理监听。
- Unity PlayMode、视觉、分辨率和触控回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后验证 Playing→Paused→Playing 的独立造兵页按钮状态；在队列外部开始、完成、取消和资源变化期间观察建筑详情快捷按钮、状态摘要和科技页详情是否及时更新。

## 2026-08-10 - 收口独立战斗页面的输入边界

### 修改内容
- `GameUI.IsBattlefieldInputBlockedByUi` 增加对实际可见生产详情、独立造兵页和科技树页的检查，避免页面过渡期间 `activeMainPanel` 短暂落后时镜头、选中或技能输入穿透。
- 保留建造放置覆盖层的专属交互语义，不把放置预览误当成普通模态页，避免禁用放置时仍需要的战场输入。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端生产、建筑详情和科技树页面切换期间的战场输入拦截、页面残留保护和状态机收敛；不改变建造放置的相机/预览交互。

### 验证方式
- Runtime 工程顺序编译：0 个错误，输出包含项目既有警告。
- Editor 工程顺序编译：0 个错误，输出包含项目既有警告。
- 静态检查确认可见页面控制器与输入门控路径一致，且 `git diff --check` 通过。
- Unity PlayMode、视觉、分辨率和触控回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后验证生产页/科技树页在打开、返回、关闭动画和快速切换期间，镜头、选中、技能快捷键与移动端触控不会穿透；另行验证建造放置时镜头和预览确认仍可用。

## 2026-08-10 - 收口战斗输入与终结页面状态门控

### 修改内容
- 战场 UI 输入边界增加对可见独立战斗页面的兜底判断，避免页面枚举短暂滞后时镜头、选中和技能输入穿透。
- 输入处理公共入口统一绑定 `GameState.Playing`：暂停、结算和场景过渡期间不再重新激活移动、攻击移动、巡逻、技能目标、集结点、吞噬/献祭、自然融合或机械建筑移动；保留 `Context` 作为取消路径并清理排队命令。
- 移动端施法取消提示绑定 Playing 状态，避免暂停或结算时因迟到状态事件继续显示战斗操作提示。
- 暂停设置、结算页和旧终结页增加状态机防护；错误状态或迟到回调不会重新打开遮罩、设置焦点或结算操作。
- 操作详情卡片的静态显示入口增加 Playing 门控，防止悬浮/按钮迟到回调在暂停、结算或主菜单上方生成详情卡。
- 补齐自然融合不可用与目标选择提示的中英文本地化键，统一反馈路径。

### 修改文件
- `Assets/Scripts/UI/GameUI.cs`
- `Assets/Scripts/Core/InputHandler.cs`
- `Assets/Scripts/Core/LocalizationManager.cs`
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/MatchSettlementUI.cs`
- `Assets/Scripts/UI/UIManager.cs`
- `Assets/Scripts/UI/OperationDetailCardView.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端战斗 HUD、页面遮罩、暂停/结算状态、详情卡片、指令与技能目标输入，以及自然融合失败/选择目标时的用户反馈。

### 验证方式
- Runtime 工程顺序编译：0 个错误，输出包含项目既有警告。
- Editor 工程顺序编译：0 个错误，输出包含项目既有警告。
- 静态检查确认修改文件无行尾空白，`git diff --check` 通过。
- Unity PlayMode、视觉、分辨率和触控回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后验证 Playing→Paused→Playing、Playing→Victory/GameOver、快速返回主菜单及场景切换瞬间，确认所有遮罩、详情卡、移动端取消按钮和输入焦点都按状态收敛；同时验证建造放置预览仍保留需要的相机交互。

## 2026-08-10 - 收口菜单过渡与战斗小地图入口状态

### 修改内容
- 主菜单页面切换统一绑定主菜单状态和会话过渡状态，迟到按钮回调不会在加载或战斗期间重建菜单。
- 开始对局、读取存档、删除存档入口增加状态与当前页校验，避免旧页面按钮执行跨状态操作。
- 选择面板内嵌建造目录入口绑定 Playing 状态；暂停、结算和下一场会话期间不再刷新动作页。
- 小地图比赛时间只在 Playing/Paused 更新，避免非战斗状态迟到回调重新初始化或写入小地图。

### 修改文件
- `Assets/Scripts/UI/MainMenuUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/MinimapUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端主菜单页面、存档管理、选择/建造入口、小地图比赛时间，以及会话切换期间的迟到 UI 回调。

### 验证方式
- Runtime 工程顺序编译：0 个错误，183 个警告。
- Editor 工程顺序编译：0 个错误，12 个警告。
- 静态检查确认修改文件无行尾空白，关键状态门控存在，`git diff --check` 通过。
- Unity PlayMode、视觉、分辨率和触控回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后验证主菜单快速点击开始/读取/删除、场景切换瞬间，以及 Playing→Paused→Settlement 时小地图时间和选择面板入口不会残留或穿透。

## 2026-08-10 - 收口暂停页操作与控制组长按交互

### 修改内容
- 暂停设置页的设置、存档、读取、删除、认输、返回主菜单和退出入口统一校验当前仍处于 Paused 且页面上下文匹配，迟到按钮回调不会跨页面或跨会话执行。
- 控制组长按转发器在 PointerExit、PointerUp 和组件禁用时取消计时，避免移出按钮后下一帧仍打开管理页。
- 控制组选择、重绑、定位、清空和拖动入口统一绑定 Playing 状态；暂停切入时关闭控制组弹层，并将快捷组按钮显示为不可交互。

### 修改文件
- `Assets/Scripts/UI/InGameSettingsUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Assets/Scripts/UI/SelectionPanelLongPressForwarder.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端暂停设置/存档页、控制组快捷栏、长按管理面板、组选择器，以及暂停/结算/页面切换期间的输入安全边界。

### 验证方式
- Runtime 工程顺序编译：0 个错误，183 个警告。
- Editor 工程顺序编译：0 个错误，12 个警告。
- 静态检查确认修改文件无行尾空白，关键页面和状态门控存在，`git diff --check` 通过。
- Unity PlayMode、视觉、分辨率和触控回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后验证暂停页按钮快速连点、页面切换瞬间、控制组短按/长按/拖出/暂停恢复，以及移动端触控取消是否都保持单一动作结果。

## 2026-08-10 - 收口研究队列与生存任务抽屉状态边界

### 修改内容
- 旧建筑研究卡和独立科技树取消研究入口统一要求 Playing，暂停/结算期间不再改变研究队列。
- 生存任务抽屉在暂停、结算和离开战斗时自动关闭，领取奖励入口增加 Playing 状态校验。
- 生存任务入口与领取按钮的可交互视觉同步状态机，避免显示可用但无法执行或迟到回调执行。

### 修改文件
- `Assets/Scripts/UI/BuildingResearchPanel.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/GameUI.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端建筑研究页、独立科技树研究队列、生存任务抽屉、任务领取按钮，以及暂停/结算/会话切换期间的交互边界。

### 验证方式
- Runtime 工程顺序编译：0 个错误，183 个警告。
- Editor 工程顺序编译：0 个错误，12 个警告。
- 静态检查确认修改文件无行尾空白，研究/任务状态门控存在，`git diff --check` 通过。
- Unity PlayMode、视觉、分辨率和触控回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后验证 Playing→Paused→Playing、研究开始/取消、任务抽屉打开/领取/切页，以及快速结算或返回主菜单时没有残留按钮或迟到回调。

## 2026-08-10 - 收口机械改造页的暂停状态边界

### 修改内容
- 机械单位与机械建筑改造卡的安装入口统一要求 Playing，暂停/结算期间不会因迟到的卡片回调开始改造。
- 机械改造取消入口增加 Playing 状态校验，避免暂停/结算期间改变改造队列。
- 保持现有按钮可交互状态、绑定组件和 Prefab 结构不变，仅收紧状态改变前的逻辑门控。

### 修改文件
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC 与移动端机械单位/建筑控制页、机械改造卡、改造取消按钮，以及 Playing→Paused/Settlement 的迟到 UI 回调边界。

### 验证方式
- Runtime 工程顺序编译：0 个错误，183 个警告。
- Editor 工程顺序编译：0 个错误，12 个警告。
- 静态检查确认修改文件无行尾空白，三个机械改造入口均存在 Playing 门控，`git diff --check` 通过。
- Unity PlayMode、视觉、分辨率和触控回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后验证改造卡点击、取消、暂停/恢复、结算和切换选中对象时，改造状态与反馈文本没有迟到或穿透。

## 2026-08-10 - 收口移动技能手势与科技树状态边界

### 修改内容
- 移动端技能按钮在 PointerDown、Drag、Up 与实际技能执行入口统一校验 Playing；暂停、结算或场景切换期间不会因旧手势抬指继续施法。
- InputHandler 的移动技能拖拽更新/提交入口增加同一状态校验，非 Playing 会清理未完成的技能目标状态。
- 科技树在非 Playing 时优先关闭，再处理搜索防抖、资源刷新和页面快捷键；分支、筛选、重置、节点提示和研究节点回调不会重建隐藏页面。
- 多选头像聚焦入口增加 Playing 门控，避免暂停时改变当前选中焦点。

### 修改文件
- `Assets/Scripts/UI/MobileSkillButtonGestureForwarder.cs`
- `Assets/Scripts/Core/InputHandler.cs`
- `Assets/Scripts/UI/TechTreePanelUI.cs`
- `Assets/Scripts/UI/SelectionPanel.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- PC/mobile 技能触控手势、科技树页面、多选头像聚焦，以及 Playing→Paused/Settlement/场景切换期间的输入与迟到回调边界。

### 验证方式
- Runtime 工程顺序编译：0 个错误，183 个警告。
- Editor 工程顺序编译：0 个错误，12 个警告。
- 静态检查确认修改源文件无行尾空白，移动技能手势清理、科技树状态门控和多选聚焦门控存在。
- Unity PlayMode、视觉、分辨率和触控回归暂未执行，当前环境没有可用 Unity Editor/运行时连接。

### 后续注意事项
- Unity 可用后验证按住移动技能→暂停→抬指、搜索防抖中暂停、科技树标签/悬浮提示，以及恢复后多选头像聚焦是否保持一致。
