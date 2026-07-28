# Unity UI 控件制作规则文档 - 总目录

> 适用范围：Unity UGUI / Canvas / RectTransform / Prefab 架构。  
> 默认目标：手游 / PC 独立游戏 / 桌面游戏 UI，强调可复用、可换皮、可维护、可动效化。  
> 推荐配套：TextMeshPro、Sprite Atlas、Addressables 或 Resources 管理、可选 DOTween/LeanTween。

---

## 0. 文档目标

这套文档不是单纯解释 Unity 每个 UI 组件是什么，而是规定 **项目里应该怎么做 UI**。

它解决下面这些问题：

1. 控件怎么搭层级。
2. 图片、文字、按钮、列表、进度条、滑动条怎么做成预制体。
3. 后续想改尺寸、换图、换动效、改文本、改间距，应该改哪里。
4. 按钮如何做框体、底图、图标遮罩、状态切换。
5. UI 动效如何统一命名和实现，例如缩放、抖动、弹出、淡出、溶解消失。
6. 如何减少“每个界面都手搓一套”的混乱问题。

---

## 1. 文件结构

```text
unity_ui_rules_docs/
├─ README_文档总目录.md
├─ 00_Unity_UI_总规范_术语_预制体架构.md
├─ 01_UI基础控件与高级控件制作规则.md
├─ 02_UI层级布局_适配_修改规则.md
├─ 03_UI动效规则_动画命名_实现规范.md
└─ 04_UI维护规范_检查清单_常见问题.md
```

---

## 2. 推荐阅读顺序

| 顺序 | 文档 | 用途 |
|---:|---|---|
| 1 | `00_Unity_UI_总规范_术语_预制体架构.md` | 先统一项目 UI 的命名、层级、控件名词、预制体规则。 |
| 2 | `01_UI基础控件与高级控件制作规则.md` | 具体讲按钮、进度条、滑动条、列表、弹窗、卡牌、遮罩等怎么做。 |
| 3 | `02_UI层级布局_适配_修改规则.md` | 讲 Canvas、Panel、Header、Content、Footer、SafeArea、Layout Group 怎么搭。 |
| 4 | `03_UI动效规则_动画命名_实现规范.md` | 讲按钮缩放、窗口弹出、淡入淡出、抖动、溶解、数字跳动等动效。 |
| 5 | `04_UI维护规范_检查清单_常见问题.md` | 用于项目中后期，避免 UI 改崩、层级混乱、性能变差。 |

---

## 3. 本文档默认使用的 UI 系统

本套规范默认使用 **UGUI**：

- Canvas
- RectTransform
- Image / RawImage
- TextMeshProUGUI
- Button / Toggle / Slider / ScrollRect
- Layout Group / Content Size Fitter / Layout Element
- Mask / RectMask2D
- CanvasGroup
- Animator / Tween / AnimationCurve

UI Toolkit 可以用于编辑器工具、设置页、复杂表单、PC 工具型界面；但如果项目已经大量使用 UGUI，游戏内 HUD、战斗界面、弹窗、卡牌、背包、角色界面建议继续使用 UGUI，避免两套 UI 系统混用导致维护成本暴涨。

---

## 4. 项目内统一规则一句话版

1. **界面用 Screen Prefab，控件用 Widget Prefab，皮肤用 Variant。**
2. **层级永远分为：背景层、布局层、交互层、动效层、特效层。**
3. **按钮不是一张图，而是一个结构：HitArea + Frame + Icon + Label + State + FX。**
4. **列表不是把一堆物体塞进去，而是 ScrollRect + Viewport + Content + ItemPrefab。**
5. **动效必须命名，不能每个人随便做。**
6. **修改优先改 Prefab / Variant / Config，不要直接改场景里的实例。**
7. **所有 UI 图片默认关闭不必要的 Raycast Target。**
8. **弹窗显示隐藏用 CanvasGroup 管 alpha、interactable、blocksRaycasts。**
9. **复杂界面要拆成子预制体，不能一个界面 300 个散乱节点。**
10. **能用锚点和布局解决的，不用代码硬改位置。**

---

## 5. 统一术语速查

| 术语 | 含义 |
|---|---|
| Screen | 一个完整界面，例如主界面、背包界面、设置界面。 |
| Panel | 界面中的一块功能区域，例如左侧菜单、右侧详情、底部按钮栏。 |
| Widget | 可复用 UI 控件，例如按钮、进度条、卡牌、物品格。 |
| Skin | 控件的视觉皮肤，例如普通按钮、红色按钮、稀有卡牌框。 |
| State | 控件状态，例如 Normal、Pressed、Selected、Disabled、Locked。 |
| Slot | 放置物品、技能、角色、装备的格子。 |
| Frame | 框体，通常是按钮框、卡牌框、头像框、装备框。 |
| Fill | 填充条，进度条、血条、经验条中会变化的部分。 |
| Mask | 遮罩，让子物体只显示在指定形状范围内。 |
| Viewport | 列表可见区域。 |
| Content | ScrollRect 中真正滚动的内容容器。 |
| Entry / Item | 列表里的一个条目。 |
| Modal | 模态弹窗，出现时会阻止玩家操作背后界面。 |
| Toast | 轻提示，不阻止操作，几秒后消失。 |
| Overlay | 覆盖层，例如黑色遮罩、新手引导遮罩、Loading。 |
| SafeArea | 手机刘海屏、圆角、系统手势区域的安全显示范围。 |
| Motion | UI 动效。 |
| Token | 项目统一的尺寸、颜色、间距、时间、曲线等参数。 |

---

## 6. 输出物怎么用

建议把这套文档放到项目目录：

```text
/Docs/UI/
  README_文档总目录.md
  00_Unity_UI_总规范_术语_预制体架构.md
  01_UI基础控件与高级控件制作规则.md
  02_UI层级布局_适配_修改规则.md
  03_UI动效规则_动画命名_实现规范.md
  04_UI维护规范_检查清单_常见问题.md
```

如果你的 Unity 工程已经有自己的命名规范，可以只保留本文档的结构原则，把前缀和目录名替换成你自己的项目名。
