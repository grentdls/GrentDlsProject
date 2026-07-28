# 89. 第三人称镜头规则：自由镜头、锁定镜头与战斗镜头


> 项目：Unity 3D ACT 刷宝 ARPG  
> 批次：第八批 - 3C 视角与操控专项  
> 目标：用第三人称自由视角 ACT 操控替代传统 2D/等距锁定视角，让玩家在刷宝、Boss 战、地牢探索中获得更强的动作控制感。  
> 参考边界：参考《永劫无间》这类第三人称动作游戏的高层 3C 思路：自由镜头、动作转向、跳跃/闪避/攀爬、锁定辅助、垂直移动与战斗镜头调度。具体参数、手感曲线、动作名称、镜头表现、输入节奏均采用本项目原创实现。


## 1. 镜头系统目标

本项目镜头要同时服务三种场景：刷图跑动、近战战斗、Boss 战。镜头不能只是简单跟随角色背后，而要根据角色状态、锁定目标、地形遮挡、技能释放和威胁方向自动修正。

## 2. 镜头基础结构

### 2.1 Unity 推荐实现

使用 Cinemachine，但不要把所有逻辑写死在 Cinemachine 参数里。推荐结构：

```text
PlayerCameraRig.prefab
├── CameraRoot
│   ├── YawPivot              // 水平旋转轴
│   │   └── PitchPivot        // 俯仰轴
│   │       └── CameraSocket  // 摄像机目标位置
│   ├── CameraTarget_Player   // 跟随玩家骨盆/胸口中间点
│   ├── CameraTarget_LockMix  // 玩家与锁定目标混合点
│   └── CameraCollisionProbe  // 遮挡检测射线/球形检测
├── CinemachineVirtualCamera_Free
├── CinemachineVirtualCamera_Lock
├── CinemachineVirtualCamera_Boss
├── CinemachineVirtualCamera_Interact
└── CameraBrain
```

### 2.2 镜头模式

| 模式 | 使用场景 | 特点 |
|---|---|---|
| FreeExplore | 非战斗探索 | 玩家自由转动，角色移动方向受镜头影响 |
| FreeCombat | 非锁定战斗 | 镜头自由，但目标辅助弱吸附 |
| SoftLock | 轻锁定 | 镜头轻微朝向目标，玩家仍可转动 |
| HardLock | 硬锁定 | 镜头保持玩家与目标同屏，移动变为环绕 |
| BossArena | Boss 战 | 镜头距离更远，优先显示 Boss 关键动作 |
| Interact | NPC/宝箱/传送 | 镜头轻微拉近，角色面对交互物 |
| CinematicSkill | 大招/处决/转阶段 | 短暂接管镜头，结束后回到原模式 |

## 3. 自由镜头规则

### 3.1 默认参数建议

| 参数 | 建议值 | 说明 |
|---|---:|---|
| 跟随距离 | 5.5m | 普通探索 |
| 战斗距离 | 6.2m | 视野更开阔 |
| Boss 距离 | 8.0m - 11.0m | 按 Boss 尺寸变化 |
| 角色屏幕偏移 | X=0.18, Y=-0.08 | 角色略偏左/右，保留前方视野 |
| FOV | 58 - 68 | 疾跑可上升至 72 |
| Pitch 最小 | -35° | 向下看 |
| Pitch 最大 | 55° | 向上看 |
| 跟随阻尼 | 0.08 - 0.18 | 状态越激烈阻尼越小 |

### 3.2 镜头输入

| 输入 | 效果 |
|---|---|
| 鼠标 X | 水平旋转 Yaw |
| 鼠标 Y | 垂直 Pitch，默认反向可在设置中改 |
| 右摇杆 X/Y | 镜头旋转，带死区与加速度曲线 |
| 锁定键 | 进入/退出 SoftLock 或 HardLock |
| 重置镜头 | 镜头对齐角色前方或当前移动方向 |

### 3.3 自由镜头移动方向规则

自由镜头下，移动输入不是世界坐标，而是基于镜头水平朝向：

```text
CameraForward = ProjectOnPlane(Camera.forward, GroundNormal).normalized
CameraRight   = ProjectOnPlane(Camera.right, GroundNormal).normalized
MoveDir       = CameraForward * InputY + CameraRight * InputX
```

当玩家没有移动输入时，角色不会自动跟随镜头转身。只有在以下情况转身：

- 开始移动。
- 攻击/技能释放。
- 锁定目标。
- 交互。
- 受到强制位移或动画 Root Motion。

## 4. 锁定镜头规则

### 4.1 软锁定 SoftLock

适合刷怪和远程技能。SoftLock 不强制镜头锁死，只做轻微辅助。

规则：

1. 目标必须在屏幕中心 60% 区域内。
2. 目标距离不超过 `SoftLockMaxDistance`。
3. 镜头会以 `0.12s - 0.25s` 的速度轻微偏向目标。
4. 玩家强烈拖动鼠标/摇杆时，镜头辅助自动降低。
5. SoftLock 不改变移动模式，仍是自由移动。

### 4.2 硬锁定 HardLock

