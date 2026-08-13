"use client";

import { useEffect, useMemo, useState } from "react";
import documentCounts from "./document-counts.json";
import mediaCatalogData from "./media-catalog.json";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BattleLab from "./BattleLab";
import ArchiveConsole from "./ArchiveConsole";
import MusicDock from "./MusicDock";

type Project = {
  id: string; name: string; en: string; pitch: string; status: string; type: string;
  role: string; tags: string[]; image?: string; accent: string; playable?: boolean; team?: boolean;
};

type DocSummary = {
  title: string; type: string; status: string; problem: string; conclusions: string[];
  evidence: string; read: string;
};

type CatalogDoc = {
  id: string; projectId: string; title: string; category: string; group: string;
  summary: string; keyPoints: string[]; sections: string[]; sourceFile: string;
  modifiedAt: string; readMinutes: number; charCount: number; contentPath: string;
};

type MediaItem = {
  id: string; category: string; title: string; caption: string; src: string;
  sourceType: string; bytes: number; mediaType?: "image" | "video";
};

const mediaCatalog = mediaCatalogData as Record<string,MediaItem[]>;
mediaCatalog.arg = [
  {id:"arg-1",category:"调查桌",title:"案件局调查桌",caption:"ARG 整合站的主视觉：档案夹、钥匙、地图和录音设备共同构成调查入口。",src:"/media/projects/arg/01.webp",sourceType:"项目素材",bytes:2345966,mediaType:"image"},
  {id:"arg-2",category:"线索图",title:"未寄出的信与钥匙",caption:"用于案件简报与证据链入口的线索图，强调先保全原件再做解释。",src:"/media/projects/arg/02.webp",sourceType:"项目素材",bytes:2355727,mediaType:"image"}
];
mediaCatalog.qgdxx2 = [
  {id:"qgdxx2-1",category:"实机截图",title:"主城资源与建造界面",caption:"竖屏主城把资源、主线目标、建筑与长期成长放在同一条操作路径上。",src:"/media/projects/qgdxx2/01.png",sourceType:"Unity 实机截图",bytes:389636,mediaType:"image"},
  {id:"qgdxx2-2",category:"战斗 HUD",title:"妖族英雄战斗 HUD",caption:"自动攻击、手动走位、技能预警和永久卡牌成长的战斗表现样例。",src:"/media/projects/qgdxx2/02.png",sourceType:"Unity 实机截图",bytes:161633,mediaType:"image"},
  {id:"qgdxx2-3",category:"视觉规范",title:"英雄招募页视觉方案",caption:"福瑞妖族英雄、招募资源与卡池入口的视觉重制效果稿，明确标记为设计稿。",src:"/media/projects/qgdxx2/03.png",sourceType:"设计效果稿",bytes:2222653,mediaType:"image"}
];
mediaCatalog.one = [
  {id:"one-promo-video",category:"宣传视频",title:"《击败音乐狂》实机宣传视频",caption:"展示节奏弹幕、AI 英雄成长与造物主控制玩法的项目宣传录像。",src:"https://github.com/grentdls/GrentDlsProject/releases/download/portfolio-builds-2026-07-28/gameplay-promo.mp4",sourceType:"项目宣传视频",bytes:74131251,mediaType:"video"},
  {id:"one-promo-1",category:"宣传图",title:"节奏弹幕战斗宣传图",caption:"项目最新宣传画面，呈现音乐主题敌人与高密度弹幕战场。",src:"/media/projects/one/promo/promo-01.png",sourceType:"项目宣传图",bytes:694992,mediaType:"image"},
  {id:"one-promo-2",category:"宣传图",title:"造物主玩法宣传图",caption:"突出玩家作为造物主干预战局、召唤单位与构建挑战的玩法视角。",src:"/media/projects/one/promo/promo-02.png",sourceType:"项目宣传图",bytes:793133,mediaType:"image"},
  {id:"one-promo-3",category:"宣传图",title:"AI 英雄成长宣传图",caption:"展示 AI 英雄构筑、战斗节拍与成长反馈的核心体验。",src:"/media/projects/one/promo/promo-03.png",sourceType:"项目宣传图",bytes:1051960,mediaType:"image"},
  ...(mediaCatalog.one??[])
];

type DownloadItem = {platform:"Windows"|"Android";title:string;filename:string;size:string;href:string};
const downloadsByProject:Record<string,DownloadItem[]> = {
  one:[
    {platform:"Windows",title:"《击败音乐狂》PC 试玩版",filename:"defeat-music-maniac-windows.zip",size:"80.2 MB",href:"https://github.com/grentdls/GrentDlsProject/releases/download/portfolio-builds-2026-07-28/defeat-music-maniac-windows.zip"},
    {platform:"Android",title:"《击败音乐狂》安卓试玩版",filename:"DefeatMusicManiac.apk",size:"82.6 MB",href:"https://github.com/grentdls/GrentDlsProject/releases/download/portfolio-builds-2026-07-28/DefeatMusicManiac.apk"}
  ],
  star:[{platform:"Windows",title:"《星空掠夺者》PC 试玩版",filename:"star-raiders-windows.zip",size:"41.4 MB",href:"https://github.com/grentdls/GrentDlsProject/releases/download/portfolio-builds-2026-07-28/star-raiders-windows.zip"}],
  rts:[{platform:"Android",title:"RTS 最新安卓试玩版",filename:"TestRTS2_latest.apk",size:"192.0 MB",href:"https://github.com/grentdls/GrentDlsProject/releases/download/portfolio-builds-2026-07-28/TestRTS2_latest.apk"}],
  castle:[
    {platform:"Windows",title:"《亲密城堡》PC 试玩版",filename:"HSJT-PC.zip",size:"248.4 MB",href:"https://github.com/grentdls/GrentDlsProject/releases/download/portfolio-builds-2026-07-28/HSJT-PC.zip"},
    {platform:"Android",title:"《亲密城堡》安卓试玩版",filename:"HSJT.apk",size:"470.2 MB",href:"https://github.com/grentdls/GrentDlsProject/releases/download/portfolio-builds-2026-07-28/HSJT.apk"}
  ]
};
const catalogTotals = documentCounts as Record<string, number>;
const totalUniqueDocs = ["tuntun","wcdel","star","rts","arpg","one","castle","brick","haste","qgdxx2","arg"]
  .reduce((sum,id)=>sum+(catalogTotals[id]??0),0);

const projects: Project[] = [
  { id:"tuntun", name:"吞吞舰船", en:"TUNTUN SHIP", pitch:"把海上移动堡垒、Roguelike 战斗与长期港口经营装进同一片海域。", status:"进行中", type:"独立游戏", role:"系统策划 / 技术策划 / 原型", tags:["Unity","Roguelike","海战","系统设计"], image:"/media/tuntun-cover.png", accent:"#e8aa4d", playable:true },
  { id:"star", name:"星空掠夺者", en:"STAR RAIDERS", pitch:"在桌面一角经营会持续运转的飞船基地，组织角色、模块与远征。", status:"可试玩", type:"独立游戏", role:"玩法策划 / UI / 程序", tags:["Unity 2D","挂机","基地经营","100+ 数据"], image:"/media/starraiders-cover.png", accent:"#5fd0ca", playable:true },
  { id:"brick", name:"积木飞船幸存者", en:"BRICK SURVIVOR", pitch:"先像搭积木一样造船，再把每个结构选择送进太空战场验证。", status:"可试玩", type:"玩法原型", role:"技术策划 / 交互 / 原型", tags:["Unity 3D","模块搭建","幸存者","UX"], image:"/media/brick-cover.png", accent:"#f07b48", playable:true },
  { id:"rts", name:"华夏城战", en:"HUAXIA RTS", pitch:"从城池经营到战场调度的轻量 RTS；Unity 与 Web 双版本并行验证。", status:"验证中", type:"系统研究", role:"系统策划 / Web 原型", tags:["RTS","Unity","Web","数据驱动"], image:"/media/projects/rts/01.webp", accent:"#d5a35b", playable:true },
  { id:"arpg", name:"荒野旅团 ARPG", en:"WILDLAND ARPG", pitch:"围绕 3C、战斗反馈与模块化地图构建的 3D 动作角色扮演原型。", status:"开发中", type:"技术原型", role:"技术策划 / 3C / 战斗", tags:["Unity 3D","ARPG","3C","战斗反馈"], image:"/media/rpg-cover.png", accent:"#71a36f" },
  { id:"wcdel", name:"轻量开放世界 ARPG", en:"WCDEL", pitch:"以小体量团队可落地为约束，搭建开放世界 ARPG 的工程与内容骨架。", status:"开发中", type:"独立游戏", role:"架构 / UI / 内容管线", tags:["Unity","架构","开放世界","UI"], image:"/media/projects/wcdel/01.webp", accent:"#dbbd79" },
  { id:"one", name:"击败音乐狂人", en:"DEFEAT MUSIC MANIAC", pitch:"让弹幕、角色成长与音乐节拍彼此驱动的高反馈动作实验。", status:"可试玩", type:"玩法原型", role:"玩法 / 音频 / 表现", tags:["Unity 2D","节奏","弹幕","AI 角色"], image:"/media/projects/one/01.webp", accent:"#c36dd8", playable:true },
  { id:"castle", name:"亲密城堡", en:"INTIMATE CASTLE", pitch:"以关系构筑与流派组合为核心的卡牌爬塔原型。", status:"可试玩", type:"玩法原型", role:"卡牌系统 / 美术规范 / UI", tags:["Unity","卡牌","Build","爬塔"], image:"/media/projects/castle/01.webp", accent:"#d5687f", playable:true },
  { id:"oneproto", name:"造物主试炼", en:"CREATOR'S TRIAL", pitch:"反向幸存者与造物构筑结合的系统概念验证。", status:"概念验证", type:"设计研究", role:"核心循环 / GDD", tags:["Roguelike","反向幸存者","GDD"], image:"/media/projects/one/01.webp", accent:"#8d84d7" },
  { id:"arg", name:"迷境 ARG 调查局", en:"MIJING ARG COMMUNITY", pitch:"玩家扮演调查员，从都市异闻、影像异常与文档缺页中整理可复核的证据链。", status:"在线整合", type:"ARG / 互动叙事", role:"叙事系统 / 调查流程 / 网页交互", tags:["ARG","互动叙事","证据链","社区协查"], image:"/media/projects/arg/01.webp", accent:"#c77b68" },
  { id:"qgdxx2", name:"英雄城：永夜守望", en:"HERO CITY: NIGHTWATCH", pitch:"竖屏妖族仙侠抖音小游戏：经营城市、培养英雄、进入幸存者战场，再把资源带回长期成长。", status:"开发中", type:"抖音小游戏", role:"系统策划 / 战斗 / UI·UX", tags:["Unity","竖屏","妖族仙侠","永久成长"], image:"/media/projects/qgdxx2/01.png", accent:"#72b9ae" },
  { id:"haste", name:"Haste", en:"TEAM PROJECT", pitch:"团队商业项目中的工程协作、内容生产与工具链经验。", status:"团队项目", type:"团队项目", role:"项目协作 / 工具 / 内容", tags:["Unity","团队协作","工具链","商业项目"], accent:"#75b6d6", team:true }
];

