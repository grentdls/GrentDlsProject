# 手机端战斗界面 HUD 与按键布局文档

> 项目类型：Unity 3D 逻辑 + 2D 序列帧角色表现 + DNF 式横版清版动作  
> 当前模块：手机端战斗界面、移动摇杆、普攻 / 闪避 / 跳跃、8 技能按钮、6 道具按钮、角色头顶血条 / 能量条 / Buff  
> 目标：重构手机端战斗 HUD，让玩家在横版清版战斗中可以稳定移动、跳跃、闪避、普攻、释放技能和使用道具，同时不在屏幕顶部或底部额外堆叠角色状态栏。

---

## 1. 设计目标

手机端战斗界面只保留必要战斗操作，不做额外复杂 HUD。

### 1.1 当前落地规则

当前战斗 HUD 先兼容两套运行时布局：

```text
布局：默认
- 保持现有底部技能栏结构，适合 PC 调试和旧 UI 兼容。
- 快捷道具栏保持底部横向 1~6。

布局：扇形
- 左上角提供“布局：默认 / 布局：扇形”切换按钮。
- 普攻、闪避、跳跃、交互、技能 1~4、绝技临时挂到全屏 MobileActionLayoutRoot。
- 按钮按右下角拇指操作区排成扇形。
- 快捷道具 1~6 移到更外圈，靠近文档中的道具外圈规则。
```

说明：

```text
当前运行时技能系统仍是 4 个普通技能 + 1 个绝技。
文档目标布局中的 8 技能按钮先保留规则，后续技能槽扩展到 8 个时继续沿用右下扇形坐标扩展。
布局切换按总容器语义执行：默认布局启用 `BottomCenter/CombatCluster` 与 `BottomLeft/BasicControls`，关闭 `MobileActionLayoutRoot`；扇形布局先把可点击按钮迁移到 `MobileActionLayoutRoot`，再关闭默认 PC 操作总组，避免旧技能栏/基础操作背景残留。
生成态战斗 HUD 预制体必须自带默认关闭的 `MobileActionLayoutRoot`。后续若拆成独立 PC / Mobile 两套按钮预制体，也应保持“切换总预制体根节点”，不要只隐藏/移动单个按钮。
布局切换优先调整运行时 RectTransform 和总容器显隐，不直接手工修改 Scene YAML，避免一键生成 UI 覆盖手调布局。
```

核心布局：

```text
左下：移动摇杆
右下：普攻、闪避、跳跃
右侧外圈：8 个技能按钮
最外圈：6 个道具栏按钮
角色头上：Buff 列表、血条、能量条
```

界面目标：

```text
1. 普攻按钮最大，永远最容易点到。
2. 闪避和跳跃靠近普攻，形成核心操作三角。
3. 8 个技能围绕核心按钮分布，方便拇指滑动释放。
4. 6 个道具按钮再外圈，避免误触但仍能快速使用。
5. 血条、能量条、Buff 只显示在角色上方，不在屏幕边缘重复显示。
6. 整个 UI 不遮挡角色脚下判定、怪物红圈、Boss 技能预警。
7. 所有按钮必须支持多点触控。
8. 技能 CD、能量不足、道具数量不足必须一眼看清楚。
```

---

## 2. 屏幕布局总览

以 1920×1080 横屏为基准设计。

```text
┌──────────────────────────────────────────────┐
│                                              │
│                 游戏战斗画面                  │
│                                              │
│          Buff                                │
│          HP / Energy                         │
│             角色                              │
│                                              │
│                                              │
│                                              │
│  左下移动摇杆                         道具外圈 │
│                                 技能外圈       │
│                              闪避  跳跃        │
│                          普攻按钮             │
└──────────────────────────────────────────────┘
```

实际 UI 分区：

```text
LeftControlArea       左侧移动区
RightActionArea       右侧战斗按钮区
CharacterOverheadHUD  角色头顶 HUD
SystemHintLayer       战斗提示层，可选
```

---

## 3. Canvas 总结构

### 3.1 Unity Canvas 结构

