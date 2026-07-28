# 架构说明

## 架构目标

本项目采用“轻量骨架、数据前置、后续可扩展”的 Unity 架构，优先保证：

- 可快速搭建 MVP
- 不为早期开发引入过度复杂的框架
- 数据与表现分离
- PC、移动端、手柄输入可共存
- 地图、战斗、任务、UI 能稳定扩展

## 分层结构

### Runtime

- `Bootstrap`
  - 启动入口
  - 全局配置读取
  - 会话状态初始化
- `Core`
  - 通用配置
  - 通用数据结构
  - 基础定义类型
- `Input`
  - 输入资源绑定
  - 输入动作读取
  - 多端输入适配
- `Gameplay`
  - `Characters`：玩家与角色移动、朝向、基础控制
  - `Combat`：战斗动作、伤害、技能入口
  - `World`：地图区域、交互点、洞穴、世界对象

### Editor

- 只放项目工具、自动化脚手架、校验工具
- 不写运行时依赖到编辑器程序集

## 核心原则

### 1. ScriptableObject 负责“静态定义”

以下内容优先使用 `ScriptableObject` 定义：

- 角色基础属性
- 敌人原型
- 技能定义
- 装备定义
- 区域定义
- 洞穴定义
- 任务定义
- 经济参数

### 2. MonoBehaviour 负责“场景实例行为”

`MonoBehaviour` 仅负责：

- 场景对象生命周期
- 输入转行为
- 物理与动画驱动
- 组件协作

不要让 `MonoBehaviour` 承担大型配置数据库职责。

### 3. 运行时状态与静态配置分离

- 静态配置：定义“这个东西是什么”
- 运行时状态：定义“这个东西现在变成了什么”

示例：

- `CharacterStatsDefinition`：角色初始模板
- `PlayerRuntimeData`：玩家当前等级、金币、已装备内容

### 4. 先模块解耦，再逐步补联动

早期系统尽量通过明确入口连接，不要一开始写大量隐式依赖。

首选依赖方向：

```text
Bootstrap -> Config / Session
Input -> Character Controller
Character Controller -> Motor
Gameplay Systems -> Definitions
UI -> Runtime State / Definitions
```

避免：

```text
UI 直接驱动大量底层逻辑
Enemy 直接依赖具体 UI
World 直接依赖具体菜单实现
```

## 场景策略

## 当前规则

- 保留现有 `Assets/Scenes/SampleScene.unity`，不直接重构其 YAML
- 后续正式场景放入 `Assets/Game/Scenes`
- 通过编辑器工具向场景中注入 `GameBootstrapper` 等基础对象

## 目标场景拆分

- `Boot`
- `MainMenu`
- `World_StarterField`
- `Town_Starter`
- `Dungeon_Starter`
- `Sandbox_Combat`

本阶段先搭架构，不强制创建全部场景资源。

## 数据入口策略

### 优先级

1. `ScriptableObject` 配置
2. Inspector 序列化字段
3. 运行时保存数据

### 本阶段不做

- 外部 Excel 自动导表
- Addressables 资源管线
- 网络同步
- 大型事件总线框架

## 程序集策略

- `WCDEL.Game.Runtime`
  - 包含全部运行时代码
- `WCDEL.Game.Editor`
  - 只引用运行时程序集

后续如项目规模扩大，可拆分：

- `WCDEL.Game.Combat`
- `WCDEL.Game.UI`
- `WCDEL.Game.World`

但基础阶段不提前细拆。

## 命名空间

统一使用：

```csharp
WCDEL.Game.*
```

示例：

- `WCDEL.Game.Bootstrap`
- `WCDEL.Game.Input`
- `WCDEL.Game.Gameplay.Characters`
- `WCDEL.Game.Core.Definitions`

## 扩展顺序建议

后续开发优先顺序：

1. 玩家移动与交互闭环
2. 敌人刷新与基础战斗闭环
3. 技能与装备闭环
4. 任务与地图闭环
5. 存档与主菜单闭环
6. UI 细化与内容扩展
