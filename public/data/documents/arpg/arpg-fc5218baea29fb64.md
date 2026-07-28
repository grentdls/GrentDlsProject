# 170 伤害类型与元素属性体系：物理、火、冰、雷、毒、暗、圣、真伤

## 1. 伤害类型总表

| 类型 | 定位 | 防御对抗 | 常见异常 |
|---|---|---|---|
| 物理 Physical | 武器、近战、弓弩 | 护甲、格挡、闪避 | 流血、破甲 |
| 火焰 Fire | 爆发、燃烧、AOE | 火抗、元素抗 | 燃烧 |
| 冰冷 Cold | 控制、减速、防御 | 冰抗、控制抗 | 冰缓、冻结 |
| 闪电 Lightning | 暴击、连锁、高波动 | 雷抗、元素抗 | 感电、麻痹 |
| 毒素 Poison | 持续伤害、削弱 | 毒抗、持续伤害减免 | 中毒 |
| 暗影 Shadow | 诅咒、穿透、异常 | 暗抗、诅咒抗 | 衰弱、恐惧 |
| 神圣 Holy | 护盾、净化、对亡灵 | 圣抗、护盾 | 净化、审判 |
| 真实 True | 稳定、处决、机制伤害 | 特殊减免 | 无或特殊 |

---

## 2. 物理伤害

### 2.1 来源

```text
武器攻击
近战打击
弓弩射击
投掷武器
地刺
坠石
召唤物爪击
```

### 2.2 关联属性

```text
物理伤害增加
武器物理伤害增加
近战物理伤害增加
远程物理伤害增加
穿甲
破甲
流血几率
流血伤害
重击伤害
破韧伤害
```

### 2.3 穿甲逻辑

固定穿甲：

```text
effectiveArmor = max(0, targetArmor - flatArmorPen)
```

百分比穿甲：

```text
effectiveArmor = targetArmor * (1 - armorPenPercent)
```

混合穿甲：

```text
effectiveArmor = max(0, targetArmor * (1 - armorPenPercent) - flatArmorPen)
```

### 2.4 破甲状态

破甲是 Debuff，不是一次性穿透。

```text
BrokenArmor:
    targetArmor -= value
    duration = 4s
    stack = 3
```

---

## 3. 火焰伤害

火焰强调：
- 高爆发
- 范围伤害
- 燃烧 DOT
- 击杀爆炸
- 地面火区

火焰词条：

```text
火焰伤害增加
燃烧几率
燃烧伤害
燃烧持续时间
击杀爆炸
燃烧扩散
火焰穿透
火焰抗性削减
```

燃烧：

```text
burnDamagePerSecond = hitFireDamage * burnBaseRatio * burnEffectMultiplier
duration = baseDuration * durationMultiplier
```

---

## 4. 冰冷伤害

冰冷强调：
- 控制
- 减速
- 冻结
- 防御性输出
- 打断节奏

冰冷异常：

```text
Chill 冰缓：降低移动速度和攻击速度
Freeze 冻结：完全控制，持续短
Shatter 碎裂：冻结击杀特殊死亡
```

冰冷词条：

```text
冰冷伤害增加
冰缓效果增加
冻结几率
冻结持续时间
冻结敌人增伤
击杀冻结敌人爆裂
```

---

## 5. 闪电伤害

闪电强调：
- 高波动
- 暴击
- 连锁
- 感电增伤
- 多目标跳跃

感电：

```text
shockTakenDamageIncrease = baseShockEffect * shockEffectMultiplier
```

闪电词条：

```text
闪电伤害增加
闪电伤害幸运
连锁次数
感电几率
感电效果
暴击时感电
击中感电敌人产生电弧
```

---

## 6. 毒素伤害

毒素强调：
- 持续伤害
- 叠层
- 削弱
- 低频爆发

中毒：

```text
poisonDps = hitPhysicalOrPoisonDamage * poisonRatio
duration = basePoisonDuration
stackable = true
```

毒素词条：

```text
中毒几率
中毒伤害
中毒持续时间
中毒层数上限
每层中毒增加伤害
击杀中毒敌人扩散毒云
```

---

## 7. 暗影伤害

暗影用于：
- 诅咒
- 弱化
- 穿透
- 恐惧
- 生命削减

暗影词条：

```text
暗影伤害增加
诅咒效果增加
被诅咒敌人受到更多伤害
击杀被诅咒敌人恢复资源
暗影伤害无视部分护盾
```

---

## 8. 神圣伤害

神圣用于：
- 对亡灵增伤
- 护盾互动
- 净化异常
- 审判标记

神圣词条：

```text
神圣伤害增加
对亡灵增伤
对护盾敌人增伤
击中净化自身异常
审判标记
神圣击杀治疗附近友方
```

---

## 9. 真实伤害

真实伤害用于特殊机制，不应大规模堆叠。

特点：
- 不被护甲降低。
- 不被普通抗性降低。
- 可被特殊真伤减免降低。
- 不应被普通增伤无限放大。

真伤来源：

```text
处决
低生命敌人追加
破盾后追加
流血终结
特定传奇装备
关键天赋
Boss 机制
```

限制：
- 真伤不能轻易暴击。
- 真伤不能享受全部增伤。
- 真伤数值低于普通伤害。
- 真伤最好有条件触发。

---

## 10. 混合伤害

```json
{
  "damageParts": [
    {"type": "Physical", "ratio": 0.7},
    {"type": "Fire", "ratio": 0.3}
  ]
}
```

处理：
- 每种伤害分别计算防御。
- UI 显示主伤害类型。
- 详细模式显示拆分。
