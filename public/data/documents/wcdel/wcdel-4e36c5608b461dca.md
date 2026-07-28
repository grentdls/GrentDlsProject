# 战斗系统详细设计文档

> 项目类型：2D 俯视角开放世界轻 ARPG  
> 当前章节：战斗系统详细设计  
> 前置章节：人物基础操作系统设计  
> 目标：定义玩家、敌人、技能、伤害、受击、预警、反馈、Boss 战与战斗数据配置的完整规则。

---

## 1. 战斗系统设计目标

本游戏战斗不是重度动作游戏，也不是纯数值挂机。  
战斗核心应该是：

```text
看见敌人
→ 看见攻击预警
→ 移动 / 翻滚躲避
→ 普攻 / 技能反击
→ 获得清晰命中反馈
→ 拿到经验、金币、装备
→ 继续探索
```

设计目标：

1. **低学习成本**：玩家不用记复杂连招，也能快速上手。
2. **高反馈密度**：每一次攻击、命中、暴击、击杀都要有明确反馈。
3. **强可读性**：敌人攻击必须提前预警，玩家知道自己为什么受伤。
4. **轻策略性**：通过技能、装备、元素、走位产生差异，而不是堆复杂机制。
5. **适合移动端**：战斗节奏短，按钮少，信息清楚。
6. **可扩展**：后期可以增加元素、状态、Boss 阶段、装备词条、精英怪词缀。
7. **可配置**：所有战斗参数尽量数据表化，减少写死逻辑。

---

## 2. 战斗核心循环

### 2.1 单场普通战斗循环

```text
玩家进入敌人警戒范围
→ 敌人锁定玩家
→ 敌人移动接近 / 保持距离
→ 敌人释放攻击预警
→ 玩家移动或翻滚躲避
→ 玩家普攻或技能命中敌人
→ 敌人受击、掉血、播放反馈
→ 敌人死亡
→ 掉落金币 / 经验 / 装备
→ 玩家拾取奖励
```

### 2.2 单场 Boss 战循环

```text
进入 Boss 区域
→ 锁定战斗区域
→ Boss 登场
→ Boss 阶段 1：基础攻击组合
→ Boss 血量下降到阈值
→ Boss 阶段 2：增加攻击范围 / 新技能
→ Boss 血量继续下降
→ Boss 阶段 3：高频预警 / 召唤小怪 / 大招
→ 击败 Boss
→ 解锁剧情 / 区域 / 能力 / 高级装备
```

### 2.3 战斗节奏目标

| 战斗类型 | 推荐时长 | 目标体验 |
|---|---:|---|
| 野外小怪 | 5~15 秒 | 快速清理 |
| 小怪群 | 15~30 秒 | 技能爽感 |
| 精英怪 | 30~60 秒 | 小挑战 |
| 普通洞穴终点怪 | 45~90 秒 | 副本结束压力 |
| 区域 Boss | 2~4 分钟 | 机制记忆 + 爽快击杀 |
| 主线 Boss | 3~6 分钟 | 阶段变化 + 奖励高潮 |

---

## 3. 战斗参与对象

### 3.1 战斗单位分类

| 类型 | 说明 |
|---|---|
| Player | 玩家角色 |
| Enemy_Normal | 普通敌人 |
| Enemy_Elite | 精英敌人 |
| Enemy_Boss | Boss 敌人 |
| Summon_Player | 玩家召唤物 |
| Summon_Enemy | 敌人召唤物 |
| Projectile | 投射物 |
| AreaEffect | 地面范围效果 |
| Trap | 陷阱 |
| Breakable | 可破坏物 |
| NeutralCreature | 中立生物，可选 |

### 3.2 阵营规则

| 阵营 | 可攻击对象 |
|---|---|
| Player | Enemy、Breakable |
| Enemy | Player、PlayerSummon |
| Neutral | 默认不可攻击，特殊任务可切换 |
| Environment | 可伤害所有阵营，可选 |

### 3.3 战斗目标选择

玩家默认不需要手动锁定敌人。  
攻击方向由移动方向、最后朝向、轻微自动辅助决定。

敌人目标选择优先级：

```text
1. 最近攻击自己的玩家
2. 警戒范围内最近玩家
3. 玩家召唤物，可选
4. 回到出生点
```

---

## 4. 属性系统

### 4.1 玩家基础属性

| 属性 | 说明 |
|---|---|
| Level | 等级 |
| Exp | 当前经验 |
| MaxHP | 最大生命 |
| CurrentHP | 当前生命 |
| MaxMP | 最大魔法 / 法力 |
| CurrentMP | 当前魔法 |
| Attack | 物理攻击 |
| Magic | 魔法攻击 |
| Armor | 护甲 |
| MoveSpeed | 移动速度 |
| RollCooldown | 翻滚冷却 |
| CritRate | 暴击率 |
| CritDamage | 暴击伤害倍率 |
| AttackSpeed | 普攻速度倍率 |
| SkillCooldownRate | 技能冷却缩减 |
| ElementPower | 元素伤害加成，可选 |
| StatusResistance | 状态抗性，可选 |

### 4.2 敌人基础属性

| 属性 | 说明 |
|---|---|
| EnemyLevel | 敌人等级 |
| MaxHP | 最大生命 |
| Attack | 攻击力 |
| Magic | 魔法伤害 |
| Armor | 护甲 |
| MoveSpeed | 移动速度 |
| DetectRange | 警戒范围 |
| AttackRange | 攻击范围 |
| AttackCooldown | 攻击冷却 |
| KnockbackResistance | 击退抗性 |
| StunResistance | 硬直抗性 |
| ExpReward | 经验奖励 |
| GoldReward | 金币奖励 |
| DropTableID | 掉落表 ID |

### 4.3 推荐玩家基础成长

```text
MaxHP = 100 + Level * 20 + 装备生命
MaxMP = 60 + Level * 5 + 装备魔法上限
Attack = 10 + Level * 2 + 装备攻击
Magic = 8 + Level * 2 + 装备魔法
Armor = 装备护甲
CritRate = 基础暴击率 + 装备暴击率
CritDamage = 150% + 装备暴击伤害
```

推荐初始值：

| 属性 | 初始值 |
|---|---:|
| MaxHP | 120 |
| MaxMP | 60 |
| Attack | 12 |
| Magic | 10 |
| Armor | 0 |
| CritRate | 5% |
| CritDamage | 150% |
| MoveSpeed | 4.2 |
| RollCooldown | 0.65s |

---

## 5. 伤害类型

### 5.1 基础伤害类型

