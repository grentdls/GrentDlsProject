# 技能栏与技能面板 UI 预制体布局结构说明

> 适用项目：2D / 横版清版动作 RPG  
> 参考方向：DNF 式技能配置 + 横向快捷技能栏  
> 目标：重构战斗 HUD 技能栏与后台技能配置面板，让技能展示、技能更换、技能升级、技能详情都清晰可用。

---

# 1. 总体设计目标

当前技能界面拆成两套，但共用一部分 UI：

```text
1. 战斗界面 HUD 技能栏
2. 后台技能配置面板
```

两者共用核心：

```text
底部横向技能栏
技能槽位按钮
技能图标
技能名称
快捷键图标
技能消耗显示
技能 CD 显示
技能可用 / 不可用 / 冷却 / 资源不足状态
```

区别：

```text
战斗 HUD 技能栏：
主要用于战斗中释放技能，信息要短、快、清晰。

后台技能面板：
主要用于查看技能、配置技能、更换技能、升级技能，需要显示技能树、技能背包、详情、演示。
```

---

# 2. 战斗 HUD 技能栏布局

## 2.1 位置

技能栏放在屏幕中心底部。

```text
Anchor：Bottom Center
Pivot：0.5, 0
位置：屏幕底部向上 24~40 px
```

推荐布局：

```text
┌────────────────────────────────────────────┐
│                                            │
│                                            │
│                                            │
│                                            │
│              [横向技能栏 SkillBar]          │
└────────────────────────────────────────────┘
```

具体位置：

```text
PC：Bottom = 28 px
移动端：Bottom = 36~52 px，避免被系统手势栏挡住
手柄：Bottom = 32 px
```

---

## 2.2 技能栏排列方式

技能 UI 横向排列。

推荐槽位：

```text
普攻槽
跳跃槽，可选
闪避槽，可选
技能 1
技能 2
技能 3
技能 4
绝技槽
```

实际战斗 HUD 推荐显示：

```text
[普攻] [技能1] [技能2] [技能3] [技能4] [绝技]
```

跳跃和闪避可以根据项目操作方式决定是否放入技能栏。  
如果跳跃 / 闪避有独立按钮，则不放在技能栏里。

---

## 2.3 HUD 技能栏结构

Unity 预制体结构建议：

```text
HUD_SkillBar
├── BG_SkillBarFrame
├── Layout_SkillSlots
│   ├── SkillSlot_Attack
│   ├── SkillSlot_01
│   ├── SkillSlot_02
│   ├── SkillSlot_03
│   ├── SkillSlot_04
│   └── SkillSlot_Ultimate
├── EnergyBar_Ultimate，可选
└── InputHintGroup，可选
```

### HUD_SkillBar 组件

```text
RectTransform
CanvasGroup
HorizontalLayoutGroup
ContentSizeFitter，可选
SkillBarHUDController
```

### Layout_SkillSlots 组件

```text
HorizontalLayoutGroup
Child Alignment：Middle Center
Spacing：8~12
Padding：Left 8 / Right 8 / Top 6 / Bottom 6
```

---

# 3. 单个技能槽位按钮结构

## 3.1 技能槽位整体结构

每个技能槽位是一个按钮。

```text
SkillSlotButton
├── BG_RarityFrame
├── BG_SlotBase
├── Icon_Skill
├── EmptyState
│   ├── Icon_EmptySlot
│   └── Text_EmptyHint
├── Text_SkillName_Top
├── CostGroup
│   ├── Icon_CostType
│   └── Text_CostValue
├── CooldownGroup
│   ├── Image_CooldownMask
│   └── Text_CooldownNumber
├── KeyHintGroup
│   ├── BG_KeyHint
│   └── Text_Key
├── StateGroup
│   ├── Image_Locked
│   ├── Image_Disabled
│   ├── Image_ResourceNotEnough
│   └── Image_Selected
├── UpgradeHint，可选
├── NewHint，可选
└── Button
```

---

## 3.2 槽位尺寸

推荐 PC 尺寸：

```text
普通技能槽：96 x 112
普攻槽：96 x 112
绝技槽：116 x 132
```

推荐移动端尺寸：

```text
普通技能槽：104 x 120
绝技槽：124 x 144
```

技能图标尺寸：

```text
普通技能图标：72 x 72
绝技图标：88 x 88
```

槽位顶部需要留技能名称区域：

```text
技能名称高度：18~22 px
图标区域高度：72~88 px
底部快捷键 / 消耗区域：18~24 px
```

---

## 3.3 槽位布局示意

```text
┌────────────────────┐
│     技能名称        │
├────────────────────┤
│                    │
│      技能图标       │
│                    │
│  Key        Cost    │
├────────────────────┤
│      CD / 状态       │
└────────────────────┘
```

