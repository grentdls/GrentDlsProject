# 169 数值扩展玩法总览：属性、伤害、防御、词条构筑

## 1. 设计目标

本批文档用于扩展项目的核心数值玩法和词条玩法，并把它们接入装备、技能、天赋三大系统。

目标是让游戏从“攻击力、生命、防御”这种浅层数值，扩展成真正可刷、可搭配、可研究的 ARPG 构筑系统。

玩家应该能围绕这些方向做构筑：

```text
穿甲重击
暴击连锁
护盾回复
破盾爆发
吸血续航
真实伤害处决
火焰击杀爆炸
冰冷控制增伤
闪电暴击连锁
毒素持续叠层
召唤物军团
投射物分裂
AOE 爆炸
受击反伤
控制窗口爆发
```

---

## 2. 新增核心数值

### 2.1 攻击类

```text
AttackPower              攻击力
SpellPower               法术强度
SkillDamage              技能伤害
WeaponDamageEfficiency   武器伤害效率
AttackSpeed              攻击速度
CastSpeed                施法速度
CriticalChance           暴击率
CriticalDamage           暴击伤害
ArmorPenetrationFlat     固定穿甲
ArmorPenetrationPercent  百分比穿甲
ElementPenetration       元素穿透
ResistanceReduction      抗性削减
TrueDamage               真实伤害
ExecuteDamage            处决伤害
ShieldDamageBonus        对护盾伤害
PoiseDamage              破韧伤害
```

### 2.2 防御类

```text
Life                     生命
Shield                   护盾
Armor                    护甲
Evasion                  闪避
BlockChance              格挡率
BlockReduction           格挡减伤
Poise                    韧性
Resistance               抗性
ControlResistance        控制抗性
DamageReduction          通用减伤
DotReduction             持续伤害减免
LifeRegen                生命回复
ShieldRegen              护盾回复
LifeLeech                生命吸血
ShieldLeech              护盾吸取
ReflectDamage            反伤
```

### 2.3 机制类

```text
ProjectileCount          投射物数量
ProjectileSpeed          投射物速度
ProjectilePierce         投射物穿透
ProjectileChain          投射物连锁
ProjectileSplit          投射物分裂
ProjectileReturn         投射物返回
AreaRadius               AOE 半径
AreaDamage               AOE 伤害
AreaDuration             持续区域时间
AreaOverlap              范围重叠
MinionCount              召唤物数量
MinionDamage             召唤物伤害
MinionLife               召唤物生命
MinionAttackSpeed        召唤物攻速
ControlDuration          控制持续时间
ControlEffect            控制效果
StatusChance             异常几率
StatusEffect             异常效果
```

---

## 3. 构筑方向

### 3.1 穿甲流

关键词：

```text
穿甲
破甲
护甲削减
重击
破韧
流血
```

玩法：
- 使用重武器或物理技能。
- 堆固定穿甲和百分比穿甲。
- 对高护甲敌人更有效。
- 可与破韧、流血、重击顿帧联动。

### 3.2 暴击流

关键词：

```text
暴击率
暴击伤害
暴击触发
暴击连锁
暴击回能
暴击施加异常
```

玩法：
- 堆暴击率和暴击伤害。
- 暴击触发额外连锁、爆炸、资源恢复。
- 闪电、匕首、弓箭、刺客适配。

### 3.3 护盾流

关键词：

```text
护盾
护盾回复
护盾吸取
满盾增伤
护盾反击
护盾转资源
```

玩法：
- 护盾先于生命承伤。
- 满护盾时获得输出加成。
- 受击后快速回复护盾。
- 可走法师、圣职、护盾近战。

### 3.4 破盾流

关键词：

```text
破盾伤害
破盾爆炸
破盾眩晕
破盾增伤
破盾回能
```

玩法：
- 专门针对护盾怪和 Boss 护盾阶段。
- 打破护盾后触发爆发窗口。
- 适合终局和 Boss 战。

### 3.5 吸血流

关键词：

```text
击中吸血
暴击吸血
击杀回血
低血吸血增强
溢出治疗转护盾
```

玩法：
- 通过高频命中或重击恢复生命。
- 适合近战和多段技能。
- 要设置每秒吸血上限，避免无敌。

### 3.6 真伤流

关键词：

```text
真实伤害
处决
防御无视
低血追加
护盾穿透
```

玩法：
- 绕过护甲和抗性。
- 数值必须克制。
- 最好绑定条件，比如低血、破盾、破韧、暴击后。

### 3.7 元素异常流

关键词：

```text
燃烧
冻结
感电
中毒
流血
诅咒
异常扩散
异常增伤
```

玩法：
- 火焰走爆炸和燃烧。
- 冰冷走控制和碎裂。
- 闪电走暴击和连锁。
- 毒素走持续叠层。
- 暗影走诅咒和削弱。

---

## 4. 触发词条方向

本批重点扩展这些触发玩法：

```text
OnHit                 击中
OnKill                击杀
OnCrit                暴击
OnTakeHit             受击
OnBlock               格挡
OnDodge               闪避
OnShieldBreak         破盾
OnPoiseBreak          破韧
OnProjectileHit       投射物命中
OnProjectileSplit     投射物分裂
OnAreaHit             AOE 命中
OnSummon              召唤时
OnMinionHit           召唤物击中
OnMinionKill          召唤物击杀
OnControlApplied      施加控制
OnControlEnd          控制结束
```

---

## 5. 装备、技能、天赋分工

### 5.1 装备负责随机性

装备提供：
- 基础数值
- 随机词条
- 稀有词条
- 传奇机制
- 套装机制
- 打造补强

### 5.2 技能负责行为

技能提供：
- 标签
- 伤害类型
- 攻击方式
- 投射物/AOE/召唤/控制行为
- 能否被某类词条影响

### 5.3 天赋负责方向

天赋提供：
- 长期成长方向
- 构筑强化
- 机制转化
- 代价与限制
- 职业专精特色

---

## 6. 本批文档目录

```text
169_数值扩展玩法总览_属性_伤害_防御_词条构筑.md
170_伤害类型与元素属性体系_物理_火冰雷毒暗圣_真伤.md
171_防御承伤体系_护甲_穿甲_护盾_破盾_抗性_减伤.md
172_暴击吸血反伤与资源回复体系_命中_击杀_受击.md
173_词条触发系统总设计_击杀_击中_受击_投射物_AOE_召唤_控制.md
174_击杀与击中词条玩法库_爆炸_召唤_连锁_附伤.md
175_投射物与AOE词条玩法库_数量_分裂_穿透_范围_重叠.md
176_召唤物与控制词条玩法库_额外召唤_增强_束缚_冻结_眩晕.md
177_装备词条池填充规则_前缀_后缀_传奇_套装_打造.md
178_技能系统词条接入规则_技能标签_辅助模块_技能成长.md
179_天赋系统词条接入规则_通用节点_关键节点_职业专精.md
180_数值词条数据表与JSON示例_Attribute_Affix_Trigger.md
181_数值扩展与词条玩法制作任务清单_验收标准.md
```
