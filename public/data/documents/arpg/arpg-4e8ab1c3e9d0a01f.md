# 150 技能 Timeline 事件轨道：伤害判定、特效、音效、位移、镜头

## 1. 轨道总览

```text
AnimationTrack      动画片段轨道
HitboxTrack         近战判定轨道
DamageTrack         伤害应用轨道
ProjectileTrack     投射物轨道
VFXTrack            特效轨道
SFXTrack            音效轨道
MovementTrack       位移轨道
RootMotionTrack     RootMotion 权重轨道
CameraTrack         镜头轨道
HitStopTrack        顿帧轨道
CancelWindowTrack   取消窗口轨道
StateTrack          状态轨道
BuffTrack           Buff/Debuff 轨道
InputWindowTrack    连段输入窗口轨道
```

## 2. HitboxTrack 判定轨道

```json
{
  "trackType": "Hitbox",
  "eventId": "HB_HeavySlash_Main",
  "startFrame": 16,
  "endFrame": 23,
  "hitboxId": "Hitbox_GreatSword_Arc",
  "followBone": "Weapon_R",
  "canHitSameTargetOnce": true
}
```

## 3. DamageTrack 伤害轨道

```json
{
  "trackType": "Damage",
  "frame": 18,
  "damageBlockId": "DMG_Warrior_HeavySlash",
  "targetSource": "CurrentHitboxTargets",
  "hitFeedbackProfile": "HFB_Warrior_Heavy"
}
```

## 4. ProjectileTrack 投射物轨道

```json
{
  "trackType": "Projectile",
  "frame": 12,
  "projectileId": "PROJ_Fireball_Lv1",
  "spawnSocket": "Hand_R",
  "direction": "AimDirection",
  "count": 1,
  "spreadAngle": 0
}
```

## 5. VFXTrack 特效轨道

```json
{
  "trackType": "VFX",
  "frame": 6,
  "vfxId": "VFX_Charge_Fire_Hand",
  "socket": "Hand_R",
  "attach": true,
  "duration": 0.8
}
```

## 6. SFXTrack 音效轨道

```json
{
  "trackType": "SFX",
  "frame": 10,
  "sfxId": "SFX_Sword_Swing_Heavy",
  "volume": 0.9,
  "pitchRandom": 0.05
}
```

## 7. MovementTrack 位移轨道

```json
{
  "trackType": "Movement",
  "startFrame": 8,
  "endFrame": 20,
  "moveMode": "ForwardDash",
  "distance": 2.4,
  "curveId": "Curve_Dash_Attack",
  "canBeBlockedByWall": true
}
```

## 8. CameraTrack 镜头轨道

```json
{
  "trackType": "Camera",
  "frame": 18,
  "cameraEvent": "Shake",
  "shakeId": "Shake_HeavyHit"
}
```

## 9. CancelWindowTrack 取消窗口

```json
{
  "trackType": "CancelWindow",
  "startFrame": 24,
  "endFrame": 40,
  "allowCancelTo": ["Move", "Dodge", "Skill", "Jump"],
  "priority": 20
}
```

## 10. StateTrack 状态轨道

```json
{
  "trackType": "State",
  "startFrame": 0,
  "endFrame": 22,
  "states": ["SuperArmor", "InputLocked"]
}
```

## 11. Timeline 可视化

```text
帧数:      0     5    10    15    20    25    30
Animation [-----------HeavySlash Clip-----------]
Hitbox                 [====]
Damage                    *
VFX          *        *         *
SFX             *       *
Move              [------]
Cancel                         [==========]
State       [SuperArmor------]
```

## 12. 验收标准

- 能拖动事件改变帧数。
- 能复制粘贴事件。
- 能播放预览。
- 能逐帧预览。
- 能校验事件是否超出动画长度。
