'use strict';
/**
 * Layout ritratti — busti pelati + overlay capelli/accessori.
 * Il cambio colore si applica SOLO allo sprite capelli.
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
    scaleMul: 1.08
  },
  /** Overlay allineati al busto (frazioni della cella head) */
  overlay: {
    hairScale: 1.22,
    hairY: -0.06,
    accScale: 1.05,
    accY: 0.04
  },
  hairTints: [
    '#100808', '#281408', '#7a4018', '#b07020', '#d4b050',
    '#e8d8a0', '#eeeeee', '#540010', '#001035', '#224418',
    '#c04018', '#2a6a58', '#6a28a0', '#4a2030', '#88aacc', '#d4a050'
  ],
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
      null // bald — nessun overlay
    ],
    accessories: [
      null,
      null,
      null,
      'sprites/faces/eyes/eyes_goggles.png',
      'sprites/faces/accessories/acc_glasses.png',
      'sprites/faces/accessories/acc_visor.png',
      'sprites/faces/accessories/acc_mask.png',
      'sprites/faces/accessories/acc_scar.png'
    ]
  }
};
