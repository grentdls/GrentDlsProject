# 猫咪斗恶龙 3 式倾斜地形与圆形世界镜头方案

> 项目：妖兽大陆 / 2D 横版与大地图探索混合项目  
> 当前文档：世界地图地形规则、倾斜镜头、圆形地球感、地图显示与实现方案  
> 目标：重新定义大地图地形实现方式，不再使用纯垂直俯视平铺 Tilemap，而是做成类似《猫咪斗恶龙 3》那种 **2.5D 倾斜地图 + 曲面世界感 + 往上走逐渐看到远方地图** 的表现。

---

## 1. 设计目标

之前的地形方案偏传统 2D 顶视角：

```text
摄像机垂直向下
地面是完全平铺 Tilemap
玩家向上走，只是画面平移
没有远近、没有地平线、没有世界弯曲感
```

现在要改成：

```text
摄像机和地形存在夹角
地图不是完全垂直俯视
屏幕上方代表远处
玩家往上走时，会逐渐看到更远的地图
地形整体有轻微弯曲，模拟“圆形大陆 / 圆形星球”的感觉
角色、建筑、树、怪物都站在这个弯曲大地图上
```

核心效果：

```text
1. 地图不是平面贴纸，而像一块有弧度的玩具大陆
2. 摄像机是斜着看世界，不是正上方垂直看
3. 屏幕上方有远景压缩和地平线感
4. 往上走时，新区域从屏幕上方逐渐展开
5. 海面、岛屿、山体、建筑都跟随曲面世界表现
6. 玩法逻辑仍然保持简单，碰撞和寻路仍可用平面坐标
```

---

## 2. 参考拆解：猫咪斗恶龙 3 的地形观感

《猫咪斗恶龙 3》官方商店页明确把它描述为 **2.5D open-world action RPG**，世界是海盗主题群岛，可以乘船探索海域、上岸探索陆地。这个设定本身就要求大地图同时支持陆地、海面、岛屿、船只和无缝探索。公开截图和实机观感不是传统垂直俯视 Tilemap，而是带有斜视角、远近压缩、玩具地形感的 2.5D 世界。

### 2.1 画面拆解

可以观察到这类地图有几个特点：

```text
1. 镜头不是 90° 垂直俯视，而是有俯角
2. 屏幕上方是远处，屏幕下方是近处
3. 地形在屏幕纵深方向有压缩
4. 岛屿和海面像摆在一个弯曲世界表面上
5. 单位不是严格顶视图，而是偏正面 / 斜正面的 Q 版角色
6. 建筑、树、山体、宝箱等更像“立在地面上”的 2.5D 物件
7. 屏幕上方有更强的地图延展感，不像纯 Tilemap 只是在移动一张平面图
```

### 2.2 玩法拆解

虽然视觉上像曲面世界，但玩法上很可能仍然是简单的逻辑平面：

```text
玩家移动：平面坐标 X/Y
怪物寻路：平面坐标 X/Y
技能判定：平面坐标 X/Y
交互距离：平面坐标 X/Y
地图任务点：平面坐标 X/Y
```

视觉层再把这些平面坐标投射到一个弯曲的显示表面上。

所以我们不要真的做完整球面物理，而是做：

```text
逻辑世界 = 平面
视觉世界 = 倾斜 + 弯曲 + 远近压缩
```

这就是最适合 Unity、移动端、2D 动作 RPG 的实现方式。

---

## 3. 核心技术方案

### 3.1 总体思路

使用“双层世界”方案：

```text
逻辑层：Flat Gameplay World
视觉层：Curved Visual World
```

逻辑层负责：

```text
角色坐标
怪物坐标
寻路
碰撞
任务区域
传送点
技能范围
交互范围
小地图 / 大地图
```

视觉层负责：

```text
地形弯曲
摄像机倾斜
海面曲面
岛屿显示
角色视觉位置
建筑视觉位置
远景压缩
地平线感
```

### 3.2 坐标关系

策划和程序仍然使用简单二维地图坐标：

```text
LogicX = 左右方向
LogicY = 上下 / 远近方向
```

渲染时转成 Unity 3D 坐标：