详细：

```text
顶部：技能名
中间：大技能图标
图标外圈：稀有度框体 / 技能类型框体
左下角：快捷键小按钮
右下角：消耗
中间覆盖：冷却遮罩和 CD 数字
整体覆盖：禁用 / 锁定 / 资源不足灰态
```

---

# 4. 技能槽位显示规则

## 4.1 已装备技能状态

显示：

```text
技能图标
技能名称
稀有度框体
快捷键
消耗
CD 遮罩
```

示例：

```text
名称：剑气
快捷键：U
消耗：15 MP
CD：6.0s
```

---

## 4.2 未装备状态

当槽位没有装备技能时：

```text
显示空槽位底图
显示槽位类型图标
显示“未装备”或“放入技能”
显示虚线边框或暗色框
```

不同槽位要显示不同提示：

```text
普攻槽：未装备普攻
技能槽：未装备技能
绝技槽：未装备绝技
被动槽：未装备被动
```

结构：

```text
EmptyState
├── Icon_EmptySlotType
└── Text_EmptyHint
```

建议文案：

```text
未装备
拖入技能
点击配置
```

战斗 HUD 中不要显示长文案，只显示：

```text
未装备
```

后台技能面板中可以显示：

```text
拖入技能
```

---

## 4.3 锁定状态

用于：

```text
槽位未解锁
技能等级不足
角色职业不符合
剧情未开启
```

显示：

```text
锁图标
灰色遮罩
提示文本：Lv.5 解锁 / 完成任务解锁
```

---

## 4.4 冷却状态

冷却时：

```text
Image_CooldownMask 使用径向填充或垂直填充
Text_CooldownNumber 显示剩余秒数
技能图标变暗
边框不变
```

显示规则：

```text
CD >= 10 秒：显示整数，比如 12
CD < 10 秒：显示一位小数，比如 4.5
CD < 1 秒：显示 0.9 / 0.8
CD 结束：隐藏遮罩和数字，播放一圈高亮
```

---

## 4.5 资源不足状态

资源不足时：

```text
技能图标变暗
消耗数值变红
按钮可点击但释放失败
点击时播放错误反馈
```

显示：

```text
Image_ResourceNotEnough 半透明红色覆盖
CostGroup 闪烁 1 次
SFX_Error
```

---

## 4.6 可释放状态

可释放时：

```text
图标正常亮度
边框正常
技能名称正常显示
消耗正常颜色
快捷键图标清晰
```

技能刚冷却完成：

```text
播放 Ready 闪光
边框快速高亮 0.3 秒
```

---

# 5. 快捷键图标设计

## 5.1 位置

快捷键图标固定在技能图标左下角。

```text
Anchor：Icon 左下角
Size：22 x 22 或 26 x 26
Offset：X = 2, Y = 2
```

---

## 5.2 结构

```text
KeyHintGroup
├── BG_KeyHint
└── Text_Key
```

---

## 5.3 显示内容

PC：

```text
J
U
I
O
H
Space
```

手柄：

```text
X
RB+X
RB+Y
RB+B
RB+A
LB+RB
```

移动端：

```text
可以隐藏快捷键
或者显示小图标：普攻 / 技能1 / 技能2
```

---

# 6. 技能消耗显示

## 6.1 显示位置

技能消耗放在技能图标右下角或槽位底部右侧。

```text
Anchor：Icon 右下角
```

---

## 6.2 消耗类型

```text
MP
HP
怒气
能量
耐力
妖力
灵力
无消耗
```

---

## 6.3 显示规则

有消耗：

```text
Icon_CostType + Text_CostValue
```

无消耗：

```text
隐藏 CostGroup
```

资源不足：

```text
Text_CostValue 变红
Icon_CostType 轻微闪烁
```

示例：

```text
15
30
100
```

图标用颜色区分：

```text
MP：蓝色水滴
怒气：红色火焰
能量：黄色闪电
耐力：绿色叶片
```

---

# 7. 后台技能面板整体布局

## 7.1 界面目标

后台技能面板用于：

```text
查看职业 / 门派技能链路
查看全部已解锁技能
查看其他方式获得的技能
将技能拖到技能栏
更换技能
查看技能详情
查看技能演示
升级技能
解锁技能
```

---

## 7.2 总体布局

界面分为 4 个大区域：

```text
左上：技能树 / 技能解锁链路
左下：技能背包
右侧：技能详情
底部：当前装备技能栏
```

布局示意：

