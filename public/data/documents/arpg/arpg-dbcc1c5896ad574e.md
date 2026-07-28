# 83 交互提示与拾取标签规则：NPC、宝箱、机关、传送、掉落物

> 项目：Unity 3D ACT 暗黑刷宝 ARPG  
> 文档批次：第七批 HUD 全规则  
> 原则：参考同类暗黑刷宝 ARPG 的信息层级与战斗可读性，不复制任何商业游戏的 UI 视觉、图标、专有名称或具体数值。  
> 目标：所有头顶信息、血条、跳字、Buff、交互提示、拾取标签、Boss 条、目标提示都可以由策划配置，程序只实现通用规则。

## 1. 设计目标

交互 HUD 负责告诉玩家：

- 这里能不能互动。
- 按什么键互动。
- 互动会发生什么。
- 条件是否满足。
- 掉落物是否值得捡。

ACT 3D 操作中，玩家移动快、镜头可旋转，因此交互提示必须稳定、明确、不能误触。

---

## 2. 交互物类型

```text
InteractableType
├── NPC_Dialog
├── NPC_Shop
├── NPC_Blacksmith
├── NPC_SkillVendor
├── NPC_Stash
├── NPC_Teleport
├── Chest_Common
├── Chest_Rare
├── Chest_Cursed
├── Breakable
├── Door
├── Lever
├── Shrine
├── QuestObject
├── Portal_Town
├── Portal_MapExit
├── MapDevice
└── LootDrop
```

---

## 3. 交互提示结构

```text
Prefab_InteractionPrompt
├── Root
│   ├── CanvasGroup
│   ├── Panel_Backplate
│   ├── Icon_ObjectType
│   ├── Text_ObjectName
│   ├── InputPrompt
│   │   ├── Icon_KeyOrButton
│   │   └── Text_ActionVerb
│   ├── Text_ConditionLine
│   ├── Icon_State
│   └── Anim_FocusPulse
```

示例：

```text
[宝箱图标] 古旧宝箱
[E] 开启
```

条件不足：

```text
[门图标] 黑炉大门
需要：黑炉钥匙
```

危险交互：

```text
[诅咒箱] 低语宝箱
长按 [E] 开启，将召唤敌人
```

---

## 4. 焦点选择规则

玩家附近可能有多个交互物，必须有统一焦点规则。

### 4.1 焦点评分

```text
Score = 距离分 + 屏幕中心分 + 朝向分 + 优先级分 + 任务权重
```

| 因素 | 说明 |
|---|---|
| 距离分 | 越近越高 |
| 屏幕中心分 | 越靠近屏幕中心越高 |
| 朝向分 | 玩家朝向/镜头朝向越接近越高 |
| 优先级分 | 任务物 > 传送门 > NPC > 宝箱 > 可破坏物 |
| 任务权重 | 当前任务目标强加权 |

### 4.2 焦点唯一性

- 同一时间只有 1 个主交互焦点。
- 其他可交互物只显示弱标签或不显示按键。
- 手柄/移动端必须依赖焦点系统。
- 鼠标悬浮可以临时覆盖焦点。

---

## 5. NPC 交互提示

### 5.1 功能 NPC

| NPC | 按钮文本 | 打开 UI |
|---|---|---|
| 普通对话 NPC | 对话 | DialogPanel |
| 商店 NPC | 交易 | ShopPanel |
| 铁匠 | 打造 | BlacksmithPanel |
| 技能商人 | 技能 | SkillVendorPanel |
| 仓库管理员 | 仓库 | StashPanel |
| 传送 NPC | 传送 | TeleportPanel |
| 地图装置 NPC/物件 | 地图装置 | MapDevicePanel |

### 5.2 NPC 提示层级

```text
远距离：只显示功能图标
中距离：显示 NPC 名称 + 功能
近距离：显示按键提示
焦点：提示放大 + 背板变亮
交互中：隐藏头顶按键，打开对应 UI
```

---

## 6. 宝箱提示

### 6.1 宝箱类型

| 宝箱 | 标签显示 | 风险提示 | 奖励提示 |
|---|---|---|---|
| 普通宝箱 | 近距离显示 | 无 | 无 |
| 精致宝箱 | 中距离显示 | 无 | 外框高亮 |
| 稀有宝箱 | 中远距离显示 | 可能有守卫 | 稀有边框 |
| 诅咒宝箱 | 常驻或中距离 | 必须提示危险 | 长按确认 |
| Boss 奖励箱 | Boss 死后显示 | 无 | 强高亮 |
| 任务宝箱 | 任务范围显示 | 无 | 任务图标 |

### 6.2 宝箱状态

```text
Closed      # 未开启
Focused     # 当前焦点
Locked      # 锁住，需要钥匙/条件
Cursed      # 诅咒，需要长按
Opening     # 开启动画中
Opened      # 已开启，标签隐藏或灰化
RewardReady # 掉落待生成/已生成
```

---

## 7. 可破坏物提示

可破坏物通常不显示文字，避免场景杂乱。

显示例外：

- 教学阶段提示“攻击木桶”。
- 任务要求破坏某个物件。
- 可破坏物内有高价值奖励。
- 机关型可破坏物会影响战斗。

