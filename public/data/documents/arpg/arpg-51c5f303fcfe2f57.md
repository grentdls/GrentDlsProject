# 176 召唤物与控制词条玩法库：额外召唤、增强、束缚、冻结、眩晕

## 1. 召唤物核心参数

```text
minionCount
minionMaxCount
minionDamage
minionLife
minionAttackSpeed
minionMoveSpeed
minionCritChance
minionCritDamage
minionDuration
minionResist
minionInheritPlayerStats
```

## 2. 额外召唤

```text
召唤物技能有 25% 概率额外召唤 1 个单位。
击杀敌人时有 20% 概率召唤骷髅。
召唤物击杀敌人时有 10% 概率复制自身。
```

配置：

```json
{
  "trigger": "OnSummon",
  "chance": 0.25,
  "effect": "ExtraSummon",
  "extraCount": 1,
  "maxExtraPerCast": 2
}
```

## 3. 召唤物增强

```text
召唤物伤害 +30%
召唤物生命 +40%
召唤物攻击速度 +15%
召唤物暴击率 +5%
召唤物继承你 30% 的元素抗性
```

配置：

```json
{
  "stat": "MinionDamage",
  "operation": "More",
  "value": 0.3
}
```

## 4. 召唤物触发

```text
召唤物击中时有概率施加中毒。
召唤物暴击时释放小范围冲击。
召唤物死亡时爆炸。
召唤物击杀时恢复你的生命。
```

```json
{
  "trigger": "OnMinionKill",
  "effect": "RecoverOwner",
  "recoverType": "Life",
  "valueType": "MaxPercent",
  "value": 0.02
}
```

## 5. 召唤物死亡爆炸

```text
召唤物死亡时爆炸，造成其最大生命 20% 的火焰伤害。
```

```json
{
  "trigger": "OnMinionDeath",
  "effect": "Explosion",
  "damageByMinionMaxLifePercent": 0.2,
  "damageType": "Fire",
  "radius": 2.8
}
```

## 6. 控制类状态

```text
Slow 减速
Chill 冰缓
Freeze 冻结
Stun 眩晕
Knockdown 击倒
Bound 束缚
Fear 恐惧
Taunt 嘲讽
Silence 沉默
Root 定身
```

## 7. 控制增强词条

```text
控制持续时间 +20%
对被控制敌人造成更多伤害
施加控制时恢复资源
控制结束时造成爆炸
冻结敌人时召唤冰灵
束缚敌人时投射物必定命中
```

配置：

```json
{
  "trigger": "OnControlApplied",
  "conditions": {
    "controlType": "Freeze"
  },
  "effect": "MoreDamageTaken",
  "value": 0.15,
  "duration": 3.0
}
```

## 8. Boss 控制规则

Boss 不吃完整控制，但吃控制换算：

```text
冻结 → 冰缓 / 韧性伤害
眩晕 → 韧性削减
束缚 → 减速
恐惧 → 无效或短打断
```

Boss 控制词条可转化为：
- 韧性伤害
- 弱点积累
- 输出窗口延长
- 技能打断概率
