# 00 - Unity UI 总规范：术语、命名、预制体架构

---

## 1. 核心原则

### 1.1 UI 制作的总目标

Unity UI 不应该只是“能显示”，而应该做到：

1. **可复用**：按钮、卡牌、弹窗、列表条目都做成预制体。
2. **可换皮**：同一个按钮逻辑可以换普通、危险、稀有、锁定等不同皮肤。
3. **可维护**：后续改尺寸、改图标、改间距、改动效时，不需要到处找节点。
4. **可动效化**：所有控件都预留动效层，避免后期插动效时破坏原层级。
5. **可适配**：支持不同分辨率、不同屏幕比例、移动端 SafeArea。
6. **可配置**：文本、图标、颜色、数值、状态尽量走数据绑定，不在界面里写死。

---

## 2. UI 系统选择规则

### 2.1 UGUI 使用场景

项目内默认使用 UGUI，适合：

- 战斗 HUD
- 主界面
- 背包界面
- 角色界面
- 技能界面
- 卡牌界面
- 奖励界面
- 三选一界面
- 弹窗系统
- 新手引导
- 移动端触控按钮
- 动效较多的游戏内 UI

### 2.2 UI Toolkit 使用场景

UI Toolkit 更适合：

- 编辑器工具
- 开发者调试面板
- PC 端工具型界面
- 文本表单较多的界面
- 样式高度 CSS 化的界面

### 2.3 禁止规则

1. 同一个功能界面不要一半 UGUI，一半 UI Toolkit。
2. 战斗 HUD 不建议用 UI Toolkit，除非项目已经明确全套使用它。
3. 编辑器工具不建议用复杂 UGUI，如果是内部工具，UI Toolkit 更好维护。

---

## 3. 项目目录规范

```text
Assets/
├─ Art/
│  ├─ UI/
│  │  ├─ Atlases/              # SpriteAtlas
│  │  ├─ Icons/                # 原始图标
│  │  ├─ Frames/               # 框体、底板、按钮图
│  │  ├─ Backgrounds/          # 界面背景、弹窗背景
│  │  ├─ Effects/              # UI特效贴图
│  │  └─ Fonts/                # 字体
│
├─ Prefabs/
│  ├─ UI/
│  │  ├─ Common/               # 通用控件
│  │  ├─ Screens/              # 完整界面
│  │  ├─ Panels/               # 功能面板
│  │  ├─ Widgets/              # 小控件
│  │  ├─ Popups/               # 弹窗
│  │  ├─ Items/                # 物品格、卡牌、角色条目
│  │  └─ FX/                   # UI动效预制体
│
├─ Scripts/
│  ├─ UI/
│  │  ├─ Core/                 # UI管理器、窗口基类
│  │  ├─ Components/           # 控件脚本
│  │  ├─ Screens/              # 界面逻辑
│  │  ├─ Widgets/              # Widget逻辑
│  │  └─ Effects/              # 动效脚本
│
└─ Configs/
   ├─ UI/
   │  ├─ UIStyleConfig.asset
   │  ├─ UIAudioConfig.asset
   │  ├─ UIMotionConfig.asset
   │  └─ UILayerConfig.asset
```

---

## 4. 命名规范

### 4.1 预制体命名

| 类型 | 前缀 | 示例 |
|---|---|---|
| 完整界面 | `UI_Screen_` | `UI_Screen_MainMenu` |
| 弹窗 | `UI_Popup_` | `UI_Popup_Reward` |
| 面板 | `UI_Panel_` | `UI_Panel_InventoryList` |
| 控件 | `UI_Widget_` | `UI_Widget_Button_Primary` |
| 列表项 | `UI_Item_` | `UI_Item_EquipmentSlot` |
| 卡牌 | `UI_Card_` | `UI_Card_SkillReward` |
| 图标 | `UI_Icon_` | `UI_Icon_Coin` |
| 特效 | `UI_FX_` | `UI_FX_ButtonClickSpark` |
| 动画 | `UI_Anim_` | `UI_Anim_Popup_PopIn` |

### 4.2 层级节点命名

