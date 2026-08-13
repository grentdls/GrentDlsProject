# HUD 伤害跳字实现文档

## 模块目标

伤害跳字用于显示攻击造成的数值反馈，并按攻击类型、伤害强度、是否击杀等信息区分表现。系统由 `CombatVisualManager` 统一对象池、实例化、动画和回收，条目必须来自 `DamagePopupItem_Prefab`。

## Prefab 路径

```text
Assets/Resources/UI/Prefabs/Components/DamagePopupItem_Prefab.prefab
UiPrefabType.DamagePopupItem
```

## 必须保留的节点

```text
DamagePopupItem_Prefab
  Glow
  Icon
  NumberText
  TypeTag
  CritMark
```

## 运行时规则

- `CombatVisualManager.SpawnDamagePopup(Vector3, DamagePopupData)` 是新入口。
- 旧入口 `SpawnDamagePopup(Vector3, float, AttackType)` 保留兼容，但只提供基础跳字。
- `AttackManager.ApplyResolvedDamage()` 会传入目标护甲、目标最大生命、是否主目标、是否击杀。
- Prefab 缺失时只报错，不再创建旧的可见 Text 根节点。
- `NumberText` 显示 `-128` 或 `+64`。
- `TypeTag` 显示 `穿甲 / 攻城 / 法术 / 英雄 / 神话 / 溅射 / 治疗`。
- `CritMark` 显示 `重` 或 `斩`，后续接入暴击系统时显示 `暴`。
- `Glow` 在高伤害、巨额伤害、致命伤害时显示。
- `Icon` 在有效以上强度或治疗时显示。

## 强度分级

- `Weak`：低于目标最大生命 1%。
- `Normal`：普通伤害。
- `Effective`：超过 5% 或数值较高。
- `High`：超过 12% 或数值大于 80。
- `Huge`：超过 25% 或数值大于 180。
- `Lethal`：击杀、超过 45% 或数值大于 260。

## 重建命令

```powershell
& 'D:\Unity6\Editor\Unity.exe' -batchmode -quit -projectPath 'G:\TestProject\TestRTS2' -executeMethod RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildOverheadCombatFeedbackPrefabs -logFile 'G:\TestProject\TestRTS2\Logs\RebuildOverheadCombatFeedbackPrefabs.log'
```

## 验证

```powershell
rg -n "NumberText|TypeTag|CritMark|Glow|Icon" Assets\Resources\UI\Prefabs\Components\DamagePopupItem_Prefab.prefab
dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false
```
