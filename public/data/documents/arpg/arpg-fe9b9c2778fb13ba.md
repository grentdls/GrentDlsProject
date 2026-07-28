# 147 基础动画配置：待机、移动、跳跃、下落、落地、出生、死亡

## 1. 文档定位

本文定义 `BaseAnimationSet` 的制作逻辑。它只负责单位在没有技能、受击、强控制覆盖时的基础动作：

- 出生和刷怪出现。
- 非战斗待机与战斗待机。
- 普通移动、疾跑、锁定移动。
- 起跳、上升、下落、落地。
- 死亡和死亡事件。

技能动画参考 149 和 150，受击动画参考 151，状态动画参考 152，融合与打断规则参考 153。

## 2. 基础状态清单

| 状态 | 是否循环 | 是否必需 | 默认优先级 | 用途 |
|---|---|---:|---:|---|
| Spawn | 否 | 怪物/Boss 必需 | 360 | 出生、刷怪、召唤出现。 |
| Idle | 是 | 必需 | 100 | 非战斗待机。 |
| CombatIdle | 是 | 玩家和战斗单位必需 | 120 | 锁定、仇恨、战斗状态下待机。 |
| Move | 是 | 必需 | 200 | 行走、跑步、疾跑、锁定移动的统一入口。 |
| JumpStart | 否 | 玩家必需 | 320 | 起跳准备，可包含压身动作。 |
| JumpUp | 否/短循环 | 玩家必需 | 330 | 上升阶段。 |
| FallLoop | 是 | 必需 | 340 | 下落阶段，高处掉落也进入。 |
| LandLight | 否 | 必需 | 350 | 轻落地，不明显锁移动。 |
| LandHeavy | 否 | 可选 | 380 | 重落地，短时间锁移动并触发表现。 |
| Death | 否 | 战斗单位必需 | 1000 | 死亡、掉落、碰撞关闭、尸体清理。 |

第一版中 `Walk`、`Run`、`Sprint` 不作为独立状态暴露给外部系统，而是由 `Move` 状态内的 BlendTree 或速度阈值选择。

## 3. 通用状态字段

所有基础状态都使用统一字段，特殊状态再扩展自己的字段。

```json
{
  "state": "Idle",
  "clipId": "ANI_Guard_Idle_01",
  "loop": true,
  "layer": "BaseFullBody",
  "priority": 100,
  "fadeIn": 0.15,
  "fadeOut": 0.15,
  "speed": 1.0,
  "rootMotion": false,
  "mirror": false,
  "minPlayFrame": 0,
  "canBeInterrupted": true,
  "interruptAllowList": ["Move", "JumpStart", "Skill", "HitReaction", "Status", "Death"],
  "nextState": "",
  "tags": ["Base", "Grounded"]
}
```

字段说明：

| 字段 | 说明 |
|---|---|
| `state` | 状态名，必须使用本文定义的状态枚举。 |
| `clipId` | 默认 Clip。Move 可为空，由 BlendTree 决定。 |
| `loop` | 是否循环。Idle、CombatIdle、Move、FallLoop 必须为 true。 |
| `priority` | 播放优先级，和 146 的优先级表一致。 |
| `fadeIn` / `fadeOut` | 融入融出时间。基础动作建议 0.05 到 0.20 秒。 |
| `rootMotion` | 基础移动第一版默认 false，由移动控制器驱动位移。 |
| `minPlayFrame` | 最短播放帧数，避免刚进入状态马上被抖动打断。 |
| `interruptAllowList` | 允许打断到的目标类型。Death 永远允许。 |

## 4. 基础状态机

```text
Spawn
  → Idle / CombatIdle

Idle / CombatIdle
  → Move
  → JumpStart
  → Skill
  → HitReaction
  → Status
  → Death

Move
  → Idle / CombatIdle
  → JumpStart
  → FallLoop
  → Skill
  → HitReaction
  → Status
  → Death

JumpStart
  → JumpUp
  → FallLoop

JumpUp
  → FallLoop

FallLoop
  → LandLight / LandHeavy
  → Death

LandLight / LandHeavy
  → Idle / CombatIdle / Move
  → Death

Death
  → End
```

