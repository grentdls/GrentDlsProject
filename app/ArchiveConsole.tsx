"use client";

import { useEffect, useState } from "react";
import SignalRouting from "./SignalRouting";
import FleetFormation from "./FleetFormation";

type ConsoleGame = "signal" | "battle" | "fleet";

const sections = [
  { id: "top", label: "首页", short: "TOP" },
  { id: "lab", label: "实验室", short: "LAB" },
  { id: "doctrines", label: "立场", short: "NOTES" },
  { id: "timeline", label: "时间轴", short: "LOG" },
  { id: "projects", label: "项目", short: "IDX" },
  { id: "skills", label: "能力", short: "MAP" },
  { id: "resume", label: "简历", short: "CV" },
  { id: "other", label: "联系", short: "END" }
];

export default function ArchiveConsole() {
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);
  const [game, setGame] = useState<ConsoleGame>("signal");

  useEffect(() => {
    const targets = sections.map(section => document.getElementById(section.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-35% 0px -52% 0px", threshold: [0, 0.25, 0.6] });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <aside className={`archiveConsole ${open ? "is-open" : ""}`} aria-label="档案控制台">
      <div className="consoleRail">
        <div className="consoleRailTop"><span className="consolePulse" /> <span>ARCHIVE</span></div>
        <nav className="consoleNav" aria-label="快速章节导航">
          {sections.map(section => <a className={active === section.id ? "is-active" : ""} href={`#${section.id}`} key={section.id} onClick={() => { goTo(section.id); }}>{section.short}<span>{section.label}</span></a>)}
        </nav>
        <button className="consolePlay" type="button" onClick={() => { setGame("signal"); setOpen(true); }} aria-expanded={open} aria-controls="console-drawer"><span aria-hidden="true">+</span><b>PLAY</b><small>03</small></button>
      </div>
      {open && <div className="consoleDrawer" id="console-drawer" role="dialog" aria-modal="false" aria-labelledby="console-title">
        <div className="consoleDrawerHeader"><div><span className="consoleDrawerKicker">LIVE ARCHIVE / SIDE QUESTS</span><h2 id="console-title">实验抽屉</h2></div><button className="consoleClose" type="button" onClick={() => setOpen(false)} aria-label="关闭实验抽屉">×</button></div>
        <div className="consoleTabs" role="tablist" aria-label="选择实验">
          <button type="button" role="tab" aria-selected={game === "signal"} onClick={() => setGame("signal")}><span>02</span> 信号路由</button>
          <button type="button" role="tab" aria-selected={game === "battle"} onClick={() => setGame("battle")}><span>01</span> 反制读取</button>
          <button type="button" role="tab" aria-selected={game === "fleet"} onClick={() => setGame("fleet")}><span>03</span> 舰队调度</button>
        </div>
        {game === "signal" ? <SignalRouting /> : game === "battle" ? <div className="consoleBattleLink"><span className="consoleGameIcon">◌</span><p className="consoleDrawerKicker">BATTLELAB / 01</p><h3>先读招，再反制。</h3><p>原有的战斗实验室保留在页面中段。移动准星，观察威胁预兆，在窗口内完成反制。</p><a href="#lab" onClick={() => setOpen(false)}>跳转到战斗实验室 <span aria-hidden="true">↗</span></a></div> : <FleetFormation />}
        <div className="consoleDrawerFooter"><span>ESC 关闭抽屉</span><span>当前章节 / {sections.find(section => section.id === active)?.short}</span></div>
      </div>}
    </aside>
  );
}
