const Customer = require("../models/customer.model.js");
const validate = require("../middleware/validate.js");
const { wrap } = require("./customer.routes.js");

module.exports = app => {
  app.get("/customer/:customerId", validate.id, wrap(async (req, res) => {
    const data = await Customer.findById(req.params.customerId);
    if (!data) return res.status(404).send("Customer not available.");
    res.render("customer", { data: data });
  }));

  app.get("/listCustomers", wrap(async (req, res) => {
    res.render("listCustomers", { data: await Customer.getAll() });
  }));
};
