# 67. 技能数据模型：字段字典、主动/辅助/保留/触发


> 项目：Unity 3D ACT 刷宝 ARPG  
> 批次：第五批 —— 技能编辑器 / 怪物技能编辑器 / 策划配置工具  
> 目标：让策划不改代码，也能配置玩家技能、怪物技能、Boss 阶段技能、辅助模块、Buff、VFX/SFX、数值成长、AI 使用条件与测试验收。


---

## 1. 数据模型总览

技能数据必须拆成多个块，避免一个巨大的类难以维护。

```text
SkillDefinition
├── SkillBasicInfo
├── SkillAvailability
├── SkillCostData
├── SkillCooldownData
├── SkillInputData
├── SkillExecutionData
├── SkillDamageData
├── SkillHitboxData
├── SkillProjectileData
├── SkillBuffData
├── SkillSummonData
├── SkillPresentationData
├── SkillAIData
├── SkillScalingData
├── SkillSupportData
└── SkillPublishData
```

---

## 2. SkillDefinition 主表

| 字段 | 类型 | 必填 | 说明 | 示例 |
|---|---|---:|---|---|
| skillId | string | 是 | 稳定 ID，不随显示名变化 | SKL_Player_Warrior_IronCleave_001 |
| displayName | LocalizedString | 是 | 显示名称 | 铁裂斩 |
| description | LocalizedString | 是 | 技能描述 | 向前挥出重斩 |
| ownerType | enum | 是 | Player / Monster / Boss / Support / Buff | Player |
| category | enum | 是 | Melee / Projectile / Spell 等 | Melee |
| icon | SpriteRef | 是 | 技能图标 | Icon_IronCleave |
| tags | string[] | 是 | 标签集合 | Attack, Melee, Physical |
| isDeprecated | bool | 否 | 是否废弃 | false |
| version | int | 是 | 配置版本 | 1 |
| designerNote | string | 否 | 策划备注 | 新手战士核心技能 |

---

## 3. OwnerType

```text
Player：玩家技能
Monster：普通怪/精英怪技能
Boss：Boss 专属机制技能
Support：辅助模块，不单独释放
Buff：Buff/异常定义，不单独释放
PassiveTrigger：被动触发技能
```

---

## 4. SkillCategory

```text
MeleeStrike      近战打击
MeleeSlam        近战重击
MeleeCombo       近战连段
Projectile       投射物
Bow              弓箭
Crossbow         弩炮/枪械
Spell            法术
AreaSpell        区域法术
Summon           召唤
Totem            图腾/炮塔
Buff             强化
Debuff           弱化
Curse            诅咒
Movement         位移
Guard            防御
Aura             保留光环
Trigger          触发技能
BossMechanic     Boss 机制
Environment      场景机关技能
```

---

## 5. SkillTag 标签字典

标签是辅助模块、天赋、装备词条、怪物抗性、AI 使用规则的连接点。标签必须统一，不允许随便写字符串。

### 5.1 行为标签

```text
Attack
Spell
Melee
Ranged
Projectile
Area
Duration
Channel
Instant
Triggered
Totem
Trap
Mine
Summon
Aura
Movement
Guard
Warcry
Curse
```

### 5.2 伤害标签

```text
Physical
Fire
Cold
Lightning
Poison
Bleed
Chaos
Holy
Shadow
Arcane
```

### 5.3 武器标签

```text
Sword
Axe
Mace
Spear
Bow
Crossbow
Staff
Wand
Claw
Shield
Unarmed
```

### 5.4 表现标签

```text
HeavyImpact
FastHit
MultiHit
Explosion
GroundEffect
ChainLightning
PiercingShot
Homing
Transform
MinionCommand
```

---

## 6. SkillAvailability 可用条件

| 字段 | 类型 | 说明 |
|---|---|---|
| allowedClasses | string[] | 可使用职业 |
| forbiddenClasses | string[] | 禁止职业 |
| requiredLevel | int | 需求角色等级 |
| requiredWeaponTags | string[] | 需求武器类型 |
| forbiddenWeaponTags | string[] | 禁止武器类型 |
| requiredForm | enum | 需求形态，如人形/熊形/狼形 |
| requiredState | string[] | 需求状态，如站立/在地面 |
| forbiddenState | string[] | 禁止状态，如眩晕/沉默 |
| unlockSource | enum | 默认解锁/任务/商店/掉落/天赋 |

示例：

