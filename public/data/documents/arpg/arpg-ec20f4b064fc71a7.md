# 71. Buff、异常状态、召唤物、持续区域可配置系统


> 项目：Unity 3D ACT 刷宝 ARPG  
> 批次：第五批 —— 技能编辑器 / 怪物技能编辑器 / 策划配置工具  
> 目标：让策划不改代码，也能配置玩家技能、怪物技能、Boss 阶段技能、辅助模块、Buff、VFX/SFX、数值成长、AI 使用条件与测试验收。


---

## 1. 设计目标

很多技能不是简单造成一次伤害，而是会生成持续效果：

- 给自己加 Buff。
- 给敌人加 Debuff。
- 造成点燃、冰缓、感电、中毒、流血等异常。
- 召唤仆从、炮塔、图腾。
- 生成持续地面区域。
- 生成延迟爆炸和陷阱。

这些都必须在技能编辑器里配置，不允许散落在代码里。

---

## 2. BuffDefinition 总结构

```text
BuffDefinition
├── BuffBasicInfo
├── BuffStackRule
├── BuffDurationRule
├── BuffModifierBlocks[]
├── BuffTickRule
├── BuffTriggerEvents[]
├── BuffPresentation
├── BuffDispelRule
└── BuffValidation
```

---

## 3. Buff 基础字段

| 字段 | 类型 | 说明 |
|---|---|---|
| buffId | string | 稳定 ID |
| displayName | LocalizedString | 显示名 |
| buffType | enum | Buff / Debuff / Ailment / Aura / Hidden |
| icon | SpriteRef | 图标 |
| tags | string[] | 标签 |
| isPositive | bool | 是否正面效果 |
| visibleOnUI | bool | 是否显示在 UI |
| canBeDispelled | bool | 是否可驱散 |
| canAffectBoss | bool | 是否影响 Boss |
| bossEffectiveness | float | 对 Boss 效果倍率 |

---

## 4. BuffType

```text
Buff：正面强化
Debuff：负面弱化
Ailment：异常状态
Aura：光环持续效果
Hidden：隐藏内部效果
StackMarker：叠层标记
CooldownMarker：内部冷却标记
```

---

## 5. 叠层规则

```text
BuffStackRule
├── maxStack
├── stackMode
├── refreshMode
├── independentDuration
├── removeOneStackOnExpire
├── stackDecayInterval
└── stackDisplayMode
```

StackMode：

```text
None：不可叠加
AddStack：叠层
RefreshOnly：只刷新时间
ReplaceStronger：强者覆盖弱者
Independent：每层独立计时
MergePower：合并强度
```

RefreshMode：

```text
RefreshDuration：刷新持续时间
KeepOldDuration：保留旧时间
ExtendDuration：延长时间
ResetAndAddStack：重置并加层
```

---

## 6. 持续时间规则

```text
BuffDurationRule
├── duration
├── affectedBySkillDuration
├── affectedByBuffDuration
├── infiniteUntilRemoved
├── removeOnDeath
├── removeOnSceneChange
├── removeOnSkillEnd
├── removeOnWeaponSwap
└── tickInterval
```

---

## 7. BuffModifierBlock 属性修改

```text
BuffModifierBlock
├── modifierId
├── targetStat
├── operation
├── value
├── valuePerStack
├── conditionTags
├── applyToOwner
├── applyToMinions
└── applyToAllies
```

Operation：

```text
AddFlat：固定增加
AddPercent：百分比增加
MoreMultiplier：独立更多倍率
LessMultiplier：独立更少倍率
Override：覆盖
ClampMin：最小限制
ClampMax：最大限制
```

示例：狂怒 Buff

```text
攻击速度 +5% 每层
移动速度 +2% 每层
最大 5 层
持续 4 秒
击杀刷新
```

---

## 8. Tick 效果

持续伤害或持续治疗用 TickRule。

```text
BuffTickRule
├── enableTick
├── tickInterval
├── tickImmediatelyOnApply
├── tickDamageBlock
├── tickHealBlock
├── tickApplyBuffBlock
├── tickVFX
└── tickSFX
```

示例：中毒

```text
每 0.5 秒造成毒素伤害
持续 4 秒
最多 8 层
每层独立计时
```

---

## 9. 异常状态系统

异常状态是 Buff 的特殊分类。

第一版异常：

```text
Ignite：点燃，火焰 DOT
Chill：冰缓，降低移动/攻击速度
Freeze：冻结，硬控，Boss 转为冻结累积
Shock：感电，提高受到伤害
Poison：中毒，毒素 DOT，可叠层
Bleed：流血，物理 DOT，移动时加重
Stagger：削韧，满后短硬直
Vulnerable：易伤，提高受到指定伤害
Weaken：虚弱，降低造成伤害
Slow：减速
Silence：沉默，禁止施法类技能
```

---

## 10. Boss 异常抗性规则

Boss 不要完全免疫，否则玩法变窄。建议：

```text
普通异常：效果 × 30% - 60%
冻结：转化为 FreezeBuildUp，满后短暂停顿 0.5s
眩晕：转化为 StaggerBuildUp
击退：无位移，但增加破韧
减速：最高不超过 20%
沉默：Boss 无效，但可降低下一次技能权重
```

---

## 11. BuffTriggerEvent

Buff 可以监听事件。

