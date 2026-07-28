# 角色技能帧事件特效与范围倍率同步

## 目标

- 角色动作可以配置“第 X 帧播放序列帧特效”。
- 特效可以绑定角色挂点，并配置偏移、旋转、缩放、朝向跟随、是否跟随角色移动。
- 技能详情界面可以循环播放该技能绑定动作里的序列帧特效。
- 角色属性可以直接影响技能范围、判定体、伤害、投射物数量、投射物速度和特效缩放。

## 数据入口

- `CharacterVfxDefinition`：统一特效定义，支持 `Prefab` 或 `Frames` 序列帧，同时配置 FPS、循环、持续时间、缩放、颜色、排序偏移、默认单帧中心点、默认单帧缩放倍率和逐帧表现列表。
- `CharacterFramePresentationDefinition`：单张序列帧的表现修正，包含本帧 `Pivot` 和本帧 `WorldSize`。字段名为兼容旧资产保留，运行时按“缩放倍率”解释。
- `CharacterCoreStats.SkillRangeMultiplier`：技能前方距离和体积中心偏移倍率。
- `CharacterCoreStats.SkillRadiusMultiplier`：技能半径、宽度、深度、地面投影倍率。
- `CharacterCoreStats.SkillDamageMultiplier`：技能基础威力倍率。
- `CharacterCoreStats.ProjectileCountBonus`：投射物数量加成，当前先作为正式配置字段暴露。
- `CharacterCoreStats.ProjectileSpeedMultiplier`：投射物速度倍率，当前先作为正式配置字段暴露。
- `CharacterCoreStats.VfxScaleMultiplier`：动作帧特效整体缩放倍率。

## 帧事件规则

动作 `FrameEvents` 中选择 `PlayVfx`：

- `FrameIndex` 表示触发帧。
- 新字段 `Vfx` 用于正式配置，支持 Prefab 和序列帧。
- 旧字段 `VfxPrefab` / `VfxFrames` 继续保留兼容已有资源；运行时优先读取 `Vfx`，为空时回退旧字段。
- `Vfx.FramePivot` / `Vfx.FrameWorldSize` 只是默认值，用于批量同步和未单独配置的帧；`FrameWorldSize` 字段名保留兼容，实际表示缩放倍率。
- `Vfx.FramePresentations[index]` 才是第 `index` 张序列帧的独立中心点和缩放倍率配置。
- `AttachPoint` / `AttachPointId` 决定挂到脚底、身体、头顶、武器、施法点或投射点。
- `LocalOffset` / `LocalEuler` / `Scale` 控制局部表现。
- `FollowFacing` 开启后，角色左右朝向会影响 X 偏移和 Sprite 翻转。
- `UseSkillScale` 开启后，特效缩放会吃角色技能半径和 VFX 倍率。
- `AttachToOwner` 开启后，特效会随角色移动；关闭后会生成在世界位置。

## 通用特效入口

- 角色通用特效：`CharacterVfxSetDefinition.SpawnVfx`、`DeathVfx`、`HitVfx`、`MoveVfx`、`DashVfx`、`JumpVfx`、`SkillCastVfx`。
- 伤害段特效：`CharacterDamageEventDefinition.HitVfx`，用于普攻/技能动作真实命中段的伤害特效。
- 位移段特效：`CharacterSkillMovementSegmentDefinition.StartVfx`、`MovingVfx`、`LandingVfx`，用于冲刺、瞬移、跳跃砸击等动作表现。
- Buff 效果特效：`CharacterBuffEffectDefinition.Vfx`，触发回血、范围伤害、DoT、护盾等效果时播放。
- 投射物特效：`CharacterProjectileDefinition.ImpactVfx` 和 `ExplosionVfx`，分别用于命中与爆炸表现。

## 运行时同步

- `CharacterSpriteAnimationDriver` 在动作播放到对应帧时分发 `PlayVfx`。
- `CharacterFrameVfxPlayer` 负责实例化 Prefab 或创建序列帧播放物体。
- `CharacterFrameVfxPlayer.PlayWorldVfx` 可在世界坐标播放通用 `CharacterVfxDefinition`。
- `Projectile2D` 的命中特效和爆炸特效已经接入 `CharacterVfxDefinition`，旧 Prefab 字段继续作为回退。
- `CombatStatusController` 的 Buff 效果触发已经接入 `CharacterVfxDefinition`，旧 `VfxPrefab` 继续作为回退。
- `PlayerSkillController` 释放技能时会克隆技能 3D 体积并应用范围倍率，不会反写 ScriptableObject。
- 技能释放的伤害、地面预览圈、真实 3D 判定范围会和角色属性倍率保持一致。

## 工具与界面