```text
VisualX = LogicX
VisualZ = CurvedZ
VisualY = Height + CurveDrop
```

其中：

```text
VisualY 是 Unity 的高度
VisualZ 是 Unity 的前后深度
```

---

## 4. 推荐实现方案：平面逻辑 + 圆柱曲面渲染

### 4.1 为什么用圆柱曲面，不直接用球面

真正球面会带来很多问题：

```text
1. 寻路复杂
2. 碰撞复杂
3. 地图编辑复杂
4. 相机跟随复杂
5. UI 任务指引复杂
6. 角色脚底贴合复杂
```

而玩家真正需要的只是：

```text
上下方向有弧度
屏幕上方像远处地图
世界有圆形地球感
```

所以第一版推荐使用 **圆柱曲面**：

```text
X 方向保持平直
Y 方向做弯曲
```

这样能得到“往上走看到远方”的感觉，同时保留最简单的地图制作和碰撞逻辑。

---

## 5. 曲面投影公式

### 5.1 基础参数

```text
FocusY：当前摄像机关注点 Y，一般跟随玩家 Y
CurveRadius：曲率半径，越小弯曲越明显
Height：地形自身高度
```

### 5.2 圆柱投影公式

设：

```text
localY = LogicY - FocusY
theta = localY / CurveRadius
```

转换：

```text
VisualX = LogicX
VisualZ = sin(theta) * CurveRadius
VisualY = Height + cos(theta) * CurveRadius - CurveRadius
```

因为：

```text
cos(theta) * R - R <= 0
```

所以距离摄像机关注点越远，地形会越往下弯。

### 5.3 简化抛物线方案

如果第一版不想做三角函数，也可以用近似公式：

```text
localY = LogicY - FocusY
VisualX = LogicX
VisualZ = localY
VisualY = Height - localY * localY * CurveStrength
```

推荐第一版用圆柱公式，因为它更像球面，调参也更稳定。

---

## 6. 曲率参数建议

### 6.1 大地图默认参数

```text
CurveRadius = 120 ~ 180
VisibleDepth = 35 ~ 50
MaxCurveDrop = 2.0 ~ 4.5
```

解释：

```text
CurveRadius 越小，世界越圆
CurveRadius 越大，世界越平
MaxCurveDrop 控制屏幕上方地形下弯程度
```

### 6.2 第一版推荐

```text
CurveRadius = 150
CameraPitch = 48°
OrthographicSize = 8.5
CameraLookAheadY = 2.5
CameraHeight = 15
CameraDistanceZ = -12
```

视觉目标：

```text
屏幕中下方角色清楚
屏幕上方能看到较远地形
顶部地形轻微压缩并有圆弧感
不会弯到看不清路
```

### 6.3 不同区域参数

| 区域 | CurveRadius | 说明 |
|---|---:|---|
| 草原大地图 | 160 | 轻微曲面，舒服清晰 |
| 海洋大地图 | 130 | 更明显圆形星球感 |
| 山区 | 150 | 适中 |
| 城镇 | 220 | 更平，方便看建筑 |
| 洞穴 / 副本 | 9999 或关闭 | 洞穴内部不需要曲面 |
| Boss 场景 | 9999 或弱曲面 | 保证战斗读招清楚 |

---

## 7. 摄像机规则

### 7.1 摄像机类型

推荐使用：

```text
Orthographic Camera
```

不要使用普通透视相机作为第一版。原因：

```text
1. 正交更像猫咪斗恶龙式可爱地图
2. 角色比例稳定
3. UI 指引更稳定
4. 移动端更清楚
5. 不会出现近大远小过强的问题
```

### 7.2 摄像机角度

推荐：

```text
Pitch = 45° ~ 55°
Yaw = 0°
Roll = 0°
```

第一版：

```text
Pitch = 48°
```

含义：

```text
摄像机从斜上方看地面
不是垂直俯视
屏幕上方自然变成远处
```

### 7.3 摄像机跟随点

摄像机不是完全对准玩家脚底，而是略微看向玩家前方：

```text
CameraTargetX = PlayerX
CameraTargetY = PlayerY + LookAheadY
```

推荐：

