# 124_副本玩法事件库：伏击、祭坛、防守、占领、宝箱事件

> 目标：让副本玩法不只是一路清怪。所有副本都可以从事件库中选择 0-3 个事件，增加节奏变化和奖励点。

---

## 1. 事件类型总览

| EventType | 名称 | 触发方式 | 适合地图 | 奖励 |
|---|---|---|---|---|
| Ambush | 伏击 | 玩家进入区域/开箱 | 野外/地牢 | 怪物额外掉落 |
| ShrineChoice | 祭坛选择 | 交互祭坛 | 野外/终局 | 风险奖励 |
| Defense | 防守 | 激活目标 | 据点/挑战 | 目标宝箱 |
| Capture | 占领 | 站圈计时 | 据点 | 据点奖励 |
| DestroyCore | 破坏核心 | 攻击目标 | 据点/地牢 | 开门/宝箱 |
| Escort | 护送 | NPC移动 | 野外/终局 | 商队奖励 |
| TreasureTrap | 宝箱陷阱 | 开宝箱 | 地牢 | 高价值宝箱 |
| EliteHunt | 精英追猎 | 找到脚印/痕迹 | 野外 | 精英掉落 |
| PuzzleLock | 简单机关 | 拉杆/顺序 | 地牢 | 宝箱房 |
| RiftBurst | 裂隙爆发 | 裂隙出现 | 第5章/终局 | 星尘/钥石 |

---

## 2. 伏击事件 Ambush

### 流程

```text
玩家进入区域 / 开启宝箱
  ↓
门关闭或边界封锁，可选
  ↓
0.8秒预警
  ↓
刷出2-4波怪物
  ↓
清怪完成
  ↓
解锁宝箱或路径
```

### 配置字段

```text
AmbushEventData
├── EventId
├── TriggerType
├── SpawnWaveIds
├── LockArea
├── WarningVfxId
├── CompletionRewardPoolId
└── FailRule
```

---

## 3. 祭坛选择 ShrineChoice

祭坛给玩家选择风险：

| 祭坛选项 | 风险 | 奖励 |
|---|---|---|
| 献祭生命 | 玩家最大生命临时-20% | 掉落数量+25% |
| 唤醒精英 | 额外刷新2个精英 | 稀有度+25% |
| 灰烬祝福 | 地面周期喷火 | 火系材料+50% |
| 裂隙召唤 | 出现裂隙怪 | 星尘/钥石碎片 |

---

## 4. 防守事件 Defense

防守目标适合断桥守卫战、灰门前庭、秘境商队。

| 字段 | 说明 |
|---|---|
| TargetHp | 防守目标生命 |
| Duration | 防守时长 |
| LaneCount | 进攻路线数量 |
| WaveInterval | 波次间隔 |
| PriorityTargetAI | 怪物是否优先攻击目标 |
| RepairAllowed | 玩家是否可修复目标 |

---

## 5. 占领事件 Capture

站在区域内推进进度，怪物进入区域会降低速度。

| 配置 | 建议值 |
|---|---:|
| CaptureRadius | 6-10m |
| CaptureTime | 30-90秒 |
| MonsterBlockProgress | true |
| PlayerLeaveDecay | 每秒-3% |
| EliteSpawnAtProgress | 50% / 90% |

---

## 6. 宝箱陷阱 TreasureTrap

### 宝箱类型

| 宝箱 | 触发 | 奖励 |
|---|---|---|
| 普通陷阱箱 | 开启后伏击 | 普通宝箱+额外材料 |
| 诅咒宝箱 | 开启后玩家被减益 | 高稀有度装备 |
| 精英守卫箱 | 刷精英 | 稀有装备/符石 |
| 限时宝箱 | 倒计时清怪 | 大量金币/材料 |

---

## 7. 裂隙爆发 RiftBurst

第5章和终局核心事件。裂隙开启后持续刷怪，如果不关闭会逐步强化。

