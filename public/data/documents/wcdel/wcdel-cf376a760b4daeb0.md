# Enemy Animation Image Generation Preparation And Application

## Goal

Prepare enemy animation prompt packages and asset manifests for the current insect enemy line, then apply generated sheets into the Unity project without changing the existing runtime animation hookup.

Current application scope:

- `PoisonBee`
- `BeeCaptain`
- `HiveGuardian`

Covered action ids:

- `spawn`
- `idle`
- `move`
- `jump`
- `dash`
- `attack_01`
- `skill_leaf`
- `hit`
- `dead`

## Pipeline Policy

The project-local pipeline is now offline-first.

- Do not call OpenAI Images API from the project script.
- Do not read `OPENAI_API_KEY`.
- Do not use the `openai` SDK directly for image generation.
- Prefer Codex built-in image generation outside the project script when the current session exposes it.
- If built-in image generation is not available, stop at prompt and task export.

The script keeps the existing asset-processing structure:

1. export prompt and task artifacts
2. generate source sheets outside this script when an approved generator exists
3. post-process source sheets into:
   - formal transparent strips under `Assets/Game/Art/Unit/EnemyActionPacks`
   - runtime-ready `96x96` frames under `Assets/Game/Runtime/CharacterConfigs/Animations`

## Helper Script

- `Tools/EnemyAnimation/imagegen_enemy_batch.py`

It provides:

1. `prepare-generation-package`
   - writes `prompts.json`
   - writes `asset_manifest.json`
   - writes `generation_tasks.json`
   - writes `pipeline_settings.json`
   - optionally writes `enemy_jobs.jsonl` only when `--use-api-image-generation` is explicitly enabled
2. `postprocess`
   - removes chroma background
   - slices generated grid sheets into ordered frames
   - normalizes per-enemy scale
   - exports formal transparent action strips
   - exports runtime-compatible frame PNGs
3. `postprocess-selected`
   - applies only selected built-in or externally generated source sheets
4. `import-runtime-to-formal`
   - backfills formal action-pack strips, frames, and manifest files from existing runtime PNG frames

## Default Prepare Flow

Export prompt and task artifacts only:

```powershell
python Tools/EnemyAnimation/imagegen_enemy_batch.py prepare-generation-package `
  --output-dir Temp/EnemyImageGen
```

If you only want selected actions:

```powershell
python Tools/EnemyAnimation/imagegen_enemy_batch.py prepare-generation-package `
  --output-dir Temp/EnemyImageGen `
  --selection Temp/EnemyImageGen/selection_poisonbee.json
```

If the current Codex session really exposes built-in image generation, mark that in the task package:

```powershell
python Tools/EnemyAnimation/imagegen_enemy_batch.py prepare-generation-package `
  --output-dir Temp/EnemyImageGen `
  --builtin-imagegen-supported
```

## Optional External API Artifact

The pipeline keeps a compatibility path for external API job files, but it is off by default.

Only if you intentionally want an external batch artifact:

```powershell
python Tools/EnemyAnimation/imagegen_enemy_batch.py prepare-generation-package `
  --output-dir Temp/EnemyImageGen `
  --use-api-image-generation `
  --include-api-jobs
```

Or export only the legacy JSONL file:

```powershell
python Tools/EnemyAnimation/imagegen_enemy_batch.py export-jobs `
  --output Temp/EnemyImageGen/enemy_jobs.jsonl `
  --use-api-image-generation
```

This script still does not send network requests. It only writes the optional job artifact.

## Apply Flow After Source Sheets Exist

Apply all generated source sheets:

```powershell
python Tools/EnemyAnimation/imagegen_enemy_batch.py postprocess `
  --generated-dir Temp/EnemyImageGen/generated `
  --master-root Assets/Game/Art/Unit/EnemyActionPacks `
  --runtime-root Assets/Game/Runtime/CharacterConfigs/Animations
```

Apply only selected source sheets:

```powershell
python Tools/EnemyAnimation/imagegen_enemy_batch.py postprocess-selected `
  --generated-dir Temp/EnemyImageGen/generated `
  --master-root Assets/Game/Art/Unit/EnemyActionPacks `
  --runtime-root Assets/Game/Runtime/CharacterConfigs/Animations `
  --selection Temp/EnemyImageGen/selection_spawn.json
```

Backfill formal action packs from existing runtime frames:

```powershell
python Tools/EnemyAnimation/imagegen_enemy_batch.py import-runtime-to-formal `
  --runtime-root Assets/Game/Runtime/CharacterConfigs/Animations `
  --master-root Assets/Game/Art/Unit/EnemyActionPacks `
  --selection Temp/EnemyImageGen/selection_bee_family_full.json
```

## Output Locations

Prompt package:

- `Temp/EnemyImageGen/prompts.json`
- `Temp/EnemyImageGen/asset_manifest.json`
- `Temp/EnemyImageGen/generation_tasks.json`
- `Temp/EnemyImageGen/pipeline_settings.json`

Optional external API artifact:

- `Temp/EnemyImageGen/enemy_jobs.jsonl`

Formal art:

- `Assets/Game/Art/Unit/EnemyActionPacks/<EnemyName>/Strips`
- `Assets/Game/Art/Unit/EnemyActionPacks/<EnemyName>/Frames`
- `Assets/Game/Art/Unit/EnemyActionPacks/<EnemyName>/Metadata/animation_manifest.json`

Runtime-applied art:

- `Assets/Game/Runtime/CharacterConfigs/Animations/<EnemyName>/`

## Notes

- The project-local script is now safe to run in environments without built-in image generation.
- The default pipeline outcome is a prompt package, not a network image request.
- Existing runtime clip ids and file naming rules stay unchanged.
- Re-run `prepare-generation-package` whenever enemy action coverage changes.
