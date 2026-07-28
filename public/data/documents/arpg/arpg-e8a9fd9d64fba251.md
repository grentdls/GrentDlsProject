# Gameplay 预制体结构：单位、掉落物、地图机关

---

## 1. Prefab 设计原则

所有 Gameplay 对象必须满足：

- 数据配置和表现分离。
- Runtime 实例有唯一 ID。
- 可池化。
- 可被调试面板定位。
- 不同系统通过组件组合实现，不做巨型脚本。

---

## 2. 玩家 Prefab

```text
PF_Player
  PlayerRoot
    CharacterController
    Rigidbody(optional)
    CapsuleCollider
    PlayerInput
    EntityIdentity
    EntityStats
    AttributeAggregator
    HealthComponent
    ResourceComponent
    ResistanceComponent
    PlayerMovementController
    PlayerCombatController
    PlayerSkillController
    SkillLoadoutComponent
    EquipmentComponent
    InventoryComponent
    BuffController
    AilmentController
    TargetLockController
    InteractionController
    AnimationEventReceiver
    AudioEmitter
    VFXEmitter
    ModelRoot
      Body
      Hair
      ArmorParts
      WeaponSocket_R
      WeaponSocket_L
      BackSocket
      FootstepSocket_L
      FootstepSocket_R
    HitboxRoot
      BodyHurtbox
      HeadHurtbox
      WeaponHitbox
    SensorRoot
      GroundSensor
      TargetSensor
      InteractSensor
    UIAnchor
    CameraTarget
```

---

## 3. 怪物 Prefab

```text
PF_Monster_Base
  MonsterRoot
    EntityIdentity
    NavMeshAgent / CustomMover
    CapsuleCollider
    EntityStats
    AttributeAggregator
    HealthComponent
    ResistanceComponent
    MonsterAIController
    MonsterSkillController
    AggroComponent
    LootDropComponent
    BuffController
    AilmentController
    HitReactionController
    AnimationEventReceiver
    AudioEmitter
    VFXEmitter
    ModelRoot
    HitboxRoot
      Hurtbox_Main
      AttackHitbox_01
    SensorRoot
      VisionSensor
      AttackRangeSensor
    UIAnchor
      EliteIconAnchor
      HealthBarAnchor
```

---

## 4. Boss Prefab

```text
PF_Boss_Base
  BossRoot
    EntityIdentity
    BossController
    BossPhaseController
    BossArenaBinder
    BossSkillController
    BossAIController
    BossWeakPointController
    BossHealthComponent
    BossLootDropComponent
    AttributeAggregator
    BuffController
    AilmentController
    TimelineDirector(optional)
    ModelRoot
      MainMesh
      WeakPoint_Head
      WeakPoint_Arm_L
      WeakPoint_Arm_R
      CoreSocket
    HitboxRoot
      Hurtbox_Body
      Hurtbox_WeakPoint_Head
      SkillHitboxRoot
    TelegraphRoot
      GroundCirclePrefabPool
      LineWarningPrefabPool
      ConeWarningPrefabPool
    VFXRoot
    SFXRoot
    UIAnchor
```

---

## 5. 装备掉落物 Prefab

```text
PF_WorldItem
  WorldItemRoot
    EntityIdentity
    WorldItemController
    ItemPickupComponent
    Rigidbody
    Collider
    ItemVisualController
    ItemLabelBinder
    AudioEmitter
    VFXEmitter
    ModelRoot
      ItemMesh / IconBillboard
    LightBeam
    ShadowBlob
```

### 5.1 掉落表现规则

- 普通物品：轻微弹跳，短光。
- 稀有物品：更明显落地音效，黄光。
- Relic：落地延迟、橙色光柱、特殊音效。
- 地图钥石：紫/青色竖向光。
- 材料：小型旋转图标，清脆音。

---

## 6. 投射物 Prefab

```text
PF_Projectile_Base
  ProjectileRoot
    ProjectileController
    ProjectileMovement
    DamageDealer
    HitDetector
    PierceComponent(optional)
    ChainComponent(optional)
    SplitComponent(optional)
    HomingComponent(optional)
    LifetimeComponent
    PoolableObject
    VFXRoot
      Trail
      ImpactVFX
    SFXRoot
```

字段：

```text
Speed
Acceleration
MaxDistance
CanPierce
PierceCount
CanChain
ChainCount
CanSplit
HomingStrength
HitRadius
```

---

## 7. 范围技能 Prefab

```text
PF_AreaSkill
  AreaRoot
    AreaSkillController
    DamageOverTimeZone(optional)
    PeriodicHitComponent(optional)
    BuffZoneComponent(optional)
    Collider
    LifetimeComponent
    VFXRoot
    SFXRoot
```

类型：

- 瞬时爆炸。
- 延迟爆炸。
- 持续地面伤害。
- 光环区域。
- 陷阱区域。
- 召唤区域。

---

## 8. 地面提示 Prefab

```text
PF_Telegraph_Circle
  TelegraphRoot
    TelegraphController
    DecalProjector / MeshRenderer
    FillAnimation
    ColorByDamageType
    DangerPulse
```

```text
PF_Telegraph_Line
  TelegraphRoot
    LineRenderer / Mesh
    WidthController
    LengthController
    FillAnimation
```

规则：

- 所有高伤技能必须有提示。
- 提示时间和危险程度匹配。
- 颜色表示伤害类型。
- Boss 终结技需要音效 + 屏幕边缘提示。

---

## 9. 地图机关 Prefab

### 9.1 宝箱

```text
PF_LootChest
  ChestRoot
    Interactable
    LootContainer
    Animator
    AudioEmitter
    VFXEmitter
    Collider
    UIAnchor
```

### 9.2 机制核心

```text
PF_MapMechanicCore
  MechanicRoot
    Interactable
    MechanicController
    SpawnController
    RewardController
    DifficultyScaler
    TimerComponent
    VFXRoot
    UIAnchor
```

### 9.3 传送门

```text
PF_Portal
  PortalRoot
    PortalController
    Interactable
    DestinationData
    Animator
    VFXLoop
    AudioLoop
    PortalLabel
```

---

## 10. 地图 Tile Prefab

```text
PF_MapTile_Base
  TileRoot
    TileMeta
      TileId
      TileType
      ConnectorPoints[]
      SpawnPointGroups[]
      EventPointGroups[]
    Geometry
    Collision
    NavMeshSurface / NavMeshLink
    LightingProbes
    VFXAmbient
    AudioZone
    Props
    Blockers
```

Tile 类型：

- Start。
- Corridor。
- Arena。
- BranchRoom。
- EventRoom。
- BossRoom。
- RewardRoom。
- Exit。

---

## 11. 可交互对象接口

```text
IInteractable
  CanInteract(Player)
  GetInteractPrompt()
  Interact(Player)
```

交互对象包括：

- NPC。
- 宝箱。
- 地图机制。
- 传送门。
- 可拾取物。
- 机关。
- 任务物品。

---

## 12. PoolableObject 标准

```text
OnSpawn()
OnDespawn()
ResetRuntimeState()
ReturnToPool()
```

必须池化：

- 投射物。
- 地面提示。
- 飘字。
- 小型 VFX。
- 掉落标签。
- 常见怪物。

Boss 不强制池化。

---

## 13. 验收标准

- 任意怪物可以只换 MonsterData 和模型生成新怪。
- 任意投射物可以通过组件组合支持穿透/连锁/分裂。
- 地图机制可以独立拖入任意地图 Tile 测试。
- 地面提示统一，不允许每个 Boss 单独乱做。
- 掉落物在 200 个同时存在时不明显掉帧。
