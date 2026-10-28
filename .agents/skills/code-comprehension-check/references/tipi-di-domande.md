# Banco di pattern per tipo di elemento di codice

Usa questi pattern come punto di partenza, non come copione fisso: adattali sempre al codice reale che hai letto. Ogni pattern è utile per attaccare un elemento da un angolo diverso — utile quando ti accorgi di ripetere sempre lo stesso tipo di domanda ("a cosa serve X?") e vuoi variare registro.

## Funzioni

- **Scopo nel sistema**: "Questa funzione viene chiamata da [altro punto del codice] — cosa deve garantire perché chi la chiama funzioni correttamente?"
- **Perché così e non altrimenti**: "Perché qui è stato usato [pattern/struttura] invece di [alternativa plausibile]?"
- **Caso limite**: "Cosa restituisce/fa questa funzione se [input vuoto / null / valore estremo]? Il codice lo gestisce esplicitamente o no?"
- **Rottura mirata**: "Se cambiassi [riga specifica] in [variante], cosa smetterebbe di funzionare, e dove se ne accorgerebbe l'utente?"

## Condizionali e branching

- **Copertura dei casi**: "Quali sono tutti i percorsi possibili in questo `if/else`? C'è un caso che il codice non gestisce?"
- **Ordine delle condizioni**: "Perché questa condizione è controllata prima delle altre? Cosa cambierebbe scambiandone l'ordine?"

## Gestione errori

- **Propagazione**: "Se questa funzione lancia un'eccezione, chi la intercetta? Cosa vede l'utente finale in quel caso?"
- **Silenziamento**: "Questo blocco `catch` è vuoto/logga soltanto — è una scelta voluta o un errore ingoiato senza motivo?"
- **Confine di fiducia**: "Questo dato arriva da input esterno (utente, rete, file). Dove viene validato, se viene validato?"

## Strutture dati e stato

- **Ciclo di vita**: "Chi crea questa struttura, chi la modifica, chi la legge? Segui il percorso di un valore da un capo all'altro."
- **Mutabilità**: "Questo oggetto/array viene mutato in place o si crea una copia? Che differenza farebbe l'altra scelta?"
- **Invariante implicita**: "Cosa deve essere sempre vero su questa struttura perché il resto del codice funzioni? Dove viene garantito?"

## Flusso asincrono (callback, promise, async/await)

- **Ordine di esecuzione**: "Cosa viene eseguito prima e cosa dopo in questo blocco? C'è una race condition possibile?"
- **Gestione del fallimento**: "Se questa `fetch`/query fallisce, cosa succede al resto della funzione? Il flusso continua, si blocca, o propaga l'errore?"
- **Perché asincrono qui**: "Perché questa operazione è asincrona? Cosa succederebbe se fosse sincrona?"

## API / endpoint

- **Contratto**: "Cosa si aspetta questo endpoint in input, e cosa garantisce in output? Dove è verificato che l'input rispetti il contratto?"
- **Stato HTTP**: "Perché questa risposta usa questo status code e non un altro plausibile?"
- **Effetti collaterali**: "Questa richiesta modifica solo la risposta o anche uno stato persistente (database, file, cache)? Dove avviene la scrittura?"

## Configurazione e dipendenze

- **Motivazione della scelta**: "Perché il progetto usa questa libreria/opzione di configurazione invece dell'alternativa più comune?"
- **Impatto di una modifica**: "Se cambiassi questo valore di configurazione, cosa smetterebbe di funzionare o si comporterebbe diversamente?"

## Scala di difficoltà

Quando la risposta a una domanda "cosa fa" è solida, sali di livello in quest'ordine (approssimativo, adatta al contesto):

1. **Cosa fa** questo codice (comprensione letterale)
2. **Perché** è scritto così (scelta di design, motivazione)
3. **Cosa succede se** cambia un input o una condizione (ragionamento su casi limite)
4. **Cosa si romperebbe** con una modifica specifica (comprensione delle dipendenze/effetti a catena)
5. **Come lo avresti scritto tu** o confronto con un'alternativa (comprensione critica, non solo descrittiva)

Questi livelli si collegano ai tre livelli di difficoltà definiti in `SKILL.md`:

| Difficoltà | Livelli usati prevalentemente |
|---|---|
| Facile | 1-2, con qualche incursione nel 3 |
| Media | 2-3, con qualche incursione nel 4 |
| Difficile | 3-5, privilegiando 4-5 |
