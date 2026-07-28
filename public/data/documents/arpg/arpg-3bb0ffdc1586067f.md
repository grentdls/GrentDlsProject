# 16_战斗区域设计：野外、地牢、据点、事件

> 目标：定义战斗地图的结构、节奏、刷怪点、宝箱点、可破坏物、任务目标和原型搭建方式。战斗区要能支撑刷怪、掉落、事件、探索和 Boss 前置推进。

---

## 1. 战斗区域分类

| 类型 | 核心体验 | 地图结构 | 怪物密度 | 主要奖励 |
|---|---|---|---:|---|
| 野外 | 探索 + 普通战斗 | 半开放路线 | 中 | 普通掉落、支线宝箱 |
| 地牢 | 高密度刷怪 + 房间推进 | 房间/走廊 | 高 | 精英、宝箱、Boss 入口 |
| 据点 | 目标破坏/占领 | 开放据点 | 中高 | 据点宝箱、任务奖励 |
| 事件区 | 特殊玩法 | 局部区域 | 高/波次 | 事件奖励 |
| 试炼区 | 技巧考核 | 规则化房间 | 可控 | 成长材料 |

---

## 2. 战斗区通用层级

```text
PF_CombatMap_Base
├── MapRoot
│   ├── MapController
│   ├── CombatMapState
│   ├── MapObjectiveManager
│   ├── EncounterDirector
│   ├── SpawnDirector
│   ├── LootDirector
│   ├── EventDirector
│   └── MapCompletionTracker
├── Terrain
├── Navigation
├── PlayerSpawnPoints
├── EncounterAreas
├── MonsterSpawnGroups
├── EliteSpawnPoints
├── LootPoints
├── DestructibleGroups
├── Interactables
├── QuestObjects
├── EventVolumes
├── ExitPoints
├── Audio
├── Lighting
└── Debug
```

---

## 3. 野外地图设计

### 3.1 野外地图节奏

推荐节奏：

```text
入口安全区
  ↓ 15m
小怪教学战斗
  ↓ 30m
普通战斗区 A
  ↓ 分叉
支线宝箱区 / 精英区
  ↓
普通战斗区 B
  ↓
地图事件区
  ↓
出口缓冲区
  ↓
下一地图 / 地牢入口 / Boss入口
```

### 3.2 野外地图密度

| 地图长度 | 普通怪群 | 精英 | 宝箱 | 可破坏物 | 事件 |
|---:|---:|---:|---:|---:|---:|
| 150m | 4-6 组 | 0-1 | 1-2 | 10-20 | 0-1 |
| 250m | 7-10 组 | 1-2 | 2-4 | 20-40 | 1 |
| 350m | 10-14 组 | 2-3 | 3-5 | 35-60 | 1-2 |

### 3.3 怪物群结构

普通怪群示例：

```text
Group_Field_Basic_01
├── MeleeSmall x 4
├── MeleeMedium x 2
└── RangedSmall x 1
```

远程伏击群：

```text
Group_Field_Ambush_Ranged_01
├── MeleeSmall x 3
├── RangedSmall x 4
└── EliteOptional x 0-1
```

大型怪群：

```text
Group_Field_Brute_01
├── MeleeSmall x 6
├── BruteLarge x 1
└── SupportCaster x 1
```

### 3.4 野外地图必须放置的物件

- 小宝箱：放在主路旁或支线尽头。
- 可破坏桶/箱：放在道路两侧。
- 路障：用于引导路径。
- 掩体：给玩家躲远程攻击。
- 高台：放远程怪，但必须可绕行。
- 传送点：大型地图中段解锁。
- 出口门：明显发光，不隐藏。

---

## 4. 地牢地图设计

### 4.1 地牢房间类型

