# 《星空掠夺者》战斗流派、词条扩展玩法与实现逻辑完整设计文档

> 项目：Unity2D 桌面挂机飞船建造游戏《星空掠夺者》  
> 文档主题：战斗流派扩展、词条系统、击中/击杀/护盾/撞击/异常玩法、实现逻辑  
> 适用范围：飞船战、登舰战、星球登陆战、自动战斗、装备词条、技能词条、部件词条、套装词条、职业被动  
> 设计目标：让单位、装备、飞船部件、技能书、套装、职业都能围绕“流派”形成组合，而不是只有单纯数值堆叠。

---

## 1. 设计目标

当前系统已经有单位、装备、技能、职业、飞船模块、随机星球、敌舰、掉落等内容。接下来要补的是“战斗流派骨架”。

本系统要解决的问题：

1. 让玩家能围绕不同战斗逻辑做 BD。
2. 让同一单位因为获得不同技能、装备、词条而出现完全不同玩法。
3. 让高稀有技能书、装备、部件词条有明显价值。
4. 让自动战斗也能通过配置策略体现差异，而不是纯数值碾压。
5. 让桌面挂机时，玩家偶尔打开窗口也能快速看懂当前流派强在哪里。

核心原则：

| 原则 | 说明 |
|---|---|
| 词条驱动 | 所有流派尽量通过词条、技能、装备、套装配置实现 |
| 可组合 | 击杀回血可以和击杀爆炸组合，护盾撞击可以和击中回血组合 |
| 可限制 | 高频触发效果必须有触发系数、内置冷却或触发上限 |
| 可读性 | UI 必须显示当前单位的主要流派标签 |
| 自动化 | 自动战斗 AI 能根据流派决定站位、目标、技能释放 |
| 稀有度价值 | 高稀有词条不是单纯更高数值，而是改变战斗方式 |
| 多场景兼容 | 飞船战、登舰战、登陆战都能使用同一套触发器 |

---

## 2. 核心概念

### 2.1 流派

流派是由一组属性、词条、技能、套装效果、职业被动组成的玩法方向。

示例：

- 攻速流：降低攻击间隔，高频攻击，高频触发击中效果。
- 击杀流：击杀回血、击杀爆炸、击杀刷新技能、击杀掉落加成。
- 击中流：击中概率回血、击中概率增伤、击中概率中毒、击中概率追加弹。
- 护盾流：堆护盾、护盾减伤、护盾反击、护盾撞击、护盾破裂爆炸。
- 撞击流：依靠冲锋、护盾冲撞、飞船接舷撞击造成高额伤害。
- 异常流：中毒、燃烧、腐蚀、虚空裂解、麻痹叠层。
- 召唤流：无人机、藤蔓、幽魂、虫群协助战斗。
- 范围流：扩大攻击范围、爆炸范围、光环范围、毒雾范围。

### 2.2 词条

词条是附着在装备、技能、职业、飞船部件、套装上的独立效果。

词条配置示例：

```json
{
  "affixId": "AFF_KILL_HEAL_001",
  "name": "击杀回血",
  "rarity": "Rare",
  "trigger": "OnKill",
  "effectType": "HealSelf",
  "valueType": "PercentMaxHP",
  "baseValue": 0.06,
  "cooldown": 0,
  "maxStack": 1,
  "tags": ["Kill", "Heal", "Sustain"]
}
```

### 2.3 触发器

| 触发器 | 触发时机 |
|---|---|
| OnBattleStart | 战斗开始 |
| OnAttackStart | 单位开始一次攻击 |
| OnAttackEnd | 攻击动作结束 |
| OnProjectileSpawn | 弹体生成 |
| OnHit | 击中目标 |
| OnCrit | 暴击 |
| OnKill | 击杀敌人 |
| OnDamageTaken | 自己受到伤害 |
| OnShieldHit | 护盾受到攻击 |
| OnShieldBreak | 护盾被打破 |
| OnShieldRecover | 护盾恢复 |
| OnCollision | 单位撞击目标 |
| OnDashEnd | 冲锋结束 |
| OnStatusApplied | 成功施加异常状态 |
| OnStatusTick | 异常状态每跳伤害 |
| OnLowHP | 生命低于阈值 |
| OnRoomEnter | 进入房间 |
| OnBoardingStart | 登舰开始 |
| OnBattleEnd | 战斗结束 |

### 2.4 标签

| 标签 | 用途 |
|---|---|
| AttackSpeed | 攻击间隔、攻速相关 |
| Kill | 击杀触发 |
| Hit | 击中触发 |
| Shield | 护盾相关 |
| Collision | 撞击相关 |
| Explosion | 爆炸相关 |
| Poison | 中毒 |
| Burn | 燃烧 |
| Corrosion | 腐蚀 |
| Void | 虚空 |
| Heal | 治疗 |
| Lifesteal | 吸血 |
| Drone | 无人机 |
| Summon | 召唤物 |
| Area | 范围 |
| Projectile | 弹体 |
| Melee | 近战 |
| Ranged | 远程 |
| Boarding | 登舰战 |
| Landing | 登陆战 |
| ShipBattle | 飞船战 |

---

## 3. 战斗结算总流程

### 3.1 单次攻击结算顺序

1. 读取单位当前攻击属性。
2. 触发 `OnAttackStart`。
3. 计算攻击间隔、施法前摇、弹体数量。
4. 生成弹体或近战判定。
5. 触发 `OnProjectileSpawn`。
6. 命中目标。
7. 触发 `OnHit`。
8. 计算基础伤害。
9. 计算暴击。
10. 触发 `OnCrit`。
11. 计算护盾、减伤、抗性。
12. 造成最终伤害。
13. 判断死亡。
14. 如果死亡，触发 `OnKill`。
15. 攻击结束，触发 `OnAttackEnd`。

### 3.2 伤害公式

```text
BaseDamage = AttackPower * SkillMultiplier + FlatDamage

CritMultiplier = 1 + CritDamage
If IsCrit = true:
    DamageAfterCrit = BaseDamage * CritMultiplier
Else:
    DamageAfterCrit = BaseDamage

ElementDamage = DamageAfterCrit * (1 + ElementBonus - TargetElementResist)

FinalDamageBeforeShield = ElementDamage * (1 + DamageIncrease - TargetDamageReduction)

ShieldDamage = min(TargetShield, FinalDamageBeforeShield * ShieldDamageRatio)
HpDamage = FinalDamageBeforeShield - ShieldDamage

FinalHpDamage = max(1, HpDamage)
```

### 3.3 触发概率公式

高频玩法必须使用触发系数，避免攻速无限放大。

```text
RealProcChance = BaseProcChance * ProcCoefficient * TriggerScale
```

| 参数 | 说明 |
|---|---|
| BaseProcChance | 词条基础概率 |
| ProcCoefficient | 当前攻击/技能的触发系数 |
| TriggerScale | 特殊修正，例如范围技能、多段技能降低触发 |

触发系数建议：

| 攻击类型 | 触发系数 |
|---|---:|
| 普通单体近战 | 1.0 |
| 普通单体远程 | 1.0 |
| 多段机枪每段 | 0.25 |
| 多段刀光每段 | 0.35 |
| 范围爆炸每个目标 | 0.35 |
| 毒雾每跳 | 0.15 |
| 火场每跳 | 0.15 |
| 召唤物攻击 | 0.4 |
| 反击伤害 | 0.3 |
| 撞击 | 1.0 |
| Boss 大技能 | 0.2-0.5 |

### 3.4 内置冷却

所有强力触发词条必须配置内置冷却。

```text
CanTrigger = CurrentTime >= LastTriggerTime + InternalCooldown
```

