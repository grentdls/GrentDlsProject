# Chapter01 Encounter Layout Sync

## Goal

Push Chapter01 enemy content one step further from "definition assets are wired" to "the starter test slice reads like a Chapter01 route with grouped encounter pockets", while still staying inside the current editor-generated prototype architecture.

## Scope

- Refactored `FoundationAssetUtility` enemy setup from two isolated sample enemies into reusable encounter creation helpers.
- Added a dedicated `Chapter01_Encounters` root with grouped area parents:
  - `SouthGrass_Encounters`
  - `EastMeadow_Encounters`
  - `GrassCaveArea_Encounters`
  - `BeeField_Encounters`
  - `BossApproach_Encounters`
- Reused the current runtime controllers instead of introducing a parallel spawn system:
  - `SimpleEnemyController2D`
  - `SimpleRangedEnemyController2D`
- Bound Chapter01 enemy definitions into actual grouped placements:
  - 3 `Meadow Slime` enemies in the early south-grass route
  - 2 `Cave Bat` melee-proxy enemies around the east meadow branch
  - 2 `Cave Bat` enemies in the cave-side route section
  - 2 `Poison Bee` ranged enemies in the bee field
  - 1 `Bee Captain` elite ranged encounter on the boss approach
- Added legacy-name migration so old `SimpleEnemy` and `RangedEnemy` scene objects are renamed into the new Chapter01 grouping layout instead of being duplicated.

## Current Behavior

- Running `Tools/WCDEL/Foundation/Setup Starter Test Slice` now produces a scene with multiple Chapter01-shaped encounter pockets instead of a single melee sample and a single ranged sample.
- Scene hierarchy becomes easier to read during iteration because enemy placements are organized by route area rather than left as top-level sandbox objects.
- Every placed enemy still uses the existing definition-driven runtime hookup for HP, combat stats, move speed, detection range and attack tuning.
- `Sandbox_Combat` now opens with a wider camera, a left-side safe start area, nearby NPC/shop/shrine/quest-board objects, and a readable road zone before the first combat pocket.
- Enemy groups are pushed into route pockets instead of surrounding the player at spawn:
  - early slimes start several units to the right of the player,
  - cave bats and bees occupy mid-route branches,
  - elite and boss placements sit on the far-right approach.
- New-game and overwrite-start flows apply the sandbox layout before gameplay begins, so stale saved spawn coordinates cannot put a fresh run back into the old surrounded start.
- Loading an existing slot still restores the saved player position after the scene layout pass, preserving normal continue-game behavior.

## Boundaries

- This is still an editor-generated prototype encounter layout, not a formal spawn table, encounter manager or respawn system.
- The `Cave Bat` still uses the current melee controller as a proxy; it does not yet have a dedicated flying behavior or cave-specific attack pattern.
- The `Bee Captain` uses the current ranged controller, so elite identity is currently carried by stats, placement and color rather than new mechanics.
- Encounter placement is static and handcrafted in editor utility code, which is appropriate for the current MVP slice but not the long-term content pipeline.
- A runtime safety pass exists for `Sandbox_Combat` because active Unity editor sessions may keep scene YAML from being rewritten immediately during external batch refreshes. The source of truth should still stay aligned with `FoundationAssetUtility`.

## Next Suggestions

1. Add lightweight encounter metadata or marker components if the team wants route-specific respawn, quest gating or one-time clear state.
2. Introduce a dedicated boss arena population pass when the `Hive Guardian` runtime is ready, instead of only preparing the boss entrance route.
3. Move handcrafted positions into a compact data asset or table only when more than one map slice needs the same pattern.
4. Revisit `Cave Bat` and elite enemy behaviors once the project is ready for archetype-specific AI instead of shared MVP controllers.
