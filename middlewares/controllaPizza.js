export default function controllaPizza(req, res, next) {
    const body = req.body;
    if (!body || typeof body !== 'object') {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Il corpo della richiesta è vuoto o non valido.'
        });
    }

    const pizzaName = body.name || body.nome;
    const pizzaPrice = body.price !== undefined ? body.price : body.prezzo;
    const pizzaIngredients = body.ingredients || body.ingredienti;

    if (!pizzaName || typeof pizzaName !== 'string' || pizzaName.trim() === '') {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Il nome della pizza è obbligatorio.'
        });
    }

    if (pizzaPrice !== undefined && (isNaN(Number(pizzaPrice)) || Number(pizzaPrice) <= 0)) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Il prezzo deve essere un numero positivo.'
        });
    }

    if (pizzaIngredients && typeof pizzaIngredients !== 'string') {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Gli ingredienti devono essere forniti in formato testuale.'
        });
    }

    next();
}