| 效果类型 | 建议内置冷却 |
|---|---:|
| 击中回血 | 0.5 秒 |
| 击中增伤 | 0.3 秒 |
| 击杀爆炸 | 0 秒，但爆炸击杀不能无限触发同词条 |
| 护盾反击 | 0.8 秒 |
| 撞击回血 | 1.5 秒 |
| 技能刷新 | 5 秒 |
| 召唤物生成 | 3 秒 |
| 大范围爆炸 | 1 秒 |

---

## 4. 流派总览

| 流派 | 核心玩法 | 核心属性 | 适合单位 | 风险 |
|---|---|---|---|---|
| 攻击间隔流 | 缩短攻击间隔，高频输出 | 攻速、触发概率、弹体数 | 机械、虫巢、佣兵 | 怕反伤、怕护盾 |
| 击杀回血流 | 击杀后恢复生命 | 击杀、治疗加成、最大生命 | 妖兽、植物、佣兵 | 打 Boss 时收益低 |
| 击杀爆炸流 | 击杀造成范围爆炸 | 爆炸范围、击杀、范围伤害 | 虚空、机械、元素 | 需要清杂兵 |
| 击杀连锁流 | 击杀刷新技能/追加攻击 | 击杀、技能冷却、连锁次数 | 妖兽、虚空 | 怕高血量敌人 |
| 击中回血流 | 击中概率回血 | 攻速、命中、治疗加成 | 植物、机械、虫巢 | 依赖命中频率 |
| 击中增伤流 | 击中叠加增伤 | 攻速、叠层、持续时间 | 机械、佣兵 | 需要持续输出 |
| 击中异常流 | 击中施加中毒/燃烧/腐蚀 | 异常概率、异常伤害 | 植物、元素、虚空 | 怕异常抗性 |
| 护盾厚甲流 | 堆护盾和减伤 | 护盾值、护盾恢复、减伤 | 机械、晶体 | 输出较低 |
| 护盾反击流 | 护盾被打时反击 | 护盾、反击伤害、嘲讽 | 机械、晶体、妖兽 | 怕真实伤害 |
| 护盾撞击流 | 用护盾冲撞造成伤害 | 护盾值、移动速度、撞击倍率 | 机械、妖兽 | 需要位移空间 |
| 撞击回血流 | 撞击概率回血/回盾 | 冲锋、护盾、治疗 | 妖兽、机械 | 怕控制 |
| 异常爆发流 | 异常叠满后引爆 | 异常层数、爆发倍率 | 植物、虚空、元素 | 前期慢热 |
| 范围扩张流 | 提高攻击/技能范围 | 范围、爆炸、弹射 | 元素、机械 | 单体弱 |
| 召唤压制流 | 召唤物持续输出 | 召唤数量、召唤强度 | 虫巢、幽灵、植物 | 怕范围清场 |
| 低血狂暴流 | 血量越低越强 | 低血、吸血、爆发 | 妖兽、佣兵 | 容错低 |
| 掠夺收益流 | 战斗收益提高 | 掉落、俘虏、拆解 | 佣兵、外星 | 战斗强度偏低 |

---

## 5. 攻击间隔流派

### 5.1 核心玩法

攻击间隔流派的核心是减少每次攻击之间的等待时间。

```text
FinalAttackInterval = BaseAttackInterval / (1 + AttackSpeedBonus)
FinalAttackInterval = clamp(FinalAttackInterval, MinAttackInterval, MaxAttackInterval)
```

推荐下限：

| 武器类型 | 最低攻击间隔 |
|---|---:|
| 重型炮 | 1.2 秒 |
| 普通枪械 | 0.45 秒 |
| 机枪 | 0.15 秒 |
| 近战 | 0.35 秒 |
| 法术 | 0.6 秒 |
| 召唤物 | 0.5 秒 |

### 5.2 攻击间隔流特点

优势：

- 触发击中类词条频率高。
- 配合击中回血、击中增伤、击中异常非常强。
- 适合机械族、虫巢、枪手副职业。

弱点：

- 单次伤害较低。
- 怕反伤、护盾反击。
- 对高护甲敌人容易刮痧。
- 多段攻击触发系数低，需要平衡。

### 5.3 攻击间隔核心词条

| ID | 名称 | 稀有度 | 效果 |
|---|---|---|---|
| AFF_AS_001 | 轻量扳机 | 普通 | 攻击间隔 -5% |
| AFF_AS_002 | 快速装填 | 普通 | 远程攻击间隔 -7% |
| AFF_AS_003 | 机械连发 | 稀有 | 攻击间隔 -10%，但单次伤害 -3% |
| AFF_AS_004 | 过载击发 | 史诗 | 攻击间隔 -18%，每 5 次攻击获得 1 层过热 |
| AFF_AS_005 | 零点连射 | 传说 | 攻击间隔 -25%，击中触发类概率 +10% |
| AFF_AS_006 | 虫群节拍 | 稀有 | 召唤物攻击间隔 -15% |
| AFF_AS_007 | 刀锋节律 | 稀有 | 近战攻击间隔 -12%，连续攻击同一目标时额外 -5% |
| AFF_AS_008 | 星尘快手 | 史诗 | 每次击杀后 3 秒内攻击间隔 -30% |
| AFF_AS_009 | 自动校准枪机 | 稀有 | 连续未暴击 4 次后，下次攻击间隔 -50% |
| AFF_AS_010 | 极限频率核心 | 神话 | 攻击间隔 -30%，但每秒损失 0.5% 最大护盾 |

### 5.4 过热副机制

```text
每次攻击增加 HeatGain
Heat >= 100 时进入 Overheat
Overheat 状态下：
- 攻击间隔 +40%
- 无法触发部分高频词条
- 持续 3 秒后清空热量
```

过热相关词条：

| 名称 | 效果 |
|---|---|
| 冷却导管 | 热量增长 -20% |
| 热能回收 | 进入过热时恢复 10% 护盾 |
| 灼热连射 | 热量越高，伤害越高，最高 +25% |
| 冰晶散热片 | 攻击间隔 -8%，热量上限 +30 |

---

## 6. 击杀类流派

击杀类流派围绕 `OnKill` 触发器展开，适合清理大量小怪、登舰战、登陆战。

### 6.1 击杀回血流

```text
HealAmount = MaxHP * KillHealPercent + AttackPower * KillHealScale
```

规则：

1. 击杀回血可以被治疗加成影响。
2. 击杀召唤物可以触发，但效果降低 50%。
3. 爆炸造成的连环击杀可以触发回血，但每 0.2 秒最多触发一次。
4. Boss 战收益低，所以需要配合“击中回血”或“对精英回血”补偿。

| ID | 名称 | 稀有度 | 效果 |
|---|---|---|---|
| AFF_KILL_HEAL_001 | 掠血本能 | 普通 | 击杀恢复 3% 最大生命 |
| AFF_KILL_HEAL_002 | 野兽吞噬 | 稀有 | 击杀恢复 5% 最大生命，妖兽额外 +2% |
| AFF_KILL_HEAL_003 | 生命回收程序 | 稀有 | 击杀机械/机器人敌人时恢复 8% 护盾 |
| AFF_KILL_HEAL_004 | 藤蔓吸收 | 史诗 | 击杀后恢复生命，并在脚下生成治疗藤蔓 |
| AFF_KILL_HEAL_005 | 血肉盛宴 | 传说 | 连续击杀时回血递增，每层 +2%，最多 5 层 |
| AFF_KILL_HEAL_006 | 幽魂汲取 | 史诗 | 击杀后恢复生命和能量 |
| AFF_KILL_HEAL_007 | 猎首回春 | 稀有 | 击杀精英单位恢复 20% 最大生命 |
| AFF_KILL_HEAL_008 | 死亡反哺 | 神话 | 击杀后若生命低于 30%，额外获得 5 秒免死护盾 |

### 6.2 击杀爆炸流

```text
ExplosionDamage = KillerAttackPower * ExplosionMultiplier + KilledTargetMaxHP * HpExplosionScale
ExplosionRadius = BaseRadius * (1 + AreaBonus)
```