| 伤害类型 | 说明 | 典型来源 |
|---|---|---|
| Physical | 物理伤害 | 普攻、冲撞、爪击 |
| Magical | 魔法伤害 | 法术、魔法弹 |
| TrueDamage | 真实伤害 | 特殊机制，少用 |
| PercentHP | 百分比生命伤害 | Boss 机制，少用 |
| Environmental | 环境伤害 | 毒沼、岩浆、机关 |

### 5.2 元素伤害类型

| 元素 | 表现 | 常见附加效果 |
|---|---|---|
| Fire | 火焰 | 灼烧持续伤害 |
| Ice | 冰霜 | 减速 / 冰冻 |
| Lightning | 雷电 | 连锁 / 麻痹 |
| Poison | 毒 | 持续伤害 |
| Holy | 圣光 | 治疗 / 对暗系增伤 |
| Dark | 暗影 | 吸血 / 诅咒 |
| Neutral | 无属性 | 普通伤害 |

### 5.3 伤害标签

每次伤害事件都应该带标签，方便装备、被动、任务、统计使用。

```text
Melee
Ranged
Skill
Projectile
Area
DoT
Critical
Elemental
BossDamage
TrapDamage
Environmental
```

示例：

```text
玩家火环术命中敌人：
DamageType = Magical
ElementType = Fire
Tags = Skill, Area, Elemental
```

---

## 6. 伤害计算流程

### 6.1 标准伤害流程

```text
创建 DamageEvent
→ 判断攻击方与受击方阵营
→ 判断受击方是否无敌
→ 判断命中是否有效
→ 读取技能 / 普攻基础伤害
→ 计算攻击方属性加成
→ 计算暴击
→ 计算元素克制
→ 计算护甲 / 魔抗减伤
→ 计算状态增伤 / 减伤
→ 计算最终伤害
→ 扣除生命
→ 触发受击反馈
→ 触发击杀逻辑
```

### 6.2 DamageEvent 数据结构

```text
AttackerID
TargetID
SourceID
SourceType
BaseDamage
DamageType
ElementType
DamageTags
AttackPowerScale
MagicPowerScale
CanCrit
CritRateBonus
CritDamageBonus
KnockbackPower
HitStunPower
StatusEffectList
Position
Direction
```

### 6.3 物理伤害公式

```text
RawDamage = BaseDamage + Attacker.Attack * AttackPowerScale

ArmorReduction = 100 / (100 + Target.Armor)

FinalDamage = RawDamage * ArmorReduction
```

示例：

```text
BaseDamage = 20
玩家 Attack = 30
AttackPowerScale = 1.0
敌人 Armor = 25

RawDamage = 20 + 30 * 1.0 = 50
ArmorReduction = 100 / 125 = 0.8
FinalDamage = 50 * 0.8 = 40
```

### 6.4 魔法伤害公式

```text
RawDamage = BaseDamage + Attacker.Magic * MagicPowerScale

MagicReduction = 100 / (100 + Target.MagicResist)

FinalDamage = RawDamage * MagicReduction
```

如果 MVP 不做 MagicResist，可以统一用 Armor 减伤：

```text
FinalDamage = RawDamage * 100 / (100 + Target.Armor)
```

### 6.5 暴击公式

```text
IsCrit = Random(0, 1) < CritRate

If IsCrit:
    FinalDamage = FinalDamage * CritDamage
```

推荐默认：

```text
基础暴击率 = 5%
基础暴击伤害 = 150%
暴击率上限 = 60%
暴击伤害上限 = 300%
```

### 6.6 等级压制，可选

轻量 ARPG 可以加入轻微等级差修正，但不要太强。

```text
LevelDiff = Attacker.Level - Target.Level
LevelModifier = Clamp(1 + LevelDiff * 0.03, 0.7, 1.3)
FinalDamage = FinalDamage * LevelModifier
```

说明：

- 玩家低 10 级打怪，大约造成 70% 伤害。
- 玩家高 10 级打怪，大约造成 130% 伤害。
- 不要做成完全打不动，否则开放世界探索会很挫败。

### 6.7 最终伤害取整

```text
FinalDamage = Max(1, Round(FinalDamage))
```

如果是 DoT，可以允许小数累积，但显示时取整。

---

## 7. 元素克制系统

### 7.1 MVP 建议

MVP 阶段不强制做复杂克制，只做元素表现和状态效果。  
正式版再加入克制矩阵。

### 7.2 克制矩阵

| 攻击元素 \ 防御元素 | Fire | Ice | Lightning | Poison | Holy | Dark | Neutral |
|---|---:|---:|---:|---:|---:|---:|---:|
| Fire | 0.8 | 1.3 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
| Ice | 1.3 | 0.8 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
| Lightning | 1.0 | 1.0 | 0.8 | 1.2 | 1.0 | 1.0 | 1.0 |
| Poison | 1.0 | 1.0 | 1.0 | 0.8 | 0.8 | 1.2 | 1.0 |
| Holy | 1.0 | 1.0 | 1.0 | 1.2 | 0.8 | 1.5 | 1.0 |
| Dark | 1.0 | 1.0 | 1.0 | 1.0 | 1.5 | 0.8 | 1.0 |
| Neutral | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |

### 7.3 克制显示

当产生克制时，跳字表现要不同：

| 情况 | 表现 |
|---|---|
| 克制伤害 | 伤害数字放大，显示“弱点”或元素破碎特效 |
| 被抵抗 | 伤害数字变小，显示“抵抗” |
| 免疫 | 显示“免疫”，不扣血 |
| 暴击 + 克制 | 使用最强反馈，数字更大，元素爆点更明显 |

---

## 8. 状态效果系统

### 8.1 状态分类

| 状态 | 类型 | 效果 |
|---|---|---|
| Burn | 负面 | 持续火焰伤害 |
| Freeze | 负面 | 无法移动 / 攻击，短时间 |
| Chill | 负面 | 减速 |
| Shock | 负面 | 间歇麻痹或连锁伤害 |
| Poison | 负面 | 持续毒伤 |
| Bleed | 负面 | 移动时额外伤害，可选 |
| Stun | 负面 | 短暂眩晕 |
| Slow | 负面 | 降低移动速度 |
| DefenseDown | 负面 | 降低护甲 |
| AttackUp | 正面 | 提高攻击 |
| MagicUp | 正面 | 提高魔法 |
| Shield | 正面 | 吸收伤害 |
| Regen | 正面 | 持续回血 |
| Haste | 正面 | 提高移动 / 攻击速度 |

### 8.2 状态数据结构

```text
StatusID
StatusType
ElementType
Duration
TickInterval
MaxStack
StackRule
ApplyChance
EffectValue
CanRefreshDuration
CanStackValue
VFX
SFX
Icon
```

### 8.3 状态叠加规则

推荐三种：

| 规则 | 说明 |
|---|---|
| Refresh | 重新刷新持续时间，不叠层 |
| StackValue | 数值叠加，持续时间刷新 |
| Independent | 每层独立计时 |

