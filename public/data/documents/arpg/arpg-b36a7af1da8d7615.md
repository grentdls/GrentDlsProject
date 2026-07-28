# 72. 怪物技能编辑器：AI技能池、精英词缀、Boss阶段


> 项目：Unity 3D ACT 刷宝 ARPG  
> 批次：第五批 —— 技能编辑器 / 怪物技能编辑器 / 策划配置工具  
> 目标：让策划不改代码，也能配置玩家技能、怪物技能、Boss 阶段技能、辅助模块、Buff、VFX/SFX、数值成长、AI 使用条件与测试验收。


---

## 1. 设计目标

怪物技能编辑器要让策划能够配置：

- 普通怪使用哪些技能。
- 精英怪获得哪些额外技能。
- 地图词缀如何改变怪物技能。
- Boss 每个阶段有哪些技能。
- 技能释放权重、距离、角度、冷却、连招规则。
- 转阶段、召唤、场地机关、安全区、奖励出口。

怪物技能不要写死在怪物脚本里。怪物只绑定 SkillSet，SkillSet 决定它会什么。

---

## 2. 怪物技能相关数据

```text
MonsterDefinition
├── monsterId
├── family
├── rank
├── baseStats
├── aiProfile
├── skillSetId
├── eliteAffixPool
├── lootProfile
└── presentation
```

```text
MonsterSkillSet
├── skillSetId
├── ownerMonsterFamilies
├── defaultSkillSlots[]
├── conditionalSkillSlots[]
├── eliteExtraSkillPool
├── mapModifierOverrides
├── difficultyScale
└── validationRules
```

```text
BossSkillSet
├── bossId
├── phases[]
├── globalCooldownRules
├── phaseTransitionRules
├── arenaMechanics
├── summonWaves
├── enrageRule
└── rewardRule
```

---

## 3. 怪物 SkillSlot

```text
MonsterSkillSlot
├── slotId
├── skillId
├── aiWeight
├── cooldown
├── cooldownGroup
├── rangeMin
├── rangeMax
├── angleLimit
├── requireLineOfSight
├── targetSelection
├── movementBeforeCast
├── castWhenMoving
├── conditionList
├── forbidConditionList
├── maxConsecutiveUse
└── failFallbackSkill
```

示例：普通狼怪

```text
SkillSlot_01：撕咬，距离 0-2m，权重 80，冷却 1s
SkillSlot_02：扑击，距离 4-10m，权重 35，冷却 6s，需要视线
SkillSlot_03：嚎叫，周围友军 >= 3，权重 15，冷却 12s
```

---

## 4. AI 使用条件

```text
AIUseCondition
├── conditionType
├── compareMode
├── valueA
├── valueB
├── targetStat
└── note
```

ConditionType：

```text
DistanceToTarget
AngleToTarget
SelfHealthPercent
TargetHealthPercent
AllyCountInRange
EnemyCountInRange
HasBuff
TargetHasBuff
PhaseIndex
TimeSinceCombatStart
TimeSinceLastSkill
MapAffixActive
RandomChance
LineOfSight
TargetIsCasting
TargetIsMoving
TargetIsInArea
```

---

## 5. AI 技能评分

每个技能每次决策都会得到分数。

```text
SkillScore = BaseWeight
           × DistanceScore
           × AngleScore
           × ConditionScore
           × CooldownScore
           × PhaseScore
           × RandomFactor
```

编辑器需要显示实时评分：

```text
当前目标距离：8.2m，DistanceScore=1.0
目标角度：23°，AngleScore=1.0
冷却可用：CooldownScore=1.0
血量条件满足：ConditionScore=1.0
最终评分：35
```

---

## 6. 怪物行为模板

### 6.1 近战普通怪

```text
核心技能：普通攻击
辅助技能：短突进/怒吼
技能数量：2-3
AI 重点：贴近玩家，包围，少放大招
```

