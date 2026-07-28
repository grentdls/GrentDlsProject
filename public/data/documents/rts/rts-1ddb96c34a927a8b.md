# Enemy AI Development and Map Resource Safety

## Scope

This document tracks the runtime rules that keep enemy factions developing correctly and keep generated battlefields from missing critical resources.

## Enemy Development Loop

- Enemy workers gather the current public resource set: `Wood`, `Gold`, `Stone`, and `Iron`.
- Worker targeting compares normalized resource types through `ResourceRuleUtility.NormalizeResourceType`, so legacy resource nodes such as `DivineEssence`, `Food`, `TechPoint`, or `Fuel` can still satisfy current economy needs after normalization.
- `EnemyFactionController` owns the enemy stockpile and desired resource targets. Missing building, unit, or research costs raise the desired target for that normalized resource.
- Enemy construction must reuse the same faction construction rules as player placement:
  - terrain validity is checked through `TerrainSystem.CanPlaceBuilding`;
  - faction placement rules are checked through `FactionConstructionRules.GetRule(factionId).CanPlace(...)`;
  - constructed prefabs receive `FactionConstructionController.Initialize(FactionConstructionRules.CreateTask(...))`;
  - construction then starts through `BaseBuilding.StartConstruction()`.
- AI development should progress by difficulty and pressure:
  - build capacity when population is blocked;
  - build production buildings before trying to train army units;
  - add technology and resource buildings as the attack template grows;
  - scout via strategic patrol points before committing larger attack waves;
  - launch attack waves only after enough mobile attackers are available.

## Building Prerequisite Chain

- For buildings managed by `FactionTechTreeData`, runtime prerequisite validation must use `FactionBuildingEntry.PrerequisiteBuildingIds` and `PrerequisiteTechIds`.
- Legacy `BuildingData.PrerequisiteBuildingTypes` is only a fallback for buildings that are not managed by a faction tech tree.
- Enemy AI resolves missing prerequisite buildings recursively through the faction tech tree and attempts to research missing prerequisite techs.
- Recursive prerequisite resolution must guard against cyclic entry data. A cycle should stop the current blocker resolution and log the problematic entry instead of freezing AI decisions.

## Map Resource Safety

- Every resolved player and enemy spawn area must have nearby critical resources after map or fixed-map setup and before session entities are created.
- Required nearby resources:
  - `Wood`: at least 5 nodes within the spawn scan radius.
  - `Gold`: at least 2 nodes within the spawn scan radius.
  - `Stone`: at least 2 nodes within the spawn scan radius.
  - `Iron`: at least 2 nodes within the spawn scan radius.
- Resource counts compare normalized types, so old generated or authored nodes still count toward the current public resource set.
- Procedural and fixed-map launch paths both run the same spawn resource safety pass.

## Verification

- Run `dotnet build Assembly-CSharp.csproj /p:BuildProjectReferences=false` after runtime changes.
- In Unity, verify at least one normal skirmish and one fixed-map launch:
  - enemy workers gather all required resource types;
  - enemy base adds capacity, production, resource, defense, and technology buildings over time;
  - missing prerequisite buildings are built before locked buildings;
  - attack waves leave the base after the AI has enough army units;
  - each player and enemy spawn has visible wood, gold, stone, and iron nearby.
