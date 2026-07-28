# 第一章美术资源清单（Prefab 命名版）

## 对应章节

## **第一章：一声叹息**

---

# 一、命名规范说明

本资源清单用于第一章关卡制作，方便美术、程序、地编统一命名。

推荐命名格式：

```text
类型_所属环境_资源名称_变体编号
```

示例：

```text
BLD_Village_House_A
PROP_Village_Well_A
ENV_Desert_CrackGround_A
NPC_Village_Elder_A
ENEMY_Rat_Wasteland_A
FX_PoisonMist_Low_A
```

---

# 二、资源类型前缀规范

| 前缀 | 类型 | 用途 |
|---|---|---|
| BLD | Building 建筑 | 房屋、棚子、学堂、铁匠铺 |
| PROP | Prop 场景物件 | 木桶、箱子、告示牌、石锅 |
| ENV | Environment 环境模块 | 地形块、石头、树、裂缝、水渠 |
| DECAL | Decal 地表贴花 | 干裂地面、黑土、封印纹 |
| NPC | NPC 角色 | 村民、任务角色、商人 |
| ENEMY | 敌人 | 山鼠、飞虫、怪草、大鹅 |
| ITEM | 掉落/采集物 | 草药、萝卜、龙纹碎片 |
| FX | 特效 | 风、毒雾、龙光、水流幻影 |
| UIICON | UI 图标 | 道具图标、状态图标 |
| VFXMARK | 地面提示/交互标识 | 任务标记、可交互光圈 |
| SFXREF | 音效占位引用 | 风声、鹅叫、龙吟等引用名 |

---

# 三、区域资源包拆分

第一章建议拆成 8 个资源包：

| 资源包编号 | 资源包名称 | 内容 |
|---|---|---|
| Pack_CH01_01 | 狗尾草村建筑包 | 村屋、铁匠铺、学堂、鸡窝 |
| Pack_CH01_02 | 村庄生活物件包 | 木桶、栅栏、草垛、水井、告示板 |
| Pack_CH01_03 | 荒原地表植被包 | 枯草、碎石、干裂地表、枯木 |
| Pack_CH01_04 | 小妖兽营地包 | 帐篷、石锅、破木棚、草席 |
| Pack_CH01_05 | 龙渠遗迹包 | 干涸水渠、龙纹石板、断桥、石座 |
| Pack_CH01_06 | 封龙荒原包 | 风蚀石柱、裂谷、锁链、封印平台 |
| Pack_CH01_07 | NPC 与敌人包 | 村民、小妖、玄猿货郎、大鹅、怪物 |
| Pack_CH01_08 | FX 与图标包 | 风、毒雾、龙光、水流幻影、道具图标 |

---

# 四、Pack_CH01_01：狗尾草村建筑包

## 1. 建筑资源总表

| PrefabID | 中文名 | 类型 | 所属区域 | 用途 | 变体需求 | 碰撞 | 可交互 | 优先级 |
|---|---|---|---|---|---|---|---|---|
| BLD_Village_House_A | 贫穷木屋 A | BLD | 狗尾草村 | 普通民居 | A/B/C | 有 | 否 | P0 |
| BLD_Village_House_B | 贫穷木屋 B | BLD | 狗尾草村 | 普通民居 | A/B/C | 有 | 否 | P0 |
| BLD_Village_House_C | 贫穷木屋 C | BLD | 狗尾草村 | 普通民居 | A/B/C | 有 | 否 | P1 |
| BLD_Village_ChiefHouse_A | 村长屋 | BLD | 狗尾草村 | 主线 NPC 建筑 | 1 | 有 | 门口可交互 | P0 |
| BLD_Village_Blacksmith_A | 铁匠铺 | BLD | 狗尾草村 | 强化教学 | 1 | 有 | 是 | P0 |
| BLD_Village_School_A | 学堂小屋 | BLD | 狗尾草村 | 防龙宣传/孩子 NPC | 1 | 有 | 是 | P0 |
| BLD_Village_Stall_A | 杂货棚 A | BLD | 狗尾草村 | 环境/商摊 | A/B | 有 | 可选 | P1 |
| BLD_Village_Shed_A | 小仓棚 | BLD | 狗尾草村 | 杂物装饰 | A/B | 有 | 否 | P1 |
| BLD_Village_ChickenCoop_A | 鸡窝组 A | BLD | 狗尾草村 | 鸡窝支线 | 1 | 有 | 是 | P0 |
| BLD_Village_ExitGate_A | 村口牌坊 | BLD | 村口 | 区域出口 | 1 | 有 | 否 | P0 |

---

## 2. 建筑美术说明

### BLD_Village_House_A / B / C

美术关键词：

- 低矮木屋
- 茅草顶或破布顶
- 泥墙、木板拼接
- 轻微歪斜
- 卡通低多边形
- 贫穷但不阴暗

需要区分：

| 变体 | 特征 |
|---|---|
| A | 标准小屋，草顶 |
| B | 半破木板墙，屋顶有补丁 |
| C | 小烟囱、门口有柴堆 |

---

### BLD_Village_ChiefHouse_A

美术关键词：

- 比普通民居稍大
- 门口有旧木牌
- 有一面小旗或村长铃
- 不豪华，只是“村里最像回事”的房子

---

### BLD_Village_Blacksmith_A

美术关键词：

- 半开放木棚
- 小火炉
- 砧板
- 磨剑石
- 挂着破旧工具
- 火光较弱

需要独立子物件：

| 子物件 PrefabID | 中文名 |
|---|---|
| PROP_Blacksmith_Anvil_A | 铁匠砧板 |
| PROP_Blacksmith_Furnace_A | 铁匠火炉 |
| PROP_Blacksmith_ToolRack_A | 工具架 |
| PROP_Blacksmith_Grindstone_A | 磨剑石台 |

---

### BLD_Village_School_A

美术关键词：

- 小木屋
- 门口贴防龙宣传画
- 内部可简化
- 外墙挂小黑板
- 儿童练字木板

需要独立子物件：

