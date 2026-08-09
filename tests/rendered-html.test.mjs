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
  assert.match(html, /文档档案|ARCHIVE CONSOLE|600/);
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
