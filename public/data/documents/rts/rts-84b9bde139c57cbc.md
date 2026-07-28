# 科技页面 UI 预制体布局结构说明

## 一、整体目标

当前科技页面需要重做为：

```text
屏幕中下方显示一个横向科技列表区域。
每个科技是独立卡片。
卡片上方显示科技名称。
卡片中间显示科技图片。
卡片底部显示研究消耗 ICON + 数字。
无法研究科技时必须有清楚提醒。
科技列表可以左右滑动。
鼠标悬停 / 点击 / 手机长按后显示科技信息 Tips。
科技页面上方显示正在研究的科技和等待研究的科技。
等待研究的科技图标右上角必须有取消按钮。
```

该文档用于指导程序制作 Unity UI 预制体。

---

# 二、整体位置规则

## 2.1 科技面板位置

科技页面固定在：

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
科技面板应位于技能按钮上方 20~30px。
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
UI_TechPanel
├── Panel_Background
├── Header_Area
│   ├── Text_Title
│   ├── Text_SelectedBuilding
│   └── Button_Close
├── ResearchQueue_Area
│   ├── Text_QueueTitle
│   ├── ResearchingSlot
│   │   ├── Image_TechIcon
│   │   ├── Image_ProgressRing
│   │   ├── Image_ProgressFill
│   │   ├── Text_ResearchingLabel
│   │   ├── Text_RemainTime
│   │   └── Button_CancelResearching
│   └── WaitingResearchScrollView
│       └── Viewport
│           └── WaitingResearchContent
│               ├── ResearchQueueItem_Waiting
│               ├── ResearchQueueItem_Waiting
│               └── ResearchQueueItem_Waiting
├── Category_Area
│   └── CategoryScrollView
│       └── Viewport
│           └── CategoryContent
│               ├── Btn_Category_All
│               ├── Btn_Category_Military
│               ├── Btn_Category_Economy
│               ├── Btn_Category_Building
│               ├── Btn_Category_Defense
│               ├── Btn_Category_Faction
│               └── Btn_Category_Special
├── TechList_Area
│   ├── Button_PageLeft
│   ├── TechScrollView
│   │   └── Viewport
│   │       └── TechContent
│   │           ├── TechCard_Item
│   │           ├── TechCard_Item
│   │           └── TechCard_Item
│   ├── Button_PageRight
│   └── Scroll_ProgressBar
├── TipAnchor_Area
│   └── TechInfoTooltip
└── Input_Blocker_Optional
```

---

# 四、上下结构说明

最终面板从上到下分为 5 个主要区域：

```text
1. Header_Area：标题区
2. ResearchQueue_Area：研究队列区
3. Category_Area：科技分类栏
4. TechList_Area：横向科技列表区
5. Scroll_ProgressBar：列表滑动位置提示
```

整体结构示意：

```text
┌────────────────────────────────────────────────────┐
│ Header：科技 / 当前建筑 / 关闭按钮                  │
├────────────────────────────────────────────────────┤
│ ResearchQueue：正在研究 + 等待研究队列              │
│ [研究中 进度] [等待1 x] [等待2 x] [等待3 x]          │
├────────────────────────────────────────────────────┤
│ Category：全部 军事 经济 建筑 防御 阵营 特殊         │
├────────────────────────────────────────────────────┤
│ TechList：横向科技列表                              │
│ ← [科技卡][科技卡][科技卡][科技卡] →                 │
├────────────────────────────────────────────────────┤
│ 滑动进度条                                          │
└────────────────────────────────────────────────────┘
```

---

# 五、根节点：UI_TechPanel

## 5.1 用途

```text
整个科技页面根节点。
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
承载整个科技面板的视觉底板。
```

## 6.2 样式

```text
半透明深色底
轻微描边
软阴影
圆角 18px
```

## 6.3 推荐颜色

```text
背景：#1E2430
透明度：88%
边框：当前阵营主题色
```

阵营边框颜色：

| 阵营 | 边框颜色 |
|---|---|
| 华夏 | 赤金 |
| 妖族 | 血红 |
| 机械 | 电蓝 |
| 自然 | 灵绿 |
| 融合阵营 | 双阵营渐变 |

---

# 七、顶部标题区：Header_Area

## 7.1 结构

```text
Header_Area
├── Text_Title
├── Text_SelectedBuilding
└── Button_Close
```

## 7.2 位置

```text
面板最上方
高度：32~40px
```

## 7.3 Text_Title

显示：

```text
科技研究
```

或根据建筑显示：

```text
玄机观科技
科研中心科技
元素研习所科技
妖血池科技
```

样式：

```text
左对齐
字号：16~18
加粗
颜色：主文字色
```

## 7.4 Text_SelectedBuilding

显示当前科技建筑：

```text
当前建筑：玄机观
```

简化显示：

```text
玄机观
```

样式：

```text
标题右侧
字号：12~14
颜色：次级文字色
```

## 7.5 Button_Close

```text
位置：右上角
图标：X
功能：关闭科技面板
```

手机端可选：

```text
如果使用系统返回键关闭，可以隐藏关闭按钮。
```

---

# 八、研究队列区：ResearchQueue_Area

## 8.1 作用

ResearchQueue_Area 显示：

```text
当前正在研究的科技
等待研究的科技
研究进度
剩余时间
等待队列取消按钮
队列满 / 暂停 / 断电 / 断供等状态
```

该区域必须放在科技列表上方。

---

## 8.2 ResearchQueue_Area 结构

```text
ResearchQueue_Area
├── Text_QueueTitle
├── ResearchingSlot
│   ├── Image_TechIcon
│   ├── Image_ProgressRing
│   ├── Image_ProgressFill
│   ├── Text_ResearchingLabel
│   ├── Text_RemainTime
│   └── Button_CancelResearching
└── WaitingResearchScrollView
    └── Viewport
        └── WaitingResearchContent
            ├── ResearchQueueItem_Waiting
            ├── ResearchQueueItem_Waiting
            └── ResearchQueueItem_Waiting