| 节点名 | 用途 |
|---|---|
| `Root` | 控件根节点，挂主要脚本。 |
| `Layout` | 自动布局节点，挂 Layout Group。 |
| `BG` | 背景图。 |
| `Frame` | 框体图。 |
| `Icon` | 主图标。 |
| `IconMask` | 图标遮罩节点。 |
| `Label` | 主文本。 |
| `ValueText` | 数值文本。 |
| `State` | 状态表现容器。 |
| `FX` | 特效容器。 |
| `HitArea` | 点击热区。 |
| `Blocker` | 阻挡点击的遮罩。 |
| `Selected` | 选中态。 |
| `Disabled` | 禁用态。 |
| `Locked` | 锁定态。 |
| `Badge` | 红点、数量、提示标。 |
| `Guide` | 新手引导高亮层。 |

### 4.3 脚本命名

| 类型 | 示例 |
|---|---|
| 界面脚本 | `MainMenuScreen.cs` |
| 弹窗脚本 | `RewardPopup.cs` |
| 控件脚本 | `UIButtonEx.cs`、`UIProgressBar.cs` |
| 列表项脚本 | `EquipmentSlotItem.cs` |
| 动效脚本 | `UIMotionPlayer.cs` |
| 数据绑定脚本 | `UIBinding_RewardItem.cs` |

---

## 5. UI 根节点架构

### 5.1 场景 UI 总层级

```text
UIRoot
├─ EventSystem
├─ Canvas_Screen          # 普通界面层
│  ├─ Screen_MainMenu
│  ├─ Screen_Inventory
│  └─ Screen_BattleHUD
│
├─ Canvas_Popup           # 弹窗层
│  ├─ Popup_Settings
│  └─ Popup_Reward
│
├─ Canvas_Top             # 最高层：Loading、Toast、新手引导
│  ├─ Loading
│  ├─ ToastRoot
│  └─ GuideOverlay
│
└─ Canvas_Debug           # 调试层
   └─ DebugPanel
```

### 5.2 Canvas 层级规则

| Canvas | Sorting Order | 用途 |
|---|---:|---|
| `Canvas_Screen` | 0 | 普通界面、HUD。 |
| `Canvas_Popup` | 100 | 弹窗、二级确认、奖励窗口。 |
| `Canvas_Top` | 200 | Loading、Toast、新手引导、系统遮罩。 |
| `Canvas_Debug` | 999 | 调试 UI。 |

规则：

1. 不要每个小控件都单独开 Canvas。
2. 高频变化区域可以单独放 SubCanvas，例如血条、倒计时、滚动数字。
3. 大量静态背景不要和频繁动的数字放在同一个 Canvas，避免重建影响范围过大。
4. 弹窗统一从 PopupManager 创建到 `Canvas_Popup`。
5. Toast、新手引导、Loading 一律放 `Canvas_Top`。

---

## 6. 通用控件预制体架构

### 6.1 标准 Widget 层级

```text
UI_Widget_xxx
├─ Root                         # RectTransform，挂主脚本
│  ├─ Layout                    # 布局根，可选
│  │  ├─ BG                     # 背景
│  │  ├─ Frame                  # 框体
│  │  ├─ IconMask               # 遮罩，可选
│  │  │  └─ Icon                # 图标
│  │  ├─ Label                  # 主标题
│  │  ├─ ValueText              # 数值
│  │  └─ Badge                  # 红点、数量
│  │
│  ├─ State                     # 状态层
│  │  ├─ Normal
│  │  ├─ Selected
│  │  ├─ Disabled
│  │  ├─ Locked
│  │  └─ Highlight
│  │
│  ├─ FX                        # 特效层
│  │  ├─ ClickFX
│  │  └─ LoopFX
│  │
│  └─ HitArea                   # 点击热区，可选
```

### 6.2 层级职责

| 层级 | 只负责什么 | 不应该做什么 |
|---|---|---|
| `Root` | 脚本、整体尺寸、动效缩放点。 | 不直接塞一堆视觉图。 |
| `Layout` | 排版、对齐、自动布局。 | 不挂复杂逻辑脚本。 |
| `BG/Frame/Icon/Label` | 视觉表现。 | 不写交互逻辑。 |
| `State` | 状态叠层。 | 不改变核心布局大小。 |
| `FX` | 临时特效、循环特效。 | 不参与 Layout Group。 |
| `HitArea` | 扩大点击区域。 | 不显示复杂视觉内容。 |

---

## 7. 组件职责分离

