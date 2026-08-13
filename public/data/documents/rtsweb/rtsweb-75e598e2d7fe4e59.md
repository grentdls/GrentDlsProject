# 机械阵营改造页面 UI 预制体布局结构说明

## 一、整体目标

当前机械阵营改造页面需要重做为：

```text
屏幕中下方显示一个横向改造列表区域。
每个改造模块是独立卡片。
卡片上方显示改造名称。
卡片中间显示改造图片。
卡片底部显示改造消耗 ICON + 数字。
无法进行改造时必须有清楚提醒。
改造列表可以左右滑动。
鼠标悬停 / 点击 / 手机长按后显示改造信息 Tips。
页面不能全屏，不能影响战场视野。
```

该文档用于指导程序制作 Unity UI 预制体。

---

# 二、整体位置规则

## 2.1 改造面板位置

机械改造页面固定在：

```text
屏幕中下方
```

推荐锚点：

```text
Anchor：Bottom Center
Pivot：0.5, 0
```

推荐位置：

```text
距离屏幕底部：80~120px
```

如果底部有技能按钮或操作栏：

```text
改造面板应位于技能按钮上方 20~30px。
```

---

## 2.2 PC端尺寸

```text
宽度：900~1120px
高度：300~360px
距离底部：70px
```

---

## 2.3 手机端尺寸

```text
宽度：屏幕宽度 90%
高度：310~380px
距离底部：技能区上方 20px
```

---

# 三、Prefab 总结构

```text
UI_ModifyPanel
├── Panel_Background
├── Header_Area
│   ├── Text_Title
│   ├── Text_SelectedTarget
│   └── Button_Close
├── Slot_Area
│   ├── Text_SlotTitle
│   ├── ModifySlotScrollView
│   │   └── Viewport
│   │       └── ModifySlotContent
│   │           ├── ModifySlot_Item
│   │           ├── ModifySlot_Item
│   │           └── ModifySlot_Item
│   └── Text_ModifyCount
├── Category_Area
│   └── CategoryScrollView
│       └── Viewport
│           └── CategoryContent
│               ├── Btn_Category_All
│               ├── Btn_Category_Weapon
│               ├── Btn_Category_Armor
│               ├── Btn_Category_Power
│               ├── Btn_Category_Energy
│               ├── Btn_Category_AI
│               └── Btn_Category_Special
├── ModifyList_Area
│   ├── Button_PageLeft
│   ├── ModifyScrollView
│   │   └── Viewport
│   │       └── ModifyContent
│   │           ├── ModifyCard_Item
│   │           ├── ModifyCard_Item
│   │           └── ModifyCard_Item
│   ├── Button_PageRight
│   └── Scroll_ProgressBar
├── ModifyProgress_Area
│   ├── Text_ProgressTitle
│   ├── Image_ModifyIcon
│   ├── Text_ModifyName
│   ├── Image_ProgressBG
│   ├── Image_ProgressFill
│   ├── Text_RemainTime
│   └── Button_CancelModify
├── TipAnchor_Area
│   └── ModifyInfoTooltip
├── ModifyConfirmPopup
└── Input_Blocker_Optional
```

---

# 四、上下结构说明

最终面板从上到下分为 6 个主要区域：

```text
1. Header_Area：标题区
2. Slot_Area：当前改造槽位区
3. Category_Area：改造分类栏
4. ModifyList_Area：横向改造列表区
5. Scroll_ProgressBar：列表滑动位置提示
6. ModifyProgress_Area：改造进度区
```

整体结构示意：

```text
┌────────────────────────────────────────────────────┐
│ Header：机械改造 / 当前目标 / 关闭按钮              │
├────────────────────────────────────────────────────┤
│ Slot：当前槽位 [武器槽] [装甲槽] [能源槽]  改造1/2  │
├────────────────────────────────────────────────────┤
│ Category：全部 武器 装甲 动力 能源 AI 特殊          │
├────────────────────────────────────────────────────┤
│ ModifyList：横向改造列表                            │
│ ← [改造卡][改造卡][改造卡][改造卡] →                │
├────────────────────────────────────────────────────┤
│ Progress：当前改造进度 / 剩余时间 / 取消            │
└────────────────────────────────────────────────────┘
```

---

# 五、根节点：UI_ModifyPanel

## 5.1 用途

```text
整个机械改造页面根节点。
负责显示、隐藏、滑入动画。
```

## 5.2 推荐组件

```text
RectTransform
CanvasGroup
Animator / DOTween
```

## 5.3 动画规则

显示：

```text
从下方轻微上滑 16px
透明度 0 → 1
缩放 0.96 → 1
时间 0.18秒
```

隐藏：

```text
向下滑出 16px
透明度 1 → 0
时间 0.15秒
```

---

# 六、背景层：Panel_Background

## 6.1 用途

```text
承载整个改造面板的视觉底板。
```

## 6.2 样式

```text
半透明深蓝黑底
轻微电蓝描边
软阴影
圆角 18px
带细微电路纹理
```

## 6.3 推荐颜色

```text
背景：#1A2430
透明度：88%
边框：#32B7FF
高亮：#55D6FF
警告：#FF9A3D
危险：#FF4F4F
```