const timeline = [
  ["2026.08","ARG 上线","迷境 ARG 调查局：案件大厅、证据链与调查员协查成为可探索的整合入口","arg"],
  ["2026.08","竖屏原型","英雄城：永夜守望把城市经营、妖族英雄与永久成长幸存者战斗接成一条循环","qgdxx2"],
  ["2026.07","玩法成型","吞吞舰船：英雄、主舰与海域形成可配置的战斗框架","tuntun"],
  ["2026.07","交互验证","积木飞船：拖放、吸附、合法性判定与完整产品流程","brick"],
  ["2026.06","系统扩展","星空掠夺者：从前 5 分钟到长期挂机的成长规划","star"],
  ["2026.05","双端实验","华夏城战：Unity 原型同步拓展为 Web 可运行版本","rts"],
  ["2026.04","表现研究","ARPG：3C、受击反馈与地图模块完成架构审计","arpg"],
  ["更早","团队经验","Haste：在真实协作环境中参与内容与工具链交付","haste"]
];

const docsByProject: Record<string, DocSummary[]> = {
  tuntun: [
    { title:"最小可玩 Demo 实现文档", type:"核心策划", status:"原型基线", problem:"如何把庞大的海战与经营设想压缩成一局 5～8 分钟、可以真正验证的体验？", conclusions:["首版只保留驾驶、吞噬、金币、三选一、侧舷炮和 Boss 结算","明确排除局外科技树、自由拼装、联机和复杂剧情，保护验证焦点","用船体两次明显变化与敌我强弱反转，验证成长是否能被玩家直接感知"], evidence:"定义了 PC 键鼠 Demo 的必做/不做范围与完整体验检查点。", read:"8 min" },
    { title:"方形小海域与成长流程重构", type:"系统设计", status:"增量重构", problem:"六边形领土与方形建筑占用冲突，扩建频率低，程序、美术和寻路各自使用不同空间规则。", conclusions:["统一为 48m 领海格、12m 生产区格与 2m 建筑格的方形空间语义","把扩建拆成更小、更频繁的空间、资源、事件与挑战反馈","保留无缝地图、真实功能船出航和固定挑战不可付费替代等核心规则"], evidence:"将旧六边形规则迁移到可建造、可寻路、可配置的统一网格。", read:"16 min" },
    { title:"敌人、精英与 Boss 战斗表现", type:"战斗策划", status:"制作规范", problem:"如何让挑战来自观察与反制，而不是换色、加血、加速和堆叠同类弹体？", conclusions:["敌人攻击必须符合体型、武器与生态特征","用前摇、预警、攻击卡组、可破坏部位与危险预算建立可读性","难度 I～VI 优先改变机制与组合，而非只做数值放大"], evidence:"覆盖肉鸽航行、世界事件、固定挑战与港口防守等多个模式。", read:"18 min" }
  ],
  wcdel: [
    { title:"项目总览与工程基线", type:"技术策划", status:"已落地", problem:"怎样让一个空白 Unity 模板具备可持续扩展的战斗、地图、任务、经济和存档入口？", conclusions:["确立 Runtime、Editor、Art、Data 的工程目录与程序集边界","PC 首发验证，同时为移动端和手柄保留输入层","用 3 分钟小循环、可读翻滚战斗和低失败惩罚约束系统规模"], evidence:"工程使用 Unity 6、URP 2D 与 Input System，并以 Docs 作为规则基线。", read:"7 min" },
    { title:"轻量开放世界 ARPG 设计拆解", type:"核心策划", status:"设计基线", problem:"如何学习同类产品的节奏与结构，同时确保世界、角色、任务、美术和文本保持原创？", conclusions:["提炼俯视角即时战斗、高密度目标点、短副本与短升级反馈","把可借鉴的设计结构与不可复制的专有表达明确分开","围绕小体量团队的内容生产能力控制地图与系统范围"], evidence:"形成 GDD、开发目录和数据表模板，而非复刻商业作品内容。", read:"14 min" },
    { title:"战斗系统详细设计", type:"战斗策划", status:"制作中", problem:"如何统一玩家、敌人、技能、伤害、预警、反馈和 Boss 战的规则表达？", conclusions:["普通战与 Boss 战使用不同的节奏循环","属性、阵营、选敌、伤害和受击由统一数据结构驱动","把攻击预警与翻滚窗口作为轻动作战斗的核心可读性来源"], evidence:"为战斗实现、敌人配置与 HUD 反馈提供同一套规则接口。", read:"15 min" }
  ],
  star: [
    { title:"桌面挂机飞船建造完整设计", type:"核心策划", status:"设计基线", problem:"桌面挂机怎样既不打扰工作，又能提供飞船经营、船员活动与远征反馈？", conclusions:["提供桌面底栏、侧栏与展开管理三种窗口形态","玩家负责结构、船员岗位与远征决策，日常过程自动运行","用可见船员活动、事件气泡和飞船外观变化维持存在感"], evidence:"定义了桌面常驻形态与 1280×720 完整管理模式的职责边界。", read:"15 min" },
    { title:"无限挂机成长体验总规划", type:"成长设计", status:"验证中", problem:"怎样避免挂机项目过早暴露全部系统、前期反馈稀薄，以及 6 小时后只剩重复数值？", conclusions:["前 5 分钟必须完成一次资源—建造—远征—带回收益的闭环","成长拆成 10 秒、1 分钟、5 分钟、30 分钟和 6 小时后五级反馈","系统按 7 个阶段逐步开放，只展示当前阶段有意义的信息"], evidence:"成长线、经济循环、敌人难度与长期刷取被拆为可分别验证的文档组。", read:"14 min" },
    { title:"飞船模块分页、解锁与蓝图规则", type:"UI / UX", status:"已落地", problem:"模块数量增长后，建造界面全部展示会导致信息过载，玩家也无法判断下一步该造什么。", conclusions:["按功能分页，并在顶部提供阶段性推荐建造","解锁区分等级、前置、蓝图、战役、事件、阵营和研究等来源","从未接触或未获蓝图的内容完全隐藏，已见过但缺条件的内容才显示锁定"], evidence:"把“模块全集”转化为“玩家此刻应该知道的模块集合”。", read:"12 min" }
  ],
  rts: [
    { title:"Unity / Web 双端项目架构", type:"技术策划", status:"双端验证", problem:"如何让同一套 RTS 玩法在 Unity 项目与轻量 Web 版本中保持一致的模块边界？", conclusions:["单位、建筑、战斗与 UI 分为独立模块","Unity 侧用 Prefab Resolver 与稳定槽位承载可见 UI","Web 侧以 index、styles 和 game 三层保持可直接运行与发布"], evidence:"工程中同时存在 Windows 包体与 GitHub Pages 部署说明。", read:"9 min" },
    { title:"华夏阵营建筑、单位与科技树", type:"系统设计", status:"配置化", problem:"如何把资源、人口、主城等级、生产建筑和科技前置组织成可读的阵营成长路线？", conclusions:["资源建筑、人口来源与生产建筑各自承担清晰经济职责","主城等级控制建筑开放，建筑升级控制生产与科技效率","建筑前置关系形成可视化科技路线，避免自由堆叠破坏节奏"], evidence:"对应阵营方案已拆成建筑、单位、数值与新增功能多份配置文档。", read:"13 min" },
    { title:"占领主城与定向融合", type:"特色系统", status:"规则设计", problem:"主城被击破后，怎样让最后一击、占领与阵营融合产生清晰且可追踪的战略结果？", conclusions:["区分主城击破、最后一击、占领核心和定向融合四个概念","用状态机记录从攻击到占领再到融合路线选择的完整流程","最后一击需要独立记录，以保证归属、表现与后续科技解锁一致"], evidence:"Unity 与 Web 文档均保留相同阵营玩法结构，便于交叉验证。", read:"11 min" }
  ],
  arpg: [
    { title:"3D ACT 刷宝 ARPG 项目总纲", type:"核心策划", status:"MVP 规划", problem:"如何在 Unity 3D 动作操作下承载重装备、重词条和重终局地图，同时避免范围失控？", conclusions:["MVP 0 先只验证单角色战斗手感","装备、辅助模块、大天赋树、地图词缀与赛季结构可参考，内容必须原创","把战斗、职业、装备、副本、敌人、UI 与工具拆成独立制作批次"], evidence:"总纲明确列出可参考结构、必须原创内容和分阶段制作边界。", read:"12 min" },
    { title:"大天赋树、职业起点与专精树", type:"成长设计", status:"验收定义", problem:"巨型天赋树怎样既支持跨职业构筑，又避免节点只是 Tooltip 数值堆叠？", conclusions:["职业拥有不同起点，跨区需要承担路径成本","普通天赋点与专精点严格分离","关键节点必须真实改变技能逻辑，并支持缩放、搜索、预览和实时属性刷新"], evidence:"文档同时给出数据结构、Prefab 需求与可操作的验收标准。", read:"13 min" },
    { title:"主动、辅助、保留、触发与技能变体", type:"技术策划", status:"系统设计", problem:"如何让技能、装备词条、天赋与怪物抗性通过同一套标签和应用顺序联动？", conclusions:["技能标签决定辅助模块连接、天赋生效、装备加成与抗性交互","释放流程与辅助模块应用顺序统一，减少组合歧义","表现层拆分动作、投射物、命中、VFX 与音频，便于变体复用"], evidence:"面向 Unity 原型定义了技能数据结构与第一版内容规模。", read:"14 min" }
  ],
  one: [
    { title:"AI 弹幕音轨与战斗节拍预警", type:"玩法表现", status:"核心特色", problem:"如何让玩家预测 AI 英雄的弹幕，而不是只能对随机攻击被动反应？", conclusions:["声音、弹幕节奏和屏幕下方音轨进度器保持同步","低音对应重攻击，高频对应密集小弹幕，并区分直线、范围、追踪与蓄力","玩家可根据攻击硬直和音轨阶段安排召怪、控制或打断"], evidence:"把音频从装饰层提升为战斗信息与反制决策的一部分。", read:"13 min" },
    { title:"完整 UI 布局与战场保护规则", type:"UI / UX", status:"制作规范", problem:"音乐播放器式 UI 容易变得花哨，怎样保护中央战斗可视区并维持信息优先级？", conclusions:["中央只留战斗，顶部状态、底部操作、左右轻量且可折叠","禁止大型头像、常驻长文本与固定面板侵占战场","像素、DJ 控台和演出海报元素必须服从清晰度"], evidence:"给出禁止遮挡区、信息优先级和标准战斗界面布局。", read:"11 min" },
    { title:"打击反馈系统", type:"表现设计", status:"系统方案", problem:"怎样让伤害、暴击、元素与受击强度在短时间内被准确感知？", conclusions:["跳字、命中特效、受击动作、停顿和镜头形成分层反馈","普通伤害与暴击在尺寸、节奏和动画上明确区分","元素颜色只是辅助信号，仍需形态与动效差异"], evidence:"作为 Damage Feedback / Hit Feel 模块独立维护，便于跨玩法复用。", read:"9 min" }
  ],
  castle: [
    { title:"成人向卡牌爬塔设计", type:"核心策划", status:"设计基线", problem:"如何在成人主题下保留清晰、可上架友好的卡牌构筑与风险收益决策？", conclusions:["采用地图节点、事件、商店、Boss 与卡组成长的爬塔结构","双进度条让玩家在爆发收益与自身张力风险之间取舍","内容以成年、自愿、可退出为边界，并提供强度与表现设置"], evidence:"明确发行平台、年龄确认、表达尺度和包容性角色设计边界。", read:"14 min" },
    { title:"Build 套路与流派扩展", type:"系统设计", status:"扩展设计", problem:"如何避免玩法只剩打伤害和堆数值，形成能被识别、组装和反制的流派？", conclusions:["每个流派都需要核心卡、启动组件、放大器、风险与收束手段","构筑分为卡牌、遗物和伙伴协战三层","追击与触发设置递归限制，避免无限触发破坏结算"], evidence:"文档包含状态字段、统一公式、结算顺序与 Unity 实现规则。", read:"15 min" },
    { title:"战斗表现与特效逻辑规范", type:"表现设计", status:"制作规范", problem:"出牌后只有数值变化，玩家无法看懂谁发动了什么、命中了哪里、为何进入结算。", conclusions:["标准流程覆盖位移、动作、命中特效、受击、镜头、数值与结算","表现按逻辑、动作、VFX、镜头和 UI 分层，各层职责固定","成人主题统一转译为张力、共鸣、失衡等抽象视觉语言"], evidence:"可直接指导动画、VFX、Prefab 与卡牌表现绑定。", read:"12 min" }
  ],
  brick: [
    { title:"积木星舰幸存者玩法设计", type:"核心策划", status:"原型基线", problem:"模块化造船怎样真正影响幸存者战斗，而不是只成为开局装饰编辑器？", conclusions:["单局循环围绕战斗、获取积木、暂停搭建、结构验证与继续作战","飞船由基础单位和连接规则共同决定结构合法性","每次部件选择同时影响火力、生存、重心与后续连接空间"], evidence:"定义飞船本体、积木单位、连接规则与完整单局循环。", read:"12 min" },
    { title:"积木搭建界面与操作流程", type:"UI / UX", status:"交互方案", problem:"战斗中进入实时编辑器时，怎样兼顾结构操作精度与战场紧张感？", conclusions:["普通搭建使用完全暂停，危险模式可降速到 0.05～0.1","顶部持续显示模式、总属性变化和基础操作提示","背包、预览、吸附、合法性与错误反馈形成连续操作链"], evidence:"将界面定位为暂停式搭建、局内编辑器和结构管理的统一表面。", read:"13 min" },
    { title:"50 种敌人与战斗节奏 UI", type:"战斗策划", status:"内容规划", problem:"大量敌人怎样进入一局节奏，并让玩家提前理解事件、威胁方向和构筑需求？", conclusions:["用单局时间轴安排常规波次、事件、精英与 Boss","顶部进度条显示未来事件图标与当前位置","关键事件提前 10 秒以倒计时、方向、边缘提示和低频音效预警"], evidence:"敌人内容、战斗节奏与 HUD 表现被设计为同一个信息系统。", read:"16 min" }
  ],
  oneproto: [
    { title:"反幸存者：造物主试炼 GDD", type:"核心策划", status:"概念验证", problem:"如果玩家不控制幸存者英雄，而是扮演关卡导演，幸存者循环会发生什么变化？", conclusions:["AI 英雄自动移动、攻击、升级、选卡与寻找安全区","玩家负责地形、召怪、节奏和克制组合，不直接操控作战单位","召怪既是进攻也可能给英雄送经验，因此存在主动停手与诱导决策"], evidence:"完成反向幸存者、轻策略、肉鸽对抗和自动战斗的核心循环定义。", read:"13 min" },
    { title:"造物主技能系统", type:"系统设计", status:"设计方案", problem:"怎样让大范围技能像 Boss 机制一样强力，但仍给 AI 英雄合理的识别与躲避机会？", conclusions:["技能统一使用能量、冷却、范围和预警字段","预警时长随技能强度与覆盖面积变化","AI 英雄按危险评分、路径成本和当前动作状态决定躲避"], evidence:"连接玩家释放流程、能量不足反馈、预警表现与 AI 反应逻辑。", read:"10 min" },
    { title:"AI 英雄成长 BD 与节奏系统", type:"AI 玩法", status:"特色系统", problem:"AI 英雄的成长怎样被玩家观察并针对，而不是在后台悄悄增加数值？", conclusions:["成长会同步改变弹幕形态、音色、节奏密度与视觉层级","节奏播放器提前暴露 AI 正在形成的流派","每种属性成长都配套玩家感知、视听表现和造物主反制方式"], evidence:"把 AI 构筑从隐藏数值转化为可读、可预测、可反制的对手成长。", read:"14 min" }
  ],
  haste: [
    { title:"CI 工具链记录", type:"团队工具", status:"工程记录", problem:"如何把团队项目中的自动化流程集中到可重复执行的入口？", conclusions:["现有记录指向 Jenkins 批处理主流程","飞书相关脚本承担协作通知入口","工程内同时保留资源处理、签名、上传与分析工具"], evidence:"现有自有说明较简短，因此仅作为工具链参与证据，不扩写为完整系统设计。", read:"3 min" },
    { title:"Excel 自动优化工具说明", type:"编辑器工具", status:"使用记录", problem:"如何降低批量表格处理的重复操作成本？", conclusions:["说明按操作步骤与功能模式组织","工具以独立可执行程序交付","适合作为团队内容生产管线的辅助案例"], evidence:"工程中存在独立工具与 readMe；个人职责范围仍待本人确认。", read:"3 min" }
  ],
  arg: [
    { title:"ARG 灵异事件调查整合网站项目概览", type:"关卡与叙事", status:"在线整合", problem:"如何把多个灵异事件、玩家调查和社区协查组织成一个可以持续扩展的 ARG 入口？", conclusions:["用案件大厅承载不同类型的都市异闻与现实追踪","每个案件都保留状态、编号、简报和证据链入口","调查员协查频道把个人推理转为可回传、可复核的社区记录"], evidence:"G:/ARG 的 src/main.jsx 已包含调查终端、案件大厅、案件详情与协查结构；线上项目为 mijing-arg-community.netlify.app。", read:"6 min" },
    { title:"ARG 调查员协查与证据链设计", type:"核心策划", status:"交互方案", problem:"如何让玩家先核验资料，再做解释，同时让多人协查仍然保持清晰的下一步？", conclusions:["原始陈述、已确认事实和待验证推测分层呈现","优先使用日志、元数据、公开档案等低风险来源","回传格式固定为事实、推测、下一步核验"], evidence:"工程内已有字段调查、调查笔记、证据卡、协查帖子、回复和涉密折叠交互。", read:"5 min" },
    { title:"ARG 案件内容与现实调查边界", type:"制作规范", status:"安全规范", problem:"如何保留灵异调查的神秘感，同时避免把玩家引向现实危险、身份暴露或未经授权的现场行为？", conclusions:["现实追踪案件只使用公开资料和自愿提供的观察","现实身份、住址和未成年人信息不作为谜题奖励","无法复核的内容保持待核验状态，不强行解释"], evidence:"将现实调查边界写入案件内容与协查提示，保证体验中的风险被明确管理。", read:"4 min" }
  ],
  qgdxx2: [
    { title:"竖版城市建造 × 永久成长幸存者小游戏完整制作方案", type:"系统与数值", status:"产品总案", problem:"如何把城市经营、妖族英雄培养、竖屏幸存者战斗和长期成长连成一条小游戏循环？", conclusions:["城市建筑对应资源或战斗能力，不只是装饰菜单","战斗产出回到城市，城市升级再反哺下一场战斗","主线 4～8 分钟，适合单手操作和碎片时间"], evidence:"QGDXX2/Docs 中的完整制作方案定义了产品循环、首日目标、三层循环与系统闭环。", read:"18 min" },
    { title:"竖版城市幸存者：妖族英雄十六修行派系与升阶玩法完整方案", type:"核心策划", status:"成长系统", problem:"如何让修行派系改变英雄的攻击规则、战场对象和走位决策，而不是只增加数值？", conclusions:["修行派系是安装在攻击系统上的规则改写器","十六个派系拥有残影、阵眼、符序、因果等可观察的玩法器官","隐藏数值后仍应能从十秒战斗录像识别派系"], evidence:"文档把修仙、修体、修妖、剑道、阵道、符道等派系拆成可制作的表现与操作差异。", read:"16 min" },
    { title:"竖版城市幸存者——战斗逻辑、操作、动画与表现完整制作方案", type:"表现与美术", status:"战斗规范", problem:"自动攻击的低门槛如何与有价值的走位、技能预警和永久构筑选择共存？", conclusions:["战斗由位置、威胁、终极技能和长期构筑四类决策组成","普通怪提供爽感，特殊怪制造问题，Boss 检验理解与操作","高伤攻击必须提前预警，逻辑判定与动画表现解耦"], evidence:"QGDXX2 的战斗文档同时覆盖战斗生命周期、敌人密度、预警、受击与 HUD 优先级。", read:"17 min" },
    { title:"竖版城市幸存者——全界面 UI 视觉、图文布局与 UX 动效完整规范", type:"UI / UX", status:"视觉规范", problem:"如何在 9:16 竖屏里同时容纳城市、英雄、装备、招募、商店和战斗信息？", conclusions:["用统一页面框、标题绶带、资源条和底部导航形成识别系统","英雄大图、卡片和点击层分离，避免整张效果图代替运行时 UI","关键目标、资源与状态保持稳定锚点，窄屏优先保证可读性"], evidence:"Docs/UI视觉重制 中保留页面清单、招募、英雄、商店、战斗 HUD 和动效的拆分规则。", read:"20 min" }
  ]
};

