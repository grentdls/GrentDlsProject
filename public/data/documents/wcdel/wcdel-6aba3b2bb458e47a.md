# 第一章试玩资源与内容数据设计文档

> 项目类型：2D 俯视角开放世界轻 ARPG  
> 当前章节：第一章 / 新手草原可试玩内容包  
> 目标体验时长：20~40 分钟  
> 目标等级范围：Lv1~Lv8  
> 目标：用最少资源做出完整闭环：移动 → 战斗 → 接任务 → 进洞穴 → 拿装备 → 学技能 → 打 Boss → 解锁能力。

---

## 1. 第一章定位

### 1.1 章节名称

```text
第一章：草原村的怪声
```

### 1.2 章节目标

第一章的目标不是做大地图，而是让玩家完整体验核心玩法：

```text
1. 学会移动
2. 学会普攻
3. 学会翻滚躲红圈
4. 学会释放技能
5. 学会接任务和交任务
6. 学会打开宝箱
7. 学会进入洞穴
8. 学会更换装备
9. 学会学习 / 装配技能
10. 学会打 Boss
11. 学会解锁地图能力
```

### 1.3 章节剧情一句话

```text
草原村附近的森林边缘出现怪声和魔法藤蔓，玩家需要调查洞穴、击败蜂王守卫，并获得火焰能力，烧毁藤蔓打开通往第二章森林区域的道路。
```

### 1.4 试玩核心闭环

```text
草原村醒来
→ 村长教学移动和攻击
→ 村外打小怪
→ 接到调查任务
→ 进入草叶洞穴
→ 获得第一件装备
→ 学会火环术
→ 烧毁藤蔓
→ 进入蜂巢空地
→ 击败第一章 Boss：蜂王守卫
→ 解锁通往绿叶森林的道路
```

---

## 2. 第一章资源总表

### 2.1 场景资源

| 场景 ID | 场景名 | 类型 | 用途 |
|---|---|---|---|
| SC_Chapter01_World | 草原村外地图 | 大地图 | 第一章主场景 |
| SC_Town_GrassVillage | 草原村 | 城镇区域 | NPC、商店、技能神殿 |
| SC_Dungeon_GrassCave01 | 草叶洞穴 | 小副本 | 教学洞穴 |
| SC_Dungeon_BeeNest01 | 蜂巢洞穴 | Boss 前置副本 | Boss 铺垫 |
| SC_Boss_BeeGuard | 蜂王守卫空地 | Boss 场景 | 第一章 Boss |
| SC_Interior_Blacksmith01 | 铁匠铺内部，可选 | 室内 | 装备强化教学 |
| SC_Interior_Shop01 | 杂货店内部，可选 | 室内 | 买药水 |

MVP 可以不做室内，商店和铁匠铺直接在村庄 NPC 弹界面。

### 2.2 角色资源

| 资源 | 数量 | 说明 |
|---|---:|---|
| 玩家主角 | 1 | 四方向待机、移动、攻击、翻滚、施法、受击、死亡 |
| NPC | 6 | 村长、铁匠、魔法导师、药水商人、小孩、守卫 |
| 普通怪 | 5 | 草史莱姆、小蝙蝠、毒蜂、蘑菇怪、藤蔓怪 |
| 精英怪 | 2 | 大草史莱姆、毒蜂队长 |
| Boss | 1 | 蜂王守卫 |
| 可破坏物 | 4 | 木桶、木箱、藤蔓墙、石堆 |
| 交互物 | 8 | 宝箱、神殿、传送点、告示牌、洞穴入口等 |

### 2.3 系统资源

| 系统 | 是否需要 |
|---|---:|
| 移动 | 必需 |
| 普攻 | 必需 |
| 翻滚 | 必需 |
| 技能释放 | 必需 |
| 交互 | 必需 |
| 任务 | 必需 |
| 装备 | 必需 |
| 背包 | 简化 |
| 商店 | 简化 |
| 技能商店 | 必需 |
| 铁匠铺 | 可选 |
| 存档 | 必需 |
| 小地图 | 简化 |
| 大地图 | 可选 |
| Boss 血条 | 必需 |
| 伤害数字 | 必需 |

---

## 3. 第一章地图设计

### 3.1 大地图名称

```text
草原村周边
```

### 3.2 地图尺寸

MVP 推荐：

```text
地图尺寸：80 x 50 单位
玩家移动速度：4.2 单位 / 秒
从村庄到最远 Boss 入口：约 90~120 秒路程
```

### 3.3 区域划分

| 区域 ID | 区域名 | 等级 | 功能 |
|---|---|---:|---|
| R01_GrassVillage | 草原村 | Lv1 | 安全区、NPC、商店、技能神殿 |
| R02_SouthGrass | 南部草地 | Lv1~3 | 基础战斗教学 |
| R03_EastMeadow | 东部草甸 | Lv3~5 | 支线、宝箱、精英怪 |
| R04_GrassCaveArea | 草叶洞穴入口 | Lv4~6 | 第一洞穴 |
| R05_BeeField | 蜂鸣花田 | Lv5~8 | 毒蜂、Boss 前置 |
| R06_ForestGate | 森林入口 | Lv8 | 藤蔓门，通往第二章 |

### 3.4 地图平面结构

```text
[草原村]
   |
   | 主路
   |
[南部草地] ---- 支路 ---- [隐藏宝箱]
   |
   | 
[草叶洞穴入口] ---- [东部草甸 / 精英史莱姆]
   |
   |
[蜂鸣花田] ---- [蜂巢洞穴]
   |
   |
[蜂王守卫空地]
   |
[藤蔓森林门：第一章结束后打开]
```

### 3.5 地形类型

| 地形 ID | 名称 | 规则 |
|---|---|---|
| T_Grass | 草地 | 默认可走 |
| T_Road | 土路 | 可走，轻微引导 |
| T_FlowerField | 花田 | 可走，装饰 |
| T_ShallowWater | 浅水 | 可走，移速 75% |
| T_DenseBush | 密草 | 可走，移速 90%，隐藏小宝箱 |
| T_Cliff | 小山坡 / 岩壁 | 不可走 |
| T_TreeBlock | 树林边界 | 不可走 |
| T_VineWall | 魔法藤蔓 | 软阻挡，需要火焰能力 |
| T_Bridge | 木桥 | 可走 |
| T_CaveGround | 洞穴地面 | 可走 |

### 3.6 阻挡物

| 阻挡 ID | 名称 | 位置 | 解锁条件 | 作用 |
|---|---|---|---|---|
| B01_VineGate | 森林藤蔓门 | R06 森林入口 | 击败 Boss 后获得火焰能力 | 打开第二章 |
| B02_SmallVine01 | 小藤蔓墙 1 | 草叶洞穴入口旁 | 学会火环术 | 开隐藏宝箱 |
| B03_SmallVine02 | 小藤蔓墙 2 | 东部草甸 | 学会火环术 | 打开支路 |
| B04_WoodFence | 旧木栅栏 | 南部草地 | 普攻 3 次破坏 | 教学可破坏物 |
| B05_StonePile | 小石堆 | 隐藏支路 | 暂不可破坏 | 展示后续能力门槛 |

### 3.7 传送点

