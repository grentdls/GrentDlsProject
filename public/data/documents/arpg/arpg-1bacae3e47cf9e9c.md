# 195 高级词条数据表与 JSON 示例：Stack / Conversion / Charge / Cooldown

## 1. 连击层数 Stack

```json
{
  "affixId": "AFF_Combo_AttackSpeed",
  "trigger": "OnHit",
  "stack": {
    "stackId": "Combo",
    "maxStack": 10,
    "gain": 1,
    "expireTime": 3.0,
    "refreshOnGain": true
  },
  "effectPerStack": [
    {"stat": "AttackSpeed", "op": "Add", "value": 0.02}
  ]
}
```

## 2. 蓄力强化 Charge

```json
{
  "affixId": "AFF_Charge_FullCrit",
  "condition": {
    "chargeLevel": "Max"
  },
  "effect": [
    {"stat": "CriticalChance", "op": "Override", "value": 1.0},
    {"stat": "ArmorPenetrationPercent", "op": "Add", "value": 0.3}
  ]
}
```

## 3. 伤害转化 Conversion

```json
{
  "affixId": "AFF_PhysicalToFire_40",
  "conversion": {
    "fromDamageType": "Physical",
    "toDamageType": "Fire",
    "percent": 0.4,
    "keepOriginalTags": true,
    "priority": 100
  }
}
```

## 4. 溢出治疗转护盾

```json
{
  "affixId": "AFF_OverflowHealToShield",
  "trigger": "OnHeal",
  "effect": {
    "type": "OverflowConvert",
    "from": "LifeHeal",
    "to": "Shield",
    "percent": 0.5,
    "maxPerSecond": 200
  }
}
```

## 5. 冷却刷新

```json
{
  "affixId": "AFF_CritRefreshDash",
  "trigger": "OnCrit",
  "chance": 0.1,
  "cooldown": 3.0,
  "effect": {
    "type": "RefreshCooldown",
    "targetSkillTag": "Movement",
    "excludeSourceSkill": true
  }
}
```

## 6. 技能充能

```json
{
  "chargeConfigId": "Charge_Dash",
  "maxCharge": 3,
  "recoverTime": 8.0,
  "gainRules": [
    {"trigger": "OnKill", "gain": 1, "cooldown": 1.0}
  ],
  "consumePerCast": 1
}
```

## 7. Boss 限制

```json
{
  "bossLimit": {
    "trueDamagePerSecondCapPercent": 0.02,
    "controlToPoiseDamage": true,
    "maxProjectileHitsPerCast": 3,
    "disableOnKillEffects": true
  }
}
```
