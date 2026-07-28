# 01 - UI 基础控件与高级控件制作规则

---

## 1. 控件制作总原则

每个 UI 控件都应拆成 5 个部分：

```text
控件 = 尺寸区域 + 视觉层 + 文本层 + 状态层 + 交互层
```

对应 Unity 层级：

```text
UI_Widget_xxx
├─ Root              # 控件尺寸、脚本、整体动效
├─ Visual            # 背景、框体、图标
├─ Texts             # 标题、描述、数值
├─ State             # 选中、禁用、锁定、新获得
├─ FX                # 点击、发光、粒子、扫光
└─ HitArea           # 点击区域
```

做 UI 时，不要把按钮理解为“一张图 + Text”。按钮应该是一个完整可复用控件。

---

# 2. Button 按钮

## 2.1 用法

按钮用于触发一次性操作：

- 开始游戏
- 关闭窗口
- 购买
- 确认
- 返回
- 领取奖励
- 切换页面
- 装备 / 卸下

如果是“开关状态”，不要用 Button，应该用 Toggle。  
如果是“连续拖动值”，不要用 Button，应该用 Slider。  
如果是“列表里的一个可选项”，可以用 Button，也可以用 Toggle，取决于是否需要保持选中态。

---

## 2.2 标准按钮层级

```text
UI_Widget_Button_Base
├─ Root                         # RectTransform + Button + UIButtonEx
│  ├─ BG                         # Image，底板
│  ├─ Frame                      # Image，按钮框体，9宫格
│  ├─ IconMask                   # Image + Mask，可选
│  │  └─ Icon                    # Image，按钮图标
│  ├─ Label                      # TextMeshProUGUI
│  ├─ Badge                      # 红点/数量，可选
│  ├─ State
│  │  ├─ Selected                # 选中框
│  │  ├─ Disabled                # 灰色遮罩
│  │  ├─ Locked                  # 锁图标
│  │  └─ New                     # NEW 标记
│  ├─ FX
│  │  ├─ ClickFX
│  │  └─ HighlightFX
│  └─ HitArea                    # 可选，透明 Image，扩大点击范围
```

---

## 2.3 Button 组件设置

| 属性 | 推荐设置 |
|---|---|
| Transition | 普通按钮可用 None，由自定义动效控制；简单项目可用 Color Tint。 |
| Navigation | 手游默认 None；手柄/键盘项目需要配置。 |
| Target Graphic | 指向 `BG` 或 `Frame`，不要指向文字。 |
| Interactable | 由脚本根据状态控制。 |

---

## 2.4 按钮状态表现

| 状态 | 视觉 | 动效 | 可点击 |
|---|---|---|---|
| Normal | 默认亮度 | 无或轻微呼吸 | 是 |
| Pressed | 变暗 / 下压 | `PressScale` | 是 |
| Selected | 亮边框 / 勾选 | `SelectGlow` | 是 |
| Disabled | 灰度 / 透明度 50% | 无 | 否 |
| Locked | 黑遮罩 + 锁图标 | 点击可 `Shake` 提示 | 可选 |
| Loading | 转圈 + 禁用 | `LoopSpin` | 否 |

---

## 2.5 高级做法：按钮框体 + 图标遮罩

### 2.5.1 使用场景

适合：

- 技能按钮
- 物品按钮
- 装备按钮
- 角色头像按钮
- 卡牌按钮
- 圆形按钮
- 不规则边框按钮

目标效果：

- 按钮框体决定整体形状。
- 图标被限制在框体内部。
- 图标不会溢出到框体外面。
- 框体可以叠在图标上方，形成精致边缘。

---

### 2.5.2 推荐层级

```text
SkillButton
├─ Root                          # Button + UIButtonEx
│  ├─ BG                          # 底色，通常是暗底
│  ├─ IconMask                    # Image + Mask / RectMask2D
│  │  └─ Icon                      # 技能图标
│  ├─ IconDark                    # 冷却暗遮罩，可选
│  ├─ CooldownFill                # Image，Filled Radial 360
│  ├─ Frame                       # 框体，盖在 Icon 上方
│  ├─ LevelText                   # 等级
│  ├─ HotkeyText                  # 快捷键
│  ├─ State
│  │  ├─ Selected
│  │  ├─ Disabled
│  │  └─ Locked
│  └─ FX
│     ├─ ReadyFlash
│     └─ ClickSpark
```

