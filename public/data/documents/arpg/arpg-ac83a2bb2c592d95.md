# 77_主界面与进入游戏流程_UI预制体_存档_角色选择_加载界面

> 文档目标：为 Unity 3D ACT 暗黑刷宝 ARPG 项目补齐“启动游戏 → 主界面 → 新存档/旧存档 → 角色选择 → 难度/模式 → 进入加载 → 主城/地图”的完整 UI 与流程设计。
>
> 参考边界：参考同类暗黑刷宝 ARPG，尤其是《流放之路2》这类作品在“角色选择、账号/存档、沉浸式主菜单、设置、进入游戏、加载提示、角色列表、赛季/模式入口”上的高层流程。不得照搬原版按钮造型、图标、角色命名、背景构图、UI 纹理、具体术语和专有文案。本项目采用原创世界观、原创 UI 视觉和原创数据结构。

---

## 1. 主界面功能总览

### 1.1 主界面要解决的问题

主界面不是一个单纯的“开始按钮”。它需要承担以下功能：

1. 让玩家从启动游戏到进入角色的流程清晰。
2. 支持新建存档、选择旧存档、删除/复制/备份存档。
3. 支持角色创建、职业选择、角色预览、模式选择。
4. 支持设置页面，包括画面、声音、操作、游戏性、无障碍、语言。
5. 支持加载界面、加载进度、提示信息、异常重试。
6. 支持离线单机存档，也预留在线账号/赛季/云存档入口。
7. 支持键鼠、手柄、移动端触屏三套输入导航。
8. 支持后续版本加入赛季入口、商城入口、公告入口、DLC/资料片入口。

### 1.2 主界面包含的 UI 模块

```text
UI_MainMenuRoot
├── 启动过渡 Boot / Splash
├── 登录与本地档案 Profile
├── 主菜单 TitleMenu
├── 新存档流程 NewSaveFlow
├── 旧存档选择 LoadSaveFlow
├── 角色选择 CharacterSelect
├── 角色创建 CharacterCreate
├── 职业详情 ClassDetail
├── 难度/模式选择 ModeSelect
├── 设置 Settings
├── 公告/更新 Notes
├── 制作人员 Credits
├── 确认弹窗 ConfirmDialog
├── 错误弹窗 ErrorDialog
└── 加载界面 LoadingScreen
```

### 1.3 最小可跑通版本

第一阶段只需要做以下闭环：

```text
启动游戏
→ 主菜单
→ 新建本地存档
→ 选择职业
→ 输入角色名
→ 创建角色
→ 加载主城
→ 进入星陨营地
```

第二阶段再补：

```text
旧存档列表
删除存档
复制存档
设置页面
加载提示
章节地图入口
```

第三阶段再补：

```text
赛季入口
云存档
账号登录
公告页面
手柄完整导航
移动端触屏适配
```

---

## 2. 主界面整体流程图

### 2.1 启动到进入游戏流程

```text
GameBootScene
  ↓
SplashLogo
  ↓
CheckLocalProfile
  ├─ 没有档案 → CreateLocalProfilePanel
  └─ 有档案 → TitleMenuPanel
        ↓
      TitleMenuPanel
        ├─ 继续游戏 ContinueGame
        │    └─ 读取最近角色 → LoadingScreen → 上次所在场景
        │
        ├─ 新游戏 NewGame
        │    └─ SaveSlotSelectPanel
        │         └─ CharacterCreateFlow
        │              ├─ ClassSelectPanel
        │              ├─ CharacterPreviewPanel
        │              ├─ NameInputPanel
        │              ├─ ModeSelectPanel
        │              └─ ConfirmCreatePanel
        │                    └─ LoadingScreen → 新手地图 / 主城
        │
        ├─ 读取存档 LoadGame
        │    └─ SaveSlotListPanel
        │         ├─ 选择角色 → CharacterSummaryPanel
        │         ├─ 进入游戏 → LoadingScreen
        │         ├─ 删除角色 → ConfirmDeleteDialog
        │         └─ 复制角色 → ConfirmDuplicateDialog
        │
        ├─ 设置 Settings
        ├─ 公告 News
        ├─ 制作人员 Credits
        └─ 退出 Quit
```

### 2.2 返回规则

| 当前界面 | ESC / B键 | 返回目标 | 是否保存当前更改 |
|---|---|---|---|
| 主菜单 | 打开退出确认 | 主菜单 | 否 |
| 旧存档选择 | 返回主菜单 | 主菜单 | 否 |
| 新建存档槽位 | 返回主菜单 | 主菜单 | 否 |
| 职业选择 | 返回存档槽位 | SaveSlotSelect | 保留临时选择 |
| 角色命名 | 返回职业选择 | ClassSelect | 保留职业选择 |
| 模式选择 | 返回命名界面 | NameInput | 保留名字 |
| 设置页 | 返回来源界面 | 上一界面 | 应用/撤销取决于设置项 |
| 加载界面 | 禁止返回 | 无 | 自动保存状态 |

---

## 3. 场景结构设计

### 3.1 Unity 场景列表

```text
Scenes/
├── 00_Boot.unity                 # 启动场景，只做 Logo、初始化、版本检查
├── 01_MainMenu.unity             # 主界面场景
├── 02_CharacterPreview.unity     # 可选：角色预览独立场景，也可作为 MainMenu 子场景
├── 10_Town_StarfallCamp.unity    # 主城
├── 20_Act01_TutorialCoast.unity  # 新手地图
└── 90_Loading.unity              # 可选：独立加载场景
```

### 3.2 主菜单场景层级

```text
MainMenuScene
├── Systems
│   ├── MainMenuBootstrapper
│   ├── SaveGameService
│   ├── ProfileService
│   ├── SettingsService
│   ├── AudioService
│   ├── InputService
│   ├── LocalizationService
│   ├── SceneLoadService
│   └── VersionService
│
├── Environment
│   ├── MenuCamera
│   ├── CharacterPreviewStage
│   │   ├── PreviewRoot
│   │   ├── TurntableAnchor
│   │   ├── ClassPreviewSpawnPoints
│   │   ├── PreviewLights
│   │   └── BackgroundProps
│   ├── MenuBackgroundVFX
│   └── MenuPostProcessVolume
│
├── UI
│   └── UI_MainMenuRoot
│
└── EventSystem
    └── InputSystemUIInputModule
```

### 3.3 主界面美术方向

主界面美术要体现“暗黑、危险、厚重、远征、装备驱动、角色成长”。

#### 视觉建议

- 背景是一个可循环的 3D 菜单场景，而不是静态图片。
- 中间展示当前角色或当前选择职业的模型。
- 左侧或底部是主菜单按钮。
- 右侧显示角色信息、模式信息、存档状态。
- 远处可以有火光、烟、风沙、残破旗帜、传送门光效。
- UI 材质可以用暗色石板、旧金属、皮革、羊皮纸、符文刻线，但必须原创。

#### 不要做

- 不要直接使用原版 UI 的红黑构图、按钮形状、图标、字体风格。
- 不要复制原版角色站位、背景地点、职业名称和职业姿势。
- 不要使用原版术语作为最终上线文案。

