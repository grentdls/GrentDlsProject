# 太空3D积木飞船幸存者 UI 预制体层级与功能说明

本文档记录当前项目的 UI 预制体结构、关键节点命名、功能绑定关系，以及后续替换 UI 图片和调整布局时的注意事项。

## 1. 总体规则

当前 UI 已经改为“预制体优先，代码兜底”的结构。

运行时加载路径：

```text
Assets/Resources/BrickSurvivor/UI/Prefabs/
```

代码中的 Resources 路径：

```text
BrickSurvivor/UI/Prefabs/
```

绑定入口：

```text
Assets/Scripts/BrickSurvivor/BrickSurvivorGame.UIPrefabs.cs
```

默认预制体生成器：

```text
Assets/Scripts/BrickSurvivor/Editor/BrickSurvivorUIPrefabGenerator.cs
```

Unity 菜单：

```text
Tools/Brick Survivor/Generate Missing UI Prefabs
```

只生成缺失的 UI 预制体，不覆盖已经手动修改过的预制体。

```text
Tools/Brick Survivor/Generate UI Prefabs
```

重新生成全部默认 UI 预制体，会覆盖现有同名预制体。

### 可自由修改的内容

以下内容可以直接在 prefab 中调整：

- UI 图片 Sprite。
- Image 颜色、透明度、Sliced 设置。
- RectTransform 位置、尺寸、锚点、缩放。
- 层级顺序。
- 文本字号、字体、颜色、描边。
- 装饰性节点增删。
- 背景图、面板图、按钮图、边框图。

### 不建议改名的功能节点

脚本通过节点名称查找功能绑定点。以下类型节点名称应保留：

- `Button_...`
- `Text_...`
- `Bar_..._Fill`
- 核心面板容器，如 `Panel_SettingsMain`、`Popup_NewGameConfig`、`HUD_LevelExp`
- 运行时动态内容的父容器，如 `BD_SelectPopup_Content`、`Panel_ResultShipParts`

可以移动这些节点到别的父物体下面，因为查找逻辑会递归搜索子节点；但不要改名，除非同步修改代码。

### 黑色半透明遮罩

每个弹窗或大界面根节点通常带有 Image 遮罩：

- 主界面：`UI_MainMenuRoot`
- 新局设置：`Popup_NewGameConfigOverlay`
- 加载界面：`UI_LoadingBattleOverlay`
- 设置：`UI_SettingsRoot`
- 图鉴：`UI_CodexRoot`
- 升级三选一：`Prefab_UI_BD_SelectPopupOverlay`
- 背包：`Prefab_UI_BlockInventoryOverlay`
- 搭建：`Prefab_UI_BuildModeOverlay`
- 结构：`Prefab_UI_ShipStructureOverlay`
- 结算：`Prefab_UI_RunResultOverlay`

搭建界面的遮罩更轻，避免挡住中间飞船安装视图。

## 2. 当前 UI 预制体清单

| 预制体文件 | 运行时界面 | 加载条件 |
| --- | --- | --- |
| `BrickSurvivor_MainMenuUI.prefab` | 主界面 | 主菜单场景 |
| `BrickSurvivor_RunSetupUI.prefab` | 新局设置 | 主界面点击开始游戏 |
| `BrickSurvivor_LoadingUI.prefab` | 加载战斗界面 | 从主界面进入战斗 |
| `BrickSurvivor_BattleHUD.prefab` | 战斗 HUD | 战斗场景 |
| `BrickSurvivor_SettingsUI.prefab` | 设置界面 | 主界面或战斗暂停 |
| `BrickSurvivor_CodexUI.prefab` | 图鉴界面 | 主界面点击图鉴 |
| `BrickSurvivor_UpgradeSelectUI.prefab` | 升级三选一 | 升级时弹出 |
| `BrickSurvivor_InventoryUI.prefab` | 积木背包 | 战斗中打开背包 |
| `BrickSurvivor_BuildModeUI.prefab` | 飞船搭建 | 安装或调整部件 |
| `BrickSurvivor_StructureUI.prefab` | 飞船结构总览 | 战斗中打开结构 |
| `BrickSurvivor_RunResultUI.prefab` | 战斗结算 | 胜利或失败 |

