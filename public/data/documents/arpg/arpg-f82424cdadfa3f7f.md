# 245 大门、移动平台、机关开关、地刺、喷火陷阱配置规则

## 1. 大门系统

大门支持两种主要驱动方式：

```text
Transform 驱动
Animator 驱动
```

### 1.1 Transform 大门

支持：

```text
旋转打开
平移打开
缩放隐藏
双门对开
多段移动
```

配置：

```text
OpenMode
TargetTransform
LocalMoveOffset
LocalRotationOffset
Duration
EaseCurve
CloseDuration
BlockDuringMove
```

示例：

```json
{
  "openMode": "Rotate",
  "localRotationOffset": [0, 90, 0],
  "openDuration": 1.2,
  "closeDuration": 1.0,
  "ease": "EaseInOut"
}
```

### 1.2 Animator 大门

```text
OpenStateName
CloseStateName
LockedStateName
OpenEventTime
CloseEventTime
```

适合复杂石门、机械门、锁链门和多段动画门。

## 2. 大门交互流程

```text
玩家靠近
→ 显示 [E] 打开
→ 检查条件
→ 播放开门表现
→ 更新碰撞
→ 更新 NavMeshObstacle
→ 状态切换为 Open
```

再次交互后关闭。

## 3. 防夹规则

关闭前检测：

```text
玩家
敌人
召唤物
可移动物体
```

默认策略：

```text
检测到阻挡时暂停关闭
```

可选：

```text
重新打开
推开单位
禁止关闭
```

## 4. 移动平台

支持路径：

```text
两点往返
多点循环
多点往返
单次移动
玩家触发
机关触发
定时启动
```

配置：

```text
PathPoints
MoveSpeed
MoveDuration
WaitTimePerPoint
LoopMode
StartMode
CarryPassengers
RotationMode
```

## 5. 移动平台乘客处理

玩家站在平台上时：

```text
记录乘客
按平台位移同步移动
保持 CharacterController 稳定
跳跃后解除跟随
```

不建议简单把玩家设为平台子物体，容易引发旋转、缩放和相机问题。

## 6. 平台 Scene 预览

显示：

```text
蓝色路径线
路径点编号
移动方向箭头
停留时间
平台预览位置
```

## 7. 机关开关

类型：

```text
拉杆
按钮
压力板
旋转机关
破坏机关核心
射击开关
多目标组合开关
```

可连接：

```text
门
陷阱
移动平台
传送门
桥梁
灯光
VFX
隐藏墙
```

## 8. MechanismLink

```text
SourceMechanismId
TargetObjectIds
ActionOnActivate
ActionOnDeactivate
Delay
SequenceIndex
```

一个开关可以控制多个对象。

## 9. 地刺陷阱

状态：

```text
Hidden
Warning
Extend
Active
Retract
Cooldown
Disabled
Destroyed
```

配置：

```text
WarningDuration
ExtendDuration
ActiveDuration
RetractDuration
Cooldown
Damage
PoiseDamage
KnockUp
TriggerMode
```

触发方式：

```text
周期
玩家进入
压力板
机关开关
敌人靠近
脚本事件
```

## 10. 地刺开关玩法

开关可：

```text
永久关闭
临时关闭
反转周期
降低频率
改变阵营
立即触发
```

## 11. 喷火陷阱

状态：

```text
Idle
Warning
Ignite
Firing
Stop
Cooldown
Destroyed
```

配置：

```text
Direction
Range
Width
TickInterval
DamagePerTick
BurningChance
Duration
CycleInterval
CanBeDestroyed
```

## 12. 喷火伤害

推荐使用：

```text
BoxCast / CapsuleCast
按 TickInterval 结算
```

避免按帧伤害导致帧率相关。

## 13. 可破坏陷阱

喷火器、箭塔、地刺核心可配置：

```text
生命
护甲
弱点
破坏阶段
死亡爆炸
关闭关联陷阱
掉落材料
```

## 14. 组合机关示例

```text
拉下拉杆
→ 关闭地刺
→ 启动移动平台
→ 2 秒后打开大门
→ 激活传送门
```

必须通过 Action 列表实现，不写死流程。
