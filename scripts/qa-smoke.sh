#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8088}"
API_URL="${BASE_URL}/api"

echo "Running smoke checks against: ${BASE_URL}"
echo

check_http_ok() {
  local url="$1"
  local label="$2"
  local code
  code="$(curl -sS -o /dev/null -w "%{http_code}" "$url" || true)"
  if [[ "$code" == "200" ]]; then
    echo "[OK] ${label} -> ${code}"
  else
    echo "[FAIL] ${label} -> ${code}"
    return 1
  fi
}

check_http_ok "${BASE_URL}" "Frontend home"
check_http_ok "${API_URL}/health" "API health"
check_http_ok "${API_URL}/products?page=0&size=5" "Products list"
check_http_ok "${API_URL}/products?search=camiseta&page=0&size=5" "Products search"

echo
echo "Smoke checks completed."