## 3. 主界面：BrickSurvivor_MainMenuUI

根节点：

```text
UI_MainMenuRoot
```

层级结构：

```text
UI_MainMenuRoot
├─ Image_MainMenuBackground
├─ Panel_MainMenu_TopBar
│  ├─ Text_GameLogo
│  └─ Button_QuickSettings
├─ Panel_Left_MainButtons
│  ├─ Text_MenuTitle
│  ├─ Button_StartGame
│  ├─ Button_ContinueGame
│  ├─ Button_Codex
│  ├─ Button_Settings
│  ├─ Button_ExitGame
│  └─ Text_ModeStatus
├─ Panel_Center_ShipDisplay
│  ├─ Text_ShipDisplayTitle
│  ├─ Text_ShipControlHint
│  └─ Text_ShipStats
├─ Panel_Right_SaveInfo
│  ├─ Text_InfoTitle
│  ├─ Text_SaveInfo
│  └─ Text_UnlockProgress
├─ BottomBar_MainInfo
│  └─ Text_BottomInfo
└─ Text_FrontEndToast
```

功能说明：

| 节点 | 功能 |
| --- | --- |
| `Image_MainMenuBackground` | 主界面背景图。若 prefab 中未指定 Sprite，运行时使用 `BG_MainMenu_Placeholder`。 |
| `Button_QuickSettings` | 打开设置界面。 |
| `Button_StartGame` | 打开新局设置界面。 |
| `Button_ContinueGame` | 尝试继续战斗存档，当前暂无可继续时显示提示。 |
| `Button_Codex` | 打开图鉴界面。 |
| `Button_Settings` | 打开设置界面。 |
| `Button_ExitGame` | 退出游戏。 |
| `Text_ModeStatus` | 显示当前新局配置。 |
| `Text_ShipStats` | 显示当前飞船部件和评分。 |
| `Text_SaveInfo` | 显示存档和最近战斗信息。 |
| `Text_UnlockProgress` | 显示图鉴/部件解锁进度。 |
| `Text_FrontEndToast` | 主界面底部提示。 |

## 4. 新局设置：BrickSurvivor_RunSetupUI

根节点：

```text
Popup_NewGameConfigOverlay
```

层级结构：

```text
Popup_NewGameConfigOverlay
└─ Popup_NewGameConfig
   ├─ Text_Title
   ├─ Text_Subtitle
   ├─ Text_RunOption_0
   ├─ Text_RunSelected_0
   ├─ Button_RunOption_0_0
   ├─ Button_RunOption_0_1
   ├─ Button_RunOption_0_2
   ├─ Button_RunOption_0_3
   ├─ Text_RunOption_1
   ├─ Text_RunSelected_1
   ├─ Button_RunOption_1_0 ... Button_RunOption_1_3
   ├─ Text_RunOption_2
   ├─ Text_RunSelected_2
   ├─ Button_RunOption_2_0 ... Button_RunOption_2_3
   ├─ Text_RunOption_3
   ├─ Text_RunSelected_3
   ├─ Button_RunOption_3_0 ... Button_RunOption_3_4
   ├─ Button_CancelNewRun
   └─ Button_ConfirmNewRun
```

功能说明：

| 节点 | 功能 |
| --- | --- |
| `Button_RunOption_0_*` | 模式选择：标准生存、无尽模式、事件挑战、Boss挑战。 |
| `Button_RunOption_1_*` | 难度选择：简单、普通、困难、噩梦。 |
| `Button_RunOption_2_*` | 初始核心选择。 |
| `Button_RunOption_3_*` | 地图主题选择。 |
| `Text_RunSelected_*` | 显示每行当前选中的配置。 |
| `Button_CancelNewRun` | 关闭新局设置。 |
| `Button_ConfirmNewRun` | 保存配置，进入加载界面并异步加载战斗场景。 |

## 5. 加载界面：BrickSurvivor_LoadingUI

根节点：

