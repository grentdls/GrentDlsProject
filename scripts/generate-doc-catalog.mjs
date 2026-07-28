import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, sep } from "node:path";

const projectSources = [
  { id: "tuntun", roots: ["G:/TestProject/TunTunJianChuan/Docs"] },
  { id: "wcdel", roots: ["G:/TestProject/WCDEL/Docs"] },
  { id: "star", roots: ["G:/TestProject/zhuomian/Docs"] },
  { id: "rts", roots: ["G:/TestProject/TestRTS2/Docs", "G:/TestProject/HttpRTSCS/Docs"] },
  { id: "arpg", roots: ["G:/TestProject/RPG/Docs"] },
  { id: "one", roots: ["G:/TestProject/One/Docs"] },
  { id: "castle", roots: ["G:/TestProject/HSJT/Docs"] },
  { id: "brick", roots: ["G:/TestProject/3Dxingcunzhe/Docs"] },
  { id: "haste", files: ["G:/Haste/CI/Readme.md", "G:/Haste/auto_excel_opt/readMe.md"] },
];

const ignoreNames = new Set(["AGENTS.md", "CHANGELOG.md", "LICENSE.md"]);

function walk(dir) {
  const result = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md") && !ignoreNames.has(entry.name)) result.push(full);
  }
  return result;
}

function clean(text) {
  return text
    .replace(/[`*_~]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function categoryFor(value) {
  const s = value.toLowerCase();
  if (/ui|ux|界面|布局|hud|菜单|交互|prefab/.test(s)) return "UI / UX";
  if (/美术|art|视觉|图标|模型|sprite|动画|vfx|特效|镜头|表现/.test(s)) return "表现与美术";
  if (/音频|音乐|audio|bgm|sfx|voice/.test(s)) return "音频";
  if (/数值|经济|掉落|成长|天赋|技能|装备|build|职业|科技树|数据表/.test(s)) return "系统与数值";
  if (/敌人|boss|战斗|combat|伤害|攻击|弹幕|受击/.test(s)) return "战斗设计";
  if (/架构|architecture|代码|coding|工具|editor|配置|实现|runtime|性能|pipeline|workflow|ci/.test(s)) return "技术策划";
  if (/关卡|地图|章节|任务|剧情|故事|副本|事件|世界/.test(s)) return "关卡与叙事";
  if (/玩法|gdd|总纲|overview|核心|循环|定位|设计文档/.test(s)) return "核心策划";
  if (/复盘|日志|task_log|记录|audit|report/.test(s)) return "开发记录";
  return "制作规范";
}

function parseDoc(file, root, projectId) {
  const raw = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/);
  const relativePath = relative(root, file).split(sep).join("/");
  const h1 = lines.find((line) => /^#\s+/.test(line));
  const title = clean(h1?.replace(/^#\s+/, "") || basename(file, ".md"));
  const headings = lines
    .filter((line) => /^#{2,3}\s+/.test(line))
    .map((line) => clean(line.replace(/^#{2,3}\s+/, "")))
    .filter((line) => line && !/^(目录|table of contents)$/i.test(line))
    .slice(0, 9);
  const quotes = lines
    .filter((line) => /^>\s*\S/.test(line))
    .map((line) => clean(line.replace(/^>\s*/, "")))
    .filter((line) => line.length >= 8 && line.length <= 240)
    .slice(0, 3);
  const bullets = lines
    .filter((line) => /^\s*[-*]\s+\S/.test(line))
    .map((line) => clean(line.replace(/^\s*[-*]\s+/, "")))
    .filter((line) => line.length >= 6 && line.length <= 180)
    .slice(0, 5);
  const paragraphs = lines
    .map(clean)
    .filter((line) => line.length >= 18 && line.length <= 220 && !/^(#|\||```|[-*]\s)/.test(line))
    .slice(0, 3);
  const summary = quotes[0] || paragraphs[0] || `围绕“${title}”整理的项目制作文档。`;
  const groupParts = relativePath.split("/");
  const group = groupParts.length > 1 ? groupParts[0].replace(/_/g, " ") : "项目根目录";
  const charCount = raw.replace(/\s/g, "").length;
  const modifiedAt = statSync(file).mtime.toISOString().slice(0, 10);
  return {
    id: `${projectId}-${Buffer.from(relativePath).toString("base64url").slice(0, 24)}`,
    projectId,
    title,
    category: categoryFor(`${title} ${relativePath} ${headings.join(" ")}`),
    group,
    summary,
    keyPoints: bullets.length ? bullets : headings.slice(0, 5),
    sections: headings,
    sourceFile: basename(file),
    modifiedAt,
    readMinutes: Math.max(2, Math.min(40, Math.ceil(charCount / 500))),
    charCount,
  };
}

const catalog = {};
for (const source of projectSources) {
  const seen = new Set();
  const entries = [];
  if (source.roots) {
    for (const root of source.roots) {
      for (const file of walk(root)) {
        const doc = parseDoc(file, root, source.id);
        const dedupeKey = doc.title.replace(/\s+/g, "").toLowerCase();
        if (!seen.has(dedupeKey)) {
          seen.add(dedupeKey);
          entries.push(doc);
        }
      }
    }
  } else {
    for (const file of source.files) entries.push(parseDoc(file, dirname(file), source.id));
  }
  entries.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt) || a.category.localeCompare(b.category) || a.title.localeCompare(b.title, "zh-CN"));
  catalog[source.id] = entries;
}

catalog.oneproto = catalog.one.filter((doc) =>
  /造物主|反幸存者|ai控制|ai 控制|ai弹幕|ai 弹幕|节奏/i.test(`${doc.title} ${doc.sourceFile}`)
);

const totals = Object.fromEntries(Object.entries(catalog).map(([id, docs]) => [id, docs.length]));
mkdirSync(new URL("../public/data/", import.meta.url), { recursive: true });
writeFileSync(
  new URL("../public/data/document-catalog.json", import.meta.url),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), totals, catalog }, null, 2)}\n`,
  "utf8",
);
writeFileSync(new URL("../app/document-counts.json", import.meta.url), `${JSON.stringify(totals, null, 2)}\n`, "utf8");
console.log(JSON.stringify(totals, null, 2));
