# 21_地图数据表：场景配置、刷怪点、传送点、放置物

> 目标：定义地图相关数据表和 ScriptableObject/JSON 字段，保证策划可以配置地图、刷怪、宝箱、传送、NPC 和事件。

---

## 1. 数据组织方式

推荐组合：

- 静态配置用 ScriptableObject，便于 Unity 内调试。
- 批量表格用 CSV/JSON，便于策划编辑。
- 运行时状态用 SaveData。

路径：

```text
Assets/Game/Data/Map/
Assets/Game/Data/Map/MapData/
Assets/Game/Data/Map/SpawnData/
Assets/Game/Data/Map/InteractableData/
Assets/Game/Data/Map/LootPointData/
Assets/Game/Data/Map/WaypointData/
Assets/Game/Data/Map/EventData/
```

---

## 2. MapData

地图主配置。

```text
MapData
├── MapId
├── SceneName
├── DisplayName
├── MapType
├── ActIndex
├── Tier
├── RecommendedLevel
├── MinMonsterLevel
├── MaxMonsterLevel
├── BiomeId
├── MusicId
├── LightingProfileId
├── WeatherProfileId
├── MainObjectiveId
├── BossId
├── EntrySpawnPointId
├── DefaultExitId
├── WaypointId
├── MapBounds
├── MinimapTextureId
├── IsRepeatable
├── IsTown
├── IsEndgameMap
├── UnlockConditionId
└── CompletionRewardId
```

### 示例

```json
{
  "MapId": "MAP_A01_FIELD_001",
  "SceneName": "Scene_Field_A01_001_断桥荒原",
  "DisplayName": "断桥荒原",
  "MapType": "Field",
  "ActIndex": 1,
  "Tier": 0,
  "RecommendedLevel": 4,
  "BiomeId": "BIOME_WASTELAND",
  "MainObjectiveId": "OBJ_A01_FIND_MINE",
  "BossId": "",
  "EntrySpawnPointId": "SPAWN_ENTRY",
  "WaypointId": "WP_A01_FIELD_001",
  "IsRepeatable": true,
  "IsTown": false,
  "IsEndgameMap": false
}
```

---

## 3. SpawnGroupData

刷怪组配置。

```text
SpawnGroupData
├── SpawnGroupId
├── MapId
├── EncounterAreaId
├── SpawnPointIds
├── MonsterPoolId
├── MinCount
├── MaxCount
├── SpawnMode
├── TriggerType
├── Delay
├── RespawnRule
├── DifficultyScale
├── EliteChance
├── IsRequiredForCompletion
└── DebugColor
```

### SpawnMode

| 模式 | 说明 |
|---|---|
| Fixed | 固定刷怪 |
| RandomFromPool | 从怪物池随机 |
| Wave | 波次刷怪 |
| Ambush | 玩家进入后伏击 |
| Patrol | 巡逻怪 |
| BossAdd | Boss 召唤小怪 |
| EventSpawn | 事件刷怪 |

### TriggerType

| 触发 | 说明 |
|---|---|
| OnMapStart | 地图加载后生成 |
| OnPlayerEnterArea | 玩家进入区域 |
| OnInteract | 交互后触发 |
| OnObjectiveProgress | 目标进度触发 |
| OnBossPhase | Boss 阶段触发 |
| OnTimer | 定时触发 |

---

## 4. MonsterPoolData

怪物池配置。

```text
MonsterPoolData
├── PoolId
├── BiomeId
├── MonsterEntries
│   ├── MonsterId
│   ├── Weight
│   ├── MinLevel
│   ├── MaxLevel
│   ├── Role
│   └── MaxCountInGroup
├── EliteModifierPoolId
└── BossModifierPoolId
```

Role：

```text
MeleeSmall
MeleeMedium
Ranged
Caster
Brute
Support
Summoner
Exploder
Shield
BossAdd
```

---

## 5. EncounterAreaData

战斗区域配置。

```text
EncounterAreaData
├── EncounterAreaId
├── MapId
├── AreaType
├── CenterPosition
├── Radius
├── Bounds
├── SpawnGroupIds
├── LootPointGroupId
├── EventId
├── LockDoorsOnStart
├── UnlockOnClear
├── RequiredForMapCompletion
└── MusicCombatState
```

AreaType：

```text
NormalCombat
EliteCombat
Ambush
Event
BossPreRoom
BossArena
SafeZone
TreasureRoom
```

---

## 6. WaypointData

传送点配置。

```text
WaypointData
├── WaypointId
├── DisplayName
├── MapId
├── SceneName
├── SpawnPointId
├── ActIndex
├── SortOrder
├── IsHub
├── IsDefaultUnlocked
├── UnlockConditionId
├── IconId
└── Description
```

---