```text
LookAheadY = 2.0 ~ 3.5
```

这样玩家往上走时：

```text
屏幕上方会预留更多可见地图
像是在逐渐看到远方世界
```

### 7.4 摄像机平滑

```text
FollowSmoothTime = 0.12 ~ 0.22
LookAheadSmooth = 0.25
```

移动端不要太晃：

```text
FollowSmoothTime = 0.18
```

---

## 8. 地形结构规则

### 8.1 地形不再用纯 Tilemap 直接显示

传统 Tilemap：

```text
Tilemap 直接摆在 XY 平面
摄像机垂直看
```

新方案：

```text
地图数据仍然可以是 Tile 数据
但显示层生成 Curved Terrain Mesh
```

也就是：

```text
Tile 数据 → 地形网格 Mesh → 顶点按曲面公式弯曲 → 摄像机斜看
```

### 8.2 地形层级

大地图至少拆成以下层：

```text
1. OceanLayer      海面层
2. LandBaseLayer   陆地基础层
3. TerrainDetail   草地、沙地、道路细节
4. CliffLayer      悬崖 / 岩壁 / 岸边
5. PropLayer       树、石头、草丛、建筑
6. InteractLayer   宝箱、NPC、传送点、任务点
7. UnitLayer       玩家、怪物、船只
8. VFXLayer        地面特效、海浪、任务圈
9. FogEdgeLayer    远处遮罩 / 地平线雾
```

### 8.3 地形基础类型

| 地形 | 逻辑规则 | 视觉规则 |
|---|---|---|
| 海面 | 船可走，陆地角色不可走 | 曲面大网格，带波纹 |
| 草地 | 可走 | 贴在曲面陆地上 |
| 沙滩 | 可走 | 岛屿边缘过渡 |
| 道路 | 可走，导向 | 贴在陆地层上 |
| 浅水 | 可走 / 减速 | 半透明贴层 |
| 深水 | 船可走 | 海面层 |
| 山体 | 不可走 | 立体边界 / 贴片悬崖 |
| 悬崖 | 不可走 | 斜视角岩壁 |
| 森林边界 | 不可走 | 立体树墙 |
| 城镇地面 | 可走 | 曲率弱化，建筑更平稳 |

---

## 9. 地形 Mesh 生成方案

### 9.1 Chunk 切块

地图按 Chunk 生成：

```text
ChunkSize = 32 x 32 逻辑单位
VisibleChunkRadius = 2 ~ 3
```

移动端第一版：

```text
同时显示 5 x 5 个 Chunk 以内
```

### 9.2 Mesh 顶点密度

为了曲面足够平滑，地面不能只有 4 个顶点。

推荐：

```text
每 1 单位一个顶点
或每 0.5 单位一个顶点
```

移动端：

```text
每 1 单位一个顶点即可
```

### 9.3 地形贴图方式

两种方案：

#### 方案 A：贴图图集 + UV

```text
每种地形是一个 Atlas 区域
Mesh 顶点 UV 对应 Tile 类型
```

优点：

```text
性能好
适合大地图
```

缺点：

```text
编辑器工具要做得更完整
```

#### 方案 B：Chunk RenderTexture 烘焙

```text
先用 Tilemap / 贴图生成一张 Chunk 地形图
再贴到弯曲 Mesh 上
```

优点：

```text
开发快
和 2D Tile 工作流兼容
```

缺点：

```text
近看可能糊
需要处理边缘接缝
```

第一版推荐：

```text
方案 B：Chunk 地图烘焙到贴图，再贴 Curved Mesh
```

后续再优化为 Atlas UV。

---

## 10. 海面规则

### 10.1 海面是最适合表现圆形世界的层

海面建议做成：

```text
一张大 Curved Ocean Mesh
```

它永远覆盖大地图底部：

```text
海面高度 = 0
陆地高度 = 0.08 ~ 0.15
```

这样岛屿略微浮在海面上。

### 10.2 海面 Shader

海面效果：

```text
浅蓝基础色
缓慢流动波纹
海岸泡沫
远处颜色变浅
屏幕上方加雾
```

参数：

