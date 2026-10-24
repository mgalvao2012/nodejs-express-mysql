const sql = require("./db.js");

// constructor
const Customer = function(customer) {
  this.email = customer.email;
  this.name = customer.name;
  this.active = customer.active;
  this.nome_do_cartao = customer.nome_do_cartao;
  this.numero_cartao = customer.numero_cartao;
  this.ccv = customer.ccv;
  this.data_expiracao = customer.data_expiracao;
};

// only fields present in the request; undefined would be written as NULL
const definedFields = customer =>
  Object.fromEntries(Object.entries(customer).filter(([, v]) => v !== undefined));

Customer.create = async newCustomer => {
  const fields = definedFields(newCustomer);
  const [res] = await sql.query("INSERT INTO customers SET ?", [fields]);
  console.log("created customer: ", res.insertId);
  return Customer.findById(res.insertId);
};

// resolves to null when not found
Customer.findById = async customerId => {
  const [rows] = await sql.query("SELECT * FROM customers WHERE id = ?", [customerId]);
  return rows[0] || null;
};

Customer.getAll = async () => {
  const [rows] = await sql.query("SELECT * FROM customers");
  return rows;
};

// resolves to null when not found
Customer.updateById = async (id, customer) => {
  const [res] = await sql.query("UPDATE customers SET ? WHERE id = ?", [definedFields(customer), id]);
  if (res.affectedRows == 0) return null;
  return Customer.findById(id);
};

// resolves to false when not found
Customer.remove = async id => {
  const [res] = await sql.query("DELETE FROM customers WHERE id = ?", [id]);
  return res.affectedRows > 0;
};

Customer.removeAll = async () => {
  const [res] = await sql.query("DELETE FROM customers");
  return res.affectedRows;
};

module.exports = Customer;
