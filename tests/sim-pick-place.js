// Pick and Place (MA2B3): Grafcet scenarios (IEC 60848 evolution).
// Runs on the simulation engine of index.html (the one the page uses), with the actuators moved by hand.
const { grafcets } = require('./lib/page');
const { scenarios } = require('./lib/scenario');
const { done } = require('./lib/check');

const run = scenarios(grafcets().GRAFCET_PICK_PLACE, 'MA2');
const reset = [['RESET', { reset: 1 }, ['GC{22}', 'GP{0}', 'out[llumStart]']], ['', { reset: 0 }]];
const toSeparator = [
  ['housing at the start', { inici: 1 }, ['GP{1}', 'out[cinta,separador]']],
  ['housing leaves the start', { inici: 0 }, ['GP{1}']],
  ['housing at the separator', { mig: 1 }, ['GP{1}', 'out[cinta,separador]']],
  ['0.4 s: conveyor still running', {}, ['GP{1}'], 0.4],
  ['0.5 s: conveyor stops, cup goes down with vacuum', {}, ['GP{2}', 'out[baixarVentosa,buit,separador]'], 0.1],
  ['cup leaves the top', { ventosaDalt: 0 }, ['GP{2}']],
];
const placeAndFinish = [
  ['cup up', { ventosaDalt: 1 }, ['GP{4}', 'out[avancarCarro,buit,separador]']],
  ['slide leaves home', { carroRecollit: 0 }, ['GP{4}']],
  ['slide extended', { carroAvancat: 1 }, ['GP{5}', 'out[baixarVentosa,buit,separador]']],
  ['cup leaves the top', { ventosaDalt: 0 }, ['GP{5}']],
  ['0.9 s', {}, ['GP{5}'], 0.9],
  ['1 s: vacuum off, cup up', {}, ['GP{6}', 'out[separador]'], 0.1],
  ['insert released', { agafada: 0 }, ['GP{6}']],
  ['cup up', { ventosaDalt: 1 }, ['GP{7}', 'out[recollirCarro,separador]']],
  ['slide leaves the conveyor', { carroAvancat: 0 }, ['GP{7}']],
  ['slide home', { carroRecollit: 1 }, ['GP{8}', 'out[cinta]']],
  ['housing leaves the separator', { mig: 0 }, ['GP{8}']],
  ['piece at the end', { final: 0 }, ['GP{9}', 'out[]']],
];
run('Power-up in MAN, reset and single cycle', [
  ['initial', {}, ['GS{100}', 'GC{20}', 'GP{0}', 'out[llumReset]']],
  ...reset,
  ['START', { start: 1 }, ['GC{23}', 'GP{0}', 'out[]']], ['', { start: 0 }],
  ...toSeparator,
  ['insert picked at 0.5 s: not yet', { agafada: 1 }, ['GP{2}'], 0.5],
  ['1.2 s: cup goes up with the insert', {}, ['GP{3}', 'out[buit,separador]'], 0.7],
  ...placeAndFinish,
  ['piece removed -> preparada', { final: 1 }, ['GC{22}', 'GP{0}', 'out[llumStart]']],
]);
run('Picked just before 3 s goes on, not to the error step', [
  ...reset, ['AUTO', { man: 0 }], ['START', { start: 1 }, ['GC{23}']], ['', { start: 0 }],
  ...toSeparator,
  ['2.9 s without insert', {}, ['GP{2}'], 2.9],
  ['picked at 2.9 s', { agafada: 1 }, ['GP{3}', '!GP{10}']],
  ...placeAndFinish,
  ['piece removed -> waits for the next housing', { final: 1 }, ['GC{23}', 'GP{0}', 'out[]']],
  ['next housing -> next cycle', { inici: 1 }, ['GP{1}', 'out[cinta,separador]']],
]);
run('Pick error in AUTO: ERROR lamp, cup stays down, needs RESET', [
  ...reset, ['AUTO', { man: 0 }], ['START', { start: 1 }, ['GC{23}']], ['', { start: 0 }],
  ...toSeparator,
  ['2.9 s', {}, ['GP{2}'], 2.9],
  ['3 s without insert -> error', {}, ['GC{20}', 'GP{10}', 'out[baixarVentosa,llumError]'], 0.1],
  ['START ignored', { start: 1 }, ['GC{20}', 'GP{10}']], ['', { start: 0 }],
  ['RESET in AUTO ignored', { reset: 1 }, ['GC{20}', 'GP{10}']], ['', { reset: 0 }],
  ['key to MAN: RESET lamp', { man: 1 }, ['out[baixarVentosa,llumError,llumReset]']],
  ['RESET with the housing still on the conveyor', { reset: 1 }, ['GC{21}', 'GP{0}', 'out[llumReset]']], ['', { reset: 0 }],
  ['cup up -> slide retract order (already home)', { ventosaDalt: 1 }, ['GC{21}', 'out[llumReset,recollirCarro]']],
  ['housing removed -> preparada', { mig: 0 }, ['GC{22}', 'GP{0}', 'out[llumStart]']],
]);
run('Pick error after a short STOP (GC at 22)', [
  ...reset, ['AUTO', { man: 0 }], ['START', { start: 1 }, ['GC{23}']], ['', { start: 0 }],
  ['housing at the start', { inici: 1 }, ['GP{1}']],
  ['short STOP', { stop: 0 }, ['GC{22}', 'GP{1}']], ['released', { stop: 1 }, ['GS{100}', 'GC{22}'], 0.3],
  ['housing at the separator', { inici: 0, mig: 1 }],
  ['0.5 s', {}, ['GP{2}'], 0.5], ['cup down', { ventosaDalt: 0 }],
  ['3 s without insert -> error from 22', {}, ['GC{20}', 'GP{10}', 'out[baixarVentosa,llumError]'], 3],
]);
run('STOP held 3 s while carrying the insert', [
  ...reset, ['START', { start: 1 }, ['GC{23}']], ['', { start: 0 }],
  ...toSeparator,
  ['picked', { agafada: 1 }], ['1.2 s', {}, ['GP{3}'], 1.2],
  ['cup up', { ventosaDalt: 1 }, ['GP{4}']], ['slide extended', { carroRecollit: 0, carroAvancat: 1 }, ['GP{5}']],
  ['STOP pressed', { stop: 0 }, ['GS{100}', 'GC{22}', 'GP{5}']],
  ['held 3 s -> everything off (MAN: RESET lamp)', {}, ['GS{101}', 'GC{20}', 'GP{}', 'out[llumReset]'], 3],
  ['STOP released', { stop: 1 }, ['GS{100}', 'GC{20}', 'GP{}', 'out[llumReset]']],
  ['insert dropped', { agafada: 0 }],
  ['RESET: cup is up, slide goes home', { reset: 1 }, ['GC{21}', 'GP{0}', 'out[llumReset,recollirCarro]']], ['', { reset: 0 }],
  ['slide home, housing still at the separator', { carroAvancat: 0, carroRecollit: 1 }, ['GC{21}']],
  ['housing removed', { mig: 0 }, ['GC{22}', 'out[llumStart]']],
]);
run('Reset waits for the cup before retracting the slide', [
  ['RESET', { reset: 1 }, ['GC{21}', 'out[llumReset]']], ['', { reset: 0 }],
  ['cup up', { ventosaDalt: 1 }, ['GC{21}', 'out[llumReset,recollirCarro]']],
  ['slide home', { carroAvancat: 0, carroRecollit: 1 }, ['GC{22}', 'out[llumStart]']],
], { ventosaDalt: 0, carroRecollit: 0, carroAvancat: 1 });
run('E-stop', [
  ...reset, ['START', { start: 1 }, ['GC{23}']], ['', { start: 0 }],
  ['housing at the start', { inici: 1 }, ['GP{1}']],
  ['E-stop', { seta: 0 }, ['GS{101}', 'GC{20}', 'GP{}', 'out[llumReset]']],
  ['released', { seta: 1 }, ['GS{100}', 'GC{20}']],
  ['housing removed', { inici: 0 }],
  ['RESET', { reset: 1 }, ['GC{22}', 'GP{0}']],
]);
done();