```

---

## 8.3 位置与尺寸

```text
位置：Header_Area 下方
高度：70~92px
```

PC端：

```text
高度：78~92px
```

手机端：

```text
高度：72~86px
```

---

## 8.4 Text_QueueTitle

显示：

```text
研究队列
```

或更短：

```text
队列
```

位置：

```text
ResearchQueue_Area 左上角
```

样式：

```text
字号：12~14
颜色：次级文字色
```

---

# 九、正在研究槽：ResearchingSlot

## 9.1 用途

显示当前正在研究的科技。

如果研究队列中有科技，ResearchingSlot 必须始终显示第一个正在研究科技。

---

## 9.2 ResearchingSlot 结构

```text
ResearchingSlot
├── Image_TechIcon
├── Image_ProgressRing
├── Image_ProgressFill
├── Text_ResearchingLabel
├── Text_RemainTime
└── Button_CancelResearching
```

---

## 9.3 显示内容

```text
科技图标
研究中标签
环形进度或横向进度
剩余时间
取消按钮，可选
```

示例：

```text
[火箭矢图标]
研究中
62%
剩余 18s
```

---

## 9.4 样式

```text
尺寸：64~78px 宽
背景：阵营色暗底
边框：阵营亮色
进度：阵营主色
```

正在研究的科技要比等待科技更大、更亮。

---

## 9.5 进度显示

推荐使用环形进度：

```text
Image_ProgressRing：进度底环
Image_ProgressFill：当前进度
```

也可以使用小横条：

```text
Image_ProgressBarBG
Image_ProgressBarFill
```

---

## 9.6 Button_CancelResearching

正在研究科技是否允许取消，由模式规则决定。

推荐：

```text
允许取消。
取消后返还 50%~100% 资源，按模式配置。
```

推荐默认：

```text
竞技模式返还 80%
普通模式返还 100%
硬核模式返还 50%
```

按钮位置：

```text
ResearchingSlot 右上角
```

图标：

```text
X
```

手机端：

```text
按钮尺寸至少 24x24
实际点击热区 32x32
```

---

# 十、等待研究队列：WaitingResearchScrollView

## 10.1 用途

显示研究队列中等待研究的科技。

等待研究科技必须显示取消按钮。

---

## 10.2 结构

```text
WaitingResearchScrollView
└── Viewport
    └── WaitingResearchContent
        ├── ResearchQueueItem_Waiting
        ├── ResearchQueueItem_Waiting
        └── ResearchQueueItem_Waiting
