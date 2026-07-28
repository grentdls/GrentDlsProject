# 《亲密城堡》Unity 成人向卡牌爬塔设计文档

> 类型：18+ 成人向、回合制卡牌构筑、Roguelike 爬塔、叙事事件、单机游戏  
> 参考结构：保留《杀戮尖塔》式地图节点、卡牌战斗、遗物、事件、商店、Boss、随机奖励、卡组成长逻辑  
> 设计边界：本文采用“亲密张力 / 共鸣峰值 / 成人关系幻想”的抽象表达，不写露骨动作细节；所有角色默认成年、自愿、可退出、无强迫；肤色、性取向、性别认同不绑定强弱属性。

---

## 目录

1. 项目定位
2. 世界观与主题包装
3. 核心循环
4. 核心战斗规则
5. 数值资源替换表
6. 角色系统
7. 对手系统
8. Build 方向总览
9. 卡牌系统
10. 遗物系统
11. 药水 / 临时道具系统
12. 地图节点系统
13. 事件系统
14. 关卡与 Boss 设计
15. 成人向合规与包容性规则
16. UI 总体设计
17. Unity UI Prefab 预制体结构
18. 战斗 Prefab 结构
19. 卡牌与数据 ScriptableObject 结构
20. 存档、配置与本地化
21. 美术规范
22. 音效与反馈规范
23. 开发里程碑
24. 附录：卡牌示例表
25. 附录：遗物示例表
26. 附录：对手示例表

---

# 1. 项目定位

## 1.1 一句话概念

玩家扮演唯一男性主角，进入一座由不同成年角色、欲望试炼、关系契约和心理迷宫构成的“亲密城堡”，通过卡牌构筑控制自身亲密张力，同时让对手的共鸣值达到峰值，从而通过每一层试炼。

## 1.2 核心卖点

- **尖塔式爬塔结构**：随机地图、三大区域、精英、事件、商店、Boss、遗物、卡组成长。
- **双进度条战斗**：主角从 0 积累“忍耐 / 张力”，对手从 0 积累“共鸣 / 高潮值”。
- **风险收益构筑**：越强的卡越容易让主角张力上升，必须在爆发与控制之间做选择。
- **成人向但可上架友好**：画面采用剪影、镜头外、抽象特效、角色表情和 UI 反馈，不做露骨描写。
- **包容性角色库**：对手可为女性、男性、非二元表达角色，但能力差异由派系、性格、战斗风格、体型标签、场景机制决定，不由肤色或性取向决定。

## 1.3 目标平台

- PC Steam / itch.io 优先。
- 后续可考虑 Android 侧载版本。
- 不建议首发 iOS / Google Play，因为成人内容审核风险较高。

## 1.4 推荐分级目标

- 明确 18+。
- 首屏年龄确认。
- 设置中提供成人内容强度、文本隐喻程度、角色服装暴露度、镜头晃动强度等选项。

---

# 2. 世界观与主题包装

## 2.1 城堡设定

“亲密城堡”是一座只向成年人开放的梦境城堡。城堡不以伤害或征服为核心，而以理解、节奏、边界、欲望投射、关系博弈为试炼。每一层都是一个主题空间，每个对手都是某种成人关系幻想、情绪风格或互动模式的化身。

## 2.2 三大区域

### 第一幕：红幕大厅

- 主题：初见、试探、节奏建立。
- 玩法：基础卡组教学，强调张力控制与共鸣积累。
- 敌人特点：阈值低、反制弱、状态简单。
- Boss：红幕主持人。

### 第二幕：镜面回廊

- 主题：心理投射、偏好、身份表达、反复试探。
- 玩法：敌人会改变偏好、锁定卡牌类型、反弹过度推进。
- 敌人特点：多阶段、强状态、强反制。
- Boss：镜面双生。

### 第三幕：月顶套房

- 主题：成熟关系、同步、边界、最终契约。
- 玩法：高数值、高风险、双条同步判定。
- 敌人特点：强意图、多条机制、特殊失败条件。
- Boss：城堡之心。

## 2.3 叙事基调

- 成人、暧昧、戏剧化、幽默。
- 不做侮辱、强迫、羞辱式表达。
- 角色关系用“契约、边界、默契、试炼、共鸣”包装。
- 所有文本强调对方具有主动性、选择权和明确同意。

---

# 3. 核心循环

```text
进入城堡
  ↓
选择路线节点
  ↓
战斗 / 事件 / 商店 / 休息 / 精英
  ↓
获得卡牌、金币、遗物、临时道具
  ↓
调整卡组与 Build
  ↓
击败区域 Boss
  ↓
进入下一幕
  ↓
最终 Boss
  ↓
结算：解锁卡牌、遗物、外观、剧情片段
```

## 3.1 单局目标

- 在主角“张力条”失控前，让对手“共鸣条”达到峰值。
- 连续通过三幕，击败最终 Boss。

## 3.2 局外成长

建议保持轻量，不破坏 Roguelike 公平性：

- 解锁新卡牌池。
- 解锁新遗物池。
- 解锁主角外观。
- 解锁对手图鉴。
- 解锁事件分支。
- 解锁难度阶梯。

---

# 4. 核心战斗规则

## 4.1 战斗资源

### 主角：亲密张力值

- 初始：0。
- 上限：默认 100。
- 卡牌、状态、敌人意图会增加或减少张力。
- 张力达到上限时触发“失控结算”。
- 默认可失控次数：1。
- 每次失控会对当前对手追加固定 10% 最大共鸣值的峰值冲击。
- 如果对手未达到共鸣峰值且主角没有剩余失控次数，则战斗失败。

### 对手：共鸣值

- 初始：0。
- 上限：不同对手不同，默认 100。
- 卡牌、状态、遗物、连击会增加共鸣。
- 共鸣达到上限则战斗胜利或进入下一阶段。

### 行动力

- 每回合默认 3 点。
- 卡牌消耗 0~3 点。
- 遗物、状态、事件可改变每回合行动力。

### 卡牌区

- 抽牌堆。
- 手牌。
- 弃牌堆。
- 消耗牌堆。
- 临时生成牌区。

## 4.2 回合流程

```text
战斗开始
  ↓
触发战斗开始遗物 / 状态
  ↓
玩家回合开始
  ↓
抽牌至手牌上限
  ↓
恢复行动力
  ↓
玩家出牌
  ↓
结算共鸣、张力、状态
  ↓
玩家结束回合
  ↓
对手行动
  ↓
检查胜负
  ↓
进入下一回合
```

## 4.3 失败条件

- 主角张力达到上限并耗尽所有失控次数，对手仍未达到共鸣峰值。
- 特殊事件中违反“边界值”规则。
- Boss 特殊回合倒计时失败。

## 4.4 胜利条件

- 单体对手：共鸣值达到上限。
- 多体对手：所有对手达到共鸣上限，或主目标达到上限。
- Boss：完成所有阶段的共鸣阈值。

## 4.5 关键公式

### 共鸣增加

