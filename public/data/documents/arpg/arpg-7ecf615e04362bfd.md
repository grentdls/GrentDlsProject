# 104_副本传送内容_章节地图_材料副本_Boss回战_终局入口

> NPC：门径引路人·卡瑟  
> 位置：星陨营地中央广场传送石碑旁  
> 目标：负责主城到所有副本的入口，包括章节地图、材料副本、挑战副本、Boss 回战和终局前置入口。

---

## 1. 副本传送师功能总览

```text
副本传送 UI
├── 章节地图
├── 材料副本
├── 挑战副本
├── Boss 回战
├── 职业试炼
├── 组队 / 匹配，后期
└── 终局入口提示
```

副本传送师和普通地图传送不同：

| 类型 | 入口 | 说明 |
|---|---|---|
| 章节地图 | 副本传送师 | 主线推进 |
| 材料副本 | 副本传送师 | 固定奖励，有限次数 |
| Boss 回战 | 副本传送师 | 重复挑战已击败 Boss |
| 职业试炼 | 试炼 NPC / 副本传送师入口 | 专精点获取 |
| 终局地图 | 秘境装置 | 通关后开放，不归副本传送师主控 |

---

## 2. 副本传送 UI 结构

```text
UI_DungeonTeleportPanel
├── Header
│   ├── Title: 副本传送
│   ├── CurrentChapter
│   └── CloseButton
├── Left_CategoryTabs
│   ├── 章节地图
│   ├── 材料副本
│   ├── 挑战副本
│   ├── Boss 回战
│   └── 职业试炼
├── Center_DungeonList
│   └── DungeonCard × N
├── Right_DungeonDetail
│   ├── PreviewImage
│   ├── DungeonName
│   ├── RecommendedLevel
│   ├── MonsterTags
│   ├── RewardPreview
│   ├── EntryCost
│   ├── UnlockCondition
│   ├── DifficultySelector
│   └── EnterButton
└── Footer
    ├── 今日剩余次数
    ├── 当前队伍状态
    └── 快速返回主城说明
```

---

## 3. 章节地图清单

### 3.1 第 1 章：星陨海岸线

| 副本 ID | 名称 | 等级 | 类型 | 入口条件 | 主要怪物 | 首通奖励 |
|---|---|---:|---|---|---|---|
| DUN_CH1_001 | 坠星海岸 | 1 | 教学野外 | 默认 | 海滩腐兽、拾荒者 | 初级武器箱 |
| DUN_CH1_002 | 断桥荒原 | 4 | 野外 | 完成坠星海岸 | 流亡盗匪、荒原狼 | 技能解锁券 |
| DUN_CH1_003 | 裂石矿洞 | 7 | 地牢 | 完成断桥荒原 | 矿洞虫、碎石傀儡 | 分解功能强化材料 |
| DUN_CH1_004 | 黑炉深井 | 10 | Boss 地牢 | 完成裂石矿洞 | 炉渣兵、黑炉守卫 | 第 1 章 Boss 宝箱 |
| DUN_CH1_005 | 星陨营地外环 | 12 | 据点 | 击败黑炉 Boss | 盗匪据点、精英哨兵 | 章节装备箱 |

### 3.2 第 2 章：腐林与旧王道

| 副本 ID | 名称 | 等级 | 类型 | 入口条件 | 主要怪物 | 首通奖励 |
|---|---|---:|---|---|---|---|
| DUN_CH2_001 | 腐根森林 | 14 | 野外 | 第 1 章完成 | 腐化树灵、毒虫 | 抗毒药剂配方 |
| DUN_CH2_002 | 旧王驿道 | 16 | 线性战斗区 | 完成腐根森林 | 亡兵、骑枪残影 | 坐骑/疾跑教学，可选 |
| DUN_CH2_003 | 荆棘墓园 | 18 | 地牢 | 完成旧王驿道 | 骸骨弓手、墓园女巫 | 符石匠解锁 |
| DUN_CH2_004 | 古树心腔 | 21 | Boss 地牢 | 完成荆棘墓园 | 树心寄生体 | 第 2 章 Boss 宝箱 |
| DUN_CH2_005 | 试炼回廊 | 22 | 职业试炼 | 击败古树心腔 Boss | 试炼幻影 | 专精点 1 |

