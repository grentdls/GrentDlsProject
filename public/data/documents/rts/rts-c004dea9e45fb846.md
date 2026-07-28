# 03 - UI 动效规则：动画命名、实现规范、参数标准

---

## 1. UI 动效总原则

UI 动效的目的不是“炫”，而是让玩家更清楚：

1. 我点到了。
2. 这个控件可操作。
3. 这个结果很重要。
4. 这个界面正在出现或消失。
5. 这个数值发生了变化。
6. 这个操作失败了。

动效必须服务信息表达，不能影响操作效率。

---

## 2. 动效命名总表

| 名词 | 中文 | 用途 |
|---|---|---|
| `PressScale` | 按压缩放 | 按钮点击反馈。 |
| `HoverLift` | 悬停上浮 | PC 鼠标悬停。 |
| `SelectPulse` | 选中脉冲 | 选中 Tab、卡牌、物品格。 |
| `PopIn` | 弹出进入 | 弹窗、奖励、卡牌出现。 |
| `PopOut` | 弹出关闭 | 弹窗关闭。 |
| `FadeIn` | 淡入 | 界面显示。 |
| `FadeOut` | 淡出 | 界面隐藏。 |
| `SlideIn` | 滑入 | 面板从边缘进入。 |
| `SlideOut` | 滑出 | 面板离开。 |
| `Shake` | 抖动 | 操作失败、资源不足。 |
| `Punch` | 冲击缩放 | 获得奖励、数值增长。 |
| `DissolveOut` | 溶解消失 | 卡牌消失、道具消耗。 |
| `Flash` | 闪光 | 获得、冷却完成。 |
| `GlowLoop` | 循环发光 | 可领取、稀有物品。 |
| `SweepLight` | 扫光 | 高级按钮、卡牌品质。 |
| `CountUp` | 数字递增 | 金币、经验、伤害结算。 |
| `FillTween` | 填充变化 | 进度条、血条变化。 |
| `ToastRiseFade` | 提示上浮淡出 | Toast。 |
| `CooldownRadial` | 扇形冷却 | 技能按钮冷却。 |
| `RewardBurst` | 奖励爆发 | 获得大奖。 |

---

# 3. 动效实现方式选择

## 3.1 Animator

适合：

- 固定流程动画
- 弹窗开关
- 复杂状态机
- 美术制作好的 Timeline 式动画

优点：可视化，适合美术调。  
缺点：大量参数和状态机容易乱。

---

## 3.2 Tween 脚本

适合：

- 按钮按压缩放
- 淡入淡出
- 位移滑入
- 数字滚动
- 列表条目逐个出现
- 简单 Punch / Shake

推荐统一封装为 `UIMotionPlayer`，不要每个脚本自己写一套 Tween。

---

## 3.3 AnimationCurve

适合：

- 弹性曲线
- 非线性变化
- 自定义缓入缓出
- 项目不想依赖 DOTween 时

---

## 3.4 Shader / Material

适合：

- 溶解
- 扫光
- 边缘流光
- 灰度化
- 高亮描边

规则：

1. Shader 参数命名统一，例如 `_DissolveAmount`、`_GlowStrength`。
2. UI 材质要实例化，避免改一个控件影响全局。
3. 列表里大量 Item 不要每个都单独生成复杂材质。

---

# 4. 基础动效规则

## 4.1 PressScale 按压缩放

### 用途

所有可点击按钮默认使用。

### 参数

```text
Down Scale = 0.94 ~ 0.97
Down Duration = 0.06s
Up Scale = 1.00
Up Duration = 0.08s
Ease = OutBack / OutQuad
```

### 规则

1. 缩放对象为按钮 `Root` 或 `MotionRoot`。
2. 不要缩放整个 Screen。
3. 按下和松开都要有反馈。
4. 禁用按钮不播放 PressScale。

---

## 4.2 HoverLift 悬停上浮

### 用途

PC / 鼠标项目。

```text
Y Offset = +4 ~ +8
Scale = 1.02
Duration = 0.12s
Ease = OutQuad
```

### 规则

1. 移动端不需要 Hover。
2. Hover 不能改变 LayoutGroup 的尺寸，否则会挤动其他按钮。
3. Hover 只改视觉节点，不改布局节点。

---

## 4.3 SelectPulse 选中脉冲

### 用途

- 页签选中
- 卡牌选中
- 背包格选中
- 技能槽选中

```text
Scale = 1.00 → 1.06 → 1.00
Duration = 0.18s
SelectedFrame Alpha = 1
Glow Loop = 可选
```

### 规则

1. 选中态要保持，不是播放完就没。
2. 脉冲只是进入选中态的一次反馈。
3. 多选和单选的表现要区分。

---

## 4.4 PopIn 弹出进入

### 用途

弹窗、奖励卡、结算面板。

```text
Alpha = 0 → 1
Scale = 0.85 → 1.05 → 1.00
Duration = 0.22s ~ 0.35s
Ease = OutBack
```

### 层级要求

