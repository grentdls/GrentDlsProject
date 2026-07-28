# 75. 编辑器校验规则：错误提示、依赖扫描、发布流程


> 项目：Unity 3D ACT 刷宝 ARPG  
> 批次：第五批 —— 技能编辑器 / 怪物技能编辑器 / 策划配置工具  
> 目标：让策划不改代码，也能配置玩家技能、怪物技能、Boss 阶段技能、辅助模块、Buff、VFX/SFX、数值成长、AI 使用条件与测试验收。


---

## 1. 设计目标

技能编辑器必须有严格校验。技能系统复杂，任何一个字段丢失都可能导致运行时爆错。

校验器目标：

- 阻止会导致崩溃的配置导出。
- 提醒可能影响体验的风险。
- 扫描资源依赖是否存在。
- 扫描技能被哪些职业/怪物/Boss 引用。
- 发布前生成 QA 回归清单。

---

## 2. 校验级别

```text
Error：严重错误，阻止保存/导出
Warning：风险警告，可以导出，但必须记录
Info：信息提示，不影响导出
Suggestion：优化建议，不影响导出
```

---

## 3. 通用技能校验

| 编号 | 规则 | 级别 |
|---|---|---|
| SKL001 | skillId 为空 | Error |
| SKL002 | skillId 重复 | Error |
| SKL003 | displayName 为空 | Warning |
| SKL004 | icon 为空 | Warning |
| SKL005 | category 为空 | Error |
| SKL006 | tags 为空 | Error |
| SKL007 | 技能没有任何执行事件 | Error |
| SKL008 | 技能没有冷却数据 | Warning |
| SKL009 | 技能没有消耗数据 | Warning |
| SKL010 | 已废弃技能仍被职业引用 | Warning |

---

## 4. 执行流校验

| 编号 | 规则 | 级别 |
|---|---|---|
| EXE001 | Phase 时间重叠异常 | Error |
| EXE002 | ActivePhase 缺失 | Error |
| EXE003 | 事件 triggerTime 超出技能总时长 | Error |
| EXE004 | Hitbox 事件找不到 HitboxBlock | Error |
| EXE005 | Projectile 事件找不到 ProjectileBlock | Error |
| EXE006 | 技能后摇为 0 且不是 Instant | Warning |
| EXE007 | 取消窗口早于命中帧 | Warning |
| EXE008 | 蓄力技能没有释放事件 | Error |
| EXE009 | 引导技能没有结束条件 | Error |

---

## 5. 伤害校验

| 编号 | 规则 | 级别 |
|---|---|---|
| DMG001 | DamageBlock 没有伤害类型 | Error |
| DMG002 | Hitbox 绑定不存在的 DamageBlock | Error |
| DMG003 | 投射物命中没有任何伤害或效果 | Warning |
| DMG004 | 0 冷却技能伤害超过模板上限 | Warning |
| DMG005 | DOT TickInterval 小于 0.1 秒 | Error |
| DMG006 | Boss 高伤技能没有预警 | Error |
| DMG007 | 技能满级伤害曲线异常跳跃 | Warning |
| DMG008 | 多投射物没有伤害折减 | Warning |

---

## 6. Hitbox 校验

| 编号 | 规则 | 级别 |
|---|---|---|
| HIT001 | Hitbox 尺寸为 0 | Error |
| HIT002 | Hitbox 持续时间 <= 0 | Error |
| HIT003 | 使用不存在的 Socket | Error |
| HIT004 | 命中次数无限且持续时间过长 | Warning |
| HIT005 | 目标过滤为空 | Error |
| HIT006 | Boss 全屏技能没有安全区 | Error |
| HIT007 | Hitbox 范围超过地图推荐上限 | Warning |

---

## 7. 投射物校验

| 编号 | 规则 | 级别 |
|---|---|---|
| PROJ001 | ProjectilePrefab 为空 | Error |
| PROJ002 | 速度 <= 0 且不是静止投射物 | Error |
| PROJ003 | 生命周期 <= 0 | Error |
| PROJ004 | 碰撞半径 <= 0 | Error |
| PROJ005 | 连锁次数 > 0 但无目标搜索半径 | Error |
| PROJ006 | 追踪开启但无转向速度 | Error |
| PROJ007 | 投射物数量 > 10 | Warning |
| PROJ008 | 穿透 + 连锁 + 弹跳同时过高 | Warning |

---

## 8. Buff/异常校验

| 编号 | 规则 | 级别 |
|---|---|---|
| BUF001 | BuffId 为空 | Error |
| BUF002 | Buff 可叠层但 MaxStack <= 1 | Warning |
| BUF003 | Infinite Buff 没有移除条件 | Error |
| BUF004 | DOT 没有 TickDamage | Error |
| BUF005 | Buff 图标为空但 visibleOnUI=true | Warning |
| BUF006 | Boss 可受硬控但无 BossEffectiveness | Error |
| BUF007 | Buff 修改不存在的属性 | Error |
| BUF008 | Buff 触发事件内置冷却为 0 且高频触发 | Warning |

---

## 9. 召唤校验

| 编号 | 规则 | 级别 |
|---|---|---|
| SUM001 | SummonPrefab 为空 | Error |
| SUM002 | SummonEntity 没有 AIProfile | Error |
| SUM003 | 召唤物没有上限 | Warning |
| SUM004 | 永久召唤物没有死亡清理 | Error |
| SUM005 | 召唤物技能池为空 | Warning |
| SUM006 | 继承属性超过 100% | Warning |
| SUM007 | 召唤数量过高 | Warning |

