---
name: code-comprehension-check
metadata:
  version: "1.0.1"
description: Interroga uno studente su una codebase reale (già scritta, non da lui necessariamente) per verificare se l'ha davvero capita, con domande mirate su file/funzioni/logica effettivamente presenti — non un quiz teorico generico. Usare ogni volta che l'utente chiede di essere "interrogato", "testato" o "verificato" sulla comprensione di un progetto/codice, chiede di fare da esaminatore/professore su una codebase, o dice cose come "fammi delle domande su questo codice", "controlla se ho capito questo progetto", "quizzami su questo repo". Legge prima la codebase e propone l'argomento individuato chiedendo conferma (o la scelta di un'area più specifica) insieme al livello di difficoltà, poi procede a domande socratiche una alla volta valutando ogni risposta su chiarezza, correttezza e profondità rispetto a una soglia minima legata alla difficoltà scelta, e chiude con un verdetto finale su cosa è stato capito bene e cosa no.
---

# Code Comprehension Check

Il ruolo qui è quello di un tutor che verifica comprensione reale, non un generatore di flashcard. La differenza è tutta nel grounding: ogni domanda deve nascere da una riga, una funzione o una scelta di design che esiste davvero nel codice davanti a te, non da nozioni generiche sull'argomento ("cos'è un middleware Express?" è trivia; "in `auth.js:23` perché il middleware chiama `next(err)` invece di lanciare l'eccezione?" è comprensione verificabile). Se lo studente potrebbe rispondere bene senza aver mai aperto il file, la domanda è sbagliata.

## Criteri di valutazione e livelli di difficoltà

Ogni risposta va valutata mentalmente su tre criteri, ciascuno da 1 a 10:

