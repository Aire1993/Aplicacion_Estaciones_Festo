// Browser tests: serves the repository and opens it with Playwright (Chromium).
// - APP: the page itself (http://127.0.0.1:PORT/index.html).
// - embed(): a page on another origin that embeds it in an iframe, like Google Sites.
// Nothing goes to the Internet: Google Drive answers with placeholders, the Google sheet of the
// I/O table fails (the page uses its own copy) and every other external request is blocked.
const http = require('http');
const fs = require('fs');
const path = require('path');

let PW;
try { PW = require('playwright'); } catch (e) {
  throw new Error('Playwright is missing: run "npm install" and "npx playwright install chromium" (see README).');
}

const ROOT = path.join(__dirname, '..', '..');
const PORT = +(process.env.TEST_PORT || 8170);
const APP = `http://127.0.0.1:${PORT}/index.html`;
const OUTER = `http://localhost:${PORT + 1}/`;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
// Google Sites gives the embedded page these permissions (no downloads: they go through a new tab).
const SITES_SANDBOX = 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms';
const IMAGE = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#c9d3dc"/></svg>');

let servers = [];
function start() {
  if (servers.length) return Promise.resolve();
  const app = http.createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.join(ROOT, p === '/' ? 'index.html' : p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  const outer = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    const sb = u.searchParams.get('sandbox');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><html><body style="margin:0">
      <div style="height:200px;background:#eee">Google Sites (simulated)</div>
      <iframe id="embed" ${sb === null ? '' : `sandbox="${sb}"`} src="${APP}${u.searchParams.get('hash') ? '#' + u.searchParams.get('hash') : ''}"
        style="width:100%;height:${+(u.searchParams.get('h') || 2400)}px;border:0;display:block"></iframe>
      <div style="height:1200px;background:#ddd"></div></body></html>`);
  });
  return Promise.all([
    new Promise(r => app.listen(PORT, '127.0.0.1', r)),
    new Promise(r => outer.listen(PORT + 1, '127.0.0.1', r)),
  ]).then(() => { servers = [app, outer]; });
}

async function launch(opts = {}) {
  await start();
  const browser = await PW.chromium.launch();
  const context = await browser.newContext({
    viewport: opts.viewport || { width: 1280, height: 900 },
    isMobile: !!opts.isMobile,
    hasTouch: !!opts.hasTouch,
    acceptDownloads: true,
  });
  await context.route(url => !/^http:\/\/(127\.0\.0\.1|localhost):/.test(url.href), route => {
    const url = route.request().url();
    if (/drive\.google\.com\/thumbnail|googleusercontent\.com/.test(url)) return route.fulfill({ contentType: 'image/svg+xml', body: IMAGE });
    if (/drive\.google\.com\/file\/d\/[^/]+\/preview/.test(url)) return route.fulfill({ contentType: 'text/html', body: '<p>Drive preview</p>' });
    return route.abort();
  });
  const page = await context.newPage();
  const errors = [];
  const watch = p => {
    p.on('pageerror', e => errors.push(String(e)));
    p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR_FAILED/.test(m.text())) errors.push(m.text()); });
  };
  watch(page);
  context.on('page', watch);
  return { browser, context, page, errors };
}

// Opens the page embedded like in Google Sites and returns the frame of the page.
async function embed(page, hash, sandbox = SITES_SANDBOX, h = 2400) {
  await page.goto(`${OUTER}?h=${h}&hash=${encodeURIComponent(hash)}&sandbox=${encodeURIComponent(sandbox)}`);
  await page.waitForTimeout(1000);
  return page.frames().find(f => f.url().startsWith(APP));
}

// Opens a station and one of its buttons (0 Esquemes, 1 Entrades/Sortides, 2 Grafcet, 3 Components).
async function openSection(target, slug, button) {
  if (target.goto) await target.goto(APP + '#' + slug);
  else await target.evaluate(s => { location.hash = s; }, slug);
  await target.waitForSelector('.btn');
  await target.click(`.btn >> nth=${button}`);
  await target.waitForTimeout(600);
}

function stop() { servers.forEach(s => s.close()); servers = []; }

const OUT = path.join(__dirname, '..', 'out');
fs.mkdirSync(OUT, { recursive: true });

module.exports = { launch, embed, openSection, stop, APP, OUTER, OUT, SITES_SANDBOX, STATIONS: ['distributing-conveyor', 'pick-and-place', 'sorting'] };
