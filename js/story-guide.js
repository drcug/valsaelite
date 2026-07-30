'use strict';
/**
 * StoryGuide — obiettivo HUD, waypoint, checklist, radio, stuck Cap.4, interludi azione.
 */
(function (global) {
  const STORY_RADIO_CD_MS = 75000;
  const STUCK_CAP4_MS = 180000; // 3 min senza Circuito → toast

  const ACTION_BEATS = {
    circuit: {
      id: 'azione_circuito',
      title: 'Il Circuito ha parlato',
      body: 'I vault hanno accettato i tuoi sigilli. A Savigno il Consiglio ora ti crede abbastanza figlio di casa da accettare «Il Prezzo del Sigillo» — e i tartufi che ti metteranno in stiva.'
    },
    hulk: {
      id: 'azione_hulk',
      title: 'Hai respirato lo hulk',
      body: 'Fuori dai corridoi l\'odore resta nella tuta. Il macguffinium non è una leggenda da osteria: riscrive chi resta troppo a lungo. Se cerchi documenti del Patto, li hai guadagnati.'
    },
    kill_calcara: {
      id: 'azione_calcara_kill',
      title: 'Frecce contro Calcara',
      body: 'La Rocca ha visto il colpo. Monteveglio non chiede timbri: chiede prove nel vuoto. Continua finché il Torneo non è chiuso — poi torna dal Castellano.'
    }
  };

  function S() { return global.STORY; }
  function flags() {
    if (!global.StorySys) return {};
    if (!global.StorySys.flags) global.StorySys.flags = {};
    const f = global.StorySys.flags;
    if (!f.guide) f.guide = {};
    return f;
  }
  function guide() {
    const f = flags();
    if (!f.guide.radioAt) f.guide.radioAt = 0;
    if (!f.guide.stuckAt) f.guide.stuckAt = 0;
    if (!f.guide.actionBeats) f.guide.actionBeats = {};
    if (!f.guide.cap4Since) f.guide.cap4Since = 0;
    return f.guide;
  }

  function stationName(sid) {
    const SDATA = global.SDATA;
    if (!SDATA) return sid || '—';
    const s = SDATA.find(x => x.id === sid);
    return s ? s.name : String(sid || '—');
  }

  function findActiveStoryMission() {
    const PS = global.PS;
    if (!PS || !PS.activeMissions) return null;
    return PS.activeMissions.find(m => m && m.id && String(m.id).indexOf('story_') === 0 && !m.done) || null;
  }

  function chapterMission() {
    const st = S();
    if (!st || !st.chapters || st.won) return null;
    const ch = st.chapter | 0;
    if (ch < 1) return null;
    return st.chapters[ch - 1] ? st.chapters[ch - 1].mission : null;
  }

  function missionOnStation(sid) {
    const stations = global.stations;
    if (!stations) return null;
    const st = stations.find(s => s.sd && s.sd.id === sid);
    if (!st || !st.missionsList) return null;
    return st.missionsList.find(m => m && m.id && String(m.id).indexOf('story_') === 0 && !m.done && !m.active) || null;
  }

  function hasActiveStoryOnStation(sid) {
    const PS = global.PS;
    if (PS && PS.activeMissions) {
      if (PS.activeMissions.some(m => m && !m.done && m.id && String(m.id).indexOf('story_') === 0 && (m.sid === sid || m.targetSid === sid)))
        return true;
    }
    return !!missionOnStation(sid);
  }

  function stationsWithStory() {
    const out = [];
    const seen = {};
    const st = S();
    const m = findActiveStoryMission() || chapterMission();
    if (m) {
      if (m.sid && !seen[m.sid]) { seen[m.sid] = 1; out.push(m.sid); }
      if (m.targetSid && !seen[m.targetSid]) { seen[m.targetSid] = 1; out.push(m.targetSid); }
    }
    const stations = global.stations || [];
    stations.forEach(s => {
      if (!s || !s.sd) return;
      if (missionOnStation(s.sd.id) && !seen[s.sd.id]) {
        seen[s.sd.id] = 1;
        out.push(s.sd.id);
      }
    });
    // Cap.4: Savigno se Circuito ancora da fare
    if (st && st.chapter === 4 && global.StorySys && !global.StorySys.flags.suborbitDone) {
      if (!seen.savigno) { seen.savigno = 1; out.push('savigno'); }
    }
    return out;
  }

  /** Prossimo passo leggibile + destinazione. */
  function getObjective() {
    const st = S();
    if (!st || st.won) return { line: '', sid: null, kind: 'done', chapter: 0 };
    const ch = st.chapter | 0;
    if (ch < 1) return { line: 'Prologo — il primo capitolo parte da solo.', sid: 'bazzano', kind: 'prologue', chapter: 0 };

    const cm = chapterMission();
    const active = findActiveStoryMission();
    const f = flags();

    if (ch === 4 && !f.suborbitDone) {
      return {
        line: 'CAP.4 · Completa il Circuito Depositi (3 sigilli) — meglio a Savigno',
        sid: 'savigno',
        kind: 'circuit',
        chapter: 4
      };
    }

    if (ch === 6 && !f.hulkBoarded && !(active && active.requireHulk === false)) {
      // Se missione attiva senza hulk ancora
      if (!active || active.requireHulk) {
        return {
          line: 'CAP.6 · Abborda uno SPACE HULK (radar ★ / mappa HULK)',
          sid: null,
          kind: 'hulk',
          chapter: 6,
          hulk: true
        };
      }
    }

    if (active) {
      let line = 'CAP.' + ch + ' · ' + (active.title || 'Missione trama');
      let sid = active.targetSid || active.sid || null;
      if (active.type === 'combat') {
        const kd = active.killsDone | 0, kn = active.killsNeeded | 0;
        line += ' · ' + kd + '/' + kn;
        if (kd >= kn) {
          line += ' — torna a ' + stationName(active.sid);
          sid = active.sid;
        } else if (active.killFaction) {
          line += ' navi ' + active.killFaction;
        }
      } else if (active.cargo) {
        const have = (global.PS && global.PS.cargo && global.PS.cargo[active.cargo.type]) | 0;
        const need = active.cargo.qty | 0;
        line += ' · ' + stationName(active.targetSid || active.sid);
        if (need) line += ' · carico ' + have + '/' + need;
      } else if (sid) {
        line += ' → ' + stationName(sid);
      }
      return { line, sid, kind: 'mission', chapter: ch, mission: active };
    }

    if (cm) {
      const where = stationName(cm.sid);
      return {
        line: 'CAP.' + ch + ' · Accetta «' + (cm.title || 'missione') + '» a ' + where,
        sid: cm.sid,
        kind: 'accept',
        chapter: ch,
        mission: cm
      };
    }

    return { line: 'CAP.' + ch + ' · Continua la campagna', sid: null, kind: 'idle', chapter: ch };
  }

  function getChecklist(step) {
    const st = S();
    const f = flags();
    const PS = global.PS;
    const ch = step != null ? step : (st ? st.chapter | 0 : 0);
    if (!st || ch < 1 || ch > (st.chapters || []).length) return [];
    const mProto = st.chapters[ch - 1].mission;
    const active = findActiveStoryMission();
    const accepted = !!(active && active.id === mProto.id);
    const done = typeof global.storyStepDone === 'function' ? global.storyStepDone(ch) : (st.chapter > ch || st.won);

    const items = [];
    const push = (ok, label) => items.push({ done: !!ok, label });

    if (ch === 1) {
      push(accepted || done, 'Accetta la missione a Bazzano Prime');
      push(done, 'Consegna i documenti a Crespellano');
    } else if (ch === 2) {
      push(accepted || done, 'Accetta a Crespellano');
      push(done, 'Autentica il frammento a Calcara');
    } else if (ch === 3) {
      push(accepted || done, 'Accetta il Torneo a Monteveglio');
      const kd = (active && active.id === 'story_3' ? active.killsDone : 0) | 0;
      push(done || kd >= 3, 'Abbatti 3 navi di Calcara (' + Math.min(kd, 3) + '/3)');
      push(done, 'Torna alla Rocca e chiudi');
    } else if (ch === 4) {
      push(!!f.suborbitDone, 'Completa il Circuito Depositi (3 sigilli)');
      push(accepted || done, 'Accetta «Il Prezzo del Sigillo» a Savigno');
      const tq = (PS && PS.cargo && PS.cargo.tartufi) | 0;
      push(done, 'Consegna i tartufi al Consiglio' + (accepted && !done ? ' (' + tq + '/3)' : ''));
    } else if (ch === 5) {
      push(accepted || done, 'Accetta a Bazzano Prime');
      push(done, 'Riporta i 3 frammenti del Patto');
    } else if (ch === 6) {
      push(!!f.hulkBoarded, 'Abborda uno Space Hulk');
      push(accepted || done, 'Accetta la missione documenti');
      push(done, 'Consegna a Castelletto Rock');
    } else if (ch === 7) {
      push(accepted || done, 'Accetta a Castelletto');
      const kd = (active && active.id === 'story_7' ? active.killsDone : 0) | 0;
      const kn = (mProto.killsNeeded | 0) || 3;
      push(done || kd >= kn, 'Abbatti ' + kn + ' pirati (' + Math.min(kd, kn) + '/' + kn + ')');
      push(done, 'Chiudi il Torneo del fuoco');
    } else if (ch === 8) {
      push(accepted || done, 'Accetta a Bazzano Prime');
      push(done || !!(st && st.won), 'Consegna le piadine / epilogo');
    } else {
      push(accepted || done, 'Accetta la missione a ' + stationName(mProto.sid));
      push(done, 'Completa l\'obiettivo');
    }
    return items;
  }

  function getWaypoint() {
    const obj = getObjective();
    if (obj.hulk && global.HULKS) {
      let best = null, bd = 1e15;
      const ship = global.playerShip;
      for (const h of global.HULKS) {
        if (!h || h.looted || !h.mesh) continue;
        if (!ship || !ship.mesh) { best = h; break; }
        const d = ship.mesh.position.distanceToSquared(h.mesh.position);
        const prefer = h.storyMarked ? d * 0.35 : d;
        if (prefer < bd) { bd = prefer; best = h; }
      }
      if (best && best.mesh) {
        return {
          x: best.mesh.position.x,
          z: best.mesh.position.z,
          sid: null,
          label: best.name || 'SPACE HULK',
          hulk: true
        };
      }
    }
    if (!obj.sid) return null;
    const getSM = global.getSM;
    const sm = typeof getSM === 'function' ? getSM(obj.sid) : null;
    if (!sm || !sm.mesh) return null;
    return {
      x: sm.mesh.position.x,
      z: sm.mesh.position.z,
      sid: obj.sid,
      label: stationName(obj.sid),
      hulk: false
    };
  }

  function radio(msg, force) {
    if (!msg) return;
    const g = guide();
    const now = Date.now();
    if (!force && now - (g.radioAt || 0) < STORY_RADIO_CD_MS) return;
    g.radioAt = now;
    if (typeof global.notify === 'function') global.notify('📡 ' + msg, 3200);
    if (typeof global.playTone === 'function') {
      try {
        global.playTone(520, 0.04, 0.03, 'sine');
        setTimeout(() => global.playTone(680, 0.05, 0.028, 'sine'), 70);
      } catch (_) {}
    }
  }

  function radioForObjective() {
    const obj = getObjective();
    if (!obj.line || obj.kind === 'done' || obj.kind === 'idle') return;
    let msg = obj.line.replace(/^CAP\.\d+\s*·\s*/, '');
    if (msg.length > 96) msg = msg.slice(0, 93) + '…';
    radio(msg, false);
  }

  function noteCap4Enter() {
    const st = S();
    const g = guide();
    if (st && st.chapter === 4 && !flags().suborbitDone) {
      if (!g.cap4Since) g.cap4Since = Date.now();
    } else {
      g.cap4Since = 0;
    }
  }

  function checkStuck() {
    const st = S();
    if (!st || st.won || st.chapter !== 4) return;
    if (flags().suborbitDone) { guide().cap4Since = 0; return; }
    const g = guide();
    if (!g.cap4Since) g.cap4Since = Date.now();
    const elapsed = Date.now() - g.cap4Since;
    if (elapsed < STUCK_CAP4_MS) return;
    if (Date.now() - (g.stuckAt || 0) < 120000) return;
    g.stuckAt = Date.now();
    radio('Sei bloccato sul Cap.4? Attracca e avvia CIRCUITO DEPOSITI (3 sigilli con E).', true);
    // Evidenzia bottone se in dock
    try {
      const btn = document.getElementById('ldck-suborbit');
      if (btn && btn.style.display !== 'none') {
        btn.style.borderColor = 'rgba(255,200,80,.85)';
        btn.style.boxShadow = '0 0 18px rgba(255,180,40,.45)';
        btn.classList.add('story-stuck-pulse');
      }
    } catch (_) {}
  }

  function onDock(st) {
    noteCap4Enter();
    const obj = getObjective();
    if (obj.kind === 'circuit') {
      radio('Savigno aspetta i sigilli: VOLO SUBORBITALE → Circuito Depositi.', false);
    } else if (obj.kind === 'accept' && st && st.sd && obj.sid === st.sd.id) {
      radio('Qui puoi accettare la missione trama (tab Missioni).', false);
    } else if (obj.kind === 'mission' && st && st.sd && (obj.sid === st.sd.id)) {
      radio('Destinazione trama: controlla consegna / Missioni.', false);
    } else {
      radioForObjective();
    }
    checkStuck();
  }

  function onAction(kind) {
    const beat = ACTION_BEATS[kind];
    if (!beat) return;
    const g = guide();
    if (g.actionBeats[beat.id]) return;
    g.actionBeats[beat.id] = 1;
    if (typeof global.showStoryBanner === 'function') {
      setTimeout(() => global.showStoryBanner('INTERLUDIO', beat.title, beat.body), 600);
    } else {
      radio(beat.title + ' — ' + beat.body.slice(0, 80), true);
    }
  }

  function dockBriefHtml() {
    const obj = getObjective();
    if (!obj.line || obj.kind === 'done') return '';
    const list = getChecklist();
    const next = list.find(i => !i.done);
    const tip = next ? next.label : obj.line;
    return '<div id="dk-story-brief" class="dk-story-brief">'
      + '<div class="dk-sb-lab">TRAMA · CAP.' + (obj.chapter || '?') + '</div>'
      + '<div class="dk-sb-txt">' + tip + '</div>'
      + '</div>';
  }

  function checklistHtml(step) {
    const items = getChecklist(step);
    if (!items.length) return '';
    return '<ul class="diary-check">'
      + items.map(i => '<li class="' + (i.done ? 'ok' : 'todo') + '">'
        + (i.done ? '☑' : '☐') + ' ' + i.label + '</li>').join('')
      + '</ul>';
  }

  const StoryGuide = {
    getObjective,
    getChecklist,
    getWaypoint,
    stationsWithStory,
    hasActiveStoryOnStation,
    radio,
    radioForObjective,
    checkStuck,
    noteCap4Enter,
    onDock,
    onAction,
    dockBriefHtml,
    checklistHtml,
    tick(dt) {
      noteCap4Enter();
      // periodico soft
      if (!StoryGuide._acc) StoryGuide._acc = 0;
      StoryGuide._acc += dt || 0;
      if (StoryGuide._acc > 12) {
        StoryGuide._acc = 0;
        checkStuck();
      }
    }
  };

  global.StoryGuide = StoryGuide;
})(typeof window !== 'undefined' ? window : globalThis);