---

### 2.5.3 遮罩实现方式

#### 方式 A：RectMask2D

适合矩形 / 圆角矩形近似区域。

优点：

- 性能更好。
- 不需要 Stencil。
- 适合列表、头像矩形裁切。

缺点：

- 只能矩形裁切，不能精确圆形、菱形、不规则形状。

#### 方式 B：Image + Mask

适合圆形、六边形、卡牌框、不规则按钮。

做法：

```text
IconMask
- Image：使用遮罩形状 Sprite
- Mask：开启 Show Mask Graphic = false
  └─ Icon
     - Image：真实图标
```

优点：

- 可以按 Sprite 形状遮罩。
- 适合圆形头像、异形技能框。

缺点：

- 性能比 RectMask2D 稍重。
- 复杂列表中大量使用要谨慎。

---

## 2.6 按钮尺寸规则

| 类型 | 推荐尺寸 |
|---|---:|
| 小按钮 | 160 × 48 |
| 普通按钮 | 240 × 64 |
| 大按钮 | 320 × 88 |
| 图标按钮 | 72 × 72 / 96 × 96 |
| 圆形技能按钮 | 96 × 96 / 128 × 128 |
| 移动端主操作按钮 | 128 × 128 起 |

---

## 2.7 后续修改要改哪里

| 想改什么 | 修改位置 |
|---|---|
| 改按钮大小 | Button Prefab 的 `Root RectTransform`，必要时改 LayoutElement。 |
| 改底图 | `BG` 的 Sprite。 |
| 改边框 | `Frame` 的 Sprite，注意 9宫格 Border。 |
| 改图标 | `Icon` 的 Sprite 或数据绑定。 |
| 改字体 | `Label` 的 TMP Font Asset 或 StyleConfig。 |
| 改点击动效 | `UIButtonEx` / `UIMotionPlayer` / Animator。 |
| 改禁用表现 | `State/Disabled`。 |
| 改选中表现 | `State/Selected`。 |
| 扩大点击区域 | `HitArea` 的 RectTransform。 |

---

# 3. ProgressBar 进度条

## 3.1 用法

进度条用于显示比例：

- 生命值
- 能量值
- 经验值
- 护盾值
- 读条
- 加载进度
- Boss 血条
- 建造进度
- 技能充能

---

## 3.2 标准进度条层级

```text
UI_Widget_ProgressBar_Base
├─ Root                         # UIProgressBar
│  ├─ BG                         # 背景槽
│  ├─ FillArea                   # 填充区域
│  │  ├─ Fill                    # Image，Filled 或拉伸宽度
│  │  ├─ DelayFill               # 延迟扣血层，可选
│  │  └─ ShieldFill              # 护盾层，可选
│  ├─ Frame                      # 外框
│  ├─ Texts
│  │  ├─ ValueText               # 100 / 150
│  │  └─ PercentText             # 66%
│  └─ FX
│     ├─ LowWarningFX            # 低血量闪烁
│     └─ ChangeFX                # 数值变化特效
```

---

## 3.3 进度条实现方式

### 方式 A：Image Filled

适合：

- 横向血条
- 圆形读条
- 扇形冷却
- 不需要复杂布局的进度

设置：

```text
Image Type = Filled
Fill Method = Horizontal / Vertical / Radial 360
Fill Origin = Left / Right / Bottom / Top
Fill Amount = 0 ~ 1
```

优点：简单、性能好。  
缺点：复杂形状不容易做渐变和分段。

### 方式 B：修改 RectTransform 宽度

适合：

- 需要多层叠加的血条
- 需要跟布局结合的条形 UI
- 需要用遮罩控制显示区域

做法：

```text
FillArea 作为固定宽度容器
Fill 锚点左拉伸，按百分比设置宽度
```

### 方式 C：Slider 改造成进度条

不推荐作为普通血条默认方案。

Slider 更适合可拖动输入。只显示数值时，用 Image Filled 更清晰。

---

## 3.4 高级进度条

### 3.4.1 延迟扣血条

用途：被攻击时，红色血条立即减少，黄色延迟条慢慢追上。

层级：

```text
BG
DelayFill     # 黄/白，延迟减少
Fill          # 红/绿，立即变化
Frame
```