```

---

## 10.3 ResearchQueueItem_Waiting 结构

```text
ResearchQueueItem_Waiting
├── Image_BG
├── Image_TechIcon
├── Text_OrderIndex
├── Button_Cancel
│   ├── Image_CancelBG
│   └── Image_CancelIcon
└── Image_WaitingState
```

---

## 10.4 等待科技显示内容

每个等待研究科技显示：

```text
科技图标
等待顺序
右上角取消按钮
```

示例：

```text
[毒箭矢图标] 2  X
[盾墙训练图标] 3  X
[城防加固图标] 4  X
```

---

## 10.5 Button_Cancel

位置：

```text
ResearchQueueItem_Waiting 右上角
```

尺寸：

```text
视觉尺寸：18~22px
实际热区：28~32px
```

功能：

```text
点击取消该等待研究科技。
移出队列。
返还资源。
刷新后续队列顺序。
```

表现：

```text
红色小圆按钮
白色 X 图标
悬停 / 按下时变亮
```

---

## 10.6 等待队列横向滚动

如果等待科技很多：

```text
WaitingResearchScrollView 可以横向滑动。
```

PC端：

```text
鼠标滚轮 / 拖拽滚动。
```

手机端：

```text
手指左右滑动。
```

---

## 10.7 队列为空状态

如果没有正在研究和等待研究：

```text
ResearchingSlot 为空槽
WaitingResearchContent 显示空状态
```

显示：

```text
研究队列为空
点击下方科技开始研究
```

手机端简化：

```text
队列为空
```

---

## 10.8 队列满状态

如果研究队列达到上限：

```text
ResearchQueue_Area 右侧显示：队列满
科技卡片显示队列满提示
```

推荐队列上限：

```text
默认 3 个
科技强化后可提升到 5 个
```

---

# 十一、分类栏：Category_Area

## 11.1 结构

```text
Category_Area
└── CategoryScrollView
    └── Viewport
        └── CategoryContent
            ├── Btn_Category_All
            ├── Btn_Category_Military
            ├── Btn_Category_Economy
            ├── Btn_Category_Building
            ├── Btn_Category_Defense
            ├── Btn_Category_Faction
            └── Btn_Category_Special