---

# 七、顶部标题区：Header_Area

## 7.1 结构

```text
Header_Area
├── Text_Title
├── Text_SelectedTarget
└── Button_Close
```

## 7.2 位置

```text
面板最上方
高度：32~40px
```

---

## 7.3 Text_Title

显示：

```text
机械改造
```

或根据对象显示：

```text
单位改造
建筑改造
机甲改造
炮台改造
```

样式：

```text
左对齐
字号：16~18
加粗
颜色：电蓝白
```

---

## 7.4 Text_SelectedTarget

显示当前被改造对象。

示例：

```text
当前目标：主战坦克
当前目标：机械狗
当前目标：重装工厂
当前目标：导弹塔
```

简化显示：

```text
主战坦克
重装工厂
```

样式：

```text
标题右侧
字号：12~14
颜色：次级文字色
```

---

## 7.5 Button_Close

```text
位置：右上角
图标：X
功能：关闭改造面板
```

手机端可选：

```text
如果使用系统返回键关闭，可以隐藏关闭按钮。
```

---

# 八、改造槽位区：Slot_Area

## 8.1 作用

Slot_Area 用于显示当前对象已经拥有的改造槽位。

玩家必须一眼看清：

```text
当前对象可以改哪些槽。
哪些槽已经安装模块。
哪些槽还是空的。
当前改造次数是多少。
是否已经达到最大改造次数。
```

---

## 8.2 Slot_Area 结构

```text
Slot_Area
├── Text_SlotTitle
├── ModifySlotScrollView
│   └── Viewport
│       └── ModifySlotContent
│           ├── ModifySlot_Item
│           ├── ModifySlot_Item
│           └── ModifySlot_Item
└── Text_ModifyCount
```

---

## 8.3 位置与尺寸

```text
位置：Header_Area 下方
高度：58~76px
```

PC端：

```text
高度：64~76px
```

手机端：

```text
高度：58~70px
```

---

## 8.4 Text_SlotTitle

显示：

```text
改造槽
```

或：

```text
当前槽位
```

样式：

```text
字号：12~14
颜色：次级文字色
```

---

## 8.5 Text_ModifyCount

显示当前改造次数。

单位和建筑默认：

```text
最大改造 2 次
```

显示格式：

```text
改造次数：0 / 2
改造次数：1 / 2
改造次数：2 / 2
```

如果对象允许更多：

```text
改造次数：2 / 3
```

状态颜色：

```text
未满：电蓝
已满：橙红
```

---

# 九、槽位项：ModifySlot_Item

## 9.1 ModifySlot_Item 结构

```text
ModifySlot_Item
├── Image_SlotBG
├── Text_SlotName
├── Image_InstalledModuleIcon
├── Text_InstalledModuleName
├── Image_EmptyIcon
├── Image_LockIcon
├── Image_SelectedSlotBorder
└── Button_ClickArea
```

---

## 9.2 槽位类型

单位常用槽位：

```text
武器槽
装甲槽
动力槽
能源槽
感知槽
AI槽
特殊槽
```

建筑常用槽位：

```text
结构槽
生产槽
防御槽
能源槽
电路槽
雷达槽
维修槽
飞行槽
自毁槽
特殊槽
```

---

## 9.3 槽位状态

### 空槽

显示：

```text
槽位名
空
虚线边框
```

### 已安装

显示：

```text
槽位名
模块图标
模块短名
```

### 锁定

显示：

```text
锁图标
Text_InstalledModuleName：未解锁
```

### 当前选中槽

显示：

```text
电蓝高亮边框
```

### 将被替换

显示：

```text
橙色边框
模块图标轻微闪烁
```

---

## 9.4 点击槽位

点击槽位后：

```text
筛选出该槽位可安装的模块。
ModifyList_Area 切换到对应分类。
已安装模块显示详情 Tips。
```

---

# 十、分类栏：Category_Area

## 10.1 结构

```text
Category_Area
└── CategoryScrollView
    └── Viewport
        └── CategoryContent
            ├── Btn_Category_All
            ├── Btn_Category_Weapon
            ├── Btn_Category_Armor
            ├── Btn_Category_Power
            ├── Btn_Category_Energy
            ├── Btn_Category_AI
            └── Btn_Category_Special
```

---

## 10.2 位置

```text
Slot_Area 下方
高度：36~44px
```

---

## 10.3 基础分类

```text
全部
武器
装甲
动力
能源
AI
特殊
```

可选扩展：

```text
雷达
生产
维修
建筑
高危
已安装
```

---

## 10.4 分类定义

### 全部

```text
显示当前单位 / 建筑可用的全部改造模块。
```

### 武器

```text
改变攻击方式、提升伤害、解锁武器技能的模块。
```

示例：

```text
穿甲炮
高爆炮
速射炮
导弹挂架
电磁炮
火焰喷射器
```

### 装甲

```text
提升生命、防御、抗性、护盾、生存能力的模块。
```

示例：

```text
复合装甲
反爆装甲
能量护盾
生存加固
重型外骨骼
```

