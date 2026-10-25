// "Obre a pantalla completa": only on a phone inside Google Sites (a low frame with its own scroll bar);
// it opens the web in its own tab, at the same station, and everything works there.
const B = require('./lib/browser');
const { title, ok, done } = require('./lib/check');

const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const barShown = t => t.evaluate(() => !document.getElementById('fs-bar').hidden);

(async () => {
  let { browser, context, page, errors } = await B.launch(PHONE);
  try {
    title('When it shows');
    await page.goto(B.APP + '#sorting');
    await page.waitForSelector('.btn');
    ok('phone, page on its own: no notice', !(await barShown(page)));
    await browser.close();
    ({ browser, context, page, errors } = await B.launch());
    let frame = await B.embed(page, 'sorting');
    ok('computer, inside Google Sites: no notice', !(await barShown(frame)));
    await browser.close();

    title('Phone inside Google Sites');
    ({ browser, context, page, errors } = await B.launch(PHONE));
    frame = await B.embed(page, 'pick-and-place', B.SITES_SANDBOX, 520);
    ok('notice at the top of the frame', await barShown(frame));
    await page.screenshot({ path: B.OUT + '/fullscreen-notice.png' });
    const [tab] = await Promise.all([context.waitForEvent('page', { timeout: 5000 }), frame.tap('#fs-open')]);
    await tab.waitForSelector('.btn');
    let r = await tab.evaluate(() => ({
      title: document.getElementById('page-title').textContent, hash: location.hash, notice: !document.getElementById('fs-bar').hidden,
      top: window.self === window.top, w: innerWidth, sw: document.documentElement.scrollWidth, cards: document.querySelectorAll('#home .card').length,
    }));
    ok('opens in its own tab, at the same station, without the notice', r.title === 'Pick and Place Station' && r.hash === '#pick-and-place' && !r.notice && r.top, r);
    ok('takes the whole width, no horizontal scroll', r.w === 390 && r.sw <= 390, r);
    ok('the page is built once (no repeated station cards)', r.cards === 3, r.cards);
    await tab.tap('.btn >> nth=2');
    await tab.waitForSelector('.gf-svg');
    await tab.tap('.gf-simbtn');
    await tab.tap('.gf-pb[data-push="reset"]');
    await tab.waitForTimeout(200);
    const steps = await tab.textContent('.gf-sim-state');
    ok('Grafcet and simulator work in the new tab', /GC 22/.test(steps), steps);
    await tab.tap('#home-link');
    await tab.waitForTimeout(400);
    await tab.tap('#home .card >> nth=2');
    await tab.waitForTimeout(400);
    ok('moving to another station works', (await tab.textContent('#page-title')) === 'Sorting Station');
    await tab.screenshot({ path: B.OUT + '/fullscreen-tab.png' });
    ok('no errors', !errors.length, errors);
    await browser.close();

    title('Phone inside Google Sites without pop-ups');
    ({ browser, context, page, errors } = await B.launch(PHONE));
    frame = await B.embed(page, '', 'allow-scripts allow-same-origin', 520);
    await frame.tap('#fs-open');
    await page.waitForTimeout(300);
    const msg = await frame.textContent('#fs-msg');
    ok('explains how to allow it', /finestres emergents/.test(msg), msg);
    ok('no other errors', !errors.filter(e => !/Blocked opening/.test(e)).length, errors);
  } catch (e) {
    ok('test ran to the end', false, String(e));
  }
  await browser.close();
  B.stop();
  done();
})();
