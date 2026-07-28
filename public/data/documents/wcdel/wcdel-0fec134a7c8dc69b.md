# 击中表现、受击反馈与卡肉系统设计文档

> 项目类型：2D 横版清版动作 RPG / DNF 式战斗  
> 当前模块：击中表现、受击闪白、顿帧、卡肉感、受击动作、击退、击飞、倒地、破防与 Boss 受击反馈  
> 目标：让每一次攻击都有清楚的“打中了”的反馈；让普通命中、重击、暴击、穿甲、元素命中、Boss 技能命中都有不同的视觉、手感和动画表现。

---

## 1. 系统目标

击中表现系统要解决的问题：

```text
1. 玩家攻击命中敌人时，必须有“打中了”的手感
2. 普通攻击、重击、技能、绝技的命中反馈要有强弱差异
3. 敌人受击时要有受击动作，而不是只扣血
4. 攻击命中瞬间要有卡肉感，也就是短暂停顿和打击阻力
5. 不同伤害类型要有不同反馈，例如暴击、穿甲、元素、破防
6. 敌人被打时要有闪白、抖动、击退、击飞、倒地等层级
7. Boss 不能被小攻击打得乱抖，但要有明确命中反馈
8. 玩家被打时也要有强反馈，包括受击、震屏、击退、倒地、起身
9. 反馈不能太乱，不能全屏特效和震动导致看不清
10. 所有反馈必须可配置、可调强度、可关闭部分效果
```

核心体验：

```text
轻攻击：清楚、快速、有小卡肉
重攻击：明显停顿、闪白、击退
暴击：更大打击感、强跳字、强闪光
穿甲：破裂、金属碎片、血条裂纹
元素：带元素色和元素粒子
破防：强震、破甲特效、敌人硬直
击飞：敌人离地、可追击
倒地：敌人落地、短暂不可行动
Boss 技能：屏幕和镜头明显压迫感
```

---

## 2. 击中表现总流程

一次攻击命中的完整流程：

```text
攻击动作播放
→ 到达伤害帧
→ HitBox 开启
→ 检测目标 HurtBox
→ 命中判定成功
→ 计算伤害
→ 生成 DamageResult
→ 目标扣血
→ 目标播放受击反馈
→ 攻击者播放命中反馈
→ 生成跳字
→ 播放命中特效
→ 播放命中音效
→ 执行 HitStop 顿帧
→ 执行 CameraShake 震屏
→ 执行 Knockback / Launch / Knockdown
→ 判断是否破防 / 死亡
```

运行时事件链：

```text
OnHitDetected
OnDamageCalculated
OnDamageApplied
OnHitFeedbackStart
OnHitStopStart
OnHitReactionStart
OnHitFeedbackEnd
```

---

## 3. 命中反馈分层

击中表现拆成 8 层：

```text
1. 攻击者反馈：攻击动作停顿、武器顿住、手感阻力
2. 受击者反馈：闪白、受击动作、材质变色、身体抖动
3. 位移反馈：击退、击飞、拉扯、倒地
4. 画面反馈：顿帧、震屏、镜头缩放、慢动作
5. 特效反馈：命中特效、刀光爆点、元素爆点、破甲碎片
6. 音效反馈：命中声、暴击声、穿甲声、受击叫声
7. UI 反馈：跳字、血条闪光、Buff 图标变化
8. 状态反馈：硬直、霸体削减、破防、死亡
```

任何攻击至少要触发：

```text
受击闪白
命中特效
命中音效
伤害跳字
血条扣血
轻微 HitStop
```

---

## 4. 伤害命中等级

### 4.1 命中等级枚举

```text
HitImpactLevel_0：无反馈，例如免疫、格挡完全抵消
HitImpactLevel_1：轻命中，例如小怪轻击、DoT
HitImpactLevel_2：普通命中，例如普攻 1、普攻 2
HitImpactLevel_3：重命中，例如普攻 3、小技能主命中
HitImpactLevel_4：强命中，例如重技能、暴击、穿甲
HitImpactLevel_5：超强命中，例如破防、击飞、大技能
HitImpactLevel_6：终结命中，例如绝技、Boss 大招、斩杀
```

### 4.2 命中等级对应反馈

| 命中等级 | 闪白 | HitStop | 震屏 | 击退 | 特效 | 音效 |
|---|---:|---:|---:|---:|---|---|
| 0 | 无 | 无 | 无 | 无 | 免疫火花 | 免疫声 |
| 1 | 低 | 0~0.02s | 无 | 无/极小 | 小火花 | 轻声 |
| 2 | 标准 | 0.025s | 小 | 小 | 普通命中特效 | 普通命中 |
| 3 | 明显 | 0.04s | 小/中 | 中 | 大刀光爆点 | 重击命中 |
| 4 | 强 | 0.06s | 中 | 中/大 | 暴击/穿甲特效 | 强命中 |
| 5 | 很强 | 0.08s | 中/强 | 大/击飞 | 破防/爆裂 | 破防声 |
| 6 | 极强 | 0.10~0.16s | 强 | 特殊 | 绝技爆发 | 绝技命中 |

