# 246 宝箱与掉落配置系统：材料、货币、装备、技能、概率、数量

## 1. 宝箱类型

```text
普通木箱
材料箱
货币箱
装备箱
技能箱
稀有宝箱
套装宝箱
传奇宝箱
Boss 宝箱
隐藏宝箱
诅咒宝箱
限时宝箱
```

## 2. Chest Prefab

```text
PF_Chest_Base
├── VisualRoot
│   ├── ClosedMesh
│   ├── OpenMesh
│   └── GlowVFX
├── ColliderRoot
│   ├── InteractionVolume
│   └── BlockCollider
├── InteractionRoot
│   ├── PromptAnchor
│   └── AlignPoint
├── LootSpawnRoot
│   ├── SpawnPoint_01
│   ├── SpawnPoint_02
│   └── SpawnPoint_N
├── VFXRoot
├── AudioRoot
├── Animator
├── ChestController
├── LootTableReference
└── DebugRoot
```

## 3. 宝箱状态

```text
Locked
Closed
Opening
Opened
Empty
Cooldown
Disabled
```

## 4. 打开流程

```text
玩家交互
→ 检查钥匙和条件
→ 对齐角色
→ 播放动画
→ 动画事件帧 RollLoot
→ 生成掉落
→ 播放特效音效
→ 保存已开启状态
```

## 5. LootTable 结构

宝箱可配置：

```text
材料组
货币组
装备组
技能组
套装组
传奇组
保底组
```

每组字段：

```text
RollCount
EntryList
Weight
MinCount
MaxCount
IndependentRoll
Guaranteed
```

## 6. 掉落条目类型

```text
Item
Material
Currency
EquipmentPool
SkillBook
Skill
SetItemPool
UniqueItemPool
RandomAffixEquipment
NestedLootTable
```

## 7. 普通宝箱示例

```json
{
  "lootTableId": "CHEST_COMMON_01",
  "rollGroups": [
    {
      "group": "Material",
      "rollCount": 3,
      "entries": [
        {"id": "MAT_IRON", "weight": 60, "min": 2, "max": 5},
        {"id": "MAT_CLOTH", "weight": 30, "min": 1, "max": 3},
        {"id": "MAT_MAGIC_DUST", "weight": 10, "min": 1, "max": 1}
      ]
    },
    {
      "group": "Currency",
      "guaranteed": true,
      "entries": [
        {"id": "GOLD", "weight": 100, "min": 20, "max": 50}
      ]
    }
  ]
}
```

## 8. 稀有宝箱示例

```json
{
  "lootTableId": "CHEST_RARE_01",
  "rollGroups": [
    {
      "group": "RareEquipment",
      "rollCount": 2,
      "entries": [
        {"pool": "RareEquipment_T3", "weight": 80},
        {"pool": "SetEquipment_T3", "weight": 18},
        {"pool": "UniqueEquipment_T3", "weight": 2}
      ]
    },
    {
      "group": "Skill",
      "rollCount": 1,
      "entries": [
        {"pool": "SkillBook_Mid", "weight": 90},
        {"pool": "SkillBook_Rare", "weight": 10}
      ]
    }
  ]
}
```

## 9. 传奇/神器宝箱

可配置：

```text
必定 1 件传奇
25% 概率额外套装件
10% 概率技能核心
1% 概率神器
```

高价值宝箱应有：
```text
更强外观
长按交互
钥匙条件
保底掉落
一次性状态保存
```

## 10. 掉落数量控制

```text
货币自动合并
同类材料自动合并
装备独立掉落
高稀有度光柱
掉落半径
抛出速度
落地弹跳
```

## 11. 掉落位置

```text
固定 SpawnPoint
随机圆形区域
向前扇形抛出
沿宝箱边缘散落
按稀有度分层
```

## 12. 保底机制

```text
首次开启保底
N 次开启保底
副本结算保底
Boss 宝箱保底
```

## 13. 条件掉落

根据：

```text
关卡等级
世界难度
玩家职业
当前流派标签
地图词缀
队伍人数
```

## 14. 诅咒宝箱

```text
打开
→ 锁定宝箱
→ 生成敌人波次
→ 完成目标
→ 解锁奖励
```

失败可关闭宝箱或降低奖励。

## 15. UI 提示

```text
普通宝箱：打开
锁定宝箱：显示钥匙
稀有宝箱：稀有标识
已开启：隐藏交互
诅咒宝箱：显示风险说明
```
