# Unity《亲密城堡》战斗表现与特效逻辑规范文档

> 版本：V1.0  
> 用途：用于指导程序实现、动画制作、VFX 生成、卡牌表现绑定、Unity Prefab 搭建  
> 目标：让“玩家/敌人发动了什么攻击”不再只靠文字描述，而是通过**位移、动作、命中特效、受击动作、镜头反馈、数值反馈、结算特效**完整表现出来。  
> 表达原则：成人主题统一抽象成“亲密张力、共鸣、忍耐、失衡、结算爆发”等视觉语言，避免直接露骨表现。实际资源可根据发行平台尺度再扩展。

---

# 1. 战斗表现核心目标

## 1.1 当前问题

目前卡牌效果主要靠描述说明：

- 玩家打出卡牌后，只看到数值变化。
- 敌人攻击时，缺少主动移动与攻击动作。
- 被攻击者没有明确受击动作。
- 不同攻击卡之间缺少视觉差异。
- 喷发、高潮、破防、失败、胜利等关键节点缺少结算演出。

## 1.2 优化目标

每次卡牌或敌方行动都必须形成一个完整的表现闭环：

```text
出牌 / 敌人行动
→ 读卡 / 意图确认
→ 攻击者预备动作
→ 攻击者位移到目标前方或释放远程动作
→ 攻击动作播放
→ 攻击特效出现
→ 命中特效触发
→ 目标受击动作
→ 数值 / Buff / Debuff 反馈
→ 镜头震动 / 屏幕反馈
→ 攻击者回位
→ 战斗状态结算
```

## 1.3 核心表现原则

1. **先动作，再特效，再数值**  
   不要先跳数字再播动画。玩家需要先看到“发生了什么”。

2. **攻击者必须有参与感**  
   近身攻击要移动到目标附近；远程攻击要有施法、投射、波纹或轨迹。

3. **目标必须有受击反馈**  
   至少包含：受击动作、闪白、震动、击退、数值飘字。

4. **不同卡牌必须有节奏差异**  
   普通攻击、连击、控制、Buff、结算技不能只换颜色。

5. **关键结算必须独立演出**  
   喷发、敌方高潮、玩家失败、Boss 破防、胜利必须有独立镜头和特效。

---

# 2. 战斗表现层级

## 2.1 表现分层

每个战斗表现由 7 层组成：

```text
1. ActionLayer      角色动作层
2. MoveLayer        位移层
3. AttackVFXLayer   攻击特效层
4. HitVFXLayer      命中特效层
5. ReactLayer       受击动作层
6. UILayer          数值 / Buff / 状态反馈层
7. CameraLayer      镜头与屏幕反馈层
```

## 2.2 每层职责

| 层级 | 职责 | 示例 |
|---|---|---|
| ActionLayer | 播放角色动画 | 预备、突进、释放、收招 |
| MoveLayer | 角色移动到表现点 | 冲刺到敌人前、后撤、回位 |
| AttackVFXLayer | 攻击轨迹或施法特效 | 弧光、波纹、锁链、丝带 |
| HitVFXLayer | 命中瞬间反馈 | 火花、心形爆点、盾裂 |
| ReactLayer | 目标受击动作 | 后仰、抖动、击退、跪倒 |
| UILayer | 数值和状态变化 | 共鸣+12、挑逗+2、冷静-5 |
| CameraLayer | 镜头反馈 | 轻震、中震、慢动作、聚焦 |

---

# 3. 标准战斗表现流程

## 3.1 玩家出牌攻击流程

```text
PlayerPlayCard(card)
→ CardView 放大并飞向屏幕中央
→ CardView 快速淡出或贴到角色身旁
→ Player 播放 PreAction 动作
→ 判断卡牌表现类型
   ├─ 近身类：Player MoveTo TargetAttackPoint
   ├─ 远程类：Player 原地释放
   ├─ 全屏类：Player 原地大招动作
   └─ Buff 类：Player 原地强化动作
→ 播放 Attack 动作
→ 在命中帧触发 AttackVFX
→ 目标播放 HitReact
→ 触发 HitVFX
→ UI 数值跳动
→ Buff / Debuff 图标飞入目标状态栏
→ Player ReturnTo IdlePoint
→ 检查结算：敌方共鸣是否满、玩家忍耐是否满
```

## 3.2 敌人攻击流程

```text
EnemyTurnStart
→ 敌人意图图标放大闪烁
→ Enemy 播放 PreAction 动作
→ 判断敌方行动类型
   ├─ 近身攻击：Enemy MoveTo PlayerAttackPoint
   ├─ 远程攻击：Enemy 原地释放投射物
   ├─ Buff：Enemy 原地强化
   └─ Debuff：Enemy 对玩家释放状态特效
→ 命中帧触发玩家受击
→ 玩家忍耐值 / 冷静值变化
→ Enemy ReturnTo IdlePoint
→ 下一个敌人行动
```

## 3.3 结算表现触发流程

```text
AfterActionResolve
→ 检查敌方共鸣值 >= MaxResonance
   → 触发 EnemyClimaxSequence
→ 检查玩家忍耐值 >= MaxEndurance
   → 触发 PlayerEruptionSequence
→ 若玩家喷发次数耗尽且敌方未结算
   → 触发 PlayerFailSequence
→ 若全部敌人结算完成
   → 触发 VictorySequence
```

---

# 4. 战斗站位与位移规则

## 4.1 标准站位

以 1920 × 1080 战斗画面为基准：

| 单位 | 默认站位 | 说明 |
|---|---:|---|
| 玩家 IdlePoint | x=420, y=660 | 左侧偏下 |
| 敌人 1 IdlePoint | x=1320, y=650 | 右侧主位 |
| 敌人 2 IdlePoint | x=1500, y=540 | 右后位 |
| 敌人 3 IdlePoint | x=1120, y=760 | 右前位 |
| 玩家攻击点 | 敌人左侧 160px | 近身攻击停靠点 |
| 敌人攻击点 | 玩家右侧 160px | 敌人近身攻击停靠点 |

## 4.2 近身位移规则

### MoveToTarget