| 房间类型 | 用途 | 尺寸 | 出现权重 |
|---|---|---:|---:|
| EntranceRoom | 入口安全房 | 16m x 16m | 必出 |
| NormalCombatRoom | 普通战斗房 | 24m x 24m | 高 |
| CorridorRoom | 连接走廊 | 20m x 8m | 中 |
| SplitRoom | 分叉房 | 28m x 28m | 中 |
| ChestRoom | 宝箱房 | 18m x 18m | 低 |
| EliteRoom | 精英房 | 32m x 32m | 中 |
| TrapRoom | 机关房 | 24m x 24m | 中 |
| PuzzleRoom | 简单机关房 | 24m x 24m | 低 |
| BossPreRoom | Boss 前房 | 20m x 20m | 必出 |
| BossRoom | Boss 房 | 70m+ | 按地图 |

### 4.2 地牢生成结构

原型阶段不需要程序生成，先手工拼模块。正式阶段可替换为房间图拼接。

```text
EntranceRoom
    ↓
NormalCombatRoom_01
    ↓
SplitRoom
    ├── ChestRoom
    └── EliteRoom
    ↓
TrapRoom
    ↓
NormalCombatRoom_02
    ↓
BossPreRoom
    ↓
BossRoom
```

### 4.3 地牢门系统

门类型：

| 门 | 功能 |
|---|---|
| NormalDoor | 普通开关门 |
| LockedDoor | 需要钥匙/任务状态 |
| CombatLockDoor | 战斗开始后关闭，清怪后打开 |
| BossDoor | 进入后关闭，Boss 死亡后打开 |
| EventDoor | 完成事件后打开 |

门 Prefab：

```text
PF_Dungeon_Door_Base
├── Model
├── Collider_Blocker
├── Collider_InteractTrigger
├── VFX_Locked
├── VFX_Open
├── Audio_OpenClose
└── Components
    ├── Interactable_Door
    ├── DoorStateController
    ├── DoorRequirementChecker
    └── NavMeshObstacleController
```

---

## 5. 据点地图设计

据点地图是“有目标的开放战斗区”，不是单纯清怪。

### 5.1 据点目标类型

| 目标 | 玩法 |
|---|---|
| 破坏核心 | 打破 3 个核心后 Boss 出现 |
| 解救 NPC | 清掉守卫，打开牢笼 |
| 占领据点 | 在区域内存活并占领进度条 |
| 关闭传送门 | 按顺序关闭多个刷怪门 |
| 摧毁炮台 | 先拆炮台再进中心 |
| 收集钥匙 | 击杀精英拿钥匙开主门 |

### 5.2 据点结构示例：黑炉哨站

```text
入口斜坡
  ↓
外围巡逻区
  ├── 炉心 A
  ├── 炉心 B
  └── 炉心 C
  ↓ 三个炉心全部破坏
中心大门打开
  ↓
副官 Boss 区
  ↓
据点奖励箱 + 出口门
```

### 5.3 据点对象

```text
PF_Stronghold_Objective_Core
├── Model
├── Collider_HitBox
├── UIAnchor_HealthBar
├── VFX_Active
├── VFX_Destroyed
├── Audio
└── Components
    ├── DamageReceiver
    ├── ObjectiveTarget
    ├── ObjectiveStateBroadcaster
    └── RewardTriggerOnDestroyed
```

---

## 6. 事件区设计

事件区是插入战斗地图中的小玩法，提升刷图变化。

### 6.1 事件类型

| 事件 | 玩法 | 奖励 |
|---|---|---|
| 裂隙潮 | 限时杀怪，层数越高奖励越好 | 宝箱、地图材料 |
| 护送补给车 | 护送 NPC/车辆到终点 | 金币、材料 |
| 封印祭坛 | 激活祭坛后刷怪，守住一段时间 | 技能材料 |
| 精英狩猎 | 地图中随机出现强精英 | 稀有装备 |
| 诅咒宝箱 | 开箱后触发战斗，打完掉奖励 | 宝箱奖励 |
| 失控机关 | 关闭多个机关，同时躲伤害 | 打造材料 |