---

## 4. UI 根预制体结构

### 4.1 UI_MainMenuRoot.prefab

```text
UI_MainMenuRoot
├── Canvas_MainMenu                         # Screen Space - Overlay 或 Camera
│   ├── SafeAreaRoot
│   │   ├── Layer_BackgroundUI
│   │   │   ├── Img_DarkVignette
│   │   │   ├── Img_NoiseOverlay
│   │   │   └── Img_GradientMask
│   │   │
│   │   ├── Layer_GlobalTop
│   │   │   ├── UI_VersionLabel
│   │   │   ├── UI_NetworkStatusIcon
│   │   │   ├── UI_ProfileName
│   │   │   └── UI_BuildWatermark
│   │   │
│   │   ├── Layer_Panels
│   │   │   ├── Panel_TitleMenu
│   │   │   ├── Panel_SaveSlotSelect
│   │   │   ├── Panel_LoadSave
│   │   │   ├── Panel_CharacterSelect
│   │   │   ├── Panel_CharacterCreate
│   │   │   ├── Panel_ClassDetail
│   │   │   ├── Panel_ModeSelect
│   │   │   ├── Panel_Settings
│   │   │   ├── Panel_News
│   │   │   ├── Panel_Credits
│   │   │   └── Panel_LoadingOverlay
│   │   │
│   │   ├── Layer_Popup
│   │   │   ├── Popup_Confirm
│   │   │   ├── Popup_Error
│   │   │   ├── Popup_SaveConflict
│   │   │   ├── Popup_DeleteSave
│   │   │   └── Popup_KeyBinding
│   │   │
│   │   ├── Layer_Tooltip
│   │   │   ├── Tooltip_Generic
│   │   │   ├── Tooltip_Class
│   │   │   └── Tooltip_Mode
│   │   │
│   │   └── Layer_Fade
│   │       ├── Img_FadeBlack
│   │       └── UI_LoadingSpinnerSmall
│   │
│   ├── UIBlocker_Fullscreen
│   └── Debug_UIStateLabel
│
├── Canvas_LoadingScreen                     # 独立 Canvas，加载时可常驻
├── Canvas_SystemOverlay                     # 系统提示、保存中、输入提示
├── MainMenuUIController
├── MainMenuNavigationController
└── MainMenuAnimationController
```

### 4.2 Canvas 分层规则

| Canvas | 用途 | Sorting Order |
|---|---|---|
| Canvas_MainMenu | 主 UI | 100 |
| Canvas_LoadingScreen | 全屏加载界面 | 500 |
| Canvas_SystemOverlay | 保存中、版本号、网络状态 | 800 |
| Canvas_Debug | 开发调试 | 999 |

### 4.3 命名规范

```text
Panel_    = 全屏或大面板
Widget_   = 复合组件
Item_     = 列表元素
Btn_      = 按钮
Txt_      = 文本
Img_      = 图片
Icon_     = 图标
Slot_     = 槽位
Popup_    = 弹窗
Tooltip_  = 悬浮提示
```

---

## 5. 主菜单界面设计

### 5.1 Panel_TitleMenu.prefab

```text
Panel_TitleMenu
├── Anchor_LeftMenu
│   ├── Logo_GameTitle
│   ├── Btn_Continue
│   ├── Btn_NewGame
│   ├── Btn_LoadGame
│   ├── Btn_Settings
│   ├── Btn_News
│   ├── Btn_Credits
│   └── Btn_Quit
│
├── Anchor_RightInfo
│   ├── Widget_LastCharacterCard
│   │   ├── Icon_Class
│   │   ├── Txt_CharacterName
│   │   ├── Txt_LevelAndClass
│   │   ├── Txt_CurrentLocation
│   │   ├── Txt_PlayTime
│   │   └── Btn_EnterLastCharacter
│   │
│   ├── Widget_SeasonStatus
│   │   ├── Txt_ModeName
│   │   ├── Txt_SeasonTime
│   │   └── Btn_ModeDetail
│   │
│   └── Widget_SystemNotice
│       ├── Txt_Title
│       ├── Txt_Summary
│       └── Btn_OpenNotice
│
├── Anchor_BottomHint
│   ├── Txt_InputHint_Confirm
│   ├── Txt_InputHint_Back
│   └── Txt_InputHint_SwitchProfile
│
└── Anim_TitleMenu
```

### 5.2 主菜单按钮状态

| 按钮 | 显示条件 | 禁用条件 | 点击行为 |
|---|---|---|---|
| Continue | 有最近角色 | 最近角色存档损坏 | 直接进入最近角色 |
| NewGame | 永远显示 | 存档槽满时禁用或提示覆盖 | 打开新存档流程 |
| LoadGame | 有至少 1 个角色 | 无角色时禁用 | 打开旧存档列表 |
| Settings | 永远显示 | 无 | 打开设置 |
| News | 可联网或本地公告存在 | 无公告时灰掉 | 打开公告 |
| Credits | 永远显示 | 无 | 打开制作人员 |
| Quit | PC 显示 | 移动端隐藏 | 打开退出确认 |

### 5.3 最近角色卡片

显示玩家最后一次游玩的角色：

```text
角色名：夜刃行者01
等级：Lv.23
职业：暗影刺客
模式：标准 / 硬核 / 赛季
所在区域：星陨营地
游戏时长：08:31:22
最后保存：2026-07-03 18:20
```

### 5.4 主菜单交互细节

- 鼠标悬停按钮时，按钮文字亮起，背景发出微弱光。
- 手柄选中按钮时，左侧出现尖角标记或边框高亮。
- 点击 Continue 后不要立刻黑屏，先播放 0.2 秒按钮确认动画，再切入 Loading。
- 没有最近角色时，Continue 按钮显示“继续游戏”，但灰掉，并在右侧提示“没有可继续的角色”。
- 主菜单背景角色可呼吸、转头、调整武器，但不要做过多动作，避免抢 UI 注意力。

---

## 6. 新存档流程

### 6.1 新建流程总览

```text
Btn_NewGame
→ Panel_SaveSlotSelect
→ Panel_ClassSelect
→ Panel_CharacterCreate
→ Panel_ModeSelect
→ Popup_ConfirmCreate
→ CreateSaveData
→ LoadingScreen
→ TutorialMap 或 Town
```

### 6.2 Panel_SaveSlotSelect.prefab

```text
Panel_SaveSlotSelect
├── Header
│   ├── Txt_Title_选择存档槽
│   ├── Txt_Subtitle_选择一个空槽位创建新角色
│   └── Btn_Back
│
├── Body
│   ├── Scroll_SaveSlots
│   │   └── Content
│   │       ├── Item_SaveSlot_01
│   │       ├── Item_SaveSlot_02
│   │       ├── Item_SaveSlot_03
│   │       └── ...
│   │
│   └── Panel_SlotDetail
│       ├── Txt_SlotState
│       ├── Txt_SaveInfo
│       ├── Txt_Warning
│       └── Btn_SelectSlot
│
└── Footer
    ├── Txt_CapacityInfo
    └── Btn_ManageSaves
```

