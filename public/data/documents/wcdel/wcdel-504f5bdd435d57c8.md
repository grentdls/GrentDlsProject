# 音效、BGM 与语音系统完整设计文档

> 项目类型：Unity 3D 世界逻辑 + 2D 序列帧角色表现 + DNF 式横版清版动作 RPG  
> 当前模块：音效、BGM、战斗音频、交互音频、UI 音频、语音系统、混音和音频配置工具  
> 核心目标：建立一套可配置、可扩展、可复用的完整音频系统，让角色动作、敌人行为、技能释放、场景切换、战斗状态、UI 操作和剧情语音都能统一管理。

---

## 1. 音频系统目标

音频系统需要解决 7 件事：

```text
1. 角色动作有清楚反馈：脚步、移动、跳跃、冲刺、普攻、技能、受击、死亡。
2. 敌人行为有辨识度：不同怪物、Boss、精英怪有不同音色。
3. 战斗打击感强：挥空、命中、暴击、穿甲、元素命中、击飞、倒地都有不同音效。
4. 场景氛围完整：城镇、野外、洞穴、森林、海边、Boss 房有不同环境声和 BGM。
5. UI 操作清楚：按钮点击、确认、取消、购买、装备、技能更换、错误提示都有反馈。
6. 剧情和角色有生命感：对话语音、短叫声、技能喊招、受击叫声、死亡叫声。
7. 配置方便：策划可以在工具里给动作帧、技能帧、任务、场景、UI 按钮配置音频。
```

最终目标：

```text
玩家不看画面，也能通过声音判断：
现在在哪里、谁在攻击、技能是否命中、是否暴击、角色是否受伤、Boss 是否要放大招。
```

---

## 2. 音频分类总览

### 2.1 一级分类

```text
BGM_Music          背景音乐
AMB_Ambience       环境音
SFX_Character      角色动作音效
SFX_Combat         战斗命中音效
SFX_Skill          技能音效
SFX_Enemy          敌人行为音效
SFX_Boss           Boss 专属音效
SFX_Interact       交互音效
SFX_UI             UI 音效
SFX_Item           物品音效
SFX_System         系统音效
VO_Player          玩家语音
VO_Enemy           敌人语音
VO_NPC             NPC 对话语音
VO_Boss            Boss 语音
```

### 2.2 命名规则

所有音频资源必须统一命名：

```text
分类_对象_行为_变化
```

示例：

```text
SFX_Player_Footstep_Grass_01
SFX_Player_Attack_Swing_Light_01
SFX_Player_Attack_Hit_Crit_01
SFX_DogHero_Skill_SwordQi_Cast_01
SFX_Enemy_Jackal_Claw_Hit_01
SFX_Boss_BeeGuard_Roar_Phase2_01
BGM_Town_GrassVillage_Loop
AMB_Forest_Day_Loop
VO_DogHero_Skill_Ultimate_01
SFX_UI_Button_Click_01
```

---

## 3. Unity 音频架构

### 3.1 AudioManager 总结构

推荐工程中只有一个全局 AudioManager：

```text
AudioManager
├── BGMController
├── AmbienceController
├── SFXController
├── VoiceController
├── UIAudioController
├── AudioPool
├── AudioMixerController
├── AudioSnapshotController
└── AudioConfigDatabase
```

### 3.2 场景内音频源

```text
GlobalAudioRoot
├── BGMSource_A
├── BGMSource_B
├── AmbienceSource_A
├── AmbienceSource_B
├── UISource
├── VoiceSource_Global
└── SFXPoolRoot
    ├── SFXSource_001
    ├── SFXSource_002
    └── ...
```

### 3.3 角色音频源

每个角色 Prefab 建议包含：

```text
CharacterRoot
├── AudioRoot
│   ├── AudioSource_Footstep
│   ├── AudioSource_Action
│   ├── AudioSource_Voice
│   └── AudioSource_Loop
```

说明：

```text
Footstep：脚步音，支持地面材质变化。
Action：普攻、技能、受击等短音效。
Voice：角色语音。
Loop：持续技能、蓄力、燃烧、护盾等循环音效。
```

---

## 4. Audio Mixer 分组

### 4.1 混音组结构

```text
Master
├── Music
│   ├── Music_Town
│   ├── Music_Field
│   ├── Music_Battle
│   ├── Music_Boss
│   └── Music_Cutscene
│
├── Ambience
│   ├── Ambience_Nature
│   ├── Ambience_Dungeon
│   ├── Ambience_Town
│   └── Ambience_Weather
│
├── SFX
│   ├── SFX_Player
│   ├── SFX_Enemy
│   ├── SFX_Boss
│   ├── SFX_Combat
│   ├── SFX_Skill
│   ├── SFX_Interact
│   ├── SFX_Item
│   └── SFX_UI
│
├── Voice
│   ├── Voice_Player
│   ├── Voice_NPC
│   ├── Voice_Enemy
│   └── Voice_Boss
│
└── System
    ├── System_Notification
    └── System_Error
```

### 4.2 玩家设置音量

设置界面至少提供：

```text
总音量 Master Volume
音乐音量 Music Volume
音效音量 SFX Volume
语音音量 Voice Volume
环境音量 Ambience Volume
UI 音量 UI Volume
```

默认值：

```text
Master: 100%
Music: 80%
SFX: 90%
Voice: 90%
Ambience: 65%
UI: 80%
```

