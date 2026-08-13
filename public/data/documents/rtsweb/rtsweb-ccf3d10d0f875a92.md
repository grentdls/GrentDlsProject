# HUD运行时UI旧创建清理补充说明

## 2026-05-19

### 本轮清理目标
- 继续排查项目中“旧式运行时创建 UI”的残留。
- 优先处理战斗 HUD 高级页面链路里最容易导致：
  - 页面没打开却可见
  - 只有底图露出
  - prefab 缺节点时被运行时补出旧壳

### 本轮已收紧的主链路
- `GameUI`
- `BuildDevelopmentPanelUI`
- `TechTreePanelUI`
- `BuildingUnitProductionWindowUI`
- `UnitProductionPanel`

### 规则调整
- 当场景里已经存在 `GameUI` 且目标页面属于主 HUD 模块时：
  - `BuildDevelopmentPanelUI` 不再创建独立 `BuildDevelopmentCanvas`
  - `TechTreePanelUI` 不再创建独立 `TechTreeCanvas`
  - 缺失 HUD 宿主时直接报错并保持隐藏
- `GameUI` 现在会在更早阶段把以下宿主强制置为隐藏：
  - `BuildDevelopmentRoot`
  - `BuildingUnitProductionWindow`
  - `TechTreeRoot`
  - `TechTreePanel`
- `BuildingUnitProductionWindowUI` 不再为以下节点补可见旧结构：
  - `ProductionPagePanel`
  - `ProductionDimBackground`
  - `NavHeader / UnitProductionHeader`
  - `BottomBorder`
  - `Title`
  - `Status`
  - `StandaloneUnitProductionPanel`
  - `PanelDepthShadow`
  - `PanelEdgeHighlight`
- `UnitProductionPanel` 不再为以下大区块补透明占位壳：
  - `ProductionUnitListPage`
  - `ProductionDetailTipsPage`
  - `ProductionQueueAndRallyPage`

### 当前判定原则
- 缺 prefab 宿主或关键固定节点：
  - 直接报错
  - 不再继续创建旧式可见 UI
  - 页面保持隐藏或停止绑定
- 这比“自动补一层旧面板”更符合当前项目的 prefab 主导架构，也更容易暴露真实资源缺口。

### 本轮重点修复的问题
- 解决高级页面宿主在 `Start()` 之前仍可能短暂处于可见状态的问题。
- 避免 `BuildingUnitProductionWindow` 在缺少固定节点时只剩背景壳继续挂在 HUD 上。
- 避免建造页 / 科技页在找不到 HUD prefab 宿主时偷偷退回独立 runtime canvas。

### 后续继续排查的模块
- `BuildingProductionUI`
- `BuildingResearchPanel`
- `BattleAlertUI`
- `OperationDetailCardView`
- `SelectionPanel` 中仍保留的少量“非可见占位”分支

## 2026-05-19 - 第二轮补充

### 本轮继续收口
- `BattleAlertUI`
- `BuildingResearchPanel`
- `OperationDetailCardView`

### 本轮规则调整
- `BattleAlertUI` 不再在缺失 HUD 宿主或关键 prefab 时偷偷创建运行时可见壳：
  - `BattleAlertCanvas`
  - `GateAlertBanner`
  - `CombatStatusPanel`
  - `CombatAlertFeed`
  - `CombatFeedEntry`
  - `TopEdge / BottomEdge / LeftEdge / RightEdge`
- `BattleAlertUI` 的 `CombatStatusPanel` 改为“仅在真正有战斗态势时显示”：
  - 平时不再常驻显示空白/待命底板
  - 这样可以直接规避“页面没打开但有底图露出”的一类来源
- `OperationDetailCardView` 不再在缺少 `OperationDetailCard` prefab 时创建运行时详情卡根面板。
- `BuildingResearchPanel` 不再在缺少 `ResearchButton` prefab 时创建运行时研究卡。

### 当前判断
- 这轮确认“未打开却显示 / 只剩底图”的高风险来源之一是 `BattleAlertUI`：
  - 旧逻辑会在空闲态也保留 `CombatStatusPanel` 半透明底板
  - 现在只有重压 / 推进 / 低血量提示时才激活

### 后续继续排查
- `BuildingProductionUI` 里仍有较多页面级固定结构自动补建逻辑，需要继续按 prefab 节点逐块收口
- `SelectionPanel` 已先收紧一轮右侧页壳体显隐，但仍需继续核对建造/研究/功能页在“无内容状态”下的根节点显隐是否完全受控
- `BuildingProductionPanel_Prefab` / `BuildingDetailsPanel_Prefab` 当前尚未补齐 `BuildingProductionUI` 依赖的全部固定子节点命名，下一轮应先整理缺口清单，再继续删除对应 runtime 结构补建

### 后续建议
- 下一轮优先继续按“页面级宿主 -> 固定区块 -> 动态条目”的顺序清理剩余模块。
- 对仍然保留 `new GameObject(...)` 的 UI 脚本，优先区分：
  - 动态条目实例化
  - 旧式页面/区块 fallback
- 只有后者需要继续清掉；前者如果已经明确绑定到 prefab 模板，可以保留为运行时条目实例化入口。