```text
PopupRoot
├─ Blocker              # 只淡入，不缩放
└─ Window               # 执行 PopIn 缩放
```

### 规则

1. 只缩放 Window，不缩放 Blocker。
2. 弹窗打开时先禁用交互，动画完成再开启。
3. 快速连点打开弹窗时要防止重复播放。

---

## 4.5 PopOut 弹出关闭

```text
Alpha = 1 → 0
Scale = 1.00 → 0.92
Duration = 0.15s ~ 0.22s
Ease = InQuad
```

规则：

1. 关闭开始时立刻 `interactable = false`。
2. 关闭结束后 `blocksRaycasts = false`。
3. 动画结束再 SetActive(false)。

---

## 4.6 FadeIn / FadeOut 淡入淡出

### 推荐用 CanvasGroup

```text
CanvasGroup.alpha
CanvasGroup.interactable
CanvasGroup.blocksRaycasts
```

### FadeIn

```text
SetActive(true)
alpha = 0
blocksRaycasts = true
interactable = false
Tween alpha 0 → 1
interactable = true
```

### FadeOut

```text
interactable = false
Tween alpha 1 → 0
blocksRaycasts = false
SetActive(false)
```

### 规则

1. alpha = 0 不等于不挡点击，必须同步设置 blocksRaycasts。
2. 长时间隐藏的 UI，淡出后 SetActive(false)。
3. 复杂窗口淡入淡出建议单独 SubCanvas。

---

## 4.7 SlideIn / SlideOut 滑入滑出

### 用途

- 侧边栏
- 任务面板
- 聊天面板
- 背包详情面板

### 参数

```text
Offset = 屏幕外 100% 或 80px
Duration = 0.25s ~ 0.4s
Ease = OutCubic
```

### Pivot 规则

| 方向 | Pivot |
|---|---|
| 左侧滑入 | 0, 0.5 |
| 右侧滑入 | 1, 0.5 |
| 上方滑入 | 0.5, 1 |
| 下方滑入 | 0.5, 0 |

---

## 4.8 Shake 抖动

### 用途

- 金币不足
- 无法购买
- 装备条件不满足
- 技能冷却中
- 密码错误

### 参数

```text
Strength = 8 ~ 16 px
Duration = 0.18s ~ 0.3s
Vibrato = 8 ~ 12
```

### 规则

1. 只抖动相关控件，不抖整个界面。
2. 抖动结束后必须回到原始位置。
3. 同一时间只播放一个 Shake，防止位置累加。
4. Shake 可配合错误音效。

---

## 4.9 Punch 冲击缩放

### 用途

- 获得奖励
- 数值增加
- 卡牌升级
- 任务完成
- 重要按钮出现

```text
Scale = 1.00 → 1.18 → 0.96 → 1.00
Duration = 0.25s
Ease = OutBack
```

### 规则

1. Punch 比 PressScale 更夸张，只用于结果反馈。
2. 不要所有按钮常态循环 Punch。

---

## 4.10 DissolveOut 溶解消失

### 用途

- 卡牌被消耗
- 道具被使用
- 奖励飞入背包后消失
- 任务条目完成后移除

### 实现

使用 UI Shader：

```text
_DissolveAmount = 0 → 1
_EdgeWidth = 0.02 ~ 0.08
_EdgeColor = 根据品质配置
Duration = 0.35s ~ 0.6s
```

### 层级建议

```text
CardRoot
├─ CaptureRoot / VisualRoot       # 应用溶解材质
└─ FX                             # 溶解粒子
```

### 规则

1. 溶解一般只作用在视觉层，不作用在 HitArea。
2. 溶解开始后立刻禁用点击。
3. 溶解完成后再隐藏或回收对象。

---

# 5. 高级 UI 动效

## 5.1 数字 CountUp

### 用途

- 金币增加
- 经验结算
- 伤害统计
- 评分结算

### 规则

```text
StartValue → TargetValue
Duration = 0.3s ~ 1.0s
大数字用分段加速
结束时 Punch 一次
```

示例：

```text
金币：100 → 235
显示：100, 128, 166, 205, 235
结束：播放 Punch + 金币音效
```

---

## 5.2 FillTween 进度条变化

### 用途

- 血条变化
- 经验条增长
- 加载条

### 规则

1. 普通 Fill 立即或快速变化。
2. DelayFill 延迟追赶。
3. 经验条满时播放 `LevelUpFlash`。
4. 血条低于 20% 播放 `LowWarningPulse`。

---

## 5.3 SweepLight 扫光

### 用途

- 高级按钮
- 传说卡牌
- 可领取奖励
- 商店推荐商品

### 实现方式

1. 在控件上方放一张斜向亮条。
2. 使用 Mask 限制亮条区域。
3. 亮条从左下移动到右上。
4. 循环间隔 2-5 秒。

层级：

```text
Button
├─ Visual
├─ SweepMask
│  └─ SweepLight
└─ Frame
```

规则：

1. 扫光不能太频繁。
2. 只用于需要吸引注意的控件。
3. 列表里大量 Item 不要全部循环扫光。

