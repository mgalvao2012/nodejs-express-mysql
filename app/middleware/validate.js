// limits mirror createTable.sql
const STRING_FIELDS = {
  email: 255,
  name: 255,
  nome_do_cartao: 255,
  numero_cartao: 50,
  ccv: 10,
  data_expiracao: 10
};
const REQUIRED = ["email", "name"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// form posts send strings; normalize to boolean
const toBoolean = value => {
  if (typeof value === "boolean") return value;
  if ([1, "1", "true"].includes(value)) return true;
  if ([0, "0", "false"].includes(value)) return false;
  return undefined;
};

const validateFields = (body, allowed, { partial }) => {
  const errors = [];
  const fields = {};

  for (const key of REQUIRED) {
    if (!partial && body[key] === undefined) errors.push(`${key} is required`);
  }

  for (const key of allowed) {
    const value = body[key];
    if (value === undefined) continue;

    if (value === null) {
      if (REQUIRED.includes(key)) errors.push(`${key} can not be null`);
      else fields[key] = null;
      continue;
    }

    if (key === "active") {
      const active = toBoolean(value);
      if (active === undefined) errors.push("active must be a boolean");
      else fields.active = active;
      continue;
    }

    if (typeof value !== "string" || (REQUIRED.includes(key) && !value.trim())) {
      errors.push(`${key} must be a non-empty string`);
    } else if (value.length > STRING_FIELDS[key]) {
      errors.push(`${key} must be at most ${STRING_FIELDS[key]} characters`);
    } else if (key === "email" && !EMAIL_RE.test(value)) {
      errors.push("email is invalid");
    } else {
      fields[key] = value;
    }
  }

  if (partial && !errors.length && !Object.keys(fields).length) {
    errors.push("No updatable fields provided.");
  }

  return { errors, fields };
};

const reject = (res, errors) => res.status(400).send({ message: "Invalid request", errors });

// create only accepts the basic fields; card data is set via update
exports.create = (req, res, next) => {
  const { errors, fields } = validateFields(req.body || {}, ["email", "name", "active"], { partial: false });
  if (errors.length) return reject(res, errors);
  req.customer = fields;
  next();
};

exports.update = (req, res, next) => {
  const { errors, fields } = validateFields(req.body || {}, ["active", ...Object.keys(STRING_FIELDS)], { partial: true });
  if (errors.length) return reject(res, errors);
  req.customer = fields;
  next();
};

exports.id = (req, res, next) => {
  if (!/^[1-9]\d*$/.test(req.params.customerId)) {
    return reject(res, ["customerId must be a positive integer"]);
  }
  next();
};