```text
┌────────────────────────────────────────────────────────────┐
│ 技能面板 SkillPanel                                         │
├─────────────────────────────┬──────────────────────────────┤
│ 左上：技能列表 / 技能链路     │ 右侧：技能详情页面              │
│ SkillTreePanel              │ SkillDetailPanel              │
│                             │                              │
│                             │ [技能演示 Preview]             │
│                             │ 技能名                         │
│                             │ 消耗 / CD / 等级 / 类型         │
├─────────────────────────────┤ 技能描述                       │
│ 左下：技能背包               │ 伤害范围 / 数值                 │
│ SkillInventoryPanel         │ 解锁 / 升级 / 满级按钮          │
├─────────────────────────────┴──────────────────────────────┤
│ 底部：当前装备技能栏 EquippedSkillBar                        │
└────────────────────────────────────────────────────────────┘
```

---

## 7.3 推荐比例

以 1920 x 1080 为基准：

```text
左侧宽度：680
右侧宽度：760~840
中间间距：24
底部技能栏高度：150~180
顶部边距：48
底部边距：32
```

区域划分：

```text
SkillTreePanel：左上，高度约 520
SkillInventoryPanel：左下，高度约 260
SkillDetailPanel：右侧，高度约 800
EquippedSkillBar：底部，高度约 150
```

---

# 8. 后台技能面板预制体结构

Unity 预制体结构建议：

```text
UI_SkillPanel
├── BG_Blocker
├── Panel_Root
│   ├── Header
│   │   ├── Text_Title
│   │   ├── Button_Close
│   │   └── CurrencyGroup，可选
│   ├── Body
│   │   ├── LeftColumn
│   │   │   ├── SkillTreePanel
│   │   │   │   ├── Header_SkillTree
│   │   │   │   ├── ClassTabs
│   │   │   │   └── ScrollView_SkillTree
│   │   │   │       ├── Viewport
│   │   │   │       │   └── Content_SkillTree
│   │   │   │       └── Scrollbar
│   │   │   └── SkillInventoryPanel
│   │   │       ├── Header_SkillBag
│   │   │       ├── FilterTabs
│   │   │       ├── SearchAndSortBar
│   │   │       └── ScrollView_SkillBag
│   │   │           ├── Viewport
│   │   │           │   └── Content_SkillBag
│   │   │           └── Scrollbar
│   │   └── RightColumn
│   │       └── SkillDetailPanel
│   │           ├── SkillPreviewPanel
│   │           ├── SkillNameGroup
│   │           ├── SkillKeyStatsGroup
│   │           ├── SkillDescriptionPanel
│   │           ├── SkillDamageInfoPanel
│   │           ├── SkillUpgradeInfoPanel
│   │           └── SkillActionButtons
│   └── BottomEquippedSkillBar
│       ├── Text_CurrentBuildTitle
│       ├── Layout_EquippedSlots
│       └── Button_Reset / Button_Save，可选
```

---

# 9. 左上：技能列表 / 技能链路面板

## 9.1 功能

左上不是普通列表，而是显示：

```text
门派 / 职业技能
技能解锁链路
技能之间的前置关系
技能槽位限制
技能等级
是否已解锁
是否可升级
```

---

## 9.2 面板结构

```text
SkillTreePanel
├── Header_SkillTree
│   ├── Text_Title：技能链路
│   └── Text_Subtitle：门派 / 职业技能
├── ClassTabs
│   ├── Tab_职业1
│   ├── Tab_职业2
│   └── Tab_通用
└── ScrollView_SkillTree
    └── Content_SkillTree
        ├── SkillTreeNode
        ├── SkillTreeNode
        ├── SkillTreeLine
        └── SkillTreeSlotGroup
```

---

## 9.3 技能链路节点结构

```text
SkillTreeNode
├── Button_Node
│   ├── BG_NodeFrame
│   ├── Icon_Skill
│   ├── Image_Lock
│   ├── Image_CanUpgrade
│   ├── Text_Level
│   └── Image_Selected
├── Text_SkillName
└── SlotLimitTag
```

---

## 9.4 槽位限制显示

每个技能必须标记可放槽位：

```text
普攻槽
技能槽
绝技槽
被动槽
职业专属槽
```

显示在节点下方或角标：

```text
普攻
技能
绝技
被动
```

规则：

```text
普攻只能放到普攻槽位
绝技只能放到绝技槽位
被动不能放主动技能槽
普通技能不能放普攻槽
职业限定技能只能放对应职业角色
```

---

## 9.5 技能链路线

技能节点之间用线连接：

```text
SkillTreeLine
```

线条状态：

```text
未解锁：灰色虚线
已解锁：正常线
可解锁：高亮线
被选中路径：发光线
```

---

## 9.6 技能节点状态

```text
Locked          未解锁
Unlockable      可解锁
Unlocked        已解锁
Equipped        已装备
CanUpgrade      可升级
MaxLevel        满级
Selected        当前选中
```

---

# 10. 左下：技能背包面板

## 10.1 功能

