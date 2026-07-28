# 完整设置界面与输入配置同步规则

## 功能目标

- 游戏内后台设置页提供画质、音效、存档、快捷键、镜头反馈和语言的统一入口。
- Tools 默认配置中的输入键位作为项目默认值，玩家没有自定义时会持续读取默认配置。
- 玩家在游戏内修改快捷键后，配置保存到玩家运行数据和存档数据中，不再被 Tools 默认值覆盖。
- 快捷道具 1-6 纳入正式输入配置，战斗 HUD 不再硬编码数字键。

## 输入配置规则

- `DefaultInputSettings` 提供项目默认键位，包含移动、攻击、交互、闪避、跳跃、技能、绝技、菜单和快捷道具 1-6。
- `PlayerInputSettingsData.HasCustomBindings = false` 时，运行时会继续从 `GameDefaultSettings` 读取默认键位。
- 玩家在设置页重绑任意按键或切换移动反转后，`HasCustomBindings = true`，后续使用玩家自己的存档配置。
- 点击“输入配置: 恢复默认”会清空玩家自定义状态，重新回到读取 Tools 默认配置的模式。
- 战斗内快捷道具使用读取 `PlayerInputBinding.QuickItem1` 到 `QuickItem6`，默认仍为 `1-6`。

## 设置页范围

- 画质：画质档位、分辨率、全屏/窗口、垂直同步、目标帧率、UI 缩放数据。
- 存档：保存到 1-3 号存档，读取 1-3 号存档，并显示存档摘要。
- 音效：总音量、音乐、音效、界面音、语音、环境音、静音、恢复默认。
- 输入：移动、攻击、交互、闪避、跳跃、技能 1-4、绝技、快捷道具 1-6、菜单、移动反转、恢复默认。
- 镜头反馈：镜头震动、屏幕特效、慢动作、恢复默认。
- 语言：继续使用现有本地化切换入口。

## 运行时入口

- `BackendMenuCanvasPresenter` 负责后台设置页的运行时 UI 补齐、按钮绑定和刷新。
- `PlayerRuntimeData` 保存画质、音频、输入、镜头反馈等玩家侧设置。
- `GameBootstrapper.ApplySessionGraphicsSettings()` 应用画质设置。
- `GameBootstrapper.ApplySessionAudioSettings()` 应用音频设置。
- `GameBootstrapper.ApplySessionInputSettings()` 保证玩家输入配置初始化和默认值继承。
- `CombatCanvasHudPresenter` 读取玩家输入配置触发快捷道具栏。

## 验证方式

- 修改 Tools 默认输入后，如果玩家未自定义输入，游戏内设置页和战斗快捷键应读取新的默认值。
- 在设置页重绑快捷道具 1-6 后，战斗 HUD 应按新键位使用对应快捷栏物品。
- 音频按钮应立即影响对应音量或静音状态。
- 画质按钮应更新玩家设置，并由 `GameBootstrapper` 应用质量、分辨率、VSync 和目标帧率。
- 存档按钮应能保存当前会话并读取已有槽位。
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false` 应通过且无警告。