```

---

## 11.2 位置

```text
ResearchQueue_Area 下方
高度：36~44px
```

---

## 11.3 基础分类

```text
全部
军事
经济
建筑
防御
阵营
特殊
```

可选扩展：

```text
融合
终局
互斥
已研究
```

---

## 11.4 分类定义

### 全部

```text
显示当前建筑可研究的全部科技。
```

### 军事

```text
单位强化、兵种解锁、技能解锁、克制强化、箭矢科技、阵型科技。
```

### 经济

```text
采集速度、建造速度、生产效率、维修效率、电力效率、献祭效率。
```

### 建筑

```text
建筑解锁、建筑生命、建筑功能、建筑上限、供给范围。
```

### 防御

```text
防御塔、城墙、反空、反隐、反潜、陷阱、护盾。
```

### 阵营

```text
华夏星级、妖族吞噬、机械改造、自然元素、融合占领等阵营系统科技。
```

### 特殊

```text
终局、路线、互斥、唯一、战役专属、高风险科技。
```

---

## 11.5 分类按钮结构

```text
Btn_Category_xxx
├── Image_BG
├── Image_Icon
├── Text_Name
├── Image_SelectedLine
└── Image_NewDot
```

---

## 11.6 分类按钮状态

### 普通状态

```text
暗色底
白色文字
无高亮线
```

### 选中状态

```text
阵营色底
文字变亮
底部显示 Image_SelectedLine
```

### 无内容状态

```text
灰色
不可点击
```

### 有新科技状态

```text
右上角显示 Image_NewDot
```

### 全部完成状态

```text
右上角显示完成勾
```

---

# 十二、科技列表区：TechList_Area

## 12.1 结构

```text
TechList_Area
├── Button_PageLeft
├── TechScrollView
│   └── Viewport
│       └── TechContent
│           ├── TechCard_Item
│           ├── TechCard_Item
│           └── TechCard_Item
├── Button_PageRight
└── Scroll_ProgressBar
```

---

## 12.2 位置

```text
Category_Area 下方
占据面板主体区域
高度：145~175px
```

---

## 12.3 横向滑动

ScrollRect 设置：

```text
Horizontal = true
Vertical = false
Movement Type = Elastic 或 Clamped
```

手机端：

```text
手指左右滑动科技列表。
```

PC端：

```text
鼠标滚轮 / 鼠标拖拽 / 左右翻页按钮。
```

---

## 12.4 左右翻页按钮

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

## 12.5 滑动进度条

```text
Scroll_ProgressBar
```

位置：

```text
科技列表底部
```

表现：

```text
细线
显示当前滑动位置
手机端使用短进度条，不使用粗滚动条
```

---

# 十三、科技卡片：TechCard_Item

## 13.1 重要性

科技卡片是科技页面最重要的交互单元。

每个科技必须是独立卡片。

---

## 13.2 TechCard_Item 结构

```text
TechCard_Item
├── Image_CardBG
├── Text_TechName
├── Image_TechPreview
├── Cost_Area
│   ├── CostItem_Wood
│   │   ├── Image_Icon
│   │   └── Text_Value
│   ├── CostItem_Gold
│   │   ├── Image_Icon
│   │   └── Text_Value
│   ├── CostItem_Stone
│   │   ├── Image_Icon
│   │   └── Text_Value
│   ├── CostItem_Metal
│   │   ├── Image_Icon
│   │   └── Text_Value
│   └── CostItem_Special
│       ├── Image_Icon
│       └── Text_Value
├── ResearchTime_Area
│   ├── Image_TimeIcon
│   └── Text_ResearchTime
├── State_Overlay
│   ├── Image_DarkMask
│   ├── Image_LockIcon
│   ├── Image_WarningIcon
│   ├── Image_MutexIcon
│   ├── Image_CompletedIcon
│   └── Text_StateReason
├── Image_SelectedBorder
├── Image_RecommendGlow
└── Button_ClickArea
```

---

## 13.3 卡片尺寸

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

# 十四、科技卡片上方：Text_TechName

## 14.1 位置

```text
卡片最上方
高度：22~26px
```

---

## 14.2 内容

显示科技名称。

示例：

```text
火箭矢
毒箭矢
穿甲箭
盾墙训练
电路优化
五行轮转
饕餮重鞍
```

---

## 14.3 显示规则

```text
最多显示 5 个字
超过用缩略名
完整名在 Tips 里显示
```

---

## 14.4 样式

```text
居中
加粗
字号：12~14
颜色：白色或阵营浅色
```

---

# 十五、科技卡片中间：Image_TechPreview

## 15.1 位置

```text
名称下方
卡片中间
```

---

## 15.2 尺寸

```text
手机：72~82px
PC：78~88px
```

---

## 15.3 图片要求

```text
显示科技专属图标。
透明背景。
主体居中。
不能带场景背景。
不能带说明文字。
图标必须能看出科技方向。
```

---

## 15.4 图标方向建议

| 科技类型 | 图标方向 |
|---|---|
| 攻击强化 | 武器、箭矢、火焰、炮口 |
| 防御强化 | 盾牌、护甲、城墙 |
| 经济强化 | 资源、工具、齿轮 |
| 建筑解锁 | 建筑剪影、图纸 |
| 阵营科技 | 阵营符号 |
| 互斥科技 | 分叉箭头、锁 |
| 终局科技 | 发光核心、大型符号 |

---

# 十六、科技卡片底部：Cost_Area

## 16.1 位置

```text
卡片底部
高度：36~46px
```

---

## 16.2 结构

```text
Cost_Area
├── CostItem_Wood
├── CostItem_Gold
├── CostItem_Stone
├── CostItem_Metal
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
木材120  黄金300
金属80   特殊1
```

每行最多 2~3 个资源。

---

## 16.4 资源显示优先级

卡片空间不足时，只显示最关键资源。

```text
1. 黄金
2. 木材
3. 金属
4. 石料
5. 特殊资源
6. 科技点 / 献祭值 / 元素值
```

完整消耗在 Tips 中显示。

---

## 16.5 图标与数字

```text
图标尺寸：14~16px
数字字号：11~12
资源足够：白色 / 浅色
资源不足：红色
```

---

# 十七、研究时间：ResearchTime_Area

## 17.1 是否显示

建议在科技卡片右下角显示研究时间。

```text
45s
```

如果手机空间不足：

```text
可以只在 Tips 中显示研究时间。
```

---

## 17.2 结构

```text
ResearchTime_Area
├── Image_TimeIcon
└── Text_ResearchTime
```

---

## 17.3 样式

```text
图标尺寸：12~14px
字号：10~11
颜色：淡黄 / 次级文字色
```

---

# 十八、无法研究状态：State_Overlay

无法研究时必须清楚提示，不能只灰掉。

---

## 18.1 State_Overlay 结构

```text
State_Overlay
├── Image_DarkMask
├── Image_LockIcon
├── Image_WarningIcon
├── Image_MutexIcon
├── Image_CompletedIcon
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
木材不足
金属不足
石料不足
科技点不足
```

注意：

```text
不要把科技图片完全盖死。
科技图片仍需可辨认。
```

---

## 18.3 前置科技不足

表现：

```text
灰色遮罩
显示 Image_LockIcon
Text_StateReason：前置不足
```

Tips 中显示完整原因：

```text
需要科技：箭术研习
需要建筑：玄机观
```

---

## 18.4 建筑等级不足

表现：

```text
锁图标
Text_StateReason：建筑等级不足
```

Tips 显示：

```text
需要玄机观 2级
当前玄机观 1级
```

---

## 18.5 主城等级不足

表现：

```text
锁图标
Text_StateReason：主城不足
```

Tips 显示：

```text
需要主城 2级
当前主城 1级
```

---

## 18.6 互斥科技锁定

表现：

```text
红橙遮罩
显示 Image_MutexIcon
Text_StateReason：互斥
```

Tips 显示：

```text
已研究：火箭矢
因此无法研究：毒箭矢 / 穿甲箭矢
```

---

## 18.7 已研究完成

表现：

```text
显示 Image_CompletedIcon
Text_StateReason：已完成
卡片亮度 80%
仍然可以点击或悬停查看 Tips
```

---

## 18.8 队列已满

表现：

```text
黄色警告图标
Text_StateReason：队列满
```

点击时：

```text
研究队列区闪烁
提示：研究队列已满
```

---

## 18.9 建筑停研 / 暂停

停研原因：

```text
断电
断供
被控制
建筑暂停
科技建筑失效
```

表现：

```text
灰蓝遮罩
Text_StateReason：研究暂停
```

Tips 显示具体原因。

---

# 十九、科技信息 Tips：TechInfoTooltip

## 19.1 触发方式

PC：

```text
鼠标悬停 TechCard_Item 0.25 秒。
```

手机：

```text
长按 TechCard_Item 0.35 秒。
```

点击规则：

```text
短按科技卡：如果可研究 → 加入研究队列或开始研究。
短按科技卡：如果不可研究 → 打开 Tips 并高亮原因。
高风险 / 互斥 / 路线科技 → 点击后打开确认版 Tips。
```

---

## 19.2 Tips 预制体结构

```text
TechInfoTooltip
├── Tooltip_BG
├── Header
│   ├── Image_TechIcon
│   ├── Text_TechName
│   └── Text_TechType
├── Tag_Area
│   ├── Tag_Type
│   ├── Tag_Effect
│   └── Tag_Risk
├── Cost_Area
│   └── CostItem_List
├── Effect_Area
│   └── Text_EffectList
├── Unlock_Area
│   └── Text_UnlockList
├── Target_Area
│   └── Text_TargetList
├── Condition_Area
│   └── Text_ConditionList
├── Mutex_Area
│   └── Text_MutexInfo
└── Warning_Area
    └── Text_Warning
