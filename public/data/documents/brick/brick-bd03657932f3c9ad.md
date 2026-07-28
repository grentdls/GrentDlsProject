# 太空3D积木飞船幸存者：玩家积木模型与图标首批优化提示词

用途：配合运行时程序化模型使用，用于后续AI批量生成正式模型参考图、512图标和BD卡牌图。  
统一风格：low poly 3D, modular spaceship blocks, toy brick style, clean silhouette, grid-aligned 1m cubic units, beveled cube edges, colorful sci-fi material separation, no text, no logo.

## 通用负面提示词

```text
negative prompt: realistic military spaceship, too many tiny details, dirty photorealistic texture, organic flesh, complex wires, excessive spikes, text, numbers, logo, watermark, character, pilot, busy background, blurry, over-detailed, asymmetrical broken shape, non-grid shape, cropped object, duplicated object
```

## 首批模型参考图

### Core_001 核心驾驶舱

```text
Create a low-poly 3D game asset of a compact modular spaceship core cockpit block for a toy-brick style space survivor game. Size 1 meter long, 1 meter wide, 1 meter high, based on 1m cubic grid units. White cubic hull, glowing blue cockpit window on the top-front face, small gold trim, visible snap sockets around the base, clean beveled cube edges, heroic player module, no text, no logo. Show front view, side view, top view and 3/4 isometric view on a plain background.
```

### Link_001 小型万向接头

```text
Create a modular low-poly 3D spaceship connector block, toy brick style, grid-aligned 1m cubic unit. Industrial gray cubic base, visible blue snap sockets on all connectable faces, simple mechanical docking plates, small top rail detail, clean beveled edges, no weapons, no shield plate, no large glowing core, isolated on plain background, game asset style.
```

### Link_002 长脊梁

```text
Create a low-poly 3D modular spaceship long connector beam, toy brick style, size 3 meters long, 1 meter wide, 1 meter high, based on 1m cubic grid units. Industrial gray beam with blue energy rail along the top, visible snap sockets on front, back and side faces, clean beveled cube segments, readable straight bridge silhouette, no weapons, no text, no logo.
```

### Def_001 小型装甲板

```text
Create a modular low-poly 3D spaceship defense block, toy brick style, cubic base block with an extra thick armor plate mounted on the front. Gray and dark metal armor, yellow warning stripe, beveled edges, readable defensive silhouette, the top armor block is not a connector, no cannon, no missile, no text, no logo, isolated on plain background.
```

### Def_002 局部能量盾

```text
Create a modular low-poly 3D spaceship shield defense block, toy brick style, cubic base with thick armor face and small blue shield emitter arc in front. Silver gray metal, deep blue shield glow, yellow warning stripe, clean silhouette, no weapon barrel, no text, no logo, isolated on plain background.
```

### Atk_001 单管机炮

```text
Create a low-poly 3D game asset of a Single Barrel Machine Cannon modular spaceship block. 1m cubic base block with a short forward cannon module mounted on top, clear firing direction, red-orange muzzle glow, dark metal barrel, toy brick style, beveled cube base, simple readable silhouette, no text, no logo, plain background.
```

### Atk_006 磁轨炮

```text
Create a low-poly 3D modular spaceship railgun block, toy brick style, size 3 meters long, 1 meter wide, 1 meter high. Cubic segmented base with two blue glowing electromagnetic rails, long rectangular gun spine, visible forward firing direction, red-orange dark metal material accents, clean readable silhouette, no text, no logo.
```

### Atk_010 导弹发射仓

```text
Create a modular low-poly 3D spaceship missile pod block, toy brick style, cubic base with a rectangular top missile pod and two visible tube openings facing forward. Red-orange and dark metal colors, small missile tip glow, clear firing direction, beveled cube edges, no shield plate, no text, no logo, isolated on plain background.
```

### Atk_014 闪电链模块

```text
Create a modular low-poly 3D spaceship lightning chain weapon block, toy brick style, cubic base with two short electric rods and a purple-blue energy coil on top. Clear weapon module, no heavy armor, no connector sockets on the top module, readable sci-fi electric silhouette, no text, no logo.
```

### Sup_001 小型能源核心

```text
Create a modular low-poly 3D spaceship support block, toy brick style, cubic base with a glowing blue-green energy sphere and simple rotating ring on top. It looks like a utility amplifier, not a weapon and not armor. Clean readable silhouette, beveled cube base, no text, no logo, isolated on plain background.
```

### Sup_004 磁吸收集器

```text
Create a modular low-poly 3D spaceship magnetic collector support block, toy brick style, cubic base with a green magnetic ring and small energy core on top. Blue-green sci-fi glow, clear utility function, no cannon, no armor plate, no text, no logo, 3/4 isometric game asset style.
```

### Sup_006 纳米维修仓

```text
Create a modular low-poly 3D spaceship repair bay support block, toy brick style, cubic base with a small green repair cabin and two simple mechanical arms on top. Medical green utility glow, clean readable support silhouette, no weapon barrel, no heavy shield, no text, no logo.
```

## 首批512图标提示词模板

```text
Create a clean 512x512 game icon of {part name}, a modular low-poly spaceship block. 3/4 isometric view, centered composition, transparent background, toy brick style, clear silhouette, readable at 64x64, soft studio lighting, colorful sci-fi material, no text, no numbers, no logo, no UI frame, no watermark.
```

## 当前项目内对应实现

- 运行时3D积木模型：`Assets/Scripts/BrickSurvivor/BrickSurvivorGame.Visuals.cs`
- BD卡牌和背包图标：运行时 `Texture2D + Sprite` 程序化生成，不依赖外部图片文件。
- 后续如果接入正式AI图像工具，建议优先生成上面12个首批资产，再扩展到100个BD。