```text
UI_LoadingBattleOverlay
```

层级结构：

```text
UI_LoadingBattleOverlay
├─ Image_LoadingBattleBackground
└─ Panel_LoadingBattleStatus
   ├─ Text_LoadingTitle
   ├─ Text_LoadingStatus
   ├─ Text_LoadingProgress
   └─ Bar_LoadingBattle_Background
      └─ Bar_LoadingBattle_Fill
```

功能说明：

| 节点 | 功能 |
| --- | --- |
| `Image_LoadingBattleBackground` | 加载界面背景图。若 prefab 中未指定 Sprite，运行时使用 `BG_LoadingBattle_Placeholder`。 |
| `Text_LoadingStatus` | 显示加载步骤。 |
| `Text_LoadingProgress` | 显示百分比。 |
| `Bar_LoadingBattle_Fill` | 水平填充进度条，脚本更新 `fillAmount`。 |

## 6. 战斗 HUD：BrickSurvivor_BattleHUD

根节点：

```text
Prefab_UI_BattleHUD
```

层级结构：

```text
Prefab_UI_BattleHUD
├─ HUD_LevelExp
│  ├─ Text_Level
│  ├─ Text_XP
│  └─ Bar_XP_Background
│     └─ Bar_XP_Fill
├─ HUD_DangerTimeline
│  ├─ Text_Time
│  ├─ Text_Danger
│  ├─ Text_TimelineMarks
│  ├─ Text_NextBeat
│  ├─ Bar_BattleTimeline_Background
│  │  └─ Bar_BattleTimeline_Fill
│  └─ Bar_NextWave_Background
│     └─ Bar_NextWave_Fill
├─ HUD_Minimap
│  ├─ Text_MinimapTitle
│  └─ Text_Flow
├─ HUD_CoreIntegrity
│  ├─ Text_CoreHP
│  ├─ Text_Integrity
│  ├─ Bar_CoreHP_Background
│  │  └─ Bar_CoreHP_Fill
│  └─ Bar_Integrity_Background
│     └─ Bar_Integrity_Fill
├─ HUD_Thruster
│  ├─ Text_Speed
│  └─ Bar_Speed_Background
│     └─ Bar_Speed_Fill
├─ HUD_QuickActions
│  ├─ Button_OpenInventory
│  ├─ Button_OpenBuild
│  ├─ Button_OpenBDList
│  ├─ Button_Structure
│  └─ Button_BattleSettings
└─ HUD_BossBar
   ├─ Text_BossName
   └─ Bar_BossHP_Background
      └─ Bar_BossHP_Fill
```

功能说明：

| 节点 | 功能 |
| --- | --- |
| `Text_Level` | 当前等级。 |
| `Text_XP` / `Bar_XP_Fill` | 经验数值和经验条。 |
| `Text_Time` | 战斗时间。 |
| `Text_Danger` | 战斗警告、事件提示、低血提示。 |
| `Text_TimelineMarks` | 战斗进度和 Boss 时间提示。 |
| `Text_NextBeat` / `Bar_NextWave_Fill` | 下一波敌潮/精英/Boss 进度。 |
| `Text_Flow` | 当前飞船构筑流派。 |
| `Text_CoreHP` / `Bar_CoreHP_Fill` | 核心生命。 |
| `Text_Integrity` / `Bar_Integrity_Fill` | 飞船完整度。 |
| `Text_Speed` / `Bar_Speed_Fill` | 当前速度。 |
| `Button_OpenInventory` | 打开背包。 |
| `Button_OpenBuild` | 进入搭建界面。 |
| `Button_OpenBDList` | 打开升级三选一。 |
| `Button_Structure` | 打开结构总览。 |
| `Button_BattleSettings` | 打开战斗暂停设置。 |
| `HUD_BossBar` | Boss 出现时显示。 |
| `Text_BossName` / `Bar_BossHP_Fill` | Boss 名称和血条。 |

注意：

战斗 HUD 的关键节点缺失时，运行时会销毁该 prefab 实例并退回代码生成版 HUD，避免半残 UI 卡在场景里。

