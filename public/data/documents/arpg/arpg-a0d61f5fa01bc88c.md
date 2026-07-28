# ARPG Runtime Implementation Audit

## 本轮已补齐的运行闭环

- 3D ACT 玩家运行时启动：原型地图进入后自动确保 GameBootstrap、玩家、相机、输入、移动、闪避、锁定、交互、生命、法力、耐力、背包、装备、技能槽存在。
- 输入兜底：WASD/手柄移动、鼠标/手柄视角、左键基础攻击、数字技能、Tab 锁定、E 交互、I/K/C/M/Esc 面板切换。
- 技能释放：技能表驱动的近战、范围、投射物已经生成实际命中体，并走 DamageCalculator 结算。
- 默认技能槽：裂地斩、余烬弹、霜环、碎甲击、雷链会自动填入 5 个主动槽。
- 原型战斗：非主城地图自动生成可锁定、可追击、可攻击、可死亡的原型怪；主城生成训练靶；Boss 场景生成 Boss 原型。
- Runtime HUD：自动生成生命/法力/耐力、技能冷却、锁定目标、交互提示、背包、技能、角色、地图面板。
- 掉落与宝箱：怪物死亡和宝箱打开会生成可交互拾取的世界物品；没有 prefab 时使用运行时 fallback 物品。
- 资源恢复：法力和耐力会自动回复，翻滚不再永久耗尽耐力。
- 数据校验：GameData JSON、inputactions JSON 均可解析，数据表重复 ID 已通过扫描。

## 仍需在 Unity 编辑器内修复的资产问题

- 当前 prefab/scene 文本扫描仍有 `128` 个 `m_Script: {fileID: 0}`。
- 根因是大量 MonoBehaviour 类集中在多类脚本文件中，部分 prefab 保存时没有稳定的 MonoScript 引用。
- 已有菜单入口：`Game/ARPG/Repair Generated Assets`。关闭同工程的其它 Unity 实例后可用 batchmode 执行，或在当前打开的 Unity 菜单里执行。
- 本次尝试 batchmode 被当前已打开 Unity 工程阻止，Unity 日志提示：同一工程已经被另一个 Unity 实例打开。

## 当前验证

- `dotnet build RPG.sln`：0 warnings, 0 errors。
- `Assets/_Game/Resources/GameData/*.json` 与 `Assets/_Game/ARPG_InputActions.inputactions`：全部 JSON parse OK。
- GameData entries duplicate id scan：OK。
