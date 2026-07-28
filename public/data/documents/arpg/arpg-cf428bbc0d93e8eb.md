# 107_任务NPC悬赏板训练教官_主线支线日常教程内容

> 目标：补齐主城中的任务推进、悬赏循环、教程引导和训练测试内容，让主城有长期可回访价值。

---

## 1. 任务 NPC 类型

| NPC / 物件 | 功能 | 开放时机 |
|---|---|---|
| 主线 NPC：营地长·维恩 | 主线任务、章节推进 | 默认 |
| 悬赏书记·格兰 | 日常悬赏、周常悬赏、怪物讨伐 | 第 1 章末 |
| 训练教官·罗恩 | 木桩测试、战斗教学、技能试用 | 默认 |
| 试炼看守·奥尔森 | 职业试炼、专精点挑战 | 第 2 章 |
| 公告板 | 活动、刷新任务、世界提示 | 默认 |

---

## 2. 主线 NPC：营地长·维恩

### 2.1 功能

```text
营地长 UI
├── 主线任务
├── 当前目标
├── 剧情回顾
├── 章节奖励
└── 下一步传送入口
```

### 2.2 第 1 章主线任务示例

| 任务 ID | 名称 | 目标 | 奖励 | 解锁 |
|---|---|---|---|---|
| MQ_CH1_001 | 坠星之后 | 前往坠星海岸，击杀 10 个腐兽 | 初级武器箱 | 默认 |
| MQ_CH1_002 | 断桥求援 | 找到断桥哨兵并清理盗匪 | 技能解锁券 | MQ_CH1_001 |
| MQ_CH1_003 | 矿洞异响 | 进入裂石矿洞，调查黑炉残渣 | 分解材料包 | MQ_CH1_002 |
| MQ_CH1_004 | 黑炉深处 | 击败黑炉看守 | 第 1 章 Boss 宝箱 | MQ_CH1_003 |
| MQ_CH1_005 | 外环清剿 | 清理星陨营地外环据点 | 章节装备箱 | MQ_CH1_004 |

### 2.3 主线对话规则

主线 NPC 对话不能太长，UI 上最多显示 3 行摘要，详细剧情放“剧情回顾”。

```text
当前目标：
黑炉还在运转，矿洞里的东西正在变多。去裂石矿洞找到炉心入口。

按钮：
[查看任务] [传送到裂石矿洞] [领取奖励]
```

---

## 3. 悬赏板内容

悬赏板负责重复任务，给玩家每日目标。

```text
悬赏板 UI
├── 每日悬赏
├── 周常悬赏
├── 地图悬赏
├── Boss 悬赏
└── 已完成奖励
```

### 3.1 每日悬赏

| 悬赏 ID | 名称 | 目标 | 奖励 |
|---|---|---|---|
| BOUNTY_D_001 | 清理荒原 | 击杀任意野外怪 80 个 | 金币、魔尘 |
| BOUNTY_D_002 | 精英猎手 | 击杀精英怪 5 个 | 稀有精华碎片 |
| BOUNTY_D_003 | 宝箱搜寻 | 打开宝箱 8 个 | 随机材料包 |
| BOUNTY_D_004 | 元素镇压 | 击杀火/冰/雷任意元素怪 40 个 | 抗性药剂包 |
| BOUNTY_D_005 | 速战速决 | 10 分钟内完成任意副本 | 挑战币 |

### 3.2 周常悬赏

| 悬赏 ID | 名称 | 目标 | 奖励 |
|---|---|---|---|
| BOUNTY_W_001 | Boss 追猎 | 击败 5 个不同 Boss | 高阶装备箱 |
| BOUNTY_W_002 | 秘境巡行 | 完成 15 张终局地图 | 地图材料包 |
| BOUNTY_W_003 | 打造大师 | 强化装备 20 次 | 强化保护材料 |
| BOUNTY_W_004 | 多职业修行 | 使用 3 种不同标签技能击杀敌人 | 技能升级材料 |

### 3.3 悬赏刷新规则