### 6.2 事件触发规则

触发方式：

- 玩家进入 EventVolume。
- 玩家交互事件物件。
- 玩家打开诅咒宝箱。
- 玩家击杀地图精英。
- 地图生成时自动激活。

事件状态：

```text
Inactive -> Preview -> Active -> Success / Failed -> Rewarded -> Completed
```

事件 Prefab：

```text
PF_MapEvent_Base
├── EventRoot
│   ├── EventController
│   ├── EventObjective
│   ├── EventSpawnDirector
│   ├── EventRewardController
│   └── EventUIBinder
├── TriggerVolume
├── ObjectiveObjects
├── SpawnPoints
├── RewardChestPoint
├── VFX
└── Audio
```

---

## 7. 第一批战斗地图详细原型

### 7.1 坠星海岸

用途：教学。

流程：

```text
玩家醒来 -> 移动教学 -> 普通攻击教学 -> 闪避教学 -> 拾取武器 -> 击杀小怪 -> 打开宝箱 -> 进入小 Boss -> 解锁回城传送
```

放置：

| 区域 | 内容 |
|---|---|
| 起点沙滩 | 玩家出生、移动提示 |
| 破船区 | 木箱、可破坏物、第一把武器 |
| 浅滩区 | 3 只小怪 |
| 断桥区 | 闪避教学，地面范围提示 |
| 洞口前 | 小宝箱，药剂教学 |
| 滩涂巢穴 | 小 Boss |

### 7.2 断桥荒原

用途：第一个正式野外地图。

结构：

```text
入口营地 -> 荒原小路 -> 断桥分叉 -> 石堆精英 -> 旧车队宝箱 -> 荒原大路 -> 地牢入口
```

刷怪：

- 普通小怪 8 组。
- 远程怪 2 组。
- 精英 1 只。
- 随机事件 1 个。

宝箱：

- 小宝箱 3 个。
- 精英宝箱 1 个。
- 隐藏宝箱 1 个。

### 7.3 裂石矿洞

用途：第一个地牢。

房间：

```text
入口房
普通矿道房
矿车陷阱房
分叉房
  ├── 宝箱房
  └── 精英矿工房
Boss前休息房
矿洞督工房
```

机制：

- 矿车沿轨道冲撞。
- 可破坏矿石掉落材料。
- 击杀督工后打开深井入口。

### 7.4 黑炉哨站

用途：第一个据点地图。

目标：破坏 3 个黑炉核心。

机制：

- 每破坏一个核心，刷一波守卫。
- 三个核心破坏后，中心门打开。
- 中心副官掉落 Boss 钥匙。

### 7.5 灰烬边境

用途：第一张终局地图。

结构：

```text
地图入口 -> 开放荒原刷怪 -> 灰烬裂口事件 -> 精英区 -> Boss 门 -> 地图 Boss -> 终局奖励
```

额外规则：

- 地图可带词缀。
- 怪物等级由地图 Tier 决定。
- Boss 必掉地图进度材料。

---

## 8. 战斗区小地图规则

小地图显示：

- 玩家位置。
- 主线目标方向。
- 已发现传送点。
- 出口门。
- Boss 门。
- NPC。
- 事件区域。
- 宝箱在靠近后显示。

小地图不显示：

- 未发现隐藏宝箱。
- 未触发伏击点。
- 未进入区域的怪物。

---

## 9. 战斗区验收标准

- [ ] 有完整入口和出口。
- [ ] 有至少 5 组怪物。
- [ ] 有至少 1 个宝箱。
- [ ] 有至少 5 个可破坏物。
- [ ] 有明确主路线。
- [ ] 玩家不会迷路超过 30 秒。
- [ ] 怪物能正常追击。
- [ ] 远程怪不会无脑站桩穿墙打人。
- [ ] 精英区域有足够闪避空间。
- [ ] 所有奖励能正常拾取。
- [ ] 地图完成状态能被记录。

---