```

---

## 19.3 Tips 显示内容

```text
科技图
科技名称
科技类型
一句话定位
完整资源消耗
研究时间
影响对象
解锁内容
具体效果
前置条件
互斥关系
风险提示
```

---

## 19.4 Tips 示例

```text
[毒箭矢] 箭矢科技
让弓兵切换为持续伤害打法

消耗：
黄金 300
木材 120
研究时间 45秒

影响：
弓兵 / 弩手 / 箭塔

解锁：
毒箭模式

效果：
· 攻击附加中毒，持续4秒
· 每秒造成8点伤害
· 克制高生命单位

限制：
箭矢模式互斥
不能同时启用火箭矢 / 穿甲箭矢

条件：
需要科技：箭术研习
```

---

## 19.5 Tips 位置规则

PC：

```text
优先显示在鼠标右上方。
如果右侧空间不足，显示在左侧。
不能遮挡当前科技卡。
```

手机：

```text
显示在屏幕中下方或科技面板上方。
宽度约屏幕 86%。
最大高度约屏幕 60%。
超出可滚动。
```

---

# 二十、确认版 Tips：TechConfirmTooltip

## 20.1 出现条件

以下科技点击后必须弹确认版 Tips：

```text
互斥科技
路线科技
终局科技
高成本科技
不可逆科技
会锁定其他科技的科技
会改变阵营玩法路线的科技
```

---

## 20.2 结构

```text
TechConfirmTooltip
├── Tooltip_BG
├── Header
│   ├── Image_TechIcon
│   ├── Text_TechName
│   └── Text_RiskTag
├── Cost_Area
├── Gain_Area
│   └── Text_GainList
├── Loss_Area
│   └── Text_LossList
├── Warning_Area
│   └── Text_Warning
└── Button_Area
    ├── Button_Cancel
    └── Button_ConfirmResearch