```json
{
  "allowedClasses": ["HeavyWarrior", "FuryKing"],
  "requiredLevel": 4,
  "requiredWeaponTags": ["Axe", "Mace"],
  "requiredState": ["Grounded"],
  "forbiddenState": ["Silenced", "Stunned"]
}
```

---

## 7. SkillInputData 输入模型

| 字段 | 类型 | 说明 |
|---|---|---|
| inputMode | enum | 技能如何选择目标 |
| aimMode | enum | 朝向方式 |
| canUseWhileMoving | bool | 是否移动中释放 |
| lockMovementDuringCast | bool | 释放时是否锁移动 |
| rotateToAim | bool | 是否转向目标 |
| maxAimAngle | float | 最大允许瞄准角 |
| requireTarget | bool | 是否必须有目标 |
| targetFilter | enum | 敌人/友军/自身/地面 |
| inputBufferTime | float | 输入缓存时间 |
| queuePriority | int | 技能队列优先级 |

InputMode：

```text
SelfCast：自身释放
TargetUnit：选择单位
TargetPoint：选择地面点
ForwardDirection：朝当前前方释放
AimDirection：朝摇杆/鼠标方向释放
Toggle：开关型保留技能
Passive：被动触发，不由玩家输入
AIControlled：由 AI 决定释放
```

---

## 8. SkillCostData 消耗模型

| 字段 | 类型 | 说明 |
|---|---|---|
| manaCost | int | 魔力消耗 |
| healthCost | int | 生命消耗 |
| rageCost | int | 怒气消耗 |
| energyCost | int | 能量消耗 |
| ammoCost | int | 弹药消耗 |
| reservedMana | int/percent | 保留魔力 |
| costScaleByLevel | Curve | 等级消耗成长 |
| costScaleBySupport | bool | 是否受辅助模块影响 |
| canCastWhenInsufficient | bool | 资源不足是否可释放 |

资源不足规则：

```text
默认：不可释放
血量消耗：不能把自己扣到 0，最低保留 1 点
保留技能：开启时保留资源，关闭时归还
怪物技能：可选择 IgnoreCost
```

---

## 9. SkillCooldownData 冷却模型

| 字段 | 类型 | 说明 |
|---|---|---|
| baseCooldown | float | 基础冷却 |
| cooldownGroup | string | 公共冷却组 |
| chargeCount | int | 充能次数 |
| chargeRecoverTime | float | 充能恢复时间 |
| startWithFullCharge | bool | 入场时是否满充能 |
| affectedByCooldownRecovery | bool | 是否受冷却恢复影响 |
| monsterAIRandomOffset | float | 怪物冷却随机浮动 |

---

## 10. SkillExecutionData 执行模型

技能由多个阶段组成。

```text
SkillExecutionData
├── phases[]
└── eventTracks[]
```

Phase 字段：

| 字段 | 类型 | 说明 |
|---|---|---|
| phaseId | string | 阶段 ID |
| phaseType | enum | CastStart / Active / Recovery / CancelWindow |
| startTime | float | 起始时间 |
| duration | float | 持续时间 |
| movementLock | enum | None / Slow / FullLock / RootMotion |
| rotationLock | enum | None / FaceAim / LockStartDirection |
| canBeInterrupted | bool | 是否可被打断 |
| interruptPriority | int | 打断优先级 |

Event 字段：

| 字段 | 类型 | 说明 |
|---|---|---|
| eventId | string | 事件 ID |
| eventType | enum | SpawnHitbox / SpawnProjectile / ApplyBuff / PlayVFX 等 |
| triggerTime | float | 触发时间 |
| repeatCount | int | 重复次数 |
| repeatInterval | float | 重复间隔 |
| targetBlockId | string | 关联配置块 |

---

## 11. SkillDamageBlock 伤害块

一个技能可以有多个伤害块，例如：先小伤害拉怪，后爆炸大伤害。

| 字段 | 类型 | 说明 |
|---|---|---|
| damageBlockId | string | 伤害块 ID |
| damageKind | enum | Hit / Dot / Reflect / Execute |
| damageType | enum | Physical / Fire / Cold 等 |
| baseDamage | float | 固定基础伤害 |
| weaponDamagePercent | float | 武器伤害百分比 |
| attackPowerScale | float | 攻击强度加成 |
| spellPowerScale | float | 法术强度加成 |
| minDamageVariance | float | 最小浮动 |
| maxDamageVariance | float | 最大浮动 |
| critAllowed | bool | 可暴击 |
| ailmentAllowed | bool | 可造成异常 |
| armorPenetration | float | 护甲穿透 |
| resistancePenetration | float | 抗性穿透 |
| levelScaleCurve | Curve | 等级成长 |