### 动力

```text
提升移动、转向、飞行、两栖、部署能力的模块。
```

示例：

```text
涡轮推进
履带强化
喷气背包
飞行部件
两栖推进器
```

### 能源

```text
影响电力、能耗、过载、充能、供能效率的模块。
```

示例：

```text
高效电容
备用电池
过载核心
反应堆副核
节能回路
```

### AI

```text
改变自动行为、目标选择、技能释放、战术逻辑的模块。
```

示例：

```text
火控AI
自动维修AI
防空优先AI
集火协议
自动闪避协议
```

### 特殊

```text
改变单位或建筑基础规则的高影响模块。
```

示例：

```text
自爆部件
飞行建筑核心
建筑移动核心
灵能核心
隐形发生器
```

---

## 10.5 分类按钮结构

```text
Btn_Category_xxx
├── Image_BG
├── Image_Icon
├── Text_Name
├── Image_SelectedLine
└── Image_NewDot
```

---

## 10.6 分类按钮状态

### 普通状态

```text
暗色底
白色文字
无高亮线
```

### 选中状态

```text
电蓝底
文字变亮
底部显示 Image_SelectedLine
```

### 无内容状态

```text
灰色
不可点击
```

### 有新模块状态

```text
右上角显示 Image_NewDot
```

---

# 十一、改造列表区：ModifyList_Area

## 11.1 结构

```text
ModifyList_Area
├── Button_PageLeft
├── ModifyScrollView
│   └── Viewport
│       └── ModifyContent
│           ├── ModifyCard_Item
│           ├── ModifyCard_Item
│           └── ModifyCard_Item
├── Button_PageRight
└── Scroll_ProgressBar
```

---

## 11.2 位置

```text
Category_Area 下方
占据面板主体区域
高度：145~175px
```

---

## 11.3 横向滑动

ScrollRect 设置：

```text
Horizontal = true
Vertical = false
Movement Type = Elastic 或 Clamped
```

手机端：

```text
手指左右滑动改造列表。
```

PC端：

```text
鼠标滚轮 / 鼠标拖拽 / 左右翻页按钮。
```

---

## 11.4 左右翻页按钮

```text
Button_PageLeft
Button_PageRight
```

功能：

```text
每次点击横向移动一屏或半屏。
```

显示规则：

```text
在最左侧时，左按钮隐藏或灰显。
在最右侧时，右按钮隐藏或灰显。
```

---

## 11.5 滑动进度条

```text
Scroll_ProgressBar
```

位置：

```text
改造列表底部
```

表现：

```text
细线
显示当前滑动位置
手机端使用短进度条，不使用粗滚动条
```

---

# 十二、改造卡片：ModifyCard_Item

## 12.1 重要性

改造卡片是机械改造页面最重要的交互单元。

每个改造模块必须是独立卡片。

---

## 12.2 ModifyCard_Item 结构

```text
ModifyCard_Item
├── Image_CardBG
├── Text_ModifyName
├── Image_ModifyPreview
├── SlotTag_Area
│   ├── Image_SlotIcon
│   └── Text_SlotType
├── Cost_Area
│   ├── CostItem_Gold
│   │   ├── Image_Icon
│   │   └── Text_Value
│   ├── CostItem_Metal
│   │   ├── Image_Icon
│   │   └── Text_Value
│   ├── CostItem_Power
│   │   ├── Image_Icon
│   │   └── Text_Value
│   └── CostItem_Special
│       ├── Image_Icon
│       └── Text_Value
├── ModifyTime_Area
│   ├── Image_TimeIcon
│   └── Text_ModifyTime
├── State_Overlay
│   ├── Image_DarkMask
│   ├── Image_LockIcon
│   ├── Image_WarningIcon
│   ├── Image_MutexIcon
│   ├── Image_InstalledIcon
│   └── Text_StateReason
├── Image_SelectedBorder
├── Image_RecommendGlow
├── Image_HighRiskMark
└── Button_ClickArea
```

---

## 12.3 卡片尺寸

手机端：

```text
宽：96~108px
高：138~156px
间距：10~12px
```

PC端：

```text
宽：110~124px
高：150~166px
间距：12~14px
```

---

# 十三、改造卡片上方：Text_ModifyName

## 13.1 位置

```text
卡片最上方
高度：22~26px
```

---

## 13.2 内容

显示改造名称。

示例：

```text
穿甲炮
高爆炮
复合装甲
飞行部件
火控AI
自爆核心
生产加速臂
```

---

## 13.3 显示规则

```text
最多显示 5 个字
超过用缩略名
完整名在 Tips 里显示
```

---

## 13.4 样式

```text
居中
加粗
字号：12~14
颜色：电蓝白
```

---

# 十四、改造卡片中间：Image_ModifyPreview

## 14.1 位置

```text
名称下方
卡片中间
```

---

## 14.2 尺寸

```text
手机：72~82px
PC：78~88px
```

---

## 14.3 图片要求

```text
显示改造模块专属图标或部件图。
透明背景。
主体居中。
不能带场景背景。
不能带说明文字。
图标必须能看出模块类型。
```

---

