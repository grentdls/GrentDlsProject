# 281 空中普攻连段系统：滞空、浮空、落地与下砸

## 1. 独立槽位

```text
AirBasicAttackSlot
AirComboIndex
```

空中普攻使用独立动画、伤害盒、位移和连段，不能直接复用地面普攻。

## 2. 主要职责

```text
追击被挑空敌人
控制短暂滞空
调整空中水平位置
维持敌人浮空
以击落或下砸结束
落地后切回地面普攻
```

## 3. 段数建议

```text
轻武器：3-5 段
重武器：2-3 段
弓弩：3 段空射
法杖：3 段空中法弹
拳套：4-6 段
```

## 4. 滞空参数

```text
SuspendGravityDuration
GravityScaleDuringAttack
VerticalVelocityOverride
HorizontalAirControl
```

每段只提供短暂停滞，连续攻击仍应缓慢下降，防止无限悬空。

## 5. 敌人浮空

```text
普通敌人：浮空/延长滞空
精英：受浮空抗性缩短
Boss：转化为韧性伤害
固定单位：不产生位移
```

## 6. 空中目标辅助

```text
向锁定目标轻微靠近
允许小幅高度修正
限制最大追踪距离
```

## 7. 最后段收尾

```text
水平击飞
向下击落
上挑延长
下砸落地
快速脱离
```

## 8. 落地规则

```text
角色落地
→ 停止未生效的空中后续段
→ AirComboIndex = 0
→ 清空空中输入缓存
→ 切回 GroundBasicAttackSlot
```

## 9. 空中次数限制

```text
MaxAirBasicAttackCount
AirActionPoint
ResetOnLanding
```

可用于限制无限滞空。

## 10. 远程空中攻击

弓弩和法杖可配置：

```text
轻微后坐
短暂停滞
瞄准角度限制
落地立即切换地面射击
```