---

## 12. SkillHitboxBlock 判定块

| 字段 | 类型 | 说明 |
|---|---|---|
| hitboxId | string | 判定 ID |
| shape | enum | Sphere / Box / Cone 等 |
| attachMode | enum | Caster / Weapon / World / Projectile |
| attachSocket | string | 挂点名 |
| localOffset | Vector3 | 局部偏移 |
| localRotation | Vector3 | 局部旋转 |
| size | Vector3 | 尺寸 |
| radius | float | 半径 |
| angle | float | 扇形角度 |
| duration | float | 持续时间 |
| damageBlockId | string | 绑定伤害块 |
| hitOncePerTarget | bool | 每目标只命中一次 |
| maxHitCount | int | 最大命中数 |
| targetFilter | enum | 目标过滤 |

---

## 13. SkillProjectileBlock 投射物块

| 字段 | 类型 | 说明 |
|---|---|---|
| projectileId | string | 投射物 ID |
| projectilePrefab | PrefabRef | 投射物预制体 |
| spawnSocket | string | 发射挂点 |
| spawnCount | int | 发射数量 |
| spreadAngle | float | 扩散角度 |
| speed | float | 初速度 |
| acceleration | float | 加速度 |
| gravityScale | float | 重力倍率 |
| maxDistance | float | 最大距离 |
| maxLifetime | float | 最大存活时间 |
| collisionRadius | float | 碰撞半径 |
| pierceCount | int | 穿透次数 |
| chainCount | int | 连锁次数 |
| bounceCount | int | 弹跳次数 |
| homing | bool | 是否追踪 |
| homingStrength | float | 追踪强度 |
| onHitActions | Action[] | 命中行为 |
| onExpireActions | Action[] | 消失行为 |

---

## 14. SkillBuffBlock Buff/异常块

| 字段 | 类型 | 说明 |
|---|---|---|
| buffBlockId | string | Buff 块 ID |
| buffId | string | Buff 定义 ID |
| applyTarget | enum | Self / HitTarget / AreaTargets / Summon |
| applyChance | float | 施加概率 |
| durationOverride | float | 覆盖持续时间 |
| stackOverride | int | 覆盖叠层 |
| applyEventId | string | 在哪个事件触发 |
| removeOnSkillEnd | bool | 技能结束时移除 |

---

## 15. SkillSummonBlock 召唤块

| 字段 | 类型 | 说明 |
|---|---|---|
| summonBlockId | string | 召唤块 ID |
| summonEntityId | string | 召唤单位 ID |
| summonPrefab | PrefabRef | 召唤预制体 |
| spawnMode | enum | AroundCaster / TargetPoint / RandomInArea |
| spawnCount | int | 召唤数量 |
| maxAlive | int | 最大同时存在 |
| duration | float | 存活时间，-1 为永久 |
| inheritOwnerStats | bool | 是否继承主人属性 |
| inheritPercent | float | 继承比例 |
| aiProfileId | string | AI 配置 |
| commandGroup | string | 指令分组 |

---

## 16. SupportModuleDefinition 辅助模块

辅助模块不直接释放，而是修改主动技能。

```text
SupportModuleDefinition
├── supportId
├── displayName
├── requiredSkillTags
├── forbiddenSkillTags
├── conflictGroup
├── modifierBlocks[]
├── extraCostScale
├── extraCooldownScale
├── descriptionTemplate
└── validationRules
```

Modifier 类型：

```text
ModifyDamage
ModifyCost
ModifyCooldown
ModifyProjectileCount
ModifyProjectileBehavior
ModifyAreaRadius
ModifyDuration
AddBuffApply
AddTriggerEvent
ChangeDamageType
AddVFXOverride
```

---

## 17. ReserveSkillDefinition 保留技能

保留技能本质是 Toggle + Buff。

| 字段 | 类型 | 说明 |
|---|---|---|
| reserveType | enum | Mana / Health / Energy |
| reserveValue | int/percent | 保留值 |
| auraRadius | float | 光环半径 |
| affectsSelf | bool | 影响自身 |
| affectsAllies | bool | 影响友方 |
| affectsMinions | bool | 影响召唤物 |
| buffId | string | 给予的 Buff |
| drainPerSecond | float | 每秒额外消耗 |

---

## 18. TriggerSkillDefinition 触发技能

触发技能由条件触发，不直接绑定输入键。

