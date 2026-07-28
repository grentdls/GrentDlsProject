# 289 受击结果判定规则：攻击强度、韧性、动作抗打断与优先级

## 1. 核心参数

攻击侧：

```text
HitStrength
PoiseDamage
KnockbackForce
LaunchForce
KnockdownValue
InterruptLevel
HitStopProfile
ReactionTag
```

防御侧：

```text
CurrentPoise
MaxPoise
PoiseResistance
KnockbackResistance
LaunchResistance
KnockdownResistance
CurrentActionArmor
SuperArmorState
ReactionImmunity
```

---

## 2. HitStrength 建议等级

```text
0：持续伤害、环境微伤害
1：轻型普攻
2：普通技能、连段中段
3：普攻终段、重型技能
4：蓄力重击、爆炸、终结技
5：强制特殊反应
```

---

## 3. 动作抗打断等级

敌人每个动作配置：

```text
InterruptArmorLevel
```

示例：

```text
待机：0
移动：0
普通攻击前摇：1
普通攻击生效期：2
精英技能：3
Boss 核心技能：4
剧情技能：不可中断
```

判定：

```text
InterruptLevel >= InterruptArmorLevel
→ 可以中断
```

但仍需要检查霸体和免疫。

---

## 4. 韧性结算

```text
EffectivePoiseDamage =
BasePoiseDamage
× 攻击破韧倍率
× 目标韧性承伤倍率
```

结果：

```text
CurrentPoise > 0
→ 根据攻击强度播放普通受击

CurrentPoise <= 0
→ 进入 Break 状态
```

破韧后：

```text
清空当前技能
停止移动
播放破韧动画
进入破韧易伤窗口
一定时间后恢复韧性
```

---

## 5. 受击类型决策

建议流程：

```text
生命是否归零？
├── 是：死亡
└── 否
    ├── 韧性是否归零？→ 破韧
    ├── 是否满足击倒？→ 击倒
    ├── 是否满足浮空？→ 浮空/击飞
    ├── 是否满足重受击？→ 重受击
    ├── 是否满足中受击？→ 中受击
    ├── 是否满足轻受击？→ 轻受击
    └── 无硬直
```

---

## 6. 防止小攻击无限硬直

需要：

```text
HitReactionCooldown
LightStaggerResistanceStack
RepeatedHitDiminishing
```

示例：

```text
目标在 1 秒内连续受到 4 次轻受击
→ 第 5 次轻受击不再中断
→ 仍扣血、闪白和跳字
```

重受击与破韧不受该规则影响。

---

## 7. 连续控制衰减

浮空、击倒、强硬直累计控制值：

```text
ControlResistanceMeter
```

连续受到同类控制：

```text
持续时间逐次降低
最终短时间免疫
```

普通小怪可以弱化该规则，精英和 Boss 必须使用。

---

## 8. 霸体

霸体类型：

```text
LightArmor：免疫轻受击
HeavyArmor：免疫轻、中受击
SuperArmor：免疫普通中断，只受破韧
AbsoluteArmor：剧情级不可中断
```

霸体不等于无反馈：

```text
仍然扣血
仍闪白
仍有命中特效
仍播放轻微受击叠加层
仍积累韧性伤害
```

---

## 9. 强制中断标签

少量技能可带：

```text
ForceInterrupt
```

但必须限制：

```text
只对普通和精英
Boss 只在特定阶段有效
不能打断剧情技能
```

---

## 10. 多命中优先级

同一帧同时命中：

```text
先合并伤害
取最高 HitStrength
累加 PoiseDamage
合成击退方向
选择最高级反应
```

不能连续播放多个受击动画。

---

## 11. 反应锁

受击进入高级状态后：

```text
ReactionLockLevel
```

例如击倒状态：

```text
轻受击不能切回站立受击
重击可以触发倒地追加
死亡可以覆盖
```

---

## 12. 伤害免疫和受击免疫分离

需要区分：

```text
DamageImmune：不受伤害
ReactionImmune：受伤但不产生硬直
ControlImmune：免疫浮空/击倒等控制
```

避免一个“无敌”标签同时影响所有系统。

---

## 13. 推荐默认值

普通小怪：

```text
动作抗打断：0-1
轻受击冷却：0.12 秒
破韧恢复：3 秒
```

精英：

```text
动作抗打断：1-3
轻受击冷却：0.2 秒
破韧恢复：5 秒
```

Boss：

```text
动作抗打断：3-4
普通攻击不产生完整硬直
破韧恢复：8-12 秒或阶段规则
```