状态机必须由运行时条件驱动，不允许动画 Clip 播完后无条件切到错误状态。例如 `JumpUp` 播完后如果仍在上升，可以保持上升姿态或进入短循环；如果速度已经下降，进入 `FallLoop`。

## 5. Idle 与 CombatIdle

待机必须循环，并支持变体。变体只用于“同状态内随机展示”，不能改变状态机逻辑。

进入 `CombatIdle` 的条件：

- 玩家锁定目标。
- 玩家最近 4 秒内释放技能或受到攻击。
- 怪物进入仇恨状态但当前没有移动或攻击。
- Boss 开场后进入战斗姿态。

示例：

```json
{
  "state": "Idle",
  "loop": true,
  "fadeIn": 0.20,
  "fadeOut": 0.15,
  "canBeInterrupted": true,
  "variants": [
    {"clipId": "ANI_Guard_Idle_01", "weight": 70, "minInterval": 0.0},
    {"clipId": "ANI_Guard_Idle_AdjustWeapon", "weight": 20, "minInterval": 6.0},
    {"clipId": "ANI_Guard_Idle_LookAround", "weight": 10, "minInterval": 8.0}
  ],
  "variantIntervalMin": 6.0,
  "variantIntervalMax": 12.0
}
```

`CombatIdle` 示例：

```json
{
  "state": "CombatIdle",
  "clipId": "ANI_Guard_CombatIdle_Shield",
  "loop": true,
  "fadeIn": 0.12,
  "fadeOut": 0.10,
  "priority": 120,
  "lookAtTarget": true,
  "upperBodyAimWeight": 0.35
}
```

制作要求：

- 待机循环首尾姿态必须接近，不能有明显抽动。
- 长待机变体不能改变角色根节点位置。
- CombatIdle 必须面向战斗方向，不能与锁定转向系统抢根旋转。

## 6. Move 移动动画

移动状态统一读取运行时参数：

```text
MoveSpeed
MoveSpeed01
MoveX
MoveY
IsMoving
IsSprinting
IsLockedOn
IsGrounded
TurnAngle
```

非锁定移动第一版使用 1D BlendTree：

```json
{
  "state": "Move",
  "movementProfileId": "Move_Guard_Default",
  "loop": true,
  "rootMotion": false,
  "freeMoveBlendTree": "BT_Guard_FreeMove",
  "lockMoveBlendTree": "BT_Guard_LockMove",
  "speedScaleByMoveSpeed": true,
  "minAnimSpeed": 0.75,
  "maxAnimSpeed": 1.25,
  "enterCondition": "isGrounded && moveSpeed01 > 0.05",
  "exitCondition": "moveSpeed01 <= 0.03"
}
```

速度匹配规则：

```text
animSpeed = currentMoveSpeed / clipReferenceSpeed
animSpeed = clamp(animSpeed, minAnimSpeed, maxAnimSpeed)
```

移动制作要求：

- `Walk`、`Run`、`Sprint` 的脚步周期要标注 `referenceSpeed`。
- 基础移动默认不启用 Root Motion，防止网络同步、NavMesh 和技能位移互相抢控制权。
- 锁定移动使用本地 `MoveX`、`MoveY`，不要使用世界方向直接驱动动画。
- 高速职业和大型怪物可以使用不同 `referenceSpeed`，但输出参数名保持一致。

## 7. JumpStart 起跳

`JumpStart` 是输入响应状态，不应过长。建议 4 到 8 帧内应用起跳速度。

```json
{
  "state": "JumpStart",
  "clipId": "ANI_Guard_JumpStart",
  "loop": false,
  "fadeIn": 0.04,
  "fadeOut": 0.06,
  "priority": 320,
  "applyJumpVelocityFrame": 4,
  "minPlayFrame": 3,
  "inputBufferTime": 0.12,
  "coyoteTime": 0.10,
  "canCancelToFall": true,
  "interruptAllowList": ["FallLoop", "HitReaction", "Status", "Death"]
}
```