| 参数 | 推荐值 |
|---|---:|
| 移动时长 | 0.18 ~ 0.35 秒 |
| 曲线 | EaseOutCubic |
| 是否带残影 | 普通否，重击是 |
| 是否压暗背景 | 大招是 |
| 到位后等待 | 0.05 秒 |

### ReturnToIdle

| 参数 | 推荐值 |
|---|---:|
| 回位时长 | 0.22 ~ 0.45 秒 |
| 曲线 | EaseInOutSine |
| 回位残影 | 可选 |
| 回位后动作 | Idle / Breathing |

## 4.3 位移类型

| 位移类型 | 用途 | 表现 |
|---|---|---|
| DashLinear | 普通突进 | 直线快速前冲 |
| DashCurve | 挑拨 / 灵巧攻击 | 弧线绕行 |
| StepClose | 轻攻击 | 一小步靠近 |
| Blink | 魔法 / Boss 技 | 瞬移残影 |
| Retreat | 防守或回位 | 后撤滑步 |
| KnockBack | 受击击退 | 目标短距离后移 |

---

# 5. 动作类型总表

## 5.1 玩家动作 Clip

| 动作名 | 用途 | 帧数 | 时长 | 说明 |
|---|---|---:|---:|---|
| Idle | 待机 | 8 | 0.8s | 呼吸、轻微摆动 |
| PreAttack | 攻击预备 | 4 | 0.16s | 身体前倾、蓄力 |
| LightAttack | 轻攻击 | 6 | 0.24s | 快速动作 |
| HeavyAttack | 重攻击 | 10 | 0.45s | 大幅度动作 |
| ComboAttack | 连击 | 12~18 | 0.6s | 多段命中 |
| TouchAction | 轻挑拨 | 8 | 0.35s | 轻柔、近身、小幅动作 |
| ControlAction | 控制动作 | 10 | 0.45s | 抬手、命令、锁定 |
| BuffAction | 自我强化 | 10 | 0.5s | 光环聚拢 |
| Guard | 防御 | 8 | 0.4s | 护盾姿态 |
| HitLight | 轻受击 | 4 | 0.18s | 小幅后仰 |
| HitHeavy | 重受击 | 8 | 0.35s | 明显后退 |
| Stun | 眩晕 | 8 | 0.8s | 晃动、失衡 |
| EruptionStart | 喷发预兆 | 12 | 0.8s | 红光升温、临界状态 |
| EruptionLoop | 喷发表现 | 16 | 1.2s | 抽象爆发特效 |
| Fail | 失败 | 16 | 1.5s | 半跪、虚弱 |
| Victory | 胜利 | 16 | 1.5s | 站稳、收势、抬头 |

## 5.2 敌人动作 Clip

| 动作名 | 用途 | 帧数 | 时长 | 说明 |
|---|---|---:|---:|---|
| Idle | 待机 | 8 | 0.8s | 角色个性姿态 |
| IntentReady | 行动预兆 | 6 | 0.35s | 眼神、手势、蓄力 |
| LightAttack | 轻攻击 | 6 | 0.25s | 小动作攻击 |
| HeavyAttack | 重攻击 | 10 | 0.45s | 强压迫动作 |
| CharmAttack | 诱导类攻击 | 10 | 0.5s | 波纹、姿态、眼神 |
| ControlAttack | 控制类攻击 | 12 | 0.6s | 锁链、丝带、印记 |
| BuffSelf | 自我强化 | 10 | 0.5s | 光环增强 |
| HitLight | 轻受击 | 4 | 0.18s | 轻微后仰 |
| HitHeavy | 重受击 | 8 | 0.35s | 大幅后仰 / 退步 |
| Break | 破防 / 失衡 | 12 | 0.8s | 身体失去稳定 |
| ClimaxStart | 高潮预兆 | 12 | 0.8s | 粉紫光上升 |
| ClimaxLoop | 高潮结算 | 18 | 1.3s | 抽象光爆与心波 |
| Defeated | 战败 | 16 | 1.5s | 倒地 / 跪倒 / 退场 |
| Victory | 敌方胜利 | 16 | 1.5s | 俯视 / 轻笑 / 收势 |

---

# 6. 攻击表现分类

## 6.1 A 类：普通突刺 / 压迫攻击

### 用途
对应基础攻击卡、单体伤害卡。

### 表现流程
```text
玩家向目标前方冲刺
→ 播放 LightAttack / HeavyAttack
→ 释放一道红紫色刺线或弧光
→ 目标轻受击或重受击
→ 共鸣值增加
```

### 视觉关键词
- 红紫斩线
- 短距离冲刺
- 命中火花
- 目标胸前 / 身前出现心形裂光

### VFX
- VFX_ThrustTrail
- VFX_HitSpark_Light
- VFX_ResonanceAdd

---

## 6.2 B 类：连续攻击 / 多段压制

### 用途
对应连击、多段伤害、节奏攻击。

### 表现流程
```text
攻击者快速移动到目标前
→ 第一击命中，目标轻微抖动
→ 第二击命中，目标后仰
→ 第三击命中，目标明显击退
→ 每段跳出小数值，最后一段跳出总反馈
```

### 视觉关键词
- 多段残影
- 连续弧光
- 节拍线
- 小型命中火花叠加

### VFX
- VFX_ComboTrail_01
- VFX_HitSpark_Small
- VFX_HitSpark_Final
- VFX_ComboNumberPulse

---

## 6.3 C 类：轻挑拨 / 手部动作

### 用途
对应低伤害、高状态叠加卡。

### 表现流程
```text
攻击者弧线移动到目标侧前
→ 播放轻动作
→ 粉紫光点 / 心形粒子扩散
→ 目标轻受击或迷乱动作
→ 施加挑逗 / 易伤 / 迷乱
```

### 视觉关键词
- 小范围粒子
- 丝带曲线
- 心形小火
- 柔和但清晰

### VFX
- VFX_TeaseTouch
- VFX_HeartRipple
- VFX_DebuffFly_Tease

---

## 6.4 D 类：后位压制 / 背后攻击

### 用途
对应绕后、背刺、后位压制类卡牌。

### 表现流程
```text
攻击者先残影消失
→ 出现在目标背后或侧后方
→ 播放压制动作
→ 锁链 / 暗紫弧光从后方包围目标
→ 目标向前失衡
→ 回位
```

