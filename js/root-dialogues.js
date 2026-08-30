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
        npcName: 'Palmira',
        npcTitle: 'ASILO · SUORE · BAZZANO',
        npcSeed: 4417,
        faction: 'bazzano',
        gender: 'f',
        portrait: 'sprites/faces/roots/palmira.png',
        blurb: 'Palmira dell\'asilo. Ti chiama Zvanino da quarant\'anni e non ha intenzione di smettere adesso.',
        start: 'n1',
        nodes: {
          n1: {
            speaker: 'npc',
            text: 'Zvanino. Vieni qua e fatti vedere. Spegni quel distintivo, però: mi lampeggia nel bicchiere. Hai mangiato? No, non rispondere da funzionario. Intendo oggi.',
            choices: [
              { label: '[DIALETTO] "Taproblem, Palmira. Sto bene."', next: 'n2a' },
              { label: '[UFFICIALE] "Sto bene. Sono qui per il Patto."', next: 'n2b' },
              { label: '[SILENZIO] Ti siedi e basta.', next: 'n2c' }
            ]
          },
          n2a: {
            speaker: 'npc',
            text: 'Taproblem un corno. Hai le guance di uno che mangia in piedi da vent\'anni. Ti preparo qualcosa. Se proprio vuoi aiutare, versa il vino e non chiamarlo “supporto logistico”.',
            choices: [
              { label: '[ZVAN] "Non ricordo più dove tenevate i bicchieri."', next: 'n3' },
              { label: '[ZVAN] "Avevo fretta di diventare qualcuno."', next: 'n3b' }
            ]
          },
          n2b: {
            speaker: 'npc',
            text: 'Il Patto aspetta il tempo di un piatto caldo. Anche Imperium, se protesta. Una volta hai fatto aspettare suor Geltrude chiuso nel gabinetto dell\'asilo; puoi far aspettare loro dieci minuti.',
            choices: [
              { label: '[ZVAN] "Quella volta avevo paura."', next: 'n3' },
              { label: '[ZVAN] "Dieci minuti posso concederli."', next: 'n3' }
            ]
          },
          n2c: {
            speaker: 'npc',
            text: 'Va bene anche stare zitti. Basta che mastichi. Da piccolo lo facevi quando avevi rubato la marmellata; adesso non so che cosa hai rubato, ma la faccia è quella.',
            choices: [{ label: '[ZVAN] "Tempo, credo. Soprattutto a me."', next: 'n3' }]
          },
          n3: {
            speaker: 'zvan',
            text: 'Stamattina ho cercato la strada dell\'asilo sulla mappa di bordo. La sapevo a piedi, al buio. Sullo schermo non la riconoscevo. È una sensazione ridicola.',
            choices: [{ label: '[ASCOLTA]', next: 'n4' }]
          },
          n3b: {
            speaker: 'zvan',
            text: 'A Imperium sono diventato quello che volevo: uno che entra e viene ascoltato. Qui sono entrato e tu mi hai chiesto se ho mangiato. Non so quale delle due cose mi faccia più paura.',
            choices: [{ label: '[ASCOLTA]', next: 'n4' }]
          },
          n4: {
            speaker: 'npc',
            text: 'Non devi tornare quello di prima. Quello di prima aveva dodici anni e mentiva male. Comincia da una cosa più semplice: resta finché finisci il piatto. Poi vai a salvare il sistema. E tieni gli occhi aperti: da Imperium arrivano brutte voci sulle casate. Quando i grandi litigano, i cocci li mandano sempre quaggiù.',
            choices: [
              { label: '[RESTA] Finisci il piatto. (+rep Bazzano)', next: null, fx: { rep: { bazzano: 4 }, note: 'Palmira ti serve il bis. Non chiede se lo vuoi: certe istituzioni funzionano ancora.', lore: 'casate_rumore' } },
              { label: '[FUGGI] "Devo coordinare la missione."', next: null, fx: { note: '«Va mo là.» Palmira prende il tuo piatto e lo copre. «Quando hai finito di coordinare, mangi.»' } }
            ]
          }
        }
      },
      {
        id: 'root_bazz_padre',
        minChapter: 2,
        title: 'Circolo parrocchiale — tavolo in fondo',
        npcName: 'Arturo Marìa',
        npcTitle: 'PADRE · BAZZANO',
        npcSeed: 4426,
        faction: 'bazzano',
        gender: 'm',
        portrait: 'sprites/faces/roots/arturo.png',
        blurb: 'Tuo padre non ti ha ancora abbracciato. In compenso ha già preparato tre battute sulla divisa.',
        start: 'p1',
        nodes: {
          p1: {
            speaker: 'npc',
            text: 'Oh, è arrivato il ministero. Gigi, tira dentro la pancia: magari il signor funzionario la mette a verbale. Ciao, Zvan. Ti avrei chiamato, ma immagino che a Imperium i padri debbano prendere appuntamento.',
            choices: [
              { label: '[ZVAN] "Ciao, papà. Potevi chiamarmi e basta."', next: 'p2' },
              { label: '[ZVAN] "Sono venuto per vederti, non per ispezionarti."', next: 'p2' }
            ]
          },
          p2: {
            speaker: 'npc',
            speakerName: 'Gigi Malaguti',
            npcTitle: 'CANDIDATO PERMANENTE · AMICO DI ARTURO',
            npcSeed: 4438,
            gender: 'm',
            portrait: 'sprites/faces/roots/gigi.png',
            text: 'Zvanino, bella giacca. L\'Impero veste bene chi gli tiene il secchio. Io invece torno a candidarmi sindaco: l\'ultima volta ho preso il nove virgola otto. Meno del dieci, sì, ma tutto voto vero. E quest\'anno ho già trovato chi stampa i manifesti senza fattura.',
            choices: [
              { label: '[ZVAN] "Coerenza e contabilità, vedo."', next: 'p3' },
              { label: '[ZVAN] "Papà, lo lasci parlare così di me?"', next: 'p3b' }
            ]
          },
          p3: {
            speaker: 'npc',
            speakerName: 'Arturo Marìa',
            npcTitle: 'PADRE · BAZZANO',
            npcSeed: 4426,
            gender: 'm',
            portrait: 'sprites/faces/roots/arturo.png',
            text: 'Gigi scherza. Lui almeno dice le cose in faccia. Non ha bisogno di venti piani di marmo e un timbro per sentirsi importante. Poi il nove virgola otto, con quello che spendono gli altri, vale come una vittoria morale.',
            choices: [{ label: '[ZVAN] "Una vittoria morale non apre il municipio."', next: 'p4' }]
          },
          p3b: {
            speaker: 'npc',
            speakerName: 'Arturo Marìa',
            npcTitle: 'PADRE · BAZZANO',
            npcSeed: 4426,
            gender: 'm',
            portrait: 'sprites/faces/roots/arturo.png',
            text: 'Adesso non si può più scherzare? Gigi ti conosce da quando eri un cinno. Se una battuta ti fa male, figurati quando scopri cosa pensano davvero di voi funzionari.',
            choices: [{ label: '[ZVAN] "Allora dimmelo tu, cosa pensi."', next: 'p4' }]
          },
          p4: {
            speaker: 'npc',
            speakerName: 'Arturo Marìa',
            npcTitle: 'PADRE · BAZZANO',
            npcSeed: 4426,
            gender: 'm',
            portrait: 'sprites/faces/roots/arturo.png',
            text: 'Penso quello che don Ermes ci mostra ogni giovedì. L\'Imperatore non è più un uomo: è un resto attaccato alle macchine del Trono d\'Oro. Ha abusato del macguffinium per vivere più a lungo e spingere il potere psionico fin dove non doveva. Adesso tiene insieme l\'Impero perché nessuno ha il coraggio di staccare la spina. E voi, sotto, firmate che va tutto bene.',
            choices: [
              { label: '[AMMETTI] "Su questo, in gran parte, hai ragione."', next: 'p5' },
              { label: '[ATTACCA] "E don Ermes come lo saprebbe?"', next: 'p5e' }
            ]
          },
          p5: {
            speaker: 'zvan',
            text: 'L\'Imperatore è un resto umano ipermutato. Le macchine lo tengono vivo e il macguffinium ha aumentato la sua forza psionica mentre gli portava via quasi tutto il resto. Nei testi ufficiali lo chiamano sacrificio. Cambiare il nome non cambia il corpo. Ma don Ermes prende quella verità e ci attacca qualunque paura; Gigi ci attacca una candidatura.',
            choices: [{ label: '[GUARDA TUO PADRE] "Questo lo pensi tu, o lo pensi perché lui ti ascolta?"', next: 'p6' }]
          },
          p5e: {
            speaker: 'npc',
            speakerName: 'Don Ermes',
            npcTitle: 'PARROCCHIA · PROPAGANDA DEL GIOVEDÌ',
            npcSeed: 4449,
            gender: 'm',
            portrait: 'sprites/faces/roots/don_ermes.png',
            text: 'Lo so perché basta guardare. Il Trono d\'Oro non tiene un santo: tiene un resto. Macguffinium, macchine, potere senza carne. E vostro figlio firma i rapporti che lo chiamano sacrificio. Arturo, vedi? Anche a tavola ti correggono.',
            choices: [
              { label: '[ZVAN] "Una verità non basta a giustificare tutto il resto."', next: 'p5b' },
              { label: '[ZVAN] "Papà, senti chi ti sta dando lezione."', next: 'p6' }
            ]
          },
          p5b: {
            speaker: 'npc',
            speakerName: 'Gigi Malaguti',
            npcTitle: 'CANDIDATO PERMANENTE · AMICO DI ARTURO',
            npcSeed: 4438,
            gender: 'm',
            portrait: 'sprites/faces/roots/gigi.png',
            text: 'Eccolo, il metodo imperiale: se non puoi smentire una cosa, chiedi il protocollo. Don Ermes ha fonti. Io ho contatti. Quando sarò sindaco renderemo tutto pubblico, tranne le donazioni: quelle sono riservate per sicurezza.',
            choices: [{ label: '[ZVAN] "Papà, senti la frase che ha appena detto?"', next: 'p6' }]
          },
          p6: {
            speaker: 'npc',
            speakerName: 'Arturo Marìa',
            npcTitle: 'PADRE · BAZZANO',
            npcSeed: 4426,
            gender: 'm',
            portrait: 'sprites/faces/roots/arturo.png',
            text: 'Sento che sei tornato da mezz\'ora e già fai l\'interrogatorio. Però va bene, hai vinto tu: io sono il vecchio ignorante e tu quello che sa come funziona il mostro. Dev\'essere una bella soddisfazione tenergli aperta la bocca.',
            choices: [
              { label: '[FERMO] "Non ho vinto. Volevo parlare con mio padre."', next: null, fx: { rep: { bazzano: 2 }, note: 'Arturo guarda Gigi prima di rispondere. Gigi ha già ripreso a parlare della campagna elettorale.', lore: 'imperatore_trono_oro' } },
              { label: '[VAI] "Quando vorrai parlare senza pubblico, chiamami."', next: null, fx: { note: 'Tuo padre alza le spalle. La battuta successiva gli muore in bocca, ma troppo tardi.', lore: 'imperatore_trono_oro' } }
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
        gender: 'f',
        portrait: 'sprites/faces/roots/ornella.png',
        blurb: 'Ti ha visto partire e non ti ha mai scritto. «Prima scendi a terra», diceva. Sono vent\'anni che aspetta il pianerottolo.',
        start: 'z1',
        nodes: {
          z1: {
            speaker: 'npc',
            text: 'Zvan. Fermo lì un momento. Hai ancora il neo vicino all\'orecchio; tutto il resto si è messo in divisa. La tua roba è in cantina, due scatole. Credevo fossero una sola, poi ho visto che su una c\'era scritto “da buttare” con la tua calligrafia e non mi sono fidata.',
            choices: [
              { label: '[ZVAN] "Non so più con che nome presentarmi, qui."', next: 'z2' },
              { label: '[ZVAN] "Non sono tornato. Mi hanno rispedito."', next: 'z2b' }
            ]
          },
          z2: {
            speaker: 'zvan',
            text: 'Lassù mi chiamano Marìa o Settimo. Qui Zvanino. Quando hai detto Zvan mi sono voltato in ritardo. È questo che mi vergogno a spiegare.',
            choices: [{ label: '[ASCOLTA]', next: 'z3' }]
          },
          z2b: {
            speaker: 'npc',
            text: 'Rispedito non vuol dire tornato, hai ragione. Però sei qui. Adesso dimmi: sei contento almeno un poco, o devo lasciarti ancora cinque minuti sul pianerottolo?',
            choices: [{ label: '[ZVAN] "Sono contento. È la parte che non so gestire."', next: 'z3' }]
          },
          z3: {
            speaker: 'npc',
            text: 'Allora basta gestire. Vieni in cantina. La scatola è tua e la apri tu. Io non l\'ho fatto perché avevo paura di trovare soltanto quaderni e nessuno a cui restituirli. Quanto a Imperium e alle sue casate: qui arrivano quando serve qualcosa, mai quando piove dal soffitto. Questa te la ricordi, spero.',
            choices: [
              { label: '[RESTA] "Apriamola insieme." (+rep)', next: null, fx: { rep: { bazzano: 6 }, note: 'Dentro ci sono un quaderno, due biglie e una foto storta. Ornella aveva tenuto anche la scatola «da buttare». Naturalmente.', lore: 'periferia' } },
              { label: '[PARTE] "Il Patto non aspetta."', next: null, fx: { note: 'Non ti trattiene. Le zie capiscono subito quando uno è già partito da un pezzo. La scatola resta in cantina.' } }
            ]
          }
        }
      },
      {
        id: 'root_bazz_hulk_odore',
        minChapter: 5,
        requireHulkBoarded: true,
        title: 'Odore di relitto',
        npcName: 'Palmira',
        npcTitle: 'ASILO · SUORE · BAZZANO',
        npcSeed: 4419,
        faction: 'bazzano',
        gender: 'f',
        portrait: 'sprites/faces/roots/palmira.png',
        blurb: 'Ti annusa come faceva al cortile. Dice che hai portato l\'odore di uno hulk dentro l\'osteria.',
        start: 'h1',
        nodes: {
          h1: {
            speaker: 'npc',
            text: 'Fermo sulla porta. Quella tuta sa di ferro bruciato. Sei entrato in uno hulk? Siediti fuori, allora. Ti porto da bere, ma il cappotto resta lì: ho appena lavato.',
            choices: [
              { label: '[ZVAN] "Erano persone. Prima."', next: 'h2' },
              { label: '[ZVAN] "Ho preso pezzi. Fine."', next: 'h2b' }
            ]
          },
          h2: {
            speaker: 'zvan',
            text: 'Dentro ho trovato i documenti. Ho trovato anche le targhette dei turni, ancora attaccate alle porte. Quelli che ci hanno sparato addosso avevano dei nomi. Continuo a pensare a questo.',
            choices: [{ label: '[ASCOLTA]', next: 'h3' }]
          },
          h2b: {
            speaker: 'npc',
            text: 'Fine mica tanto. Hai la mano che trema e stai stringendo il bicchiere vuoto. I pezzi li hai presi; il resto te lo sei portato dietro gratis.',
            choices: [{ label: '[ZVAN] "Li ho visti. Non se ne vanno."', next: 'h3' }]
          },
          h3: {
            speaker: 'npc',
            text: 'Una nave morta la smonti. Uno hulk, se non stai attento, smonta te. Il nome della roba che c\'è dentro non mi interessa. Tu lavati, dormi e non fare quello che sta bene per educazione. Taproblem lo dici domani.',
            choices: [
              { label: '[RESTA] Resti a bere in silenzio. (+rep)', next: null, fx: { rep: { bazzano: 5 }, note: 'Palmira ti lascia uno straccio e smette di fare domande. Il sapone copre quasi l\'odore.', lore: 'hulk_visited' } },
              { label: '[PARTE] "Devo tornare al relitto."', next: null, fx: { note: '«Allora porta armi. E un po\' di pietà, che pesa meno.»', lore: 'hulk_mutazioni' } }
            ]
          }
        }
      },
      {
        id: 'root_bazz_padre_ritorno',
        minChapter: 6,
        requireSeen: 'root_bazz_padre',
        requireHulkBoarded: true,
        title: 'Garage di casa — senza pubblico',
        npcName: 'Arturo Marìa',
        npcTitle: 'PADRE · BAZZANO',
        npcSeed: 4426,
        faction: 'bazzano',
        gender: 'm',
        portrait: 'sprites/faces/roots/arturo.png',
        blurb: 'Gigi non c\'è. Tuo padre, senza qualcuno da impressionare, sembra più vecchio e meno sicuro.',
        start: 'r1',
        nodes: {
          r1: {
            speaker: 'npc',
            text: 'Gigi è alla riunione della lista. Sono in sette, ma quattro sono candidati sindaco, quindi finiranno tardi. Ho saputo dello hulk. Bravo. L\'Impero manda mio figlio dentro una bara mutata e poi magari gli dà anche una medaglia di latta.',
            choices: [
              { label: '[ZVAN] "Sono venuto perché avevi ragione sull\'Imperatore."', next: 'r2' },
              { label: '[ZVAN] "Anche senza Gigi devi prendermi in giro?"', next: 'r2b' }
            ]
          },
          r2: {
            speaker: 'zvan',
            text: 'I documenti dello hulk confermano l\'abuso di macguffinium. L\'Imperatore ha allungato la vita e il potere psionico finché del suo corpo è rimasto qualcosa che le macchine del Trono d\'Oro possono ancora usare. Non è propaganda. È il fondamento dell\'Impero, ed è marcio.',
            choices: [{ label: '[CONTINUA]', next: 'r3' }]
          },
          r2b: {
            speaker: 'npc',
            text: 'Se non faccio una battuta poi bisogna dire le cose vere. Non sono mai stato bravo. Tua madre parlava; io aspettavo che passasse. Con Gigi è più facile: lui ride, io gli do ragione e per cinque minuti mi sento uno con delle idee.',
            choices: [{ label: '[ZVAN] "Allora proviamo senza battute."', next: 'r3' }]
          },
          r3: {
            speaker: 'npc',
            text: 'E tu porti ancora quella divisa. Questo non lo capisco. Se sai che è marcio, perché lo tieni in piedi? Ogni volta che ti guardo vedo uno bravo che ha scelto di diventare l\'ingranaggio giusto nella macchina sbagliata.',
            choices: [{ label: '[ZVAN] "È proprio questo che non riesco a riconciliare."', next: 'r4' }]
          },
          r4: {
            speaker: 'zvan',
            text: 'L\'Impero sta in piedi grazie a gente come me. È un\'accusa ed è anche un fatto: qualcuno tiene aperte le rotte, distribuisce ossigeno, impedisce a una casata di comprarsi un pianeta. Facendolo, però, teniamo in piedi anche il Trono e tutto ciò che divora. Mi dico che, se me ne vado, firmerà qualcuno peggiore. Forse è responsabilità. Forse è la mia versione elegante della paura.',
            choices: [{ label: '[GUARDALO] "Ma tu non odi soltanto l\'Impero. Odi me."', next: 'r5' }]
          },
          r5: {
            speaker: 'npc',
            text: 'Ti ho odiato perché sei partito e hai fatto una scelta. Io sono rimasto qui a lamentarmi con don Ermes e ad applaudire Gigi, che perde ogni elezione e ogni volta riesce a farmi sentire dalla parte dei furbi. Quando ti prendeva in giro gli davo ragione perché volevo che ammirasse me. Mio figlio era il prezzo più comodo. Sì, è stato da codardo.',
            choices: [
              { label: '[RESTA] "Non ti assolvo. Ma resto qui un po\'."', next: 'r6' },
              { label: '[ESCI] "Dirlo non basta. Però è la prima cosa vera."', next: null, fx: { note: 'Arturo annuisce senza cercare una battuta. La porta del garage resta aperta.', lore: 'padre_ferita_aperta' } }
            ]
          },
          r6: {
            speaker: 'npc',
            text: 'Va bene. Non ti chiedo di perdonare l\'Impero, e non ti chiedo di perdonare me stasera. Mi aiuti con questa mensola? Pende da quando sei partito. Ho sempre detto che era il muro.',
            choices: [
              { label: '[AIUTALO] Raddrizzate la mensola. (+rep Bazzano)', next: null, fx: { rep: { bazzano: 7 }, note: 'La mensola era storta. Anche il muro, un poco. Per una volta avete ragione entrambi.', lore: 'padre_riconciliato' } }
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
        blurb: 'Nessuno davanti. Solo tu e uno specchio che non ha mai imparato la burocrazia.',
        start: 's1',
        playerOnly: true,
        nodes: {
          s1: {
            speaker: 'zvan',
            text: 'L\'ispettore mi ha chiamato “Marìa” per venti minuti. Palmira mi chiama Zvanino. Io, nello specchio, non so quale dei due risponde. Però il distintivo è storto. Almeno quello lo posso sistemare.',
            choices: [
              { label: '[AMMETTI] "Sono ospite dove sono nato."', next: 's2' },
              { label: '[NEGA] "Sono ancora di qui. Lascia st— …no."', next: 's2b' }
            ]
          },
          s2: {
            speaker: 'zvan',
            text: 'Ospite, sì. Nessuno mi manda via; sono io che chiedo permesso prima di sedermi. Forse casa non è il posto che ricordi. È il posto dove, piano piano, smetti di chiedere.',
            choices: [{ label: '[CONTINUA]', next: 's3' }]
          },
          s2b: {
            speaker: 'zvan',
            text: '“Sono ancora di qui” suona come una difesa. Se fosse vero non avrei bisogno di dirlo allo specchio. Va mo là, Zvan. Almeno con te stesso parla normale.',
            choices: [{ label: '[CONTINUA]', next: 's3' }]
          },
          s3: {
            speaker: 'zvan',
            text: 'Il Patto serve a tenere lontane le casate dalle anomalie. Questo lo scriverò nel rapporto. Quello che non scriverò è che voglio vedere il Mulino girare perché da bambino mi addormentavo con quel rumore. Per una volta, il motivo ufficiale può essere quello meno vero.',
            choices: [
              { label: '[CHIUDI GLI OCCHI]', next: null, fx: { note: 'Hai pensato una cosa vera senza allegarla a niente.', mark: 'root_mirror', lore: 'macguffinium_capito' } }
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
        gender: 'f',
        portrait: 'sprites/faces/roots/lia.png',
        blurb: 'Stesso cognome, stesso sportello. Quando chiamano «Marìa», in sala si alzano in due.',
        start: 'c1',
        nodes: {
          c1: {
            speaker: 'npc',
            text: 'Hanno chiamato «Marìa» e ci siamo alzati in due. Tu hai il quarantasette, io il quarantotto. Se allo sportello hanno senso dell\'umorismo ci tengono qui fino a cena. Sei venuto per il Patto o anche per salutarmi?',
            choices: [
              { label: '[ZVAN] "Per il Patto. Il resto non era in agenda."', next: 'c2' },
              { label: '[DIALETTO] "Taproblem… cioè no. Ecco, questo non è taproblem."', next: 'c2b' }
            ]
          },
          c2: {
            speaker: 'zvan',
            text: 'Per il Patto. Ma volevo anche vederti. Ho provato a preparare una frase meno triste e mi è venuta questa. A Imperium almeno le riunioni avevano un ordine del giorno.',
            choices: [{ label: '[ASCOLTA]', next: 'c3' }]
          },
          c2b: {
            speaker: 'npc',
            text: 'Infatti questo è problem. Ma non per il dialetto. Sei qui da mezz\'ora e continui a parlarmi come se fra noi ci fosse un vetro. Siediti: il vetro allo sportello basta già.',
            choices: [{ label: '[ZVAN] "Hai ragione. Ricominciamo: ciao, Lia."', next: 'c3' }]
          },
          c3: {
            speaker: 'npc',
            text: 'Il fascicolo non è nella sala grande. È nell\'ala chiusa, sotto “classificati male”. La chiave ce l\'ho io da undici anni: nessuno me l\'ha chiesta perché nessuno vuole ammettere che una chiave esiste. Te la do a una condizione: aspetti qui il nostro turno. Abbiamo vent\'anni da riassumere e il display è fermo al quarantadue.',
            choices: [
              { label: '[RESTA IN FILA] "Quarantasette. Aspetto." (+rep Crespellano)', next: null, fx: { rep: { crespellano: 5 }, note: 'Tre ore di coda e vent\'anni raccontati male. Lia ti lascia in mano la chiave dell\'ala «classificata male».', lore: 'casate_rumore' } },
              { label: '[VAI] "Ho una finestra orbitale fra venti minuti."', next: null, fx: { note: 'Lia si rimette la chiave in tasca. Non ti saluta da funzionario: dice «Zvan», e torna a fissare il display dei turni.' } }
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
        gender: 'm',
        portrait: 'sprites/faces/roots/dario.png',
        blurb: 'Da ragazzi rubavate i cartelli stradali per ridere. Adesso lui i cartelli li timbra.',
        start: 'k1',
        nodes: {
          k1: {
            speaker: 'npc',
            text: 'Marìa. Tu firmi per Imperium, io timbro per Calcara. A sedici anni rubavamo i cartelli agli adulti che facevano queste cose. Direi che gli adulti hanno vinto.',
            choices: [
              { label: '[ZVAN] "Lo so di essere diventato quello che prendevamo in giro."', next: 'k2' },
              { label: '[DIFESA] "Senza Imperium quest\'anello si spegne."', next: 'k2b' }
            ]
          },
          k2: {
            speaker: 'zvan',
            text: 'Credevo che una firma servisse a prendersi la responsabilità. Poi ho visto quanta gente firma per passarla al prossimo. Io compreso, qualche volta.',
            choices: [{ label: '[ASCOLTA]', next: 'k3' }]
          },
          k2b: {
            speaker: 'npc',
            text: 'Può darsi. Ma non usare l\'anello come scusa per qualunque cosa. Anche il mio hangar tiene in piedi mezzo sistema; ciò non rende onesta ogni fattura che esce da qui.',
            choices: [{ label: '[ZVAN] "Questa era quasi una confessione."', next: 'k3' }]
          },
          k3: {
            speaker: 'npc',
            text: 'Non dirlo in giro, mi rovini la carriera. Ti do anche un consiglio: non firmare niente che non sapresti spiegare a Palmira senza parole lunghe. E guarda chi compra i rilevamenti delle anomalie. Da settimane arrivano intermediari delle casate. Il nome che usano è macguffinium; quando chiedi a cosa serve, improvvisamente hanno tutti fretta.',
            choices: [
              { label: '[ACCETTA IL COLPO] (+rep Calcara piccola)', next: null, fx: { rep: { calcara: 3 }, note: 'Dario ti regala un silenzio onesto. Da queste parti è merce rara.', lore: 'macguffinium_voce' } },
              { label: '[VAI VIA UFFICIALE]', next: null, fx: { rep: { calcara: -2 }, note: 'Hai chiuso la conversazione come un verbale. Lui ti ha protocollato: forestiero.' } }
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
        portrait: 'sprites/faces/roots/serafina.png',
        blurb: 'Da bambini giocavate ai cavalieri. Lei ha continuato sul serio; tu hai preso il marmo.',
        start: 'm1',
        nodes: {
          m1: {
            speaker: 'npc',
            text: 'Zvan. Ti ricordi quando il figlio del fabbro disse che le frecce di luce erano laser e noi lo buttammo nel fieno? Aveva ragione lui. Non gliel\'ho mai detto: ormai è una questione d\'onore.',
            choices: [
              { label: '[ZVAN] "Io. Ho scambiato il gioco con il grado."', next: 'm2' },
              { label: '[ZVAN] "Siamo cresciuti in direzioni diverse."', next: 'm2b' }
            ]
          },
          m2: {
            speaker: 'zvan',
            text: 'Io ho smesso, credo. A Imperium, se una cosa è inutile, la nascondono in un comitato. Qui almeno le mettete un elmo e la fate sfilare in piazza.',
            choices: [{ label: '[ASCOLTA]', next: 'm3' }]
          },
          m2b: {
            speaker: 'npc',
            text: '“Direzioni diverse” lo dice chi non vuole dire “mi sei mancata”. Rrigore, Zvan. Vent\'anni e ancora bari quando perdi.',
            choices: [{ label: '[ZVAN] "Mi sei mancata."', next: 'm3' }]
          },
          m3: {
            speaker: 'npc',
            text: 'Ecco. Non era difficile. Resta per il torneo e perdi come una volta. Ah: se il radar impazzisce, non è uno hulk. È il Palazzo Beghelli. Un tempo decidevano tutto; oggi offrono caffè e piccoli favori. Accetta il caffè. Sul favore, leggi bene.',
            choices: [
              { label: '[DICI] "Zvan. Solo Zvan." (+rep Monteveglio)', next: null, fx: { rep: { monteveglio: 6 }, note: 'Serafina ti calca in testa un elmo di due taglie sbagliate. Ti sta ridicolo, e lo sa.', lore: 'beghelli_voce' } },
              { label: '[DICI] "Funzionario Marìa."', next: null, fx: { note: 'Chinando la testa, ti tratta da ospite. Nessuno inchina la testa agli amici.' } }
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
        gender: 'm',
        portrait: 'sprites/faces/roots/remo.png',
        blurb: 'Parla poco e giudica dall\'aroma. Con lui hai sempre avuto la pagella bassa.',
        start: 'v1',
        nodes: {
          v1: {
            speaker: 'npc',
            text: 'Zvan. Togliti i guanti. Il tartufo si tocca. Sei tornato da mezz\'ora e hai già chiesto il prezzo due volte: questa è una malattia di Imperium o eri così anche prima?',
            choices: [
              { label: '[ZVAN] "Me lo ricordo. Ho paura di riprovarlo."', next: 'v2' },
              { label: '[ZVAN] "Porto tre chili. È il prezzo del sigillo."', next: 'v2b' }
            ]
          },
          v2: {
            speaker: 'zvan',
            text: 'Me lo ricordo. Mia madre ne metteva troppo nel brodo e tu protestavi, poi facevi il bis. Ho paura che il sapore sia rimasto uguale e io no.',
            choices: [{ label: '[ASCOLTA]', next: 'v3' }]
          },
          v2b: {
            speaker: 'npc',
            text: 'Il sigillo costa tre chili. Il tartufo costa quattrocentoventi. Quello che ti sto chiedendo io non costa niente: annusa prima di fare il funzionario.',
            choices: [{ label: '[ZVAN] "Allora fammelo sentire."', next: 'v3' }]
          },
          v3: {
            speaker: 'npc',
            text: 'Assaggia e basta. Gli occhi lucidi non dimostrano niente: potrebbe essere il pepe. Però ascolta una cosa. Nei depositi sentiamo odore di metallo quando passano le anomalie. Lo chiamano macguffinium, e le casate hanno già cominciato a fare domande. Il Patto deve reggere prima che arrivino a fare offerte. Adesso mangia: si fredda.',
            choices: [
              { label: '[ASSAGGI] (+rep Savigno)', next: null, fx: { rep: { savigno: 5 }, note: 'L\'aroma ti apre un cassetto che credevi vuoto. Dentro c\'è un cortile e una domenica.', lore: 'macguffinium_voce' } },
              { label: '[RIFIUTI]', next: null, fx: { note: 'Remo non insiste. Chiude il barattolo e ti guarda come si guarda una pratica sospesa.' } }
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
        npcName: 'Vera dell\'Anello',
        npcTitle: 'ESULE · CASTELLETTO',
        npcSeed: 9906,
        faction: 'castelletto',
        gender: 'f',
        portrait: 'sprites/faces/roots/vera.png',
        blurb: 'È partita anche lei, ma non per Imperium: per non dover scegliere una bandiera.',
        start: 'e1',
        nodes: {
          e1: {
            speaker: 'npc',
            text: 'Zvan Marìa. Hai ordinato un caffè dicendo “se possibile”. A Castelletto è sempre possibile: è cattivo comunque. Siediti. Noi due siamo partiti in direzioni opposte e siamo finiti allo stesso bancone.',
            choices: [
              { label: '[ZVAN] "Tu almeno hai scelto. Io sono stato assegnato."', next: 'e2' },
              { label: '[ZVAN] "Nostalgia. Nei rapporti quella voce non esiste."', next: 'e2b' }
            ]
          },
          e2: {
            speaker: 'zvan',
            text: 'Io non sono scappato, mi hanno assegnato. Almeno è quello che mi sono raccontato. Adesso conosco le coordinate di ogni stazione e devo chiedere il nome a chi mi apre la porta.',
            choices: [{ label: '[ASCOLTA]', next: 'e3' }]
          },
          e2b: {
            speaker: 'npc',
            text: 'Nei rapporti no. Nelle cucine, nei letti e nei bar delle stazioni sì. Non è molto professionale, ma resiste meglio dei governi.',
            choices: [{ label: '[ZVAN] "Bevo. E ascolto."', next: 'e3' }]
          },
          e3: {
            speaker: 'npc',
            text: 'Se ti serve aprire una porta, prova coi Beghelli. Il loro Palazzo è la nave enorme che copre mezzo radar. Una volta comandavano; oggi conoscono ancora tutti, che è quasi la stessa cosa finché non chiedi aiuto vero. Ti daranno un contatto o una scorta, non una soluzione. E non dire in radio “macguffinium”: le casate ascoltano quella parola come i cani sentono aprire la dispensa.',
            choices: [
              { label: '[PAGHI E RESTI] (+rep)', next: null, fx: { credits: -20, rep: { bazzano: 2 }, note: 'Il caffè sa di metallo e tu lo bevi lo stesso, senza fare la faccia da rapporto.', lore: 'beghelli_voce' } },
              { label: '[PAGHI E VAI]', next: null, fx: { credits: -20, note: 'Il caffè sa di metallo. Come Imperium. Te ne accorgi solo adesso, sulla porta.' } }
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
      if (e.requireSeen && !isSeen(e.requireSeen)) return false;
      if (e.requireHulkBoarded && !(global.StorySys && global.StorySys.flags && global.StorySys.flags.hulkBoarded)) return false;
      return true;
    });
  }

  /** Stazioni con almeno un incontro Radici ancora disponibile. */
  function stationsWithAvailable() {
    const out = [];
    const seen = new Set();
    const ids = [
      'bazzano', 'sirena', 'lavino', 'crespellano', 'pragatto',
      'monteveglio', 'oliveto', 'savigno', 'zappolino', 'castelletto'
    ];
    // Usa anche le stazioni vive se presenti
    const live = (global.stations || []).map((s) => s && s.sd && s.sd.id).filter(Boolean);
    live.concat(ids).forEach((id) => {
      if (!id || seen.has(id)) return;
      seen.add(id);
      const avail = availableEncounters(id);
      if (!avail.length) return;
      const sd = (global.SDATA || []).find((s) => s.id === id);
      const name = (sd && sd.name) || id;
      out.push({ id, name, count: avail.length, npc: avail[0].npcName });
    });
    return out;
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

  function drawPortraits(enc, speaker, node) {
    const zvanCv = el('root-zvan-cv');
    const npcCv = el('root-npc-cv');
    const zvanWrap = el('root-zvan-wrap');
    const npcWrap = el('root-npc-wrap');
    const npcName = (node && node.speakerName) || enc.npcName;
    const npcFaction = (node && node.faction) || enc.faction;
    const npcGender = (node && node.gender) || enc.gender;
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
        global.PortraitRenderer.drawCanvas(npcCv, (node && node.npcSeed) || enc.npcSeed || 1, npcFaction || 'bazzano', {
          name: npcName,
          gender: npcGender === 'f' ? 'f' : (npcGender === 'm' ? 'm' : undefined),
          kind: npcFaction === 'pirate' ? 'pirate' : undefined,
          portraitPath: (node && node.portrait) || enc.portrait || null
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
    drawPortraits(enc, speaker, node);

    const nameEl = el('root-speaker-name');
    const typeEl = el('root-speaker-type');
    const textEl = el('root-text');
    const choicesEl = el('root-choices');
    const nodeNpcName = node.speakerName || enc.npcName;
    if (nameEl) {
      nameEl.textContent = speaker === 'zvan' ? 'ZVAN MARÌA' : (enc.playerOnly ? 'ZVAN MARÌA' : nodeNpcName);
      const nodeFaction = node.faction || enc.faction;
      nameEl.style.color = speaker === 'zvan' ? '#c8ddd8' : (global.FACTIONS && global.FACTIONS[nodeFaction] ? global.FACTIONS[nodeFaction].color : '#aaccee');
    }
    if (typeEl) {
      typeEl.textContent = speaker === 'zvan'
        ? 'FUNZIONARIO VII · DI RITORNO'
        : (node.npcTitle || enc.npcTitle || 'INCONTRO');
    }
    const npcLbl = el('root-npc-wrap') && el('root-npc-wrap').querySelector('.root-port-lbl');
    if (npcLbl) {
      npcLbl.textContent = enc.playerOnly ? 'SPECCHIO' : String(nodeNpcName || 'INCONTRO').split(' ')[0].toUpperCase();
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
      // Hint anche sul ticker HUD (prossimo updateHUD in volo dopo decollo).
      try {
        if (!global.PS.rootHints) global.PS.rootHints = {};
        global.PS.rootHints[st.sd.id] = avail[0].npcName;
      } catch (_) { /* ignore */ }
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
      const missingSeen = !!(enc.requireSeen && !isSeen(enc.requireSeen));
      const missingHulk = !!(enc.requireHulkBoarded && !(global.StorySys && global.StorySys.flags && global.StorySys.flags.hulkBoarded));
      const gated = missingSeen || missingHulk;
      const can = !done && !locked && !gated;
      html += '<div class="ic" style="align-items:flex-start' + (done ? ';opacity:.7' : '') + '">';
      html += '<div class="in2"><div class="nm">' + enc.npcName + (done ? ' · vissuto' : '') + '</div>';
      html += '<div class="dc">' + enc.blurb + '</div>';
      html += '<div class="mr">' + enc.title
        + (locked ? ' · sblocca dal cap. ' + enc.minChapter : '')
        + (!locked && missingSeen ? ' · prima affronta l\'incontro precedente' : '')
        + (!locked && !missingSeen && missingHulk ? ' · torna dopo uno Space Hulk' : '')
        + '</div></div>';
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
    stationsWithAvailable,
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
