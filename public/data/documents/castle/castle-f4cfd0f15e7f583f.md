# Unity《亲密城堡》UI / 角色 / 背景布局规则文档  
## 对标《杀戮尖塔》版式的成人向卡牌爬塔 UI 规范

> 目标：在 Unity 中制作一套 **布局结构、信息层级、交互节奏高度对标《杀戮尖塔》** 的卡牌爬塔 UI。  
> 注意：本规范只对标版式、交互和信息结构，不复制原版图片、字体、图标、按钮、音效、角色或背景素材。所有美术资源需要重新绘制。  
> 成人向表达统一使用“亲密张力、忍耐、共鸣、吸引、冷静、契约、节奏”等抽象系统词，不在 UI 中堆露骨文字。  
> 肤色、性取向、性别认同只作为外观和身份表达，不绑定强弱属性。敌人能力由职业、性格、体型风格、战斗流派决定。

---

# 1. 总体 UI 原则

## 1.1 对标方向

《杀戮尖塔》的界面核心不是复杂 HUD，而是：

1. **顶部轻 HUD**：资源、楼层、遗物、药水、设置入口。
2. **中部大舞台**：角色和敌人站位清晰，攻击意图直接显示在敌人头顶。
3. **底部卡牌手牌区**：玩家主要视线集中在下方卡牌。
4. **所有重要信息尽量图标化**：攻击、防御、增益、减益、金币、钥匙、药水、遗物、房间类型都用图标表达。
5. **详情靠悬停 / 长按 / 点击弹窗**：主界面不堆说明文字。
6. **每个界面都是一张大背景 + 少量可点击图标 + 卡牌 / 物品列表**。

本项目也采用同样结构：

| 原版功能 | 本项目功能命名 | UI 表达 |
|---|---|---|
| HP | 忍耐值 / 张力条 | 角色脚下红/粉色进度条 |
| 敌人 HP | 共鸣值 / 对手状态条 | 敌人脚下进度条 |
| Energy | 行动力 / 节奏点 | 左下角大圆形能量球 |
| Relic | 增幅物 / 收藏物 | 顶部小图标横排 |
| Potion | 临时道具 / 香氛瓶 / 节奏药剂 | 顶部小瓶子槽位 |
| Enemy Intent | 对手意图 | 敌人头顶图标 + 数字 |
| Block | 防护 / 冷静 | 角色条上方盾牌数值 |
| Strength / Dex | 强化 / 灵活 / 魅力等 Buff | 小圆图标 + 层数 |
| Map Node | 房间节点 | 羊皮纸地图上的图标节点 |
| Campfire | 休息 / 调整 | 两个大图标选项 |
| Shop | 商店 / 私密收藏室 | 店主 + 商品格子 |

---

# 2. Unity 分辨率与 Canvas 基准

## 2.1 基准分辨率

所有 UI 按 16:9 横屏设计。

```text
Reference Resolution：1920 × 1080
Canvas Scaler：Scale With Screen Size
Match：0.5
Safe Area：左右各预留 48px，上下各预留 24px
```

## 2.2 坐标规则

文档中所有归一化区域使用：

```text
x = 0 左边，x = 1 右边
y = 0 底部，y = 1 顶部
```

推荐所有 UI 使用 `RectTransform Anchor` 定位，避免写死像素。

---

# 3. 全局 Prefab 层级

## 3.1 UI 根节点

```text
Canvas_Root
├── Layer_00_Background          // 背景图、暗角、地图底图
├── Layer_10_WorldActors         // 角色、敌人、场景前景装饰
├── Layer_20_WorldUI             // 角色脚下条、Buff、敌人意图
├── Layer_30_HUD                 // 顶部资源、遗物、药水、行动按钮
├── Layer_40_Cards               // 手牌、抽牌堆、弃牌堆、卡牌拖拽
├── Layer_50_Tooltip             // 卡牌详情、Buff 详情、关键词说明
├── Layer_60_Modal               // 奖励、背包、地图、商店、事件弹窗
├── Layer_70_Transition          // 黑幕、场景转场、加载遮罩
└── EventSystem
```

## 3.2 Sorting Order 建议

| 层级 | Sorting Order |
|---|---:|
| Background | 0 |
| WorldActors | 50 |
| WorldUI | 100 |
| HUD | 200 |
| Cards | 300 |
| DraggingCard | 400 |
| Tooltip | 500 |
| Modal | 600 |
| Transition | 900 |

---

# 4. 战斗界面布局

## 4.1 战斗界面总体结构

```text
┌──────────────────────────────────────────────────────────────┐
│ 顶部资源 / 楼层 / 增幅图标 / 道具槽 / 设置                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   玩家角色                         敌人1   敌人2   敌人3       │
│   忍耐条 / Buff                    意图    意图    意图        │
│                                                              │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ 左下节奏点   抽牌堆       手牌扇形区                 结束回合 │
│              弃牌堆 / 消耗堆 / 牌数提示                       │
└──────────────────────────────────────────────────────────────┘
```

## 4.2 战斗界面归一化布局表

| 模块 | Prefab | Anchor 区域 | 说明 |
|---|---|---|---|
| 背景图 | `BG_BattleRoom.prefab` | x 0-1 / y 0.18-1 | 大背景，底部需压暗，避免影响卡牌阅读 |
| 地面平台 | `BG_FloorLine.prefab` | x 0-1 / y 0.20-0.42 | 角色脚底统一落在平台线上 |
| 玩家槽位 | `ActorSlot_Player.prefab` | x 0.08-0.35 / y 0.30-0.78 | 玩家永远在左侧 |
| 敌人槽位组 | `ActorSlot_EnemyGroup.prefab` | x 0.55-0.96 / y 0.30-0.78 | 敌人从右往左排 |
| 顶部 HUD | `HUD_TopBar.prefab` | x 0-1 / y 0.925-1 | 资源、楼层、菜单 |
| 增幅栏 | `HUD_RelicBar.prefab` | x 0.04-0.45 / y 0.86-0.925 | 小图标横排，可横向滚动 |
| 道具槽 | `HUD_ItemBelt.prefab` | x 0.04-0.24 / y 0.80-0.86 | 小瓶子槽位，最多 3-5 个 |
| 手牌区 | `CardHandPanel.prefab` | x 0.14-0.86 / y 0-0.285 | 扇形卡牌布局 |
| 节奏点 | `HUD_EnergyOrb.prefab` | x 0.02-0.13 / y 0.03-0.20 | 左下大圆球 |
| 抽牌堆 | `HUD_DrawPile.prefab` | x 0.03-0.105 / y 0.21-0.34 | 卡背图标 + 数字 |
| 弃牌堆 | `HUD_DiscardPile.prefab` | x 0.88-0.96 / y 0.03-0.16 | 卡背堆 + 数字 |
| 消耗堆 | `HUD_ExhaustPile.prefab` | x 0.80-0.87 / y 0.03-0.16 | 没有消耗牌时隐藏 |
| 结束回合 | `Button_EndTurn.prefab` | x 0.865-0.985 / y 0.30-0.43 | 右侧中下位置 |
| 提示层 | `TooltipRoot.prefab` | 全屏 | 卡牌、Buff、增幅详情 |
| 战斗信息飘字 | `FloatingTextRoot.prefab` | 全屏 | 伤害、恢复、状态变化 |