const featuredDocs = [
  ["tuntun",0],["star",1],["brick",1],["arpg",2],["arg",0],["qgdxx2",0]
] as const;

const resumeExperiences = [
  {
    period:"2020/10 - 至今",
    company:"杭州紧张树网络",
    role:"高级战斗策划 / 玩法策划",
    projects:"《驱入虚空》从 0 到上线",
    highlights:[
      "负责 TPS 肉鸽吸血鬼玩法、TPS 肉鸽与 TPS 割草三轮玩法，从原型到完整版本推进角色、武器、道具、怪物、Boss、地图与战斗功能。",
      "设计箱庭关卡与开放世界地图，覆盖弹幕 Boss、强交互 Boss、Boss 演出、战斗氛围与节奏。",
      "负责 AI 基础行为、集群行为、玩家行为预测，以及 3C、战斗表现和体验调优。",
      "参与 AI 编辑器、战斗编辑器与表格结构设计，并额外负责类地狱遣兵项目、类 Haste 项目。"
    ],
    links:[{label:"驱入虚空 · TapTap",href:"https://www.taptap.cn/app/273409"}]
  },
  {
    period:"2019/10 - 2020/10",
    company:"电魂网络 · 梦三国手游项目组",
    role:"游戏关卡 / 玩法策划",
    projects:"《梦三国手游》持续运营",
    highlights:[
      "负责 RPG 地图、PVE 军团全服大地图、PVE MOBA 吃鸡与 PVP 核心玩法迭代。",
      "参与 MOBA 角色设计与 PVP 角色数值持续调整。",
      "参与类魔兽编辑器优化与腾讯树迭代，并负责《梦三国传说》项目。"
    ],
    links:[{label:"梦三国手游",href:"https://m.m3guo.com/v1/#/"}]
  },
  {
    period:"2018/08 - 2019/11",
    company:"小丸子网络科技游戏公司",
    role:"小游戏制作人 / 游戏玩法策划",
    projects:"益智小游戏、肉鸽小游戏、五胡三国",
    highlights:[
      "负责每个游戏的基础玩法循环与系统玩法，并推进从设计到制作的完整落地。",
      "负责推广策略、投放调优与用户分析。"
    ],
    links:[]
  },
  {
    period:"2017/09 - 2018/08",
    company:"杭州嘉跳网络公司",
    role:"游戏关卡策划",
    projects:"FPS 手游关卡策划",
    highlights:[
      "负责 FPS 游戏换皮系统迭代、关卡设计与 AI 逻辑迭代。"
    ],
    links:[]
  }
];