推荐数值：

| 稀有度 | 爆炸倍率 | 目标最大生命转化 | 半径 |
|---|---:|---:|---:|
| 普通 | 60% 攻击力 | 0% | 1.5 格 |
| 稀有 | 90% 攻击力 | 2% | 1.8 格 |
| 史诗 | 130% 攻击力 | 3% | 2.2 格 |
| 传说 | 180% 攻击力 | 5% | 2.8 格 |
| 神话 | 250% 攻击力 | 8% | 3.5 格 |

防止无限连爆：

```text
ExplosionCanTriggerKillEffect = false
```

或者只允许传说/神话词条开启：

```text
ExplosionChainDepth <= 3
每层连锁伤害衰减 50%
```

| ID | 名称 | 稀有度 | 效果 |
|---|---|---|---|
| AFF_KILL_EXP_001 | 小型殉爆 | 普通 | 击杀时造成 70% 攻击力范围伤害 |
| AFF_KILL_EXP_002 | 血肉炸裂 | 稀有 | 击杀生物时爆炸，附带流血 |
| AFF_KILL_EXP_003 | 能量核心崩解 | 稀有 | 击杀机械时爆炸，附带电击 |
| AFF_KILL_EXP_004 | 虚空坍缩 | 史诗 | 击杀时生成虚空裂点，延迟爆炸 |
| AFF_KILL_EXP_005 | 连锁殉爆 | 传说 | 爆炸击杀可继续爆炸，最多 2 次 |
| AFF_KILL_EXP_006 | 星核爆燃 | 神话 | 击杀精英后触发大范围星核爆炸 |
| AFF_KILL_EXP_007 | 毒囊破裂 | 稀有 | 击杀中毒目标时释放毒雾 |
| AFF_KILL_EXP_008 | 燃烧尸骸 | 史诗 | 击杀燃烧目标时留下火场 |

### 6.3 击杀刷新流

| 名称 | 稀有度 | 效果 |
|---|---|---|
| 战斗续航 | 普通 | 击杀后恢复 5 点能量 |
| 猎杀节奏 | 稀有 | 击杀后当前技能冷却 -10% |
| 无尽追猎 | 史诗 | 击杀后 3 秒内移动速度 +20% |
| 屠戮重启 | 传说 | 击杀后有 20% 概率刷新一个主动技能 |
| 杀戮连锁协议 | 神话 | 每 3 次击杀刷新主技能，并获得 2 秒霸体 |

### 6.4 击杀召唤流

| 名称 | 效果 |
|---|---|
| 死体寄生 | 击杀后生成 1 个小型虫群 |
| 幽魂残影 | 击杀后召唤短时幽魂攻击附近敌人 |
| 植物孢子 | 击杀后生成孢子，孢子爆开造成中毒 |
| 机械残骸无人机 | 击杀机械敌人后生成维修无人机 |
| 虚空回声 | 击杀后产生一个复制攻击的虚影 |

### 6.5 击杀收益流

| 名称 | 稀有度 | 效果 |
|---|---|---|
| 掠夺者直觉 | 普通 | 击杀敌人时资源掉落 +3% |
| 精准拆解 | 稀有 | 击杀机械敌人后部件碎片掉率 +8% |
| 猎首赏金 | 稀有 | 击杀精英获得额外星币 |
| 战利品标记 | 史诗 | 被标记敌人死亡时额外掉落一次 |
| 贪婪星图 | 传说 | 击杀 Boss 后额外抽取一个稀有掉落池 |
| 黑市通行证 | 神话 | 战斗结束时有小概率发现黑市事件 |

---

## 7. 击中类流派

击中类流派围绕 `OnHit` 触发器，最适合攻击频率高的单位。

### 7.1 击中概率回血

```text
If Random < HitHealChance * ProcCoefficient:
    HealAmount = AttackPower * HitHealScale + MaxHP * HitHealPercent
```

| 稀有度 | 触发概率 | 治疗量 |
|---|---:|---:|
| 普通 | 8% | 攻击力 20% |
| 稀有 | 12% | 攻击力 30% |
| 史诗 | 16% | 攻击力 45% |
| 传说 | 20% | 攻击力 60% + 最大生命 1% |
| 神话 | 25% | 攻击力 80% + 最大生命 2% |

| ID | 名称 | 稀有度 | 效果 |
|---|---|---|---|
| AFF_HIT_HEAL_001 | 微量吸收 | 普通 | 击中有 8% 概率恢复少量生命 |
| AFF_HIT_HEAL_002 | 活性藤刺 | 稀有 | 植物单位击中回血概率额外 +5% |
| AFF_HIT_HEAL_003 | 血液抽取针 | 稀有 | 远程攻击击中概率回血 |
| AFF_HIT_HEAL_004 | 虫群啃噬 | 史诗 | 召唤物击中也能为主人恢复生命，效率 35% |
| AFF_HIT_HEAL_005 | 生命窃取矩阵 | 传说 | 击中回血溢出部分转化为护盾 |
| AFF_HIT_HEAL_006 | 永动生物炉 | 神话 | 高频击中会叠加生命回流，每层治疗效果 +3%，最多 10 层 |

### 7.2 击中概率增伤

自身增伤：

```text
BuffDamageIncrease += StackValue
MaxStack = 10
Duration = 4 秒
```

目标易伤：

```text
TargetVulnerability += StackValue
MaxStack = 8
Duration = 5 秒
```

| ID | 名称 | 稀有度 | 效果 |
|---|---|---|---|
| AFF_HIT_DMG_001 | 战意升温 | 普通 | 击中有 10% 概率自身伤害 +3%，持续 4 秒，最多 5 层 |
| AFF_HIT_DMG_002 | 装甲破口 | 稀有 | 击中有 12% 概率让目标受到伤害 +4% |
| AFF_HIT_DMG_003 | 连续校准 | 稀有 | 连续击中同一目标时暴击率逐渐提高 |
| AFF_HIT_DMG_004 | 弱点透视 | 史诗 | 每第 5 次击中同一目标，造成一次额外真实伤害 |
| AFF_HIT_DMG_005 | 歼灭标记 | 传说 | 击中有概率标记目标，所有友军对其伤害 +15% |
| AFF_HIT_DMG_006 | 无限火控链 | 神话 | 每次击中都有概率复制上一次命中的 30% 伤害 |

### 7.3 击中异常流

| 异常 | 效果 |
|---|---|
| 中毒 | 持续生命伤害，可叠层 |
| 燃烧 | 持续伤害，降低治疗 |
| 腐蚀 | 降低护甲/护盾效率 |
| 麻痹 | 降低攻击间隔和移动速度 |
| 虚空裂解 | 受到伤害时额外触发一次裂解伤害 |
| 冰冻 | 降低行动速度，满层短暂冻结 |
| 寄生 | 持续吸血，死亡时生成虫群 |
| 恐惧 | 降低命中，可能逃离当前位置 |

异常叠层公式：

```text
StatusDamagePerTick = SourceAttackPower * StatusScale * StackCount
StackCount = min(StackCount + AddStack, MaxStack)
```

异常引爆：

```text
DetonateDamage = RemainingDotDamage * DetonateMultiplier
ClearStackAfterDetonate = true
```

---

## 8. 护盾流派

护盾流派不只是“多一条血”，而是可以形成厚甲、防反、撞击、破盾爆发四个方向。

### 8.1 护盾基础规则

```text
MaxShield = BaseShield * (1 + ShieldBonus)
ShieldRegenPerSecond = BaseShieldRegen * (1 + ShieldRegenBonus)
ShieldDamageReduction = ShieldDR
```

护盾恢复延迟：

```text
受到伤害后 ShieldRegenDelay = 3 秒
```

### 8.2 护盾厚甲流

