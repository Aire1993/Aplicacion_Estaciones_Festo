// Sorting (MA3B3): Grafcet scenarios (IEC 60848 evolution).
// Runs on the simulation engine of index.html (the one the page uses), with the actuators moved by hand.
const { grafcets } = require('./lib/page');
const { scenarios } = require('./lib/scenario');
const { done } = require('./lib/check');

const run = scenarios(grafcets().GRAFCET_SORTING, 'MA3');
const reset = [['RESET', { reset: 1 }, ['GC{22}', 'GP{0}', 'out[llumStart]']], ['', { reset: 0 }]];
const toDetection = [
  ['piece at the start', { inici: 1 }, ['GP{1}', 'out[cinta]']],
  ['piece leaves the start', { inici: 0 }, ['GP{1}']],
  ['piece at the stopper', { peca: 1 }, ['GP{2}', 'out[cinta]']],
];
run('MAN single cycle, red piece', [
  ['initial', {}, ['GS{100}', 'GC{20}', 'GP{0}', 'out[llumReset]']],
  ...reset,
  ['START', { start: 1 }, ['GC{23}', 'GP{0}', 'out[]']], ['', { start: 0 }],
  ...toDetection,
  ['reflex sensor on', { noNegra: 1 }, ['GP{2}']],
  ['0.4 s: still reading', {}, ['GP{2}'], 0.4],
  ['0.5 s: red -> deflector 1, stopper retracts', {}, ['GP{3}', 'out[cinta,desviador1,topall]'], 0.1],
  ['piece leaves the detection', { peca: 0, noNegra: 0 }, ['GP{3}']],
  ['piece passes the chute sensor before the deflector is out: waits', { rampa: 1 }, ['GP{3}']],
  ['', { rampa: 0 }],
  ['deflector 1 out', { desv1: 1 }, ['GP{3}']],
  ['piece falls into chute 1 -> MAN: preparada', { rampa: 1 }, ['GC{22}', 'GP{6}', 'out[]']],
  ['piece slid down', { rampa: 0 }, ['GC{22}', 'GP{0}', 'out[llumStart]']],
  ['deflector back', { desv1: 0 }],
]);
run('AUTO: metal then black, continuous', [
  ...reset, ['AUTO', { man: 0 }], ['START', { start: 1 }, ['GC{23}']], ['', { start: 0 }],
  ...toDetection,
  ['reflex and inductive', { noNegra: 1, metall: 1 }, ['GP{2}']],
  ['0.5 s: metal -> deflector 2', {}, ['GP{4}', 'out[cinta,desviador2,topall]'], 0.5],
  ['piece leaves', { peca: 0, noNegra: 0, metall: 0 }],
  ['deflector 2 out', { desv2: 1 }, ['GP{4}']],
  ['piece at chute 2 -> converges to 6', { rampa: 1 }, ['GC{23}', 'GP{6}', 'out[]']],
  ['slid down', { rampa: 0, desv2: 0 }, ['GC{23}', 'GP{0}', 'out[]']],
  ...toDetection,
  ['0.5 s with no reflex: black', {}, ['GP{5}', 'out[cinta,topall]'], 0.5],
  ['piece leaves', { peca: 0 }],
  ['piece at chute 3 -> 6', { rampa: 1 }, ['GP{6}']],
  ['slid down', { rampa: 0 }, ['GC{23}', 'GP{0}']],
]);
run('Short pulses on the chute sensor do not light the lamp', [
  ...reset,
  ['pulse 0.6 s', { rampa: 1 }, ['out[llumStart]']], ['', { rampa: 0 }, ['GC{22}', 'out[llumStart]'], 0.6],
  ['pulse 0.9 s', { rampa: 1 }, []], ['', { rampa: 0 }, ['GC{22}', 'out[llumStart]'], 0.9],
]);
run('Chute full at the end of a cycle: lamp, station stops, RESET needed', [
  ...reset, ['AUTO', { man: 0 }], ['START', { start: 1 }, ['GC{23}']], ['', { start: 0 }],
  ...toDetection,
  ['0.5 s: black', {}, ['GP{5}'], 0.5], ['piece leaves', { peca: 0 }],
  ['piece stays in front of the chute sensor', { rampa: 1 }, ['GP{6}', 'out[]']],
  ['0.9 s', {}, ['GP{6}', 'out[]'], 0.9],
  ['1 s: back to 0, lamp on, not initialised', {}, ['GC{20}', 'GP{0}', 'out[llumPlena]'], 0.1],
  ['next piece at the start does not start', { inici: 1 }, ['GC{20}', 'GP{0}']],
  ['key to MAN', { man: 1 }, ['out[llumPlena,llumReset]']],
  ['RESET with chute still full', { reset: 1 }, ['GC{21}', 'out[llumPlena,llumReset]']], ['', { reset: 0 }],
  ['chute emptied: lamp off, piece still at the start', { rampa: 0 }, ['GC{21}', 'out[llumReset]']],
  ['piece removed from the start', { inici: 0 }, ['GC{22}', 'GP{0}', 'out[llumStart]']],
]);
run('Chute full while preparada', [
  ...reset,
  ['pieces fill the chute', { rampa: 1 }, ['GC{22}']],
  ['1 s: not initialised', {}, ['GC{20}', 'out[llumPlena,llumReset]'], 1],
  ['emptied: lamp off', { rampa: 0 }, ['GC{20}', 'out[llumReset]']],
]);
run('STOP held 3 s while sorting', [
  ...reset, ['START', { start: 1 }, ['GC{23}']], ['', { start: 0 }],
  ...toDetection, ['0.5 s: red', { noNegra: 1 }, ['GP{2}']], ['', {}, ['GP{3}'], 0.5],
  ['STOP pressed', { stop: 0 }, ['GS{100}', 'GC{22}', 'GP{3}']],
  ['held 3 s', {}, ['GS{101}', 'GC{20}', 'GP{}', 'out[llumReset]'], 3],
  ['released', { stop: 1 }, ['GS{100}', 'GC{20}', 'GP{}']],
  ['RESET with the piece still at the detection: reset ends (start of the conveyor free)', { reset: 1 }, ['GC{22}', 'GP{0}']],
]);
run('E-stop', [
  ...reset, ['START', { start: 1 }, ['GC{23}']], ['', { start: 0 }],
  ['piece at the start', { inici: 1 }, ['GP{1}']],
  ['E-stop', { seta: 0 }, ['GS{101}', 'GC{20}', 'GP{}', 'out[llumReset]']],
  ['released', { seta: 1 }, ['GS{100}', 'GC{20}']],
  ['RESET with the piece at the start: waits', { reset: 1 }, ['GC{21}']], ['', { reset: 0 }],
  ['piece removed', { inici: 0 }, ['GC{22}', 'GP{0}']],
]);
done();
