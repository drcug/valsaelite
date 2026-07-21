'use strict';
/**
 * Story helpers — cargo grant, gates (suborbit/hulk), escalating threat, finale.
 */
(function (global) {
  const StorySys = {
    flags: {
      suborbitDone: false,
      hulkBoarded: false,
      boardingsTotal: 0
    },

    threatMul() {
      const S = global.STORY;
      if (!S) return 1;
      const ch = S.chapter || 0;
      let m = 1 + Math.max(0, ch) * 0.2;
      if (S.won) m += 0.35;
      return m;
    },

    npcSpawnInterval() {
      const base = 34;
      return Math.max(12, base / this.threatMul());
    },

    npcMax() {
      return Math.min(220, Math.round(90 + (global.STORY?.chapter || 0) * 14));
    },

    pirateWeightBonus() {
      return Math.min(0.55, 0.08 * (global.STORY?.chapter || 0));
    },

    markSuborbit() {
      this.flags.suborbitDone = true;
    },

    markBoarding(kind) {
      this.flags.boardingsTotal++;
      if (kind === 'hulk') this.flags.hulkBoarded = true;
    },

    /** Grant mission cargo into inventory on accept (top-up to required qty). */
    grantMissionCargo(m) {
      if (!m || !m.cargo || !m.cargo.type) return;
      const PS = global.PS;
      if (!PS) return;
      const t = m.cargo.type;
      const need = Math.max(1, m.cargo.qty || 1);
      const have = PS.cargo[t] || 0;
      const add = Math.max(0, need - have);
      if (add <= 0) return;
      const used = typeof global.cargoCnt === 'function' ? global.cargoCnt() : 0;
      const free = Math.max(0, (PS.cargoMax || 14) - used);
      const real = Math.min(add, Math.max(add, free)); // prefer fulfilling mission even if tight
      PS.cargo[t] = have + Math.max(1, Math.min(add, free || add));
      if (typeof global.notify === 'function') {
        const name = (global.GOODS && global.GOODS[t]) ? global.GOODS[t].name : t;
        const got = (PS.cargo[t] || 0) - have;
        if (got > 0) global.notify('Carico missione ricevuto: ' + name + ' ×' + got, 2200);
      }
    },

    canAccept(m) {
      if (!m) return { ok: true };
      if (m.requireSuborbit && !this.flags.suborbitDone) {
        return { ok: false, msg: 'Prima completa un volo suborbitale su un pianeta (SUBORBITA dalla stazione).' };
      }
      if (m.requireHulk && !this.flags.hulkBoarded) {
        return { ok: false, msg: 'Prima abborda uno Space Hulk (cerca i relitti e premi ABBORDA).' };
      }
      if (m.requireBoarding && this.flags.boardingsTotal < (m.requireBoarding | 0)) {
        return { ok: false, msg: 'Serve almeno un abbordaggio riuscito prima di accettare.' };
      }
      return { ok: true };
    },

    consumeCargo(m) {
      const PS = global.PS;
      if (!PS || !m || !m.cargo) return false;
      const t = m.cargo.type;
      const need = Math.max(1, m.cargo.qty || 1);
      if ((PS.cargo[t] || 0) < need) return false;
      PS.cargo[t] -= need;
      if (PS.cargo[t] <= 0) delete PS.cargo[t];
      return true;
    }
  };

  global.StorySys = StorySys;
})(typeof window !== 'undefined' ? window : globalThis);
