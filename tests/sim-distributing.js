// Distributing Conveyor (MA1B3): Grafcet scenarios (IEC 60848 evolution).
// Runs on the simulation engine of index.html (the one the page uses), with the actuators moved by hand.
const { grafcets } = require('./lib/page');
const { scenarios } = require('./lib/scenario');
const { done } = require('./lib/check');

const run = scenarios(grafcets().GRAFCET_DISTRIBUTING, 'MA1');
const cycleToEnd = [
  ['slide advanced', { recollit: 0, avancat: 1 }, ['GP{2}']],
  ['slide retracted', { avancat: 0, recollit: 1 }, ['GP{3}', 'cinta']],
  ['piece at end', { final: 0 }, ['GP{4}']],
];
run('Power-up in MAN: steady RESET lamp, single cycle', [
  ['initial', {}, ['GS{100}', 'GC{20}', 'GP{0}', 'out[llumReset]']],
  ['RESET pressed (MAN)', { reset: 1 }, ['GC{22}', 'GP{0}', 'out[llumStart]']],
  ['RESET released', { reset: 0 }, ['GC{22}']],
  ['START pressed', { start: 1 }, ['GC{23}', 'GP{1}', 'out[expulsor]']],
  ['START released', { start: 0 }, ['GP{1}']],
  ...cycleToEnd,
  ['piece removed', { final: 1 }, ['GC{22}', 'GP{0}', 'out[llumStart]']],
]);
run('RESET in AUTO is ignored, no RESET lamp', [
  ['initial (AUTO)', {}, ['GC{20}', 'out[]']],
  ['RESET pressed in AUTO', { reset: 1 }, ['GC{20}', 'out[]']], ['', { reset: 0 }, ['GC{20}']],
  ['key to MAN: lamp on', { man: 1 }, ['GC{20}', 'out[llumReset]']],
  ['RESET in MAN', { reset: 1 }, ['GC{22}', 'out[llumStart]']], ['', { reset: 0 }],
], { man: 0 });
run('Reset waits for empty conveyor and loaded magazine', [
  ['RESET with piece mid-conveyor and empty magazine', { reset: 1 }, ['GC{21}', 'out[llumBuit,llumReset]']], ['', { reset: 0 }, ['GC{21}']],
  ['piece removed', { mig: 0 }, ['GC{21}']],
  ['magazine loaded', { buit: 0 }, ['GC{22}', 'out[llumStart]']],
], { mig: 1, buit: 1 });
run('AUTO continuous, short STOP finishes the cycle', [
  ['RESET', { reset: 1 }], ['', { reset: 0 }],
  ['AUTO selected', { man: 0 }, ['GC{22}', 'out[llumStart]']],
  ['START', { start: 1 }, ['GC{23}', 'GP{1}']], ['', { start: 0 }],
  ...cycleToEnd,
  ['removed -> next cycle starts', { final: 1 }, ['GC{23}', 'GP{1}', 'out[expulsor]']],
  ['slide advanced', { recollit: 0, avancat: 1 }, ['GP{2}']],
  ['short STOP pressed', { stop: 0 }, ['GS{100}', 'GC{22}', 'GP{2}', 'out[]']],
  ['STOP released after 0.5 s', { stop: 1 }, ['GS{100}', 'GC{22}', 'GP{2}'], 0.5],
  ['slide retracted -> cycle continues', { avancat: 0, recollit: 1 }, ['GP{3}', 'out[cinta]']],
  ['START while cycle still running: ignored', { start: 1 }, ['GC{22}', 'GP{3}']], ['', { start: 0 }],
  ['piece at end', { final: 0 }, ['GP{4}']],
  ['piece removed -> stops, START lamp on', { final: 1 }, ['GC{22}', 'GP{0}', 'out[llumStart]']],
  ['START again (no RESET needed)', { start: 1 }, ['GC{23}', 'GP{1}']], ['', { start: 0 }],
], {});
run('STOP held 3 s = full reset', [
  ['RESET', { reset: 1 }], ['', { reset: 0 }], ['AUTO', { man: 0 }],
  ['START', { start: 1 }, ['GP{1}']], ['', { start: 0 }],
  ['slide advanced', { recollit: 0, avancat: 1 }], ['slide retracted', { avancat: 0, recollit: 1 }, ['GP{3}']],
  ['STOP pressed', { stop: 0 }, ['GS{100}', 'GC{22}', 'GP{3}']],
  ['still held at 2.5 s', {}, ['GS{100}', 'GP{3}'], 2.5],
  ['held 3 s', {}, ['GS{101}', 'GC{20}', 'GP{}', 'out[]'], 0.5],
  ['STOP released', { stop: 1 }, ['GS{100}', 'GC{20}', 'GP{}', 'out[]']],
  ['START ignored (needs RESET)', { start: 1 }, ['GC{20}', 'GP{}']], ['', { start: 0 }],
  ['RESET in AUTO ignored', { reset: 1 }, ['GC{20}']], ['', { reset: 0 }],
  ['key to MAN', { man: 1 }, ['out[llumReset]']],
  ['piece removed by hand', { final: 1 }],
  ['RESET in MAN', { reset: 1 }, ['GC{22}', 'GP{0}', 'out[llumStart]']], ['', { reset: 0 }],
], { man: 1 });
run('Two short STOP presses do not add up to 3 s', [
  ['RESET', { reset: 1 }], ['', { reset: 0 }],
  ['STOP 2 s', { stop: 0 }, ['GS{100}']], ['release', { stop: 1 }, ['GS{100}'], 2],
  ['STOP again 2 s', { stop: 0 }, ['GS{100}'], 0.2], ['release', { stop: 1 }, ['GS{100}', 'GC{22}'], 2],
]);
run('E-stop', [
  ['RESET', { reset: 1 }], ['', { reset: 0 }],
  ['START', { start: 1 }, ['GP{1}']], ['', { start: 0 }],
  ['E-stop', { seta: 0 }, ['GS{101}', 'GC{20}', 'GP{}', 'out[llumReset]']],
  ['E-stop released', { seta: 1 }, ['GS{100}', 'GC{20}']],
  ['slide back home', { avancat: 0, recollit: 1 }],
  ['RESET', { reset: 1 }, ['GC{22}', 'GP{0}']], ['', { reset: 0 }],
]);
run('Magazine empty: lamp follows the sensor everywhere, no START needed', [
  ['empty at power-up: lamp on', {}, ['GC{20}', 'out[llumBuit,llumReset]']],
  ['RESET waits for the magazine, lamp still on', { reset: 1 }, ['GC{21}', 'out[llumBuit,llumReset]']], ['', { reset: 0 }],
  ['refilled: lamp off, reset finishes', { buit: 0 }, ['GC{22}', 'out[llumStart]']],
  ['AUTO', { man: 0 }],
  ['START', { start: 1 }, ['GC{23}', 'GP{1}']], ['', { start: 0 }],
  ['last piece pushed out: lamp on during the cycle', { buit: 1 }, ['GP{1}', 'out[expulsor,llumBuit]']],
  ['slide advanced', { recollit: 0, avancat: 1 }], ['slide retracted', { avancat: 0, recollit: 1 }, ['GP{3}']],
  ['piece at end', { final: 0 }, ['GP{4}']],
  ['piece removed: waits at 0 with the lamp on', { final: 1 }, ['GC{23}', 'GP{0}', 'out[llumBuit]']],
  ['refilled -> lamp off, cycle starts without START', { buit: 0 }, ['GP{1}', 'out[expulsor]']],
  ['E-stop with empty magazine: lamp still on', { seta: 0, buit: 1 }, ['GS{101}', 'GC{20}', 'GP{}', 'llumBuit']],
], { buit: 1 });
run('START pressed while STOP is held does not start', [
  ['RESET', { reset: 1 }], ['', { reset: 0 }], ['AUTO', { man: 0 }],
  ['STOP held', { stop: 0 }, ['GC{22}']],
  ['START pressed', { start: 1 }, ['GC{22}', 'GP{0}', 'out[llumStart]'], 1], ['', { start: 0 }],
  ['STOP released, START again', { stop: 1 }, ['GC{22}']], ['START', { start: 1 }, ['GC{23}', 'GP{1}']],
]);
run('START and RESET act when pressed (rising edge), not while held', [
  ['RESET pressed and held', { reset: 1 }, ['GC{22}']],
  ['START pressed and held', { start: 1 }, ['GC{23}', 'GP{1}']],
  ...cycleToEnd,
  ['piece removed with START still held: no new cycle (MAN)', { final: 1 }, ['GC{22}', 'GP{0}', 'out[llumStart]']],
  ['START released', { start: 0 }, ['GC{22}']],
  ['STOP held', { stop: 0 }, ['GC{22}']],
  ['START pressed while STOP is held', { start: 1 }, ['GC{22}']],
  ['STOP released, START still held: does not start', { stop: 1 }, ['GC{22}', 'GP{0}']],
  ['START released', { start: 0 }, ['GC{22}']],
  ['START pressed again: starts', { start: 1 }, ['GC{23}', 'GP{1}']],
  ['E-stop (RESET still held from the beginning)', { start: 0, seta: 0 }, ['GS{101}', 'GC{20}']],
  ['E-stop released with RESET still held: no reset', { seta: 1 }, ['GS{100}', 'GC{20}']],
  ['RESET released', { reset: 0 }, ['GC{20}']],
  ['RESET pressed again: reset', { reset: 1 }, ['GC{22}']],
]);
done();
