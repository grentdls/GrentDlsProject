# 292 击退、浮空、击飞、击倒、倒地与起身完整规则

## 1. 空间反应类型

```text
Push：小幅推移
Knockback：明显击退
Launch：向上浮空
BlowAway：水平击飞
Knockdown：击倒
GroundBounce：地面弹起
WallBounce：墙面反弹
Pull：拉扯
```

---

## 2. 击退判定

```text
EffectiveKnockback =
AttackKnockback
- TargetKnockbackResistance
```

结果低于阈值：

```text
只播放受击，不实际位移
```

---

## 3. 击退方向

可选：

```text
AttackerToTarget
SkillForward
HitNormal
CustomDirection
RadialFromExplosion
```

近战通常使用攻击者到目标方向，爆炸使用径向方向。

---

## 4. 击退实现

建议使用独立 Gameplay Motion：

```text
KnockbackMotion
```

而不是直接依赖 NavMeshAgent 或动画根运动。

流程：

```text
暂停 AI 移动
→ 应用位移曲线
→ Sweep 检测碰撞
→ 结束后重新贴地
→ 恢复 AI
```

---

## 5. 击退碰墙

模式：

```text
Stop
Slide
WallStun
WallBounce
TakeImpactDamage
```

第一版推荐：

```text
普通敌人：Stop
特殊技能：WallStun
```

---

## 6. 浮空

上跃技能或指定攻击：

```text
应用向上速度
→ 进入 AirHit 状态
→ 暂时关闭地面移动
→ 允许空中追击
```

参数：

```text
LaunchVerticalSpeed
LaunchForwardSpeed
AirHitStun
GravityScale
MaximumAirTime
```

---

## 7. 浮空维持

空中连续命中可：

```text
刷新少量 AirHitStun
重新设置最低垂直速度
轻微抬高
```

必须限制：

```text
AirControlResistance
MaximumAirComboTime
RepeatedLaunchDiminishing
```

避免无限浮空。

---

## 8. Boss 浮空转化

Boss 不被实际挑空：

```text
LaunchForce
→ 转换为额外 PoiseDamage
```

可播放：

```text
上半身强受击
脚底冲击特效
韧性条震动
```

---

## 9. 击倒

满足：

```text
KnockdownValue >= KnockdownResistance
```

或特定技能标签：

```text
ForceKnockdown
```

进入：

```text
Knockdown_Start
→ Knockdown_Loop
→ GetUp
```

---

## 10. 倒地时间

配置：

```text
MinimumDownTime
MaximumDownTime
GetUpDelay
InvulnerabilityDuringGetUp
```

普通敌人：
```text
0.8-1.5 秒
```

精英：
```text
0.5-1.0 秒
```

Boss 只在破韧阶段使用专属倒地。

---

## 11. 倒地追加

倒地敌人可以受到：

```text
正常伤害
降低击退
专属倒地攻击
处决
```

需要标签：

```text
TargetState = Downed
```

---

## 12. 地面弹起

重型下砸可：

```text
敌人撞地
→ 短暂弹起
→ 再次进入空中
```

必须限制次数：

```text
MaxGroundBounceCount = 1
```

---

## 13. 墙面反弹

高阶技能可：

```text
击飞敌人碰墙
→ 造成额外伤害
→ 反弹回场内
```

需要墙面可反弹标签，避免对任意复杂模型生效。

---

## 14. 起身

起身类型：

```text
NormalGetUp
QuickGetUp
RollGetUp
TeleportGetUp
BossPhaseGetUp
```

起身时可配置：

```text
短暂无敌
攻击判定
推开玩家
恢复韧性
```

---

## 15. 死亡覆盖

在任何空间反应中生命归零：

```text
立即进入对应死亡
```

死亡类型可继承动量：

```text
击飞死亡
浮空死亡
倒地死亡
爆炸死亡
```

---

## 16. NavMesh 接入

空间反应期间：

```text
NavMeshAgent.updatePosition = false
```

结束后：

```text
采样附近 NavMesh
修正位置
恢复 Agent
重新寻路
```

找不到 NavMesh 时使用安全回退，不能让敌人卡在非法位置。
