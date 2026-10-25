// PDF downloads (Grafcet and I/O table) of the three stations: on the page itself, embedded like in
// Google Sites (the PDF opens in a new tab with its download) and with pop-ups not allowed.
const fs = require('fs');
const B = require('./lib/browser');
const { title, ok, done } = require('./lib/check');

// Valid PDF and number of pages.
function pdfInfo(file) {
  const s = fs.readFileSync(file, 'latin1');
  return { pdf: s.startsWith('%PDF-') && /%%EOF\s*$/.test(s), pages: (s.match(/\/Type\s*\/Page\b/g) || []).length };
}
async function download(page, selector, name) {
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 10000 }), page.click(selector)]);
  const file = B.OUT + '/' + name;
  await dl.saveAs(file);
  return Object.assign({ name: dl.suggestedFilename() }, pdfInfo(file));
}

(async () => {
  let { browser, context, page, errors } = await B.launch();
  try {
    for (const slug of B.STATIONS) {
      title(slug + ': on the page');
      await B.openSection(page, slug, 2);
      for (const lv of slug === 'distributing-conveyor' ? ['fn', 'tag', 'plc'] : ['fn']) {
        await page.click(`.gf-level[data-level="${lv}"]`);
        const r = await download(page, '.gf-pdf', `grafcet-${slug}-${lv}.pdf`);
        ok(`Grafcet PDF, level ${lv}`, r.pdf && r.pages >= 5 && /^Grafcet_.*\.pdf$/.test(r.name), r);
      }
      await B.openSection(page, slug, 1);
      await page.waitForSelector('.io-row');
      const r = await download(page, '.io-pdf', `io-${slug}.pdf`);
      ok('I/O table PDF', r.pdf && r.pages >= 1, r);
    }
    ok('no errors', !errors.length, errors);
    await browser.close();

    title('Embedded like in Google Sites');
    ({ browser, context, page, errors } = await B.launch());
    const downloads = [];
    context.on('page', p => p.on('download', d => downloads.push(d)));
    const frame = await B.embed(page, 'pick-and-place');
    await B.openSection(frame, 'pick-and-place', 2);
    const [tab] = await Promise.all([context.waitForEvent('page', { timeout: 5000 }), frame.click('.gf-pdf')]);
    await page.waitForTimeout(1500);
    ok('Grafcet PDF opens in a new tab and downloads', downloads.length === 1 && /\.pdf$/.test(downloads[0].suggestedFilename()), downloads.map(d => d.suggestedFilename()));
    const icon = await tab.evaluate(() => (document.querySelector('link[rel="icon"]') || {}).href || '');
    ok('the new tab has the site icon', icon.startsWith('data:image/svg+xml'), icon.slice(0, 40));
    await tab.close();
    ok('no errors', !errors.length, errors);
    await browser.close();

    title('Embedded without pop-ups');
    ({ browser, context, page, errors } = await B.launch());
    const f2 = await B.embed(page, 'sorting', 'allow-scripts allow-same-origin');
    await B.openSection(f2, 'sorting', 2);
    await f2.click('.gf-pdf');
    await page.waitForTimeout(800);
    const msg = await f2.textContent('.gf-pdf-msg');
    ok('explains how to get the PDF', msg.length > 20, msg);
    // The browser itself reports the blocked pop-up: that is the case being tested.
    const other = errors.filter(e => !/Blocked opening/.test(e));
    ok('no other errors', !other.length, other);
  } catch (e) {
    ok('test ran to the end', false, String(e));
  }
  await browser.close();
  B.stop();
  done();
})();
