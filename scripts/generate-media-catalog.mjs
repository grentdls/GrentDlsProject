import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const generatedRoot = "C:/Users/Admin/.codex/generated_images/019fa69e-3020-7612-85e3-4ad62106993e";
const media = {
  tuntun: [
    ["G:/TestProject/TunTunJianChuan/Assets/Art/UI/Generated/MainMenu_SeaBattle_BG.png","实机素材","海战主菜单视觉","用于建立移动堡垒与海上战斗的第一视觉印象。"],
    ["G:/TestProject/TunTunJianChuan/Assets/Art/UI/Generated/Mode_RoguelikeExpedition_Cover.png","模式封面","肉鸽远征模式","展示短局航行、战斗和局内成长的模式定位。"],
    ["G:/TestProject/TunTunJianChuan/Assets/Art/UI/Generated/Loadout_Drydock_BG.png","UI","干船坞装配背景","用于舰船、英雄与装备装配界面的空间背景。"],
    ["G:/TestProject/TunTunJianChuan/Assets/Resources/PirateCareer/HeroFleet/Art/HeroPortraitAtlas_v1.png","角色美术","英雄头像图集","英雄舰队系统的批量角色头像资产。"],
    ["G:/TestProject/TunTunJianChuan/Logs/PirateCareerAdventureMap_UI.png","UI","海盗生涯冒险地图","项目运行记录中的地图界面与节点组织。"],
    ["G:/TestProject/TunTunJianChuan/Logs/PirateCareerShipUpgrade_UI.png","UI","舰船升级界面","舰船成长、升级选择与反馈层级的运行记录。"],
    ["G:/TestProject/TunTunJianChuan/Assets/Art/UI/Generated/Weapon_Broadside.png","图标","侧舷炮武器图标","主舰武器与战斗构筑的功能图标。"],
    ["G:/TestProject/TunTunJianChuan/Assets/Art/UI/Generated/Weapon_Torpedo.png","图标","鱼雷武器图标","用于区分攻击方式和构筑方向。"]
  ],
  wcdel: [
    [`${generatedRoot}/call_S22aIyMAtjv25AdFTIzDJxIW.png`,"生成封面","轻量开放世界 ARPG 概念封面","依据项目 GDD 生成的视觉目标，不标记为实机画面。"],
    ["G:/TestProject/WCDEL/Assets/Game/Art/Unit/Wangcai_CharacterEffect_BoxSplit_v2/03_Transparent_Original/Wangcai_01_idle.png","角色美术","旺财角色待机表现","主角动作与角色特效拆分资产。"],
    ["G:/TestProject/WCDEL/Assets/Game/Art/Unit/Wangcai_CharacterEffect_BoxSplit_v2/03_Transparent_Original/Wangcai_09_attack_03.png","动作预览","主角攻击动作","战斗动作序列与技能反馈资产。"],
    ["G:/TestProject/WCDEL/Assets/Game/Art/Unit/Wangcai_CharacterEffect_BoxSplit_v2/03_Transparent_Original/Wangcai_18_ultimate_fire_ring.png","特效预览","终结技能火环","角色动作与技能特效合成预览。"],
    ["G:/TestProject/WCDEL/output/imagegen/chapter01_skill_equipment_icons/generated/skills/skill_frost_nova.png","图标","冰霜新星技能图标","首章技能与装备图标生产管线的结果。"],
    ["G:/TestProject/WCDEL/output/imagegen/chapter01_skill_equipment_icons/generated/equipment/equipment_village_sword.png","图标","村落长剑装备图标","装备内容与图标规格的落地样例。"],
    ["G:/TestProject/WCDEL/Assets/Game/Art/Environment/Chapter01/SourceSheets/UserEnvironmentPack_20260701/rural_buildings_01.png","场景美术","首章乡村建筑组","用于开放世界村落与道路目标点的环境资产。"],
    ["G:/TestProject/WCDEL/Assets/Game/Art/Environment/Chapter01/SourceSheets/UserEnvironmentPack_20260701/ground.png","场景美术","首章地表资产","关卡搭建中的地形与路径基础素材。"]
  ],
  star: [
    ["G:/TestProject/zhuomian/output/starraiders_planet_background_preview/planet_background_preview.png","场景美术","星球背景预览","桌面窗口航行和星球远征的背景视觉。"],
    ["G:/TestProject/zhuomian/output/starraiders_unit_art_preview/unit_art_preview.png","角色美术","单位美术总览","飞船船员、职业和种族单位的批量资产预览。"],
    ["G:/TestProject/zhuomian/output/starraiders_building_art_preview/building_art_preview.png","模型预览","飞船建筑总览","模块化飞船房间与建筑美术预览。"],
    ["G:/TestProject/zhuomian/output/starraiders_ui_panel_preview/ui_panel_preview.png","UI","桌面窗口 UI 面板","桌面常驻模式的信息面板与视觉层级。"],
    ["G:/TestProject/zhuomian/output/starraiders_combat_fx_preview/combat_fx_preview.png","特效预览","战斗特效总览","自动战斗、武器命中与技能反馈资产。"],
    ["G:/TestProject/zhuomian/output/starraiders_icon_preview/content_icon_preview.png","图标","内容图标总览","资源、建筑、单位与功能入口的图标系统。"],
    ["G:/TestProject/zhuomian/Logs/starraiders_window_capture.png","实机截图","桌面窗口运行画面","桌面挂机窗口形态的实际运行记录。"],
    ["G:/TestProject/zhuomian/Assets/Resources/StarRaiders/UI/background_starfield.png","场景美术","动态星空背景","桌面底栏和侧栏模式使用的基础背景。"]
  ],
  rts: [
    [`${generatedRoot}/call_v2AB9Em2kpKFwTFGJQ7kaYrs.png`,"生成封面","华夏城战概念封面","依据阵营、主城占领和融合科技树生成的视觉目标。"],
    ["G:/TestProject/TestRTS2/Assets/Resources/UI/Skins/WarfareClassic/Panel_StoneGold.png","UI","战争风格主面板","建造、科技与选择详情的面板皮肤。"],
    ["G:/TestProject/TestRTS2/Assets/Resources/UI/MainMenuSprites/Panel_MapFrame.png","UI","战役地图框架","主菜单与阵营地图展示的界面资产。"],
    ["G:/TestProject/TestRTS2/Assets/Resources/UI/Icons/WarfareClassic/unit_infantry.png","图标","步兵单位图标","单位分类和生产列表的识别资产。"],
    ["G:/TestProject/TestRTS2/Assets/Resources/UI/Icons/WarfareClassic/unit_siege.png","图标","攻城单位图标","攻城职责与生产入口图标。"],
    ["G:/TestProject/TestRTS2/Assets/Resources/UI/Icons/WarfareClassic/building_technology.png","图标","科技建筑图标","科技树和建筑前置关系的视觉节点。"],
    ["G:/TestProject/TestRTS2/Assets/Resources/UI/Icons/WarfareClassic/skill_summon.png","图标","召唤技能图标","单位技能与喊名冒泡系统的内容资产。"],
    ["G:/TestProject/TestRTS2/Assets/Resources/UI/Skins/WarfareClassic/Card_FrameGold.png","UI","单位与科技卡框","多阵营内容卡片的统一框架。"]
  ],
  arpg: [
    ["G:/TestProject/RPG/Assets/_Game/Resources/UI/MapPreviews/map_forest.png","场景美术","腐林地图预览","副本选择和地图内容的场景预览。"],
    ["G:/TestProject/RPG/Assets/_Game/Resources/UI/MapPreviews/map_dungeon.png","场景美术","地下城地图预览","地下副本的环境主题与入口素材。"],
    ["G:/TestProject/RPG/Assets/_Game/Resources/UI/MapPreviews/map_coast.png","场景美术","星陨海岸地图预览","首章区域与敌人池关联的地图资产。"],
    ["G:/TestProject/RPG/Assets/_Game/Resources/UI/MapPreviews/map_wasteland.png","场景美术","荒地地图预览","终局地图与词缀系统的场景包装。"],
    ["G:/TestProject/RPG/Assets/_Game/Resources/UI/MapPreviews/map_rift.png","场景美术","裂隙地图预览","高阶挑战和终局循环的地图视觉。"],
    ["G:/TestProject/RPG/Assets/_Game/Resources/UI/MapPreviews/map_ash.png","场景美术","灰烬区域预览","章节、副本和怪物池的区域视觉。"]
  ],
  one: [
    [`${generatedRoot}/call_fjr1H2XIG9FXWdUKSLuJInhP.png`,"生成封面","击败音乐狂人概念封面","依据反幸存者、AI 英雄和节奏弹幕生成的视觉目标。"],
    ["G:/TestProject/One/Assets/Resources/ReverseSurvivorArt/ui/promo_main.png","UI","项目主宣传画面","反幸存者玩法的项目内主视觉资产。"],
    ["G:/TestProject/One/Assets/Resources/ReverseSurvivorArt/characters/hero_music_maniac_animation_preview.png","动作预览","音乐狂人动作总览","AI 英雄待机、攻击、施法和受击动作预览。"],
    ["G:/TestProject/One/Assets/Resources/ReverseSurvivorArt/vfx/fx_animation_preview.png","特效预览","弹幕与范围特效总览","节奏弹幕、范围警告和元素攻击表现。"],
    ["G:/TestProject/One/Assets/Resources/ReverseSurvivorArt/ui/ui_rhythm_lane.png","UI","战斗节拍轨道","让玩家预判 AI 攻击节奏的信息组件。"],
    ["G:/TestProject/One/Assets/Resources/ReverseSurvivorArt/ui/ui_panel_creator.png","UI","造物主控制面板","召怪、技能与关卡导演操作的界面资产。"],
    ["G:/TestProject/One/Assets/Resources/ReverseSurvivorArt/projectiles/projectile_sonic_ring.png","特效预览","音波环弹体","音乐主题弹幕形态与伤害反馈资产。"],
    ["G:/TestProject/One/Assets/Resources/ReverseSurvivorArt/projectiles/projectile_poison_note.png","特效预览","毒音符弹体","流派辨识和元素弹幕的视觉样例。"]
  ],
  castle: [
    [`${generatedRoot}/call_g3El3ZvcTBVq9RaM38KioAoJ.png`,"生成封面","亲密城堡概念封面","使用抽象关系张力与卡牌对决表达的非实机视觉目标。"],
    ["G:/TestProject/HSJT/Assets/Resources/GameArt/ZhengShi/Characters/Player/MaleTraveler/Idle/character_idle_greenscreen.png","角色美术","主角待机序列源图","角色动作制作与序列帧规范的项目资产。"],
    ["G:/TestProject/HSJT/Assets/Resources/GameArt/ZhengShi/Characters/Opponents/Common/NvPu/Idle/ChatGPT Image 2026年6月1日 23_04_24.png","角色美术","对手角色待机表现","对手角色与战斗表现管线的资产样例。"],
    ["G:/TestProject/HSJT/Assets/Resources/GameArt/UI/UI_Panel_Velvet.png","UI","天鹅绒面板","成人向主题被抽象为戏剧化材质的 UI 组件。"],
    ["G:/TestProject/HSJT/Assets/Resources/GameArt/UI/UI_Panel_Parchment.png","UI","羊皮纸面板","地图、事件与说明信息使用的界面材质。"],
    ["G:/TestProject/HSJT/Assets/Resources/GameArt/UI/Map/UI_Map_RoomCard_Boss.png","UI","Boss 房间卡片","爬塔地图节点和威胁层级的卡片资产。"],
    ["G:/TestProject/HSJT/Assets/Resources/GameArt/UI/Main/UI_Main_TitleFrame.png","UI","主界面标题框","项目主界面的视觉框架资产。"],
    ["G:/TestProject/HSJT/Assets/Resources/GameArt/UI/Icons/Themes/Icon_Theme_Theater.png","图标","剧院楼层主题图标","楼层主题、事件与流派内容的识别图标。"]
  ],
  brick: [
    ["G:/TestProject/3Dxingcunzhe/output/imagegen/ui_concepts/ui_concept_sheet.png","UI","积木飞船 UI 概念总览","搭建、战斗、升级与结算界面的整体视觉方向。"],
    ["G:/TestProject/3Dxingcunzhe/output/imagegen/ui_concepts/sample_panel_battle.png","UI","战斗面板样例","局内 HUD 与结构状态的信息面板。"],
    ["G:/TestProject/3Dxingcunzhe/output/imagegen/ui_concepts/sample_card_legend.png","UI","传奇部件卡片","积木部件稀有度与构筑信息的卡片样例。"],
    ["G:/TestProject/3Dxingcunzhe/Assets/Resources/BrickSurvivor/UI/UpgradePresentation/UI_Upgrade_Promo_Build.png","UI","构筑升级展示","强化选择与飞船结构变化的宣传面板。"],
    ["G:/TestProject/3Dxingcunzhe/Assets/Resources/BrickSurvivor/UI/UpgradePresentation/UI_Bonus_Icon_Thruster.png","图标","推进器强化图标","飞船机动构筑的属性图标。"],
    ["G:/TestProject/3Dxingcunzhe/Assets/Resources/BrickSurvivor/UI/UI_Warning_Boss.png","UI","Boss 预警组件","顶部战斗时间轴与事件预警的界面资产。"],
    ["G:/TestProject/3Dxingcunzhe/Assets/Resources/BrickSurvivor/UI/UI_Radar_Enemy.png","UI","雷达敌人标记","战场方向提示与威胁识别组件。"],
    ["G:/TestProject/3Dxingcunzhe/Assets/Resources/BrickSurvivor/UI/UI_Slot_Block_Invalid.png","UI","非法连接状态","积木拖放、吸附和合法性判定的错误反馈。"]
  ],
  haste: [
    ["G:/Haste/Assets/Resources/Res/Image/PopWindowBG_Full 1.png","团队 UI","通用弹窗背景","团队项目运行时 UI 资源的一部分。"],
    ["G:/Haste/Assets/Resources/Res/Image/Button_BG_Orange 1.png","团队 UI","主要按钮背景","团队项目通用交互组件资产。"],
    ["G:/Haste/Assets/Resources/Res/Image/progressbar-background 1.png","团队 UI","进度条背景","加载与进度反馈组件。"],
    ["G:/Haste/Assets/Resources/Res/Image/progressbar 1.png","团队 UI","进度条前景","与进度条背景配套的运行时素材。"]
  ]
};

