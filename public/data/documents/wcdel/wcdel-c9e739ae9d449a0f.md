# Combat Damage Number Unit HUD Buff Feedback Sync

## 目标

把现有战斗链路升级为统一的战斗反馈层，让单位受击后可以同时驱动：

- 伤害跳字
- 治疗/免疫/抵抗提示
- 单位头顶 HUD
- 即时血条与延迟扣血层
- Buff / Debuff 图标与持续时间环

## 本次实现

### 统一反馈事件

- `Health` 新增 `FeedbackRaised` 事件，统一抛出 `HealthFeedbackEvent`
- 事件中包含：
  - 反馈类型：伤害、治疗、护盾吸收、免疫、抵抗、Miss
  - 数值
  - 前后生命值
  - 伤害类型 / 元素类型
  - 暴击、穿甲、弱点、斩杀、DoT 等标签位

### 跳字系统

- `DamageNumberEmitter` 从一次性 `GameObject` 生成改为小型对象池
- `DamageNumberPopup` 支持不同停留时长、浮动速度、抖动与缩放脉冲
- 当前已接入以下显示类型：
  - 普通伤害
  - 暴击伤害
  - 元素伤害
  - 真实/穿甲类伤害
  - DoT 伤害
  - 治疗
  - 护盾吸收
  - 免疫 / 抵抗 / Miss 文本

### 单位头顶 HUD

- `CombatWorldSpaceBar2D` 运行时自动升级为 `CombatUnitWorldHud2D`
- 头顶 HUD 当前包含：
  - 名称
  - 等级
  - 敌人精英 / Boss 文本前缀
  - 即时 HP 条
  - 延迟扣血层
  - 受击闪光
  - Buff / Debuff 图标行
  - 施法 / 蓄力条

### 霸体与施法状态映射

- 玩家绝技霸体、近战敌人蓄力霸体、远程敌人蓄力霸体会自动映射为头顶 `A` 状态图标
- 玩家施法时，头顶 HUD 会显示当前技能名与施法进度
- 近战敌人蓄力时显示 `Charge`
- 远程敌人蓄力时显示 `Aim`

### Boss 顶部 HUD

- `CombatCanvasHudPresenter` 运行时会自动补一个顶部 Boss HUD
- 当前展示：
  - Boss 名称
  - Boss 总血条
  - Boss 当前蓄力 / 瞄准进度条
- Boss 识别规则：
  - `EnemyDefinition.Tier == Boss`
  - 或 `CharacterConfig.Ui.ShowBossHpBar == true`

### Buff / Debuff 显示

- 新增轻量运行时组件 `CombatStatusController`
- 支持：
  - 状态 ID
  - 显示名
  - Buff / Debuff
  - 层数
  - 持续时间
  - 优先级
  - 颜色
- 当前主要作为显示层与后续正式状态系统的桥接接口
- `FoundationAssetUtility` 会给测试玩家、敌人、训练假人补上该组件并开启调试种子状态
- 旧场景里已挂 `CombatWorldSpaceBar2D` 的单位也会在运行时自动补齐状态控制器

### 伤害链路接入

- `DamageResolver` 现在会返回 `BypassedArmor`
- 近战、范围、投射物、敌人普通攻击都会把穿甲/真实伤害标签继续传入 `DamageRequest`
- 地形伤害会标记为 DoT

## 受影响文件

- `Assets/Game/Runtime/Gameplay/Combat/Health.cs`
- `Assets/Game/Runtime/Gameplay/Combat/IDamageable.cs`
- `Assets/Game/Runtime/Gameplay/Combat/HealthFeedbackEvent.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusController.cs`
- `Assets/Game/Runtime/Gameplay/Combat/DamageResolver.cs`
- `Assets/Game/Runtime/Gameplay/Combat/DamageResult.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/World/TerrainMovementReceiver2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberEmitter.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberPopup.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatWorldSpaceBar2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`

## 2026-05-21 Incremental Sync - Shield Runtime And HUD

### Added