```text
最终共鸣增加 = 卡牌基础值
             × (1 + 主角技巧加成 + Build 加成 + 状态加成)
             × 对手偏好倍率
             × 难度修正
```

### 张力增加

```text
最终张力增加 = 卡牌张力值
             × (1 - 忍耐减免)
             × 对手压力倍率
             + 状态附加值
```

### 失控冲击

```text
失控冲击 = 对手最大共鸣值 × 10%
```

### 增幅模块叠加

```text
输出倍率 = 1 + 0.2 × 增幅层数
```

说明：用户原始设想中的“攻击 +20% 可叠加”在本文中统一命名为“增幅模块”，避免 UI 与上架文案过于露骨。

---

# 5. 数值资源替换表

| 传统尖塔概念 | 本作概念 | 说明 |
|---|---|---|
| 生命值 HP | 张力上限 / 忍耐上限 | 主角从 0 积累，满则触发失控 |
| 攻击伤害 | 共鸣积累 | 让对手共鸣值上升 |
| 防御格挡 | 冷静 / 稳定 | 降低本回合张力增加 |
| 能量 | 行动力 | 每回合出牌资源 |
| 力量 | 技巧加成 | 提高共鸣积累 |
| 敏捷 | 稳定加成 | 提高冷静收益 |
| 中毒 | 持续心动 | 每回合自动增加共鸣 |
| 易伤 | 敏感 | 受到共鸣增加提高 |
| 虚弱 | 分心 | 造成共鸣降低 |
| 遗物 | 城堡纪念物 / 契约物 | 被动构筑核心 |
| 药水 | 临时道具 | 一次性效果 |
| 营火 | 休息室 | 恢复、升级、净化、调整卡组 |
| 金币 | 城堡筹码 | 商店购买资源 |

---

# 6. 角色系统

## 6.1 主角固定设定

玩家只能使用一个男性主角，但允许更换外观、服装、气质、配色和 UI 头像。

### 基础属性

| 属性 | 默认值 | 说明 |
|---|---:|---|
| 张力上限 | 100 | 满时触发失控结算 |
| 失控次数 | 1 | 相当于额外生命次数 |
| 行动力 | 3 | 每回合恢复 |
| 初始抽牌 | 5 | 每回合抽牌数量 |
| 手牌上限 | 10 | 超过不可再抽 |
| 初始金币 | 99 | 商店资源 |
| 初始卡组 | 10 张 | 基础动作、冷静、观察 |

## 6.2 可成长属性

| 属性 | 作用 | 来源 |
|---|---|---|
| 技巧 | 提高共鸣积累 | 卡牌、遗物、事件 |
| 稳定 | 降低张力增加 | 卡牌、遗物、休息室 |
| 张力上限 | 提高失败容错 | 遗物、事件、升级 |
| 失控次数 | 增加容错 | 稀有遗物、Boss 奖励 |
| 节奏 | 连续打出同类卡时增强 | 卡牌 Build |
| 观察 | 识破对手意图 | 技巧卡、事件 |
| 魅力 | 事件判定、商店折扣 | 事件、遗物 |

## 6.3 主角外观属性

外观属性只影响美术表现，不影响战斗强度：

- 发型。
- 肤色。
- 服装。
- 体型。
- 头像。
- 语音。
- 姿态。
- 背景故事。

---

# 7. 对手系统

## 7.1 对手基础结构

每个对手不是传统意义上的“敌人”，而是城堡试炼中的成年对手。对手拥有自己的偏好、节奏、防御、反制和阶段机制。

| 属性 | 说明 |
|---|---|
| 共鸣上限 | 胜利目标值 |
| 初始边界值 | 限制部分卡牌的使用条件 |
| 偏好标签 | 决定卡牌倍率 |
| 抗性标签 | 降低特定卡牌效果 |
| 意图列表 | 每回合行动模式 |
| 阶段变化 | 共鸣达到 33% / 66% / 100% 时切换 |
| 奖励池 | 战斗后奖励倾向 |

## 7.2 性别与身份表达

可包含：

- 女性对手。
- 男性对手。
- 非二元表达对手。
- 跨性别角色。
- 双性恋、同性恋、异性恋、泛性恋等身份表达。

规则：

- 性取向不做强弱数值。
- 性别不做优劣数值。
- 身份表达只影响角色故事、台词称谓、偏好叙事和美术表现。
- 所有角色必须明确成年。

## 7.3 肤色规则

肤色只能作为外观、文化审美和角色多样性的一部分，不允许设计成“某肤色天生属性更强 / 更弱 / 更耐受 / 更敏感”。

错误做法：

```text
黑皮 = 高耐久
白皮 = 高魅力
黄皮 = 高技巧
棕皮 = 高爆发
```

正确做法：

```text
肤色：外观色板
能力来源：职业、派系、性格、体型风格、场景机制、Boss 标签
```

## 7.4 体型与能力设计

体型可以作为“战斗风格标签”，但不能羞辱、物化或刻板化。建议命名为中性标签。

| 体型 / 风格标签 | 战斗能力方向 | 示例机制 |
|---|---|---|
| 轻盈型 | 高回避、高节奏变化 | 每 3 回合获得“闪避偏好”，降低下一张动作卡效果 |
| 健硕型 | 高共鸣上限、抗爆发 | 受到单次大额共鸣时减免 30% |
| 柔和型 | 易受持续状态影响 | 持续心动效果 +25% |
| 高挑型 | 长回合压制 | 回合越久，对主角张力压力越高 |
| 运动型 | 强反制 | 玩家连续同类卡会被削弱 |
| 华丽型 | 状态复杂 | 每阶段随机改变偏好标签 |
| 冷淡型 | 初期抗性高 | 前 3 回合共鸣获得 -40%，之后逐渐降低抗性 |
| 热情型 | 高风险高收益 | 玩家共鸣增加 +20%，但张力增加 +20% |

---

# 8. Build 方向总览

## 8.1 增幅改造流

主题：通过“增幅模块”不断叠加输出倍率。

核心特点：

- 每层增幅模块使动作卡共鸣增加 +20%。
- 可叠加。
- 叠层越高，主角张力增加越快。
- 需要搭配冷静、张力上限、失控次数。

核心卡牌：

- 增幅校准。
- 模块过载。
- 稳定器。
- 强化节奏。
- 代价转化。

核心遗物：

- 红铜增幅环：战斗开始获得 1 层增幅模块。
- 过热保险扣：每获得 3 层增幅模块，获得 1 层冷静。
- 城堡工匠印章：每幕首次升级增幅相关卡免费。

## 8.2 忍耐控制流

主题：提高张力上限，降低张力增长，把失败风险推迟到后期。

核心特点：

- 增加张力上限。
- 降低卡牌自身张力。
- 将张力转化为共鸣或金币。
- 适合新手与稳定通关。

核心卡牌：

- 深呼吸。
- 节奏放缓。
- 稳定姿态。
- 冷却回路。
- 忍耐训练。

核心遗物：

- 冷月挂坠：每回合首次增加张力时减少 3 点。
- 宽边袖扣：张力上限 +20。
- 静音沙漏：每 4 回合清除 10 点张力。

