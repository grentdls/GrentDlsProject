# 可编辑主城与战斗 Scene 说明

## 已生成场景

- 主城：`Assets/HeroCity/Scenes/SCN_HeroCity_MainCity.unity`
- 战斗：`Assets/HeroCity/Scenes/SCN_HeroCity_Battle_01.unity` ～ `SCN_HeroCity_Battle_10.unity`

主城 Scene 已设为 Build Settings 第一个启动场景，10 个战斗 Scene 均已启用。旧 `SampleScene` 保留但禁用。

## 可以直接修改的内容

- 主城环境、道路、城墙、树木、灯光、镜头和每个 `CityPlot3D_*` 地块的位置。
- 战斗关卡的地面、道路、树木、路灯、山石、牌楼、方向光和镜头。
- `HeroCitySceneAuthoring` 上的战斗镜头偏移与注视偏移。

每个 Scene 都保留了中文层级名。名称带“可编辑”的节点是静态场景内容；名称带“运行时”的节点只作为挂点，不要在其中长期保存手工对象。

## 仍由运行时控制的内容

- 玩家、敌人、子弹、技能、拾取物和命中特效。
- 主城建筑当前等级、建造状态、生产状态和守城英雄。
- 战斗 HUD、主城功能页面以及所有存档数据。

这些对象依赖玩家存档和战斗模拟，进入游戏后会挂到 Scene 的运行时节点，不会覆盖静态环境。

## 运行方式

- 无论从正式主城 Scene、`SampleScene` 或其他调试 Scene 启动，运行时入口都会先按完整路径切换到并绑定 `SCN_HeroCity_MainCity`，随后才创建主城 UI；调试 Scene 不会残留相机与主城相机叠加。
- 主城 3D 表现直接使用 `HeroCitySceneAuthoring.WorldRoot`、`RuntimeRoot` 和场景相机，不再默认创建临时“城市3D世界”。
- 进入关卡时，程序按关卡编号和完整路径增量加载对应 Battle Scene，并把玩家、敌人、子弹和特效挂到该 Scene 的运行时节点。
- 退出战斗时先销毁运行时战斗表现并卸载 Battle Scene，再恢复主城，避免主城相机与战斗相机短暂叠加。
- 只有目标 Scene 未加入 Build Settings、加载失败或缺少匹配的 `HeroCitySceneAuthoring` 时，才启用程序化安全降级环境，并输出 `[HeroCityScenes]` 错误日志。

## 生成菜单

Unity 菜单：

- `Hero City/Scenes/Generate Missing Editable Gameplay Scenes`：只补齐缺失 Scene，不覆盖已有修改。
- `Hero City/Scenes/Generate Or Refresh Editable Gameplay Scenes`：重新生成全部 Scene，会先弹出覆盖确认。

日常修改后不要使用“重新生成全部”，除非明确准备放弃这些 Scene 中的手工调整。