---

# 5. 角色与敌人站位规则

## 5.1 玩家位置

| 参数 | 数值 |
|---|---|
| 世界坐标参考点 | 屏幕 x = 0.22，y = 0.43 |
| 脚底基准线 | y = 0.36 |
| 角色朝向 | 面向右侧 |
| 角色高度 | 1080p 下 280-380px |
| 角色中心 | 稍偏左，不能遮挡左下节奏点 |
| 受击飘字 | 从角色头顶偏上 80px 弹出 |
| 忍耐条 | 脚下，宽 180-240px，高 16-24px |
| Buff 行 | 忍耐条上方 18-32px，小图标横排 |

```text
PlayerActorRoot
├── Sprite_Body
├── Sprite_Shadow
├── VFX_Attack
├── VFX_Hit
├── UI_ActorBar_Stamina
├── UI_ActorBuffRow
└── UI_FloatingTextAnchor
```

## 5.2 敌人位置

### 单敌人

| 敌人类型 | x | y | 高度 |
|---|---:|---:|---:|
| 普通单体 | 0.72 | 0.43 | 280-380px |
| 精英单体 | 0.74 | 0.43 | 360-460px |
| Boss | 0.73 | 0.45 | 460-620px |

### 多敌人

| 敌人数量 | 站位 |
|---|---|
| 1 个 | x 0.72 |
| 2 个 | x 0.66 / 0.82 |
| 3 个 | x 0.60 / 0.74 / 0.88 |
| 4 个 | x 0.56 / 0.68 / 0.80 / 0.92 |

```text
EnemyActorRoot
├── Sprite_Body
├── Sprite_Shadow
├── UI_IntentIcon       // 头顶意图
├── UI_ActorBar_Resonance
├── UI_ActorBuffRow
├── UI_TargetHighlight
└── UI_FloatingTextAnchor
```

## 5.3 对手身材与能力的 UI 表达

允许根据体型做战斗机制差异，但不能把肤色、性取向、性别身份做成强弱模板。

| 体型 / 风格 | 推荐能力 | UI 视觉 |
|---|---|---|
| 轻盈型 | 高闪避、多连击、低基础共鸣上限 | 细长剪影、移动残影 |
| 强壮型 | 高防护、高反击、节奏慢 | 宽大剪影、重击预警 |
| 优雅型 | 增益、抽牌干扰、节奏变化 | 柔和光环、节拍图标 |
| 活泼型 | 多段行动、随机意图 | 跳跃动画、多图标闪烁 |
| 冷静型 | 高防护、清除负面状态 | 盾牌、蓝色冷静图标 |
| 危险型 | 高爆发、施加负面状态 | 红色警告三角 |

---

# 6. 张力条 / 共鸣条 / Buff 图标布局

## 6.1 玩家条

玩家条对标原版角色脚下 HP 条。

```text
UI_ActorBar_Player
├── Bar_Background
├── Bar_Fill_Stamina       // 忍耐值填充
├── Icon_State             // 小状态图标，可选
├── Text_Value             // 只显示数字：36/100
└── ShieldValue            // 有防护时显示盾牌 + 数字
```

| 元素 | 位置 |
|---|---|
| 忍耐条 | 角色脚下，水平居中 |
| 数字 | 条内居中 |
| 防护值 | 条上方，盾牌图标 + 数字 |
| Buff | 条上方一行，最多 8 个，超出折叠成 `+N` |

## 6.2 敌人共鸣条

敌人条对标原版怪物 HP 条。

```text
UI_ActorBar_Enemy
├── Bar_Background
├── Bar_Fill_Resonance
├── Text_Value
├── ShieldValue
└── StatusMarker
```

| 状态 | 表达 |
|---|---|
| 未破防 | 条外有暗色边 |
| 即将达成 | 条发光，轻微脉冲 |
| 已达成 | 条满后播放爆发特效，敌人进入胜利判定 |
| 免疫 / 无效 | 条上出现锁图标 |

## 6.3 Buff 图标

```text
BuffIcon.prefab
├── Icon_Image
├── Stack_Text
├── Duration_Dot
├── Highlight_Frame
└── TooltipTrigger
```

| 参数 | 推荐值 |
|---|---|
| 图标尺寸 | 36×36 |
| 图标间距 | 4px |
| 层数数字 | 右下角，16px |
| 持续时间点 | 左上角小圆点 |
| 悬停放大 | 1.15 倍 |
| 点击 / 长按 | 打开 Buff 详情 |

---

# 7. 对手意图布局

## 7.1 位置

意图图标永远在敌人头顶，跟随敌人移动。

```text
EnemyIntentRoot
├── Icon_IntentType
├── Text_Number
├── Icon_MultiHit
├── Icon_Warning
└── TooltipTrigger
```

| 类型 | 图标 |
|---|---|
| 攻击 | 红色尖刺 / 爪痕 |
| 防御 | 盾牌 |
| 增益 | 上箭头 |
| 减益 | 下箭头 |
| 特殊 | 问号 / 星形 |
| 逃跑 / 蓄力 | 沙漏 |
| 多段 | 小叉号 × 数字 |

## 7.2 数字规则

