## Frontend — Svelte + Vite

SPA client for ft_transcendence.

### Stack

- **Framework**: Svelte 4
- **Build tool**: Vite
- **Language**: JavaScript / TypeScript
- **Dev server**: Vite HMR (hot module reload)
- **Prod server**: nginx (via Docker)

---

### Running (Docker — recommended)

Everything runs inside Docker. No local Node/npm needed.

```bash
# From the project root:
make dev               # start full stack (nginx + frontend + backend + db)
make frontend          # start only frontend + nginx (needs backend running separately)
make logs-frontend     # follow frontend logs
make rebuild-frontend  # rebuild image (needed after package.json changes)
```

App is available at: `http://localhost:8080`

Hot-reload is active — editing files in `src/` updates the browser automatically.

---

### Running locally (without Docker)

Only needed if you want to run Vite directly on your machine:

```bash
cd frontend
npm install
npm run dev
```

Dev server runs at `http://localhost:5173`. Note: without nginx, API calls need to go directly to `http://localhost:3000`.

---

### Project Structure

```
frontend/src/
├── main.js              # entry point, mounts App.svelte
├── App.svelte           # root component + client-side router
├── routes/              # page-level components (one per route)
│   ├── HomePage.svelte
│   ├── LoginPage.svelte
│   ├── DashboardPage.svelte
│   └── SettingPage.svelte
├── components/          # reusable UI components
│   ├── Button.svelte
│   ├── LoginForm.svelte
│   ├── GameRoom.svelte
│   ├── SnakeGame.svelte
│   └── ...
├── stores/              # Svelte stores (auth, websocket state)
│   ├── auth.svelte.js
│   └── websocket.svelte.js
└── services/            # API call helpers
    └── authService.ts
```

---

### Docker Build Stages

The [Dockerfile](Dockerfile) has 4 stages:

| Stage         | Purpose                                   | Used when          |
|---------------|-------------------------------------------|--------------------|
| `base`        | Shared base (Node + package.json)         | Always (inherited) |
| `development` | Vite dev server with HMR on `:5173`       | `docker compose up`|
| `build`       | Compiles `src/` → `dist/` (static files)  | CI / prod build    |
| `production`  | nginx serves `dist/` on `:80` (~40MB)     | Production deploy  |

In development, source is **mounted as a volume** so edits hot-reload without rebuilding.

---

### API Communication

In Docker, all requests go through nginx on port 8080:

```
Browser → http://localhost:8080/api/v1/...  →  nginx  →  backend:3000
Browser → http://localhost:8080/ws          →  nginx  →  backend:3000 (WebSocket)
```

No CORS issues because browser and API are on the same origin (`localhost:8080`).
