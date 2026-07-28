# Enemy Animation Frame Generation Rules

## Goal

Create one unified rule document for AI-generated enemy animation sequences by combining:

- the two wolf / jackal style reference images provided for this task
- the current enemy taxonomy already used inside `WCDEL`
- the existing in-project placeholder animation naming and frame-count conventions
- the higher-quality reference action packs already stored under `Assets/Game/Art/Unit`

This document is intended to let the team generate full enemy sprite sequences with consistent silhouette, frame rhythm, naming, canvas setup and action coverage.

## Project Enemy Scope

Current gameplay enemy line in the project:

- `MeadowSlime`
- `CaveBat`
- `PoisonBee`
- `BeeCaptain`
- `HiveGuardian`

Additional internal reference enemies that help define the production rule set:

- `MouseBandit`
- `JackalEnemy`

These references matter because the repository already contains two stronger action-pack patterns:

- `Assets/Game/Art/Unit/MouseMinion_ActionPack_v2`
- `Assets/Game/Art/Unit/JackalEnemy_ActualActionSheets_Package_v1`

## Reference Image Analysis

### Shared Style Language

Both provided images describe the same broad family:

- chibi-proportioned beastman / wolfman enemy
- oversized head, ears and hands for strong silhouette readability
- short legs and compact torso for game-scale readability
- aggressive face-first posing with clear threat direction
- hand-painted 2D illustration style rather than pixel art
- transparent background, single-character presentation, no environment
- strong outer contour, medium-weight inner line, readable claw / fang shapes
- warm brown fur palette with cream muzzle and red-brown cloth accents
- asymmetry through scars, torn cloth, bone ornaments, wraps and messy fur

### Image 1: Feral Jackal / Pounce Type

Visual traits:

- lower, forward-leaning hunt stance
- very long ears and heavy black mane
- exposed claws on both hands
- stronger beast posture than humanoid posture
- necklace / tribal ornaments / cloth skirt emphasize wild brute identity
- best read as pouncer, ambusher, berserker, elite beast or boss minion

Animation implications:

- center of mass stays low
- anticipation should compress body backward before springing
- idle should feel predatory, with shoulder and back ripple
- move should feel crouched and stalking rather than upright marching
- attacks should favor swipes, lunges, tearing, body rush and howl

### Image 2: Club-Wielding Wolf Raider Type

Visual traits:

- more upright, humanoid combat stance
- simpler fur mass, cleaner head silhouette
- one-hand heavy club reads clearly as weapon focus
- scarf, wraps and rope belt suggest raider / bandit / tribal fighter
- expression is still fierce, but pose is more disciplined than image 1

Animation implications:

- stronger left-right weapon readability
- attack arcs must clearly show windup, hold and strike follow-through
- move should feel like stomping / advancing raider motion
- hit frames can rotate the torso and weapon separately
- skill frames can use overhead smash, charge rush or intimidation howl

### Combined Design Conclusion

Together these two images define the recommended beast-humanoid enemy generation family for this project:

- readable at small game scale
- exaggerated facial hostility
- oversized head and claws or weapon
- dirty tribal costume language
- asymmetrical damage / scars / cloth tears
- one dominant action read per frame
- no overly realistic anatomy
- no glossy anime-clean surfaces

## Current In-Project Animation Baseline

Runtime placeholder enemy sequences under `Assets/Game/Runtime/CharacterConfigs/Animations` currently follow a stable base set:

- `spawn`: 5 frames
- `idle`: 6 frames
- `move`: 8 frames
- `jump`: 4 frames
- `dash`: 4 frames
- `attack_01`: 6 frames
- `hit`: 3 frames
- `dead`: 5 frames

Skill-capable enemies additionally use:

- `skill_leaf`: 6 frames

Observed on:

- `PoisonBee`
- `BeeCaptain`
- `HiveGuardian`
- `MouseBandit`

This means the current project already supports a clean “base enemy pack” and an “advanced enemy pack”.

## Existing High-Quality Action-Pack References

### MouseMinion Reference Pack

Path:

- `Assets/Game/Art/Unit/MouseMinion_ActionPack_v2`

Properties:

- action-strip workflow
- `256x256` frame canvas
- pivot `(0.5, 0.1)`
- transparent background
- richer combat set than runtime placeholder pack

Actions:

- `Idle`
- `MoveLoop`
- `GroundAttack01`
- `GroundAttack02`
- `GroundAttack03`
- `Skill01_SmokeBomb`
- `Skill02_Whirlwind`
- `Skill03_DashSpin`
- `Ultimate_Frenzy`

### JackalEnemy Reference Pack

Path:

- `Assets/Game/Art/Unit/JackalEnemy_ActualActionSheets_Package_v1`

Properties:

- single-character transparent action-sheet workflow
- extracted `512x512` Unity frames
- pivot `(0.5, 0.1)`
- stronger beast-warrior action language

Actions:

- `Idle`
- `MoveLoop`
- `GroundAttack01`
- `GroundAttack02`
- `GroundAttack03`
- `Skill01_SavagePounce`
- `Skill02_ClawTornado`
- `Skill03_HowlShockwave`
- `Ultimate_MoonfangFrenzy`

### Production Recommendation

For AI generation, use the `MouseMinion` and `JackalEnemy` packs as the quality target, not the small `96x96` runtime placeholders.

Treat the current `96x96` runtime sprites as:

- gameplay blockout references
- naming references
- action coverage references
- replacement targets later

Treat the `256x256` and `512x512` packs as:

- action design references
- frame rhythm references
- export structure references
- silhouette consistency references

## Enemy Classification For Sequence Generation

Use these production classes when generating enemies.

### Class A: Blob / Soft-Body

Applies to:

- `MeadowSlime`

Rule:

- no limbs required for main readability
- movement uses squash / stretch and bounce
- attack reads through body lunge, slap, spit or bump
- death uses collapse, melt or flatten

Do not force wolf / jackal anatomy rules onto this class.

### Class B: Small Flying Beast

Applies to:

- `CaveBat`
- `PoisonBee`

Rule:

- wing rhythm is the primary motion carrier
- body bob should be subtle and consistent
- attack silhouette must stay readable even when wings overlap
- idle usually hovers rather than stands

For `PoisonBee`, combine bee abdomen / stinger logic with aggressive bug-face exaggeration.

### Class C: Humanoid Beast / Raider / Bandit

Applies to:

- `MouseBandit`
- future wolf bandits, jackal raiders, goblin-beast hybrids
- the second reference image directly fits here

Rule:

- upright or semi-crouched biped
- weapon or claw is the dominant read
- cloth, rope, wraps, scars and asymmetry sell personality
- combo attacks and weapon arcs should be explicit

### Class D: Feral Beastman / Pounce Hunter

Applies to:

- future jackal stalkers
- future wolf berserkers
- the first reference image directly fits here

Rule:

- low center of gravity
- stronger shoulder / claw silhouette than weapon silhouette
- emphasis on pounce, rush, multi-hit clawing and howl
- body should feel animal-first, humanoid-second

### Class E: Elite / Boss Insectoid Or Monster Leader

Applies to:

- `BeeCaptain`
- `HiveGuardian`

Rule:

- same base family as smaller enemy of same line, but expanded silhouette
- extra crown / horn / wing / armor / color accent
- longer anticipation and stronger impact frames
- add one signature skill motion and one finisher-grade motion

## Master Visual Rules For AI Generation

These are mandatory invariants for every single action strip.

### Character Identity Lock

Every prompt must preserve:

- same enemy
- same species family
- same facing direction
- same costume parts
- same scars and ornaments
- same palette family
- same silhouette family
- same weapon type if applicable
- same relative head-to-body ratio

Do not let AI redesign the character between actions.

### Silhouette Rules

- head should be the clearest landmark
- hands, claws, weapon or wings must not merge into unreadable masses
- ears / horns / wing tips should remain outside torso silhouette whenever possible
- one frame should show one readable action idea
- avoid perspective that hides both hands and face at once

### Line And Paint Rules

- keep painterly 2D rendering with clean readable contour
- preserve slightly rough, hand-painted fur / cloth texture
- avoid photoreal fur strands
- avoid cel-shaded plastic look
- avoid washed-out pastel rendering
- keep strong value separation between face, torso and limbs

### Color Rules

- use earthy natural palette families
- reserve brighter accent colors for elite markers, eyes, poison sacs, stingers or magic
- fur and costume should not merge into one flat brown block
- face and attack limbs need value contrast from torso

### Background Rules

- transparent background only
- no shadows painted outside character unless baked as a soft local contact shadow
- no props except character-owned weapon or gear
- no UI, labels, logos, floor, smoke poster effects or scenery

## Canvas And Export Rules

### Two-Tier Output Strategy

Use two asset tiers.

Tier 1: AI master generation

- normal enemies: `256x256` per frame minimum
- elite / boss / jackal-style heavy beastman: `512x512` per frame preferred
- one horizontal strip per action
- transparent RGBA
- shared bottom-center anchor

Tier 2: in-project runtime replacement

- normalize to project-required runtime size later
- preserve one shared scale and anchor across all frames
- do not regenerate per-size variants independently

### Anchor Rule

Use:

- pivot / anchor = bottom center
- equivalent to normalized pivot `(0.5, 0.1)` in reference packs

Feet, hover center or body base must align to the same anchor line across the whole strip.