## 8.3 共鸣爆发流

主题：快速堆叠敏感、心动、标记，在短时间内打出高额共鸣。

核心特点：

- 高爆发。
- 回合短。
- 容易自涨张力。
- 克制低上限对手，怕反制型对手。

核心卡牌：

- 破防凝视。
- 情绪牵引。
- 节奏爆点。
- 标记弱点。
- 峰值推进。

核心遗物：

- 红幕手套：每场战斗第一张动作卡效果 +50%。
- 心跳节拍器：连续打出不同类型卡，第三张共鸣 +30%。
- 短夜香水：前三回合共鸣 +20%，之后张力增加 +10%。

## 8.4 持续心动流

主题：用持续状态每回合自动积累共鸣，少出高风险动作卡。

核心特点：

- 稳定。
- 低爆发。
- 需要拖回合。
- 怕清状态对手。

核心卡牌：

- 暧昧余温。
- 轻声引导。
- 眼神停留。
- 回声暗示。
- 余韵延长。

核心遗物：

- 紫绒香囊：每次施加持续心动，多施加 1 层。
- 低语唱针：每回合开始，随机对手获得 2 点共鸣。
- 慢燃蜡烛：持续状态每触发 5 次，抽 1 张牌。

## 8.5 观察反制流

主题：读取对手意图，根据意图使用克制卡，减少张力并反向积累共鸣。

核心特点：

- 策略性强。
- 需要记牌与看意图。
- 对 Boss 效果好。
- 对随机意图敌人有风险。

核心卡牌：

- 观察呼吸。
- 识破节奏。
- 反向引导。
- 借势推进。
- 安全距离。

核心遗物：

- 银框眼镜：每场战斗首次看穿对手下回合意图。
- 镜面扣针：成功打出克制卡时获得 1 点行动力。
- 观察者手册：每次触发反制，获得 2 金币。

## 8.6 多目标社交流

主题：面对多个对手时，用群体共鸣、传导、扩散效果取胜。

核心特点：

- 群体战强。
- 单体 Boss 较弱。
- 需要控制多个共鸣条。
- 适合事件房与精英房。

核心卡牌：

- 场面调度。
- 气氛扩散。
- 群体暗示。
- 主次切换。
- 全场升温。

核心遗物：

- 舞会邀请函：战斗开始时所有对手获得 5 点共鸣。
- 银色酒杯：群体卡每命中一个目标，恢复 1 点张力。
- 回音大厅钥匙：群体卡多命中一次随机目标，效果为 30%。

## 8.7 同步峰值流

主题：追求主角张力与对手共鸣在同一回合达到关键阈值，获得额外奖励。

核心特点：

- 高操作难度。
- 高奖励。
- 对数值计算要求高。
- 适合高手。

核心卡牌：

- 同步呼吸。
- 平衡推进。
- 临界掌控。
- 双线调度。
- 最后一拍。

核心遗物：

- 双面怀表：同回合触发共鸣峰值且主角张力低于 10，额外获得 1 张稀有卡奖励。
- 临界戒指：张力高于 80 时，动作卡共鸣 +30%。
- 月顶契约：每幕 Boss 战中，同步胜利额外获得 1 个 Boss 遗物选项。

## 8.8 失控利用流

主题：主动利用失控冲击造成 10% 共鸣追加，并通过额外失控次数和遗物补偿完成战斗。

核心特点：

- 高风险。
- 需要增加失控次数。
- 适合 Boss 爆发。
- 容错依赖遗物。

核心卡牌：

- 临界借力。
- 放任一瞬。
- 保险契约。
- 余波转化。
- 二次稳定。

核心遗物：

- 备用钥匙：每场战斗第一次失控后，若对手未达峰值，主角张力上限 +20。
- 红线保险：每幕第一次失败改为保留 1 点容错继续战斗。
- 余波水晶：失控冲击从 10% 提升到 15%。

---

# 9. 卡牌系统

## 9.1 卡牌类型

| 类型 | 作用 |
|---|---|
| 动作卡 | 直接增加对手共鸣，通常增加主角张力 |
| 技巧卡 | 施加状态、调整卡组、观察意图 |
| 冷静卡 | 降低张力或获得稳定 |
| 姿态卡 | 改变主角当前战斗姿态 |
| 气氛卡 | 群体效果、持续状态、场地影响 |
| 契约卡 | 高风险高收益、改变胜负规则 |
| 终结卡 | 条件满足时造成大量共鸣 |

## 9.2 卡牌稀有度

| 稀有度 | 占比 | 设计原则 |
|---|---:|---|
| 普通 | 60% | 基础构筑、稳定效果 |
| 罕见 | 30% | Build 核心、状态联动 |
| 稀有 | 10% | 改变规则、强爆发、高风险 |

## 9.3 卡牌关键词

| 关键词 | 说明 |
|---|---|
| 增幅 | 提高动作卡共鸣倍率 |
| 冷静 | 抵消即将获得的张力 |
| 敏感 | 对手受到共鸣增加提高 |
| 持续心动 | 每回合开始获得共鸣 |
| 观察 | 查看或改变对手意图 |
| 同步 | 根据主角张力与对手共鸣差值触发 |
| 消耗 | 本场战斗移出 |
| 保留 | 回合结束不弃掉 |
| 临界 | 主角张力高于 70 时触发额外效果 |
| 安抚 | 降低对手反制或边界压力 |
| 边界 | 部分卡牌需要边界值满足条件 |

## 9.4 初始卡组

| 卡牌 | 数量 | 消耗 | 效果 |
|---|---:|---:|---|
| 基础推进 | 5 | 1 | 目标共鸣 +6，主角张力 +4 |
| 深呼吸 | 4 | 1 | 获得 6 点冷静 |
| 观察 | 1 | 0 | 查看目标下回合意图，抽 1 张牌 |

## 9.5 卡牌升级规则

- 数值牌：增加共鸣或冷静。
- 状态牌：增加层数或降低消耗。
- 高风险牌：降低张力副作用。
- 稀有牌：增加额外触发条件。

示例：

```text
基础推进
消耗 1
目标共鸣 +6，主角张力 +4
升级后：目标共鸣 +9，主角张力 +4
```

---

# 10. 遗物系统

## 10.1 遗物定位

遗物是 Build 的长期核心，分为：

- 通用遗物。
- Build 遗物。
- Boss 遗物。
- 事件遗物。
- 负面契约遗物。

## 10.2 遗物触发时机

| 时机 | 示例 |
|---|---|
| 战斗开始 | 获得增幅、抽牌、冷静 |
| 回合开始 | 降张力、加行动力、触发持续状态 |
| 出牌时 | 同类型连击、不同类型奖励 |
| 共鸣变化时 | 达到阈值触发奖励 |
| 张力变化时 | 临界增强、失控保护 |
| 战斗胜利 | 额外金币、移除卡牌、恢复状态 |

---

# 11. 药水 / 临时道具系统

## 11.1 设计目标