| 传送点 ID | 名称 | 解锁方式 |
|---|---|---|
| P01_GrassVillage | 草原村传送点 | 初始激活 |
| P02_BeeField | 蜂鸣花田传送点 | 玩家靠近激活 |

### 3.8 宝箱布点

| 宝箱 ID | 位置 | 类型 | 奖励 |
|---|---|---|---|
| C01_VillageBehind | 村庄屋后 | 普通 | 金币 30 |
| C02_SouthRoad | 南部草地路边 | 普通 | 小型生命药水 x1 |
| C03_HiddenBush | 密草隐藏点 | 隐藏 | 草原帽 |
| C04_GrassCave01 | 草叶洞穴中段 | 普通 | 金币 50 + 经验 30 |
| C05_GrassCaveBoss | 草叶洞穴终点 | 洞穴宝箱 | 木剑 +1 |
| C06_EastMeadow | 东部草甸 | 普通 | 小型魔法药水 x1 |
| C07_VineHidden | 小藤蔓墙后 | 稀有 | 学徒法帽 |
| C08_BeeNest | 蜂巢洞穴 | 普通 | 解毒草 x2 |
| C09_BossReward | Boss 后奖励 | Boss 宝箱 | 蜂刺短剑 + 火焰能力 |
| C10_ForestGate | 森林入口旁 | 隐藏 | 金币 100 |

---

## 4. 第一章主线任务

### 4.1 主线任务列表

| 任务 ID | 名称 | 等级 | 目标 |
|---|---|---:|---|
| MQ01 | 醒来的勇者 | Lv1 | 学会移动、对话 |
| MQ02 | 村外的史莱姆 | Lv1 | 击败 3 只草史莱姆 |
| MQ03 | 森林边的怪声 | Lv2 | 前往草叶洞穴 |
| MQ04 | 洞穴里的魔力 | Lv3 | 通关草叶洞穴 |
| MQ05 | 学习火焰魔法 | Lv4 | 在神殿学习火环术 |
| MQ06 | 烧毁藤蔓 | Lv5 | 用火环术烧毁小藤蔓 |
| MQ07 | 蜂鸣花田 | Lv6 | 前往蜂巢洞穴 |
| MQ08 | 蜂王守卫 | Lv7 | 击败 Boss 蜂王守卫 |
| MQ09 | 森林之路 | Lv8 | 烧毁森林藤蔓门，前往第二章 |

### 4.2 MQ01：醒来的勇者

```text
任务类型：主线
起始 NPC：村长
推荐等级：Lv1
```

任务流程：

```text
1. 玩家出生在草原村中央
2. 村长头顶显示主线感叹号
3. 玩家与村长对话
4. 教学移动：移动到指定点
5. 教学交互：返回村长对话
```

目标配置：

```csv
ObjectiveID,Type,Target,Count
MQ01_01,TalkToNPC,NPC_VillageChief,1
MQ01_02,ReachLocation,TutorialMovePoint,1
MQ01_03,TalkToNPC,NPC_VillageChief,1
```

奖励：

```text
经验 +20
金币 +20
解锁任务 MQ02
```

### 4.3 MQ02：村外的史莱姆

流程：

```text
1. 村长让玩家去村外清理草史莱姆
2. 玩家前往南部草地
3. 击败 3 只草史莱姆
4. 返回村长
```

教学内容：

```text
普攻
敌人血条
伤害数字
受击
拾取金币和经验
```

奖励：

```text
经验 +60
金币 +40
小型生命药水 x1
解锁任务 MQ03
```

### 4.4 MQ03：森林边的怪声

流程：

```text
1. 村长提示森林方向出现怪声
2. 地图标记草叶洞穴
3. 玩家抵达洞穴入口
4. 进入草叶洞穴
```

奖励：

```text
经验 +40
解锁草叶洞穴
```

### 4.5 MQ04：洞穴里的魔力

流程：

```text
1. 玩家探索草叶洞穴
2. 击败洞穴内小怪
3. 开启终点宝箱
4. 获得木剑 +1
5. 离开洞穴后返回村长
```

奖励：

```text
经验 +100
金币 +80
装备：木剑 +1
解锁技能神殿
```

### 4.6 MQ05：学习火焰魔法

流程：

```text
1. 村长让玩家去找魔法导师
2. 魔法导师打开技能神殿
3. 玩家免费学习火环术 Lv1
4. 玩家将火环术装备到技能槽 1
```

奖励：

```text
技能：火环术 Lv1
经验 +50
```

### 4.7 MQ06：烧毁藤蔓

流程：

```text
1. 玩家前往小藤蔓墙
2. 使用火环术烧毁藤蔓
3. 打开隐藏支路
4. 获得宝箱奖励
```

教学内容：

```text
技能释放
蓝量消耗
软阻挡解锁
回访奖励
```

奖励：

```text
经验 +80
金币 +60
解锁蜂鸣花田路径
```

### 4.8 MQ07：蜂鸣花田

流程：

```text
1. 玩家进入蜂鸣花田
2. 激活第二个传送点
3. 击败 5 只毒蜂
4. 进入蜂巢洞穴
```

奖励：

```text
经验 +120
金币 +80
解毒草 x1
```

### 4.9 MQ08：蜂王守卫

流程：

```text
1. 玩家进入 Boss 空地
2. Boss 蜂王守卫登场
3. 击败 Boss
4. 开启 Boss 宝箱
5. 获得蜂刺短剑和火焰净化能力
```

奖励：

```text
经验 +250
金币 +200
装备：蜂刺短剑
能力：火焰净化
解锁任务 MQ09
```

### 4.10 MQ09：森林之路

流程：

```text
1. 玩家返回森林藤蔓门
2. 使用火焰净化烧毁大藤蔓
3. 森林入口打开
4. 第一章完成
```

奖励：

```text
经验 +100
金币 +100
开启第二章区域
显示章节完成提示
```

---

## 5. 第一章支线任务

### 5.1 支线任务总表

| 任务 ID | 名称 | NPC | 等级 | 奖励 |
|---|---|---|---:|---|
| SQ01 | 丢失的药包 | 药水商人 | Lv2 | 药水 x2 + 金币 |
| SQ02 | 铁匠的木箱 | 铁匠 | Lv3 | 草原护甲 |
| SQ03 | 小孩的幸运草 | 村庄小孩 | Lv3 | 草原帽 |
| SQ04 | 告示牌的警告 | 村庄守卫 | Lv4 | 经验 + 金币 |
| SQ05 | 大史莱姆出没 | 村长 | Lv5 | 稀有装备 |

### 5.2 SQ01：丢失的药包

流程：

```text
药水商人丢了药包
→ 玩家去南部草地拾取任务物品
→ 路上打 2 只草史莱姆
→ 找到药包
→ 返回药水商人
```

目标：

```text
CollectItem: 药包 x1
ReturnToNPC: 药水商人
```

奖励：

```text
小型生命药水 x2
金币 +40
经验 +50
```

### 5.3 SQ02：铁匠的木箱

流程：

```text
铁匠让玩家打破村外旧木箱寻找铁钉
→ 玩家破坏 3 个木箱
→ 获得铁钉
→ 返回铁匠
```

教学：

```text
可破坏物
材料拾取
铁匠铺入口
```

奖励：

```text
草原护甲
经验 +70
金币 +30
```

### 5.4 SQ03：小孩的幸运草

流程：