### 6.2 远程普通怪

```text
核心技能：远程投射物
辅助技能：后撤、放陷阱
AI 重点：保持距离，避免贴脸
```

### 6.3 法师怪

```text
核心技能：法术投射/区域法术
辅助技能：护盾、传送
AI 重点：前摇明显，伤害高但可躲
```

### 6.4 召唤怪

```text
核心技能：召唤小怪
辅助技能：治疗/强化
AI 重点：保持后排，优先召唤
```

### 6.5 精英怪

```text
核心技能：继承原怪物
额外技能：精英词缀技能 1-3 个
AI 重点：技能密度提高，但不能无缝连招
```

---

## 7. 精英词缀技能

精英词缀可以给怪物添加被动和主动技能。

```text
EliteAffixDefinition
├── affixId
├── displayName
├── affixTier
├── allowedMonsterFamilies
├── forbiddenMonsterFamilies
├── statModifiers[]
├── extraSkillSlots[]
├── auraBuffs[]
├── onDeathSkills[]
├── visualOverride
└── lootBonus
```

示例：烈焰精英

```text
火抗 +40%
攻击附加火焰伤害
每 8 秒释放火环
死亡时产生小爆炸
身体带火焰光效
```

---

## 8. 地图词缀影响怪物技能

地图词缀不直接改怪物 prefab，而是通过 SkillSet Override。

```text
MapModifierSkillOverride
├── mapModifierId
├── targetMonsterRank
├── targetSkillTags
├── cooldownMultiplier
├── damageMultiplier
├── areaMultiplier
├── projectileCountAdd
├── addExtraSkill
└── forbiddenSkillTags
```

示例：投射物地图词缀

```text
所有怪物 Projectile 技能额外 +1 投射物
投射物技能伤害 ×0.85
```

---

## 9. BossSkillSet 结构

```text
BossSkillSet
├── bossId
├── phaseList[]
├── globalSkillRules
├── transitionSkills[]
├── arenaObjectRules[]
├── summonWaveRules[]
├── enrageRule
├── failSafeRule
└── rewardUnlockRule
```

---

## 10. Boss Phase 配置

```text
BossPhase
├── phaseIndex
├── phaseName
├── enterCondition
├── exitCondition
├── skillPool[]
├── passiveBuffs[]
├── arenaRules[]
├── summonRules[]
├── musicState
├── cameraRule
└── dialogueLines
```

EnterCondition：

```text
CombatStart
HealthBelowPercent
TimerReached
ArenaObjectDestroyed
SummonWaveCleared
ScriptEvent
```

ExitCondition：

```text
HealthBelowPercent
TimerReached
MechanicResolved
BossDead
```

---

## 11. Boss 技能池

```text
BossPhaseSkillSlot
├── skillId
├── weight
├── cooldown
├── rangeMin
├── rangeMax
├── phaseLocalCooldown
├── globalCooldownGroup
├── maxUsePerPhase
├── minIntervalAfterSameSkill
├── forbidAfterSkillTags
├── preferAfterSkillTags
├── conditionList
└── role
```

Role：

```text
BasicAttack：基础攻击
Pressure：压迫技能
Punish：惩罚远离/贴脸
ArenaMechanic：场地机制
Summon：召唤
Transition：转阶段
Ultimate：大招
Enrage：狂暴
```

---

## 12. Boss 转阶段技能

转阶段不是普通技能，必须锁流程。

```text
BossTransitionSkill
├── fromPhase
├── toPhase
├── triggerCondition
├── invulnerable
├── clearPlayerProjectiles
├── stopAllAdds
├── playAnimation
├── playVFX
├── spawnArenaObjects
├── cameraFocus
├── dialogue
├── duration
└── nextPhaseStartDelay
```

---

## 13. Boss 场地机关配置