| 子物件 PrefabID | 中文名 |
|---|---|
| PROP_AntiDragon_PosterWall_A | 防龙宣传墙 |
| PROP_School_Blackboard_A | 学堂黑板 |
| PROP_School_DeskSmall_A | 小课桌 |
| PROP_School_BookPile_A | 旧课本堆 |

---

### BLD_Village_ChickenCoop_A

美术关键词：

- 小木棚鸡窝
- 干草
- 破围栏
- 鸡蛋窝
- 后续被旺财砸坏后需要破损状态

建议做两个状态：

| PrefabID | 状态 |
|---|---|
| BLD_Village_ChickenCoop_A | 正常 |
| BLD_Village_ChickenCoop_Broken_A | 被砸坏 |

---

# 五、Pack_CH01_02：村庄生活物件包

## 1. 村庄生活物件总表

| PrefabID | 中文名 | 类型 | 用途 | 碰撞 | 可交互 | 优先级 |
|---|---|---|---|---|---|---|
| PROP_Village_Well_A | 村井 | PROP | 村庄生活点 | 有 | 是 | P0 |
| PROP_NoticeBoard_Village_A | 村公告板 | PROP | 防龙宣传/任务提示 | 有 | 是 | P0 |
| PROP_RoadSign_VillageExit_A | 村口路牌 | PROP | 指向荒原 | 有 | 是 | P0 |
| PROP_WoodFence_A | 木栅栏 A | PROP | 村庄边界 | 有 | 否 | P0 |
| PROP_WoodFence_Broken_A | 破木栅栏 | PROP | 村庄/营地边界 | 有 | 否 | P0 |
| PROP_Bucket_Wood_A | 木桶 | PROP | 生活装饰 | 有 | 可选 | P0 |
| PROP_Bucket_Broken_A | 破木桶 | PROP | 修井任务材料 | 有 | 是 | P0 |
| PROP_WaterJar_A | 水缸 | PROP | 村庄装饰 | 有 | 可选 | P1 |
| PROP_FirewoodPile_A | 木柴堆 | PROP | 村庄装饰 | 有 | 可采集 | P0 |
| PROP_HayStack_A | 草垛 | PROP | 村庄/鸡窝 | 有 | 否 | P1 |
| PROP_ClothesLine_A | 晾衣绳 | PROP | 生活装饰 | 无/简碰撞 | 否 | P2 |
| PROP_Stool_Wood_A | 小板凳 | PROP | 村庄装饰 | 有 | 否 | P1 |
| PROP_Cart_Broken_A | 破木车 | PROP | 村庄/荒原入口 | 有 | 可选 | P1 |
| PROP_StoneMill_A | 石磨 | PROP | 村庄装饰 | 有 | 否 | P2 |
| PROP_PaperPlane_Point_A | 纸飞机投放点 | PROP | 小羊奇遇 | 无 | 是 | P1 |
| PROP_AntiDragon_Poster_A | 防龙宣传画 A | PROP | 墙面装饰 | 无 | 可读 | P0 |
| PROP_AntiDragon_Poster_B | 防龙宣传画 B | PROP | 墙面装饰 | 无 | 可读 | P1 |
| PROP_AntiDragon_Booklet_A | 防龙宣传册 | PROP | 收集品 | 无 | 是 | P0 |

---

## 2. 道具状态需求

部分物件建议做正常/破损/任务状态：

| 物件 | 状态 1 | 状态 2 | 状态 3 |
|---|---|---|---|
| 木桶 | 完整 | 破损 | 任务高亮 |
| 鸡窝 | 正常 | 被砸坏 | 修复后 |
| 公告板 | 正常 | 被风吹歪 | 可读状态 |
| 防龙宣传册 | 摊开 | 卷起 | 掉落 |
| 村井 | 普通 | 可打水 | 任务高亮 |

---

# 六、Pack_CH01_03：荒原地表与植被包

## 1. 地表模块

| PrefabID | 中文名 | 类型 | 用途 | 碰撞 | 优先级 |
|---|---|---|---|---|---|
| ENV_Ground_DirtPath_A | 泥土小路 A | ENV | 村外主路 | 无 | P0 |
| ENV_Ground_DirtPath_B | 泥土小路 B | ENV | 支路变体 | 无 | P0 |
| ENV_Ground_DryCrack_A | 干裂地面 A | ENV/DECAL | 荒原地表 | 无 | P0 |
| ENV_Ground_DryCrack_B | 干裂地面 B | ENV/DECAL | 荒原地表变体 | 无 | P1 |
| DECAL_DryCrack_Small_A | 小裂缝贴花 | DECAL | 地表细节 | 无 | P0 |
| DECAL_DryCrack_Large_A | 大裂缝贴花 | DECAL | 枯井/荒原 | 无 | P0 |
| DECAL_BlackSoil_A | 黑色土壤贴花 | DECAL | 黑草坡 | 无 | P0 |
| DECAL_PoisonStain_A | 毒雾污染地贴 | DECAL | 紫雾裂地 | 无 | P1 |
| ENV_Slope_DryHill_A | 干燥小坡 A | ENV | 村口/荒原 | 有 | P0 |
| ENV_Slope_DryHill_B | 干燥小坡 B | ENV | 黑草坡 | 有 | P1 |

---

## 2. 植被资源

| PrefabID | 中文名 | 类型 | 用途 | 可采集 | 优先级 |
|---|---|---|---|---|---|
| ENV_Grass_Dry_A | 枯草簇 A | ENV | 荒原装饰 | 否 | P0 |
| ENV_Grass_Dry_B | 枯草簇 B | ENV | 变体 | 否 | P0 |
| ENV_Grass_Dry_C | 枯草簇 C | ENV | 变体 | 否 | P1 |
| ENV_Bush_Dry_A | 干灌木 A | ENV | 路边装饰 | 否 | P0 |
| ENV_Bush_Dry_B | 干灌木 B | ENV | 变体 | 否 | P1 |
| ENV_Tree_Dead_A | 枯树 A | ENV | 荒原/黑草坡 | 否 | P0 |
| ENV_Tree_Dead_B | 枯树 B | ENV | 变体 | 否 | P1 |
| ENV_Tree_Bent_A | 歪树 | ENV | 村口坡地视觉点 | 否 | P0 |
| ENV_Tumbleweed_A | 风滚草 | ENV | 荒原氛围 | 否 | P2 |
| ITEM_WildRadish_A | 野萝卜 | ITEM | 采集物 | 是 | P0 |
| ITEM_DryMushroom_A | 干蘑菇 | ITEM | 采集物 | 是 | P0 |
| ITEM_Herb_Weak_A | 普通草药 | ITEM | 回复材料 | 是 | P0 |

