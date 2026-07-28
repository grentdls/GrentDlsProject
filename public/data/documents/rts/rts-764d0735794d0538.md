# 02 - UI 层级布局、适配、修改规则

---

## 1. 层级布局总原则

Unity UI 的层级要做到：

```text
先分层，再分区，再放控件。
```

不要直接在 Canvas 下面堆按钮、图片、文字。正确方式是：

```text
Canvas
└─ Screen
   ├─ BackgroundLayer
   ├─ MainLayer
   ├─ OverlayLayer
   └─ FXLayer
```

每个完整界面都应该有清晰的结构，后续修改时才能快速找到对应位置。

---

# 2. Canvas 层级规范

## 2.1 UIRoot 标准结构

```text
UIRoot
├─ EventSystem
├─ Canvas_Screen
│  ├─ Screen_MainMenu
│  ├─ Screen_BattleHUD
│  └─ Screen_Inventory
│
├─ Canvas_Popup
│  ├─ Popup_Confirm
│  └─ Popup_Settings
│
├─ Canvas_Top
│  ├─ LoadingRoot
│  ├─ ToastRoot
│  └─ GuideRoot
│
└─ Canvas_Debug
   └─ DebugPanel
```

---

## 2.2 Canvas Scaler 设置

### 手游推荐

```text
UI Scale Mode = Scale With Screen Size
Reference Resolution = 1920 x 1080 或 2340 x 1080
Screen Match Mode = Match Width Or Height
Match = 0.5
```

### 横屏游戏推荐

```text
Reference Resolution = 1920 x 1080
Match = 0.5
```

### 竖屏游戏推荐

```text
Reference Resolution = 1080 x 1920
Match = 0.5
```

### PC 桌面游戏推荐

```text
Reference Resolution = 1920 x 1080
Match = 0.5
```

规则：

1. 不要每个 Canvas 使用不同 Reference Resolution。
2. UI 设计稿需要和 Reference Resolution 对齐。
3. 不要用 Constant Pixel Size 做正式游戏 UI，除非是编辑器工具。

---

# 3. Screen 界面层级规范

## 3.1 标准 Screen 层级

```text
UI_Screen_xxx
├─ Root                         # Screen脚本 + CanvasGroup
│  ├─ SafeArea                   # 移动端安全区域
│  │  ├─ BackgroundLayer         # 背景层
│  │  ├─ MainLayer               # 主内容层
│  │  │  ├─ Header               # 顶部栏
│  │  │  ├─ Content              # 中间内容
│  │  │  └─ Footer               # 底部栏
│  │  ├─ OverlayLayer            # 临时覆盖，如提示遮罩
│  │  └─ FXLayer                 # UI特效
│  └─ Blocker                    # 可选，界面级阻挡层
```

---

## 3.2 每层职责

| 层 | 用途 | 是否参与交互 |
|---|---|---|
| `BackgroundLayer` | 背景图、装饰图、氛围元素 | 通常否 |
| `MainLayer` | 主要 UI 内容 | 是 |
| `Header` | 标题、返回、货币栏、导航 | 是 |
| `Content` | 界面核心内容 | 是 |
| `Footer` | 底部按钮、操作区 | 是 |
| `OverlayLayer` | 半透明遮罩、锁定提示、局部引导 | 可选 |
| `FXLayer` | 发光、粒子、扫光 | 通常否 |

---

# 4. RectTransform 规则

## 4.1 Anchor 锚点

Anchor 决定 UI 相对父节点如何定位。

### 常用锚点规则

| UI 类型 | Anchor 推荐 |
|---|---|
| 顶部栏 | Top Stretch |
| 底部栏 | Bottom Stretch |
| 左侧菜单 | Left Stretch |
| 右侧详情 | Right Stretch |
| 居中弹窗 | Middle Center |
| 全屏背景 | Stretch Full |
| 右上货币 | Top Right |
| 左下摇杆 | Bottom Left |
| 右下技能按钮 | Bottom Right |

---

## 4.2 Pivot 轴心

Pivot 决定缩放和旋转中心。

| UI 类型 | Pivot 推荐 |
|---|---|
| 普通按钮 | 0.5, 0.5 |
| 弹窗窗口 | 0.5, 0.5 |
| 从左展开面板 | 0, 0.5 |
| 从右展开面板 | 1, 0.5 |
| 从上展开列表 | 0.5, 1 |
| 血条从左减少 | 0, 0.5 |
| 竖向列表 Content | 0.5, 1 |
| Grid Content | 0, 1 |

---

## 4.3 修改规则

| 想实现 | 应该改 | 不应该改 |
|---|---|---|
| 固定在右上角 | Anchor = Top Right | 用代码每帧设置位置 |
| 拉满父物体 | Anchor Stretch | 手填宽高等于父物体 |
| 弹窗居中 | Anchor/Pivot Center | 估算坐标 |
| 列表从上往下长 | Content Pivot Y = 1 | 让列表从中间扩张 |
| 血条从左到右填充 | Fill Pivot X = 0 | 同时改 Scale 和 Width |

