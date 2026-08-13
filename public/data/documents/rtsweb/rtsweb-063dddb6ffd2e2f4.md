# 建造页面 UI 预制体布局结构说明

## 一、整体目标

当前建造页面布局调整为：

```text
屏幕中下方显示一个横向建造列表区域。
根据功能划分建造分类。
每个建筑是独立卡片。
卡片上方显示建筑名称。
卡片中间显示建筑图片。
卡片底部显示资源消耗 ICON + 数字。
列表可以左右滑动。
鼠标悬停 / 点击 / 手机长按后显示建筑信息 Tips。
无法建造时必须有清楚提醒。
```

该文档用于指导程序制作 Unity UI 预制体。

---

# 二、整体位置规则

## 2.1 建造面板位置

```text
位置：屏幕中下方
Anchor：Bottom Center
Pivot：0.5, 0
距离屏幕底部：80~120px
```

如果底部有技能按钮或操作栏：

```text
建造面板位于技能按钮上方 20~30px。
```

## 2.2 PC端尺寸

```text
宽度：900~1100px
高度：230~260px
距离底部：70px
```

## 2.3 手机端尺寸

```text
宽度：屏幕宽度 90%
高度：240~280px
距离底部：技能区上方 20px
```

---

# 三、Prefab 总结构

```text
UI_BuildPanel
├── Panel_Background
├── Header_Area
│   ├── Text_Title
│   ├── Text_SelectedBuilder
│   └── Button_Close
├── Category_Area
│   └── CategoryScrollView
│       └── Viewport
│           └── CategoryContent
│               ├── Btn_Category_All
│               ├── Btn_Category_Resource
│               ├── Btn_Category_Military
│               ├── Btn_Category_Tech
│               ├── Btn_Category_Defense
│               └── Btn_Category_Special
├── BuildList_Area
│   ├── Button_PageLeft
│   ├── BuildScrollView
│   │   └── Viewport
│   │       └── BuildContent
│   │           ├── BuildCard_Item
│   │           ├── BuildCard_Item
│   │           └── BuildCard_Item
│   ├── Button_PageRight
│   └── Scroll_ProgressBar
├── TipAnchor_Area
│   └── BuildInfoTooltip
└── Input_Blocker_Optional
```

---

# 四、上下结构说明

最终面板从上到下分为 4 层：

```text
1. Header_Area：标题区
2. Category_Area：分类栏
3. BuildList_Area：建筑横向列表
4. Scroll_ProgressBar：滑动位置提示
```

整体示意：

```text
┌────────────────────────────────────────┐
│ Header：建造 / 当前建造单位 / 关闭按钮  │
├────────────────────────────────────────┤
│ Category：全部 资源 军队 科技 防御 特殊  │
├────────────────────────────────────────┤
│ ← [建筑卡][建筑卡][建筑卡][建筑卡] →     │
├────────────────────────────────────────┤
│ 滑动进度条                              │
└────────────────────────────────────────┘
```

---

# 五、根节点：UI_BuildPanel

## 5.1 用途

```text
整个建造页面根节点。
负责整体显示、隐藏、滑入动画。
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
承载整个建造面板的视觉底板。
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
├── Text_SelectedBuilder
└── Button_Close
```

## 7.2 位置

```text
面板最上方
高度：34~42px
```

## 7.3 Text_Title

显示：

```text
建造
```

或根据建造单位显示：

```text
工兵建造
机器工人建造
灵木使建造
建巢妖仆建造
```

样式：

```text
左对齐
字号：16~18
加粗
颜色：主文字色
```

## 7.4 Text_SelectedBuilder

显示当前执行建造的单位。

```text
当前建造单位：工兵
```

简化：

```text
工兵
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
功能：关闭建造面板 / 取消当前建造选择
```

手机端可选：

```text
如果使用系统返回键关闭，可以隐藏关闭按钮。
```

---

# 八、分类栏：Category_Area

## 8.1 结构

```text
Category_Area
└── CategoryScrollView
    └── Viewport
        └── CategoryContent
            ├── Btn_Category_All
            ├── Btn_Category_Resource
            ├── Btn_Category_Military
            ├── Btn_Category_Tech
            ├── Btn_Category_Defense
            └── Btn_Category_Special
```

## 8.2 位置

```text
Header_Area 下方
高度：38~46px
```

## 8.3 分类按钮

基础分类：

```text
全部
资源
军队
科技
防御
特殊
```

可选扩展：

