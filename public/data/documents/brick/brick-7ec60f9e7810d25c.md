# 太空3D积木飞船幸存者：玩家积木模型与图标AI生成提示词文档

版本：V0.1  
用途：用于批量生成玩家飞船积木部件的 3D 模型概念图、低模模型参考图、游戏内图标、背包图标、BD卡牌图标。  
目标风格：低多边形 3D、积木玩具感、太空科幻、模块边界清晰、颜色区分明确、适合Unity/UE中制作成预制体。

---

# 1. 统一美术方向

## 1.1 核心视觉关键词

```text
low poly 3D, modular spaceship blocks, toy brick style, hard surface sci-fi, clean silhouette, beveled cube edges, readable module shape, colorful material separation, game asset, orthographic view, no text, no logo, no background clutter
```

中文理解：

```text
低多边形3D，模块化太空飞船积木，玩具积木质感，硬表面科幻，轮廓清晰，方块边缘有倒角，模块功能一眼可读，颜色分区明确，适合游戏资产，没有文字，没有复杂背景。
```

## 1.2 玩家积木整体风格

玩家积木不能做成真实军工飞船，也不能做得太碎太复杂。整体应该像“可以拼装的太空积木玩具”，每个部件都是规则体积，能看出它是一个可安装模块。

### 统一要求

1. 所有积木以 **1m × 1m × 1m** 为基础单位。
2. 每个模型外形必须能对齐网格。
3. 边缘有轻微倒角，避免纯正方体太呆。
4. 每个部件必须保留清晰的基础块结构。
5. 攻击、防御、辅助的上层功能块不能参与连接，视觉上要明显区分。
6. 模型细节不要过碎，避免缩小时变成一团。
7. 同类部件使用统一造型语言。
8. 不要出现真实品牌、文字、数字、Logo。
9. 不要出现过多细线缆、尖刺、透明复杂玻璃。
10. 适合做成游戏内低模3D预制体。

---

# 2. 部件类型视觉规范

## 2.1 链接部件

定位：搭建飞船骨架、连接其他部件。

### 视觉特征

| 项目 | 说明 |
|---|---|
| 主色 | 灰白、深灰、工业蓝 |
| 外形 | 方块、长条、T型、十字、平台、环形框架 |
| 细节 | 拼接口、插槽、铆钉、能量线槽、边缘倒角 |
| 禁止 | 炮口、护盾板、大面积发光核心 |
| 重点 | 一眼看出这是“连接骨架” |

### 链接部件基础提示词

```text
A modular low-poly 3D spaceship connector block, toy brick style, grid-aligned hard surface sci-fi part, visible snap sockets on each connectable face, clean beveled cube edges, industrial gray and blue color scheme, simple readable silhouette, no weapons, no shield plate, no text, no logo, isolated on plain background, game asset style
```

---

## 2.2 防御部件

定位：局部防御、承受冲撞、保护飞船关键位置。

### 视觉特征

| 项目 | 说明 |
|---|---|
| 主色 | 银灰、铁黑、深蓝、黄色警戒条 |
| 结构 | 基础块 + 上层防御块 |
| 外形 | 装甲板、盾面、缓冲块、护盾发生器、隔离板 |
| 细节 | 厚装甲、边缘包边、能量盾纹路、裂纹抗冲击面 |
| 禁止 | 炮管、导弹仓、攻击发光口 |
| 重点 | 一眼看出它是“挡伤害的” |

### 防御部件基础提示词

```text
A modular low-poly 3D spaceship defense block, composed of a cubic base block with an extra armor block mounted on top, toy brick style, thick armor plate, beveled edges, sci-fi shield details, gray metal with yellow warning stripes, readable defensive silhouette, the top armor block is not a connector, no weapons, no text, no logo, isolated on plain background, game asset style
```

---

## 2.3 攻击部件

定位：主要输出模块，发射子弹、激光、导弹、闪电链等。

### 视觉特征

| 项目 | 说明 |
|---|---|
| 主色 | 红色、橙色、黑色、深灰 |
| 结构 | 基础块 + 上层攻击块 |
| 外形 | 炮管、炮塔、导弹仓、激光发射器、电弧装置 |
| 细节 | 炮口、散热口、弹仓、能量核心、瞄准镜 |
| 禁止 | 防御盾面、连接插槽过多 |
| 重点 | 一眼看出攻击方向和武器类型 |

### 攻击部件基础提示词

```text
A modular low-poly 3D spaceship weapon block, composed of a cubic base block with a weapon module mounted on top, toy brick style, clear weapon direction, hard surface sci-fi cannon or laser emitter, red orange and dark metal colors, clean readable silhouette, beveled cube base, top weapon block is not a connector, no text, no logo, isolated on plain background, game asset style
```

---

## 2.4 辅助部件

定位：提供全局加成、区域增幅、修复、磁吸、推进、控制等效果。

### 视觉特征

