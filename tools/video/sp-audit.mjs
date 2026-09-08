/* sp-audit.mjs — 開発専用: 390px ビューポートでの SP 監査。
   横スクロール（doc 幅超過）の検出と全ページのスクリーンショット。
   headless Chrome 直叩きは最小幅 500px のため puppeteer の viewport で実測する。
   usage: node sp-audit.mjs <outDir> [page ...] */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = process.argv[2] || '/tmp/sp-audit';
const pages = process.argv.slice(3);
const targets = pages.length ? pages : ['index', 'catalog', 'screens', 'app', 'studio-dark'];
mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'shell',
  userDataDir: join(out, '.prof'),
  args: ['--no-first-run', '--no-default-browser-check', '--hide-scrollbars'],
  protocolTimeout: 60000,
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

for (const t of targets) {
  await page.goto('file://' + join(root, 'showcase', t + '.html'), { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 900));
  const audit = await page.evaluate(() => {
    const doc = document.documentElement;
    const over = doc.scrollWidth - doc.clientWidth;
    const bad = [];
    if (over > 1) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.right > doc.clientWidth + 1 || r.left < -1) {
          if (bad.length < 8 && r.width > 8) {
            bad.push((el.className && String(el.className).slice(0, 60)) || el.tagName);
          }
        }
      }
    }
    return { over, bad, w: doc.scrollWidth };
  });
  console.log(`${t}: overflow=${audit.over}px` + (audit.bad.length ? '  offenders: ' + [...new Set(audit.bad)].join(' | ') : ''));
  await page.screenshot({ path: join(out, t + '-390.png'), fullPage: false });
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight / 2));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: join(out, t + '-390-mid.png'), fullPage: false });
}
await browser.close();