## 14.4 图标方向建议

| 改造类型 | 图标方向 |
|---|---|
| 武器 | 炮管、枪口、导弹、电磁炮 |
| 装甲 | 护甲板、盾牌、外骨骼 |
| 动力 | 引擎、履带、喷口、推进器 |
| 能源 | 电池、电容、反应堆、闪电 |
| AI | 芯片、扫描眼、网格 |
| 雷达 | 雷达盘、扫描波 |
| 生产 | 机械臂、装配线 |
| 特殊 | 核心、警告符号、飞行翼、自爆标识 |

---

# 十五、槽位标签：SlotTag_Area

## 15.1 作用

槽位标签用于快速告诉玩家：

```text
这个模块会装到哪个槽位。
```

---

## 15.2 结构

```text
SlotTag_Area
├── Image_SlotIcon
└── Text_SlotType
```

---

## 15.3 显示示例

```text
武器槽
装甲槽
动力槽
能源槽
AI槽
特殊槽
```

---

## 15.4 样式

```text
小胶囊标签
位置：图片下方或卡片右上角
颜色：电蓝灰
字号：10~11
```

---

# 十六、改造卡片底部：Cost_Area

## 16.1 位置

```text
卡片底部
高度：36~46px
```

---

## 16.2 结构

```text
Cost_Area
├── CostItem_Gold
├── CostItem_Metal
├── CostItem_Power
└── CostItem_Special
```

每个 CostItem：

```text
CostItem_xxx
├── Image_Icon
└── Text_Value
```

---

## 16.3 排布

推荐两行排布：

```text
黄金260  金属180
电力+5   时间35
```

每行最多 2~3 个资源。

---

## 16.4 资源显示优先级

卡片空间不足时，只显示最关键资源。

```text
1. 黄金
2. 金属
3. 电力 / 能耗变化
4. 特殊资源
5. 改造时间
```

完整消耗在 Tips 中显示。

---

## 16.5 图标与数字

```text
图标尺寸：14~16px
数字字号：11~12
资源足够：白色 / 浅色
资源不足：红色
电力增加：蓝色或黄色
电力降低：绿色
高风险代价：橙红
```

---

# 十七、改造时间：ModifyTime_Area

## 17.1 是否显示

建议在改造卡片右下角显示改造时间。

```text
35s
```

如果手机空间不足：

```text
可以只在 Tips 中显示改造时间。
```

---

## 17.2 结构

```text
ModifyTime_Area
├── Image_TimeIcon
└── Text_ModifyTime
```

---

## 17.3 样式

```text
图标尺寸：12~14px
字号：10~11
颜色：淡黄 / 次级文字色
```

---

# 十八、无法改造状态：State_Overlay

无法改造时必须清楚提示，不能只灰掉。

---

## 18.1 State_Overlay 结构

```text
State_Overlay
├── Image_DarkMask
├── Image_LockIcon
├── Image_WarningIcon
├── Image_MutexIcon
├── Image_InstalledIcon
└── Text_StateReason
```

---

## 18.2 资源不足

表现：

```text
资源不足的数字变红。
卡片整体降低亮度到 70%。
State_Overlay 显示半透明暗罩。
Text_StateReason 显示：资源不足。
```

如果能识别具体资源：

```text
黄金不足
金属不足
电力不足
特殊材料不足
```

注意：

```text
不要把改造图片完全盖死。
改造图片仍需可辨认。
```

---

## 18.3 科技未解锁

表现：

```text
灰色遮罩
显示 Image_LockIcon
Text_StateReason：未解锁
```

Tips 中显示完整原因：

```text
需要科技：高级火控
需要建筑：改造车间
```

---

## 18.4 槽位不匹配

表现：

```text
黄色警告图标
Text_StateReason：槽位不符
```

Tips 显示：

```text
该目标没有武器槽。
该建筑不能安装飞行部件。
```

---

## 18.5 改造次数已满

表现：

```text
橙色警告图标
Text_StateReason：次数已满
```

Tips 显示：

```text
当前改造次数：2 / 2
可替换已安装模块，但不能新增槽位改造。
```

---

## 18.6 已安装

表现：

```text
显示 Image_InstalledIcon
Text_StateReason：已安装
卡片亮度 80%
仍可点击或悬停查看 Tips
```

---

## 18.7 互斥模块

表现：

```text
红橙遮罩
显示 Image_MutexIcon
Text_StateReason：互斥
```

Tips 显示：

```text
与当前模块【高爆炮】互斥。
需替换后才能安装。
```

---

## 18.8 正在改造

表现：

```text
电蓝流光边框
Text_StateReason：改造中
```

---

## 18.9 高风险模块

表现：

```text
Image_HighRiskMark 显示红色警告角标
Text_StateReason 可显示：高风险
```

高风险模块点击时：

```text
必须弹出 ModifyConfirmPopup
```

---

# 十九、改造信息 Tips：ModifyInfoTooltip

## 19.1 触发方式

PC：

```text
鼠标悬停 ModifyCard_Item 0.25 秒。
```

手机：

```text
长按 ModifyCard_Item 0.35 秒。
```

点击规则：

