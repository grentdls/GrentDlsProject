# 地图地形结构与场景交互系统设计文档

> 项目类型：2D 俯视角开放世界轻 ARPG  
> 当前章节：地图中的地形结构、交互物、阻挡物与探索规则  
> 前置章节：人物基础操作系统、战斗系统详细设计  
> 目标：定义开放世界地图的地形结构、区域组织、可交互物、阻挡物、能力门槛、地图层级、碰撞规则、刷新规则、Unity 实现结构与验收标准。

---

## 1. 设计目标

地图系统不是单纯“画一张大图”，它承担 5 个核心作用：

```text
1. 给玩家持续提供目标
2. 用地形引导路线
3. 用阻挡物制造期待
4. 用交互物提供奖励和节奏
5. 用区域等级控制成长路径
```

本项目的地图体验目标是：

```text
玩家在大地图上移动 10 秒内，至少能看到一个可关注目标；
玩家在 30 秒内，至少能触发一次战斗、交互、拾取或探索奖励；
玩家在 3 分钟内，至少完成一个小目标：开宝箱、进洞穴、接任务、打精英怪、发现新区域。
```

地图设计关键词：

```text
高密度
低迷路
强可读
轻开放
有回访
有阻挡
有奖励
```

---

## 2. 地图整体结构

### 2.1 地图类型

游戏内地图分为 5 类：

| 地图类型 | 说明 | 是否战斗 | 是否可传送 |
|---|---|---:|---:|
| WorldMap 大世界地图 | 主要探索空间 | 是 | 是 |
| Town 城镇 | NPC、商店、任务集中地 | 通常否 | 是 |
| Dungeon 洞穴 / 副本 | 小型战斗空间 | 是 | 否或入口传送 |
| BossArena Boss 区域 | Boss 战专用空间 | 是 | 否 |
| Interior 室内空间 | 商店、特殊建筑、剧情空间 | 通常否 | 否 |

### 2.2 世界地图组织方式

推荐采用 **区域拼接式开放世界**：

```text
中心新手草原
→ 东部森林
→ 南部沙漠
→ 西部沼泽
→ 北部雪原
→ 火山区域
→ 海岛区域
→ 最终黑暗区域
```

每个区域拥有：

```text
区域等级
主色调
地形主题
敌人主题
城镇 / 营地
洞穴数量
任务线
野外 Boss
封锁点
可回访目标
```

### 2.3 区域等级规划

| 区域 | 等级范围 | 地形主题 | 主要功能 |
|---|---:|---|---|
| 新手草原 | Lv1~5 | 草地、浅坡、小河 | 教学、基础战斗 |
| 绿林区域 | Lv5~15 | 树林、藤蔓、林间小路 | 引入支线和洞穴 |
| 沙漠区域 | Lv15~25 | 沙地、遗迹、流沙 | 引入地形危险 |
| 沼泽区域 | Lv25~35 | 毒沼、木桥、湿地 | 引入持续伤害地形 |
| 雪原区域 | Lv35~50 | 冰面、雪堆、冻结湖 | 引入滑行 / 减速 |
| 火山区域 | Lv50~65 | 岩浆、熔岩桥、火山口 | 高伤害环境 |
| 海岛区域 | Lv65~80 | 海水、岛屿、码头 | 需要水上移动 / 船 |
| 暗影区域 | Lv80+ | 黑雾、裂隙、封印门 | 终局挑战 |

---

## 3. 地图层级结构

### 3.1 视觉层级

2D 俯视角地图推荐分层：

```text
Background_Base      地图基础底色
Terrain_Base         草地、沙地、雪地等主地形
Terrain_Detail       石头纹理、小草、裂缝等装饰
Road                 道路、桥面、路径
Water_Lava           水体、岩浆、毒沼
GroundVFX            水波、岩浆泡、毒雾
Obstacle_Back        大树背后部分、建筑背后部分
Interactable         宝箱、NPC、机关、采集物
Character            玩家、敌人
Obstacle_Front       树冠、建筑前景、遮挡装饰
WorldUI              NPC 头顶标记、任务图标
ScreenUI             HUD、按钮、地图
```

### 3.2 Unity Tilemap 推荐结构

```text
Grid_WorldMap
├── Tilemap_Ground_Base
├── Tilemap_Ground_Detail
├── Tilemap_Road
├── Tilemap_Water
├── Tilemap_Hazard
├── Tilemap_Blocker
├── Tilemap_Cliff
├── Tilemap_Decoration_Back
├── Tilemap_Decoration_Front
├── Tilemap_Interaction_Marker
└── Tilemap_Debug
```

说明：

- `Ground_Base`：决定区域视觉基底。
- `Road`：主要引导玩家走向。
- `Water / Hazard`：特殊地形。
- `Blocker`：硬碰撞阻挡。
- `Cliff`：悬崖、山体等视觉和碰撞组合。
- `Interaction_Marker`：策划布点使用，正式版可以隐藏。
- `Debug`：用于显示刷怪区、触发区、阻挡区、等级区。

### 3.3 对象层级

除了 Tilemap，地图中还需要大量 GameObject：

```text
MapObjects/
├── NPC/
├── Chests/
├── Entrances/
├── Portals/
├── Shops/
├── Signs/
├── Breakables/
├── Collectibles/
├── Switches/
├── Doors/
├── QuestItems/
├── Shrines/
├── SavePoints/
├── EnemySpawners/
├── BossTriggers/
├── RegionTriggers/
└── Blockers/
```

---

## 4. 地形类型设计

### 4.1 地形总分类

| 地形类型 | 是否可走 | 是否影响移动 | 是否可战斗 | 说明 |
|---|---:|---:|---:|---|
| Grass 草地 | 是 | 否 | 是 | 默认地形 |
| Road 道路 | 是 | 可加速，可选 | 是 | 引导路线 |
| Dirt 土地 | 是 | 否 | 是 | 草原 / 洞穴过渡 |
| Sand 沙地 | 是 | 可轻微减速 | 是 | 沙漠区域 |
| Snow 雪地 | 是 | 可轻微减速 | 是 | 雪原区域 |
| Ice 冰面 | 是 | 可滑行 | 是 | 高级特殊地形 |
| ShallowWater 浅水 | 是 | 减速 | 是 | 低风险水域 |
| DeepWater 深水 | 否，需能力 | 否 | 否 | 能力门槛 |
| PoisonSwamp 毒沼 | 是 | 减速 + 持续伤害 | 是 | 危险地形 |
| Lava 岩浆 | 否或可短暂通过 | 高伤害 | 通常否 | 高级危险 |
| Cliff 悬崖 | 否 | 阻挡 | 否 | 硬阻挡 |
| Mountain 山体 | 否 | 阻挡 | 否 | 区域边界 |
| ForestDense 密林 | 否或半阻挡 | 阻挡 | 否 | 视觉封锁 |
| Bridge 桥 | 是 | 否 | 是 | 连接区域 |
| MagicFog 魔法雾 | 否，需剧情解除 | 阻挡 | 否 | 主线门槛 |

