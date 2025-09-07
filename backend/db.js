// db.js
const sql = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_NAME,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,                // required for Azure
    trustServerCertificate: false // set true for local dev only if needed
  }
};

// Create and export a single pool promise
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ MSSQL Connected');
    return pool;
  })
  .catch(err => {
    console.error('❌ MSSQL Connection Failed', err);
    throw err;
  });

module.exports = { sql, poolPromise };
