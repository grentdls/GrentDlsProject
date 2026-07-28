# 158 模型配置系统总览：玩家、敌人、装备、挂件

## 1. 文档目标

本批文档用于定义项目中的完整模型配置体系，覆盖：

- 玩家基础模型配置
- 敌人预制体模型配置
- 装备外观模型配置
- 盔甲 / 头盔 / 手套 / 鞋子 / 披风等 SkinnedMesh 换装
- 武器 / 饰品 / 背包 / 翅膀 / 特效挂件等挂点模型
- 运行时换模型
- 自动绑定骨骼
- 相对位置、旋转、缩放偏移
- 材质、染色、LOD、阴影、碰撞、特效挂点
- Unity Prefab 结构
- 数据表与 JSON 示例

目标是让策划可以通过配置表完成：

```text
装备 A
→ 使用哪个 Mesh
→ 绑定到哪个骨架
→ 使用哪些材质
→ 是否隐藏原身体部位
→ 是否附带挂件
→ 挂在哪个 Socket
→ 偏移多少
→ 旋转多少
→ 缩放多少
```

---

## 2. 模型配置系统总架构

```text
ModelConfigSystem
├── UnitModelConfig
│   ├── PlayerBaseModelConfig
│   ├── EnemyModelConfig
│   ├── BossModelConfig
│   └── SummonModelConfig
├── EquipmentVisualConfig
│   ├── SkinnedEquipmentConfig
│   ├── AttachmentEquipmentConfig
│   ├── WeaponVisualConfig
│   └── CosmeticVisualConfig
├── RuntimeModelBinder
│   ├── SkeletonResolver
│   ├── SkinnedMeshBinder
│   ├── SocketAttachmentBinder
│   ├── MaterialBinder
│   ├── HideBodyPartController
│   └── LODBinder
└── ModelPreviewEditor
    ├── Player Preview
    ├── Enemy Preview
    ├── Equipment Preview
    └── Socket Offset Editor
```

---

## 3. 模型类型划分

### 3.1 UnitBaseModel 单位基础模型

适用于：
- 玩家角色身体
- 怪物身体
- Boss 身体
- NPC 身体
- 召唤物身体

特点：
- 有完整骨架
- 有 Animator
- 有 Hitbox / Socket / Renderer
- 可以挂装备或部件

### 3.2 SkinnedEquipment 骨骼绑定装备

适用于：
- 头盔
- 胸甲
- 护肩
- 手套
- 裤子
- 鞋子
- 披风
- 全身外观套装

特点：
- 使用 SkinnedMeshRenderer
- 需要绑定到角色骨架
- 运行时把 bones 替换为角色骨骼
- 通常跟随角色动画变形

### 3.3 SocketAttachment 挂点装备

适用于：
- 武器
- 盾牌
- 项链
- 腰包
- 背包
- 肩饰
- 头饰
- 翅膀
- 尾巴
- 法器
- 武器挂饰
- 光环特效

特点：
- 不需要 SkinnedMesh 绑定
- 挂在指定 Socket 上
- 支持相对偏移、旋转、缩放
- 可带 Animator / VFX / Trail

### 3.4 MaterialOverride 材质外观

适用于：
- 染色
- 稀有度边光
- 皮肤
- 破损
- 发光纹路
- 元素附魔效果

---

## 4. 玩家模型系统目标

玩家模型必须支持：

```text
职业基础身体
+ 性别/体型
+ 发型/脸型
+ 装备换装
+ 武器挂点
+ 背部挂件
+ 腰部挂件
+ 材质染色
+ 战斗特效挂点
+ LOD
```

### 4.1 玩家基础结构

```text
PlayerModelRoot
├── SkeletonRoot
├── BodyParts
│   ├── Body_Base
│   ├── Head_Base
│   ├── Hair_Base
│   ├── Hands_Base
│   └── Feet_Base
├── EquipmentSkinnedRoot
│   ├── Helmet
│   ├── Chest
│   ├── Gloves
│   ├── Pants
│   ├── Boots
│   └── Cloak
├── AttachmentRoot
│   ├── Weapon_R
│   ├── Weapon_L
│   ├── Shield_L
│   ├── Back
│   ├── Waist
│   └── HeadAccessory
└── VFXSocketRoot
```

---

## 5. 敌人模型系统目标

敌人模型必须支持：

```text
敌人基础模型
+ 怪物种族骨架
+ 武器挂点
+ 护甲外观
+ 精英词缀外观
+ 元素变体材质
+ Boss 部位模型
+ 弱点挂点
+ 死亡/破碎/脱落部件
```

敌人也可以使用装备外观，但推荐分两类：

1. **固定怪物外观**：Prefab 内直接带 Mesh。
2. **模块化怪物外观**：通过配置附加武器、护甲、词缀特效。

---

## 6. 运行时换装流程

```text
装备变化
→ EquipmentVisualConfig 查询
→ 判断模型类型
→ 如果是 SkinnedMesh：绑定角色骨架
→ 如果是 Attachment：挂到 Socket
→ 应用材质
→ 隐藏冲突身体部位
→ 刷新 LOD
→ 刷新碰撞/Hitbox/Trail
→ 通知外观变化事件
```

伪流程：

```text
OnEquipmentChanged(slot, itemId):
    visual = GetEquipmentVisual(itemId)
    RemoveOldVisual(slot)
    if visual.type == SkinnedMesh:
        BindSkinnedMesh(visual)
    if visual.type == Attachment:
        AttachToSocket(visual)
    ApplyMaterials(visual)
    ApplyHideBodyParts(visual)
    RefreshLOD()
```

---

## 7. 骨骼自动校正规则

SkinnedMesh 装备换装时，需要将装备自身骨骼映射到玩家骨架。

规则：
- 装备导出时骨骼命名必须与标准骨架一致。
- 运行时按 boneName 查找目标骨骼。
- 找不到骨骼时走 fallback。
- 必须支持日志提示缺失骨骼。
- 不允许每个装备都带一套独立可动骨架。

骨骼映射示例：

```json
{
  "sourceBone": "spine_03",
  "targetBone": "spine_03"
}
```

---

## 8. 挂点系统目标

挂点系统必须支持：

```text
socketName
localPosition
localEuler
localScale
attachMode
followBone
hideWhenSheathed
showInTown
showInCombat
```

示例：

```json
{
  "socket": "Weapon_R",
  "localPosition": [0.02, -0.01, 0.04],
  "localEuler": [0, 90, 0],
  "localScale": [1, 1, 1],
  "attachMode": "FollowSocket"
}
```

---

## 9. 本批文档目录

```text
158_模型配置系统总览_玩家_敌人_装备_挂件.md
159_玩家基础模型配置_骨架_BodyPart_职业体型_材质.md
160_敌人预制体模型配置_怪物_Boss_精英变体.md
161_装备SkinnedMesh换装规则_盔甲_头盔_手套_鞋子_披风.md
162_挂件与武器模型配置_Socket_偏移_旋转_缩放_显隐.md
163_骨骼自动绑定与校正规则_BoneMapping_SkeletonResolver.md
164_材质皮肤染色与装备外观覆盖规则_MaterialVariant.md
165_模型Prefab结构_LOD_碰撞_Hitbox_VFX挂点.md
166_模型配置编辑器_预览_挂点调整_换装测试_校验.md
167_模型配置数据表与JSON示例_角色_敌人_装备_挂件.md
168_模型配置制作任务清单_验收标准.md
```
