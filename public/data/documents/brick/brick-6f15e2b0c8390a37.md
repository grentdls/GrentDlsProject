# 04 - UI 维护规范、检查清单、常见问题

---

## 1. UI 修改总规则

任何 UI 修改都先判断：

```text
这是配置问题？皮肤问题？控件问题？界面布局问题？还是业务逻辑问题？
```

不要看到问题就直接在场景层级里拖节点。这样短期快，长期会把项目搞成“谁都不敢改”的 UI 泥潭。

---

# 2. 修改优先级

```text
1. Config / ScriptableObject
2. Prefab Variant
3. Base Prefab
4. Screen / Popup Prefab
5. Scene Instance
```

## 2.1 什么时候改 Config

适合：

- 颜色
- 字号
- 间距
- 动效时长
- 音效名
- 稀有度颜色
- 品质边框配置
- 按钮点击音

## 2.2 什么时候改 Variant

适合：

- 某类按钮换皮
- 某类卡牌框不同
- 某类物品格稀有度表现
- 某个弹窗视觉风格不同

## 2.3 什么时候改 Base Prefab

适合：

- 所有按钮都要新增 Badge
- 所有 Slot 都要支持 Locked
- 所有 Popup 都要新增关闭热键
- 所有 ProgressBar 都要支持 DelayFill

## 2.4 什么时候改 Screen Prefab

适合：

- 某个界面布局调整
- 某个界面增加一块 Panel
- 某个界面按钮位置变化

## 2.5 什么时候可以改 Scene Instance

只适合临时调试。正式改动必须 Apply 到 Prefab，或者整理成 Variant。

---

# 3. UI 预制体维护规则

## 3.1 Prefab 必须有说明

复杂 UI 预制体建议在根节点加备注组件或说明文档，写清楚：

```text
用途：奖励三选一卡牌
数据入口：Bind(RewardData data)
状态：Normal / Selected / Disabled / Locked
动效：PopIn / SelectPulse / DissolveOut
可修改：Frame、Icon、DescText、KeywordRoot
禁止修改：Root尺寸、MotionRoot结构、State节点名
```

---

## 3.2 Prefab 禁止事项

1. 不要在业务界面里直接复制一份按钮然后改名使用。
2. 不要删除 Base Prefab 的核心节点。
3. 不要在 Variant 里改根节点结构，除非确认所有引用安全。
4. 不要把临时测试图留在正式 Prefab。
5. 不要让一个 Prefab 同时承担多个完全不同职责。
6. 不要把业务数据写死在 Prefab 文本里。

---

# 4. 资源维护规则

## 4.1 UI 图片命名

```text
ui_btn_primary_bg.png
ui_btn_primary_frame.png
ui_icon_coin.png
ui_icon_diamond.png
ui_frame_card_rare.png
ui_frame_card_legendary.png
ui_bg_popup_common.png
ui_fx_sweep_light.png
```

规则：

1. 小写 + 下划线。
2. 类型写在前面。
3. 用途写清楚。
4. 不要出现 `新建图层1`、`按钮最终版2`、`未命名`。

---

## 4.2 SpriteAtlas 规则

```text
Atlas_UI_Common
Atlas_UI_Icons
Atlas_UI_Cards
Atlas_UI_HUD
Atlas_UI_Popup
Atlas_UI_FX
```

规则：

1. 常驻 UI 和低频弹窗可以分不同图集。
2. 大背景不要随便塞进小图标图集。
3. 特效贴图单独图集，避免频繁改动影响普通 UI。
4. 图集命名要和资源目录一致。

---

# 5. 常见问题排查

## 5.1 按钮看得见但点不到

检查：

1. Button 是否 Interactable。
2. CanvasGroup 的 Interactable 是否为 true。
3. CanvasGroup 的 BlocksRaycasts 是否为 true。
4. 是否有透明 Image 挡在上面。
5. Graphic Raycaster 是否存在。
6. EventSystem 是否存在。
7. 按钮的 Raycast Target 是否开启。
8. 按钮是否被其他 Canvas Sorting Order 盖住。

---

## 5.2 UI 透明了但仍然挡住点击

原因：

