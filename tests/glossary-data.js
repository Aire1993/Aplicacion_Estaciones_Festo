// Checks the glossary data: unique ids and words, known topics, complete definitions.
const { glossary } = require('./lib/page');
const { title, ok, done } = require('./lib/check');

const { GLOSSARY, GLOSSARY_CATS } = glossary();
title('Glossary');
const cats = new Set(GLOSSARY_CATS.map(c => c.key));
const ids = new Set(), words = new Map(), problems = [];
for (const g of GLOSSARY) {
  if (ids.has(g.id)) problems.push('duplicate id ' + g.id);
  ids.add(g.id);
  if (!/^[A-Za-z0-9]+$/.test(g.id)) problems.push(`${g.id}: id must be letters and digits (it goes in the link)`);
  if (!cats.has(g.cat)) problems.push(`${g.id}: unknown topic ${g.cat}`);
  if (!g.term || !g.def) problems.push(`${g.id}: without term or definition`);
  if (g.def && !/[.!?]$/.test(g.def)) problems.push(`${g.id}: definition without a final full stop`);
  if (g.mark === false) continue;
  for (const w of (g.words || [g.term]).concat(g.also || [])) {
    const k = w.toLowerCase();
    if (words.has(k) && words.get(k) !== g.id) problems.push(`"${w}" belongs to ${words.get(k)} and ${g.id}`);
    words.set(k, g.id);
  }
}
ok(`${GLOSSARY.length} terms in ${cats.size} topics`, GLOSSARY.length > 40 && cats.size === 5);
ok('data is consistent', !problems.length, problems.length ? problems : undefined);
ok('every topic has terms', GLOSSARY_CATS.every(c => GLOSSARY.some(g => g.cat === c.key)));
done();
