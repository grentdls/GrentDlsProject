# 角色配置工具完整方案

> 工具定位：2D 横版动作 RPG / DNF 式清版战斗角色配置工具  
> 适用对象：玩家角色、敌人、小怪、精英怪、Boss、NPC 可战斗单位  
> 核心目标：不用每次写代码，通过配置完成角色基础参数、序列帧动画、普攻、技能、伤害帧、伤害框、受击框、音效、特效、状态切换和战斗数据。

---

# 1. 工具目标

## 1.1 要解决的问题

角色资源越来越多后，如果每个角色都靠代码写死，会出现这些问题：

```text
每个角色的属性散落在不同脚本里
动画、伤害帧、技能逻辑不好统一管理
普攻、技能、绝技的命中框难以精细调整
策划和美术不能直接配置，只能等程序改
角色越多，维护成本越高
敌人 AI、掉落、受击反馈难以复用
```

所以需要一个统一的 **角色配置工具**，让角色从资源到战斗表现全部数据化。

---

## 1.2 工具核心能力

工具必须能配置：

```text
角色基础信息
角色基础属性
移动 / 跳跃 / 冲刺参数
序列帧动画
动画帧率 / 循环 / 镜像
待机 / 移动 / 跳跃 / 受击 / 死亡动画
普攻三连击
技能 / 绝技
伤害帧
伤害框 HitBox
受击框 HurtBox
身体阻挡框 BodyBox
攻击伤害参数
击退 / 浮空 / 硬直参数
霸体 / 无敌帧
动作取消窗口
输入缓存
音效触发帧
特效触发帧
投射物
敌人 AI
掉落数据
UI 显示规则
预览测试
配置校验
```

---

# 2. 工具形态

## 2.1 推荐实现方式

推荐做成 Unity Editor 工具：

```text
Tools / Game / Character Config Tool
```

也可以在选中角色配置资产时打开专属 Inspector。

---

## 2.2 数据资产形式

推荐核心数据使用 ScriptableObject：

```text
CharacterConfig.asset
ActionConfig.asset
SkillConfig.asset
AnimationClipConfig.asset
```

理由：

```text
Unity 内可视化编辑
能直接引用 Sprite、Prefab、AudioClip、VFX Prefab
运行时读取方便
适合策划直接改
```

同时支持导出 JSON，方便版本管理和外部表格工具对接。

---

## 2.3 推荐目录结构

```text
Assets/
  Game/
    Characters/
      Runtime/
        CharacterRuntime.cs
        CharacterStats.cs
        CharacterMovement.cs
        CharacterJump.cs
        CharacterDash.cs
        CharacterActionRunner.cs
        CharacterSkillController.cs
        CharacterHitBoxController.cs
        CharacterHurtBoxController.cs
        CharacterStateMachine.cs
        CharacterAIController.cs
        CharacterAnimationController.cs
        CharacterSFXController.cs
        CharacterVFXController.cs

      Data/
        CharacterConfig.cs
        BaseStatsConfig.cs
        MovementConfig.cs
        JumpConfig.cs
        DashConfig.cs
        AnimationClipConfig.cs
        ActionConfig.cs
        ComboConfig.cs
        SkillConfig.cs
        DamageEventConfig.cs
        HitBoxConfig.cs
        HurtBoxConfig.cs
        BodyBoxConfig.cs
        FrameEventConfig.cs
        ProjectileConfig.cs
        EnemyAIConfig.cs
        DropTableConfig.cs

      Editor/
        CharacterConfigWindow.cs
        CharacterConfigInspector.cs
        CharacterListPanel.cs
        CharacterPreviewPanel.cs
        AnimationTimelinePanel.cs
        HitBoxEditorPanel.cs
        HurtBoxEditorPanel.cs
        ActionEditorPanel.cs
        SkillEditorPanel.cs
        ConfigValidator.cs
        JsonExporter.cs

Assets/GameData/Characters/
  DogHero/
    DogHero_CharacterConfig.asset
    Actions/
    Skills/
    Animations/
    Sprites/
    VFX/
    SFX/

  Enemy_MouseWeak/
    Enemy_MouseWeak_CharacterConfig.asset
    Actions/
    Skills/
    Animations/
    Sprites/
    VFX/
    SFX/
```

---

# 3. 工具主界面布局

## 3.1 总体布局

```text
┌────────────────────────────────────────────────────┐
│ Character Config Tool                              │
├──────────────┬───────────────────────┬─────────────┤
│ 角色/动作列表 │ 角色动画预览区          │ 参数编辑区    │
│              │                       │             │
│ DogHero      │ 当前帧画面              │ 动作参数      │
│ - Idle       │ HitBox / HurtBox显示    │ 伤害参数      │
│ - Move       │ BodyBox显示             │ 冷却/消耗     │
│ - Attack01   │ 位移轨迹显示            │ 取消窗口      │
│ - Skill01    │                       │             │
├──────────────┴───────────────────────┴─────────────┤
│ 时间轴：帧 01 02 03 04 05 06 07 08                  │
│ 事件轨：HitBox / HurtBox / SFX / VFX / Cancel / Move │
└────────────────────────────────────────────────────┘
```

