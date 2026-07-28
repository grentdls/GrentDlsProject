# 伤害跳字、单位血条 HUD 与 Buff 显示完整规则文档

> 项目类型：2D 横版清版动作 RPG / DNF 式战斗  
> 当前模块：伤害跳字、扣血表现、单位头顶 HUD、Buff / Debuff 显示  
> 目标：让玩家通过跳字、血条、图标和动画，一眼区分普通伤害、暴击、穿甲、元素伤害、治疗、护盾、持续伤害和特殊状态。

---

## 1. 设计目标

伤害反馈系统的目标不是单纯显示数字，而是让玩家瞬间判断：

```text
这次打出了什么类型的伤害？
是不是暴击？
有没有穿甲？
是不是元素伤害？
这个元素伤害有没有暴击？
敌人是否被破防 / 点燃 / 中毒 / 冰冻？
敌人的血条为什么掉得快？
这个单位身上现在有哪些 Buff / Debuff？
```

最终效果：

```text
普通伤害：清楚但不抢眼
暴击伤害：更大、更亮、更弹、更久
穿甲伤害：带破甲感、锐利感、金属碎裂感
元素伤害：伤害数字前带元素图标
元素暴击：元素图标 + 暴击表现同时出现
治疗：绿色上飘
护盾吸收：蓝白护盾数字
免疫 / 抵抗：小字提示
Buff / Debuff：单位头顶 HUD 上清楚显示图标和持续时间
```

---

## 2. 伤害跳字总体结构

每一次伤害跳字由以下部分组成：

```text
伤害图标区
伤害标签区
伤害数字区
附加状态区
动画表现
音效 / 特效
```

### 2.1 跳字组成示意

普通物理：

```text
128
```

暴击：

```text
暴击 356
```

穿甲：

```text
破甲 412
```

火元素伤害：

```text
[火] 188
```

火元素暴击：

```text
[火] 暴击 520
```

雷元素穿甲暴击：

```text
[雷] 破甲 暴击 690
```

治疗：

```text
+120
```

护盾吸收：

```text
[盾] 80
```

免疫：

```text
免疫
```

---

## 3. 伤害类型分类

### 3.1 基础伤害类型

| 类型 | 说明 | 跳字重点 |
|---|---|---|
| Physical | 普通物理伤害 | 白 / 淡黄数字 |
| Magic | 普通法术伤害 | 蓝紫数字 |
| TrueDamage | 真实伤害 | 白金数字 |
| Heal | 治疗 | 绿色 + 号 |
| ShieldAbsorb | 护盾吸收 | 蓝白护盾数字 |
| PoisonDot | 中毒持续伤害 | 绿色小数字 |
| BurnDot | 灼烧持续伤害 | 橙红小数字 |
| BleedDot | 流血持续伤害 | 暗红小数字 |
| Immune | 免疫 | 灰白文字 |
| Resist | 抵抗 | 灰色小字 |
| Miss | 未命中 | 灰色小字 |

### 3.2 元素伤害类型

| 元素 | 图标 | 主色 | 说明 |
|---|---|---|---|
| Fire | 火焰图标 | 橙红 | 灼烧、爆发 |
| Ice | 冰晶图标 | 浅蓝 | 冰冻、减速 |
| Thunder | 雷电图标 | 金黄 | 麻痹、连锁 |
| Poison | 毒滴图标 | 绿色 | 中毒、持续掉血 |
| Wind | 风刃图标 | 青绿 | 快速、多段 |
| Earth | 岩石图标 | 棕金 | 破防、击退 |
| Light | 光芒图标 | 金白 | 治疗、净化 |
| Dark | 暗影图标 | 紫黑 | 吸血、诅咒 |

### 3.3 特殊高伤害标签

| 标签 | 触发条件 | 表现 |
|---|---|---|
| Crit | 暴击 | 大号、弹出、红金描边 |
| ArmorPierce | 穿甲 | 金属裂纹、银橙色、锐利弹出 |
| Weakness | 弱点 | 金色闪光、图标放大 |
| BackAttack | 背击 | 紫金小标签 |
| Break | 破防 | 红橙爆裂 |
| Execute | 斩杀 | 超大、停留更久 |
| ComboBonus | 连击加成 | 右侧小标签 |

---

## 4. 跳字显示优先级

当一次伤害同时包含多个属性时，按以下顺序显示：

```text
元素图标 > 弱点 / 破防 / 穿甲 > 暴击 > 伤害数字 > 附加状态
```

### 4.1 文本组合规则

