# 角色序列帧动画运行时绑定规则

## 问题背景

角色动画不播放时，优先检查以下三点：

- 场景对象是否有 `CharacterSpriteAnimationDriver`。
- 场景对象是否有 `CharacterConfigRuntimeBridge`，且 `_characterConfig` 指向对应 `CharacterConfigDefinition`。
- `CharacterConfigDefinition.Animations` 是否有 `idle`、`move`、`attack_01`、`skill_*` 等动画帧。

本项目的 `CharacterConfig_DogHero.asset`、`CharacterConfig_MeadowSlime.asset`、`CharacterConfig_CaveBat.asset` 等资产已经包含序列帧。问题通常出在场景生成器只创建了 `SpriteRenderer` 和 `CharacterSpriteAnimationDriver`，但没有把角色配置桥接到对象。

## 运行时规则

`CharacterSpriteAnimationDriver` 的优先级：

- 优先使用自身已分配的 `CharacterConfigDefinition`。
- 其次读取同物体或父物体上的 `CharacterConfigRuntimeBridge.CharacterConfig`。
- 如果旧场景缺少桥接配置，则从 `GameBootstrapConfig.DefaultPlayerCharacterConfig` 或 `DefaultEnemyCharacterConfigs` 兜底解析。

## 生成器规则

后续生成玩家或敌人时必须同时写入：

- `CharacterSpriteAnimationDriver`
- `CharacterConfigRuntimeBridge`
- `_targetRenderer`
- `_animationDriver`
- `_characterConfig`

玩家需要绑定 `CharacterConfig_DogHero.asset`。

敌人需要根据 `EnemyDefinition.Id` 绑定对应默认配置：

- 蜜蜂类：`CharacterConfig_PoisonBee.asset` 或 `CharacterConfig_BeeCaptain.asset`
- 蝙蝠类：`CharacterConfig_CaveBat.asset`
- 史莱姆类：`CharacterConfig_MeadowSlime.asset`
- 山鼠类：`CharacterConfig_MouseBandit.asset`
- Boss 蜂巢类：`CharacterConfig_HiveGuardian.asset`

## 启动配置

`GameBootstrapConfig` 新增：

- `DefaultPlayerCharacterConfig`
- `DefaultEnemyCharacterConfigs`

这些字段用于旧场景兜底和运行时自动恢复动画配置，不替代正式的 `CharacterConfigRuntimeBridge` 绑定。

## 验收

- 玩家待机时应播放 `idle` 循环。
- 玩家移动时应播放 `move` 循环。
- 普攻时应播放 `attack_01/02/03`。
- 技能释放时应播放技能动作或 fallback 技能动作。
- 敌人待机、移动、攻击、死亡应播放对应序列帧。

## 2026-05-25 Follow-up

- `CharacterSpriteAnimationDriver` now skips null frames inside an animation clip instead of falling back to the static default sprite for the whole clip.
- Added editor menu `Tools/WCDEL/��ɫ����/�ؽ�ȫ����ɫ����֡������`.
- The rebuild path regenerates placeholder sequence PNGs, rebinds all sample character config animation frame arrays, and imports generated single-frame PNGs as bottom-center anchored sprites.
- Generated frame sprites should use bottom-center pivot so the visual foot point stays stable while frames change.
- If Unity is open and character animation still jitters or stays static, run the rebuild menu once, then regenerate or reopen the gameplay scene.