## 7. 设置界面：BrickSurvivor_SettingsUI

根节点：

```text
UI_SettingsRoot
```

层级结构：

```text
UI_SettingsRoot
└─ Panel_SettingsMain
   ├─ Text_SettingsTitle
   ├─ Button_CloseSettings
   ├─ Panel_Settings_LeftTabs
   │  ├─ Button_SettingsTab_Audio
   │  ├─ Button_SettingsTab_Graphics
   │  ├─ Button_SettingsTab_Controls
   │  ├─ Button_SettingsTab_Gameplay
   │  └─ Button_SettingsTab_Language
   ├─ Panel_Settings_ContentRoot
   ├─ Button_ResetSettings
   ├─ Button_ApplySettings
   ├─ Button_SaveBackSettings
   ├─ Button_ResumeBattleSettings
   ├─ Button_SaveExitBattleSettings
   └─ Button_BackSettings
```

功能说明：

| 节点 | 功能 |
| --- | --- |
| `Panel_Settings_ContentRoot` | 设置页动态内容父容器。切换页签时会清空并重新生成 `Runtime_Settings...` 节点。 |
| `Button_SettingsTab_Audio` | 音效设置页。 |
| `Button_SettingsTab_Graphics` | 画面设置页。 |
| `Button_SettingsTab_Controls` | 操控设置页。 |
| `Button_SettingsTab_Gameplay` | 游戏设置页。 |
| `Button_SettingsTab_Language` | 语言设置页。 |
| `Button_ResetSettings` | 恢复默认设置。 |
| `Button_ApplySettings` | 应用设置。 |
| `Button_SaveBackSettings` | 主界面显示“保存并返回”，战斗中显示“保存设置”。 |
| `Button_ResumeBattleSettings` | 战斗中显示，继续游戏。主界面隐藏。 |
| `Button_SaveExitBattleSettings` | 战斗中显示，保存并退出到主界面。主界面隐藏。 |
| `Button_BackSettings` / `Button_CloseSettings` | 关闭设置界面。 |

动态生成内容：

```text
Runtime_SettingsSlider_*
Runtime_SettingsToggle_*
Runtime_SettingsSegment_*
Runtime_SettingsAction_*
Runtime_SettingsInfo_*
```

这些节点由代码根据当前页签生成。可以改 `Panel_Settings_ContentRoot` 的位置和大小，但不要改名。

## 8. 图鉴界面：BrickSurvivor_CodexUI

根节点：

```text
UI_CodexRoot
```

层级结构：

```text
UI_CodexRoot
└─ Panel_CodexMain
   ├─ Text_CodexTitle
   ├─ Text_CodexProgress
   ├─ Button_CloseCodex
   ├─ Panel_Codex_LeftCategoryTabs
   │  ├─ Button_CodexTab_Core
   │  ├─ Button_CodexTab_Parts
   │  ├─ Button_CodexTab_Enemies
   │  ├─ Button_CodexTab_Boss
   │  └─ Button_CodexTab_Events
   ├─ ScrollView_CodexCardGrid
   ├─ Panel_Codex_ModelViewer
   │  ├─ RawImage_CodexModelPreview
   │  ├─ Text_ModelViewer
   │  └─ Panel_Codex_ModelToolbar
   │     ├─ Button_CodexViewReset
   │     ├─ Button_CodexViewFront
   │     ├─ Button_CodexViewSide
   │     ├─ Button_CodexViewTop
   │     ├─ Button_CodexViewAnim
   │     └─ Button_CodexViewBounds
   └─ Panel_Codex_RightDetail
      ├─ Text_DetailTitle
      └─ Text_DetailBody
```

功能说明：

