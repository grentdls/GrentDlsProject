# 277 敌人生成与 AI 配置：JSON、开发流程、测试与验收

## 1. 固定生成器 JSON

```json
{
  "spawnerId": "SP_FIXED_ELITE_01",
  "type": "Fixed",
  "enemyId": "ENEMY_STONE_ELITE",
  "levelRule": {"mode": "RandomRange", "min": 32, "max": 36},
  "activationMode": "PlayerWithinDistance",
  "activationDistance": 20,
  "repeatSpawn": true,
  "respawn": {
    "mode": "AfterAllDead",
    "delay": 30,
    "maxCount": 3,
    "playerMustBeAway": true,
    "minPlayerDistance": 12
  }
}
```

## 2. 区域生成器 JSON

```json
{
  "spawnerId": "SP_AREA_CAVE_01",
  "type": "Area",
  "spawnListId": "LIST_CAVE_COMMON",
  "spawnCount": {"mode": "RandomRange", "min": 8, "max": 12},
  "levelRule": {"mode": "Fixed", "value": 28},
  "maxAliveCount": 12,
  "activationMode": "PlayerEnterArea",
  "respawn": {
    "mode": "AfterAllDead",
    "delay": 20,
    "maxCount": -1
  },
  "sampling": {
    "requireNavMesh": true,
    "minEnemySpacing": 1.5,
    "minDistanceFromPlayer": 8,
    "maxAttemptsPerEnemy": 20
  }
}
```

## 3. AI 警戒 JSON

```json
{
  "aggroOnProximity": true,
  "aggroRadius": 12,
  "aggroVerticalRange": 4,
  "detectionInterval": 0.25,
  "aggroOnDamage": true,
  "combatPersistence": "UntilDeath",
  "targetSelection": "NearestPlayerFactionUnit",
  "prioritizeDamageSource": true
}
```

## 4. 木桩 JSON

```json
{
  "aggroOnProximity": false,
  "aggroOnDamage": false,
  "combatPersistence": "None",
  "canMove": false,
  "canAttack": false,
  "autoResetHealth": true,
  "resetDelay": 3
}
```

## 5. 开发阶段

### 阶段 A：基础生成

```text
EnemyDefinition 解析
固定生成器
等级规则
死亡回调
对象池
```

### 阶段 B：区域生成

```text
区域采样
NavMesh 检查
敌人列表抽取
数量与权重
运行时分组
```

### 阶段 C：刷新

```text
全部清除刷新
固定间隔刷新
最大存活数
玩家安全距离
状态保存
```

### 阶段 D：AI 警戒

```text
主动警戒
受击激怒
UntilDeath
木桩模式
```

### 阶段 E：目标选择

```text
角色
召唤物
最近目标
伤害来源
仇恨与嘲讽
```

### 阶段 F：编辑器

```text
Gizmo
列表配置器
测试场景
模拟生成
校验工具
```

## 6. 第一版最小闭环

```text
固定敌人生成器
固定/随机等级
区域随机生成器
敌人列表 ScriptableObject
全部清除后刷新
刷新间隔
最大存活数
主动警戒开关
受击激怒开关
最近玩家阵营目标
UntilDeath 追击
木桩模式
测试场景
```

## 7. 功能验收

```text
固定生成器可选择任意 EnemyDefinition。
固定生成器可配置固定等级或随机区间。
固定生成器可配置重复刷新和刷新次数。
区域生成器只需引用一个敌人列表即可工作。
区域生成器可在盒子内找到有效 NavMesh 点。
全部由该生成器创建的敌人死亡后才开始刷新。
其他生成器的敌人不会影响当前区域刷新。
玩家站在出生点附近时不会贴脸刷怪。
Boss 默认不会无限刷新。
敌人进入警戒范围后进入战斗并持续追杀。
敌人受到超远距离攻击后会进入战斗。
受击后可选择攻击来源或最近玩家阵营单位。
召唤物可以成为有效目标。
两个警戒开关关闭时敌人不会反击。
木桩不会启动攻击行为树。
```

## 8. 性能验收

测试：

```text
10 个区域生成器
同时存活 100 个敌人
多个刷新倒计时
30 个敌人同时警戒检测
大量敌人回池和再生成
```

要求：

```text
稳定阶段无明显 GC.Alloc
不会每帧全场 Find 玩家单位
对象池回收后无事件泄漏
警戒检测可降频
离开激活范围的生成器可休眠
```

## 9. 错误日志要求

错误信息必须包含：

```text
SceneName
SpawnerId
SpawnListId
EnemyDefinitionId
失败原因
采样次数
```

不能只输出“Spawn Failed”。
