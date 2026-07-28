# In-Game Settings

## Scope

This document tracks battle-time settings that are safe to expose in `InGameSettingsUI`.

## Rules

- Only expose a setting in battle UI after the runtime consumer has been implemented and verified.
- If a setting is saved but not yet consumed by gameplay/UI runtime code, hide it from the battle settings page instead of leaving a fake toggle.
- Runtime behavior should read from `UserInputSettingsStore.Current` or subscribe to `UserInputSettingsStore.SettingsChanged`.

## Currently Verified Runtime Settings

- Camera:
  - `DragPanEnabled`
  - `EdgePanEnabled`
  - `CameraMoveSpeed`
  - `CameraInertia`
  - `TouchZoomEnabled`
  - `DefaultCameraHeight`
- Controls:
  - `ClickSelectionTolerance`
  - `SelectionDragThreshold`
  - `LongPressBoxSelectDelay`
  - `DoubleClickSelectSameType`
  - `SelectionPriority`
- Build / Train:
  - `PlacementConfirmMode`
  - `ProductionQueueInput`
  - `ProductionAutoRally`
  - `AutoOpenProductionPanel`
- Casting:
  - `ShowAreaSkillPreview`
  - `SkillCancelInput`
- Assist:
  - `AttackAlertStrength`
  - `InsufficientResourcePrompt`
- Other:
  - `Language`
  - `ControlScheme`

## Pending Reconnect

- Skill cast mode / smart cast
- Control group automation and card display
- Stop / retreat visibility toggles
- Advanced assist, vibration, hint switches
