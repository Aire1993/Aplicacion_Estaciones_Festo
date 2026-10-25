// Grafcet simulator in the page (button "Simula"): panel, drawing, push buttons held with the mouse,
// keyboard, the zoom sheet, leaving the section, a phone and the page embedded like in Google Sites.
const B = require('./lib/browser');
const { title, ok, done } = require('./lib/check');

const state = t => t.evaluate(() => {
  const q = s => document.querySelector(s);
  const svg = q('.gf-scroll svg');
  return {
    steps: [...document.querySelectorAll('.gf-sim-state .gf-simgo')].map(b => b.textContent.trim()).join(' | '),
    on: [...svg.querySelectorAll('.gf-step.sim-on')].map(g => g.dataset.el).join(','),
    acts: [...svg.querySelectorAll('.gf-a.sim-on')].length,
    wait: [...svg.querySelectorAll('.gf-tr.sim-wait')].map(g => g.dataset.el).join(','),
    outs: [...document.querySelectorAll('.gf-outs li.is-on')].map(li => li.dataset.out).sort().join(','),
    lamps: [...document.querySelectorAll('.gf-pb.lamp-on')].map(b => b.dataset.push).join(','),
    waitText: q('.gf-sim-wait') ? q('.gf-sim-wait').textContent : '',
    btn: q('.gf-simbtn').textContent.trim(),
    side: [...document.querySelectorAll('.gf-side > *')].filter(e => getComputedStyle(e).display !== 'none').map(e => e.className).join(','),
  };
});
const hold = async (t, page, sel, ms) => {
  const box = await (await t.$(sel)).boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
  await page.waitForTimeout(150);
};
const click = async (t, sel, wait = 150) => { await t.click(sel); await t.waitForTimeout(wait); };

