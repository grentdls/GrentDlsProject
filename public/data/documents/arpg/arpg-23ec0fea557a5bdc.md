# 206 装备与技能标签接入规则：部位词条如何影响技能

## 1. 核心原则

装备词条不能直接写死影响某个技能，而是通过技能标签生效。

```text
装备词条
→ 检查 SkillTag
→ 检查 DamageType
→ 检查 TriggerEvent
→ 修改技能最终参数
```

---

## 2. 技能标签示例

```text
Melee
Projectile
AOE
Spell
Attack
Minion
Fire
Cold
Lightning
Poison
Shadow
Holy
DOT
Hit
Channel
Charge
Control
Shield
Movement
```

---

## 3. 装备词条匹配规则

### 3.1 武器词条

```text
重击技能穿甲 +20%
```

生效条件：
```text
SkillTag includes Melee
SkillTag includes Slam or Heavy
DamageType includes Physical
```

### 3.2 鞋子词条

```text
位移技能冷却 -15%
```

生效条件：
```text
SkillTag includes Movement
```

### 3.3 戒指词条

```text
火焰技能击杀时爆炸
```

生效条件：
```text
SkillTag includes Fire
Skill can trigger OnKill
```

### 3.4 手套词条

```text
击中有 20% 概率施加流血
```

生效条件：
```text
SkillTag includes Hit
DamageType includes Physical or Attack
DOT skills excluded
```

---

## 4. 参数修改流程

```text
SkillDefinition 原始参数
→ SkillLevel 成长
→ 装备属性
→ 装备触发词条
→ 套装效果
→ 天赋节点
→ Buff
→ 地图词缀
→ 最终 SkillRuntimeStats
```

---

## 5. 技能详情显示

技能详情必须显示装备影响：

```text
当前装备加成：
投射物数量 +2
远距离伤害 +18%
击中有 20% 概率感电
位移冷却 -15%
```

不适用词条也可以灰色显示：

```text
该技能不是投射物，无法受到“投射物分裂”影响。
```

---

## 6. 词条优先级

```text
禁用类规则 > 转化类规则 > 数量类规则 > 倍率类规则 > 附加类规则 > 显示类规则
```

例：
```text
传奇：投射物不能穿透
优先级高于
随机词条：投射物穿透 +2
```

---

## 7. 验收标准

- 装备词条通过技能标签生效。
- 技能详情能显示装备影响。
- 不适用词条不会错误生效。
- 禁用类传奇规则优先级最高。
