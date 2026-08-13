# Runtime Prefab Replacement Slots

## Purpose

This project supports a separate runtime replacement chain for procedural battlefields, so art/content can replace visuals without mutating the main gameplay config assets.

Primary runtime entry asset:

- `Assets/Resources/Data/RuntimeEnvironmentConfig.asset`

This asset wires together:

1. `RuntimeContentCatalog`
2. `RuntimeTerrainTheme`
3. `RuntimeSceneVisualProfile`
4. `GlobalLightingPrefab`
5. `GlobalPostProcessPrefab`
6. `ExtraEnvironmentPrefab`

## Units / Buildings / Resource Nodes

Replace these through:

- `Assets/Resources/Data/GameContentCatalog.asset`

Each `GameContentCatalogEntry` supports:

- `EntryType = Unit`, linked by `UnitData`, with `PrefabOverride`
- `EntryType = Building`, linked by `BuildingData`, with `PrefabOverride`
- `EntryType = ResourceNode`, linked by `ResourceType`, with `PrefabOverride`

Runtime lookup priority:

1. `RuntimeEnvironmentConfig.RuntimeContentCatalog`
2. fallback `Resources/Data/GameContentCatalog`
3. prefab already referenced by the original gameplay data

## Terrain Material / Terrain Layers

Replace these through:

- `Assets/Resources/Data/RuntimeTerrainTheme.asset`

Ordered slots:

1. `PlainLayer`
2. `GrassLayer`
3. `HillRockLayer`
4. `RampDirtLayer`
5. `WaterbedLayer`
6. `OreBodyLayer`
7. `SandLayer`
8. `SnowLayer`
9. `SacredLayer`

Optional:

- `TerrainMaterialTemplate`

The default generator creates a URP terrain material and nine default terrain layers under:

- `Assets/Resources/Generated/RuntimeEnvironment/Materials/`
- `Assets/Resources/Generated/RuntimeEnvironment/Terrain/`
- `Assets/Resources/Generated/RuntimeEnvironment/Textures/`

## Lighting / Post Process / Atmosphere

Replace these through:

- `RuntimeEnvironmentConfig.GlobalLightingPrefab`
- `RuntimeEnvironmentConfig.GlobalPostProcessPrefab`
- `RuntimeEnvironmentConfig.ExtraEnvironmentPrefab`

Default generated prefabs:

- `Assets/Resources/Generated/RuntimeEnvironment/Prefabs/Lighting/RuntimeGlobalLighting.prefab`
- `Assets/Resources/Generated/RuntimeEnvironment/Prefabs/PostProcess/RuntimeGlobalPostProcess.prefab`
- `Assets/Resources/Generated/RuntimeEnvironment/Prefabs/Environment/RuntimeBattleAtmosphere.prefab`

## URP Baseline

`Assets/Resources/Data/RuntimeSceneVisualProfile.asset` controls:

- main light rotation/color/intensity/shadows
- ambient trilight colors
- fog mode, density, color
- bloom threshold/intensity
- color adjustments exposure/contrast/saturation
- tonemapping
- vignette intensity/smoothness
- terrain/object polish strengths

Default editable material baselines:

- `Assets/Resources/Generated/RuntimeEnvironment/Materials/RuntimeTerrain_URP_TerrainLit.mat`
- `Assets/Resources/Generated/RuntimeEnvironment/Materials/RuntimeBuilding_URP_Lit.mat`
- `Assets/Resources/Generated/RuntimeEnvironment/Materials/RuntimeUnit_URP_Lit.mat`
- `Assets/Resources/Generated/RuntimeEnvironment/Materials/RuntimeResource_URP_Lit.mat`

Recommended usage:

- terrain: `Universal Render Pipeline/Terrain/Lit`
- buildings: `Universal Render Pipeline/Lit`
- units: `Universal Render Pipeline/Lit`
- resources: `Universal Render Pipeline/Lit`, with selective emission only for premium nodes

## Workflow

Suggested workflow:

1. Keep the main config assets unchanged.
2. Generate or duplicate the runtime environment assets.
3. Replace unit/building/resource prefabs through catalog entries.
4. Replace terrain materials and terrain layers through `RuntimeTerrainTheme.asset`.
5. Replace lighting and post-process through the three prefab slots in `RuntimeEnvironmentConfig.asset`.
6. Tune final scene look through `RuntimeSceneVisualProfile.asset`.

## Generator Entry

Menu:

- `Tools/RTS/Generate Runtime Environment Assets`

Batch method:

- `RTSGame.Editor.RuntimeEnvironmentAssetGenerator.GenerateDefaultRuntimeAssetsBatch`