---

## 3. 石头与杂物资源

| PrefabID | 中文名 | 类型 | 用途 | 碰撞 | 优先级 |
|---|---|---|---|---|---|
| ENV_Rock_Small_A | 小石块 A | ENV | 荒原散布 | 有 | P0 |
| ENV_Rock_Small_B | 小石块 B | ENV | 变体 | 有 | P0 |
| ENV_Rock_Mid_A | 中石块 A | ENV | 遮挡/边界 | 有 | P0 |
| ENV_RockPile_Small_A | 小石堆 | ENV | 采集/装饰 | 有 | P0 |
| ENV_RockPile_Dry_A | 干石堆 | ENV | 荒原 | 有 | P1 |
| PROP_BoneSmall_A | 小骨片 | PROP | 荒原外围 | 无/简 | P1 |
| PROP_WoodLog_Dry_A | 干木段 | PROP | 采集/装饰 | 有 | P0 |
| PROP_WoodStump_Dead_A | 枯木桩 | PROP | 荒原装饰 | 有 | P1 |

---

# 七、Pack_CH01_04：小妖兽营地包

## 1. 营地建筑与物件

| PrefabID | 中文名 | 类型 | 用途 | 碰撞 | 可交互 | 优先级 |
|---|---|---|---|---|---|---|
| PROP_Camp_Tent_Small_A | 小帐篷 A | PROP | 小妖营地 | 有 | 否 | P0 |
| PROP_Camp_Tent_Small_B | 小帐篷 B | PROP | 小妖营地变体 | 有 | 否 | P1 |
| PROP_Camp_Shed_A | 破木棚 | PROP | 营地储物 | 有 | 否 | P0 |
| PROP_Camp_StonePot_A | 石锅 | PROP | 晚饭支线核心 | 有 | 是 | P0 |
| PROP_Camp_FirePit_A | 小火坑 | PROP | 营地火堆 | 有 | 是 | P0 |
| PROP_Camp_StrawMat_A | 草席 | PROP | 休息点 | 无/简 | 可选 | P1 |
| PROP_Camp_WoodBowl_A | 破碗 | PROP | 营地装饰 | 无 | 可采集 | P1 |
| PROP_Camp_WoodSpoon_A | 木勺 | PROP | 营地装饰 | 无 | 可采集 | P1 |
| PROP_Camp_StoneSpoon_A | 石头汤勺 | PROP | 收集品 | 无 | 是 | P0 |
| PROP_Camp_CrateSmall_A | 小木箱 | PROP | 营地装饰 | 有 | 可选 | P1 |
| PROP_Camp_Bag_A | 破布袋 | PROP | 营地物资 | 有 | 可选 | P1 |
| PROP_Camp_FenceBroken_A | 简陋围挡 | PROP | 营地边界 | 有 | 否 | P0 |
| FX_Campfire_Weak_A | 弱营火 | FX | 营地氛围 | 无 | 否 | P0 |
| FX_CookingSteam_Weak_A | 弱炊烟 | FX | 石锅蒸汽 | 无 | 否 | P1 |

---

## 2. 营地食材/任务物

| PrefabID | 中文名 | 类型 | 用途 | 可采集 | 优先级 |
|---|---|---|---|---|---|
| ITEM_Camp_GrassRoot_A | 草根 | ITEM | 晚饭支线 | 是 | P0 |
| ITEM_Camp_DryWood_A | 干柴 | ITEM | 晚饭支线 | 是 | P0 |
| ITEM_Camp_HalfWaterBucket_A | 半桶清水 | ITEM | 晚饭支线 | 是 | P0 |
| ITEM_Camp_RockForSoup_A | 煮汤石头 | ITEM | 搞笑道具 | 是 | P1 |
| ITEM_Camp_SimpleSoup_A | 荒原杂汤 | ITEM | 回复道具 | 是 | P0 |
| ITEM_Camp_BetterSoup_A | 看起来不错的荒原杂汤 | ITEM | 回复道具 | 是 | P1 |

---

# 八、Pack_CH01_05：龙渠遗迹包

## 1. 龙渠结构资源

| PrefabID | 中文名 | 类型 | 用途 | 碰撞 | 可交互 | 优先级 |
|---|---|---|---|---|---|---|
| ENV_DryDragonCanal_Straight_A | 干涸龙渠直段 A | ENV | 龙渠主体 | 有 | 否 | P0 |
| ENV_DryDragonCanal_Straight_B | 干涸龙渠直段 B | ENV | 龙渠变体 | 有 | 否 | P0 |
| ENV_DryDragonCanal_Curve_A | 干涸龙渠弯段 | ENV | 龙渠转弯 | 有 | 否 | P1 |
| ENV_DryDragonCanal_Broken_A | 龙渠断裂段 A | ENV | 断裂表现 | 有 | 否 | P0 |
| ENV_DryDragonCanal_Broken_B | 龙渠断裂段 B | ENV | 变体 | 有 | 否 | P1 |
| PROP_BrokenBridge_A | 断桥残段 A | PROP | 龙渠跨越点 | 有 | 否 | P0 |
| PROP_BrokenBridge_B | 断桥残段 B | PROP | 变体 | 有 | 否 | P1 |
| PROP_StoneRail_Broken_A | 断裂石栏 A | PROP | 龙渠装饰 | 有 | 否 | P1 |
| PROP_StoneRail_Broken_B | 断裂石栏 B | PROP | 变体 | 有 | 否 | P1 |
| PROP_DragonStoneSeat_A | 龙纹石座 | PROP | 支线核心 | 有 | 是 | P0 |
| PROP_DragonStoneSlot_A | 龙纹凹槽 | PROP | 放置石块 | 有 | 是 | P0 |

