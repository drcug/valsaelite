'use strict';
/** Layout ritratti — atlas 4×4 = 16 busti AI completi (capelli/colori variati) */
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
  face: {
    cxFrac: 0.5,
    headYFrac: 0.36,
    hwFrac: 0.38,
    hhFrac: 0.40
  },
  /** Metadati capelli per ogni cella atlas (stile + tinta base) */
  hairMeta: [
    { style: 'short', tint: '#2a1810' },
    { style: 'buzz', tint: '#1a1210' },
    { style: 'bun', tint: '#e8d8c0' },
    { style: 'medium', tint: '#5a4030' },
    { style: 'mohawk', tint: '#0a2030' },
    { style: 'long', tint: '#7a3018' },
    { style: 'short', tint: '#100808' },
    { style: 'long', tint: '#1a1008' },
    { style: 'wavy', tint: '#c04018' },
    { style: 'short', tint: '#e8e8e8' },
    { style: 'bob', tint: '#f0e0b0' },
    { style: 'ponytail', tint: '#0a0808' },
    { style: 'buzz', tint: '#2a6a58' },
    { style: 'bald', tint: null },
    { style: 'wavy', tint: '#6a28a0' },
    { style: 'crop', tint: '#d4a050' }
  ],
  /** Tinte capelli extra applicabili via filtro (seed) */
  hairTints: [
    '#100808', '#281408', '#7a4018', '#b07020', '#d4b050',
    '#e8d8a0', '#eeeeee', '#540010', '#001035', '#224418',
    '#c04018', '#2a6a58', '#6a28a0', '#4a2030', '#88aacc', '#d4a050'
  ],
  parts: {
    heads: Array.from({ length: 16 }, (_, i) =>
      'sprites/faces/heads/head_' + String(i).padStart(2, '0') + '.png')
  }
};
