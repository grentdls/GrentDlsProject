# 20_场景放置物系统：宝箱、可破坏物、机关、奖励

> 目标：定义所有地图内放置物，包括宝箱、桶、箱子、矿石、祭坛、机关、陷阱、任务物件、奖励箱和环境破坏对象。

---

## 1. 放置物分类

| 类型 | 是否交互 | 是否可攻击 | 是否掉落 | 是否保存状态 | 用途 |
|---|---:|---:|---:|---:|---|
| 宝箱 | 是 | 否 | 是 | 是 | 奖励 |
| 诅咒宝箱 | 是 | 否 | 是 | 是 | 事件战斗 |
| 木桶/箱子 | 否 | 是 | 少量 | 可选 | 场景破坏 |
| 矿石/采集物 | 是/攻击 | 可选 | 是 | 是 | 材料来源 |
| 机关 | 是 | 可选 | 否 | 是 | 开门/触发事件 |
| 陷阱 | 否 | 可选 | 否 | 动态 | 战斗压力 |
| 祭坛 | 是 | 否 | Buff/事件 | 是 | 临时增益/刷怪 |
| 任务物件 | 是 | 可选 | 任务道具 | 是 | 主线/支线 |
| 奖励箱 | 是 | 否 | 是 | 是 | Boss/事件奖励 |
| 地图装置 | 是 | 否 | 否 | 是 | 终局入口 |

---

## 2. 通用放置物 Prefab 结构

```text
PF_PlacedObject_Base
├── Model
├── Collider_Physical
├── Collider_InteractTrigger
├── UIAnchor
├── VFX_Idle
├── VFX_Activated
├── VFX_Destroyed
├── Audio
└── Components
    ├── PlacedObjectIdentity
    ├── PlacedObjectState
    ├── InteractionComponent optional
    ├── DamageReceiver optional
    ├── LootDropComponent optional
    ├── ObjectiveComponent optional
    └── SaveStateComponent optional
```

---

## 3. 宝箱系统

### 3.1 宝箱类型

| 宝箱类型 | 触发方式 | 奖励质量 | 出现场景 |
|---|---|---:|---|
| SmallChest | 直接打开 | 低 | 野外、地牢 |
| NormalChest | 直接打开 | 中 | 全地图 |
| LargeChest | 直接打开 | 中高 | 支线尽头、精英区 |
| LockedChest | 需要钥匙 | 高 | 地牢、据点 |
| CursedChest | 打开后刷怪 | 高 | 事件区 |
| BossChest | Boss 死亡后出现 | 很高 | Boss 房 |
| EventRewardChest | 事件完成后出现 | 中高 | 事件区 |
| SecretChest | 隐藏/破墙后出现 | 高 | 地牢隐藏区 |
| MapRewardChest | 终局地图奖励 | 高 | 终局地图 |

### 3.2 宝箱 Prefab

```text
PF_Chest_Base
├── Model_Closed
├── Model_Opened
├── Animator
├── Collider_InteractTrigger
├── UIAnchor
├── VFX_RarityGlow
├── VFX_OpenBurst
├── Audio_Open
├── Audio_Locked
└── Components
    ├── Interactable_Chest
    ├── ChestStateController
    ├── ChestLootProvider
    ├── ChestRequirementChecker
    ├── ChestEventTrigger optional
    └── SaveStateComponent
```

### 3.3 宝箱状态机

```text
Locked
  ↓ 条件满足
Closed
  ↓ 玩家交互
Opening
  ↓ 动画完成
Opened
  ↓ 掉落完成
Looted
```

诅咒宝箱：

```text
Closed
  ↓ 玩家交互
CursedEventActive
  ↓ 清怪成功
RewardReady
  ↓ 玩家打开
Looted
```

### 3.4 宝箱掉落规则

宝箱掉落由 `LootTableId` 控制。

```text
ChestData
├── ChestId
├── ChestType
├── DisplayName
├── LootTableId
├── RequiredKeyId
├── RequiredQuestState
├── OpenAnimationId
├── VFXRarity
├── CanRespawn
└── SaveState
```

---

## 4. 可破坏物系统

### 4.1 可破坏物用途

可破坏物不是纯装饰，它们承担：

- 提供打击反馈。
- 让场景更有破坏感。
- 少量掉金币和材料。
- 隐藏宝箱或机关。
- 阻挡路径，破坏后开路。
- 作为爆炸桶参与战斗。

### 4.2 可破坏物类型

| 类型 | 生命 | 掉落 | 特殊效果 |
|---|---:|---|---|
| WoodenBarrel | 低 | 少量金币 | 无 |
| WoodenCrate | 低 | 少量金币/药剂 | 无 |
| StonePile | 中 | 石材/材料 | 可挡路 |
| BonePile | 低 | 少量材料 | 可能刷小怪 |
| ExplosiveBarrel | 低 | 无 | 爆炸伤害 |
| PoisonPod | 低 | 毒材料 | 破坏后毒雾 |
| OreVein | 中 | 矿石材料 | 可采集 |
| CorruptionNode | 中 | 赛季材料 | 破坏后刷怪 |
| Barricade | 高 | 无 | 阻挡路径 |

### 4.3 可破坏物 Prefab

```text
PF_Breakable_Base
├── Model_Intact
├── Model_Broken
├── Collider_Blocker
├── Collider_HitBox
├── FracturePieces optional
├── VFX_Hit
├── VFX_Destroy
├── Audio_Hit
├── Audio_Destroy
└── Components
    ├── DamageReceiver
    ├── BreakableObject
    ├── BreakableDropProvider
    ├── BreakableStateSaver optional
    └── NavObstacleController optional
```

### 4.4 破坏流程