const outputRoot = new URL("../public/media/projects/", import.meta.url);
const outputPath = fileURLToPath(outputRoot);
if (!outputPath.startsWith(process.cwd())) throw new Error(`Unsafe output path: ${outputPath}`);
rmSync(outputPath, { recursive: true, force: true });
mkdirSync(outputPath, { recursive: true });
const catalog = {};
let copied = 0;
for (const [projectId, items] of Object.entries(media)) {
  const projectDir = new URL(`${projectId}/`, outputRoot);
  mkdirSync(projectDir, { recursive: true });
  catalog[projectId] = [];
  for (let index = 0; index < items.length; index++) {
    const [source, category, title, caption] = items[index];
    if (!existsSync(source)) {
      console.warn(`missing: ${source}`);
      continue;
    }
    const filename = `${String(index + 1).padStart(2, "0")}.webp`;
    await sharp(source).resize({ width: 1600, height: 1000, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(fileURLToPath(new URL(filename, projectDir)));
    catalog[projectId].push({
      id: `${projectId}-${index + 1}`,
      category, title, caption,
      src: `/media/projects/${projectId}/${filename}`,
      sourceType: category === "生成封面" ? "AI 概念图" : category === "实机截图" ? "实机截图" : "项目资产",
      bytes: statSync(source).size,
    });
    copied++;
  }
}
catalog.oneproto = catalog.one;
writeFileSync(new URL("../app/media-catalog.json", import.meta.url), `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`copied=${copied}`);
console.log(Object.fromEntries(Object.entries(catalog).map(([id, items]) => [id, items.length])));