- 一次性救急。
- 破局特殊战斗。
- 支持 Build 爆发。
- 减少随机失败感。

## 11.2 道具类型

| 类型 | 示例效果 |
|---|---|
| 冷静道具 | 立即降低 20 张力 |
| 共鸣道具 | 目标共鸣 +15 |
| 抽牌道具 | 抽 3 张牌 |
| 行动力道具 | 本回合行动力 +2 |
| 状态道具 | 目标获得 3 层敏感 |
| 保险道具 | 本回合张力不会超过上限 |
| 净化道具 | 移除所有负面状态 |

---

# 12. 地图节点系统

## 12.1 地图类型

| 节点 | 功能 |
|---|---|
| 普通试炼 | 基础战斗 |
| 精英试炼 | 高难战斗，奖励遗物 |
| 事件房 | 剧情选择、风险收益 |
| 商店 | 买卡、遗物、道具、删卡 |
| 休息室 | 恢复、升级、净化、训练 |
| 宝箱 | 获得遗物或金币 |
| Boss | 幕终挑战 |

## 12.2 地图生成规则

- 每幕 15 层左右。
- 每层 3~6 个节点。
- 节点之间有 1~3 条路线连接。
- 第一层固定普通试炼。
- 最后一层固定 Boss。
- 精英之间至少间隔 2 层。
- 休息室通常出现在 Boss 前。

## 12.3 地图 Prefab

```text
PF_MapRoot
├── BG_CastleMap
├── NodeLayer
│   ├── PF_MapNode_Normal
│   ├── PF_MapNode_Elite
│   ├── PF_MapNode_Event
│   ├── PF_MapNode_Shop
│   ├── PF_MapNode_Rest
│   ├── PF_MapNode_Treasure
│   └── PF_MapNode_Boss
├── PathLayer
│   └── PF_MapPathLine
├── TopBar
│   ├── Txt_ActName
│   ├── Txt_Floor
│   ├── Icon_Gold
│   └── Btn_Deck
└── BottomTip
    └── Txt_NodeDescription
```

---

# 13. 事件系统

## 13.1 事件结构

每个事件由：

- 事件标题。
- 事件插图。
- 描述文本。
- 2~4 个选项。
- 条件检查。
- 结果。
- 是否可重复。

## 13.2 事件选项类型

| 类型 | 示例 |
|---|---|
| 获得卡牌 | 获得一张特殊卡 |
| 移除卡牌 | 删除一张基础卡 |
| 升级卡牌 | 随机升级一张卡 |
| 获得遗物 | 付出代价换遗物 |
| 增加张力上限 | 永久 +10 上限 |
| 增加失控次数 | 稀有事件奖励 |
| 获得负面牌 | 换取强力奖励 |
| 改变路线 | 跳过或进入隐藏节点 |

## 13.3 事件示例

### 红幕邀请

描述：一封来自城堡深处的邀请函落在脚边，信封微微发热。

选项：

1. 接受邀请：获得 1 个随机遗物，加入 1 张“焦躁”负面牌。
2. 谨慎阅读：获得 75 金币。
3. 退后一步：恢复 10 张力上限的安全值。

### 镜中契约

描述：镜子里的你提出一个交易：更强的爆发，更少的余地。

选项：

1. 签下契约：动作卡共鸣 +15%，张力上限 -15。
2. 打碎镜子：移除一张牌，失去 50 金币。
3. 转身离开：无事发生。

---

# 14. 关卡与 Boss 设计

## 14.1 第一幕 Boss：红幕主持人

### 机制

- 共鸣上限：180。
- 每 3 回合切换一次偏好标签。
- 玩家连续打出同类型卡时，主持人获得“审美疲劳”，该类型效果 -20%。

### 意图

| 意图 | 效果 |
|---|---|
| 点名 | 下回合第一张牌张力 +3 |
| 烘托气氛 | 主持人获得 2 层敏感 |
| 打断节奏 | 玩家弃 1 张随机手牌 |
| 红幕高潮段 | 若主持人共鸣超过 70%，下一回合共鸣获得 +30% |

## 14.2 第二幕 Boss：镜面双生

### 机制

- 两个目标共享阶段。
- 一个目标共鸣过高时，另一个目标获得抗性。
- 需要平衡两个共鸣条。

### 意图

| 意图 | 效果 |
|---|---|
| 复制 | 复制玩家上一张非基础卡效果的 30% 作为反制 |
| 反问 | 玩家下回合技巧卡消耗 +1 |
| 折光 | 共鸣最低的目标获得 20 点共鸣 |
| 双镜合拍 | 若两个目标共鸣差小于 15，玩家获得 1 点行动力 |

## 14.3 第三幕 Boss：城堡之心

### 机制

- 三阶段。
- 每阶段改变胜利条件。
- 最终阶段要求在 5 回合内达到峰值。

### 阶段

| 阶段 | 规则 |
|---|---|
| 第一阶段：试探 | 所有动作卡基础效果 -20% |
| 第二阶段：升温 | 玩家每回合额外获得 5 张力，但共鸣 +20% |
| 第三阶段：临界 | 5 回合倒计时，失败则直接失控结算 |

---

# 15. 成人向合规与包容性规则

## 15.1 年龄规则

- 所有角色明确 18+。
- 不出现学生制服、幼态身材、未成年暗示、年龄模糊文本。
- 角色档案必须包含“成年确认”字段。

## 15.2 同意与边界规则

- 所有互动建立在自愿基础上。
- 对手不是被征服对象，而是试炼参与者。
- “边界值”是限制系统，不是强迫系统。
- 玩家使用越界牌时，必须有系统条件、文本提示和失败惩罚。
- 不设计无同意、强迫、胁迫、昏迷、药物控制等内容。

## 15.3 LGBTQ+ 包容性规则

- 性取向不是数值标签。
- 跨性别、非二元角色不作为猎奇点。
- 代词、称谓、身份文本可配置。
- 角色能力来自职业、派系、性格、战术机制，不来自身份。
- 避免把 LGBTQ+ 角色与“混乱、诱惑、危险、欺骗”等负面刻板印象绑定。

## 15.4 肤色与种族表达规则

- 肤色只作为外观色板。
- 不把肤色、族裔、国籍和性能力、耐受、魅力、服从、攻击性绑定。
- 如果需要文化风格，用虚构城堡派系、服装、场景和职业表达，不使用现实族裔刻板模板。

## 15.5 平台合规建议

- 游戏启动前年龄确认。
- Steam 内容调查表中如实标注成人内容。
- 设置中提供内容过滤。
- 商店页截图避免露骨画面。
- 预告片使用隐喻镜头、UI、角色表情、剪影和特效。
- 本地化时不同地区可切换成人内容强度。

---

# 16. UI 总体设计

## 16.1 UI 风格

- 暗红、紫、金、黑为主色。
- 材质：天鹅绒、烛光、镜面、金属边框、玫瑰纹理。
- 形状：圆角卡牌、拱门、丝带、城堡窗格。
- 动效：心跳脉冲、烛光摇曳、卡牌轻微浮动。
- 字体：标题用优雅衬线，正文用清晰无衬线。

