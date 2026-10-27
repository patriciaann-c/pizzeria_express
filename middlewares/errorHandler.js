export default function errorHandler(error, req, res, next) {
    console.error('Errore interno del server:', error);
    res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
        message: error.message || 'Si è verificato un errore sul server della Pizzeria.'
    });
}