| 名称 | 稀有度 | 效果 |
|---|---|---|
| 加厚能量板 | 普通 | 最大护盾 +8% |
| 晶体外壳 | 稀有 | 最大护盾 +12%，护盾存在时抗性 +5% |
| 盾墙协议 | 稀有 | 护盾受到伤害 -8% |
| 恒星屏障 | 史诗 | 护盾高于 70% 时受到伤害 -12% |
| 不破晶壁 | 传说 | 护盾第一次被打破时立即恢复 30% |
| 绝对防线 | 神话 | 护盾存在时免疫一次致命伤，冷却 60 秒 |

### 8.3 护盾反击流

触发器：`OnShieldHit`。

```text
CounterDamage = ShieldDamageTaken * CounterScale + Defense * DefenseScale
```

| 名称 | 稀有度 | 效果 |
|---|---|---|
| 反冲电弧 | 普通 | 护盾被击中时对攻击者造成少量电击 |
| 护盾尖刺 | 稀有 | 近战敌人攻击护盾时受到反伤 |
| 晶刺折射 | 史诗 | 护盾被远程击中时概率反射弹体 |
| 震荡盾面 | 史诗 | 护盾被击中后对周围敌人造成震荡 |
| 复仇屏障 | 传说 | 护盾损失越多，下一次反击越强 |
| 万象回弹 | 神话 | 护盾受到的 20% 伤害储存为反击能量 |

### 8.4 护盾撞击流

核心玩法：堆护盾、提高移动速度和冲锋距离，冲撞时用护盾值转化为伤害。

```text
CollisionDamage = BaseCollisionDamage
    + CurrentShield * ShieldToDamageScale
    + MoveSpeed * SpeedToDamageScale
    + UnitMass * MassToDamageScale
```

| 参数 | 基础值 |
|---|---:|
| ShieldToDamageScale | 0.25 |
| SpeedToDamageScale | 12 |
| MassToDamageScale | 5 |
| 撞击内置冷却 | 1.2 秒 |
| 撞击眩晕基础时长 | 0.5 秒 |

| ID | 名称 | 稀有度 | 效果 |
|---|---|---|---|
| AFF_SHIELD_RAM_001 | 合金肩撞 | 普通 | 撞击伤害 +15% |
| AFF_SHIELD_RAM_002 | 护盾冲锤 | 稀有 | 撞击时当前护盾 20% 转化为伤害 |
| AFF_SHIELD_RAM_003 | 撞击回血 | 稀有 | 撞击命中有 20% 概率恢复 3% 最大生命 |
| AFF_SHIELD_RAM_004 | 撞击回盾 | 史诗 | 撞击命中恢复造成伤害 15% 的护盾 |
| AFF_SHIELD_RAM_005 | 星舰破门锤 | 史诗 | 登舰战撞击舱门/敌人时伤害 +40% |
| AFF_SHIELD_RAM_006 | 破阵冲锋 | 传说 | 撞击击杀敌人后刷新冲锋 |
| AFF_SHIELD_RAM_007 | 流星盾甲 | 神话 | 冲锋距离越长，撞击伤害越高，最高 +300% |
| AFF_SHIELD_RAM_008 | 裂甲撞击 | 稀有 | 撞击降低目标护甲 15%，持续 5 秒 |

### 8.5 护盾破裂流

触发器：`OnShieldBreak`。

| 名称 | 效果 |
|---|---|
| 破盾震爆 | 护盾破裂时对周围造成伤害 |
| 紧急偏转 | 护盾破裂后获得 1 秒无敌 |
| 破盾狂暴 | 护盾破裂后攻击力 +20%，持续 5 秒 |
| 破盾毒雾 | 生体/植物护盾破裂时释放毒雾 |
| 破盾虚空门 | 虚空护盾破裂时传送到安全位置 |

---

## 9. 撞击流派

撞击流派可用于单位冲锋撞击、护盾撞击、登舰战破门、飞船接近时的船体冲撞、星球登陆战大型妖兽/机械的撞击攻击。

### 9.1 撞击判定

```text
CollisionTrigger =
    IsDashing == true
    AND DistanceMovedDuringDash >= MinDashDistance
    AND TargetHasCollisionBody == true
```

### 9.2 撞击方向和击退

```text
ImpactDirection = normalize(AttackerPosition - TargetPosition)
KnockbackDistance = BaseKnockback * (1 + KnockbackBonus - TargetTenacity)
```

### 9.3 撞击核心属性

| 属性 | 说明 |
|---|---|
| CollisionDamageBonus | 撞击伤害加成 |
| CollisionHealChance | 撞击回血概率 |
| CollisionShieldRecover | 撞击回盾 |
| DashDistance | 冲锋距离 |
| DashCooldownReduction | 冲锋冷却减少 |
| UnitMass | 单位质量 |
| KnockbackPower | 击退力度 |
| ImpactStunChance | 撞晕概率 |
| WallSlamDamage | 撞墙追加伤害 |

### 9.4 撞击专属效果

| 名称 | 稀有度 | 效果 |
|---|---|---|
| 短距猛撞 | 普通 | 冲锋距离 +1 格 |
| 重骨冲击 | 普通 | 撞击伤害 +12% |
| 撞击回血 | 稀有 | 撞击命中 20% 概率回血 |
| 撞击吸盾 | 稀有 | 撞击命中恢复护盾 |
| 破门专家 | 稀有 | 对舱门、障碍、护盾发生器撞击伤害 +50% |
| 墙面粉碎 | 史诗 | 被撞击敌人撞墙时受到二次伤害 |
| 连环撞击 | 史诗 | 撞击击退敌人，碰到其他敌人时造成扩散伤害 |
| 狂兽蛮冲 | 传说 | 冲锋期间霸体，撞击伤害 +80% |
| 星轨冲锋 | 传说 | 冲锋路径留下能量轨迹，持续伤害 |
| 行星级冲角 | 神话 | 撞击 Boss/精英时根据敌人最大生命造成额外伤害 |

---

## 10. 异常伤害流派

### 10.1 中毒流

适合植物生命、虫巢、生体单位。

| 名称 | 效果 |
|---|---|
| 毒刺 | 击中概率中毒 |
| 毒雾孢子 | 技能命中留下毒雾 |
| 剧毒增殖 | 中毒层数上限 +5 |
| 毒性回流 | 中毒伤害的一部分治疗自己 |
| 毒爆尸骸 | 中毒目标死亡时释放毒雾 |
| 百层毒腺 | 中毒达到 20 层时立即引爆 |

### 10.2 燃烧流

适合元素、机械过热、爆炸武器。

| 名称 | 效果 |
|---|---|
| 点燃弹头 | 击中概率燃烧 |
| 灼烧装甲 | 燃烧目标护甲降低 |
| 火场残留 | 击杀燃烧目标留下火场 |
| 高温扩散 | 燃烧每跳概率传染附近敌人 |
| 烈焰清舱 | 登舰战中燃烧范围扩大 |

### 10.3 腐蚀流

适合虚空、外星、生化武器。

| 名称 | 效果 |
|---|---|
| 腐蚀弹 | 击中降低护甲 |
| 溶解护盾 | 腐蚀对护盾额外有效 |
| 结构崩坏 | 腐蚀目标死亡后降低附近敌人防御 |
| 酸蚀残液 | 腐蚀目标移动时留下酸液 |
| 终末溶解 | 腐蚀满层后造成目标最大生命伤害 |

### 10.4 虚空裂解流

| 名称 | 效果 |
|---|---|
| 裂解印记 | 击中概率施加虚空裂解 |
| 裂隙回声 | 裂解目标受到伤害时额外触发一次裂解伤害 |
| 虚无传染 | 裂解目标死亡后传给附近目标 |
| 裂空爆发 | 裂解达到 5 层后引爆 |
| 黑洞残响 | 裂解引爆后短暂牵引附近敌人 |

---

## 11. 范围与爆炸流派

### 11.1 范围扩张规则

```text
FinalRadius = BaseRadius * (1 + AreaRadiusBonus)
```