## 16.2 战斗界面布局

```text
┌──────────────────────────────────────────────┐
│ 顶部：对手信息 / 共鸣条 / 意图 / 状态         │
│                                              │
│ 左侧：主角立绘              右侧：对手立绘     │
│                                              │
│ 中部：战斗特效层 / 数值飘字 / 状态提示         │
│                                              │
│ 底部：手牌区                               │
│ 左下：抽牌堆 / 弃牌堆   中下：行动力   右下：结束回合 │
└──────────────────────────────────────────────┘
```

## 16.3 信息优先级

1. 当前对手共鸣值。
2. 主角张力值。
3. 对手下回合意图。
4. 当前行动力。
5. 手牌费用与可用状态。
6. 状态层数。
7. 遗物触发提示。

---

# 17. Unity UI Prefab 预制体结构

## 17.1 UI 命名规范

```text
PF_      Prefab
UI_      UI 根物体
Btn_     Button
Txt_     TextMeshProUGUI
Img_     Image
Icon_    图标
Bar_     进度条
Panel_   面板
Slot_    插槽
Anim_    动画节点
VFX_     特效节点
SO_      ScriptableObject
```

## 17.2 主菜单 UI

```text
PF_UI_MainMenu
├── Canvas_Main
│   ├── BG_CastleHall
│   ├── Panel_Title
│   │   ├── Txt_GameTitle
│   │   └── Txt_Subtitle
│   ├── Panel_AgeGate
│   │   ├── Txt_AgeWarning
│   │   ├── Toggle_Confirm18
│   │   └── Btn_Enter
│   ├── Panel_MenuButtons
│   │   ├── Btn_NewRun
│   │   ├── Btn_Continue
│   │   ├── Btn_Collection
│   │   ├── Btn_Settings
│   │   └── Btn_Quit
│   └── Panel_Version
│       └── Txt_Version
└── EventSystem
```

## 17.3 战斗 UI

```text
PF_UI_Combat
├── Canvas_Combat
│   ├── BG_CombatRoom
│   ├── Panel_TopEnemy
│   │   ├── Txt_EnemyName
│   │   ├── Bar_EnemyResonance
│   │   │   ├── Img_BarBack
│   │   │   ├── Img_BarFill
│   │   │   └── Txt_Value
│   │   ├── Icon_EnemyIntent
│   │   ├── Txt_IntentValue
│   │   └── Slot_EnemyStatuses
│   ├── Panel_Player
│   │   ├── Img_PlayerPortrait
│   │   ├── Bar_PlayerTension
│   │   │   ├── Img_BarBack
│   │   │   ├── Img_BarFill
│   │   │   └── Txt_Value
│   │   ├── Txt_ReleaseCount
│   │   └── Slot_PlayerStatuses
│   ├── Panel_Relics
│   │   └── Grid_RelicSlots
│   ├── Panel_CardArea
│   │   ├── Slot_DrawPile
│   │   ├── HandRoot
│   │   ├── Slot_DiscardPile
│   │   └── Slot_ExhaustPile
│   ├── Panel_Energy
│   │   ├── Img_EnergyOrb
│   │   └── Txt_EnergyValue
│   ├── Btn_EndTurn
│   ├── Panel_Tooltip
│   └── VFX_CombatOverlay
└── EventSystem
```

## 17.4 卡牌 Prefab

```text
PF_UI_Card
├── Img_CardBack
├── Img_CardFrame
├── Img_CardArt
├── Txt_Cost
├── Txt_CardName
├── Txt_CardType
├── Txt_Description
├── Icon_Rarity
├── Icon_Keywords
├── Img_UpgradeMark
├── Img_DisabledMask
├── VFX_HoverGlow
├── VFX_PlayFlash
└── CardView.cs
```

### CardView 组件字段

```csharp
public class CardView : MonoBehaviour
{
    public Image cardArt;
    public Image cardFrame;
    public TMP_Text costText;
    public TMP_Text nameText;
    public TMP_Text typeText;
    public TMP_Text descText;
    public GameObject upgradeMark;
    public GameObject disabledMask;
}
```

## 17.5 地图 UI

```text
PF_UI_CastleMap
├── Canvas_Map
│   ├── BG_Map
│   ├── PathRoot
│   ├── NodeRoot
│   ├── Panel_ActInfo
│   │   ├── Txt_ActName
│   │   ├── Txt_CurrentFloor
│   │   └── Txt_RouteTip
│   ├── Panel_TopResource
│   │   ├── Icon_Gold
│   │   ├── Txt_Gold
│   │   ├── Btn_Deck
│   │   └── Btn_Settings
│   └── Panel_NodeTooltip
└── EventSystem
```

## 17.6 奖励 UI

```text
PF_UI_Reward
├── Panel_RewardRoot
│   ├── Txt_Title
│   ├── Panel_GoldReward
│   ├── Panel_CardChoices
│   │   ├── PF_UI_CardChoice_01
│   │   ├── PF_UI_CardChoice_02
│   │   └── PF_UI_CardChoice_03
│   ├── Panel_RelicReward
│   ├── Btn_Skip
│   └── Btn_Confirm
```

## 17.7 商店 UI

```text
PF_UI_Shop
├── Panel_ShopRoot
│   ├── Txt_ShopName
│   ├── Txt_Gold
│   ├── Grid_CardGoods
│   ├── Grid_RelicGoods
│   ├── Grid_ItemGoods
│   ├── Btn_RemoveCard
│   ├── Btn_Leave
│   └── Panel_ShopKeeperDialog
```

## 17.8 休息室 UI

```text
PF_UI_RestRoom
├── Panel_RestRoot
│   ├── BG_RestRoom
│   ├── Txt_Title
│   ├── Btn_Rest
│   ├── Btn_Upgrade
│   ├── Btn_Cleanse
│   ├── Btn_Train
│   ├── Btn_Leave
│   └── Panel_Description
```

## 17.9 设置 UI

```text
PF_UI_Settings
├── Panel_SettingsRoot
│   ├── Tab_Graphics
│   ├── Tab_Audio
│   ├── Tab_Gameplay
│   ├── Tab_ContentFilter
│   ├── Tab_Language
│   └── Btn_Back
```

### 内容过滤设置

| 设置 | 选项 |
|---|---|
| 成人暗示强度 | 低 / 中 / 高 |
| 服装暴露度 | 保守 / 标准 / 成人 |
| 文本隐喻程度 | 含蓄 / 标准 / 直白但不露骨 |
| 镜头表现 | 剪影 / 半身 / 特写关闭 |
| 音效强度 | 关闭 / 轻微 / 标准 |
| LGBTQ+ 角色显示 | 默认全部显示，不建议关闭；可只调整剧情提示频率 |

---

# 18. 战斗 Prefab 结构

## 18.1 战斗场景根结构