```text
小孩说幸运草掉在密草里
→ 玩家去东部草甸密草区
→ 发现隐藏点
→ 拾取幸运草
→ 返回小孩
```

教学：

```text
隐藏物
支路探索
```

奖励：

```text
草原帽
经验 +60
金币 +30
```

### 5.5 SQ04：告示牌的警告

流程：

```text
守卫让玩家阅读 3 个告示牌
→ 每个告示牌提供玩法提示
→ 读完返回守卫
```

教学：

```text
告示牌
区域等级
敌人预警
洞穴提示
```

奖励：

```text
经验 +60
金币 +60
```

### 5.6 SQ05：大史莱姆出没

流程：

```text
完成 MQ04 后解锁
→ 村长提示东部草甸有大史莱姆
→ 玩家击败精英怪：大草史莱姆
→ 返回村长
```

奖励：

```text
稀有装备：草原护符
经验 +120
金币 +100
```

---

## 6. 第一章 NPC 设计

### 6.1 NPC 总表

| NPC ID | 名称 | 类型 | 位置 | 功能 |
|---|---|---|---|---|
| NPC_VillageChief | 村长 | 主线 NPC | 草原村中央 | 主线、部分支线 |
| NPC_Blacksmith | 铁匠 | 功能 NPC | 村庄左侧 | 铁匠铺、支线 |
| NPC_MageTeacher | 魔法导师 | 功能 NPC | 神殿旁 | 学技能 |
| NPC_PotionSeller | 药水商人 | 商店 NPC | 村庄右侧 | 药水商店、支线 |
| NPC_Child | 村庄小孩 | 支线 NPC | 村口 | 幸运草支线 |
| NPC_Guard | 村庄守卫 | 提示 NPC | 村口 | 告示牌支线 |
| NPC_Traveller | 旅人 | 氛围 NPC | 传送点旁 | 提示传送点 |
| NPC_CatLikeHint | 路过冒险者 | 氛围 NPC | 村外 | 提示洞穴和宝箱 |

注意：不要使用原版 IP 种族和角色名。这里的“路过冒险者”只是氛围 NPC。

### 6.2 村长

定位：

```text
主线引导者
新手教学 NPC
```

外观：

```text
年长小动物
拄拐杖
穿村长披肩
头顶主线标记
```

功能：

```text
发放 MQ01~MQ04
发放 SQ05
第一章结尾确认森林入口开启
```

### 6.3 铁匠

定位：

```text
装备强化教学
支线 SQ02
```

外观：

```text
壮实角色
围裙
铁锤
身边有铁砧
```

功能：

```text
打开铁匠铺
强化装备
给予草原护甲
```

MVP 可先只做对话和奖励，强化后续开放。

### 6.4 魔法导师

定位：

```text
技能学习教学
```

外观：

```text
小法师
斗篷
魔法书
站在小神殿旁
```

功能：

```text
免费学习火环术
后续出售技能升级
```

### 6.5 药水商人

定位：

```text
普通商店教学
支线 SQ01
```

商品：

```text
小型生命药水
小型魔法药水
解毒草
```

---

## 7. 第一章玩家初始数据

### 7.1 初始属性

```csv
Level,1
Exp,0
Gold,0
MaxHP,120
CurrentHP,120
MaxMP,60
CurrentMP,60
Attack,12
Magic,10
Armor,0
MoveSpeed,4.2
CritRate,0.05
CritDamage,1.5
RollCooldown,0.65
```

### 7.2 初始装备

```text
武器：练习木剑
头部：无
身体：布衣
技能：无
```

### 7.3 初始能力

```text
普通移动
普攻
翻滚
交互
自动拾取
```

### 7.4 初始未解锁

```text
技能释放
火焰净化
传送点 2
装备强化
第二章地图
```

---

## 8. 第一章等级成长数据

### 8.1 经验曲线

| 等级 | 升到下一级所需经验 | 累计经验 |
|---:|---:|---:|
| Lv1 → Lv2 | 50 | 50 |
| Lv2 → Lv3 | 80 | 130 |
| Lv3 → Lv4 | 120 | 250 |
| Lv4 → Lv5 | 170 | 420 |
| Lv5 → Lv6 | 230 | 650 |
| Lv6 → Lv7 | 300 | 950 |
| Lv7 → Lv8 | 380 | 1330 |

第一章总经验设计：

```text
主线总经验约 820
支线总经验约 360
怪物和洞穴约 300~500
玩家完成大部分内容可到 Lv7~8
只做主线可到 Lv5~6
```

### 8.2 升级属性成长

```csv
Level,MaxHP,MaxMP,Attack,Magic,Armor
1,120,60,12,10,0
2,140,65,15,12,0
3,160,70,18,14,0
4,185,75,21,17,0
5,210,80,25,20,0
6,240,85,29,23,0
7,270,90,33,27,0
8,305,95,38,31,0
```

护甲主要来自装备。

---

## 9. 第一章技能设计

### 9.1 技能总表

| 技能 ID | 名称 | 解锁 | 类型 | 作用 |
|---|---|---|---|---|
| SK_PlayerAttack | 普攻 | 初始 | 近战 | 基础输出 |
| SK_Roll | 翻滚 | 初始 | 位移 | 躲避红圈 |
| SK_FireRing | 火环术 | MQ05 | 火系范围 | AOE、烧藤蔓 |
| SK_HealLight | 生命光 | 可选支线 / 商店 | 治疗 | 容错 |
| SK_ThunderLine | 雷光线 | 第一章后半可选 | 直线伤害 | 打远程怪 |

MVP 必做：

```text
普攻
翻滚
火环术
```

可选：

```text
生命光
雷光线
```

### 9.2 火环术

```csv
SkillID,SK_FireRing
Name,火环术
UnlockQuest,MQ05
SkillType,InstantAround
Element,Fire
BaseDamage,32
MagicScale,1.2
ManaCost,20
Cooldown,3.0
CastTime,0.35
Radius,2.2
CanCrit,true
StatusEffect,Burn
Description,释放一圈火焰，对周围敌人造成火焰伤害，并可烧毁魔法藤蔓。
```

等级数据：

| 技能等级 | 基础伤害 | MP 消耗 | 冷却 | 半径 | 灼烧 |
|---:|---:|---:|---:|---:|---|
| Lv1 | 32 | 20 | 3.0s | 2.2 | 4s |
| Lv2 | 42 | 22 | 3.0s | 2.2 | 4s |
| Lv3 | 55 | 24 | 2.8s | 2.3 | 4s |

第一章技能商店最高升到 Lv3。

### 9.3 生命光，可选

```csv
SkillID,SK_HealLight
Name,生命光
UnlockCondition,Shop_MageTeacher_AfterMQ06
SkillType,Heal
Element,Holy
BaseHeal,60
MagicScale,1.0
ManaCost,28
Cooldown,8.0
CastTime,0.4
Description,恢复自身生命，适合新手提高容错。
```

### 9.4 雷光线，可选

```csv
SkillID,SK_ThunderLine
Name,雷光线
UnlockCondition,Shop_MageTeacher_AfterMQ07
SkillType,ForwardLine
Element,Lightning
BaseDamage,45
MagicScale,1.4
ManaCost,25
Cooldown,4.0
CastTime,0.45
Length,5.0
Width,0.7
Description,向前释放一道雷光，适合攻击直线上的敌人。
```

