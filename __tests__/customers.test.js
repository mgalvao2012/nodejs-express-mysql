process.env.API_KEY = "test-key";

// the model is mocked so tests never touch the database
jest.mock("../app/models/customer.model.js", () => {
  const Customer = function(customer) {
    Object.assign(this, customer);
  };
  Object.assign(Customer, {
    create: jest.fn(),
    findById: jest.fn(),
    getAll: jest.fn(),
    updateById: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn()
  });
  return Customer;
});

const request = require("supertest");
const app = require("../app.js");
const Customer = require("../app/models/customer.model.js");

const KEY = { "X-API-Key": "test-key" };
const ana = { id: 1, email: "ana@example.com", name: "Ana", active: 1 };

beforeEach(() => jest.clearAllMocks());

describe("auth", () => {
  test("/ is public", async () => {
    await request(app).get("/").expect(200);
  });

  test("rejects missing or wrong key", async () => {
    await request(app).get("/customers").expect(401);
    await request(app).get("/customers").set("X-API-Key", "wrong").expect(401);
    expect(Customer.getAll).not.toHaveBeenCalled();
  });

  test("browser views get a Basic challenge", async () => {
    const res = await request(app).get("/listCustomers").expect(401);
    expect(res.headers["www-authenticate"]).toMatch(/^Basic/);
  });

  test("accepts Basic auth with the key as password", async () => {
    Customer.getAll.mockResolvedValue([ana]);
    await request(app).get("/listCustomers").auth("anyone", "test-key").expect(200);
  });
});

describe("GET /customers/:id", () => {
  test("returns the customer", async () => {
    Customer.findById.mockResolvedValue(ana);
    const res = await request(app).get("/customers/1").set(KEY).expect(200);
    expect(res.body).toEqual(ana);
  });

  test("404 when not found", async () => {
    Customer.findById.mockResolvedValue(null);
    await request(app).get("/customers/999").set(KEY).expect(404);
  });

  test.each(["abc", "0", "-1", "1 OR 1=1"])("400 for invalid id %p", async id => {
    await request(app).get(`/customers/${encodeURIComponent(id)}`).set(KEY).expect(400);
    expect(Customer.findById).not.toHaveBeenCalled();
  });
});

describe("POST /customers", () => {
  test("creates with valid body", async () => {
    Customer.create.mockResolvedValue({ ...ana, id: 2 });
    await request(app).post("/customers").set(KEY)
      .send({ email: "ana@example.com", name: "Ana", active: "true" })
      .expect(201);
    expect(Customer.create.mock.calls[0][0]).toMatchObject({ email: "ana@example.com", name: "Ana", active: true });
  });

  test("ignores card fields on create", async () => {
    Customer.create.mockResolvedValue({ ...ana, id: 2 });
    await request(app).post("/customers").set(KEY)
      .send({ email: "ana@example.com", name: "Ana", numero_cartao: "4111" })
      .expect(201);
    expect(Customer.create.mock.calls[0][0]).not.toHaveProperty("numero_cartao");
  });

  test.each([
    [{}, "email is required"],
    [{ email: "not-an-email", name: "Ana" }, "email is invalid"],
    [{ email: "ana@example.com", name: "  " }, "name must be a non-empty string"],
    [{ email: "ana@example.com", name: "Ana", active: "maybe" }, "active must be a boolean"],
    [{ email: "ana@example.com", name: "x".repeat(256) }, "name must be at most 255 characters"]
  ])("400 for %j", async (body, error) => {
    const res = await request(app).post("/customers").set(KEY).send(body).expect(400);
    expect(res.body.errors).toContain(error);
    expect(Customer.create).not.toHaveBeenCalled();
  });

  test("400 for malformed JSON", async () => {
    await request(app).post("/customers").set(KEY)
      .set("Content-Type", "application/json").send("{bad").expect(400);
  });
});

describe("update", () => {
  test("passes only the fields sent", async () => {
    Customer.updateById.mockResolvedValue({ ...ana, name: "Ana S." });
    await request(app).patch("/customers/1").set(KEY).send({ name: "Ana S." }).expect(200);
    const fields = Customer.updateById.mock.calls[0][1];
    expect(Object.entries(fields).filter(([, v]) => v !== undefined)).toEqual([["name", "Ana S."]]);
  });

  test("allows null on optional fields", async () => {
    Customer.updateById.mockResolvedValue(ana);
    await request(app).put("/customers/1").set(KEY).send({ ccv: null }).expect(200);
    expect(Customer.updateById.mock.calls[0][1].ccv).toBeNull();
  });

  test("400 for null on required fields", async () => {
    const res = await request(app).put("/customers/1").set(KEY).send({ email: null }).expect(400);
    expect(res.body.errors).toContain("email can not be null");
  });

  test("400 when no updatable fields", async () => {
    await request(app).put("/customers/1").set(KEY).send({ foo: 1 }).expect(400);
    expect(Customer.updateById).not.toHaveBeenCalled();
  });

  test("form post normalizes active", async () => {
    Customer.updateById.mockResolvedValue(ana);
    await request(app).post("/customers/1").set(KEY).type("form").send("active=0").expect(200);
    expect(Customer.updateById.mock.calls[0][1].active).toBe(false);
  });

  test("404 when not found", async () => {
    Customer.updateById.mockResolvedValue(null);
    await request(app).put("/customers/999").set(KEY).send({ name: "x" }).expect(404);
  });
});

describe("DELETE", () => {
  test("deletes one", async () => {
    Customer.remove.mockResolvedValue(true);
    await request(app).delete("/customers/1").set(KEY).expect(200);
  });

  test("404 when not found", async () => {
    Customer.remove.mockResolvedValue(false);
    await request(app).delete("/customers/999").set(KEY).expect(404);
  });
});

describe("errors", () => {
  test("DB failure returns generic 500 and logs no data", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    Customer.getAll.mockRejectedValue(Object.assign(new Error("connect ECONNREFUSED"), { code: "ECONNREFUSED", sql: "INSERT ... 4111222233334444" }));
    const res = await request(app).get("/customers").set(KEY).expect(500);
    expect(res.body).toEqual({ message: "Internal server error." });
    expect(JSON.stringify(spy.mock.calls)).not.toContain("4111222233334444");
    spy.mockRestore();
  });
});

describe("views", () => {
  test("escape HTML in data", async () => {
    Customer.findById.mockResolvedValue({ ...ana, name: "<script>alert(1)</script>" });
    const res = await request(app).get("/customer/1").set(KEY).expect(200);
    expect(res.text).toContain("&lt;script&gt;");
    expect(res.text).not.toContain("<script>alert(1)");
  });

  test("404 when customer not found", async () => {
    Customer.findById.mockResolvedValue(null);
    await request(app).get("/customer/999").set(KEY).expect(404);
  });
});
