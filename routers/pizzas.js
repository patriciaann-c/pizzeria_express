import express from 'express';
import connection from '../data/db.js';
import controllaPizza from '../middlewares/controllaPizza.js';

const router = express.Router();

/**
 * INDEX: Lista di tutte le pizze (con supporto per filtri query)
 * GET /pizzas o GET /pizzas?search=margherita o GET /pizzas?ingrediente=pomodoro
 */
router.get('/', (req, res, next) => {
    const { search, termine, ingrediente, ingredient, available, disponibile } = req.query;

    let sql = 'SELECT * FROM pizzas WHERE 1=1';
    const params = [];

    const searchQuery = search || termine;
    if (searchQuery) {
        sql += ' AND (name LIKE ? OR ingredients LIKE ?)';
        params.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    const ingQuery = ingrediente || ingredient;
    if (ingQuery) {
        sql += ' AND ingredients LIKE ?';
        params.push(`%${ingQuery}%`);
    }

    const isAvailable = available !== undefined ? available : disponibile;
    if (isAvailable !== undefined) {
        sql += ' AND available = ?';
        params.push(isAvailable === 'true' || isAvailable === '1' ? 1 : 0);
    }

    sql += ' ORDER BY id ASC';

    connection.query(sql, params, (err, results) => {
        if (err) {
            return next(err);
        }

        res.json({
            status: 200,
            count: results.length,
            pizzas: results
        });
    });
});

/**
 * SHOW: Dettaglio di una singola pizza
 * GET /pizzas/:id
 */
router.get('/:id', (req, res, next) => {
    const pizzaId = Number(req.params.id);

    if (isNaN(pizzaId)) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'L\'ID della pizza deve essere un numero valido.'
        });
    }

    const sql = 'SELECT * FROM pizzas WHERE id = ?';

    connection.query(sql, [pizzaId], (err, results) => {
        if (err) {
            return next(err);
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Nessuna pizza trovata con l'ID ${pizzaId}.`
            });
        }

        res.json({
            status: 200,
            pizza: results[0]
        });
    });
});

/**
 * STORE: Creazione di una nuova pizza
 * POST /pizzas
 */
router.post('/', controllaPizza, (req, res, next) => {
    const { name, nome, price, prezzo, ingredients, ingredienti, image, immagine, available, disponibile } = req.body;

    const pizzaName = name || nome;
    const pizzaPrice = price !== undefined ? Number(price) : Number(prezzo);
    const pizzaIngredients = ingredients || ingredienti;
    const pizzaImage = image || immagine || '/img/img.jpg';
    const isAvailable = available !== undefined ? available : (disponibile !== undefined ? disponibile : 1);
    const pizzaAvailable = isAvailable === true || isAvailable === 1 || isAvailable === '1' ? 1 : 0;

    const sql = 'INSERT INTO pizzas (name, price, ingredients, image, available) VALUES (?, ?, ?, ?, ?)';
    const params = [pizzaName, pizzaPrice, pizzaIngredients, pizzaImage, pizzaAvailable];

    connection.query(sql, params, (err, result) => {
        if (err) {
            return next(err);
        }

        res.status(201).json({
            status: 201,
            message: 'Pizza aggiunta al menù con successo!',
            pizza: {
                id: result.insertId,
                name: pizzaName,
                price: pizzaPrice,
                ingredients: pizzaIngredients,
                image: pizzaImage,
                available: pizzaAvailable
            }
        });
    });
});

/**
 * UPDATE: Modifica totale di una pizza
 * PUT /pizzas/:id
 */
router.put('/:id', controllaPizza, (req, res, next) => {
    const pizzaId = Number(req.params.id);

    if (isNaN(pizzaId)) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'L\'ID della pizza deve essere un numero valido.'
        });
    }

    const { name, nome, price, prezzo, ingredients, ingredienti, image, immagine, available, disponibile } = req.body;

    const pizzaName = name || nome;
    const pizzaPrice = price !== undefined ? Number(price) : Number(prezzo);
    const pizzaIngredients = ingredients || ingredienti;
    const pizzaImage = image || immagine || '/img/img.jpg';
    const isAvailable = available !== undefined ? available : (disponibile !== undefined ? disponibile : 1);
    const pizzaAvailable = isAvailable === true || isAvailable === 1 || isAvailable === '1' ? 1 : 0;

    const sql = 'UPDATE pizzas SET name = ?, price = ?, ingredients = ?, image = ?, available = ? WHERE id = ?';
    const params = [pizzaName, pizzaPrice, pizzaIngredients, pizzaImage, pizzaAvailable, pizzaId];

    connection.query(sql, params, (err, result) => {
        if (err) {
            return next(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Impossibile modificare: nessuna pizza trovata con l'ID ${pizzaId}.`
            });
        }

        res.json({
            status: 200,
            message: `Pizza con ID ${pizzaId} aggiornata con successo!`,
            pizza: {
                id: pizzaId,
                name: pizzaName,
                price: pizzaPrice,
                ingredients: pizzaIngredients,
                image: pizzaImage,
                available: pizzaAvailable
            }
        });
    });
});

/**
 * MODIFY: Modifica parziale di una pizza
 * PATCH /pizzas/:id
 */
router.patch('/:id', (req, res, next) => {
    const pizzaId = Number(req.params.id);

    if (isNaN(pizzaId)) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'L\'ID della pizza deve essere un numero valido.'
        });
    }

    const body = req.body || {};
    const updates = [];
    const params = [];

    const pizzaName = body.name || body.nome;
    if (pizzaName !== undefined) {
        updates.push('name = ?');
        params.push(pizzaName);
    }

    const pizzaPrice = body.price !== undefined ? body.price : body.prezzo;
    if (pizzaPrice !== undefined) {
        updates.push('price = ?');
        params.push(Number(pizzaPrice));
    }

    const pizzaIngredients = body.ingredients || body.ingredienti;
    if (pizzaIngredients !== undefined) {
        updates.push('ingredients = ?');
        params.push(pizzaIngredients);
    }

    const pizzaImage = body.image || body.immagine;
    if (pizzaImage !== undefined) {
        updates.push('image = ?');
        params.push(pizzaImage);
    }

    const isAvailable = body.available !== undefined ? body.available : body.disponibile;
    if (isAvailable !== undefined) {
        updates.push('available = ?');
        params.push(isAvailable === true || isAvailable === 1 || isAvailable === '1' ? 1 : 0);
    }

    if (updates.length === 0) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Nessun campo valido fornito per la modifica.'
        });
    }

    params.push(pizzaId);
    const sql = `UPDATE pizzas SET ${updates.join(', ')} WHERE id = ?`;

    connection.query(sql, params, (err, result) => {
        if (err) {
            return next(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Impossibile modificare: nessuna pizza trovata con l'ID ${pizzaId}.`
            });
        }

        res.json({
            status: 200,
            message: `Pizza ${pizzaId} modificata parzialmente con successo!`
        });
    });
});

/**
 * DESTROY: Eliminazione di una pizza
 * DELETE /pizzas/:id
 */
router.delete('/:id', (req, res, next) => {
    const pizzaId = Number(req.params.id);

    if (isNaN(pizzaId)) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'L\'ID della pizza deve essere un numero valido.'
        });
    }

    const sql = 'DELETE FROM pizzas WHERE id = ?';

    connection.query(sql, [pizzaId], (err, result) => {
        if (err) {
            return next(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Impossibile eliminare: nessuna pizza trovata con l'ID ${pizzaId}.`
            });
        }

        res.json({
            status: 200,
            message: `Pizza con ID ${pizzaId} eliminata con successo dal menù!`
        });
    });
});

export default router;