---

## 5. 受击闪白系统

### 5.1 闪白目的

受击闪白用于告诉玩家：

```text
攻击确实命中了
目标正在受伤
目标当前可被攻击
```

闪白不是简单把角色变成纯白，而是短时间叠加亮色材质。

---

### 5.2 闪白表现类型

| 类型 | 用途 | 表现 |
|---|---|---|
| WhiteFlash | 普通受击 | 角色整体变白 0.05~0.08s |
| RedFlash | 玩家受伤 / 流血 | 红色闪一下 |
| GoldFlash | 暴击 / 弱点 | 金白高亮 |
| SilverFlash | 穿甲 | 银白裂纹闪 |
| ElementFlash | 元素命中 | 对应元素色闪 |
| BreakFlash | 破防 | 白红强闪 + 裂纹 |
| DeathFlash | 死亡 | 白闪后淡出 |

---

### 5.3 闪白参数

| 命中类型 | 闪白颜色 | 强度 | 持续 | 次数 |
|---|---|---:|---:|---:|
| 轻命中 | 白色 | 0.45 | 0.04s | 1 |
| 普通命中 | 白色 | 0.65 | 0.06s | 1 |
| 重命中 | 白色 | 0.85 | 0.08s | 1 |
| 暴击 | 金白 | 1.0 | 0.10s | 1 |
| 穿甲 | 银白 | 0.95 | 0.08s | 1 |
| 破防 | 白红 | 1.0 | 0.12s | 2 |
| 元素 | 元素色 | 0.75 | 0.07s | 1 |
| 死亡 | 白色 | 1.0 | 0.15s | 1 |

---

### 5.4 闪白 Shader 规则

角色材质需要支持：

```text
_FlashColor
_FlashIntensity
_FlashBlend
_HitRimColor，可选
_DissolveAmount，可选
```

普通受击：

```text
FlashIntensity: 0 → 0.8 → 0
Duration: 0.06s
```

暴击受击：

```text
FlashColor: GoldWhite
FlashIntensity: 1.0
RimLight: On
Duration: 0.1s
```

穿甲受击：

```text
FlashColor: SilverWhite
附加裂纹贴图 0.08s
```

---

## 6. 顿帧 HitStop 系统

### 6.1 顿帧目的

顿帧是卡肉感的核心。  
攻击命中瞬间，攻击者和受击者短暂停住，让玩家感觉“武器砍进去了”。

顿帧不是全局暂停所有东西，而是有层级：

```text
轻攻击：只停攻击者和受击者
重攻击：停攻击者、受击者、局部特效
绝技：短暂停全局或慢动作
```

---

### 6.2 HitStop 类型

```text
LocalHitStop：只暂停攻击者和目标动画
PairHitStop：攻击者 + 所有被命中目标
AreaHitStop：区域内单位短停
GlobalHitStop：全局短停，绝技和 Boss 大招用
```

---

### 6.3 HitStop 参数

| 行为 | HitStop 时长 | 影响对象 | 说明 |
|---|---:|---|---|
| DoT | 0 | 无 | 持续伤害不顿帧 |
| 普攻 1 | 0.025s | 攻击者 + 目标 | 轻卡肉 |
| 普攻 2 | 0.035s | 攻击者 + 目标 | 稍强 |
| 普攻 3 | 0.05s | 攻击者 + 目标 | 明显卡肉 |
| 小技能 | 0.04s | 攻击者 + 目标 | 标准技能 |
| 中技能 | 0.06s | 攻击者 + 目标 | 重手感 |
| 暴击 | +0.025s | 攻击者 + 目标 | 叠加 |
| 穿甲 | +0.02s | 攻击者 + 目标 | 叠加 |
| 破防 | 0.10s | 区域 | 强反馈 |
| 绝技命中 | 0.12~0.18s | 全局 / 区域 | 大招反馈 |
| Boss 大招命中玩家 | 0.10~0.14s | 全局 | 强惩罚感 |

### 6.4 HitStop 叠加规则

同一次命中可以叠加：

```text
基础 HitStop + 暴击加成 + 穿甲加成 + 弱点加成
```

但必须有上限：

```text
普通攻击最大 HitStop：0.075s
普通技能最大 HitStop：0.10s
绝技最大 HitStop：0.18s
Boss 大招最大 HitStop：0.16s
```

