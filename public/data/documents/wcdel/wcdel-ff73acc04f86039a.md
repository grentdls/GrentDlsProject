# ARPG 基础搭建说明

## 目标

本文件描述 2026-05-15 这次“项目基础搭建”的范围、落地结构与后续使用方式。

本阶段目标不是直接完成完整玩法，而是把后续所有核心模块都接到同一套项目骨架上。

## 本次搭建范围

### 文档层

- 补齐 `docs/00~05`
- 建立功能级文档目录 `docs/features`
- 将当前 GDD 与工程结构建立映射关系

### 工程层

- 建立 `Assets/Game` 目录
- 新建运行时与编辑器程序集
- 明确 `Bootstrap / Core / Input / Gameplay` 分层

### 代码层

- 启动配置 `GameBootstrapConfig`
- 全局入口 `GameBootstrapper`
- 运行时会话 `GameSession`
- 玩家运行时数据 `PlayerRuntimeData`
- 通用定义基类 `GameDefinition`
- 角色、技能、装备、敌人、任务、区域、洞穴、经济定义资产类
- 输入读取组件 `GameInputReader`
- 2D 角色移动组件 `TopDownCharacterMotor2D`
- 玩家输入桥接组件 `PlayerActorController`

### 工具层

- 编辑器菜单创建基础配置资产
- 编辑器菜单向当前场景注入基础启动对象

## 当前目录

```text
Assets/Game
├── Runtime
│   ├── Bootstrap
│   ├── Core
│   │   ├── Configs
│   │   ├── Data
│   │   └── Definitions
│   ├── Gameplay
│   │   ├── Characters
│   │   ├── Combat
│   │   └── World
│   └── Input
├── Editor
├── Scenes
├── Prefabs
├── UI
├── Art
└── Audio
```

## 当前可承接的设计内容

这套骨架已经能继续承接以下设计方向：

- 玩家移动、翻滚、普攻与技能输入
- 敌人原型与区域等级
- 装备、技能、经济与任务的静态定义
- 世界地图、洞穴与主线区域配置
- 后续存档、UI、战斗伤害与交互触发

## 当前未完成内容

- 正式输入动作表重绑
- 正式场景结构
- 真正的战斗结算与敌人 AI
- UI Prefab 与 HUD 实装
- 存档读写
- 导表流程

## 推荐下一步

1. 在 Unity 中创建基础配置资产并挂到启动对象
2. 制作首个 `Player` 测试对象，挂载输入与移动组件
3. 建立 `StarterField` 测试场景
4. 接第一版交互点、敌人刷点与简单战斗
5. 再开始接 HUD、任务和掉落
