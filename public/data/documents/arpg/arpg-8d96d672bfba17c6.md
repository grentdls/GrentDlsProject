# 24_整备主界面：顶部页签、个人信息栏、装备栏、技能栏


> 设计边界说明：本项目可以参考《流放之路2》这类暗黑刷宝 ARPG 的信息架构、交互复杂度和系统深度，但不能一比一复制其 UI 视觉、图标、文字、专有数值、专有命名、具体排版截图。本批文档采用“同类结构 + 原创表现”的方式：界面功能、层级、预制体和数据绑定可直接用于 Unity 原型开发。


## 1. 界面定位

整备主界面是玩家在主城、地图入口、战斗间隙进行角色构筑的核心界面。它不是简单背包，而是一个“一屏式角色构筑中心”。

核心结构：

```text
顶部页签：角色 / 装备 / 技能 / 天赋 / 背包 / 地图 / 任务 / 图鉴
左侧：个人信息栏 + 角色模型预览
中间：当前页签主要内容
右侧：背包、装备比较、快捷详情
底部：货币栏、快捷操作、键位提示
```

## 2. UI 布局比例

以 1920×1080 为基准：

```text
安全边距：48 px
顶部页签高度：72 px
底部快捷栏高度：64 px
左侧栏宽度：380 px
右侧栏宽度：520 px
中间主区域：剩余宽度
面板间距：16 px
物品格尺寸：64×64 px
装备槽尺寸：76×76 px
技能槽尺寸：72×72 px
```

## 3. 整备主界面 Prefab 结构

```text
UI_LoadoutRoot.prefab
├── DimBackground                       // 半透明暗底，可关闭
├── WindowFrame
│   ├── Header
│   │   ├── TitleText                   // “整备”
│   │   ├── CloseButton
│   │   └── CurrencyMiniBar             // 金币/核心货币/地图碎片
│   ├── TopTabs
│   │   ├── Tab_Character
│   │   ├── Tab_Equipment
│   │   ├── Tab_Skills
│   │   ├── Tab_Passive
│   │   ├── Tab_Inventory
│   │   ├── Tab_Map
│   │   ├── Tab_Quest
│   │   └── Tab_Codex
│   ├── Body
│   │   ├── LeftColumn
│   │   │   ├── CharacterPreviewPanel
│   │   │   ├── CharacterInfoCompact
│   │   │   └── ResistSummaryMini
│   │   ├── CenterContentHost           // 页签内容动态挂载点
│   │   └── RightColumn
│   │       ├── InventoryQuickPanel
│   │       ├── CompareHost
│   │       └── ContextActionPanel
│   └── Footer
│       ├── HotkeyHintBar
│       ├── SortFilterBar
│       └── WarningMessageText
├── TooltipAnchor
└── DragLayerAnchor
```

## 4. 顶部页签功能

| 页签 | 快捷键 | 内容 | 是否可在战斗中打开 |
|---|---|---|---:|
| 角色 | C | 属性、抗性、职业、等级、战斗统计 | 可以，但不暂停 |
| 装备 | I | 装备栏 + 背包 + 装备比较 | 可以，但不暂停 |
| 技能 | K | 主动技能、辅助模块、绑定按键 | 可以，但不暂停 |
| 天赋 | P | 被动树、路径预览、重置 | 主城/安全区优先 |
| 背包 | B/I | 全背包、筛选、排序 | 可以 |
| 地图 | M | 当前地图、传送、地图装置入口 | 主城/安全区优先 |
| 任务 | J | 任务日志、地图目标 | 可以 |
| 图鉴 | L | 怪物/词条/装备基底说明 | 安全区优先 |

## 5. 左侧个人信息栏

### 5.1 Prefab 结构

```text
UI_CharacterInfoCompact.prefab
├── Header
│   ├── ClassIcon
│   ├── CharacterNameText
│   ├── LevelText
│   └── BuildTagText
├── ResourceBars
│   ├── LifeBar
│   ├── EnergyShieldBar
│   ├── ManaOrFocusBar
│   └── SpiritReserveBar
├── PrimaryStats
│   ├── StatRow_Strength
│   ├── StatRow_Agility
│   ├── StatRow_Intellect
│   └── StatRow_Endurance
├── CombatSummary
│   ├── DPSRow_MainSkill
│   ├── AttackSpeedRow
│   ├── CritChanceRow
│   ├── MoveSpeedRow
│   └── ArmorEvasionRow
├── ResistSummary
│   ├── FireResistMini
│   ├── ColdResistMini
│   ├── LightningResistMini
│   ├── PoisonResistMini
│   └── ChaosResistMini
└── DetailButton
```

### 5.2 显示规则

1. 个人信息栏默认显示压缩数据，不显示全部公式。
2. 点击“详细”打开完整属性页。
3. 数值提高显示绿色箭头，降低显示红色箭头。
4. 抗性低于推荐值时显示黄/红警告边框。
5. 当前主技能 DPS 根据技能栏中绑定到主攻击键的技能计算。

