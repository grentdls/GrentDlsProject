# 82 Buff、Debuff、异常状态 UI 显示规则

> 项目：Unity 3D ACT 暗黑刷宝 ARPG  
> 文档批次：第七批 HUD 全规则  
> 原则：参考同类暗黑刷宝 ARPG 的信息层级与战斗可读性，不复制任何商业游戏的 UI 视觉、图标、专有名称或具体数值。  
> 目标：所有头顶信息、血条、跳字、Buff、交互提示、拾取标签、Boss 条、目标提示都可以由策划配置，程序只实现通用规则。

## 1. 设计目标

Buff / Debuff / 异常状态 UI 需要解决：

- 玩家知道自己身上有什么增益和危险。
- 玩家知道敌人是否被点燃、冰冻、破防、诅咒。
- Boss 关键抗性和机制状态不能被普通 Buff 淹没。
- 高频短 Buff 不刷屏。
- 策划可配置图标、层级、持续时间、堆叠、刷新方式。

---

## 2. 状态分类

```text
StatusEffect
├── Buff                # 增益
├── Debuff              # 减益
├── ElementAilment      # 元素异常：燃烧/冰冻/感电等
├── PhysicalAilment     # 流血/眩晕/破甲等
├── Curse               # 诅咒
├── Aura                # 光环
├── Reservation         # 保留技能
├── FlaskEffect         # 药剂效果
├── BossMechanic        # Boss 机制状态
├── Immunity            # 免疫/无敌/保护
├── CooldownState       # 内置冷却状态
└── HiddenState         # 后台状态，不显示
```

---

## 3. 玩家 Buff 栏

### 3.1 位置

玩家 Buff 栏建议放在：

- 生命/资源 HUD 上方。
- 或技能栏上方。
- 移动端可放在屏幕左上，分组折叠。

### 3.2 结构

```text
Prefab_PlayerStatusBar
├── Root
│   ├── BuffGroup_Positive
│   │   ├── BuffIcon_01
│   │   └── BuffIcon_N
│   ├── BuffGroup_Debuff
│   │   ├── DebuffIcon_01
│   │   └── DebuffIcon_N
│   ├── BuffGroup_Reservation
│   ├── BuffGroup_Flask
│   └── MoreButton_Collapsed
```

### 3.3 玩家状态显示优先级

| 优先级 | 状态 | 显示规则 |
|---:|---|---|
| 100 | 致命 Debuff、即将死亡类状态 | 永远显示，闪烁 |
| 95 | 冰冻、眩晕、沉默、禁用技能 | 永远显示，大图标 |
| 90 | Boss 机制标记、被点名 | 屏幕中心/角色旁提示 |
| 85 | 诅咒、重度中毒、流血 | Debuff 栏靠前 |
| 80 | 药剂效果 | 药剂组显示 |
| 75 | 保留技能/光环 | 可折叠显示 |
| 60 | 常规 Buff | Buff 栏显示 |
| 40 | 短时间触发 Buff | 可合并/隐藏低优先级 |
| 20 | 后台数值状态 | 默认隐藏 |

---

## 4. 敌人状态图标

敌人状态图标应简化，避免每个怪头上挂满小图标。

### 4.1 普通怪

- 最多显示 3 个状态图标。
- 只显示关键异常：冻结、眩晕、破防、诅咒、燃烧。
- Dot 类可以通过伤害跳字表现，不一定显示图标。

### 4.2 精英怪

- 最多显示 5 个状态图标。
- 显示 Buff 与 Debuff 摘要。
- 强化词缀图标和 Debuff 图标分开。

### 4.3 Boss

Boss 状态显示分三层：

```text
BossTopBar_StatusRow       # 关键异常/抗性/机制
BossMechanicBar            # 独立机制条
WorldBossStatusHint        # 场地/点名/蓄力提示
```

Boss 不显示所有普通状态，只显示：

- 可被玩家利用的状态：破防、冻结窗口、易伤。
- 危险状态：狂暴、蓄力、护盾回复。
- 机制状态：充能、阶段锁血、核心保护。

---

## 5. Buff 图标结构

```text
Prefab_BuffIcon
├── Root_ButtonOrImage
│   ├── Image_Backplate
│   ├── Image_Icon
│   ├── Image_CooldownRadial       # 圆形倒计时
│   ├── Image_StackBg
│   ├── Text_StackCount
│   ├── Text_Timer
│   ├── Image_QualityFrame         # 重要度边框
│   ├── Image_DispelMark           # 可驱散标记
│   └── TooltipTrigger
```

---

## 6. 持续时间显示

| 持续时间 | 显示方式 |
|---|---|
| < 3 秒 | 数字倒计时到 0.1 秒，图标闪烁 |
| 3-10 秒 | 整数秒倒计时，圆形遮罩 |
| 10-60 秒 | 整数秒或只显示圆形遮罩 |
| > 60 秒 | 可显示分钟，低频刷新 |
| 永久 | 不显示时间，显示常驻标记 |
| 条件持续 | 显示链条/条件图标，不显示倒计时 |
| 保留技能 | 显示锁定/保留标记 |

