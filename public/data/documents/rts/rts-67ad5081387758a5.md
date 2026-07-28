# Runtime VFX Placeholder Rules

## Purpose

Runtime VFX placeholders are used only when authored effect prefabs are missing.

Configured prefab priority stays unchanged:

- `UnitData.AttackEffectPrefab`
- `UnitData.HitEffectPrefab`
- `UnitData.DeathEffectPrefab`
- `BuildingData.ConstructionEffectPrefab`
- `BuildingData.UpgradeEffectPrefab`
- `BuildingData.DeathEffectPrefab`
- `SkillDefinitionData.CastEffectPrefab`
- `SkillDefinitionData.ImpactEffectPrefab`
- `SkillDefinitionData.VisualPrefab`

If any of these fields has a prefab, runtime uses that prefab first.

## Runtime Fallback Entry

- `Assets/Scripts/Combat/RuntimeVfxFactory.cs`

This factory creates temporary particle-based effects for missing configured prefabs:

- attack impact burst
- melee swing arc
- projectile core and trail
- skill cast gathering pulse
- skill impact burst
- unit death burst
- building collapse burst
- construction loop sparks
- upgrade loop energy ring

## Replacement Rules

Preferred replacement workflow:

1. Create or import a final effect prefab.
2. Assign it to the relevant data field listed above.
3. Leave runtime fallback untouched.

Do not replace `RuntimeVfxFactory` for content-specific VFX. It is the shared fallback layer for missing art only.

## Authoring Notes

- Combat effects should be short and readable from the RTS camera.
- Building construction and upgrade effects may loop, but they should stop cleanly when the building finishes or activity ends.
- Death effects should be detached from the source entity because the entity may be destroyed immediately.
- Keep particle counts moderate for mobile. The runtime fallback uses small bursts and short lifetimes by design.
