# RTS Mobile Asset Delivery Checklist Template

## Purpose

This template is used to align art, TA, animation, VFX, UI, audio, and gameplay integration for RTS runtime content delivery.

Goals:

- make outsourced or internal asset handoff predictable
- reduce back-and-forth on missing files or wrong import settings
- ensure assets can be plugged into the current runtime replacement chain without modifying core config data

Use this document as a fill-in template for each delivery batch.

---

## 1. Delivery Batch Summary

Fill this section first.

| Field | Value |
| --- | --- |
| Delivery batch name | |
| Version | |
| Delivery date | |
| Supplier / owner | |
| Content theme | |
| Target platform | Android / PC / Both |
| Unity version used for export | |
| Render pipeline | URP |
| Notes | |

---

## 2. Package Structure

Recommended package layout:

```text
DeliveryPackage/
  01_Models/
    Units/
    Buildings/
    Resources/
    Environment/
  02_Animations/
    Units/
    Buildings/
  03_Materials/
    Base/
    Variants/
    Masks/
    Textures/
  04_VFX/
    Prefabs/
    Textures/
    Flipbooks/
  05_UI/
    Icons/
    Portraits/
    Task/
  06_Audio/
    SFX/
    Voice/
  07_Documents/
    AssetList.xlsx
    Readme.md
    ChangeLog.md
```

Required deliverables:

- source FBX files
- final textures
- final materials or material assignment table
- animation clips or embedded animation FBX
- prefab assembly notes
- icon sheet or separate icons
- asset list with IDs and intended usage

---

## 3. General Delivery Rules

All delivered assets should follow these rules:

- keep file names stable after delivery
- do not overwrite gameplay config assets
- separate source files from final import files
- provide one clear owner for each batch
- use meters as world scale
- pivot and facing direction must be consistent
- avoid hidden dependencies outside the delivery package

Baseline coordinate assumptions:

- up axis: `Y+`
- forward: `Z+`
- unit scale: `1`
- world unit: `1 = 1 meter`

---

## 4. Naming Convention

Recommended names:

| Asset Type | Convention | Example |
| --- | --- | --- |
| Unit FBX | `unit_<faction>_<name>_v###.fbx` | `unit_huaxia_spearman_v003.fbx` |
| Building FBX | `build_<faction>_<name>_v###.fbx` | `build_norse_barracks_v002.fbx` |
| Resource FBX | `res_<type>_<name>_v###.fbx` | `res_gold_cluster_a_v001.fbx` |
| Animator | `ac_<name>.controller` | `ac_basic_melee.controller` |
| Animation clip | `anim_<name>_<action>.fbx` or clip name | `anim_worker_gather.fbx` |
| Material | `mat_<group>_<name>.mat` | `mat_unit_mythic.mat` |
| Texture | `tex_<group>_<name>_<usage>.png` | `tex_unit_swordsman_albedo.png` |
| Prefab | `pf_<group>_<name>.prefab` | `pf_build_defense_tower.prefab` |
| Icon | `icon_<type>_<name>.png` | `icon_skill_fireball.png` |

Avoid:

- spaces in file names
- Chinese punctuation in asset file names
- generic names like `new material`, `mesh01`, `final_final`

---

## 5. Model Delivery Checklist

### 5.1 Common Requirements

For each model, provide:

- final FBX
- triangle count
- material slot count
- texture set list
- pivot description
- scale confirmation
- collision recommendation
- LOD availability

Fill this table for every model:

| Field | Unit / Building / Resource |
| --- | --- |
| Asset ID | |
| Display name | |
| Category | |
| FBX path | |
| Triangle count | |
| Material slots | |
| Pivot location | |
| Facing direction | |
| Footprint size | |
| Collision shape | |
| LOD0 tris | |
| LOD1 tris | |
| LOD2 tris | |
| Notes | |

### 5.2 Unit-Specific Requirements

Units should additionally confirm:

- rig type: humanoid or generic
- root bone exists
- hand / weapon mount bones exist if needed
- hit point, projectile spawn point, and ground contact are clear
- team color area is reserved

Suggested extra bones or markers:

- `root`
- `spine`
- `head`
- `weapon_r`
- `weapon_l`
- `fx_cast`
- `fx_projectile`
- `hit_center`

### 5.3 Building-Specific Requirements

Buildings should additionally confirm:

- stable footprint
- spawn exit point for produced units
- optional rally point marker
- clear foundation area
- destruction or damaged variant if available

Suggested markers:

- `spawn_point`
- `rally_point`
- `fx_core`
- `fx_smoke`

### 5.4 Resource Node-Specific Requirements

Resources should additionally confirm:

- resource type mapping
- harvestable center point
- optional depletion variant
- footprint radius
- terrain blend expectation

Resource type tags:

- `Wood`
- `Gold`
- `Stone`
- `Food`
- `Divine`
- `Special`

---

## 6. Animation Delivery Checklist

If the batch includes animated units or buildings, fill this section.

### 6.1 Rig and Import

| Field | Value |
| --- | --- |
| Rig type | Humanoid / Generic |
| Avatar source | |
| Root motion required | Yes / No / Partial |
| Retarget expected | Yes / No |
| Clip source | Embedded / Separate FBX |
| Compression recommendation | |

### 6.2 Unit Animation Clip List

Fill per unit archetype.

| Clip Type | Required | Clip Name | Duration | Loop | Notes |
| --- | --- | --- | --- | --- | --- |
| Idle | Yes | | | Yes | |
| Move | Yes | | | Yes | |
| Move_Start | Optional | | | No | |
| Move_Stop | Optional | | | No | |
| Attack_A | Yes | | | No | |
| Attack_B | Optional | | | No | |
| Skill_1_Cast | Optional | | | No | |
| Skill_2_Cast | Optional | | | No | |
| Hit_Light | Yes | | | No | |
| Hit_Heavy | Optional | | | No | |
| Death_A | Yes | | | No | |
| Spawn | Recommended | | | No | |
| Gather | Worker only | | | Yes | |
| Build | Worker only | | | Yes | |
| Repair | Worker only | | | Yes | |
| Carry | Worker only | | | Yes | |
| Fly_Idle | Flying only | | | Yes | |
| Fly_Move | Flying only | | | Yes | |
| Fly_Attack | Flying only | | | No | |
| Fire / Aim / Recoil | Siege only | | | Mixed | |

### 6.3 Building Animation Clip List

| Clip Type | Required | Clip Name | Duration | Loop | Notes |
| --- | --- | --- | --- | --- | --- |
| Idle | Yes | | | Yes | |
| Produce_Start | Recommended | | | No | |
| Produce_Loop | Recommended | | | Yes | |
| Produce_End | Recommended | | | No | |
| Spawn_Pulse | Recommended | | | No | |
| Upgrade | Optional | | | No | |
| Damage | Optional | | | Yes | |
| Destroyed | Optional | | | No | |

### 6.4 Animation Event Table

For clips tied to gameplay, fill this explicitly.

| Asset ID | Clip Name | Event Name | Normalized Time / Seconds | Purpose |
| --- | --- | --- | --- | --- |
| | | `OnEffectFire` | | Apply skill effect |
| | | `OnProjectileSpawn` | | Spawn projectile |
| | | `OnDashStart` | | Start dash |
| | | `OnDashHit` | | Deal dash hit |
| | | `OnRecoverStart` | | Allow recovery logic |
| | | `OnAnimEnd` | | End action |

Current runtime can map to these event names:

- `OnEffectFire`
- `OnProjectileSpawn`
- `OnDashStart`
- `OnDashHit`
- `OnRecoverStart`
- `OnAnimEnd`

If real animation events are not embedded yet, the delivery must provide timing values in a sheet.

---

## 7. Material and Shader Delivery Checklist

For each material family, provide:

