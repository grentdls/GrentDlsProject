# UI Prefab Framework Sync

## Goal

Move the current MVP UI stack away from runtime hierarchy construction and into prefab-authored UGUI structure, so layout, size, placeholder art and panel composition can be adjusted in Unity without changing code.

## Scope

- Added editor-side `UiPrefabFactory` to generate placeholder UI prefabs under `Assets/Game/UI/Prefabs/Generated`.
- Converted the main runtime UI entry points to prefab-based scene instances:
  - `CombatCanvasHUD`
  - `BackendMenuHUD`
  - `WorldInteractionOverlay`
  - `MainMenuHUD`
  - `LoadingOverlay`
- Refactored presenters so they now:
  - cache serialized / path-based references
  - bind buttons
  - refresh runtime text and state
  - no longer create layout nodes, sizes or panel visuals in code
- Updated `FoundationAssetUtility` so `Setup Starter Test Slice` ensures UI prefabs exist, then instantiates them into each canvas safe area root.

## Structure

### Root Prefabs

- `UIRoot_CombatCanvasHUD.prefab`
- `UIRoot_BackendMenuHUD.prefab`
- `UIRoot_WorldInteractionOverlay.prefab`
- `UIRoot_MainMenuHUD.prefab`
- `UIRoot_LoadingOverlay.prefab`

### Module Prefabs

- Combat HUD modules:
  - player card
  - quest tracker
  - combat cluster
  - warning node
- Backend menu modules:
  - top bar
  - tab column
  - content panel
  - bottom hint bar
  - character page
  - equipment page
  - skill page
  - quest page
  - map page
  - settings page
- Main menu modules:
  - left panel
  - right panel
  - bottom bar
- Interaction / loading modules:
  - dialog panel
  - loading main panel

## Current Behavior

- UI visual parameters now primarily live in generated prefab assets instead of presenter code.
- Presenters still keep the existing MVP gameplay behavior and refresh logic.
- Placeholder panel sizes, colors and button arrangement are authored once in prefab generation output and can be tuned in Unity afterward.
- Generated root prefabs now also write the main presenter reference fields up front, so runtime refresh relies less on hierarchy-path fallback.
- Backend menu content is now page-module based: each main tab owns its own page node under `Pages/`, so layout adjustments can happen page by page in prefab.
- Combat skill panel generation now upgrades the old vertical debug button list into a centered bottom skill bar:
  - the skill module anchor moves from bottom-right to bottom-center
  - the main row is a horizontal 4-slot skill bar
  - each skill card owns a large icon area, bottom name label, mana / cooldown info and cooldown mask
  - attack, dodge and interaction are reduced to a smaller utility cluster so the skills remain the visual priority
- The centered skill bar was further refined for prefab-side authoring:
  - skill cards are widened slightly so the bottom information row breathes better on both PC and mobile
  - each card now includes a dedicated meta frame for mana / cooldown text, instead of stacking all footer text directly on the panel background
  - presenter bindings now explicitly target `Cost`, `StateTag` and `CooldownMask` nodes so regenerated prefabs and runtime references stay aligned
  - combat HUD modernization checks now validate the bottom-center skill structure itself, avoiding false positives from older root layouts
- The combat HUD runtime presenter was also cleaned up to match the new prefab structure:
  - skill labels now focus on skill names, while status and cooldown detail are split across the meta row, state tag and cooldown overlay
  - skill states now consistently cover unassigned, casting, cooldown, low mana, global cooldown, ready and unavailable
  - the combat HUD no longer depends on the older garbled Chinese literals that had accumulated during prior iterations
- The backend skill page is now also aligned with the new skill panel prefab layout:
  - the page uses a dedicated multi-panel structure instead of a single placeholder text block
  - the left column now hosts a skill tree summary area and a skill bag grid
  - the right column now hosts the active skill detail view, damage info and upgrade status summary
  - the bottom bar now mirrors the currently equipped attack / skill 1~4 / ultimate layout as prefab-authored cards
  - runtime code only binds data and selection state; card size, hierarchy, spacing and placeholder visuals remain prefab-owned
