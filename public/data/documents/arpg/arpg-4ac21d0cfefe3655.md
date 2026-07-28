# 159 玩家基础模型配置：骨架、BodyPart、职业体型、材质

## 1. 玩家模型目标

玩家基础模型是所有装备换装的承载体。它必须稳定、统一、可扩展。

必须支持：

- 多职业共用标准骨架
- 不同性别/体型
- 身体部位拆分
- 装备穿戴后隐藏身体部位
- 多材质槽
- 染色
- 发型/脸型/皮肤
- 运行时换装
- 动画一致性

---

## 2. 玩家基础 Prefab 结构

```text
PF_PlayerModel_Base
├── SkeletonRoot
│   └── Armature / Hips / Spine / Head / Arms / Legs
├── BodyPartRoot
│   ├── BP_Head
│   ├── BP_Hair
│   ├── BP_Torso
│   ├── BP_Arm_L
│   ├── BP_Arm_R
│   ├── BP_Hand_L
│   ├── BP_Hand_R
│   ├── BP_Leg_L
│   ├── BP_Leg_R
│   ├── BP_Foot_L
│   └── BP_Foot_R
├── EquipmentRoot
│   ├── EQ_Helmet
│   ├── EQ_Chest
│   ├── EQ_Gloves
│   ├── EQ_Pants
│   ├── EQ_Boots
│   └── EQ_Cloak
├── AttachmentRoot
│   ├── AT_Weapon_R
│   ├── AT_Weapon_L
│   ├── AT_Shield_L
│   ├── AT_Back
│   ├── AT_Waist
│   └── AT_Accessory
├── SocketRoot
│   ├── Weapon_R
│   ├── Weapon_L
│   ├── Shield_L
│   ├── Back
│   ├── Waist
│   ├── HeadTop
│   ├── Chest
│   └── Footstep
└── RendererRoot
```

---

## 3. 标准骨架要求

### 3.1 骨骼命名必须统一

建议使用统一命名：

```text
root
hips
spine_01
spine_02
spine_03
neck
head
clavicle_l
upperarm_l
lowerarm_l
hand_l
clavicle_r
upperarm_r
lowerarm_r
hand_r
upperleg_l
lowerleg_l
foot_l
toe_l
upperleg_r
lowerleg_r
foot_r
toe_r
```

### 3.2 职业可以不同体型，但骨架名要一致

不同职业可有：
- 身高差异
- 肩宽差异
- 体型差异
- 姿态差异

但骨骼名称必须一致，否则装备无法自动绑定。

---

## 4. BodyPart 拆分规则

BodyPart 用于装备覆盖时隐藏身体部位。

### 4.1 推荐拆分

| BodyPart | 用途 |
|---|---|
| Head | 头部 |
| Hair | 头发 |
| Torso | 躯干 |
| UpperArm_L/R | 上臂 |
| LowerArm_L/R | 下臂 |
| Hand_L/R | 手 |
| UpperLeg_L/R | 大腿 |
| LowerLeg_L/R | 小腿 |
| Foot_L/R | 脚 |
| Neck | 脖子 |

### 4.2 装备隐藏规则

例：穿胸甲时：

```json
{
  "hideBodyParts": [
    "Torso",
    "UpperArm_L",
    "UpperArm_R"
  ]
}
```

穿头盔时：

```json
{
  "hideBodyParts": [
    "Hair"
  ],
  "optionalHide": [
    "Head"
  ]
}
```

---

## 5. 玩家基础模型配置

```json
{
  "playerModelId": "PM_Warrior_Male_01",
  "career": "Warrior",
  "gender": "Male",
  "bodyType": "Strong",
  "skeletonId": "SK_Humanoid_Standard",
  "prefabPath": "Assets/Characters/Player/Warrior/PF_Warrior_Male_01.prefab",
  "bodyParts": {
    "Head": "SMR_Warrior_Head",
    "Hair": "SMR_Warrior_Hair",
    "Torso": "SMR_Warrior_Torso",
    "Hand_L": "SMR_Warrior_Hand_L",
    "Hand_R": "SMR_Warrior_Hand_R",
    "Foot_L": "SMR_Warrior_Foot_L",
    "Foot_R": "SMR_Warrior_Foot_R"
  },
  "defaultMaterials": [
    "MAT_Skin_Warrior_01",
    "MAT_Hair_Black",
    "MAT_Body_Default"
  ],
  "socketSetId": "SocketSet_Humanoid_Default"
}
```

---

## 6. 职业体型配置

```json
{
  "bodyTypeId": "Body_Strong_Male",
  "heightScale": 1.06,
  "shoulderWidth": 1.12,
  "armLength": 1.04,
  "legLength": 1.02,
  "defaultCameraHeight": 1.75,
  "capsuleHeight": 1.85,
  "capsuleRadius": 0.38
}
```

体型影响：
- 胶囊体
- 镜头高度
- 武器挂点偏移
- 部分装备缩放
- UI 角色预览高度

---

## 7. 材质配置

基础角色材质应支持：

```text
皮肤
头发
眼睛
身体基础布料
默认内衬
伤害闪白
元素染色
湿润/泥土/燃烧覆盖
```

材质槽示例：

```json
{
  "materialSlots": [
    {"slot": "Skin", "material": "MAT_Skin_01"},
    {"slot": "Hair", "material": "MAT_Hair_Black"},
    {"slot": "Eyes", "material": "MAT_Eye_Brown"}
  ]
}
```

---

## 8. 玩家模型初始化流程

```text
Create Player
→ Load PlayerBaseModel
→ Build Skeleton Cache
→ Apply BodyType
→ Apply Default BodyParts
→ Apply Saved Equipment Visuals
→ Apply Saved Attachments
→ Apply Materials / Dyes
→ Build LOD
→ Notify ModelReady
```

---

## 9. 验收标准

- 玩家基础模型能单独正常播放动画。
- 所有职业骨骼命名一致。
- 装备穿戴后能隐藏对应身体部位。
- 武器和挂件能挂到正确 Socket。
- 材质能被替换和染色。
- 换装后动画不破碎、不穿帮严重。
