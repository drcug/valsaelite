'use strict';
/** Layout condiviso — procedurale + atlas singolo bust */
window.PORTRAIT_LAYOUT = {
  cols: 4,
  rows: 2,
  cellW: 128,
  cellH: 160,
  /** Atlas opzionale: un foglio 4×2 ritratti completi */
  atlasPath: 'sprites/portraits.png',
  view: {
    pad: 0.06,
    centerYFrac: 0.52,
    scaleMul: 1.0
  },
  /** Ancoraggio volto sul rettangolo atlas disegnato (dx,dy,dw,dh) */
  face: {
    cxFrac: 0.5,
    headYFrac: 0.36,
    hwFrac: 0.38,
    hhFrac: 0.40
  }
};