### 6.3 存档槽状态

| 状态 | 显示 | 操作 |
|---|---|---|
| Empty | 空槽位，暗色边框 | 可新建 |
| Occupied | 显示角色简表 | 点击后提示覆盖/禁止覆盖 |
| Corrupted | 红色警告 | 可尝试修复/删除 |
| Locked | 锁图标 | 预留付费/扩展槽，不建议第一版用 |
| CloudConflict | 云端冲突图标 | 打开冲突处理弹窗 |

### 6.4 新建存档数据

```json
{
  "saveSlotId": "slot_001",
  "profileId": "local_profile_001",
  "characterId": "char_000001",
  "characterName": "",
  "classId": "class_warrior_guard",
  "modeId": "standard",
  "difficultyId": "normal",
  "createdAt": "2026-07-03T18:30:00+09:00",
  "lastPlayedAt": "2026-07-03T18:30:00+09:00",
  "sceneId": "10_Town_StarfallCamp",
  "spawnPointId": "spawn_new_character",
  "level": 1,
  "playTimeSeconds": 0,
  "version": 1
}
```

---

## 7. 角色选择与职业选择

### 7.1 Panel_ClassSelect.prefab

```text
Panel_ClassSelect
├── Header
│   ├── Txt_Title_选择职业
│   ├── Txt_Subtitle_每个职业拥有不同起点、技能倾向和装备偏好
│   └── Btn_Back
│
├── Body
│   ├── Left_ClassGrid
│   │   ├── Item_ClassCard_重甲战士
│   │   ├── Item_ClassCard_荒怒蛮王
│   │   ├── Item_ClassCard_长弓游侠
│   │   ├── Item_ClassCard_猎矛行者
│   │   ├── Item_ClassCard_弩炮佣兵
│   │   ├── Item_ClassCard_圣锤裁决者
│   │   ├── Item_ClassCard_风雷武僧
│   │   ├── Item_ClassCard_暗影刺客
│   │   ├── Item_ClassCard_元素术士
│   │   ├── Item_ClassCard_亡魂女巫
│   │   ├── Item_ClassCard_变形德鲁伊
│   │   └── Item_ClassCard_神谕祭司
│   │
│   ├── Center_CharacterPreview
│   │   ├── RawImage_PreviewRenderTexture
│   │   ├── Btn_RotateLeft
│   │   ├── Btn_RotateRight
│   │   ├── Btn_ZoomIn
│   │   ├── Btn_ZoomOut
│   │   └── Widget_PreviewLoading
│   │
│   └── Right_ClassDetail
│       ├── Txt_ClassName
│       ├── Txt_ClassTagline
│       ├── Widget_DifficultyStars
│       ├── Widget_CoreAttributes
│       ├── Widget_CombatStyleTags
│       ├── Widget_StarterSkills
│       ├── Widget_RecommendedWeapons
│       ├── Widget_AscendancyPreview
│       └── Btn_SelectClass
│
└── Footer
    ├── Txt_InputHint
    └── Btn_Confirm
```

### 7.2 职业卡片 Item_ClassCard.prefab

```text
Item_ClassCard
├── Img_Background
├── Img_SelectedFrame
├── Icon_ClassPortrait
├── Txt_ClassName
├── Txt_AttributeShort
├── Icon_Difficulty
├── Group_Tags
│   ├── Tag_近战
│   ├── Tag_法术
│   └── Tag_召唤
└── Img_LockOverlay
```

### 7.3 职业详情字段

| 字段 | 用途 | 示例 |
|---|---|---|
| classId | 程序 ID | class_guard_warrior |
| displayName | 显示名 | 重甲战士 |
| shortDesc | 一句话定位 | 防御、重击、格挡反击 |
| attributeBias | 属性倾向 | 力量 70 / 敏捷 15 / 智力 15 |
| weaponTags | 推荐武器 | 单手剑、盾、双手锤 |
| armorTags | 防具倾向 | 重甲、盾牌 |
| starterSkills | 初始技能 | 裂地斩、盾墙、战吼 |
| difficulty | 上手难度 | 2/5 |
| previewPrefab | 预览模型 | PFV_Class_GuardWarrior |
| startPassiveNode | 天赋树起点 | passive_start_guard |
| defaultSpawnSet | 初始装备包 | starter_guard_set |

### 7.4 职业选择交互

- 鼠标悬停职业卡片时，右侧详情预览快速刷新。
- 点击职业卡片后，3D 角色模型切换，播放待机动作。
- 双击职业卡片可以直接确认，但首次进入建议弹确认。
- 职业未解锁时显示锁图标和解锁条件。
- 手柄模式下，左右移动选择职业，上下移动切换职业行。
- 角色模型加载失败时，显示剪影占位图，不阻塞流程。

---

## 8. 角色创建界面

### 8.1 Panel_CharacterCreate.prefab

```text
Panel_CharacterCreate
├── Header
│   ├── Txt_Title_创建角色
│   └── Btn_Back
│
├── Body
│   ├── Left_SelectedClassSummary
│   │   ├── Icon_Class
│   │   ├── Txt_ClassName
│   │   ├── Txt_CoreStyle
│   │   └── Btn_ChangeClass
│   │
│   ├── Center_CharacterPreview
│   │   ├── RawImage_Preview
│   │   ├── Widget_EquipPreviewToggle
│   │   └── Widget_IdleAnimSelector
│   │
│   └── Right_CreateForm
│       ├── Input_CharacterName
│       ├── Txt_NameRule
│       ├── Dropdown_BodyPreset
│       ├── Dropdown_VoicePreset
│       ├── Dropdown_FacePreset
│       ├── Widget_ColorSelector_Hair
│       ├── Widget_ColorSelector_Skin
│       ├── Toggle_SkipTutorial
│       └── Btn_Next
│
└── Footer
    ├── Txt_ErrorMessage
    └── Txt_InputHint
```

### 8.2 第一版是否需要捏脸

第一版不建议做完整捏脸，只做：

```text
体型预设：默认 / 强壮 / 轻装
脸部预设：1 / 2 / 3
发色预设：黑 / 白 / 棕 / 红
语音预设：A / B / C
```

真正的刷宝 ARPG 核心不是捏脸，而是职业、装备、技能和战斗。角色创建不要拖慢原型开发。

### 8.3 角色命名规则

| 规则 | 说明 |
|---|---|
| 字数 | 2-16 个字符 |
| 允许 | 中文、英文、数字、下划线 |
| 禁止 | 空名、全空格、特殊控制符 |
| 重名 | 单机可允许，在线模式必须唯一 |
| 敏感词 | 本地敏感词表过滤 |

### 8.4 角色创建确认弹窗

```text
Popup_ConfirmCreate
├── Txt_Title_确认创建
├── Txt_Body
│   └── 你将创建：Lv.1 重甲战士「角色名」。创建后仍可删除角色，但无法更改初始职业。
├── Btn_Cancel
└── Btn_ConfirmCreate
```