```text
WaveSpeed = 0.1 ~ 0.25
WaveScale = 0.4 ~ 0.8
FoamWidth = 0.3 ~ 0.6
FarFadeStrength = 0.4
```

### 10.3 海岸线

海岸线不要靠硬边 Tile。

推荐：

```text
陆地边缘贴 ShoreMask
海面叠 FoamSprite / FoamMesh
```

表现：

```text
白色浪花沿岛屿边缘轻微流动
```

---

## 11. 岛屿和大陆规则

### 11.1 岛屿视觉结构

岛屿不是一张平面贴片，而是：

```text
陆地顶面
沙滩边缘
岸边悬崖 / 土坡
海岸浪花
地表装饰
```

### 11.2 岛屿高度

```text
OceanHeight = 0
BeachHeight = 0.05
LandHeight = 0.12
HillHeight = 0.3 ~ 0.8
```

这里的高度是视觉高度，不影响玩法碰撞。

### 11.3 岛屿边缘

边缘使用：

```text
Cliff Strip
Shore Strip
Beach Strip
```

不要只用 Tile 硬切。

### 11.4 大陆边界

大陆边界可用：

```text
树墙
山墙
断崖
浓雾
海岸线
魔法屏障
```

因为镜头有角度，边界物体应该更像“立起来的屏障”。

---

## 12. 山体、悬崖与遮挡

### 12.1 山体不是平面 Tile

山体需要做成 2.5D 贴片：

```text
山体正面
山顶边缘
阴影底边
不可走碰撞
```

### 12.2 悬崖朝向

由于摄像机主要从下往上看，最重要的是：

```text
面向屏幕下方的悬崖面
```

即玩家能看到的 cliff face。

### 12.3 悬崖层级

```text
CliffTop
CliffWall
CliffShadow
CliffCollider
```

CliffWall 要根据曲面锚点跟随地形，但自身可以不弯曲，只要底部贴合地面即可。

---

## 13. 建筑、树、道具显示规则

### 13.1 所有场景物件使用 Anchor 贴地

每个物件都有一个逻辑坐标：

```text
AnchorLogicPosition = (X, Y)
```

渲染时：

```text
AnchorVisualPosition = ProjectToCurve(X, Y)
```

物件底部放在 AnchorVisualPosition。

### 13.2 物件本体不需要真的弯曲

树、建筑、NPC、宝箱不需要整体变形。

只需要：

```text
底部跟随曲面
整体朝向摄像机
按距离做轻微缩放和排序
```

这样最像 2.5D 纸片 / 玩具模型。

### 13.3 Billboard 规则

角色和树木推荐：

```text
Billboard To Camera
```

但不要完全 3D billboard 乱转，只需要固定面向主摄像机：

```text
Rotation = CameraYawOnly 或固定美术角度
```

### 13.4 远近缩放

为了增强世界弯曲感，可以让远处物体轻微缩小：

```text
Scale = 1 - abs(localY) * 0.002
Scale Clamp = 0.92 ~ 1.05
```

不要过强，否则像透视相机变形。

---

## 14. 角色与怪物规则

### 14.1 逻辑位置

角色真实位置仍是：

```text
LogicX, LogicY
```

移动、寻路、技能全部用这个坐标。

### 14.2 视觉位置

每帧更新：

```text
VisualPosition = ProjectToCurve(LogicX, LogicY, HeightOffset)
```

角色脚底贴在曲面上。

### 14.3 阴影

阴影也要贴地：

```text
ShadowPosition = ProjectToCurve(LogicX, LogicY, 0.01)
ShadowRotation = terrain tangent or camera-facing flat
```

阴影不要悬浮。

### 14.4 攻击范围显示

技能红圈、攻击预警、交互圈都必须贴在曲面上。

做法：

```text
逻辑层生成圆 / 矩形范围
视觉层按曲面投影显示
```

第一版可简化：

```text
用曲面 Mesh Decal 或 LineRenderer 投影
```

---

## 15. 排序规则

### 15.1 为什么排序会复杂

传统 2D 用：

```text
SortingOrder = -Y
```

但曲面渲染后，有 VisualY / VisualZ。

推荐排序仍然使用逻辑 Y：