```text
Canvas_BattleHUD
├── SafeAreaRoot
│   ├── LeftControlArea
│   │   └── JoystickRoot
│   │       ├── Image_JoystickBase
│   │       ├── Image_JoystickRange
│   │       └── Image_JoystickHandle
│   │
│   ├── RightActionArea
│   │   ├── CoreButtonRoot
│   │   │   ├── Button_NormalAttack
│   │   │   ├── Button_Dodge
│   │   │   └── Button_Jump
│   │   │
│   │   ├── SkillRingRoot
│   │   │   ├── SkillButton_01
│   │   │   ├── SkillButton_02
│   │   │   ├── SkillButton_03
│   │   │   ├── SkillButton_04
│   │   │   ├── SkillButton_05
│   │   │   ├── SkillButton_06
│   │   │   ├── SkillButton_07
│   │   │   └── SkillButton_08
│   │   │
│   │   └── ItemRingRoot
│   │       ├── ItemButton_01
│   │       ├── ItemButton_02
│   │       ├── ItemButton_03
│   │       ├── ItemButton_04
│   │       ├── ItemButton_05
│   │       └── ItemButton_06
│   │
│   └── CombatHintLayer
│       ├── Text_ErrorHint
│       ├── Text_SkillNamePopup
│       └── TouchDebugOverlay，开发期可选
│
Canvas_WorldHUD
├── PlayerOverheadHUD
│   ├── BuffRow
│   ├── HPBar
│   ├── EnergyBar
│   └── StateIconRow
│
├── EnemyOverheadHUDPool
└── BossOverheadHUDPool
```

### 3.2 Canvas 分层

| Canvas | 用途 | Render Mode |
|---|---|---|
| Canvas_BattleHUD | 手机端操作按钮 | Screen Space - Overlay |
| Canvas_WorldHUD | 角色头顶血条 / Buff | World Space 或 Screen Space 跟随世界点 |
| Canvas_Popup | 跳字 / 提示 | Screen Space - Overlay |

推荐：

```text
操作按钮用 Screen Space - Overlay
头顶 HUD 可以用 World Space，也可以用 Screen Space + 世界点转屏幕坐标
```

---

## 4. 屏幕安全区规则

### 4.1 SafeArea

所有 UI 必须放在 SafeArea 内。

适配：

```text
16:9
18:9
19.5:9
20:9
刘海屏
圆角屏
平板横屏
```

### 4.2 最小边距

| 区域 | 边距 |
|---|---:|
| 左摇杆距离左边 | 80 px |
| 左摇杆距离底边 | 80 px |
| 右侧按钮区距离右边 | 70 px |
| 右侧按钮区距离底边 | 70 px |
| 道具外圈距离屏幕边缘 | 至少 24 px |
| 头顶 HUD 与角色头顶 | 25~45 px |

### 4.3 缩放规则

基准分辨率：

```text
1920 x 1080
```

缩放：

```text
UIRootScale = min(ScreenWidth / 1920, ScreenHeight / 1080)
```

限制：

```text
最小缩放：0.82
最大缩放：1.18
```

---

## 5. 左侧移动摇杆

### 5.1 位置

```text
Anchor：Left Bottom
Pivot：Center
Position：X = 210，Y = 190，以 1920x1080 为基准
```

### 5.2 尺寸

| 节点 | 尺寸 |
|---|---:|
| 摇杆可触控区 | 300 x 300 px |
| 摇杆底盘 | 210 x 210 px |
| 摇杆外圈 | 260 x 260 px |
| 摇杆手柄 | 92 x 92 px |

### 5.3 摇杆状态

| 状态 | 表现 |
|---|---|
| 未触摸 | 透明度 65%，手柄居中 |
| 触摸中 | 透明度 100%，手柄跟随 |
| 超出范围 | 手柄限制在外圈内 |
| 禁止移动 | 整体灰色，手柄回中 |

### 5.4 输入输出

摇杆输出：

```text
InputX：-1 ~ 1，对应 Unity X 轴
InputZ：-1 ~ 1，对应 Unity Z 轴
```

对应规则：

```text
手指向右：X 正方向
手指向左：X 负方向
手指向上：Z 正方向
手指向下：Z 负方向
```

### 5.5 死区

```text
DeadZone = 0.15
FullInputRadius = 0.85
```

规则：

```text
输入长度 < 0.15：视为 0
输入长度 >= 0.85：视为满输入
中间线性插值
```

---

## 6. 右侧战斗按钮总布局

右下角战斗区分三层：

```text
核心层：普攻、闪避、跳跃
技能层：8 个技能按钮
道具层：6 个道具按钮
```

### 6.1 右侧战斗区根节点

```text
RightActionArea
Anchor：Right Bottom
Pivot：Center
CenterPosition：X = -245，Y = 235，以 1920x1080 为基准
```

这里的 CenterPosition 是普攻按钮中心。

### 6.2 按钮分层半径

| 层级 | 半径 | 说明 |
|---|---:|---|
| Core | 0~145 px | 普攻、闪避、跳跃 |
| SkillRing | 180~285 px | 8 技能按钮 |
| ItemRing | 310~405 px | 6 道具按钮 |

注意：

```text
技能按钮和道具按钮不要完整围成一圈，否则上方按钮会太远。
只使用右下角扇形区域，大致 90°~210° 的弧形范围。
```

---

## 7. 核心按钮布局

### 7.1 普攻按钮

普攻按钮最大，放在右下角核心。