技能背包显示所有已获得技能：

```text
职业技能
门派技能
任务获得技能
怪物掉落技能
副本获得技能
特殊技能书获得技能
活动技能
```

这里不一定按链路显示，而是像背包一样按图标列表显示。

---

## 10.2 面板结构

```text
SkillInventoryPanel
├── Header_SkillBag
│   ├── Text_Title：技能背包
│   └── Text_Count：已获得 32/80
├── FilterTabs
│   ├── Tab_All
│   ├── Tab_NormalSkill
│   ├── Tab_Attack
│   ├── Tab_Ultimate
│   ├── Tab_Passive
│   └── Tab_Other
├── SearchAndSortBar
│   ├── Input_Search
│   └── Dropdown_Sort
└── ScrollView_SkillBag
    └── Content_SkillBag
        ├── SkillBagItem
        ├── SkillBagItem
        └── SkillBagItem
```

---

## 10.3 技能背包布局方式

推荐使用网格布局。

```text
GridLayoutGroup
Cell Size：72 x 84
Spacing：8 x 8
Constraint：Fixed Column Count
Column Count：6~8
```

每个技能物品：

```text
SkillBagItem
├── Button
├── BG_RarityFrame
├── Icon_Skill
├── Text_Level
├── Image_EquippedMark
├── Image_Locked，可选
├── Image_New
└── SlotTypeMiniTag
```

---

## 10.4 技能背包交互

支持：

```text
点击技能：右侧显示详情
双击技能：自动装备到可用槽位
拖拽技能：拖到下方技能栏槽位
右键技能：弹出操作菜单
长按技能：移动端显示详情
```

操作菜单：

```text
装备
卸下
查看
升级
锁定
```

---

# 11. 右侧：技能详情页面

## 11.1 功能

右侧显示当前选中技能的完整信息。

包括：

```text
技能演示
技能名称
技能类型
技能等级
技能消耗
技能 CD
释放范围
伤害范围
伤害数值
技能描述
解锁条件
升级消耗
操作按钮
```

---

## 11.2 详情面板结构

```text
SkillDetailPanel
├── SkillPreviewPanel
│   ├── BG_PreviewFrame
│   ├── PreviewViewport
│   │   └── PreviewSpriteAnimator
│   ├── Button_PlayPause，可选
│   ├── Button_Speed，可选
│   └── Text_PreviewHint：技能演示
├── SkillNameGroup
│   ├── Icon_SkillLarge
│   ├── Text_SkillName
│   ├── Text_SkillLevel
│   └── Tag_SkillType
├── SkillKeyStatsGroup
│   ├── Stat_Cost
│   ├── Stat_CD
│   ├── Stat_CastRange
│   ├── Stat_DamageType
│   └── Stat_SlotType
├── SkillDescriptionPanel
│   ├── Text_DescriptionTitle
│   └── Text_Description
├── SkillDamageInfoPanel
│   ├── Text_DamageTitle
│   ├── Text_DamageFormula
│   ├── Text_HitRange
│   ├── Text_HitCount
│   └── Text_Effect
├── SkillUpgradeInfoPanel
│   ├── Text_UnlockCondition
│   ├── Text_UpgradeCost
│   ├── Text_NextLevelPreview
│   └── MaterialCostList
└── SkillActionButtons
    ├── Button_Equip
    ├── Button_Upgrade
    ├── Button_Unlock
    └── Button_MaxLevel
```

---

## 11.3 技能演示区域

### 位置

详情页面最上方。

```text
Height：240~320
```

### 功能

```text
直接播放技能序列帧
纯表演向
循环播放
不显示伤害框
不显示复杂 UI
可以带技能特效
可以带假人目标，可选
```

### 结构

```text
SkillPreviewPanel
├── BG_PreviewFrame
├── PreviewViewport
│   ├── CharacterPreviewRoot
│   ├── SkillVFXPreviewRoot
│   └── DummyTarget，可选
├── Text_PreviewHint
└── PreviewControls，可选
```

---

## 11.4 技能演示播放规则

默认：

```text
打开详情后自动播放
循环播放
优先播放当前角色配置中该技能 BoundActionId 对应动作的角色动画序列帧
如果角色动作动画缺失，再回退到动作帧事件 VFX 序列帧
如果 VFX 也缺失，则回退技能图标
播放速度 1.0
```

如果技能是多段：

```text
按完整释放流程播放：
起手 → 释放 → 命中特效 → 收招
```

如果技能是投射物：

```text
演示角色释放
投射物飞出
命中特效出现
回到开始循环
```

如果技能是 Buff：

```text
演示角色施法
角色身上出现 Buff 光效
光效持续 1 秒
循环
```

如果技能是被动：

```text
可以播放一个简化展示：
角色站立 + 被动光环
或者显示被动图标动画
```