```

---

## 20.3 示例

```text
[火箭矢] 互斥科技
解锁高爆燃烧箭，但会锁定其他箭矢

消耗：
黄金 360
木材 160
金属 80
研究时间 60秒

获得：
· 弓兵可切换火箭模式
· 攻击点燃敌人
· 对木系单位伤害 +25%

代价：
· 与毒箭矢互斥
· 与穿甲箭矢互斥

[取消] [确认研究]
```

---

# 二十一、点击科技卡后的流程

## 21.1 可研究时

如果当前没有研究中科技：

```text
点击科技卡
→ 扣除资源
→ 科技进入 ResearchingSlot
→ 卡片显示研究中
→ 研究队列区播放加入动画
```

如果当前已有研究中科技，且允许研究队列：

```text
点击科技卡
→ 扣除资源
→ 科技加入 WaitingResearchContent
→ 等待科技右上角显示取消按钮
```

如果不允许研究队列：

```text
点击科技卡
→ 提示已有科技研究中
```

---

## 21.2 不可研究时

```text
点击科技卡
→ 不加入研究队列
→ 打开 TechInfoTooltip
→ Warning_Area 显示原因
→ 对应资源 / 条件 / 互斥区域闪红
```

---

## 21.3 取消等待科技

```text
点击 ResearchQueueItem_Waiting 右上角 Button_Cancel
→ 取消该等待科技
→ 返还资源
→ 后续等待队列顺序前移
```

---

## 21.4 取消正在研究科技

```text
点击 ResearchingSlot 的 Button_CancelResearching
→ 弹出确认，可选
→ 取消当前研究
→ 返还部分资源
→ 等待队列第一个科技进入研究中
```

推荐：

```text
PC端可直接取消。
手机端建议弹一次确认，避免误点。
```

---

# 二十二、横向滑动规则

## 22.1 科技列表滑动：手机端

```text
在 TechScrollView 内横向拖动 → 列表滑动
移动距离超过 12px → 视为拖动
长按 0.35s → 显示 Tips
长按后移动超过 20px → 关闭 Tips，进入拖动
```

防误触优先级：

```text
拖动 > 长按 > 点击
```

---

## 22.2 科技列表滑动：PC端

```text
鼠标滚轮 → 横向滚动
鼠标拖动 → 横向滚动
点击左右箭头 → 翻页
悬停卡片 → Tips
```

---

## 22.3 等待队列滑动

如果等待研究队列过长：

```text
WaitingResearchScrollView 可横向滑动。
```

规则与科技列表一致，但长按队列项优先显示取消操作。

---

# 二十三、推荐 Unity 组件

## 23.1 UI_TechPanel

```text
CanvasGroup
RectTransform
Animator / DOTween
```

## 23.2 WaitingResearchContent

```text
HorizontalLayoutGroup
ContentSizeFitter
```

## 23.3 CategoryContent

```text
HorizontalLayoutGroup
ContentSizeFitter
```

## 23.4 TechContent

```text
HorizontalLayoutGroup
ContentSizeFitter
```

## 23.5 TechScrollView

```text
ScrollRect
Mask / RectMask2D
```

## 23.6 TechCard_Item

```text
Button
CanvasGroup
LayoutElement
EventTrigger
IPointerEnterHandler
IPointerDownHandler
IPointerExitHandler
```

## 23.7 TechInfoTooltip

```text
CanvasGroup
VerticalLayoutGroup
ContentSizeFitter
```

## 23.8 TechConfirmTooltip

```text
CanvasGroup
VerticalLayoutGroup
ContentSizeFitter
```

---

# 二十四、控件命名规范

建议程序统一使用以下命名：

```text
UI_TechPanel
Panel_Background

Header_Area
Text_Title
Text_SelectedBuilding
Button_Close

ResearchQueue_Area
Text_QueueTitle
ResearchingSlot
Image_TechIcon
Image_ProgressRing
Image_ProgressFill
Text_ResearchingLabel
Text_RemainTime
Button_CancelResearching

WaitingResearchScrollView
WaitingResearchContent
ResearchQueueItem_Waiting
Image_BG
Image_TechIcon
Text_OrderIndex
Button_Cancel
Image_CancelBG
Image_CancelIcon
Image_WaitingState

Category_Area
CategoryScrollView
CategoryContent
Btn_Category_All
Btn_Category_Military
Btn_Category_Economy
Btn_Category_Building
Btn_Category_Defense
Btn_Category_Faction
Btn_Category_Special