```text
Button_NormalAttack
Anchor：Right Bottom
Position：以 RightActionArea 为中心 (0, 0)
Size：128 x 128 px
```

结构：

```text
Button_NormalAttack
├── Image_Frame
├── Image_Icon_Attack
├── Image_PressGlow
├── Image_HoldRing，可选
└── Text_Label，可选，默认不显示文字
```

表现：

```text
普通状态：明亮
按下：缩放 0.92，出现按压光
连击窗口：边框短暂闪光
不可攻击：按钮变灰
```

### 7.2 闪避按钮

闪避按钮放在普攻左上方，方便右拇指快速点。

```text
Button_Dodge
Position：相对普攻 (-112, 92)
Size：92 x 92 px
```

显示：

```text
图标：翻滚 / 闪避箭头
CD 遮罩
冷却数字
```

状态：

```text
可用：正常
冷却：灰色 + CD 遮罩
体力不足：红色闪一下
禁用：灰色
```

### 7.3 跳跃按钮

跳跃按钮放在普攻上方或右上方，避免和闪避混淆。

推荐：

```text
Button_Jump
Position：相对普攻 (0, 128)
Size：92 x 92 px
```

如果屏幕宽度较小，可以改成：

```text
Position：相对普攻 (96, 88)
```

显示：

```text
图标：跳跃箭头 / 脚印
```

状态：

```text
地面：可点击
空中：灰色或显示二段跳状态，如果有
落地硬直：短暂禁用
```

---

## 8. 8 个技能按钮布局

### 8.1 技能按钮整体规则

8 个技能按钮围绕核心按钮外侧，形成右下角扇形。

```text
SkillButton Count = 8
Button Size = 78 x 78 px
Ring Radius = 215~260 px
```

技能按钮不做太大，否则挤压道具栏。

### 8.2 推荐位置

以普攻按钮为圆心，使用局部坐标。

| 技能槽 | 坐标 | 说明 |
|---|---|---|
| Skill_01 | (-210, 10) | 左侧最近技能 |
| Skill_02 | (-200, 95) | 左上 |
| Skill_03 | (-160, 175) | 上左 |
| Skill_04 | (-80, 230) | 上方 |
| Skill_05 | (10, 245) | 上方偏右 |
| Skill_06 | (92, 215) | 右上 |
| Skill_07 | (150, 150) | 右上外侧 |
| Skill_08 | (178, 68) | 右侧外侧 |

示意：

```text
          S05   S06
      S04           S07
   S03                S08
      S02
   S01        Jump
        Dodge   Attack
```

这样布局的优势：

```text
1. 技能不压住普攻。
2. 技能按钮集中在右下角上半弧，拇指能扫到。
3. S01~S03 更适合高频技能。
4. S06~S08 更适合低频技能或长 CD 技能。
```

### 8.3 技能按钮结构

```text
SkillButton
├── ButtonRoot
├── Image_Frame_RarityOrSkillType
├── Image_Background
├── Image_Icon
├── Image_CooldownMask
├── Text_CooldownNumber
├── Image_ResourceNotEnoughOverlay
├── Image_Lock
├── Image_SelectedGlow
├── Image_PressEffect
├── Image_ReadyFlash
├── Image_KeyHintBg
├── Text_KeyHint
├── CostRoot
│   ├── Image_CostIcon
│   └── Text_CostValue
└── StackRoot，可选
    └── Text_StackCount
```

### 8.4 技能按钮必须显示的信息

每个技能按钮显示：

```text
技能图标
技能框体
CD 遮罩
CD 数字
消耗图标 / 消耗值
左下角快捷键图标，手机端可显示槽位编号 S1~S8
资源不足遮罩
锁定状态
```

### 8.5 技能按钮左下角快捷键图标

虽然是手机端，但仍建议左下角显示槽位提示：

```text
S1
S2
S3
...
S8
```

作用：

```text
和后台技能配置面板对应
玩家知道这是第几个技能槽
方便手柄 / PC 复用
方便教程描述
```

位置：

```text
KeyHintBg：按钮左下角
Size：26 x 26 px
Text：S1~S8
```

### 8.6 技能 CD 表现

CD 中：

```text
Image_CooldownMask 使用径向填充
Text_CooldownNumber 显示剩余秒数
大于 10 秒显示整数
小于 10 秒显示 1 位小数，可选
小于 1 秒显示 0.9、0.8 或直接隐藏
```

CD 完成：

```text
按钮闪一下
ReadyFlash 从中心扩散
播放轻提示音，可选
```

### 8.7 资源不足表现

资源不足时：

```text
按钮整体降低亮度
CostValue 变红
点击时按钮抖动
屏幕中下方提示：能量不足 / 法力不足
```

### 8.8 技能锁定 / 未装配

未装配：