## 7. NPCSpawnData

NPC 放置配置。

```text
NPCSpawnData
├── NPCSpawnId
├── NPCId
├── MapId
├── Position
├── Rotation
├── DefaultState
├── ServiceIds
├── DialogueId
├── QuestIds
├── ShowConditionId
└── IconType
```

---

## 8. InteractableSpawnData

可交互物放置配置。

```text
InteractableSpawnData
├── SpawnId
├── InteractableId
├── MapId
├── PrefabId
├── Position
├── Rotation
├── SpawnConditionId
├── SaveStateKey
├── InteractionActionId
├── LinkedObjectiveId
└── DebugNote
```

---

## 9. LootPointData

掉落点/宝箱点配置。

```text
LootPointData
├── LootPointId
├── MapId
├── Position
├── Rotation
├── LootPointType
├── LootTableId
├── SpawnChance
├── MinMapTier
├── MaxMapTier
├── RequiredEventId
├── RequiredObjectiveId
└── ExclusionGroup
```

LootPointType：

```text
SmallChest
NormalChest
LargeChest
CursedChest
BossChest
BreakableCluster
HiddenChest
EventReward
MapReward
```

---

## 10. PlacedObjectSpawnRule

放置物随机规则。

```text
PlacedObjectSpawnRule
├── RuleId
├── MapType
├── BiomeId
├── ObjectPoolId
├── MinCount
├── MaxCount
├── SpawnChance
├── RequiredTierMin
├── RequiredTierMax
├── AvoidPlayerSpawnRadius
├── AvoidBossArenaRadius
├── MinDistanceBetweenObjects
└── Tags
```

---

## 11. MapObjectiveData

地图目标配置。

```text
MapObjectiveData
├── ObjectiveId
├── MapId
├── ObjectiveType
├── DisplayText
├── TargetCount
├── TargetIds
├── ShowOnHUD
├── ShowOnMinimap
├── CompleteCondition
├── OnCompleteActions
└── RewardId
```

ObjectiveType：

```text
ReachExit
KillBoss
KillElite
DestroyObjects
ActivateObjects
OpenChest
EscortNPC
SurviveWaves
ClosePortals
CollectItems
ClearEncounterAreas
```

---

## 12. BossArenaData

```text
BossArenaData
├── BossArenaId
├── MapId
├── BossId
├── ArenaPrefabId
├── EntryDoorId
├── ExitDoorId
├── BossSpawnPointId
├── PlayerStartPointId
├── RetrySpawnPointId
├── RewardChestPointId
├── PhaseDataIds
├── DeathRewardId
├── CompletionFlagId
└── CameraProfileId
```

---

## 13. MapEventData

```text
MapEventData
├── EventId
├── EventType
├── DisplayName
├── Description
├── TriggerType
├── Duration
├── SpawnGroupIds
├── ObjectiveData
├── SuccessRewardId
├── FailedActionId
├── UIWidgetId
├── MinMapTier
├── Weight
└── CanRepeat
```

---

## 14. 地图运行时存档

```text
MapRuntimeSaveData
├── MapInstanceId
├── MapId
├── Seed
├── EnterTime
├── CompletedObjectives
├── OpenedChests
├── DestroyedObjects
├── ActivatedWaypoints
├── KilledBosses
├── EventStates
├── PortalStates
├── PlayerDeathCount
└── RemainingRevives
```

主线地图：可保存长期状态。

终局地图：只保存本次地图实例状态。

---

## 15. 地图加载流程

```text
请求进入地图
  ↓
读取 MapData
  ↓
检查 UnlockCondition
  ↓
创建 MapInstance
  ↓
加载 Scene
  ↓
定位 PlayerSpawnPoint
  ↓
初始化 NPC/Interactable/SpawnGroup
  ↓
恢复 MapRuntimeState
  ↓
播放进入特效
  ↓
开始地图目标
```

---

## 16. 地图完成流程

```text
达成 MainObjective
  ↓
设置 MapCompleted
  ↓
解锁下一个 Waypoint/Map
  ↓
生成奖励
  ↓
显示完成提示
  ↓
打开出口
  ↓
保存进度
```

---

## 17. 数据表验收标准

- [ ] 每张地图都有唯一 MapId。
- [ ] 每个传送点都有 SpawnPoint。
- [ ] 每个 NPC 都有对应 NPCData 和 ServiceId。
- [ ] 每个宝箱点都有 LootTable。
- [ ] 每个刷怪组都有 MonsterPool。
- [ ] 每个 Boss 房都有 BossArenaData。
- [ ] 每个地图目标都能被事件推进。
- [ ] 主线地图状态能保存。
- [ ] 终局地图实例能独立保存。
- [ ] 数据缺失时有编辑器校验提示。

---