规则：

1. 增加血量时，Fill 立即增加，DelayFill 可立即或快速跟随。
2. 扣血时，Fill 立即减少，DelayFill 延迟 0.2 秒后缓动减少。
3. Boss 血条必须有 DelayFill，普通小怪可省略。

### 3.4.2 分段血条

用途：Boss 多管血、护甲分段、能量格。

做法：

```text
SegmentRoot
├─ Segment_01
├─ Segment_02
├─ Segment_03
└─ Segment_04
```

每段用独立 Fill 或遮罩显示。

### 3.4.3 圆形冷却条

适合技能按钮。

```text
CooldownFill
- Image Type = Filled
- Fill Method = Radial 360
- Fill Amount = 剩余冷却 / 总冷却
```

通常冷却中为暗色扇形，冷却结束播放 `ReadyFlash`。

---

## 3.5 后续修改要改哪里

| 想改什么 | 修改位置 |
|---|---|
| 改条高度 | Root 和 BG RectTransform。 |
| 改填充颜色 | Fill Image Color 或材质。 |
| 改血条边框 | Frame Sprite。 |
| 改文字显示 | Texts/ValueText 或 PercentText。 |
| 改扣血延迟速度 | UIProgressBar 的 DelayDuration。 |
| 改低血闪烁 | FX/LowWarningFX 或 MotionConfig。 |
| 改圆形冷却方向 | CooldownFill 的 Fill Origin。 |

---

# 4. Slider 滑动条

## 4.1 用法

Slider 用于玩家拖动设置数值：

- 总音量
- BGM 音量
- 音效音量
- 鼠标灵敏度
- 镜头速度
- 画面亮度
- UI 缩放

不要用 Slider 表示普通血条，除非玩家需要拖动它。

---

## 4.2 标准层级

```text
UI_Widget_Slider_Base
├─ Root                         # Slider + UISliderEx
│  ├─ BG                         # 轨道背景
│  ├─ Fill Area
│  │  └─ Fill                    # 已填充轨道
│  ├─ Handle Slide Area
│  │  └─ Handle                  # 拖动柄
│  ├─ ValueText                  # 当前数值
│  └─ TickRoot                   # 刻度，可选
```

---

## 4.3 Slider 设置

| 属性 | 说明 |
|---|---|
| Min Value | 最小值。 |
| Max Value | 最大值。 |
| Whole Numbers | 整数滑动，例如画质等级。 |
| Value | 当前值。 |
| Direction | Left To Right / Right To Left 等。 |
| Fill Rect | 指向 Fill。 |
| Handle Rect | 指向 Handle。 |

---

## 4.4 高级 Slider

### 4.4.1 带刻度 Slider

用于画质等级、难度等级、灵敏度档位。

```text
TickRoot
├─ Tick_0
├─ Tick_1
├─ Tick_2
├─ Tick_3
└─ Tick_4
```

规则：

1. 拖动时自动吸附到最近刻度。
2. 当前刻度高亮。
3. 左右键/手柄可以每次移动一个刻度。

### 4.4.2 双端 Slider

用于价格区间、筛选范围。

```text
Track
├─ RangeFill
├─ MinHandle
└─ MaxHandle
```

规则：

1. MinHandle 不能超过 MaxHandle。
2. MaxHandle 不能低于 MinHandle。
3. 两个值都要显示在文本中。

---

# 5. Toggle / Tab / Radio

## 5.1 Toggle 用法

Toggle 表示一个可开关的状态：

- 是否开启音乐
- 是否全屏
- 是否显示伤害数字
- 是否自动战斗
- 是否确认协议

---

## 5.2 Toggle 层级

```text
UI_Widget_Toggle_Base
├─ Root                         # Toggle
│  ├─ BG                         # 开关底
│  ├─ Checkmark                  # 勾选图
│  ├─ Label                      # 文本
│  └─ FX
```

---

## 5.3 Toggle Group / Radio

多个 Toggle 互斥时，用 ToggleGroup。

适合：

- 页签
- 单选难度
- 画质等级
- 排序方式
- 筛选分类

标准层级：

```text
TabGroup
├─ ToggleGroup
├─ Tab_Character
├─ Tab_Equipment
├─ Tab_Skill
└─ Tab_Setting
```

规则：

