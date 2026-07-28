# 262 常驻角色 HUD 优化：血条、护盾、资源、技能按钮与 Buff

## 1. 血条结构

不可拖动血条不建议使用完整 Slider，推荐：

```text
HealthBar
├── Background
├── DamageDelayFill
├── CurrentFill
└── ShieldFill
```

`CurrentFill` 使用 `Image.Type = Filled`，层级更简单。

## 2. 更新逻辑

```text
OnHealthChanged(current, max)
OnShieldChanged(current, max)
OnResourceChanged(current, max)
```

HUD 保存目标值，只在变化后短暂插值。动画结束后停止更新。

延迟掉血条只在受伤时启动，不应永久 Tick。

## 3. 文本更新

例如 `1250 / 1800`：

```text
只在整数变化时更新
或每 0.1 秒刷新一次
使用 TMP.SetText
预热数字和常用字符
避免 string.Format、ToString、字符串拼接高频调用
```

## 4. 技能按钮

错误做法：每个技能按钮 Update 中分别查询冷却、资源、沉默、武器、充能、强化。

推荐事件：

```text
OnCooldownStarted
OnCooldownFinished
OnSkillStateChanged
OnChargeChanged
OnResourceStateChanged
OnSkillEnhanced
```

只把正在冷却、引导或蓄力的按钮加入统一 Tick 列表：

```text
ActiveCooldownWidgets
ActiveCastWidgets
```

刷新频率建议：

```text
冷却环形遮罩：30 Hz
倒计时数字：10 Hz
资源不足提示：状态变化时刷新
```

## 5. Buff 图标

问题：频繁 Instantiate、LayoutGroup 重排、每帧更新倒计时。

优化：

```text
Buff 图标对象池
固定槽位或固定网格
最多显示 12 个
同类 Buff 合并层数
重要 Debuff 优先
倒计时只在整数秒变化时刷新
```

避免在高频增删区使用 `ContentSizeFitter`。

## 6. Boss 血条

```text
只在 Boss 战激活
阶段切换事件驱动
生命、护盾、韧性分层
受伤时才启动延迟条动画
```

## 7. Canvas 分区

```text
Canvas_PlayerStatus
Canvas_SkillBar
Canvas_Buff
Canvas_Boss
```

技能冷却变化不应让角色头像、生命条、任务栏一起重建。

## 8. Raycast Target

关闭：

```text
血条背景
装饰边框
技能冷却遮罩
Buff 底图
非交互文本
```

只保留真正可点击的技能按钮、药剂按钮和菜单入口。

## 9. 验收

```text
角色属性不变时血条不更新
非冷却技能按钮不参与 Tick
Buff 文本不逐帧刷新
技能变化不触发整个 HUD Canvas 重建
```
