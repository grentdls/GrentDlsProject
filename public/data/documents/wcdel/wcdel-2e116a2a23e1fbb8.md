# DNF Input HUD Hint Sync

## Goal

Continue the DNF-style control migration by making the current HUD reflect the latest keyboard input plan from `Docs/dnf_style_character_basic_controls_design.md`, while also restoring a reliable jump trigger path for the current prototype.

## Completed In This Round

### Keyboard Fallback Input Alignment

`GameInputReader` now includes keyboard fallback keys aligned with the DNF control design:

- `J` attack
- `K` jump
- `L` dodge
- `F` interact
- `U / I / O / H` skill 1-4
- `Space` ultimate

This means the runtime can still honor the intended controls even if the current `InputActionAsset` is missing or still carries older bindings.

### Jump Recovery

The current jump issue was traced to the input side rather than the jump runtime itself.

`PlayerActorController` now exposes a `TryUiJump()` entry so HUD-side temporary controls can also trigger the same jump chain used by keyboard input:

- `GameInputReader`
- `PlayerActorController`
- `PlayerJumpController`

### Temporary Left-Bottom Basic Controls Hint

The combat HUD now reserves a temporary bottom-left hint area for the baseline controls, keeping it away from the lower-middle combat zone:

- move
- attack
- jump
- dodge
- skill 1-4
- ultimate
- interact

This follows the existing UI rule of placing persistent control guidance at screen edges rather than over the combat field.

### Skill Slot Key Hint Direction

The skill bar update now targets the DNF keyboard layout for slot labeling:

- skill 1 -> `U`
- skill 2 -> `I`
- skill 3 -> `O`
- skill 4 -> `H`
- ultimate -> `Space`

The UI runtime also now owns these displayed hints more explicitly so the slot prompts stay aligned with the latest control spec.

## Verification

Planned validation for this round:

- `dotnet build WCDEL.sln /p:BuildProjectReferences=false`

## Remaining Boundaries

- the serialized `Assets/InputSystem_Actions.inputactions` asset still needs a dedicated cleanup pass so the authoring asset itself fully matches the DNF key map instead of relying partly on runtime fallback keys
- prefab regeneration in Unity is still required so generated HUD assets pick up the latest layout changes
- the temporary bottom-left controls hint is intentionally compact and not yet a final tutorial/onboarding surface
