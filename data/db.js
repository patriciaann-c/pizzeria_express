import mysql from "mysql2/promise";

const config = {
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) {
        console.error("Errore di connessione a MySQL:", err.message);
    } else {
        console.log(`Connesso con successo al database MySQL: ${config.database}`);
    }
});

export default connection;