# 30_NPC 对话、功能商人、任务交互 UI 预制体


> 设计边界说明：本项目可以参考《流放之路2》这类暗黑刷宝 ARPG 的信息架构、交互复杂度和系统深度，但不能一比一复制其 UI 视觉、图标、文字、专有数值、专有命名、具体排版截图。本批文档采用“同类结构 + 原创表现”的方式：界面功能、层级、预制体和数据绑定可直接用于 Unity 原型开发。


## 1. NPC 交互 UI 定位

NPC 交互是主城功能入口。每个 NPC 可能同时承担：

1. 对话。
2. 商店。
3. 任务。
4. 打造。
5. 传送。
6. 技能服务。
7. 剧情推进。

因此 NPC 对话 UI 不能只是对白框，而要支持功能按钮列表。

## 2. NPC 对话总 Prefab

```text
UI_NPCDialogPanel.prefab
├── DimBackground
├── DialogFrame
│   ├── LeftPortraitPanel
│   │   ├── NPCPortrait
│   │   ├── NPCNameText
│   │   ├── NPCTitleText
│   │   └── ReputationBadge
│   ├── CenterDialogPanel
│   │   ├── DialogTextScroll
│   │   │   └── DialogText
│   │   ├── VoicePlayingIcon
│   │   └── ContinueHint
│   ├── RightFunctionPanel
│   │   ├── FunctionButton_Shop
│   │   ├── FunctionButton_Blacksmith
│   │   ├── FunctionButton_SkillVendor
│   │   ├── FunctionButton_Quest
│   │   ├── FunctionButton_Stash
│   │   ├── FunctionButton_Waypoint
│   │   └── FunctionButton_Goodbye
│   └── BottomChoicePanel
│       └── DialogChoiceButton[]
└── HotkeyHintBar
```

## 3. NPC 功能按钮 Prefab

```text
UI_NPCFunctionButton.prefab
├── ButtonBackground
├── FunctionIcon
├── FunctionNameText
├── NewMarker
├── QuestMarker
├── LockedOverlay
├── CostBadge
├── HoverGlow
└── SelectedOutline
```

状态：

| 状态 | 说明 |
|---|---|
| Normal | 可点击 |
| New | 新功能解锁 |
| QuestAvailable | 有可接任务 |
| QuestComplete | 有可交任务 |
| Locked | 功能未解锁 |
| Disabled | 当前场景不可用 |

## 4. 任务交互 UI

```text
UI_QuestDialogPanel.prefab
├── QuestHeader
│   ├── QuestTitleText
│   ├── QuestTypeBadge
│   └── RecommendedLevelText
├── QuestDescriptionScroll
│   └── QuestDescriptionText
├── ObjectiveList
│   └── UI_QuestObjectiveRow[]
├── RewardPreviewPanel
│   ├── GoldRewardRow
│   ├── ExpRewardRow
│   ├── ItemRewardSlot[]
│   └── ChoiceRewardSlot[]
├── RequirementWarningText
└── ActionButtons
    ├── AcceptButton
    ├── CompleteButton
    ├── TrackButton
    └── CancelButton
```

## 5. 任务目标行 Prefab

```text
UI_QuestObjectiveRow.prefab
├── CheckboxIcon
├── ObjectiveText
├── ProgressText
├── LocationButton
└── RewardMarker
```

## 6. 交互提示 UI

当玩家靠近 NPC、宝箱、传送门、机关时显示。

```text
UI_InteractPrompt.prefab
├── PromptBackground
├── InteractKeyIcon
├── ObjectNameText
├── ActionText
├── HoldProgressRing
├── DisabledReasonText
└── ExtraHintText
```

交互提示文案示例：

```text
[E] 与铁匠交谈
[E] 打开宝箱
[长按 E] 进入地图
[E] 激活传送点
需要钥匙
战斗中无法使用
```

## 7. 交互系统流程

```text
玩家进入 InteractableTrigger
→ InteractDetector 找到优先级最高的交互对象
→ UI_InteractPrompt 显示
→ 玩家按 E / 手柄确认键
→ Interactable.Execute(player)
→ 根据类型打开对应 UI 或执行逻辑
```

## 8. Interactable 类型

| 类型 | 打开的 UI/逻辑 |
|---|---|
| NPC_Dialog | `UI_NPCDialogPanel` |
| NPC_Shop | `UI_ShopRoot` |
| NPC_Blacksmith | `UI_BlacksmithRoot` |
| NPC_SkillVendor | `UI_SkillVendorRoot` |
| Waypoint | `UI_WaypointRoot` |
| Portal | 直接传送/确认进入 |
| Chest | 播放开启动画 + 掉落 |
| Shrine | 显示祭坛选择/直接加 Buff |
| QuestObject | 更新任务进度 |
| Door | 开门/切换区域 |

## 9. NPC 数据结构

```csharp
class NPCViewModel
{
    string NPCId;
    string DisplayName;
    string Title;
    string PortraitId;
    List<NPCFunction> Functions;
    List<QuestStateViewModel> RelatedQuests;
    DialogueState CurrentDialogue;
    int ReputationLevel;
}
```

## 10. 原型验收标准

1. 靠近 NPC 显示交互提示。
2. 按 E 打开 NPC 对话面板。
3. NPC 右侧功能按钮可以打开商店、铁匠、技能商人、仓库、传送。
4. 任务可接、可交、已完成状态显示不同标识。
5. 手柄可以选择对话选项和功能按钮。
