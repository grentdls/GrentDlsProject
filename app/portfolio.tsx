"use client";

import { useMemo, useState } from "react";

type Project = {
  id: string; name: string; en: string; pitch: string; status: string; type: string;
  role: string; tags: string[]; image?: string; accent: string; playable?: boolean; team?: boolean;
};

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

const docs = [
  ["英雄战斗表现与逻辑落地","吞吞舰船","把 60 名英雄的描述转为可制作、可配置、可测试的战斗规则。","已落地","18 min"],
  ["桌面挂机成长体验总规划","星空掠夺者","拆解前 5 分钟至长期挂机的目标、解锁与重复性风险。","验证中","14 min"],
  ["UI 与积木搭建完整方案","积木飞船幸存者","定义拖动、预览、吸附、判定和错误反馈的完整交互链。","已落地","12 min"],
  ["ARPG 工程架构与核心模块","荒野旅团 ARPG","把 3C、战斗、AI、UI 与数据边界组织成可扩展骨架。","验证中","16 min"]
];

const filters = ["全部","独立游戏","玩法原型","系统研究","技术原型","团队项目"];

function Arrow(){ return <span aria-hidden="true">↗</span> }

export default function Portfolio(){
  const [filter,setFilter]=useState("全部");
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState<Project|null>(null);
  const shown=useMemo(()=>projects.filter(p=>(filter==="全部"||p.type===filter)&&(p.name+p.en+p.pitch+p.tags.join("")).toLowerCase().includes(query.toLowerCase())),[filter,query]);
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
        <div><strong>10</strong><span>项目 / 原型</span></div><div><strong>6</strong><span>可运行成果</span></div><div><strong>100+</strong><span>设计文档</span></div>
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
          <div className="cardBody"><div className="cardTop"><span>{String(i+1).padStart(2,"0")}</span><em>{p.status}</em></div><h3>{p.name}</h3><p>{p.pitch}</p><small>{p.role}</small><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div>
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
      <div className="sectionHead compact"><div><p className="kicker">04 / SELECTED DOCUMENTS</p><h2>关键设计文档</h2></div><p>文档不是附件仓库，而是经过筛选的设计证据：先看结论，再按需深入。</p></div>
      <div className="docList">{docs.map((d,i)=><article key={d[0]}><span className="docNo">D{String(i+1).padStart(2,"0")}</span><div><small>{d[1]} · {d[3]}</small><h3>{d[0]}</h3><p>{d[2]}</p></div><span className="read">{d[4]}<b>↗</b></span></article>)}</div>
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
          <aside><a href="#overview">概览</a><a href="#loop">核心玩法</a><a href="#progress">当前进度</a><a href="#ai">AI 参与</a></aside>
          <div>
            <section id="overview"><p className="kicker">PROJECT OVERVIEW</p><h3>先说它为什么值得做</h3><p>{selected.pitch} 当前档案基于工程目录、已有设计文档与项目素材整理；具体开发时间、版本号与公开范围仍标记为待本人确认。</p><dl><div><dt>个人职责</dt><dd>{selected.role}</dd></div><div><dt>引擎 / 标签</dt><dd>{selected.tags.join(" · ")}</dd></div><div><dt>可验证成果</dt><dd>{selected.playable?"工程中发现可运行包体，公开链接整理中":"工程原型与设计文档，媒体继续整理中"}</dd></div></dl></section>
            <section id="loop"><p className="kicker">DESIGN LOOP</p><h3>从选择到反馈的闭环</h3><div className="loop"><span>观察局势</span><i>→</i><span>做出构筑</span><i>→</i><span>进入验证</span><i>→</i><span>带回成长</span></div><p>详情页首版保留统一结构，后续会从原项目文档中继续提炼每个模块的玩家目标、操作、主要决策、即时反馈与失败代价。</p></section>
            <section id="progress"><p className="kicker">PROGRESS</p><h3>公开进度，不伪造百分比</h3><div className="progressRows"><span>核心循环 <b>可运行 / 验证中</b></span><span>内容与数值 <b>持续扩充</b></span><span>媒体与包体 <b>公开范围待确认</b></span></div></section>
            <section id="ai"><p className="kicker">AI DISCLOSURE</p><h3>AI 是协作层，不是判断者</h3><p>现有工程中包含 AI 辅助产出的文档与视觉素材。网站会明确区分概念图、生成图、实机与编辑器画面；需求取舍、规则审校、工程接入与最终判断由本人完成。各项目具体参与比例待确认。</p></section>
          </div>
        </div>
      </article>
    </div>}
  </main>
}
