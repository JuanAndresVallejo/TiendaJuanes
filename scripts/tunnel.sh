#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8088}"
DOCKER_CMD="docker"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is required."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  if command -v sudo >/dev/null 2>&1; then
    DOCKER_CMD="sudo docker"
  else
    echo "Error: Docker is installed but your user has no permission to access /var/run/docker.sock."
    echo "Run with elevated permissions or add your user to the docker group."
    exit 1
  fi
fi

echo "Starting public tunnel for http://localhost:${PORT}"
echo "Press Ctrl+C to stop."
echo

${DOCKER_CMD} run --rm -it \
  --add-host host.docker.internal:host-gateway \
  cloudflare/cloudflared:latest tunnel --no-autoupdate --url "http://host.docker.internal:${PORT}"
