# 273 敌人警戒与战斗状态配置：主动攻击、受击激怒与木桩模式

## 1. 核心配置

每个敌人增加 `EnemyAggroConfig`：

```text
AggroOnProximity
AggroRadius
AggroVerticalRange
RequireLineOfSight
AggroOnDamage
DamageAggroRangeOverride
CombatPersistence
CanMove
CanAttack
CanUseSkills
```

默认值：

```text
AggroOnProximity = true
AggroOnDamage = true
CombatPersistence = UntilDeath
```

## 2. 主动警戒

当 `AggroOnProximity = true`：

```text
玩家阵营单位进入警戒范围
→ 检查高度差
→ 可选检查视线
→ 选择目标
→ 进入 Combat 状态
→ 开始追击与攻击
```

警戒范围默认以敌人为中心：

```text
Sphere 或 Cylinder
```

室内关卡推荐 Cylinder，避免楼上楼下误触。

## 3. 警戒范围字段

```text
AggroRadius
AggroVerticalRange
PeripheralVisionAngle
SightDistance
HearingRadius
RequireLineOfSight
DetectionInterval
```

第一版可只使用：

```text
AggroRadius + AggroVerticalRange
```

## 4. 受击激怒

当 `AggroOnDamage = true`：

```text
敌人受到玩家阵营伤害
→ 立即进入战斗
→ 不受原始警戒半径限制
→ 记录攻击来源
→ 搜索有效玩家阵营目标
→ 选择目标并追击
```

这可以处理玩家从远距离狙击敌人的情况。

## 5. 受击后目标选择

默认优先：

```text
伤害来源仍有效时优先攻击伤害来源
否则选择最近的玩家阵营单位
```

玩家阵营包括：

```text
玩家角色
队友角色
召唤物
临时盟友
玩家控制单位
```

## 6. 持续追杀

用户需求的默认模式：

```text
CombatPersistence = UntilDeath
```

一旦进入战斗：

```text
不会因离开警戒范围脱战
不会因短时间看不见玩家脱战
持续追踪有效玩家阵营目标
直到敌人死亡
```

为了避免跨整张地图追击，可保留可选模式：

```text
LeashToSpawn：超出出生点范围返回
Timeout：长时间无目标后脱战
UntilEncounterEnds：遭遇结束才停战
```

但默认仍为 UntilDeath。

## 7. 两个开关组合

| 主动警戒 | 受击激怒 | 行为 |
|---|---|---|
| 开 | 开 | 默认敌人，主动发现且受击反击 |
| 开 | 关 | 会主动攻击，但被超远距离攻击不一定反击 |
| 关 | 开 | 中立敌人，被攻击后反击 |
| 关 | 关 | 完全被动，不进入战斗，适合木桩 |

## 8. 木桩模式

当两个开关都关闭时，推荐自动切换：

```text
DisableCombatBrain = true
StopBehaviorTree = true
CanMove = false
CanAttack = false
```

木桩可选功能：

```text
自动回血
伤害统计
DPS 统计
承受异常状态
免疫击退
不死亡
手动重置
切换护甲/抗性模板
```

## 9. 战斗状态机

```text
Idle
Alert
AcquireTarget
Combat
Chase
Attack
SearchTarget
Dead
```

木桩仅使用：

```text
Idle
HitReaction 可选
Dead 可选
```

## 10. 进入战斗事件

```text
OnCombatEntered
OnTargetAcquired
OnAggroByProximity
OnAggroByDamage
```

可用于：

```text
显示血条
播放警觉动画
播放叫喊
通知附近同组敌人
启动战斗音乐
锁门
```

## 11. 群体警戒

可选：

```text
ShareAggroWithGroup
ShareAggroRadius
EncounterGroupId
```

一只敌人进入战斗后可通知附近同组敌人。

## 12. 性能规则

```text
警戒检测不必每帧运行
普通敌人 0.2-0.4 秒检测一次
远处敌人降低频率
休眠敌人停止检测
使用统一感知管理器或物理分层
```

## 13. JSON 示例

```json
{
  "aggroOnProximity": true,
  "aggroRadius": 12,
  "aggroVerticalRange": 4,
  "requireLineOfSight": false,
  "aggroOnDamage": true,
  "combatPersistence": "UntilDeath",
  "targetFaction": "PlayerFaction"
}
```
