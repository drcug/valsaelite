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
            text: 'Zvanino. Ho sentito il portello e ho pensato: o è la caldaia, o è il figlio della Rina. Era la caldaia. Poi sei entrato tu. Siediti. E stacca quel coso che ti lampeggia sul petto, che così non si capisce se sei un funzionario o il semaforo che a Crespellano aspettano dal 2003.',
            choices: [
              { label: '[DIALETTO] "Taproblem, Palmira. Sto bene."', next: 'n2a' },
              { label: '[UFFICIALE] "Funzionario Marìa. Settimo livello."', next: 'n2b' },
              { label: '[SILENZIO] Ti siedi e basta.', next: 'n2c' }
            ]
          },
          n2a: {
            speaker: 'npc',
            text: '«Taproblem.» L\'hai detto come si legge un codice fiscale. Taproblem si dice di sfuggita, mentre versi, senza guardare in faccia nessuno. Tu ci hai messo la maiuscola. Va bene lo stesso: hai provato. All\'asilo non eri «il bambino del Mulino», eri Zvanino e stop. Adesso entri in casa tua e bussi.',
            choices: [
              { label: '[ZVAN] "Ho dimenticato come si sta seduti, qui."', next: 'n3' },
              { label: '[ZVAN] "Avevo fretta di diventare qualcuno. Ci sono riuscito."', next: 'n3b' }
            ]
          },
          n2b: {
            speaker: 'npc',
            text: 'Settimo livello. Bene. Io sono Palmira, primo banco, fila delle suore. Una volta scendevi di corsa dal catechismo per fregare il pane; adesso parli come una circolare con le note a piè di pagina. Suor Geltrude riderebbe fino alle lacrime e poi ti darebbe la merenda lo stesso. Siediti.',
            choices: [
              { label: '[ZVAN] "Il grado mi si è appiccicato addosso come una crosta."', next: 'n3' },
              { label: '[ZVAN] "Sotto la divisa ho ancora sete."', next: 'n3' }
            ]
          },
          n2c: {
            speaker: 'npc',
            text: 'Muto. Come quando ti chiedevano chi aveva preso la merenda e tu diventavi un mobile. Qui il silenzio va bene, fa arredamento. A Imperium invece lo chiamano riservatezza e ci mettono sopra un timbro. Due mestieri diversi, Zvanino.',
            choices: [{ label: '[ZVAN] "Il silenzio mi ha tenuto in piedi vent\'anni. Qui mi suona sbagliato."', next: 'n3' }]
          },
          n3: {
            speaker: 'zvan',
            text: 'Palmira, a Imperium ogni corridoio ha un numero. Qui ogni odore ha un cognome. Ho passato vent\'anni a imparare i numeri. Stamattina in porto ho salutato uno convinto che fosse tuo fratello: era un distributore di caffè. Tornare è questo — hai ancora la chiave giusta e la porta l\'hanno spostata.',
            choices: [{ label: '[ASCOLTA]', next: 'n4' }]
          },
          n3b: {
            speaker: 'zvan',
            text: 'Fretta, sì. Non è che casa mi avesse cacciato: è che il marmo faceva più rumore. Tu sei rimasta e sai ancora come si chiama il cane del fornaio. Io ho imparato la differenza fra allegato A e allegato B. Indovina quale delle due serve stasera.',
            choices: [{ label: '[ASCOLTA]', next: 'n4' }]
          },
          n4: {
            speaker: 'npc',
            text: 'Allora ascolta, che poi entra gente e non si sente più niente. Non ti chiedo di tornare bambino: quello è tarenz\'la psiche, roba che non si fa. Ti chiedo di non startene lì con la faccia da satellite dopo nove ore di burocrazia. Bevi. Se ti gira la testa, pazienza: qui il tempo non si consegna in triplice copia. E tieni gli occhi aperti, che da Imperium dicono che le casate grosse si azzannano. Noi siamo periferia. Per adesso.',
            choices: [
              { label: '[RESTA] Bevi e lasci l\'armatura sul bancone. (+rep Bazzano)', next: null, fx: { rep: { bazzano: 4 }, note: 'Palmira ti riempie il bicchiere senza chiedere. Come al cortile, quando la merenda la decideva lei.', lore: 'casate_rumore' } },
              { label: '[FUGGI] "Devo… coordinare."', next: null, fx: { note: '«Coordinare.» Palmira scuote la testa: «Sei ancora in orbita, Zvanino. Scendi a priori, tanto lassù non c\'è nichita.»' } }
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
            text: 'Zvan. Non «funzionario»: Zvan. Sei secco come un arimanno che trasloca ogni sei mesi, solo che tu hai traslocato di pianeta. Fatti guardare. No, fermo lì: se ti muovi sembri uno che deve andare a una riunione.',
            choices: [
              { label: '[ZVAN] "Non so più con che nome presentarmi, qui."', next: 'z2' },
              { label: '[ZVAN] "Non sono tornato. Mi hanno rispedito."', next: 'z2b' }
            ]
          },
          z2: {
            speaker: 'zvan',
            text: 'A Imperium il mio nome era un livello: settimo. Qui era un diminutivo. In mezzo ci sono vent\'anni di niente, e il niente l\'ho riempito di rapporti. Sono l\'unico Marìa che deve aprire la mappa per trovare il cimitero di famiglia.',
            choices: [{ label: '[ASCOLTA]', next: 'z3' }]
          },
          z2b: {
            speaker: 'npc',
            text: 'Rispedito. Come un pacco senza francobollo. Allora dimmi una cosa, e non farmi la faccia da modulo: hai mai pianto senza allegare niente? Perché se no sei rovinato, Zvan. E non nel senso buono, quello tost al prosciutto.',
            choices: [{ label: '[ZVAN] "Ho pianto in un bagno di pietra. Nessuno ha controfirmato."', next: 'z3' }]
          },
          z3: {
            speaker: 'npc',
            text: 'Allora siediti in cortile e sta\' fermo cinque minuti, che il Patto non scappa. Di Imperium non me ne importa un pananai. Ti chiedo solo se lo spazio ti ha congelato la lingua o soltanto la voglia. E se ti mandano qui perché lassù le casate si mordono, ricordati: noi siamo il patio di servizio dell\'Impero. Non è una metafora, è proprio l\'indirizzo.',
            choices: [
              { label: '[RESTA] "Rimparo a dire Zvanino senza vergognarmi." (+rep)', next: null, fx: { rep: { bazzano: 6 }, note: 'Zia Ornella ti mette in tasca un fazzoletto stirato. Sa di sapone e di rimprovero.', lore: 'periferia' } },
              { label: '[PARTE] "Il Patto non aspetta."', next: null, fx: { note: 'Non ti trattiene. Le zie capiscono subito quando uno è già partito da un pezzo.' } }
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
            text: 'Zvanino, puzzi di corridoio che cammina. E non è sudore da viaggio, quello lo conosco ed è onesto. Questo è macguffinium. Sei entrato in uno hulk, eh? Allora o porti fuori il fetore, o ti siedi e me lo racconti — ma senza mostri da manifesto, che quelli li vedo già in televisione.',
            choices: [
              { label: '[ZVAN] "Erano persone. Prima."', next: 'h2' },
              { label: '[ZVAN] "Ho preso pezzi. Fine."', next: 'h2b' }
            ]
          },
          h2: {
            speaker: 'zvan',
            text: 'Dentro non c\'è silenzio: c\'è un rumore lento. Cose che una volta avevano un nome sul contratto d\'imbarco. Io ho recuperato documenti, tre moduli e l\'odore. Per l\'odore chiedo scusa.',
            choices: [{ label: '[ASCOLTA]', next: 'h3' }]
          },
          h2b: {
            speaker: 'npc',
            text: 'Pezzi. Sempre pezzi. Almeno i pezzi non raccontano storie. Però se hai visto i mutati e fai finta di niente si nota: hai la faccia di uno che ha tirato il cordolo del cesso e adesso spiega che non è stato lui.',
            choices: [{ label: '[ZVAN] "Li ho visti. Non se ne vanno."', next: 'h3' }]
          },
          h3: {
            speaker: 'npc',
            text: 'Allora imparala, questa, tavò: la nave morta ti dà ferro, lo hulk ti dà i sogni sbagliati. Confonderli è tabrein in cupola. E lava la tuta prima di passare dall\'asilo. Sì, lo so che le suore non ci sono più. Lavala lo stesso.',
            choices: [
              { label: '[RESTA] Bevi finché l\'odore non passa. (+rep)', next: null, fx: { rep: { bazzano: 5 }, note: 'Palmira ti passa uno straccio pulito. Sa di sapone, che qui vuol dire casa.', lore: 'hulk_visited' } },
              { label: '[PARTE] "Devo tornare al relitto."', next: null, fx: { note: '«Allora porta armi. E un po\' di pietà, che pesa meno.»', lore: 'hulk_mutazioni' } }
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
            text: 'Mi guardo e vedo prima l\'uniforme, poi la faccia. Il distintivo col pianeta e l\'anello: a Imperium sembrava un\'identità, qui sembra un cappotto preso all\'attaccapanni sbagliato.',
            choices: [
              { label: '[AMMETTI] "Sono ospite dove sono nato."', next: 's2' },
              { label: '[NEGA] "Sono ancora di qui. Lascia st— …no."', next: 's2b' }
            ]
          },
          s2: {
            speaker: 'zvan',
            text: 'Ospite. Non perché mi caccino: perché misuro tutto in procedure. Il vino ha bisogno di un verbale? Il Mulino di un allegato? Sto istruendo la pratica del mio stesso ritorno, e ovviamente manca un timbro.',
            choices: [{ label: '[CONTINUA]', next: 's3' }]
          },
          s2b: {
            speaker: 'zvan',
            text: 'Non riesco nemmeno a finirla. Mi esce mezza negazione, come uno che ha dimenticato dove si attacca il «ta». Qui il no lo metti davanti alla parola e via; io lo metto in fondo a un modulo, dentro un riquadro grigio, con la data.',
            choices: [{ label: '[CONTINUA]', next: 's3' }]
          },
          s3: {
            speaker: 'zvan',
            text: 'E adesso capisco perché Imperium tiene in piedi il Patto. Se Valsamoggia si spacca, le anomalie diventano campo aperto; e se là sotto c\'è davvero macguffinium — materia a nove dimensioni — le casate grandi scendono qui a mordersi, e l\'Impero quella guerra non la regge. Tutto questo, e il mio compito è far girare un mulino. Va bene. È l\'unica pratica che non ho voglia di archiviare.',
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
        blurb: 'Stesso cognome, stessa coda allo sportello. Lei non è mai partita e non te lo rinfaccia. Quasi.',
        start: 'c1',
        nodes: {
          c1: {
            speaker: 'npc',
            text: 'Zvan. Noi il semaforo lo aspettiamo dal 2003 e tu arrivi con una busta nera. Qui buste nere non ne sono mai arrivate: arriva modulistica, e la modulistica è beige. Allora: sei venuto per il Patto, o Imperium ti ha usato come corriere della nostalgia?',
            choices: [
              { label: '[ZVAN] "Per tutti e due. E non so quale pesa di più."', next: 'c2' },
              { label: '[DIALETTO] "Taproblem… no. Ecco: questo non è taproblem."', next: 'c2b' }
            ]
          },
          c2: {
            speaker: 'zvan',
            text: 'A Imperium dicevano che Crespellano produce «niente». Ridevo anch\'io, in mensa, insieme agli altri. Poi ho capito che il niente era l\'unica cosa che non riuscivano a comprare. Io invece mi sono venduto a rate, un livello alla volta.',
            choices: [{ label: '[ASCOLTA]', next: 'c3' }]
          },
          c2b: {
            speaker: 'npc',
            text: 'Bravo, ti sei corretto da solo. «Taproblem» in bocca tua suona tradotto dall\'imperiale, con la nota a piè di pagina. Come quelli che vengono in gita, dicono tavò e si sentono del posto. Tu non sei un turista, Zvan: sei un reduce del marmo. È peggio, però almeno è roba tua.',
            choices: [{ label: '[ZVAN] "Allora insegnami a sbagliare di nuovo, ma in dialetto."', next: 'c3' }]
          },
          c3: {
            speaker: 'npc',
            text: 'Le radici non tornano con un capitolo: tornano stando in fila. Se ti sei stufato di Imperium, buon per te; se no vai a firmare, che io aspetto il verde e ho tutto il tempo. Ah, se ti interessano le voci: lassù le casate maggiori si scannano nei corridoi e i nostri fascicoli li leggono come l\'inventario di un magazzino di periferia. Il magazzino saremmo noi.',
            choices: [
              { label: '[RESTA IN FILA] (+rep Crespellano)', next: null, fx: { rep: { crespellano: 5 }, note: 'Lia ti lascia una chiave dell\'archivio «classificato male». Qui «male» è un complimento.', lore: 'casate_rumore' } },
              { label: '[VAI]', next: null, fx: { note: 'Non ti saluta da funzionario. Solo: «Zvan.» E torna a guardare il semaforo.' } }
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
            text: 'Marìa. Settimo livello. Hai portato il pezzo e vuoi il timbro. Ti ricordi quando i timbri erano pananai, roba da ridere in fondo alla classe? Adesso sei pananai con la tredicesima. Complimenti sinceri, giuro.',
            choices: [
              { label: '[ZVAN] "Lo so di essere diventato quello che prendevamo in giro."', next: 'k2' },
              { label: '[DIFESA] "Senza Imperium quest\'anello si spegne."', next: 'k2b' }
            ]
          },
          k2: {
            speaker: 'zvan',
            text: 'A Imperium mi hanno insegnato che l\'ufficialità tiene insieme le cose. Qui vedo che l\'ordine si vende al chilo, con lo sconto quantità. Porto il distintivo di chi firma: mi tiene dritto e intanto mi preme sullo stomaco.',
            choices: [{ label: '[ASCOLTA]', next: 'k3' }]
          },
          k2b: {
            speaker: 'npc',
            text: 'Si spegne, dici. Allora prova a dirmi «è tutto a posto» senza sembrare un libretto d\'istruzioni. Non ci riesci. Tavalvol apr, Zvan: stavolta la macchina che non parte sei tu.',
            choices: [{ label: '[ZVAN] "Allora aiutami a rimetterla in moto. Senza fattura."', next: 'k3' }]
          },
          k3: {
            speaker: 'npc',
            text: 'Senza fattura io non esisto, lo sai com\'è. Però ti do un consiglio non protocollato: non firmare niente che non ti va di difendere a Bazzano, a voce alta, alla terza bottiglia. E tieni d\'occhio le casate, che qui arrivano già intermediari a chiedere «rilevazioni sulle anomalie». Materia strana, nove dimensioni, macguffinium. Se è vero, smettiamo di essere il patio di servizio e diventiamo il cortile dove ci si mena.',
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
            text: 'Zvan. Che le frecce di luce siano laser lo sapevamo già a otto anni: lo diceva tuo cugino e noi gli davamo dell\'endàvs. Poi tu sei partito per chiamarle «sistemi d\'arma» e io sono rimasta a chiamarle promesse. Secondo te chi dei due ha smesso di giocare?',
            choices: [
              { label: '[ZVAN] "Io. Ho scambiato il gioco con il grado."', next: 'm2' },
              { label: '[ZVAN] "Siamo cresciuti in direzioni diverse."', next: 'm2b' }
            ]
          },
          m2: {
            speaker: 'zvan',
            text: 'A Imperium il gioco si chiama inefficienza e ha un codice di spesa. Qui il gioco è governo, con l\'elmo e tutto il resto. Io sto in mezzo: niente armatura vera, niente divertimento vero. Solo la missione, e un cavallo che è un\'astronave.',
            choices: [{ label: '[ASCOLTA]', next: 'm3' }]
          },
          m2b: {
            speaker: 'npc',
            text: '«Direzioni diverse.» Rrigore. Si sente da qui, Zvan: hai appena asportato il parrucchino con la voce da conferenza stampa. Torna a sporcarti. Torna a ridere senza mettere la data in alto a destra.',
            choices: [{ label: '[ZVAN] "Insegnami una risata senza numero di protocollo."', next: 'm3' }]
          },
          m3: {
            speaker: 'npc',
            text: 'Resta stanotte alla Rocca. Non da funzionario: da quello che perdeva al torneo e barava sul punteggio, che eri tu e lo sai benissimo. Prima però dimmi il tuo nome senza livello attaccato. Ah, e se vedi una firma radar enorme, più grossa di uno hulk, è il Palazzo Beghelli: comandavano quando andavamo a scuola, adesso sono casata minore. Ti aiutano, se hai le conoscenze giuste. Aiuto nel senso di: molta cortesia e un caffè.',
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
            text: 'Zantic, lo spazio, eh? Si vede. Tu puzzi di sterilizzazione, non di tartufo. Dimmi la verità: il sapore di casa te lo ricordi, o l\'hai archiviato sotto «tradizioni locali, cartella tre»?',
            choices: [
              { label: '[ZVAN] "Me lo ricordo. Ho paura di riprovarlo."', next: 'v2' },
              { label: '[ZVAN] "Porto tre chili. È il prezzo del sigillo."', next: 'v2b' }
            ]
          },
          v2: {
            speaker: 'zvan',
            text: 'A Imperium il cibo non aveva parenti: arrivava, si mangiava, si smaltiva. Qui ogni piatto ha dentro un vivo e un morto. Ho mangiato vent\'anni senza genealogia, e adesso tremo davanti a un barattolo.',
            choices: [{ label: '[ASCOLTA]', next: 'v3' }]
          },
          v2b: {
            speaker: 'npc',
            text: '«Prezzo.» Parli da compratore. Va bene, compra: i soldi non hanno mai offeso nessuno. Ma se non senti l\'aroma stai solo firmando, e le firme, qui, non si mangiano.',
            choices: [{ label: '[ZVAN] "Allora fammelo sentire."', next: 'v3' }]
          },
          v3: {
            speaker: 'npc',
            text: 'Assaggia. Se ti vengono gli occhi lucidi sei ancora di qui; se no torna a Imperium e lascia il Mulino a chi puzza di terra. Un\'altra cosa, poi sto zitto per un anno: nelle anomalie qualcosa non torna. Odore di metallo, luce storta. Dicono macguffinium. Se le casate grosse lo fiutano, qui arriva la guerra. Ecco perché il Patto deve reggere. Adesso assaggia, che si scalda.',
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
            text: 'Zvan Marìa. Ti ho riconosciuto da come hai ordinato il caffè: sembrava una richiesta di autorizzazione in bollo. Io sono scappata dalle fazioni, tu sei scappato dentro Imperium. Due fughe, stessa nostalgia, due caffè pessimi.',
            choices: [
              { label: '[ZVAN] "Tu almeno hai scelto. Io sono stato assegnato."', next: 'e2' },
              { label: '[ZVAN] "Nostalgia. Nei rapporti quella voce non esiste."', next: 'e2b' }
            ]
          },
          e2: {
            speaker: 'zvan',
            text: 'Assegnato come un modulo a un ufficio. E adesso mi chiedono di tenere insieme un sistema che so a memoria e che non riconosco: conosco la posizione di ogni stazione e non so più chi ci abita dentro.',
            choices: [{ label: '[ASCOLTA]', next: 'e3' }]
          },
          e2b: {
            speaker: 'npc',
            text: 'Nei rapporti no, sulle navi sì. Bevi. Il caffè qui sa di metallo: ti ricorda Imperium e ti risparmia la fatica di mentire.',
            choices: [{ label: '[ZVAN] "Bevo. E ascolto."', next: 'e3' }]
          },
          e3: {
            speaker: 'npc',
            text: 'Se ti serve un favore dai Beghelli, passa dal Palazzo quando entra in sistema: nave da casata, più grossa di uno hulk. Una volta comandavano qui, adesso sono secondari. Ti spostano una pratica, una scorta leggera, un\'introduzione — poi ti lasciano lì in mezzo. Con le conoscenze giuste ottieni poco; senza conoscenze ottieni nichita. E ricordati perché Imperium tiene al Patto: sotto le anomalie potrebbe esserci macguffinium. Se Valsamoggia si spacca, la guerra galattica comincia dal nostro parcheggio.',
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
          gender: enc.gender === 'f' ? 'f' : (enc.gender === 'm' ? 'm' : undefined),
          kind: enc.faction === 'pirate' ? 'pirate' : undefined,
          portraitPath: enc.portrait || null
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