```text
短按改造卡：如果可改造 → 开始改造或弹确认。
短按改造卡：如果不可改造 → 打开 Tips 并高亮原因。
替换 / 高风险 / 互斥模块 → 点击后打开确认弹窗。
```

---

## 19.2 Tips 预制体结构

```text
ModifyInfoTooltip
├── Tooltip_BG
├── Header
│   ├── Image_ModifyIcon
│   ├── Text_ModifyName
│   └── Text_ModifyType
├── Tag_Area
│   ├── Tag_Slot
│   ├── Tag_Role
│   └── Tag_Risk
├── Applicable_Area
│   └── Text_ApplicableList
├── Cost_Area
│   └── CostItem_List
├── Benefit_Area
│   └── Text_BenefitList
├── Drawback_Area
│   └── Text_DrawbackList
├── Mutex_Area
│   └── Text_MutexInfo
├── Condition_Area
│   └── Text_ConditionList
└── Warning_Area
    └── Text_Warning
```

---

## 19.3 Tips 显示内容

```text
改造图片
改造名称
改造类型
一句话定位
适用对象
占用槽位
完整资源消耗
改造时间
收益
代价
互斥关系
前置条件
高风险提示
是否会替换当前模块
```

---

## 19.4 Tips 示例

```text
[穿甲炮] 武器模块
提高对重甲和建筑的杀伤

适用对象：
主战坦克 / 机械堡垒车

占用槽位：
主武器槽

消耗：
黄金 260
金属 180
改造时间 35秒

收益：
· 对重甲伤害 +30%
· 对建筑伤害 +20%
· 射程 +0.5

代价：
· 攻速 -15%
· 移动射击命中 -10%

条件：
需要科技：穿甲火控
```

---

## 19.5 Tips 位置规则

PC：

```text
优先显示在鼠标右上方。
如果右侧空间不足，显示在左侧。
不能遮挡当前改造卡。
```

手机：

```text
显示在屏幕中下方或改造面板上方。
宽度约屏幕 86%。
最大高度约屏幕 60%。
超出可滚动。
```

---

# 二十、确认弹窗：ModifyConfirmPopup

## 20.1 出现条件

以下操作必须弹确认：

```text
替换已有模块
安装高风险模块
安装自爆模块
安装飞行建筑模块
安装不可逆模块
安装会降低原功能的模块
安装会增加大量电力消耗的模块
```

---

## 20.2 ModifyConfirmPopup 结构

```text
ModifyConfirmPopup
├── Popup_BG
├── Header
│   ├── Image_ModifyIcon
│   ├── Text_ModifyName
│   └── Text_RiskTag
├── CurrentModule_Area
│   ├── Image_CurrentModuleIcon
│   └── Text_CurrentModuleName
├── NewModule_Area
│   ├── Image_NewModuleIcon
│   └── Text_NewModuleName
├── Gain_Area
│   └── Text_GainList
├── Loss_Area
│   └── Text_LossList
├── Cost_Area
│   └── CostItem_List
├── Warning_Area
│   └── Text_Warning
└── Button_Area
    ├── Button_Cancel
    └── Button_ConfirmModify
```

---

## 20.3 替换确认示例

```text
替换模块确认

当前模块：高爆炮
新模块：穿甲炮

失去：
· 范围爆炸伤害
· 对密集步兵优势

获得：
· 对重甲伤害 +30%
· 对建筑伤害 +20%

消耗：
黄金 260
金属 180

[取消] [确认替换]
```

---

## 20.4 高风险确认示例

```text
高风险改造：自爆核心

获得：
· 被摧毁时造成高额范围伤害
· 可主动自毁

风险：
· 主动自毁会永久摧毁该单位 / 建筑
· 该模块不可在战斗中拆除

[取消] [确认改造]
```

---

# 二十一、改造进度区：ModifyProgress_Area

## 21.1 作用

显示当前正在进行的改造。

---

## 21.2 结构

```text
ModifyProgress_Area
├── Text_ProgressTitle
├── Image_ModifyIcon
├── Text_ModifyName
├── Image_ProgressBG
├── Image_ProgressFill
├── Text_RemainTime
└── Button_CancelModify
```

---

## 21.3 显示内容

```text
当前改造
改造图标
改造名称
进度条
剩余时间
取消按钮
暂停原因
```

示例：

```text
当前改造：穿甲炮
██████░ 62%
剩余 12s
```

---

## 21.4 空状态

如果没有正在改造：

```text
暂无改造
选择下方模块开始改造
```

---

## 21.5 暂停状态

暂停原因：

```text
电力不足
单位正在战斗
建筑断供
目标被控制
目标不可操作
```

显示：

```text
改造暂停：电力不足
```

进度条：

```text
变灰
停止推进
```

---

## 21.6 取消改造

点击 Button_CancelModify：

```text
取消当前改造
返还部分资源
进度清零
模块不安装
```

推荐返还：

```text
普通模式：100%
竞技模式：80%
硬核模式：50%
```

---

# 二十二、点击改造卡后的流程

## 22.1 可改造时

普通模块：

