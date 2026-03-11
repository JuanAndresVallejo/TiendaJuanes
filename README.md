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

Products:
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products/search?q=`
- `GET /api/products/filter`

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
- `GET /api/orders/{id}/tracking`

Payments:
- `POST /api/payments/create-preference`
- `POST /api/payments/webhook`

Admin:
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/update-status`
- `GET /api/admin/inventory`
- `PUT /api/admin/inventory/update`
- `GET /api/admin/dashboard/stats`
- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PUT /api/admin/coupons/{id}`
- `DELETE /api/admin/coupons/{id}`

## Notas

- Las migraciones iniciales se encuentran en `backend/src/main/resources/db/migration`.
- Redis se usa para cachear productos y busquedas.
- Emails requieren configurar SMTP en variables de entorno.
