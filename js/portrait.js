'use strict';
/**
 * Ritratti — busti completi con alpha (chromakey #5B8FC4 processato offline).
 * Capelli già nel PNG. Nessun layer separato.
 */
(function (global) {
  const L = global.PORTRAIT_LAYOUT || {
    cols: 4, rows: 4, cellW: 128, cellH: 160,
    atlasPath: 'sprites/portraits.png',
    view: { pad: 0.01, centerYFrac: 0.5, scaleMul: 1.12 },
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

  function allBustIndices() {
    return Array.from({ length: N_BUSTS }, (_, i) => i);
  }

  function poolIndices(name) {
    const pools = L.pools || {};
    const list = pools[name];
    if (list && list.length) return list.filter((i) => i >= 0 && i < N_BUSTS);
    return allBustIndices();
  }

  function looksFeminineName(name) {
    if (!name || typeof name !== 'string') return false;
    const re = L.feminineNameRe || /a$|ina$|essa\b|paladina|castellana|serafina|selvaggia|vera\b|tartufa|piadina|copilota|dottore?ssa|ispettrice|notaia|capitana|dama\b|nonna|elsa\b|marina\b|lia\b/i;
    const s = String(name).trim();
    if (re.test(s)) return true;
    // Controlla primo token ("Marina del Porto", "Dottoressa Baldi")
    const first = s.split(/[\s"']+/).filter(Boolean)[0] || '';
    return !!(first && re.test(first));
  }

  /**
   * Sceglie il pool busto: pirate → pirati; nome femminile → donne;
   * altrimenti uomini/donne in base al seed (civili misti).
   */
  function resolvePortraitPool(seed, opt) {
    opt = opt || {};
    if (opt.pool && L.pools && L.pools[opt.pool]) return poolIndices(opt.pool);
    const fac = String(opt.factionId || opt.faction || '');
    const kind = String(opt.kind || opt.gender || '').toLowerCase();
    if (fac === 'pirate' || kind === 'pirate' || kind === 'pirates') return poolIndices('pirate');
    if (kind === 'f' || kind === 'female' || kind === 'women' || kind === 'woman') return poolIndices('women');
    if (kind === 'm' || kind === 'male' || kind === 'men' || kind === 'man') return poolIndices('men');
    if (looksFeminineName(opt.name || opt.displayName)) return poolIndices('women');
    // Civili: ~38% donne (pool più piccolo), resto uomini
    const x = ((seed * 1103515245 + 12345) >>> 0);
    if ((x % 100) < 38) return poolIndices('women');
    return poolIndices('men');
  }

  function portraitAtlasIndex(seed, opt) {
    const pool = resolvePortraitPool(seed, opt);
    const x = ((seed * 1103515245 + 12345) >>> 0);
    return pool[x % Math.max(1, pool.length)];
  }

  function portraitHueFromSeed(seed) {
    return ((seed * 37) % 360);
  }

  function portraitFaceFromSeed(seed, opt) {
    const idx = portraitAtlasIndex(seed, opt);
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
    if (factionId === 'pirate') return '#ff5533';
    const f = global.FACTIONS && global.FACTIONS[factionId];
    return f ? f.color : '#3ecfbb';
  }

  function PortraitParts_loadExtras() {
    const urls = [];
    const push = (u) => { if (u && urls.indexOf(u) < 0) urls.push(u); };
    ((L.parts && L.parts.heads) || []).forEach(push);
    if (L.player) push(L.player.head);
    // Ritratti dedicati equipaggio (CREW_POOL.portrait)
    const pool = global.CREW_POOL || [];
    pool.forEach((c) => { if (c && c.portrait) push(c.portrait); });
    return urls;
  }

  const PortraitParts = {
    load() {
      if (partsState.ready) return Promise.resolve(partsState.ok > 0);
      if (partsState.promise) return partsState.promise;
      const urls = PortraitParts_loadExtras();
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
    get ready() { return partsState.ready && partsState.ok > 0; },
    reloadCrew() {
      // Permette di ricaricare se CREW_POOL arriva dopo
      const urls = [];
      (global.CREW_POOL || []).forEach((c) => {
        if (c && c.portrait && !partCache[c.portrait]) urls.push(c.portrait);
      });
      if (!urls.length) return Promise.resolve(true);
      return Promise.all(urls.map((u) =>
        loadImage(absUrl(u)).then((im) => { partCache[u] = im; partsState.ok++; return true; }).catch(() => false)
      )).then(() => redrawAllVisiblePortraits());
    }
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
    const pad = (L.view && L.view.pad != null) ? L.view.pad : 0.01;
    const scaleMul = (L.view && L.view.scaleMul != null) ? L.view.scaleMul : 1.12;
    const maxW = Math.max(12, W * (1 - 2 * pad));
    const maxH = Math.max(12, H * (1 - 2 * pad));
    const sc = Math.min(maxW / iw, maxH / ih) * scaleMul;
    const dw = iw * sc, dh = ih * sc;
    return {
      dx: (W - dw) * 0.5,
      dy: H * ((L.view && L.view.centerYFrac) || 0.5) - dh * 0.5,
      dw, dh
    };
  }

  function drawPortraitBg(ctx, W, H, factionId) {
    const fCol = factionColor(factionId);
    // Mid-tone lit plate — faces stay readable over teal/copper uniforms
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#4a6578');
    bg.addColorStop(0.4, '#354858');
    bg.addColorStop(1, '#1e303c');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * 0.5, H * 0.38, 4, W * 0.5, H * 0.42, W * 0.62);
    glow.addColorStop(0, 'rgba(255,240,210,.42)');
    glow.addColorStop(0.5, 'rgba(120,200,180,.14)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    // Faction tint plate (stronger identity)
    const tint = ctx.createLinearGradient(0, 0, W, H);
    tint.addColorStop(0, fCol + '28');
    tint.addColorStop(0.55, 'transparent');
    tint.addColorStop(1, fCol + '40');
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, W, H);
    // Faction tint strip at bottom
    const strip = ctx.createLinearGradient(0, H * 0.72, 0, H);
    strip.addColorStop(0, 'transparent');
    strip.addColorStop(1, fCol + '77');
    ctx.fillStyle = strip;
    ctx.fillRect(0, H * 0.72, W, H * 0.28);
    // Side accent bar
    ctx.fillStyle = fCol + 'aa';
    ctx.fillRect(0, 0, Math.max(3, W * 0.035), H);
    return fCol;
  }

  function drawPortraitFrame(ctx, W, H) {
    const vig = ctx.createRadialGradient(W * 0.5, H * 0.48, W * 0.18, W * 0.5, H * 0.5, W * 0.95);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(0,8,12,.28)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(120,210,190,.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
    ctx.strokeStyle = 'rgba(196,137,58,.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, W - 8, H - 8);
  }

  function atlasTile(seed, opt) {
    if (!atlas.ready || !atlas.img) return null;
    const cols = L.cols || 4, rows = L.rows || 4;
    const cw = Math.floor(atlas.img.naturalWidth / cols);
    const ch = Math.floor(atlas.img.naturalHeight / rows);
    const maxTile = Math.min(N_BUSTS, cols * rows);
    const idx = portraitAtlasIndex(seed, opt) % maxTile;
    const col = idx % cols, row = (idx / cols) | 0;
    if (row >= rows) return null;
    const tile = document.createElement('canvas');
    tile.width = cw; tile.height = ch;
    tile.getContext('2d').drawImage(atlas.img, col * cw, row * ch, cw, ch, 0, 0, cw, ch);
    return tile;
  }

  function resolveCrewPortraitPath(opt) {
    opt = opt || {};
    if (opt.portraitPath) return opt.portraitPath;
    const id = opt.crewId || opt.crew || null;
    if (!id || !global.CREW_POOL) return null;
    const c = global.CREW_POOL.find((x) => x && x.id === id);
    return c && c.portrait ? c.portrait : null;
  }

  function drawOpaqueBustImage(ctx, im, rect) {
    // Composita su offscreen forzando alpha piena sui pixel non trasparenti
    const tw = Math.max(1, Math.round(rect.dw));
    const th = Math.max(1, Math.round(rect.dh));
    const off = document.createElement('canvas');
    off.width = tw; off.height = th;
    const octx = off.getContext('2d');
    octx.imageSmoothingEnabled = true;
    octx.imageSmoothingQuality = 'high';
    octx.drawImage(im, 0, 0, tw, th);
    try {
      const img = octx.getImageData(0, 0, tw, th);
      const d = img.data;
      for (let i = 3; i < d.length; i += 4) {
        if (d[i] > 28) d[i] = 255;
        else d[i] = 0;
      }
      octx.putImageData(img, 0, 0);
    } catch (_) { /* tainted / privacy — usa così com'è */ }
    ctx.drawImage(off, rect.dx, rect.dy, rect.dw, rect.dh);
  }

  function drawBust(ctx, W, H, seed, factionId, opt) {
    opt = opt || {};
    const drawOpt = Object.assign({}, opt, { factionId: factionId || opt.factionId });
    drawPortraitBg(ctx, W, H, factionId);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const isPlayer = !!opt.player;
    const playerL = L.player || {};
    let path = null;
    if (isPlayer && playerL.head) path = playerL.head;
    else {
      path = resolveCrewPortraitPath(drawOpt);
      if (!path) {
        const heads = (L.parts && L.parts.heads) || [];
        const idx = portraitAtlasIndex(seed, drawOpt);
        path = heads[idx % Math.max(1, heads.length)];
      }
    }
    let im = PortraitParts.get(path);
    if (!im && path) {
      // lazy load missing crew portrait
      PortraitParts.reloadCrew();
    }
    if (!im && !isPlayer && !resolveCrewPortraitPath(drawOpt)) im = atlasTile(seed, drawOpt);
    if (!im) return false;

    const iw = im.naturalWidth || im.width || 128;
    const ih = im.naturalHeight || im.height || 160;
    const rect = bustDestRect(W, H, iw, ih);
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(W * 0.5, rect.dy + rect.dh * 0.92, rect.dw * 0.38, rect.dh * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawOpaqueBustImage(ctx, im, rect);
    drawPortraitFrame(ctx, W, H);
    return true;
  }

  function drawProcedural(ctx, W, H, seed, factionId, opt) {
    opt = opt || {};
    const isPlayer = !!opt.player;
    const fCol = drawPortraitBg(ctx, W, H, factionId);
    const cx = W / 2, headY = H * 0.42, hw = W * 0.28, hh = H * 0.28;
    const skins = ['#f0d2b0', '#e8c4a0', '#c9956c', '#8d5a3c'];
    const sk = isPlayer ? '#e8c8a8' : skins[seed % skins.length];
    // shoulders
    ctx.fillStyle = isPlayer ? '#1a3a3a' : fCol;
    ctx.beginPath();
    ctx.moveTo(W * 0.08, H);
    ctx.quadraticCurveTo(W * 0.5, H * 0.62, W * 0.92, H);
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#b87333';
    ctx.fillRect(W * 0.12, H * 0.72, W * 0.18, H * 0.08);
    ctx.fillRect(W * 0.70, H * 0.72, W * 0.18, H * 0.08);
    // head
    ctx.fillStyle = sk;
    ctx.beginPath();
    ctx.ellipse(cx, headY, hw, hh, 0, 0, Math.PI * 2);
    ctx.fill();
    // hair: Zvan = bianco/argento (intro_03); NPC = varietà
    ctx.fillStyle = isPlayer ? '#e8e6e2' : ['#1a1008', '#3a2810', '#c8c8c8', '#7a2010', '#0a0a0a', '#4a3020'][seed % 6];
    ctx.beginPath();
    ctx.ellipse(cx, headY - hh * 0.45, hw * 1.08, hh * 0.62, 0, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - hw * 0.85, headY - hh * 0.05, hw * 0.28, hh * 0.45, -0.3, 0, Math.PI * 2);
    ctx.ellipse(cx + hw * 0.85, headY - hh * 0.05, hw * 0.28, hh * 0.45, 0.3, 0, Math.PI * 2);
    ctx.fill();
    if (isPlayer) {
      // volume laterale / ciuffo argento come intro_03
      ctx.fillStyle = '#f4f2ee';
      ctx.beginPath();
      ctx.ellipse(cx - hw * 0.15, headY - hh * 0.72, hw * 0.55, hh * 0.28, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1a1210';
      ctx.fillRect(cx - hw * 0.42, headY - hh * 0.28, hw * 0.28, hh * 0.07);
      ctx.fillRect(cx + hw * 0.14, headY - hh * 0.28, hw * 0.28, hh * 0.07);
    }
    // eyes
    ctx.fillStyle = '#1a1210';
    ctx.beginPath();
    ctx.ellipse(cx - hw * 0.35, headY - hh * 0.05, hw * 0.12, hh * 0.1, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + hw * 0.35, headY - hh * 0.05, hw * 0.12, hh * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5a3828';
    ctx.lineWidth = Math.max(1.5, W / 64);
    ctx.beginPath();
    ctx.moveTo(cx - hw * 0.28, headY + hh * 0.32);
    ctx.quadraticCurveTo(cx, headY + hh * 0.48, cx + hw * 0.28, headY + hh * 0.32);
    ctx.stroke();
    drawPortraitFrame(ctx, W, H);
  }

  function redrawAllVisiblePortraits() {
    redrawActiveDialog();
    const doc = global.document;
    if (!doc) return;
    doc.querySelectorAll('canvas.crew-port').forEach((cv) => {
      const seed = +cv.dataset.seed | 0;
      const fac = cv.dataset.fac || 'bazzano';
      const name = cv.dataset.name || '';
      const crewId = cv.dataset.crew || '';
      PortraitRenderer.drawCanvas(cv, seed, fac, { name: name, crewId: crewId });
    });
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
      name: npc.displayName || npc.name,
      kind: npc.type === 'pirate' ? 'pirate' : undefined
    });
  }

  const PortraitRenderer = {
    layout: L,
    draw(ctx, W, H, opt) {
      opt = opt || {};
      const seed = opt.seed != null ? opt.seed : 1;
      const factionId = opt.factionId || 'bazzano';
      const ok = drawBust(ctx, W, H, seed, factionId, opt);
      if (!ok) drawProcedural(ctx, W, H, seed, factionId, opt);
      if (!partsState.ready && !partsState.loading) {
        PortraitParts.load().then(() => redrawAllVisiblePortraits());
      }
      if (!atlas.ready && !atlas.loading) {
        PortraitAtlas.load().then(() => redrawAllVisiblePortraits());
      }
      return ok ? 'bust' : 'procedural';
    },
    drawCanvas(canvas, seed, factionId, opt) {
      opt = Object.assign({}, opt || {}, { seed, factionId });
      return PortraitRenderer.draw(canvas.getContext('2d'), canvas.width, canvas.height, opt);
    },
    drawPlayer(canvas) {
      return PortraitRenderer.drawCanvas(canvas, 1, 'bazzano', { player: true });
    },
    resolvePool: resolvePortraitPool,
    poolIndices: poolIndices
  };

  global.portraitFaceFromSeed = portraitFaceFromSeed;
  global.portraitHueFromSeed = portraitHueFromSeed;
  global.portraitAtlasIndex = portraitAtlasIndex;
  global.resolvePortraitPool = resolvePortraitPool;
  /** Capelli Zvan: argento/bianco come in sprites/story/intro/intro_03.jpg */
  global.portraitHairTint = function () { return '#e8e6e2'; };
  global.PortraitAtlas = PortraitAtlas;
  global.PortraitHeads = PortraitParts;
  global.PortraitParts = PortraitParts;
  global.PortraitRenderer = PortraitRenderer;

  Promise.all([PortraitParts.load(), PortraitAtlas.load()]).then(() => {
    PortraitParts.reloadCrew();
    redrawAllVisiblePortraits();
  });
  // CREW_POOL è definito dopo questo script: ricarica quando il DOM è pronto
  if (global.document) {
    global.document.addEventListener('DOMContentLoaded', () => {
      PortraitParts.reloadCrew();
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