```text
BuffTriggerEvent
├── triggerType
├── triggerChance
├── internalCooldown
├── condition
├── actionList
└── consumeStack
```

TriggerType：

```text
OnApply
OnExpire
OnTick
OnHit
OnCrit
OnKill
OnTakeDamage
OnBlock
OnDodge
OnSkillUse
OnStackReached
OnOwnerLowHealth
OnMinionDeath
```

示例：雷电护盾

```text
OnTakeDamage 触发
30% 概率对攻击者释放小电弧
内置冷却 0.5s
```

---

## 12. 召唤物系统

召唤物必须独立配置，不写死在技能里。

```text
SummonEntityDefinition
├── summonEntityId
├── displayName
├── prefab
├── summonType
├── baseStats
├── inheritRule
├── skillSet
├── aiProfile
├── lifetimeRule
├── commandRule
├── deathRule
└── presentation
```

SummonType：

```text
Minion：跟随战斗仆从
Totem：原地释放技能
Turret：炮塔，可转向攻击
TemporaryClone：临时幻影
Spirit：灵体，穿越单位
TrapEntity：陷阱实体
```

---

## 13. 召唤继承规则

```text
SummonInheritRule
├── inheritOwnerLevel
├── inheritOwnerDamagePercent
├── inheritOwnerLifePercent
├── inheritOwnerDefensePercent
├── inheritOwnerCrit
├── inheritOwnerAilment
├── inheritSkillTags
├── affectedByMinionStats
└── affectedByAura
```

示例：骷髅战士

```text
继承主人等级
继承 35% 攻击属性
受 Minion Damage 词条影响
受 Aura 影响
不继承主人暴击率
```

---

## 14. 召唤物 AI 配置

```text
SummonAIProfile
├── followDistance
├── leashDistance
├── targetSelection
├── attackRange
├── skillUseRules
├── returnToOwnerWhenFar
├── teleportToOwnerDistance
├── commandResponse
└── avoidBossAOE
```

TargetSelection：

```text
OwnerTarget
NearestEnemy
LowestHealthEnemy
HighestThreat
ProtectOwner
ManualCommand
```

---

## 15. 召唤上限规则

```text
SummonLimitRule
├── globalLimitGroup
├── maxAlive
├── replaceOldestWhenFull
├── replaceWeakestWhenFull
├── separateLimitBySkill
└── limitAffectedByStats
```

示例：

```text
骷髅兵上限 8
骷髅法师上限 4
所有骷髅共用上限 10
超过上限时替换最早召唤的
```

---

## 16. 持续区域 AreaDefinition

```text
AreaDefinition
├── areaId
├── areaShape
├── spawnMode
├── radius
├── innerRadius
├── length
├── width
├── duration
├── tickInterval
├── warningTime
├── targetFilter
├── damageBlock
├── buffApplyBlocks
├── overlapRule
├── movementRule
├── presentation
└── performanceBudget
```

AreaShape：

```text
Circle
Donut
Box
Line
Cone
Sector
RandomCluster
MovingWall
RotatingBeam
```

---

## 17. Area 重叠规则

```text
OverlapRule
├── canOverlapSameCaster
├── canOverlapDifferentCaster
├── maxStacksOnTarget
├── damageStackMode
├── refreshMode
└── mergeVisuals
```

示例：火焰地面

```text
同一施法者多个火地面可以重叠，但同一目标最多吃 2 层
不同施法者可以叠加
视觉合并，避免一地都是粒子糊成粥
```

---

## 18. 陷阱/延迟触发物

陷阱可以看作 Area + TriggerCondition。

```text
TrapDefinition
├── trapId
├── armTime
├── triggerRadius
├── detectionTarget
├── maxLifetime
├── triggerOnce
├── onTriggerSkillId
├── canBeDestroyed
├── visibilityRule
└── presentation
```

---

## 19. Buff 编辑器界面

```text
BuffEditorTab
├── BuffList
├── BasicInfoPanel
├── StackRulePanel
├── DurationPanel
├── ModifierPanel
├── TickPanel
├── TriggerEventPanel
├── PresentationPanel
└── ValidationPanel
```

---

## 20. 召唤物编辑器界面

```text
SummonEditorTab
├── SummonList
├── BasicInfo
├── PrefabBinding
├── BaseStats
├── InheritRule
├── SkillSet
├── AIProfile
├── LifetimeRule
├── DeathRule
└── SandboxTest
```

---

## 21. 持续区域编辑器界面

```text
AreaEditorTab
├── AreaList
├── ShapePreview
├── DurationTickPanel
├── DamagePanel
├── BuffPanel
├── OverlapRulePanel
├── WarningVFXPanel
└── PerformancePanel
```

---

## 22. 校验规则

| 规则 | 级别 |
|---|---|
| Buff 没有持续时间且不是 Infinite | Error |
| DOT 没有 TickInterval | Error |
| DOT TickInterval 小于 0.1s | Error |
| Buff 可叠层但 maxStack <= 1 | Warning |
| 召唤物没有 AIProfile | Error |
| 召唤物没有上限 | Warning |
| Area 持续时间无限且可叠加 | Error |
| Boss 控制类异常没有 BossEffectiveness | Error |
| 光环 Buff 不显示 UI 图标 | Warning |
| 陷阱没有触发半径 | Error |