---

## 3.2 页面分页

工具分为 9 个页面：

```text
1. 角色基础信息
2. 基础属性
3. 移动 / 跳跃 / 冲刺
4. 动画序列帧
5. 动作配置
6. HitBox / HurtBox 编辑
7. 普攻 / 技能 / 绝技
8. AI / 掉落 / UI
9. 预览测试 / 校验导出
```

---

# 4. CharacterConfig 数据结构

## 4.1 总字段

```text
CharacterID
DisplayName
CharacterType
Faction
Description
Icon
Portrait
Prefab
DefaultFacing
CanFlipX
BaseStats
MovementConfig
JumpConfig
DashConfig
BodyBoxConfig
AnimationList
ActionList
ComboList
SkillList
HurtBoxDefault
HitReactionConfig
AIConfig
DropTable
UIConfig
SFXSet
VFXSet
```

---

## 4.2 角色类型

```text
Player          玩家
Enemy_Normal    普通敌人
Enemy_Elite     精英敌人
Boss            Boss
NPC             NPC
Summon          召唤物
Pet             宠物
Trap            陷阱单位
```

---

## 4.3 阵营类型

```text
PlayerSide
EnemySide
Neutral
FriendlyNPC
Summon_Player
Summon_Enemy
```

阵营用于判断：

```text
能否造成伤害
能否治疗
是否触发仇恨
技能是否能锁定
投射物是否碰撞
```

---

# 5. 角色基础信息配置

## 5.1 字段表

| 字段 | 类型 | 说明 |
|---|---|---|
| CharacterID | string | 唯一 ID |
| DisplayName | string | 显示名称 |
| CharacterType | enum | 玩家 / 敌人 / Boss |
| Faction | enum | 阵营 |
| Description | text | 角色描述 |
| Icon | Sprite | UI 小头像 |
| Portrait | Sprite | 角色立绘 |
| Prefab | GameObject | 游戏内角色 Prefab |
| DefaultFacing | enum | 默认朝向 |
| CanFlipX | bool | 是否允许 X 镜像 |
| Scale | float | 角色缩放 |
| SortingOffset | int | 渲染层级偏移 |

---

## 5.2 示例

```text
CharacterID: Enemy_MouseWeak
DisplayName: 老鼠小弟
CharacterType: Enemy_Normal
Faction: EnemySide
DefaultFacing: Right
CanFlipX: true
Scale: 1.0
```

---

# 6. 基础属性配置

## 6.1 通用战斗属性

| 属性 | 说明 |
|---|---|
| MaxHP | 最大生命 |
| MaxMP | 最大法力 |
| Attack | 物理攻击 |
| MagicAttack | 法术攻击 |
| Defense | 物理防御 |
| MagicDefense | 法术防御 |
| CritRate | 暴击率 |
| CritDamage | 暴击伤害 |
| MoveSpeed | 基础移动速度 |
| AttackSpeed | 攻速倍率 |
| SkillHaste | 技能冷却缩减 |
| HitStunResistance | 硬直抗性 |
| KnockbackResistance | 击退抗性 |
| LaunchResistance | 浮空抗性 |
| SuperArmorValue | 霸体值 |
| Weight | 重量，用于击飞计算 |

---

## 6.2 玩家推荐字段

```text
MaxHP
MaxMP
Attack
Defense
MoveSpeedX
MoveSpeedY
JumpHeight
DashDistance
DashCooldown
AttackSpeed
SkillCooldownRate
HitRecoveryRate
```

---

## 6.3 敌人推荐字段

```text
MaxHP
Attack
Defense
MoveSpeedX
MoveSpeedY
AggroRange
AttackRange
ChaseRange
ReturnRange
ExpReward
GoldReward
DropTable
```

---

# 7. 移动配置

## 7.1 MovementConfig 字段

| 字段 | 说明 |
|---|---|
| MoveSpeedX | 横向移动速度 |
| MoveSpeedY | 纵向移动速度 |
| Acceleration | 加速度 |
| Deceleration | 减速度 |
| TurnSpeed | 转向速度 |
| CanMoveUpDown | 是否允许上下走位 |
| CanMoveWhileAttack | 攻击中是否允许移动 |
| CanMoveWhileSkill | 技能中是否允许移动 |
| UseRootMotion | 是否使用动作位移 |
| StopOnWall | 撞墙停止 |
| SoftCollision | 是否开启软碰撞 |

---

## 7.2 DNF 式移动规则

```text
左右输入改变角色朝向
上下输入只改变站位，不改变朝向
只做右向动画，左向通过 FlipX 镜像
斜向移动需要归一化，不能比横向更快
移动动画只需要 Move_Right，Move_Left 镜像得到
```

---

## 7.3 推荐数值

玩家：

```text
MoveSpeedX: 4.5
MoveSpeedY: 3.8
Acceleration: 20
Deceleration: 25
```