---

# 5. Layout Group 规则

## 5.1 自动布局组件

| 组件 | 用途 |
|---|---|
| Horizontal Layout Group | 横向排列，例如顶部货币栏、按钮组。 |
| Vertical Layout Group | 纵向排列，例如任务列表、设置项列表。 |
| Grid Layout Group | 网格排列，例如背包、技能格、图鉴。 |
| Layout Element | 单个子物体声明最小/首选/弹性尺寸。 |
| Content Size Fitter | 让自身根据内容变大变小。 |
| Aspect Ratio Fitter | 保持宽高比。 |

---

## 5.2 Horizontal Layout Group 示例

```text
CurrencyBar
├─ HorizontalLayoutGroup
├─ CoinWidget
├─ DiamondWidget
└─ EnergyWidget
```

推荐设置：

```text
Padding = Left 16, Right 16
Spacing = 12
Child Alignment = Middle Right
Control Child Size Width = false
Control Child Size Height = true
Child Force Expand Width = false
Child Force Expand Height = false
```

---

## 5.3 Vertical Layout Group 示例

```text
SettingList
├─ VerticalLayoutGroup
├─ SettingItem_BGM
├─ SettingItem_SFX
├─ SettingItem_Quality
└─ SettingItem_Language
```

推荐设置：

```text
Padding = 16
Spacing = 12
Child Alignment = Upper Center
Control Child Size Width = true
Control Child Size Height = false
Child Force Expand Width = true
Child Force Expand Height = false
```

---

## 5.4 Grid Layout Group 示例

```text
InventoryGrid
├─ GridLayoutGroup
├─ Slot_01
├─ Slot_02
└─ Slot_03
```

推荐设置：

```text
Cell Size = 96 x 96
Spacing = 12 x 12
Start Corner = Upper Left
Start Axis = Horizontal
Child Alignment = Upper Left
Constraint = Fixed Column Count
Constraint Count = 5
```

---

## 5.5 Content Size Fitter 使用规则

Content Size Fitter 很方便，但也很容易造成布局冲突。

### 推荐使用

- Tooltip 根据文本自动伸缩。
- 弹窗描述区根据内容增长。
- 单个标签根据文字长度变化。
- 聊天气泡根据文字变化。

### 谨慎使用

- Layout Group 的直接子物体上同时挂 Content Size Fitter。
- 多层嵌套同时自动计算尺寸。
- 高频变化的列表 Item 上大量使用。

### 禁止做法

```text
Parent: VerticalLayoutGroup
└─ Child: ContentSizeFitter + LayoutGroup + 动态文本
```

这种结构容易导致 Unity 警告或布局反复重建。

### 推荐替代

```text
Parent: VerticalLayoutGroup
└─ Child: LayoutElement 指定 Preferred Height
```

复杂动态高度由代码计算后设置 LayoutElement。

---

# 6. SafeArea 适配规则

## 6.1 SafeArea 层级

```text
Screen_Root
└─ SafeArea
   ├─ Header
   ├─ Content
   └─ Footer
```

SafeArea 只负责屏幕安全边距，不负责界面排版。

---

## 6.2 手机横屏布局建议

```text
SafeArea
├─ LeftControlArea              # 左下摇杆
├─ RightControlArea             # 右下技能按钮
├─ TopInfoArea                  # 顶部信息
├─ CenterMessageArea            # 中央提示
└─ BottomTipArea                # 底部提示
```

规则：

1. 触控按钮不能贴屏幕边缘，至少留 24-48 px。
2. 刘海屏横屏时，左侧/右侧都要检查。
3. 底部系统手势区域不要放关键按钮。
4. 背景可以超出 SafeArea，交互控件不能超出。

---

# 7. 常见界面布局模板

## 7.1 主界面布局

```text
UI_Screen_MainMenu
├─ Root
│  ├─ SafeArea
│  │  ├─ BackgroundLayer
│  │  │  ├─ BG_Main
│  │  │  └─ DecoRoot
│  │  ├─ MainLayer
│  │  │  ├─ Header
│  │  │  │  ├─ PlayerInfo
│  │  │  │  └─ CurrencyBar
│  │  │  ├─ Center
│  │  │  │  ├─ Logo
│  │  │  │  └─ CharacterPreview
│  │  │  └─ Footer
│  │  │     ├─ Button_Start
│  │  │     ├─ Button_Continue
│  │  │     ├─ Button_Gallery
│  │  │     └─ Button_Settings
│  │  ├─ OverlayLayer
│  │  └─ FXLayer
```

---

## 7.2 设置界面布局

```text
UI_Popup_Settings
├─ Root
│  ├─ Blocker
│  └─ Window
│     ├─ Header
│     │  ├─ TitleText
│     │  └─ CloseButton
│     ├─ Body
│     │  ├─ LeftTabs
│     │  │  ├─ Tab_Audio
│     │  │  ├─ Tab_Graphics
│     │  │  └─ Tab_Control
│     │  └─ RightContent
│     │     ├─ Panel_Audio
│     │     ├─ Panel_Graphics
│     │     └─ Panel_Control
│     └─ Footer
│        ├─ Button_Reset
│        ├─ Button_Cancel
│        └─ Button_Apply
```

