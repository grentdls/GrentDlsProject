# Coding Rules

## 基本规则

- 优先复用现有架构和命名，不另起一套平行系统。
- 不随意删除旧逻辑；确认没有引用或已被新结构接管后再清理。
- 新增 UI 类型必须同步 `UiPrefabType`、Prefab 生成器、Prefab 库和文档。
- 不在代码里硬写可编辑 UI 的位置、大小、静态图片、静态说明文字。
- 运行时允许刷新动态数据，例如血量、名称、倒计时、按钮状态、列表条目数据。

## Prefab 唯一规则

- 可见 UI 只允许来自现行 Prefab；不得恢复旧 UI、默认 UI 或保底可见面板。
- Prefab 缺失时只能记录错误并停止对应 UI 区域绑定，不得用代码拼出替代可见界面。
- 如果 Prefab 存在但缺少固定节点，应记录错误并尽量降级显示，不应创建带模板文字的可见旧结构。
- 对象池条目必须优先来自 Prefab。

## 验证规则

- 修改脚本后优先运行 `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false`。
- 修改编辑器脚本后再运行 `dotnet build Assembly-CSharp-Editor.csproj /p:BuildProjectReferences=false`。
- 修改 Prefab 生成器后需要重建相关 Prefab 并扫描模板文字。