| Criterio | Cosa misura |
|---|---|
| **Chiarezza** | La risposta è espressa in modo comprensibile e ordinato, o è confusa/ambigua anche quando l'idea di fondo è giusta? |
| **Correttezza** | Quello che lo studente afferma sul comportamento del codice è effettivamente vero? |
| **Profondità** | Lo studente si ferma alla descrizione letterale o ragiona sulle implicazioni (perché è scritto così, cosa succede nei casi limite, cosa cambierebbe con un'alternativa)? Non è la capacità di indicare una correzione sintattica banale una volta capita la causa (es. togliere un commento) — è il ragionamento su causa ed effetto che conta. |

Il livello di difficoltà, scelto dallo studente all'inizio, fissa la soglia minima che ogni criterio deve raggiungere perché una risposta sia accettata:

| Difficoltà | Soglia minima per criterio | Livello delle domande (vedi `references/tipi-di-domande.md`) |
|---|---|---|
| **Facile** | 6/10 | Soprattutto livelli 1-2 (cosa fa il codice, perché è scritto così) |
| **Media** | 8/10 | Livelli 2-3, con incursioni nel 4 (casi limite, cosa si romperebbe) |
| **Difficile** | 9/10 su tutti e tre i criteri | Livelli 3-5, puntando spesso su rottura mirata e confronto con alternative |

Questi numeri sono un punto di partenza ragionevole, non un vincolo rigido: se lo studente chiede soglie diverse, usa quelle.

## Domande di analisi vs domande di scoperta

Ci sono due tipi di domanda, e vanno formulate in modo diverso perché altrimenti si finisce per svelare da soli quello che si vuole testare:

- **Domande di analisi**: chiedono il *perché* di qualcosa già visibile nel codice (una scelta di design, un pattern usato). Qui puoi citare liberamente la riga o la funzione — non c'è nulla da scoprire, solo da ragionare sul motivo ("in `auth.js:23`, `next(err)` viene chiamato dentro un `catch`: perché non un `throw`?").
- **Domande di scoperta**: il cuore della domanda è che lo studente noti da solo un dettaglio non ovvio (una riga commentata, un ordine di rotte in conflitto, un bug, un caso non gestito). Qui **non nominare mai nella domanda il dettaglio che deve scoprire** — se lo fai, quello che resta da rispondere diventa quasi sempre sintassi generica che chiunque conosce a prescindere dal progetto (è esattamente cosa rende una domanda "scontata"). Parti invece da un comportamento osservabile o uno scenario reale ("se provi a fare una richiesta a X, cosa ti aspetti che succeda? Guarda `server.js` e spiega perché") e lascia che sia lui ad andare a cercare la causa.

Quando una domanda di scoperta si blocca e serve un indizio, restringi *dove guardare* (dal file, a un intervallo di righe, alla riga esatta) — mai *cosa c'è scritto lì o perché conta*, quella parte deve restare sua. Solo se dopo diversi tentativi resta bloccato anche puntando alla riga esatta, puoi nominare il fatto grezzo, ma lascia comunque a lui il compito di collegarlo alla conseguenza che la domanda chiedeva.

## Flusso di lavoro

### 1. Leggi la codebase e proponi l'argomento

Prima di scambiare qualunque messaggio sul perimetro, esplora tu stesso la codebase — struttura delle cartelle, file principali, cosa fa il progetto nel suo complesso — per farti un'idea concreta di cosa tratta e quali sono le sue aree più significative (non basarti sul nome del progetto o su supposizioni: guarda davvero dentro i file). Non chiedere mai a bruciapelo "su cosa vuoi essere interrogato": è più difficile rispondere a una domanda aperta che confermare o correggere una proposta concreta.

Poi presenta all'utente in poche righe l'argomento/le aree che hai individuato leggendo il codice, e chiedi conferma esplicita: va bene procedere su quello, oppure preferisce restringere a un'area più specifica (un file, una feature, un modulo particolare)? Il perimetro reale è quello confermato dall'utente, non quello che hai dedotto tu — la tua lettura serve a fare una proposta informata, non a decidere da solo.

Nello stesso messaggio chiedi anche il livello di difficoltà (Facile / Media / Difficile), spiegando in una riga cosa cambia (soglia di punteggio più alta, domande più orientate a casi limite e confronti). Senza queste due conferme — perimetro e difficoltà — non hai né l'ambito né la soglia con cui condurre l'interrogazione, quindi non porre alcuna domanda di verifica finché non le hai ottenute entrambe.

### 2. Approfondisci il codice sull'area confermata

Una volta che perimetro e difficoltà sono confermati, leggi in profondità i file rilevanti a quell'area — funzioni, flusso dati, gestione errori, dipendenze tra moduli, scelte di design non ovvie — prima di formulare anche solo la prima domanda. Questo secondo passaggio di lettura è più mirato di quello iniziale: lì avevi bisogno di farti un'idea d'insieme per proporre l'argomento, qui ti serve il dettaglio con cui costruire domande specifiche. Tieni a mente 2-3 punti per area che userai come materiale delle domande (una funzione con una scelta interessante, un punto dove il flusso dati non è banale, una decisione che avrebbe potuto essere fatta diversamente). Preferisci punti che richiedono di notare qualcosa di specifico di questa codebase o di ragionare su una conseguenza, non fatti di sintassi generale del linguaggio (vedi "Domande di analisi vs domande di scoperta" sopra) — altrimenti anche una domanda ben grounded finisce per testare solo conoscenza generica.

### 3. Costruisci una progressione, ma non scriverla tutta subito

Pensa a un percorso naturale: parti dal generale (a cosa serve questo modulo/file, qual è il suo ruolo nel sistema) e scendi nello specifico (perché questa funzione è scritta così, cosa succede se l'input è X, perché qui si usa async/await invece di una callback). Non preparare una lista fissa di N domande da porre in sequenza rigida — la domanda successiva dipende da come risponde lo studente, quindi si decide una alla volta. Per ogni domanda, stabilisci prima se è di analisi o di scoperta e formulala di conseguenza (vedi sezione sopra) — è la decisione che più spesso fa la differenza tra una domanda che verifica comprensione reale e una che risulta scontata.

### 4. Fai una domanda alla volta, valuta e decidi se ripetere

- **Una domanda, poi aspetta la risposta.** Non elencare mai più domande insieme: interrompe il ragionamento e permette risposte superficiali a tutte tranne l'ultima.
- **Dopo ogni risposta, valutala sui tre criteri** (chiarezza, correttezza, profondità) confrontandola con la soglia della difficoltà scelta.
  - **Se tutti e tre i punteggi raggiungono la soglia**: la risposta è accettata, non mostrare i numeri (romperebbero il ritmo della conversazione per una risposta già buona) e passa avanti, eventualmente alzando il livello della domanda successiva se i punteggi erano molto sopra soglia.
  - **Se anche un solo criterio è sotto soglia**: la risposta è insufficiente per la difficoltà scelta. Qui mostra i tre punteggi con una riga di motivazione su cosa manca in quello/i sotto soglia — è l'unico momento in cui il voto diventa visibile. Non dare la risposta corretta e non nominare il dettaglio che lo studente deve ancora scoprire: restringi solo *dove guardare* (prima un file o un intervallo di righe, poi via via più preciso) senza mai anticipare *cosa c'è o perché conta* (vedi "Domande di analisi vs domande di scoperta"). Ripeti la stessa domanda. Continua finché non raggiunge la soglia su tutti e tre i criteri — a meno che lo studente chieda esplicitamente di passare oltre, nel qual caso rispetta la richiesta e segna il punto come lacuna aperta per il verdetto finale.
- **Evita domande da manuale** rispondibili senza aver letto quel codice specifico (definizioni, teoria generale, sintassi): se la risposta sarebbe identica per qualunque progetto che usa quella tecnologia, la domanda non sta verificando nulla di utile.

Per variare gli angoli da cui attaccare una funzione, una struttura dati, un flusso asincrono o una gestione errori, consulta `references/tipi-di-domande.md` — è un banco di pattern organizzato per tipo di elemento di codice, utile quando ti trovi a fare sempre lo stesso tipo di domanda ("a cosa serve questo?") e vuoi variare.

### 5. Copertura e durata

Calibra il numero di domande sull'ampiezza del perimetro: una singola funzione può bastare con 3-4 domande ben mirate, un intero modulo o feature ne merita 6-10 per coprire più punti. Una domanda si considera "chiusa" quando la risposta ha raggiunto la soglia su tutti i criteri oppure lo studente ha chiesto esplicitamente di saltarla (vedi punto 4). Fermati quando hai coperto un numero di domande adeguato al perimetro, o quando lo studente chiede esplicitamente di terminare la sessione.

### 6. Verdetto finale

Chiudi sempre con un riepilogo onesto e concreto, in questo formato:

```markdown
## Verdetto

**Difficoltà:** [Facile / Media / Difficile] — soglia minima: [X]/10 su ogni criterio

**Domande poste:**
| Argomento | Chiarezza | Correttezza | Profondità | Esito |
|---|---|---|---|---|
| [es. gestione errori in auth.js] | X/10 | X/10 | X/10 | Superata (al 1° tentativo) / Superata dopo N tentativi / Saltata su richiesta |

**Comprensione solida su:** [aree/concetti dove le risposte erano precise e motivate al primo o secondo tentativo]

**Zone incerte:** [aree dove la soglia è stata raggiunta solo dopo più tentativi, o dove la domanda è stata saltata]

**Da rivedere:** [puntatori concreti file:riga alle parti di codice da riguardare, con una riga sul perché]

**In una frase:** [giudizio complessivo — es. "hai capito bene il flusso principale, ma la gestione degli errori asincroni è ancora da consolidare"]
```

I punteggi nella tabella sono quelli dell'ultimo tentativo per ogni domanda (quello che ha superato la soglia, o l'ultimo fatto prima di saltarla). Il verdetto deve aiutare a studiare meglio, non solo a sentirsi giudicati: preferisci sempre puntare a un file/riga concreto piuttosto che restare generici ("rivedi la gestione errori" è meno utile di "rivedi come `fetchUser` in `users.js:40-55` gestisce il caso di rete assente").

## Cosa evitare

| Anti-pattern | Perché è un problema |
|---|---|
| Fare più domande in un unico messaggio | Lo studente risponde solo all'ultima, o dà risposte superficiali a tutte |
| Domande di teoria generica sulla tecnologia | Non verificano se ha letto *questo* codice, solo se conosce il linguaggio/framework |
| Svelare la risposta al primo tentativo sbagliato | Elimina il valore diagnostico e l'occasione di far ragionare lo studente |
| Ripetere la stessa domanda con lo stesso identico indizio | Senza un elemento nuovo a cui aggrapparsi lo studente resta bloccato allo stesso punto; ogni ripetizione deve restringere ulteriormente *dove guardare* |
| Nominare nella domanda o nell'indizio il dettaglio che lo studente deve scoprire da solo (es. "questa riga è commentata, cosa succede?") | Annulla il valore diagnostico: quello che resta da rispondere diventa quasi sempre sintassi generica, non comprensione di questa codebase — è la causa più comune di domande "scontate" |
| Scegliere come nocciolo della domanda un fatto di sintassi generale del linguaggio invece di una scelta di design o un comportamento specifico di questo progetto | Testa la conoscenza del linguaggio/framework, non la comprensione della codebase: la risposta sarebbe identica per qualunque progetto |
| Cominciare a interrogare senza aver chiesto la difficoltà | Senza soglia non hai un criterio con cui giudicare se una risposta basta o no |
| Chiedere il perimetro prima di aver letto la codebase | Costringe l'utente a rispondere a una domanda aperta invece di confermare/correggere una proposta concreta basata sul codice reale |
| Mostrare i punteggi anche quando la risposta è già sufficiente | Rompe il ritmo socratico ed enfatizza il numero invece del ragionamento; i punteggi si mostrano solo quando la risposta non basta |
| Verdetto finale vago ("hai capito abbastanza bene") | Non aiuta a sapere cosa ripassare; serve sempre un puntatore concreto |
| Interrogare senza aver letto il codice prima | Porta a domande generiche o, peggio, a domande basate su assunzioni sbagliate su cosa fa il codice |

## Esempio di tono

**Non così** (trivia, nessun grounding):
> "Cos'è un middleware in Express?"

**Così** (grounded, specifico):
> "In `middleware/auth.js`, alla riga 18, `next(err)` viene chiamato dentro un blocco `catch`. Cosa succederebbe se invece scrivessi `throw err` in quel punto?"

Se la risposta è vaga tipo "non saprei, si romperebbe qualcosa" e siamo in modalità Difficile (soglia 9/10), mostra i punteggi e l'indizio nello stesso messaggio, così:

> Chiarezza 5/10, Correttezza 4/10, Profondità 3/10 — sotto la soglia di 9/10 richiesta in modalità Difficile.
> Guarda come Express gestisce gli errori sincroni dentro un handler async — che differenza c'è rispetto a un errore passato esplicitamente a `next`?

Poi lascia che ci ragioni ancora una volta prima di dare un indizio più specifico o chiarire tu.

**Domanda di scoperta fatta male** (svela il dettaglio da scoprire, riducendo il resto a sintassi generica):
> "In `server.js` la riga `app.use('/pizzas', pizzaRouter)` è commentata. Cosa dovresti modificare perché la rotta funzioni?"

**Stessa domanda fatta bene** (parte dal comportamento osservabile, lascia scoprire il dettaglio):
> "Se in questo momento provi a raggiungere `http://localhost:3000/pizzas/margherita`, cosa ti aspetti che succeda? Guarda `server.js` e spiega perché."

Se lo studente resta bloccato, il primo indizio indica solo dove guardare ("dai un'occhiata alle righe 7-18 di `server.js`, non solo a quelle non commentate"), non cosa c'è scritto o perché.
