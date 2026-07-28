# 战斗体型判定与击退击飞表现同步

## 目标

- 角色配置中新增体型判定：小型、中型、大型、巨大型。
- 体型只影响战斗表现，不改变单位实际缩放、碰撞体或美术大小。
- 普攻和技能都可以配置击退力度、击飞力度和方向模式。
- 最终击退/击飞表现由目标基础受击参数、体型系数、攻击力度、击杀加倍和抗性共同决定。

## 角色受击配置

`CharacterHitReactionConfig` 新增：

- `BodySizeClass`：体型分类。
- `KnockbackDistance`：目标基础被击退距离。
- `BodySizeKnockbackMultiplier`：体型击退系数，填 0 时按体型自动。
- `LaunchPower`：目标基础被击飞高度。
- `BodySizeLaunchMultiplier`：体型击飞系数，填 0 时按体型自动。

默认体型系数：

- 小型：击退 1.25，击飞 1.2。
- 中型：击退 1.0，击飞 1.0。
- 大型：击退 0.65，击飞 0.55。
- 巨大型：击退 0.35，击飞 0.25。

## 普攻与技能配置

普攻使用 `CharacterDamageEventDefinition`：

- `KnockbackPower`：攻击事件击退力度。
- `LaunchPower`：攻击事件击飞力度。
- `LaunchHorizontalPower`：击飞时水平位移力度。
- `ImpactDirectionMode`：击退/击飞方向模式。
- `FixedImpactDirection`：固定世界方向。
- `KillKnockbackMultiplier`：击杀击退加倍。
- `KillLaunchMultiplier`：击杀击飞加倍。

技能使用 `CharacterSkillEntryDefinition.Impact`：

- 字段和普攻表现配置一致，但不混入 HitBox 列表。
- 范围技能命中每个目标时单独按目标体型和剩余血量计算最终表现。

方向模式：

- `AttackDirection`：使用当前攻击方向。
- `SourceFacing`：使用发起者朝向。
- `SourceToTarget` / `TargetAwayFromSource`：目标远离发起者。
- `TargetTowardSource`：目标朝向发起者。
- `FixedWorldDirection`：固定世界方向。
- `HitPointToTarget`：命中点指向目标。
- `TargetToHitPoint`：目标指向命中点。

## 运行时公式

最终击退距离：

```text
最终击退 = 目标基础击退距离
        × 体型击退系数
        × 攻击/技能力度
        × 击飞横向力度
        × 击杀击退或击飞加倍
        × (1 - 击退抗性)
```

最终击飞高度：

```text
最终击飞 = max(目标基础击飞高度, 攻击/技能击飞力度)
        × 体型击飞系数
        × 击杀击飞加倍
        × (1 - 击飞抗性)
```

击杀加倍在命中前通过目标当前生命值预判：如果本次最终伤害会击杀目标，则按本事件的击杀倍率强化位移表现。

## 接入点

- `CombatImpactUtility` 统一处理方向、体型系数、死亡预判和最终击退/击飞数值。
- `MeleeAttackEmitter` 在普攻命中时使用 `DamageEvent` 计算冲击表现。
- `AreaSkillEmitter` 在技能命中时使用 `SkillEntry.Impact` 计算冲击表现。
- `Projectile2D` 和敌人普通攻击使用兼容默认冲击表现。
- `KnockbackReceiver2D` 继续执行水平击退，但会读取角色击退抗性。
- `PlayerHitReactionController` 继续执行击飞/倒地状态，但会读取角色击飞抗性。

## 验收

- 在角色配置工具中把怪物体型改为小型/大型/巨大型，同一技能命中后击退距离应明显不同。
- 给普攻 `DamageEvent` 增大 `KnockbackPower`，命中目标应更远。
- 给技能 `Impact.LaunchPower` 配置大于 0，命中目标应进入击飞/浮空表现。
- 击杀目标时，击退或击飞表现应比普通命中更夸张。
- 拥有霸体或不可打断状态的单位仍应免疫被撞飞/打断。
