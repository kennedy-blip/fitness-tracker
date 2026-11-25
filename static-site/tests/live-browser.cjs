const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.mouse.move(0, 0);
      const response = await page.goto(process.argv[2]);
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('script').count(), 0);
      assert.equal(await page.locator('.step-chart li').count(), 7);
      assert.equal(await page.locator('.workouts li').count(), 5);
      assert.equal(await page.locator('.total strong').textContent(), '290 min');
      assert(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
      const row = page.locator('.workouts li').first();
      await row.evaluate(el => el.scrollIntoView({ block: 'center' }));
      const background = () => row.evaluate(el => getComputedStyle(el).backgroundColor);
      const before = await background();
      await row.hover();
      await page.waitForFunction(color => getComputedStyle(document.querySelector('.workouts li')).backgroundColor !== color, before);
      assert.equal(await page.locator('header').evaluate(el => getComputedStyle(el).position), 'sticky');
      console.log(`Verified live dashboard, data display, layout and hover at ${width}px`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