MVP 推荐：

```text
Burn / Poison：最多 3 层，刷新持续时间
Slow / Chill：不叠层，只刷新时间
Stun / Freeze：Boss 有抗性，不能连续控制
Buff：同类只保留最高值
```

### 8.4 状态效果推荐参数

| 状态 | 持续时间 | 效果 | 触发频率 |
|---|---:|---|---:|
| Burn | 4s | 每秒造成 20% Magic 火伤 | 1s |
| Poison | 6s | 每秒造成 15% Magic 毒伤 | 1s |
| Chill | 3s | 移速 -30% | 持续 |
| Freeze | 1.2s | 无法行动 | 持续 |
| Shock | 2s | 每秒 1 次小电击 | 1s |
| Stun | 0.8s | 无法行动 | 持续 |
| Shield | 5s | 吸收固定伤害 | 持续 |
| Regen | 5s | 每秒回血 | 1s |

### 8.5 Boss 状态抗性

Boss 不能被无限控制。

| 状态 | Boss 效果 |
|---|---|
| Burn | 有效，但伤害降低 50% |
| Poison | 有效，但伤害降低 50% |
| Chill | 有效，但减速降低为 15% |
| Freeze | 无效，改为短暂硬直 0.2s |
| Stun | 无效，改为打断弱技能，可选 |
| Knockback | 无效或极低 |
| DefenseDown | 有效，但数值减半 |

---

## 9. 命中判定系统

### 9.1 判定类型

| 判定 | 用途 |
|---|---|
| Circle | 圆形范围，爆炸、治疗、光环 |
| Sector | 扇形范围，普攻、爪击、喷火 |
| Rectangle | 矩形范围，冲刺、地刺、剑气 |
| Line | 直线检测，雷电、激光 |
| Projectile | 投射物，火球、箭矢 |
| AreaDuration | 持续区域，毒圈、火圈 |
| CollisionBody | 身体碰撞，冲撞怪 |

### 9.2 玩家普攻判定

推荐普攻使用扇形判定：

```text
以玩家位置为圆心
朝攻击方向
半径 AttackRange
角度 AttackAngle
筛选敌人 Hurtbox
```

参数：

```text
AttackRange = 1.1
AttackAngle = 100°
HitFrameStart = 0.12s
HitFrameEnd = 0.20s
```

### 9.3 敌人近战判定

敌人近战建议使用预警 + 矩形 / 扇形判定。

```text
敌人进入攻击距离
→ 停下
→ 面向玩家
→ 显示红色预警区
→ 预警 0.6s
→ 在预警区域造成伤害
→ 后摇 0.4s
```

### 9.4 投射物判定

投射物流程：

```text
生成投射物
→ 按方向移动
→ 碰撞敌人 / 玩家 / 墙体
→ 命中后触发伤害
→ 播放命中特效
→ 销毁或穿透
```

投射物参数：

| 参数 | 说明 |
|---|---|
| Speed | 飞行速度 |
| Lifetime | 最大存在时间 |
| PierceCount | 穿透次数 |
| HitInterval | 对同一目标重复命中间隔 |
| HomingStrength | 追踪强度 |
| ExplosionRadius | 爆炸半径 |
| DestroyOnWall | 撞墙是否销毁 |

### 9.5 持续区域判定

例如火圈、毒圈、冰霜地面。

```text
区域创建
→ 每 TickInterval 检测范围内目标
→ 对目标造成伤害 / 状态
→ 到 Duration 后销毁
```

推荐参数：

```text
TickInterval = 0.5s 或 1.0s
同一目标每次 Tick 只结算一次
区域特效要能清楚显示边界
```

---

## 10. 攻击预警系统

### 10.1 预警设计目标

预警系统是战斗可读性的核心。  
玩家应该在攻击发生前看到：

```text
攻击从哪里来
范围有多大
多久后生效
自己能不能躲开
```

### 10.2 预警类型

| 类型 | 表现 | 用途 |
|---|---|---|
| CircleWarning | 圆形红圈 | 爆炸、落雷、Boss 砸地 |
| SectorWarning | 扇形红区 | 喷火、爪击、横扫 |
| RectWarning | 矩形红区 | 冲撞、地刺、激光 |
| LineWarning | 细长线 | 激光、雷电 |
| RingWarning | 环形区域 | Boss 冲击波 |
| FollowWarning | 跟随玩家的预警 | 锁定落雷、追踪技能 |
| MultiWarning | 多段预警 | Boss 连续大招 |

### 10.3 预警流程

```text
敌人决定释放技能
→ 计算目标区域
→ 生成预警图形
→ 预警图形从淡到亮 / 填充进度
→ 到达触发时间
→ 造成伤害
→ 播放攻击特效
→ 移除预警图形
```

### 10.4 预警参数

| 参数 | 推荐值 |
|---|---:|
| SmallEnemyWarningTime | 0.45~0.7s |
| EliteWarningTime | 0.6~1.0s |
| BossSmallSkillWarningTime | 0.8~1.2s |
| BossBigSkillWarningTime | 1.2~2.0s |
| WarningFadeInTime | 0.1~0.2s |
| WarningColor | 红 / 橙红 |
| WarningAlphaStart | 25% |
| WarningAlphaEnd | 70% |

### 10.5 预警视觉规则

预警必须遵守：

```text
红色代表危险
橙色代表即将触发
边界必须清楚
不要被技能特效盖住
预警层级低于角色，但高于地面
Boss 大招预警可以带屏幕边缘提示
```

### 10.6 预警音效

| 音效 | 触发 |
|---|---|
| Warning_Start | 预警出现 |
| Warning_Charge | 预警蓄力中，可选 |
| Warning_Trigger | 攻击触发瞬间 |
| Boss_Ult_Warning | Boss 大招预警 |

普通小怪不要每个预警都播放很响的声音，否则战场会吵。  
Boss 大招必须有明显音效。

---

## 11. 受击系统

### 11.1 受击流程

```text
伤害命中目标
→ 目标检查无敌 / 护盾
→ 扣除护盾或生命
→ 播放受击动画
→ 播放受击音效
→ 播放受击特效
→ 显示伤害数字
→ 应用击退 / 硬直
→ 检查死亡
```

### 11.2 受击强度等级

| 等级 | 条件 | 表现 |
|---|---|---|
| LightHit | 普通小伤害 | 小白闪、小音效 |
| MediumHit | 普通技能 / 暴击 | 明显白闪、轻震屏 |
| HeavyHit | Boss 技能 / 高伤害 | 强受击、较大震屏 |
| BreakHit | 破防 / 打断 | 特殊破碎特效 |
| FatalHit | 致死 | 死亡动画 |

### 11.3 受击动画规则

