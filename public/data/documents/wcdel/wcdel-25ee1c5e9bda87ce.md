# CatQuest3 Style 2.5D Terrain Camera Sync

## Goal

Align the sandbox battlefield with the corrected Cat Quest style direction:

- gameplay logic remains simple, but presentation semantics move toward a true 3D-style ground plane
- units travel across ground `X/Z`
- `Y` is reserved for height only: jump, flying, elevation steps and authored terrain height differences
- camera uses a fixed oblique `Perspective` follow setup
- terrain should stay flat unless a region is explicitly authored with elevation difference

## What Changed

- `CurvedWorldProjector2D`
  - `Planar25D` now treats logic `X/Y` as ground-plane `X/Z`
  - presentation `Y` is height only
  - planar visual offsets are now based on flat ground placement instead of mixing logic `Y` into rendered `Y`
- `CameraFollow2D`
  - added a dedicated planar 2.5D camera presentation path
  - follow logic still tracks flat gameplay coordinates
  - rendered camera position is resolved as oblique 3D presentation space
  - camera lens now supports `Perspective`
  - exposes `ConfigurePlanar25DPresentation(...)` so runtime repair and editor generation share the same camera setup
  - exposes `ConfigurePerspectivePresentation(...)` for the fixed oblique perspective camera
  - exposes `ConfigureFollowOffset(...)` so scene-level settings can drive the initial follow offset instead of editor defaults
- `WorldPresentationSettings25D`
  - acts as the scene-level 2.5D presentation config root
  - camera follow offset, look-ahead, focus height, perspective, FOV, pitch, distance and base offset are now all configurable there
- `UnitPresentationRoot2D`
  - standardizes unit presentation hierarchy to `Visual`, `UiAnchor`, `GroundAnchor`
  - player, melee enemies, ranged enemies and flying enemies now converge on the same presentation root contract
- Added reusable ground-projected presentation helpers:
  - `GroundProjectedDecal2D`
  - `QuestGroundMarker2D`
  - `SkillGroundIndicator2D`
  - `WorldPoiGroundMarker2D`
- `CurvedWorldAnchor2D`
  - now reads shared presentation height providers
  - objects can stay upright or be rotated onto the ground plane
- `SandboxCombatSceneLayout`
  - runtime self-heal now configures the sandbox as planar 2.5D instead of old curved-only projection
  - old anchors are reconfigured in place, so existing scene content is not left on stale settings
  - terrain zones and region visuals are marked as `GroundPlane` presentation anchors
  - camera now defaults to `Perspective`
- `FoundationAssetUtility`
  - editor-side one-click generation now creates the same planar 2.5D projector and oblique camera setup
  - prevents later rebuilds from reverting the sandbox back to the older visual path
  - generated player/enemy setups now ensure the shared unit presentation root exists
  - generated player now gets a temporary projected area-skill ground ring preview
- `EnemyAttackWarningView`
  - no longer behaves as an upright 2D-only ring
  - warning circle now follows the shared ground projection path
- `CombatCanvasHudPresenter`
  - quest target UI marker still exists for readability
  - tracked quest targets now also create a true world-space projected ground ring + pillar marker
- `InteractionPromptAnchor`
  - world prompt anchor now prefers `UiAnchor` / projected presentation position instead of raw transform position
- Key world POIs now auto-join the same 2.5D marker language:
  - teleport points
  - respawn points
  - quest boards
  - shops
  - shrines
  - boss gates
- Added shared height bridge:
  - `IWorldPresentationHeightProvider`
  - `WorldPresentationHeightUtility`
- `PlayerJumpController`
  - jump height now feeds the shared presentation height path
  - visual child no longer double-applies fake vertical lift
- `FlyingEnemyPresentation2D`
  - hover height now feeds the shared presentation height path
  - flying visuals keep sway, but height is resolved through world projection
- `CurvedTerrainMesh2D`
  - terrain prototype mesh now stays on a flat ground plane by default
  - height offsets are only used as intentional surface layering, not as fake large-scale terrain slope
- World-space feedback updated to use the shared 2.5D projection height:
  - damage numbers
  - unit HUD
  - world-space bar followers

