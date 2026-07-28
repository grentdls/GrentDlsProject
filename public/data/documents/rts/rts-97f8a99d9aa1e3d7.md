# 造兵页面 UI 预制体布局结构说明

## 一、整体目标

当前造兵页面需要重做为：

```text
屏幕中下方显示一个横向造兵列表区域。
每个士兵 / 单位是独立卡片。
卡片上方显示单位名称。
卡片中间显示单位图片。
卡片底部显示资源消耗 ICON + 数字。
无法造兵时必须有清楚提醒。
列表可以左右滑动。
鼠标悬停 / 点击 / 手机长按后显示单位信息 Tips。
造兵页面上方显示正在制造和等待制造队列。
等待制造的单位图标右上角有取消按钮。
集结点按钮单独放在 UI 右侧。
```

该文档用于指导程序制作 Unity UI 预制体。

---

# 二、整体位置规则

## 2.1 造兵面板位置

```text
位置：屏幕中下方
Anchor：Bottom Center
Pivot：0.5, 0
距离屏幕底部：80~120px
```

如果底部有技能按钮或操作栏：

```text
造兵面板位于技能按钮上方 20~30px。
```

## 2.2 PC端尺寸

```text
宽度：900~1120px
高度：300~360px
距离底部：70px
```

## 2.3 手机端尺寸

```text
宽度：屏幕宽度 90%
高度：310~380px
距离底部：技能区上方 20px
```

---

# 三、Prefab 总结构

```text
UI_TrainPanel
├── Panel_Background
├── Header_Area
│   ├── Text_Title
│   ├── Text_SelectedBuilding
│   └── Button_Close
├── Queue_Area
│   ├── Text_QueueTitle
│   ├── ProducingSlot
│   │   ├── Image_UnitIcon
│   │   ├── Image_ProgressRing
│   │   ├── Image_ProgressFill
│   │   ├── Text_ProducingLabel
│   │   ├── Text_RemainTime
│   │   └── Button_CancelProducing
│   └── WaitingQueueScrollView
│       └── Viewport
│           └── WaitingQueueContent
│               ├── QueueItem_Waiting
│               ├── QueueItem_Waiting
│               └── QueueItem_Waiting
├── TrainList_Area
│   ├── Button_PageLeft
│   ├── TrainScrollView
│   │   └── Viewport
│   │       └── TrainContent
│   │           ├── TrainCard_Item
│   │           ├── TrainCard_Item
│   │           └── TrainCard_Item
│   ├── Button_PageRight
│   └── Scroll_ProgressBar
├── RallyPoint_Area
│   └── Button_RallyPoint
│       ├── Image_ButtonBG
│       ├── Image_RallyIcon
│       ├── Text_RallyLabel
│       └── Image_RallyState
├── TipAnchor_Area
│   └── UnitTrainInfoTooltip
└── Input_Blocker_Optional
```

---

# 四、上下结构说明

最终面板从上到下分为 4 个主要区域：

```text
1. Header_Area：标题区
2. Queue_Area：制造队列区
3. TrainList_Area：横向单位列表区
4. Scroll_ProgressBar：列表滑动位置提示
```

右侧独立区域：

```text
RallyPoint_Area：集结点按钮
```

整体结构示意：

```text
┌────────────────────────────────────────────────────┐
│ Header：造兵 / 当前建筑 / 关闭按钮                  │
├────────────────────────────────────────────────────┤
│ Queue：正在制造 + 等待制造队列                      │
│ [制造中 进度] [等待1 x] [等待2 x] [等待3 x]          │
├────────────────────────────────────────────────────┤
│ TrainList：横向单位列表                             │
│ ← [单位卡][单位卡][单位卡][单位卡] →                 │
├────────────────────────────────────────────────────┤
│ 滑动进度条                                          │
└────────────────────────────────────────────────────┘
                                      [集结点按钮]
```

---

# 五、根节点：UI_TrainPanel

## 5.1 用途

```text
整个造兵页面根节点。
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
承载整个造兵面板的视觉底板。
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
造兵
```

或根据建筑显示：

```text
步兵营造兵
飞兽巢造兵
机场生产
水灵源池召唤
```

样式：

```text
左对齐
字号：16~18
加粗
颜色：主文字色
```

## 7.4 Text_SelectedBuilding

显示当前造兵建筑：

```text
当前建筑：步兵营
```

简化显示：

```text
步兵营
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
功能：关闭造兵面板
```

手机端可选：

```text
如果使用系统返回键关闭，可以隐藏关闭按钮。
```