1. 同组同时只能一个选中。
2. Tab 被选中后不能再次触发重复刷新，除非业务需要。
3. Tab 的选中态用 `State/Selected`，不要直接删改节点。

---

# 6. ScrollRect / List 列表

## 6.1 用法

列表用于显示数量不固定的内容：

- 背包格子
- 角色列表
- 任务列表
- 邮件列表
- 奖励列表
- 技能列表
- 图鉴列表
- 设置项列表

---

## 6.2 标准 ScrollView 层级

```text
UI_Widget_List_Base
├─ Root                         # ScrollRect + UIListView
│  ├─ Viewport                   # Image + RectMask2D
│  │  └─ Content                 # Vertical/Grid Layout Group
│  │     ├─ Item_01
│  │     ├─ Item_02
│  │     └─ Item_03
│  ├─ Scrollbar_Vertical         # 可选
│  ├─ EmptyState                 # 空列表提示
│  └─ LoadingState               # 加载中提示
```

---

## 6.3 ScrollRect 设置

| 属性 | 推荐 |
|---|---|
| Content | 指向 Content。 |
| Viewport | 指向 Viewport。 |
| Horizontal | 横向列表才开启。 |
| Vertical | 纵向列表才开启。 |
| Movement Type | 常用 Elastic 或 Clamped。 |
| Inertia | 手游列表通常开启。 |
| Scroll Sensitivity | PC 鼠标滚轮调高，手游不重要。 |

---

## 6.4 列表 Item 规则

每个列表条目必须做成独立预制体：

```text
UI_Item_InventorySlot
├─ Root                         # Button / Toggle + Item脚本
│  ├─ Frame
│  ├─ IconMask
│  │  └─ Icon
│  ├─ CountText
│  ├─ QualityFrame
│  ├─ State
│  │  ├─ Selected
│  │  ├─ Locked
│  │  └─ Equipped
│  └─ FX
```

Item 脚本只负责单个条目显示：

```text
Bind(itemData)
SetSelected(bool)
SetLocked(bool)
SetNew(bool)
PlayClickMotion()
```

不要让 Item 自己查询全局背包数据。

---

## 6.5 Grid 背包列表

适合背包、技能栏、装备栏。

```text
Viewport
└─ Content                         # GridLayoutGroup
   ├─ Slot_01
   ├─ Slot_02
   ├─ Slot_03
   └─ Slot_04
```

GridLayoutGroup 推荐设置：

| 属性 | 说明 |
|---|---|
| Cell Size | 每个格子尺寸。 |
| Spacing | 格子间距。 |
| Constraint | 固定列数或固定行数。 |
| Child Alignment | 通常 Upper Left。 |

规则：

1. 背包格子尺寸统一，不要一格大一格小。
2. 稀有度表现由 `QualityFrame` 控制，不改变格子尺寸。
3. 空格子也要显示底框，避免列表跳动。

---

## 6.6 虚拟列表

当列表超过 100 个 Item 时，需要考虑虚拟列表。

原则：

1. 屏幕上只创建可见 Item + 缓冲 Item。
2. 滚动时复用 Item，而不是销毁重建。
3. Content 高度仍按完整数量计算。
4. Item 的 Bind 数据随滚动更新。

适合：

- 图鉴几百个条目
- 邮件大量历史记录
- 背包大量物品
- 排行榜

---

## 6.7 后续修改要改哪里

| 想改什么 | 修改位置 |
|---|---|
| 改列表宽高 | List Root / Viewport。 |
| 改格子大小 | Content 的 GridLayoutGroup Cell Size。 |
| 改格子间距 | GridLayoutGroup Spacing。 |
| 改条目样式 | Item Prefab。 |
| 改滚动弹性 | ScrollRect Movement Type / Elasticity。 |
| 改滚动速度 | ScrollRect Scroll Sensitivity / Deceleration Rate。 |
| 改空列表提示 | EmptyState。 |

---

# 7. InputField 输入框

## 7.1 用法

适合：

- 玩家昵称
- 搜索框
- 兑换码
- 数量输入
- 聊天输入

---

## 7.2 标准层级