```text
Scene_Combat
├── CombatManager
├── TurnManager
├── CardManager
├── EffectResolver
├── EnemyIntentManager
├── RewardManager
├── UI_CombatRoot
├── CharacterRoot
│   ├── PF_PlayerAvatar
│   └── EnemySlots
│       ├── PF_EnemyAvatar_01
│       ├── PF_EnemyAvatar_02
│       └── PF_EnemyAvatar_03
├── VFXRoot
├── SFXRoot
└── Camera_Combat
```

## 18.2 主角 Avatar Prefab

```text
PF_PlayerAvatar
├── SpriteRoot
│   ├── Img_Body
│   ├── Img_Outfit
│   ├── Img_Expression
│   └── Img_Accessory
├── Anim_PlayerIdle
├── VFX_TensionPulse
├── VFX_CalmShield
└── PlayerAvatarView.cs
```

## 18.3 对手 Avatar Prefab

```text
PF_PartnerAvatar
├── SpriteRoot
│   ├── Img_Body
│   ├── Img_Outfit
│   ├── Img_Expression
│   ├── Img_Accessory
│   └── Img_SilhouetteOverlay
├── Bar_ResonanceWorld
├── IntentIconRoot
├── StatusIconRoot
├── VFX_ResonancePulse
├── VFX_PhaseChange
└── PartnerAvatarView.cs
```

## 18.4 状态图标 Prefab

```text
PF_UI_StatusIcon
├── Img_Icon
├── Txt_Stack
├── Img_DurationRing
├── VFX_NewStackFlash
└── StatusTooltipTrigger.cs
```

## 18.5 遗物图标 Prefab

```text
PF_UI_RelicIcon
├── Img_Icon
├── Img_Frame
├── Txt_Counter
├── VFX_TriggerFlash
└── RelicTooltipTrigger.cs
```

---

# 19. 卡牌与数据 ScriptableObject 结构

## 19.1 CardData

```csharp
public enum CardType
{
    Action,
    Technique,
    Calm,
    Stance,
    Atmosphere,
    Contract,
    Finisher
}

public enum CardRarity
{
    Common,
    Uncommon,
    Rare,
    Curse
}

[CreateAssetMenu(menuName = "Castle/CardData")]
public class CardData : ScriptableObject
{
    public string cardId;
    public string cardName;
    public CardType cardType;
    public CardRarity rarity;
    public int cost;
    public Sprite artwork;
    [TextArea] public string description;

    public List<CardKeyword> keywords;
    public List<CardEffectData> effects;

    public bool exhaust;
    public bool retain;
    public bool innate;

    public CardData upgradedVersion;
}
```

## 19.2 CardEffectData

```csharp
public enum EffectTarget
{
    Self,
    SinglePartner,
    AllPartners,
    RandomPartner
}

public enum EffectType
{
    AddResonance,
    AddTension,
    ReduceTension,
    GainCalm,
    DrawCard,
    GainEnergy,
    ApplyStatus,
    AddAmplifyStack,
    ModifyIntent,
    ExhaustCard,
    GenerateCard,
    IncreaseMaxTension,
    AddReleaseChance
}

[System.Serializable]
public class CardEffectData
{
    public EffectType effectType;
    public EffectTarget target;
    public int value;
    public string statusId;
    public int stack;
    public bool affectedByTechnique;
    public bool affectedByAmplify;
}
```

## 19.3 PartnerData

```csharp
[CreateAssetMenu(menuName = "Castle/PartnerData")]
public class PartnerData : ScriptableObject
{
    public string partnerId;
    public string displayName;
    public int adultAgeConfirm; // 必须 >= 18
    public GenderExpression genderExpression;
    public PronounType pronounType;

    public Sprite portrait;
    public Sprite fullBody;
    public VisualProfileData visualProfile;

    public int maxResonance;
    public int baseBoundary;
    public List<string> preferenceTags;
    public List<string> resistanceTags;
    public List<IntentPatternData> intentPatterns;
    public List<PhaseRuleData> phaseRules;
    public RewardPoolData rewardPool;
}
```

## 19.4 VisualProfileData

```csharp
[CreateAssetMenu(menuName = "Castle/VisualProfile")]
public class VisualProfileData : ScriptableObject
{
    public string skinTonePaletteId; // 仅外观
    public string bodyStyleTag;      // 仅战斗风格，不绑定现实族群
    public string outfitStyle;
    public string factionStyle;
    public string personalityStyle;
}
```

## 19.5 RelicData

```csharp
[CreateAssetMenu(menuName = "Castle/RelicData")]
public class RelicData : ScriptableObject
{
    public string relicId;
    public string relicName;
    public Sprite icon;
    public RelicRarity rarity;
    [TextArea] public string description;
    public List<RelicTriggerData> triggers;
}
```

## 19.6 StatusData

```csharp
[CreateAssetMenu(menuName = "Castle/StatusData")]
public class StatusData : ScriptableObject
{
    public string statusId;
    public string statusName;
    public Sprite icon;
    public bool isBuff;
    public bool stackable;
    [TextArea] public string description;
    public List<StatusTriggerData> triggers;
}
```

---

# 20. 存档、配置与本地化

## 20.1 存档内容

```json
{
  "profileId": "default",
  "unlockedCards": [],
  "unlockedRelics": [],
  "unlockedPartners": [],
  "completedRuns": 0,
  "highestDifficulty": 0,
  "settings": {},
  "currentRun": {}
}
```

## 20.2 单局存档

```json
{
  "seed": 123456,
  "actIndex": 1,
  "floorIndex": 7,
  "deck": [],
  "relics": [],
  "gold": 120,
  "maxTension": 110,
  "releaseChance": 1,
  "mapState": {},
  "rngState": {}
}
```

## 20.3 本地化 Key 命名

```text
CARD_BASIC_ADVANCE_NAME
CARD_BASIC_ADVANCE_DESC
RELIC_RED_VELVET_RING_NAME
PARTNER_RED_HOST_NAME
EVENT_MIRROR_CONTRACT_TITLE
UI_BTN_END_TURN
UI_BAR_TENSION
UI_BAR_RESONANCE
```

---

# 21. 美术规范

## 21.1 总体风格

- 成人奇幻城堡。
- 半写实 + 卡牌插画。
- 暗红、紫金、烛光、丝绒、镜面。
- 表现重点是氛围、表情、姿态和 UI 反馈，而不是露骨画面。

## 21.2 角色立绘规范

| 项目 | 规格 |
|---|---|
| 画幅 | 2048×3072 |
| 背景 | 透明 PNG |
| 角色年龄 | 明确成年 |
| 姿势 | 自信、戏剧化、可读性强 |
| 表情 | 至少 5 套：普通、微笑、惊讶、专注、阶段变化 |
| 服装 | 可性感但不可幼态化 |
| 图层 | 身体、服装、表情、饰品、特效分层 |

## 21.3 卡牌插画规范

| 项目 | 规格 |
|---|---|
| 尺寸 | 768×1024 |
| 画面 | 隐喻物件、手势、光影、丝带、玫瑰、酒杯、镜子 |
| 禁止 | 露骨器官、强迫场景、未成年暗示 |
| 色彩 | 根据类型区分：动作红、冷静蓝、技巧紫、契约金黑 |