```text
SortingOrder = BaseOrder - LogicY * 100
```

这样角色和树的前后遮挡稳定。

### 15.2 层级排序

```text
Ocean = 0
Land = 100
RoadDetail = 200
GroundVFX = 300
Props_Back = 400
Units = 500 + SortByLogicY
Props_Front = 700 + SortByLogicY
AirVFX = 900
UI_World = 1000
```

### 15.3 大型建筑排序

大型建筑需要多个遮挡块：

```text
BuildingBase：贴地，不遮挡角色
BuildingBody：按 Y 排序
BuildingRoof：可能永远在角色上方
```

---

## 16. 地图往上走的“逐渐看到上方地图”规则

### 16.1 摄像机跟随 + 曲面共同实现

当玩家向上走：

```text
PlayerY 增加
CameraFocusY 平滑增加
曲面投影的 FocusY 跟着移动
顶部新 Chunk 被加载
屏幕上方出现新的远处地形
旧地形从下方离开
```

这就形成：

```text
世界像在角色脚下缓慢滚动
玩家逐渐看到地图更远处
```

### 16.2 不是单纯 Scroll

普通平面滚动：

```text
整个画面线性移动
```

曲面滚动：

```text
近处移动速度感更明显
远处压缩更明显
顶部像从地平线展开
```

### 16.3 远处可见区域

屏幕上方可以显示更多远景信息：

```text
远处山体
远处城镇轮廓
任务目标光柱
海岛轮廓
Boss 区域阴影
```

但远处不能显示太多细节，避免乱。

---

## 17. 地平线与顶部遮罩

### 17.1 顶部不能露出地图边界

需要：

```text
FarFog
HorizonFade
SkyColorGradient
OceanFarFade
```

### 17.2 顶部雾层

屏幕顶部 10%~20% 加轻雾：

```text
透明白 / 蓝雾
远处地图淡出
```

### 17.3 海洋区域顶部

海上远处可以显示：

```text
浅蓝海雾
波光
远岛剪影
```

### 17.4 陆地区域顶部

陆地远处可以显示：

```text
淡雾
山脉剪影
森林顶部
云影
```

---

## 18. 地图编辑器方案

### 18.1 地图编辑仍然用平面

编辑器中策划不要直接编辑曲面。

编辑器模式：

```text
Flat Edit Mode：平面编辑
Curved Preview Mode：曲面预览
```

策划在平面上摆：

```text
地形 Tile
道路
海岸线
建筑
怪物
宝箱
任务点
传送点
碰撞
```

然后切换曲面预览检查效果。

### 18.2 编辑器功能

```text
地形刷子
海岸线刷子
道路刷子
悬崖刷子
树墙刷子
装饰物刷子
交互物摆放
怪物刷新点
任务点
传送点
曲率预览
摄像机预览
可走区域预览
碰撞预览
```

### 18.3 曲面预览参数

编辑器右侧显示：

```text
CameraPitch
OrthographicSize
CurveRadius
LookAheadY
FogStrength
VisibleChunkCount
```

可以实时调参。

---

## 19. 数据配置表

### 19.1 WorldCameraConfig.csv

```csv
ConfigID,CameraPitch,OrthoSize,LookAheadY,FollowSmooth,CurveRadius,FarFogStart,FarFogEnd
DefaultWorld,48,8.5,2.5,0.18,150,28,45
OceanWorld,50,9.0,3.0,0.20,130,24,42
Town,45,7.5,1.5,0.16,220,35,55
Dungeon,45,7.2,0.5,0.12,9999,999,999
Boss,45,7.8,0.0,0.10,9999,999,999
```

### 19.2 TerrainChunkConfig.csv

```csv
ConfigID,ChunkSize,VertexStep,VisibleRadius,PreloadRadius,UseRenderTexture,TextureSize
MobileDefault,32,1.0,2,3,true,512
PCDefault,32,0.5,3,4,true,1024
LowEndMobile,24,1.5,2,2,true,512
```

### 19.3 TerrainTypeConfig.csv