进入条件：

```text
JumpPressed
&& isGrounded
&& !movementLocked
&& !dead
&& !hardControlled
```

如果起跳后第 1 到 2 帧被击飞或死亡，高优先级状态可以直接覆盖 `JumpStart`。

## 8. JumpUp 上升

`JumpUp` 表示角色已经离地且垂直速度仍为正。它可以是短非循环，也可以是非常短的循环姿态。

```json
{
  "state": "JumpUp",
  "clipId": "ANI_Guard_JumpUp",
  "loop": false,
  "fadeIn": 0.04,
  "fadeOut": 0.08,
  "priority": 330,
  "enterCondition": "!isGrounded && verticalVelocity > 0.1",
  "exitCondition": "verticalVelocity <= 0.1",
  "nextState": "FallLoop"
}
```

制作要求：

- 上升姿态需要和 `FallLoop` 首帧相近，避免空中切换抖动。
- 不允许在 `JumpUp` 内触发落地音效或尘土特效。
- 如果职业没有跳跃玩法，可以仍保留通用 `JumpUp`，但运行时不开放跳跃输入。

## 9. FallLoop 下落

`FallLoop` 必须循环。它既处理跳跃后的下落，也处理从平台或台阶掉落。

```json
{
  "state": "FallLoop",
  "clipId": "ANI_Guard_FallLoop",
  "loop": true,
  "fadeIn": 0.08,
  "fadeOut": 0.06,
  "priority": 340,
  "fallEnterDelay": 0.12,
  "minFallHeight": 0.45,
  "ignoreSmallStepTime": 0.12,
  "enterCondition": "!isGrounded && verticalVelocity < -0.1",
  "interruptAllowList": ["LandLight", "LandHeavy", "HitReaction", "Status", "Death"]
}
```

进入方式：

```text
跳跃后：JumpStart → JumpUp → FallLoop
平台掉落：GroundedMove / Idle → FallLoop
击飞后：Launch → AirHit / FallLoop
```

小台阶保护：

```text
如果离地时间 < 0.12 秒
并且预测落差 < 0.45 米
则不进入 FallLoop
```

## 10. LandLight 与 LandHeavy

落地状态由实际下落高度、垂直速度和受击状态决定。

```text
fallHeight < 0.45m        → 不播放落地动画，直接回 Move/Idle
0.45m <= fallHeight < 2m  → LandLight
fallHeight >= 2m          → LandHeavy
```

轻落地：

```json
{
  "state": "LandLight",
  "clipId": "ANI_Guard_LandLight",
  "loop": false,
  "fadeIn": 0.03,
  "fadeOut": 0.08,
  "priority": 350,
  "maxFallHeight": 2.0,
  "canCancelToMoveFrame": 5,
  "canCancelToSkillFrame": 8,
  "eventFrames": [
    {"frame": 2, "track": "SFX", "eventType": "PlaySFX", "id": "SFX_Land_Light"},
    {"frame": 2, "track": "VFX", "eventType": "SpawnVFX", "id": "VFX_Dust_LandLight"}
  ]
}
```

重落地：

```json
{
  "state": "LandHeavy",
  "clipId": "ANI_Guard_LandHeavy",
  "loop": false,
  "fadeIn": 0.03,
  "fadeOut": 0.12,
  "priority": 380,
  "minFallHeight": 2.0,
  "lockMoveTime": 0.25,
  "canCancelToMoveFrame": 12,
  "eventFrames": [
    {"frame": 2, "track": "SFX", "eventType": "PlaySFX", "id": "SFX_Land_Heavy"},
    {"frame": 2, "track": "VFX", "eventType": "SpawnVFX", "id": "VFX_Dust_LandHeavy"},
    {"frame": 3, "track": "Camera", "eventType": "CameraShake", "id": "Shake_Land_Heavy"}
  ]
}
```

落地后回到：