```text
ArenaMechanicRule
├── mechanicId
├── spawnPhase
├── arenaObjectPrefab
├── spawnPoints
├── activationDelay
├── activeDuration
├── damageSkillId
├── destroyCondition
├── safeZoneRule
└── visualWarning
```

场地对象类型：

```text
火柱
毒池
旋转激光
落石点
安全罩
封路墙
召唤门
可破坏水晶
地面裂缝
移动风墙
```

---

## 14. Boss 召唤波次

```text
SummonWaveRule
├── waveId
├── triggerPhase
├── triggerCondition
├── monsterIds[]
├── spawnPointGroup
├── spawnCount
├── spawnInterval
├── maxAlive
├── mustClearToContinue
└── rewardOnClear
```

---

## 15. Boss 狂暴规则

```text
EnrageRule
├── enable
├── triggerAfterSeconds
├── triggerAtHealthPercent
├── damageMultiplier
├── cooldownMultiplier
├── newSkillUnlocks[]
├── visualChange
├── musicChange
└── warningMessage
```

---

## 16. 怪物技能编辑器界面

```text
MonsterSkillEditorWindow
├── MonsterBrowser
│   ├── MonsterFamilyFilter
│   ├── RankFilter
│   └── Search
├── MonsterSkillSetPanel
│   ├── DefaultSkillSlots
│   ├── ConditionalSkillSlots
│   ├── EliteExtraPool
│   └── MapOverridePreview
├── AIConditionPanel
├── SkillScorePreview
├── SandboxButton
└── ValidationPanel
```

---

## 17. Boss 技能编辑器界面

```text
BossSkillSetEditorWindow
├── BossSelector
├── PhaseTimeline
├── PhaseDetailPanel
├── SkillPoolPanel
├── TransitionPanel
├── ArenaMechanicPanel
├── SummonWavePanel
├── EnragePanel
├── BossArenaPreview
└── ValidationPanel
```

PhaseTimeline 显示：

```text
P1 100%-70%
Transition 70%
P2 70%-35%
Transition 35%
P3 35%-0%
Enrage after 180s
```

---

## 18. 怪物技能测试

测试模式：

```text
单怪测试：1 个怪对 1 个玩家假人
群怪测试：5/10/20 个怪对玩家
精英测试：普通怪 + 词缀
地图词缀测试：开启指定地图词缀
Boss 阶段测试：直接跳到某阶段
全流程测试：完整 Boss 战
```

必须记录：

```text
技能释放次数
技能命中率
平均释放间隔
玩家可反应时间
玩家死亡原因
AI 卡住次数
技能失败次数
Boss 阶段持续时间
```

---

## 19. 怪物/Boss 校验规则

| 规则 | 级别 |
|---|---|
| 怪物没有普通攻击 | Error |
| 怪物所有技能都有冷却，且没有 fallback | Error |
| 怪物远程技能没有最大距离 | Warning |
| 精英额外技能没有视觉提示 | Warning |
| Boss 阶段没有退出条件 | Error |
| Boss 高伤技能没有预警 | Error |
| Boss 连续释放同一大招没有间隔 | Error |
| Boss 转阶段没有无敌保护 | Warning |
| 召唤波次没有最大存活上限 | Error |
| 场地机关没有销毁或结束条件 | Error |

---

## 20. 第一版怪物技能池建议

| 怪物类型 | 技能数量 | 备注 |
|---|---:|---|
| 普通近战小怪 | 2 | 普攻 + 突进 |
| 普通远程小怪 | 2 | 射击 + 后撤 |
| 法师小怪 | 3 | 法弹 + 地面圈 + 护盾 |
| 召唤怪 | 3 | 召唤 + 强化 + 弱攻击 |
| 精英怪 | 原技能 + 1-2 | 由词缀提供 |
| 小 Boss | 5-7 | 有 1 个阶段机制 |
| 章节 Boss | 8-14 | 2-3 阶段 |
| 终局 Boss | 14-24 | 多阶段 + 场地机制 |