---

## 5. 音频播放规则

### 5.1 2D / 3D 音效区分

| 类型 | 播放方式 | 说明 |
|---|---|---|
| UI 音效 | 2D | 不随距离衰减 |
| BGM | 2D | 全局播放 |
| 环境底噪 | 2D 或大范围 3D | 场景氛围 |
| 玩家动作 | 2D 或弱 3D | 玩家必须听清 |
| 敌人动作 | 3D | 根据距离衰减 |
| Boss 技能 | 2D + 3D 混合 | 既要定位也要有压迫感 |
| 对话语音 | 2D | 剧情阅读清楚 |
| 场景物件 | 3D | 门、机关、火堆、水流 |

推荐：

```text
玩家自身音效 70% 2D + 30% 空间感
敌人音效 3D 衰减
Boss 关键技能额外叠加 2D 强提示音
```

### 5.2 同类音效防刷屏

同一类音效短时间内不能无限叠加：

```text
脚步声：最小间隔 0.12s
普通命中：同目标同帧最多 1 个
DoT 命中：0.3s 内合并
UI 点击：0.05s 内只播一次
金币拾取：0.08s 内合并成连续拾取音
敌人死亡叫声：同屏最多同时 3 个
```

### 5.3 随机变体

每个常用音效至少 3 个变体：

```text
SFX_Player_Footstep_Grass_01
SFX_Player_Footstep_Grass_02
SFX_Player_Footstep_Grass_03
```

随机规则：

```text
随机选择变体
避免连续播放同一个变体
Pitch 随机 ±3%~6%
Volume 随机 ±5%
```

---

## 6. 角色移动音效

### 6.1 脚步声系统

脚步声由动画帧事件触发，而不是按时间固定播放。

移动动画中配置：

```text
Frame 02: Footstep_Left
Frame 06: Footstep_Right
```

迅捷移动 / 冲刺：

```text
Frame 01: Dash_Start
Frame 03: Dash_Whoosh
Frame 06: Dash_End_Dust
```

### 6.2 地面材质脚步

脚步声根据角色脚下 GroundMaterial 播放：

| 地面材质 | 音效 |
|---|---|
| Grass | 草地脚步 |
| Dirt | 泥土脚步 |
| Stone | 石板脚步 |
| Wood | 木板脚步 |
| Sand | 沙地脚步 |
| WaterShallow | 浅水脚步 |
| Snow | 雪地脚步 |
| Metal | 金属地面脚步 |
| Cave | 洞穴碎石脚步 |

命名：

```text
SFX_Footstep_Grass_01
SFX_Footstep_Dirt_01
SFX_Footstep_Stone_01
```

### 6.3 角色体型影响脚步

不同角色有不同脚步强度：

| 角色类型 | 音量倍率 | 低频 |
|---|---:|---|
| 小型老鼠 | 0.55 | 低 |
| 普通狗侠客 | 1.0 | 中 |
| 豺狼 / 恶犬 | 1.15 | 中高 |
| 大型精英 | 1.35 | 高 |
| Boss | 1.8 | 很高 |

### 6.4 移动状态影响脚步

| 状态 | 规则 |
|---|---|
| 慢走 | 音量 70%，间隔更长 |
| 普通移动 | 正常 |
| 疾跑 / 迅捷移动 | 音量 115%，频率更快 |
| 冲刺 | 播放 whoosh + 尘土 |
| 跳跃起跳 | 起跳脚步 + 尘土 |
| 落地 | 根据落地速度播放轻/重落地 |

---

## 7. 玩家角色动作音效

### 7.1 基础动作音效

```text
SFX_Player_Idle_Cloth
SFX_Player_Move_Footstep
SFX_Player_Jump_Start
SFX_Player_Jump_Air
SFX_Player_Land_Light
SFX_Player_Land_Heavy
SFX_Player_Dash_Start
SFX_Player_Dash_Whoosh
SFX_Player_Dash_End
```

### 7.2 普攻音效

三段普攻需要区分：

```text
Attack_01：轻挥，短促
Attack_02：中挥，略重
Attack_03：重砍，有低频和收招感
```

帧事件示例：

```text
Attack_01
Frame 02: SFX_Player_Attack_Swing_Light
Frame 04: SFX_Player_Attack_Hit_Light，如果命中才播命中音

Attack_02
Frame 02: SFX_Player_Attack_Swing_Mid
Frame 05: SFX_Player_Attack_Hit_Mid

Attack_03
Frame 03: SFX_Player_Attack_Swing_Heavy
Frame 06: SFX_Player_Attack_Hit_Heavy
Frame 06: SFX_Combat_HitStop_Heavy，可选短冲击音
```

### 7.3 挥空与命中分离

必须分离：

```text
挥空音 Swing：攻击动作一定播放
命中音 Hit：检测到目标命中时才播放
```

原因：

```text
玩家能听出是否打中。
打空只有风声。
打中有肉感 / 金属 / 骨头 / 元素反馈。
```

### 7.4 受击音效

玩家受击分级：

| 受击类型 | 音效 |
|---|---|
| LightHit | 短痛叫 + 轻命中 |
| HeavyHit | 重痛叫 + 重击冲击 |
| Knockback | 后退摩擦 + 痛叫 |
| Launch | 被挑飞叫声 + 风声 |
| Knockdown | 倒地撞击 |
| GetUp | 起身衣物摩擦 |
| Dead | 死亡叫声 + 倒地 |

