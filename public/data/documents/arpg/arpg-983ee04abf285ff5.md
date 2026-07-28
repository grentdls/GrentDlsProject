# 3D ACT 输入、移动、镜头、锁定系统

---

## 1. 操作目标

本项目从 2D 锁定视角改为 3D ACT 操作，核心要求：

- 玩家能像动作游戏一样移动、闪避、转向、锁定。
- 技能释放需要有方向、距离、前摇、后摇、硬直。
- 镜头既要看清刷怪密度，也要支持 Boss 战读招。
- PC 键鼠、手柄、后续移动端虚拟摇杆都要能兼容。

---

## 2. 输入方案

使用 Unity Input System。

### 2.1 Action Map

```text
InputActions
  Gameplay
    Move              Vector2    WASD / Left Stick
    Look              Vector2    Mouse Delta / Right Stick
    Dodge             Button     Space / B
    Interact          Button     E / A
    BasicAttack       Button     Mouse Left / RT
    Aim               Button     Mouse Right / LT
    LockOn            Button     Tab / R3
    SwitchTargetLeft  Button     Q / DPad Left
    SwitchTargetRight Button     R / DPad Right
    Skill1            Button     1 / X
    Skill2            Button     2 / Y
    Skill3            Button     3 / RB
    Skill4            Button     4 / LB
    Skill5            Button     F / DPad Up
    Potion1           Button     Z
    Potion2           Button     X
    OpenInventory     Button     I
    OpenSkillPanel    Button     K
    OpenMap           Button     M
    Pause             Button     Esc / Start
  UI
    Navigate
    Submit
    Cancel
    Point
    Click
    ScrollWheel
    Drag
```

---

## 3. 移动系统

### 3.1 玩家移动模式

支持三种移动模式：

#### 模式 A：镜头相对移动

W 永远向镜头前方移动，适合手柄和 3D ACT。

```text
MoveDir = CameraForward * InputY + CameraRight * InputX
MoveDir.y = 0
MoveDir.Normalize()
```

#### 模式 B：鼠标方向移动

角色朝鼠标射线落点方向，适合暗黑玩家。

#### 模式 C：锁定移动

锁定目标后：

- 左右输入变成绕目标横移。
- 后退输入变成面向目标后撤。
- 攻击自动朝向目标。
- 技能可选择“锁定目标释放”或“自由方向释放”。

### 3.2 PlayerMovementController

职责：

- 接收输入。
- 计算移动方向。
- 控制 CharacterController / Rigidbody。
- 管理移动状态。

状态：

```text
Idle
Walk
Run
Sprint
Dodge
AttackRootMotion
HitStun
Knockback
Dead
```

### 3.3 移动参数

```text
MoveSpeedBase = 5.2
SprintSpeedMultiplier = 1.25
Acceleration = 20
Deceleration = 24
RotationSpeed = 720 degrees/s
AirControl = 0.2
Gravity = -25
GroundCheckDistance = 0.2
```

这些数值是原创建议值，用于第一版手感调试。

---

## 4. 闪避系统

### 4.1 闪避定位

闪避是 3D ACT 手感核心。必须具备：

- 瞬间方向确认。
- 短暂无敌帧。
- 固定距离。
- 动画根运动或代码位移。
- 冷却或体力消耗。
- 不能无脑无限滚。

### 4.2 闪避参数

```text
DodgeDistance = 5.5
DodgeDuration = 0.42
InvincibleStart = 0.08
InvincibleEnd = 0.28
DodgeCooldown = 0.55
StaminaCost = 20
CanCancelAttackAfter = 0.2
CanQueueSkillAfter = 0.3
```

### 4.3 闪避方向

优先级：

1. 当前移动输入方向。
2. 锁定模式下的相对方向。
3. 没有输入时，默认向角色后方闪避。

### 4.4 闪避碰撞

规则：

- 可穿过普通小怪，不能穿过墙体和 Boss。
- 若目标位置有墙体，缩短闪避距离。
- 闪避期间关闭小怪碰撞推挤，但保留地形碰撞。

---

## 5. 镜头系统

使用 Cinemachine。

### 5.1 镜头类型

