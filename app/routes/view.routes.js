const Customer = require("../models/customer.model.js");
const validate = require("../middleware/validate.js");
const customerView = require("../views/customer.js");
const listCustomersView = require("../views/listCustomers.js");

module.exports = app => {
  app.get("/customer/:customerId", validate.id, async (req, res) => {
    const data = await Customer.findById(req.params.customerId);
    if (!data) return res.status(404).send("Customer not available.");
    res.send(customerView(data));
  });

  app.get("/listCustomers", async (req, res) => {
    res.send(listCustomersView(await Customer.getAll()));
  });
};
