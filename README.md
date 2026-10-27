# 🍕 Pizzeria Express

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-68a063?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-00758f?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![pnpm](https://img.shields.io/badge/pnpm-11.x-f69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

> Un'applicazione backend e API RESTful completa per la gestione del menù di una pizzeria artigianale, sviluppata in **Node.js** con il framework **Express 5** e persistenza dati su **MySQL**.

---

## 📖 Indice

- [Caratteristiche Principali](#-caratteristiche-principali)
- [Stack Tecnologico](#-stack-tecnologico)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Prerequisiti](#-prerequisiti)
- [Installazione e Configurazione](#-installazione-e-configurazione)
- [Configurazione Database MySQL](#-configurazione-database-mysql)
- [Avvio dell'Applicazione](#-avvio-dellapplicazione)
- [Documentazione API](#-documentazione-api)
  - [Rotte Principali (CRUD)](#-rotte-principali-crud)
  - [Filtri e Ricerca (Query String)](#-filtri-e-ricerca-query-string)
  - [Esempi di Payload JSON](#-esempi-di-payload-json)
- [Middleware & Gestione Errori](#-middleware--gestione-errori)
- [Autore](#-autore)

---

## ✨ Caratteristiche Principali

- 🍕 **CRUD Completo delle Pizze**: Creazione, lettura, aggiornamento completo (`PUT`), modifica parziale (`PATCH`) ed eliminazione (`DELETE`).
- 🔍 **Ricerca Dinamica e Filtri**: Ricerca avanzata per nome, ingrediente o stato di disponibilità sia via API che tramite interfaccia web.
- 🎨 **Dashboard Web Integrata**: Pagina principale responsive in dark mode (`/`) con riepilogo delle rotte e form di ricerca live.
- 🛡️ **Validazione Robusta**: Middleware custom (`controllaPizza`) per verificare l'integrità dei dati prima di ogni inserimento o aggiornamento.
- ⚡ **Gestione Errori Centralizzata**: Risposte JSON uniformi per risorse non trovate (`404 Not Found`) ed errori di sistema (`500 Internal Server Error`).
- 🌐 **Flessibilità Multilingua**: Supporto sia ai campi in italiano (`nome`, `prezzo`, `ingredienti`) che in inglese (`name`, `price`, `ingredients`).
- 📁 **File Statici**: Servizio delle immagini del menù tramite `express.static`.

---

## 🛠️ Stack Tecnologico

- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework Web**: [Express 5](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/) tramite driver [mysql2](https://github.com/sidorares/node-mysql2)
- **Variabili d'Ambiente**: [dotenv](https://github.com/motdotla/dotenv)
- **Package Manager**: [pnpm](https://pnpm.io/) (compatibile anche con `npm` e `yarn`)

---

## 📁 Struttura del Progetto

```plaintext
pizzeria_express/
├── data/
│   └── db.js                 # Configurazione e connessione a MySQL tramite pool/connection
├── database/
│   ├── schema.sql            # Struttura della tabella 'pizzas'
│   └── seed.sql              # Dati di prova iniziali (10 pizze classiche)
├── middlewares/
│   ├── controllaPizza.js     # Validazione corpo richiesta (nome, prezzo, ingredienti)
│   ├── errorHandler.js       # Middleware globale per la gestione degli errori 500
│   └── notFound.js           # Middleware per la gestione delle rotte non trovate 404
├── public/                   # Asset statici (immagini delle pizze)
│   ├── img.jpg
│   └── pizza.jpg
├── routers/
│   └── pizzas.js             # Definizione delle rotte e controller CRUD per le pizze
├── .env.example              # Template per le variabili d'ambiente
├── .gitignore                # File esclusi dal versionamento Git
├── app.js                    # Entry point e configurazione del server Express
├── package.json              # Dipendenze e script di esecuzione
└── README.md                 # Documentazione del progetto
```

---

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato sulla tua macchina:
- **Node.js** (v18.x o superiore)
- **MySQL Server** (v8.x o MariaDB) o uno stack come XAMPP / MAMP
- Un gestore pacchetti come **pnpm**, **npm** o **yarn**

---

## 🚀 Installazione e Configurazione

1. **Clona la repository**:
   ```bash
   git clone https://github.com/patriciaann-c/pizzeria_express.git
   cd pizzeria_express
   ```

2. **Installa le dipendenze**:
   ```bash
   pnpm install
   # oppure
   npm install
   ```

3. **Configura le variabili d'ambiente**:
   Copia il file `.env.example` in un nuovo file `.env`:
   ```bash
   cp .env.example .env
   ```

   Modifica i parametri del file `.env` con i dettagli della tua installazione MySQL:
   ```env
   DB_HOSTNAME=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=latuapassword
   DB_DATABASE=pizzeria
   PORT=3000
   ```

---

## 🗄️ Configurazione Database MySQL

Per creare il database e popolare la tabella con le pizze di esempio, puoi eseguire gli script SQL forniti:

### Tramite CLI MySQL:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p pizzeria < database/seed.sql
```

### Tramite MySQL Workbench o phpMyAdmin:
1. Apri ed esegui `database/schema.sql` per creare il database `pizzeria` e la tabella `pizzas`.
2. Apri ed esegui `database/seed.sql` per inserire il menù iniziale (Margherita, Marinara, Diavola, Bufalina, ecc.).

---

## 💻 Avvio dell'Applicazione

### Modalità Sviluppo (con auto-reload):
```bash
pnpm dev
# oppure
npm run dev
```

### Modalità Produzione:
```bash
pnpm start
# oppure
npm start
```

Il server sarà accessibile all'indirizzo:
👉 **`http://localhost:3000`**

---

## 📡 Documentazione API

### 🧭 Rotte Principali (CRUD)

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/` | Dashboard web interattiva con menù e form di ricerca |
| `GET` | `/pizzas` | Restituisce la lista di tutte le pizze (con filtri opzionali) |
| `GET` | `/pizzas/:id` | Restituisce i dettagli di una singola pizza specificata dall'ID |
| `POST` | `/pizzas` | Inserisce una nuova pizza nel menù |
| `PUT` | `/pizzas/:id` | Aggiorna integralmente i dati di una pizza esistente |
| `PATCH` | `/pizzas/:id` | Aggiorna selettivamente uno o più campi di una pizza |
| `DELETE` | `/pizzas/:id` | Rimuove una pizza dal menù |
| `GET` | `/api/pizzas` | Endpoint rapido JSON per integrazioni frontend |
| `GET` | `/ricerca` | Ricerca rapida HTML/JSON (`?termine=margherita`) |

---

### 🔍 Filtri e Ricerca (Query String)

L'endpoint `GET /pizzas` supporta parametri di filtro per affinare i risultati:

- **Ricerca testuale** (nome o ingredienti):
  ```http
  GET /pizzas?search=diavola
  ```
- **Filtro per ingrediente**:
  ```http
  GET /pizzas?ingrediente=mozzarella
  ```
- **Filtro per disponibilità**:
  ```http
  GET /pizzas?available=1
  ```

I filtri possono essere combinati liberamente:
```http
GET /pizzas?ingrediente=pomodoro&available=1
```

---

### 📦 Esempi di Payload JSON

#### ➕ Creazione Pizza (`POST /pizzas`)

**Headers:**
```http
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Quattro Formaggi Special",
  "price": 10.50,
  "ingredients": "mozzarella fior di latte, gorgonzola DOP, taleggio, noci e miele",
  "image": "/img/quattro-formaggi.jpg",
  "available": 1
}
```

*Nota: Sono accettati indistintamente i campi in italiano (`nome`, `prezzo`, `ingredienti`, `immagine`, `disponibile`) o in inglese (`name`, `price`, `ingredients`, `image`, `available`).*

**Risposta di successo (201 Created):**
```json
{
  "status": 201,
  "message": "Pizza aggiunta al menù con successo!",
  "pizza": {
    "id": 11,
    "name": "Quattro Formaggi Special",
    "price": 10.5,
    "ingredients": "mozzarella fior di latte, gorgonzola DOP, taleggio, noci e miele",
    "image": "/img/quattro-formaggi.jpg",
    "available": 1
  }
}
```

---

#### ✏️ Modifica Parziale (`PATCH /pizzas/:id`)

Modifica solo il prezzo e la disponibilità della pizza con ID `3`:

```json
{
  "price": 8.50,
  "available": 0
}
```

**Risposta di successo (200 OK):**
```json
{
  "status": 200,
  "message": "Pizza 3 modificata parzialmente con successo!"
}
```

---

#### ❌ Eliminazione Pizza (`DELETE /pizzas/:id`)

**Risposta di successo (200 OK):**
```json
{
  "status": 200,
  "message": "Pizza con ID 3 eliminata con successo dal menù!"
}
```

---

## 🛡️ Middleware & Gestione Errori

- **`controllaPizza`**: Valida che il nome della pizza sia una stringa non vuota e che il prezzo sia un valore numerico strettamente positivo.
- **`notFound` (404)**: Intercetta qualsiasi rotta non definita restituendo:
  ```json
  {
    "status": 404,
    "error": "Not Found",
    "message": "La risorsa richiesta '/rotta-inesistente' non esiste nella Pizzeria!"
  }
  ```
- **`errorHandler` (500)**: Cattura le eccezioni interne e gli errori di query verso il database restituendo un messaggio formattato in sicurezza senza interrompere il processo del server.

---

## 👩‍💻 Autore

Sviluppato con passione da **[patriciaann-c](https://github.com/patriciaann-c)** durante il percorso formativo con Boolean.

---

⭐ *Se questo progetto ti è stato utile o ti piace la pizza, lascia una stellina alla repository!* 🍕