| 项目 | 说明 |
|---|---|
| 主色 | 蓝色、绿色、紫色、青色发光 |
| 结构 | 基础块 + 上层辅助块 |
| 外形 | 能源核心、增幅器、维修仓、雷达、磁吸器、推进稳定器 |
| 细节 | 发光核心、环形线圈、雷达盘、小型天线、能量管 |
| 禁止 | 巨大炮口、厚重装甲 |
| 重点 | 一眼看出它是“功能增强模块” |

### 辅助部件基础提示词

```text
A modular low-poly 3D spaceship support block, composed of a cubic base block with a glowing utility module mounted on top, toy brick style, sci-fi energy amplifier, clean readable silhouette, blue green or purple glow, beveled cube base, top support module is not a connector, no weapons, no heavy armor, no text, no logo, isolated on plain background, game asset style
```

---

## 2.5 核心部件

定位：玩家飞船中心，生命归零则失败。

### 视觉特征

| 项目 | 说明 |
|---|---|
| 主色 | 白色、蓝色发光、少量金色 |
| 外形 | 小型驾驶舱、核心反应炉、中央积木舱 |
| 细节 | 蓝色能量窗、核心灯、连接插槽 |
| 重点 | 必须和普通部件区分明显 |

### 核心部件基础提示词

```text
A low-poly 3D modular spaceship core cockpit block, toy brick style, compact cubic cockpit with glowing blue energy window, white and blue sci-fi material, visible snap sockets around the base, clean beveled edges, heroic player module, no text, no logo, isolated on plain background, game asset style
```

---

# 3. 模型生成统一规范

## 3.1 模型视角建议

用于生成模型概念图时，推荐一次生成多视图：

```text
front view, side view, top view, 3/4 isometric view, orthographic, same object, no background, low-poly 3D game asset sheet
```

中文：

```text
正视图、侧视图、俯视图、四分之三等距视角，同一个物体，正交视角，无背景，低多边形3D游戏资产展示图。
```

## 3.2 模型尺寸表现要求

提示词中需要写清楚尺寸，例如：

```text
size: 3 meters long, 1 meter wide, 1 meter high, based on 1m cubic grid units
```

对应中文：

```text
尺寸为3米长、1米宽、1米高，基于1米立方体网格单位。
```

## 3.3 连接点表现

连接点需要用视觉符号表达，但不要太复杂。

推荐连接点造型：

1. 圆形插孔。
2. 方形插槽。
3. 十字凹槽。
4. 蓝色小型能量接口。
5. 边缘机械卡扣。

连接点提示词：

```text
visible snap sockets on connectable faces, square grid connectors, simple mechanical docking ports, clean and readable
```

## 3.4 禁止内容负面提示词

所有模型生成都建议加入：

```text
negative prompt: realistic military spaceship, too many tiny details, dirty photorealistic texture, organic flesh, complex wires, excessive spikes, text, numbers, logo, watermark, background scene, character, pilot, flames covering the model, blurry, over-detailed, asymmetrical broken shape, non-grid shape, thin fragile antenna everywhere
```

中文含义：

```text
不要真实军工飞船，不要太多碎细节，不要写实脏贴图，不要有机肉体，不要复杂线缆，不要大量尖刺，不要文字数字Logo水印，不要背景场景，不要角色驾驶员，不要火焰遮挡模型，不要模糊，不要过度复杂，不要无法对齐网格的形状，不要满身细天线。
```

---

# 4. 图标生成统一规范

## 4.1 图标用途

图标用于：

1. 积木背包。
2. BD三选一卡牌。
3. 部件详情面板。
4. 飞船结构列表。
5. 解锁图鉴。
6. 掉落提示。

## 4.2 图标基础规格

| 项目 | 规格 |
|---|---|
| 推荐尺寸 | 512×512 |
| 背景 | 透明背景 / 纯深色底两版 |
| 视角 | 3/4等距视角 |
| 光照 | 左上方柔光 |
| 阴影 | 轻微接触阴影，透明版可去掉 |
| 文字 | 不要文字，不要数字 |
| 外轮廓 | 可加轻微描边或外发光 |
| 图标边框 | 不直接画边框，边框交给UI预制体 |

## 4.3 图标基础提示词

```text
A clean 512x512 game icon of a modular low-poly spaceship block, 3/4 isometric view, toy brick style, clear silhouette, centered composition, soft studio lighting, transparent background, no text, no numbers, no logo, no watermark, readable small icon, colorful sci-fi material
```

## 4.4 不同类型图标颜色规范

| 类型 | 图标主色 | 图标辅助光 |
|---|---|---|
| 核心 | 白 + 蓝 | 蓝色核心光 |
| 链接 | 灰 + 蓝 | 少量蓝色接口光 |
| 防御 | 银灰 + 黄黑 | 护盾蓝光 |
| 攻击 | 红橙 + 黑 | 炮口橙光 |
| 辅助 | 蓝绿紫 | 功能发光 |
| 稀有改造 | 金色点缀 | 稀有外发光 |

## 4.5 图标负面提示词

