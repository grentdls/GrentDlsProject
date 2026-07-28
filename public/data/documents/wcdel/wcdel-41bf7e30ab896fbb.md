# Combat Camera Follow Sync

## 目标

为当前 `Sandbox_Combat` 战斗场景补齐基础 2D 跟随镜头，让玩家移动时保持在屏幕中心附近，并通过平滑缓动提升移动观察体验。

## 本次范围

- 新增运行时组件 `CameraFollow2D`
- 保留现有 `CameraShakeController2D`，但改为“基础机位 + 震屏偏移”结构，避免和跟随逻辑互相覆盖
- 在编辑器场景搭建流程里，让主相机默认挂上跟随组件并自动绑定 `Player`
- 在 `SandboxCombatSceneLayout` 运行时布局里补齐相机目标绑定，确保从主界面进入战斗场景时也能正常跟随

## 当前行为

- 玩家移动时，相机会让角色始终保持在屏幕中心附近
- 镜头不会死跟角色像素点，而是使用 `dead zone + SmoothDamp` 形成轻微缓动
- 镜头会根据角色当前移动方向与朝向做轻量前视偏移，让横版战斗前方空间更易读取
- 镜头会被限制在当前战斗地图范围内，避免显示地图外空白
- 战斗场景内可以通过区域触发器切换不同镜头边界和前视参数
- Boss 区域已经预留固定镜头配置入口，可在进入 Boss 房时切换为更稳定的构图
- 命中震屏仍然有效，因为震屏现在只在基础机位上追加偏移，而不是覆盖整套相机位置
- 新开局、覆盖存档开局、直接打开战斗场景三条路径都会绑定玩家为跟随目标

## 参数入口

当前跟随参数都挂在主相机上的 `CameraFollow2D` 组件里，可直接在 Inspector 调整：

- `Follow Offset`
- `Dead Zone`
- `Smooth Time`
- `Max Speed`
- `Use Look Ahead`
- `Look Ahead Distance`
- `Look Ahead Smooth Time`
- `Use Bounds`
- `Bounds Center`
- `Bounds Size`
- `Lock Camera Position`
- `Locked Camera Position`

## 边界

- 本次未引入 Cinemachine 或第三方相机系统
- 本次已加入基础前视偏移、单场景边界夹取和分区域镜头预设，但还未做剧情事件镜头与更复杂的多阶段 Boss 镜头
- 当前仍以 `Sandbox_Combat` 单场景原型为主，后续如果切到正式章节地图，可复用同一组件继续扩展

## 后续建议

1. 为剧情对话、机关互动和 Boss 开场增加一次性镜头插值目标
2. 为 Boss 多阶段切换更换不同区域 profile，而不是只用单一锁镜头
3. 视战斗节奏补充更强的冲刺前视、跳跃抬升和落地回正策略