### 6.5 多目标命中规则

一次攻击同时命中多个敌人：

```text
只触发一次攻击者 HitStop
受击者各自触发受击 HitStop
攻击者 HitStop 使用最高优先级目标的反馈
```

例如：

```text
一刀命中 5 个小怪，其中 1 个暴击
攻击者 HitStop 按暴击处理
其余小怪各自按普通受击处理
```

---

## 7. 卡肉感设计

### 7.1 什么是卡肉感

卡肉感由以下几件事组合出来：

```text
1. 命中瞬间动作短暂停住
2. 武器挥砍轨迹在命中点有停顿
3. 受击目标短暂闪白
4. 目标身体有小幅挤压或后仰
5. 命中特效从命中点爆出
6. 命中音效有清楚冲击
7. 伤害数字弹出
8. 镜头轻微震动
```

### 7.2 卡肉强度等级

| 等级 | 用途 | 表现 |
|---|---|---|
| Soft | 小怪轻击 | 轻停顿，轻闪白 |
| Medium | 普通普攻 | 标准停顿，标准命中特效 |
| Heavy | 普攻三段 / 小技能 | 明显顿帧，敌人后仰 |
| Brutal | 暴击 / 破甲 | 强停顿，强音效，血条强闪 |
| Ultimate | 绝技 / Boss | 慢动作 + 强震屏 + 大特效 |

### 7.3 攻击者停顿与受击者停顿比例

普通攻击：

```text
攻击者停顿 = 70%
受击者停顿 = 100%
```

重攻击：

```text
攻击者停顿 = 80%
受击者停顿 = 110%
```

Boss 攻击玩家：

```text
Boss 停顿 = 30%
玩家停顿 = 120%
```

原因：

```text
玩家打小怪要爽，所以攻击者也停一下形成卡肉
Boss 打玩家不应该显得 Boss 被卡住太久，重点是玩家受击明显
```

---

## 8. 受击动作系统

### 8.1 受击动作分类

```text
Hit_Light       轻受击
Hit_Medium      中受击
Hit_Heavy       重受击
Hit_Low         低段受击
Hit_Air         空中受击
Hit_Back        背后受击
Hit_Crit        暴击受击
Hit_ArmorBreak  破甲受击
Knockback       击退
Launch          击飞
Fall            下落
Down            倒地
GetUp           起身
Dead            死亡
```

---

### 8.2 轻受击

用途：

```text
被普通小攻击打中
被多段小伤害打中
```

表现：

```text
身体小幅后仰
脸部受惊
动画 3~4 帧
硬直 0.15~0.25s
小闪白
不打断 Boss
```

参数：

```text
HitStun: 0.18s
KnockbackDistance: 0.15~0.35
CanInterruptNormalEnemy: true
CanInterruptElite: 视抗性
CanInterruptBoss: false
```

---

### 8.3 中受击

用途：

```text
普攻二段
普通技能
玩家被敌人标准攻击命中
```

表现：

```text
身体明显后仰
脚底滑动
头部后甩
动画 4~6 帧
硬直 0.25~0.4s
标准闪白
```

参数：

```text
HitStun: 0.3s
KnockbackDistance: 0.5~0.9
CanInterruptNormalEnemy: true
CanInterruptElite: true, 但受抗性影响
CanInterruptBoss: false
```

---

### 8.4 重受击

用途：

```text
普攻三段
重技能
暴击
穿甲
Boss 小技能
```

表现：

```text
身体大幅后仰
脚底离地一点或滑退
头部、手臂、衣服明显甩动
硬直 0.4~0.65s
强闪白
可能进入击退或击飞
```

参数：

```text
HitStun: 0.45s
KnockbackDistance: 1.0~1.8
CanInterruptNormalEnemy: true
CanInterruptElite: true
CanInterruptBoss: 只削霸体，不播放大受击
```

---

### 8.5 暴击受击

暴击不一定单独一个动作，但需要增强：

```text
受击动画选择 Hit_Heavy 或 Hit_Crit
闪白变金白
HitStop 增加
跳字变大
命中特效变强
血条强闪
```

如果目标是普通小怪：

```text
可以直接击退或短浮空
```

如果目标是 Boss：

```text
不打断动作，只播放局部强闪和小震
```

---

### 8.6 穿甲受击

表现：

```text
银白闪光
护甲碎片飞出
血条裂纹
如果附加破甲，头顶 Buff 行出现破甲图标
受击音效偏金属碎裂
```

逻辑：

```text
穿甲伤害可以无视部分防御
穿甲命中可额外削减霸体值
穿甲不一定造成更大击退，但反馈要更硬
```