const resumeFocus = [
  {label:"战斗设计",title:"从 3C 到 Boss 终局",body:"武器、技能、AI、伤害、节奏、演出与反馈共同定义可玩的战斗。"},
  {label:"玩法推进",title:"从原型到上线",body:"先压缩验证范围，再把角色、关卡、系统和内容拆成可执行的制作批次。"},
  {label:"编辑器与工具",title:"让规则进入生产",body:"参与 AI 编辑器、战斗编辑器、表格结构和可视化开发辅助工具设计。"},
  {label:"AI 协作",title:"把 AI 放进工作流",body:"使用 AI 制作原型与工具，并建立玩法、关卡设计的辅助监督和评级流程。"}
];

const resumeWorks = [
  {title:"《你在哪》",meta:"TapTap 测试上线",href:"https://www.taptap.com/app/79779"},
  {title:"《前行的路》",meta:"TapTap 测试上线",href:"https://www.taptap.com/app/82920"},
  {title:"《巨人与金雀》",meta:"2020 CGJ 个人作品",href:"https://www.youxibd.com/gamejam/cgjcyber2020/detail/485"},
  {title:"战枭 - 2D RTS",meta:"AI 制作的网页端游戏",href:"#projects"}
];

const designDoctrines = [
  {label:"01 / 可玩优先", title:"先让它能被玩，再让它听起来完整。", body:"每个新系统都要先落到一个可操作的动作、一个可观察的反馈和一个可复盘的失败。文档负责收敛范围，原型负责揭露真相。", proof:"对应：吞吞舰船最小可玩 Demo · 积木飞船模块搭建"},
  {label:"02 / 反馈先于解释", title:"玩家不该读完说明书，才知道自己刚刚做对了。", body:"前摇、音轨、镜头、颜色、停顿和 UI 共同承担信息。复杂机制可以深，但第一秒必须让人知道发生了什么。", proof:"对应：One 音轨预警 · WCDEL 命中反馈 · ARPG 3C"},
  {label:"03 / 复杂度要能生产", title:"一个好系统，应该也能被团队持续做出来。", body:"我会把规则拆成数据、逻辑、表现和工具入口，让一次设计不只解决当前问题，还能成为下一轮内容生产的模板。", proof:"对应：RTS 双端架构 · 角色配置工具 · UI Prefab Framework"}
];

const decisionScenarios = [
  {
    tag:"COMBAT FEEL / 01",
    title:"测试者说“打起来没感觉”，但你只有半天时间。先救什么？",
    context:"把时间花在最接近玩家感知的那一层：命中瞬间、危险预警，还是更多内容？",
    options:["先加更多敌人，让场面更热闹","重做命中反馈链：停顿、音效、受击与镜头","增加一组伤害属性，让数字更有层次"],
    answer:1,
    result:"先重做命中反馈链。密度和数字可以放大结果，但不能替代“我刚刚打中了”的确定感。"
  },
  {
    tag:"SCOPE CONTROL / 02",
    title:"新系统很酷，但首个可玩版本已经开始膨胀。下一步怎么做？",
    context:"当验证问题还没有答案时，新增内容只会把反馈变得更嘈杂。",
    options:["再补一套成长系统，保证长期目标","锁定一个最小闭环，只保留能改变决策的部分","先把完整 UI 做完，再看玩法是否成立"],
    answer:1,
    result:"先锁定最小闭环。范围不是把想法变小，而是让每个新增部分都能回答一个明确的问题。"
  },
  {
    tag:"READABILITY / 03",
    title:"队友说规则理解不了，但系统本身并不想删掉。怎么办？",
    context:"复杂度可以留在系统里，但不能把理解成本全部交给玩家或制作同学。",
    options:["写一份更长的说明，把所有例外列出来","把状态、反馈与失败条件映射到表现和工具里","先删掉一半规则，直到没人提问"],
    answer:1,
    result:"先把规则映射到表现和工具。能被观察、配置和复盘的复杂度，才有机会成为可生产的复杂度。"
  }
];

const resumePdfHref = "/resume/shi-zechang-battle-designer.pdf";