```text
negative prompt: text, number, logo, watermark, character, pilot, busy background, realistic photo, too much smoke, explosion covering object, blurry, dark silhouette, unreadable tiny details, UI frame, card frame, duplicated object, cropped object
```

---

# 5. 批量生成工作流

## 5.1 推荐生成顺序

```text
1. 先生成核心部件风格样张
2. 生成链接部件一组，确定基础积木语言
3. 生成防御、攻击、辅助各3个样张
4. 确定颜色、倒角、连接点、材质规范
5. 批量生成全部模型参考图
6. 根据模型参考图生成图标
7. 统一图标光照、角度、边缘描边
8. 导入游戏制作Prefab
```

## 5.2 每个积木资产应产出

每个部件建议产出以下资产：

```text
模型参考图_四视图
模型参考图_3/4视角
图标_512透明底
图标_512深色底
Prefab模型
碰撞盒
连接点配置
部件数据配置
BD卡牌图标引用
```

## 5.3 文件命名规范

```text
Block_Core_001_Cockpit
Block_Link_001_SmallConnector
Block_Def_001_ArmorPlate
Block_Atk_001_MachineCannon
Block_Sup_001_EnergyAmplifier
Icon_Block_Core_001_Cockpit
Icon_Block_Link_001_SmallConnector
```

中文项目中也可用：

```text
积木_核心_001_驾驶舱
积木_链接_001_小型连接块
图标_攻击_001_单管机炮
```

---

# 6. 模型生成总模板

## 6.1 通用模型提示词模板

把 `{}` 内内容替换成具体部件。

```text
Create a low-poly 3D game asset of {部件名称}, a modular spaceship block for a toy-brick style space survivor game. The part is based on 1-meter cubic grid units, size {尺寸}. It must have a clear cubic base block and readable modular shape. {功能结构描述}. Use clean beveled edges, visible snap sockets only on connectable base faces, colorful sci-fi hard-surface materials, simple readable silhouette, no text, no logo. Show front view, side view, top view and 3/4 isometric view on a plain background. Game-ready concept, clean low poly, not photorealistic.

negative prompt: realistic military spaceship, too many tiny details, text, numbers, logo, watermark, complex background, dirty texture, organic flesh, excessive wires, blurry, over-detailed, non-grid shape
```

## 6.2 通用图标提示词模板

```text
Create a clean 512x512 game icon of {部件名称}, a modular low-poly spaceship block. 3/4 isometric view, centered, transparent background, toy brick style, clear silhouette, readable at small size, soft studio lighting, colorful sci-fi material. {图标重点描述}. No text, no numbers, no logo, no UI frame, no watermark.

negative prompt: text, numbers, logo, watermark, character, busy background, explosion covering object, blurry, cropped object, duplicate object, card frame
```

---

# 7. 玩家积木完整生成清单：100个部件

下面的列表按照“核心、链接、防御、攻击、辅助”拆分。每个部件都给出模型生成重点和图标生成重点。实际生成时，可以把“模型重点”套入通用模型提示词，把“图标重点”套入通用图标提示词。

---

# 7.1 核心部件 10 个

| ID | 名称 | 尺寸 | 模型重点 | 图标重点 |
|---|---|---|---|---|
| Core_001 | 初始驾驶舱核心 | 2×2×1 | 白蓝小型驾驶舱，顶部蓝色能量窗，六面连接插槽 | 白蓝核心舱，蓝色发光窗最醒目 |
| Core_002 | 重装指挥核心 | 2×2×2 | 厚重方形核心，四角装甲包边，前方观察窗 | 厚重核心，银灰外壳和蓝窗 |
| Core_003 | 高速侦察核心 | 2×1×1 | 细长轻型核心，流线但仍网格化，尾部小推进口 | 小巧高速核心，蓝白轻量感 |
| Core_004 | 能源反应核心 | 2×2×2 | 中央透明蓝色反应炉，周围机械护环 | 发光反应炉占中心 |
| Core_005 | 护盾核心 | 2×2×1 | 核心周围有四个小型护盾发生器，蓝色弧形能量片 | 蓝色护盾弧光包围核心 |
| Core_006 | 武装核心 | 2×2×1 | 核心两侧有小型固定炮座，但主体仍是核心 | 核心旁有红色小炮口 |
| Core_007 | 巨舰核心 | 3×2×2 | 大型舰桥核心，多个连接槽，厚重舰首 | 大型舰桥感，金蓝点缀 |
| Core_008 | 磁吸核心 | 2×2×1 | 顶部环形磁吸线圈，绿色吸收光 | 绿色磁环明显 |
| Core_009 | 维修核心 | 2×2×1 | 侧面维修机械臂和小型纳米舱，绿色医疗光 | 绿色维修灯和小机械臂 |
| Core_010 | 实验核心 | 2×2×2 | 紫色实验能量核心，不规则但仍方块网格 | 紫色高稀有核心光 |

---

# 7.2 链接部件 25 个

