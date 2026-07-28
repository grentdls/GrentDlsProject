## 2026-05-21 - 伤害跳字与单位头顶HUD反馈

### 修改内容
- 新增统一生命反馈事件，打通伤害、治疗、免疫、抵抗、护盾吸收的显示入口
- 把旧的一次性跳字升级为对象池版本，并补齐暴击、元素、DoT、治疗等样式
- 新增单位头顶 HUD，支持名称、等级、即时血条、延迟扣血层、受击闪光、Buff / Debuff 图标
- 新增轻量 `CombatStatusController`，作为后续正�?Buff 系统的运行时显示�?- 更新测试场景自动搭建逻辑，让玩家、敌人、训练假人默认带上状态显示入�?- 新增功能同步文档，记录本次实现范围、验证方式和后续扩展�?
### 修改文件
- `Assets/Game/Runtime/Gameplay/Combat/Health.cs`
- `Assets/Game/Runtime/Gameplay/Combat/IDamageable.cs`
- `Assets/Game/Runtime/Gameplay/Combat/DamageResolver.cs`
- `Assets/Game/Runtime/Gameplay/Combat/DamageResult.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/World/TerrainMovementReceiver2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberEmitter.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberPopup.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatWorldSpaceBar2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `WCDEL.Game.Runtime.csproj`
- `WCDEL.Game.Editor.csproj`

### 新增文件
- `Assets/Game/Runtime/Gameplay/Combat/HealthFeedbackEvent.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusController.cs`
- `docs/features/combat_damage_number_unit_hud_buff_feedback_sync.md`

### 影响范围
- 战斗伤害反馈显示
- 世界空间单位头顶 UI
- 测试战斗场景自动搭建
- 后续 Buff / Debuff 系统扩展入口

### 验证方式
- 运行 `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 进入战斗场景验证玩家、敌人、训练假人受击后的跳字、扣血层和头顶状态显�?
### 后续注意事项
- 当前 Buff 图标仍为轻量占位样式，后续接正式图集时可直接复用当前数据入口
- 如果现有场景单位没有�?`FoundationAssetUtility` 重建，仍可依赖旧世界条组件在运行时自动补�?HUD 与状态控制器入口

### 增量更新
- 追加了头顶施�?/ 蓄力条显�?- 追加了霸体状态自动映射到头顶 Buff �?- 追加了运行时自动创建的顶�?Boss 总血条与 Boss 蓄力�?
## 2026-05-21 - ??????????????

### ????
- ??????????? 4 ?????????????????????????????????????????
- ????????????????? prefab ???????????????????????????
- ?????????? `EquipmentPage` ??????????????????????????
- ??????????????????????????????????????
- ????????????????????????????????????????

### ????
- `Assets/Game/Runtime/Core/Definitions/GameEnums.cs`
- `Assets/Game/Runtime/Core/Data/PlayerRuntimeData.cs`
- `Assets/Game/Runtime/Bootstrap/GameSession.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`

### ????
- ?

### ????
- ????????
- ???????????
- ????????
- ?? Generated / Override ???????

### ????
- ?? `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ????????????????????????????????????????????

### ??????
- ?? `FoundationAssetUtility` ??????????????????????????????
- ??? Unity ????? `Tools/WCDEL/UI/Rebuild Generated UI/Backend` ???? Overrides????????????????????

## 2026-05-15 - 项目基础搭建

### 修改内容
- 建立 `docs/00~05` 基础文档
- 新建 `Assets/Game` 运行时与编辑器目录骨�?
- 搭建启动入口、输入读取、玩家移动、会话与基础定义
- 增加战斗、敌人、装备、技能、任务、地图、洞穴、经济等定义入口

### 修改文件
- `docs/00_PROJECT_OVERVIEW.md`
- `docs/01_ARCHITECTURE.md`
- `docs/02_CODING_RULES.md`
- `docs/03_UI_RULES.md`
- `docs/04_ASSET_RULES.md`
- `Assets/Game/Runtime/Bootstrap/*`
- `Assets/Game/Runtime/Core/Definitions/*`
- `Assets/Game/Runtime/Input/GameInputReader.cs`
- `Assets/Game/Runtime/Gameplay/Characters/TopDownCharacterMotor2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerActorController.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`

### 新增文件
- `docs/features/arpg_foundation_setup.md`

### 影响范围
- 项目基础架构
- 运行时主目录与编辑器目录
- 数据定义入口

### 验证方式
- 静态检查目录结构与程序集引用关�?

### 后续注意事项
- 后续功能继续基于统一输入、统一配置、统一控制链扩�?

## 2026-05-15 - 首个可玩切片

### 修改内容
- 增加玩家普攻、交互、生命与受击的最小可玩闭�?
- 增加训练假人与交互测试点
- 扩展测试场景一键搭建工�?

### 修改文件
- `Assets/Game/Runtime/Gameplay/Combat/Health.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/World/PlayerInteractionSensor.cs`
- `Assets/Game/Runtime/Gameplay/World/DebugInteractable.cs`
- `Assets/Game/Runtime/Gameplay/Combat/TrainingDummy.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`

### 新增文件
- `docs/features/starter_playable_slice.md`

### 影响范围
- 玩家交互与近战原�?
- 测试切片场景

### 验证方式
- 运行测试场景验证移动、攻击、交互和掉血

### 后续注意事项
- 命中判定仍是原型级实现，后续要接入正式动作判�?

## 2026-05-15 - 战斗原型扩展

### 修改内容
- 加入翻滚、敌人追击与近战攻击
- 增加世界空间血条与原型 HUD
- 扩展测试场景搭建逻辑

### 修改文件
- `Assets/Game/Runtime/Gameplay/Combat/DodgeController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/WorldSpaceBarFollower.cs`
- `Assets/Game/Runtime/Gameplay/UI/PrototypeHudPresenter.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`

### 新增文件
- `docs/features/prototype_combat_loop.md`

### 影响范围
- 战斗原型可玩�?
- 敌人基础行为
- 原型 HUD

### 验证方式
- 运行测试场景验证翻滚、敌人追击与受击显示

### 后续注意事项
- 敌人 AI 仍是最小原型，需后续拆分完整状态机

## 2026-05-15 - 人物基础操作系统同步

### 修改内容
- 拆分玩家状态、普攻、交互与闪避控制
- 增加玩家动作状态枚举与状态控制器
- 预留技能输入与后续动画事件接入�?

### 修改文件
- `Assets/Game/Runtime/Gameplay/Characters/PlayerActionState.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerStateController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerCombatController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerInteractionController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerActorController.cs`
- `Assets/Game/Runtime/Input/GameInputReader.cs`

### 新增文件
- `docs/features/player_control_system_sync.md`

### 影响范围
- 玩家控制层结�?
- 普攻、翻滚、交互入�?

### 验证方式
- 静态检查控制链路与依赖关系

### 后续注意事项
- 技能、死亡、复活和更细粒度状态在后续继续补齐

## 2026-05-15 - 受击死亡与技能输入同�?

### 修改内容
- 增加技能槽控制�?
- 增加受击、死亡、复活状态入�?
- 扩展原型 HUD 显示玩家状态与技能槽

### 修改文件
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerHitReactionController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerStateController.cs`

### 新增文件
- `docs/features/player_hit_death_skill_input_sync.md`

### 影响范围
- 玩家受击、死亡、技能施放原�?

### 验证方式
- 静态检查状态切换与技能槽接线

### 后续注意事项
- 技能仍是原型逻辑，后续再接正式数值和表现

## 2026-05-16 - DNF 角色配置工具 MVP

### 修改内容
- 增加 `CharacterConfigDefinition` 及相关枚举与运行时桥�?
- 实现角色配置工具、校验窗口、样例配置生成器
- 增加角色动画预览、盒体编辑与 JSON 导出入口

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/CharacterActionEnums.cs`
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `Assets/Game/Editor/CharacterConfigValidationWindow.cs`
- `Assets/Game/Editor/CharacterConfigSampleFactory.cs`

### 新增文件
- `docs/features/dnf_character_config_tool_mvp_sync.md`

### 影响范围
- DNF 式角色配置资�?
- 运行时角色配置桥�?
- 编辑器配置流�?

### 验证方式
- `dotnet build WCDEL.sln`

### 后续注意事项
- 仍需继续补全更真实的 DNF 横版运行时行�?

## 2026-05-16 - 配置默认挂接与占位资源接�?

### 修改内容
- 将样例配置生成接入测试场景搭建流�?
- 自动挂接玩家与敌人的配置桥接
- 增加默认玩家、敌人、训练假人占位图
- 按敌人类型拆分默认占位图选择

### 修改文件
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `Assets/Game/Editor/CharacterConfigSampleFactory.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`

### 新增文件
- �?

### 影响范围
- 默认测试场景的角色外观与配置接入

### 验证方式
- `dotnet build WCDEL.sln`

### 后续注意事项
- 正式美术接入后优先替换角色配置目录下的占位图

## 2026-05-16 - DNF 横版操作骨架 MVP

### 修改内容
- 读取并对�?`Docs/dnf_style_character_basic_controls_design.md`
- 增加跳跃、下落、落地、空中攻击、绝技、浮空、倒地、起身状�?
- 引入 `PlayerJumpController` �?`PlayerInputBuffer`
- 扩展技能、绝技、受击与输入缓冲逻辑
- 将移动规则从自由俯视移动收敛到横版主�?+ 上下走位

### 修改文件
- `Assets/Game/Runtime/Gameplay/Characters/PlayerJumpController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerInputBuffer.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerCombatController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerHitReactionController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerStateController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerActorController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/TopDownCharacterMotor2D.cs`
- `Assets/Game/Runtime/Input/GameInputReader.cs`

### 新增文件
- `docs/features/dnf_side_scroll_controls_mvp_sync.md`

### 影响范围
- DNF 式横版操作运行时骨架

### 验证方式
- `dotnet build WCDEL.sln`

### 后续注意事项
- 空中技能、帧事件、真实判定箱仍需继续深化

## 2026-05-18 - 后台菜单全屏重构

### 修改内容
- 将后台界面从弹窗式改为全屏覆盖式
- 将页签按钮改为顶部横向排�?
- 调整运行时页签查找与生成逻辑

### 修改文件
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`

### 新增文件
- �?

### 影响范围
- 后台菜单布局
- 页签按钮结构

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### 后续注意事项
- 需要在 Unity 里重新生成相�?UI 预制�?

## 2026-05-18 - 背包界面预制体重�?

### 修改内容
- 根据背包预制体布局文档重构后台装备/背包�?
- 增加角色展示区、装备槽、背包格子、详情区与底部操作栏
- 让运行时代码只负责数据绑定和状态切�?

### 修改文件
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`

### 新增文件
- `docs/features/inventory_ui_prefab_sync.md`

### 影响范围
- 背包�?UI 结构
- 背包页运行时刷新逻辑

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### 后续注意事项
- 背包分类筛选、拖拽、售卖与锁定逻辑后续继续补全

## 2026-05-18 - 背包页交互补�?

### 修改内容
- 将背包候选来源收紧到玩家真实持有物品
- 增加分类切换、装备、卸下、出售、丢弃、锁定等原型逻辑
- 补齐相关 prefab 引用自动绑定

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`

### 新增文件
- �?

### 影响范围
- 背包页物品来源与操作逻辑

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### 后续注意事项
- 消耗品、材料、任务物品仍需单独数据�?

## 2026-05-18 - 技能栏与技能配置界面重�?

### 修改内容
- 根据技能栏布局文档重构战斗 HUD 技能栏
- 重构后台技能配置页，接入候选技能与已装备技能栏
- 保持 prefab-first，布局参数不写死在代码�?

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`

### 新增文件
- `docs/features/ui_prefab_framework_sync.md`

### 影响范围
- 战斗技能栏 UI
- 后台技能配置页

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### 后续注意事项
- 技能树、拖拽换槽、升级规则在后续继续细化

## 2026-05-18 - 技能页交互细化与拖拽换�?

### 修改内容
- 增加技能页分类标签、技能树占位视图与节点联�?
- 增加拖拽句柄与技能拖拽换�?MVP
- 让候选技能、底部技能槽和详情区形成完整闭环

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendSkillDragHandle.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `WCDEL.Game.Runtime.csproj`

### 新增文件
- `Assets/Game/Runtime/Gameplay/UI/BackendSkillDragHandle.cs`

### 影响范围
- 后台技能配置交�?
- 技能拖拽换�?

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### 后续注意事项
- 后续继续补槽位互换、失败反馈与技能树拖拽到槽�?

## 2026-05-18 - 图标补全与技能扩�?

### 修改内容
- 补充一批装备图标与技能图标并接入定义资产
- 扩展章节技能定义，新增更多技能槽�?
- 让技能发射逻辑使用 `TargetingMode / Range / Radius`

### 修改文件
- `Assets/Game/Editor/DefinitionIconAssignmentUtility.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `Assets/Game/Editor/CharacterConfigSampleFactory.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `Assets/Game/Runtime/Core/Configs/Generated/*`

### 新增文件
- `docs/features/chapter01_skill_equipment_icon_sync.md`
- `Assets/Game/Art/Icons/Skills/*`
- `Assets/Game/Art/Icons/Equipment/*`

### 影响范围
- 章节技能与装备图标
- 技能发射位置与范围逻辑

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### 后续注意事项
- 角色配置样例工厂后续还需继续清理与同�?

## 2026-05-18 - 去除遗留 ControlRowA/B

### 修改内容
- 去掉背包界面中不再需要的 `ControlRowA` �?`ControlRowB`
- 同步运行时查找与隐藏逻辑

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`

### 新增文件
- �?

### 影响范围
- 背包界面底部控制�?

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### 后续注意事项
- 相关 prefab 仍建议在 Unity 中重建一�?

## 2026-05-18 - DNF 操作文档缺口补完

### 修改内容
- 补齐 DNF 式横版操作中缺失的运行时控制规则，将命中高度、命中类型、浮空力度正式接�?`DamageRequest`
- 扩展跳跃与受击联动，补上低段攻击躲避、浮空后倒地、起身保护、受身输入窗�?
- 扩展闪避运行时，接入 `CanDash` 与闪避后恢复时间
- 修正玩家状态流转，补上 `Launch / Down / GetUp` 的真实进入条�?
- 让普攻使用当前动作的 `DamageEvent` 数据驱动命中表现，而不是固定统一模板
- 为主角样例配置追�?DNF 控制覆盖，补�?4 个技能槽、绝技与部分命中类型配�?
- 新增本次 DNF 操作补完同步文档

### 修改文件
- `Assets/Game/Runtime/Gameplay/Combat/IDamageable.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Health.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/DodgeController2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerActorController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerStateController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerJumpController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerCombatController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerHitReactionController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `Assets/Game/Editor/CharacterConfigSampleFactory.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- `docs/features/dnf_side_scroll_controls_completion_sync.md`

### 影响范围
- 玩家输入到动作状态切换链�?
- 跳跃、闪避、受击、浮空、倒地、起身控�?
- 普攻命中配置消费方式
- 主角样例角色配置生成结果

### 验证方式
- 执行 `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 结果�? error，保留既�?`Physics2D.OverlapCircleNonAlloc` 过时 warning �?Unity `Assembly-CSharp.csproj` warning

### 后续注意事项
- 当前近战命中仍是圆形近似，不是完整的 `HitBox / HurtBox / BodyBox` 逐帧判定
- `CharacterConfigSampleFactory.cs` 里旧的主角生成辅助函数仍有历史乱码，建议后续单独做一次清�?
- 主角样例配置�?DNF 控制覆盖现在通过后置修正保证正确，后续如果继续扩展技能数，需同步更新覆盖函数


## 2026-05-19 - DNF ������ʾ����Ծ����



### �޸�����

- Ϊ�������벹�����?DNF ����ĵ��ļ��̶��׼�λ��ȷ��?`J/K/L/U/I/O/H/Space/F` �ڵ�ǰԭ���п�ֱ����Ч

- Ϊ��ҿ���������?HUD ��Ծ��ڣ�����������Ծ���������������ڶ����߼�?

- Ϊս�� HUD �������½���ʱ����������ʾ������������Ծ��ť״̬�ı��밴ť����

- Ϊս�� HUD Ԥ����󶨲��������ʾ������Ծ��ť�ֶ�

- ���䱾�������� HUD ͬ���ĵ�



### �޸��ļ�

- `Assets/Game/Runtime/Input/GameInputReader.cs`

- `Assets/Game/Runtime/Gameplay/Characters/PlayerActorController.cs`

- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`

- `Assets/Game/Editor/UiPrefabFactory.cs`



### �����ļ�

- `docs/features/dnf_input_hud_hint_sync.md`



### Ӱ�췶Χ

- ��һ��������ȡ

- ��Ծ�����ɿ���

- ս�� HUD ������ʾ

- ����ʽս�� HUD Ԥ�����?



### ��֤��ʽ

- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`



### ����ע������

- �Խ������ר������?`Assets/InputSystem_Actions.inputactions`���������ʲ�������ȫ�� DNF ����ĵ�һ��?

- ��Ҫ�� Unity ����������һ��ս�� HUD Ԥ���壬ȷ�����½���ʾ���ͼ�������ǩλ�ø��µ�������Դ



## 2026-05-19 - ս���������ͼ�뾵ͷ�������?



### �޸�����

- �� `Sandbox_Combat` ԭ�Ͳ�����չΪ����Χ��ս����ͼ��������ҳ����㡢���˰������ڡ����䡢Boss ���ʹ��͵���

- ������ `TerrainZone2D` ��ϵ����ƽ�ء��ݵء�ǳˮ����ˮ�Ͷ���������򣬲���������������������������

- ͬ���Ŵ�ս����������ʱ��ȫ���֣���֤����ʱ��ƫ��༭������ʹ��ͬһ������?

- ����Ĭ������߽��������������Ƴ���Ѿ�ͷ�߽�ˢ�ؾ�ֵ������ʱ���ǣ�ȷ����ɫ�ƶ�ʱ��ͷ��������

- ���䱾��ս��������չ�뾵ͷͬ���ĵ�



### �޸��ļ�

- `Assets/Game/Editor/FoundationAssetUtility.cs`

- `Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs`

- `Assets/Game/Runtime/Gameplay/World/CameraBoundsProfile2D.cs`

- `docs/05_TASK_LOG.md`



### �����ļ�

- `docs/features/chapter01_expanded_battlefield_camera_sync.md`



### Ӱ�췶Χ

- ս������������ͼ����

- �����뽻����ֲ��ܶ�?

- �������������ر�����/�赲����

- ������淶Χ��ս��������ͷ�ȶ���?



### ��֤��ʽ

- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`



### ����ע������

- ��Ҫ�� Unity ������ִ��һ�� `Tools/WCDEL/Foundation/���ʼ������Ƭ` ���ս�������ؽ���ȷ������������ռλ�Ӿ�ʵ��д�س���?

- ��ǰ��ˮ�����Ѿ��߱��������赲���壬�������Ƿ���Ҫ������ײ�߽�����ȷ�ĵر�װ�Σ���������һ�ֳ�������ϸ��ʱһ����



## 2026-05-19 - ���˶���֡���ɹ�������



### �޸�����

- ����������ϵ����ο�ͼ�����͡��������������ԡ����ʺ���в�б���?

- �����Ŀ���е�����ϵ��ռλ����Ŀ¼��MouseMinion �������� JackalEnemy ������������ͳһ�ĵ�������֡���ɹ淶

- ��ȷ��������ʱռλ֡�����?AI ��ʽ����ĸ���񣬲����䶯�����ǡ�֡����������ê�����ʾ�ʹ���?



### �޸��ļ�

- `docs/05_TASK_LOG.md`



### �����ļ�

- `docs/features/enemy_animation_frame_generation_rules.md`



### Ӱ�췶Χ

- ���� 2D ������Դ��������

- AI ����֡������ʾ���뵼���淶

- ���е��˶�������ͳһ������



### ��֤��ʽ

- �˶� `Assets/Game/Runtime/CharacterConfigs/Animations` ���е��˶���Ŀ¼��֡��

- �˶� `Assets/Game/Art/Unit/MouseMinion_ActionPack_v2` �� `Assets/Game/Art/Unit/JackalEnemy_ActualActionSheets_Package_v1` Ԫ����



### ����ע������

- ��ǰ�ĵ��Ѿ����� MeadowSlime��CaveBat��PoisonBee��BeeCaptain��HiveGuardian �Լ�δ������/������ϵ���ˣ���������������ǰ�Խ�����Ϊÿ������ȷ��һ������ seed frame

- �������Ҫ��ʽ�滻����ʱռλ�����������Ƚ���?`Assets/Game/Art/Unit/EnemyActionPacks` ͳһĸ��Ŀ¼���������鵵 strip��frames �� metadata



## 2026-05-19 - ���˶��� prompt �����������󲹳�



### �޸�����

- �ڵ��˶��������ĵ������ϣ����� PoisonBee��BeeCaptain��HiveGuardian �Լ� MeadowSlime��CaveBat �Ŀ�ֱ������ AI ��ͼ�Ķ��� prompt

- ����ȫ���˶�������������ȷÿ�����˵Ķ������ǡ��ߴ������ȼ��Ͳο���ϵ

- ��δ������/������ϵ���˵����ɹ�����ͬһ�ݹ淶�����ں���������չ



### �޸��ļ�

- `docs/05_TASK_LOG.md`



### �����ļ�

- `docs/features/enemy_animation_prompt_pack_and_matrix.md`



### Ӱ�췶Χ

- ���� AI ��������ִ�з�ʽ

- ȫ���˶���������������ͳһ

- δ����ϵ���˵��˵Ķ����ʲ��滮



### ��֤��ʽ

- �˶����е��˶���Ŀ¼֡�����ĵ��е� base pack / advanced pack ����

- �˶� MouseMinion �� JackalEnemy �ο����ĳߴ硢�������� pivot ����



### ����ע������

- ������ʼ��������ʱ���Խ�����Ϊÿ������ȷ��һ������ seed frame���ٰ� idle -> move -> attack_01 ��˳���ƽ�

- �������һ��Ҫ�Ҽ������ҿ���ֱ��Ϊÿ�������ٲ������������ prompt �� + Ӣ�� prompt �� + ������ʾ�ʡ�

## 2026-05-19 - Enemy ImageGen2 Animation Pipeline

### �޸�����
- �������˶����������������ű������� `PoisonBee`��`BeeCaptain`��`HiveGuardian` �����׶�����Դ���ɡ�
- ���� `gpt-image-2` �������񵼳����ٵס���֡����ʽ����ͼ����������ʱ `96x96` ֡������̡�?
- ���䱾�� ImageGen2 ��Դ�����ĵ�����ȷĿ¼��������Χ��ִ�в���������ʱ���ݲ��ԡ�
- ʵ�ʴ����� `gpt-image-2` �����������󣬵����ӿڲ� `billing_hard_limit_reached` ������δ���ɳ�����ͼƬ�ļ���

### �޸��ļ�
- `Tools/EnemyAnimation/imagegen_enemy_batch.py`
- `Docs/features/enemy_animation_imagegen2_pipeline_and_application.md`

### �����ļ�
- `Tools/EnemyAnimation/imagegen_enemy_batch.py`
- `Docs/features/enemy_animation_imagegen2_pipeline_and_application.md`

### Ӱ�췶Χ
- ���˶���������������
- ��ʽ���˶�������ͼĿ¼�淶
- ����ʱ���˶���֡�滻����

### ��֤��ʽ
- `python -m py_compile Tools/EnemyAnimation/imagegen_enemy_batch.py`
- `python Tools/EnemyAnimation/imagegen_enemy_batch.py export-jobs --output Temp/EnemyImageGen/enemy_jobs.jsonl`
- `python C:\Users\Admin\.codex\skills\.system\imagegen\scripts\image_gen.py generate-batch --input Temp/EnemyImageGen/enemy_jobs.jsonl --out-dir Temp/EnemyImageGen/generated --model gpt-image-2 --quality high --output-format png --concurrency 2 --max-attempts 3`
- ���ɽ׶η��� `billing_hard_limit_reached`��ȷ�ϵ�ǰ���������˻���ȶ��Ǳ��ؽű���������?

### ����ע������
- �ָ� OpenAI ͼƬ��Ⱥ�������?`generate-batch`����ִ�� `postprocess` ����ʽ��Դ������ʱ֡ͬ������Ŀ��
- ����ʱ֡��ǰ������ `96x96` ռλͼ�ߴ���ݵ�����������ͳһ�Ŵ�����ʱ��ʾ�������������Ƿ����?`.meta` һ��������

## 2026-05-19 - ImageGen Builtin Preference And Builtin Asset Apply

### �޸�����
- ���¹��� `imagegen` skill ������ȷ��ǰ�Ự�������� `image_gen` ʱ�����˶�����������Ҳ��������������������·��������Ϊ���������Զ��˻���Ҫ `OPENAI_API_KEY` �� CLI��
- ʹ������ `imagegen` �ɹ����� `PoisonBee` �� `spawn` ��������ͼ�������Ƶ���Ŀ��ʱĿ¼���к�����֤��
- ��չ���˶�������ű�������?`postprocess-selected` ���?BOM ��ѡ���ļ���ȡ������֧�֡�����֤�����������𲽲���������Դ���Ľ������̡�
- �ɹ����������ɵ� `PoisonBee_spawn` ��ʽ����ͼ������ʱ֡Ӧ�õ���ĿĿ¼��

### �޸��ļ�
- `C:\Users\Admin\.codex\skills\.system\imagegen\SKILL.md`
- `Tools/EnemyAnimation/imagegen_enemy_batch.py`
- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/*`
- `Assets/Game/Runtime/CharacterConfigs/Animations/PoisonBee/PoisonBee_spawn_*.png`

### �����ļ�
- `Temp/EnemyImageGen\builtin_generated\PoisonBee_spawn.png`
- `Temp/EnemyImageGen\selection_spawn.json`
- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/Frames/PoisonBee_spawn_00.png`
- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/Frames/PoisonBee_spawn_01.png`
- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/Frames/PoisonBee_spawn_02.png`
- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/Frames/PoisonBee_spawn_03.png`
- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/Frames/PoisonBee_spawn_04.png`
- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/Strips/PoisonBee_spawn_Strip_05f_256.png`
- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/Metadata/animation_manifest.json`

### Ӱ�췶Χ
- Codex ͼ�����ɵ��ò���
- ���˶�����Դ��ʽ��������
- `PoisonBee` ������������ʽ����������ʱռλ�滻

### ��֤��ʽ
- ֱ�ӵ������� `imagegen` �ɹ���������ͼƬ��
- `python -m py_compile Tools/EnemyAnimation/imagegen_enemy_batch.py`
- `python Tools/EnemyAnimation/imagegen_enemy_batch.py postprocess-selected --generated-dir Temp/EnemyImageGen/builtin_generated --master-root Assets/Game/Art/Unit/EnemyActionPacks --runtime-root Assets/Game/Runtime/CharacterConfigs/Animations --selection Temp/EnemyImageGen/selection_spawn.json`
- ���?`Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee` �� `Assets/Game/Runtime/CharacterConfigs/Animations/PoisonBee/PoisonBee_spawn_*.png` �����ɡ�

### ����ע������
- ��ǰ����֤�������� `PoisonBee` �� `spawn` ���������������������� `imagegen` �����������ද���� `BeeCaptain`��`HiveGuardian`��
- ����ʱ֡�Ա������� `96x96` ���ݲ��ԣ�����Ӱ�쵱ǰ��ɫ���ö�ȡ��·��

## 2026-05-19 - ��ϵ������ʽ��������������ĿӦ��



### �޸�����

- Ϊ���˶�������ű�����?`import-runtime-to-formal` ������ɻ�����������ʱ֡����������ʽ `EnemyActionPacks` ��Դ

- ����������ϵ���˶���ѡ���嵥������ `PoisonBee`��`BeeCaptain`��`HiveGuardian` �Ļ��������뼼�ܶ���

- �������ϵ���˵���������ʱ����֡��������Ϊ���?`Frames`��`Strips` �� `animation_manifest.json`

- �������?ImageGen2 �����ĵ�����¼����ʱ������ʽ��Դ��Ӧ�÷�ʽ



### �޸��ļ�

- `Tools/EnemyAnimation/imagegen_enemy_batch.py`

- `Docs/features/enemy_animation_imagegen2_pipeline_and_application.md`

- `docs/05_TASK_LOG.md`



### �����ļ�

- `Temp/EnemyImageGen/selection_bee_family_full.json`

- `Assets/Game/Art/Unit/EnemyActionPacks/BeeCaptain/*`

- `Assets/Game/Art/Unit/EnemyActionPacks/HiveGuardian/*`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/*`



### Ӱ�췶Χ

- ���˶�����ʽ��ԴĿ¼������

- ��ϵ���˶������������� AI ��Դ�滻����

- ����ʱռλ֡����ʽĸ����Դ֮���ͬ�����?



### ��֤��ʽ

- `python -m py_compile Tools/EnemyAnimation/imagegen_enemy_batch.py`

- `python Tools/EnemyAnimation/imagegen_enemy_batch.py import-runtime-to-formal --runtime-root Assets/Game/Runtime/CharacterConfigs/Animations --master-root Assets/Game/Art/Unit/EnemyActionPacks --selection Temp/EnemyImageGen/selection_bee_family_full.json`

- ���?`Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee`��`BeeCaptain`��`HiveGuardian` �µ� `Frames`��`Strips` �� `Metadata/animation_manifest.json` ������



### ����ע������

- ����û�м��������µ����� ImageGen ͼƬ����Ϊ��ǰ�Ựδ��¶��ֱ�ӵ��õ���ͼ���ɹ��ߣ�����һ������ڻָ����ɼ�����ͬһ���������滻��ǰ��ʽ������?

- ��ǰ `BeeCaptain` �� `HiveGuardian` ����ʽ��������Դ����Ŀ���Ѵ��ڵ�����ʱ֡����������Ѿ�������������������ֻ���Ȱ���Ŀ��ʽ��Դ�ṹ����


## 2026-05-19 - 图片生成管线离线优先改�?

### 修改内容
- 审查项目内图片生成相关脚本、文档、临时任务文件以及共�?imagegen skill 当前规则
- �?Tools/EnemyAnimation/imagegen_enemy_batch.py 改为离线优先流程，默认只导出 prompts、asset manifest、generation task �?pipeline settings
- 保留现有后处理与资源落地结构，但�?API 任务导出改为显式可选分支，默认 use_api_image_generation = false
- 明确脚本不调�?OpenAI Images API、不读取 OPENAI_API_KEY、不直接使用 openai SDK 生成图片
- 新增项目级图片生成管线说明，并把敌人动画图片流程文档同步为内�?imagegen 优先、不可用时只导出任务�?

### 修改文件
- Tools/EnemyAnimation/imagegen_enemy_batch.py
- Docs/features/enemy_animation_imagegen2_pipeline_and_application.md
- docs/image_generation_pipeline.md
- docs/05_TASK_LOG.md

### 新增文件
- docs/image_generation_pipeline.md

### 影响范围
- 敌人动画图片生成准备流程
- 图片生成任务导出与应用方�?
- Codex 内置 imagegen 与外�?API 分支的职责边�?

### 验证方式
- python -m py_compile Tools/EnemyAnimation/imagegen_enemy_batch.py
- python Tools/EnemyAnimation/imagegen_enemy_batch.py prepare-generation-package --output-dir Temp/EnemyImageGen
- 检�?Temp/EnemyImageGen/prompts.json�?sset_manifest.json、generation_tasks.json、pipeline_settings.json 已生成，且默认配置为 use_api_image_generation = false

### 后续注意事项
- 当前会话未暴露可直接调用的新图生成工具，因此默认任务清单会标记为 offline_prompt_only
- 如果后续某个 Codex 会话重新提供内置 imagegen，可继续复用当前 prompts 包生成源图，再执�?postprocess �?postprocess-selected
- 如需保留外部 API 兼容 JSONL，只能显式传�?--use-api-image-generation 后再导出，不应作为默认项目流�?


## 2026-05-19 - 还原 imagegen skill 定制规则

### 修改内容
- 检查共�?imagegen skill 当前内容与历史版本线�?
- 回退此前为当前会话补加的两条 built-in image_gen 强制优先规则
- 保留其余现有 imagegen skill 内容不变，不改项目内图片管线脚本

### 修改文件
- C:\Users\Admin\.codex\skills\.system\imagegen\SKILL.md
- docs/05_TASK_LOG.md

### 新增文件
- �?

### 影响范围
- Codex 共享 imagegen skill 的调度规�?
- 当前会话后续�?built-in image generation �?CLI fallback 的路由判�?

### 验证方式
- 重新读取 C:\Users\Admin\.codex\skills\.system\imagegen\SKILL.md
- 确认不再包含 If the current session exposes a built-in image_gen tool 两条定制规则

### 后续注意事项
- 本次仅还原共�?skill 的定制改动，不影�?Tools/EnemyAnimation/imagegen_enemy_batch.py 的项目内离线优先管线
- 如果后续还需要把 imagegen skill 整份恢复到更早版本，建议基于明确版本快照再做一次完整回�?


## 2026-05-19 - 战斗场景大地图与镜头跟随回归修复

### 修改内容
- 补强 `GameBootstrapper` 的场景加载链路，在进入战斗场景后自动触发大地图布局与镜头配置的多帧复查
- 兼容编辑器直接从 `Sandbox_Combat` 场景启动的情况，避免启动时被强制切回主菜单或保持 `MainMenu` 流程状态导致角色无法正常游�?
- 调整 `SandboxCombatSceneLayout` 的运行时应用方式，允许读档流程保留玩家存档位置，同时继续修正地图尺寸、交互物分布与镜头跟随组�?
- 补充 feature 文档，记录新游戏、读档和直进场景三种入口下的运行时修正规�?

### 修改文件
- `Assets/Game/Runtime/Bootstrap/GameBootstrapper.cs`
- `Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs`
- `docs/features/chapter01_expanded_battlefield_camera_sync.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- �?

### 影响范围
- `Sandbox_Combat` 的运行时初始化稳定�?
- 大地图布局、相机边界与镜头跟随的生效时�?
- 编辑器内直接 Play 战斗场景时的可测试�?

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 进入 `Sandbox_Combat` 后检查玩家出生区域、道�?草地/水域分布是否为扩展地图版�?
- 移动角色时确认主相机持续跟随，且读档进入时不会被重置到初始出生点

### 后续注意事项
- 当前修复以运行时兜底为主，`Sandbox_Combat.unity` 场景文件里的已保存坐标仍可能保留旧的小地图数据；如果后续希望彻底消除差异，建议再�?Unity 编辑器中把场景内容重建并保存一�?
- 本次仅做代码链路修复，没有改动现有关卡资源命名与结构


## 2026-05-19 - 内置 ImageGen 线路重试与现状核�?

### 修改内容
- 重新读取共享 `imagegen` skill 与项目图片生成管线文档，确认当前项目仍要求优先走内置 imagegen、项目脚本只负责提示包与后处�?
- 重新执行 `prepare-generation-package`，刷�?`Temp/EnemyImageGen` 下的 prompts、asset manifest、generation tasks �?pipeline settings
- 核对当前会话可用工具后，确认本轮会话虽然存在 `imagegen` skill，但未暴露可直接调用的新图生成工具入口；当前只看到了图片编辑相关工具，不足以替代整图批量生成
- 复查既有内置生成样张与项目资源目录，确认 `PoisonBee_spawn.png` 的后处理结果已经落到正式资源与运行时目录

### 修改文件
- `docs/05_TASK_LOG.md`
- `Temp/EnemyImageGen/prompts.json`
- `Temp/EnemyImageGen/asset_manifest.json`
- `Temp/EnemyImageGen/generation_tasks.json`
- `Temp/EnemyImageGen/pipeline_settings.json`

### 新增文件
- �?

### 影响范围
- 敌人动画图片任务包刷新状�?
- 内置 imagegen 可用性判断记�?
- 后续批量生成执行前的入口核对依据

### 验证方式
- `python -m py_compile Tools/EnemyAnimation/imagegen_enemy_batch.py`
- `python Tools/EnemyAnimation/imagegen_enemy_batch.py prepare-generation-package --output-dir Temp/EnemyImageGen --builtin-imagegen-supported`
- 检�?`Temp/EnemyImageGen/builtin_generated/PoisonBee_spawn.png`
- 检�?`Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/Strips/PoisonBee_spawn_Strip_05f_256.png`
- 检�?`Assets/Game/Runtime/CharacterConfigs/Animations/PoisonBee/PoisonBee_spawn_00.png`

### 后续注意事项
- 当前阻塞点不在项目后处理脚本，而在本轮会话未暴露可直接调用�?built-in image generation 入口
- 一旦会话真正暴�?`image_gen` 类生成工具，就可直接�?`Temp/EnemyImageGen/prompts.json` 分批生成，再落到 `Temp/EnemyImageGen/generated` 后执�?`postprocess` �?`postprocess-selected`
- 如需我继续在当前会话强行生成，只能改走你明确授权�?CLI fallback，而那条路不属于这次要求的“内�?imagegen”线�?



## 2026-05-19 - 第一章普通道具图标生成准备与阻塞记录



### 修改内容

- 盘点当前项目内已经接入运行时的全部道具定义，确认当前�?10 个道具：

  - 6 件装�?

  - 4 个普通道�?

- 确认现有图标接入链路继续复用 `GameDefinition.Icon`，不新起第二套资源系�?

- �?4 个尚未具备图标的普通道具补充批�?ImageGen prompt 与目标输出清单：

  - 小型生命药水

  - 蜂蜜面包

  - 蜂蜡�?

  - 荧光�?

- 新增 `Tools/ItemIcons/compose_item_icons.py`，用于把透明主体图合成为项目统一风格�?`256x256` 道具 icon，并复制 Unity `.meta` 模板

- 实际通过 CLI fallback 发起道具图标批量生成请求，但接口侧返�?`billing_hard_limit_reached`，未生成出最终图片文�?



### 修改文件

- `docs/05_TASK_LOG.md`



### 新增文件

- `docs/features/chapter01_item_icon_generation_pipeline.md`

- `Tools/ItemIcons/compose_item_icons.py`

- `output/imagegen/chapter01_item_icons/prompts.jsonl`

- `output/imagegen/chapter01_item_icons/item_icon_jobs.json`



### 影响范围

- 第一章普通道具图标生成准备流�?

- 道具 icon 后处理与统一风格合成方式

- 后续普通道�?icon 接入 `GameDefinition.Icon` 的落地基础



### 验证方式

- `python -m py_compile Tools/ItemIcons/compose_item_icons.py`

- `python C:\Users\Admin\.codex\skills\.system\imagegen\scripts\image_gen.py generate-batch --input output/imagegen/chapter01_item_icons/prompts.jsonl --out-dir output/imagegen/chapter01_item_icons/generated_subjects --model gpt-image-1.5 --quality high --output-format png --concurrency 2 --max-attempts 2 --force`

- 结果�? 个任务全部返�?`billing_hard_limit_reached`



### 后续注意事项

- 当前阻塞不在项目脚本�?prompt，而在 OpenAI 账户图片额度

- 一旦额度恢复，可直接重跑同一�?`generate-batch` 命令，然后再执行 `compose_item_icons.py` 把主体图合成为项目正�?icon

- 本轮尚未�?4 个普通道�?icon 真正挂回对应 ScriptableObject，需等图片生成成功后继续�?Editor 绑定步骤


## 2026-05-19 - 技能页冗余说明面板收敛

### 修改内容
- 检�?`SkillPage` 结构后，确认 `SkillDescriptionPanel` 仅作为技能说明标题与正文的中间包装层，属于冗余容�?
- 调整 `UiPrefabFactory` 的技能页生成逻辑，移�?`SkillDescriptionPanel` 这层，改为将说明标题直接挂在 `SkillDetailPanel` 下，并把正文内容收敛到更直接�?`PageBodyPanel`
- 同步修正 `BackendMenuCanvasPresenter` 中技能页正文文本的查找路径，避免 prefab 重建后出现空引用

### 修改文件
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- �?

### 影响范围
- 后台菜单技能页右侧详情区层级结�?
- 技能说明文本的 prefab 绑定路径
- 后续重建生成 UI prefab 时的技能页对象树简�?

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 搜索运行时代码中不再依赖 `SkillDescriptionPanel` 路径
- 下次通过 UI 生成流程重建技能页 prefab 后，确认 `SkillDescriptionPanel` 不再出现在生成资源里

### 后续注意事项
- 当前仓库里的 `Assets/Game/UI/Prefabs/Generated/UIModule_Backend_Page_Skill.prefab` 还是旧生成结果；本次改动已经更新生成代码，但需要在 Unity 中重新走一次对�?prefab 生成流程后，资产层级才会真正去掉这层对象
- 本次没有手改 prefab YAML，以保持对现有生成管线的复用


## 2026-05-19 - 后台菜单旧控制行清理

### 修改内容
- 移除后台菜单旧版控制�?`SkillControl`、`ControlRowA`、`ControlRowB` 的运行时残留引用�?
- 将装备页 `一键装备` 按钮改为直接走当前新版装备页逻辑，按槽位自动选择更优候选并应用�?
- 清理顶部文案刷新中对旧控制行文本字段的残留访问，避免生成�?prefab 后再次绑定到废弃节点�?

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- �?

### 影响范围
- 后台菜单 Equipment / Skill / Settings 页的�?UI 控制逻辑收口
- 后台菜单生成器对旧节点存在性的检测与新版 Settings 独立语言按钮绑定
- 装备页快捷按钮行为与新版背包交互逻辑对齐

### 验证方式
- `rg -n "OnEquipmentApply|_controlRowAPrevText|_controlRowANextText|_controlRowBPrevText|_controlRowBNextText|_controlRowBApplyText|RefreshEquipmentControls|RefreshSkillControls|RefreshLocalizedControlLabels" Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs Assets/Game/Editor/UiPrefabFactory.cs -S`
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### 后续注意事项
- 这次没有手改生成 prefab YAML；若当前场景或生成资源仍显示旧节点，需要在 Unity 内重新跑一次后台菜�?prefab 生成流程�?
- 当前构建仍有 4 个既有的 `Physics2D.OverlapCircleNonAlloc` 过时警告，但与本�?UI 清理无关�?


## 2026-05-19 - 后台菜单旧界面继续清理与结构收口

### 修改内容
- 继续清理后台菜单旧界面残留，先从运行时代码移除无效的装备预览按钮绑定与空实现回调�?
- 提高后端菜单 Skill / Equipment �?prefab 版本检测条件，避免 Unity 继续复用带旧结构的生成资源�?
- 移除技能树占位文案节点的生成，开始把技能页从“过渡说明稿”收口到现有可交互结构�?

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- �?

### 影响范围
- 后台菜单 Equipment 页左侧快捷按钮行�?
- 后台菜单生成 prefab 的版本识别与重建触发条件
- Skill 页旧占位说明节点的生成结�?

### 验证方式
- `rg -n "_equipmentPreviewButton|OnPreviewEquipmentPressed|SearchAndSortBar|Btn_FashionPreview|Slot_Pants|BagToolBar|Placeholder" Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs Assets/Game/Editor/UiPrefabFactory.cs -S`
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### 后续注意事项
- 这轮已经让旧生成结构在下�?Unity 重建时失效，�?`UiPrefabFactory.cs` 里仍有一部分旧技能页搜索条、装备页扩展假槽位与工具条代码待继续删净�?
- 由于该文件存在局部编码敏感段，本轮优先完成了可稳定落地的运行时清理和 prefab 重建门槛收紧；下一步建议继续在同一文件做小块、可验证的结构替换�?
- 当前构建仍只�?4 个既有的 `Physics2D.OverlapCircleNonAlloc` 过时警告，与本次 UI 清理无关�?


## 2026-05-19 - 后台菜单继续优化与旧节点裁剪

### 修改内容
- �?Skill �?prefab 生成流程末尾主动裁剪无后端逻辑�?`SearchAndSortBar`，并回收技能背包滚动区高度�?
- �?Equipment �?prefab 生成流程末尾主动裁剪旧预览按钮、无逻辑工具条以及超出当前数据结构的扩展假槽位�?
- 重新压缩 Equipment 页左侧角色预览与四个有效装备槽位布局，让现有可用界面更聚焦�?
- 清理生成器绑定阶段对 `_equipmentPreviewButton` 的引用，避免旧按钮重新连回运行时�?

### 修改文件
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- �?

### 影响范围
- 后台菜单 Skill 页技能背包区布局
- 后台菜单 Equipment 页左侧装备区域与右侧背包区的生成结果
- 生成 prefab 后的运行时按钮绑定安全�?

### 验证方式
- `rg -n "_equipmentPreviewButton|OnPreviewEquipmentPressed|Btn_FashionPreview|Btn_RotateOrPreviewAction|Slot_Pants|Slot_Shoes|Slot_Ring_01|Slot_Ring_02|Slot_Bracelet|Slot_Belt|Slot_Charm|Slot_Special|BagToolBar|SearchAndSortBar" Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs Assets/Game/Editor/UiPrefabFactory.cs -S`
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### 后续注意事项
- 旧节点现在会�?prefab 生成末尾被主动裁掉；要看到最终效果，仍需要在 Unity 内重新执行一次后台菜�?prefab 生成流程�?
- `UiPrefabFactory.cs` 里仍保留了一部分旧节点的“先创建、后裁剪”兼容代码，便于平稳过渡；如果后续要继续瘦身，可以再把这些源头创建语句彻底移除�?


## 2026-05-19 - UI Override Variant 管线接入

### 修改内容
- �?UI prefab 增加 `Assets/Game/UI/Prefabs/Overrides` 覆盖层目录�?
- 所�?UI �?prefab 与嵌套模块在加载和实例化时，改为优先解析同名 override prefab，不存在时再回退�?`Generated`�?
- 新增编辑器菜单，可从当前选中�?`Generated` prefab 一键创建对�?override variant，方便手�?size / 锚点 / 位置后长期保留�?
- 保持现有一键生成与重建流程只作用于 `Generated` 层，不直接覆�?`Overrides`�?

### 修改文件
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- �?

### 影响范围
- Combat HUD / Backend Menu / Interaction / Loading / Main Menu �?prefab 加载入口
- 生成 UI 模块的嵌�?prefab 实例化逻辑
- 后续美术或策划在 Unity 内对 UI 布局做手调的保存方式

### 验证方式
- `rg -n "UiPrefabOverrideFolder|LoadUiPrefabWithOverride|ResolveOverridePrefab|CreateOrUpdateOverrideVariant|Create Override Variant From Selected Generated Prefab" Assets/Game/Editor/UiPrefabFactory.cs -S`
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### 后续注意事项
- 今后不要直接长期手改 `Assets/Game/UI/Prefabs/Generated` 下的 prefab；需要保留的布局调整应放�?`Assets/Game/UI/Prefabs/Overrides` 对应 variant 中�?
- 如果后续我重构生成器并删除或改名基础节点，已�?override 对这些节点的布局覆盖可能需要同步检查�?
- 对于结构已基本定型、且后续会频繁手调布局的页面，可以进一步考虑完全脱离生成器，改为手工维护 prefab�?


## 2026-05-19 - ��λ��ײ����������������

### �޸�����
- ���� UnitBodyCollisionFilter2D��������ʱ������ҡ����ľ׮�ȵ�λ����֮�����ͨ�� Trigger ��ײ�������ƶ�ʱ���༷�ɡ�
- �������� DamageRequest -> KnockbackReceiver2D �ļ��ܻ�����·�����ļ������кͻ��˽�����ڡ�?
- �ý�ս��Զ�̵���ʵ�� IHitInterruptionProvider���ڹ��������׶ζ�ȡ��ɫ���������е� CanBeInterrupted �� SuperArmor�����ڿ����Ƿ�ɱ�����?��ϡ�?
- ����ҡ����ˡ�ѵ��ľ׮������ʱ�����༭��������ڶ�������ײ���������ȷ����ǰ�����ͺ����ؽ���������Ч��?
- Ϊ���� dotnet build ��֤���� WCDEL.Game.Runtime.csproj ��������ʱ�ű�����¼��

### �޸��ļ�
- Assets/Game/Runtime/Gameplay/Combat/UnitBodyCollisionFilter2D.cs
- Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs
- Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs
- Assets/Game/Runtime/Gameplay/Combat/TrainingDummy.cs
- Assets/Game/Runtime/Gameplay/Characters/PlayerActorController.cs
- Assets/Game/Editor/FoundationAssetUtility.cs
- WCDEL.Game.Runtime.csproj
- docs/05_TASK_LOG.md

### �����ļ�
- Assets/Game/Runtime/Gameplay/Combat/UnitBodyCollisionFilter2D.cs

### Ӱ�췶Χ
- �����������������λ��ѵ��ľ׮֮�����ͨ������ײ����
- ��ս������Զ�̵��˵��ܻ����?��������ж�?
- Foundation ���������뱾�� C# ������֤����

### ��֤��ʽ
- dotnet build WCDEL.sln /p:BuildProjectReferences=false
- ����ս����������֤����ͨ��λ�Ӵ����ٻ��ඥ�ɣ������˲����ļ��������ƶ�Ŀ�ꣻ�� SuperArmor �Ĺ��������׶β��ᱻ��ͨ���˴��?

### ����ע������
- �����ͨ��ײ��ͨ�����Ե�λ����?Collider2D ֮�����������ʵ�ֵģ���˺������������Ҫ��ʵʵ���赲�����ⵥλ����Ҫ���������Ƿ���� UnitBodyCollisionFilter2D��
- ���˵İ��嵱ǰ���ȶ�ȡ�������������е� SuperArmor ��ǣ����������Ҫ�����ӵĽ׶��԰��塢Buff �������ֵ�Ͱ��壬��Ҫ������?IHitInterruptionProvider �����ϼ�����չ�������ǻص���ͨ������ײ��ʵ�ֻ��ˡ�
## 2026-05-19 - ��λ����ײ����ص��Ż�?

### �޸�����
- �� UnitBodyCollisionFilter2D ����������ײ�����߼�����λ������Ȼ������ͨ���強ѹ������������λ�ص�����ʱ����ʩ�����������ٶȣ��������������������ﳤʱ�����һ�š�
- �����������ͨ�ƶ��׶���Ч���ڻ����뷭���׶��Զ���·�����⼼�ܻ��ˡ��ܻ�λ�ƻ�����λ�Ʊ���ͨ��ײ����������?
- ����ɫ�����е� Movement.SoftCollision ��ʽ��������ʱ�����ͨ��?CharacterConfigRuntimeBridge �·�����ս/Զ�̵����ڸ��ǽ�ɫ����ʱͬ��Ӧ�ã�������ֱ�Ӱ���ɫ���þ����Ƿ��������ײ��?
- �������С���ͨ����Ӵ�����ײ�ɣ�ֻ����������·�ƶ�Ŀ�ꡱ�Ĺ��򲻱䣬ֻ�Ż�վλ�ȶ��Ժ��ص����֡�?

### �޸��ļ�
- Assets/Game/Runtime/Gameplay/Combat/UnitBodyCollisionFilter2D.cs
- Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs
- Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs
- Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs
- docs/05_TASK_LOG.md

### �����ļ�
- ��

### Ӱ�췶Χ
- ���������������ѵ��ľ׮֮���վλ�������?
- ��ɫ�ƶ����� SoftCollision ������ʱ��Ч��·
- ���ˡ���������ͨվλ����֮������ȼ����?

### ��֤��ʽ
- dotnet build WCDEL.sln /p:BuildProjectReferences=false
- ����ս����������֤����ͨ�����Ӵ����ٻ���ײ�ɣ������λ����ʱ������ȫ�ص���һ�ţ����ܻ��˺ͷ����ڼ�λ����Ȼ������Ȼ�����ᱻ����ײ��������?

### ����ע������
- ��������ײ��ǰ���������뾶���Ʒ��룬�ʺ��ֽ׶�ԭ��ս��վλ�����������Ҫ����ȷ�ĺ��������߻��ͼ�赲����Ҫ�ڴ˻����ϼ�����չר�� lane/collision ϵͳ��
- ���ĳЩ���ⵥλ��Ҫ��ȫ���˻���ȫ������վλ���룬��ֱ��ͨ����Ӧ��ɫ���ùر�?Movement.SoftCollision������Ҫ�ٸĵײ���ײ��·��
## 2026-05-19 - �����Ծ״̬���޸�?

### �޸�����
- �޸� PlayerJumpController ȱʧ Landing �׶���β�����⣬�����ɫ����غ��� Land / �� Grounded ��������º����޷��ٴ�������
- ����������ʱͬ�����ÿ������������ʱ״̬������ɵ��ܻ��ָ�״̬����������ͨ��Ծ��·��
- �����������롢HUD ��ť���ɫ�����Žӽṹ���䣬ֻ��������Ծ��λ�ƽ��߼���?

### �޸��ļ�
- Assets/Game/Runtime/Gameplay/Characters/PlayerJumpController.cs
- docs/05_TASK_LOG.md

### �����ļ�
- ��

### Ӱ�췶Χ
- �����ͨ��Ծ����ػָ����ٴ�������״̬�ƽ�
- ��Ծ�����������ʱ״̬֮��Ļ�����?

### ��֤��ʽ
- dotnet build WCDEL.sln /p:BuildProjectReferences=false
- ����ս����������֤������Ծ���� HUD ��Ծ��ť����������������غ��ܹ��ٴ�������Ծ����Ծ�����ڵ�һ����غ�����ʧЧ

### ����ע������
- ��ǰ�޸�������Ծ״̬��ȱʧ�� Landing -> Grounded ��β������������С������������������������Ҫ�ٵ������?InputActionAsset ���Ƿ�͵��?GameInputReader �� Jump ����һ�¡�
- ��������չ��������������������ӵ��ܻ���ع���Ӧ������ PlayerJumpController ����չ��λ������Ҫ����Ծ������ɢ�䵽������������ظ��жϡ�?# 2026-05-19 - �������������?

### �޸�����
- �������� CaveBat ������Դ��·��������ʽ����Ϊ��������ˣ������Ƕ����½�һ���ظ����ˡ�?
- Ϊ���˶��岹����в����ֶΣ�������?FlyingEnemyPresentation2D���÷��е���ӵ�����������������Ѫ��ê��̧�����֡�?
- ���½��������ɹ�����Ϊ CaveBat ����ʵ��������б�������� UiAnchor��ʹ��������ˢ�µ�ֱ�ӱ���Ϊ���е�λ��
- ��������Ѫ����λ�߼������ȸ��� UiAnchor��������е��˵�Ѫ�������ڵ���߶ȡ�

### �޸��ļ�
- Assets/Game/Runtime/Core/Definitions/EnemyDefinition.cs
- Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs
- Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs
- Assets/Game/Runtime/Gameplay/Combat/FlyingEnemyPresentation2D.cs
- Assets/Game/Runtime/Gameplay/UI/CombatWorldSpaceBar2D.cs
- Assets/Game/Editor/FoundationAssetUtility.cs
- WCDEL.Game.Runtime.csproj
- docs/05_TASK_LOG.md

### �����ļ�
- Assets/Game/Runtime/Gameplay/Combat/FlyingEnemyPresentation2D.cs

### Ӱ�췶Χ
- Chapter01 �� CaveBat �ĵ��˶����볡�����ɽ��?
- ��ս/Զ�̵��˿���������˶���ͬ�����?
- ����Ѫ��ê������е�λ��ͷ��?UI ����

### ��֤��ʽ
- dotnet build WCDEL.sln /p:BuildProjectReferences=false
- ����ս����������֤��EastMeadow �� GrassCave �����?CaveBat ��������״̬���֣�Ѫ������̧�ߺ��ͷ��λ�����?

### ����ע������
- ��ǰ���е�����Ҫ������Ǳ��ֲ�����ò㣬�Ը������е���׷��/�����߼����������Ҫ���������е������Կ��ж������ר�����ܣ��������ж����ֶλ����ϼ�����չ��
- �����������������е��ˣ����ȸ��� EnemyDefinition �ķ��в����� FlyingEnemyPresentation2D����Ҫ�ٸ���һ�׶������˿�������

## 2026-05-20 - ��Ծ��������漼�ܹ����Ż�?

### �޸�����
- ������ҿ����չ������߼���֧�ֶ���?`air_attack` ���������ٸ��õ������Ρ�
- �������ܿ����ͷŹ����������Ǽ��������Ĭ��ֻ���ڵ����ͷţ���ͬ��?HUD �İ�ť����̬��״̬��ǩ��
- �ع����뻺�������߼�����Ϊ���ڶ���ʵ�ʴ����ɹ���������壬������а��µ��漼�ܺ����ǰ����ǰ�Ե���?
- ֱ�Ӹ������ǽ�ɫ�����ʲ������� `air_attack` ������ `AllowAirCast` �ֶΣ�ȷ����ǰ��Ŀ������Ч��
- ����������ɫ�������ļ�����ĿĬ�Ϲ��򣬱������������ʱ���?`AllowAirCast`��

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/Characters/PlayerCombatController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerActorController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerInputBuffer.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Runtime/CharacterConfigs/CharacterConfig_DogHero.asset`
- `Assets/Game/Editor/CharacterConfigSampleFactory.cs`

### �����ļ�
- ��

### Ӱ�췶Χ
- �����Ծ�����ָ�?
- ���ܿյ��ͷŹ���
- ���뻺���ȶ���
- ս�� HUD ״̬��ʾ
- ���ǽ�ɫ��������

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ����ս����������֤�������ɽ���һ�ο����չ������а����漼�ܲ���ֱ�Ӷ�ʧ����ػ��崰���ڿɴ�����HUD �е����޶������ڿ�����ʾ������ʾ��

### ����ע������
- `CharacterConfigSampleFactory.cs` ��Ӣ�۶����������оɰ��ظ��ṹ������������������ɫ���������������鵥����һ��������������ʷ��֧�߼������ѵ���
- ��ǰ��Ϊ���м���ͳһ��Ϊ�����ͷţ���������������м��ܣ�ֻ���ڶ��?`CharacterSkillEntryDefinition.AllowAirCast` �Ͽ������ɡ�

## 2026-05-20 - Ӣ�����������������տ�

### �޸�����
- ����Ӣ�� DNF ���Ƹ����߼��еľ�������λ���⣬ʹ��������������ʱ����뵱ǰ����ʱһ�µ�?9 �����ṹ��
- ������Ӣ�۶���������ʽ���� `air_attack` ��������ͳһ���ܶ����������������һ�����ɰѿ����չ����ܶ������Ǵ�λ��?
- �������չ���ʹ�ñ�ǵ������ж�����Ϊ������������ȷֻ���뿪�������״̬�����ã���ߺ�����չ�ȶ��ԡ�?

### �޸��ļ�
- `Assets/Game/Editor/CharacterConfigSampleFactory.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerCombatController.cs`

### �����ļ�
- ��

### Ӱ�췶Χ
- Ӣ��������ɫ���õı༭�����ɽ��?
- �����չ��������ݵ�һ����
- �����չ�һ����ʹ�ù��������ʱ�ȶ���?

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- �������� Unity ���������� Hero ���ã�Ӧȷ�� `CharacterConfig_DogHero` �Ա��� `air_attack` ���������Ҽ��ܶ�������������ʱһ�¡�

### ����ע������
- `ConfigureHeroActions` ���Ա����ɵĻ��������������ݣ�����ǰ������Ч���Ǻ��� DNF override �տں�Ľṹ������������������������������齫�����߼����ճ��׺ϲ�Ϊ��һ��Դ��


## 2026-05-20 - UI Override ȫ������ϸ����������·

### �޸�����
- ����ǰ `Assets/Game/UI/Prefabs/Generated` ��ʣ��δ���ǵ� UI prefab ȫ�����뵽 `Assets/Game/UI/Prefabs/Overrides`��ʹ���� 24 ������ʽ UI ��Դ��ӵ��ͬ�� override variant��
- Ϊ `UiPrefabFactory` �����ϸ���ȵ�������ڣ������������ؽ��밴���� prefab �ؽ��˵����������ֻ�Ż�ĳ������ʱ���������ؽ�ȫ��?UI��
- ���� override-first ���߲��䣺����ʱ��Ƕ��ģ�������ȼ��� `Overrides`�����ṹ�������ڵ����ͨ��?generated prefab -> override variant �ļ̳����Զ�ͬ�������ֵ����档
- ���� UI prefab �����ĵ�����ȷ��ȫ���ؽ� / �����ؽ� / ���������ؽ� / ȫ�� override ���塱���Ƽ�ʹ�÷�ʽ��

### �޸��ļ�
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/features/ui_prefab_framework_sync.md`
- `docs/05_TASK_LOG.md`

### �����ļ�
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_BottomBar.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_BottomBar.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_ContentPanel.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_ContentPanel.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_Page_Character.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_Page_Character.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_Page_Map.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_Page_Map.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_Page_Quest.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_Page_Quest.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_Page_Settings.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_Page_Settings.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_TabColumn.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_TabColumn.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_TopBar.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Backend_TopBar.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Combat_CombatCluster.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Combat_CombatCluster.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Combat_PlayerCard.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Combat_PlayerCard.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Combat_QuestTracker.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Combat_QuestTracker.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Combat_Warning.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Combat_Warning.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Interaction_DialogPanel.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Interaction_DialogPanel.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Loading_MainPanel.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_Loading_MainPanel.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_MainMenu_BottomBar.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_MainMenu_BottomBar.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_MainMenu_LeftPanel.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_MainMenu_LeftPanel.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_MainMenu_RightPanel.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIModule_MainMenu_RightPanel.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIRoot_LoadingOverlay.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIRoot_LoadingOverlay.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIRoot_MainMenuHUD.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIRoot_MainMenuHUD.prefab.meta`
- `Assets/Game/UI/Prefabs/Overrides/UIRoot_WorldInteractionOverlay.prefab`
- `Assets/Game/UI/Prefabs/Overrides/UIRoot_WorldInteractionOverlay.prefab.meta`

### Ӱ�췶Χ
- Combat HUD / Backend Menu / Interaction / Loading / Main Menu �� prefab �༭�����ά�����?
- ����ʽ UI �ķ����ؽ������������ؽ��� override �̳�����
- Unity ���ֵ����ֺ���ⱻһ��ȫ�����ɸ��ǵĹ�����?

### ��֤��ʽ
- ͳ�� `Generated` �� `Overrides` prefab ������ȷ�ϵ�ǰ��Ϊ 24
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### ����ע������
- �������� UI ���ܽڵ�ʱ������ֻ�ؽ���Ӧ������Ӧ���� generated prefab����ҪĬ�������ؽ�ȫ�� UI��
- ��Ҫ�����ĳߴ硢ê�㡢λ�á�ͼƬ�滻���ֵ����ݼ���ֻ���� `Overrides`����Ҫ�ٳ���ֱ�Ӹ� `Generated`��
- �������ĳ������Ľṹ�仯�ǳ��󣬽���������õ��?override variant ���ߣ��������¸���һ������̳еĶ���?prefab�������¹��ܽڵ�����Զ�ͬ��������?


## 2026-05-20 - UI Override ͬ����·��ԭ���ؽ��տ�

### �޸�����
- �� `UiPrefabFactory` ������ʽ UI ��ǿ���ؽ�·���ӡ���ɾ�� prefab ���ؽ�����Ϊ��ֱ�Ӹ���ͬһ·�����桱������ generated prefab �ʲ������ȶ������� override variant ʧȥ�ȶ��̳�Դ��
- ��������ȷ�� UI �ṹͬ���˵���֧�ְ�ȫ���������顢������ generated prefab �������ڵ�ͽṹͬ��������?override �̳������������ֵ���������ˢ��ȥ��
- �������������е�ȫ���ؽ��������ؽ����������ؽ���ڣ�����һ����ȷ��ְ���ؽ�?generated ���ף��ֵ��������� overrides��
- ���� UI prefab �����ĵ������䡰�ؽ����͡�ͬ���ṹ��������ڵ��Ƽ�ʹ�÷�ʽ��?

### �޸��ļ�
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/features/ui_prefab_framework_sync.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ����ʽ UI prefab �ı༭���ؽ���ṹͬ������?
- `Overrides` ��Ϊ�����ֵ�����ȶ���?
- ������������ʱ UI �½ڵ�ͬ������ override variant �Ĺ�����

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ͳ�� `Assets/Game/UI/Prefabs/Generated` �� `Assets/Game/UI/Prefabs/Overrides` prefab ��������ǰ��Ϊ 24
- ���� `UiPrefabFactory.cs`��ȷ������ delete-first �� generated prefab �ؽ�·��

### ����ע������
- �Ժ������ֻ���ֵ�ĳ������ĳߴ硢λ�á�ê�㡢ͼƬ�滻������ֻ�� `Assets/Game/UI/Prefabs/Overrides`��
- ���������������ĳ������Ľṹ�ڵ㡢����λ�������飬������ `Sync Override Structure/<Group>` �� `Sync Selected Generated Prefab Into Overrides`����ҪĬ�������ؽ�ȫ�� UI��
- ֻ�е� generated ���ײ��ֱ�����Ҫ�ϴ����ʱ������?`Rebuild Generated UI/<Group>` �� `Rebuild Selected Generated Prefab`���������԰ѽṹˢ�º��ֵ�����ά���𿪡�


## 2026-05-20 - ���� UI Override ʵ��ˢ���޸�

### �޸�����
- �Ų�ȷ������ʱ������ȫû�� override-first ��·�����ǲ����ѱ��泡���е� UI ��ʵ����Ȼ�󶨵� `Generated` prefab source�����½�����Ϸ������û��ʹ�� `Overrides`��
- �� `FoundationAssetUtility` ��������ˢ�µ�ǰ���� UI ʵ���� Overrides���롰ˢ�º��ĳ��� UI ʵ���� Overrides����ڣ����ڰѳ��������е�?HUD / �˵� / ���� / Loading UI ��ʵ�����°󶨵� override-first ���̡�
- �����༭�� Play Mode ���ӣ����˳��༭ģʽ���� Play ǰ�Զ�ִ�е�ǰ���� UI ʵ��ˢ�£����ٳ����������� generated ʵ�����µ���ʾƫ�
- ���� UI prefab �����ĵ������䡰����ʵ��Ҳ��Ҫˢ�µ� override ���á���˵�����²˵��÷���

### �޸��ļ�
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `Assets/Game/Editor/EditorAutomationBridge.cs`
- `Assets/Game/Editor/SceneUiOverrideRefreshPlayModeHook.cs`
- `docs/features/ui_prefab_framework_sync.md`

### �����ļ�
- `Assets/Game/Editor/SceneUiOverrideRefreshPlayModeHook.cs`

### Ӱ�췶Χ
- MainMenu / Sandbox_Combat �ȳ������ѱ��� UI ��ʵ���� prefab source �󶨷�ʽ
- ���� Play ǰ�ı༭�� UI ˢ������
- override-first UI ��������ʵ����ر���?

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ��̬��鳡����?prefab guid��ȷ�ϵ�ǰ�������Ϊ�ɳ���ʵ��������?generated source�������� override-first ���غ���ȱʧ
- ͨ�������˵������?Play ǰ�Զ�ˢ�£�ʹ��ǰ���� UI ��ʵ�������� override-first ��

### ����ע������
- ������Ѿ���?Unity �༭�������Ŀ���ⲿ������?Unity �����޷�ͬʱ��дͬһ���̳�������ʱ����ֱ���ò˵� `Tools/WCDEL/UI/Refresh Current Scene UI Instances To Overrides`��
- ���� Play ǰ���ڻ��Զ�ִ��һ�ε�ǰ���� UI ˢ�£��������ϣ���ѽ��ֱ�ӹ̻����浽�����ļ����Խ����ֶ�ִ��һ��ˢ�²˵������泡����
- ������������µ�?UI �� Canvas ���ͣ�ҲҪ�������� `RefreshCurrentSceneUiInstancesToOverrides`����Ҫֻ�Ӽ����߼����ӳ���ʵ��ˢ�¡�



## 2026-05-20 - 第一章技能与装备图标重绘尝试



### 修改内容

- 按用户提供的两张参考图，重新整理第一�?6 个技能与 6 件装备的图标重绘 prompt

- 新增技�?prompt 批次 `skill_prompts.jsonl` 与装�?prompt 批次 `equipment_prompts.jsonl`

- 复用现有 `DefinitionIconAssignmentUtility` 的接入链路，确认技能、装备、道具与地形图标都仍�?`GameDefinition.Icon`

- 实际尝试通过 CLI fallback 批量生成技能与装备图标，但接口再次返回 `billing_hard_limit_reached`



### 修改文件

- `docs/05_TASK_LOG.md`



### 新增文件

- `docs/features/chapter01_skill_equipment_icon_retheme_pipeline.md`

- `output/imagegen/chapter01_skill_equipment_icons/skill_prompts.jsonl`

- `output/imagegen/chapter01_skill_equipment_icons/equipment_prompts.jsonl`



### 影响范围

- 第一章技能图标重绘流�?

- 第一章装备图标重绘流�?

- 图标 prompt 批量生产与接入准�?



### 验证方式

- `python -m py_compile Tools/ItemIcons/compose_item_icons.py`

- `python C:\Users\Admin\.codex\skills\.system\imagegen\scripts\image_gen.py generate-batch --input output/imagegen/chapter01_skill_equipment_icons/skill_prompts.jsonl --out-dir output/imagegen/chapter01_skill_equipment_icons/generated/skills --model gpt-image-1.5 --quality high --output-format png --concurrency 2 --max-attempts 2 --force`

- 结果：技能批次全部返�?`billing_hard_limit_reached`



### 后续注意事项

- 当前阻塞仍然�?OpenAI 图片额度，不�?prompt 或脚本问�?

- 额度恢复后，直接重跑技能批次和装备批次即可

- 本轮尚未实际输出�?PNG，也尚未回填�?`Assets/Game/Art/Icons/Skills` �?`Assets/Game/Art/Icons/Equipment`

## 2026-05-20 - ��һ�¼�����װ��ͼ����ʽ�������?



### �޸�����

- ʹ������ `$imagegen` ������������ `skill_prompts.jsonl` �� `equipment_prompts.jsonl` ʵ������ 6 �ż�������ͼ�� 6 ��װ������ͼ��

- ���� `output/imagegen/chapter01_skill_equipment_icons/icon_jobs.json`���� chapter01 ����/װ��ͼ�����������ͼ������װ�����ʽ��Դ·����������

- ���� `Tools/ItemIcons/compose_definition_icons.py` ������ͼ�ϳ�Ϊ��Ŀͳһ���� `256x256` ����ͼ�꣬�����ǻ���ʽ����/װ��ͼ��Ŀ¼��

- �� `PoisonMist` ����һ�ζ���������ȥ���װ�ƫ���ڵ���������ʹ������������Ρ���ů��ͯ����������ֻ桱��Ŀ����



### �޸��ļ�

- `docs/05_TASK_LOG.md`

- `output/imagegen/chapter01_skill_equipment_icons/icon_jobs.json`

- `Assets/Game/Art/Icons/Skills/UI_Icon_Skill_FireRing.png`

- `Assets/Game/Art/Icons/Skills/UI_Icon_Skill_FrostNova.png`

- `Assets/Game/Art/Icons/Skills/UI_Icon_Skill_LeafBurst.png`

- `Assets/Game/Art/Icons/Skills/UI_Icon_Skill_PoisonMist.png`

- `Assets/Game/Art/Icons/Skills/UI_Icon_Skill_SolarBurst.png`

- `Assets/Game/Art/Icons/Skills/UI_Icon_Skill_ThunderStep.png`

- `Assets/Game/Art/Icons/Equipment/UI_Icon_Equipment_VillageSword.png`

- `Assets/Game/Art/Icons/Equipment/UI_Icon_Equipment_BeeStingBlade.png`

- `Assets/Game/Art/Icons/Equipment/UI_Icon_Equipment_TravelerTunic.png`

- `Assets/Game/Art/Icons/Equipment/UI_Icon_Equipment_ScoutCap.png`

- `Assets/Game/Art/Icons/Equipment/UI_Icon_Equipment_TravelerBrooch.png`

- `Assets/Game/Art/Icons/Equipment/UI_Icon_Equipment_HoneyCharm.png`



### �����ļ�

- `output/imagegen/chapter01_skill_equipment_icons/icon_jobs.json`

- `output/imagegen/chapter01_skill_equipment_icons/generated/skills/skill_fire_ring.png`

- `output/imagegen/chapter01_skill_equipment_icons/generated/skills/skill_frost_nova.png`

- `output/imagegen/chapter01_skill_equipment_icons/generated/skills/skill_leaf_burst.png`

- `output/imagegen/chapter01_skill_equipment_icons/generated/skills/skill_poison_mist.png`

- `output/imagegen/chapter01_skill_equipment_icons/generated/skills/skill_solar_burst.png`

- `output/imagegen/chapter01_skill_equipment_icons/generated/skills/skill_thunder_step.png`

- `output/imagegen/chapter01_skill_equipment_icons/generated/equipment/equipment_village_sword.png`

- `output/imagegen/chapter01_skill_equipment_icons/generated/equipment/equipment_bee_sting_blade.png`

- `output/imagegen/chapter01_skill_equipment_icons/generated/equipment/equipment_traveler_tunic.png`

- `output/imagegen/chapter01_skill_equipment_icons/generated/equipment/equipment_scout_cap.png`

- `output/imagegen/chapter01_skill_equipment_icons/generated/equipment/equipment_traveler_brooch.png`

- `output/imagegen/chapter01_skill_equipment_icons/generated/equipment/equipment_honey_charm.png`



### Ӱ�췶Χ

- ��һ�¼���ͼ����װ��ͼ��������Ӿ���Դ��?

- `GameDefinition.Icon` ��������ԭ�м��� / װ��ͼ�����·������Ķ��ӿڻ���Դ·����

- ������Ҫ�����ػ�ͬ�ඨ��ͼ�꣬��ֱ�Ӹ��ñ��� prompt ���� + `icon_jobs.json` + `compose_definition_icons.py` ��������̡�?



### ��֤��ʽ

- `python -m py_compile Tools/ItemIcons/compose_definition_icons.py`

- `python Tools/ItemIcons/compose_definition_icons.py --manifest output/imagegen/chapter01_skill_equipment_icons/icon_jobs.json --template-meta Assets/Game/Art/Icons/Equipment/UI_Icon_Equipment_VillageSword.png.meta`

- ���?12 ����ʽ���?PNG��ȷ�ϳߴ���?`256x256`

- Ŀ�ӳ��?`UI_Icon_Skill_FireRing.png`��`UI_Icon_Skill_PoisonMist.png`��`UI_Icon_Equipment_VillageSword.png`��`UI_Icon_Equipment_HoneyCharm.png`��ȷ�ϵװ�ϳ��������������



### ����ע������

- ��������ͼ������ `output/imagegen/chapter01_skill_equipment_icons/generated`���������Ҫ����΢�����������滻����ͼ��������һ�κϳɽű���?

- `compose_item_icons.py` ֻ���� item ����װ壻���ܡ�װ�������Ρ��������Ӧ����ʹ�� `compose_definition_icons.py`�����������ʽ��ƥ��?

- ���������Ҫ��������ͼ����������������ʲ������ٽ�?`DefinitionIconAssignmentUtility` ��һ�α༭����������

## 2026-05-20 - ��λ��ͼ����ĿĿ¼���뼰͸��Դͼ����



### �޸�����

- �˶Բ�ȷ�ϱ�������/װ����ʽͼ���Ѿ�λ�� `Assets/Game/Art/Icons/Skills` �� `Assets/Game/Art/Icons/Equipment`��

- ����Ŀ������ͼ��͸��ԴͼĿ¼ `Assets/Game/Art/Icons/Skills/SourceTransparent` �� `Assets/Game/Art/Icons/Equipment/SourceTransparent`���� 12 �� chapter01 ����/װ��ͼ���͸��Դͼһ��������Ŀ��Դ����?

- ��ͼ��Դͼִ����ͨǳɫ����ȥ�״���������������ƽ���Ŀʱ��Ϊʵ�׵����⣬ȷ��ԴͼΪ������?alpha ��͸�� PNG��

- Ϊ������ص��˲�����Ŀ��͸������Դͼ����?`BeeCaptain`��`HiveGuardian` ȱʧ�� `SourceSheetsTransparent` ȫ�����룬������ `PoisonBee` ȱʧ������͸��������



### �޸��ļ�

- `docs/05_TASK_LOG.md`

- `Assets/Game/Art/Icons/Skills/SourceTransparent/*`

- `Assets/Game/Art/Icons/Equipment/SourceTransparent/*`

- `Assets/Game/Art/Unit/EnemyActionPacks/BeeCaptain/SourceSheetsTransparent/*`

- `Assets/Game/Art/Unit/EnemyActionPacks/HiveGuardian/SourceSheetsTransparent/*`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/SourceSheetsTransparent/*`

- `output/imagegen/chapter01_skill_equipment_icons/generated/skills/*`

- `output/imagegen/chapter01_skill_equipment_icons/generated/equipment/*`



### �����ļ�

- `Assets/Game/Art/Icons/Skills/SourceTransparent/UI_Icon_Skill_FireRing.png`

- `Assets/Game/Art/Icons/Skills/SourceTransparent/UI_Icon_Skill_FrostNova.png`

- `Assets/Game/Art/Icons/Skills/SourceTransparent/UI_Icon_Skill_LeafBurst.png`

- `Assets/Game/Art/Icons/Skills/SourceTransparent/UI_Icon_Skill_PoisonMist.png`

- `Assets/Game/Art/Icons/Skills/SourceTransparent/UI_Icon_Skill_SolarBurst.png`

- `Assets/Game/Art/Icons/Skills/SourceTransparent/UI_Icon_Skill_ThunderStep.png`

- `Assets/Game/Art/Icons/Equipment/SourceTransparent/UI_Icon_Equipment_VillageSword.png`

- `Assets/Game/Art/Icons/Equipment/SourceTransparent/UI_Icon_Equipment_BeeStingBlade.png`

- `Assets/Game/Art/Icons/Equipment/SourceTransparent/UI_Icon_Equipment_TravelerTunic.png`

- `Assets/Game/Art/Icons/Equipment/SourceTransparent/UI_Icon_Equipment_ScoutCap.png`

- `Assets/Game/Art/Icons/Equipment/SourceTransparent/UI_Icon_Equipment_TravelerBrooch.png`

- `Assets/Game/Art/Icons/Equipment/SourceTransparent/UI_Icon_Equipment_HoneyCharm.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/BeeCaptain/SourceSheetsTransparent/*`

- `Assets/Game/Art/Unit/EnemyActionPacks/HiveGuardian/SourceSheetsTransparent/*`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/SourceSheetsTransparent/PoisonBee_attack_01.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/SourceSheetsTransparent/PoisonBee_dash.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/SourceSheetsTransparent/PoisonBee_dead.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/SourceSheetsTransparent/PoisonBee_hit.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/SourceSheetsTransparent/PoisonBee_idle.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/SourceSheetsTransparent/PoisonBee_jump.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/SourceSheetsTransparent/PoisonBee_move.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/SourceSheetsTransparent/PoisonBee_skill_leaf.png`



### Ӱ�췶Χ

- chapter01 ����/װ��ͼ������ͬʱ�߱���ʽ��Ʒ����Ŀ��͸��Դͼ��

- BeeCaptain / HiveGuardian / PoisonBee ����ʽ��λ����������ͬʱ�߱���Ŀ��͸���������������ں����滻���ص����������ӡ�

- ���Ķ�������ʽ��Դ����������·������������Ŀ��Դ���е�͸��Դͼ�㡣



### ��֤��ʽ

- ���?`Assets/Game/Art/Icons/Skills/SourceTransparent` �� `Assets/Game/Art/Icons/Equipment/SourceTransparent` �� 12 ��͸��Դͼ�Ѵ��ڡ�

- ���?`Assets/Game/Art/Unit/EnemyActionPacks/BeeCaptain/SourceSheetsTransparent`��`HiveGuardian/SourceSheetsTransparent`��`PoisonBee/SourceSheetsTransparent` �Ѵ��ڶ�Ӧ͸��������

- ���?`UI_Icon_Skill_FireRing.png`��`UI_Icon_Equipment_HoneyCharm.png`��`BeeCaptain_spawn.png`��`HiveGuardian_idle.png` �� alpha ͨ����ȷ�Ͼ�Ϊ����͸�� PNG��



### ����ע������

- ��ǰͼ��͸��Դͼ������������ͼȥ�׽������������и��ɾ���ԭʼ͸����ͼ����ֱ��ͬ������ `SourceTransparent` Ŀ¼��

- ��λ `SourceSheetsTransparent` ��ǰ�� BeeCaptain / HiveGuardian ������ʽ͸�� strip �����������Ŀ��͸��Դͼ���������������������?AI ԭʼ��ͼ��Ҳ����������ǵ�ͬ��Ŀ¼��?

## 2026-05-20 - ��ϵ���� Jump ���������������ʽ��?



### �޸�����

- ���û��ṩ�� `CaveBat_jump` �� `MeadowSlime_jump` Ϊ����׼��������ϵ 3 �����˵� `jump` ����������ͳһΪ��ƫ Q �桢Բ���ֻ����ι������滻��ԭ���ļ�ªռλͼ��

- ʹ������ͼ�����ɹ��������� `PoisonBee_jump`��`BeeCaptain_jump`��`HiveGuardian_jump`�������䵽 `Temp/EnemyImageGen/generated`��

- ͨ�� `imagegen_enemy_batch.py postprocess-selected` ����������ʽ��� `Assets/Game/Art/Unit/EnemyActionPacks/*/SourceSheetsTransparent`��`Strips`��`Frames` ������ʱ����֡Ŀ¼�������ٴ�ֻͣ������ʱĿ¼��

- ������������͸���������ҳߴ��Ѷ�����Ŀ���ߣ�`PoisonBee/BeeCaptain` Ϊ `832x832`��`HiveGuardian` Ϊ `1024x1024`��



### �޸��ļ�

- `docs/05_TASK_LOG.md`

- `Temp/EnemyImageGen/generated/PoisonBee_jump.png`

- `Temp/EnemyImageGen/generated/BeeCaptain_jump.png`

- `Temp/EnemyImageGen/generated/HiveGuardian_jump.png`

- `Temp/EnemyImageGen/selection_bee_jump_style_refresh.json`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/SourceSheetsTransparent/PoisonBee_jump.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/BeeCaptain/SourceSheetsTransparent/BeeCaptain_jump.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/HiveGuardian/SourceSheetsTransparent/HiveGuardian_jump.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/Strips/PoisonBee_jump_Strip_04f_256.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/BeeCaptain/Strips/BeeCaptain_jump_Strip_04f_256.png`

- `Assets/Game/Art/Unit/EnemyActionPacks/HiveGuardian/Strips/HiveGuardian_jump_Strip_04f_512.png`

- `Assets/Game/Runtime/CharacterConfigs/Animations/PoisonBee/PoisonBee_jump_*.png`

- `Assets/Game/Runtime/CharacterConfigs/Animations/BeeCaptain/BeeCaptain_jump_*.png`

- `Assets/Game/Runtime/CharacterConfigs/Animations/HiveGuardian/HiveGuardian_jump_*.png`



### �����ļ�

- `Temp/EnemyImageGen/selection_bee_jump_style_refresh.json`



### Ӱ�췶Χ

- `PoisonBee`��`BeeCaptain`��`HiveGuardian` �� `jump` ���������Ѵ�ռλ�������Ϊ��?`CaveBat` / `MeadowSlime` ��ͳһ�Ŀ�ͨ�ֻ���

- ��ʽ��λ������������ʱ����֡����ͬ��ˢ�£�����Ҫ�ٴ���ʱĿ¼�ֶ����ˡ�

- ������������ `dash / idle / attack / skill_leaf`�������ñ���ͬһ����������·�����������ɡ�



### ��֤��ʽ

- ���?`Assets/Game/Art/Unit/EnemyActionPacks/PoisonBee/SourceSheetsTransparent/PoisonBee_jump.png`

- ���?`Assets/Game/Art/Unit/EnemyActionPacks/BeeCaptain/SourceSheetsTransparent/BeeCaptain_jump.png`

- ���?`Assets/Game/Art/Unit/EnemyActionPacks/HiveGuardian/SourceSheetsTransparent/HiveGuardian_jump.png`

- �� PIL ���?3 ��Դͼ alpha ͨ����������?`alpha=(0,255)`

- ͳ������ʱĿ¼ `PoisonBee/BeeCaptain/HiveGuardian` �� `jump` ֡������������?4 ֡



### ����ע������

- ���ֻ�����˷��?3 �����˵� `jump`�����ද�����Ǿ�ռλ��ɷ����һ�ֽ��鰴 `dash -> idle -> attack_01 -> skill_leaf` �������롣

- `HiveGuardian_jump` �Ѱ� Boss �ߴ�����Ŀ���鿴���￴�������̸�����͸��������ʾ������ͼƬʵ�ʲ�����ɫ��?



## 2026-05-20 - 第一章技能图标重试失败确�?



### 修改内容

- 按用户要求再次重试第一章技能图标批量生�?

- 继续使用已整理好�?`skill_prompts.jsonl` 作为输入

- 生成结果再次返回 `billing_hard_limit_reached`，确认当前仍无法继续出图



### 修改文件

- `docs/05_TASK_LOG.md`



### 新增文件

- �?



### 影响范围

- 第一章技能图标批量生�?

- 额度恢复后的重跑准备



### 验证方式

- `python C:\Users\Admin\.codex\skills\.system\imagegen\scripts\image_gen.py generate-batch --input output\imagegen\chapter01_skill_equipment_icons\skill_prompts.jsonl --out-dir output\imagegen\chapter01_skill_equipment_icons\generated\skills --model gpt-image-1.5 --quality high --output-format png --concurrency 2 --max-attempts 2 --force`

- 结果：全部任务返�?`billing_hard_limit_reached`



### 后续注意事项

- 当前问题只剩 OpenAI 图片额度

- 额度恢复后可直接重跑现有技能和装备 prompt 批次



## 2026-05-20 - 第一章技能与装备图标非生成式回填



### 修改内容

- 放弃 imagegen 继续重试，改为使用项目内现成的透明源图�?repo-native 合成

- 新增 `Tools/ItemIcons/compose_from_source_transparent.py`，把技能与装备透明图统一合成到当前项目图标框

- 新增 `source_compose_manifest.json`，一次性覆�?6 个技能和 6 件装备的正式图标路径

- 已将合成结果写回 `Assets/Game/Art/Icons/Skills` �?`Assets/Game/Art/Icons/Equipment`



### 修改文件

- `docs/05_TASK_LOG.md`



### 新增文件

- `Tools/ItemIcons/compose_from_source_transparent.py`

- `output/imagegen/chapter01_skill_equipment_icons/source_compose_manifest.json`



### 影响范围

- 第一章技能图标正式资�?

- 第一章装备图标正式资�?

- 后续 UI 读取到的图标外观



### 验证方式

- `python Tools/ItemIcons/compose_from_source_transparent.py --manifest output/imagegen/chapter01_skill_equipment_icons/source_compose_manifest.json`

- 检�?`Assets/Game/Art/Icons/Skills` �?`Assets/Game/Art/Icons/Equipment` �?PNG 文件已更�?



### 后续注意事项

- 当前图标已不再依赖生成接口，可直接用于游戏内

- 如果后续要进一步调整风格，只需要修改合成脚本里的边框与底板参数



## 2026-05-20 - 第一章场景物件图标非生成式回�?



### 修改内容

- 按用户继续要求，把非生成�?fallback 扩展到场景物件图�?

- 基于现有 `WorldPlaceholders` 占位图，合成并统一输出公告栏、传送门、宝箱、复活点、告示牌、信标等图标

- 新增 `Tools/ItemIcons/compose_scene_object_icons.py`

- 新增场景物件合成清单 `output/imagegen/chapter01_scene_object_icons/compose_manifest.json`

- 输出图标写回 `Assets/Game/Art/Icons/World`



### 修改文件

- `docs/05_TASK_LOG.md`



### 新增文件

- `Tools/ItemIcons/compose_scene_object_icons.py`

- `output/imagegen/chapter01_scene_object_icons/compose_manifest.json`



### 影响范围

- 第一章场景物件图�?

- 世界交互物件的统一图标外观

- 后续可接入公告板、传送门、宝箱、复活点�?UI 入口



### 验证方式

- `python Tools/ItemIcons/compose_scene_object_icons.py --manifest output/imagegen/chapter01_scene_object_icons/compose_manifest.json`

- 检�?`Assets/Game/Art/Icons/World` �?PNG 文件已更�?



### 后续注意事项

- 当前场景物件图标也不依赖 imagegen

- 如果要继续细化，只需扩展 manifest 新增更多世界物件



## 2026-05-20 - Texture Background Cutout 编辑器工�?



### 修改内容

- 新增 Unity Editor 抠图窗口 `TextureBackgroundCutoutWindow`

- 支持选中纹理自动带入、四角背景取样、手动背景色、预览和 PNG 输出

- 支持边缘连通背景抠除与全图颜色键抠除两种模�?

- 输出 alpha 使用原始 alpha 与抠�?mask 相乘，保留特效贴图原有半透明通道

- 输出 PNG 自动配置�?Sprite、单图、透明、无 mipmap、Clamp wrap



### 修改文件

- `docs/05_TASK_LOG.md`



### 新增文件

- `Assets/Game/Editor/TextureBackgroundCutoutWindow.cs`

- `docs/features/texture_background_cutout_tool.md`



### 影响范围

- 编辑器美术工�?

- 角色、道具、特效贴图背景透明化流�?

- 后续正式美术资源导入效率



### 验证方式

- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`



### 后续注意事项

- 对复杂背景图片仍建议先用外部专业工具粗处理，再用本工具做项目内透明 PNG 输出

- 对半透明特效图建议优先小 tolerance �?soft edge 组合，避免误删光�?



## 2026-05-21 - Texture Background Cutout 边缘质量优化



### 修改内容

- 优化抠图工具的边缘处理，新增 `Remove Color Fringe` �?`Fringe Strength`，用于清理半透明边缘残留的白底、黑底或纯色�?RGB

- 新增 `Edge Contract`，可向内收缩背景 mask，减少主体边缘被误扣

- 新增 `Ignore Transparent Pixels`，跳过源图中已经接近透明的像素，降低对特�?alpha 的二次污�?

- 调整处理顺序：先生成 mask，再可选收�?mask，最后进�?alpha �?RGB matte 清理

- 更新工具文档，补充角色、道具、特效贴图的推荐参数范围



### 修改文件

- `Assets/Game/Editor/TextureBackgroundCutoutWindow.cs`

- `docs/features/texture_background_cutout_tool.md`

- `docs/05_TASK_LOG.md`



### 新增文件

- �?



### 影响范围

- 编辑器抠图工具输出质�?

- 半透明特效贴图�?alpha 保真

- 角色、物件图边缘白边/误扣处理流程



### 验证方式

- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

- 结果：构建成功，0 error；保�?4 个既�?`Physics2D.OverlapCircleNonAlloc` 过时 warning



### 后续注意事项

- 如果仍有复杂背景误扣，需要后续增加手动画�?mask 或前景保护色功能

- 当前工具优先解决纯色/近纯色背景和常见白边问题


## 2026-05-21 - �޸� Overrides UI ��������

### �޸�����
- ���� Overrides/Generated UI �ı���·��ȷ�ϵ�ǰ�������������Ҫ�̳���?`Generated` Ԥ���塣
- ���� `UiPrefabFactory` �в����Ĵ���������Դ�����������˵��������򡢼���ҳ������Ĭ���İ���
- ��������ʱ UI Presenter ������ fallback��������ҳ��������״̬ʱ�ٴ���ʾӢ�ġ�
- ���� `Tools/UI/fix_generated_ui_texts.py`�����ı��ڵ�·�������޸� `Generated` Ԥ�����е������������ռλ�ı���?
- ������д��У��ս�� HUD������ҳ��װ��ҳ����˶���?��ҳ�������˵��������򡢼���ҳ��Ԥ�����ı���

### �޸��ļ�
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Assets/Game/Runtime/Gameplay/UI/LoadingOverlayPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/WorldInteractionOverlayPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/MainMenuCanvasPresenter.cs`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Backend_TopBar.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Backend_TabColumn.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Backend_BottomBar.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Backend_Page_Character.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Backend_Page_Quest.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Backend_Page_Map.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Backend_Page_Settings.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Backend_Page_Equipment.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Backend_Page_Skill.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Combat_PlayerCard.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Combat_QuestTracker.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Combat_CombatCluster.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIRoot_CombatCanvasHUD.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Interaction_DialogPanel.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_Loading_MainPanel.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_MainMenu_LeftPanel.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_MainMenu_RightPanel.prefab`
- `Assets/Game/UI/Prefabs/Generated/UIModule_MainMenu_BottomBar.prefab`

### �����ļ�
- `Tools/UI/fix_generated_ui_texts.py`

### Ӱ�췶Χ
- Overrides �̳е� UI �����ı���ʾ
- ս�� HUD������ҳ������ҳ�����˵��������򡢼���ҳ����Ҫ����
- ���� Generated UI �ı��޸��븴������

### ��֤��ʽ
- ʹ�ýű�ɨ�� `Assets/Game/UI/Prefabs/Generated`��ȷ�Ϲؼ� `m_Text` �в��ٲ��� `??` ռλ�ı���
- ִ�� `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### ����ע������
- ���������������?`Generated` UI ���ٴγ����ı��쳣������������ `Tools/UI/fix_generated_ui_texts.py` �����������޸���
- ���?Unity �ڼ����������ı�����Ҫȷ�ϵ�ǰ����ʵ����ˢ�µ����� override/generated Դ�������½��� Play Mode ��֤��


## 2026-05-21 - Combat Shield Runtime And HUD Feedback

### �޸�����
- ������ʵ��������ʱ `ShieldRuntime`��֧�ֵ�ǰ���ܡ���󻤶ܡ��仯�¼���״̬ͬ����
- ���� `Health` �ܻ���·Ϊ�ȿۻ����ٿ������������������������֡�
- ͷ����λ HUD ������������ͬʱ�� Buff / Debuff ͼ��ӵ���ĸռλ����Ϊͳһ��дӳ�䡣
- ��� HUD �� Boss HUD ��Ϊ����ʱ�Զ����뻤���������� prefab ��δͬ��ʱ��ʧ������
- ������ƬΪ��ҡ�ѵ�����ˡ���Ӣ��Boss �Ͳ���Զ�̵��˲��뻤�����ӣ�����ֱ�Ӳ��ԡ�

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/Combat/Health.cs`
- `Assets/Game/Runtime/Gameplay/Combat/IDamageable.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusController.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatWorldSpaceBar2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatHudDataSource.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `WCDEL.Game.Runtime.csproj`
- `docs/features/combat_damage_number_unit_hud_buff_feedback_sync.md`
- `docs/05_TASK_LOG.md`

### �����ļ�
- `Assets/Game/Runtime/Gameplay/Combat/ShieldRuntime.cs`

### Ӱ�췶Χ
- ս���˺�������·
- ��λͷ�� HUD
- ���ս�� HUD
- Boss ���� HUD
- Sandbox Combat ������Ƭ

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- �����`0 warning / 0 error`

### ����ע������
- Ŀǰ��������������ʱ�Զ�����Ϊ�����������Ҫ��ȫ������ Overrides ��ϵ���������һ������� Boss ������ͬ������Ӧ prefab��
- ���ڵ� Buff ͼ����Ȼ��������дӳ��㣬�������ڲ���ҵ���߼���ǰ�����滻Ϊ��ʽ Sprite ͼ����

## 2026-05-21 - Combat Status Auto Mapping And HUD Sync

### �޸�����
- ���� `CombatStatusAutoMapper`���������淨����޵С������Σ�յ���״̬�Զ�ӳ�䵽 `CombatStatusController`��
- ͷ����λ HUD �������ȶ���ʾ `INV`��`SA` �Լ���Ԫ��ӳ���Σ�յ��� Debuff������ֻ������������״̬��
- `CombatWorldSpaceBar2D` �Զ�����״̬ӳ���������֤�ɵ�λ����ʱҲ�ܽ���ͬһ��״̬��ʾ��·��
- ����ͷ�� HUD ����ʽ������ʾ������������ʱ״̬�Ѵ���ʱ�ظ����ְ���ͼ�ꡣ

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusAutoMapper.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusController.cs`
- `Assets/Game/Runtime/Gameplay/Combat/HealthFeedbackEvent.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatWorldSpaceBar2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `WCDEL.Game.Runtime.csproj`
- `docs/features/combat_damage_number_unit_hud_buff_feedback_sync.md`
- `docs/05_TASK_LOG.md`

### �����ļ�
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusAutoMapper.cs`

### Ӱ�췶Χ
- ս��״̬��ʾ��·
- ��λͷ�� HUD Buff / Debuff չʾ
- ��ҷ������������������ܰ���/�޵з���
- Σ�յ���״̬��ʾ

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- �����`0 error`������ 4 ������ `Physics2D.OverlapCircleNonAlloc` ��ʱ warning

### ����ע������
- Ŀǰ�޵�/����/����Σ��״̬�Ѿ����� HUD������������ӳ��㣬���������ٺ���ʽ Buff ��ֵϵͳ�ϲ���
- ���ڵ�ǰ Unity �����Կ��ܱ��Ѵ򿪵ı༭��ռ�ã����û��ǿ���ؽ� Generated / Overrides prefab����������ʱ�Զ�������·�Ѿ�����Ч��

## 2026-05-21 - Screen Shake Camera Feedback Integration

### �޸�����
- ����ͳһ��ͷ���������� CombatCameraFeedbackController2D�����д���������HitStop�����ⰵ�Ǻ;�ͷ�������塣
- ����ս����Χ����Ͷ������ܻ�����ͳһ���� CombatFeedbackBroadcaster��֧�ֱ��������ס�������Boss ��Դ�� DoT �ȷֲ㷴����
- Ϊ��Ҽ������֡��������֡���ս Boss ������Զ�� Boss �������뾵ͷ������֡�
- ������ʱ����������༭������������У��Զ�ȷ����������ؾ�ͷ������������
- �޸� AreaSkillEmitter �����з���������ú�������⣬�����뷶Χ�� / Ͷ����� Boss ��Դ�жϡ�

### �޸��ļ�
- Assets/Game/Runtime/Gameplay/Combat/CombatCameraFeedbackController2D.cs
- Assets/Game/Runtime/Gameplay/Combat/CombatFeedbackBroadcaster.cs
- Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs
- Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs
- Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs
- Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs
- Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs
- Assets/Game/Editor/FoundationAssetUtility.cs
- WCDEL.Game.Runtime.csproj
- docs/features/screen_shake_camera_feedback_sync.md
- docs/05_TASK_LOG.md

### �����ļ�
- Assets/Game/Runtime/Gameplay/Combat/CombatCameraFeedbackController2D.cs
- docs/features/screen_shake_camera_feedback_sync.md

### Ӱ�췶Χ
- ս����ͷ������·
- ����ܻ������н������
- �����ͷ�������ͷ���Ļ����
- Boss ������ͷ����
- Sandbox Combat �������������ʱ����

### ��֤��ʽ
- dotnet build WCDEL.sln /p:BuildProjectReferences=false
- �����  error������ 4 ������ Physics2D.OverlapCircleNonAlloc ��ʱ warning

### ����ע������
- ��ǰ reduced motion ����Чǿ����������ʱ�ӿڣ�������Ҫ������ʽ���ý�����־û����á�
- ɫ���������Boss ���׶κ��Ʒ�ר����ͷ�¼���δ�ű����������ɼ�����ͳһ����������չ��

## 2026-05-21 - Camera Feedback Slow Motion And Runtime Settings

### �޸�����
- ���� HitStopController���� HitStop �� SlowMotion ����ͬһ��ʱ�����Ź������������ȼ���ȫ�ָ� Time.timeScale��
- Ϊ�������С�նɱ�����С�Boss ��ǿ�����Ͳ������ܻ������ʱ���������֡�
- ����ͷ����������ʽ��������ʱ������ݣ�֧�� reduced motion������ǿ�ȡ���Ļ��Чǿ�Ⱥ����������ء�
- �������ҳ������ͷ�������ư�ť����ֱ��������ʱ�л� Camera Motion��Screen FX��Slow Motion ������Ĭ��ֵ��
- ������ͣ�˵��ͻ���������ʱ����Ч�ĳ�ͻ������˵��򵯴�ǰ���������� HitStop / SlowMotion��

### �޸��ļ�
- Assets/Game/Runtime/Core/Data/PlayerRuntimeData.cs
- Assets/Game/Runtime/Bootstrap/GameSession.cs
- Assets/Game/Runtime/Gameplay/Combat/HitStopController.cs
- Assets/Game/Runtime/Gameplay/Combat/CombatCameraFeedbackController2D.cs
- Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs
- Assets/Game/Runtime/Gameplay/UI/WorldInteractionOverlayPresenter.cs
- docs/features/screen_shake_camera_feedback_sync.md
- docs/05_TASK_LOG.md

### �����ļ�
- ��

### Ӱ�췶Χ
- ս��ʱ��������·
- ���� / նɱ / Boss ����ͷ����
- �������ҳ����ʱ����
- ��ͣ�˵��뻥������

### ��֤��ʽ
- dotnet build WCDEL.sln /p:BuildProjectReferences=false
- �����  error������ 4 ������ Physics2D.OverlapCircleNonAlloc ��ʱ warning

### ����ע������
- ��ǰ��ͷ���������Ѿ�д������ʱ������ݣ����Ƿ������ʽ���ش浵�־û�����Ҫ���������浵��д���̡�
- ����ҳ������ťĿǰ��������ʱ��̬���룬�������Ҫ��ȫ������ Overrides / Prefab ��ϵ���������Щ�ؼ�ͬ������ʽ����ҳԤ���塣

## 2026-05-21 - Camera Feedback Settings Sync Across Menus And Saves

### �޸�����
- �����������ҳ��ͷ������ť������ʱ���ߣ�ȷ�������� Camera Motion / Screen FX / Slow Motion / Reset ����ˢ���İ����󶨵���¼���
- �ؽ����˵�����ҳ�߼������������Ҳఴť���ṩ���ԡ���ͷ�𶯡���Ļ��Ч��������������Ĭ��ֵ��ڡ�
- �½��浵ǰ�Ḵ�Ƶ�ǰ�Ự��ľ�ͷ�������ã��������˵���Ĺ��Ĳ����ڿ��µ���ʧ��
- ��ȡ�ɴ浵ʱ�Ჹ��ȱʧ�ľ�ͷ����Ĭ��ֵ�����ڳ������غ���������Ӧ�õ������еľ�ͷ������������

### �޸��ļ�
- `Assets/Game/Runtime/Core/Data/PlayerRuntimeData.cs`
- `Assets/Game/Runtime/Bootstrap/GameSession.cs`
- `Assets/Game/Runtime/Bootstrap/GameBootstrapper.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/MainMenuCanvasPresenter.cs`
- `docs/features/screen_shake_camera_feedback_sync.md`
- `docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ���˵�����ҳ
- �������ҳ
- �½��浵Ĭ������
- �ɴ浵��ͷ�����ֶμ���
- �����л���ľ�ͷ����Ӧ����·

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- �����`0 error`������ 4 ������ `Physics2D.OverlapCircleNonAlloc` ��ʱ warning

### ����ע������
- ������ȱ�֤������·��������ɳ־û������˵�����ҳ�İ�Ŀǰ�����ȶ��� ASCII �ı�����������ͳһ����Ŀ��ʽ�����Ա���
- �������Ҫ������ҳ��ȫ������ Overrides / Prefab ���������������а�ť���ֻ����ϼ���ͬ���Ӿ��㣬������������ڶ��� UI �ṹ��
## 2026-05-21 - Camera Feedback UI Helper Consolidation

### �޸�����
- ���� `CameraFeedbackSettingsUiHelper`�������˵��ͺ������ҳ���õľ�ͷ������λ�л���Ĭ��ֵ�ָ���״̬�İ�������ʱӦ������������һ����
- ���� helper ��ʽ���� `WCDEL.Game.Runtime.csproj`���޸�����ʱ��������д Compile �б�δ��¼���ļ������µı���ʧ�ܡ�
- �������˵���������ҳ�ľ�ͷ������ڣ�ȷ�����߶����߹��� helper�������Ǹ���ά��һ�׵�λ�߼���

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/UI/CameraFeedbackSettingsUiHelper.cs`
- `WCDEL.Game.Runtime.csproj`
- `docs/features/screen_shake_camera_feedback_sync.md`
- `docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ���˵�����ҳ��ͷ�����߼�
- �������ҳ��ͷ�����߼�
- ����ʱ���̱�����¼��·

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- �����`0 error`������ 4 ������ `Physics2D.OverlapCircleNonAlloc` ��ʱ warning

### ����ע������
- ����������������ͷ������������ȼ�����չ `CameraFeedbackSettingsUiHelper`���������˵��ͺ�˲˵��ٴγ����߼�Ư�ơ�
- ����ʱ�����Բ�����ʽ `Compile Include` �б������� `.cs` �ļ�ʱ��Ҫͬ����� `.csproj` �Ƿ�����¼��
## 2026-05-21 - Quest System Runtime And Editor MVP Slice

### �޸�����
- �� `Docs/quest_system_ui_editor_full_design.md` ��������ϵͳ��һ������ʱ�ṹ��������������״̬��׷�����񡢿ɽ������б�������������б��͸���Ŀ������ö�١�
- ���� `QuestPresentationHelper` �� `QuestPresentationSnapshot`��Ϊ����ս�� HUD����̨����ҳ�����񵯴�����ͬһ�������ѯ���İ�ƴװ��ڡ�
- ��չ `QuestEventRouter`���� NPC �Ի����̵깺�򡢱��俪��������ѧϰ��װ�������������ƶ�������ȣ�������ֻ֧�ֲɼ����ɱ��
- �����������罻���㣺`NpcDialogueInteractable2D`��`ShopInteractable2D`��`RewardChestInteractable2D`��
- ������С��������༭����������`QuestEditorWindow`��`QuestValidator`��`QuestDesignDraftUtility`��֧�ֻ���У��������ĵ���������ݸ� JSON��
- ��������ͬ���ĵ� `docs/features/quest_system_ui_editor_full_sync.md`��

### �޸��ļ�
- `Assets/Game/Runtime/Core/Definitions/GameEnums.cs`
- `Assets/Game/Runtime/Core/Definitions/QuestDefinition.cs`
- `Assets/Game/Runtime/Core/Definitions/QuestObjectiveDefinition.cs`
- `Assets/Game/Runtime/Core/Data/QuestRuntimeState.cs`
- `Assets/Game/Runtime/Core/Data/PlayerRuntimeData.cs`
- `Assets/Game/Runtime/Bootstrap/GameSession.cs`
- `Assets/Game/Runtime/Gameplay/Questing/QuestEventRouter.cs`
- `Assets/Game/Runtime/Gameplay/World/NpcDialogueInteractable2D.cs`
- `Assets/Game/Runtime/Gameplay/World/ShopInteractable2D.cs`
- `Assets/Game/Runtime/Gameplay/World/RewardChestInteractable2D.cs`
- `WCDEL.Game.Runtime.csproj`
- `WCDEL.Game.Editor.csproj`
- `docs/05_TASK_LOG.md`
- `docs/features/quest_system_ui_editor_full_sync.md`

### �����ļ�
- `Assets/Game/Runtime/Gameplay/Questing/QuestPresentationSnapshot.cs`
- `Assets/Game/Runtime/Gameplay/Questing/QuestPresentationHelper.cs`
- `Assets/Game/Editor/QuestEditorWindow.cs`
- `Assets/Game/Editor/QuestValidator.cs`
- `Assets/Game/Editor/QuestDesignDraftUtility.cs`

### Ӱ�췶Χ
- ��������ʱ״̬��·
- ����׷������� HUD / ��̨����ҳ���ò�ѯ��
- NPC / �̵� / �����������Ŀ���ƽ�
- Unity ����༭�� MVP ���

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- �����`0 error`������ 4 ������ `Physics2D.OverlapCircleNonAlloc` ��ʱ warning

### ����ע������
- ���������ȶ����������ݲ���¼��㣬ս�� HUD ���Ͻ�����������̨����ҳ�������಼�֡���Ļ�ⷽ���ͷ������Ŀ��ͼ�껹��Ҫ�����ӵ� `QuestPresentationHelper` �ϡ�
- `BackendMenuCanvasPresenter.cs` �� `CombatCanvasHudPresenter.cs` ����ʷ���ı�������Ӱ��ϴ󣬺������鰴С���滻������� helper/���������������ֱ�Ӵ������д��

## 2026-05-21 - Quest Runtime UI And Board Follow-up

### �޸�����
- ������������ϵͳ����ʱ��·����������ѳ�ʼ�ɽ�����ע��� `AvailableQuestIds`��������չʾ�ɽӻ�����е�����
- ���������������Զ�׷�٣��鿴����������ʱҲ�᳢�԰Ѹ�������Ϊ��ǰ׷������
- ��̨����ҳ���� `BuildQuestPageMvp` չʾ�߼�����Ϊ���׷������ժҪ�����������񡢿ɽ�����������������顣
- �� `GameSession` �в�����ʵ�����¼����ߣ���ѧ�Ἴ�ܻ��ϱ� `LearnSkill`��װ����Ʒ���ϱ� `EquipItem`��
- ս�� HUD �������ѯ��Ϊ���ȶ�ȡ��ǰ׷�����񣬶����ǹ̶���ȡ��һ������������
- ��������ϵͳͬ���ĵ�����¼��������ʱ UI �ͽ�����·��ȫ�����

### �޸��ļ�
- `Assets/Game/Runtime/Bootstrap/GameSession.cs`
- `Assets/Game/Runtime/Gameplay/World/QuestBoardInteractable2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `docs/features/quest_system_ui_editor_full_sync.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ������ȡ��׷����·
- ��̨����ҳ�������չʾ
- װ��/ѧ�����������Ŀ���ƽ�
- ս�� HUD ����׷�����ȼ�

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- �����`0 error`������ 4 ������ `Physics2D.OverlapCircleNonAlloc` ��ʱ warning

### ����ע������
- `CombatCanvasHudPresenter.cs` ��������İ���������ʷ��������������ֻ����������׷���������ȡ���������������һ��С��Χ������������ HUD �����е� `QuestPresentationHelper`��
- ��Ļ���������ͷ�����������Ǻ�������������δ���룬��Ҫ��������Ƹ岹�ڶ��֡�
## 2026-05-21 - ����ϵͳս��HUD׷����Ŀ�궨λ��ǿ

### �޸�����
- Ϊս�� HUD ������׷�ٲ��乲��չʾ�������ͳһ��ʾ������ࡢ���⡢Ŀ���ı�����ȡ�
- �������� `QuestTargetLocator`��֧�� NPC�����䡢���ˡ��̵ꡢ�ɼ������㡢����������Ŀ����������������
- Ϊ�� Combat HUD Prefab ��������ʱ���ݲ����߼���ȱʧ�� `Hint` �� `Direction` �ı��ڵ���Զ���������ǿ�������ؽ���Դ��
- ��չս�� HUD ����׷����ʾ������Ŀ����ʾ�뷽��/�����ı�������ֻ�����׸������;�ʽ�ֹ�ƴװ�ı���
- ͬ������ Combat QuestTracker ���ɽṹ���ú��� Generated / Override ��·Ҳ�����µ�׷���С�
- Ϊ���н����ﲹ����Сֻ�����ԣ�����ԭ������ܹ���������ڶ���׷��ϵͳ��

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Runtime/Gameplay/Questing/QuestTargetLocator.cs`
- `Assets/Game/Runtime/Gameplay/World/NpcDialogueInteractable2D.cs`
- `Assets/Game/Runtime/Gameplay/World/RewardChestInteractable2D.cs`
- `Assets/Game/Runtime/Gameplay/World/ShopInteractable2D.cs`
- `Assets/Game/Runtime/Gameplay/World/RegionTrigger2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CollectibleInteractable2D.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `WCDEL.Game.Runtime.csproj`
- `docs/features/quest_system_ui_editor_full_sync.md`

### �����ļ�
- `Assets/Game/Runtime/Gameplay/Questing/QuestTargetLocator.cs`

### Ӱ�췶Χ
- ս�� HUD ����׷��չʾ
- ����Ŀ�귽�� / ���� MVP ��ʾ
- �� Combat HUD Prefab ������ʱ������ʾ
- Quest Generated / Override UI �ṹͬ��

### ��֤��ʽ
- ���� `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- �����`0` error���������� `4` �� `Physics2D.OverlapCircleNonAlloc` ��ʱ����

### ����ע������
- ��ǰ�����������ı��� MVP�������ǿ�Ӿ����֣��ɼ�������Ļ��Ե��ͷ������Ŀ��ͼ�ꡣ
- ���Ҫ�� Generated ��Դ�� Override ��Դ��ȫͬ���½ṹ���������� Unity ��ִ�� Combat UI ���ؽ� / ͬ���˵���
- `CombatHudPresenter` �� `PrototypeHudPresenter` �Ա����ɰ��������ʾ�߼������������ʹ�ã�Ҳ����ͬ��������չʾ�㡣
## 2026-05-21 - ����׷�ٻ���HUDͳһ

### �޸�����
- �� `CombatHudPresenter` ��������ʾ�л������� `QuestPresentationHelper` �� `QuestTargetLocator`������ֱ�Ӷ�ȡ�׸������
- �� `PrototypeHudPresenter` ��������ʾͬ����ͬһ����������չʾ��·��
- ��ԭ�� HUD / ���� HUD ���� Combat Canvas HUD һ����ͳһ��ʾ������ࡢĿ�ꡢ���ȡ���ʾ�ͷ����ı���
- ���� quest ͬ���ĵ�����¼ debug / prototype ���� HUD Ҳ�����ͳһ��

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/UI/CombatHudPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/PrototypeHudPresenter.cs`
- `docs/features/quest_system_ui_editor_full_sync.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ԭ�� HUD ����׷����ʾ
- ���� HUD ����׷����ʾ
- Quest ������ͼһ����

### ��֤��ʽ
- ���� `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ������� / ԭ�� HUD �۲�������⡢Ŀ�ꡢ��ʾ��������Ϣ�Ƿ�����ս�� HUD һ��

### ����ע������
- ��ǰ���� HUD ��ʹ�� IMGUI ���ı����֣�������������������ٲ��������ķ�������ɫ���֡�
- ������泹��ͣ�û��� HUD���ɱ������׹��� quest չʾ�߼������Ƴ�����ڼ��ɡ�
## 2026-05-21 - ����Ŀ���ͷ��������

### �޸�����
- Ϊ `CombatCanvasHudPresenter` ��������Ŀ���Ӿ��㣬֧����Ļ������Ŀ��ı�Ե��ͷ��ʾ��
- ��������Ŀ������Ļ��ʱ�����������ǣ���ʾĿ����������롣
- ��չ Combat HUD ������ʱ�Բ��ڵ��߼����� prefab ȱ�ټ�ͷ / �����ǽڵ�ʱҲ���Զ�������
- ͬ�� Combat UI ������·���� Generated / Override �ؽ���Ҳ���� `QuestEdgeArrow` �� `QuestWorldMarker` �ṹ��
- ���� quest ͬ���ĵ�����¼����׷���ѴӴ��ı�������ʾ���������ӻ�������

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/features/quest_system_ui_editor_full_sync.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ս�� HUD ����׷�ٿ��ӷ���
- QuestTracker ���ɽṹ
- �� Combat HUD prefab ������ʱ������ʾ

### ��֤��ʽ
- ���� `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ������Ϸ��֤��
- ����Ŀ������Ļ��ʱ��ʾ��Ե��ͷ
- ����Ŀ�������Ļʱ��ʾ�����������

### ����ע������
- ��ǰ��ͷ����������ʹ�������ı� / ����񣬺������滻Ϊ��ʽͼ����Դ�붯����
- ���Ҫ��һ����ǿ���֣���һ���ɲ�����Ŀ��ͼ����ࡢ���嶯����Boss / ���� / ֧�߲��컯��ɫ��
## 2026-05-21 - ����Ŀ��ָ���Ӿ�ǿ��

### �޸�����
- ����ǿ�� CombatCanvasHudPresenter ������Ŀ����ӻ����֣�����ֻͣ���ڻ����ı���ͷ�㼶��
- Ϊ����Ŀ��ָ�����Ӱ�����������ֵ�ǿ��ɫ�������ߡ�֧�ߡ����͡���ѧ��������̽�����ռ���ְҵ������ HUD �ϸ����׿��ٷֱ档
- Ϊ��ͬĿ�����Ͳ����������Ź����ý�̸�����䡢��ɱ���������򡢼���ѧϰ��װ����Ŀ��ӵ�и���ȷ���Ӿ����졣
- Ϊ��Ļ��Ե��ͷ����Ļ��������������΢���嶯�����ڲ������ڵ�ս�������ǰ���������ɶ��ԡ�
- ͬ������ quest ����ͬ���ĵ�����¼���� HUD ָ���Ӿ������뵱ǰ���ơ�

### �޸��ļ�
- Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs
- Assets/Game/Editor/UiPrefabFactory.cs
- docs/features/quest_system_ui_editor_full_sync.md

### �����ļ�
- ��

### Ӱ�췶Χ
- ս�� HUD ����Ŀ��ָ������
- QuestEdgeArrow / QuestWorldMarker ������ʽ
- �� Combat HUD prefab ������ʱ������ʾ

### ��֤��ʽ
- ���� dotnet build WCDEL.sln /p:BuildProjectReferences=false
- �����  error���������� 4 �� Physics2D.OverlapCircleNonAlloc ��ʱ����
- ������Ϸ��֤��Ļ���ͷ����Ļ�������ǡ���ɫ���������嶯���Ƿ�������ʾ

### ����ע������
- ��ǰ�������� glyph + ��ɫ�������������Ҫ�����������֣����滻Ϊ��ʽ����ͼ��ͼ����������Ķ�Ч��
- �������������չ��������Ŀ�����ͣ���Ҫͬ��������ɫӳ���� glyph ���򣬱��� HUD ���ⲻһ�¡�
## 2026-05-21 - �����������ȡ�����ʾͳһ

### �޸�����
- Ϊ����ϵͳ����ͳһ�� QuestFeedbackEvent / QuestFeedbackKind ����ʱ�����ṹ��
- �� GameSession �д�ͨ�����ȡ��Ŀ����ɡ���ȡ�������л�׷�����෴���¼����������ÿ�����������ƴ��һ����ʱ��ʾ��
- �� CombatCanvasHudPresenter ����������������������ʾ������𡢷������͡�������⡢��ǰĿ��ժҪ�뽱��ժҪ��
- �����������߷����� HUD չʾ������ϵ�ǰս�����룬ͬʱ�������� WorldInteractionOverlayPresenter �Ľ���ʽ����ְ��
- ͬ�� UiPrefabFactory ������·��Combat HUD �ؽ����ֱ�Ӵ��� QuestFeedback �ṹ����ֻ��������ʱ�Բ��ڵ㡣
- ���� quest ����ͬ���ĵ�����¼��������·�Ѵ������ֲ���ʾ����Ϊͳһ����ʱ������ڡ�

### �޸��ļ�
- Assets/Game/Runtime/Bootstrap/GameSession.cs
- Assets/Game/Runtime/Gameplay/Questing/QuestFeedbackEvent.cs
- Assets/Game/Runtime/Gameplay/Questing/QuestFeedbackKind.cs
- Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs
- Assets/Game/Editor/UiPrefabFactory.cs
- WCDEL.Game.Runtime.csproj
- docs/features/quest_system_ui_editor_full_sync.md

### �����ļ�
- Assets/Game/Runtime/Gameplay/Questing/QuestFeedbackEvent.cs
- Assets/Game/Runtime/Gameplay/Questing/QuestFeedbackKind.cs

### Ӱ�췶Χ
- ս�� HUD ����������
- �����ȡ / Ŀ����� / ������ȡ��ʾ��·
- Combat UI Generated / Override �ṹͬ��

### ��֤��ʽ
- ���� dotnet build WCDEL.sln /p:BuildProjectReferences=false
- �����  error���������� 4 �� Physics2D.OverlapCircleNonAlloc ��ʱ����
- ������Ϸ���ȡ�������Ŀ�ꡢ�ύ���񣬹۲��������������·��������Ƿ�˳����ʾ

### ����ע������
- ��ǰ������������ HUD ���������𣬺���������ȫ��������ĵ����ɼ�����ר��������ɽ��������뽱����Ʒͼ���б���
- ��������� NPC �Ի������񵯴�����̨���������ҲҪ��ʾͬ����ʾ������������� GameSession.QuestFeedbackRaised����Ҫ�ٷֲ���ڶ�����ʾϵͳ��
## 2026-05-21 - ��������������ͳһ������·

### �޸�����
- ����һ��ͳһ QuestFeedbackEvent �Ļ����ϣ�Ϊ RewardClaimed �¼�������ʽ��������չʾ��������ֻͣ�������Ͻ�������������
- �� CombatCanvasHudPresenter ������ QuestRewardPopup ������壬����ǿ��������ɺ�Ľ�����ȡʱ�̡�
- �������� QuestFeedback ��Ϊ��������״̬��ʾ���ý�ȡ����Ŀ����ɡ��л�׷�ټ����ߵ͸���չʾ��
- �������������콱ʱͬʱ������������������ʽ�������������ײ��Ը���ͬһ�� GameSession.QuestFeedbackRaised �¼���·��
- ͬ�� UiPrefabFactory �� Combat HUD ���ɽṹ�� presenter �󶨣�ȷ�� Generated / Override �ؽ���ֱ�Ӱ������������ڵ㡣
- ���� quest ����ͬ���ĵ�����¼��ǰ�Ѿ��γɡ����������� + ��ʽ�콱���������������㼶��

### �޸��ļ�
- Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs
- Assets/Game/Editor/UiPrefabFactory.cs
- docs/features/quest_system_ui_editor_full_sync.md

### �����ļ�
- ��

### Ӱ�췶Χ
- ս�� HUD �����콱����
- �����������㼶
- Combat UI Generated / Override �ṹͬ��

### ��֤��ʽ
- ���� dotnet build WCDEL.sln /p:BuildProjectReferences=false
- �����  error���������� 4 �� Physics2D.OverlapCircleNonAlloc ��ʱ����
- ������Ϸ�ύ��������񣬹۲����Ϸ���������н��������Ƿ�Ԥ�ڳ���

### ����ע������
- ��ǰ����������Ϊ�ı����Ȱ汾��������Ҫ��ȫ��������ĵ����ɼ���������ͼ���б���Ʒ����ɫ�������Ʒ��Ŀ�͸�ǿ���볡��Ч��
- ���������������չ��װ�������ߡ����ϵȶ����ͽ���������������õ�ǰ QuestFeedbackEvent ��չ�ֶΣ���Ҫ������������¼����ߡ�
## 2026-05-21 - ������������Ŀ������

### �޸�����
- Ϊ������ϵͳ���� QuestRewardEntry / QuestRewardEntryType���ѽ����ӵ����ı�����Ϊ�ṹ��������Ŀ��
- �� GameSession ���������¼��в��佱����Ŀ���ݣ�Ŀǰ�ȸ��ǽ���뾭�����������������
- �� CombatCanvasHudPresenter ������������������Ϊ��������Ŀ��Ⱦ��������ֻ��ʾһ�л����ı���
- ���������������������䣬���Ľ���������ʹ����Ŀ�б���ʽ��Ϊ������װ�������ߡ����ܽ�����Ԥ���ȶ���ڡ�
- ���� quest ����ͬ���ĵ�����¼������չʾ�ѴӴ��ı���������Ϊ�ṹ����Ŀ�汾��

### �޸��ļ�
- Assets/Game/Runtime/Gameplay/Questing/QuestRewardEntry.cs
- Assets/Game/Runtime/Gameplay/Questing/QuestRewardEntryType.cs
- Assets/Game/Runtime/Gameplay/Questing/QuestFeedbackEvent.cs
- Assets/Game/Runtime/Bootstrap/GameSession.cs
- Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs
- WCDEL.Game.Runtime.csproj
- docs/features/quest_system_ui_editor_full_sync.md

### �����ļ�
- Assets/Game/Runtime/Gameplay/Questing/QuestRewardEntry.cs
- Assets/Game/Runtime/Gameplay/Questing/QuestRewardEntryType.cs

### Ӱ�췶Χ
- �������¼����ݽṹ
- ս�� HUD ���н�������������֯��ʽ
- ����װ�� / ���� / ���ܽ�����չ���

### ��֤��ʽ
- ���� dotnet build WCDEL.sln /p:BuildProjectReferences=false
- �����  error��WCDEL.Game.Runtime / WCDEL.Game.Editor ͨ��������ԭ�� 4 �� Physics2D.OverlapCircleNonAlloc ��ʱ���棬��������� Assembly-CSharp.csproj �� 2 �������� warning
- ������Ϸ�ύ���񣬹۲����������������Ƿ��Է�����Ŀ��ʽ��ʾ����뾭��

### ����ע������
- ��ǰ�����屾����ֻ�� Gold / Exp �ֶΣ�������Ҫ������������������ʾװ�������ߡ�������Ŀ����Ҫ����չ QuestDefinition ����ʽ�������ýṹ��
- �ֽ׶���Ŀ�����ı��У����Ƕ���ͼ����ӣ������һ�������Ż�������ֱ�Ӳ� icon��Ʒ��ɫ����Ŀ�����͹���/�ѵ�����

## 2026-05-21 - С��ͼ����ͼϵͳ MVP

### �޸�����
- ��չ��ͼ����ʱ���ݣ������ѷ�����Ȥ�㡢��ͼ׷��Ŀ����Զ����ǡ�
- ����������ͼ��ѯ�㣬ͳһ������ͼ�߽硢��������������λ��
- ��ս�� HUD �в�������ʱС��ͼ����ʾ��ҡ����񡢴��͡������ͻ������η�����
- ����̨��ͼҳ�Ӵ��ı���������Ϊ���ӵ�ͼ��壬����������׷�١�����׷�ٺͱ�ǲ�����
- �޸� `TeleportPoint2D` ���𻵵��ַ������ݣ��������ͼ��ȡ����ֻ����ڡ�

### �޸��ļ�
- `Assets/Game/Runtime/Core/Data/MapRuntimeData.cs`
- `Assets/Game/Runtime/Bootstrap/GameSession.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldInteractableBase2D.cs`
- `Assets/Game/Runtime/Gameplay/World/TeleportPoint2D.cs`
- `Assets/Game/Runtime/Gameplay/World/RespawnPoint2D.cs`
- `Assets/Game/Runtime/Gameplay/World/RegionTrigger2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CameraBoundsTrigger2D.cs`
- `Assets/Game/Runtime/Gameplay/World/MapPointRegistry2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `WCDEL.Game.Runtime.csproj`

### �����ļ�
- `docs/features/minimap_worldmap_system_sync.md`

### Ӱ�췶Χ
- ս�� HUD
- ��̨�˵���ͼҳ
- ���紫�͵� / ����� / ���򴥷� / �̵� / ����ȵ�ͼ���ӻ����
- ��ͼ����ʱ״̬����ṹ

### ��֤��ʽ
- ���� `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- ȷ�ϱ���ͨ�������������� `Physics2D.OverlapCircleNonAlloc` ��ʱ����
- ����ս��������� HUD С��ͼ�Ƿ���ֲ��浱ǰ��ͼ���ݸ���
- �򿪺�̨�˵���ͼҳ����ͼ��塢ͼ���ͻ�����ť�Ƿ�ɼ�

### ����ע������
- ��̨��ͼҳ�½ṹ��ǰ��Ҫ������ʱ���룬�������ͬ�������� prefab / override ��·��
- ��ͼҳ��ק�����š�ɸѡ������������ʽ���ͽ�������������ꡣ

## 2026-05-21 - С��ͼ����ͼ prefab ������·ͬ��

### �޸�����
- ��ս�� HUD С��ͼ�ṹ��ʽͬ���� `UiPrefabFactory` ���� prefab��
- ����̨ `MapPage` ��ʽ����Ϊ����ͼ�ӿڡ�ͼ�㡢�����Ϣ���ͻ���������ť�����ɽṹ��
- ���� combat HUD �� backend menu presenter �ĵ�ͼ������л��󶨡�
- ��������ʱ���޸��߼������ݾ� prefab / override δ�ؽ��ĳ�����

### �޸��ļ�
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/features/minimap_worldmap_system_sync.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- Generated UI prefabs
- Overrides �̳нṹͬ��
- Combat HUD ���̨��ͼҳ�ĳ���ά����·

### ��֤��ʽ
- ���� `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- ���� `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- ȷ�� editor / runtime ��Ϊ 0 error

### ����ע������
- ������ Unity ��ִ��һ�� backend / combat ��� generated prefab rebuild����������� overrides �Ƿ���ȷ�̳��µ�ͼ�ڵ㡣
- ���������������ͼҳ��ק���ź͵�λ������飬����ֱ�Ӹ����� prefab �� override��������ֻ������ʱ���ڵ㡣

## 2026-05-21 - С��ͼ����ͼ������·�����޸�

### �޸�����
- ȥ�� `UiPrefabFactory` �����ɺ�̨��ͼҳʱ�� `BackendMapInputProxy` �ı༭����ǿ���������� generated prefab �����׶��ٴο�ס Editor ���롣
- ��չ `BackendMenuCanvasPresenter` �ĵ�ͼҳ����ʱ���޸��߼������� Prefab / Override ���� `MapViewport` ��ȱ�����������ͼ����߽ڵ�ʱ������ʱ���Զ����벢���°󶨡�
- �����ͼ����ͬ���ĵ�����ȷ generated prefab �� runtime self-heal ��ְ��߽硣

### �޸��ļ�
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `docs/features/minimap_worldmap_system_sync.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ��̨��ͼҳ Generated UI ������·
- �� Backend Map Override ������ʱ������
- �༭�� / ����ʱ���򼯱����ȶ���

### ��֤��ʽ
- ���� `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- ���� `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- �����Editor 0 error��Runtime 0 error������������ 4 �� `Physics2D.OverlapCircleNonAlloc` ��ʱ����

### ����ע������
- ���ڼ�ʹ�� Override ûͬ�������µ�ͼ�ڵ㣬����ʱҲ���ȶ��ײ��룻��Ϊ�˳���ά�����Խ����� Unity ���ؽ�һ�� Backend generated prefab ������Ӧ Override �̳��Ƿ�������
- �������������չ��ͼҳ����������ͬʱ�� generated prefab �ṹ�� presenter �󶨣���Ҫֻ��������ʱ���ڵ㡣

## 2026-05-21 - С��ͼ����ͼ������ǿ

### �޸�����
- Ϊ��̨��ͼҳ�����ӿ����ļн��߼�����ק�͹�������ʱ���ٰѵ�ͼ�����Ƴ�����߽硣
- ��ͼҳ���ڻỺ������߽���գ��������Ż��ѡ���Զ�����У������λ�á�
- �����ͼ��λʱ��ѡ�иõ㡢����׷��Ŀ�ꡢ����ͼ�۽����õ㣬�����Ҳ���������ʾѡ�е����顣
- ����հ׵�ͼ����ʱ����յ�ǰѡ�е㣬���ָ��Ҳ�Ľ��յ�ͼ�����ı���
- �����ͼ����ͬ���ĵ�����¼�µĽ�����Ϊ�뵱ǰδ��ɱ߽硣

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `docs/features/minimap_worldmap_system_sync.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ��̨��ͼҳ��ק / ���Ž���
- ��ͼ��λѡ����׷������
- �Ҳ��ͼ������չʾ�߼�

### ��֤��ʽ
- ���� `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- ���� `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- �����Runtime / Editor �� 0 error��Runtime �������� 4 �� `Physics2D.OverlapCircleNonAlloc` ��ʱ����

### ����ע������
- ��ǰ��λ�������������ı���������ʽͼ�꿨Ƭ�������ɼ���������ͼ�ꡢ״̬ɫ�Ϳɴ���/���ɴ��Ͱ�ť̬��
- Ŀǰ��ͼҳ��û�з���ɸѡ�͵�������߼�������������ʱ������������ `MapPointSnapshot` ���Ҳ�������������չ��

## 2026-05-21 - С��ͼ����ͼɸѡ������ǿ

### �޸�����
- Ϊ��̨��ͼҳ��������ɸѡ��ť��֧�ְ�ȫ�������񡢴���/�����̵�/����塢����/��Ƿ�����˵�λ��ʾ��
- Ϊ��̨��ͼ�������������Ĳ���״̬�ı�����������ʾ��ǰɸѡ״̬��ѡ��״̬�Ͳ�����ʾ��
- ����ͼɸѡ�����״̬ͬ����������ʱ���޸��߼���ȷ���� Prefab / Override ȱ�ٽڵ�ʱ�Կ��Զ����롣
- ������ɸѡ��ť��״̬�ı�ͬ���� `UiPrefabFactory` �� generated prefab �ṹ�� presenter ����·��

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/features/minimap_worldmap_system_sync.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ��̨��ͼҳ��������
- ��ͼ��λɸѡ���ӻ�
- Generated UI �� Override �̳нṹ

### ��֤��ʽ
- ���� `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- ���� `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- �����Runtime / Editor �� 0 error��Runtime �������� 4 �� `Physics2D.OverlapCircleNonAlloc` ��ʱ����

### ����ע������
- ��ǰɸѡ���ǵ�ѡ������ˣ����Ƕ�ѡͼ��ϵͳ��������������ͼ��ʽ�棬������������� Toggle ���ͼ��ɸѡ��塣
- ��ǰ�Ҳ����״̬���Ѳ�ֳ���������λ���������ı�Ϊ�����������Լ�����ͼ�ꡢ��ť̬����ʽ������ڡ�

## 2026-05-21 - 伤害跳字显示链路修复

### 修改内容
- 修复伤害跳字只依�?`BroadcastMessage` 和世�?`TextMesh` 导致实战中不显示的问题�?
- `DamageNumberEmitter` 现在直接订阅 `Health.FeedbackRaised`，并保留旧世界跳字作为兜底显示�?
- 新增屏幕空间 `DamageNumberOverlayPresenter`，使�?Overlay Canvas 池化显示伤害、治疗、护盾、免疫、抵抗、暴击、穿甲、弱点、斩杀和元素跳字�?
- 修复战斗场景主相�?`z=0` 导致 2D 世界对象�?Near Clip Plane 裁掉的问题，并在运行时布局和编辑器搭建入口中固�?2D 相机深度�?
- 场景自动搭建现在会显式生�?`DamageNumberOverlay`，方便后续在 Unity 内检查和调参�?

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberEmitter.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberOverlayPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberOverlayPresenter.cs.meta`
- `Assets/Game/Runtime/Gameplay/World/CameraFollow2D.cs`
- `Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `Assets/Game/Scenes/Sandbox_Combat.unity`
- `WCDEL.Game.Runtime.csproj`

### 新增文件
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberOverlayPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberOverlayPresenter.cs.meta`

### 影响范围
- 战斗伤害跳字显示
- 治疗、护盾吸收、免疫、抵抗、Miss 等生命反馈文字显�?
- 战斗场景主相机深度和裁剪稳定�?
- Foundation 自动搭建战斗场景链路

### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- 运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- 结果：Runtime / Editor �?0 error；Runtime 仅保留既�?4 �?`Physics2D.OverlapCircleNonAlloc` 过时警告

### 后续注意事项
- 现在跳字主路径是屏幕 Overlay，正常不再受相机 Near Clip Plane、世界层级排序或 TextMesh 裁剪影响�?
- 如果后续要做正式美术版跳字，可以继续�?`DamageNumberOverlayPresenter` 内替换字体、描边、图标和动画参数，不需要改伤害计算链路�?

## 2026-05-21 - 碰撞与震屏反馈完整优�?
### 修改内容
- 修复单位普通移动互相挤飞的问题：单位间物理碰撞继续忽略，但软碰撞只做每帧微量位置解重叠，不再向刚体速度叠加推力�?- 保留技能伤害链路中的击退/击飞入口，霸体、无敌、不可打断状态仍会阻�?`KnockbackReceiver2D` 执行击退�?- 扩展相机震屏控制器，支持方向模式、衰减模式、优先级、叠加模式、最大偏移、频率和旋转震动�?- 按震屏设计文档重做普通命中、暴击、穿甲、弱点、斩杀、玩家轻/重受击、击�?倒地、绝技、Boss 蓄力�?Boss 爆发的震屏预设�?- 震屏叠加现在最多保留两个来源，弱小低优先级震屏会被忽略，Boss/绝技可覆盖普通命中震屏�?
### 修改文件
- `Assets/Game/Runtime/Gameplay/Combat/UnitBodyCollisionFilter2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CameraShakeController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatCameraFeedbackController2D.cs`
- `docs/features/screen_shake_camera_feedback_sync.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- �?
### 影响范围
- 玩家、敌人、假人的单位间普通移动碰撞表�?- 技能击退/击飞与霸体免疫规则的边界
- 战斗命中、受击、Boss 技能、绝技的屏幕反馈表�?- 无障�?降低动态效果设置下的震屏强度缩�?
### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- 运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- 结果：Runtime / Editor �?0 error；Runtime 保留既有 4 �?`Physics2D.OverlapCircleNonAlloc` 过时 warning，以及此前任�?UI 未完成字段的 unused warning�?
### 后续注意事项
- 如果 Unity 场景中已有对象序列化了旧�?`_maxSeparationSpeed` 字段，需要在 Inspector 检�?`UnitBodyCollisionFilter2D` 的新 `Max Separation Distance Per Frame`，推荐保�?0.03 �?0.06�?- 后续若增加正式技能配置表，可把当前硬编码震屏预设迁移�?ScriptableObject �?CSV 配置，不需要再重写相机反馈入口�?

## 2026-05-21 - 后台任务界面补完

### 修改内容
- 将后台任务页从纯文本 MVP 升级为结构化界面：左侧筛选与任务列表，右侧任务详情与操作按钮�?- 接入全部 / 进行�?/ 可接 / 已完成筛选，支持点击任务列表切换详情�?- 接入追踪、接取、领奖按钮，并复�?`GameSession` 的任务追踪、接取和完成奖励链路�?- 为旧 Backend UI Prefab / Overrides 增加运行时自修复：缺少结构化任务页节点时自动创建，避免旧覆盖 UI 直接空白或只显示旧文本�?- 同步 `UiPrefabFactory`，后续一键生�?Backend UI 时会直接生成完整任务页结构�?- 修正任务展示 helper 的中文分类、状态、目标、进度等标签，避免任务界面继续显示乱码�?
### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Gameplay/Questing/QuestPresentationHelper.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/features/quest_system_ui_editor_full_sync.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- �?
### 影响范围
- 后台任务页显示和交互
- Backend UI Generated Prefab / Override 兼容链路
- 任务分类、状态、目标类型等中文显示
- 任务追踪、接取、领奖的后台菜单入口

### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- 运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- 结果：Runtime 0 error，保留既�?4 �?`Physics2D.OverlapCircleNonAlloc` 过时 warning；Editor 0 warning / 0 error�?
### 后续注意事项
- 当前任务页已经具备可交互 MVP，但还没有正式图标奖励列表、任务链路时间线、放弃任务、任务详情富文本和滚动列表虚拟化�?- 建议后续�?Unity 内重建一�?Backend Generated UI，并检查对�?Overrides 是否继承到了新的 QuestLayoutRoot�?
## 2026-05-21 - 界面与工具默认中文化补完

### 修改内容
- 清理主菜单中仍会直接显示给玩家的英文默认文案，统一改为中文回退文本�?
- 清理调试战斗 HUD 中的英文状态标签，统一改为中文显示�?
- 清理编辑器界面工具菜单、弹窗标题、提示文案中的英文名称，统一改为中文入口说明�?
- 保留内部资源路径、节点名和代码键值不变，只调整用户可见文案，避免影响现有架构和引用链路�?

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/MainMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/PrototypeHudPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- �?

### 影响范围
- 主菜单标题页、主页、存档页、设置页、退出确认页的中文默认显�?
- Prototype 调试 HUD 的中文信息显�?
- Unity 编辑器内 WCDEL 界面工具菜单与弹窗提�?

### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- 运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- 结果：Runtime 0 error，保留既�?4 �?`Physics2D.OverlapCircleNonAlloc` 过时 warning；Editor 0 warning / 0 error

### 后续注意事项
- 以后新增玩家可见界面、后台工具入口和生成器弹窗时，默认文案统一先写中文，避免再出现英文回退文本�?
- 当前只清理了本轮定位到的主菜单、调�?HUD 与常用编辑器工具入口；后续若继续扩展新页面，也应沿用同一中文默认策略�?
## 2026-05-21 - 背包与技能界面布局优化

### 修改内容
- 优化后台背包页布局：左侧角色装备区缩窄并稳定占位，右侧拆成物品网格、详情面板和底部操作栏，减少详情浮层与物品格互相挤压�?
- 优化后台技能页布局：降低底部已装备技能栏高度，扩大主体内容区，调整技能树、技能背包和技能详情面板比例�?
- 为运行时增加背包页和技能页的轻量布局校正，旧 Overrides 在进入游戏后也会按新比例修正关键锚点、尺寸和网格参数�?
- 同步更新 UI 预制体生成器默认布局，后续重新生�?Generated 或同�?Overrides 时会继承新的布局规则�?

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `docs/05_TASK_LOG.md`

### 新增文件
- �?

### 影响范围
- 后台菜单背包页布局、物品网格、详情面板和操作栏显�?
- 后台菜单技能页布局、技能树、技能背包、详情面板和底部技能配置栏显示
- Generated / Overrides UI 预制体后续生成与运行时兼容显�?

### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- 运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- 结果：Runtime 0 error，保留既�?4 �?`Physics2D.OverlapCircleNonAlloc` 过时 warning；Editor 0 warning / 0 error

### 后续注意事项
- 这次主要优化布局比例和旧覆盖体兼容，正式美术图框、滚动列表虚拟化、拖拽排序、技能树连线仍可继续细化�?
- 如果后续�?Unity 中手�?Overrides，建议继续只�?`Assets/Game/UI/Prefabs/Overrides` 下对应页面；生成器的默认结构已经同步为新的布局基线�?
## 2026-05-21 - CatQuest3 式曲面地形与镜头 MVP

### 修改内容
- �?`Docs/catquest3_style_curved_terrain_camera_design.md` 落地第一版“逻辑平面 + 曲面视觉层”方案�?- 新增曲面世界投影器、视觉锚点和曲面地形网格，保持移动、碰撞、技能、小地图和大地图继续使用平面逻辑坐标�?- 更新战斗场景运行时自修复：进�?`Sandbox_Combat` 时自动创建曲面视觉根、海�?陆地/远景雾曲面网格，并给现有 `Visual` 子节点挂曲面锚点�?- 更新编辑器一键搭建链路，确保重建战斗场景时也会同步曲面视觉层和相机焦点配置�?- 更新跳字、单位头�?HUD、世界空间条、任务世界标记的显示位置，使其跟随曲面视觉投影�?
### 修改文件
- `Assets/Game/Runtime/Gameplay/World/CameraFollow2D.cs`
- `Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs`
- `Assets/Game/Runtime/Gameplay/UI/WorldSpaceBarFollower.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberEmitter.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Runtime/Gameplay/Questing/QuestTargetLocator.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `WCDEL.Game.Runtime.csproj`

### 新增文件
- `Assets/Game/Runtime/Gameplay/World/CurvedWorldProjector2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CurvedWorldAnchor2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CurvedTerrainMesh2D.cs`
- `docs/features/catquest3_style_curved_terrain_camera_sync.md`

### 影响范围
- 战斗场景地形视觉、角�?怪物/交互物视觉锚点、镜头跟随焦点和远方地图展开观感�?- 世界空间反馈显示位置，包括跳字、头�?HUD、任务标记和世界条�?- 不影响平面移动、碰撞、寻路、技能范围、小地图和大地图逻辑�?
### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`，结�?0 error，保留既�?4 �?`Physics2D.OverlapCircleNonAlloc` 过时 warning�?- 运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`，结�?0 warning / 0 error�?
### 后续注意事项
- 当前曲面地形网格�?MVP 级视觉层，后续可替换�?Chunk 贴图烘焙�?Shader 弯曲方案�?- 地面技能预警圈、范�?Decal、任务光柱后续应升级为采样曲�?Mesh，逻辑判定仍保持平面�?- 如果 Unity 中手动重建战斗场景，建议使用 Foundation 的战斗场景搭建入口，确保曲面视觉层同步生成�?

## 2026-05-21 - 命中反馈、HitStop 与血�?HUD 修复

### 修改内容
- 根据 `Docs/hit_impact_feedback_system_design.md` 增加统一命中反馈等级解析，覆盖普通命中、重击、暴击、穿甲、弱点、破防、击飞、击倒、斩杀和绝技命中�?- 修正 HitStop 链路：全局时停增加最大时长、慢动作上限和冷却；普通命中改为局部暂停攻击�?受击者动画与速度，避免整场景被连续命中卡死�?- 新增受击闪白与轻微受击抖动组件，并让旧场景单位在 `CombatFeedbackBroadcaster` 启动时自动补齐�?- 强化血�?HUD 和伤害跳字联动：同一命中等级驱动血条闪�?震动、跳字缩�?停留/抖动�?- 优化受击/碰撞规则：显式击倒优先进入倒地起身流程；Boss 只接受破防级及以上击退，霸�?无敌继续免疫击退和打断�?- 更新 Foundation 场景生成链路，确保玩家、训练桩、近战敌人、远程敌人、飞行敌人自动挂载命中反馈组件�?
### 修改文件
- `Assets/Game/Runtime/Gameplay/Combat/HitStopController.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatFeedbackBroadcaster.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatCameraFeedbackController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/KnockbackReceiver2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/TrainingDummy.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerHitReactionController.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatWorldSpaceBar2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberEmitter.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `WCDEL.Game.Runtime.csproj`
- `docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/Combat/HitImpactFeedbackResolver.cs`
- `Assets/Game/Runtime/Gameplay/Combat/HitFlashController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/HitImpactLocalPauseController2D.cs`
- `docs/features/hit_impact_feedback_system_sync.md`

### 影响范围
- 战斗命中手感、受击闪白、卡肉顿帧、击退/击飞/倒地规则、Boss 受击规则�?- 单位头顶 HUD 血条即时层/延迟层视觉反馈，以及伤害跳字的大小、颜色、抖动与停留时间�?- 一键生成或刷新战斗场景时的玩家、敌人、训练桩组件配置�?
### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- 运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- 结果：Runtime 0 error，保留既�?4 �?`Physics2D.OverlapCircleNonAlloc` 过时 warning；Editor 0 warning / 0 error�?
### 后续注意事项
- 当前 VFX/SFX 仍是轻量占位表现，后续如果接入正式命中特效和音效，应继续�?`HitImpactFeedbackResolver` 的等级结果取规则，避免各系统重复判断�?- 如果需要严格的“只暂停攻击者和所有命中目标动画，不暂�?Rigidbody”，可以在此基础上继续细化局部暂停组件的目标列表和动画驱动接口�?

## 2026-05-21 - 曲面地形与镜头链路修�?
### 修改内容
- 排查并修�?`Sandbox_Combat` 中“大地图与镜头跟随看起来未生效”的问题�?- 修正相机区域链路：出生区与中段区不再覆盖战斗场景默认的大地图镜头参数；离开区域时会重新判定当前应使用的相机配置，避免镜头卡在旧的小边界里�?- 修正运行时地形布局：放大地形区块时，不再只修改 `BoxCollider2D`，也同步刷新对应 `Visual` �?`SpriteRenderer.size`，确保游戏里真正看到更大的区域视觉�?- 更新曲面地形/镜头同步文档，记录这次失效原因与修复策略�?
### 修改文件
- `Assets/Game/Runtime/Gameplay/World/CameraBoundsTrigger2D.cs`
- `Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs`
- `docs/features/catquest3_style_curved_terrain_camera_sync.md`
- `docs/05_TASK_LOG.md`

### 新增文件
- �?
### 影响范围
- `Sandbox_Combat` 的默认镜头跟随、区域镜头切换与区域退出恢复�?- 战斗场景中草地、平地、水域、沼泽等区域的可视尺寸与逻辑尺寸一致性�?- 旧战斗场景在运行时自修复时的曲面地图和镜头效果�?
### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- 顺序运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- 结果：Runtime 0 error，保留既�?4 �?`Physics2D.OverlapCircleNonAlloc` 过时 warning；Editor 预计应为 0 warning / 0 error�?
### 后续注意事项
- 当前 Boss 区域仍保留独立镜头配置；如果后续要做大型 Boss 房镜头演出，可以继续�?`CameraBoundsTrigger2D` 的“最小区域优先”规则上叠加优先级字段�?- 如果重新生成或重构战斗场景，建议继续让默认全局相机配置保持为大地图，再只给少数特殊区域单独收束镜头�?

## 2026-05-21 - 猫咪斗恶龙式 2.5D 地形与镜头方向修�?
### 修改内容
- 将战斗场景展示方向从“曲面假透视 2D”继续收口为“固定斜相机 + 平面逻辑 + 2.5D 呈现�?- 为世界展示层新增统一高度接口，打通玩家跳跃、飞行敌人悬浮与世界空间反馈的展示高度链�?- 更新 `CurvedWorldProjector2D`、`CameraFollow2D`、`CurvedWorldAnchor2D`，让逻辑平面坐标映射�?2.5D 呈现坐标，并支持地面平铺/直立两类锚点
- 修正 `SandboxCombatSceneLayout` 运行时自修复逻辑，确保旧场景中的锚点和相机配置也会被刷新为新�?2.5D 规则
- 修正 `FoundationAssetUtility` 一键生成链路，避免后续重建场景时回退到旧的曲面假透视配置
- 更新伤害跳字、单位头�?HUD、世界空间条跟随等组件，使其读取统一展示高度而不是各自使用假本地 Y 偏移
- 更新同步文档，明确当前方向已切换为真�?2.5D 呈现方案

### 修改文件
- `Assets/Game/Runtime/Gameplay/World/CurvedWorldProjector2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CurvedWorldAnchor2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CameraFollow2D.cs`
- `Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerJumpController.cs`
- `Assets/Game/Runtime/Gameplay/Combat/FlyingEnemyPresentation2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberEmitter.cs`
- `Assets/Game/Runtime/Gameplay/UI/WorldSpaceBarFollower.cs`
- `Assets/Game/Runtime/Gameplay/Questing/QuestTargetLocator.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `WCDEL.Game.Runtime.csproj`
- `docs/features/catquest3_style_curved_terrain_camera_sync.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/World/IWorldPresentationHeightProvider.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldPresentationHeightUtility.cs`

### 影响范围
- `Sandbox_Combat` 的镜头跟随与默认展示结构
- 玩家跳跃与飞行敌人的展示高度
- 地形区块/区域触发器的 2.5D 地面呈现方式
- 世界空间 HUD、跳字与跟随条的位置计算
- 后续编辑器一键生�?重建战斗场景的默�?2.5D 输出

### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- 运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- 结果：Runtime 0 error，保留既�?4 �?`Physics2D.OverlapCircleNonAlloc` 过时 warning；Editor 0 warning / 0 error

### 后续注意事项
- 当前地形仍是原型�?floor mesh + placeholder zone visual 组合，还不是最终美术化 3D/2.5D 地面资源
- 任务目标、技能预警圈、地面红圈等还需要继续按 2.5D 地面投影规则细化
- 这次已完成代码链路修正，但仍建议进入 Unity 实际运行 `Sandbox_Combat` 目视确认镜头、天空可见性、跳跃高度和地面贴合表现

### 增量更新
- 根据后续确认，将 2.5D 呈现语义继续修正为：单位在地�?`X/Z` 平面移动，`Y` 只表示跳�?飞行/真实高差，不再允许地形默认整体向 `Y` 方向倾斜抬升
- 将战斗场景与编辑器生成链的默认镜头切换为固定斜向 `Perspective` 跟随模式
- 修正 planar 2.5D 下的锚点偏移基准，避免角色移动时继续出现�?`Y` 轴漂移的错误表现
- 调整原型地形 mesh，使其默认保持平面，只在显式配置时才使用高度�?
## 2026-05-22 - 2.5D地面投影与相机配置链路收�?
### 修改内容
- 补齐 2.5D 表现层链路，把敌人预警圈、任务目标光柱、临时技能地面圈统一接入贴地投影语义�?- 新增 `QuestGroundMarker2D` �?`SkillGroundIndicator2D`，让任务目标与玩家范围技能预览都能走真正的地面投影表现�?- 新增并接�?`UnitPresentationRoot2D` 统一节点结构，明�?`Visual`、`UiAnchor`、`GroundAnchor` 三类表现锚点�?- 调整 `EnemyAttackWarningView`、`FlyingEnemyPresentation2D`、`InteractionPromptAnchor`，使其优先使用新�?2.5D 表现锚点与投影高度�?- 让运行时 `SandboxCombatSceneLayout` 与编辑器 `FoundationAssetUtility` 都改为从场景�?`WorldPresentationSettings25D` 读取相机偏移、旋转、FOV、前视与焦点配置�?- 将新增运行时组件补入 `WCDEL.Game.Runtime.csproj`，并修正编辑器侧世界表现配置读取方式，恢复编辑器构建�?
### 修改文件
- `Assets/Game/Runtime/Gameplay/World/CameraFollow2D.cs`
- `Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs`
- `Assets/Game/Runtime/Gameplay/World/InteractionPromptAnchor.cs`
- `Assets/Game/Runtime/Gameplay/World/QuestGroundMarker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/SkillGroundIndicator2D.cs`
- `Assets/Game/Runtime/Gameplay/World/GroundProjectedDecal2D.cs`
- `Assets/Game/Runtime/Gameplay/World/UnitPresentationRoot2D.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldPresentationSettings25D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/EnemyAttackWarningView.cs`
- `Assets/Game/Runtime/Gameplay/Combat/FlyingEnemyPresentation2D.cs`
- `Assets/Game/Runtime/Gameplay/Questing/QuestTargetLocator.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `WCDEL.Game.Runtime.csproj`
- `docs/features/catquest3_style_curved_terrain_camera_sync.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/World/QuestGroundMarker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/SkillGroundIndicator2D.cs`

### 影响范围
- Sandbox 战斗场景 2.5D 地面投影表现
- 玩家与敌人的统一表现根节点结�?- 任务目标世界标记与敌人预警圈表现
- 场景级相机初始偏移、旋转、FOV 配置链路
- 编辑器一键生�?修复场景流程

### 验证方式
- `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前技能地面圈仍是临时调试级贴地图形，后续可以替换为正�?decal mesh / shader 版本�?- 任务光柱与预警圈已经统一到贴地语义，但部分剩余世界提示仍可继续迁移到同一表现层�?- 若需�?Unity 中手调相机，请优先修改场景内 `WorldPresentationSettings25D`，不要再依赖旧的硬编码默认值�?

### 增量更新 - 关键交互POI统一贴地标记
- 新增 `WorldPoiGroundMarker2D`，为传送点、复活点、任务板、商店、神龛、Boss 门提供统一�?2.5D 贴地圈表现�?- 将上述关键交互点的运行时组件接入 `UnitPresentationRoot2D`，即使旧场景未完全重建，也能自动补齐统一表现根节点与地面标记�?- 补充 `FoundationAssetUtility` 生成链路，让一键生�?修复场景时也会为关键交互点补齐新的表现根节点�?- 更新 2.5D 功能文档，记�?POI 标记链路已并入整体投影体系�?
## 2026-05-22 - 2.5D地面指示正式化与剩余世界提示统一

### 修改内容
- 将临�?`SpriteRenderer + WarningCircleSprite` 贴地圈升级为统一的程序化 mesh + shader 地面投影表现�?- 重构 `GroundProjectedDecal2D`，改为运行时生成环形网格并驱�?`WCDEL/ProjectedGroundMarker25D` 透明标记 shader�?- 新增 `WorldProjectedMarker2D`，统一承载贴地环、任�?地图光柱、POI 柱状提示�?2.5D 世界标记表现�?- 将敌人预警圈、玩家范围技能圈、任务目标圈、关�?POI 圈切换到新的正式地面投影链路�?- 新增 `MapTrackedTargetGroundMarker2D`，让地图追踪目标在世界内也有统一的贴地提示�?- 新增 `InteractionGroundPrompt2D`，让当前可交互目标在世界内出现统一的贴地提示�?- 更新 `CombatCanvasHudPresenter` �?`FoundationAssetUtility`，确保上述标记在运行时和一键生成链路中都会自动挂载生效�?- 更新 2.5D 功能同步文档，记录这次从临时投影圈到正式地面标记系统的升级�?
### 修改文件
- `Assets/Game/Runtime/Gameplay/World/GroundProjectedDecal2D.cs`
- `Assets/Game/Runtime/Gameplay/World/QuestGroundMarker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/SkillGroundIndicator2D.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldPoiGroundMarker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldProjectedMarker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/MapTrackedTargetGroundMarker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/InteractionGroundPrompt2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/EnemyAttackWarningView.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `WCDEL.Game.Runtime.csproj`
- `docs/features/catquest3_style_curved_terrain_camera_sync.md`

### 新增文件
- `Assets/Game/Art/Shaders/SH_ProjectedGroundMarker25D.shader`
- `Assets/Game/Runtime/Gameplay/World/WorldProjectedMarker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/MapTrackedTargetGroundMarker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/InteractionGroundPrompt2D.cs`

### 影响范围
- Sandbox 战斗场景中的技能圈、预警圈、任务圈、POI圈表�?- 世界内地图追踪点与交互目标提�?- 2.5D 地面投影标记的统一风格与后续扩展入�?- 编辑器一键生�?修复场景链路

### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- 运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- 结果：Runtime 0 error，保留既�?4 �?`Physics2D.OverlapCircleNonAlloc` 过时 warning；Editor 0 warning / 0 error

### 后续注意事项
- 目前世界内文字提示仍主要依赖现有 HUD / Overlay，已经先把地面语义统一；后续可以继续把文字牌、图标牌也并入这�?mesh/shader 风格�?- 当前 shader 为轻量透明标记版，后续若接入正式美术资源，可在不改调用链的情况下继续替换材质、贴图和更复杂的特效参数�?
## 2026-05-22 - 2.5D世界提示标签统一

### 修改内容
- 新增 `ProjectedWorldLabelUi`，把任务目标、地图追踪、交互提示的在屏世界标签统一到同一�?2.5D 投影屏幕卡片逻辑�?- 新增 `MapTrackedTargetLocator2D`，补齐地图追踪目标对 `quest:*`、`teleport:*`、`region:*`、`shop:*`、`questboard:*`、`chest:*`、`custom:*` 等前缀 ID 的解析能力�?- 更新 `MapTrackedTargetGroundMarker2D`，复用新的追踪目标定位器，避免旧追踪 ID 规则导致地面追踪提示失效�?- 更新 `CombatCanvasHudPresenter`，在现有离屏箭头保留的前提下，为任务目标、地图追踪、交互目标补上统一�?projected world label 节点和刷新逻辑�?- 同步 2.5D 地形与镜头功能文档，记录剩余世界提示已进一步并入统一投影体系�?
### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Runtime/Gameplay/World/MapTrackedTargetGroundMarker2D.cs`
- `WCDEL.Game.Runtime.csproj`
- `docs/features/catquest3_style_curved_terrain_camera_sync.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/UI/ProjectedWorldLabelUi.cs`
- `Assets/Game/Runtime/Gameplay/World/MapTrackedTargetLocator2D.cs`

### 影响范围
- 战斗 HUD 世界目标提示
- 地图追踪目标定位与显�?- 场景交互提示�?2.5D 表现一致�?
### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- 运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 旧的 `QuestWorldMarker` 相关字段仍在 `CombatCanvasHudPresenter` 中保留兼容引用，后续确认 Unity 预制体和运行时表现稳定后可继续清理�?- 当前仍保留任务离屏箭头的旧屏幕边缘提示逻辑，这是刻意保留的方向引导层，不应与新�?on-screen projected label 混淆�?
## 2026-05-22 - Physics2D OverlapCircle API 升级

### 修改内容
- �?4 �?`Physics2D.OverlapCircleNonAlloc` 过时调用升级�?`ContactFilter2D + Physics2D.OverlapCircle(...)`�?- 保持原有半径、LayerMask、深度范围和触发器查询语义，避免影响近战命中、AOE 命中、投射物命中和交互检测结果�?- 编译确认 runtime / editor 工程都已无警告无错误�?
### 修改文件
- `Assets/Game/Runtime/Gameplay/World/PlayerInteractionSensor.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`

### 新增文件
- �?
### 影响范围
- 玩家交互检�?- 投射物命中检�?- 近战命中检�?- 范围技能命中检�?
### 验证方式
- 运行 `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- 运行 `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 这次�?API 升级，不是判定逻辑重写；如果后续在 Unity 场景里发现个别命中边界差异，再针对具体发射器或交互体单独微调�?

## 2026-05-22 - ��Ʒװ�����ñ༭�� MVP

### �޸�����
- ������ EquipmentDefinition �� InventoryItemDefinition �ܹ�����������չ������װ�������ߡ����ϡ�������Ʒ������������Ļ��������ֶΡ�
- ������������Ʒ����ģ�ͣ������̵ꡢ���䡢�������á�װ������Ч������װЧ����ǿ�����á���ƷЧ����Ŀ�ȿɱ༭���ݡ�
- �������� ItemConfigEditorWindow��֧��ͳһ�����ɸѡ�����������ơ��༭װ������Ʒ�����ʲ���
- ���� ItemConfigValidator��Ϊװ������Ʒ�ṩ���� ID���۸񡢶ѵ��������顢Ч����Ŀ��У�����
- ���乤���ļ�������ڣ�ȷ����������ʱ�ͱ༭���ļ��ܱ���ǰ�ֿ�� .csproj ��ʽ�����б���ȷ��¼��

### �޸��ļ�
- Assets/Game/Runtime/Core/Definitions/GameEnums.cs
- Assets/Game/Runtime/Core/Definitions/EquipmentDefinition.cs
- Assets/Game/Runtime/Core/Definitions/InventoryItemDefinition.cs
- WCDEL.Game.Runtime.csproj
- WCDEL.Game.Editor.csproj
- docs/05_TASK_LOG.md

### �����ļ�
- Assets/Game/Runtime/Core/Definitions/ItemConfigModels.cs
- Assets/Game/Editor/ItemConfigEditorWindow.cs
- Assets/Game/Editor/ItemConfigValidator.cs

### Ӱ�췶Χ
- ��Ʒ��װ�������ʲ��ṹ
- Unity �༭���µ���Ʒ��װ�����ù�����
- �����̵ꡢ���䡢���񡢱������������ϵͳ��������չ����
- ��ǰ�ֿ������ʱ / �༭�� C# ���̱���

### ��֤��ʽ
- ���� dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj
- ���� dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj
- �����Runtime 0 warning / 0 error��Editor 0 warning / 0 error

### ����ע������
- ����ȱ�����������ʱ���ѵ���ݣ�û��ǿ�а��̵ꡢ���䡢����չʾȫ���е����ֶΣ���һ�����԰�ģ���𲽽��������۸�Ч�������ù�ϵ��
- ��ǰ�༭���� MVP �汾���Ѿ���ͳһ�����ͱ༭�ʲ����������Ҫ������ǿ���ɲ����������뵼�������÷��顢����ݸ����ɺ͸�ϸ�ķ�������

## 2026-05-22 - ��Ʒװ����������ʱ���߲���

### �޸�����
- ����������ʱչʾ����������Ʒ�ֶΣ����뼼���顢���ҡ�Կ�ס�������������з���ҳ�еĿɼ���������չʾ��
- ��չ���������߼������������ֶο��ƿ�ʹ�á��ɳ��ۡ��ɶ���������������֧�ּ�����ѧϰ�������ƷЧ����Ч��
- ��չ ShopInteractable2D��֧��װ����ͨ����Ʒ��Ʒ�������ù���۽��㣬��ͳһΪ���Ĺ�����ʾ��
- ��չ RewardChestInteractable2D��֧��ֱ�ӷ���ͨ����Ʒ�����������½�������İ���
- ���� QuestTargetLocator���ù�����Ʒ��������ܶ�λװ���̵꣬Ҳ�ܶ�λͨ����Ʒ�̵ꡣ
- ��������ʱ������Ʒ������������ݣ����·���͹����ڵ�ǰ������Ƭ�о�����֤��

### �޸��ļ�
- Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs
- Assets/Game/Runtime/Gameplay/World/ShopInteractable2D.cs
- Assets/Game/Runtime/Gameplay/World/RewardChestInteractable2D.cs
- Assets/Game/Runtime/Gameplay/Questing/QuestTargetLocator.cs
- Assets/Game/Editor/FoundationAssetUtility.cs
- docs/05_TASK_LOG.md

### �����ļ�
- ��

### Ӱ�췶Χ
- ����������Ʒ����������ջ�
- �̵깺���߼�
- ���佱�������߼�
- ����������λ
- ��һ�²�����Ƭ��������

### ��֤��ʽ
- ���� dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj
- ���� dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj
- �����Runtime 0 warning / 0 error��Editor 0 warning / 0 error

### ����ע������
- ��ǰ����ҳ�İ�ť���������þɵ� ���� / ���� / ���� �����������ΰѼ����鲢��������ͼ���ѻ���/Կ��/������߲��������ͼ���������Ҫ��ȫ��������ĵ��������������ʽ��������ɸѡ��塣
- ��ǰ��ƷЧ��ִ���Ƚ����˻ظ���ѧ���ܡ��ӽ���������Ч�����������Լ����� Buff�����͡���������ȸ�������Ч�����ͽӵ�ͬһ��ڡ�

## 2026-05-22 - ��ƷЧ������Ե��߲�ǿ

### �޸�����
- ��չ������Ʒʹ����·�����뻤�ܡ�Buff������ Debuff�����͡����񴥷����Զ���˵����Ч����֧��
- ͳһ��Ʒʹ�ý��������ʹ�ú�������ʾ�ָ���ѧ�Ἴ�ܡ���ý�ҡ����״̬�����͵�ʵ����Ч�����
- ����ս����ʹ������У�飬`UseInCombat = false` ����Ʒ��ս��״̬�²����ٱ�����ʹ�á�
- ��������ʱ���Ե��ߣ���������ҩ��������ҩ��������ҩ�ۡ����ؾ��ᣬ����ֱ���ڵ�ǰ��Ƭ����֤�¹���
- �Ż����������ı�����ͨ����Ʒ�ĸ���Ч������������пɼ���

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ������Ʒʹ���߼�
- ��ɫ״̬�뻤������ʱ����
- ��������������񴥷�����߽���
- ����ʱ������Ʒ����

### ��֤��ʽ
- ���� `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj`
- ���� `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj`
- �����Runtime 0 warning / 0 error��Editor 0 warning / 0 error

### ����ע������
- ��ǰ TriggerQuest Ч������ `QuestDefinitionRegistry` ������Ŀ�������壬���������������Ʒ�������/���������ʲ�����ֱ�ӵ����ð󶨡�
- ��ǰ Teleport Ч�������͵� `PointId / DestinationPointId / ������` ������������Ҫ��չ�سǾ��ᡢ����������ȵ��ߣ��ɼ�������Ϊ��ʽ�����ֶΡ�

## 2026-05-22 - ��Ʒ����У�������ǿ

### �޸�����
- �ع� `ItemConfigValidator`��������������ʾ�İ���ͳһΪ�ɶ�����У������
- ��ǿ��ƷЧ��У�飬���ǻ�Ѫ�����������ܡ�Buff������ѧϰ�����͡����񴥷����Զ���Ч�������÷�֧��
- ��ǿ���ù�ϵУ�飬�����������ÿ�ֵ���ظ���顣
- ��ǿ��������У�飬���� ID �ո�������Ʒ����/������������˫ѧϰ��ڵȳ������÷�����ʾ��
- У�������ڻ᳢�Լ�� `LearnSkill` �� `TriggerQuest` ��Ŀ�� ID �Ƿ�����Ŀ�ʲ��д��ڡ�

### �޸��ļ�
- `Assets/Game/Editor/ItemConfigValidator.cs`
- `docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ��Ʒװ�����ñ༭����У�鷴��
- ��ƷЧ��������ȷ��
- �����뼼������������ȷ��

### ��֤��ʽ
- ���� `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj`
- ���� `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj`
- �����Runtime 0 warning / 0 error��Editor 0 warning / 0 error

### ����ע������
- ��ǰ����Ч����У������ TargetId �ǿ�Ϊ������δֱ�ӷ��鳡���ڴ��͵㣻����������͵�Ҳ�ʲ������ɼ������ⲿ������ΪǿУ�顣
- ��Ʒ���ô����Ҳ�ժҪ�Կɼ�����ǿ����Ч�������ù�ϵ���ɸ���ȷ������Ԥ����Ƭ��

## 2026-05-22 - 2.5D ����ê����ת����

### �޸�����
- ���� 2.5D ���ֲ�ê��ݹ���ع��򣬱����ٰ� UI������������������ `CurvedWorldAnchor2D`��
- Ϊ����ʱ�������ֲ��������߼�������ս������ʱ���������� UI / Camera �����ϵľ�ê�������
- Ϊ�༭��һ��������·����ͬ���������������߼�����������ؽ�����ʱ�ٴΰѶ������ת�� `X=90` ����״̬��
- ���ֵ���ͶӰ�����������������壬ͬʱ�ý�ɫ�����ˡ��̵ꡢ���صȳ����������ά��ֱ�� 3D ���֡�

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/World/CurvedWorldAnchor2D.cs`
- `Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- Sandbox ս����������ʱ 2.5D ����ê�����
- �༭��һ������ / �޸���������
- ��ɫ�����ˡ���������� UI / �������ת��������

### ��֤��ʽ
- ���� `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- ���� `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- �����Runtime 0 warning / 0 error��Editor 0 warning / 0 error

### ����ע������
- �����ͨ�������������Զ������տڣ����ֹ���ĳ��� YAML�����賹��ˢ�����г���ʵ���������� Unity ����ִ��һ����س����ؽ�/�޸����ߡ�
- ������Ҫ���صĶ�����Ӧͨ������ͶӰ�������������򴥷���������� `GroundPlane`����Ҫ�ٿ��ָ���ת��������л�״̬ά�ֱ��֡�

## 2026-05-22 - ��Ʒ�༭���Ҳ�����ժҪ��ǿ

### �޸�����
- ��д `ItemConfigEditorWindow` �Ҳ�Ԥ�����ṹ����ԭ������ժҪ��չΪ������ժҪ / Ч��Ԥ�� / ���ù�ϵ / У�������Ķ�ʽ����Ԥ����
- Ϊװ�����ò�������ժҪ�����ֱ�ӻ���װ�����͡�Ʒ�ʡ����󡢽��׹��򡢻������ԡ�ǿ����Ϣ������Ч����������װЧ��������
- Ϊ��Ʒ���ò�������ժҪ�����ֱ�ӻ��ܷ��ࡢ���ࡢ�ѵ�����ʹ�ù��򡢻���Ч���͸���Ч��������
- ����Ч��Ԥ���ı������߼�����װ������Ч������װЧ����ǿ���ɳ����Լ���Ʒ�Ļ�Ѫ��������Buff�����͡���������ѧ���ܵ�Ч�������ɿɶ�����������
- �������ù�ϵԤ���߼������̵��顢�����顢�������ú���Դ��עͳһ���ܵ��Ҳ࣬����Ҫ��չ���ײ��ֶ�����ȷ�ϡ�
- ͳһ���Ҳ�Ԥ���е����ı�ǩ��ö��ӳ�䣬����߻��ڱ༭����ֱ�ӿ���Ӣ��ö������

### �޸��ļ�
- `Assets/Game/Editor/ItemConfigEditorWindow.cs`
- `docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- Unity �༭���е���Ʒ / װ�����ù�����
- �߻��鿴��ƷЧ�������ù�ϵ��Ч��
- ����������չ��Ʒ�༭���Ҳ�Ԥ�����Ļ����ṹ

### ��֤��ʽ
- ���� `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- ���� `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- �����Runtime 0 warning / 0 error��Editor 0 warning / 0 error

### ����ע������
- ��������ı�������ժҪԤ����û�м���������ص��Զ��忨Ƭ�ؼ����������Ҫ����ǿ������������ṹ�ϼ�����ͼ�ꡢ�Աȿ��״̬�ձꡣ
- ��ǰ���ù�ϵ������ `ItemReferenceMetadata` �е��ֹ�ά���ֶΣ��������Ҫ��������ȫ��Ŀ���飬���Լ������Ҳಹ�Զ�����ɨ������

## 2026-05-22 - ��ɫ�������̨ͨ���޸�

### �޸�����
- ���� 2.5D չʾê����򣬸�������������ֱ�����ֱ��������ⵥλ���������������ת��������
- Ϊ���ζ�����������򲹳�ͨ�и߶ȡ���Ծ����н�����򣬲�������ʱ������ͨƽ��ֱ�ӿ��ϸ�̨
- �� Sandbox_Combat ����ʱ������ͬ����̨�������ȷ����ǰ��������������ֶ��ؽ�Ҳ����Ч
- ͬ������ FoundationAssetUtility ������·����֤����һ���ؽ�����ʱ�����µĸ�̨ͨ������
- ���� OverlapCircleNonAlloc ��ع�ʱ���棬��ǰ����Ŀ¼����ʵ�ʵ��ã�Runtime �� Editor ���̹�����Ϊ 0 warning 0 error

### �޸��ļ�
- `Assets/Game/Runtime/Core/Definitions/TerrainDefinition.cs`
- `Assets/Game/Runtime/Gameplay/World/TerrainZone2D.cs`
- `Assets/Game/Runtime/Gameplay/World/TerrainMovementReceiver2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CurvedWorldAnchor2D.cs`
- `Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`

### �����ļ�
- ��

### Ӱ�췶Χ
- �������˵� 2.5D ֱ����ʾ
- Sandbox_Combat ��ͼ�ĸߵ�ƽ̨�������
- ����������������������ؽ����

### ��֤��ʽ
- ���� `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- ���� `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`

### ����ע������
- ��ǰ��̨�ж���������߶�����Ծ�����״̬������������Ӹ���ֲ��ͼ����Ҫ������������߶Ƚ��� TerrainZone2D
- �����Ҫ�÷��е�λ��Խ��ˮ�������赲�����ٰ�������β����ϸ��ͨ�а���������
## 2026-05-22 - �������ñ༭������� MD ����������

### �޸�����
- ��չ�����������ݽṹ������ǰ���������׶�Ŀ�ꡢ��չ�������Ի����á���ͼ��ǡ������¼�������ֶΡ�
- �����������ñ༭��Ϊ�����������֣�֧�������ɸѡ����ҳ�༭��HUD/��ͼԤ������ǰ����У�顢����У���� MD �����򵼡�
- ��д���� MD �ݸ����ɹ��ߣ�֧���ϸ�ģ�塢��Ȼ���顢���ģʽ����������ݸ� JSON��ʵ���ѡ�͵�����־����ֱ�Ӹ�����ʽ�����ʲ���
- ��ǿ����У�飬�����ظ� ID���׶�Ŀ�ꡢ����Ŀ�ꡢǰ��������ѭ��ǰ�ü�⡣
- ��������Ŀ�����ͣ�ʹ�õ��ߡ����븱����ͨ�ظ����������������������ʱ�¼�·�����Ӷ�Ӧ�ϱ���ڡ�

### �޸��ļ�
- `Assets/Game/Runtime/Core/Definitions/GameEnums.cs`
- `Assets/Game/Runtime/Core/Definitions/QuestDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Questing/QuestEventRouter.cs`
- `Assets/Game/Editor/QuestDesignDraftUtility.cs`
- `Assets/Game/Editor/QuestEditorWindow.cs`
- `Assets/Game/Editor/QuestValidator.cs`
- `WCDEL.Game.Runtime.csproj`
- `docs/05_TASK_LOG.md`

### �����ļ�
- `Assets/Game/Runtime/Core/Definitions/QuestConfigModels.cs`

### Ӱ�췶Χ
- ���� ScriptableObject ���ڿ��Ա���������Ĳ߻����ã���������ʱ�Լ���ԭ����Ŀ�ꡢ��ҡ������ֶΡ�
- ���� MD ������ﱣ�浽 `Assets/Game/Runtime/Core/Configs/Generated/QuestDrafts`����Ҫ�˹�ȷ�Ϻ���ת��ʽ������Դ��
- ��Ŀ�����������¼��ϱ���ڣ������ɼ������븱�������������ʹ�õȾ����淨ϵͳ��

### ��֤��ʽ
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`

### ����ע������
- ��Ȼ����ģʽֻ�����ݸ�ʶ��ʵ�� ID��������ǰ�ù�ϵ����Ҫ�߻��ڱ༭����ȷ�ϡ�
- ��׶��������������ʱ�ƽ��߼�����Ӧ�������� `GameSession`����ǰ���ȱ�֤���á��༭�͵�����·������
## 2026-05-22 - ��ɫ���ù��� 3D �����ж��������

### �޸�����
- ����ɫ���ò���Ϊ 3D �����߼����壺X ����Z ���Y ��Ծ/����/���ա�
- ������ɫ 3D �ߴ硢Sprite Billboard �������á��ŵ׵�/����/ͷ��/����/ʩ��/Ͷ����/HUD/��Ӱ�� 3D �ҵ����á�
- �� BodyBox / HurtBox / HitBox ��չΪ 3D ����򣬲��� OffsetZ �� Depth���������� OffsetY/Height ��Ϊ Y �߶ȼ����ֶΡ�
- Ϊ��ɫ��������������ʵ 3D SkillVolume �� XZ ����ͶӰ��Χ����ȷ��Ȧֻ��ͶӰ����ʵ���п� X/Y/Z �����
- ��ɫ���ù���������3D�ߴ�/�ҵ㡱ҳ�����ж���ҳ����Ϊ Game View / Top View XZ / Side View XY ����ͼ��
- ��ɫ������JSON ������У����ͬ��֧�� 3D �ߴ硢3D �ҵ㡢�������Ⱥͼ��� 3D ��Χ��
- ����ʱ�����Ž��ƶ��ٶ�ʱ����ʹ�� MoveSpeedZ���� MoveSpeedY ��Ϊ���ݻ��ˡ�

### �޸��ļ�
- `Assets/Game/Runtime/Core/Definitions/CharacterActionEnums.cs`
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigSampleFactory.cs`
- `Assets/Game/Editor/CharacterConfigJsonExporter.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ������ɫ������������ÿ��԰� 3D �����ж���������ʵ�����Χ��ͬʱ������������ 2D Sprite ���ֺ;�����ʱ�ֶΡ�
- ��ǰ����ʱ����/�˺����������в��� 2D ��ѯ���룬������Ҫ������ MeleeAttackEmitter��AreaSkillEmitter��Projectile2D ���л��� 3D HitVolume ��ѯ��

### ��֤��ʽ
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`

### ����ע������
- ��Ҫ�ٰ���Ļ�����ƶ�д�� 2D Y ƽ�ƣ���λ��������Ӧ���� Z��Y ֻ����߶ȡ�
- ��Ȧ��Ԥ��Ȧ�����ܵ�����ʾֻ��Ϊ XZ ͶӰ��ʾ�����������ʵ 3D �����ж���
## 2026-05-22 - 角色操作直立表现与移动语义修�?

### 修改内容
- 复核 `character_config_tool_3d_world_2d_sprite_rules` �?`dnf_style_character_basic_controls_design`，确认角色根节点应保持直立，X/Z 为地面平移，Y 只用于跳跃、击飞、浮空和高度差�?
- 修正 `UnitPresentationRoot2D`，进入运行时会清�?`Visual / UiAnchor / GroundAnchor` 的残留旋转，避免旧场景中 `X=90` 被继续继承�?
- 修正 `CurvedWorldAnchor2D`，单位类对象强制使用直立表现基础旋转，只有地面投影和地形类对象继续允许贴地旋转�?
- 玩家、近战敌人、远程敌�?Awake 时主动恢复根节点直立，避免运行时从旧场景或旧生成结果继承 90 度旋转�?
- 角色配置桥接应用视觉配置时同步恢复直立表现，避免重新套配置后再次把角色表现层带回错误旋转�?
- 编辑器一键生�?/ 修复玩家、训练假人、敌人的流程改为使用直立表现入口，后续重建场景不会再次保留旧的贴地旋转�?
- `TopDownCharacterMotor2D` 补充逻辑 XZ 移动输入和朝向属性，为后续把运行时物理从 2D 平面逐步切到真实 3D 语义提供清晰入口�?

### 修改文件
- `Assets/Game/Runtime/Gameplay/World/UnitPresentationRoot2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CurvedWorldAnchor2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/TopDownCharacterMotor2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`

### 新增文件
- �?

### 影响范围
- 玩家、敌人、训练假人的 2D Sprite 表现层恢复直立，不再作为贴地对象旋转 90 度�?
- 后续角色配置应用与场景一键生成流程都会清理旧旋转残留�?
- 移动系统仍保�?Rigidbody2D 兼容实现，但对外补充了逻辑 XZ 语义入口�?

### 验证方式
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前是先把角色表现和旧旋转残留修正到位，真实 Transform 使用 X/Z 平移�?Y 高度的完整迁移还需要继续处�?Rigidbody2D、碰撞、寻路、地图点和相机跟随链路�?
- 地面红圈、Decal、地�?Mesh 等贴地对象仍允许使用 `X=90` 或等价贴地旋转，不应套用角色直立规则�?

## 2026-05-22 - 玩家 3D 坐标操作与跳跃修�?
### 修改内容
- 将玩家基础移动默认切到真实 3D Transform 语义：A/D 改变 X，W/S 改变 Z，Y 只用于跳跃、击飞和高度�?- 修复跳跃没有可见效果的问题，跳跃现在会真正改变玩家根节点�?`transform.position.y`，不再只维护不可见的内部高度值�?- 增加玩家旧场景坐标迁移保护：运行时检测到�?`(x,y,0)` 坐标时自动迁�?`(x,0,z)`，降低旧 2D 场景数据造成的错轴问题�?- 强化玩家和单位直立保护，在运行时持续清理根节点、Visual、UIAnchor、GroundAnchor 的错误贴地旋转，避免旧组件晚�?Awake 再把角色旋转 90 度�?- 相机跟随改为识别玩家真实 X/Z 逻辑平面，避免玩家向 Z 移动后相机仍追旧 Y 坐标�?- 地形通行、技能中心、普攻发射点、地�?Decal、交互检测和 3D 命中体积工具补充 X/Z 逻辑平面兼容入口�?
### 修改文件
- `Assets/Game/Runtime/Gameplay/Characters/TopDownCharacterMotor2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerJumpController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatHitVolume3DUtility.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/World/CameraFollow2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CurvedWorldAnchor2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CurvedWorldProjector2D.cs`
- `Assets/Game/Runtime/Gameplay/World/GroundProjectedDecal2D.cs`
- `Assets/Game/Runtime/Gameplay/World/PlayerInteractionSensor.cs`
- `Assets/Game/Runtime/Gameplay/World/TerrainMovementReceiver2D.cs`
- `Assets/Game/Runtime/Gameplay/World/TerrainZone2D.cs`
- `Assets/Game/Runtime/Gameplay/World/UnitPresentationRoot2D.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldPresentationHeightUtility.cs`

### 新增文件
- �?
### 影响范围
- 玩家移动、跳跃、相机跟随、地形高度通行、普�?技能逻辑平面取点、地面投影提示、交互检测和 3D 命中高度判定�?- 敌人、投射物和部分旧交互仍保�?2D 兼容路径，后续应继续逐步迁移到统一 3D 语义�?
### 验证方式
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`

### 后续注意事项
- 当前是玩家侧优先迁移，旧 `Rigidbody2D`�?D Trigger �?2D Collider 仍作为兼容层存在；后续敌�?AI、投射物、地图点、碰撞阻挡需要继续分批切到真�?3D 逻辑�?- 如果 Unity 中仍看到玩家旋转 90 度，应重点检查具�?Sprite 子节点或外部导入资源是否自带旋转，而不是玩家根节点�?`Visual` 节点�?## 2026-05-23 - ��һ��һ��̾Ϣ��������������

### �޸�����
- ���� `Docs/Section1` �� `Docs/Task/��һ��_һ��̾Ϣ.md`�������һ�¶��������׺��������̡�
- ���� `CH01_FirstSigh` �༭�����������������򡢵��Ρ�NPC��������ɼ��㡢���䡢����ˢ�¡����ߴ�����֧����������������߽硢Timeline/VFX/Debug ê�㡣
- ������һ������ʱ��λ�����񴥷���������̾Ϣ�׺��ݳ��������֧��������ֱ�������ֶΡ�
- �������ᴴ����һ�� Region��Terrain��������ԡ����ܡ�װ�������ߡ����ˡ������壬��ͬ�� `GameBootstrapConfig` �� Build Settings��
- ����һ����������ʱ�ű��ͱ༭�������������Ӧ `.csproj`����֤�����б���ɸ��ǡ�

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/World/Chapter01ScenePoint2D.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01QuestTrigger2D.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01SighSequence2D.cs`
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `WCDEL.Game.Runtime.csproj`
- `WCDEL.Game.Editor.csproj`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- `Docs/features/chapter01_first_sigh_full_scene_sync.md`

### Ӱ�췶Χ
- ��һ�����������ж�������������ڣ�`Tools/WCDEL/Chapter01/�������ؽ���һ�³���`��
- Ŀ�곡��Ϊ `Assets/Game/Scenes/CH01_FirstSigh.unity`�������ʲ�Ŀ¼Ϊ `Assets/Game/Runtime/Core/Configs/Generated/CH01_FirstSigh`��ռλͼĿ¼Ϊ `Assets/Game/Runtime/WorldPlaceholders/CH01_FirstSigh`��
- ���ڵ�ǰ�ȶ������͵��� AI ���� 2D ����Ϊ�����������������ĵ� X/Z ӳ�䵽 Unity x/y�����ڵ�һ������Ϲر� true 3D Transform �ƶ������ⴥ������λ��

### ��֤��ʽ
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- `D:\Unity6\Editor\Unity.exe -batchmode -quit -projectPath G:\TestProject\WCDEL -executeMethod WCDEL.Game.Editor.Chapter01FirstSighSceneBuilder.BuildChapter01FirstSighSceneForAutomation -logFile Logs/chapter01_first_sigh_build.log`

### ����ע������
- Unity ����������ִ�гɹ���`Assets/Game/Scenes/CH01_FirstSigh.unity` ��ʵ�����̣�����д�� Build Settings��
- ���༭���Ѵ򿪣�����Ҳ��ֱ���ڵ�ǰ Unity ��ִ�в˵� `Tools/WCDEL/Chapter01/�������ؽ���һ�³���` �����ؽ���һ�³�����
- ������ʽ������Դ��Prefab��Timeline ����ʱ��Ӧ�滻ͬ��ռλ��Դ�Ͱ׺��ݳ�����Ҫ�ƻ��������㼶������Ŀ�� ID��
## 2026-05-23 - ����ʮ��������������

### �޸�����
- ���������½����������������� `Docs/Task` �е�һ������ʮ�������������������� `QuestDefinition`��
- Ϊÿ��ͬ������ `RegionDefinition`��д���½� ID������ ID���Ƽ��ȼ�����Ŀ�ꡢ�׶�Ŀ�ꡢǰ�����������������¼�������������Ի����Ӻ͵�ͼ��ǡ�
- ������һ�����г������� ID������ `quest_main_chXX_*` canonical ���� ID���������½ڹؿ����ֽ��롣
- �������ڽ��� `QuestValidator.Validate`���Զ�������ʱͬ��У���������ݡ�

### �޸��ļ�
- `Assets/Game/Editor/MainStoryQuestDefinitionBuilder.cs`
- `WCDEL.Game.Editor.csproj`
- `Docs/features/main_story_quest_chain_full_sync.md`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH01_FirstSigh.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH02_GoldenManeCourt.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH03_FrostManeWarfield.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH04_CopperHornForge.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH05_MirageTailContractCity.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH06_WhiteDeerCloudmarsh.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH07_InkFeatherArchiveTower.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH08_SinkingScaleHarbor.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH09_BlackApeStoneFort.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH10_FragrantTuskValley.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH11_RedScorpionSandCourt.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH12_SecondDragonMeeting.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH13_WangcaiStopsDragonSlaying.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH14_TenRealmsPublicHearing.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH15_EightNationsReturn.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Quest_CH16_DragonReturnsHome.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH01_FirstSigh.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH02_GoldenManeCourt.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH03_FrostManeWarfield.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH04_CopperHornForge.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH05_MirageTailContractCity.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH06_WhiteDeerCloudmarsh.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH07_InkFeatherArchiveTower.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH08_SinkingScaleHarbor.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH09_BlackApeStoneFort.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH10_FragrantTuskValley.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH11_RedScorpionSandCourt.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH12_SecondDragonMeeting.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH13_WangcaiStopsDragonSlaying.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH14_TenRealmsPublicHearing.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH15_EightNationsReturn.asset`
- `Assets/Game/Runtime/Core/Configs/Generated/MainStory/Region_CH16_DragonReturnsHome.asset`

### Ӱ�췶Χ
- �������������ʲ�������༭��У�顢�����½ڹؿ����������롣
- ������������ʱ����ӿڣ��������е�һ�³������֡�

### ��֤��ʽ
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`
- Unity batchmode ִ�� `WCDEL.Game.Editor.MainStoryQuestDefinitionBuilder.BuildAllMainStoryQuestsForAutomation`
- �������Ŀ¼���� 16 �����������ʲ��� 16 ���½������ʲ���
- �������ڲ�ͨ�� `QuestValidator.Validate` У��ȫ����������

### ����ע������
- ���������ڶ��¼�֮��ؿ�����ʱ��ֱ�Ӹ��ñ������ɵ� `quest_main_chXX_*`��`region_chXX_*`���׶� ID ��Ŀ�� ID��
- ���½��ı�����������Ӧ���ȸ��� `MainStoryQuestDefinitionBuilder` ������ִ�����������������ָ������ʲ���
## 2026-05-23 - ս���������б��������ֽ����Ż�

### �޸�����
- Ϊս��������·��������˲�䱬�������������֣����� `Health -> CombatFeedbackBroadcaster` ����ͬ����·����������������ϵͳ��
- ǿ���ܻ�������У���ԭ�������붶�������ϼ����ʱ�������壬������ͣ�ٺ�ķ�������ʵ��
- �����˺����ֵĸ������࣬��ͬ���еȼ�ӵ�в�ͬ�����ٶ��붶��ǿ�ȣ���Ϊ����������΢���ٻ���С�
- ���䱾��ս�������Ż�˵���ĵ�����ȷ����ʱ�Զ���������ֲ�����Դ��

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/Combat/CombatDebugSpriteLibrary.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatFeedbackBroadcaster.cs`
- `Assets/Game/Runtime/Gameplay/Combat/HitFlashController2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberEmitter.cs`
- `Assets/Game/Runtime/Gameplay/UI/DamageNumberPopup.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/features/combat_presentation_impact_burst_sync.md`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- `Assets/Game/Runtime/Gameplay/Combat/HitImpactBurstController2D.cs`

### Ӱ�췶Χ
- Ӱ������ 2D ս���������ֲ㣬�����ܻ����ס����б��㡢���л������ֶ�Ч������ʱ�Զ������߼���
- ���Ķ��˺����㡢����ֵ�ۼ������������볡�����֣�����ǿ����˲����Ӿ�����෴����

### ��֤��ʽ
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build G:\TestProject\WCDEL\WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`

### ����ע������
- ��ǰ���б��������л�ʹ������ʱ���ɵ� debug sprite��������ʽ������ VFX ����ʱ��Ӧֱ���滻������Դ���������нڵ������뷴����ڡ�
- ������������ս���ָУ����ȸ��� `HitImpactFeedbackResolver` �ĵȼ����ͳһ�������ס�ͣ�١���ͷ�����ֺ���Чǿ�ȣ���������ٴηֲ档

## 2026-05-23 - 音频/BGM/语音系统 MVP

### 修改内容
- 新增全局 `GameAudioManager`、音源池、音频事件 ID、音频库 ScriptableObject 和音量设置数据。
- `GameBootstrapper` 启动时自动创建音频管理器，并从玩家运行时数据应用总音量、音乐、音效、UI、语音、环境音与静音状态。
- 普攻、技能、绝技、命中反馈、玩家受击、死亡、跳跃和落地接入统一音频事件。
- 后台设置页新增总音量、音乐、音效和静音按钮，支持运行时立即应用。
- 新增中文音频配置工具，可生成默认音频库资产，未配置真实音频时使用程序生成的临时提示音验证链路。

### 修改文件
- `Assets/Game/Runtime/Bootstrap/GameBootstrapper.cs`
- `Assets/Game/Runtime/Core/Data/PlayerRuntimeData.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatFeedbackBroadcaster.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Health.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerCombatController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerJumpController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `WCDEL.Game.Runtime.csproj`
- `WCDEL.Game.Editor.csproj`

### 新增文件
- `Assets/Game/Runtime/Audio/GameAudioEventIds.cs`
- `Assets/Game/Runtime/Audio/GameAudioLibrary.cs`
- `Assets/Game/Runtime/Audio/GameAudioManager.cs`
- `Assets/Game/Runtime/Audio/GameAudioPool.cs`
- `Assets/Game/Runtime/Audio/GameAudioSettings.cs`
- `Assets/Game/Runtime/Audio/GameAudioTypes.cs`
- `Assets/Game/Editor/AudioConfigToolWindow.cs`
- `Docs/features/audio_bgm_voice_system_sync.md`

### 影响范围
- 战斗命中反馈、角色动作阶段音效、技能阶段音效、玩家设置页和后续 BGM / 环境音 / 语音配置入口。
- 当前没有强依赖真实音频资源，缺少 `AudioClip` 时会使用临时程序音验证事件触发。

### 验证方式
- 运行 `dotnet build WCDEL.sln /p:BuildProjectReferences=false`，编译通过。

### 后续注意事项
- 进入 Unity 后可通过 `Tools/WCDEL/音频/音频配置工具` 创建默认音频库，再逐步填入真实 AudioClip。
- 后续需要继续接入地表脚步、Boss BGM 状态机、对话语音和 AudioMixer Snapshot。

## 2026-05-23 - 音频/BGM/语音系统补完

### 修改内容
- 补齐音频配置工具默认事件列表，新增 UI、交互、敌人、Boss、语音、胜利 BGM 和随机环境音事件。
- 默认音频库生成时同步创建同名 ClipGroup，占位为空时仍可使用程序提示音验证，后续填入真实 AudioClip 即可替换。
- 将默认音频库创建路径调整为 `Assets/Game/Audio/Resources/GameAudioLibrary.asset`，并保留旧路径读取兼容。
- `GameAudioManager` 自动创建时会在未显式赋值音频库的情况下通过 `Resources.Load("GameAudioLibrary")` 加载默认音频库，避免场景 BGM、环境音和真实资源配置不生效。
- 更新音频同步文档，记录当前已接入的运行时事件、BGM 状态机、脚步地表规则、交互音频、UI 音频和语音概率/冷却规则。

### 修改文件
- `Assets/Game/Editor/AudioConfigToolWindow.cs`
- `Assets/Game/Runtime/Audio/GameAudioManager.cs`
- `Docs/features/audio_bgm_voice_system_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 音频配置工具默认资产生成
- 运行时音频库自动加载
- BGM / 环境音 / UI / 交互 / Boss / 语音事件配置入口

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 编译通过，0 warning，0 error。

### 后续注意事项
- 进入 Unity 后通过 `Tools/WCDEL/音频/音频配置工具` 重新点击“创建默认音频库”，会在 Resources 路径生成运行时可自动加载的默认音频库。
- 正式音频资源接入时优先按事件同名 ClipGroup 填入 AudioClip；如果已有旧路径 `Assets/Game/Audio/GameAudioLibrary.asset`，建议迁移到 `Assets/Game/Audio/Resources/GameAudioLibrary.asset`。

## 2026-05-23 - 战斗命中去重与敌人逻辑平面优化

### 修改内容
- 近战攻击按 `IDamageable.transform` 对同一次命中的目标去重，避免多 Collider / 多 HurtBox 导致一次攻击重复扣血。
- 范围技能按同样规则去重，保留多目标命中但不重复结算同一单位。
- 近战和范围技能的攻击者侧反馈改为一次攻击聚合一次，按本次最高命中反馈播放，减少重复震屏、重复音效和过度 HitStop。
- 近战敌人索敌距离、追击方向和攻击距离改为读取目标逻辑平面位置，兼容玩家 X/Z 地面、Y 跳跃高度规则。
- 远程敌人索敌、保持距离和发射方向同步读取目标逻辑平面位置。
- `Projectile2D` 增加锁定目标 3D 命中体积检测，远程敌人弹体可优先命中真实逻辑平面上的玩家，同时保留旧 2D broadphase 兼容。
- 新增战斗同步文档，记录本次命中去重、反馈聚合和敌人逻辑平面规则。

### 修改文件
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Docs/features/combat_hit_dedup_enemy_planar_sync.md`

### 影响范围
- 玩家近战命中、玩家范围技能、敌人近战攻击、敌人远程弹体、战斗反馈强度和 X/Z 逻辑平面兼容。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 编译通过，0 warning，0 error。

### 后续注意事项
- 敌人自身移动、击退和软碰撞仍保留 2D Rigidbody 兼容层，后续若继续迁移到完整 3D 语义，应把 `KnockbackReceiver2D` 与 `UnitBodyCollisionFilter2D` 一起处理。

## 2026-05-24 - 第一章场景生成切换为真实 3D XZ 地面

### 修改内容
- 将第一章场景生成器从旧 XY 伪 2D 地图坐标切换为 Unity 真实 3D 语义：X 横向、Z 地面纵深、Y 高度。
- 第一章生成玩家启用 `TopDownCharacterMotor2D._useTrue3DTransformMotion = true`，相机生成 Perspective 固定斜向跟随配置。
- 地形、道路、阻挡白盒视觉改为水平 X/Z 地面卡片，并新增 `PlanarArea2D` 作为区域、任务、小地图、地形判定的平面逻辑区域。
- 补齐旧 2D 命名运行时组件在 2.5D/3D 场景里的 X/Z 兼容读取，包括交互、区域、任务触发、复活点、小地图点位、敌人移动与投射物逻辑位置。
- 更新第一章同步文档，明确旧 X/Z 映射到 Unity X/Y 的方案已废弃。

### 修改文件
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldPresentationHeightUtility.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldInteractableBase2D.cs`
- `Assets/Game/Runtime/Gameplay/World/PlayerInteractionSensor.cs`
- `Assets/Game/Runtime/Gameplay/World/TerrainZone2D.cs`
- `Assets/Game/Runtime/Gameplay/World/RegionTrigger2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CameraBoundsTrigger2D.cs`
- `Assets/Game/Runtime/Gameplay/World/MapPointRegistry2D.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01QuestTrigger2D.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01SighSequence2D.cs`
- `Assets/Game/Runtime/Gameplay/World/RespawnPoint2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerInteractionController.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/features/chapter01_first_sigh_full_scene_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/World/PlanarArea2D.cs`

### 影响范围
- 第一章场景生成、玩家 X/Z 移动、相机跟随、地形区域判定、任务触发、交互检测、地图点位、敌人追击和远程投射物。
- 暂保留旧 `Collider2D` 作为兼容层，不在本轮删除旧交互系统。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false` 通过，0 warning，0 error。
- Unity batchmode 尝试执行 `BuildChapter01FirstSighSceneForAutomation`，但当前项目已有 Unity 实例打开，Unity 拒绝多实例打开同一项目，场景文件未在本次批处理中落盘。

### 后续注意事项
- 关闭其他 Unity 实例后重新运行 batchmode，或在当前打开的 Unity 编辑器中执行 `Tools/WCDEL/Chapter01/创建或重建第一章场景`，让 `CH01_FirstSigh.unity` 重新落盘。
- 后续如果彻底迁移为 3D 物理，应再把交互、任务、地形和相机触发器从 `Collider2D` 兼容层迁移到 3D Collider / Volume。

## 2026-05-24 - ��Ƶ/BGM/����ϵͳ��������

### �޸�����
- ������Ƶ���ù����������룬ͳһ���Ϊ `Tools/WCDEL/��Ƶ/��Ƶ���ù���`��
- ��չ `GameAudioLibrary`�����������������ã�����Ĭ����Ƶ��ͬ�����ɵر�����������������
- ���� `GameAudioEventPlayer`��֧�ֳ�������UnityEvent�������¼��ֶ����� AudioEvent / VoiceRule��
- ���� `SceneAudioController`�����ڳ������ڵ�����Ĭ�� BGM��ս�� BGM��Boss BGM �ͻ�������
- `CharacterSpriteAnimationDriver` �����ɫ���� `FrameEvents`��`PlaySfx` ֡�¼��ᰴ��ɫλ�ò�����Ч��
- �Ż� `GameAudioManager` ������Դ��ѭ����Դ����ˢ�¡�����Ƶ��ʱ��Ĭ�� BGM / ���������ס�
- ��д��Ƶͬ���ĵ����������벢��¼��ǰ��Ƶ����ʹ�÷�ʽ��

### �޸��ļ�
- `Assets/Game/Runtime/Audio/GameAudioTypes.cs`
- `Assets/Game/Runtime/Audio/GameAudioLibrary.cs`
- `Assets/Game/Runtime/Audio/GameAudioManager.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Editor/AudioConfigToolWindow.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/features/audio_bgm_voice_system_sync.md`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- `Assets/Game/Runtime/Audio/GameAudioEventPlayer.cs`
- `Assets/Game/Runtime/Audio/SceneAudioController.cs`

### Ӱ�췶Χ
- ȫ����Ƶ���������� BGM / ����������ɫ����֡��Ч������������Ƶ���ù��ߺͺ�����ʵ��Ƶ��Դ�������̡�

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### ����ע������
- ���� Unity ��ɵ�� `����/ͬ��Ĭ����Ƶ��` ���� `Assets/Game/Audio/Resources/GameAudioLibrary.asset`������������ʵ AudioClip��
- ��������ʽ AudioMixer ʱ����Ҫ���¼��� MixerGroup �󶨵� Music / SFX / UI / Voice / Ambience������ Snapshot ����
## 2026-05-24 - ��һ����Ч��Դ����������

### �޸�����
- Ϊ��һ������ 131 ������ռλ WAV ��Ƶ��Դ������ BGM����������UI���ƶ���ս�������ˡ�Boss�����顢�����������̾䡣
- ������һ����Ƶ�����������ṩ���Ĳ˵� `Tools/WCDEL/��Ƶ/���ɵ�һ����Ƶ��`����һ��ͬ�� `GameAudioLibrary.asset`��
- ���ɲ����� `Assets/Game/Audio/Resources/GameAudioLibrary.asset`�����е�һ�� ClipGroup ���Ѱ� AudioClip������ʱ�� `GameAudioManager` �Զ����ء�
- ��չ��һ�³������������� `00_SceneSettings/Audio` �´��� `CH01_SceneAudioController`������ʱ���ŵ�һ��̽�� BGM ���ׯ����������������ԭ���ݾ�����ӡƽ̨��Ƶê�㡣
- ����һ����Ƶ������������༭�����̱����嵥��ȷ�����ر���� IDE �ܼ�⵽�ù��ߡ�
- ������һ����Ƶ��Դͬ���ĵ�����¼��Դ���ࡢ����ʱ����������������̡�

### �޸��ļ�
- `Assets/Game/Runtime/Audio/GameAudioEventIds.cs`
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `WCDEL.Game.Editor.csproj`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- `Assets/Game/Editor/Chapter01AudioLibraryBuilder.cs`
- `Assets/Game/Audio/Generated/Chapter01/**`
- `Assets/Game/Audio/Resources/GameAudioLibrary.asset`
- `Docs/features/chapter01_audio_asset_pack_sync.md`

### Ӱ�췶Χ
- ��һ�³��� BGM / ������������ƶ���ս�������������� Boss ��Ч�������ݳ���Ч��������Ч��UI ��Ч�������̾�ͺ�����ʽ��Ƶ�滻���̡�

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false` ͨ����0 warning��0 error��
- Unity batchmode �״�ִ�к����� `Assets/Game/Audio/Resources/GameAudioLibrary.asset`��
- �����Ƶ�⣺147 �� AudioClip ���á�0 ���� Clip ���á�11 ���ر�����3 ����������8 ����������

### ����ע������
- ��ǰ��ƵΪ����ռλ��Դ�������ڹ�����֤����ʽ�汾�滻 WAV ������ִ�� `Tools/WCDEL/��Ƶ/���ɵ�һ����Ƶ��` ����ͬ����
- �� Unity �Ѵ򿪱���Ŀ�������� batchmode ����ʾ��Ŀ�ѱ����� Unity ʵ��ռ�ã�Ӧ�ڱ༭����ִ�в˵���ر�����ʵ���������Զ�����
- ��������������Ƶ�л�ʱ�����ȸ��� `SceneAudioController`��`GameAudioEventPlayer` �͵�һ������ `Ch01Amb*` �¼�����Ҫ����������Ƶϵͳ��
## 2026-05-24 - 游戏默认配置工具与玩家输入配置

### 修改内容
- 新增统一的游戏默认配置资产模型，集中管理镜头、光照和默认输入，运行时支持启动配置、Resources 资产和内存默认值三级兜底。
- 新增全中文编辑器工具 `Tools/WCDEL/项目默认配置/游戏镜头光照输入配置`，用于创建、编辑和同步默认配置资产。
- 第一章场景生成器与沙盒战斗场景布局改为读取默认镜头/光照配置，避免重新生成关卡时重置 `CameraFollow2D` 手调参数。
- 新增玩家侧输入配置数据，旧存档或未配置玩家会从项目默认输入初始化，玩家修改后保存在 `PlayerRuntimeData.InputSettings`。
- 后台设置页接入完整输入配置按钮，点击某个按键后按下新键即可保存；同时支持横向/纵向反转和恢复默认。
- `GameInputReader` 改为读取玩家侧键位配置，并保留 InputAction、手柄和键盘兜底兼容。

### 修改文件
- `Assets/Game/Runtime/Core/Configs/GameDefaultSettings.cs`
- `Assets/Game/Runtime/Core/Data/PlayerInputSettingsData.cs`
- `Assets/Game/Runtime/Core/Data/PlayerRuntimeData.cs`
- `Assets/Game/Runtime/Bootstrap/GameBootstrapConfig.cs`
- `Assets/Game/Runtime/Bootstrap/GameBootstrapper.cs`
- `Assets/Game/Runtime/Input/GameInputReader.cs`
- `Assets/Game/Runtime/Gameplay/World/CameraFollow2D.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldPresentationSettings25D.cs`
- `Assets/Game/Runtime/Gameplay/World/SandboxCombatSceneLayout.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `Assets/Game/Editor/GameDefaultSettingsToolWindow.cs`
- `WCDEL.Game.Runtime.csproj`
- `WCDEL.Game.Editor.csproj`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Docs/features/game_default_settings_input_pipeline_sync.md`

### 影响范围
- 影响关卡重新生成时的相机、光照默认值来源，以及玩家设置页输入配置保存链路。
- 不改已有 InputAction 资产结构，不删除旧输入兼容逻辑。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false` 通过，0 warning，0 error。
- 检查第一章和沙盒场景生成逻辑均改为读取 `GameDefaultSettings`。
- 检查设置页输入按钮刷新、等待按键、恢复默认和运行时应用链路。

### 后续注意事项
- 本机未找到 Unity 6000.0.61f1 命令行程序，未自动 batchmode 创建资产；进入 Unity 后执行 `Tools/WCDEL/项目默认配置/创建或同步默认配置资产` 即可生成 `Resources/GameDefaultSettings.asset` 并挂到 `GameBootstrapConfig`。
- 后续新增关卡生成器时，镜头、光照和默认输入必须读取 `GameDefaultSettings.LoadActive()`，不要重新写死 `CameraFollow2D` 参数。

## 2026-05-24 - 角色与怪物 Sprite 脚底锚点修正

### 修改内容
- 新增 `CharacterSpriteFootAnchor2D`，让角色和怪物的 `Visual` 表现层按当前 Sprite 底部自动对齐到角色根节点，解决图片中心点踩地的问题。
- 扩展 `CharacterWorld3DConfig`，新增 `AutoAlignSpriteFootToRoot` 配置字段，并保留 `VisualRootOffset` 作为单个素材的手动微调入口。
- `CharacterConfigRuntimeBridge` 在应用角色配置时自动添加并配置脚底锚点组件，动画切帧后也会继续保持底部对齐。
- 角色配置工具的 `3D 世界尺寸与挂点` 页改为全中文显式显示脚底点、自动脚底对齐、视觉根节点偏移和挂点配置。
- 已同步现有 8 个角色配置资产，默认全部启用 `AutoAlignSpriteFootToRoot`。

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `Assets/Game/Runtime/Gameplay/World/UnitPresentationRoot2D.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigSampleFactory.cs`
- `Assets/Game/Runtime/CharacterConfigs/CharacterConfig_DogHero.asset`
- `Assets/Game/Runtime/CharacterConfigs/CharacterConfig_MouseBandit.asset`
- `Assets/Game/Runtime/CharacterConfigs/CharacterConfig_MeadowSlime.asset`
- `Assets/Game/Runtime/CharacterConfigs/CharacterConfig_CaveBat.asset`
- `Assets/Game/Runtime/CharacterConfigs/CharacterConfig_PoisonBee.asset`
- `Assets/Game/Runtime/CharacterConfigs/CharacterConfig_BeeCaptain.asset`
- `Assets/Game/Runtime/CharacterConfigs/CharacterConfig_HiveGuardian.asset`
- `Assets/Game/Runtime/CharacterConfigs/CharacterConfig_TrainingDummy.asset`
- `WCDEL.Game.Runtime.csproj`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteFootAnchor2D.cs`
- `Docs/features/character_sprite_foot_anchor_sync.md`

### 影响范围
- 影响所有通过 `CharacterConfigRuntimeBridge` 应用角色配置的玩家、怪物和训练假人视觉落点。
- 不改角色逻辑根节点、移动、跳跃、碰撞和伤害判定，只修正 Sprite 表现层与脚底点对齐。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false` 通过，0 warning，0 error。
- 检查现有角色配置资产已写入 `AutoAlignSpriteFootToRoot: 1`。
- 角色配置工具中可看到中文脚底锚点配置入口。

### 后续注意事项
- 如果某个正式素材本身已经把 Sprite pivot 设置在脚底，可在角色配置里关闭 `自动将 Sprite 底部贴到根节点`，或用 `视觉根节点手动偏移` 做微调。
- 新增角色配置或重新生成样例配置时，默认会启用脚底自动对齐。
## 2026-05-24 - 3D 战斗命中候选与释放表现修复

### 修改内容
- 修复普攻和范围技能在真实 `X/Z` 地面逻辑下仍依赖旧 `Physics2D.OverlapCircle` 候选，导致看似释放但没有目标、没有伤害的问题。
- 普攻和技能发射器现在保留旧 2D broadphase 兼容，同时追加按 `Health` 扫描的 `X/Z` 逻辑平面候选，再进入现有 3D HitVolume / HurtBox 判定。
- 统一 `CombatHitVolume3DUtility.ResolveLogicalPosition` 从 `WorldPresentationHeightUtility.ResolveLogicPlanePosition` 获取逻辑平面坐标，避免非玩家单位把 `position.y` 误当作地面纵深。
- 扩容并保护同次攻击命中去重数组，避免旧候选和逻辑候选合并后越界。
- 新增运行时轻量释放表现 `CombatActionPreview2D`，玩家普攻显示攻击弧光，技能释放显示范围圈，并让玩家控制器在旧场景中自动补齐组件。

### 修改文件
- `Assets/Game/Runtime/Gameplay/Combat/CombatHitVolume3DUtility.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerCombatController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/Combat/CombatActionPreview2D.cs`
- `Docs/features/combat_3d_hit_broadphase_action_preview_sync.md`

### 影响范围
- 玩家普攻、玩家范围技能、旧 2D 场景兼容、第一章真实 3D X/Z 场景战斗命中、伤害跳字/血条/震屏等后续伤害反馈入口。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 编译通过，0 warning，0 error。

### 后续注意事项
- 当前 `CombatActionPreview2D` 是确认释放链路用的轻量占位表现，后续正式资源接入时建议替换为 Decal / Mesh / Shader 技能特效。
- 后续新增敌人、Boss 或投射物时，不要直接读取 `transform.position.y` 作为平面纵深，必须通过 `WorldPresentationHeightUtility.ResolveLogicPlanePosition` 获取 `X/Z` 逻辑平面。

## 2026-05-25 - 背包装备性能、槽位与使用链路修复

### 修改内容
- 优化背包页刷新链路，避免菜单打开后每帧重建背包内容和重复刷新普通物品详情。
- 将菜单结构自检、布局补齐和依赖查找改为打开时立即执行、运行中低频执行，降低背包界面卡顿。
- 清理旧运行时测试装备污染，运行时测试装备只注册定义，不再自动加入玩家拥有列表。
- 兼容并归并旧 Accessory 装备字段到项链槽，新数据不再写入旧饰品字段，避免出现多余槽位错觉。
- 普通物品详情改为独立刷新路径，点击物品时显示图标、类别、数量、用途、效果和状态说明。
- 道具使用改为先确认实际生效再消耗，无效果时弹出中文提示并保留物品。
- 装备成功、装备失败、道具已使用、道具未生效都补充中文反馈。
- CombatHudDataSource 增加主动刷新引用能力，避免回血、回蓝、护盾和装备属性同步因引用为空而无效。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatHudDataSource.cs`
- `Assets/Game/Runtime/Bootstrap/GameSession.cs`
- `Assets/Game/Runtime/Core/Data/PlayerRuntimeData.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Docs/features/inventory_equipment_runtime_use_performance_sync.md`

### 影响范围
- 背包界面、装备槽位显示、装备穿戴、普通道具使用、技能书使用、药水回血回蓝、护盾和 Buff 类道具反馈。
- 旧 Accessory 字段仍保留为兼容入口，但运行时会迁移到 Necklace 并清空旧字段。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 编译通过，0 warning，0 error。

### 后续注意事项
- 后续新增真正饰品槽时需要新增明确 UI 槽位和数据字段，不要复用旧 Accessory 兼容字段。
- 不要恢复背包每帧完整刷新，也不要在普通物品详情中混用装备空详情逻辑。

## 2026-05-25 - 后台菜单事件驱动刷新优化

### 修改内容
- 将后台菜单从被动定时整页刷新改为事件驱动刷新，取消技能、任务、地图、角色页的定时重建。
- `RequestPageRefresh` 改为只标记脏状态，`RefreshNow` 才执行立即刷新，避免无事件时反复重绘。
- 菜单关闭时不再执行 UI 结构扫描和依赖查找，打开菜单时立即缓存，菜单打开后低频兜底检查。
- 接入 `GameSession.QuestFeedbackRaised`，任务变化时只刷新任务/地图/角色相关页面。
- 给背包格、技能树节点、任务列表新增鼠标悬浮预览入口，同一项重复悬浮不刷新。
- 给技能页、任务页、地图页、背包页页签和选择事件增加同值保护，避免重复点击导致整页重建。
- 主菜单取消每帧 `Refresh`，改为按钮事件、页面切换和语言变化时刷新。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendSkillDragHandle.cs`
- `Assets/Game/Runtime/Gameplay/UI/MainMenuCanvasPresenter.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuHoverHandle.cs`
- `Docs/features/backend_menu_event_driven_refresh_rules.md`

### 影响范围
- 后台菜单、背包界面、技能界面、任务界面、地图界面、设置界面和主菜单。
- 战斗 HUD 的血条、技能冷却、小地图等实时信息暂不改为事件驱动，因为这些属于需要实时反馈的界面。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 编译通过，0 warning，0 error。

### 后续注意事项
- 后续一键生成 UI 或新增功能时，不要恢复后台菜单/主菜单每帧完整刷新。
- 新 UI 列表项应优先接入点击、悬浮、拖拽或外部事件刷新入口。

## 2026-05-25 - ��̨�����������ݵ�����

### �޸�����
- ��̨�˵������ϲ�Ϊ���в��֣��������࣬ҳ��ҳǩ���У�����/������ť���Ҳ࣬�����þɲ���������������ʱ����λ�á�
- ������� 6 ���ݵ��������ݣ��ɴ浵��ȡʱ�Զ�����̶� 6 ��
- ���� `InventoryItemUseService`��ͳһ������ť��ս�� HUD ��ť�� `1-6` ��ݼ�����Ʒʹ�ù�����Ч�����㡣
- ����ҳ������ݵ���������ѡ������Ʒ���� `1-6` ��λ���ã�δѡ������Ʒʱ��������ò�λ����ա�
- ս�� HUD ���� 6 ���ݵ���������ʾ��ݼ�������������������֧�ּ��� `1` �� `6` ʹ�á�
- �����ֻ�������ÿ�ʹ������Ʒ��ս����ʹ�û��������� `UseInCombat = true`��

### �޸��ļ�
- `Assets/Game/Runtime/Core/Data/PlayerRuntimeData.cs`
- `Assets/Game/Runtime/Bootstrap/GameSession.cs`
- `Assets/Game/Runtime/Bootstrap/GameBootstrapper.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/inventory_ui_prefab_layout_design.md`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- `Assets/Game/Runtime/Gameplay/Inventory/InventoryItemUseService.cs`
- `Docs/features/quick_item_hotbar_inventory_sync.md`

### Ӱ�췶Χ
- ��̨�˵��������֡�����ҳ��ݵ�������ս�� HUD ��ݵ���������Ҵ浵���ݡ���Ʒʹ��Ч����ʹ����Ʒ������ȡ�
- ��ֱ���޸� Prefab YAML��������Ͳ���ͨ������ʱ�ṹ���룬������������ Overrides ���ֵ����֡�

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ����ͨ����0 warning��0 error��

### ����ע������
- ����һ������ UI ���Ż�����/ս�� HUD ʱ����Ҫ���� `QuickItemBar` �� `QuickItemHotbar` ����ڵ㡣
- ���δ����Ҫ����ս�����߽���������Ӧ������ȷ�����ֶΣ���Ҫֱ�ӷſ���������Ʒ���͡�
## 2026-05-25 - �����򲻿��� Unity 6 ����/GUI ��ʼ���޸�

### �޸�����
- �޸���̨�����������̬�ı���ʹ�� `Arial.ttf`������ `BackendMenuCanvasPresenter.Awake()` ���쳣�����������޷��򿪵����⡣
- �޸�ս�� HUD �������̬�ı���ʹ�� `Arial.ttf`����������ʱ�������������⡣
- ����̬ UI �ı�����ͳһ��Ϊ Unity 6 ���õ� `LegacyRuntime.ttf`��
- �޸� `CombatUnitWorldHud2D` �� `Awake()` �ж�ȡ `GUI.skin` �����⣬��Ϊֻ�� `OnGUI()` �ڳ�ʼ�� IMGUI ��ʽ��
- ����� `CombatHudPresenter` �� `PrototypeHudPresenter` �� IMGUI ��ʽ��ʼ����ȷ�϶��� `OnGUI()` �ڵ��á�

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ��̨���������ʼ����ս�� HUD ��ݵ�������ʼ������λͷ�� HUD ��ʼ����
- ���޸� Prefab����Ӱ���������ݽṹ����Ʒʹ�ù���

### ��֤��ʽ
- `rg -n --glob *.cs 'Arial\.ttf|GetBuiltinResource<Font>\("Arial' Assets/Game` �޽����
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ����ͨ����0 warning��0 error��

### ����ע������
- Unity 6 �в�Ҫ��ʹ�� `Resources.GetBuiltinResource<Font>("Arial.ttf")`������ʱ UI �ı�ͳһʹ�� `LegacyRuntime.ttf` ����ʽ����������Դ��
- `GUI.skin`��`GUIStyle(GUI.skin.*)` ֻ���� `OnGUI()` ��·�ڳ�ʼ������ʡ�## 2026-05-25 - �����������Զ�ʰȡ����

### �޸�����
- ���������������������·������ `Health.Died` ����� `CharacterConfigDefinition.Drop` ���ɵ����
- �������������λ���ĵ����ɣ���������ɢ�䵽��Χ����ʹ�������Ƽ���
- ��ҽ���ʰȡ��Χ���Զ�����ʰȡ�����������������ϲ��ڵִ�󷢷Ž�����
- ֧�ֽ�ҡ��������ߡ�װ�����ཱ���������� `ItemId` ���Ƚ������ߣ��Ҳ���ʱ����װ����
- ����Ʒϡ�ж���ʾ��ͬ��ɫ��Ȧ�����塢��ת����͸�ϡ�ж�������ʾ��
- ��ս���ˡ�Զ�̵��˺ͽ�ɫ�����Ž����̶����Զ��ҽ��������������

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- `Assets/Game/Runtime/Gameplay/Loot/DeathLootDropper2D.cs`
- `Assets/Game/Runtime/Gameplay/Loot/LootPickup2D.cs`
- `Assets/Game/Runtime/Gameplay/Loot/LootPickupReward.cs`
- `Docs/features/death_loot_drop_pickup_feedback.md`

### Ӱ�췶Χ
- ��������������������������֡��Զ�ʰȡ������/װ������ʱ�������š�
- ���޸� Prefab YAML�������������������Ӱ�����б�����̵귢����·��

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ����ͨ����0 warning��0 error��

### ����ע������
- ��Ҫ�ڵ��˽�ɫ���õ� `Drop.Items.ItemId` ����д��ʵ `InventoryItemDefinition.Id` �� `EquipmentDefinition.Id`��
- ������Ҫ�����ӵĵ�����Ч��ʰȡ��־��ս��Ʒ��壬Ӧͨ���¼���չ����Ҫ�õ�����ֱ���������� UI��
## 2026-05-25 - ���������������֡�������޸�

### �޸�����
- �޸���������������ɼ�������⣺����������ڿɴ� `EnemyDefinition` �������ɽ�Һ͵�һ�²��ϵ��䡣
- ��ս��Զ�̵����� `AssignEnemyDefinition` ���ɫ���ø���ʱ��ͬ����������ĵ��˶��塣
- Ϊ��һ�����в��ϡ���Դ������Ʒ���� `GameBootstrapConfig.StartingInventoryItems`��ȷ������ʱ�ܽ��������� ID��
- `GameBootstrapConfig` ����Ĭ����ҽ�ɫ���ú�Ĭ�ϵ��˽�ɫ�����б������ɳ���������������ʹ�á�
- `CharacterSpriteAnimationDriver` ��û����ʽ��ɫ����ʱ���᳢�Դ� `CharacterConfigRuntimeBridge` �����������Զ�����Ĭ�Ͻ�ɫ���á�
- ��һ�³����������������/����ʱ���� `CharacterConfigRuntimeBridge`������������Ŀ�� SpriteRenderer �ͽ�ɫ���ð󶨡�
- ����һ�����ɻ�������ʱ������������������д��Ĭ�Ͻ�ɫ���ú�������һ����Ʒ�嵥��

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/Loot/DeathLootDropper2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Runtime/Bootstrap/GameBootstrapConfig.cs`
- `Assets/Game/Runtime/Core/Configs/GameBootstrapConfig.asset`
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `Assets/Game/Editor/FoundationAssetUtility.cs`
- `Docs/features/death_loot_drop_pickup_feedback.md`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- `Docs/features/character_sprite_animation_runtime_binding.md`

### Ӱ�췶Χ
- �����������䡢�Զ�ʰȡ����һ�²�����Դ���뱳�������/��������֡�������š���һ�³���������·����������������·��
- ��ֱ���޸ĳ��� YAML �� Prefab YAML����ǰ���������ʲ�������Ĭ�����ú���Ʒ�嵥��

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ����ͨ����0 warning��0 error��

### ����ע������
- ��ʽ�����Խ����� `CharacterConfigDefinition.Drop.Items` ������ר�����䣻`EnemyDefinition` ����ֻ���ڱ���յ��䡣
- ������������������ʱ��������ɫ����ͬʱ�� `CharacterSpriteAnimationDriver` �� `CharacterConfigRuntimeBridge`��## 2026-05-25 - �������ý����������������޸�

### �޸�����
- ΪĬ���������ò����ݵ��� 1-6������Ĭ�����ù�������ʾ��Ӧ��λ��
- �޸� Tools Ĭ�Ͽ�ݼ��޸ĺ���Ч�����⣺���δ�Զ�������ʱ�������ȡĬ�����ã�����ֶ��ļ���ű��沢����Ĭ��ֵ��
- ս�� HUD ��ݵ�������Ϊ��ȡ����������ã�����Ӳ�������ּ� 1-6��
- ������������������������ֶΣ�����������Ӧ�û��ʵ�λ���ֱ��ʡ�ȫ����VSync ��Ŀ��֡�ʡ�
- ��̨����ҳ��չΪ�����������ģ��������ʡ��浵����/��ȡ����Ƶ����ͷ��������ݼ���������ڡ�
- ��Ƶ���ò�����������������������ͻָ�Ĭ�ϰ�ť��

### �޸��ļ�
- `Assets/Game/Runtime/Core/Configs/GameDefaultSettings.cs`
- `Assets/Game/Runtime/Core/Data/PlayerInputSettingsData.cs`
- `Assets/Game/Runtime/Core/Data/PlayerRuntimeData.cs`
- `Assets/Game/Runtime/Input/GameInputReader.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Bootstrap/GameBootstrapper.cs`
- `Assets/Game/Editor/GameDefaultSettingsToolWindow.cs`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- `Docs/features/complete_settings_input_graphics_audio_save_ui.md`

### Ӱ�췶Χ
- ��Ϸ�ں�̨����ҳ������������á�Ĭ�����ù��ߡ�ս����ݵ���������Ҵ浵�������ݡ���Ƶ�뻭������ʱӦ�á�
- ��ֱ���޸� UI Prefab �� Override YAML�����ð�ť����ͨ������ʱ�ṹ���룬���͸����ֵ����ֵķ��ա�

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ����ͨ����0 warning��0 error��

### ����ע������
- UI ����Ŀǰ�ȱ��浽������ò�������ҳ��ʾ���������Ҫ��������ȫ����̨���棬��Ҫͳһ���� CanvasScaler/������ϵ��
- ��ȡ�մ浵�ۻ����ʧ����ʾ����������Ҫɾ���浵��ȷ�ϸ��ǵ������ɼ�����չ�浵���÷�����## 2026-05-25 - ��ɫ����֡������ʾ�޸����ؽ����

### �޸�����
- ������н�ɫ����������֡��Դ��ȷ�� `DogHero` �͵����������ж���֡���ã������ƫ���� pivot/����ʱ���ױ��֡�
- �޸� `CharacterSpriteAnimationDriver`������Ƭ���е�֡����Ϊ��ʱ���Զ�Ѱ���ڽ���Ч֡�����������ζ����˻�Ĭ�Ͼ�̬ͼ��
- Ϊ��ɫռλ����֡�������������Ĳ˵���ڣ�`Tools/WCDEL/��ɫ����/�ؽ�ȫ����ɫ����֡������`��
- ��ɫռλ����֡�ؽ�ʱͳһ����Ϊ��֡ Sprite�������õײ����� pivot��������֡����ʱ��ɫ�ŵ�Ư�ƻ���򶶶���
- ������֤��ȷ������ʱ�ͱ༭�������ͨ����

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Editor/CharacterConfigSampleFactory.cs`
- `Docs/features/character_sprite_animation_runtime_binding.md`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ��ҡ����ˡ�ѵ�����˵�����ʹ�� `CharacterConfigDefinition.Animations` ������֡�������š�
- ��ɫռλ������Դ���ؽ�������򣻲�ֱ���޸ĳ��� YAML �� Prefab YAML��

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ����ͨ����0 warning��0 error��

### ����ע������
- ��ǰ�ն�û���ҵ� Unity ��ִ���ļ���δ���Զ�ִ�� Unity batchmode �˵������� Unity ������ `Tools/WCDEL/��ɫ����/�ؽ�ȫ����ɫ����֡������` ˢ������ PNG �������ú��������á�
- ������к��Կ�����ɫ����/Ư���쳣�����ȼ���Ӧ PNG meta �� pivot �Ƿ�Ϊ�ײ����ģ��Լ�������ɫ�Ƿ���� `CharacterConfigRuntimeBridge`��
## 2026-05-25 - ������Դͼ�껯����ʱ ICON

### �޸�����
- ����ͨ�ý���ͼ������Ⱦ���ߣ����䡢�����������ͺ�̨�������齱������Ϊͼ�� + ������ʾ��
- `QuestRewardEntry` ���ӿ�ѡͼ���ֶΣ�֧�ֽ�ҡ����顢��Ʒ��װ��������ͳһ�ṹ���������֡�
- ���俪��������ý���ͼ�굯�������ٰѽ�ҡ�װ������Ʒ�����ܽ���ƴ�������б���
- ������ HUD �������̨������������ `RewardRows`���нṹ������ʱ���ؾ����ֽ������ݡ�
- ����彻������ֱ����ʾ `Gold / EXP` �ı���������Ϊ��ʾ������ҳ�鿴ͼ�꽱����
- �����༭������ `Tools/WCDEL/��Դͼ��/���ɲ���ȫ����ʱ��Դͼ��`�����������ɲ�����ʱ��Դͼ�ꡣ
- ��ʱ����һ��ͨ����Դ PNG ռλͼ��������ҡ����顢��Ʒ��װ�������ܵȻ������

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/Questing/QuestRewardEntry.cs`
- `Assets/Game/Runtime/Bootstrap/GameSession.cs`
- `Assets/Game/Runtime/Gameplay/World/RewardChestInteractable2D.cs`
- `Assets/Game/Runtime/Gameplay/World/QuestBoardInteractable2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/WorldInteractionOverlayPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `WCDEL.Game.Runtime.csproj`
- `WCDEL.Game.Editor.csproj`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- `Assets/Game/Runtime/Gameplay/UI/RewardIconDisplayUtility.cs`
- `Assets/Game/Editor/ResourcePlaceholderIconGenerator.cs`
- `Assets/Game/Art/Icons/TempResources/UI_TempIcon_Currency_Gold.png`
- `Assets/Game/Art/Icons/TempResources/UI_TempIcon_Currency_EXP.png`
- `Assets/Game/Art/Icons/TempResources/UI_TempIcon_Item_Common.png`
- `Assets/Game/Art/Icons/TempResources/UI_TempIcon_Item_Uncommon.png`
- `Assets/Game/Art/Icons/TempResources/UI_TempIcon_Item_Rare.png`
- `Assets/Game/Art/Icons/TempResources/UI_TempIcon_Item_Quest.png`
- `Assets/Game/Art/Icons/TempResources/UI_TempIcon_Equipment_Common.png`
- `Assets/Game/Art/Icons/TempResources/UI_TempIcon_Equipment_Rare.png`
- `Assets/Game/Art/Icons/TempResources/UI_TempIcon_Skill_Rare.png`
- `Docs/features/reward_resource_icon_display_sync.md`

### Ӱ�췶Χ
- ���佱��չʾ�������� HUD ��������̨�������顢����影����ʾ����Ʒ/װ��/������ʱͼ�����������ڡ�
- ��ֱ���޸ĳ����� Prefab YAML������ͼ�� UI ͨ������ʱ�ṹ���롣

### ��֤��ʽ
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ����ͨ����0 warning��0 error��
- `rg` ��������ֱ�� `Reward: Gold / EXP` �ı����Ƴ���

### ����ע������
- ���� Unity ��ִ�� `Tools/WCDEL/��Դͼ��/���ɲ���ȫ����ʱ��Դͼ��`���ñ༭�����벢�����ж�����Դ����ʱͼ�ꡣ
- �����̵�۸�ǿ�����ġ������������Դ��ϢҲӦ����ͼ�� + �������֣���Ҫ������������Դ�б���
## 2026-05-25 - 第一章单位角色配置与序列帧重建链路

### 修改内容
- 为第一章主角和新敌人新增独立角色配置生成规则，不再全部复用旧 Mouse/Bee/Slime 占位配置。
- 新增第一章单位序列帧资源路径和配置路径，覆盖旺财、村口大鹅、荒原山鼠、强壮荒原山鼠、小飞虫、枯根怪、黑节草、毒芽花。
- 第一章场景生成器改为优先绑定 `CharacterConfig_CH01_Wangcai.asset`，并把第一章敌人配置写入启动配置兜底列表。
- 角色配置工具改为搜索 `Assets/Game` 下全部 `CharacterConfigDefinition`，避免第一章子目录配置不显示。
- 修复 3D 平面移动下序列帧不切换的问题：动画驱动现在会检测 XZ Transform 位移速度，不只依赖 `Rigidbody2D.linearVelocity`。
- 增加第一章专用重建菜单：`Tools/WCDEL/角色配置/重建第一章全部单位序列帧与配置`。
- 占位序列帧绘制增加贴图范围裁剪，避免动作帧越界导致 Unity 重建中断。

### 修改文件
- `Assets/Game/Editor/CharacterConfigSampleFactory.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Docs/features/chapter01_character_sequence_generation.md`

### 影响范围
- 第一章场景单位配置绑定、角色配置工具列表、角色/敌人待机与移动序列帧播放、第一章序列帧资源生成入口。
- 不直接修改场景 YAML 或 Prefab YAML，资源由 Unity 编辑器菜单生成。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 编译通过：0 warning，0 error。
- 检查本机 Unity 安装目录，当前未找到项目所需 `6000.0.61f1`，因此没有用低版本 Unity 强行批处理生成资源。

### 后续注意事项
- 请用 Unity `6000.0.61f1` 打开工程后执行 `Tools/WCDEL/角色配置/重建第一章全部单位序列帧与配置`，再执行第一章场景重建。
- 如果运行时仍看不到动画，优先检查对应场景单位是否有 `CharacterConfigRuntimeBridge`，且 `_characterConfig` 指向第一章专属配置。
## 2026-05-25 - 游戏设置界面重做

### 修改内容
- 按新增 `游戏设置界面设计文档` 重做后台设置页结构，从旧版几十个按钮平铺改为分栏式设置中心。
- 新增设置分页：画质、音效、操作、快捷键、存档、游戏性、系统，并保留底部应用、保存、恢复本页默认、恢复全部默认、返回按钮。
- 设置页继续通过运行时结构生成，不直接修改场景或 Prefab YAML，降低后续 UI 生成覆盖手调布局的风险。
- 保存覆盖、读取存档、恢复全部默认增加确认弹窗。
- 快捷键重绑增加系统保留键拦截和重复键冲突提示，快捷道具 1-6 继续纳入正式输入配置。
- 复用现有画质、音频、输入、镜头反馈、存档接口，不新建第二套设置系统。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Docs/features/settings_ui_redesign_full_sync.md`

### 影响范围
- 后台菜单设置页布局、设置项刷新、设置分页切换、存档确认、快捷键重绑校验。
- 不影响背包、技能、任务、地图页的数据接口；设置页仍由 `BackendMenuCanvasPresenter` 统一管理。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 编译通过：0 warning，0 error。

### 后续注意事项
- 游戏性分页当前先保留完整入口说明，后续需要把伤害数字、敌方血条、引导、字幕和无障碍选项接入持久化字段。
- 系统分页当前接入语言切换，后续可继续补返回标题、退出游戏、版本号和云存档状态。
## 2026-05-26 - 输入按键冲突与旧绑定双触发修复

### 修改内容
- 修复 `GameInputReader` 中键盘输入同时读取 `InputActionAsset` 和玩家自定义键位的问题，避免改绑后旧键仍然触发同一动作。
- 键盘动作现在只读取 `PlayerInputSettingsData`；`InputActionAsset` 只保留给手柄等非键盘输入。
- `PlayerInputSettingsData` 增加输入标准化：初始化时会自动清洗系统保留键和重复绑定。
- 设置页改键校验复用统一保留键规则，避免 UI 和运行时规则分叉。
- 修正默认输入配置资产中闪避键位，避免默认配置把 Alt 作为闪避。

### 修改文件
- `Assets/Game/Runtime/Input/GameInputReader.cs`
- `Assets/Game/Runtime/Core/Data/PlayerInputSettingsData.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Core/Configs/Resources/GameDefaultSettings.asset`
- `Docs/features/settings_ui_redesign_full_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 玩家键盘移动、攻击、交互、闪避、跳跃、技能、绝技、快捷道具输入读取。
- 旧存档输入配置在初始化时可能被自动修正保留键/重复键。
- 手柄输入仍通过 InputAction 通道保留。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 编译通过：0 warning，0 error。

### 后续注意事项
- 如果后续要做真正的 Input System 运行时 Rebind，需要把 `InputActionAsset` 的键盘绑定同步成玩家配置，或者继续保持现在的“键盘配置层独立、手柄 Action 层独立”的分工。

## 2026-05-26 - 第一章怪物点位与剧情文档对齐修复

### 修改内容
- 排查确认第一章怪物不一致的主因不是运行时随机刷错，而是 `Chapter01FirstSighSceneBuilder` 里长期保留了一份缩水版刷怪表。
- 新增 `GetChapter01EnemySpawns()` 作为章节一怪物生成入口，按 `Docs/Section1/第一章_完整点位表.md` 对齐 B-I 区敌人刷点、数量和点位 ID。
- 为章节一补充缺失的占位敌人定义键：`well_rat`、`surrender_rat`、`thief_rat`、`vine`，用于承接文档中的地鼠、自动认输山鼠、偷钱袋山鼠、缠脚藤。
- 收紧章节一 `GameBootstrapConfig` 默认敌人配置，只保留 `CharacterConfig_CH01_*`，避免 Slime/Bee/Mouse 等旧配置串进第一章。
- 扩展 `CharacterSpriteAnimationDriver` 的章节一怪物配置匹配规则，让新增变体正确落到现有第一章序列帧配置上。

### 修改文件
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Docs/features/chapter01_enemy_layout_doc_sync.md`

### 影响范围
- 第一章场景重建时的怪物布局、刷怪点命名、章节一怪物运行时配置兜底、章节一敌人动画/表现绑定。
- 不改现有场景 YAML 和 Prefab YAML，仍沿用当前编辑器生成链路。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 在 Unity 中执行 `Tools/WCDEL/Chapter01/创建或重建第一章场景`
- 检查章节一场景中敌人点位命名是否为 `CH01_*_ENEMY_SPAWN_*`，并核对黑草坡、枯井、旧龙渠、封印入口等区域怪物是否与文档一致。

### 后续注意事项
- 当前“山鼠窝小队”“自动认输山鼠”等特殊战斗表现仍复用现有怪物行为，仅先把点位和生成结果对齐到文档。
- 后续如果第一章文档继续新增怪物行为差异，优先继续维护 `GetChapter01EnemySpawns()` 和章节一专用配置映射，不要再回到旧的缩水静态表。
## 2026-05-26 - 角色技能帧事件特效与倍率联动

### 修改内容
- 增加角色技能范围、半径、伤害、投射物数量、投射物速度、特效缩放等角色属性字段。
- 增加动作帧 `PlayVfx` 事件的序列帧、Prefab、挂点、偏移、旋转、缩放、朝向跟随、技能倍率联动配置。
- 新增运行时帧事件特效播放器，动作播放到指定帧时可生成并播放序列帧特效。
- 技能释放时按角色属性倍率同步缩放真实 3D 判定体、技能半径、技能距离、伤害和地面预览。
- 角色配置工具新增中文化的序列帧特效帧事件配置区，并在预览窗口叠加显示当前帧特效位置。
- 技能详情界面新增循环序列帧预览，优先读取技能绑定动作中的 `PlayVfx` 序列帧。
- 增加 `PlayVfx` 配置校验，提示缺少 Prefab/序列帧、FPS、持续时间和缩放异常。

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/Characters/CharacterFrameVfxPlayer.cs`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`

### 影响范围
- 角色配置工具、角色动作帧事件、玩家技能释放、技能详情页预览、角色属性倍率与技能判定表现同步。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 编译通过：0 warning / 0 error。

### 后续注意事项
- 投射物数量和速度字段已进入正式角色属性，当前项目玩家投射物释放链路尚未完整接入，后续实现投射物技能时应复用这两个字段。
- 正式资源接入时，建议优先给技能绑定动作配置 `VfxFrames`，这样角色配置工具和技能详情页都能直接预览。

## 2026-05-26 - 战斗体型判定与击退击飞表现

### 修改内容
- 新增角色体型判定：小型、中型、大型、巨大型，体型只影响战斗击退/击飞表现，不改变单位实际大小。
- 在角色受击配置中增加基础击退距离、体型击退系数、基础击飞高度、体型击飞系数。
- 在普攻 `DamageEvent` 中增加击退力度、击飞横向力度、冲击方向模式、固定方向、击杀击退/击飞加倍配置。
- 在技能条目中增加独立 `Impact` 配置块，让范围技能也能配置击退、击飞、方向和击杀加倍。
- 新增 `CombatImpactUtility` 统一计算方向、目标体型系数、死亡预判、最终击退距离和击飞高度。
- 普攻、范围技能、投射物、敌人普通攻击都接入统一冲击结算链路。
- `KnockbackReceiver2D` 读取角色击退抗性，`PlayerHitReactionController` 读取角色击飞抗性。
- 角色配置工具增加体型判定说明和伤害事件击退/击飞结算摘要。
- 增加普攻和技能冲击配置校验。

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/CharacterActionEnums.cs`
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Combat/IDamageable.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/KnockbackReceiver2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerHitReactionController.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/Combat/CombatImpactUtility.cs`
- `Docs/features/combat_body_size_impact_knockback_launch_sync.md`

### 影响范围
- 角色配置、普攻命中、技能命中、投射物命中、敌人攻击、击退接收、玩家击飞/倒地表现。

### 验证方式
- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- 编译通过：0 warning / 0 error。

### 后续注意事项
- 体型系数字段填 0 时使用默认体型倍率；如果策划需要特殊怪物表现，可以手动填具体倍率覆盖默认值。
- 当前敌人自身的击飞动画状态仍主要沿用已有受击/击退表现，后续可以继续补敌人专用 Launch / Down / GetUp 状态机。

## 2026-05-26 - ?????????????

### ????
- ????????? Markdown ????????? `CharacterConfigDefinition` ???????????
- ??????????????????????????????????????????
- ????????????????????????????????????

### ????
- `Assets/Game/Editor/CharacterActionCatalogMarkdownExporter.cs`
- `Docs/features/unit_action_sequence_frame_catalog.md`

### ????
- `Assets/Game/Editor/CharacterActionCatalogMarkdownExporter.cs`
- `Docs/features/unit_action_sequence_frame_catalog.md`

### ????
- ???????????
- ?????????/??/?????????
- ?? AI ???????????????????

### ????
- ?? `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ?? `Docs/features/unit_action_sequence_frame_catalog.md` ??????????????

### ??????
- ??????????????? Unity ??? `Tools/WCDEL/Characters/?????????? Markdown` ???????
- ????????? `CharacterConfigDefinition` ??????????????????????????

## 2026-05-26 - ????????????

### ????
- ????? `unit_action_sequence_frame_catalog.md` ??? `???` ??????
- ??????????? Windows ???????????????
- ????????????????????? Unity ???????????????

### ????
- `Assets/Game/Editor/CharacterActionCatalogMarkdownExporter.cs`
- `Docs/features/unit_action_sequence_frame_catalog.md`

### ????
- ?

### ????
- ?????????????
- ??????????????

### ????
- ?? `Docs/features/unit_action_sequence_frame_catalog.md` ? `?` ??? 0
- ??????? `�` ??????
- ?? `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

### ??????
- ??????????????? Unity ?????????????????????????????????

## 2026-05-26 - ?????????????

### ????
- ???????????????????????? Sprite ?????????????????
- ??????????????? Sprite ?????????????? `VisualRoot.localPosition.y` ?????
- ??????????????????????????????? `CharacterSpriteFootAnchor2D` ? `PlayerJumpController` ???? Y ????

### ????
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteFootAnchor2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerJumpController.cs`

### ????
- ?

### ????
- ??????????????
- ??????????????????
- ??/??????????????????

### ????
- ?? `dotnet build WCDEL.sln /p:BuildProjectReferences=false`
- ??????????????????????/??/???????????

### ??????
- ?????????????????????????????????????????????????????????????????

### ????
- ?? `CharacterSpriteFootAnchor2D` ??? `SpriteRenderer.sprite` ??????????????????
- ?? `PlayerJumpController.RefreshVisualBaseOffset()` ????????????????????????????????????

## 2026-05-26 - Skill Movement Displacement Rules

### Modified Content
- Added skill-side movement rules as a separate design layer from action `ActionMove`.
- Covered frame-based start timing, movement duration frames, movement distance, multi-segment movement, teleport to target point, teleport to target front/back, leap smash, target selection, wall traversal, unit collision, rush hit, invulnerability, super armor, and landing validation.
- Added requirements for character config tool and skill detail preview, including XZ path, Y arc, landing/teleport point, rush hit flags, and validation warnings.
- Added MVP implementation phases: data/editor first, then dash/teleport, multi-segment/rush hit, leap smash, and polish.

### Modified Files
- `Docs/05_TASK_LOG.md`

### New Files
- `Docs/features/skill_movement_displacement_rules.md`

### Impact Scope
- Skill config data model.
- Character config tool skill page.
- Skill detail preview.
- Skill cast movement, collision, rush hit, invulnerability/super armor, jump height, and ground projection.

### Verification
- Checked that `Docs/features/skill_movement_displacement_rules.md` includes displacement, teleport, multi-segment movement, leap smash, target point, wall traversal, rush collision, invulnerability, and editor preview rules.

### Follow-up Notes
- Implementation should first add default-disabled data fields so existing skills keep current behavior.
- Skill movement executor should follow the current 3D world rule: XZ for planar movement and Y for jump/floating height.

## 2026-05-26 - Skill Movement Runtime Implementation

### Modified Content
- Added skill movement enums for movement mode, target mode, retarget policy, interrupt policy, and invalid target policy.
- Added default-disabled `CharacterSkillMovementConfig` and `CharacterSkillMovementSegmentDefinition` to skill entries, preserving existing skill behavior when no movement is configured.
- Added `SkillMovementExecutor2D` to execute frame-based directional dash, target-point style dash, teleport, retreat/pull direction variants, and basic leap/jump-smash Y arcs.
- Connected skill movement execution to `PlayerSkillController`, including movement ticking during cast, cleanup on finish/cancel, and invincible/super armor state forwarding.
- Added skill displacement helpers to `TopDownCharacterMotor2D` and skill height override hooks to `PlayerJumpController`.
- Added Chinese-facing skill movement authoring panel in the character config tool.
- Added validator checks for movement segments, frame ranges, distances, fixed direction, wall pass risk, rush hit setup, leap height, and jump-smash landing frame.

### Modified Files
- `Assets/Game/Runtime/Core/Definitions/CharacterActionEnums.cs`
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Characters/TopDownCharacterMotor2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerJumpController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/05_TASK_LOG.md`

### New Files
- `Assets/Game/Runtime/Gameplay/Characters/SkillMovementExecutor2D.cs`

### Impact Scope
- Character skill config data.
- Player skill casting runtime.
- Skill movement, teleport, leap presentation height, invincibility, and super armor windows.
- Character config tool skill page and validation workflow.

### Verification
- Ran `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`.
- Build passed with 0 warnings and 0 errors.

### Follow-up Notes
- Rush hit damage is currently validated/configured but not yet fully applied through swept-volume damage; next step should connect `CanRushHitEnemy` to combat hit emission.
- Wall and walkable-ground validation are represented in config and warnings; next step should connect them to terrain/path blockers before shipping movement-heavy skills.

## 2026-05-26 - Combat Knockback Launch And Skill Movement Fix

### Modified Content
- Fixed knockback execution for the current 3D logic world by moving targets on the XZ transform plane when units use true 3D transform motion or kinematic Rigidbody2D.
- Added generic launch arc handling in `KnockbackReceiver2D` for non-player units so configured LaunchPower has visible Y-axis lift even without `PlayerJumpController`.
- Fixed skill movement frame timing by caching bound character actions in `PlayerSkillController` and estimating movement frames from the bound action duration instead of only the skill cast duration.
- Triggered skill movement once immediately at skill start so StartFrame 0 segments can take effect right away.
- Kept input/target directional skill movement on XZ instead of forcing all skill movement through side-scroll left/right facing resolution.
- Reworked the character config tool skill page into clearer blocks: runtime skill asset binding, 3D hit volume, impact/knockback/launch, projectile, movement, and VFX preview.
- Added explanatory editor text clarifying that `RuntimeSkillDefinition` is the old/basic runtime skill asset while `SkillVolume`, `Impact`, and `Movement` are character-config combat presentation data.

### Modified Files
- `Assets/Game/Runtime/Gameplay/Combat/KnockbackReceiver2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/SkillMovementExecutor2D.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Docs/05_TASK_LOG.md`

### New Files
- None

### Impact Scope
- Knockback and launch visual behavior for player and enemies.
- Player skill movement execution timing and direction.
- Character config tool skill authoring workflow.

### Verification
- Ran `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`.
- Build passed with 0 warnings and 0 errors.

### Follow-up Notes
- Enemy skill movement is still not fully driven by character skill entries because simple enemy controllers currently use their own attack AI path; if enemy skills need configured Movement, enemy attack controllers should be upgraded to use the same skill movement executor.
- Wall/walkable-ground checks are still configuration and validation level; terrain blocker integration should be added before shipping wall-sensitive dash/teleport skills.

## 2026-05-27 - ��ɫ���ù����չ���������ҳ�Ż�

### �޸�����
- ����ɫ���ù���ҳǩ�ӡ�����3D��Χ/���Ρ�����Ϊ���չ�/����/���Ρ���
- ��ͬһҳ�����չ�������չ�������������ֱ�ӱ༭����λ�� `ActionMove`���˺��Ρ���ʵ 3D �����򡢻��˻��ɡ�ȡ�����ں�����֡��Ч֡�¼���
- �������� `Movement`��`SkillVolume`��`Impact` ��ԭ��������ڣ�����������˵������ȷ�չ�λ���뼼��λ�Ƶ�������Դ��ͬ��
- ���������øĳ����Ļ���������˵������ֻ���ö��� ID�������ظ������������ݡ�
- ���Ӷ���λ��У�飬��ʾλ��֡��Χ������дλ�Ƶ�δ���á�����λ�Ƶ�����Ϊ 0���չ� Y λ�Ʒ��յ����⡣

### �޸��ļ�
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- Unity �༭���ڽ�ɫ���ù��ߡ�
- �չ��������չ������ܡ����С�3D �ж����λ�����õĲ߻��༭���̡�
- ��ɫ����У������

### ��֤��ʽ
- ִ�� `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`��
- ��������0 warning / 0 error��

### ����ע������
- �չ�λ����ʹ�ö����� `ActionMove`������λ����ʹ�ü��ܲ� `Movement`����������ʱ����Ӧ�ֱ����Ӧִ������
- �����Ҫ���˼���Ҳ����ʹ�ü��� `Movement`����������������˹��� AI �ļ���ִ����·��

## 2026-05-27 - ����λ��ͳһ����������ʱ����

### �޸�����
- �� `CharacterActionDefinition` ��������ʽ�߼�λ������ `Movement`���չ��������չ������ܶ����;�������ͳһ�Ӷ�����ȡλ�ơ�
- ������ `ActionMove` ��Ϊ�����ֶΣ���������ʱ�Զ�ת����һ����λ�ƶΣ������������ȫʧЧ��
- �����ͷ�λ�����ȶ�ȡ�󶨶��� `Movement`����ζ�ȡ�󶨶����� `ActionMove`�����Ż��˵����ܾ� `Movement`��
- �չ�����ʱ����ͬһ��λ��ִ�������޸������ö���λ���������á������⡣
- ��ɫ���ù��ߵġ�������ҳ������ʽ������λ�ơ�������������ҳ���ٱ༭�����ü���λ�ơ���ֻ��ʾλ����Դ����ת���󶨶�����
- ����У���߼������������߼�λ��У�飬���Լ��ܾ� Movement ��󶨶���λ���ظ�ʱ������ʾ��
- ���¼���λ�ƹ����ĵ�����ȷ����λ��Ϊ����ڡ�

### �޸��ļ�
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Characters/SkillMovementExecutor2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerCombatController.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `Docs/features/skill_movement_displacement_rules.md`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ��ɫ���ù��߶���ҳ�ͼ���ҳ��
- ����չ��������չ������ܺ;�����λ��ִ�С�
- �ɶ���λ����ɼ���λ�����ݵļ��ݲ��ԡ�

### ��֤��ʽ
- ִ�� `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`��
- ��������0 warning / 0 error��

### ����ע������
- ��������λ�������������ڶ��� `Movement`����Ҫ������ʹ�þ� `ActionMove` ���ܾ� `Movement`��
- ���� AI ��Ҫ����ʹ�ö����߼�λ�ƣ�����Ҫ�����ѵ��˹������̽���ͬһ������λ��ִ������

## 2026-05-27 - ����ҳ�Ƴ��ɶ���λ�����

### �޸�����
- �ӽ�ɫ���ù��ߡ�������ҳ��ȫ�Ƴ��� `ActionMove` / �����ö���λ�ơ��༭��塣
- ������ҳ��ʽλ����ڸ�Ϊ������λ�ơ�����ť�İ���ԭ����λ�����ñ���һ�¡�
- �������λ�ơ�˲�ơ���Ծ�һ�����ײ���޵С�����ȸ߼�λ���ֶΣ��չ��ͼ��ܶ������ڶ���ҳʹ��ͬһ�����á�
- ��������ҳλ����Դ˵��������չʾ�� ActionMove ״̬��������������ظ���
- ���¼���λ�ƹ����ĵ�����ȷ�� `ActionMove` �����ؼ������ݣ�����Ϊ��ͨ�������չʾ��

### �޸��ļ�
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Docs/features/skill_movement_displacement_rules.md`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ��ɫ���ù��߶���ҳ��
- ��ɫ���ù��߼���ҳλ����Դ��ʾ��
- �߻������չ��������չ������ܶ����;�������λ�Ƶ���ڡ�

### ��֤��ʽ
- ִ�� `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`��
- ��������0 warning / 0 error��

### ����ע������
- �� `ActionMove` �Ա��������ݺ�����ʱ���ݲ㣬���ڹ�����ͨ����չʾ��
- ��������λ��ֻʹ�ö���ҳ������λ�ơ����á�

## 2026-05-27 - ���˽ŵ�ê����˸�޸�

### �޸�����
- Ϊ `CharacterSpriteFootAnchor2D` ��¶�ȶ��� `CurrentVisualRootOffset`����Ϊ�Ӿ����ڵ�ŵ����Ϻ�Ļ�׼ƫ�ơ�
- ���� `HitFlashController2D`�������ܻ�����/����ʱ����ʹ�ýŵ�ê���׼��ֻ������ʱ����������Ѷ������ `Visual.localPosition` �����»�׼��
- ���� `FlyingEnemyPresentation2D`�����е��˵ĺ���ڶ���׼���ȶ�ȡ�ŵ�ê��ƫ�ƣ�������б��ֺ��Զ��ŵ����ϻ����� `Visual.localPosition`��
- ���½ŵ�ê��ͬ���ĵ�������������ܻ�/���б��ֵĵ��ӹ���

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteFootAnchor2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/HitFlashController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/FlyingEnemyPresentation2D.cs`
- `Docs/features/character_sprite_foot_anchor_sync.md`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ���á���ɫ���ڵ�ʹ�ýŵ׵㡱�͡��Զ��� Sprite �ײ��������ڵ㡱�ĵ��˱��֡�
- �����ܻ����ס��ֲ����������������� Sprite ����֡�л���

### ��֤��ʽ
- ִ�� `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`��
- ��������0 warning / 0 error��

### ����ע������
- �����������޸� `Visual.localPosition` �ı������ʱ��Ӧ�� `CharacterSpriteFootAnchor2D.CurrentVisualRootOffset` Ϊ��׼������ʱƫ�ƣ���Ҫֱ�ӻ��浱ǰ����λ�á�

## 2026-05-27 - 角色多段投射物配置链路

### 修改内容
- 扩展角色技能投射物数据结构，新增 `Projectiles` 多段投射物列表，并保留旧 `Projectile` 作为兼容字段。
- 新增投射物目标、数量布局、飞行、碰撞、爆炸、伤害、冲击和表现配置字段。
- 新增 `CharacterProjectileEmitter2D` 与投射物运行时工具，玩家技能释放时会读取当前角色技能条目的启用投射物段并生成投射物。
- 扩展 `Projectile2D`，支持直线、抛物线、追踪、加速/减速、穿透、重复命中、命中爆炸、到期爆炸和独立冲击配置。
- 角色配置工具技能页新增中文“投射物配置”面板，支持多段新增、删除、分组编辑和摘要显示。
- 更新校验、JSON 导出和动作清单摘要，补充投射物配置规则文档。

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/CharacterActionEnums.cs`
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerSkillController.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `Assets/Game/Editor/CharacterConfigJsonExporter.cs`
- `Assets/Game/Editor/CharacterActionCatalogMarkdownExporter.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/Combat/CharacterProjectileEmitter2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CharacterProjectileRuntimeUtility.cs`
- `Docs/features/character_projectile_multi_stage_config_sync.md`

### 影响范围
- 角色配置工具技能页。
- 玩家技能投射物生成、命中、爆炸和伤害表现。
- 角色技能 JSON 导出和动作序列帧清单摘要。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 error，2 个既有 `Assembly-CSharp.csproj` 通用 warning。

### 后续注意事项
- 当前 MVP 在技能释放点统一发射启用投射物段，`SpawnFrame`、`DelayFrames` 和重复间隔字段已保留给后续逐帧调度接入。
- `DestroyOnWall` / `ExplodeOnWall` 已进入配置与工具显示，后续需要接入正式地形阻挡层后才能完整生效。

## 2026-05-27 - 角色 Buff 配置与运行时触发链路

### 修改内容
- 在角色配置中新增 `Buffs` 列表，支持 Buff/Debuff 基础信息、持续时间、无限持续、层数、刷新规则、显示优先级和 HUD 图标类型。
- 新增 Buff 触发规则：间隔触发、受击触发、攻击触发、移动触发、跳跃触发、施加触发和到期触发预留。
- 新增 Buff 效果规则：回血、回能、范围伤害、持续伤害、获得护盾、附加状态图标和移除自身。
- 扩展 `CombatStatusController`，保留旧状态显示接口，同时新增 `ApplyBuff`、触发器计时、层数处理和效果执行逻辑。
- 将受击、近战命中、技能范围命中、投射物命中、移动输入和跳跃开始接入 Buff 触发通知。
- 角色配置工具新增“Buff配置”页签，提供全中文的 Buff、触发器、效果多列表编辑界面。
- 更新角色配置校验、JSON 导出和 Buff 功能文档。

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/CharacterActionEnums.cs`
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusController.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Health.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `Assets/Game/Runtime/Gameplay/Characters/TopDownCharacterMotor2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerJumpController.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `Assets/Game/Editor/CharacterConfigJsonExporter.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Docs/features/character_buff_config_runtime_sync.md`

### 影响范围
- 角色配置工具 Buff 页签。
- 单位 Buff/Debuff HUD 显示与运行时效果结算。
- 受击、攻击命中、移动、跳跃等战斗事件触发链路。
- 角色配置 JSON 导出与校验。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- `OnExpire` 已作为触发类型预留，后续可在 Buff 到期移除时执行专门效果。
- 当前先完成回血、回能、范围伤害、持续伤害、护盾和状态图标，属性加成类 Buff 可继续在同一数据结构上扩展。

## 2026-05-27 - Buff 伤害归属与投射物新链路统一

### 修改内容
- 在 Buff 伤害类效果中新增 `SourceBuffId` 和 `DamageLabel`，角色配置工具 Buff 效果面板可直接配置“伤害来源 Buff ID”和“跳字/伤害标签”。
- 扩展 `DamageRequest`，新增 `SourceBuffId`，Buff 范围伤害和持续伤害会写入伤害来源，空值时默认使用运行时 Buff ID。
- Buff 伤害跳字标签优先读取 `DamageLabel`，为空时 Debuff 伤害继续使用 Buff 显示名。
- 删除技能旧单段投射物字段 `CharacterSkillEntryDefinition.Projectile`，运行时、编辑器、校验、JSON 导出和动作清单全部统一只读取 `Projectiles`。
- 移除角色配置工具里的旧投射物兼容折叠面板，并更新投射物规则文档为“唯一入口 Projectiles”。
- 更新 Buff 规则文档，补充伤害归属字段和运行时写入规则。

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Combat/IDamageable.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusController.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CharacterProjectileRuntimeUtility.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `Assets/Game/Editor/CharacterConfigJsonExporter.cs`
- `Assets/Game/Editor/CharacterActionCatalogMarkdownExporter.cs`
- `Docs/features/character_projectile_multi_stage_config_sync.md`
- `Docs/features/character_buff_config_runtime_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- Buff 伤害来源标识、跳字标签、后续统计/抗性/触发器扩展。
- 技能投射物配置、运行时投射物发射、投射物导出和角色配置工具技能页。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 旧 `.asset` 中可能仍有 Unity 序列化残留字段，代码层已不再读取；后续在 Unity 中保存资源后会自然清理。
- 如果后续需要按 Buff ID 做抗性、增伤、免疫或触发连锁，可直接读取 `DamageRequest.SourceBuffId`。

## 2026-05-28 - 角色配置工具位移与投射物条件显示优化

### 修改内容
- 优化角色配置工具中的技能位移段编辑界面，按位移类型、目标模式、冲撞、转向、穿墙、跳跃/瞬移等选项动态显示对应字段。
- 优化多段投射物编辑界面，按目标选取、发射布局、飞行类型、穿透、重复命中、爆炸和伤害来源动态显示对应字段。
- 保留原有序列化字段和运行时逻辑，不删除旧数据，只减少编辑器中不相关参数的同时展示。
- 在位移和投射物规则文档中补充编辑器条件显示规则，避免后续工具生成重新铺开全部字段。

### 修改文件
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Docs/features/skill_movement_displacement_rules.md`
- `Docs/features/character_projectile_multi_stage_config_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 角色配置工具“动作”页中的技能位移编辑体验。
- 角色配置工具“普攻/技能/连段”页中的多段投射物编辑体验。
- 位移与投射物配置文档规则。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 本次只调整编辑器显示逻辑，隐藏字段仍会保留原值并参与运行时读取。
- 如果后续新增位移类型、投射物飞行类型或散布类型，需要同步补充 `CharacterConfigToolWindow` 的条件显示判断和对应文档。
## 2026-05-28 - 角色配置特效统一支持 Prefab 与序列帧

### 修改内容
- 新增通用 `CharacterVfxDefinition`，统一支持特效 Prefab、序列帧、FPS、循环、持续时间、缩放、颜色和排序偏移。
- 投射物命中特效和爆炸特效新增结构化配置 `ImpactVfx` / `ExplosionVfx`，运行时优先播放新配置，旧 Prefab 字段继续作为回退。
- 动作帧事件新增结构化 `Vfx` 配置，继续兼容旧 `VfxPrefab` / `VfxFrames`。
- 伤害段、位移段、Buff 效果、角色出生/死亡/受击/移动/冲刺/跳跃/技能释放等入口补充统一特效配置字段。
- Buff 效果触发时接入统一特效播放，支持 Prefab 或序列帧。
- 角色配置工具增加统一中文“Prefab 或序列帧”特效配置块，并接入投射物、伤害段、位移段、Buff 效果和角色通用特效界面。
- 扩展角色配置校验器，检查新序列帧特效的 FPS、持续时间和缩放配置。
- 更新特效与投射物功能文档。

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterFrameVfxPlayer.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusController.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/features/character_projectile_multi_stage_config_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 角色配置工具特效资源配置体验。
- 投射物命中/爆炸表现。
- Buff 效果触发表现。
- 伤害段、位移段、角色通用生命周期特效的数据入口。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 本次投射物和 Buff 效果已接入运行时播放；伤害段、位移段和角色通用出生/死亡/受击等字段已进入配置入口，后续可继续接入对应运行时生命周期事件。
- 旧 Prefab 字段保留兼容，后续保存旧资源时可逐步迁移到 `CharacterVfxDefinition`。
## 2026-05-28 - 序列帧中心点尺寸配置与角色显示层级修正

### 修改内容
- 角色动画配置新增 `FramePivot` 和 `FrameWorldSize`，用于配置单帧中心点/脚底锚点和统一显示大小。
- 通用 `CharacterVfxDefinition` 新增 `FramePivot` 和 `FrameWorldSize`，所有 VFX 序列帧配置入口可设置单图锚点和显示大小。
- 角色配置工具动画页改为中文专用字段绘制，显示“单帧中心点/锚点”和“单帧显示大小”。
- 角色配置工具所有 VFX 配置块增加“序列帧中心点/锚点”和“序列帧单帧显示大小”。
- `CharacterSpriteAnimationDriver` 按动画配置修正每帧 Sprite 的 pivot 偏移和显示大小，减少不同尺寸图片导致的角色抖动/脚底不稳。
- `CharacterFrameVfxPlayer` 按 VFX 配置修正序列帧 pivot 偏移和显示大小，减少特效不同单图中心点不一致导致的跳动。
- 角色 SpriteRenderer 的运行时排序至少提升到 1，避免角色画面层级低于地面造成插入地面的视觉问题。
- 校验器新增 `FramePivot`、`FrameWorldSize` 合法性检查。
- 更新序列帧特效和第一章角色序列帧规则文档。

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterFrameVfxPlayer.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/features/chapter01_character_sequence_generation.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 角色动画序列帧显示位置和大小。
- 投射物、伤害、位移、Buff、角色通用特效等所有 VFX 序列帧配置入口。
- 角色 Sprite 与地面视觉层级关系。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 老资源默认 `FrameWorldSize = (0, 0)`，会继续使用 Sprite 原始大小；如某套帧尺寸差异明显，需要在角色配置工具中填写统一显示大小。
- 角色动画推荐 `FramePivot = (0.5, 0)`；特效推荐按实际中心点设置，通常范围爆炸用 `(0.5, 0.5)`，贴地尘土可用 `(0.5, 0)`。
## 2026-05-28 - 序列帧逐帧中心点与尺寸配置修正

### 修改内容
- 将上一版“整组序列帧统一中心点/大小”修正为“每张序列帧单独配置中心点/大小”。
- 新增 `CharacterFramePresentationDefinition`，用于保存单帧 `Pivot`、`WorldSize` 和备注。
- `CharacterAnimationClipDefinition` 新增 `FramePresentations`，角色动画第 N 帧优先读取第 N 条逐帧表现配置。
- `CharacterVfxDefinition` 新增 `FramePresentations`，VFX 序列帧第 N 帧优先读取第 N 条逐帧表现配置。
- 角色配置工具动画页和所有 VFX 配置块增加“逐帧中心点与大小”列表。
- 角色配置工具增加“同步帧数”按钮，可按 `Frames` 数量自动补齐逐帧配置，并用默认中心点/默认大小初始化。
- 校验器新增逐帧配置数量、Pivot 范围和 WorldSize 非负检查。
- 更新特效和第一章角色序列帧文档，明确默认值只做兜底/同步模板，不代表整组统一。

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterFrameVfxPlayer.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/features/chapter01_character_sequence_generation.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 角色动画序列帧逐帧显示校正。
- 投射物、伤害、位移、Buff、角色通用特效等所有 VFX 序列帧逐帧显示校正。
- 角色配置工具序列帧配置体验。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 默认 `FramePivot` / `FrameWorldSize` 只作为兜底；需要精修时点击“同步帧数”后逐帧调整。
- 逐帧配置数量和 `Frames` 数量不一致时会产生校验警告，但运行时仍会对缺失项回退默认值。
## 2026-05-28 - 手机端战斗 HUD 双布局切换入口

### 修改内容
- 战斗 HUD 左上角新增“布局：默认 / 布局：扇形”切换按钮。
- `CombatCanvasHudPresenter` 新增两套手机战斗按键布局：默认底部栏布局、右下扇形操作布局。
- 扇形布局下将普攻、闪避、跳跃、交互、技能 1~4、绝技临时挂到 `MobileActionLayoutRoot`，避免被旧布局父节点限制位置。
- 扇形布局下快捷道具栏 1~6 移到右下外圈；切回默认布局时恢复到底部横向快捷栏。
- 切换扇形布局时临时关闭技能栏 `LayoutGroup`，切回默认时恢复，避免自动布局覆盖按钮坐标。
- 更新手机端战斗 HUD 文档，记录当前 MVP 先支持 4 技能 + 绝技，后续可扩展到 8 技能。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Docs/mobile_battle_hud_controls_layout_design.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗界面按钮布局。
- 快捷道具栏运行时位置。
- 手机端 HUD 后续 8 技能扩展规则。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 当前只做运行时布局切换入口，不直接修改 Prefab，避免一键生成 UI 覆盖手调布局。
- 技能系统扩到 8 个普通技能后，需要补齐 Skill5~Skill8 的按钮引用和扇形布局坐标。
## 2026-05-28 - 序列帧逐帧参数界面简化

### 修改内容
- 角色配置工具中动画序列帧改为行内编辑：每张 Sprite 后面直接显示本帧中心点和本帧大小。
- 通用 VFX 序列帧配置块同步改为行内编辑：每张 Sprite 后面直接显示中心点和大小。
- 移除编辑器界面中的复杂“逐帧中心点与大小”独立列表、“同步帧数”和“新增逐帧配置”操作。
- 编辑器绘制序列帧时自动同步 `FramePresentations` 数量到 `Frames` 数量，新增帧使用默认中心点和默认大小初始化。
- 更新序列帧配置相关文档，明确后续统一使用“图片 + 中心点 + 大小”的简单行内配置方式。

### 修改文件
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/features/chapter01_character_sequence_generation.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 角色动画序列帧配置体验。
- 投射物、伤害、位移、Buff、角色通用特效等所有 VFX 序列帧配置体验。
- 底层运行时播放逻辑和数据结构不变。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- `FramePivot` / `FrameWorldSize` 仍是默认兜底；具体每帧以行内的 `FramePresentations[index]` 为准。
- 删除 Sprite 行时会同步删除对应逐帧参数，避免数组错位。
## 2026-05-28 - 序列帧显示大小生效规则修正

### 修改内容
- 修正角色动画逐帧大小为 `(0, 0)` 时会覆盖默认显示大小的问题。
- 修正 VFX 序列帧逐帧大小为 `(0, 0)` 时会覆盖默认显示大小的问题。
- 逐帧大小某个轴为 0 时改为继承默认显示大小对应轴。
- 当最终只填写 X 或 Y 单轴大小时，运行时按 Sprite 原始宽高比自动补齐另一轴，实现等比缩放。
- 角色配置工具文案改为“大小 X/Y”，并说明 `(0, 0)` 继承默认、单轴填写会等比缩放。
- 更新序列帧相关文档，明确默认大小、逐帧大小和单轴填写的生效规则。

### 修改文件
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterFrameVfxPlayer.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/features/chapter01_character_sequence_generation.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 角色动画序列帧显示大小。
- 投射物、伤害、位移、Buff、角色通用特效等 VFX 序列帧显示大小。
- 角色配置工具序列帧大小字段说明。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 如果希望所有帧统一 4 个世界单位宽，可以填默认显示大小 X=4、Y=0；逐帧大小保持 0 会继承默认并等比缩放。
- 如果某一帧需要特殊大小，只改该帧的大小 X/Y 即可。
## 2026-05-28 - 序列帧大小无效排查与运行时脚底缩放修正

### 修改内容
- 排查确认已填写的 `WorldSize: 4x4` 位于旧通用配置 `CharacterConfig_DogHero.asset` 的 `ultimate_fire_ring` 动作中。
- 第一章场景生成器运行时玩家优先绑定 `CharacterConfig_CH01_Wangcai.asset`，该配置当前没有非 0 的序列帧大小，因此改 DogHero 不会影响第一章玩家。
- 角色配置工具顶部新增当前配置资源路径显示。
- 动画页新增当前配置资源路径和当前动画 ID 提示，方便确认是否正在编辑当前场景实际使用的配置。
- `CharacterSpriteAnimationDriver` 在更换目标 Renderer 时重新缓存基础 Transform，避免旧 Renderer 缩放缓存影响新 Renderer。
- `CharacterSpriteFootAnchor2D` 接收当前帧视觉缩放，并按缩放后的 Sprite 高度计算脚底对齐偏移，避免序列帧缩放后脚底点错位。
- 更新序列帧配置文档，补充第一章配置路径和旧 DogHero 配置的排查说明。

### 修改文件
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteFootAnchor2D.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 角色动画序列帧缩放与脚底对齐。
- 角色配置工具配置资产确认体验。
- 第一章角色配置排查流程。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 第一章玩家请优先修改 `Assets/Game/Runtime/CharacterConfigs/Chapter01/CharacterConfig_CH01_Wangcai.asset`。
- `CharacterConfig_DogHero.asset` 是旧通用/备用玩家配置，第一章场景不优先读取它。
- 某一帧配置 4x4 只会在播放到对应动作和对应帧时生效；如果想待机/移动也放大，需要在对应 `idle` / `move` 动作帧上配置。
## 2026-05-28 - 绝技序列帧大小不生效修正

### 修改内容
- 修正角色动画驱动在技能/绝技状态下把 `CurrentCastingActionId` 直接当作动画 ID 查找的问题。
- 新增动作/动画双入口解析：先按动画 ID 查找，查不到时按 `CharacterActionDefinition.ActionId` 找动作，再使用动作的 `AnimationId` 播放序列帧。
- 敌人攻击动画解析也纳入 `CharacterActionType.Ultimate`，避免同类动作被漏掉。
- 更新序列帧配置文档，明确技能/绝技可能传入 `BoundActionId`，动画驱动必须映射到动作的 `AnimationId`。

### 修改文件
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 玩家技能/绝技动作序列帧播放。
- 动作 ID 与动画 ID 不同名时的动画解析。
- 序列帧逐帧大小、中心点配置的实际运行时命中率。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 若 `BoundActionId` 与 `AnimationId` 不同名，现在会通过动作配置正确映射。
- 如果某帧大小仍未变化，请确认当前释放的绝技绑定动作、动作的 `AnimationId`、动画页正在编辑的 `AnimationId` 三者对应。
## 2026-05-28 - 受击反馈覆盖序列帧缩放修正

### 修改内容
- 排查确认 `HitFlashController2D` 在空闲状态下每帧把 `Visual.localScale` 还原为缓存值。
- 角色 SpriteRenderer 挂在 `Visual` 根节点上时，该逻辑会覆盖 `CharacterSpriteAnimationDriver` 按序列帧大小计算出的缩放，导致配置 4x4 游戏内无效。
- 修改 `HitFlashController2D.TickScalePulse`：无受击缩放脉冲时不再写 `localScale`。
- 受击缩放脉冲结束后恢复一次基准缩放并刷新缓存，避免持续覆盖动画驱动。
- 更新序列帧配置文档，记录受击反馈组件不能空闲重置 `Visual.localScale` 的规则。

### 修改文件
- `Assets/Game/Runtime/Gameplay/Combat/HitFlashController2D.cs`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 角色动画序列帧逐帧缩放显示。
- 受击闪白/抖动/缩放反馈。
- 挂在 `Visual` 根节点上的 SpriteRenderer 表现。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 如果仍看不到某帧缩放，需要继续确认是否播放到该动画该帧；但 `HitFlashController2D` 已不再在空闲帧覆盖动画缩放。
- 后续新增视觉反馈组件时，不要在空闲 Update 中持续写角色 `Visual.localScale`。
## 2026-05-28 - 序列帧逐帧大小改为缩放倍率

### 修改内容
- 将角色动画和 VFX 序列帧的逐帧 `WorldSize` 运行时语义从“目标世界尺寸”修正为“缩放倍率”。
- `2,2` 现在表示原图 2 倍，`4,4` 表示原图 4 倍，不再除以 Sprite bounds 导致差异被稀释。
- 逐帧缩放某个轴为 0 时继续继承默认缩放对应轴；最终只填 X 或 Y 时会把另一个轴补成同倍率。
- 角色配置工具中文文案改为“默认缩放倍率 / 缩放 X/Y”，并在提示中说明 `0,0` 继承和 `2,2`、`4,4` 的含义。
- 配置校验器错误提示改为中文倍率语义，避免继续显示旧的 WorldSize 误导。
- 补充文档说明：`FrameWorldSize` / `WorldSize` 字段名保留是为了兼容旧资产，实际按缩放倍率解释。

### 修改文件
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterFrameVfxPlayer.cs`
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Assets/Game/Editor/CharacterConfigValidator.cs`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/features/chapter01_character_sequence_generation.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 角色待机、移动、普攻、技能、绝技等所有角色动画序列帧逐帧缩放。
- 普通 VFX、投射物、伤害、位移、Buff、出生、死亡等所有 `CharacterVfxDefinition` 序列帧逐帧缩放。
- 角色配置工具的序列帧参数编辑和校验提示。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 旧字段名暂不迁移，避免破坏 Unity 已有 ScriptableObject 序列化；后续如果做正式数据迁移，可再新增 `FrameScale` 字段并写一次性迁移工具。
- 如果某帧仍看不出差异，优先确认当前场景实际绑定的角色配置资产、当前播放动作 ID、当前帧索引是否与正在编辑的配置一致。
## 2026-05-28 - 战斗 HUD 双端按键总容器切换修正

### 修改内容
- 修正切换到手机端扇形按键布局后，PC 端技能栏和基础操作背景仍残留的问题。
- `CombatCanvasHudPresenter` 新增 PC 操作总组、PC 基础操作总组、手机操作总组引用。
- 手机扇形布局现在先把按钮迁移到 `MobileActionLayoutRoot`，再关闭 `BottomCenter/CombatCluster` 和 `BottomLeft/BasicControls`。
- 切回默认布局时恢复按钮原父节点，重新启用 PC 操作总组，并关闭手机操作总组。
- 生成态战斗 HUD 预制体链路新增默认关闭的 `MobileActionLayoutRoot`，并绑定到 Presenter，后续重建不会丢失双端总容器。
- 更新手机端战斗 HUD 文档，明确后续应切换总预制体/总容器，而不是只移动单个按钮。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Docs/mobile_battle_hud_controls_layout_design.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 战斗 HUD 默认 PC 操作布局。
- 战斗 HUD 手机端扇形操作布局。
- 生成态/覆盖态战斗 HUD 预制体后续重建链路。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 当前仍沿用同一套按钮实例迁移到手机总容器，避免重复绑定输入事件；后续如果拆成两套独立 PC/Mobile 按钮预制体，需要保证只启用当前模式对应的总根节点。
- 若已有覆盖预制体缺少 `MobileActionLayoutRoot`，运行时会自动创建；建议下次通过界面工具同步战斗覆盖结构。
## 2026-05-28 - 技能详情增加角色动作序列帧预览

### 修改内容
- 调整后台技能界面详情预览逻辑：点击技能后，右侧 `SkillPreviewPanel/PreviewViewport` 优先循环播放当前角色配置中该技能绑定动作的角色动画序列帧。
- 技能与角色配置的匹配从引用比较改为兼容技能 `Id` 比较，避免运行时技能实例不同导致找不到绑定动作。
- 预览帧解析顺序改为：技能 `BoundActionId` -> 角色动作 `AnimationId` -> 角色动画 `Frames`；如果角色动画缺失，再回退到动作帧事件中的 `VfxFrames`；最后回退技能图标。
- 生成态后台菜单预制体绑定 `_skillDetailPreviewImage` 到技能详情预览视口，后续重建 UI 不会丢失预览引用。
- 更新技能预览相关文档，明确技能详情优先播放角色动作序列帧。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/skill_panel_ui_prefab_layout_design.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 后台技能界面右侧技能详情预览窗口。
- 角色技能配置中 `RuntimeSkillDefinition`、`BoundActionId`、动作 `AnimationId` 与动画 `Frames` 的展示联动。
- 后台菜单生成态/覆盖态预制体后续重建链路。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 若某个技能详情仍只显示图标，需要检查当前角色配置里是否存在该技能对应的 `CharacterSkillEntryDefinition`，并确认 `BoundActionId` 能找到动作、动作 `AnimationId` 能找到动画帧。
- 当前预览窗口为轻量 `Image` 循环序列帧，不播放真实位移、碰撞、投射物或多层 VFX；后续如需要完整战斗演示，可升级为独立 Preview Root 或 RenderTexture 预览。
## 2026-05-28 - 角色信息合并到装备页

### 修改内容
- 去除后台菜单独立“角色”页入口，旧角色页请求会重定向到装备页。
- 在装备页左侧下方新增 `CharacterStatsPanel` 角色数值分栏。
- 角色数值分栏改为两列属性卡，每项包含属性图标色块、中文属性名和当前数值。
- 属性分栏显示生命、法力、攻击、法强、防御、暴击、暴伤、移速、技能范围、技能半径、技能威力、投射物数量/速度。
- 同步 UI 生成器，后续一键生成后台 UI 时不再生成独立 `CharacterPage`，装备页会直接生成角色数值分栏。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Docs/features/inventory_ui_prefab_sync.md`
- `Docs/backend_menu_equipment_skill_settings_design.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 后台菜单顶部标签与页面切换。
- 装备 / 背包页面左侧角色信息区域。
- 后台 UI 一键生成与覆盖体继承结构。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 角色数值图标当前为不同颜色的占位色块，正式美术资源到位后可替换为属性图标 Sprite。
- 若旧覆盖体仍保留独立 `CharacterPage` 子节点，运行时会隐藏并重定向；建议后续通过后台 UI 同步入口刷新覆盖结构。
## 2026-05-28 - 技能详情页预览与旧详情块清理

### 修改内容
- 修正后台技能页详情正文绑定优先级，优先使用 `SkillDetailSummaryPanel/PageBody`，旧 `PageBodyPanel/PageBody` 仅作为兼容兜底。
- 技能详情页顶部保留 `SkillPreviewPanel/PreviewViewport` 序列帧预览区域，点击技能后显示角色动作帧预览或技能图标兜底。
- 后台 UI 生成器使用新技能详情结构，不再生成旧的伤害信息和升级信息详情块。
- 运行时会隐藏旧覆盖体中的 `DescriptionTitle`、`PageBodyPanel`、`SkillDamageInfoPanel`、`SkillUpgradeInfoPanel`，避免旧界面覆盖新摘要。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Docs/skill_panel_ui_prefab_layout_design.md`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 后台技能界面右侧详情页布局、技能序列帧预览、技能中文摘要显示。
- 后台 UI 一键生成和覆盖体兼容链路。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 如果某个技能仍只显示图标，需要检查当前玩家角色配置里是否存在对应 `CharacterSkillEntryDefinition`，并确认 `BoundActionId`、动作 `AnimationId`、动画 `Frames` 的引用链完整。
- 旧覆盖体可以继续运行时兼容，但建议后续通过后台 UI 同步工具刷新成新结构。
## 2026-05-28 - 战斗 HUD 头顶状态与手机端圆形按钮修正

### 修改内容
- 战斗 HUD 运行时强制隐藏旧 `TopLeft/PlayerCard`，不再在左上角显示玩家 HP、MP、护盾和 Buff 状态。
- 保留单位头顶 HUD 作为玩家、敌人、Boss 血条、蓝条、护盾和 Buff 的统一显示入口。
- 手机端扇形操作布局切换后，普攻、闪避、跳跃、交互、技能、绝技和快捷道具按钮统一应用圆形按钮视觉。
- 新增运行时圆形 Sprite，用于按钮底盘、圆形边框和 `CircleIconMask` 图标裁切。
- 快捷道具外圈按钮在手机端改为圆形尺寸，并隐藏外层条形背景，避免继续显示横向小矩形槽位。
- UI 生成器不再在新战斗 HUD 根预制体中实例化 `PlayerCard`，并为技能按钮生成圆形 Mask / 圆形图标结构。
- UI 生成器会生成并复用 `Assets/Game/UI/Generated/UI_CircleMask.png` 作为圆形遮罩资源。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Docs/mobile_battle_hud_controls_layout_design.md`
- `Docs/features/combat_damage_number_unit_hud_buff_feedback_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/UI/Generated/UI_CircleMask.png` 会在下次通过 UI 生成器重建战斗 HUD 时自动生成。

### 影响范围
- 战斗 HUD 左上角状态栏显示规则。
- 手机端战斗按钮、快捷道具按钮视觉结构。
- 后续一键生成战斗 HUD 的预制体结构检测与生成规则。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 如果旧覆盖体仍带 `PlayerCard`，运行时会隐藏；建议后续通过界面工具重建/同步战斗 HUD，让预制体结构也彻底移除旧节点。
- 圆形按钮当前使用程序生成的圆形遮罩和占位色，正式美术资源到位后只需替换按钮图标和边框 Sprite。
## 2026-05-29 - 修复头顶蓝条与手机端按钮点击

### 修改内容
- 修复圆形化按钮后点击无反应的问题：按钮根 `Image` 保留射线命中并继续作为 `Button.targetGraphic`。
- 保持圆形边框、圆形遮罩、图标、文字不抢点击，避免子节点阻断按钮事件。
- 快捷道具图标缓存兼容 `CircleIconMask/Icon` 新路径，手机端圆形道具按钮刷新时不会丢图标引用。
- `CombatUnitWorldHud2D` 接入 `PlayerResourceRuntime`，玩家头顶 HUD 在 HP 下方显示 MP 蓝条。
- Buff 行会根据蓝条和施法条位置自动下移，避免和蓝条重叠。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `Docs/mobile_battle_hud_controls_layout_design.md`
- `Docs/features/combat_damage_number_unit_hud_buff_feedback_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 手机端普攻、技能、绝技、快捷道具按钮点击事件。
- 玩家单位头顶 HP / MP / Buff 显示布局。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 后续继续优化圆形按钮视觉时，不要把按钮根 `Image.raycastTarget` 关闭；只关闭装饰、图标和文字的射线即可。
- 如果敌人未来也有能量/法力资源，应抽象通用资源接口，而不是只依赖 `PlayerResourceRuntime`。## 2026-05-29 - 逻辑位移与序列帧表现分层修正

### 修改内容
- 新增运行时 `Visual/SpriteFrameRoot` 层级约定，逐帧 Sprite 中心点和缩放只作用在内层表现节点。
- 运行时自动把旧 `Visual` 上的角色 SpriteRenderer 迁移到 `SpriteFrameRoot`，避免图片缩放污染视觉根节点。
- 修正脚底锚点逻辑：当内层帧节点负责中心点对齐时，不再按 Sprite 原始 pivot 二次上移 `Visual`。
- 单位软碰撞分离改为基于逻辑 XZ 平面和角色配置宽深计算，使用根节点逻辑位移应用，不再直接写 2D 刚体 Y。
- 补充表现层 / 逻辑层分离文档，明确后续不能用 Sprite bounds、帧缩放或视觉偏移参与击退和技能位移计算。

### 修改文件
- `Assets/Game/Runtime/Gameplay/World/UnitPresentationRoot2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterConfigRuntimeBridge.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteFootAnchor2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/UnitBodyCollisionFilter2D.cs`
- `Docs/features/character_sprite_foot_anchor_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 角色与敌人的序列帧中心点、逐帧缩放、脚底锚点和视觉偏移。
- 普通移动、技能位移、击退、软碰撞分离的逻辑根节点位移。
- 旧角色 / 敌人运行时层级兼容迁移。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 新生成 Prefab 推荐直接把角色 SpriteRenderer 放到 `Visual/SpriteFrameRoot`。
- 后续调击退、位移、碰撞时只读取角色根节点和 `World3D` 逻辑尺寸，不要读取 SpriteRenderer bounds。
- 如果有特殊角色需要整体视觉偏移，继续改角色配置里的 `视觉根节点手动偏移`，不要移动根节点或碰撞体来修图。

## 2026-05-29 - 修复技能跳跃位移高度残留

### 修改内容
- 修复技能跳跃 / 砸击位移段结束后，角色可能继续停留在高于地面的 Y 位置移动的问题。
- `SkillMovementExecutor2D` 每帧检查当前是否仍有 Leap / JumpSmash 段控制高度；没有活动跳跃段时立即释放技能高度覆盖。
- `SkillMovementExecutor2D.OnDisable` 增加清理，避免组件禁用、打断、场景切换时残留高度覆盖。
- `PlayerJumpController.ClearSkillHeightOverride` 改为技能高度覆盖结束时强制回到缓存地面 Y，而不是只在 Grounded 状态才归零。
- 补充技能位移文档，明确跳跃位移高度覆盖的释放规则和不能把悬空 Y 重新采样成地面高度。

### 修改文件
- `Assets/Game/Runtime/Gameplay/Characters/SkillMovementExecutor2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/PlayerJumpController.cs`
- `Docs/features/skill_movement_displacement_rules.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 技能位移中的 LeapStrike / JumpSmash 高度控制。
- 技能结束、取消、打断、组件禁用时的角色逻辑 Y 高度恢复。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 后续新增技能位移中断策略时，必须走 `StopSkillMovement` 或等价清理入口。
- 如果未来支持真实高低差地形，技能落地应接入地形高度采样，而不是使用当前悬空 Y 作为地面。

## 2026-05-29 - 投射物命中与 Buff 施加入口修正

### 修改内容
- 修正投射物在 3D/XZ 世界语义下仍按旧 XY 平面移动、测距和命中的问题。
- 投射物命中检测保留旧 2D 查询，同时增加 XZ 逻辑平面扫描和 3D 体积命中校验。
- 最近目标 / 锁定目标搜索增加逻辑扫描兜底，兼容敌人根节点、血量组件和碰撞体层级不一致。
- 新增通用 `CharacterBuffApplyDefinition`，支持启用、Buff 引用、层数、概率和必须造成伤害后施加。
- 在动作伤害段、技能范围、投射物命中三个造成伤害入口增加命中后给敌人施加 Buff 配置。
- 在动作帧事件中增加第 X 帧给自己施加 Buff / Debuff 的配置和运行时执行。
- 角色配置工具补充命中 Buff 和自身 Buff 帧事件编辑入口。

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/CharacterConfigDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatBuffApplyUtility.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CombatHitVolume3DUtility.cs`
- `Assets/Game/Runtime/Gameplay/Combat/CharacterProjectileRuntimeUtility.cs`
- `Assets/Game/Runtime/Gameplay/Combat/Projectile2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/MeleeAttackEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Combat/AreaSkillEmitter.cs`
- `Assets/Game/Runtime/Gameplay/Characters/CharacterSpriteAnimationDriver.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/features/character_projectile_multi_stage_config_sync.md`
- `Docs/features/character_buff_config_runtime_sync.md`
- `Docs/features/character_skill_frame_vfx_preview_scaling_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/Combat/CombatBuffApplyUtility.cs`

### 影响范围
- 玩家技能投射物、远程敌人投射物、投射物追踪/锁定、投射物命中伤害。
- 普攻/技能/投射物命中后给敌人施加 Buff 的配置与结算。
- 动作帧事件给自身施加 Buff 的配置与结算。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 如果投射物命中仍异常，优先检查投射物 `HitRadius`、`LogicalHeight`、目标 HurtBox 的 Y 高度和命中层 `hitMask`。
- Buff 引用需要选择角色 Buff 库中的 `CharacterBuffDefinition`，否则施加配置会被运行时跳过。

## 2026-05-29 - Buff 图标、持续伤害配置与中文枚举显示

### 修改内容
- 修复单位头顶 HUD 不读取 Buff 配置图标的问题，现在优先显示 `CharacterBuffDefinition.Icon`，未配置时才显示状态缩写。
- Buff 配置页新增“灼烧模板”和“中毒模板”，自动生成按间隔触发的持续伤害配置。
- Buff 触发器改为按触发类型显示相关字段，间隔触发会明确显示“每隔多少秒触发一次”。
- Buff 效果改为按效果类型显示相关字段，持续伤害会明确显示“每次持续伤害”、目标、伤害类型、元素类型等字段。
- 角色配置工具中本次涉及的枚举控件改为中文弹窗，包括 Buff 状态/触发/效果/目标/刷新规则、伤害类型、元素类型、动作类型、技能目标、投射物目标/布局/飞行、命中高度/表现、击退方向、帧事件类型等。

### 修改文件
- `Assets/Game/Runtime/Gameplay/Combat/CombatStatusController.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatUnitWorldHud2D.cs`
- `Assets/Game/Editor/CharacterConfigToolWindow.cs`
- `Docs/features/character_buff_config_runtime_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 单位头顶 Buff 图标显示。
- 角色配置工具 Buff 页的配置体验。
- 灼烧、中毒等持续伤害 Buff 的配置路径和可读性。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 如果某个 Buff 仍显示文字缩写，优先检查该 Buff 的 `Icon` 是否为空，以及 `ShowOnHud` 是否启用。
- 历史编辑器文件中仍有部分旧中文编码显示异常，后续可单独做一次工具文本统一整理。

## 2026-06-04 - 装备武器首饰内容集生成与图标接入

### 修改内容
- 新增装备内容集生成器，按 `equipment_weapon_accessory_content_set_design` 文档解析 10 个部位、每部位 20 件装备内容。
- 生成 200 个 `EquipmentDefinition`，包含中文名称、描述、品质、部位、需求等级、基础属性、强化配置、特效描述、套装效果和来源备注。
- 生成并绑定 200 个装备图标，按部位轮廓、套装主题色和品质边框区分。
- 背包可用定义库补充读取 `Resources.LoadAll`，避免存档或掉落引用到新装备时找不到定义。
- 背包装备详情增加套装效果显示。
- `GameBootstrapConfig` 追加一组低阶草原套样品装备，方便新存档立即体验多部位装备。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Runtime/Core/Configs/GameBootstrapConfig.asset`
- `WCDEL.Game.Editor.csproj`
- `docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Editor/EquipmentContentSetGenerator.cs`
- `Assets/Game/Runtime/Core/Configs/Resources/EquipmentContentSet/*.asset`
- `Assets/Game/Art/Icons/Equipment/ContentSet/*.png`
- `docs/features/equipment_weapon_accessory_content_set_sync.md`

### 影响范围
- 背包装备定义检索、装备详情展示、套装信息展示。
- 新存档初始装备样品。
- 后续掉落、奖励、商店和装备编辑工具可直接引用这批装备定义。

### 验证方式
- 执行 Unity 批处理入口 `WCDEL.Game.Editor.EquipmentContentSetGenerator.GenerateEquipmentContentSetForAutomation`。
- 检查生成数量：200 个装备资产、200 个图标、200 个资产 meta、200 个图标 meta。
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。

### 后续注意事项
- 当前攻速、暴击、元素伤害、技能范围等非现有结算字段写入 `SpecialEffects` 描述，后续如需真实生效，需要扩展战斗属性与套装结算模块。
- 戒指内容按奇偶分配到戒指1/戒指2，避免复制一批右戒指导致背包内容重复。

## 2026-06-05 - 宠物系统抓取孵化与内容生成接入

### 修改内容
- 继续补齐宠物系统，确认后台“宠物”页、出战宠物跟随/自动攻击、抓取交互、孵化槽和存档数据链路可用。
- 新增宠物内容生成器，生成 6 只宠物、6 个宠物技能、3 个宠物蛋、6 个宠物道具。
- 为宠物、技能、宠物蛋、捕兽绳和孵化材料生成并绑定程序化占位图标。
- 将普通捕兽绳、精制捕兽绳、草原兽蛋和孵化草追加到 `GameBootstrapConfig` 新存档初始背包中。
- 新增宠物系统实现同步文档，记录生成入口、资源目录、运行时接入和后续扩展注意事项。

### 修改文件
- `Assets/Game/Runtime/Core/Configs/GameBootstrapConfig.asset`
- `WCDEL.Game.Editor.csproj`
- `docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Editor/PetContentGenerator.cs`
- `Assets/Game/Runtime/Core/Configs/Resources/Pets/*.asset`
- `Assets/Game/Runtime/Core/Configs/Resources/PetSkills/*.asset`
- `Assets/Game/Runtime/Core/Configs/Resources/PetEggs/*.asset`
- `Assets/Game/Runtime/Core/Configs/Resources/PetItems/*.asset`
- `Assets/Game/Art/Icons/Pets/*.png`
- `Assets/Game/Art/Icons/PetSkills/*.png`
- `Assets/Game/Art/Icons/PetEggs/*.png`
- `Assets/Game/Art/Icons/Items/Pet/*.png`
- `docs/features/pet_system_capture_hatch_upgrade_ui_sync.md`

### 影响范围
- 宠物仓库、出战宠物、抓取目标、孵化界面和背包宠物道具数据来源。
- 新存档初始背包内容。
- 后续商店、掉落、任务奖励和宝箱对宠物蛋/捕兽绳的引用入口。

### 验证方式
- 执行 Unity 批处理入口 `WCDEL.Game.Editor.PetContentGenerator.GeneratePetContentForAutomation`。
- 检查生成数量：6 个宠物资产、6 个宠物技能资产、3 个宠物蛋资产、6 个宠物道具资产和对应图标。
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。

### 后续注意事项
- 当前宠物本体和 UI 图标仍是程序化占位图，正式美术接入后替换同路径 PNG 即可。
- 宠物技能中的减速、灼烧、护盾等高级效果目前先以伤害/治疗或描述表现，后续需要接入 Buff / 护盾结算。
- 精制捕兽绳的成功率加成尚未进入抓取公式，后续可扩展 `PetCaptureTarget2D.ResolveSuccessRate`。
## 2026-06-05 - 宠物序列帧资源生成与播放接入

### 修改内容
- 为 `PetDefinition` 增加宠物动作序列帧配置，支持出生、待机、移动、攻击、技能、受击、死亡 7 组动作。
- 为 `PetRuntimeActor2D` 增加轻量序列帧播放逻辑，宠物会根据跟随移动、普攻和技能释放自动切换动作。
- 扩展 `PetContentGenerator`，批量生成首批 6 只宠物的默认透明 PNG 序列帧，并写入宠物 ScriptableObject 引用。
- 生成 234 张宠物序列帧图片，覆盖草原小狼、胆小鼠、风耳兔、小火狐、药草鹿、石壳龟。
- 新增宠物序列帧同步文档，记录资源目录、动作 ID、生成入口和替换规则。

### 修改文件
- `Assets/Game/Runtime/Core/Definitions/PetDefinition.cs`
- `Assets/Game/Runtime/Gameplay/Pets/PetRuntimeActor2D.cs`
- `Assets/Game/Editor/PetContentGenerator.cs`
- `Assets/Game/Runtime/Core/Configs/Resources/Pets/*.asset`
- `docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Art/Pets/SequenceFrames/**/*.png`
- `Assets/Game/Art/Pets/SequenceFrames/**/*.meta`
- `docs/features/pet_sequence_frame_animation_generation_sync.md`

### 影响范围
- 出战宠物在战斗场景中的显示和动作表现。
- 宠物内容生成器的资源生成范围。
- 宠物定义资产的可配置字段和美术替换流程。

### 验证方式
- 执行 Unity 批处理入口 `WCDEL.Game.Editor.PetContentGenerator.GeneratePetContentForAutomation`，生成器正常退出。
- 检查 `Assets/Game/Art/Pets/SequenceFrames` 下生成 234 张 PNG。
- 检查 6 个宠物 `.asset` 均写入 `spawn/idle/move/attack/skill/hit/dead` 7 组动作引用。
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`，结果 0 warning / 0 error。

### 后续注意事项
- 当前序列帧是程序化默认图，正式美术到位后可以替换同路径 PNG 或在 `PetDefinition` 里重新指定帧。
- `hit` 和 `dead` 已有资源，但宠物运行时目前不承受敌人伤害；后续接入宠物生命值时可以直接调用对应动作。
- 新增宠物时建议复用 `PetContentGenerator` 的动作目录和动作 ID 约定，避免运行时出现找不到动作的回退。
## 2026-06-05 - 第一章环境美术资源生成与场景应用

### 修改内容
- 新增第一章环境美术生成器，覆盖地面贴图、道路贴图、透明道具、建筑、云朵等默认 PNG 资源。
- 第一章场景构建器接入环境美术生成入口，地形和道路在白盒底色上叠加可平铺 Sprite。
- 第一章场景构建器补充环境装饰散布点，包括村庄房屋、石头、树木、帐篷、营火、断桥、封印链与封印石。
- 新增云朵漂移运行时组件，支持单向漂移、循环距离、上下浮动和相位随机化。
- 交互物、采集物、宝箱、公告板、商店和复活点优先加载正式环境 Sprite，缺失时保留原占位图兜底。

### 修改文件
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `WCDEL.Game.Runtime.csproj`
- `WCDEL.Game.Editor.csproj`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Editor/Chapter01EnvironmentArtGenerator.cs`
- `Assets/Game/Runtime/Gameplay/World/CloudDrift2D.cs`
- `Docs/features/chapter01_environment_art_resource_application_sync.md`

### 影响范围
- 第一章 `CH01_FirstSigh` 场景自动生成流程。
- 第一章环境美术默认资源目录 `Assets/Game/Art/Environment/Chapter01`。
- 第一章地面、道路、建筑、静态装饰、天空云层、交互物与采集物显示。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`。
- 编译结果：0 warning / 0 error。
- 尝试执行 Unity batchmode：`WCDEL.Game.Editor.Chapter01FirstSighSceneBuilder.BuildChapter01FirstSighSceneForAutomation`。
- Unity batchmode 未完成场景生成，原因是当前项目已被另一个 Unity 实例打开，日志提示 `Multiple Unity instances cannot open the same project`。

### 后续注意事项
- 如果当前 Unity 编辑器已经打开 WCDEL，请直接在编辑器中执行 `Tools/WCDEL/Chapter01/创建或重建第一章场景` 生成 PNG 和重建场景。
- 如果需要 batchmode 自动生成，请先关闭当前打开的 WCDEL Unity 编辑器实例。
- 正式美术替换时优先替换同路径 PNG，不要移动生成器约定目录。
## 2026-06-05 - 装备槽位占位图标与测试补给入口

### 修改内容
- 修复后台背包装备页装备槽位按钮缓存和绑定流程，避免槽位可见但点击无反应。
- 为 12 个装备槽位补充未装备占位图标和中文兜底识别字，点击空槽时显示对应部位详情提示。
- 在装备页左侧快捷按钮组新增临时“测试补给”按钮，可运行时添加属性、装备、技能、物品和宠物用于验收。
- 后台 UI 预制体生成器同步生成测试按钮、槽位占位图标绑定和过期检测条件。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/BackendMenuCanvasPresenter.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_Weapon_Empty.png`
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_Helmet_Empty.png`
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_Armor_Empty.png`
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_Pants_Empty.png`
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_Shoes_Empty.png`
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_Necklace_Empty.png`
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_RingLeft_Empty.png`
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_RingRight_Empty.png`
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_Bracelet_Empty.png`
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_Belt_Empty.png`
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_Charm_Empty.png`
- `Assets/Game/Art/Icons/Equipment/Slots/UI_Icon_EquipmentSlot_Special_Empty.png`
- `Docs/features/equipment_slot_placeholder_and_debug_grant_sync.md`

### 影响范围
- 后台菜单背包/装备页槽位布局、槽位点击、详情面板、装备候选筛选。
- 运行时测试补给流程会影响当前存档会话内金币、经验、装备、技能、背包物品和宠物数据。
- 生成态后台 UI 预制体的现代化检测和重建结果。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`，结果 0 warning / 0 error。
- 检查 `Assets/Game/Art/Icons/Equipment/Slots` 下已生成 12 张透明背景装备槽位占位 PNG。

### 后续注意事项
- “测试补给”是临时开发入口，正式经济、掉落和任务奖励完善后应隐藏或移除。
- 如果项目启用了后台 UI Override 预制体，需要同步把新按钮和槽位占位节点合并到 Override 中，否则运行时可能继续加载旧覆盖体。
## 2026-06-06 - 装备页中断续做与后台覆盖体保险

### 修改内容
- 继续检查装备槽位占位图标、测试补给按钮和后台 UI 生成器改动，确认 12 张槽位占位 PNG 已落盘。
- 为后台菜单预制体加载增加旧覆盖体结构检测；如果 `Overrides/UIRoot_BackendMenuHUD.prefab` 仍缺少新按钮或槽位占位节点，编辑器加载时回退使用生成态后台预制体。
- 补充功能同步文档，记录后台 UI Override 过期时的处理方式。

### 修改文件
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Docs/features/equipment_slot_placeholder_and_debug_grant_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- 无

### 影响范围
- 编辑器场景构建或 UI 注入时加载后台菜单预制体的选择逻辑。
- 后台菜单 Override 旧结构不会再阻止新装备槽位和测试补给入口进入新建场景实例。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`，结果 0 warning / 0 error。
- 检查 `Assets/Game/Art/Icons/Equipment/Slots` 下存在 12 张装备槽位占位 PNG。

### 后续注意事项
- 旧 Override 文件本身没有被删除或重写；如果需要继续使用手工调整的后台覆盖体，仍建议在 Unity 中执行后台 UI 同步/重建后检查覆盖体层级。
## 2026-07-01 - 第一章用户环境美术图集导入与应用

### 修改内容
- 新增第一章环境图集导入脚本，支持复制源图集、自动裁切、白底透明化、完整切图归档和关键资源 ID 覆盖。
- 将用户提供的地面、石头树木物件、云朵、房屋建筑图集生成透明 PNG 并应用到第一章环境资源目录。
- 扩展第一章环境资源注册，新增亮草地、海岸地面、额外建筑和 12 张云朵资源。
- 第一章场景构建器补充亮草地、海岸记忆贴图、茶摊、农舍、小庙、营地市场、水车、庙门和 12 组漂移云。
- 修复 UI 预制体生成器中圆形遮罩贴图生成后立即设为不可读导致场景构建失败的问题。
- 已通过 Unity batchmode 重新导入资源并重建 `CH01_FirstSigh` 场景。

### 修改文件
- `Assets/Game/Editor/Chapter01EnvironmentArtGenerator.cs`
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Assets/Game/Scenes/CH01_FirstSigh.unity`
- `Docs/features/chapter01_environment_art_resource_application_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Tools/EnvironmentArt/import_chapter01_environment_pack.py`
- `Assets/Game/Art/Environment/Chapter01/SourceSheets/UserEnvironmentPack_20260701/*`
- `Assets/Game/Art/Environment/Chapter01/Imported/UserEnvironmentPack_20260701/*`
- `Assets/Game/Art/Environment/Chapter01/Ground/ENV_Ground_Shore_A.png`
- `Assets/Game/Art/Environment/Chapter01/Ground/ENV_Ground_GrassBright_A.png`
- `Assets/Game/Art/Environment/Chapter01/Buildings/BLD_Village_Inn_A.png`
- `Assets/Game/Art/Environment/Chapter01/Buildings/BLD_Village_TeaStall_A.png`
- `Assets/Game/Art/Environment/Chapter01/Buildings/BLD_Village_Temple_A.png`
- `Assets/Game/Art/Environment/Chapter01/Buildings/BLD_Village_TempleGate_A.png`
- `Assets/Game/Art/Environment/Chapter01/Buildings/BLD_Village_FarmHouse_A.png`
- `Assets/Game/Art/Environment/Chapter01/Buildings/BLD_Village_Watermill_A.png`
- `Assets/Game/Art/Environment/Chapter01/Buildings/BLD_Village_Market_A.png`
- `Assets/Game/Art/Environment/Chapter01/Sky/ENV_Cloud_Drift_G.png`
- `Assets/Game/Art/Environment/Chapter01/Sky/ENV_Cloud_Drift_H.png`
- `Assets/Game/Art/Environment/Chapter01/Sky/ENV_Cloud_Drift_I.png`
- `Assets/Game/Art/Environment/Chapter01/Sky/ENV_Cloud_Drift_J.png`
- `Assets/Game/Art/Environment/Chapter01/Sky/ENV_Cloud_Drift_K.png`
- `Assets/Game/Art/Environment/Chapter01/Sky/ENV_Cloud_Drift_L.png`

### 影响范围
- 第一章 `CH01_FirstSigh` 场景地面、道路、静态装饰、交互物、建筑和天空云层显示。
- 第一章环境资源生成和后续替换流程。
- UI 预制体生成时的圆形遮罩资源生成稳定性。

### 验证方式
- 执行 `python .\Tools\EnvironmentArt\import_chapter01_environment_pack.py --project-root .`，生成/覆盖 191 张 PNG。
- 执行 Unity batchmode：`WCDEL.Game.Editor.Chapter01EnvironmentArtGenerator.GenerateEnvironmentArtForAutomation`。
- 执行 Unity batchmode：`WCDEL.Game.Editor.Chapter01FirstSighSceneBuilder.BuildChapter01FirstSighSceneForAutomation`。
- 检查 `Assets/Game/Art/Environment/Chapter01` 下 228 张 PNG 均存在 `.meta`。
- 检查 `CH01_FirstSigh.unity` 已包含 `Cloud_CH01_L_FarDragonLayer`、`CH01_A_ENV_020`、`Path_G_ShoreMemory`、`BLD_Village_Watermill_A` 等新增节点。
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`，结果 0 warning / 0 error。

### 后续注意事项
- 后续如替换同风格图集，可复用 `Tools/EnvironmentArt/import_chapter01_environment_pack.py`，但需确认图集布局或更新映射索引。
- 地面贴图保持不透明用于平铺，云朵、建筑、物件必须保持透明四角。
- 若手工调整过 `CH01_FirstSigh` 场景，重跑场景构建器会按生成规则重建场景，请先备份手工改动。
## 2026-07-01 - 第一章竖向环境物件正视图修复

### 修改内容
- 将第一章建筑、树木、石头、宝箱、商店摊位、公告牌、采集物、复活点等竖向 Sprite 物件统一改为正视图生成，不再按 `RotationY` 做游戏内 Y 轴旋转。
- 保留地面与道路贴图的贴地平铺/旋转逻辑，避免影响地形表现。
- 新增第一章运行时兜底扶正逻辑，旧场景未重建时也会在进入第一章后把环境 Sprite 物件恢复为垂直正视图。
- 补充第一章环境美术文档中的竖向 Sprite 规则。

### 修改文件
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/features/chapter01_environment_art_resource_application_sync.md`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Assets/Game/Runtime/Gameplay/World/Chapter01UprightSpriteRuntimeFixer.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01UprightSpriteRuntimeFixer.cs.meta`

### 影响范围
- 第一章场景内透明 PNG 建筑、树木、石头、交互物、采集物和部分场景物件的姿态表现。
- 第一章旧场景运行时加载后的环境 Sprite 姿态兜底修正。
- 不影响角色、敌人、地面、道路、云层和摄像机旋转逻辑。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`，结果 0 warning / 0 error。
- 尝试执行 Unity batchmode 重建第一章场景，但当前项目已被另一个 Unity 实例打开，Unity 日志提示 `Multiple Unity instances cannot open the same project`，因此本次未能通过 batchmode 保存更新后的场景 YAML。

### 后续注意事项
- 如果需要把场景 YAML 也更新为无旋转状态，请在当前打开的 Unity 编辑器中执行 `Tools/WCDEL/Chapter01/创建或重建第一章场景`。
- 后续新增环境 PNG 时，建筑、树、石头、物件应按正视图透明背景制作；地面纹理才使用贴地平铺规则。
## 2026-07-01 - 第一章运行时卡顿优化

### 修改内容
- 降低战斗 HUD 的高频自检和 UI 写入开销，改为启动强制补齐、运行中定时补查。
- 为小地图、地图场景点、任务目标、Boss 搜索、地图追踪标记增加节流与缓存。
- 为宠物索敌、宠物技能命中、敌人玩家目标查找增加运行时缓存，减少全场查找。
- 优化第一章任务触发器，缓存区域参数并在一次性触发后停用自身 Update。
- 优化 2.5D 投影锚点、单位展示根、地面标记和世界标记，减少每帧组件查询和材质重复写入。

### 修改文件
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Assets/Game/Runtime/Gameplay/World/MapPointRegistry2D.cs`
- `Assets/Game/Runtime/Gameplay/Questing/QuestTargetLocator.cs`
- `Assets/Game/Runtime/Gameplay/Pets/PetRuntimeActor2D.cs`
- `Assets/Game/Runtime/Gameplay/Pets/PetSceneRuntimeBinder.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01QuestTrigger2D.cs`
- `Assets/Game/Runtime/Gameplay/World/CurvedWorldAnchor2D.cs`
- `Assets/Game/Runtime/Gameplay/World/UnitPresentationRoot2D.cs`
- `Assets/Game/Runtime/Gameplay/World/GroundProjectedDecal2D.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldProjectedMarker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/MapTrackedTargetGroundMarker2D.cs`
- `Docs/05_TASK_LOG.md`

### 新增文件
- `Docs/features/chapter01_runtime_performance_optimization_sync.md`

### 影响范围
- 第一章战斗场景运行时 HUD、小地图、任务追踪、地图追踪标记、宠物、敌人 AI、任务触发器和 2.5D Sprite 投影表现。
- 不改变角色操作、战斗数值、掉落、任务配置、UI 预制体结构和场景资源内容。

### 验证方式
- 执行 `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`，结果 0 warning / 0 error。
- 使用静态搜索复查主要热点，确认高频全场查找已集中到节流/缓存路径。

### 后续注意事项
- 如果进入 Unity Play 模式后仍然卡顿，下一轮建议使用 Profiler 重点检查 Sprite 透明 Overdraw、Canvas rebuild、物理碰撞器数量、云层/装饰物总量和材质批处理。
- 本次优化偏 CPU 查找和 UI 重建，未压缩图片贴图大小，也未减少场景对象数量。
## 2026-07-01 - Chapter01 environment blockers and shop interaction fix

### Modified content
- Added X/Z planar footprint blockers for upright Chapter01 trees, rocks, buildings, and large props so players and enemies cannot walk through them.
- Connected player and simple enemy movement to `PlanarBlocker2D`, with X/Z single-axis slide fallback when blocked.
- Added world interaction entries for village supply stall, wasteland camp shop, and blacksmith upgrade point.
- Added runtime fallback repair for old `CH01_FirstSigh` scenes so blockers and service interactions are available even before scene YAML is rebuilt.

### Modified files
- `Assets/Game/Runtime/Gameplay/Characters/TopDownCharacterMotor2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldInteractableBase2D.cs`
- `Assets/Game/Runtime/Gameplay/World/ShopInteractable2D.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01UprightSpriteRuntimeFixer.cs`
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `Assets/Game/Runtime/Bootstrap/GameBootstrapConfig.cs`
- `Assets/Game/Runtime/Bootstrap/GameBootstrapper.cs`
- `Assets/Game/Runtime/Bootstrap/GameSession.cs`
- `WCDEL.Game.Runtime.csproj`

### New files
- `Assets/Game/Runtime/Gameplay/World/PlanarBlocker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/BlacksmithInteractable2D.cs`
- `Docs/features/chapter01_environment_blocker_and_shop_interaction_sync.md`

### Impact
- Chapter01 environment collision, player movement, simple enemy movement, world interaction prompts, shop purchase flow, and blacksmith upgrade flow.
- Old scenes get runtime fallback service points; persistent scene YAML should still be rebuilt from Unity when the editor lock is released.

### Verification
- Ran `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false` with 0 warnings and 0 errors.
- Unity batchmode scene rebuild was attempted but blocked because another Unity instance already had this project open: `Multiple Unity instances cannot open the same project`.

### Follow-up notes
- Shop and blacksmith currently reuse the world interaction confirm overlay; they can later be replaced by full shop/blacksmith UI prefabs.
- Environment blockers should remain footprint-sized, not full sprite-sized, to avoid tree crowns and roofs over-blocking walkable space.
## 2026-07-01 - Dedicated service shop UI for Chapter01 shops and blacksmith

### Modified content
- Added a dedicated `WorldServiceShopOverlayPresenter` for world shops and blacksmith services.
- Changed `ShopInteractable2D` to open the service shop UI instead of the generic confirm dialog.
- Changed `BlacksmithInteractable2D` to open the same service UI in blacksmith mode, with upgrade target, price, current gold, and result state.
- Extended `UiPrefabFactory` with `UIRoot_WorldServiceShopOverlay.prefab` generation and a load entry.
- Extended `Chapter01FirstSighSceneBuilder` to add `Canvas_ServiceShop` above the generic interaction canvas.
- Added a runtime fallback canvas so old scenes still show the service UI even when Unity cannot rebuild prefabs/scenes yet.

### Modified files
- `Assets/Game/Runtime/Gameplay/World/ShopInteractable2D.cs`
- `Assets/Game/Runtime/Gameplay/World/BlacksmithInteractable2D.cs`
- `Assets/Game/Editor/UiPrefabFactory.cs`
- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/features/chapter01_environment_blocker_and_shop_interaction_sync.md`
- `Docs/05_TASK_LOG.md`

### New files
- `Assets/Game/Runtime/Gameplay/UI/WorldServiceShopOverlayPresenter.cs`
- `Assets/Game/Runtime/Gameplay/UI/WorldServiceShopOverlayPresenter.cs.meta`

### Impact
- Village supply stall, wasteland camp shop, and blacksmith service now have a richer dedicated service UI.
- Future generated scenes can include a separate `Canvas_ServiceShop`; old scenes use runtime fallback if the prefab is absent.

### Verification
- Ran `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false` with 0 warnings and 0 errors after the UI change.
- Attempted Unity batchmode UI prefab rebuild, but it was blocked by an existing Unity editor instance: `Multiple Unity instances cannot open the same project`.

### Follow-up notes
- When the currently open Unity editor is available, run `Tools/WCDEL/??/?????/????????????`, then rebuild Chapter01 to persist `Canvas_ServiceShop` and the generated service shop prefab.
- The runtime fallback is intentionally basic and should be treated as a safety path, not the final editable prefab layout.
## 2026-07-01 - Chapter01 second pass performance optimization

### Modified content
- Converted planar blocker movement checks to a spatial grid and cached combat team lookup in movement hot paths.
- Reduced per-frame world scans in boss reward unlock, ability gates, region triggers, respawn points, and Chapter01 sigh trigger.
- Stopped respawn points and unlocked gates from continuing Update after their state becomes final.
- Optimized POI ground markers so ring/beam meshes and material property blocks are only refreshed when parameters change.
- Reduced loot pickup player lookup and pickup distance checks.
- Added runtime renderer culling for far Chapter01 static sprites and clouds using `Renderer.forceRenderingOff`, preserving colliders and interactables.

### Modified files
- `Assets/Game/Runtime/Gameplay/World/PlanarBlocker2D.cs`
- `Assets/Game/Runtime/Gameplay/Characters/TopDownCharacterMotor2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/Combat/SimpleRangedEnemyController2D.cs`
- `Assets/Game/Runtime/Gameplay/World/BossRewardUnlock2D.cs`
- `Assets/Game/Runtime/Gameplay/World/RegionTrigger2D.cs`
- `Assets/Game/Runtime/Gameplay/World/RespawnPoint2D.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01SighSequence2D.cs`
- `Assets/Game/Runtime/Gameplay/World/AbilityLockedGate2D.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldPoiGroundMarker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/WorldProjectedMarker2D.cs`
- `Assets/Game/Runtime/Gameplay/World/GroundProjectedDecal2D.cs`
- `Assets/Game/Runtime/Gameplay/Loot/LootPickup2D.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01UprightSpriteRuntimeFixer.cs`
- `WCDEL.Game.Runtime.csproj`
- `Docs/features/chapter01_runtime_performance_optimization_sync.md`
- `Docs/05_TASK_LOG.md`

### New files
- `Assets/Game/Runtime/Gameplay/World/Chapter01RendererCulling2D.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01RendererCulling2D.cs.meta`

### Impact
- Chapter01 runtime performance, movement collision checks, static environment rendering, POI ground marker rendering, world triggers, respawn activation, boss reward unlock checks, and loot pickups.
- Does not intentionally change combat values, player controls, shop/blacksmith UI behavior, scene YAML, or art asset files.

### Verification
- Ran `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false` with 0 warnings and 0 errors.
- Re-ran static searches for hot-path full-scene lookups in modified scripts; remaining boss lookup is low-frequency and stops after final unlock.

### Follow-up notes
- If the game still feels slow, profile GPU overdraw and texture memory from transparent PNG trees/buildings/clouds.
- Consider reducing imported texture max size/compression, lowering cloud/decor density, or baking static far decoration into chunk sprites later.
## 2026-07-01 - Chapter01 render and texture performance optimization

### Modified content
- Made Chapter01 static sprite culling apply immediately on setup instead of waiting for incremental refresh.
- Reduced static sprite culling range and increased culling batch size so far trees, buildings, props, and clouds are hidden sooner.
- Applied low-cost renderer flags to Chapter01 renderers, disabling shadows, probe usage, motion vectors, and dynamic occlusion where not needed for 2D presentation.
- Paused far cloud drift components when their cloud renderers are culled, and reduced visible cloud drift update frequency.
- Changed generated Chapter01 environment texture import settings to use compression, smaller max texture sizes, and Tight Sprite Mesh for alpha sprites.
- Added an editor menu to optimize existing Chapter01 environment texture import settings.
- Updated existing Chapter01 environment `.png.meta` files to remove 2048 max texture entries and uncompressed platform entries.

### Modified files
- `Assets/Game/Runtime/Gameplay/World/Chapter01RendererCulling2D.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01UprightSpriteRuntimeFixer.cs`
- `Assets/Game/Runtime/Gameplay/World/CloudDrift2D.cs`
- `Assets/Game/Editor/Chapter01EnvironmentArtGenerator.cs`
- `WCDEL.Game.Editor.csproj`
- `Docs/features/chapter01_runtime_performance_optimization_sync.md`
- `Docs/05_TASK_LOG.md`
- `Assets/Game/Art/Environment/Chapter01/**/*.png.meta`

### New files
- `Assets/Game/Editor/Chapter01TextureImportOptimizer.cs`
- `Assets/Game/Editor/Chapter01TextureImportOptimizer.cs.meta`

### Impact
- Chapter01 rendering, transparent sprite overdraw, environment texture memory, cloud animation update cost, and future generated environment texture settings.
- Does not change original PNG image files, scene YAML layout, combat numbers, player controls, shop UI, collision blockers, or quest data.

### Verification
- Ran `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false` with 0 warnings and 0 errors.
- Verified Chapter01 environment texture meta files have 0 `maxTextureSize: 2048` entries and 0 `textureCompression: 0` entries.
- Attempted Unity batchmode execution of `WCDEL.Game.Editor.Chapter01TextureImportOptimizer.OptimizeForAutomation`, but it was blocked because the project is already open in another Unity instance.

### Follow-up notes
- In the currently open Unity editor, use `Tools/WCDEL/Chapter01/?????????????` if Unity has not automatically reimported the changed meta files.
- If runtime is still slow, use Unity Profiler to determine whether the next bottleneck is Rendering, Scripts, Physics2D, or UI Canvas rebuild.
## 2026-07-02 - ��һ���̵������̱��佻���޸�

### �޸�����
- �޸� 2.5D ģʽ�½���̽��ֻ���������ľ����жϵ����⣬��Ϊ���Ȱ� `PlanarArea2D`��Բ��/���δ�������Ե�����жϡ�
- ������ҽ��������뾶������ 2.5D ģʽ�³��ｻ��Ŀ��Ҳ����ˢ�¡�
- Ϊ��һ���̵ꡢ�����̡���������ʱ���뽻��ռ�ء�����������ʾê�㡣
- Ϊ��һ������ʱ��������Ӷ��������������������� GameSession ����Ʒ���ݳ�ʼ�����絼�·��������ȱʧ��
- ս�� HUD ������ʾ��Ϊ��ʾ��ǰ�������������� `�� F ���� xxx`��

### �޸��ļ�
- `Assets/Game/Runtime/Gameplay/World/PlayerInteractionSensor.cs`
- `Assets/Game/Runtime/Gameplay/World/Chapter01UprightSpriteRuntimeFixer.cs`
- `Assets/Game/Runtime/Gameplay/World/BlacksmithInteractable2D.cs`
- `Assets/Game/Runtime/Gameplay/UI/CombatCanvasHudPresenter.cs`
- `Docs/05_TASK_LOG.md`

### �����ļ�
- ��

### Ӱ�췶Χ
- ��һ���̵ꡢ�����̡����䡢���ﲶ׽�����罻��̽�⡣
- ս�� HUD ����ռ佻����ʾ�ı���
- ��ֱ���޸� Unity Scene YAML��Prefab ��Դ����Ʒ/װ����ֵ��

### ��֤��ʽ
- ���� `dotnet build .\WCDEL.sln /p:BuildProjectReferences=false`����� 0 ���桢0 ����
- ʹ�� `rg` ��齻����ʾ�ı�������������������Ϊ�������ġ�

### ����ע������
- �� Unity �༭�������г���ʵ��δˢ�£������½����һ�³�����������ʱ�޸���
- �����������������������ڳ�����������Ԥ������ֱ������ `PlanarArea2D` �� `InteractionPromptAnchor`������ʱ�޸���Ϊ���ס