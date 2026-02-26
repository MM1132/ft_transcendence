## Backend — Fastify + TypeScript

REST API + WebSocket server for ft_transcendence.

### Stack

- **Runtime**: Node.js 20 + TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL (via `pg`)
- **WebSocket**: Built into Fastify
- **Linter/Formatter**: BiomeJS

---

### Running (Docker — recommended)

Everything runs inside Docker. No local Node/npm needed.

```bash
# From the project root:
make dev              # start full stack (nginx + frontend + backend + db)
make backend          # start only db + backend (no frontend)
make logs-backend     # follow backend logs
make rebuild-backend  # rebuild image (needed after package.json changes)
```

API is available at: `http://localhost:8080/api/v1`

---

### Running locally (without Docker)

Only needed if you want to run the backend outside of Docker:

```bash
cd backend
npm install
npm run dev
```

Requires a local PostgreSQL instance. Copy `.env.example` to `.env` and set `POSTGRES_HOST=localhost`.

> Node v20+ and npm v10+ recommended.

---

### Environment Variables

See `.env.example` in the project root. Key backend vars:

| Variable          | Default            | Description                        |
|-------------------|--------------------|------------------------------------|
| `BACKEND_PORT`    | `3000`             | Port Fastify listens on (internal) |
| `POSTGRES_HOST`   | `db` (Docker)      | DB hostname                        |
| `POSTGRES_USER`   | `user`             | DB user                            |
| `POSTGRES_PASSWORD` | `password`       | DB password                        |
| `POSTGRES_DB`     | `backend_database` | DB name                            |

---

### Project Structure

```
backend/src/
├── index.ts                  # entry point
├── init/
│   ├── addDecorators.ts      # fastify decorators (db, port, baseDir, baseUrl)
│   ├── initDatabase.ts       # postgres connection + SQL init
│   ├── registerPlugins.ts    # cors, multipart, rateLimit, schedule
│   ├── registerRoutes.ts     # mounts all route files + auth hook
│   └── startListening.ts     # fastify.listen (0.0.0.0 for Docker)
├── features/
│   ├── auth/                 # session auth preValidation hook
│   ├── session/              # login, logout, register
│   ├── user/                 # user profile, settings, avatar
│   └── friend/               # friend requests, status
└── websocket/                # WS connection manager + handlers
```

---

### Linting (BiomeJS)

```bash
make lint-check    # check for issues (no changes)
make lint          # auto-fix formatting
```

Or install the [BiomeJS VS Code extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for auto-format on save.
