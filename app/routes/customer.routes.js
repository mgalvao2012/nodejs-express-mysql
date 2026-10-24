const customers = require("../controllers/customer.controller.js");
const validate = require("../middleware/validate.js");

// Express 5 forwards rejected promises from async handlers to the error handler
module.exports = app => {
  // Create a new Customer
  app.post("/customers", validate.create, customers.create);

  // Retrieve all Customers
  app.get("/customers", customers.findAll);

  // Retrieve a single Customer with customerId
  app.get("/customers/:customerId", validate.id, customers.findOne);

  // Update a Customer with customerId
  app.put("/customers/:customerId", validate.id, validate.update, customers.update);
  app.patch("/customers/:customerId", validate.id, validate.update, customers.update);
  app.post("/customers/:customerId", validate.id, validate.update, customers.update);

  // Delete a Customer with customerId
  app.delete("/customers/:customerId", validate.id, customers.delete);

  // Delete all Customers
  app.delete("/customers", customers.deleteAll);
};