普通敌人：

```text
MoveSpeedX: 3.0~4.0
MoveSpeedY: 2.5~3.5
Acceleration: 12
Deceleration: 16
```

敏捷敌人：

```text
MoveSpeedX: 5.0~6.5
MoveSpeedY: 4.2~5.5
```

---

# 8. 跳跃配置

## 8.1 JumpConfig 字段

| 字段 | 说明 |
|---|---|
| CanJump | 是否能跳跃 |
| JumpHeight | 跳跃高度 |
| JumpDuration | 跳跃总时长 |
| JumpStartTime | 起跳前摇 |
| JumpRiseTime | 上升时间 |
| JumpFallTime | 下落时间 |
| LandRecovery | 落地硬直 |
| AirMoveRate | 空中移动倍率 |
| CanAirAttack | 是否可空中攻击 |
| CanAirSkill | 是否可空中放技能 |
| DodgeLowAttack | 是否躲低段攻击 |

---

## 8.2 攻击高度判定

攻击配置必须带 HitHeight：

```text
Low
Middle
High
All
```

跳跃规则：

```text
Z 高度 > 0.4 时，可以躲避 Low
Middle 视技能配置
High 和 All 不能躲
```

---

# 9. 冲刺 / 闪避配置

## 9.1 DashConfig 字段

| 字段 | 说明 |
|---|---|
| CanDash | 是否能冲刺 |
| DashDistance | 冲刺距离 |
| DashDuration | 冲刺时间 |
| DashCooldown | 冲刺冷却 |
| DashInvincibleStart | 无敌开始时间 |
| DashInvincibleEnd | 无敌结束时间 |
| DashAfterRecovery | 冲刺后摇 |
| DashCanCancelAttack | 是否可取消普攻 |
| DashCanCancelSkill | 是否可取消技能 |
| DashCostType | 消耗类型 |
| DashCostValue | 消耗数值 |

---

## 9.2 方向规则

```text
有方向输入：按输入方向冲刺
无方向输入：按当前朝向冲刺
敌人冲刺：默认朝目标方向冲刺
```

---

# 10. 动画序列帧配置

## 10.1 AnimationClipConfig 字段

| 字段 | 类型 | 说明 |
|---|---|---|
| AnimationID | string | 动画 ID |
| DisplayName | string | 动画名 |
| SpriteSheet | Texture2D | 序列帧图集 |
| FrameList | Sprite[] | 帧列表 |
| FPS | int | 帧率 |
| Loop | bool | 是否循环 |
| CanFlipX | bool | 是否允许镜像 |
| FrameWidth | int | 单帧宽 |
| FrameHeight | int | 单帧高 |
| FrameCount | int | 帧数 |
| TotalDuration | float | 总时长 |
| PivotMode | enum | 轴心方式 |
| UseShadow | bool | 是否显示脚底影子 |

---

## 10.2 动画分类

```text
Idle
Move
JumpStart
JumpRise
JumpFall
Land
Dash
Attack
Skill
Ultimate
Hit
Knockback
Launch
Down
GetUp
Dead
Interact
Special
```

---

## 10.3 序列帧导入方式

### 自动切片

输入：

```text
SpriteSheet
FrameWidth
FrameHeight
Rows
Columns
StartIndex
FrameCount
```

工具自动生成：

```text
Frame_001
Frame_002
Frame_003
...
```

### 手动拖拽

也支持直接拖入独立 PNG：

```text
Mouse_Idle_01.png
Mouse_Idle_02.png
Mouse_Idle_03.png
```

---

## 10.4 动画预览功能

预览窗口要支持：

```text
播放 / 暂停
上一帧 / 下一帧
循环播放
播放速度调整
当前帧编号
当前时间
角色轴心显示
脚底线显示
HitBox 显示
HurtBox 显示
BodyBox 显示
事件点显示
镜像预览
```

---

# 11. 动作配置 ActionConfig

## 11.1 ActionConfig 作用

动画只管画面，Action 负责游戏逻辑。

一个 Action 负责：

```text
播放哪个动画
动作持续多久
是否锁定移动
是否能转向
是否霸体 / 无敌
什么时候产生伤害
什么时候能取消
什么时候播放音效和特效
```

---

## 11.2 ActionConfig 字段

| 字段 | 说明 |
|---|---|
| ActionID | 动作 ID |
| ActionName | 显示名称 |
| ActionType | 动作类型 |
| AnimationClip | 绑定动画 |
| Duration | 动作总时长 |
| CanMove | 是否允许移动 |
| CanTurn | 是否允许转向 |
| LockFacingOnStart | 开始时锁定朝向 |
| CanBeInterrupted | 是否可被打断 |
| SuperArmor | 是否霸体 |
| Invincible | 是否无敌 |
| InputBufferTime | 输入缓存 |
| Cooldown | 冷却 |
| CostType | 消耗类型 |
| CostValue | 消耗数值 |
| Priority | 动作优先级 |
| DamageEvents | 伤害事件列表 |
| FrameEvents | 帧事件列表 |
| CancelWindows | 取消窗口列表 |
| ActionMove | 动作位移 |

