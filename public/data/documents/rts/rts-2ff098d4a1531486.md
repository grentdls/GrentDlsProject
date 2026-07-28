# UI 交互反馈规范

## 目标

所有可交互 UI 使用同一套反馈规则：`UiPressFeedback` 负责状态机，`UiMotionConfig` 负责可调数值，具体位置、大小、图片和静态层级仍由 Prefab 决定。

## 覆盖范围

- `Button`、`Toggle`、`Slider`、`Dropdown`、`InputField` 等 `Selectable` 子类都会通过 `UiPrefabResolver.EnsureSelectableFeedback()` 自动补齐反馈。
- 动态生成的建造卡、造兵卡、科技卡、编队条目、主菜单按钮、设置按钮和结算按钮继续走 `UiPrefabResolver.EnsurePressFeedback()` 或 Prefab 实例化入口。
- 只允许保留这一套交互反馈组件，不新增平行的按钮动画系统。

## 状态表现

- Normal：保持 Prefab/运行时设置的基础图片、颜色、缩放和描边。
- Hover：轻微放大、提亮、描边/阴影发光，并播放带冷却的 `UiAudioCue.Hover`。
- Pressed：缩小到按压比例、进一步提亮和加强发光，松开后回弹。
- Selected：持续轻微放大和金色发光，可通过 `UiPressFeedback.SetSelected(true)` 标记。
- Disabled：禁用 `Selectable.interactable` 后自动降亮、降低透明度，并关闭发光。
- Dragging：拖动中保持接近 Selected 的视觉，不抢占普通 Hover。

## 调整数值

默认数值来自 `Assets/Resources/UI/Configs/ButtonMotion_Default.asset`：

- `HoverScale`：悬停放大比例。
- `PressedScale`：按下缩放比例。
- `SelectedScale`：选中放大比例。
- `PressBrighten`：悬停/按下提亮强度。
- `HoverGlowAlpha`：悬停发光强度。
- `SelectedGlowAlpha`：选中发光强度。
- `PressLerpSpeed` / `ReleaseLerpSpeed`：按下和释放动画速度。

面板类如果需要较弱反馈，可使用 `PanelMotion_Default.asset` 或在对应 Prefab Library entry 指定专属 MotionConfig。

## Prefab 调整规则

- 交互反馈只改 `transform.localScale`、根 `Graphic.color`、根 `Outline/Shadow`，不改 `RectTransform.sizeDelta`、锚点、布局组参数或图片资源。
- `UiPressFeedback` 会在空闲态收养外部对缩放、颜色、描边的修改，因此运行时高亮、Prefab 调整和 Inspector 换图不会被脚本顶回旧值。
- 子节点文字、图标、装饰层仍应关闭 `raycastTarget`；真实点击区域只放在根 `Selectable`、ScrollRect viewport、小地图内容等交互对象上。
- 需要更复杂的 Tooltip、长按详情、Buff 详情时，继续使用现有详情组件，不把详情逻辑塞进 `UiPressFeedback`。