| 伤害情况 | 显示 |
|---|---|
| 普通物理 | `128` |
| 普通暴击 | `暴击 356` |
| 穿甲伤害 | `破甲 300` |
| 穿甲暴击 | `破甲 暴击 620` |
| 火元素 | `[火] 188` |
| 火元素暴击 | `[火] 暴击 520` |
| 火元素穿甲 | `[火] 破甲 460` |
| 火元素穿甲暴击 | `[火] 破甲 暴击 820` |
| 雷元素弱点暴击 | `[雷] 弱点 暴击 900` |
| 中毒持续伤害 | `[毒] 32` 小号 |
| 治疗暴击 | `[光] 暴击 +320` |
| 护盾吸收 | `[盾] 80` |

### 4.2 最高优先级覆盖

如果一次伤害是斩杀：

```text
斩杀 > 暴击 > 穿甲 > 元素
```

显示示例：

```text
[火] 斩杀 9999
```

斩杀不隐藏元素图标，但可以隐藏普通“暴击”标签，避免文字过长。

---

## 5. 跳字视觉规格

### 5.1 字号层级

| 层级 | 用途 | 字号倍率 | 停留时间 |
|---|---|---:|---:|
| Tiny | DoT 持续伤害 | 0.75 | 0.55s |
| Normal | 普通伤害 | 1.0 | 0.75s |
| Heavy | 高伤害 | 1.15 | 0.85s |
| Crit | 暴击 | 1.35 | 1.05s |
| ArmorPierce | 穿甲 | 1.28 | 0.95s |
| Weakness | 弱点 | 1.4 | 1.1s |
| Execute | 斩杀 | 1.7 | 1.35s |

移动端基础字号建议：

```text
普通伤害：26 px
持续伤害：20 px
暴击：36 px
穿甲：34 px
斩杀：44 px
治疗：28 px
免疫 / 抵抗：22 px
```

PC 可整体缩小 10% 左右。

---

## 6. 跳字颜色规则

### 6.1 基础颜色

| 类型 | 主色 | 描边 | 阴影 |
|---|---|---|---|
| 普通物理 | 淡黄白 | 深棕 | 轻阴影 |
| 魔法 | 蓝紫 | 深蓝 | 轻阴影 |
| 真实伤害 | 白金 | 金棕 | 白色外光 |
| 暴击 | 红金 | 深红 | 金色外光 |
| 穿甲 | 银橙 | 深灰 | 金属碎裂光 |
| 弱点 | 金黄 | 深棕 | 强外光 |
| 治疗 | 绿色 | 深绿 | 柔光 |
| 护盾吸收 | 蓝白 | 深蓝 | 蓝光 |
| 中毒 | 绿色 | 深绿 | 轻毒雾 |
| 灼烧 | 橙红 | 深红 | 火光 |
| 流血 | 暗红 | 黑红 | 血滴 |
| 免疫 | 灰白 | 深灰 | 无 |
| 抵抗 | 灰蓝 | 深灰 | 无 |

### 6.2 元素图标颜色

元素图标必须保持高识别度：

```text
火：橙红火苗
冰：浅蓝冰晶
雷：金黄闪电
毒：绿色毒滴
风：青色风刃
土：棕金岩块
光：金白星芒
暗：紫黑暗焰
```

---

## 7. 跳字动画规则

### 7.1 普通伤害动画

```text
出现：Scale 0.8 → 1.0
移动：向上飘 45 px
横向：随机偏移 -12~12 px
淡出：最后 0.25s 淡出
总时长：0.75s
```

### 7.2 暴击动画

```text
出现：Scale 0.5 → 1.45 → 1.0
移动：向上弹 65 px
横向：轻微抖动
停顿：出现后停 0.08s
外光：红金闪一下
总时长：1.05s
```

### 7.3 穿甲动画

```text
出现：Scale 0.6 → 1.3
移动：斜上弹出 55 px
额外表现：数字后方有短暂金属裂纹碎片
文字略带锐利拉伸
总时长：0.95s
```

### 7.4 元素伤害动画

元素伤害必须在数字前显示图标。

```text
元素图标先弹出 0.03s
数字随后弹出
图标和数字一起上飘
图标带轻微元素粒子
```

火元素：

```text
图标旁有小火星
数字尾部带短火焰残影
```

冰元素：

```text
图标有冰晶闪烁
数字移动较慢
```

雷元素：

```text
数字快速抖一下
有短闪电线
```

毒元素：

```text
数字慢慢上飘
有小毒泡
```

### 7.5 元素暴击动画

元素暴击 = 元素图标 + 暴击动画组合。

```text
元素图标放大 1.25
暴击数字使用红金/元素混合色
背景有元素爆点
停留时间比普通元素长
```

示例：

```text
[火] 暴击 520
火图标爆出火星
数字红金描边，内部偏橙
```

### 7.6 持续伤害动画

DoT 不能太抢眼。

```text
字号小
上飘短
无强弹出
总时长 0.55s
同类型 DoT 可合并
```

合并规则：

```text
0.4s 内同一目标同一 DoT 类型可以累计显示一次
```

### 7.7 治疗动画

```text
显示 + 数字
绿色
向上慢飘
带小星光
总时长 0.9s
暴击治疗可以显示“暴击 +320”
```