```text
如果 MoveSpeed01 > 0.05 → Move
否则如果 InCombat → CombatIdle
否则 → Idle
```

## 11. Spawn 出生

`Spawn` 用于怪物、Boss、召唤物和剧情单位。玩家复活可使用 `Spawn`，也可使用独立复活动画。

```json
{
  "state": "Spawn",
  "clipId": "ANI_Monster_Spawn_GroundRise",
  "loop": false,
  "fadeIn": 0.0,
  "fadeOut": 0.12,
  "priority": 360,
  "invincibleDuringSpawn": true,
  "lockAIUntilEnd": true,
  "disableHurtboxUntilFrame": 10,
  "enableNavAgentFrame": 18,
  "eventFrames": [
    {"frame": 1, "track": "VFX", "eventType": "SpawnVFX", "id": "VFX_Spawn_GroundCrack"},
    {"frame": 6, "track": "SFX", "eventType": "PlaySFX", "id": "SFX_Monster_Spawn"}
  ],
  "nextState": "Idle"
}
```

制作要求：

- 刷怪动画开始时不能立即造成伤害，除非该单位配置了专门的出生攻击技能。
- `lockAIUntilEnd` 为 true 时，AI 不允许在 Spawn 未结束前移动或释放技能。
- Boss 开场动画如果带镜头、字幕或阶段事件，应放在独立 Boss Intro Timeline，不塞进普通 Spawn。

## 12. Death 死亡

`Death` 优先级最高。进入死亡后必须停止移动、取消未生效的普通技能、关闭 AI 决策，并在配置帧触发掉落或场景事件。

```json
{
  "state": "Death",
  "clipId": "ANI_Monster_Death_Back",
  "loop": false,
  "fadeIn": 0.05,
  "fadeOut": 0.0,
  "priority": 1000,
  "selectByHitDirection": true,
  "disableMovementOnEnter": true,
  "disableAIOnEnter": true,
  "disableColliderFrame": 12,
  "dropLootFrame": 20,
  "notifyQuestFrame": 20,
  "ragdollFrame": -1,
  "despawnDelay": 3.0,
  "eventFrames": [
    {"frame": 8, "track": "SFX", "eventType": "PlaySFX", "id": "SFX_Monster_Death"},
    {"frame": 20, "track": "Gameplay", "eventType": "DropLoot", "id": "Loot_Default"}
  ]
}
```

死亡方向选择：

| 受击方向 | 优先 Clip | 降级 |
|---|---|---|
| Front | `Death_Front` | `Death_Default` |
| Back | `Death_Back` | `Death_Default` |
| Left | `Death_Left` | `Death_Default` |
| Right | `Death_Right` | `Death_Default` |
| Execute | `Death_Execute` | `Death_Default` |

制作要求：

- `Death` 不得循环。
- 死亡掉落只触发一次，重复进入死亡请求必须被忽略。
- Boss 死亡事件要同时通知战斗区域、任务目标、地图出口和奖励系统。
- 如果使用溶解死亡，材质表现和尸体清理时间要和 `despawnDelay` 对齐。

## 13. 转场规则

| From | To | 条件 | Fade | 说明 |
|---|---|---|---:|---|
| Spawn | Idle | Spawn 播放结束，未进入战斗 | 0.12 | 普通怪物生成后待机。 |
| Spawn | CombatIdle | Spawn 播放结束，已有仇恨 | 0.10 | 战斗刷怪。 |
| Idle | Move | `MoveSpeed01 > 0.05` | 0.12 | 起步要轻。 |
| Move | Idle | `MoveSpeed01 <= 0.03 && !InCombat` | 0.12 | 停止移动。 |
| Move | CombatIdle | `MoveSpeed01 <= 0.03 && InCombat` | 0.10 | 战斗停步。 |
| Idle/Move | JumpStart | `JumpPressed && CanJump` | 0.04 | 玩家跳跃。 |
| JumpStart | JumpUp | `JumpVelocityApplied` | 0.04 | 起跳完成。 |
| JumpUp | FallLoop | `VerticalVelocity <= 0.1` | 0.06 | 进入下落。 |
| Idle/Move | FallLoop | `!IsGrounded && FallDelayPassed` | 0.08 | 高处掉落。 |
| FallLoop | LandLight | `Grounded && FallHeight < heavyThreshold` | 0.03 | 轻落地。 |
| FallLoop | LandHeavy | `Grounded && FallHeight >= heavyThreshold` | 0.03 | 重落地。 |
| Any | Death | `Health <= 0` | 0.05 | 最高优先级。 |

