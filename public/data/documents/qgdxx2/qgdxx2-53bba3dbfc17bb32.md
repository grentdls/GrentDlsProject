# 竖版城市幸存者：建筑玩法、预制体、HUD 与 UI 实现说明

## 本次实现范围

本实现以《竖版城市幸存者_建筑玩法预制体HUD与UI完整方案》的 MVP 为准，落地城主府、伐木场、农场、民居、仓库、铁匠铺、技能商店和训练场 8 座建筑，并保留现有战斗、英雄成长与抖音 WebGL 接入。

城市主界面现包含资源栏、城市等级与繁荣度、主任务、建造队列、固定地块城市区、底部导航和独立弹层。地块交互支持空地建造、占地校验、放置预览、确认建造、建筑快捷详情、完整详情、升级、搬迁、生产领取、工人调整和资源来源跳转。

## 规则与存档

- 建筑实例使用稳定 `instanceId` 和 `plotId`，存档版本升级为 schema 2。
- 建造事务统一执行解锁、城主府等级、占地尺寸、地块占用、建筑数量、建造队列和资源校验；异常时恢复事务前快照。
- 生产资源先进入建筑本地仓，玩家领取后才进入总资源；工人效率、建筑等级和仓库等级共同影响速率与离线容量。
- 离线升级按升级完成时间拆成旧等级和新等级两段结算；系统时间回拨不会产生收益。
- 建筑移动保留生产、本地仓、工人、升级和订单数据。
- 铁匠铺制造、技能商店研究和训练场训练使用统一订单状态机：扣费、工位排队、计时、离线完成、待领取、结果提交和 80% 取消返还均持久化。
- 技能商店显示 3 个真实可研究卡牌订单；研究完成并领取后才加入对应英雄卡池。
- 订单完成状态会进入建筑世界 HUD 优先级，不会被普通升级提示覆盖。

## 预制体契约

建筑预制体位于 `Assets/HeroCity/Prefabs/Buildings`：

- `PF_BLD_Base`
- `PF_BLD_TownHall`
- `PF_BLD_Lumber`
- `PF_BLD_Farm`
- `PF_BLD_House`
- `PF_BLD_Warehouse`
- `PF_BLD_Blacksmith`
- `PF_BLD_SkillShop`
- `PF_BLD_Training`

每个建筑包含 Pivot、选择/占地节点、模型根、碰撞根、阴影、动态部件、特效根、音频根、HUDAnchor 和等级带节点。`BuildingPrefabRig` 持有显式序列化引用，运行时不依赖按节点名称查找。

UI/HUD 预制体位于 `Assets/HeroCity/Prefabs/UI`：

- `PF_HUD_BuildingWorld`
- `PF_UI_CityScreen`
- `PF_UI_BottomSheet`
- `PF_UI_BuildingCard`
- `PF_UI_BuildingDetail`
- `PF_UI_ResourceCostRow`
- `PF_UI_BuildPanel`

可通过 Unity 菜单 `Hero City/Generate City Building Prefabs` 重新生成上述契约资产。生成逻辑位于 `Assets/HeroCity/Editor/CityPrefabGenerator.cs`。

## 竖屏与性能处理

- UI 继续以 1080×1920 竖屏参考分辨率和平台 Safe Area 运行。
- 同屏建筑世界 HUD 最多显示 8 个，并按维修、完成、建造、订单、产出、工人、仓满、升级顺序裁决。
- 资源飞行动效使用对象池，单次最多 7 个飞行标记。
- 城市表现使用轻量 uGUI 与 URP 共享材质，避免把高成本特效和独立材质扩散到每个建筑。
- 所有新增计时使用 UTC 存档，不依赖帧数；WebGL 失焦/恢复时重新结算。

## 验证

- Unity EditMode：34/34 通过，覆盖事务、占地、工人、生产、离线升级、时间回拨、移动、HUD 优先级、订单持久化/领取/取消/工位和预制体契约。
- Unity PlayMode：4/4 通过，包含城市空地点击、建造面板、放置预览、确认建造和快捷详情完整交互链路。
- Unity WebGL/IL2CPP：clean baseline 与最终代码增量 Player 均构建通过；最终输出 18 个文件、82,224,898 字节。
- 验证过程未执行截图操作。

## 生产阶段边界

MVP 的规则闭环、交互层级和预制体契约已经实现。最终建筑模型、角色工人动画、建造/升级粒子、音效、中文字体、本地化文本和品牌级 UI 美术仍需用正式资产替换当前程序化占位表现。矿场、市场、酒馆、医馆、防御建筑、相邻联动和城市防守属于方案定义的后续阶段，未提前混入本次 MVP。
