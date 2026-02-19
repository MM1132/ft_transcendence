# ============================================
# Frontend Dockerfile (Multi-stage build)
# ============================================
#
# Stages:
#   1. base        - Shared base with package.json
#   2. development - Local dev with Vite HMR (npm run dev -- --host)
#   3. build       - Compile static files for production
#   4. production  - Lean nginx image serving /dist
#
# Usage:
#   Dev (via docker-compose):  docker compose up
#   Prod build:                docker build --target production -t frontend .
#
# ============================================
#
# CONCEPT: WORKDIR
# ────────────────
#   WORKDIR /app  =  mkdir -p /app && cd /app
#   All subsequent COPY, RUN, CMD execute relative to /app.
#
# CONCEPT: Multi-stage builds
# ───────────────────────────
#   Only the FINAL stage ends up in the image. Stages 1-3 are discarded.
#   → Production image contains only nginx + static files (~40MB)
#   → No Node.js, no node_modules, no source code in prod
#
# CONCEPT: npm ci vs npm install
# ──────────────────────────────
#   npm install  - Resolves versions, may update package-lock.json (flexible, for dev)
#   npm ci       - Clean Install: deletes node_modules/, installs EXACTLY from
#                  package-lock.json, fails if lock is missing/out-of-sync
#                  → Deterministic & reproducible (standard for CI/CD and Docker builds)
#
# CONCEPT: "--", "--host" in CMD
# ──────────────────────────────
#   CMD ["npm", "run", "dev", "--", "--host"]
#       npm run dev  →  runs "vite"
#       --           →  separates npm args from script args
#       --host       →  passed to vite as: vite --host
#   --host binds Vite to 0.0.0.0 instead of 127.0.0.1.
#   Required inside Docker — otherwise the dev server is unreachable from outside.
#
# BUILD FLOW:
# ─────────────────────
#   Stage 1: base
#     FROM node:20-alpine → WORKDIR /app → COPY package*.json
#
#   Stage 2: development  (used by docker-compose)
#     FROM base → npm install → COPY . . → vite --host → :5173
#     (source mounted as volume for HMR, node_modules stay in container)
#
#   Stage 3: build        (intermediate only)
#     FROM base → npm ci → COPY . . → npm run build → /app/dist/
#
#   Stage 4: production   (final image for prod)
#     FROM nginx:alpine → COPY /app/dist → /usr/share/nginx/html
#     → nginx serves on :80   (~40MB total, no Node.js)
#
# FILESYSTEM LAYOUT:
# ──────────────────
#   Stages 1-3 (Node container):        Stage 4 (nginx container):
#   /app/                                /usr/share/nginx/html/
#   ├── package.json                     ├── index.html
#   ├── package-lock.json                ├── assets/
#   ├── node_modules/                    │   ├── index-abc123.js
#   ├── src/                             │   └── index-def456.css
#   └── dist/  ← vite build output      └── ...
#       (only exists in stage 3)         (copied from /app/dist)
#
# CONCEPT: Why nginx in Stage 4 and not Node?
# ─────────────────────────────────────────────
#   This is plain Svelte + Vite (not SvelteKit). vite build outputs static
#   HTML/JS/CSS only. There is no SSR, no Node server needed at runtime.
#
#   ┌─────────────────────┬──────────────────────────────┬──────────────────────────┐
#   │ Approach            │ Pros                         │ Cons                     │
#   ├─────────────────────┼──────────────────────────────┼──────────────────────────┤
#   │ nginx (current)     │ Tiny (~40MB), fast, prod-grade│ Config to learn         │
#   │ vite preview (Node) │ Stays in JS ecosystem        │ 180MB, NOT meant for prod│
#   │ serve (npm)         │ Simple                       │ 180MB, less features     │
#   │ Caddy               │ Auto-HTTPS, simple config    │ Extra dependency         │
#   └─────────────────────┴──────────────────────────────┴──────────────────────────┘
#
# ALTERNATIVE PRODUCTION STAGES (drop-in replacements for Stage 4):
# ──────────────────────────────────────────────────────────────────
#
#   Option A — nginx (current, recommended for static SPA)
#
#     FROM nginx:alpine AS production
#     COPY --from=build /app/dist /usr/share/nginx/html
#     RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / { try_files $uri $uri/ /index.html; }\n}\n' \
#         > /etc/nginx/conf.d/default.conf
#     CMD ["nginx", "-g", "daemon off;"]
#     # ~40MB image, fast, production-grade
#
#   Option B — Node + vite preview (NOT recommended for production)
#
#     FROM node:20-alpine AS production
#     WORKDIR /app
#     COPY --from=build /app/dist ./dist
#     COPY --from=build /app/package*.json ./
#     RUN npm ci --omit=dev
#     EXPOSE 4173
#     CMD ["npx", "vite", "preview", "--host"]
#     # ~180MB image. vite preview is explicitly not meant for production.
#
#   Option C — Node + serve (simple static server)
#
#     FROM node:20-alpine AS production
#     WORKDIR /app
#     COPY --from=build /app/dist ./dist
#     RUN npm install -g serve
#     EXPOSE 3000
#     CMD ["serve", "-s", "dist", "-l", "3000"]
#     # ~180MB image. -s enables SPA fallback. Simpler than nginx but heavier.
#
#   Option D — Caddy (nginx alternative with auto-HTTPS)
#
#     FROM caddy:alpine AS production
#     COPY --from=build /app/dist /srv
#     COPY Caddyfile /etc/caddy/Caddyfile
#     EXPOSE 80
#     CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
#     # Caddyfile:
#     #   :80 {
#     #     root * /srv
#     #     try_files {path} /index.html
#     #     file_server
#     #   }
#     # ~40MB, auto-HTTPS if exposed publicly, simpler config than nginx.
#
# For nginx reverse-proxy concepts (upstream, proxy_pass, WebSocket) see: nginx/nginx.conf
# ============================================

# --- Stage 1: Base ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# --- Stage 2: Development ---
# Source code is mounted via docker-compose volume for hot-reload
FROM base AS development
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# --- Stage 3: Build ---
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 4: Production ---
# nginx config inside container: SPA fallback (try_files → index.html)
# See nginx/nginx.conf for the full reverse proxy config used in dev
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / { try_files $uri $uri/ /index.html; }\n}\n' \
    > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
