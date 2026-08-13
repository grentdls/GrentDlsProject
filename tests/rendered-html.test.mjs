import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio archive", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>[^<]*(游戏|设计|档案)[^<]*<\/title>/i);
  assert.match(html, /游戏设计档案|个人作品集|DESIGN ARCHIVE/i);
  assert.match(html, /doctrineSection/);
  assert.match(html, /FIELD NOTES \/ DESIGN DOCTRINES/);
  assert.match(html, /decisionDesk/);
  assert.match(html, /30-SECOND DECISION/);
  assert.match(html, /PLAYABLE COMBAT STUDY|战斗实验室/);
  assert.match(html, /709|ARCHIVE CONSOLE/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|react-loading-skeleton/i);
  assert.doesNotMatch(html, /codex-preview[\s\S]*development/i);
});

test("keeps the finished site free of the starter skeleton", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /import Portfolio from ["']\.\/portfolio["']/);
  assert.match(page, /<Portfolio\s*\/>/);
  assert.match(layout, /export const metadata:\s*Metadata/);
  assert.match(layout, /favicon\.svg/);
  assert.doesNotMatch(page, /SkeletonPreview|_sites-preview|codex-preview/);
  assert.doesNotMatch(layout, /SkeletonPreview|_sites-preview|codex-preview/);
});

test("wires the fleet formation side quest", async () => {
  const [archiveConsole, fleetFormation] = await Promise.all([
    readFile(new URL("../app/ArchiveConsole.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/FleetFormation.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(archiveConsole, /FleetFormation/);
  assert.match(archiveConsole, /game === "fleet"/);
  assert.match(fleetFormation, /舰队调度台/);
  assert.match(fleetFormation, /aria-live="polite"/);
  assert.match(fleetFormation, /检查路线/);
});

test("wires the ARG, QGDXX2, and original music archive", async () => {
  const [portfolio, musicDock, catalog] = await Promise.all([
    readFile(new URL("../app/portfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/MusicDock.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/data/document-catalog.json", import.meta.url), "utf8"),
  ]);

  assert.match(portfolio, /id:"arg"/);
  assert.match(portfolio, /id:"qgdxx2"/);
  assert.match(portfolio, /迷境 ARG 调查局/);
  assert.match(portfolio, /英雄城：永夜守望/);
  assert.match(musicDock, /xiaobuwuqu\.mp4/);
  assert.match(musicDock, /qishui\.douyin\.com/);
  assert.match(musicDock, /audio\.play\(\)/);
  assert.match(musicDock, /MY AI MUSIC \/ \{tracks\.length\} TRACKS/);
  assert.match(musicDock, /格朗 · 个人 AI 制作/);
  assert.match(musicDock, /preload="none"/);
  assert.match(musicDock, /7666287042533181481\.mp4/);
  assert.match(musicDock, /7666285735685720083\.mp4/);
  assert.match(catalog, /"qgdxx2"/);
  assert.match(catalog, /"arg"/);
});

test("keeps the standalone and web RTS editions separate", async () => {
  const [portfolio, catalog] = await Promise.all([
    readFile(new URL("../app/portfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/data/document-catalog.json", import.meta.url), "utf8"),
  ]);

  assert.match(portfolio, /id:"rts"/);
  assert.match(portfolio, /id:"rtsweb"/);
  assert.match(portfolio, /TestRTS2_pc_20260813\.zip/);
  assert.match(portfolio, /TestRTS2\.apk/);
  assert.match(portfolio, /https:\/\/grentdls\.github\.io\/rts-game\//);
  assert.match(portfolio, /playableCta/);
  assert.match(catalog, /"rtsweb"/);
});