### 视觉关键词
- 残影
- 暗紫锁定线
- 背后闪现
- 目标前倾失衡

### VFX
- VFX_AfterimageBlink
- VFX_RearArc
- VFX_BackHitImpact

---

## 6.5 E 类：口部音波 / 声波攻击

### 用途
对应“插嘴”等词汇的抽象替代：使用**声波、低语、吻痕波纹、话术压迫**表达，避免露骨动作。

### 表现流程
```text
攻击者原地或近身抬头
→ 播放低语 / 声波释放动作
→ 粉紫声波环向目标扩散
→ 目标出现迷乱 / 失神受击
→ 施加挑逗、虚弱或降低防御
```

### 视觉关键词
- 声波环
- 唇形光纹可抽象为波纹
- 紫色音符粒子
- 目标头部周围旋转光圈

### VFX
- VFX_WhisperWave
- VFX_OralWave_Abstract
- VFX_DizzyHeart

---

## 6.6 F 类：控制 / 束缚攻击

### 用途
对应烙印、锁链、束缚、削弱类卡。

### 表现流程
```text
攻击者原地抬手
→ 目标脚下出现魔法阵
→ 锁链或丝带从地面升起
→ 目标进入束缚动作
→ Buff/Debuff 图标飞入状态栏
```

### 视觉关键词
- 锁链
- 丝带
- 圆形阵
- 黑紫印记

### VFX
- VFX_ChainBind
- VFX_BrandSigil
- VFX_ControlCircle

---

## 6.7 G 类：防御 / 冷静 / 忍耐控制

### 用途
对应冷静、防御、降低忍耐、护持类卡。

### 表现流程
```text
玩家原地站定
→ 蓝白光流从身体外圈旋转
→ 护盾或冷雾生成
→ 忍耐条颜色回落
→ 冷静值数字上升
```

### 视觉关键词
- 蓝白护盾
- 冷雾
- 呼吸线
- 水面涟漪

### VFX
- VFX_CalmAura
- VFX_GuardShield
- VFX_EnduranceDown

---

## 6.8 H 类：强化 / Build 成型类表现

### 用途
对应阳具改造、弹珠强化、长度/粗度/额外喷发次数等 Build 类升级。  
表现必须抽象为“武装强化、符文改造、核心嵌件、能量槽扩展”，不做露骨器官画面。

### 表现流程
```text
玩家身前浮现强化面板或符文核心
→ 一枚强化部件 / 宝石 / 弹珠符文嵌入
→ 角色周身出现短暂金红光环
→ 属性图标上升
```

### 视觉关键词
- 金属嵌件
- 宝石弹珠
- 红金符文
- 身体轮廓被强化光描边

### VFX
- VFX_ModSocket
- VFX_BeadUpgrade
- VFX_AttributeUp

---

## 6.9 I 类：全屏大招 / 终曲类

### 用途
对应稀有卡、大量共鸣、Boss 技能。

### 表现流程
```text
暂停普通节奏
→ 背景压暗
→ 攻击者进入大招姿态
→ 屏幕中央出现巨大符文或光环
→ 全屏冲击波扩散
→ 所有目标同步受击
→ 镜头中震或慢动作
```

### 视觉关键词
- 巨大心形共鸣环
- 舞台灯光
- 黑红 / 粉金冲击波
- 全屏花瓣 / 粒子

### VFX
- VFX_UltimateCharge
- VFX_StageSpotlight
- VFX_FullscreenPulse
- VFX_MassHitSpark

---

# 7. 受击表现规则

## 7.1 受击等级

| 等级 | 名称 | 用途 | 表现 |
|---|---|---|---|
| 1 | LightHit | 小伤害 | 小幅后仰 + 闪白 |
| 2 | MediumHit | 普通伤害 | 后仰 + 轻击退 + 火花 |
| 3 | HeavyHit | 重击 | 大幅后仰 + 中震 + 强火花 |
| 4 | BreakHit | 破防 | 防御碎裂 + 身体失衡 |
| 5 | FinishHit | 结算命中 | 慢动作 + 全屏光爆 |

## 7.2 受击动作组合

```text
HitReact = AnimationClip + PositionShake + Flash + HitVFX + NumberPopup
```

### 示例

```text
普通攻击命中：
HitLight + 角色闪白 0.08s + 小火花 + 数值跳字

重击命中：
HitHeavy + 击退 40px + 中火花 + 镜头轻震 + 数值放大

破防命中：
Break + 护盾碎片 + 防御图标裂开 + 音效重击
```

## 7.3 受击方向

| 攻击来源 | 受击方向 |
|---|---|
| 玩家攻击敌人 | 敌人向右 / 后方退 |
| 敌人攻击玩家 | 玩家向左 / 后方退 |
| 全屏攻击 | 原地震动 |
| 控制攻击 | 原地束缚 |
| 状态攻击 | 头部 / 身体周围环绕特效 |

---

# 8. 喷发与高潮结算表现

## 8.1 玩家喷发结算表现

> 喷发表现作为“忍耐值满后的危险结算”，需要强烈但抽象，避免露骨画面。推荐使用红白光爆、心焰喷涌、镜头拉近、粒子扩散表达。

### 触发条件
```text
PlayerEndurance >= PlayerMaxEndurance
```

### 表现流程
```text
1. 时间短暂停顿 0.2s
2. 玩家身上出现红色临界警告光
3. 忍耐条快速闪烁
4. 玩家进入 EruptionStart 动作
5. 镜头轻微拉近玩家
6. 红白光柱 / 心焰粒子向外喷涌
7. 对所有敌人或当前目标增加固定 10% 共鸣值
8. 若玩家仍有额外喷发次数：进入虚弱恢复动作
9. 若喷发次数耗尽且敌人未完成结算：触发失败流程
```

### VFX 描述

| VFX | 描述 |
|---|---|
| VFX_EruptionWarning | 忍耐条外圈红光闪烁，屏幕边缘轻微泛红 |
| VFX_EruptionBurst | 玩家中心出现红白心焰爆发，向前方扩散 |
| VFX_EruptionMist | 爆发后残留白红雾气，持续 0.8s |
| VFX_EruptionToEnemy | 一道细光线飞向敌方共鸣条，表示固定增加 10% |

