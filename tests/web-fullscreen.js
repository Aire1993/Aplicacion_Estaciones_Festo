// "Obre a pantalla completa": only on a phone inside Google Sites (a low frame with its own scroll bar).
// It opens the web published on GitHub Pages in a new tab, at the same station. The notice can be closed
// (remembered in the browser) and the footer keeps the link.
const B = require('./lib/browser');
const { title, ok, done } = require('./lib/check');

const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const shown = (t, id) => t.evaluate(i => !document.getElementById(i).hidden, id);

(async () => {
  let { browser, context, page, errors } = await B.launch(PHONE);
  try {
    title('When it shows');
    await page.goto(B.APP + '#sorting');
    await page.waitForSelector('.btn');
    ok('phone, page on its own: no notice, no footer link', !(await shown(page, 'fs-bar')) && !(await shown(page, 'footer-fs')));
    await browser.close();
    ({ browser, context, page, errors } = await B.launch());
    let frame = await B.embed(page, 'sorting');
    ok('computer, inside Google Sites: no notice', !(await shown(frame, 'fs-bar')));
    await browser.close();

    title('Phone inside Google Sites');
    ({ browser, context, page, errors } = await B.launch(PHONE));
    frame = await B.embed(page, 'pick-and-place', B.SITES_SANDBOX, 520);
    ok('notice at the top of the frame, link in the footer', await shown(frame, 'fs-bar') && await shown(frame, 'footer-fs'));
    await page.screenshot({ path: B.OUT + '/fullscreen-notice.png' });
    const [tab] = await Promise.all([context.waitForEvent('page', { timeout: 5000 }), frame.tap('#fs-bar .fs-open')]);
    await tab.waitForSelector('.btn');
    let r = await tab.evaluate(() => ({
      url: location.href, title: document.getElementById('page-title').textContent, notice: !document.getElementById('fs-bar').hidden,
      opener: window.opener === null, w: innerWidth, sw: document.documentElement.scrollWidth,
    }));
    ok('opens GitHub Pages at the same station', r.url === B.PAGES_URL + '#pick-and-place' && r.title === 'Pick and Place Station', r);
    ok('full screen there: no notice, no horizontal scroll', !r.notice && r.w === 390 && r.sw <= 390, r);
    await tab.tap('.btn >> nth=2');
    await tab.waitForSelector('.gf-svg');
    ok('the web works there', (await tab.$$('.gf-svg [data-el]')).length > 5);
    await tab.close();

    title('Closing the notice');
    await frame.tap('#fs-close');
    await page.waitForTimeout(150);
    ok('the close button hides it', !(await shown(frame, 'fs-bar')));
    await page.reload();
    await page.waitForTimeout(1000);
    frame = page.frames().find(f => f.url().startsWith(B.APP));
    ok('it stays closed after reloading', !(await shown(frame, 'fs-bar')));
    ok('the footer link is still there', await shown(frame, 'footer-fs'));
    const [tab2] = await Promise.all([context.waitForEvent('page', { timeout: 5000 }), frame.tap('#footer-fs')]);
    await tab2.waitForLoadState();
    ok('the footer link opens GitHub Pages', tab2.url().startsWith(B.PAGES_URL), tab2.url());
    ok('no errors', !errors.length, errors);
    await browser.close();

    title('Phone inside Google Sites without pop-ups');
    ({ browser, context, page, errors } = await B.launch(PHONE));
    frame = await B.embed(page, '', 'allow-scripts allow-same-origin', 520);
    await frame.tap('#fs-bar .fs-open');
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