命名：

```text
SFX_Player_Hit_Light_01
SFX_Player_Hit_Heavy_01
SFX_Player_Knockback_01
SFX_Player_Launch_01
SFX_Player_Knockdown_01
SFX_Player_Dead_01
```

---

## 8. 敌人音效规则

### 8.1 敌人音效分类

每个敌人至少需要：

```text
Idle 呼吸 / 嘀咕，可选
Alert 发现玩家
Move 移动脚步
Attack_Windup 攻击前摇
Attack_Swing 攻击挥动
Attack_Hit 命中
Skill_Cast 技能释放
Hit_Light 轻受击
Hit_Heavy 重受击
Death 死亡
```

### 8.2 敌人类型音色

| 敌人 | 音色方向 |
|---|---|
| 恶犬 | 低吼、粗鲁、木棍挥击、重脚步 |
| 豺狼 | 尖利、凶狠、爪击、嘶吼 |
| 老鼠小弟 | 胆小、尖叫、慌张脚步、小刀轻响 |
| 狐妖 | 妩媚、灵巧、仙术铃音、轻飘脚步 |
| 轮椅剑客 | 木轮滚动、剑气、布衣摩擦、沉稳呼吸 |
| Boss | 厚重、低频、长吼、压迫感 |

### 8.3 敌人距离衰减

普通敌人：

```text
MinDistance: 2
MaxDistance: 12
SpatialBlend: 0.7~1.0
```

Boss：

```text
近距离部分 3D
关键技能叠加全局 2D 提示
```

### 8.4 敌人同时发声限制

同屏很多小怪时必须限制：

```text
普通敌人 Idle 音：同屏最多 4 个
普通敌人受击叫声：同帧最多 5 个
普通敌人死亡叫声：同帧最多 3 个
Boss 音效不被普通敌人抢占
玩家音效优先级最高
```

---

## 9. 战斗命中音效

### 9.1 命中材质

命中音不能只有一种。目标需要有 HitMaterial：

```text
Flesh       肉体
Fur         毛皮
Bone        骨头
Wood        木头
Stone       石头
Metal       金属
Shield      护盾
Slime       软体
Ghost       灵体
```

同一个攻击命中不同目标时播放不同命中音：

```text
剑砍恶犬：Flesh/Fur
剑砍木桶：Wood
剑砍石像：Stone
剑砍护盾：Shield
```

### 9.2 命中强度

命中强度影响音效：

| 强度 | 音效 |
|---|---|
| Light | 轻打击 |
| Medium | 标准命中 |
| Heavy | 重打击 |
| Critical | 暴击加强 |
| ArmorPierce | 穿甲碎裂 |
| Break | 破防爆裂 |
| Execute | 斩杀重音 |

### 9.3 命中音效组合

一次命中可以由多层组成：

```text
基础命中层：砍中肉体
武器层：剑 / 爪 / 棍 / 法术
特殊层：暴击 / 穿甲 / 元素
环境层：震动 / 低频
```

例如火元素暴击：

```text
SFX_Hit_Flesh_Mid
+ SFX_Element_Fire_Hit
+ SFX_Combat_Crit_Impact
```

### 9.4 暴击音效

暴击必须明显：

```text
更尖锐的冲击开头
更亮的高频
轻微金属闪光感
可叠加低频 thump
```

命名：

```text
SFX_Combat_Crit_01
SFX_Combat_Crit_Heavy_01
```

### 9.5 穿甲音效

穿甲需要有：

```text
金属破裂
盾牌裂开
碎片飞散
短促强冲击
```

命名：

```text
SFX_Combat_ArmorPierce_01
SFX_Combat_ArmorBreak_01
```

---

## 10. 元素技能音效

### 10.1 元素音色规则

| 元素 | 音色方向 |
|---|---|
| 火 | 爆燃、火苗、热浪、短爆炸 |
| 冰 | 冰裂、寒风、晶体碎裂 |
| 雷 | 电流、闪击、尖锐啪声 |
| 毒 | 气泡、黏液、腐蚀 |
| 风 | 气流、风刃、呼啸 |
| 土 | 石裂、沉重、岩石摩擦 |
| 光 | 清亮、铃音、星芒 |
| 暗 | 低频、扭曲、暗雾 |

### 10.2 技能音效结构

每个技能推荐拆成：

```text
Cast_Start      起手
Charge_Loop     蓄力循环，可选
Release         释放
Projectile      飞行，可选
Hit             命中
End             结束 / 消散
```

示例：剑气技能：

```text
Frame 01: SFX_SwordQi_Cast_Start
Frame 04: SFX_SwordQi_Release
Projectile Spawn: SFX_SwordQi_Fly_Loop
OnHit: SFX_SwordQi_Hit
OnEnd: SFX_SwordQi_Disperse
```

### 10.3 持续技能音效

持续技能不能每帧播放短音效，必须用 Loop：

```text
LoopStart
LoopUpdate
LoopEnd
```

例如火焰旋风：

```text
SFX_FireWhirl_Start
SFX_FireWhirl_Loop
SFX_FireWhirl_End
```

Loop 音需要：

```text
随技能结束立即淡出
最多 0.1~0.2s FadeOut
不能残留
```

---