### 镜头

| 参数 | 值 |
|---|---:|
| ZoomIn | 1.08 |
| Shake | Medium 0.25s |
| SlowMotion | 0.5 倍速，0.25s |
| 屏幕边缘 | 红色暗角 0.5s |

---

## 8.2 敌方高潮结算表现

> 敌方高潮值满后的表现，应当作为“目标被共鸣击破 / 失衡完成”的胜利反馈。推荐使用粉金光环、心形共鸣波、跪倒或虚弱退场动作。

### 触发条件
```text
EnemyResonance >= EnemyMaxResonance
```

### 表现流程
```text
1. 敌方共鸣条满格闪光
2. 敌人播放 ClimaxStart 动作
3. 背景轻微压暗，敌人被聚光灯照亮
4. 粉金心形波纹从敌人中心扩散
5. 敌人进入 ClimaxLoop / Break 动作
6. 大量花瓣、心形粒子、光雾扩散
7. 敌人进入 Defeated / Kneel / Retreat 状态
8. 掉落奖励或进入下一敌人判断
```

### VFX 描述

| VFX | 描述 |
|---|---|
| VFX_ClimaxWarning | 敌方共鸣条满格，边框粉金闪烁 |
| VFX_ClimaxPulse | 心形波纹由小到大扩散 3 次 |
| VFX_ClimaxBurst | 粉金光爆，中心高亮，边缘花瓣散开 |
| VFX_ClimaxAfterMist | 柔和粉紫雾气停留，随后淡出 |

### 动作建议

| 敌人类型 | 结算动作 |
|---|---|
| 普通敌人 | 后仰 → 跪倒 / 坐倒 |
| 精英敌人 | 强撑 → 失衡 → 半跪 |
| Boss | 分阶段破防 → 王座光环碎裂 → 退场 |

---

## 8.3 双方同时临界

若玩家忍耐与敌方共鸣同一动作后同时满：

```text
优先级：
1. 敌方共鸣满并被结算
2. 玩家喷发演出
3. 若敌人已全部结算，玩家不失败
4. 若仍有敌人未结算，再判断喷发次数是否耗尽
```

### 表现
- 先播敌方结算，给玩家胜利反馈。
- 再播玩家短版喷发，作为代价或余韵。
- 避免玩家明明击败敌人却立刻失败的挫败感。

---

# 9. 卡牌表现绑定规则

## 9.1 每张卡牌必须绑定的表现数据

```text
CardVisualProfile
├─ ActionTag          动作类型
├─ MoveTag            位移类型
├─ AttackVFXId        攻击特效
├─ HitVFXId           命中特效
├─ HitReactType       目标受击等级
├─ CameraShakeType    镜头震动等级
├─ SoundGroupId       音效组
├─ TimingProfileId    时间轴模板
└─ FinishTag          是否可能触发特殊结算
```

## 9.2 示例数据

```text
卡牌：试探推进
ActionTag = LightAttack
MoveTag = DashLinear
AttackVFXId = VFX_ThrustTrail
HitVFXId = VFX_HitSpark_Light
HitReactType = LightHit
CameraShakeType = Tiny
SoundGroupId = SFX_LightThrust
TimingProfileId = TP_MeleeLight
```

```text
卡牌：强势施压
ActionTag = HeavyAttack
MoveTag = DashLinear
AttackVFXId = VFX_HeavyArc
HitVFXId = VFX_HitSpark_Heavy
HitReactType = HeavyHit
CameraShakeType = Medium
SoundGroupId = SFX_HeavyImpact
TimingProfileId = TP_MeleeHeavy
```

```text
卡牌：耳边低语
ActionTag = CharmAttack
MoveTag = StepClose
AttackVFXId = VFX_WhisperWave
HitVFXId = VFX_DizzyHeart
HitReactType = StatusHit
CameraShakeType = None
SoundGroupId = SFX_Whisper
TimingProfileId = TP_StatusClose
```

---

# 10. 首发卡牌表现清单

## 10.1 起始牌表现绑定

| 卡牌 | 动作 | 位移 | 攻击特效 | 受击特效 | 受击等级 |
|---|---|---|---|---|---|
| 试探推进 | LightAttack | DashLinear | VFX_ThrustTrail | VFX_HitSpark_Light | LightHit |
| 轻抚挑拨 | TouchAction | StepClose | VFX_TeaseTouch | VFX_HeartRipple | StatusHit |
| 稳定节奏 | Guard | None | VFX_CalmAura | None | None |
| 深呼吸 | BuffAction | None | VFX_EnduranceDown | None | None |
| 再次试探 | LightAttack | DashCurve | VFX_SecondStrike | VFX_HitSpark_Light | LightHit |
| 诱导目光 | ControlAction | None | VFX_GazeLock | VFX_DizzyHeart | StatusHit |
| 低位护持 | Guard | None | VFX_GuardShield | None | None |
| 升温触碰 | TouchAction | StepClose | VFX_HeatTouch | VFX_OverheatMist | StatusHit |
| 保持距离 | RetreatAction | Retreat | VFX_BackStep | None | None |
| 小幅爆发 | HeavyAttack | DashLinear | VFX_BurstArc | VFX_HitSpark_Medium | MediumHit |

## 10.2 普通压迫系卡牌表现绑定

| 卡牌 | 表现类型 | 核心特效 |
|---|---|---|
| 连续迫近 | 多段近战 | VFX_ComboTrail_01 |
| 强势施压 | 重击 | VFX_HeavyArc |
| 角度切换 | 侧身突进 | VFX_SideCut |
| 重压下探 | 重压攻击 | VFX_DownPressure |
| 节奏压进 | Buff 预备 | VFX_RhythmStep |
| 锁定破绽 | 标记削弱 | VFX_WeakPointMark |
| 贴身压制 | 强化光环 | VFX_ClosePressureAura |
| 不容喘息 | 持续压迫 | VFX_NoBreathPulse |

## 10.3 挑逗系卡牌表现绑定