---

## 9. 模式选择界面

### 9.1 Panel_ModeSelect.prefab

```text
Panel_ModeSelect
├── Header
│   ├── Txt_Title_选择模式
│   └── Btn_Back
│
├── Body
│   ├── Item_ModeCard_Standard
│   ├── Item_ModeCard_Hardcore
│   ├── Item_ModeCard_Season
│   ├── Item_ModeCard_SoloSelfFound
│   └── Item_ModeCard_CustomChallenge
│
├── Right_ModeDetail
│   ├── Txt_ModeName
│   ├── Txt_ModeDesc
│   ├── Txt_Rules
│   ├── Txt_RewardPreview
│   ├── Txt_Warning
│   └── Btn_ConfirmMode
│
└── Footer
    └── Txt_InputHint
```

### 9.2 模式规则

| 模式 | 第一版是否开放 | 说明 |
|---|---|---|
| 标准 | 开放 | 普通离线存档，死亡不删档 |
| 硬核 | 暂缓 | 死亡后角色转为不可进入或转标准 |
| 赛季 | 预留 | 独立经济、独立排名、赛季机制 |
| 独狼 | 预留 | 禁止共享仓库、交易、组队 |
| 自定义挑战 | 预留 | 调试/玩法测试用 |

### 9.3 模式卡 Item_ModeCard.prefab

```text
Item_ModeCard
├── Img_Background
├── Img_Selected
├── Icon_Mode
├── Txt_ModeName
├── Txt_ModeShortDesc
├── Tag_Recommended
├── Tag_Locked
└── Txt_OpenCondition
```

---

## 10. 旧存档选择界面

### 10.1 Panel_LoadSave.prefab

```text
Panel_LoadSave
├── Header
│   ├── Txt_Title_选择角色
│   ├── Btn_Back
│   ├── Btn_Sort
│   ├── Btn_Filter
│   └── Btn_NewCharacter
│
├── Body
│   ├── Left_CharacterList
│   │   ├── Scroll_Characters
│   │   │   └── Content
│   │   │       ├── Item_CharacterSaveCard
│   │   │       ├── Item_CharacterSaveCard
│   │   │       └── ...
│   │   └── Widget_EmptyState
│   │
│   └── Right_CharacterDetail
│       ├── RawImage_CharacterPreview
│       ├── Txt_CharacterName
│       ├── Txt_LevelClassMode
│       ├── Txt_Location
│       ├── Txt_PlayTime
│       ├── Txt_LastSaveTime
│       ├── Widget_EquippedSummary
│       ├── Widget_ProgressSummary
│       ├── Widget_SaveWarning
│       ├── Btn_EnterGame
│       ├── Btn_Duplicate
│       ├── Btn_Rename
│       ├── Btn_Delete
│       └── Btn_OpenSaveFolder
│
└── Footer
    ├── Txt_SaveCount
    └── Txt_InputHint
```

### 10.2 存档卡 Item_CharacterSaveCard.prefab

```text
Item_CharacterSaveCard
├── Img_Background
├── Img_SelectedFrame
├── Icon_Class
├── Txt_CharacterName
├── Txt_Level
├── Txt_Class
├── Txt_Mode
├── Txt_Location
├── Txt_LastPlayed
├── Icon_Hardcore
├── Icon_Season
├── Icon_Corrupted
└── Btn_More
```

### 10.3 旧存档排序

| 排序项 | 默认 | 说明 |
|---|---|---|
| 最近游玩 | 是 | 按 lastPlayedAt 降序 |
| 等级 | 否 | 高等级优先 |
| 创建时间 | 否 | 新角色优先 |
| 职业 | 否 | 按职业 ID |
| 模式 | 否 | 标准/赛季/硬核 |

### 10.4 存档操作

#### 进入游戏

```text
点击 Btn_EnterGame
→ SaveGameService.ValidateSave
→ SceneLoadService.PrepareLoad
→ LoadingScreen.Show
→ Load CharacterData
→ Load TargetScene
→ Spawn Player
→ Restore Inventory/Quest/MapState
→ FadeIn
```

#### 删除存档

```text
点击 Btn_Delete
→ Popup_DeleteSave
→ 输入角色名或长按确认
→ Backup Save 到 DeletedBackup
→ 删除主存档
→ 刷新列表
```

删除必须有二次确认。硬核角色、赛季角色、云存档冲突角色要显示额外警告。

#### 复制存档

用于开发测试和单机玩家备份：

```text
点击 Btn_Duplicate
→ 输入新角色名
→ 复制 CharacterData
→ 生成新 characterId
→ 清除临时战斗状态
→ 保存新存档
```

### 10.5 存档损坏处理

```text
Widget_SaveWarning
├── 状态：存档版本过旧 / 文件缺失 / JSON 解析失败 / 场景 ID 不存在
├── 操作：尝试修复 / 查看详情 / 删除 / 打开备份
└── 第一版：只做提示和删除，不做自动修复
```

---

## 11. 设置页面

### 11.1 Panel_Settings.prefab

```text
Panel_Settings
├── Header
│   ├── Txt_Title_设置
│   ├── Btn_Back
│   ├── Btn_ResetAll
│   ├── Btn_Apply
│   └── Btn_Discard
│
├── Left_TabList
│   ├── Tab_Graphics
│   ├── Tab_Audio
│   ├── Tab_Controls
│   ├── Tab_Gameplay
│   ├── Tab_Accessibility
│   ├── Tab_Language
│   └── Tab_Account
│
├── Right_Content
│   ├── Page_Graphics
│   ├── Page_Audio
│   ├── Page_Controls
│   ├── Page_Gameplay
│   ├── Page_Accessibility
│   ├── Page_Language
│   └── Page_Account
│
└── Footer
    ├── Txt_UnsavedChanges
    └── Txt_InputHint
```

### 11.2 画面设置 Page_Graphics

```text
Page_Graphics
├── Dropdown_DisplayMode       # 全屏 / 无边框 / 窗口
├── Dropdown_Resolution
├── Slider_RenderScale
├── Dropdown_FrameRateLimit
├── Toggle_VSync
├── Dropdown_TextureQuality
├── Dropdown_ShadowQuality
├── Dropdown_AntiAliasing
├── Dropdown_PostProcessQuality
├── Toggle_MotionBlur
├── Slider_Brightness
├── Slider_Contrast
├── Slider_Gamma
├── Btn_AutoDetect
└── Btn_ResetGraphics
```

建议第一版设置项：

| 项 | 默认 | 说明 |
|---|---|---|
| 显示模式 | 无边框全屏 | PC 默认 |
| 分辨率 | 当前桌面 | 自动读取 |
| 帧率限制 | 60 | 可选 30/60/120/无限 |
| 垂直同步 | 关 | 交给帧率限制 |
| 阴影质量 | 中 | 原型阶段节省性能 |
| 动态模糊 | 关 | ACT 操作不建议默认开 |

### 11.3 声音设置 Page_Audio