### 7.8 护盾吸收动画

```text
蓝白色
数字前加盾牌图标
向上轻弹
不如暴击夸张
如果护盾被打破，额外显示“护盾破碎”
```

---

## 8. 跳字生成位置规则

### 8.1 普通单位

跳字生成在：

```text
单位头顶上方 0.3~0.6 单位
或者 HurtBox 中心上方
```

### 8.2 大型 Boss

Boss 体型大，跳字生成需要分散：

```text
命中点附近生成
如果没有命中点，则在 Boss 身体随机区域生成
高伤害跳字偏向 Boss 头部上方
```

### 8.3 多段伤害防重叠

同一目标短时间内多个跳字：

```text
每个新跳字增加随机 X 偏移
Y 起始高度递增
同类型小伤害可合并
大伤害优先显示在最上层
```

最大显示限制：

```text
普通单位周围最多 5 个跳字
精英单位周围最多 8 个跳字
Boss 周围最多 16 个跳字
全屏最多 60 个跳字
```

超出后：

```text
丢弃低优先级普通小伤害
保留暴击、穿甲、弱点、治疗、玩家受伤
```

---

## 9. 跳字层级与排序

### 9.1 跳字优先级

从高到低：

```text
玩家受到的伤害
斩杀
暴击 / 弱点 / 穿甲
治疗
元素伤害
普通伤害
持续伤害
抵抗 / 免疫
```

### 9.2 显示层级

```text
DamageNumber_PlayerTaken
DamageNumber_HighPriority
DamageNumber_Normal
DamageNumber_Dot
DamageNumber_SystemText
```

玩家自己受伤的跳字必须比敌人受伤更醒目。

---

## 10. 单位头顶 HUD 总结构

每个战斗单位头顶 HUD 包含：

```text
单位名称，可选
等级，可选
血条
护盾条，可选
破防条，可选
Buff / Debuff 图标行
施法条，可选
状态文本，可选
```

### 10.1 普通敌人 HUD

```text
Lv 5
████████ HP
[Buff图标][Debuff图标]
```

### 10.2 精英敌人 HUD

```text
★ Lv 8 狂暴豺狼
████████████ HP
Break █████
[Buff][Debuff][Debuff]
```

### 10.3 Boss HUD

Boss 需要两套：

```text
头顶小 HUD：状态和局部血条，可选
屏幕顶部 Boss 大血条：主要血量、阶段、Buff
```

---

## 11. 血条扣血表现

### 11.1 血条分层

单位血条至少有 4 层：

```text
底板层
即时血量层
延迟扣血层
受击闪光层
```

可选增加：

```text
护盾层
元素受击染色层
破防闪烁层
中毒 / 灼烧边缘层
```

### 11.2 基础扣血动画

当单位受伤：

```text
即时血量层立即减少
延迟扣血层延迟 0.15~0.25s
延迟扣血层用 0.25~0.45s 追上即时血量层
血条轻微震动
受击闪光层闪一下
```

### 11.3 扣血动画参数

| 伤害类型 | 即时层 | 延迟层 | 血条震动 | 闪光 |
|---|---|---|---|---|
| 普通伤害 | 立即减少 | 0.25s 追随 | 小 | 白黄 |
| 暴击 | 立即减少 | 0.45s 追随 | 中 | 红金 |
| 穿甲 | 立即减少 | 0.35s 追随 | 中 | 银橙裂纹 |
| 元素伤害 | 立即减少 | 0.3s 追随 | 小/中 | 元素色 |
| 弱点 | 立即减少 | 0.45s 追随 | 中 | 金色 |
| 斩杀 | 立即归零 | 快速破碎 | 大 | 红黑 |
| DoT | 小幅减少 | 无或很短 | 无 | 对应元素色 |
| 护盾吸收 | HP 不动 | 护盾减少 | 小 | 蓝白 |

---

## 12. 不同伤害对血条的增强表现

### 12.1 暴击扣血

```text
血条边框红金闪烁
血条轻微放大 1.05
延迟扣血层变成深红
血条震动 0.08s
```

### 12.2 穿甲扣血

```text
血条上出现短暂裂纹纹理
护甲图标破碎小特效
延迟扣血层偏银橙
如果触发破甲 Debuff，Buff 行显示破甲图标
```

### 12.3 火焰伤害

```text
血条边缘出现橙红火星
如果附加灼烧，血条右侧显示灼烧图标
DoT 扣血时血条末端有小火光跳动
```

### 12.4 冰霜伤害

```text
血条外框短暂变浅蓝
如果附加冰冻/减速，Buff 行显示冰晶图标
血条动画变得略慢，表现冰冷感
```

### 12.5 雷电伤害

```text
血条短促闪黄
轻微左右抖动
如果麻痹，显示雷电 Debuff 图标
```

### 12.6 毒伤害

