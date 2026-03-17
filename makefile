# Variables
COMPOSE_FILE=docker-compose-local.yaml

.PHONY: up down restart status logs shell clean heartbeat

# Starts the local environment and forces a build so your latest code is used
up:
	docker compose -f $(COMPOSE_FILE) up --build -d

# Shuts down the local environment
down:
	docker compose -f $(COMPOSE_FILE) down