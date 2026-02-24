.PHONY: help setup dev up down restart logs ps clean rebuild rebuild-backend rebuild-frontend \
        backend frontend db-shell backend-shell frontend-shell lint lint-check \
        logs-backend logs-frontend logs-db

help:
	@echo "=== ft_transcendence Dev Commands ==="
	@echo ""
	@echo "  SETUP"
	@echo "  make setup            - First-time setup: build all images"
	@echo "  make dev              - Start full stack (all services)"
	@echo "  make down             - Stop all services"
	@echo "  make clean            - Stop + remove containers AND volumes (fresh DB)"
	@echo ""
	@echo "  REBUILD (after Dockerfile / package.json changes)"
	@echo "  make rebuild          - Rebuild all images and restart"
	@echo "  make rebuild-backend  - Rebuild backend image only"
	@echo "  make rebuild-frontend - Rebuild frontend image only"
	@echo ""
	@echo "  SINGLE SERVICE"
	@echo "  make backend          - Start only db + backend"
	@echo "  make frontend         - Start only frontend (needs backend running)"
	@echo "  make restart          - Restart all services (no rebuild)"
	@echo ""
	@echo "  LOGS"
	@echo "  make logs             - Follow all logs"
	@echo "  make logs-backend     - Follow backend logs only"
	@echo "  make logs-frontend    - Follow frontend logs only"
	@echo "  make logs-db          - Follow database logs only"
	@echo ""
	@echo "  SHELLS"
	@echo "  make db-shell         - Open PostgreSQL shell"
	@echo "  make backend-shell    - Open backend container shell"
	@echo "  make frontend-shell   - Open frontend container shell"
	@echo ""
	@echo "  LINT"
	@echo "  make lint             - Auto-fix Biome formatting"
	@echo "  make lint-check       - Check Biome issues without fixing"
	@echo ""
	@echo "  make ps               - Show running containers"

# --- Setup ---

setup:
	cp -n .env.example .env 2>/dev/null || true
	docker compose build
	@echo ""
	@echo "Setup complete! Run 'make dev' to start."
	@echo "App will be at: http://localhost:8080"

dev:
	docker compose up -d
	@echo ""
	@echo "Development environment is running!"
	@echo "  App:      http://localhost:8080"
	@echo "  API:      http://localhost:8080/api/v1"
	@echo "  Database: localhost:5432"
	@echo ""
	@echo "Follow logs: make logs"

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

# --- Rebuild (needed when Dockerfile or package.json changes) ---

rebuild:
	docker compose down
	docker compose build
	docker compose up -d
	@echo "All images rebuilt and stack restarted."

rebuild-backend:
	docker compose build backend
	docker compose up -d backend
	@echo "Backend image rebuilt and restarted."

rebuild-frontend:
	docker compose build frontend
	docker compose up -d frontend
	@echo "Frontend image rebuilt and restarted."

# --- Single services ---

backend:
	docker compose --env-file .env.example up -d db backend nginx
	@echo "DB + backend running. API at http://localhost:8080/api/v1"

frontend:
	docker compose up -d frontend nginx
	@echo "Frontend running at http://localhost:8080"

# --- Logs ---

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-db:
	docker compose logs -f db

# --- Cleanup ---

clean:
	docker compose down -v
	@echo "Stopped all containers and removed volumes (DB reset)."

# --- Shells ---

ps:
	docker compose ps

db-shell:
	docker compose exec db psql -U $(shell grep POSTGRES_USER .env | cut -d= -f2) -d $(shell grep POSTGRES_DB .env | cut -d= -f2)

backend-shell:
	docker compose exec backend sh

frontend-shell:
	docker compose exec frontend sh

# --- Lint ---

lint:
	docker compose exec backend npx biome check --write src/
	@echo "Biome formatting applied."

lint-check:
	docker compose exec backend npx biome check src/
