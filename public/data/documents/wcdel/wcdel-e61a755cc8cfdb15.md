# 小地图、大地图与地图功能系统设计文档

> 项目类型：2D 横版清版动作 RPG / DNF 式战斗 + 妖兽大陆探索  
> 当前模块：战斗界面小地图、后台大地图、地图标记、任务指引、传送、区域发现、地图编辑配置  
> 目标：让玩家在战斗和探索中能快速判断方向、任务位置、传送点、区域边界和可探索内容，同时后台大地图提供完整导航、打标记、传送和区域完成度查看功能。

---

## 1. 地图系统总目标

地图系统分成两层：

```text
1. 战斗 HUD 小地图
   用于当前场景内快速定位、看任务方向、看附近敌人/传送点/出口。

2. 后台大地图界面
   用于查看完整区域、任务目标、区域完成度、打标记、传送、查看洞穴/城镇/入口信息。
```

玩家需要通过地图完成：

```text
知道自己在哪
知道任务目标在哪
知道出口在哪
知道传送点在哪
知道哪些区域没探索
知道哪些洞穴没打完
知道哪里有可接任务
知道自己打的标记在哪里
可以快速传送
```

---

## 2. 战斗界面小地图定位

### 2.1 小地图用途

小地图不是完整地图，它只负责当前战斗/探索视野内的快速信息：

```text
玩家当前位置
当前房间 / 当前区域轮廓
附近敌人
NPC / 交互物
任务目标方向
出口方向
传送点方向
玩家自定义标记方向
Boss / 精英怪位置
```

小地图应该简单、低遮挡，不要做成复杂策略地图。

---

## 3. 小地图 UI 布局

### 3.1 默认位置

推荐放在屏幕右上角。

```text
┌──────────────────────────────┐
│                    小地图     │
│                    ┌──────┐  │
│                    │      │  │
│                    │  ●   │  │
│                    └──────┘  │
└──────────────────────────────┘
```

如果右上角已有 Boss 状态或任务提示，可放到左上任务栏下方。  
但推荐最终布局：

```text
左上：任务追踪
右上：小地图
底部：技能栏
左下：移动摇杆，移动端
右下：普攻/跳跃/技能，移动端
```

### 3.2 小地图尺寸

| 平台 | 推荐尺寸 |
|---|---:|
| 手机横屏 | 160 x 160 px |
| 平板 | 190 x 190 px |
| PC | 180 x 180 px |
| 可放大模式 | 260 x 260 px |

### 3.3 小地图形状

推荐圆角方形：

```text
圆角矩形
边框清晰
内部轻微暗色半透明
重要图标亮色
```

可选圆形，但圆形不利于显示横版房间结构。  
本项目推荐：

```text
圆角方形小地图
```

---

## 4. 小地图预制体结构

```text
HUD_MinimapRoot
├── Minimap_Frame
│   ├── Image_Background
│   ├── Image_Border
│   ├── Mask_Viewport
│   │   └── Minimap_ContentRoot
│   │       ├── Map_TerrainLayer
│   │       ├── Map_RoomLayer
│   │       ├── Map_DiscoveredFogLayer
│   │       ├── IconLayer_Object
│   │       ├── IconLayer_Enemy
│   │       ├── IconLayer_Quest
│   │       ├── IconLayer_CustomMark
│   │       └── Icon_Player
│   ├── DirectionArrowLayer
│   │   ├── Arrow_Quest
│   │   ├── Arrow_Exit
│   │   └── Arrow_CustomMark
│   ├── Text_AreaName
│   └── Button_OpenBigMap
```

### 4.1 控件说明

| 节点 | 控件 | 说明 |
|---|---|---|
| Minimap_Frame | Image | 小地图底框 |
| Mask_Viewport | Mask / RectMask2D | 限制地图内容显示范围 |
| Minimap_ContentRoot | RectTransform | 地图内容根节点，可根据玩家位置移动 |
| Map_TerrainLayer | Image / RawImage | 简化地图底图 |
| Map_RoomLayer | Image | 房间、道路、边界 |
| IconLayer_Object | RectTransform | NPC、交互物、宝箱、传送点 |
| IconLayer_Enemy | RectTransform | 敌人图标 |
| IconLayer_Quest | RectTransform | 任务目标图标 |
| Icon_Player | Image | 玩家位置图标 |
| DirectionArrowLayer | RectTransform | 屏幕外目标方向箭头 |
| Button_OpenBigMap | Button | 点击打开后台大地图 |

