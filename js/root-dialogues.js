'use strict';
/**
 * Dialoghi RADICI — incontri con chi conosceva Zvan Marìa prima di Imperium.
 * Italiano chiaro, dialetto bazzanese usato a spicchi. Lore Imperium/casate
 * e macguffinium emergono col procedere dei capitoli.
 */
(function (global) {
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
        blurb: 'Uno che ti chiamava Zvanino prima che partissi.',
        start: 'n1',
        nodes: {
          n1: {
            speaker: 'npc',
            text: 'Zvanino? Csa fet qui, tavò. Pensavo fossi rimasto a firmare bollettini fino alla pensione. Siediti: bsoa una bottiglia, e lascia l’uniforme sul gancio.',
            choices: [
              { label: '[PROVI] "Taproblem… sto bene."', next: 'n2a' },
              { label: '[UFFICIALE] "Funzionario Marìa. Missione di servizio."', next: 'n2b' },
              { label: '[SILENZIO] Gli stringi la mano.', next: 'n2c' }
            ]
          },
          n2a: {
            speaker: 'npc',
            text: 'Hai detto taproblem come chi legge il dizionario. Va bene lo stesso. Qui nichita ha dimenticato il tuo nome. Io no. Tu, a momenti, sì: ti guardi intorno come un ospite.',
            choices: [
              { label: '[ZVAN] "Ho paura di non capire più casa."', next: 'n3' },
              { label: '[ZVAN] "Ho avuto fretta di sembrare importante."', next: 'n3b' }
            ]
          },
          n2b: {
            speaker: 'npc',
            text: 'Com’è l’idea della pressa? «Funzionario Marìa». Una volta scendevi a priori dai compiti. Adesso parli da ufficio. Taebol, Zvanino.',
            choices: [
              { label: '[ZVAN] "Forse il titolo mi è restato addosso."', next: 'n3' },
              { label: '[ZVAN] "Sotto l’armatura ho ancora sete di vino."', next: 'n3' }
            ]
          },
          n2c: {
            speaker: 'npc',
            text: 'Tacivecìssent, eh? Come quando ti chiedevano della ragazza e restavi lì muto. Qui il silenzio è onesto. Laggiù, a Imperium, è un protocollo.',
            choices: [{ label: '[ZVAN] "Il protocollo mi ha tenuto in piedi. Qui mi fa male."', next: 'n3' }]
          },
          n3: {
            speaker: 'zvan',
            text: 'Mirco, a Imperium ogni corridoio aveva un numero. Qui ogni odore ha un nome. Ricordo meglio i numeri. Tornare significa scoprire di avere ancora la chiave di casa e non sapere più dove mettere i piedi.',
            choices: [{ label: '[ASCOLTA]', next: 'n4' }]
          },
          n3b: {
            speaker: 'zvan',
            text: 'Ho detto «fretta» e mi è venuto il senso di colpa. Casa non era un ritardo: ero io che volevo sembrare qualcuno nei corridoi di marmo.',
            choices: [{ label: '[ASCOLTA]', next: 'n4' }]
          },
          n4: {
            speaker: 'npc',
            text: 'Allora ascolta il tavò vero: non ti chiedo di tornare ragazzo. Ti chiedo di non fare il satellite dopo nove ore di burocrazia. Siediti. Bevi. Se tarenz’la psiche, pazienza. Bsoa tempo, non bollettini. E stai attento: da Imperium arrivano voci di casate che si azzannano. Qui siamo periferia. Per ora.',
            choices: [
              { label: '[RESTA] Bevi in silenzio. (+rep Bazzano)', next: null, fx: { rep: { bazzano: 4 }, note: 'Hai lasciato l’armatura sul bancone, per una sera.', lore: 'casate_rumore' } },
              { label: '[FUGGI] "Devo… coordinare."', next: null, fx: { note: 'Mirco scuote la testa: «Toronto. Sei ancora in orbita.»' } }
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
        blurb: 'Ti ha visto partire. Non ti ha mai scritto: «scendere a priori», diceva.',
        start: 'z1',
        nodes: {
          z1: {
            speaker: 'npc',
            text: 'Zvan. Non «funzionario». Zvan. Sei magro come un arimanni che cambia casa ogni anno — solo che tu hai cambiato pianeta. Ho paura di non riconoscerti, nient’altro.',
            choices: [
              { label: '[ZVAN] "Non so più come chiamarmi qui."', next: 'z2' },
              { label: '[ZVAN] "Mi hanno mandato. Non sono tornato: mi hanno rispedito."', next: 'z2b' }
            ]
          },
          z2: {
            speaker: 'zvan',
            text: 'A Imperium il mio nome era un livello. Settimo. Qui era un diminutivo. In mezzo c’è un vuoto: al posto dei parenti ho messo i rapporti.',
            choices: [{ label: '[ASCOLTA]', next: 'z3' }]
          },
          z2b: {
            speaker: 'npc',
            text: 'Rispedito. Come un pacco. Hai mai pianto senza verbale? Perché se no, Zvan, sei rovinato tost al prosciutto.',
            choices: [{ label: '[ZVAN] "Ho pianto. In un bagno di pietra. Nessuno ha firmato."', next: 'z3' }]
          },
          z3: {
            speaker: 'npc',
            text: 'Allora resta. Non per il Patto. Per il cortile. Se tabrein in cupola, sediamoci finché capisci. Io non ti chiedo Imperium. Ti chiedo se zantic lo spazio ti ha congelato la lingua o solo la voglia. E se ti mandano qui per le casate che litigano lassù, ricorda: noi siamo il patio di servizio dell’Impero.',
            choices: [
              { label: '[RESTA] "Insegno a dire di nuovo Zvanino." (+rep)', next: null, fx: { rep: { bazzano: 6 }, note: 'Zia Ornella ti lascia un fazzoletto. Puzza di sapone locale.', lore: 'periferia' } },
              { label: '[PARTE] "Il Patto non aspetta."', next: null, fx: { note: 'Lei non ti ferma. Le zie sanno quando un figlio è già partito.' } }
            ]
          }
        }
      },
      {
        id: 'root_bazz_specchio',
        minChapter: 6,
        title: 'Bagno dell’osteria — dopo l’ispettore',
        npcName: 'Specchio appannato',
        npcTitle: 'TU · BAZZANO',
        npcSeed: 1,
        faction: 'bazzano',
        blurb: 'Nessuno di fronte: solo il tuo riflesso.',
        start: 's1',
        playerOnly: true,
        nodes: {
          s1: {
            speaker: 'zvan',
            text: 'Mi guardo e vedo l’uniforme. Il distintivo del pianeta con l’anello. A Imperium mi sembrava un’identità. Qui sembra un vestito prestato.',
            choices: [
              { label: '[AMMETTI] "Sono estraneo al mio posto."', next: 's2' },
              { label: '[NEGHI] "Sono ancora di qui. Toront— …no."', next: 's2b' }
            ]
          },
          s2: {
            speaker: 'zvan',
            text: 'Estraneo. Non perché mi caccino: perché misuro tutto in procedure. Il vino ha bisogno di un verbale? Il Mulino di un allegato? Sto redigendo il ritorno.',
            choices: [{ label: '[CONTINUA]', next: 's3' }]
          },
          s2b: {
            speaker: 'zvan',
            text: 'Non riesco nemmeno a finire «Toronto». La negazione mi esce a metà, come uno che ha dimenticato come si dice no in casa propria.',
            choices: [{ label: '[CONTINUA]', next: 's3' }]
          },
          s3: {
            speaker: 'zvan',
            text: 'Ora ho capito perché Imperium tiene il Patto dritto: se Valsamoggio si spezza, le anomalie diventano campo di battaglia. E se lì c’è davvero macguffinium — materia a nove dimensioni — le grandi casate scenderanno qui a mordersi. L’Impero potrebbe non reggere quella guerra. Il mio lavoro da cortile è tenere il Mulino in piedi.',
            choices: [
              { label: '[CHIUDI GLI OCCHI]', next: null, fx: { note: 'Hai scritto qualcosa di vero senza timbro.', mark: 'root_mirror', lore: 'macguffinium_capito' } }
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
            text: 'Zvan. Il semaforo aspetta dal 2003 e tu torni con una busta nera. Nichita qui ha ricevuto una busta nera. Solo modulistica. Sei venuto per il Patto o perché Imperium ti ha messo in mano un corriere di nostalgia?',
            choices: [
              { label: '[ZVAN] "Per entrambi. E non so quale dei due mi pesi di più."', next: 'c2' },
              { label: '[DIALETTO] "Taproblem… no. Non è taproblem."', next: 'c2b' }
            ]
          },
          c2: {
            speaker: 'zvan',
            text: 'A Imperium dicevano che Crespellano produce «niente». Ridevo. Poi ho capito: il niente era l’unica cosa che non potevano comprare. Io invece mi sono venduto a pezzi di grado.',
            choices: [{ label: '[ASCOLTA]', next: 'c3' }]
          },
          c2b: {
            speaker: 'npc',
            text: 'Hai ragione a correggerti. «Taproblem» detto da te suona tradotto. Come i turisti che dicono tavò e si credono simpatici. Tu non sei turista. Sei un reduce del marmo.',
            choices: [{ label: '[ZVAN] "Insegnami di nuovo a sbagliare in dialetto."', next: 'c3' }]
          },
          c3: {
            speaker: 'npc',
            text: 'Le radici non tornano con un capitolo: tornano restando in fila. Se tebatene di Imperium, bene. Altrimenti torna a firmare. Io aspetto il verde. E se ti interessano le voci: lassù le casate maggiori si fanno la guerra nei corridoi. Qui leggono i nostri fascicoli come se fossimo un magazzino di periferia.',
            choices: [
              { label: '[RESTA IN FILA] (+rep Crespellano)', next: null, fx: { rep: { crespellano: 5 }, note: 'Lia ti lascia una chiave dell’archivio «classificato male».', lore: 'casate_rumore' } },
              { label: '[VAI]', next: null, fx: { note: 'Lei non ti saluta in ufficiale. Solo: «Zvan.»' } }
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
            text: 'Marìa. Settimo livello. Hai portato il pezzo e vuoi il timbro. Una volta i timbri ti sembravano pananai. Adesso sei pananai con lo stipendio.',
            choices: [
              { label: '[ZVAN] "So di essere diventato ciò che odiavo."', next: 'k2' },
              { label: '[DIFESA] "Senza Imperium questo anello collassa."', next: 'k2b' }
            ]
          },
          k2: {
            speaker: 'zvan',
            text: 'A Imperium mi hanno insegnato che l’ufficialità tiene insieme le cose. Qui vedo che l’ordine si vende a pezzi. Porto il distintivo di chi firma. Mi tiene in piedi e mi fa male allo stesso tempo.',
            choices: [{ label: '[ASCOLTA]', next: 'k3' }]
          },
          k2b: {
            speaker: 'npc',
            text: 'Collassa, dici. Prova a dire «tavalvol apr» senza sembrare un manuale. Non ci riesci. La macchina che non funziona, adesso, sei tu.',
            choices: [{ label: '[ZVAN] "Allora aiutami a ripararla — senza fattura."', next: 'k3' }]
          },
          k3: {
            speaker: 'npc',
            text: 'Senza fattura non esisto. Ti do un consiglio non timbrato: non firmare ciò che non puoi difendere a Bazzano, a voce alta, da ubriaco. E occhio alle casate: a Calcara arrivano già intermediari che cercano «anomalie». Parlano di materia strana, nove dimensioni, macguffinium. Se è vero, questo sistema smette di essere patio di servizio.',
            choices: [
              { label: '[ACCETTA IL COLPO] (+rep Calcara piccola)', next: null, fx: { rep: { calcara: 3 }, note: 'Dario ti offre un silenzio onesto. È raro qui.', lore: 'macguffinium_voce' } },
              { label: '[VAI VIA UFFICIALE]', next: null, fx: { rep: { calcara: -2 }, note: 'Hai chiuso come un verbale. Lui ti ha segnato: estraneo.' } }
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
        npcTitle: 'PALADINA · AMICA D’INFANZIA',
        npcSeed: 7704,
        faction: 'monteveglio',
        gender: 'f',
        blurb: 'Insieme giocavate a essere cavalieri. Lei ha continuato. Tu sei andato al marmo.',
        start: 'm1',
        nodes: {
          m1: {
            speaker: 'npc',
            text: 'Zvan. Le frecce di luce sono laser — lo sapevamo anche da bambini. Tu sei partito per chiamarle «sistemi d’arma». Io sono rimasta a chiamarle promesse. Chi di noi ha lasciato il gioco?',
            choices: [
              { label: '[ZVAN] "Io. Ho scambiato il gioco con il grado."', next: 'm2' },
              { label: '[ZVAN] "Siamo cresciuti in direzioni diverse."', next: 'm2b' }
            ]
          },
          m2: {
            speaker: 'zvan',
            text: 'A Imperium il gioco si chiama inefficienza. Qui il gioco è governo. Io sto in mezzo: niente armatura vera, niente divertimento. Solo missione.',
            choices: [{ label: '[ASCOLTA]', next: 'm3' }]
          },
          m2b: {
            speaker: 'npc',
            text: '«Direzioni diverse» suona da rapporto. Da noi si diceva: hai asportato il parrucchino — hai detto una stronzata elegante. Torna a sporcarti. Torna a ridere senza verbale.',
            choices: [{ label: '[ZVAN] "Insegnami una risata senza protocollo."', next: 'm3' }]
          },
          m3: {
            speaker: 'npc',
            text: 'Resta stanotte alla Rocca. Non come funzionario: come quello che perdeva al LARP e mentiva sul punteggio. Prima dimmi il tuo nome senza livello. E se vedi arrivare una nave enorme, più grossa di uno hulk: è il Palazzo Beghelli. Dominavano Valsamoggio quando eravamo bambini. Ora sono una casata minore. Possono aiutarti, se hai le connessioni giuste. Di solito finisce in cortesia e poco altro.',
            choices: [
              { label: '[DICI] "Zvan. Solo Zvan." (+rep Monteveglio)', next: null, fx: { rep: { monteveglio: 6 }, note: 'Serafina ti passa un elmo troppo stretto. Ti sta ridicolo.', lore: 'beghelli_voce' } },
              { label: '[DICI] "Funzionario Marìa."', next: null, fx: { note: 'Lei inchina la testa come a un ospite.' } }
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
        blurb: 'Parla poco. Giudica dall’aroma.',
        start: 'v1',
        nodes: {
          v1: {
            speaker: 'npc',
            text: 'Zantic lo spazio, eh? Tu puzzi di sterilizzazione. Non di tartufo. Il sapore di casa lo ricordi, o l’hai archiviato sotto «tradizione locale»?',
            choices: [
              { label: '[ZVAN] "Lo ricordo. Mi fa paura assaggiarlo."', next: 'v2' },
              { label: '[ZVAN] "Porto tre chili. È il prezzo del sigillo."', next: 'v2b' }
            ]
          },
          v2: {
            speaker: 'zvan',
            text: 'A Imperium il cibo non aveva parenti. Qui ogni piatto ha un morto e un vivo. Ho mangiato vent’anni senza genealogia. Ora tremo davanti a tre chili di verità.',
            choices: [{ label: '[ASCOLTA]', next: 'v3' }]
          },
          v2b: {
            speaker: 'npc',
            text: 'Il prezzo. Parli da compratore. Va bene: compra. Ma se non senti l’aroma, stai solo firmando.',
            choices: [{ label: '[ZVAN] "Allora fammi sentire."', next: 'v3' }]
          },
          v3: {
            speaker: 'npc',
            text: 'Assaggia. Se ti viene l’acqua agli occhi, sei ancora di qui. Se no, torna a Imperium e lascia il Mulino a chi puzza di terra. E ascolta: nelle anomalie del sistema qualcosa non torna. Odore metallico, luce sbagliata. Dicono macguffinium. Se le casate maggiori lo fiutano, qui arriva la guerra. Per questo il Patto deve reggere.',
            choices: [
              { label: '[ASSAGGI] (+rep Savigno)', next: null, fx: { rep: { savigno: 5 }, note: 'L’aroma ti apre un cassetto che credevi vuoto.', lore: 'macguffinium_voce' } },
              { label: '[RIFIUTI]', next: null, fx: { note: 'Remo non insiste. Chiude il barattolo.' } }
            ]
          }
        }
      }
    ],

    castelletto: [
      {
        id: 'root_cast_esule',
        minChapter: 5,
        title: 'Bar della fascia — caffè metallico',
        npcName: 'Vera dell’Anello',
        npcTitle: 'ESULE · CASTELLETTO',
        npcSeed: 9906,
        faction: 'castelletto',
        gender: 'f',
        blurb: 'Anche lei è partita — ma non per Imperium. Per non scegliere fazione.',
        start: 'e1',
        nodes: {
          e1: {
            speaker: 'npc',
            text: 'Zvan Marìa. Ti riconosco dal modo in cui ordini il caffè: come una richiesta di autorizzazione. Io sono scappata dalle fazioni. Tu sei scappato dentro Imperium. Due fughe. Stessa nostalgia.',
            choices: [
              { label: '[ZVAN] "Almeno tu hai scelto. Io sono stato assegnato."', next: 'e2' },
              { label: '[ZVAN] "Nostalgia. Parola che nei rapporti non esiste."', next: 'e2b' }
            ]
          },
          e2: {
            speaker: 'zvan',
            text: 'Assegnato, sì. Come un modulo. Ora mi chiedono di tenere insieme un sistema che conosco a memoria e che non riconosco più.',
            choices: [{ label: '[ASCOLTA]', next: 'e3' }]
          },
          e2b: {
            speaker: 'npc',
            text: 'Nei rapporti non esiste. Sulle navi sì. Bevi. Il caffè qui sa di metallo: ti ricorda Imperium senza farti mentire.',
            choices: [{ label: '[ZVAN] "Bevo. E ascolto."', next: 'e3' }]
          },
          e3: {
            speaker: 'npc',
            text: 'Se vuoi un favore dai Beghelli, passa dal Palazzo quando entra in sistema: una nave da casata, più grande di uno space hulk. Una volta comandavano qui. Ora sono secondari. Possono spingere una pratica, spostare una scorta, farti un’introduzione. Poi ti lasciano da solo. Con le giuste connessioni ottieni poco. Senza, niente. E ricorda: Imperium vuole il Patto perché sa che sotto le anomalie potrebbe esserci macguffinium. Se Valsamoggio si spacca, la guerra galattica parte da qui.',
            choices: [
              { label: '[PAGHI E RESTI] (+rep)', next: null, fx: { credits: -20, rep: { bazzano: 2 }, note: 'Il caffè sa di metallo. Lo noti senza fingere.', lore: 'beghelli_voce' } },
              { label: '[PAGHI E VAI]', next: null, fx: { credits: -20, note: 'Il caffè sa di metallo. Come Imperium. Lo noti solo ora.' } }
            ]
          }
        }
      }
    ]
  };

  function encountersForStation(stId) {
    const key = stId === 'sirena' || stId === 'lavino' ? 'bazzano'
      : stId === 'pragatto' ? 'crespellano'
      : stId === 'oliveto' ? 'monteveglio'
      : stId === 'zappolino' ? 'savigno'
      : (ROOT_ENCOUNTERS[stId] ? stId : null);
    if (!key) return [];
    return ROOT_ENCOUNTERS[key] || [];
  }

  function seenSet() {
    const PS = global.PS;
    if (!PS) return {};
    if (!PS.rootSeen) PS.rootSeen = {};
    return PS.rootSeen;
  }

  function loreSet() {
    const PS = global.PS;
    if (!PS) return {};
    if (!PS.loreFlags) PS.loreFlags = {};
    return PS.loreFlags;
  }

  function isSeen(id) {
    return !!seenSet()[id];
  }

  function markSeen(id) {
    seenSet()[id] = 1;
  }

  function markLore(flag) {
    if (!flag) return;
    loreSet()[flag] = 1;
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
    if (fx.lore) markLore(fx.lore);
  }

  let active = null;

  function el(id) {
    return global.document && global.document.getElementById(id);
  }

  function drawPortraits(enc, speaker) {
    const zvanCv = el('root-zvan-cv');
    const npcCv = el('root-npc-cv');
    const zvanWrap = el('root-zvan-wrap');
    const npcWrap = el('root-npc-wrap');
    if (zvanCv && typeof global.PortraitRenderer !== 'undefined') {
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
    if (textEl) {
      textEl.textContent = node.text || '';
      textEl.scrollTop = 0;
    }
    if (choicesEl) {
      choicesEl.innerHTML = '';
      (node.choices || []).forEach((ch) => {
        const b = global.document.createElement('button');
        b.className = 'choice-btn';
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
    showNode(enc.start);
  }

  function closeRootDialogue() {
    const modal = el('rootdlg');
    if (modal) modal.style.display = 'none';
    active = null;
    if (typeof global.setPausedReason === 'function') {
      if (global.GAME && global.GAME.state === 'flying') {
        global.setPausedReason('dialogue', false);
      }
      if (global.GAME && global.GAME.state === 'docked') {
        global.setPausedReason('dialogue', false);
        global.setPausedReason('docked', true);
      }
    }
    // Persiste rootSeen / loreFlags dopo ogni dialogo Radici.
    if (typeof global.saveGame === 'function') global.saveGame(true);
  }

  function offerOnDock(st) {
    if (!st || !st.sd) return;
    const avail = availableEncounters(st.sd.id);
    if (!avail.length) return;
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
    html += '<div style="font-size:10px;font-family:var(--FM);color:#6a9a90;margin:-4px 0 12px;line-height:1.45">Incontri con gente che ti conosceva <em>prima</em> di Imperium. Dialetto, silenzi, pezzi di te restituiti.</div>';
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
    markSeen,
    markLore,
    loreSet
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
