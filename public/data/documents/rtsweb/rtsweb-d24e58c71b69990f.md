# HUD 技能喊名冒泡实现文档

## 模块目标

技能喊名冒泡用于显示单位释放主动技能、强力技能、被动触发、形态变化和关键指令时的短反馈。系统和伤害跳字分离，走 `SkillCalloutBubbleManager`，条目必须来自 `SkillCalloutBubble_Prefab`。

## Prefab 路径

```text
Assets/Resources/UI/Prefabs/Components/SkillCalloutBubble_Prefab.prefab
UiPrefabType.SkillCalloutBubble
```

## 必须保留的节点

```text
SkillCalloutBubble_Prefab
  Background
  FactionBorder
  Accent
  Icon
  Label
  TypeLabel
  Power
  MergeCount
  Tail
```

## 运行时规则

- `SkillCalloutBubbleManager` 统一处理限流、合并、显示上限、世界坐标跟随和动画。
- `Label` 只显示技能短名，不再混入合并次数。
- `MergeCount` 独立显示 `x2/x3` 等合并次数，方便在 Prefab 内单独调位置和样式。
- `TypeLabel` 显示 `技能 / 被动 / 切换 / 变身 / 指令 / 大招`。
- `Accent` 和 `Tail` 使用阵营色，`FactionBorder` 用阵营色与副阵营色混合。
- `Power` 只在高优先级冒泡显示，例如 `P3 · 86`。

## 优先级规则

- 0：不显示。
- 1：弱提示，移动端会过滤。
- 2：普通技能。
- 3：强力技能，显示 `Power`。
- 4：英雄/精英技能，加强边框。
- 5：大招/终局技能，显示更大尺寸和更强动效。

## 重建命令

```powershell
& 'D:\Unity6\Editor\Unity.exe' -batchmode -quit -projectPath 'G:\TestProject\TestRTS2' -executeMethod RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildOverheadCombatFeedbackPrefabs -logFile 'G:\TestProject\TestRTS2\Logs\RebuildOverheadCombatFeedbackPrefabs.log'
```

## 验证

```powershell
rg -n "Background|Accent|TypeLabel|MergeCount|Tail" Assets\Resources\UI\Prefabs\Components\SkillCalloutBubble_Prefab.prefab
dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false
```