```text
CanvasGroup.alpha = 0
但 CanvasGroup.blocksRaycasts = true
```

解决：

```text
隐藏 UI 时：
alpha = 0
interactable = false
blocksRaycasts = false
```

长时间隐藏还要：

```text
SetActive(false)
```

---

## 5.3 ScrollRect 滚不动

检查：

1. ScrollRect 的 Content 是否正确引用。
2. Viewport 是否正确引用。
3. Content 是否比 Viewport 大。
4. Vertical / Horizontal 是否开启。
5. Viewport 上是否有 RectMask2D 或 Mask。
6. 输入是否发生在 ScrollRect 范围内。
7. Content 的 Anchor / Pivot 是否正确。
8. 是否有上层透明图挡住拖动。

---

## 5.4 列表内容从中间展开，不从顶部开始

原因通常是 Content Pivot 错了。

推荐：

```text
纵向列表 Content Pivot = 0.5, 1
Grid列表 Content Pivot = 0, 1
```

---

## 5.5 Layout Group 下子物体尺寸乱跳

检查：

1. 子物体是否同时挂了 Content Size Fitter。
2. Layout Group 是否开启了 Control Child Size。
3. 子物体是否有 Layout Element。
4. 是否在动画里改了参与布局的节点 Scale。
5. 是否每帧改文字导致重建。

解决：

1. 动效放到 MotionRoot，不改布局节点。
2. 子项尺寸用 LayoutElement 控制。
3. 动态高度由脚本计算后统一刷新。

---

## 5.6 图片被 Mask 裁掉

检查：

1. 图标是否是 Mask 的子物体。
2. Mask 节点是否有 Image。
3. Mask 组件是否开启。
4. Show Mask Graphic 是否按需求设置。
5. 动效放大后是否超出 Mask 区域。

如果是按钮点击放大被裁掉，应该把 Mask 只用于 Icon，不要把整个按钮放进 Mask。

---

## 5.7 弹窗打开后背后按钮还能点

检查：

1. 是否有 Blocker。
2. Blocker 是否铺满全屏。
3. Blocker Image 的 Raycast Target 是否开启。
4. Popup Root CanvasGroup blocksRaycasts 是否开启。
5. Popup Canvas Sorting Order 是否高于 Screen Canvas。

---

## 5.8 动效播放后位置错了

原因：

1. 动效开始前没有记录原始位置。
2. 多个 Tween 同时控制同一个属性。
3. Shake 没有回到原点。
4. Layout Group 和 Tween 同时控制位置。

解决：

1. 每次播放前 Kill 旧 Tween。
2. 播放前缓存初始 anchoredPosition / scale / alpha。
3. 动效结束时 ResetState。
4. 不要对 LayoutGroup 直接子物体做位移动效。

---

# 6. UI 开发流程检查清单

## 6.1 制作前检查

| 检查项 | 是否完成 |
|---|---|
| 是否确认设计稿分辨率 |  |
| 是否确认横屏/竖屏 |  |
| 是否确认 UI 系统用 UGUI 还是 UI Toolkit |  |
| 是否确认哪些元素可复用 |  |
| 是否确认哪些图需要 9宫格 |  |
| 是否确认哪些控件需要动效 |  |
| 是否确认哪些文本需要多语言 |  |
| 是否确认是否需要 SafeArea |  |

---

## 6.2 制作中检查

| 检查项 | 是否完成 |
|---|---|
| Root / Panel / Widget 层级是否清楚 |  |
| Anchor 是否设置正确 |  |
| Pivot 是否符合动效 |  |
| 图片 Raycast Target 是否关闭 |  |
| 控件是否做成 Prefab |  |
| 相似控件是否用 Variant |  |
| 列表 Item 是否独立 Prefab |  |
| 弹窗是否有 CanvasGroup |  |
| 弹窗是否有 Blocker |  |
| 按钮是否有 Disabled 状态 |  |
| 选中控件是否有 Selected 状态 |  |

---

## 6.3 提交前检查

