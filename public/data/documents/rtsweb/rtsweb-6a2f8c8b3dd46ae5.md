# 07 内容自适应、动态高度、滚动区域、防溢出规则

## 1. 文档目标

游戏 UI 经常会遇到以下问题：

- 有的物品描述很短，有的物品描述很长。
- 有的技能只有 1 个效果，有的技能有 8 个词条。
- 有的语言文字短，换成中文/英文/日文后长度不同。
- 面板背景没有跟着内容变长。
- 内容超过背景框，文字跑到外面。
- ScrollRect 整个弹窗都在滚，关闭按钮也被滚走。

本文档专门规定 Unity UGUI 中动态内容的布局规则。

---

## 2. 自适应的核心原则

### 2.1 固定区和滚动区分离

所有详情面板必须分为：

```text
固定 Header
滚动 Body
固定 Footer
```

错误结构：

```text
ScrollRect
└── 整个面板
    ├── Header
    ├── Body
    └── Footer
```

这样会导致标题和按钮跟着滚动。

正确结构：

```text
PanelRoot
├── Header       固定
├── BodyScroll   只有内容滚动
└── Footer       固定
```

### 2.2 内容少时面板变短，内容多时内部滚动

详情面板高度不能无限变高。

推荐规则：

```text
PanelHeight = Clamp(ContentPreferredHeight + HeaderHeight + FooterHeight + Padding, MinHeight, MaxHeight)
```

解释：

- 内容少：面板接近 MinHeight，不显得空。
- 内容中等：面板根据内容自然变高。
- 内容多：面板达到 MaxHeight，BodyScroll 开始滚动。

---

## 3. 推荐高度规则

### 3.1 详情面板高度

| 平台 | MinHeight | MaxHeight |
|---|---:|---:|
| 手机横屏 | 屏幕高 45% | 屏幕高 82% |
| 手机竖屏 | 屏幕高 35% | 屏幕高 75% |
| PC | 360px | 屏幕高 80% |
| 平板 | 420px | 屏幕高 78% |

### 3.2 BodyScroll 高度

```text
BodyScrollHeight = PanelHeight - HeaderHeight - FooterHeight - TopBottomPadding
```

BodyScroll 最小高度建议：

- 移动端：160px
- PC：180px

如果 BodyScroll 太小，说明面板结构太拥挤，应改为更大的详情页，而不是弹窗。

---

## 4. Unity 组件配置方案

### 4.1 Content 使用 VerticalLayoutGroup

```text
Content
├── VerticalLayoutGroup
│   ├── Padding Top/Bottom/Left/Right
│   ├── Spacing
│   ├── Child Control Width: true
│   ├── Child Control Height: true
│   ├── Child Force Expand Width: true
│   └── Child Force Expand Height: false
└── ContentSizeFitter
    └── Vertical Fit: Preferred Size
```

规则：

- Content 的高度由子内容决定。
- 子 Section 的高度由文本、列表、LayoutElement 决定。
- 不要手动写死 Content 高度。

### 4.2 Section 使用 LayoutElement

每个 Section 推荐结构：

```text
Section_Effect
├── Bg_Inner_9Slice
├── VerticalLayoutGroup
├── LayoutElement
│   ├── Min Height
│   └── Preferred Height 自动或脚本计算
├── Txt_Title
└── Txt_Content
```

规则：

- Section 可以设置最小高度，避免内容少时太扁。
- 文本多时由 TextMeshPro PreferredHeight 撑开。
- 背景使用 9-Slice 跟随 Section 高度。

### 4.3 TextMeshPro 设置

长文本推荐：

```text
TextMeshProUGUI
├── Enable Word Wrapping: true
├── Overflow: Overflow 或 Truncate/Ellipsis，按场景选择
├── Auto Size: 谨慎使用
├── Rich Text: true
└── Raycast Target: false，除非文本可点击
```

不同文本场景：

| 场景 | Overflow 推荐 |
|---|---|
| 物品名字 | Ellipsis，最多 2 行 |
| 按钮文字 | Ellipsis 或 Shrink |
| 正文描述 | Overflow，交给父级滚动 |
| Tooltip | Overflow + 限制最大宽度 |
| 列表项标题 | Ellipsis，最多 1 行 |
| 聊天气泡 | Overflow，气泡自适应 |

---

## 5. 面板自适应实现方案

### 5.1 纯 LayoutGroup 方案

适合：简单弹窗、Tooltip、小卡片。

结构：

```text
PopupRoot
├── VerticalLayoutGroup
├── ContentSizeFitter Vertical Preferred Size
├── Bg_9Slice
├── Header
├── Content
└── Footer
```

