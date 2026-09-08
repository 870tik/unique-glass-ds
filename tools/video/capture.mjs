#!/usr/bin/env node
/* capture.mjs — ショーケースのインタラクション録画（開発専用）
   usage: node tools/video/capture.mjs  → assets/media/*.webm */
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = join(root, 'assets/media');
mkdirSync(out, { recursive: true });

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: '/private/tmp/claude-504/-Users-tai-creative-studio/41356cfc-ea7d-4b8f-b6fe-06e51e97c022/scratchpad/pptr-profile',
  args: ['--window-size=1000,700', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-gpu'],
  protocolTimeout: 60000,
});
const page = await browser.newPage();
await page.setViewport({ width: 1000, height: 640, deviceScaleFactor: 2 });

async function goAct(actIndex) {
  await page.goto('file://' + join(root, 'showcase/tour.html'), { waitUntil: 'load' });
  await sleep(700);
  await page.evaluate((i) => {
    document.querySelectorAll('.act')[i].scrollIntoView({ block: 'center', behavior: 'instant' });
  }, actIndex);
  await sleep(600);
}
async function rect(sel) {
  return page.evaluate((s) => {
    const r = document.querySelector(s).getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, l: r.left, t: r.top };
  }, sel);
}

/* ---- 1. gel press ---- */
{
  await goAct(1);
  const c = await rect('.act:nth-of-type(2) .lg-card');
  const rec = await page.screencast({ path: join(out, 'gel-press.webm') });
  await page.mouse.move(c.x - 300, c.y + 150);
  await sleep(250);
  await page.mouse.move(c.x, c.y, { steps: 18 });
  await sleep(650);
  for (let i = 0; i < 2; i++) {
    await page.mouse.down(); await sleep(620);
    await page.mouse.up(); await sleep(1050);
  }
  await sleep(350);
  await rec.stop();
  console.log('gel-press.webm');
}

/* ---- 2. spectral rim ---- */
{
  await goAct(2);
  const c = await rect('.act--light .lg-card');
  const rec = await page.screencast({ path: join(out, 'spectral-rim.webm') });
  await page.mouse.move(c.l - 60, c.t - 40);
  await sleep(300);
  const path = [
    [c.l + 12, c.t + 12], [c.l + c.w - 12, c.t + 12],
    [c.l + c.w - 12, c.t + c.h - 12], [c.l + 12, c.t + c.h - 12],
    [c.l + 12, c.t + 12], [c.x, c.y],
  ];
  for (const [x, y] of path) {
    await page.mouse.move(x, y, { steps: 26 });
    await sleep(160);
  }
  await sleep(500);
  await rec.stop();
  console.log('spectral-rim.webm');
}

/* ---- 3. vitals: 瞳孔反射 → 注視の呼吸 ---- */
{
  await goAct(3);
  const c = await rect('.act:nth-of-type(4) .lg-card');
  const rec = await page.screencast({ path: join(out, 'vitals-breath.webm') });
  await page.mouse.move(c.x - 320, c.y);
  await sleep(300);
  await page.mouse.move(c.x, c.y, { steps: 20 });
  await sleep(900);
  await page.mouse.move(c.x - 340, c.y + 140, { steps: 16 });
  await sleep(400);
  /* キーボードで focus-visible を成立させる（カード直前の要素から Tab） */
  await page.evaluate(() => {
    const card = document.querySelectorAll('.act')[3].querySelector('.lg-card');
    const probe = document.createElement('button');
    probe.style.position = 'fixed'; probe.style.opacity = '0'; probe.style.left = '-10px';
    card.parentNode.insertBefore(probe, card);
    probe.focus();
  });
  await page.keyboard.press('Tab');
  await sleep(8000); /* 呼吸 2周期強 */
  await rec.stop();
  console.log('vitals-breath.webm');
}

/* ---- 4. state optics: 壊れた分光 ---- */
{
  await goAct(5);
  const f = await rect('.lg-field.is-error');
  const rec = await page.screencast({ path: join(out, 'state-error.webm') });
  await page.mouse.move(f.x - 300, f.y + 120);
  await sleep(300);
  await page.mouse.move(f.x, f.y, { steps: 16 });
  await sleep(400);
  await page.mouse.down(); await page.mouse.up();
  await sleep(1600);
  await page.mouse.move(f.x - 340, f.y + 160, { steps: 14 });
  await page.mouse.down(); await page.mouse.up();
  await sleep(700);
  await rec.stop();
  console.log('state-error.webm');
}

await browser.close();