---

# 八、制造队列区：Queue_Area

## 8.1 作用

Queue_Area 显示：

```text
当前正在制造的单位
等待制造的单位
制造进度
剩余时间
等待队列取消按钮
队列满 / 暂停 / 出口堵塞等状态
```

该区域必须放在单位列表上方。

## 8.2 Queue_Area 结构

```text
Queue_Area
├── Text_QueueTitle
├── ProducingSlot
│   ├── Image_UnitIcon
│   ├── Image_ProgressRing
│   ├── Image_ProgressFill
│   ├── Text_ProducingLabel
│   ├── Text_RemainTime
│   └── Button_CancelProducing
└── WaitingQueueScrollView
    └── Viewport
        └── WaitingQueueContent
            ├── QueueItem_Waiting
            ├── QueueItem_Waiting
            └── QueueItem_Waiting
```

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

## 8.4 Text_QueueTitle

显示：

```text
制造队列
```

或更短：

```text
队列
```

位置：

```text
Queue_Area 左上角
```

样式：

```text
字号：12~14
颜色：次级文字色
```

---

# 九、正在制造槽：ProducingSlot

## 9.1 用途

显示当前正在制造的单位。

如果队列中有单位，ProducingSlot 必须始终显示第一个正在制造单位。

## 9.2 ProducingSlot 结构

```text
ProducingSlot
├── Image_UnitIcon
├── Image_ProgressRing
├── Image_ProgressFill
├── Text_ProducingLabel
├── Text_RemainTime
└── Button_CancelProducing
```

## 9.3 显示内容

```text
单位头像 / 单位图标
制造中标签
环形进度或横向进度
剩余时间
取消按钮，可选
```

示例：

```text
[盾兵头像]
制造中
62%
剩余 8s
```

## 9.4 样式

```text
尺寸：64~78px 宽
背景：阵营色暗底
边框：阵营亮色
进度：阵营主色
```

正在制造的单位要比等待单位更大、更亮。

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

## 9.6 Button_CancelProducing

制造中单位是否允许取消，由规则决定。

推荐：

```text
允许取消。
取消后返还 80%~100% 资源，按模式配置。
```

按钮位置：

```text
ProducingSlot 右上角
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

# 十、等待制造队列：WaitingQueueScrollView

## 10.1 用途

显示制造队列中等待制造的单位。

等待制造单位必须显示取消按钮。

## 10.2 结构

```text
WaitingQueueScrollView
└── Viewport
    └── WaitingQueueContent
        ├── QueueItem_Waiting
        ├── QueueItem_Waiting
        └── QueueItem_Waiting
```

## 10.3 QueueItem_Waiting 结构

```text
QueueItem_Waiting
├── Image_BG
├── Image_UnitIcon
├── Text_OrderIndex
├── Button_Cancel
│   ├── Image_CancelBG
│   └── Image_CancelIcon
└── Image_WaitingState
```

## 10.4 等待单位显示内容

每个等待单位显示：

```text
单位图标
等待顺序
右上角取消按钮
```

示例：

```text
[长枪兵图标] 2  X
[弓兵图标]   3  X
[盾兵图标]   4  X
```

## 10.5 Button_Cancel

位置：

```text
QueueItem_Waiting 右上角
```

尺寸：

```text
视觉尺寸：18~22px
实际热区：28~32px
```

功能：

```text
点击取消该等待制造单位。
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

## 10.6 等待队列横向滚动

如果等待单位很多：

```text
WaitingQueueScrollView 可以横向滑动。
```

PC端：

```text
鼠标滚轮 / 拖拽滚动。
```

手机端：

```text
手指左右滑动。
```

## 10.7 队列为空状态

如果没有正在制造和等待制造：

```text
ProducingSlot 为空槽
WaitingQueueContent 显示空状态
```

显示：

```text
队列为空
点击下方单位开始制造
```

手机端简化：

```text
队列为空
```

## 10.8 队列满状态

如果队列达到上限：

```text
Queue_Area 右侧显示：队列满
单位卡片显示队列满提示
```

---

# 十一、单位列表区：TrainList_Area

## 11.1 结构

```text
TrainList_Area
├── Button_PageLeft
├── TrainScrollView
│   └── Viewport
│       └── TrainContent
│           ├── TrainCard_Item
│           ├── TrainCard_Item
│           └── TrainCard_Item
├── Button_PageRight
└── Scroll_ProgressBar
```

## 11.2 位置

```text
Queue_Area 下方
占据面板主体区域
高度：150~180px
```