---

# 12. 技能详情数值显示

## 12.1 关键数值区

`SkillKeyStatsGroup` 显示短信息，避免玩家翻描述。

推荐字段：

```text
消耗
冷却
类型
槽位
范围
段数
元素
```

布局：

```text
┌────────┬────────┬────────┐
│ 消耗15 │ CD 6s  │ 近战   │
├────────┼────────┼────────┤
│ 技能槽 │ 范围3m │ 3段    │
└────────┴────────┴────────┘
```

---

## 12.2 技能描述区

技能描述要分两层：

```text
1. 简短描述：玩家能快速理解技能作用
2. 详细数值：策划和深度玩家能看明白
```

示例：

```text
向前挥出一道剑气，对路径上的敌人造成伤害并轻微击退。
```

详细数值：

```text
造成 180% 攻击力物理伤害。
命中后造成 0.35 秒硬直。
击退距离 1.2。
最多命中 5 个敌人。
```

---

## 12.3 伤害范围显示

需要明确：

```text
攻击范围形状
攻击范围大小
攻击高度
是否可命中倒地
是否可命中空中
是否多段命中
```

显示文案示例：

```text
范围：前方矩形 3.5m x 1.2m
高度：中段
命中：地面 / 空中
段数：1
击退：中
```

---

# 13. 技能操作按钮

## 13.1 按钮状态

根据技能状态显示不同按钮：

```text
未解锁：显示【解锁】
已解锁未装备：显示【装备】
已装备：显示【卸下】
可升级：显示【升级】
满级：显示【已满级】
材料不足：显示【材料不足】
等级不足：显示【等级不足】
```

---

## 13.2 按钮结构

```text
SkillActionButtons
├── Button_Unlock
├── Button_Equip
├── Button_Unequip
├── Button_Upgrade
└── Button_MaxLevel
```

同一时间只显示最相关的 1~2 个按钮。

推荐优先级：

```text
未解锁 → 解锁
已解锁未装备 → 装备 + 升级
已装备 → 卸下 + 升级
满级 → 已满级
```

---

# 14. 底部：当前装备技能栏

## 14.1 功能

后台技能面板底部也显示技能栏。

作用：

```text
显示当前装备技能
配置技能
拖拽更换技能
检查快捷键
检查槽位类型
保存技能方案
```

---

## 14.2 结构

```text
BottomEquippedSkillBar
├── Text_CurrentBuildTitle：当前技能配置
├── Layout_EquippedSlots
│   ├── Slot_Attack
│   ├── Slot_Skill_01
│   ├── Slot_Skill_02
│   ├── Slot_Skill_03
│   ├── Slot_Skill_04
│   └── Slot_Ultimate
├── Button_ResetBuild
└── Button_SaveBuild，可选
```

---

## 14.3 槽位限制

每个槽位有类型：

```text
AttackSlot
SkillSlot
UltimateSlot
PassiveSlot，可选
```

拖拽规则：

```text
普攻技能只能放 AttackSlot
普通主动技能只能放 SkillSlot
绝技只能放 UltimateSlot
被动技能只能放 PassiveSlot
不符合时显示红色边框和错误提示
```

错误提示：

```text
该技能不能放入普攻槽
该技能只能放入绝技槽
该职业无法使用该技能
该技能未解锁
```

---

## 14.4 拖拽交互

从技能背包拖技能到底部槽位：

```text
拖起：技能图标跟随鼠标
经过可用槽位：槽位绿色高亮
经过不可用槽位：槽位红色高亮
松手：装备技能
```

从技能树节点拖技能到底部槽位：

```text
如果技能已解锁，允许拖拽
如果未解锁，只显示详情，不允许装备
```

从底部技能栏拖到空白处：

```text
卸下技能
```

从一个槽位拖到另一个槽位：

```text
如果槽位类型兼容，交换
如果不兼容，提示错误
```

---

# 15. 技能栏与技能面板共用预制体

为了避免重复开发，建议把技能槽位做成通用预制体：

```text
UI_SkillSlotButton.prefab
```

然后两个地方都用：

```text
战斗 HUD：HUD_SkillBar 使用 UI_SkillSlotButton
后台面板：BottomEquippedSkillBar 使用 UI_SkillSlotButton
技能背包：可以使用轻量版 UI_SkillBagItem
技能树：使用 UI_SkillTreeNode
```

---

## 15.1 通用技能槽位预制体

```text
UI_SkillSlotButton
├── SlotRoot
│   ├── Image_RarityFrame
│   ├── Image_SlotBG
│   ├── Image_SkillIcon
│   ├── Text_SkillName
│   ├── KeyHintGroup
│   ├── CostGroup
│   ├── CooldownGroup
│   ├── StateOverlayGroup
│   └── DragDropReceiver
```

