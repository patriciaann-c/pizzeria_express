import 'dotenv/config';
import express from 'express';
import pizzasRouter from './routers/pizzas.js';
import controllaPizza from './middlewares/controllaPizza.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import connection from './data/db.js';

// Server Pizzeria Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware per servire file statici dalla cartella public (es. immagini)
app.use(express.static('public'));

// Middleware per il parsing del body JSON (deve trovarsi prima dei router!)
app.use(express.json());

// Logger middleware per monitorare le chiamate in arrivo
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Registrazione del Router per le pizze (supporta sia /pizzas, sia /pizze, sia il vecchio /posts)
app.use('/pizzas', pizzasRouter);
app.use('/pizze', pizzasRouter);
app.use('/posts', pizzasRouter);

// Homepage di benvenuto della Pizzeria
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pizzeria Express - Menù & API</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #121214;
                    color: #f3f4f6;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 2rem 1rem;
                }
                .container {
                    max-width: 900px;
                    width: 100%;
                    background: #1e1e24;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                    border: 1px solid #2d2d38;
                }
                .hero {
                    position: relative;
                    height: 260px;
                    overflow: hidden;
                    display: flex;
                    align-items: flex-end;
                    padding: 2rem;
                }
                .hero img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(0.45);
                }
                .hero-content {
                    position: relative;
                    z-index: 2;
                }
                .hero-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .hero-sub {
                    font-size: 1.1rem;
                    color: #e5e7eb;
                    margin-top: 0.25rem;
                }
                .content {
                    padding: 2rem;
                }
                .badge {
                    display: inline-block;
                    background: #10b981;
                    color: #064e3b;
                    font-weight: 700;
                    font-size: 0.8rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    margin-bottom: 1.5rem;
                }
                h2 {
                    font-size: 1.4rem;
                    margin-bottom: 1rem;
                    color: #f97316;
                    border-bottom: 1px solid #2d2d38;
                    padding-bottom: 0.5rem;
                }
                .routes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .route-card {
                    background: #272732;
                    border: 1px solid #383848;
                    border-radius: 10px;
                    padding: 1.25rem;
                    transition: transform 0.2s, border-color 0.2s;
                }
                .route-card:hover {
                    transform: translateY(-3px);
                    border-color: #f97316;
                }
                .route-method {
                    display: inline-block;
                    font-weight: 700;
                    font-size: 0.75rem;
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    margin-bottom: 0.5rem;
                }
                .method-get { background: #0284c7; color: #fff; }
                .method-post { background: #16a34a; color: #fff; }
                .method-put { background: #d97706; color: #fff; }
                .method-delete { background: #dc2626; color: #fff; }
                .route-path {
                    font-family: monospace;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #38bdf8;
                    text-decoration: none;
                }
                .route-path:hover {
                    text-decoration: underline;
                }
                .route-desc {
                    font-size: 0.85rem;
                    color: #9ca3af;
                    margin-top: 0.35rem;
                }
                .search-box {
                    background: #272732;
                    border-radius: 10px;
                    padding: 1.25rem;
                    margin-bottom: 1.5rem;
                }
                .search-form {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                }
                .search-input {
                    flex: 1;
                    padding: 0.6rem 1rem;
                    border-radius: 8px;
                    border: 1px solid #3f3f50;
                    background: #18181f;
                    color: #fff;
                    font-size: 0.95rem;
                }
                .search-btn {
                    padding: 0.6rem 1.2rem;
                    border-radius: 8px;
                    border: none;
                    background: #f97316;
                    color: #fff;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .search-btn:hover {
                    background: #ea580c;
                }
                footer {
                    text-align: center;
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin-top: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="hero">
                    <img src="/pizza.jpg" alt="Pizzeria Express">
                    <div class="hero-content">
                        <div class="hero-title">🍕 Pizzeria Express</div>
                        <div class="hero-sub">Benvenuti nel gestionale e API della nostra Pizzeria con forno a legna!</div>
                    </div>
                </div>
                <div class="content">
                    <span class="badge">● Database MySQL: Pizzeria [Attivo]</span>

                    <div class="search-box">
                        <h3>🔍 Cerca una pizza per nome o ingrediente:</h3>
                        <form class="search-form" action="/ricerca" method="GET">
                            <input class="search-input" type="text" name="termine" placeholder="Es. Margherita, pomodoro, funghi..." required />
                            <button class="search-btn" type="submit">Cerca</button>
                        </form>
                    </div>

                    <h2>📡 Endpoint API Principali</h2>
                    <div class="routes-grid">
                        <div class="route-card">
                            <span class="route-method method-get">GET</span>
                            <div><a class="route-path" href="/pizzas" target="_blank">/pizzas</a></div>
                            <div class="route-desc">Restituisce tutte le pizze dal database MySQL con filtri opzionali.</div>
                        </div>
                        <div class="route-card">
                            <span class="route-method method-get">GET</span>
                            <div><a class="route-path" href="/pizzas/1" target="_blank">/pizzas/:id</a></div>
                            <div class="route-desc">Mostra i dettagli completi di una singola pizza (es. Pizza ID 1).</div>
                        </div>
                        <div class="route-card">
                            <span class="route-method method-get">GET</span>
                            <div><a class="route-path" href="/api/pizzas" target="_blank">/api/pizzas</a></div>
                            <div class="route-desc">Menù pizze formattato in JSON per applicazioni client e frontend.</div>
                        </div>
                        <div class="route-card">
                            <span class="route-method method-post">POST</span>
                            <div><span class="route-path">/pizzas</span></div>
                            <div class="route-desc">Crea una nuova pizza nel database (con validazione controllaPizza).</div>
                        </div>
                        <div class="route-card">
                            <span class="route-method method-put">PUT</span>
                            <div><span class="route-path">/pizzas/:id</span></div>
                            <div class="route-desc">Modifica totale dei dettagli e prezzo di una pizza.</div>
                        </div>
                        <div class="route-card">
                            <span class="route-method method-delete">DELETE</span>
                            <div><span class="route-path">/pizzas/:id</span></div>
                            <div class="route-desc">Elimina una pizza dal database.</div>
                        </div>
                    </div>
                </div>
            </div>
            <footer>Pizzeria Express &copy; 2026 - Corso Boolean Node/Express</footer>
        </body>
        </html>
    `);
});

// Endpoint JSON veloce per il menù delle pizze
app.get('/api/pizzas', (req, res, next) => {
    const sql = 'SELECT id, name, price, ingredients, image, available FROM pizzas ORDER BY id ASC';
    connection.query(sql, (err, results) => {
        if (err) {
            return next(err);
        }
        res.json({
            status: 200,
            ristorante: 'Pizzeria Express',
            totale_pizze: results.length,
            menu: results
        });
    });
});

// Alias italiano /api/pizze
app.get('/api/pizze', (req, res, next) => {
    res.redirect('/api/pizzas');
});

// Endpoint di ricerca pizza per nome o ingrediente: http://localhost:3000/ricerca?termine=margherita
app.get('/ricerca', (req, res, next) => {
    const termine = req.query.termine || req.query.q || '';
    
    if (!termine.trim()) {
        return res.status(400).send('<h1>Errore</h1><p>Specificare un parametro di ricerca: es. <code>/ricerca?termine=margherita</code></p>');
    }

    const sql = 'SELECT * FROM pizzas WHERE name LIKE ? OR ingredients LIKE ?';
    const param = `%${termine}%`;

    connection.query(sql, [param, param], (err, results) => {
        if (err) {
            return next(err);
        }

        if (req.accepts('html') && !req.xhr) {
            const listHtml = results.length > 0 
                ? results.map(p => `<li><strong>${p.name}</strong> (${Number(p.price).toFixed(2)} &euro;): <em>${p.ingredients}</em></li>`).join('')
                : '<li>Nessuna pizza trovata con questo termine.</li>';

            return res.send(`
                <!DOCTYPE html>
                <html lang="it">
                <head>
                    <meta charset="UTF-8">
                    <title>Risultati ricerca per "${termine}" - Pizzeria Express</title>
                    <style>
                        body { font-family: sans-serif; background: #121214; color: #f3f4f6; padding: 2rem; }
                        a { color: #f97316; text-decoration: none; font-weight: bold; }
                        ul { margin-top: 1rem; line-height: 2; }
                        .card { background: #1e1e24; padding: 2rem; border-radius: 12px; max-width: 600px; margin: 0 auto; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h2>Risultati per: "${termine}" (${results.length} trovate)</h2>
                        <ul>${listHtml}</ul>
                        <br/>
                        <a href="/">&larr; Torna alla Homepage</a> | <a href="/pizzas">Vedi tutte le pizze (JSON)</a>
                    </div>
                </body>
                </html>
            `);
        }

        res.json({
            termine_ricercato: termine,
            totale_trovate: results.length,
            risultati: results
        });
    });
});

// Middleware di gestione rotte non trovate (404)
app.use(notFound);

// Middleware di gestione errori del server (500)
app.use(errorHandler);

// Avvio del server
app.listen(port, () => {
    console.log(`Pizzeria Express attiva su http://localhost:${port}`);
});