---

## 11.3 动作类型

```text
Idle
Move
Jump
Dash
NormalAttack
AirAttack
Skill
Ultimate
Hit
Knockback
Launch
Down
GetUp
Dead
Interact
AIOnly
```

---

# 12. 普攻三连击配置

## 12.1 ComboConfig 字段

| 字段 | 说明 |
|---|---|
| ComboID | 连击 ID |
| ComboName | 连击名称 |
| InputKey | 输入键 |
| ComboActions | 普攻动作列表 |
| ResetTime | 多久未输入重置 |
| NeedHitToContinue | 是否必须命中才能接 |
| AllowEmptyContinue | 打空是否可接 |
| BufferTime | 输入缓存 |

---

## 12.2 普攻单段配置

| 字段 | 说明 |
|---|---|
| AttackID | 攻击 ID |
| Animation | 动画 |
| DamageRate | 伤害倍率 |
| HitType | 命中类型 |
| HitHeight | 攻击高度 |
| HitStun | 命中硬直 |
| SelfMoveDistance | 自身位移 |
| KnockbackDistance | 击退距离 |
| KnockbackTime | 击退时间 |
| LaunchPower | 浮空力度 |
| CanCancelToNext | 可接下一段 |
| CanCancelToSkill | 可接技能 |
| CanCancelToDash | 可接闪避 |

---

## 12.3 示例

```text
ComboID: DogHero_NormalAttack
InputKey: J
ResetTime: 0.7
NeedHitToContinue: false
AllowEmptyContinue: true

Attack_01:
  DamageRate: 1.0
  HitFrame: 3~4
  CancelWindow: 5~8

Attack_02:
  DamageRate: 1.15
  HitFrame: 4~5
  CancelWindow: 6~9

Attack_03:
  DamageRate: 1.45
  HitFrame: 5~7
  CancelWindow: 9~11
```

---

# 13. 技能配置 SkillConfig

## 13.1 SkillConfig 字段

| 字段 | 说明 |
|---|---|
| SkillID | 技能 ID |
| SkillName | 技能名 |
| SkillIcon | 技能图标 |
| SkillType | 主动 / 被动 / 绝技 |
| ElementType | 元素类型 |
| Description | 技能描述 |
| Animation | 技能动画 |
| Cooldown | 冷却 |
| CostType | 消耗类型 |
| CostValue | 消耗数值 |
| CastRange | 释放距离 |
| TargetType | 目标类型 |
| DamageEvents | 伤害事件 |
| ProjectileConfig | 投射物 |
| VFXEvents | 特效事件 |
| SFXEvents | 音效事件 |
| CancelRules | 取消规则 |
| AIUseCondition | AI 使用条件 |

---

## 13.2 技能类型

```text
MeleeSlash       近战斩击
Projectile      投射物
Area            范围技能
Buff            增益
Debuff          减益
Summon          召唤
DashAttack      突进攻击
Counter         反击
Ultimate        绝技
Passive         被动
```

---

## 13.3 目标类型

```text
Self
Forward
NearestEnemy
SelectedTarget
GroundPoint
AreaAroundSelf
LineForward
ConeForward
ProjectileForward
```

---

# 14. 伤害帧 DamageEvent

## 14.1 概念

伤害帧就是动画中真正造成伤害的时间段。

例如：

```text
Attack_01 一共 8 帧
第 1~2 帧：前摇
第 3~4 帧：伤害帧
第 5~8 帧：后摇 / 取消窗口
```

---

## 14.2 DamageEvent 字段

| 字段 | 说明 |
|---|---|
| EventID | 事件 ID |
| StartFrame | 开始帧 |
| EndFrame | 结束帧 |
| HitBoxGroupID | 使用的伤害框组 |
| DamageType | 伤害类型 |
| DamageRate | 伤害倍率 |
| FixedDamage | 固定伤害 |
| ElementType | 元素 |
| HitHeight | 攻击高度 |
| HitType | 命中类型 |
| HitStun | 硬直 |
| Knockback | 击退 |
| LaunchPower | 浮空 |
| HitCountLimit | 每目标命中次数 |
| HitInterval | 持续伤害间隔 |
| CanCrit | 是否暴击 |
| CanBlock | 是否可格挡 |
| CanHitDown | 是否打倒地 |
| CanHitAir | 是否打空中 |
| HitStop | 命中停顿 |
| CameraShake | 镜头震动 |

---

## 14.3 多段伤害示例

旋风斩：

```text
DamageEvent_01
StartFrame: 3
EndFrame: 18
DamageRate: 0.35
HitCountLimit: 5
HitInterval: 0.2
HitType: LightHit
```

剑气：

```text
DamageEvent_01
StartFrame: 5
EndFrame: 10
DamageRate: 1.2
HitCountLimit: 1
Knockback: 1.2
HitType: Knockback
```

---

# 15. HitBox 伤害框编辑

## 15.1 支持形状

第一版：

