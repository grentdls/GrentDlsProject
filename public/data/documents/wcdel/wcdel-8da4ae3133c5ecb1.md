# Combat Presentation Impact Burst Sync

## 目标

在不改动现有战斗伤害公式和输入链路的前提下，继续加厚战斗表现层，让命中瞬间更有“打到东西”的重量感，同时保持当前项目的可替换占位资源工作流。

## 本次实现

### 命中爆点特效

- 新增 `HitImpactBurstController2D`
- 复用现有 `HealthFeedbackEvent` 与 `HitImpactFeedbackResolver`
- 在受击单位的 `Visual` 下运行时自动创建两层轻量命中特效：
  - 中心爆点 `ImpactBurst`
  - 外扩冲击环 `ImpactRing`
- 根据命中等级、暴击、弱点、处决等反馈标签动态调整：
  - 尺寸
  - 颜色
  - 持续时间
  - 受击点偏移方向

### 调试精灵库扩展

- 扩展 `CombatDebugSpriteLibrary`
- 新增：
  - `ImpactBurstSprite`
  - `ImpactRingSprite`
- 继续使用运行时生成纹理，不引入新的美术依赖
- 后续接正式命中特效时，可以保留同一组件和调用链，只替换 Sprite / Prefab 表现

### 受击闪白与形变脉冲

- `HitFlashController2D` 现在除了颜色闪白与局部抖动，还会驱动一次轻量缩放脉冲
- 脉冲强度会跟随命中反馈强度变化
- 目标是让受击反馈更像“挨了一下”，而不是单纯改色

### 跳字节奏微调

- `DamageNumberEmitter` 根据命中等级进一步调整：
  - 上升速度
  - 震动强度
  - 暴击 / 破甲 / 弱点 / 处决的节奏差异
- `DamageNumberPopup` 增加轻量重力回落感，让数字不是全程匀速上飘
- 缩放脉冲尾段也做了轻微收束，避免跳字悬浮感太重

## 接入方式

- `CombatFeedbackBroadcaster` 运行时自动补齐：
  - `HitFlashController2D`
  - `HitImpactBurstController2D`
  - `HitImpactLocalPauseController2D`
- 因此现有玩家、敌人、训练假人只要已经接入 `CombatFeedbackBroadcaster`，就能直接获得这次新增表现

## 影响文件

- `Assets/Game/Runtime/Gameplay/Combat/CombatDebugSpriteLibrary.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatFeedbackBroadcaster.cs`
- `Assets/Game/Runtime/Gameplay/Combat/HitFlashController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/HitImpactBurstController2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberEmitter.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberPopup.cs`

## 验证

- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`

## 后续建议

1. 把 `HitImpactBurstController2D` 改成支持正式 VFX Prefab 或 Sprite Sheet
2. 给 Boss、大体型敌人和终结技补更强的分级参数
3. 把命中特效颜色进一步和元素、护甲类型、弱点类型绑定