---

## 10. 第一章装备设计

### 10.1 装备槽位

第一章只开放：

```text
武器
头部
身体
```

### 10.2 装备品质

第一章出现：

```text
普通
优秀
稀有
```

暂不出现史诗和传说，避免早期数值膨胀。

### 10.3 武器装备

| 装备 ID | 名称 | 品质 | 等级需求 | 属性 | 来源 |
|---|---|---|---:|---|---|
| EQ_WoodSword_00 | 练习木剑 | 普通 | 1 | 攻击 +3 | 初始 |
| EQ_WoodSword_01 | 木剑 +1 | 普通 | 2 | 攻击 +8 | 草叶洞穴 |
| EQ_GrassBlade | 草叶短剑 | 优秀 | 4 | 攻击 +12，暴击 +2% | 掉落 / 商店 |
| EQ_BeeStingSword | 蜂刺短剑 | 稀有 | 7 | 攻击 +18，暴击 +4%，毒抗 +10% | Boss 宝箱 |
| EQ_ApprenticeStaff | 学徒法杖 | 优秀 | 4 | 魔法 +14，MP +10 | 技能神殿商店 |

### 10.4 头部装备

| 装备 ID | 名称 | 品质 | 等级需求 | 属性 | 来源 |
|---|---|---|---:|---|---|
| EQ_GrassHat | 草原帽 | 普通 | 2 | HP +20 | 支线 SQ03 / 隐藏宝箱 |
| EQ_ApprenticeHat | 学徒法帽 | 优秀 | 4 | 魔法 +8，MP +15 | 藤蔓隐藏宝箱 |
| EQ_BeeCap | 蜂纹头巾 | 稀有 | 6 | 暴击 +3%，移速 +3% | 毒蜂队长掉落 |

### 10.5 身体装备

| 装备 ID | 名称 | 品质 | 等级需求 | 属性 | 来源 |
|---|---|---|---:|---|---|
| EQ_ClothArmor | 布衣 | 普通 | 1 | HP +10 | 初始 |
| EQ_GrassArmor | 草原护甲 | 普通 | 3 | 护甲 +8，HP +25 | SQ02 |
| EQ_BeeGuardArmor | 蜂壳护甲 | 稀有 | 7 | 护甲 +16，HP +50，毒抗 +20% | Boss 掉落 |

### 10.6 饰品，可选

第一章可以奖励一个饰品，但装备槽暂不开放。  
如果想体验更多装备，可以开放 1 个饰品槽。

| 装备 ID | 名称 | 品质 | 属性 | 来源 |
|---|---|---|---|---|
| EQ_GrassCharm | 草原护符 | 稀有 | HP +30，MP +10，金币掉落 +5% | SQ05 |

---

## 11. 第一章物品设计

### 11.1 消耗品

| 物品 ID | 名称 | 效果 | 价格 | 来源 |
|---|---|---|---:|---|
| ITEM_HP_SMALL | 小型生命药水 | 恢复 100 HP | 50 | 商店 / 宝箱 |
| ITEM_MP_SMALL | 小型魔法药水 | 恢复 40 MP | 60 | 商店 / 宝箱 |
| ITEM_ANTIDOTE | 解毒草 | 解除中毒 | 40 | 商店 / 蜂巢 |
| ITEM_CAMP_SNACK | 野餐点心 | 非战斗恢复 50% HP | 80 | 商店 |

### 11.2 材料

| 材料 ID | 名称 | 用途 | 来源 |
|---|---|---|---|
| MAT_WoodChip | 木片 | 强化普通装备 | 木箱 |
| MAT_IronNail | 铁钉 | SQ02 任务 / 强化 | 木箱 |
| MAT_BeeWing | 蜂翼 | 强化 / 支线 | 毒蜂 |
| MAT_SlimeGel | 史莱姆凝胶 | 强化 | 草史莱姆 |
| MAT_FireSeed | 火种 | 技能升级 | 火焰神殿 / Boss |

### 11.3 任务物品

| 物品 ID | 名称 | 任务 | 说明 |
|---|---|---|---|
| QITEM_MedicineBag | 丢失的药包 | SQ01 | 草地拾取 |
| QITEM_IronNail | 铁匠的铁钉 | SQ02 | 木箱掉落 |
| QITEM_LuckyClover | 幸运草 | SQ03 | 密草隐藏点 |
| QITEM_BeeCore | 蜂王核心 | MQ08 | Boss 掉落 |
| QITEM_FireBlessing | 火焰祝福 | MQ08 | 解锁火焰净化 |

---

## 12. 第一章怪物设计

### 12.1 怪物总表

| 怪物 ID | 名称 | 等级 | 类型 | 区域 |
|---|---|---:|---|---|
| EN_Slime_Grass | 草史莱姆 | 1~3 | 近战小怪 | 南部草地 |
| EN_Bat_Small | 小蝙蝠 | 2~4 | 飞行怪 | 草叶洞穴 |
| EN_Mushroom | 蘑菇怪 | 3~5 | 法师怪 | 草叶洞穴 / 东部草甸 |
| EN_Bee | 毒蜂 | 5~7 | 飞行 / 远程 | 蜂鸣花田 |
| EN_VineRoot | 藤蔓根 | 5~7 | 固定炮台 | 蜂巢洞穴 |
| EL_BigSlime | 大草史莱姆 | 5 | 精英 | 东部草甸 |
| EL_BeeCaptain | 毒蜂队长 | 7 | 精英 | 蜂巢洞穴 |
| BOSS_BeeGuard | 蜂王守卫 | 8 | Boss | Boss 空地 |

### 12.2 草史莱姆

定位：

```text
第一只教学怪
近战冲撞
攻击慢
预警明显
```

数据：

```csv
EnemyID,EN_Slime_Grass
Name,草史莱姆
Level,1
HP,70
Attack,10
Armor,0
MoveSpeed,2.2
DetectRange,5
AttackRange,1.1
AttackCooldown,1.6
ExpReward,12
GoldReward,5
AIType,Melee
```

技能：

```text
技能名：弹跳撞击
预警：圆形小红圈
预警时间：0.65s
伤害：12
后摇：0.45s
```

掉落：

```text
金币 3~6
经验 12
史莱姆凝胶 25%
小型生命药水 5%
```

### 12.3 小蝙蝠

定位：

```text
速度稍快
教玩家攻击飞行目标
血少
```

数据：

```csv
Level,2
HP,55
Attack,12
MoveSpeed,3.2
DetectRange,5
AttackCooldown,1.4
ExpReward,16
GoldReward,6
```

技能：

```text
俯冲攻击
矩形预警
预警时间 0.55s
直线冲刺 2.5 单位
```

掉落：

```text
金币 4~8
蝙蝠翅膀，暂可不用 20%
小型魔法药水 3%
```

### 12.4 蘑菇怪

定位：

```text
第一种法师怪
教玩家躲圆形红圈
```

数据：

```csv
Level,4
HP,100
Attack,8
Magic,18
MoveSpeed,1.8
DetectRange,6
AttackRange,5
AttackCooldown,2.2
ExpReward,26
GoldReward,10
```

技能：

```text
孢子爆炸
在玩家脚下生成圆形红圈
预警时间 0.85s
半径 1.4
魔法伤害 24
附加减速 2s，概率 40%
```

