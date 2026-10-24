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

// log only code/message: the full error object carries the SQL with bound values (card data)
const logError = err => console.error("error: ", err.code, err.message);

Customer.create = (newCustomer, result) => {
  sql.query("INSERT INTO customers SET ?", newCustomer, (err, res) => {
    if (err) {
      logError(err);
      result(err, null);
      return;
    }

    console.log("created customer: ", res.insertId);
    result(null, { id: res.insertId, ...newCustomer });
  });
};

Customer.findById = (customerId, result) => {
  sql.query("SELECT * FROM customers WHERE id = ?", [customerId], (err, res) => {
    if (err) {
      logError(err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Customer.getAll = result => {
  sql.query("SELECT * FROM customers", (err, res) => {
    if (err) {
      logError(err);
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Customer.updateById = (id, customer, result) => {
  sql.query(
    "UPDATE customers SET email = ?, name = ?, active = ?, nome_do_cartao = ?, numero_cartao = ?, ccv = ?, data_expiracao = ? WHERE id = ?",
    [customer.email, customer.name, customer.active, customer.nome_do_cartao, customer.numero_cartao, customer.ccv, customer.data_expiracao, id],
    (err, res) => {
      if (err) {
        logError(err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...customer });
    }
  );
};

Customer.remove = (id, result) => {
  sql.query("DELETE FROM customers WHERE id = ?", [id], (err, res) => {
    if (err) {
      logError(err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

Customer.removeAll = result => {
  sql.query("DELETE FROM customers", (err, res) => {
    if (err) {
      logError(err);
      result(err, null);
      return;
    }

    result(null, res);
  });
};

module.exports = Customer;