普通小怪：

```text
受击时播放 Hit 动画 0.15~0.25s
可被轻微击退
死亡时播放死亡动画或爆散特效
```

精英怪：

```text
小攻击只白闪，不频繁打断
强攻击才播放明显 Hit
击退减半
```

Boss：

```text
不播放普通受击硬直
只播放局部白闪 / 受击特效
特定破防阶段播放大硬直
```

### 11.4 无敌帧规则

玩家无敌来源：

| 来源 | 时长 |
|---|---:|
| 翻滚无敌帧 | 0.04s~0.24s |
| 受击后保护 | 0.6s |
| 复活保护 | 2.0s |
| 特殊技能护盾 | 由技能决定 |

敌人无敌来源：

| 来源 | 时长 |
|---|---:|
| 出生保护 | 0.2s |
| Boss 转阶段 | 1.0~2.0s |
| 剧情锁血 | 由剧情决定 |

---

## 12. 硬直与击退系统

### 12.1 设计目标

硬直和击退用于增强打击感，但不能破坏节奏。  
小怪可以被打得明显，Boss 不能被玩家无限控住。

### 12.2 硬直计算

```text
FinalHitStun = HitStunPower * (1 - Target.StunResistance)
```

推荐：

| 目标 | StunResistance |
|---|---:|
| 普通小怪 | 0 |
| 远程怪 | 0.1 |
| 精英怪 | 0.5 |
| Boss | 0.9~1.0 |

### 12.3 击退计算

```text
FinalKnockback = KnockbackPower * (1 - Target.KnockbackResistance)
```

推荐：

| 目标 | KnockbackResistance |
|---|---:|
| 小怪 | 0 |
| 大型小怪 | 0.3 |
| 精英怪 | 0.6 |
| Boss | 1.0 |

### 12.4 击退方向

优先级：

```text
1. DamageEvent.Direction
2. 攻击者到受击者方向
3. 技能配置方向
```

### 12.5 防止连续硬直

目标被打中后进入短暂硬直保护：

```text
HitStunProtectionTime = 0.15s
```

在保护时间内：

```text
仍然受伤
仍然显示跳字
不重复播放强受击动画
不重复刷新击退
```

---

## 13. 死亡与击杀系统

### 13.1 敌人死亡流程

```text
HP <= 0
→ 进入 Dead 状态
→ 停止 AI
→ 禁用 Hurtbox
→ 播放死亡动画 / 爆散特效
→ 播放死亡音效
→ 掉落经验 / 金币 / 物品
→ 通知任务系统
→ 通知战斗统计系统
→ 延迟销毁对象
```

### 13.2 玩家死亡流程

```text
HP <= 0
→ 进入 Dead 状态
→ 禁止输入
→ 播放死亡动画
→ 敌人脱战或停止攻击
→ 弹出死亡界面
→ 选择复活
→ 回到最近城镇 / 检查点
→ 恢复部分生命
→ 复活保护
```

### 13.3 击杀奖励

| 奖励 | 说明 |
|---|---|
| Exp | 经验球，自动吸附 |
| Gold | 金币，自动吸附 |
| Equipment | 根据掉落表概率出现 |
| QuestItem | 任务需要时掉落 |
| Material | 后期强化用，可选 |
| BossReward | 固定奖励，不能漏 |

### 13.4 掉落防重复规则

任务物品：

```text
如果玩家已拥有任务物品，不再重复掉落
如果任务未激活，可选择不掉落
如果任务要求多个，则按计数掉落
```

Boss 奖励：

```text
首次击杀必掉关键物品
重复击杀掉普通奖励
```

---

## 14. 战斗反馈系统

### 14.1 反馈层级

每次命中至少包含：

```text
1. 受击对象白闪
2. 命中特效
3. 命中音效
4. 伤害数字
```

重要命中额外包含：

```text
5. 击退
6. 震屏
7. 暂停帧
8. 元素爆点
9. 暴击特殊音效
```

### 14.2 Hit Stop 暂停帧

暂停帧可以显著增强打击感。

| 事件 | 暂停时长 |
|---|---:|
| 普攻命中小怪 | 0.03s |
| 普攻暴击 | 0.05s |
| 技能命中 | 0.04s |
| 大技能命中 | 0.07s |
| Boss 被破防 | 0.1s |

移动端注意不要太长，否则卡顿感明显。

### 14.3 震屏

| 事件 | 强度 | 时长 |
|---|---:|---:|
| 普攻命中 | 0.04 | 0.04s |
| 暴击 | 0.1 | 0.08s |
| 小技能命中 | 0.08 | 0.08s |
| 大技能命中 | 0.18 | 0.15s |
| 玩家受击 | 0.1 | 0.08s |
| Boss 落地重击 | 0.25 | 0.2s |
| Boss 死亡 | 0.3 | 0.3s |

### 14.4 白闪规则

| 对象 | 白闪时长 |
|---|---:|
| 小怪 | 0.08~0.12s |
| 精英怪 | 0.06~0.1s |
| Boss | 0.04~0.06s，局部或低强度 |
| 玩家 | 0.08s |

白闪不能覆盖元素状态表现太久。

---

## 15. 伤害数字系统

### 15.1 跳字类型

| 类型 | 表现 |
|---|---|
| 普通物理伤害 | 白色 / 浅黄，正常大小 |
| 魔法伤害 | 蓝紫或元素色 |
| 火焰伤害 | 橙红，带小火苗图标 |
| 冰霜伤害 | 浅蓝，带冰晶图标 |
| 雷电伤害 | 黄色，带电弧 |
| 毒伤害 | 绿色，带毒泡 |
| 暴击 | 红 / 金描边，数字更大 |
| 治疗 | 绿色，向上飘 |
| 护盾吸收 | 蓝白，显示“护盾” |
| 免疫 | 灰色，显示“免疫” |
| 抵抗 | 灰色小字，显示“抵抗” |
| 弱点 | 放大，显示“弱点” |
| 玩家受伤 | 红色，屏幕附近更明显 |

### 15.2 跳字动画强度

| 伤害等级 | 条件 | 动画 |
|---|---|---|
| Small | 小于目标最大生命 5% | 小幅上飘 |
| Normal | 5%~15% | 普通弹跳上飘 |
| Big | 15%~30% | 放大弹出 |
| Huge | 大于 30% | 强弹跳 + 轻震 |
| Critical | 暴击 | 大号字体 + 描边 + 快速弹出 |
| Kill | 击杀一击 | 数字停留略久 |

### 15.3 多段伤害合并

持续伤害容易刷屏，需要合并规则。

```text
同一个目标
同一种 DoT
0.5s 内多次伤害
→ 可以合并显示为一次累计数字
```

AOE 命中多个目标：