---

## 2. 龙纹与石碑资源

| PrefabID | 中文名 | 类型 | 用途 | 可交互 | 优先级 |
|---|---|---|---|---|---|
| PROP_DragonStonePiece_A | 龙纹石块 A | ITEM/PROP | 收集 | 是 | P0 |
| PROP_DragonStonePiece_B | 龙纹石块 B | ITEM/PROP | 收集 | 是 | P0 |
| PROP_DragonStonePiece_C | 龙纹石块 C | ITEM/PROP | 收集 | 是 | P0 |
| PROP_BuriedStoneTablet_A | 半埋旧石碑 | PROP | 环境伏笔 | 可读 | P1 |
| PROP_DragonPattern_Slab_A | 龙纹石板 A | PROP | 遗迹装饰 | 否 | P0 |
| PROP_DragonPattern_Slab_B | 龙纹石板 B | PROP | 遗迹装饰 | 否 | P1 |
| DECAL_DragonPattern_Faded_A | 褪色龙纹地贴 | DECAL | 地表龙纹 | 否 | P0 |
| PROP_FishBones_A | 小鱼骨 | ITEM/PROP | 奇遇收集 | 是 | P0 |

---

## 3. 龙渠特效

| PrefabID | 中文名 | 类型 | 用途 | 优先级 |
|---|---|---|---|---|
| FX_WaterMemory_Weak_A | 微弱水流幻影 | FX | 龙渠拼石后短暂出现 | P0 |
| FX_DragonStone_Glow_Weak_A | 龙纹石微光 | FX | 龙纹石座发光 | P0 |
| FX_DustAncient_A | 古尘飘散 | FX | 旧遗迹交互 | P1 |
| FX_BlueRipple_Faint_A | 淡蓝水纹 | FX | 伏笔效果 | P1 |

---

# 九、Pack_CH01_06：封龙荒原与封印区包

## 1. 荒原入口资源

| PrefabID | 中文名 | 类型 | 用途 | 碰撞 | 可交互 | 优先级 |
|---|---|---|---|---|---|---|
| PROP_AntiDragon_BigSign_A | 恶龙禁地大告示牌 | PROP | 荒原入口核心 | 有 | 是 | P0 |
| PROP_AntiDragon_BigSign_Broken_A | 倒下的告示牌 | PROP | 支线状态 | 有 | 是 | P0 |
| PROP_AntiDragon_Sign_BackText_A | 告示牌背面旧字 | PROP/DECAL | 伏笔 | 是 | P0 |
| PROP_TornFlag_AntiDragon_A | 破防龙旗 A | PROP | 氛围装饰 | 无/简 | 否 | P0 |
| PROP_TornFlag_AntiDragon_B | 破防龙旗 B | PROP | 变体 | 无/简 | 否 | P1 |
| PROP_LeafletStack_A | 宣传单堆 | PROP | 宣传员奇遇 | 无 | 是 | P0 |
| PROP_MonkeyMerchant_Stall_A | 玄猿货摊 | PROP | 玄猿奇遇 | 有 | 是 | P0 |
| PROP_MonkeyMerchant_Crate_A | 玄猿商品箱 | PROP | 货摊子物件 | 有 | 是 | P1 |
| PROP_RoadSign_Wasteland_A | 荒原路牌 | PROP | 指路 | 有 | 是 | P0 |

---

## 2. 风蚀石与裂谷资源

| PrefabID | 中文名 | 类型 | 用途 | 碰撞 | 优先级 |
|---|---|---|---|---|---|
| ENV_WindRock_Pillar_A | 风蚀石柱 A | ENV | 荒原入口/外围 | 有 | P0 |
| ENV_WindRock_Pillar_B | 风蚀石柱 B | ENV | 变体 | 有 | P0 |
| ENV_WindRock_Group_A | 风蚀石柱组 A | ENV | 石林区 | 有 | P0 |
| ENV_WindRock_Group_B | 风蚀石柱组 B | ENV | 变体 | 有 | P1 |
| ENV_CrackGround_Poison_A | 紫雾裂地 A | ENV | 夜里低吟 | 有 | P0 |
| ENV_CrackGround_Poison_B | 紫雾裂地 B | ENV | 变体 | 有 | P1 |
| ENV_CliffEdge_Dry_A | 干崖边缘 | ENV | 区域边界 | 有 | P0 |
| ENV_StoneStep_Broken_A | 破损石阶 | ENV | 通向神龙平台 | 有 | P0 |

---

## 3. 封印平台资源

| PrefabID | 中文名 | 类型 | 用途 | 碰撞 | 可交互 | 优先级 |
|---|---|---|---|---|---|---|
| ENV_SealPlatform_Center_A | 封印平台中心 | ENV | 主线演出场 | 有 | 否 | P0 |
| ENV_SealPlatform_Edge_A | 平台边缘 A | ENV | 边界 | 有 | 否 | P0 |
| ENV_SealPlatform_Edge_B | 平台边缘 B | ENV | 变体 | 有 | 否 | P1 |
| DECAL_SealPattern_A | 封印地纹 A | DECAL | 平台中心 | 无 | 否 | P0 |
| DECAL_SealPattern_Broken_A | 破损封印地纹 | DECAL | 变体 | 无 | 否 | P1 |
| PROP_SealRock_Large_A | 封印巨石 A | PROP | 平台边界 | 有 | 否 | P0 |
| PROP_SealRock_Large_B | 封印巨石 B | PROP | 变体 | 有 | 否 | P0 |
| PROP_SealChain_Giant_A | 巨型锁链 A | PROP | 封印氛围 | 有 | 否 | P0 |
| PROP_SealChain_Giant_B | 巨型锁链 B | PROP | 变体 | 有 | 否 | P0 |
| PROP_SealChain_Broken_A | 断裂锁链 A | PROP | 荒原外围 | 有 | 否 | P1 |
| PROP_SealStone_Fragment_A | 封印石碎块 A | PROP | 装饰 | 有 | 否 | P1 |
| PROP_SealStone_Fragment_B | 封印石碎块 B | PROP | 变体 | 有 | 否 | P1 |