```text
水域
空军
融合
终局
```

## 8.4 分类定义

### 全部

```text
显示当前单位可建造的全部建筑。
```

### 资源

```text
资源采集、资源加工、资源存储、能源相关建筑。
```

### 军队

```text
生产战斗单位的建筑。
例如兵营、兽巢、机场、船厂、元素单位建筑。
```

### 科技

```text
研究科技、解锁升级、改造、融合相关建筑。
```

### 防御

```text
防御塔、城墙、陷阱、防空、防潜、反隐建筑。
```

### 特殊

```text
主城、奇观、融合建筑、终局建筑、传送建筑等特殊功能建筑。
```

## 8.5 分类按钮结构

```text
Btn_Category_xxx
├── Image_BG
├── Image_Icon
├── Text_Name
├── Image_SelectedLine
└── Image_NewDot
```

## 8.6 分类按钮状态

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

### 有新建筑状态

```text
右上角显示 Image_NewDot
```

---

# 九、建筑列表区：BuildList_Area

## 9.1 结构

```text
BuildList_Area
├── Button_PageLeft
├── BuildScrollView
│   └── Viewport
│       └── BuildContent
│           ├── BuildCard_Item
│           ├── BuildCard_Item
│           └── BuildCard_Item
├── Button_PageRight
└── Scroll_ProgressBar
```

## 9.2 位置

```text
分类栏下方
占据面板主体区域
高度：150~180px
```

## 9.3 横向滑动

ScrollRect 设置：

```text
Horizontal = true
Vertical = false
Movement Type = Elastic 或 Clamped
```

手机端：

```text
手指左右滑动列表。
```

PC端：

```text
鼠标滚轮 / 鼠标拖拽 / 左右翻页按钮。
```

## 9.4 左右翻页按钮

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

## 9.5 滑动进度条

```text
Scroll_ProgressBar
```

位置：

```text
建筑列表底部
```

表现：

```text
细线
显示当前滑动位置
手机端使用短进度条，不使用粗滚动条
```

---

# 十、建筑卡片：BuildCard_Item

## 10.1 重要性

建筑卡片是建造页面最重要的交互单元。

每个建筑必须是独立卡片。

## 10.2 BuildCard_Item 结构

```text
BuildCard_Item
├── Image_CardBG
├── Text_BuildingName
├── Image_BuildingPreview
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
│   └── CostItem_Metal
│       ├── Image_Icon
│       └── Text_Value
├── State_Overlay
│   ├── Image_DarkMask
│   ├── Image_LockIcon
│   ├── Image_WarningIcon
│   └── Text_StateReason
├── Image_SelectedBorder
├── Image_RecommendGlow
└── Button_ClickArea
```

## 10.3 卡片尺寸

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

# 十一、建筑卡片上方：Text_BuildingName

## 11.1 位置

```text
卡片最上方
高度：22~26px
```

## 11.2 内容

显示建筑名称。

示例：

```text
步兵营
灵矿坊
破云弩塔
飞兽巢
高压电塔
水灵源池
镇妖兽栏
```

## 11.3 显示规则

```text
最多显示 5 个字
超过用缩略名
完整名在 Tips 里显示
```

## 11.4 样式

```text
居中
加粗
字号：12~14
颜色：白色或阵营浅色
```

---

# 十二、建筑卡片中间：Image_BuildingPreview

## 12.1 位置

```text
名称下方
卡片中间
```

## 12.2 尺寸

```text
手机：72~82px
PC：78~88px
```

## 12.3 图片要求

```text
显示建筑独立图
透明背景
建筑主体居中
不能带场景背景
不能带文字
剪影要清楚
```

## 12.4 视觉规则

```text
建筑图片是卡片最大区域。
玩家应优先通过图片识别建筑。
```

---

# 十三、建筑卡片底部：Cost_Area

## 13.1 位置

```text
卡片底部
高度：36~46px
```

## 13.2 结构

```text
Cost_Area
├── CostItem_Wood
├── CostItem_Gold
├── CostItem_Stone
└── CostItem_Metal
```

## 13.3 CostItem 结构

```text
CostItem_xxx
├── Image_Icon
└── Text_Value
```

## 13.4 排布

推荐两行排布：

```text
🪵120  🪙80
🪨60   ⚙40
```

每行最多 2 个资源。

## 13.5 图标与数字

图标尺寸：

```text
14~16px
```

数字字号：

```text
11~12
```

数字颜色：