---

## 5.4 GlowLoop 循环发光

### 用途

- 可领取奖励
- 稀有物品
- 当前主线按钮

参数：

```text
Alpha = 0.35 → 0.85 → 0.35
Scale = 1.00 → 1.03 → 1.00
Duration = 1.2s ~ 2.0s
Loop = true
```

规则：

1. 同屏 GlowLoop 数量不超过 3-5 个。
2. 普通按钮不要循环发光。
3. 发光层放在 `FX/LoopFX`，不要影响按钮布局。

---

## 5.5 RewardBurst 奖励爆发

### 用途

- 结算大奖
- 抽卡获得高品质
- 宝箱开启

流程：

```text
1. 背景暗化
2. 奖励主体 PopIn
3. 光圈扩散
4. 粒子爆发
5. 数字 CountUp
6. ConfirmButton 延迟出现
```

规则：

1. 奖励主体和背景分层。
2. 高品质奖励才播放完整爆发。
3. 普通奖励使用轻量 PopIn 即可。

---

# 6. 动效时长标准

| 动效类型 | 推荐时长 |
|---|---:|
| 按钮按下 | 0.06s |
| 按钮回弹 | 0.08s |
| Hover | 0.12s |
| Tab 切换 | 0.15s |
| 弹窗进入 | 0.22-0.35s |
| 弹窗关闭 | 0.15-0.22s |
| 面板滑入 | 0.25-0.4s |
| Toast 出现 | 0.15s |
| Toast 停留 | 1.2-2.0s |
| Toast 消失 | 0.25s |
| Shake | 0.18-0.3s |
| 溶解 | 0.35-0.6s |
| 奖励爆发 | 0.8-1.5s |

---

# 7. Ease 曲线规则

| 曲线 | 用途 |
|---|---|
| OutQuad | 普通按钮、淡入、轻位移。 |
| OutCubic | 面板滑入、列表进入。 |
| OutBack | 弹窗 PopIn、奖励出现。 |
| InQuad | 关闭、淡出。 |
| InOutSine | 循环呼吸。 |
| Linear | 旋转 Loading、连续进度。 |

---

# 8. UI 动效组件架构

## 8.1 推荐组件

```text
UIMotionPlayer
├─ Play(string motionName)
├─ Stop(string motionName)
├─ ResetState()
├─ PlayEnter()
├─ PlayExit(Action onComplete)
├─ PlayClick()
├─ PlayError()
└─ PlaySelected(bool selected)
```

## 8.2 MotionConfig

```text
UIMotionConfig
├─ PressScale
├─ PopIn
├─ PopOut
├─ FadeIn
├─ FadeOut
├─ Shake
├─ Punch
├─ ToastRiseFade
└─ DissolveOut
```

规则：

1. 同名动效在全项目效果一致。
2. 某些控件可以覆盖参数，但不能随便改名。
3. 动效和音效可以通过同一个 MotionEvent 触发。

---

# 9. 动效层级规范

## 9.1 MotionRoot

需要动效的复杂控件，应该加 `MotionRoot`：

```text
ButtonRoot
├─ MotionRoot                  # 缩放、位移动效作用在这里
│  ├─ BG
│  ├─ Icon
│  ├─ Label
│  └─ State
└─ FX
```

优点：

1. Root 保持布局稳定。
2. MotionRoot 可以缩放，不影响 LayoutGroup。
3. FX 可独立播放，不跟随某些布局计算。

---

## 9.2 动效不应影响 Layout

错误：

```text
LayoutGroup
└─ ButtonRoot 被 Hover 放大，导致其他按钮挤开
```

正确：

```text
LayoutGroup
└─ ButtonRoot 固定尺寸
   └─ MotionRoot 放大缩小
```

---

# 10. UI 音效配合规则

| 动效 | 推荐音效 |
|---|---|
| PressScale | 普通点击音 |
| Confirm | 确认音 |
| Cancel / Close | 关闭音 |
| Error Shake | 错误音 |
| RewardBurst | 奖励音 |
| CountUp | 连续计数音 |
| LevelUpFlash | 升级音 |
| Tab Switch | 轻切换音 |

规则：

1. 音效不直接塞在 Animator 里，最好走统一 UIAudioPlayer。
2. 同一个按钮不要重复播放多个点击音。
3. 高频按钮音效需要限频。

---

# 11. 动效检查清单

| 检查项 | 必须 |
|---|---|
| 动效是否有统一名称 | 是 |
| 动效是否影响 Layout | 不允许 |
| 关闭时是否禁用交互 | 是 |
| FadeOut 后是否关闭 blocksRaycasts | 是 |
| 动效结束是否还原位置/缩放 | 是 |
| 循环动效数量是否过多 | 不能过多 |
| 低端机是否流畅 | 必须测试 |
| 快速连点是否会叠动画 | 不允许 |
| 弹窗是否能被正常关闭 | 是 |
| 动效是否和音效同步 | 建议 |
