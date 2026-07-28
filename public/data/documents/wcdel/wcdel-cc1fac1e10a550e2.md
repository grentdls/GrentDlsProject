# 战斗命中去重与敌人逻辑平面同步

## 本次目标

继续优化战斗手感与公平性，重点处理两个运行时问题：

- 同一次近战或范围技能命中多个 Collider 时，可能对同一单位重复结算伤害和反馈。
- 玩家已切到 X/Z 逻辑地面、Y 作为跳跃高度后，敌人索敌和攻击距离仍容易把世界 Y 当成地面距离。

## 命中去重

- `MeleeAttackEmitter` 会按 `IDamageable.transform` 对同一次攻击命中的目标去重。
- `AreaSkillEmitter` 会按同样规则去重，避免角色身上多个 HurtBox / Collider 导致一次范围技能重复扣血。
- 去重只限制同一次发射，不影响真正的多段技能、持续区域 Tick 或后续攻击帧。

## 攻击者反馈聚合

- 近战和范围技能现在不再每命中一个目标都播放一次攻击者侧反馈。
- 同一次攻击会先结算所有目标，再按本次命中的最高 `HitImpactLevel` 聚合一次攻击者反馈。
- 这样可以减少多目标命中时的重复震屏、重复音效和过度 HitStop，保留“打中一群怪”的爽感但不炸反馈。

## 敌人逻辑平面

- `SimpleEnemyController2D` 的索敌距离、追击方向和近战攻击距离改为使用目标的逻辑平面位置。
- `SimpleRangedEnemyController2D` 的索敌距离、保持距离和发射方向也改为使用目标逻辑平面位置。
- 目标逻辑平面通过 `WorldPresentationHeightUtility.ResolveLogicPlanePosition` 解析，兼容当前玩家 X/Z 地面、Y 跳跃高度规则。

## 远程弹体兼容

- `Projectile2D` 新增 `AssignLockedTarget(Transform target)`。
- 远程敌人发射弹体时会绑定当前目标，弹体每帧优先用 `CombatHitVolume3DUtility.SphereHitsTarget` 对锁定目标做 3D 命中体积检测。
- 旧的 2D `OverlapCircle` broadphase 仍保留，兼容未迁移到 3D 语义的敌人、场景对象和投射物逻辑。

## 影响文件

- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`

## 验证

- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 结果：0 warning / 0 error

## 后续建议

- 敌人自身移动仍保留旧 2D Rigidbody 平面兼容，后续可以继续把敌人根节点移动逐步迁移到真实 X/Z Transform 语义。
- `KnockbackReceiver2D` 和 `UnitBodyCollisionFilter2D` 仍基于 2D Rigidbody，后续迁移时应和敌人移动一起处理，避免再次出现 Y/Z 语义混用。
