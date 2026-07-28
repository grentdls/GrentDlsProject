# World Service Interactions Sync

## 目标

在世界交互对象原型之上，补出一批更接近据点和地图服务点的交互对象，让探索、经济、恢复和任务入口开始连起来。

## 本次范围

### 世界服务交互物

- 新增 `NpcDialogueInteractable2D`
- 新增 `QuestBoardInteractable2D`
- 新增 `ShopInteractable2D`
- 新增 `ShrineInteractable2D`

### 会话与运行时数据接入

- 扩展 `GameSession`，补充任务接取、任务完成、金币消耗和经验发放入口
- 复用 `QuestDefinition` 与 `EquipmentDefinition`，避免把任务板和商店做成纯文本占位
- HUD 增加任务数和经验显示，便于快速验证服务型交互结果

### 编辑器原型搭建

- 扩展 `Setup Starter Test Slice`
- 自动生成 Camp Guide、Notice Board、Wagon Shop 和 Field Shrine
- 自动生成对应的任务定义与商店演示装备定义

## 本次不做

- 正式 NPC 对话 UI
- 正式任务目标追踪与完成条件
- 正式商店列表、背包与装备穿戴
- 正式祭坛动画、Buff 和仪式表现

## 后续建议

1. 给 `QuestBoardInteractable2D` 接正式任务状态机，把“立即完成”替换为真实目标追踪。
2. 给 `ShopInteractable2D` 接多商品列表和背包系统，并把购买结果从 `EquippedItemIds` 拆到独立库存。
3. 让 `NpcDialogueInteractable2D` 和 `ShrineInteractable2D` 接入正式 UI 与音频反馈，提升地图据点可读性。
