'use strict';
/**
 * Ritratti — busti completi con alpha (chromakey #00C878 processato offline).
 * Nessun layer capelli/accessori: la faccia è già nel PNG.
 */
(function (global) {
  const L = global.PORTRAIT_LAYOUT || {
    cols: 4, rows: 4, cellW: 128, cellH: 160,
    atlasPath: 'sprites/portraits.png',
    view: { pad: 0.02, centerYFrac: 0.52, scaleMul: 1 },
    player: { head: 'sprites/faces/player/zvan_complete.png', complete: true },
    parts: { heads: [] }
  };

  const N_BUSTS = Math.max(1, ((L.parts && L.parts.heads) || []).length || 12);
  const partCache = Object.create(null);
  const partsState = { ready: false, loading: false, promise: null, ok: 0 };
  const atlas = { img: null, ready: false, loading: false, promise: null };

  function absUrl(path) {
    if (!path) return path;
    if (/^https?:|^data:|^blob:/i.test(path)) return path;
    try {
      const base = (global.document && global.document.baseURI) || (global.location && global.location.href) || '';
      return base ? new URL(path, base).href : path;
    } catch (_) { return path; }
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

  function portraitAtlasIndex(seed) {
    const x = ((seed * 1103515245 + 12345) >>> 0);
    return x % N_BUSTS;
  }

  function portraitHueFromSeed(seed) {
    return ((seed * 37) % 360);
  }

  function portraitFaceFromSeed(seed) {
    const idx = portraitAtlasIndex(seed);
    const heads = (L.parts && L.parts.heads) || [];
    return {
      fHead: idx,
      bustPath: heads[idx % Math.max(1, heads.length)] || null,
      fHairStyle: 0,
      hairPath: null,
      accPath: null
    };
  }

  function factionColor(factionId) {
    const f = global.FACTIONS && global.FACTIONS[factionId];
    return f ? f.color : '#3ecfbb';
  }

  const PortraitParts = {
    load() {
      if (partsState.ready) return Promise.resolve(partsState.ok > 0);
      if (partsState.promise) return partsState.promise;
      const urls = [];
      const push = (u) => { if (u && urls.indexOf(u) < 0) urls.push(u); };
      ((L.parts && L.parts.heads) || []).forEach(push);
      if (L.player) push(L.player.head);
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

  const PortraitAtlas = {
    load() {
      if (atlas.ready) return Promise.resolve(true);
      if (atlas.promise) return atlas.promise;
      atlas.loading = true;
      atlas.promise = loadImage(absUrl(L.atlasPath))
        .then((im) => {
          atlas.img = im;
          atlas.ready = im.naturalWidth > 0;
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

  function bustDestRect(W, H, iw, ih) {
    const pad = (L.view && L.view.pad != null) ? L.view.pad : 0.02;
    const scaleMul = (L.view && L.view.scaleMul != null) ? L.view.scaleMul : 1;
    const maxW = Math.max(12, W * (1 - 2 * pad));
    const maxH = Math.max(12, H * (1 - 2 * pad));
    const sc = Math.min(maxW / iw, maxH / ih) * scaleMul;
    const dw = iw * sc, dh = ih * sc;
    return {
      dx: (W - dw) * 0.5,
      dy: H * ((L.view && L.view.centerYFrac) || 0.52) - dh * 0.5,
      dw, dh
    };
  }

  function drawPortraitBg(ctx, W, H, factionId) {
    const fCol = factionColor(factionId);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#243848');
    bg.addColorStop(0.45, '#1a303c');
    bg.addColorStop(1, fCol + '66');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * 0.5, H * 0.4, 2, W * 0.5, H * 0.45, W * 0.55);
    glow.addColorStop(0, 'rgba(255,236,210,.32)');
    glow.addColorStop(0.55, 'rgba(100,190,170,.1)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    return fCol;
  }

  function drawPortraitFrame(ctx, W, H) {
    const vig = ctx.createRadialGradient(W * 0.5, H * 0.48, W * 0.15, W * 0.5, H * 0.5, W * 0.9);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(0,8,12,.35)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(120,210,190,.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, W - 2, H - 2);
    ctx.strokeStyle = 'rgba(180,120,60,.28)';
    ctx.lineWidth = 1;
    ctx.strokeRect(3, 3, W - 6, H - 6);
  }

  function drawBust(ctx, W, H, seed, factionId, opt) {
    opt = opt || {};
    const fCol = drawPortraitBg(ctx, W, H, factionId);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const isPlayer = !!opt.player;
    const playerL = L.player || {};
    let path = null;
    if (isPlayer && playerL.head) path = playerL.head;
    else {
      const heads = (L.parts && L.parts.heads) || [];
      path = heads[portraitAtlasIndex(seed) % Math.max(1, heads.length)];
    }
    let im = PortraitParts.get(path);
    if (!im && atlas.ready && atlas.img && !isPlayer) {
      const cols = L.cols || 4, rows = L.rows || 4;
      const cw = Math.floor(atlas.img.naturalWidth / cols);
      const ch = Math.floor(atlas.img.naturalHeight / rows);
      const idx = portraitAtlasIndex(seed) % (cols * rows);
      const col = idx % cols, row = (idx / cols) | 0;
      const tile = document.createElement('canvas');
      tile.width = cw; tile.height = ch;
      tile.getContext('2d').drawImage(atlas.img, col * cw, row * ch, cw, ch, 0, 0, cw, ch);
      im = tile;
    }
    if (!im) return false;
    const iw = im.naturalWidth || im.width || 128;
    const ih = im.naturalHeight || im.height || 160;
    const rect = bustDestRect(W, H, iw, ih);
    ctx.drawImage(im, rect.dx, rect.dy, rect.dw, rect.dh);

    const suitG = ctx.createLinearGradient(0, H * 0.84, 0, H);
    suitG.addColorStop(0, fCol + '00');
    suitG.addColorStop(1, fCol + '66');
    ctx.fillStyle = suitG;
    ctx.fillRect(0, H * 0.84, W, H * 0.16);
    drawPortraitFrame(ctx, W, H);
    return true;
  }

  function drawProcedural(ctx, W, H, seed, factionId) {
    const fCol = drawPortraitBg(ctx, W, H, factionId);
    const cx = W / 2, headY = H * 0.42, hw = W * 0.22, hh = H * 0.26;
    const skins = ['#e8c4a0', '#c9956c', '#8d5a3c', '#f0d2b0'];
    const sk = skins[seed % skins.length];
    ctx.fillStyle = sk;
    ctx.beginPath();
    ctx.ellipse(cx, headY, hw, hh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1210';
    ctx.beginPath();
    ctx.ellipse(cx - hw * 0.35, headY - hh * 0.05, hw * 0.12, hh * 0.1, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + hw * 0.35, headY - hh * 0.05, hw * 0.12, hh * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5a3828';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - hw * 0.25, headY + hh * 0.35);
    ctx.quadraticCurveTo(cx, headY + hh * 0.5, cx + hw * 0.25, headY + hh * 0.35);
    ctx.stroke();
    // hair cap
    ctx.fillStyle = ['#1a1008', '#3a2810', '#c8c8c8', '#7a2010'][seed % 4];
    ctx.beginPath();
    ctx.ellipse(cx, headY - hh * 0.55, hw * 1.05, hh * 0.55, 0, Math.PI, 0);
    ctx.fill();
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
      factionId: npc.faction
    });
  }

  const PortraitRenderer = {
    layout: L,
    draw(ctx, W, H, opt) {
      opt = opt || {};
      const seed = opt.seed != null ? opt.seed : 1;
      const factionId = opt.factionId || 'bazzano';
      if (drawBust(ctx, W, H, seed, factionId, opt)) {
        if (!partsState.ready && !partsState.loading) {
          PortraitParts.load().then(() => redrawActiveDialog());
        }
        return 'bust';
      }
      drawProcedural(ctx, W, H, seed, factionId);
      if (!partsState.ready && !partsState.loading) {
        PortraitParts.load().then(() => redrawActiveDialog());
      }
      if (!atlas.ready && !atlas.loading) {
        PortraitAtlas.load().then(() => redrawActiveDialog());
      }
      return 'procedural';
    },
    drawCanvas(canvas, seed, factionId, opt) {
      opt = Object.assign({}, opt || {}, { seed, factionId });
      return PortraitRenderer.draw(canvas.getContext('2d'), canvas.width, canvas.height, opt);
    },
    drawPlayer(canvas) {
      return PortraitRenderer.drawCanvas(canvas, 1, 'bazzano', { player: true });
    }
  };

  global.portraitFaceFromSeed = portraitFaceFromSeed;
  global.portraitHueFromSeed = portraitHueFromSeed;
  global.portraitAtlasIndex = portraitAtlasIndex;
  global.portraitHairTint = function () { return '#222'; };
  global.PortraitAtlas = PortraitAtlas;
  global.PortraitHeads = PortraitParts;
  global.PortraitParts = PortraitParts;
  global.PortraitRenderer = PortraitRenderer;

  Promise.all([PortraitParts.load(), PortraitAtlas.load()]).then(() => redrawActiveDialog());
})(typeof window !== 'undefined' ? window : globalThis);
