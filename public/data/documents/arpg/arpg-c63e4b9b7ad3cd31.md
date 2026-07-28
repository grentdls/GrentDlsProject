# 技能系统总设计：主动、辅助、保留、触发、变体

> 参考边界：本项目参考暗黑刷宝 ARPG 的系统结构：职业起点、主动技能、辅助模块、保留技能、触发技能、巨型被动树、职业专精树、装备词条联动、Boss 机制与终局构筑。
> 不直接复制任何商业游戏的职业名、技能名、图标、数值、UI截图、专有词条与怪物设定。下面所有职业、技能、天赋节点、数值区间、特效表现均为项目原创，用于 Unity 原型和后续美术/程序落地。

## 1. 技能系统目标

技能不是职业固定技能，而是可被装备、天赋、辅助模块和武器标签共同改造的构筑核心。

```text
SkillCore + SupportModule + WeaponTag + PassiveNode + ItemAffix + RuntimeContext
```

## 2. 技能类型

| 类型 | 说明 | 例子 |
|---|---|---|
| 主动技能 | 玩家按键释放 | 重击、火球、箭雨 |
| 保留技能 | 开启后占用精神资源 | 护体、光环、姿态 |
| 触发技能 | 满足条件自动释放 | 格挡反击、暴击施法 |
| 变体技能 | 由天赋/辅助改变表现 | 火球变火雨、重击变震波 |
| 召唤技能 | 生成仆从/炮塔/图腾 | 骨卫、炮塔、圣铃 |
| 位移技能 | 闪避、突进、翻越 | 翻滚、雷步、跳斩 |

## 3. 技能槽规则

```text
每个角色默认 9 个主动技能槽
每个主动技能最多 5 个辅助模块槽
第一版开放 4 个主动技能槽 + 2 个辅助槽
保留技能占用精神资源，不占普通技能栏
触发技能需要触发器和被触发技能绑定
同一个辅助模块全角色只能装备 1 次，避免无脑重复
```

## 4. 技能标签

```text
Attack, Spell, Melee, Projectile, AoE, Duration, Fire, Cold, Lightning,
Chaos, Physical, Minion, Curse, Mark, Trap, Turret, Totem, Aura,
Reserve, Trigger, Movement, Guard, Transform, Channelling, Slam, Strike
```

标签用于：

- 决定辅助模块能否连接。
- 决定天赋节点是否生效。
- 决定装备词条是否加成。
- 决定怪物抗性和状态交互。

## 5. 技能释放流程

```text
Input Pressed
→ SkillBar 查询当前技能
→ SkillRequirementChecker 检查武器/资源/冷却/状态
→ TargetResolver 解析目标/方向/地面点
→ SkillCastController 播放前摇
→ Animation Event 触发 Hitbox/VFX/Projectile
→ DamagePipeline 计算命中/伤害/异常
→ SupportModulePipeline 修改结果
→ PassiveModifierPipeline 修改结果
→ Cooldown/Cost/Resource 结算
→ UI 和音效反馈
```

## 6. 技能数据结构

```text
SkillCoreData
  SkillId
  Name
  Icon
  Tags[]
  RequiredWeaponTags[]
  SkillType
  CastType
  BaseCost
  CostType
  Cooldown
  CastTime
  AnimationKey
  HitboxProfileId
  ProjectileProfileId
  AreaProfileId
  DamageProfileId
  StatusProfileIds[]
  VFXKey
  SFXKey
  CameraShakeKey
  CanMoveWhileCasting
  CanRotateWhileCasting
  SupportSocketLimit
  UnlockLevel
  RecommendedClassIds[]
```

## 7. 辅助模块应用顺序

```text
1. 技能基础数据
2. 武器和装备基础属性
3. 辅助模块改变技能形态
4. 辅助模块改变伤害/范围/数量
5. 天赋改变机制
6. 状态 Buff/Debuff
7. 地图词缀修正
8. 最终伤害和异常结算
```

## 8. 技能表现拆分

每个技能必须拆成：

```text
Animation：角色动作
Hitbox：实际命中判定
Projectile：投射物逻辑
VFX：美术特效
SFX：音效
Camera：镜头震动/拉近/慢动作
UI：图标/冷却/资源提示
```

不要把伤害判定写死在 VFX 中，也不要让动画长度直接决定技能冷却。

## 9. 技能变体示例

| 原技能 | 辅助/天赋变化 | 新表现 |
|---|---|---|
| 火球 | 多重投射 | 一次发射 3 个小火球，单体伤害降低 |
| 火球 | 地面燃烧 | 命中后留下火区 |
| 重击 | 震波辅助 | 命中地面后向前释放冲击波 |
| 箭雨 | 毒化辅助 | 箭雨变成毒雨，持续时间增加 |
| 骨卫 | 献祭辅助 | 召唤物死亡时爆炸 |
| 炮塔 | 冰霜辅助 | 炮塔射击造成冰缓 |

## 10. 第一版技能数量

```text
12 职业 × 10 个推荐技能 = 120 个技能设计
第一阶段实装 4 职业 × 4 个技能 = 16 个可玩技能
第二阶段扩展到 60 个
第三阶段扩展到 120 个
```
