# 66. 技能编辑器界面结构：主窗口、列表、详情、预览


> 项目：Unity 3D ACT 刷宝 ARPG  
> 批次：第五批 —— 技能编辑器 / 怪物技能编辑器 / 策划配置工具  
> 目标：让策划不改代码，也能配置玩家技能、怪物技能、Boss 阶段技能、辅助模块、Buff、VFX/SFX、数值成长、AI 使用条件与测试验收。


---

## 1. 主窗口布局

Unity 菜单入口：

```text
Tools / ARPG / Skill Editor
```

窗口推荐尺寸：

```text
最小：1600 × 900
推荐：1920 × 1080
支持：双屏，右侧预览可独立弹出
```

总布局：

```text
SkillEditorWindow
├── TopToolbar 顶部工具栏，高 48
├── LeftSkillBrowser 左侧技能库，宽 320
├── CenterSkillInspector 中央配置区，宽自适应
├── RightPreviewPanel 右侧预览区，宽 420
└── BottomLogPanel 底部校验日志，高 180，可折叠
```

---

## 2. 顶部工具栏

```text
TopToolbar
├── Btn_NewSkill
├── Btn_Duplicate
├── Btn_Save
├── Btn_Validate
├── Btn_ExportJson
├── Btn_OpenSandbox
├── Dropdown_OwnerType
├── Dropdown_Category
├── SearchField_Global
├── Toggle_ShowDeprecated
└── Btn_Settings
```

### 2.1 按钮说明

| 控件 | 功能 | 策划使用方式 |
|---|---|---|
| NewSkill | 新建技能 | 选择玩家/怪物/Boss 后创建 |
| Duplicate | 复制当前技能 | 用于快速做变体技能 |
| Save | 保存编辑态资产 | 只保存 ScriptableObject |
| Validate | 校验技能 | 检查字段缺失、数值非法、资源缺失 |
| ExportJson | 导出运行态配置 | 生成 StreamingAssets JSON |
| OpenSandbox | 打开技能测试场 | 用假人/怪物测试表现 |
| ShowDeprecated | 显示废弃技能 | 默认关闭 |

---

## 3. 左侧技能库

```text
LeftSkillBrowser
├── SearchField
├── FilterRow
│   ├── OwnerTypeFilter
│   ├── ClassFilter
│   ├── CategoryFilter
│   ├── TagFilter
│   └── StatusFilter
├── SkillTreeList
│   ├── PlayerSkills
│   ├── MonsterSkills
│   ├── BossSkills
│   ├── SupportModules
│   └── BuffDefinitions
└── BatchActionBar
    ├── Btn_BatchValidate
    ├── Btn_BatchExport
    └── Btn_BatchReplace
```

### 3.1 技能条目显示

每个技能条目：

```text
SkillListItem
├── Icon
├── SkillName
├── SkillID
├── CategoryBadge
├── OwnerBadge
├── ErrorBadge
├── ChangedBadge
└── DeprecatedBadge
```

颜色规则：

| 状态 | 显示 |
|---|---|
| 正常 | 普通背景 |
| 未保存 | 左侧橙色竖条 |
| 有错误 | 红色 ErrorBadge |
| 有警告 | 黄色 WarningBadge |
| 已废弃 | 灰色半透明 |
| 怪物技能 | 紫色 OwnerBadge |
| Boss 技能 | 金色 OwnerBadge |

---

## 4. 中央配置区：页签结构

```text
CenterSkillInspector
├── HeaderCard
│   ├── Icon
│   ├── SkillName
│   ├── SkillID
│   ├── OwnerType
│   ├── Category
│   └── EnableToggle
├── TabBar
│   ├── 基础
│   ├── 输入与消耗
│   ├── 执行流
│   ├── 伤害
│   ├── 判定
│   ├── 投射物
│   ├── Buff/异常
│   ├── 召唤
│   ├── 表现
│   ├── AI规则
│   ├── 等级成长
│   ├── 辅助兼容
│   └── 发布信息
└── TabContent
```

---

## 5. 基础页签

```text
Tab_Basic
├── Field_SkillID 只读
├── Field_InternalName
├── Field_DisplayName_ZH
├── Field_DisplayName_EN
├── Field_Description
├── Field_Icon
├── Dropdown_OwnerType
├── Dropdown_ClassAffinity
├── Dropdown_Category
├── TagSelector_SkillTags
├── Toggle_IsDeprecated
├── Field_DesignerNote
└── Field_VersionNote
```

技能标签必须支持多选：

```text
Attack
Spell
Melee
Projectile
Area
Duration
Buff
Debuff
Summon
Movement
Guard
Channeled
Triggered
Fire
Cold
Lightning
Poison
Bleed
Physical
Holy
Chaos
BossOnly
MonsterOnly
```

