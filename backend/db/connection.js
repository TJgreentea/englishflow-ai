const mysql = require("mysql2/promise");

const connectionConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (process.env.DB_SOCKET_PATH) {
  connectionConfig.socketPath = process.env.DB_SOCKET_PATH;
}

const pool = mysql.createPool(connectionConfig);

module.exports = pool;