- shader target
- base color intent
- metallic and smoothness intent
- normal map
- mask map if used
- emission usage
- team color area
- damage crack mask if used
- upgrade edge or rim mask if used

### 7.1 Unit Materials

| Field | Value |
| --- | --- |
| Asset group | |
| Base material path | |
| Shader | URP/Lit or custom |
| Team color supported | Yes / No |
| Damage crack mask | Yes / No |
| Upgrade edge mask | Yes / No |
| Mythic pulse support | Yes / No |
| Notes | |

### 7.2 Building Materials

| Field | Value |
| --- | --- |
| Asset group | |
| Base material path | |
| Shader | URP/Lit or custom |
| Economy / Defensive / Mythic variant | |
| Damage crack mask | Yes / No |
| Upgrade glow mask | Yes / No |
| Emissive windows / core | Yes / No |
| Notes | |

### 7.3 Resource Materials

Current runtime replacement path supports these default buckets:

- normal resource
- gold resource
- divine resource

Fill this table:

| Resource Type | Material Path | Shader | Emission | Notes |
| --- | --- | --- | --- | --- |
| Normal | | | | |
| Gold | | | | |
| Divine | | | | |

Texture naming recommendation:

- `albedo`
- `normal`
- `mask`
- `emission`
- `crack_mask`
- `upgrade_mask`

---

## 8. VFX Delivery Checklist

For each effect prefab, provide:

- prefab path
- texture list
- intended attach point
- lifetime
- looping or one-shot
- performance level

Suggested categories:

- hit impact
- attack projectile
- skill cast
- summon spawn
- building production
- building upgrade
- resource glow
- divine aura

Fill this table:

| Effect ID | Prefab Path | Use Case | Attach Bone / World | Loop | Max Lifetime | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

---

## 9. UI Delivery Checklist

For each UI batch, provide:

- square icon size
- transparent background
- atlas or individual sprites
- normal / disabled / selected style if applicable
- task or mission icon variants if applicable

Fill this table:

| UI Asset Type | ID | File Path | Size | Style Notes |
| --- | --- | --- | --- | --- |
| Unit icon | | | | |
| Building icon | | | | |
| Skill icon | | | | |
| Resource icon | | | | |
| Task icon | | | | |
| Portrait | | | | |

---

## 10. Audio Delivery Checklist

If audio is included:

| Audio Type | ID | File Path | Duration | Loop | Notes |
| --- | --- | --- | --- | --- | --- |
| Unit select | | | | | |
| Unit move | | | | | |
| Attack | | | | | |
| Skill | | | | | |
| Building complete | | | | | |
| Resource gather | | | | | |
| UI click | | | | | |

Recommended format:

- `wav` for source
- `ogg` for runtime compressed delivery if needed

---

## 11. Lighting and Post-Process Delivery Checklist

If the batch includes scene mood assets, provide:

| Asset Type | Prefab / Asset Path | Purpose | Notes |
| --- | --- | --- | --- |
| Global lighting prefab | | RuntimeEnvironmentConfig slot | |
| Global post-process prefab | | RuntimeEnvironmentConfig slot | |
| Extra environment prefab | | RuntimeEnvironmentConfig slot | |
| Skybox material | | Optional | |
| Fog profile | | Optional | |

This project already supports runtime scene slots for:

- lighting prefab
- post-process prefab
- extra environment prefab

These can be swapped without modifying main gameplay config assets.

---

## 12. Runtime Integration Mapping

Use this section to tell engineering exactly where the asset should be connected.