| 类型 | 刷新 |
|---|---|
| 每日悬赏 | 每天 5 条，最多接 3 条 |
| 周常悬赏 | 每周 4 条，全部可接 |
| 手动刷新 | 每日 1 次免费，之后消耗金币 |
| 已完成未领取 | 不会被刷新覆盖 |

---

## 4. 训练教官内容

训练教官是 3C 和技能测试的关键。

```text
训练教官 UI
├── 基础训练
├── 技能测试
├── 木桩测试
├── 怪物模拟
├── Boss 招式练习
└── 战斗统计
```

### 4.1 基础训练项目

| 训练 ID | 名称 | 内容 | 奖励 |
|---|---|---|---|
| TRAIN_001 | 镜头移动 | 使用鼠标/摇杆调整镜头 | 金币 50 |
| TRAIN_002 | 锁定目标 | 锁定并切换 3 个目标 | 金币 50 |
| TRAIN_003 | 闪避训练 | 闪避 5 次范围攻击 | 初级药剂 |
| TRAIN_004 | 跳跃与落地 | 跳过障碍并攻击木桩 | 金币 80 |
| TRAIN_005 | 连段取消 | 使用普攻后接技能 | 技能经验 |
| TRAIN_006 | Boss 红圈预警 | 躲避 3 次 Boss 模拟攻击 | 挑战币 |

### 4.2 木桩类型

| 木桩 | 功能 |
|---|---|
| 普通木桩 | 测单体伤害 |
| 群怪木桩 | 测 AoE / 连锁 |
| 移动木桩 | 测投射物命中 |
| Boss 木桩 | 高血量、带韧性条 |
| 抗性木桩 | 火/冰/雷/毒抗性不同 |
| 召唤测试木桩 | 统计仆从伤害 |

### 4.3 战斗统计显示

```text
总伤害：1,250,000
测试时长：30 秒
DPS：41,666
最高单击：98,000
暴击率：34%
异常覆盖：燃烧 72%，感电 45%
伤害构成：物理 20%，火焰 60%，持续 20%
技能占比：火星弹 55%，炎爆圈 35%，其他 10%
```

---

## 5. 试炼看守内容

试炼看守负责职业专精挑战。

| 试炼 ID | 名称 | 等级 | 目标 | 奖励 |
|---|---|---:|---|---|
| TRIAL_001 | 初阶试炼 | 22 | 完成 3 个房间挑战 | 专精点 1 |
| TRIAL_002 | 进阶试炼 | 35 | 完成 5 个房间 + Boss | 专精点 2 |
| TRIAL_003 | 高阶试炼 | 50 | 限时通关 + 双 Boss | 专精点 3 |
| TRIAL_004 | 终局试炼 | 70 | 高难机制挑战 | 专精点 4 |

### 5.1 试炼房间类型

| 房间 | 玩法 |
|---|---|
| 击杀房 | 击败全部敌人 |
| 生存房 | 存活 90 秒 |
| 陷阱房 | 穿过机关通道 |
| 精英房 | 击败带词缀精英 |
| 选择房 | 选择奖励或难度 |
| Boss 房 | 试炼 Boss |

---

## 6. 公告板内容

公告板是低成本信息入口。

```text
公告板 UI
├── 当前活动
├── 主城提示
├── 系统教学
├── 副本推荐
└── 最近更新，可选
```

### 6.1 公告示例

| 类型 | 标题 | 内容 |
|---|---|---|
| 教学 | 装备分解 | 多余装备可以在铁匠处分解成材料 |
| 教学 | 技能辅助 | 技能可以装入辅助模块改变行为 |
| 推荐 | 今日材料副本 | 今日推荐：魔尘回廊，适合强化装备 |
| 活动 | 悬赏加成 | 今日完成悬赏获得额外金币 |

---

## 7. 任务 UI 结构

```text
UI_QuestPanel
├── Left_QuestCategory
│   ├── 主线
│   ├── 支线
│   ├── 悬赏
│   ├── 试炼
│   └── 终局
├── Center_QuestList
├── Right_QuestDetail
│   ├── 任务名称
│   ├── 任务描述
│   ├── 目标列表
│   ├── 奖励预览
│   ├── 追踪按钮
│   └── 放弃按钮，可选
└── Footer_QuickTeleport
```