```text
Rectangle
Circle
Capsule
```

后续扩展：

```text
Fan
Line
Polygon
Projectile
```

---

## 15.2 HitBox 字段

| 字段 | 说明 |
|---|---|
| HitBoxID | 唯一 ID |
| Shape | 形状 |
| OffsetX | 相对角色中心 X 偏移 |
| OffsetY | 相对角色脚底 Y 偏移 |
| Width | 宽度 |
| Height | 高度 |
| Radius | 半径 |
| FollowFacing | 是否随朝向镜像 |
| ActiveFrameStart | 启用帧 |
| ActiveFrameEnd | 关闭帧 |
| PreviewColor | 预览颜色 |

---

## 15.3 镜像规则

角色朝右：

```text
OffsetX = 正数
```

角色朝左：

```text
OffsetX 自动取反
```

宽高不变。

---

## 15.4 编辑操作

工具要支持：

```text
拖拽移动伤害框
拖拽缩放伤害框
输入数值精调
复制上一帧伤害框
复制到多个帧
镜像预览
显示坐标网格
显示角色脚底点
显示攻击范围
```

---

# 16. HurtBox 受击框编辑

## 16.1 受击框类型

```text
MainHurtBox
HeadHurtBox
BodyHurtBox
LowHurtBox
AirHurtBox
DownHurtBox
```

第一版可以只做 MainHurtBox，但数据结构要支持多框。

---

## 16.2 HurtBox 字段

| 字段 | 说明 |
|---|---|
| HurtBoxID | 唯一 ID |
| Shape | 形状 |
| OffsetX | X 偏移 |
| OffsetY | Y 偏移 |
| Width | 宽度 |
| Height | 高度 |
| Radius | 半径 |
| HurtHeight | 受击高度 |
| DamageRate | 受伤倍率 |
| CanBeHit | 是否可被打 |
| CanBeGrabbed | 是否可被抓 |
| ArmorType | 护甲类型 |

---

## 16.3 动作受击框规则

```text
待机：正常受击框
移动：正常受击框
跳跃：受击框上移
倒地：受击框压低
闪避：无敌帧关闭受击框
绝技：霸体或关闭受击框
死亡：关闭受击框
```

---

# 17. BodyBox 阻挡框

## 17.1 作用

```text
角色与地图碰撞
角色与敌人软碰撞
角色站位占用
防止完全重叠
```

---

## 17.2 字段

```text
Width
Height
OffsetX
OffsetY
SoftCollision
PushStrength
CanBePushed
CanPushOthers
```

---

# 18. 帧事件系统

## 18.1 FrameEvent 类型

```text
PlaySFX
PlayVFX
HitBoxOn
HitBoxOff
SpawnProjectile
MoveStart
MoveEnd
SetInvincible
SetSuperArmor
CameraShake
HitStop
CancelWindowStart
CancelWindowEnd
InputBufferOpen
InputBufferClose
SpawnSummon
ApplyBuff
ApplyDebuff
```

---

## 18.2 FrameEvent 字段

| 字段 | 说明 |
|---|---|
| FrameIndex | 第几帧 |
| Time | 时间 |
| EventType | 事件类型 |
| EventParam | 参数 |
| TriggerOnce | 是否只触发一次 |
| PreviewIcon | 时间轴图标 |

---

## 18.3 时间轴轨道

底部时间轴分轨：

```text
Sprite Track      当前帧
HitBox Track      伤害框
HurtBox Track     受击框
SFX Track         音效
VFX Track         特效
Move Track        位移
Cancel Track      取消窗口
State Track       状态变化
```

---

# 19. 伤害计算配置

## 19.1 DamageType

```text
Physical
Magic
TrueDamage
Bleed
Poison
Fire
Ice
Thunder
Wind
Dark
Light
```

---

## 19.2 HitType

```text
LightHit
HeavyHit
Knockback
Launch
Knockdown
Stun
Grab
Pull
Push
GuardBreak
```

---

## 19.3 伤害公式建议

```text
RawDamage = 攻击者攻击力 × DamageRate + FixedDamage
Reduction = 目标防御 / (目标防御 + 100)
FinalDamage = RawDamage × (1 - Reduction)
```

暴击：

```text
FinalDamage *= CritDamage
```

随机浮动：

```text
FinalDamage *= Random(0.95, 1.05)
```

---

# 20. 击退 / 浮空 / 硬直

## 20.1 HitReaction 字段

| 字段 | 说明 |
|---|---|
| HitStunTime | 命中硬直 |
| KnockbackDistance | 击退距离 |
| KnockbackDuration | 击退时间 |
| KnockbackCurve | 击退曲线 |
| LaunchPower | 浮空力度 |
| LaunchDuration | 浮空时间 |
| KnockdownTime | 倒地时间 |
| CanRecover | 是否可受身 |
| HitAnim | 受击动画 |

---

## 20.2 抗性影响

```text
最终击退 = 击退距离 × (1 - 目标击退抗性)
最终浮空 = 浮空力度 × (1 - 目标浮空抗性)
最终硬直 = 硬直时间 × (1 - 目标硬直抗性)
```

