"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type GameStatus = "ready" | "running" | "finished";
type ThreatResult = "pending" | "success" | "miss";
type ThreatKind = "strike" | "beam" | "feint";

type Threat = {
  id: number;
  x: number;
  y: number;
  bornAt: number;
  deadline: number;
  result: ThreatResult;
  resolvedAt: number;
  seed: number;
  kind: ThreatKind;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
};

type GameState = {
  status: GameStatus;
  startedAt: number;
  nextSpawnAt: number;
  lastHudAt: number;
  score: number;
  shield: number;
  streak: number;
  message: string;
  width: number;
  height: number;
  player: { x: number; y: number };
  threats: Threat[];
  particles: Particle[];
  nextThreatId: number;
  reducedMotion: boolean;
};

const DURATION = 30_000;
const MAX_SHIELD = 5;

const THREAT_LABELS: Record<ThreatKind, string> = {
  strike: "直击",
  beam: "束流",
  feint: "假动作"
};

const THREAT_COPY: Record<ThreatKind, string> = {
  strike: "直击信号出现。等金色窗口再反制。",
  beam: "束流信号出现。先横移准星，再读窗口。",
  feint: "假动作出现。不要抢拍，等它锁定。"
};

const THREAT_TIMING: Record<ThreatKind, [number, number]> = {
  strike: [1500, 1900],
  beam: [1250, 1650],
  feint: [1050, 1450]
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const initialGame = (): GameState => ({
  status: "ready",
  startedAt: 0,
  nextSpawnAt: 0,
  lastHudAt: 0,
  score: 0,
  shield: MAX_SHIELD,
  streak: 0,
  message: "系统待命。点击画布或按开始进入实验。",
  width: 0,
  height: 0,
  player: { x: 0, y: 0 },
  threats: [],
  particles: [],
  nextThreatId: 1,
  reducedMotion: false
});

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function getThreatKind(id: number): ThreatKind {
  if (id % 3 === 0) return "feint";
  if (id % 2 === 0) return "beam";
  return "strike";
}

function getClock(game: GameState, now: number) {
  if (game.status === "ready") return 30;
  if (game.status === "finished") return 0;
  return Math.max(0, Math.ceil((DURATION - (now - game.startedAt)) / 1000));
}

function getHud(game: GameState, now: number) {
  return {
    score: game.score,
    shield: game.shield,
    streak: game.streak,
    clock: getClock(game, now),
    message: game.message
  };
}

function resizeCanvas(canvas: HTMLCanvasElement, game: GameState) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width);
  const height = Math.max(300, rect.height);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  game.width = width;
  game.height = height;
  game.player.x = clamp(game.player.x || width / 2, 30, width - 30);
  game.player.y = clamp(game.player.y || height / 2, 50, height - 30);
}

