#!/usr/bin/env bash
set -euo pipefail

# Go to service directory
cd "$(dirname "$0")/apps/device-control-service"

# Run docker compose (supports both docker compose and docker-compose)
if command -v docker >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1; then
    docker compose up -d --build
  else
    docker-compose up -d --build
  fi
else
  echo "Docker is not installed. Please install Docker and try again."
  exit 1
fi

echo "Device Control Service is starting..."
echo "- API:            http://localhost:3000"
echo "- PostgreSQL:     localhost:5432 (user: dc_user, password: dc_pass, db: device_control)"
echo "Use 'npm run docker:logs' inside apps/device-control-service to follow logs."
