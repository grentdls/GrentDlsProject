# 职业设计：神谕祭司

> 参考边界：本项目参考暗黑刷宝 ARPG 的系统结构：职业起点、主动技能、辅助模块、保留技能、触发技能、巨型被动树、职业专精树、装备词条联动、Boss 机制与终局构筑。
> 不直接复制任何商业游戏的职业名、技能名、图标、数值、UI截图、专有词条与怪物设定。下面所有职业、技能、天赋节点、数值区间、特效表现均为项目原创，用于 Unity 原型和后续美术/程序落地。

## 1. 职业基础

```text
职业名：神谕祭司
职业ID：CLASS_ORACLE_PRIEST
参考方向：智慧+力量，预言、护盾、光暗双系、图腾/法阵
主属性：智慧+力量，敏捷低
推荐武器：权杖、法器、圣铃、符牌
核心定位：辅助与输出兼具，通过预言牌、法阵、护盾和暗光转换进行构筑。
职业资源：预兆：释放保留/法阵/祝福获得，满足条件自动消耗触发预言。
职业手感：偏策略，适合喜欢复杂构筑的玩家。
```

## 2. 战斗定位

神谕祭司 的设计目标不是简单复制某个原版职业，而是把同类 ARPG 的职业定位转成 3D ACT 可操作角色。

### 2.1 适合玩家

- 喜欢明确战斗节奏的玩家。
- 喜欢通过装备、技能和天赋组合出不同 BD 的玩家。
- 可以接受技能不是固定职业技能，而是“职业推荐 + 全局可学习”的玩家。

### 2.2 职业优势

```text
清图能力：中
Boss能力：中高，取决于 BD
生存能力：与装备和天赋强相关
操作难度：由技能组合决定
装备依赖：中高
```

### 2.3 职业短板

- 跨属性构筑成本较高。
- 如果只堆伤害，防御会明显不足。
- 技能需要和武器标签匹配，否则不能释放或表现不完整。

## 3. 初始属性成长

| 等级区间 | 生命成长 | 魔力成长 | 护盾成长 | 主属性成长 | 副属性成长 |
|---|---:|---:|---:|---:|---:|
| 1-10 | 12/级 | 5/级 | 2/级 | 4/级 | 2/级 |
| 11-30 | 18/级 | 8/级 | 4/级 | 5/级 | 3/级 |
| 31-60 | 26/级 | 12/级 | 7/级 | 6/级 | 3/级 |
| 61-100 | 36/级 | 18/级 | 11/级 | 8/级 | 4/级 |

> 这些是项目原创原型数值，用来跑 Unity 白盒战斗。正式版需要通过模拟器批量压测。

## 4. 职业资源 UI

```text
UI_ClassResource_CLASS_ORACLE_PRIEST.prefab
├── Root
│   ├── BackgroundFrame
│   ├── ResourceFill
│   ├── SegmentMarkers
│   ├── GlowWhenFull
│   ├── DecayWarningFx
│   └── TooltipTrigger
```

显示规则：

- 战斗中常驻显示。
- 脱战 3 秒后降低透明度。
- 资源满时播放一次弱提示，不要遮挡战斗。
- 手柄模式下，资源提示要靠近技能栏，不要放到屏幕边缘。

## 5. 推荐技能清单

| 编号 | 技能 | 标签 | 核心逻辑 |
|---|---|---|---|
| 01 | 星火符牌 | 法术/投射 | 投出符牌，命中后附着并延迟爆发。 |
| 02 | 预言护盾 | 防御/触发 | 获得护盾；护盾破裂时自动释放一次小法术。 |
| 03 | 昼夜轮转 | 姿态/保留 | 在光/暗姿态间切换：光提高护盾，暗提高持续伤害。 |
| 04 | 圣铃震荡 | 图腾/范围 | 放置圣铃，周期性震荡伤害并暴露敌人。 |
| 05 | 命运束缚 | 控制/诅咒 | 束缚目标，目标受到伤害的一部分延迟结算。 |
| 06 | 星轨法阵 | 区域/增益 | 画出法阵，站在其中施法速度提高。 |
| 07 | 暗月灼蚀 | 持续/暗 | 对目标施加暗蚀，护盾越高持续伤害越高。 |
| 08 | 晨曦爆印 | 光/爆发 | 引爆目标身上的光印，治疗自身。 |
| 09 | 神谕重置 | 功能/冷却 | 消耗所有预兆，减少最近使用技能的冷却。 |
| 10 | 终末预言 | 大招/触发 | 标记区域，短延迟后按敌人当前负面状态数量造成多段伤害。 |

## 6. 技能详细逻辑与表现

### 1.星火符牌

```text
技能标签：法术/投射
核心逻辑：投出符牌，命中后附着并延迟爆发。
判定方式：投射+延迟。
表现方向：金紫符牌。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 2.预言护盾

```text
技能标签：防御/触发
核心逻辑：获得护盾；护盾破裂时自动释放一次小法术。
判定方式：护盾事件。
表现方向：符文护盾。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 3.昼夜轮转

```text
技能标签：姿态/保留
核心逻辑：在光/暗姿态间切换：光提高护盾，暗提高持续伤害。
判定方式：姿态切换。
表现方向：角色光暗半环。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 4.圣铃震荡

```text
技能标签：图腾/范围
核心逻辑：放置圣铃，周期性震荡伤害并暴露敌人。
判定方式：固定物件 AOE。
表现方向：铃波扩散。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 5.命运束缚

