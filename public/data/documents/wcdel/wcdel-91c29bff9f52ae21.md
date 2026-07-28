# Screen Shake Camera Feedback Sync

## 目标

基于 `Docs/screen_shake_camera_feedback_design.md`，在现有 2D 战斗原型里补齐统一的镜头反馈控制层，让命中、受击、暴击、穿甲、弱点、斩杀、技能释放、绝技释放和 Boss 蓄力都能走同一套屏幕反馈链路。

## 本次实现范围

### 统一控制器

- 新增 `CombatCameraFeedbackController2D`
- 统一接管以下反馈：
  - 震屏
  - HitStop 命中停顿
  - 屏幕闪光 Overlay
  - 暗角 Overlay
  - 镜头轻量缩放脉冲
- 保持现有 `CameraShakeController2D` 和 `HitStopController` 可复用，不另起一套新架构

### 命中反馈

- 攻击命中现在支持按条件分层反馈：
  - 普通命中
  - 暴击
  - 穿甲
  - 弱点
  - 斩杀
  - 绝技命中
  - Boss 来源命中
  - DoT 命中
- 玩家受击时会走独立的被击镜头反馈：
  - 普通受击
  - 暴击受击
  - 穿甲 / 弱点受击
  - 斩杀级重击
  - `HeavyHit` / `Knockback` / `Launch` / `Knockdown` / `GuardBreak` 等重型受击

### 技能与 Boss 镜头表现

- 玩家开始施放普通技能时，会触发轻量技能脉冲
- 玩家开始施放绝技时，会触发更强的绝技镜头脉冲
- Boss 蓄力阶段会持续触发镜头脉冲
- 近战 Boss 与远程 Boss 均已接入蓄力镜头反馈
- Boss 或 Boss 投射物命中时，会自动走更强的来源级反馈

### 挂载与场景接线

- `CombatFeedbackBroadcaster` 现在优先把攻击命中与受击反馈派发给 `CombatCameraFeedbackController2D`
- `SandboxCombatSceneLayout` 会在运行时确保主相机挂有该控制器
- `FoundationAssetUtility` 会在编辑器搭建场景时自动给主相机补齐该组件
- 范围伤害、近战伤害、投射物伤害都已接入统一攻击反馈入口

### 冷却与叠加

- 对轻命中和 DoT 命中加入了轻量冷却，避免高频连击导致屏幕抖动失控
- Boss 蓄力脉冲加入了冷却，避免每帧重复触发
- 屏幕闪光、暗角和缩放采用叠加强度后渐隐的方式处理

### 临时无障碍入口

- 控制器已提供运行时接口：
  - `SetReducedMotion(bool reducedMotion)`
  - `SetScreenEffectScale(float shakeScale, float fxScale)`
- 当前属于运行时开关，还没有持久化到正式设置界面或存档配置

## 当前未实现

- 正式配置表 / ScriptableObject 化镜头反馈参数
- 玩家设置里的持久化无障碍选项
- 色差、独立慢动作系统、暗场分层、剧情镜头脚本化编排
- Boss 二阶段切换、破防专属镜头脚本事件
- 正式后处理栈级别的特效系统

## 主要文件

- `Assets/Game/Runtime/Gameplay/Combat/CombatCameraFeedbackController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatFeedbackBroadcaster.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`

## 验证结果

- 执行 `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 结果：`0 error`
- 当前保留 `4` 个既有 `Physics2D.OverlapCircleNonAlloc` 过时 warning，与本次镜头反馈功能无直接冲突

## 后续建议

1. 把不同命中等级、技能等级、Boss 事件的反馈参数抽成配置资源，避免硬编码继续膨胀。
2. 把 reduced motion 和特效强度接到正式设置界面，并同步到运行时会话数据。
3. 后续如果要补色差、暗角纹理、绝技演出和 Boss 二阶段镜头，继续从 `CombatCameraFeedbackController2D` 扩展，不要重新拆分第二套入口。

## 2026-05-21 Follow-up

- Main menu settings now expose the same camera feedback controls as the in-game backend menu.
- New game creation copies the current session camera feedback settings into the newly created slot before save.
- Loaded sessions now normalize missing legacy camera feedback fields and actively re-apply them to runtime camera feedback controllers after scene load.
- `MainMenuCanvasPresenter` settings view reuses the existing right-side button list instead of introducing a second prefab path, so the chain stays compatible with current UI structure.

## 2026-05-21 Helper Consolidation Follow-up

- Added `CameraFeedbackSettingsUiHelper` so the main menu and backend settings pages share the same camera feedback step logic, labels, default reset flow, and runtime apply path.
- Registered the helper in `WCDEL.Game.Runtime.csproj` because this project uses an explicit compile include list and does not automatically pick up new runtime `.cs` files.
- Verified the shared helper path with `dotnet build WCDEL.sln /p:BuildProjectReferences=false`.
- Current build result: `0 error`, with the same 4 existing `Physics2D.OverlapCircleNonAlloc` deprecation warnings.

## 2026-05-21 Complete Shake Rule Follow-up

- `CameraShakeController2D` now supports the rule fields from the design doc: direction mode, decay mode, priority, stack mode, max offset, frequency, and rotational shake.
- Shake stacking is capped to two active sources. Lower-priority weak shakes are ignored when a stronger shake is already active, while Boss/ultimate impacts can override all active shakes.
- `CombatCameraFeedbackController2D` now maps combat events to distinct presets: normal hit, crit, armor pierce, weakness, execute, player light/heavy hit, launch/knockdown, skill cast, ultimate, Boss charge, and Boss impact.
- Player victim feedback now uses directional or vertical impulses based on hit type, so heavy hit / launch / knockdown are visually different from light damage.
- Boss charge uses low-frequency rumble and vignette/zoom pressure; phase burst / slam uses vertical massive shake, white flash, rotational shake, and override priority.
- Reduced-motion and effect-scale settings still apply to the new shake path; they scale shake strength and rotation without bypassing Boss warning visuals.