脚本：

```text
SkillSlotView
SkillSlotDragReceiver
SkillCooldownView
SkillCostView
SkillStateView
```

---

# 16. Unity 控件与组件建议

## 16.1 必用控件

```text
Canvas
Panel
Image
Button
TextMeshProUGUI
ScrollRect
Scrollbar
GridLayoutGroup
HorizontalLayoutGroup
VerticalLayoutGroup
ContentSizeFitter
CanvasGroup
Mask / RectMask2D
InputField，可选
Dropdown，可选
```

---

## 16.2 技能栏控件

```text
HorizontalLayoutGroup
Button
Image
TextMeshProUGUI
CanvasGroup
EventTrigger / IPointerClickHandler
IBeginDragHandler
IDragHandler
IEndDragHandler
IDropHandler
```

---

## 16.3 技能树控件

```text
ScrollRect
RectTransform
Button
Image
LineRenderer 或 UI Image 线段
Grid / 自定义节点布局
```

技能树线条建议：

```text
第一版用 Image 拉伸画线
后期可做贝塞尔线
```

---

## 16.4 技能演示控件

技能演示可以用两种方案。

### 方案 A：UI Image 播序列帧

适合纯 UI 预览。

```text
Image PreviewSprite
SkillPreviewSpritePlayer
```

优点：

```text
简单
不需要生成实际角色
适合播放纯序列帧
```

缺点：

```text
不能很好显示复杂粒子
```

### 方案 B：RenderTexture 小场景

适合带粒子、假人、投射物。

```text
PreviewCamera
RenderTexture
RawImage
PreviewSceneRoot
```

优点：

```text
能展示角色 + 特效 + 投射物 + 假人
效果最好
```

缺点：

```text
实现稍复杂
```

第一版推荐：

```text
先用 UI Image 播序列帧。
```

后期升级：

```text
RenderTexture 预览场景。
```

---

# 17. 数据绑定结构

## 17.1 SkillData

```text
SkillID
SkillName
SkillIcon
SkillType
SlotType
Level
MaxLevel
IsUnlocked
IsEquipped
Cooldown
CostType
CostValue
Description
DamageDescription
PreviewAnimation
SkillConfig
```

---

## 17.2 SkillSlotData

```text
SlotID
SlotType
ShortcutKey
EquippedSkillID
IsUnlocked
UnlockCondition
```

---

## 17.3 SkillTreeNodeData

```text
NodeID
SkillID
Position
ParentNodeIDs
IsUnlocked
CanUnlock
CanUpgrade
RequiredLevel
RequiredItems
SlotType
```

---

## 17.4 SkillInventoryData

```text
UnlockedSkills
ObtainedSkills
ExtraSkills
NewSkillIDs
EquippedSkillIDs
```

---

# 18. 技能槽位类型

## 18.1 SlotType 枚举

```text
None
NormalAttack
ActiveSkill
Ultimate
Passive
ClassOnly
Special
```

---

## 18.2 SkillType 枚举

```text
NormalAttack
Active
Ultimate
Passive
Buff
Movement
Summon
Special
```

---

## 18.3 装备合法性判断

```text
NormalAttack 只能装到 NormalAttack 槽
Active 可以装到 ActiveSkill 槽
Ultimate 只能装到 Ultimate 槽
Passive 只能装到 Passive 槽
Movement 技能视设计可装到 ActiveSkill 或专属槽
ClassOnly 需要检查职业
```

---

# 19. 技能面板交互流程

## 19.1 点击技能树节点

```text
点击 SkillTreeNode
→ 右侧显示技能详情
→ 顶部演示开始播放
→ 如果未解锁，显示解锁条件和解锁按钮
→ 如果已解锁，显示装备 / 升级按钮
```

---

## 19.2 点击技能背包物品

```text
点击 SkillBagItem
→ 右侧显示技能详情
→ 如果已装备，底部对应槽位高亮
→ 如果未装备，显示装备按钮
```

---

## 19.3 点击底部技能槽

```text
点击已装备槽
→ 右侧显示该技能详情
→ 槽位高亮
→ 可点击卸下
```

点击空槽：

```text
右侧显示槽位说明
左下技能背包自动筛选可放入技能
```

---

## 19.4 拖拽配置技能

```text
从技能背包拖到槽位
→ 判断槽位类型
→ 判断是否已解锁
→ 判断职业是否匹配
→ 合法则装备
→ 不合法则回弹
```

---

## 19.5 双击快捷装备

```text
双击技能背包里的技能
→ 自动找到第一个合法空槽
→ 如果没有空槽，弹出替换选择
```

---

# 20. HUD 与后台技能栏同步

## 20.1 同步规则