```text
Page_Audio
├── Slider_MasterVolume
├── Slider_MusicVolume
├── Slider_SFXVolume
├── Slider_UIVolume
├── Slider_AmbienceVolume
├── Slider_VoiceVolume
├── Dropdown_OutputDevice
├── Toggle_MuteWhenUnfocused
└── Btn_TestSound
```

### 11.4 操作设置 Page_Controls

```text
Page_Controls
├── Widget_InputDeviceTabs
│   ├── Tab_KeyboardMouse
│   ├── Tab_Gamepad
│   └── Tab_Touch
│
├── Scroll_KeyBindingList
│   └── Content
│       ├── Item_KeyBinding_MoveForward
│       ├── Item_KeyBinding_MoveBackward
│       ├── Item_KeyBinding_MoveLeft
│       ├── Item_KeyBinding_MoveRight
│       ├── Item_KeyBinding_Dodge
│       ├── Item_KeyBinding_PrimaryAttack
│       ├── Item_KeyBinding_Skill1
│       ├── Item_KeyBinding_Skill2
│       ├── Item_KeyBinding_Skill3
│       ├── Item_KeyBinding_Skill4
│       ├── Item_KeyBinding_Interact
│       ├── Item_KeyBinding_Inventory
│       ├── Item_KeyBinding_SkillPanel
│       ├── Item_KeyBinding_Map
│       └── Item_KeyBinding_Pause
│
├── Slider_MouseSensitivity
├── Slider_GamepadLookSensitivity
├── Toggle_InvertYAxis
├── Toggle_AutoTargetAssist
├── Toggle_HoldToMove
└── Btn_ResetControls
```

### 11.5 游戏性设置 Page_Gameplay

```text
Page_Gameplay
├── Toggle_ShowDamageNumbers
├── Toggle_ShowEnemyHealthBars
├── Toggle_AlwaysShowLootLabels
├── Dropdown_LootLabelMode
├── Toggle_AutoCompareEquipment
├── Toggle_ShowAdvancedItemStats
├── Toggle_ScreenShake
├── Slider_ScreenShakeStrength
├── Toggle_AutoPickupGold
├── Toggle_AutoPickupMaterials
├── Toggle_HoldInteractToPickup
├── Toggle_MinimapRotate
└── Dropdown_CameraDistance
```

### 11.6 无障碍设置 Page_Accessibility

```text
Page_Accessibility
├── Slider_UIScale
├── Dropdown_ColorBlindMode
├── Toggle_HighContrastLootLabels
├── Toggle_ReduceFlashing
├── Toggle_ReduceCameraShake
├── Toggle_Subtitles
├── Slider_SubtitleSize
├── Toggle_ButtonHoldAssist
├── Toggle_AutoAimAssist
└── Toggle_SimplifiedTooltip
```

### 11.7 语言设置 Page_Language

```text
Page_Language
├── Dropdown_TextLanguage
├── Dropdown_VoiceLanguage
├── Dropdown_SubtitleLanguage
├── Toggle_UseSystemLanguage
└── Btn_ReloadLocalization
```

### 11.8 设置应用规则

| 设置类型 | 是否立即生效 | 是否需要 Apply | 是否需要重启 |
|---|---|---|---|
| 音量 | 是 | 否 | 否 |
| UI 缩放 | 是 | 可撤销 | 否 |
| 分辨率 | 预览 10 秒 | 是 | 否 |
| 语言 | 部分刷新 | 是 | 部分需要回主菜单 |
| 键位 | 是 | 是 | 否 |
| 渲染管线质量 | 否 | 是 | 可能需要重载场景 |

---

## 12. 加载界面

### 12.1 LoadingScreen.prefab

```text
UI_LoadingScreen
├── Canvas_Loading
│   ├── Img_Background
│   ├── Img_DarkOverlay
│   ├── Center_Artwork
│   │   ├── Img_LoadingIllustration
│   │   └── Img_IllustrationFrame
│   │
│   ├── Bottom_LoadingInfo
│   │   ├── Txt_AreaName
│   │   ├── Txt_AreaType
│   │   ├── Txt_LoadingTip
│   │   ├── Progress_LoadingBar
│   │   ├── Txt_LoadingPercent
│   │   └── Icon_Spinner
│   │
│   ├── Right_BuildTip
│   │   ├── Txt_TipTitle
│   │   ├── Txt_TipBody
│   │   └── Icon_TipCategory
│   │
│   ├── BottomRight_System
│   │   ├── Txt_AutoSaveWarning
│   │   └── Txt_Version
│   │
│   └── Debug_LoadingStep
```

### 12.2 加载流程

```text
StartLoading(targetSceneId, spawnPointId)
1. 禁止主菜单输入
2. FadeOut 当前 UI
3. 显示 LoadingScreen
4. 保存当前存档状态
5. 卸载非必要资源
6. 加载目标场景
7. 加载场景依赖表
8. 加载玩家角色数据
9. 生成玩家 PlayerPrefab
10. 生成相机与输入控制器
11. 恢复背包/技能/任务/地图状态
12. 生成 NPC / 传送点 / 放置物
13. 等待 NavMesh / AI 初始化
14. FadeIn
15. 开放输入
```

### 12.3 加载进度分段

| 进度 | 阶段 | 文案 |
|---|---|---|
| 0-10% | 准备加载 | 整理行囊 |
| 10-30% | 加载场景 | 打开远征之门 |
| 30-50% | 加载角色 | 召回你的化身 |
| 50-70% | 加载怪物/NPC | 唤醒区域事件 |
| 70-90% | 加载 UI/任务 | 标记目标 |
| 90-100% | 等待场景稳定 | 即将进入 |

### 12.4 加载提示分类

```text
LoadingTipCategory
├── Combat
├── Equipment
├── Skill
├── PassiveTree
├── Map
├── Boss
├── Trade
├── Craft
├── Control
└── System
```

### 12.5 加载提示示例

```text
战斗：翻滚可以取消部分后摇，但不能取消已经进入命中的重攻击。
装备：稀有装备不一定比魔法装备强，关键看词条是否适合你的技能。
技能：辅助模块会改变技能行为，有时降低伤害换来更大的范围更有效。
天赋：大节点通常改变玩法，小节点主要提供稳定成长。
地图：地图词缀会同时提高危险和奖励。
Boss：Boss 进入新阶段前通常会有明显动作和场地提示。
打造：保留高价值基底，再投入打造资源更划算。
操作：锁定目标适合单体 Boss，自由瞄准更适合清怪。
```

### 12.6 加载异常

```text
Popup_LoadingError
├── Txt_Title_加载失败
├── Txt_ErrorCode
├── Txt_ErrorDesc
├── Btn_Retry
├── Btn_ReturnMainMenu
└── Btn_ReportLog
```

常见错误：

| 错误码 | 说明 | 处理 |
|---|---|---|
| LOAD_SCENE_MISSING | 场景不存在 | 回主菜单 |
| LOAD_SAVE_CORRUPTED | 存档损坏 | 回旧档选择 |
| LOAD_PREFAB_MISSING | 玩家/NPC 预制体缺失 | 报错，回主菜单 |
| LOAD_TABLE_VERSION | 数据表版本不兼容 | 尝试升级，失败则回主菜单 |
| LOAD_TIMEOUT | 加载超时 | 重试 |