### 4.2 地形移动参数

| 地形 | MoveSpeedMultiplier | 是否播放特殊脚步 | 是否有持续效果 |
|---|---:|---:|---:|
| Grass | 1.0 | 是 | 否 |
| Road | 1.05 | 是 | 否 |
| Dirt | 1.0 | 是 | 否 |
| Sand | 0.9 | 是 | 否 |
| Snow | 0.9 | 是 | 否 |
| Ice | 1.0 | 是 | 滑行 |
| ShallowWater | 0.75 | 是 | 否 |
| PoisonSwamp | 0.75 | 是 | 中毒 / 持续伤害 |
| Lava | 0.6 | 是 | 高额火伤 |
| DeepWater | 0 | 否 | 阻挡 |
| Cliff | 0 | 否 | 阻挡 |

### 4.3 普通可行走地形

普通地形包括：

```text
草地
道路
泥地
石路
木桥
普通城镇地面
普通洞穴地面
```

设计规则：

```text
不影响移动速度
不造成伤害
支持战斗
支持掉落物
支持怪物刷新
支持交互物放置
```

### 4.4 减速地形

减速地形包括：

```text
浅水
沙地
雪地
毒沼
泥潭
厚草丛
```

规则：

```text
玩家进入区域后，移动速度乘以地形倍率
翻滚距离可保持不变，也可轻微降低
敌人是否受影响由敌人配置决定
```

推荐：

```text
普通浅水：玩家移速 75%，敌人也受影响
沙地：玩家移速 90%，敌人不一定受影响
毒沼：玩家移速 75%，并受到毒伤
雪地：玩家移速 90%，脚步特效变雪尘
```

### 4.5 危险地形

危险地形包括：

```text
毒沼
岩浆
闪电区域
黑暗裂隙
尖刺地面
```

危险地形触发流程：

```text
玩家进入危险区域
→ 显示危险地形 UI / 特效
→ 按 TickInterval 造成伤害或附加状态
→ 玩家离开区域
→ 停止结算，部分状态保留
```

推荐参数：

| 地形 | TickInterval | 伤害 | 附加状态 |
|---|---:|---|---|
| 毒沼 | 1.0s | MaxHP 2% 或固定毒伤 | Poison |
| 岩浆 | 0.5s | MaxHP 5% 或固定火伤 | Burn |
| 尖刺 | 立即 / 1s | 固定物理伤害 | 无 |
| 黑雾 | 1.0s | MaxHP 3% | DarkCurse |
| 雷区 | 1.5s | 雷伤 | Shock |

危险地形必须有明显视觉提示：

```text
毒沼：绿色泡泡、毒雾
岩浆：红橙发光、熔岩泡
尖刺：明显尖刺或地板裂缝
黑雾：紫黑雾边界
雷区：地面电弧
```

### 4.6 能力解锁地形

能力解锁地形是开放世界回访的重要手段。

| 地形 / 阻挡 | 初期状态 | 解锁能力 | 解锁后 |
|---|---|---|---|
| 深水 | 不可进入 | 水上移动 / 船 | 可以通过 |
| 高山裂隙 | 不可通过 | 飞跃 / 飞行 | 可以越过 |
| 魔法藤蔓 | 阻挡道路 | 火焰能力 | 可烧毁 |
| 冰墙 | 阻挡道路 | 火焰技能 / 主线道具 | 可融化 |
| 黑雾 | 阻挡区域 | 净化能力 | 区域开放 |
| 封印门 | 锁住洞穴 / Boss | 钥匙 / 主线进度 | 可进入 |
| 重石门 | 阻挡遗迹 | 力量能力 | 可推开 |
| 风暴区 | 无法通过 | 飞行强化 | 可穿过 |

设计原则：

```text
玩家要能提前看到被阻挡的奖励或区域
阻挡物旁边要有清楚视觉语言
解锁后回到旧区域要有明确收益
每种能力至少对应 5~10 个回访点
```

---

## 5. 道路与引导结构

### 5.1 主路

主路负责引导主线流程。

设计规则：

```text
主路宽度足够，至少容纳玩家和 2~3 个敌人战斗
主路连接城镇、任务点、洞穴入口
主路上布置低风险战斗
主路边缘放置支线目标和宝箱
```

### 5.2 支路

支路负责探索奖励。

支路可通向：

```text
隐藏宝箱
小型洞穴
精英怪
采集物
任务 NPC
风景点
能力门槛阻挡物
```

支路设计规则：

```text
入口要能被玩家看见
路线不要过长
尽头必须有奖励或信息
支路可绕回主路，减少折返疲劳
```

### 5.3 环形路线

优秀大地图尽量多做环形结构：

```text
主路 A → 支路 → 宝箱 → 小洞穴 → 回到主路 B
```

好处：

```text
玩家不容易迷路
探索后不用原路返回
地图显得更自然
```

### 5.4 视线引导

通过以下元素引导玩家：

```text
道路颜色
桥
灯光
建筑轮廓
任务标记
宝箱闪光
洞穴入口光效
敌人分布
高地 / 山口
地名文字
远处可见的大目标
```

---

## 6. 阻挡物系统

### 6.1 阻挡物分类

| 类型 | 说明 |
|---|---|
| HardBlocker 硬阻挡 | 永久不可通过，如山、悬崖、建筑墙 |
| SoftBlocker 软阻挡 | 可解锁，如藤蔓、冰墙、封印门 |
| DynamicBlocker 动态阻挡 | 会开关，如门、机关桥、战斗封锁 |
| DamageBlocker 伤害阻挡 | 可以走但会受伤，如岩浆、毒沼 |
| VisualBlocker 视觉阻挡 | 遮挡视线但不一定挡路，如树冠 |
| LevelBlocker 数值阻挡 | 高等级怪物形成软门槛 |
| QuestBlocker 任务阻挡 | 需要任务进度 |
| AbilityBlocker 能力阻挡 | 需要移动能力或特殊能力 |

### 6.2 硬阻挡

硬阻挡包括：

```text
山体
悬崖
建筑墙
大树干
深坑
地图边界
不可进入海域
```

规则：

```text
始终不可通过
不显示交互按钮
碰撞边界要圆润，避免卡角色
视觉上必须看起来确实不能走
```

### 6.3 软阻挡

软阻挡是探索回访的核心。

| 阻挡物 | 解锁方式 | 反馈 |
|---|---|---|
| 藤蔓墙 | 获得火焰能力 | 烧毁动画 |
| 冰墙 | 火焰技能 / 主线道具 | 融化特效 |
| 木栅栏 | 攻击破坏 / 钥匙 | 破碎动画 |
| 石门 | 机关 / 力量能力 | 打开动画 |
| 魔法封印 | 主线任务 | 封印消散 |
| 黑雾 | 净化能力 | 黑雾退散 |
| 水域 | 水上移动 | 角色可进入水面 |
| 高台 | 飞跃 / 飞行 | 开放路径 |

