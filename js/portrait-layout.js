'use strict';
/**
 * Layout ritratti — busti COMPLETI (faccia+capelli già uniti).
 * Chromakey sorgente: #5B8FC4 (blu soft, non magenta; non usato in pelle/teal/rame).
 * PNG già processati con alpha posteriore soft.
 */
window.PORTRAIT_LAYOUT = {
  cols: 4,
  rows: 4,
  cellW: 128,
  cellH: 160,
  atlasPath: 'sprites/portraits.png',
  view: {
    pad: 0.01,
    centerYFrac: 0.50,
    scaleMul: 1.12
  },
  overlay: {
    hairScale: 1,
    hairY: 0,
    accScale: 1,
    accY: 0
  },
  hairTints: ['#100808'],
  player: {
    head: 'sprites/faces/player/zvan_complete.png',
    hair: null,
    hairTint: '#c8c8c8',
    name: 'Zvan Marìa',
    complete: true
  },
  parts: {
    heads: Array.from({ length: 12 }, (_, i) =>
      'sprites/faces/busts/bust_' + String(i).padStart(2, '0') + '.png'),
    hair: [null],
    accessories: [null]
  }
};
