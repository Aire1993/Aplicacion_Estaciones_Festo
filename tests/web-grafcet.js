// Grafcet drawings of the three stations at every chart and level: no text over other texts or lines,
// the explanation of steps and transitions, the zoom sheet, the signals table and a phone.
const B = require('./lib/browser');
const { title, ok, done } = require('./lib/check');

// Texts that overlap each other or a line of the drawing (transition bars excluded).
const overlaps = t => t.evaluate(() => {
  const svg = document.querySelector('.gf-scroll svg');
  const boxes = [...svg.querySelectorAll('text')].map(e => { const b = e.getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height, t: e.textContent.slice(0, 25) }; });
  const hit = (b, x1, y1, x2, y2) => Math.max(x1, x2) > b.x + 1 && Math.min(x1, x2) < b.x + b.w - 1 && Math.max(y1, y2) > b.y + 1 && Math.min(y1, y2) < b.y + b.h - 1;
  const segs = [...svg.querySelectorAll('line.ln')].map(l => ['x1', 'y1', 'x2', 'y2'].map(a => +l.getAttribute(a)));
  svg.querySelectorAll('path.ln').forEach(p => {
    let x = 0, y = 0;
    p.getAttribute('d').replace(/([MVHL])\s*([\d.-]+)(?:\s+([\d.-]+))?/g, (m, c, a, b) => {
      const nx = c === 'V' ? x : +a, ny = c === 'V' ? +a : c === 'H' ? y : +b;
      if (c !== 'M') segs.push([x, y, nx, ny]);
      x = nx; y = ny;
    });
  });
  const out = [];
  boxes.forEach((p, i) => {
    boxes.slice(i + 1).forEach(q => { if (hit(p, q.x, q.y, q.x + q.w, q.y + q.h) && hit(q, p.x, p.y, p.x + p.w, p.y + p.h)) out.push(p.t + ' / ' + q.t); });
    segs.forEach(s => { if (hit(p, ...s)) out.push(p.t + ' / line ' + s.join(',')); });
  });
  return { out, w: +svg.getAttribute('width'), h: +svg.getAttribute('height') };
});

(async () => {
  let { browser, page, errors } = await B.launch();
  try {
    for (const slug of B.STATIONS) {
      title(slug + ': drawings');
      await B.openSection(page, slug, 2);
      for (const i of [0, 1, 2]) for (const lv of ['fn', 'tag', 'plc']) {
        await page.click(`.gf-tab[data-chart="${i}"]`);
        await page.click(`.gf-level[data-level="${lv}"]`);
        await page.waitForTimeout(80);
        const r = await overlaps(page);
        ok(`chart ${i} level ${lv} (${r.w}x${r.h})`, !r.out.length, r.out.length ? r.out : undefined);
      }
      title(slug + ': explanations, table and zoom');
      await page.click('.gf-tab[data-chart="2"]');
      await page.click('.gf-level[data-level="fn"]');
      const n = await page.$$eval('.gf-svg [data-el]', els => els.length);
      let info = '';
      for (let k = 0; k < n; k++) {
        await page.focus(`.gf-svg [data-el] >> nth=${k}`);
        info = await page.textContent('.gf-info');
        if (!/ETAPA|TRANSICIÓ|Etapa|Transició/.test(info)) break;
      }
      ok(`all ${n} steps and transitions of GP explain themselves`, /Etapa|Transició/i.test(info), info.slice(0, 60));
      const rows = await page.$$eval('.gf-table tr[data-var]', r => r.length);
      ok('signals table', rows > 5, rows);
      await page.click('.gf-zoom');
      await page.waitForTimeout(800);
      const sheet = await page.evaluate(() => ({ open: !document.getElementById('sheet').hidden, svg: !!document.querySelector('.sheet-gf svg'), t: document.getElementById('sheet-title').textContent }));
      ok('zoom sheet', sheet.open && sheet.svg && /GP/.test(sheet.t), sheet);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
    ok('no errors (desktop)', !errors.length, errors);
    await browser.close();

    title('Phone');
    ({ browser, page, errors } = await B.launch({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }));
    for (const slug of B.STATIONS) {
      await page.goto(B.APP + '#' + slug);
      await page.waitForSelector('.btn');
      await page.tap('.btn >> nth=2');
      await page.waitForTimeout(600);
      await page.tap('.gf-svg [data-el="s1"] .box');
      await page.waitForTimeout(200);
      const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, h4: (document.querySelector('.gf-info h4') || {}).textContent }));
      ok(slug + ': tap a step, no horizontal page scroll', r.sw <= 390 && !!r.h4, r);
    }
    await page.screenshot({ path: B.OUT + '/grafcet-phone.png' });
    ok('no errors (phone)', !errors.length, errors);
  } catch (e) {
    ok('test ran to the end', false, String(e));
  }
  await browser.close();
  B.stop();
  done();
})();