Boss 示例：

```text
KnockbackResistance: 0.8
LaunchResistance: 1.0
HitStunResistance: 0.6
```

---

# 21. 动作取消窗口

## 21.1 CancelWindow 字段

| 字段 | 说明 |
|---|---|
| StartFrame | 开始帧 |
| EndFrame | 结束帧 |
| AllowNextAttack | 是否允许接下一段普攻 |
| AllowSkill | 是否允许接技能 |
| AllowDash | 是否允许闪避 |
| AllowJump | 是否允许跳跃 |
| NeedHit | 是否必须命中 |
| NeedGrounded | 是否必须在地面 |
| TargetActions | 指定可取消动作 |

---

## 21.2 示例

普攻 1：

```text
StartFrame: 5
EndFrame: 8
AllowNextAttack: true
AllowSkill: true
AllowDash: true
NeedHit: false
```

重技能：

```text
StartFrame: 14
EndFrame: 18
AllowDash: true
AllowMove: true
NeedHit: false
```

---

# 22. 动作位移配置

## 22.1 ActionMove 字段

| 字段 | 说明 |
|---|---|
| UseActionMove | 是否使用动作位移 |
| MoveStartFrame | 位移开始帧 |
| MoveEndFrame | 位移结束帧 |
| MoveDistanceX | X 位移 |
| MoveDistanceY | Y 位移 |
| MoveCurve | 位移曲线 |
| StopOnWall | 撞墙停止 |
| StopOnEnemy | 撞敌停止 |
| PassThroughEnemy | 是否穿过敌人 |

---

## 22.2 位移曲线

```text
Linear       匀速
EaseOut      快出慢停
EaseIn       慢起快出
DashCurve    冲刺曲线
Knockback    击退曲线
```

---

# 23. 投射物配置

## 23.1 ProjectileConfig 字段

| 字段 | 说明 |
|---|---|
| ProjectileID | 投射物 ID |
| Prefab | 投射物 Prefab |
| SpawnFrame | 生成帧 |
| SpawnOffsetX | 生成位置 X |
| SpawnOffsetY | 生成位置 Y |
| Speed | 飞行速度 |
| LifeTime | 存活时间 |
| MaxDistance | 最大距离 |
| DirectionMode | 方向模式 |
| HitBox | 命中框 |
| DamageEvent | 伤害事件 |
| PierceCount | 穿透次数 |
| DestroyOnHit | 命中后销毁 |
| DestroyOnWall | 碰墙销毁 |
| TrailVFX | 拖尾特效 |

---

## 23.2 投射物方向

```text
Forward
Target
MousePosition
NearestEnemy
CustomAngle
```

---

# 24. 音效 / 特效配置

## 24.1 SFXEvent 字段

| 字段 | 说明 |
|---|---|
| FrameIndex | 触发帧 |
| SFXClip | 音效 |
| Volume | 音量 |
| Pitch | 音调 |
| RandomPitch | 随机音调 |
| SpatialBlend | 2D / 3D |
| PlayOnce | 是否只播一次 |
| AttachToCharacter | 是否跟随角色 |

---

## 24.2 VFXEvent 字段

| 字段 | 说明 |
|---|---|
| FrameIndex | 触发帧 |
| VFXPrefab | 特效 Prefab |
| SpawnOffsetX | X 偏移 |
| SpawnOffsetY | Y 偏移 |
| FollowCharacter | 是否跟随角色 |
| FollowFacing | 是否跟随朝向 |
| FlipWithCharacter | 是否镜像 |
| SortingLayer | 层级 |
| LifeTime | 存活时间 |
| Scale | 缩放 |
| ColorTint | 颜色 |

---

# 25. 敌人 AI 配置

## 25.1 EnemyAIConfig 字段

| 字段 | 说明 |
|---|---|
| AIType | AI 类型 |
| AggroRange | 仇恨范围 |
| ChaseRange | 追击范围 |
| AttackRange | 攻击距离 |
| SkillUseRange | 技能距离 |
| PatrolRange | 巡逻范围 |
| ReturnDistance | 返回距离 |
| DecisionInterval | 决策间隔 |
| SkillWeights | 技能权重 |
| LowHpBehavior | 低血行为 |
| CanFlee | 是否会逃跑 |
| FleeHpRate | 逃跑血量比例 |

---

## 25.2 AI 类型

```text
Coward        胆小型，比如老鼠小弟
Aggressive    进攻型，比如恶犬
Ambusher      伏击型
Ranged        远程型
Caster        施法型
Boss          Boss 型
Support       辅助型
```

---

## 25.3 老鼠小弟 AI 示例

```text
AIType: Coward
AggroRange: 5
AttackRange: 1.1
ChaseRange: 6
FleeHpRate: 0.4
CanFlee: true
PreferredDistance: 3.0
SkillWeights:
    ThrowKnife: 40
    SmokeEscape: 35
    Trap: 25
```

行为：

