# 223 投射物轨迹系统总览：直线、跟踪、抛射、曲线、回旋

## 1. 设计目标

当前投射物主要采用直线飞行，表现单调，也无法支撑不同职业、敌人、Boss、装备词条和技能流派。本系统把投射物拆成：

```text
轨迹生成
速度控制
转向控制
目标选择
碰撞规则
命中规则
阶段切换
视觉表现
词条改造
编辑器预览
```

通过配置制作：

```text
直线箭矢、加速子弹、追踪魔法弹、同步到达导弹
螺旋飞弹、贝塞尔侧绕弹、蛇形毒弹、波浪音波
抛射火球、毒瓶、迫击炮、弹跳炸弹、陨石
回旋镖、返回箭、环绕飞剑、地面裂隙、天降箭雨
多阶段导弹、蜂群飞弹、场景样条弹幕
```

## 2. 轨迹分类

| 分类 | 主要形式 | 适用技能 |
|---|---|---|
| Linear | 固定方向、朝目标初始点、加减速直线 | 箭、子弹、普通魔法弹 |
| Homing | 平滑追踪、预测拦截、比例导航 | 导弹、灵魂弹、Boss 追踪弹 |
| Curved | 螺旋、贝塞尔、波浪、蛇形、样条 | 高阶法术、Boss 弹幕 |
| Ballistic | 固定重力、固定时间、指定最高点 | 炮弹、手雷、毒瓶、陨石 |
| Return | 命中返回、距离返回、圆弧回旋 | 回旋镖、飞剑、返回箭 |
| Orbit | 围绕施法者/目标旋转后射出 | 护体法球、环绕飞剑 |
| Ground | 贴地、沿坡度、地面裂隙 | 地刺、火焰冲击、雷蛇 |
| SkyDrop | 高空生成、垂直或斜向落下 | 箭雨、陨石、炮击 |
| MultiStage | 多段轨迹依次切换 | 终结技、传奇投射物、Boss 技能 |

## 3. 投射物生命周期

```text
Spawn
→ Warmup 起手等待
→ Launch 初始发射
→ Travel 飞行
→ Track / Curve / Ballistic 轨迹运行
→ Collision 碰撞
→ Hit / Pierce / Bounce / Split 命中处理
→ Detonate / Attach / Return 后续行为
→ Despawn 销毁
```

每个阶段独立配置：

```text
持续时间、速度、轨迹、目标、碰撞、伤害、预警、特效、音效
```

## 4. 核心数据结构

```text
ProjectileDefinition
├── BaseInfo
├── TrajectoryProfile
├── SpeedProfile
├── TargetingProfile
├── CollisionProfile
├── HitProfile
├── VisualProfile
├── StageProfile
└── AffixCompatibility
```

## 5. 技能标签

```text
Projectile, Homing, Ballistic, Bezier, Spiral, Wave
Return, Orbit, GroundProjectile, SkyDrop, MultiStage
```

装备、辅助模块和天赋可按标签修改：

```text
跟踪转向速度 +20%
抛射物最高点 +2 米
返回投射物伤害 +30%
螺旋半径 +25%
贝塞尔绕侧距离提高
```

## 6. 设计原则

1. **轨迹逻辑和视觉偏移分离。** 螺旋可以只影响显示，也可以影响真实碰撞。
2. **时间到达和速度到达分离。** 演出技能可固定 1.5 秒到达，普通箭矢按速度飞行。
3. **高威胁敌方投射物必须可读。** 配锁定、落点、方向和终点冲刺提示。
4. **所有复杂轨迹必须有失败兜底。** 目标死亡、路径穿墙、落点不可达都要有 fallback。
5. **限制递归和同屏数量。** 分裂、连锁、回旋、蜂群都需要代数和性能预算。
