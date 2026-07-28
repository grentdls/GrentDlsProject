# Asset Rules

## 目录

- UI 页面 Prefab：`Assets/Resources/UI/Prefabs/Pages/`
- 战斗内 UI Prefab：`Assets/Resources/UI/Prefabs/InGame/`
- 通用组件 Prefab：`Assets/Resources/UI/Prefabs/Components/`
- UI 配置资产：`Assets/Resources/UI/Configs/`

## 命名

- Prefab 使用清晰功能名，后缀 `_Prefab`。
- 子节点使用稳定英文名，供代码绑定，例如 `NameText`、`HpFill`、`Label`、`NumberText`。
- 不把说明文案写进可见 UI 节点。

## 修改规则

- 不随意移动场景、大 Prefab、ScriptableObject 或资源路径。
- 需要替换图片时优先保留节点名和绑定脚本。
- 新增运行时 UI 条目时先补 Prefab 类型、生成器和库配置。
