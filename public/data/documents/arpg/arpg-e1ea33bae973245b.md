# 125_敌人Prefab与AI配置：行为树、技能池、刷怪组

> 目标：定义所有可战斗敌人的 Unity Prefab 结构、AI 配置、技能池、感知、仇恨、掉落、HUD 绑定和刷怪组配置方式。

---

## 1. 敌人Prefab基础结构

```text
PF_Enemy_Base
├── ModelRoot
│   ├── Mesh
│   ├── MaterialVariants
│   └── VFX_AttachPoints
├── AnimationRoot
│   ├── Animator
│   └── RootMotionProxy
├── Collision
│   ├── CapsuleCollider
│   ├── HurtboxGroup
│   ├── HitboxSpawnPoints
│   └── NavMeshAgentObstacle
├── Combat
│   ├── AttributeComponent
│   ├── HealthComponent
│   ├── DamageReceiver
│   ├── ResistanceComponent
│   ├── BuffContainer
│   └── PoiseComponent
├── AI
│   ├── EnemyBrain
│   ├── PerceptionSensor
│   ├── ThreatTable
│   ├── SkillSelector
│   ├── MovementController
│   └── BehaviorTreeRunner
├── Skill
│   ├── SkillRuntimeHost
│   ├── SkillCooldownContainer
│   └── SkillCastPointRoot
├── Loot
│   ├── LootDropper
│   └── CorpseRewardController
├── HUD
│   ├── WorldHudAnchor
│   └── HudBindingComponent
├── Audio
├── VFX
└── Debug
```

---

## 2. AI行为状态

| 状态 | 说明 | 可打断 |
|---|---|---|
| Idle | 待机 | 是 |
| Patrol | 巡逻 | 是 |
| Alert | 警觉，转向玩家 | 是 |
| Chase | 追击 | 是 |
| Strafe | 环绕/侧移 | 是 |
| Attack | 执行技能 | 取决于技能 |
| Reposition | 重新找位置 | 是 |
| Flee | 低血逃跑 | 是 |
| Summon | 召唤 | 可打断 |
| Stunned | 硬直/眩晕 | 否 |
| Dead | 死亡 | 否 |

---

## 3. 感知规则

| 怪物类型 | 视野距离 | 听觉距离 | 脱战距离 | 追击最大距离 |
|---|---:|---:|---:|---:|
| 小怪 | 12m | 6m | 18m | 25m |
| 远程 | 16m | 8m | 22m | 28m |
| 法师 | 15m | 8m | 22m | 28m |
| 重型 | 13m | 7m | 20m | 24m |
| 精英 | 20m | 12m | 30m | 36m |
| Boss | Boss房全域 | Boss房全域 | 不脱战 | 不脱战 |

---

## 4. 技能池配置

```text
EnemySkillPool
├── BasicAttackSkillId
├── SkillEntries
│   ├── SkillId
│   ├── Weight
│   ├── MinDistance
│   ├── MaxDistance
│   ├── Cooldown
│   ├── RequireLineOfSight
│   ├── RequireTargetState
│   └── Interruptible
├── LowHpSkillEntries
├── EliteAffixSkillEntries
└── BossPhaseSkillEntries
```

### 示例：远程怪

```json
{
  "MonsterId": "MON_Dock_Ranged_001",
  "BasicAttackSkillId": "SK_Ranged_Shot",
  "SkillEntries": [
    {"SkillId":"SK_Ranged_Burst", "Weight":40, "MinDistance":7, "MaxDistance":14, "Cooldown":4},
    {"SkillId":"SK_Reposition_BackStep", "Weight":20, "MinDistance":0, "MaxDistance":5, "Cooldown":6},
    {"SkillId":"SK_Grenade_Area", "Weight":15, "MinDistance":5, "MaxDistance":12, "Cooldown":8}
  ]
}
```

---

## 5. 仇恨规则

| 行为 | 仇恨值 |
|---|---:|
| 对怪物造成 1 点伤害 | +1 |
| 治疗敌对目标 | +治疗量 x0.6 |
| 控制怪物 | +伤害等价 30 |
| 进入近距离 3m | +20 |
| 玩家使用嘲讽技能 | +固定 500 |
| 召唤物攻击 | 仇恨归属召唤物，部分传给主人 |

---

## 6. 刷怪组Prefab结构

```text
PF_SpawnGroup_Base
├── SpawnGroupController
├── TriggerVolume
├── SpawnPoints
│   ├── SP_01
│   ├── SP_02
│   └── SP_03
├── EncounterBounds
├── LinkedDoors
├── RewardOnClear
└── DebugGizmos
```

---

## 7. 怪物HUD绑定