软阻挡数据需要保存：

```text
是否已解锁
是否已破坏
触发者
关联任务
是否可重复
```

### 6.4 动态阻挡

动态阻挡包括：

```text
机关门
升降桥
战斗封锁墙
Boss 房门
临时剧情屏障
限时通道
```

动态阻挡流程：

```text
默认关闭 / 开启
→ 玩家触发机关 / 击败敌人 / 完成任务
→ 播放打开 / 关闭动画
→ 更新碰撞
→ 保存状态
```

### 6.5 战斗封锁

用于副本房间和 Boss 区域。

```text
玩家进入触发区
→ 关闭出口
→ 生成敌人
→ 击败所有敌人
→ 打开出口
```

规则：

```text
封锁边界必须明显
不能让玩家卡在封锁外侧
多人模式可选时，需要所有玩家进入后封锁
玩家死亡后封锁解除或重置
```

### 6.6 视觉阻挡

视觉阻挡用于增强场景层次。

例如：

```text
树冠
屋檐
高草
大岩石前景
洞穴入口上缘
```

规则：

```text
角色走到后方时，前景物可以半透明
半透明时间 0.1~0.2s
透明度降低到 40%~60%
离开后恢复
```

注意：  
不要让前景遮挡玩家、敌人红圈、任务物品、宝箱。

### 6.7 数值阻挡

不直接封路，而是用高等级怪限制玩家。

设计例子：

```text
Lv5 区域旁边放 Lv20 怪
玩家能过去，但会被高等级怪打回来
地图上显示红色等级数字提醒
```

规则：

```text
高等级怪附近必须有等级提示
不要在主线路径上过早放置过强怪
数值阻挡可以保护开放感，但不能让玩家无提示暴毙
```

---

## 7. 交互物系统

### 7.1 交互物总分类

| 类型 | 功能 |
|---|---|
| NPC | 对话、任务、商店 |
| Chest 宝箱 | 奖励 |
| DungeonEntrance 洞穴入口 | 进入副本 |
| TownBuilding 城镇建筑 | 商店、铁匠、旅店 |
| Shrine 神殿 | 学技能、恢复、传送 |
| Sign 告示牌 | 地图提示 |
| Portal 传送点 | 快速移动 |
| SavePoint 存档点 | 保存 / 复活点 |
| QuestItem 任务物品 | 任务推进 |
| Collectible 收集物 | 材料、隐藏物 |
| Breakable 可破坏物 | 木桶、箱子、石堆 |
| Switch 机关 | 开门、开桥 |
| Door 门 | 场景连接 / 阻挡 |
| ResourceNode 资源点 | 采集材料 |
| HiddenObject 隐藏物 | 探索奖励 |
| FishingPoint 钓鱼点，可选 | 小玩法 |
| Campfire 营火 | 恢复 / 存档 / 剧情 |

### 7.2 交互物基础字段

```text
InteractableID
InteractableType
DisplayName
MapID
Position
InteractionRadius
Priority
RequiredQuest
RequiredAbility
RequiredItem
IsRepeatable
RespawnTime
SaveState
VFX_Idle
VFX_Interact
SFX_Interact
UI_Icon
```

### 7.3 交互流程

```text
玩家进入交互半径
→ 交互物进入候选列表
→ 按优先级选最近 / 最重要对象
→ 显示交互按钮和对象提示
→ 玩家按下交互
→ 检查条件
→ 播放交互动画 / 音效 / 特效
→ 执行交互结果
→ 更新状态并保存
```

### 7.4 交互优先级

| 优先级 | 对象 |
|---:|---|
| 100 | 可完成任务 NPC |
| 90 | 主线任务 NPC |
| 80 | 任务物品 |
| 75 | 战斗中必要机关 |
| 70 | 宝箱 |
| 65 | 洞穴入口 |
| 60 | 传送点 |
| 55 | 商店建筑 |
| 50 | 普通任务 NPC |
| 40 | 可破坏物 |
| 30 | 告示牌 |
| 20 | 普通 NPC |
| 10 | 装饰交互物 |

### 7.5 交互提示 UI

交互提示需要包含：

```text
交互按钮
对象名称
对象图标
可交互状态
不可交互原因，可选
```

例子：

```text
[交互] 打开宝箱
[交互] 进入绿叶洞穴 Lv8
[交互] 与村长对话
[锁定] 需要火焰能力
[锁定] 需要古代钥匙
```

---

## 8. NPC 规则

### 8.1 NPC 类型

| 类型 | 功能 |
|---|---|
| MainQuestNPC | 主线任务 |
| SideQuestNPC | 支线任务 |
| ShopNPC | 商店 |
| BlacksmithNPC | 强化装备 |
| SkillNPC | 学习技能 |
| LoreNPC | 世界观对话 |
| HintNPC | 提示玩家 |
| FlavorNPC | 氛围 NPC |

### 8.2 NPC 状态

```text
NoQuest
QuestAvailable
QuestInProgress
QuestComplete
ShopAvailable
Locked
Hidden
```

### 8.3 NPC 头顶标记

| 状态 | 图标 |
|---|---|
| 有新任务 | 黄色感叹号 |
| 主线任务 | 金色感叹号 |
| 任务进行中 | 灰色省略号 |
| 可完成任务 | 黄色问号 |
| 商店 | 小袋子 / 店铺图标 |
| 技能 | 魔法书图标 |
| 铁匠 | 锤子图标 |

### 8.4 NPC 行为

MVP 阶段 NPC 可以站桩。  
正式版可加入：

```text
小范围走动
朝向玩家
播放待机动画
任务完成后移动到新位置
根据时间 / 剧情改变对话
```

### 8.5 NPC 碰撞

规则：

```text
NPC 可以阻挡玩家，也可以设置为轻碰撞
重要 NPC 不应挡住狭窄道路
城镇 NPC 周围至少保留 1.5 倍玩家宽度通行空间
```

---

## 9. 宝箱规则

### 9.1 宝箱类型

| 宝箱 | 奖励 | 是否重复 |
|---|---|---:|
| CommonChest 普通宝箱 | 金币、普通装备 | 否 |
| RareChest 稀有宝箱 | 稀有装备、技能材料 | 否 |
| DungeonChest 副本宝箱 | 副本奖励 | 否 |
| BossChest Boss 宝箱 | 固定高价值奖励 | 否 |
| HiddenChest 隐藏宝箱 | 稀有奖励 | 否 |
| RespawnChest 刷新宝箱 | 少量金币 / 材料 | 是 |
| MimicChest 宝箱怪 | 怪物伪装 | 可选 |

### 9.2 宝箱开启流程

