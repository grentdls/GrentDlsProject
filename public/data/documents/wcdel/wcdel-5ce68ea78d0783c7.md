# 装备、道具、物品配置界面完整设计文档

> 项目类型：2D 横版清版动作 RPG / 妖兽大陆动作游戏  
> 当前模块：装备、道具、物品配置工具  
> 目标：让策划可以通过可视化界面配置装备、消耗品、材料、任务物品、技能书、宝箱掉落物、商店商品、特殊道具等内容，包括图标、品质、数值、效果、表现、使用条件、掉落、出售、堆叠、装备槽位和运行时表现。

---

## 1. 工具定位

这个工具不是单纯写一个物品表，而是一个完整的 **Item / Equipment Config Editor**。

它要服务这些系统：

```text
背包系统
装备系统
商店系统
掉落系统
任务系统
技能学习系统
强化系统
Buff 系统
战斗数值系统
UI 展示系统
音效 / 特效表现系统
存档系统
```

最终目标：

```text
新增一个物品，不写代码。
新增一件装备，不写代码。
新增一个药水，不写代码。
新增一个任务道具，不写代码。
新增一个技能书，不写代码。
新增一个特殊使用效果，不写代码或少写代码。
```

---

## 2. 配置工具入口

Unity 菜单入口：

```text
Tools / Game / Item Config Editor
```

也可以在资源目录右键创建：

```text
Create / GameData / Item Config
Create / GameData / Equipment Config
Create / GameData / Consumable Config
Create / GameData / Material Config
```

推荐资源目录：

```text
Assets/GameData/Items/
├── Equipments/
│   ├── Weapons/
│   ├── Head/
│   ├── Body/
│   ├── Accessories/
│   └── Sets/
│
├── Consumables/
│   ├── Potions/
│   ├── Food/
│   ├── Scrolls/
│   └── BattleItems/
│
├── Materials/
│   ├── Common/
│   ├── MonsterDrops/
│   ├── Ore/
│   └── Special/
│
├── QuestItems/
├── SkillBooks/
├── Currency/
└── Tables/
```

---

## 3. 工具主界面布局

### 3.1 总体布局