TechList_Area
Button_PageLeft
Button_PageRight
TechScrollView
TechContent
TechCard_Item

Text_TechName
Image_TechPreview
Cost_Area
CostItem_Wood
CostItem_Gold
CostItem_Stone
CostItem_Metal
CostItem_Special

ResearchTime_Area
Image_TimeIcon
Text_ResearchTime

State_Overlay
Image_DarkMask
Image_LockIcon
Image_WarningIcon
Image_MutexIcon
Image_CompletedIcon
Text_StateReason

Image_SelectedBorder
Image_RecommendGlow
Button_ClickArea

TechInfoTooltip
Tooltip_BG
Tooltip_Header
Tooltip_Cost_Area
Tooltip_Effect_Area
Tooltip_Unlock_Area
Tooltip_Target_Area
Tooltip_Condition_Area
Tooltip_Mutex_Area
Tooltip_Warning_Area

TechConfirmTooltip
Button_Cancel
Button_ConfirmResearch
```

---

# 二十五、状态颜色建议

| 状态 | 颜色 |
|---|---|
| 可研究 | 阵营主题色 |
| 悬停 | 主题色提亮 |
| 选中 | 金色 / 阵营亮色 |
| 资源不足 | 红色 |
| 条件不足 | 灰色 |
| 前置不足 | 灰色 |
| 建筑等级不足 | 灰色 |
| 互斥锁定 | 红橙色 |
| 已完成 | 绿色 / 金色 |
| 研究中 | 阵营主题色流光 |
| 队列满 | 黄色 |
| 研究暂停 | 灰蓝 |
| 推荐研究 | 柔和呼吸亮边 |

---

# 二十六、最终视觉结构

最终视觉结构应该是：

```text
屏幕中下方一个横向科技面板

顶部：
科技面板标题 + 当前科技建筑

中上：
研究队列
左侧：正在研究科技，带进度和剩余时间
右侧：等待研究科技图标列表
等待科技图标右上角有取消按钮

中间：
科技分类栏
[全部] [军事] [经济] [建筑] [防御] [阵营] [特殊]

中下：
横向滑动科技列表

每个科技卡：
上方科技名称
中间科技图片
底部资源 ICON + 数字

悬停或长按：
显示科技信息 Tips
```

---

# 二十七、最终操作逻辑

```text
能研究 → 点击开始研究或加入研究队列。
不能研究 → 点击或悬停显示原因。
拖动 → 左右浏览科技。
长按 / 悬停 → 查看完整信息。
点击等待科技右上角 X → 取消等待研究。
点击正在研究 X → 取消当前研究。
高风险科技 → 点击弹确认 Tips。
关闭 → 返回普通建筑面板。
```

---

# 二十八、最终硬规则

```text
1. 科技面板必须放在屏幕中下方。
2. 科技面板不能全屏。
3. 科技面板不能放在右边独占一列。
4. 科技页面上方必须显示研究队列。
5. 研究队列必须区分正在研究和等待研究。
6. 等待研究科技图标右上角必须有取消按钮。
7. 科技列表必须横向滑动。
8. 科技必须按分类显示。
9. 分类至少包含：全部、军事、经济、建筑、防御、阵营、特殊。
10. 每个科技卡上方必须显示科技名称。
11. 每个科技卡中间必须显示科技图片。
12. 每个科技卡底部必须显示资源 ICON + 数字。
13. 资源不足、条件不足、前置不足、互斥、队列满必须有明确提示。
14. 鼠标悬停必须显示科技 Tips。
15. 手机长按必须显示科技 Tips。
16. 点击可研究科技开始研究或加入队列。
17. 点击不可研究科技打开 Tips 并高亮原因。
18. 高风险、路线、互斥科技必须弹确认 Tips。
19. UI 控件命名必须清楚，方便程序绑定。
```

---

# 二十九、一句话总结

```text
科技页面应该是屏幕中下方的横向科技研究条：上方显示研究中和等待队列，中间显示分类栏，下方显示科技图片卡片，卡片底部显示资源消耗，无法研究必须明确提示，悬停/长按显示科技详情 Tips。
```

## 2026-05-18 运行时接线补充

```text
当前科技页已经切换为“预制体主导”模式：

1. `TechTreeRoot_Prefab`
   - 负责整页宿主、Dim、PC/移动双面板根节点
   - 负责 Header / Category / TechList / Queue / Tips 的基础层级