```text
点击改造卡
→ 判断槽位
→ 判断资源
→ 判断科技
→ 扣除资源
→ 进入改造中
→ ModifyProgress_Area 显示进度
```

---

## 22.2 替换模块时

```text
点击改造卡
→ 检测该槽位已有模块
→ 打开 ModifyConfirmPopup
→ 玩家确认后开始改造
```

---

## 22.3 高风险模块

```text
点击改造卡
→ 打开 ModifyConfirmPopup
→ 显示风险和代价
→ 玩家确认后开始改造
```

---

## 22.4 不可改造时

```text
点击改造卡
→ 不开始改造
→ 打开 ModifyInfoTooltip
→ Warning_Area 显示原因
→ 对应资源 / 条件 / 槽位区域闪红
```

---

# 二十三、横向滑动规则

## 23.1 改造列表滑动：手机端

```text
在 ModifyScrollView 内横向拖动 → 列表滑动
移动距离超过 12px → 视为拖动
长按 0.35s → 显示 Tips
长按后移动超过 20px → 关闭 Tips，进入拖动
```

防误触优先级：

```text
拖动 > 长按 > 点击
```

---

## 23.2 改造列表滑动：PC端

```text
鼠标滚轮 → 横向滚动
鼠标拖动 → 横向滚动
点击左右箭头 → 翻页
悬停卡片 → Tips
```

---

## 23.3 槽位列表滑动

如果槽位过多：

```text
ModifySlotScrollView 可横向滑动。
```

点击槽位优先级高于滑动。

---

# 二十四、推荐 Unity 组件

## 24.1 UI_ModifyPanel

```text
CanvasGroup
RectTransform
Animator / DOTween
```

## 24.2 ModifySlotContent

```text
HorizontalLayoutGroup
ContentSizeFitter
```

## 24.3 CategoryContent

```text
HorizontalLayoutGroup
ContentSizeFitter
```

## 24.4 ModifyContent

```text
HorizontalLayoutGroup
ContentSizeFitter
```

## 24.5 ModifyScrollView

```text
ScrollRect
Mask / RectMask2D
```

## 24.6 ModifyCard_Item

```text
Button
CanvasGroup
LayoutElement
EventTrigger
IPointerEnterHandler
IPointerDownHandler
IPointerExitHandler
```

## 24.7 ModifyInfoTooltip

```text
CanvasGroup
VerticalLayoutGroup
ContentSizeFitter
```

## 24.8 ModifyConfirmPopup

```text
CanvasGroup
VerticalLayoutGroup
ContentSizeFitter
```

---

# 二十五、控件命名规范

建议程序统一使用以下命名：

```text
UI_ModifyPanel
Panel_Background

Header_Area
Text_Title
Text_SelectedTarget
Button_Close

Slot_Area
Text_SlotTitle
ModifySlotScrollView
ModifySlotContent
ModifySlot_Item
Image_SlotBG
Text_SlotName
Image_InstalledModuleIcon
Text_InstalledModuleName
Image_EmptyIcon
Image_LockIcon
Image_SelectedSlotBorder
Button_ClickArea
Text_ModifyCount

Category_Area
CategoryScrollView
CategoryContent
Btn_Category_All
Btn_Category_Weapon
Btn_Category_Armor
Btn_Category_Power
Btn_Category_Energy
Btn_Category_AI
Btn_Category_Special

ModifyList_Area
Button_PageLeft
Button_PageRight
ModifyScrollView
ModifyContent
ModifyCard_Item

Text_ModifyName
Image_ModifyPreview
SlotTag_Area
Image_SlotIcon
Text_SlotType

Cost_Area
CostItem_Gold
CostItem_Metal
CostItem_Power
CostItem_Special

ModifyTime_Area
Image_TimeIcon
Text_ModifyTime

State_Overlay
Image_DarkMask
Image_LockIcon
Image_WarningIcon
Image_MutexIcon
Image_InstalledIcon
Text_StateReason

Image_SelectedBorder
Image_RecommendGlow
Image_HighRiskMark

ModifyProgress_Area
Text_ProgressTitle
Image_ModifyIcon
Text_ModifyName
Image_ProgressBG
Image_ProgressFill
Text_RemainTime
Button_CancelModify

ModifyInfoTooltip
Tooltip_BG
Tooltip_Header
Tooltip_Applicable_Area
Tooltip_Cost_Area
Tooltip_Benefit_Area
Tooltip_Drawback_Area
Tooltip_Mutex_Area
Tooltip_Condition_Area
Tooltip_Warning_Area

ModifyConfirmPopup
Popup_BG
CurrentModule_Area
NewModule_Area
Gain_Area
Loss_Area
Button_Cancel
Button_ConfirmModify
```

---

# 二十六、状态颜色建议

| 状态 | 颜色 |
|---|---|
| 可改造 | 电蓝 |
| 悬停 | 电蓝提亮 |
| 选中槽位 | 明亮电蓝 |
| 资源不足 | 红色 |
| 科技未解锁 | 灰色 |
| 槽位不符 | 黄色 |
| 改造次数已满 | 橙色 |
| 已安装 | 绿色 |
| 互斥 | 红橙色 |
| 高风险 | 深红色 |
| 正在改造 | 电蓝流光 |
| 改造暂停 | 灰蓝 |
| 推荐改造 | 柔和电蓝呼吸亮边 |

