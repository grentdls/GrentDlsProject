# 235 三类玩法词条系统：事件、数值参数、防递归与装备接入

## 1. 属性定义

### 环绕法球属性

```text
OrbitOrbCount
OrbitOrbMaxCount
OrbitRadius
OrbitAngularSpeed
OrbitDamage
OrbitCritChance
OrbitHitCooldown
OrbitCollisionRadius
OrbitDuration
OrbitElementConversion
```

### 御剑属性

```text
SwordCount
TemporarySwordCount
SwordMaxCount
SwordAttackInterval
SwordVolleySize
SwordLaunchSpeed
SwordReturnSpeed
SwordDamage
SwordCritChance
SwordPierce
SwordChain
SwordTargetRange
SwordGenerationChance
```

### 掉落球属性

```text
PickupDropChance
PickupDropMeterGain
PickupValue
PickupVacuumRadius
PickupVacuumSpeed
PickupLifeTime
PickupMergeLimit
HealthOrbValue
ManaOrbValue
ShieldOrbValue
PickupDamage
PickupBuffDuration
```

---

## 2. 词条层级

```text
基础数值词条
条件数值词条
触发词条
生成词条
转化词条
套装词条
传奇规则词条
关键天赋
```

---

## 3. 环绕法球随机词条示例

```text
环绕法球数量 +1
环绕半径 +12%
环绕速度 +18%
法球伤害 +25%
法球暴击率 +6%
法球对同一目标命中冷却 -10%
法球碰撞半径 +15%
拾取生命球后，法球转速提高 25%，持续 4 秒
每存在 3 个法球，获得 4% 伤害减免
法球命中燃烧敌人时扩散燃烧
```

---

## 4. 御剑随机词条示例

```text
御剑数量 +1
飞剑伤害 +24%
飞剑发射间隔 -10%
每次齐射额外发射 1 把
飞剑返回速度 +30%
飞剑穿透 +1
飞剑命中后有 20% 概率弹射一次
每累计发射 6 把飞剑，生成 1 把临时剑
飞剑击杀时有 15% 概率掉落剑意球
锁定目标时飞剑暴击率 +10%
```

---

## 5. 掉落球随机词条示例

```text
生命球恢复量 +20%
法力球恢复量 +20%
掉落球吸附范围 +2 米
掉落球存在时间 +5 秒
击杀敌人获得的生命球进度 +20%
拾取生命球时获得 3 秒吸血
拾取法力球时缩短随机技能冷却 0.4 秒
拾取护盾球时释放一次护盾冲击
满生命拾取生命球时转化为血爆
掉落球过期时自动飞向玩家
```

---

## 6. 部位分配建议

| 部位 | 环绕法球 | 御剑 | 掉落球 |
|---|---|---|---|
| 武器 | 法球伤害、元素转换 | 飞剑伤害、发射速度 | 击杀掉落概率 |
| 副手 | 法球数量、半径 | 御剑数量、返回 | 拾取护盾/法力 |
| 头盔 | 法球数量、技能等级 | 御剑数量、目标搜索 | 掉落球类型转换 |
| 胸甲 | 法球减伤、防御球 | 飞剑护体、拦截 | 过量恢复转护盾 |
| 手套 | 接触伤害、命中触发 | 发射间隔、暴击 | 拾取伤害触发 |
| 鞋子 | 环绕速度、移动联动 | 返回速度、移动发射 | 吸附范围、吸附速度 |
| 腰带 | 持续时间、临时数量 | 临时剑持续时间 | 掉落率、恢复值、药剂联动 |
| 戒指 | 元素法球、拾取联动 | 元素飞剑、击杀触发 | 生命/法力/元素球特化 |
| 项链 | 关键机制、数量上限 | 齐射、生成临时剑 | 过量转化、拾取连锁 |

---

## 7. 装备词条等级建议

```text
低阶 T5/T4：伤害、恢复量、吸附范围、小幅转速
中阶 T3：数量 +1、命中冷却、发射间隔、拾取触发
高阶 T2/T1：临时生成、元素联动、齐射、过量转化
T0/传奇：规则改写、环转剑、球转伤害、无限持续但有代价
```

低等级装备不要出现：

```text
法球数量 +3
御剑数量翻倍
拾取必定爆炸
发射飞剑无限生成飞剑
全屏吸附
```

---

## 8. 防递归规则

所有生成词条必须包含：

```text
triggerDepthLimit
sourceAffixId
generatedEntityTag
canGeneratedEntityTriggerSource
perSecondTriggerCap
activeEntityCap
```

示例：

```json
{
  "affixId": "AFF_SwordLaunch_CreateTempSword",
  "trigger": "OnSwordLaunch",
  "chance": 0.2,
  "effect": "CreateTemporarySword",
  "duration": 8.0,
  "activeEntityCap": 5,
  "generatedEntityTag": "GeneratedSword",
  "canGeneratedEntityTriggerSource": false,
  "triggerDepthLimit": 1
}
```

---

## 9. 共享转化词条

```text
拾取生命球时生成 1 个临时血法球
拾取法力球时生成 1 把临时符剑
环绕法球击杀时有概率掉落对应元素球
飞剑返回时吸收附近掉落球并获得强化
法球碰撞被飞剑标记的敌人时伤害提高
```

---

## 10. 构筑强度限制

建议软上限：

```text
常驻法球 12，极限 16
常驻御剑 20，极限 30
临时飞剑 8
同屏掉落球 50
每秒拾取伤害触发 8 次
每秒额外实体生成 12 次
```

超过软上限时：

```text
数量仍可提升，但转化为伤害/速度/价值
或进入第二环/合并显示
```