范围加成需要上限：

| 类型 | 范围上限 |
|---|---:|
| 普通爆炸 | +100% |
| 毒雾/火场 | +80% |
| 治疗光环 | +60% |
| 牵引黑洞 | +50% |
| 近战横扫 | +70% |

### 11.2 范围伤害衰减

```text
DamageScaleByDistance = lerp(1.0, EdgeDamageScale, Distance / Radius)
```

建议边缘伤害为 40% - 60%。

### 11.3 范围流词条

| 名称 | 稀有度 | 效果 |
|---|---|---|
| 扩散弹头 | 普通 | 爆炸范围 +10% |
| 横扫刀锋 | 稀有 | 近战攻击范围 +15% |
| 毒雾扩散 | 稀有 | 毒雾范围 +20% |
| 星环震荡 | 史诗 | 范围技能中心伤害 +30% |
| 爆炸半径增幅器 | 史诗 | 爆炸范围 +30%，但伤害 -8% |
| 无差别轰炸 | 传说 | 范围技能命中 3 个以上目标时额外爆炸一次 |
| 空间折叠弹 | 神话 | 范围技能边缘伤害不再衰减 |

---

## 12. 低血狂暴流派

适合妖兽、佣兵、狂战类职业。

| 血量比例 | 状态 |
|---|---|
| 70% 以下 | 轻微狂暴 |
| 50% 以下 | 狂暴 |
| 30% 以下 | 濒死狂暴 |
| 10% 以下 | 极限状态 |

公式：

```text
MissingHpRatio = 1 - CurrentHP / MaxHP
DamageBonus = MissingHpRatio * BerserkScale
AttackSpeedBonus = MissingHpRatio * SpeedScale
```

| 名称 | 稀有度 | 效果 |
|---|---|---|
| 受伤怒火 | 普通 | 每损失 10% 生命，攻击力 +1% |
| 野兽濒死感 | 稀有 | 生命低于 40% 时攻速 +15% |
| 血线反扑 | 史诗 | 生命低于 30% 时获得吸血 |
| 狂怒不死 | 传说 | 生命低于 20% 时获得 3 秒免死，冷却 45 秒 |
| 末日野性 | 神话 | 生命越低，攻击、攻速、暴击同时提高，但治疗效果降低 |

---

## 13. 召唤流派

### 13.1 召唤物来源

| 来源 | 示例 |
|---|---|
| 技能 | 召唤无人机、召唤藤蔓、召唤幽魂 |
| 击杀 | 击杀后生成虫群 |
| 受击 | 护盾受击生成反击无人机 |
| 房间模块 | 机库、虫巢舱、灵魂舱 |
| 套装 | 无人机套、孢子套 |
| 职业 | 机械工程师、虫母、灵媒 |

### 13.2 召唤物继承规则

```text
SummonAttack = OwnerAttack * InheritAttackRate
SummonHP = OwnerMaxHP * InheritHPRate
SummonDuration = BaseDuration * (1 + SummonDurationBonus)
```

| 召唤物 | 攻击继承 | 生命继承 |
|---|---:|---:|
| 小型无人机 | 25% | 15% |
| 战斗无人机 | 45% | 30% |
| 藤蔓 | 20% | 50% |
| 虫群 | 15% | 10% |
| 幽魂 | 35% | 20% |
| 临时炮台 | 60% | 80% |

### 13.3 召唤流词条

| 名称 | 效果 |
|---|---|
| 微型机群 | 战斗开始召唤 2 个小无人机 |
| 孢子幼体 | 击杀中毒目标生成小孢子 |
| 亡魂跟随 | 击杀后召唤幽魂 |
| 虫巢增殖 | 召唤物死亡时有概率分裂 |
| 炮台部署 | 进入房间后部署临时炮台 |
| 无人机维修链 | 无人机攻击时概率给友军回血 |
| 召唤物献祭 | 召唤物死亡时给主人恢复能量 |

---

## 14. 掠夺与经济流派

这个流派适合桌面挂机，因为它能提升长期收益。

核心玩法：

- 增加资源掉落。
- 提高稀有装备概率。
- 提高俘虏概率。
- 提高敌舰部件拆解产出。
- 战斗中可能触发额外事件。

掉落公式联动：

```text
FinalDropScore =
    PlanetRarityScore * 0.3
    + EnemyShipRarityScore * 0.25
    + EnemyUnitRarityScore * 0.25
    + PlayerLootBonus * 0.2
```

掠夺流可以提高 PlayerLootBonus，但不能无限提高：

```text
PlayerLootBonus = min(PlayerLootBonus, LootBonusCap)
LootBonusCap = 100
```

| 名称 | 稀有度 | 效果 |
|---|---|---|
| 废料嗅觉 | 普通 | 战斗结束材料 +5% |
| 黑箱扫描 | 稀有 | 敌舰部件碎片掉率 +8% |
| 活体捕捉器 | 稀有 | 俘虏概率 +5% |
| 高级拆解协议 | 史诗 | 敌舰核心部件有概率额外掉落蓝图碎片 |
| 星盗幸运币 | 史诗 | 掉落品数量 +1 的概率提高 |
| 黑市收藏家 | 传说 | 战斗结束有概率触发黑市交易事件 |
| 宇宙掠夺王印 | 神话 | 首次击败高稀有敌舰时额外抽取一次传说池 |

---

## 15. 词条稀有度规则

| 稀有度 | 颜色建议 | 设计定位 |
|---|---|---|
| 普通 | 白/灰 | 小数值提升 |
| 优秀 | 绿 | 明确方向的小增强 |
| 稀有 | 蓝 | 形成小流派 |
| 史诗 | 紫 | 改变战斗节奏 |
| 传说 | 橙 | 形成核心 BD |
| 神话 | 红/彩 | 改变规则，有明显代价或上限 |

每个装备/技能/单位最多拥有：

| 品质 | 主词条 | 副词条 | 特殊词条 |
|---|---:|---:|---:|
| 普通 | 1 | 0 | 0 |
| 优秀 | 1 | 1 | 0 |
| 稀有 | 1 | 2 | 0 |
| 史诗 | 1 | 3 | 1 |
| 传说 | 1 | 4 | 1 |
| 神话 | 2 | 4 | 1-2 |

高稀有词条应该具备至少一种特征：

1. 改变触发方式。
2. 改变资源转换。
3. 增加新行为。
4. 允许跨流派联动。
5. 增加新的风险收益。

---

## 16. 词条库扩展表

### 16.1 攻击间隔类

| ID | 名称 | 稀有度 | 效果 | 标签 |
|---|---|---|---|---|
| AS_001 | 轻量扳机 | 普通 | 攻击间隔 -5% | AttackSpeed |
| AS_002 | 快速装填 | 普通 | 远程攻击间隔 -7% | AttackSpeed,Ranged |
| AS_003 | 刀锋润滑 | 普通 | 近战攻击间隔 -6% | AttackSpeed,Melee |
| AS_004 | 连发枪机 | 稀有 | 攻击间隔 -10%，命中 -2% | AttackSpeed |
| AS_005 | 虫群节拍 | 稀有 | 召唤物攻击间隔 -15% | AttackSpeed,Summon |
| AS_006 | 星尘快手 | 史诗 | 击杀后攻击间隔 -30%，持续 3 秒 | AttackSpeed,Kill |
| AS_007 | 过载连射 | 史诗 | 攻击间隔 -18%，会积累过热 | AttackSpeed,Overheat |
| AS_008 | 零点连射 | 传说 | 攻击间隔 -25%，击中触发概率 +10% | AttackSpeed,Hit |
| AS_009 | 极限频率核心 | 神话 | 攻击间隔 -30%，每秒消耗护盾 | AttackSpeed,Shield |

### 16.2 击杀类