| 镜头 | 用途 |
|---|---|
| ExplorationCamera | 常规刷图，斜俯视第三人称 |
| BossCamera | Boss 房间，视野更宽，自动收纳 Boss |
| LockOnCamera | 锁定目标，镜头略微偏向目标 |
| InventoryCamera | 城镇角色展示/装备查看 |
| CutsceneCamera | 过场镜头 |

### 5.2 常规镜头参数

```text
Distance = 11
Height = 7
Pitch = 42°
YawFollowSpeed = 8
ZoomMin = 7
ZoomMax = 14
CollisionRadius = 0.35
```

### 5.3 镜头控制

键鼠：

- 鼠标右键按住可旋转镜头。
- 滚轮缩放。
- 锁定目标时，镜头自动保持角色与目标都在屏幕内。

手柄：

- 右摇杆旋转镜头。
- R3 锁定目标。
- LT 进入瞄准/集中视角。

---

## 6. 锁定目标系统

### 6.1 TargetLockController

职责：

- 搜索附近可锁定目标。
- 根据屏幕中心、距离、威胁度排序。
- 切换目标。
- 驱动 UI 锁定框。
- 影响角色转向和技能释放。

### 6.2 锁定目标评分

```text
Score = ScreenCenterWeight * 0.45
      + DistanceWeight * 0.25
      + ThreatWeight * 0.2
      + VisibilityWeight * 0.1
```

目标条件：

- 处于半径 22 米内。
- 在摄像机视锥内。
- 有 Targetable 组件。
- 未死亡。
- 不是隐身/不可选中状态。

### 6.3 切换目标

切换规则：

- 左切换：选择屏幕左侧最近目标。
- 右切换：选择屏幕右侧最近目标。
- 若目标死亡，自动切换到最近高威胁目标。

---

## 7. 攻击朝向

技能释放时朝向优先级：

1. 锁定目标。
2. 鼠标射线落点。
3. 右摇杆方向。
4. 当前移动方向。
5. 角色当前朝向。

近战技能必须在释放前转向。远程技能可边移动边瞄准，但高威力技能会锁定站桩。

---

## 8. 输入缓冲与取消

ACT 手感必须支持：

- 攻击输入缓冲。
- 翻滚取消部分后摇。
- 技能连段。
- 受击中断。
- 硬直保护。

### 8.1 输入缓冲

```text
InputBufferWindow = 0.25s
```

如果玩家在当前动作结束前 0.25 秒内按技能，动作结束后自动释放。

### 8.2 动作取消规则

| 当前动作 | 可被闪避取消 | 可被技能取消 | 可被受击打断 |
|---|---:|---:|---:|
| 普攻前摇 | 否 | 否 | 是 |
| 普攻命中帧后 | 是 | 是 | 是 |
| 普攻后摇 | 是 | 是 | 是 |
| 重技能前摇 | 否 | 否 | 是/否看霸体 |
| 闪避 | 否 | 否 | 否 |
| 药剂 | 是 | 否 | 是 |
| 受击硬直 | 否 | 否 | 否 |

---

## 9. 角色控制器 Prefab

```text
PlayerRoot
  CharacterController
  PlayerInput
  PlayerStateMachine
  PlayerMovementController
  PlayerCombatController
  PlayerSkillController
  PlayerEquipmentController
  PlayerAnimationController
  PlayerTargetLockController
  PlayerInteractionController
  PlayerAudioController
  PlayerVFXController
  ModelRoot
    BodyMesh
    WeaponSocket_R
    WeaponSocket_L
    BackSocket
    HeadSocket
  Hitboxes
    BodyHurtbox
    WeaponHitbox
  Sensors
    GroundCheck
    EnemyDetector
    InteractDetector
  CameraTarget
  UIAnchor
```

---

## 10. 验收标准

移动和视角的第一轮验收：

- 不打怪时，玩家移动 5 分钟不晕、不别扭。
- 锁定 Boss 后，玩家能清楚看到 Boss 和自己。
- 鼠标/手柄释放技能方向稳定。
- 闪避有明确读秒和无敌反馈。
- 技能前后摇清楚，不像“数值按钮”。
- 小怪密集时角色不被卡死。
