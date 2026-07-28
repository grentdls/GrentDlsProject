# Quest Runtime Progression Sync

## 目标

把任务系统从“接取后立即完成”的占位流程，升级为具备真实目标进度和完成判定的最小运行时闭环。

## 本次范围

### 任务定义与运行时状态

- 新增 `QuestObjectiveType`
- 新增 `QuestObjectiveDefinition`
- 新增 `QuestRuntimeState`
- 扩展 `QuestDefinition`，加入一个最小可用的目标定义
- 扩展 `PlayerRuntimeData`，持有任务运行时状态列表

### 任务进度链路

- 扩展 `GameSession`，加入任务状态创建、查询、目标进度登记和奖励结算校验
- 新增 `QuestDefinitionRegistry` 与 `QuestEventRouter`
- 让世界交互物可以向任务系统上报真实进度，而不是只靠任务板直接发奖

### 首个真实任务闭环

- `QuestBoardInteractable2D` 现在只负责接任务和提交任务
- `CollectibleInteractable2D` 可上报采集型任务目标
- Starter Test Slice 中的 `Forest Herb` 被接到任务目标 `objective_collect_herb`
- HUD 显示当前活动任务的进度

## 本次不做

- 多目标任务
- 杀怪任务和战斗事件上报
- 正式任务日志 UI
- 任务失败、放弃和链式后续任务

## 后续建议

1. 给战斗系统补事件上报，把杀怪、Boss 和精英击败任务纳入同一套进度系统。
2. 把任务目标从单目标扩展到目标列表，为主线和支线任务做准备。
3. 给任务板和 NPC 接正式任务 UI，把当前 HUD 文本进度替换成正式任务追踪入口。
