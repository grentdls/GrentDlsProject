# 角色 Sprite 脚底锚点同步

## 问题

当前角色和怪物使用 2D Sprite 表现在 3D 世界中，角色根节点应代表脚底中心点。但 SpriteRenderer 默认按 Sprite pivot 放在 `Visual` 节点中心，导致很多素材看起来是“角色中心点踩地”，脚底悬空或下沉。

## 实现规则

- 角色逻辑根节点仍然表示脚底中心点。
- `Visual` 是表现层，不参与移动、碰撞、跳跃和技能判定。
- `Visual/SpriteFrameRoot` 是逐帧图片表现层，只允许承载 SpriteRenderer 的单帧中心点修正、逐帧缩放和 FlipX。
- 新增 `CharacterSpriteFootAnchor2D`，运行时按当前 Sprite 的底部自动上移 `Visual` 节点。
- 如果素材需要微调，可在角色配置工具中修改 `视觉根节点手动偏移`。
- 如果某些特殊素材已经使用脚底 pivot，可关闭 `自动将 Sprite 底部贴到根节点`。

## 逻辑层与表现层分离补充

运行时层级约定：

```text
CharacterRoot
├── Visual
│   └── SpriteFrameRoot
│       └── SpriteRenderer
├── UiAnchor
└── GroundAnchor
```

- `CharacterRoot` 只表示逻辑脚底点，击退、击飞、跳跃、技能位移、软碰撞分离都只能移动这一层。
- `Visual` 只保存整组视觉资源的手动偏移、受击抖动、飞行悬浮等表现偏移，不允许作为逻辑位置来源。
- `SpriteFrameRoot` 只保存当前序列帧的中心点和缩放倍率。不同单图透明边距、中心点不一致、某几帧放大缩小都在这一层解决。
- 运行时会把旧结构里挂在 `Visual` 上的角色 SpriteRenderer 自动迁移到 `Visual/SpriteFrameRoot`，避免逐帧缩放影响 `Visual` 的脚底锚点。
- 当 `SpriteFrameRoot` 已经存在并承载 SpriteRenderer 时，`CharacterSpriteFootAnchor2D` 不再按 Sprite 原始 pivot 二次上移 `Visual`，避免脚底点被双重补偿。
- 单位软碰撞分离使用角色配置中的 `World3D.LogicWidthX / LogicDepthZ` 和逻辑 XZ 平面位置，不读取 Sprite bounds，也不写视觉节点。

后续实现禁止项：

- 不要把 `FrameWorldSize` 或单帧 `WorldSize` 写到 `CharacterRoot.localScale`。
- 不要用 `SpriteRenderer.bounds.center` 计算击退方向、技能位移目标、单位碰撞半径。
- 不要在表现组件中反向修正 `CharacterRoot.position` 来“对齐脚底”。
- 新生成角色或敌人 Prefab 时可以仍把 SpriteRenderer 放在 `Visual`，运行时会兼容迁移；但推荐生成器直接创建到 `Visual/SpriteFrameRoot`。

## 配置入口

中文工具入口：

`Tools/WCDEL/Characters/Open Character Config Tool`

在 `3D 世界尺寸与挂点` 页中配置：

- `角色根节点使用脚底点`
- `自动将 Sprite 底部贴到根节点`
- `视觉根节点手动偏移`
- `逻辑宽度 X / 逻辑高度 Y / 逻辑深度 Z`
- `3D 挂点`

## 运行时链路

`CharacterConfigRuntimeBridge.ApplyVisual()` 会：

1. 确保单位有 `UnitPresentationRoot2D`
2. 设置默认 Sprite、朝向和排序
3. 自动添加并配置 `CharacterSpriteFootAnchor2D`
4. 把角色配置传给动画驱动和脚底锚点组件

`CharacterSpriteFootAnchor2D` 在 `LateUpdate` 中检测当前 Sprite 是否变化，因此序列帧动画切帧后也会继续保持脚底贴地。

## 敌人与受击表现同步

敌人也使用同一套脚底锚点规则。为避免敌人受击闪白、局部抖动、飞行悬浮和脚底贴合同时修改 `Visual.localPosition` 导致闪烁：

- `CharacterSpriteFootAnchor2D` 会暴露当前稳定的 `CurrentVisualRootOffset`。
- `HitFlashController2D` 的受击抖动基准优先读取脚底锚点偏移，只叠加临时抖动。
- `FlyingEnemyPresentation2D` 的飞行横向摆动基准优先读取脚底锚点偏移，只叠加飞行表现。
- 不允许其他表现组件把已经叠加过抖动/悬浮的 `Visual.localPosition` 当作新的永久基准。

## 已同步资产

以下已有角色配置已启用 `AutoAlignSpriteFootToRoot`：

- `CharacterConfig_DogHero`
- `CharacterConfig_MouseBandit`
- `CharacterConfig_MeadowSlime`
- `CharacterConfig_CaveBat`
- `CharacterConfig_PoisonBee`
- `CharacterConfig_BeeCaptain`
- `CharacterConfig_HiveGuardian`
- `CharacterConfig_TrainingDummy`

## 验证方式

- 执行 `dotnet build WCDEL.sln /p:BuildProjectReferences=false`。
- 进入 Unity 后运行第一章或沙盒战斗场景，确认玩家与怪物的脚底落在地面，而不是图片中心落在地面。
- 打开角色配置工具，调节 `视觉根节点手动偏移` 可对单个素材做轻微上/下修正。
