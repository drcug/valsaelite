# GUIDA ALLA SOLUZIONE — *Il Patto del Molino*

**Valsamoggia Spaziale (Valsaelite)**  
Walkthrough completa della campagna principale, passo per passo.

> Compagno narrativo: `TRAMA-IL-PATTO-DEL-MOLINO.md`  
> Questa guida è **meccanica**: dove andare, cosa fare, requisiti, errori tipici.

---

## Indice

1. [Avvio partita](#1-avvio-partita)
2. [Controlli essenziali](#2-controlli-essenziali)
3. [Percorso campagna (8 capitoli)](#3-percorso-campagna-8-capitoli)
4. [Gate speciali (suborbita e Space Hulk)](#4-gate-speciali)
5. [Nave e progressione consigliata](#5-nave-e-progressione-consigliata)
6. [Reputazione, pedaggi, prezzi](#6-reputazione-pedaggi-prezzi)
7. [Combattimento](#7-combattimento)
8. [Vittoria ed epilogo](#8-vittoria-ed-epilogo)
9. [Errori tipici e softlock](#9-errori-tipici-e-softlock)
10. [Checklist rapida](#10-checklist-rapida)

---

## 1. Avvio partita

1. Dopo il caricamento appare il **menu**: **PARTI** · **CARICA** · **INTRO** · **OPZIONI** · **AIUTO**.
2. **PARTI** → (opzionale) slideshow Imperium → banner **PROLOGO**.
3. Premi **CONTINUA** sul prologo → parte automaticamente il **Capitolo 1**.
4. Nasci vicino a **Bazzano Prime**. Approda (**E** / **APPRODA**) → tab **MISSIONI** → accetta la missione `[STORIA]`.

**Diario:** tasto **J** — obiettivi capitolo per capitolo.

**Salvataggio:** automatico all’attracco, al decollo e ~ogni 90 s in volo; manuale nel tab **RIPARAZIONE**.

---

## 2. Controlli essenziali

| Azione | Tasto / UI |
|--------|------------|
| Motori / virata / boost | **W** · **A/D** · **Shift/B** (o ACCEL / BOOST a schermo) |
| Fuoco | **Spazio** |
| Attracco | **E** vicino alla stazione |
| Mappa galattica | **M** → seleziona → **NAVIGA QUI** |
| Bersaglio | **R** / **Tab** |
| Missili (se installati) | **Q** |
| Hail / dialogo | **T** / **H** |
| Abbordaggio | **G** (hulk o nave disabilitata) |
| Cantiere blueprint | **P** |
| Diario | **J** |
| Aiuto | **Shift+/** |

**Suborbita:** **WASD**, **Spazio** sparo, **F** trazione container, **ESC** uscita anticipata, **V** preset controlli.

**Abbordaggio (minigioco):** **WASD**, **Spazio**, **Tab** bersaglio, **ESC** ritiro.

---

## 3. Percorso campagna (8 capitoli)

### Mappa stazioni chiave

| ID | Nome | Ruolo nella storia |
|----|------|--------------------|
| `bazzano` | **Bazzano Prime** | Cap. 1, 5, 6, 8 — hub principale |
| `crespellano` | **Crespellano** | Cap. 1 destinazione · Cap. 2 accettazione |
| `calcara` | **Calcara Station** | Cap. 2 destinazione (orbita Crespellano) |
| `monteveglio` | **Rocca di Monteveglio** | Cap. 3 accettazione |
| `savigno` | **Savigno Deep** | Cap. 4 (suborbita + tartufi) |
| `castelletto` | **Castelletto Rock** | Cap. 6 destinazione · Cap. 7 accettazione |

### Merce storia

| Codice | Nome | Uso |
|--------|------|-----|
| `documenti` | Modulistica Comunale | Cap. 1 e Cap. 6 (consegnata all’accettazione) |
| `frammento` | Frammento del Patto | +1 a fine Cap. 1–4 · serve ×3 al Cap. 5 |
| `tartufi` | Tartufi Spaziali | Cap. 4 ×3 (dopo suborbita) |
| `piadine` | Piadine da Sagra | Cap. 8 ×1 |

> All’accettazione di una missione storia il carico viene **forzato in stiva** anche se piena. Non vendere i pezzi di missione attiva.

---

### Capitolo 1 — *Il Patto del Molino*

| | |
|--|--|
| **Accetta a** | Bazzano Prime |
| **Missione** | `[STORIA] Cerca a Crespellano` |
| **Obiettivo** | Porta le credenziali (modulistica) e recupera il frammento nell’archivio crespellanese |
| **Destinazione** | Crespellano |
| **Carico** | `documenti` ×1 (ricevuto all’accettazione) |
| **Ricompensa** | 500 ₡ · rep Bazzano +15 |

**Passi**

1. Accetta a Bazzano.
2. Vola a **Crespellano** (mappa **M**).
3. Approda → la consegna scatta automaticamente (o tab Mercato → **CONSEGNA**).
4. Ottieni **+1 Frammento del Patto** → si apre il Cap. 2.

---

### Capitolo 2 — *Niente è Qualcosa*

| | |
|--|--|
| **Accetta a** | Crespellano |
| **Missione** | `[STORIA] Autentica il Frammento` |
| **Obiettivo** | Porta il Frammento del Patto a Calcara Station |
| **Destinazione** | Calcara Station |
| **Carico** | `frammento` ×1 |
| **Ricompensa** | 700 ₡ · Crespellano +12 · Calcara −5 |

**Passi**

1. Accetta a Crespellano.
2. Vola a **Calcara Station** (satellite di Crespellano).
3. **Attenzione pedaggio:** con rep Calcara &lt; 0 paghi un pedaggio (all’inizio ~75 ₡). Tieni crediti.
4. Approda e consegna → **+1 frammento** → Cap. 3.

---

### Capitolo 3 — *La Copia di Calcara*

| | |
|--|--|
| **Accetta a** | Rocca di Monteveglio |
| **Missione** | `[STORIA] Torneo della Rocca` |
| **Obiettivo** | Abbatti **3 navi di Calcara** |
| **Tipo** | Combattimento |
| **Ricompensa** | 900 ₡ · Monteveglio +20 · Calcara −25 |

**Passi**

1. Accetta a Monteveglio.
2. Cerca navi fazione **Calcara** (radar / hail / rotte mercantili).
3. **R/Tab** per lock · spara con mirino **MIRINO OK**.
4. A 3 kill la missione si completa → **+1 frammento** → Cap. 4.

**Nota:** ogni kill Calcara costa anche rep (oltre al bonus missione). Non lasciare la rep Calcara ≤ −60 o l’hangar chiude.

---

### Capitolo 4 — *Il Terzo Sigillo* ⚠️ GATE

| | |
|--|--|
| **Accetta a** | Savigno Deep |
| **Missione** | `[STORIA] Il Prezzo del Sigillo` |
| **Obiettivo** | Completa un volo **SUBORBITALE**, poi consegna 3 kg di Tartufi |
| **Destinazione** | Savigno Deep |
| **Requisito** | `requireSuborbit` — **prima** dell’accettazione |
| **Ricompensa** | 600 ₡ · Savigno +25 |

**Passi**

1. Approda a **Savigno** (o altro pianeta con suborbita).
2. Premi **VOLO SUBORBITALE**.
3. Completa il corridoio **oppure** raggiungi almeno ~**55%** di progresso (anche con ESC anticipato conta se hai volato abbastanza).
4. Torna in stazione → **ora** puoi accettare la missione.
5. Ricevi `tartufi` ×3 → consegnali a Savigno → **+1 frammento** → Cap. 5.

> Se “Prima completa un volo suborbitale…” → non hai ancora il flag. Rifai la suborbita.

---

### Capitolo 5 — *Il Molino di Bazzano*

| | |
|--|--|
| **Accetta a** | Bazzano Prime |
| **Missione** | `[STORIA] Riporta il Patto` |
| **Obiettivo** | Riporta i **tre frammenti** a Bazzano Prime |
| **Carico** | `frammento` ×3 |
| **Ricompensa** | 2000 ₡ · forti bonus fazioni · Calcara −30 |

**Passi**

1. Accetta a Bazzano (i frammenti vengono completati in stiva se serve).
2. Consegna sullo stesso pianeta.
3. Non vendere i frammenti. → Cap. 6.

---

### Capitolo 6 — *L’Ombra di Imperium* ⚠️ GATE

| | |
|--|--|
| **Accetta a** | Bazzano Prime |
| **Missione** | `[STORIA] Relitto e Rapporto` |
| **Obiettivo** | Abborda uno **SPACE HULK**, poi consegna documenti a Castelletto |
| **Destinazione** | Castelletto Rock |
| **Requisito** | `requireHulk` — **prima** dell’accettazione |
| **Ricompensa** | 1100 ₡ · Bazzano +10 |

**Passi**

1. In volo cerca un **Space Hulk** (relitto grande nella fascia).
2. Avvicinati → prompt → **G** / **ABBORDA**.
3. Completa il minigioco (obiettivi a schermo; attenzione a fuochi e O₂).
4. Solo dopo l’abbordaggio **riuscito** torna a Bazzano e accetta.
5. Ricevi `documenti` → consegna a **Castelletto Rock** → Cap. 7.

> Abbordare una nave NPC ferita **non** vale per questo gate: serve lo **Hulk**.

---

### Capitolo 7 — *Fuoco sulla Rocca*

| | |
|--|--|
| **Accetta a** | Castelletto Rock |
| **Missione** | `[STORIA] Caccia ai Pirati` |
| **Obiettivo** | Abbatti **3 navi pirata** |
| **Ricompensa** | 1400 ₡ · Bazzano +12 · Savigno +8 |

**Passi**

1. Accetta a Castelletto.
2. Caccia pirati (più frequenti vicino a Castelletto / fascia).
3. 3 kill → Cap. 8.

---

### Capitolo 8 — *Il Mulino Acceso*

| | |
|--|--|
| **Accetta a** | Bazzano Prime |
| **Missione** | `[STORIA] Accendi il Mulino` |
| **Obiettivo** | Consegna una cassa di **piadine** per la cerimonia |
| **Carico** | `piadine` ×1 (all’accettazione) |
| **Ricompensa** | 2500 ₡ · bonus multi-fazione |

**Passi**

1. Accetta a Bazzano.
2. Consegna le piadine.
3. Parte lo slideshow **FINALE** → schermata **IL PATTO È RESTAURATO**.

---

## 4. Gate speciali

### Suborbita (Cap. 4)

- Disponibile da stazioni su pianeti “skim” (terra, ghiaccio, ecc.): Bazzano, Crespellano, Savigno, Monteveglio…
- Flag salvato in sessione (`StorySys.flags.suborbitDone`).
- **Attenzione:** il flag **non** è nel salvataggio `localStorage`. Se carichi una partita prima dell’accettazione del Cap. 4, potresti dover **rifare** la suborbita.

### Space Hulk (Cap. 6)

- Solo abbordaggio hulk riuscito imposta `hulkBoarded`.
- Stesso avviso sul salvataggio: dopo un **CARICA**, se non puoi accettare Cap. 6, riabborda un hulk.

---

## 5. Nave e progressione consigliata

### Priorità Officina (tab MODULI)

| Ordine | Modulo | Perché |
|--------|--------|--------|
| 1 | **Scafo Rinforzato I** (`shd1`) | Sopravvivenza Cap. 3 |
| 2 | **Doppio Cannone** (`wep2`) | DPS + sblocca Cannone II / Missili in cantiere |
| 3 | **Scudo Energetico Mk I** (`esh1`) | Assorbe danni |
| 4 | **Energetica Avanzata** (`rep1`) | Fuoco sostenuto |
| 5 | Motori / Radar tattico | Fuga e mirino |

Parti già con `eng1`, `wep1`, `nav1` e ~1500 ₡.

### Cantiere (**P**)

- Prima dei capitoli di combattimento (3 e 7): preset **KIT COMBAT** o più **Cannoni** + **Scudi** + **Motori** connessi.
- Celle **rosse** = scafo spezzato → **CONFERMA** bloccata.
- **STARTER** ripristina il layout base.
- Ghost + riquadro mostrano dove piazzi/cancelli (soprattutto su mobile).

### Equipaggio utile

- **Sir Lothar** (Monteveglio): +danno.
- **Capitano Zappo** (Savigno): +proiettile.
- **Nonna Graziella** (Savigno): regen energia.

---

## 6. Reputazione, pedaggi, prezzi

**Rep iniziale:** Bazzano 20 · Crespellano 0 · Calcara −10 · Monteveglio 5 · Savigno 0.

| Condizione | Effetto |
|------------|---------|
| Rep fazione ≤ **−60** | Hangar **chiuso** (non attracchi) |
| Calcara &lt; 0 | **Pedaggio** all’attracco |
| Rep &lt; −35 | Surcharge hangar |
| Rep &gt; 40 | Sconto riparazioni (~15%) |
| Rep alta / bassa | Prezzi mercato più bassi / alti |

**Castelletto** è neutro: rifugio sicuro se una fazione ti chiude le porte.

---

## 7. Combattimento

1. **R/Tab** → acquisisci bersaglio.
2. Aspetta **MIRINO OK** (lead marker) per colpi critici.
3. Su mobile il mirino è più grande; meno testo HUD.
4. Tattiche NPC: pirati **affiancano**, Calcara **tiene distanza**, Monteveglio **carica**.
5. Missili (**Q**) se hai il pezzo blueprint + sblocco armi.
6. Non abbordare civili se ti serve la loro reputazione (−4 rep).

---

## 8. Vittoria ed epilogo

1. Completa Cap. 8 → slideshow finale → **IL PATTO È RESTAURATO**.
2. Testo epilogo dipende dalle rep (Savigno alto, Monteveglio alto, Bazzano alto, o default).
3. **CONTINUA SANDBOX**: missioni `[EPILOGO]` a Zappolino / Calcara / Monteveglio + missioni procedurali.

---

## 9. Errori tipici e softlock

| Problema | Causa | Soluzione |
|----------|--------|-----------|
| Non posso accettare Cap. 4 | Suborbita non fatta / flag perso al load | Rifai **VOLO SUBORBITALE** |
| Non posso accettare Cap. 6 | Hulk non abbordato / flag perso | Abborda uno **Space Hulk** con **G** |
| Hangar Calcara chiuso | Rep ≤ −60 | Ripara rapporti altrove; usa Castelletto |
| Pedaggio Calcara | Rep &lt; 0 | Porta crediti (partenza ~75 ₡) |
| Missione non consegna | Stazione sbagliata / carico assente | Controlla diario **J** e stiva |
| CONFERMA cantiere bloccata | Scafo spezzato | Celle rosse → ripristina continuità o STARTER |
| Game over | Nave distrutta | **CARICA** dal tab Riparazione |

---

## 10. Checklist rapida

```
[ ] Cap.1  Bazzano → Crespellano (documenti)
[ ] Cap.2  Crespellano → Calcara (frammento) + pedaggio
[ ] Cap.3  Monteveglio → 3 kill Calcara
[ ] Cap.4  Suborbita → Savigno → tartufi ×3
[ ] Cap.5  Bazzano → frammenti ×3
[ ] Cap.6  Space Hulk → Bazzano → Castelletto (documenti)
[ ] Cap.7  Castelletto → 3 kill pirata
[ ] Cap.8  Bazzano → piadine → FINALE
```

**Build minima pre-Cap.3:** scafo rinforzato + doppio cannone (o più armi in cantiere).  
**Build minima pre-Cap.7:** scudo energetico + missili consigliati.

---

## Tabella ricompense storia

| Cap. | ₡ | Note rep |
|------|---|----------|
| 1 | 500 | Bazzano +15 |
| 2 | 700 | Crespellano +12 · Calcara −5 |
| 3 | 900 | Monteveglio +20 · Calcara −25 |
| 4 | 600 | Savigno +25 |
| 5 | 2000 | Multi-fazione · Calcara −30 |
| 6 | 1100 | Bazzano +10 |
| 7 | 1400 | Bazzano +12 · Savigno +8 |
| 8 | 2500 | Multi-fazione |

**Totale missioni storia (solo reward base):** ~10 700 ₡ (oltre commercio, abbordaggi, intercetti).

---

*Guida allineata al codice di campagna in `valsaelite.html` e `js/story-sys.js`.*
