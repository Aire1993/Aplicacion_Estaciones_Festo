// Runs Grafcet scenarios on the page's own simulation engine (gfSimCreate in index.html).
// A step is [label, input changes, expected strings, seconds to wait before the changes].
// The state reads like "GS{100} GC{22} GP{0} out[cinta,llumStart]"; an expected string that starts with
// "!" must not appear.
const { engine } = require('./page');
const { title, ok } = require('./check');

const E = engine();

function show(G, s) {
  const outs = Object.keys(s.outputs()).sort().join(',');
  return G.charts.map(ch => ch.key + '{' + s.sit[ch.key].join(',') + '}').join(' ') + ' out[' + outs + ']';
}

// auto: actuators move by themselves (data.motions), as in the page.
function scenarios(G, name) {
  return function run(label, steps, init, auto) {
    title(name + ': ' + label);
    const s = E.gfSimCreate(G, !!auto);
    if (init) s.set(init);
    console.log('  init: ' + show(G, s));
    for (const [what, changes, expect, dt] of steps) {
      if (dt) s.tick(dt);
      if (changes) s.set(changes);
      const got = show(G, s);
      const pass = !expect || expect.every(e => e.startsWith('!') ? !got.includes(e.slice(1)) : got.includes(e));
      ok(what || '(release)', pass, got + (pass ? '' : '   expected ' + expect.join(' ')));
    }
    return s;
  };
}

module.exports = { scenarios, show, E };
