# World Map Interaction Foundation Sync

## 目标

在现有角色、战斗、交互和复活原型之上，补齐第一版地图地形与场景交互基础层，让世界探索形成最小闭环。

## 本次范围

### 地形层

- 新增 `TerrainDefinition`，统一承载地形类型、移动倍率、是否危险地形和环境伤害参数
- 新增 `TerrainZone2D` 与 `TerrainMovementReceiver2D`
- 玩家进入地形区域后可获得移动倍率修正，并支持危险地形持续掉血

### 地图区域与复活

- 新增 `RegionTrigger2D`，进入区域时更新 `GameSession.CurrentRegion`
- 新增 `MapRuntimeData`，记录已访问区域、已激活复活点、已消耗交互物
- 新增 `RespawnPoint2D`，让玩家死亡后可回到最近激活的复活点

### 世界交互

- 扩展 `IInteractable`，补充交互显示名和动词
- 扩展 `DebugInteractable`，支持交互类型、一次性消耗和会话内持久状态
- 新增 `TeleportPoint2D`，作为地图内传送/洞穴入口/门户的最小原型

### 原型验证

- 扩展 `Setup Starter Test Slice`
- 自动生成起始区域、复活点、道路区、毒沼区和双向传送门
- HUD 可显示当前区域、当前地形和更明确的交互提示

## 本次不做

- Tilemap 自动读取地形数据
- 跨场景地图加载与正式传送流程
- 完整地图存档序列化
- NPC、宝箱、机关、采集物的正式分支组件

## 后续建议

1. 把 `TerrainZone2D` 从手工触发器过渡到 Tilemap 或笔刷数据驱动。
2. 将 `RespawnPoint2D`、`TeleportPoint2D`、`DebugInteractable` 拆成更明确的对象类型，例如宝箱、洞穴入口、采集点和机关。
3. 在正式存档系统接入时，把 `MapRuntimeData` 序列化到存档文件，并增加区域迷雾、小地图和区域状态还原。