---

## 6. 输入与消耗页签

```text
Tab_InputCost
├── InputMode
│   ├── ClickPoint
│   ├── TargetUnit
│   ├── Directional
│   ├── SelfCast
│   └── ToggleAura
├── CastCondition
│   ├── RequireWeaponType
│   ├── RequireResource
│   ├── RequireGrounded
│   ├── RequireTarget
│   └── RequireNotSilenced
├── CostBlock
│   ├── ManaCost
│   ├── RageCost
│   ├── EnergyCost
│   ├── HealthCost
│   ├── AmmoCost
│   └── ReservedResource
├── CooldownBlock
│   ├── BaseCooldown
│   ├── ChargeCount
│   ├── ChargeRecoverTime
│   └── GlobalCooldownGroup
└── InputBuffer
    ├── BufferTime
    ├── QueuePriority
    └── CanCancelPreviousSkill
```

---

## 7. 执行流页签

技能执行流是核心。不要让策划写代码，而是用阶段块配置。

```text
Tab_Execution
├── TimelineView
│   ├── CastStartPhase
│   ├── ActivePhase
│   ├── RecoveryPhase
│   └── CancelWindowPhase
├── PhaseList
│   ├── PhaseItem_0
│   ├── PhaseItem_1
│   └── PhaseItem_N
└── EventTrackList
    ├── AnimationEventTrack
    ├── HitboxEventTrack
    ├── ProjectileEventTrack
    ├── VFXEventTrack
    ├── SFXEventTrack
    └── CameraEventTrack
```

### 7.1 时间轴单位

统一使用秒。

```text
0.00s：技能开始
0.10s：播放挥砍音效
0.18s：生成 Hitbox
0.22s：命中帧
0.35s：可以翻滚取消
0.60s：技能结束
```

---

## 8. 伤害页签

```text
Tab_Damage
├── DamageBlockList
│   ├── DamageBlock_0
│   ├── DamageBlock_1
│   └── DamageBlock_N
├── AddDamageBlockButton
└── DamagePreviewChart
```

每个 DamageBlock：

```text
DamageBlock
├── DamageBlockID
├── TriggerEventID
├── DamageType
├── BaseDamage
├── WeaponDamagePercent
├── AttackPowerScale
├── SpellPowerScale
├── LevelScaleCurve
├── CritAllowed
├── AilmentAllowed
├── HitCount
├── DamageInterval
├── FalloffRule
└── PvPScale
```

---

## 9. 判定页签

```text
Tab_Hitbox
├── HitboxBlockList
├── HitboxScenePreview
└── HitboxDebugOptions
```

Hitbox 类型：

```text
Sphere
Box
Capsule
Cone
Sector
Ray
Fan
ArcTrail
AttachedWeaponTrail
GroundCircle
```

每个 Hitbox：

```text
HitboxBlock
├── ShapeType
├── AttachSocket
├── LocalOffset
├── LocalRotation
├── Size
├── StartTime
├── Duration
├── HitOncePerTarget
├── MaxTargetCount
├── TargetTeamFilter
├── TargetStateFilter
├── HitReactionType
└── DebugColor
```

---

## 10. 投射物页签

```text
Tab_Projectile
├── ProjectileBlockList
├── TrajectoryPreview
└── ProjectileCollisionPreview
```

ProjectileBlock：

```text
ProjectileBlock
├── ProjectilePrefab
├── SpawnSocket
├── SpawnCount
├── SpreadAngle
├── Speed
├── Acceleration
├── MaxDistance
├── MaxLifetime
├── PierceCount
├── ChainCount
├── BounceCount
├── HomingStrength
├── CollisionRadius
├── OnHitEvent
├── OnExpireEvent
└── TrailVFX
```

---

## 11. Buff/异常页签

```text
Tab_BuffStatus
├── ApplyBuffBlockList
├── RemoveBuffBlockList
├── StatusChanceBlock
└── StackRulePreview
```

字段：

```text
BuffID
ApplyEvent
TargetFilter
ApplyChance
Duration
StackCount
StackMode
RefreshMode
TickInterval
TickDamageBlock
OnApplyVFX
OnTickVFX
OnExpireVFX
```

---

## 12. 召唤页签

```text
Tab_Summon
├── SummonBlockList
├── SummonAISelector
├── SummonLimitPreview
└── SummonLifecyclePreview
```

字段：

```text
SummonEntityID
SummonPrefab
SpawnPointMode
SpawnCount
MaxAliveCount
Duration
InheritOwnerStats
InheritPercent
AIProfile
DeathBehavior
Commandable
```