```text
血条底部出现绿色毒雾边
DoT 扣血为小跳
Debuff 图标显示中毒层数和持续时间
```

### 12.7 流血伤害

```text
血条末端有暗红滴落感
DoT 数字暗红
Debuff 图标显示流血层数
```

### 12.8 真实伤害

```text
血条受到白金色切割闪光
不显示防御相关减免
跳字为白金色
```

### 12.9 护盾吸收

如果单位有护盾：

```text
先扣护盾层
护盾层在 HP 条外侧或上方
护盾减少时蓝白闪光
HP 条不变
护盾破碎时显示“护盾破碎”
```

### 12.10 免疫 / 抵抗

免疫时：

```text
血条不减少
血条边框出现灰白挡弹效果
跳字显示“免疫”
```

抵抗时：

```text
血条减少较少
跳字显示“抵抗”
Debuff 不添加或持续时间变短
```

---

## 13. 血条状态显示

### 13.1 血条颜色

| 单位类型 | HP 颜色 |
|---|---|
| 玩家 | 绿色 / 红色，根据项目统一 |
| 普通敌人 | 红色 |
| 精英敌人 | 橙红 |
| Boss | 深红 |
| 友方召唤物 | 蓝绿 |
| 中立单位 | 黄色 |

### 13.2 低血表现

敌人低于 30% HP：

```text
血条颜色变深
血条边缘轻微闪烁
精英 / Boss 可显示濒死状态图标
```

玩家低血：

```text
屏幕边缘红色暗角
角色 HUD 心跳闪
血条闪烁
低血音效限制频率
```

---

## 14. Buff / Debuff HUD 显示规则

### 14.1 显示位置

单位头顶血条下方显示 Buff / Debuff：

```text
血条上方：名称 / 等级
中间：HP / Shield / Break
血条下方：Buff / Debuff 图标行
```

示意：

```text
Lv8 豺狼
████████ HP
[狂暴][破甲][中毒][减速]
```

### 14.2 图标数量

普通敌人：

```text
最多显示 4 个
```

精英敌人：

```text
最多显示 6 个
```

Boss：

```text
头顶最多显示 6 个
顶部 Boss 血条可显示 8~10 个
```

超过时：

```text
按优先级显示
剩余折叠为 +N
```

### 14.3 Buff / Debuff 优先级

从高到低：

```text
控制类：眩晕、冰冻、沉默、定身
防御变化：破甲、护盾、无敌、霸体
高危 DoT：中毒、灼烧、流血
输出变化：狂暴、增伤、减伤
移动变化：加速、减速
普通增益：回血、回蓝
普通标记：任务标记、仇恨标记
```

### 14.4 Buff 图标结构

每个图标包含：

```text
图标底板
状态图标
边框颜色
持续时间环
层数数字
即将结束闪烁
正负状态角标
```

结构：

```text
BuffIcon
├── Frame
├── Icon
├── DurationRadialMask
├── StackText
├── PositiveArrow / NegativeArrow
└── EndingFlash
```

### 14.5 正负 Buff 区分

正面 Buff：

```text
绿色 / 蓝色边框
右上角小上箭头
```

负面 Debuff：

```text
红色 / 紫色边框
右下角小下箭头
```

特殊状态：

```text
金色边框：无敌 / Boss 阶段
银色边框：护盾
黑紫边框：诅咒
```

---

## 15. 常见 Buff / Debuff 表现

| 状态 | 图标 | HUD 表现 | 血条效果 |
|---|---|---|---|
| Burn 灼烧 | 火焰 | 红橙边框，时间环 | 血条末端火星 |
| Poison 中毒 | 毒滴 | 绿色边框，层数 | 血条下方毒雾 |
| Bleed 流血 | 血滴 | 暗红边框，层数 | 血条暗红滴落 |
| Freeze 冰冻 | 冰晶 | 蓝色边框 | 血条冰霜覆盖 |
| Slow 减速 | 冰脚印 | 蓝灰边框 | 无或轻蓝边 |
| Stun 眩晕 | 星星 | 黄色边框 | 血条上方星星 |
| ArmorBreak 破甲 | 裂盾 | 橙银边框 | 血条裂纹 |
| Shield 护盾 | 盾牌 | 蓝白边框 | 护盾条显示 |
| Rage 狂暴 | 红爪 | 红色上箭头 | 血条红边闪 |
| SuperArmor 霸体 | 金盾 | 金色边框 | 血条金边 |
| Invincible 无敌 | 白光 | 白金边框 | 血条白光罩 |
| WeakMark 弱点标记 | 靶心 | 金色下箭头 | 受击金光 |
| Vulnerable 易伤 | 破裂心 | 紫红下箭头 | 血条紫红闪 |

---

## 16. Buff 持续时间显示

### 16.1 时间环

每个 Buff 图标使用径向时间环：