---

## 9. 击退 Knockback 系统

### 9.1 击退目的

击退用于制造空间变化：

```text
玩家打小怪：让敌人被推开，有打击感
敌人打玩家：让玩家失位，增加危险
技能命中：控制敌人站位
Boss 攻击：制造惩罚感
```

---

### 9.2 击退参数

```text
KnockbackDistance    击退距离
KnockbackDuration    击退时间
KnockbackCurve       击退曲线
KnockbackDirection   击退方向
StopOnWall           撞墙停止
WallHitReaction      撞墙反应
CanKnockbackAir      是否能击退空中目标
```

---

### 9.3 击退距离建议

| 攻击类型 | 普通小怪 | 精英 | Boss | 玩家 |
|---|---:|---:|---:|---:|
| 普攻 1 | 0.2 | 0.1 | 0 | 0.2 |
| 普攻 2 | 0.35 | 0.2 | 0 | 0.35 |
| 普攻 3 | 0.8 | 0.45 | 0.05 | 0.8 |
| 小技能 | 0.6 | 0.35 | 0.05 | 0.6 |
| 重技能 | 1.2 | 0.75 | 0.1 | 1.0 |
| 破防 | 1.6 | 1.0 | 0.25 | 1.2 |
| Boss 大招 | 2.0 | 1.5 | 0 | 2.0 |

---

### 9.4 击退抗性

单位配置：

```text
KnockbackResistance: 0~1
```

最终击退：

```text
FinalKnockback = KnockbackDistance × (1 - KnockbackResistance)
```

建议：

```text
普通小怪：0~0.2
精英怪：0.3~0.6
Boss：0.85~1.0
玩家：0.1~0.3
```

---

### 9.5 撞墙反馈

如果目标被击退撞到墙：

```text
停止击退
播放撞墙尘土
触发额外硬直 0.15~0.3s
可选追加少量撞墙伤害
```

Boss 不触发撞墙。

---

## 10. 击飞 Launch 系统

### 10.1 击飞目的

击飞用于：

```text
制造连招空间
让敌人进入浮空追击
表现重击威力
形成技能差异
```

---

### 10.2 击飞参数

```text
LaunchPowerY       垂直击飞力度
LaunchPowerX       横向力度
LaunchDuration     浮空时间
GravityScale       下落速度倍率
AirControl         目标空中是否可控制，敌人一般不可
CanAirCombo        是否可被空中追击
AirHitDecay        空中连击衰减
```

---

### 10.3 击飞等级

| 等级 | 表现 | 用途 |
|---|---|---|
| MiniLaunch | 小浮空 | 普攻三段可选 |
| NormalLaunch | 标准浮空 | 小技能、上挑 |
| HighLaunch | 高浮空 | 重技能、破防 |
| BlowAway | 吹飞 | Boss 技能、绝技 |

---

### 10.4 击飞时间建议

| 击飞类型 | 高度 | 浮空时间 | 落地行为 |
|---|---:|---:|---|
| MiniLaunch | 0.5 | 0.35s | 回到受击 |
| NormalLaunch | 1.2 | 0.75s | 倒地或可追击 |
| HighLaunch | 2.0 | 1.1s | 倒地 |
| BlowAway | 1.5 + 横飞 | 0.9s | 强倒地 |

---

### 10.5 击飞抗性

```text
FinalLaunch = LaunchPower × (1 - LaunchResistance)
```

建议：

```text
普通小怪：0~0.1
精英怪：0.4~0.7
Boss：1.0，免疫普通击飞
玩家：0.2~0.4
```

---

## 11. 倒地与起身系统

### 11.1 倒地触发

```text
被强击飞后落地
被 Boss 技能命中
被破防技能命中
HP 未归零但受到强控制
```

---

### 11.2 倒地状态

倒地期间：

```text
不能移动
不能攻击
不能释放技能
部分攻击不能命中倒地目标
可被专门的倒地追击命中
```

---

### 11.3 倒地时间

| 单位 | 普通倒地 | 强倒地 |
|---|---:|---:|
| 普通小怪 | 0.7s | 1.1s |
| 精英怪 | 0.5s | 0.8s |
| Boss | 通常不倒地 | 破防时特殊倒地 |
| 玩家 | 0.8s | 1.2s |

---

### 11.4 起身保护

玩家起身：

```text
起身前 0.2s 不可操作
起身中 0.5s 无敌
起身后 0.2s 可以移动但不可攻击，可配置
```

敌人起身：

```text
普通敌人起身无敌 0.15s
精英起身无敌 0.3s
Boss 破防恢复后有霸体保护 1s
```

---

## 12. 破防与霸体削减

