# 33_设置 UI：键位、画面、声音、游戏性、手柄导航


> 设计边界说明：本项目可以参考《流放之路2》这类暗黑刷宝 ARPG 的信息架构、交互复杂度和系统深度，但不能一比一复制其 UI 视觉、图标、文字、专有数值、专有命名、具体排版截图。本批文档采用“同类结构 + 原创表现”的方式：界面功能、层级、预制体和数据绑定可直接用于 Unity 原型开发。


## 1. 设置界面总结构

```text
UI_SettingsRoot.prefab
├── DimBackground
├── WindowFrame
│   ├── Header
│   │   ├── TitleText
│   │   └── CloseButton
│   ├── LeftCategoryTabs
│   │   ├── GraphicsTab
│   │   ├── AudioTab
│   │   ├── GameplayTab
│   │   ├── InputTab
│   │   ├── UITab
│   │   └── AccessibilityTab
│   ├── CenterSettingsHost
│   └── Footer
│       ├── ApplyButton
│       ├── ResetButton
│       ├── DefaultButton
│       └── BackButton
└── ConfirmPopupAnchor
```

## 2. 画面设置

```text
UI_GraphicsSettingsPanel.prefab
├── ResolutionDropdown
├── WindowModeDropdown
├── VSyncToggle
├── FrameRateLimitDropdown
├── QualityPresetDropdown
├── TextureQualityDropdown
├── ShadowQualityDropdown
├── EffectQualityDropdown
├── AntiAliasingDropdown
├── MotionBlurToggle
├── CameraShakeSlider
└── BrightnessSlider
```

## 3. 声音设置

```text
UI_AudioSettingsPanel.prefab
├── MasterVolumeSlider
├── BGMVolumeSlider
├── SFXVolumeSlider
├── UIVolumeSlider
├── VoiceVolumeSlider
├── AmbientVolumeSlider
├── HitSoundVolumeSlider
├── LootSoundVolumeSlider
└── MuteWhenFocusLostToggle
```

## 4. 游戏性设置

```text
UI_GameplaySettingsPanel.prefab
├── AutoPickupCurrencyToggle
├── AlwaysShowLootToggle
├── LootFilterDropdown
├── DamageNumberModeDropdown
├── AutoCompareEquipmentToggle
├── HoldToMoveToggle
├── TargetLockModeDropdown
├── CameraFollowStrengthSlider
├── ScreenShakeIntensitySlider
├── AutoUseFlaskRuleButton
└── ConfirmBeforeDestroyRareToggle
```

## 5. 输入设置

```text
UI_InputSettingsPanel.prefab
├── DeviceTabs
│   ├── KeyboardMouseTab
│   └── GamepadTab
├── BindingCategoryTabs
│   ├── Movement
│   ├── Combat
│   ├── UI
│   ├── Inventory
│   └── Debug
├── BindingListScroll
│   └── UI_InputBindingRow[]
├── SensitivityPanel
│   ├── MouseSensitivitySlider
│   ├── GamepadLookSensitivitySlider
│   ├── AimAssistStrengthSlider
│   └── DeadZoneSlider
└── BottomButtons
    ├── ResetBindingButton
    ├── ImportPresetButton
    └── ExportPresetButton
```

## 6. 键位行 Prefab

```text
UI_InputBindingRow.prefab
├── ActionNameText
├── PrimaryKeyButton
├── SecondaryKeyButton
├── GamepadKeyButton
├── ConflictWarningIcon
├── ResetSingleButton
└── DescriptionTooltip
```

## 7. UI 设置

```text
UI_UISettingsPanel.prefab
├── UIScaleSlider
├── TooltipDelaySlider
├── FontSizeDropdown
├── ColorBlindModeDropdown
├── MinimapSizeSlider
├── HealthBarDisplayDropdown
├── ShowAdvancedAffixToggle
├── ShowItemLevelToggle
├── ShowCompareSummaryToggle
└── LanguageDropdown
```

## 8. 无障碍设置

```text
UI_AccessibilitySettingsPanel.prefab
├── ColorBlindModeDropdown
├── ReduceFlashToggle
├── ReduceCameraShakeToggle
├── LargerTextToggle
├── AutoAimAssistSlider
├── HoldInsteadMashToggle
├── SubtitleToggle
├── SubtitleSizeSlider
└── HighContrastLootToggle
```

## 9. 手柄导航规则

1. 每个 UI 控件必须挂 `UIFocusElement`。
2. 每个面板必须挂 `UIFocusNavigator`。
3. 默认焦点必须在打开窗口时设置。
4. 弹窗打开后焦点锁定在弹窗内。
5. Tooltip 不抢焦点。
6. 背包格子使用二维导航。
7. 天赋树使用摇杆移动虚拟光标，不使用普通格子导航。

## 10. 原型验收标准

1. 设置界面能切换 6 个设置页。
2. 键位可以重新绑定并检测冲突。
3. UI 缩放可以实时生效。
4. 鼠标和手柄都能完整操作设置界面。
5. 设置能保存到本地 JSON。