掉落：

```text
金币 8~12
蘑菇孢子 30%
小型魔法药水 8%
```

### 12.5 毒蜂

定位：

```text
第一章后半小怪
速度快
带毒
提醒玩家带解毒草或翻滚
```

数据：

```csv
Level,6
HP,90
Attack,18
MoveSpeed,3.4
DetectRange,6
AttackRange,4
AttackCooldown,1.8
ExpReward,35
GoldReward,14
```

技能：

```text
毒针
投射物
预警时间 0.45s
投射物速度 5
伤害 18
中毒概率 35%
```

掉落：

```text
金币 10~16
蜂翼 30%
解毒草 8%
蜂纹头巾 2%
```

### 12.6 藤蔓根

定位：

```text
固定炮台怪
不会移动
持续发射藤刺
火焰克制
```

数据：

```csv
Level,6
HP,130
Attack,20
Armor,5
MoveSpeed,0
DetectRange,6
AttackRange,5
AttackCooldown,2.0
ExpReward,40
GoldReward,12
ElementWeakness,Fire
```

技能：

```text
藤刺直线
矩形预警
预警 0.75s
伤害 22
```

特性：

```text
火焰伤害 x1.3
免疫击退
```

### 12.7 精英：大草史莱姆

定位：

```text
支线精英
血厚
大范围砸地
```

数据：

```csv
EnemyID,EL_BigSlime
Name,大草史莱姆
Level,5
HP,420
Attack,26
Armor,8
MoveSpeed,1.9
DetectRange,6
AttackRange,1.6
AttackCooldown,1.9
ExpReward,120
GoldReward,80
AIType,EliteMelee
```

技能：

```text
1. 大弹跳撞击
   圆形预警
   预警 0.9s
   半径 1.8
   伤害 32

2. 分裂小史莱姆
   HP 50% 时触发一次
   召唤 2 只 Lv2 草史莱姆
```

掉落：

```text
草原护符，任务奖励
史莱姆凝胶 x3
金币 80
```

### 12.8 精英：毒蜂队长

定位：

```text
Boss 前精英
让玩家适应毒蜂弹幕
```

数据：

```csv
Level,7
HP,360
Attack,24
Armor,4
MoveSpeed,3.0
DetectRange,7
AttackRange,5
AttackCooldown,1.6
ExpReward,140
GoldReward,90
```

技能：

```text
1. 三连毒针
   连续发射 3 枚毒针
   每枚伤害 16
   中毒概率 25%

2. 俯冲穿刺
   矩形预警
   预警 0.7s
   伤害 30
```

掉落：

```text
蜂纹头巾 15%
蜂翼 x2
金币 70~100
```

---

## 13. 第一章 Boss 设计

### 13.1 Boss 基础信息

```csv
BossID,BOSS_BeeGuard
Name,蜂王守卫
Level,8
HP,1400
Attack,34
Magic,20
Armor,12
MoveSpeed,2.6
Element,Poison
Weakness,Fire
ExpReward,250
GoldReward,200
```

### 13.2 Boss 战场

```text
场景：蜂王守卫空地
尺寸：18 x 14 单位
地形：草地 + 花田 + 少量蜂巢装饰
障碍：少量不可阻挡装饰，不影响翻滚
入口：进入后封锁
出口：Boss 死亡后打开
```

### 13.3 Boss 阶段

| 阶段 | 血量 | 行为 |
|---|---:|---|
| Phase 1 | 100%~65% | 普通毒针 + 俯冲 |
| Phase 2 | 65%~30% | 增加蜂蜜减速区 + 召唤毒蜂 |
| Phase 3 | 30%~0% | 攻击频率提高，释放蜂群冲锋 |

### 13.4 Boss 技能

#### 技能 1：毒针射击

```text
类型：远程投射物
预警：Boss 面前扇形方向提示
预警时间：0.6s
投射物数量：1，Phase 3 变 3
伤害：28
中毒概率：30%
冷却：2.0s
```

#### 技能 2：俯冲穿刺

```text
类型：矩形冲刺
预警：长条红区
预警时间：0.9s
冲刺距离：6 单位
伤害：38
击退：1.5
冷却：4.0s
```

#### 技能 3：蜂蜜减速区

```text
类型：圆形地面区域
解锁阶段：Phase 2
预警：圆形黄色/橙色区域
预警时间：0.8s
持续时间：5s
效果：玩家移速 -35%
伤害：无
冷却：6.0s
```

#### 技能 4：召唤毒蜂

```text
解锁阶段：Phase 2
召唤数量：2
召唤等级：Lv5
冷却：12s
同时存在上限：3
```

#### 技能 5：蜂群冲锋

```text
解锁阶段：Phase 3
类型：多条矩形预警
预警时间：1.2s
生成 3 条横向蜂群冲刺线
每条伤害：32
冷却：10s
```

### 13.5 Boss 掉落

```text
必掉：
蜂王核心 x1
火焰祝福 x1
蜂刺短剑 x1
金币 +200
经验 +250

概率：
蜂壳护甲 30%
蜂纹头巾 20%
蜂翼 x3 100%
```

### 13.6 Boss 战教学目标

```text
1. 玩家学会看长条预警
2. 玩家学会用翻滚躲冲刺
3. 玩家学会用火环术打弱点
4. 玩家学会处理召唤小怪
5. 玩家体验 Boss 阶段变化
```

---

## 14. 第一章商店设计

### 14.1 杂货店

商店 ID：

```text
SHOP_General_GrassVillage
```

商品：

| 商品 | 价格 | 解锁 |
|---|---:|---|
| 小型生命药水 | 50 | 初始 |
| 小型魔法药水 | 60 | MQ04 后 |
| 解毒草 | 40 | MQ07 前 |
| 野餐点心 | 80 | MQ03 后 |

### 14.2 技能神殿

商店 ID：

```text
SHOP_Skill_FireShrine
```

商品：

| 技能 | 学习价格 | 升级价格 | 解锁 |
|---|---:|---:|---|
| 火环术 | 免费 | 120 / 240 | MQ05 |
| 生命光 | 300 | 180 / 360 | MQ06 后 |
| 雷光线 | 450 | 250 / 500 | MQ07 后 |

MVP 可只做火环术。

### 14.3 铁匠铺

商店 ID：

```text
SHOP_Blacksmith_GrassVillage
```

功能：

```text
强化装备
```

第一章强化等级上限：

```text
+3
```

强化消耗示例：

| 强化等级 | 金币 | 材料 |
|---:|---:|---|
| +0 → +1 | 80 | 木片 x1 |
| +1 → +2 | 160 | 木片 x2 |
| +2 → +3 | 300 | 铁钉 x1 |

如果 MVP 时间紧，可以先不做强化，只保留铁匠 NPC 和支线。

---

## 15. 第一章洞穴设计

### 15.1 草叶洞穴

```text
DungeonID: DG_GrassCave01
推荐等级：Lv3
目标时长：3~5 分钟
宝箱：2
敌人：草史莱姆、小蝙蝠、蘑菇怪
```

结构：

```text
入口
→ 小房间 1：2 只草史莱姆
→ 分岔
   左：宝箱 C04
   右：主路
→ 小房间 2：2 只小蝙蝠
→ 教学红圈：蘑菇怪
→ 终点宝箱 C05
→ 出口
```