```text
显示空槽框
中间是 + 或暗色技能位图标
不可释放
```

未解锁：

```text
显示锁图标
图标灰色
```

---

## 9. 6 个道具栏按钮布局

### 9.1 道具按钮定位

道具按钮放在最外圈，使用频率低于技能，但战斗中仍可快速点。

```text
ItemButton Count = 6
Button Size = 64 x 64 px
Ring Radius = 335~390 px
```

### 9.2 推荐位置

| 道具槽 | 坐标 | 说明 |
|---|---|---|
| Item_01 | (-330, 40) | 左外侧，常用药水 |
| Item_02 | (-315, 125) | 左上外侧 |
| Item_03 | (-270, 205) | 上外侧 |
| Item_04 | (-190, 285) | 上方外侧 |
| Item_05 | (-90, 330) | 上方偏右 |
| Item_06 | (25, 345) | 右上最外侧 |

示意：

```text
        I05   I06
    I04
 I03       S05 S06
 I02    S04     S07
 I01 S03          S08
      S02
   S01       Jump
       Dodge Attack
```

### 9.3 道具按钮结构

```text
ItemButton
├── ButtonRoot
├── Image_Frame
├── Image_Background
├── Image_Icon
├── Text_Count
├── Image_CooldownMask
├── Text_CooldownNumber
├── Image_DisabledOverlay
├── Image_Lock
├── Image_PressEffect
├── Image_KeyHintBg
└── Text_KeyHint，I1~I6
```

### 9.4 道具显示规则

每个道具按钮必须显示：

```text
道具图标
剩余数量
CD 遮罩
CD 数字
禁用状态
```

数量规则：

```text
0 个：按钮灰色，数量显示 0
1~99：显示具体数字
超过 99：显示 99+
```

### 9.5 道具使用限制

道具可能限制：

```text
战斗中可用 / 不可用
地面可用 / 空中不可用
生命满时不可用
能量满时不可用
冷却中不可用
被控制时不可用
```

点击不可用时：

```text
按钮抖动
显示短提示
```

示例：

```text
生命已满
冷却中
被控制时无法使用
数量不足
```

---

## 10. 角色头顶 HUD

### 10.1 设计原则

角色状态只显示在角色头上，不在屏幕上方额外显示血条、能量条。

显示内容：

```text
Buff 列表
血条 HP
能量条 Energy
状态图标，可选
```

位置顺序：

```text
BuffRow
HPBar
EnergyBar
角色本体
```

示意：

```text
[Buff][Buff][Debuff]
████████  HP
████      Energy
    角色
```

### 10.2 玩家头顶 HUD 结构

```text
PlayerOverheadHUD
├── FollowWorldTarget
├── BuffRow
│   ├── BuffIcon_01
│   ├── BuffIcon_02
│   ├── BuffIcon_03
│   ├── BuffIcon_04
│   └── BuffMore
│
├── HPBarRoot
│   ├── Image_HP_Background
│   ├── Image_HP_Delay
│   ├── Image_HP_Current
│   ├── Image_HP_Flash
│   └── Image_HP_Frame
│
├── EnergyBarRoot
│   ├── Image_Energy_Background
│   ├── Image_Energy_Current
│   ├── Image_Energy_Flash
│   └── Image_Energy_Frame
│
└── StateIconRow
    ├── Icon_LowHP，可选
    ├── Icon_Controlled，可选
    └── Icon_SuperArmor，可选
```

### 10.3 玩家头顶 HUD 尺寸

| 控件 | 尺寸 |
|---|---:|
| Buff 图标 | 24 x 24 px |
| Buff 行最大宽度 | 180 px |
| HP 条 | 150 x 14 px |
| Energy 条 | 150 x 8 px |
| 血条间距 | 3 px |
| HUD 离角色头顶 | 28~45 px |

### 10.4 HP 条表现

HP 条分层：

```text
当前血量层
延迟扣血层
受击闪光层
边框层
```

受击时：

```text
当前血量立即减少
延迟层 0.2s 后跟随
血条闪白或闪红
暴击受击时血条震动
```

### 10.5 Energy 条表现

Energy 可能对应：

```text
法力
怒气
体力
技能能量
```

表现：

```text
技能消耗时立即减少
恢复时平滑增长
能量满时边框轻微发光
绝技能量满时可在角色头顶显示小光点，但不能太挡视野
```

### 10.6 Buff 列表

Buff 在血条上方。

规则：

```text
最多显示 4 个
超过显示 +N
正面 Buff 蓝绿边框
负面 Debuff 红紫边框
带持续时间环
带层数数字
```

优先级：

```text
控制类 > 低血危险类 > 破甲 / 易伤 > 中毒 / 灼烧 / 流血 > 增益类 > 普通状态
```

---