| 情况 | 显示 |
|---|---|
| 单段行动 | 图标下方显示数字 |
| 多段行动 | `数字 × 次数` |
| 未知意图 | 只显示问号 |
| 危险行动 | 图标外圈红色脉冲 |
| Boss 大招 | 图标放大 1.25 倍并加警告边框 |

---

# 8. 手牌布局

## 8.1 手牌区结构

```text
CardHandPanel
├── HandArcAnchor
├── CardSlot_00
├── CardSlot_01
├── ...
├── DraggingCardLayer
└── CardPreviewLayer
```

## 8.2 卡牌尺寸

| 状态 | 尺寸 |
|---|---|
| 普通手牌 | 210×300 |
| 悬停手牌 | 260×372 |
| 拖拽手牌 | 280×400 |
| 详情大卡 | 360×514 |
| 奖励选择卡 | 260×372 |
| 背包卡牌 | 190×272 |

## 8.3 扇形公式

手牌以底部中心为圆弧中心，向两侧展开。

```csharp
float t = (index - (count - 1) * 0.5f) / Mathf.Max(1, (count - 1) * 0.5f);
x = centerX + t * handWidth * 0.42f;
y = baseY + Mathf.Abs(t) * 28f;
rotationZ = -t * 7.5f;
```

| 手牌数量 | 卡牌间距 |
|---|---|
| 1-5 张 | 170-190px |
| 6-8 张 | 145-165px |
| 9-10 张 | 120-140px |
| 11+ 张 | 100-115px，允许重叠 |

## 8.4 悬停 / 选中规则

| 行为 | 表现 |
|---|---|
| 鼠标悬停 | 卡牌上移 110px，缩放 1.25，置顶 |
| 点击卡牌 | 进入选中状态，屏幕变暗 10% |
| 拖拽卡牌 | 卡牌跟随鼠标，显示目标箭头 |
| 拖到敌人 | 敌人出现红色目标框 |
| 拖到自身 | 玩家出现蓝色目标框 |
| 无目标卡 | 拖到屏幕中部即可释放 |
| 能量不足 | 卡牌变灰，费用图标抖动 |
| 不能使用 | 卡牌边框变暗，悬停显示原因图标 |

## 8.5 卡牌结构

```text
CardView.prefab
├── Card_Frame              // 稀有度边框
├── Card_CostOrb            // 左上费用
├── Card_Art                // 中上插画
├── Card_NameIcon           // 名称旁类型图标
├── Card_TypeBanner         // 攻击 / 技巧 / 能力 / 状态
├── Card_DescriptionPanel   // 图标化描述
├── Card_KeywordIcons       // 关键词图标
├── Card_UpgradeMarker      // 已增幅标记
└── Card_Glow               // 可用 / 选中 / 新牌光效
```

## 8.6 卡牌尽量图标化

卡牌描述避免大段文字，优先用图标组合：

| 效果 | 图标组合 |
|---|---|
| 造成 6 点共鸣 | 共鸣图标 + `6` |
| 获得 5 点冷静 | 盾牌图标 + `5` |
| 抽 2 张牌 | 卡牌图标 + `+2` |
| 获得 1 节奏点 | 能量球图标 + `+1` |
| 下回合额外行动 | 沙漏 + 能量球 |
| 施加虚弱 | 下箭头 + 断裂图标 |
| 多段 | 连击图标 + `×3` |
| 消耗 | 火焰图标 |
| 保留 | 锁链图标 |
| 天赋 / 固有 | 星标图标 |

---

# 9. 卡牌详细信息布局

## 9.1 PC 悬停详情

卡牌悬停时显示大卡，关键词说明放在大卡右侧。

```text
CardDetailTooltip
├── BigCardView
└── KeywordPanel
    ├── KeywordRow_01
    ├── KeywordRow_02
    └── KeywordRow_03
```

| 元素 | 位置 |
|---|---|
| 大卡 | 鼠标所在卡牌上方，避免超出屏幕 |
| 关键词面板 | 大卡右侧；右侧空间不足时切换到左侧 |
| 面板宽度 | 300-360px |
| 关键词行高 | 54-68px |
| 说明文字 | 最多 2 行，超过省略 |
| 稀有度 | 通过边框颜色，不额外写字 |

## 9.2 移动端 / 手柄详情

| 操作 | 表现 |
|---|---|
| 长按卡牌 | 放大到屏幕中央 |
| 松开 | 关闭详情 |
| 点击关键词图标 | 展开关键词说明 |
| 左右切换 | 查看相邻卡牌 |
| B / 返回 | 关闭详情 |

---

# 10. 增幅 / 遗物栏布局

这里对标原版顶部遗物栏。

## 10.1 顶部增幅栏

```text
HUD_RelicBar
├── RelicIcon_00
├── RelicIcon_01
├── RelicIcon_02
├── ...
└── RelicOverflowButton
```

| 参数 | 数值 |
|---|---|
| 图标尺寸 | 42×42 |
| 间距 | 6px |
| 默认显示 | 12-16 个 |
| 超出 | 横向滚动或折叠成 `+N` |
| 悬停 | 图标放大 1.18 倍，显示 Tooltip |
| 触发时 | 图标闪光、跳动一次 |
| 被禁用 | 灰化 + 斜杠 |

## 10.2 增幅 Tooltip

```text
RelicTooltip.prefab
├── Icon_Large
├── TitleRow
├── DescriptionRows
├── TriggerConditionRow
└── RarityFrame
```

| 信息 | 说明 |
|---|---|
| 大图标 | 64×64 |
| 名称 | 允许文字 |
| 效果描述 | 尽量使用图标 + 数值 |
| 触发条件 | 使用小沙漏 / 开局 / 受击 / 回合结束图标 |
| 稀有度 | 边框表达 |

## 10.3 增幅获取界面

对标原版奖励界面中的遗物获取。

```text
Reward_RelicPanel
├── TitleIcon
├── RelicCard
│   ├── RelicIcon_Large
│   ├── RelicName
│   └── RelicDesc
└── Button_Confirm
```

| 布局 | 说明 |
|---|---|
| 中央单个大图标 | 玩家一眼知道获得了什么 |
| 背景半透明暗化 | 让奖励突出 |
| 确认按钮 | 底部居中 |
| 稀有增幅 | 图标周围有粒子和边框 |

---

# 11. 背包 / 牌组 / 收藏界面布局