完成条件：

```text
打开终点宝箱
```

奖励：

```text
木剑 +1
经验
金币
```

### 15.2 蜂巢洞穴

```text
DungeonID: DG_BeeNest01
推荐等级：Lv6
目标时长：4~6 分钟
宝箱：1
敌人：毒蜂、藤蔓根、毒蜂队长
```

结构：

```text
入口
→ 毒蜂 x3
→ 藤蔓根 x1
→ 宝箱 C08
→ 毒蜂队长
→ Boss 入口
```

完成条件：

```text
击败毒蜂队长
进入 Boss 区
```

---

## 16. 第一章可破坏物与交互物

### 16.1 可破坏物

| ID | 名称 | HP | 可用攻击 | 掉落 |
|---|---|---:|---|---|
| BR_WoodBox | 木箱 | 20 | 普攻 | 木片 40%，金币 1~3 |
| BR_Barrel | 木桶 | 15 | 普攻 | 金币 2~5 |
| BR_SmallVine | 小藤蔓 | 60 | 火系技能 | 无 / 隐藏路 |
| BR_BeeNestSmall | 小蜂巢 | 40 | 普攻 / 火系 | 蜂翼 20%，金币 5 |

### 16.2 告示牌

| ID | 位置 | 内容 |
|---|---|---|
| SIGN_01 | 村口 | 红色区域出现时，翻滚可以躲避攻击。 |
| SIGN_02 | 南部草地 | 洞穴里通常藏着宝箱。 |
| SIGN_03 | 东部草甸 | 等级过高的敌人非常危险。 |
| SIGN_04 | 蜂鸣花田 | 中毒后可以使用解毒草。 |
| SIGN_05 | 森林入口 | 藤蔓害怕火焰。 |

### 16.3 交互物

| ID | 类型 | 名称 | 作用 |
|---|---|---|---|
| INT_Portal01 | 传送点 | 草原村传送点 | 初始激活 |
| INT_Portal02 | 传送点 | 蜂鸣花田传送点 | 靠近激活 |
| INT_ShrineFire | 神殿 | 火焰神殿 | 学火环术 |
| INT_Cave01 | 洞穴入口 | 草叶洞穴 | 进入副本 |
| INT_Cave02 | 洞穴入口 | 蜂巢洞穴 | 进入副本 |
| INT_BossGate | Boss 入口 | 蜂王守卫空地 | 进入 Boss 战 |

---

## 17. 第一章掉落表

### 17.1 普通怪掉落

```csv
DropTableID,ItemID,Chance,Min,Max
DROP_Slime,Gold,1.0,3,6
DROP_Slime,MAT_SlimeGel,0.25,1,1
DROP_Slime,ITEM_HP_SMALL,0.05,1,1

DROP_Bat,Gold,1.0,4,8
DROP_Bat,ITEM_MP_SMALL,0.03,1,1

DROP_Mushroom,Gold,1.0,8,12
DROP_Mushroom,MAT_MushroomSpore,0.30,1,1
DROP_Mushroom,ITEM_MP_SMALL,0.08,1,1

DROP_Bee,Gold,1.0,10,16
DROP_Bee,MAT_BeeWing,0.30,1,1
DROP_Bee,ITEM_ANTIDOTE,0.08,1,1
DROP_Bee,EQ_BeeCap,0.02,1,1
```

### 17.2 精英怪掉落

```csv
DROP_BigSlime,Gold,1.0,70,90
DROP_BigSlime,MAT_SlimeGel,1.0,3,5
DROP_BigSlime,EQ_GrassCharm,1.0,1,1

DROP_BeeCaptain,Gold,1.0,70,100
DROP_BeeCaptain,MAT_BeeWing,1.0,2,4
DROP_BeeCaptain,EQ_BeeCap,0.15,1,1
```

### 17.3 Boss 掉落

```csv
DROP_BeeGuard,Gold,1.0,200,200
DROP_BeeGuard,QITEM_BeeCore,1.0,1,1
DROP_BeeGuard,QITEM_FireBlessing,1.0,1,1
DROP_BeeGuard,EQ_BeeStingSword,1.0,1,1
DROP_BeeGuard,EQ_BeeGuardArmor,0.30,1,1
DROP_BeeGuard,EQ_BeeCap,0.20,1,1
DROP_BeeGuard,MAT_BeeWing,1.0,3,3
```

---

## 18. 第一章奖励节奏

### 18.1 奖励节奏目标

```text
每 1~2 分钟获得金币或经验
每 3~5 分钟获得宝箱或任务奖励
每 8~12 分钟获得一件新装备
第一章至少获得 1 个新技能
第一章结尾获得 1 个地图能力
```

### 18.2 关键奖励节点

| 时间点 | 奖励 |
|---|---|
| 2 分钟 | 第一次升级 |
| 5 分钟 | 小型生命药水 |
| 8 分钟 | 木剑 +1 |
| 12 分钟 | 火环术 |
| 15 分钟 | 藤蔓隐藏宝箱 |
| 20 分钟 | 草原护甲 / 草原帽 |
| 25~35 分钟 | 蜂刺短剑 + 火焰能力 |

---

## 19. 第一章 UI 内容

### 19.1 必需 UI

```text
主线任务追踪
NPC 对话框
任务接取弹窗
任务完成弹窗
交互按钮
玩家血条 / 蓝条
技能按钮
普攻按钮
翻滚按钮
敌人血条
Boss 血条
伤害数字
奖励 Toast
装备获得弹窗
洞穴入口确认
Boss 入口确认
传送点激活提示
能力解锁弹窗
第一章完成提示
```

### 19.2 第一章完成提示

```text
第一章完成！
森林之路已经打开。

你获得了：
火焰净化能力
蜂刺短剑
金币 +100

[继续冒险]
```

---

## 20. 第一章教学设计

### 20.1 教学点顺序

| 顺序 | 教学 | 触发 |
|---:|---|---|
| 1 | 移动 | MQ01 |
| 2 | 交互 | 村长对话 |
| 3 | 普攻 | MQ02 首只史莱姆 |
| 4 | 翻滚 | 草史莱姆红圈攻击 |
| 5 | 拾取 | 第一只怪掉落金币 |
| 6 | 宝箱 | C02 |
| 7 | 洞穴 | MQ03 |
| 8 | 装备 | 获得木剑 +1 |
| 9 | 技能 | MQ05 |
| 10 | 蓝量 / 冷却 | 使用火环术 |
| 11 | 软阻挡 | 烧藤蔓 |
| 12 | 传送点 | 蜂鸣花田 |
| 13 | 中毒 | 毒蜂 |
| 14 | Boss | 蜂王守卫 |
| 15 | 能力解锁 | Boss 后 |

### 20.2 教学提示文案

```text
拖动左下摇杆移动。
靠近村长，点击对话。
点击右下按钮进行攻击。
红色区域出现时，点击翻滚躲开。
金币和经验会自动飞向你。
靠近宝箱，点击打开。
洞穴里有怪物和宝箱。
获得装备后，可以在装备界面穿戴。
点击技能按钮释放火环术。
火焰可以烧毁藤蔓。
传送点激活后，可以快速返回。
中毒会持续掉血，可以使用解毒草。
Boss 有多个攻击阶段，注意红色预警。
```