| ID | 名称 | 稀有度 | 效果 | 标签 |
|---|---|---|---|---|
| KILL_001 | 掠血本能 | 普通 | 击杀恢复 3% 最大生命 | Kill,Heal |
| KILL_002 | 战斗续航 | 普通 | 击杀恢复 5 能量 | Kill,Energy |
| KILL_003 | 小型殉爆 | 稀有 | 击杀造成 70% 攻击力爆炸 | Kill,Explosion |
| KILL_004 | 野兽吞噬 | 稀有 | 击杀恢复 5% 最大生命，妖兽额外 +2% | Kill,Heal,Beast |
| KILL_005 | 毒囊破裂 | 稀有 | 击杀中毒目标释放毒雾 | Kill,Poison,Area |
| KILL_006 | 猎杀节奏 | 史诗 | 击杀后技能冷却 -10% | Kill,Cooldown |
| KILL_007 | 虚空坍缩 | 史诗 | 击杀生成延迟虚空爆炸 | Kill,Void,Explosion |
| KILL_008 | 血肉盛宴 | 传说 | 连续击杀回血递增，最多 5 层 | Kill,Heal,Stack |
| KILL_009 | 连锁殉爆 | 传说 | 爆炸击杀可继续爆炸，最多 2 次 | Kill,Explosion,Chain |
| KILL_010 | 杀戮连锁协议 | 神话 | 每 3 次击杀刷新主技能并获得霸体 | Kill,Cooldown,SuperArmor |

### 16.3 击中类

| ID | 名称 | 稀有度 | 效果 | 标签 |
|---|---|---|---|---|
| HIT_001 | 微量吸收 | 普通 | 击中 8% 概率回血 | Hit,Heal |
| HIT_002 | 战意升温 | 普通 | 击中概率自身伤害 +3%，最多 5 层 | Hit,Damage,Stack |
| HIT_003 | 毒刺 | 普通 | 击中概率中毒 | Hit,Poison |
| HIT_004 | 装甲破口 | 稀有 | 击中概率让目标易伤 | Hit,Vulnerability |
| HIT_005 | 连续校准 | 稀有 | 连续击中同目标提高暴击率 | Hit,Crit,Stack |
| HIT_006 | 活性藤刺 | 稀有 | 植物单位击中回血概率提高 | Hit,Heal,Plant |
| HIT_007 | 弱点透视 | 史诗 | 每第 5 次击中同目标造成真实伤害 | Hit,TrueDamage |
| HIT_008 | 生命窃取矩阵 | 传说 | 击中回血溢出转护盾 | Hit,Heal,Shield |
| HIT_009 | 歼灭标记 | 传说 | 击中概率标记目标，友军伤害提高 | Hit,Mark,Team |
| HIT_010 | 无限火控链 | 神话 | 击中概率复制上次命中的部分伤害 | Hit,CopyDamage |

### 16.4 护盾类

| ID | 名称 | 稀有度 | 效果 | 标签 |
|---|---|---|---|---|
| SHIELD_001 | 加厚能量板 | 普通 | 最大护盾 +8% | Shield |
| SHIELD_002 | 反冲电弧 | 普通 | 护盾被击中时反击电伤 | Shield,Counter |
| SHIELD_003 | 晶体外壳 | 稀有 | 护盾 +12%，护盾存在时抗性 +5% | Shield,Resist |
| SHIELD_004 | 护盾尖刺 | 稀有 | 近战敌人攻击护盾会反伤 | Shield,Counter |
| SHIELD_005 | 护盾冲锤 | 稀有 | 撞击时护盾转化为伤害 | Shield,Collision |
| SHIELD_006 | 晶刺折射 | 史诗 | 护盾受远程攻击概率反射弹体 | Shield,Reflect |
| SHIELD_007 | 破盾震爆 | 史诗 | 护盾破裂时范围爆炸 | Shield,Explosion |
| SHIELD_008 | 不破晶壁 | 传说 | 护盾首次破裂时恢复 30% | Shield,Recover |
| SHIELD_009 | 万象回弹 | 神话 | 护盾受到伤害储存为反击能量 | Shield,Counter,Charge |

### 16.5 撞击类

| ID | 名称 | 稀有度 | 效果 | 标签 |
|---|---|---|---|---|
| COL_001 | 重骨冲击 | 普通 | 撞击伤害 +12% | Collision |
| COL_002 | 短距猛撞 | 普通 | 冲锋距离 +1 格 | Collision,Dash |
| COL_003 | 撞击回血 | 稀有 | 撞击命中 20% 概率回血 | Collision,Heal |
| COL_004 | 撞击吸盾 | 稀有 | 撞击命中恢复护盾 | Collision,Shield |
| COL_005 | 破门专家 | 稀有 | 对舱门/障碍撞击伤害 +50% | Collision,Boarding |
| COL_006 | 墙面粉碎 | 史诗 | 撞墙造成二次伤害 | Collision,Wall |
| COL_007 | 连环撞击 | 史诗 | 撞击击退目标，碰到其他敌人扩散伤害 | Collision,Chain |
| COL_008 | 狂兽蛮冲 | 传说 | 冲锋期间霸体，撞击伤害 +80% | Collision,Beast |
| COL_009 | 流星盾甲 | 神话 | 冲锋距离越长，撞击伤害越高 | Collision,Shield |

### 16.6 异常类

| ID | 名称 | 稀有度 | 效果 | 标签 |
|---|---|---|---|---|
| DOT_001 | 毒刺 | 普通 | 击中概率中毒 | Poison |
| DOT_002 | 点燃弹头 | 普通 | 击中概率燃烧 | Burn |
| DOT_003 | 腐蚀弹 | 稀有 | 击中降低护甲 | Corrosion |
| DOT_004 | 麻痹电弧 | 稀有 | 击中降低攻速和移速 | Paralyze |
| DOT_005 | 毒雾孢子 | 史诗 | 技能命中留下毒雾 | Poison,Area |
| DOT_006 | 高温扩散 | 史诗 | 燃烧概率传染附近敌人 | Burn,Spread |
| DOT_007 | 裂解印记 | 史诗 | 击中施加虚空裂解 | Void |
| DOT_008 | 百层毒腺 | 传说 | 中毒满层后引爆 | Poison,Detonate |
| DOT_009 | 黑洞残响 | 神话 | 裂解引爆后牵引敌人 | Void,Control |

---

## 17. 流派组合示例

### 17.1 机械机枪流

推荐组件：

- 机械单位
- 枪炮机械主职业
- 枪手副职业
- 高频机枪武器
- 击中回血词条
- 击中增伤词条
- 过热散热词条
- 远程弹体套装

核心玩法：

```text
高攻速 -> 高频击中 -> 叠加增伤 -> 击中回血 -> 持续站桩输出
```

弱点：怕反伤护盾、怕高护甲、怕沉默/缴械。

### 17.2 妖兽击杀爆发流

推荐组件：

- 妖兽单位
- 狂兽主职业
- 武师副职业
- 近战高伤武器
- 击杀回血
- 击杀爆炸
- 低血狂暴
- 撞击回血

核心玩法：

```text
冲入敌群 -> 低血狂暴 -> 击杀回血 -> 击杀爆炸 -> 连锁清场
```

弱点：打单体 Boss 时需要击中回血补强，容易被控制。

### 17.3 植物毒藤续航流

推荐组件：

- 植物生命
- 藤蔓主职业
- 医师/毒师副职业
- 击中中毒
- 击中回血
- 中毒引爆
- 治疗藤蔓

核心玩法：

```text
捆绑控制 -> 中毒叠层 -> 击中回血 -> 毒爆清场 -> 治疗藤蔓续航
```

弱点：爆发慢，怕毒抗高的敌人。

### 17.4 晶体护盾撞击流

推荐组件：

- 晶体生命或机械盾墙
- 盾墙机械主职业
- 守卫副职业
- 高护盾装备
- 撞击回盾
- 护盾反击
- 破盾震爆