```text
UI_Widget_InputField_Base
├─ Root                         # TMP_InputField
│  ├─ BG
│  ├─ Frame
│  ├─ Icon_Search               # 可选
│  ├─ Text Area
│  │  ├─ Placeholder
│  │  └─ Text
│  ├─ ClearButton               # 清空按钮，可选
│  └─ State
│     ├─ Focused
│     ├─ Error
│     └─ Disabled
```

---

## 7.3 规则

1. 优先使用 TMP_InputField。
2. 输入限制写在脚本里，例如最大长度、非法字符过滤。
3. 错误状态统一使用 `State/Error`，不要弹一堆临时文字。
4. 移动端输入框要考虑软键盘遮挡。
5. 搜索框需要 ClearButton。

---

# 8. Dropdown 下拉框

## 8.1 用法

适合：

- 分辨率选择
- 语言选择
- 画质等级
- 排序规则

不适合移动端频繁使用的核心操作。手游里很多时候用弹窗列表或横向 Tab 更清楚。

---

## 8.2 层级

```text
UI_Widget_Dropdown_Base
├─ Root                         # TMP_Dropdown
│  ├─ Caption
│  ├─ Arrow
│  └─ Template                  # 下拉模板
│     ├─ Viewport
│     │  └─ Content
│     │     └─ Item
│     └─ Scrollbar
```

---

# 9. Popup 弹窗

## 9.1 用法

弹窗用于临时打断流程：

- 确认购买
- 设置
- 奖励领取
- 错误提示
- 退出确认
- 角色详情
- 部件详情

---

## 9.2 标准弹窗层级

```text
UI_Popup_Base
├─ Root                         # CanvasGroup + Popup脚本
│  ├─ Blocker                    # 半透明背景，阻挡背后点击
│  ├─ Window                     # 弹窗主体，动效缩放节点
│  │  ├─ BG
│  │  ├─ Header
│  │  │  ├─ TitleText
│  │  │  └─ CloseButton
│  │  ├─ Content
│  │  ├─ Footer
│  │  │  ├─ CancelButton
│  │  │  └─ ConfirmButton
│  │  └─ FX
│  └─ GuideAnchor                # 新手引导定位点，可选
```

---

## 9.3 弹窗规则

1. `Root` 挂 CanvasGroup。
2. 显示时：SetActive(true) → Alpha 0 到 1 → Interactable true → BlocksRaycasts true。
3. 隐藏时：Interactable false → Alpha 1 到 0 → BlocksRaycasts false → SetActive(false)。
4. `Blocker` 负责挡点击，可点击关闭时绑定 Close。
5. `Window` 才做缩放弹出，不要缩放整个 Root，否则 Blocker 也会跟着缩放。
6. 弹窗必须支持 ESC / 返回键关闭，确认弹窗除外。

---

# 10. Toast 轻提示

## 10.1 用法

Toast 是不阻塞操作的小提示：

- 金币不足
- 已装备
- 保存成功
- 获得道具
- 技能冷却中

---

## 10.2 层级

```text
UI_Widget_Toast
├─ Root                         # CanvasGroup
│  ├─ BG
│  ├─ Icon
│  ├─ Label
│  └─ FX
```

---

## 10.3 动效

默认使用：

```text
ToastRiseFade
- 初始：Alpha 0，Y -20
- 进入：0.15s Alpha 1，Y 0
- 停留：1.2s
- 退出：0.25s Alpha 0，Y +30
```

---

# 11. ItemSlot 物品格 / 装备格

## 11.1 用法

适合：

- 背包物品
- 装备栏
- 技能槽
- 部件格
- 卡牌槽
- 奖励道具

---

## 11.2 标准层级

```text
UI_Item_Slot_Base
├─ Root                         # Button + UISlotItem
│  ├─ SlotBG                     # 空格底
│  ├─ IconMask
│  │  └─ Icon                    # 物品图标
│  ├─ QualityFrame               # 稀有度框
│  ├─ CountText                  # 数量
│  ├─ LevelText                  # 等级，可选
│  ├─ State
│  │  ├─ Empty                   # 空状态
│  │  ├─ Selected                # 选中
│  │  ├─ Equipped                # 已装备
│  │  ├─ Locked                  # 锁定
│  │  └─ New                     # 新获得
│  └─ FX
```

---

## 11.3 稀有度表现