```text
每个目标显示自己的伤害
但音效只播放主命中音效一次
```

### 15.4 跳字位置

```text
默认从目标头顶 / 身体中心上方弹出
多个数字随机偏移 X 轴
Boss 伤害数字从 Boss 身体上方多个点弹出
玩家受伤数字从玩家上方弹出，并可额外在 HUD 血条处闪烁
```

---

## 16. 敌人 AI 战斗规则

### 16.1 普通近战怪

```text
Idle
→ 巡逻
→ 玩家进入警戒范围
→ 追踪玩家
→ 进入攻击距离
→ 停下并预警
→ 近战攻击
→ 后摇
→ 继续追踪
```

参数：

| 参数 | 推荐值 |
|---|---:|
| DetectRange | 5 |
| ChaseRange | 8 |
| AttackRange | 1.2 |
| WarningTime | 0.55s |
| AttackCooldown | 1.5s |
| MoveSpeed | 2.5 |

### 16.2 远程怪

```text
保持距离
→ 玩家过近则后退
→ 玩家在射程内则预警
→ 发射投射物
→ 换位
```

参数：

| 参数 | 推荐值 |
|---|---:|
| PreferredRange | 4.5 |
| MinRange | 2.5 |
| ProjectileSpeed | 5 |
| WarningTime | 0.7s |
| AttackCooldown | 2.0s |

### 16.3 法师怪

```text
站定施法
→ 在玩家脚下生成圆形预警
→ 延迟爆炸
→ 间隔移动
```

特点：

```text
血量低
攻击范围大
预警明显
适合训练玩家走位
```

### 16.4 飞行怪

```text
无视部分地形
→ 快速接近
→ 短停
→ 俯冲攻击
→ 拉开距离
```

注意：

- 飞行怪不能太多，否则移动端压力过大。
- 飞行怪被命中时需要有明显浮空受击表现。

### 16.5 精英怪

精英怪 = 普通怪 + 强化词缀 + 更高反馈。

可选词缀：

| 词缀 | 效果 |
|---|---|
| 强壮 | 生命 +50% |
| 狂暴 | 低血时攻击加快 |
| 火焰 | 攻击附带灼烧 |
| 冰霜 | 攻击附带减速 |
| 召唤 | 定期召唤小怪 |
| 护盾 | 周期性获得护盾 |
| 分裂 | 死亡后分裂小怪 |
| 闪现 | 短距离瞬移 |

---

## 17. Boss 战系统

### 17.1 Boss 设计原则

Boss 战要做到：

```text
攻击动作清楚
红圈预警清楚
阶段变化清楚
可通过翻滚规避
每个 Boss 有 1 个记忆点
死亡奖励强
```

不要做成纯血厚怪。

### 17.2 Boss 基础结构

```text
BossID
BossName
Level
HP
PhaseList
SkillList
Weakness
Resistances
RewardList
UnlockAfterDefeat
```

### 17.3 Boss 阶段

推荐三阶段：

| 阶段 | 血量 | 规则 |
|---|---:|---|
| Phase 1 | 100%~70% | 基础攻击 |
| Phase 2 | 70%~35% | 增加新技能 / 攻击范围 |
| Phase 3 | 35%~0% | 攻击频率提高 / 大招 / 召唤 |

### 17.4 Boss 技能组合示例

#### 蜂王 Boss

| 技能 | 类型 | 说明 |
|---|---|---|
| NeedleShot | 远程扇形弹幕 | 多根毒针 |
| HoneyPool | 地面持续区域 | 生成减速蜂蜜 |
| SummonBee | 召唤 | 召唤小蜜蜂 |
| DiveSting | 矩形冲刺 | 红色长条预警后俯冲 |
| QueenRage | 阶段技能 | 低血时攻速提升 |

#### 石头巨人 Boss

| 技能 | 类型 | 说明 |
|---|---|---|
| GroundSlam | 圆形预警 | 砸地冲击波 |
| RockThrow | 投射物 | 投掷石块 |
| StoneLine | 矩形地刺 | 直线地刺 |
| ArmorUp | Buff | 提升护甲 |
| BreakState | 破防 | 连续命中后短暂倒地 |

### 17.5 Boss 破防机制

可选系统：

```text
玩家持续攻击 Boss
→ Boss BreakGauge 增加
→ 达到阈值
→ Boss 进入 Break 状态
→ 停止行动 3~5s
→ 玩家获得输出窗口
```

参数：

| 参数 | 推荐值 |
|---|---:|
| BreakGaugeMax | 100 |
| 普攻增加 | 5 |
| 小技能增加 | 10 |
| 大技能增加 | 20 |
| BreakDuration | 3s |
| BreakCooldown | 15s |

MVP 可以不做破防，正式版建议做。

---

## 18. 战斗区域与脱战

### 18.1 野外脱战

敌人有出生点和追击范围。

```text
玩家进入警戒范围
→ 敌人追击
→ 玩家离开 ChaseRange
→ 敌人停止追击
→ 回到出生点
→ 生命可缓慢恢复，可选
```

推荐：

| 参数 | 值 |
|---|---:|
| DetectRange | 5 |
| ChaseRange | 8 |
| ReturnSpeed | 3 |
| HPRecoverAfterReturn | 100% 或不恢复 |

### 18.2 副本房间战斗

副本内可以采用房间锁定：

```text
玩家进入战斗房间
→ 关闭出口 / 显示封锁
→ 生成敌人
→ 击败所有敌人
→ 打开出口
```

适合洞穴、遗迹、Boss 房。

### 18.3 Boss 区域锁定

```text
玩家进入 Boss 区
→ 触发 Boss
→ 封锁入口
→ 战斗中不可离开
→ Boss 死亡后解除封锁
```

如果玩家死亡：

```text
Boss 重置
玩家回到检查点
```

---

## 19. 技能战斗规则

### 19.1 技能基本字段

```text
SkillID
SkillName
SkillType
ElementType
BaseDamage
AttackScale
MagicScale
ManaCost
Cooldown
CastTime
HitShape
HitRadius
HitAngle
HitLength
Duration
TickInterval
CanCrit
StatusEffect
VFX
SFX
CameraShake
HitStop
```

### 19.2 技能类型

| 类型 | 说明 |
|---|---|
| InstantAround | 以玩家为中心瞬发 |
| ForwardSector | 前方扇形 |
| ForwardLine | 前方直线 |
| Projectile | 投射物 |
| TargetArea | 指定区域 |
| GroundZone | 地面持续区域 |
| SelfBuff | 自身强化 |
| Heal | 治疗 |
| Summon | 召唤 |

### 19.3 技能命中规则

```text
技能生效帧
→ 创建 Hitbox
→ 检测目标
→ 对每个目标创建 DamageEvent
→ 应用伤害 / 状态
→ 播放命中特效
```

