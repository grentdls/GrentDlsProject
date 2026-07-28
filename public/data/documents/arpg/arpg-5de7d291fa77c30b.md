# 140 材质与 Shader 受击表现：闪白、元素染色、护盾破裂

## 1. 设计目标

材质反馈用于解决“命中了但看不出来”的问题。  
它必须配合伤害跳字、动作和特效，让每次命中在角色身体上有即时反馈。

---

## 2. 材质反馈类型

| 类型 | 用途 |
|---|---|
| FlashWhite | 普通受击闪白 |
| FlashColor | 元素伤害染色 |
| BurnGlow | 火焰灼烧 |
| FrostOverlay | 冰冷冻结 |
| ElectricPulse | 闪电脉冲 |
| PoisonTint | 毒性污染 |
| ShieldRipple | 护盾波纹 |
| ShieldCrack | 护盾破裂 |
| ArmorBreakSpark | 破甲火花 |
| WeakPointGlow | 弱点高亮 |
| DissolveDeath | 死亡溶解 |

---

## 3. 受击闪白规则

### 3.1 普通闪白

```text
FlashWhiteIntensity = 0.45
Duration = 0.08s
FadeOut = 0.12s
```

### 3.2 重击闪白

```text
FlashWhiteIntensity = 0.75
Duration = 0.10s
FadeOut = 0.16s
```

### 3.3 Boss 闪白
Boss 不宜整身大白屏，推荐：
- 局部闪白。
- 弱点闪光。
- 命中部位高亮。
- 大型 Boss 使用部位材质实例。

---

## 4. 元素染色规则

### 4.1 火焰
- 短暂橙红边缘发光。
- 命中点产生火星。
- 若进入燃烧状态，身体局部持续微亮。

### 4.2 冰冷
- 命中瞬间青蓝闪烁。
- 若冻结，添加冰霜覆盖层。
- 冻结破碎时材质切换碎裂效果。

### 4.3 闪电
- 短时间电弧流过身体。
- 材质亮度脉冲 2~3 次。
- 金黄/蓝白色细线效果。

### 4.4 毒性
- 绿色/黄绿染色。
- 轻微溶蚀边缘。
- DOT 期间低频脉冲。

### 4.5 暗影/诅咒
- 紫色阴影纹理覆盖。
- 边缘暗化。
- 可配合符文/裂纹效果。

---

## 5. 护盾表现

### 5.1 护盾吸收
当目标有护盾：
- 身体外层出现蓝白波纹。
- 伤害跳字显示护盾吸收。
- 不播放强受击动作，除非护盾破裂。

### 5.2 护盾破裂
护盾归零时：
- 蓝白裂纹扩散。
- 破盾音效。
- 跳字 Shield Break。
- 短 HitStop。
- 受击者轻/中硬直。

---

## 6. 破甲表现
破甲触发：
- 金属火花。
- 局部红橙裂纹。
- 护甲碎片粒子。
- 敌人防御下降 Buff 图标出现。

---

## 7. Shader 参数建议

```text
_HitFlashColor
_HitFlashIntensity
_HitFlashAmount
_HitFlashFade
_ElementColor
_ElementBlend
_ShieldRippleAmount
_ShieldCrackAmount
_WeakPointGlow
_DissolveAmount
```

---

## 8. Unity 实现建议

### 8.1 MaterialPropertyBlock
不要每次受击复制材质，使用 MaterialPropertyBlock。

```text
Renderer.SetPropertyBlock(block)
block.SetFloat("_HitFlashAmount", value)
```

### 8.2 多 Renderer 角色
角色可能有：
- 身体 Renderer。
- 武器 Renderer。
- 盔甲 Renderer。
- 头发 Renderer。
- 装饰 Renderer。

需要配置哪些 Renderer 接受受击闪烁。

### 8.3 Boss 部位
Boss 建议每个部位单独有：

```text
HitFeedbackReceiver
WeakPointRenderer
MaterialFlashController
```

---

## 9. 材质反馈优先级

```text
死亡溶解 > 冻结 > 护盾破裂 > 破甲 > 暴击闪白 > 元素染色 > 普通闪白
```

如果同时发生：
- 冰冻击杀：冻结覆盖死亡表现。
- 破盾 + 暴击：先护盾破裂，再短闪白。
- 火焰 DOT：不频繁触发强闪白，只保留燃烧脉冲。

---

## 10. 验收标准
- 普通命中必须有闪白。
- 暴击闪白更强但不刺眼。
- 元素伤害要能从身体反馈看出类型。
- 护盾吸收和血肉受击表现必须不同。
- Boss 大体型不要整身频繁闪白。
- 大量怪物同时受击不会产生材质实例爆炸。