```text
刚添加：满环
时间减少：顺时针减少
剩余 20%：开始闪烁
结束：图标缩小淡出
```

### 16.2 层数显示

如果 Buff 可叠层：

```text
右下角显示层数数字
```

示例：

```text
中毒 x3
流血 x5
狂暴 x2
```

层数变化时：

```text
数字弹一下
图标发光 0.15s
```

### 16.3 永久 Buff

永久状态：

```text
不显示时间环
图标边框常亮
```

---

## 17. Buff 添加 / 移除动画

### 17.1 添加 Buff

```text
图标从 0.6 放大到 1.15 再回 1.0
边框闪光
单位身上播放对应状态特效
```

### 17.2 刷新 Buff

```text
时间环回满
图标轻闪
层数不变时不强烈弹出
```

### 17.3 叠层 Buff

```text
层数数字弹出
图标轻震
最多 0.2s 动画
```

### 17.4 移除 Buff

```text
图标缩小到 0.8
透明度降低
淡出
```

### 17.5 即将结束

```text
剩余时间 < 20%
图标边框慢闪
Debuff 闪烁颜色更明显
```

---

## 18. 伤害与 Buff 的联动规则

### 18.1 火焰伤害与灼烧

```text
火元素技能命中
→ 跳字显示 [火] 数字
→ 如果触发灼烧，单位 HUD 增加灼烧图标
→ 血条边缘火星
→ 后续 DoT 显示 [火] 小数字
```

### 18.2 毒伤害与中毒层数

```text
毒伤害命中
→ 跳字显示 [毒] 数字
→ 中毒图标出现
→ 叠层时层数 +1
→ DoT 跳字变小并合并
```

### 18.3 穿甲与破甲 Debuff

```text
穿甲伤害命中
→ 跳字显示 破甲 数字
→ 血条出现裂纹
→ 如果附加破甲 Debuff，显示裂盾图标
→ 破甲期间后续物理伤害跳字可更亮
```

### 18.4 冰伤害与减速 / 冰冻

```text
冰伤害命中
→ 跳字显示 [冰] 数字
→ 如果触发减速，显示减速图标
→ 如果触发冰冻，减速图标替换为冰冻图标
→ 血条出现冰霜边
```

### 18.5 雷伤害与麻痹

```text
雷伤害命中
→ 跳字显示 [雷] 数字
→ 暴击时数字抖动更明显
→ 触发麻痹时显示雷电图标
→ 血条短促黄闪
```

---

## 19. 玩家受伤跳字规则

玩家受伤需要比敌人受伤更醒目，但不能挡住操作。

### 19.1 玩家受伤显示

```text
红色数字
出现在玩家头顶或角色旁边
字号比敌人普通伤害大 10%
低血时数字更亮
```

### 19.2 玩家受到暴击

```text
显示“重击”或“暴击”
数字红黑描边
屏幕轻震
血条强闪
```

### 19.3 玩家被控制

```text
显示状态文字：
眩晕
冰冻
中毒
灼烧
破甲
```

同时玩家 HUD Buff 区显示 Debuff。

---

## 20. 跳字 UI 预制体结构

### 20.1 DamageNumberRoot

```text
DamageNumberRoot
├── CanvasGroup
├── RectTransform
├── Icon_Element
├── Text_Tag_Left
├── Text_DamageNumber
├── Text_Tag_Right
├── Icon_Extra
├── VFX_Container
└── Animator / DOTweenController
```

### 20.2 控件说明

| 节点 | 控件 | 说明 |
|---|---|---|
| Icon_Element | Image | 元素图标 |
| Text_Tag_Left | TMP_Text | 破甲 / 弱点 / 斩杀 |
| Text_DamageNumber | TMP_Text | 核心数字 |
| Text_Tag_Right | TMP_Text | 暴击 / Combo |
| Icon_Extra | Image | 护盾、背击等小图标 |
| VFX_Container | RectTransform | 小粒子、裂纹等 |
| CanvasGroup | CanvasGroup | 淡入淡出 |

---

## 21. 单位 HUD 预制体结构

### 21.1 UnitHUDRoot

```text
UnitHUDRoot
├── RootFollowTarget
├── NameRow
│   ├── Text_Level
│   ├── Text_Name
│   └── Icon_Elite
│
├── HPBarRoot
│   ├── HP_Background
│   ├── HP_DelayDamage
│   ├── HP_Current
│   ├── HP_Shield
│   ├── HP_Flash
│   ├── HP_ElementOverlay
│   └── HP_Frame
│
├── BreakBarRoot
│   ├── Break_Background
│   └── Break_Current
│
├── CastBarRoot
│   ├── Cast_Background
│   ├── Cast_Current
│   └── Text_CastName
│
├── BuffRow
│   ├── BuffIcon_01
│   ├── BuffIcon_02
│   ├── BuffIcon_03
│   ├── BuffIcon_04
│   └── BuffMore
│
└── StateTextRoot
    └── Text_State
```

