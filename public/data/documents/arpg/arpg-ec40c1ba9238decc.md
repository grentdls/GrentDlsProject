# 144 HitFeedback 数据表与 JSON 示例：策划配置

## 1. 设计目标

所有伤害受击表现都应可配置。  
策划可以通过表格调整：
- 哪个技能跳字更大。
- 哪个技能有强顿帧。
- 哪个技能能击飞。
- 哪种伤害显示什么颜色和图标。
- 哪个怪物能不能被击退。
- Boss 哪个阶段触发什么反馈。

---

## 2. 数据表清单

```text
DamageTypeFeedbackTable
FloatingTextProfileTable
HitReactionProfileTable
KnockbackProfileTable
HitStopProfileTable
MaterialFlashProfileTable
HitVFXProfileTable
HitSFXProfileTable
CameraShakeProfileTable
MonsterReactionRuleTable
SkillHitFeedbackBindingTable
BossPartFeedbackTable
```

---

## 3. DamageTypeFeedbackTable

| 字段 | 类型 | 说明 |
|---|---|---|
| damageType | string | 伤害类型 |
| color | string | 跳字颜色 |
| iconId | string | 图标 |
| materialColor | string | 材质染色 |
| defaultVfxId | string | 默认特效 |
| defaultSfxId | string | 默认音效 |

示例：

```json
{
  "damageType": "Fire",
  "color": "#FF6A32",
  "iconId": "Icon_Damage_Fire",
  "materialColor": "#FF4A1E",
  "defaultVfxId": "VFX_Hit_Fire_Medium",
  "defaultSfxId": "SFX_Hit_Fire"
}
```

---

## 4. FloatingTextProfileTable

```json
{
  "id": "FloatText_Crit_Fire",
  "fontSize": 44,
  "colorMode": "DamageTypeWithCritOutline",
  "outlineColor": "#FFD75A",
  "showIcon": true,
  "iconPosition": "BeforeNumber",
  "scaleIn": 1.8,
  "floatDistance": 86,
  "duration": 0.85,
  "shakeAmplitude": 4,
  "mergeRule": "NoMerge"
}
```

---

## 5. HitReactionProfileTable

```json
{
  "id": "Reaction_Humanoid_Heavy",
  "allowInterrupt": true,
  "baseStunTime": 0.45,
  "animFront": "Hit_Heavy_Front",
  "animBack": "Hit_Heavy_Back",
  "animLeft": "Hit_Heavy_Left",
  "animRight": "Hit_Heavy_Right",
  "canCancelAttack": true,
  "requiresPoiseBreak": false
}
```

---

## 6. KnockbackProfileTable

```json
{
  "id": "Knockback_Warrior_Heavy",
  "reactionType": "Knockback",
  "baseDistance": 2.4,
  "duration": 0.34,
  "curveId": "Curve_Knockback_Heavy",
  "canWallHit": true,
  "canKnockdownOnWall": false,
  "targetWeightMultiplier": true,
  "snapToNavMeshAfterMove": true
}
```

---

## 7. HitStopProfileTable

```json
{
  "id": "HitStop_Warrior_Heavy_Crit",
  "attackerStopTime": 0.06,
  "targetStopTime": 0.12,
  "worldStopTime": 0.00,
  "cameraPauseTime": 0.02,
  "mergeWindow": 0.18,
  "maxPerCast": 2,
  "ignoreForDOT": true
}
```

---

## 8. MaterialFlashProfileTable

```json
{
  "id": "MatFlash_Fire_Heavy",
  "flashColor": "#FFFFFF",
  "flashIntensity": 0.75,
  "flashDuration": 0.10,
  "elementColor": "#FF4A1E",
  "elementBlend": 0.45,
  "elementDuration": 0.22,
  "useMaterialPropertyBlock": true
}
```

---

## 9. VFX / SFX / Camera 表

