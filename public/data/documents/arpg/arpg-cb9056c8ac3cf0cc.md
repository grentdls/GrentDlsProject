# 93. 碰撞与地形交互：胶囊体、坡度、台阶、墙面、悬崖


> 项目：Unity 3D ACT 刷宝 ARPG  
> 批次：第八批 - 3C 视角与操控专项  
> 目标：用第三人称自由视角 ACT 操控替代传统 2D/等距锁定视角，让玩家在刷宝、Boss 战、地牢探索中获得更强的动作控制感。  
> 参考边界：参考《永劫无间》这类第三人称动作游戏的高层 3C 思路：自由镜头、动作转向、跳跃/闪避/攀爬、锁定辅助、垂直移动与战斗镜头调度。具体参数、手感曲线、动作名称、镜头表现、输入节奏均采用本项目原创实现。


## 1. 碰撞目标

3D ACT 游戏最怕的不是动作不够多，而是角色被地形卡住、贴墙抖动、上台阶失败、斜坡滑动异常、闪避穿墙。碰撞系统必须优先保证稳定。

## 2. 角色碰撞体

### 2.1 胶囊体标准

```text
PlayerCollider
├── CapsuleCollider
│   ├── Height: 1.8m
│   ├── Radius: 0.35m
│   └── CenterY: 0.9m
├── GroundProbe
├── WallProbe
├── StepProbe
└── LedgeProbe
```

推荐不要使用 Rigidbody 完全物理驱动主角。使用 CharacterController 或自研 Kinematic Motor。外力、击退、弹飞由脚本控制。

## 3. Layer 规则

| Layer | 作用 |
|---|---|
| Terrain | 地形，可行走 |
| WorldStatic | 墙体、建筑、石头 |
| WorldDynamic | 可移动大物体 |
| Platform | 可站立平台 |
| OneWayPlatform | 单向平台，可选 |
| NoPlayerPass | 玩家不可通过 |
| NoEnemyPass | 怪物不可通过 |
| Hitbox | 攻击判定，不参与移动碰撞 |
| Trigger | 触发器 |
| Interactable | 宝箱/NPC/传送门 |

## 4. 地面检测

### 4.1 多点检测

使用 SphereCast + 多条 Raycast。

```text
GroundCheck
├── CenterSphereCast
├── FrontRay
├── BackRay
├── LeftRay
└── RightRay
```

判断 grounded：

- 中心 SphereCast 命中可行走层。
- 地面法线角度小于 `MaxSlopeAngle`。
- 与地面距离小于 `GroundSnapDistance`。

## 5. 坡度规则

| 坡度 | 行为 |
|---|---|
| 0° - 35° | 正常行走 |
| 35° - 50° | 可行走但速度降低 |
| 50° - 60° | 仅可短暂站立，容易滑落 |
| > 60° | 不可行走，视为墙面 |

斜坡速度修正：

```text
上坡速度 = 基础速度 * Lerp(1.0, 0.65, 坡度/MaxSlope)
下坡速度 = 基础速度 * Lerp(1.0, 1.15, 坡度/MaxSlope)
```

## 6. 台阶规则

### 6.1 自动上台阶

小台阶不应该要求跳跃。

| 高度 | 行为 |
|---|---|
| <= 0.25m | 自动上台阶 |
| 0.25m - 0.75m | 需要跳跃/翻越 |
| > 0.75m | 需要攀爬或绕路 |

自动台阶检测：

1. 角色前方低 Ray 命中障碍。
2. 上方 Ray 未命中。
3. 台阶顶部可站立。
4. 将角色位置平滑抬高。

### 6.2 台阶抖动处理

- 使用 GroundSnap 将角色贴地。
- 上台阶时短暂禁用重力下拉。
- 不使用刚体摩擦来解决台阶。

## 7. 墙体碰撞

角色撞墙时：

- 法线与移动方向相反，则投影移动向量到墙面切线。
- 允许沿墙滑动。
- 不允许持续向墙内挤压产生抖动。

```text
SlideDir = ProjectOnPlane(MoveDir, WallNormal)
```

## 8. 闪避碰撞

闪避不是瞬移，必须沿路径检测。

规则：

1. 闪避开始时确定目标位移。
2. 每帧 CapsuleCast 检测路径。
3. 若前方厚墙，位移截断。
4. 若前方是小怪，可按技能配置穿越或推开。
5. 若前方是 Boss/墙/大物体，不允许穿越。

| 碰撞对象 | 闪避处理 |
|---|---|
| 墙体 | 截断位移，播放撞墙减速 |
| 小怪 | 默认不可穿，部分天赋可穿 |
| 精英 | 不可穿 |
| Boss | 不可穿 |
| 可破坏物 | 可撞碎，速度衰减 |
| 宝箱/NPC | 不穿越，防止挤开 |