const capabilities = [
  {
    id:"system", index:"01", title:"策划与系统设计", subtitle:"把产品定位拆成规则、循环、内容边界与验证计划。",
    scope:["核心循环","系统关系","范围控制","商业化边界","版本规划"],
    method:["明确玩家幻想与首个可验证问题","拆出输入、决策、反馈和长期目标","定义必做、不做及系统依赖","用原型、文档和验收项验证"],
    projects:["tuntun","star","arpg","castle","qgdxx2"],
    documents:[
      {projectId:"tuntun",title:"《吞吞舰船》最小可玩 Demo 实现文档",category:"技术策划",contentPath:"/data/documents/tuntun/tuntun-17d1cff20041ce13.md"},
      {projectId:"star",title:"《星空掠夺者》无限挂机成长体验总规划文档",category:"系统与数值",contentPath:"/data/documents/star/star-646bd0f5f1873b25.md"},
      {projectId:"arpg",title:"Unity 3D ACT 暗黑类刷宝 ARPG 项目总纲",category:"核心策划",contentPath:"/data/documents/arpg/arpg-e6d0783b6498d51a.md"},
      {projectId:"castle",title:"Unity《亲密城堡》Build 套路玩法扩展设计文档",category:"UI / UX",contentPath:"/data/documents/castle/castle-f561cc45475e4588.md"},
      {projectId:"qgdxx2",title:"竖版城市建造 × 永久成长幸存者小游戏完整制作方案",category:"系统与数值",contentPath:"/data/documents/qgdxx2/qgdxx2-13ac4fb62ebb5178.md"}
    ]
  },
  {
    id:"gameplay", index:"02", title:"游戏玩法设计", subtitle:"从一个差异化想法推进到能操作、能失败、能重复的玩法闭环。",
    scope:["玩法原型","Roguelike 构筑","关卡事件","节奏控制","失败代价"],
    method:["先定义玩家每 10 秒在做什么","把选择与资源代价连接起来","让成长改变操作或战场结构","通过短局原型观察重复性"],
    projects:["brick","oneproto","tuntun","rts","arg"],
    documents:[
      {projectId:"brick",title:"《积木星舰幸存者》完整玩法设计文档 V0.1",category:"核心策划",contentPath:"/data/documents/brick/brick-80778583a1545162.md"},
      {projectId:"oneproto",title:"《反幸存者：造物主试炼》玩法策划案",category:"关卡与叙事",contentPath:"/data/documents/one/one-785f2b0772cd652f.md"},
      {projectId:"tuntun",title:"《吞吞舰船》肉鸽装配、武器、主动技能与加速系统设计文档",category:"UI / UX",contentPath:"/data/documents/tuntun/tuntun-54de5612acd710ca.md"},
      {projectId:"rts",title:"占领主城与定向融合阵营：功能与表现需求文档",category:"表现与美术",contentPath:"/data/documents/rts/rts-45be76865ead594f.md"},
      {projectId:"arg",title:"ARG 调查员协查与证据链设计",category:"核心策划",contentPath:"/data/documents/arg/arg-a16d7a31a4098a30.md"}
    ]
  },
  {
    id:"combat", index:"03", title:"战斗逻辑设计", subtitle:"让敌人、技能、AI 和反馈共同形成可观察、可判断、可反制的战斗。",
    scope:["敌人与 Boss","技能流程","AI 行为","伤害结算","战斗表现"],
    method:["先定义单位职责与危险预算","为攻击建立前摇、命中和后摇","把机制难度与纯数值难度分离","同步动作、VFX、音频、镜头和 UI"],
    projects:["tuntun","one","arpg","wcdel","qgdxx2"],
    documents:[
      {projectId:"tuntun",title:"《吞吞舰船》敌人、精英与 Boss 攻击方式、挑战逻辑及战斗表现完整设计文档",category:"表现与美术",contentPath:"/data/documents/tuntun/tuntun-e56e7d5bbd7f6823.md"},
      {projectId:"one",title:"AI 弹幕音效播放器系统方案",category:"UI / UX",contentPath:"/data/documents/one/one-a98c881b39ddba1a.md"},
      {projectId:"arpg",title:"技能系统总设计：主动、辅助、保留、触发、变体",category:"表现与美术",contentPath:"/data/documents/arpg/arpg-c63e4b9b7ad3cd31.md"},
      {projectId:"wcdel",title:"战斗系统详细设计文档",category:"战斗设计",contentPath:"/data/documents/wcdel/wcdel-4e36c5608b461dca.md"},
      {projectId:"qgdxx2",title:"竖版城市幸存者——战斗逻辑、操作、动画与表现完整制作方案",category:"表现与美术",contentPath:"/data/documents/qgdxx2/qgdxx2-02c505c7de0edeb1.md"}
    ]
  },
  {
    id:"technical", index:"04", title:"技术功能设计", subtitle:"把策划语言转换成状态、数据结构、事件流程与可验收功能。",
    scope:["状态机","数据配置","Prefab 架构","运行时流程","跨端验证"],
    method:["把体验需求写成输入与状态变化","分离数据、逻辑、表现和工具层","定义稳定槽位、事件与配置入口","为功能编写异常状态和验收标准"],
    projects:["rts","arpg","wcdel","brick","qgdxx2"],
    documents:[
      {projectId:"rts",title:"HUD 预制体开发规则",category:"UI / UX",contentPath:"/data/documents/rts/rts-d7830b9c97c9b2eb.md"},
      {projectId:"arpg",title:"天赋系统总设计：大天赋树、职业起点、专精树",category:"UI / UX",contentPath:"/data/documents/arpg/arpg-d00a3709b3435d7a.md"},
      {projectId:"wcdel",title:"架构说明",category:"技术策划",contentPath:"/data/documents/wcdel/wcdel-be58af48ebffaa81.md"},
      {projectId:"brick",title:"太空3D积木飞船幸存者：积木搭建交互与完整UI预制体方案",category:"UI / UX",contentPath:"/data/documents/brick/brick-10851bdbb6434117.md"},
      {projectId:"qgdxx2",title:"竖版城市幸存者：全界面 UI 视觉、图文布局与 UX 动效完整规范",category:"UI / UX",contentPath:"/data/documents/qgdxx2/qgdxx2-09b822dce5a18bbf.md"}
    ]
  },
  {
    id:"tools", index:"05", title:"工具与内容管线", subtitle:"减少重复劳动，让配置、资源、UI 和批量内容能持续生产。",
    scope:["配置编辑器","批量内容","资源规范","文档同步","CI 工具链"],
    method:["识别最常重复且易出错的步骤","把命名、路径和数据格式固定下来","提供预览、校验、回退与验收清单","让工具输出直接进入运行时"],
    projects:["wcdel","rts","arpg","haste","qgdxx2"],
    documents:[
      {projectId:"wcdel",title:"角色配置工具完整方案",category:"UI / UX",contentPath:"/data/documents/wcdel/wcdel-c4a15efaea29c59d.md"},
      {projectId:"wcdel",title:"UI Prefab Framework Sync",category:"UI / UX",contentPath:"/data/documents/wcdel/wcdel-fc66a550a6997c5a.md"},
      {projectId:"arpg",title:"166 模型配置编辑器：预览、挂点调整、换装测试、校验",category:"UI / UX",contentPath:"/data/documents/arpg/arpg-4b5c83c8009b9e66.md"},
      {projectId:"arpg",title:"74. 配置导入导出：JSON、ScriptableObject、Excel、热更新、版本控制",category:"系统与数值",contentPath:"/data/documents/arpg/arpg-9da6bb1a40dd4415.md"},
      {projectId:"qgdxx2",title:"竖版城市幸存者 UI 视觉重制与运行时实现说明",category:"UI / UX",contentPath:"/data/documents/qgdxx2/qgdxx2-7f3129dd8a6daa13.md"}
    ]
  },
  {
    id:"ux", index:"06", title:"UI / UX 与信息设计", subtitle:"保护游戏主画面，让复杂系统在正确时机只显示必要信息。",
    scope:["信息层级","操作流程","错误反馈","响应式布局","动效规范"],
    method:["先画出玩家任务和关键路径","按重要性安排固定与按需信息","为拖放、锁定、错误和等待提供反馈","用统一组件和内容规则保持一致"],
    projects:["brick","star","one","castle","arg","qgdxx2"],
    documents:[
      {projectId:"brick",title:"《太空3D积木飞船幸存者》积木搭建界面优化与操作流程完整文档",category:"UI / UX",contentPath:"/data/documents/brick/brick-491431983e17c657.md"},
      {projectId:"star",title:"《星空掠夺者》飞船模块分页建造、解锁与蓝图显示规则完整设计文档",category:"核心策划",contentPath:"/data/documents/star/star-b2fafeec111d8907.md"},
      {projectId:"one",title:"《击败音乐狂》完整UI布局说明文档",category:"UI / UX",contentPath:"/data/documents/one/one-6684c116863e0ab6.md"},
      {projectId:"castle",title:"Unity《亲密城堡》战斗表现与特效逻辑规范文档",category:"表现与美术",contentPath:"/data/documents/castle/castle-4ac8169cf4aaced8.md"},
      {projectId:"arg",title:"ARG 案件内容与现实调查边界",category:"制作规范",contentPath:"/data/documents/arg/arg-f2a18ed0224934bd.md"},
      {projectId:"qgdxx2",title:"竖版城市幸存者 UI 视觉重制与运行时实现说明",category:"UI / UX",contentPath:"/data/documents/qgdxx2/qgdxx2-7f3129dd8a6daa13.md"}
    ]
  }
];

const filters = ["全部","独立游戏","玩法原型","系统研究","技术原型","ARG / 互动叙事","抖音小游戏","团队项目"];

function Arrow(){ return <span aria-hidden="true">↗</span> }

function DecisionDesk(){
  const [scenarioIndex,setScenarioIndex]=useState(0);
  const [choice,setChoice]=useState<number|null>(null);
  const scenario=decisionScenarios[scenarioIndex];
  const advance=()=>{
    setScenarioIndex(index=>(index+1)%decisionScenarios.length);
    setChoice(null);
  };
  return <div className="decisionDesk" aria-labelledby="decision-desk-title">
    <div className="decisionDeskHead">
      <div><p className="kicker">FIELD TEST / 30-SECOND DECISION</p><h3 id="decision-desk-title">给一个问题，看看我先救什么。</h3></div>
      <span>{String(scenarioIndex+1).padStart(2,"0")} / {String(decisionScenarios.length).padStart(2,"0")}</span>
    </div>
    <div className="decisionDeskBody">
      <div className="decisionPrompt"><span>{scenario.tag}</span><strong>{scenario.title}</strong><p>{scenario.context}</p></div>
      <div className="decisionOptions" role="group" aria-label="现场判断选项">
        {scenario.options.map((option,index)=><button type="button" className={choice===index?"is-selected":""} aria-pressed={choice===index} onClick={()=>setChoice(index)} key={option}><i>{String.fromCharCode(65+index)}</i><span>{option}</span><b>{choice===index?"已选":"选择"}</b></button>)}
      </div>
    </div>
    <div className={`decisionResult ${choice===null?"":"is-revealed"}`} aria-live="polite">
      {choice===null?<span>先凭直觉选一个。选择后会显示这道题背后的判断依据。</span>:<><b>{choice===scenario.answer?"判断命中":"我会先做另一件事"}</b><p>{scenario.result}</p></>}
    </div>
    <div className="decisionDeskFooter"><small>现场模拟，不是标准答案；它只展示我如何把时间花在最接近体验的问题上。</small><button type="button" onClick={advance}>下一个问题 <Arrow/></button></div>
  </div>;
}

