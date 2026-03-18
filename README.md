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

Frontend:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STATUS_BANNER` (true en dev para mostrar estado de servicios)

## Levantar el proyecto

```bash
docker-compose up --build
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
- Redis se usa para cachear productos y busquedas.
- Emails requieren configurar SMTP en variables de entorno.
- En desarrollo, el footer muestra el estado de servicios (backend, API, postgres, redis, nginx, MercadoPago, SMTP).
- Inventario protegido con optimistic locking en variantes.
- Checkout permite PSE (MercadoPago), Transferencia y Contraentrega.
