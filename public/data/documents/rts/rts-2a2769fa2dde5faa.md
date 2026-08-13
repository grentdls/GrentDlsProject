# In-Game Settings

## Scope

This document tracks battle-time settings that are safe to expose in `InGameSettingsUI`.

## Rules

- Only expose a setting in battle UI after the runtime consumer has been implemented and verified.
- If a setting is saved but not yet consumed by gameplay/UI runtime code, hide it from the battle settings page instead of leaving a fake toggle.
- Runtime behavior should read from `UserInputSettingsStore.Current` or subscribe to `UserInputSettingsStore.SettingsChanged`.
- Pending or disconnected settings must stay out of the visible tab list; do not show development-status notes such as “being rebuilt” or “not yet configurable” inside the battle UI.

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
  - `PatrolCommandInput`
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
  - Survival `AutoSaveOnExit` (the explicit return-to-menu save flow)

Settings such as long-press detail display, selection priority, move/attack command
styles, survival auto-save interval/rotation/danger checkpoints, and campaign
dialogue/tutorial preferences remain hidden until their runtime consumers are
connected. The main-menu settings page follows the same rule and no longer shows
unconsumed toggles.

## Pending Reconnect

- Skill cast mode / smart cast
- Control group automation and card display
- Stop / retreat visibility toggles
- Advanced assist, vibration, hint switches
