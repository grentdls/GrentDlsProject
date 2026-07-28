# 148 基础移动动画 BlendTree 与状态切换规则

## 1. 移动参数

```text
MoveSpeed          float 当前水平速度
MoveSpeed01        float 归一化速度
MoveX              float 本地横向速度
MoveY              float 本地前后速度
IsMoving           bool
IsSprinting        bool
IsLockedOn         bool
IsGrounded         bool
VerticalVelocity   float
TurnAngle          float
```

## 2. 非锁定移动 BlendTree

```json
{
  "blendTreeId": "BT_Warrior_FreeMove",
  "parameter": "MoveSpeed01",
  "clips": [
    {"clipId": "ANI_Warrior_Idle", "threshold": 0.0},
    {"clipId": "ANI_Warrior_Walk", "threshold": 0.25},
    {"clipId": "ANI_Warrior_Run", "threshold": 0.65},
    {"clipId": "ANI_Warrior_Sprint", "threshold": 1.0}
  ],
  "fadeIn": 0.15,
  "fadeOut": 0.15
}
```

## 3. 锁定移动 BlendTree

```json
{
  "blendTreeId": "BT_Warrior_LockMove",
  "type": "2DFreeformDirectional",
  "parameterX": "MoveX",
  "parameterY": "MoveY",
  "clips": [
    {"clipId": "ANI_Warrior_StrafeLeft", "pos": [-1, 0]},
    {"clipId": "ANI_Warrior_StrafeRight", "pos": [1, 0]},
    {"clipId": "ANI_Warrior_Forward", "pos": [0, 1]},
    {"clipId": "ANI_Warrior_Backward", "pos": [0, -1]},
    {"clipId": "ANI_Warrior_CombatIdle", "pos": [0, 0]}
  ]
}
```

## 4. 转向动画

原地转身触发：

```text
IsMoving == false
abs(TurnAngle) > 65
```

动画：
```text
TurnLeft90
TurnRight90
Turn180
```

移动中转向使用插值：

```text
turnSpeed = 720 deg/s
combatTurnSpeed = 540 deg/s
lockedTurnSpeed = 900 deg/s
```

## 5. 动画速度匹配

```text
animSpeed = currentSpeed / clipReferenceSpeed
```

配置：

```json
{
  "clipId": "ANI_Warrior_Run",
  "referenceSpeed": 4.8,
  "allowSpeedScale": true,
  "minSpeedScale": 0.85,
  "maxSpeedScale": 1.2
}
```

## 6. 跳跃/下落切换

```text
GroundedMove → JumpStart → JumpUp → FallLoop → Land → GroundedMove
GroundedMove → FallLoop → Land
```

小台阶保护：

```text
如果离地时间 < 0.12s，不进入 FallLoop
```

## 7. 验收标准

- 从静止到跑步无明显跳变。
- 锁定状态左右移动动画正确。
- 后退动画不滑步。
- 疾跑动画速度和实际速度匹配。
- 从高处掉落能正确进入 FallLoop。
