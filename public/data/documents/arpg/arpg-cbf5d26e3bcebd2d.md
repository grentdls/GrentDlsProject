# 171 防御承伤体系：护甲、穿甲、护盾、破盾、抗性、减伤

## 1. 承伤顺序

```text
原始伤害
→ 伤害类型增减
→ 暴击计算
→ 攻击者穿透/穿甲
→ 目标抗性/护甲/减伤
→ 护盾吸收
→ 生命承伤
→ 反伤/吸血/触发效果
```

## 2. 护甲

护甲主要对抗物理伤害。

推荐公式：

```text
physicalReduction = armor / (armor + damage * armorK)
```

建议：

```text
armorK = 8
```

特点：
- 小伤害更容易被护甲抵消。
- 大伤害仍能打穿护甲。
- 避免护甲堆成无敌。

## 3. 穿甲

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

词条示例：

```text
+120 穿甲
+18% 物理穿透
重击无视 25% 护甲
暴击时额外穿透 15% 护甲
```

## 4. 抗性

抗性类型：

```text
FireRes
ColdRes
LightningRes
PoisonRes
ShadowRes
HolyRes
ControlRes
DOTRes
```

计算：

```text
damageAfterRes = damage * (1 - finalResistance)
```

默认抗性上限：

```text
75%
```

抗性穿透：

```text
finalResistance = targetResistance - attackerPenetration
```

## 5. 护盾

护盾是生命前的一层防御。

```text
shieldDamage = min(currentShield, incomingDamage)
lifeDamage = incomingDamage - shieldDamage
```

护盾回复：

```text
shieldRechargeDelay = 2.0s
shieldRechargeRate = maxShield * 0.15 per second
```

护盾吸取：

```text
shieldLeech = damageDealt * shieldLeechPercent
```

## 6. 破盾

当护盾从大于 0 变为 0 时触发：

```text
OnShieldBreak
```

可触发：
- 破盾爆炸
- 破盾眩晕
- 破盾增伤
- 破盾回能
- 破盾掉落加成
- 破盾暴露弱点

词条示例：

```text
对护盾造成 +40% 伤害
破盾时造成一次火焰爆炸
破盾后 4 秒内对目标造成更多伤害
破盾时恢复 15% 最大法力
破盾时召唤 2 个灵体
```

## 7. 格挡与闪避

格挡：

```text
if random < blockChance:
    damage *= (1 - blockDamageReduction)
    Trigger OnBlock
```

闪避：

```text
if random < dodgeChance:
    damage = 0
    Trigger OnDodge
```

## 8. 韧性与破韧

韧性伤害：

```text
poiseDamage = skillPoisePower * poiseDamageMultiplier
```

破韧触发：

```text
Trigger OnPoiseBreak
```

破韧词条：

```text
破韧敌人受到更多伤害
破韧时刷新技能冷却
破韧时召唤物集火目标
破韧时生成处决窗口
```

## 9. 减伤分层

```text
通用减伤
类型减伤
近战/远程减伤
DOT 减伤
Boss 减伤
控制期间减伤
```

同类加算，不同类乘算，并设置总上限。