## 11.3 横向滑动

ScrollRect 设置：

```text
Horizontal = true
Vertical = false
Movement Type = Elastic 或 Clamped
```

手机端：

```text
手指左右滑动单位列表。
```

PC端：

```text
鼠标滚轮 / 鼠标拖拽 / 左右翻页按钮。
```

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

## 11.5 滑动进度条

```text
Scroll_ProgressBar
```

位置：

```text
单位列表底部
```

表现：

```text
细线
显示当前滑动位置
手机端使用短进度条，不使用粗滚动条
```

---

# 十二、单位卡片：TrainCard_Item

## 12.1 重要性

单位卡片是造兵页面最重要的交互单元。

每个单位必须是独立卡片。

## 12.2 TrainCard_Item 结构

```text
TrainCard_Item
├── Image_CardBG
├── Text_UnitName
├── Image_UnitPreview
├── Cost_Area
│   ├── CostItem_Wood
│   ├── CostItem_Gold
│   ├── CostItem_Stone
│   ├── CostItem_Metal
│   ├── CostItem_Population
│   └── CostItem_Special
├── TrainTime_Area
│   ├── Image_TimeIcon
│   └── Text_TrainTime
├── State_Overlay
│   ├── Image_DarkMask
│   ├── Image_LockIcon
│   ├── Image_WarningIcon
│   └── Text_StateReason
├── Image_SelectedBorder
├── Image_RecommendGlow
└── Button_ClickArea
```

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

# 十三、单位卡片上方：Text_UnitName

## 13.1 位置

```text
卡片最上方
高度：22~26px
```

## 13.2 内容

显示单位名称。

示例：

```text
盾兵
长枪兵
弓兵
麒麟骑兵
机械狗
主战坦克
火灵
水灵
```

## 13.3 显示规则

```text
最多显示 5 个字
超过用缩略名
完整名在 Tips 里显示
```

## 13.4 样式

```text
居中
加粗
字号：12~14
颜色：白色或阵营浅色
```

---

# 十四、单位卡片中间：Image_UnitPreview

## 14.1 位置

```text
名称下方
卡片中间
```

## 14.2 尺寸

```text
手机：72~82px
PC：78~88px
```

## 14.3 图片要求

```text
显示单位头像 / 半身图 / 小渲染图。
透明背景。
单位主体居中。
不能带场景背景。
不能带文字。
剪影要清楚。
```

## 14.4 视觉规则

```text
单位图片是卡片最大区域。
玩家应优先通过图片识别单位。
```

---

# 十五、单位卡片底部：Cost_Area

## 15.1 位置

```text
卡片底部
高度：36~46px
```

## 15.2 结构

```text
Cost_Area
├── CostItem_Wood
├── CostItem_Gold
├── CostItem_Stone
├── CostItem_Metal
├── CostItem_Population
└── CostItem_Special
```

每个 CostItem：

```text
CostItem_xxx
├── Image_Icon
└── Text_Value
```

## 15.3 排布

推荐两行排布：

```text
木材60  黄金90
金属30  人口2
```

每行最多 2~3 个资源。

## 15.4 资源显示优先级

卡片空间不足时，只显示最关键资源。

```text
1. 黄金
2. 木材
3. 金属
4. 石料
5. 人口
6. 特殊人口 / 电力 / 融合人口
```

完整消耗在 Tips 中显示。

## 15.5 图标与数字

```text
图标尺寸：14~16px
数字字号：11~12
资源足够：白色 / 浅色
资源不足：红色
```

---

# 十六、训练时间：TrainTime_Area

## 16.1 是否显示

建议在单位卡片右下角显示训练时间。

```text
18s
```

如果手机空间不足：

```text
可以只在 Tips 中显示训练时间。
```

## 16.2 结构

```text
TrainTime_Area
├── Image_TimeIcon
└── Text_TrainTime
```

## 16.3 样式

```text
图标尺寸：12~14px
字号：10~11
颜色：淡黄 / 次级文字色
```

---

# 十七、无法造兵状态：State_Overlay

无法造兵时必须清楚提示，不能只灰掉。

## 17.1 State_Overlay 结构

```text
State_Overlay
├── Image_DarkMask
├── Image_LockIcon
├── Image_WarningIcon
└── Text_StateReason
```