背包不是传统 RPG 背包，而是对标原版“查看牌组、遗物、药水、统计”的全屏遮罩。

## 11.1 背包入口

| 入口 | 位置 |
|---|---|
| 牌组按钮 | 左下抽牌堆 / 顶部牌组图标 |
| 增幅按钮 | 顶部增幅栏任意空白区域 |
| 道具按钮 | 顶部道具槽 |
| 总览按钮 | 右上菜单内 |

## 11.2 背包总览结构

```text
Screen_RunInventory.prefab
├── Overlay_Dim
├── Panel_Parchment
│   ├── TopTitleBar
│   ├── LeftTabBar
│   │   ├── Tab_Deck
│   │   ├── Tab_Relics
│   │   ├── Tab_Items
│   │   └── Tab_Stats
│   ├── FilterBar
│   ├── ContentScroll
│   └── RightPreviewPanel
└── Button_Close
```

## 11.3 背包布局

| 区域 | Anchor | 内容 |
|---|---|---|
| 背景暗化 | 全屏 | 70% 黑色透明 |
| 主面板 | x 0.08-0.92 / y 0.08-0.92 | 羊皮纸 / 皮革面板 |
| 左侧 Tab | x 0.08-0.15 / y 0.12-0.86 | 图标按钮，不写字 |
| 顶部筛选 | x 0.16-0.72 / y 0.80-0.88 | 攻击、技巧、能力、状态、稀有度图标 |
| 内容网格 | x 0.16-0.72 / y 0.14-0.78 | 卡牌 / 增幅 / 道具 |
| 右侧预览 | x 0.74-0.90 / y 0.14-0.86 | 大卡 / 大图标详情 |
| 关闭按钮 | 右上角 | X 图标 |

## 11.4 牌组网格

| 参数 | 数值 |
|---|---|
| 每行数量 | 5 张 |
| 卡牌尺寸 | 190×272 |
| 行距 | 26px |
| 列距 | 18px |
| 滚动方向 | 垂直 |
| 筛选 | 类型、费用、稀有度、是否已增幅 |
| 排序 | 费用、获得顺序、类型、稀有度 |

## 11.5 增幅背包

| 参数 | 数值 |
|---|---|
| 每行数量 | 8-10 个 |
| 图标尺寸 | 72×72 |
| 悬停 | 右侧预览 |
| 触发过 | 图标右上角有亮点 |
| 本场禁用 | 灰化 |

---

# 12. 关卡地图 / 房间布局

对标原版爬塔地图：竖向路线、节点分叉、顶端 Boss。

## 12.1 地图总体布局

```text
Screen_Map.prefab
├── BG_MapParchment
├── MapPathRoot
│   ├── Node_Start
│   ├── Node_Combat
│   ├── Node_Elite
│   ├── Node_Event
│   ├── Node_Shop
│   ├── Node_Rest
│   ├── Node_Treasure
│   └── Node_Boss
├── PathLineRoot
├── RightLegendPanel
├── BottomModifierBar
├── TopRunInfo
└── Button_Return
```

## 12.2 地图区域

| 区域 | Anchor | 说明 |
|---|---|---|
| 地图主画布 | x 0.12-0.78 / y 0.08-0.94 | 路线节点区 |
| 图例面板 | x 0.78-0.96 / y 0.20-0.82 | 房间类型图标说明 |
| 当前层信息 | x 0.38-0.62 / y 0.93-0.99 | 城堡层数 |
| 底部修饰词 | x 0.18-0.74 / y 0.02-0.08 | 当前难度 / 特殊规则图标 |
| 返回按钮 | x 0.02-0.10 / y 0.90-0.98 | 返回战斗 / 关闭地图 |

## 12.3 节点图标

| 房间 | 图标 | 颜色方向 |
|---|---|---|
| 普通战斗 | 面具 / 小剑 | 暗红 |
| 精英战斗 | 角冠 / 双剑 | 紫红 |
| Boss | 皇冠 / 大门 | 金红 |
| 事件 | 问号 | 蓝紫 |
| 商店 | 钱袋 / 展柜 | 金色 |
| 休息 | 沙发 / 火焰 / 月亮 | 橙色 |
| 宝箱 | 宝箱 | 金色 |
| 起点 | 脚印 | 白色 |
| 未知 | 问号圆形 | 灰蓝 |

## 12.4 节点状态

| 状态 | 表现 |
|---|---|
| 可选 | 节点发光，线条高亮 |
| 不可选 | 灰化 |
| 已走过 | 图标变暗，出现勾 |
| 当前节点 | 外圈旋转光环 |
| Boss 节点 | 最大，固定在顶端 |
| 特殊节点 | 外圈加小标记 |

## 12.5 路线生成视觉规则

```text
每层横向 3-7 个节点
每张地图 12-16 层
每个节点最多连接上方 1-3 个节点
路线用虚线或手绘线连接
路线不能交叉过多
Boss 前 1 层必须有休息点
```

---

# 13. 房间界面布局

## 13.1 普通战斗房

沿用战斗界面。

## 13.2 事件房

对标原版事件：背景插画 + 文本面板 + 选项按钮。

```text
Screen_EventRoom
├── BG_EventIllustration
├── EventCharacterOrObject
├── Panel_EventText
├── ChoiceButtonGroup
│   ├── Choice_01
│   ├── Choice_02
│   └── Choice_03
└── Button_Leave
```

| 区域 | Anchor | 说明 |
|---|---|---|
| 插画区 | x 0-1 / y 0.32-1 | 大背景，低文字 |
| 文本区 | x 0.16-0.84 / y 0.16-0.34 | 事件描述 |
| 选项区 | x 0.20-0.80 / y 0.04-0.16 | 竖排或横排按钮 |
| 退出 | 右下 | 不可选时隐藏 |

成人向事件建议通过图标和抽象文案表达，例如“邀请、拒绝、观察、交易、休息、离开”，避免在按钮上写露骨内容。

## 13.3 商店房

对标原版商店：商人/房间角色在左，商品在右侧网格。

```text
Screen_ShopRoom
├── BG_Shop
├── ShopKeeper
├── Panel_Goods
│   ├── CardGoodsRow
│   ├── RelicGoodsRow
│   ├── ItemGoodsRow
│   └── RemoveCardService
├── GoldDisplay
└── Button_Leave
```

