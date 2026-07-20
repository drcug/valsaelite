'use strict';
/** Layout ritratti — atlas di busti COMPLETI (8 facce AI allineate) */
window.PORTRAIT_LAYOUT = {
  cols: 4,
  rows: 2,
  cellW: 128,
  cellH: 160,
  atlasPath: 'sprites/portraits.png',
  view: {
    pad: 0.02,
    centerYFrac: 0.52,
    scaleMul: 1.08
  },
  face: {
    cxFrac: 0.5,
    headYFrac: 0.36,
    hwFrac: 0.38,
    hhFrac: 0.40
  },
  /** Teste complete opzionali (stesso set dell'atlas) */
  parts: {
    heads: [
      'sprites/faces/heads/head_00.png',
      'sprites/faces/heads/head_01.png',
      'sprites/faces/heads/head_02.png',
      'sprites/faces/heads/head_03.png',
      'sprites/faces/heads/head_04.png',
      'sprites/faces/heads/head_05.png',
      'sprites/faces/heads/head_06.png',
      'sprites/faces/heads/head_07.png'
    ]
  }
};
