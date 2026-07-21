'use strict';
/**
 * Layout ritratti — busti COMPLETI (faccia+capelli già uniti), chromakey #00C878.
 * Nessun overlay capelli separato.
 */
window.PORTRAIT_LAYOUT = {
  cols: 4,
  rows: 4,
  cellW: 128,
  cellH: 160,
  atlasPath: 'sprites/portraits.png',
  view: {
    pad: 0.02,
    centerYFrac: 0.52,
    scaleMul: 1.0
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
    // Busti completi (capelli già attaccati)
    heads: Array.from({ length: 12 }, (_, i) =>
      'sprites/faces/busts/bust_' + String(i).padStart(2, '0') + '.png'),
    hair: [null],
    accessories: [null]
  }
};
