const Customer = require("../models/customer.model.js");

const notFound = (res, id) =>
  res.status(404).send({ message: `Not found Customer with id ${id}.` });

// Create and Save a new Customer (body validated by middleware/validate.js)
exports.create = async (req, res) => {
  const data = await Customer.create(new Customer(req.customer));
  res.status(201).send(data);
};

// Retrieve all Customers from the database.
exports.findAll = async (req, res) => {
  res.send(await Customer.getAll());
};

// Find a single Customer with a customerId
exports.findOne = async (req, res) => {
  const data = await Customer.findById(req.params.customerId);
  if (!data) return notFound(res, req.params.customerId);
  res.send(data);
};

// Update a Customer identified by the customerId in the request
exports.update = async (req, res) => {
  const data = await Customer.updateById(req.params.customerId, new Customer(req.customer));
  if (!data) return notFound(res, req.params.customerId);
  res.send(data);
};

// Delete a Customer with the specified customerId in the request
exports.delete = async (req, res) => {
  const deleted = await Customer.remove(req.params.customerId);
  if (!deleted) return notFound(res, req.params.customerId);
  res.send({ message: `Customer was deleted successfully!` });
};

// Delete all Customers from the database.
exports.deleteAll = async (req, res) => {
  await Customer.removeAll();
  res.send({ message: `All Customers were deleted successfully!` });
};
