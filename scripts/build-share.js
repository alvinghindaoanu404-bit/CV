#!/usr/bin/env node
/* Regenerates assets/share.jpg, the picture shown when the site's address is shared.
   It is a 1200 × 630 screenshot of share.html (which reads js/content.js).
   Usage:  node scripts/build-share.js
   Needs Playwright with Chromium:  npm i -D playwright && npx playwright install chromium */
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const out = path.join(root, 'assets', 'share.jpg');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(root, 'share.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => { const i = document.getElementById('img'); return !i.src || (i.complete && i.naturalWidth > 0); });
  await page.waitForTimeout(150);
  await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
  await browser.close();
  console.log('Wrote ' + path.relative(root, out));
})().catch((err) => { console.error(err); process.exit(1); });
