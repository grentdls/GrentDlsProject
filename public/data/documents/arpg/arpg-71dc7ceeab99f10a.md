# 65. 技能编辑器总览：策划工作流、权限、目录


> 项目：Unity 3D ACT 刷宝 ARPG  
> 批次：第五批 —— 技能编辑器 / 怪物技能编辑器 / 策划配置工具  
> 目标：让策划不改代码，也能配置玩家技能、怪物技能、Boss 阶段技能、辅助模块、Buff、VFX/SFX、数值成长、AI 使用条件与测试验收。


---

## 1. 设计目标

技能编辑器不是一个简单的表格窗口，而是整个战斗内容生产管线的核心工具。它需要同时服务四类内容：

1. **玩家主动技能**：近战、远程、法术、召唤、变形、诅咒、位移、防御、保留技能。
2. **玩家辅助模块**：改变技能范围、投射物、伤害类型、消耗、冷却、触发方式、连携效果。
3. **怪物技能**：普通怪、精英怪、地图词缀怪、召唤怪、远程怪、陷阱怪、突进怪。
4. **Boss 技能**：阶段技能、场地技能、机制技能、狂暴技能、召唤技能、转阶段演出。

编辑器必须让策划能完成以下事情：

- 新建技能。
- 复制技能并改成变体。
- 修改技能等级成长。
- 修改技能消耗、冷却、硬直、前摇、后摇。
- 配置伤害段数、判定形状、命中时间点。
- 配置投射物、持续区域、召唤物、Buff、Debuff。
- 配置技能动画、特效、音效、镜头震动、屏幕反馈。
- 配置怪物 AI 什么时候使用技能。
- 配置 Boss 每个阶段开放哪些技能。
- 在编辑器内直接开测试沙盒，生成玩家、怪物、假人和地图环境。
- 一键校验错误并导出运行配置。

---

## 2. 工具形态

技能编辑器分为两套：

### 2.1 Unity Editor 工具

用于正式内容生产。

路径：

```text
Unity 顶部菜单 / Tools / ARPG / Skill Editor
```

核心窗口：

```text
SkillEditorWindow
├── 顶部工具栏
├── 左侧技能列表
├── 中间配置详情
├── 右侧预览与测试
└── 底部校验与日志
```

### 2.2 运行时 Debug 工具

用于调试战斗表现。

路径：

```text
游戏内 / DebugMenu / Skill Runtime Inspector
```

功能：

- 查看当前角色装配技能。
- 查看技能冷却、消耗、当前状态。
- 查看技能 Hitbox 是否生成。
- 查看 Buff、异常、DOT、召唤物绑定关系。
- 强制释放某个技能。
- 开关无敌、无限能量、锁血假人。
- 导出本次测试战斗日志。

---

## 3. 策划工作流

### 3.1 新建玩家技能

```text
1. 打开 Skill Editor
2. 点击 New Skill
3. 选择 SkillOwnerType = Player
4. 选择 SkillCategory，例如 Melee / Projectile / Spell / Summon
5. 填写基础信息
6. 配置技能执行流
7. 配置伤害与成长
8. 配置动画和表现
9. 配置辅助模块兼容标签
10. 进入测试沙盒验证
11. 点击 Validate
12. 通过后保存
13. 导出到运行时数据
```

### 3.2 新建怪物技能

```text
1. 点击 New Skill
2. SkillOwnerType = Monster
3. 选择 MonsterSkillType：Attack / Spell / Charge / Area / Summon / BossMechanic
4. 绑定可使用怪物类型
5. 配置 AI 使用条件
6. 配置冷却、距离、角度、血量阶段、权重
7. 测试沙盒生成怪物
8. 观察 AI 使用频率
9. 通过后保存
```

### 3.3 制作 Boss 技能组

```text
1. 打开 Boss Skill Set 页面
2. 新建 BossSkillSet
3. 添加 Phase 1 / Phase 2 / Phase 3
4. 每个 Phase 绑定技能池
5. 设置技能权重、互斥组、连续释放限制
6. 设置转阶段演出技能
7. 设置场地技能和召唤技能
8. 进入 Boss Test Arena
9. 记录 3 分钟战斗技能覆盖率
10. 通过后发布
```

---




## 5. 编辑器目录结构

```text
Assets/_Project/Editor/SkillEditor/
├── Windows/
│   ├── SkillEditorWindow.cs
│   ├── SkillListPanel.cs
│   ├── SkillDetailPanel.cs
│   ├── SkillPreviewPanel.cs
│   ├── SkillValidationPanel.cs
│   └── BossSkillSetEditorWindow.cs
├── Drawers/
│   ├── DamageBlockDrawer.cs
│   ├── HitboxDrawer.cs
│   ├── ProjectileDrawer.cs
│   ├── BuffDrawer.cs
│   ├── VFXDrawer.cs
│   ├── SFXDrawer.cs
│   └── AIConditionDrawer.cs
├── Validators/
│   ├── SkillValidator.cs
│   ├── MonsterSkillValidator.cs
│   ├── BossSkillSetValidator.cs
│   ├── VFXDependencyValidator.cs
│   └── BalanceRangeValidator.cs
├── ImportExport/
│   ├── SkillJsonExporter.cs
│   ├── SkillJsonImporter.cs
│   ├── SkillCsvExporter.cs
│   └── SkillDiffTool.cs
└── Sandbox/
    ├── SkillSandboxWindow.cs
    ├── SandboxSpawner.cs
    ├── SandboxCombatLogger.cs
    └── SandboxReplayRecorder.cs
```

