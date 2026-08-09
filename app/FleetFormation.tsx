"use client";


import { useMemo, useState } from "react";

type FleetModule = {
  id: string;
  name: string;
  short: string;
  role: string;
  accent: string;
};

type FleetMission = {
  code: string;
  title: string;
  brief: string;
  hint: string;
  target: string[];
  reward: string;
};

const modules: FleetModule[] = [
  { id: "scout", name: "侦察艇", short: "SCAN", role: "先读风险", accent: "#5cc8c2" },
  { id: "shield", name: "护盾舰", short: "GUARD", role: "承接压力", accent: "#e6aa4b" },
  { id: "cannon", name: "火力舰", short: "BURST", role: "制造窗口", accent: "#d46d63" },
  { id: "support", name: "支援舰", short: "LINK", role: "保持循环", accent: "#8d84d7" }
];

const missions: FleetMission[] = [
  {
    code: "ROUTE 01 / STORM",
    title: "穿过风暴带",
    brief: "前方会连续出现预警信号。先看清危险，再决定什么时候把火力交出去。",
    hint: "顺序要让信息先到达玩家，再让压力有地方落下。",
    target: ["scout", "shield", "cannon"],
    reward: "读招优先"
  },
  {
    code: "ROUTE 02 / LONG RUN",
    title: "护送补给线",
    brief: "任务不是瞬间爆发，而是让编队在一轮又一轮事件后还能继续工作。",
    hint: "长期循环需要一个稳定的中段，而不是三个输出按钮。",
    target: ["scout", "support", "shield"],
    reward: "循环优先"
  },
  {
    code: "ROUTE 03 / BREAKTHROUGH",
    title: "突破拦截网",
    brief: "敌方只给出很短的破绽。你需要把预警、承伤和爆发压进同一条路线。",
    hint: "系统的复杂度应该集中在一次可观察的决策上。",
    target: ["shield", "scout", "cannon"],
    reward: "窗口优先"
  }
];

const slotNames = ["前位 / READ", "中位 / HOLD", "后位 / BURST"];

function FleetFormation() {
  const [started, setStarted] = useState(false);
  const [missionIndex, setMissionIndex] = useState(0);
  const [slots, setSlots] = useState<Array<string | null>>([null, null, null]);
  const [selected, setSelected] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("先选一个模块，再点一个编队位置。");

  const mission = missions[missionIndex];
  const placed = useMemo(() => slots.filter(Boolean).length, [slots]);
  const isCorrect = resolved && slots.every((moduleId, index) => moduleId === mission.target[index]);

  const start = () => {
    setStarted(true);
    setMissionIndex(0);
    setSlots([null, null, null]);
    setSelected(null);
    setResolved(false);
    setCompleted(false);
    setScore(0);
    setFeedback("先选一个模块，再点一个编队位置。");
  };

  const placeSelected = (slotIndex: number) => {
    if (!started || resolved || !selected) return;
    setSlots(previous => {
      const next = [...previous];
      const previousIndex = next.indexOf(selected);
      const replaced = next[slotIndex];
      if (previousIndex >= 0) next[previousIndex] = replaced;
      next[slotIndex] = selected;
      return next;
    });
    setSelected(null);
    setFeedback("位置已更新。还可以继续调整，直到路线读起来顺。");
  };

  const checkFormation = () => {
    if (placed !== 3 || resolved) return;
    const success = slots.every((moduleId, index) => moduleId === mission.target[index]);
    setResolved(true);
    if (success) {
      setScore(previous => previous + 100);
      setFeedback(`路线稳定：${mission.reward}。这套编队把“先观察、再承压、最后爆发”写进了操作顺序。`);
    } else {
      setFeedback(`路线失衡：${mission.hint}`);
    }
  };

  const nextMission = () => {
    if (missionIndex >= missions.length - 1) {
      setCompleted(true);
      setFeedback("三条路线都已复盘。你刚刚做的不是配对题，而是在决定信息、压力和奖励先后出现的顺序。");
      return;
    }
    setMissionIndex(previous => previous + 1);
    setSlots([null, null, null]);
    setSelected(null);
    setResolved(false);
    setFeedback("新路线已载入。先读任务，再排阵。");
  };

  return <div className="fleetFormation" data-state={!started ? "idle" : completed ? "complete" : resolved ? "resolved" : "running"}>
    <div className="fleetHeader">
      <div><span className="fleetKicker">SIDE QUEST / FLEET FORMATION</span><h3>舰队调度台</h3><p>用三艘船排出一条能被读懂、能被执行、也能被复盘的路线。</p></div>
      <div className="fleetScore"><span>SCORE</span><strong>{String(score).padStart(3, "0")}</strong></div>
    </div>

    {!started ? <div className="fleetIntro"><div className="fleetSignal" aria-hidden="true"><span>01</span><i /><b>03</b></div><div><p>每一关只改变一个优先级：读招、循环或窗口。你的任务是把模块放进合适的位置。</p><button type="button" className="fleetStart" onClick={start}>开始调度 <span aria-hidden="true">↗</span></button></div></div> : <>
      <div className="fleetMission"><span>{mission.code}</span><strong>{mission.title}</strong><p>{mission.brief}</p></div>
      <div className="fleetModules" role="group" aria-label="选择舰队模块">
        {modules.map(module => <button type="button" key={module.id} className={selected === module.id ? "is-selected" : ""} aria-pressed={selected === module.id} disabled={resolved} onClick={() => { setSelected(current => current === module.id ? null : module.id); setFeedback(`已选择${module.name}。现在把它放进一个位置。`); }}><i style={{ "--module-accent": module.accent } as React.CSSProperties}>{module.short}</i><span><b>{module.name}</b><small>{module.role}</small></span></button>)}
      </div>
      <div className="fleetSlots" role="group" aria-label="编队位置">
        {slots.map((moduleId, index) => { const fleetModule = modules.find(item => item.id === moduleId); return <button type="button" key={slotNames[index]} className={`fleetSlot ${fleetModule ? "is-filled" : ""}`} disabled={!selected || resolved} onClick={() => placeSelected(index)}><span>{slotNames[index]}</span>{fleetModule ? <strong style={{ "--module-accent": fleetModule.accent } as React.CSSProperties}>{fleetModule.name}</strong> : <b>点击放置</b>}</button>; })}
      </div>
      <div className="fleetFeedback" aria-live="polite"><span>{resolved ? isCorrect ? "ROUTE STABLE" : "ROUTE REVIEW" : `${placed} / 3 MODULES PLACED`}</span><p>{feedback}</p></div>
      <div className="fleetActions">{!resolved ? <button type="button" className="fleetCheck" disabled={placed !== 3} onClick={checkFormation}>检查路线 <span aria-hidden="true">↗</span></button> : <button type="button" className="fleetCheck" onClick={nextMission}>{completed ? "再来一轮" : "下一条路线"} <span aria-hidden="true">↗</span></button>}<small>键盘：Tab 选择 · Enter 放置 / 检查</small></div>
    </>}
  </div>;
}

export default FleetFormation;