```text
资源足够：白色 / 浅色
资源不足：红色
```

---

# 十四、无法建造状态：State_Overlay

无法建造时必须清楚提示，不能只灰掉。

## 14.1 State_Overlay 结构

```text
State_Overlay
├── Image_DarkMask
├── Image_LockIcon
├── Image_WarningIcon
└── Text_StateReason
```

## 14.2 资源不足

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
石料不足
金属不足
```

注意：

```text
不要把建筑图片完全盖死。
建筑图片仍需可辨认。
```

## 14.3 科技未解锁

表现：

```text
灰色遮罩
显示 Image_LockIcon
Text_StateReason：未解锁
```

Tips 中显示完整原因：

```text
需要科技：军工扩展
需要建筑：玄机观
```

## 14.4 主城等级不足

表现：

```text
锁图标
Text_StateReason：主城等级不足
```

Tips 显示：

```text
需要主城 2级
当前主城 1级
```

## 14.5 地形不允许

表现：

```text
黄色警告图标
Text_StateReason：地形不符
```

Tips 示例：

```text
水灵源池只能建在水面。
船厂只能建在岸边。
防御塔不能建在水中。
```

## 14.6 数量已达上限

表现：

```text
灰色遮罩
Text_StateReason：已达上限
角标：1/1
```

## 14.7 供给不足 / 融合限制

表现：

```text
紫灰警告图标
Text_StateReason：供给不足
```

Tips 示例：

```text
融合建筑必须建在占领核心供给范围内。
```

---

# 十五、建筑信息 Tips：BuildInfoTooltip

## 15.1 触发方式

PC：

```text
鼠标悬停 BuildCard_Item 0.25 秒。
```

手机：

```text
长按 BuildCard_Item 0.35 秒。
```

点击规则：

```text
短按建筑卡：如果可建造 → 进入放置。
短按建筑卡：如果不可建造 → 打开 Tips 并高亮原因。
```

## 15.2 Tips 预制体结构

```text
BuildInfoTooltip
├── Tooltip_BG
├── Header
│   ├── Image_BuildingIcon
│   ├── Text_BuildingName
│   └── Text_BuildingType
├── Tag_Area
│   ├── Tag_Resource
│   ├── Tag_Military
│   └── Tag_Defense
├── Stat_Area
│   ├── Text_HP
│   ├── Text_Armor
│   ├── Text_Size
│   └── Text_BuildTime
├── Cost_Area
│   └── CostItem_List
├── Function_Area
│   └── Text_FunctionList
├── Condition_Area
│   └── Text_ConditionList
└── Warning_Area
    └── Text_Warning
```

## 15.3 Tips 显示内容

```text
建筑图
建筑名称
建筑类型
一句话功能
生命 / 护甲 / 占地 / 建造时间
完整资源消耗
可生产内容
可研究内容
建造限制
未满足条件
```

## 15.4 Tips 示例

```text
[破云弩塔] 防御建筑
远程防空塔，克制飞行单位

生命 2200
护甲 5
占地 2x2
建造 40秒

消耗：
木材 180
黄金 220
石料 260
金属 120

功能：
· 攻击飞行单位
· 对空中目标伤害提高

条件：
需要主城 2级
```

## 15.5 Tips 位置规则

PC：

```text
优先显示在鼠标右上方。
如果右侧空间不足，显示在左侧。
不能遮挡当前建筑卡。
```

手机：

```text
显示在屏幕中下方或建造面板上方。
宽度约屏幕 86%。
最大高度约屏幕 60%。
超出可滚动。
```

---

# 十六、点击建筑卡后的流程

## 16.1 可建造时

```text
点击建筑卡
→ 建造面板折叠成小条
→ 建筑虚影出现在屏幕中心
→ 玩家拖动地图选择位置
→ 虚影右上显示确认按钮
→ 虚影左上显示取消按钮
→ 点击确认后派遣单位建造
```

## 16.2 不可建造时

```text
点击建筑卡
→ 不进入放置模式
→ 打开 BuildInfoTooltip
→ Warning_Area 显示原因
→ 对应资源/条件闪红
```

---

# 十七、横向滑动规则

## 17.1 手机端

```text
在 BuildScrollView 内横向拖动 → 列表滑动
移动距离超过 12px → 视为拖动
长按 0.35s → 显示 Tips
长按后移动超过 20px → 关闭 Tips，进入拖动
```

防误触优先级：

```text
拖动 > 长按 > 点击
```

## 17.2 PC端

```text
鼠标滚轮 → 横向滚动
鼠标拖动 → 横向滚动
点击左右箭头 → 翻页
悬停卡片 → Tips
```

---

# 十八、推荐 Unity 组件

## 18.1 UI_BuildPanel

```text
CanvasGroup
RectTransform
Animator / DOTween
```

## 18.2 CategoryContent

```text
HorizontalLayoutGroup
ContentSizeFitter
```

## 18.3 BuildContent

```text
HorizontalLayoutGroup
ContentSizeFitter
```

## 18.4 BuildScrollView

```text
ScrollRect
Mask / RectMask2D
```

## 18.5 BuildCard_Item

```text
Button
CanvasGroup
LayoutElement
EventTrigger / IPointerEnterHandler / IPointerDownHandler
```

## 18.6 BuildInfoTooltip

```text
CanvasGroup
VerticalLayoutGroup
ContentSizeFitter
```

---

# 十九、控件命名规范

建议程序统一使用以下命名：

```text
UI_BuildPanel
Panel_Background
Header_Area
Text_Title
Text_SelectedBuilder
Button_Close

