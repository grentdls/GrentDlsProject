# 宠物序列帧资源生成与运行时播放同步

## 实现范围

- 为宠物定义补充 `PetAnimationClipDefinition`，每个宠物可以在 `PetDefinition` 中配置多组动作序列帧。
- 当前动作 ID 约定为 `spawn`、`idle`、`move`、`attack`、`skill`、`hit`、`dead`。
- `PetRuntimeActor2D` 会按宠物跟随、移动、普攻、主动技能或支援技能状态切换动作。
- 未配置序列帧的宠物仍会回退到 `BodySprite` 或 `Icon`，保持旧资源兼容。
- `PetContentGenerator.GeneratePetContentForAutomation` 会生成并绑定首批 6 只宠物的默认序列帧。

## 生成内容

- 宠物数量：6 只。
- 每只宠物动作：出生、待机、移动、攻击、技能、受击、死亡。
- 每只宠物帧数：`5 + 6 + 8 + 6 + 6 + 3 + 5 = 39` 张。
- 总 PNG 数量：234 张。

## 资源目录

- 序列帧 PNG：`Assets/Game/Art/Pets/SequenceFrames/<petId>/<animationId>/Pet_<petId>_<animationId>_<index>.png`
- 宠物定义：`Assets/Game/Runtime/Core/Configs/Resources/Pets/*.asset`
- 生成入口：`Tools/WCDEL/Content/生成宠物系统内容`
- 自动化入口：`WCDEL.Game.Editor.PetContentGenerator.GeneratePetContentForAutomation`

## 运行时规则

- 出场时优先播放 `spawn` 一次，然后回到 `idle` 或 `move`。
- 跟随移动时播放 `move` 循环。
- 停止移动时播放 `idle` 循环。
- 普攻命中流程前播放 `attack` 一次。
- 主动技能和支援技能释放时播放 `skill` 一次。
- `hit` 和 `dead` 已配置资源，后续如果宠物可受击或可死亡，可以直接接入。

## 替换规则

- 后续正式美术到位后，可以直接替换同路径 PNG，再让 Unity 重新导入。
- 如果要新增动作，只需要在 `PetDefinition._animations` 中新增动作 ID、帧数组、帧率和是否循环。
- 不建议在运行时代码里硬编码具体 PNG 路径，运行时只读取 `PetDefinition` 的 Sprite 引用。

## 验证记录

- 执行 Unity 批处理入口生成资源，日志显示 batchmode 正常退出。
- 检查 `Assets/Game/Art/Pets/SequenceFrames` 下生成 234 张 PNG。
- 检查 6 个宠物 `.asset` 都写入 7 组动作引用。
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`，结果 0 warning / 0 error。