```csv
TerrainID,Name,Walkable,MoveSpeedRate,VisualLayer,Height,Material,CanShipMove,CanLandMove
Ocean,海面,false,1.0,Ocean,0,Mat_Ocean,true,false
Grass,草地,true,1.0,Land,0.12,Mat_Grass,false,true
Sand,沙滩,true,1.0,Land,0.08,Mat_Sand,false,true
Road,土路,true,1.05,Detail,0.13,Mat_Road,false,true
ShallowWater,浅水,true,0.75,Detail,0.04,Mat_ShallowWater,true,true
Cliff,悬崖,false,1.0,Cliff,0.4,Mat_Cliff,false,false
ForestWall,森林边界,false,1.0,Prop,0.12,Mat_Forest,false,false
```

### 19.4 PropVisualConfig.csv

```csv
PropType,UseCurveAnchor,UseBillboard,ScaleByDistance,SortByLogicY,CanOccludeUnit
Tree,true,true,true,true,true
Building,true,false,false,true,true
Chest,true,true,false,true,false
NPC,true,true,false,true,false
Portal,true,true,false,true,false
CliffWall,true,false,false,true,true
```

---

## 20. Unity 目录结构建议

```text
Assets/Game/World/
├── Runtime/
│   ├── CurvedWorldProjector.cs
│   ├── CurvedCameraController.cs
│   ├── TerrainChunkManager.cs
│   ├── TerrainChunkRenderer.cs
│   ├── CurvedTerrainMeshBuilder.cs
│   ├── CurvedObjectAnchor.cs
│   ├── WorldSpriteSorter.cs
│   ├── CurvedDecalProjector.cs
│   └── HorizonFogController.cs
│
├── Editor/
│   ├── WorldMapEditorWindow.cs
│   ├── TerrainBrushTool.cs
│   ├── CoastlineBrushTool.cs
│   ├── CurvedPreviewWindow.cs
│   └── ChunkBakeTool.cs
│
├── Data/
│   ├── WorldMapData.cs
│   ├── TerrainChunkData.cs
│   ├── TerrainTypeConfig.cs
│   ├── WorldCameraConfig.cs
│   └── PropPlacementData.cs
│
├── Shaders/
│   ├── SH_CurvedTerrain.shader
│   ├── SH_CurvedOcean.shader
│   ├── SH_WorldFog.shader
│   └── SH_CurvedDecal.shader
│
├── Materials/
├── Prefabs/
└── Textures/
```

---

## 21. 核心脚本职责

### 21.1 CurvedWorldProjector

职责：

```text
逻辑坐标转视觉坐标
根据 FocusY 计算曲率
提供统一投影接口
```

接口：

```csharp
Vector3 Project(Vector2 logicPos, float height = 0);
Vector3 Project(float logicX, float logicY, float height = 0);
Vector2 Unproject(Vector3 visualPos);
```

### 21.2 CurvedCameraController

职责：

```text
跟随玩家
控制 LookAhead
更新 FocusY
控制摄像机 Pitch / OrthoSize
通知地形 Shader 当前 FocusY
```

### 21.3 TerrainChunkManager

职责：

```text
根据玩家位置加载 / 卸载 Chunk
管理 Chunk 数据
处理远处预加载
```

### 21.4 CurvedTerrainMeshBuilder

职责：

```text
把平面 Chunk 数据生成 Mesh
设置顶点、UV、材质
支持曲面顶点或 Shader 弯曲
```

### 21.5 CurvedObjectAnchor

职责：

```text
让 NPC、宝箱、怪物、树、建筑跟随曲面地形
每帧根据逻辑坐标更新视觉位置
```

### 21.6 WorldSpriteSorter

职责：

```text
根据 LogicY 排序 Sprite
处理建筑遮挡
处理单位与场景物关系
```

---

## 22. Shader 弯曲 vs CPU 弯曲

### 22.1 CPU 弯曲

做法：

```text
生成 Mesh 顶点时直接计算弯曲坐标
```

优点：

```text
容易理解
调试方便
碰撞可单独处理
```

缺点：

```text
FocusY 改变时需要重算或移动网格
大地图可能开销高
```

### 22.2 Shader 弯曲

做法：

```text
Mesh 仍是平面
顶点 Shader 根据 _FocusY 和 _CurveRadius 弯曲
```