### Layout Rule

- one action per strip
- same frame cell size across one enemy pack
- horizontal order left to right
- frame 01 must already belong to the motion, not a random concept pose

### Naming Rule For AI Master Files

Recommended strip naming:

- `EnemyName_01_Idle_Strip_06f_256.png`
- `EnemyName_02_MoveLoop_Strip_08f_256.png`
- `EnemyName_03_GroundAttack01_Strip_06f_256.png`

If the character is a heavy boss version:

- `EnemyName_01_Idle_Strip_06f_512.png`

### Naming Rule For Extracted Frames

Use:

- `EnemyName_idle_00.png`
- `EnemyName_idle_01.png`
- `EnemyName_move_00.png`
- `EnemyName_attack_01_00.png`
- `EnemyName_skill_01_00.png`
- `EnemyName_dead_04.png`

Match the current project naming style where practical.

## Required Action Sets

### Base Enemy Pack

Required for all standard enemies:

1. `spawn` - 5 frames
2. `idle` - 6 frames
3. `move` - 8 frames
4. `jump` - 4 frames
5. `dash` - 4 frames
6. `attack_01` - 6 frames
7. `hit` - 3 frames
8. `dead` - 5 frames

### Advanced Enemy Pack

Required for elite, ranged or signature enemies:

1. base pack
2. `skill_01` or project-mapped skill strip - 6 frames

### Full Production Beastman Pack

Recommended for wolf / jackal / mouse raider / future humanoid elites:

1. `Idle`
2. `MoveLoop`
3. `GroundAttack01`
4. `GroundAttack02`
5. `GroundAttack03`
6. `Skill01`
7. `Skill02`
8. `Skill03`
9. `Ultimate`

This full set is already validated by both `MouseMinion` and `JackalEnemy` reference packs.

## Frame-by-Frame Motion Rules

### Spawn

Purpose:

- materialize into battle

Structure:

- frame 1: hidden / compressed / low-opacity emergence pose
- frame 2: form expansion
- frame 3: main silhouette appears
- frame 4: body stabilizes
- frame 5: settle into idle-ready stance

### Idle

Purpose:

- alive, breathing, threatening

Structure:

- 6-frame subtle loop
- body mass should not drift horizontally
- use breathing, ear flick, cloth sway, wing hum, tail twitch, shoulder lift

### Move

Purpose:

- continuous locomotion loop

Structure:

- 8 frames for current project baseline
- readable contact / pass / extend / recoil beats
- no start-stop cadence inside the loop

Per class:

- slime: bounce cycle
- bat / bee: hover-flap cycle
- humanoid beast: stepping or stalking loop
- feral jackal: low prowl loop

### Jump

Purpose:

- leave ground / rise

Structure:

- frame 1: crouch or gather
- frame 2: push-off
- frame 3: rising extension
- frame 4: airborne travel pose

For hover enemies, reinterpret as quick lift / flight burst.

### Dash

Purpose:

- short burst reposition

Structure:

- frame 1: compressed anticipation
- frame 2: burst launch
- frame 3: elongated travel smear pose
- frame 4: recovery pose

### Attack 01

Purpose:

- default bread-and-butter attack

Structure:

- frame 1: anticipation
- frame 2: larger windup
- frame 3: strike release
- frame 4: impact or overswing
- frame 5: follow-through
- frame 6: recover to combat-ready pose

### Hit

Purpose:

- receive damage without ambiguity

Structure:

- frame 1: instant recoil
- frame 2: peak reaction
- frame 3: return or unstable reset

Rules:

- silhouette must visibly break
- head and torso must react together
- weapon, ears or wings may lag one frame for extra force

### Dead

Purpose:

- final readable defeat state

Structure:

- frame 1: fatal impact
- frame 2: collapse start
- frame 3: heavier drop
- frame 4: ground contact
- frame 5: final rest silhouette

The last frame must be stable enough to remain on screen.

### Skill Frames

6-frame default rule for current project skill-capable enemies:

- frame 1: gather / charge
- frame 2: stronger prep
- frame 3: release start
- frame 4: main action peak
- frame 5: trailing effect body motion
- frame 6: recover

## Class-Specific Motion Rules

### MeadowSlime

- soft squash and stretch
- no rigid limb articulation requirement
- attack can be body slam, tongue lash, spit or elastic bump
- hit and dead should emphasize volume collapse

### CaveBat

- wings must remain the main read
- idle should hover, not stand like a mammal
- move loop should use figure-eight or pulse flap feeling
- attack should read as bite swoop or wing slash

### PoisonBee

- abdomen and stinger must stay readable
- hover stance should feel lighter and faster than bat
- skill can emphasize poison shot, poison cloud, stinger thrust or zig-zag dive