| ID | 名称 | 尺寸 | 模型重点 | 图标重点 |
|---|---|---|---|---|
| Link_001 | 小型连接块 | 1×1×1 | 标准灰色方块，六面有简单插槽 | 最基础六面接口方块 |
| Link_002 | 长条连接梁 | 3×1×1 | 三格长梁，前后连接明显，侧面有蓝色线槽 | 横向长条轮廓清楚 |
| Link_003 | 双格连接梁 | 2×1×1 | 两格短梁，适合基础扩展 | 短连接梁，简单易读 |
| Link_004 | 十字连接架 | 3×3×1 | 十字形平台，中间加固节点 | 十字轮廓清晰 |
| Link_005 | T型连接架 | 3×2×1 | T字形结构，三方向接口 | T字形积木平台 |
| Link_006 | L型转角块 | 2×2×1 | 90度转角结构，外角倒角 | L形轮廓明显 |
| Link_007 | 厚重骨架块 | 2×2×1 | 厚实连接平台，四角加固包边 | 厚重方形连接板 |
| Link_008 | 竖向连接柱 | 1×1×2 | 竖直双层连接柱，上下接口明显 | 竖向柱状积木 |
| Link_009 | 三层连接塔 | 1×1×3 | 高塔式连接模块，适合上下扩展 | 高塔轮廓突出 |
| Link_010 | 宽体平台 | 3×2×1 | 宽平台，多连接点，适合挂武器 | 宽平台感强 |
| Link_011 | 大型甲板平台 | 3×3×1 | 大面积平台，九宫格边缘连接槽 | 大型方形平台 |
| Link_012 | 环形连接座 | 3×3×1 | 中间镂空环形平台，外圈接口 | 环形结构明显 |
| Link_013 | 双翼连接架 | 5×1×1 | 超长横梁，左右扩展，中央加固 | 长翼梁图标 |
| Link_014 | 前向脊柱梁 | 4×1×1 | 舰首方向长脊梁，前端有连接头 | 前后长梁，像船脊 |
| Link_015 | 斜角转接块 | 2×2×1 | 方块网格内表现斜面外观，实际占2×2 | 斜面转接轮廓 |
| Link_016 | 双排连接板 | 2×2×1 | 2×2平板，四侧接口 | 简洁2×2板 |
| Link_017 | 侧挂连接臂 | 1×3×1 | 侧向伸展臂，末端大接口 | 细长侧臂 |
| Link_018 | 中央加固节点 | 2×2×2 | 立方体加固节点，六面大接口 | 厚方块节点 |
| Link_019 | 轻量蜂窝梁 | 3×1×1 | 长梁带蜂窝孔洞，但孔洞简洁 | 镂空轻量梁 |
| Link_020 | 装甲连接梁 | 3×1×1 | 链接梁上有轻装甲包边，但不是防御部件 | 灰黑加固长梁 |
| Link_021 | 能量连接梁 | 2×1×1 | 梁中央有蓝色能量管线 | 蓝光连接梁 |
| Link_022 | 多接口转盘 | 2×2×1 | 圆形转接盘嵌在方格底座中 | 圆盘转接口 |
| Link_023 | 尾部挂载架 | 2×1×1 | 尾部专用挂载结构，适合推进器 | 尾架形状明显 |
| Link_024 | 分叉连接架 | 3×2×1 | Y形/分叉结构，但占规则网格 | 分叉外形清楚 |
| Link_025 | 巨舰主梁 | 5×1×1 | 大型主梁，厚重，多个蓝色接口 | 巨大长梁，稀有感 |

---

# 7.3 防御部件 20 个