(async () => {
  let { browser, page, errors } = await B.launch();
  try {
    title('MA1: start, RESET and a cycle with the ejector moving by itself');
    await B.openSection(page, 'distributing-conveyor', 2);
    await click(page, '.gf-simbtn');
    let s = await state(page);
    ok('simulation panel replaces the explanation', /^gf-sim\b/.test(s.side) && !/gf-about|gf-info|gf-vars/.test(s.side), s.side);
    ok('button turns into "Para la simulació"', /Para la simulació/.test(s.btn), s.btn);
    ok('initial situation', s.steps === 'GS 100 | GC 20 | GP 0' && s.on === 's0', s);
    ok('RESET lamp on (selector in MAN)', s.lamps === 'reset' && s.outs === 'llumReset', s.lamps);
    ok('GP waits for 0 -> 1', s.wait === 't0' && /GC 20 → 21/.test(s.waitText), s.waitText);
    await click(page, '.gf-pb[data-push="reset"]');
    s = await state(page);
    ok('RESET (click) -> preparada, START lamp', /GC 22/.test(s.steps) && s.lamps === 'start', s);
    await click(page, '.gf-pb[data-push="start"]', 100);
    s = await state(page);
    ok('START -> GP 1, ejector output on, action box lit', /GP 1/.test(s.steps) && s.outs === 'expulsor' && s.acts === 1, s);
    await page.waitForTimeout(800);
    s = await state(page);
    ok('ejector advanced by itself -> GP 2', /GP 2/.test(s.steps), s.steps);
    await page.waitForTimeout(800);
    s = await state(page);
    ok('ejector back by itself -> GP 3, conveyor on', /GP 3/.test(s.steps) && s.outs === 'cinta', s);
    await click(page, '.gf-sw[data-in="final"]');
    ok('piece at the end (sensor by hand) -> GP 4', /GP 4/.test((await state(page)).steps));
    await click(page, '.gf-sw[data-in="final"]');
    s = await state(page);
    ok('piece removed -> GC 22, GP 0 (MAN: one cycle)', /GC 22/.test(s.steps) && /GP 0/.test(s.steps), s.steps);

    title('MA1: STOP held 3 s with the mouse, emergency stop, AUTO/MAN, charts');
    await click(page, '.gf-pb[data-push="start"]', 300);
    const holdStop = hold(page, page, '.gf-pb[data-push="stop"]', 3300);
    await page.waitForTimeout(1500);
    s = await state(page);
    ok('while STOP is held: GC back to 22 and the 3 s timer is shown', /GC 22/.test(s.steps) && /\/ 3 s/.test(s.waitText), s.waitText);
    await holdStop;
    s = await state(page);
    ok('STOP held 3 s -> total stop (GP without steps)', /GC 20/.test(s.steps) && /GP cap/.test(s.steps), s.steps);
    await click(page, '.gf-estop');
    s = await state(page);
    ok('emergency stop pressed -> GS 101', /GS 101/.test(s.steps) && await page.getAttribute('.gf-estop', 'aria-pressed') === 'true', s.steps);
    await click(page, '.gf-estop');
    ok('released -> GS 100', /GS 100/.test((await state(page)).steps));
    await click(page, '[data-man="0"]');
    s = await state(page);
    ok('AUTO: no RESET lamp', s.lamps === '' && await page.getAttribute('[data-man="0"]', 'aria-pressed') === 'true', s.lamps);
    await click(page, '.gf-sim-state .gf-simgo[data-chart="1"]');
    s = await state(page);
    ok('chip GC shows the GC chart with step 20 active', s.on === 's20' && /GC · Conducció|GC Conducció/.test(await page.textContent('.gf-title')), s.on);
    await click(page, '.gf-level[data-level="plc"]');
    s = await state(page);
    ok('changing the level keeps the state', s.on === 's20' && /I1\.3/.test(s.waitText), s.waitText);
    await click(page, '.gf-sim-restart');
    s = await state(page);
    ok('Torna a començar: initial situation', s.steps === 'GS 100 | GC 20 | GP 0', s.steps);

    title('MA1: keyboard and zoom sheet');
    await click(page, '[data-man="1"]');
    await page.focus('.gf-pb[data-push="reset"]');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    ok('RESET with Enter', /GC 22/.test((await state(page)).steps));
    await page.focus('.gf-pb[data-push="start"]');
    await page.keyboard.press(' ');
    await page.waitForTimeout(150);
    ok('START with the space bar (one cycle only)', /GC 23/.test((await state(page)).steps) && /GP 1/.test((await state(page)).steps));
    await click(page, '.gf-zoom', 800);
    const sheetOn = await page.evaluate(() => [...document.querySelectorAll('.sheet-gf svg .gf-step.sim-on')].map(g => g.dataset.el).join(','));
    ok('the zoom sheet shows the active steps too', sheetOn === 's20' || sheetOn.length > 0, sheetOn);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    title('MA1: leaving and stopping');
    await click(page, '.gf-simbtn');
    s = await state(page);
    ok('Para la simulació: drawing without marks, explanation back', s.on === '' && s.wait === '' && /gf-about/.test(s.side) && /Simula/.test(s.btn), s);
    await click(page, '.gf-simbtn');
    await click(page, '.btn >> nth=3', 400);
    await page.waitForTimeout(400);
    await click(page, '.btn >> nth=2', 400);
    s = await state(page);
    ok('back to the Grafcet: simulation off', /Simula/.test(s.btn) && s.on === '', s.btn);
    ok('no errors (desktop)', !errors.length, errors);
    await page.screenshot({ path: B.OUT + '/sim-ma1.png', fullPage: false });

    title('MA2: a cycle with cup and slide moving by themselves');
    await B.openSection(page, 'pick-and-place', 2);
    await click(page, '.gf-tab[data-chart="2"]');
    await click(page, '.gf-simbtn');
    for (const [sel, ms] of [['.gf-pb[data-push="reset"]', 150], ['.gf-pb[data-push="start"]', 150], ['.gf-sw[data-in="inici"]', 150],
      ['.gf-sw[data-in="inici"]', 100], ['.gf-sw[data-in="mig"]', 700]]) await click(page, sel, ms);
    s = await state(page);
    ok('housing at the separator 0.5 s -> GP 2 (cup down)', /GP 2/.test(s.steps) && s.outs === 'baixarVentosa,buit,separador', s);
    ok('the drawing marks step 2 and its three actions', s.on === 's2' && s.acts === 3, s);
    await click(page, '.gf-sw[data-in="agafada"]', 2200);
    s = await state(page);
    ok('insert picked -> cup up and slide forward by themselves', /GP (4|5)/.test(s.steps), s.steps);
    await page.waitForTimeout(3500);
    s = await state(page);
    ok('placed and back: GP 8 (conveyor to the end)', /GP 8/.test(s.steps) && s.outs === 'cinta', s);
    await page.screenshot({ path: B.OUT + '/sim-ma2.png' });

    title('MA3: chute full lamp');
    await B.openSection(page, 'sorting', 2);
    await click(page, '.gf-simbtn');
    await click(page, '.gf-pb[data-push="reset"]');
    await click(page, '.gf-sw[data-in="rampa"]', 1200);
    s = await state(page);
    ok('chute sensor on 1 s -> lamp and not initialised', s.outs.includes('llumPlena') && /GC 20/.test(s.steps), s);
    ok('no errors', !errors.length, errors);
    await browser.close();

    title('Phone');
    ({ browser, page, errors } = await B.launch({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }));
    await page.goto(B.APP + '#pick-and-place');
    await page.waitForSelector('.btn');
    await page.tap('.btn >> nth=2');
    await page.waitForTimeout(600);
    await page.tap('.gf-simbtn');
    await page.waitForTimeout(200);
    await page.tap('.gf-pb[data-push="reset"]');
    await page.waitForTimeout(200);
    s = await state(page);
    ok('tap RESET -> GC 22', /GC 22/.test(s.steps), s.steps);
    const wide = await page.evaluate(() => document.documentElement.scrollWidth);
    ok('no horizontal page scroll', wide <= 390, wide);
    await page.evaluate(() => document.querySelector('.gf-sim').scrollIntoView());
    await page.screenshot({ path: B.OUT + '/sim-phone.png' });
    ok('no errors (phone)', !errors.length, errors);
    await browser.close();

    title('Embedded like in Google Sites');
    ({ browser, page, errors } = await B.launch());
    const frame = await B.embed(page, 'sorting');
    await B.openSection(frame, 'sorting', 2);
    await click(frame, '.gf-simbtn');
    await click(frame, '.gf-pb[data-push="reset"]');
    await click(frame, '.gf-pb[data-push="start"]');
    await click(frame, '.gf-sw[data-in="inici"]');
    s = await state(frame);
    ok('works inside the iframe', /GC 23/.test(s.steps) && /GP 1/.test(s.steps), s.steps);
    ok('no errors (iframe)', !errors.length, errors);
  } catch (e) {
    ok('test ran to the end', false, String(e));
  }
  await browser.close();
  B.stop();
  done();
})();