| 卡牌 | 表现类型 | 核心特效 |
|---|---|---|
| 指尖划火 | 轻触状态 | VFX_FingerSpark |
| 耳边低语 | 声波状态 | VFX_WhisperWave |
| 绕行试探 | 弧线位移 | VFX_CurveAfterimage |
| 引导升温 | 持续强化 | VFX_HeatGuideAura |
| 温柔封锁 | 控制削弱 | VFX_SoftBindRibbon |
| 心跳催化 | 状态爆发 | VFX_HeartbeatCatalyst |
| 反复撩拨 | 轻连段 | VFX_TeaseRepeat |
| 香雾蔓延 | 群体状态 | VFX_AromaMistAOE |

## 10.4 冷静系卡牌表现绑定

| 卡牌 | 表现类型 | 核心特效 |
|---|---|---|
| 调整呼吸 | 降忍耐 | VFX_BreathCalm |
| 聚神守势 | 护盾 | VFX_FocusShield |
| 清醒边界 | 净化 | VFX_ClearBoundary |
| 逆向导流 | 忍耐回落 | VFX_ReverseFlow |
| 压抑回收 | 持续冷却 | VFX_SuppressionLoop |
| 观察间隙 | 看牌 | VFX_CardPreviewEye |
| 沉着应对 | 防御强化 | VFX_ComposureBoost |
| 冷雾外衣 | 持续护持 | VFX_ColdMistCoat |

## 10.5 契约系卡牌表现绑定

| 卡牌 | 表现类型 | 核心特效 |
|---|---|---|
| 烙印契约 | 标记 | VFX_BrandSigil |
| 强制注视 | 控制 | VFX_ForcedGaze |
| 禁步锁环 | 束缚 | VFX_FootLockRing |
| 服从暗示 | 标记打击 | VFX_CommandStrike |
| 迟滞命令 | 行动减弱 | VFX_SlowCommand |
| 循环惩戒 | 反制强化 | VFX_PunishLoop |
| 权威施令 | 强命令攻击 | VFX_OrderImpact |
| 黑纱誓言 | 持续契约 | VFX_BlackVeilOath |

## 10.6 稀有卡表现绑定

| 卡牌 | 表现类型 | 核心特效 | 镜头 |
|---|---|---|---|
| 彻夜强攻 | 单体大招 | VFX_NightAssaultBurst | 中震 + 慢动作 |
| 节奏支配 | 全局强化 | VFX_RhythmDomination | 屏幕节拍闪 |
| 极限克制 | 大防御 | VFX_ExtremeControlAura | 拉近玩家 |
| 临界逆转 | 逆转技 | VFX_CriticalReverse | 时间停顿 |
| 王印加身 | 王权强化 | VFX_KingSealAura | 聚光 |
| 绝对命令 | 强控制 | VFX_AbsoluteCommand | 目标聚焦 |
| 共鸣终曲 | 全屏攻击 | VFX_ResonanceFinale | 全屏震动 |
| 月下宣誓 | 持续大强化 | VFX_MoonOath | 背景变冷 |

---

# 11. 敌方行动表现规则

## 11.1 敌方行动类型

| 行动 | 表现 | 对应图标 |
|---|---|---|
| 单体攻击 | 近身或远程压迫 | Intent_Attack |
| 多段攻击 | 连续动作，多段数值 | Intent_MultiAttack |
| 施加状态 | 原地释放波纹 | Intent_Debuff |
| 自我强化 | 自身光环增强 | Intent_Buff |
| 防御 | 护盾生成 | Intent_Defend |
| 蓄力 | 大幅预备动作 | Intent_Charge |
| 终结技 | 屏幕级预警 | Intent_Ultimate |

## 11.2 敌方近身攻击流程

```text
IntentIcon 闪烁
→ EnemyReady
→ MoveTo PlayerAttackPoint
→ EnemyAttack
→ PlayerHitReact
→ 忍耐值增加
→ EnemyReturn
```

## 11.3 敌方状态攻击流程

```text
IntentIcon 闪烁
→ EnemyCast
→ VFX_DebuffProjectile / Wave
→ PlayerStatusHit
→ Debuff 图标飞入玩家状态栏
```

## 11.4 敌方 Boss 蓄力攻击

```text
回合 1：Boss 进入蓄力动作，背景压暗，意图图标巨大化
回合 2：Boss 释放全屏攻击，玩家若无足够冷静则承受大量忍耐累积
```

---

# 12. Buff / Debuff 表现规则

## 12.1 Buff 添加表现

```text
状态特效命中目标
→ 目标身体出现 0.3s 状态光环
→ 小图标从命中特效处飞向状态栏
→ 状态栏图标弹跳一次
→ 层数数字变化
```

## 12.2 Buff 消失表现

```text
状态栏图标闪烁
→ 图标缩小淡出
→ 目标身上的对应光环消散
```

## 12.3 层数增加表现

```text
图标发光
→ 层数数字跳动
→ 若达到关键层数，图标外框变色
```

## 12.4 常见状态 VFX

| 状态 | 身体表现 | UI 表现 |
|---|---|---|
| 挑逗 | 粉红小火围绕 | 图标冒心形粒子 |
| 烙印 | 身上出现印记 | 图标黑金闪光 |
| 束缚 | 脚下锁环 | 图标链条轻晃 |
| 虚弱 | 身体灰紫 | 图标裂开 |
| 易伤 | 护盾裂纹 | 图标边缘破碎 |
| 冷静 | 蓝光外环 | 图标冰蓝闪烁 |
| 护持 | 半透明盾 | 图标盾面发光 |
| 失序 | 紫黑漩涡 | 图标抖动 |

---

# 13. 数值反馈规则

## 13.1 数值分类

| 数值 | 颜色建议 | 动画 |
|---|---|---|
| 共鸣增加 | 粉紫 / 金粉 | 向上弹跳 |
| 忍耐增加 | 红色 / 橙红 | 向上急跳并闪烁 |
| 忍耐减少 | 蓝白 | 向下回落 |
| 冷静增加 | 蓝色 | 稳定上浮 |
| 防御破碎 | 白色碎裂 | 裂开后淡出 |
| Buff 层数 | 对应状态色 | 小弹跳 |
| 暴击 / 强命中 | 金色 | 放大 + 震动 |

## 13.2 飘字时序

