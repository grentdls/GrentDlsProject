# 146 角色单位动画配置总览：AnimationConfig 体系

## 1. 文档定位

AnimationConfig 是角色单位动画的总配置层，负责把单位、骨架、Animator、基础动作、技能 Timeline、受击表现和状态动画连成一套可校验、可预览、可运行的数据体系。

本体系不直接替代 Animator Controller，也不把所有动画逻辑硬写进代码。它的职责是：

- 为每个玩家职业、怪物、Boss、召唤物、NPC 指定一套 `UnitAnimationSet`。
- 统一管理基础动画、技能动画、受击动画、状态动画和死亡动画。
- 让策划可以通过配置修改动画 Clip、触发帧、融合时间、打断规则和事件轨道。
- 让运行时可以根据单位状态、武器、锁定模式、技能阶段和受击来源稳定选择动画。
- 让编辑器可以检查资源缺失、循环错误、事件越界、优先级冲突和 Prefab 绑定错误。

## 2. 设计原则

| 原则 | 说明 |
|---|---|
| Clip 与 State 分离 | `AnimationClipTable` 只描述资源，`BaseAnimationStateTable` 描述状态行为，避免一个 Clip 被多个状态复用时配置互相污染。 |
| 单位只引用集合 | `UnitAnimationSetTable` 只引用基础、移动、技能、受击、状态等 Profile，不在单位表内堆全部字段。 |
| 基础移动走 Animator/BlendTree | 待机、行走、跑步、锁定移动、跳跃下落等高频动作优先用 Animator 参数和 BlendTree。 |
| 技能走 Timeline/Playable | 有伤害帧、位移帧、特效音效帧、取消窗口的技能使用 SkillTimeline。 |
| 高优先级表现可覆盖 | 死亡、处决、击飞、冰冻、眩晕等表现可以覆盖基础移动和普通技能。 |
| 配置必须可降级 | 缺少职业专属动画时，按武器、骨架、通用 Humanoid、原型 fallback 顺序查找。 |

## 3. 总体架构

```text
UnitAnimationSet
├── Metadata
│   ├── unitId
│   ├── skeletonType
│   ├── unitCategory
│   ├── weaponProfile
│   └── fallbackSetId
├── BaseAnimationSet
│   ├── Spawn
│   ├── Idle / CombatIdle
│   ├── MoveProfile
│   ├── JumpFallLandProfile
│   └── DeathProfile
├── SkillTimelineSet
│   ├── FullClip
│   ├── StartupLoopEnd
│   ├── ChargeRelease
│   ├── ComboChain
│   └── Channel
├── HitReactionSet
│   ├── DirectionalHit
│   ├── AirHit
│   ├── Knockback
│   ├── Launch
│   ├── Knockdown
│   └── PoiseBreak
├── StatusAnimationSet
│   ├── Bound
│   ├── Frozen
│   ├── Stunned
│   ├── Sleep
│   ├── Fear
│   └── Burning / Poison / Curse
├── TransitionRuleSet
├── AnimationPriorityTable
└── RuntimeBinding
    ├── Animator
    ├── PlayerAnimationController / UnitAnimationController
    ├── AnimationEventReceiver
    ├── SkillPresentationController
    └── HitReactionController / AilmentController
```

## 4. 运行时加载流程

```text
单位生成
→ 读取 unitId / monsterId / bossId / summonId
→ UnitAnimationResolver 查找 UnitAnimationSet
→ 校验骨架、Animator、Clip、Timeline、事件接收器
→ 绑定 Animator 参数和运行时组件
→ 进入 Spawn 或 Idle
→ 运行时根据状态机和优先级播放动画
```

运行时必须遵守以下规则：

- `HealthComponent` 进入死亡时，动画层立刻切到 `Death`，并阻止普通技能、移动和低优先级受击继续请求播放。
- `PlayerMovementController`、AI 移动和 NavMesh 只写移动参数，不直接播放 Clip。
- `PlayerSkillController`、`MonsterSkillController`、`BossSkillController` 只请求 `SkillTimeline`，不直接写基础状态。
- `AnimationEventReceiver` 统一接收动画帧事件，再转发给伤害、VFX、SFX、位移、镜头和掉落系统。

## 5. 配置命名规范

| 类型 | 前缀 | 示例 |
|---|---|---|
| 单位动画集合 | `AnimSet_` | `AnimSet_Player_Guard` |
| 动画 Clip | `ANI_` | `ANI_Guard_Run_01` |
| 基础状态 Profile | `Base_` | `Base_Humanoid_Guard` |
| 移动 BlendTree | `BT_` | `BT_Guard_FreeMove` |
| 跳跃下落 Profile | `Air_` | `Air_Humanoid_Default` |
| 技能 Timeline | `TL_` | `TL_Guard_ShieldCharge` |
| Timeline 片段 | `SEG_` | `SEG_ShieldCharge_Startup` |
| Timeline 事件组 | `EVT_` | `EVT_ShieldCharge_01` |
| 受击集合 | `HitSet_` | `HitSet_Humanoid_Normal` |
| 状态动画集合 | `StatusSet_` | `StatusSet_Humanoid_Default` |
| 转场规则 | `TR_` | `TR_Base_To_Fall` |