---

## 13. 公告与更新页面

### 13.1 Panel_News.prefab

```text
Panel_News
├── Header
│   ├── Txt_Title_公告
│   └── Btn_Back
│
├── Left_NewsList
│   └── Scroll_News
│       └── Content
│           ├── Item_NewsCard
│           └── ...
│
├── Right_NewsDetail
│   ├── Txt_NewsTitle
│   ├── Txt_Date
│   ├── Scroll_Content
│   │   └── Txt_Body
│   └── Btn_OpenLink
│
└── Footer
    └── Txt_NetworkState
```

### 13.2 第一版公告实现

第一版不需要联网，使用本地 JSON：

```json
{
  "newsId": "news_001",
  "title": "原型版本说明",
  "date": "2026-07-03",
  "category": "Update",
  "bodyKey": "news_001_body",
  "priority": 10
}
```

---

## 14. 制作人员页面

### 14.1 Panel_Credits.prefab

```text
Panel_Credits
├── Header
│   ├── Txt_Title_制作人员
│   └── Btn_Back
│
├── Scroll_Credits
│   └── Content
│       ├── Txt_ProjectName
│       ├── Group_Design
│       ├── Group_Programming
│       ├── Group_Art
│       ├── Group_Audio
│       ├── Group_QA
│       └── Group_SpecialThanks
│
└── Footer
    └── Btn_BackToTitle
```

---

## 15. 确认弹窗系统

### 15.1 Popup_Confirm.prefab

```text
Popup_Confirm
├── Img_Backdrop
├── Window
│   ├── Header
│   │   ├── Txt_Title
│   │   └── Btn_Close
│   ├── Body
│   │   ├── Icon_Warning
│   │   ├── Txt_Message
│   │   └── Input_OptionalConfirmText
│   └── Footer
│       ├── Btn_Cancel
│       └── Btn_Confirm
```

### 15.2 弹窗类型

| 类型 | 用途 | 是否阻塞 |
|---|---|---|
| ConfirmCreate | 创建角色确认 | 是 |
| ConfirmDelete | 删除角色确认 | 是 |
| ConfirmQuit | 退出游戏确认 | 是 |
| ConfirmApplySettings | 应用高风险设置 | 是 |
| SaveConflict | 存档冲突 | 是 |
| Info | 一般提示 | 否 |
| Error | 错误提示 | 是 |

---

## 16. 输入导航规则

### 16.1 PC 键鼠

| 操作 | 按键 |
|---|---|
| 确认 | 左键 / Enter |
| 返回 | ESC / 右键可选 |
| 切换页签 | Q/E 或 鼠标点击 |
| 滚动列表 | 滚轮 |
| 旋转角色 | 按住右键拖动 / A-D |
| 缩放角色 | 滚轮 / +/- |
| 打开设置 | 主菜单按钮 |

### 16.2 手柄

| 操作 | Xbox 示例 |
|---|---|
| 确认 | A |
| 返回 | B |
| 切换页签 | LB / RB |
| 移动焦点 | 左摇杆 / 十字键 |
| 滚动详情 | 右摇杆 |
| 旋转角色 | 右摇杆左右 |
| 打开操作提示 | View |

### 16.3 移动端触屏

| 操作 | 手势 |
|---|---|
| 确认 | 点击 |
| 返回 | 返回按钮 / 系统返回 |
| 滚动 | 滑动 |
| 旋转角色 | 预览区横向拖动 |
| 缩放角色 | 双指缩放 |
| 打开更多 | 长按 / 更多按钮 |

### 16.4 UI 焦点规则

- 每个 Panel 打开时必须设置默认焦点。
- 弹窗打开时，焦点进入弹窗，关闭后返回来源控件。
- 列表刷新后，尽量保持原选中项。
- 手柄模式下，不允许出现“无焦点但界面可操作”的状态。
- 输入设备切换时，UI 提示自动切换为键鼠/手柄/触屏图标。

---

## 17. 主界面状态机

### 17.1 MainMenuState

```csharp
public enum MainMenuState
{
    Boot,
    Splash,
    TitleMenu,
    SaveSlotSelect,
    LoadSave,
    ClassSelect,
    CharacterCreate,
    ModeSelect,
    Settings,
    News,
    Credits,
    ConfirmPopup,
    Loading,
    Error
}
```

### 17.2 状态切换规则

```text
EnterState(newState)
1. 关闭当前 Panel 或播放退出动画
2. 保存上一个状态到 Stack
3. 打开新 Panel
4. 设置默认焦点
5. 刷新输入提示
6. 播放进入动画
7. 发出 UIStateChanged 事件
```

### 17.3 状态栈

状态栈用于返回：

```text
TitleMenu
→ SaveSlotSelect
→ ClassSelect
→ CharacterCreate
→ ModeSelect
```

按返回时：

```text
ModeSelect → CharacterCreate → ClassSelect → SaveSlotSelect → TitleMenu
```

加载界面不进入普通返回栈。

---

## 18. 数据结构设计

### 18.1 ProfileData

```json
{
  "profileId": "local_profile_001",
  "profileName": "Player",
  "createdAt": "2026-07-03T18:00:00+09:00",
  "lastLoginAt": "2026-07-03T18:00:00+09:00",
  "lastCharacterId": "char_000001",
  "settingsId": "settings_local_001",
  "saveSlotLimit": 20,
  "cloudEnabled": false
}
```

### 18.2 CharacterSummaryData

```json
{
  "characterId": "char_000001",
  "saveSlotId": "slot_001",
  "characterName": "灰烬行者",
  "classId": "class_guard_warrior",
  "level": 23,
  "modeId": "standard",
  "sceneId": "10_Town_StarfallCamp",
  "locationNameKey": "location_starfall_camp",
  "playTimeSeconds": 30682,
  "lastPlayedAt": "2026-07-03T18:20:00+09:00",
  "previewEquipmentIds": ["eq_helmet_001", "eq_weapon_032"],
  "isHardcoreDead": false,
  "isCorrupted": false,
  "saveVersion": 4
}
```

### 18.3 MainMenuConfig

```json
{
  "defaultPanel": "TitleMenu",
  "enableContinue": true,
  "enableNews": true,
  "enableCredits": true,
  "enableQuitButton": true,
  "maxLocalSaveSlots": 20,
  "firstSceneId": "20_Act01_TutorialCoast",
  "firstTownSceneId": "10_Town_StarfallCamp",
  "loadingTipTableId": "loading_tips_001",
  "backgroundSceneProfile": "menu_bg_dark_camp"
}
```

### 18.4 SettingsData