## 11. Boss 音效与音乐规则

### 11.1 Boss 音效层级

Boss 音效优先级高于普通敌人：

```text
Boss_Roar
Boss_Footstep
Boss_Attack_Windup
Boss_Attack_Impact
Boss_Skill_Cast
Boss_PhaseChange
Boss_Stun
Boss_Break
Boss_Death
```

### 11.2 Boss 强大技能屏幕音效

Boss 大招必须有完整音频流程：

```text
预警低频 Rumble
蓄力上升音 Rise
释放瞬间 Impact
地面震动 SubHit
技能残留 Loop / Tail
结束消散 End
```

示例：Boss 全屏震击：

```text
Frame 01: SFX_Boss_Smash_Windup_Rumble
Frame 20: SFX_Boss_Smash_Rise
Frame 35: SFX_Boss_Smash_Impact
Frame 36: SFX_Camera_Shake_LowBoom
Frame 50: SFX_Boss_Smash_Debris_End
```

### 11.3 Boss 阶段变化

Boss 进入二阶段：

```text
BGM 切换或增加层
Boss 怒吼
环境低频增强
短暂静音 0.1s 后爆发，可选
```

流程：

```text
Boss HP <= PhaseThreshold
→ BGM 进入过渡段
→ 播放 Boss_Phase_Roar
→ 混音压低其他敌人音效
→ BGM 进入 Phase2 Loop
```

---

## 12. 交互音效

### 12.1 常见交互音效

```text
SFX_Interact_Talk
SFX_Interact_Confirm
SFX_Interact_Inspect
SFX_Interact_Chest_Open
SFX_Interact_Chest_Rare
SFX_Interact_Door_Open_Wood
SFX_Interact_Door_Close_Wood
SFX_Interact_Door_Locked
SFX_Interact_Gate_Open_Stone
SFX_Interact_Switch_On
SFX_Interact_Switch_Off
SFX_Interact_Portal_Activate
SFX_Interact_Portal_Teleport
SFX_Interact_SavePoint
SFX_Interact_Shrine_Activate
SFX_Interact_ItemPickup
```

### 12.2 开门音效

不同门材质：

| 门类型 | 音效 |
|---|---|
| 木门 | 木轴吱呀 + 门板碰撞 |
| 石门 | 石块摩擦 + 低频 |
| 铁门 | 金属摩擦 + 锁链 |
| 魔法门 | 法术嗡鸣 + 闪光 |
| Boss 门 | 低频压迫 + 大门重响 |

### 12.3 宝箱音效

普通宝箱：

```text
打开咔哒
木箱盖开启
奖励飞出
```

稀有宝箱：

```text
打开音更亮
奖励闪光音
短小胜利音
```

Boss 宝箱：

```text
沉重开启
金光爆发
奖励展示音
```

---

## 13. 物品和装备音效

### 13.1 获得物品

```text
普通材料：轻拾取
金币：连续叮当
药水：玻璃瓶声
装备：金属/布料获得音
稀有装备：闪光提示音
任务物品：明确提示音
```

### 13.2 装备操作

```text
装备武器：金属拔出/挂上
装备衣服：布料摩擦
装备饰品：清脆小音
卸下装备：低音轻放
强化成功：铁锤 + 星光
强化失败，如果有：破裂 / 低沉
```

### 13.3 道具使用

```text
生命药水：瓶塞 + 喝下 + 治疗光
魔法药水：水晶流动
解毒草：草药揉碎 + 清除毒雾
卷轴：纸张展开 + 法术传送
```

---

## 14. UI 音效系统

### 14.1 UI 音效分类

```text
按钮悬停
按钮点击
按钮按下
按钮释放
确认
取消
返回
错误
弹窗打开
弹窗关闭
页面切换
标签切换
列表滚动
物品选中
装备穿戴
技能装配
技能升级
购买
出售
任务接取
任务完成
地图打标记
传送确认
```

### 14.2 UI 音效命名

```text
SFX_UI_Button_Hover
SFX_UI_Button_Click
SFX_UI_Button_Confirm
SFX_UI_Button_Cancel
SFX_UI_Error
SFX_UI_Panel_Open
SFX_UI_Panel_Close
SFX_UI_Tab_Switch
SFX_UI_List_Scroll
SFX_UI_Item_Select
SFX_UI_Skill_Equip
SFX_UI_Quest_Accept
SFX_UI_Quest_Complete
```

### 14.3 UI 音效规则

```text
点击要短，不拖尾
错误要明显但不刺耳
确认和取消必须不同
打开大界面音效比小按钮更明显
同一按钮快速点击要限频
UI 音效永远是 2D，不受角色位置影响
```

### 14.4 UI 限频

```text
ButtonHover: 0.05s
ButtonClick: 0.05s
Error: 0.3s
ListScroll: 0.08s
ItemSelect: 0.05s
```

---

## 15. BGM 系统

### 15.1 BGM 分类

```text
主界面音乐
城镇音乐
野外探索音乐
洞穴音乐
副本音乐
普通战斗音乐
精英战斗音乐
Boss 战斗音乐
剧情音乐
胜利音乐
失败音乐
商店音乐，可选
神殿音乐，可选
```

### 15.2 场景音乐规则