### 7.1 视觉组件

- Image
- RawImage
- TextMeshProUGUI
- CanvasGroup
- Shadow / Outline
- Mask / RectMask2D

只负责显示，不负责业务逻辑。

### 7.2 布局组件

- RectTransform
- Horizontal Layout Group
- Vertical Layout Group
- Grid Layout Group
- Layout Element
- Content Size Fitter
- Aspect Ratio Fitter

只负责位置和尺寸，不负责点击逻辑。

### 7.3 交互组件

- Button
- Toggle
- Slider
- ScrollRect
- InputField / TMP_InputField
- EventTrigger 或自定义 Pointer Handler

只负责输入，不负责数据来源。

### 7.4 业务绑定组件

- `UIBinding_xxx`
- `Screen_xxx`
- `Popup_xxx`
- `Item_xxx`

负责把数据填进 UI，但不要控制所有子节点的视觉细节。

---

## 8. 控件状态统一定义

| 状态名 | 含义 | 表现建议 |
|---|---|---|
| `Normal` | 默认状态 | 正常亮度。 |
| `Hover` | 鼠标悬停，PC 用 | 轻微变亮、上浮。 |
| `Pressed` | 按下 | 缩小、变暗、位移 1-3px。 |
| `Selected` | 被选中 | 边框发光、勾选、底板变亮。 |
| `Disabled` | 禁用 | 灰色、透明度降低、不可点击。 |
| `Locked` | 未解锁 | 加锁图标、暗化、不可点击或弹提示。 |
| `New` | 新获得 | 红点、NEW 标签、呼吸光。 |
| `Equipped` | 已装备 | 勾选、角标、装备中标签。 |
| `Owned` | 已拥有 | 正常显示，可操作。 |
| `Unowned` | 未拥有 | 暗化、缺少资源提示。 |
| `Loading` | 加载中 | 转圈、禁用点击。 |
| `Cooldown` | 冷却中 | 扇形遮罩、倒计时文字。 |

---

## 9. 统一尺寸 Token

项目中不要到处写随机尺寸，建议建立 UIStyleConfig。

| Token | 推荐值 | 用途 |
|---|---:|---|
| `Space_XS` | 4 | 极小间距。 |
| `Space_S` | 8 | 图标和文字间距。 |
| `Space_M` | 16 | 普通控件间距。 |
| `Space_L` | 24 | 面板内大间距。 |
| `Space_XL` | 32 | 模块间距。 |
| `Radius_S` | 6 | 小圆角。 |
| `Radius_M` | 12 | 普通圆角。 |
| `Button_H_S` | 48 | 小按钮高度。 |
| `Button_H_M` | 64 | 普通按钮高度。 |
| `Button_H_L` | 88 | 大按钮高度。 |
| `Icon_S` | 32 | 小图标。 |
| `Icon_M` | 48 | 普通图标。 |
| `Icon_L` | 72 | 大图标。 |
| `Slot_S` | 72 | 小格子。 |
| `Slot_M` | 96 | 普通格子。 |
| `Slot_L` | 128 | 大格子。 |

---

## 10. 字体和文本规范

### 10.1 TextMeshPro 默认规则

1. 项目文本全部使用 TextMeshProUGUI。
2. 字体资源集中管理，不要每个界面单独拖字体。
3. 数字、货币、伤害值可以使用专用数字字体。
4. 文本颜色走 StyleConfig，不在 Inspector 随便手填。
5. 多语言项目禁止用固定宽度承载长文本，必须预留自适应。

### 10.2 文本层级命名

| 节点名 | 用途 |
|---|---|
| `TitleText` | 标题。 |
| `NameText` | 名称。 |
| `DescText` | 描述。 |
| `ValueText` | 数值。 |
| `CountText` | 数量。 |
| `TipText` | 提示。 |
| `ButtonText` | 按钮文字。 |

---

## 11. 图片资源规范

### 11.1 Sprite 设置

| 类型 | 设置建议 |
|---|---|
| 普通图标 | Sprite，Alpha is Transparency 开启。 |
| 9宫格框体 | Sprite Mode Single，Mesh Type Full Rect，设置 Border。 |
| 大背景 | 可用 Sprite 或 RawImage，根据是否需要平铺决定。 |
| 遮罩图 | 尽量使用简单形状，减少复杂透明边缘。 |
| 特效图 | 可独立图集，避免和常规 UI 频繁重打包。 |