规则：

1. 左侧 Tab 固定宽度。
2. 右侧 Content 负责切换不同设置面板。
3. 设置项使用 `UI_Item_SettingRow` 预制体。
4. Apply / Cancel 固定在 Footer。

---

## 7.3 背包界面布局

```text
UI_Screen_Inventory
├─ Root
│  ├─ SafeArea
│  │  ├─ Header
│  │  │  ├─ TitleText
│  │  │  ├─ CurrencyBar
│  │  │  └─ CloseButton
│  │  ├─ Content
│  │  │  ├─ LeftPanel
│  │  │  │  ├─ CategoryTabs
│  │  │  │  └─ InventoryGrid
│  │  │  └─ RightPanel
│  │  │     ├─ ItemPreview
│  │  │     ├─ ItemName
│  │  │     ├─ ItemDesc
│  │  │     ├─ PropertyList
│  │  │     └─ ActionButtons
│  │  └─ Footer
```

规则：

1. 左侧列表、右侧详情。
2. 物品格使用统一 Slot。
3. 详情区由选中 Item 绑定数据。
4. 空选择时显示 EmptyState。

---

## 7.4 三选一奖励界面布局

```text
UI_Popup_RewardChoose
├─ Root
│  ├─ Blocker
│  └─ Window
│     ├─ Header
│     │  ├─ TitleText
│     │  └─ DescText
│     ├─ CardArea
│     │  ├─ RewardCard_01
│     │  ├─ RewardCard_02
│     │  └─ RewardCard_03
│     └─ Footer
│        └─ ConfirmButton
```

规则：

1. 卡牌用 Horizontal Layout Group。
2. 卡牌选中时放大 1.05-1.08。
3. ConfirmButton 只有选中卡牌后可点击。
4. 卡牌内容长短差异大时，描述区允许动态高度，但卡牌整体高度保持一致。

---

# 8. 修改规则：后续改哪里

## 8.1 修改 UI 的优先级

```text
配置文件 > Prefab Variant > Base Prefab > Screen Prefab > 场景实例
```

能改配置，就不要改预制体。  
能改 Variant，就不要改 Base。  
能改 Prefab，就不要改场景实例。

---

## 8.2 常见修改表

| 修改需求 | 修改位置 | 注意事项 |
|---|---|---|
| 改按钮统一高度 | Button Base Prefab / StyleConfig | 检查所有 Variant。 |
| 改某类按钮颜色 | Button Variant | 不要改 Base。 |
| 改图标 | 数据绑定或 Icon Sprite | 如果来自配置，改配置表。 |
| 改列表间距 | Content 的 LayoutGroup Spacing | 检查滚动区域高度。 |
| 改弹窗宽度 | Popup Window RectTransform | 检查 Header/Footer 是否拉伸。 |
| 改文字大小 | TMP Style / StyleConfig | 避免单节点手改。 |
| 改进度条颜色 | ProgressBar Variant | 血条、蓝条、经验条分开 Variant。 |
| 改动效速度 | UIMotionConfig | 不要逐个 Animator 改。 |
| 改 SafeArea | SafeArea 脚本 | 所有界面统一生效。 |
| 改界面层级顺序 | UILayerConfig / Canvas Sorting Order | 不要临时手调 Sorting Order。 |

---

# 9. 适配检查点

## 9.1 分辨率检查

至少检查：

```text
16:9      1920x1080
18:9      2160x1080
19.5:9    2340x1080
4:3       1024x768
16:10     1920x1200
```

## 9.2 检查内容

1. 顶部货币是否被刘海遮挡。
2. 底部按钮是否离屏幕边缘太近。
3. 弹窗是否超出屏幕。
4. 列表是否能完整滚动到底。
5. 文本变长后是否溢出。
6. 动效放大时是否被 Mask 裁掉。
7. Tooltip 是否超出屏幕边缘。
8. 右下角技能按钮是否遮挡主战斗区域。

---

# 10. UI 设计稿到 Unity 的落地流程

```text
1. 分析设计稿
   - 哪些是背景
   - 哪些是控件
   - 哪些是可复用元素
   - 哪些需要动效

2. 拆图
   - 背景大图
   - 框体9宫格
   - 图标单独图
   - 特效贴图单独图

3. 建 Base Prefab
   - Button Base
   - Slot Base
   - Card Base
   - Popup Base

4. 做 Variant
   - 普通按钮
   - 危险按钮
   - 稀有物品格
   - 传说卡牌

5. 搭 Screen / Popup
   - 使用 Panel 和 Widget 拼装
   - 不直接堆散图

6. 绑定数据
   - Bind(data)
   - RefreshState()
   - RegisterEvents()

7. 加动效
   - Enter
   - Exit
   - Press
   - Selected
   - Warning

8. 适配检查
   - 多分辨率
   - SafeArea
   - 长文本
   - 滚动列表
```
