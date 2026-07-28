# 250 关卡交互数据表、JSON 示例、开发流程与验收标准

## 1. 数据表清单

```text
PortalDefinitionTable
SpawnPointTable
InteractableDefinitionTable
DoorMotionTable
MovingPlatformPathTable
TrapDefinitionTable
MechanismLinkTable
ChestDefinitionTable
LootTable
ShrineDefinitionTable
DestructibleDefinitionTable
BreakActionTable
LevelObjectSaveTable
```

## 2. PortalDefinition

```json
{
  "portalId": "PORTAL_TOWN_FIRE_01",
  "prefab": "PF_Portal_Fire",
  "interactionMode": "InteractButton",
  "destination": {
    "type": "SceneSpawnPoint",
    "scene": "Dungeon_Fire_01",
    "spawnPointId": "Entrance_A"
  },
  "transition": {
    "type": "Fade",
    "fadeOut": 0.4,
    "fadeIn": 0.4
  },
  "conditions": [
    {
      "type": "QuestState",
      "id": "QUEST_FIRE_UNLOCK",
      "value": "Completed"
    }
  ]
}
```

## 3. DoorDefinition

```json
{
  "doorId": "DOOR_STONE_A",
  "mode": "Toggle",
  "motion": {
    "type": "Rotate",
    "localEuler": [0, 90, 0],
    "duration": 1.2,
    "curve": "EaseInOut"
  },
  "blockDetection": true,
  "saveState": true
}
```

## 4. MovingPlatformDefinition

```json
{
  "platformId": "PLATFORM_CAVE_01",
  "pathMode": "PingPong",
  "speed": 2.5,
  "waitTime": 1.0,
  "pathPoints": [
    [0, 0, 0],
    [0, 5, 0],
    [8, 5, 0]
  ],
  "carryPassengers": true
}
```

## 5. TrapDefinition

```json
{
  "trapId": "TRAP_FIREJET_01",
  "type": "FireJet",
  "cycle": {
    "warning": 0.6,
    "active": 2.0,
    "cooldown": 1.5
  },
  "damage": {
    "type": "Fire",
    "perTick": 35,
    "tickInterval": 0.25,
    "burnChance": 0.2
  },
  "destructible": true,
  "maxHealth": 300
}
```

## 6. ChestDefinition

```json
{
  "chestId": "CHEST_RARE_FIRE_01",
  "type": "Rare",
  "interaction": {
    "holdDuration": 0.8,
    "needKey": false
  },
  "lootTableId": "LOOT_CHEST_RARE_FIRE",
  "saveOpened": true
}
```

## 7. DestructibleDefinition

```json
{
  "destructibleId": "DEST_FALLING_PILLAR_01",
  "type": "FallingPillar",
  "maxHealth": 1200,
  "damageStages": [0.6, 0.25],
  "fallDirectionMode": "PresetTransform",
  "breakActions": [
    {
      "type": "SweepDamage",
      "shape": "Box",
      "damage": 2500,
      "damageType": "Physical",
      "knockdown": true
    },
    {
      "type": "DropLoot",
      "lootTableId": "LOOT_STONE_PILLAR"
    }
  ]
}
```

## 8. 开发阶段

### A：通用交互
```text
IInteractable
InteractionSensor
InteractionPrompt
Condition
Action
状态保存
```

### B：传送门
```text
同场景传送
跨场景传送
SpawnPointRegistry
位置回退
场景淡入淡出
```

### C：门与平台
```text
旋转门
平移门
Animator 门
两点平台
多点平台
乘客同步
```

### D：陷阱与开关
```text
地刺
喷火
压力板
拉杆
机关链接
```

### E：宝箱与掉落
```text
普通宝箱
稀有宝箱
材料/货币/装备/技能掉落
保底
掉落合并
```

### F：可破坏物
```text
资源矿
石墙
喷火器
石柱
爆炸桶
机关核心
```

### G：编辑器工具
```text
Gizmo
预览按钮
校验窗口
Prefab Variant
```

## 9. 第一版最小闭环

```text
传送门：Scene + SpawnPointId
同场景目标 Transform
大门旋转开关
移动平台两点往返
地刺陷阱
喷火陷阱
普通宝箱
稀有宝箱
资源矿
可破坏石墙
倒塌石柱
开关链接门和陷阱
Scene Gizmo
配置校验
```

## 10. 验收标准

```text
传送门可配置不同目标场景。
传送门可配置目标 SpawnPointId。
同场景传送可直接引用 Transform。
目标点不存在时有安全回退。
门可通过旋转、移动或动画打开关闭。
门关闭时不会夹住玩家。
移动平台可配置路径和停留时间。
玩家可稳定站在移动平台上。
地刺和喷火有预警、伤害、冷却。
陷阱可被开关关闭。
喷火陷阱可以被破坏。
宝箱可配置材料、货币、装备、技能概率和数量。
普通宝箱与稀有宝箱使用不同 LootTable。
资源矿破坏后掉落材料。
石墙破坏后开放通路。
石柱倒塌能造成区域高伤。
所有对象以 Prefab 制作。
Scene 视图能看到范围、方向和路径。
校验工具能发现空引用、重复 ID 和无效配置。
```