---

## 10. 表现资源校验

| 编号 | 规则 | 级别 |
|---|---|---|
| RES001 | VFX prefab 丢失 | Error |
| RES002 | SFX audio clip 丢失 | Warning |
| RES003 | AnimationState 不存在 | Error |
| RES004 | Addressable Key 不存在 | Error |
| RES005 | VFX 粒子数超过预算 | Warning |
| RES006 | 动态光数量过高 | Warning |
| RES007 | 循环 VFX 没有停止规则 | Error |
| RES008 | Boss 预警 VFX 缺失 | Error |

---

## 11. 怪物 AI 校验

| 编号 | 规则 | 级别 |
|---|---|---|
| AI001 | 怪物 SkillSet 为空 | Error |
| AI002 | 怪物没有可用普通攻击 | Error |
| AI003 | 所有技能共用长冷却且无 fallback | Error |
| AI004 | 技能范围不匹配怪物攻击距离 | Warning |
| AI005 | 远程技能不要求视线 | Warning |
| AI006 | AI 权重全为 0 | Error |
| AI007 | 条件互斥导致技能永远不可用 | Error |
| AI008 | 连续释放限制缺失 | Warning |

---

## 12. Boss 校验

| 编号 | 规则 | 级别 |
|---|---|---|
| BOS001 | Boss 没有 Phase | Error |
| BOS002 | Phase 没有退出条件 | Error |
| BOS003 | Phase 没有技能池 | Error |
| BOS004 | 转阶段没有保护 | Warning |
| BOS005 | 大范围高伤技能没有预警 | Error |
| BOS006 | 召唤波次没有上限 | Error |
| BOS007 | 场地机关没有清理条件 | Error |
| BOS008 | Enrage 没有提示 | Warning |
| BOS009 | 奖励出口没有解锁规则 | Error |

---

## 13. 数值警戒校验

```text
BalanceValidator
├── DamageBudgetCheck
├── CooldownBudgetCheck
├── AreaBudgetCheck
├── ProjectileBudgetCheck
├── DOTBudgetCheck
├── BossReactionTimeCheck
└── MonsterDensityCheck
```

数值校验不是绝对报错，而是提示异常。

示例：

```text
Warning：技能 SKL_Player_Ranger_MultiShot_001 在 5 个投射物时总伤害预算超过同级模板 185%。
```

---

## 14. 依赖扫描

技能发布前要扫描依赖关系。

```text
DependencyScanResult
├── usedByClasses[]
├── usedByMonsters[]
├── usedByBosses[]
├── usedByItems[]
├── usedByTalents[]
├── usedBySupportModules[]
├── referencedVFX[]
├── referencedSFX[]
├── referencedAnimations[]
└── referencedPrefabs[]
```

用途：

- 删除技能前提示影响范围。
- 修改技能前生成回归范围。
- 打包前确认资源完整。

---

## 15. 发布流程

```text
Draft 草稿
→ Validate 单技能校验
→ Sandbox Test 沙盒测试
→ InReview 提交审核
→ Batch Validate 批量校验
→ Export Json 导出
→ QA Regression QA 回归
→ Approved 通过
→ Released 发布
```

---

## 16. 发布前检查清单

玩家技能：

```text
技能能释放
命中正常
伤害正常
资源消耗正常
冷却正常
UI 显示正常
辅助模块兼容正常
无 Missing Reference
无运行时报错
```

怪物技能：

```text
AI 能选择技能
技能条件正确
玩家有反应时间
群怪性能正常
死亡清理正常
```

Boss 技能：

```text
阶段正常
转阶段正常
大招有预警
安全区明确
奖励门解锁
场地机关清理
```

---

## 17. 错误提示格式

错误必须能定位字段。

```text
[Error][DMG002]
技能：SKL_Player_Warrior_IronCleave_001
字段：HitboxBlock.hitbox_01.damageBlockId
问题：绑定的 DamageBlock 不存在：dmg_99
修复：请选择已有 DamageBlock，或新建 dmg_99。
```

---

## 18. 一键修复建议

部分错误可以提供 Auto Fix。

| 问题 | Auto Fix |
|---|---|
| displayName 为空 | 用 internalName 填充 |
| icon 为空 | 设置默认技能图标 |
| 冷却数据为空 | 创建默认冷却 0 |
| 消耗数据为空 | 创建默认 ManaCost 0 |
| VFX stopOnSkillEnd 缺失 | 设置 true |
| Addressable Key 缺失 | 根据资源路径生成建议 Key |

---

## 19. 导出阻断规则

只要有以下错误，禁止导出：

```text
SkillID 重复
引用资源丢失
执行流事件找不到目标块
Hitbox 没有尺寸
Projectile 没有 Prefab
Boss 阶段没有退出条件
怪物无可用技能
Buff 无限持续且没有移除规则
```

---

## 20. QA 回归单自动生成

根据依赖扫描生成：

```text
修改了铁裂斩
影响：重甲战士、荒怒蛮王、技能商人售卖表、新手教学任务
需要回归：
1. 战士新手流程
2. 技能商人购买
3. 装备近战伤害词条
4. 辅助模块：范围扩大、流血附加
5. 第一章普通怪清怪速度
```
