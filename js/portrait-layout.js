'use strict';
/**
 * Layout ritratti — busti pelati 128×160 + overlay stessa dimensione/posizione.
 * Tint colore solo sullo sprite capelli.
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
  /** Overlay 1:1 con il busto (stesse dimensioni e posizione) */
  overlay: {
    hairScale: 1,
    hairY: 0,
    accScale: 1,
    accY: 0
  },
  hairTints: [
    '#100808', '#281408', '#7a4018', '#b07020', '#d4b050',
    '#e8d8a0', '#eeeeee', '#540010', '#001035', '#224418',
    '#c04018', '#2a6a58', '#6a28a0', '#4a2030', '#88aacc', '#d4a050',
    '#f2f2f5' // bianco / Zvan
  ],
  /** Ritratto giocatore: busto completo (capelli bianchi già integrati) */
  player: {
    head: 'sprites/faces/player/zvan_complete.png',
    hair: null,
    hairTint: '#f2f2f5',
    name: 'Zvan Marìa',
    complete: true
  },
  parts: {
    heads: Array.from({ length: 16 }, (_, i) =>
      'sprites/faces/heads/head_' + String(i).padStart(2, '0') + '.png'),
    hair: [
      'sprites/faces/hair/hair_short.png',
      'sprites/faces/hair/hair_long.png',
      'sprites/faces/hair/hair_mohawk.png',
      'sprites/faces/hair/hair_bun.png',
      'sprites/faces/hair/hair_wavy.png',
      'sprites/faces/hair/hair_bob.png',
      'sprites/faces/hair/hair_white.png',
      null // pelato
    ],
    accessories: [
      null,
      null,
      null,
      'sprites/faces/eyes/eyes_goggles.png',
      'sprites/faces/accessories/acc_glasses.png',
      'sprites/faces/accessories/acc_visor.png',
      'sprites/faces/accessories/acc_mask.png',
      null
    ]
  }
};
