# Chapter01 Quest Boss Completion Sync

## Goal

Close the Chapter01 playable loop by connecting combat kill reporting, quest progression, boss rewards, and the notice-board follow-up flow without replacing the current lightweight architecture.

## Scope

- Added `QuestObjectiveType.DefeatEnemy` so active quests can now progress from enemy kills.
- Extended `QuestEventRouter` and enemy runtime controllers so defeating Chapter01 enemies can report objective progress through the existing `GameSession` path.
- Added a death event to `Health` so battle-side systems can react to confirmed kills without polling.
- Upgraded `QuestBoardInteractable2D` from a single fixed quest entry to an ordered quest list that resolves the next relevant quest based on active and claimed state.
- Added generated Chapter01 follow-up main quests:
  - `quest_ch01_hive_guardian_hunt`
  - `quest_ch01_forest_road`
- Added boss reward chest and trophy pickup objects to the starter slice, and gated them behind Hive Guardian defeat with `BossRewardUnlock2D`.
- Extended `RewardChestInteractable2D` so specific reward chests can grant the next quest and present custom chapter messaging.

## Current Behavior

- The notice board can now move the player through a small Chapter01 chain instead of only offering the original glow-herb quest.
- Defeating `Hive Guardian` can complete the new boss-hunt objective because the enemy definition kill now reports into `GameSession`.
- The boss reward chest and follow-up trophy stay hidden until the Hive Guardian is gone.
- Claiming the boss reward chest can seed the chapter-closing quest, and collecting the trophy can show a “route unlocked” style completion prompt before the player returns to the notice board.

## Boundaries

- This is still a compact MVP chain, not a full 9-main-quest import from the content package.
- Quest chaining is currently driven by ordered board data, not by a formal prerequisite graph.
- Boss rewards currently use lightweight world interactables instead of a dedicated chapter-complete screen, inventory reward list, or ability-unlock system.
- The unlock gate currently infers boss defeat from quest state or boss absence in scene, which is acceptable for the generated prototype slice but not yet a full boss-state persistence system.

## Next Suggestions

1. Replace ordered-board progression with explicit prerequisite / next-quest data once more of Chapter01 is imported.
2. Convert the boss reward trophy into a formal ability unlock that can affect map blockers and UI state.
3. Add dedicated chapter-complete presentation and persistent boss-clear state for future multi-scene chapter flow.
