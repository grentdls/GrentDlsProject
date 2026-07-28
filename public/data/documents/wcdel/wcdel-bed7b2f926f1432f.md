# Chapter01 Boss Runtime Sync

## Goal

Tighten the Chapter01 playable slice so the generated data, encounter layout, and boss route better match the Chapter01 content pack, while keeping everything inside the current editor-generated MVP architecture.

## Scope

- Corrected Chapter01 enemy definition tuning in `FoundationAssetUtility` so key generated stats better match the Chapter01 content package:
  - `Poison Bee`
  - `Bee Captain`
  - `Hive Guardian`
- Corrected `Grassleaf Cave` dungeon metadata so its `bossDefinition` no longer points at `Bee Captain`.
- Adjusted ranged-enemy runtime damage mapping so ranged Chapter01 definitions no longer rely only on `Magic` to drive projectile damage.
- Updated Chapter01 encounter setup behavior so existing scene enemies keep their hand-tuned positions on subsequent setup passes unless they are newly created.
- Added a real `HiveGuardian_Boss` scene unit to the `BossApproach_Encounters` group so the boss entrance route now has an actual Chapter01 boss prototype waiting beyond the gate.
- Repositioned the `Bee Captain` encounter to better fit the boss-approach route before the boss arena.

## Current Behavior

- Running `Tools/WCDEL/Foundation/Setup Starter Test Slice` now gives the Chapter01 boss route both:
  - a pre-boss elite check via `Bee Captain`
  - a prototype `Hive Guardian` boss unit beyond the entrance route
- Re-running the setup tool no longer forcibly snaps existing Chapter01 encounter objects back to their hardcoded coordinates, which makes iterative scene tweaking safer.
- `Poison Bee` and `Bee Captain` now deal damage in a way that better matches their Chapter01 definition intent instead of being artificially weakened when `Magic` is low or zero.
- Dungeon metadata shown by current runtime systems is less misleading for `Grassleaf Cave`.

## Boundaries

- `Hive Guardian` is still using the current melee prototype controller, not a dedicated boss state machine with phase logic, summons, arena locks, or custom telegraphs.
- The boss route is still generated from editor utility code rather than a formal encounter table or boss scene loader.
- The ranged damage adjustment is still an MVP interpretation of the current `EnemyDefinition` schema; a richer long-term solution would separate projectile base damage from melee and spell stats explicitly.

## Next Suggestions

1. Split `Hive Guardian` into a dedicated boss controller once Boss phase rules are implemented from the Chapter01 design package.
2. Add boss reward chest and chapter-complete flow behind the boss route so MQ08 and MQ09 can start forming a real playable chain.
3. Expand dungeon-specific enemy packs for `Grassleaf Cave` and `Bee Nest` instead of relying only on overworld-side placements.
4. Consider extending `EnemyDefinition` with clearer ranged damage fields if more enemy archetypes appear in later chapters.