### BeeCaptain

- treat as elite line upgrade of `PoisonBee`
- add sharper crown / horn / armor accents
- skill animation must look more commanded and deliberate
- attack arcs can be wider and more confident

### HiveGuardian

- heaviest silhouette in current enemy set
- widen shoulder / thorax / wing read
- slower anticipation, stronger payoff
- final boss skill should include body expansion, roar / buzz surge, slam or charge

### MouseBandit

- upright small raider
- stronger tool / weapon read
- supports combo attack set
- can borrow timing logic from `MouseMinion_ActionPack_v2`

### Wolf / Jackal / Beastman Variants

Use the two provided images plus `JackalEnemy` as direct family reference.

For this family:

- ears must stay large and expressive
- muzzle and fangs must read clearly even at smaller scale
- one shoulder usually leads the attack direction
- cloth wraps and bone trinkets should move slightly during strong attacks
- claw or club arcs must stay readable frame to frame

## AI Prompt Construction Rules

Always include:

- same character across all frames
- same facing direction
- same costume, scars, fur pattern and weapon
- one horizontal strip
- transparent background
- exact frame count
- exact cell size
- bottom-center anchor consistency
- production-ready 2D game asset
- no concept sheet layout

### Example Prompt Template: Wolf / Jackal Beastman

“Generate one horizontal sprite strip for the same chibi feral jackal warrior enemy, facing right, transparent background, 6 frames, each frame 512x512, consistent bottom-center anchor, same brown-black fur, cream muzzle, scarred face, tribal wraps, bone ornaments, torn red waist cloth, large ears, claws clearly readable, painterly 2D game sprite style, no background, no text, no extra props. Action: attack_01. Frame rhythm: anticipation, windup, strike, impact, follow-through, recovery.”

### Example Prompt Template: Flying Bee Elite

“Generate one horizontal sprite strip for the same chibi poison bee captain enemy, facing right, transparent background, 6 frames, each frame 256x256, consistent bottom-center anchor, same insect body, stinger, wing shape, elite crown accents, poison palette accents, painterly 2D game sprite style, no background, no text. Action: skill_01 poison burst. Frame rhythm: charge, gather, release, peak burst, trailing motion, recovery.”

## Recommended Production Workflow

1. Approve one seed frame per enemy first.
2. Build one enlarged transparent reference canvas around that seed.
3. Generate one whole strip per action, never single frames one by one.
4. Normalize every strip to shared anchor and shared scale.
5. Lock frame 01 back to approved seed when necessary.
6. Slice into runtime frame files.
7. Preview in-engine before bulk rollout.

This matches the `sprite-pipeline` guidance and avoids drift.

## Asset Mapping Recommendation For WCDEL

### Runtime Placeholder Layer

Keep:

- `Assets/Game/Runtime/CharacterConfigs/Animations/*`

Use this as:

- current naming reference
- current frame-count reference
- fallback placeholder layer

### AI Master Source Layer

Recommended future folder:

- `Assets/Game/Art/Unit/EnemyActionPacks/<EnemyName>/`

Suggested structure:

- `SourceSheets_Transparent/`
- `Unity_ActionStrips_256/` or `Unity_ActionStrips_512/`
- `Unity_Frames_256/` or `Unity_Frames_512/`
- `Metadata/animation_manifest.json`
- `Metadata/action_summary.csv`
- `Metadata/frame_manifest.csv`

This mirrors the strong precedent already used by `MouseMinion` and `JackalEnemy`.

## Quality Gates Before Approval

- silhouette stays stable across all frames
- face and primary attack tool remain readable
- anchor does not drift
- character proportions do not mutate between actions
- no frame introduces new costume parts or removes key scars / ornaments
- attack timing reads clearly at small scale
- elite and boss variants feel heavier, not just recolored
- background remains fully transparent
- naming matches project conventions

## Practical Enemy Coverage Recommendation

For the current chapter, generate in this order:

1. `PoisonBee`
2. `BeeCaptain`
3. `HiveGuardian`
4. `CaveBat`
5. `MeadowSlime`

If the next batch includes wolf / jackal humanoid enemies, use the two provided images and the `JackalEnemy` pack as the direct production parent rule set.

## Summary

The project now has three useful animation standards:

- current runtime placeholder standard: small `96x96` frame sequences
- medium production strip standard: `256x256` action-pack style
- heavy elite / beastman production strip standard: `512x512` action-pack style

For AI generation, the safest rule is:

- preserve one approved seed design
- generate one whole strip per action
- lock anchor to bottom-center
- keep frame counts aligned with current project action taxonomy
- use `JackalEnemy` logic for wolf / jackal beastmen
- use current chapter enemy classes to decide which motion family applies