优点：简单。

缺点：内容太多时容易撑出屏幕，需要额外限制最大高度。

### 5.2 推荐方案：脚本控制最大高度

适合：详情面板、奖励面板、设置说明面板。

逻辑：

```text
1. 刷新数据
2. ForceRebuildLayoutImmediate(Content)
3. 获取 Content preferred height
4. 计算 Panel preferred height
5. Clamp 到 MinHeight / MaxHeight
6. 设置 PanelRoot height
7. 设置 BodyScroll height
8. 如果 ContentHeight > BodyScrollHeight，显示滚动条
9. 否则隐藏滚动条
```

伪代码：

```csharp
float contentH = LayoutUtility.GetPreferredHeight(contentRect);
float targetH = headerH + footerH + paddingY + contentH;
float panelH = Mathf.Clamp(targetH, minPanelH, maxPanelH);
float bodyH = panelH - headerH - footerH - paddingY;

panelRect.SetSizeWithCurrentAnchors(RectTransform.Axis.Vertical, panelH);
bodyScrollRect.SetSizeWithCurrentAnchors(RectTransform.Axis.Vertical, bodyH);
scrollbar.gameObject.SetActive(contentH > bodyH + 2f);
```

注意：

- 刷新布局前要先设置文本内容。
- 某些情况下需要等一帧再 ForceRebuild。
- 不要每帧重算，只在数据变化时重算。

---

## 6. 防止内容超出背景框

### 6.1 背景必须跟随容器，不跟随文本

错误结构：

```text
Txt_Desc
└── Bg 作为文字子节点
```

正确结构：

```text
Section_Desc
├── Bg_9Slice
└── Txt_Desc
```

背景挂在 Section 上，Section 由 LayoutGroup 撑开。

### 6.2 不要让文字直接控制面板根节点

文字只负责撑开自己的 Section。面板根节点由统一脚本或父级 Layout 控制。

### 6.3 内边距必须由 LayoutGroup 维护

不要靠手动拖文字位置来制造内边距。

```text
Section_Desc
├── VerticalLayoutGroup Padding: 16,16,12,12
└── Txt_Desc
```

---

## 7. 内容过多时的处理策略

### 7.1 优先滚动，不要缩小到看不清

当内容超过最大高度时：

推荐：Body 内部滚动。

不推荐：把所有文字自动缩小。

文字缩小会导致不同物品详情可读性不一致。

### 7.2 信息折叠

适合大量词条、属性、日志、说明。

```text
Section_AdvancedStats
├── HeaderRow
│   ├── Txt_Title: 更多属性
│   └── Btn_ExpandArrow
└── Content_AdvancedStats
```

规则：

- 默认只显示核心信息。
- 玩家需要时展开。
- 展开状态可在当前界面保留。

### 7.3 分页

适合内容类型差异很大。

例如角色详情：

```text
[属性] [装备] [技能] [天赋] [背景]
```

不要把所有信息塞在一个无限长的 ScrollRect 里。

### 7.4 摘要 + 详情

适合复杂效果。

```text
摘要：
命中时触发连锁闪电。

详细：
命中敌人时有 25% 概率释放连锁闪电，对附近 3 个敌人造成 60% 攻击力的闪电伤害……
```

默认显示摘要，点击“详细”展开。

---

## 8. 内容过少时的处理策略

内容少也会丑。常见问题是面板很大但只有两行字。

解决方案：

### 8.1 使用 MinHeight

每个 Section 可以设置最小高度。

```text
Section_Effect MinHeight = 72
Section_Desc   MinHeight = 88
```

### 8.2 使用占位说明

例如没有词条：

```text
暂无特殊词条
```

但不要把所有空模块都显示出来。

### 8.3 空模块隐藏

如果某个模块没有内容，直接隐藏整个 Section。

```text
if item.keywords.Count == 0:
    Section_Keyword.SetActive(false)
```

隐藏后 LayoutGroup 自动回收空间。

### 8.4 重点内容放大

奖励弹窗、抽卡结果、获得物品时，如果内容少，可以让 Icon 更大、按钮更低、留白更舒服。

---

## 9. 不同 UI 类型的自适应规则

### 9.1 Tooltip

Tooltip 规则：

- 宽度固定或限制范围。
- 高度根据内容自适应。
- 超过最大高度时，优先精简内容，不建议滚动。
- 必须避免超出屏幕边界。

```text
TooltipWidth = Clamp(ContentPreferredWidth, 220, 420)
TooltipHeight = Clamp(ContentPreferredHeight, 80, 360)
```

### 9.2 详情弹窗

