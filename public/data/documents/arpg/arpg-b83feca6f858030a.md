# 259 NPC 服务数据结构、JSON、配置表与开发验收

## 1. 数据表清单

```text
NpcDefinitionTable
NpcServiceDefinitionTable
NpcServiceUnlockTable
NpcReputationTable
NpcShopTable
RuneDefinitionTable
RuneQualityTable
RuneSocketTypeTable
RuneCompatibilityTable
RuneRecipeTable
RuneSalvageTable
EquipmentEnhanceTable
EquipmentQualityTable
EquipmentSocketRuleTable
CraftCostTable
CraftProtectionTable
NpcTransactionLogTable
```

---

## 2. RuneDefinition

```json
{
  "runeId": "RUNE_088",
  "displayName": "鎏金雷链符石",
  "quality": "Rare",
  "requiredLevel": 35,
  "socketTypes": ["Attack", "Universal"],
  "allowedSlots": ["Weapon", "Ring", "Amulet"],
  "tags": ["Lightning", "Shock", "Critical", "Chain"],
  "effects": [
    {
      "trigger": "OnCrit",
      "conditions": {"targetStatus": ["Shocked"]},
      "effectType": "ChainDamage",
      "chainCount": 1,
      "damageRatio": 0.2,
      "cooldown": 0.4
    }
  ],
  "uniqueRule": "OnePerItem",
  "triggerDepthLimit": 1
}
```

---

## 3. RuneInstance

```json
{
  "instanceId": "RUNE_INST_00001",
  "runeId": "RUNE_088",
  "level": 3,
  "enhanceLevel": 0,
  "rolledValues": [0.22],
  "state": "Normal",
  "isLocked": false,
  "isBound": false,
  "discovered": true
}
```

---

## 4. EquipmentSocketData

```json
{
  "equipmentInstanceId": "EQ_INST_001",
  "sockets": [
    {
      "index": 0,
      "socketType": "Attack",
      "state": "Normal",
      "runeInstanceId": "RUNE_INST_00001"
    },
    {
      "index": 1,
      "socketType": "Universal",
      "state": "Empty",
      "runeInstanceId": null
    }
  ]
}
```

---

## 5. RuneRecipe

```json
{
  "recipeId": "RCP_RUNE_LIGHTNING_CHAIN_EPIC",
  "recipeType": "DirectedUpgrade",
  "unlockCondition": "REP_RUNESMITH_4",
  "inputs": [
    {"tag": "Lightning", "quality": "Rare", "count": 1},
    {"tag": "Critical", "quality": "Rare", "count": 1},
    {"itemId": "CORE_CHAIN", "count": 1}
  ],
  "resultPoolId": "POOL_EPIC_LIGHTNING_CHAIN",
  "successRate": 0.8,
  "pityGainOnFail": 15
}
```

---

## 6. EnhanceRule

```json
{
  "targetLevel": 8,
  "baseStatMultiplier": 1.33,
  "successRate": 0.5,
  "failureMode": "LevelDownOne",
  "pityGain": 15,
  "costs": [
    {"itemId": "MAT_MASTER_FORGE", "count": 3},
    {"currencyId": "GOLD", "count": 15000}
  ]
}
```

---

## 7. QualityRule

```json
{
  "equipmentCategory": "Weapon",
  "quality": 20,
  "baseStatMultiplier": 1.1,
  "maxNormalQuality": 20,
  "breakthroughQuality": 30
}
```

---

## 8. SocketOpenRule

```json
{
  "slot": "Chest",
  "socketIndex": 2,
  "requiredItemLevel": 60,
  "allowedRarities": ["Rare", "Set", "Legendary"],
  "successRate": 0.35,
  "failureMode": "KeepExistingSockets",
  "pityGain": 20,
  "socketTypeMode": "DirectedOrWeightedRandom"
}
```

---

## 9. 运行时服务

```text
RuneInventoryService
RuneSocketService
RuneCompatibilityResolver
RuneEffectRegistrar
RuneCraftService
EquipmentEnhanceService
EquipmentQualityService
EquipmentSocketCraftService
NpcShopService
NpcReputationService
CraftPreviewService
TransactionLogService
```

---

## 10. 镶嵌运行时流程

```text
ValidateEquipment
→ ValidateSocket
→ ValidateRune
→ ResolveConflicts
→ BuildPreviewStats
→ ConfirmTransaction
→ RemoveCost
→ AttachRuneInstance
→ RegisterRuneEffects
→ RecalculateCharacterStats
→ Save
```

---

## 11. 卸下运行时流程

```text
ValidateRemovalMode
→ CalculateCostAndRisk
→ Confirm
→ UnregisterRuneEffects
→ RemoveRuneFromSocket
→ ApplyRuneResult
→ RecalculateStats
→ Save
```

---

## 12. 编辑器工具

建议菜单：

```text
Tools / Game / Rune Editor
Tools / Game / Rune Recipe Editor
Tools / Game / NPC Service Editor
Tools / Game / Equipment Enhance Table Editor
```

Rune Editor 支持：

```text
品质
孔型
部位白名单
效果列表
标签
唯一规则
触发深度
Boss 限制
Tooltip 预览
冲突校验
```

---

## 13. 自动校验

```text
符石 ID 重复
没有适用孔型
没有适用部位
传奇未设置全身唯一
神器未设置代价
触发词条没有冷却或上限
投射物数量符石可镶嵌错误部位
合成配方无结果池
强化表等级断层
孔位上限超出部位规则
商店出售未解锁物品
```

---

## 14. 开发阶段

### 阶段 A：NPC 服务框架

```text
NPC 交互
服务标签
解锁条件
商店
交易日志
```

### 阶段 B：符石基础

```text
符石物品
插槽
兼容判断
镶嵌和卸下
属性注册
```

### 阶段 C：符石成长

```text
合成
分解
鉴定
图鉴
声望
```

### 阶段 D：铁匠

```text
强化
品质
开孔
改孔
转移
分解
```

### 阶段 E：工具和 UI

```text
结果预览
批量操作
编辑器
自动校验
```

---

## 15. 最小闭环

```text
符石商店
普通/精良/稀有符石
装备空孔
镶嵌和无损拆卸
3 合 1 升阶
铁匠强化 +1~+7
品质 0~20%
第一、第二孔
结果预览和安全确认
```

---

## 16. 验收标准

```text
所有 NPC 功能由配置表解锁。
符石效果可以动态注册和移除。
换装后属性正确刷新。
触发符石遵守触发深度。
强化、品质和随机词条互不污染。
开孔失败不会删除已有孔。
所有不可逆操作有日志和确认。
编辑器能够检测无效配置。
```