```text
玩家靠近宝箱
→ 显示交互按钮
→ 按下交互
→ 播放开箱动画
→ 播放开箱音效
→ 生成奖励光效
→ 掉落奖励
→ 标记宝箱已开启
→ 保存状态
```

### 9.3 宝箱可读性

宝箱必须有：

```text
轮廓清楚
轻微闪光
未开启 / 已开启状态明显不同
稀有宝箱颜色更突出
隐藏宝箱可以弱化，但不能完全不可见
```

### 9.4 宝箱奖励规则

普通大世界宝箱：

```text
金币
少量经验
低 / 中品质装备
消耗品
```

洞穴宝箱：

```text
该洞穴等级对应装备
更高金币
少量材料
```

隐藏宝箱：

```text
稀有装备
特殊外观
技能升级材料
地图收集进度
```

Boss 宝箱：

```text
固定关键道具
高品质装备
大量金币
区域能力解锁物
```

### 9.5 宝箱状态保存

需要保存：

```text
ChestID
IsOpened
OpenTime
RewardGenerated
```

如果宝箱是可刷新：

```text
LastOpenTime
NextRespawnTime
```

---

## 10. 洞穴入口与场景连接

### 10.1 入口类型

| 类型 | 功能 |
|---|---|
| DungeonEntrance | 进入普通洞穴 |
| BossEntrance | 进入 Boss 区 |
| TownGate | 进入城镇 / 城内区域 |
| InteriorDoor | 进入室内 |
| PortalGate | 传送门 |
| HiddenEntrance | 隐藏入口 |

### 10.2 入口显示信息

玩家靠近入口时显示：

```text
洞穴名称
推荐等级
完成状态
宝箱完成度，可选
危险提示
进入按钮
```

例子：

```text
绿叶洞穴 Lv8
完成度：1/2 宝箱
[进入]
```

如果等级过低：

```text
绿叶洞穴 Lv20
危险：等级差距过大
[仍然进入]
```

建议不要硬禁止玩家进入高等级洞穴，让玩家自己选择，但要提示风险。

### 10.3 入口状态

| 状态 | 说明 |
|---|---|
| Locked | 锁定 |
| Available | 可进入 |
| Completed | 已完成 |
| New | 新发现 |
| Dangerous | 高等级危险 |
| Hidden | 隐藏，需发现 |
| Sealed | 主线封印，暂不可进入 |

### 10.4 场景切换流程

```text
玩家按下进入
→ 角色播放进入动画
→ 屏幕淡出
→ 保存当前地图位置
→ 加载目标场景
→ 玩家出现在入口点
→ 屏幕淡入
```

### 10.5 返回规则

从洞穴出来时：

```text
返回原入口外
角色朝向远离入口
短暂无敌 0.5s
避免刚出来被怪打
```

---

## 11. 机关系统

### 11.1 机关类型

| 机关 | 功能 |
|---|---|
| PressurePlate 踩踏板 | 玩家踩上触发 |
| Lever 拉杆 | 交互触发 |
| Crystal 水晶 | 攻击触发 |
| MagicSwitch 魔法开关 | 特定技能触发 |
| Torch 火把 | 火焰技能点燃 |
| Statue 雕像 | 按顺序激活 |
| PushStone 推石块 | 推到位置 |
| TimedSwitch 限时机关 | 限时开门 |
| MultiSwitch 多机关 | 多个条件同时满足 |

### 11.2 机关基础流程

```text
玩家触发机关
→ 检查条件
→ 播放机关动画
→ 播放机关音效
→ 改变目标对象状态
→ 保存机关状态
```

### 11.3 机关连接对象

机关可以控制：

```text
门
桥
传送点
宝箱
陷阱
地形
Boss 封印
隐藏道路
```

### 11.4 机关配置字段

```text
SwitchID
SwitchType
TriggerType
RequiredAbility
RequiredSkillElement
TargetObjectID
TriggerOnce
ResetTime
SaveState
VFX_On
VFX_Off
SFX_Trigger
```

### 11.5 机关谜题难度

本项目是轻 ARPG，不建议谜题过难。

MVP 谜题规则：

```text
单机关开单门
两个机关开一个宝箱
火焰技能点燃火把开路
击败敌人后打开门
```

正式版可扩展：

```text
机关顺序
限时机关
推箱子
多元素机关
隐藏机关
```

---

## 12. 可破坏物规则

### 12.1 可破坏物类型

| 类型 | 掉落 | 是否阻挡 |
|---|---|---:|
| 木桶 | 金币 / 材料 | 否 |
| 木箱 | 金币 / 消耗品 | 否 |
| 小石堆 | 材料 | 是 |
| 藤蔓 | 无 / 材料 | 是 |
| 冰晶 | 材料 | 是 |
| 陶罐 | 金币 | 否 |
| 旧栅栏 | 任务道路 | 是 |
| 矿石 | 强化材料 | 是或否 |

### 12.2 破坏流程

```text
玩家攻击命中
→ 可破坏物扣血
→ 播放受击特效
→ HP <= 0
→ 播放破碎动画
→ 掉落奖励
→ 关闭碰撞
→ 保存状态或等待刷新
```

### 12.3 破坏条件

可破坏物可以配置条件：

```text
普通攻击可破坏
指定元素可破坏
需要特定等级
需要特定任务
需要重击 / 炸弹
```

示例：

```text
藤蔓：火元素攻击可破坏
冰墙：火元素技能可破坏
石堆：重击技能可破坏
黑晶：主线道具可破坏
```

### 12.4 刷新规则

| 类型 | 是否刷新 |
|---|---:|
| 普通木桶 | 是，离开地图后刷新 |
| 普通陶罐 | 是 |
| 地图阻挡藤蔓 | 否 |
| 任务石堆 | 否 |
| 资源矿石 | 是，按时间刷新 |
| 隐藏道路阻挡 | 否 |

---

## 13. 采集物与资源点

### 13.1 资源类型

```text
草药
矿石
木材
魔法晶石
蘑菇
鱼点
遗迹碎片
元素核心
```

### 13.2 采集规则

```text
玩家靠近资源点
→ 显示采集按钮
→ 按下后播放采集动画
→ 经过采集时间
→ 获得资源
→ 资源点进入冷却 / 消失
```

### 13.3 采集参数

| 参数 | 推荐值 |
|---|---:|
| InteractionRadius | 1.0 |
| GatherTime | 0.5~1.5s |
| RespawnTime | 5~30 分钟，可按游戏需要 |
| RareDropChance | 5%~15% |

轻量 ARPG 不建议采集太重，采集主要作为：

```text
装备强化材料
支线任务物品
探索奖励
```

---

## 14. 隐藏物与探索奖励

### 14.1 隐藏物类型

