# 26_技能界面：主动技能、辅助模块、保留技能、快捷绑定 UI 预制体


> 设计边界说明：本项目可以参考《流放之路2》这类暗黑刷宝 ARPG 的信息架构、交互复杂度和系统深度，但不能一比一复制其 UI 视觉、图标、文字、专有数值、专有命名、具体排版截图。本批文档采用“同类结构 + 原创表现”的方式：界面功能、层级、预制体和数据绑定可直接用于 Unity 原型开发。


## 1. 界面定位

技能界面是 BD 形成的第二核心。技能不是简单学习列表，而是由“主动技能核心 + 辅助模块 + 资源消耗 + 快捷键绑定 + 属性需求 + 武器限制”共同组成。

本项目采用原创命名：

```text
Skill Core      = 主动技能核心
Support Module  = 辅助模块
Reserve Skill   = 保留技能
Trigger Rule    = 触发规则
Skill Link      = 技能链接组
```

## 2. 技能界面整体布局

```text
UI_SkillGemPanel.prefab
├── Header
│   ├── TitleText
│   ├── SkillPointText
│   ├── SearchInput
│   └── CloseButton
├── LeftSkillList
│   ├── CategoryTabs
│   │   ├── Attack
│   │   ├── Spell
│   │   ├── Movement
│   │   ├── Defense
│   │   ├── Minion
│   │   ├── Aura
│   │   └── Trigger
│   └── SkillCoreScroll
│       └── SkillCoreSlot[]
├── CenterSkillBuildArea
│   ├── ActiveSkillSlotGrid
│   │   ├── ActiveSkillGroup_01
│   │   ├── ActiveSkillGroup_02
│   │   ├── ActiveSkillGroup_03
│   │   ├── ActiveSkillGroup_04
│   │   ├── ActiveSkillGroup_05
│   │   └── ActiveSkillGroup_06
│   ├── ReserveSkillGroup
│   └── TriggerSkillGroup
├── RightDetailPanel
│   ├── SelectedSkillTooltip
│   ├── DPSPreviewBlock
│   ├── CostPreviewBlock
│   ├── RequirementBlock
│   └── ConflictWarningBlock
└── BottomBindingBar
    ├── Bind_LMB
    ├── Bind_RMB
    ├── Bind_Q
    ├── Bind_E
    ├── Bind_R
    ├── Bind_F
    ├── Bind_Space
    └── ClearBindingButton
```

## 3. 主动技能组 Prefab

```text
UI_ActiveSkillGroup.prefab
├── GroupHeader
│   ├── SkillNameText
│   ├── EnableToggle
│   ├── BoundKeyText
│   └── SkillLevelText
├── CoreSlot
│   ├── SkillCoreIcon
│   ├── RarityFrame
│   ├── RequirementWarning
│   └── DragDropReceiver
├── SupportSlotRow
│   ├── SupportSlot_01
│   ├── SupportSlot_02
│   ├── SupportSlot_03
│   ├── SupportSlot_04
│   └── SupportSlot_05
├── ResourceCostRow
│   ├── ManaCostText
│   ├── CooldownText
│   ├── CastTimeText
│   └── SpiritReserveText
├── TagRow
│   ├── Tag_Attack
│   ├── Tag_Projectiles
│   ├── Tag_Fire
│   ├── Tag_AOE
│   └── Tag_Movement
└── MiniDPSBar
```

## 4. 技能核心槽 UI

```text
UI_SkillCoreSlot.prefab
├── SlotBackground
├── SkillIcon
├── SkillLevelBadge
├── QualityBadge
├── WeaponRestrictionIcon
├── AttributeRequirementWarning
├── CanUpgradeArrow
├── LockedOverlay
├── HoverOutline
└── SelectedOutline
```

## 5. 辅助模块槽 UI

```text
UI_SupportModuleSlot.prefab
├── SlotBackground
├── SupportIcon
├── SupportTypeBadge
├── CompatibleGlow
├── ConflictOverlay
├── AlreadyUsedWarning
├── CostIncreaseBadge
└── TooltipTrigger
```

