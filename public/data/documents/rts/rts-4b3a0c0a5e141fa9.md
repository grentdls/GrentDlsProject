# 战斗 HUD 性能与刷新规范

## 刷新边界

- 单个资源变化只能刷新对应资源文本、经济按钮可用状态和必要的局部成本状态。
- 单位或建筑健康变化只能标记对应对象的头顶 HUD、选中详情和必要的战斗警报；不得触发全量 HUD 重建。
- 伤害计算、`TakeDamage`、`OnHealthChanged` 和 `DamageResolvedEvent` 保持单次调用链。表现层可以订阅事件，但不得重复扣血或重复计算伤害。

## 头顶 HUD

- `UnitOverheadUI` 订阅所属单位或建筑的 `OnHealthChanged`，以健康版本号标记脏状态。
- `WorldHudManager` 每帧只负责位置、可见性和必要的延迟受击动画；健康条静止时不得重复写入 `Image.fillAmount`、颜色或层级顺序。
- 固定节点和基础布局来自 `WorldHudItem_Prefab`。代码只能绑定节点并写入名称、数值、状态和显隐。
- `WorldHudItem` 必须挂在 `MainHudRoot_Prefab/OverlayLayer_ModalsAndTooltips` 现有宿主下；运行时不得创建新的可见 Canvas。
- 层级顺序在 HUD 实例创建时设置，运行时不允许每帧调用 `SetAsFirstSibling`/`SetAsLastSibling`。

## 事件合并

- 同一帧内的资源、任务和选择变化应通过脏标记合并，在对应的限频窗口一次刷新。
- 多目标攻击可以逐目标广播 `DamageResolvedEvent`，但溅射目标列表必须复用池对象；不得为每个目标创建临时列表。
- `DamageResolvedEvent` 应优先携带运行时来源/目标引用；订阅者可直接判断是否命中自身，只有兼容旧调用方时才回退到队伍与位置判断。
- 动态跳字、科技连线、小地图点位和队列条目可以由代码实例化，但宿主、固定容器和条目 Prefab 必须已经存在。
- 技能呼叫气泡同样只能挂在 `MainHudRoot_Prefab/OverlayLayer_ModalsAndTooltips`，不得运行时创建 `SkillCalloutCanvas`。
- 生存任务监听 `ResourceChangedEvent` 时只更新事件对应资源类型的库存目标；一次交易的多个资源事件不得导致无关任务重复计算。
- 技能范围目标查询优先使用 `UnitManager.GetUnitsInRange(..., results)` 填充式 API，控制器级 scratch 列表可复用但不得跨嵌套调用共享可变列表。

## 验证指标

- Unity Profiler 检查连续单体攻击、溅射、技能 Buff、连续扣费和生产队列时的 GC Alloc、Canvas/Layout rebuild 与 Scripts CPU。
- 在 PC 和移动端确认健康变化只更新受影响对象，Prefab 缺失时记录错误并停用对应区域，不得创建可见 fallback。