优点：

```text
性能好
FocusY 每帧更新成本低
地形滚动自然
```

缺点：

```text
编辑和调试稍复杂
Sprite / 物件也要配合
```

### 22.3 推荐

第一版：

```text
地形 Mesh：Shader 弯曲
物件 Anchor：CPU 计算视觉坐标
技能预警：CPU 生成曲面贴片
```

这样最稳。

---

## 23. 小地图和大地图规则

### 23.1 小地图不使用曲面

小地图仍然显示平面逻辑地图：

```text
小地图 = Logic Map
```

原因：

```text
玩家看小地图是为了导航，不是看视觉曲面
```

### 23.2 大地图也使用平面图

后台大地图显示：

```text
完整平面世界地图
任务点
传送点
标记
区域边界
```

### 23.3 世界内任务指引

世界内任务光柱需要投影到曲面：

```text
光柱底部 = ProjectToCurve(TargetLogicPos)
光柱竖直向上
远处任务目标可被顶部雾遮住一部分
```

---

## 24. 碰撞与寻路规则

### 24.1 碰撞仍然是平面

所有碰撞数据使用：

```text
LogicX / LogicY
```

碰撞类型：

```text
WalkableMask
BlockMask
WaterMask
ShipMask
TriggerArea
```

### 24.2 寻路仍然是平面

敌人寻路：

```text
A* / NavGrid 使用 Logic Map
```

船只寻路：

```text
只在 Ocean / ShallowWater 可移动
```

陆地角色：

```text
只在 Grass / Sand / Road / Town / ShallowWater 可移动
```

### 24.3 曲面不参与碰撞

绝对不要：

```text
用弯曲后的 Visual Mesh 做碰撞
```

否则会让移动、技能、任务判断全部复杂化。

---

## 25. 战斗范围和地面预警规则

### 25.1 攻击范围逻辑

技能范围仍用逻辑坐标：

```text
圆形
矩形
扇形
直线
```

### 25.2 显示到曲面

显示层把范围边界点投影到曲面：

```text
范围边界采样点 → ProjectToCurve → LineRenderer / Mesh
```

### 25.3 地面红圈

红圈要贴合地形弯曲：

```text
生成一个圆形 Mesh
圆周采样 32 点
每点按曲面投影
```

不要直接在屏幕上画 UI 红圈，否则地形透视不一致。

---

## 26. 视觉风格规则

### 26.1 地形风格

```text
低多边形感
手绘卡通贴图
颜色块清楚
边界柔和
玩具模型感
移动端可读性优先
```

### 26.2 地形不是写实

禁止：

```text
真实地形纹理
复杂法线
高频草皮
写实海浪
太多噪点
```

### 26.3 曲面感不要过强

如果曲率太强会出现：

```text
角色像站在碗里
路面变形太明显
远处建筑歪斜
操作读图困难
```

第一版宁愿轻一点。

---

## 27. MVP 实现步骤

### 第 1 步：先做平面逻辑地图

```text
Flat Logic Map
玩家移动
碰撞
地形类型
简单 Chunk
```

### 第 2 步：实现倾斜正交摄像机

```text
Orthographic Camera
Pitch 48°
跟随玩家
LookAheadY
```

### 第 3 步：实现 CurvedWorldProjector

```text
平面坐标转曲面坐标
角色和宝箱先贴到曲面
```

### 第 4 步：实现 Curved Terrain Mesh

```text
Chunk 生成 Mesh
地形贴图
曲面弯曲
```

### 第 5 步：实现物件 Anchor

```text
树
宝箱
NPC
怪物
传送点
任务点
```

### 第 6 步：实现排序

```text
根据 LogicY 排序
处理建筑遮挡
处理单位前后关系
```

### 第 7 步：实现海面和海岸线

```text
曲面海面
岛屿陆地
泡沫边缘
```

### 第 8 步：实现远处雾和地平线

```text
顶部淡雾
远处淡出
边界遮罩
```

### 第 9 步：实现技能预警贴曲面

```text
红圈
扇形
直线
任务光柱
```

### 第 10 步：编辑器曲面预览

```text
Flat Edit
Curved Preview
摄像机模拟
```