| 商品 | 位置 |
|---|---|
| 卡牌 | 中上部横排 5-7 张 |
| 增幅 | 中部图标 3-5 个 |
| 道具 | 右侧小槽 3 个 |
| 服务 | 底部单独按钮 |
| 金币 | 左上或右上 |
| 离开 | 右下 |

## 13.4 休息房

对标原版篝火：中央背景，底部两个大选项。

```text
Screen_RestRoom
├── BG_Rest
├── RestObject
├── OptionButton_Rest
├── OptionButton_Upgrade
├── OptionButton_Special
└── Button_Leave
```

| 选项 | 图标 |
|---|---|
| 休息 | 月亮 / 床 / 温泉 |
| 增幅卡牌 | 锤子 / 星光 |
| 特殊行为 | 钥匙 / 事件图标 |
| 离开 | 门 |

## 13.5 宝箱房

```text
Screen_TreasureRoom
├── BG_Treasure
├── ChestObject
├── Button_OpenChest
├── RewardPopup
└── Button_Continue
```

| 状态 | 表现 |
|---|---|
| 未开启 | 宝箱中央，轻微呼吸 |
| 可点击 | 鼠标悬停发光 |
| 已开启 | 弹出增幅 / 道具奖励 |
| 继续 | 奖励拿完后出现 |

---

# 14. 奖励界面布局

## 14.1 战斗胜利奖励

对标原版：战斗结束后中央出现奖励列表。

```text
Screen_BattleReward
├── Overlay_Dim
├── RewardPanel
│   ├── Title_Reward
│   ├── RewardRow_Gold
│   ├── RewardRow_Card
│   ├── RewardRow_Relic
│   ├── RewardRow_Item
│   └── Button_Skip
└── Button_Proceed
```

| 奖励类型 | 表达 |
|---|---|
| 金币 | 钱袋图标 + 数字 |
| 选卡 | 三张卡牌横排 |
| 增幅 | 单个大图标 |
| 道具 | 小瓶子图标 |
| 跳过 | 小按钮，放右下 |
| 继续 | 所有奖励处理完出现 |

## 14.2 选卡界面

```text
Panel_ChooseCard
├── CardChoice_01
├── CardChoice_02
├── CardChoice_03
├── Button_Skip
└── CardTooltipRoot
```

| 参数 | 数值 |
|---|---|
| 卡牌数量 | 默认 3 张 |
| 卡牌尺寸 | 260×372 |
| 卡牌间距 | 60px |
| 卡牌位置 | 屏幕中央横排 |
| 悬停 | 放大 1.12 |
| 已选择 | 飞入牌组图标 |
| 跳过 | 右下角 |

---

# 15. 卡牌增幅界面布局

这里对标原版休息点升级卡牌界面。

```text
Screen_CardUpgrade
├── Overlay_Dim
├── Panel_DeckGrid
│   ├── FilterBar
│   ├── CardGrid
│   └── Scrollbar
├── Panel_UpgradePreview
│   ├── Card_Before
│   ├── Arrow
│   └── Card_After
├── Button_ConfirmUpgrade
└── Button_Back
```

## 15.1 布局

| 区域 | Anchor | 说明 |
|---|---|---|
| 卡牌列表 | x 0.08-0.58 / y 0.12-0.88 | 可升级卡牌网格 |
| 增幅预览 | x 0.60-0.90 / y 0.20-0.82 | 左旧卡，右新卡 |
| 筛选条 | x 0.08-0.58 / y 0.88-0.94 | 类型图标 |
| 确认按钮 | x 0.68-0.84 / y 0.10-0.18 | 选择后激活 |
| 返回按钮 | x 0.04-0.12 / y 0.90-0.98 | 返回 |

## 15.2 卡牌增幅表现

| 状态 | 表现 |
|---|---|
| 可增幅 | 卡牌边框有小星点 |
| 已增幅 | 卡牌右上角星标 |
| 不可增幅 | 灰化 |
| 选中 | 外圈发光 |
| 增幅变化 | 数值用绿色向上箭头、关键词新增用闪光图标 |

---

# 16. Buff 详细信息布局

## 16.1 Buff Tooltip

```text
BuffTooltip.prefab
├── Header
│   ├── Icon
│   └── Name
├── EffectRows
├── DurationRow
└── SourceRow
```

| 参数 | 数值 |
|---|---|
| 宽度 | 280-340px |
| 最小高度 | 120px |
| 最大高度 | 360px |
| 位置 | 图标上方或旁边 |
| 多 Tooltip | 垂直堆叠 |
| 自动避边 | 超出右边则向左弹 |

## 16.2 Buff 详情内容

| 信息 | 显示方式 |
|---|---|
| 名称 | 文字 |
| 效果 | 图标 + 数字 |
| 层数 | 大数字 |
| 持续回合 | 沙漏图标 + 数字 |
| 来源 | 小卡牌图标 / 增幅图标 |
| 是否可驱散 | 锁 / 开锁图标 |

---

# 17. 背景布局规则

## 17.1 战斗背景分层

```text
BattleBackground.prefab
├── Layer_BackSkyOrWall       // 最远层
├── Layer_BackProps           // 远景装饰
├── Layer_MidWall             // 中景墙面
├── Layer_Floor               // 地面
├── Layer_ForegroundProps     // 前景装饰，不能遮挡卡牌
├── Layer_Vignette            // 暗角
└── Layer_CardReadabilityMask // 底部读牌暗化
```

## 17.2 背景构图

| 区域 | 规则 |
|---|---|
| 顶部 | 可放窗、吊灯、城堡装饰 |
| 中部 | 角色与敌人背后不能有高对比噪点 |
| 下部 | 手牌区必须压暗，避免卡牌文字和图标看不清 |
| 左侧 | 给玩家角色留空 |
| 右侧 | 给敌人和意图图标留空 |
| 中央 | 可放透视线，引导视线到角色与敌人 |

## 17.3 城堡关卡背景主题

| Act | 背景主题 | 颜色 |
|---|---|---|
| Act 1 | 城堡大厅 / 走廊 / 客房 | 暖红、棕、金 |
| Act 2 | 镜厅 / 花园 / 收藏室 | 紫、粉、蓝 |
| Act 3 | 塔顶寝殿 / 星光大厅 | 深蓝、银、玫红 |
| Boss | 大门 / 王座 / 高台 | 强对比、金色轮廓 |