| 节点 | 功能 |
| --- | --- |
| `Panel_Codex_LeftCategoryTabs` | 图鉴类别页签父节点。 |
| `Button_CodexTab_Core` | 玩家核心分类。 |
| `Button_CodexTab_Parts` | 积木部件分类，包含 BD 改造相关部件。 |
| `Button_CodexTab_Enemies` | 敌机分类。 |
| `Button_CodexTab_Boss` | Boss 分类。 |
| `Button_CodexTab_Events` | 事件分类。 |
| `ScrollView_CodexCardGrid` | 图鉴条目卡片父节点。 |
| `RawImage_CodexModelPreview` | 3D 模型预览画面。如果 prefab 中没有该节点，代码会在 `Panel_Codex_ModelViewer` 下创建。 |
| `Button_CodexViewReset` | 重置模型视角。 |
| `Button_CodexViewFront` | 正面视角。 |
| `Button_CodexViewSide` | 侧面视角。 |
| `Button_CodexViewTop` | 顶视角。 |
| `Button_CodexViewAnim` | 自动旋转开关。 |
| `Button_CodexViewBounds` | 连接点/边界显示开关。 |
| `Text_DetailTitle` / `Text_DetailBody` | 当前选中条目的详情文本。 |

动态生成内容：

```text
Runtime_CodexIconCard_*
Button_CodexPrevPage
Button_CodexNextPage
Text_CodexPage
Runtime_Codex3DPreview
Runtime_CodexPreviewCamera
Runtime_CodexPreviewKeyLight
Runtime_CodexPreviewRimLight
```

## 9. 升级三选一：BrickSurvivor_UpgradeSelectUI

根节点：

```text
Prefab_UI_BD_SelectPopupOverlay
```

层级结构：

```text
Prefab_UI_BD_SelectPopupOverlay
└─ BD_SelectPopup_Content
   ├─ Text_Title
   ├─ Text_Subtitle
   ├─ Button_Reroll
   └─ Button_Close
```

功能说明：

| 节点 | 功能 |
| --- | --- |
| `BD_SelectPopup_Content` | 三选一卡片父容器。 |
| `Button_Reroll` | 消耗刷新次数，重新随机升级选项。 |
| `Button_Close` | 关闭升级选择。 |

动态生成内容：

```text
Runtime_BDCard_1
Runtime_BDCard_2
Runtime_BDCard_3
```

每张卡片内部由代码生成：

```text
Text_Index
Icon_BD
Glow_Accent
Icon_BlockPreview
Text_Meta
Text_BDName
Text_BDBody
Button_SelectBD
```

如果要彻底 prefab 化升级卡片，可以后续新增 `BrickSurvivor_BDCardTemplate.prefab`，由代码实例化模板并填数据。

## 10. 积木背包：BrickSurvivor_InventoryUI

根节点：

```text
Prefab_UI_BlockInventoryOverlay
```

层级结构：

```text
Prefab_UI_BlockInventoryOverlay
└─ Prefab_UI_BlockInventory
   ├─ Text_Title
   ├─ Text_Count
   └─ Button_Close
```

功能说明：

| 节点 | 功能 |
| --- | --- |
| `Prefab_UI_BlockInventory` | 背包内容父容器。 |
| `Text_Count` | 显示未安装、背包总数、已装数量。 |
| `Button_Close` | 关闭背包。 |

动态生成内容：

```text
Runtime_Filter_全部
Runtime_Filter_链接
Runtime_Filter_攻击
Runtime_Filter_防御
Runtime_Filter_辅助
Runtime_Filter_特殊
Runtime_InventoryCard_*
Runtime_InventoryCard_Empty
Runtime_DetailPanel
```

每个背包部件卡片包含：

```text
TypeColor
Icon_InventoryBlock
Text_Name
Text_Meta
Button_Install
```

## 11. 飞船搭建：BrickSurvivor_BuildModeUI

根节点：

```text
Prefab_UI_BuildModeOverlay
```

层级结构：

