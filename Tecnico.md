# Documentación técnica del proyecto

## 1) Stack tecnológico

- **Backend**: Java 21, Spring Boot 3.x, Spring Security, JWT, JPA/Hibernate, Flyway
- **Frontend**: Next.js 14, React, TailwindCSS
- **DB**: PostgreSQL 16
- **Infraestructura**: Docker, Docker Compose, Nginx (reverse proxy)
- **Cache**: Redis
- **Email**: Spring Boot Mail
- **CDN (simulado)**: Cloudinary

---

## 2) Arquitectura general

### Backend (Clean Architecture simplificada)

Paquetes principales:
- `controllers`: Exponen endpoints REST
- `services`: Lógica de negocio
- `repositories`: Acceso a datos (JPA)
- `models`: Entidades JPA
- `dto`: DTOs de entrada/salida
- `security`: JWT, filtros, roles
- `config`: configuración general (seguridad, cache, etc.)

### Frontend

Estructura:
- `app/`: rutas (App Router)
- `components/`: UI reutilizable
- `services/`: llamadas a API
- `hooks/`: hooks de sesión y estado
- `styles/`: estilos globales

---

## 3) Puertos y servicios (Docker)

Servicios en `docker-compose.yml`:

- `nginx`: reverse proxy  
  Expone el frontend y enruta `/api` al backend.

- `frontend`: Next.js  
  Puerto interno 3000, servido por Nginx.

- `backend`: Spring Boot  
  Puerto interno 8080, servido por Nginx en `/api`.

- `postgres`: PostgreSQL  
  Puerto interno 5432.

- `redis`: Redis  
  Puerto interno 6379.

---

## 4) Endpoints principales

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Productos
- `GET /api/products`
- `GET /api/products?page=1&size=20`
- `GET /api/products/{id}`
- `GET /api/products/search?q=...`
- `GET /api/products/filter?category&brand&size&color&minPrice&maxPrice`

### Carrito
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove`
- `GET /api/cart`

### Órdenes
- `POST /api/orders/create`
- `GET /api/orders/my-orders`

### Tracking
- `GET /api/orders/{id}/tracking`

### Pagos
- `POST /api/payments/create-preference`
- `POST /api/payments/webhook`

### Cupones
- `POST /api/coupons/validate`

### Admin
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/update-status`
- `GET /api/admin/dashboard/stats`
- `GET /api/admin/analytics`
- `PUT /api/admin/inventory/update`
- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PUT /api/admin/coupons/{id}`
- `PATCH /api/admin/coupons/{id}/deactivate`
- `POST /api/admin/images/upload`

---

## 5) Entidades principales

- `User` (roles ADMIN / CUSTOMER)
- `Address`
- `Product`
- `ProductVariant`
- `ProductImage`
- `CartItem`
- `Order`
- `OrderItem`
- `Coupon`
- `Payment`
- `OrderStatusHistory`

---

## 6) Migraciones (Flyway)

Ubicación: `backend/src/main/resources/db/migration`

Migraciones principales:
- `V10__seed_products.sql`  
- `V11__seed_products_fix.sql`  
- `V12__coupons_full_system.sql`  
- `V13__order_tracking.sql`  
- `V14__analytics_tables.sql`  
- `V15__seed_products_after_fix.sql`

---

## 7) Seguridad

- JWT en `Authorization: Bearer <token>`
- `JwtAuthenticationFilter` valida tokens
- Roles: `/api/admin/**` requiere ADMIN
- Rate limiting para login
- Headers de seguridad:
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Content-Security-Policy`

---

## 8) Cache (Redis)

Cache para productos y búsquedas:

```java
@Cacheable("products")
```

Redis configurado en `application.yml` y `docker-compose.yml`.

---

## 9) Email

`EmailService` usa SMTP para:
- Confirmación de pedido
- Pago confirmado
- Pedido enviado

Variables en `.env` / `docker-compose.yml`.

---

## 10) Cloudinary

`ImageUploadService` simula subida.  
Se configura `CLOUDINARY_URL` en entorno.

---

## 11) Frontend: rutas clave

Públicas:
- `/`
- `/productos`
- `/producto/[id]`
- `/login`
- `/registro`
- `/carrito`
- `/checkout`

Usuario:
- `/mis-pedidos`
- `/mis-pedidos/[id]`

Admin:
- `/admin/dashboard`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/edit/[id]`
- `/admin/orders`
- `/admin/inventory`
- `/admin/coupons`
- `/admin/users`

---

## 12) Usuarios de prueba

Cliente:
- `cliente@tiendajuanes.com`
- `Cliente1234`

Admin:
- `admin@tiendajuanes.com`
- `Admin1234`

---

## 13) Diagnóstico rápido

Si solo ves 2 productos en frontend:
1. Verifica backend levantado.
2. Verifica count:

```bash
sudo docker-compose exec postgres psql -U juanes -d juanes -c \"SELECT count(*) FROM products;\"
```

3. Si Flyway falla en `V15`, borra la fila de error:

```bash
sudo docker-compose exec postgres psql -U juanes -d juanes -c \"DELETE FROM flyway_schema_history WHERE version='15';\"
sudo docker-compose up -d --build backend
```
