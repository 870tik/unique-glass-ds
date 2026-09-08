#!/usr/bin/env node
/* export-package.mjs — 「そのまま利用」勢向けの配布物を固める。
   package.json の files をそのまま zip に写す（npm と zip で中身の定義を一元化）。
   出力: showcase/liquid-glass-ds.zip（サイトの export-site が拾って配信する）
   usage: node tools/export-package.mjs */
import { readFileSync, mkdirSync, cpSync, rmSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const stage = join(root, '.pkg-stage/' + pkg.name);

if (existsSync(join(root, '.pkg-stage'))) rmSync(join(root, '.pkg-stage'), { recursive: true });
mkdirSync(stage, { recursive: true });
for (const f of [...pkg.files, 'package.json']) {
  const src = join(root, f);
  if (!existsSync(src)) { console.error('✗ files に無いパス: ' + f); process.exit(1); }
  cpSync(src, join(stage, f), { recursive: true,
    filter: (p) => !p.endsWith('.zip') }); /* showcase 内の生成済み zip を巻き込まない */
}
/* docs 内の重い媒体は配布物に含めない（webm は docs 参照用） */
const out = join(root, 'showcase/' + pkg.name + '.zip');
if (existsSync(out)) rmSync(out);
execFileSync('zip', ['-qr', out, pkg.name], { cwd: join(root, '.pkg-stage') });
rmSync(join(root, '.pkg-stage'), { recursive: true });
const kb = Math.round(statSync(out).size / 1024);
console.log(`✓ showcase/${pkg.name}.zip（v${pkg.version} / ${kb}KB）— npm publish も同じ files 定義`);
