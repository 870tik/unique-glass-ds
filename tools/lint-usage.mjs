#!/usr/bin/env node
/* lint-usage.mjs — docs/08-usage-rules.md の機械検査。依存ゼロ。
   usage: node tools/lint-usage.mjs   （違反ありなら exit 1） */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const report = (file, line, rule, text) =>
  problems.push(`${file}:${line}  [${rule}] ${text.trim().slice(0, 90)}`);

/* ---------- 1. コア CSS ---------- */
const coreFile = 'css/liquid-glass.css';
const core = readFileSync(join(root, coreFile), 'utf8').split('\n');
let inMedia = false;
core.forEach((l, i) => {
  const n = i + 1;
  if (l.includes('lint: structural')) return;
  if (/@media/.test(l)) return; /* breakpoint リテラル例外（A2-2） */
  /* 生色（hex / rgb）。color-mix の中も var 参照のみ許可 */
  const noVar = l.replace(/var\(--[^)]*\)/g, '');
  if (/#[0-9a-fA-F]{3,8}\b/.test(noVar) || /rgba?\(/.test(noVar)) {
    report(coreFile, n, 'raw-color', l);
  }
  /* 直値 px/em（var/calc 内は除去してから判定） */
  const stripped = l
    .replace(/var\(--[^)]*\)/g, '')
    .replace(/calc\([^)]*\)/g, '');
  const m = stripped.match(/:\s*[^;]*\b\d+(\.\d+)?(px|em)\b/);
  if (m && !/^\s*\/\*/.test(l)) {
    report(coreFile, n, 'raw-size', l);
  }
});

/* ---------- 2. ショーケース HTML ---------- */
const showcaseDir = join(root, 'showcase');
const coreCss = readFileSync(join(root, coreFile), 'utf8');
const coreClasses = new Set(
  [...coreCss.matchAll(/\.(lg-[a-z0-9-]+)/g)].map((m) => m[1])
);
for (const f of readdirSync(showcaseDir).filter((f) => f.endsWith('.html'))) {
  const rel = 'showcase/' + f;
  const html = readFileSync(join(showcaseDir, f), 'utf8');
  const lines = html.split('\n');
  let inScaffold = false;
  lines.forEach((l, i) => {
    const n = i + 1;
    /* 直値を含む inline style（A3） */
    for (const m of l.matchAll(/style="([^"]*)"/g)) {
      const st = m[1];
      if (/\d(px|em)/.test(st) && !/var\(/.test(st.replace(/\d+(px|em)/g, ''))) {
        if (/\d(px|em)/.test(st.replace(/var\(--[^)]*\)/g, ''))) {
          report(rel, n, 'inline-raw', st);
        }
      }
    }
    /* ページによる .lg-* の新規定義（B1）。プロパティ上書きは許容し、
       コアに存在しないクラスの定義だけを検出する */
    const def = l.match(/^\s*\.?(lg-[a-z0-9-]+)[^{]*\{/);
    if (def && l.trim().startsWith('.')) {
      const first = l.trim().match(/^\.(lg-[a-z0-9-]+)/);
      if (first && !coreClasses.has(first[1])) {
        report(rel, n, 'page-defines-lg', l);
      }
    }
  });
  /* scaffolding 節の存在チェック（data-sc を使うなら宣言必須） */
  if (html.includes('data-sc=') && !html.includes('demo scaffolding')) {
    report(rel, 0, 'scaffold-unmarked', 'data-sc 使用時は demo scaffolding 節が必要');
  }
}

/* ---------- 3. 部品フォルダの usage.md 必須（A5.5: 部品は五面セット） ---------- */
for (const level of ['atoms', 'molecules', 'organisms', 'templates']) {
  const dir = join(root, 'src', level);
  if (!existsSync(dir)) continue;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    if (!existsSync(join(dir, e.name, 'usage.md'))) {
      report(`src/${level}/${e.name}/`, 0, 'missing-usage', 'usage.md（使用用途）がない');
    }
  }
}

/* ---------- 結果 ---------- */
if (problems.length) {
  console.log(`✗ ${problems.length} 件の違反:`);
  problems.forEach((p) => console.log('  ' + p));
  process.exit(1);
} else {
  console.log('✓ lint-usage: 違反なし（docs/08 準拠）');
}
