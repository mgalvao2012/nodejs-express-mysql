# Node.js REST API with Express & MySQL

CRUD API for customers, with server-rendered EJS views.

## Requirements
- Node.js >= 20
- MySQL 8

## Setup
```bash
npm install
cp .env.example .env              # then fill in the DB credentials
echo "API_KEY=$(openssl rand -hex 32)" >> .env
mysql -u root -p < createTable.sql  # creates the `customers` database, table and seed data
```

| Variable | Description |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `API_KEY` | Required. The server refuses to start without it |
| `PORT` | HTTP port (default `3000`) |

## Run
```bash
npm start     # production
npm run dev   # restarts on file changes
npm test      # jest + supertest, model mocked (no database needed)
```

## Authentication
Every route except `GET /` requires the API key:
- API clients: `X-API-Key: <API_KEY>` header
- Browser views: HTTP Basic, any username, `API_KEY` as password

```bash
curl -H "X-API-Key: $API_KEY" localhost:3000/customers
```

## Endpoints
| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Health check (public) |
| `POST` | `/customers` | Create (`email`, `name` required; `active` optional) → `201` |
| `GET` | `/customers` | List all |
| `GET` | `/customers/:id` | Get one |
| `PUT` / `PATCH` / `POST` | `/customers/:id` | Partial update: only fields sent are changed |
| `DELETE` | `/customers/:id` | Delete one |
| `DELETE` | `/customers` | Delete all |
| `GET` | `/listCustomers` | HTML list |
| `GET` | `/customer/:id` | HTML detail |

Validation errors return `400` with `{ "message": "Invalid request", "errors": [...] }`.
