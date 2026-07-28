# 248 可破坏场景物系统：资源矿、石墙、石柱、爆炸桶、桥梁

## 1. 分类

```text
资源类
阻挡类
陷阱类
机关类
战术类
环境装饰类
```

## 2. Prefab 结构

```text
PF_Destructible_Base
├── VisualRoot
│   ├── IntactVisual
│   ├── DamagedVisual
│   └── BrokenVisual
├── ColliderRoot
│   ├── SolidCollider
│   └── Hurtbox
├── DestructionRoot
│   ├── FragmentSpawnPoints
│   ├── DropSpawnPoints
│   └── FallPivot
├── VFXRoot
├── AudioRoot
├── DestructibleController
├── DestructibleHealth
├── BreakActionList
└── DebugRoot
```

## 3. 通用字段

```text
DestructibleId
MaxHealth
Armor
DamageTypeModifiers
HitReaction
DamageStages
CanBeTargeted
CanBeLockedOn
CanBeDestroyedByPlayer
CanBeDestroyedByEnemy
CanDamageUnitsOnBreak
DropTable
SaveState
```

## 4. 资源矿

示例：

```text
晶石矿
铁矿
魔晶矿
骨矿
元素结晶
```

逻辑：

```text
玩家攻击
→ 矿体受伤
→ 播放裂纹和掉屑
→ 生命归零
→ 矿体破碎
→ 掉落材料
→ 保存已采集状态
```

可配置：

```text
材料类型
掉落数量
稀有材料概率
幸运影响
是否需要特定工具
是否需要指定伤害类型
```

## 5. 阻挡石墙

```text
初始阻挡路径
→ 受击出现裂纹
→ 分阶段损坏
→ 最终破坏
→ 禁用碰撞
→ 更新 NavMeshObstacle
→ 开放通路
```

限制方式：

```text
只受重击
只受爆炸
只受指定元素
普通攻击也可破坏
```

## 6. 可破坏喷火陷阱

```text
持续喷火
→ 玩家攻击喷口或核心
→ 破坏后停止喷火
→ 可选死亡爆炸
→ 掉落机械零件
```

弱点：

```text
喷火核心
燃料罐
背部机关
```

## 7. 可倒塌石柱

流程：

```text
石柱受伤
→ 裂纹阶段
→ 生命归零
→ 判断倒塌方向
→ 播放倒塌动画或物理
→ 沿倒塌路径做 Sweep
→ 对范围单位造成高额伤害
→ 生成碎片
→ 主体消失或保留残骸
```

## 8. 倒塌方向

```text
固定方向
攻击来源反方向
玩家瞄准方向
最近敌人方向
预设 FallDirectionTransform
```

第一版推荐：

```text
预设方向 + Scene 箭头预览
```

## 9. 倒塌伤害区域

形状：

```text
Box
Capsule
SweepMesh
```

字段：

```text
Damage
DamageType
Knockback
Knockdown
PoiseDamage
AffectPlayer
AffectEnemy
AffectDestructible
```

## 10. 爆炸桶

```text
受到伤害
→ 引燃
→ 延迟
→ 爆炸
→ 伤害单位
→ 引爆附近桶
→ 可选生成火焰区域
```

防无限连锁：

```text
每个桶只响应一次
连锁延迟随机 0.1-0.3 秒
限制同帧爆炸数量
```

## 11. 脆弱地板

```text
玩家踩上
→ 裂纹
→ 延迟破坏
→ 单位坠落
```

或：

```text
受到重击
→ 直接破坏
```

## 12. 可破坏桥梁

破坏后：

```text
改变路径
敌人坠落
封锁回路
开放下层路线
```

需要：

```text
NavMesh 更新
AI 路径重算
坠落死亡区
镜头提示
```

## 13. 机关核心

破坏后可：

```text
关闭陷阱
打开门
停止激光
停止喷火
关闭护盾
激活宝箱
```

本质上是：

```text
Destructible + BreakActionList
```

## 14. 破坏阶段

```text
100%-60%：完整
60%-25%：裂纹/冒烟
25%-0%：严重损坏
0%：破坏
```

## 15. 破坏表现

```text
材质裂纹
局部掉渣
受击闪白
震动
碎片
灰尘
音效
相机轻震
```

## 16. 性能规则

```text
小碎片使用对象池
远处碎片不生成刚体
碎片存在时间限制
大量碎片自动合并或消失
破坏后禁用不必要脚本
```