---

## 8. Prefab 结构

```text
PF_NPC_MainQuest
├── NPCInteractionController
├── QuestGiverComponent
├── DialogueComponent
└── WorldHUDAnchor
```

```text
PF_BountyBoard
├── StaticMesh_Board
├── Collider_Interact
├── BountyBoardController
├── QuestServiceComponent
├── RefreshTimerComponent
└── WorldHUDAnchor
```

```text
PF_NPC_Trainer
├── NPCInteractionController
├── TrainingServiceComponent
├── DummySpawnController
├── CombatStatRecorder
└── WorldHUDAnchor
```

---

## 9. 数据表

### 9.1 QuestTable

| 字段 | 类型 | 说明 |
|---|---|---|
| questId | string | 任务 ID |
| questType | enum | 主线/支线/悬赏/试炼/终局 |
| displayName | string | 名称 |
| giverNpcId | string | 发布 NPC |
| objectives | string[] | 目标 |
| rewardId | string | 奖励 |
| unlockCondition | string | 解锁条件 |
| nextQuestId | string | 后续任务 |
| allowAbandon | bool | 是否可放弃 |

### 9.2 BountyTable

| 字段 | 类型 | 说明 |
|---|---|---|
| bountyId | string | 悬赏 ID |
| bountyType | enum | 每日/周常/地图/Boss |
| targetType | enum | 击杀/完成副本/打开宝箱/强化 |
| targetCount | int | 目标数量 |
| rewardPool | string | 奖励池 |
| weight | int | 刷新权重 |
| minLevel | int | 最低等级 |
| maxLevel | int | 最高等级 |

---

## 10. 验收标准

| 项目 | 标准 |
|---|---|
| 主线 NPC | 能接、追踪、完成任务 |
| 悬赏板 | 每日刷新 5 条，能接 3 条 |
| 训练教官 | 能生成木桩并显示 DPS |
| 试炼入口 | 能显示未解锁条件 |
| 公告板 | 能显示推荐副本和教学提示 |
| 数据化 | 任务和悬赏均来自表 |

---

## 11. 当前 Unity 实现映射

本轮已将 107 的主城任务、悬赏、训练和公告内容接入实际运行时。

| 模块 | Unity 实现 |
|---|---|
| 任务数据表 | `Assets/_Game/Resources/GameData/quests.json` 已补第 1 章主线、铁匠支线、初阶试炼和终局地图任务线 |
| 悬赏数据表 | `Assets/_Game/Resources/GameData/bounties.json` 已补每日悬赏、周常悬赏和地图悬赏 |
| 训练数据表 | `Assets/_Game/Resources/GameData/training_courses.json` 已补基础训练、技能测试、Boss 练习和多种木桩测试 |
| 公告数据表 | `Assets/_Game/Resources/GameData/notices.json` 已补教学、推荐、活动、终局提示 |
| 配置加载 | `GameDataTypes.cs` / `ConfigManager.cs` 已新增 Quest、Bounty、TrainingCourse、NoticeBoard 表结构和查询接口 |
| 任务运行时 | `QuestRuntime.cs` 提供接受、追踪、推进、完成、领奖、每日/周常悬赏刷新和事件推进 |
| 事件接入 | `QuestEventBridge` 已挂到 `ArpgThirdBatchUIRoot`，监听击杀和地图完成事件 |
| 训练运行时 | `TrainingRuntimeService` 能生成测试木桩，`TrainingStatRecorder` 记录总伤害、DPS、最高单击和命中次数 |
| UI | `ArpgQuestBoardWindow.cs` 提供主线、支线、悬赏、训练、试炼、终局、公告七类页面 |
| NPC 接入 | `npcs.json` / `npc_spawns.json` 已补悬赏书记·格兰、试炼看守·奥尔森、营地公告板，并优化训练教官入口 |
| 服务路由 | `ArpgNpcDialogWindow.cs` 已将 MainQuest、BountyBoard、Training、NoticeBoard 路由到任务训练窗口 |
