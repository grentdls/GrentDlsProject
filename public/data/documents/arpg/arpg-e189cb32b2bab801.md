# 123_怪物种类库：普通、远程、法师、重型、精英、Boss小怪

> 目标：建立可复用的怪物种类库。每个副本不应该从零做怪，而是从怪物种类库中选择族群、Role、技能模板和掉落标签。

---

## 1. 怪物Role库

| Role | 功能 | 最小技能数 | 最大同时数量 | AI距离 |
|---|---|---:|---:|---|
| MeleeSmall | 低血快速围攻 | 2 | 12 | 1.5-2.5m |
| MeleeMedium | 标准近战 | 3 | 8 | 2-3m |
| Ranged | 远程压制 | 3 | 5 | 8-14m |
| Caster | 法术/异常 | 3-5 | 4 | 7-12m |
| Brute | 重型威胁 | 3-5 | 2 | 2.5-4m |
| Support | 治疗/加盾/强化 | 2-4 | 3 | 6-10m |
| Summoner | 召唤滚雪球 | 3-5 | 2 | 8-12m |
| Exploder | 自爆/死亡威胁 | 2 | 6 | 0-2m |
| Shield | 保护阵地 | 3 | 4 | 2-4m |
| Elite | 精英/小头目 | 5-8 | 1-3 | 按模板 |
| BossAdd | Boss小怪 | 1-3 | 按阶段 | 按Boss |

---

## 2. 通用技能模板

| 模板ID | 适用Role | 技能说明 |
|---|---|---|
| SK_Melee_Claw | 小型近战 | 近距离爪击，短前摇 |
| SK_Melee_Combo2 | 标准近战 | 二连击，可被打断 |
| SK_Brute_Slam | 重型 | 蓄力砸地，有地面预警 |
| SK_Ranged_Shot | 远程 | 单发投射物 |
| SK_Ranged_Burst | 远程 | 三连发，精度较低 |
| SK_Caster_AoeCircle | 法师 | 地面圆形预警后爆发 |
| SK_Caster_Debuff | 法师/支援 | 施加中毒/减速/易伤 |
| SK_Support_Shield | 支援 | 给附近怪物护盾 |
| SK_Summon_Minions | 召唤 | 召唤小怪，带上限 |
| SK_Explode_Delay | 自爆 | 死亡或靠近后延迟爆炸 |
| SK_Shield_Guard | 盾卫 | 举盾减伤，正面减伤高 |
| SK_Elite_AffixCast | 精英 | 根据词缀释放特殊技能 |

---

## 3. 怪物家族库

| 家族 | 章节 | 视觉关键词 | 常见Role | 掉落标签 |
|---|---|---|---|---|
| 海岸腐兽 | 第1章 | 湿皮、骨刺、海藻 | MeleeSmall / MeleeMedium | 兽骨、皮革 |
| 荒原盗匪 | 第1章 | 破布、刀斧、弩 | Melee / Ranged / Shield | 铭牌、金币、武器 |
| 矿洞异虫 | 第1章 | 虫甲、晶石、毒囊 | MeleeSmall / Exploder | 晶核、毒囊 |
| 黑炉军 | 第1章/4章 | 黑铁、火焰、炉渣 | Shield / Brute / Caster | 炭芯、钢片 |
| 腐林寄生体 | 第2章 | 藤蔓、孢子、树皮 | Caster / Support / Exploder | 孢子、药草 |
| 旧王亡兵 | 第2章 | 锈甲、骨马、弩 | Shield / Ranged / Summoner | 符片、亡灵材料 |
| 盐风海盗 | 第3章 | 钩爪、枪弩、盐雾 | Melee / Ranged / Support | 铁钩、金币 |
| 下水道腐物 | 第3章 | 毒泥、鼠群、管道 | MeleeSmall / Exploder | 药剂材料 |
| 灰烬军团 | 第4章 | 火甲、油桶、熔岩 | Brute / Caster / Shield | 火焰精华 |
| 星界残响 | 第5章/终局 | 星纹、虚空、裂隙 | Caster / Ranged / Elite | 星尘、钥石 |

---

## 4. 精英模板