## 11. 敌方单位头顶 HUD

虽然用户状态不需要额外屏幕血条，但敌人也需要头顶 HUD。

### 11.1 普通敌人

```text
HPBar
BuffRow，可选
```

普通小怪可不显示能量条。

### 11.2 精英敌人

```text
名称 / 精英标记
HPBar
BreakBar，可选
BuffRow
```

### 11.3 Boss

如果严格不加额外血条，可以只用 Boss 头顶 HUD。  
但 Boss 体型大时，建议：

```text
Boss 头顶显示血条和 Buff
屏幕顶部 Boss 大血条作为可选开关
```

当前需求默认：

```text
不显示额外屏幕 Boss 血条
只显示 Boss 头顶 HUD
```

如果之后感觉 Boss 血量不清楚，再加 Boss 专用开关。

---

## 12. 触控输入规则

### 12.1 多点触控

必须支持：

```text
左手持续拖动摇杆
右手同时按普攻
右手同时按技能
右手同时按跳跃 / 闪避
```

规则：

```text
摇杆指针 ID 固定给 LeftControlArea
右侧按钮指针 ID 分别处理
不同按钮不能互相抢触摸
```

### 12.2 普攻连点

普攻按钮支持：

```text
单击：普攻
连续点击：三段连击
按住：可选自动普攻，不建议默认开启
```

建议：

```text
默认连续点击连击
设置中可开启长按自动普攻
```

### 12.3 技能按下规则

技能按钮默认：

```text
点击立即释放
```

如果技能需要指向：

```text
按住技能按钮 → 显示方向 / 范围指示
拖动调整方向 → 松手释放
拖回按钮中心或滑到取消区 → 取消释放
```

### 12.4 道具按下规则

道具按钮：

```text
点击立即使用
长按显示道具说明，可选
```

道具不建议做拖动瞄准。

### 12.5 闪避方向

闪避方向来自当前摇杆输入：

```text
摇杆有输入：按摇杆方向闪避，对应 X/Z 平面
摇杆无输入：按角色当前 Facing 的 X 方向闪避
```

### 12.6 跳跃方向

跳跃时：

```text
Y 轴起跳
X/Z 方向保持当前移动输入
空中可以少量调整 X/Z
```

---

## 13. 按钮状态规则

### 13.1 通用按钮状态

所有战斗按钮都有以下状态：

```text
Normal
Pressed
Cooldown
Disabled
ResourceNotEnough
Locked
Ready
Highlighted
```

### 13.2 状态表现

| 状态 | 表现 |
|---|---|
| Normal | 正常亮度 |
| Pressed | 缩放 0.92，按压光 |
| Cooldown | 灰色径向遮罩 + 数字 |
| Disabled | 透明度 45%，不可点 |
| ResourceNotEnough | 红色闪烁一次 |
| Locked | 锁图标覆盖 |
| Ready | 边框轻闪 |
| Highlighted | 新手引导高亮 |

### 13.3 点击失败反馈

失败原因必须提示：

```text
技能冷却中
能量不足
道具数量不足
空中无法使用
被控制时无法使用
当前状态无法释放
```

提示位置：

```text
右侧按钮区上方，或角色头顶附近
持续 0.8~1.2s
```

---

## 14. 战斗界面不显示的内容

根据当前需求，以下内容不在战斗 HUD 固定显示：

```text
屏幕左上角玩家头像
屏幕上方玩家血条
屏幕左下角玩家状态栏
屏幕右上角大型资源栏
额外 MP / HP 数字面板
额外 Buff 面板
```

这些信息只通过：

```text
角色头顶 HUD
技能按钮状态
道具按钮状态
跳字与提示
```

来反馈。

---

## 15. 技能按钮与后台技能配置联动

8 个技能槽对应后台技能配置槽：

```text
SkillSlot_01
SkillSlot_02
SkillSlot_03
SkillSlot_04
SkillSlot_05
SkillSlot_06
SkillSlot_07
SkillSlot_08
```

后台更换技能后：

```text
战斗 HUD 自动刷新技能图标
刷新消耗类型
刷新 CD
刷新是否锁定
刷新槽位编号
```

技能槽为空：

```text
显示空槽图标
不可点
```

技能未满足释放条件：

```text
显示锁或灰态
```

---

## 16. 道具栏与背包联动

6 个道具槽对应快捷道具栏：

```text
ItemSlot_01
ItemSlot_02
ItemSlot_03
ItemSlot_04
ItemSlot_05
ItemSlot_06
```

后台背包中配置快捷道具后：

```text
刷新图标
刷新数量
刷新使用条件
刷新 CD
```

如果道具用完：

```text
数量显示 0
按钮灰色
不自动移除图标
```

如果玩家从背包移除快捷栏道具：

```text
按钮变为空槽
```

