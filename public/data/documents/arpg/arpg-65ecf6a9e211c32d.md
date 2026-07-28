# 29_传送 UI：主城传送、章节地图、地图装置、终局地图册


> 设计边界说明：本项目可以参考《流放之路2》这类暗黑刷宝 ARPG 的信息架构、交互复杂度和系统深度，但不能一比一复制其 UI 视觉、图标、文字、专有数值、专有命名、具体排版截图。本批文档采用“同类结构 + 原创表现”的方式：界面功能、层级、预制体和数据绑定可直接用于 Unity 原型开发。


## 1. 传送系统定位

传送 UI 分为四层：

1. 城镇传送点：主城之间、章节区域之间移动。
2. 地图入口：从主线区域进入战斗地图。
3. 地图装置：消耗地图钥石开启随机/半随机终局地图。
4. 终局地图册：长期推进的节点式地图网络。

## 2. 传送点 UI

```text
UI_WaypointRoot.prefab
├── Header
│   ├── TitleText
│   ├── CurrentLocationText
│   └── CloseButton
├── LeftRegionList
│   ├── Region_Act01
│   ├── Region_Act02
│   ├── Region_Act03
│   ├── Region_Endgame
│   └── Region_Favorites
├── CenterMapPanel
│   ├── MapBackgroundImage
│   ├── WaypointNodeLayer
│   │   └── UI_WaypointNode[]
│   ├── RouteLineLayer
│   └── PlayerCurrentMarker
├── RightLocationDetail
│   ├── LocationNameText
│   ├── AreaLevelText
│   ├── MonsterTypeText
│   ├── RecommendedPowerText
│   ├── QuestObjectiveText
│   ├── CompletionBadgeList
│   └── TravelButton
└── FooterHotkeyBar
```

## 3. 传送节点 Prefab

```text
UI_WaypointNode.prefab
├── NodeIcon
├── NodeNameText
├── UnlockStateOverlay
├── QuestMarker
├── FavoriteStar
├── CurrentLocationRing
├── HoverOutline
├── SelectedOutline
└── DangerLevelBadge
```

节点状态：

| 状态 | 说明 |
|---|---|
| Locked | 未解锁，不可传送 |
| Discovered | 已发现但未完成 |
| Completed | 已完成主要目标 |
| Current | 当前所在地区 |
| QuestTarget | 当前任务目标所在地 |
| Favorite | 玩家收藏 |
| Dangerous | 高于玩家推荐等级 |

## 4. 章节地图 UI

章节地图不是终局 Atlas，它用于主线推进。

```text
UI_CampaignMapRoot.prefab
├── Header
│   ├── ActTitleText
│   ├── StoryProgressText
│   └── CloseButton
├── ActTabs
│   ├── Act01
│   ├── Act02
│   ├── Act03
│   ├── Act04
│   └── Act05
├── RegionGraphPanel
│   ├── BackgroundArt
│   ├── LocationNodeLayer
│   └── PathLineLayer
├── RightQuestPanel
│   ├── MainQuestBlock
│   ├── SideQuestBlock
│   ├── RewardPreview
│   └── TravelButton
└── Footer
```

## 5. 地图装置 UI

地图装置是终局玩法入口。玩家放入地图钥石和强化物，生成一个可进入的地图副本。

```text
UI_MapDeviceRoot.prefab
├── Header
│   ├── TitleText
│   ├── DeviceLevelText
│   └── CloseButton
├── LeftInputPanel
│   ├── WaystoneInputSlot            // 地图钥石槽
│   ├── ModifierInputSlot_01         // 强化物槽
│   ├── ModifierInputSlot_02
│   ├── ModifierInputSlot_03
│   └── CurrencyCostBlock
├── CenterPreviewPanel
│   ├── MapNameText
│   ├── MapTierText
│   ├── AreaLevelText
│   ├── LayoutTypeText
│   ├── MonsterPackText
│   ├── RewardBonusText
│   ├── RiskWarningList
│   └── GeneratedAffixList
├── RightInventoryPanel
│   ├── MapItemFilterTabs
│   └── MapItemGrid
├── BottomPortalPanel
│   ├── PortalPreview_01
│   ├── PortalPreview_02
│   ├── PortalPreview_03
│   ├── PortalPreview_04
│   ├── PortalPreview_05
│   └── PortalPreview_06
└── BottomActionBar
    ├── OpenMapButton
    ├── ClearInputButton
    ├── SavePresetButton
    └── WarningText
```