```text
┌──────────────────────────────────────────────────────────────┐
│ 顶部工具栏：新建 / 复制 / 保存 / 校验 / 导入 / 导出 / 搜索     │
├───────────────┬──────────────────────────────┬───────────────┤
│ 左侧物品列表   │ 中间配置详情                  │ 右侧预览区      │
│ 分类树         │ 基础信息                      │ 图标预览        │
│ 搜索框         │ 数值                          │ UI卡片预览      │
│ 筛选器         │ 效果                          │ 装备对比预览    │
│ 物品条目       │ 表现                          │ 使用表现预览    │
│               │ 掉落/商店/任务关联             │               │
├───────────────┴──────────────────────────────┴───────────────┤
│ 底部：错误校验、引用关系、修改记录、运行时测试按钮             │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 左侧物品列表

左侧分为：

```text
搜索栏
分类树
品质筛选
类型筛选
等级筛选
物品列表
```

分类树：

```text
全部物品
├── 装备
│   ├── 武器
│   ├── 头部
│   ├── 身体
│   ├── 饰品
│   └── 套装
│
├── 消耗品
│   ├── 生命药水
│   ├── 魔法药水
│   ├── 食物
│   ├── 卷轴
│   └── 战斗道具
│
├── 材料
│   ├── 强化材料
│   ├── 怪物掉落
│   ├── 矿石
│   └── 特殊材料
│
├── 任务物品
├── 技能书
├── 货币
└── 特殊道具
```

物品列表每行显示：

```text
图标
名称
ID
品质颜色
类型
等级需求
是否已启用
错误提示标记
```

---

## 4. 物品总分类

### 4.1 ItemType

```text
Equipment      装备
Consumable     消耗品
Material       材料
QuestItem      任务物品
SkillBook      技能书
Currency       货币
ChestKey       钥匙
Special        特殊道具
Debug          调试物品
```

### 4.2 EquipmentType

```text
Weapon         武器
Head           头部
Body           身体
Accessory      饰品
Charm          护符
Mount          坐骑 / 云 / 轮椅等特殊外观，可选
Costume        外观
```

### 4.3 ConsumableType

```text
HealPotion       生命药水
ManaPotion       魔法药水
BuffPotion       增益药水
CleanseItem      净化 / 解毒
Food             食物
Scroll           卷轴
BattleItem       战斗投掷物
ReviveItem       复活道具
TeleportItem     传送道具
```

---

## 5. 基础信息配置页

### 5.1 字段结构

| 字段 | 类型 | 说明 |
|---|---|---|
| ItemID | string | 物品唯一 ID，不可重复 |
| DisplayName | string | 游戏内显示名 |
| ItemType | enum | 物品类型 |
| SubType | enum | 子类型 |
| Quality | enum | 品质 |
| Icon | Sprite | 图标 |
| SmallIcon | Sprite | 小图标，可选 |
| Description | text | 描述 |
| FlavorText | text | 背景文案 |
| MaxStack | int | 最大堆叠数量 |
| CanStack | bool | 是否可堆叠 |
| CanSell | bool | 是否可出售 |
| SellPrice | int | 出售价 |
| BuyPrice | int | 默认购买价 |
| CanDrop | bool | 是否可掉落 |
| CanDiscard | bool | 是否可丢弃 |
| CanLock | bool | 是否可锁定 |
| IsUnique | bool | 是否唯一 |
| IsAccountBound | bool | 是否账号绑定，可选 |
| IsQuestRelated | bool | 是否任务相关 |
| EnableInGame | bool | 是否启用 |

### 5.2 ID 命名规则

```text
EQ_Weapon_WoodSword_01
EQ_Head_GrassHat_01
EQ_Body_BeeArmor_01
ITEM_HP_Small
ITEM_MP_Small
MAT_BeeWing
QITEM_MedicineBag
SKILLBOOK_FireRing
KEY_AncientDoor
```

规则：

```text
全大类前缀
英文语义清楚
不要使用中文 ID
不要使用空格
同类物品编号递增
```

---

## 6. 品质配置

### 6.1 品质枚举

```text
Common      普通
Uncommon    优秀
Rare        稀有
Epic        史诗
Legendary   传说
Mythic      神话，可选
Quest       任务
Unique      唯一
```

### 6.2 品质表现配置

| 品质 | 边框 | 名称颜色 | 掉落光柱 | 获得提示 |
|---|---|---|---|---|
| 普通 | 灰白 | 白色 | 无 | Toast |
| 优秀 | 绿色 | 绿色 | 小绿光 | Toast |
| 稀有 | 蓝色 | 蓝色 | 蓝光柱 | 小弹窗 |
| 史诗 | 紫色 | 紫色 | 紫光柱 | 大弹窗 |
| 传说 | 橙金 | 橙金 | 金光柱 | 大弹窗 + 音效 |
| 神话 | 红金 | 红金 | 红金光柱 | 特殊弹窗 |
| 任务 | 黄色 | 黄色 | 任务光 | 任务提示 |

### 6.3 品质配置字段

```text
QualityID
DisplayName
NameColor
FrameSprite
GlowVFX
DropBeamVFX
PickupSFX
InventoryFrame
TooltipFrame
NeedConfirmWhenSell
NeedConfirmWhenDiscard
```

---

## 7. 图标与 UI 表现配置

### 7.1 图标字段

```text
Icon_Main          主图标
Icon_Small         小图标
Icon_Grayscale     未解锁灰图，可自动生成
Icon_Background    图标底板，可选
Icon_Overlay       角标图层，可选
```

### 7.2 背包显示规则

物品格子显示：

```text
品质边框
物品图标
数量数字
锁定图标
新获得标记
任务标记
可装备箭头
已装备标记
冷却遮罩，消耗品可选
```

### 7.3 Tooltip 显示规则

Tooltip 必须显示：

```text
名称
品质
类型
等级需求
绑定/锁定状态
主要效果
详细描述
出售价格
来源，可选
快捷操作按钮
```

装备 Tooltip 额外显示：

```text
装备槽位
基础属性
附加属性
套装属性
与当前装备对比
强化等级
耐久，可选
```

消耗品 Tooltip 额外显示：

```text
使用效果
冷却时间
是否战斗中可用
使用条件
最大携带数量
```

---

## 8. 装备配置页

### 8.1 装备基础字段

| 字段 | 类型 | 说明 |
|---|---|---|
| EquipmentSlot | enum | 装备槽位 |
| RequiredLevel | int | 等级需求 |
| RequiredClass | enum/list | 职业需求，可选 |
| RequiredFaction | enum/list | 阵营需求，可选 |
| EquipSound | AudioClip | 装备音效 |
| UnequipSound | AudioClip | 卸下音效 |
| EquipVFX | Prefab | 装备特效 |
| ModelSpriteOverride | Sprite | 外观替换，可选 |
| CanEnhance | bool | 是否可强化 |
| EnhanceMaxLevel | int | 强化上限 |
| CanEnchant | bool | 是否可附魔 |
| CanRefine | bool | 是否可重铸 |
| SetID | string | 套装 ID，可选 |

### 8.2 装备槽位

```text
Weapon
Head
Body
Accessory1
Accessory2
Charm
Special
Costume
```

第一版建议只做：

```text
Weapon
Head
Body
Accessory1
```

---

## 9. 装备数值配置

### 9.1 基础属性字段

装备可增加：

```text
MaxHP
MaxMP
Attack
MagicAttack
Defense
MagicDefense
CritRate
CritDamage
MoveSpeed
AttackSpeed
SkillCooldownRate
ElementDamageBonus
ElementResist
HitStunResistance
KnockbackResistance
LaunchResistance
GoldDropBonus
ExpBonus
```

### 9.2 数值配置结构

每条属性用统一结构：

```text
StatModifier
├── StatType
├── Value
├── ValueType
├── DisplayFormat
└── IsMainStat
```

ValueType：

```text
Flat        固定值，例如 攻击 +10
Percent     百分比，例如 暴击 +5%
Multiplier  乘区，例如 火焰伤害 x1.2
Override    覆盖，例如 移速固定为 6
```

### 9.3 装备属性显示顺序

```text
攻击
魔法攻击
防御
生命
法力
暴击率
暴击伤害
攻速
移速
冷却缩减
元素伤害
元素抗性
特殊效果
```

### 9.4 装备对比规则

当前装备和选中装备对比：

```text
增加：绿色 ↑
减少：红色 ↓
不变：灰色 -
新属性：绿色 新
失去属性：红色 移除
```

示例：

```text
攻击 18 → 25  ↑ +7
防御 8 → 4    ↓ -4
暴击率 0% → 3%  新
```

---

## 10. 装备特殊效果配置

### 10.1 装备效果类型

```text
OnEquip              装备后生效
OnUnequip            卸下时移除
OnAttackHit          攻击命中时
OnCrit               暴击时
OnKill               击杀时
OnDamageTaken        受到伤害时
OnLowHP              低血时
OnSkillCast          释放技能时
OnDash               闪避时
OnJump               跳跃时
PassiveAura          被动光环
```

### 10.2 效果结构

```text
ItemEffect
├── EffectID
├── TriggerType
├── ConditionList
├── EffectType
├── Value
├── Duration
├── Cooldown
├── Chance
├── TargetType
├── BuffID
├── VFX
├── SFX
└── DescriptionTemplate
```

### 10.3 常见效果

```text
攻击命中时 10% 概率造成灼烧
暴击时回复 5 点 MP
击杀敌人后获得 2 秒移速提升
生命低于 30% 时获得护盾，冷却 30 秒
火焰技能伤害 +15%
闪避后下一次普攻必定暴击
```

### 10.4 效果显示

Tooltip 中显示：

```text
特殊效果：
攻击命中时有 10% 概率使敌人灼烧 4 秒。
冷却：2 秒。
```

---

## 11. 套装配置

### 11.1 套装结构

```text
SetID
SetName
SetItems
SetBonus_2
SetBonus_3
SetBonus_4
```

### 11.2 套装效果示例

```text
草原守护套装
2件：生命 +50
3件：受到草系怪物伤害 -10%
4件：使用药水时额外恢复 20%
```

### 11.3 套装 Tooltip

装备 Tooltip 需要显示：

```text
套装名
已装备件数 / 总件数
各件装备名称
已激活套装效果高亮
未激活套装效果灰色
```

---

## 12. 装备强化配置

### 12.1 强化字段

```text
CanEnhance
EnhanceLevel
EnhanceMaxLevel
EnhanceCostTable
EnhanceStatGrowth
EnhanceVFX
EnhanceSFX
```

### 12.2 强化消耗结构

```text
EnhanceLevel
GoldCost
MaterialCostList
SuccessRate
FailResult
```

第一版推荐：

```text
100% 成功
无失败
无降级
```

### 12.3 强化属性成长

可以选择两种模式：

```text
模式 A：固定成长
每级攻击 +2

