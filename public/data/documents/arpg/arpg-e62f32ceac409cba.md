# 职业设计：荒怒蛮王

> 参考边界：本项目参考暗黑刷宝 ARPG 的系统结构：职业起点、主动技能、辅助模块、保留技能、触发技能、巨型被动树、职业专精树、装备词条联动、Boss 机制与终局构筑。
> 不直接复制任何商业游戏的职业名、技能名、图标、数值、UI截图、专有词条与怪物设定。下面所有职业、技能、天赋节点、数值区间、特效表现均为项目原创，用于 Unity 原型和后续美术/程序落地。

## 1. 职业基础

```text
职业名：荒怒蛮王
职业ID：CLASS_MARAUDER_RAGE
参考方向：力量近战、狂怒、流血、自伤换爆发、战吼
主属性：力量主属性，敏捷影响跳跃/追击，智慧很低
推荐武器：双斧、双手斧、双手锤、徒手重拳
核心定位：高风险高回报，生命越低越凶，持续流血与狂暴连击。
职业资源：血怒：攻击和受到伤害获得，脱战快速衰减；高血怒提高攻速但降低防御。
职业手感：动作野蛮、前冲、跳劈、撕裂，适合偏爽快 ACT。
```

## 2. 战斗定位

荒怒蛮王 的设计目标不是简单复制某个原版职业，而是把同类 ARPG 的职业定位转成 3D ACT 可操作角色。

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
UI_ClassResource_CLASS_MARAUDER_RAGE.prefab
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
| 01 | 血斧连劈 | 近战/连段 | 连续三段斧击，第三段必定施加流血。 |
| 02 | 荒怒跳斩 | 位移/重击 | 跳向目标区域，落地造成范围伤害；血怒越高范围越大。 |
| 03 | 撕伤旋风 | 引导/近战 | 旋转前进，持续切割敌人；可移动但转向较慢。 |
| 04 | 裂肉投斧 | 投射/流血 | 投出斧头，命中后回旋返回，可二次命中。 |
| 05 | 怒吼·嗜战 | 战吼/增益 | 消耗血怒，短时间提高攻击速度和吸血。 |
| 06 | 血债护体 | 防御/自伤 | 牺牲当前生命获得减伤护盾，护盾破裂时造成血爆。 |
| 07 | 断首斩 | 终结/近战 | 对流血目标造成高伤；若击杀则刷新位移技能冷却。 |
| 08 | 蛮力投掷 | 控制 | 抓取小型敌人扔向目标点，撞击产生范围伤害。 |
| 09 | 先祖怒影 | 召唤/短时 | 召唤先祖幻影复制下一次近战技能。 |
| 10 | 荒神暴走 | 大招/姿态 | 进入暴走姿态，不能格挡，但移动、攻速、吸血大幅提升。 |

## 6. 技能详细逻辑与表现

### 1.血斧连劈

```text
技能标签：近战/连段
核心逻辑：连续三段斧击，第三段必定施加流血。
判定方式：武器轨迹盒。
表现方向：红色斧光、血雾。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 2.荒怒跳斩

```text
技能标签：位移/重击
核心逻辑：跳向目标区域，落地造成范围伤害；血怒越高范围越大。
判定方式：落点圆形。
表现方向：砂尘爆开、红色冲击圈。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 3.撕伤旋风

```text
技能标签：引导/近战
核心逻辑：旋转前进，持续切割敌人；可移动但转向较慢。
判定方式：角色周围圆环。
表现方向：旋风尘圈、斧影。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 4.裂肉投斧

```text
技能标签：投射/流血
核心逻辑：投出斧头，命中后回旋返回，可二次命中。
判定方式：前向投射物。
表现方向：飞斧拖尾、命中血线。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 5.怒吼·嗜战

```text
技能标签：战吼/增益
核心逻辑：消耗血怒，短时间提高攻击速度和吸血。
判定方式：自身 Buff。
表现方向：红色声波。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 6.血债护体

```text
技能标签：防御/自伤
核心逻辑：牺牲当前生命获得减伤护盾，护盾破裂时造成血爆。
判定方式：自身 Buff+周围爆炸。
表现方向：血色护膜。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 7.断首斩

```text
技能标签：终结/近战
核心逻辑：对流血目标造成高伤；若击杀则刷新位移技能冷却。
判定方式：短扇形。
表现方向：斩首线、慢动作顿帧。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 8.蛮力投掷

```text
技能标签：控制
核心逻辑：抓取小型敌人扔向目标点，撞击产生范围伤害。
判定方式：近身抓取+抛物线。
表现方向：敌人拖尾、撞击碎石。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 9.先祖怒影

```text
技能标签：召唤/短时
核心逻辑：召唤先祖幻影复制下一次近战技能。
判定方式：技能复制器。
表现方向：半透明红色巨影。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

### 10.荒神暴走

```text
技能标签：大招/姿态
核心逻辑：进入暴走姿态，不能格挡，但移动、攻速、吸血大幅提升。
判定方式：姿态 Buff。
表现方向：角色红光、镜头微震。
输入建议：短按释放；需要瞄准的技能支持右摇杆/鼠标方向；可被辅助模块改变范围、投射数量、冷却、伤害类型。
数据字段：SkillId / Tags / WeaponTags / CastType / Cost / Cooldown / HitboxProfile / VFXKey / SFXKey / CameraShakeProfile
```

## 7. 专精分支设计

### 1. 血怒狂徒：低血量爆发、吸血、免疫恐惧

- 解锁条件：完成第一章专精试炼。
- 核心节点 1：改变职业资源的获得方式。
- 核心节点 2：改变主要技能的表现或机制。
- 核心节点 3：提供独特防御或爆发。
- 终极节点：让该分支形成完整 BD 闭环。

### 2. 裂骨屠夫：流血、撕裂、断肢、范围斩杀

- 解锁条件：完成第一章专精试炼。
- 核心节点 1：改变职业资源的获得方式。
- 核心节点 2：改变主要技能的表现或机制。
- 核心节点 3：提供独特防御或爆发。
- 终极节点：让该分支形成完整 BD 闭环。

### 3. 荒原战吼者：战吼叠层、召唤先祖幻影、群体压制

- 解锁条件：完成第一章专精试炼。
- 核心节点 1：改变职业资源的获得方式。
- 核心节点 2：改变主要技能的表现或机制。
- 核心节点 3：提供独特防御或爆发。
- 终极节点：让该分支形成完整 BD 闭环。


## 8. 职业天赋节点方向

- 血怒上限、低生命增伤、流血持续时间、流血目标吸血、战吼获得血怒
- 自伤转护盾、击杀刷新跳斩、暴走期间免疫减速
- 双持攻速、重伤目标处决、流血爆炸范围

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
PF_Character_CLASS_MARAUDER_RAGE.prefab
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
主输出技能：血斧连劈
范围清图技能：荒怒跳斩
位移/防御技能：撕伤旋风
职业资源技能：裂肉投斧
```

验收标准：

- 能装到技能栏。
- 能被辅助模块改变至少 2 个参数。
- 有 Hitbox、伤害、状态、VFX、SFX。
- 能在职业 UI 上显示资源变化。
- 至少有 1 个天赋节点能改变该技能逻辑。