### 12.1 霸体值

精英和 Boss 建议有霸体值：

```text
SuperArmorMax
SuperArmorCurrent
SuperArmorRecoverSpeed
SuperArmorBreakDuration
```

攻击命中时削减：

```text
SuperArmorDamage
```

---

### 12.2 破防触发

```text
SuperArmorCurrent <= 0
→ 触发 Break 状态
```

破防表现：

```text
强闪白
红金裂纹
屏幕中等震动
血条破防条清空
单位进入长硬直
显示“破防”跳字
头顶显示破防 Debuff
```

---

### 12.3 破防状态

破防期间：

```text
单位不能攻击
受到伤害增加
击退抗性降低
浮空抗性降低，Boss 可短暂被轻微击退但不一定浮空
```

参数建议：

```text
普通精英破防时长：2.0s
Boss 破防时长：3.0~5.0s
破防增伤：+20%~50%
```

---

## 13. Boss 受击表现规则

### 13.1 Boss 不应频繁硬直

Boss 不能被普通攻击打得一直动不了。规则：

```text
普通命中：Boss 不进受击动作，只闪白、掉血、跳字
重命中：Boss 播放小幅局部震动，不打断技能
破防命中：Boss 进入特殊硬直
绝技命中：Boss 可播放强受击，但不破坏阶段逻辑
```

---

### 13.2 Boss 受击层级

| 命中类型 | Boss 表现 |
|---|---|
| 普通普攻 | 轻闪白 + 小命中特效 |
| 暴击 | 金白强闪 + 血条强闪 |
| 穿甲 | 裂纹 + 霸体条削减 |
| 小技能 | 局部抖动 + 元素效果 |
| 重技能 | 身体轻后仰，但不打断动作 |
| 破防 | 进入 Break 动画 |
| 绝技 | 播放 Boss_SpecialHit 或 BreakHit |

---

### 13.3 Boss 霸体条 HUD

Boss 血条下方显示破防条：

```text
Boss HP
Boss BreakBar
Boss BuffIcon Row
```

破防条被打时：

```text
即时减少
延迟层追随
穿甲攻击让破防条裂闪
破防时整条爆裂
```

---

## 14. 玩家受击表现

### 14.1 玩家轻受击

```text
角色闪红 / 闪白
播放轻受击动画
短硬直
轻击退
血条闪红
屏幕轻震
```

参数：

```text
HitStun: 0.18~0.25s
Knockback: 0.3~0.6
CameraShake: 0.04~0.06s
```

---

### 14.2 玩家重受击

```text
角色明显后仰
播放重受击动画
强击退
可能倒地
屏幕震动
低血时红边强化
```

参数：

```text
HitStun: 0.35~0.55s
Knockback: 0.8~1.5
CameraShake: 0.08~0.12s
```

---

### 14.3 玩家被击飞

```text
角色离地
失去控制
可受身，后续可做
落地尘土
倒地
起身无敌
```

---

### 14.4 玩家受击输入处理

受击时：

```text
清空普攻输入缓存
清空技能输入缓存
保留受身输入窗口，可选
禁止普通移动
禁止攻击
```

---

## 15. 元素命中表现

### 15.1 火元素命中

```text
受击闪橙红
命中点火花爆开
血条边缘火星
可能附加灼烧 Buff
DoT 跳字为 [火] 小数字
```

### 15.2 冰元素命中

```text
受击闪浅蓝
命中点冰晶碎裂
敌人短暂冰霜覆盖
可能附加减速 / 冰冻
```

### 15.3 雷元素命中

```text
受击闪金黄
角色身体短抖
雷电线从命中点跳出
可能附加麻痹
```

### 15.4 毒元素命中

```text
受击闪绿色
毒雾小爆点
可能附加中毒层数
血条下方毒雾效果
```

### 15.5 风元素命中

```text
受击闪青色
风刃切割线
击退更明显
```

### 15.6 土元素命中

```text
受击闪棕金
岩石碎片
更容易破防 / 击退
```

---

## 16. 命中特效设计

### 16.1 普通命中特效

```text
VFX_Hit_Spark_Light
小白黄火花
持续 0.15s
生成在命中点
```

### 16.2 重击特效

```text
VFX_Hit_Spark_Heavy
大火花 + 冲击圈
持续 0.25s
命中点稍微放大
```

### 16.3 暴击特效

```text
VFX_Hit_Crit_Burst
红金爆点
短暂星芒
数字同步弹出
```

### 16.4 穿甲特效

```text
VFX_Hit_ArmorPierce
银色碎片
裂纹纹理
小金属声音
```

### 16.5 破防特效

