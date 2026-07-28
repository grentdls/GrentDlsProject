# HUD 选择详情模块

## 模块目标

选择详情只走 `MainHudRoot_Prefab/LeftLayer_SelectionAndCommands/SelectionPanel`。`SelectionPanel` 本身是透明总容器，不再包含旧版 `Header_SelectedEntity`、`StatsGrid`、`ActionGrid_Buttons`、`ActionButton_1~8`。

## Prefab 结构

```text
SelectionPanel_Prefab
  UnitBuildingInfoPanel_Left -> SelectionInfoPanel_Prefab
  UnitBuildingActionPages_RightContainer -> SelectionActionPanel_Prefab
```

运行时看到的 `UnitBuildingInfoPanel_Left` 不是独立文件名，它是 `SelectionInfoPanel_Prefab` 实例化后的节点名和 slotId。对应关系如下：

```text
UiPrefabType.SelectionPanel       -> Assets/Resources/UI/Prefabs/InGame/SelectionPanel_Prefab.prefab
UiPrefabType.SelectionInfoPanel   -> Assets/Resources/UI/Prefabs/InGame/SelectionInfoPanel_Prefab.prefab
UiPrefabType.SelectionActionPanel -> Assets/Resources/UI/Prefabs/InGame/SelectionActionPanel_Prefab.prefab
```

## 运行时绑定

`SelectionPanel.CreatePcSelectionStructure()` 只允许查找或实例化以上 prefab。缺失时只创建无 Image/无 Outline 的最小占位并输出错误日志，禁止再创建旧视觉面板。

绑定节点：

```text
UnitBuildingInfoPanel_Left
  HeaderArea
    PortraitFrame_Unified
      PortraitIcon
      PortraitBadge
      PortraitFaction
    HeaderTitle
    HeaderSubtitle
  HPMPArea
    HealthText
    ProgressRows
  AttributeArea
    AttributeText
    AttributeCards
  DetailTextArea
    ExtraInfoText

UnitBuildingActionPages_RightContainer
  RightActionArea
    ActionHint
    UpgradeInfoText
  BuildingTechTreePage_Standalone
  BuildingUnitProductionPage_Standalone
  BuildingControlPage_Standalone
```

## 布局规则

- `SelectionPanel_Prefab` 尺寸为 `1180 x 430`，默认停靠在战斗 HUD 左下/中下区域，用于容纳信息面板、动作页、多选和编队入口。
- `UnitBuildingInfoPanel_Left` 尺寸为 `540 x 342`，默认位置 `18, 18`。
- `UnitBuildingActionPages_RightContainer` 尺寸为 `590 x 374`，默认位置 `570, 18`，内部建造、造兵、科技、控制页按当前显隐状态横向分栏并自动夹到安全区内。
- `LeftLayer_SelectionAndCommands` 尺寸为 `1188 x 430`，确保底部 HUD 不裁切两个子模块，且不覆盖屏幕中央战场。
- 位置、大小、图片、颜色、静态标题优先在 prefab 中调整。代码只写动态数据、按钮列表、队列项、技能/命令状态和显隐。

## 血条与属性卡宿主

- `HPMPArea/ProgressRows` 是血条动态行宿主，运行时只实例化 `SelectionProgressRow_Prefab` 并写入 HP 文本、填充比例和颜色。
- `AttributeArea/AttributeCards` 是属性卡动态宿主，运行时只实例化 `SelectionAttributeCard_Prefab` 并写入图标文本、属性名和数值。
- `HealthText` 和 `AttributeText` 只作为 prefab 缺失或实例化失败时的文本兜底；血条/属性卡成功创建后会隐藏。
- 属性卡默认两列排列，代码会按 `AttributeCards` 实际宽度收敛单卡宽度，避免当前 HUD 信息区中两列卡片轻微溢出。

## 禁止旧接口

- 不允许在 `SelectionPanel_Prefab` 里恢复 `Header_SelectedEntity`、`StatsGrid`、`ActionGrid_Buttons`、`ActionButton_1~8`。
- 不允许 `CreatePcPanelRoot()` 用 `new GameObject(... Image, Outline ...)` 创建旧版信息页/动作页。
- 不允许把单位详情和建筑详情拆回旧的代码生成 UI。单位/建筑共用 `SelectionInfoPanel_Prefab`，数据由 `RefreshPcUnitInfo()` 和 `RefreshPcBuildingInfo()` 写入。

## 验证命令

```powershell
rg -n "Header_SelectedEntity|StatsGrid|ActionGrid_Buttons|ActionButton_" Assets\Resources\UI\Prefabs\InGame\SelectionPanel_Prefab.prefab
rg -n "SelectionPanel requires prefab|CreatePcPanelRoot|CreatePcInfoBlock" Assets\Scripts\UI\SelectionPanel.cs
```

第一条命令应无结果；第二条只允许出现错误提示和方法定义，不允许出现旧视觉面板创建。