| 时间 | 效果 |
|---:|---|
| 0秒 | 裂隙出现，刷第一波 |
| 20秒 | 怪物伤害+10% |
| 40秒 | 刷精英 |
| 60秒 | 裂隙升级，奖励提高但风险增加 |
| 90秒 | 裂隙失控，出现小Boss |

---

## 8. 事件奖励规则

1. 事件奖励必须比普通清怪明显。
2. 事件不应强制每次都完成，允许玩家跳过。
3. 地图主线事件必须有明显 UI 目标提示。
4. 事件失败也可以给少量保底奖励，避免挫败。
5. 终局事件可受 Atlas 天赋影响。

---

## 9. 当前 Unity 实现映射

### 9.1 配置表落地

| 内容 | Unity 数据表 | 已落地 |
|---|---|---|
| 事件模板与地图实例 | `Assets/_Game/Resources/GameData/map_events.json` | 已加入伏击、祭坛选择、防守、占领、宝箱陷阱、裂隙爆发模板，并落地到第1章荒原、第2章旧王道、第3章码头、第4章灰烬、挑战防守和终局光渠地图 |
| 事件遭遇区 | `Assets/_Game/Resources/GameData/encounter_areas.json` | 已加入 `EA_EVT_A01_WASTE_AMBUSH`、`EA_EVT_A02_ROAD_CAPTURE`、`EA_EVT_A03_DOCK_TREASURE_TRAP`、`EA_EVT_A04_ASH_SHRINE`、`EA_EVT_CHALL_003_DEFENSE`、`EA_EVT_END_T04_RIFT` |
| 事件刷怪组 | `Assets/_Game/Resources/GameData/spawn_groups.json` | 已加入事件波次、精英增援、防守双路刷怪、终局裂隙三段刷怪组 |
| 事件入口交互物 | `Assets/_Game/Resources/GameData/interactables.json`、`interactable_spawns.json` | 已加入风险祭坛、占领旗帜、防守中继器、裂隙爆发装置，以及终局地图主事件祭坛、Boss门、出口实例 |
| 事件奖励 | `Assets/_Game/Resources/GameData/drop_tables.json`、`loot_points.json` | 已加入 6 套事件掉落表和 7 个事件奖励点，奖励箱通过 `RequiredEventId` 等待事件完成后开启 |
| 地图挂接 | `Assets/_Game/Resources/GameData/scene_maps.json` | 已把新增事件、遭遇区、刷怪组、交互入口、奖励点挂到对应地图 |

### 9.2 运行时落地

- `MapEventRuntimeController` 负责启动事件目标和事件状态，`MapSpawnDirector.TriggerSpawnGroup` 负责按事件刷怪组刷怪。
- `AltarController` 读取 `InteractableData.Actions.EventId`，点击祭坛、旗帜、中继器后直接启动对应地图事件。
- `ChestEventTrigger` 保留宝箱陷阱逻辑：诅咒箱打开时触发伏击或宝箱事件。
- `ChestRequirementChecker` 已支持用 `RequiredEventId` 检查事件完成状态；`EventReward`、`EventChest`、`DefenseReward`、`CaptureReward` 类型宝箱不会提前开奖。
- `PlacedObjectRuntimeStateStore` 用 `EventStates` 记录祭坛激活和事件完成状态，奖励箱、交互物复用同一运行时状态。

### 9.3 验收口径

1. `map_events.json` 中所有 `SpawnGroupIds` 必须能在 `spawn_groups.json` 找到。
2. `spawn_groups.json` 的 `MapId`、`EncounterAreaId`、`MonsterPoolId` 必须能解析到地图、遭遇区、怪物池或直指怪物。
3. `loot_points.json` 的 `LootTableId`、`RequiredEventId` 必须分别能解析到掉落表和事件。
4. `scene_maps.json` 挂接的事件、刷怪组、交互物和奖励点不能出现空引用。
5. 工程需通过 JSON 引用校验和 `dotnet build "G:\TestProject\RPG\RPG.sln" --no-restore`。
