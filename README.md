# Tienda Juanes Ecommerce

Base completa para un ecommerce profesional con Java 21, Spring Boot, Next.js, PostgreSQL y Docker.

## Estructura

- `backend`: API Spring Boot
- `frontend`: Web Next.js
- `nginx`: Reverse proxy
- `docker-compose.yml`: Orquestacion completa

## Requisitos

- Docker y Docker Compose

## Variables de entorno

Backend:
- `DB_URL`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_NOTIFICATION_URL`
- `REDIS_HOST`
- `REDIS_PORT`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `FRONTEND_URL` (para enlaces de recuperación de contraseña)

Frontend:
- `NEXT_PUBLIC_API_URL`

## Levantar el proyecto

```bash
docker-compose up --build
```

## Compartir localhost con URL publica

Para exponer tu proyecto local (por defecto en `http://localhost:8088`) y compartirlo con personas en otra red:

```bash
./scripts/tunnel.sh
```

Opcional, si usas otro puerto:

```bash
./scripts/tunnel.sh 3000
```

El comando imprimira una URL `https://...trycloudflare.com` que puedes compartir.
Mantén la terminal abierta para que el tunel siga activo.

## Smoke QA rapido

Con el stack levantado, ejecuta:

```bash
./scripts/qa-smoke.sh
```

Opcional con otra URL base:

```bash
./scripts/qa-smoke.sh http://localhost:8088
```

Valida de forma rapida:
- Home frontend
- `GET /api/health`
- `GET /api/products` (listado)
- `GET /api/products?search=...` (busqueda)

### URL fija (Cloudflare Tunnel nombrado)

`trycloudflare.com` siempre es temporal. Para una URL fija necesitas dominio propio en Cloudflare.

Pasos:

1) En Cloudflare Zero Trust crea un **Named Tunnel**.
2) Agrega un **Public Hostname** (ejemplo: `tienda.tudominio.com`).
3) Como servicio de origen usa `http://host.docker.internal:8088`.
4) Copia el token del túnel.
5) Ejecuta:

```bash
CF_TUNNEL_TOKEN=tu_token_aqui ./scripts/tunnel-fixed.sh
```

Si tu proyecto no está en `8088`:

```bash
PORT=3000 CF_TUNNEL_TOKEN=tu_token_aqui ./scripts/tunnel-fixed.sh
```

Puertos por defecto:
- `http://localhost:8088` (frontend via Nginx)
- `http://localhost:8080` (backend)
- `http://localhost:5433` (PostgreSQL)
- `http://localhost:6379` (Redis)

## Credenciales de prueba

Cliente:
- Email: `cliente@tiendajuanes.com`
- Password: `Cliente1234`

Admin:
- Email: `admin@tiendajuanes.com`
- Password: `Admin1234`

## Endpoints principales

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Addresses:
- `GET /api/addresses`
- `POST /api/addresses`
- `PUT /api/addresses/{id}/default`
- `PUT /api/addresses/{id}`
- `DELETE /api/addresses/{id}`

Products:
- `GET /api/products` (lista completa)
- `GET /api/products?search=&category=&brand=&sizeParam=&color=&minPrice=&maxPrice=&page=0&size=20&sort=created_at&dir=desc` (busqueda unificada)
- `GET /api/products/paged?page=0&size=20&sort=created_at&dir=desc`
- `GET /api/products/{id}`
- `GET /api/products/search?q=&page=0&size=20`
- `GET /api/products/filter?category&brand&size&minPrice&maxPrice&page=0&size=20`
- `GET /api/products/featured?limit=6`
- `GET /api/products/new?limit=6`
- `GET /api/products/best-sellers?limit=6`
- `GET /api/products/{id}/related?limit=6`
- `GET /api/products/by-ids?ids=1,2,3`

Coupons:
- `POST /api/coupons/validate`

Cart:
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `GET /api/cart`
- `DELETE /api/cart/remove`

Orders:
- `POST /api/orders/create`
- `GET /api/orders/my-orders`
- `GET /api/orders/{id}`
- `GET /api/orders/{id}/tracking`
- `POST /api/orders/{id}/reorder`

Users:
- `GET /api/users/me`

Health:
- `GET /api/health`

Payments:
- `POST /api/payments/create-preference`
- `POST /api/payments/webhook`

Admin:
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`
- `GET /api/admin/orders?page=0&size=20`
- `GET /api/admin/orders/{id}`
- `GET /api/admin/orders/{id}/notes`
- `POST /api/admin/orders/{id}/notes`
- `PATCH /api/admin/orders/{id}/items/{itemId}/pack`
- `PUT /api/admin/orders/update-status`
- `GET /api/admin/inventory`
- `PUT /api/admin/inventory/update`
- `GET /api/admin/inventory/history?productVariantId=&limit=50`
- `GET /api/admin/dashboard/stats`
- `GET /api/admin/analytics`
- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PUT /api/admin/coupons/{id}`
- `DELETE /api/admin/coupons/{id}`
- `GET /api/admin/banners`
- `POST /api/admin/banners`
- `PUT /api/admin/banners/{id}`
- `DELETE /api/admin/banners/{id}`
- `GET /api/admin/reports/sales/export`

Favorites:
- `GET /api/favorites`
- `POST /api/favorites/{productId}`
- `DELETE /api/favorites/{productId}`
- `GET /api/favorites/{productId}`

## Notas

- Las migraciones iniciales se encuentran en `backend/src/main/resources/db/migration`.
- El catalogo se refresca con productos e imagenes reales mediante `V27__refresh_products_real_catalog.sql`.
- Redis se usa para cachear productos y busquedas.
- Emails requieren configurar SMTP en variables de entorno.
- En desarrollo, el footer muestra el estado de servicios (backend, API, postgres, redis, nginx, MercadoPago, SMTP).
- Inventario protegido con optimistic locking en variantes.
- Checkout permite PSE (MercadoPago), Transferencia y Contraentrega.
- Recuperacion de contraseña disponible en `/recuperar-password`.
