# 149 技能动画 Timeline 系统：完整动画、前摇、循环、结束、蓄力、引导

## 1. 技能动画为什么需要 Timeline

技能不能只配置一个动画 Clip，因为真实技能需要：

- 第几帧起手。
- 第几帧出伤害。
- 第几帧开关 Hitbox。
- 第几帧播特效。
- 第几帧播音效。
- 第几帧位移。
- 第几帧允许取消。
- 第几帧进入霸体。
- 是否有循环段。
- 是否有蓄力段。
- 是否有收招段。

## 2. SkillTimeline 结构

```text
SkillTimeline
├── Metadata
├── ClipSegments
│   ├── Startup
│   ├── Loop
│   ├── Release
│   └── Recovery
├── EventTracks
│   ├── DamageTrack
│   ├── HitboxTrack
│   ├── ProjectileTrack
│   ├── VFXTrack
│   ├── SFXTrack
│   ├── MovementTrack
│   ├── CameraTrack
│   ├── HitStopTrack
│   ├── CancelWindowTrack
│   └── StateTrack
└── ExitRules
```

## 3. FullClip 完整动画

```json
{
  "timelineId": "TL_Warrior_Slash_01",
  "mode": "FullClip",
  "segments": [
    {
      "segmentName": "Full",
      "clipId": "ANI_Warrior_Slash_01",
      "startFrame": 0,
      "endFrame": 42,
      "loop": false,
      "fadeIn": 0.05,
      "fadeOut": 0.10
    }
  ]
}
```

## 4. StartupLoopEnd 前摇 + 循环 + 结束

```json
{
  "timelineId": "TL_Mage_ChannelBeam",
  "mode": "StartupLoopEnd",
  "segments": [
    {"segmentName": "Startup", "clipId": "ANI_Mage_Beam_Start", "loop": false, "fadeIn": 0.05, "fadeOut": 0.04},
    {"segmentName": "Loop", "clipId": "ANI_Mage_Beam_Loop", "loop": true, "fadeIn": 0.04, "fadeOut": 0.04},
    {"segmentName": "End", "clipId": "ANI_Mage_Beam_End", "loop": false, "fadeIn": 0.04, "fadeOut": 0.08}
  ],
  "loopExitCondition": "InputReleasedOrManaEmpty"
}
```

## 5. ChargeRelease 蓄力 + 释放

```json
{
  "timelineId": "TL_Ranger_ChargeShot",
  "mode": "ChargeRelease",
  "minChargeTime": 0.3,
  "maxChargeTime": 2.0,
  "chargeLevels": [
    {"time": 0.3, "level": 1, "damageMultiplier": 1.0},
    {"time": 1.0, "level": 2, "damageMultiplier": 1.5},
    {"time": 2.0, "level": 3, "damageMultiplier": 2.2}
  ]
}
```

## 6. ComboChain 连段

```json
{
  "timelineId": "TL_Monk_Combo_01",
  "mode": "ComboChain",
  "comboInputWindow": [
    {"fromFrame": 18, "toFrame": 30, "nextTimeline": "TL_Monk_Combo_02"}
  ]
}
```

## 7. Segment 字段

```json
{
  "segmentName": "Startup",
  "clipId": "ANI_Warrior_HeavySlash_Start",
  "startFrame": 0,
  "endFrame": 20,
  "loop": false,
  "speed": 1.0,
  "fadeIn": 0.04,
  "fadeOut": 0.04,
  "rootMotion": true,
  "canBeInterrupted": false,
  "minPlayFrame": 10,
  "layer": "FullBody"
}
```

## 8. 退出规则

```json
{
  "exitRules": {
    "canExitToMove": true,
    "moveExitFrame": 28,
    "canExitToDodge": true,
    "dodgeExitFrame": 20,
    "canExitToHitReaction": true,
    "canExitToDeath": true,
    "forcePlayEndSegment": true
  }
}
```

## 9. 验收标准

- 技能能配置完整动画。
- 技能能配置前摇 + 循环 + 结束。
- 技能能配置蓄力释放。
- 技能能配置连段输入窗口。
- 策划不改代码即可调整触发帧。
