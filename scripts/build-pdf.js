#!/usr/bin/env node
/* Regenerates assets/cv.pdf from cv.html (which reads js/content.js).
   Usage:  node scripts/build-pdf.js
   Needs Playwright with Chromium:  npm i -D playwright && npx playwright install chromium */
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const out = path.join(root, 'assets', 'cv.pdf');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.join(root, 'cv.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  const pages = await page.evaluate(() => Math.ceil(document.getElementById('cv').scrollHeight / 1122));
  await browser.close();
  console.log('Wrote ' + path.relative(root, out));
  if (pages > 2) console.warn('Note: the CV runs to about ' + pages + ' pages. Recruiters prefer one or two.');
})().catch((err) => { console.error(err); process.exit(1); });