function drawGame(canvas: HTMLCanvasElement, game: GameState, now: number) {
  const context = canvas.getContext("2d");
  if (!context || !game.width || !game.height) return;

  const { width, height } = game;
  const dpr = canvas.width / width;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  context.fillStyle = "#071117";
  context.fillRect(0, 0, width, height);

  const horizon = height * 0.42;
  const atmosphere = context.createLinearGradient(0, 0, 0, height);
  atmosphere.addColorStop(0, "rgba(25, 62, 68, .34)");
  atmosphere.addColorStop(0.54, "rgba(7, 17, 23, .08)");
  atmosphere.addColorStop(1, "rgba(3, 9, 13, .7)");
  context.fillStyle = atmosphere;
  context.fillRect(0, 0, width, height);

  context.save();
  context.strokeStyle = "rgba(92, 200, 194, .11)";
  context.lineWidth = 1;
  const grid = 42;
  for (let x = -grid; x < width + grid; x += grid) {
    context.beginPath();
    context.moveTo(x, horizon);
    context.lineTo(width / 2 + (x - width / 2) * 1.45, height);
    context.stroke();
  }
  for (let y = horizon; y < height + grid; y += grid) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  context.restore();

  context.save();
  context.globalAlpha = 0.55;
  context.strokeStyle = "rgba(230, 170, 75, .24)";
  context.beginPath();
  context.arc(width * 0.78, height * 0.2, Math.min(width, height) * 0.23, Math.PI * 0.1, Math.PI * 1.2);
  context.stroke();
  context.restore();

  for (const threat of game.threats) {
    const lifetime = threat.deadline - threat.bornAt;
    const progress = clamp((now - threat.bornAt) / lifetime, 0, 1);
    const danger = clamp((now - (threat.deadline - 650)) / 650, 0, 1);
    const resolved = threat.result !== "pending";
    const windowOpen = !resolved && now >= threat.deadline - 850;
    const pulse = game.reducedMotion ? 0 : Math.sin(now / 120 + threat.seed) * 2.5;
    const radius = 24 + progress * 56 + pulse;
    const color = threat.result === "success" ? "#78d8af" : threat.result === "miss" ? "#d46d63" : windowOpen ? "#f1d08d" : "#e6aa4b";

    context.save();
    context.translate(threat.x, threat.y);
    context.globalAlpha = resolved ? 0.42 : windowOpen ? 0.92 : 0.7 + danger * 0.25;
    context.strokeStyle = color;
    context.lineWidth = resolved ? 2 : windowOpen ? 2.5 : 1.5 + danger;
    context.setLineDash(resolved ? [] : [5, 7]);
    context.beginPath();
    context.arc(0, 0, radius, -Math.PI / 2, Math.PI * 1.5);
    context.stroke();
    context.setLineDash([]);
    context.globalAlpha = resolved ? 0.8 : 0.95;
    context.fillStyle = color;
    context.beginPath();
    context.arc(0, 0, resolved ? 8 : 5 + danger * 3, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 0.55;
    context.beginPath();
    context.moveTo(-radius - 12, 0);
    context.lineTo(radius + 12, 0);
    context.moveTo(0, -radius - 12);
    context.lineTo(0, radius + 12);
    context.stroke();
    if (threat.kind === "beam") {
      context.save();
      context.rotate(threat.seed);
      context.globalAlpha = resolved ? 0.2 : 0.35 + danger * 0.2;
      context.fillStyle = color;
      context.fillRect(-radius * 1.3, -2, radius * 2.6, 4);
      context.strokeRect(-radius * 1.3, -10, radius * 2.6, 20);
      context.restore();
    }
    if (threat.kind === "feint") {
      context.save();
      context.rotate(Math.PI / 4);
      context.globalAlpha = resolved ? 0.35 : 0.72;
      context.strokeStyle = color;
      context.strokeRect(-radius * 0.62, -radius * 0.62, radius * 1.24, radius * 1.24);
      context.restore();
    }
    if (!resolved && danger > 0) {
      context.globalAlpha = 0.3 + danger * 0.45;
      context.fillStyle = "#d46d63";
      context.beginPath();
      context.arc(0, 0, radius + 10, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = resolved ? 0.45 : 0.78;
    context.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace";
    context.fillStyle = color;
    context.fillText(THREAT_LABELS[threat.kind], -radius, -radius - 12);
    context.restore();
  }

  if (!game.reducedMotion) {
    game.particles = game.particles.filter(particle => particle.life > 0);
    for (const particle of game.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.035;
      context.save();
      context.globalAlpha = Math.max(0, particle.life);
      context.fillStyle = particle.color;
      context.fillRect(particle.x, particle.y, 2, 2);
      context.restore();
    }
  } else {
    game.particles = [];
  }

  const player = game.player;
  context.save();
  context.translate(player.x, player.y);
  context.strokeStyle = "#5cc8c2";
  context.fillStyle = "rgba(92, 200, 194, .13)";
  context.lineWidth = 1.5;
  context.beginPath();
  context.arc(0, 0, 16, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.beginPath();
  context.moveTo(-25, 0);
  context.lineTo(-8, 0);
  context.moveTo(8, 0);
  context.lineTo(25, 0);
  context.moveTo(0, -25);
  context.lineTo(0, -8);
  context.moveTo(0, 8);
  context.lineTo(0, 25);
  context.stroke();
  context.fillStyle = "#e6aa4b";
  context.beginPath();
  context.arc(0, 0, 3, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  context.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
  context.letterSpacing = "1.5px";
  context.fillStyle = "rgba(241, 235, 223, .55)";
  context.fillText("THREAT TELEMETRY", 18, 25);
  context.fillStyle = "rgba(92, 200, 194, .65)";
  context.fillText("MOVE  /  READ  /  COUNTER", 18, height - 18);
  context.restore();
}

export default function BattleLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>(initialGame());
  const [status, setStatus] = useState<GameStatus>("ready");
  const [hud, setHud] = useState(() => getHud(initialGame(), 0));

  const finishGame = useCallback((message: string) => {
    const game = gameRef.current;
    game.status = "finished";
    game.message = message;
    setStatus("finished");
    setHud(getHud(game, performance.now()));
  }, []);

  const counter = useCallback(() => {
    const game = gameRef.current;
    if (game.status !== "running") return;

    const now = performance.now();
    const nearest = game.threats
      .filter(threat => threat.result === "pending")
      .map(threat => ({ threat, distance: Math.hypot(threat.x - game.player.x, threat.y - game.player.y) }))
      .sort((a, b) => a.distance - b.distance)[0];

    if (!nearest || nearest.distance > 96) {
      game.message = "准星离威胁太远。先移动到金色读条附近。";
      return;
    }

    const remaining = nearest.threat.deadline - now;
    if (remaining > 850) {
      game.message = "还早。等待前摇进入反制窗口。";
      return;
    }
    if (remaining <= 0) {
      game.message = "已经错过窗口。下一次提前半拍。";
      return;
    }

    nearest.threat.result = "success";
    nearest.threat.resolvedAt = now;
    const perfect = remaining < 360;
    game.streak += 1;
    game.score += (perfect ? 140 : 90) + Math.min(160, game.streak * 12);
    game.message = perfect ? `完美反制。连击 ${game.streak}` : `反制成功。连击 ${game.streak}`;
    if (!game.reducedMotion) {
      for (let i = 0; i < 18; i += 1) {
        const angle = (Math.PI * 2 * i) / 18;
        game.particles.push({
          x: nearest.threat.x,
          y: nearest.threat.y,
          vx: Math.cos(angle) * randomBetween(0.8, 2.6),
          vy: Math.sin(angle) * randomBetween(0.8, 2.6),
          life: 1,
          color: perfect ? "#e6aa4b" : "#78d8af"
        });
      }
    }
  }, []);

  const startGame = useCallback(() => {
    const game = gameRef.current;
    const now = performance.now();
    game.status = "running";
    game.startedAt = now;
    game.nextSpawnAt = now + 450;
    game.lastHudAt = now;
    game.score = 0;
    game.shield = MAX_SHIELD;
    game.streak = 0;
    game.message = "威胁出现后，移动准星并在窗口内反制。";
    game.threats = [];
    game.particles = [];
    game.nextThreatId = 1;
    setStatus("running");
    setHud(getHud(game, now));
    canvasRef.current?.focus();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = gameRef.current;
    let frame = 0;

    const resize = () => resizeCanvas(canvas, game);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const movePlayer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      game.player.x = clamp(clientX - rect.left, 30, game.width - 30);
      game.player.y = clamp(clientY - rect.top, 50, game.height - 30);
    };
    const onPointerMove = (event: PointerEvent) => movePlayer(event.clientX, event.clientY);
    const onPointerDown = (event: PointerEvent) => {
      movePlayer(event.clientX, event.clientY);
      counter();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (game.status !== "running") return;
      const step = event.shiftKey ? 32 : 18;
      if (["ArrowUp", "w", "W"].includes(event.key)) game.player.y -= step;
      if (["ArrowDown", "s", "S"].includes(event.key)) game.player.y += step;
      if (["ArrowLeft", "a", "A"].includes(event.key)) game.player.x -= step;
      if (["ArrowRight", "d", "D"].includes(event.key)) game.player.x += step;
      game.player.x = clamp(game.player.x, 30, game.width - 30);
      game.player.y = clamp(game.player.y, 50, game.height - 30);
      if ([" ", "Enter", "q", "Q"].includes(event.key)) {
        event.preventDefault();
        counter();
      }
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    const tick = (now: number) => {
      resize();
      if (game.status === "running") {
        if (now >= game.nextSpawnAt) {
          const kind = getThreatKind(game.nextThreatId);
          const [minTiming, maxTiming] = THREAT_TIMING[kind];
          const firstThreat = game.nextThreatId === 1;
          game.threats.push({
            id: game.nextThreatId++,
            x: firstThreat ? game.player.x : randomBetween(72, Math.max(72, game.width - 72)),
            y: firstThreat ? game.player.y : randomBetween(95, Math.max(95, game.height - 58)),
            bornAt: now,
            deadline: now + randomBetween(minTiming, maxTiming),
            result: "pending",
            resolvedAt: 0,
            seed: Math.random() * Math.PI * 2,
            kind
          });
          game.message = THREAT_COPY[kind];
          game.nextSpawnAt = now + randomBetween(900, 1450);
        }

        for (const threat of game.threats) {
          if (threat.result === "pending" && now >= threat.deadline) {
            threat.result = "miss";
            threat.resolvedAt = now;
            game.shield -= 1;
            game.streak = 0;
            game.message = game.shield > 0 ? "命中。读条结束前要更果断。" : "护盾归零。复盘一次，再来一轮。";
            if (game.shield <= 0) finishGame("护盾归零。再试一次，把反制点提前一点。");
          }
        }
        game.threats = game.threats.filter(threat => now - (threat.result === "pending" ? threat.bornAt : threat.resolvedAt) < 1600);
        if (now - game.startedAt >= DURATION && game.status === "running") finishGame("实验完成。看看你能否把连击再推进一层。");
        if (now - game.lastHudAt > 90) {
          game.lastHudAt = now;
          setHud(getHud(game, now));
        }
      }

      drawGame(canvas, game, now);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [counter, finishGame]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      gameRef.current.reducedMotion = media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div className="battleLab" data-status={status}>
      <div className="battleLabPlayfield">
        <div className="battleLabHud" aria-label="战斗实验室状态">
          <div><span>护盾</span><strong>{"●".repeat(hud.shield)}{"○".repeat(MAX_SHIELD - hud.shield)}</strong></div>
          <div><span>得分</span><strong>{String(hud.score).padStart(4, "0")}</strong></div>
          <div><span>时间</span><strong>00:{String(hud.clock).padStart(2, "0")}</strong></div>
          <div><span>连击</span><strong>{String(hud.streak).padStart(2, "0")}</strong></div>
        </div>
        <canvas
          ref={canvasRef}
          className="battleLabCanvas"
          role="application"
          tabIndex={0}
          aria-label="战斗读招实验室。移动准星靠近威胁，在反制窗口内点击或按空格。"
        />
        <div className="battleLabReticleNote">移动准星接近威胁，金色窗口出现时反制</div>
      </div>
      <aside className="battleLabControls">
        <div>
          <span className="battleLabLabel">PLAYABLE COMBAT STUDY</span>
          <h3>{status === "running" ? "读招进行中" : status === "finished" ? "实验结束" : "准备读招"}</h3>
          <p className="battleLabStatus" aria-live="polite">{hud.message}</p>
          <div className="battleLabLegend" aria-label="威胁类型图例">
            <span><i className="legendStrike" />直击</span>
            <span><i className="legendBeam" />束流</span>
            <span><i className="legendFeint" />假动作</span>
          </div>
        </div>
        <button className="battleLabCounter" type="button" onClick={counter} disabled={status !== "running"}>
          反制 <span>Q / SPACE</span>
        </button>
        <button className="battleLabStart" type="button" onClick={startGame}>
          {status === "running" ? "重新开始" : status === "finished" ? "再来一轮" : "开始实验"}
        </button>
        <p className="battleLabHelp">鼠标或触摸移动准星。键盘可用 WASD / 方向键移动，Q、Enter 或空格反制。</p>
      </aside>
    </div>
  );
}