| 类型 | 发现方式 |
|---|---|
| 隐藏宝箱 | 被树、石头、山体半遮挡 |
| 隐藏洞穴 | 入口不明显，需要靠近发现 |
| 隐藏道路 | 穿过草丛 / 树林 |
| 隐藏 NPC | 躲在角落 |
| 隐藏机关 | 攻击某个物体 |
| 隐藏任务物 | 靠近后发光 |
| 地图彩蛋 | 特殊摆放 / 对话 |

### 14.2 隐藏物设计原则

```text
隐藏但不能恶意
玩家应该能通过视觉线索发现
隐藏物附近要有微弱异常
比如：特殊草丛、光点、道路断裂、地面痕迹、NPC 提示
```

### 14.3 隐藏物奖励

隐藏物的奖励应该高于普通支路：

```text
稀有装备
大量金币
外观皮肤
技能升级材料
特殊称号
隐藏任务
地图完成度
```

---

## 15. 传送点与复活点

### 15.1 传送点类型

| 类型 | 说明 |
|---|---|
| TownPortal | 城镇传送点 |
| ShrinePortal | 神殿传送点 |
| DungeonReturn | 副本出口返回 |
| StoryPortal | 剧情传送 |
| TemporaryPortal | 临时传送门 |

### 15.2 传送点解锁规则

```text
玩家首次靠近传送点
→ 播放激活动画
→ 标记为已解锁
→ 之后可从地图界面传送
```

### 15.3 传送限制

可根据需要限制：

```text
战斗中不能传送
副本内不能传送
Boss 战不能传送
剧情状态不能传送
受击状态不能传送
```

### 15.4 复活点

复活点优先级：

```text
最近激活的城镇
最近激活的神殿
当前副本入口
主线指定检查点
```

玩家死亡后：

```text
返回复活点
恢复 50% HP 或满 HP
保留经验和装备
可扣少量金币，可选
```

MVP 不建议死亡惩罚太重。

---

## 16. 区域触发器

### 16.1 触发器类型

| 类型 | 功能 |
|---|---|
| RegionEnterTrigger | 进入区域 |
| RegionExitTrigger | 离开区域 |
| BattleTrigger | 触发战斗 |
| BossTrigger | 触发 Boss |
| QuestTrigger | 触发任务事件 |
| CutsceneTrigger | 触发剧情 |
| TutorialTrigger | 触发教学 |
| MusicTrigger | 切换音乐 |
| WeatherTrigger | 切换天气 |
| CameraTrigger | 调整镜头 |
| EnemySpawnTrigger | 生成敌人 |
| SecretRevealTrigger | 显示隐藏物 |

### 16.2 进入区域提示

玩家进入新区域时显示：

```text
区域名
推荐等级
危险等级
当前主线目标，可选
```

例子：

```text
进入：绿叶森林
推荐等级：Lv5~15
```

高等级区域：

```text
危险区域：熔岩峡谷
推荐等级：Lv50+
```

### 16.3 触发器保存规则

有些触发器只触发一次：

```text
首次进入区域
首次发现隐藏洞穴
主线剧情触发
宝箱开启
Boss 登场剧情
```

需要保存：

```text
TriggerID
HasTriggered
TriggerTime
```

---

## 17. 敌人布点与地形关系

### 17.1 敌人布点原则

```text
主路上放低压敌人
支路上放中压敌人
宝箱前放守护敌人
洞穴入口附近放主题敌人
高等级区域边缘放警告型强怪
Boss 区域前放一小段铺垫敌人
```

### 17.2 地形配合敌人

| 地形 | 适合敌人 |
|---|---|
| 草地 | 基础近战怪、史莱姆 |
| 森林 | 飞行怪、藤蔓怪、毒怪 |
| 沙漠 | 远程怪、钻地怪 |
| 沼泽 | 毒怪、减速怪 |
| 雪地 | 冰怪、冲撞怪 |
| 火山 | 火元素怪、爆炸怪 |
| 遗迹 | 法师怪、机关怪 |
| 海岛 | 水系怪、远程怪 |

### 17.3 战斗空间尺寸

普通小战斗空间：

```text
宽度至少 6~8 个角色身位
可容纳 3~5 个小怪
必须有翻滚空间
不要让红圈完全覆盖道路
```

精英怪空间：

```text
宽度至少 10 个角色身位
周围障碍物少
有绕圈空间
```

Boss 空间：

```text
清晰封闭
尺寸大
无过多小障碍
Boss 大招预警完整可见
```

---

## 18. 地图交互与任务系统关系

### 18.1 任务可控制的地图对象

任务可以控制：

```text
NPC 显示 / 隐藏
宝箱可开 / 不可开
洞穴入口开启 / 关闭
阻挡物消失
敌人刷新
Boss 解锁
传送点激活
区域黑雾消失
机关状态改变
任务物品出现
```

### 18.2 任务阶段改变地图

示例：

```text
Q001 接任务前：
村口被藤蔓挡住

Q001 完成后：
NPC 给玩家火焰能力

Q002 中：
玩家烧毁藤蔓

Q002 完成后：
森林区域开放
```

### 18.3 地图对象条件字段

所有关键地图对象都应支持条件：

```text
RequiredQuestState
RequiredPlayerLevel
RequiredAbility
RequiredItem
RequiredDungeonComplete
RequiredBossDefeated
RequiredRegionUnlocked
```

---

## 19. 地图状态保存

### 19.1 需要保存的地图状态

```text
已发现区域
已激活传送点
已开启宝箱
已破坏永久阻挡物
已完成洞穴
已击败 Boss
已触发剧情触发器
已拾取隐藏收集物
已解锁能力门槛
NPC 当前状态
机关当前状态
门当前状态
资源点刷新时间
```

### 19.2 不需要永久保存的状态

```text
普通小怪是否死亡
普通木桶是否破坏
普通掉落物是否存在
临时战斗封锁
普通地面特效
```

这些可以在重新进入地图时刷新。

### 19.3 地图存档结构

```text
MapSaveData
├── MapID
├── DiscoveredRegions
├── OpenedChests
├── ActivatedPortals
├── RemovedBlockers
├── TriggeredEvents
├── CompletedDungeons
├── DefeatedBosses
├── CollectedSecrets
├── SwitchStates
├── DoorStates
└── ResourceNodeTimers
```

---

## 20. 小地图与大地图规则

### 20.1 小地图显示内容

小地图显示：

```text
玩家位置
当前道路轮廓
附近 NPC
任务目标方向
洞穴入口
传送点
城镇
Boss / 精英怪，可选
```

不建议显示所有隐藏宝箱，避免探索感消失。

### 20.2 大地图显示内容

大地图显示：

```text
区域名称
区域等级
已发现城镇
已激活传送点
主线任务目标
支线任务目标
已发现洞穴
洞穴完成状态
Boss 位置
能力门槛标记
```

### 20.3 地图探索迷雾

可选实现：

```text
未进入区域显示暗色
进入后显示地形
发现关键点后显示图标
隐藏点不主动显示
```

