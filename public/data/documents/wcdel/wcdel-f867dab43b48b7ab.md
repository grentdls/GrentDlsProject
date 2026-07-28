# Hit Impact Feedback System Sync

## 2026-05-21 Implementation

This pass connects the new `Docs/hit_impact_feedback_system_design.md` rules to the current combat stack without replacing the existing `Health`, `DamageRequest`, damage number, HUD, camera shake, and knockback systems.

### Runtime Flow

- `DamageRequest` remains the single payload for hit reaction, damage, knockback, launch, and special flags.
- `HitImpactFeedbackResolver` maps each hit to `HitImpactLevel.None` through `HitImpactLevel.Ultimate`.
- `CombatFeedbackBroadcaster` keeps routing attacker and victim camera feedback, and now auto-adds runtime hit flash/local pause helpers to old scene units.
- `HitStopController` is still the global time-effect owner, but now clamps duration, clamps slow motion, and has a small cooldown to prevent stacked hits from freezing the game.
- `HitImpactLocalPauseController2D` handles regular hit-stop feel by briefly pausing attacker/victim movement and animation, so normal hits no longer require full-scene time scale changes.
- `HitFlashController2D` listens to health feedback and applies short sprite flash plus body shake.
- `CombatUnitWorldHud2D` and `DamageNumberEmitter` use the same resolved hit level for health bar flash, health bar shake, damage number scale, duration, and shake.

### Impact Level Mapping

- DoT: light feedback, no global hit-stop.
- Normal hit: short local pause, normal white or element flash.
- Heavy hit / knockback: stronger local pause, stronger HUD and number feedback.
- Critical / armor pierce / true damage: strong feedback with gold/silver flash.
- Weakness / guard break / launch / knockdown: break-level feedback.
- Execute / ultimate: ultimate-level feedback and global camera/time emphasis.

### Reaction Rules

- Player hit reaction continues to use `PlayerHitReactionController`, `PlayerStateController`, and `PlayerJumpController`.
- Knockdown is now handled before generic launch so explicit knockdown requests enter down/get-up flow instead of always being treated as launch.
- Boss units ignore regular knockback unless the resolved impact level is break or stronger.
- Existing super armor and invincibility providers still block interruption and knockback.

### Editor/Scene Generation

`FoundationAssetUtility` now ensures the following components on generated player, dummy, melee enemy, ranged enemy, and flying enemy instances:

- `HitFlashController2D`
- `HitImpactLocalPauseController2D`
- Existing `CombatFeedbackBroadcaster`
- Existing `CombatWorldSpaceBar2D`

`CombatWorldSpaceBar2D` also self-adds `HitFlashController2D` for units that only have the world HUD helper.

### Validation

- `dotnet build WCDEL.Game.Runtime.csproj /p:BuildProjectReferences=false`
- `dotnet build WCDEL.Game.Editor.csproj /p:BuildProjectReferences=false`

Runtime currently builds with only the pre-existing `Physics2D.OverlapCircleNonAlloc` obsolete warnings.
