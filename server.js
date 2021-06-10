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

app.get("/erp", (req, res) => {
	res.render('erp', {data: []});
});
  

require("./app/routes/customer.routes.js")(app);

// create ejs
var engine = require('ejs-locals');
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views','./app/views');

var getJSON = require('get-json')
app.get('/erp/:customerId', function(req, res){  
	getJSON(req.protocol + '://' + req.get('host') + '/customers/'+req.params.customerId, function(error, response){
	  res.render('erp', {data: response});
	})
});

app.get('/listarClientesERP', function(req, res){  
	getJSON(req.protocol + '://' + req.get('host') + '/customers', function(error, response){
	  res.render('listarDados', {data: response});
	})
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