轻量项目可以不做复杂迷雾，只做区域发现状态。

### 20.4 地图标记规则

| 图标 | 含义 |
|---|---|
| ! | 新任务 |
| ? | 可完成任务 |
| 洞穴图标 | 副本入口 |
| 宝箱图标 | 已发现未开启宝箱，可选 |
| 城镇图标 | 城镇 |
| 传送图标 | 传送点 |
| 骷髅图标 | Boss / 高危区域 |
| 锁 | 需要能力 / 主线 |
| 星星 | 重要目标 |

---

## 21. 地图美术规范

### 21.1 地形视觉语言

| 地形 | 主色 | 视觉符号 |
|---|---|---|
| 草地 | 绿色 | 草叶、小花、圆润石头 |
| 森林 | 深绿 | 树、藤蔓、蘑菇 |
| 沙漠 | 黄橙 | 沙丘、遗迹、仙人掌 |
| 沼泽 | 暗绿 | 毒泡、枯木、湿地 |
| 雪地 | 浅蓝白 | 雪堆、冰晶、雾气 |
| 火山 | 红黑 | 岩浆、黑石、火星 |
| 海岛 | 蓝青 | 海水、沙滩、贝壳 |
| 暗影 | 紫黑 | 黑雾、裂隙、暗晶 |

### 21.2 可交互物视觉要求

所有可交互物必须满足：

```text
轮廓比普通装饰更清楚
可交互状态有轻微动效
任务相关对象有标记
未解锁对象有锁定视觉
已完成对象状态明显变化
```

### 21.3 阻挡物视觉要求

阻挡物不能欺骗玩家。

```text
能走的地方要看起来能走
不能走的地方要看起来不能走
需要能力解锁的地方要有特殊符号
高等级危险区域要有危险氛围
```

### 21.4 前景遮挡半透明

树冠、屋檐等前景物：

```text
玩家进入遮挡区
→ 前景物透明度降低
→ 玩家离开
→ 前景物恢复
```

参数：

```text
FadeAlpha = 0.45
FadeTime = 0.15s
RecoverTime = 0.2s
```

---

## 22. 地图音效与环境反馈

### 22.1 地表脚步音效

| 地形 | 音效 |
|---|---|
| 草地 | 草地脚步 |
| 石路 | 石头脚步 |
| 木桥 | 木板脚步 |
| 浅水 | 水花脚步 |
| 雪地 | 雪地脚步 |
| 沙地 | 沙地脚步 |
| 岩浆边缘 | 灼热环境声 |

### 22.2 环境音

| 区域 | 环境音 |
|---|---|
| 草原 | 风声、鸟叫 |
| 森林 | 树叶、虫鸣 |
| 沙漠 | 风沙 |
| 沼泽 | 水泡、虫鸣 |
| 雪原 | 寒风 |
| 火山 | 岩浆、火焰 |
| 海岛 | 海浪、海鸟 |
| 暗影 | 低频风声、魔法噪声 |

### 22.3 交互音效

```text
宝箱打开
传送点激活
机关触发
门打开
藤蔓燃烧
冰墙融化
石门移动
隐藏物发现
资源采集
洞穴进入
```

---

## 23. 地图 2D 特效清单

### 23.1 地形特效

```text
VFX_Grass_Sway
VFX_Water_Ripple
VFX_Water_Splash
VFX_Lava_Bubble
VFX_Lava_Spark
VFX_Poison_Bubble
VFX_Poison_Mist
VFX_Snow_Drift
VFX_Sand_Wind
VFX_DarkFog
```

### 23.2 交互物特效

```text
VFX_Chest_Sparkle
VFX_Chest_OpenBurst
VFX_Portal_Idle
VFX_Portal_Activate
VFX_Shrine_Glow
VFX_QuestItem_Glow
VFX_Switch_Activate
VFX_Door_OpenDust
VFX_HiddenReveal
```

### 23.3 阻挡物特效

```text
VFX_Vine_Burn
VFX_IceWall_Melt
VFX_MagicSeal_Break
VFX_DarkFog_Clear
VFX_Bridge_Rise
VFX_Rock_Break
VFX_Gate_Open
```

---

## 24. 数据表设计

### 24.1 Region.csv

```csv
RegionID,Name,MapID,RequiredLevel,MinLevel,MaxLevel,TerrainTheme,MusicID,WeatherType,UnlockCondition,DisplayOnMap
R001,新手草原,WorldMap,1,1,5,Grass,BGM_Grass,None,,True
R002,绿叶森林,WorldMap,5,5,15,Forest,BGM_Forest,None,Q001_Complete,True
R003,黄沙遗迹,WorldMap,15,15,25,Desert,BGM_Desert,SandWind,Q010_Complete,True
R004,毒雾沼泽,WorldMap,25,25,35,Swamp,BGM_Swamp,PoisonMist,Ability_PoisonResist,True
```

### 24.2 Terrain.csv

```csv
TerrainID,Name,Walkable,MoveSpeedMultiplier,HazardType,TickInterval,DamageValue,StatusEffect,FootstepSFX,StepVFX
Grass,草地,True,1.0,None,0,0,,SFX_Footstep_Grass,VFX_StepGrass
Road,道路,True,1.05,None,0,0,,SFX_Footstep_Stone,VFX_StepDust
ShallowWater,浅水,True,0.75,None,0,0,,SFX_Footstep_Water,VFX_WaterSplash
PoisonSwamp,毒沼,True,0.75,Poison,1.0,0.02,Poison,SFX_Footstep_Swamp,VFX_PoisonBubble
Lava,岩浆,True,0.6,Fire,0.5,0.05,Burn,SFX_Footstep_Lava,VFX_LavaSpark
DeepWater,深水,False,0,None,0,0,,,
Cliff,悬崖,False,0,None,0,0,,,
```

### 24.3 Interactable.csv

```csv
ID,Type,Name,MapID,RegionID,PositionX,PositionY,InteractionRadius,Priority,RequiredQuest,RequiredAbility,RequiredItem,Repeatable,SaveState,VFX_Idle,SFX_Interact
I001,NPC,村长,WorldMap,R001,12,8,1.2,100,,,False,True,,SFX_NPC_Talk
I002,Chest,草原宝箱01,WorldMap,R001,18,10,1.1,70,,,False,True,VFX_Chest_Sparkle,SFX_Chest_Open
I003,DungeonEntrance,绿叶洞穴,WorldMap,R002,30,14,1.4,65,Q001_Complete,,False,True,VFX_Dungeon_Entrance,SFX_Door_Enter
I004,Portal,草原传送点,WorldMap,R001,5,5,1.5,60,,,True,True,VFX_Portal_Idle,SFX_Portal_Activate
```

### 24.4 Blocker.csv

