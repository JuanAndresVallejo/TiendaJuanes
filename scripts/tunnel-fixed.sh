#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8088}"
CF_TUNNEL_TOKEN="${CF_TUNNEL_TOKEN:-}"
DOCKER_CMD="docker"

if [[ -z "$CF_TUNNEL_TOKEN" ]]; then
  echo "Error: CF_TUNNEL_TOKEN is required."
  echo "Example:"
  echo "  CF_TUNNEL_TOKEN=xxxxxxxx ./scripts/tunnel-fixed.sh"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is required."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  if command -v sudo >/dev/null 2>&1; then
    DOCKER_CMD="sudo docker"
  else
    echo "Error: Docker is installed but your user has no permission to access /var/run/docker.sock."
    exit 1
  fi
fi

echo "Starting fixed Cloudflare Tunnel to http://localhost:${PORT}"
echo "Press Ctrl+C to stop."
echo

${DOCKER_CMD} run --rm -it \
  --add-host host.docker.internal:host-gateway \
  cloudflare/cloudflared:latest tunnel --no-autoupdate run --token "${CF_TUNNEL_TOKEN}"