```text
受到伤害
  ↓
播放命中特效
  ↓
扣生命
  ↓ 生命 <= 0
隐藏完整模型
  ↓
显示破碎模型/碎片
  ↓
关闭或调整碰撞
  ↓
生成掉落
  ↓
触发事件 optional
```

---

## 5. 陷阱系统

### 5.1 陷阱类型

| 陷阱 | 玩法 | 场景 |
|---|---|---|
| SpikeTrap | 地刺周期弹出 | 地牢 |
| FireJet | 火焰喷射 | 工坊 |
| PoisonCloud | 毒雾区域 | 森林/沼泽 |
| FallingRock | 落石提示后砸下 | 山地 |
| RotatingBlade | 旋转刀片 | 遗迹 |
| LightningTotem | 周期电击 | 终局 |
| ArrowWall | 墙体箭矢 | 神庙 |
| MineTrap | 玩家靠近爆炸 | 战场 |

### 5.2 陷阱 Prefab

```text
PF_Trap_Base
├── Model
├── TriggerVolume
├── DamageVolume
├── WarningVFX
├── ActiveVFX
├── Audio_Warning
├── Audio_Active
└── Components
    ├── TrapController
    ├── TrapTimingPattern
    ├── DamageDealer
    └── TrapStateController
```

### 5.3 陷阱时间轴

```text
Idle
  ↓
Warning 0.8s
  ↓
Active 1.2s
  ↓
Cooldown 2.0s
  ↓
Idle
```

### 5.4 陷阱设计规则

- 所有陷阱必须有提前预警。
- 新手地图不放高伤害陷阱。
- 陷阱不应和怪物控制技能无限连死玩家。
- Boss 房陷阱必须和 Boss 技能节奏错开。
- 陷阱伤害可以高，但不能无提示。

---

## 6. 祭坛系统

祭坛是战斗区中的临时强化或事件触发器。

### 6.1 祭坛类型

| 祭坛 | 效果 | 风险 |
|---|---|---|
| 生命祭坛 | 回复生命并获得生命回复 Buff | 刷一波怪 |
| 战意祭坛 | 增加攻击速度和伤害 | 受到伤害提高 |
| 守护祭坛 | 获得护盾 | 持续时间短 |
| 财富祭坛 | 提高掉落 | 刷精英 |
| 诅咒祭坛 | 高奖励事件 | 给玩家负面效果 |
| 裂隙祭坛 | 打开限时裂隙 | 高密度刷怪 |

### 6.2 祭坛 Prefab

```text
PF_Shrine_Base
├── Model
├── Collider_InteractTrigger
├── UIAnchor
├── VFX_Idle
├── VFX_Activated
├── Audio
└── Components
    ├── Interactable_Shrine
    ├── ShrineEffectProvider
    ├── ShrineEventTrigger
    └── SaveStateComponent
```

---

## 7. 任务物件系统

任务物件用于推进主线或支线。

### 7.1 任务物件类型

| 类型 | 示例 | 交互结果 |
|---|---|---|
| PickupQuestItem | 遗失信物 | 加入任务背包 |
| ActivateObject | 点燃信标 | 设置任务状态 |
| DestroyObject | 摧毁核心 | 推进目标计数 |
| EscortTarget | 护送 NPC | 开始护送 AI |
| RescueObject | 打开牢笼 | 释放 NPC |
| InvestigateObject | 检查尸体 | 播放对话/线索 |

### 7.2 任务物件 Prefab

```text
PF_QuestObject_Base
├── Model
├── Collider_InteractTrigger
├── UIAnchor_QuestIcon
├── VFX_Highlight
├── Audio
└── Components
    ├── Interactable_QuestObject
    ├── QuestRequirementChecker
    ├── QuestProgressUpdater
    └── SaveStateComponent
```

---

## 8. 放置物生成系统

### 8.1 手动放置

主线地图和 Boss 房建议手动放置关键物件。

适合：

- 任务物件。
- Boss 奖励箱。
- 固定传送点。
- 固定机关。

### 8.2 点位随机

战斗地图和终局地图适合点位随机。

```text
LootPointGroup_Field_01
├── ChestPoint_A weight 30
├── ChestPoint_B weight 20
├── ShrinePoint_C weight 10
├── BreakableCluster_D weight 40
└── Empty weight 50
```

### 8.3 放置权重

```text
PlacedObjectSpawnRule
├── RuleId
├── MapType
├── ObjectType
├── PrefabPool
├── MinCount
├── MaxCount
├── Weight
├── RequiredMapTier
├── RequiredBiome
└── ExclusionRadius
```

---

## 9. 放置物保存规则

| 对象 | 是否保存 | 保存内容 |
|---|---:|---|
| 主线宝箱 | 是 | 是否已打开 |
| 普通随机宝箱 | 地图生命周期内 | 是否已打开 |
| 可破坏桶箱 | 地图生命周期内 | 是否已破坏 |
| 任务物件 | 是 | 任务状态 |
| 祭坛 | 地图生命周期内 | 是否已激活 |
| 陷阱 | 否 | 动态状态不保存 |
| 终局奖励箱 | 地图生命周期内 | 是否已领取 |

---

## 10. 放置物验收标准

- [ ] 宝箱可打开并掉落。
- [ ] 宝箱打开后不能重复刷奖励。
- [ ] 锁宝箱会显示需求。
- [ ] 可破坏物受击有反馈。
- [ ] 可破坏物破坏后碰撞正确。
- [ ] 爆炸桶能伤害敌人和玩家，按设计阵营过滤。
- [ ] 陷阱有提前预警。
- [ ] 祭坛激活后给 Buff 或触发事件。
- [ ] 任务物件能正确推进任务。
- [ ] 放置物状态切场景后符合设计。

---
