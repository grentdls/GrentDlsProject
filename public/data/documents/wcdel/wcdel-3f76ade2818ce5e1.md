# 后台菜单事件驱动刷新规则

## 目标

后台菜单、技能界面、任务界面、背包界面和主菜单不应依赖每帧完整刷新。UI 只有在玩家点击、鼠标悬浮、拖拽、语言切换、任务事件、数据变化或显式打开页面时才刷新。

## 当前规则

- `BackendMenuCanvasPresenter.Update` 只处理输入等待、任务事件绑定、菜单打开时的低频结构自检，以及脏标记刷新。
- 后台菜单取消被动定时整页刷新，不再按 0.5 秒或 1 秒重建技能、任务、地图页面。
- `RequestPageRefresh` 只标记脏状态，不立即重建 UI。
- `RefreshNow` / `RefreshCurrentPageImmediate` 用于点击、悬浮、拖拽完成、任务操作等需要立刻反馈的事件。
- 技能背包、技能槽、技能树、任务列表、背包格支持鼠标悬浮预览，同一项重复悬浮不会刷新。
- 页签、筛选、列表选择等事件如果选择值未变化，会直接返回，不重绘整页。
- 任务事件通过 `GameSession.QuestFeedbackRaised` 驱动任务页、地图页、角色页刷新。
- `MainMenuCanvasPresenter` 不再每帧 `Refresh`，只在按钮事件、语言变化和页面打开时刷新。

## 新增 UI 功能时的要求

- 不要在后台菜单或主菜单中新增每帧完整 `Refresh`。
- 新增按钮、页签、列表项时，应在点击或悬浮事件里调用 `RefreshNow`。
- 外部系统数据变化时，应提供事件入口；如果暂时没有事件，只允许标记脏状态，不允许高频重建。
- 冷却、血条、战斗 HUD 这类必须实时变化的界面可以按帧或低频刷新，但后台菜单不属于实时 HUD。

## 验证

- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 编译通过，0 warning，0 error。
