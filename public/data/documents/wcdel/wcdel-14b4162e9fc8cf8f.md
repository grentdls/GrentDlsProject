# Image Generation Pipeline

## Purpose

This document defines the project-wide image generation policy for `WCDEL`.

The goal is to preserve the current asset pipeline structure while preventing accidental API-driven generation inside project-local scripts.

## Project Rules

1. Do not call OpenAI Images API from project-local image generation scripts.
2. Do not read `OPENAI_API_KEY` from project-local image generation scripts.
3. Do not use the `openai` SDK directly for image generation in project-local pipelines.
4. Prefer Codex built-in `$imagegen` or ImageGen capability when the current Codex session actually exposes it.
5. If built-in image generation is unavailable in the current session, stop at prompt packaging and task export.
6. Keep API-based generation as an explicit optional branch only:
   - `use_api_image_generation = false` by default
7. Keep existing post-processing and asset-application structure whenever possible.

## Current Project Entry Point

Current local pipeline script:

- `Tools/EnemyAnimation/imagegen_enemy_batch.py`

This script is allowed to:

- export prompts
- export asset manifests
- export pending task lists
- post-process already generated source sheets
- convert runtime frames back into formal action-pack assets

This script is not allowed to:

- generate images over the network
- read `OPENAI_API_KEY`
- import or invoke `openai`

## Built-in Image Generation Policy

If the current Codex environment exposes built-in image generation:

- use built-in generation outside the project script
- use `prompts.json` as the source of truth for requested image prompts
- save or copy the generated source sheets into a local workspace folder such as `Temp/EnemyImageGen/generated`
- then run the post-process step from the project script

If the current Codex environment does not expose built-in image generation:

- only export the prompt package
- do not attempt API fallback automatically
- do not ask the project script to generate online images

## Optional API Compatibility Branch

The project keeps a compatibility branch for external batch job files, but it is intentionally explicit and disabled by default.

Default:

```text
use_api_image_generation = false
```

This means:

- no API image generation should happen as part of the normal project flow
- optional JSONL job export is only a compatibility artifact
- any real network generation must be a separate, consciously approved workflow

## Standard Workflow

1. Prepare prompt package:

```powershell
python Tools/EnemyAnimation/imagegen_enemy_batch.py prepare-generation-package `
  --output-dir Temp/EnemyImageGen
```

2. If built-in image generation is available in Codex:
   - use the exported prompts to generate source sheets externally
   - place the resulting PNG files into `Temp/EnemyImageGen/generated`

3. Apply generated sheets:

```powershell
python Tools/EnemyAnimation/imagegen_enemy_batch.py postprocess `
  --generated-dir Temp/EnemyImageGen/generated `
  --master-root Assets/Game/Art/Unit/EnemyActionPacks `
  --runtime-root Assets/Game/Runtime/CharacterConfigs/Animations
```

4. If the project already has usable runtime frames, formalize them:

```powershell
python Tools/EnemyAnimation/imagegen_enemy_batch.py import-runtime-to-formal `
  --runtime-root Assets/Game/Runtime/CharacterConfigs/Animations `
  --master-root Assets/Game/Art/Unit/EnemyActionPacks `
  --selection Temp/EnemyImageGen/selection_bee_family_full.json
```

## Artifact Expectations

Prompt package artifacts:

- `prompts.json`
- `asset_manifest.json`
- `generation_tasks.json`
- `pipeline_settings.json`

Optional compatibility artifact:

- `enemy_jobs.jsonl`

Generated source sheets are expected to be plain local PNG files, usually placed under:

- `Temp/EnemyImageGen/generated`

## Verification

Minimum verification for pipeline changes:

- `python -m py_compile Tools/EnemyAnimation/imagegen_enemy_batch.py`
- run `prepare-generation-package`
- confirm `prompts.json`, `asset_manifest.json`, and `generation_tasks.json` were written
- confirm no API key read and no network image generation step was attempted

## Related Docs

- `Docs/features/enemy_animation_imagegen2_pipeline_and_application.md`
- `Docs/features/enemy_animation_prompt_pack_and_matrix.md`