---

## 17. Unity 预制体详细结构

### 17.1 BattleHUDMobile.prefab

```text
BattleHUDMobile
├── Canvas_BattleHUD
│   ├── SafeAreaRoot
│   │   ├── LeftControlArea
│   │   │   └── JoystickRoot
│   │   │       ├── Image_Base
│   │   │       ├── Image_Range
│   │   │       ├── Image_Handle
│   │   │       └── JoystickInputHandler
│   │   │
│   │   ├── RightActionArea
│   │   │   ├── CoreButtonRoot
│   │   │   │   ├── NormalAttackButton
│   │   │   │   ├── DodgeButton
│   │   │   │   └── JumpButton
│   │   │   │
│   │   │   ├── SkillRingRoot
│   │   │   │   ├── SkillButton_01
│   │   │   │   ├── SkillButton_02
│   │   │   │   ├── SkillButton_03
│   │   │   │   ├── SkillButton_04
│   │   │   │   ├── SkillButton_05
│   │   │   │   ├── SkillButton_06
│   │   │   │   ├── SkillButton_07
│   │   │   │   └── SkillButton_08
│   │   │   │
│   │   │   └── ItemRingRoot
│   │   │       ├── ItemButton_01
│   │   │       ├── ItemButton_02
│   │   │       ├── ItemButton_03
│   │   │       ├── ItemButton_04
│   │   │       ├── ItemButton_05
│   │   │       └── ItemButton_06
│   │   │
│   │   └── CombatHintLayer
│   │       ├── SkillFailHint
│   │       ├── ItemFailHint
│   │       └── TutorialHighlight
│   │
│   └── MobileBattleHUDController
│
└── EventSystem
```

### 17.2 SkillButton.prefab

```text
SkillButton
├── Button
├── RectTransform
├── CanvasGroup
├── Image_Frame
├── Image_BG
├── Image_Icon
├── Image_CooldownMask
├── TMP_Text_Cooldown
├── Image_CostIcon
├── TMP_Text_Cost
├── Image_ResourceNotEnough
├── Image_Lock
├── Image_ReadyFlash
├── Image_PressGlow
├── Image_KeyHintBg
├── TMP_Text_KeyHint
└── SkillButtonUI.cs
```

### 17.3 ItemButton.prefab

```text
ItemButton
├── Button
├── RectTransform
├── CanvasGroup
├── Image_Frame
├── Image_BG
├── Image_Icon
├── TMP_Text_Count
├── Image_CooldownMask
├── TMP_Text_Cooldown
├── Image_DisabledOverlay
├── Image_Lock
├── Image_PressGlow
├── Image_KeyHintBg
├── TMP_Text_KeyHint
└── ItemButtonUI.cs
```

### 17.4 PlayerOverheadHUD.prefab

```text
PlayerOverheadHUD
├── RectTransform / WorldSpaceRoot
├── BuffRow
│   ├── HorizontalLayoutGroup
│   ├── BuffIcon_01
│   ├── BuffIcon_02
│   ├── BuffIcon_03
│   ├── BuffIcon_04
│   └── BuffMoreText
│
├── HPBarRoot
│   ├── Image_BG
│   ├── Image_Delay
│   ├── Image_Current
│   ├── Image_Flash
│   └── Image_Frame
│
├── EnergyBarRoot
│   ├── Image_BG
│   ├── Image_Current
│   ├── Image_Flash
│   └── Image_Frame
│
└── PlayerOverheadHUD.cs
```

---

## 18. 控件组件要求

### 18.1 摇杆

```text
RectTransform
CanvasGroup
Image
PointerDown
PointerDrag
PointerUp
```

脚本：

```text
MobileJoystick.cs
```

输出：

```text
Vector2 JoystickInput
转换为 Vector3(input.x, 0, input.y)
```

### 18.2 技能按钮

```text
Button 或自定义 PointerHandler
Image
TMP_Text
CanvasGroup
Animator / Tween
```

脚本：

```text
MobileSkillButtonUI.cs
```

支持：

```text
Click
PointerDown
PointerUp
DragAim，可选
LongPressInfo，可选
```

### 18.3 道具按钮

脚本：

```text
MobileItemButtonUI.cs
```

支持：

```text
Click Use
Cooldown Refresh
Count Refresh
Disabled Reason
```

### 18.4 头顶 HUD

脚本：

```text
OverheadHUDController.cs
```

支持：

```text
Follow World Target
Update HP
Update Energy
Update Buffs
Damage Flash
LowHP Flash
```

---

## 19. 数据绑定结构

### 19.1 MobileHUDConfig

```text
MobileHUDConfig
├── JoystickConfig
├── CoreButtonConfig
├── SkillRingConfig
├── ItemRingConfig
├── OverheadHUDConfig
└── SafeAreaConfig
```