### 21.2 血条控件要求

```text
HP_Current 使用 Image Fill 或 RectTransform 宽度变化
HP_DelayDamage 使用独立 Image
HP_Shield 使用独立 Image，显示在 HP 上方
HP_Flash 使用短暂透明闪图
HP_ElementOverlay 根据伤害类型短暂切换颜色
```

---

## 22. BuffIcon 预制体结构

```text
BuffIcon
├── Image_Background
├── Image_Frame
├── Image_Icon
├── Image_DurationRadial
├── Text_Stack
├── Image_PositiveArrow
├── Image_NegativeArrow
├── Image_EndingFlash
└── TooltipTrigger，可选
```

### 22.1 Buff 图标尺寸

| 单位类型 | 图标尺寸 |
|---|---:|
| 普通敌人 | 18~22 px |
| 精英敌人 | 22~26 px |
| Boss 顶部 HUD | 28~34 px |
| 玩家 HUD | 28~34 px |

---

## 23. 数据表设计

### 23.1 DamageNumberStyle.csv

```csv
DamageVisualType,BaseSize,Color,OutlineColor,Duration,MoveY,ScaleStart,ScalePeak,Shake,Priority
NormalPhysical,26,#FFF1B8,#4A2B18,0.75,45,0.8,1.0,false,30
Magic,28,#93B7FF,#203066,0.8,48,0.8,1.05,false,35
Crit,36,#FF3B2F,#7A1008,1.05,65,0.5,1.45,true,80
ArmorPierce,34,#FFD28A,#3D3D3D,0.95,55,0.6,1.3,true,75
Weakness,38,#FFD700,#5A3500,1.1,68,0.55,1.5,true,85
Execute,44,#FF1414,#1A0000,1.35,80,0.45,1.7,true,100
Heal,28,#67FF7A,#0B4A1A,0.9,55,0.8,1.15,false,50
ShieldAbsorb,26,#A7D8FF,#174B7A,0.8,45,0.8,1.05,false,45
Dot,20,#78D65A,#113B18,0.55,32,0.9,1.0,false,20
Immune,22,#D0D0D0,#333333,0.7,35,0.8,1.0,false,25
```

### 23.2 ElementIconConfig.csv

```csv
Element,Icon,Color,VFX,CanCrit
Fire,Icon_Element_Fire,#FF6A2A,VFX_Damage_FireSpark,true
Ice,Icon_Element_Ice,#8EEBFF,VFX_Damage_IceSpark,true
Thunder,Icon_Element_Thunder,#FFD84A,VFX_Damage_ThunderFlash,true
Poison,Icon_Element_Poison,#72D94C,VFX_Damage_PoisonBubble,true
Wind,Icon_Element_Wind,#65E0C8,VFX_Damage_WindSlice,true
Earth,Icon_Element_Earth,#C28A42,VFX_Damage_RockChip,true
Light,Icon_Element_Light,#FFF2A6,VFX_Damage_LightStar,true
Dark,Icon_Element_Dark,#8B5CFF,VFX_Damage_DarkSmoke,true
```

### 23.3 UnitHUDReaction.csv

```csv
DamageType,HPFlashColor,ShakePower,DelayTime,OverlayVFX,BuffHint
Physical,#FFF1B8,0.05,0.25,VFX_HP_NormalHit,
Crit,#FF3B2F,0.12,0.45,VFX_HP_CritFlash,
ArmorPierce,#FFD28A,0.10,0.35,VFX_HP_ArmorCrack,ArmorBreak
Fire,#FF6A2A,0.07,0.30,VFX_HP_FireEdge,Burn
Ice,#8EEBFF,0.05,0.30,VFX_HP_IceEdge,Freeze
Thunder,#FFD84A,0.09,0.25,VFX_HP_ThunderFlash,Paralyze
Poison,#72D94C,0.03,0.15,VFX_HP_PoisonMist,Poison
Bleed,#B02020,0.04,0.20,VFX_HP_BleedDrop,Bleed
TrueDamage,#FFF2A6,0.08,0.25,VFX_HP_TrueCut,
ShieldAbsorb,#A7D8FF,0.05,0.15,VFX_HP_ShieldFlash,Shield
```

### 23.4 BuffDisplayConfig.csv