## 9. 边缘与悬崖

### 9.1 悬崖保护

- 普通走路不会直接从高崖滑下。
- 疾跑、闪避、跳跃允许越出边缘。
- 战斗锁定中后退到边缘时，角色会轻微减速并提示。

### 9.2 掉落处理

| 掉落高度 | 结果 |
|---|---|
| < 3m | 无伤害，轻落地 |
| 3m - 8m | 重落地，可小伤害 |
| 8m - 20m | 大伤害/倒地 |
| > 20m | 传回安全点或死亡，按地图规则 |

## 10. 地形交互点

场景中的特殊动作不要靠纯碰撞猜测，使用明确的 Interaction Marker。

```text
TraversalMarker
├── Type: Vault / Ledge / Climb / WallRun / GrapplePoint
├── EntryPoint
├── ExitPoint
├── RequiredInput
├── MaxApproachAngle
├── AnimationClip
└── CameraHint
```

## 11. 怪物与玩家碰撞

### 11.1 小怪拥挤处理

- 小怪之间可用局部避障。
- 玩家与小怪保持轻碰撞，不要完全堵死玩家。
- 小怪围攻时留出逃生缝隙。
- 精英和 Boss 可以作为硬碰撞体，增加压迫感。

### 11.2 推挤规则

| 对象 | 玩家能否推动 |
|---|---|
| 普通小怪 | 轻微推动 |
| 精英怪 | 基本不能推动 |
| Boss | 不能推动 |
| 召唤物 | 可穿过或半碰撞，避免卡玩家 |
| NPC | 不可推动，使用软阻挡 |

## 12. 调参字段

```json
{
  "capsuleHeight": 1.8,
  "capsuleRadius": 0.35,
  "groundSnapDistance": 0.28,
  "maxSlopeAngle": 50,
  "walkableSlopeAngle": 35,
  "autoStepHeight": 0.25,
  "vaultHeightMin": 0.25,
  "vaultHeightMax": 0.75,
  "wallSlideFriction": 0.15,
  "edgeProtectDropHeight": 3.0,
  "fallDamageStartHeight": 3.0,
  "fallDeathHeight": 20.0
}
```

## 13. 验收标准

- 小台阶自动通过。
- 角色贴墙移动不抖动。
- 闪避不能穿墙。
- 斜坡上角色不无故弹起。
- 跑下坡不会连续离地导致镜头抖。
- 玩家不会被召唤物或小怪完全卡死。
- Boss 作为硬碰撞时，角色仍能沿边缘滑开。

## 14. 当前 Unity 实现映射

当前第一版运行时实现已落在：

| 规则 | 实现位置 | 状态 |
|---|---|---|
| 胶囊体标准 | `PlayerMovementController.NormalizeCharacterController` | 已实现，默认 Height 1.8、Radius 0.35、CenterY 0.9 |
| CharacterController 驱动 | `PlayerMovementController` | 已实现，不使用 Rigidbody 主驱动 |
| 多点地面检测 | `ProbeGround`、`AccumulateGroundRay` | 已实现，中心 SphereCast + 前后左右 Raycast |
| 可走坡度 | `maxSlopeAngle`、`walkableSlopeAngle` | 已实现，默认 50° / 35° |
| 坡面速度修正 | `ResolveSlopeSpeedMultiplier` | 已实现，上坡降速、下坡轻微加速 |
| 地面吸附 | `groundSnapDistance` + MoveUpdate 下压 | 已实现，减少坡面连续离地 |
| 墙面滑动 | `ApplyWallSlide` | 已实现，撞墙时投影到墙面切线 |
| 闪避路径检测 | `ClipDisplacementForCollision` | 已实现，Dodge / Slide / SkillMove 均会 CapsuleCast 截断 |
| 悬崖保护 | `ShouldBlockByEdgeProtection` | 已实现，普通低速移动阻止危险迈出，疾跑/跳跃/闪避允许 |
| CharacterController 台阶 | `stepOffset` | 已实现第一版，默认 0.25m 自动小台阶 |

第一版暂未实现的扩展项：

- Vault / LedgeGrab / Climb / WallRun 仍由 96 的 TraversalMarker 系统实现。
- 掉落伤害和死亡高度暂未接入生命系统，当前只区分轻/重落地硬直。
- 小怪推挤、召唤物半碰撞、Boss 硬碰撞的精细分层需要配合 Layer 配置和怪物控制器继续细化。
- 可破坏物撞碎、软阻挡 NPC 的差异化反馈暂未接入。