## 21.4 UI 图标规范

| 图标类型 | 视觉关键词 |
|---|---|
| 张力 | 红色心跳线、脉冲、火焰 |
| 共鸣 | 紫金波纹、圆环、光晕 |
| 冷静 | 蓝色月光、冰晶、羽毛 |
| 增幅 | 金属环、齿轮、红宝石 |
| 敏感 | 粉色闪光、细线震动 |
| 观察 | 银色眼睛、镜片 |
| 同步 | 双环相扣、双心节拍 |

---

# 22. 音效与反馈规范

## 22.1 音效类型

| 类型 | 表现 |
|---|---|
| 出牌 | 纸牌滑动、丝绒摩擦、轻敲声 |
| 共鸣增加 | 柔和上扬音、心跳、铃音 |
| 张力增加 | 低频脉冲、呼吸感合成器 |
| 冷静 | 风声、冰晶、低音消退 |
| 遗物触发 | 金属轻响、魔法闪烁 |
| 对手阶段变化 | 和弦上升、空间混响 |
| 胜利 | 华丽短乐句、城堡门开启 |
| 失败 | 低频下坠、烛光熄灭 |

## 22.2 音频设置

- BGM 音量。
- SFX 音量。
- UI 音量。
- 成人氛围音开关。
- 心跳低频开关。

---

# 23. 开发里程碑

## Milestone 1：核心战斗 Demo

目标：完成最小可玩战斗。

内容：

- 抽牌、出牌、弃牌。
- 行动力。
- 张力条。
- 共鸣条。
- 1 个对手。
- 20 张基础卡。
- 胜负结算。

## Milestone 2：地图与奖励

内容：

- 随机地图。
- 节点选择。
- 卡牌奖励。
- 金币。
- 商店。
- 休息室。

## Milestone 3：Build 与遗物

内容：

- 8 个 Build 方向。
- 80 张卡。
- 50 个遗物。
- 20 个状态。
- 10 个事件。

## Milestone 4：第一幕完整

内容：

- 第一幕 12 个普通对手。
- 3 个精英对手。
- 1 个 Boss。
- 20 个事件。
- 完整 UI。

## Milestone 5：三幕完整

内容：

- 三幕地图。
- 60+ 对手。
- 9 个精英。
- 3 个 Boss。
- 图鉴。
- 难度阶梯。

## Milestone 6：内容过滤与上架准备

内容：

- 年龄门。
- 内容过滤设置。
- 本地化。
- 存档。
- Steam 页面素材。
- 成人内容标注清单。

---

# 24. 附录：卡牌示例表

## 24.1 普通卡

| 名称 | 费用 | 类型 | 效果 | 升级 |
|---|---:|---|---|---|
| 基础推进 | 1 | 动作 | 目标共鸣 +6，主角张力 +4 | 共鸣 +9 |
| 稳定姿态 | 1 | 冷静 | 获得 8 冷静 | 获得 11 冷静 |
| 观察呼吸 | 0 | 技巧 | 查看目标意图，抽 1 张 | 额外降低 2 张力 |
| 暧昧余温 | 1 | 技巧 | 施加 3 层持续心动 | 施加 4 层 |
| 轻声引导 | 1 | 技巧 | 共鸣 +4，施加 1 层敏感 | 共鸣 +6 |
| 节奏放缓 | 1 | 冷静 | 本回合张力获得 -30% | -40% |
| 情绪牵引 | 1 | 动作 | 共鸣 +5，若目标有敏感，额外 +5 | 额外 +8 |
| 安全距离 | 1 | 冷静 | 获得 6 冷静，下回合抽 1 张 | 冷静 +9 |
| 场面调度 | 1 | 气氛 | 所有目标共鸣 +3 | +5 |
| 主次切换 | 0 | 技巧 | 切换目标，下一张单体卡 +30% | +40% |

## 24.2 罕见卡

| 名称 | 费用 | 类型 | 效果 | 升级 |
|---|---:|---|---|---|
| 增幅校准 | 1 | 技巧 | 获得 1 层增幅模块 | 固有 |
| 模块过载 | 2 | 动作 | 共鸣 +12，每层增幅额外 +3，张力 +8 | 共鸣 +16 |
| 冷却回路 | 1 | 冷静 | 移除 10 张力，消耗 | 不消耗 |
| 标记弱点 | 1 | 技巧 | 施加 2 层敏感，下一张动作卡 +20% | 3 层 |
| 余韵延长 | 1 | 技巧 | 持续心动层数翻倍，上限 12 | 上限 16 |
| 识破节奏 | 1 | 技巧 | 若克制目标意图，获得 1 行动力 | 抽 1 张 |
| 气氛扩散 | 2 | 气氛 | 所有目标获得 8 共鸣，施加 1 层心动 | 共鸣 +11 |
| 同步呼吸 | 1 | 姿态 | 若张力与目标共鸣差小于 20，抽 2 张 | 抽 3 张 |
| 保险契约 | 1 | 契约 | 本回合张力不会超过上限，消耗 | 费用 0 |
| 借势推进 | 1 | 动作 | 根据目标意图强度增加共鸣 | 数值提高 |

## 24.3 稀有卡

| 名称 | 费用 | 类型 | 效果 | 升级 |
|---|---:|---|---|---|
| 临界掌控 | 2 | 契约 | 张力高于 70 时，所有共鸣效果 +50%，持续 1 回合 | 持续 2 回合 |
| 峰值推进 | 3 | 终结 | 共鸣 +30；若目标有敏感，额外 +20 | 费用 2 |
| 月顶契约 | 2 | 契约 | 增加 1 次失控次数，张力上限 -20 | 张力上限 -10 |
| 双线调度 | 2 | 技巧 | 主角降低 15 张力，目标增加 15 共鸣 | 数值 20 |
| 全场升温 | 3 | 气氛 | 所有目标共鸣 +18，主角张力 +12 | 共鸣 +24 |
| 最后一拍 | 1 | 终结 | 若目标共鸣高于 80%，直接达到峰值；否则无效 | 阈值 75% |
| 余波转化 | 2 | 契约 | 下次失控冲击提高到 20%，消耗 | 25% |
| 完美同步 | 3 | 终结 | 若本回合胜利且张力低于 30，获得额外遗物选项 | 费用 2 |

## 24.4 负面牌

| 名称 | 费用 | 类型 | 效果 | 处理方式 |
|---|---:|---|---|---|
| 焦躁 | 无法打出 | 负面 | 抽到时张力 +3 | 商店删除、事件净化 |
| 分心 | 1 | 负面 | 本回合下一张卡效果 -30% | 打出后消耗 |
| 过热 | 无法打出 | 负面 | 回合结束张力 +5 | 战斗后移除 |
| 犹豫 | 0 | 负面 | 抽 1 张，行动力 -1 | 打出后消耗 |

---

# 25. 附录：遗物示例表

