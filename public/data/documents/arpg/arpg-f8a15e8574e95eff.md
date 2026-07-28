# 154 角色单位动画 Prefab 结构：Animator、Playable、事件接收器

## 1. 玩家角色 Prefab 结构

```text
PlayerCharacterRoot
├── ModelRoot
│   ├── Mesh_Body
│   ├── Mesh_Weapon
│   ├── Mesh_Armor
│   └── Animator
├── AnimationRoot
│   ├── AnimationSetBinder
│   ├── BaseAnimationController
│   ├── SkillTimelinePlayer
│   ├── HitReactionController
│   ├── StatusAnimationController
│   ├── AnimationLayerController
│   └── AnimationEventReceiver
├── CombatRoot
│   ├── SkillCaster
│   ├── HitboxController
│   ├── DamageDealer
│   └── HitFeedbackReceiver
├── MovementRoot
│   ├── CharacterMotor
│   ├── JumpFallController
│   └── CombatDisplacementController
├── SocketRoot
│   ├── Weapon_R
│   ├── Weapon_L
│   ├── Hand_R
│   ├── Hand_L
│   ├── Foot_R
│   ├── Foot_L
│   ├── Chest
│   └── Head
└── DebugRoot
    └── AnimationDebugPanel
```

## 2. 怪物 Prefab 结构

```text
MonsterRoot
├── ModelRoot
│   └── Animator
├── AnimationRoot
│   ├── AnimationSetBinder
│   ├── MonsterBaseAnimationController
│   ├── MonsterSkillTimelinePlayer
│   ├── HitReactionController
│   ├── StatusAnimationController
│   └── AnimationEventReceiver
├── AIRoot
│   ├── BehaviorTreeRunner
│   └── MonsterSkillSelector
├── CombatRoot
│   ├── Health
│   ├── Poise
│   ├── HitFeedbackReceiver
│   └── HitboxReceiver
└── SocketRoot
```

## 3. 核心组件职责

### AnimationSetBinder
```text
unitId → animationSetId → Animator/Playable 可用 Clip
```

### BaseAnimationController
负责待机、移动、跳跃、下落、落地、出生、死亡。

### SkillTimelinePlayer
负责播放技能 Timeline、控制动画段、执行事件轨道、处理取消窗口、处理循环段退出。

### HitReactionController
负责根据 HitContext 选择受击动画、播放方向受击、播放击退/击飞/击倒、判断霸体与破韧。

### StatusAnimationController
负责播放束缚/冰冻/眩晕等状态动画，管理状态动画优先级。

## 4. Socket 命名规范

```text
Head
Chest
Back
Hand_R
Hand_L
Weapon_R
Weapon_L
Foot_R
Foot_L
Ground
Mouth
Tail
Wing_L
Wing_R
Core
WeakPoint
```

## 5. Animator Layer 建议

```text
BaseLayer         基础移动/跳跃/死亡
UpperBodyLayer    上半身施法/射击
AdditiveHitLayer  轻受击叠加
StatusLayer       状态动画
FacialLayer       表情/口型
```

## 6. 验收标准

- 玩家和怪物都能复用同一套动画组件。
- 技能 Timeline 不直接写在 Animator Controller 中。
- 受击和状态动画有独立控制器。
- 所有特效/音效都能通过 Socket 播放。
