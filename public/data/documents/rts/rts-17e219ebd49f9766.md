# Skill Projectile Configuration

## Purpose

Unit skills can now author real projectile emissions instead of only using the legacy projectile event and visual prefab placeholders. A skill may contain multiple projectile emission blocks, and each block can describe its own aiming, layout, movement, collision, damage, and impact behavior.

## Data Entry

Projectile data lives on `SkillDefinitionData.projectileEmissions`.

The skill editor exposes the list in the projectile tab:

- `Projectile Emissions / 多段投射物配置`

If the list is empty, the skill keeps the old behavior:

- damage skills resolve immediately on the effect event
- non-damage skills keep their existing heal, buff, debuff, summon, or custom behavior
- legacy `visualPrefab` and `impactEffectPrefab` are still used for simple visuals

If at least one enabled emission exists on a damage skill, damage is deferred to the projectile runtime. This prevents immediate skill damage and projectile hit damage from firing twice.

## Emission Fields

Each emission represents one projectile stage. Multiple emissions can be used for staged shots, mixed projectile shapes, split volleys, or delayed secondary effects.

Core fields:

- `enabled`: whether this emission is active.
- `label`: designer-facing label.
- `projectilePrefab`: authored projectile visual prefab.
- `impactEffectPrefab`: optional per-emission impact prefab.
- `spawnDelay`: delay after the projectile event before this emission spawns.
- `localSpawnOffset`: muzzle offset from the caster transform.

Aiming:

- `TargetDirection`: fly from caster toward the selected target or resolved combat target.
- `CasterForward`: fly using the caster's current forward direction.
- `TargetPosition`: prefer a selected point or target position.
- `LockedTarget`: use the explicit target when one was selected.
- `RandomSpread`: start from target direction, then add random spread.

Layout:

- `Single`: one projectile from the muzzle.
- `Fan`: multiple projectiles distributed across `spreadAngle`.
- `Parallel`: multiple projectiles side by side using `parallelSpacing`.
- `Grid`: rows and columns using `gridColumns` and `parallelSpacing`.
- `Ring`: projectiles distributed in a full circle.
- `RandomCone`: projectiles randomly distributed inside `spreadAngle`.

Flight:

- `Straight`: moves forward at `speed`.
- `Parabolic`: moves forward while adding `arcHeight`.
- `Homing`: turns toward the locked target or retargets inside `homingRetargetRadius`.

Collision:

- `hitRadius`: projectile enemy collision radius.
- `Pierce`: keeps flying after hits.
- `DestroyOnFirstHit`: destroys after the first enemy hit.
- `DestroyAfterPierceLimit`: destroys once hit count exceeds `pierceCount`.
- `environmentCollisionMode`: can ignore environment or destroy on configured wall/obstacle layers.
- `environmentMask`: layer mask used for wall/obstacle collision.
- `damageOncePerTarget`: prevents one projectile/explosion sequence from damaging the same target repeatedly.

Damage and impact:

- `applyDamage`: applies direct damage on enemy collision.
- `overrideDamage`: use emission `baseDamage` instead of skill `effectValue`.
- `damageMultiplier`: direct hit damage multiplier.
- `explodeOnImpact`: trigger area damage on collision.
- `explodeOnExpire`: trigger area damage when lifetime/range ends.
- `explosionRadius`: area damage radius.
- `explosionDamageMultiplier`: area damage multiplier.
- `destroyOnExplosion`: destroy projectile after explosion.
- `spawnImpactOnHit`: spawn impact visual on collision.

## Runtime Rules

`UnitSkillController` is still the cast entry point.

When a projectile skill fires:

1. The cast animation and cast feedback play as before.
2. `OnEffectFire` resolves non-damage effects normally.
3. Damage skills with projectile emissions skip immediate damage.
4. Projectile emissions spawn either on `OnEffectFire` when `projectileSpawnDelay < 0`, or on `OnProjectileSpawn` when the delay/event is configured.
5. `SkillProjectileRuntime` moves the projectile and resolves direct hits, pierce behavior, wall collision, impact VFX, explosion damage, hit feedback, damage popups, and `DamageResolvedEvent`.

## Replacement Workflow

To replace placeholders later:

1. Assign an authored `projectilePrefab` on each emission.
2. Assign `impactEffectPrefab` for per-projectile impact, or use the skill-level `impactEffectPrefab`.
3. Keep `visualPrefab` as a legacy fallback only.
4. Configure `environmentMask` only when the projectile should interact with walls or obstacles.

## Validation

The skill editor warns when:

- projectile count is invalid
- speed is invalid
- lifetime or max distance is missing
- collision radius is missing
- explosion is enabled without a valid radius
- no projectile prefab exists and runtime fallback VFX will be used
- a damage skill has projectiles that do not apply direct damage or explosion damage