### 11.2 Raycast Target 规则

1. 只有真正需要接收点击的节点打开 Raycast Target。
2. 普通 Image、Icon、BG、Frame、Label 默认关闭 Raycast Target。
3. Button 根节点或 HitArea 打开 Raycast Target。
4. 遮罩层如果需要挡住背后点击，打开 Blocker 的 Raycast Target。
5. 透明图如果打开 Raycast Target，可能导致“看不见但挡点击”。

---

## 12. 预制体继承规则

### 12.1 Base Prefab

基础预制体只定义结构，不绑定具体业务。

例：

```text
UI_Widget_Button_Base
├─ BG
├─ Frame
├─ IconMask
│  └─ Icon
├─ Label
├─ State
└─ FX
```

### 12.2 Variant Prefab

皮肤差异使用 Variant：

```text
UI_Widget_Button_Base
├─ UI_Widget_Button_Primary
├─ UI_Widget_Button_Danger
├─ UI_Widget_Button_IconOnly
├─ UI_Widget_Button_Locked
└─ UI_Widget_Button_Tab
```

### 12.3 业务 Prefab

业务界面组合使用控件预制体：

```text
UI_Screen_Inventory
├─ UI_Panel_InventoryTabs
├─ UI_Panel_InventoryGrid
├─ UI_Panel_ItemDetail
└─ UI_Widget_Button_Close
```

---

## 13. UI 逻辑绑定规则

### 13.1 禁止做法

```text
Screen_MainMenu.cs
- 直接控制 200 个子节点
- 直接 Find("Root/Panel/Button/Icon/Text")
- 直接改每个 Image 的颜色
- 直接写死金币图标、按钮文字、颜色
```

### 13.2 推荐做法

```text
Screen_MainMenu.cs
- 只管理界面级逻辑
- 子控件交给 Widget 自己管理
- 数据通过 Bind(data) 传入
- 按钮事件通过统一 Register / Unregister 管理
```

示例结构：

```text
MainMenuScreen
├─ BindPlayerInfo(playerData)
├─ BindCurrency(currencyData)
├─ OnClickStart()
├─ OnClickSettings()
└─ OnClose()

CurrencyWidget
├─ Bind(icon, value)
└─ PlayChangeMotion(delta)
```

---

## 14. UI 事件规则

1. Button 的 OnClick 可以在 Inspector 绑定简单事件，但复杂项目建议在代码里统一注册。
2. OnEnable 注册事件，OnDisable 解除事件。
3. 列表 Item 需要传 index / id，不要只传 GameObject。
4. 弹窗按钮统一返回结果，例如 Confirm / Cancel / Close。
5. UI 音效不要散落在每个按钮里，使用统一点击音效组件。

---

## 15. UI 性能规则

1. 大量列表必须考虑复用 Item，不要一次性生成几百个。
2. 动态文本、进度条、倒计时建议放独立 SubCanvas。
3. 不必要的 Raycast Target 全部关闭。
4. Mask 少用复杂形状，列表优先使用 RectMask2D。
5. Layout Group 不要无限嵌套，复杂界面最多 3-4 层自动布局。
6. 不要每帧调用 LayoutRebuilder，除非非常必要。
7. 不要在 Update 里频繁改 Text，数值变化时再刷新。
8. 隐藏很久的界面，淡出后 SetActive(false)。
9. 频繁打开关闭的弹窗可以对象池化。
10. UI 图片打进 SpriteAtlas，减少 DrawCall 和资源管理混乱。

---

## 16. 参考资料

- Unity Manual - Rect Transform: https://docs.unity3d.com/cn/2021.3/Manual/class-RectTransform.html
- Unity uGUI - Scroll Rect: https://docs.unity3d.com/Packages/com.unity.ugui@2.6/manual/script-ScrollRect.html
- Unity uGUI - Auto Layout: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UIAutoLayout.html
- Unity uGUI - Canvas Group: https://docs.unity3d.com/Packages/com.unity.ugui@2.6/manual/class-CanvasGroup.html
- Unity UI Toolkit - UXML: https://docs.unity3d.com/6000.4/Documentation/Manual/UIE-UXML.html
