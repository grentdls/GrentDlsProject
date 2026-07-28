# 3D 战斗命中候选与释放表现同步

## 本次目标

修复切换到真实 3D 逻辑后，玩家普攻和技能看不到释放效果、也没有造成伤害的问题。

## 问题原因

- 普攻和范围技能已经接入了 `CombatHitVolume3DUtility` 的 3D HitVolume 判定，但外层候选目标仍主要依赖 `Physics2D.OverlapCircle`。
- 当前第一章和后续 2.5D 场景使用真实 Unity 3D 语义：`X/Z` 是地面平面，`Y` 是高度。
- 旧 2D broadphase 在 `X/Y` 平面查找目标，单位移动到 `Z` 轴后，经常拿不到任何候选目标，导致真实 3D 伤害框没有机会执行。
- 部分非玩家单位没有 `TopDownCharacterMotor2D` 时，旧逻辑会把 `Transform.position.y` 当成平面纵向坐标，进一步导致目标 HurtBox 的 `Z` 位置错误。

## 修复方案

- `MeleeAttackEmitter` 保留原有 `Physics2D.OverlapCircle` 兼容路径，同时追加 `CollectDamageablesInPlanarCircle` 的 `X/Z` 逻辑平面候选扫描。
- `AreaSkillEmitter` 使用相同策略，让范围技能不再依赖旧 `X/Y` Collider2D broadphase。
- `CombatHitVolume3DUtility.ResolveLogicalPosition` 统一通过 `WorldPresentationHeightUtility.ResolveLogicPlanePosition` 读取逻辑平面坐标，再把 `Y` 作为高度写入 3D 逻辑点。
- `ResolveTargetPlanarContactPoint` 在 2.5D 平面投影启用时优先读取逻辑平面位置，避免目标接触点从旧 Collider2D 的 `X/Y` 空间取值。
- 普攻和技能去重数组扩容并限制遍历范围，避免逻辑候选和旧 2D 候选合并后出现越界风险。

## 释放表现

- 新增 `CombatActionPreview2D`，在玩家普攻时显示短暂攻击弧光，在技能释放时显示短暂范围圈。
- `PlayerCombatController` 和 `PlayerSkillController` 会在运行时自动补齐 `CombatActionPreview2D`，旧场景或未重新生成的玩家对象也能看到释放反馈。
- 当前表现是轻量占位，用于确认输入和释放链路已经触发；后续可继续替换为正式技能特效、Decal 或 Mesh 特效。

## 兼容原则

- 不删除旧 2D 碰撞和 Overlap 路径，旧测试场景和未迁移对象仍可工作。
- 新 3D 逻辑候选只作为补充和主兜底，不改变 `Health`、`DamageResolver`、跳字、血条、HitStop、震屏等已有伤害反馈入口。
- 真实命中仍以 `HitVolume3D` 和目标 `HurtBox3D` 重叠为准，不把地面红圈或 broadphase 半径当最终伤害判定。

## 验证

- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 结果：0 warning / 0 error

## 后续注意事项

- 后续敌人、Boss、投射物迁移到完整 3D 语义时，仍要统一通过 `WorldPresentationHeightUtility.ResolveLogicPlanePosition` 获取 `X/Z` 平面坐标。
- 旧文件名中的 `2D` 暂时保留作为兼容层命名，不代表逻辑仍是二维判定。
- 正式技能特效接入时，可以复用 `CombatActionPreview2D` 的触发入口，但视觉层建议替换为地面投影 Decal / Mesh / Shader。
