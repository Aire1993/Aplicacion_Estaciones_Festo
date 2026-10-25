// Loads parts of index.html into Node: the Grafcet data and the simulation engine the page uses.
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', '..', 'index.html');
const source = () => fs.readFileSync(FILE, 'utf8');

function between(html, from, to) {
  const a = html.indexOf(from), b = html.indexOf(to, a);
  if (a < 0 || b < 0) throw new Error('index.html: block not found: ' + from);
  return html.slice(a, b);
}
function line(html, re) {
  const m = html.match(re);
  if (!m) throw new Error('index.html: not found: ' + re);
  return m[0] + '\n';
}

// { GRAFCET_DISTRIBUTING, GRAFCET_PICK_PLACE, GRAFCET_SORTING }: a fresh copy on every call.
function grafcets() {
  const code = between(source(), '  // Senyals del panell, iguals a totes les estacions.', '\n  var STATIONS = [');
  const names = [...code.matchAll(/var (GRAFCET_\w+) = /g)].map(m => m[1]);
  return new Function(code + '; return {' + names.join(',') + '};')();
}

// { GLOSSARY, GLOSSARY_CATS }
function glossary() {
  const code = between(source(), '  var GLOSSARY_CATS = [', '\n  // Botons comuns a totes les estacions.');
  return new Function(code + '; return { GLOSSARY: GLOSSARY, GLOSSARY_CATS: GLOSSARY_CATS };')();
}

// { gfSimCreate, gfSimParse, gfTokens }
function engine() {
  const html = source();
  const code = line(html, /  function gfTokens\(c\) \{[^\n]*\}/) +
    line(html, /  function gfIsStepVar\(id\) \{[^\n]*\}/) +
    between(html, '  // --- Simulació: motor', '  // --- Simulació: panell ---');
  return new Function(code + '; return { gfSimCreate: gfSimCreate, gfSimParse: gfSimParse, gfTokens: gfTokens };')();
}

module.exports = { grafcets, engine, glossary, FILE };
