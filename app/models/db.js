const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config.js");

let pool = null;

// default (Node): lazy pool, so a runtime that injects its own query never opens it
let runQuery = (sql, values) => {
  pool ??= mysql.createPool({
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });
  return pool.query(sql, values);
};

module.exports = {
  query: (sql, values) => runQuery(sql, values),
  // Cloudflare Workers: inject a connection-per-query via Hyperdrive (see CLAUDE.md)
  setQuery: fn => {
    runQuery = fn;
  },
  end: () => (pool ? pool.end() : Promise.resolve())
};
