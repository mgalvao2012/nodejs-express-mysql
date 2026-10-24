const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config.js");

const pool = mysql.createPool({
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

module.exports = pool;