| 场景 | BGM 方向 |
|---|---|
| 主界面 | 温暖、冒险感、轻快 |
| 城镇 | 安全、生活感、轻松 |
| 草原 | 明亮、探索、节奏轻 |
| 森林 | 神秘、自然、稍微紧张 |
| 洞穴 | 低沉、回声、危险 |
| 沙漠 | 空旷、热风、异域 |
| 雪地 | 清冷、空灵 |
| 海边 | 开阔、浪潮、冒险 |
| 普通战斗 | 节奏加快、中等紧张 |
| Boss 战 | 强节奏、低频、压迫 |

### 15.3 BGM 状态切换

BGM 不应硬切，使用淡入淡出。

常用参数：

```text
普通场景切换 FadeOut 1.0s / FadeIn 1.0s
进入普通战斗 FadeOut 0.6s / FadeIn 0.4s
进入 Boss 战 FadeOut 0.3s / Boss Intro 1.5s / Loop
战斗结束 FadeOut 0.8s / 恢复探索 BGM 1.0s
```

### 15.4 BGM 层级系统

推荐 BGM 分层：

```text
Base Layer       基础旋律
Percussion Layer 战斗鼓点
Tension Layer    紧张层
Boss Layer       Boss 低频层
Victory Stinger  胜利短乐句
```

探索状态：

```text
Base Layer
```

普通战斗：

```text
Base + Percussion
```

Boss 战：

```text
Boss Intro → Boss Loop：Base + Percussion + Tension + Boss Layer
```

### 15.5 战斗音乐触发规则

进入战斗条件：

```text
玩家进入敌人仇恨
敌人攻击玩家
玩家攻击敌人
进入战斗区域
Boss 战开始
```

退出战斗条件：

```text
周围无仇恨敌人
玩家 5 秒未被攻击
玩家 5 秒未攻击敌人
战斗区域清空
Boss 死亡
```

推荐：

```text
普通战斗退出延迟：5s
Boss 战退出：Boss 死亡后进入胜利短音乐
```

### 15.6 Boss BGM 流程

```text
Boss 入口确认
→ 淡出当前音乐
→ Boss 登场 Sting
→ Boss Intro
→ Boss Loop Phase1
→ 血量进入 Phase2
→ Phase Change Sting
→ Boss Loop Phase2
→ Boss 死亡
→ Victory Sting
→ 恢复场景音乐
```

---

## 16. 环境音系统

### 16.1 环境音分类

```text
自然环境：风、鸟、虫、树叶、水流
城镇环境：人声、木牌、炉火、脚步远声
洞穴环境：水滴、回声、石块、低风
海边环境：海浪、海鸥、船木响
战斗区域：远处咆哮、火焰、魔法能量
天气：雨、雷、雪、沙尘
```

### 16.2 环境音分层

每个场景环境音分三层：

```text
BaseAmbience      场景底噪
RandomOneShot     随机点缀音
LocalLoop         局部循环音源
```

示例：森林：

```text
BaseAmbience: 风 + 树叶
RandomOneShot: 鸟叫、虫鸣、远处怪声
LocalLoop: 瀑布、水流、火堆
```

### 16.3 随机环境音规则

```text
随机间隔：5~20s
同类音不连续播放
根据区域权重选择
战斗中降低随机环境音频率
剧情中可静音或降低
```

---

## 17. 语音系统

### 17.1 语音类型

```text
对话语音
角色短叫声
技能喊招
受击叫声
死亡叫声
Boss 台词
战斗提示语音
系统提示语音，可选
```

### 17.2 对话语音规则

对话可以有两种方案：

#### 方案 A：完整配音

```text
每句对白都有完整语音
适合关键剧情和主线
成本高
```

#### 方案 B：短语音 / 叫声式语音

```text
每个角色有若干情绪音
文本显示时播放短音
适合大量 NPC
成本低
类似可爱 RPG 的表达方式
```

推荐：

```text
主线关键剧情：完整或半完整语音
普通 NPC：情绪短语音
敌人：短叫声
Boss：关键台词
```

### 17.3 对话语音情绪

每个 NPC 至少准备：

```text
Neutral 普通
Happy 开心
Angry 生气
Sad 难过
Surprised 惊讶
Fear 害怕
Thinking 思考
Confirm 确认
```

对白配置：

```text
SpeakerID
Text
Emotion
VoiceClip
UseMumble
MumbleStyle
```

### 17.4 文本打字音

如果没有完整语音，可以使用打字音：

```text
每 2~4 个字播放一次短音
根据角色音色不同更换音高
标点暂停
情绪影响音高和速度
```

规则：

```text
普通：每 3 字一声
激动：每 2 字一声，Pitch +5%
低沉：每 4 字一声，Pitch -5%
```

### 17.5 技能喊招语音

技能语音触发不能每次都喊，否则吵。

规则：

```text
小技能：30% 概率喊
中技能：50% 概率喊
大技能：80% 概率喊
绝技：100% 喊
同一句语音冷却：8~15s
同角色连续技能喊招间隔：2s
```

### 17.6 玩家语音

玩家需要：

```text
Attack_轻喝 3~5 条
Attack_重击 3 条
Skill_小技能 3 条
Skill_大技能 3 条
Ultimate 2~3 条
Hit_Light 3 条
Hit_Heavy 3 条
LowHP 2 条
Death 2 条
Victory 2 条
```

### 17.7 敌人语音

敌人需要：