Category_Area
CategoryScrollView
CategoryContent
Btn_Category_All
Btn_Category_Resource
Btn_Category_Military
Btn_Category_Tech
Btn_Category_Defense
Btn_Category_Special

BuildList_Area
Button_PageLeft
Button_PageRight
BuildScrollView
BuildContent
BuildCard_Item

Text_BuildingName
Image_BuildingPreview
Cost_Area
CostItem_Wood
CostItem_Gold
CostItem_Stone
CostItem_Metal

State_Overlay
Image_DarkMask
Image_LockIcon
Image_WarningIcon
Text_StateReason

Image_SelectedBorder
Image_RecommendGlow
Button_ClickArea

BuildInfoTooltip
Tooltip_BG
Tooltip_Header
Tooltip_Stat_Area
Tooltip_Cost_Area
Tooltip_Function_Area
Tooltip_Condition_Area
Tooltip_Warning_Area
```

---

# 二十、状态颜色建议

| 状态 | 颜色 |
|---|---|
| 可建造 | 阵营主题色 |
| 悬停 | 主题色提亮 |
| 选中 | 金色 / 阵营亮色 |
| 资源不足 | 红色 |
| 条件不足 | 灰色 |
| 地形错误 | 黄色 |
| 已达上限 | 灰色 |
| 推荐建造 | 柔和呼吸亮边 |
| 融合供给不足 | 紫灰色 |

---

# 二十一、最终视觉结构

```text
屏幕中下方一个横向建造面板

顶部：
建筑面板标题 + 当前建造单位

中上：
分类栏
[全部] [资源] [军队] [科技] [防御] [特殊]

中间：
横向滑动建筑列表

每个建筑卡：
上方建筑名
中间建筑图
底部资源 ICON + 数字

底部：
滑动进度条 / 左右翻页提示

悬停或长按：
显示建筑信息 Tips
```

---

# 二十二、最终操作逻辑

```text
能造 → 点击进入建筑虚影放置。
不能造 → 点击或悬停显示原因。
拖动 → 左右浏览建筑。
长按 / 悬停 → 查看完整信息。
关闭 → 返回普通单位面板。
```

---

# 二十三、最终硬规则

```text
1. 建造面板必须放在屏幕中下方。
2. 建造面板不能放在右边独占一列。
3. 建筑列表必须横向滑动。
4. 建筑必须按功能分类。
5. 分类至少包含：全部、资源、军队、科技、防御、特殊。
6. 每个建筑卡上方必须显示建筑名称。
7. 每个建筑卡中间必须显示建筑图片。
8. 每个建筑卡底部必须显示资源 ICON + 数字。
9. 资源不足必须红色显示。
10. 无法建造必须显示明确原因。
11. 鼠标悬停必须显示建筑 Tips。
12. 手机长按必须显示建筑 Tips。
13. 点击可建建筑进入建筑虚影放置流程。
14. 点击不可建建筑打开 Tips 并高亮原因。
15. UI 控件命名必须清楚，方便程序绑定。
```

---

# 二十四、一句话总结

```text
建造页面应该是屏幕中下方的横向建筑选择条：上方分类，中间建筑图片卡片，底部资源消耗，无法建造有明确遮罩和原因，悬停/长按显示详情 Tips，点击可建建筑进入中心虚影放置流程。
```