```text
技能标签：控制/诅咒
核心逻辑：束缚目标，目标受到伤害的一部分延迟结算。
判定方式：单体 Debuff。
表现方向：细金线缠绕。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 6.星轨法阵

```text
技能标签：区域/增益
核心逻辑：画出法阵，站在其中施法速度提高。
判定方式：地面区域。
表现方向：星图圆阵。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 7.暗月灼蚀

```text
技能标签：持续/暗
核心逻辑：对目标施加暗蚀，护盾越高持续伤害越高。
判定方式：单体 DoT。
表现方向：紫黑月痕。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 8.晨曦爆印

```text
技能标签：光/爆发
核心逻辑：引爆目标身上的光印，治疗自身。
判定方式：标记引爆。
表现方向：金色爆印。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 9.神谕重置

```text
技能标签：功能/冷却
核心逻辑：消耗所有预兆，减少最近使用技能的冷却。
判定方式：技能记录系统。
表现方向：时钟符文倒转。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 10.终末预言

```text
技能标签：大招/触发
核心逻辑：标记区域，短延迟后按敌人当前负面状态数量造成多段伤害。
判定方式：大范围延迟。
表现方向：星空裂隙。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

## 7. 专精分支设计

### 1. 星图占卜师：预兆、触发、冷却操控

- 解锁条件：完成第一章专精试炼。
- 核心节点 1：改变职业资源的获得方式。
- 核心节点 2：改变主要技能的表现或机制。
- 核心节点 3：提供独特防御或爆发。
- 终极节点：让该分支形成完整 BD 闭环。

### 2. 昼夜司祭：光暗转换、护盾与持续伤害

- 解锁条件：完成第一章专精试炼。
- 核心节点 1：改变职业资源的获得方式。
- 核心节点 2：改变主要技能的表现或机制。
- 核心节点 3：提供独特防御或爆发。
- 终极节点：让该分支形成完整 BD 闭环。

### 3. 圣铃布道者：图腾、范围祝福、团队增益

- 解锁条件：完成第一章专精试炼。
- 核心节点 1：改变职业资源的获得方式。
- 核心节点 2：改变主要技能的表现或机制。
- 核心节点 3：提供独特防御或爆发。
- 终极节点：让该分支形成完整 BD 闭环。


## 8. 职业天赋节点方向

- 预兆获得、护盾强度、触发法术伤害、法阵效果、图腾持续时间
- 光暗姿态加成、冷却恢复、延迟伤害结算、祝福范围
- 护盾破裂触发、预兆上限、持续伤害转护盾回复

### 8.1 小节点

```text
+5 主属性
+4% 对应武器伤害
+3% 对应防御属性
+2% 技能释放速度/攻击速度
+5% 职业资源获得
```

### 8.2 中节点

```text
对应技能标签伤害提高 12%
对应异常状态积累提高 15%
对应防御机制提高 10%
职业资源上限 +1 段
核心技能冷却恢复 +8%
```

### 8.3 大节点

大节点必须改变玩法，不只是加数值。例如：

```text
某类技能变成可移动释放
某类技能消耗职业资源获得新效果
某类防御成功后触发反击
某类异常状态达到满层后爆炸
某类召唤物继承玩家某个词条
```

## 9. 装备词条偏好

```text
主属性提高
对应武器伤害提高
对应技能标签等级 +1
职业资源获得速度提高
核心技能冷却恢复
异常状态积累提高
护甲/闪避/护盾按职业定位选择
抗性补足
移动速度
```

## 10. Unity 角色 Prefab 结构

```text
PF_Character_CLASS_ORACLE_PRIEST.prefab
├── ModelRoot
│   ├── BodyMesh
│   ├── WeaponSocket_R
│   ├── WeaponSocket_L
│   ├── BackSocket
│   └── VFXSocketGroup
├── Animator
├── CharacterController / RigidbodyController
├── CombatController
│   ├── SkillCaster
│   ├── HitboxEmitter
│   ├── DamageReceiver
│   ├── ClassResourceController
│   └── StatusEffectController
├── MovementController
│   ├── LockOnController
│   ├── DodgeController
│   └── RootMotionBridge
├── AudioSourceGroup
├── VFXPoolHandle
└── UIAnchor
    ├── NameplatePoint
    ├── DamageNumberPoint
    └── ClassResourcePoint
```

## 11. Animator 参数

```text
MoveSpeed
MoveX
MoveY
IsLockedOn
IsCasting
IsAttacking
IsDodging
IsHitStunned
WeaponType
SkillIndex
ComboIndex
ClassResourceLevel
IsDead
```

## 12. 第一阶段开发技能

第一阶段只做 4 个技能，避免动画和 VFX 失控：

```text
主输出技能：星火符牌
范围清图技能：预言护盾
位移/防御技能：昼夜轮转
职业资源技能：圣铃震荡
```

验收标准：

- 能装到技能栏。
- 能被辅助模块改变至少 2 个参数。
- 有 Hitbox、伤害、状态、VFX、SFX。
- 能在职业 UI 上显示资源变化。
- 至少有 1 个天赋节点能改变该技能逻辑。