持续技能：

```text
创建 AreaEffect
→ 每 TickInterval 检测
→ 对范围内目标结算
→ 到持续时间结束销毁
```

### 19.4 技能冷却与蓝量

```text
按下技能时检查：
1. 是否解锁
2. 是否冷却结束
3. 蓝量是否足够
4. 当前状态是否允许释放
```

蓝量扣除时机推荐：

```text
技能生效帧扣蓝
```

原因：  
如果施法前摇被打断，可以不扣蓝，玩家体验更好。

---

## 20. 装备与战斗关系

### 20.1 装备影响项

装备可以影响：

```text
Attack
Magic
Armor
MaxHP
MaxMP
CritRate
CritDamage
MoveSpeed
AttackSpeed
SkillCooldown
ElementDamage
StatusChance
LifeSteal
GoldBonus
ExpBonus
```

### 20.2 推荐早期装备词条

MVP 不要一开始做太多词条，先做：

```text
攻击 +
魔法 +
生命 +
护甲 +
暴击率 +
技能伤害 +
移动速度
```

### 20.3 装备流派

| 流派 | 战斗特点 |
|---|---|
| 物理流 | 普攻伤害高，技能弱 |
| 魔法流 | 技能伤害高，蓝量依赖强 |
| 坦克流 | 容错高，输出低 |
| 暴击流 | 爆发高，不稳定 |
| 元素流 | 状态效果强 |
| 回复流 | 持续战斗能力强 |

---

## 21. 战斗 UI

### 21.1 HUD 战斗信息

| UI | 说明 |
|---|---|
| 玩家血条 | 左上或底部 |
| 玩家蓝条 | 技能消耗资源 |
| 技能按钮 CD | 显示冷却进度 |
| 技能蓝量不足 | 按钮变暗 / 闪红 |
| 受击方向提示 | 可选，屏幕边缘红光 |
| Boss 血条 | Boss 战顶部显示 |
| 任务击杀进度 | 战斗时即时更新 |
| 状态图标 | 玩家 Buff / Debuff |

### 21.2 敌人血条

普通小怪：

```text
受击后显示血条
脱战或满血后隐藏
```

精英怪：

```text
默认显示血条
显示精英标识
```

Boss：

```text
屏幕顶部大型血条
显示阶段标记
显示 Boss 名称
```

### 21.3 预警 UI 层级

```text
地面
> 地面装饰
> 攻击预警
> 地面技能残留
> 角色
> 命中特效
> 伤害数字
> 屏幕 UI
```

---

## 22. 音效设计

### 22.1 战斗音效分类

```text
普攻挥砍
普攻命中
暴击
敌人受击
敌人死亡
玩家受击
玩家死亡
技能起手
技能释放
技能命中
元素状态
Boss 技能预警
Boss 咆哮
Boss 死亡
掉落
拾取
升级
```

### 22.2 音效优先级

| 优先级 | 类型 |
|---|---|
| 高 | 玩家受击、死亡、Boss 大招、升级、稀有掉落 |
| 中 | 玩家攻击命中、技能释放、暴击 |
| 低 | 小怪受击、小怪脚步、普通掉落 |

### 22.3 防止声音混乱

```text
同类命中音效 0.05s 内只播放一次
小怪死亡音效限制最大同时播放数
AOE 命中多个目标只播放一次主命中音
Boss 音效优先级高，可以压低普通环境音
```

---

## 23. 2D 战斗特效设计

### 23.1 攻击特效

| 特效 | 用途 |
|---|---|
| SlashArc | 普攻刀光 / 爪痕 |
| HitSpark | 命中火花 |
| CritBurst | 暴击爆点 |
| ArmorHit | 命中护甲 |
| ShieldBreak | 护盾破碎 |
| KnockbackDust | 击退尘土 |

### 23.2 元素特效

| 元素 | 特效 |
|---|---|
| Fire | 火焰爆点、燃烧残留 |
| Ice | 冰晶破碎、寒气 |
| Lightning | 电弧、闪光线 |
| Poison | 毒泡、绿色雾气 |
| Holy | 金色光点、治愈环 |
| Dark | 黑紫烟雾、暗影裂纹 |

### 23.3 敌人死亡特效

| 敌人类型 | 死亡表现 |
|---|---|
| 普通小怪 | 小烟雾 + 掉落 |
| 飞行怪 | 下坠 + 烟雾 |
| 法师怪 | 魔法爆散 |
| 精英怪 | 大烟雾 + 光点 |
| Boss | 多段爆炸 + 慢动作 + 奖励光柱 |

### 23.4 特效可读性规则

```text
红色只用于危险预警和敌方攻击
绿色用于治疗 / 毒，需要靠图标区分
金色用于奖励 / 暴击 / 圣光
蓝色用于冰 / 魔法
紫色用于暗影 / 稀有
```

避免玩家技能特效和敌人预警都用强红色，否则玩家分不清危险来源。

---

## 24. 战斗数据表

### 24.1 DamageType.csv

```csv
ID,Name,Category,DefaultColor,CanCrit,UseArmor,UseMagicResist
Physical,物理,Base,White,True,True,False
Magical,魔法,Base,Blue,True,False,True
TrueDamage,真实,Special,Gray,False,False,False
Environmental,环境,Special,Orange,False,False,False
```

### 24.2 Element.csv

```csv
ID,Name,Color,DefaultStatus,VFXPrefix,SFXPrefix
Neutral,无属性,White,,VFX_Neutral,SFX_Neutral
Fire,火,Orange,Burn,VFX_Fire,SFX_Fire
Ice,冰,Blue,Chill,VFX_Ice,SFX_Ice
Lightning,雷,Yellow,Shock,VFX_Lightning,SFX_Lightning
Poison,毒,Green,Poison,VFX_Poison,SFX_Poison
Holy,圣光,Gold,Regen,VFX_Holy,SFX_Holy
Dark,暗影,Purple,Curse,VFX_Dark,SFX_Dark
```

### 24.3 PlayerCombatConfig.csv

```csv
Key,Value,Description
BaseCritRate,0.05,基础暴击率
BaseCritDamage,1.5,基础暴击伤害
CritRateMax,0.6,暴击率上限
CritDamageMax,3.0,暴击伤害上限
BaseHitStop,0.03,基础命中暂停帧
BaseCameraShake,0.04,基础震屏强度
DamageInvincibleTime,0.6,玩家受击无敌时间
DefaultArmorReductionConst,100,护甲减伤常数
MinimumDamage,1,最小伤害
```

### 24.4 Enemy.csv