| ID | 名称 | 尺寸 | 模型重点 | 图标重点 |
|---|---|---|---|---|
| Def_001 | 小型装甲板 | 1×1×1 | 基础块上方一块厚装甲板，银灰色 | 小装甲板清楚 |
| Def_002 | 厚重装甲板 | 2×1×1 | 双格厚装甲，黄黑警戒条 | 厚重横向护板 |
| Def_003 | 舰首冲撞盾 | 2×1×1 | 前方楔形厚盾，占规则方格 | 舰首盾面突出 |
| Def_004 | 侧翼护板 | 2×1×1 | 侧向展开护板，适合左右防御 | 侧面长护板 |
| Def_005 | 上层护甲盖 | 1×1×1 | 顶部圆角装甲盖，像盖子 | 顶盖护甲明显 |
| Def_006 | 冲撞缓冲块 | 1×1×1 | 前方橡胶/能量缓冲垫，厚实 | 软垫防撞造型 |
| Def_007 | 反弹装甲 | 1×1×1 | 装甲面有蓝色反冲能量纹 | 蓝色反弹纹路 |
| Def_008 | 能量盾发生器 | 2×2×1 | 四角发射器，中间蓝色盾面投影 | 蓝盾投影明显 |
| Def_009 | 小型护盾片 | 1×1×1 | 小块蓝色透明护盾片立在基础块上 | 小蓝盾图标 |
| Def_010 | 爆炸隔离板 | 1×1×1 | 分层隔热板，红黄警戒涂装 | 分层隔板造型 |
| Def_011 | 陶瓷隔热装甲 | 2×1×1 | 白色陶瓷外壳，红色隔热纹 | 白红隔热板 |
| Def_012 | 震荡吸收器 | 1×1×1 | 圆形缓冲弹簧/阻尼器结构 | 阻尼器特征明显 |
| Def_013 | 核心护卫盾 | 2×2×1 | 十字护盾板，中央蓝色核心符号 | 十字盾面 |
| Def_014 | 尾部护甲 | 2×1×1 | 后向防御板，带推进器保护槽 | 后护甲造型 |
| Def_015 | 护盾电池板 | 1×1×1 | 小型蓝色能量电池连接护盾 | 蓝电池护盾感 |
| Def_016 | 装甲格栅 | 2×2×1 | 网格装甲结构，适合挡弹 | 格栅板清晰 |
| Def_017 | 自修复装甲 | 1×1×1 | 绿色修复纹路在装甲表面 | 绿色修复装甲 |
| Def_018 | 磁偏转盾 | 1×1×1 | 两侧磁极装置，中间弧形力场 | 磁场弧光明显 |
| Def_019 | 重型堡垒块 | 2×2×2 | 极厚防御块，质量感强，黑灰 | 厚重立方堡垒 |
| Def_020 | 传奇星盾 | 3×1×1 | 金蓝色大型盾面，稀有但不复杂 | 金蓝大盾图标 |

---

# 7.4 攻击部件 35 个

| ID | 名称 | 尺寸 | 模型重点 | 图标重点 |
|---|---|---|---|---|
| Atk_001 | 单管机炮 | 1×1×1 | 基础块上方短炮管，炮口方向明显 | 单炮管最醒目 |
| Atk_002 | 双联机炮 | 2×1×1 | 两根并排炮管，红黑色 | 双炮管图标 |
| Atk_003 | 三联速射炮 | 2×1×1 | 三根短炮管，旋转机炮感 | 三管炮口 |
| Atk_004 | 散射炮 | 1×1×1 | 宽口炮嘴，扇形出弹口 | 宽口散射炮 |
| Atk_005 | 重型加农炮 | 2×1×1 | 粗大炮管，后部弹仓 | 大炮管轮廓 |
| Atk_006 | 磁轨炮 | 3×1×1 | 长炮身，两条电磁轨道蓝光 | 长轨道炮明显 |
| Atk_007 | 穿透激光器 | 2×1×1 | 细长激光发射头，蓝红发光镜片 | 发光激光镜头 |
| Atk_008 | 脉冲激光器 | 1×1×1 | 短激光头，环形能量圈 | 环形激光头 |
| Atk_009 | 切割激光翼 | 2×1×1 | 侧向激光刀口，适合侧翼 | 侧向光刃形状 |
| Atk_010 | 导弹发射仓 | 2×2×1 | 多孔导弹巢，红色弹头露出 | 多孔导弹仓 |
| Atk_011 | 小型追踪导弹架 | 1×1×1 | 双发小导弹架，弹头清楚 | 两枚小导弹 |
| Atk_012 | 蜂群火箭巢 | 2×1×1 | 六孔小火箭发射器 | 六孔火箭巢 |
| Atk_013 | 鱼雷发射管 | 2×1×1 | 前向粗管，深色管口 | 粗鱼雷管 |
| Atk_014 | 闪电链模块 | 1×1×1 | 顶部双电极，紫蓝电弧 | 两极电弧图标 |
| Atk_015 | 电弧喷射器 | 2×1×1 | 前方电弧喷口，多个线圈 | 电弧喷口 |
| Atk_016 | 等离子喷口 | 1×1×1 | 短距离能量喷嘴，紫色核心 | 紫色喷嘴核心 |
| Atk_017 | 火焰等离子炮 | 2×1×1 | 橙色能量罐和喷射口 | 橙色喷火炮 |
| Atk_018 | 冰冻射线器 | 1×1×1 | 蓝白冷冻镜头，冰晶装饰简洁 | 蓝白冰冻镜头 |
| Atk_019 | 震荡波发生器 | 2×2×1 | 圆形声波/冲击环装置 | 圆环冲击器 |
| Atk_020 | 范围脉冲核心 | 2×2×1 | 方形底座上方环形脉冲发生器 | 大能量圆环 |
| Atk_021 | 浮游炮接口 | 2×1×1 | 小型无人炮挂接口，顶部停靠槽 | 浮游炮停靠槽 |
| Atk_022 | 自动炮塔 | 1×1×1 | 小炮塔可旋转底座，炮管短 | 小旋转炮塔 |
| Atk_023 | 万向轻炮塔 | 2×2×1 | 圆形旋转平台，上方双炮 | 万向炮台轮廓 |
| Atk_024 | 后置尾炮 | 1×1×1 | 后向炮管，尾部红色瞄准灯 | 向后炮口提示 |
| Atk_025 | 侧翼弹幕炮 | 2×1×1 | 横向排列多炮口，适合左右扫射 | 横排多炮口 |
| Atk_026 | 旋转飞刃发射器 | 1×1×1 | 圆形飞刃弹仓，机械但不血腥 | 圆形飞刃仓 |
| Atk_027 | 引力炮 | 2×2×1 | 黑紫色重力核心，前方环形炮口 | 黑紫环形炮 |
| Atk_028 | 黑洞弹发射器 | 2×2×1 | 深紫发光球体炮膛，稀有感 | 紫黑球形炮膛 |
| Atk_029 | 矿雷投放器 | 1×1×1 | 下挂投雷口，黄色警示块 | 小投雷口 |
| Atk_030 | 轨道轰炸标记器 | 1×1×1 | 雷达瞄准盘和红色信标 | 红色瞄准信标 |
| Atk_031 | 光矛发射器 | 3×1×1 | 长矛形能量发射器，金蓝色 | 长光矛炮身 |
| Atk_032 | 裂解射线器 | 2×1×1 | 紫色裂解晶体镜头，危险感 | 紫晶镜头 |
| Atk_033 | 子母弹仓 | 2×2×1 | 大弹仓和多个小弹孔 | 大弹仓造型 |
| Atk_034 | 反物质炮 | 3×1×1 | 黑金重炮，中心红紫能量核 | 黑金重炮图标 |
| Atk_035 | 传奇星核炮 | 3×2×1 | 大型金蓝核心炮，稀有但方块化 | 金蓝主炮，高级感 |

