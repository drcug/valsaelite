'use strict';
/**
 * Portrait — atlas bust + overlay procedurale (occhi, naso/bocca, capelli, accessori)
 * Fallback: volto interamente procedurale se atlas assente.
 */
(function (global) {
  const L = global.PORTRAIT_LAYOUT || {
    cols: 4, rows: 2, cellW: 128, cellH: 160,
    atlasPath: 'sprites/portraits.png',
    view: { pad: 0.06, centerYFrac: 0.52, scaleMul: 1.0 },
    face: { cxFrac: 0.5, headYFrac: 0.36, hwFrac: 0.38, hhFrac: 0.40 }
  };

  const SKINS = [
    { b: '#f5cfa0', m: '#d4a56a', d: '#b07840', l: '#d4756a' },
    { b: '#e8b880', m: '#c89050', d: '#9a6030', l: '#c06055' },
    { b: '#c07840', m: '#9a5820', d: '#703800', l: '#a04838' },
    { b: '#8a4820', m: '#6a3010', d: '#4a1800', l: '#803028' },
    { b: '#fce0c0', m: '#e8b890', d: '#c08860', l: '#e06870' },
    { b: '#d09060', m: '#a86030', d: '#784010', l: '#b05040' },
    { b: '#a8c8a0', m: '#7a9a72', d: '#4a6848', l: '#c07080' },
    { b: '#b0b8c8', m: '#8890a0', d: '#606878', l: '#9098a8' }
  ];

  const HAIR_COLS = ['#100808', '#281408', '#7a4018', '#b07020', '#d4b050', '#e8d8a0', '#eeeeee', '#540010', '#001035', '#224418'];
  const EYE_COLS = ['#3a5f8a', '#2d6e3a', '#7a4a1a', '#1a4a6b', '#4a3a7b', '#1f4a2a', '#5a3a20', '#2a5a6a'];
  const HAIR_STYLES = ['short', 'medium', 'long', 'mohawk', 'bun', 'shaved', 'wavy', 'bald'];
  const EYE_TYPES = ['normal', 'blue', 'cyborgR', 'cyborgG', 'alien', 'stern', 'goggles', 'patch'];
  const MOUTH_TYPES = ['smile', 'neutral', 'smirk', 'confident', 'stern', 'open', 'flat', 'grit'];

  function portraitFaceFromSeed(seed) {
    let h = (seed >>> 0) || 1;
    h = (Math.imul(h, 1664525) + 1013904223) | 0;
    const x = Math.abs(h);
    return { fHead: x % 8, fEye: (x >> 3) % 8, fMouth: (x >> 6) % 8, fHair: (x >> 9) % 8 };
  }

  function portraitHueFromSeed(seed) {
    return (Math.imul(seed | 0, 2654435761) >>> 0) % 360;
  }

  function portraitAtlasIndex(seed) {
    return portraitFaceFromSeed(seed).fHead % (L.cols * L.rows);
  }

  function makeRng(seed) {
    let s = ((seed || 1) * 9301 + 49297) & 0x7fffffff;
    return (mn, mx) => {
      s = (s * 9301 + 49297) & 0x7fffffff;
      const v = s / 0x7fffffff;
      return mn === undefined ? v : mn + v * (mx - mn);
    };
  }

  function roundRectCtx(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  const atlas = { ready: false, loading: false, promise: null, img: null };

  function absUrl(rel) {
    try { return new URL(rel, global.location.href).href; } catch (_) { return rel; }
  }

  function loadImage(url) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => res(im);
      im.onerror = () => rej(new Error(url));
      im.src = url;
    });
  }

  const PortraitAtlas = {
    load() {
      if (atlas.ready) return Promise.resolve(true);
      if (atlas.promise) return atlas.promise;
      atlas.loading = true;
      atlas.promise = loadImage(absUrl(L.atlasPath))
        .then((im) => {
          atlas.img = im;
          atlas.ready = im.naturalWidth > 0 && im.naturalHeight > 0;
          atlas.loading = false;
          if (atlas.ready && typeof global.console !== 'undefined') {
            global.console.info('[portrait] Atlas bust OK:', L.atlasPath);
          }
          return atlas.ready;
        })
        .catch((e) => {
          atlas.ready = false;
          atlas.loading = false;
          atlas.promise = null;
          return false;
        });
      return atlas.promise;
    },
    get ready() { return atlas.ready; },
    get img() { return atlas.img; }
  };

  function factionColor(factionId) {
    const f = global.FACTIONS && global.FACTIONS[factionId];
    return f ? f.color : '#667788';
  }

  function faceGeomFromRect(rect) {
    const f = L.face;
    const { dx, dy, dw, dh } = rect;
    return {
      cx: dx + dw * f.cxFrac,
      headY: dy + dh * f.headYFrac,
      hw: dw * f.hwFrac,
      hh: dh * f.hhFrac
    };
  }

  function faceGeomCanvas(W, H, rng) {
    return {
      cx: W / 2,
      headY: H * 0.42,
      hw: W * 0.215 + rng(-3, 5),
      hh: H * 0.275 + rng(-3, 4)
    };
  }

  function computeAtlasRect(W, H, im, seed) {
    const cols = L.cols, rows = L.rows;
    const cw = Math.floor(im.naturalWidth / cols);
    const ch = Math.floor(im.naturalHeight / rows);
    if (!cw || !ch) return null;
    const idx = portraitAtlasIndex(seed);
    const col = idx % cols;
    const row = (idx / cols) | 0;
    const v = L.view;
    const pad = v.pad;
    const maxW = Math.max(12, W * (1 - 2 * pad));
    const maxH = Math.max(12, H * (1 - 2 * pad));
    const sc = Math.min(maxW / cw, maxH / ch) * v.scaleMul;
    const dw = cw * sc, dh = ch * sc;
    return { dx: (W - dw) * 0.5, dy: H * v.centerYFrac - dh * 0.5, dw, dh, cw, ch, col, row, sc };
  }

  function drawHair(ctx, g, style, hCol, sk, rng) {
    const { cx, headY, hw, hh } = g;
    if (style === 'bald') return;
    ctx.fillStyle = hCol;
    if (style === 'short') {
      ctx.beginPath();
      ctx.moveTo(cx - hw, headY - 0.05 * hh);
      ctx.bezierCurveTo(cx - hw * 1.05, headY - hh * 0.68, cx - hw * 0.58, headY - hh, cx, headY - hh);
      ctx.bezierCurveTo(cx + hw * 0.58, headY - hh, cx + hw * 1.05, headY - hh * 0.68, cx + hw, headY - 0.05 * hh);
      ctx.quadraticCurveTo(cx, headY - hh * 1.18, cx, headY - hh);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'medium') {
      ctx.beginPath();
      ctx.moveTo(cx - hw * 0.68, headY + hh * 0.18);
      ctx.bezierCurveTo(cx - hw * 1.22, headY - hh * 0.32, cx - hw * 0.98, headY - hh * 1.12, cx, headY - hh * 1.1);
      ctx.bezierCurveTo(cx + hw * 0.98, headY - hh * 1.12, cx + hw * 1.22, headY - hh * 0.32, cx + hw * 0.68, headY + hh * 0.18);
      ctx.bezierCurveTo(cx + hw * 0.5, headY + hh * 0.44, cx + hw * 0.28, headY + hh * 0.58, cx, headY + hh * 0.52);
      ctx.bezierCurveTo(cx - hw * 0.28, headY + hh * 0.58, cx - hw * 0.5, headY + hh * 0.44, cx - hw * 0.68, headY + hh * 0.18);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'long') {
      const bot = headY + hh * 1.55;
      ctx.beginPath();
      ctx.moveTo(cx - hw * 0.82, bot);
      ctx.bezierCurveTo(cx - hw * 1.18, headY - hh * 0.28, cx - hw * 0.95, headY - hh * 1.12, cx, headY - hh * 1.14);
      ctx.bezierCurveTo(cx + hw * 0.95, headY - hh * 1.12, cx + hw * 1.18, headY - hh * 0.28, cx + hw * 0.82, bot);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'mohawk') {
      ctx.beginPath();
      ctx.moveTo(cx - hw * 0.09, headY - hh * 0.93);
      ctx.bezierCurveTo(cx - hw * 0.18, headY - hh * 1.65, cx + hw * 0.18, headY - hh * 1.65, cx + hw * 0.09, headY - hh * 0.93);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'bun') {
      ctx.beginPath();
      ctx.arc(cx, headY - hh * 1.18, hw * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - hw, headY - 0.06 * hh);
      ctx.bezierCurveTo(cx - hw, headY - hh * 0.62, cx - hw * 0.5, headY - hh, cx, headY - hh);
      ctx.bezierCurveTo(cx + hw * 0.5, headY - hh, cx + hw, headY - hh * 0.62, cx + hw, headY - 0.06 * hh);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'wavy') {
      ctx.beginPath();
      ctx.moveTo(cx - hw * 0.7, headY + hh * 0.22);
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        ctx.lineTo(cx - hw * (1.1 - t * 0.4) + Math.sin(t * Math.PI * 3) * hw * 0.08, headY - hh * (t * 0.95 - 0.12));
      }
      ctx.quadraticCurveTo(cx, headY - hh * 1.12, cx + hw * 0.6, headY - hh * 0.9);
      for (let i = 8; i >= 0; i--) {
        const t = i / 8;
        ctx.lineTo(cx + hw * (1.1 - t * 0.4) + Math.sin(t * Math.PI * 3) * hw * 0.08, headY - hh * (t * 0.95 - 0.12));
      }
      ctx.closePath();
      ctx.fill();
    } else if (style === 'shaved') {
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = sk.d;
      for (let k = 0; k < 40; k++) {
        ctx.fillRect(cx + (rng() - 0.5) * hw * 2, headY - hh * 0.5 + rng() * hh * 0.5, rng(0.4, 1.2), rng(0.8, 2));
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawOneEye(ctx, ex, ey, ew, eh, eCol, kind) {
    if (kind === 'patch') {
      ctx.fillStyle = '#0a0810';
      ctx.beginPath();
      ctx.ellipse(ex, ey, ew * 1.1, eh * 1.05, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#222';
      ctx.lineWidth = Math.max(0.8, ew * 0.12);
      ctx.stroke();
      ctx.strokeStyle = '#444';
      ctx.beginPath();
      ctx.moveTo(ex - ew * 1.3, ey - eh * 0.5);
      ctx.lineTo(ex + ew * 1.3, ey + eh * 0.5);
      ctx.stroke();
      return;
    }
    if (kind === 'cyborgR' || kind === 'cyborgG') {
      const glow = kind === 'cyborgR' ? '#ff2244' : '#44ff88';
      ctx.fillStyle = '#1a2030';
      ctx.beginPath();
      ctx.ellipse(ex, ey, ew, eh, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(ex, ey, ew * 0.55, eh * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.7)';
      ctx.beginPath();
      ctx.arc(ex + ew * 0.2, ey - eh * 0.2, ew * 0.15, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    const iris = kind === 'alien' ? '#ffcc22' : kind === 'blue' ? '#2a6aaa' : eCol;
    ctx.fillStyle = '#eef2f8';
    ctx.beginPath();
    ctx.ellipse(ex, ey, ew, eh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = iris;
    ctx.beginPath();
    ctx.ellipse(ex, ey, ew * 0.62, eh * 0.84, 0, 0, Math.PI * 2);
    ctx.fill();
    if (kind === 'alien') {
      ctx.fillStyle = 'rgba(255,220,80,.55)';
      ctx.beginPath();
      ctx.ellipse(ex, ey, ew * 0.5, eh * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#050508';
    ctx.beginPath();
    ctx.ellipse(ex, ey + eh * 0.04, ew * 0.32, eh * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.beginPath();
    ctx.arc(ex + ew * 0.22, ey - eh * 0.24, ew * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawEyes(ctx, g, eyeType, eCol, hCol, rng) {
    const { cx, headY, hw, hh } = g;
    const eyeY = headY - hh * 0.06;
    const eSpread = hw * 0.38;
    const ew = hw * 0.15, eh = hh * 0.075;
    const bCol = (hCol === '#eeeeee' || hCol === '#e8d8a0') ? '#888888' : hCol;

    if (eyeType === 'goggles') {
      ctx.fillStyle = 'rgba(20,30,40,.75)';
      ctx.strokeStyle = '#556677';
      ctx.lineWidth = Math.max(1, hw * 0.04);
      const gx = cx - eSpread - ew * 1.1, gy = eyeY - eh * 1.2, gw = (eSpread + ew * 1.1) * 2, gh = eh * 2.4;
      roundRectCtx(ctx, gx, gy, gw, gh, eh * 0.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(80,200,120,.35)';
      ctx.beginPath();
      ctx.ellipse(cx - eSpread, eyeY, ew * 0.9, eh * 0.85, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + eSpread, eyeY, ew * 0.9, eh * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    const leftKind = eyeType === 'patch' ? 'patch' : eyeType === 'cyborgR' ? 'cyborgR' : eyeType === 'cyborgG' ? 'normal' : eyeType;
    const rightKind = eyeType === 'patch' ? 'normal' : eyeType === 'cyborgR' ? 'normal' : eyeType === 'cyborgG' ? 'cyborgG' : eyeType;

    drawOneEye(ctx, cx - eSpread, eyeY, ew, eh, eCol, leftKind);
    drawOneEye(ctx, cx + eSpread, eyeY, ew, eh, eCol, rightKind);

    ctx.strokeStyle = bCol;
    ctx.lineWidth = eyeType === 'stern' ? Math.max(1.8, hw * 0.035) : Math.max(1.2, hw * 0.028);
    ctx.lineCap = 'round';
    [-1, 1].forEach((s) => {
      const bx = cx + s * eSpread, by = eyeY - hh * 0.15;
      const lift = eyeType === 'stern' ? -0.04 : rng(-0.03, 0.03);
      ctx.beginPath();
      ctx.moveTo(bx - hw * 0.13, by + s * lift * hh);
      ctx.quadraticCurveTo(bx, by - hh * 0.04, bx + hw * 0.13, by - s * lift * hh);
      ctx.stroke();
    });
  }

  function drawNoseMouth(ctx, g, mouthType, sk) {
    const { cx, headY, hw, hh } = g;
    const eyeY = headY - hh * 0.06;
    const noseY = headY + hh * 0.2;
    ctx.strokeStyle = sk.d + '99';
    ctx.lineWidth = Math.max(0.8, hw * 0.05);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + hw * 0.04, eyeY + hh * 0.1);
    ctx.quadraticCurveTo(cx + hw * 0.12, noseY, cx, noseY + hh * 0.05);
    ctx.stroke();
    [-1, 1].forEach((s) => {
      ctx.fillStyle = sk.d + '44';
      ctx.beginPath();
      ctx.ellipse(cx + s * hw * 0.075, noseY + hh * 0.046, hw * 0.042, hh * 0.028, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    const mY = headY + hh * 0.44, mW = hw * 0.22;
    ctx.fillStyle = sk.l;
    if (mouthType === 'smile') {
      ctx.beginPath();
      ctx.moveTo(cx - mW, mY);
      ctx.quadraticCurveTo(cx, mY - hh * 0.065, cx + mW, mY);
      ctx.quadraticCurveTo(cx, mY + hh * 0.075, cx - mW, mY);
      ctx.closePath();
      ctx.fill();
    } else if (mouthType === 'smirk') {
      ctx.beginPath();
      ctx.moveTo(cx - mW * 0.92, mY + hh * 0.012);
      ctx.quadraticCurveTo(cx + mW * 0.28, mY - hh * 0.065, cx + mW * 0.96, mY - hh * 0.02);
      ctx.quadraticCurveTo(cx, mY + hh * 0.065, cx - mW * 0.92, mY + hh * 0.012);
      ctx.closePath();
      ctx.fill();
    } else if (mouthType === 'open') {
      ctx.fillStyle = '#401820';
      ctx.beginPath();
      ctx.ellipse(cx, mY, mW * 0.7, hh * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (mouthType === 'grit') {
      ctx.fillStyle = sk.d;
      for (let i = -3; i <= 3; i++) {
        ctx.fillRect(cx + i * mW * 0.22 - mW * 0.08, mY - hh * 0.02, mW * 0.14, hh * 0.035);
      }
    } else {
      ctx.fillRect(cx - mW, mY - hh * 0.016, mW * 2, hh * 0.032);
    }
    ctx.strokeStyle = sk.d + '88';
    ctx.lineWidth = Math.max(0.6, hw * 0.04);
    ctx.beginPath();
    ctx.moveTo(cx - mW, mY);
    ctx.lineTo(cx + mW, mY);
    ctx.stroke();
  }

  function drawAccessories(ctx, g, seed, factionId, fCol, W, rng) {
    const { cx, headY, hw, hh } = g;
    const acc = (seed >>> 12) % 5;
    const eyeY = headY - hh * 0.06;

    if (acc === 1 || rng() > 0.82) {
      ctx.strokeStyle = 'rgba(180,100,78,.75)';
      ctx.lineWidth = Math.max(1.2, hw * 0.06);
      ctx.lineCap = 'round';
      const sxc = cx + rng(-hw * 0.35, hw * 0.35);
      const syc = headY + rng(-hh * 0.15, hh * 0.3);
      ctx.beginPath();
      ctx.moveTo(sxc, syc - hh * 0.12);
      ctx.lineTo(sxc + rng(-4, 4), syc + hh * 0.14);
      ctx.stroke();
    }

    if (acc === 2) {
      ctx.fillStyle = 'rgba(40,50,60,.85)';
      ctx.strokeStyle = '#667788';
      ctx.lineWidth = Math.max(0.8, hw * 0.04);
      ctx.beginPath();
      ctx.moveTo(cx - hw * 0.55, headY + hh * 0.35);
      ctx.lineTo(cx + hw * 0.55, headY + hh * 0.35);
      ctx.quadraticCurveTo(cx + hw * 0.5, headY + hh * 0.55, cx, headY + hh * 0.52);
      ctx.quadraticCurveTo(cx - hw * 0.5, headY + hh * 0.55, cx - hw * 0.55, headY + hh * 0.35);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#334455';
      ctx.fillRect(cx - hw * 0.12, headY + hh * 0.38, hw * 0.24, hh * 0.06);
    }

    if (acc === 3) {
      ctx.strokeStyle = '#8899aa';
      ctx.lineWidth = Math.max(1, hw * 0.05);
      ctx.beginPath();
      ctx.arc(cx + hw * 0.95, headY + hh * 0.05, hw * 0.12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = fCol + 'cc';
      ctx.beginPath();
      ctx.arc(cx + hw * 0.95, headY + hh * 0.05, hw * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }

    if (acc === 4 && factionId) {
      ctx.fillStyle = fCol + '99';
      ctx.font = `bold ${Math.max(8, Math.round(W * 0.09))}px sans-serif`;
      ctx.textAlign = 'center';
      const sym = { bazzano: '⬡', crespellano: '×', calcara: '⚙', monteveglio: '⚔', savigno: '◈', pirate: '☠' }[factionId] || '★';
      ctx.fillText(sym, cx + hw * 0.55, eyeY - hh * 0.2);
    }
  }

  function drawFaceOverlay(ctx, g, seed, factionId, W) {
    const fac = portraitFaceFromSeed(seed);
    const rng = makeRng(seed ^ 0x9e3779b9);
    const sk = SKINS[fac.fHead % SKINS.length];
    const hCol = HAIR_COLS[(fac.fHair + fac.fHead) % HAIR_COLS.length];
    const eCol = EYE_COLS[fac.fEye % EYE_COLS.length];
    const hStyle = HAIR_STYLES[fac.fHair % HAIR_STYLES.length];
    const eyeType = EYE_TYPES[fac.fEye % EYE_TYPES.length];
    const mouthType = MOUTH_TYPES[fac.fMouth % MOUTH_TYPES.length];
    const fCol = factionColor(factionId);

    drawHair(ctx, g, hStyle, hCol, sk, rng);
    drawEyes(ctx, g, eyeType, eCol, hCol, rng);
    drawNoseMouth(ctx, g, mouthType, sk);
    drawAccessories(ctx, g, seed, factionId, fCol, W, rng);
  }

  function drawPortraitBg(ctx, W, H, factionId) {
    const fCol = factionColor(factionId);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#02060e');
    bg.addColorStop(1, fCol + '22');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    return fCol;
  }

  function drawPortraitFrame(ctx, W, H) {
    const vig = ctx.createRadialGradient(W * 0.5, H * 0.48, W * 0.08, W * 0.5, H * 0.5, W * 0.82);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(0,0,0,.45)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(120,200,255,.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
  }

  function drawAtlasComposite(ctx, W, H, seed, factionId, hue) {
    const im = atlas.img;
    if (!im || !im.naturalWidth) return false;
    const rect = computeAtlasRect(W, H, im, seed);
    if (!rect) return false;

    const fCol = factionColor(factionId);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, W, H);
    drawPortraitBg(ctx, W, H, factionId);

    ctx.save();
    if (hue != null && !isNaN(hue)) ctx.filter = `hue-rotate(${hue}deg) saturate(1.06)`;
    ctx.drawImage(im, rect.col * rect.cw, rect.row * rect.ch, rect.cw, rect.ch, rect.dx, rect.dy, rect.dw, rect.dh);
    ctx.restore();

    const g = faceGeomFromRect(rect);
    drawFaceOverlay(ctx, g, seed, factionId, W);

    const suitG = ctx.createLinearGradient(0, H * 0.72, 0, H);
    suitG.addColorStop(0, fCol + '55');
    suitG.addColorStop(1, fCol + '88');
    ctx.fillStyle = suitG;
    ctx.fillRect(0, H * 0.72, W, H * 0.28);

    drawPortraitFrame(ctx, W, H);
    return true;
  }

  function drawProcedural(ctx, W, H, seed, factionId) {
    const fCol = drawPortraitBg(ctx, W, H, factionId);
    const rng = makeRng(seed);
    const fac = portraitFaceFromSeed(seed);
    const sk = SKINS[Math.floor(rng(0, SKINS.length))];
    const g = faceGeomCanvas(W, H, rng);

    const nkG = ctx.createLinearGradient(g.cx - g.hw * 0.5, 0, g.cx + g.hw * 0.5, 0);
    nkG.addColorStop(0, sk.d);
    nkG.addColorStop(0.35, sk.m);
    nkG.addColorStop(0.65, sk.b);
    nkG.addColorStop(1, sk.d);
    ctx.fillStyle = nkG;
    ctx.beginPath();
    ctx.moveTo(g.cx - g.hw * 0.52, g.headY + g.hh * 0.72);
    ctx.lineTo(g.cx + g.hw * 0.52, g.headY + g.hh * 0.72);
    ctx.lineTo(g.cx + g.hw * 0.42, H);
    ctx.lineTo(g.cx - g.hw * 0.42, H);
    ctx.closePath();
    ctx.fill();

    const hdG = ctx.createRadialGradient(g.cx - g.hw * 0.18, g.headY - g.hh * 0.08, 0, g.cx, g.headY + g.hh * 0.05, g.hw * 1.45);
    hdG.addColorStop(0, sk.b);
    hdG.addColorStop(0.52, sk.m);
    hdG.addColorStop(1, sk.d);
    ctx.fillStyle = hdG;
    ctx.beginPath();
    ctx.moveTo(g.cx - g.hw, g.headY - 0.04 * g.hh);
    ctx.bezierCurveTo(g.cx - g.hw * 1.06, g.headY - g.hh * 0.68, g.cx - g.hw * 0.58, g.headY - g.hh, g.cx, g.headY - g.hh);
    ctx.bezierCurveTo(g.cx + g.hw * 0.58, g.headY - g.hh, g.cx + g.hw * 1.06, g.headY - g.hh * 0.68, g.cx + g.hw, g.headY - 0.04 * g.hh);
    ctx.bezierCurveTo(g.cx + g.hw * 0.94, g.headY + g.hh * 0.38, g.cx + g.hw * 0.8, g.headY + g.hh * 0.85, g.cx, g.headY + g.hh * 0.9);
    ctx.bezierCurveTo(g.cx - g.hw * 0.8, g.headY + g.hh * 0.85, g.cx - g.hw * 0.94, g.headY + g.hh * 0.38, g.cx - g.hw, g.headY - 0.04 * g.hh);
    ctx.closePath();
    ctx.fill();

    drawFaceOverlay(ctx, g, seed, factionId, W);

    const suitG = ctx.createLinearGradient(0, H * 0.7, 0, H);
    suitG.addColorStop(0, fCol + 'aa');
    suitG.addColorStop(1, fCol + 'dd');
    ctx.fillStyle = suitG;
    ctx.fillRect(0, H * 0.7, W, H * 0.3);
    ctx.fillStyle = fCol + 'cc';
    ctx.beginPath();
    ctx.moveTo(g.cx - W * 0.28, H * 0.7);
    ctx.lineTo(g.cx - W * 0.065, H * 0.64);
    ctx.lineTo(g.cx + W * 0.065, H * 0.64);
    ctx.lineTo(g.cx + W * 0.28, H * 0.7);
    ctx.fill();
    roundRectCtx(ctx, g.cx + W * 0.17, H * 0.74, W * 0.1, W * 0.1, 3);
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.fill();
    ctx.fillStyle = fCol + 'ee';
    ctx.font = `bold ${Math.round(W * 0.12)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const sym2 = { bazzano: '⬡', crespellano: '⚑', calcara: '⚙', monteveglio: '⚔', savigno: '◈', pirate: '☠' }[factionId] || '★';
    ctx.fillText(sym2, g.cx + W * 0.22, H * 0.79);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    drawPortraitFrame(ctx, W, H);
  }

  function redrawActiveDialog() {
    const npc = global.activeDlgNpc;
    const dlg = global.document && global.document.getElementById('idlg');
    if (!npc || !dlg || dlg.style.display !== 'flex') return;
    const pc = global.document.getElementById('pilot-portrait');
    if (!pc) return;
    PortraitRenderer.draw(pc.getContext('2d'), pc.width, pc.height, {
      seed: npc.seed,
      factionId: npc.faction,
      hue: portraitHueFromSeed(npc.seed)
    });
  }

  const PortraitRenderer = {
    layout: L,
    draw(ctx, W, H, opt) {
      opt = opt || {};
      const seed = opt.seed != null ? opt.seed : 1;
      const factionId = opt.factionId || 'bazzano';
      const hue = opt.hue != null ? opt.hue : portraitHueFromSeed(seed);
      const forceProcedural = !!opt.procedural;

      if (!forceProcedural && atlas.ready && drawAtlasComposite(ctx, W, H, seed, factionId, hue)) {
        return 'atlas+overlay';
      }

      drawProcedural(ctx, W, H, seed, factionId);

      if (!atlas.ready && !atlas.loading) {
        PortraitAtlas.load().then((ok) => { if (ok) redrawActiveDialog(); });
      }
      return 'procedural';
    },
    drawCanvas(canvas, seed, factionId, opt) {
      opt = Object.assign({}, opt || {}, { seed, factionId });
      return PortraitRenderer.draw(canvas.getContext('2d'), canvas.width, canvas.height, opt);
    }
  };

  global.portraitFaceFromSeed = portraitFaceFromSeed;
  global.portraitHueFromSeed = portraitHueFromSeed;
  global.portraitAtlasIndex = portraitAtlasIndex;
  global.PortraitAtlas = PortraitAtlas;
  global.PortraitRenderer = PortraitRenderer;

  PortraitAtlas.load().then((ok) => { if (ok) redrawActiveDialog(); });
})(typeof window !== 'undefined' ? window : globalThis);
