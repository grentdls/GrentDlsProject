# Chapter01 Enemy Layout Doc Sync

## Goal

Align Chapter 1 generated enemy placements with the source-of-truth design docs under `Docs/Section1` and `Docs/Task`, instead of relying on the older reduced placeholder encounter list inside the scene builder.

## Root Cause

- `Assets/Game/Editor/Chapter01FirstSighSceneBuilder.cs` contained a simplified hardcoded `EnemySpawns` list.
- That list only covered a small subset of the Chapter 1 encounter plan and used older point ids such as `CH01_C_ENEMY_001`.
- The Chapter 1 docs define a richer placement table with explicit ids like `CH01_C_ENEMY_SPAWN_001` through `CH01_I_ENEMY_SPAWN_005`.
- `GameBootstrapConfig._defaultEnemyCharacterConfigs` for Chapter 1 still mixed in non-Chapter-1 fallback configs such as slime, bat, bee, hive guardian, and mouse, which increased the chance of runtime visual/config fallback drifting away from Chapter 1 content.

## What Changed

- Added a dedicated `GetChapter01EnemySpawns()` source in `Chapter01FirstSighSceneBuilder` and switched scene generation to read that doc-aligned spawn table.
- Expanded Chapter 1 builder support for missing encounter variants used by the docs:
  - `well_rat`
  - `surrender_rat`
  - `thief_rat`
  - `vine`
- Tightened Chapter 1 bootstrap default enemy config registration so it only keeps `CharacterConfig_CH01_*` entries.
- Updated runtime enemy-config matching so the new Chapter 1 variants resolve to the correct existing Chapter 1 visual configs instead of falling back to unrelated enemy placeholders.

## Coverage

The synced spawn table now covers the documented Chapter 1 enemy areas:

- `B` 村口坡地
- `C` 荒原边缘
- `D` 枯井
- `E` 黑草坡
- `F` 营地外围
- `G` 旧龙渠
- `H` 封印入口
- `I` 封印外圈

## Notes

- This change keeps the current editor-generated architecture and does not introduce a new runtime spawn system.
- Some doc-only narrative variants such as “山鼠窝小队” and “自动认输山鼠奇遇” still map onto existing gameplay archetypes for now, but their point ids and placement slots are now aligned with the docs.
- The old static `EnemySpawns` field is left in place as historical data, but Chapter 1 runtime generation now uses the new doc-aligned source.

## Validation

- Rebuild the Chapter 1 scene through `Tools/WCDEL/Chapter01/创建或重建第一章场景`.
- Verify that generated scene object ids match the doc naming pattern `CH01_*_ENEMY_SPAWN_*`.
- Verify that Chapter 1 enemies no longer pull in unrelated fallback enemy configs from other slices.
