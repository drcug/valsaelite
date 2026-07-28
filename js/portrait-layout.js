'use strict';
/**
 * Layout ritratti — busti COMPLETI (faccia+capelli già uniti).
 * Chromakey sorgente: #5B8FC4 (blu soft, non magenta; non usato in pelle/teal/rame).
 * PNG già processati con alpha posteriore soft.
 *
 * Pool:
 *  - men           00–14 + 23–24 + 31–33 + 39–40
 *  - women         15–18 + 25–28 + 34–36
 *  - pirate_men    19, 21, 22, 37
 *  - pirate_women  20, 29, 30, 38
 *  - pirate        unione (fallback)
 */
window.PORTRAIT_LAYOUT = {
  cols: 4,
  rows: 11,
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
  /** Percorsi busti dedicati RADICI (preload anche se RootDialogues arriva dopo) */
  rootPortraits: [
    'sprites/faces/roots/palmira.png',
    'sprites/faces/roots/ornella.png',
    'sprites/faces/roots/lia.png',
    'sprites/faces/roots/dario.png',
    'sprites/faces/roots/serafina.png',
    'sprites/faces/roots/remo.png',
    'sprites/faces/roots/vera.png'
  ],
  player: {
    head: 'sprites/faces/player/zvan_complete.png',
    name: 'Zvan Marìa',
    complete: true,
    // Capelli bianchi/argento come in sprites/story/intro/intro_03.jpg (ritratto RADICI)
    hairColor: '#e8e6e2'
  },
  pools: {
    men: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 23, 24, 31, 32, 33, 39, 40],
    women: [15, 16, 17, 18, 25, 26, 27, 28, 34, 35, 36],
    pirate_men: [19, 21, 22, 37],
    pirate_women: [20, 29, 30, 38],
    pirate: [19, 20, 21, 22, 29, 30, 37, 38]
  },
  /** Nomi tipicamente femminili (IT / dialetto / titoli) → pool women */
  feminineNameRe: /a$|ina$|essa\b|paladina|castellana|serafina|selvaggia|vera\b|tartufa|piadina|copilota|dottore?ssa|ispettrice|notaia|capitana|dama\b|nonna|elsa\b|marina\b|lia\b|palmira\b|zia\b|cugina\b/i,
  /** Eccezioni maschili che finiscono in -a / titoli ambigui */
  masculineNameRe: /\b(mariotto|fausto|pax|old man|sornione|jack|lupo|bardo|scudiero|sir |tenente|agente|corsaro|brigante|pirata della|assessore|direttore|ingegnere|comm\.|dir\.|ing\.|sgt\.|cap\.)\b/i,
  parts: {
    heads: Array.from({ length: 41 }, (_, i) =>
      'sprites/faces/busts/bust_' + String(i).padStart(2, '0') + '.png'),
    hair: [null],
    accessories: [null]
  }
};