---

## 5. 小地图显示规则

### 5.1 玩家图标

玩家图标始终显示在小地图中心或接近中心。

```text
玩家图标：小箭头 / 小头像 / 蓝色圆点
朝向：根据角色左右朝向和移动方向轻微旋转，可选
```

横版游戏不强制使用旋转箭头，也可以用：

```text
蓝色小人图标
左右朝向用小箭头表示
```

### 5.2 地图内容移动方式

推荐：

```text
玩家图标固定在中心
地图内容根据玩家位置反向移动
```

优点：

```text
玩家始终知道自己在小地图中心
任务方向箭头更稳定
```

### 5.3 地图比例

小地图比例建议：

```text
1 游戏单位 = 4~8 UI 像素
```

不同场景可配置：

```text
MinimapScale
```

---

## 6. 小地图图标规则

### 6.1 图标分类

| 类型 | 图标 | 颜色 | 显示条件 |
|---|---|---|---|
| 玩家 | 玩家箭头 | 蓝色 | 永远显示 |
| 普通敌人 | 小红点 | 红色 | 敌人在探测范围内 |
| 精英敌人 | 红色菱形 | 橙红 | 发现后显示 |
| Boss | 大红骷髅/爪印 | 深红 | Boss 区域内显示 |
| NPC | 对话气泡 | 白/蓝 | 城镇或安全区显示 |
| 可接任务 | 感叹号 | 金色 | 可接任务 NPC |
| 可交任务 | 问号 | 金色 | 可完成任务 NPC |
| 当前任务目标 | 星形/菱形 | 金色 | 当前追踪任务 |
| 宝箱 | 宝箱 | 金色 | 已发现未开启 |
| 已开宝箱 | 灰宝箱 | 灰色 | 可选显示 |
| 洞穴入口 | 洞穴门 | 紫色 | 发现后显示 |
| 传送点 | 传送旋涡 | 蓝色 | 已发现显示 |
| 商店 | 钱袋 | 黄色 | 城镇显示 |
| 铁匠铺 | 锤子 | 橙色 | 城镇显示 |
| 技能神殿 | 法阵 | 紫蓝 | 发现后显示 |
| 自定义标记 | 小旗 | 玩家选择色 | 玩家打标后显示 |
| 出口 | 门/箭头 | 白色 | 当前地图出口 |

### 6.2 图标显示距离

普通敌人：

```text
只显示小地图范围内敌人
```

任务目标：

```text
目标在小地图范围内：显示目标图标
目标在范围外：显示边缘方向箭头
```

传送点 / 出口：

```text
发现后可显示方向箭头
```

### 6.3 图标优先级

当多个图标重叠：

```text
当前任务目标 > 可交任务 > 可接任务 > Boss > 精英 > 传送点 > 洞穴 > NPC > 宝箱 > 普通敌人
```

重叠处理：

```text
高优先级盖住低优先级
低优先级图标轻微缩小或隐藏
```

---

## 7. 小地图任务指引

### 7.1 当前任务目标显示

小地图只显示当前追踪任务的核心目标。

不同任务类型图标不同：

| 任务目标类型 | 小地图图标 | 世界图标 | 箭头样式 |
|---|---|---|---|
| 击杀 | 红色爪印 | 敌人头顶爪印 | 红色箭头 |
| 交谈 | 金色对话气泡 | NPC 头顶问号/感叹号 | 金色箭头 |
| 探索 | 蓝色罗盘 | 区域光圈 | 蓝色箭头 |
| 购买 | 钱袋 | 商人图标 | 黄色箭头 |
| 收集 | 小包裹 | 物品闪光 | 绿色箭头 |
| 开宝箱 | 宝箱 | 宝箱光圈 | 金色箭头 |
| 启动机关 | 齿轮 | 机关发光 | 白色箭头 |
| 进入洞穴 | 洞穴门 | 洞穴入口标记 | 紫色箭头 |
| 学习技能 | 法阵 | 神殿标记 | 紫蓝箭头 |
| 传送 | 传送门 | 传送点光圈 | 蓝色箭头 |

### 7.2 屏幕外方向箭头

