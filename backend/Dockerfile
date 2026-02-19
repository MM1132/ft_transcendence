# ============================================
# Backend Dockerfile (Multi-stage build)
# ============================================
#
# This Dockerfile builds the Fastify/Node.js backend server.
# Used by docker-compose.yml (target: development for local dev).
#
# Stages:
#   1. base         - Shared base with package.json for all stages
#   2. development  - Local dev with hot-reload (npm run dev / nodemon)
#   3. build        - Compiles TypeScript for production
#   4. production   - Lean production image with compiled JS only
#
# Usage:
#   Dev (via docker-compose):  docker compose up
#   Prod build:                docker build --target production -t backend .
# ============================================

# --- Stage 1: Base ---
# Shared base image, copies package files for dependency install
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# --- Stage 2: Development ---
# npm install runs at startup (not build time) so the anonymous volume
# for node_modules always gets fresh deps matching package.json.
# Source code is mounted via docker-compose volume.
FROM base AS development
EXPOSE 3000
CMD ["sh", "-c", "npm install && npm run dev"]

# --- Stage 3: Build ---
# Production-only deps + TypeScript compile
FROM base AS build
RUN npm ci --only=production
COPY . .
RUN npm run build

# --- Stage 4: Production ---
# Minimal image with only compiled JS and production node_modules
# Runs as non-root user (nodejs:1001) for security
FROM node:20-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/build ./build
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

USER nodejs

EXPOSE 3000

CMD ["npm", "start"]
