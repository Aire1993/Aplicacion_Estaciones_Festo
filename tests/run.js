// Runs the tests one after the other and sums up.
//   node tests/run.js        all of them
//   node tests/run.js sim    only the ones without a browser (Grafcet data and simulation)
const { spawnSync } = require('child_process');
const path = require('path');

const NODE_ONLY = ['grafcet-data.js', 'glossary-data.js', 'sim-distributing.js', 'sim-pick-place.js', 'sim-sorting.js', 'sim-motions.js'];
const BROWSER = ['web-smoke.js', 'web-grafcet.js', 'web-simulator.js', 'web-glossary.js', 'web-pdf.js'];
const files = process.argv[2] === 'sim' ? NODE_ONLY : NODE_ONLY.concat(BROWSER);
const verbose = process.argv.includes('-v');

const summary = [];
for (const f of files) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [path.join(__dirname, f)], { encoding: 'utf8', timeout: 10 * 60 * 1000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const count = (out.match(/^(\d+\/\d+) ok/m) || [])[1] || '?';
  const pass = r.status === 0;
  summary.push(pass);
  if (verbose || !pass) console.log(out);
  console.log(`${pass ? 'ok ' : 'BAD'} ${f.padEnd(22)} ${count.padStart(7)}  ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
const bad = summary.filter(p => !p).length;
console.log(bad ? `\n${bad} file(s) with failures` : '\nAll tests pass');
process.exitCode = bad ? 1 : 0;