如果目标不在当前窗口内，需要屏幕边缘指引。

规则：

```text
目标在屏幕内：世界目标图标显示在目标上方
目标在屏幕外：屏幕边缘显示方向箭头
目标距离很远：箭头显示距离文字
```

示例：

```text
← 任务目标 120m
↑ 村长 35m
→ 蜂巢洞穴 80m
```

### 7.3 箭头位置

箭头贴着屏幕边缘显示，但不能压住核心 HUD。

```text
屏幕左/右边缘：显示水平箭头
屏幕上边缘：显示上方箭头
屏幕下边缘：尽量避开技能栏，放在技能栏上方
```

### 7.4 箭头动画

```text
轻微呼吸缩放
当前追踪任务箭头有金色脉冲
距离小于 20m 时箭头闪烁更明显
```

---

## 8. 后台大地图界面定位

### 8.1 大地图用途

后台大地图是完整地图管理界面，包含：

```text
查看全部已发现区域
查看当前玩家位置
查看任务目标
查看可接任务
查看洞穴和完成度
查看传送点
查看商店和功能 NPC
打自定义标记
删除标记
选择标记追踪
快速传送
查看区域等级和危险度
查看地图完成度
```

### 8.2 打开方式

```text
PC：M
手柄：菜单 → 地图
移动端：右上小地图点击 / 菜单 → 地图
后台菜单：地图页签
```

打开大地图时：

```text
单机模式暂停游戏
战斗中可打开但不能传送
Boss 战中可查看但不能传送和打新标记，可配置
剧情中不能打开
```

---

## 9. 大地图 UI 总布局

### 9.1 推荐布局

```text
┌──────────────────────────────────────────────┐
│ 顶部栏：地图 / 当前区域 / 完成度 / 关闭        │
├───────────────┬──────────────────────┬───────┤
│ 左侧筛选栏      │ 中间大地图区域          │ 右侧详情 │
│ - 全部          │ 可拖拽/缩放地图          │ 地点信息 │
│ - 任务          │ 玩家位置                │ 传送按钮 │
│ - 传送点        │ 任务目标                │ 追踪按钮 │
│ - 洞穴          │ 自定义标记              │ 删除标记 │
│ - 商店          │                        │         │
│ - 标记          │                        │         │
├───────────────┴──────────────────────┴───────┤
│ 底部操作栏：缩放 / 追踪 / 标记 / 传送 / 返回    │
└──────────────────────────────────────────────┘
```

### 9.2 大地图预制体结构

```text
Panel_WorldMap
├── TopBar
│   ├── Text_Title
│   ├── Text_CurrentRegion
│   ├── Text_CompletionRate
│   ├── Button_CenterPlayer
│   └── Button_Close
│
├── LeftFilterPanel
│   ├── Toggle_All
│   ├── Toggle_Quest
│   ├── Toggle_Portal
│   ├── Toggle_Dungeon
│   ├── Toggle_Shop
│   ├── Toggle_NPC
│   ├── Toggle_CustomMark
│   └── Toggle_Danger
│
├── MapViewport
│   ├── Mask_Map
│   │   └── MapContentRoot
│   │       ├── Layer_MapBase
│   │       ├── Layer_RegionColor
│   │       ├── Layer_Road
│   │       ├── Layer_FogOfWar
│   │       ├── Layer_RegionName
│   │       ├── Layer_Icons
│   │       ├── Layer_TaskTargets
│   │       ├── Layer_CustomMarks
│   │       └── Icon_Player
│   ├── DragHandler
│   └── ZoomHandler
│
├── RightDetailPanel
│   ├── Icon_Selected
│   ├── Text_SelectedName
│   ├── Text_SelectedType
│   ├── Text_RecommendLevel
│   ├── Text_Description
│   ├── Text_CompletionInfo
│   ├── RewardPreview
│   ├── Button_Track
│   ├── Button_Teleport
│   ├── Button_AddMark
│   ├── Button_RemoveMark
│   └── Button_CloseDetail
│
├── BottomOperationBar
│   ├── Button_ZoomIn
│   ├── Button_ZoomOut
│   ├── Button_ResetView
│   ├── Button_AddCustomMark
│   ├── Button_RemoveCustomMark
│   ├── Button_ShowLegend
│   └── Text_ControlHint
│
├── LegendPopup
├── CustomMarkPopup
├── TeleportConfirmPopup
└── ToastLayer
```

