'use strict';
/**
 * Story helpers — cargo grant, gates (suborbit/hulk), escalating threat, finale.
 */
(function (global) {
  const StorySys = {
    flags: {
      suborbitDone: false,
      hulkBoarded: false,
      boardingsTotal: 0,
      /** Sigilli parziali Circuito: { planetId: ['dep_0', ...] } */
      circuitSealedIds: {}
    },

    threatMul() {
      const S = global.STORY;
      if (!S) return 1;
      const ch = S.chapter || 0;
      // Cresce con i capitoli: più traffico e ostili
      let m = 1 + Math.max(0, ch) * 0.28;
      if (S.won) m += 0.4;
      return m;
    },

    npcSpawnInterval() {
      const base = 30;
      return Math.max(8, base / this.threatMul());
    },

    npcMax() {
      return Math.min(280, Math.round(110 + (global.STORY?.chapter || 0) * 18));
    },

    pirateWeightBonus() {
      return Math.min(0.62, 0.1 + 0.09 * (global.STORY?.chapter || 0));
    },

    /** Moltiplicatore danni / aggressività NPC ostili */
    hostileDmgMul() {
      return 1 + Math.min(0.85, (global.STORY?.chapter || 0) * 0.09);
    },

    markSuborbit() {
      this.flags.suborbitDone = true;
      if (global.StoryGuide && typeof global.StoryGuide.onAction === 'function') {
        global.StoryGuide.onAction('circuit');
      }
    },

    markBoarding(kind) {
      this.flags.boardingsTotal++;
      if (kind === 'hulk') {
        this.flags.hulkBoarded = true;
        const PS = global.PS;
        if (PS) {
          if (!PS.loreFlags) PS.loreFlags = {};
          PS.loreFlags.hulk_imperial_docs = 1;
          PS.loreFlags.hulk_visited = 1;
        }
        if (global.StoryGuide && typeof global.StoryGuide.onAction === 'function') {
          global.StoryGuide.onAction('hulk');
        }
      }
    },

    /** Registra sigillo su un vault del Circuito (persiste tra run). */
    recordCircuitSeal(planetId, depId) {
      if (!planetId || !depId) return;
      if (!this.flags.circuitSealedIds) this.flags.circuitSealedIds = {};
      const list = this.flags.circuitSealedIds[planetId];
      if (!list) this.flags.circuitSealedIds[planetId] = [depId];
      else if (!list.includes(depId)) list.push(depId);
    },

    circuitSealCount(planetId) {
      const m = this.flags.circuitSealedIds;
      if (!m || !planetId || !m[planetId]) return 0;
      return m[planetId].length;
    },

    isCircuitDepSealed(planetId, depId) {
      const m = this.flags.circuitSealedIds;
      if (!m || !planetId || !m[planetId]) return false;
      return m[planetId].includes(depId);
    },

    /** Massimo sigilli registrati su un pianeta (per progresso Cap.4). */
    circuitBestProgress() {
      const m = this.flags.circuitSealedIds || {};
      let best = 0;
      Object.values(m).forEach((arr) => {
        best = Math.max(best, (arr && arr.length) || 0);
      });
      return best;
    },

    /** Grant mission cargo into inventory on accept (top-up to required qty). */
    grantMissionCargo(m) {
      if (!m || !m.cargo || !m.cargo.type) return;
      const PS = global.PS;
      if (!PS) return;
      const t = m.cargo.type;
      const need = Math.max(1, (m.cargo.qty | 0) || 1);
      // Riserva già impegnata da altre missioni attive sullo stesso tipo.
      let reservedOther = 0;
      (PS.activeMissions || []).forEach((am) => {
        if (!am || am === m || am.done || !am.cargo || am.cargo.type !== t) return;
        reservedOther += Math.max(1, (am.cargo.qty | 0) || 1);
      });
      const have = (PS.cargo[t] | 0) || 0;
      const freeForThis = Math.max(0, have - reservedOther);
      const add = Math.max(0, need - freeForThis);
      if (add <= 0) {
        if (typeof global.notify === 'function') {
          const name = (global.GOODS && global.GOODS[t]) ? global.GOODS[t].name : t;
          global.notify('Carico missione già a bordo: ' + name + ' ×' + need, 1800);
        }
        return;
      }
      // Missioni storia: forza il carico anche se la stiva è piena
      PS.cargo[t] = have + add;
      if (typeof global.notify === 'function') {
        const name = (global.GOODS && global.GOODS[t]) ? global.GOODS[t].name : t;
        global.notify('Oggetti missione in inventario: ' + name + ' ×' + add, 2400);
      }
    },

    canAccept(m) {
      if (!m) return { ok: true };
      if (m.requireSuborbit && !this.flags.suborbitDone) {
        const n = this.circuitBestProgress();
        const partial = n > 0 ? ' (' + n + '/3 già registrati — rientra in suborbita per il resto)' : '';
        return {
          ok: false,
          msg: 'Prima chiudi il Circuito Depositi: 3 vault sigillati in suborbita (SIGILLA o E). Dalla stazione: CIRCUITO DEPOSITI / VOLO SUBORBITALE.' + partial
        };
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
      const need = Math.max(1, (m.cargo.qty | 0) || 1);
      const have = (PS.cargo[t] | 0) || 0;
      if (have < need) return false;
      PS.cargo[t] = have - need;
      if (PS.cargo[t] <= 0) delete PS.cargo[t];
      return true;
    }
  };

  global.StorySys = StorySys;
})(typeof window !== 'undefined' ? window : globalThis);