```csv
ID,Name,EnemyType,Level,HP,Attack,Magic,Armor,MoveSpeed,DetectRange,AttackRange,AttackCooldown,ExpReward,GoldReward,AIType,DropTableID
E001,小史莱姆,Normal,1,80,10,0,0,2.4,5,1.1,1.5,12,5,Melee,Drop_E001
E002,小蝙蝠,Normal,3,65,14,0,0,3.2,5,1.0,1.3,20,8,Flying,Drop_E002
E003,蘑菇法师,Normal,5,100,8,18,0,2.0,6,5.0,2.2,35,12,Caster,Drop_E003
E101,蜂王守卫,Elite,12,650,35,0,15,2.3,6,1.4,1.8,180,60,EliteMelee,Drop_E101
```

### 24.5 EnemySkill.csv

```csv
ID,Name,EnemyID,Shape,DamageType,Element,BaseDamage,AttackScale,WarningTime,Cooldown,Range,Radius,Angle,Length,VFX,SFX
ES001,爪击,E001,Sector,Physical,Neutral,12,1.0,0.5,1.5,1.2,0,90,0,VFX_Claw,SFX_Claw
ES002,毒针,E002,Projectile,Physical,Poison,10,0.8,0.4,1.8,5,0.2,0,0,VFX_PoisonNeedle,SFX_Needle
ES003,魔法爆炸,E003,Circle,Magical,Fire,25,0,0.8,2.5,5,1.3,0,0,VFX_FireBurst,SFX_FireCast
```

### 24.6 Skill.csv

```csv
ID,Name,SkillType,Element,BaseDamage,AttackScale,MagicScale,ManaCost,Cooldown,CastTime,HitShape,Radius,Angle,Length,Duration,TickInterval,CanCrit,StatusID,VFX,SFX
S001,火环术,InstantAround,Fire,30,0,1.2,20,3,0.35,Circle,2.2,0,0,0,0,True,Burn,VFX_FireRing,SFX_FireRing
S002,雷光线,ForwardLine,Lightning,45,0,1.5,25,4,0.45,Rectangle,0.6,0,5,0,0,True,Shock,VFX_LightningLine,SFX_Lightning
S003,生命光,Heal,Holy,-50,0,1.0,30,8,0.4,Circle,0,0,0,0,0,False,Regen,VFX_Heal,SFX_Heal
```

### 24.7 StatusEffect.csv

```csv
ID,Name,Type,Element,Duration,TickInterval,MaxStack,StackRule,Value,ApplyChance,VFX,SFX,Icon
Burn,灼烧,Debuff,Fire,4,1,3,StackValue,0.2,1,VFX_Burn,SFX_Burn,Icon_Burn
Poison,中毒,Debuff,Poison,6,1,3,StackValue,0.15,1,VFX_Poison,SFX_Poison,Icon_Poison
Chill,寒冷,Debuff,Ice,3,0,1,Refresh,-0.3,1,VFX_Chill,SFX_Chill,Icon_Chill
Shield,护盾,Buff,Holy,5,0,1,Refresh,100,1,VFX_Shield,SFX_Shield,Icon_Shield
```

### 24.8 CombatFeedback.csv

```csv
Event,HitStop,CameraShake,ShakeTime,FlashTime,DamageNumberStyle,SFX,VFX
NormalHit,0.03,0.04,0.04,0.08,Normal,SFX_Hit,VFX_HitSpark
CriticalHit,0.05,0.1,0.08,0.1,Critical,SFX_Crit,VFX_CritBurst
WeaknessHit,0.05,0.12,0.08,0.1,Weakness,SFX_Weakness,VFX_Weakness
PlayerHit,0.02,0.1,0.08,0.08,PlayerDamage,SFX_PlayerHit,VFX_PlayerHit
BossBreak,0.1,0.2,0.15,0.12,Break,SFX_BossBreak,VFX_BossBreak
```

---

## 25. Unity 程序结构建议

### 25.1 Combat 模块目录

```text
Scripts/
  Combat/
    CombatManager.cs
    DamageEvent.cs
    DamageCalculator.cs
    DamageReceiver.cs
    Hitbox.cs
    Hurtbox.cs
    AttackWarning.cs
    Projectile.cs
    AreaEffect.cs
    StatusEffectController.cs
    KnockbackController.cs
    HitStopController.cs
    CameraShakeController.cs
    DamageNumberController.cs
    CombatFeedbackController.cs
```

### 25.2 关键组件职责

#### DamageEvent.cs

负责描述一次伤害事件。

```text
攻击者
受击者
伤害来源
基础伤害
伤害类型
元素类型
暴击规则
击退参数
状态效果
```

#### DamageCalculator.cs

负责计算最终伤害。

```text
基础伤害
属性加成
暴击
元素克制
护甲减伤
状态增伤
最终取整
```

#### DamageReceiver.cs

挂在所有可受伤对象上。

```text
接收 DamageEvent
检查无敌
扣除生命
播放受击反馈
触发死亡
```

#### Hitbox.cs

攻击判定。

```text
形状
范围
阵营
持续时间
命中次数
命中间隔
```

#### Hurtbox.cs

受击判定。

```text
所属单位
碰撞范围
是否可被命中
是否无敌
```

#### AttackWarning.cs

攻击预警。

```text
形状
持续时间
填充进度
触发时机
绑定目标
```

#### CombatFeedbackController.cs

统一控制：

```text
白闪
跳字
命中特效
命中音效
震屏
暂停帧
```

### 25.3 战斗调用流程

```text
PlayerCombat / EnemySkill
→ 创建 Hitbox
→ Hitbox 检测 Hurtbox
→ 创建 DamageEvent
→ DamageReceiver.ReceiveDamage(event)
→ DamageCalculator.Calculate(event)
→ 扣血
→ CombatFeedbackController.PlayFeedback(event)
→ 检查死亡
```

---

## 26. 性能优化规则

### 26.1 对象池

必须使用对象池的对象：

```text
伤害数字
命中特效
技能特效
投射物
掉落物
攻击预警
地面区域效果
敌人小怪，可选
```

### 26.2 检测频率

```text
普攻 Hitbox：只在命中帧检测
持续区域：按 TickInterval 检测
敌人寻路：不需要每帧重算
警戒检测：0.2s 一次即可
远距离敌人：休眠 AI
```

### 26.3 同屏上限

| 类型 | 建议上限 |
|---|---:|
| 普通敌人 | 12~20 |
| 精英怪 | 1~3 |
| 投射物 | 50 |
| 伤害数字 | 40 |
| 持续区域 | 10 |
| 掉落物 | 80 |

移动端要根据机型下调。

---

## 27. 战斗验收标准

### 27.1 基础攻击验收

- 玩家普攻能准确命中攻击方向上的敌人。
- 刀光方向和实际判定一致。
- 每次命中都有白闪、音效、特效、伤害数字。
- 攻击后摇能顺畅接移动或翻滚。
- 多个敌人同时命中时不会卡顿。

