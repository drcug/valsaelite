'use strict';
/**
 * Asset map — illustrazioni storia + panorami pianeti (Forbidden Planet)
 */
(function (global) {
  const STORY_ART = {
    prologue: 'sprites/story/prologue.jpg',
    1: 'sprites/story/ch01.jpg',
    2: 'sprites/story/ch02.jpg',
    3: 'sprites/story/ch03.jpg',
    4: 'sprites/story/ch04.jpg',
    5: 'sprites/story/ch05.jpg',
    6: 'sprites/story/ch06.jpg',
    7: 'sprites/story/ch07.jpg',
    8: 'sprites/story/ch08.jpg',
    stamp: 'sprites/story/ch03.jpg',
    finale: 'sprites/story/finale.jpg',
    finaleSeq: 'sprites/story/finale_seq.jpg',
    finale1: 'sprites/story/finale/finale_01.jpg',
    finale2: 'sprites/story/finale/finale_02.jpg',
    finale3: 'sprites/story/finale/finale_03.jpg',
    finale4: 'sprites/story/finale/finale_04.jpg',
    finale5: 'sprites/story/finale/finale_05.jpg',
    intro1: 'sprites/story/intro/intro_01.jpg',
    intro2: 'sprites/story/intro/intro_02.jpg',
    intro3: 'sprites/story/intro/intro_03.jpg',
    intro4: 'sprites/story/intro/intro_04.jpg',
    intro5: 'sprites/story/intro/intro_05.jpg',
    uni1: 'sprites/story/universe/uni_01.jpg',
    uni2: 'sprites/story/universe/uni_02.jpg',
    uni3: 'sprites/story/universe/uni_03.jpg',
    uni4: 'sprites/story/universe/uni_04.jpg',
    uni5: 'sprites/story/universe/uni_05.jpg',
    uni6: 'sprites/story/universe/uni_06.jpg',
    uni7: 'sprites/story/universe/uni_07.jpg',
    uni8: 'sprites/story/universe/uni_08.jpg',
    uni9: 'sprites/story/universe/uni_09.jpg'
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
    if (/finale|mulino acceso|vittoria|patto firmato|rapporto a imperium/i.test(t)) {
      if (/casa|cipress|ritorno/i.test(t)) return STORY_ART.finale4 || STORY_ART.finaleSeq;
      if (/imperium|rapporto|bollettino/i.test(t)) return STORY_ART.finale3 || STORY_ART.finale;
      if (/firm|fazioni|patto/i.test(t)) return STORY_ART.finale2 || STORY_ART.finale;
      if (/zvan|osteria|bicchiere/i.test(t)) return STORY_ART.finale5 || STORY_ART.finale;
      return STORY_ART.finale1 || STORY_ART.finale;
    }
    if (/consigliere|bazzano|patto|molino/i.test(t)) return STORY_ART.finale;
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
    [
      'sprites/story/hulk/hulk-suit-up.jpg',
      'sprites/story/hulk/hulk-escape-pod.jpg',
      'sprites/story/hulk/hulk-victory.jpg'
    ].forEach(preload);
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
