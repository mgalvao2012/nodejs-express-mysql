# nodejs-express-mysql

Express 5 + MySQL CRUD API with HTML views as plain JS functions (`app/views/*.js`). Runs on Node (local/Heroku); Cloudflare Workers is planned.
Tests: `npm test` (jest + supertest, model mocked).

Workers compatibility is kept by design. `app.js` is runtime-agnostic. `app/models/db.js` uses a lazy mysql2 pool on Node, and a Worker entry injects its own query via `db.setQuery()` (one connection per query through Hyperdrive). A local prototype lives in `spike/cf-check/` (git-excluded).

## Gotchas

### Cloudflare Workers (verified with wrangler 4.151.3 / `wrangler dev`, 2026-10-24)
- **iconv-lite 0.4.x breaks the Worker bundle**: Express 4 → body-parser 1.x → iconv-lite 0.4.24, whose `browser` field maps `./lib/streams` to `false`; wrangler honors it and startup fails with `require_streams2(...) is not a function`. iconv-lite 0.7.x (body-parser 2 / Express 5, mysql2) is fine. *Resolved by Express 5; don't downgrade.*
- **EJS cannot render on Workers**: it compiles templates with `new Function` → `EvalError: Code generation from strings disallowed`. Bundling templates as Text does not help. Views are also not on the Worker filesystem (`process.cwd()` is `/bundle`). *Resolved: views are JS functions; don't add a template engine that compiles at runtime.*
- **`__dirname` is undefined** in the Workers bundle; don't use it in code shared with the Worker.
- Any new dependency must also load in workerd: check it with the spike (`spike/cf-check`, `npx wrangler dev`).
- **mysql2 needs `disableEval: true`** (same EvalError otherwise) and **a connection per request**: reusing a connection across requests fails with `Cannot perform I/O on behalf of a different request`. Hyperdrive does the pooling.
- `process.env` (vars/secrets) **is** populated at module load with `nodejs_compat` + compat date ≥ 2025-04-01, so reading `API_KEY` at load works.
- `dotenv.config()` is harmless on Workers (returns ENOENT, does not throw).
- Express works on Workers through `httpServerHandler({ port })` from `cloudflare:node`.
- `import.meta.url` is undefined in the bundle: `createRequire(import.meta.url)` / `new URL(..., import.meta.url)` fail.
- Local Hyperdrive: `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` env var (works with MySQL). Build it from `.env` without echoing it.

### Local environment
- npm has a `before` cooldown (~3 days): versions newer than that fail with `ETARGET`. Don't bypass it.
- Edits to `.env*` files and `git push` are blocked for the agent; the user runs them.