---

## 10. 大地图基础操作

### 10.1 拖拽地图

```text
鼠标左键拖拽地图
移动端单指拖动
手柄右摇杆移动地图视图
```

### 10.2 缩放地图

```text
鼠标滚轮缩放
移动端双指缩放
手柄 LT / RT 缩放
按钮 + / - 缩放
```

缩放范围：

```text
最小 0.6x
默认 1.0x
最大 2.5x
```

### 10.3 回到玩家位置

按钮：

```text
定位自己
```

效果：

```text
地图平滑移动到玩家当前位置
玩家图标闪烁 1 次
```

### 10.4 选中地点

点击图标后：

```text
右侧详情面板显示地点信息
地图图标高亮
如果可追踪，显示追踪按钮
如果可传送，显示传送按钮
```

---

## 11. 大地图图层规则

### 11.1 地图基础层

```text
大陆轮廓
区域底色
道路
河流
山脉/阻挡区域
城镇
洞穴
传送点
```

### 11.2 战争迷雾 / 探索层

地图区域状态：

| 状态 | 表现 |
|---|---|
| 未发现 | 黑雾覆盖，不显示具体图标 |
| 已发现未探索 | 半透明灰雾，显示大致轮廓 |
| 已探索 | 正常显示 |
| 已完成 | 区域名旁显示完成勾 |

### 11.3 区域颜色

| 区域状态 | 颜色 |
|---|---|
| 安全区 | 蓝绿 |
| 普通区域 | 草绿 / 地区色 |
| 高危区域 | 红橙边框 |
| 主线区域 | 金色边框 |
| Boss 区域 | 深红阴影 |
| 已完成区域 | 低饱和显示 |

---

## 12. 地图地点类型

### 12.1 地点分类

```text
Town 城镇
Village 村庄
Dungeon 洞穴
BossArea Boss区域
Portal 传送点
Shop 商店
Blacksmith 铁匠铺
SkillShrine 技能神殿
QuestNPC 任务 NPC
Treasure 宝箱
Resource 资源点
Gate 关卡门
StoryPoint 剧情点
CustomMark 玩家标记
```

### 12.2 地点状态

| 状态 | 说明 |
|---|---|
| Locked | 未解锁 |
| Undiscovered | 未发现 |
| Discovered | 已发现 |
| Active | 可用 |
| Completed | 已完成 |
| Disabled | 暂不可用 |
| Tracked | 正在追踪 |

---

## 13. 地点详情面板

### 13.1 城镇详情

显示：

```text
地点名称
地点类型：城镇
推荐等级
已发现 NPC
商店列表
可接任务数量
传送按钮
追踪按钮
```

### 13.2 洞穴详情

显示：

```text
洞穴名称
推荐等级
当前状态：未进入 / 已进入 / 已完成
宝箱完成度：1/3
Boss：有 / 无
任务关联：有 / 无
主要掉落预览
进入条件
追踪按钮
```

### 13.3 传送点详情

显示：

```text
传送点名称
所属区域
激活状态
是否可传送
传送按钮
```

### 13.4 任务目标详情

显示：

```text
任务名称
任务类型
当前目标
目标进度
目标距离
追踪按钮
```

### 13.5 自定义标记详情

显示：

```text
标记名称
标记类型
创建时间，可选
备注，可选
追踪按钮
删除按钮
```

---

## 14. 任务与地图联动规则

### 14.1 当前追踪任务

当玩家追踪任务后：

```text
小地图显示目标图标 / 方向箭头
大地图显示目标图标高亮
任务 HUD 左上显示任务目标
世界中对应目标显示任务标记
```

### 14.2 多目标任务

例如：

```text
击杀豺狼 0/5
收集草药 0/3
找村长交谈
```

大地图规则：

```text
如果目标在多个地点，显示目标区域圈
如果目标是某一具体对象，显示具体图标
如果目标需要刷怪，显示推荐区域
```

### 14.3 任务目标区域圈

当目标不是一个点，而是一个区域：

```text
地图上显示半透明圆圈或区域高亮
圈内显示任务图标
```

示例：

