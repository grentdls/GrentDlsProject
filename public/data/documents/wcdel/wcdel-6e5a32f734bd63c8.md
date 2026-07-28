# Player Hit Death Skill Input Sync

## 目标

继续将《角色基础操作系统设计文档》的核心项落到当前原型工程中，重点补齐：

- 技能槽输入语义
- 玩家受击状态
- 玩家死亡状态
- 玩家复活入口
- 输入资产命名与绑定同步

## 本次范围

### 输入层

- 将 `InputSystem_Actions` 调整为 ARPG 语义动作
- 保留 `Move / Look / Attack / Interact / Dodge / Pause`
- 新增 `Skill1 / Skill2 / Skill3 / Skill4 / Menu`

### 玩家状态层

- 受击进入 `Hit`
- 死亡进入 `Dead`
- 提供 `Revive` 入口
- 技能输入进入占位施法流程

### 原型 HUD

- 显示当前玩家状态
- 显示技能槽输入占位状态

## 本次不做

- 正式技能效果
- 正式菜单 UI
- 复活点与回城逻辑
- 低血特效和伤害数字

## 下一步建议

1. 接第一个火环技能
2. 接死亡后复活点与场景回归
3. 接自动拾取系统
4. 接动画状态机与事件帧
