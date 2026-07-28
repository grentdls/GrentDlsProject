# 283 基础攻击槽位与武器限制规则：默认技能组与兼容性

## 1. 特殊槽位

```text
GroundBasicAttackSlot
AirBasicAttackSlot
RisingAttackSlot
```

每个技能必须声明唯一 `SkillSlotTag`。

## 2. 武器标签

```text
Sword_OneHand
Axe_OneHand
Hammer_OneHand
Dagger
Sword_TwoHand
Axe_TwoHand
Hammer_TwoHand
Fist
Shield
Bow
Crossbow
Staff
Wand
Scepter
Focus
```

## 3. 默认技能组

每个 WeaponBaseType 配置：

```text
DefaultGroundBasicAttackId
DefaultAirBasicAttackId
DefaultRisingAttackId
```

## 4. 装备武器时

```text
槽位为空：装入武器默认技能
槽位技能兼容：保留玩家配置
槽位技能不兼容：暂存原配置并装入默认技能
切回原武器：恢复原兼容配置
```

## 5. 双持

```text
主手决定默认技能
或使用 DualWield 专属技能组
可配置左右武器交替攻击
```

## 6. 盾牌

主手 + 盾牌时地面普攻通常由主手决定；部分技能组可在连段中加入盾击。

## 7. 切换武器

```text
重置地面连段
重置空中连段
清空输入缓存
重新解析三个槽位
```

## 8. 技能页面

新增：

```text
基础攻击配置
├── 地面普攻
├── 空中普攻
└── 上跃技能
```

每个槽显示图标、名称、连段数、默认/自定义标记和兼容状态。

## 9. 校验

```text
所有武器必须有默认地面普攻
所有武器必须有默认空中普攻
所有武器必须有默认上跃技能
技能槽标签必须匹配
默认技能必须兼容武器标签
```