```csv
BuffID,Name,Type,Icon,Priority,FrameColor,ShowStack,ShowDuration,EndingFlash,HUDEffect
Burn,灼烧,Debuff,Icon_Burn,70,#FF6A2A,true,true,true,VFX_HP_FireEdge
Poison,中毒,Debuff,Icon_Poison,75,#72D94C,true,true,true,VFX_HP_PoisonMist
Bleed,流血,Debuff,Icon_Bleed,74,#B02020,true,true,true,VFX_HP_BleedDrop
Freeze,冰冻,Debuff,Icon_Freeze,95,#8EEBFF,false,true,true,VFX_HP_IceEdge
Slow,减速,Debuff,Icon_Slow,50,#7FB7FF,false,true,true,
Stun,眩晕,Debuff,Icon_Stun,100,#FFD84A,false,true,true,VFX_StunStars
ArmorBreak,破甲,Debuff,Icon_ArmorBreak,85,#FFD28A,true,true,true,VFX_HP_ArmorCrack
Shield,护盾,Buff,Icon_Shield,80,#A7D8FF,false,true,false,VFX_HP_ShieldFlash
Rage,狂暴,Buff,Icon_Rage,65,#FF3030,true,true,false,VFX_RageAura
SuperArmor,霸体,Buff,Icon_SuperArmor,90,#FFD700,false,true,false,VFX_SuperArmorGlow
Invincible,无敌,Buff,Icon_Invincible,99,#FFFFFF,false,true,false,VFX_InvincibleGlow
WeakMark,弱点标记,Debuff,Icon_WeakMark,88,#FFD700,false,true,true,VFX_WeakMark
```

---

## 24. 运行时逻辑流程

### 24.1 伤害跳字流程

```text
攻击命中
→ 伤害系统计算最终伤害
→ 判断元素、暴击、穿甲、弱点、护盾、免疫
→ 生成 DamageNumberData
→ DamageNumberManager 从对象池取跳字
→ 根据 DamageNumberStyle 组合图标、标签、数字
→ 播放对应动画
→ 回收到对象池
```

### 24.2 血条扣血流程

```text
单位受伤
→ UnitHUD 接收 OnDamageTaken
→ 更新 HP_Current
→ 根据伤害类型播放 HP_Flash
→ 延迟更新 HP_DelayDamage
→ 如果有护盾，先更新 HP_Shield
→ 如果有元素状态，显示血条边缘效果
→ 如果添加 Buff，刷新 BuffRow
```

### 24.3 Buff 显示流程

```text
Buff 添加
→ UnitBuffController 更新 Buff 列表
→ UnitHUD 按优先级排序
→ BuffRow 显示前 N 个
→ 每个 BuffIcon 更新时间环、层数
→ Buff 结束时淡出
```

---

## 25. 对象池规则

必须池化：

```text
DamageNumber
BuffIcon
StateText
HPBarFlashVFX
ElementSmallVFX
```

对象池数量建议：

```text
DamageNumberPool：80
BuffIconPool：100
StateTextPool：30
HPFlashVFXPool：40
```

全屏跳字超过上限时：

```text
低优先级 DoT / 普通伤害丢弃
暴击 / 穿甲 / 玩家受伤保留
```

---

## 26. Unity 脚本结构建议

```text
Scripts/UI/CombatFeedback/
├── DamageNumberManager.cs
├── DamageNumberUI.cs
├── DamageNumberData.cs
├── DamageNumberStyleConfig.cs
├── ElementIconConfig.cs
├── UnitHUDController.cs
├── UnitHPBarUI.cs
├── UnitBuffRowUI.cs
├── BuffIconUI.cs
├── UnitHUDReactionConfig.cs
├── CombatTextPool.cs
└── CombatFeedbackSettings.cs
```

### 26.1 事件接口

```text
OnDamageCalculated(DamageResult result)
OnDamageApplied(Unit target, DamageResult result)
OnHealApplied(Unit target, HealResult result)
OnShieldChanged(Unit target, ShieldChangeData data)
OnBuffAdded(Unit target, BuffInstance buff)
OnBuffRemoved(Unit target, BuffInstance buff)
OnBuffStackChanged(Unit target, BuffInstance buff)
OnUnitDead(Unit target)
```

---

## 27. DamageResult 数据结构

```text
DamageResult
├── Attacker
├── Target
├── FinalDamage
├── RawDamage
├── DamageType
├── ElementType
├── IsCritical
├── IsArmorPierce
├── IsWeakness
├── IsBackAttack
├── IsExecute
├── IsImmune
├── IsResisted
├── ShieldAbsorbedValue
├── HPDamageValue
├── HitPoint
├── HitDirection
├── AppliedBuffs
└── VisualPriority
```

---

## 28. HUD 可读性规则

### 28.1 不遮挡原则

```text
跳字不能遮挡玩家角色太久
Buff 图标不能挡住敌人动作
血条不能挡住攻击预警
Boss 头顶跳字不能挡住 Boss 关键动作
```

### 28.2 UI 缩放设置

提供设置：

```text
伤害数字大小：小 / 中 / 大
跳字数量：少 / 标准 / 多
元素图标：开 / 关
普通伤害跳字：开 / 关
DoT 跳字：开 / 关
Buff 图标：简洁 / 标准 / 完整
```

默认：

```text
伤害数字大小：中
跳字数量：标准
元素图标：开
DoT 跳字：开
Buff 图标：标准
```

