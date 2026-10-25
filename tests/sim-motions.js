// Simulator with the actuators moving by themselves (data.motions), as in the page by default:
// only the panel and the workpiece sensors are changed by hand.
const { grafcets } = require('./lib/page');
const { scenarios } = require('./lib/scenario');
const { done } = require('./lib/check');

const G = grafcets();
const AUTO = true;

let run = scenarios(G.GRAFCET_DISTRIBUTING, 'MA1 auto');
run('The ejector moves by itself', [
  ['RESET', { reset: 1 }, ['GC{22}']], ['', { reset: 0 }],
  ['START: ejector forward, retracted sensor off', { start: 1 }, ['GP{1}', 'out[expulsor]']], ['', { start: 0 }],
  ['0.5 s: still moving', null, ['GP{1}'], 0.5],
  ['0.6 s: advanced -> back', null, ['GP{2}', 'out[]'], 0.1],
  ['0.6 s later: retracted -> conveyor', null, ['GP{3}', 'out[cinta]'], 0.6],
  ['piece at the end (by hand)', { final: 0 }, ['GP{4}']],
  ['removed', { final: 1 }, ['GC{22}', 'GP{0}']],
], null, AUTO);

run = scenarios(G.GRAFCET_PICK_PLACE, 'MA2 auto');
run('Cup and slide move by themselves; picking is by hand', [
  ['RESET', { reset: 1 }, ['GC{22}']], ['', { reset: 0 }],
  ['START', { start: 1 }, ['GC{23}']], ['', { start: 0 }],
  ['housing at the start', { inici: 1 }, ['GP{1}']],
  ['housing at the separator', { inici: 0, mig: 1 }, ['GP{1}']],
  ['0.5 s: cup goes down', null, ['GP{2}', 'out[baixarVentosa,buit,separador]'], 0.5],
  ['insert picked (by hand)', { agafada: 1 }, ['GP{2}']],
  ['1.2 s: cup up', null, ['GP{3}'], 1.2],
  ['0.5 s: cup at the top -> slide forward', null, ['GP{4}', 'out[avancarCarro,buit,separador]'], 0.5],
  ['0.8 s: slide forward -> cup down', null, ['GP{5}'], 0.8],
  ['1 s: vacuum off, the vacuum sensor drops', null, ['GP{6}', 'out[separador]'], 1],
  ['0.5 s: cup up -> slide back', null, ['GP{7}', 'out[recollirCarro,separador]'], 0.5],
  ['0.8 s: slide home -> conveyor', null, ['GP{8}', 'out[cinta]'], 0.8],
], null, AUTO);
run('Reset after a pick error: the cup goes up and the slide comes home', [
  ['RESET', { reset: 1 }, ['GC{21}', 'out[llumReset]']], ['', { reset: 0 }],
  ['0.5 s: cup up -> slide back', null, ['GC{21}', 'out[llumReset,recollirCarro]'], 0.5],
  ['0.8 s: slide home -> preparada', null, ['GC{22}', 'out[llumStart]'], 0.8],
], { ventosaDalt: 0, carroRecollit: 0, carroAvancat: 1 }, AUTO);

run = scenarios(G.GRAFCET_SORTING, 'MA3 auto');
run('Deflectors move by themselves', [
  ['RESET', { reset: 1 }, ['GC{22}']], ['', { reset: 0 }],
  ['START', { start: 1 }, ['GC{23}']], ['', { start: 0 }],
  ['piece at the start', { inici: 1 }, ['GP{1}']], ['', { inici: 0 }],
  ['piece at the stopper, red', { peca: 1, noNegra: 1 }, ['GP{2}']],
  ['0.5 s: deflector 1 out', null, ['GP{3}', 'out[cinta,desviador1,topall]'], 0.5],
  ['piece in chute 1 before the deflector is out: waits', { peca: 0, noNegra: 0, rampa: 1 }, ['GP{3}']],
  ['0.3 s: deflector out', null, ['GP{6}'], 0.3],
  ['piece slid down', { rampa: 0 }, ['GC{22}', 'GP{0}']],
  ['0.3 s: deflector back', null, ['GP{0}'], 0.3],
], null, AUTO);
done();