```text
Alert 发现玩家
Attack 攻击叫声
Skill 释放技能
Hit 受击
Death 死亡
Flee 逃跑，胆小敌人专用
```

老鼠小弟示例：

```text
Alert：吱？！有人来了！
Attack：别、别过来！
Flee：救命啊！
Death：吱——
```

Boss 示例：

```text
Intro 登场台词
PhaseChange 阶段转换台词
Ultimate 大招台词
Stun 破防台词
Death 死亡台词
```

---

## 18. 语音抢占与优先级

### 18.1 语音优先级

从高到低：

```text
剧情关键语音
Boss 大招语音
玩家死亡语音
玩家受击重伤语音
玩家绝技语音
Boss 普通语音
玩家普通技能语音
敌人语音
NPC 普通短语音
```

### 18.2 抢占规则

```text
剧情语音播放时，降低 SFX 音量 20%
Boss 大招语音可以压低普通敌人语音
玩家语音不被普通敌人打断
同一角色 VoiceSource 同时只播一条语音
重要语音可打断不重要语音
```

### 18.3 对话 Ducking

进入剧情对话时：

```text
Music 降低 15%~25%
Ambience 降低 20%
SFX 保持或降低 10%
Voice 保持 100%
```

退出对话后恢复。

---

## 19. 音频事件系统

### 19.1 事件触发来源

音频可由这些系统触发：

```text
动画帧事件
技能事件
伤害事件
状态事件
UI 事件
任务事件
场景事件
AI 事件
剧情事件
```

### 19.2 AudioEvent 数据结构

```text
AudioEventID
AudioType
ClipGroupID
MixerGroup
Volume
Pitch
RandomPitchRange
SpatialMode
MinDistance
MaxDistance
Priority
Cooldown
CanOverlap
Loop
FadeIn
FadeOut
FollowTarget
AttachPoint
```

### 19.3 ClipGroup

不要直接配置单个 Clip，应该配置 ClipGroup：

```text
ClipGroupID: Player_Footstep_Grass
Clips:
    SFX_Player_Footstep_Grass_01
    SFX_Player_Footstep_Grass_02
    SFX_Player_Footstep_Grass_03
RandomMode: NoRepeat
PitchRandom: ±4%
VolumeRandom: ±5%
```

---

## 20. 动画帧音频配置

每个动作配置中需要 Audio Track：

```text
Frame 01: 无
Frame 02: SFX_Attack_Swing
Frame 04: HitBoxOn
Frame 04: 命中时触发 Hit 音
Frame 06: SFX_Cloth_Move
```

注意：

```text
挥空音用动画帧事件。
命中音用 DamageResult 事件。
```

这样不会出现：

```text
没打中却播放肉体命中音。
```

---

## 21. 场景音乐配置

### 21.1 SceneAudioConfig

每个场景配置：

```text
SceneID
DefaultBGM
BattleBGM
BossBGM
AmbienceBase
RandomAmbienceSet
MusicFadeIn
MusicFadeOut
BattleSwitchDelay
ReverbPreset
```

示例：草原村

```text
SceneID: GrassVillage
DefaultBGM: BGM_Town_GrassVillage_Loop
BattleBGM: None
AmbienceBase: AMB_Town_Day_Loop
RandomAmbienceSet: TownRandom
ReverbPreset: OutdoorSmall
```

示例：草原野外

```text
SceneID: GrassField
DefaultBGM: BGM_Field_Grass_Loop
BattleBGM: BGM_Battle_Normal_Grass
AmbienceBase: AMB_Field_Wind_Birds
RandomAmbienceSet: GrassFieldRandom
```

示例：Boss 房

```text
SceneID: BeeGuardBossRoom
DefaultBGM: None
BossBGM: BGM_Boss_BeeGuard_Phase1
AmbienceBase: AMB_BossRoom_LowWind
```

---

## 22. 音频配置表模板

### 22.1 AudioClipGroup.csv

```csv
ClipGroupID,ClipPath,Weight,Volume,Pitch,RandomPitch,Category
Player_Footstep_Grass,SFX_Player_Footstep_Grass_01,1,0.8,1.0,0.04,SFX
Player_Footstep_Grass,SFX_Player_Footstep_Grass_02,1,0.8,1.0,0.04,SFX
Player_Attack_Swing_Light,SFX_Player_Attack_Swing_Light_01,1,0.9,1.0,0.03,SFX
Combat_Hit_Flesh_Light,SFX_Combat_Hit_Flesh_Light_01,1,0.9,1.0,0.04,SFX
UI_Button_Click,SFX_UI_Button_Click_01,1,0.8,1.0,0.02,UI
```

### 22.2 AudioEventConfig.csv

```csv
AudioEventID,ClipGroupID,MixerGroup,Volume,SpatialBlend,MinDistance,MaxDistance,Priority,Cooldown,Loop,FadeIn,FadeOut
EVT_Footstep_Grass,Player_Footstep_Grass,SFX_Player,0.8,0.5,1,8,40,0.12,false,0,0
EVT_Attack_Swing_Light,Player_Attack_Swing_Light,SFX_Player,0.9,0.3,1,10,60,0.03,false,0,0
EVT_UI_Click,UI_Button_Click,SFX_UI,0.8,0,0,0,50,0.05,false,0,0
EVT_BGM_Town,BGM_Town_GrassVillage,Music_Town,0.8,0,0,0,10,0,true,1,1
```

