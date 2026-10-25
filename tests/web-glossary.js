// Glossary: footer link, page (search, topics, link to one term) and the definitions of the underlined
// words in the station texts, the Grafcet, the I/O table and the component sheets.
const B = require('./lib/browser');
const { glossary } = require('./lib/page');
const { title, ok, done } = require('./lib/check');

const N = glossary().GLOSSARY.length;
const pop = t => t.evaluate(() => {
  const p = document.querySelector('.gl-pop');
  if (!p || p.hidden) return null;
  const r = p.getBoundingClientRect();
  return { title: p.querySelector('.gl-pop-t').textContent, def: p.querySelector('.gl-pop-d').textContent, left: r.left, right: r.right, vw: document.documentElement.clientWidth,
    inSheet: !!p.closest('.sheet-panel'), focus: document.activeElement === p };
});
// No underlined word inside a link, a button, a heading or another underlined word.
const badPlaces = t => t.evaluate(() => [...document.querySelectorAll('.gl-term')]
  .filter(e => e.parentNode.closest('a, button, h1, h2, h3, h4, svg, .gl-term')).map(e => e.textContent));

(async () => {
  let { browser, page, errors } = await B.launch();
  try {
    title('Footer and glossary page');
    await page.goto(B.APP);
    await page.waitForSelector('#home a');
    const foot = await page.textContent('.footer-glossary');
    ok('footer column with the glossary', /Glossari/.test(foot) && /Obre el glossari/.test(foot));
    await page.click('.footer-gl');
    await page.waitForTimeout(500);
    let r = await page.evaluate(() => ({ hash: location.hash, title: document.getElementById('page-title').textContent,
      entries: document.querySelectorAll('.gl-entry').length, secs: document.querySelectorAll('.gl-sec').length,
      chips: [...document.querySelectorAll('.gl-chips .comp-chip')].map(c => c.textContent), home: !document.getElementById('home').classList.contains('hidden') }));
    ok('opens the glossary page', r.hash === '#glossari' && r.title === 'Glossari' && !r.home, r);
    ok(`all ${N} terms in 5 topics`, r.entries === N && r.secs === 5, r);
    await page.fill('.gl-search input', 'biest');
    await page.waitForTimeout(200);
    r = await page.evaluate(() => ({ terms: [...document.querySelectorAll('.gl-entry h3')].map(h => h.textContent), live: document.querySelector('.gl-live').textContent }));
    ok('search "biest"', r.terms.join() === 'Vàlvula biestable' && r.live === '1 paraula', r);
    await page.fill('.gl-search input', 'cap paraula així');
    await page.waitForTimeout(200);
    ok('search without results', /Cap paraula/.test(await page.textContent('.gl-list')));
    await page.fill('.gl-search input', '');
    await page.click('[data-gl-cat="sensors"]');
    await page.waitForTimeout(200);
    r = await page.evaluate(() => ({ secs: [...document.querySelectorAll('.gl-cat')].map(h => h.textContent), n: document.querySelectorAll('.gl-entry').length }));
    ok('topic filter: only sensors', r.secs.join() === 'Sensors' && r.n > 3, r);
    await page.click('[data-gl-cat="all"]');
    ok('definitions link other terms', (await page.$$('.gl-list .gl-term')).length > 10);

    title('Link to one term');
    await page.goto(B.APP + '#glossari/biestable');
    await page.waitForTimeout(700);
    r = await page.evaluate(() => {
      const e = document.getElementById('gl-biestable'), b = e.getBoundingClientRect();
      return { target: e.classList.contains('is-target'), visible: b.top >= 0 && b.bottom <= innerHeight, focus: document.activeElement === e };
    });
    ok('#glossari/biestable shows and marks the term', r.target && r.visible && r.focus, r);

    title('Underlined words in the stations');
    await B.openSection(page, 'pick-and-place', 1);
    await page.waitForSelector('.io-row');
    const io = await page.$$eval('.io-wrap .gl-term', els => els.map(e => e.dataset.gl));
    ok('I/O table: each word once in the whole table', io.length > 10 && new Set(io).size === io.length, io.length);
    const desc = await page.$$eval('#station-desc .gl-term', els => els.length);
    ok('station description has underlined words', desc > 0, desc);
    const term = await page.$('.io-wrap .gl-term');
    const word = await term.textContent();
    await term.click();
    await page.waitForTimeout(200);
    let p = await pop(page);
    ok('tap a word: definition next to it', p && p.def.length > 20 && p.focus, p);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    r = await page.evaluate(() => ({ open: !document.querySelector('.gl-pop').hidden, focus: document.activeElement.textContent, exp: document.activeElement.getAttribute('aria-expanded') }));
    ok('Escape closes it and goes back to the word', !r.open && r.focus === word && r.exp === 'false', r);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    ok('Enter on the word opens it again', !!(await pop(page)));
    await page.click('h3');
    await page.waitForTimeout(150);
    ok('click outside closes it', !(await pop(page)));
    await term.click();
    await page.waitForTimeout(150);
    const id = await term.getAttribute('data-gl');
    await page.click('.gl-pop-more');
    await page.waitForTimeout(700);
    r = await page.evaluate(() => ({ hash: location.hash, title: document.getElementById('page-title').textContent }));
    ok('"Veure al glossari" opens the term', r.hash === '#glossari/' + id && r.title === 'Glossari', r);

    title('Grafcet and components');
    await B.openSection(page, 'distributing-conveyor', 2);
    ok('Grafcet intro has underlined words', (await page.$$('.gf-intro .gl-term')).length >= 2);
    await page.click('.gf-tab[data-chart="0"]');
    await page.click('.gf-svg [data-el="s101"] .box');
    await page.waitForTimeout(200);
    ok('explanation of a step has underlined words', (await page.$$('.gf-info .gl-term')).length > 0, await page.$$eval('.gf-info .gl-term', e => e.map(x => x.textContent)));
    await B.openSection(page, 'pick-and-place', 3);
    ok('component modules have underlined words', (await page.$$('.comp-module-body .gl-term')).length > 0);
    const cards = await page.$$('.comp-card');
    let found = false;
    for (let i = 0; i < cards.length && !found; i++) {
      await cards[i].click();
      await page.waitForTimeout(600);
      const t = await page.$('.sheet-text .gl-term');
      if (t) {
        found = true;
        await t.click();
        await page.waitForTimeout(200);
        p = await pop(page);
        ok('a component sheet: definition inside the sheet', p && p.inSheet, p);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        r = await page.evaluate(() => ({ pop: !document.querySelector('.gl-pop').hidden, sheet: !document.getElementById('sheet').hidden }));
        ok('Escape closes the definition, not the sheet', !r.pop && r.sheet, r);
      }
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
    ok('some component sheet has underlined words', found);
    ok('no underlined word inside links, buttons or headings', !(await badPlaces(page)).length);
    ok('no errors', !errors.length, errors);
    await browser.close();

    title('Phone');
    ({ browser, page, errors } = await B.launch({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }));
    await page.goto(B.APP + '#sorting');
    await page.waitForSelector('#station-desc .gl-term');
    await page.tap('#station-desc .gl-term');
    await page.waitForTimeout(200);
    p = await pop(page);
    ok('definition fits on the screen', p && p.left >= 0 && p.right <= p.vw, p);
    await page.screenshot({ path: B.OUT + '/glossary-phone.png' });
    await page.goto(B.APP + '#glossari');
    await page.waitForTimeout(500);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    ok('glossary page without horizontal scroll', sw <= 390, sw);
    ok('no errors (phone)', !errors.length, errors);
    await browser.close();

    title('Embedded like in Google Sites');
    ({ browser, page, errors } = await B.launch());
    const frame = await B.embed(page, '');
    await frame.click('.footer-gl');
    await page.waitForTimeout(500);
    ok('footer link works inside the iframe', (await frame.textContent('#page-title')) === 'Glossari');
    await frame.click('.gl-list .gl-term');
    await page.waitForTimeout(200);
    ok('definitions work inside the iframe', !!(await pop(frame)));
    ok('no errors (iframe)', !errors.length, errors);
  } catch (e) {
    ok('test ran to the end', false, String(e));
  }
  await browser.close();
  B.stop();
  done();
})();
