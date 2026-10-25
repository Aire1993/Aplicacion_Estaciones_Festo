// The whole web at a glance: home, the three stations and their four buttons, the link back home and
// the footer, on a computer, a phone and embedded like in Google Sites. No JavaScript errors.
const B = require('./lib/browser');
const { title, ok, done } = require('./lib/check');

const BUTTONS = ['Esquemes', 'Entrades/Sortides PLC', 'Grafcet', 'Components'];

async function visit(t, label) {
  title(label);
  await t.waitForSelector('#home a[href^="#"]');
  const links = await t.$$eval('a[href^="#"]', as => [...new Set(as.map(a => a.getAttribute('href')))]);
  for (const slug of B.STATIONS) ok(`home links to ${slug}`, links.includes('#' + slug));
  for (const slug of B.STATIONS) {
    for (let i = 0; i < BUTTONS.length; i++) {
      await B.openSection(t, slug, i);
      if (i === 1) await t.waitForSelector('.io-row', { timeout: 8000 }).catch(() => {});
      const r = await t.evaluate(() => ({
        h3: (document.querySelector('.panel h3') || {}).textContent,
        filled: !!document.querySelector('.panel .doc, .panel .comp-grid, .panel .comp-card, .panel .gf-svg, .panel .io-row'),
        sw: document.documentElement.scrollWidth, vw: innerWidth,
      }));
      ok(`${slug} · ${BUTTONS[i]}`, r.h3 === BUTTONS[i] && r.filled && r.sw <= r.vw, r);
    }
  }
  await t.click('#home-link');
  await t.waitForTimeout(500);
  const home = await t.evaluate(() => ({ hash: location.hash, footer: (document.querySelector('footer') || {}).textContent || '' }));
  ok('header link goes home', home.hash === '' || home.hash === '#', home.hash);
  ok('footer: author and licence', /Alberto Pérez Castillo/.test(home.footer) && /CC BY-NC-SA 4\.0/.test(home.footer));
}

(async () => {
  let { browser, page, errors } = await B.launch();
  try {
    await page.goto(B.APP);
    await visit(page, 'Computer');
    ok('no errors (computer)', !errors.length, errors);
    await browser.close();

    ({ browser, page, errors } = await B.launch({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }));
    await page.goto(B.APP);
    await visit(page, 'Phone');
    ok('no errors (phone)', !errors.length, errors);
    await browser.close();

    ({ browser, page, errors } = await B.launch());
    const frame = await B.embed(page, '');
    await visit(frame, 'Embedded like in Google Sites');
    ok('no errors (iframe)', !errors.length, errors);
  } catch (e) {
    ok('test ran to the end', false, String(e));
  }
  await browser.close();
  B.stop();
  done();
})();
