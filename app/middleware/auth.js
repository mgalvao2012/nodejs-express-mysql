require("dotenv").config({ quiet: true });
const crypto = require("crypto");

const API_KEY = process.env.API_KEY;

// fail closed: never run with the API unprotected
if (!API_KEY) {
  throw new Error("API_KEY is not set. Define it in .env before starting the server.");
}

// hash both sides so timingSafeEqual gets equal-length buffers
const digest = value => crypto.createHash("sha256").update(String(value)).digest();
const expected = digest(API_KEY);
const isValid = key => key != null && crypto.timingSafeEqual(digest(key), expected);

// accepts X-API-Key (API clients) or HTTP Basic with the key as password (browser views)
const basicPassword = header => {
  if (!header || !header.startsWith("Basic ")) return null;
  const decoded = Buffer.from(header.slice(6), "base64").toString();
  return decoded.slice(decoded.indexOf(":") + 1);
};

module.exports = (req, res, next) => {
  if (isValid(req.get("X-API-Key")) || isValid(basicPassword(req.get("Authorization")))) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="customers"');
  res.status(401).send({ message: "Unauthorized" });
};
