// Checks the Grafcet data of the three stations: names, steps, transitions, actions, forcing orders,
// conditions that parse, and the actuator motions used by the simulator.
const { grafcets, engine } = require('./lib/page');
const { title, ok, done } = require('./lib/check');

const E = engine();
const all = grafcets();

for (const [name, G] of Object.entries(all)) {
  title(name);
  const problems = [];
  const stepChart = new Map();
  for (const ch of G.charts) {
    if (!ch.steps.some(s => s.init)) problems.push(`${ch.key} without an initial step`);
    for (const s of ch.steps) {
      if (stepChart.has(s.n)) problems.push('duplicate step ' + s.n);
      stepChart.set(s.n, ch.key);
      if (!s.name) problems.push(`step ${s.n} without name`);
    }
  }
  const used = new Set();
  function checkCond(c, where) {
    const tokens = E.gfTokens(c);
    if (tokens.join('') !== c.replace(/\s+/g, '')) problems.push(`${where}: characters not understood in "${c}"`);
    try { E.gfSimParse(c); } catch (e) { problems.push(`${where}: does not parse "${c}"`); }
    for (const id of tokens.filter(t => /^[A-Za-z_]/.test(t))) {
      if (/^X\d+$/.test(id)) { if (!stepChart.has(+id.slice(1))) problems.push(`${where}: unknown step ${id}`); }
      else if (!G.vars[id]) problems.push(`${where}: unknown signal ${id}`);
      else used.add(id);
    }
  }
  for (const ch of G.charts) {
    for (const t of ch.trans) {
      const where = `${ch.key} ${t.from}->${t.to}`;
      if (stepChart.get(t.from) !== ch.key || stepChart.get(t.to) !== ch.key) problems.push(`${where}: step outside the chart`);
      if (!t.fn) problems.push(`${where}: without fn (functional text)`);
      checkCond(t.c, where);
    }
    for (const s of ch.steps) for (const a of s.act || []) {
      const where = `${ch.key} step ${s.n}`;
      if (a.force) {
        const target = G.charts.find(c => c.key === a.force);
        if (!target) problems.push(`${where}: forcing of unknown chart ${a.force}`);
        else if (G.charts.indexOf(target) <= G.charts.indexOf(ch)) problems.push(`${where}: forces a chart that is not below it`);
        else if (a.to && a.to !== 'INIT' && a.to.split(',').some(n => stepChart.get(+n) !== a.force)) problems.push(`${where}: forcing to a step outside ${a.force}`);
        continue;
      }
      if (!G.vars[a.v]) { problems.push(`${where}: unknown output ${a.v}`); continue; }
      used.add(a.v);
      if (!G.vars[a.v].fn) problems.push(`${where}: output ${a.v} without fn`);
      if (!/^Q/.test(G.vars[a.v].plc)) problems.push(`${where}: action on ${a.v}, which is not an output`);
      if (a.cond) { checkCond(a.cond, where + ' (action condition)'); if (!a.condFn) problems.push(`${where}: condition without condFn`); }
    }
  }
  for (const [k, v] of Object.entries(G.vars)) {
    if (!v.plc || !v.tag || !v.desc) problems.push(`signal ${k} without plc, tag or desc`);
    if (v.rest !== undefined && !/^I/.test(v.plc)) problems.push(`rest value on ${k}, which is not an input`);
  }
  for (const m of G.motions || []) {
    if (!G.vars[m.out] || !/^Q/.test(G.vars[m.out].plc)) problems.push(`motion of unknown output ${m.out}`);
    for (const k of Object.keys(Object.assign({}, m.start, m.end))) {
      if (!G.vars[k] || !/^I/.test(G.vars[k].plc)) problems.push(`motion moves ${k}, which is not an input`);
    }
  }
  const unused = Object.keys(G.vars).filter(k => !used.has(k));
  ok('data is consistent', !problems.length, problems.length ? problems : undefined);
  ok('every signal is used', !unused.length, unused.length ? unused : undefined);
  ok('three charts GS, GC, GP', G.charts.map(c => c.key).join() === 'GS,GC,GP');
}
done();