```text
Prefab_UI_BuildModeOverlay
├─ BuildMode_TopBar
│  ├─ Text_BuildTitle
│  └─ Text_BuildHint
├─ BuildMode_Left_UnbuiltList
│  ├─ Text_UnbuiltTitle
│  ├─ Text_UnbuiltCount
│  ├─ Button_UnbuiltPrevPage
│  └─ Button_UnbuiltNextPage
├─ BuildMode_Right_BuiltList
│  ├─ Text_BuiltTitle
│  ├─ Text_BuiltCount
│  ├─ Text_SelectedBuilt
│  ├─ Button_BuiltPrevPage
│  ├─ Button_BuiltNextPage
│  ├─ Text_PlacementReason
│  └─ Text_StatsDelta
└─ BuildMode_BottomActions
   ├─ Button_PrevSlot
   ├─ Button_NextSlot
   ├─ Button_Rotate
   ├─ Button_ViewLeft
   ├─ Button_ViewRight
   ├─ Button_ViewReset
   ├─ Button_ZoomIn
   ├─ Button_ZoomOut
   ├─ Button_RemovePart
   ├─ Button_CancelHold
   ├─ Button_Confirm
   └─ Button_Continue
```

功能说明：

| 节点 | 功能 |
| --- | --- |
| `Text_BuildTitle` | 搭建模式标题，显示部件数量。 |
| `Text_BuildHint` | 当前操作提示、视角角度、安装状态。 |
| `BuildMode_Left_UnbuiltList` | 未安装部件列表父容器。 |
| `BuildMode_Right_BuiltList` | 已安装结构列表父容器。 |
| `Text_UnbuiltCount` | 未安装数量和页码。 |
| `Text_BuiltCount` | 已安装数量和页码。 |
| `Text_SelectedBuilt` | 当前选中的已安装部件信息。 |
| `Text_PlacementReason` | 当前安装是否合法的原因说明。 |
| `Text_StatsDelta` | 安装带来的属性变化。 |
| `Button_UnbuiltPrevPage` / `Button_UnbuiltNextPage` | 未安装列表翻页。 |
| `Button_BuiltPrevPage` / `Button_BuiltNextPage` | 已安装列表翻页。 |
| `Button_PrevSlot` / `Button_NextSlot` | 切换候选安装点。 |
| `Button_Rotate` | 旋转待安装部件朝向。 |
| `Button_ViewLeft` / `Button_ViewRight` | 左右旋转搭建视角。 |
| `Button_ViewReset` | 重置搭建视角。 |
| `Button_ZoomIn` / `Button_ZoomOut` | 调整搭建视角缩放。 |
| `Button_RemovePart` | 拆除选中部件。 |
| `Button_CancelHold` | 取消当前拿取或重排。 |
| `Button_Confirm` | 安装当前部件。 |
| `Button_Continue` | 退出搭建，继续战斗。 |

动态生成内容：

```text
Runtime_BuildInventoryItem_*
Runtime_BuildInventoryItem_Empty
Runtime_BuildInstalledItem_*
Runtime_BuildInstalledItem_Empty
```

## 12. 飞船结构总览：BrickSurvivor_StructureUI

根节点：

```text
Prefab_UI_ShipStructureOverlay
```

层级结构：

```text
Prefab_UI_ShipStructureOverlay
└─ Prefab_UI_ShipStructure
   ├─ Text_Title
   ├─ Text_StructureStats
   └─ Button_Close
```

功能说明：

| 节点 | 功能 |
| --- | --- |
| `Text_StructureStats` | 显示核心生命、完整度、安装部件、拾取范围、武器倍率、火力覆盖和部件列表。 |
| `Button_Close` | 关闭结构总览。 |

## 13. 战斗结算：BrickSurvivor_RunResultUI

根节点：

```text
Prefab_UI_RunResultOverlay
```

层级结构：

```text
Prefab_UI_RunResultOverlay
└─ Prefab_UI_RunResult
   ├─ Text_ResultTitle
   ├─ Text_ResultSubtitle
   ├─ Panel_ResultShipParts
   │  ├─ Text_ShipPartsTitle
   │  └─ Text_ShipPartsCount
   ├─ Panel_ResultBattleStats
   │  ├─ Text_BattleStatsTitle
   │  ├─ Text_ResultBody
   │  └─ Panel_ResultOutcomeStrip
   │     └─ Text_Outcome
   ├─ Button_ResultRetry
   └─ Button_ResultMainMenu
```

功能说明：