```text
玩家接近后后退
距离够远才扔飞刀
血量低于 40% 放烟雾逃跑
被逼近时短距离冲刺逃离
```

---

# 26. 掉落配置

## 26.1 DropTable 字段

```text
DropTableID
GoldMin
GoldMax
Exp
ItemDrops
```

ItemDrop：

```text
ItemID
DropRate
MinCount
MaxCount
RequireQuest
```

---

# 27. UI 显示配置

## 27.1 UI 字段

```text
ShowHPBar
HPBarStyle
ShowName
NameColor
ShowLevel
ShowEliteIcon
ShowBossHPBar
ShowCastBar
ShowBuffIcons
```

普通小怪：

```text
ShowHPBar: true
ShowName: false
ShowLevel: false
```

精英怪：

```text
ShowHPBar: true
ShowName: true
ShowEliteIcon: true
```

Boss：

```text
ShowBossHPBar: true
ShowName: true
ShowCastBar: true
```

---

# 28. 预览与测试功能

## 28.1 预览功能

必须支持：

```text
播放当前动画
播放当前动作
逐帧查看
显示帧编号
显示时间
显示 HitBox
显示 HurtBox
显示 BodyBox
显示位移轨迹
显示取消窗口
显示音效事件
显示特效事件
```

---

## 28.2 测试功能

工具内放一个假人 Dummy：

```text
Spawn Dummy
```

测试：

```text
攻击是否命中
伤害是否正确
击退是否正确
浮空是否正确
硬直是否正确
多段伤害是否重复命中
技能范围是否正确
取消窗口是否正确
```

---

## 28.3 测试日志

示例：

```text
Frame 03: HitBox On
Frame 04: Hit Dummy
Damage: 128
HitStun: 0.25
Knockback: 1.2
Frame 06: Cancel Window Start
Frame 08: Animation End
```

---

# 29. 配置校验系统

## 29.1 保存前检查

保存时检查：

```text
CharacterID 是否为空
动画是否缺失
帧数是否为 0
技能是否没有动画
伤害帧是否没有 HitBox
HitBox 是否没有伤害参数
技能冷却是否为负
资源消耗是否为负
取消窗口是否超出动画长度
事件帧是否超出动画帧数
投射物是否缺少 Prefab
音效引用是否丢失
特效引用是否丢失
```

---

## 29.2 提示等级

```text
Error：必须修复，否则不能保存
Warning：可以保存，但提示风险
Info：普通信息
```

---

## 29.3 示例

Error：

```text
Attack_01 有 DamageEvent，但没有绑定 HitBox。
Skill_FoxFire 的冷却时间小于 0。
Move 动画没有配置 FrameList。
```

Warning：

```text
Attack_03 没有取消窗口。
Skill_01 没有配置音效。
HurtBox 过小，可能导致敌人难以命中。
```

---

# 30. JSON 导出示例

```json
{
  "CharacterID": "Enemy_MouseWeak",
  "DisplayName": "老鼠小弟",
  "CharacterType": "Enemy_Normal",
  "BaseStats": {
    "MaxHP": 80,
    "Attack": 12,
    "Defense": 5,
    "MoveSpeedX": 4.8,
    "MoveSpeedY": 4.0
  },
  "Actions": [
    {
      "ActionID": "Mouse_Attack_01",
      "Animation": "Mouse_Attack_01_Right",
      "DamageEvents": [
        {
          "StartFrame": 3,
          "EndFrame": 4,
          "DamageRate": 1.0,
          "HitType": "LightHit",
          "HitHeight": "Middle",
          "HitBox": {
            "Shape": "Rectangle",
            "OffsetX": 0.8,
            "OffsetY": 0.5,
            "Width": 1.0,
            "Height": 0.6
          }
        }
      ]
    }
  ]
}
```

---

# 31. 运行时执行流程

## 31.1 角色生成流程

```text
生成角色 Prefab
→ 读取 CharacterConfig
→ 初始化基础属性
→ 初始化 Movement / Jump / Dash
→ 初始化动画控制器
→ 初始化动作列表
→ 初始化技能列表
→ 初始化 HitBox / HurtBox / BodyBox
→ 初始化 AI
→ 进入 Idle 状态
```

---

## 31.2 攻击执行流程

```text
玩家按下攻击
→ ActionRunner 执行 Attack_01
→ 播放 Attack_01 动画
→ 时间轴到达 DamageEvent StartFrame
→ 开启 HitBox
→ 检测目标 HurtBox
→ 判断阵营
→ 判断攻击高度
→ 计算伤害
→ 应用硬直 / 击退 / 浮空
→ 播放命中特效
→ 播放命中音效
→ 进入取消窗口
→ 接下一段普攻 / 技能 / 闪避
→ 动作结束回 Idle 或 Move
```

---

# 32. MVP 开发范围

## 32.1 第一版必须做

```text
角色基础信息配置
基础属性配置
序列帧动画配置
动作配置
普攻三连击配置
技能配置
HitBox 编辑
HurtBox 编辑
DamageEvent 配置
SFX / VFX 帧事件
动画预览
配置保存
配置校验
运行时读取配置
```

