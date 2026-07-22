'use strict';
/**
 * Layout ritratti — busti COMPLETI (faccia+capelli già uniti).
 * Chromakey sorgente: #5B8FC4 (blu soft, non magenta; non usato in pelle/teal/rame).
 * PNG già processati con alpha posteriore soft.
 *
 * Pool:
 *  - men    00–14 (originali + nuovi)
 *  - women  15–18
 *  - pirate 19–22
 */
window.PORTRAIT_LAYOUT = {
  cols: 4,
  rows: 6,
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
  hairTints: ['#e8e6e2'],
  player: {
    head: 'sprites/faces/player/zvan_complete.png',
    name: 'Zvan Marìa',
    complete: true,
    // Capelli bianchi/argento come in sprites/story/intro/intro_03.jpg (ritratto RADICI)
    hairColor: '#e8e6e2'
  },
  pools: {
    men: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    women: [15, 16, 17, 18],
    pirate: [19, 20, 21, 22]
  },
  /** Nomi tipicamente femminili (IT / dialetto / titoli) → pool women */
  feminineNameRe: /a$|ina$|essa\b|paladina|castellana|serafina|selvaggia|vera\b|tartufa|piadina|copilota|dottore?ssa|ispettrice|notaia|capitana|dama\b|nonna|elsa\b|marina\b|lia\b|morosina\b/i,
  parts: {
    heads: Array.from({ length: 23 }, (_, i) =>
      'sprites/faces/busts/bust_' + String(i).padStart(2, '0') + '.png'),
    hair: [null],
    accessories: [null]
  }
};