| 节点 | 功能 |
| --- | --- |
| `Text_ResultTitle` | 显示战斗胜利或作战失败。 |
| `Text_ResultSubtitle` | 结算副标题。 |
| `Panel_ResultShipParts` | 当前飞船部件卡片父容器。 |
| `Text_ShipPartsCount` | 当前部件数量。 |
| `Text_ResultBody` | 战斗数据：模式、地图、生存时间、等级、击破数、核心生命、完整度等。 |
| `Text_Outcome` | 结算状态。 |
| `Button_ResultRetry` | 再次挑战。 |
| `Button_ResultMainMenu` | 返回主界面。 |

动态生成内容：

```text
Runtime_ResultPartCard_*
Text_ResultMoreParts
```

每个部件卡片包含：

```text
Icon_ResultPart
Text_Name
Bar_ResultPartHp_Background
Bar_ResultPartHp_Fill
```

## 14. 动态 UI 内容说明

当前系统已经将“顶层界面”改为 prefab。以下内容仍由代码动态生成，因为它们依赖运行时数据：

| 动态内容 | 父容器 | 原因 |
| --- | --- | --- |
| 设置页行 | `Panel_Settings_ContentRoot` | 不同页签控件类型不同，需要动态生成滑条、开关、分段按钮。 |
| 图鉴条目卡片 | `ScrollView_CodexCardGrid` | 依赖当前分类、页码、配置数据。 |
| 升级三选一卡片 | `BD_SelectPopup_Content` | 每次升级随机选项不同。 |
| 背包筛选按钮和部件卡片 | `Prefab_UI_BlockInventory` | 背包内容随战斗变化。 |
| 搭建未安装列表 | `BuildMode_Left_UnbuiltList` | 未安装部件随拾取、安装变化。 |
| 搭建已安装列表 | `BuildMode_Right_BuiltList` | 飞船结构随安装、拆除、重排变化。 |
| 结算部件卡片 | `Panel_ResultShipParts` | 当前飞船部件数量和状态不同。 |
| 伤害跳字 | `Prefab_World_DamageTextPool` | 根据战斗命中实时生成。 |

后续如果要进一步 prefab 化，可以增加以下模板：

```text
BrickSurvivor_BDCardTemplate.prefab
BrickSurvivor_InventoryCardTemplate.prefab
BrickSurvivor_BuildInventoryItemTemplate.prefab
BrickSurvivor_BuildInstalledItemTemplate.prefab
BrickSurvivor_CodexIconCardTemplate.prefab
BrickSurvivor_ResultPartCardTemplate.prefab
BrickSurvivor_SettingsSliderTemplate.prefab
BrickSurvivor_SettingsToggleTemplate.prefab
```

然后将现有动态 `CreatePanel/CreateText/CreateButton` 改成实例化模板并填充文本、图标和事件。

## 15. 修改 UI 时的检查清单

修改 prefab 后建议检查：

1. 每个 Button 节点是否还带有 `Button` 组件。
2. 每个 `Text_...` 节点是否还带有 `Text` 组件。
3. 每个 `Bar_..._Fill` 是否还带有 `Image` 组件，并设置为 `Filled / Horizontal`。
4. 根节点是否带 `RectTransform`。
5. 弹窗遮罩根节点是否有可拦截点击的 `Image`。
6. 图鉴 3D 预览需要 `RawImage_CodexModelPreview`，除非希望代码自动创建。
7. 战斗 HUD 的关键节点不要删，否则会退回代码生成版 HUD。
8. 主界面和加载界面背景图可以直接改 `Image_MainMenuBackground` 和 `Image_LoadingBattleBackground` 的 Sprite。

## 16. 当前代码兜底策略

如果某个 prefab 不存在：

```text
Resources.Load 返回 null，运行时使用旧代码生成 UI。
```

如果某些关键节点缺失：

```text
运行时销毁该 prefab 实例，并使用旧代码生成 UI。
```

如果只是可选文本或装饰节点缺失：

```text
功能继续运行，不强制回退。
```

这样可以保证 UI 美术替换过程不容易把游戏流程卡死，同时保留足够的 prefab 自定义空间。