### 27.2 敌人攻击验收

- 敌人攻击前必须出现清晰预警。
- 玩家能通过移动或翻滚躲开预警攻击。
- 敌人不会无预警瞬间打中玩家，特殊极近身攻击除外。
- 敌人攻击后有明显后摇，玩家有反击窗口。
- 敌人不会全部堆在一起导致不可读。

### 27.3 伤害计算验收

- 普攻伤害受 Attack 影响。
- 技能伤害受 Magic 影响。
- 护甲能降低伤害。
- 暴击能正确放大伤害。
- 最终伤害不会小于 1。
- 伤害数字和实际扣血一致。

### 27.4 状态效果验收

- 灼烧 / 中毒能按 Tick 造成伤害。
- 减速能改变敌人移动速度。
- Boss 不会被无限冰冻 / 眩晕。
- 状态图标、特效和持续时间一致。
- 状态结束后属性恢复正常。

### 27.5 Boss 战验收

- Boss 血条正确显示。
- Boss 阶段切换稳定。
- Boss 大招预警清楚。
- Boss 死亡后掉落奖励且解除战斗区域。
- 玩家死亡后 Boss 能正确重置。

### 27.6 反馈验收

- 普通命中不飘。
- 暴击明显比普通攻击更爽。
- 大技能明显比小技能更强。
- 玩家受击足够明显，但不遮挡操作。
- 同屏大量跳字时仍然可读。

---

## 28. MVP 战斗内容配置

### 28.1 MVP 必做

```text
玩家普攻
玩家翻滚无敌
玩家受击 / 死亡
普通近战怪
普通远程怪
法师怪
红圈 / 矩形预警
圆形 AOE 技能
直线技能
治疗技能
暴击
护甲减伤
伤害数字
命中特效
掉落奖励
1 个 Boss
```

### 28.2 MVP 可暂缓

```text
完整元素克制
复杂装备词条
召唤物
破防系统
多个 Boss 阶段
怪物词缀
环境伤害
复杂状态抗性
二周目战斗词条
```

---

## 29. MVP 开发任务拆分

### 29.1 程序任务

```text
C01 DamageEvent 数据结构
C02 DamageCalculator 伤害计算
C03 Hitbox / Hurtbox 判定
C04 玩家普攻接入 DamageEvent
C05 敌人受击和死亡
C06 伤害数字
C07 命中特效和音效
C08 敌人近战 AI
C09 敌人攻击预警
C10 敌人远程投射物
C11 玩家受击 / 无敌帧
C12 翻滚躲避敌人攻击
C13 技能 Hitbox
C14 状态效果 Burn / Poison / Slow
C15 掉落奖励
C16 Boss 基础 AI
C17 Boss 血条
C18 战斗配置表读取
```

### 29.2 策划任务

```text
D01 制定玩家初始属性
D02 制定 1~15 级成长曲线
D03 配置 10 种普通敌人
D04 配置 3 种精英怪
D05 配置 3 个玩家技能
D06 配置 1 个 Boss
D07 配置基础掉落表
D08 配置伤害数字表现规则
D09 配置战斗反馈表
D10 配置预警时间和范围
```

### 29.3 美术任务

```text
A01 普攻刀光
A02 普攻命中特效
A03 暴击特效
A04 火焰技能特效
A05 雷电技能特效
A06 治疗技能特效
A07 敌人红圈预警
A08 敌人矩形预警
A09 敌人死亡特效
A10 Boss 登场特效
A11 Boss 大招预警
A12 伤害数字字体
A13 元素小图标
```

### 29.4 音频任务

```text
S01 普攻挥砍
S02 普攻命中
S03 暴击
S04 玩家受击
S05 敌人受击
S06 敌人死亡
S07 火焰技能
S08 雷电技能
S09 治疗技能
S10 预警提示
S11 Boss 咆哮
S12 Boss 大招
S13 Boss 死亡
S14 掉落金币
S15 获得装备
```

---

## 30. 推荐开发顺序

```text
第 1 步：玩家普攻打木桩，能扣血、跳字、白闪
第 2 步：加入普通近战怪，怪能追玩家
第 3 步：加入敌人红圈预警攻击
第 4 步：加入玩家翻滚无敌，确认能躲攻击
第 5 步：加入敌人死亡和掉落
第 6 步：加入远程怪和投射物
第 7 步：加入 3 个玩家技能
第 8 步：加入状态效果：灼烧、中毒、减速
第 9 步：加入精英怪
第 10 步：制作第一个 Boss
第 11 步：统一调整伤害、血量、冷却、预警时间
第 12 步：补齐音效、震屏、暂停帧、特效
```

---

## 31. 战斗调参建议

### 31.1 小怪调参

如果小怪太烦：

```text
降低移动速度
延长攻击预警
降低攻击频率
降低同屏数量
增加受击硬直
```

如果小怪太无聊：

```text
增加小怪组合
加入远程怪
加入法师怪
增加攻击范围变化
增加精英词缀
```

### 31.2 玩家手感调参

如果玩家攻击不爽：

```text
缩短攻击前摇
增强命中特效
增加 HitStop
提高小怪受击硬直
优化伤害数字动画
```

如果玩家太容易死：

```text
延长敌人预警时间
增加翻滚无敌帧
减少敌人攻击频率
提高初始生命
增加治疗技能
```

如果战斗太拖：

```text
降低敌人血量
提高玩家基础伤害
提高技能伤害
减少护甲减伤
增加暴击反馈
```

### 31.3 Boss 调参

Boss 太难：

```text
延长大招预警
减少连续攻击
增加攻击后摇
减少召唤小怪数量
增加玩家输出窗口
```

Boss 太简单：

```text
增加阶段变化
加入追踪预警
加入召唤物
加入场地危险区域
增加低血狂暴
```

---

## 32. 设计关键点总结

战斗系统最重要的是：

```text
1. 玩家必须看得懂敌人什么时候攻击
2. 玩家必须相信翻滚能躲掉攻击
3. 普攻命中必须爽
4. 技能必须比普攻更有爆发感
5. 小怪负责节奏，精英怪负责小挑战，Boss 负责记忆点
6. 伤害公式要简单，可控，可配置
7. 反馈层级要明确，不能所有攻击都一样响、一样亮
8. 预警颜色和玩家技能颜色要区分
9. Boss 不能只是血厚，要有阶段和招式变化
10. MVP 先把普攻、红圈、翻滚、跳字、掉落做好
```

最终目标：

```text
玩家看到红圈会躲
躲完会反击
反击后能看到清楚反馈
打死怪后马上有奖励
奖励让玩家想继续打下一组怪
```

这就是轻量开放世界 ARPG 战斗的核心闭环。