运行时目录：

```text
Assets/_Project/Scripts/Gameplay/Skills/
├── Runtime/
│   ├── SkillRuntime.cs
│   ├── SkillCaster.cs
│   ├── SkillExecutionContext.cs
│   ├── SkillPhaseRunner.cs
│   ├── SkillHitboxSpawner.cs
│   ├── SkillProjectileSpawner.cs
│   └── SkillEffectApplier.cs
├── Data/
│   ├── SkillDefinition.cs
│   ├── SkillLevelData.cs
│   ├── SkillDamageBlock.cs
│   ├── SkillHitboxBlock.cs
│   ├── SkillVFXBlock.cs
│   ├── SkillSFXBlock.cs
│   └── SkillAIUseRule.cs
└── Debug/
    ├── SkillRuntimeInspector.cs
    └── SkillCombatLogView.cs
```

---

## 6. 配置资产目录

```text
Assets/_Project/Data/Skills/
├── Player/
│   ├── Warrior/
│   ├── Ranger/
│   ├── Sorcerer/
│   ├── Witch/
│   └── ...
├── Monster/
│   ├── Common/
│   ├── Elite/
│   ├── Summoned/
│   └── Boss/
├── SupportModules/
├── Buffs/
├── StatusEffects/
├── SkillTags/
└── ExportedRuntimeJson/
```

---

## 7. 技能编辑器需要覆盖的技能类型

| 大类 | 子类 | 是否玩家可用 | 是否怪物可用 | 备注 |
|---|---|---:|---:|---|
| 近战打击 | 单段、连段、重击、蓄力 | 是 | 是 | 需要 Hitbox 时间轴 |
| 远程投射物 | 箭、弩、弹丸、飞刀 | 是 | 是 | 需要 Projectile 配置 |
| 法术 | 火、冰、雷、混沌、神圣 | 是 | 是 | 可不依赖武器 |
| 召唤 | 仆从、图腾、炮塔、幻影 | 是 | 是 | 需要 SummonEntity 配置 |
| 持续区域 | 地面火、冰雾、毒池、圣域 | 是 | 是 | 需要 Area 生命周期 |
| Buff | 自身强化、队友强化、姿态 | 是 | 是 | 需要叠层与刷新规则 |
| Debuff | 诅咒、脆弱、减速、易伤 | 是 | 是 | 需要目标过滤 |
| 位移 | 冲刺、翻滚、突进、闪现 | 是 | 是 | 需要移动控制锁 |
| 防御 | 格挡、护盾、减伤、反击 | 是 | 是 | 需要受击触发 |
| Boss 机制 | 转阶段、全屏技、场地机关 | 否 | 是 | 需要阶段与地图联动 |

---

## 8. 数据保存策略

建议使用双层数据：

### 8.1 编辑态数据

使用 ScriptableObject，方便 Unity 内编辑和引用资源。

```text
SkillDefinition.asset
BossSkillSet.asset
SupportModuleDefinition.asset
BuffDefinition.asset
```

### 8.2 运行态数据

发布时导出 JSON，运行时读取轻量数据。

```text
StreamingAssets/Balance/skills_player.json
StreamingAssets/Balance/skills_monster.json
StreamingAssets/Balance/skills_boss.json
StreamingAssets/Balance/support_modules.json
StreamingAssets/Balance/buffs.json
```

好处：

- 编辑器内能拖资源。
- 运行时不依赖 Editor API。
- 热更新时可以替换 JSON。
- 版本管理可以看 Diff。

---

## 9. 技能编辑器主对象关系

```text
SkillDefinition
├── BasicInfo
├── Availability
├── CostAndCooldown
├── InputBinding
├── ExecutionGraph
│   ├── Phase: CastStart
│   ├── Phase: Active
│   ├── Phase: Recovery
│   └── Phase: CancelWindow
├── DamageBlocks[]
├── HitboxBlocks[]
├── ProjectileBlocks[]
├── BuffApplyBlocks[]
├── SummonBlocks[]
├── VFXBlocks[]
├── SFXBlocks[]
├── CameraFeedbackBlocks[]
├── AIUseRules[]
├── SupportCompatibility
├── LevelScaling
└── ValidationRules
```

---

## 10. 命名规范

技能 ID 必须稳定，不随中文名变化。

```text
SKL_Player_Warrior_IronCleave_001
SKL_Player_Ranger_StormArrow_001
SKL_Monster_Beast_LeapBite_001
SKL_Boss_BlackForge_Phase2_LavaBurst_001
```

资源命名：

```text
VFX_SKL_Player_Warrior_IronCleave_Active.prefab
SFX_SKL_Player_Warrior_IronCleave_Hit.wav
ANIM_Player_Warrior_IronCleave.anim
```

---