---

## 13. 表现页签

```text
Tab_Presentation
├── AnimationSection
├── VFXSection
├── SFXSection
├── CameraSection
├── ControllerRumbleSection
├── UIToastSection
└── PerformanceBudgetSection
```

表现配置要支持 Preview 按钮：

```text
Btn_PreviewAnimation
Btn_PreviewVFX
Btn_PreviewSFX
Btn_PreviewCameraShake
Btn_PreviewFullSkill
```

---

## 14. AI 规则页签

玩家技能默认隐藏 AI 规则；怪物和 Boss 技能显示。

```text
Tab_AIRules
├── UseConditionList
├── ScoreRuleList
├── CooldownGroup
├── InterruptRule
├── MovementBeforeCast
├── TargetSelectionRule
└── DebugAIScore
```

AI 使用条件：

```text
距离范围
角度范围
目标数量
自身血量
目标血量
是否被控制
是否在阶段内
地图词缀是否允许
上次释放时间
当前技能池冷却
周围友军数量
周围敌人数量
```

---

## 15. 等级成长页签

```text
Tab_LevelScaling
├── MaxLevel
├── LevelTable
│   ├── Level
│   ├── RequiredCharacterLevel
│   ├── CostScale
│   ├── DamageScale
│   ├── CooldownScale
│   ├── RadiusScale
│   └── ExtraParamScale
├── CurvePreview
└── Btn_GenerateByTemplate
```

模板：

```text
线性成长
前期快后期慢
前期慢后期快
奇数等级强化
每 5 级大提升
Boss 技能无等级
怪物技能随区域等级缩放
```

---

## 16. 辅助兼容页签

```text
Tab_SupportCompatibility
├── RequiredTags
├── ForbiddenTags
├── AllowedSupportModules
├── ForbiddenSupportModules
├── SupportSlotCount
├── SupportConflictGroups
└── PreviewWithSupport
```

必须能预览某个技能装上辅助模块后的结果：

```text
原始：1 个投射物，100% 伤害，8 米距离
辅助后：3 个投射物，每个 65% 伤害，扩散角 20°
```

---

## 17. 发布信息页签

```text
Tab_Publish
├── Author
├── LastModifiedTime
├── Version
├── ChangeLog
├── UsedByCharacters
├── UsedByMonsters
├── UsedByBosses
├── DependencyList
├── ValidationResult
└── ExportStatus
```

必须显示依赖：

```text
使用了哪些动画
使用了哪些 VFX
使用了哪些 SFX
被哪些职业引用
被哪些怪物引用
被哪些 Boss 技能池引用
被哪些辅助模块影响
```

---

## 18. 右侧预览区

```text
RightPreviewPanel
├── CharacterPreview
│   ├── ModelView
│   ├── AnimPreview
│   └── SocketPreview
├── SkillResultPreview
│   ├── DamagePreview
│   ├── CooldownPreview
│   ├── RangePreview
│   └── ResourcePreview
├── TestButtons
│   ├── Btn_TestOnDummy
│   ├── Btn_TestOnMonster
│   ├── Btn_TestWithSupport
│   └── Btn_OpenFullSandbox
└── RuntimeLog
```

---

## 19. 底部校验日志

```text
BottomLogPanel
├── ErrorCount
├── WarningCount
├── InfoCount
├── FilterToggle_Error
├── FilterToggle_Warning
├── FilterToggle_Info
├── LogList
└── Btn_ExportReport
```

错误级别：

| 级别 | 是否阻止导出 | 示例 |
|---|---:|---|
| Error | 是 | 技能没有 SkillID、Hitbox 没绑定伤害、VFX 资源丢失 |
| Warning | 否 | 冷却过短、伤害过高、没有音效 |
| Info | 否 | 技能被 3 个怪物引用 |

---

## 20. 技能详情界面交互体验

必须支持：

- Ctrl + S 保存。
- Ctrl + D 复制技能。
- Ctrl + F 搜索字段。
- 字段悬浮显示说明。
- 修改字段后立即标记 Dirty。
- 保存前显示差异。
- 校验错误点击后跳转字段。
- Asset 拖拽绑定。
- 数值曲线可视化。
- 技能时间轴可拖动事件点。
- 右侧预览能播放当前配置。

---

## 21. UI/UX 重点

策划最容易出错的地方必须做成强提示：

```text
Hitbox 没有伤害块绑定：红色错误
投射物没有碰撞半径：红色错误
技能没有任何命中事件：黄色警告
AI 技能没有使用条件：黄色警告
Boss 阶段没有退出条件：红色错误
VFX 超过性能预算：黄色警告
技能 ID 与现有重复：红色错误
```