触发条件：

```text
OnHit
OnCrit
OnKill
OnBlock
OnDodge
OnTakeDamage
OnLowHealth
OnSkillUse
OnSummonDeath
OnBuffStackReached
OnEnemyEnterArea
```

字段：

| 字段 | 类型 | 说明 |
|---|---|---|
| triggerCondition | enum | 触发条件 |
| triggerChance | float | 触发概率 |
| internalCooldown | float | 内置冷却 |
| maxTriggerPerSecond | int | 每秒最多触发 |
| triggeredSkillId | string | 触发技能 |
| inheritSourceDamage | bool | 是否继承来源伤害 |
| targetMode | enum | 使用原目标/自身/随机敌人 |

---

## 19. MonsterSkillExtraData 怪物技能扩展

怪物技能比玩家技能多 AI 字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| monsterFamily | string[] | 可用怪物族群 |
| minAreaLevel | int | 最小区域等级 |
| eliteOnly | bool | 是否精英限定 |
| bossOnly | bool | 是否 Boss 限定 |
| aiUseRangeMin | float | AI 使用最小距离 |
| aiUseRangeMax | float | AI 使用最大距离 |
| aiWeight | int | 使用权重 |
| aiCooldownRandom | float | 冷却随机值 |
| aiRequiresLineOfSight | bool | 需要视线 |
| aiCanUseWhileMoving | bool | AI 是否移动中释放 |

---

## 20. BossSkillExtraData Boss 技能扩展

| 字段 | 类型 | 说明 |
|---|---|---|
| phaseMask | int[] | 可用阶段 |
| mechanicType | enum | 普通攻击/机制/转阶段/狂暴 |
| arenaLock | bool | 是否锁场 |
| invulnerableDuringCast | bool | 释放期间无敌 |
| warningTime | float | 预警时间 |
| safeZoneRule | string | 安全区规则 |
| spawnArenaObject | string[] | 生成场地物 |
| cameraFocus | bool | 是否镜头聚焦 |
| rewardGateUnlock | bool | 是否解锁奖励门 |

---

## 21. 示例：玩家近战技能 JSON

```json
{
  "skillId": "SKL_Player_Warrior_IronCleave_001",
  "displayName": "铁裂斩",
  "ownerType": "Player",
  "category": "MeleeStrike",
  "tags": ["Attack", "Melee", "Physical", "HeavyImpact"],
  "input": {
    "inputMode": "ForwardDirection",
    "rotateToAim": true,
    "lockMovementDuringCast": true,
    "inputBufferTime": 0.15
  },
  "cost": {
    "manaCost": 8
  },
  "cooldown": {
    "baseCooldown": 0.0
  },
  "execution": {
    "phases": [
      {"phaseId": "start", "phaseType": "CastStart", "startTime": 0.0, "duration": 0.18},
      {"phaseId": "active", "phaseType": "Active", "startTime": 0.18, "duration": 0.12},
      {"phaseId": "recover", "phaseType": "Recovery", "startTime": 0.30, "duration": 0.25}
    ],
    "events": [
      {"eventId": "hit_01", "eventType": "SpawnHitbox", "triggerTime": 0.18, "targetBlockId": "hitbox_01"},
      {"eventId": "vfx_01", "eventType": "PlayVFX", "triggerTime": 0.16, "targetBlockId": "vfx_slash"}
    ]
  },
  "damageBlocks": [
    {"damageBlockId": "dmg_01", "damageType": "Physical", "weaponDamagePercent": 1.25, "critAllowed": true}
  ],
  "hitboxes": [
    {"hitboxId": "hitbox_01", "shape": "Box", "size": [2.2, 1.2, 1.8], "damageBlockId": "dmg_01"}
  ]
}
```

---

## 22. 示例：Boss 技能 JSON

```json
{
  "skillId": "SKL_Boss_BlackForge_LavaRing_001",
  "displayName": "熔火环爆",
  "ownerType": "Boss",
  "category": "BossMechanic",
  "tags": ["Spell", "Area", "Fire", "BossOnly"],
  "bossExtra": {
    "phaseMask": [2, 3],
    "mechanicType": "ArenaMechanic",
    "warningTime": 1.2,
    "arenaLock": true,
    "safeZoneRule": "InsideInnerCircle"
  },
  "ai": {
    "aiUseRangeMin": 0,
    "aiUseRangeMax": 20,
    "aiWeight": 35,
    "aiRequiresLineOfSight": false
  }
}
```
