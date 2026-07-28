# 角色 Buff 配置与运行时规则

## 目标

角色配置工具提供完整 Buff / Debuff 配置入口。Buff 不再只是 HUD 图标，而是具备持续时间、层数、触发规则和效果结算的运行时系统。

## 数据入口

- 角色配置：`CharacterConfigDefinition.Buffs`
- 单个 Buff：`CharacterBuffDefinition`
- 触发器：`CharacterBuffTriggerDefinition`
- 效果：`CharacterBuffEffectDefinition`

## Buff 基础规则

- `BuffId` 必须唯一。
- `Duration` 控制持续时间，`InfiniteDuration` 表示无限持续。
- `InitialStacks` 和 `MaxStacks` 控制初始层数与最大层数。
- `StackRefreshPolicy` 控制重复施加时刷新时间、增加层数、替换或忽略。
- `StatusEffectType`、`IsDebuff`、`Tint`、`Priority`、`ShowOnHud` 控制 HUD 显示。

## 触发规则

当前支持：

- `Interval`：间隔触发，可设置间隔、触发概率、冷却、施加时立即触发。
- `OnOwnerHit`：持有者受击时触发。
- `OnOwnerAttack`：持有者攻击或技能命中时触发。
- `OnOwnerMove`：持有者移动时触发，可设置移动距离阈值。
- `OnOwnerJump`：持有者开始跳跃时触发。
- `OnApply`：Buff 被施加时触发。
- `OnExpire`：预留到期触发。

## 效果规则

当前支持：

- `HealHealth`：为持有者回血。
- `RestoreEnergy`：恢复玩家能量/法力。
- `AreaDamage`：以持有者为中心造成范围伤害。
- `DamageOverTime`：持续伤害，通常配合 `Interval` 触发。
- `GrantShield`：获得护盾。
- `ApplyStatusIcon`：附加一个 HUD 状态图标。
- `RemoveSelf`：触发后移除自身。

## 伤害归属

伤害类效果需要配置来源字段：

- `SourceBuffId`：本次伤害对应的 Buff ID。为空时默认使用持有者身上的运行时 Buff ID。
- `DamageLabel`：跳字/伤害标签。为空时 Debuff 伤害默认显示 Buff 名称，普通 Buff 伤害不强制覆盖标签。
- 运行时会把 `SourceBuffId` 写入 `DamageRequest.SourceBuffId`，方便后续跳字、日志、统计、触发器和抗性系统区分伤害来源。

## 运行时接入

- `CombatStatusController` 负责 Buff 持续时间、层数、触发器计时、效果执行和 HUD 状态同步。
- `CharacterConfigRuntimeBridge` 会在应用角色配置时，把角色配置里的启用 Buff 施加到单位身上。
- `Health` 在受击后通知 `OnOwnerHit`。
- `MeleeAttackEmitter`、`AreaSkillEmitter`、`Projectile2D` 在命中后通知 `OnOwnerAttack`。
- `TopDownCharacterMotor2D` 在移动输入时通知 `OnOwnerMove`。
- `PlayerJumpController` 在跳跃开始时通知 `OnOwnerJump`。

## 当前边界

- Buff 属性加成字段已预留在配置体系外，当前主要完成触发与效果结算闭环。
- `OnExpire` 触发类型已进入枚举，后续可在移除/到期时补执行。
- 范围伤害当前使用默认 2D OverlapCircle 收集目标，并通过现有 3D 命中/伤害请求链路结算。

## 命中施加 Buff 规则

- 通用施加配置使用 `CharacterBuffApplyDefinition`，字段包含启用、施加 ID、Buff 引用、层数、概率和“必须造成伤害后才施加”。
- 普攻 / 动作伤害段通过 `CharacterDamageEventDefinition.ApplyBuffsOnHit` 配置命中敌人后施加 Buff。
- 技能范围伤害通过 `CharacterSkillEntryDefinition.ApplyBuffsOnHit` 配置命中敌人后施加 Buff。
- 投射物伤害通过 `CharacterProjectileDefinition.ApplyBuffsOnHit` 配置命中敌人后施加 Buff。
- 动作帧事件通过 `CharacterFrameEventDefinition.SelfBuffs` 配置第 X 帧给自己施加 Buff，事件类型选择 `ApplyBuff` 或 `ApplyDebuff`。
- 运行时统一由 `CombatBuffApplyUtility` 调用目标身上的 `CombatStatusController.ApplyBuff`，目标没有状态控制器时会自动补一个，避免临时敌人或召唤物漏接 Buff。

## Buff 图标与持续伤害配置补充

- 单位头顶 HUD 的 Buff 图标优先读取 `CharacterBuffDefinition.Icon`。如果未配置 Icon，才回退到状态类型的文字缩写和颜色块。
- 配置灼烧、中毒、流血等持续伤害时，推荐使用角色配置工具 Buff 页的“新增灼烧模板 / 新增中毒模板”。
- 手动配置持续伤害的规则是：触发器选择“按间隔触发”，设置“每隔多少秒触发一次”；效果选择“持续伤害”，目标选择“持有者自身”，然后配置每次伤害、伤害类型、元素类型和跳字标签。
- Buff 编辑器中 Buff 触发器、效果、目标、状态类型、伤害类型、元素类型和重复施加规则都必须使用中文显示；代码枚举仍保留英文命名，避免破坏序列化和运行时逻辑。
