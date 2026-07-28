# 173 词条触发系统总设计：击杀、击中、受击、投射物、AOE、召唤、控制

## 1. 词条分类

```text
属性词条
触发词条
转换词条
增强词条
限制词条
传奇机制词条
```

## 2. 触发事件总表

```text
OnHit                 击中
OnKill                击杀
OnCrit                暴击
OnTakeHit             受击
OnBlock               格挡
OnDodge               闪避
OnShieldBreak         破盾
OnPoiseBreak          破韧
OnProjectileHit       投射物命中
OnProjectileSplit     投射物分裂
OnAreaHit             AOE 命中
OnSummon              召唤时
OnMinionHit           召唤物击中
OnMinionKill          召唤物击杀
OnControlApplied      施加控制
OnControlEnd          控制结束
OnStatusApplied       施加异常
OnDeath               自身死亡
```

## 3. 触发条件结构

```json
{
  "trigger": "OnKill",
  "conditions": {
    "damageType": "Fire",
    "skillTag": ["AOE"],
    "targetStatus": ["Burning"],
    "chance": 0.25,
    "cooldown": 0.5
  },
  "effects": [
    {
      "effectType": "CreateExplosion",
      "damageType": "Fire",
      "damageRatio": 0.35,
      "radius": 3.5
    }
  ]
}
```

## 4. 每条触发词条必须有约束

```text
触发概率
冷却时间
目标上限
是否可由召唤物触发
是否可由 DOT 触发
是否可连锁触发
是否可触发自身
是否对 Boss 生效
```

## 5. 防无限循环规则

```text
TriggeredEffect 默认不能再次触发同类 OnKill
ReflectDamage 默认不能触发 ReflectDamage
Explosion 默认不能触发 Explosion
MinionKill 是否算玩家击杀必须配置
DOT 是否触发 OnHit 必须配置
```

字段：

```json
{
  "canTriggerOtherAffixes": false,
  "canBeTriggeredByTriggeredDamage": false,
  "maxChainTriggerDepth": 1
}
```

## 6. 触发结算顺序

命中方：

```text
命中发生
→ 判断是否命中/格挡/闪避
→ 伤害计算
→ 状态施加
→ OnHit
→ OnCrit
→ OnShieldBreak
→ OnPoiseBreak
→ OnKill
→ 后处理特效/掉落
```

受击方：

```text
受到伤害
→ OnTakeHit
→ OnBlock / OnDodge
→ OnShieldDamage
→ OnShieldBreak
→ OnLifeDamage
→ OnDeath
```

## 7. UI 文案规则

错误：

```text
击杀时有概率触发效果
```

正确：

```text
击杀燃烧敌人时，有 25% 概率引发一次火焰爆炸，造成其最大生命 8% 的火焰伤害，冷却 0.5 秒。
```

必须显示：
- 触发事件
- 条件
- 概率
- 冷却
- 效果
- 是否可由召唤物触发
- 是否对 Boss 生效