---

## 7. 堆叠规则

### 7.1 堆叠显示

| 堆叠类型 | 显示 |
|---|---|
| 普通层数 | 右下角数字 |
| 高层数 | 数字缩略，如 99+ |
| 强度层 | 图标边框颜色加深 |
| 多来源同类 | 合并图标，Tooltip 展开来源 |
| 独立来源 | 分开显示，但需要上限 |

### 7.2 刷新方式

```text
RefreshDuration       # 刷新持续时间
AddStack              # 增加层数，不刷新时间
RefreshAndAddStack    # 增层并刷新时间
ReplaceStronger       # 强者覆盖弱者
IndependentStack      # 多来源独立计时
```

UI 必须能显示当前配置类型。

---

## 8. 异常状态规则

### 8.1 元素异常

| 异常 | 图标表现 | 目标表现 | 跳字/反馈 |
|---|---|---|---|
| 燃烧 | 火焰图标 + 时间 | 身上火焰粒子 | Dot 跳字偏火色 |
| 冰缓 | 冰晶图标 | 动作变慢，蓝色边缘 | 可显示“冰缓” |
| 冰冻 | 大冰块图标 | 模型冻结 | 显示“冻结” |
| 感电 | 电弧图标 | 身上电流 | 闪电伤害更亮 |
| 脆弱/易伤 | 裂纹图标 | 外框裂纹 | 增伤反馈 |

### 8.2 物理异常

| 异常 | 图标表现 | 目标表现 | 说明 |
|---|---|---|---|
| 流血 | 血滴图标 | 红色滴落 | 移动时加重可显示脚印 |
| 眩晕 | 星环图标 | 头顶星环 | 禁止行动 |
| 破甲 | 破盾图标 | 护甲裂纹 | 防御下降 |
| 破防 | 大裂纹图标 | 硬直 | 与韧性条联动 |
| 击退抗性下降 | 后退箭头 | 可选 | 低优先级 |

### 8.3 诅咒

诅咒必须与普通 Debuff 区分：

- 图标边框使用暗紫/暗红系。
- Tooltip 显示来源和效果摘要。
- 玩家身上超过 3 个诅咒时，出现总警告图标。
- Boss 免疫或抵抗诅咒时，跳字显示“抵抗”。

---

## 9. 状态 Tooltip

鼠标悬浮 Buff 图标显示：

```text
状态名称
类型：Buff / Debuff / 异常 / 诅咒 / 药剂 / 保留
剩余时间：8.5 秒
层数：4
来源：技能名 / 怪物名 / 装备词条
效果：
- 攻击速度 +12%
- 每秒受到 34 火焰伤害
- 移动时流血伤害提高
```

手柄/移动端：

- 打开角色状态面板时显示详细 Tooltip。
- 战斗中只显示简短提示。

---

## 10. Buff 栏排序

玩家 Buff 栏排序建议：

```text
致命 Debuff
→ 控制状态
→ Boss 机制点名
→ 强 Debuff/诅咒
→ 药剂效果
→ 保留/光环
→ 常规 Buff
→ 短触发 Buff
→ 低优先级隐藏
```

敌人状态排序：

```text
破防/眩晕
→ 易伤
→ 冻结/冰缓
→ 燃烧/中毒/流血
→ 诅咒
→ 玩家特殊标记
→ 其他
```

---

## 11. Buff 配置字段

```json
{
  "StatusId": "Ailment_Burning",
  "DisplayName": "燃烧",
  "Category": "ElementAilment",
  "IconPath": "UI/Icons/Status/Burning",
  "ShowOnPlayer": true,
  "ShowOnEnemyCommon": false,
  "ShowOnEnemyElite": true,
  "ShowOnBossBar": true,
  "Priority": 65,
  "MaxDisplayCountInGroup": 5,
  "StackDisplayMode": "CountNumber",
  "DurationDisplayMode": "RadialAndSeconds",
  "BlinkWhenRemainingSeconds": 3,
  "CanBeDispelled": true,
  "TooltipTemplate": "Status_Burning_Tooltip"
}
```

---

## 12. 性能规则

- 状态图标变化使用事件刷新，不每帧扫描全部状态。
- 倒计时文本 10Hz 刷新即可。
- 圆形遮罩可以每帧更新，但数量上限要控制。
- 普通怪状态图标只在血条显示时刷新。
- Boss 状态栏永远保留对象，不频繁创建。

---

## 13. 验收标准

- 玩家受到流血、中毒、燃烧、冰冻、感电、诅咒时 UI 可清楚区分。
- Buff 层数、持续时间、刷新方式显示正确。
- Boss 只显示关键状态，不被小状态图标淹没。
- 精英怪状态图标最多显示 5 个，超出合并。
- 玩家致命 Debuff 具有明显警告。
- 手柄模式下能查看 Buff 详情。