- Header/Footer 固定。
- BodyScroll 滚动。
- Panel 高度 Clamp。
- 内容少时隐藏空 Section。

### 9.3 列表项

列表项不建议高度完全自由，否则列表滚动体验不稳定。

推荐：

- 普通列表项固定高度。
- 卡片列表可以有 2-3 种固定高度。
- 动态高度列表只用于日志、聊天、公告。

### 9.4 聊天气泡

- 气泡宽度有最大值。
- 高度随文字变化。
- 头像固定。
- 时间/名字弱化。

### 9.5 奖励卡牌

- 卡牌尺寸固定。
- 卡内描述最多固定行数。
- 超长效果进入详情 Tooltip。

---

## 10. ScrollRect 规范

### 10.1 标准结构

```text
ScrollArea
├── ScrollRect
├── Viewport
│   ├── Image 可选
│   ├── Mask / RectMask2D
│   └── Content
│       └── VerticalLayoutGroup / GridLayoutGroup
└── Scrollbar 可选
```

### 10.2 Viewport 必须裁剪内容

- 矩形列表用 `RectMask2D`。
- 异形窗口才用 `Mask`。
- Scrollbar 不要遮挡内容，应该预留右侧 Padding。

### 10.3 滚动条显示规则

| 内容状态 | 滚动条 |
|---|---|
| 内容不超出 | 隐藏 |
| 内容超出 | 显示 |
| 手柄太小 | 设置最小手柄高度 |

推荐：滚动条手柄最小高度不低于 32px。

---

## 11. Grid 自适应规则

背包格、图鉴格、商品格常用 GridLayoutGroup。

### 11.1 固定格子尺寸

```text
GridLayoutGroup
├── Cell Size: 96×116
├── Spacing: 8×8
├── Constraint: Fixed Column Count
└── Constraint Count: 根据屏幕宽度设置
```

### 11.2 不同屏幕列数

| 屏幕宽度 | 推荐列数 |
|---:|---:|
| 1280 | 5-6 |
| 1600 | 6-7 |
| 1920 | 7-8 |
| 手机横屏 | 5-7 |
| 手机竖屏 | 3-4 |

### 11.3 选中后详情区域不要挤压格子

背包界面推荐左侧 Grid 固定宽度，右侧详情固定宽度，中间留间距。

不要点击一个物品后让整个 Grid 重新变形。

---

## 12. SafeArea 与屏幕边界

### 12.1 所有全屏 UI 必须挂 SafeArea

```text
Canvas
└── SafeAreaRoot
    ├── TopLayer
    ├── MiddleLayer
    └── BottomLayer
```

### 12.2 弹窗最大尺寸不能贴边

弹窗最大宽高：

```text
MaxWidth = SafeAreaWidth - 96
MaxHeight = SafeAreaHeight - 96
```

小屏幕可以改成：

```text
MaxWidth = SafeAreaWidth - 48
MaxHeight = SafeAreaHeight - 48
```

---

## 13. 动态布局常见错误

### 错误 1：ContentSizeFitter 和 LayoutGroup 互相打架

现象：布局抖动、尺寸反复变化。

解决：

- Content 上可以用 ContentSizeFitter。
- 子项上尽量用 LayoutElement。
- 不要在父子多层都滥用 ContentSizeFitter。

### 错误 2：文字超出后继续显示

解决：

- Viewport 使用 RectMask2D。
- 文本所在 Section 使用 LayoutGroup 撑高。
- 面板达到 MaxHeight 后启用 ScrollRect。

### 错误 3：按钮被滚走

解决：

- Footer 不放进 ScrollRect。

### 错误 4：背景被文字撑歪

解决：

- 背景用 9-Slice。
- 背景挂 Section，不挂 Text。

### 错误 5：内容少时面板空

解决：

- 隐藏空 Section。
- 使用 MinHeight。
- 让核心 Icon/标题更突出。

---

## 14. 自适应检查清单

- [ ] Header、Body、Footer 是否分离？
- [ ] Header/Footer 是否不会跟着内容滚动？
- [ ] Body 内容超出时是否启用 ScrollRect？
- [ ] 内容未超出时滚动条是否隐藏？
- [ ] 背景是否使用 9-Slice？
- [ ] Section 是否由 LayoutGroup 管理？
- [ ] 长名字是否限制最大行数？
- [ ] 长描述是否不会超出背景？
- [ ] 空 Section 是否隐藏？
- [ ] 内容少时面板是否不会巨大空洞？
- [ ] 小屏幕是否不会贴边？
- [ ] SafeArea 是否生效？
- [ ] 是否避免每帧重算布局？
