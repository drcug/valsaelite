'use strict';
/** Layout ritratti — atlas bust + pezzi faccia AI (Forbidden Planet) */
window.PORTRAIT_LAYOUT = {
  cols: 4,
  rows: 2,
  cellW: 128,
  cellH: 160,
  atlasPath: 'sprites/portraits.png',
  view: {
    pad: 0.04,
    centerYFrac: 0.52,
    scaleMul: 1.05
  },
  face: {
    cxFrac: 0.5,
    headYFrac: 0.36,
    hwFrac: 0.38,
    hhFrac: 0.40
  },
  /** Pezzi modulari generati via AI */
  parts: {
    heads: [
      'sprites/faces/heads/head_00.png',
      'sprites/faces/heads/head_01.png',
      'sprites/faces/heads/head_02.png',
      'sprites/faces/heads/head_03.png'
    ],
    eyes: {
      normal: 'sprites/faces/eyes/eyes_normal.png',
      blue: 'sprites/faces/eyes/eyes_normal.png',
      alien: 'sprites/faces/eyes/eyes_normal.png',
      stern: 'sprites/faces/eyes/eyes_normal.png',
      cyborgR: 'sprites/faces/eyes/eyes_cyborg.png',
      cyborgG: 'sprites/faces/eyes/eyes_cyborg.png',
      goggles: 'sprites/faces/eyes/eyes_goggles.png',
      patch: 'sprites/faces/eyes/eyes_normal.png'
    },
    hair: {
      short: 'sprites/faces/hair/hair_short.png',
      medium: 'sprites/faces/hair/hair_short.png',
      wavy: 'sprites/faces/hair/hair_long.png',
      long: 'sprites/faces/hair/hair_long.png',
      mohawk: 'sprites/faces/hair/hair_mohawk.png',
      bun: 'sprites/faces/hair/hair_bun.png',
      shaved: null,
      bald: null
    },
    mouths: {
      smile: 'sprites/faces/mouths/mouth_smile.png',
      confident: 'sprites/faces/mouths/mouth_smile.png',
      open: 'sprites/faces/mouths/mouth_smile.png',
      smirk: 'sprites/faces/mouths/mouth_smirk.png',
      stern: 'sprites/faces/mouths/mouth_stern.png',
      neutral: 'sprites/faces/mouths/mouth_stern.png',
      flat: 'sprites/faces/mouths/mouth_stern.png',
      grit: 'sprites/faces/mouths/mouth_stern.png'
    },
    accessories: [
      null,
      null,
      'sprites/faces/accessories/acc_scar.png',
      'sprites/faces/accessories/acc_mask.png',
      null,
      'sprites/faces/accessories/acc_scar.png'
    ]
  }
};