## 17.4 背景素材尺寸

| 资源 | 尺寸 |
|---|---|
| 战斗背景整图 | 2560×1440 |
| 地面层 | 2560×512 |
| 远景装饰 | 2560×1024 |
| 前景装饰 | 2560×512 |
| 暗角遮罩 | 1920×1080 |
| 地图背景 | 2048×2048 |
| 事件插画 | 1920×1080 |

---

# 18. 角色美术布局规则

## 18.1 角色图片规格

| 类型 | 尺寸 |
|---|---|
| 玩家待机图 | 512×768 |
| 普通敌人 | 512×768 |
| 精英敌人 | 768×1024 |
| Boss | 1024×1024 或 1024×1536 |
| 阴影 | 单独 PNG |
| 特效 | 单独序列帧 |

## 18.2 Pivot 规则

所有角色图片 Pivot 使用脚底中心。

```text
Pivot X = 0.5
Pivot Y = 0.05
```

## 18.3 角色边界

| 项目 | 规则 |
|---|---|
| 角色不能超过屏幕顶部 80% |
| 玩家不能遮挡节奏点 |
| 敌人不能遮挡结束回合按钮 |
| Boss 可进入中线，但不能压住玩家 |
| 角色脚底必须落在地面线 |
| 意图图标需要留出头顶 80-120px 空间 |

## 18.4 动画对 UI 的影响

| 动画 | 位移限制 |
|---|---|
| 待机 | 上下浮动不超过 8px |
| 受击 | 水平抖动不超过 24px |
| 攻击前冲 | 不超过角色到中线距离的 45% |
| 击退 | 不超过 36px |
| Boss 大招 | 可短暂放大 1.08 倍 |
| 死亡 / 退场 | 不影响其他 UI 位置 |

---

# 19. 图标优先规则

## 19.1 必做图标库

```text
IconLibrary
├── Resource
│   ├── Coin
│   ├── Energy
│   ├── Key
│   └── Map
├── CardEffect
│   ├── ResonanceDamage
│   ├── CalmBlock
│   ├── DrawCard
│   ├── Discard
│   ├── Exhaust
│   ├── Retain
│   ├── Innate
│   ├── CostUp
│   └── CostDown
├── Intent
│   ├── Attack
│   ├── Defend
│   ├── Buff
│   ├── Debuff
│   ├── Special
│   └── Unknown
├── Room
│   ├── Combat
│   ├── Elite
│   ├── Boss
│   ├── Event
│   ├── Shop
│   ├── Rest
│   └── Treasure
├── Status
│   ├── Strength
│   ├── Dexterity
│   ├── Weak
│   ├── Vulnerable
│   ├── Frail
│   ├── Poison
│   ├── Regen
│   └── Lock
└── UI
    ├── Back
    ├── Close
    ├── Confirm
    ├── Skip
    ├── Sort
    ├── Filter
    ├── Info
    └── Settings
```

## 19.2 图标尺寸

| 用途 | 尺寸 |
|---|---|
| 顶部资源 | 32×32 |
| 增幅小图标 | 42×42 |
| 道具槽 | 48×48 |
| Buff | 36×36 |
| 意图 | 72×72 |
| 地图节点 | 64×64 |
| 筛选按钮 | 44×44 |
| 卡牌内小图标 | 22×22 |
| 奖励图标 | 96×96 |

## 19.3 文字最小化规则

优先保留文字的位置：

1. 卡牌名称。
2. 卡牌关键词解释。
3. Tooltip 详细说明。
4. 楼层名称。
5. 事件描述。
6. 选项按钮文字。

尽量图标化的位置：

1. 房间类型。
2. 卡牌效果。
3. Buff / Debuff。
4. 道具。
5. 增幅。
6. 敌人意图。
7. 筛选与排序。
8. 结束回合按钮可用图标 + 极短文字。

---

# 20. 菜单 / 设置 / 牌组按钮布局

## 20.1 右上角菜单

```text
HUD_MenuGroup
├── Button_Map
├── Button_Deck
├── Button_Settings
└── Button_ExitRun
```

| 按钮 | 位置 |
|---|---|
| 地图 | 右上第 1 个 |
| 牌组 | 右上第 2 个 |
| 设置 | 右上第 3 个 |
| 退出 | 设置弹窗内 |

## 20.2 暂停菜单

```text
Screen_PauseMenu
├── Overlay_Dim
├── Panel_Menu
│   ├── Button_Resume
│   ├── Button_Settings
│   ├── Button_AbandonRun
│   └── Button_MainMenu
└── Button_Close
```

---

# 21. 主菜单与角色选择布局

## 21.1 主菜单

对标原版：背景大图 + 中央/右侧按钮列。

```text
Screen_MainMenu
├── BG_MainCastle
├── Logo_Game
├── ButtonGroup_Main
│   ├── Button_Continue
│   ├── Button_NewRun
│   ├── Button_Collection
│   ├── Button_Settings
│   └── Button_Quit
└── VersionText
```

| 区域 | Anchor |
|---|---|
| Logo | x 0.05-0.45 / y 0.72-0.92 |
| 按钮组 | x 0.08-0.36 / y 0.18-0.68 |
| 背景角色 | x 0.48-0.95 / y 0.10-0.90 |
| 版本号 | 右下 |

## 21.2 角色选择

虽然玩家只能使用一个男性角色，也建议保留角色选择结构，方便未来扩展。

```text
Screen_CharacterSelect
├── BG_SelectRoom
├── CharacterPortrait_Large
├── CharacterInfoPanel
├── StartingDeckPreview
├── StartingRelicPreview
├── DifficultySelector
├── Button_Start
└── Button_Back
```

---

# 22. UI Prefab 清单

## 22.1 战斗核心

