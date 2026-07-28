# Chapter01 Skill Equipment Icon Sync

## Goal

为第一章现有技能与装备补齐一批可直接替换的 icon 资源，并把它们正式接入当前数据定义与 UI 预制体链路。

## Scope

- 在 `Assets/Game/Art/Icons/Skills` 与 `Assets/Game/Art/Icons/Equipment` 下新增一批正式命名的 PNG 图标资源。
- 为 `GameDefinition` 增加统一 `Icon` 字段，让技能、装备、背包道具等静态定义都能复用同一套图标入口。
- 新增编辑器工具 `DefinitionIconAssignmentUtility`，用于把第一章技能 / 装备图标批量同步到对应 ScriptableObject。
- 更新战斗 HUD 与后台菜单中的主要图标显示位：
  - 战斗技能栏
  - 背包装备槽位
  - 背包物品格子
  - 技能背包格子
  - 技能树节点
  - 后台已装备技能条
  - 技能详情预览位

## Current Behavior

- 第一章当前 2 个技能已挂接 icon：
  - 火环
  - 叶片爆发
- 第一章当前 6 件装备已挂接 icon：
  - 村庄短剑
  - 蜂刺之刃
  - 旅人短衣
  - 侦察帽
  - 旅人胸针
  - 蜂蜜护符
- UI 读取定义上的 `Icon` 字段，存在 Sprite 时优先显示图片；没有时回退到原有颜色占位，不会打断当前 MVP 工作流。
- 图标文件采用独立资源文件方式管理，后续可直接同名替换或在 Inspector 中改绑，不需要再改脚本。

## Tooling

- 新增菜单入口：
  - `Tools/WCDEL/Art/同步第一章图标配置`
- 该入口适合在 Unity 重新导入资源或重建内容后，再次把第一章图标批量挂回对应定义。

## Boundaries

- 这批 icon 是为当前原型阶段制作的统一风格占位图，不代表最终正式美术。
- 当前主要覆盖第一章已接入运行时的技能与装备，还没有扩展到全部消耗品 / 材料 / 任务道具。
- 后台装备详情面板已预留图标引用字段，但由于旧文件中存在历史编码残留，建议后续配合一次文本清理迭代继续统一细化。

## Next Suggestions

1. 继续为消耗品、材料、任务道具补 icon，并接到背包详情区与交互奖励提示。
2. 把战斗 HUD 与后台技能页的 icon 状态进一步升级为切图边框、品质角标和冷却特效资源。
3. 在 Unity 中执行一次 `Tools/WCDEL/UI/重建界面预制体` 与 `Tools/WCDEL/Art/同步第一章图标配置`，确认 prefab 与资源导入状态完全一致。
