'use strict';
/**
 * Volo orbitale + blueprint — HUD compatto, twin-stick, zoom/pan, stats delta.
 */
(function (global) {
  const LS_KEY = 'valsaelite_flight_bp_opts_v1';
  const FLIGHT_OPTS = {
    vibe: true,
    mouseSteer: false,
    boostConfirm: true,
    uiScale: 1
  };

  function loadOpts() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const o = JSON.parse(raw);
      if (o) Object.assign(FLIGHT_OPTS, o);
    } catch (_) {}
  }
  function saveOpts() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(FLIGHT_OPTS)); } catch (_) {}
  }
  loadOpts();

  let flyHudMinimal = false;
  const FLY_JOY = { nx: 0, len: 0 };
  const BP_VIEW = { zoom: 1, panX: 0, panY: 0, pinching: false };
  let bpStatsBaseline = null;
  let bpGridOnly = false;

  function tryVibe(ms) {
    if (!FLIGHT_OPTS.vibe || typeof global.tryVibrate !== 'function') return;
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

  function isFlying() {
    return global.GAME && global.GAME.state === 'flying' && !global.gameplayPaused?.();
  }

  function bindJoystick(baseId, knobId, onVec) {
    const dead = 0.14;
    const maxR = 52;
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

  function initFlightJoystick() {
    bindJoystick('flight-joy-base', 'flight-joy-knob', (nx, _ny, len) => {
      FLY_JOY.nx = nx;
      FLY_JOY.len = len;
    });
    const fire = document.getElementById('flight-fire-mob');
    if (fire && !fire.dataset.bound) {
      fire.dataset.bound = '1';
      const down = (e) => {
        e.preventDefault();
        if (global.INP) global.INP.fire = true;
      };
      const up = (e) => {
        if (e) e.preventDefault();
        if (global.INP) global.INP.fire = false;
      };
      fire.addEventListener('pointerdown', down);
      fire.addEventListener('pointerup', up);
      fire.addEventListener('pointercancel', up);
      fire.addEventListener('pointerleave', up);
    }
  }

  function initFlightMouseSteer() {
    if (document.body.dataset.flyMouseBound) return;
    document.body.dataset.flyMouseBound = '1';
    window.addEventListener('pointermove', (e) => {
      if (!FLIGHT_OPTS.mouseSteer || isCoarsePointer() || isMobileLayout()) return;
      if (!isFlying()) return;
      if (global.FLY_STEER && global.FLY_STEER.active) return;
      if (flySteerBlockedAt(e.clientX, e.clientY)) return;
      const w = Math.max(1, window.innerWidth);
      global.FLY_STEER = global.FLY_STEER || { active: false, nx: 0 };
      global.FLY_STEER.nx = ((e.clientX / w) * 2 - 1) * 0.82;
      global.FLY_STEER.active = false;
    }, { passive: true });
    window.addEventListener('pointerleave', () => {
      if (global.FLY_STEER && !global.FLY_STEER.active) global.FLY_STEER.nx = 0;
    });
  }

  function flySteerBlockedAt(clientX, clientY) {
    const radar = document.getElementById('radar');
    if (radar) {
      const r = radar.getBoundingClientRect();
      const pad = 18;
      if (clientX >= r.left - pad && clientX <= r.right + pad &&
          clientY >= r.top - pad && clientY <= r.bottom + pad) return true;
    }
    const dlg = document.getElementById('dlg');
    if (dlg && dlg.style.display !== 'none') {
      const r = dlg.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) return true;
    }
    const hp = document.querySelector('#hud .ht .hp');
    if (hp) {
      const r = hp.getBoundingClientRect();
      const pad = 12;
      if (clientX <= r.right + pad && clientY <= r.bottom + pad) return true;
    }
    const mt = document.getElementById('mtick');
    if (mt && mt.style.display !== 'none') {
      const r = mt.getBoundingClientRect();
      if (clientX >= r.left - 8 && clientX <= r.right + 8 &&
          clientY >= r.top - 8 && clientY <= r.bottom + 8) return true;
    }
    const so = document.getElementById('story-obj');
    if (so && so.classList.contains('show')) {
      const r = so.getBoundingClientRect();
      if (clientX >= r.left - 8 && clientX <= r.right + 8 &&
          clientY >= r.top - 8 && clientY <= r.bottom + 8) return true;
    }
    const joy = document.getElementById('flight-joy-wrap');
    if (joy && joy.offsetParent !== null) {
      const r = joy.getBoundingClientRect();
      const pad = 10;
      if (clientX >= r.left - pad && clientX <= r.right + pad &&
          clientY >= r.top - pad && clientY <= r.bottom + pad) return true;
    }
    const fire = document.getElementById('flight-fire-wrap');
    if (fire && fire.offsetParent !== null) {
      const r = fire.getBoundingClientRect();
      const pad = 10;
      if (clientX >= r.left - pad && clientX <= r.right + pad &&
          clientY >= r.top - pad && clientY <= r.bottom + pad) return true;
    }
    return false;
  }

  function steerDeadzone(nx) {
    const dead = 0.16;
    if (!nx || Math.abs(nx) < dead) return 0;
    const sign = nx > 0 ? 1 : -1;
    const t = (Math.abs(nx) - dead) / (1 - dead);
    return sign * Math.min(1, t * 0.82);
  }

  function mergeFlightSteer() {
    if (FLY_JOY.len > 0.12) return steerDeadzone(FLY_JOY.nx);
    const fs = global.FLY_STEER;
    if (!fs) return 0;
    if (fs.active) return steerDeadzone(fs.nx);
    if (FLIGHT_OPTS.mouseSteer && !isCoarsePointer() && !isMobileLayout()) {
      return steerDeadzone(fs.nx);
    }
    return 0;
  }

  function toggleFlyHudMinimal() {
    flyHudMinimal = !flyHudMinimal;
    document.body.classList.toggle('fly-hud-min', flyHudMinimal);
    if (typeof global.notify === 'function') {
      global.notify(flyHudMinimal ? 'HUD volo compatto · H per dettagli' : 'HUD volo dettagliato · H per compatto', 1400);
    }
    return flyHudMinimal;
  }

  function updateSpeedLabel(vel, maxSpd) {
    const el = document.getElementById('speed-val');
    if (!el) return;
    const v = vel || 0;
    const max = Math.max(1, maxSpd || 1);
    const kmps = (v / max) * (max * 0.38);
    el.textContent = kmps.toFixed(1) + ' km/s';
    el.style.color = v / max > 0.92 ? '#ffcc44' : '#88ccff';
  }

  function updateFlightVignette(hpPct, heatPct) {
    const v = document.getElementById('fly-vignette');
    if (!v) return;
    let a = 0;
    if (hpPct < 32) a = Math.max(a, (32 - hpPct) / 32 * 0.42);
    if (heatPct > 78) a = Math.max(a, (heatPct - 78) / 22 * 0.38);
    v.style.opacity = String(a);
  }

  function shouldConfirmBoost() {
    if (!FLIGHT_OPTS.boostConfirm) return false;
    const boost = global.BOOST;
    if (!boost) return false;
    return boost.heat > 85 && !boost.overheated;
  }

  function requestBoost(onOk) {
    if (!shouldConfirmBoost()) {
      if (typeof onOk === 'function') onOk();
      return;
    }
    if (typeof global.uiConfirm === 'function') {
      global.uiConfirm({
        title: 'SPINTA CON CALORE ALTO',
        body: 'Calore motori ' + Math.round(global.BOOST.heat) + '%. La spinta può surriscaldare i motori. Procedi?',
        ok: 'SPINTA',
        cancel: 'ANNULLA',
        onOk
      });
    } else if (typeof onOk === 'function') onOk();
  }

  function wrapBoostButton() {
    const b = document.getElementById('btnboost');
    if (!b || b.dataset.boostWrap) return;
    b.dataset.boostWrap = '1';
    const setBoost = (on) => {
      if (global.INP) global.INP.boost = on;
      if (on) tryVibe(12);
    };
    const go = () => {
      requestBoost(() => setBoost(true));
    };
    const down = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      go();
    };
    const up = (e) => {
      if (e) e.preventDefault();
      setBoost(false);
    };
    if (window.PointerEvent) {
      b.addEventListener('pointerdown', down);
      b.addEventListener('pointerup', up);
      b.addEventListener('pointercancel', up);
      b.addEventListener('pointerleave', up);
    } else {
      b.addEventListener('mousedown', down);
      b.addEventListener('mouseup', up);
      b.addEventListener('mouseleave', up);
    }
  }

  function initFlightMoreButtons() {
    const map = document.getElementById('flight-more-map');
    const miss = document.getElementById('flight-more-miss');
    const tgt = document.getElementById('flight-more-tgt');
    if (map && !map.dataset.bound) {
      map.dataset.bound = '1';
      map.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof global.toggleMap === 'function') global.toggleMap();
      });
    }
    if (miss && !miss.dataset.bound) {
      miss.dataset.bound = '1';
      miss.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof global.launchPlayerMissile === 'function') global.launchPlayerMissile();
      });
    }
    if (tgt && !tgt.dataset.bound) {
      tgt.dataset.bound = '1';
      tgt.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof global.cycleTarget === 'function') global.cycleTarget();
      });
    }
  }

  function applyBpViewTransform() {
    const wrap = document.getElementById('bp-canvas-wrap');
    if (!wrap) return;
    wrap.style.transform = 'translate(' + BP_VIEW.panX + 'px,' + BP_VIEW.panY + 'px) scale(' + BP_VIEW.zoom + ')';
  }

  function resetBpView() {
    BP_VIEW.zoom = 1;
    BP_VIEW.panX = 0;
    BP_VIEW.panY = 0;
    applyBpViewTransform();
  }

  function resetBlueprintUi() {
    bpGridOnly = false;
    document.body.classList.remove('bp-grid-only');
    const grid = document.getElementById('bp-fab-grid');
    if (grid) grid.textContent = 'GRIGLIA';
    resetBpView();
  }

  function syncBpFabModeUi() {
    const place = document.getElementById('bp-fab-place');
    const erase = document.getElementById('bp-fab-erase');
    const mode = (typeof global.bpEditMode !== 'undefined') ? global.bpEditMode : 'place';
    if (place) place.style.borderColor = mode === 'place' ? 'rgba(120,255,200,.75)' : '';
    if (erase) erase.style.borderColor = (mode === 'erase' || global.bpIsEraseMode?.()) ? 'rgba(255,160,100,.85)' : '';
  }

  function initBlueprintZoomPan() {
    const cv = document.getElementById('bp-cv');
    const wrap = document.getElementById('bp-canvas-wrap');
    if (!cv || cv.dataset.zoomBound) return;
    cv.dataset.zoomBound = '1';

    cv.addEventListener('wheel', (e) => {
      if (!global.bpBlueprintModalOpen || !global.bpBlueprintModalOpen()) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      BP_VIEW.zoom = Math.max(0.65, Math.min(2.2, BP_VIEW.zoom + delta));
      applyBpViewTransform();
    }, { passive: false });

    let pinchStart = null;
    cv.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        pinchStart = {
          dist: Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          ),
          zoom: BP_VIEW.zoom,
          panX: BP_VIEW.panX,
          panY: BP_VIEW.panY,
          cx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          cy: (e.touches[0].clientY + e.touches[1].clientY) / 2
        };
        BP_VIEW.pinching = true;
      }
    }, { passive: true });

    cv.addEventListener('touchmove', (e) => {
      if (!pinchStart || e.touches.length !== 2) return;
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / Math.max(1, pinchStart.dist);
      BP_VIEW.zoom = Math.max(0.65, Math.min(2.2, pinchStart.zoom * scale));
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      BP_VIEW.panX = pinchStart.panX + (cx - pinchStart.cx);
      BP_VIEW.panY = pinchStart.panY + (cy - pinchStart.cy);
      applyBpViewTransform();
    }, { passive: false });

    cv.addEventListener('touchend', () => { pinchStart = null; BP_VIEW.pinching = false; });

    if (wrap) {
      let panPid = null;
      let panStart = null;
      wrap.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || !e.altKey) return;
        panPid = e.pointerId;
        panStart = { x: e.clientX - BP_VIEW.panX, y: e.clientY - BP_VIEW.panY };
        try { wrap.setPointerCapture(panPid); } catch (_) {}
      });
      wrap.addEventListener('pointermove', (e) => {
        if (panPid == null || e.pointerId !== panPid || !panStart) return;
        BP_VIEW.panX = e.clientX - panStart.x;
        BP_VIEW.panY = e.clientY - panStart.y;
        applyBpViewTransform();
      });
      const endPan = (e) => {
        if (panPid == null || (e && e.pointerId !== panPid)) return;
        panPid = null;
        panStart = null;
      };
      wrap.addEventListener('pointerup', endPan);
      wrap.addEventListener('pointercancel', endPan);
    }
  }

  function initBpMobileFab() {
    const place = document.getElementById('bp-fab-place');
    const erase = document.getElementById('bp-fab-erase');
    const grid = document.getElementById('bp-fab-grid');
    if (place && !place.dataset.bound) {
      place.dataset.bound = '1';
      place.addEventListener('click', () => {
        if (typeof global.bpSetEditMode === 'function') global.bpSetEditMode('place');
        syncBpFabModeUi();
      });
    }
    if (erase && !erase.dataset.bound) {
      erase.dataset.bound = '1';
      erase.addEventListener('click', () => {
        if (typeof global.bpSetEditMode === 'function') global.bpSetEditMode('erase');
        syncBpFabModeUi();
      });
    }
    if (grid && !grid.dataset.bound) {
      grid.dataset.bound = '1';
      grid.addEventListener('click', () => {
        bpGridOnly = !bpGridOnly;
        document.body.classList.toggle('bp-grid-only', bpGridOnly);
        grid.textContent = bpGridOnly ? 'MODULI' : 'GRIGLIA';
        if (typeof global.notify === 'function') {
          global.notify(bpGridOnly ? 'Solo griglia · tocca MODULI per la lista' : 'Lista moduli ripristinata', 1400);
        }
      });
    }
  }

  function captureBpStatsBaseline() {
    if (typeof global.bpStats === 'function') bpStatsBaseline = global.bpStats();
    else bpStatsBaseline = null;
  }

  function formatStatDelta(key, cur, base, suffix) {
    suffix = suffix || '';
    if (!base || cur === base) return String(cur) + suffix;
    const d = cur - base;
    const sign = d > 0 ? '+' : '';
    const col = d > 0 ? '#66eeaa' : (d < 0 ? '#ff8866' : '#88aacc');
    return String(cur) + suffix + ' <span style="color:' + col + '">(' + sign + d + suffix + ')</span>';
  }

  function enrichBpStatsHtml(html, stats) {
    if (!bpStatsBaseline || !stats) return html;
    const b = bpStatsBaseline;
    return html
      .replace('>' + stats.speed + '</', '>' + formatStatDelta('speed', stats.speed, b.speed) + '</')
      .replace('>' + stats.thrust + '</', '>' + formatStatDelta('thrust', stats.thrust, b.thrust) + '</')
      .replace('>' + stats.dmg + '%</', '>' + formatStatDelta('dmg', stats.dmg, b.dmg, '%') + '</')
      .replace('>' + stats.cargoMax + '</', '>' + formatStatDelta('cargo', stats.cargoMax, b.cargoMax) + '</')
      .replace('>' + stats.maneuver + '%</', '>' + formatStatDelta('man', stats.maneuver, b.maneuver, '%') + '</')
      .replace('>' + stats.shieldHp + '</', '>' + formatStatDelta('shd', stats.shieldHp, b.shieldHp) + '</');
  }

  function applyUiScale() {
    const s = FLIGHT_OPTS.uiScale || 1;
    document.documentElement.style.setProperty('--fly-ui-scale', String(s));
  }
  applyUiScale();

  function bindOptionsUI() {
    const vibe = document.getElementById('mm-opt-fly-vibe');
    const mouse = document.getElementById('mm-opt-fly-mouse');
    const boost = document.getElementById('mm-opt-fly-boost');
    const scale = document.getElementById('mm-opt-fly-scale');
    if (vibe) {
      vibe.checked = FLIGHT_OPTS.vibe;
      vibe.addEventListener('change', () => { FLIGHT_OPTS.vibe = vibe.checked; saveOpts(); });
    }
    if (mouse) {
      mouse.checked = FLIGHT_OPTS.mouseSteer;
      mouse.addEventListener('change', () => { FLIGHT_OPTS.mouseSteer = mouse.checked; saveOpts(); });
    }
    if (boost) {
      boost.checked = FLIGHT_OPTS.boostConfirm;
      boost.addEventListener('change', () => { FLIGHT_OPTS.boostConfirm = boost.checked; saveOpts(); });
    }
    if (scale) {
      scale.value = String(FLIGHT_OPTS.uiScale || 1);
      scale.addEventListener('change', () => {
        FLIGHT_OPTS.uiScale = parseFloat(scale.value) || 1;
        applyUiScale();
        saveOpts();
      });
    }
    const more = document.getElementById('flight-more-btn');
    if (more && !more.dataset.bound) {
      more.dataset.bound = '1';
      more.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.toggle('flight-more-open');
      });
    }
  }

  function init() {
    initFlightJoystick();
    initFlightMouseSteer();
    wrapBoostButton();
    initBlueprintZoomPan();
    initBpMobileFab();
    initFlightMoreButtons();
    bindOptionsUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.FLIGHT_OPTS = FLIGHT_OPTS;
  global.FLY_JOY = FLY_JOY;
  global.FlightBlueprintPolish = {
    FLIGHT_OPTS,
    FLY_JOY,
    isMobileLayout,
    isCoarsePointer,
    flyHudMinimal: () => flyHudMinimal,
    toggleFlyHudMinimal,
    steerDeadzone,
    mergeFlightSteer,
    flySteerBlockedAt,
    updateSpeedLabel,
    updateFlightVignette,
    requestBoost,
    shouldConfirmBoost,
    captureBpStatsBaseline,
    enrichBpStatsHtml,
    resetBpView,
    resetBlueprintUi,
    syncBpFabModeUi,
    resetFlyJoy: () => { FLY_JOY.nx = 0; FLY_JOY.len = 0; },
    tryVibe
  };
})(typeof window !== 'undefined' ? window : globalThis);
