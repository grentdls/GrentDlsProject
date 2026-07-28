# Architecture

## 主要模块

- `Assets/Scripts/UI/`：主界面、HUD、选择面板、世界 HUD、技能冒泡、Prefab 解析等 UI 逻辑。
- `Assets/Scripts/Combat/`：攻击、伤害、战斗表现、伤害跳字入口。
- `Assets/Scripts/Units/`：单位控制、技能控制、单位管理。
- `Assets/Scripts/Buildings/`：建筑控制、生产、建造相关逻辑。
- `Assets/Scripts/Editor/`：Prefab 工作流生成器、编辑器工具。
- `Assets/Resources/UI/`：Prefab 库、皮肤资源和运行时可加载 UI Prefab。

## UI Prefab 架构

- `UiPrefabType` 定义可实例化的 UI 类型。
- `UiPrefabLibrary.asset` 负责将类型映射到 Prefab。
- `UiPrefabResolver` 是运行时 UI 实例化入口，只实例化 Prefab 并绑定动态数据。
- `UiPrefabWorkflowGenerator` 负责生成和重建标准 Prefab 结构。
- `UiPrefabSlot` 是唯一 Prefab 标记组件，用于标记 Prefab 类型和稳定槽位。

## 战斗 HUD 架构

- 固定战斗 HUD 以 `MainHudRoot_Prefab` 为总根。
- 单位/建筑头顶 HUD 由 `UnitOverheadUI` 注册到 `WorldHudManager`，世界坐标转屏幕坐标后显示。
- 技能喊名冒泡由 `SkillCalloutBubbleManager` 统一限流、合并、实例化和回收。
- 伤害跳字由 `CombatVisualManager` 统一对象池、实例化、动画和回收。