---

# 7.5 辅助部件 30 个

| ID | 名称 | 尺寸 | 模型重点 | 图标重点 |
|---|---|---|---|---|
| Sup_001 | 小型能源核心 | 1×1×1 | 蓝色能量罐在基础块上 | 蓝色能量罐 |
| Sup_002 | 武器增幅器 | 1×1×1 | 红蓝双环增幅装置 | 增幅光环明显 |
| Sup_003 | 冷却散热片 | 2×1×1 | 多片散热鳍片，蓝色冷却光 | 散热片轮廓 |
| Sup_004 | 磁吸收集器 | 1×1×1 | 绿色环形磁吸线圈 | 绿色磁环 |
| Sup_005 | 大型磁吸阵列 | 2×2×1 | 四个磁吸线圈组成阵列 | 四环磁阵 |
| Sup_006 | 纳米维修仓 | 2×1×1 | 绿色医疗舱和小机械臂 | 绿色维修舱 |
| Sup_007 | 小型维修臂 | 1×1×1 | 折叠机械臂，绿色灯 | 小机械臂清楚 |
| Sup_008 | 推进稳定器 | 1×1×1 | 小型蓝色喷口和稳定翼 | 蓝色推进喷口 |
| Sup_009 | 偏航控制器 | 1×1×1 | 陀螺仪圆盘，蓝白色 | 圆形陀螺仪 |
| Sup_010 | 高速推进器 | 2×1×1 | 双喷口推进模块，橙蓝尾焰小 | 双推进喷口 |
| Sup_011 | 横向推进器 | 1×1×1 | 侧向喷口清楚，方向明显 | 侧喷口图标 |
| Sup_012 | 护盾共鸣器 | 2×2×1 | 蓝色共鸣柱和护盾环 | 蓝色共鸣环 |
| Sup_013 | 弹道计算机 | 1×1×1 | 小型雷达屏/计算核心，无文字 | 小雷达计算器 |
| Sup_014 | 导弹制导器 | 1×1×1 | 小雷达盘和红色锁定灯 | 雷达盘醒目 |
| Sup_015 | 激光聚焦镜 | 1×1×1 | 透明蓝色聚焦晶体在底座上 | 蓝色镜片 |
| Sup_016 | 电弧稳定线圈 | 1×1×1 | 紫色线圈，电弧小而清晰 | 紫色线圈 |
| Sup_017 | 弹药复制器 | 2×1×1 | 小型弹药工厂模块，输送带简化 | 小弹药工厂 |
| Sup_018 | 暴击分析仪 | 1×1×1 | 红色瞄准镜和分析晶片 | 红色瞄准镜 |
| Sup_019 | 经验转化器 | 1×1×1 | 蓝绿能量漏斗吸收碎块 | 能量漏斗 |
| Sup_020 | 稀有度调谐器 | 1×1×1 | 金色调频天线和紫色核心 | 金紫调谐器 |
| Sup_021 | 部件容量扩展器 | 2×2×1 | 仓储箱式模块，多个空插槽 | 多插槽仓储块 |
| Sup_022 | 结构加固器 | 1×1×1 | 金属支架包住基础块 | 加固支架 |
| Sup_023 | 断裂保险器 | 1×1×1 | 安全锁扣和蓝色应急灯 | 锁扣明显 |
| Sup_024 | 自动回收器 | 2×1×1 | 吸入口和小型传送带 | 回收吸入口 |
| Sup_025 | 过载核心 | 1×1×1 | 红色危险能量核心，有警戒条 | 红色过载核心 |
| Sup_026 | 时间缓冲器 | 2×1×1 | 蓝紫时钟/环形缓冲装置，无数字 | 蓝紫时间环 |
| Sup_027 | 区域增幅塔 | 1×1×2 | 竖向小塔，发散蓝色能量 | 高塔增幅器 |
| Sup_028 | 全局同步器 | 2×2×1 | 中央球形同步核心，四角连线 | 同步球核心 |
| Sup_029 | 隐形扰动器 | 1×1×1 | 半透明蓝紫扰动环，底座清晰 | 半透明扰动环 |
| Sup_030 | 传奇星图仪 | 2×2×1 | 金蓝星图投影装置，像小型全息地图 | 金蓝星图投影 |

