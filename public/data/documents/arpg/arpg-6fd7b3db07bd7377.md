# 290 敌人受击动画与移动中断规则：方向、部位与状态切换

## 1. 受击动画选择维度

不能只准备一个受击动画。

推荐按以下维度组合：

```text
受击强度
命中方向
命中高度
当前姿态
是否在空中
是否倒地
武器伤害类型
```

---

## 2. 地面方向受击

基础动画：

```text
Hit_Light_Front
Hit_Light_Back
Hit_Light_Left
Hit_Light_Right

Hit_Heavy_Front
Hit_Heavy_Back
Hit_Heavy_Left
Hit_Heavy_Right
```

方向计算：

```text
攻击来源方向
→ 转换到受击者本地空间
→ 判断前后左右
```

---

## 3. 命中高度

可分：

```text
Low：腿部、低扫
Middle：躯干
High：头部、上半身
```

不需要为所有组合制作独立动画，可通过：

```text
基础受击动画
+ 上半身 Additive
+ IK/骨骼偏移
```

实现。

---

## 4. 移动中受击

敌人在巡逻、追击、转向和普通移动中受到有效硬直：

```text
停止当前移动请求
暂停 NavMeshAgent 位移
清理路径或暂存目的地
把速度快速衰减到 0
切换受击动画
```

受击结束：

```text
AI 仍在战斗
→ 重新选择或确认目标
→ 重新请求路径
→ 恢复追击

AI 未进入战斗
→ 返回原行为
```

---

## 5. 不同移动状态

### 普通移动

```text
轻受击：停步
重受击：停步 + 击退
```

### 冲刺

```text
若冲刺有霸体：不停止，只反馈命中
若攻击强度足够：中断冲刺
```

### 跳跃/下落

```text
切换空中受击
保留或覆盖垂直速度
```

### 攀爬/特殊导航

建议：

```text
普通攻击不打断
重击强制掉落
```

按关卡需求配置。

---

## 6. Animator 层级

推荐：

```text
Base Layer
├── Locomotion
├── Attack
├── HitReaction
├── Knockdown
└── Death

UpperBody Additive Layer
└── LightHitAdditive
```

轻受击可使用 Additive，减少对动作的强制中断。

重受击、击退、破韧使用 Base Layer 完整状态。

---

## 7. 受击动画播放优先级

```text
死亡
> 击倒
> 破韧
> 空中受击
> 重受击
> 轻受击
> Additive 反馈
```

---

## 8. 动画衔接

受击动画需要配置：

```text
EnterBlend
ExitBlend
MinimumPlayTime
CanBeInterruptedByHigherReaction
RecoverState
```

避免：

```text
受击动画刚播 0.02 秒就被移动覆盖
```

---

## 9. 面向处理

受击时不建议强制所有敌人瞬间面向攻击者。

模式：

```text
KeepFacing
FaceAttacker
RotatePartially
FaceKnockbackDirection
```

普通轻受击：

```text
保持当前面向或轻微转向
```

破韧：

```text
可面向主要攻击来源
```

---

## 10. 根运动与击退冲突

受击动画可能带 Root Motion，击退系统也会位移。

需要配置：

```text
MotionSource = Animation
MotionSource = GameplayForce
MotionSource = Mixed
```

推荐：

```text
小硬直：动画根运动
实际击退：GameplayForce
```

---

## 11. 空中受击动画

```text
AirHit_Up
AirHit_Horizontal
AirHit_Down
AirHit_Tumble
```

进入空中状态后：

```text
关闭地面移动
使用空中动力
落地时进入 LandingHit 或 Knockdown
```

---

## 12. 倒地状态动画

```text
Knockdown_Start
Knockdown_Loop
Knockdown_GetUp
Knockdown_QuickGetUp
Knockdown_Death
```

倒地时受到追加攻击：

```text
播放短促倒地受击
不重复进入完整倒地开始动画
```

---

## 13. 大体型敌人

大型敌人受击通常不做全身大幅动作。

推荐：

```text
头部摆动
肩膀偏移
上半身 Additive
局部肉体/甲片震动
局部命中特效
韧性条反馈
```

---

## 14. 动画缺失回退

如果没有对应方向动画：

```text
重前 → 轻前
方向动画缺失 → Front
空中动画缺失 → 通用 AirHit
```

必须有回退，不能出现 Animator 无状态。

---

## 15. AI 状态接入

```text
OnHitReactionStarted
→ 暂停行为树移动任务
→ 暂停攻击任务
→ 设置 IsInHitReaction

OnHitReactionEnded
→ 清除标记
→ 重新评估目标
→ 恢复行为树
```
