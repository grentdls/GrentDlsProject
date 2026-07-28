# World Interaction Object Prototypes Sync

## 目标

在地图地形与传送基础层之上，补出第一批更接近正式玩法语义的世界交互对象原型。

## 本次范围

### 通用交互基类

- 新增 `WorldInteractableBase2D`
- 统一封装交互名称、交互动词、交互类型、一次性消耗状态和会话内持久恢复
- 让普通交互物、传送门和洞穴入口都复用同一套最小交互骨架

### 世界对象原型

- 新增 `RewardChestInteractable2D`
- 新增 `CollectibleInteractable2D`
- 新增 `MechanismSwitch2D`
- 新增 `DungeonEntrance2D`
- 将 `DebugInteractable` 和 `TeleportPoint2D` 迁移到通用基类

### 原型玩法闭环

- 宝箱和采集物会给玩家发放金币奖励
- 机关可控制动态阻挡和隐藏奖励点
- 洞穴入口提供最小可用的“进入洞穴 / 离开洞穴”体验
- HUD 补充金币显示，方便快速验证奖励链路

### 场景自动搭建

- 扩展 `Setup Starter Test Slice`
- 自动生成宝箱、采集物、隐藏缓存、机关开关、阻挡门、洞穴入口和洞穴出口
- 保留原有区域、地形、复活点和传送门搭建逻辑

## 本次不做

- 正式 NPC 对话与任务接入
- 正式掉落背包和物品表
- 洞穴跨场景加载
- 机关音效、动画和正式特效表现

## 后续建议

1. 基于 `WorldInteractableBase2D` 继续拆分出 NPC、商店、任务板和祭坛等更明确的交互物。
2. 给 `RewardChestInteractable2D` 和 `CollectibleInteractable2D` 接正式掉落定义，而不是当前的简化金币奖励。
3. 给 `MechanismSwitch2D` 扩展多阶段机关、压力板和区域触发版本，用于地图谜题和副本流程。