## 6. 中间装备栏布局

整备界面默认在中间展示角色模型和装备槽，右侧展示背包。

```text
UI_EquipmentPanel.prefab
├── CharacterModelPreview
│   ├── ModelCameraOutput
│   ├── RotateLeftButton
│   ├── RotateRightButton
│   └── PoseSwitchButton
├── GearSlotLayer
│   ├── Slot_Helmet
│   ├── Slot_Amulet
│   ├── Slot_Chest
│   ├── Slot_Gloves
│   ├── Slot_Belt
│   ├── Slot_Boots
│   ├── Slot_Ring_L
│   ├── Slot_Ring_R
│   ├── Slot_Weapon_Main
│   ├── Slot_Weapon_Off
│   ├── Slot_WeaponSwap_Main
│   └── Slot_WeaponSwap_Off
├── GearSetSwitch
│   ├── Button_SetA
│   ├── Button_SetB
│   └── AutoSwitchRuleText
└── EquipmentActionBar
    ├── AutoEquipButton
    ├── UnequipAllButton
    ├── CompareToggle
    └── StatChangePreviewToggle
```

## 7. 技能栏压缩区

在整备主界面底部可以显示“当前绑定技能条”，不用进入技能页也能快速改键。

```text
UI_SkillQuickBar.prefab
├── SkillSlot_LMB
├── SkillSlot_RMB
├── SkillSlot_Q
├── SkillSlot_E
├── SkillSlot_R
├── SkillSlot_F
├── SkillSlot_Space
├── SkillSlot_Ultimate
└── BindingHintText
```

## 8. 右侧背包快速栏

```text
UI_InventoryQuickPanel.prefab
├── Header
│   ├── InventoryTitle
│   ├── CapacityText              // 42/60
│   ├── SortButton
│   └── FilterButton
├── FilterTabs
│   ├── All
│   ├── Equipment
│   ├── Skills
│   ├── Currency
│   ├── Maps
│   └── Quest
├── ItemGridScroll
│   └── GridContent
│       └── UI_ItemSlot.prefab[]
└── Footer
    ├── SellJunkButton
    ├── IdentifyAllButton
    ├── PortalScrollButton
    └── GoldText
```

## 9. 整备界面交互流程

### 9.1 装备物品

```text
背包物品左键点击
→ 如果是装备，选中物品
→ 高亮可放入的装备槽
→ 再次点击装备槽或右键物品
→ 检查等级、属性、职业限制
→ 装备成功
→ 刷新角色属性、技能需求、外观模型
```

### 9.2 拖拽装备

```text
按住物品
→ 生成 DragIcon 到 Canvas_DragLayer
→ 原槽位半透明
→ 鼠标经过目标槽位时显示合法/非法边框
→ 松开
    → 合法：移动/装备/交换
    → 非法：回弹到原位
```

### 9.3 装备比较

```text
悬浮背包装备
→ 查找对应装备槽当前装备
→ 左侧显示当前装备 Tooltip
→ 右侧显示悬浮装备 Tooltip
→ 变化字段逐条标记
→ 总结区显示：伤害 +X%、生命 -Y%、抗性 +Z
```

## 10. 整备界面脚本组件

| 脚本 | 挂载对象 | 用途 |
|---|---|---|
| `UILoadoutRoot` | `UI_LoadoutRoot` | 管理页签、打开关闭、数据刷新 |
| `UITabGroup` | `TopTabs` | 页签切换 |
| `UICharacterInfoCompact` | `CharacterInfoCompact` | 绑定角色概要属性 |
| `UIEquipmentPanel` | `UI_EquipmentPanel` | 管理装备槽 |
| `UIInventoryQuickPanel` | `InventoryQuickPanel` | 背包快速栏 |
| `UISkillQuickBar` | `UI_SkillQuickBar` | 技能快捷槽 |
| `UIStatPreviewController` | `WindowFrame` | 装备变化预览 |
| `UILoadoutHotkeyController` | `UI_LoadoutRoot` | 快捷键响应 |

## 11. 数据绑定

```csharp
class LoadoutViewModel
{
    CharacterSummary Character;
    EquipmentSet CurrentEquipment;
    InventoryModel Inventory;
    SkillBarModel SkillBar;
    CurrencyWallet Wallet;
    List<StatChangePreview> PreviewChanges;
}
```

刷新时机：

1. 打开界面。
2. 装备变更。
3. 技能变更。
4. 物品新增/删除。
5. 属性点变化。
6. 货币变化。
7. 进入/离开安全区。

## 12. 原型验收标准

1. 可以通过 `I/C/K/P/M` 打开不同页签。
2. 装备栏、背包栏、技能栏在同一个整备界面内切换。
3. 物品可以拖拽到装备槽。
4. 悬浮物品显示 Tooltip。
5. 装备比较显示当前装备与目标装备差异。
6. 使用手柄时可以从顶部页签到装备槽、背包格子、底部按钮完整导航。
