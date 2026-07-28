# 74. 配置导入导出：JSON、ScriptableObject、Excel、热更新、版本控制


> 项目：Unity 3D ACT 刷宝 ARPG  
> 批次：第五批 —— 技能编辑器 / 怪物技能编辑器 / 策划配置工具  
> 目标：让策划不改代码，也能配置玩家技能、怪物技能、Boss 阶段技能、辅助模块、Buff、VFX/SFX、数值成长、AI 使用条件与测试验收。


---

## 1. 设计目标

技能配置要支持三种工作方式：

1. **Unity 内可视化编辑**：ScriptableObject 保存资源引用。
2. **表格批量编辑**：CSV/Excel 批量改数值。
3. **运行时加载**：导出 JSON 给游戏读取，支持热更新。

---

## 2. 数据分层

```text
编辑态 ScriptableObject
→ 导出中间 JSON
→ 构建运行态二进制/JSON
→ 游戏运行时加载 RuntimeSkillDatabase
```

### 2.1 编辑态

优点：

- 可以拖 Prefab、Sprite、AudioClip、VFX。
- Inspector 友好。
- 和 Unity 资源系统结合。

缺点：

- 不适合热更新。
- Diff 可读性较差。

### 2.2 JSON 运行态

优点：

- 可热更新。
- 方便版本 Diff。
- 可由服务器/工具链处理。

缺点：

- 不能直接引用 Unity 资源对象，只能引用 Addressable Key。

---

## 3. 配置资产类型

```text
SkillDefinition.asset
SupportModuleDefinition.asset
BuffDefinition.asset
SummonEntityDefinition.asset
AreaDefinition.asset
MonsterSkillSet.asset
BossSkillSet.asset
SkillBalanceTemplate.asset
SkillTagLibrary.asset
```

---

## 4. 导出文件清单

```text
StreamingAssets/Balance/
├── skills_player.json
├── skills_monster.json
├── skills_boss.json
├── support_modules.json
├── buffs.json
├── summons.json
├── areas.json
├── monster_skill_sets.json
├── boss_skill_sets.json
├── skill_tags.json
├── skill_balance_templates.json
└── manifest.json
```

---

## 5. manifest.json

```json
{
  "version": "0.5.0",
  "buildTime": "2026-07-03T00:00:00+09:00",
  "dataVersion": 65,
  "files": [
    {"path": "skills_player.json", "hash": "...", "count": 120},
    {"path": "skills_monster.json", "hash": "...", "count": 80},
    {"path": "boss_skill_sets.json", "hash": "...", "count": 12}
  ]
}
```

---

## 6. 资源引用规则

运行态 JSON 不存 Unity Object，存 Addressable Key。

```text
iconKey = "Icon/Skills/Warrior/IronCleave"
vfxKey = "VFX/Skills/Warrior/IronCleave/Slash"
sfxKey = "SFX/Skills/Warrior/IronCleave/Hit"
prefabKey = "Prefabs/Projectiles/Arrow_Normal"
```

导出前必须检查 Key 是否存在。

---

## 7. Excel/CSV 导入范围

不是所有字段都适合表格。推荐只让表格管理数值字段。

适合 CSV：

```text
技能基础伤害
技能等级成长
冷却
消耗
范围
投射物数量
Buff 持续时间
AI 权重
怪物技能倍率
Boss 阶段血量线
```

不适合 CSV：

```text
VFX Prefab 引用
复杂事件时间轴
Hitbox 形状列表
Boss 场地对象引用
```

---

## 8. CSV 表：SkillBalance.csv

字段：

```text
skillId,level,requiredLevel,damageMultiplier,costMultiplier,cooldownMultiplier,radiusMultiplier,durationAdd,specialParam
```

示例：

```csv
skillId,level,requiredLevel,damageMultiplier,costMultiplier,cooldownMultiplier,radiusMultiplier,durationAdd,specialParam
SKL_Player_Warrior_IronCleave_001,1,1,1.00,1.00,1.00,1.00,0,
SKL_Player_Warrior_IronCleave_001,2,3,1.12,1.05,1.00,1.00,0,
```

---

## 9. CSV 表：MonsterSkillAI.csv

字段：

```text
skillSetId,slotId,skillId,weight,cooldown,rangeMin,rangeMax,angleLimit,requiresLineOfSight,maxConsecutiveUse
```

---

## 10. CSV 表：BossPhase.csv

字段：

```text
bossId,phaseIndex,phaseName,enterCondition,exitCondition,musicState,cameraRule,enrageTime
```

---

## 11. 导入策略

导入 CSV 时不直接覆盖全部数据，只覆盖指定字段。