## 17.2 资源不足

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
```

注意：

```text
不要把单位图片完全盖死。
单位图片仍需可辨认。
```

## 17.3 人口不足

表现：

```text
人口数字变红。
Image_WarningIcon 显示人口警告。
Text_StateReason：人口不足。
```

特殊情况：

```text
融合人口不足
能耗不足
妖核不足
灵智不足
```

## 17.4 科技未解锁

表现：

```text
灰色遮罩
显示 Image_LockIcon
Text_StateReason：未解锁
```

Tips 中显示完整原因：

```text
需要科技：盾墙训练
需要建筑等级：兵营2级
```

## 17.5 建筑等级不足

表现：

```text
锁图标
Text_StateReason：建筑等级不足
```

Tips 显示：

```text
需要兵营 2级
当前兵营 1级
```

## 17.6 队列已满

表现：

```text
黄色警告图标
Text_StateReason：队列满
```

点击时：

```text
队列区闪烁
提示：制造队列已满
```

## 17.7 建筑停产

停产原因：

```text
断电
断供
被控制
出口堵塞
暂停生产
```

表现：

```text
灰蓝遮罩
Text_StateReason：生产暂停
```

Tips 显示具体原因。

---

# 十八、单位信息 Tips：UnitTrainInfoTooltip

## 18.1 触发方式

PC：

```text
鼠标悬停 TrainCard_Item 0.25 秒。
```

手机：

```text
长按 TrainCard_Item 0.35 秒。
```

点击规则：

```text
短按单位卡：如果可造 → 加入制造队列。
短按单位卡：如果不可造 → 打开 Tips 并高亮原因。
```

## 18.2 Tips 预制体结构

```text
UnitTrainInfoTooltip
├── Tooltip_BG
├── Header
│   ├── Image_UnitIcon
│   ├── Text_UnitName
│   └── Text_UnitType
├── Tag_Area
├── Stat_Area
├── Cost_Area
├── Skill_Area
├── Counter_Area
├── Condition_Area
└── Warning_Area
```

## 18.3 Tips 显示内容

```text
单位图
单位名称
单位类型
一句话定位
生命 / 攻击 / 护甲 / 移速 / 射程
完整资源消耗
训练时间
人口消耗
技能
克制目标
被克制目标
未满足条件
```

## 18.4 Tips 示例

```text
[麒麟骑兵] 精锐骑兵
高速冲锋，撕开远程阵型

生命 1350
攻击 82
护甲 6
移速 5.3
人口 6

消耗：
木材 160
黄金 460
金属 180
人口 6

技能：
· 麒麟踏阵：冲锋路径造成范围震荡

克制：
强：远程阵地 / 密集步兵
弱：枪阵 / 减速 / 穿甲

条件：
需要科技：麒麟军阵
```

## 18.5 Tips 位置规则

PC：

```text
优先显示在鼠标右上方。
如果右侧空间不足，显示在左侧。
不能遮挡当前单位卡。
```

手机：

```text
显示在屏幕中下方或造兵面板上方。
宽度约屏幕 86%。
最大高度约屏幕 60%。
超出可滚动。
```

---

# 十九、集结点区域：RallyPoint_Area

## 19.1 设计目标

集结点按钮必须独立放在造兵 UI 右侧。

不能混在单位卡列表里。

## 19.2 结构

```text
RallyPoint_Area
└── Button_RallyPoint
    ├── Image_ButtonBG
    ├── Image_RallyIcon
    ├── Text_RallyLabel
    └── Image_RallyState