| 怪物类型 | 名称 | 血条 | 词缀 | Buff | 小地图 |
|---|---|---|---|---|---|
| 普通怪 | 近距离显示 | 受伤显示 | 无 | 不显示 | 不显示 |
| 魔法怪 | 常显 | 常显 | 1条 | 状态图标 | 可选 |
| 稀有怪 | 常显 | 常显 | 2-3条 | 状态图标 | 显示 |
| 小头目 | 常显 | 大号局部血条 | 固定机制 | 显示 | 显示 |
| Boss | 顶部Boss血条 | 顶部大血条 | 阶段机制 | 显示 | Boss标记 |

---

## 8. 性能规则

1. 普通怪死亡后 3 秒隐藏 HUD，10 秒回收尸体。
2. 同屏普通怪最多显示 12 条血条。
3. 远处怪物 AI 降频，超过 35m 只保留巡逻。
4. Boss 不降频。
5. 技能投射物和伤害跳字必须对象池化。

---

## 9. 当前 Unity 实现映射

### 9.1 配置表落地

| 内容 | Unity 数据表 | 已落地 |
|---|---|---|
| 怪物技能池 | `Assets/_Game/Resources/GameData/monster_skill_sets.json` | 已加入腐化兽、尸兵、火山恶魔、墓穴虫群、风暴构装、虚空畸变、星核机械、赤炉军团、裂隙教徒 9 套技能池 |
| 精英词缀 | `Assets/_Game/Resources/GameData/elite_affixes.json` | 已加入狂怒、护盾光环、裂隙闪现、火径、指挥官词缀，包含属性修正、额外技能、光效和掉落倍率 |
| Boss阶段技能 | `Assets/_Game/Resources/GameData/boss_skill_sets.json` | 已加入终局灰烬巨兽和终末守门人阶段技能、召唤规则、狂暴规则 |
| 怪物实例补全 | `Assets/_Game/Resources/GameData/monsters.json` | 已按怪物家族补齐 `skill_set_id`、模型地址、Animator地址、VFX/SFX配置和精英词缀池 |
| 刷怪组 | `Assets/_Game/Resources/GameData/spawn_groups.json` | 已加入事件刷怪组、精英刷怪组、防守分路刷怪组、终局裂隙刷怪组 |
| 技能自动验收 | `Assets/_Game/Resources/GameData/skill_auto_tests.json` | 已加入近战怪物技能池和远程怪物技能池的基础自动验收样例 |

### 9.2 运行时落地

- `MonsterAIController` 会优先读取怪物自身 `skill_set_id`，再按 `monster.id + "_skill_set"` 和 `family + "_skill_set"` 回退查找技能池。
- `MonsterSkillController` 使用技能池中的权重、距离、冷却、条件和禁止条件选择技能，支持低血量技能、精英额外技能和失败回退。
- `EliteAffixController` 读取 `elite_affix_pool`，把精英词缀的属性、额外技能、光效和掉落倍率挂到怪物实例。
- `BossControllers` 读取 `boss_skill_sets.json`，按阶段切换技能池、召唤规则、狂暴规则和镜头/音乐状态。
- `MapSpawnDirector` 读取 `spawn_groups.json`，按地图、遭遇区、触发类型、数量范围、精英概率生成怪物。

### 9.3 Prefab脚手架落地

| Prefab | 路径 | 内容 |
|---|---|---|
| 敌人基础Prefab | `Assets/_Game/Prefabs/Monsters/PF_Enemy_Base.prefab` | 包含 `ModelRoot`、`AnimationRoot`、`Collision`、`Combat`、`AI`、`Skill`、`Loot`、`HUD`、`Audio`、`VFX`、`Debug` 节点，并挂基础战斗、AI、掉落、HUD目标和表现组件 |
| 刷怪组基础Prefab | `Assets/_Game/Prefabs/SpawnGroups/PF_SpawnGroup_Base.prefab` | 包含 `SpawnGroupController`、`TriggerVolume`、`SpawnPoints`、`EncounterBounds`、`LinkedDoors`、`RewardOnClear`、`DebugGizmos` 节点 |
| 编辑器入口 | `Assets/_Game/Scripts/Editor/ArpgPrefabScaffolder.cs` | 菜单 `游戏/ARPG/创建敌人与刷怪组标准Prefab` 可单独重建敌人与刷怪组标准 Prefab |

### 9.4 验收口径

1. 每个 `monster_skill_sets.json` 技能槽的 `skill_id` 必须能在 `skills.json` 找到。
2. 精英词缀的额外技能、死亡技能和怪物 `elite_affix_pool` 不能出现空引用。
3. Boss技能池的 `boss_id`、阶段技能、召唤怪物必须能解析。
4. 刷怪组必须能解析地图、遭遇区、怪物池或直指怪物。
5. 工程需通过 JSON 引用校验和 `dotnet build "G:\TestProject\RPG\RPG.sln" --no-restore`。
