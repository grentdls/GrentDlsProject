# 32_地图与任务 UI：任务日志、地图目标、结算、死亡界面


> 设计边界说明：本项目可以参考《流放之路2》这类暗黑刷宝 ARPG 的信息架构、交互复杂度和系统深度，但不能一比一复制其 UI 视觉、图标、文字、专有数值、专有命名、具体排版截图。本批文档采用“同类结构 + 原创表现”的方式：界面功能、层级、预制体和数据绑定可直接用于 Unity 原型开发。


## 1. 任务日志 UI

```text
UI_QuestLogRoot.prefab
├── Header
│   ├── TitleText
│   ├── SearchInput
│   └── CloseButton
├── LeftQuestList
│   ├── QuestCategoryTabs
│   │   ├── MainQuest
│   │   ├── SideQuest
│   │   ├── MapQuest
│   │   └── CompletedQuest
│   └── QuestListScroll
│       └── UI_QuestListItem[]
├── CenterQuestDetail
│   ├── QuestTitleText
│   ├── QuestDescriptionText
│   ├── ObjectiveList
│   ├── LocationPreview
│   └── LoreTextBlock
├── RightRewardPanel
│   ├── RewardItemSlots
│   ├── RewardCurrencyRows
│   ├── RewardPassivePointRow
│   └── RewardUnlockRows
└── BottomActionBar
    ├── TrackButton
    ├── UntrackButton
    ├── ShowOnMapButton
    └── AbandonButton
```

## 2. 任务列表项

```text
UI_QuestListItem.prefab
├── QuestTypeIcon
├── QuestNameText
├── ProgressText
├── TrackedMarker
├── CompleteMarker
├── NewMarker
├── HoverOutline
└── SelectedOutline
```

## 3. 当前地图目标 HUD

```text
UI_ObjectiveTrackerMini.prefab
├── HeaderText                  // 当前地图目标
├── MainObjectiveRow
├── OptionalObjectiveRows
├── BossObjectiveRow
├── MapCompletionProgress
└── CollapseButton
```

显示示例：

```text
当前地图目标
- 找到矿洞深处的黑炉守卫
- 击杀精英怪：2/5
- 打开宝箱：1/3
- 探索区域：68%
```

## 4. 大地图界面

```text
UI_LocalMapRoot.prefab
├── Header
│   ├── AreaNameText
│   ├── AreaLevelText
│   ├── MapModifierText
│   └── CloseButton
├── MapViewport
│   ├── ExploredMapLayer
│   ├── FogOfWarLayer
│   ├── PlayerMarker
│   ├── PartyMarkerLayer
│   ├── QuestMarkerLayer
│   ├── BossMarkerLayer
│   ├── ChestMarkerLayer
│   └── PortalMarkerLayer
├── RightLegendPanel
├── BottomObjectivePanel
└── MapZoomControls
```

## 5. 地图结算界面

```text
UI_MapResultPanel.prefab
├── Header
│   ├── ResultTitleText
│   ├── MapNameText
│   ├── CompletionGradeText
│   └── CloseButton
├── SummaryPanel
│   ├── TimeUsedRow
│   ├── DeathCountRow
│   ├── MonstersKilledRow
│   ├── EliteKilledRow
│   ├── BossKilledRow
│   ├── ChestsOpenedRow
│   └── ExplorationPercentRow
├── RewardPanel
│   ├── ExpRewardBar
│   ├── CurrencyRewardList
│   ├── HighlightLootSlots
│   └── UnlockRewardList
├── DropStatisticsPanel
│   ├── RarityCountRows
│   ├── CurrencyCountRows
│   └── MapDropRows
└── ActionButtons
    ├── ReturnTownButton
    ├── ContinueExploreButton
    └── NextMapButton
```

## 6. 死亡界面

```text
UI_DeathPanel.prefab
├── DimBackground
├── DeathTitleText
├── DeathReasonText
├── KillerInfoPanel
│   ├── KillerNameText
│   ├── KillerSkillText
│   └── DamageTypeIcons
├── PenaltyPanel
│   ├── ExpPenaltyText
│   ├── PortalRemainingText
│   ├── DurabilityDamageText
│   └── MapFailureWarningText
├── ActionButtons
│   ├── RespawnAtCheckpointButton
│   ├── ReturnTownButton
│   ├── ReviveWithItemButton
│   └── SpectateButton
└── TipText
```

## 7. 地图失败界面

终局地图传送门用尽、限时失败或 Boss 战失败时打开。

```text
UI_MapFailedPanel.prefab
├── FailedTitleText
├── FailedReasonText
├── LostRewardSummary
├── RetryCostBlock
├── ReturnTownButton
└── RetryButton
```

## 8. 原型验收标准

1. 任务日志可切换主线、支线、地图任务。
2. 点击任务可追踪，并在 HUD 显示。
3. 大地图可显示玩家、出口、Boss、宝箱、任务点。
4. 地图完成后弹结算界面。
5. 玩家死亡后弹死亡界面，并显示复活选项。