```text
VFX_Hit_Break
护甲碎裂
红橙冲击波
目标头顶出现破防提示
```

### 16.6 击飞特效

```text
VFX_Hit_Launch
向上冲击线
脚底尘土
目标浮空拖影
```

---

## 17. 音效设计

### 17.1 命中音效分层

一次命中可以由多个音效组成：

```text
武器命中声
肉体受击声
元素命中声
暴击强化声
穿甲破裂声
敌人叫声
```

---

### 17.2 音效表

| 行为 | 音效 |
|---|---|
| 普通挥空 | SFX_Attack_Swing_Light |
| 普通命中 | SFX_Hit_Normal |
| 重击命中 | SFX_Hit_Heavy |
| 暴击 | SFX_Hit_Crit |
| 穿甲 | SFX_Hit_ArmorPierce |
| 破防 | SFX_Hit_Break |
| 击飞 | SFX_Hit_Launch |
| 倒地 | SFX_Body_Fall |
| 撞墙 | SFX_Body_WallHit |
| 火命中 | SFX_Hit_Fire |
| 冰命中 | SFX_Hit_Ice |
| 雷命中 | SFX_Hit_Thunder |
| 毒命中 | SFX_Hit_Poison |
| 玩家受击 | SFX_Player_Hit |
| Boss 受击 | SFX_Boss_Hit |

---

## 18. 屏幕震动与命中联动

### 18.1 命中震动

| 命中类型 | 强度 | 时间 | 频率 |
|---|---:|---:|---:|
| 普攻 1 | 0.03 | 0.04s | 低 |
| 普攻 2 | 0.04 | 0.05s | 低 |
| 普攻 3 | 0.07 | 0.08s | 中 |
| 暴击 | 0.09 | 0.10s | 中 |
| 穿甲 | 0.08 | 0.09s | 高频短抖 |
| 破防 | 0.13 | 0.16s | 中高 |
| 绝技命中 | 0.18 | 0.22s | 高 |
| Boss 大招 | 0.20 | 0.28s | 高 |

### 18.2 震动叠加规则

```text
0.1s 内只保留最高优先级震动
小震动不能覆盖大震动
Boss 大招震动优先级最高
玩家受击震动优先于玩家攻击震动
```

---

## 19. 受击与血条联动

### 19.1 普通命中

```text
HP_Current 立即减少
HP_DelayDamage 延迟追随
血条轻白闪
```

### 19.2 暴击命中

```text
血条红金闪
Delay 层停留更久
血条小幅放大
跳字更大
```

### 19.3 穿甲命中

```text
血条裂纹
破甲图标闪
如果有破甲 Buff，刷新图标
```

### 19.4 破防命中

```text
BreakBar 清空
血条边框爆裂
显示“破防”
进入破防 HUD 状态
```

---

## 20. 数据配置结构

### 20.1 HitFeedbackConfig

```text
HitFeedbackID
ImpactLevel
FlashType
FlashColor
FlashIntensity
FlashDuration
HitStopType
HitStopDuration
CameraShakeID
HitVFX
HitSFX
HitReactionType
KnockbackDistance
KnockbackDuration
LaunchPower
HitStunTime
CanInterrupt
SuperArmorDamage
```

### 20.2 HitReactionType

```text
None
LightHit
MediumHit
HeavyHit
CritHit
ArmorPierceHit
Knockback
Launch
Knockdown
Break
Death
```

### 20.3 示例配置

```csv
HitFeedbackID,ImpactLevel,FlashType,HitStop,Shake,Reaction,Knockback,Launch,HitStun,VFX,SFX
NormalHit,2,WhiteFlash,0.025,Shake_Small,LightHit,0.3,0,0.2,VFX_Hit_Spark_Light,SFX_Hit_Normal
HeavyHit,3,WhiteFlash,0.05,Shake_Medium,HeavyHit,0.8,0,0.4,VFX_Hit_Spark_Heavy,SFX_Hit_Heavy
CritHit,4,GoldFlash,0.075,Shake_Crit,CritHit,1.0,0,0.45,VFX_Hit_Crit_Burst,SFX_Hit_Crit
ArmorPierce,4,SilverFlash,0.065,Shake_ArmorPierce,ArmorPierceHit,0.6,0,0.35,VFX_Hit_ArmorPierce,SFX_Hit_ArmorPierce
LaunchHit,5,WhiteFlash,0.08,Shake_Launch,Launch,0.4,1.6,0.5,VFX_Hit_Launch,SFX_Hit_Launch
BreakHit,5,BreakFlash,0.10,Shake_Break,Break,1.2,0,2.0,VFX_Hit_Break,SFX_Hit_Break
UltimateHit,6,GoldFlash,0.14,Shake_Ultimate,HeavyHit,1.5,0.8,0.8,VFX_Hit_Ultimate,SFX_Hit_Ultimate
```