---

# 十、Pack_CH01_07：NPC 与敌人包

## 1. 主要 NPC 角色

| PrefabID | 中文名 | 类型 | 所属区域 | 动作需求 | 优先级 |
|---|---|---|---|---|---|
| NPC_Player_Wangcai_A | 旺财 | NPC/Player | 全局 | 跑、攻击、闪避、被吹飞 | P0 |
| NPC_Companion_Cat_A | 小猫 | NPC | 全局 | 跟随、吐槽、待机 | P0 |
| NPC_Village_Elder_A | 村长 | NPC | 狗尾草村 | 站立、拄拐、讲话 | P0 |
| NPC_Village_BlacksmithDog_A | 老黄狗铁匠 | NPC | 铁匠铺 | 打铁、说话 | P0 |
| NPC_Village_TanukiAunt_A | 胆小狸婶 | NPC | 狗尾草村 | 张望、害怕 | P1 |
| NPC_Village_HenAunt_A | 花婶 | NPC | 鸡窝区 | 喂鸡、生气 | P1 |
| NPC_Village_Teacher_A | 学堂老师 | NPC | 学堂 | 讲课、翻书 | P1 |
| NPC_Village_ChildGoat_A | 小羊妖阿绒 | NPC | 村外小坡 | 扔纸飞机 | P1 |
| NPC_Village_Child_A | 村童 A | NPC | 村庄 | 跑动、听课 | P1 |
| NPC_Village_Child_B | 村童 B | NPC | 村庄 | 玩耍 | P1 |
| NPC_Village_Commoner_A | 普通村民 A | NPC | 村庄 | 走路、扫地 | P1 |
| NPC_Village_Commoner_B | 普通村民 B | NPC | 村庄 | 挑水、说话 | P1 |
| NPC_Trainer_OldBlackDog_A | 老黑训练师 | NPC | 村口坡地 | 指导、扔萝卜 | P1 |
| NPC_Wasteland_RabbitKid_A | 灰耳小妖 | NPC | 枯井/营地 | 求助、打水 | P0 |
| NPC_Wasteland_GoatKid_A | 小角羊妖 | NPC | 小妖营地 | 找草根 | P1 |
| NPC_Wasteland_FoxKid_A | 短尾狐妖 | NPC | 小妖营地 | 做饭 | P1 |
| NPC_Wasteland_HerbRat_A | 草药鼠阿吱 | NPC | 黑草坡 | 背药篓、害怕 | P1 |
| NPC_Monkey_Merchant_A | 玄猿货郎阿拐 | NPC | 荒原入口 | 摆摊、讨价还价 | P1 |
| NPC_Fox_Propagandist_A | 防龙宣传员 | NPC | 荒原入口 | 晕倒、撒传单 | P2 |
| NPC_Camp_OldBeast_A | 营地老人 | NPC | 小妖营地 | 坐、回忆 | P2 |

---

## 2. 敌人角色

| PrefabID | 中文名 | 类型 | 所属区域 | 动作需求 | 是否可击杀 | 优先级 |
|---|---|---|---|---|---|---|
| ENEMY_Goose_VillageBoss_A | 村口大鹅 | ENEMY | 村口坡地 | 冲刺、啄、拍翅、叫 | 否 | P0 |
| ENEMY_Rat_Wasteland_A | 荒原山鼠 A | ENEMY | 荒原 | 跑、咬、逃 | 是 | P0 |
| ENEMY_Rat_Wasteland_B | 荒原山鼠 B | ENEMY | 荒原 | 变体 | 是 | P1 |
| ENEMY_Rat_Thief_A | 偷东西山鼠 | ENEMY | 奇遇 | 逃跑、偷钱袋 | 是/可抓 | P1 |
| ENEMY_Fly_Dryland_A | 荒原飞虫 | ENEMY | 荒原 | 飞行、俯冲 | 是 | P0 |
| ENEMY_Root_Dry_A | 枯根怪 | ENEMY | 荒原/龙渠 | 钻地、拍击 | 是 | P0 |
| ENEMY_Plant_BlackGrass_A | 黑节草 | ENEMY | 黑草坡 | 抽打 | 是 | P0 |
| ENEMY_Plant_TangleVine_A | 缠脚藤 | ENEMY | 黑草坡 | 缠绕 | 是 | P0 |
| ENEMY_Plant_PoisonBud_A | 毒芽花 | ENEMY | 黑草坡/紫雾 | 喷毒 | 是 | P0 |
| ENEMY_Rat_WastelandStrong_A | 强化山鼠 | ENEMY | 荒原外围 | 冲刺、跳咬 | 是 | P1 |
| ENEMY_Goose_Small_A | 小鹅队 | ENEMY | 训练支线 | 群体追击 | 否/可驱散 | P2 |

---

## 3. 动画需求表

| 角色 | 必需动画 |
|---|---|
| 旺财 | Idle、Run、Attack_Light、Attack_Heavy、Dodge、Hit、Knockback、FlyAway、Land、Talk |
| 小猫 | Idle、Run、Talk、Point、Sit、Surprised |
| 村长 | Idle、Talk、Point、Shock |
| 铁匠 | Idle、Hammer、Talk、InspectWeapon |
| 大鹅 | Idle、Walk、Run、Charge、Peck、WingFlap、Stunned、VictoryCall |
| 山鼠 | Idle、Run、Bite、Hit、Death、Flee |
| 飞虫 | FlyIdle、Dive、Hit、Death |
| 枯根怪 | Hidden、Emerge、Attack、Hit、Death |
| 黑节草 | Idle、WhipAttack、Hit、Death |
| 毒芽花 | Idle、PoisonSpray、Hit、Death |
| 玄猿货郎 | Idle、Talk、Trade、SneakyLaugh |
| 防龙宣传员 | Idle、Faint、WakeUp、ScatterLeaflets |