```text
在蜂鸣花田击杀毒蜂 0/5
大地图蜂鸣花田区域显示金色任务圈
小地图进入该区域后显示毒蜂目标提示
```

---

## 15. 屏幕外目标指引

### 15.1 何时显示

```text
当前追踪任务目标不在屏幕内
玩家自定义标记不在屏幕内且正在追踪
传送点/出口被设为追踪目标
```

### 15.2 显示内容

```text
方向箭头
目标图标
距离
任务目标简写，可选
```

示例：

```text
→ [洞穴] 85m
← [村长] 42m
↑ [击杀] 120m
```

### 15.3 多个指引同时存在

默认只显示一个主指引：

```text
当前追踪任务 > 当前追踪标记 > 当前出口 > 最近传送点
```

如果需要显示多个，最多 3 个：

```text
主任务箭头
自定义标记箭头
出口箭头
```

---

## 16. 自定义标记系统

### 16.1 标记用途

玩家可以在大地图上手动打标记：

```text
我想之后来这里
这里可能有宝箱
这里怪太强
这里是资源点
这里是任务疑点
这里是练级点
```

### 16.2 标记类型

| 标记类型 | 图标 | 颜色 |
|---|---|---|
| 普通标记 | 小旗 | 白色 |
| 宝箱 | 宝箱 | 金色 |
| 危险 | 感叹号 | 红色 |
| 资源 | 矿石/草药 | 绿色 |
| 任务疑点 | 问号 | 紫色 |
| 练级点 | 剑 | 橙色 |
| 自定义 | 星星 | 玩家选择 |

### 16.3 打标记流程

```text
打开大地图
→ 点击地图空白位置
→ 弹出“添加标记”按钮
→ 选择标记类型
→ 输入名称，可选
→ 确认
→ 标记出现在大地图和小地图方向指引中
```

移动端：

```text
长按地图位置 0.4s
→ 弹出标记菜单
```

### 16.4 标记数量上限

```text
普通标记最多 30 个
同一区域最多 10 个
超出后提示删除旧标记
```

### 16.5 标记追踪

点击标记：

```text
设为追踪
```

效果：

```text
小地图显示方向箭头
战斗 HUD 可显示“自定义标记”距离
大地图图标高亮
```

### 16.6 删除标记

```text
选中标记
点击删除
二次确认可选
```

普通标记不需要强确认；玩家写了备注的标记可以二次确认。

---

## 17. 传送系统

### 17.1 传送点状态

| 状态 | 表现 |
|---|---|
| 未发现 | 大地图不显示 |
| 已发现未激活 | 灰蓝图标，不能传送 |
| 已激活 | 蓝色发光图标，可传送 |
| 暂不可用 | 灰色，显示原因 |
| 当前所在 | 蓝白脉冲 |

### 17.2 激活传送点

流程：

```text
玩家靠近传送点
→ 显示交互按钮：激活
→ 点击激活
→ 播放激活动画
→ 地图显示传送点
→ 自动保存
```

### 17.3 大地图传送流程

```text
打开大地图
→ 点击已激活传送点
→ 右侧详情显示传送按钮
→ 点击传送
→ 检查条件
→ 弹出确认，可选
→ 屏幕淡出
→ 加载目标区域
→ 玩家出现在传送点旁
→ 屏幕淡入
```

### 17.4 可传送条件

```text
目标传送点已激活
当前不在战斗中
当前不在 Boss 战
当前不在剧情中
当前地图允许传送
玩家没有处于倒地/死亡/交互状态
目标区域未锁定
```

### 17.5 不可传送提示

| 原因 | 提示 |
|---|---|
| 战斗中 | 战斗中无法传送 |
| Boss 战 | Boss 战中无法传送 |
| 剧情中 | 剧情中无法传送 |
| 未激活 | 传送点尚未激活 |
| 区域锁定 | 区域尚未开放 |
| 当前地图禁止 | 当前区域无法传送 |

### 17.6 传送确认

普通传送可不确认。  
跨章节、危险区域、剧情区域建议确认。

```text
是否传送到“蜂鸣花田”？
[取消] [传送]
```

### 17.7 传送费用，可选

MVP 不建议收费。  
如果后续需要金币消耗：

```text
同区域免费
跨区域少量金币
剧情期间免费
```

---

## 18. 地图发现与完成度

### 18.1 区域发现