---

## 28. 性能优化

### 28.1 Chunk 加载

```text
玩家周围 2~3 圈 Chunk 显示
远处只显示低细节
离开视野的 Chunk 进入对象池
```

### 28.2 地形贴图

```text
Chunk 贴图缓存
相同地形材质共用 Material
减少 DrawCall
```

### 28.3 曲面计算

```text
地形用 Shader 弯曲
动态物件用 CPU 投影
投影函数避免每帧大量 GC
```

### 28.4 装饰物 LOD

远处装饰物：

```text
隐藏小草
隐藏小石头
降低特效
只保留大轮廓
```

---

## 29. 常见问题与解决

### 29.1 角色看起来悬空

原因：

```text
角色脚底点没有对齐曲面 Anchor
阴影没有贴地
```

解决：

```text
统一 Pivot = Bottom Center
Shadow 单独 ProjectToCurve
```

### 29.2 建筑排序乱

原因：

```text
只按 VisualZ 排序
大型建筑只有一个排序点
```

解决：

```text
按 LogicY 排序
大型建筑拆 Base / Body / Roof
```

### 29.3 地形接缝明显

原因：

```text
Chunk UV 边缘不连续
曲面顶点密度不同
```

解决：

```text
相邻 Chunk 使用同样顶点边界
贴图边缘扩展 2~4 px
```

### 29.4 曲面太晕

原因：

```text
CurveRadius 太小
摄像机 Pitch 太低
远处缩放太强
```

解决：

```text
增大 CurveRadius
提高 CameraPitch
减少远近缩放
```

### 29.5 红圈不贴地

原因：

```text
红圈是普通 UI 或平面 Sprite
```

解决：

```text
红圈范围 Mesh 采样后逐点投影到曲面
```

---

## 30. 验收标准

### 30.1 视觉验收

```text
地图明显不是垂直俯视平铺
摄像机和地形有斜角
屏幕上方有远处地图感
玩家往上走时，上方区域逐渐展开
海面和岛屿有轻微圆形世界感
角色、怪物、宝箱脚底贴地
建筑、树、山体排序正确
```

### 30.2 玩法验收

```text
玩家移动不受曲面影响
碰撞仍然准确
技能范围逻辑准确
任务目标坐标准确
小地图和大地图不受曲面变形影响
传送点、宝箱、NPC 交互正常
```

### 30.3 性能验收

```text
移动端大地图稳定 60 FPS 或目标帧率
Chunk 加载无明显卡顿
对象 Anchor 更新无 GC 峰值
全屏 30 个动态物件时正常
```

---

## 31. 推荐第一版参数

```text
Camera Type: Orthographic
Camera Pitch: 48°
Orthographic Size: 8.5
LookAheadY: 2.5
FollowSmooth: 0.18
Curve Mode: Cylinder
CurveRadius: 150
ChunkSize: 32
VertexStep: 1.0
VisibleChunkRadius: 2
FarFogStart: 28
FarFogEnd: 45
ObjectDistanceScale: 0.92 ~ 1.02
```

---

## 32. 最终方案总结

这套地形系统的关键不是把地图真的做成一个物理球体，而是：

```text
逻辑上保持平面
视觉上做倾斜摄像机和曲面投影
地形用曲面 Mesh
物体用曲面 Anchor
碰撞和寻路仍然简单
小地图和大地图仍然平面
```

最终表现：

```text
玩家在妖兽大陆上行走时，画面像一个可爱的弯曲玩具世界。
往上走，远方地图从屏幕上方慢慢展开；
海岛、森林、山体和城镇都贴在这个圆形大陆上；
但程序逻辑仍然像普通 2D 地图一样简单可靠。
```

---

## 33. 参考信息

公开资料中，《猫咪斗恶龙 3》被描述为 2.5D 开放世界动作 RPG，并且包含海域、群岛、船只探索、上岸探索等大地图玩法。这些公开描述可作为我们拆解其“大地图不是纯垂直 Tilemap，而是 2.5D 世界表现”的参考依据。本文档的实现方案不是官方源码结论，而是基于公开画面和玩法观感整理出的 Unity 可落地方案。