## Current Behavior

- Characters, enemies and map content still use the existing flat gameplay coordinates internally.
- Rendered placement now treats those coordinates as ground-plane travel across `X/Z`.
- The camera is now a fixed oblique `Perspective` follow camera.
- Ground regions are kept on a shared plane unless an explicit height offset is authored.
- Jumping and flying now produce meaningful presentation height for rendered placement and attached world-space feedback.
- Old sandbox scene content can still be repaired at runtime without manually rewriting scene YAML.
- Camera offset / rotation / FOV related startup behavior is now intended to be edited from `WorldPresentationSettings25D` instead of hardcoded repair values.
- Quest target markers, enemy warning rings and temporary player area-skill rings now share the same projected ground-plane presentation semantics.
- Important interaction landmarks now also get lightweight projected ground rings, so overworld readability is no longer split between old flat logic-only points and new projected battle markers.

## Marker Upgrade

- Replaced the temporary sprite-based projected ring path with a shared mesh-based projected ground marker layer.
- `GroundProjectedDecal2D` now builds a procedural ring mesh and drives a dedicated transparent marker shader instead of relying on `WarningCircleSprite`.
- Added `WorldProjectedMarker2D` as the shared higher-level presenter for:
  - projected base rings
  - projected warning/skill/quest/POI markers
  - projected vertical beams / light pillars
- Upgraded the following runtime markers to the formal mesh + shader path:
  - enemy attack warning rings
  - player area-skill ground indicators
  - tracked quest ground ring + beam
  - teleport / respawn / quest board / shop / shrine / boss gate POI markers

## Unified World Prompts

- Added `MapTrackedTargetGroundMarker2D` so backend/world-map tracked targets now also appear as unified 2.5D world-space ground markers instead of only living in minimap / map UI state.
- Added `InteractionGroundPrompt2D` so the current nearby interactable can surface a lightweight projected ground prompt using the same marker language.
- `CombatCanvasHudPresenter` now ensures the quest ground marker, map tracked target marker and interaction ground prompt all exist during combat HUD refresh.
- `FoundationAssetUtility` now injects the interaction ground prompt and map tracked target ground marker into generated sandbox content, so rebuilds keep the new 2.5D prompt chain.

## World Label Unification

- Added `ProjectedWorldLabelUi` as a reusable projected world-label presenter for on-screen 2.5D target text cards.
- Added `MapTrackedTargetLocator2D` so tracked map targets can resolve both legacy ids and the newer prefixed ids such as `quest:*`, `teleport:*`, `region:*`, `shop:*`, `questboard:*`, `chest:*`, and `custom:*`.
- `CombatCanvasHudPresenter` now creates and caches three projected label nodes:
  - `QuestWorldMarker`
  - `TrackedWorldMarker`
  - `InteractionWorldMarker`
- On-screen quest targets now use the shared projected label presenter instead of relying only on the older direct screen-space marker positioning path.
- Map tracked targets now surface both:
  - projected ground ring / beam markers
  - projected on-screen target label cards
- Nearby interactables now surface both:
  - projected ground prompt rings
  - projected on-screen interaction label cards
- Off-screen quest guidance still keeps the existing edge-arrow behavior so direction readability is preserved while on-screen targets move toward the unified 2.5D prompt language.

## Still Pending

- Terrain visuals are still prototype meshes and placeholder zone visuals, not final authored chunk art.
- Some legacy HUD references for the old quest marker panel still remain in the presenter as compatibility fallback fields, even though the active on-screen world target display path is now routed through `ProjectedWorldLabelUi`.
- The underlying gameplay simulation is still 2D-oriented, so authored terrain height differences and true multi-level collision have not been introduced yet.

## Verification

- `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`

## Next Suggestions

1. Replace placeholder terrain blocks with authored floor mesh chunks or floor card groups.
2. Add dedicated height-aware anchors for quest targets, interaction prompts and boss markers.
3. Convert skill ground indicators and warning rings to true 2.5D floor projection meshes.
4. If needed, add authored elevation layers so only designated cliffs, ramps or islands use non-zero ground height.
