# 第一章角色序列帧与配置生成规则

## 目标

第一章单位必须拥有独立的 `CharacterConfigDefinition` 和序列帧资源，不能继续全部复用老的 Mouse/Bee/Slime 占位配置。这样角色配置工具、第一章场景生成器、运行时动画驱动看到的是同一套配置。

## 生成入口

- 通用重建：`Tools/WCDEL/角色配置/重建全部角色序列帧与配置`
- 第一章重建：`Tools/WCDEL/角色配置/重建第一章全部单位序列帧与配置`

两个入口最终都调用同一条生成链路，保证 Sprite 导入、底部中心 pivot、配置引用规则一致。

## 第一章配置路径

- `Assets/Game/Runtime/CharacterConfigs/Chapter01/CharacterConfig_CH01_Wangcai.asset`
- `Assets/Game/Runtime/CharacterConfigs/Chapter01/CharacterConfig_CH01_VillageGoose.asset`
- `Assets/Game/Runtime/CharacterConfigs/Chapter01/CharacterConfig_CH01_WastelandRat.asset`
- `Assets/Game/Runtime/CharacterConfigs/Chapter01/CharacterConfig_CH01_StrongRat.asset`
- `Assets/Game/Runtime/CharacterConfigs/Chapter01/CharacterConfig_CH01_DryFly.asset`
- `Assets/Game/Runtime/CharacterConfigs/Chapter01/CharacterConfig_CH01_DryRoot.asset`
- `Assets/Game/Runtime/CharacterConfigs/Chapter01/CharacterConfig_CH01_BlackGrass.asset`
- `Assets/Game/Runtime/CharacterConfigs/Chapter01/CharacterConfig_CH01_PoisonBud.asset`

## 运行时绑定规则

- 第一章场景生成器优先绑定 `CharacterConfig_CH01_Wangcai.asset` 作为玩家配置。
- 第一章场景生成器把全部第一章敌人配置写入 `GameBootstrapConfig.DefaultEnemyCharacterConfigs`。
- 敌人运行时兜底匹配先检查第一章敌人 id，再走老的通用 bee/bat/slime/mouse fallback。
- `CharacterSpriteAnimationDriver` 同时检测 `Rigidbody2D.linearVelocity` 和 XZ 平面 Transform 位移速度，适配真实 3D 平面移动。

## 资源规则

- 所有生成的单帧 PNG 统一使用 Sprite 单图导入。
- Pivot 必须为 bottom-center，确保脚底是逻辑根点。
- `CharacterAnimationClipDefinition.FramePivot` 默认使用 `(0.5, 0)`，只作为逐帧配置的默认模板。
- `CharacterAnimationClipDefinition.FrameWorldSize` 字段名为兼容旧资产保留，实际表示默认缩放倍率；为 `(0, 0)` 时使用原图倍率 `1,1`。
- `CharacterAnimationClipDefinition.FramePresentations[index]` 必须能单独配置第 `index` 张图的脚底点和缩放倍率，用于处理每张图透明边距/尺寸不一致。
- 角色配置工具中每张序列帧图片后面直接显示两个参数：本帧中心点、本帧缩放 X/Y；不再使用单独的复杂逐帧列表。
- 本帧缩放的某个轴填 0 时继承默认缩放对应轴；最终只填 X 或 Y 单轴时，运行时会把另一个轴补成同倍率。`2,2` 表示原图 2 倍，`4,4` 表示原图 4 倍。
- 角色 SpriteRenderer 的 `sortingOrder` 运行时至少为 1，必须高于地面和贴地提示，避免视觉上插入地面。
- 角色和怪物根节点保持 3D 直立语义，不允许把 Sprite 或根节点旋转 90 度贴地。
- `DrawRect` 绘制占位序列帧时必须裁剪到贴图范围内，避免死亡、跳跃等动作越界导致生成中断。