玩家进入新区域触发：

```text
区域发现提示
大地图解锁区域轮廓
小地图显示区域名称
自动保存
```

### 18.2 地点发现

首次靠近重要地点：

```text
发现地点：草叶洞穴
已标记到地图
```

### 18.3 完成度字段

每个区域可以统计：

```text
已发现地点
宝箱数量
洞穴完成
传送点激活
支线任务完成
Boss 击败
隐藏点发现
```

示例：

```text
草原村周边 完成度 72%
宝箱 6/10
洞穴 1/2
传送点 2/2
支线 3/5
```

### 18.4 完成度显示位置

```text
大地图顶部栏显示当前区域完成度
右侧区域详情显示具体明细
洞穴图标上可显示宝箱 1/3
```

---

## 19. 地图筛选功能

### 19.1 筛选项

大地图左侧筛选栏：

```text
全部
任务
传送点
洞穴
Boss
商店
NPC
宝箱
自定义标记
危险区域
已完成
未完成
```

### 19.2 筛选规则

```text
关闭某类筛选后，对应图标隐藏
当前追踪任务目标永远显示
玩家当前位置永远显示
传送按钮不受筛选影响
```

### 19.3 快捷筛选

底部可有：

```text
只看任务
只看传送
只看未完成
重置筛选
```

---

## 20. 地图图例说明

### 20.1 图例入口

大地图底部：

```text
图例按钮
```

打开后显示所有图标含义。

### 20.2 图例内容

```text
玩家
当前任务
可接任务
可交任务
传送点
洞穴
Boss
商店
铁匠铺
技能神殿
宝箱
自定义标记
危险区域
```

---

## 21. 地图数据结构

### 21.1 MapRegionConfig

```text
RegionID
RegionName
ChapterID
MapTexture
MinimapTexture
WorldBounds
RecommendLevelMin
RecommendLevelMax
DangerLevel
UnlockCondition
CompletionRules
DefaultZoom
CanTeleportFromHere
```

### 21.2 MapPointConfig

```text
PointID
PointName
PointType
RegionID
WorldPosition
MapPosition
Icon
UnlockCondition
DiscoverCondition
IsTeleportPoint
CanTrack
CanShowOnMinimap
CanShowDirectionArrow
Description
RecommendLevel
```

### 21.3 TeleportPointConfig

```text
TeleportID
PointID
SceneName
SpawnPosition
IsDefaultActive
ActivationCondition
TeleportCondition
CostType
CostValue
```

### 21.4 CustomMarkerSaveData

```text
MarkerID
MarkerType
RegionID
WorldPosition
MapPosition
Name
Note
Color
IsTracked
CreateTime
```

### 21.5 MapDiscoverySaveData

```text
RegionID
IsDiscovered
ExploredPercent
DiscoveredPoints
OpenedChests
CompletedDungeons
ActivatedPortals
CustomMarkers
```

---

## 22. 配置表示例

### 22.1 MapRegionConfig.csv

```csv
RegionID,RegionName,ChapterID,RecommendLevelMin,RecommendLevelMax,DangerLevel,CanTeleportFromHere,UnlockCondition
R01_GrassVillage,草原村,CH01,1,3,Safe,true,Start
R02_SouthGrass,南部草地,CH01,1,4,Normal,true,MQ01_Complete
R03_BeeField,蜂鸣花田,CH01,5,8,Danger,true,MQ06_Complete
R04_ForestGate,森林入口,CH01,8,10,Danger,false,MQ08_Complete
```

### 22.2 MapPointConfig.csv

```csv
PointID,PointName,PointType,RegionID,WorldX,WorldY,Icon,CanTrack,ShowMinimap,ShowArrow,UnlockCondition
P01_GrassVillagePortal,草原村传送点,Portal,R01,10,5,Icon_Portal,true,true,true,Start
P02_BeeFieldPortal,蜂鸣花田传送点,Portal,R03,85,20,Icon_Portal,true,true,true,Discover_BeeField
D01_GrassCave,草叶洞穴,Dungeon,R02,45,12,Icon_Dungeon,true,true,true,MQ03_Start
B01_BeeBoss,蜂王守卫,BossArea,R03,120,22,Icon_Boss,true,true,true,MQ07_Complete
S01_SkillShrine,火焰神殿,SkillShrine,R01,18,8,Icon_Shrine,true,true,true,MQ04_Complete
```