## 14. Animator 参数

基础动画第一版要求以下参数存在：

```text
MoveSpeed          float
MoveSpeed01        float
MoveX              float
MoveY              float
VerticalVelocity   float
TurnAngle          float
IsMoving           bool
IsSprinting        bool
IsLockedOn         bool
IsGrounded         bool
InCombat           bool
JumpPressed        trigger
Spawn              trigger
Death              trigger
```

参数写入归属：

| 参数 | 写入方 |
|---|---|
| 移动速度、移动方向 | `PlayerMovementController` / AI 移动控制器 |
| 是否锁定 | 锁定系统 |
| 是否在战斗 | 战斗状态机 / 仇恨系统 |
| 跳跃触发 | 输入系统 / 移动控制器 |
| 死亡触发 | `HealthComponent` |
| Spawn 触发 | 生成系统 |

## 15. 完整基础 Profile 示例

```json
{
  "baseProfileId": "Base_Guard",
  "states": {
    "spawn": "ANI_Guard_Spawn",
    "idle": "ANI_Guard_Idle_01",
    "combatIdle": "ANI_Guard_CombatIdle_Shield",
    "move": "Move_Guard_Default",
    "jumpStart": "ANI_Guard_JumpStart",
    "jumpUp": "ANI_Guard_JumpUp",
    "fallLoop": "ANI_Guard_FallLoop",
    "landLight": "ANI_Guard_LandLight",
    "landHeavy": "ANI_Guard_LandHeavy",
    "death": "Death_Guard_Default"
  },
  "defaultFade": 0.12,
  "groundedSmallStepGrace": 0.12,
  "lightLandMinHeight": 0.45,
  "heavyLandMinHeight": 2.0,
  "combatIdleHoldTime": 4.0,
  "fallbackProfileId": "Base_Humanoid_Default"
}
```

## 16. 校验规则

基础动画配置保存前必须检查：

- `Idle`、`CombatIdle`、`Move`、`FallLoop` 的 `loop` 必须为 true。
- `Spawn`、`LandLight`、`LandHeavy`、`Death` 的 `loop` 必须为 false。
- `Death` 必须存在，且优先级必须高于所有基础状态。
- `FallLoop` 必须可由 `JumpUp` 和高处掉落进入。
- `LandHeavy.minFallHeight` 必须大于 `LandLight.maxFallHeight` 或使用同一个阈值边界。
- 所有 `eventFrames.frame` 必须小于对应 Clip 的 `lengthFrame`。
- `dropLootFrame`、`disableColliderFrame` 只能出现在 Death 或专门允许的状态中。
- `Move` 引用的 BlendTree 必须存在，且至少包含 Idle/Walk/Run 三档或等价阈值。
- 所有 Clip 的骨架类型必须和 `UnitAnimationSet.skeletonType` 兼容。

## 17. 验收标准

- 单位生成后能播放 Spawn，并在结束后进入 Idle 或 CombatIdle。
- 待机循环自然，随机变体不会让角色位移。
- 从静止到移动、移动到停止没有明显跳变。
- 锁定移动能正确表现前后左右移动。
- 起跳、上升、下落、落地阶段清晰。
- 从高处掉落能直接进入 FallLoop。
- 小台阶不会频繁触发 FallLoop。
- 轻落地和重落地能按高度区分，并触发对应 SFX/VFX。
- 死亡动画优先级最高，能在指定帧关闭碰撞、掉落奖励并清理单位。