```text
命中帧 + 0.05s：出现伤害 / 共鸣数字
命中帧 + 0.12s：Buff 图标飞入
命中帧 + 0.18s：血条 / 共鸣条变化
命中帧 + 0.25s：状态层数确认
```

## 13.3 条形 UI 动画

### 忍耐条
- 增加时：红光从左向右冲入。
- 接近满值：外框闪烁。
- 满值：进入喷发警告。

### 共鸣条
- 增加时：粉金波纹向右推进。
- 接近满值：敌人身体出现心形脉冲。
- 满值：触发结算预兆。

---

# 14. 镜头与屏幕反馈

## 14.1 镜头震动等级

| 等级 | 用途 | 强度 | 时长 |
|---|---|---:|---:|
| None | Buff / 轻状态 | 0 | 0 |
| Tiny | 轻攻击 | 1~2px | 0.08s |
| Small | 普通攻击 | 3~5px | 0.12s |
| Medium | 重击 / 破防 | 8~12px | 0.2s |
| Large | 大招 / 结算 | 15~20px | 0.35s |

## 14.2 屏幕特效

| 特效 | 用途 | 说明 |
|---|---|---|
| ScreenFlashWhite | 命中瞬间 | 0.05s 白闪 |
| ScreenVignetteRed | 忍耐临界 | 边缘红色暗角 |
| ScreenVignettePink | 敌人结算 | 粉金边缘光 |
| BackgroundDim | 大招 | 背景压暗，突出角色 |
| TimeStop | 强命中 | 0.05~0.12s 定帧 |
| SlowMotion | 结算 | 0.3~0.8s 慢动作 |

---

# 15. 特效资源制作规则

## 15.1 特效类型

| 类型 | 制作方式 | 适用 |
|---|---|---|
| Sprite Sheet | 序列帧 | 命中火花、爆点、心波 |
| Particle System | Unity 粒子 | 雾气、花瓣、持续光点 |
| Trail Renderer | 轨迹 | 冲刺、弧光、挥击 |
| Shader Graph | 材质特效 | 闪白、溶解、流光 |
| UI Animation | UI 动效 | 条形变化、图标飞入 |

## 15.2 序列帧规格

| 特效规模 | 单帧尺寸 | 帧数 | FPS |
|---|---:|---:|---:|
| 小型命中 | 512 × 512 | 8 | 24 |
| 中型命中 | 1024 × 1024 | 12 | 24 |
| 大型爆发 | 2048 × 2048 | 16~24 | 24 |
| 全屏结算 | 3840 × 2160 | 16~30 | 24 |

## 15.3 混合模式

| 特效 | 推荐混合 |
|---|---|
| 光效 / 火花 | Additive |
| 雾气 / 丝带 | Alpha Blend |
| 黑暗能量 | Multiply / Alpha |
| 心形粒子 | Additive + Alpha |
| 屏幕边缘 | Overlay |

## 15.4 Sorting Layer

```text
Background
CharacterBackVFX
Character
CharacterFrontVFX
HitVFX
UIWorld
CardUI
PopupUI
ScreenVFX
```

---

# 16. 需要生成的核心特效清单

## 16.1 攻击特效

| ID | 名称 | 描述 | 规格 |
|---|---|---|---|
| VFX_ThrustTrail | 突刺轨迹 | 红紫直线冲刺弧光 | 1024 序列帧 |
| VFX_HeavyArc | 重击弧光 | 宽幅紫红半月斩 | 1024 序列帧 |
| VFX_ComboTrail_01 | 连击轨迹 | 多道连续弧线残影 | 1024 序列帧 |
| VFX_SideCut | 侧切轨迹 | 斜向短弧，带残影 | 1024 序列帧 |
| VFX_RearArc | 后位弧光 | 暗紫后方包围弧 | 1024 序列帧 |
| VFX_BurstArc | 小爆发弧 | 金粉混合冲击弧 | 1024 序列帧 |
| VFX_FingerSpark | 指尖火花 | 小型粉红火花 | 512 序列帧 |
| VFX_HeatTouch | 升温触碰 | 红色热流扩散 | 512 / 粒子 |

## 16.2 命中特效

| ID | 名称 | 描述 | 规格 |
|---|---|---|---|
| VFX_HitSpark_Light | 轻命中火花 | 小型粉紫爆点 | 512 序列帧 |
| VFX_HitSpark_Medium | 中命中火花 | 明显星芒与碎片 | 1024 序列帧 |
| VFX_HitSpark_Heavy | 重命中火花 | 大型爆点、碎石感 | 1024 序列帧 |
| VFX_BackHitImpact | 后位命中 | 从背后向前冲击 | 1024 序列帧 |
| VFX_BreakShards | 破防碎片 | 蓝白盾片碎裂 | 1024 序列帧 |
| VFX_CritBurst | 暴击爆点 | 金白中心强闪 | 1024 序列帧 |

## 16.3 状态特效

| ID | 名称 | 描述 | 规格 |
|---|---|---|---|
| VFX_HeartRipple | 心形涟漪 | 心形波纹扩散 | 512 / 1024 |
| VFX_WhisperWave | 低语声波 | 多层粉紫声波环 | 1024 |
| VFX_DizzyHeart | 迷乱心环 | 头部旋转小心形 | 粒子 |
| VFX_ChainBind | 锁链束缚 | 紫色锁链环绕目标 | 1024 / 粒子 |
| VFX_BrandSigil | 烙印印章 | 黑红符文烙印 | 512 |
| VFX_AromaMistAOE | 香雾蔓延 | 紫粉雾气覆盖敌方 | 粒子 |
| VFX_DisorderWarp | 失序扭曲 | 紫黑旋涡 | 1024 |

## 16.4 防御 / 冷静特效

| ID | 名称 | 描述 | 规格 |
|---|---|---|---|
| VFX_CalmAura | 冷静光环 | 蓝白呼吸环 | 粒子 / 512 |
| VFX_GuardShield | 护盾 | 半透明蓝盾 | 1024 |
| VFX_BreathCalm | 呼吸回流 | 蓝色气流回归身体 | 粒子 |
| VFX_ClearBoundary | 清醒边界 | 圆形净化波 | 1024 |
| VFX_ColdMistCoat | 冷雾外衣 | 蓝白雾气持续包裹 | 粒子 |
| VFX_ReverseFlow | 逆向导流 | 红色能量被蓝光导走 | 1024 |