兼容规则：

| 条件 | 判断 |
|---|---|
| 标签匹配 | 辅助模块的 RequiredTags 与技能 Tags 有交集 |
| 武器匹配 | 技能核心和装备武器类型满足 |
| 唯一限制 | 同一技能组不能放两个同类唯一辅助 |
| 资源限制 | 增加后的消耗不能超过角色可用资源 |
| 触发限制 | 触发技能不能绑定手动施放键 |

## 6. 技能详情 Tooltip

```text
UI_SkillTooltip.prefab
├── Header
│   ├── SkillNameText
│   ├── SkillIcon
│   ├── SkillLevelText
│   └── SkillTypeText
├── TagBlock
│   └── TagBadge[]
├── DescriptionBlock
│   ├── MainDescriptionText
│   └── ScalingDescriptionText
├── StatBlock
│   ├── DamageRow
│   ├── AttackCastSpeedRow
│   ├── CooldownRow
│   ├── CostRow
│   ├── RangeRow
│   └── AoeRow
├── SupportEffectBlock
│   ├── SupportModifierRow[]
│   └── TotalMultiplierRow
├── RequirementBlock
│   ├── LevelRequirement
│   ├── AttributeRequirement
│   └── WeaponRequirement
└── HintBlock
```

## 7. 快捷键绑定 UI

```text
UI_SkillBindSlot.prefab
├── KeyIcon
├── BoundSkillIcon
├── CooldownPreviewRing
├── ResourceCostMini
├── ConflictWarningIcon
├── EmptyHintText
├── HoverOutline
└── SelectedOutline
```

绑定流程：

```text
点击技能组
→ 点击底部快捷键槽
→ 检查技能是否可手动释放
→ 检查是否有冲突绑定
→ 绑定成功
→ 战斗 HUD 技能栏同步刷新
```

## 8. 保留技能 UI

保留技能会占用 Spirit/专注/灵能类资源，因此需要一个独立区域。

```text
UI_ReserveSkillGroup.prefab
├── Header
│   ├── TitleText
│   ├── UsedReserveText
│   └── MaxReserveText
├── ReserveBar
├── ReserveSkillSlotRow
│   ├── ReserveSlot_01
│   ├── ReserveSlot_02
│   ├── ReserveSlot_03
│   └── ReserveSlot_04
└── WarningText
```

## 9. 技能升级 UI

```text
UI_SkillUpgradePopup.prefab
├── TitleText
├── CurrentLevelBlock
├── NextLevelBlock
├── CostBlock
│   ├── CurrencyCostRow
│   ├── MaterialCostRow
│   └── SkillPointCostRow
├── ChangePreview
├── ConfirmButton
└── CancelButton
```

## 10. 技能页数据绑定

```csharp
class SkillPanelViewModel
{
    List<SkillCoreViewModel> OwnedSkillCores;
    List<SupportModuleViewModel> OwnedSupports;
    List<ActiveSkillGroupViewModel> ActiveGroups;
    List<ReserveSkillViewModel> ReserveSkills;
    SkillBindingModel BindingModel;
    CharacterResourcePreview ResourcePreview;
}
```

## 11. 技能界面操作

| 操作 | 结果 |
|---|---|
| 拖动技能核心到空技能组 | 创建技能组 |
| 拖动辅助到技能组 | 添加辅助模块 |
| 右键辅助模块 | 移除辅助模块 |
| 点击技能组 | 右侧显示详情 |
| 拖动技能组到底部快捷键 | 绑定快捷键 |
| 点击升级按钮 | 打开升级弹窗 |
| 搜索关键词 | 过滤技能核心与辅助模块 |
| Alt 悬浮 | 显示高级系数、伤害转换、触发规则 |

## 12. 原型验收标准

1. 创建至少 6 个技能组。
2. 每个技能组可以插入 1 个主动核心 + 5 个辅助模块。
3. 辅助模块能显示兼容/冲突状态。
4. 技能能绑定到底部快捷键。
5. 战斗 HUD 技能栏同步刷新。
6. 保留技能会占用资源并影响可用资源条。
