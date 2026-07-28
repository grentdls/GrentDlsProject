# 死亡掉落与自动拾取表现规则

## 目标

敌人死亡后不再直接把奖励塞进玩家背包，而是先生成可见掉落物：

- 掉落物从死亡单位中心点生成。
- 掉落物以抛物线形式散落到死亡单位周围。
- 玩家靠近拾取范围后自动拾取，不需要点击交互。
- 拾取时掉落物飞向玩家角色身上。
- 不同稀有度使用不同颜色、光圈、闪烁和高稀有度文字提示。

## 运行时链路

```text
Health.Died
-> DeathLootDropper2D
-> CharacterConfigDefinition.Drop
-> LootPickup2D
-> 玩家进入拾取半径
-> 掉落物飞向玩家 UiAnchor
-> GameSession 发放奖励
```

## 配置来源

`CharacterConfigDefinition.Drop` 是敌人的掉落配置入口：

- `GoldMin` / `GoldMax`：随机金币数量。
- `Items`：掉落物 ID 列表。
- `ItemId`：优先解析为 `InventoryItemDefinition.Id`，找不到时解析为 `EquipmentDefinition.Id`。
- `DropRate`：单个掉落项概率。
- `MinCount` / `MaxCount`：道具数量范围，装备固定按 1 个发放。

掉落解析会搜索：

- `GameBootstrapConfig.StartingInventoryItems`
- `GameBootstrapConfig.StartingEquipment`
- `GameBootstrapConfig.DefaultEnemyCharacterConfigs`
- `GameSession.RuntimeInventoryItemDefinitions`
- `GameSession.RuntimeEquipmentDefinitions`
- `Resources.LoadAll<InventoryItemDefinition>`
- `Resources.LoadAll<EquipmentDefinition>`

如果敌人没有挂 `CharacterConfigRuntimeBridge`，或角色配置里的 `Drop.Items` 为空，运行时会使用 `EnemyDefinition` 兜底：

- `EnemyDefinition.GoldReward` 会生成金币掉落。
- 根据敌人 ID 从第一章材料池选择一个可见材料掉落。
- 蜜蜂/蜂巢类优先掉落 `item_ch01_bee_wax`。
- 飞虫/蝙蝠类优先掉落 `item_ch01_scale_light`。
- 大鹅优先掉落 `item_ch01_goose_feather`。
- 黑草/毒芽类优先掉落 `item_ch01_black_grass_pack`。
- 枯根类优先掉落 `item_ch01_dry_mushroom`。
- 山鼠/史莱姆类优先掉落 `item_ch01_wild_radish`。

兜底材料必须被加入 `GameBootstrapConfig.StartingInventoryItems`，否则普通运行时无法从非 `Resources` 目录稳定解析到资产。

## 表现规则

掉落阶段：

- 生成点为死亡单位逻辑中心点上方。
- 落点在死亡单位周围随机半径范围内。
- 运动轨迹为 `Lerp + Sin` 抛物线，不依赖物理碰撞，避免掉落物互相挤压。

等待拾取阶段：

- 掉落物原地轻微浮动。
- 始终显示稀有度光圈。
- `Rare` 及以上显示名称标签。

拾取阶段：

- 玩家进入拾取范围后自动触发。
- 掉落物飞向玩家 `UnitPresentationRoot2D.UiAnchor`，没有锚点时飞向玩家头顶。
- 飞行完成后发放奖励并销毁掉落物。

## 稀有度表现

| 稀有度 | 表现 |
|---|---|
| Common | 灰白弱光圈 |
| Uncommon | 绿色光圈 |
| Rare | 蓝色脉冲光圈 + 名称 |
| Epic | 紫色强光圈 + 旋转闪光 + 名称 |
| Legendary | 金橙强脉冲 + 大闪光 + 名称 |
| Mythic | 红色高强度闪光 + 名称 |
| Quest | 金黄色任务提示光 |
| Unique | 青绿色唯一物品提示光 |

## 当前实现文件

- `Assets/Game/Runtime/Gameplay/Loot/DeathLootDropper2D.cs`
- `Assets/Game/Runtime/Gameplay/Loot/LootPickup2D.cs`
- `Assets/Game/Runtime/Gameplay/Loot/LootPickupReward.cs`

## 接入点

- `SimpleEnemyController2D`：近战敌人死亡掉落。
- `SimpleRangedEnemyController2D`：远程和飞行敌人死亡掉落。
- `CharacterConfigRuntimeBridge`：角色配置覆盖时同步掉落配置。
- `EnemyDefinition`：无角色掉落表时提供金币和默认材料兜底。

## 后续扩展

- 后续可以把散落半径、吸附半径、飞行速度、稀有度特效强度抽到全局掉落配置表。
- 如果增加专门掉落音效，可在 `LootPickup2D.Collect()` 和高稀有度生成时接入 `GameAudioManager`。
- 如果未来需要拾取日志或战利品面板，应监听奖励发放事件，不要在掉落物里直接驱动背包 UI。
