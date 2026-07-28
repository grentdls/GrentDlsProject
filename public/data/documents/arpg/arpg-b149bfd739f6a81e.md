# 278 基础攻击系统总览：地面普攻、空中普攻与上跃技能

## 1. 改造目标

新增三个特殊技能槽：

```text
GroundBasicAttackSlot   地面基础攻击槽
AirBasicAttackSlot      空中基础攻击槽
RisingAttackSlot        上跃技能槽
```

默认输入：

```text
鼠标左键：基础攻击
跳跃键：普通跳跃；地面普攻派生窗口中改为上跃技能
```

## 2. 同键自动切换

```text
按下鼠标左键
→ 判断 IsGrounded
→ 地面：执行 GroundBasicAttackSlot
→ 空中：执行 AirBasicAttackSlot
```

角色落地后立即切回地面普攻；离地后立即切换为空中普攻。

## 3. 三类技能职责

### 地面普攻

```text
武器基础输出
连段积累
资源恢复
击中/暴击/吸血触发
上跃派生入口
```

### 空中普攻

```text
浮空追击
空中连段
滞空和空中位移
击落或下砸收尾
```

### 上跃技能

```text
地面普攻中按跳跃触发
取消当前段部分后摇
攻击并使角色升空
对普通敌人施加浮空
结束后进入空中普攻状态
```

## 4. 武器默认技能组

每种武器提供：

```text
DefaultGroundBasicAttack
DefaultAirBasicAttack
DefaultRisingAttack
```

玩家可更换，但必须满足武器和槽位限制。

## 5. 连段规则

```text
每次从第一段开始
连接时间内再次按左键进入下一段
超过时间则重置第一段
最后一段后再次连接可回到第一段
地面与空中分别记录连段段数
```

## 6. 系统结构

```text
BasicAttackSystem
├── BasicAttackInputRouter
├── BasicAttackSlotController
├── GroundComboController
├── AirComboController
├── RisingAttackController
├── WeaponAttackSetResolver
├── ComboInputBuffer
└── ComboTransitionEvaluator
```

## 7. 文档目录

```text
278_基础攻击系统总览_地面普攻_空中普攻_上跃技能.md
279_基础攻击输入与状态切换规则_同键切换_缓存_取消.md
280_地面普攻连段系统_段数_连接窗口_派生_重置.md
281_空中普攻连段系统_滞空_浮空_落地_下砸.md
282_上跃技能系统_普攻中跳跃派生_武器限制_可替换.md
283_基础攻击槽位与武器限制规则_默认技能组_兼容.md
284_地面基础攻击技能库_各武器四十八套连段.md
285_空中基础攻击技能库_各武器三十六套连段.md
286_上跃技能库_各武器三十六个上跃技能.md
287_基础攻击数据结构_编辑器_UI_HUD_开发验收.md
```
