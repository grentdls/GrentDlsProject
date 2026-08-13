# 运行时资源替换与地形环境配置方案

## 目标

这套方案用于后续替换以下内容，同时不修改主配置资产：

- 单位预制体
- 建筑预制体
- 资源节点预制体
- 技能图标与说明
- 地形材质模板
- TerrainLayer 地表贴图层
- 光照预制体
- 后处理预制体
- 额外环境预制体

运行时只读取独立的运行时配置，不回写以下资产：

- `Assets/Resources/Data/RTSGameConfig.asset`
- 各阵营 `FactionTechTreeData`
- 原始 `UnitData`
- 原始 `BuildingData`
- 原始资源配置
- 原始地形规则配置

## 当前代码入口

当前运行时入口已经接好，统一由 `RuntimeEnvironmentConfigData` 驱动。

代码位置：

- [GameContentCatalogData.cs](/g:/TestProject/TestRTS2/Assets/Scripts/Data/GameContentCatalogData.cs)
- [ContentCatalogManager.cs](/g:/TestProject/TestRTS2/Assets/Scripts/Core/ContentCatalogManager.cs)
- [ModeMapRuntimeGenerator.cs](/g:/TestProject/TestRTS2/Assets/Scripts/Core/ModeMapRuntimeGenerator.cs)
- [GameSessionManager.cs](/g:/TestProject/TestRTS2/Assets/Scripts/Core/GameSessionManager.cs)
- [MatchSettlementUI.cs](/g:/TestProject/TestRTS2/Assets/Scripts/UI/MatchSettlementUI.cs)

## 运行时配置结构

建议只维护一个运行时总配置资产：

- `Assets/Resources/Data/RuntimeEnvironmentConfig.asset`

这个资产负责挂接四类内容：

1. `RuntimeContentCatalog`
   用于单位、建筑、资源、技能图标和说明替换。

2. `RuntimeTerrainTheme`
   用于地形材质模板和 TerrainLayer 顺序配置。

3. `GlobalLightingPrefab`
   用于整张地图的主光照、反射探针、天空盒辅助等。

4. `GlobalPostProcessPrefab`
   用于全局 Volume、Bloom、Color Adjustments、Tonemapping 等。

5. `ExtraEnvironmentPrefab`
   用于雾效、远景、天空装饰、环境音源、战场氛围物件。

## 资源替换优先级

运行时替换优先级已经固定，后续配置时只需要挂资产，不需要改代码。

优先级如下：

1. `RuntimeEnvironmentConfig.RuntimeContentCatalog`
2. 默认 `Resources/Data/GameContentCatalog`
3. 原始 `UnitData / BuildingData / Resource` 上自带的预制体

这意味着你后续要换单位或建筑外观时，只需要改运行时目录资产，不用碰主配置。

## 推荐目录结构

建议按下面方式组织资源，方便后续扩展不同平台和不同主题。

- `Assets/Resources/Data/RuntimeEnvironmentConfig.asset`
- `Assets/Resources/Data/RuntimeCatalogs/`
- `Assets/Resources/Data/RuntimeTerrainThemes/`
- `Assets/Prefabs/Runtime/Units/`
- `Assets/Prefabs/Runtime/Buildings/`
- `Assets/Prefabs/Runtime/Resources/`
- `Assets/Prefabs/Runtime/Lighting/`
- `Assets/Prefabs/Runtime/PostProcess/`
- `Assets/Prefabs/Runtime/Environment/`
- `Assets/Art/Terrain/Layers/`

## 一、单位替换方案

在 `GameContentCatalogData` 中新增 `EntryType = Unit` 条目：

- 绑定 `UnitData`
- 填入 `PrefabOverride`
- 可选填入 `Icon`
- 可选填入 `Description`
- 可选挂接 `Skills`

运行时会优先使用这个替换预制体。

推荐命名：

- `rt_unit_huaxia_jiashi.prefab`
- `rt_unit_norse_valkyrie.prefab`
- `rt_unit_egypt_sun_archer.prefab`

## 二、建筑替换方案

在 `GameContentCatalogData` 中新增 `EntryType = Building` 条目：

- 绑定 `BuildingData`
- 填入 `PrefabOverride`
- 可选填入图标与描述

推荐命名：

- `rt_build_huaxia_barracks.prefab`
- `rt_build_greek_temple.prefab`
- `rt_build_egypt_sun_tower.prefab`

## 三、资源节点替换方案

在 `GameContentCatalogData` 中新增 `EntryType = ResourceNode` 条目：

- 绑定 `ResourceType`
- 填入 `PrefabOverride`

推荐命名：

- `rt_res_wood_cluster.prefab`
- `rt_res_gold_cluster.prefab`
- `rt_res_stone_cluster.prefab`
- `rt_res_divine_node.prefab`

资源节点建议按资源类型拆预制体，不要把多种资源混在一个预制体脚本里。

## 四、技能图标与说明替换方案

在 `GameContentCatalogData` 中新增 `EntryType = Skill` 条目：

- 绑定 `SkillDefinitionData`
- 可替换 `Icon`
- 可替换 `Description`

这部分适合后续补全强力单位技能展示，不需要回头改单位本体数据。

## 五、Terrain 地形主题配置方案

当前已经支持运行时地形主题：

- `RuntimeTerrainThemeData`

代码会优先读取：

- `RuntimeEnvironmentConfig.RuntimeTerrainTheme`

如果配置了主题并且层完整，运行时 Terrain 会直接使用主题中的材质模板与 TerrainLayer。
如果没有配置，才会回退到程序生成的默认地表层。

### Terrain 主题建议包含