| 稀有度 | 表现层级 |
|---|---|
| 普通 | QualityFrame 灰/白。 |
| 稀有 | QualityFrame 蓝，轻微高亮。 |
| 史诗 | QualityFrame 紫，边缘发光。 |
| 传说 | QualityFrame 橙/金，循环光效。 |
| 神话 | QualityFrame 彩光，专属 FX。 |

注意：稀有度只能改变视觉，不改变 Slot 尺寸。

---

# 12. Card 卡牌控件

## 12.1 用法

适合：

- 技能卡
- 奖励三选一
- 部件卡
- 角色卡
- 图鉴卡
- 事件卡

---

## 12.2 标准层级

```text
UI_Card_Base
├─ Root                         # Button / Toggle + UICard
│  ├─ CardBG
│  ├─ IllustrationMask
│  │  └─ Illustration
│  ├─ Frame
│  ├─ Header
│  │  ├─ TypeIcon
│  │  ├─ NameText
│  │  └─ CostRoot
│  ├─ Content
│  │  ├─ DescText
│  │  └─ KeywordRoot
│  ├─ Footer
│  │  ├─ TagRoot
│  │  └─ ValueRoot
│  ├─ State
│  │  ├─ Selected
│  │  ├─ Disabled
│  │  ├─ Locked
│  │  └─ Upgraded
│  └─ FX
```

---

## 12.3 卡牌布局规则

1. 卡牌插画必须用 Mask 限制在图框内。
2. 卡牌标题、类型、费用固定在 Header。
3. 描述区 `Content` 需要根据文字长度动态扩展，或者使用 Scroll / AutoSize。
4. 关键词用统一颜色和标签，不要把所有效果写成纯文本。
5. 三选一卡牌需要 Selected 状态和 Hover 放大。

---

# 13. Tooltip 提示框

## 13.1 用法

用于展示解释信息：

- 关键词解释
- 装备属性
- 技能描述
- Buff 描述
- 按钮功能说明

---

## 13.2 层级

```text
UI_Widget_Tooltip
├─ Root                         # CanvasGroup
│  ├─ BG                         # 9宫格，随内容伸缩
│  ├─ Header
│  │  ├─ Icon
│  │  └─ TitleText
│  ├─ Content
│  │  └─ DescText
│  └─ Footer
```

---

## 13.3 规则

1. Tooltip 不参与主界面布局，统一放到 Top Canvas。
2. Tooltip 需要屏幕边缘修正，不能超出屏幕。
3. Tooltip 可以跟随鼠标，但不要每帧重建文本。
4. 移动端长按显示，松手隐藏。

---

# 14. RedDot / Badge 红点与角标

## 14.1 用法

用于提醒玩家：

- 新邮件
- 可领取奖励
- 新装备
- 技能可升级
- 图鉴新增

---

## 14.2 层级

```text
Badge
├─ RedDot                       # 纯红点
├─ CountBG                      # 数字底
└─ CountText                    # 数量
```

---

## 14.3 规则

1. 红点逻辑统一由 RedDotSystem 计算，不要每个界面自己判断。
2. Badge 默认锚定右上角。
3. 数字超过 99 显示 `99+`。
4. 红点动效只允许轻微呼吸，不要太吵。

---

# 15. Loading / Spinner 加载控件

## 15.1 用法

- 网络请求
- 场景加载
- 列表刷新
- 资源加载

---

## 15.2 层级

```text
UI_Widget_Loading
├─ Root
│  ├─ Spinner                   # 旋转图
│  ├─ Label                     # 加载文字
│  └─ ProgressBar               # 可选
```

---

## 15.3 规则

1. 不知道准确进度时用 Spinner。
2. 知道准确进度时用 ProgressBar。
3. Loading 遮罩必须阻止重复点击。
4. 超过一定时间要显示提示，例如“资源加载中”。

---

# 16. 控件通用检查清单

| 检查项 | 必须 |
|---|---|
| Root 尺寸是否明确 | 是 |
| Anchor 是否合理 | 是 |
| Pivot 是否符合动效中心 | 是 |
| 不必要图片是否关闭 Raycast Target | 是 |
| 文本是否用 TextMeshPro | 是 |
| 状态层是否完整 | 是 |
| 是否支持 Disabled | 是 |
| 是否支持数据 Bind | 是 |
| 是否有点击音效入口 | 建议 |
| 是否有动效入口 | 建议 |
| 是否做成 Prefab / Variant | 是 |