---

## 21. DamageResult 与反馈映射

### 21.1 映射规则

根据 DamageResult 决定反馈：

```text
如果 IsImmune → ImmuneFeedback
如果 IsBreak → BreakHit
如果 IsExecute → ExecuteHit
如果 IsCritical && IsArmorPierce → CritArmorPierceHit
如果 IsCritical → CritHit
如果 IsArmorPierce → ArmorPierceHit
如果 ElementType != None → ElementHit
否则按 HitImpactLevel 选择普通反馈
```

### 21.2 伪代码

```text
function ResolveHitFeedback(DamageResult result):
    if result.IsImmune:
        return Feedback_Immune

    if result.IsBreak:
        return Feedback_BreakHit

    if result.IsExecute:
        return Feedback_Execute

    if result.IsCritical and result.IsArmorPierce:
        return Feedback_CritArmorPierce

    if result.IsCritical:
        return Feedback_Crit

    if result.IsArmorPierce:
        return Feedback_ArmorPierce

    if result.ElementType != None:
        return Feedback_Element[result.ElementType]

    return Feedback_ByImpactLevel[result.ImpactLevel]
```

---

## 22. Unity 组件结构建议

```text
Scripts/Combat/Feedback/
├── HitFeedbackManager.cs
├── HitFeedbackConfig.cs
├── HitStopController.cs
├── FlashController.cs
├── HitReactionController.cs
├── KnockbackController.cs
├── LaunchController.cs
├── BreakController.cs
├── CameraFeedbackController.cs
├── HitVFXSpawner.cs
├── HitSFXPlayer.cs
└── HitFeedbackResolver.cs
```

角色身上组件：

```text
CharacterCombatReceiver
├── FlashController
├── HitReactionController
├── KnockbackController
├── LaunchController
├── BreakController
├── CharacterAnimator
└── CharacterStateMachine
```

---

## 23. 运行时流程详细版

```text
1. HitBox 命中 HurtBox
2. DamageSystem 计算 DamageResult
3. HitFeedbackResolver 根据 DamageResult 选择反馈配置
4. Target.FlashController 播放闪白
5. Target.HitReactionController 判断是否进入受击动作
6. Target.KnockbackController 执行击退
7. Target.LaunchController 判断是否击飞
8. HitStopController 执行顿帧
9. CameraFeedbackController 执行震屏
10. HitVFXSpawner 在命中点生成特效
11. HitSFXPlayer 播放命中音效
12. DamageNumberManager 显示跳字
13. UnitHUD 播放扣血表现
14. BreakController 判断是否破防
15. DeathController 判断是否死亡
```

---

## 24. 动画资源清单

### 24.1 通用受击动画

```text
Hit_Light_Right
Hit_Medium_Right
Hit_Heavy_Right
Hit_Crit_Right
Hit_ArmorBreak_Right
Knockback_Right
Launch_Start_Right
Launch_Loop_Right
Fall_Right
Down_Start_Right
Down_Loop_Right
GetUp_Right
Dead_Right
```

左向使用镜像。

### 24.2 Boss 受击动画

```text
Boss_Hit_Small
Boss_Hit_Heavy
Boss_Break_Start
Boss_Break_Loop
Boss_Break_End
Boss_PhaseChange_Hit
Boss_Dead
```

---

## 25. 特效资源清单

```text
VFX_Hit_Spark_Light
VFX_Hit_Spark_Heavy
VFX_Hit_Crit_Burst
VFX_Hit_ArmorPierce
VFX_Hit_Break
VFX_Hit_Launch
VFX_Hit_Fire
VFX_Hit_Ice
VFX_Hit_Thunder
VFX_Hit_Poison
VFX_Hit_Wind
VFX_Hit_Earth
VFX_Hit_Ultimate
VFX_Body_WallHit_Dust
VFX_Body_Fall_Dust
VFX_GetUp_Flash
```

---

## 26. 音效资源清单

```text
SFX_Hit_Normal
SFX_Hit_Heavy
SFX_Hit_Crit
SFX_Hit_ArmorPierce
SFX_Hit_Break
SFX_Hit_Launch
SFX_Hit_Fire
SFX_Hit_Ice
SFX_Hit_Thunder
SFX_Hit_Poison
SFX_Hit_Ultimate
SFX_Body_Knockback
SFX_Body_Launch
SFX_Body_Fall
SFX_Body_WallHit
SFX_Player_Hit_Light
SFX_Player_Hit_Heavy
SFX_Boss_Hit
SFX_Boss_Break
```

---