| Delivery Content | Runtime Entry Point | Expected Action |
| --- | --- | --- |
| Unit prefab | `GameContentCatalog` | map `UnitData -> PrefabOverride` |
| Building prefab | `GameContentCatalog` | map `BuildingData -> PrefabOverride` |
| Resource prefab | `GameContentCatalog` | map `ResourceType -> PrefabOverride` |
| Terrain layers / terrain material | `RuntimeTerrainTheme` | replace terrain visual slots |
| Lighting prefab | `RuntimeEnvironmentConfig` | assign `GlobalLightingPrefab` |
| Post-process prefab | `RuntimeEnvironmentConfig` | assign `GlobalPostProcessPrefab` |
| Atmosphere prefab | `RuntimeEnvironmentConfig` | assign `ExtraEnvironmentPrefab` |
| Scene visual tuning | `RuntimeSceneVisualProfile` | update light, fog, bloom, grading |
| Unit / building / resource materials | `RuntimeEntityVisualProfile` | update base materials and overlays |
| Animation profile | `UnitAnimationProfileData` | bind animator states and action clips |

Important rule:

- do not directly modify original `UnitData`, `BuildingData`, faction tech trees, or core game config unless explicitly requested

---

## 13. Performance Budget Checklist

Use one row per category.

| Category | High End Budget | Mid Budget | Low Budget | Actual |
| --- | --- | --- | --- | --- |
| Basic unit tris | | | | |
| Elite unit tris | | | | |
| Mythic unit tris | | | | |
| Building tris | | | | |
| Resource node tris | | | | |
| Skinned material count | | | | |
| Texture size | | | | |
| VFX particle count | | | | |

Recommended mobile-first guidance:

- units: keep material count low
- buildings: prefer large readable forms over micro detail
- resources: prioritize silhouette and material contrast
- VFX: keep battlefield readable

---

## 14. Acceptance Checklist

Mark all before handoff is considered complete.

- all files open correctly in Unity
- no missing material references
- no missing textures
- scale is correct in scene
- pivot and facing direction are correct
- animations import correctly
- animation clip names are stable
- event timing sheet is included
- prefab assembly notes are included
- icon pack is included
- performance budget is documented
- ownership and version are documented

---

## 15. Asset Handoff Form

Copy this block for each delivered gameplay asset.

```text
Asset ID:
Display Name:
Category:
Faction / Theme:
Model Path:
Prefab Path:
Animator / Animation Profile:
Primary Material:
Texture Set:
LOD:
Collision:
Sockets / Markers:
Icon Path:
VFX Links:
Audio Links:
Runtime Mapping:
Notes:
```

---

## 16. Minimum Delivery Recommendation by Asset Type

### 16.1 Prototype Unit

Minimum:

- 1 model
- 1 base material
- `Idle`, `Move`, `Attack_A`, `Hit_Light`, `Death_A`
- unit icon

### 16.2 Production Unit

Recommended:

- model with clear team color area
- tuned URP material
- complete action clips by archetype
- icon and portrait
- event timing sheet
- optional hit / cast VFX

### 16.3 Prototype Building

Minimum:

- 1 model
- 1 base material
- correct footprint and pivot
- spawn point marker
- icon

### 16.4 Production Building

Recommended:

- idle and production animation
- damage crack mask
- upgrade glow mask
- spawn pulse or output effect hook
- foundation-friendly base

### 16.5 Resource Node

Minimum:

- 1 model
- 1 material
- correct type mapping
- icon if exposed in UI

Recommended:

- depletion or damaged variant
- type-specific material polish
- correct terrain blending notes

---

## 17. If You Provide Unity Official Prototype Assets

These can be used for placeholder or prototype integration, but they usually do not fully cover RTS production needs.

You can hand over either:

- a Unity package already imported into the project
- FBX model files plus animation FBX files
- a ready prefab plus its animator controller

For prototype use, still provide:

- source package name
- license / usage note
- exact folder path after import
- mapping to unit archetype
- clip list and missing clips

---

## 18. Suggested First Delivery Batch

If you want to start small, recommend the first batch contains:

1. one worker unit
2. one melee unit
3. one ranged unit
4. one barracks building
5. one defense tower
6. one gold node
7. one divine node
8. one lighting prefab
9. one post-process prefab
10. matching icons

This is enough to validate:

- runtime prefab replacement
- material routing
- animation profile binding
- building production animation
- skill icon / UI hookup
- scene visual replacement