```

## 19.3 位置

```text
UI_TrainPanel 右侧
垂直居中或靠近 Queue_Area 与 TrainList_Area 中间
```

示意：

```text
┌──────────────────────────────┐
│ 队列区                       │   [集结点]
├──────────────────────────────┤
│ 造兵列表                     │
└──────────────────────────────┘
```

## 19.4 按钮尺寸

PC端：

```text
视觉尺寸：52~60px
实际点击热区：64~72px
```

手机端：

```text
视觉尺寸：58~66px
实际点击热区：72~80px
```

## 19.5 图标

推荐图标：

```text
旗帜 + 箭头
```

阵营样式：

| 阵营 | 图标风格 |
|---|---|
| 华夏 | 军旗 |
| 妖族 | 骨旗 / 妖血旗 |
| 机械 | 信标 / 定位塔 |
| 自然 | 灵旗 / 光点种子 |
| 融合阵营 | 双阵营混合旗 |

## 19.6 状态

### 未设置集结点

```text
按钮灰色
Text_RallyLabel：集结点
Image_RallyState 隐藏
```

### 已设置集结点

```text
按钮阵营色高亮
Image_RallyState 显示小亮点
```

### 设置中

```text
按钮闪烁
Text_RallyLabel：设置中
```

### 集结点不可达

```text
按钮黄色警告
Text_RallyLabel：不可达
```

## 19.7 点击逻辑

点击集结点按钮：

```text
进入设置集结点模式。
```

PC端：

```text
鼠标变成旗帜光标。
左键点击地面设置集结点。
右键取消。
```

手机端：

```text
屏幕中心出现集结点旗帜虚影。
拖动地图选择位置。
右上确认。
左上取消。
```

## 19.8 设置成功表现

```text
建筑到集结点之间短暂显示虚线。
集结点位置出现阵营旗帜。
旗帜停留 1.5 秒后淡化。
集结点按钮变为已设置状态。
```

---

# 二十、点击单位卡后的流程

## 20.1 可造兵时

```text
点击单位卡
→ 扣除资源
→ 单位加入制造队列
→ 如果当前无制造中单位，则立即进入 ProducingSlot
→ 如果已有制造中单位，则加入 WaitingQueueContent
→ 单位卡播放点击反馈
→ 队列区播放加入动画
```

## 20.2 不可造兵时

```text
点击单位卡
→ 不加入队列
→ 打开 UnitTrainInfoTooltip
→ Warning_Area 显示原因
→ 对应资源 / 条件 / 人口闪红
```

## 20.3 取消等待单位

```text
点击 QueueItem_Waiting 右上角 Button_Cancel
→ 取消该等待单位
→ 返还资源
→ 后续等待队列顺序前移
```

## 20.4 取消制造中单位

```text
点击 ProducingSlot 的 Button_CancelProducing
→ 弹出确认，可选
→ 取消当前制造
→ 返还资源
→ 等待队列第一个单位进入制造中
```

推荐：

```text
PC端可直接取消。
手机端建议弹一次确认，避免误点。
```

---

# 二十一、横向滑动规则

## 21.1 单位列表滑动：手机端

```text
在 TrainScrollView 内横向拖动 → 列表滑动
移动距离超过 12px → 视为拖动
长按 0.35s → 显示 Tips
长按后移动超过 20px → 关闭 Tips，进入拖动
```

防误触优先级：

```text
拖动 > 长按 > 点击
```

## 21.2 单位列表滑动：PC端

```text
鼠标滚轮 → 横向滚动
鼠标拖动 → 横向滚动
点击左右箭头 → 翻页
悬停卡片 → Tips
```

## 21.3 等待队列滑动

如果等待队列过长：

```text
WaitingQueueScrollView 可横向滑动。
```

规则与单位列表一致，但长按队列项优先显示取消操作。

---

# 二十二、推荐 Unity 组件

## 22.1 UI_TrainPanel

```text
CanvasGroup
RectTransform
Animator / DOTween
```

## 22.2 WaitingQueueContent

```text
HorizontalLayoutGroup
ContentSizeFitter
```

## 22.3 TrainContent

```text
HorizontalLayoutGroup
ContentSizeFitter
```

## 22.4 TrainScrollView

```text
ScrollRect
Mask / RectMask2D
```

## 22.5 TrainCard_Item

```text
Button
CanvasGroup
LayoutElement
EventTrigger
IPointerEnterHandler
IPointerDownHandler
IPointerExitHandler
```

## 22.6 UnitTrainInfoTooltip

```text
CanvasGroup
VerticalLayoutGroup
ContentSizeFitter
```

## 22.7 Button_RallyPoint

```text
Button
CanvasGroup
EventTrigger
```

---

# 二十三、控件命名规范

建议程序统一使用以下命名：

```text
UI_TrainPanel
Panel_Background

Header_Area
Text_Title
Text_SelectedBuilding
Button_Close

Queue_Area
Text_QueueTitle
ProducingSlot
Image_UnitIcon
Image_ProgressRing
Image_ProgressFill
Text_ProducingLabel
Text_RemainTime
Button_CancelProducing

WaitingQueueScrollView
WaitingQueueContent
QueueItem_Waiting
Image_BG
Image_UnitIcon
Text_OrderIndex
Button_Cancel
Image_CancelBG
Image_CancelIcon
Image_WaitingState

TrainList_Area
Button_PageLeft
Button_PageRight
TrainScrollView
TrainContent
TrainCard_Item

Text_UnitName
Image_UnitPreview
Cost_Area
CostItem_Wood
CostItem_Gold
CostItem_Stone
CostItem_Metal
CostItem_Population
CostItem_Special
TrainTime_Area
Image_TimeIcon
Text_TrainTime