| Prefab | 用途 |
|---|---|
| `UI_BattleRoot.prefab` | 战斗 UI 根 |
| `HUD_TopBar.prefab` | 顶部 HUD |
| `HUD_RelicBar.prefab` | 增幅栏 |
| `HUD_ItemBelt.prefab` | 道具槽 |
| `HUD_EnergyOrb.prefab` | 节奏点 |
| `HUD_DrawPile.prefab` | 抽牌堆 |
| `HUD_DiscardPile.prefab` | 弃牌堆 |
| `HUD_ExhaustPile.prefab` | 消耗堆 |
| `Button_EndTurn.prefab` | 结束回合 |
| `CardHandPanel.prefab` | 手牌区 |
| `CardView.prefab` | 单张卡牌 |
| `CardDetailTooltip.prefab` | 卡牌详情 |
| `BuffIcon.prefab` | Buff 小图标 |
| `BuffTooltip.prefab` | Buff 详情 |
| `EnemyIntentIcon.prefab` | 敌人意图 |
| `ActorBar.prefab` | 角色状态条 |
| `FloatingText.prefab` | 飘字 |

## 22.2 地图 / 房间

| Prefab | 用途 |
|---|---|
| `Screen_Map.prefab` | 关卡地图 |
| `MapNode.prefab` | 地图节点 |
| `MapPathLine.prefab` | 路线 |
| `MapLegendPanel.prefab` | 图例 |
| `Screen_EventRoom.prefab` | 事件房 |
| `Screen_ShopRoom.prefab` | 商店房 |
| `Screen_RestRoom.prefab` | 休息房 |
| `Screen_TreasureRoom.prefab` | 宝箱房 |

## 22.3 背包 / 奖励

| Prefab | 用途 |
|---|---|
| `Screen_RunInventory.prefab` | 背包总览 |
| `Panel_DeckGrid.prefab` | 牌组网格 |
| `Panel_RelicGrid.prefab` | 增幅网格 |
| `Panel_ItemGrid.prefab` | 道具网格 |
| `Screen_BattleReward.prefab` | 战斗奖励 |
| `Panel_ChooseCard.prefab` | 选卡 |
| `Panel_RelicReward.prefab` | 增幅奖励 |
| `Screen_CardUpgrade.prefab` | 卡牌增幅 |

---

# 23. UI 数据结构建议

## 23.1 UI 配置 ScriptableObject

```csharp
[CreateAssetMenu(menuName = "Game/UI/Layout Config")]
public class UILayoutConfig : ScriptableObject
{
    public Vector2 referenceResolution = new Vector2(1920, 1080);

    public Rect playerSlot = new Rect(0.08f, 0.30f, 0.27f, 0.48f);
    public Rect enemyGroupSlot = new Rect(0.55f, 0.30f, 0.41f, 0.48f);
    public Rect topBar = new Rect(0f, 0.925f, 1f, 0.075f);
    public Rect handPanel = new Rect(0.14f, 0f, 0.72f, 0.285f);
    public Rect energyOrb = new Rect(0.02f, 0.03f, 0.11f, 0.17f);
    public Rect endTurnButton = new Rect(0.865f, 0.30f, 0.12f, 0.13f);

    public float cardNormalScale = 1f;
    public float cardHoverScale = 1.25f;
    public float cardDragScale = 1.35f;
    public float handFanRotation = 7.5f;
    public float handFanLift = 28f;
}
```

## 23.2 卡牌 UI 数据

```csharp
public class CardViewData
{
    public string cardId;
    public string displayName;
    public Sprite art;
    public Sprite frame;
    public Sprite costOrb;
    public int cost;
    public CardType type;
    public CardRarity rarity;
    public List<IconValuePair> effectIcons;
    public List<string> keywordIds;
    public bool isUpgraded;
    public bool isPlayable;
}
```

## 23.3 Buff UI 数据

```csharp
public class BuffViewData
{
    public string buffId;
    public string displayName;
    public Sprite icon;
    public int stack;
    public int duration;
    public bool isDebuff;
    public bool isLocked;
    public string sourceId;
}
```

---

# 24. 输入交互规则

## 24.1 PC

| 操作 | 结果 |
|---|---|
| 鼠标悬停卡牌 | 卡牌放大 |
| 鼠标拖拽卡牌 | 显示目标箭头 |
| 右键卡牌 | 打开详情 |
| 悬停 Buff | 显示 Tooltip |
| 点击抽牌堆 | 打开抽牌堆列表 |
| 点击弃牌堆 | 打开弃牌堆列表 |
| 点击地图按钮 | 打开地图 |
| Esc | 暂停 / 返回上一级 |

## 24.2 移动端

| 操作 | 结果 |
|---|---|
| 点按卡牌 | 选中 |
| 拖动卡牌 | 释放 |
| 长按卡牌 | 详情 |
| 长按 Buff | 详情 |
| 双击卡牌 | 快速打出无目标卡 |
| 双指缩放地图 | 地图缩放 |
| 拖动地图 | 地图平移 |

## 24.3 手柄

| 操作 | 结果 |
|---|---|
| 左摇杆 | 选择卡牌 / 节点 |
| A | 确认 |
| B | 返回 |
| X | 查看详情 |
| Y | 打开牌组 |
| RB / LB | 切换目标 |
| RT | 结束回合 |

---

# 25. UI 动效规则

## 25.1 卡牌动效

| 动作 | 动效 |
|---|---|
| 抽牌 | 从抽牌堆飞到手牌位 |
| 弃牌 | 从手牌飞到弃牌堆 |
| 消耗 | 卡牌缩小并燃烧 |
| 增幅 | 卡牌发光，数值跳动 |
| 不可用 | 卡牌轻微抖动 |
| 打出 | 卡牌飞向目标或屏幕中心 |

## 25.2 Buff 动效

| 触发 | 动效 |
|---|---|
| 获得 Buff | 图标从角色头顶落入 Buff 行 |
| 层数增加 | 数字跳动 |
| 层数减少 | 图标闪暗 |
| 失效 | 图标破碎 / 淡出 |
| 触发效果 | 图标发光并向目标发射小光点 |

## 25.3 意图动效

| 状态 | 动效 |
|---|---|
| 普通意图 | 轻微上下浮动 |
| 危险意图 | 红色脉冲 |
| 蓄力意图 | 沙漏旋转 |
| 未知意图 | 问号闪烁 |
| 行动执行 | 图标收缩后消失 |

---

# 26. 美术风格规则

## 26.1 UI 风格

建议风格：

```text
成人向暗黑童话城堡 + 手绘卡牌边框 + 皮革 / 羊皮纸面板 + 图标化 HUD
```

避免：

```text
不要现代 APP 风
不要硬核科幻 HUD
不要大量纯黑背景
不要低俗文字堆叠
不要直接仿制原版按钮和图标
```

