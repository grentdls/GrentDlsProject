# Minimap Worldmap System Sync

## Goal

Implement the first runnable minimap and world map MVP aligned with `Docs/minimap_worldmap_system_design.md`, while reusing the current runtime architecture instead of building a separate map stack.

## Scope

- Extended `MapRuntimeData` with:
  - discovered point-of-interest ids
  - tracked map target id / label / world position
  - custom map marker runtime data
- Extended `GameSession` with lightweight map-facing helpers for:
  - POI discovery
  - map target tracking / clearing
  - custom marker add / remove
- Added `MapPointRegistry2D` as a shared runtime query layer for:
  - map bounds
  - terrain zone snapshots
  - player / quest / teleport / respawn / region / shop / quest board / chest / custom marker points
- Added small read-only world hooks so the shared map layer can inspect existing world content without changing interaction behavior:
  - `TeleportPoint2D`
  - `RespawnPoint2D`
  - `RegionTrigger2D`
  - `CameraBoundsTrigger2D`
  - `WorldInteractableBase2D`

## Combat HUD

- Upgraded `CombatCanvasHudPresenter` with a runtime-built minimap panel on the combat HUD top-right stack.
- The minimap now shows:
  - player position
  - tracked quest point
  - activated teleports
  - respawn points
  - shops / quest boards / chests / custom markers
  - terrain blocks using current `TerrainZone2D` placement
- The minimap reuses current map bounds so the larger Chapter01 battlefield reads correctly instead of collapsing back to a tiny local view.
- Old combat HUD prefabs can still self-heal at runtime because the presenter creates missing minimap nodes if they are absent.

## Backend World Map

- Upgraded the backend map page from text-only summary into a hybrid page:
  - left side visual world map viewport
  - right side summary / detail / legend panel
  - action buttons for:
    - center on player
    - track current quest
    - track nearest activated teleport
    - add marker at player position
    - remove latest custom marker
- The page still preserves the existing backend menu presenter flow and page-switching model.

## UI Prefab Sync

- Synced the combat HUD generated prefab structure so `TopRight/MiniMap` is now part of the generated UI instead of only being created at runtime.
- Synced `UiPrefabFactory` presenter binding so generated combat HUD prefabs now wire:
  - minimap root
  - minimap title
  - minimap region
  - minimap hint
- Upgraded generated backend `MapPage` structure to include:
  - `MapViewport`
  - `TerrainLayer`
  - `PointLayer`
  - `MapSidePanel`
  - summary / detail / legend texts
  - center / track / marker action buttons
- Synced backend presenter binding so newly generated prefabs can directly drive the map page controls without relying only on runtime node creation.

## Current Behavior

- In combat, the HUD shows a live minimap with the current region label and tracked-target hint.
- In the backend menu map page, the player can:
  - inspect a broader map view
  - see terrain distribution
  - see discovered points
  - set a lightweight tracked target from quest or nearest activated teleport
  - create and remove simple runtime custom markers
- The backend map page now keeps drag and zoom inside resolved world bounds instead of letting the viewport center drift outside the playable map.
- Clicking a visible map point now selects it, recenters the view to that point, updates the tracked target, and swaps the right-side detail area from compact list mode into selected-point detail mode.
- Clicking empty map space now clears the active point selection and restores the compact map detail summary.
- The backend map side panel now includes lightweight filter buttons for:
  - all points
  - quest targets
  - travel points
  - service points
  - loot / custom markers
- The side panel now also exposes a dedicated action-state text block so older text-only detail output does not have to carry both selection details and current operation guidance in the same paragraph.
- Teleport activation now also feeds POI discovery, so map visibility and traversal unlock state are better aligned.
- Generated `MapPage` prefab no longer hard-depends on the runtime `BackendMapInputProxy` type during editor-side creation; the presenter now re-attaches and re-binds the input proxy at runtime when older generated assets or overrides are missing it.
- Older backend map overrides can now self-heal more safely because runtime map-page repair also restores missing `TerrainLayer`, `PointLayer`, side-panel texts, and action buttons instead of only creating the full page when `MapViewport` is absent.

## Boundaries

- This is still an MVP map renderer built from UI primitives, not the final authored art map.
- Backend world map filter buttons are now present, but the current MVP still uses lightweight category groupings and does not yet provide richer legend-driven multi-select filtering.
- Click-to-teleport is not fully implemented yet.
- Custom markers currently use simple runtime add/remove actions instead of a full editor-like marker management flow.
- Older prefabs can still self-heal at runtime, but rebuilding generated prefabs is now recommended so combat HUD and backend map page structure are authored in prefab assets as well.

## Next Suggestions

1. Sync the generated / override backend map page prefab structure so the new map nodes are authored directly in prefab assets instead of relying on runtime patch-up.
2. Add click hit-testing on map points so the side detail panel can switch to the selected POI instead of listing a compact text summary.
3. Add drag and zoom state persistence for the backend map page, plus category toggles for quest / teleport / marker / shop visibility.