---

## 32.2 第一版先不做

```text
复杂多边形 HitBox
骨骼绑定
多人协作锁定
外部 Excel 导入
技能升级树
Buff 编辑器
Boss 阶段编辑器
连线式状态机编辑
```

---

# 33. 后续扩展

第二版：

```text
Buff / Debuff 配置
技能升级配置
Boss 阶段配置
敌人行为树简化编辑
连招树编辑
投射物轨迹编辑
多目标测试
```

第三版：

```text
角色模板库
动作模板库
技能模板库
批量替换动画
批量调整伤害倍率
战斗模拟器
自动生成技能说明文本
导出策划表
```

---

# 34. 示例：老鼠小弟完整配置

## 34.1 基础属性

```text
CharacterID: Enemy_MouseWeak
Name: 老鼠小弟
Type: Enemy_Normal
AIType: Coward
MaxHP: 80
Attack: 10
Defense: 4
MoveSpeedX: 4.8
MoveSpeedY: 4.0
AggroRange: 5
AttackRange: 1.0
ChaseRange: 6
CanFlee: true
FleeHpRate: 0.4
```

---

## 34.2 动画

```text
Idle_Right: 6 frames, 6 FPS, loop
Move_Right: 8 frames, 12 FPS, loop
Dash_Right: 6 frames, 14 FPS
Attack_01_Right: 6 frames, 12 FPS
Attack_02_Right: 6 frames, 12 FPS
Attack_03_Right: 8 frames, 12 FPS
Skill_SmokeEscape: 8 frames
Skill_ThrowKnife: 6 frames
Skill_Trap: 8 frames
Ultimate_RatSwarm: 12 frames
Hit_Right: 4 frames
Dead_Right: 8 frames
```

---

## 34.3 普攻 1

```text
ActionID: Mouse_Attack_01
Animation: Attack_01_Right
DamageRate: 0.8
HitFrame: 3~4
HitBox:
    Shape: Rectangle
    OffsetX: 0.6
    OffsetY: 0.45
    Width: 0.8
    Height: 0.5
HitStun: 0.15
Knockback: 0.4
CanCancelToNext: true
```

---

## 34.4 技能：烟雾逃跑

```text
SkillID: Mouse_SmokeEscape
Cooldown: 8
Cost: none
Frame 2: Spawn Smoke VFX
Frame 3: Become Invincible
Frame 3~7: Dash Backward
Frame 8: End Invincible
AI Condition:
    HP < 40%
    PlayerDistance < 2.0
```

---

# 35. 示例：豺狼敌人完整配置

## 35.1 基础属性

```text
CharacterID: Enemy_JackalClaw
Name: 豺狼
Type: Enemy_Normal
AIType: Aggressive
MaxHP: 160
Attack: 22
Defense: 8
MoveSpeedX: 5.2
MoveSpeedY: 4.2
AggroRange: 7
AttackRange: 1.2
ChaseRange: 9
CanFlee: false
```

---

## 35.2 技能：撕裂爪击

```text
SkillID: Jackal_RendClaw
Cooldown: 5
DamageRate: 1.4
HitFrame: 4~6
HitType: HeavyHit
BleedChance: 30%
HitBox:
    Shape: Rectangle
    OffsetX: 1.0
    OffsetY: 0.55
    Width: 1.4
    Height: 0.8
```

---

# 36. 工具验收标准

## 36.1 配置验收

```text
可以创建一个新角色
可以配置基础属性
可以导入序列帧
可以创建 Idle / Move / Attack / Skill 动作
可以给动作绑定动画
可以逐帧编辑 HitBox
可以逐帧编辑 HurtBox
可以配置伤害帧
可以配置伤害数值
可以配置音效和特效帧
可以保存配置
运行时能读取配置
```

---

## 36.2 战斗验收

```text
普攻能按配置造成伤害
技能能按配置造成伤害
HitBox 显示和实际命中一致
HurtBox 显示和实际受击一致
击退和硬直按配置执行
音效按帧触发
特效按帧触发
取消窗口按配置生效
```

---

## 36.3 工具体验收

```text
策划不写代码也能配角色
美术能检查动画帧和受击框
程序能通过配置驱动运行
修改配置后不用改代码
错误配置有提示
预览能看到真实战斗效果
```

---

# 37. 总结

这个角色配置工具的核心不是单纯填属性，而是完整打通：

```text
角色基础属性
序列帧动画
动作逻辑
伤害帧
伤害框
受击框
技能参数
音效特效
状态切换
AI 行为
运行时执行
```

最终目标：

```text
一个角色从原画、序列帧、动作、技能、伤害、AI 到掉落，都能在同一个工具里完成配置。
```

后期新增一个角色，只需要：

```text
1. 导入序列帧
2. 配基础属性
3. 配动作
4. 配技能
5. 配 HitBox / HurtBox
6. 配 AI
7. 测试
8. 保存
```

不用每个角色单独写一套逻辑。
