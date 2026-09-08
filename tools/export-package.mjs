#!/usr/bin/env node
/* export-package.mjs — 配布 zip の生成。
   内容は GitHub リポジトリと完全に同一（git archive HEAD）。
   AI 運用資産（SKILL.md / prompts/）は .gitignore 済みのため両方に含まれない。
   注意: 反映されるのは「コミット済み」の内容 — コミットしてから実行する。
   出力: showcase/<pkg.name>.zip（export-site が拾って配信する）
   usage: node tools/export-package.mjs */
import { readFileSync, statSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const out = join(root, 'showcase/' + pkg.name + '.zip');
if (existsSync(out)) rmSync(out);
execFileSync('git', ['archive', '--format=zip', '-o', out,
  '--prefix=' + pkg.name + '/', 'HEAD'], { cwd: root });
const kb = Math.round(statSync(out).size / 1024);
console.log(`✓ showcase/${pkg.name}.zip（v${pkg.version} / ${kb}KB）= GitHub リポジトリと同一構成`);
