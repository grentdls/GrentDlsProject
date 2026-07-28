# 131 天赋界面与节点详情卡重设计：分类、收益、路径、预览

## 1. 页面目标
天赋页必须解决：
- 当前节点是做什么的？
- 它属于什么类型？
- 点它能提升哪些属性？
- 点它要花多少点？
- 前置路径是否已满足？
- 点完后对角色面板影响多大？

---

## 2. 天赋页整体结构
```
PassivePageRoot
├── TopTabs（总天赋 / 专精 / 搜索 / 预设）
├── LeftOverviewPanel
│   ├── BuildSummaryCard
│   ├── FilterByTagPanel
│   ├── SearchPanel
│   └── NodeLegendPanel
├── CenterPassiveTreeViewport
│   ├── TreeCanvas
│   ├── PathHighlightLayer
│   ├── NodeLayer
│   └── SelectionPreviewLayer
└── RightNodeDetailPanel
    ├── NodeHeaderBlock
    ├── NodeEffectBlock
    ├── RouteAndCostBlock
    ├── PreviewChangeBlock
    └── ActionButtons
```

---

## 3. 节点视觉分级

### 3.1 节点类型
- 小型节点 Small Node
- 中型节点 Notable Node
- 大型关键节点 Keystone Node
- 专精节点 Ascend Node
- 起始节点 Start Node
- Atlas/终局节点（若扩展）

### 3.2 节点造型区分
- 小点：小圆
- 中点：大圆 + 描边
- 大点：特殊形状 + 强光
- 专精点：独立底座 / 带专精纹章
- 当前路径节点：连线高亮
- 已点亮节点：实心高亮
- 可点节点：边框闪烁
- 不可点节点：灰化

---

## 4. 节点详情结构

### 4.1 头部识别区 NodeHeaderBlock
显示：
- 节点名称
- 节点类型
- 节点标签
- 所属天赋环/专精分支
- 当前状态：已学习 / 可学习 / 未连通 / 点数不足

### 4.2 效果区 NodeEffectBlock
禁止写一大段描述，必须拆分：
- 主要收益
- 次级收益
- 机制效果
- 条件效果

例：
- +8% 投射物伤害
- +5% 投射物速度
- 命中被标记者时，额外获得 1 层精准

每条都配图标，并按分类着色。

### 4.3 标签系统
节点标签必须可视化：
- 进攻
- 防御
- 资源
- 暴击
- 异常
- 召唤
- 近战
- 远程
- 法术
- 元素
- 机动
- 诅咒
- 持续伤害

标签以 Chip 形式显示在标题下方。

---

## 5. 路径与消耗区 RouteAndCostBlock
显示项：
- 所需点数
- 前置节点
- 当前与该节点之间的最短路径
- 若自动规划，则显示还差多少点

表现形式：
- 使用流程条或“路径摘要卡”展示
- 高亮路径上的关键节点

示例：
```
需要 4 点
前置：迅捷弓手 -> 鹰眼姿态 -> 投射集中
```

---

## 6. 预览变化区 PreviewChangeBlock
这是增强可视性的关键区块。

### 6.1 点击前预览
当悬停或选中某个节点时，右侧显示：
- 点亮后角色面板变化
- 点亮后本职业核心属性变化
- 对当前技能的潜在增益摘要

### 6.2 数值预览规则
例：
- 总 DPS：12,450 -> 13,180（+730）
- 暴击率：24% -> 26%（+2%）
- 法力回复：61 -> 68（+7）

### 6.3 分类预览
分为：
- 输出变化
- 生存变化
- 资源变化
- 机动变化
- 机制变化

用 4 个小模块展示，不要混成一列文本。

---

## 7. 操作区 ActionButtons
- 学习节点
- 预览路径
- 取消预览
- 重置该点
- 重置路径
- 收藏节点
- 设为目标节点

规则：
- “学习节点”为主按钮
- “重置”使用警示色
- “点数不足”时主按钮灰化并显示 Tooltip

---

## 8. 天赋树左侧总览增强
左侧总览应增加：
- 当前剩余点数
- 已分配节点数
- 当前构筑标签统计
- 推荐方向摘要
- 搜索最近命中项

#### BuildSummaryCard
显示：
- 当前流派：近战火伤 / 毒弓 / 冰法 / 召唤 等
- 进攻 / 防御 / 资源 三项倾向条
- 当前核心关键词

---

## 9. 节点 Tooltip 规则
Tooltip 需显示：
- 节点名称
- 节点类型
- 所属分支
- 主要收益
- 条件收益
- 与当前角色的预测增益
- 学习条件
- 是否已连接路径

若按 Alt：
- 显示该节点与临近节点关系图

---

## 10. 预制体清单
- UI_PassiveNode_Small
- UI_PassiveNode_Medium
- UI_PassiveNode_Keystone
- UI_PassiveNode_Ascendancy
- UI_PassiveNodeTooltip
- UI_NodeDetailPanel
- UI_NodePreviewDiffBlock
- UI_NodeTagChip
- UI_NodePathSummary
- UI_PassiveLegendPanel

---

## 11. 验收标准
- 玩家在 1 秒内识别节点类型。
- 2 秒内识别节点主收益方向。
- 3 秒内看懂点亮后对自身面板的大致变化。
- “点数不足”“未连通”“前置未满足”必须清晰分开显示。
- 所有节点收益必须分点，不允许用纯段落埋信息。