```json
{
  "vfxId": "VFX_Hit_Blunt_Heavy",
  "poolId": "Pool_VFX_Hit_Physical",
  "spawnMode": "HitPoint",
  "scaleByStrength": true,
  "lifeTime": 1.2
}
```

```json
{
  "sfxId": "SFX_Impact_Blunt_Heavy",
  "volume": 0.9,
  "pitchRandom": 0.08,
  "cooldown": 0.04
}
```

```json
{
  "shakeId": "Shake_Hit_Heavy",
  "amplitude": 0.7,
  "frequency": 18,
  "duration": 0.18,
  "distanceFalloff": true
}
```

---

## 10. SkillHitFeedbackBindingTable

技能绑定表现模板：

```json
{
  "skillId": "SK_Warrior_HeavyCleave",
  "defaultStrength": "Heavy",
  "floatingTextProfile": "FloatText_Crit_Physical",
  "hitReactionProfile": "Reaction_Humanoid_Heavy",
  "knockbackProfile": "Knockback_Warrior_Heavy",
  "hitStopProfile": "HitStop_Warrior_Heavy",
  "materialFlashProfile": "MatFlash_Physical_Heavy",
  "vfxProfile": "VFX_Hit_Slash_Heavy",
  "sfxProfile": "SFX_Impact_Slash_Heavy",
  "cameraShakeProfile": "Shake_Hit_Heavy"
}
```

---

## 11. MonsterReactionRuleTable

怪物自身决定是否接受某种反馈：

```json
{
  "monsterId": "MON_Heavy_Brute",
  "bodySize": "Large",
  "armorType": "HeavyArmor",
  "canLightHitReact": false,
  "canMediumHitReact": true,
  "canHeavyHitReact": true,
  "canKnockback": false,
  "canLaunch": false,
  "canKnockdown": true,
  "knockdownRequiresPoiseBreak": true,
  "poiseMax": 300,
  "poiseRecoverPerSecond": 25
}
```

---

## 12. BossPartFeedbackTable

```json
{
  "bossId": "BOSS_BlackForgeWarden",
  "partId": "Core",
  "isWeakPoint": true,
  "damageMultiplier": 1.35,
  "weakPointFlashProfile": "MatFlash_WeakPoint_Gold",
  "breakThreshold": 5000,
  "onBreakReaction": "Boss_Stagger_Kneel",
  "onBreakVfx": "VFX_Boss_CoreBreak",
  "onBreakRewardWindow": 5.0
}
```

---

## 13. 综合 HitFeedback 示例

```json
{
  "hitFeedbackId": "HFB_Warrior_JumpSlam_FireCrit",
  "conditions": {
    "skillTag": ["Warrior", "Melee", "Slam"],
    "damageType": "Fire",
    "isCritical": true
  },
  "floatingText": "FloatText_Crit_Fire",
  "reaction": "Reaction_Humanoid_Heavy",
  "knockback": "Knockback_Slam_Radial",
  "hitStop": "HitStop_Slam_Crit",
  "materialFlash": "MatFlash_Fire_Heavy",
  "vfx": "VFX_Hit_FireSlam_Crit",
  "sfx": "SFX_Slam_Fire_Crit",
  "cameraShake": "Shake_Slam_Crit"
}
```

---

## 14. 配置校验规则

必须校验：
- 引用 ID 是否存在。
- VFX 是否有对象池。
- SFX 是否存在音频资源。
- HitReaction 动画是否存在。
- Boss 部位 ID 是否存在。
- 不能给 DOT 配强 HitStop。
- 不能给 Boss 普通命中配置强击退。
- 浮动文字颜色必须来自合法色表。

---

## 15. 验收标准
- 策划能通过配置改变暴击跳字大小。
- 策划能通过配置让某个技能击退更远。
- 策划能关闭某个怪物的击飞。
- Boss 弱点反馈可单独配置。
- 技能代码不需要写死表现逻辑。
