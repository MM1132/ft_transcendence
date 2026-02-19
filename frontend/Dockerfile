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
# CONCEPT: nginx config (SPA fallback)
# ─────────────────────────────────────
#   server {
#     listen 80;                            # HTTP port
#     root /usr/share/nginx/html;           # = your /dist output
#     location / {
#       try_files $uri $uri/ /index.html;   # SPA fallback
#     }
#   }
#
#   try_files logic for a request like /game/lobby:
#     1. $uri   → look for file  /usr/share/nginx/html/game/lobby  → miss
#     2. $uri/  → look for dir   /usr/share/nginx/html/game/lobby/ → miss
#     3. /index.html → serve index.html → SPA client-side router takes over
#
# CONCEPT: Why nginx and not Node?
# ────────────────────────────────
#   This is plain Svelte + Vite (not SvelteKit). vite build outputs static
#   HTML/JS/CSS. There is no SSR, no Node server needed at runtime.
#
#   | Approach               | Pros                              | Cons                                    |
#   |------------------------|-----------------------------------|-----------------------------------------|
#   | nginx (current)        | Tiny (~40MB), fast, battle-tested | Extra config to learn                   |
#   | Node (vite preview)    | Stays in JS ecosystem             | ~180MB image, NOT meant for production  |
#   | SvelteKit+adapter-node | Real SSR, Node server, no nginx   | Requires migration to SvelteKit         |
#
#   Bottom line: For a static SPA, nginx is the right choice.
#
# BUILD FLOW (Mermaid):
# ─────────────────────
#   graph TD
#     subgraph "Stage 1: base"
#       A[FROM node:20-alpine] --> B[WORKDIR /app]
#       B --> C[COPY package*.json ./]
#     end
#     subgraph "Stage 2: development"
#       C --> D[FROM base] --> E[npm install] --> F[COPY . .]
#       F --> G["CMD: vite --host → serves on :5173"]
#     end
#     subgraph "Stage 3: build"
#       C --> I[FROM base] --> J[npm ci] --> K[COPY . .]
#       K --> L[npm run build] --> M["/app/dist/ created (static HTML/JS/CSS)"]
#     end
#     subgraph "Stage 4: production"
#       N[FROM nginx:alpine] --> O["COPY --from=build /app/dist → /usr/share/nginx/html"]
#       M -.->|files copied| O --> P[Write nginx config] --> Q["nginx serves on :80"]
#     end
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
# ============================================

# Myquestion: is this nginx part replaceable changeable?

# Yes, the nginx stage (Stage 4) is fully replaceable. Here are your options for serving the static /dist output:

# Option A: nginx (current) — recommended for static SPA

# FROM nginx:alpine AS production
# COPY --from=build /app/dist /usr/share/nginx/html
# RUN printf '...' > /etc/nginx/conf.d/default.conf
# CMD ["nginx", "-g", "daemon off;"]
# ~40MB image, fast, production-grade.

# Option B: Node + vite preview

# FROM node:20-alpine AS production
# WORKDIR /app
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/package*.json ./
# RUN npm ci --omit=dev
# EXPOSE 4173
# CMD ["npx", "vite", "preview", "--host"]
# ~180MB image. Not recommended — vite preview is explicitly not meant for production.

# Option C: Node + a lightweight static server (e.g. serve)

# FROM node:20-alpine AS production
# WORKDIR /app
# COPY --from=build /app/dist ./dist
# RUN npm install -g serve
# EXPOSE 3000
# CMD ["serve", "-s", "dist", "-l", "3000"]
# ~180MB image. -s enables SPA fallback (like try_files). Simpler than nginx but heavier.

# Option D: Caddy (nginx alternative)

# FROM caddy:alpine AS production
# COPY --from=build /app/dist /srv
# COPY Caddyfile /etc/caddy/Caddyfile
# EXPOSE 80
# With a Caddyfile:


# :80 {
#   root * /srv
#   try_files {path} /index.html
#   file_server
# }
# ~40MB image. Auto-HTTPS built-in, simpler config than nginx.

# What's customizable in the current nginx setup specifically:

# What	How
# Port	Change listen 80 and EXPOSE 80
# Gzip compression	Add gzip on; gzip_types text/css application/javascript;
# Cache headers	Add location ~* \.(js|css)$ { expires 1y; }
# Custom 404 page	Add error_page 404 /index.html;
# Use external config file	Replace the printf with COPY nginx.conf /etc/nginx/conf.d/default.conf
# For your use case (plain Svelte SPA), nginx or Caddy are the best choices. Want me to swap it to one of these alternatives?


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
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
# SPA fallback: all routes → index.html (see nginx config concept above)
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / { try_files $uri $uri/ /index.html; }\n}\n' \
    > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