```text
ImportMode
├── ReplaceSelectedFields
├── AppendRows
├── UpdateBySkillId
├── DryRunPreview
└── GenerateMissingRows
```

流程：

```text
选择 CSV
→ 解析表头
→ 匹配 skillId
→ 显示差异预览
→ 检查字段类型
→ 应用覆盖
→ 标记资产 Dirty
→ 自动校验
```

---

## 12. 差异预览

导入前必须显示：

```text
新增了哪些技能行
删除了哪些技能行
修改了哪些字段
旧值是多少
新值是多少
是否超过警戒线
```

示例：

```text
SKL_Player_Ranger_StormArrow_001 damageMultiplier Level 10: 2.10 → 3.80 [Warning: 增幅过大]
```

---

## 13. JSON 导出流程

```text
1. 收集所有 SkillDefinition
2. 运行 Validator
3. 阻止 Error 导出
4. 把 Unity Object 转 Addressable Key
5. 去除编辑器备注和只读字段
6. 生成 JSON
7. 计算 Hash
8. 写入 manifest
9. 输出导出报告
```

---

## 14. RuntimeSkillDatabase

运行时数据库：

```text
RuntimeSkillDatabase
├── Dictionary<string, SkillRuntimeData> playerSkills
├── Dictionary<string, SkillRuntimeData> monsterSkills
├── Dictionary<string, BossSkillSetRuntimeData> bossSkillSets
├── Dictionary<string, BuffRuntimeData> buffs
├── Dictionary<string, SupportRuntimeData> supports
└── Dictionary<string, SummonRuntimeData> summons
```

加载顺序：

```text
manifest
→ tags
→ buffs
→ supports
→ summons
→ areas
→ player skills
→ monster skills
→ skill sets
→ boss skill sets
```

---

## 15. 热更新规则

技能热更新分为两类：

### 15.1 安全热更新

可在主城/非战斗状态更新：

```text
伤害数值
消耗
冷却
AI 权重
掉落引用
文本描述
图标
```

### 15.2 非安全热更新

需要重启游戏或重载场景：

```text
修改技能执行阶段
修改 Hitbox 结构
修改投射物 Prefab
修改 Boss 阶段结构
修改 Buff 叠层模式
修改召唤物 AI 类型
```

---

## 16. 版本控制

每个技能必须有版本号。

```text
SkillPublishData
├── createdBy
├── createdTime
├── modifiedBy
├── modifiedTime
├── version
├── changeLog
├── reviewStatus
├── approvedBy
└── releaseTag
```

ReviewStatus：

```text
Draft：草稿
InReview：待审核
Approved：已通过
Released：已发布
Deprecated：废弃
```

---

## 17. 技能变更日志规范

变更日志必须写清楚：

```text
改了什么
为什么改
影响哪些职业/怪物/Boss
是否需要 QA 回归
是否影响存档
```

示例：

```text
v12：铁裂斩 Lv1-10 伤害倍率降低约 8%，原因：新手战士清怪过快。需要回归：新手第一章、战士前 10 级体验。
```

---

## 18. Git 目录建议

```text
Assets/_Project/Data/Skills/           提交 Git
Assets/_Project/Editor/SkillEditor/    提交 Git
Assets/_Project/Addressables/Skills/   提交 Git LFS，资源较大
StreamingAssets/Balance/               可提交，也可构建生成
Reports/SkillTests/                    不提交，或只提交关键报告
```

---

## 19. 防冲突策略

多人同时改技能容易冲突。建议：

```text
一个职业一个文件夹
一个技能一个 asset
一个 Boss 一个 BossSkillSet asset
数值批量表由数值策划统一导入
导入前必须拉取最新 Git
导入后立即 Validate + Export
```

---

## 20. 导出报告

```text
ExportReport
├── exportTime
├── user
├── dataVersion
├── exportedFileCount
├── skillCount
├── monsterSkillCount
├── bossSkillSetCount
├── errorCount
├── warningCount
├── changedSinceLastExport
└── fileHashes
```

---

## 21. 失败回滚

每次导出前自动备份上一次 JSON：

```text
StreamingAssets/Balance_Backup/
├── 2026_07_03_120000/
│   ├── skills_player.json
│   └── manifest.json
```

运行时如果新数据加载失败：

```text
读取新 manifest
→ 校验 hash
→ 加载数据
→ 数据依赖检查
→ 失败则回滚到上一版本
```

---

## 22. 最小实现方案

第一版实现：

```text
ScriptableObject 编辑
JSON 导出
CSV 导入等级数值
manifest 生成
校验阻止错误导出
Addressable Key 检查
简单 Diff 预览
```

第二版实现：

```text
热更新包
运行时数据重载
多人权限
审核流程
技能变更历史
可视化 Diff
```
