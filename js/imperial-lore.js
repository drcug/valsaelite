'use strict';
/**
 * Lore imperiale condiviso — anno 40.024 E.I., tono satirico DINASTIA.
 * Flavor per diario, osteria, radio; Valsamoggia = micro-potere locale.
 */
(function (global) {
  const IMPERIAL_ERA = '40.024 E.I.';
  const IMPERIAL_ERA_LABEL = '40.024 Era Imperiale (E.I.)';

  const ENCYCLOPEDIA = [
    {
      id: 'imperium',
      title: 'Imperium e Valsamoggia',
      body: 'L\'Impero Galattico è una holding in stallo: guerre con OPA ostili, fax quantistici e avvocati. Valsamoggia è periferia — cinque fazioni locali, non le Dodici Casate. Finché il Mulino gira e il Patto regge, Imperium osserva da lontano. Se il sistema si sgretola, le grandi casate arrivano per il macguffinium nelle anomalie.'
    },
    {
      id: 'craxi',
      title: 'Imperatore Craxi e Trono d\'Oro',
      body: 'Sul Mondo Trono, Craxi resta sul Trono d\'Oro: un resto umano ipermutato, tenuto vivo dalle macchine. Il macguffinium gli ha dato longevità e potere psionico; l\'umanità l\'ha persa. Il Senato ratifica; il CdA Galattico cerca un CEO che lo deponga legalmente. A Valsamoggia questo arriva come bollettini e ispezioni di «settimo livello».'
    },
    {
      id: 'macguffinium',
      title: 'Macguffinium (9D)',
      body: 'Materia a nove dimensioni, scoperta nel 35.123 E.I. È il motivo per cui le anomalie del sistema «respirano» e i depositi tartuferi non stanno mai davvero chiusi. Nei relitti contaminati muta equipaggi e carne. Le casate pagano fortune per un grammo; qui basta non aprire la porta sbagliata.'
    },
    {
      id: 'casate',
      title: 'Casate vs fazioni locali',
      body: 'Dodici Casate Imperiali (Mediaset, Fiat, Nutella…): galassia, liquidità, nepotismo creativo. In Valsamoggia governano Bazzano, Calcara, Savigno, Monteveglio e Castelletto — micro-potenze con rancori di cortile. Il Patto del Molino tiene unite le rotte locali; senza, il sistema diventa appetibile per chi ha già un avvocato orbitale.'
    },
    {
      id: 'patto',
      title: 'Patto del Molino',
      body: 'Testo antico che regola commercio, anomalie e tartufi tra le cinque fazioni. Spezzato, serve ricomporre i frammenti e riaccendere il Mulino. Non è folclore da brochure: è la differenza tra «periferia ignorata» e «fronte galattico con menu degustazione».'
    },
    {
      id: 'circuito',
      title: 'Circuito Depositi',
      body: 'Tre vault della cintura tartufera sotto Savigno. Le anomalie fanno «respirare» i magazzini; il Consiglio rifiuta la chiusura interna (frodi, ispezioni imperiali finte). Vuole un sigillo esterno — il tuo codice di volo — registrato prima dei tartufi e del terzo frammento.'
    }
  ];

  const TAVERN_LINES = [
    { s: 'Veterano di Imperium', t: '"40.024 E.I. e ancora mandano funzionari di settimo livello. Craxi dorme sul Trono d\'Oro; il Senato firma ciò che gli mettono sotto il naso. Qui almeno il tartufo è reale."' },
    { s: 'Doganiere', t: '"Macguffinium: nove dimensioni, un solo prezzo. Le casate contano; io conto i sigilli. Se il Circuito è aperto, Imperium ha una scusa per bussare."' },
    { s: 'Archivista', t: '"Il Patto del Molino non è nel manuale di Imperium. È nel fango locale. Spezzarlo è facile; ricucirlo costa nervi, tartufi e tre sigilli che non puoi falsare da un verbale."' },
    { s: 'Pilota di linea', t: '"Space hulk e nave disabilitata non sono la stessa cosa. L\'hulk ha documenti imperiali vecchi e equipaggi che non tornano con lo stesso numero di dita. Leggi prima di abbordare."' },
    { s: 'Cuoco di bordo', t: '"Confindustria Galattica: dove le fusioni sono matrimoni e i divorzi sono liquidazioni. Valsamoggia non è nel PowerPoint — per ora."' }
  ];

  const RADIO_LINES = [
    'Bollettino: Imperium classifica Valsamoggia come periferia operativa. Il Mulino acceso aiuta.',
    'Canale aperto: qualcuno parla di macguffinium nelle anomalie. Le casate stanno già facendo i conti.',
    'Nota di servizio: ispezioni di «settimo livello» richiedono sigilli esterni sui depositi. Non sui verbali.',
    'Voci da Imperium: il Trono d\'Oro non dorme — registra. Craxi registra anche quando non risponde.',
    'Traffico: corsie commerciali ok. Circuito Depositi: solo piloti con codice di volo valido.'
  ];

  function encyclopediaHtml() {
    return ENCYCLOPEDIA.map(e =>
      '<div class="diary-ch done" style="margin-bottom:10px"><h3 style="font-size:13px;margin:0 0 6px">' + e.title + '</h3>'
      + '<p class="dm" style="margin:0">' + e.body + '</p></div>'
    ).join('');
  }

  function helpEncyclopediaHtml() {
    return '<div style="margin-top:14px;padding-top:10px;border-top:1px solid rgba(80,140,200,.35)">'
      + '<div style="font:11px var(--FD);color:#8ab8d8;margin-bottom:8px;letter-spacing:.12em">ENCICLOPEDIA · ' + IMPERIAL_ERA + '</div>'
      + ENCYCLOPEDIA.map(e =>
        '<p style="margin:0 0 10px;font-size:12px;line-height:1.45;color:#c8dce8">'
        + '<strong style="color:#e8f4ff">' + e.title + '</strong> — ' + e.body + '</p>'
      ).join('')
      + '</div>';
  }

  function tavernLoreLine() {
    return pick(TAVERN_LINES);
  }

  function radioLoreLine() {
    return pick(RADIO_LINES);
  }

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  const ImperialLore = {
    IMPERIAL_ERA,
    IMPERIAL_ERA_LABEL,
    ENCYCLOPEDIA,
    encyclopediaHtml,
    helpEncyclopediaHtml,
    tavernLoreLine,
    radioLoreLine
  };

  global.ImperialLore = ImperialLore;
})(typeof window !== 'undefined' ? window : globalThis);