## 26.2 色彩

| 类型 | 主色 |
|---|---|
| 攻击 / 共鸣提升 | 玫红、红橙 |
| 防护 / 冷静 | 蓝、青 |
| 行动力 / 节奏 | 金、橙 |
| 稀有 | 蓝 |
| 罕见 | 紫 |
| 普通 | 灰白 |
| Boss / 危险 | 金红 |
| 事件 | 蓝紫 |
| 商店 | 金色 |

## 26.3 卡牌边框

| 类型 | 边框 |
|---|---|
| 动作卡 | 红粉边框 |
| 技巧卡 | 蓝紫边框 |
| 能力卡 | 金色边框 |
| 状态卡 | 灰暗边框 |
| 诅咒卡 | 黑紫边框 |

---

# 27. 与原版布局的一一对标表

| 原版界面 | 本项目界面 | 对标点 |
|---|---|---|
| 战斗界面 | 亲密战斗界面 | 顶部轻 HUD，中部角色，底部手牌 |
| 敌人意图 | 对手意图 | 敌人头顶图标 |
| HP 条 | 忍耐 / 共鸣条 | 角色脚下进度条 |
| Energy Orb | 节奏点球 | 左下圆形大 UI |
| Draw / Discard | 抽牌 / 弃牌 | 底部左右牌堆 |
| Relics | 增幅物 | 顶部横排小图标 |
| Potions | 道具槽 | 顶部小瓶子 |
| Map | 城堡路线图 | 羊皮纸分叉节点 |
| Reward | 战斗奖励 | 中央奖励面板 |
| Choose Card | 选卡 | 三卡横排 |
| Shop | 收藏室商店 | 商人 + 商品网格 |
| Rest Site | 调整房 | 两个大图标选项 |
| Deck View | 背包牌组 | 全屏卡牌网格 |
| Card Tooltip | 卡牌详情 | 大卡 + 关键词说明 |
| Buff Tooltip | 状态详情 | 小图标说明面板 |

---

# 28. 开发优先级

## 第一阶段：必须完成

1. 战斗界面底层布局。
2. 玩家 / 敌人槽位。
3. 手牌扇形布局。
4. 卡牌拖拽释放。
5. 敌人意图图标。
6. 忍耐 / 共鸣条。
7. Buff 图标与 Tooltip。
8. 顶部资源栏。
9. 增幅栏。
10. 地图节点界面。

## 第二阶段：完整体验

1. 奖励界面。
2. 选卡界面。
3. 背包牌组界面。
4. 商店房。
5. 休息房。
6. 事件房。
7. 卡牌增幅界面。
8. 抽牌堆 / 弃牌堆详情。
9. 触屏长按详情。
10. 手柄导航。

## 第三阶段：美术与表现

1. 每个 Act 的背景。
2. 角色动画。
3. 敌人站位与体型适配。
4. 卡牌框和稀有度框。
5. 图标库。
6. Buff / 意图特效。
7. 战斗飘字。
8. 胜利奖励动效。
9. 地图路线动效。
10. 暗角和读牌遮罩。

---

# 29. 验收标准

## 29.1 战斗界面验收

- 不看文字也能知道敌人下一回合要做什么。
- 手牌区永远是视觉中心。
- 玩家和敌人脚下条不被遮挡。
- 10 张手牌时仍能点击每张牌。
- 悬停卡牌不会超出屏幕。
- Buff 超过 8 个时有折叠。
- 遗物超过 16 个时能滚动或折叠。
- 敌人 4 个时意图图标不重叠。
- Boss 体型很大时不会遮挡结束回合按钮。
- 底部背景足够暗，卡牌文字和图标清楚。

## 29.2 地图界面验收

- 玩家能一眼看懂可选路线。
- 房间类型不依赖文字。
- 当前节点明显。
- 已走过路线明显。
- Boss 节点始终在顶端。
- 图例面板不遮挡路线。
- 地图可拖动 / 缩放。
- 选节点后有确认反馈。

## 29.3 背包界面验收

- 牌组、增幅、道具可以一键切换。
- 卡牌可以按类型、费用、稀有度筛选。
- 大卡预览清晰。
- 图标详情不遮挡主内容。
- 关闭按钮明显。
- 移动端长按可看详情。

---

# 30. Unity 场景建议

```text
Scenes
├── Boot.unity
├── MainMenu.unity
├── Run.unity
│   ├── BattleState
│   ├── MapState
│   ├── EventState
│   ├── ShopState
│   ├── RestState
│   ├── RewardState
│   └── InventoryState
└── Test_UI.unity
```

建议所有 UI 都做成 Prefab，在 `Run.unity` 中按状态切换显示，不要每个房间单独做一套场景 UI。

---

# 31. 推荐目录结构

```text
Assets/Game/UI
├── Prefabs
│   ├── Battle
│   ├── Cards
│   ├── Map
│   ├── Inventory
│   ├── Reward
│   ├── Shop
│   ├── Rest
│   └── Common
├── Sprites
│   ├── Icons
│   ├── Cards
│   ├── Frames
│   ├── Panels
│   └── Buttons
├── Materials
├── Animations
├── ScriptableObjects
│   ├── UILayout
│   ├── Icons
│   ├── Cards
│   ├── Buffs
│   └── Relics
└── Scripts
    ├── BattleUI
    ├── CardUI
    ├── Tooltip
    ├── MapUI
    ├── InventoryUI
    └── Common
```

---

# 32. 最终制作原则

1. **布局像原版，素材必须原创。**
2. **卡牌是主角，角色和背景不能抢阅读焦点。**
3. **图标优先，文字只做详情说明。**
4. **战斗信息全部贴近对象：角色条在脚下，Buff 在条上方，意图在敌人头顶。**
5. **所有 UI 模块独立 Prefab 化，方便换皮和调整。**
6. **成人主题走抽象系统表达，不在主界面堆露骨词。**
7. **角色差异来自战斗机制、体型风格、职业和性格，不来自肤色、性取向或身份标签。**
8. **所有界面按 1920×1080 做基准，再用 Anchor 适配其他比例。**
9. **每个房间界面都要保留“背景大图 + 中央交互 + 右下继续/离开”的结构。**
10. **任何新 UI 先写进 Prefab 表，再制作资源，避免后期难以维护。**
