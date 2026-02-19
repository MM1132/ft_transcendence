.PHONY: help setup dev up down restart logs ps clean db-shell backend-shell frontend-shell lint lint-check

help:
	@echo "Available commands:"
	@echo "  make setup        - Initial setup (build images)"
	@echo "  make dev          - Start development environment"
	@echo "  make up           - Start all services"
	@echo "  make down         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo "  make logs         - Show logs (ctrl+c to exit)"
	@echo "  make ps           - Show running containers"
	@echo "  make clean        - Stop and remove everything"
	@echo "  make db-shell     - Open PostgreSQL shell"
	@echo "  make backend-shell - Open backend container shell"
	@echo "  make frontend-shell - Open frontend container shell"
	@echo "  make lint         - Auto-fix Biome formatting (runs inside backend container)"
	@echo "  make lint-check   - Check Biome issues without fixing"

setup:
	docker compose build
	@echo "Setup complete! Run 'make dev' to start."

dev:
	docker compose up -d
	@echo "Development environment is running!"
	@echo "  - App:      http://localhost:8080"
	@echo "  - API:      http://localhost:8080/api"
	@echo "  - Database: localhost:5432"
	@echo ""
	@echo "View logs with: make logs"

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

ps:
	docker compose ps

clean:
	docker compose down -v
	@echo "Cleaned up all containers and volumes"

db-shell:
	docker compose exec db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

backend-shell:
	docker compose exec backend sh

frontend-shell:
	docker compose exec frontend sh

lint:
	docker compose exec backend npx biome check --write src/
	@echo "Biome formatting applied."

lint-check:
	docker compose exec backend npx biome check src/
