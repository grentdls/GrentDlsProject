# 94. 锁定系统：目标选择、切换、镜头跟随与优先级


> 项目：Unity 3D ACT 刷宝 ARPG  
> 批次：第八批 - 3C 视角与操控专项  
> 目标：用第三人称自由视角 ACT 操控替代传统 2D/等距锁定视角，让玩家在刷宝、Boss 战、地牢探索中获得更强的动作控制感。  
> 参考边界：参考《永劫无间》这类第三人称动作游戏的高层 3C 思路：自由镜头、动作转向、跳跃/闪避/攀爬、锁定辅助、垂直移动与战斗镜头调度。具体参数、手感曲线、动作名称、镜头表现、输入节奏均采用本项目原创实现。


## 1. 锁定系统定位

锁定不是自动战斗。锁定的目标是帮助近战和手柄玩家稳定攻击目标、稳定镜头构图、降低 3D 空间操作成本。刷大量小怪时不能频繁抢锁，Boss 战时必须稳定。

## 2. 锁定模式

| 模式 | 说明 |
|---|---|
| NoLock | 无锁定，自由镜头 |
| SoftLock | 轻辅助，技能/攻击可朝最近目标微修正 |
| HardLock | 硬锁定，镜头和角色面向目标 |
| BossLock | Boss 专用锁定，可锁弱点/部位 |
| AimAssist | 远程瞄准辅助，不改变镜头 |

## 3. 可锁定对象

| 对象 | 是否可锁 | 说明 |
|---|---|---|
| 普通小怪 | 可锁，但优先级低 |
| 精英怪 | 可锁，优先级高 |
| 稀有怪 | 可锁，显示词缀摘要 |
| Boss 本体 | 可锁，默认 BossLock |
| Boss 弱点 | 可锁，按阶段开放 |
| 可破坏机关 | 可软锁，辅助技能命中 |
| NPC | 不参与战斗锁定 |
| 宝箱 | 不参与战斗锁定 |
| 召唤物 | 默认不锁，除非敌方召唤物威胁高 |

## 4. 目标评分公式

锁定候选目标通过评分选择：

```text
Score = 屏幕中心权重 + 距离权重 + 威胁权重 + 类型权重 + 可见性权重 + 最近攻击权重
```

### 4.1 评分字段

| 字段 | 说明 |
|---|---|
| ScreenCenterScore | 越靠近屏幕中心越高 |
| DistanceScore | 距离越近越高，但 Boss 可放宽 |
| ThreatScore | 正在攻击玩家、蓄力、精英、Boss 更高 |
| TypeScore | Boss > 精英 > 稀有 > 普通 |
| VisibilityScore | 被墙挡住则降为 0 |
| LastHitScore | 玩家最近攻击过的目标加分 |

## 5. 锁定搜索范围

| 场景 | 距离 | 屏幕范围 |
|---|---:|---|
| 普通刷怪 | 12m | 屏幕中心 70% |
| 精英战 | 18m | 屏幕中心 85% |
| Boss 战 | 40m | 特殊 Boss 区域 |
| 远程瞄准 | 25m | 准星附近 30% |

## 6. 锁定切换

### 6.1 键鼠

| 输入 | 行为 |
|---|---|
| `~` / 中键 | 开关锁定 |
| 鼠标滚轮/Alt+鼠标 | 切换目标，可选 |
| 镜头大幅拖动 | 降低当前锁定强度或切目标 |

### 6.2 手柄

| 输入 | 行为 |
|---|---|
| R3 | 开关锁定 |
| 右摇杆横向轻拨 | 左右切换锁定目标 |
| 右摇杆上/下 | 切换 Boss 弱点/部位，可选 |

## 7. 锁定保持与解除

### 7.1 保持条件

- 目标存活。
- 目标未进入不可锁状态。
- 目标距离未超过硬锁最大距离。
- 目标没有被墙体完全遮挡超过 `LockLostDelay`。

### 7.2 解除条件

| 条件 | 行为 |
|---|---|
| 目标死亡 | 自动解除或切到下一个高优先级目标 |
| 目标距离过远 | 转 SoftLock，随后解除 |
| 目标遮挡过久 | 解除 |
| 玩家手动解除 | 立即解除 |
| 进入 NPC 对话 | 暂停锁定 |
| Boss 转阶段不可攻击 | 锁 Boss 中心或阶段目标点 |

## 8. 锁定下角色朝向

锁定时角色朝向由 `CombatFacingSystem` 管：

| 状态 | 朝向规则 |
|---|---|
| 移动 | 身体大部分时间朝目标 |
| 闪避 | 侧闪/后撤保持面向目标，前闪朝目标 |
| 普攻 | 朝目标锁定点修正 |
| 重攻击 | 前摇允许小角度修正，出手后锁定 |
| 远程射击 | 上半身/武器朝目标，脚步可移动 |
| 施法 | 角色朝目标，镜头保持目标同屏 |