```csv
ID,Type,Name,MapID,RegionID,PositionX,PositionY,BlockerShape,RequiredAbility,RequiredQuest,RequiredItem,Destroyable,SaveState,VFX_Unlock,SFX_Unlock
B001,SoftBlocker,藤蔓墙,WorldMap,R001,22,6,Rect,FireAbility,,,True,True,VFX_Vine_Burn,SFX_Vine_Burn
B002,AbilityBlocker,深水区,WorldMap,R006,50,12,Area,WaterWalk,,,False,False,,
B003,QuestBlocker,黑雾封印,WorldMap,R008,80,20,Area,,Q050_Complete,,True,True,VFX_DarkFog_Clear,SFX_Seal_Break
B004,DynamicBlocker,遗迹石门,Dungeon_003,,10,5,Rect,,Q012_Active,AncientKey,False,True,VFX_Gate_Open,SFX_Gate_Open
```

### 24.5 Chest.csv

```csv
ChestID,ChestType,MapID,RegionID,Level,RewardTableID,IsRespawn,RespawnTime,RequiredQuest,RequiredAbility,ShowOnMap
C001,Common,WorldMap,R001,3,Reward_Grass_Common,False,0,,,False
C002,Rare,WorldMap,R002,10,Reward_Forest_Rare,False,0,,FireAbility,False
C003,Dungeon,Dungeon_001,,8,Reward_Dungeon_001,False,0,,,True
C004,Respawn,WorldMap,R003,18,Reward_Desert_Small,True,1800,,,False
```

### 24.6 Entrance.csv

```csv
EntranceID,Name,EntranceType,FromMap,ToMap,RequiredLevel,RequiredQuest,RequiredAbility,PositionX,PositionY,ReturnPointID,ShowLevelWarning
E001,绿叶洞穴,DungeonEntrance,WorldMap,Dungeon_001,8,Q001_Complete,,30,14,RP001,True
E002,蜂王巢穴,BossEntrance,WorldMap,Boss_BeeQueen,12,Q005_Complete,,42,9,RP002,True
E003,铁匠铺,InteriorDoor,Town_001,Interior_Blacksmith,1,,,8,3,RP003,False
```

### 24.7 Switch.csv

```csv
SwitchID,Name,MapID,SwitchType,TriggerType,RequiredElement,TargetObjectID,TriggerOnce,ResetTime,SaveState,VFX_On,SFX_Trigger
S001,遗迹拉杆,Dungeon_003,Lever,Interact,,Door_001,True,0,True,VFX_Switch_On,SFX_Switch
S002,火焰火把,Dungeon_004,Torch,SkillHit,Fire,Door_002,True,0,True,VFX_Torch_Lit,SFX_Fire_Ignite
S003,限时踏板,Dungeon_005,PressurePlate,StepOn,,Bridge_001,False,5,False,VFX_Plate_On,SFX_Plate
```

### 24.8 ResourceNode.csv

```csv
NodeID,Name,ResourceType,MapID,RegionID,PositionX,PositionY,GatherTime,RewardTableID,RespawnTime,RequiredTool,RequiredQuest
RN001,草药丛,Herb,WorldMap,R001,10,12,0.5,Reward_Herb_Common,600,,
RN002,铁矿石,Ore,WorldMap,R003,40,11,1.0,Reward_Ore_Common,1800,Pickaxe,
RN003,魔晶簇,Crystal,WorldMap,R005,60,22,1.2,Reward_Crystal_Rare,3600,,Q020_Active
```

---

## 25. Unity 实现建议

### 25.1 地图对象组件结构

#### InteractableObject

```text
InteractableID
InteractableType
InteractionRadius
Priority
ConditionList
CanInteract()
OnInteract()
ShowPrompt()
HidePrompt()
SaveState()
```

#### MapBlocker

```text
BlockerID
BlockerType
Collider
ConditionList
IsUnlocked
Unlock()
Lock()
PlayUnlockVFX()
SaveState()
```

#### TerrainArea

```text
TerrainID
AreaCollider
MoveSpeedMultiplier
HazardType
TickInterval
DamageValue
StatusEffect
OnEnter()
OnStayTick()
OnExit()
```

#### MapEntrance

```text
EntranceID
TargetScene
RequiredLevel
ConditionList
ShowEntranceUI()
Enter()
ReturnPointID
```

#### MapTrigger

```text
TriggerID
TriggerType
TriggerOnce
ConditionList
OnTriggered()
SaveState()
```

### 25.2 地图管理器

```text
WorldMapManager
├── 读取地图配置
├── 初始化区域
├── 初始化交互物
├── 初始化阻挡物
├── 初始化传送点
├── 初始化敌人刷新点
├── 加载地图保存状态
├── 处理区域进入 / 离开
└── 通知 UI 更新地图图标
```

### 25.3 交互检测器

挂在玩家身上：

```text
PlayerInteractionDetector
├── 检测范围内 InteractableObject
├── 按优先级排序
├── 选择当前交互对象
├── 显示交互 UI
├── 按键后执行交互
└── 离开范围隐藏 UI
```

排序规则：

```text
Priority 高者优先
Priority 相同则距离近者优先
任务完成对象额外加权
主线对象额外加权
```

### 25.4 碰撞建议

玩家碰撞：

```text
CircleCollider2D
半径 0.3~0.4
```

阻挡物碰撞：

```text
TilemapCollider2D + CompositeCollider2D
或 PolygonCollider2D
```

注意：

```text
避免复杂锯齿碰撞
障碍边缘尽量圆滑
窄路宽度至少 2 个玩家宽
桥宽至少 2.5 个玩家宽
洞穴入口前留出 3x3 空间
```

---

## 26. 场景编辑规范

### 26.1 地图命名

```text
WorldMap_Main
Town_GrassVillage
Dungeon_GrassCave_01
Dungeon_ForestRuin_01
Boss_BeeQueen
Interior_Blacksmith
Interior_SkillShop
```

### 26.2 对象命名

```text
NPC_Q001_VillageChief
Chest_R001_Common_001
Entrance_Dungeon_GrassCave_01
Blocker_Vine_R001_001
Portal_Town_GrassVillage
Switch_Dungeon003_Lever_001
Resource_Herb_R001_001
Spawner_R001_SlimeGroup_001
```

### 26.3 布点间距

| 对象 | 推荐间距 |
|---|---:|
| 普通宝箱之间 | 20~40 米 |
| 洞穴入口之间 | 30~60 米 |
| 任务 NPC 与任务目标 | 10~60 米，按任务阶段 |
| 小怪群之间 | 8~15 米 |
| 精英怪之间 | 40 米以上 |
| 传送点之间 | 每个主要区域 1 个 |
| 采集点之间 | 5~15 米 |

### 26.4 地图密度建议

每个区域至少包含：

```text
1 个城镇 / 营地
1 个主线节点
3~6 个支线 NPC
5~10 个普通宝箱
2~5 个洞穴入口
1 个精英怪点
1 个高等级回访点
1 个能力阻挡物
1 个传送点
若干普通敌人群
```

