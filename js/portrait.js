'use strict';
/**
 * Portrait — compositing pezzi faccia AI + atlas bust + fallback procedurale
 * Stile: retro-sci-fi Forbidden Planet (teal / rame / film grain)
 */
(function (global) {
  const L = global.PORTRAIT_LAYOUT || {
    cols: 4, rows: 2, cellW: 128, cellH: 160,
    atlasPath: 'sprites/portraits.png',
    view: { pad: 0.06, centerYFrac: 0.52, scaleMul: 1.0 },
    face: { cxFrac: 0.5, headYFrac: 0.36, hwFrac: 0.38, hhFrac: 0.40 },
    parts: { heads: [], eyes: {}, hair: {}, mouths: {}, accessories: [] }
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
  const partCache = Object.create(null);
  const partsState = { ready: false, loading: false, promise: null, ok: 0, fail: 0 };

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
    const P = L.parts || {};
    const urls = [];
    (P.heads || []).forEach((u) => { if (u) urls.push(u); });
    Object.values(P.eyes || {}).forEach((u) => { if (u) urls.push(u); });
    Object.values(P.hair || {}).forEach((u) => { if (u) urls.push(u); });
    Object.values(P.mouths || {}).forEach((u) => { if (u) urls.push(u); });
    (P.accessories || []).forEach((u) => { if (u) urls.push(u); });
    return [...new Set(urls)];
  }

  const PortraitParts = {
    load() {
      if (partsState.ready) return Promise.resolve(partsState.ok > 0);
      if (partsState.promise) return partsState.promise;
      partsState.loading = true;
      const urls = collectPartUrls();
      partsState.promise = Promise.all(urls.map((u) =>
        loadImage(absUrl(u)).then((im) => {
          partCache[u] = im;
          partsState.ok++;
          return true;
        }).catch(() => {
          partsState.fail++;
          return false;
        })
      )).then(() => {
        partsState.ready = true;
        partsState.loading = false;
        if (typeof global.console !== 'undefined') {
          global.console.info('[portrait] Face parts OK:', partsState.ok, 'fail:', partsState.fail);
        }
        return partsState.ok > 0;
      });
      return partsState.promise;
    },
    get(path) { return path ? partCache[path] || null : null; },
    get ready() { return partsState.ready && partsState.ok > 0; }
  };

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

  function drawPartFit(ctx, im, dx, dy, dw, dh, opt) {
    if (!im) return;
    opt = opt || {};
    ctx.save();
    if (opt.filter) ctx.filter = opt.filter;
    if (opt.alpha != null) ctx.globalAlpha = opt.alpha;
    if (opt.composite) ctx.globalCompositeOperation = opt.composite;
    ctx.drawImage(im, dx, dy, dw, dh);
    ctx.restore();
  }

  /* ── Procedural overlays (fallback / spice) ── */
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
    } else if (style === 'medium' || style === 'wavy') {
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

  function drawEyes(ctx, g, eyeType, eCol, hCol, rng) {
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

  function drawAccessories(ctx, g, seed, factionId, fCol, W, rng) {
    const { cx, headY, hw, hh } = g;
    if ((seed % 5) === 0) {
      ctx.strokeStyle = fCol;
      ctx.lineWidth = Math.max(1, hw * 0.035);
      ctx.beginPath();
      ctx.arc(cx + hw * 0.72, headY + hh * 0.1, hw * 0.12, 0, Math.PI * 2);
      ctx.stroke();
    }
    if ((seed % 7) === 2) {
      ctx.strokeStyle = 'rgba(180,120,80,.55)';
      ctx.lineWidth = Math.max(0.8, hw * 0.025);
      ctx.beginPath();
      ctx.moveTo(cx - hw * 0.55, headY + hh * 0.05);
      ctx.lineTo(cx - hw * 0.15, headY + hh * 0.35);
      ctx.stroke();
    }
  }

  function drawFaceOverlay(ctx, g, seed, factionId, W) {
    const fac = portraitFaceFromSeed(seed);
    const rng = makeRng(seed ^ 0x9e3779b9);
    const sk = SKINS[fac.fHead % SKINS.length];
    const hCol = HAIR_COLS[(fac.fHair + fac.fHead) % HAIR_COLS.length];
    const eCol = EYE_COLS[fac.fEye % EYE_TYPES.length];
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
    bg.addColorStop(0, '#041018');
    bg.addColorStop(0.45, '#0a1c28');
    bg.addColorStop(1, fCol + '33');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    // subtle teal scanlines
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

  /** Compositing pezzi AI randomizzati da seed */
  function drawModularComposite(ctx, W, H, seed, factionId, hue) {
    const P = L.parts;
    if (!P || !P.heads || !P.heads.length) return false;
    const fac = portraitFaceFromSeed(seed);
    const rng = makeRng(seed ^ 0xa5a5a5);
    const headPath = P.heads[fac.fHead % P.heads.length];
    const headIm = PortraitParts.get(headPath);
    if (!headIm) return false;

    const hStyle = HAIR_STYLES[fac.fHair % HAIR_STYLES.length];
    const eyeType = EYE_TYPES[fac.fEye % EYE_TYPES.length];
    const mouthType = MOUTH_TYPES[fac.fMouth % MOUTH_TYPES.length];
    const hairPath = P.hair && P.hair[hStyle];
    const eyePath = P.eyes && P.eyes[eyeType];
    const mouthPath = P.mouths && P.mouths[mouthType];
    const accPath = (P.accessories || [])[Math.floor(rng(0, P.accessories.length))];

    const fCol = drawPortraitBg(ctx, W, H, factionId);
    const pad = 0.04;
    const maxW = W * (1 - 2 * pad);
    const maxH = H * (1 - 2 * pad);
    const sc = Math.min(maxW / headIm.naturalWidth, maxH / headIm.naturalHeight);
    const dw = headIm.naturalWidth * sc;
    const dh = headIm.naturalHeight * sc;
    const dx = (W - dw) * 0.5;
    const dy = H * 0.52 - dh * 0.5;

    ctx.save();
    if (hue != null && !isNaN(hue)) {
      // mild hue only — keep teal/copper feel
      const mild = ((hue % 40) - 20);
      ctx.filter = `hue-rotate(${mild}deg) saturate(1.08) contrast(1.05)`;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(headIm, dx, dy, dw, dh);
    ctx.restore();

    // Mouth overlay (lower third of face)
    const mouthIm = PortraitParts.get(mouthPath);
    if (mouthIm) {
      const mw = dw * 0.72, mh = dh * 0.42;
      drawPartFit(ctx, mouthIm, dx + (dw - mw) * 0.5, dy + dh * 0.48, mw, mh, { alpha: 0.92 });
    }

    // Eyes overlay
    const eyeIm = PortraitParts.get(eyePath);
    if (eyeIm) {
      const ew = dw * 0.78, eh = dh * 0.38;
      const filter = eyeType === 'alien' ? 'hue-rotate(40deg) saturate(1.4)'
        : eyeType === 'blue' ? 'hue-rotate(-20deg) saturate(1.2)'
        : eyeType === 'cyborgG' ? 'hue-rotate(80deg)'
        : null;
      drawPartFit(ctx, eyeIm, dx + (dw - ew) * 0.5, dy + dh * 0.22, ew, eh, { alpha: 0.95, filter });
      if (eyeType === 'patch') {
        ctx.fillStyle = 'rgba(8,6,10,.85)';
        ctx.beginPath();
        ctx.ellipse(dx + dw * 0.32, dy + dh * 0.38, dw * 0.1, dh * 0.07, -0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Hair on top
    const hairIm = PortraitParts.get(hairPath);
    if (hairIm) {
      const hw = dw * 1.08, hh = dh * 0.72;
      drawPartFit(ctx, hairIm, dx + (dw - hw) * 0.5, dy - dh * 0.06, hw, hh, { alpha: 0.98 });
    }

    // Accessory
    const accIm = PortraitParts.get(accPath);
    if (accIm) {
      const aw = dw * 0.85, ah = dh * 0.55;
      drawPartFit(ctx, accIm, dx + (dw - aw) * 0.5, dy + dh * 0.28, aw, ah, { alpha: 0.9 });
    }

    // Faction collar strip
    const suitG = ctx.createLinearGradient(0, H * 0.78, 0, H);
    suitG.addColorStop(0, fCol + '00');
    suitG.addColorStop(0.35, fCol + '66');
    suitG.addColorStop(1, fCol + 'bb');
    ctx.fillStyle = suitG;
    ctx.fillRect(0, H * 0.78, W, H * 0.22);

    // Copper corner marks (Forbidden Planet UI)
    ctx.strokeStyle = 'rgba(200,140,60,.45)';
    ctx.lineWidth = 1.5;
    const c = 10;
    [[0, 0], [W, 0], [0, H], [W, H]].forEach(([ox, oy], i) => {
      const sx = ox === 0 ? 1 : -1, sy = oy === 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(ox + sx * c, oy);
      ctx.lineTo(ox, oy);
      ctx.lineTo(ox, oy + sy * c);
      ctx.stroke();
    });

    drawPortraitFrame(ctx, W, H);
    return true;
  }

  function drawAtlasComposite(ctx, W, H, seed, factionId, hue) {
    const im = atlas.img;
    if (!im || !im.naturalWidth) return false;
    const rect = computeAtlasRect(W, H, im, seed);
    if (!rect) return false;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, W, H);
    drawPortraitBg(ctx, W, H, factionId);

    ctx.save();
    if (hue != null && !isNaN(hue)) ctx.filter = `hue-rotate(${((hue % 36) - 18)}deg) saturate(1.06)`;
    ctx.drawImage(im, rect.col * rect.cw, rect.row * rect.ch, rect.cw, rect.ch, rect.dx, rect.dy, rect.dw, rect.dh);
    ctx.restore();

    // Layer AI parts over atlas bust when available
    if (PortraitParts.ready) {
      const fac = portraitFaceFromSeed(seed);
      const P = L.parts;
      const hStyle = HAIR_STYLES[fac.fHair % HAIR_STYLES.length];
      const eyeType = EYE_TYPES[fac.fEye % EYE_TYPES.length];
      const mouthType = MOUTH_TYPES[fac.fMouth % MOUTH_TYPES.length];
      const eyeIm = PortraitParts.get(P.eyes && P.eyes[eyeType]);
      const hairIm = PortraitParts.get(P.hair && P.hair[hStyle]);
      const mouthIm = PortraitParts.get(P.mouths && P.mouths[mouthType]);
      if (mouthIm) drawPartFit(ctx, mouthIm, rect.dx + rect.dw * 0.12, rect.dy + rect.dh * 0.48, rect.dw * 0.76, rect.dh * 0.4, { alpha: 0.88 });
      if (eyeIm) drawPartFit(ctx, eyeIm, rect.dx + rect.dw * 0.1, rect.dy + rect.dh * 0.22, rect.dw * 0.8, rect.dh * 0.36, { alpha: 0.9 });
      if (hairIm) drawPartFit(ctx, hairIm, rect.dx - rect.dw * 0.04, rect.dy - rect.dh * 0.05, rect.dw * 1.08, rect.dh * 0.7, { alpha: 0.95 });
    } else {
      const g = faceGeomFromRect(rect);
      drawFaceOverlay(ctx, g, seed, factionId, W);
    }

    const fCol = factionColor(factionId);
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

      if (!forceProcedural && PortraitParts.ready && drawModularComposite(ctx, W, H, seed, factionId, hue)) {
        return 'modular';
      }
      if (!forceProcedural && atlas.ready && drawAtlasComposite(ctx, W, H, seed, factionId, hue)) {
        return 'atlas+overlay';
      }

      drawProcedural(ctx, W, H, seed, factionId);

      if (!partsState.ready && !partsState.loading) {
        PortraitParts.load().then((ok) => { if (ok) redrawActiveDialog(); });
      }
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
  global.PortraitParts = PortraitParts;
  global.PortraitRenderer = PortraitRenderer;

  Promise.all([PortraitParts.load(), PortraitAtlas.load()]).then(() => redrawActiveDialog());
})(typeof window !== 'undefined' ? window : globalThis);