- `EnsureAllUiPrefabs` now detects old generated combat HUD prefabs and rebuilds them when the skill panel structure is outdated.
- Added explicit editor menu entries:
  - `Tools/WCDEL/UI/Generate Generated UI Prefabs`
  - `Tools/WCDEL/UI/Rebuild Generated UI Prefabs`
  - `Tools/WCDEL/UI/Rebuild Generated UI/All`
  - `Tools/WCDEL/UI/Rebuild Generated UI/Combat`
  - `Tools/WCDEL/UI/Rebuild Generated UI/Backend`
  - `Tools/WCDEL/UI/Rebuild Generated UI/Interaction`
  - `Tools/WCDEL/UI/Rebuild Generated UI/Loading`
  - `Tools/WCDEL/UI/Rebuild Generated UI/Main Menu`
  - `Tools/WCDEL/UI/Rebuild Selected Generated Prefab`
  - `Tools/WCDEL/UI/Sync Override Structure/All`
  - `Tools/WCDEL/UI/Sync Override Structure/Combat`
  - `Tools/WCDEL/UI/Sync Override Structure/Backend`
  - `Tools/WCDEL/UI/Sync Override Structure/Interaction`
  - `Tools/WCDEL/UI/Sync Override Structure/Loading`
  - `Tools/WCDEL/UI/Sync Override Structure/Main Menu`
  - `Tools/WCDEL/UI/Sync Selected Generated Prefab Into Overrides`
  - `Tools/WCDEL/UI/Create Recommended Override Variants`
  - `Tools/WCDEL/UI/Create All Override Variants`
  - `Tools/WCDEL/UI/Create Override Variant From Selected Generated Prefab`

## Override Workflow

- Do not keep long-term manual layout edits in `Assets/Game/UI/Prefabs/Generated`.
- Keep hand-tuned size, anchor, offset and visual adjustments in `Assets/Game/UI/Prefabs/Overrides`.
- Runtime prefab loading now prefers an override prefab with the same file name and falls back to `Generated` only when no override exists.
- Nested backend/menu UI modules also follow the same override-first resolution, so page-level manual tuning can stay local to the affected prefab.
- The project now keeps a complete one-to-one override layer for the current generated UI set, so every generated prefab already has a same-name editable variant under `Overrides`.
- Generated prefab rebuilds now overwrite the same asset path in place instead of deleting and recreating the prefab asset first.
- Because the generated asset identity stays stable, existing override variants keep their prefab-variant inheritance source and can continue to absorb newly added generated child nodes or serialized structure.
- Scene instances also need to point at the override-preferring prefab sources. Older scenes created before the override workflow may still keep saved scene instances whose prefab source is the generated asset.
- Recommended current workflow:
  1. Run `Tools/WCDEL/UI/Create All Override Variants` once so every generated UI prefab gets a matching long-term editable variant.
  2. If you only want the most common hand-tuned pages first, `Create Recommended Override Variants` remains available as a lighter entry point.
  3. If you only need one specific prefab, select it under `Generated` and run `Create Override Variant From Selected Generated Prefab`.
  4. Edit only the prefab under `Overrides`. Long-term manual size, anchor, position and art adjustments should not be kept in `Generated`.
  5. When only one gameplay surface changed, prefer `Rebuild Generated UI/<Group>` or `Rebuild Selected Generated Prefab` instead of rebuilding everything.
  6. When the goal is only to let existing override variants inherit newly added generated nodes, bindings or layout structure, prefer `Sync Override Structure/<Group>` or `Sync Selected Generated Prefab Into Overrides`.
  7. Use the rebuild menus when the generated base layout itself needs to be refreshed more broadly; use the sync menus when the base prefab gained new structure but the override layout should remain the primary editable surface.
  8. Continue keeping all hand-tuned anchors, sizes, offsets and art swaps inside `Overrides`.
  9. If a scene still appears to use generated UI after overrides exist, run `Tools/WCDEL/UI/Refresh Current Scene UI Instances To Overrides` to rebind the current scene's saved UI root instances.
  10. Entering Play Mode now also performs a current-scene UI override refresh pass automatically, so existing UI root instances are less likely to stay pinned to older generated prefab sources.

## Boundaries

- Placeholder visuals are still simple color blocks and text labels, not final art.
- The current generator creates a usable starting point, but later hand-authored prefab edits are expected.
- Some presenters still resolve references by hierarchy path as a safety fallback for older scenes or partially edited prefabs; the intended primary path is prefab-owned serialized references.
- The current key binding UI is a visible configuration summary and entry point; full Input System runtime rebinding and persistence is still reserved for a later input-settings pass.

## Next Suggestions

1. Replace generated placeholder colors and labels with formal sprite atlases, sliced frames and icon assets.
2. Add dedicated child presenter components per module once individual pages become more complex.
3. Gradually move fallback path lookup to explicit serialized references after Unity-side prefab authoring stabilizes.
