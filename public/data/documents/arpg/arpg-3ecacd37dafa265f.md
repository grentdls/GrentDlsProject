# 291 闪白、命中停顿、镜头震动、特效、音效与控制器反馈

## 1. 闪白

闪白用于确认命中，不应持续太久。

推荐时长：

```text
轻攻击：0.04-0.07 秒
中攻击：0.06-0.10 秒
重攻击：0.08-0.14 秒
暴击/破韧：0.10-0.18 秒
```

---

## 2. 闪白实现

不建议：

```text
运行时复制每个 Renderer 材质
```

推荐：

```text
MaterialPropertyBlock
Shader 全局受击参数
共享受击材质功能
```

参数：

```text
HitFlashColor
HitFlashIntensity
HitFlashProgress
```

---

## 3. 闪白颜色

```text
普通命中：白色
火焰：白橙
冰冷：白蓝
闪电：白紫
毒素：黄绿
破盾：青白
破韧：金白
```

主要仍以白色为基础，避免元素色盖住角色识别。

---

## 4. 命中停顿 Hit Stop

命中停顿使攻击者和受击者短暂停止或减速。

推荐：

```text
轻击：0.02-0.04 秒
中击：0.04-0.07 秒
重击：0.07-0.12 秒
终结/破韧：0.10-0.18 秒
```

---

## 5. Hit Stop 范围

模式：

```text
AttackerOnly
TargetOnly
AttackerAndTarget
LocalGroup
GlobalTimeScale
```

推荐：

```text
普通攻击：攻击者 + 受击者局部暂停
Boss 破韧：局部组或短全局慢化
```

不要频繁修改全局 Time.timeScale，容易影响 UI、物理和其他敌人。

---

## 6. 多段攻击顿帧限制

高攻速技能不能每段都完整顿帧。

支持：

```text
HitStopCooldown
MaximumHitStopPerSecond
OnlyFirstHit
OnlyCriticalHit
OnlyLastComboStep
```

---

## 7. 镜头震动

参数：

```text
Amplitude
Frequency
Duration
Direction
DistanceFalloff
```

强度来源：

```text
攻击强度
是否暴击
是否破韧
是否击杀
目标体型
玩家距离
```

---

## 8. 镜头震动层级

```text
轻击：几乎不可察觉
中击：短小高频
重击：低频明显冲击
爆炸：方向性震动
Boss 砸地：范围衰减
```

需要提供设置选项：

```text
镜头震动强度 0%-100%
关闭镜头震动
```

---

## 9. 命中特效

命中特效选择维度：

```text
伤害类型
武器类型
命中材质
攻击强度
暴击
破盾
破韧
```

命中材质：

```text
Flesh
Armor
Stone
Wood
Shield
Spectral
```

---

## 10. 命中特效位置和朝向

```text
位置：实际命中点
朝向：命中法线或攻击方向
```

近战扫击可适度修正到可见表面，避免特效生成在模型内部。

---

## 11. 音效分层

一次命中音效可以分：

```text
武器挥击
接触音
目标材质音
低频冲击
元素音
暴击强调音
```

不需要每次全部播放。通过 Profile 决定组合。

---

## 12. 音效随机化

```text
Pitch 小幅随机
多个 Sample 随机
同类音效短时间防重复
```

避免连续普攻听起来完全一样。

---

## 13. 控制器震动

参数：

```text
LowFrequency
HighFrequency
Duration
```

建议：
- 轻攻击使用高频短震。
- 重攻击增加低频。
- 玩家受伤比攻击命中更明显。
- 提供独立开关和强度设置。

---

## 14. 屏幕特效

谨慎使用：

```text
边缘闪光
色差
径向模糊
短暂曝光
```

只用于：

```text
重击
破盾
破韧
Boss 终结
玩家重伤
```

普通普攻不要频繁全屏特效。

---

## 15. 伤害跳字联动

跳字出现时间建议：

```text
命中判定后立即或延迟 0.02 秒
```

暴击：

```text
更大字号
短促缩放
专属音效
```

破盾/破韧：

```text
独立文字或图标
不要只靠数字颜色
```

---

## 16. 性能规则

```text
命中特效对象池
音效 Source 池
闪白使用 PropertyBlock
镜头震动使用统一管理器
伤害数字对象池
限制同屏重型特效数量
```