## 27. 工具配置需求

角色配置工具中，动作和技能需要增加：

```text
HitFeedbackID
ImpactLevel
HitStopOverride
CameraShakeOverride
FlashOverride
HitReactionOverride
KnockbackOverride
LaunchOverride
SuperArmorDamage
CanCauseBreak
CanCauseKnockdown
```

每个 DamageEvent 都可以单独配置反馈：

```text
普攻 1：NormalHit
普攻 2：NormalHit
普攻 3：HeavyHit
剑气技能：ElementHit_Wind
绝技：UltimateHit
Boss 大招：BossHeavyHit
```

---

## 28. 性能与限制规则

### 28.1 反馈限制

```text
同一目标 0.05s 内最多播放一次闪白
同一攻击者 0.08s 内最多触发一次攻击者 HitStop
同一帧多个敌人命中，只取最高等级震屏
DoT 不触发 HitStop 和震屏
Boss 免疫普通硬直
```

### 28.2 对象池

需要池化：

```text
命中特效
元素命中特效
碎片特效
尘土特效
跳字
```

---

## 29. 玩家设置

设置界面提供：

```text
受击闪光：开 / 关
顿帧强度：低 / 中 / 高
屏幕震动：关 / 低 / 中 / 高
命中特效强度：低 / 中 / 高
慢动作效果：开 / 关
```

默认：

```text
受击闪光：开
顿帧强度：中
屏幕震动：中
命中特效强度：中
慢动作效果：开
```

无障碍建议：

```text
频闪敏感玩家可关闭强闪光
屏幕震动可关闭
强慢动作可关闭
```

---

## 30. MVP 开发范围

第一版必须做：

```text
受击闪白
普通 HitStop
普攻三段不同命中反馈
普通击退
重击击退
击飞
倒地
起身
暴击反馈
穿甲反馈
元素命中特效
玩家受击反馈
Boss 普通受击规则
Boss 破防规则
血条扣血联动
震屏联动
配置表驱动
```

第一版可暂缓：

```text
撞墙追加伤害
复杂受身
多段浮空连招衰减
局部身体受击框
高级材质裂纹
Boss 部位破坏
```

---

## 31. 开发顺序

```text
第 1 步：实现 DamageResult 到 HitFeedbackConfig 的映射
第 2 步：实现受击闪白 Shader / 材质参数
第 3 步：实现 HitStopController
第 4 步：实现普通 / 重击 / 暴击 / 穿甲反馈
第 5 步：实现 HitReactionController 受击动画切换
第 6 步：实现 KnockbackController
第 7 步：实现 Launch / Fall / Down / GetUp
第 8 步：接入 CameraShake
第 9 步：接入 HitVFX / HitSFX
第 10 步：接入血条和跳字联动
第 11 步：实现 Boss 霸体和破防反馈
第 12 步：加配置工具字段
第 13 步：做玩家设置开关
第 14 步：整体调手感
```

---

## 32. 验收标准

### 32.1 普通命中验收

```text
普攻命中时敌人会闪白
普攻命中有短暂停顿
普攻 1、2、3 的打击感逐渐增强
命中特效出现在正确命中点
命中音效和伤害帧同步
```

### 32.2 卡肉验收

```text
玩家能感觉武器砍到目标时有阻力
打空和打中手感明显不同
重击比轻击更有停顿感
多目标命中不会过度卡顿
```

### 32.3 受击动作验收

```text
普通小怪被打会播放受击动作
重击会造成明显后仰或击退
击飞技能能让小怪离地
倒地后会起身
Boss 不会被普攻无限打断
```

### 32.4 特殊命中验收

```text
暴击有金红强反馈
穿甲有银色破裂反馈
元素命中有元素色反馈
破防有强烈反馈和破防状态
绝技命中明显强于普通技能
```

### 32.5 玩家受击验收

```text
玩家被打时能立刻感知
玩家重受击有击退或倒地
玩家起身有短暂无敌
低血时受击反馈更明显但不影响操作
```

### 32.6 性能验收

```text
20 个敌人同时受击不卡顿
HitStop 不会导致状态机死锁
闪白不会产生材质实例泄漏
特效使用对象池
震屏不会无限叠加
```

---

## 33. 总结

击中表现系统的核心是：

```text
闪白告诉玩家打中了
顿帧制造卡肉感
受击动作表现敌人被打
击退和击飞制造空间变化
特效和音效强化打击强度
震屏和慢动作表现大招威力
血条和跳字告诉玩家结果
```

最终目标：

```text
同样是一次命中，玩家能通过画面和手感马上分辨：
这是轻击、重击、暴击、穿甲、元素命中、破防，还是绝技命中。
```