```json
{
  "graphics": {
    "displayMode": "Borderless",
    "resolutionWidth": 1920,
    "resolutionHeight": 1080,
    "frameRateLimit": 60,
    "vSync": false,
    "shadowQuality": "Medium",
    "motionBlur": false
  },
  "audio": {
    "master": 0.8,
    "music": 0.7,
    "sfx": 0.9,
    "ui": 0.8,
    "voice": 0.8
  },
  "gameplay": {
    "showDamageNumbers": true,
    "alwaysShowLootLabels": false,
    "autoCompareEquipment": true,
    "screenShakeStrength": 0.5
  },
  "controls": {
    "mouseSensitivity": 1.0,
    "gamepadSensitivity": 1.0,
    "invertY": false
  }
}
```

---

## 19. 资源目录规范

```text
Assets/Game/UI/MainMenu/
├── Prefabs/
│   ├── UI_MainMenuRoot.prefab
│   ├── Panel_TitleMenu.prefab
│   ├── Panel_SaveSlotSelect.prefab
│   ├── Panel_LoadSave.prefab
│   ├── Panel_ClassSelect.prefab
│   ├── Panel_CharacterCreate.prefab
│   ├── Panel_ModeSelect.prefab
│   ├── Panel_Settings.prefab
│   ├── Panel_News.prefab
│   ├── Panel_Credits.prefab
│   ├── UI_LoadingScreen.prefab
│   ├── Popup_Confirm.prefab
│   └── Popup_Error.prefab
│
├── Widgets/
│   ├── Widget_SaveSlot.prefab
│   ├── Widget_CharacterCard.prefab
│   ├── Widget_ClassCard.prefab
│   ├── Widget_ModeCard.prefab
│   ├── Widget_SettingsRow.prefab
│   ├── Widget_KeyBindingRow.prefab
│   ├── Widget_LoadingTip.prefab
│   └── Widget_InputHint.prefab
│
├── Sprites/
│   ├── Frames/
│   ├── Icons/
│   ├── Backgrounds/
│   └── Common/
│
├── Animations/
│   ├── Panel_TitleMenu_Open.anim
│   ├── Panel_TitleMenu_Close.anim
│   ├── Panel_ClassSelect_Open.anim
│   └── Loading_Fade.anim
│
├── Materials/
├── Fonts/
└── RenderTextures/
    └── RT_CharacterPreview.renderTexture
```

---

## 20. 角色预览系统

### 20.1 PreviewStage.prefab

```text
PFV_MainMenu_CharacterPreviewStage
├── Camera_Preview
├── Light_Key
├── Light_Fill
├── Light_Rim
├── PreviewRoot
│   └── SpawnedCharacterPreview
├── WeaponPreviewSocket
├── VFX_BackgroundFog
├── VFX_FireEmbers
└── PreviewStageController
```

### 20.2 预览角色 Prefab

```text
PFV_ClassPreview_XXX
├── ModelRoot
├── Animator
├── WeaponSockets
│   ├── Socket_RightHand
│   ├── Socket_LeftHand
│   └── Socket_Back
├── PreviewEquipmentRoot
├── PreviewVFXRoot
└── ClassPreviewController
```

### 20.3 预览动作

| 动作 | 触发 |
|---|---|
| Idle | 默认 |
| Select | 点击职业卡 |
| Confirm | 确认职业 |
| Rotate | 拖拽模型 |
| WeaponShow | 查看推荐武器 |
| ClassSkillPreview | 点击技能预览按钮 |

第一版只需要 Idle、Select、Confirm 三个动作。

---

## 21. 主界面音效与音乐

### 21.1 音乐状态

```text
MainMenuMusicState
├── BootLogo
├── TitleIdle
├── CharacterSelect
├── CreateConfirm
├── Loading
└── Error
```

### 21.2 UI 音效

| 事件 | 音效 |
|---|---|
| 按钮悬停 | UI_Hover_Soft |
| 按钮确认 | UI_Click_Stone |
| 返回 | UI_Back_Whoosh |
| 打开面板 | UI_Panel_Open |
| 关闭面板 | UI_Panel_Close |
| 选择职业 | UI_Class_Select |
| 创建角色 | UI_Character_Create |
| 错误 | UI_Error_Low |
| 删除确认 | UI_Warning_Dark |
| 加载开始 | UI_Load_Start |

---

## 22. 动效规范

### 22.1 面板打开

```text
时长：0.18 - 0.25 秒
透明度：0 → 1
位移：Y -20 → 0
缩放：0.98 → 1.0
声音：UI_Panel_Open
```

### 22.2 面板关闭

```text
时长：0.12 - 0.18 秒
透明度：1 → 0
位移：Y 0 → -10
缩放：1.0 → 0.99
声音：UI_Panel_Close
```

### 22.3 按钮悬停

```text
文字亮度提高
边框光效出现
背景图轻微扩大 1.02
播放低音点击或石质摩擦音
```

### 22.4 加载淡入淡出

```text
FadeOut 当前界面：0.35 秒
LoadingScreen 出现：0.2 秒
加载完成后黑屏保持：0.1 秒
进入场景 FadeIn：0.45 秒
```

---

## 23. 本地化字段

所有主界面文本必须走本地化 Key。

```text
ui.main.title.continue
ui.main.title.new_game
ui.main.title.load_game
ui.main.title.settings
ui.main.title.news
ui.main.title.credits
ui.main.title.quit
ui.save.select.title
ui.class.select.title
ui.character.create.title
ui.mode.select.title
ui.loading.tip.combat_001
```

不要在 Prefab 文本里直接写死中文。

---

## 24. UI 与系统事件

### 24.1 UI 事件列表

```text
OnClickContinue
OnClickNewGame
OnClickLoadGame
OnClickSettings
OnClickQuit
OnSelectSaveSlot
OnSelectCharacter
OnDeleteCharacter
OnDuplicateCharacter
OnSelectClass
OnConfirmClass
OnChangeCharacterName
OnConfirmCreateCharacter
OnSelectMode
OnConfirmMode
OnApplySettings
OnDiscardSettings
OnStartLoading
OnLoadingProgressChanged
OnLoadingFinished
OnLoadingFailed
```

### 24.2 事件总线

```csharp
public struct MainMenuEvent
{
    public string eventName;
    public string panelId;
    public string sourceId;
    public object payload;
}
```

UI 不直接操作存档文件，必须通过 SaveGameService。

---

## 25. 保存系统与主界面关系

### 25.1 主界面读取的存档内容

主界面只读取 Summary，不读取完整角色存档。

```text
SaveSummary/
├── characterId
├── characterName
├── classId
├── level
├── modeId
├── sceneId
├── locationName
├── lastPlayedAt
├── playTimeSeconds
├── previewEquipment
└── saveState
```

完整存档进入 Loading 后再读。

### 25.2 自动保存提示

加载界面右下角：

```text
出现符文旋转图标时，请不要关闭游戏。
```

保存中必须屏蔽退出按钮。

---

## 26. 第一阶段开发任务清单

### 26.1 第 1 周：主菜单骨架

```text
[ ] 创建 00_Boot.unity
[ ] 创建 01_MainMenu.unity
[ ] 创建 UI_MainMenuRoot.prefab
[ ] 创建 Panel_TitleMenu.prefab
[ ] 实现 MainMenuState 状态机
[ ] 实现按钮跳转
[ ] 实现淡入淡出
```