### 22.3 SurfaceAudioConfig.csv

```csv
SurfaceType,FootstepGroup,LandLightGroup,LandHeavyGroup,DashGroup
Grass,Player_Footstep_Grass,SFX_Land_Grass_Light,SFX_Land_Grass_Heavy,SFX_Dash_Grass
Dirt,Player_Footstep_Dirt,SFX_Land_Dirt_Light,SFX_Land_Dirt_Heavy,SFX_Dash_Dirt
Stone,Player_Footstep_Stone,SFX_Land_Stone_Light,SFX_Land_Stone_Heavy,SFX_Dash_Stone
WaterShallow,Player_Footstep_Water,SFX_Land_Water_Light,SFX_Land_Water_Heavy,SFX_Dash_Water
```

### 22.4 SceneAudioConfig.csv

```csv
SceneID,DefaultBGM,BattleBGM,BossBGM,AmbienceBase,RandomAmbienceSet,FadeIn,FadeOut,ReverbPreset
MainMenu,BGM_MainMenu,,,AMB_Menu_Wind,,1.0,1.0,OutdoorSmall
GrassVillage,BGM_Town_GrassVillage,,,AMB_Town_Day,TownRandom,1.0,1.0,OutdoorSmall
GrassField,BGM_Field_Grass,BGM_Battle_Normal,,AMB_Field_Grass,GrassRandom,1.0,0.8,Outdoor
BeeBossRoom,,BGM_Battle_Tension,BGM_Boss_BeeGuard,AMB_BossRoom,BossRoomRandom,0.5,0.5,CaveLarge
```

### 22.5 VoiceConfig.csv

```csv
VoiceID,CharacterID,VoiceType,Emotion,ClipGroupID,Priority,Cooldown,Chance,CanInterrupt
VO_DogHero_Attack_Light,DogHero,Attack,Normal,VO_DogHero_Attack_Light_Group,50,1.5,0.35,false
VO_DogHero_Ultimate,DogHero,Ultimate,Brave,VO_DogHero_Ultimate_Group,90,10,1.0,true
VO_Mouse_Flee,Enemy_MouseWeak,Flee,Fear,VO_Mouse_Flee_Group,45,5,0.8,false
VO_Boss_Phase2,Boss_BeeGuard,PhaseChange,Angry,VO_Boss_BeeGuard_Phase2,95,999,1.0,true
```

---

## 23. 音频配置工具界面

### 23.1 工具入口

```text
Tools / Game / Audio Config Tool
```

### 23.2 页面结构

```text
1. ClipGroup 管理
2. AudioEvent 管理
3. 角色动作音频
4. 技能音频
5. 敌人 / Boss 音频
6. UI 音频
7. 场景 BGM / 环境音
8. 语音配置
9. 混音与快照
10. 预览测试
```

### 23.3 角色动作音频页

功能：

```text
选择角色
选择动作
查看动画帧时间轴
给指定帧添加音频事件
区分挥空音、命中音、脚步音、语音
预览播放
```

### 23.4 技能音频页

功能：

```text
选择技能
配置 Cast / Charge / Release / Projectile / Hit / End
配置 Loop 音效
配置技能语音概率
配置技能命中元素音
预览整套技能声音
```

### 23.5 场景音频页

功能：

```text
选择场景
配置默认 BGM
配置战斗 BGM
配置 Boss BGM
配置环境底噪
配置随机环境音
配置混响
配置淡入淡出时间
```

### 23.6 语音配置页

功能：

```text
选择角色
选择语音类型
选择情绪
配置语音 ClipGroup
配置播放概率
配置冷却
配置优先级
测试播放
```

---

## 24. BGM 切换状态机

### 24.1 BGM 状态

```text
None
MainMenu
Town
Explore
Dungeon
NormalBattle
EliteBattle
BossIntro
BossPhase1
BossPhase2
Victory
Defeat
Cutscene
```

### 24.2 状态切换

```text
Town → Explore：进入野外
Explore → NormalBattle：进入战斗
NormalBattle → Explore：脱战 5 秒
Explore → BossIntro：触发 Boss
BossIntro → BossPhase1：Intro 播完
BossPhase1 → BossPhase2：Boss 二阶段
BossPhase2 → Victory：Boss 死亡
Victory → Explore：胜利短乐句结束
```

---

## 25. 混音快照规则

### 25.1 常用 Snapshot

```text
Snapshot_Normal
Snapshot_Combat
Snapshot_Boss
Snapshot_Dialogue
Snapshot_Menu
Snapshot_Pause
Snapshot_Underwater
Snapshot_LowHP
Snapshot_SlowMotion
```

### 25.2 快照效果

Dialogue：

```text
Music -20%
Ambience -25%
SFX -10%
Voice 100%
```

Boss：

```text
Music 100%
SFX 95%
Ambience -20%
EnemyVoice 普通敌人 -30%
BossVoice 100%
```

Pause：

```text
Music 50%
Ambience 40%
SFX 静音或极低
UI 100%
```

LowHP：

```text
Music 加轻微低通，可选
心跳音循环
环境音略降
```

---

## 26. 音频性能规则

### 26.1 对象池

必须池化 AudioSource：

```text
SFX Pool: 48~96
Voice Pool: 12~24
Loop Pool: 16
3D Local Audio Pool: 32
```

### 26.2 优先级

