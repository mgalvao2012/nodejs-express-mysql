const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to nodejs application!" });
});

require("./app/routes/customer.routes.js")(app);

// create ejs
var engine = require('ejs-locals');
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views','./app/views');

const Customer = require("./app/models/customer.model.js");
app.get('/customer/:customerId', function(req, res){
	Customer.findById(req.params.customerId, function(error, data){
	  if (error) return res.status(error.kind === "not_found" ? 404 : 500).send("Customer not available.");
	  res.render('customer', {data: data});
	})
});

app.get('/listCustomers', function(req, res){
	Customer.getAll(function(error, data){
	  if (error) return res.status(500).send("Customers not available.");
	  res.render('listCustomers', {data: data});
	})
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