### 26.2 第 2 周：存档列表

```text
[ ] 实现 ProfileData
[ ] 实现 CharacterSummaryData
[ ] 实现 SaveGameService 获取 Summary
[ ] 创建 Panel_SaveSlotSelect
[ ] 创建 Panel_LoadSave
[ ] 创建 Item_CharacterSaveCard
[ ] 实现最近角色 Continue
```

### 26.3 第 3 周：职业选择与角色创建

```text
[ ] 创建 Panel_ClassSelect
[ ] 创建 Item_ClassCard
[ ] 接入 12 职业数据表
[ ] 创建角色预览 Stage
[ ] 创建 Panel_CharacterCreate
[ ] 实现角色命名校验
[ ] 实现角色创建确认
```

### 26.4 第 4 周：设置页面

```text
[ ] 创建 Panel_Settings
[ ] 实现画面设置
[ ] 实现声音设置
[ ] 实现操作设置
[ ] 实现游戏性设置
[ ] 保存 SettingsData
[ ] 重启后读取设置
```

### 26.5 第 5 周：加载界面

```text
[ ] 创建 UI_LoadingScreen
[ ] 实现 SceneLoadService
[ ] 实现加载进度分段
[ ] 实现加载提示表
[ ] 加载到主城
[ ] 加载失败弹窗
```

### 26.6 第 6 周：体验打磨

```text
[ ] 手柄导航
[ ] 输入提示切换
[ ] UI 音效
[ ] 面板动效
[ ] 删除存档二次确认
[ ] 角色预览模型切换
[ ] UI 分辨率适配
[ ] 完整流程验收
```

---

## 27. 验收标准

### 27.1 主流程验收

```text
[ ] 第一次启动可以进入主菜单
[ ] 没有存档时 Continue 灰掉
[ ] 点击 NewGame 可以进入存档槽选择
[ ] 可以选择空槽位
[ ] 可以选择 12 个职业之一
[ ] 可以输入角色名
[ ] 非法角色名有提示
[ ] 可以选择标准模式
[ ] 可以创建角色
[ ] 创建后进入 LoadingScreen
[ ] LoadingScreen 完成后进入主城
[ ] 退出游戏后重新打开，可以在旧存档列表看到角色
[ ] Continue 可以进入最近角色
```

### 27.2 设置验收

```text
[ ] 音量设置立即生效
[ ] 分辨率设置可应用和撤销
[ ] 键位设置可重绑
[ ] UI 缩放有效
[ ] 设置保存到本地
[ ] 重启后设置仍然存在
```

### 27.3 输入验收

```text
[ ] 鼠标可以操作所有界面
[ ] 键盘可以返回/确认
[ ] 手柄可以移动焦点
[ ] 弹窗打开时焦点不会跑出弹窗
[ ] 加载时所有输入被屏蔽
```

### 27.4 存档验收

```text
[ ] 新建角色生成唯一 characterId
[ ] 删除角色需要二次确认
[ ] 删除后列表刷新
[ ] 存档损坏时不会导致主界面崩溃
[ ] Summary 读取失败时显示错误卡片
```

---

## 28. 程序脚本建议

```text
Scripts/UI/MainMenu/
├── MainMenuBootstrapper.cs
├── MainMenuUIController.cs
├── MainMenuStateMachine.cs
├── MainMenuNavigationController.cs
├── Panel_TitleMenu.cs
├── Panel_SaveSlotSelect.cs
├── Panel_LoadSave.cs
├── Panel_ClassSelect.cs
├── Panel_CharacterCreate.cs
├── Panel_ModeSelect.cs
├── Panel_Settings.cs
├── UI_LoadingScreen.cs
├── Widget_CharacterSaveCard.cs
├── Widget_ClassCard.cs
├── Widget_ModeCard.cs
├── Popup_Confirm.cs
└── Popup_Error.cs

Scripts/Systems/Save/
├── ProfileService.cs
├── SaveGameService.cs
├── SaveSummaryBuilder.cs
├── SaveVersionMigrator.cs
└── SaveCorruptionChecker.cs

Scripts/Systems/Loading/
├── SceneLoadService.cs
├── LoadingStep.cs
├── LoadingTipService.cs
└── SceneSpawnResolver.cs
```

---

## 29. 主界面数据表

### 29.1 ClassMenuTable

| 字段 | 类型 | 说明 |
|---|---|---|
| classId | string | 职业 ID |
| displayNameKey | string | 职业名称本地化 Key |
| descKey | string | 职业描述 Key |
| iconPath | string | 职业图标 |
| previewPrefabPath | string | 预览模型 |
| difficulty | int | 上手难度 1-5 |
| attributeTags | string[] | 属性标签 |
| combatTags | string[] | 战斗标签 |
| starterSkillIds | string[] | 初始技能 |
| recommendedWeaponTags | string[] | 推荐武器 |
| sortOrder | int | 排序 |
| unlocked | bool | 是否解锁 |

### 29.2 LoadingTipTable

| 字段 | 类型 | 说明 |
|---|---|---|
| tipId | string | 提示 ID |
| category | enum | 分类 |
| titleKey | string | 标题 Key |
| bodyKey | string | 内容 Key |
| minLevel | int | 最低等级 |
| maxLevel | int | 最高等级 |
| sceneTags | string[] | 场景标签 |
| weight | int | 权重 |

### 29.3 SaveSlotConfig

| 字段 | 类型 | 说明 |
|---|---|---|
| maxSlots | int | 最大本地角色数 |
| allowDuplicate | bool | 是否允许复制 |
| allowDelete | bool | 是否允许删除 |
| backupBeforeDelete | bool | 删除前备份 |
| summaryOnlyInMenu | bool | 主菜单只读取摘要 |

---

## 30. 最终建议的主界面首版布局

首版不要做太复杂，建议用以下布局：

```text
左侧：主菜单按钮
中间：3D 角色 / 职业预览
右侧：最近角色信息 / 当前职业详情
底部：输入提示
右下：版本号 / 保存状态
```

新建角色流程：

```text
选择空槽位 → 选择职业 → 输入名字 → 选择标准模式 → 创建 → 加载主城
```

旧角色流程：

```text
读取存档 → 角色列表 → 查看详情 → 进入游戏 → 加载上次位置
```

设置流程：

```text
主菜单 → 设置 → 修改 → 应用 → 返回主菜单
```

加载流程：

```text
显示区域名 + 插画 + 进度条 + 玩法提示 + 自动保存警告
```

---

## 31. 后续扩展

后续可以继续加入：

```text
账号登录
云存档
赛季角色
赛季公告
商城入口
角色外观展示
角色删除冷却
角色收藏/置顶
职业试玩
新手推荐职业
Build 模板导入
上次死亡位置提示
离线/在线切换
多语言启动选择
```

主界面应该先稳定、清晰、好用，不要一开始堆太多入口。暗黑刷宝 ARPG 的主界面最重要的是：让玩家能快进游戏，同时清楚知道自己选择了什么角色、什么模式、什么存档。