如果 AudioSource 不够，按优先级保留：

```text
玩家关键音效
Boss 关键音效
剧情语音
玩家受击
玩家技能
Boss 技能
UI
普通敌人
环境随机音
普通脚步
```

### 26.3 同屏限制

```text
普通脚步最多 12 个
普通敌人攻击音最多 8 个
普通敌人受击音最多 10 个
持续 Loop 最多 16 个
随机环境音最多 4 个
```

### 26.4 音频格式建议

| 类型 | 格式 | Load Type |
|---|---|---|
| 短 SFX | WAV / OGG | Decompress On Load |
| UI SFX | WAV | Decompress On Load |
| BGM | OGG | Streaming |
| 环境长 Loop | OGG | Streaming |
| 语音 | OGG / WAV | Compressed In Memory |

---

## 27. Unity 脚本结构建议

```text
Assets/Game/Scripts/Audio/
├── AudioManager.cs
├── BGMController.cs
├── AmbienceController.cs
├── SFXController.cs
├── VoiceController.cs
├── UIAudioController.cs
├── AudioPool.cs
├── AudioEventPlayer.cs
├── AudioMixerController.cs
├── AudioSnapshotController.cs
├── SurfaceAudioDetector.cs
├── CharacterAudioController.cs
├── SkillAudioController.cs
├── SceneAudioController.cs
├── DialogueVoiceController.cs
└── AudioSettingsSaveData.cs
```

数据：

```text
Assets/Game/Scripts/Audio/Data/
├── AudioClipGroupConfig.cs
├── AudioEventConfig.cs
├── SurfaceAudioConfig.cs
├── SceneAudioConfig.cs
├── VoiceConfig.cs
├── MusicStateConfig.cs
└── AudioPriorityConfig.cs
```

编辑器：

```text
Assets/Game/Scripts/Audio/Editor/
├── AudioConfigToolWindow.cs
├── ClipGroupEditorView.cs
├── AudioEventEditorView.cs
├── CharacterAudioTimelineView.cs
├── SkillAudioEditorView.cs
├── SceneAudioEditorView.cs
├── VoiceConfigEditorView.cs
└── AudioPreviewPlayer.cs
```

---

## 28. 开发 MVP 范围

### 28.1 第一版必须做

```text
AudioManager
AudioMixer 分组
BGM 播放与切换
场景环境音
UI 音效
角色脚步声，按地面材质切换
普攻挥空音
普攻命中音
技能 Cast / Release / Hit 音效
玩家受击 / 死亡音效
敌人攻击 / 受击 / 死亡音效
Boss 登场 / 攻击 / 阶段变化 / 死亡音效
交互音效：对话、宝箱、门、传送点
语音基础系统：技能喊招、受击叫声、NPC 短语音
音量设置保存
对象池
音频限频
```

### 28.2 后续再做

```text
动态分层 BGM
完整剧情配音
高级混响区域
水下低通
复杂天气音频
自动音频响度分析
音频资源热更新
```

---

## 29. 验收标准

### 29.1 角色动作验收

```text
移动有脚步声
不同地面脚步不同
跳跃和落地声音正确
普攻挥空和命中声音不同
三段普攻强度不同
技能有起手、释放、命中音
受击、击飞、倒地、死亡有对应声音
```

### 29.2 战斗验收

```text
暴击音效明显强于普通命中
穿甲音效有破裂感
元素命中有对应元素音色
Boss 大招有清楚预警音
敌人音效不会盖过玩家和 Boss
大量敌人同时攻击不会炸音
```

### 29.3 UI 验收

```text
所有按钮点击有反馈
确认、取消、错误声音不同
购买、装备、技能更换、任务完成有独立音效
UI 音效不受场景距离影响
快速点击不会刷屏
```

### 29.4 BGM 验收

```text
不同场景音乐不同
进入战斗能切战斗音乐
脱战能恢复探索音乐
Boss 战有独立音乐流程
Boss 二阶段音乐变化明显
切歌无硬断
```

### 29.5 语音验收

```text
对话能播放语音或短语音
技能喊招不会过于频繁
Boss 关键语音优先级高
玩家受击语音能听清
语音音量可单独调整
```

---

## 30. 推荐开发顺序

```text
第 1 步：建立 AudioMixer 分组和设置界面音量滑条
第 2 步：实现 AudioManager 和 AudioPool
第 3 步：实现 UI 音效
第 4 步：实现 BGMController 和场景音乐切换
第 5 步：实现 AmbienceController
第 6 步：实现角色脚步声和地面材质检测
第 7 步：接入普攻挥空 / 命中音
第 8 步：接入技能音效
第 9 步：接入敌人和 Boss 音效
第 10 步：实现 VoiceController
第 11 步：实现音频配置表
第 12 步：实现音频配置工具
第 13 步：做混音、限频、优先级和性能优化
```

---

## 31. 总结

这套音频系统的核心原则：

```text
动作音效跟动画帧走
命中音效跟伤害事件走
脚步音效跟地面材质走
技能音效按阶段拆分
BGM 按场景和战斗状态切换
语音按角色、情绪、优先级播放
UI 音效统一 2D 播放
所有高频音效必须限频和池化
```

最终效果：

```text
玩家每一次移动、攻击、受击、释放技能、完成任务、打开界面、进入新场景，都能听到明确、稳定、不会混乱的反馈。
```
