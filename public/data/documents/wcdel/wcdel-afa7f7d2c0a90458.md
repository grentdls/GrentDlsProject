# 第一章：一声叹息完整场景同步

## 目标

将 `Docs/Section1` 与 `Docs/Task/第一章_一声叹息.md` 中的第一章内容同步为独立 Unity 场景生成流程，目标场景为：

- `Assets/Game/Scenes/CH01_FirstSigh.unity`

当前实现采用编辑器生成器创建白盒可玩版本，先落地完整区域、点位、主线、支线、奇遇、采集、敌人、宝箱、相机边界、运行时管理器和调试锚点。正式美术资源、Timeline 演出和 Prefab 可后续替换同名占位资源。

## 生成入口

- 编辑器菜单：`Tools/WCDEL/Chapter01/创建或重建第一章场景`
- 批处理方法：`WCDEL.Game.Editor.Chapter01FirstSighSceneBuilder.BuildChapter01FirstSighSceneForAutomation`
- 生成器文件：`Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`

批处理命令示例：

```powershell
& "D:\Unity6\Editor\Unity.exe" -batchmode -quit -projectPath "G:\TestProject\WCDEL" -executeMethod WCDEL.Game.Editor.Chapter01FirstSighSceneBuilder.BuildChapter01FirstSighSceneForAutomation -logFile "G:\TestProject\WCDEL\Logs\chapter01_first_sigh_build.log"
```

## 已覆盖内容

- 区域：狗尾草村、出村坡道、荒原边缘、枯井、黑草坡、荒原营地、旧龙渠、封印入口、封印外圈、神龙平台。
- 主线：开场、离村、入荒原、旧龙渠、封印入口、封印外圈、登台、神龙威压、第一次看见神龙、神龙叹息。
- 支线与奇遇：大鹅试炼、祖传破剑、丢失的防龙铃、枯井、黑草坡、营地晚饭、发光旧石头、大告示牌、玄猴商人、荒原夜里低吟、鸡窝降落点、纸飞机。
- 运行时对象：`GameBootstrapper`、`QuestEventRouter`、玩家、HUD、交互 Overlay、Loading Overlay、后端菜单 Canvas。
- 场景对象：NPC、采集点、宝箱、敌人刷新组、区域触发器、任务触发器、相机边界、VFX/Timeline/Debug 锚点。
- 数据资产：生成器会在 `Assets/Game/Runtime/Core/Configs/Generated/CH01_FirstSigh` 下创建 Region、Terrain、角色属性、技能、装备、道具、敌人、任务定义。
- 占位资源：生成器会在 `Assets/Game/Runtime/WorldPlaceholders/CH01_FirstSigh` 下创建像素占位 Sprite。

## 坐标说明

第一章场景生成器已切换为真实 3D 场景语义：Unity `X` 表示横向移动，Unity `Z` 表示地面纵深移动，Unity `Y` 只表示跳跃、高度、平台落差和演出高度。

- `Chapter01FirstSighSceneBuilder.ToWorld(x, y, z)` 现在直接输出 `new Vector3(x, y, z)`，不再把文档 `Z` 塞进 Unity `Y`。
- 玩家在该场景中启用 `TopDownCharacterMotor2D._useTrue3DTransformMotion = true`，W/S 会在 `Z` 轴移动，跳跃会改变 `Y` 高度。
- 生成器会创建 `WorldPresentationSettings_25D` 和 `WorldProjector_True3D_XZ`，主相机使用 Perspective 固定斜向跟随。
- 地形、道路和阻挡白盒视觉使用水平 X/Z 地面卡片；NPC、怪物、玩家保持 2D Sprite 直立表现，不旋转 90 度贴地。
- 旧 `Collider2D` 触发器暂作为兼容层保留，但区域、任务、小地图和交互检测优先读取 `PlanarArea2D` / `WorldPresentationHeightUtility.ResolveLogicPlanePosition` 的 X/Z 逻辑坐标，避免继续按旧 XY 地图判定。

## 运行时扩展

新增/更新的第一章运行时组件：

- `Chapter01ScenePoint2D`：记录第一章点位元数据，支持编辑器生成器配置。
- `Chapter01QuestTrigger2D`：进入触发器后注册/接受/追踪任务，并上报任务目标进度。
- `Chapter01SighSequence2D`：承载神龙叹息白盒演出，传送玩家回鸡窝落点并上报主线完成目标。

## 当前验证状态

已通过：

- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- Unity 批处理生成：`BuildChapter01FirstSighSceneForAutomation`
- 2026-05-24：代码侧 3D 生成逻辑已通过 `dotnet build WCDEL.sln /p:BuildProjectReferences=false`。本次尝试批处理重建场景时，Unity 提示当前项目已被其他 Unity 实例打开，因此 `Assets/Game/Scenes/CH01_FirstSigh.unity` 需要在关闭其他 Unity 实例后重新执行生成器，或在已打开的编辑器中执行菜单 `Tools/WCDEL/Chapter01/创建或重建第一章场景`。

## 后续注意事项

- 若 Unity 编辑器已打开，可直接在当前编辑器执行菜单 `Tools/WCDEL/Chapter01/创建或重建第一章场景`。
- 若要用批处理生成，请先关闭当前打开的 Unity 项目实例，再运行上方批处理命令。
- 美术 Prefab 接入时优先替换同名占位资源，不要移动已生成场景层级的大组结构。
- Timeline 完成后，可替换 `Chapter01SighSequence2D` 当前白盒叹息流程，但需继续上报 `objective_ch01_dragon_sigh`。