核心玩法：

```text
堆护盾 -> 冲锋撞击 -> 回盾 -> 护盾受击反击 -> 破盾爆炸
```

弱点：怕真实伤害、怕减速和定身。

### 17.5 虚空击杀坍缩流

推荐组件：

- 虚空单位
- 裂隙主职业
- 法师副职业
- 击杀虚空爆炸
- 裂解印记
- 范围扩张
- 黑洞牵引

核心玩法：

```text
施加裂解 -> 击杀坍缩 -> 牵引敌人 -> 连锁范围爆发
```

弱点：需要成型词条，早期清怪效率不稳定。

---

## 18. 自动战斗 AI 适配

### 18.1 单位流派识别

每个单位根据装备、技能、词条计算流派评分。

```text
BuildScore[Kill] = KillAffixCount * 10 + KillTriggerPower
BuildScore[Hit] = HitAffixCount * 10 + AttackSpeedScore
BuildScore[Shield] = ShieldAffixCount * 10 + ShieldValueScore
BuildScore[Collision] = CollisionAffixCount * 10 + DashSkillScore
```

最高分作为主流派。

### 18.2 AI 行为策略

| 流派 | AI 策略 |
|---|---|
| 攻速击中流 | 优先攻击高血量目标，保持持续命中 |
| 击杀爆炸流 | 优先攻击低血量密集目标 |
| 击杀回血流 | 生命低时优先补刀小怪 |
| 护盾流 | 站前排，吸引火力 |
| 护盾撞击流 | 寻找直线路径冲锋 |
| 异常流 | 优先给未中异常的目标挂状态 |
| 范围流 | 等待敌人聚集再释放技能 |
| 召唤流 | 保持安全距离，优先补召唤物 |
| 掠夺流 | 优先攻击带稀有标签的敌人 |

### 18.3 目标选择公式

```text
TargetScore =
    LowHpWeight * (1 - TargetHpPercent)
    + DensityWeight * NearbyEnemyCount
    + ThreatWeight * TargetThreat
    + RarityWeight * TargetRarityScore
    + TypeCounterWeight * CounterScore
```

| 流派 | LowHp | Density | Threat | Rarity |
|---|---:|---:|---:|---:|
| 击杀爆炸 | 高 | 高 | 中 | 低 |
| 击杀回血 | 高 | 中 | 中 | 低 |
| 攻速击中 | 低 | 低 | 高 | 中 |
| 掠夺流 | 中 | 低 | 中 | 高 |
| 范围流 | 低 | 高 | 中 | 中 |

---

## 19. UI 显示设计

### 19.1 单位详情界面新增“流派标签”

```text
角色详情弹窗
├── 左侧：角色模型/Icon
├── 中部：属性/装备/技能
├── 右侧：流派标签面板
```

流派标签示例：

```text
主流派：击杀爆炸
副流派：低血狂暴 / 撞击回血
触发核心：OnKill / OnCollision
关键词条：连锁殉爆、血肉盛宴、狂兽蛮冲
```

### 19.2 词条详情 Tooltip

Tooltip 需要显示：

1. 触发条件。
2. 概率。
3. 内置冷却。
4. 是否受触发系数影响。
5. 可联动标签。
6. 是否能被召唤物触发。
7. 是否能触发连锁击杀。

示例：

```text
连锁殉爆
稀有度：传说
触发：击杀敌人
效果：造成 180% 攻击力 + 目标最大生命 5% 的范围伤害
范围：2.8 格
连锁：爆炸击杀可继续触发，最多 2 次
限制：每次连锁伤害衰减 50%
标签：击杀 / 爆炸 / 范围
```

### 19.3 战斗信息界面新增“触发统计”

```text
战斗统计
├── 总伤害
├── 承受伤害
├── 治疗量
├── 护盾吸收
├── 击杀数
├── 触发统计
│   ├── 击中回血触发 36 次
│   ├── 击杀爆炸触发 8 次
│   ├── 护盾反击触发 12 次
│   ├── 撞击回血触发 3 次
│   └── 中毒跳伤 145 次
└── 流派贡献
    ├── 击杀类伤害 31%
    ├── 击中类伤害 22%
    ├── 异常伤害 18%
    └── 召唤伤害 12%
```

### 19.4 装备筛选新增“流派筛选”

装备背包筛选：

- 攻速
- 击杀
- 击中
- 护盾
- 撞击
- 异常
- 范围
- 召唤
- 掠夺
- 治疗

### 19.5 自动配置推荐

```text
如果单位拥有 3 个以上 Kill 标签词条：
    推荐“击杀流装备”
如果单位攻击间隔小于 0.5 秒：
    推荐“击中类词条”
如果单位最大护盾高于生命 70%：
    推荐“护盾类词条”
```

推荐 UI：

```text
推荐搭配：
1. 你当前单位适合【击中回血流】
2. 建议装备：高攻速武器、击中回血、击中增伤
3. 当前缺少：触发概率、治疗加成
```

---

## 20. Unity2D 实现结构

### 20.1 CombatEvent

```csharp
public enum CombatEventType
{
    OnBattleStart,
    OnAttackStart,
    OnProjectileSpawn,
    OnHit,
    OnCrit,
    OnKill,
    OnDamageTaken,
    OnShieldHit,
    OnShieldBreak,
    OnCollision,
    OnStatusApplied,
    OnStatusTick,
    OnLowHP,
    OnBattleEnd
}

public class CombatEventContext
{
    public CombatEventType EventType;
    public CombatUnit Source;
    public CombatUnit Target;
    public SkillRuntime Skill;
    public DamageInfo DamageInfo;
    public float ProcCoefficient = 1f;
    public Vector2 Position;
    public string[] Tags;
}
```

### 20.2 AffixConfig

```csharp
[Serializable]
public class AffixConfig
{
    public string AffixId;
    public string Name;
    public RarityType Rarity;
    public CombatEventType Trigger;
    public EffectType EffectType;
    public float BaseValue;
    public float Chance;
    public float InternalCooldown;
    public int MaxStack;
    public string[] Tags;
    public bool CanTriggerBySummon;
    public bool CanTriggerChainKill;
}
```

### 20.3 AffixRuntime

```csharp
public class AffixRuntime
{
    public AffixConfig Config;
    public float LastTriggerTime;
    public int CurrentStack;

    public bool CanTrigger(CombatEventContext ctx)
    {
        if (Time.time < LastTriggerTime + Config.InternalCooldown)
            return false;

        float chance = Config.Chance * ctx.ProcCoefficient;
        return UnityEngine.Random.value <= chance;
    }

    public void Trigger(CombatEventContext ctx)
    {
        LastTriggerTime = Time.time;
        EffectResolver.Resolve(Config, ctx);
    }
}
```

### 20.4 EffectResolver

```csharp
public static class EffectResolver
{
    public static void Resolve(AffixConfig affix, CombatEventContext ctx)
    {
        switch (affix.EffectType)
        {
            case EffectType.HealSelf:
                HealSelf(affix, ctx);
                break;
            case EffectType.Explosion:
                CreateExplosion(affix, ctx);
                break;
            case EffectType.AddBuff:
                AddBuff(affix, ctx);
                break;
            case EffectType.AddStatus:
                AddStatus(affix, ctx);
                break;
            case EffectType.RecoverShield:
                RecoverShield(affix, ctx);
                break;
            case EffectType.CounterDamage:
                CounterDamage(affix, ctx);
                break;
        }
    }
}
```

### 20.5 触发管理器

```csharp
public class CombatEventBus
{
    public void Dispatch(CombatEventContext ctx)
    {
        List<AffixRuntime> affixes = ctx.Source.GetAffixesByTrigger(ctx.EventType);

        foreach (var affix in affixes)
        {
            if (affix.CanTrigger(ctx))
            {
                affix.Trigger(ctx);
            }
        }
    }
}
```

---

## 21. 配置表示例