后台技能栏配置变化后：

```text
保存配置
→ 更新 PlayerSkillLoadout
→ 战斗 HUD 读取最新技能槽
→ HUD 技能图标刷新
→ 快捷键刷新
→ 冷却状态保持或重置，按设计
```

---

## 20.2 冷却保留规则

推荐：

```text
同一个技能仍在技能栏：保留当前 CD
技能被替换下：CD 暂停或清除
新技能装入：从可用状态开始
战斗中禁止更换技能，可避免复杂问题
```

后台面板通常：

```text
非战斗状态才能改技能
```

---

# 21. 技能栏状态表现

## 21.1 普通状态

```text
图标正常
名称显示
快捷键显示
消耗显示
边框按稀有度显示
```

---

## 21.2 鼠标悬停

```text
槽位放大 5%
边框高亮
弹出简易 Tooltip
```

Tooltip 内容：

```text
技能名称
等级
消耗
CD
简短描述
```

---

## 21.3 选中状态

后台面板中：

```text
选中槽位显示蓝色或金色描边
右侧显示技能详情
```

---

## 21.4 拖拽可放入状态

```text
绿色发光边框
槽位轻微放大
显示“可装备”
```

---

## 21.5 拖拽不可放入状态

```text
红色边框
槽位震动
显示“不匹配”
```

---

# 22. 技能详情页面文本规则

## 22.1 技能名称

格式：

```text
技能名 Lv.等级
```

示例：

```text
疾风剑气 Lv.3
```

---

## 22.2 消耗与 CD

格式：

```text
消耗：15 灵力
冷却：6.0 秒
```

---

## 22.3 伤害描述

格式：

```text
伤害：造成 180% 攻击力的物理伤害
范围：前方 3.5 米直线
命中：最多 5 个敌人
效果：轻微击退
```

---

## 22.4 升级预览

格式：

```text
下一级：
伤害 180% → 205%
冷却 6.0s → 5.6s
消耗 15 → 18
```

---

# 23. 技能面板美术层级

## 23.1 推荐层级

```text
背景遮罩
主面板底图
区域框体
技能节点线
技能节点
技能图标
状态遮罩
文字
弹窗 / Tooltip
拖拽图标
```

---

## 23.2 颜色建议

```text
普通技能：蓝白
物理技能：橙黄
法术技能：蓝紫
绝技：金色 / 红金
被动：绿色 / 青色
未解锁：灰色
可升级：金色小箭头
已装备：蓝色角标
```

---

# 24. 响应式适配

## 24.1 PC 版

```text
技能栏居中底部
鼠标悬停显示 Tooltip
支持拖拽
支持双击装备
支持右键菜单
```

---

## 24.2 手柄版

```text
技能树和技能背包支持焦点导航
底部技能栏支持左右切换槽位
A 确认
B 返回
X 装备 / 卸下
Y 升级
RB / LB 切换分类
```

---

## 24.3 移动端

```text
技能栏更大
技能面板左右区域可改为分页
拖拽和点击都支持
长按显示详情
底部技能栏保持可见
```

移动端技能面板建议分页：

```text
页签 1：技能链路
页签 2：技能背包
页签 3：技能详情
底部技能栏始终显示
```

---

# 25. 预制体清单

## 25.1 主要预制体

```text
UI_HUD_SkillBar.prefab
UI_SkillPanel.prefab
UI_SkillSlotButton.prefab
UI_SkillTreeNode.prefab
UI_SkillTreeLine.prefab
UI_SkillBagItem.prefab
UI_SkillDetailPanel.prefab
UI_SkillPreviewPanel.prefab
UI_SkillTooltip.prefab
UI_SkillDragIcon.prefab
```

---

## 25.2 脚本清单

```text
HUDSkillBarView
SkillPanelView
SkillSlotButtonView
SkillTreePanelView
SkillTreeNodeView
SkillInventoryPanelView
SkillBagItemView
SkillDetailPanelView
SkillPreviewPlayer
SkillDragController
SkillTooltipController
SkillLoadoutController
SkillEquipValidator
SkillCooldownView
SkillCostView
```

---

# 26. 技能栏数据刷新逻辑

## 26.1 HUD 刷新

```text
OnSkillLoadoutChanged
→ 遍历所有技能槽
→ 读取 SlotData
→ 查找 SkillData
→ 刷新图标 / 名称 / 快捷键 / 消耗 / CD
→ 设置槽位状态
```

---

## 26.2 CD 刷新

每帧或固定间隔：

```text
读取 SkillRuntimeCooldown
→ 更新 CooldownMask.fillAmount
→ 更新 CooldownNumber
→ CD 结束播放 Ready 动画
```

---

## 26.3 资源刷新

当 MP / 怒气变化：