### 19.2 SkillSlotHUDData

```text
SkillSlotID
SkillID
Icon
CostType
CostValue
Cooldown
CooldownRemain
IsUnlocked
IsEquipped
IsResourceEnough
CanCast
FailReason
```

### 19.3 ItemSlotHUDData

```text
ItemSlotID
ItemID
Icon
Count
Cooldown
CooldownRemain
CanUse
FailReason
```

### 19.4 OverheadHUDData

```text
CurrentHP
MaxHP
CurrentEnergy
MaxEnergy
BuffList
DebuffList
IsLowHP
IsControlled
```

---

## 20. 移动端输入事件接口

```text
OnJoystickChanged(Vector2 input)
OnAttackPressed()
OnAttackReleased()
OnDodgePressed()
OnJumpPressed()
OnSkillPressed(int slotIndex)
OnSkillPointerDown(int slotIndex)
OnSkillPointerDrag(int slotIndex, Vector2 dragDir)
OnSkillPointerUp(int slotIndex)
OnItemPressed(int slotIndex)
```

角色控制器接收后转换为：

```text
MoveInput = new Vector3(input.x, 0, input.y)
AttackInput
JumpInput
DodgeInput
SkillInput
ItemInput
```

---

## 21. 新手引导高亮规则

新手引导时可以高亮：

```text
摇杆
普攻
闪避
跳跃
指定技能
指定道具
```

高亮方式：

```text
按钮外圈发光
其他 UI 暗化
显示手指点击动画
显示简短文案
```

示例：

```text
点击普攻攻击敌人
拖动左侧摇杆移动
红圈出现时点击闪避
点击跳跃躲开地面攻击
```

---

## 22. UI 美术规范

### 22.1 整体风格

```text
圆形按钮
清晰描边
半透明底板
轻手绘质感
图标大
文字少
高对比
```

### 22.2 按钮层级

| 按钮 | 视觉权重 |
|---|---:|
| 普攻 | 最大，最亮 |
| 闪避 / 跳跃 | 中等，清楚 |
| 技能 | 中等，带技能色 |
| 道具 | 稍小，偏功能性 |

### 22.3 颜色建议

```text
普攻：暖黄色 / 白金边
闪避：蓝白 / 青色
跳跃：绿色 / 青蓝
技能：根据元素色
道具：棕金 / 银灰
冷却：灰黑半透明
不可用：灰色 + 红色提示
```

---

## 23. 性能规则

### 23.1 UI 刷新频率

```text
技能 CD：每帧或每 0.05s 刷新
道具 CD：每 0.05s 刷新
HP / Energy：事件驱动 + 插值
Buff 时间环：每帧或每 0.1s
```

### 23.2 避免性能问题

```text
不要频繁 Instantiate 技能按钮
按钮预制体常驻
BuffIcon 使用对象池
头顶 HUD 使用对象池
CD 数字变化时再刷新文本
```

---

## 24. MVP 必做内容

第一版必须做：

```text
左下移动摇杆
右下普攻按钮
闪避按钮
跳跃按钮
8 个技能按钮
6 个道具按钮
技能 CD 遮罩
技能消耗显示
资源不足提示
道具数量显示
道具 CD 显示
玩家头顶 HP 条
玩家头顶 Energy 条
玩家头顶 Buff 列表
按钮按压反馈
多点触控
SafeArea 适配
```

可以后做：

```text
技能拖动瞄准
按钮自定义位置
按钮透明度设置
长按查看说明
技能轮盘扩展
道具自动补充
Boss 专用额外血条开关
```

---

## 25. 开发任务拆分

### 25.1 程序任务

```text
MHUD01 Mobile Battle HUD Canvas
MHUD02 SafeArea 适配
MHUD03 Mobile Joystick
MHUD04 普攻按钮输入
MHUD05 闪避按钮输入
MHUD06 跳跃按钮输入
MHUD07 8 技能按钮 UI
MHUD08 技能 CD / 消耗显示
MHUD09 6 道具按钮 UI
MHUD10 道具数量 / CD 显示
MHUD11 多点触控输入管理
MHUD12 Player Overhead HUD
MHUD13 BuffRow 显示
MHUD14 HP / Energy 事件刷新
MHUD15 按钮失败提示
MHUD16 后台技能栏 / 道具栏数据联动
```

### 25.2 美术任务

```text
A01 摇杆底盘
A02 摇杆手柄
A03 普攻按钮框
A04 闪避按钮框
A05 跳跃按钮框
A06 技能按钮框
A07 道具按钮框
A08 CD 遮罩
A09 资源不足遮罩
A10 锁定图标
A11 空槽图标
A12 HP 条
A13 Energy 条
A14 Buff 图标框
A15 按钮按压特效
A16 技能 ready 发光
```

