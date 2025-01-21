const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306, // Puerto por defecto para MySQL
  ssl: {
    rejectUnauthorized: false, // Esto desactiva la verificación estricta del certificado SSL
  },
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', {
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
  db.end();
});
