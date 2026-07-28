# Scene And UI Split Foundation Sync

## Goal

Make the project scene and UI structure explicit:

- main menu uses its own scene
- gameplay / combat uses its own scene
- main menu UI, combat HUD UI and backend menu UI are separate prefabs with separate scene responsibilities

This avoids mixing title flow, battle HUD and backpack menu into one starter sandbox scene.

## Scope

### Scene Responsibilities

- `Assets/Game/Scenes/MainMenu.unity`
  - owns `Canvas_MainMenu`
  - owns `Canvas_Loading`
  - does not keep player, combat HUD or backend menu runtime scene content
- `Assets/Game/Scenes/Sandbox_Combat.unity`
  - owns player, enemy, encounter and interaction test content
  - owns `Canvas_BattleHUD`
  - owns `Canvas_Menu`
  - owns `Canvas_Interaction`
  - can also keep `Canvas_Loading`
  - does not keep `Canvas_MainMenu`

### UI Prefab Responsibilities

- `UIRoot_MainMenuHUD.prefab`
  - only serves the main menu scene
- `UIRoot_CombatCanvasHUD.prefab`
  - only serves gameplay / combat scenes
- `UIRoot_BackendMenuHUD.prefab`
  - only serves gameplay / combat scenes as the backpack / pause / backend menu layer
- `UIRoot_WorldInteractionOverlay.prefab`
  - only serves gameplay / combat scenes
- `UIRoot_LoadingOverlay.prefab`
  - shared transition overlay that can exist in both scene types

### Editor Scene Setup Entry Points

Added explicit editor menu flows:

- `Tools/WCDEL/Foundation/Create Or Open MainMenu Scene`
- `Tools/WCDEL/Foundation/Create Or Open Sandbox Combat Scene`
- `Tools/WCDEL/Foundation/Sync Core Scenes To Build Settings`

These setup flows now enforce scene-specific UI roots instead of placing every UI layer into every test scene.

### Bootstrap Scene Flow

`GameBootstrapConfig` now stores:

- `MainMenuScenePath`
- `CombatScenePath`

`GameBootstrapper` now resolves gameplay scene loading through:

1. `StartingRegion.ScenePath` when present
2. fallback `CombatScenePath`

When starting a new game or loading a save, the bootstrapper loads the gameplay scene first, then applies runtime session data.

On boot, if the session is in `MainMenu`, the bootstrapper now also attempts to enter the configured main menu scene automatically.

## Current Behavior

- The main menu can live in a clean standalone scene.
- Gameplay / combat can live in a clean standalone scene.
- Main menu UI prefab is no longer treated as part of the battle sandbox layout.
- Combat HUD and backend menu are treated as in-game UI only.
- Loading overlay remains reusable across both flows.
- Core scenes can be pushed into Build Settings with one editor action instead of being left to manual setup.

## Boundaries

- This change establishes structure and editor setup flow, not a complete production scene-loading framework yet.
- Build Settings still need the relevant scenes included for runtime loading to work outside editor-only scene setup.
- The new sync menu helps with Build Settings, but more robust validation can still be added later.
- Current gameplay scene is still the existing sandbox / chapter test slice, not the final overworld and dungeon scene graph.

## Next Suggestions

1. Add a dedicated runtime scene-flow service for menu -> loading -> gameplay transitions.
2. Add Build Settings validation so missing `MainMenu` / `Sandbox_Combat` scenes are reported early.
3. Split overworld, town and dungeon into additional runtime scenes after the current combat sandbox stabilizes.