- Added `ShieldRuntime` for real shield value, max shield, runtime change events, and status sync.
- `Health.ReceiveDamage(...)` now spends shield first, then applies remaining damage to HP while still raising shield absorb feedback.
- `CombatUnitWorldHud2D` now renders a shield bar above HP and uses centralized status abbreviations such as `ATK`, `DEF`, `SHD`, `SA`, and `BRK`.
- `CombatCanvasHudPresenter` now auto-creates player and boss shield bars at runtime so HUD feedback still works before prefab sync.
- `FoundationAssetUtility` now seeds visible shield values on the player, training dummy, elites, bosses, and some ranged enemies for direct sandbox verification.

### Additional Files In This Increment

- `Assets/Game/Runtime/Gameplay/Combat/ShieldRuntime.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Health.cs`
- `Assets/Game/Runtime/Gameplay/Combat/IDamageable.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusController.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatWorldSpaceBar2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatHudDataSource.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `WCDEL.Game.Runtime.csproj`

### Verification

- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- Result: `0 warning / 0 error`

## 2026-05-21 Incremental Sync - Runtime Status Auto Mapping

### Added

- Added `CombatStatusAutoMapper` to bridge existing gameplay state into the combat HUD status layer instead of leaving invincibility, super armor, and hazard feedback disconnected.
- Runtime status auto-mapping now covers:
  - dodge invincibility
  - get-up protection invincibility
  - player action invincibility
  - ultimate cast invincibility
  - player and enemy super armor
  - terrain hazard debuffs mapped by element type
- Added a dedicated `Invincible` status effect type and HUD abbreviation `INV`.
- `CombatWorldSpaceBar2D` now auto-attaches the mapper together with the status controller and shield runtime.
- `CombatUnitWorldHud2D` now avoids duplicating implicit super armor when the mapped runtime status already exists.

### Additional Files In This Increment

- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusAutoMapper.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusController.cs`
- `Assets/Game/Runtime/Gameplay/Combat/HealthFeedbackEvent.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatWorldSpaceBar2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `WCDEL.Game.Runtime.csproj`

### Verification

- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- Result: `0 error`, with the same existing `Physics2D.OverlapCircleNonAlloc` obsolete warnings only

## 当前边界

- 这次先完成运行时显示与数据接口，没有引入正式 Buff 数值结算系统
- Buff 图标当前使用轻量字母占位，不依赖正式图集
- 屏幕顶部 Boss 大血条、正式护盾条、元素裂纹特效仍可在此基础上继续扩展

## 验证方式

- 执行 `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 进入战斗场景后验证：
  - 玩家与敌人受击出现跳字
- 地形伤害显示为小型持续伤害风格
- 头顶血条立即扣血，延迟层稍后追上
- 测试切片中的单位头顶显示 Buff / Debuff 图标
 - 玩家施法、敌人蓄力时头顶出现施法条
 - Boss 单位出现屏幕顶部总血条

## 后续建议

1. 把正式 Buff / Debuff 数据表映射到 `CombatStatusController`
2. 用正式 Sprite 图标替换当前字母占位
3. 给 Boss 单独补屏幕顶部主血条与阶段条
4. 把护盾值与护盾条纳入正式运行时资源系统

## 战斗 HUD 屏幕状态栏清理补充

- 玩家 HP、MP、Shield 与 Buff 不再通过屏幕左上角 `PlayerCard` 显示。
- `CombatCanvasHudPresenter` 会在运行时隐藏旧覆盖体中的 `TopLeft/PlayerCard`，防止旧预制体残留玩家血蓝条。
- 单位资源显示继续以 `CombatUnitWorldHud2D` 为准：玩家、普通敌人、精英和 Boss 的即时扣血层、延迟扣血层、护盾层、能量/施法条和 Buff 图标均绑定单位头顶 HUD。
- 屏幕顶部 Boss 总血条属于 Boss 专用战斗提示，不等同于玩家左上角状态栏；后续可按 Boss 文档单独保留或优化。
## 头顶蓝条修复补充

- `CombatUnitWorldHud2D` 需要读取单位父节点上的 `PlayerResourceRuntime`。
- 当单位存在 `PlayerResourceRuntime` 时，在头顶 HP 条下方绘制 MP 蓝条，蓝条填充使用 `ManaNormalized`。
- Buff 行需要根据是否存在 MP 蓝条自动下移，避免 Buff 图标盖住蓝条。
- 手机端隐藏屏幕左上角玩家状态栏后，玩家 MP 的唯一战斗内展示入口就是头顶 HUD 蓝条。