## 16.5 结算特效

| ID | 名称 | 描述 | 规格 |
|---|---|---|---|
| VFX_EruptionWarning | 喷发预警 | 红色边缘和忍耐条闪烁 | UI / 屏幕 |
| VFX_EruptionBurst | 喷发爆发 | 红白心焰向外喷涌 | 2048 |
| VFX_EruptionMist | 喷发余雾 | 白红残雾淡出 | 粒子 |
| VFX_EruptionToEnemy | 溅射共鸣 | 细光线飞向敌人条 | Trail |
| VFX_ClimaxWarning | 高潮预警 | 共鸣条粉金闪烁 | UI |
| VFX_ClimaxPulse | 高潮脉冲 | 三段心形波纹 | 2048 |
| VFX_ClimaxBurst | 高潮爆发 | 粉金光爆 + 花瓣 | 2048 |
| VFX_ClimaxAfterMist | 高潮余雾 | 柔和粉紫雾气 | 粒子 |
| VFX_BossSealBreak | Boss 封印破裂 | 黑金圆阵碎裂 | 2048 |
| VFX_VictorySpotlight | 胜利聚光 | 主角脚下聚光与花瓣 | 屏幕 / 粒子 |

---

# 17. 特效生成提示词模板

## 17.1 单体攻击轨迹

```text
2D game VFX sprite sheet, fantasy gothic pink purple thrust slash trail, sharp energy streak, transparent background, additive glow, clean silhouette, 12 frames, no character, no text, no watermark
```

## 17.2 命中火花

```text
2D game hit impact VFX sprite sheet, pink purple and gold spark burst, heart-shaped energy fragments, transparent background, additive glow, centered composition, 12 frames, no character, no text
```

## 17.3 控制束缚

```text
2D fantasy control VFX sprite sheet, purple magical chains and silk ribbons forming a binding circle, gothic romantic style, transparent background, glowing runes, 16 frames, no character, no text
```

## 17.4 冷静护盾

```text
2D game shield VFX sprite sheet, blue white calm aura, translucent crystal shield, soft mist, circular breathing wave, transparent background, 12 frames, no character, no text
```

## 17.5 喷发结算特效

```text
2D game climax-like abstract eruption VFX sprite sheet, red white heart flame burst, stylized magical energy explosion, non-explicit, fantasy gothic style, transparent background, additive glow, 24 frames, no body parts, no text
```

## 17.6 敌方共鸣结算特效

```text
2D game resonance finish VFX sprite sheet, pink gold heart pulse explosion, rose petals, soft magical mist, gothic romantic fantasy style, non-explicit, transparent background, 24 frames, no body parts, no text
```

---

# 18. Unity Prefab 结构

## 18.1 单位表现 Prefab

```text
UnitView_Player / UnitView_Enemy
├─ Root
│  ├─ Shadow
│  ├─ SpriteBody
│  ├─ SpriteFace / Optional
│  ├─ WeaponOrProp / Optional
│  ├─ HitFlashOverlay
│  ├─ BuffAttachPoints
│  │  ├─ HeadPoint
│  │  ├─ ChestPoint
│  │  ├─ FootPoint
│  │  └─ BackPoint
│  └─ VFXSocket
├─ Animator
├─ UnitVFXController
├─ UnitMoveController
├─ UnitHitReactController
└─ UnitStatusIconAnchor
```

## 18.2 战斗表现管理器

```text
BattlePresentationRoot
├─ CharacterLayer
├─ MovePathLayer
├─ AttackVFXLayer
├─ HitVFXLayer
├─ WorldUILayer
├─ ScreenVFXLayer
├─ CameraController
├─ TimelineController
└─ ObjectPool_VFX
```

## 18.3 卡牌表现配置

```text
CardVisualProfile_SO
├─ CardId
├─ ActionTag
├─ MoveTag
├─ AttackVFXPrefab
├─ HitVFXPrefab
├─ CastVFXPrefab
├─ StatusVFXPrefab
├─ HitReactType
├─ CameraShakeType
├─ TimelineProfile
├─ SFXGroup
└─ ScreenEffectTag
```

---

# 19. Timeline 模板

## 19.1 轻近战模板 TP_MeleeLight

```text
0.00s  卡牌飞出
0.10s  玩家 PreAttack
0.18s  玩家 Dash 到攻击点
0.28s  LightAttack 开始
0.36s  命中帧：AttackVFX + HitVFX + HitReact
0.42s  数值跳出
0.55s  玩家回位
0.75s  流程结束
```

## 19.2 重近战模板 TP_MeleeHeavy

```text
0.00s  卡牌放大
0.12s  背景轻压暗
0.20s  玩家蓄力
0.36s  冲刺到攻击点
0.52s  HeavyAttack 命中
0.53s  TimeStop 0.06s
0.58s  HeavyHit + 中震
0.68s  数值大字跳出
0.95s  玩家回位
1.20s  流程结束
```

## 19.3 状态近身模板 TP_StatusClose

```text
0.00s  卡牌飞出
0.12s  玩家弧线靠近
0.30s  TouchAction
0.38s  状态特效释放
0.48s  Debuff 图标飞入
0.62s  目标轻微迷乱
0.86s  玩家回位
1.05s  流程结束
```

## 19.4 原地 Buff 模板 TP_SelfBuff

```text
0.00s  卡牌飞出
0.10s  玩家 BuffAction
0.25s  光环从脚下升起
0.45s  UI 数值变化
0.65s  Buff 图标进入状态栏
0.85s  流程结束
```

## 19.5 全屏大招模板 TP_Ultimate

```text
0.00s  卡牌全屏展示 0.25s
0.25s  背景压暗
0.35s  玩家大招预备
0.70s  全屏符文展开
0.95s  冲击波命中所有敌人
1.00s  慢动作 + 屏幕震动
1.20s  数值依次跳出
1.60s  背景恢复
1.90s  流程结束
```

## 19.6 喷发结算模板 TP_PlayerEruption

