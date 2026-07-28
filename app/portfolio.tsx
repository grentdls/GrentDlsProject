"use client";

import { useEffect, useMemo, useState } from "react";
import documentCounts from "./document-counts.json";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

const catalogTotals = documentCounts as Record<string, number>;
const totalUniqueDocs = ["tuntun","wcdel","star","rts","arpg","one","castle","brick","haste"]
  .reduce((sum,id)=>sum+(catalogTotals[id]??0),0);

const projects: Project[] = [
  { id:"tuntun", name:"吞吞舰船", en:"TUNTUN SHIP", pitch:"把海上移动堡垒、Roguelike 战斗与长期港口经营装进同一片海域。", status:"进行中", type:"独立游戏", role:"系统策划 / 技术策划 / 原型", tags:["Unity","Roguelike","海战","系统设计"], image:"/media/tuntun-cover.png", accent:"#e8aa4d", playable:true },
  { id:"star", name:"星空掠夺者", en:"STAR RAIDERS", pitch:"在桌面一角经营会持续运转的飞船基地，组织角色、模块与远征。", status:"可试玩", type:"独立游戏", role:"玩法策划 / UI / 程序", tags:["Unity 2D","挂机","基地经营","100+ 数据"], image:"/media/starraiders-cover.png", accent:"#5fd0ca", playable:true },
  { id:"brick", name:"积木飞船幸存者", en:"BRICK SURVIVOR", pitch:"先像搭积木一样造船，再把每个结构选择送进太空战场验证。", status:"可试玩", type:"玩法原型", role:"技术策划 / 交互 / 原型", tags:["Unity 3D","模块搭建","幸存者","UX"], image:"/media/brick-cover.png", accent:"#f07b48", playable:true },
  { id:"rts", name:"华夏城战", en:"HUAXIA RTS", pitch:"从城池经营到战场调度的轻量 RTS；Unity 与 Web 双版本并行验证。", status:"验证中", type:"系统研究", role:"系统策划 / Web 原型", tags:["RTS","Unity","Web","数据驱动"], accent:"#d5a35b", playable:true },
  { id:"arpg", name:"荒野旅团 ARPG", en:"WILDLAND ARPG", pitch:"围绕 3C、战斗反馈与模块化地图构建的 3D 动作角色扮演原型。", status:"开发中", type:"技术原型", role:"技术策划 / 3C / 战斗", tags:["Unity 3D","ARPG","3C","战斗反馈"], image:"/media/rpg-cover.png", accent:"#71a36f" },
  { id:"wcdel", name:"轻量开放世界 ARPG", en:"WCDEL", pitch:"以小体量团队可落地为约束，搭建开放世界 ARPG 的工程与内容骨架。", status:"开发中", type:"独立游戏", role:"架构 / UI / 内容管线", tags:["Unity","架构","开放世界","UI"], accent:"#dbbd79" },
  { id:"one", name:"击败音乐狂人", en:"DEFEAT MUSIC MANIAC", pitch:"让弹幕、角色成长与音乐节拍彼此驱动的高反馈动作实验。", status:"可试玩", type:"玩法原型", role:"玩法 / 音频 / 表现", tags:["Unity 2D","节奏","弹幕","AI 角色"], accent:"#c36dd8", playable:true },
  { id:"castle", name:"亲密城堡", en:"INTIMATE CASTLE", pitch:"以关系构筑与流派组合为核心的卡牌爬塔原型。", status:"可试玩", type:"玩法原型", role:"卡牌系统 / 美术规范 / UI", tags:["Unity","卡牌","Build","爬塔"], accent:"#d5687f", playable:true },
  { id:"oneproto", name:"造物主试炼", en:"CREATOR'S TRIAL", pitch:"反向幸存者与造物构筑结合的系统概念验证。", status:"概念验证", type:"设计研究", role:"核心循环 / GDD", tags:["Roguelike","反向幸存者","GDD"], accent:"#8d84d7" },
  { id:"haste", name:"Haste", en:"TEAM PROJECT", pitch:"团队商业项目中的工程协作、内容生产与工具链经验。", status:"团队项目", type:"团队项目", role:"项目协作 / 工具 / 内容", tags:["Unity","团队协作","工具链","商业项目"], accent:"#75b6d6", team:true }
];

const timeline = [
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
  ]
};

const featuredDocs = [
  ["tuntun",0],["star",1],["brick",1],["arpg",2]
] as const;

const filters = ["全部","独立游戏","玩法原型","系统研究","技术原型","团队项目"];

