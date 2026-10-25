// Tiny assertion log shared by the tests: ok(label, condition, details) and done() (exit code 1 on failures).
const results = [];
let section = '';

function title(name) {
  section = name;
  console.log('\n## ' + name);
}
function ok(label, cond, details) {
  results.push({ section, label, pass: !!cond });
  console.log(`  ${cond ? 'ok ' : 'BAD'} ${label}${details !== undefined ? ': ' + (typeof details === 'string' ? details : JSON.stringify(details)) : ''}`);
  return !!cond;
}
function done() {
  const bad = results.filter(r => !r.pass);
  console.log(`\n${results.length - bad.length}/${results.length} ok` + (bad.length ? '\nFAILED:\n' + bad.map(r => `  [${r.section}] ${r.label}`).join('\n') : ''));
  process.exitCode = bad.length ? 1 : 0;
}

module.exports = { title, ok, done };