### 3.3 第 3 章：盐风城废墟

| 副本 ID | 名称 | 等级 | 类型 | 入口条件 | 主要怪物 | 首通奖励 |
|---|---|---:|---|---|---|---|
| DUN_CH3_001 | 破潮码头 | 24 | 野外/据点 | 第 2 章完成 | 海盗、潮汐怪 | 高阶技能券 |
| DUN_CH3_002 | 盐骨下水道 | 26 | 地牢 | 完成破潮码头 | 鼠群、毒泥怪 | 药剂升级材料 |
| DUN_CH3_003 | 旧市集 | 28 | 开放据点 | 完成下水道 | 商会傀儡、雇佣兵 | 商人刷新券 |
| DUN_CH3_004 | 灯塔裂隙 | 31 | Boss 区 | 完成旧市集 | 裂隙幽影 | Boss 回战开放 |
| DUN_CH3_005 | 海雾竞技场 | 32 | 挑战副本 | 击败灯塔 Boss | 连续波次敌人 | 挑战币 |

### 3.4 第 4 章：灰烬边境

| 副本 ID | 名称 | 等级 | 类型 | 入口条件 | 主要怪物 | 首通奖励 |
|---|---|---:|---|---|---|---|
| DUN_CH4_001 | 灰烬边境 | 34 | 野外 | 第 3 章完成 | 灰烬兽、火裔兵 | 火抗符石 |
| DUN_CH4_002 | 焚骨营寨 | 36 | 据点 | 完成灰烬边境 | 火焰盗团 | 稀有装备箱 |
| DUN_CH4_003 | 熔岩裂沟 | 38 | 地牢 | 完成营寨 | 岩浆虫、火元素 | 高阶强化材料 |
| DUN_CH4_004 | 赤炉王座 | 41 | Boss | 完成裂沟 | 赤炉王 | 终局前置碎片 |
| DUN_CH4_005 | 灰门前庭 | 42 | 终局前置 | 击败赤炉王 | 混合怪群 | 秘境装置解锁 |

### 3.5 第 5 章：星门残域

| 副本 ID | 名称 | 等级 | 类型 | 入口条件 | 主要怪物 | 首通奖励 |
|---|---|---:|---|---|---|---|
| DUN_CH5_001 | 星门残域 | 44 | 终章野外 | 第 4 章完成 | 星界兽、虚空兵 | 地图钥石 I |
| DUN_CH5_002 | 失重长廊 | 46 | 特殊地形 | 完成残域 | 漂浮魔像 | 移动技能强化 |
| DUN_CH5_003 | 断界档案馆 | 48 | 地牢 | 完成长廊 | 书灵、星术师 | 终局地图仓库 |
| DUN_CH5_004 | 星核祭坛 | 50 | 最终 Boss | 完成档案馆 | 星核化身 | 通关奖励 |
| DUN_CH5_005 | 秘境门厅 | 50+ | 终局入口 | 通关 | 终局教学敌人 | 秘境地图系统 |

---

## 4. 材料副本清单

材料副本每天有限次数，目的是让玩家定向获取材料。

| 副本 ID | 名称 | 等级 | 奖励 | 每日次数 | 解锁 |
|---|---|---:|---|---:|---|
| MAT_001 | 铁屑矿仓 | 8 | 粗铁碎片、硬化钢片 | 3 | 第 1 章矿洞完成 |
| MAT_002 | 魔尘回廊 | 12 | 魔尘、低阶精华 | 3 | 等级 12 |
| MAT_003 | 药草温室 | 14 | 药草、药剂瓶、抗性药材 | 2 | 药剂商任务 |
| MAT_004 | 兽皮猎场 | 16 | 皮革、兽筋、弓类材料 | 3 | 第 2 章 |
| MAT_005 | 符石碎厅 | 20 | 符石碎片、孔位材料 | 2 | 符石匠解锁 |
| MAT_006 | 精华熔炉 | 28 | 稀有精华、高阶魔尘 | 2 | 第 3 章 Boss |
| MAT_007 | 星界残片场 | 45 | 地图钥石碎片、星尘 | 1 | 第 5 章 |