## 6. 地图装置流程

```text
玩家点击地图装置
→ 打开 UI_MapDeviceRoot
→ 放入地图钥石
→ 系统读取地图基底：地形、等级、怪物池、奖励池
→ 放入强化物
→ 生成地图词条预览
→ 检查风险：抗性降低、复活限制、Boss 增强等
→ 点击开启
→ 在主城地图装置旁生成 6 个传送门
→ 玩家进入后加载对应副本场景
```

## 7. 终局地图册 UI

```text
UI_EndgameAtlasRoot.prefab
├── Header
│   ├── TitleText
│   ├── AtlasLevelText
│   ├── AtlasPointText
│   ├── SearchInput
│   └── CloseButton
├── AtlasViewport
│   ├── ZoomableContent
│   │   ├── BackgroundStarMap
│   │   ├── NodeConnectionLayer
│   │   ├── MapNodeLayer
│   │   ├── BossNodeLayer
│   │   ├── EventNodeLayer
│   │   └── FogOfWarLayer
│   ├── Minimap
│   └── RoutePreviewLayer
├── RightNodeDetailPanel
│   ├── NodeNameText
│   ├── MapTierText
│   ├── CompletionStateText
│   ├── RewardPreviewList
│   ├── DangerModifierList
│   ├── RequiredItemText
│   └── OpenFromAtlasButton
├── AtlasPassiveButton
├── LegendPanel
└── FooterHotkeys
```

## 8. 终局地图节点 Prefab

```text
UI_AtlasMapNode.prefab
├── NodeBackground
├── MapTypeIcon
├── TierBadge
├── CompletionRing
├── BossIcon
├── EventIcon
├── CorruptionOverlay
├── RewardIconList
├── LockedFogOverlay
├── HoverOutline
└── SelectedOutline
```

节点类型：

| 节点 | 用途 |
|---|---|
| NormalMap | 普通终局地图 |
| BossMap | Boss 地图 |
| EventMap | 包含赛季/特殊事件 |
| Stronghold | 据点地图，连续多房间推进 |
| BreachLike | 裂隙类限时刷怪事件，原创命名 |
| RitualLike | 祭坛类选择奖励事件，原创命名 |
| ExpeditionLike | 爆破/挖掘类事件，原创命名 |
| PinnacleBoss | 顶级 Boss 节点 |

## 9. 传送门 UI

```text
UI_PortalPrompt.prefab
├── PortalNameText
├── DestinationText
├── RemainingUseText
├── DangerLevelText
├── EnterButtonHint
└── CloseButtonHint
```

## 10. 数据结构

```csharp
class WaypointViewModel
{
    string RegionId;
    string LocationId;
    string DisplayName;
    int AreaLevel;
    bool IsUnlocked;
    bool IsCompleted;
    bool IsQuestTarget;
    Vector2 MapPosition;
}

class MapDeviceViewModel
{
    ItemViewModel Waystone;
    List<ItemViewModel> Modifiers;
    GeneratedMapPreview Preview;
    int PortalCount;
    bool CanOpen;
}
```

## 11. 原型验收标准

1. 传送点 UI 可以选择章节和地图点。
2. 锁定/已解锁/任务目标/当前地图状态正常显示。
3. 地图装置可以放入地图钥石并生成预览。
4. 点击开启后主城出现传送门。
5. 终局地图册支持缩放、平移、点击节点查看奖励。