适合精英怪、Boss、单体近战。

规则：

1. 镜头目标点 = 玩家胸口点与敌人锁定点的混合。
2. 玩家默认面对锁定目标。
3. 移动输入变为：前进靠近、后退拉远、左右环绕。
4. 攻击自动朝向锁定目标，但重攻击仍可允许小角度修正。
5. 目标离开最大距离、死亡、进入不可见状态时解除锁定。

### 4.3 锁定镜头的构图

```text
屏幕构图：
┌─────────────────────┐
│       Boss/Target    │
│                     │
│                     │
│   Player            │
└─────────────────────┘
```

目标与玩家不能重叠在屏幕中心。推荐使用双目标构图：

| 距离 | 镜头处理 |
|---|---|
| 目标 < 3m | 镜头略拉近但抬高，防止敌人挡住角色 |
| 3m - 8m | 标准锁定距离 |
| 8m - 15m | 镜头拉远，角色保持前景 |
| >15m | 若超过锁定距离则解除或转 SoftLock |

## 5. Boss 镜头规则

Boss 战镜头优先保证三个东西同屏：玩家、Boss 本体、Boss 关键技能区域。

### 5.1 Boss 镜头模式

| Boss 类型 | 镜头规则 |
|---|---|
| 人形 Boss | 类似 HardLock，但距离略远 |
| 大型 Boss | 镜头目标改为 Boss 胸口/弱点区域，而不是脚底 |
| 超大型 Boss | 不强制锁全身，只锁 Boss 当前可攻击弱点 |
| 多 Boss | 锁定当前威胁最高目标，边缘提示其他 Boss |

### 5.2 Boss 技能预警镜头

当 Boss 释放大范围技能：

1. 镜头不强制切镜，避免玩家失控。
2. 短暂提高 FOV 3 - 8 度。
3. 镜头向技能来源方向轻微偏转。
4. 屏幕边缘出现危险方向箭头。
5. 地面预警圈优先显示在镜头前方。

## 6. 镜头遮挡处理

### 6.1 遮挡检测

从 CameraTarget 到 CameraSocket 做 SphereCast。

```text
检测半径：0.25m - 0.45m
检测层：WorldStatic / LargeProp / Wall / Terrain
忽略层：Player / Enemy / Hitbox / VFX / Pickup
```

若有遮挡：

1. 摄像机沿射线前移到遮挡物前。
2. 不允许瞬间跳变，用 `0.05s - 0.12s` 平滑。
3. 遮挡解除后缓慢回到原距离。
4. 如果遮挡物是半透明可处理对象，可触发透明化。

### 6.2 角色遮挡透明

当场景物位于摄像机和玩家之间：

| 遮挡物类型 | 处理 |
|---|---|
| 墙体 | 摄像机前移 |
| 树叶/布帘 | 半透明 |
| 大型柱子 | 摄像机侧向偏移 |
| Boss 身体 | 不透明化，改镜头角度 |

## 7. 镜头震动规则

| 事件 | 震动强度 | 持续时间 | 备注 |
|---|---:|---:|---|
| 普通命中 | 0.08 | 0.06s | 仅轻微反馈 |
| 暴击 | 0.16 | 0.10s | 可叠加 HitStop |
| 玩家被重击 | 0.25 | 0.18s | 强提醒 |
| Boss 落地 | 0.35 | 0.25s | 距离衰减 |
| 大招释放 | 0.20 | 0.12s | 不要影响瞄准 |

## 8. 镜头状态切换

```text
FreeExplore
  → 进入战斗范围 → FreeCombat
FreeCombat
  → 按锁定键且有目标 → HardLock
HardLock
  → 目标死亡/距离过远/再次按锁定 → FreeCombat
FreeCombat/HardLock
  → Boss 开战 → BossArena
BossArena
  → Boss 死亡 → FreeExplore
任意状态
  → NPC 对话 → Interact
任意状态
  → 大招镜头 → CinematicSkill → 返回上一状态
```

## 9. 镜头调参字段

```json
{
  "cameraMode": "FreeCombat",
  "followDistance": 6.2,
  "heightOffset": 1.65,
  "sideOffset": 0.35,
  "pitchMin": -35,
  "pitchMax": 55,
  "yawSensitivityMouse": 0.16,
  "pitchSensitivityMouse": 0.13,
  "yawSensitivityGamepad": 180,
  "pitchSensitivityGamepad": 120,
  "fovNormal": 62,
  "fovSprint": 70,
  "lockMaxDistance": 18,
  "softLockAssistStrength": 0.35,
  "hardLockDamping": 0.12,
  "occlusionProbeRadius": 0.32
}
```

## 10. 验收标准

- 玩家疾跑转弯时镜头不抖、不穿墙。
- 锁定 Boss 后，玩家和 Boss 关键攻击动作基本同屏。
- 玩家贴墙时摄像机不会钻进墙体。
- 近距离小怪围攻时，不因自动锁定导致镜头乱甩。
- 鼠标/摇杆灵敏度可独立配置。
- 大招镜头结束后能正确返回原镜头模式。