---

# 8. 每类资产的可复制批量提示词

## 8.1 批量生成链接部件提示词

```text
Create a set of 10 low-poly 3D modular spaceship connector blocks, toy brick style, grid-based 1-meter cubic units. Include cubes, long beams, T-shaped connectors, L-shaped connectors, cross platforms and large deck plates. Each block must have visible snap sockets only on connectable faces, clean beveled edges, industrial gray and blue sci-fi material, simple readable silhouettes. Show each object separately in 3/4 isometric view, plain background, game asset sheet, no text, no numbers, no logo.

negative prompt: weapons, cannons, shield plates, characters, text, logo, photorealistic, too many tiny details, organic, messy wires, background scene, blurry
```

## 8.2 批量生成防御部件提示词

```text
Create a set of 10 low-poly 3D modular spaceship defense blocks, toy brick style, each composed of a cubic base block with an extra armor or shield block mounted on top. Include armor plates, heavy shields, collision buffers, energy shield emitters, reflective armor and repair armor. Use gray metal, black armor, yellow warning stripes and blue shield glow. The top defense block must not look like a connector. Clear defensive silhouettes, 3/4 isometric view, plain background, game asset sheet, no text, no logo.

negative prompt: guns, missiles, cannons, excessive spikes, photorealistic dirt, characters, text, numbers, logo, busy background, blurry
```

## 8.3 批量生成攻击部件提示词

```text
Create a set of 10 low-poly 3D modular spaceship weapon blocks, toy brick style, each composed of a cubic base block with a clear weapon module mounted on top. Include machine cannons, double cannons, laser emitters, missile pods, railguns, lightning chain modules, plasma sprayers and pulse weapons. Each weapon must have a readable firing direction. Use red, orange, black metal and sci-fi glowing energy accents. 3/4 isometric view, plain background, game asset sheet, no text, no logo.

negative prompt: shield plates, pure connector blocks, characters, pilots, text, logo, photorealistic, overly complex, too many wires, blurry, cropped object
```

## 8.4 批量生成辅助部件提示词

```text
Create a set of 10 low-poly 3D modular spaceship support blocks, toy brick style, each composed of a cubic base block with a glowing utility module mounted on top. Include energy cores, weapon amplifiers, cooling fins, magnetic collectors, repair bays, thruster stabilizers, radar computers and shield resonators. Use blue, green and purple glow, clean sci-fi hard-surface materials, readable support function silhouettes. 3/4 isometric view, plain background, game asset sheet, no text, no logo.

negative prompt: large cannons, heavy armor shields, characters, text, numbers, logo, realistic photo, busy background, too many tiny details, blurry
```

---

# 9. 图标批量生成提示词

## 9.1 链接图标批量提示词

```text
Create 10 clean 512x512 game icons of modular spaceship connector blocks, low-poly toy brick style, 3/4 isometric view, centered, transparent background, industrial gray and blue materials, visible snap sockets, clear silhouettes, no text, no numbers, no logo, no UI frame, readable at small size.
```

## 9.2 防御图标批量提示词

```text
Create 10 clean 512x512 game icons of modular spaceship defense blocks, low-poly toy brick style, 3/4 isometric view, centered, transparent background, thick armor plates, shield emitters, gray metal, yellow warning stripes, blue shield glow, clear defensive silhouettes, no text, no numbers, no logo, no UI frame.
```

## 9.3 攻击图标批量提示词

```text
Create 10 clean 512x512 game icons of modular spaceship weapon blocks, low-poly toy brick style, 3/4 isometric view, centered, transparent background, cannons, lasers, missile pods, railguns and lightning modules, red orange and dark metal materials, clear firing direction, no text, no numbers, no logo, no UI frame.
```

## 9.4 辅助图标批量提示词

```text
Create 10 clean 512x512 game icons of modular spaceship support blocks, low-poly toy brick style, 3/4 isometric view, centered, transparent background, glowing energy cores, amplifiers, magnetic collectors, repair bays and radar modules, blue green purple sci-fi glow, clear support function silhouettes, no text, no numbers, no logo, no UI frame.
```

