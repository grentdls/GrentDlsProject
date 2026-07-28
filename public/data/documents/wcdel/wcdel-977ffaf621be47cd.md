# Combat HitStop And Shake Sync

## 目标

在现有战斗反馈层基础上，补齐最小可玩的“命中停顿 + 简易震屏”反馈，让近战、范围技能和敌人命中都更有节奏感。

## 本次范围

### 命中停顿

- 新增全局 `HitStopController`
- 玩家普通命中和暴击命中可以触发不同级别停顿
- 玩家受击时也会产生更轻的停顿，增强被打反馈

### 简易震屏

- 为主相机新增 `CameraShakeController2D`
- 普通命中、暴击命中、玩家受击使用不同抖动强度
- 先用运行时局部偏移实现，不引入 Cinemachine 或第三方依赖

### 统一派发

- 新增 `CombatFeedbackBroadcaster`
- 复用 `Health.DamageApplied` 事件与攻击发起端的命中时机
- 不改动伤害公式，只在现有伤害链路上追加反馈层

## 本次不做

- 正式屏幕闪白
- 音效统一派发器
- 反馈对象池
- Boss 专属大招震屏曲线

## 后续建议

1. 将命中停顿参数做成可配置表或 ScriptableObject
2. 给 Boss、小怪、技能分别拆出更细的反馈配置
3. 后续接入正式命中特效和音效时，让 `CombatFeedbackBroadcaster` 继续作为统一出口
