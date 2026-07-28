# Main Menu And Home MVP Sync

## Goal

Add a reusable main menu / home screen foundation so the prototype no longer boots only into world gameplay, and can support title, continue, new game, load, settings, credits and quit flows inside the existing bootstrap architecture.

## Scope

- Added `MainMenuCanvasPresenter` as a lightweight screen-space main menu presenter.
- Added a simple page state flow:
  - `Title`
  - `Home`
  - `SaveSlots`
  - `Settings`
  - `Credits`
  - `ConfirmQuit`
  - `Message`
- Added `LocalSaveSlotService` as an MVP local slot-based save service using `Application.persistentDataPath`.
- Added `SaveSlotData` and `SaveSlotMetadata` runtime data models for local slot summaries and full slot payloads.
- Extended `GameBootstrapper` with:
  - shared local save service creation
  - `TryStartNewGame(int slotIndex, out string error)`
  - `TryLoadGameFromSlot(int slotIndex, out string error)`
- Updated startup flow so the project can enter `GameFlowState.MainMenu` first and let the player choose how to proceed.
- Extended `FoundationAssetUtility` so `Setup Starter Test Slice` also auto-creates `Canvas_MainMenu` and `MainMenuHUD`.
- Added a lightweight player-control guard so player movement and combat input stop while the session is in `MainMenu`.

## Current Behavior

- On boot, the project now has a real main menu UI layer instead of only relying on gameplay state.
- The presenter now defaults to the actionable `Home` page on first boot, so test users can immediately reach `New Game / Load / Settings` instead of stopping on a passive title prompt.
- Title screen can transition into the main home page.
- Home page supports:
  - continue latest save
  - start new game through slot selection
  - load existing save
  - open settings placeholder
  - open credits placeholder
  - open quit confirmation
- Save slot page currently supports 3 local slots.
- Save slot page now uses a clearer two-step interaction:
  - first select a slot
  - then press the left action button to `Start New Game` or `Enter Game`
- When `Start New Game` targets a slot that already has save data, the menu now enters an overwrite-confirmation step before replacing the old record.
- New game writes a fresh slot payload and immediately enters gameplay.
- Continue and load both read local slot data and enter gameplay if load succeeds.
- If load or save fails, the menu falls back to a message page instead of silently failing.

## Boundaries

- This is an MVP local save-slot skeleton, not the final production save/archive system.
- Slot payload currently focuses on player runtime data and map runtime data; scene-position restore, playtime accumulation and richer settings persistence are not finalized yet.
- Settings page is still a text placeholder and does not yet write audio, graphics or control configuration.
- Main menu still uses runtime-generated UGUI hierarchy rather than final art-authored prefabs and animated scene composition.
- Loading currently re-enters the configured starting region and reapplies runtime data, instead of restoring the exact saved scene and transform.
- Runtime region triggers now ignore the player while the session is still in `GameFlowState.MainMenu`, preventing the starter slice from immediately forcing the flow out of the menu before the player explicitly starts the game.
- Main menu and gameplay scene paths must stay present in `ProjectSettings/EditorBuildSettings.asset`; otherwise both `New Game` and overwrite-confirmed slot creation will fail before entering gameplay.

## 2026-05-17 Fix Note

Fixed a regression where creating a new record or confirming overwrite from the main menu could fail because `Assets/Game/Scenes/MainMenu.unity` and `Assets/Game/Scenes/Sandbox_Combat.unity` were no longer listed in Build Settings.

Current expectation:

- `MainMenu` is included in Build Settings
- `Sandbox_Combat` is included in Build Settings
- `GameBootstrapper.TryStartNewGame(...)` can pass its gameplay-scene availability check and proceed into gameplay

## Next Suggestions

1. Add real save-position restore and a dedicated loading transition presenter.
2. Split save-slot selection into dedicated create / overwrite / load / delete interaction flows.
3. Add persistent settings data for display, audio and control pages from the same bootstrap layer.
4. Add title-screen input shortcuts for keyboard and gamepad focus navigation.