```text
0.00s  全场暂停 0.15s
0.15s  忍耐条红光闪烁
0.30s  镜头拉近玩家
0.50s  EruptionStart
0.90s  EruptionBurst
1.00s  屏幕红白闪
1.15s  敌方共鸣条增加 10%
1.40s  玩家虚弱恢复动作
1.80s  判断失败或继续战斗
```

## 19.7 敌方高潮结算模板 TP_EnemyClimax

```text
0.00s  敌方共鸣条满格闪烁
0.20s  敌人进入 ClimaxStart
0.40s  背景压暗，聚光
0.75s  ClimaxPulse 第一次
0.95s  ClimaxPulse 第二次
1.15s  ClimaxBurst
1.35s  敌方 Break / Defeated
1.80s  敌方退场或倒地
2.10s  掉落奖励 / 下一目标
```

---

# 20. 音效配合规则

## 20.1 音效组

| 音效组 | 用途 | 声音方向 |
|---|---|---|
| SFX_LightThrust | 轻攻击 | 快速风切 + 轻命中 |
| SFX_HeavyImpact | 重击 | 低频冲击 + 火花 |
| SFX_Combo | 连击 | 三段节拍命中 |
| SFX_Tease | 挑逗 | 轻铃 + 柔和波纹 |
| SFX_Whisper | 声波 | 低语感音波，不做人声露骨 |
| SFX_Chain | 束缚 | 金属链 + 魔法嗡鸣 |
| SFX_Calm | 冷静 | 呼吸 + 水波 |
| SFX_Buff | 强化 | 宝石升频 |
| SFX_Eruption | 玩家喷发 | 能量爆发 + 低频冲击 |
| SFX_Climax | 敌方结算 | 心跳脉冲 + 光爆 |
| SFX_Victory | 胜利 | 短号角 + 花瓣闪光 |
| SFX_Fail | 失败 | 低沉下坠 + 心跳停止感 |

## 20.2 音效时序

- 攻击挥出：播放 Whoosh。
- 命中帧：播放 Impact。
- Buff 添加：播放 UI Pop。
- 结算开始：播放 Heartbeat / Warning。
- 结算爆发：播放 Burst。

---

# 21. 程序实现建议

## 21.1 战斗逻辑与表现分离

战斗数值不要直接驱动画面。建议分成两层：

```text
BattleLogicSystem：只负责计算
BattlePresentationSystem：只负责表现
```

流程：

```text
BattleLogic 生成 ActionResult
→ Presentation 读取 ActionResult
→ 顺序播放表现
→ 表现完成后通知 Logic 进入下一步
```

## 21.2 ActionResult 数据结构

```csharp
public class ActionResult
{
    public string SourceId;
    public string TargetId;
    public string CardId;
    public int ResonanceDelta;
    public int EnduranceDelta;
    public int CalmDelta;
    public List<StatusChange> StatusChanges;
    public CardVisualProfile VisualProfile;
    public bool TriggerPlayerEruption;
    public bool TriggerEnemyClimax;
    public bool TriggerDefeat;
    public bool TriggerVictory;
}
```

## 21.3 表现协程伪代码

```csharp
public IEnumerator PlayAction(ActionResult result)
{
    yield return cardPresenter.PlayCardUse(result.CardId);
    yield return unitPresenter.PlayPreAction(result.SourceId, result.VisualProfile);
    yield return movePresenter.MoveToActionPoint(result.SourceId, result.TargetId, result.VisualProfile.MoveTag);
    yield return unitPresenter.PlayAttack(result.SourceId, result.VisualProfile.ActionTag);
    yield return vfxPresenter.PlayAttackVFX(result.VisualProfile.AttackVFXPrefab);
    yield return hitPresenter.PlayHit(result.TargetId, result.VisualProfile.HitReactType, result.VisualProfile.HitVFXPrefab);
    yield return uiPresenter.ApplyNumbers(result);
    yield return statusPresenter.ApplyStatusIcons(result.StatusChanges);
    yield return movePresenter.ReturnToIdle(result.SourceId);

    if (result.TriggerEnemyClimax)
        yield return finisherPresenter.PlayEnemyClimax(result.TargetId);

    if (result.TriggerPlayerEruption)
        yield return finisherPresenter.PlayPlayerEruption(result.SourceId);
}
```

---

# 22. 资源制作优先级

## 第一优先级：必须先做

1. VFX_ThrustTrail
2. VFX_HitSpark_Light
3. VFX_HitSpark_Medium
4. VFX_HeartRipple
5. VFX_CalmAura
6. VFX_GuardShield
7. VFX_EruptionWarning
8. VFX_EruptionBurst
9. VFX_ClimaxWarning
10. VFX_ClimaxBurst

## 第二优先级：让卡牌差异变明显

1. VFX_ComboTrail_01
2. VFX_WhisperWave
3. VFX_ChainBind
4. VFX_BrandSigil
5. VFX_HeavyArc
6. VFX_AromaMistAOE
7. VFX_BreakShards
8. VFX_CritBurst

## 第三优先级：高级表现

1. 全屏大招特效
2. Boss 封印破裂
3. 背景压暗和聚光
4. 屏幕边缘特效
5. 高级残影 Shader
6. 卡牌全屏演出

---

# 23. 验收标准

每张攻击卡必须满足：

- 有攻击者动作。
- 近战卡有位移，远程卡有投射或波纹。
- 有攻击特效。
- 有目标受击动作。
- 有命中特效。
- 有数值跳字。
- 有状态图标变化。
- 攻击者能回到原位。

每个结算必须满足：

- 有预警。
- 有镜头变化。
- 有专属角色动作。
- 有专属爆发特效。
- 有 UI 条形变化。
- 有结束状态。

---

# 24. 最终效果目标

做到这套表现后，玩家应该不需要读完整卡牌描述，也能从画面上判断：

- 这是一张轻攻击还是重攻击。
- 这是一张状态卡还是直接伤害卡。
- 这张卡是否在叠加挑逗、烙印、束缚、冷静。
- 敌人下回合是攻击、防御、强化还是控制。
- 玩家是否接近喷发危险。
- 敌人是否接近高潮结算。
- 当前 Build 是否正在成型。

核心目标是：

```text
卡牌文字负责解释规则；
动作和特效负责让玩家看懂战斗。
```