---

# 二十七、最终视觉结构

最终视觉结构应该是：

```text
屏幕中下方一个横向机械改造面板

顶部：
机械改造标题 + 当前改造目标

中上：
当前改造槽位
[武器槽] [装甲槽] [动力槽] [能源槽] [AI槽]
右侧显示：改造次数 1/2

中间：
改造分类栏
[全部] [武器] [装甲] [动力] [能源] [AI] [特殊]

中下：
横向滑动改造列表

每个改造卡：
上方改造名称
中间改造图片
下方槽位标签
底部资源 ICON + 数字

底部：
当前改造进度 / 剩余时间 / 取消按钮

悬停或长按：
显示改造信息 Tips

替换或高风险：
显示确认弹窗
```

---

# 二十八、最终操作逻辑

```text
能改造 → 点击开始改造。
替换模块 → 点击弹确认。
高风险模块 → 点击弹确认。
不能改造 → 点击或悬停显示原因。
拖动 → 左右浏览改造模块。
长按 / 悬停 → 查看完整信息。
点击槽位 → 筛选对应槽位模块。
点击取消改造 → 停止当前改造并返还资源。
关闭 → 返回普通单位 / 建筑面板。
```

---

# 二十九、最终硬规则

```text
1. 改造面板必须放在屏幕中下方。
2. 改造面板不能全屏。
3. 改造面板不能放在右边独占一列。
4. 改造页面上方必须显示当前改造槽位。
5. 改造页面必须显示当前改造次数。
6. 改造列表必须横向滑动。
7. 改造必须按分类显示。
8. 分类至少包含：全部、武器、装甲、动力、能源、AI、特殊。
9. 每个改造卡上方必须显示改造名称。
10. 每个改造卡中间必须显示改造图片。
11. 每个改造卡底部必须显示资源 ICON + 数字。
12. 资源不足、科技未解锁、槽位不符、次数已满、互斥必须有明确提示。
13. 鼠标悬停必须显示改造 Tips。
14. 手机长按必须显示改造 Tips。
15. 点击可改造模块开始改造。
16. 点击不可改造模块打开 Tips 并高亮原因。
17. 替换模块必须弹确认。
18. 高风险模块必须弹确认。
19. 改造中必须显示进度和剩余时间。
20. UI 控件命名必须清楚，方便程序绑定。
```

---

# 三十、一句话总结

```text
机械改造页面应该是屏幕中下方的横向模块装配条：上方显示当前槽位和改造次数，中间显示分类栏，下方显示改造图片卡片，卡片底部显示资源消耗，无法改造必须明确提示，悬停/长按显示详情 Tips，替换和高风险改造必须弹确认。
```

---

# 三十一、2026-05-18 落地补充规则

```text
1. 当前项目里的机械改造页继续挂在：
   SelectionBuildingControlPage_Prefab / MechanicalModificationPage

2. MechanicalModificationPage 现在额外固定提供两个可编辑文本节点：
   - SelectedTargetLabel
   - ModifyCountLabel

3. 这两个节点的职责：
   - SelectedTargetLabel：显示“当前目标：xxx”
   - ModifyCountLabel：显示“改造次数：n / max”

4. 这两个节点的位置、宽度、字号、颜色、对齐方式以后统一在 prefab 内改，
   SelectionPanel 只写入文本，不再给它们写 anchoredPosition / sizeDelta。

5. MechanicalStatusPanel 的 CancelButton 现在只在“改造中”时显示；
   当前已经接通取消改造逻辑，点击后会：
   - 停止当前改造协程
   - 返还本次改造消耗
   - 清空当前改造进度
   - 刷新 HUD 选择页

6. MechanicalModificationCard_Prefab 的静态排版继续由 prefab 负责：
   - Title
   - Icon
   - Meta
   - Description
   - CostRow
   代码只绑定名称、摘要、费用、交互和详情触发，不再写死卡内位置尺寸。
```

## 三十二、2026-05-18 机械改造卡状态层落地补充

```text
1. MechanicalModificationCard_Prefab 本轮补齐了可直接在 prefab 内编辑的状态层与信息区节点：
   - SlotTag_Area
     - Image_SlotIcon
     - Text_SlotType
   - ModifyTime_Area
     - Image_TimeIcon
     - Text_ModifyTime
   - State_Overlay
     - Image_DarkMask
     - Image_LockIcon
     - Image_WarningIcon
     - Image_MutexIcon
     - Image_InstalledIcon
     - Text_StateReason
   - Image_SelectedBorder
   - Image_RecommendGlow
   - Image_HighRiskMark

2. 以上节点的位置、尺寸、颜色、字体、对齐、角标样式、遮罩透明度，后续统一直接在 MechanicalModificationCard_Prefab 内调整。

3. SelectionPanel 本轮新增的代码职责只剩：
   - 绑定槽位类型文案
   - 绑定改造时间文案
   - 根据状态切换各图标/遮罩/角标显隐
   - 写入 Text_StateReason
   - 根据是否改造中切换 Image_SelectedBorder
   - 根据推荐条件切换 Image_RecommendGlow
   - 根据高风险条件切换 Image_HighRiskMark

4. SelectionPanel 不再负责给机械改造卡写死这些静态布局：
   - 槽位标签区位置
   - 改造时间区位置
   - 状态遮罩区大小
   - 选中边框/推荐辉光/高风险角标的位置和尺寸

5. 当前高风险判定先按现有后端数据落地为：
   - Advanced
   - GrantsFlight
   - GrantsSelfDestruct
   - GrantsOverload
   - SelfDestruct 类别
   - Flight 类别
   若后续要改单独策划规则，优先扩 MechanicalModDefinition 字段，再继续沿用这套 prefab 节点绑定。
```