### 25.3 策划任务

```text
D01 技能槽顺序定义
D02 道具槽顺序定义
D03 每个技能消耗类型
D04 每个技能 CD 显示规则
D05 道具使用条件
D06 战斗中禁止使用的道具列表
D07 Buff 优先级
D08 低血提示阈值
```

---

## 26. 验收标准

### 26.1 操作验收

```text
左手拖摇杆时，右手能同时普攻。
左手拖摇杆时，右手能同时闪避。
左手拖摇杆时，右手能同时跳跃。
左手拖摇杆时，右手能释放技能。
技能和道具按钮不会互相抢触控。
普攻按钮足够大，不会误点不到。
闪避和跳跃能在紧急情况下快速点到。
```

### 26.2 布局验收

```text
普攻在右下角核心位置。
闪避和跳跃在普攻附近。
8 个技能按钮在外圈横向 / 扇形排布。
6 个道具按钮在更外圈。
左侧摇杆不遮挡右侧按钮。
所有按钮在 SafeArea 内。
刘海屏和圆角屏不遮挡按钮。
```

### 26.3 状态验收

```text
技能 CD 能看清楚。
技能消耗能看清楚。
资源不足时能明确提示。
道具数量能看清楚。
道具为 0 时不可使用。
技能未装备时显示空槽。
技能未解锁时显示锁。
```

### 26.4 头顶 HUD 验收

```text
玩家血条只显示在角色上方。
玩家能量条只显示在角色上方。
Buff 列表显示在血条上方。
没有额外屏幕角落血条。
受击时血条扣血表现清楚。
Buff 增减时图标刷新正确。
角色移动时头顶 HUD 跟随稳定。
```

---

## 27. 设计总结

这版手机端战斗 HUD 的核心结构是：

```text
左手控制 X/Z 移动。
右手控制普攻、闪避、跳跃、技能、道具。
角色状态只看角色头顶 HUD。
```

右侧按钮优先级：

```text
普攻最大
闪避 / 跳跃最近
技能外圈
道具最外圈
```

最终目标：

```text
玩家不用看屏幕边缘的状态栏，只盯角色和敌人，就能完成移动、攻击、闪避、跳跃、技能、道具和状态判断。
```

## 运行时修正规则补充：头顶状态与圆形按钮

- 战斗 HUD 不再在左上角显示玩家 `PlayerCard`、HP、MP、Shield 或 Buff 状态；这些状态统一由角色头顶 HUD 显示。
- 旧覆盖体如果仍保留 `TopLeft/PlayerCard`，运行时必须强制隐藏，避免与角色头顶血条、蓝条、Buff 重复。
- 左上角只允许保留临时布局切换、任务/地图/系统入口类轻量按钮，不显示角色战斗资源。
- 手机端切换到扇形操作布局后，普攻、跳跃、闪避、交互、技能、绝技、快捷道具按钮必须使用圆形按钮语义。
- 圆形按钮结构要求：根按钮为圆形底盘，外层 `CircleFrame` 为圆形边框，图标放入 `CircleIconMask`，由圆形 `Mask` 裁切成圆形。
- 技能与绝技按钮的冷却遮罩在手机端使用圆形区域覆盖，避免矩形遮罩切到圆形按钮外部。
- 快捷道具 1-6 在手机端属于外圈道具按钮，同样使用圆形底盘、圆形边框、圆形图标裁切和右下角数量显示。
- PC 默认布局可以继续使用横向调试技能栏，但切换到手机端时必须关闭 PC 技能栏和基础操作背景，只启用 `MobileActionLayoutRoot`。

验收：

- 进入战斗后左上角不显示玩家血条、蓝条、护盾条和 Buff。
- 玩家、敌人、Boss 的血条、蓝条、护盾和 Buff 只跟随单位头顶显示，Boss 如需屏幕顶部总血条则走 Boss 专用规则。
- 切换手机端布局后右下角按钮全部为圆形视觉，图标被圆形遮罩裁切，外圈有圆形边框。
- 快捷道具外圈按钮不再是横向小矩形槽位。
## 修复补充：圆形按钮点击规则

- 圆形按钮根节点的 `Image` 必须保留 `raycastTarget = true`，并作为 `Button.targetGraphic`，否则普攻、技能、道具点击会失效。
- `CircleFrame`、`CircleIconMask`、图标、文字等子节点不能抢点击；它们可以关闭射线，点击统一落到按钮根节点。
- 手机端按钮圆形化只能改变视觉结构和裁切结构，不允许破坏原有 `Button.onClick` 绑定路径。
- 快捷道具按钮被圆形 Mask 重组后，刷新图标时必须优先查找 `CircleIconMask/Icon`，再回退旧路径 `Icon`。