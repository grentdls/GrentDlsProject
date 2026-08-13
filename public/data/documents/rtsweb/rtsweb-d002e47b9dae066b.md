# HUD 单位建筑头顶 HUD 模块

## 模块目标

单位和建筑头顶 HUD 只保留一套运行时实现：`UnitOverheadUI` 负责把单位/建筑注册给 `WorldHudManager`，`WorldHudManager` 负责把世界坐标转换到屏幕坐标并刷新动态数据。可见结构必须来自 `WorldHudItem_Prefab`。

## Prefab 路径

```text
Assets/Resources/UI/Prefabs/InGame/WorldHudItem_Prefab.prefab
UiPrefabType.WorldHudItem
```

## 必须保留的节点

```text
WorldHudItem_Prefab
  AlertText
  TypeText
  NameText
  LevelBadge
    LevelText
  HpBarFrame
  HpBar
    HpDelayFill
    HpFill
  StatusRow
    StatusIcon
    StatusProgress
      StatusFill
    StatusText
    StatusProgressText
```

## 运行时规则

- `WorldHudManager.CreateHudItem()` 只实例化 `WorldHudItem_Prefab`。
- Prefab 缺失时只报错，不再创建旧的可见头顶 UI。
- 必须节点缺失时销毁实例并报错，避免运行时补出不可编辑的旧节点。
- 代码允许动态写入名字、类型角标、等级/星级/阵营状态、血条 fillAmount、状态文字、状态进度、警报文字和世界坐标位置。
- Prefab 中可调整根尺寸、各节点位置、血条大小、字体、图片、颜色、透明度和默认隐藏/显示状态。
- `HpFill`、`HpDelayFill`、`StatusFill` 必须是 `Image.Type.Filled`，运行时只改 `fillAmount` 和必要的动态颜色。

## 显示内容

- 单位普通状态显示血条；选中、重要单位、建筑、警报单位显示名字和等级信息。
- 建筑显示 `建`，英雄显示 `英雄`，Boss 显示 `BOSS`，精英显示 `◇`，普通单位显示 `●`。
- 采集、巡逻、改造、建筑生产状态显示在 `StatusRow`。
- Buff 摘要显示为 `增益 N / 减益 N / 控制 N`，只对选中或重要单位显示，避免刷屏。

## 重建命令

```powershell
& 'D:\Unity6\Editor\Unity.exe' -batchmode -quit -projectPath 'G:\TestProject\TestRTS2' -executeMethod RTSGame.Editor.UiPrefabWorkflowGenerator.RebuildOverheadCombatFeedbackPrefabs -logFile 'G:\TestProject\TestRTS2\Logs\RebuildOverheadCombatFeedbackPrefabs.log'
```

## 验证

```powershell
rg -n "AlertText|NameText|HpFill|StatusProgressText" Assets\Resources\UI\Prefabs\InGame\WorldHudItem_Prefab.prefab
dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false
dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false
```