### 22.3 MapIconStyle.csv

```csv
PointType,Icon,Color,Size,Priority,Pulse,ShowNameOnHover
Player,Icon_Player,#4AA3FF,28,100,true,false
QuestTarget,Icon_QuestTarget,#FFD84A,30,95,true,true
Portal,Icon_Portal,#5EDBFF,24,70,true,true
Dungeon,Icon_Dungeon,#B16CFF,24,65,false,true
BossArea,Icon_Boss,#FF3030,30,90,true,true
Shop,Icon_Shop,#FFD34D,22,50,false,true
CustomMark,Icon_Flag,#FFFFFF,24,80,true,true
Enemy,Icon_Enemy,#FF4A4A,10,20,false,false
Elite,Icon_Elite,#FF884A,16,40,true,false
```

---

## 23. 运行时流程

### 23.1 小地图更新流程

```text
每 0.1s 更新一次小地图图标位置
玩家位置实时更新
敌人图标只在可见/探测范围内更新
任务目标距离每 0.2s 更新
方向箭头每帧根据屏幕位置更新
```

### 23.2 大地图打开流程

```text
玩家按 M
→ 检查是否允许打开
→ 暂停游戏
→ 加载当前地图数据
→ 定位到玩家所在区域
→ 显示已发现内容
→ 刷新任务目标和标记
```

### 23.3 打标记流程

```text
玩家点击地图位置
→ 将地图坐标转换为世界坐标
→ 弹出标记菜单
→ 选择标记类型
→ 保存 CustomMarkerSaveData
→ 刷新地图图标
→ 如果设为追踪，刷新小地图箭头
```

### 23.4 传送流程

```text
点击传送点
→ 检查传送条件
→ 弹出确认
→ 保存当前状态
→ 淡出
→ 加载目标 Scene
→ 设置玩家 SpawnPosition
→ 淡入
→ 自动保存
```

---

## 24. Unity 脚本结构建议

```text
Scripts/MapSystem/
├── MapManager.cs
├── MinimapController.cs
├── MinimapIcon.cs
├── MinimapIconTracker.cs
├── OffscreenTargetArrow.cs
├── WorldMapPanelUI.cs
├── WorldMapDragZoom.cs
├── WorldMapIconUI.cs
├── WorldMapDetailPanel.cs
├── MapFilterPanel.cs
├── CustomMarkerManager.cs
├── CustomMarkerPopupUI.cs
├── TeleportManager.cs
├── TeleportConfirmPopupUI.cs
├── MapDiscoveryManager.cs
├── MapCompletionTracker.cs
├── MapPointRegistry.cs
├── MapQuestTargetBinder.cs
└── MapDataConfig.cs
```

### 24.1 核心职责

#### MapManager

```text
统一管理地图数据、区域、点位、发现状态、地图打开关闭。
```

#### MinimapController

```text
负责 HUD 小地图内容刷新、图标位置、玩家中心、缩放。
```

#### OffscreenTargetArrow

```text
负责屏幕外任务目标方向箭头。
```

#### WorldMapPanelUI

```text
负责后台大地图界面显示、拖拽、缩放、筛选、选中点位。
```

#### CustomMarkerManager

```text
负责玩家标记创建、删除、保存、追踪。
```

#### TeleportManager

```text
负责传送点激活、传送条件检查、场景切换。
```

#### MapQuestTargetBinder

```text
负责任务目标和地图图标、方向箭头的绑定。
```

---

## 25. UI 美术资源清单

### 25.1 小地图资源

```text
小地图底板
小地图边框
小地图遮罩
玩家图标
普通敌人点
精英敌人图标
Boss 图标
NPC 图标
任务目标图标
传送点图标
洞穴图标
出口图标
屏幕外箭头
任务方向箭头
```

### 25.2 大地图资源

```text
大地图面板底板
地图区域底图
战争迷雾材质
区域边框
区域名称标签
地点图标全套
筛选按钮
详情面板底板
传送按钮
追踪按钮
添加标记按钮
标记类型图标
图例面板
```

### 25.3 标记图标

```text
普通小旗
宝箱标记
危险标记
资源标记
任务疑点标记
练级点标记
自定义星标
删除标记图标
```

---

