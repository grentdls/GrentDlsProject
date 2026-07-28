# 职业技能数据表：第一版 120 个技能

> 参考边界：本项目参考暗黑刷宝 ARPG 的系统结构：职业起点、主动技能、辅助模块、保留技能、触发技能、巨型被动树、职业专精树、装备词条联动、Boss 机制与终局构筑。
> 不直接复制任何商业游戏的职业名、技能名、图标、数值、UI截图、专有词条与怪物设定。下面所有职业、技能、天赋节点、数值区间、特效表现均为项目原创，用于 Unity 原型和后续美术/程序落地。

## 1. 数据表用途

这份表用于给策划、程序、美术、音效统一编号。所有技能进入 Unity 前必须先有 SkillId。

字段：

```text
ClassId, ClassName, SkillId, SkillName, Tags, CoreLogic
```

## 2. 技能清单

| ClassId | 职业 | SkillId | 技能 | 标签 | 核心逻辑 |
|---|---|---|---|---|---|
| CLASS_WARRIOR_GUARD | 重甲战士 | SK_CLASS_WARRIOR_GUARD_01 | 盾锋冲撞 | 位移/盾/打击 | 举盾短距离冲刺，撞到首个敌人造成击退和短眩晕；若撞墙追加震荡伤害。 |
| CLASS_WARRIOR_GUARD | 重甲战士 | SK_CLASS_WARRIOR_GUARD_02 | 裂岩重锤 | 近战/重击/范围 | 蓄力后向前砸地，中心高伤，外圈低伤；对破甲目标额外眩晕。 |
| CLASS_WARRIOR_GUARD | 重甲战士 | SK_CLASS_WARRIOR_GUARD_03 | 钢墙反击 | 防御/反击 | 短时间进入格挡姿态，成功格挡后自动反击前方敌人。 |
| CLASS_WARRIOR_GUARD | 重甲战士 | SK_CLASS_WARRIOR_GUARD_04 | 碎甲横扫 | 近战/破甲 | 横扫面前敌人，叠加破甲；满层破甲会引发护甲崩裂。 |
| CLASS_WARRIOR_GUARD | 重甲战士 | SK_CLASS_WARRIOR_GUARD_05 | 战吼·压阵 | 战吼/增益 | 嘲讽附近敌人，并使下一次重击范围扩大。 |
| CLASS_WARRIOR_GUARD | 重甲战士 | SK_CLASS_WARRIOR_GUARD_06 | 石肤守护 | 保留/防御 | 开启后提高护甲和抗击退，但降低移动速度。 |
| CLASS_WARRIOR_GUARD | 重甲战士 | SK_CLASS_WARRIOR_GUARD_07 | 断骨处决 | 近战/终结 | 对重眩晕、低生命或破甲满层目标造成高额终结伤害。 |
| CLASS_WARRIOR_GUARD | 重甲战士 | SK_CLASS_WARRIOR_GUARD_08 | 震荡踏步 | 位移/范围 | 向前重踏一步，对近身敌人造成打断，并获得怒势。 |
| CLASS_WARRIOR_GUARD | 重甲战士 | SK_CLASS_WARRIOR_GUARD_09 | 守卫锁链 | 控制/拉拽 | 投出锁链拉近普通敌人；对大型敌人则把自己拉向目标。 |
| CLASS_WARRIOR_GUARD | 重甲战士 | SK_CLASS_WARRIOR_GUARD_10 | 王盾坠击 | 大招/盾/范围 | 跃起砸盾，造成范围伤害并生成短暂护盾场。 |
| CLASS_MARAUDER_RAGE | 荒怒蛮王 | SK_CLASS_MARAUDER_RAGE_01 | 血斧连劈 | 近战/连段 | 连续三段斧击，第三段必定施加流血。 |
| CLASS_MARAUDER_RAGE | 荒怒蛮王 | SK_CLASS_MARAUDER_RAGE_02 | 荒怒跳斩 | 位移/重击 | 跳向目标区域，落地造成范围伤害；血怒越高范围越大。 |
| CLASS_MARAUDER_RAGE | 荒怒蛮王 | SK_CLASS_MARAUDER_RAGE_03 | 撕伤旋风 | 引导/近战 | 旋转前进，持续切割敌人；可移动但转向较慢。 |
| CLASS_MARAUDER_RAGE | 荒怒蛮王 | SK_CLASS_MARAUDER_RAGE_04 | 裂肉投斧 | 投射/流血 | 投出斧头，命中后回旋返回，可二次命中。 |
| CLASS_MARAUDER_RAGE | 荒怒蛮王 | SK_CLASS_MARAUDER_RAGE_05 | 怒吼·嗜战 | 战吼/增益 | 消耗血怒，短时间提高攻击速度和吸血。 |
| CLASS_MARAUDER_RAGE | 荒怒蛮王 | SK_CLASS_MARAUDER_RAGE_06 | 血债护体 | 防御/自伤 | 牺牲当前生命获得减伤护盾，护盾破裂时造成血爆。 |
| CLASS_MARAUDER_RAGE | 荒怒蛮王 | SK_CLASS_MARAUDER_RAGE_07 | 断首斩 | 终结/近战 | 对流血目标造成高伤；若击杀则刷新位移技能冷却。 |
| CLASS_MARAUDER_RAGE | 荒怒蛮王 | SK_CLASS_MARAUDER_RAGE_08 | 蛮力投掷 | 控制 | 抓取小型敌人扔向目标点，撞击产生范围伤害。 |
| CLASS_MARAUDER_RAGE | 荒怒蛮王 | SK_CLASS_MARAUDER_RAGE_09 | 先祖怒影 | 召唤/短时 | 召唤先祖幻影复制下一次近战技能。 |
| CLASS_MARAUDER_RAGE | 荒怒蛮王 | SK_CLASS_MARAUDER_RAGE_10 | 荒神暴走 | 大招/姿态 | 进入暴走姿态，不能格挡，但移动、攻速、吸血大幅提升。 |
| CLASS_RANGER_BOW | 长弓游侠 | SK_CLASS_RANGER_BOW_01 | 穿云箭 | 投射/物理 | 高速直线箭，距离越远伤害越高。 |
| CLASS_RANGER_BOW | 长弓游侠 | SK_CLASS_RANGER_BOW_02 | 散星射击 | 投射/多重 | 向前方扇形射出多支箭，近距离全中但单箭伤害低。 |
| CLASS_RANGER_BOW | 长弓游侠 | SK_CLASS_RANGER_BOW_03 | 寒霜箭雨 | 范围/冰 | 指定区域落下箭雨，造成冰缓和持续伤害。 |
| CLASS_RANGER_BOW | 长弓游侠 | SK_CLASS_RANGER_BOW_04 | 爆裂箭 | 火/延迟 | 箭矢插入目标或地面，短延迟后爆炸。 |
| CLASS_RANGER_BOW | 长弓游侠 | SK_CLASS_RANGER_BOW_05 | 疾风后跃 | 位移/射击 | 向后翻滚并向最近目标射击。 |
| CLASS_RANGER_BOW | 长弓游侠 | SK_CLASS_RANGER_BOW_06 | 猎物标记 | 诅咒/标记 | 标记单体，投射物优先追踪并提高暴击。 |
| CLASS_RANGER_BOW | 长弓游侠 | SK_CLASS_RANGER_BOW_07 | 回旋刃箭 | 投射/返回 | 射出回旋箭，返回时再次命中。 |
| CLASS_RANGER_BOW | 长弓游侠 | SK_CLASS_RANGER_BOW_08 | 缠网陷阱 | 陷阱/控制 | 布置陷阱，触发后定身敌人。 |
| CLASS_RANGER_BOW | 长弓游侠 | SK_CLASS_RANGER_BOW_09 | 毒羽连射 | 毒/持续 | 快速射出毒箭，叠加中毒。 |
| CLASS_RANGER_BOW | 长弓游侠 | SK_CLASS_RANGER_BOW_10 | 天穹狙击 | 大招/蓄力 | 长时间瞄准后射出贯穿地图的巨箭。 |
| CLASS_HUNTRESS_SPEAR | 猎矛行者 | SK_CLASS_HUNTRESS_SPEAR_01 | 破阵突刺 | 近战/突进 | 向前长距离突刺，可穿过小型敌人。 |
| CLASS_HUNTRESS_SPEAR | 猎矛行者 | SK_CLASS_HUNTRESS_SPEAR_02 | 回收投矛 | 投射/返回 | 投出长矛，二次按键召回，返回路径也可命中。 |
| CLASS_HUNTRESS_SPEAR | 猎矛行者 | SK_CLASS_HUNTRESS_SPEAR_03 | 雷鸣标枪 | 电/投射 | 投出带雷电的标枪，命中后链向附近敌人。 |
| CLASS_HUNTRESS_SPEAR | 猎矛行者 | SK_CLASS_HUNTRESS_SPEAR_04 | 环矛扫击 | 近战/范围 | 旋转长矛扫击周围敌人，外圈伤害更高。 |
| CLASS_HUNTRESS_SPEAR | 猎矛行者 | SK_CLASS_HUNTRESS_SPEAR_05 | 狩猎翻越 | 位移 | 翻越目标或障碍，落地获得狩印。 |
| CLASS_HUNTRESS_SPEAR | 猎矛行者 | SK_CLASS_HUNTRESS_SPEAR_06 | 毒沼矛阵 | 地面/毒 | 插下数根毒矛形成毒沼，持续伤害。 |
| CLASS_HUNTRESS_SPEAR | 猎矛行者 | SK_CLASS_HUNTRESS_SPEAR_07 | 盾矛架势 | 姿态/反击 | 举盾架矛，正面受击后自动突刺反击。 |
| CLASS_HUNTRESS_SPEAR | 猎矛行者 | SK_CLASS_HUNTRESS_SPEAR_08 | 猎物钉刺 | 控制 | 把小型敌人钉在地面；对 Boss 施加破绽。 |
| CLASS_HUNTRESS_SPEAR | 猎矛行者 | SK_CLASS_HUNTRESS_SPEAR_09 | 风暴矛雨 | 范围/持续 | 向空中抛出大量短矛，延迟落下。 |
| CLASS_HUNTRESS_SPEAR | 猎矛行者 | SK_CLASS_HUNTRESS_SPEAR_10 | 万矛归一 | 大招/爆发 | 召回所有场上的矛影，汇聚到目标点爆炸。 |
| CLASS_MERC_CROSSBOW | 弩炮佣兵 | SK_CLASS_MERC_CROSSBOW_01 | 连弩扫射 | 射击/引导 | 按住持续射击，移动速度降低，可小角度转向。 |
| CLASS_MERC_CROSSBOW | 弩炮佣兵 | SK_CLASS_MERC_CROSSBOW_02 | 穿甲重弹 | 射击/穿透 | 发射一枚慢速高伤穿甲弹，对护甲敌人额外伤害。 |
| CLASS_MERC_CROSSBOW | 弩炮佣兵 | SK_CLASS_MERC_CROSSBOW_03 | 冰霜霰弹 | 射击/冰 | 近距离扇形霰弹，造成冰缓。 |
| CLASS_MERC_CROSSBOW | 弩炮佣兵 | SK_CLASS_MERC_CROSSBOW_04 | 燃油榴弹 | 抛射/火 | 抛出榴弹，在地面留下燃烧油区。 |
| CLASS_MERC_CROSSBOW | 弩炮佣兵 | SK_CLASS_MERC_CROSSBOW_05 | 战术翻滚 | 位移/装填 | 翻滚并自动装填当前武器，下一发强化。 |
| CLASS_MERC_CROSSBOW | 弩炮佣兵 | SK_CLASS_MERC_CROSSBOW_06 | 部署哨戒炮 | 召唤/炮塔 | 放置自动攻击炮塔，持续一段时间。 |
| CLASS_MERC_CROSSBOW | 弩炮佣兵 | SK_CLASS_MERC_CROSSBOW_07 | 电磁网弹 | 控制/电 | 发射网弹，命中后束缚并造成电击。 |
| CLASS_MERC_CROSSBOW | 弩炮佣兵 | SK_CLASS_MERC_CROSSBOW_08 | 爆破地雷 | 陷阱/爆炸 | 放置地雷，再次按键引爆。 |
| CLASS_MERC_CROSSBOW | 弩炮佣兵 | SK_CLASS_MERC_CROSSBOW_09 | 标记烟雾弹 | 辅助/区域 | 投出烟雾，敌人命中下降，友方暴击提高。 |
| CLASS_MERC_CROSSBOW | 弩炮佣兵 | SK_CLASS_MERC_CROSSBOW_10 | 轨道轰击 | 大招/范围 | 锁定区域后多轮炮火轰炸。 |
| CLASS_TEMPLAR_JUDGE | 圣锤裁决者 | SK_CLASS_TEMPLAR_JUDGE_01 | 裁决锤击 | 近战/圣光 | 锤击目标并生成短暂神圣印记。 |
| CLASS_TEMPLAR_JUDGE | 圣锤裁决者 | SK_CLASS_TEMPLAR_JUDGE_02 | 烈阳投锤 | 投射/返回 | 投出燃烧圣锤，返回时治疗自身少量生命。 |
| CLASS_TEMPLAR_JUDGE | 圣锤裁决者 | SK_CLASS_TEMPLAR_JUDGE_03 | 审判光柱 | 法术/延迟 | 在目标脚下召唤光柱，延迟后爆发。 |
| CLASS_TEMPLAR_JUDGE | 圣锤裁决者 | SK_CLASS_TEMPLAR_JUDGE_04 | 圣盾庇护 | 防御/区域 | 展开护盾场，降低场内友方受到的投射物伤害。 |
| CLASS_TEMPLAR_JUDGE | 圣锤裁决者 | SK_CLASS_TEMPLAR_JUDGE_05 | 净化火环 | 火/范围 | 以自身为中心释放火环，驱散部分负面状态。 |
| CLASS_TEMPLAR_JUDGE | 圣锤裁决者 | SK_CLASS_TEMPLAR_JUDGE_06 | 罪印锁链 | 控制/诅咒 | 标记敌人，敌人移动会受到持续圣伤。 |
| CLASS_TEMPLAR_JUDGE | 圣锤裁决者 | SK_CLASS_TEMPLAR_JUDGE_07 | 信念战旗 | 召唤/增益 | 插下战旗，区域内格挡和抗性提高。 |
| CLASS_TEMPLAR_JUDGE | 圣锤裁决者 | SK_CLASS_TEMPLAR_JUDGE_08 | 锤盾连携 | 连段/近战 | 盾击接锤击，盾击打断，锤击处决。 |
| CLASS_TEMPLAR_JUDGE | 圣锤裁决者 | SK_CLASS_TEMPLAR_JUDGE_09 | 赦罪祷言 | 治疗/保留 | 消耗信念治疗自己和召唤物。 |
| CLASS_TEMPLAR_JUDGE | 圣锤裁决者 | SK_CLASS_TEMPLAR_JUDGE_10 | 天罚圣域 | 大招/区域 | 创造大型圣域，多次审判区域内敌人。 |
| CLASS_MONK_STORM | 风雷武僧 | SK_CLASS_MONK_STORM_01 | 三相拳 | 近战/连段 | 三段拳击，按节奏输入可提高第三段范围。 |
| CLASS_MONK_STORM | 风雷武僧 | SK_CLASS_MONK_STORM_02 | 雷步穿身 | 位移/电 | 瞬步穿过敌人，留下闪电残影。 |
| CLASS_MONK_STORM | 风雷武僧 | SK_CLASS_MONK_STORM_03 | 冰掌震 | 近战/冰 | 掌击造成冰缓，若目标已冰缓则产生冰爆。 |
| CLASS_MONK_STORM | 风雷武僧 | SK_CLASS_MONK_STORM_04 | 旋棍风墙 | 防御/近战 | 旋转棍棒形成风墙，削弱投射物并打击近身敌人。 |
| CLASS_MONK_STORM | 风雷武僧 | SK_CLASS_MONK_STORM_05 | 气刃波 | 投射/法术 | 挥出气刃，消耗气脉增加数量。 |
| CLASS_MONK_STORM | 风雷武僧 | SK_CLASS_MONK_STORM_06 | 震魂踢 | 控制/近战 | 踢击敌人，打断施法；对异常目标额外眩晕。 |
| CLASS_MONK_STORM | 风雷武僧 | SK_CLASS_MONK_STORM_07 | 风雷架势 | 姿态/保留 | 持续消耗精神资源，命中时有概率追加电击。 |
| CLASS_MONK_STORM | 风雷武僧 | SK_CLASS_MONK_STORM_08 | 寒镜反击 | 反击/冰 | 闪避成功后可释放，召唤冰镜反射伤害。 |
| CLASS_MONK_STORM | 风雷武僧 | SK_CLASS_MONK_STORM_09 | 空明连环 | 连段/爆发 | 短时间内技能无视部分前摇，但每次释放消耗气脉。 |
| CLASS_MONK_STORM | 风雷武僧 | SK_CLASS_MONK_STORM_10 | 天雷落掌 | 大招/电/范围 | 跃起后落掌，引发多段天雷。 |
| CLASS_SHADOW_ASSASSIN | 暗影刺客 | SK_CLASS_SHADOW_ASSASSIN_01 | 影步背刺 | 位移/近战 | 瞬移到目标背后刺击，背击必定暴击。 |
| CLASS_SHADOW_ASSASSIN | 暗影刺客 | SK_CLASS_SHADOW_ASSASSIN_02 | 毒牙连刺 | 近战/毒 | 快速多段刺击，叠加中毒。 |
| CLASS_SHADOW_ASSASSIN | 暗影刺客 | SK_CLASS_SHADOW_ASSASSIN_03 | 烟幕消隐 | 防御/隐身 | 释放烟幕并短暂隐身，下一击强化。 |
| CLASS_SHADOW_ASSASSIN | 暗影刺客 | SK_CLASS_SHADOW_ASSASSIN_04 | 暗器飞星 | 投射/多重 | 扔出多枚飞星，优先命中被标记目标。 |
| CLASS_SHADOW_ASSASSIN | 暗影刺客 | SK_CLASS_SHADOW_ASSASSIN_05 | 影缚陷阱 | 陷阱/控制 | 触发后束缚敌人并暴露背部弱点。 |
| CLASS_SHADOW_ASSASSIN | 暗影刺客 | SK_CLASS_SHADOW_ASSASSIN_06 | 腐蚀刃阵 | 范围/持续 | 在周围生成旋转毒刃，持续切割近身敌人。 |
| CLASS_SHADOW_ASSASSIN | 暗影刺客 | SK_CLASS_SHADOW_ASSASSIN_07 | 残像诱饵 | 召唤/嘲讽 | 召唤残像吸引敌人，残像消失时爆炸。 |
| CLASS_SHADOW_ASSASSIN | 暗影刺客 | SK_CLASS_SHADOW_ASSASSIN_08 | 割喉处决 | 终结/近战 | 对低生命或满毒目标释放高伤处决。 |
| CLASS_SHADOW_ASSASSIN | 暗影刺客 | SK_CLASS_SHADOW_ASSASSIN_09 | 毒爆引信 | 触发/毒 | 引爆目标身上的中毒层数，造成范围毒爆。 |
| CLASS_SHADOW_ASSASSIN | 暗影刺客 | SK_CLASS_SHADOW_ASSASSIN_10 | 千影无踪 | 大招/爆发 | 分出多个影分身连续刺杀周围敌人。 |
| CLASS_SORCERER_ELEMENT | 元素术士 | SK_CLASS_SORCERER_ELEMENT_01 | 余烬弹 | 火/投射 | 发射火球，命中爆炸并点燃。 |
| CLASS_SORCERER_ELEMENT | 元素术士 | SK_CLASS_SORCERER_ELEMENT_02 | 冰棘环 | 冰/范围 | 周围生成冰刺环，击退并冰缓敌人。 |
| CLASS_SORCERER_ELEMENT | 元素术士 | SK_CLASS_SORCERER_ELEMENT_03 | 雷链术 | 电/连锁 | 闪电在敌人间跳跃。 |
| CLASS_SORCERER_ELEMENT | 元素术士 | SK_CLASS_SORCERER_ELEMENT_04 | 流星残火 | 火/延迟 | 指定区域落下小流星，留下燃烧地面。 |
| CLASS_SORCERER_ELEMENT | 元素术士 | SK_CLASS_SORCERER_ELEMENT_05 | 霜镜护盾 | 防御/冰 | 生成护盾，护盾破裂时冰冻附近敌人。 |
| CLASS_SORCERER_ELEMENT | 元素术士 | SK_CLASS_SORCERER_ELEMENT_06 | 电能位移 | 位移/电 | 短距离闪现，起点和终点造成电击。 |
| CLASS_SORCERER_ELEMENT | 元素术士 | SK_CLASS_SORCERER_ELEMENT_07 | 元素汇流 | 保留/增益 | 轮流提高火、冰、雷一种元素伤害。 |
| CLASS_SORCERER_ELEMENT | 元素术士 | SK_CLASS_SORCERER_ELEMENT_08 | 寒星坠落 | 冰/范围 | 召唤冰星坠落，中心高冰冻积累。 |
| CLASS_SORCERER_ELEMENT | 元素术士 | SK_CLASS_SORCERER_ELEMENT_09 | 超载闪爆 | 电/爆发 | 消耗全部秘能造成大范围电爆，秘能越高范围越大。 |
| CLASS_SORCERER_ELEMENT | 元素术士 | SK_CLASS_SORCERER_ELEMENT_10 | 三相天灾 | 大招/元素 | 连续释放火雨、冰环、雷暴三段。 |
| CLASS_WITCH_SOUL | 亡魂女巫 | SK_CLASS_WITCH_SOUL_01 | 召唤骨卫 | 召唤/仆从 | 召唤近战骨卫，数量受精神资源限制。 |
| CLASS_WITCH_SOUL | 亡魂女巫 | SK_CLASS_WITCH_SOUL_02 | 怨灵箭 | 混沌/投射 | 发射怨灵投射物，命中诅咒目标会分裂。 |
| CLASS_WITCH_SOUL | 亡魂女巫 | SK_CLASS_WITCH_SOUL_03 | 腐疫蔓延 | 持续/混沌 | 对目标施加疾病，目标死亡传播给附近敌人。 |
| CLASS_WITCH_SOUL | 亡魂女巫 | SK_CLASS_WITCH_SOUL_04 | 尸爆咒 | 尸体/爆炸 | 引爆尸体造成范围伤害。 |
| CLASS_WITCH_SOUL | 亡魂女巫 | SK_CLASS_WITCH_SOUL_05 | 灵魂锁链 | 控制/诅咒 | 链接多个敌人，共享部分受到的持续伤害。 |
| CLASS_WITCH_SOUL | 亡魂女巫 | SK_CLASS_WITCH_SOUL_06 | 献祭骨卫 | 献祭/爆发 | 牺牲一个召唤物，获得护盾并爆炸。 |
| CLASS_WITCH_SOUL | 亡魂女巫 | SK_CLASS_WITCH_SOUL_07 | 黑雾护体 | 防御/保留 | 开启后提高混沌抗性，附近敌人命中下降。 |
| CLASS_WITCH_SOUL | 亡魂女巫 | SK_CLASS_WITCH_SOUL_08 | 亡者奔涌 | 召唤/冲锋 | 召唤一波短命亡魂向前冲锋。 |
| CLASS_WITCH_SOUL | 亡魂女巫 | SK_CLASS_WITCH_SOUL_09 | 痛苦印记 | 诅咒/增伤 | 目标受到召唤物伤害提高，死亡后回魂火。 |
| CLASS_WITCH_SOUL | 亡魂女巫 | SK_CLASS_WITCH_SOUL_10 | 冥河开门 | 大招/召唤 | 打开冥门，持续召唤短命亡魂并强化所有仆从。 |
| CLASS_DRUID_SHIFT | 变形德鲁伊 | SK_CLASS_DRUID_SHIFT_01 | 野性变身·熊 | 变形/防御 | 变为熊形态，提高生命和护甲，替换部分技能。 |
| CLASS_DRUID_SHIFT | 变形德鲁伊 | SK_CLASS_DRUID_SHIFT_02 | 野性变身·狼 | 变形/机动 | 变为狼形态，提高移速和流血伤害。 |
| CLASS_DRUID_SHIFT | 变形德鲁伊 | SK_CLASS_DRUID_SHIFT_03 | 荆棘缠根 | 自然/控制 | 从地面召唤藤蔓缠绕敌人。 |
| CLASS_DRUID_SHIFT | 变形德鲁伊 | SK_CLASS_DRUID_SHIFT_04 | 月火弹 | 法术/火 | 人形发射自然火弹，命中留下燃烧花斑。 |
| CLASS_DRUID_SHIFT | 变形德鲁伊 | SK_CLASS_DRUID_SHIFT_05 | 熊灵拍击 | 熊形/近战 | 熊掌拍击前方，造成击倒。 |
| CLASS_DRUID_SHIFT | 变形德鲁伊 | SK_CLASS_DRUID_SHIFT_06 | 狼影撕咬 | 狼形/近战 | 快速撕咬，流血目标受到额外伤害。 |
| CLASS_DRUID_SHIFT | 变形德鲁伊 | SK_CLASS_DRUID_SHIFT_07 | 召唤藤卫 | 召唤/自然 | 召唤藤木守卫，嘲讽附近敌人。 |
| CLASS_DRUID_SHIFT | 变形德鲁伊 | SK_CLASS_DRUID_SHIFT_08 | 自然复苏 | 治疗/区域 | 生成治疗区域，友方持续恢复。 |
| CLASS_DRUID_SHIFT | 变形德鲁伊 | SK_CLASS_DRUID_SHIFT_09 | 飞龙吐息 | 变形/火/引导 | 短暂化为飞龙向前喷火。 |
| CLASS_DRUID_SHIFT | 变形德鲁伊 | SK_CLASS_DRUID_SHIFT_10 | 古树降临 | 大招/自然 | 召唤古树砸下并形成大范围荆棘区。 |
| CLASS_ORACLE_PRIEST | 神谕祭司 | SK_CLASS_ORACLE_PRIEST_01 | 星火符牌 | 法术/投射 | 投出符牌，命中后附着并延迟爆发。 |
| CLASS_ORACLE_PRIEST | 神谕祭司 | SK_CLASS_ORACLE_PRIEST_02 | 预言护盾 | 防御/触发 | 获得护盾；护盾破裂时自动释放一次小法术。 |
| CLASS_ORACLE_PRIEST | 神谕祭司 | SK_CLASS_ORACLE_PRIEST_03 | 昼夜轮转 | 姿态/保留 | 在光/暗姿态间切换：光提高护盾，暗提高持续伤害。 |
| CLASS_ORACLE_PRIEST | 神谕祭司 | SK_CLASS_ORACLE_PRIEST_04 | 圣铃震荡 | 图腾/范围 | 放置圣铃，周期性震荡伤害并暴露敌人。 |
| CLASS_ORACLE_PRIEST | 神谕祭司 | SK_CLASS_ORACLE_PRIEST_05 | 命运束缚 | 控制/诅咒 | 束缚目标，目标受到伤害的一部分延迟结算。 |
| CLASS_ORACLE_PRIEST | 神谕祭司 | SK_CLASS_ORACLE_PRIEST_06 | 星轨法阵 | 区域/增益 | 画出法阵，站在其中施法速度提高。 |
| CLASS_ORACLE_PRIEST | 神谕祭司 | SK_CLASS_ORACLE_PRIEST_07 | 暗月灼蚀 | 持续/暗 | 对目标施加暗蚀，护盾越高持续伤害越高。 |
| CLASS_ORACLE_PRIEST | 神谕祭司 | SK_CLASS_ORACLE_PRIEST_08 | 晨曦爆印 | 光/爆发 | 引爆目标身上的光印，治疗自身。 |
| CLASS_ORACLE_PRIEST | 神谕祭司 | SK_CLASS_ORACLE_PRIEST_09 | 神谕重置 | 功能/冷却 | 消耗所有预兆，减少最近使用技能的冷却。 |
| CLASS_ORACLE_PRIEST | 神谕祭司 | SK_CLASS_ORACLE_PRIEST_10 | 终末预言 | 大招/触发 | 标记区域，短延迟后按敌人当前负面状态数量造成多段伤害。 |

## 3. 下一步数据拆分

每个技能后续还要拆到 CSV / JSON / ScriptableObject：

```text
SkillCoreData.csv
SkillDamageData.csv
SkillHitboxData.csv
SkillProjectileData.csv
SkillVFXBinding.csv
SkillSFXBinding.csv
SkillUnlockData.csv
SkillSupportCompatibility.csv
```
