'use strict';
/**
 * Minigame UX — joystick, steer, HUD overlay, opzioni.
 */
(function (global) {
  const LS_KEY = 'valsaelite_minigame_opts_v1';
  const MINIGAME_OPTS = {
    vibe: true,
    mouseSteer: false,
    autoAim: false,
    tapMove: false,
    uiScale: 1
  };

  function loadOpts() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const o = JSON.parse(raw);
      if (o) Object.assign(MINIGAME_OPTS, o);
    } catch (_) {}
  }
  function saveOpts() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(MINIGAME_OPTS)); } catch (_) {}
  }
  loadOpts();

  const SUBORBIT_STEER = { nx: 0, ny: 0, active: false };
  const BOARDING_JOY = { dx: 0, dy: 0, len: 0 };

  function tryVibe(ms) {
    if (!MINIGAME_OPTS.vibe || typeof global.tryVibrate !== 'function') return;
    try { global.tryVibrate(ms); } catch (_) {}
  }

  function isCoarsePointer() {
    try {
      return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    } catch (_) { return false; }
  }

  function isMobileLayout() {
    try {
      return window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
    } catch (_) { return false; }
  }

  /** Virtual joystick bound to a base element. */
  function bindJoystick(baseId, knobId, onVec, opts) {
    opts = opts || {};
    const dead = opts.deadzone != null ? opts.deadzone : 0.14;
    const maxR = opts.radius != null ? opts.radius : 52;
    const base = document.getElementById(baseId);
    const knob = document.getElementById(knobId);
    if (!base || !knob) return null;
    let pid = null;
    let cx = 0, cy = 0;

    const setVec = (nx, ny) => {
      const len = Math.hypot(nx, ny);
      if (len < dead) { onVec(0, 0, 0); return; }
      const s = Math.min(1, len);
      onVec(nx / len * s, ny / len * s, s);
    };

    const reset = () => {
      pid = null;
      knob.style.transform = 'translate(-50%,-50%)';
      onVec(0, 0, 0);
    };

    const move = (clientX, clientY) => {
      let dx = clientX - cx, dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > maxR) { dx = dx / dist * maxR; dy = dy / dist * maxR; }
      knob.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
      setVec(dx / maxR, dy / maxR);
    };

    base.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      pid = e.pointerId;
      try { base.setPointerCapture(pid); } catch (_) {}
      const r = base.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
      move(e.clientX, e.clientY);
    });
    base.addEventListener('pointermove', (e) => {
      if (pid == null || e.pointerId !== pid) return;
      e.preventDefault();
      move(e.clientX, e.clientY);
    });
    const end = (e) => {
      if (pid == null || (e && e.pointerId !== pid)) return;
      try { base.releasePointerCapture(pid); } catch (_) {}
      reset();
    };
    base.addEventListener('pointerup', end);
    base.addEventListener('pointercancel', end);
    return { reset };
  }

  function initSuborbitSteer() {
    const cv = document.getElementById('suborbit-cv');
    if (!cv || cv.dataset.steerBound) return;
    cv.dataset.steerBound = '1';
    const uiSel = '#suborbit-ui,#suborbit-hud,#suborbit-seal-fab,#suborbit-debrief,.mg-joy-base,button,a';
    const isUi = (t) => t && t.closest && t.closest(uiSel);

    cv.addEventListener('pointerdown', (e) => {
      if (!global.SUBORBIT || !global.SUBORBIT.active || global.GAME.state !== 'suborbit') return;
      if (isUi(e.target)) return;
      SUBORBIT_STEER.active = true;
      SUBORBIT_STEER._pid = e.pointerId;
      try { cv.setPointerCapture(e.pointerId); } catch (_) {}
      suborbitSteerFromPointer(e);
    });
    cv.addEventListener('pointermove', (e) => {
      if (!SUBORBIT_STEER.active || e.pointerId !== SUBORBIT_STEER._pid) return;
      suborbitSteerFromPointer(e);
    });
    const end = (e) => {
      if (!SUBORBIT_STEER.active) return;
      if (e && e.pointerId !== SUBORBIT_STEER._pid) return;
      SUBORBIT_STEER.active = false;
      SUBORBIT_STEER.nx = 0;
      SUBORBIT_STEER.ny = 0;
    };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);

    if (MINIGAME_OPTS.mouseSteer) {
      window.addEventListener('pointermove', (e) => {
        if (!global.SUBORBIT || !global.SUBORBIT.active || global.GAME.state !== 'suborbit') return;
        if (isCoarsePointer() || isMobileLayout()) return;
        if (SUBORBIT_STEER.active) return;
        const w = Math.max(1, window.innerWidth);
        SUBORBIT_STEER.nx = ((e.clientX / w) * 2 - 1) * 0.85;
        SUBORBIT_STEER.ny = 0;
      }, { passive: true });
      window.addEventListener('pointerleave', () => {
        if (!SUBORBIT_STEER.active) SUBORBIT_STEER.nx = 0;
      });
    }
  }

  function suborbitSteerFromPointer(e) {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    SUBORBIT_STEER.nx = ((e.clientX / w) * 2 - 1) * 0.92;
    SUBORBIT_STEER.ny = ((e.clientY / h) * 2 - 1) * 0.55;
    const len = Math.hypot(SUBORBIT_STEER.nx, SUBORBIT_STEER.ny);
    if (len > 1) {
      SUBORBIT_STEER.nx /= len;
      SUBORBIT_STEER.ny /= len;
    }
  }

  function mergeSuborbitInput(ax, ay) {
    let nx = ax, ny = ay;
    if (SUBORBIT_STEER.nx) nx += SUBORBIT_STEER.nx;
    if (SUBORBIT_STEER.ny) ny -= SUBORBIT_STEER.ny * 0.65;
    nx = global.cl ? global.cl(nx, -1, 1) : Math.max(-1, Math.min(1, nx));
    ny = global.cl ? global.cl(ny, -1, 1) : Math.max(-1, Math.min(1, ny));
    return { ax: nx, ay: ny };
  }

  function boardingJoyToInp(dx, dy, len) {
    BOARDING_JOY.dx = dx;
    BOARDING_JOY.dy = dy;
    BOARDING_JOY.len = len;
  }

  function mergeBoardingMove(mdx, mdy, mlen) {
    if (BOARDING_JOY.len > 0.12) {
      return { dx: BOARDING_JOY.dx, dy: BOARDING_JOY.dy, len: BOARDING_JOY.len };
    }
    return { dx: mdx, dy: mdy, len: mlen };
  }

  function updateSuborbitArrow() {
    const el = document.getElementById('suborbit-vault-arrow');
    if (!el || !global.SUBORBIT || !global.SUBORBIT.active) return;
    const dep = (global.SUBORBIT.deposits || []).find((d) => !d.sealed);
    if (!dep) { el.classList.remove('show'); return; }
    const dx = dep.wx - global.SUBORBIT.x;
    const dz = dep.wz - (global.SUBORBIT.offset + 40);
    const ang = Math.atan2(dx, -dz);
    const edge = 28;
    const W = window.innerWidth, H = window.innerHeight;
    const cx = W / 2 + Math.sin(ang) * (W / 2 - edge);
    const cy = H / 2 - Math.cos(ang) * (H / 2 - edge);
    el.classList.add('show');
    el.style.left = Math.round(cx) + 'px';
    el.style.top = Math.round(cy) + 'px';
    el.style.transform = 'translate(-50%,-50%) rotate(' + (ang * 180 / Math.PI) + 'deg)';
    const lab = el.querySelector('.sva-lab');
    if (lab) lab.textContent = (dep.name || 'VAULT').toUpperCase();
  }

  function updateSuborbitCorridorBar(corridorFrac) {
    const bar = document.getElementById('suborbit-corridor-fill');
    if (!bar) return;
    const pct = Math.min(100, corridorFrac * 100);
    bar.style.height = pct + '%';
    bar.style.background = corridorFrac > 0.88
      ? 'linear-gradient(180deg,#ff5544,#ffaa44)'
      : corridorFrac > 0.7
        ? 'linear-gradient(180deg,#ffbb44,#88ddff)'
        : 'linear-gradient(180deg,#1a6655,#4affcc)';
  }

  function updateSuborbitVignette(hpPct, corridorFrac) {
    const v = document.getElementById('suborbit-vignette');
    if (!v) return;
    let a = 0;
    if (hpPct < 30) a = Math.max(a, (30 - hpPct) / 30 * 0.45);
    if (corridorFrac > 0.82) a = Math.max(a, (corridorFrac - 0.82) / 0.18 * 0.35);
    v.style.opacity = String(a);
  }

  function suborbitSealFlash() {
    const fx = document.getElementById('suborbit-screen-fx');
    if (fx) {
      fx.style.background = 'radial-gradient(circle at 50% 45%, rgba(120,255,200,.55), transparent 62%)';
      fx.style.opacity = '1';
      setTimeout(() => { fx.style.opacity = '0'; fx.style.background = 'transparent'; }, 220);
    }
    tryVibe(48);
  }

  function suborbitConfirmExit(onOk) {
    const prog = global.StorySys && global.StorySys.circuitBestProgress
      ? global.StorySys.circuitBestProgress() : 0;
    const done = global.StorySys && global.StorySys.flags && global.StorySys.flags.suborbitDone;
    if (!prog || done) {
      if (typeof onOk === 'function') onOk();
      return;
    }
    if (typeof global.uiConfirm === 'function') {
      global.uiConfirm({
        title: 'ESCI DAL CIRCUITO?',
        body: 'Hai ' + prog + '/3 sigilli registrati. Il progresso resta salvato, ma conviene chiudere il Circuito prima.',
        ok: 'ESCI',
        cancel: 'CONTINUA',
        onOk
      });
    } else if (typeof onOk === 'function') onOk();
  }

  function drawBoardingMinimap(ctx) {
    if (!global.BOARDING || !global.BOARDING.map) return;
    const C = global.BOARDING.cols, R = global.BOARDING.rows;
    const map = global.BOARDING.map;
    const p = global.BOARDING.player;
    const W = ctx.canvas.width, H = ctx.canvas.height;
    const pad = 3;
    const cell = Math.min((W - pad * 2) / C, (H - pad * 2) / R);
    ctx.fillStyle = 'rgba(4,12,28,.88)';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(90,160,220,.45)';
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    for (let y = 0; y < R; y++) {
      for (let x = 0; x < C; x++) {
        if (map[y][x] !== 0) continue;
        ctx.fillStyle = 'rgba(40,80,120,.35)';
        ctx.fillRect(pad + x * cell, pad + y * cell, cell - 0.5, cell - 0.5);
      }
    }
    const ex = global.BOARDING.exitCell;
    if (ex) {
      ctx.fillStyle = global.BOARDING.objective.collected >= global.BOARDING.objective.needed
        ? 'rgba(100,255,160,.9)' : 'rgba(80,120,160,.5)';
      ctx.fillRect(pad + ex.x * cell, pad + ex.y * cell, cell - 0.5, cell - 0.5);
    }
    for (const k of global.BOARDING.pickups || []) {
      ctx.fillStyle = '#ffcc44';
      ctx.fillRect(pad + k.x * cell + cell * 0.25, pad + k.y * cell + cell * 0.25, cell * 0.5, cell * 0.5);
    }
    for (const e of global.BOARDING.enemies || []) {
      if (!e.alive) continue;
      ctx.fillStyle = '#ff6644';
      ctx.beginPath();
      ctx.arc(pad + e.x * cell + cell * 0.5, pad + e.y * cell + cell * 0.5, cell * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#77ccff';
    ctx.beginPath();
    ctx.arc(pad + p.sx * cell + cell * 0.5, pad + p.sy * cell + cell * 0.5, cell * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  function boardingGreedyPath() {
    if (!global.BOARDING || !global.BOARDING.map) return [];
    const ex = global.BOARDING.exitCell.x, ey = global.BOARDING.exitCell.y;
    let cx = Math.floor(global.BOARDING.player.sx);
    let cy = Math.floor(global.BOARDING.player.sy);
    const path = [];
    const seen = new Set();
    for (let i = 0; i < 48; i++) {
      if (cx === ex && cy === ey) break;
      let best = null, bd = 1e9;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (ny < 0 || nx < 0 || ny >= global.BOARDING.rows || nx >= global.BOARDING.cols) continue;
        if (global.BOARDING.map[ny][nx] !== 0) continue;
        const d = Math.abs(nx - ex) + Math.abs(ny - ey);
        if (d < bd) { bd = d; best = [nx, ny]; }
      }
      if (!best) break;
      cx = best[0]; cy = best[1];
      const k = cx + ',' + cy;
      if (seen.has(k)) break;
      seen.add(k);
      path.push({ x: cx, y: cy });
    }
    return path;
  }

  function initJoysticks() {
    bindJoystick('suborbit-joy-base', 'suborbit-joy-knob', (nx, ny, len) => {
      if (!len) {
        SUBORBIT_STEER.nx = 0;
        SUBORBIT_STEER.ny = 0;
        return;
      }
      SUBORBIT_STEER.nx = nx;
      SUBORBIT_STEER.ny = -ny;
    });
    bindJoystick('boarding-joy-base', 'boarding-joy-knob', (nx, ny, len) => {
      if (!len) { boardingJoyToInp(0, 0, 0); return; }
      // Screen Y up = iso NW thrust direction mix
      let mdx = nx - ny * 0.55;
      let mdy = ny + nx * 0.55;
      const mlen = Math.hypot(mdx, mdy);
      if (mlen > 0.001) { mdx /= mlen; mdy /= mlen; }
      boardingJoyToInp(mdx, mdy, mlen);
    });
    initSuborbitSteer();
  }

  function applyUiScale() {
    const s = MINIGAME_OPTS.uiScale || 1;
    document.documentElement.style.setProperty('--mg-ui-scale', String(s));
  }
  applyUiScale();

  function bindOptionsUI() {
    const vibe = document.getElementById('mm-opt-mg-vibe');
    const mouse = document.getElementById('mm-opt-mg-mouse');
    const autoAim = document.getElementById('mm-opt-mg-autoaim');
    const scale = document.getElementById('mm-opt-mg-scale');
    if (vibe) {
      vibe.checked = MINIGAME_OPTS.vibe;
      vibe.addEventListener('change', () => { MINIGAME_OPTS.vibe = vibe.checked; saveOpts(); });
    }
    if (mouse) {
      mouse.checked = MINIGAME_OPTS.mouseSteer;
      mouse.addEventListener('change', () => { MINIGAME_OPTS.mouseSteer = mouse.checked; saveOpts(); });
    }
    if (autoAim) {
      autoAim.checked = MINIGAME_OPTS.autoAim;
      autoAim.addEventListener('change', () => { MINIGAME_OPTS.autoAim = autoAim.checked; saveOpts(); });
    }
    if (scale) {
      scale.value = String(MINIGAME_OPTS.uiScale || 1);
      scale.addEventListener('change', () => {
        MINIGAME_OPTS.uiScale = parseFloat(scale.value) || 1;
        applyUiScale();
        saveOpts();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initJoysticks(); bindOptionsUI(); });
  } else {
    initJoysticks();
    bindOptionsUI();
  }

  global.MINIGAME_OPTS = MINIGAME_OPTS;
  global.SUBORBIT_STEER = SUBORBIT_STEER;
  global.BOARDING_JOY = BOARDING_JOY;
  global.MinigamePolish = {
    MINIGAME_OPTS,
    loadOpts,
    saveOpts,
    tryVibe,
    isCoarsePointer,
    isMobileLayout,
    mergeSuborbitInput,
    mergeBoardingMove,
    updateSuborbitArrow,
    updateSuborbitCorridorBar,
    updateSuborbitVignette,
    suborbitSealFlash,
    suborbitConfirmExit,
    drawBoardingMinimap,
    boardingGreedyPath,
    boardingJoyToInp
  };
})(typeof window !== 'undefined' ? window : globalThis);