```text
遍历技能槽
→ 判断资源是否足够
→ 更新 CostGroup 颜色
→ 更新 ResourceNotEnough 遮罩
```

---

# 27. 技能装备合法性规则

## 27.1 判断流程

```text
1. 技能是否存在
2. 技能是否已解锁
3. 技能是否属于当前角色可用职业
4. 技能槽位类型是否匹配
5. 技能是否已经装备在其他槽
6. 是否允许重复装备
7. 是否满足等级条件
8. 是否满足前置技能条件
```

---

## 27.2 重复装备规则

推荐：

```text
主动技能不能重复装备
被动技能不能重复装备
普攻槽只能装备一个普攻
绝技槽只能装备一个绝技
```

---

# 28. MVP 开发范围

第一版必须做：

```text
战斗 HUD 底部横向技能栏
通用技能槽位按钮
技能图标 / 名称 / 快捷键 / 消耗 / CD
后台技能面板
左上技能链路
左下技能背包
右侧技能详情
技能演示循环播放
底部当前装备技能栏
点击技能显示详情
拖拽技能到槽位
槽位类型校验
解锁 / 升级 / 满级按钮状态
```

第一版可以暂不做：

```text
复杂技能树贝塞尔线
手柄完整焦点导航
移动端分页布局
RenderTexture 技能演示
多套技能方案
技能搜索
技能排序
右键菜单
```

---

# 29. 验收标准

## 29.1 HUD 技能栏验收

```text
技能栏位于屏幕中心底部
技能横向排列
每个技能有大图标
每个技能顶部有名字
每个技能左下角有快捷键图标
每个技能显示消耗
每个技能显示 CD
资源不足有明显提示
CD 完成有可释放反馈
```

---

## 29.2 后台技能面板验收

```text
打开技能面板后，底部显示当前装备技能栏
左上显示技能链路
左下显示技能背包
右侧显示技能详情
点击任何技能，右侧详情刷新
技能演示会循环播放
技能描述包含消耗、CD、范围、伤害
未解锁显示解锁按钮
可升级显示升级按钮
满级显示已满级状态
```

---

## 29.3 配置交互验收

```text
技能可以从技能背包拖到底部槽位
技能可以从技能链路拖到底部槽位
普攻不能放入普通技能槽
普通技能不能放入普攻槽
绝技不能放入普通技能槽
错误放置有提示
装备后 HUD 技能栏同步更新
```

---

# 30. 总结

这次技能 UI 重构的核心是：

```text
战斗 HUD 技能栏固定在屏幕中心底部
技能槽位横向排列
每个技能槽位采用“大图标 + 顶部名字 + 框体 + 快捷键 + 消耗 + CD”
后台技能面板用于配置技能
后台左上显示技能链路
后台左下显示技能背包
后台右侧显示技能详情和技能演示
后台底部保留当前装备技能栏
```

最终玩家流程：

```text
打开技能面板
查看左上职业技能链路
在左下技能背包找到已解锁技能
点击技能看右侧详情和演示
拖到下方技能栏对应槽位
保存配置
回到战斗 HUD 后底部技能栏同步显示
```

---

# 31. 技能详情页最新结构规则

后台技能页右侧详情面板统一使用新结构：

```text
SkillDetailPanel
├─ SkillPreviewPanel
│  ├─ Text_PreviewHint
│  └─ PreviewViewport
├─ PageTitle
├─ DetailStats
├─ SkillDetailSummaryPanel
│  └─ PageBody
└─ SkillActionButtons
```

规则：

- `SkillPreviewPanel` 必须放在详情页顶部，用于循环播放当前技能绑定动作的角色序列帧。
- `Text_PreviewHint` 显示预览状态，例如帧数、FPS、未找到动作序列帧时的图标兜底提示。
- `SkillDetailSummaryPanel/PageBody` 是唯一的技能正文摘要入口，显示技能状态、装备状态、战斗参数和预览规则。
- 旧节点 `DescriptionTitle`、`PageBodyPanel`、`SkillDamageInfoPanel`、`SkillUpgradeInfoPanel` 不再作为主界面生成；旧覆盖体中如果仍存在这些节点，运行时必须隐藏。
- UI 生成器后续重建技能页时，应直接生成新结构，不再生成旧详情块。
- 运行时绑定优先级必须先查找 `SkillDetailSummaryPanel/PageBody`，只有旧覆盖体缺少新节点时才允许回退到 `PageBodyPanel/PageBody`。

验收：

- 点击技能后，右侧详情页顶部可以看到序列帧预览区域。
- 有绑定动作序列帧时预览循环播放角色动作帧。
- 没有绑定动作序列帧时显示技能图标兜底，并给出中文提示。
- 旧详情块不会占用布局，也不会覆盖新的中文摘要。