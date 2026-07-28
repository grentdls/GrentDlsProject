# 18_交互系统设计：NPC、传送、场景物件

> 目标：定义统一的场景交互系统。所有 NPC、商店、铁匠、技能商人、仓库、传送点、宝箱、门、任务物件、机关都通过同一套 Interactable 框架实现。

---

## 1. 交互系统目标

交互系统需要支持：

- 玩家靠近显示提示。
- 手柄/键鼠都能交互。
- 多个交互物重叠时自动选择优先级最高的。
- 根据任务状态显示不同交互内容。
- NPC 可以打开对话、商店、打造、技能、仓库等 UI。
- 场景物件可以打开、破坏、触发机关、传送。
- 支持锁定状态、解锁条件、交互冷却。

---

## 2. 输入操作

| 操作 | 键鼠 | 手柄 | 功能 |
|---|---|---|---|
| 交互 | F | A / Cross | 和最近目标交互 |
| 取消 | Esc / 鼠标右键 | B / Circle | 关闭交互 UI |
| 切换交互目标 | 鼠标滚轮 / Tab | 右摇杆轻推 | 多目标时切换 |
| 快速拾取 | F / 鼠标左键 | A | 拾取掉落物 |
| 打开传送 | F | A | 打开传送 UI |
| 商店购买 | 鼠标左键 | A | 买物品 |
| 商店出售 | 右键 / Shift+左键 | X / Square | 卖物品 |

---

## 3. 交互对象接口

所有可交互物都实现统一接口：

```csharp
public interface IInteractable
{
    string InteractableId { get; }
    string DisplayName { get; }
    InteractableType Type { get; }
    int Priority { get; }
    bool CanInteract(PlayerContext player);
    InteractionPrompt GetPrompt(PlayerContext player);
    void Interact(PlayerContext player);
}
```

### 3.1 InteractableType

```text
NPC
Shop
Blacksmith
SkillMerchant
Stash
Waypoint
Portal
Chest
Door
QuestObject
MapDevice
CraftingBench
TrainingDummy
Shrine
Breakable
EventObject
```

### 3.2 交互优先级

| 对象 | Priority | 说明 |
|---|---:|---|
| 任务物件 | 100 | 最高，避免被杂物挡住 |
| NPC 主线任务 | 90 | 主线优先 |
| 传送门/出口 | 80 | 地图切换优先 |
| 宝箱 | 70 | 奖励物件 |
| NPC 商店 | 60 | 功能 NPC |
| 仓库/铁匠/技能商人 | 60 | 功能 NPC |
| 普通门 | 50 | 地图推进 |
| 事件物件 | 50 | 玩法事件 |
| 掉落物 | 40 | 可大量存在 |
| 可破坏物 | 10 | 一般不走交互，走攻击破坏 |

---

## 4. 玩家交互检测

### 4.1 PlayerInteractionController

挂在玩家身上。

```text
Player
└── Components
    ├── PlayerInteractionController
    ├── InteractionTargetSelector
    ├── InteractionInputHandler
    └── InteractionUIBinder
```

字段：

```text
InteractRadius = 3.0m
InteractAngle = 120 度
MaxCandidates = 8
RequireLineOfSight = true
UsePrioritySort = true
```

### 4.2 检测流程

```text
每帧检测玩家周围 Interactable
  ↓
过滤不可交互对象
  ↓
过滤距离和角度
  ↓
可选：检测视线
  ↓
按优先级、距离、朝向排序
  ↓
选中当前交互目标
  ↓
显示交互提示
```

### 4.3 多目标处理

当多个对象重叠时：

1. 任务对象优先。
2. 最近对象优先。
3. 玩家朝向更接近的对象优先。
4. 鼠标悬停对象优先。
5. 玩家可按 Tab/右摇杆切换。

---

## 5. 交互提示 UI

Prefab：

```text
UI_InteractionPrompt
├── Root
├── Background
├── InputIcon
├── ActionText
├── TargetNameText
├── RequirementText
└── LockIcon
```

显示示例：

```text
[F] 与 铁锤格兰 交谈
[F] 打开仓库
[F] 使用传送石
[F] 打开宝箱
[需要：黑炉钥匙] 打开 Boss 门
```

世界空间提示：

```text
PF_WorldInteractionPrompt
├── Canvas_WorldSpace
├── BillboardToCamera
├── Icon
├── Text
└── DistanceFade
```

---

## 6. NPC 交互系统

### 6.1 NPC Prefab 基础结构

```text
PF_NPC_Base
├── Model
├── Animator
├── Collider_InteractTrigger
├── UIAnchor_Nameplate
├── UIAnchor_Icon
├── Audio
├── VFX_QuestAvailable
└── Components
    ├── Interactable_NPC
    ├── NPCIdentity
    ├── NPCDialogueProvider
    ├── NPCServiceProvider
    ├── NPCQuestStateView
    └── NPCInteractionCondition
```

### 6.2 NPC 交互菜单

和 NPC 交互后，根据 NPC 功能显示菜单。

```text
NPCInteractionMenu
├── 对话
├── 商店
├── 打造
├── 技能
├── 仓库
├── 任务
├── 传送
└── 离开
```