模式 B：按倍率成长
每级基础属性 +8%
```

### 12.4 强化预览

铁匠铺界面显示：

```text
当前等级
强化后等级
当前属性
强化后属性
消耗材料
强化按钮状态
```

---

## 13. 消耗品配置页

### 13.1 消耗品基础字段

| 字段 | 说明 |
|---|---|
| UseType | 使用类型 |
| CanUseInCombat | 战斗中可用 |
| CanUseOutCombat | 非战斗可用 |
| UseCooldown | 使用冷却 |
| SharedCooldownGroup | 共享冷却组 |
| UseCastTime | 使用前摇 |
| InterruptOnHit | 受击是否打断 |
| TargetType | 目标类型 |
| ConsumeOnUse | 使用后是否消耗 |
| UseVFX | 使用特效 |
| UseSFX | 使用音效 |

### 13.2 UseType

```text
Instant             立即生效
Cast                读条使用
TargetUnit          对目标使用
TargetGround        对地点使用
AreaAroundSelf      自身周围范围
ThrowProjectile     投掷物
OpenUI              打开界面
TriggerQuest        触发任务
```

### 13.3 消耗品效果

```text
恢复生命
恢复法力
添加 Buff
解除 Debuff
造成范围伤害
召唤单位
传送
复活
开启宝箱
学习技能
```

### 13.4 药水配置示例

```text
ItemID: ITEM_HP_SMALL
Name: 小型生命药水
Type: Consumable
CanUseInCombat: true
UseCooldown: 10
SharedCooldownGroup: Potion
Effect:
    RestoreHP 100