MVP 新手区可以缩小：

```text
1 个村庄
1 条主线
2 个支线
3 个宝箱
2 个洞穴
1 个传送点
1 个软阻挡
1 个精英怪
```

---

## 27. MVP 地图内容规划

### 27.1 MVP 大地图规模

推荐做一个小型开放区：

```text
地图尺寸：约 80 x 50 单位
区域数量：3 个
城镇：1 个
洞穴：3 个
Boss 区：1 个
传送点：2 个
宝箱：10 个
NPC：8~12 个
敌人群：15~25 组
阻挡物：5~8 个
可破坏物：20~40 个
隐藏物：3~5 个
```

### 27.2 MVP 区域

| 区域 | 等级 | 内容 |
|---|---:|---|
| 草原村 | Lv1~3 | 教学、NPC、商店、传送点 |
| 南部草地 | Lv3~7 | 普通战斗、宝箱、洞穴 |
| 东部森林边缘 | Lv7~12 | 稍难敌人、藤蔓阻挡、Boss 前置 |

### 27.3 MVP 阻挡物

```text
藤蔓墙 x3：需要火焰能力
封印洞口 x1：需要主线完成
木栅栏 x2：可攻击破坏
深水区 x1：展示后期能力门槛
高等级怪区 x1：数值阻挡
```

### 27.4 MVP 交互物

```text
主线 NPC x2
支线 NPC x4
技能神殿 x1
铁匠铺 x1
宝箱 x10
洞穴入口 x3
传送点 x2
告示牌 x5
任务物品 x4
机关 x2
可破坏木桶 / 木箱 x30
```

---

## 28. 开发任务拆分

### 28.1 程序任务

```text
M01 Tilemap 地形分层
M02 玩家地形检测
M03 地形移动倍率
M04 危险地形 Tick 伤害
M05 InteractableObject 基类
M06 玩家交互检测器
M07 宝箱系统
M08 洞穴入口和场景切换
M09 阻挡物系统
M10 能力门槛检查
M11 动态门 / 机关系统
M12 可破坏物系统
M13 传送点系统
M14 区域触发器
M15 小地图图标注册
M16 地图状态保存
M17 前景遮挡半透明
M18 资源点采集
M19 隐藏物发现
M20 地图 Debug 显示工具
```

### 28.2 策划任务

```text
D01 规划 MVP 大地图区域
D02 制作区域等级表
D03 配置地形表
D04 配置交互物表
D05 配置宝箱表
D06 配置阻挡物表
D07 配置入口表
D08 配置传送点
D09 配置机关谜题
D10 配置隐藏奖励
D11 配置敌人布点
D12 配置任务关联地图对象
```

### 28.3 美术任务

```text
A01 草地 Tile
A02 道路 Tile
A03 浅水 Tile
A04 森林边界 Tile
A05 山体 / 悬崖 Tile
A06 洞穴入口
A07 宝箱 3 种
A08 NPC 站位标记 / 任务标记
A09 藤蔓墙
A10 木栅栏
A11 封印门
A12 传送点
A13 神殿
A14 告示牌
A15 可破坏木桶 / 木箱
A16 前景树冠
A17 隐藏物光效
```

### 28.4 音频任务

```text
S01 草地环境音
S02 森林环境音
S03 草地脚步
S04 水面脚步
S05 宝箱打开
S06 门打开
S07 机关触发
S08 藤蔓燃烧
S09 传送点激活
S10 洞穴进入
S11 隐藏物发现
S12 可破坏物破碎
```

---

## 29. 验收标准

### 29.1 地形验收

- 玩家能在普通地形上顺畅移动。
- 玩家不能穿过硬阻挡。
- 浅水 / 沙地 / 雪地能正确修改移动速度。
- 毒沼 / 岩浆能按规则造成伤害。
- 地形脚步音效和特效正确切换。
- 玩家不会卡在 Tilemap 碰撞边缘。

### 29.2 阻挡物验收

- 硬阻挡看起来明确不可通过。
- 软阻挡在能力不足时不能通过。
- 获得能力后，软阻挡能正确解除。
- 动态门能被机关打开和关闭。
- 已解除的永久阻挡物能正确保存。
- 战斗封锁不会把玩家卡死。

### 29.3 交互物验收

- 玩家靠近交互物时出现提示。
- 多个交互物重叠时优先级正确。
- 宝箱开启后不能重复领取，除非配置为刷新宝箱。
- NPC 任务标记状态正确。
- 洞穴入口能显示等级和完成状态。
- 传送点首次激活后能在地图中使用。

### 29.4 地图探索验收

- 玩家进入新区域时有区域提示。
- 主路能自然引导玩家到目标。
- 支路尽头有奖励。
- 高等级区域有清楚危险提示。
- 隐藏物有可发现线索。
- 每 30 秒内玩家能看到一个目标或交互点。

### 29.5 存档验收

- 已开启宝箱读取存档后保持开启。
- 已激活传送点读取存档后保持激活。
- 已破坏永久阻挡物读取存档后不恢复。
- 已触发一次性剧情不会重复触发。
- 可刷新资源点按时间正确恢复。
- 普通小怪可以重新刷新。

---

## 30. 推荐开发顺序

```text
第 1 步：搭建 Tilemap 分层和基础碰撞
第 2 步：实现玩家地形检测和移动倍率
第 3 步：实现硬阻挡和软阻挡
第 4 步：实现交互物基类和交互按钮
第 5 步：实现宝箱开启和奖励
第 6 步：实现洞穴入口和场景切换
第 7 步：实现传送点
第 8 步：实现区域触发器和区域提示
第 9 步：实现可破坏物
第 10 步：实现机关和动态门
第 11 步：实现危险地形
第 12 步：实现地图状态保存
第 13 步：实现小地图图标
第 14 步：布置 MVP 地图
第 15 步：统一测试路线、阻挡、奖励密度
```

---

## 31. 设计关键点总结

地图设计最重要的是：

```text
1. 地图不是越大越好，而是目标密度要高
2. 主路负责不迷路，支路负责奖励
3. 阻挡物要让玩家产生“之后我还能回来”的期待
4. 可交互物必须有清晰视觉语言
5. 地形不能只是装饰，要参与移动、战斗、探索
6. 高等级怪可以做软门槛，但必须有危险提示
7. 宝箱、洞穴、NPC、机关要形成连续探索节奏
8. 已解锁、已开启、已破坏的状态必须保存
9. 前景遮挡不能影响战斗可读性
10. MVP 先做一个小而密的地图，不要一开始做超大空地图
```

最终目标：

```text
玩家沿着主路走，能推进主线；
玩家偏离主路，能发现奖励；
玩家遇到阻挡，会想以后回来；
玩家解锁能力后，旧地图会重新变得有价值。
```