- 角色配置工具的“动作”页新增“序列帧特效帧事件”配置区域。
- 角色配置工具顶部和动画页必须显示当前配置资产路径与当前动画 ID，避免把旧配置或备用配置误认为当前场景正在使用的角色配置。
- 投射物、伤害段、位移段、Buff 效果和角色通用特效界面均使用同一套“Prefab 或序列帧”配置块。
- 所有序列帧配置块都必须使用行内编辑：每张 Sprite 图片后面直接显示“中心点”和“缩放 X/Y”两个参数，用于逐张修正不同单图透明边距、pivot 或尺寸不一致导致的位置跳动。
- 默认中心点/默认缩放倍率只作为新增帧和缺失帧的兜底模板，不代表整组序列帧只能使用同一配置。
- 逐帧缩放倍率的某个轴为 0 时继承默认倍率对应轴；如果最终只填写 X 或 Y 单轴倍率，运行时会把另一个轴补成同倍率。例如 `2,2` 表示原图 2 倍，`4,4` 表示原图 4 倍。
- 角色动画配置也暴露 `FramePresentations`；角色动画默认推荐脚底中心 `(0.5, 0)`，特效默认推荐中心 `(0.5, 0.5)`。
- 编辑器在绘制序列帧行时自动把 `FramePresentations` 数量同步到 `Frames` 数量，不再要求策划手动点击“同步帧数”。
- 预览页会在当前动作帧叠加显示 PlayVfx 的挂点位置。
- 技能页会显示技能绑定动作中的 PlayVfx 摘要。
- 后台技能详情面板会优先循环播放当前角色配置中该技能 `BoundActionId` 对应动作的角色动画序列帧；如果动作动画缺失，再回退到动作帧事件中的 `VfxFrames`，最后回退技能图标。

## 常见排查

- 第一章玩家运行时优先使用 `Assets/Game/Runtime/CharacterConfigs/Chapter01/CharacterConfig_CH01_Wangcai.asset`。
- 旧通用玩家配置 `Assets/Game/Runtime/CharacterConfigs/CharacterConfig_DogHero.asset` 仍可能存在，但第一章场景不优先使用它。
- 如果改了序列帧大小但游戏里无效，先确认角色配置工具顶部显示的资源路径是否就是当前场景绑定的配置资产。
- 如果只改了某个动作的某一帧，例如 `ultimate_fire_ring` 第 4 帧，只有播放到该动作该帧时才会看到对应缩放。
- 技能/绝技运行时传入的可能是 `BoundActionId`，动画驱动必须先按动画 ID 查找；查不到时再按动作 ID 找到 `CharacterActionDefinition.AnimationId`，最后播放对应动画。
- 受击闪白/抖动反馈不能在空闲状态持续重置 `Visual.localScale`，否则会覆盖序列帧逐帧大小；只有实际播放受击缩放脉冲时才能临时写入 scale。

## 验收

- 在角色配置工具中给技能动作新增 PlayVfx 事件，指定第 X 帧和 `VfxFrames`。
- 播放到该帧时，预览区能看到特效位置提示。
- 进入游戏释放技能时，角色对应帧会播放特效。
- 修改角色技能范围/半径倍率后，技能命中范围、地面预览和特效缩放同步变化。

## 后台技能详情页预览规则补充

- 后台技能详情页顶部固定显示 `SkillPreviewPanel/PreviewViewport`，点击技能后优先循环播放当前玩家角色配置中该技能 `BoundActionId` 对应动作的角色动画序列帧。
- 预览帧解析顺序为：技能 `BoundActionId` -> 角色动作 `AnimationId` -> 角色动画 `Frames`；如果角色动画缺失，再回退到动作帧事件里的 `VfxFrames`，最后回退到技能图标。
- 技能详情正文统一写入 `SkillDetailSummaryPanel/PageBody`，旧的 `PageBodyPanel`、`SkillDamageInfoPanel`、`SkillUpgradeInfoPanel` 仅作为历史覆盖体兼容，不再作为主界面显示。
- 运行时缓存引用必须优先绑定 `SkillDetailSummaryPanel/PageBody`，防止旧覆盖体中的隐藏文本节点抢占新摘要内容。
- UI 生成器重建后台技能页时必须生成新结构，并校验旧详情块不存在。
## Buff 帧事件补充

- 动作帧事件不只用于 `PlayVfx`，也可以使用 `ApplyBuff` / `ApplyDebuff` 在指定帧给自己施加 Buff。
- 角色配置工具的动作页提供“新增自身 Buff 事件”，默认使用当前预览帧并创建一条自身 Buff 施加配置。
- 自身 Buff 事件使用 `SelfBuffs` 列表，适合配置蓄力霸体、施法无敌、短时加速、跳跃砸击前摇强化等只影响施法者的状态。
