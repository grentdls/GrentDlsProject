# 275 Boss、精英、特殊敌人、刷怪房与遭遇战接入规则

## 1. 固定 Boss

使用：

```text
EnemyFixedSpawner
+ EncounterController
```

流程：

```text
玩家进入触发区
→ 锁门
→ 播放过场
→ 生成 Boss
→ 启动 Boss HUD
→ 战斗
→ Boss 死亡
→ 生成奖励
→ 解锁出口
```

Boss 默认不重复刷新，除非副本重置。

## 2. 固定精英

使用固定生成器，配置：

```text
Rank = Elite
固定或随机词缀
掉落倍率
护卫列表
死亡动作
```

## 3. 特殊敌人

例如：

```text
钥匙守卫
传送门守卫
无敌机关怪
逃跑宝藏怪
任务目标
隐身伏击怪
```

通过条件与动作接入：

```text
SpawnConditionList
OnSpawnActionList
OnCombatActionList
OnDeathActionList
```

## 4. 普通随机敌人区域

使用区域生成器：

```text
EnemySpawnArea
+ EnemySpawnList
+ AfterAllDead 刷新
```

## 5. 刷怪房

刷怪房需要独立 `EncounterGroupId`。

流程：

```text
进入房间
→ 关闭所有门
→ 生成 Wave 1
→ 全部清除
→ 生成 Wave 2
→ 生成精英波
→ 完成
→ 开门并生成宝箱
```

## 6. 混合生成

一个房间可以同时使用：

```text
固定精英生成器
+ 区域普通怪生成器
```

但必须归属于同一个 EncounterController，避免一边完成、一边仍有怪存活。

## 7. 遭遇完成条件

```text
AllSpawnGroupsCompleted
AllTrackedEnemiesDead
BossDead
TimerCompleted
ObjectiveCompleted
```

## 8. 增援

当条件满足：

```text
Boss 血量降低
普通怪数量过低
玩家触发机关
时间到达
```

可调用区域生成器生成增援。

## 9. 伏击敌人

入场方式：

```text
地下钻出
墙后跳出
高处落下
传送出现
伪装物变身
```

生成器仍只负责创建，表现由 SpawnPresentationProfile 配置。

## 10. 巡逻敌人

区域生成后分配：

```text
PatrolRouteId
RandomPatrolInArea
LeaderFollowerFormation
```

## 11. 遭遇重置

玩家死亡后：

```text
回收当前敌人
重置门
重置波次
恢复 Boss
重新等待激活
```

可配置是否保留部分进度。

## 12. 奖励接入

遭遇完成后：

```text
生成宝箱
掉落钥匙
激活传送门
完成任务
解锁祭坛
增加关卡评分
```

## 13. 状态保存

```text
Boss：永久清理或副本重置
任务怪：任务状态保存
普通刷怪区：会话级
刷怪房：离开副本后重置
```

## 14. 验收标准

```text
Boss 不会重复生成
刷怪房必须全部清除才结束
固定精英和随机小怪可共同计入遭遇
玩家死亡后遭遇可正确重置
奖励只触发一次
```
