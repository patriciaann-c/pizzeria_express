export default function notFound(req, res, next) {
    res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: `La risorsa richiesta '${req.originalUrl}' non esiste nella Pizzeria!`
    });
}