推荐命名结构：

```text
ANI_{RoleOrRace}_{Action}_{Variant}
TL_{RoleOrMonster}_{SkillKey}
BT_{RoleOrRace}_{FreeMove|LockMove}
HitSet_{SkeletonType}_{BodySize}_{Rank}
```

## 6. 核心数据表

```text
UnitAnimationSetTable
AnimationClipTable
BaseAnimationStateTable
MovementBlendTreeTable
JumpFallLandTable
SkillTimelineTable
SkillTimelineSegmentTable
SkillTimelineEventTable
HitReactionSetTable
StatusAnimationTable
AnimationTransitionRuleTable
AnimationPriorityTable
AnimationFallbackTable
AnimationValidationRuleTable
```

`UnitAnimationSetTable` 示例：

```json
{
  "unitId": "Player_Guard",
  "animationSetId": "AnimSet_Player_Guard",
  "unitCategory": "Player",
  "skeletonType": "Humanoid",
  "weaponProfile": "OneHandShield",
  "baseStateProfile": "Base_Guard",
  "movementBlendTree": "BT_Guard_FreeMove",
  "lockMoveBlendTree": "BT_Guard_LockMove",
  "jumpFallLandProfile": "Air_Humanoid_Default",
  "skillTimelineSet": "SkillTL_Guard",
  "hitReactionSet": "HitSet_Humanoid_Medium",
  "statusAnimationSet": "StatusSet_Humanoid_Default",
  "deathProfile": "Death_Humanoid_Medium",
  "fallbackSetId": "AnimSet_Humanoid_Default"
}
```

`AnimationClipTable` 示例：

```json
{
  "clipId": "ANI_Guard_Run_01",
  "clipPath": "Assets/_Game/Characters/Guard/Animations/Run_01.anim",
  "displayName": "守卫跑步01",
  "category": "Base",
  "skeletonType": "Humanoid",
  "loop": true,
  "fps": 30,
  "lengthFrame": 32,
  "speed": 1.0,
  "referenceSpeed": 4.8,
  "rootMotion": false,
  "mirror": false,
  "tags": ["Grounded", "Move", "Run"]
}
```

## 7. 动画层级

| 层级 | 用途 | 是否覆盖下层 |
|---|---|---|
| Base FullBody | 待机、移动、跳跃、下落、落地、出生 | 否 |
| Skill FullBody | 近战、冲刺、重击、翻滚类技能 | 覆盖基础层 |
| Skill UpperBody | 可移动释放的射击、施法、战吼 | 覆盖上半身 |
| Additive Aim | 瞄准、看向目标、持弓姿态修正 | 叠加 |
| Hit Override | 轻中重受击、破韧、击退 | 覆盖技能和基础层，受优先级限制 |
| Status Override | 冰冻、眩晕、束缚、睡眠 | 覆盖技能和基础层 |
| Death Override | 死亡、处决、溶解死亡 | 覆盖全部 |

第一版可以只实现 `Base FullBody`、`Skill FullBody`、`Hit Override`、`Status Override`、`Death Override`。上半身和 Additive 层可作为第二版扩展。

## 8. 优先级规则

数值越高越优先。

| 类型 | 建议优先级 | 说明 |
|---|---:|---|
| Death | 1000 | 不可被打断，清理移动和技能请求。 |
| Execute / Fatality | 950 | 处决动画，通常只被 Death 打断。 |
| Frozen / Petrified | 860 | 高级控制，暂停或覆盖多数动作。 |
| Launch / Knockdown | 820 | 击飞、击倒，覆盖普通受击和技能。 |
| Stunned / Bound / Sleep | 760 | 控制状态，按状态规则决定是否可被受击打断。 |
| PoiseBreak | 700 | 破韧硬直，打开输出窗口。 |
| HeavyHit | 620 | 重受击。 |
| SkillForcedSegment | 560 | 技能不可取消段。 |
| SkillNormalSegment | 500 | 普通技能段。 |
| Jump / Fall / Land | 320 | 空中状态。 |
| Move | 200 | 移动 BlendTree。 |
| Idle / CombatIdle | 100 | 最低基础状态。 |

冲突解决逻辑：

```text
收到动画请求
→ 如果当前状态 locked 且新请求优先级不足，拒绝
→ 如果新请求 priority 更高，按 interruptFadeOut 融出当前状态
→ 如果同优先级，检查 canInterruptSamePriority
→ 如果低优先级，但当前状态开放 cancelWindow，可以进入允许列表内状态
→ 否则排队或丢弃
```

## 9. 动画查找与降级

动画查找必须使用确定性的降级顺序，避免不同机器或不同运行顺序得到不同结果。

```text
单位专属动画
→ 职业/怪物类型动画
→ 武器类型动画
→ 骨架通用动画
→ Humanoid 通用动画
→ Prototype/Fallback 动画
```