| 名称 | 稀有度 | 效果 | Build 倾向 |
|---|---|---|---|
| 红铜增幅环 | 普通 | 战斗开始获得 1 层增幅模块 | 增幅流 |
| 宽边袖扣 | 普通 | 张力上限 +20 | 忍耐流 |
| 冷月挂坠 | 普通 | 每回合首次获得张力 -3 | 忍耐流 |
| 紫绒香囊 | 普通 | 施加持续心动时 +1 层 | 持续流 |
| 银框眼镜 | 普通 | 战斗开始查看第一回合意图 | 观察流 |
| 心跳节拍器 | 罕见 | 连续打出三种不同类型卡，第三张共鸣 +30% | 爆发流 |
| 舞会邀请函 | 罕见 | 战斗开始所有目标共鸣 +5 | 群体流 |
| 镜面扣针 | 罕见 | 克制对手意图时获得 1 行动力 | 观察流 |
| 过热保险扣 | 罕见 | 每获得 3 层增幅，获得 1 冷静 | 增幅流 |
| 双面怀表 | 稀有 | 同步胜利时额外获得 1 张稀有卡选项 | 同步流 |
| 余波水晶 | 稀有 | 失控冲击从 10% 提高到 15% | 失控流 |
| 月顶契约 | Boss | 每幕 Boss 战同步胜利额外获得 1 个 Boss 遗物选项 | 高手流 |
| 城堡核心 | Boss | 每回合行动力 +1，但张力获得 +15% | 高风险 |
| 安静房卡 | Boss | 每回合抽牌 +1，但商店价格 +20% | 通用 |

---

# 26. 附录：对手示例表

> 注意：肤色只写入 VisualProfile，不写入属性表。以下能力来自派系、职业、性格和战斗机制。

## 26.1 普通对手

| 名称 | 性别表达 | 风格标签 | 共鸣上限 | 机制 |
|---|---|---|---:|---|
| 红幕舞者 | 女性 | 轻盈型 / 表演者 | 90 | 每 3 回合闪避一次高额单体卡 |
| 夜班调酒师 | 男性 | 冷淡型 / 观察者 | 110 | 前 3 回合共鸣 -30%，之后解除 |
| 丝绒歌手 | 非二元 | 华丽型 / 声音 | 100 | 每回合随机改变偏好标签 |
| 镜厅模特 | 女性 | 高挑型 / 镜像 | 120 | 玩家重复出同类卡效果递减 |
| 健身教练 | 男性 | 健硕型 / 运动 | 135 | 单次超过 20 的共鸣减免 30% |
| 温室画家 | 女性 | 柔和型 / 慢热 | 100 | 持续心动效果 +25% |
| 玫瑰诗人 | 男性 | 技巧型 / 文字 | 95 | 技巧卡效果 +20%，动作卡 -10% |
| 午夜 DJ | 非二元 | 节奏型 / 音乐 | 105 | 每回合指定一种卡牌类型获得加成 |

## 26.2 精英对手

| 名称 | 性别表达 | 共鸣上限 | 机制 |
|---|---|---:|---|
| 双面摄影师 | 男性 | 180 | 复制玩家上一回合最强卡的 30% 作为反制 |
| 黑玫瑰经理 | 女性 | 200 | 每回合提高商店债务，战后根据回合数扣金币 |
| 月光守门人 | 非二元 | 190 | 需要先破除 3 层边界护盾才能正常积累共鸣 |

## 26.3 Boss 对手

| 名称 | 幕 | 共鸣上限 | 核心机制 |
|---|---:|---:|---|
| 红幕主持人 | 1 | 180 | 切换偏好，惩罚重复类型 |
| 镜面双生 | 2 | 2 × 150 | 双目标平衡，共鸣差过大会反制 |
| 城堡之心 | 3 | 300 | 三阶段，最终 5 回合倒计时 |

---

# 27. 程序实现建议

## 27.1 核心管理器

```text
GameRunManager      单局流程、地图、奖励、存档
CombatManager       战斗生命周期
TurnManager         回合切换
CardManager         抽牌、弃牌、洗牌、出牌
EffectResolver      统一结算卡牌、遗物、状态
PartnerAIManager    对手意图选择
RelicManager        遗物触发
StatusManager       状态叠加与触发
RewardManager       奖励生成
LocalizationManager 文本本地化
ContentFilter       成人内容过滤
```

## 27.2 效果结算原则

所有效果统一进入队列，避免结算顺序混乱。

```text
出牌
  ↓
创建 EffectQueue
  ↓
检查费用
  ↓
检查目标
  ↓
检查边界条件
  ↓
应用卡牌基础效果
  ↓
应用状态修正
  ↓
应用遗物修正
  ↓
更新 UI
  ↓
检查胜负
```

## 27.3 推荐目录结构

```text
Assets/
├── Art/
│   ├── Characters/
│   ├── Cards/
│   ├── UI/
│   ├── VFX/
│   └── Backgrounds/
├── Audio/
│   ├── BGM/
│   ├── SFX/
│   └── UI/
├── Prefabs/
│   ├── UI/
│   ├── Combat/
│   ├── Map/
│   └── VFX/
├── ScriptableObjects/
│   ├── Cards/
│   ├── Relics/
│   ├── Partners/
│   ├── Statuses/
│   ├── Events/
│   └── Rewards/
├── Scripts/
│   ├── Core/
│   ├── Combat/
│   ├── Cards/
│   ├── Relics/
│   ├── Statuses/
│   ├── UI/
│   ├── Map/
│   ├── Save/
│   └── Localization/
└── Scenes/
    ├── MainMenu.unity
    ├── CastleMap.unity
    ├── Combat.unity
    ├── Shop.unity
    └── Collection.unity
```

---

# 28. 第一版 Demo 最小内容清单

## 卡牌

- 普通卡 20 张。
- 罕见卡 10 张。
- 稀有卡 5 张。
- 负面牌 3 张。

## 对手

- 普通对手 6 个。
- 精英对手 2 个。
- Boss 1 个。

## 遗物

- 普通遗物 15 个。
- 罕见遗物 8 个。
- 稀有遗物 4 个。
- Boss 遗物 3 个。

## UI

- 主菜单。
- 年龄确认。
- 战斗界面。
- 地图界面。
- 奖励界面。
- 商店界面。
- 休息室界面。
- 设置界面。

## 系统

- 单局流程。
- 随机地图。
- 卡牌奖励。
- 商店购买。
- 休息升级。
- 存档继续。
- 内容过滤。

---

# 29. 设计总结

本项目的关键不是把传统攻击换成露骨动作，而是把《杀戮尖塔》的“资源压力”换成成人向的“双阈值博弈”：

- 玩家越激进，对手共鸣越快，但主角张力也越危险。
- 玩家越保守，安全性越高，但可能被对手机制拖垮。
- Build 的核心围绕“输出、忍耐、冷静、持续、观察、同步、失控利用”展开。
- 成人向内容通过氛围、角色、卡牌隐喻、UI、音效和剧情事件表达。
- 包容性设计上，角色多样性可以丰富内容，但不能把肤色、性取向、性别认同做成强弱模板。

