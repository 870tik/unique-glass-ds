#!/usr/bin/env node
/* export-site.mjs — taikihanaoka.com（/Users/tai/tai）への標本室デプロイ。
   showcase/*.html をフラット化（../css → css/ 等に書き換え）し、
   ランタイム（css/ js/ assets/）ごと lab/liquid-glass/ へコピーする。
   docs・tools・src は納品物に含めない（標本室はランタイム + ページのみ）。
   反映の流れ: これを実行 → サイト側で node build-pages.mjs → dist/ をアップロード。
   usage: node tools/export-site.mjs [dest] */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
/* 配信先: taikihanaoka.com の単一情報源リポジトリ（dist はサイト側ビルドが毎回再生成） */
const dest = process.argv[2] ||
  '/Users/tai/creative-studio/projects/2026-08-portfolio-site/03_explorations/motion/lab/liquid-glass';

mkdirSync(dest, { recursive: true });

/* ランタイム一式（フォントは css/ からの ../assets 参照なので構造を保つ）。
   assets/icons（js スプライトの生成元）と assets/media（docs 専用）は配信不要 —
   特に icons の svg は、サイト側の未参照画像の間引きで消される側なので載せない */
for (const dir of ['css', 'js']) {
  cpSync(join(root, dir), join(dest, dir), { recursive: true });
}
cpSync(join(root, 'assets/fonts'), join(dest, 'assets/fonts'), { recursive: true });
cpSync(join(root, 'assets/favicon.svg'), join(dest, 'assets/favicon.svg'));

/* 配布 zip（export-package.mjs の生成物）があれば一緒に配信する */
if (existsSync(join(root, 'showcase/unique-glass-ds.zip'))) {
  cpSync(join(root, 'showcase/unique-glass-ds.zip'), join(dest, 'unique-glass-ds.zip'));
}

/* ページ: フラット化 + ルート相対の書き換え */
let pages = 0;
for (const f of readdirSync(join(root, 'showcase')).filter((f) => f.endsWith('.html'))) {
  let s = readFileSync(join(root, 'showcase', f), 'utf8');
  s = s.replaceAll('../css/', 'css/').replaceAll('../js/', 'js/').replaceAll('../assets/', 'assets/');
  writeFileSync(join(dest, f), s);
  pages++;
}

/* 残置検査: 書き換え漏れの ../ 参照があれば失敗させる */
const leftovers = [];
for (const f of readdirSync(dest).filter((f) => f.endsWith('.html'))) {
  const s = readFileSync(join(dest, f), 'utf8');
  const m = s.match(/(?:src|href)="\.\.\/[^"]*"/g);
  if (m) leftovers.push(f + ': ' + m.join(' '));
}
if (leftovers.length) {
  console.error('✗ 未解決の ../ 参照:\n' + leftovers.join('\n'));
  process.exit(1);
}
console.log(`✓ ${dest} へ ${pages} ページ + css/js/assets/fonts を配置`);
console.log('  次: cd サイト側 motion/ で node build-pages.mjs → dist/ を公開');