---

## 21. 第一章数据表汇总

### 21.1 Chapter01_Quest.csv

```csv
QuestID,Name,Type,RequiredLevel,StartNPC,ObjectiveSummary,RewardExp,RewardGold,RewardItem,NextQuest
MQ01,醒来的勇者,Main,1,NPC_VillageChief,与村长对话并学习移动,20,20,,MQ02
MQ02,村外的史莱姆,Main,1,NPC_VillageChief,击败3只草史莱姆,60,40,ITEM_HP_SMALL,MQ03
MQ03,森林边的怪声,Main,2,NPC_VillageChief,前往草叶洞穴,40,0,,MQ04
MQ04,洞穴里的魔力,Main,3,,通关草叶洞穴,100,80,EQ_WoodSword_01,MQ05
MQ05,学习火焰魔法,Main,4,NPC_MageTeacher,学习火环术,50,0,SK_FireRing,MQ06
MQ06,烧毁藤蔓,Main,5,NPC_VillageChief,用火环术烧毁藤蔓,80,60,,MQ07
MQ07,蜂鸣花田,Main,6,NPC_VillageChief,前往蜂巢并击败毒蜂,120,80,ITEM_ANTIDOTE,MQ08
MQ08,蜂王守卫,Main,7,,击败蜂王守卫,250,200,EQ_BeeStingSword,MQ09
MQ09,森林之路,Main,8,NPC_VillageChief,烧毁森林藤蔓门,100,100,,CHAPTER02
SQ01,丢失的药包,Side,2,NPC_PotionSeller,找回药包,50,40,ITEM_HP_SMALL,
SQ02,铁匠的木箱,Side,3,NPC_Blacksmith,破坏木箱收集铁钉,70,30,EQ_GrassArmor,
SQ03,小孩的幸运草,Side,3,NPC_Child,寻找幸运草,60,30,EQ_GrassHat,
SQ04,告示牌的警告,Side,4,NPC_Guard,阅读3个告示牌,60,60,,
SQ05,大史莱姆出没,Side,5,NPC_VillageChief,击败大草史莱姆,120,100,EQ_GrassCharm,
```

### 21.2 Chapter01_Enemy.csv

```csv
EnemyID,Name,Level,HP,Attack,Magic,Armor,MoveSpeed,DetectRange,AttackRange,AttackCooldown,Exp,Gold,AIType
EN_Slime_Grass,草史莱姆,1,70,10,0,0,2.2,5,1.1,1.6,12,5,Melee
EN_Bat_Small,小蝙蝠,2,55,12,0,0,3.2,5,1.0,1.4,16,6,Flying
EN_Mushroom,蘑菇怪,4,100,8,18,0,1.8,6,5.0,2.2,26,10,Caster
EN_Bee,毒蜂,6,90,18,0,0,3.4,6,4.0,1.8,35,14,RangedFlying
EN_VineRoot,藤蔓根,6,130,20,0,5,0,6,5.0,2.0,40,12,Turret
EL_BigSlime,大草史莱姆,5,420,26,0,8,1.9,6,1.6,1.9,120,80,EliteMelee
EL_BeeCaptain,毒蜂队长,7,360,24,0,4,3.0,7,5.0,1.6,140,90,EliteRangedFlying
BOSS_BeeGuard,蜂王守卫,8,1400,34,20,12,2.6,99,6.0,2.0,250,200,Boss
```

### 21.3 Chapter01_Equipment.csv

```csv
EquipID,Name,Slot,Quality,RequiredLevel,HP,MP,Attack,Magic,Armor,CritRate,MoveSpeed,PoisonResist,Source
EQ_WoodSword_00,练习木剑,Weapon,Common,1,0,0,3,0,0,0,0,0,Initial
EQ_WoodSword_01,木剑+1,Weapon,Common,2,0,0,8,0,0,0,0,0,DG_GrassCave01
EQ_GrassBlade,草叶短剑,Weapon,Uncommon,4,0,0,12,0,0,0.02,0,0,DropOrShop
EQ_BeeStingSword,蜂刺短剑,Weapon,Rare,7,0,0,18,0,0,0.04,0,0.10,Boss
EQ_ApprenticeStaff,学徒法杖,Weapon,Uncommon,4,0,10,0,14,0,0,0,0,SkillShop
EQ_GrassHat,草原帽,Head,Common,2,20,0,0,0,0,0,0,0,SQ03
EQ_ApprenticeHat,学徒法帽,Head,Uncommon,4,0,15,0,8,0,0,0,0,VineChest
EQ_BeeCap,蜂纹头巾,Head,Rare,6,0,0,0,0,0,0.03,0.03,0,BeeDrop
EQ_ClothArmor,布衣,Body,Common,1,10,0,0,0,0,0,0,0,Initial
EQ_GrassArmor,草原护甲,Body,Common,3,25,0,0,0,8,0,0,0,SQ02
EQ_BeeGuardArmor,蜂壳护甲,Body,Rare,7,50,0,0,0,16,0,0,0.20,Boss
EQ_GrassCharm,草原护符,Accessory,Rare,5,30,10,0,0,0,0,0,0,SQ05
```

### 21.4 Chapter01_Skill.csv

```csv
SkillID,Name,Unlock,Type,Element,BaseDamage,BaseHeal,MagicScale,ManaCost,Cooldown,CastTime,Radius,Length,Width,Status,Description
SK_FireRing,火环术,MQ05,InstantAround,Fire,32,0,1.2,20,3.0,0.35,2.2,0,0,Burn,对周围敌人造成火焰伤害并烧毁藤蔓
SK_HealLight,生命光,ShopAfterMQ06,Heal,Holy,0,60,1.0,28,8.0,0.4,0,0,0,Regen,恢复自身生命
SK_ThunderLine,雷光线,ShopAfterMQ07,ForwardLine,Lightning,45,0,1.4,25,4.0,0.45,0,5.0,0.7,Shock,向前释放直线雷光
```

### 21.5 Chapter01_ShopItem.csv

```csv
ShopID,ItemID,Price,Unlock,Stock
SHOP_General_GrassVillage,ITEM_HP_SMALL,50,Start,-1
SHOP_General_GrassVillage,ITEM_MP_SMALL,60,MQ04,-1
SHOP_General_GrassVillage,ITEM_ANTIDOTE,40,MQ07,-1
SHOP_General_GrassVillage,ITEM_CAMP_SNACK,80,MQ03,-1
SHOP_Skill_FireShrine,SK_FireRing,0,MQ05,1
SHOP_Skill_FireShrine,SK_HealLight,300,MQ06,1
SHOP_Skill_FireShrine,SK_ThunderLine,450,MQ07,1
```

### 21.6 Chapter01_Chest.csv