VFX: VFX_Heal_Small
SFX: SFX_Potion_Drink
```

---

## 14. 材料配置页

### 14.1 材料字段

```text
MaterialType
UsedFor
Rarity
CanSell
SourceDescription
RelatedCraftList
```

MaterialType：

```text
EnhanceMaterial      强化材料
CraftMaterial        制作材料
QuestMaterial        任务材料
MonsterDrop          怪物掉落
Ore                  矿石
Herb                 草药
Special              特殊材料
```

UsedFor：

```text
强化装备
升级技能
制作药水
完成任务
兑换奖励
解锁建筑
```

### 14.2 材料 Tooltip

显示：

```text
材料名称
品质
用途
来源
拥有数量
是否任务需要
```

---

## 15. 任务物品配置页

### 15.1 任务物品字段

```text
QuestID
ObjectiveID
CanUseManually
RemoveWhenQuestComplete
ShowInInventory
CanDiscard
QuestMarkerIcon
```

### 15.2 任务物品规则

默认：

```text
不能出售
不能丢弃
不能分解
不参与普通排序
显示任务角标
任务完成后自动移除，按配置决定
```

### 15.3 任务物品 Tooltip

```text
任务物品
属于任务：《丢失的药包》
用途：交给药水商人
```

---

## 16. 技能书配置页

### 16.1 技能书字段

```text
SkillID
LearnSkillLevel
CanUseIfAlreadyKnown
DuplicateConvertItem
RequiredLevel
RequiredClass
UseSFX
UseVFX
```

### 16.2 技能书使用规则

```text
如果未学习技能：学习技能
如果已学习技能：转化为技能经验 / 材料 / 禁止使用
如果等级不足：按钮置灰并提示
```

### 16.3 技能书 Tooltip

```text
使用后学习技能：火环术
需求等级：Lv4
已学习时转化为：火种 x1
```

---

## 17. 钥匙与特殊道具配置

### 17.1 钥匙字段

```text
KeyType
TargetLockID
ConsumeOnUnlock
CanOpenMultiple
UnlockVFX
UnlockSFX
```

KeyType：

```text
DoorKey
ChestKey
DungeonKey
QuestKey
UniversalKey
```

### 17.2 特殊道具示例

```text
回城卷轴
传送石
复活羽毛
剧情信物
能力解锁石
地图标记道具
```

---

## 18. 物品效果编辑器

### 18.1 效果编辑器作用

所有装备效果、消耗品效果、材料使用效果都用统一效果编辑器。

支持：

```text
添加效果
删除效果
排序效果
配置触发条件
配置目标
配置数值
配置持续时间
配置冷却
配置概率
配置表现
```

### 18.2 EffectType

```text
RestoreHP
RestoreMP
ModifyStat
AddBuff
RemoveBuff
RemoveDebuff
DealDamage
DealElementDamage
SpawnProjectile
SpawnSummon
Teleport
LearnSkill
AddCurrency
AddQuestProgress
UnlockAbility
OpenUI
PlayCutscene
```

### 18.3 ConditionType

```text
Always
InCombat
OutOfCombat
HPBelowPercent
MPAboveValue
TargetHasBuff
TargetNotHasBuff
PlayerLevelGreater
QuestActive
QuestCompleted
ItemCountEnough
RandomChance
CooldownReady
```

### 18.4 TargetType

```text
Self
CurrentTarget
NearestEnemy
AreaAroundSelf
AllEnemiesInRange
AllAlliesInRange
QuestTarget
None
```

---

## 19. 表现配置页

### 19.1 获得表现

字段：

```text
PickupVFX
PickupSFX
DropVFX
DropBeamVFX
ToastStyle
PopupStyle
ScreenShakeOnPickup
```

规则：

```text
普通物品：小 Toast
稀有装备：装备获得弹窗
史诗以上：全屏获得提示
任务物品：任务提示
金币：飞向金币栏
经验：飞向经验条
```

### 19.2 使用表现

字段：

```text
UseAnimation
UseVFX
UseSFX
UseScreenEffect
UseCastBar
UseFloatingText
```

示例：

```text
喝药水：角色头顶绿色 +100，播放喝药音效
技能书：书本光效，显示“学会火环术”
回城卷轴：传送法阵，屏幕淡出
```

### 19.3 掉落表现

字段：

```text
WorldDropPrefab
DropIcon
DropShadow
DropBounceAnimation
AutoPickup
PickupRange
ManualPickupRange
ExpireTime
```

掉落动画：

```text
从怪物位置弹出
落地弹跳 1~2 次
品质光效显示
靠近后吸附
```

---

## 20. 商店配置关联

物品编辑器内可以显示引用关系：

```text
这个物品在哪些商店出售
价格是多少
库存是多少
解锁条件是什么
```

字段：

```text
ShopID
BuyPriceOverride
Stock
UnlockCondition
RefreshType
DiscountGroup
```

商店价格优先级：

```text
商店单独价格 > 物品默认购买价 > 系统默认价格公式
```

---

## 21. 掉落配置关联

物品编辑器显示：

```text
哪些怪物会掉这个物品
掉率是多少
掉落数量是多少
是否任务限定
```

字段：

```text
DropTableID
MonsterID
DropRate
MinCount
MaxCount
RequiredQuest
WorldLevelRange
```

---

## 22. 任务配置关联

物品可以关联：

```text
任务奖励
任务目标
任务需求
任务消耗
任务交付物
```

显示：

```text
被哪些任务使用
哪个任务奖励它
哪个任务完成后移除它
```

---

## 23. 存档数据规则

### 23.1 物品实例数据

背包里每个物品实例保存：

```text
ItemID
Count
IsLocked
EnhanceLevel
RandomAffixList
Durability，可选
CreateTime
InstanceID，装备需要
```

### 23.2 堆叠物品

堆叠物品只保存：

```text
ItemID
Count
```

### 23.3 装备实例

装备如果有强化、随机词条，需要独立实例：

```text
InstanceID
ItemID
EnhanceLevel
Affixes
IsLocked
IsEquipped
```

---

## 24. 随机词条配置，可选

### 24.1 词条字段

```text
AffixID
AffixName
StatType
ValueRangeMin
ValueRangeMax
ValueType
QualityWeight
AllowedEquipmentSlots
RequiredItemLevel
```

### 24.2 词条池

```text
WeaponAffixPool
ArmorAffixPool
AccessoryAffixPool
ElementAffixPool
SpecialAffixPool
```

第一版可以先不做随机词条，装备属性固定。

---

## 25. 预览区设计

右侧预览区包含：

```text
图标预览
背包格子预览
Tooltip 预览
装备对比预览
世界掉落预览
获得弹窗预览
使用效果预览
```

### 25.1 背包格子预览

显示：

```text
品质框
图标
数量
锁定
新获得
任务角标
```

### 25.2 Tooltip 预览

根据当前配置实时生成 Tooltip。

### 25.3 装备对比预览

允许选择一个假想当前装备：

```text
当前装备
新装备
属性变化
```

### 25.4 使用效果预览

点击测试按钮：

```text
播放使用音效
播放使用特效
显示跳字
显示 Buff 图标
```

---

## 26. 配置校验规则

### 26.1 Error 必须修复

```text
ItemID 为空
ItemID 重复
名称为空
图标缺失
装备没有槽位
消耗品没有效果
任务物品没有 QuestID，但标记为任务物品
品质未配置
最大堆叠数小于 1
出售价格为负数
强化开启但没有强化消耗表
技能书没有绑定 SkillID
钥匙没有绑定 TargetLockID
```

### 26.2 Warning 可保存但提示

```text
物品没有描述
装备没有任何属性
稀有以上物品没有获得特效
可出售但售价为 0
消耗品可战斗中使用但没有冷却
材料没有用途说明
任务物品显示在背包但不能查看描述
装备效果没有描述模板
```

---

## 27. 数据结构建议

### 27.1 ItemConfig

```text
ItemConfig
├── BasicInfo
├── IconConfig
├── QualityConfigRef
├── StackConfig
├── PriceConfig
├── InventoryDisplayConfig
├── TooltipConfig
├── EffectList
├── PresentationConfig
├── ReferenceInfo
└── ValidationInfo
```

### 27.2 EquipmentConfig

```text
EquipmentConfig : ItemConfig
├── EquipmentSlot
├── RequiredLevel
├── StatModifiers
├── SpecialEffects
├── EnhanceConfig
├── SetConfigRef
├── AppearanceOverride
└── EquipPresentation
```

### 27.3 ConsumableConfig

```text
ConsumableConfig : ItemConfig
├── UseType
├── UseConditions
├── UseEffects
├── Cooldown
├── SharedCooldownGroup
├── UsePresentation
└── TargetRules
```

---

## 28. 数据表示例

### 28.1 ItemConfig.csv

```csv
ItemID,Name,ItemType,SubType,Quality,Icon,MaxStack,BuyPrice,SellPrice,CanSell,CanDiscard,Description
ITEM_HP_SMALL,小型生命药水,Consumable,HealPotion,Common,Icon_HP_Small,20,50,10,true,true,恢复少量生命。
MAT_BeeWing,蜂翼,Material,MonsterDrop,Uncommon,Icon_BeeWing,99,0,8,true,true,毒蜂掉落的轻薄翅翼，可用于强化装备。
QITEM_MedicineBag,丢失的药包,QuestItem,Quest,Quest,Icon_MedicineBag,1,0,0,false,false,药水商人丢失的药包。
EQ_BeeStingSword,蜂刺短剑,Equipment,Weapon,Rare,Icon_BeeStingSword,1,0,120,true,true,由蜂王毒刺制成的短剑。
```

### 28.2 EquipmentStats.csv

```csv
ItemID,StatType,Value,ValueType,IsMainStat
EQ_BeeStingSword,Attack,18,Flat,true
EQ_BeeStingSword,CritRate,0.04,Percent,false
EQ_BeeStingSword,PoisonResist,0.10,Percent,false
EQ_GrassArmor,Defense,8,Flat,true
EQ_GrassArmor,MaxHP,25,Flat,false
```

### 28.3 ItemEffect.csv

```csv
ItemID,EffectID,TriggerType,EffectType,TargetType,Value,Duration,Cooldown,Chance,BuffID
ITEM_HP_SMALL,EFFECT_HP_SMALL,OnUse,RestoreHP,Self,100,0,10,1,
ITEM_ANTIDOTE,EFFECT_CLEANSE_POISON,OnUse,RemoveDebuff,Self,0,0,8,1,Poison
EQ_BeeStingSword,EFFECT_POISON_HIT,OnAttackHit,AddBuff,Target,0,4,2,0.15,Poison
```

### 28.4 EnhanceCost.csv

```csv
Quality,EnhanceLevel,GoldCost,MaterialID,MaterialCount
Common,1,80,MAT_WoodChip,1
Common,2,160,MAT_WoodChip,2
Common,3,300,MAT_IronNail,1
Rare,1,150,MAT_BeeWing,1
Rare,2,300,MAT_BeeWing,2
Rare,3,600,MAT_FireSeed,1
```

---

## 29. Unity 预制体 / 脚本结构

### 29.1 Editor 目录

```text
Assets/Game/Items/Editor/
├── ItemConfigEditorWindow.cs
├── ItemListPanel.cs
├── ItemBasicInfoPanel.cs
├── EquipmentConfigPanel.cs
├── ConsumableConfigPanel.cs
├── ItemEffectEditorPanel.cs
├── ItemPresentationPanel.cs
├── ItemPreviewPanel.cs
├── ItemReferencePanel.cs
├── ItemValidationPanel.cs
└── ItemConfigValidator.cs
```

### 29.2 Runtime 目录

```text
Assets/Game/Items/Runtime/
├── ItemConfig.cs
├── EquipmentConfig.cs
├── ConsumableConfig.cs
├── MaterialConfig.cs
├── QuestItemConfig.cs
├── SkillBookConfig.cs
├── ItemEffectConfig.cs
├── ItemRuntimeInstance.cs
├── InventoryItemStack.cs
├── ItemEffectRunner.cs
├── EquipmentStatCalculator.cs
├── ItemPresentationController.cs
└── ItemDatabase.cs
```

### 29.3 UI 目录

```text
Assets/Game/UI/Items/
├── InventoryItemCellUI.cs
├── ItemTooltipUI.cs
├── EquipmentCompareUI.cs
├── ItemGetPopupUI.cs
├── ItemUseConfirmUI.cs
├── ItemSplitStackUI.cs
└── ItemSellConfirmUI.cs
```

---

## 30. 运行时流程

### 30.1 获得物品

```text
掉落 / 奖励 / 商店购买
→ 根据 ItemID 查 ItemConfig
→ 判断是否可堆叠
→ 加入背包
→ 播放获得表现
→ 如果是稀有物品，弹出获得窗口
→ 保存背包数据
```

### 30.2 使用物品

```text
玩家点击使用
→ 检查使用条件
→ 检查冷却
→ 检查目标
→ 执行 ItemEffectList
→ 播放 UseVFX / UseSFX
→ 扣除数量
→ 刷新 UI
→ 保存数据
```

### 30.3 装备物品

```text
玩家点击装备
→ 检查等级 / 职业 / 槽位
→ 卸下当前槽位装备
→ 装备新装备
→ 重新计算属性
→ 刷新角色外观，可选
→ 播放装备音效
→ 保存数据
```

### 30.4 出售物品

```text
点击出售
→ 检查是否可出售
→ 如果高品质，弹确认
→ 扣除物品
→ 增加金币
→ 播放出售音效
→ 保存数据
```

---

## 31. MVP 开发范围

第一版必须做：

```text
物品基础信息配置
图标配置
品质配置
装备槽位配置
装备基础属性配置
消耗品使用效果配置
材料配置
任务物品配置
售价 / 买价配置
背包显示预览
Tooltip 预览
装备对比预览
效果编辑器基础版
配置校验
ScriptableObject 保存
运行时读取 ItemDatabase
```

第一版可以不做：

```text
随机词条
套装
附魔
重铸
耐久
账号绑定
复杂制作系统
复杂外部 JSON 导入
批量 Excel 导入
```

---

## 32. 开发顺序

```text
第 1 步：定义 ItemConfig / EquipmentConfig / ConsumableConfig 数据结构
第 2 步：制作 ItemDatabase
第 3 步：制作物品配置编辑器基础信息页
第 4 步：制作装备属性配置页
第 5 步：制作消耗品效果配置页
第 6 步：制作图标和 Tooltip 预览
第 7 步：接入背包 UI 读取 ItemConfig
第 8 步：接入装备属性计算
第 9 步：接入物品使用效果执行
第 10 步：接入商店 / 掉落 / 任务引用关系
第 11 步：制作配置校验
第 12 步：补表现配置和获得弹窗
第 13 步：补强化 / 套装等扩展
```

---

## 33. 验收标准

### 33.1 配置工具验收

```text
可以新建物品
可以配置物品类型和品质
可以配置图标
可以配置装备属性
可以配置消耗品效果
可以配置材料用途
可以配置任务物品
可以预览背包格子
可以预览 Tooltip
可以保存配置
配置错误会提示
```

### 33.2 游戏运行验收

```text
背包能正确显示物品图标和数量
装备能正确穿戴
装备属性能正确加到角色身上
装备对比显示正确
消耗品能按效果生效
药水能恢复生命
任务物品不能出售或丢弃
材料能堆叠
商店能读取价格
掉落能根据 ItemID 生成物品
```

### 33.3 表现验收

```text
不同品质框体正确
稀有物品获得有弹窗
使用物品有音效和特效
装备时有音效
金币 / 材料获得有 Toast
Tooltip 信息完整
```

---

## 34. 总结

这个物品配置工具的核心是把所有物品统一成：

```text
基础信息
分类
品质
图标
数值
效果
表现
来源
用途
运行时规则
```

装备重点看：

```text
槽位
属性
特殊效果
强化
对比
外观
```

消耗品重点看：

```text
使用条件
使用效果
冷却
目标
表现
```

材料和任务物品重点看：

```text
用途
来源
是否可出售 / 丢弃
任务关联
```

最终目标：

```text
以后你新增一把剑、一个药水、一个材料、一个任务物品，都只需要在这个工具里配置，不需要重新写系统逻辑。
```
