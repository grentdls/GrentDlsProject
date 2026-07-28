# 270 区域随机敌人生成器规则：区域采样、随机列表与生成数量

## 1. 用途

区域生成器用于在一个可视化区域内随机生成敌人。

```text
PF_EnemySpawnArea
```

策划主要配置：

```text
EnemySpawnList
区域大小
生成数量
等级规则
刷新方式
刷新间隔
```

## 2. Prefab 结构

```text
PF_EnemySpawnArea
├── SpawnAreaVolume
├── ActivationVolume
├── ExclusionVolumes
├── PatrolAnchorGroup
├── EnemyAreaSpawner
├── EnemySpawnListReference
├── EnemyAreaSamplingConfig
├── EnemyRespawnConfig
└── DebugRoot
```

## 3. 区域形状

```text
Box
Sphere
Cylinder
Polygon
NavMeshArea
CustomCollider
```

日常关卡优先使用 Box。

## 4. 生成数量

支持：

```text
FixedCount
RandomRange
BudgetBased
ListSpecifiedCount
```

示例：

```text
固定生成 8 只
随机生成 5-10 只
按威胁预算生成 100 点敌人
```

## 5. 等级规则

区域可以统一覆盖敌人列表等级：

```text
Fixed
RandomRange
AreaLevelOffset
UseEntryLevel
```

优先级：

```text
生成器强制等级
> 敌人列表条目等级
> EnemyDefinition 默认等级
```

## 6. 位置采样

流程：

```text
在区域内随机取点
→ 向下检测地面
→ 检查 NavMesh
→ 检查坡度
→ 检查障碍物
→ 检查与其他敌人间距
→ 检查与玩家距离
→ 确认出生点
```

字段：

```text
RequireNavMesh
GroundLayer
MaxSlope
MinEnemySpacing
MinDistanceFromPlayer
MaxSampleAttempts
GroundOffset
```

## 7. 玩家安全距离

生成时避免贴脸：

```text
MinDistanceFromPlayer = 8 米
```

如果找不到点：

```text
延迟重试
减少本轮生成数量
使用预设备用点
```

不能强行把怪生成在玩家脚下。

## 8. 排除区域

可添加：

```text
门口
传送门
宝箱
剧情触发点
悬崖
安全区
```

通过 `SpawnExclusionVolume` 排除。

## 9. 生成朝向

```text
RandomYaw
LookAtAreaCenter
LookAtPlayer
UsePatrolDirection
```

## 10. 生成编队

可选：

```text
RandomScatter
Circle
Line
Cluster
LeaderAndFollowers
```

普通随机区域默认 RandomScatter。

## 11. 生成激活

```text
SceneStart
PlayerEnterActivationVolume
PlayerWithinDistance
MechanismActivated
Manual
```

激活区域和实际生成区域可以不同。

## 12. 最大存活数

```text
MaxAliveCount
```

用于防止固定时间刷新不断堆怪。

刷新前检查：

```text
当前存活数
正在出生数
对象池容量
区域是否活跃
```

## 13. 区域内敌人追踪

每个区域维护：

```text
SpawnedEnemyIds
AliveCount
DeadCount
CurrentWave
LastSpawnTime
PendingRespawn
```

敌人死亡或回池时必须通知所属生成器。

## 14. 巡逻配置

生成后可：

```text
原地待机
在区域随机巡逻
使用 PatrolAnchor
跟随队长
```

## 15. JSON 示例

```json
{
  "spawnerId": "AREA_SPAWN_FOREST_01",
  "spawnListId": "LIST_FOREST_COMMON_A",
  "areaShape": "Box",
  "spawnCount": {"mode": "RandomRange", "min": 6, "max": 10},
  "level": {"mode": "RandomRange", "min": 20, "max": 24},
  "activationMode": "PlayerEnterArea",
  "respawnMode": "AfterAllDead",
  "respawnDelay": 15,
  "maxAliveCount": 10,
  "sampling": {
    "requireNavMesh": true,
    "minEnemySpacing": 1.5,
    "minDistanceFromPlayer": 8,
    "maxSampleAttempts": 20
  }
}
```