---

# 十一、Pack_CH01_08：FX、图标与声音引用

## 1. 场景 FX

| PrefabID | 中文名 | 类型 | 用途 | 优先级 |
|---|---|---|---|---|
| FX_DryWind_A | 干燥荒风 | FX | 荒原入口/外围 | P0 |
| FX_DustSwirl_A | 小尘旋 | FX | 荒原地表 | P1 |
| FX_StinkGas_A | 臭气喷发 | FX | 枯井支线 | P0 |
| FX_PoisonMist_Low_A | 低浓度紫雾 | FX | 紫雾裂地 | P0 |
| FX_PoisonCrack_Glow_A | 毒裂缝微光 | FX | 紫雾裂地 | P0 |
| FX_DragonLight_Weak_A | 微弱龙光 | FX | 夜里低吟/龙纹石 | P0 |
| FX_WaterWeak_A | 微弱清水 | FX | 枯井隐藏结局 | P1 |
| FX_WaterMemory_Weak_A | 水流记忆幻影 | FX | 龙渠伏笔 | P0 |
| FX_SealGlow_A | 封印地纹微光 | FX | 神龙平台 | P0 |
| FX_WindPressure_Low_A | 低强度风压 | FX | 神龙平台 | P0 |
| FX_WindPressure_Burst_A | 神龙叹息风爆 | FX | 剧情杀 | P0 |
| FX_DragonSilhouette_Far_A | 远景神龙影 | FX | 神龙初见 | P0 |
| FX_DragonEye_Glow_A | 龙眼微光 | FX | 神龙睁眼 | P0 |
| FX_PlayerFlyTrail_A | 旺财被吹飞轨迹 | FX | 飞行演出 | P0 |
| FX_ChickenFeatherBurst_A | 鸡毛爆散 | FX | 鸡窝落地 | P1 |

---

## 2. 交互标识/任务标记

| PrefabID | 中文名 | 类型 | 用途 |
|---|---|---|---|
| VFXMARK_Interact_Glow_A | 可交互微光 | VFXMARK | 交互物 |
| VFXMARK_Quest_Main_A | 主线任务标记 | VFXMARK | 主线 NPC/点 |
| VFXMARK_Quest_Side_A | 支线任务标记 | VFXMARK | 支线 NPC/点 |
| VFXMARK_Gather_A | 采集物高亮 | VFXMARK | 采集点 |
| VFXMARK_Danger_A | 危险提示圈 | VFXMARK | 毒雾/怪草 |
| VFXMARK_Hidden_A | 隐藏线索微光 | VFXMARK | 隐藏物 |

---

## 3. UI 图标资源

| PrefabID | 中文名 | 类型 | 用途 | 优先级 |
|---|---|---|---|---|
| UIICON_Item_WildRadish_A | 野萝卜图标 | UIICON | 采集物 | P0 |
| UIICON_Item_DryMushroom_A | 干蘑菇图标 | UIICON | 采集物 | P0 |
| UIICON_Item_WeakHerb_A | 草药图标 | UIICON | 回复道具 | P0 |
| UIICON_Item_HalfWaterBucket_A | 半桶清水图标 | UIICON | 支线道具 | P0 |
| UIICON_Item_BlackGrass_A | 黑节草图标 | UIICON | 任务材料 | P0 |
| UIICON_Item_DragonStonePiece_A | 龙纹石块图标 | UIICON | 伏笔收集 | P0 |
| UIICON_Item_SignRubbing_A | 告示牌拓印图标 | UIICON | 伏笔道具 | P0 |
| UIICON_Item_PaperPlane_A | 小羊纸飞机图标 | UIICON | 情绪奇遇 | P1 |
| UIICON_Item_GooseFeather_A | 鹅毛图标 | UIICON | 大鹅试炼奖励 | P1 |
| UIICON_Item_Egg_A | 鸡蛋图标 | UIICON | 回复道具 | P1 |
| UIICON_Status_Stink_A | 荒原臭气状态图标 | UIICON | 状态效果 | P0 |
| UIICON_Status_WarmWind_A | 暖风状态图标 | UIICON | 隐藏增益 | P1 |
| UIICON_Status_PoisonWeak_A | 轻毒状态图标 | UIICON | 毒雾效果 | P0 |

---

## 4. 音效引用名

| SFXREF | 中文名 | 用途 |
|---|---|---|
| SFX_Village_Ambience_Day | 村庄白天环境声 | 狗尾草村 |
| SFX_Village_Chicken | 鸡叫 | 鸡窝 |
| SFX_Goose_Call_A | 大鹅叫 A | 大鹅 |
| SFX_Goose_Attack_A | 大鹅啄击 | 大鹅攻击 |
| SFX_Blacksmith_Hammer | 打铁声 | 铁匠铺 |
| SFX_DryWind_Loop | 荒原风声 | 荒原 |
| SFX_StinkGas_Burst | 臭气喷发 | 枯井 |
| SFX_PoisonMist_Loop | 毒雾循环 | 紫雾裂地 |
| SFX_DragonLight_Hum | 龙光低鸣 | 夜里低吟 |
| SFX_WaterMemory_Whoosh | 水流幻影 | 龙渠 |
| SFX_DragonDistant_Growl | 远处龙吟 | 神龙区域 |
| SFX_Dragon_Sigh_Burst | 神龙叹息风爆 | 主线名场面 |
| SFX_Player_FlyAway | 旺财飞走 | 飞行动画 |
| SFX_ChickenCoop_Crash | 鸡窝坠落 | 鸡窝落点 |

---

# 十二、道具与采集物 Prefab 清单

## 1. 任务道具