```csv
ChestID,Name,Region,Type,RewardGold,RewardExp,RewardItem,RequiredAbility
C01_VillageBehind,村后宝箱,R01,Common,30,0,,
C02_SouthRoad,路边宝箱,R02,Common,0,0,ITEM_HP_SMALL,
C03_HiddenBush,密草宝箱,R03,Hidden,0,0,EQ_GrassHat,
C04_GrassCave01,洞穴中段宝箱,DG_GrassCave01,Common,50,30,,
C05_GrassCaveBoss,洞穴终点宝箱,DG_GrassCave01,Dungeon,0,0,EQ_WoodSword_01,
C06_EastMeadow,东部草甸宝箱,R03,Common,0,0,ITEM_MP_SMALL,
C07_VineHidden,藤蔓隐藏宝箱,R03,Rare,0,0,EQ_ApprenticeHat,Fire
C08_BeeNest,蜂巢宝箱,DG_BeeNest01,Common,0,0,ITEM_ANTIDOTE,
C09_BossReward,Boss奖励宝箱,BOSS_BeeGuard,Boss,200,0,EQ_BeeStingSword,
C10_ForestGate,森林入口隐藏宝箱,R06,Hidden,100,0,,
```

---

## 22. 第一章美术资源清单

### 22.1 角色动画资源

玩家：

```text
Idle_Down / Up / Left / Right
Walk_Down / Up / Left / Right
Attack_Down / Up / Left / Right
Roll_Down / Up / Left / Right
Cast_Down / Up / Left / Right
Hit_Down / Up / Left / Right
Dead
LevelUp
```

NPC：

```text
村长待机
铁匠待机
魔法导师待机
药水商人待机
小孩待机
守卫待机
```

怪物：

```text
草史莱姆：Idle / Move / Attack / Hit / Dead
小蝙蝠：Idle / Fly / Dive / Hit / Dead
蘑菇怪：Idle / Cast / Hit / Dead
毒蜂：Fly / Shoot / Dive / Hit / Dead
藤蔓根：Idle / Attack / Hit / Dead
大草史莱姆：Idle / Move / Slam / Split / Dead
毒蜂队长：Fly / Shoot / Dive / Dead
蜂王守卫：Idle / Shoot / Dive / Summon / Rage / Dead
```

### 22.2 UI 图标资源

```text
金币
经验
生命药水
魔法药水
解毒草
火环术
生命光
雷光线
普攻
翻滚
木剑
草叶短剑
蜂刺短剑
草原帽
学徒法帽
蜂纹头巾
布衣
草原护甲
蜂壳护甲
任务感叹号
任务问号
宝箱
洞穴
传送点
神殿
锁
```

### 22.3 地图 Tile 资源

```text
草地基础 Tile
草地细节 Tile
土路 Tile
花田 Tile
浅水 Tile
木桥 Tile
树林边界 Tile
小山坡 / 岩壁 Tile
洞穴地面 Tile
蜂巢地面 Tile
藤蔓阻挡 Tile
可破坏木箱
可破坏木桶
宝箱 3 种
传送点
火焰神殿
洞穴入口
蜂巢入口
Boss 门
```

### 22.4 特效资源

```text
普攻刀光
普通命中特效
暴击特效
火环术特效
灼烧特效
治疗特效，可选
雷光线特效，可选
草史莱姆攻击预警
小蝙蝠俯冲预警
蘑菇怪圆形预警
毒蜂毒针
Boss 毒针
Boss 俯冲预警
Boss 蜂群冲锋预警
宝箱开启特效
升级特效
火焰烧藤蔓特效
传送点激活特效
能力解锁特效
```

---

## 23. 第一章音效资源清单

```text
BGM_GrassVillage
BGM_GrassField
BGM_GrassCave
BGM_BeeField
BGM_Boss_BeeGuard

SFX_Player_Attack_Swing
SFX_Player_Attack_Hit
SFX_Player_Roll
SFX_Player_Cast
SFX_Player_Hit
SFX_Player_LevelUp

SFX_FireRing_Cast
SFX_FireRing_Hit
SFX_Vine_Burn

SFX_Slime_Attack
SFX_Slime_Dead
SFX_Bat_Dive
SFX_Bat_Dead
SFX_Mushroom_Cast
SFX_Bee_Shoot
SFX_Bee_Dead
SFX_Boss_Roar
SFX_Boss_Phase
SFX_Boss_Dead

SFX_Coin_Pickup
SFX_Exp_Pickup
SFX_Item_Get
SFX_Chest_Open
SFX_Quest_Accept
SFX_Quest_Complete
SFX_Dialogue_Next
SFX_Shop_Buy
SFX_Portal_Activate
SFX_Dungeon_Enter
SFX_Error
```

---

## 24. 第一章开发优先级

### 24.1 最小可玩版本

只做这些即可体验：

```text
草原村地图
玩家移动 / 普攻 / 翻滚
草史莱姆
村长 NPC
MQ01 / MQ02
玩家血条
敌人血条
伤害数字
金币 / 经验
升级
宝箱
```

### 24.2 第一轮竖切

加入：

```text
草叶洞穴
小蝙蝠
蘑菇怪
装备掉落
装备界面
火环术
藤蔓阻挡
技能按钮
```

### 24.3 第一章完整体验

加入：

```text
蜂鸣花田
毒蜂
蜂巢洞穴
毒蜂队长
Boss 蜂王守卫
技能神殿
传送点
支线任务
铁匠铺，可选
第一章完成提示
```

---

## 25. 第一章验收标准

### 25.1 体验验收

```text
新玩家 5 分钟内能学会移动、攻击、翻滚
10 分钟内能进入第一个洞穴
15 分钟内能获得新装备
20 分钟内能学会火环术
30~40 分钟内能打完 Boss
```

### 25.2 战斗验收

```text
草史莱姆不会秒杀玩家
蘑菇怪红圈清楚
毒蜂让玩家感到更危险但不恶心
Boss 有阶段变化
火环术对藤蔓和 Boss 都有明显价值
```

### 25.3 成长验收

```text
玩家至少升到 Lv5
完成支线能到 Lv7~8
玩家能明显感受到换装备后变强
火环术加入后战斗方式发生变化
Boss 奖励明显强于普通宝箱
```

### 25.4 地图验收

```text
玩家不会迷路
主路能引导到洞穴和 Boss
支路有奖励
藤蔓阻挡能形成回访目标
传送点能减少跑路
```

### 25.5 UI 验收

```text
任务目标清楚
交互按钮清楚
获得装备提示清楚
Boss 血条清楚
低血提示清楚
技能冷却和蓝量不足清楚
```

---

## 26. 第一章完成后的玩家状态

第一章通关后，玩家应该拥有：

```text
等级：Lv6~Lv8
技能：火环术 Lv1~Lv3
可能技能：生命光 / 雷光线
装备：蜂刺短剑或草叶短剑
头部：草原帽 / 学徒法帽 / 蜂纹头巾
身体：草原护甲 / 蜂壳护甲
能力：火焰净化
传送点：草原村、蜂鸣花田
第二章入口：绿叶森林已开放
```

### 26.1 下一章衔接

第二章开头：

```text
玩家进入绿叶森林
遇到更强的藤蔓怪和森林法师
学习第二个地图能力
开放更多技能和装备品质
```

第一章结尾必须给玩家一个明确目标：

```text
前往绿叶森林，调查藤蔓异变的源头。
```

---

## 27. 第一章一句话总结

```text
第一章的目的，是用一张小地图、一个洞穴、一个技能、一个 Boss，完成整个游戏核心玩法的第一次闭环。
```

玩家完成第一章后应该明白：

```text
我能探索地图
我能接任务
我能打怪升级
我能拿装备
我能学技能
我能用技能解锁道路
我能打 Boss
我还想去下一个区域
```
