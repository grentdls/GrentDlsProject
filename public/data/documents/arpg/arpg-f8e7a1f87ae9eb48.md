# 35_UI 预制体制作规范：目录、锚点、适配、九宫格切图


> 设计边界说明：本项目可以参考《流放之路2》这类暗黑刷宝 ARPG 的信息架构、交互复杂度和系统深度，但不能一比一复制其 UI 视觉、图标、文字、专有数值、专有命名、具体排版截图。本批文档采用“同类结构 + 原创表现”的方式：界面功能、层级、预制体和数据绑定可直接用于 Unity 原型开发。


## 1. UI 资源目录

```text
Assets/Game/UI
├── Art
│   ├── Frames
│   ├── Buttons
│   ├── Icons
│   ├── Backgrounds
│   ├── RarityFrames
│   ├── SkillIcons
│   ├── ItemIcons
│   └── MapIcons
├── Fonts
├── Materials
├── Prefabs
│   ├── Common
│   ├── HUD
│   ├── Loadout
│   ├── Inventory
│   ├── Equipment
│   ├── Skill
│   ├── PassiveTree
│   ├── Shop
│   ├── NPC
│   ├── Map
│   ├── Quest
│   ├── Settings
│   └── Popup
├── Scenes
│   └── UI_TestScene.unity
└── Scripts
```

## 2. Canvas Scaler

```text
UI Scale Mode：Scale With Screen Size
Reference Resolution：1920 × 1080
Screen Match Mode：Match Width Or Height
Match：0.5
Reference Pixels Per Unit：100
```

## 3. 安全区适配

所有大窗口挂 `UISafeAreaFitter`。

```text
UISafeAreaFitter
├── ApplyTopSafeArea = true
├── ApplyBottomSafeArea = true
├── ApplyLeftSafeArea = true
└── ApplyRightSafeArea = true
```

## 4. 锚点规则

| UI 类型 | Anchor |
|---|---|
| 顶部栏 | Top Stretch |
| 底部栏 | Bottom Stretch |
| 左侧面板 | Left Stretch Height |
| 右侧面板 | Right Stretch Height |
| 中心窗口 | Middle Center |
| Tooltip | 动态跟随鼠标，自动防出屏 |
| HUD 血条 | Bottom Left / Bottom Center |
| 小地图 | Bottom Right |

## 5. 9 切图规则

所有可缩放框体必须是 Sprite 9 Slice：

```text
Frame_DarkPanel_9Sliced
Frame_Header_9Sliced
Frame_ItemSlot_9Sliced
Frame_Tooltip_9Sliced
Button_Primary_9Sliced
Button_Secondary_9Sliced
```

切图要求：

1. 四角不能拉伸。
2. 边缘可横向/纵向拉伸。
3. 中心区域纯色或轻纹理。
4. 所有框体保留 4 px 以上安全边。

## 6. TextMeshPro 规则

| 类型 | 字号 | 字重 |
|---|---:|---|
| 大标题 | 36 | Bold |
| 面板标题 | 28 | Bold |
| 页签 | 22 | Medium |
| 正文 | 20 | Regular |
| Tooltip 正文 | 18 | Regular |
| 小提示 | 16 | Regular |
| 数值 | 18 | Medium |

## 7. 颜色语义

颜色不能照搬其他游戏，但语义必须统一：

```text
普通文本：浅灰白
次级文本：灰
正向变化：绿色系
负向变化：红色系
警告：橙黄色系
不可用：暗灰
普通物品：灰白
魔法物品：蓝色系
稀有物品：黄色系
独特物品：棕金色系
任务物品：绿色/紫色系
```

## 8. UI Common Prefab

```text
UI_Button_Primary.prefab
UI_Button_Secondary.prefab
UI_Button_Icon.prefab
UI_TabButton.prefab
UI_PanelFrame.prefab
UI_HeaderBar.prefab
UI_SearchInput.prefab
UI_Dropdown.prefab
UI_Toggle.prefab
UI_Slider.prefab
UI_ItemSlot.prefab
UI_CurrencyRow.prefab
UI_StatRow.prefab
UI_TagBadge.prefab
UI_ConfirmPopup.prefab
UI_QuantityPopup.prefab
```

## 9. Prefab 变体规则

```text
UI_ItemSlot.prefab
├── UI_ItemSlot_InventoryVariant.prefab
├── UI_ItemSlot_ShopVariant.prefab
├── UI_ItemSlot_StashVariant.prefab
└── UI_ItemSlot_RewardVariant.prefab
```

不要复制多个完全独立版本，要用 Prefab Variant。

## 10. UI 测试场景

```text
UI_TestScene.unity
├── UIRoot
├── MockGameDataProvider
├── MockInventoryGenerator
├── MockItemTooltipTester
├── MockShopTester
├── MockSkillTester
├── MockMapDeviceTester
└── UI_DebugPanel
```

测试场景必须支持：

1. 随机生成 100 个物品。
2. 随机生成词条。
3. 打开全部 UI。
4. 模拟手柄焦点。
5. 切换分辨率。
6. 切换语言。
7. 切换 UI 缩放。

## 11. 原型验收标准

1. 所有 UI 都是 Prefab。
2. 所有大面板支持 1920×1080、2560×1440、3440×1440。
3. Tooltip 不会超出屏幕。
4. 背包格子支持大量数据滚动不卡顿。
5. UI TestScene 可以一键打开所有界面。