2. `TechBranchTab_Prefab`
   - 负责科技分类按钮的静态尺寸、文字区、按钮样式
   - 代码只负责：分类名、可研究数量后缀、点击切换

3. `ResearchButton_Prefab`
   - 负责科技卡的固定排版：名称、图标、CostRow、状态遮罩、角标、进度条
   - 代码只负责：科技名称、图标、资源消耗、状态文案、研究进度、点击逻辑

4. `FloatingTechTipsPage`
   - 仍作为详情 Tips 宿主
   - 当前详细内容仍由代码填充文本，但位置和面板尺寸优先保留 prefab
```

```text
这轮开始不再把科技页主面板、分类区、科技列表区、研究队列区当作运行时新拼的大面板处理。
后续如果要继续调科技页的位置、大小、背景、分区间距，优先直接改：

- `TechTreePanel` / `TechTreePanel_PC`
- `NavHeader` / `TopBar_PC`
- `TechTabs` / `BranchNav_PC`
- `TechResearchListPage` / `TechResearchListPage_PC`
- `ResearchQueuePage` / `ResearchQueue_PC`
```
## 2026-05-18 科技页第二轮收口补充

```text
1. 科技卡实例化入口已继续收口：
   - `TechNode_*` / `PcTechNode_*` 运行时卡片统一实例化 `ResearchButton_Prefab`
   - 历史 `TechNode` 类型只作为序列化枚举占位保留，不再作为可见旧 UI 入口

2. 科技页滚动区继续改为“优先复用 prefab 内现成滚动宿主”：
   - 如果页面内已有 `TechScrollView / CategoryScrollView / WaitingResearchScrollView`
   - 代码优先在这些节点下面绑定 `Viewport / Content`
   - 不再默认把 `ScrollRect` 直接挂在最外层页面根节点上覆盖布局

3. 研究队列区当前实现边界：
   - 优先绑定 `ResearchingSlot / CurrentResearch / CurrentResearchSlot`
   - 优先绑定 `QueueTitle / QueueStatus / EmptyLabel`
   - 等待队列区只清理并保留 `WaitingResearchContent / WaitingQueueContent` 结构
   - 当前后端 `ResearchQueue` 仍只有单研究位，所以等待队列暂不生成伪条目

4. 代码与 prefab 的职责边界再次明确：
   - prefab 负责：位置、大小、背景、标题区、滚动容器、卡片固定子节点
   - 代码负责：科技名称、图标、资源消耗、状态文案、研究进度、显隐、点击
```

## 2026-05-18 科技页第三轮规则补充

```text
1. `TechTabs / BranchNav_PC` 现在允许在 prefab 内放固定滚动宿主：
   - `CategoryScrollView`
   - `Viewport`
   - `CategoryContent`
   运行时不应再整块清空父节点，否则会把这些可编辑宿主节点删掉。

2. `TechResearchListPage / TechResearchListPage_PC` 现在允许在 prefab 内放固定滚动宿主：
   - `TechScrollView`
   - `Viewport`
   - `TechContent`
   运行时只清理 `TechContent` 里的动态科技卡，不删除滚动容器本身。

3. 技术规则更新：
   - 分类区与科技列表区改为“清理动态子项”而不是“清空整块父节点”
   - 后续如果继续补 `ResearchQueuePage / ResearchQueue_PC` 的固定槽位，也应遵循同样规则
```

## 2026-05-18 科技页第四轮规则补充

```text
1. 研究队列区当前优先复用现成组件 prefab：
   - 来源：`SelectionBuildingTechTreePage_Prefab`
   - 优先复用节点：`ResearchQueueTitle / ResearchQueueViewport / ResearchQueueContent / CurrentResearch / EmptyLabel`

2. 当 `ResearchQueuePage / ResearchQueue_PC` 自身还没补齐固定子节点时：
   - 运行时允许先从 `SelectionBuildingTechTreePage_Prefab` 克隆上述队列子结构到页面根队列容器中
   - 目的是先让研究队列内部结构回到 prefab 可编辑节点，而不是继续用纯代码拼标题和卡片

3. 当前绑定规则补充：
   - 当前研究名称优先绑定 `Label / Name / NameLabel`
   - 剩余时间优先绑定 `TimeLabel / Text_RemainTime / RemainingLabel`
   - 当前研究根节点优先绑定页面内 `CurrentResearch`，其次允许从 `ResearchQueueViewport/ResearchQueueContent/CurrentResearch` 获取
```
