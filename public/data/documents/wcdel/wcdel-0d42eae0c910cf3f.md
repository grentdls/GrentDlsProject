# 音频 / BGM / 语音系统同步

## 当前实现范围

- 新增并继续维护 `Assets/Game/Runtime/Audio` 运行时音频骨架。
- `GameAudioManager` 作为全局音频管理器，由 `GameBootstrapper` 自动创建，负责 SFX、UI、语音、BGM、环境音和程序提示音兜底。
- `GameAudioPool` 负责池化 AudioSource，避免高频战斗音效反复创建对象。
- `GameAudioLibrary` 作为 ScriptableObject 配置入口，包含 AudioEvent、ClipGroup、地表脚步规则、场景音乐规则和语音规则。
- `AudioConfigToolWindow` 提供中文编辑器入口：`Tools/WCDEL/音频/音频配置工具`。
- 未配置真实 AudioClip 时，运行时会播放程序生成的临时提示音，用来验证触发链路；正式音频填入 ClipGroup 后自动切换为真实资源。
- `GameAudioEventPlayer` 可挂在任意场景对象上，用于 Inspector、UnityEvent 或动画事件手动播放 AudioEvent / VoiceRule。
- `SceneAudioController` 可放在场景根节点上，按场景规则播放默认 BGM、战斗 BGM、Boss BGM 和环境音。
- `CharacterSpriteAnimationDriver` 已支持读取角色动作配置中的 `FrameEvents`，当事件类型为 `PlaySfx` 时按角色位置播放对应 AudioEvent。

## 已接入的运行时事件

- UI：点击、确认、取消、错误、页面打开/关闭、标签切换、购买、装备、任务接取、任务完成、物品获得。
- 移动：脚步、跳跃起跳、轻落地、重落地、冲刺。
- 普攻：轻攻击挥空、重攻击挥空。
- 命中：普通、重击、暴击、穿甲、弱点、斩杀、火、冰、雷、毒、绝技命中。
- 玩家：受击、死亡、攻击语音、技能语音、绝技语音、受击语音、死亡语音。
- 敌人 / Boss：攻击前摇、攻击释放、受击、死亡、Boss 登场、破防、阶段切换、死亡、Boss 大招语音。
- 技能：Cast、Release、Hit、Ultimate Cast、Ultimate Release。
- 交互：通用使用、对话、宝箱、稀有宝箱、机关、传送点激活、传送、神龛、商店、任务板、交互失败。
- BGM / 环境音：探索、普通战斗、Boss、胜利、默认环境音、随机环境音。

## 配置方式

1. 打开 Unity。
2. 进入 `Tools/WCDEL/音频/音频配置工具`。
3. 点击 `创建/同步默认音频库`。
4. 工具会生成或同步 `Assets/Game/Audio/Resources/GameAudioLibrary.asset`。
5. AudioEvent 默认和同名 ClipGroup 绑定，策划只需要在对应 ClipGroup 里填入真实 `AudioClip`。
6. 需要不同地表脚步音时，在 SurfaceRules 中配置地表类型和脚步 / 落地 / 冲刺事件。
7. 需要场景自动 BGM / 环境音时，在 SceneRules 中配置场景名、默认 BGM、战斗 BGM、Boss BGM 和环境音事件。
8. 需要语音概率、冷却和角色分类时，在 VoiceRules 中配置 VoiceId、角色、语音类型、情绪、事件 ID、概率和冷却。

## 运行时联动

- 玩家攻击会播放挥空音，并按概率播放攻击短语音。
- 技能和绝技会在 Cast / Release / Hit 阶段分别播放音效。
- 伤害反馈会根据暴击、穿甲、弱点、斩杀、元素和绝技选择不同命中音效。
- 玩家跳跃起跳和落地接入统一音频，落地可由地表规则替换轻 / 重落地事件。
- 敌人发现玩家、攻击前摇、释放攻击、死亡会播放对应事件；Boss 死亡会播放胜利 BGM 并延迟恢复探索音乐。
- NPC 对话、宝箱、传送点、商店、任务板等交互会播放各自事件，失败交互会播放阻止音。
- 主菜单、战斗 HUD、后台菜单和世界交互按钮已接入统一 UI 点击反馈。
- 场景加载时如果命中 SceneAudioRule，会自动播放默认 BGM 和环境音；没有配置库时也会使用默认程序提示音兜底。

## 后续注意

- 正式接入 AudioMixer 后，应把 `GameAudioEvent.MixerGroup` 配到 Music、SFX、UI、Voice、Ambience 分组，并补 Snapshot：Normal、Combat、Boss、Dialogue、Pause、LowHP。
- 更多敌人类型建议扩展独立 ClipGroup，避免普通敌人、精英、Boss 共用同一套临时音色。
- 剧情系统后续应补完整对白语音、打字音节奏和语音字幕关联，而不是只播放 NPC 短语音。
- 正式音频资源建议按 `BGM / Ambience / SFX / Voice / UI` 目录拆分，保持事件 ID 与资源命名可追踪。