| PrefabID | 中文名 | 所属任务 | 是否进背包 | 优先级 |
|---|---|---|---|---|
| ITEM_Quest_SwordOld_A | 祖传破剑 | 主线/强化 | 是 | P0 |
| ITEM_Quest_WellRope_A | 旧绳子 | 半桶水英雄 | 是 | P0 |
| ITEM_Quest_WellWheel_A | 生锈井轮 | 半桶水英雄 | 是 | P0 |
| ITEM_Quest_BrokenBucket_A | 破木桶 | 半桶水英雄 | 是 | P0 |
| ITEM_Quest_AntiDragonBell_A | 防龙铃 | 丢失的防龙铃 | 是 | P0 |
| ITEM_Quest_SignRubbing_A | 告示牌拓印 | 被风吹走的告示牌 | 是 | P0 |
| ITEM_Quest_DragonStonePiece_A | 龙纹石块 A | 会发光的旧石头 | 是 | P0 |
| ITEM_Quest_DragonStonePiece_B | 龙纹石块 B | 会发光的旧石头 | 是 | P0 |
| ITEM_Quest_DragonStonePiece_C | 龙纹石块 C | 会发光的旧石头 | 是 | P0 |
| ITEM_Quest_RatMoneyBag_A | 玄猿钱袋 | 玄猿货郎 | 是 | P1 |
| ITEM_Quest_OldMapPiece_A | 旧地图残片 | 玄猿货郎 | 是 | P1 |
| ITEM_Quest_PaperPlane_A | 小羊纸飞机 | 给恶龙寄信 | 是 | P1 |
| ITEM_Quest_RemnantScaleLight_A | 残留鳞光 | 荒原夜里的低吟 | 是 | P0 |

---

## 2. 回复/消耗道具

| PrefabID | 中文名 | 效果 | 来源 |
|---|---|---|---|
| ITEM_Consumable_Egg_A | 鸡蛋 | 回复少量生命 | 鸡窝支线 |
| ITEM_Consumable_WeakHerb_A | 普通草药 | 回复少量生命 | 采集 |
| ITEM_Consumable_BlackGrassPack_A | 黑节草药包 | 回复生命，有概率打嗝 | 黑草坡 |
| ITEM_Consumable_SimpleSoup_A | 荒原杂汤 | 回复生命 | 小妖晚饭 |
| ITEM_Consumable_BetterSoup_A | 看起来不错的荒原杂汤 | 回复更多生命 | 小妖晚饭完美结局 |
| ITEM_Consumable_StrongPill_Fake_A | 玄猿强力药丸 | 短时加攻，有副作用 | 玄猿货郎 |

---

## 3. 收藏品

| PrefabID | 中文名 | 来源 | 后续用途 |
|---|---|---|---|
| ITEM_Collect_GooseFeather_A | 鹅毛一根 | 大鹅试炼 | 搞笑收藏 |
| ITEM_Collect_PickleSwordScabbard_A | 咸菜味剑鞘 | 破剑开光 | 搞笑收藏 |
| ITEM_Collect_AntiDragonBooklet_A | 防龙宣传册 | 宣传员/村庄 | 后续反宣传 |
| ITEM_Collect_FishBones_A | 小鱼骨 | 旧龙渠 | 水脉伏笔 |
| ITEM_Collect_StoneSoupSpoon_A | 石头汤勺 | 小妖营地 | 生活收藏 |
| ITEM_Collect_RustyChainPiece_A | 锁链锈片 | 荒原外围 | 封印伏笔 |
| ITEM_Collect_WindMark_A | 风压痕迹记录 | 神龙叹息后 | 主线回忆 |

---

# 十三、材质与贴图命名建议

## 1. 村庄材质

| 材质 ID | 中文名 | 用途 |
|---|---|---|
| MAT_Village_Wood_Old_A | 旧木材 | 村屋/栅栏 |
| MAT_Village_Thatch_A | 茅草屋顶 | 木屋 |
| MAT_Village_MudWall_A | 泥墙 | 村屋 |
| MAT_Village_ClothPatch_A | 破布补丁 | 屋顶/帐篷 |
| MAT_Village_Metal_Old_A | 旧铁 | 铁匠铺 |

---

## 2. 荒原材质

| 材质 ID | 中文名 | 用途 |
|---|---|---|
| MAT_Wasteland_DrySoil_A | 干土 | 荒原地面 |
| MAT_Wasteland_Crack_A | 干裂土 | 地裂贴图 |
| MAT_Wasteland_Rock_A | 荒原石头 | 石块 |
| MAT_Wasteland_DeadGrass_A | 枯草 | 植被 |
| MAT_Wasteland_BlackSoil_A | 黑土 | 黑草坡 |
| MAT_Wasteland_PoisonStain_A | 毒污 | 紫雾裂地 |

---

## 3. 龙渠/封印材质

| 材质 ID | 中文名 | 用途 |
|---|---|---|
| MAT_DragonCanal_Stone_A | 龙渠旧石 | 水渠 |
| MAT_DragonPattern_Faded_A | 褪色龙纹 | 龙纹石板 |
| MAT_SealStone_Dark_A | 封印暗石 | 神龙平台 |
| MAT_SealPattern_GoldWeak_A | 微弱金纹 | 封印地纹 |
| MAT_Chain_Rusted_A | 锈蚀锁链 | 锁链 |
| MAT_DragonLight_Weak_A | 微弱龙光材质 | 发光点 |

---

# 十四、LOD 与碰撞建议

## 1. 建筑

| 资源类型 | LOD | 碰撞 |
|---|---|---|
| 村屋 | LOD0/LOD1 | 简化盒碰撞 |
| 铁匠铺 | LOD0/LOD1 | 简化盒碰撞 |
| 学堂 | LOD0/LOD1 | 简化盒碰撞 |
| 鸡窝 | LOD0/LOD1 | 简化盒碰撞，任务状态切换 |
| 龙渠石块 | LOD0/LOD1/LOD2 | Mesh 简碰撞 |
| 封印巨石 | LOD0/LOD1/LOD2 | 简化凸包 |

---

## 2. 小物件

