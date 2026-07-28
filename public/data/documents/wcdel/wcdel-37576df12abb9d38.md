# Save Restore And Loading Overlay Sync

## Goal

Extend the MVP menu/save flow so loading a save slot can restore actual world position and respawn context instead of only jumping back to the configured starting region, and add a lightweight loading-transition overlay for main menu flow feedback.

## Scope

- Extended `SaveSlotData` with:
  - stored player world position
  - stored respawn point id
  - stored respawn world position
- Extended `PlayerRespawnController` with:
  - current respawn position read access
  - runtime spawn-state restore API for save-load recovery
- Extended `LocalSaveSlotService` with `SaveCurrentSessionToSlot(...)` so current runtime data can be serialized together with player position and respawn context.
- Extended `GameBootstrapper` with:
  - `TrySaveCurrentSessionToSlot(int slotIndex, out string error)`
  - post-load player world-state restore
  - loading overlay show/hide integration during new game and load game flows
- Added `LoadingOverlayPresenter` as a minimal loading-state screen-space overlay.
- Extended `FoundationAssetUtility` so the starter test slice auto-creates `Canvas_Loading` and `LoadingOverlay`.

## Current Behavior

- New game and load game now show a loading overlay before entering gameplay.
- Save data structure now supports restoring the player to the stored world position instead of only the bootstrap region origin flow.
- Respawn context is also restored, so follow-up deaths can still use the correct active respawn location after a load.
- The runtime now has a direct helper to serialize the current session back into a chosen slot.

## Boundaries

- Loading still re-enters the configured world slice and then reapplies saved position, rather than loading a fully different scene file by name.
- There is not yet a full in-menu “Save Game” page wired to `TrySaveCurrentSessionToSlot(...)`; the runtime save API is present for the next slice.
- Loading overlay is intentionally minimal and text-based; it is not yet the final art-authored loading screen system.

## Next Suggestions

1. Add direct save buttons into backend menu or dedicated save screen UI.
2. Persist scene id / scene name once the project splits into multiple real gameplay scenes.
3. Add fade timing, tips, icon animation and failure recovery into the loading overlay flow.
