const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/customer.routes.js")(app);

// create ejs
var engine = require('ejs-locals');
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views','./app/views');

var getJSON = require('get-json')
app.get('/protheus/:customerId', function(req, res){  
	getJSON(req.protocol + '://' + req.get('host') + '/customers/'+req.params.customerId, function(error, response){
	  res.render('protheus', {data: response});
	})
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