### 4.1 材料副本规则

1. 有每日次数，不可无限刷破坏经济
2. 首通奖励高于重复奖励
3. 可消耗副本券追加次数
4. 失败不扣次数，进入后击杀首个精英才扣次数
5. 难度越高，材料种类越集中，数量越多

---

## 5. 挑战副本清单

挑战副本是战斗玩法测试场，奖励更偏装备和荣誉。

| 副本 ID | 名称 | 等级 | 玩法 | 奖励 |
|---|---|---:|---|---|
| CHALL_001 | 海雾竞技场 | 32 | 10 波怪物 | 挑战币、随机装备 |
| CHALL_002 | 灰烬试炼场 | 38 | 限时击杀 | 火系材料、称号进度 |
| CHALL_003 | 断桥守卫战 | 25 | 保护目标 | 防御装备、金币 |
| CHALL_004 | 暗影追猎 | 30 | 追杀移动 Boss | 移动技能材料 |
| CHALL_005 | 星门裂隙 | 48 | 高压精英连战 | 终局地图钥石 |

### 5.1 挑战副本评分

| 评分项 | 权重 |
|---|---:|
| 通关时间 | 40% |
| 死亡次数 | 25% |
| 连击/不断战斗 | 15% |
| 目标完成度 | 20% |

评分：C / B / A / S / SS。  
SS 追加稀有箱子。

---

## 6. Boss 回战清单

Boss 回战只显示已击败 Boss。

| Boss ID | 名称 | 等级 | 原地图 | 回战奖励 | 解锁 |
|---|---|---:|---|---|---|
| BOSS_001 | 黑炉看守 | 10+ | 黑炉深井 | 武器箱、强化材料 | 击败一次 |
| BOSS_002 | 古树心核 | 21+ | 古树心腔 | 自然符石、抗毒药 | 击败一次 |
| BOSS_003 | 灯塔裂隙主 | 31+ | 灯塔裂隙 | 技能升级材料 | 击败一次 |
| BOSS_004 | 赤炉王 | 41+ | 赤炉王座 | 高阶火系装备 | 击败一次 |
| BOSS_005 | 星核化身 | 50+ | 星核祭坛 | 终局钥石、传奇残片 | 通关 |

### 6.1 Boss 回战难度

| 难度 | 等级修正 | 奖励倍率 | 新机制 |
|---|---:|---:|---|
| 普通 | +0 | 1.0 | 原版机制 |
| 强化 | +5 | 1.4 | 多一个精英词缀 |
| 噩梦 | +10 | 2.0 | 新阶段 / 新技能 |
| 深渊 | +15 | 3.0 | 限时 + 双词缀，后期 |

---

## 7. 副本进入消耗

| 副本类型 | 进入消耗 |
|---|---|
| 主线章节 | 免费 |
| 材料副本 | 每日次数 / 副本券 |
| 挑战副本 | 挑战券 / 金币 |
| Boss 回战 | 回战印记 / 金币 |
| 职业试炼 | 试炼钥匙，首通免费 |
| 终局地图 | 地图钥石，在秘境装置进入 |

---

## 8. 副本卡片显示规则

每个副本卡片显示：

```text
[副本预览图]
副本名称
推荐等级：Lv. 20
怪物标签：亡灵 / 毒 / 远程
奖励预览：符石碎片、稀有装备、金币
今日次数：2 / 3
状态：可进入 / 未解锁 / 已完成首通
```

### 8.1 卡片状态

| 状态 | 显示 |
|---|---|
| 可进入 | 正常亮色 |
| 未解锁 | 灰色 + 锁图标 + 解锁条件 |
| 次数耗尽 | 灰色 + “今日次数已用完” |
| 等级过低 | 黄色提示，不强制禁止 |
| 首通未完成 | 角标“主线” |
| 已完成 | 角标“已首通” |

---

## 9. 副本传送 Prefab 结构