规则：

| 类型 | 默认名称 | 交互方式 |
|---|---|---|
| 木桶/罐子 | 不显示 | 攻击破坏 |
| 石柱/墙壁 | 不显示或任务显示 | 攻击/技能破坏 |
| 爆炸桶 | 显示危险图标 | 攻击触发 |
| 任务障碍 | 显示任务图标 | 攻击/互动 |

---

## 8. 机关提示

机关需要明确“是否可用、是否危险、是否已激活”。

| 机关 | 提示 | 状态 |
|---|---|---|
| 拉杆 | [E] 拉动 | 未激活/已激活 |
| 压力板 | 站上激活 | 可显示地面轮廓 |
| 旋钮机关 | [E] 旋转 | 进度/方向 |
| 祭坛 | [E] 触碰 | 增益/风险 |
| 陷阱机关 | 危险图标 | 可破坏/不可破坏 |
| Boss 机制机关 | 强提示 | 阶段相关 |

危险机关必须用额外提示：

```text
长按 [E] 激活
警告：将召唤敌人
```

---

## 9. 传送与出口提示

### 9.1 传送类型

| 类型 | 显示 | 打开 |
|---|---|---|
| 主城传送点 | 常驻图标 + 名称 | 传送 UI |
| 回城门 | 中距离显示 | 直接回城或确认 |
| 地图出口 | 距离内显示 | 切场景 |
| Boss 出口 | Boss 死后显示 | 奖励结算/下一层 |
| 终局地图门 | 地图装置旁显示 | 进入终局图 |

### 9.2 出口状态

```text
Locked：未解锁
Available：可进入
DestinationUnknown：未知区域
Danger：高危险区域
Completed：已完成，不再高亮
```

---

## 10. 拾取标签规则

### 10.1 掉落物分类

```text
LootDrop
├── Currency         # 货币/打造材料
├── Equipment        # 装备
├── SkillItem        # 技能相关物
├── MapKey           # 地图钥石/地图物品
├── QuestItem        # 任务物品
├── Consumable       # 药剂/消耗品
├── CraftMaterial    # 材料
└── Gold             # 金币/通用资源
```

### 10.2 标签结构

```text
Prefab_LootLabel
├── Root
│   ├── Panel_Backplate
│   ├── Icon_ItemType
│   ├── Text_ItemName
│   ├── Text_Quantity
│   ├── Icon_Rarity
│   ├── CompareHint
│   └── Anim_Highlight
```

### 10.3 稀有度显示

| 稀有度 | 标签规则 |
|---|---|
| 普通 | 默认隐藏或按过滤器显示 |
| 魔法 | 简短显示，低亮度 |
| 稀有 | 明显边框，默认显示 |
| 传奇/独特 | 强高亮、音效、光柱 |
| 任务 | 永远显示，任务图标 |
| 货币/关键材料 | 按价值显示，高价值常驻 |
| 地图钥石 | 默认显示，特殊边框 |

### 10.4 拾取过滤器

拾取标签由 LootFilter 控制：

```text
HideLowValueWhiteItems
ShowClassUsefulBases
ShowHighTierCurrency
ShowQuestItemsAlways
ShowMapsAlways
HighlightUpgradePotential
CollapseGoldAndSmallCurrency
```

### 10.5 标签合并

同类小物品堆叠显示：

```text
金币 x128
碎晶 x6
```

同屏过多：

- 低价值标签隐藏。
- 同类货币合并。
- 高价值物保持原位显示。
- 按住 Alt 展开更多标签，但仍受最大显示上限。

---

## 11. 拾取交互规则

| 操作方式 | 行为 |
|---|---|
| 鼠标点击标签 | 拾取该物品 |
| 按拾取键 | 拾取当前焦点物品 |
| 长按拾取键 | 吸附附近低价值物，可配置 |
| 手柄 DPad | 切换拾取焦点 |
| 移动端点击标签 | 拾取/显示详情 |

拾取失败提示：

- 背包已满。
- 等级不足。
- 职业不可用。
- 任务条件不足。
- 距离过远。

---

## 12. 配置字段

```json
{
  "InteractionRuleId": "Chest_Cursed_Default",
  "TargetType": "Chest_Cursed",
  "DisplayNameMode": "ObjectName",
  "ActionVerb": "开启",
  "InputMode": "Hold",
  "HoldSeconds": 0.75,
  "ShowDangerWarning": true,
  "DangerText": "开启后将召唤敌人",
  "VisibleDistance": 18,
  "InteractDistance": 3.2,
  "Priority": 78,
  "RequiredConditionIds": [],
  "OnInteractUI": "None",
  "OnInteractEvent": "OpenCursedChest"
}
```

---

## 13. 验收标准

- 玩家靠近 NPC 时显示正确功能提示。
- 多个交互物靠近时，焦点不会乱跳。
- 宝箱、诅咒宝箱、任务物、传送门有不同提示。
- 可破坏物默认不污染 HUD，但任务相关能显示。
- 掉落物按照过滤器显示，高价值物不隐藏。
- 手柄模式下能切换拾取焦点。
- 背包满、条件不足、距离不足都有明确提示。