| 资源类型 | 碰撞建议 |
|---|---|
| 木桶/箱子 | 简单碰撞 |
| 小板凳/碗/勺 | 可不加碰撞或简碰撞 |
| 草丛/枯草 | 不加碰撞 |
| 告示牌 | 加碰撞 |
| 龙纹石块 | 加拾取碰撞 |
| 采集物 | 触发器碰撞 |

---

## 3. 敌人

| 敌人 | 碰撞体 |
|---|---|
| 大鹅 | Capsule |
| 山鼠 | Capsule 小 |
| 飞虫 | Sphere |
| 枯根怪 | Capsule/Box |
| 黑节草 | Capsule 或固定触发体 |
| 毒芽花 | Capsule/Box |
| 缠脚藤 | 地面触发范围 |

---

# 十五、资源优先级总表

## P0：必须先做

| 类别 | 资源 |
|---|---|
| 建筑 | 村屋、村长屋、铁匠铺、学堂、鸡窝 |
| 物件 | 村井、公告板、木桶、木栅栏、告示牌 |
| 环境 | 干裂地表、枯草、碎石、干涸龙渠、封印平台 |
| NPC | 旺财、小猫、村长、铁匠、灰耳小妖 |
| 敌人 | 大鹅、山鼠、飞虫、枯根怪、黑节草、毒芽花 |
| FX | 荒风、臭气、紫雾、龙光、水流幻影、神龙叹息风爆 |
| UIICON | 基础采集物、支线道具、状态图标 |

---

## P1：建议第一轮补齐

| 类别 | 资源 |
|---|---|
| 建筑 | 杂货棚、小仓棚、普通屋变体 |
| 物件 | 草垛、水缸、破木车、营地帐篷、石锅 |
| 环境 | 黑草坡植物、断桥、石栏、风蚀石柱 |
| NPC | 狸婶、花婶、小羊、草药鼠、玄猿货郎 |
| 敌人 | 缠脚藤、偷钱袋山鼠、强化山鼠 |
| FX | 鸡毛爆散、营火、炊烟、尘旋 |

---

## P2：后续丰富用

| 类别 | 资源 |
|---|---|
| 建筑 | 更多村屋变体 |
| 物件 | 晾衣绳、石磨、小装饰件 |
| 环境 | 风滚草、更多岩石变体 |
| NPC | 更多普通村民变体 |
| 敌人 | 小鹅队 |
| FX | 更多环境小特效 |

---

# 十六、Prefab 文件夹结构建议

建议项目内这样组织：

```text
Assets/
  Game/
    Prefabs/
      CH01_FirstSigh/
        Buildings/
          Village/
          Camp/
        Props/
          VillageProps/
          WastelandProps/
          QuestProps/
        Environment/
          Ground/
          Rocks/
          Vegetation/
          DragonCanal/
          SealArea/
        Characters/
          NPC/
          Enemies/
        Items/
          QuestItems/
          Consumables/
          Collectibles/
        FX/
          EnvironmentFX/
          CombatFX/
          StoryFX/
        UIIcons/
          Items/
          Status/
```

---

# 十七、Prefab 命名完整示例

## 建筑

```text
BLD_Village_House_A
BLD_Village_House_B
BLD_Village_ChiefHouse_A
BLD_Village_Blacksmith_A
BLD_Village_School_A
BLD_Village_ChickenCoop_A
```

## 物件

```text
PROP_Village_Well_A
PROP_NoticeBoard_Village_A
PROP_AntiDragon_BigSign_A
PROP_Camp_StonePot_A
PROP_DragonStoneSeat_A
PROP_SealChain_Giant_A
```

## 环境

```text
ENV_Ground_DryCrack_A
ENV_DryDragonCanal_Straight_A
ENV_WindRock_Pillar_A
ENV_SealPlatform_Center_A
```

## NPC

```text
NPC_Village_Elder_A
NPC_Village_BlacksmithDog_A
NPC_Wasteland_RabbitKid_A
NPC_Monkey_Merchant_A
```

## 敌人

```text
ENEMY_Goose_VillageBoss_A
ENEMY_Rat_Wasteland_A
ENEMY_Fly_Dryland_A
ENEMY_Plant_BlackGrass_A
```

## FX

```text
FX_DryWind_A
FX_StinkGas_A
FX_PoisonMist_Low_A
FX_DragonLight_Weak_A
FX_Dragon_Sigh_Burst_A
```

---

# 十八、第一章美术资源一句话方向

## 狗尾草村

> 贫穷、温暖、木头和泥土搭出来的小村子，生活感强，适合搞笑互动。

## 荒原边缘

> 干枯、破败、资源匮乏，但还保留一点生活痕迹。

## 龙渠遗迹

> 看似普通废墟，细看有旧文明痕迹，暗示龙之国曾经富庶。

## 封龙荒原

> 压迫、风大、空旷、神秘，但不要做成纯邪恶魔窟。

## 神龙平台

> 巨大、安静、古老、封印感强，让玩家觉得神龙不像普通怪物。

---

# 十九、最终落地建议

第一章资源制作建议按这个顺序：

## 第一批

1. 村庄建筑基础组
2. 荒原地表基础组
3. 核心 NPC：旺财、小猫、村长、铁匠、大鹅
4. 基础敌人：山鼠、飞虫、黑节草
5. 主线平台与神龙远景 FX

## 第二批

1. 小妖兽营地
2. 龙渠遗迹
3. 黑草坡植物怪
4. 玄猿货郎与宣传员
5. 支线道具与图标

## 第三批

1. 村庄生活装饰丰富
2. 更多 NPC 变体
3. 隐藏物与收藏品
4. 额外 FX 与音效细化

---

# 二十、总结

第一章资源不需要一开始做得特别豪华，重点是四件事：

1. **村庄要有温暖喜感。**
2. **荒原要有贫苦感。**
3. **龙渠要有“这里曾经很好”的伏笔。**
4. **神龙平台要有巨大压迫感，但不要像邪恶巢穴。**

这样第一章才能既好玩，又为后面神龙真相反转埋下足够扎实的视觉线索。