## 三十三、2026-05-18 机械改造卡视觉职责继续回收

```text
1. MechanicalModificationCard_Prefab 当前已经承担以下静态视觉职责：
   - 卡片底色
   - 标题字号、字重、对齐
   - Meta 的对齐与样式
   - 状态层各图标/角标/遮罩的默认颜色与位置
   - 选中边框、推荐辉光、高风险角标的位置尺寸

2. SelectionPanel 本轮继续移除了以下机械改造卡运行时静态覆盖：
   - 卡片背景默认色
   - Title 的 fontSize / fontStyle / alignment / overflow / lineSpacing
   - Meta 的 alignment / overflow / 默认颜色
   - CanvasGroup alpha 的阻塞态透明度强写

3. 现在脚本只继续保留：
   - 标题文字绑定
   - 图标 sprite 与必要的禁用态 tint 兜底
   - Meta / Description / SlotType / ModifyTime 文案绑定
   - 状态节点显隐和状态文案绑定

4. MechanicalModificationCard_Prefab 本轮还修复了 `Text_StateReason` 段落中的 yaml 文本粘连，避免 prefab 资源继续带隐性结构风险。
```

## 三十四、2026-05-18 机械改造卡主图标绑定继续收口

```text
1. MechanicalModificationCard_Prefab 的主图标节点 `Icon` 现在被视为必需固定节点。
2. SelectionPanel 在机械改造卡路径上不再通过旧的 `EnsureStaticActionButtonIcon(...)` 临时创建图标。
3. 当前规则改为：
   - 有 `Icon` 节点：运行时只绑定 sprite、显隐和必要 tint
   - 缺 `Icon` 节点：直接报 prefab 结构错误
4. 这样做的目的，是避免 prefab 里图标位置、大小、层级配错时，被运行时临时创建掩盖，导致你在编辑器里改 prefab 却不生效。
```

## 三十五、2026-05-20 机械改造列表显示绑定补充

```text
1. MechanicalModificationPage 下三个横向滚动 Content 必须使用左上基准：
   - MechanicalCategoryTabsContent
   - MechanicalSlotsContent
   - MechanicalGridContent

2. MechanicalGridViewport 的 ScrollRect 必须绑定 MechanicalGridContent：
   - Horizontal = true
   - Vertical = false
   - Content = MechanicalGridContent

3. SelectionPanel 刷新机械改造卡时只允许清理 mechanicalModButtonViews 对应的动态卡，
   不允许再调用整页动态按钮清理导致造兵、科技或普通动作列表被误删。

4. SelectionPanel 可以在运行时根据当前可见改造卡数量写入 MechanicalGridContent 的 sizeDelta，
   这是滚动内容尺寸，不属于静态页面排版；页面位置、列表视口位置、卡片静态样式仍由 prefab 负责。

5. 如果机械建筑“有可改造定义但列表看不见”，优先排查：
   - MechanicalGridContent 是否仍是左上锚点和左上 pivot
   - MechanicalGridViewport.ScrollRect.content 是否指向 MechanicalGridContent
   - MechanicalGridContent 是否被动态卡片宽度撑开
   - EmptyLabel 是否只在动态卡数量为 0 时显示
```

## 三十六、2026-05-20 分类栏状态与空态补充

```text
1. MechanicalCategoryTabsContent 使用 ProductionCategoryTab_Prefab。
   分类 Tab prefab 必须包含：
   - Label
   - Image_SelectedLine
   - Image_NewDot

2. SelectionPanel 只负责分类运行时状态：
   - 当前选中分类
   - 当前目标下该分类是否有内容
   - Image_SelectedLine 显隐
   - Image_NewDot 默认隐藏
   Tab 的尺寸、颜色和节点位置仍由 prefab 负责。

3. 如果当前选中分类在当前目标下没有模块，
   且 All 分类仍有模块，SelectionPanel 会自动回退到 All。

4. MechanicalGridContent/EmptyLabel 是固定空态节点。
   EmptyLabel 必须 ignore layout，只在可见机械改造卡数量为 0 时显示。

5. 没有可见机械改造卡时，SelectionPanel 可以临时把
   MechanicalGridContent 撑到 viewport 尺寸，并关闭 ContentSizeFitter fit。
   这是动态滚动内容尺寸，不是静态页面布局。
```