---

# 10. 单个部件完整示例

## 10.1 单管机炮模型提示词

```text
Create a low-poly 3D game asset of a Single Barrel Machine Cannon, a modular spaceship weapon block for a toy-brick style space survivor game. The part is based on 1-meter cubic grid units, size 1 meter long, 1 meter wide, 1 meter high. It must have a clear cubic base block and a short cannon module mounted on top. The cannon barrel points clearly forward, with a red-orange muzzle detail and dark metal casing. The base has visible snap sockets only on connectable base faces. Use clean beveled edges, colorful sci-fi hard-surface materials, simple readable silhouette, no text, no logo. Show front view, side view, top view and 3/4 isometric view on a plain background. Game-ready concept, clean low poly, not photorealistic.

negative prompt: realistic military spaceship, too many tiny details, text, numbers, logo, watermark, complex background, dirty texture, organic flesh, excessive wires, blurry, over-detailed, non-grid shape
```

## 10.2 单管机炮图标提示词

```text
Create a clean 512x512 game icon of a Single Barrel Machine Cannon modular spaceship block. 3/4 isometric view, centered, transparent background, toy brick style, clear silhouette, readable at small size, soft studio lighting, red-orange cannon muzzle, dark metal barrel, cubic base block, colorful sci-fi material. No text, no numbers, no logo, no UI frame, no watermark.

negative prompt: text, numbers, logo, watermark, character, busy background, explosion covering object, blurry, cropped object, duplicate object, card frame
```

---

# 11. 预制体制作建议

## 11.1 每个积木Prefab基础结构

```text
Prefab_Block_xxx
├── ModelRoot
│   ├── BaseBlockMesh
│   └── FunctionBlockMesh
├── ConnectorPoints
│   ├── Conn_Front
│   ├── Conn_Back
│   ├── Conn_Left
│   ├── Conn_Right
│   ├── Conn_Up
│   └── Conn_Down
├── Collision
│   ├── BaseCollider
│   └── HitCollider
├── VFXSocket
│   ├── MuzzleSocket / ShieldSocket / SupportSocket
│   └── DamageVFXSocket
├── UIData
│   ├── Icon
│   └── RarityFrameType
└── BlockConfig
```

## 11.2 攻击部件Prefab额外结构

```text
Prefab_Block_Atk_xxx
├── ModelRoot
├── ConnectorPoints
├── WeaponRoot
│   ├── Muzzle_01
│   ├── Muzzle_02
│   └── AimDirectionArrow
├── AttackRangePreview
├── Collision
└── BlockConfig_Attack
```

## 11.3 防御部件Prefab额外结构

```text
Prefab_Block_Def_xxx
├── ModelRoot
│   ├── BaseBlockMesh
│   └── ArmorBlockMesh
├── DefenseAreaPreview
├── ShieldVFXSocket
├── Collision
└── BlockConfig_Defense
```

## 11.4 辅助部件Prefab额外结构

```text
Prefab_Block_Sup_xxx
├── ModelRoot
│   ├── BaseBlockMesh
│   └── SupportBlockMesh
├── SupportAreaPreview
├── BuffLinkLineSocket
├── Collision
└── BlockConfig_Support
```

---

# 12. 导入游戏后的检查标准

## 12.1 模型检查

| 检查项 | 标准 |
|---|---|
| 尺寸 | 必须严格符合 1m 网格倍数 |
| Pivot | 建议在部件中心或基础块中心 |
| 连接点 | 必须只存在于基础块可连接面 |
| 功能块 | 攻击/防御/辅助上层块不能作为连接点 |
| 轮廓 | 缩小后仍能看懂类型 |
| 朝向 | 攻击部件必须看出发射方向 |
| 碰撞 | 碰撞盒不要超过模型太多 |
| 材质 | 同类型颜色统一 |

## 12.2 图标检查

| 检查项 | 标准 |
|---|---|
| 透明底 | 背包图标必须支持透明背景 |
| 角度 | 所有图标统一3/4等距视角 |
| 居中 | 物体在画面中心，不能裁切 |
| 可读性 | 64×64时仍能看出大类 |
| 无文字 | 图标不能有文字数字Logo |
| 稀有度 | 不要把稀有度边框画死在图标里 |
| 颜色 | 和部件类型一致 |

---

# 13. 最终落地建议

第一批制作时不要一次把100个全部做满细节，建议按下面顺序落地：

```text
第一批：核心1个 + 链接5个 + 防御5个 + 攻击8个 + 辅助5个
第二批：补足基础流派需要的常用部件
第三批：制作稀有和传奇部件
第四批：统一图标、材质、连接点和Prefab配置
```

首版最重要的是让玩家一眼看懂：

```text
这个是连接块
这个是防御块
这个是攻击块
这个是辅助块
这个炮朝哪个方向打
这个盾保护哪个方向
这个辅助影响哪些周围部件
```

只要这套视觉语言稳定，后续扩充100个、200个部件都不会乱。