export default function Portfolio(){
  const [filter,setFilter]=useState("全部");
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState<Project|null>(null);
  const [fullCatalog,setFullCatalog]=useState<Record<string,CatalogDoc[]>>({});
  const [catalogLoading,setCatalogLoading]=useState(false);
  const [docQuery,setDocQuery]=useState("");
  const [docCategory,setDocCategory]=useState("全部");
  const [docLimit,setDocLimit]=useState(18);
  const [readingDoc,setReadingDoc]=useState<CatalogDoc|null>(null);
  const [readingContent,setReadingContent]=useState("");
  const [readingLoading,setReadingLoading]=useState(false);
  const [mediaCategory,setMediaCategory]=useState("全部");
  const [lightboxMedia,setLightboxMedia]=useState<MediaItem|null>(null);
  const [activeDoctrine,setActiveDoctrine]=useState(0);
  const shown=useMemo(()=>projects.filter(p=>(filter==="全部"||p.type===filter)&&(p.name+p.en+p.pitch+p.tags.join("")).toLowerCase().includes(query.toLowerCase())),[filter,query]);
  const projectDocs=useMemo(()=>selected?fullCatalog[selected.id]??[]:[],[selected,fullCatalog]);
  const projectMedia=useMemo(()=>selected?mediaCatalog[selected.id]??[]:[],[selected]);
  const projectDownloads=useMemo(()=>selected?downloadsByProject[selected.id]??[]:[],[selected]);
  const mediaCategories=useMemo(()=>["全部",...Array.from(new Set(projectMedia.map(item=>item.category)))],[projectMedia]);
  const filteredMedia=projectMedia.filter(item=>mediaCategory==="全部"||item.category===mediaCategory);
  const docCategories=useMemo(()=>["全部",...Array.from(new Set(projectDocs.map(d=>d.category)))],[projectDocs]);
  const filteredDocs=useMemo(()=>projectDocs.filter(d=>(docCategory==="全部"||d.category===docCategory)&&(`${d.title}${d.summary}${d.keyPoints.join("")}${d.sections.join("")}`).toLowerCase().includes(docQuery.toLowerCase())),[projectDocs,docCategory,docQuery]);
  const selectProject=(project:Project)=>{
    setSelected(project);
    setDocQuery("");
    setDocCategory("全部");
    setDocLimit(18);
    setReadingDoc(null);
    setReadingContent("");
    setMediaCategory("全部");
    setLightboxMedia(null);
    if(!Object.keys(fullCatalog).length)setCatalogLoading(true);
  };
  useEffect(()=>{
    const overlayOpen=Boolean(selected||lightboxMedia||readingDoc);
    if(!overlayOpen)return;
    const previousOverflow=document.body.style.overflow;
    const closeOnEscape=(event:KeyboardEvent)=>{
      if(event.key!=="Escape")return;
      setReadingDoc(null);
      setLightboxMedia(null);
      setSelected(null);
    };
    document.body.style.overflow="hidden";
    window.addEventListener("keydown",closeOnEscape);
    return()=>{
      document.body.style.overflow=previousOverflow;
      window.removeEventListener("keydown",closeOnEscape);
    };
  },[selected,lightboxMedia,readingDoc]);
  useEffect(()=>{
    if(!selected||Object.keys(fullCatalog).length)return;
    fetch("/data/document-catalog.json").then(r=>r.json()).then(data=>setFullCatalog(data.catalog??{})).finally(()=>setCatalogLoading(false));
  },[selected,fullCatalog]);
  const openFullDocument=(doc:CatalogDoc)=>{
    setReadingDoc(doc);setReadingContent("");setReadingLoading(true);
    fetch(doc.contentPath).then(r=>r.text()).then(setReadingContent).finally(()=>setReadingLoading(false));
  };
  const openCapabilityDocument=(evidence:{projectId:string;title:string;category:string;contentPath:string})=>{
    const project=projects.find(item=>item.id===evidence.projectId);
    if(!project)return;
    selectProject(project);
    openFullDocument({
      id:`capability-${evidence.projectId}-${evidence.contentPath}`,
      projectId:evidence.projectId,
      title:evidence.title,
      category:evidence.category,
      group:"能力证据",
      contentPath:evidence.contentPath,
      sourceFile:evidence.contentPath.split("/").pop()??"",
      summary:"该文档是此项个人能力的直接项目证据。",
      keyPoints:[],
      sections:[],
      modifiedAt:"",
      readMinutes:0,
      charCount:0
    });
  };
  const scrollTo=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="返回首页"><span>GD</span><b>游戏设计档案</b></a>
      <nav aria-label="主导航">
        <a href="#timeline">时间轴</a><a href="#projects">项目经历</a><a href="#doctrines">设计立场</a><a href="#skills">个人能力</a><a href="#resume">简历</a><a href="#other">联系</a>
      </nav>
      <button className="contact" onClick={()=>scrollTo("other")}>联系我 <Arrow/></button>
    </header>

    <section className="hero" id="top">
      <img src="/media/hero-archive.png" alt="海上堡垒、星际基地与积木飞船组成的游戏设计档案视觉图" />
      <div className="heroShade"/>
      <div className="heroCopy">
        <p className="eyebrow">GAME DESIGNER · TECHNICAL DESIGNER</p>
        <h1>把玩法想法<br/>推进到<span>可运行</span></h1>
        <p className="lead">持续进行独立游戏与玩法原型开发。以游戏策划和技术策划为核心，跨越程序、视听表现与 AI 工具链，让每个判断都能被玩到、被验证。</p>
        <div className="heroActions"><button className="primary" onClick={()=>{selectProject(projects[0])}}>查看代表项目 <Arrow/></button><button className="secondary" onClick={()=>scrollTo("projects")}>浏览全部 {projects.length} 个项目</button></div>
        <a className="heroLabLink" href="#lab"><span>PLAYABLE</span> 进入战斗实验室 <Arrow/></a>
      </div>
      <div className="stats" aria-label="作品集统计">
        <div><strong>{projects.length}</strong><span>项目 / 原型</span></div><div><strong>6</strong><span>可运行成果</span></div><div><strong>{totalUniqueDocs}</strong><span>工程文档入库</span></div>
      </div>
      <div className="now"><i/><span>NOW BUILDING</span><b>吞吞舰船</b></div>
    </section>

    <section className="section labSection" id="lab">
      <div className="labHeading">
        <div><h2>先读招，<br/><span>再下结论。</span></h2></div>
        <div><p>一个把战斗策划方法变成即时反馈的微型实验。移动准星，观察攻击前摇，在窗口内完成反制。</p><p className="labHeadingMeta">30 秒一轮 · 三种威胁读法 · 支持鼠标、触摸与键盘</p></div>
      </div>
      <BattleLab />
    </section>

    <section className="section doctrineSection" id="doctrines">
      <div className="doctrineIntro"><div><p className="kicker">FIELD NOTES / DESIGN DOCTRINES</p><h2>我如何做<br/><span>判断。</span></h2></div><p>作品集里最值得被看到的，不只是做过哪些项目，还有我在不确定里会优先保护什么。点选一条，查看它在真实工程中的落点。</p></div>
      <div className="doctrineGrid">
        <div className="doctrineRail" role="tablist" aria-label="设计立场">
          {designDoctrines.map((item,index)=><button type="button" role="tab" id={`doctrine-tab-${index}`} aria-controls="doctrine-panel" aria-selected={activeDoctrine===index} className={activeDoctrine===index?"is-active":""} onClick={()=>setActiveDoctrine(index)} key={item.label}><span>{item.label}</span><b>{String(index+1).padStart(2,"0")}</b></button>)}
        </div>
        <article className="doctrineCard" id="doctrine-panel" role="tabpanel" aria-labelledby={`doctrine-tab-${activeDoctrine}`}><span className="doctrineStamp">{designDoctrines[activeDoctrine].label}</span><h3>{designDoctrines[activeDoctrine].title}</h3><p>{designDoctrines[activeDoctrine].body}</p><small>{designDoctrines[activeDoctrine].proof}</small><div className="doctrineMark" aria-hidden="true">✦</div></article>
      </div>
      <DecisionDesk />
    </section>

    <section className="section timelineSection" id="timeline">
      <div className="sectionHead"><div><p className="kicker">01 / DEVELOPMENT LOG</p><h2>不是项目列表，<br/>是一次次判断的轨迹。</h2></div><p>每个节点只记录一次真正改变项目的时刻：玩法成型、结构重做、可运行版本，或一次值得保留的失败。</p></div>
      <div className="timeline">
        {timeline.map(t=>{const p=projects.find(x=>x.id===t[3])!;return <article className="timeNode" key={t[0]+t[2]}>
          <div className="timeMeta"><span>{t[0]}</span><em>{t[1]}</em></div><button className="dot" aria-label={`查看 ${p.name}`} onClick={()=>selectProject(p)}/>
          <div className="timeCard" role="button" tabIndex={0} style={{"--accent":p.accent} as React.CSSProperties} onClick={()=>selectProject(p)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectProject(p)}}}>
            <div className="miniVisual">{p.image?<img src={p.image} alt=""/>:<span>{p.en}</span>}</div>
            <div><p>{p.type} · {p.status}</p><h3>{t[2]}</h3><span className="role">{p.role}</span><button>打开档案 <Arrow/></button></div>
          </div>
        </article>})}
      </div>
    </section>

    <section className="section projectsSection" id="projects">
      <div className="sectionHead compact"><div><p className="kicker">02 / PROJECT INDEX</p><h2>项目经历</h2></div><p>从核心玩法到落地工具，展示我具体做了什么、做到哪里，以及接下来要验证什么。</p></div>
      <div className="projectTools">
        <div className="filters" role="group" aria-label="项目类型筛选">{filters.map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}</div>
        <label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索项目、引擎或能力…" aria-label="搜索项目"/></label>
      </div>
      <div className="projectGrid">
        {shown.map((p,i)=><article className={`projectCard ${i<3?"featured":""}`} key={p.id} role="button" tabIndex={0} style={{"--accent":p.accent} as React.CSSProperties} onClick={()=>selectProject(p)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectProject(p)}}}>
          <div className="cover">{p.image?<img src={p.image} alt={`${p.name}项目画面，作为作品封面`}/>:<div className="coverFallback"><span>{p.en}</span><i/></div>}<span className="mediaType">{p.image?"项目素材":"视觉占位"}</span><button aria-label={`查看 ${p.name}`}>↗</button></div>
          <div className="cardBody"><div className="cardTop"><span>{String(i+1).padStart(2,"0")}</span><em>{p.status}</em></div><h3>{p.name}</h3><p>{p.pitch}</p><small>{p.role} · {catalogTotals[p.id]??0} 文档 · {mediaCatalog[p.id]?.length??0} 视觉资产</small>{downloadsByProject[p.id]?.length?<div className="downloadAvailable">↓ {downloadsByProject[p.id].length} 个试玩包可下载</div>:null}<div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div>
        </article>)}
      </div>
      {!shown.length&&<div className="empty">没有匹配的项目。<button type="button" onClick={()=>{setFilter("全部");setQuery("")}}>清除筛选</button></div>}
    </section>

    <section className="section skillsSection" id="skills">
      <div className="sectionHead"><div><p className="kicker">03 / CAPABILITY MAP</p><h2>核心是策划，<br/>证据来自项目。</h2></div><p>不使用“熟练度 90%”。能力由真实问题、设计方法、项目结果和工程文档共同证明。</p></div>
      <div className="capabilityIntro">
        <div><span>PRIMARY ROLE</span><h3>游戏策划<br/>& 技术策划</h3><p>从玩法定位、系统规则和战斗逻辑，一直推进到数据结构、UI 流程、配置工具与可运行原型。</p></div>
        <dl><div><dt>项目证据</dt><dd>{projects.length}</dd></div><div><dt>工程文档</dt><dd>{totalUniqueDocs}</dd></div><div><dt>能力方向</dt><dd>{capabilities.length}</dd></div><div><dt>可运行成果</dt><dd>6</dd></div></dl>
      </div>
      <div className="capabilityList">{capabilities.map(cap=><article className="capabilityCard" key={cap.id}>
        <div className="capabilityName"><span>{cap.index}</span><div><p>CAPABILITY</p><h3>{cap.title}</h3><strong>{cap.subtitle}</strong></div></div>
        <div className="capabilityScope"><p>覆盖范围</p><div>{cap.scope.map(item=><span key={item}>{item}</span>)}</div></div>
        <div className="capabilityMethod"><p>我的设计方法</p><ol>{cap.method.map(item=><li key={item}>{item}</li>)}</ol></div>
        <div className="capabilityEvidence"><p>文档证据 · 点击直达原文</p><div className="capabilityEvidenceList">{cap.documents.map(doc=>{const project=projects.find(item=>item.id===doc.projectId)!;return <button key={doc.contentPath} onClick={()=>openCapabilityDocument(doc)}><span>{project.name} · {doc.category}</span><strong>{doc.title}</strong><i>阅读原文 <Arrow/></i></button>})}</div></div>
        <div className="capabilityProjects"><p>关联项目</p><div>{cap.projects.map(id=>{const p=projects.find(item=>item.id===id)!;return <button key={id} onClick={()=>selectProject(p)} style={{"--accent":p.accent} as React.CSSProperties}><i/>{p.name}<Arrow/></button>})}</div></div>
      </article>)}</div>
      <div className="proofStrip"><p>能力证据链</p><span>问题定义</span><i>→</i><span>规则与数据</span><i>→</i><span>原型实现</span><i>→</i><span>视听反馈</span><i>→</i><span>复盘迭代</span></div>
    </section>

    <section className="section docsSection">
      <div className="sectionHead compact"><div><p className="kicker">04 / DOCUMENT ARCHIVE</p><h2>{totalUniqueDocs} 篇工程文档</h2></div><p>精选解读负责呈现判断深度，完整目录保留每个项目真实的设计覆盖面。进入任一项目，即可按分类、标题、章节与关键词浏览。</p></div>
      <div className="archiveMetrics"><div><strong>11</strong><span>文档分类</span></div><div><strong>{projects.length}</strong><span>项目档案</span></div><div><strong>35</strong><span>深度解读</span></div><div><strong>{totalUniqueDocs}</strong><span>原始文档索引</span></div></div>
      <div className="docList">{featuredDocs.map(([projectId,docIndex],i)=>{const p=projects.find(item=>item.id===projectId)!;const d=docsByProject[projectId][docIndex];return <article key={d.title} role="button" onClick={()=>selectProject(p)} tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectProject(p)}}}>
        <span className="docNo">D{String(i+1).padStart(2,"0")}</span><div><small>{p.name} · {d.type} · {d.status}</small><h3>{d.title}</h3><p>{d.problem}</p></div><span className="read">{d.read}<b>↗</b></span>
      </article>})}</div>
    </section>

    <section className="section resumeSection" id="resume">
      <div className="sectionHead compact"><div><p className="kicker">05 / CAREER RECORD</p><h2>战斗策划，<br/>把系统做成体验。</h2></div><p>从 FPS 关卡、MOBA 玩法到 TPS 肉鸽战斗，持续参与从原型、制作到上线运营的完整过程。</p></div>
      <div className="resumeIntro">
        <div className="resumeSummary"><p className="resumeLabel">TARGET ROLE</p><h3>战斗策划<br/><span>玩法与技术策划</span></h3><p>史泽昌（格朗） · 2017 至今持续从事游戏策划工作。擅长把战斗目标拆成规则、行为、表现和工具，再通过可运行原型验证。</p><div className="resumeActions"><a className="resumeDownload" href={resumePdfHref} download>下载完整简历 <Arrow/></a><a className="resumeContactAction" href="mailto:2454807537@qq.com">2454807537@qq.com <Arrow/></a></div></div>
        <dl className="resumeFacts"><div><dt>工作经历</dt><dd>2017 至今</dd></div><div><dt>核心方向</dt><dd>战斗 / 玩法</dd></div><div><dt>毕业院校</dt><dd>河南工程学院</dd></div><div><dt>技术基础</dt><dd>C# / C++ / Python</dd></div></dl>
      </div>
      <div className="resumeGrid">
        <div className="resumeHistory"><div className="resumeSubhead"><span>WORK HISTORY</span><strong>工作经历</strong></div>{resumeExperiences.map(item=><article className="resumeEntry" key={`${item.period}-${item.company}`}><div className="resumeEntryMeta"><span>{item.period}</span><b>{item.company}</b></div><div className="resumeEntryBody"><h3>{item.role}</h3><p className="resumeProject">项目：{item.projects}</p><ul>{item.highlights.map(highlight=><li key={highlight}>{highlight}</li>)}</ul>{item.links.length?<div className="resumeEntryLinks">{item.links.map(link=><a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} <Arrow/></a>)}</div>:null}</div></article>)}</div>
        <aside className="resumeAside"><div className="resumeSubhead"><span>WORKING FOCUS</span><strong>能力重点</strong></div><div className="resumeFocusList">{resumeFocus.map(item=><article key={item.label}><span>{item.label}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div><div className="resumeSubhead worksSubhead"><span>SELECTED WORKS</span><strong>独立制作</strong></div><div className="resumeWorks">{resumeWorks.map(work=><a href={work.href} target={work.href.startsWith("#")?undefined:"_blank"} rel={work.href.startsWith("#")?undefined:"noreferrer"} key={work.title}><span><b>{work.title}</b><small>{work.meta}</small></span><Arrow/></a>)}</div></aside>
      </div>
    </section>

    <footer id="other">
      <div><p className="kicker">OPEN TO COLLABORATION</p><h2>一起把下一个<br/><span>好玩的判断</span>做出来。</h2></div>
      <div className="footerRight"><p>游戏策划 / 战斗策划 / 技术策划<br/>现居中国 · 可远程协作</p><div className="contactLinks"><a href="mailto:2454807537@qq.com">2454807537@qq.com <Arrow/></a><a href="tel:+8615565861024">15565861024 <span>电话 / 微信</span> <Arrow/></a><a href={resumePdfHref} download>下载简历 PDF <Arrow/></a></div><small>欢迎讨论战斗策划、玩法原型、工具与 AI 协作流程。</small></div>
      <div className="footerBottom"><span>游戏设计档案 · 2026</span><span>DESIGNED AS A LIVING ARCHIVE</span><a href="#top">回到顶部 ↑</a></div>
    </footer>

    <ArchiveConsole />
    <MusicDock />

    {selected&&<div className="modalBackdrop" role="presentation" onMouseDown={()=>setSelected(null)}>
      <article className="projectModal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={e=>e.stopPropagation()}>
        <button className="close" onClick={()=>setSelected(null)} aria-label="关闭项目详情">×</button>
        <div className="modalHero" style={{"--accent":selected.accent} as React.CSSProperties}>{selected.image?<img src={selected.image} alt={`${selected.name}项目画面`}/>:<div className="modalFallback">{selected.en}</div>}<div><span>{selected.status} · {selected.type}</span><h2 id="modal-title">{selected.name}</h2><p>{selected.pitch}</p></div></div>
        <div className="modalBody">
          <aside><a href="#overview">概览</a>{projectDownloads.length?<a className="asideDownload" href="#downloads">↓ 下载试玩</a>:null}<a href="#loop">核心玩法</a><a href="#media">美术资产</a><a href="#documents">项目文档</a><a href="#progress">当前进度</a><a href="#ai">AI 参与</a></aside>
          <div>
            <section id="overview"><p className="kicker">PROJECT OVERVIEW</p><h3>先说它为什么值得做</h3><p>{selected.pitch} 当前档案基于工程目录、已有设计文档与项目素材整理；具体开发时间、版本号与公开范围仍标记为待本人确认。</p><dl><div><dt>个人职责</dt><dd>{selected.role}</dd></div><div><dt>引擎 / 标签</dt><dd>{selected.tags.join(" · ")}</dd></div><div><dt>可验证成果</dt><dd>{projectDownloads.length?`${projectDownloads.length} 个可直接下载的试玩版本`:(selected.playable?"工程中发现可运行包体，公开链接整理中":"工程原型与设计文档，媒体继续整理中")}</dd></div></dl></section>
            {projectDownloads.length?<section id="downloads" className="projectDownloads"><div className="downloadHeading"><div><p className="kicker">PLAYABLE BUILDS</p><h3>下载试玩</h3><p>选择设备下载当前可运行版本。Windows 包解压后运行同名 EXE；安卓包需要允许安装外部 APK。</p></div><span>可运行版本</span></div><div className="downloadGrid">{projectDownloads.map(item=><a href={item.href} download={item.filename} key={item.href}><i>{item.platform==="Windows"?"PC":"APK"}</i><div><small>{item.platform} · {item.size}</small><strong>{item.title}</strong><span>{item.filename}</span></div><b>立即下载 ↓</b></a>)}</div></section>:null}
            <section id="loop"><p className="kicker">DESIGN LOOP</p><h3>从选择到反馈的闭环</h3><div className="loop"><span>观察局势</span><i>→</i><span>做出构筑</span><i>→</i><span>进入验证</span><i>→</i><span>带回成长</span></div><p>详情页首版保留统一结构，后续会从原项目文档中继续提炼每个模块的玩家目标、操作、主要决策、即时反馈与失败代价。</p></section>
            <section id="media" className="projectMedia"><div className="mediaHeading"><div><p className="kicker">ART & MEDIA ARCHIVE</p><h3>项目美术资产</h3><p>按用途整理工程中的画面、UI、角色、场景、模型预览、特效与图标。所有 AI 概念封面均明确标注，不与实机截图混用。</p></div><strong>{projectMedia.length}<small> ASSETS</small></strong></div>
              <div className="mediaFilters" role="group" aria-label="美术资产分类">{mediaCategories.map(c=><button key={c} aria-pressed={mediaCategory===c} onClick={()=>setMediaCategory(c)}>{c}<b>{c==="全部"?projectMedia.length:projectMedia.filter(item=>item.category===c).length}</b></button>)}</div>
              <div className="mediaGrid">{filteredMedia.map((item,i)=><button className={`mediaCard ${i===0?"mediaLead":""}`} key={item.id} onClick={()=>setLightboxMedia(item)}>
                <div>{item.mediaType==="video"?<video src={`${item.src}#t=0.1`} preload="metadata" muted playsInline/>:<img src={item.src} alt={`${item.title}：${item.caption}`} loading="lazy"/>}<span>{item.sourceType}</span><i>{item.mediaType==="video"?"▶":"＋"}</i></div><small>{item.category}</small><h4>{item.title}</h4><p>{item.caption}</p>
              </button>)}</div>
              {!projectMedia.length&&<div className="mediaEmpty">该项目的可公开视觉资产仍在整理中。</div>}
            </section>
            <section id="documents" className="projectDocuments"><div className="documentHeading"><div><p className="kicker">SELECTED DOCUMENTS</p><h3>从原始 Docs 提炼的设计证据</h3></div><span>{docsByProject[selected.id]?.length ?? 0} 篇精选</span></div>
              <p className="documentIntro">以下内容来自项目工程中的原始设计文档。摘要保留问题、判断与落地证据，不展示冗长目录；点击每张卡片可展开核心结论。</p>
              <div className="documentStack">{(docsByProject[selected.id]??[]).map((d,i)=><details className="documentCard" key={d.title} open={i===0}>
                <summary><span className="documentIndex">{String(i+1).padStart(2,"0")}</span><div><small>{d.type} · {d.status}</small><h4>{d.title}</h4><p>{d.problem}</p></div><span className="expandMark">＋</span></summary>
                <div className="documentDetails"><div className="conclusionBlock"><span>核心结论</span><ol>{d.conclusions.map(c=><li key={c}>{c}</li>)}</ol></div><div className="evidenceBlock"><span>落地证据</span><p>{d.evidence}</p><small>预计阅读 {d.read}</small></div></div>
              </details>)}</div>
              <div className="fullArchive">
                <div className="archiveTitle"><div><p className="kicker">FULL DOCUMENT LIBRARY</p><h3>完整文档目录</h3><p>不再只保留精选：这里收录该工程中可识别的全部项目 Markdown 文档，并从原文提取章节、关键条目、更新时间和阅读量级。</p></div><strong>{catalogTotals[selected.id]??0}<small> DOCS</small></strong></div>
                <div className="archiveToolbar">
                  <label className="archiveSearch"><span>⌕</span><input value={docQuery} onChange={e=>{setDocQuery(e.target.value);setDocLimit(18)}} placeholder="搜索标题、摘要、章节或关键条目…" aria-label="搜索当前项目文档"/></label>
                  <span>{catalogLoading?"正在读取文档索引…":`显示 ${Math.min(docLimit,filteredDocs.length)} / ${filteredDocs.length}`}</span>
                </div>
                <div className="archiveFilters" role="group" aria-label="文档分类筛选">{docCategories.map(c=><button key={c} aria-pressed={docCategory===c} onClick={()=>{setDocCategory(c);setDocLimit(18)}}>{c}<b>{c==="全部"?projectDocs.length:projectDocs.filter(d=>d.category===c).length}</b></button>)}</div>
                {catalogLoading&&<div className="catalogLoading"><i/><span>正在装载完整文档目录</span></div>}
                <div className="catalogGrid">{filteredDocs.slice(0,docLimit).map((d)=><details className="catalogCard" key={d.id}>
                  <summary><div className="catalogMeta"><span>{d.category}</span><em>{d.group}</em></div><h4>{d.title}</h4><p>{d.summary}</p><div className="catalogFoot"><span>{d.modifiedAt}</span><span>约 {d.readMinutes} 分钟</span><span>{Math.max(1,Math.round(d.charCount/1000))}k 字符</span><b>展开预览 ＋</b></div></summary>
                  <div className="catalogPreview">
                    {!!d.keyPoints.length&&<div><span>原文关键条目</span><ul>{d.keyPoints.slice(0,5).map(point=><li key={point}>{point}</li>)}</ul></div>}
                    {!!d.sections.length&&<div><span>章节导航预览</span><ol>{d.sections.slice(0,9).map(section=><li key={section}>{section}</li>)}</ol></div>}
                    <div className="catalogAction"><small>来源文件：{d.sourceFile} · 原始工程文档保持只读。</small><button onClick={()=>openFullDocument(d)}>阅读完整原文 <Arrow/></button></div>
                  </div>
                </details>)}</div>
                {!filteredDocs.length&&<div className="catalogEmpty">没有匹配的文档。<button onClick={()=>{setDocQuery("");setDocCategory("全部")}}>清除筛选</button></div>}
                {filteredDocs.length>docLimit&&<button className="loadMore" onClick={()=>setDocLimit(v=>v+24)}>继续加载 <b>{Math.min(24,filteredDocs.length-docLimit)}</b> 篇文档 ↓</button>}
              </div>
            </section>
            <section id="progress"><p className="kicker">PROGRESS</p><h3>公开进度，不伪造百分比</h3><div className="progressRows"><span>核心循环 <b>可运行 / 验证中</b></span><span>内容与数值 <b>持续扩充</b></span><span>媒体与包体 <b>公开范围待确认</b></span></div></section>
            <section id="ai"><p className="kicker">AI DISCLOSURE</p><h3>AI 是协作层，不是判断者</h3><p>现有工程中包含 AI 辅助产出的文档与视觉素材。网站会明确区分概念图、生成图、实机与编辑器画面；需求取舍、规则审校、工程接入与最终判断由本人完成。各项目具体参与比例待确认。</p></section>
          </div>
        </div>
      </article>
      {lightboxMedia&&<div className="mediaLightbox" onMouseDown={()=>setLightboxMedia(null)}>
        <article role="dialog" aria-modal="true" aria-label={lightboxMedia.title} onMouseDown={e=>e.stopPropagation()}>
          <button className="lightboxClose" onClick={()=>setLightboxMedia(null)} aria-label="关闭媒体">×</button>
          <div className="lightboxImage">{lightboxMedia.mediaType==="video"?<video src={lightboxMedia.src} controls autoPlay playsInline/>:<img src={lightboxMedia.src} alt={`${lightboxMedia.title}：${lightboxMedia.caption}`}/>}</div>
          <div className="lightboxCopy"><span>{lightboxMedia.category} · {lightboxMedia.sourceType}</span><h3>{lightboxMedia.title}</h3><p>{lightboxMedia.caption}</p></div>
        </article>
      </div>}
      {readingDoc&&<div className="readerBackdrop" onMouseDown={()=>setReadingDoc(null)}>
        <article className="documentReader" role="dialog" aria-modal="true" aria-labelledby="reader-title" onMouseDown={e=>e.stopPropagation()}>
          <header><div><span>{readingDoc.category} · {readingDoc.group}</span><h2 id="reader-title">{readingDoc.title}</h2><p>{readingDoc.sourceFile} · 更新于 {readingDoc.modifiedAt} · 约 {readingDoc.readMinutes} 分钟</p></div><button onClick={()=>setReadingDoc(null)} aria-label="关闭完整文档">×</button></header>
          <div className="readerLayout">
            <aside><p>文档章节</p>{readingDoc.sections.slice(0,12).map((section,i)=><span key={`${section}-${i}`}>{String(i+1).padStart(2,"0")} {section}</span>)}</aside>
            <div className="markdownBody">{readingLoading?<div className="readerLoading"><i/><span>正在读取原始文档…</span></div>:<ReactMarkdown remarkPlugins={[remarkGfm]}>{readingContent}</ReactMarkdown>}</div>
          </div>
        </article>
      </div>}
    </div>}
  </main>
}