| 检查项 | 是否完成 |
|---|---|
| 1920x1080 显示正常 |  |
| 超宽屏显示正常 |  |
| 4:3 或 16:10 显示正常 |  |
| 长文本不溢出 |  |
| 列表能滚到底 |  |
| 弹窗能正常关闭 |  |
| 快速点击不报错 |  |
| 禁用按钮不可点击 |  |
| 透明 UI 不挡点击 |  |
| 打开关闭无残留动效 |  |
| 控件引用无 Missing |  |
| Console 无 UI 警告 |  |
| Profiler 中无明显 UI Rebuild 峰值 |  |

---

# 7. UI 代码维护规则

## 7.1 脚本字段

推荐：

```csharp
[SerializeField] private Button closeButton;
[SerializeField] private TextMeshProUGUI titleText;
[SerializeField] private CanvasGroup canvasGroup;
```

不推荐：

```csharp
GameObject.Find("Canvas/Panel/Button/Text")
transform.Find("Root/A/B/C/D")
```

---

## 7.2 Bind / Refresh / Clear

每个复杂控件建议有三个方法：

```csharp
Bind(data)       // 绑定数据
Refresh()        // 刷新显示
Clear()          // 清空状态
```

列表 Item 示例：

```csharp
public void Bind(ItemData data)
{
    this.data = data;
    icon.sprite = data.Icon;
    countText.text = data.Count.ToString();
    SetQuality(data.Quality);
    SetSelected(false);
}
```

---

## 7.3 事件注册

推荐：

```csharp
private void OnEnable()
{
    closeButton.onClick.AddListener(OnClickClose);
}

private void OnDisable()
{
    closeButton.onClick.RemoveListener(OnClickClose);
}
```

不推荐：

```csharp
closeButton.onClick.AddListener(() => { ... }); // 无法方便移除，复杂界面容易重复注册
```

如果必须用 lambda，需要明确生命周期，避免重复绑定。

---

# 8. UI 性能检查

## 8.1 容易造成性能问题的行为

1. 大量 Image 打开 Raycast Target。
2. 大量 Mask 嵌套。
3. 列表一次生成几百个 Item。
4. 每帧刷新 Text。
5. 每帧强制刷新 Layout。
6. 动态 UI 和静态背景在同一个 Canvas。
7. 多层 Layout Group + Content Size Fitter 互相驱动。
8. 弹窗隐藏只 alpha = 0，不 SetActive(false)。
9. 每个小控件单独一个 Canvas。
10. 大量材质实例没有复用。

---

## 8.2 优化规则

| 问题 | 优化方式 |
|---|---|
| 列表很长 | 使用虚拟列表 / 对象池。 |
| 数字频繁变化 | 单独 SubCanvas。 |
| 大量图标 | SpriteAtlas。 |
| 不需要点击 | 关闭 Raycast Target。 |
| 弹窗频繁开关 | 对象池 + CanvasGroup。 |
| 动效影响布局 | 使用 MotionRoot。 |
| 背景不动 | 放静态 Canvas。 |
| 高频 UI 重建 | 拆 Canvas，减少 Layout 嵌套。 |

---

# 9. 项目内 UI 评审标准

一个 UI 控件或界面可以合入项目，必须满足：

1. 层级命名清楚。
2. 核心元素做成 Prefab。
3. 相似皮肤做成 Variant。
4. 支持 Normal / Disabled / Selected 等必要状态。
5. Anchor 和 Pivot 合理。
6. 分辨率适配通过。
7. 动效命名符合规范。
8. 交互音效接入统一系统。
9. Raycast Target 没有乱开。
10. 无 Missing 引用、无 Console 报错。

---

# 10. 最终落地建议

如果项目 UI 已经比较乱，建议按下面顺序重构，不要一次推翻：

```text
第 1 步：统一 UIRoot / Canvas 层级
第 2 步：抽 Button Base Prefab
第 3 步：抽 Popup Base Prefab
第 4 步：抽 Slot / Card / List Item
第 5 步：整理 StyleConfig
第 6 步：整理 MotionConfig
第 7 步：替换旧界面的散乱按钮和列表项
第 8 步：做分辨率和 SafeArea 检查
```

优先改复用率最高的控件：按钮、弹窗、物品格、卡牌、列表。  
这些统一后，后续界面搭建速度会明显提升。
