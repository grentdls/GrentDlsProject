# 294 Boss 与精英受击规则：霸体、破韧、阶段与处决窗口

## 1. Boss 不能像普通敌人一样连续硬直

如果普通普攻每次都打断 Boss：

```text
Boss 技能无法释放
战斗失去威胁
动画频繁跳转
多人/召唤构筑可无限控制
```

因此 Boss 采用：

```text
常态局部反馈
+ 韧性积累
+ 破韧完整反馈
```

---

## 2. Boss 常态受击

普通命中：

```text
扣血
积累韧性伤害
局部闪白
命中特效
轻微 Additive
伤害跳字
不打断当前核心技能
```

重击：

```text
更强上半身反应
可能短暂停顿
仍根据阶段决定是否中断
```

---

## 3. Boss 动作护甲

每个技能阶段配置：

```text
StartupArmor
ActiveArmor
RecoveryArmor
```

例如：

```text
前摇可打断
生效期霸体
后摇可打断
```

让玩家能够学习打断窗口，而不是完全不可打断。

---

## 4. Boss 韧性条

韧性来源：

```text
基础最大韧性
阶段倍率
玩家人数倍率
难度倍率
词缀倍率
```

显示：

```text
Boss 血条下方独立韧性条
```

---

## 5. 破韧流程

```text
韧性归零
→ 中断当前可中断技能
→ 清理攻击判定
→ 停止移动
→ 播放破韧动画
→ 进入易伤窗口
→ 允许处决或爆发
→ 起身
→ 恢复韧性
→ 获得短时间破韧抗性
```

---

## 6. 易伤窗口

配置：

```text
BreakDuration
DamageTakenMultiplier
CriticalTakenBonus
ExecutionAllowed
```

例如：

```text
持续 5 秒
受到伤害 +20%
允许特定终结技
```

---

## 7. 防止连续破韧

Boss 起身后：

```text
PoiseProtectionDuration
PoiseDamageTakenReduction
```

例如：

```text
3 秒内韧性伤害降低 70%
```

---

## 8. 阶段切换

Boss 达到阶段血量时：

```text
阶段切换优先级高于普通受击
```

可选择：

```text
立即打断并进入阶段动画
等待当前动作结束
等破韧恢复后切换
```

阶段动画通常为不可中断。

---

## 9. 精英敌人

精英介于普通怪和 Boss 之间：

```text
轻击只 Additive
中击可能中断
重击可完整硬直
浮空和击退效果降低
破韧后倒地或跪地
```

---

## 10. Boss 击退与浮空

```text
击退值 → 韧性伤害或局部位移
浮空值 → 韧性伤害
击倒值 → 破韧积累
```

特殊小型 Boss 可以允许有限击退，但需要边界限制。

---

## 11. 处决窗口

处决可以由：

```text
破韧
低生命
特殊机制
场景机关
```

触发。

处决流程：

```text
显示处决提示
→ 玩家输入
→ 锁定双方位置
→ 播放同步动画
→ 结算伤害
→ 恢复或死亡
```

---

## 12. 多人或多召唤目标

Boss 受击反馈不能因每个单位命中而叠加震屏。

限制：

```text
Boss HitStop 共享冷却
Boss 大型特效共享冷却
每秒最大 Additive 播放次数
```

---

## 13. Boss 反馈资源

建议每个 Boss 至少准备：

```text
轻局部受击 2-4 个
重受击 2 个
破韧开始
破韧循环
起身
阶段受击
死亡
```

---

## 14. Boss 配置示例

```json
{
  "bossReactionProfile": "BOSS_REACTION_HEAVY",
  "normalHitMode": "AdditiveOnly",
  "maxPoise": 5000,
  "breakDuration": 5.0,
  "breakDamageTakenMultiplier": 1.2,
  "poiseProtectionDuration": 3.0,
  "poiseProtectionMultiplier": 0.3
}
```