```text
PF_NPC_DungeonTeleporter
├── Model_TeleporterNPC
├── Animator
├── Collider_Interact
├── NPCInteractionController
├── DungeonTeleportService
├── WorldHUDAnchor
└── EnvironmentProps
    ├── PortalStone
    ├── FloatingMapFragments
    ├── ChapterGateVFX
    └── TeleportCircle
```

传送门开启时：

```text
Portal_Root
├── PortalVFX
├── DestinationNameText
├── InteractTrigger
├── PortalDestinationComponent
├── DifficultyInfoComponent
└── TimeoutComponent，可选
```

---

## 10. 副本数据表

### 10.1 DungeonTable

| 字段 | 类型 | 说明 |
|---|---|---|
| dungeonId | string | 副本 ID |
| displayName | string | 名称 |
| category | enum | 章节/材料/挑战/Boss/试炼/终局前置 |
| sceneName | string | Unity Scene 名 |
| recommendedLevel | int | 推荐等级 |
| unlockCondition | string | 解锁条件 |
| entryCost | string | 进入消耗 |
| dailyLimit | int | 每日限制，-1 为无限 |
| monsterTags | string[] | 怪物标签 |
| rewardPreview | string[] | 奖励预览 |
| firstClearReward | string | 首通奖励 |
| repeatRewardPool | string | 重复奖励池 |
| bossId | string | Boss 副本填写 |
| allowParty | bool | 是否支持组队 |
| allowReturnTown | bool | 是否允许回城 |

### 10.2 DungeonDifficultyTable

| 字段 | 类型 | 说明 |
|---|---|---|
| difficultyId | string | 难度 ID |
| dungeonId | string | 所属副本 |
| levelOffset | int | 等级修正 |
| monsterHpMultiplier | float | 怪物生命倍率 |
| monsterDamageMultiplier | float | 怪物伤害倍率 |
| rewardMultiplier | float | 奖励倍率 |
| extraAffixCount | int | 额外词缀数量 |
| unlockCondition | string | 解锁条件 |

---

## 11. 验收标准

| 项目 | 标准 |
|---|---|
| 章节地图 | 至少显示 5 章 25 张章节地图 |
| 材料副本 | 至少 7 个，支持每日次数 |
| 挑战副本 | 至少 5 个，支持评分 |
| Boss 回战 | 只显示已击败 Boss |
| 难度选择 | Boss 回战至少 3 个难度 |
| 解锁提示 | 未解锁副本显示明确条件 |
| 进入流程 | 选择副本 → 加载 → 进入地图 |
| 数据化 | 所有副本来自 DungeonTable |

---

## 12. 当前 Unity 实现映射

### 12.1 已接入数据

- 副本表：`Assets/_Game/Resources/GameData/dungeon_teleports.json`
- 难度表：`Assets/_Game/Resources/GameData/dungeon_difficulties.json`
- 数据模型：`Assets/_Game/Scripts/Data/GameDataTypes.cs`
- 数据加载：`Assets/_Game/Scripts/Data/ConfigManager.cs`

### 12.2 已实现功能

- 章节地图：已配置 5 章 25 个入口。
- 材料副本：已配置 7 个入口，支持每日次数显示和扣减。
- 挑战副本：已配置 5 个入口，支持金币进入消耗。
- Boss 回战：已配置 5 个 Boss，解锁条件读取已击败 Boss 记录。
- Boss 难度：已配置普通、强化、噩梦；最终 Boss 额外配置深渊。
- 终局入口：通关后显示秘境入口，并可跳转 `MapDevice`。
- UI：新增 `ArpgDungeonTeleportWindow`，已在 `ArpgThirdBatchUIRoot` 注册。
- NPC 路由：`ArpgNpcDialogWindow` 已将 `DungeonTravel`、`BossReplay`、`ChallengeDungeon`、`Trial` 路由到副本传送窗口。

### 12.3 运行时说明

- 若目标 `SceneName` 已在 Build Settings 中存在，点击进入会加载场景。
- 若场景暂未加入 Build Settings，窗口会记录进入请求并把玩家移动到原型入口点，避免原型阶段中断流程。
- Boss 回战使用 `PlacedObjectRuntimeStateStore.KilledBosses` 判断是否已击败。
