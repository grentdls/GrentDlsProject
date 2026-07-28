# 主线章节任务链生成同步

## 背景

`Docs/Task` 已补齐《旺财斗神龙》第一章至第十六章主线章节与故事大纲。本次先完成主线任务内容数据，后续各章节关卡布局再按任务 ID 接入触发器、NPC、区域与战斗。

## 生成入口

- 编辑器菜单：`Tools/WCDEL/Quest/Generate Main Story Quest Chain`
- 自动化入口：`WCDEL.Game.Editor.MainStoryQuestDefinitionBuilder.BuildAllMainStoryQuestsForAutomation`
- 生成器：`Assets/Game/Editor/MainStoryQuestDefinitionBuilder.cs`

生成器可重复执行，会覆盖更新同名资产内容，不需要手工编辑生成出的 `.asset` 文件。

## 输出目录

生成资产位于：

`Assets/Game/Runtime/Core/Configs/Generated/MainStory`

当前输出：

- 16 个 `QuestDefinition`：`Quest_CH01_FirstSigh.asset` 至 `Quest_CH16_DragonReturnsHome.asset`
- 16 个 `RegionDefinition`：`Region_CH01_FirstSigh.asset` 至 `Region_CH16_DragonReturnsHome.asset`

第一章已经存在独立场景任务 `quest_ch01_main_first_sigh`。本次新增的是完整主线链 canonical ID，例如 `quest_main_ch01_first_sigh`，用于后续全主线串联，避免破坏第一章场景现有任务。

## 数据内容

每章主线任务已写入：

- `chapterId`：`CH01` 至 `CH16`
- `regionId`：章节区域 ID
- 主线 `QuestCategory.Main`
- 推荐等级、金币奖励、经验奖励
- 主目标与章节阶段目标
- 上一章完成作为下一章前置条件
- 下一章任务与下一章区域解锁奖励
- 章节关键奖励，例如龙王金冠、龙牙剑、龙骨护腕、龙瞳镜、龙誓铃、龙文护符、水脉龙靴、裂龙密账、龙心玉佩、封龙逆鳞、龙魂记忆碎片等
- 剧情事件 ID 与剧情变量 ID
- 对话链接占位
- 地图标记占位

## 后续关卡接入规则

后续制作各章节布局时，应优先复用本次生成的任务 ID、阶段 ID、目标 ID 和区域 ID。

关卡触发器建议按以下方式接入：

- 区域进入类目标使用对应 `region_chXX_*`。
- 交互物、证据、Boss、机关使用对应 `objective_*` / `evidence_*` / `npc_*` 目标 ID。
- 章节完成时推进 `objective_main_chXX_complete`。
- 不要另建同义主线 ID，除非同步更新本生成器和相关文档。

## 验证

已执行：

- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- Unity batchmode 执行 `BuildAllMainStoryQuestsForAutomation`

生成器内部会调用 `QuestValidator.Validate` 校验全部生成任务，若出现缺 ID、缺目标、前置循环、奖励目标缺失等问题，会中断 batchmode。