## 9. Boss 部位锁定

Boss 可配置多个锁定点：

```text
BossLockPoints
├── BodyCenter
├── Head
├── LeftArmWeakPoint
├── RightArmWeakPoint
├── ChestCore
└── TailWeakPoint
```

| 部位状态 | 规则 |
|---|---|
| 当前阶段开放 | 可锁定 |
| 破坏后 | 不可锁或变为低优先级 |
| 正在释放技能 | 威胁权重提高 |
| 不在视野 | 降低权重 |

## 10. 技能释放与锁定

| 技能类型 | 锁定处理 |
|---|---|
| 近战打击 | 向锁定目标微位移/转向 |
| 冲锋 | 朝目标移动，但路径会被墙截断 |
| 投射物 | 朝目标预测点发射 |
| 地面 AoE | 在目标脚下或准星位置生成 |
| 召唤 | 在角色附近或目标附近生成，按技能配置 |
| 治疗/增益 | 不受敌人锁定影响 |

## 11. 调参字段

```json
{
  "softLockDistance": 14,
  "hardLockDistance": 20,
  "bossLockDistance": 45,
  "screenCenterWeight": 0.35,
  "distanceWeight": 0.20,
  "threatWeight": 0.25,
  "typeWeight": 0.15,
  "lastHitWeight": 0.05,
  "lockLostDelay": 1.0,
  "targetSwitchCooldown": 0.18,
  "lockFacingTurnSpeed": 900,
  "softAimAngle": 12
}
```

## 12. 验收标准

- 按锁定键能锁到屏幕中心附近目标。
- 小怪堆中不会随便锁到远处无关目标。
- Boss 战不会因为 Boss 移动过快频繁丢锁。
- 右摇杆切目标可预测，不乱跳。
- 目标被墙挡住后不会无限锁穿墙。
- 锁定状态下角色攻击方向稳定。

## 13. 当前 Unity 实现映射

当前第一版运行时实现已落在：

| 规则 | 实现位置 | 状态 |
|---|---|---|
| 锁定模式 | `TargetLockMode` | 已实现 NoLock / SoftLock / HardLock / BossLock / AimAssist 枚举 |
| 可锁定对象过滤 | `CanUseCandidate` | 已实现，默认玩家只锁 Monster 队伍，排除自己/友方/NPC/宝箱 |
| SoftLock 搜索 | `FindBestTarget(TargetLockMode.SoftLock)` | 已实现，供 `ArpgCameraController` 轻辅助调用 |
| HardLock / BossLock | `ToggleLock`、`SetCurrentTarget` | 已实现，ThreatRating >= 10 自动 BossLock |
| 搜索距离档 | `softLockDistance`、`hardLockDistance`、`bossLockDistance` | 已实现，默认 14 / 20 / 45 |
| 屏幕区域档 | `normalScreenWindow`、`eliteScreenWindow`、`bossScreenWindow` | 已实现，小怪更靠中心，精英/Boss 放宽 |
| 评分公式 | `Score` | 已实现，包含屏幕中心、距离、威胁、类型、可见性、最近命中、额外优先级 |
| 最近命中加权 | `NotifyTargetHit` + `Hurtbox.Receive` | 已实现，玩家最近打过的目标短时间加分 |
| 遮挡丢锁 | `ValidateCurrentTarget` | 已实现，被墙挡住超过 `lockLostDelay` 自动换目标或解除 |
| 切换冷却 | `targetSwitchCooldown` | 已实现，默认 0.18s |
| 手柄右摇杆切换 | `UpdateStickSwitch` | 已实现，锁定中右摇杆横向轻拨切左右目标 |
| 键鼠锁定输入 | `ArpgInputReader`、`ARPG_InputActions.inputactions` | 已实现，Tab / ` / 鼠标中键 |
| 镜头 Boss 距离上限 | `ArpgCameraController.ResolveHardTarget` | 已实现，读取 `TargetLockController.CurrentLockMaxDistance` |

当前输入表：

| 操作 | 键鼠 | 手柄 |
|---|---|---|
| 开关锁定 | Tab / ` / 鼠标中键 | R3 |
| 切换左目标 | Q | D-pad Left / 锁定中右摇杆左拨 |
| 切换右目标 | R | D-pad Right / 锁定中右摇杆右拨 |

第一版暂未实现的扩展项：

- Boss 多部位锁定点的数据化还未接 BossWeakPointController；当前 BossLock 先以目标 `LockPoint` 为准。
- 远程 AimAssist 的准星 30% 区域和投射物预测点还需要和远程技能表现继续联动。
- 目标词缀摘要显示属于 HUD/单位头顶信息扩展，当前锁定系统只提供目标引用。