示例：

```text
Player_Guard + ShieldCharge
→ ANI_Guard_ShieldCharge
→ ANI_OneHandShield_ShieldCharge
→ ANI_Humanoid_Charge
→ ANI_Prototype_Attack
```

降级时必须写入日志：

```text
[AnimationFallback] Player_Guard missing ANI_Guard_ShieldCharge, use ANI_OneHandShield_ShieldCharge.
```

## 10. 动画事件契约

动画事件统一使用帧或归一化时间配置。第一版推荐帧，因为技能、伤害、音效、特效更容易对齐。

```json
{
  "eventId": "EVT_Guard_HeavySlash_Hit_01",
  "sourceType": "SkillTimeline",
  "sourceId": "TL_Guard_HeavySlash",
  "frame": 18,
  "track": "Damage",
  "eventType": "ApplyDamage",
  "payloadId": "DMG_Guard_HeavySlash"
}
```

事件接收要求：

- `AnimationEventReceiver` 只做事件分发，不直接写大量业务逻辑。
- 同一帧多个事件按 `trackOrder` 执行：State → Movement → Hitbox → Damage → VFX → SFX → Camera → UI。
- 事件必须可重复保护，同一 `eventInstanceId` 不得重复生效。
- 客户端表现事件可以预测，伤害和掉落事件必须由战斗逻辑确认。

## 11. Prefab 绑定要求

每个可战斗单位 Prefab 至少包含：

```text
UnitRoot
├── Animator
├── PlayerAnimationController / UnitAnimationController
├── AnimationEventReceiver
├── EntityIdentity
├── HealthComponent
├── Hurtbox
├── HitReactionController
├── AilmentController
└── SkillPresentationController
```

玩家、怪物、Boss 可以有不同控制器，但绑定字段要统一：

| 字段 | 用途 |
|---|---|
| `animationSetId` | 指向 UnitAnimationSet。 |
| `animator` | 运行时 Animator。 |
| `eventReceiver` | 接收动画事件。 |
| `skillSocketRoot` | 技能特效挂点。 |
| `hitSocketRoot` | 受击特效挂点。 |
| `runtimeDebugName` | 编辑器和日志显示。 |

## 12. 编辑器制作流程

```text
导入动画 Clip
→ 填写 AnimationClipTable
→ 建立 BaseAnimationState / MovementBlendTree / JumpFallLand
→ 建立 SkillTimeline / HitReaction / StatusAnimation
→ 建立 UnitAnimationSet
→ 绑定到 Prefab
→ 编辑器校验
→ 预览基础动作和技能 Timeline
→ 导出 JSON 或 ScriptableObject
```

编辑器至少要提供：

- Clip 缺失扫描。
- Loop 配置扫描。
- 事件帧越界扫描。
- 同一状态多 Clip 权重总和扫描。
- Animator 参数缺失扫描。
- Prefab 缺少 `AnimationEventReceiver` 扫描。
- `Death`、`FallLoop`、`Idle` 等必需状态扫描。
- Timeline 事件轨道可视化预览。

## 13. 最小闭环

第一版必须支持：

```text
待机循环
战斗待机
移动循环
锁定移动
起跳
上升
下落循环
轻落地
重落地
出生
死亡
完整技能动画
技能第 N 帧开判定
技能第 N 帧出伤害
技能第 N 帧播特效
技能第 N 帧播音效
技能取消窗口
四方向受击
束缚持续动画
动画配置校验
```

## 14. 与后续文档关系

| 文档 | 负责内容 |
|---|---|
| 147 | 基础动画配置：待机、移动、跳跃、下落、落地、出生、死亡。 |
| 148 | 移动 BlendTree、锁定移动、转向、速度匹配。 |
| 149 | 技能 Timeline 模式：完整、前摇循环结束、蓄力、引导、连段。 |
| 150 | Timeline 事件轨道：伤害、Hitbox、VFX、SFX、位移、镜头。 |
| 151 | 受击、击退、击飞、击倒、破韧。 |
| 152 | 束缚、冰冻、眩晕等状态动画。 |
| 153 | 融入融出、取消窗口、打断优先级。 |
| 154 | Prefab 结构和运行时组件绑定。 |
| 155 | 数据表和 JSON 示例。 |
| 156 | 编辑器界面、预览、校验。 |
| 157 | 制作任务清单和验收标准。 |

## 15. 验收标准

- 任意玩家职业可以通过 `UnitAnimationSet` 找到基础动作、移动 BlendTree、跳跃下落、死亡、技能 Timeline。
- 任意怪物至少有 Spawn、Idle、Move、Hit、Death 五类动画配置。
- 缺少专属动画时，能按固定顺序降级到通用动画，并输出清晰日志。
- 死亡优先级最高，能终止移动、技能和普通受击动画。
- 技能 Timeline 可以通过事件轨道驱动伤害、特效、音效和取消窗口。
- 编辑器能发现 Clip 缺失、事件越界、Loop 错误、Prefab 绑定缺失。
