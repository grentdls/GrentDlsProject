# 287 基础攻击数据结构、编辑器、UI、HUD 与开发验收

## 1. BasicAttackDefinition

```json
{
  "skillId": "GBA_SWORD_FLOW_01",
  "displayName": "流光剑式",
  "slotType": "GroundBasicAttack",
  "allowedWeaponTags": ["Sword_OneHand"],
  "comboResetDelay": 0.8,
  "loopAfterLast": true,
  "steps": [
    {
      "index": 1,
      "animationId": "ANIM_SWORD_GROUND_01",
      "damageMultiplier": 0.7,
      "inputAcceptStart": 0.25,
      "inputAcceptEnd": 0.52,
      "canBranchToRising": true,
      "risingWindowStart": 0.30,
      "risingWindowEnd": 0.50
    }
  ]
}
```

## 2. WeaponBasicAttackSet

```json
{
  "weaponTag": "Sword_OneHand",
  "defaultGroundBasicAttackId": "GBA_SWORD_FLOW_01",
  "defaultAirBasicAttackId": "ABA_SWORD_SWALLOW_01",
  "defaultRisingAttackId": "RIA_SWORD_LAUNCHER_01"
}
```

## 3. 运行时状态

```text
CurrentGroundComboIndex
CurrentAirComboIndex
LastComboTime
BufferedBasicAttack
BufferedRisingAttack
CurrentBasicAttackSlot
CurrentWeaponAttackSet
```

## 4. 状态流程

```text
Idle
→ GroundBasicAttack
→ GroundComboTransition
→ RisingAttack
→ AirBasicAttack
→ AirComboTransition
→ Landing
→ GroundBasicAttack/Idle
```

## 5. 动画与碰撞配置

每个 ComboStep 配置：

```text
AnimationId
DamageMultiplier
HitboxProfile
RootMotionProfile
HitStopProfile
PoiseDamage
InputWindow
CancelWindow
RisingBranchWindow
NextStepIndex
```

核心攻击窗口建议由数据时间轴驱动，动画事件用于校正特效、音效和武器拖尾。

## 6. 编辑器工具

新增：

```text
Tools / Game / Basic Attack Editor
```

功能：

```text
选择武器类型
编辑地面连段
编辑空中连段
编辑上跃技能
预览动画
预览伤害盒
预览根运动
预览输入窗口
预览取消窗口
预览上跃派生窗口
帧步进测试
```

时间轴颜色：

```text
红色：伤害生效
绿色：下一段输入
蓝色：闪避/防御取消
黄色：上跃派生
紫色：主动技能取消
```

## 7. 技能页面 UI

新增独立区域：

```text
基础攻击配置
├── 地面普攻槽
├── 空中普攻槽
└── 上跃技能槽
```

显示：

```text
技能图标
技能名称
当前武器兼容状态
默认/自定义标记
连段数
总倍率
上跃派生段
浮空/破韧信息
```

切换武器时，只显示当前武器兼容技能；不兼容配置保留在武器预设中，不直接删除。

## 8. HUD

普攻默认鼠标左键，可采用轻量显示：

```text
当前基础攻击图标
鼠标左键标识
地面/空中状态小图标
当前连段段数圆点
上跃派生窗口跳跃键高亮
```

连段示例：

```text
● ○ ○ ○
```

技能正在空中自动切换时，图标可做短暂淡入替换，不需要增加额外按键槽。

## 9. 输入系统接入

```text
BasicAttackInputRouter
├── 读取 BasicAttack InputAction
├── 查询 GroundedState
├── 查询当前武器技能组
├── 查询动作锁定状态
├── 写入 ComboInputBuffer
└── 调用对应技能实例
```

跳跃输入：

```text
如果正在地面普攻且上跃窗口开启
→ RisingAttack
否则
→ NormalJump
```

## 10. 技能、装备与天赋接入

基础攻击仍保留技能标签：

```text
BasicAttack
GroundBasicAttack
AirBasicAttack
RisingAttack
Melee/Projectile
WeaponTag
Hit
Combo
```

因此可以受到：

```text
基础攻击伤害
地面普攻终段伤害
空中伤害
上跃破韧
普攻攻速
连段窗口
命中回复
武器类型词条
```

影响。

## 11. 测试场景

建立：

```text
Scene_BasicAttack_Test
```

包含：

```text
全部武器架
普通木桩
浮空木桩
Boss 韧性木桩
高低平台
落地测试区
攻击窗口可视化
伤害盒显示
帧步进面板
```

测试功能：

```text
切换武器
切换三类基础技能
显示 ComboIndex
显示输入缓存
强制地面/空中
强制落地
时间缩放
显示根运动轨迹
```

## 12. 第一版开发顺序

```text
三个特殊技能槽
→ 左键地面/空中自动路由
→ 地面四段连击
→ 输入缓存和超时重置
→ 最后段循环第一段
→ 空中独立连段
→ 落地切回地面
→ 地面普攻中跳跃派生
→ 武器默认技能组
→ 技能页面更换
→ 编辑器预览
```

## 13. 验收标准

```text
左键在地面释放地面普攻。
左键在空中释放空中普攻。
地面与空中使用不同技能槽。
每个武器都有默认三件基础攻击技能。
地面普攻支持多段连击。
连接超时后回到第一段。
最后一段可连接回第一段。
地面普攻中按跳跃可释放上跃技能。
上跃结束后进入空中普攻状态。
落地后立即切回地面普攻。
不兼容武器技能不能装配。
更换武器后自动解析默认技能组。
输入缓存最多保留一次。
技能页面可以更换三类技能。
```
