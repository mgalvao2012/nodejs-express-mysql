const express = require("express");
const path = require("path");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// create ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to nodejs application!" });
});

// every route registered below requires the API key
app.use(require("./app/middleware/auth.js"));

require("./app/routes/customer.routes.js")(app);
require("./app/routes/view.routes.js")(app);

// log only code/message: DB errors carry the SQL with bound values (card data)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).send({ message: "Malformed request body." });
  }
  console.error("error: ", err.code, err.message);
  res.status(500).send({ message: "Internal server error." });
});

module.exports = app;
