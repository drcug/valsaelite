'use strict';
/**
 * Gameplay polish — helper API usata da valsaelite.html
 * (ghost/snap/preset cantiere, haptics, ranking, tavern clues, loot extra).
 */
(function (global) {
  function vibrate(pattern) {
    try {
      if (global.navigator && typeof global.navigator.vibrate === 'function') {
        global.navigator.vibrate(pattern);
      }
    } catch (_) { /* ignore */ }
  }

  function bpHaptic(kind) {
    if (kind === 'erase') vibrate([10, 40, 14]);
    else if (kind === 'deny') vibrate([30]);
    else vibrate(8);
  }

  function bpPlayPlaceSfx() {
    if (typeof global.playTone === 'function') global.playTone(420, 0.02, 0.03, 'square');
    bpHaptic('place');
  }

  function bpPlayEraseSfx() {
    if (typeof global.playTone === 'function') global.playTone(160, 0.03, 0.04, 'triangle');
    bpHaptic('erase');
  }

  /** Celle strutturali fuori dal componente connesso principale. */
  function bpBrokenCells(bpGrid, BP_ROWS, BP_COLS, isStructure) {
    const broken = new Set();
    let start = null, total = 0;
    for (let r = 0; r < BP_ROWS; r++) for (let c = 0; c < BP_COLS; c++) {
      if (!isStructure(bpGrid[r][c])) continue;
      total++;
      if (!start) start = [r, c];
    }
    if (!start || total <= 1) return broken;
    const seen = new Set();
    const q = [start];
    seen.add(start[0] + ',' + start[1]);
    while (q.length) {
      const [r, c] = q.pop();
      [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([nr, nc]) => {
        if (nr < 0 || nr >= BP_ROWS || nc < 0 || nc >= BP_COLS) return;
        if (!isStructure(bpGrid[nr][nc])) return;
        const k = nr + ',' + nc;
        if (seen.has(k)) return;
        seen.add(k);
        q.push([nr, nc]);
      });
    }
    for (let r = 0; r < BP_ROWS; r++) for (let c = 0; c < BP_COLS; c++) {
      if (!isStructure(bpGrid[r][c])) continue;
      const k = r + ',' + c;
      if (!seen.has(k)) broken.add(k);
    }
    // Anche moduli non strutturali che non toccano scafo
    for (let r = 0; r < BP_ROWS; r++) for (let c = 0; c < BP_COLS; c++) {
      const id = bpGrid[r][c];
      if (!id || isStructure(id)) continue;
      let touch = false;
      [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([nr, nc]) => {
        if (nr < 0 || nr >= BP_ROWS || nc < 0 || nc >= BP_COLS) return;
        if (isStructure(bpGrid[nr][nc]) || bpGrid[nr][nc]) touch = true;
      });
      // Se l'intero pezzo non tocca lo scafo connesso (seen), marca
      let nearOk = false;
      [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([nr, nc]) => {
        if (nr < 0 || nr >= BP_ROWS || nc < 0 || nc >= BP_COLS) return;
        if (seen.has(nr + ',' + nc) || (bpGrid[nr][nc] && isStructure(bpGrid[nr][nc]) && seen.has(nr + ',' + nc))) nearOk = true;
        if (isStructure(bpGrid[nr][nc]) && seen.has(nr + ',' + nc)) nearOk = true;
      });
      if (!nearOk) broken.add(r + ',' + c);
    }
    return broken;
  }

  /**
   * Snap al bordo: se il tocco è vicino al confine, preferisci la cella col centro più vicino
   * (in modalità cancella: bias verso pezzi occupati).
   */
  function snapBpCell(r, c, x, y, opts) {
    const BP_CELL = opts.BP_CELL, BP_ROWS = opts.BP_ROWS, BP_COLS = opts.BP_COLS;
    const bpGrid = opts.bpGrid;
    const eraseMode = !!opts.eraseMode;
    const edge = Math.max(6, BP_CELL * 0.22);
    const lx = ((x - 1) % BP_CELL + BP_CELL) % BP_CELL;
    const ly = ((y - 1) % BP_CELL + BP_CELL) % BP_CELL;
    const cands = [[r, c]];
    if (lx < edge && c > 0) cands.push([r, c - 1]);
    if (lx > BP_CELL - edge && c < BP_COLS - 1) cands.push([r, c + 1]);
    if (ly < edge && r > 0) cands.push([r - 1, c]);
    if (ly > BP_CELL - edge && r < BP_ROWS - 1) cands.push([r + 1, c]);
    let best = { r, c }, bestScore = Infinity;
    cands.forEach(([rr, cc]) => {
      const cx = cc * BP_CELL + 1 + BP_CELL / 2;
      const cy = rr * BP_CELL + 1 + BP_CELL / 2;
      let score = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (eraseMode && bpGrid[rr] && bpGrid[rr][cc]) score -= 280;
      if (!eraseMode && bpGrid[rr] && !bpGrid[rr][cc]) score -= 40;
      if (score < bestScore) { bestScore = score; best = { r: rr, c: cc }; }
    });
    return best;
  }

  function buildBpPreset(kind, defaultBlueprint) {
    const items = [];
    const hullFill = (r0, r1, c0, c1) => {
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) items.push({ r, c, id: 'hull' });
    };
    if (kind === 'starter') return (defaultBlueprint || []).slice();
    if (kind === 'cargo') {
      hullFill(2, 5, 1, 7);
      items.push({ r: 3, c: 0, id: 'weapon' });
      items.push({ r: 3, c: 2, id: 'cockpit' });
      items.push({ r: 2, c: 4, id: 'shield' }, { r: 5, c: 4, id: 'shield' });
      items.push({ r: 2, c: 5, id: 'cargo' }, { r: 4, c: 5, id: 'cargo' }, { r: 5, c: 5, id: 'cargo' });
      items.push({ r: 3, c: 8, id: 'engine' }, { r: 4, c: 8, id: 'engine' });
      items.push({ r: 2, c: 7, id: 'engine' }, { r: 5, c: 7, id: 'engine' });
      return items;
    }
    if (kind === 'combat') {
      hullFill(2, 5, 1, 6);
      items.push({ r: 2, c: 0, id: 'weapon' }, { r: 3, c: 0, id: 'weapon' }, { r: 4, c: 0, id: 'weapon' }, { r: 5, c: 0, id: 'weapon' });
      items.push({ r: 3, c: 2, id: 'cockpit' });
      items.push({ r: 2, c: 3, id: 'fin' });
      items.push({ r: 1, c: 4, id: 'wing_l' }, { r: 5, c: 4, id: 'wing_r' });
      items.push({ r: 2, c: 5, id: 'shield' }, { r: 5, c: 5, id: 'shield' });
      items.push({ r: 3, c: 7, id: 'engine' }, { r: 4, c: 7, id: 'engine' });
      items.push({ r: 2, c: 6, id: 'engine' }, { r: 5, c: 6, id: 'engine' });
      return items;
    }
    if (kind === 'scout') {
      hullFill(3, 4, 1, 6);
      items.push({ r: 3, c: 0, id: 'weapon' });
      items.push({ r: 3, c: 2, id: 'cockpit' });
      items.push({ r: 2, c: 3, id: 'fin' });
      items.push({ r: 2, c: 4, id: 'wing_l' }, { r: 4, c: 4, id: 'wing_r' });
      items.push({ r: 3, c: 5, id: 'shield' });
      items.push({ r: 3, c: 7, id: 'engine' }, { r: 4, c: 7, id: 'engine' });
      return items;
    }
    return (defaultBlueprint || []).slice();
  }

  function pickWeighted(table) {
    let sum = 0;
    table.forEach(([, w]) => { sum += w; });
    let t = Math.random() * sum;
    for (let i = 0; i < table.length; i++) {
      t -= table[i][1];
      if (t <= 0) return table[i][0];
    }
    return table[table.length - 1][0];
  }

  /** Extra loot abbordaggio: chance pezzo blueprint / documenti rari. */
  function rollBoardingExtraLoot(kind) {
    const roll = Math.random();
    if (kind === 'hulk' && roll < 0.18) {
      return { type: 'bp_mod', id: pickWeighted([['shield', 0.3], ['cargo', 0.25], ['weapon', 0.2], ['engine', 0.15], ['missile', 0.1]]), label: 'pezzo blueprint' };
    }
    if (kind !== 'hulk' && roll < 0.12) {
      return { type: 'bp_mod', id: pickWeighted([['hull', 0.2], ['fin', 0.2], ['cargo', 0.25], ['shield', 0.2], ['weapon', 0.15]]), label: 'pezzo blueprint' };
    }
    if (roll < 0.08) return { type: 'cargo', id: 'cristalli', qty: 1 };
    if (roll < 0.14) return { type: 'cargo', id: 'documenti', qty: 1 };
    return null;
  }

  function runRankFromStats(stats) {
    // stats: {mins, kills, boardings, missions, distanceKm, credNet, won}
    const score =
      (stats.kills || 0) * 3 +
      (stats.boardings || 0) * 8 +
      (stats.missions || 0) * 12 +
      Math.min(40, Math.floor((stats.distanceKm || 0) / 50)) +
      Math.max(0, Math.floor((stats.credNet || 0) / 200)) +
      (stats.won ? 50 : 0) -
      Math.floor((stats.mins || 0) / 8);
    let grade = 'D';
    if (score >= 180) grade = 'S';
    else if (score >= 130) grade = 'A';
    else if (score >= 90) grade = 'B';
    else if (score >= 55) grade = 'C';
    const titles = { S: 'LEGGENDA DEL MOLINO', A: 'FUNZIONARIO STELLARE', B: 'PILOTA AFFIDABILE', C: 'CORRIDOIO APERTO', D: 'ANCORA IN ORBITA' };
    return { score: Math.max(0, score | 0), grade, title: titles[grade] };
  }

  /** Moltiplicatore prezzi mercato da reputazione (− = sconto, + = rincaro). */
  function repPriceMult(faction, repMap) {
    const v = (repMap && repMap[faction]) || 0;
    if (v > 50) return 0.88;
    if (v > 20) return 0.94;
    if (v > 0) return 0.98;
    if (v > -20) return 1.0;
    if (v > -50) return 1.08;
    return 1.18;
  }

  /** Pedaggio / rifiuto attracco basato su rep. */
  function dockAccessCheck(sd, repMap, ECON) {
    if (!sd || !sd.faction) return { ok: true };
    const f = sd.faction;
    const v = (repMap && repMap[f]) != null ? repMap[f] : 0;
    if (v <= -60) {
      return { ok: false, msg: 'Hangar chiuso: reputazione ' + (f || '') + ' troppo bassa. Migliora i rapporti o trova un porto neutrale.' };
    }
    if (f === 'calcara' && v < 0) {
      const toll = (ECON && ECON.tollCalcara) || 60;
      return { ok: true, toll: toll + Math.max(0, Math.floor(-v * 1.5)), msg: 'Pedaggio Calcara' };
    }
    if (v < -35) {
      return { ok: true, toll: 40, msg: 'Surcharge hangar ostile' };
    }
    if (v > 40) return { ok: true, discountRepair: 0.85 };
    return { ok: true };
  }

  const TAVERN_CLUES = {
    bazzano: [
      { id: 'tav_bazz_sirena', title: '[OSTERIA] Sussurro Sirena', desc: 'Porta documenti a Sirena: qualcuno parla del Patto a voce troppo alta.', type: 'delivery', targetSid: 'sirena', cargo: { type: 'documenti', qty: 1 }, reward: 260, repGain: { bazzano: 6 }, cost: 80 },
      { id: 'tav_bazz_calc', title: '[OSTERIA] Timbrature', desc: 'Consegna materiali a Calcara e ascolta i funzionari.', type: 'delivery', targetSid: 'calcara', cargo: { type: 'materiali', qty: 1 }, reward: 300, repGain: { calcara: 5 }, cost: 100 }
    ],
    calcara: [
      { id: 'tav_calc_appalto', title: '[OSTERIA] Appalto ombra', desc: 'Elimina 2 navi crespellanesi — qualcuno paga per il silenzio.', type: 'combat', killFaction: 'crespellano', killsNeeded: 2, killsDone: 0, reward: 480, repGain: { calcara: 8, crespellano: -10 }, cost: 120 }
    ],
    savigno: [
      { id: 'tav_sav_fungo', title: '[OSTERIA] Pista del fungo', desc: 'Consegna tartufi a Bazzano Prime. Il prezzo è l\'indizio.', type: 'delivery', targetSid: 'bazzano', cargo: { type: 'tartufi', qty: 1 }, reward: 420, repGain: { savigno: 10 }, cost: 150 }
    ],
    monteveglio: [
      { id: 'tav_mont_prova', title: '[OSTERIA] Prova del bardo', desc: 'Abbatti 2 pirati per l\'onore della Rocca.', type: 'combat', killFaction: 'pirate', killsNeeded: 2, killsDone: 0, reward: 400, repGain: { monteveglio: 10 }, cost: 90 }
    ],
    crespellano: [
      { id: 'tav_cres_niente', title: '[OSTERIA] Niente di speciale', desc: 'Porta "niente" (documenti) a Castelletto. Ironia inclusa.', type: 'delivery', targetSid: 'castelletto', cargo: { type: 'documenti', qty: 1 }, reward: 240, repGain: { crespellano: 6 }, cost: 50 }
    ],
    castelletto: [
      { id: 'tav_cast_red', title: '[OSTERIA] Red Piadina', desc: 'Cerca e abbatti il pirata segnalato (2 kill pirata).', type: 'combat', killFaction: 'pirate', killsNeeded: 2, killsDone: 0, reward: 520, repGain: { pirate: -5 }, cost: 70 }
    ]
  };

  function pickTavernClue(faction) {
    const pool = TAVERN_CLUES[faction] || TAVERN_CLUES.castelletto;
    return pool[(Math.random() * pool.length) | 0];
  }

  global.GameplayPolish = {
    bpHaptic,
    bpPlayPlaceSfx,
    bpPlayEraseSfx,
    bpBrokenCells,
    snapBpCell,
    buildBpPreset,
    rollBoardingExtraLoot,
    runRankFromStats,
    repPriceMult,
    dockAccessCheck,
    pickTavernClue,
    TAVERN_CLUES
  };
})(typeof window !== 'undefined' ? window : globalThis);
