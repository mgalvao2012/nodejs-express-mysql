const customers = require("../controllers/customer.controller.js");
const validate = require("../middleware/validate.js");

// Express 4 does not catch rejected promises; forward them to the error handler
const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);

module.exports = app => {
  // Create a new Customer
  app.post("/customers", validate.create, wrap(customers.create));

  // Retrieve all Customers
  app.get("/customers", wrap(customers.findAll));

  // Retrieve a single Customer with customerId
  app.get("/customers/:customerId", validate.id, wrap(customers.findOne));

  // Update a Customer with customerId
  app.put("/customers/:customerId", validate.id, validate.update, wrap(customers.update));
  app.patch("/customers/:customerId", validate.id, validate.update, wrap(customers.update));
  app.post("/customers/:customerId", validate.id, validate.update, wrap(customers.update));

  // Delete a Customer with customerId
  app.delete("/customers/:customerId", validate.id, wrap(customers.delete));

  // Delete all Customers
  app.delete("/customers", wrap(customers.deleteAll));
};

module.exports.wrap = wrap;