---

## 29. 美术资源清单

### 29.1 跳字相关

```text
字体：伤害数字字体
字体：暴击字体样式
字体：穿甲字体样式
描边材质
红金暴击外光
银橙穿甲裂纹
金色弱点闪光
白金真实伤害闪光
```

### 29.2 元素图标

```text
Icon_Element_Fire
Icon_Element_Ice
Icon_Element_Thunder
Icon_Element_Poison
Icon_Element_Wind
Icon_Element_Earth
Icon_Element_Light
Icon_Element_Dark
```

### 29.3 Buff 图标

```text
Icon_Burn
Icon_Poison
Icon_Bleed
Icon_Freeze
Icon_Slow
Icon_Stun
Icon_ArmorBreak
Icon_Shield
Icon_Rage
Icon_SuperArmor
Icon_Invincible
Icon_WeakMark
Icon_Vulnerable
```

### 29.4 血条特效

```text
VFX_HP_NormalHit
VFX_HP_CritFlash
VFX_HP_ArmorCrack
VFX_HP_FireEdge
VFX_HP_IceEdge
VFX_HP_ThunderFlash
VFX_HP_PoisonMist
VFX_HP_BleedDrop
VFX_HP_ShieldFlash
VFX_HP_TrueCut
```

---

## 30. 音效资源清单

```text
SFX_Damage_Normal
SFX_Damage_Crit
SFX_Damage_ArmorPierce
SFX_Damage_Weakness
SFX_Damage_Execute
SFX_Damage_Fire
SFX_Damage_Ice
SFX_Damage_Thunder
SFX_Damage_Poison
SFX_Damage_ShieldAbsorb
SFX_Damage_ShieldBreak
SFX_Heal
SFX_Buff_Add
SFX_Debuff_Add
SFX_Debuff_End
```

---

## 31. MVP 开发范围

### 31.1 必做

```text
普通伤害跳字
暴击跳字
穿甲跳字
元素图标 + 元素伤害跳字
元素暴击跳字
治疗跳字
护盾吸收跳字
免疫 / 抵抗文字
单位头顶血条
即时血量层 + 延迟扣血层
不同伤害类型血条闪光
Buff / Debuff 图标行
Buff 层数与持续时间环
对象池
配置表驱动
```

### 31.2 可后做

```text
背击标签
斩杀大字
弱点特殊动画
Buff 鼠标悬停 Tooltip
Boss 顶部 Buff 扩展行
高级伤害数字合并
无障碍颜色模式
```

---

## 32. 验收标准

### 32.1 跳字验收

```text
普通伤害、暴击、穿甲能明显区分
元素伤害前必须有元素图标
元素伤害可以同时暴击
元素暴击的图标和暴击表现都必须存在
穿甲伤害有独立颜色和动画
DoT 不刷屏
治疗和护盾吸收清楚
免疫 / 抵抗不误认为伤害
```

### 32.2 血条验收

```text
扣血即时层和延迟层正确
暴击扣血更明显
穿甲扣血有裂纹或破甲感
元素伤害有元素色闪光
护盾先扣护盾层
低血表现清楚
Boss 血条不被普通跳字遮挡
```

### 32.3 Buff HUD 验收

```text
Buff / Debuff 图标显示在单位头顶 HUD 上
正面和负面状态颜色区分清楚
持续时间环正确减少
层数显示正确
图标超过上限会按优先级显示
高优先级控制类状态不会被普通 Buff 挤掉
```

### 32.4 性能验收

```text
全屏 30 个敌人受伤时不卡顿
跳字使用对象池
BuffIcon 使用对象池
同类型 DoT 可以合并
超过上限会丢弃低优先级跳字
```

---

## 33. 推荐开发顺序

```text
第 1 步：实现 DamageResult 数据结构
第 2 步：实现 DamageNumberManager 对象池
第 3 步：实现普通 / 暴击 / 穿甲跳字
第 4 步：加入元素图标和元素暴击组合
第 5 步：实现 UnitHUD 血条分层
第 6 步：实现不同伤害类型的血条闪光
第 7 步：实现护盾层
第 8 步：实现 BuffIcon 和 BuffRow
第 9 步：接入 Buff 持续时间和层数
第 10 步：接入配置表
第 11 步：加入对象池上限和跳字合并
第 12 步：统一美术和音效表现
```

---

## 34. 总结

这套反馈系统的核心是：

```text
伤害数字告诉玩家“打出了什么伤害”
元素图标告诉玩家“是什么属性”
暴击 / 穿甲 / 弱点告诉玩家“为什么这次伤害更高”
血条动画告诉玩家“单位实际损失了多少生命”
Buff HUD 告诉玩家“单位现在处于什么状态”
```

最终效果应该是：

```text
玩家不用打开战斗日志，只看跳字、血条和 Buff 图标，就能理解整场战斗发生了什么。
```
