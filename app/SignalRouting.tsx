"use client";

import { useEffect, useState } from "react";

type GameStatus = "ready" | "running" | "won" | "finished";
type Tile = { mask: number; target: number };

const ROWS = 3;
const COLS = 4;
const DURATION = 24;
const NORTH = 1;
const EAST = 2;
const SOUTH = 4;
const WEST = 8;
const DIRECTIONS = [
  { bit: NORTH, row: -1, col: 0, opposite: SOUTH },
  { bit: EAST, row: 0, col: 1, opposite: WEST },
  { bit: SOUTH, row: 1, col: 0, opposite: NORTH },
  { bit: WEST, row: 0, col: -1, opposite: EAST }
];

// The route bends through the grid once, leaving the decoy nodes to read.
const TARGET_MASKS = [
  [SOUTH | NORTH, SOUTH | EAST, WEST | SOUTH, SOUTH | NORTH],
  [WEST | EAST, WEST | NORTH, NORTH | EAST, WEST | SOUTH],
  [NORTH | SOUTH, WEST | EAST, WEST | EAST, NORTH | EAST]
];

const rotateMask = (mask: number) => {
  let rotated = 0;
  if (mask & NORTH) rotated |= EAST;
  if (mask & EAST) rotated |= SOUTH;
  if (mask & SOUTH) rotated |= WEST;
  if (mask & WEST) rotated |= NORTH;
  return rotated;
};

const makePuzzle = (): Tile[] => TARGET_MASKS.flat().map(target => {
  const turns = 1 + Math.floor(Math.random() * 3);
  let mask = target;
  for (let i = 0; i < turns; i += 1) mask = rotateMask(mask);
  return { target, mask };
});

const isSolved = (tiles: Tile[]) => {
  const start = (ROWS - 2) * COLS;
  const end = (ROWS - 1) * COLS + (COLS - 1);
  const startTile = tiles[start];
  const endTile = tiles[end];
  if (!(startTile.mask & WEST) || !(endTile.mask & EAST)) return false;

  const queue = [start];
  const visited = new Set([start]);
  while (queue.length) {
    const current = queue.shift()!;
    const row = Math.floor(current / COLS);
    const col = current % COLS;
    for (const direction of DIRECTIONS) {
      if (!(tiles[current].mask & direction.bit)) continue;
      const nextRow = row + direction.row;
      const nextCol = col + direction.col;
      if (nextRow < 0 || nextRow >= ROWS || nextCol < 0 || nextCol >= COLS) continue;
      const next = nextRow * COLS + nextCol;
      if (!(tiles[next].mask & direction.opposite) || visited.has(next)) continue;
      if (next === end) return true;
      visited.add(next);
      queue.push(next);
    }
  }
  return start === end;
};

const segments = [
  [NORTH, "north"],
  [EAST, "east"],
  [SOUTH, "south"],
  [WEST, "west"]
] as const;

export default function SignalRouting() {
  const [status, setStatus] = useState<GameStatus>("ready");
  const [tiles, setTiles] = useState<Tile[]>(() => makePuzzle());
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [endsAt, setEndsAt] = useState(0);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("让信号从左侧入口穿过节点，最后从右下角出口离开。");

  const startGame = () => {
    setTiles(makePuzzle());
    setTimeLeft(DURATION);
    setEndsAt(Date.now() + DURATION * 1000);
    setMoves(0);
    setMessage("先找出连续路径，再用最少的旋转完成闭环。");
    setStatus("running");
  };

  const rotateTile = (index: number) => {
    if (status !== "running") return;
    const nextTiles = tiles.map((tile, tileIndex) => tileIndex === index ? { ...tile, mask: rotateMask(tile.mask) } : tile);
    const nextMoves = moves + 1;
    setTiles(nextTiles);
    setMoves(nextMoves);
    if (isSolved(nextTiles)) {
      setStatus("won");
      setMessage(`信号已闭环。${nextMoves} 次旋转完成路由。`);
    } else {
      setMessage("节点已旋转。继续读取相邻接口，避免把分支接到错误方向。");
    }
  };

  useEffect(() => {
    if (status !== "running" || !endsAt) return;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        setStatus("finished");
        setMessage("链路超时。保留当前读数，再试一次。");
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [endsAt, status]);

  const statusTitle = status === "won" ? "链路已建立" : status === "finished" ? "信号丢失" : status === "running" ? "读取节点" : "准备路由";
  const statusHint = status === "ready" ? "点击开始，网格会生成一组新的节点方向。" : status === "running" ? "点击节点顺时针旋转，也可以聚焦后按 Enter。" : "按重新开始生成新的路径。";

  return (
    <section className="signalRouting" data-status={status} aria-label="信号路由小游戏">
      <div className="signalHeader">
        <div>
          <span className="signalLabel">SIGNAL ROUTING / 02</span>
          <h3>{statusTitle}</h3>
        </div>
        <div className="signalClock" aria-label={`剩余 ${timeLeft} 秒`}><strong>{String(timeLeft).padStart(2, "0")}</strong><span>SEC</span></div>
      </div>
      <p className="signalMessage" aria-live="polite">{message}</p>
      <div className={`signalBoard ${status === "won" ? "is-solved" : ""}`} role="grid" aria-label="三行四列的信号节点网格">
        <span className="signalEndpoint signalInput">IN</span>
        {tiles.map((tile, index) => (
          <button
            className="signalTile"
            key={`${index}-${tile.target}`}
            type="button"
            role="gridcell"
            disabled={status !== "running"}
            aria-label={`第 ${Math.floor(index / COLS) + 1} 行第 ${(index % COLS) + 1} 列节点，旋转接口`}
            onClick={() => rotateTile(index)}
            onKeyDown={event => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                rotateTile(index);
              }
            }}
          >
            <span className="signalTileInner">
              {segments.map(([bit, name]) => tile.mask & bit ? <i className={`signalPipe pipe-${name}`} key={name} /> : null)}
              <b className="signalNode" />
            </span>
          </button>
        ))}
        <span className="signalEndpoint signalOutput">OUT</span>
      </div>
      <div className="signalFooter">
        <span>{statusHint}</span>
        <span className="signalMoves">MOVES {String(moves).padStart(2, "0")}</span>
      </div>
      <button className="signalStart" type="button" onClick={startGame}>{status === "ready" ? "开始路由" : "重新开始"}<span aria-hidden="true">↗</span></button>
    </section>
  );
}