## 26. 音效资源清单

```text
SFX_Map_Open
SFX_Map_Close
SFX_Map_ClickPoint
SFX_Map_AddMarker
SFX_Map_RemoveMarker
SFX_Map_TrackTarget
SFX_Map_TeleportConfirm
SFX_Map_TeleportStart
SFX_Map_TeleportEnd
SFX_Map_Error
SFX_Minimap_TargetPulse
SFX_Area_Discovered
SFX_Portal_Activated
```

---

## 27. 性能规则

### 27.1 小地图刷新优化

```text
玩家图标每帧更新
敌人图标 0.1s 更新一次
远处图标不创建
使用对象池复用图标
地图底图不频繁重建
```

### 27.2 图标对象池

建议池化：

```text
MinimapIconPool: 80
WorldMapIconPool: 200
OffscreenArrowPool: 8
CustomMarkerIconPool: 40
```

### 27.3 大地图加载

```text
打开大地图时一次性刷新已发现图标
筛选时只 SetActive，不销毁对象
地图底图使用静态图片或 Tile 缓存
```

---

## 28. MVP 开发范围

### 28.1 第一版必须做

```text
HUD 小地图
玩家图标
当前任务目标图标
屏幕外任务方向箭头
敌人小红点
NPC / 传送点 / 洞穴图标
点击小地图打开大地图
后台大地图界面
大地图拖拽和缩放
玩家当前位置
任务目标显示
传送点显示
传送功能
自定义标记添加/删除/追踪
地图筛选
区域发现
基础完成度
```

### 28.2 第二版再做

```text
详细战争迷雾
区域探索百分比
宝箱完成度
洞穴完成度
Boss 阶段地图提示
地图备注文本
多标记颜色自定义
图例高级说明
路线规划
自动寻路，可选
```

---

## 29. 验收标准

### 29.1 小地图验收

```text
小地图位置不遮挡核心 HUD
玩家图标始终正确
敌人/NPC/任务目标图标显示正确
当前任务目标在范围外时显示方向箭头
方向箭头指向正确
任务类型不同，图标不同
点击小地图能打开大地图
```

### 29.2 大地图验收

```text
大地图能打开/关闭
拖拽和缩放流畅
玩家当前位置正确
已发现区域显示正确
未发现区域隐藏或迷雾显示
点击地点能显示详情
筛选功能正确
图例说明正确
```

### 29.3 标记验收

```text
可以在地图上添加标记
不同标记类型图标不同
可以删除标记
可以追踪标记
追踪标记后小地图出现方向箭头
标记能保存和读取
超过上限有提示
```

### 29.4 传送验收

```text
未激活传送点不可传送
已激活传送点可传送
战斗中不可传送
Boss 战不可传送
传送后玩家位置正确
传送后自动保存
不可传送时提示明确
```

### 29.5 任务联动验收

```text
追踪任务后 HUD、小地图、大地图、世界图标同步变化
击杀/交谈/探索/购买/收集等任务图标不同
任务完成后目标图标消失或切换到交付 NPC
任务目标区域可以正确显示范围圈
```

---

## 30. 推荐开发顺序

```text
第 1 步：实现地图数据结构 MapRegion / MapPoint
第 2 步：实现 HUD 小地图框架
第 3 步：实现玩家图标和地图内容跟随
第 4 步：实现任务目标小地图图标
第 5 步：实现屏幕外方向箭头
第 6 步：实现大地图 UI 面板
第 7 步：实现拖拽、缩放、定位玩家
第 8 步：实现地点图标和详情面板
第 9 步：实现传送点激活和传送
第 10 步：实现自定义标记
第 11 步：实现地图筛选和图例
第 12 步：实现区域发现和完成度
第 13 步：接入任务系统完整联动
第 14 步：补音效、动效和性能优化
```

---

## 31. 总结

地图系统的核心是：

```text
小地图解决“当前我该往哪走”
大地图解决“整个区域我探索到哪了”
任务指引解决“目标在哪里”
标记系统解决“我想记住哪里”
传送系统解决“减少重复跑路”
完成度系统解决“我还有什么没做”
```

最终玩家体验应该是：

```text
战斗中看小地图，不迷路。
打开大地图，能找任务、打标记、传送、看完成度。
目标不在屏幕内，也永远知道大致方向。
```