State_Overlay
Image_DarkMask
Image_LockIcon
Image_WarningIcon
Text_StateReason

Image_SelectedBorder
Image_RecommendGlow
Button_ClickArea

RallyPoint_Area
Button_RallyPoint
Image_ButtonBG
Image_RallyIcon
Text_RallyLabel
Image_RallyState

UnitTrainInfoTooltip
Tooltip_BG
Tooltip_Header
Tooltip_Stat_Area
Tooltip_Cost_Area
Tooltip_Skill_Area
Tooltip_Counter_Area
Tooltip_Condition_Area
Tooltip_Warning_Area
```

---

# 二十四、状态颜色建议

| 状态 | 颜色 |
|---|---|
| 可制造 | 阵营主题色 |
| 悬停 | 主题色提亮 |
| 选中 | 金色 / 阵营亮色 |
| 资源不足 | 红色 |
| 人口不足 | 红色 |
| 条件不足 | 灰色 |
| 队列满 | 黄色 |
| 生产暂停 | 灰蓝 |
| 出口堵塞 | 橙色 |
| 推荐制造 | 柔和呼吸亮边 |
| 制造中进度 | 阵营主题色 |
| 等待队列 | 中性灰 |
| 集结点已设置 | 阵营主题色 |
| 集结点不可达 | 黄色 |

---

# 二十五、最终视觉结构

最终视觉结构应该是：

```text
屏幕中下方一个横向造兵面板

顶部：
造兵面板标题 + 当前建筑

中上：
制造队列
左侧：正在制造单位，带进度和剩余时间
右侧：等待制造单位图标列表
等待单位图标右上角有取消按钮

中间：
横向滑动单位列表

每个单位卡：
上方单位名称
中间单位图片
底部资源 ICON + 数字

右侧：
独立集结点按钮

悬停或长按：
显示单位信息 Tips
```

---

# 二十六、最终操作逻辑

```text
能造 → 点击加入制造队列。
不能造 → 点击或悬停显示原因。
拖动 → 左右浏览单位。
长按 / 悬停 → 查看完整信息。
点击等待单位右上角 X → 取消等待制造。
点击正在制造 X → 取消当前制造。
点击集结点按钮 → 进入设置集结点模式。
关闭 → 返回普通建筑面板。
```

---

# 二十七、最终硬规则

```text
1. 造兵面板必须放在屏幕中下方。
2. 造兵面板不能放在右边独占一列。
3. 造兵页面上方必须显示制造队列。
4. 制造队列必须区分正在制造和等待制造。
5. 等待制造单位图标右上角必须有取消按钮。
6. 单位列表必须横向滑动。
7. 每个单位卡上方必须显示单位名称。
8. 每个单位卡中间必须显示单位图片。
9. 每个单位卡底部必须显示资源 ICON + 数字。
10. 资源不足、人口不足、条件不足、队列满必须有明确提示。
11. 鼠标悬停必须显示单位 Tips。
12. 手机长按必须显示单位 Tips。
13. 点击可造单位加入制造队列。
14. 点击不可造单位打开 Tips 并高亮原因。
15. 集结点按钮必须独立放在造兵 UI 右侧。
16. 集结点按钮不能混在单位列表里。
17. UI 控件命名必须清楚，方便程序绑定。
```

---

# 二十八、一句话总结

```text
造兵页面应该是屏幕中下方的横向单位生产条：上方显示制造中和等待队列，中间显示单位图片卡片，底部显示资源消耗，右侧独立放集结点按钮，无法造兵必须明确提示，悬停/长按显示单位详情 Tips。
```

---

## 2026-05-20 - 当前实现补充规则：页面内容与建筑操作分离

- 本文历史示意里的 `RallyPoint_Area` / `Button_RallyPoint` 已不再作为造兵内容页结构。
- 内嵌造兵页 `SelectionBuildingProductionPage_Prefab` 不允许包含 `RallyPointFloatingButton`。
- 独立造兵页 `UnitProductionPanel_Prefab` 的队列页固定为 `ProductionQueuePage`，不允许包含 `RallyPointButton` 或 `RallyPointStatus`。
- 造兵页面只负责单位列表、分类、队列、详情和状态提示；集结点、升级、拆除、科技入口等建筑操作按钮统一放入建筑操作区。
- 移动端集结点入口走 `SelectionPanel` 的建筑操作区或 `MobileUnitActionOverlay`，不放回造兵内容页，也不恢复已删除的旧移动动作条。
