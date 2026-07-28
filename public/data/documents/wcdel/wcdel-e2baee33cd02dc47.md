# Combat Placeholder Animation And World Visual Sync

## Goal

Improve the combat sandbox readability with replaceable placeholder visuals instead of flat color blocks, while keeping the project on the existing prefab / ScriptableObject driven workflow.

## This Update Covers

### Character Placeholder Animation Templates

Extended the sample character-config generation path so the project now produces placeholder animation sequences for:

- player hero
- mouse bandit
- meadow slime
- cave bat
- poison bee
- bee captain
- hive guardian

The generated placeholder templates now cover the core readable combat motions needed for blockout:

- spawn
- idle
- move
- jump
- dash
- attack
- hit
- dead

The training dummy placeholder path now also has its own lightweight animation template for:

- spawn
- idle
- hit
- dead

The hero template also includes:

- air attack
- skill cast
- ultimate cast
- fall
- land

These are generated as sprite sequences under `Assets/Game/Runtime/CharacterConfigs/Animations` and remain easy to replace later with formal art.

### Runtime Character Animation Hookup

`CharacterSpriteAnimationDriver` remains the runtime playback layer for placeholder animation clips, and enemy scene setup now selects a placeholder config asset by chapter enemy type instead of forcing every enemy to reuse the same mouse-bandit config.

This means:

- different enemies can now keep different default silhouettes
- different enemies can animate with their own placeholder frame sets
- later replacement still happens by swapping config assets / sprites, not rewriting gameplay code

### Enemy Definition Sync

Chapter enemy gameplay stats continue to use `EnemyDefinition` as the primary source of truth.

The placeholder character-config layer now automatically syncs key values from chapter enemy definitions into the corresponding placeholder `CharacterConfigDefinition` assets, including:

- level
- max HP
- attack / magic / armor
- move speed derived locomotion values
- AI range tuning
- drop gold / exp
- elite / boss UI flags

This keeps the workflow aligned with the current architecture:

- `EnemyDefinition` drives chapter combat tuning
- `CharacterConfigDefinition` provides placeholder animation / visual / blockout-facing runtime data

So designers do not need to manually keep two separate enemy stat assets in sync during placeholder production.

### World Placeholder Visual Upgrade

The world test slice setup now generates dedicated placeholder sprites for terrain and interaction objects instead of relying on pure `SpriteRenderer.color`.

Current placeholder categories include:

- respawn / shrine markers
- swamp zones
- road zones
- teleport portals
- reward chests
- collectibles and hidden rewards
- gates and mechanism levers
- cave entrances / exits
- NPCs
- quest boards
- field shop
- boss gate
- boss trophy / beacon style rewards

Each category now has a distinct silhouette / pattern so the sandbox is easier to read at a glance during testing.

Generated placeholder world sprites are stored under:

- `Assets/Game/Runtime/WorldPlaceholders`

### Editor Refresh Entry

Added a dedicated editor menu entry:

- `Tools/WCDEL/Foundation/Refresh Combat Placeholder Visuals`

This refreshes:

- sample character configs
- player placeholder hookup
- training dummy placeholder hookup
- world placeholder sprites
- chapter encounter placeholder visuals

Use this when you want to update sandbox placeholder visuals without recreating the entire scene from scratch.

The same refresh path also benefits from the new enemy-definition-to-placeholder-config sync, because `EnsureGeneratedDefinitions()` now updates both chapter enemy definition assets and their matching placeholder character configs in one pass.

## Architectural Notes

- Kept the current runtime controller architecture intact.
- Did not replace gameplay systems with Unity Animator controllers.
- Kept placeholder visuals asset-driven and replaceable later.
- Continued using editor generation utilities so scene YAML does not need manual restructuring.

## Verification

Validated with:

- `dotnet build WCDEL.sln`

Build result on `2026-05-16`: success with 0 errors.

Known existing warnings remain the same deprecated `Physics2D.OverlapCircleNonAlloc` calls already present in the project.

## Follow-up Suggestions

1. Add training-dummy specific hit / dead placeholder clips so even debug units share the same animation pipeline.
2. Move world placeholder sprite generation into a dedicated editor utility if the placeholder library keeps growing.
3. If later needed, split “auto-synced values” and “manual override values” for placeholder enemy configs so encounter-specific blockout presentation can diverge safely from chapter base stats.