| 精英模板 | 适用家族 | 技能组合 | 掉落倾向 |
|---|---|---|---|
| Elite_MeleeCaptain | 盗匪/亡兵/火裔 | 冲锋、连击、召援 | 武器、金币 |
| Elite_BruteBreaker | 傀儡/巨兽/重甲 | 砸地、破防、击退 | 重甲、强化材料 |
| Elite_CasterRitual | 女巫/法师/祭司 | 地面AOE、异常、召唤 | 魔尘、精华 |
| Elite_SummonerNest | 树心/墓园/星界 | 召小怪、护盾、持续区域 | 符石、召唤装备 |
| Elite_RangedCommander | 弓手/枪手/星辉 | 标记、齐射、位移 | 弓弩、投射物材料 |

---

## 5. Boss小怪模板

Boss 小怪不应掉太多装备，主要用于战斗机制：

| 模板 | 用途 | 掉落 |
|---|---|---|
| BossAdd_Fodder | 给玩家恢复药剂充能，制造场面 | 少量药剂充能/金币 |
| BossAdd_Shield | 保护Boss或机制核心 | 几乎无掉落 |
| BossAdd_Exploder | 逼迫走位 | 无掉落或少量材料 |
| BossAdd_Channeler | 给Boss充能，必须优先击杀 | 机制材料小概率 |
| BossAdd_EliteMini | 阶段小精英 | 低概率稀有材料 |

---

## 6. 怪物库命名规范

```text
MON_[Family]_[Role]_[Index]
示例：
MON_Bandit_Melee_001
MON_Ash_Caster_002
MON_Star_Elite_001
```

Prefab 命名：

```text
PF_MON_Bandit_Melee_001
PF_MON_Ash_Brute_001
PF_MON_Star_BossAdd_001
```

---

## 7. 当前 Unity 实现映射

### 7.1 怪物种类库落地

| Role | 已实现示例 |
|---|---|
| MeleeSmall | `MON_END_RIFT_MELEE_SMALL_001`、`MON_END_BEAST_MELEE_SMALL_001` |
| MeleeMedium | `MON_END_ASH_MELEE_001` |
| Ranged | `MON_END_STAR_RANGED_001`、`MON_END_UNDEAD_RANGED_001` |
| Caster | `MON_END_STAR_CASTER_001`、`MON_END_ASH_CASTER_001`、`MON_END_RIFT_CASTER_001` |
| Brute | `MON_END_ASH_BRUTE_001`、`MON_END_BEAST_BRUTE_001` |
| Support | `MON_END_MIXED_SUPPORT_001` |
| Summoner | `MON_END_UNDEAD_SUMMONER_001` |
| Exploder | `MON_END_MIXED_EXPLODER_001` |
| Shield | `MON_END_ASH_SHIELD_001`、`MON_END_UNDEAD_SHIELD_001` |
| Elite | `MON_END_STAR_ELITE_001`、`MON_END_RIFT_ELITE_001`、`MON_END_BEAST_ELITE_001` |
| BossAdd | `MON_END_STAR_BOSSADD_001`，并在 `monster_role_tunings.json` 中补齐 `BossAdd` 数值倍率 |

### 7.2 配置关系

| 配置 | 说明 |
|---|---|
| `monsters.json` | 新增 20 个终局可复用怪物模板，覆盖星界、灰烬、裂隙、旧王亡军、荒兽、混合机制怪 |
| `monster_pools.json` | 每个终局主题池按 Role 配权重、等级范围和组内上限 |
| `monster_role_tunings.json` | `BossAdd` 正式入表，避免 Boss 阶段小怪无法获得角色倍率 |
| `drop_tables.json` | 普通怪、精英、事件怪分别接入主题掉落表，Boss 小怪降低掉落权重并偏向机制材料 |

### 7.3 使用规则

1. 新副本优先引用 `POOL_END_*` 怪物池，不再为每张图临时拼散怪。
2. Boss 阶段召唤物使用 `BossAdd` Role，掉落只给少量金币、药剂充能或机制材料。
3. 精英模板优先使用 `Elite` Role，再通过地图词缀和精英词缀池叠加特殊行为。
4. 远程、法师、支援单位的 `MaxCountInGroup` 必须低于小型近战，避免屏幕压力失控。
