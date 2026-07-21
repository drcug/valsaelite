'use strict';
/**
 * Dialoghi RADICI — incontri sui pianeti con gente che conosceva Zvan Marìa
 * prima di Imperium. Tema: ritorno, dialetto, estraneità.
 * Parlata bazzanese (glossario di gioco) usata nei testi NPC.
 */
(function (global) {
  /**
   * Alberi dialogo. speaker: 'npc' | 'zvan'
   * next: node id | null (chiude)
   * fx: { rep, credits, note, mark }
   */
  const ROOT_ENCOUNTERS = {
    bazzano: [
      {
        id: 'root_bazz_osteria',
        minChapter: 1,
        title: 'Osteria del Mulino',
        npcName: 'Mirco "Tavò" Baldi',
        npcTitle: 'COMPAGNO DI SCUOLA · BAZZANO',
        npcSeed: 4401,
        faction: 'bazzano',
        blurb: 'Uno che ti chiamava Zvanino prima che partissi per Imperium.',
        start: 'n1',
        nodes: {
          n1: {
            speaker: 'npc',
            text: 'Tavò… Zvanino? Csa fet in cul set? Toronto: pensavo fossi diventato una firma su un bollettino. Vieni qua, bsoa una bottiglia — ega non fare il supersedentes di Imperium.',
            choices: [
              { label: '[DIALETTO] "Taproblem… cioè: sto bene."', next: 'n2a' },
              { label: '[IMPERIUM] "Funzionario Marìa. In missione ufficiale."', next: 'n2b' },
              { label: '[SILENZIO] Gli stringi la mano senza parlare.', next: 'n2c' }
            ]
          },
          n2a: {
            speaker: 'npc',
            text: 'Hai detto "taproblem" come chi legge il dizionario. Carino. Ma la lingua ti trema: vent\'anni di marmo. Ascolta — nichita qui ha dimenticato il tuo nome. Io no. Tu sì, di te.',
            choices: [
              { label: '[ZVAN] "Ho paura di non capire più casa."', next: 'n3' },
              { label: '[ZVAN] "Casa era un ritardo. Imperium era lavoro."', next: 'n3b' }
            ]
          },
          n2b: {
            speaker: 'npc',
            text: 'Com\'è l\'idea della pressa? "Funzionario Marìa". Qui eri quello che scendeva a priori dai compiti. Adesso parli come una pressa da ufficio. Taebol, Zvanino. Taebol.',
            choices: [
              { label: '[ZVAN] "Forse sono diventato la pressa."', next: 'n3' },
              { label: '[ZVAN] "Il titolo è armatura. Sotto c\'è ancora fame di vino."', next: 'n3' }
            ]
          },
          n2c: {
            speaker: 'npc',
            text: 'Tacivecìssent, eh? Come quando ti chiedevano della ragazza e tu tavulv apert nella testa. Va bene. Il silenzio qui è onesto. A Imperium il silenzio è un protocollo.',
            choices: [{ label: '[ZVAN] "Il protocollo mi ha tenuto in vita. Qui mi fa male."', next: 'n3' }]
          },
          n3: {
            speaker: 'zvan',
            text: 'Mirco… a Imperium ogni corridoio aveva un numero. Qui ogni odore ha un nome. Io ricordo i numeri meglio dei nomi. Ecco cosa significa tornare: scoprire di essere un ospite con la chiave di casa.',
            choices: [{ label: '[ASCOLTA]', next: 'n4' }]
          },
          n3b: {
            speaker: 'zvan',
            text: 'Ho detto "ritardo" e mi è venuto il vomito. Non è vero. Casa non era ritardo: ero io che avevo fretta di sembrare importante.',
            choices: [{ label: '[ASCOLTA]', next: 'n4' }]
          },
          n4: {
            speaker: 'npc',
            text: 'Allora ascolta il tavò vero: non ti chiedo di tornare ragazzo. Ti chiedo di non fare il satellite dopo nove ore di Imperium. Siediti. Bevi. Se tarenz\'la psiche — pazienza. Bsoa tempo. Non bollettini.',
            choices: [
              { label: '[RESTA] Bevi in silenzio. (+rep Bazzano)', next: null, fx: { rep: { bazzano: 4 }, note: 'Hai lasciato l\'armatura sul bancone, per una sera.' } },
              { label: '[FUGGI] "Devo… coordinare."', next: null, fx: { note: 'Mirco scuote la testa: "Toronto. Sei ancora in orbita."' } }
            ]
          }
        }
      },
      {
        id: 'root_bazz_zia',
        minChapter: 3,
        title: 'Cortile dietro il Mulino',
        npcName: 'Zia Ornella',
        npcTitle: 'FAMIGLIA · BAZZANO',
        npcSeed: 4412,
        faction: 'bazzano',
        blurb: 'Ti ha visto partire. Non ti ha mai scritto: "scendere a priori", diceva.',
        start: 'z1',
        nodes: {
          z1: {
            speaker: 'npc',
            text: 'Zvan. Non "funzionario". Zvan. Sei magro come un arimanni che cambia casa ogni anno — solo che tu hai cambiato pianeta. Teba… no: teba niente. Ho paura di non riconoscerti, non di altro.',
            choices: [
              { label: '[ZVAN] "Non so più come chiamarmi qui."', next: 'z2' },
              { label: '[ZVAN] "Mi hanno mandato. Non sono tornato: mi hanno rispedito."', next: 'z2b' }
            ]
          },
          z2: {
            speaker: 'zvan',
            text: 'A Imperium il mio nome era un livello. Settimo. Qui il mio nome era un diminutivo. Tra i due c\'è un vuoto dove dovrebbero esserci i parenti e invece ci sono i rapporti.',
            choices: [{ label: '[ASCOLTA]', next: 'z3' }]
          },
          z2b: {
            speaker: 'npc',
            text: 'Rispedito. Come un pacco. Hai mai tirato il cordolo del cesso? No, scusa: voglio dire — hai mai pianto senza verbale? Perché se no, Zvan, sei rovinato tost al prosciutto.',
            choices: [{ label: '[ZVAN] "Ho pianto. In un bagno di pietra. Nessuno ha firmato."', next: 'z3' }]
          },
          z3: {
            speaker: 'npc',
            text: 'Allora resta. Non per il Patto. Per il cortile. Se tabrein in cupola — sediamoci finché capisci. Io non ti chiedo Imperium. Ti chiedo se zantic lo spazio ti ha congelato la lingua o solo la voglia.',
            choices: [
              { label: '[RESTA] "Insegno a dire di nuovo Zvanino." (+rep)', next: null, fx: { rep: { bazzano: 6 }, note: 'Zia Ornella ti lascia un fazzoletto. Puzza di sapone locale, non di sterilizzazione.' } },
              { label: '[PARTE] "Il Patto non aspetta."', next: null, fx: { note: 'Lei non ti ferma. Le madri e le zie sanno quando un figlio è già partito.' } }
            ]
          }
        }
      },
      {
        id: 'root_bazz_specchio',
        minChapter: 6,
        title: 'Bagno dell\'osteria — dopo l\'ispettore',
        npcName: 'Specchio appannato',
        npcTitle: 'TU · BAZZANO',
        npcSeed: 1,
        faction: 'bazzano',
        blurb: 'Nessuno di fronte: solo il tuo riflesso. E la voce che non è più dialetto.',
        start: 's1',
        playerOnly: true,
        nodes: {
          s1: {
            speaker: 'zvan',
            text: 'Mi guardo e vedo l\'uniforme. Il distintivo del pianeta con l\'anello. A Imperium sembrava casa. Qui sembra un costume da carnevale costoso.',
            choices: [
              { label: '[AMMETTI] "Sono diventato estraneo al mio posto."', next: 's2' },
              { label: '[NEGHI] "Sono ancora di qui. Toront— …no."', next: 's2b' }
            ]
          },
          s2: {
            speaker: 'zvan',
            text: 'Estraneo. Non perché loro mi respingano: perché io misuro tutto in procedure. Il vino ha bisogno di un verbale? Il Mulino di un allegato? Dio — sto redigendo il ritorno.',
            choices: [{ label: '[CONTINUA]', next: 's3' }]
          },
          s2b: {
            speaker: 'zvan',
            text: 'Non riesco nemmeno a finire "Toronto". La negazione mi esce a metà, come un uomo che ha dimenticato come si dice no in casa propria.',
            choices: [{ label: '[CONTINUA]', next: 's3' }]
          },
          s3: {
            speaker: 'zvan',
            text: 'Va bene. Allora la missione non è solo il Patto. È imparare a stare in un cortile senza trasmettere un rapporto. Se fallisco, almeno fallisco qui — non in un corridoio di marmo.',
            choices: [
              { label: '[CHIUDI GLI OCCHI]', next: null, fx: { note: 'Hai scritto qualcosa di vero senza timbro. Il diario trema.' , mark: 'root_mirror' } }
            ]
          }
        }
      }
    ],

    crespellano: [
      {
        id: 'root_cres_cugina',
        minChapter: 1,
        title: 'Archivio — corridoio laterale',
        npcName: 'Lia Marìa',
        npcTitle: 'CUGINA · CRESPELLANO',
        npcSeed: 5502,
        faction: 'crespellano',
        blurb: 'Stesso cognome. Stessa coda alle pratiche. Lei non è mai partita.',
        start: 'c1',
        nodes: {
          c1: {
            speaker: 'npc',
            text: 'Zvan. Il semaforo aspetta dal 2003 e tu torni con una busta nera. Nichita qui ha ricevuto una busta nera. Solo modulistica. Dimmi: sei venuto per il Patto o perché Imperium ti ha mandato a fare il corriere di nostalgia?',
            choices: [
              { label: '[ZVAN] "Per entrambi. E non so quale dei due mi faccia più male."', next: 'c2' },
              { label: '[DIALETTO] "Taproblem… no. Non è taproblem."', next: 'c2b' }
            ]
          },
          c2: {
            speaker: 'zvan',
            text: 'A Imperium dicevano che Crespellano produce "niente". Io ridevo. Poi ho capito: il niente era l\'unica cosa che non potevano comprare. Io invece mi sono venduto a pezzi di grado.',
            choices: [{ label: '[ASCOLTA]', next: 'c3' }]
          },
          c2b: {
            speaker: 'npc',
            text: 'Hai ragione a correggerti. "Taproblem" detto da te suona come una traduzione. Come quando i turisti dicono tavò e pensano di essere simpatici. Tu non sei turista. Sei peggio: sei un reduce del marmo.',
            choices: [{ label: '[ZVAN] "Insegnami di nuovo a sbagliare in dialetto."', next: 'c3' }]
          },
          c3: {
            speaker: 'npc',
            text: 'Allora ascolta: qui le radici non si recuperano con un capitolo. Si recuperano restando in fila. Se tebatene di Imperium — bene. Se no, torna a firmare. Io resto a aspettare il verde. Come sempre.',
            choices: [
              { label: '[RESTA IN FILA] (+rep Crespellano)', next: null, fx: { rep: { crespellano: 5 }, note: 'Lia ti lascia una chiave dell\'archivio "classificato male". Sa di polvere e di casa.' } },
              { label: '[VAI]', next: null, fx: { note: 'Lei non ti saluta in ufficiale. Solo: "Zvan." Bastava.' } }
            ]
          }
        }
      }
    ],

    calcara: [
      {
        id: 'root_calc_compagno',
        minChapter: 2,
        title: 'Terzo hangar — dietro i cartelli',
        npcName: 'Dario Tagliati',
        npcTitle: 'EX COMPAGNO · CALCARA',
        npcSeed: 6603,
        faction: 'calcara',
        blurb: 'Da ragazzi rubavate bollette per ridere. Ora lui stampa verità.',
        start: 'k1',
        nodes: {
          k1: {
            speaker: 'npc',
            text: 'Marìa. Settimo livello. Hai portato il pezzo e vuoi il timbro. Una volta dicevi che i timbri erano pananai. Adesso sei pananai con lo stipendio. Congratulazioni: sei diventato prodotto.',
            choices: [
              { label: '[ZVAN] "So di essere diventato ciò che odiavo."', next: 'k2' },
              { label: '[DIFESA] "Senza Imperium questo anello collassa."', next: 'k2b' }
            ]
          },
          k2: {
            speaker: 'zvan',
            text: 'A Imperium mi hanno insegnato che l\'ufficialità è ordine. Qui vedo che l\'ordine è una merce. E io… io ho il distintivo di chi vende. Mi fa schifo. E mi tiene in piedi.',
            choices: [{ label: '[ASCOLTA]', next: 'k3' }]
          },
          k2b: {
            speaker: 'npc',
            text: 'Collassa. Come la tua parlata. Prova a dire "tavalvol apr" senza sembrare un manuale. Non ci riesci. Perché la macchina che non funziona, adesso, sei tu.',
            choices: [{ label: '[ZVAN] "Allora aiutami a ripararla — senza fattura."', next: 'k3' }]
          },
          k3: {
            speaker: 'npc',
            text: 'Senza fattura non esisto. Però… ti do un consiglio non timbrato: non firmare ciò che non puoi difendere a Bazzano, a voce alta, da ubriaco. Se lo fai, sei solo un satellite di Imperium. Endàvs.',
            choices: [
              { label: '[ACCETTA IL COLPO] (+rep Calcara piccola)', next: null, fx: { rep: { calcara: 3 }, note: 'Dario non ti offre da bere. Ti offre un silenzio onesto. È raro qui.' } },
              { label: '[VAI VIA UFFICIALE]', next: null, fx: { rep: { calcara: -2 }, note: 'Hai chiuso come un verbale. Lui ha firmato con lo sguardo: "estraneo".' } }
            ]
          }
        }
      }
    ],

    monteveglio: [
      {
        id: 'root_mont_paladino',
        minChapter: 3,
        title: 'Cortile della Rocca — dopo il torneo',
        npcName: 'Serafina "ex-Seri"',
        npcTitle: 'PALADINA · AMICA D\'INFANZIA',
        npcSeed: 7704,
        faction: 'monteveglio',
        gender: 'f',
        blurb: 'Insieme giocavate a essere cavalieri. Lei ha continuato. Tu sei andato al marmo.',
        start: 'm1',
        nodes: {
          m1: {
            speaker: 'npc',
            text: 'Zvan. Le frecce di luce sono laser — lo sapevamo anche da bambini. Tu sei partito per chiamarle "sistemi d\'arma". Io sono rimasta a chiamarle promesse. Chi di noi ha tradito il gioco?',
            choices: [
              { label: '[ZVAN] "Io. Ho scambiato il gioco con il grado."', next: 'm2' },
              { label: '[ZVAN] "Nessuno. Siamo cresciuti in direzioni diverse."', next: 'm2b' }
            ]
          },
          m2: {
            speaker: 'zvan',
            text: 'A Imperium il gioco è vietato: si chiama inefficienza. Qui il gioco è governo. Io sto in mezzo, senza armatura vera e senza divertimento. Solo missione.',
            choices: [{ label: '[ASCOLTA]', next: 'm3' }]
          },
          m2b: {
            speaker: 'npc',
            text: 'Direzioni diverse. Parole da rapporto. Da noi si diceva: "hai asportato il parrucchino" — cioè hai detto una stronzata elegante. Torna a sporcarti. Torna a ridere senza verbale.',
            choices: [{ label: '[ZVAN] "Insegnami una risata senza protocollo."', next: 'm3' }]
          },
          m3: {
            speaker: 'npc',
            text: 'Allora resta stanotte alla Rocca. Non come funzionario: come quello che perdeva sempre al LARP e mentiva sul punteggio. Se tabrein in cupola sul Patto — bene. Ma prima dimmi il tuo nome senza livello.',
            choices: [
              { label: '[DICI] "Zvan. Solo Zvan." (+rep Monteveglio)', next: null, fx: { rep: { monteveglio: 6 }, note: 'Serafina ti passa un elmo troppo stretto. Ti sta ridicolo. Ti sta bene.' } },
              { label: '[DICI] "Funzionario Marìa."', next: null, fx: { note: 'Lei inchina la testa come a un ospite. Non a un amico.' } }
            ]
          }
        }
      }
    ],

    savigno: [
      {
        id: 'root_sav_zio',
        minChapter: 4,
        title: 'Deposito del freddo — dopo la suborbita',
        npcName: 'Zio Remo',
        npcTitle: 'FAMIGLIA · SAVIGNO',
        npcSeed: 8805,
        faction: 'savigno',
        blurb: 'Parla poco. Giudica dall\'aroma. Sa se sei ancora di casa.',
        start: 'v1',
        nodes: {
          v1: {
            speaker: 'npc',
            text: 'Zantic lo spazio, eh? Tu puzzi di sterilizzazione. Non di tartufo. Dimmi: il sapore di casa lo ricordi o lo hai archiviato sotto "tradizione locale"?',
            choices: [
              { label: '[ZVAN] "Lo ricordo. Mi fa paura assaggiarlo: potrei scoprire che non mi appartiene più."', next: 'v2' },
              { label: '[DIALETTO] "Bsoa… tempo. Tavò di spiegare."', next: 'v2b' }
            ]
          },
          v2: {
            speaker: 'zvan',
            text: 'A Imperium il cibo non aveva parenti. Qui ogni piatto ha un morto e un vivo. Io ho mangiato vent\'anni senza genealogia. Ora tremo davanti a tre chili di verità.',
            choices: [{ label: '[ASCOLTA]', next: 'v3' }]
          },
          v2b: {
            speaker: 'npc',
            text: 'Meglio. Hai detto tavò giusto. Non da manuale. Forse sotto l\'uniforme c\'è ancora un ragazzo che scendeva a priori dalla lezione per rubare porcini. Forse.',
            choices: [{ label: '[ZVAN] "Quel ragazzo ha fame. Il funzionario ha paura."', next: 'v3' }]
          },
          v3: {
            speaker: 'npc',
            text: 'Allora assaggia. Se tagiov la canz del ritorno — vattene. Se no, resta zantic con noi. Il Patto senza palato è solo carta. E la carta, a Savigno, non scalda.',
            choices: [
              { label: '[ASSAGGIA] (+rep Savigno)', next: null, fx: { rep: { savigno: 7 }, note: 'Il sapore ti spacca il petto. Non è nostalgia: è prova. Sei ancora capace di appartenere.' } },
              { label: '[RIFIUTI IL RITO]', next: null, fx: { note: 'Remo non insiste. L\'isolamento è anche questo: lasciarti fuori senza odio.' } }
            ]
          }
        }
      }
    ],

    castelletto: [
      {
        id: 'root_cast_neutrale',
        minChapter: 6,
        title: 'Bar della Roccia — benzina e caffè',
        npcName: 'Paola "Neutra"',
        npcTitle: 'EX VALSAMOGGIA · CASTELLETTO',
        npcSeed: 9906,
        faction: 'bazzano',
        gender: 'f',
        blurb: 'Anche lei è partita — ma non per Imperium. Per non scegliere fazione.',
        start: 'x1',
        nodes: {
          x1: {
            speaker: 'npc',
            text: 'Zvan Marìa. Ti riconosco dal modo in cui ordini il caffè: come una richiesta di autorizzazione. Io sono scappata dalle fazioni. Tu sei scappato dentro Imperium. Due fughe. Stessa nostalgia.',
            choices: [
              { label: '[ZVAN] "Almeno tu non fingi di tornare salvatore."', next: 'x2' },
              { label: '[ZVAN] "Io non sono scappato. Mi hanno promosso lontano."', next: 'x2b' }
            ]
          },
          x2: {
            speaker: 'zvan',
            text: 'Salvatore. Che parola da pressa. Io porto pezzi di Patto e pezzi di me. I secondi non rientrano nell\'allegato. Ecco perché qui, su questa roccia, respiro: nessuno mi chiede un livello.',
            choices: [{ label: '[ASCOLTA]', next: 'x3' }]
          },
          x2b: {
            speaker: 'npc',
            text: 'Promosso lontano. Bellissima formula. A Bazzano si direbbe che hai preso senilità con le donne — ma per te è senilità con la casa. Hai preso male. E continui a chiamarlo carriera.',
            choices: [{ label: '[ZVAN] "Allora aiutami a chiamarlo col suo nome: perdita."', next: 'x3' }]
          },
          x3: {
            speaker: 'npc',
            text: 'Perdita. Bene. Adesso bevi. Qui abbiamo benzina e caffè. Niente Patto, niente fazioni, niente supersedentes. Solo gente che sa di essere di passaggio — e per questo, stranamente, è più onesta.',
            choices: [
              { label: '[BEVI] (nota interiore)', next: null, fx: { note: 'Paola non ti chiede di restare. Ti chiede di non mentire sul perché sei partito. È già una patria.' } },
              { label: '[PAGHI E VAI]', next: null, fx: { note: 'Il caffè sa di metallo. Come Imperium. Lo noti solo ora.' } }
            ]
          }
        }
      }
    ]
  };

  // Map satellite stations to parent planet encounters where useful
  const ALIAS = {
    sirena: 'bazzano',
    calcara: 'calcara',
    zappolino: 'savigno',
    san_chierlo: 'savigno',
    serravalle: 'castelletto'
  };

  function encountersForStation(stId) {
    const key = ALIAS[stId] || stId;
    return ROOT_ENCOUNTERS[key] || [];
  }

  function seenSet() {
    const PS = global.PS;
    if (!PS) return {};
    if (!PS.rootSeen) PS.rootSeen = {};
    return PS.rootSeen;
  }

  function isSeen(id) {
    return !!seenSet()[id];
  }

  function markSeen(id) {
    seenSet()[id] = 1;
  }

  function availableEncounters(stId, chapter) {
    const ch = chapter != null ? chapter : (global.STORY && global.STORY.chapter) || 0;
    return encountersForStation(stId).filter((e) => {
      if (isSeen(e.id)) return false;
      if ((e.minChapter || 1) > ch && !(global.STORY && global.STORY.won)) return false;
      return true;
    });
  }

  function applyFx(fx) {
    if (!fx) return;
    const PS = global.PS;
    if (fx.rep && typeof global.changeRep === 'function') {
      Object.entries(fx.rep).forEach(([f, v]) => global.changeRep(f, v));
      if (typeof global.renderRep === 'function') global.renderRep();
    }
    if (fx.credits && PS) {
      PS.credits = Math.max(0, PS.credits + (fx.credits | 0));
    }
    if (fx.note && typeof global.notify === 'function') {
      global.notify(fx.note, 3200);
    }
    if (fx.mark) markSeen(fx.mark);
  }

  // ── UI state ──────────────────────────────────────
  let active = null; // { enc, nodeId, stId }

  function el(id) {
    return global.document && global.document.getElementById(id);
  }

  function drawPortraits(enc, speaker) {
    const zvanCv = el('root-zvan-cv');
    const npcCv = el('root-npc-cv');
    const zvanWrap = el('root-zvan-wrap');
    const npcWrap = el('root-npc-wrap');
    if (zvanCv && typeof global.PortraitRenderer !== 'undefined') {
      // Illustrazione dedicata di Zvan che parla (player bust)
      global.PortraitRenderer.drawPlayer(zvanCv);
    }
    if (zvanWrap) {
      zvanWrap.classList.toggle('speaking', speaker === 'zvan' || !!enc.playerOnly);
    }
    if (npcCv && typeof global.PortraitRenderer !== 'undefined') {
      if (enc.playerOnly) {
        global.PortraitRenderer.drawPlayer(npcCv);
      } else {
        global.PortraitRenderer.drawCanvas(npcCv, enc.npcSeed || 1, enc.faction || 'bazzano', {
          name: enc.npcName,
          kind: enc.gender === 'f' ? 'women' : undefined
        });
      }
    }
    if (npcWrap) {
      npcWrap.classList.toggle('speaking', speaker === 'npc' && !enc.playerOnly);
    }
  }

  function showNode(nodeId) {
    if (!active) return;
    const enc = active.enc;
    const node = enc.nodes[nodeId];
    if (!node) {
      closeRootDialogue();
      return;
    }
    active.nodeId = nodeId;
    const speaker = node.speaker || 'npc';
    drawPortraits(enc, speaker);

    const nameEl = el('root-speaker-name');
    const typeEl = el('root-speaker-type');
    const textEl = el('root-text');
    const choicesEl = el('root-choices');
    if (nameEl) {
      nameEl.textContent = speaker === 'zvan' ? 'ZVAN MARÌA' : (enc.playerOnly ? 'ZVAN MARÌA' : enc.npcName);
      nameEl.style.color = speaker === 'zvan' ? '#c8ddd8' : (global.FACTIONS && global.FACTIONS[enc.faction] ? global.FACTIONS[enc.faction].color : '#aaccee');
    }
    if (typeEl) {
      typeEl.textContent = speaker === 'zvan'
        ? 'FUNZIONARIO VII · DI RITORNO'
        : (enc.npcTitle || 'INCONTRO');
    }
    if (textEl) textEl.textContent = node.text || '';
    if (choicesEl) {
      choicesEl.innerHTML = '';
      (node.choices || []).forEach((ch) => {
        const b = global.document.createElement('button');
        b.className = 'choice-btn' + (speaker === 'zvan' && ch.label.indexOf('[ZVAN]') === 0 ? '' : '');
        b.textContent = ch.label;
        b.addEventListener('click', () => {
          if (ch.fx) applyFx(ch.fx);
          if (ch.next == null) {
            markSeen(enc.id);
            if (typeof global.playChime === 'function') global.playChime('notify');
            closeRootDialogue();
            if (typeof global.buildDock === 'function' && global.GAME && global.GAME.dockedSt) {
              global.buildDock(global.GAME.dockedSt);
            }
          } else {
            showNode(ch.next);
          }
        });
        choicesEl.appendChild(b);
      });
    }
    if (typeof global.playTone === 'function') {
      global.playTone(speaker === 'zvan' ? 280 : 340, 0.02, 0.02, 'sine');
    }
  }

  function openRootDialogue(enc, stId) {
    if (!enc) return;
    if (typeof global.closeOverlappingModals === 'function') {
      global.closeOverlappingModals('root');
    }
    active = { enc, nodeId: enc.start, stId: stId || null };
    const modal = el('rootdlg');
    if (!modal) return;
    const title = el('root-title');
    const sub = el('root-sub');
    if (title) title.textContent = enc.title || 'INCONTRO';
    if (sub) sub.textContent = enc.blurb || '';
    const npcLbl = el('root-npc-wrap') && el('root-npc-wrap').querySelector('.root-port-lbl');
    if (npcLbl) npcLbl.textContent = enc.playerOnly ? 'SPECCHIO' : (enc.npcName || 'INCONTRO').split(' ')[0].toUpperCase();
    modal.style.display = 'flex';
    if (typeof global.setPausedReason === 'function') {
      global.setPausedReason('dialogue', true);
    }
    // Keep dock underneath; dialogue overlays
    showNode(enc.start);
  }

  function closeRootDialogue() {
    const modal = el('rootdlg');
    if (modal) modal.style.display = 'none';
    active = null;
    if (typeof global.setPausedReason === 'function') {
      // Don't unpause docked pause — only dialogue layer
      if (global.GAME && global.GAME.state === 'docked') {
        /* stay paused via docked */
      } else {
        global.setPausedReason('dialogue', false);
      }
      // If flying hail used dialogue pause, clear it
      if (global.GAME && global.GAME.state === 'flying') {
        global.setPausedReason('dialogue', false);
      }
      if (global.GAME && global.GAME.state === 'docked') {
        global.setPausedReason('dialogue', false);
        global.setPausedReason('docked', true);
      }
    }
  }

  function offerOnDock(st) {
    if (!st || !st.sd) return;
    const avail = availableEncounters(st.sd.id);
    if (!avail.length) return;
    // Auto-offer the first available once per dock session if not yet prompted
    const key = 'prompted_' + avail[0].id;
    if (seenSet()[key]) return;
    seenSet()[key] = 1;
    setTimeout(() => {
      if (typeof global.notify === 'function') {
        global.notify('Qualcuno ti riconosce: tab «RADICI» — ' + avail[0].npcName, 3200);
      }
    }, 900);
  }

  function listPanelHtml(st) {
    const avail = availableEncounters(st.sd.id);
    const all = encountersForStation(st.sd.id);
    let html = '<div class="stt">RADICI · CHI TI RICORDA</div>';
    html += '<div style="font-size:10px;font-family:var(--FM);color:#6a9a90;margin:-4px 0 12px;line-height:1.45">Incontri con gente che ti conosceva <em>prima</em> di Imperium. Dialetto, silenzi, restituiti pezzi di te.</div>';
    if (!all.length) {
      html += '<div style="color:#446688;font-family:var(--FM);font-size:11px;padding:12px">Qui nessuno ti chiama ancora per nome. O forse non vuole.</div>';
      return html;
    }
    all.forEach((enc) => {
      const done = isSeen(enc.id);
      const locked = (enc.minChapter || 1) > ((global.STORY && global.STORY.chapter) || 0) && !(global.STORY && global.STORY.won);
      const can = !done && !locked;
      html += '<div class="ic" style="align-items:flex-start' + (done ? ';opacity:.7' : '') + '">';
      html += '<div class="in2"><div class="nm">' + enc.npcName + (done ? ' · vissuto' : '') + '</div>';
      html += '<div class="dc">' + enc.blurb + '</div>';
      html += '<div class="mr">' + enc.title + (locked ? ' · sblocca dal cap. ' + enc.minChapter : '') + '</div></div>';
      if (can) {
        html += '<button class="db hi2" onclick="openRootEncounter(\'' + enc.id + '\',\'' + st.sd.id + '\')">PARLA</button>';
      } else if (done) {
        html += '<div class="px" style="color:#66aa88">FATTO</div>';
      } else {
        html += '<div class="px" style="color:#668">…</div>';
      }
      html += '</div>';
    });
    if (avail.length) {
      html += '<div style="font-size:9px;color:#88b8a0;font-family:var(--FM);margin-top:8px">Disponibili ora: ' + avail.length + '</div>';
    }
    return html;
  }

  function findEncounter(encId, stId) {
    const list = encountersForStation(stId);
    return list.find((e) => e.id === encId) || null;
  }

  global.RootDialogues = {
    ROOT_ENCOUNTERS,
    availableEncounters,
    encountersForStation,
    openRootDialogue,
    closeRootDialogue,
    offerOnDock,
    listPanelHtml,
    findEncounter,
    isSeen,
    markSeen
  };

  global.openRootEncounter = function (encId, stId) {
    const enc = findEncounter(encId, stId);
    if (!enc) {
      if (typeof global.notify === 'function') global.notify('Incontro non trovato.', 1400);
      return;
    }
    if (isSeen(enc.id)) {
      if (typeof global.notify === 'function') global.notify('Quella conversazione è già successa. Resta nel petto.', 2000);
      return;
    }
    openRootDialogue(enc, stId);
  };

  global.closeRootDialogue = closeRootDialogue;
})(typeof window !== 'undefined' ? window : globalThis);