如果 NPC 只有一个功能，可以直接打开对应 UI。

### 6.3 NPC 状态

| 状态 | 表现 |
|---|---|
| Idle | 待机动作 |
| QuestAvailable | 头顶感叹号 |
| QuestInProgress | 头顶省略号 |
| QuestComplete | 头顶问号 |
| ShopAvailable | 头顶商店图标 |
| Locked | 灰色图标 |
| Hidden | 不显示或隐藏 |

---

## 7. 传送系统

### 7.1 传送类型

| 类型 | 功能 |
|---|---|
| Waypoint | 主城/地图固定传送点 |
| TownPortal | 玩家创建回城门 |
| ExitPortal | 地图出口传送 |
| BossExitPortal | Boss 死亡后生成的出口 |
| MapDevicePortal | 终局地图装置生成的入口 |
| EventPortal | 事件入口 |

### 7.2 Waypoint 交互流程

```text
玩家靠近传送点
  ↓
显示 [F] 使用传送
  ↓
打开 UI_WaypointMap
  ↓
选择已解锁地图
  ↓
确认传送
  ↓
保存当前状态
  ↓
加载目标 Scene
  ↓
放置玩家到目标 SpawnPoint
```

### 7.3 Waypoint 数据

```text
WaypointData
├── WaypointId
├── DisplayName
├── SceneId
├── SpawnPointId
├── ActIndex
├── UnlockCondition
├── IsHub
├── IsDefaultUnlocked
└── IconId
```

### 7.4 回城门

回城门由玩家主动创建。

Prefab：

```text
PF_TownPortal
├── Model_PortalRing
├── VFX_Portal
├── Collider_InteractTrigger
├── UIAnchor
├── Audio_Loop
└── Components
    ├── Interactable_Portal
    ├── PortalDestination
    ├── PortalLifetime
    └── PortalOwner
```

规则：

- 同一玩家同一时间只允许一个回城门。
- 在 Boss 战中不能开回城门，除非特殊设计允许。
- 从战斗地图回城后，主城生成返回传送门。
- 返回传送门可以回到原地图位置。
- 终局地图可限制回城次数。

---

## 8. 门和场景机关交互

### 8.1 普通门

```text
PF_Door_Normal
├── Model
├── Animator
├── Collider_Blocker
├── Collider_InteractTrigger
└── Interactable_Door
```

交互：按 F 开门/关门。

### 8.2 锁门

需要条件：

- 钥匙道具。
- 任务完成。
- 击杀精英。
- 激活机关。

### 8.3 机关

机关类型：

| 类型 | 玩法 |
|---|---|
| 拉杆 | 开门/关陷阱 |
| 压力板 | 踩上触发机关 |
| 符文柱 | 按顺序激活 |
| 能量核心 | 攻击破坏 |
| 旋转镜 | 调整方向解锁光束 |
| 祭坛 | 激活后刷怪 |

机关 Prefab：

```text
PF_Interactable_Lever
├── Model
├── Animator
├── Collider_InteractTrigger
├── VFX_Active
├── Audio
└── Components
    ├── Interactable_Switch
    ├── TriggerOutput
    └── InteractionCondition
```

---

## 9. 宝箱交互

宝箱也是 Interactable，但有专门奖励逻辑。

流程：

```text
玩家靠近宝箱
  ↓
显示打开提示
  ↓
按 F
  ↓
检查宝箱状态
  ↓
播放开启动画
  ↓
调用 LootDirector
  ↓
生成掉落
  ↓
宝箱状态设为 Opened
```

宝箱状态：

| 状态 | 说明 |
|---|---|
| Locked | 锁住，需要条件 |
| Closed | 未打开 |
| Opening | 正在开启动画 |
| Opened | 已打开，不可重复 |
| Cursed | 打开后触发战斗 |
| RewardPending | 事件成功后可打开 |

---

## 10. 交互系统数据表

### 10.1 InteractableData

```text
InteractableId
Type
DisplayName
PromptText
IconId
Priority
InteractRadius
RequireLineOfSight
ConditionId
ActionId
Cooldown
CanRepeat
SaveState
```

### 10.2 InteractionCondition

```text
ConditionId
ConditionType
RequiredQuestId
RequiredItemId
RequiredLevel
RequiredMapState
RequiredFlag
FailMessage
```

### 10.3 InteractionAction

```text
ActionId
ActionType
OpenUIId
StartDialogueId
OpenShopId
TeleportTargetId
TriggerEventId
GrantRewardId
ConsumeItemId
SetFlagId
```

---

## 11. 交互系统验收标准

- [ ] 玩家靠近对象时显示正确提示。
- [ ] 离开对象时提示消失。
- [ ] 多个对象重叠时优先级正确。
- [ ] 锁定对象显示失败原因。
- [ ] NPC 可打开对应功能。
- [ ] 传送点可打开传送地图。
- [ ] 门可按状态打开或锁定。
- [ ] 宝箱只可打开一次。
- [ ] 回城门能返回原位置。
- [ ] 交互状态能保存和恢复。

---