### 21.1 击杀爆炸词条

```json
{
  "affixId": "KILL_009",
  "name": "连锁殉爆",
  "rarity": "Legendary",
  "trigger": "OnKill",
  "effectType": "Explosion",
  "chance": 1.0,
  "baseValue": 1.8,
  "extraParams": {
    "radius": 2.8,
    "targetMaxHpScale": 0.05,
    "chainDepth": 2,
    "chainDamageDecay": 0.5,
    "canTriggerChainKill": true
  },
  "internalCooldown": 0.1,
  "tags": ["Kill", "Explosion", "Area", "Chain"]
}
```

### 21.2 击中回血词条

```json
{
  "affixId": "HIT_008",
  "name": "生命窃取矩阵",
  "rarity": "Legendary",
  "trigger": "OnHit",
  "effectType": "HealSelf",
  "chance": 0.2,
  "baseValue": 0.6,
  "extraParams": {
    "scaleByAttack": true,
    "overflowToShield": true,
    "overflowRate": 0.8
  },
  "internalCooldown": 0.4,
  "tags": ["Hit", "Heal", "Shield"]
}
```

### 21.3 护盾撞击词条

```json
{
  "affixId": "COL_009",
  "name": "流星盾甲",
  "rarity": "Mythic",
  "trigger": "OnCollision",
  "effectType": "CollisionDamage",
  "chance": 1.0,
  "baseValue": 1.0,
  "extraParams": {
    "shieldToDamageScale": 0.35,
    "speedToDamageScale": 18,
    "distanceBonusMax": 3.0,
    "recoverShieldByDamage": 0.15
  },
  "internalCooldown": 1.0,
  "tags": ["Collision", "Shield", "Dash"]
}
```

---

## 22. 平衡规则

### 22.1 必须限制的高危组合

| 组合 | 风险 | 限制 |
|---|---|---|
| 超高攻速 + 击中回血 | 无限回血 | 触发系数、内置冷却 |
| 击杀爆炸 + 连锁爆炸 | 无限清屏 | 连锁层数、伤害衰减 |
| 击杀刷新技能 + 击杀爆炸 | 无限技能 | 刷新内置冷却 |
| 护盾反击 + 高减伤 | 站着反死所有敌人 | 反击内置冷却 |
| 撞击回血 + 无限冲锋 | 无限续航 | 冲锋冷却、撞击冷却 |
| 召唤物击中触发本体词条 | 指数增长 | 召唤物触发效率降低 |
| 毒爆 + 传染 + 范围扩大 | 全图传染 | 传染次数上限 |

### 22.2 叠层上限

| 类型 | 推荐上限 |
|---|---:|
| 自身增伤叠层 | 10 |
| 易伤叠层 | 8 |
| 中毒 | 30 |
| 燃烧 | 10 |
| 腐蚀 | 15 |
| 虚空裂解 | 8 |
| 攻速叠层 | 8 |
| 护盾反击蓄能 | 100 能量 |
| 低血狂暴层数 | 根据血量连续计算，不使用层数 |

---

## 23. 掉落与流派关联

### 23.1 流派掉落池

| 掉落池 | 代表词条 |
|---|---|
| 攻速池 | 攻击间隔、连发、过热 |
| 击杀池 | 击杀回血、击杀爆炸、击杀刷新 |
| 击中池 | 击中回血、击中增伤、击中异常 |
| 护盾池 | 护盾值、护盾反击、破盾效果 |
| 撞击池 | 冲锋、撞击回血、撞击回盾 |
| 异常池 | 中毒、燃烧、腐蚀、裂解 |
| 召唤池 | 无人机、虫群、藤蔓、幽魂 |
| 掠夺池 | 掉落、俘虏、拆解、交易 |

### 23.2 星球类型影响掉落

| 星球类型 | 更容易掉落 |
|---|---|
| 机械废墟星 | 攻速、机械、护盾、无人机 |
| 毒雾沼泽星 | 中毒、植物、回血、异常 |
| 虚空裂隙星 | 虚空、击杀爆炸、裂解 |
| 晶体矿脉星 | 护盾、反击、晶体装备 |
| 兽巢荒原星 | 撞击、低血狂暴、击杀回血 |
| 贸易中转星 | 掠夺、交易、收益词条 |
| 战争残骸星 | 爆炸、弹体、范围词条 |

### 23.3 敌人流派影响掉落

```text
If EnemyMainBuildTag == "Shield":
    ShieldAffixDropWeight += 30%
```

---

## 24. 美术与表现差异

| 流派 | 视觉表现 |
|---|---|
| 攻速 | 枪口残影、连发线条、快速刀影 |
| 击杀回血 | 红色/绿色生命粒子回流 |
| 击杀爆炸 | 尸体中心爆裂、星尘冲击波 |
| 击中回血 | 每次触发有细小吸收线连接目标 |
| 击中增伤 | 目标身上出现裂纹/标记 |
| 护盾 | 半透明能量罩、晶体壳 |
| 护盾反击 | 护盾表面电弧反弹 |
| 护盾撞击 | 冲锋路径拖尾、盾面冲击波 |
| 撞击回血 | 撞击后绿色回流粒子 |
| 中毒 | 绿色毒泡、腐蚀雾 |
| 燃烧 | 橙红火焰、热浪 |
| 腐蚀 | 酸液滴落、装甲溶解 |
| 虚空 | 紫黑裂缝、空间塌陷 |
| 召唤 | 小型单位从舱口/裂缝/孢子中出现 |
| 掠夺 | 掉落品闪光、扫描线 |

桌面游戏表现限制：

1. 默认小窗中不要有满屏闪光。
2. 大爆炸效果在小窗内缩放。
3. 桌面低性能模式下隐藏部分粒子。
4. 自动战斗长时间运行时，特效数量需要池化。
5. 气泡和状态不要遮挡角色太多。

---

## 25. MVP 实现优先级

### 25.1 第一阶段必须实现

1. 触发器系统。
2. 词条配置表。
3. `OnHit`、`OnKill`、`OnShieldHit`、`OnCollision` 四个核心触发器。
4. 攻击间隔流。
5. 击杀回血。
6. 击杀爆炸。
7. 击中回血。
8. 击中增伤。
9. 护盾反击。
10. 撞击伤害。
11. 单位详情流派标签。
12. 战斗统计触发次数。

### 25.2 第二阶段实现

1. 异常叠层。
2. 中毒、燃烧、腐蚀、虚空裂解。
3. 护盾破裂。
4. 撞击回血/回盾。
5. 击杀刷新技能。
6. 召唤物。
7. 掉落池和流派关联。
8. AI 按流派选择目标。

### 25.3 第三阶段实现

1. 连锁爆炸。
2. 异常引爆。
3. 黑洞牵引。
4. 传说/神话词条。
5. 自动搭配推荐。
6. 套装与流派图鉴。
7. 战斗回放统计。
8. 词条洗练和锁定。

---

## 26. 总结

本系统的核心不是简单添加几个新数值，而是建立一套可扩展的“战斗流派词条框架”。

最终目标：

1. 玩家获得一个新单位时，会关心它的技能和流派潜力。
2. 玩家获得一件高稀有装备时，会因为特殊词条改变培养方向。
3. 玩家搭建飞船模块时，会考虑是否支持当前流派。
4. 自动战斗时，单位能按照自身流派做出合理行为。
5. 后续每次版本更新，只需要新增词条和流派标签，就能扩展大量玩法。

推荐优先做出的 6 个最有爽感流派：

1. 攻速击中回血流。
2. 击杀爆炸连锁流。
3. 妖兽低血击杀回血流。
4. 晶体护盾撞击流。
5. 植物中毒回血流。
6. 虚空裂解坍缩流。

这 6 个流派差异明显、表现直观、适合桌面挂机自动战斗，也方便后续围绕装备、职业、套装、飞船部件继续扩展。