- `TerrainMaterialTemplate`
- `PlainLayer`
- `GrassLayer`
- `HillRockLayer`
- `RampDirtLayer`
- `WaterbedLayer`
- `OreBodyLayer`
- `SandLayer`
- `SnowLayer`
- `SacredLayer`

### TerrainLayer 顺序约定

顺序已经在运行时代码中固定，配置时必须按这一套填：

1. Plain
2. Grass
3. HillRock
4. RampDirt
5. Waterbed
6. OreBody
7. Sand
8. Snow
9. Sacred

### 材质联动规则

当前程序中资源簇和地表联动已经固定如下：

- `Wood` / `Food`
  下方偏 `Grass`

- `Gold` / `Stone` / `Iron`
  下方偏 `OreBody` 与岩地

- `DivineEssence`
  下方偏 `Sacred`

也就是说后续只要换 TerrainLayer 贴图，地图资源底材就会自动跟着换，不需要再改生成逻辑。

## 六、光照与后处理预制体方案

你要求的是“生成地形时，挂上我配置的光照和后处理预制体”，这部分已经接入。

运行时地形生成后，会自动实例化：

- `GlobalLightingPrefab`
- `GlobalPostProcessPrefab`
- `ExtraEnvironmentPrefab`

它们会被挂到运行时地图根节点下面，并且在重新开局时自动销毁重建。

### 光照预制体建议内容

- `Directional Light`
- `Reflection Probe`
- `Light Probe Group`
- Skybox 辅助组件
- 可选 APV 辅助对象

推荐命名：

- `rt_env_global_lighting_mobile.prefab`
- `rt_env_global_lighting_desktop.prefab`

### 后处理预制体建议内容

- `Global Volume`
- `Volume Profile`
- Bloom
- Color Adjustments
- Tonemapping
- Vignette

推荐命名：

- `rt_env_global_postfx_mobile.prefab`
- `rt_env_global_postfx_desktop.prefab`

### 额外环境预制体建议内容

- 雾效
- 远景山体
- 天空装饰
- 战场氛围粒子
- 环境音源

推荐命名：

- `rt_env_battle_atmosphere.prefab`
- `rt_env_far_mountains.prefab`

## 七、地形材质与资源配置建议

为了后续配表清晰，建议按“主题”和“资源功能”拆分：

### 1. 基础地表

- 平原主地表
- 草地
- 坡道泥地
- 山石地
- 河床或盆地底材
- 沙地
- 雪地
- 神圣地表

### 2. 资源覆盖逻辑

- 森林区下方使用草地/林地土壤
- 矿区下方使用矿体/碎石/裸岩
- 神性区下方使用神圣地表

### 3. 推荐配法

- 森林资源下方：`GrassLayer`
- 矿石资源下方：`OreBodyLayer`
- 盆地或低洼区：`WaterbedLayer`
- 高坡区域：`HillRockLayer`
- 坡道通行区：`RampDirtLayer`

## 八、加载界面方案

现在进入关卡卡顿，核心原因是地图、资源、建筑、单位都在同一启动阶段同步生成。

当前已经接入加载界面：

- 开始进入战局时显示
- 地形与会话对象生成完成后关闭

显示流程：

1. 显示加载遮罩
2. 等一帧让 UI 先显示出来
3. 生成地图与环境
4. 生成资源、建筑、单位和阵营
5. 再等一帧
6. 关闭加载遮罩

当前入口：

- [GameSessionManager.cs](/g:/TestProject/TestRTS2/Assets/Scripts/Core/GameSessionManager.cs)
- [MatchSettlementUI.cs](/g:/TestProject/TestRTS2/Assets/Scripts/UI/MatchSettlementUI.cs)

## 九、推荐配置流程

后续美术或配置同学按下面流程操作即可：

1. 保持主配置资产不动。
2. 新建 `RuntimeEnvironmentConfig.asset`。
3. 新建一个运行时内容目录资产，例如：
   `RuntimeCatalog_Mobile.asset`
4. 新建一个运行时地形主题资产，例如：
   `RuntimeTerrainTheme_Grassland.asset`
5. 把内容目录挂到 `RuntimeContentCatalog`。
6. 把地形主题挂到 `RuntimeTerrainTheme`。
7. 把光照预制体挂到 `GlobalLightingPrefab`。
8. 把后处理预制体挂到 `GlobalPostProcessPrefab`。
9. 把额外环境预制体挂到 `ExtraEnvironmentPrefab`。
10. 运行时由系统自动读取，不需要修改主配置文件。

## 十、平台建议

建议至少分两套运行时配置：

- `RuntimeCatalog_Mobile`
- `RuntimeCatalog_Desktop`

以及两套环境预制体：

- `rt_env_global_lighting_mobile`
- `rt_env_global_lighting_desktop`

- `rt_env_global_postfx_mobile`
- `rt_env_global_postfx_desktop`

这样后续做手机端性能降级时，只改运行时配置，不需要改主逻辑。

## 十一、当前已实现内容

当前代码已经具备这些能力：

- 运行时内容目录覆盖单位、建筑、资源预制体
- 运行时环境配置独立读取
- 运行时 Terrain 主题覆盖地形材质模板与 TerrainLayer
- 地图生成时自动挂载光照、后处理、额外环境预制体
- 进入关卡时显示加载界面，生成完成后自动关闭

## 十二、后续建议扩展

后续可以继续按这个方向扩展，但不影响现在用：

- 支持按地图 preset 切换不同地形主题
- 支持按阵营切换出生区装饰预制体
- 支持按平台切换不同后处理预制体
- 支持把桥梁、遗迹、坡道装饰也纳入运行时主题
