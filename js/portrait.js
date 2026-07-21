'use strict';
/**
 * Portrait — busti pelati + overlay capelli (tint sullo sprite) + accessori.
 */
(function (global) {
  const L = global.PORTRAIT_LAYOUT || {
    cols: 4, rows: 4, cellW: 128, cellH: 160,
    atlasPath: 'sprites/portraits.png',
    view: { pad: 0.02, centerYFrac: 0.52, scaleMul: 1.08 },
    overlay: { hairScale: 1.22, hairY: -0.06, accScale: 1.05, accY: 0.04 },
    hairTints: ['#100808', '#7a4018', '#d4b050', '#eeeeee', '#540010', '#224418', '#c04018', '#6a28a0'],
    parts: { heads: [], hair: [null], accessories: [null] }
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

  const HAIR_COLS = (L.hairTints && L.hairTints.length)
    ? L.hairTints
    : ['#100808', '#281408', '#7a4018', '#b07020', '#d4b050', '#e8d8a0', '#eeeeee', '#540010', '#001035', '#224418', '#c04018', '#2a6a58', '#6a28a0', '#4a2030', '#88aacc', '#d4a050'];
  const EYE_COLS = ['#3a5f8a', '#2d6e3a', '#7a4a1a', '#1a4a6b', '#4a3a7b', '#1f4a2a', '#5a3a20', '#2a5a6a'];
  const HAIR_STYLES = ['short', 'medium', 'long', 'mohawk', 'bun', 'wavy', 'bald', 'bob'];
  const EYE_TYPES = ['normal', 'blue', 'cyborgR', 'cyborgG', 'alien', 'stern', 'goggles', 'patch'];
  const MOUTH_TYPES = ['smile', 'neutral', 'smirk', 'confident', 'stern', 'open', 'flat', 'grit'];
  const N_BUSTS = Math.max(1, (L.cols || 4) * (L.rows || 4));
  const HAIR_PATHS = (L.parts && L.parts.hair) || [null];
  const ACC_PATHS = (L.parts && L.parts.accessories) || [null];

  function portraitFaceFromSeed(seed) {
    let h = (seed >>> 0) || 1;
    h = (Math.imul(h, 1664525) + 1013904223) | 0;
    const x = Math.abs(h);
    const hairIdx = (x >> 12) % HAIR_PATHS.length;
    const accIdx = (x >> 15) % ACC_PATHS.length;
    return {
      fHead: x % N_BUSTS,
      fEye: (x >> 3) % 8,
      fMouth: (x >> 6) % 8,
      fHair: (x >> 9) % HAIR_COLS.length,
      fHairStyle: hairIdx,
      fAcc: accIdx,
      hairPath: HAIR_PATHS[hairIdx] || null,
      accPath: ACC_PATHS[accIdx] || null
    };
  }

  function portraitHueFromSeed(seed) {
    return (Math.imul(seed | 0, 2654435761) >>> 0) % 360;
  }

  function portraitAtlasIndex(seed) {
    return portraitFaceFromSeed(seed).fHead % N_BUSTS;
  }

  function portraitHairTint(seed) {
    const fac = portraitFaceFromSeed(seed);
    return HAIR_COLS[fac.fHair % HAIR_COLS.length];
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
  const partCache = Object.create(null);
  const partsState = { ready: false, loading: false, promise: null, ok: 0 };

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

  function collectPartUrls() {
    const urls = [];
    const push = (u) => { if (u && urls.indexOf(u) < 0) urls.push(u); };
    ((L.parts && L.parts.heads) || []).forEach(push);
    HAIR_PATHS.forEach(push);
    ACC_PATHS.forEach(push);
    return urls;
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
          return atlas.ready;
        })
        .catch(() => {
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

  const PortraitParts = {
    load() {
      if (partsState.ready) return Promise.resolve(partsState.ok > 0);
      if (partsState.promise) return partsState.promise;
      const urls = collectPartUrls();
      partsState.loading = true;
      partsState.promise = Promise.all(urls.map((u) =>
        loadImage(absUrl(u)).then((im) => { partCache[u] = im; partsState.ok++; return true; })
          .catch(() => false)
      )).then(() => {
        partsState.ready = true;
        partsState.loading = false;
        return partsState.ok > 0;
      });
      return partsState.promise;
    },
    get(path) { return path ? partCache[path] || null : null; },
    get ready() { return partsState.ready && partsState.ok > 0; }
  };

  // Compat alias
  const PortraitHeads = {
    load: () => PortraitParts.load(),
    get: (path) => PortraitParts.get(path),
    get ready() { return PortraitParts.ready; }
  };

  function factionColor(factionId) {
    const f = global.FACTIONS && global.FACTIONS[factionId];
    return f ? f.color : '#667788';
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

  /** Tinta colore applicata solo allo sprite capelli (offscreen). */
  function tintHairSprite(img, tintHex) {
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return null;
    const c = (typeof document !== 'undefined') ? document.createElement('canvas') : null;
    if (!c) return img;
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    x.clearRect(0, 0, w, h);
    x.drawImage(img, 0, 0);
    // Mantieni luminosità dello sprite, cambia solo hue/saturazione
    x.globalCompositeOperation = 'color';
    x.fillStyle = tintHex;
    x.fillRect(0, 0, w, h);
    // Rinforzo leggero della saturazione sul pigmento
    x.globalCompositeOperation = 'source-atop';
    x.globalAlpha = 0.22;
    x.fillStyle = tintHex;
    x.fillRect(0, 0, w, h);
    x.globalAlpha = 1;
    return c;
  }

  function overlayRect(base, scale, yOff) {
    const dw = base.dw * scale;
    const dh = base.dh * scale;
    return {
      dx: base.dx + (base.dw - dw) * 0.5,
      dy: base.dy + base.dh * yOff + (base.dh - dh) * 0.5,
      dw, dh
    };
  }

  function drawHair(ctx, g, style, hCol, sk, rng) {
    const { cx, headY, hw, hh } = g;
    if (style === 'bald') return;
    ctx.fillStyle = hCol;
    if (style === 'short' || style === 'medium' || style === 'wavy' || style === 'bob') {
      ctx.beginPath();
      ctx.moveTo(cx - hw, headY - 0.05 * hh);
      ctx.bezierCurveTo(cx - hw * 1.05, headY - hh * 0.68, cx - hw * 0.58, headY - hh, cx, headY - hh);
      ctx.bezierCurveTo(cx + hw * 0.58, headY - hh, cx + hw * 1.05, headY - hh * 0.68, cx + hw, headY - 0.05 * hh);
      ctx.quadraticCurveTo(cx, headY - hh * 1.18, cx, headY - hh);
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
    }
  }

  function drawOneEye(ctx, ex, ey, ew, eh, eCol, kind) {
    if (kind === 'patch') {
      ctx.fillStyle = '#0a0810';
      ctx.beginPath();
      ctx.ellipse(ex, ey, ew * 1.1, eh * 1.05, 0, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    if (kind === 'cyborgR' || kind === 'cyborgG') {
      const glow = kind === 'cyborgR' ? '#ff6644' : '#44ffaa';
      ctx.fillStyle = '#1a2030';
      ctx.beginPath();
      ctx.ellipse(ex, ey, ew, eh, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(ex, ey, ew * 0.55, eh * 0.65, 0, 0, Math.PI * 2);
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
    ctx.fillStyle = '#050508';
    ctx.beginPath();
    ctx.ellipse(ex, ey + eh * 0.04, ew * 0.32, eh * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawEyes(ctx, g, eyeType, eCol) {
    const { cx, headY, hw, hh } = g;
    const eyeY = headY - hh * 0.06;
    const eSpread = hw * 0.38;
    const ew = hw * 0.15, eh = hh * 0.075;
    if (eyeType === 'goggles') {
      ctx.fillStyle = 'rgba(20,40,50,.75)';
      ctx.strokeStyle = '#7a9aaa';
      ctx.lineWidth = Math.max(1, hw * 0.04);
      const gx = cx - eSpread - ew * 1.1, gy = eyeY - eh * 1.2, gw = (eSpread + ew * 1.1) * 2, gh = eh * 2.4;
      roundRectCtx(ctx, gx, gy, gw, gh, eh * 0.5);
      ctx.fill();
      ctx.stroke();
      return;
    }
    const leftKind = eyeType === 'patch' ? 'patch' : eyeType === 'cyborgR' ? 'cyborgR' : eyeType === 'cyborgG' ? 'normal' : eyeType;
    const rightKind = eyeType === 'patch' ? 'normal' : eyeType === 'cyborgR' ? 'normal' : eyeType === 'cyborgG' ? 'cyborgG' : eyeType;
    drawOneEye(ctx, cx - eSpread, eyeY, ew, eh, eCol, leftKind);
    drawOneEye(ctx, cx + eSpread, eyeY, ew, eh, eCol, rightKind);
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
    const mY = headY + hh * 0.44, mW = hw * 0.22;
    ctx.fillStyle = sk.l;
    if (mouthType === 'smile' || mouthType === 'confident' || mouthType === 'open') {
      ctx.beginPath();
      ctx.moveTo(cx - mW, mY);
      ctx.quadraticCurveTo(cx, mY - hh * 0.065, cx + mW, mY);
      ctx.quadraticCurveTo(cx, mY + hh * 0.075, cx - mW, mY);
      ctx.closePath();
      ctx.fill();
    } else if (mouthType === 'smirk') {
      ctx.beginPath();
      ctx.moveTo(cx - mW * 0.85, mY + hh * 0.02);
      ctx.quadraticCurveTo(cx + mW * 0.2, mY - hh * 0.08, cx + mW, mY - hh * 0.02);
      ctx.strokeStyle = sk.d;
      ctx.lineWidth = Math.max(1.2, hw * 0.04);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx - mW * 0.9, mY);
      ctx.lineTo(cx + mW * 0.9, mY);
      ctx.strokeStyle = sk.d;
      ctx.lineWidth = Math.max(1.4, hw * 0.045);
      ctx.stroke();
    }
  }

  function drawFaceOverlay(ctx, g, seed) {
    const fac = portraitFaceFromSeed(seed);
    const rng = makeRng(seed ^ 0x9e3779b9);
    const sk = SKINS[fac.fHead % SKINS.length];
    const hCol = HAIR_COLS[fac.fHair % HAIR_COLS.length];
    const eCol = EYE_COLS[fac.fEye % EYE_COLS.length];
    const hStyle = fac.hairPath ? HAIR_STYLES[fac.fHairStyle % HAIR_STYLES.length] : 'bald';
    const eyeType = EYE_TYPES[fac.fEye % EYE_TYPES.length];
    const mouthType = MOUTH_TYPES[fac.fMouth % MOUTH_TYPES.length];
    drawHair(ctx, g, hStyle, hCol, sk, rng);
    drawEyes(ctx, g, eyeType, eCol);
    drawNoseMouth(ctx, g, mouthType, sk);
  }

  function drawPortraitBg(ctx, W, H, factionId) {
    const fCol = factionColor(factionId);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#041018');
    bg.addColorStop(0.45, '#0a1c28');
    bg.addColorStop(1, fCol + '33');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(80,200,180,.04)';
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
    return fCol;
  }

  function drawPortraitFrame(ctx, W, H) {
    const vig = ctx.createRadialGradient(W * 0.5, H * 0.48, W * 0.08, W * 0.5, H * 0.5, W * 0.82);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(0,8,12,.55)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(120,210,190,.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, W - 2, H - 2);
    ctx.strokeStyle = 'rgba(180,120,60,.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(3, 3, W - 6, H - 6);
  }

  function drawLayeredBust(ctx, W, H, seed, factionId) {
    const fCol = drawPortraitBg(ctx, W, H, factionId);
    const fac = portraitFaceFromSeed(seed);
    const hairTint = portraitHairTint(seed);
    const ov = L.overlay || {};
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    let rect = null;
    let drawn = false;

    if (atlas.ready && atlas.img) {
      rect = computeAtlasRect(W, H, atlas.img, seed);
      if (rect) {
        ctx.drawImage(
          atlas.img,
          rect.col * rect.cw, rect.row * rect.ch, rect.cw, rect.ch,
          rect.dx, rect.dy, rect.dw, rect.dh
        );
        drawn = true;
      }
    }

    if (!drawn) {
      const heads = (L.parts && L.parts.heads) || [];
      const path = heads[portraitAtlasIndex(seed) % Math.max(1, heads.length)];
      const im = PortraitParts.get(path);
      if (im) {
        const pad = 0.03;
        const maxW = W * (1 - 2 * pad);
        const maxH = H * (1 - 2 * pad);
        const sc = Math.min(maxW / im.naturalWidth, maxH / im.naturalHeight) * (L.view.scaleMul || 1);
        const dw = im.naturalWidth * sc;
        const dh = im.naturalHeight * sc;
        const dx = (W - dw) * 0.5;
        const dy = H * (L.view.centerYFrac || 0.52) - dh * 0.5;
        rect = { dx, dy, dw, dh };
        ctx.drawImage(im, dx, dy, dw, dh);
        drawn = true;
      }
    }

    if (!drawn || !rect) return false;

    // Capelli: tint SOLO sullo sprite overlay
    if (fac.hairPath) {
      const hairImg = PortraitParts.get(fac.hairPath);
      if (hairImg) {
        const tinted = tintHairSprite(hairImg, hairTint) || hairImg;
        const hr = overlayRect(rect, ov.hairScale || 1.22, ov.hairY != null ? ov.hairY : -0.06);
        ctx.drawImage(tinted, hr.dx, hr.dy, hr.dw, hr.dh);
      }
    }

    // Accessori (occhiali / visori / maschere) — nessun tint capelli
    if (fac.accPath) {
      const accImg = PortraitParts.get(fac.accPath);
      if (accImg) {
        const ar = overlayRect(rect, ov.accScale || 1.05, ov.accY != null ? ov.accY : 0.04);
        ctx.drawImage(accImg, ar.dx, ar.dy, ar.dw, ar.dh);
      }
    }

    const suitG = ctx.createLinearGradient(0, H * 0.82, 0, H);
    suitG.addColorStop(0, fCol + '00');
    suitG.addColorStop(1, fCol + '77');
    ctx.fillStyle = suitG;
    ctx.fillRect(0, H * 0.82, W, H * 0.18);

    drawPortraitFrame(ctx, W, H);
    return true;
  }

  function drawProcedural(ctx, W, H, seed, factionId) {
    const fCol = drawPortraitBg(ctx, W, H, factionId);
    const rng = makeRng(seed);
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

    drawFaceOverlay(ctx, g, seed);

    const suitG = ctx.createLinearGradient(0, H * 0.7, 0, H);
    suitG.addColorStop(0, fCol + 'aa');
    suitG.addColorStop(1, fCol + 'dd');
    ctx.fillStyle = suitG;
    ctx.fillRect(0, H * 0.7, W, H * 0.3);

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
      const forceProcedural = !!opt.procedural;

      if (!forceProcedural && drawLayeredBust(ctx, W, H, seed, factionId)) {
        return 'bust';
      }

      drawProcedural(ctx, W, H, seed, factionId);

      if (!atlas.ready && !atlas.loading) {
        PortraitAtlas.load().then((ok) => { if (ok) redrawActiveDialog(); });
      }
      if (!partsState.ready && !partsState.loading) {
        PortraitParts.load().then((ok) => { if (ok) redrawActiveDialog(); });
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
  global.portraitHairTint = portraitHairTint;
  global.PortraitAtlas = PortraitAtlas;
  global.PortraitHeads = PortraitHeads;
  global.PortraitParts = PortraitParts;
  global.PortraitRenderer = PortraitRenderer;

  Promise.all([PortraitAtlas.load(), PortraitParts.load()]).then(() => redrawActiveDialog());
})(typeof window !== 'undefined' ? window : globalThis);
