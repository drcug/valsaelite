'use strict';
/**
 * Asset map — illustrazioni storia + panorami pianeti (Forbidden Planet)
 */
(function (global) {
  const STORY_ART = {
    prologue: 'sprites/story/prologue.jpg',
    1: 'sprites/story/ch01.jpg',
    2: 'sprites/story/ch02.jpg',
    3: 'sprites/story/ch04.jpg',      // torneo Monteveglio
    4: 'sprites/story/ch05.jpg',      // tartufi Savigno
    5: 'sprites/story/ch03.jpg',      // ritorno Bazzano / Patto
    6: 'sprites/story/ch06.jpg',      // Ombra di Imperium
    7: 'sprites/story/ch07.jpg',      // Fuoco sulla Rocca
    8: 'sprites/story/ch08.jpg',      // Mulino Acceso
    stamp: 'sprites/story/ch03.jpg',
    finale: 'sprites/story/finale.jpg'
  };

  /** Panorami per corpo principale; satelliti ereditano dal parent */
  const PLANET_PANO = {
    bazzano: 'sprites/planets/bazzano.jpg',
    crespellano: 'sprites/planets/crespellano.jpg',
    calcara: 'sprites/planets/calcara.jpg',
    monteveglio: 'sprites/planets/monteveglio.jpg',
    savigno: 'sprites/planets/savigno.jpg',
    oliveto: 'sprites/planets/oliveto.jpg',
    castelletto: 'sprites/planets/castelletto.jpg',
    serravalle: 'sprites/planets/serravalle.jpg',
    sirena: 'sprites/planets/sirena.jpg',
    // aliases / satellites → nearest panorama
    lavino: 'sprites/planets/bazzano.jpg',
    zola: 'sprites/planets/bazzano.jpg',
    pragatto: 'sprites/planets/crespellano.jpg',
    manzolino: 'sprites/planets/crespellano.jpg',
    montebudello: 'sprites/planets/monteveglio.jpg',
    montecalvo: 'sprites/planets/monteveglio.jpg',
    zappolino: 'sprites/planets/savigno.jpg',
    san_chierlo: 'sprites/planets/savigno.jpg'
  };

  const PARENT_PANO = {
    sirena: 'bazzano', lavino: 'bazzano', zola: 'bazzano',
    calcara: 'calcara', pragatto: 'crespellano', manzolino: 'crespellano',
    oliveto: 'oliveto', montebudello: 'monteveglio', montecalvo: 'monteveglio',
    zappolino: 'savigno', san_chierlo: 'savigno'
  };

  function storyArtFor(label, title) {
    if (!label) return STORY_ART.prologue;
    const s = String(label).toUpperCase();
    if (s.indexOf('PROLOGO') >= 0) return STORY_ART.prologue;
    const m = s.match(/CAPITOLO\s*(\d+)/);
    if (m) return STORY_ART[parseInt(m[1], 10)] || STORY_ART.prologue;
    const t = String(title || '');
    if (/timbro|copia|calcara/i.test(t)) return STORY_ART.stamp;
    if (/rocca|torneo|monteveglio|frecce/i.test(t)) return STORY_ART[3];
    if (/palato|tartuf|savigno/i.test(t)) return STORY_ART[4];
    if (/ombra|imperium|castelletto|rapporto/i.test(t)) return STORY_ART[6];
    if (/fuoco|pirat|caccia/i.test(t)) return STORY_ART[7];
    if (/mulino acceso|piadin/i.test(t)) return STORY_ART[8];
    if (/consigliere|bazzano|patto|vittoria|molino/i.test(t)) return STORY_ART.finale;
    if (/pressione|pirata/i.test(t)) return STORY_ART.stamp;
    return STORY_ART.prologue;
  }

  function planetPano(id) {
    if (!id) return null;
    if (PLANET_PANO[id]) return PLANET_PANO[id];
    const parent = PARENT_PANO[id];
    return parent ? PLANET_PANO[parent] : null;
  }

  const imgCache = Object.create(null);
  function preload(url) {
    if (!url || imgCache[url]) return imgCache[url] || null;
    const im = new Image();
    im.decoding = 'async';
    im.src = url;
    imgCache[url] = im;
    return im;
  }

  function preloadAll() {
    Object.values(STORY_ART).forEach(preload);
    Object.values(PLANET_PANO).forEach(preload);
  }

  global.STORY_ART = STORY_ART;
  global.PLANET_PANO = PLANET_PANO;
  global.storyArtFor = storyArtFor;
  global.planetPano = planetPano;
  global.preloadGameArt = preloadAll;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', preloadAll);
    } else {
      preloadAll();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