function Arrow(){ return <span aria-hidden="true">↗</span> }

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
  const shown=useMemo(()=>projects.filter(p=>(filter==="全部"||p.type===filter)&&(p.name+p.en+p.pitch+p.tags.join("")).toLowerCase().includes(query.toLowerCase())),[filter,query]);
  const projectDocs=selected?fullCatalog[selected.id]??[]:[];
  const docCategories=useMemo(()=>["全部",...Array.from(new Set(projectDocs.map(d=>d.category)))],[projectDocs]);
  const filteredDocs=useMemo(()=>projectDocs.filter(d=>(docCategory==="全部"||d.category===docCategory)&&(`${d.title}${d.summary}${d.keyPoints.join("")}${d.sections.join("")}`).toLowerCase().includes(docQuery.toLowerCase())),[projectDocs,docCategory,docQuery]);
  useEffect(()=>{setDocQuery("");setDocCategory("全部");setDocLimit(18);setReadingDoc(null);setReadingContent("")},[selected?.id]);
  useEffect(()=>{
    if(!selected||Object.keys(fullCatalog).length)return;
    setCatalogLoading(true);
    fetch("/data/document-catalog.json").then(r=>r.json()).then(data=>setFullCatalog(data.catalog??{})).finally(()=>setCatalogLoading(false));
  },[selected,fullCatalog]);
  const openFullDocument=(doc:CatalogDoc)=>{
    setReadingDoc(doc);setReadingContent("");setReadingLoading(true);
    fetch(doc.contentPath).then(r=>r.text()).then(setReadingContent).finally(()=>setReadingLoading(false));
  };
  const scrollTo=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="返回首页"><span>GD</span><b>游戏设计档案</b></a>
      <nav aria-label="主导航">
        <a href="#timeline">时间轴</a><a href="#projects">项目经历</a><a href="#skills">个人能力</a><a href="#other">其他</a>
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
        <div className="heroActions"><button className="primary" onClick={()=>{setSelected(projects[0])}}>查看代表项目 <Arrow/></button><button className="secondary" onClick={()=>scrollTo("projects")}>浏览全部 10 个项目</button></div>
      </div>
      <div className="stats" aria-label="作品集统计">
        <div><strong>10</strong><span>项目 / 原型</span></div><div><strong>6</strong><span>可运行成果</span></div><div><strong>{totalUniqueDocs}</strong><span>工程文档入库</span></div>
      </div>
      <div className="now"><i/><span>NOW BUILDING</span><b>吞吞舰船</b></div>
    </section>

    <section className="section timelineSection" id="timeline">
      <div className="sectionHead"><div><p className="kicker">01 / DEVELOPMENT LOG</p><h2>不是项目列表，<br/>是一次次判断的轨迹。</h2></div><p>每个节点只记录一次真正改变项目的时刻：玩法成型、结构重做、可运行版本，或一次值得保留的失败。</p></div>
      <div className="timeline">
        {timeline.map((t,i)=>{const p=projects.find(x=>x.id===t[3])!;return <article className="timeNode" key={t[0]+t[2]}>
          <div className="timeMeta"><span>{t[0]}</span><em>{t[1]}</em></div><button className="dot" aria-label={`查看 ${p.name}`} onClick={()=>setSelected(p)}/>
          <div className="timeCard" style={{"--accent":p.accent} as React.CSSProperties} onClick={()=>setSelected(p)}>
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
        {shown.map((p,i)=><article className={`projectCard ${i<3?"featured":""}`} key={p.id} style={{"--accent":p.accent} as React.CSSProperties} onClick={()=>setSelected(p)}>
          <div className="cover">{p.image?<img src={p.image} alt={`${p.name}项目画面，作为作品封面`}/>:<div className="coverFallback"><span>{p.en}</span><i/></div>}<span className="mediaType">{p.image?"项目素材":"视觉占位"}</span><button aria-label={`查看 ${p.name}`}>↗</button></div>
          <div className="cardBody"><div className="cardTop"><span>{String(i+1).padStart(2,"0")}</span><em>{p.status}</em></div><h3>{p.name}</h3><p>{p.pitch}</p><small>{p.role} · {catalogTotals[p.id]??0} 篇文档 / {docsByProject[p.id]?.length ?? 0} 篇深度解读</small><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div>
        </article>)}
      </div>
      {!shown.length&&<div className="empty">没有匹配的项目。<button onClick={()=>{setFilter("全部");setQuery("")}}>清除筛选</button></div>}
    </section>

    <section className="section skillsSection" id="skills">
      <div className="sectionHead"><div><p className="kicker">03 / CAPABILITY MAP</p><h2>核心是策划，<br/>边界是把它做出来。</h2></div><p>不使用“熟练度 90%”。每项能力都由项目、文档和可运行结果互相证明。</p></div>
      <div className="skillMap">
        <div className="coreSkill"><span>CORE</span><h3>游戏策划<br/>& 技术策划</h3><p>玩法循环 · 系统规则 · 实现边界 · 验证方案</p></div>
        {[
          ["01","玩法与系统","战斗、成长、关卡、经济","8 个项目"],
          ["02","实现与工具","Unity、Web、数据、编辑器","6 个原型"],
          ["03","UI / UX","信息层级、流程、反馈、引导","30+ 界面"],
          ["04","视听表现","美术规范、动作、镜头、音频","5 类管线"],
          ["05","AI 工作流","生成、审校、规范化与落地","深度协作"]
        ].map(s=><article className="skill" key={s[0]}><span>{s[0]}</span><div><h3>{s[1]}</h3><p>{s[2]}</p></div><b>{s[3]}</b></article>)}
      </div>
      <div className="proofStrip"><p>证据链</p><span>问题定义</span><i>→</i><span>设计规则</span><i>→</i><span>可运行原型</span><i>→</i><span>复盘与迭代</span></div>
    </section>

    <section className="section docsSection">
      <div className="sectionHead compact"><div><p className="kicker">04 / DOCUMENT ARCHIVE</p><h2>{totalUniqueDocs} 篇工程文档</h2></div><p>精选解读负责呈现判断深度，完整目录保留每个项目真实的设计覆盖面。进入任一项目，即可按分类、标题、章节与关键词浏览。</p></div>
      <div className="archiveMetrics"><div><strong>9</strong><span>文档分类</span></div><div><strong>10</strong><span>项目档案</span></div><div><strong>29</strong><span>深度解读</span></div><div><strong>{totalUniqueDocs}</strong><span>原始文档索引</span></div></div>
      <div className="docList">{featuredDocs.map(([projectId,docIndex],i)=>{const p=projects.find(item=>item.id===projectId)!;const d=docsByProject[projectId][docIndex];return <article key={d.title} onClick={()=>setSelected(p)} tabIndex={0} onKeyDown={e=>{if(e.key==="Enter")setSelected(p)}}>
        <span className="docNo">D{String(i+1).padStart(2,"0")}</span><div><small>{p.name} · {d.type} · {d.status}</small><h3>{d.title}</h3><p>{d.problem}</p></div><span className="read">{d.read}<b>↗</b></span>
      </article>})}</div>
    </section>

    <footer id="other">
      <div><p className="kicker">OPEN TO COLLABORATION</p><h2>一起把下一个<br/><span>好玩的判断</span>做出来。</h2></div>
      <div className="footerRight"><p>游戏策划 / 技术策划 / 独立游戏开发<br/>现居中国 · 可远程协作</p><a href="mailto:portfolio@example.com">portfolio@example.com <Arrow/></a><small>联系方式与简历内容待本人确认</small></div>
      <div className="footerBottom"><span>游戏设计档案 · 2026</span><span>DESIGNED AS A LIVING ARCHIVE</span><a href="#top">回到顶部 ↑</a></div>
    </footer>

    {selected&&<div className="modalBackdrop" role="presentation" onMouseDown={()=>setSelected(null)}>
      <article className="projectModal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={e=>e.stopPropagation()}>
        <button className="close" onClick={()=>setSelected(null)} aria-label="关闭项目详情">×</button>
        <div className="modalHero" style={{"--accent":selected.accent} as React.CSSProperties}>{selected.image?<img src={selected.image} alt={`${selected.name}项目画面`}/>:<div className="modalFallback">{selected.en}</div>}<div><span>{selected.status} · {selected.type}</span><h2 id="modal-title">{selected.name}</h2><p>{selected.pitch}</p></div></div>
        <div className="modalBody">
          <aside><a href="#overview">概览</a><a href="#loop">核心玩法</a><a href="#documents">精选文档</a><a href="#progress">当前进度</a><a href="#ai">AI 参与</a></aside>
          <div>
            <section id="overview"><p className="kicker">PROJECT OVERVIEW</p><h3>先说它为什么值得做</h3><p>{selected.pitch} 当前档案基于工程目录、已有设计文档与项目素材整理；具体开发时间、版本号与公开范围仍标记为待本人确认。</p><dl><div><dt>个人职责</dt><dd>{selected.role}</dd></div><div><dt>引擎 / 标签</dt><dd>{selected.tags.join(" · ")}</dd></div><div><dt>可验证成果</dt><dd>{selected.playable?"工程中发现可运行包体，公开链接整理中":"工程原型与设计文档，媒体继续整理中"}</dd></div></dl></section>
            <section id="loop"><p className="kicker">DESIGN LOOP</p><h3>从选择到反馈的闭环</h3><div className="loop"><span>观察局势</span><i>→</i><span>做出构筑</span><i>→</i><span>进入验证</span><i>→</i><span>带回成长</span></div><p>详情页首版保留统一结构，后续会从原项目文档中继续提炼每个模块的玩家目标、操作、主要决策、即时反馈与失败代价。</p></section>
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
