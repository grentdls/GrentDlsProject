# 138 击退、击飞、击倒与物理位移规则：碰撞、地形、状态机

## 1. 设计目标

击退、击飞、击倒是动作战斗反馈的重要组成部分，但不能破坏导航、穿墙、穿地、卡死。

本系统用于统一：
- Knockback 击退。
- Launch 击飞。
- Knockdown 击倒。
- Pull 拉扯。
- Airborne 浮空。
- WallHit 撞墙。
- GroundSlam 砸地。

---

## 2. 反应类型

| 类型 | 描述 | 可被谁触发 |
|---|---|---|
| Knockback | 水平后退 | 重击、爆炸、盾击 |
| Knockup | 竖直上抛 | 上挑、地爆 |
| Launch | 斜向击飞 | 巨力、Boss 技能 |
| Knockdown | 倒地 | 破韧、扫腿、重击 |
| Pull | 拉向施法者 | 黑洞、钩爪 |
| StaggerMove | 踉跄位移 | 中型重击 |
| WallBounce | 撞墙反弹 | 特殊技能 |
| GroundBounce | 落地弹起 | 连招型技能 |

---

## 3. 击退位移计算

### 3.1 基础公式

```text
finalDistance = baseDistance 
              * skillKnockbackMultiplier
              * targetWeightMultiplier
              * poiseStateMultiplier
              * terrainMultiplier
```

### 3.2 体重倍率

| 体型 | 倍率 |
|---|---|
| 小型 | 1.3 |
| 普通 | 1.0 |
| 中型 | 0.75 |
| 大型 | 0.35 |
| Boss | 0 或特殊配置 |

### 3.3 位移速度曲线

```text
0.00s: Speed 100%
0.15s: Speed 65%
0.30s: Speed 25%
0.40s: Speed 0%
```

---

## 4. 击飞规则

### 4.1 击飞参数
```text
launchVerticalPower
launchHorizontalPower
airControlLockTime
gravityMultiplier
maxAirTime
landReaction
```

### 4.2 击飞状态机

```text
Launch_Start
→ Airborne_Loop
→ Land_Light / Land_Heavy / Land_Roll
→ GetUp
```

### 4.3 空中受击
空中单位再次受击：
- 小伤害：维持浮空。
- 中伤害：改变水平速度。
- 重伤害：追加下砸或二次击飞。
- 特殊技能：空中连击。

---

## 5. 击倒规则

### 5.1 击倒触发条件
- 破韧。
- 扫腿类技能。
- 重击命中小型怪。
- 爆炸中心命中。
- Boss 特定技能命中玩家。

### 5.2 倒地流程

```text
Knockdown_Start
→ Knockdown_Loop
→ Getup_InvulnerableWindow
→ CombatIdle
```

### 5.3 倒地保护

```text
knockdownImmunityAfterGetup = 1.2s
maxKnockdownChain = 2
```

---

## 6. 碰撞处理

### 6.1 击退碰撞
击退时使用胶囊体 Sweep 检测：
- 若前方有墙，提前停止。
- 若撞墙速度足够，触发 WallHit。
- 若目标被推到悬崖边，触发边缘保护或跌落逻辑。

### 6.2 地形坡度
- 小坡：沿地面法线滑动。
- 大坡：阻挡或下滑。
- 台阶：允许轻微上台阶。
- 楼梯：视为可走表面。

### 6.3 防穿墙规则
击退位移禁止直接 SetPosition。必须通过：
- CharacterController.Move。
- Rigidbody Sweep。
- NavMeshAgent Warp 仅用于纠错。
- 自定义 Kinematic Motor。

---

## 7. 与 NavMesh 的关系

战斗位移期间：
- 暂停 NavMeshAgent 自动寻路。
- 使用战斗位移控制器。
- 位移结束后重新贴回 NavMesh。
- 如果落点不可走，寻找最近可站立点。

```text
CombatDisplacement.Start()
NavAgent.enabled = false
MoveByCurve()
SnapToNavMesh()
NavAgent.enabled = true
```

---

## 8. 玩家被击退规则

玩家被击退要更克制：
- 避免频繁丧失控制。
- Boss 大招可强击退。
- 普通小怪不应频繁击倒玩家。
- 玩家闪避成功时免疫击退。

玩家受击状态：
- LightHit：短硬直，可快速恢复。
- HeavyHit：明显后退。
- Knockdown：仅 Boss 或精英技能。
- Launch：少量特殊场景。

---

## 9. Boss 和大型怪限制
Boss 默认不被击退，但可以：
- 局部后仰。
- 脚步后撤一步。
- 破韧跪地。
- 阶段转换大硬直。
- 弱点击破时部位晃动。

---

## 10. 配置字段

```json
{
  "reactionType": "Knockback",
  "baseDistance": 2.5,
  "duration": 0.35,
  "horizontalCurve": "Curve_Knockback_Heavy",
  "verticalPower": 0,
  "canWallHit": true,
  "canFall": false,
  "interruptSkill": true,
  "disableNavMeshDuringMove": true,
  "snapToNavMeshAfterMove": true
}
```

---

## 11. 验收标准
- 击退不会穿墙。
- 击飞不会穿地。
- 击倒不会无限连。
- NavMesh 单位被击退后能重新寻路。
- Boss 不会被普通小技能推走。
- 玩家不会被普通小怪频繁控制到失去操作。
