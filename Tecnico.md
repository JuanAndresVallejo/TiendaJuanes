# Documentacion tecnica del proyecto

## 1) Stack tecnologico

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
- `services`: Logica de negocio
- `repositories`: Acceso a datos (JPA)
- `models`: Entidades JPA
- `dto`: DTOs de entrada/salida
- `security`: JWT, filtros, roles
- `config`: configuracion general (seguridad, cache, etc.)

### Frontend

Estructura:
- `app/`: rutas (App Router)
- `components/`: UI reutilizable
- `services/`: llamadas a API
- `hooks/`: hooks de sesion y estado
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
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
### Perfil
- `GET /api/users/me`

### Direcciones
- `GET /api/addresses`
- `POST /api/addresses`
- `PUT /api/addresses/{id}`
- `DELETE /api/addresses/{id}`
- `PUT /api/addresses/{id}/default`

### Health
- `GET /api/health`

### Productos
- `GET /api/products` (lista o paginado si se pasan params)
- `GET /api/products?search=&category=&brand=&sizeParam=&color=&minPrice=&maxPrice=&page=0&size=20&sort=created_at&dir=desc` (busqueda unificada)
- `GET /api/products/paged?page=0&size=20&sort=created_at&dir=desc`
- `GET /api/products/{id}`
- `GET /api/products/search?q=...&page=0&size=20`
- `GET /api/products/filter?category&brand&size&minPrice&maxPrice&page=0&size=20`
- `GET /api/products/featured?limit=6`
- `GET /api/products/new?limit=6`
- `GET /api/products/best-sellers?limit=6`
- `GET /api/products/{id}/related?limit=6`
- `GET /api/products/by-ids?ids=1,2,3`

### Carrito
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove`
- `GET /api/cart`

### Ordenes
- `POST /api/orders/create`
- `GET /api/orders/my-orders`
- `GET /api/orders/{id}`
- `POST /api/orders/{id}/reorder`

### Tracking
- `GET /api/orders/{id}/tracking`

### Pagos
- `POST /api/payments/create-preference`
- `POST /api/payments/webhook`

### Cupones
- `POST /api/coupons/validate`

### Favoritos
- `GET /api/favorites`
- `POST /api/favorites/{productId}`
- `DELETE /api/favorites/{productId}`
- `GET /api/favorites/{productId}`

### Admin
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
- `GET /api/admin/dashboard/stats`
- `GET /api/admin/analytics`
- `PUT /api/admin/inventory/update`
- `GET /api/admin/inventory`
- `GET /api/admin/inventory/history?productVariantId=&limit=50`
- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PUT /api/admin/coupons/{id}`
- `DELETE /api/admin/coupons/{id}`
- `GET /api/admin/banners`
- `POST /api/admin/banners`
- `PUT /api/admin/banners/{id}`
- `DELETE /api/admin/banners/{id}`
- `GET /api/admin/reports/sales/export`
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
- `OrderNote`
- `Favorite`
- `Coupon`
- `Payment`
- `OrderStatusHistory`
- `StockMovement`

---

## 6) Migraciones (Flyway)

Ubicacion: `backend/src/main/resources/db/migration`

Migraciones principales:
- `V12__coupons_full_system.sql`
- `V13__order_tracking.sql`
- `V14__analytics_tables.sql`
- `V15__seed_products_after_fix.sql`
- `V16__add_order_notes.sql`
- `V17__add_product_variant_version.sql`
- `V18__add_indexes.sql`
- `V19__add_product_marketing_fields.sql`
- `V20__create_banners.sql`
- `V21__seed_product_marketing.sql`
- `V22__add_order_item_packed.sql`
- `V23__create_stock_movements.sql`
- `V24__create_order_notes.sql`
- `V25__create_favorites.sql`
- `V26__create_password_reset_tokens.sql`
- `V27__refresh_products_real_catalog.sql`

---

## 7) Seguridad

- JWT en `Authorization: Bearer <token>`
- `JwtAuthenticationFilter` valida tokens
- Roles: `/api/admin/**` requiere ADMIN
- `/api/health` es publico
- Rate limiting para login
- Headers de seguridad:
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Content-Security-Policy`

---

## 8) Cache (Redis)

Cache para productos y busquedas:

```java
@Cacheable("products")
```

Redis configurado en `application.yml` y `docker-compose.yml`.

---

## 9) Email

`EmailService` usa SMTP para:
- Confirmacion de pedido
- Pago confirmado
- Pedido enviado
- Recuperacion de contraseña

Variables en `.env` / `docker-compose.yml`.
Si SMTP no esta configurado, el checkout no se bloquea (loggea el error).

---

## 10) Cloudinary

`ImageUploadService` simula subida.
Se configura `CLOUDINARY_URL` en entorno.

---

## 11) Frontend: rutas clave

Publicas:
- `/`
- `/productos`
- `/producto/[id]`
- `/login`
- `/registro`
- `/recuperar-password`
- `/carrito`
- `/checkout`

Usuario:
- `/mis-pedidos`
- `/mis-pedidos/[id]`
- `/mi-perfil`
- `/mi-cuenta/favoritos`

Admin:
- `/admin/dashboard`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/edit/[id]`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/inventory`
- `/admin/coupons`
- `/admin/users`
- `/admin/banners`

---

## 12) Usuarios de prueba

Cliente:
- `cliente@tiendajuanes.com`
- `Cliente1234`

Admin:
- `admin@tiendajuanes.com`
- `Admin1234`

---

## 13) Diagnostico rapido

Si solo ves 2 productos en frontend:
1. Verifica backend levantado.
2. Verifica count:

```bash
sudo docker-compose exec postgres psql -U juanes -d juanes -c "SELECT count(*) FROM products;"
```

3. Si Flyway falla en `V15`, borra la fila de error:

```bash
sudo docker-compose exec postgres psql -U juanes -d juanes -c "DELETE FROM flyway_schema_history WHERE version='15';"
sudo docker-compose up -d --build backend
```

Si el banner de estado en footer no aparece:
- Verifica que backend y `/api/health` respondan.
- Rebuild del frontend/stack.

---

## 14) Performance y estabilidad (resumen)

- Dashboard usa queries agregadas en SQL (evita streams sobre entidades).
- Queries criticas usan `JOIN FETCH` o `@EntityGraph` para evitar N+1.
- Inventario protegido con optimistic locking en `ProductVariant`.
- Indices en `orders.status`, `orders.created_at` y `products.ref_code`.
- Dashboard y "Lo mas vendido" calculados con SQL agregado.

## 15) Cambios UX recientes (fase 2026-03-18)

- Mensajeria de UI migrada de toasts a pop alerts con cierre manual.
- Redes sociales visibles solo en landing:
  - Boton `Redes` desplegable (Instagram, TikTok, WhatsApp)
  - Boton fijo `Soporte`
- Checkout usa botones visuales para metodos de pago (PSE, Transferencia, Contraentrega).
- Notas de checkout y notas internas admin limitadas a 300 caracteres.
- Galeria de producto con expansion de imagen y navegacion por teclado en modal.
- Botones `Atras` en vistas accionables clave.
- Favoritos y nombre en navbar se actualizan sin recargar.
- Flujo de recuperacion de contraseña habilitado (`/recuperar-password`).

## 16) Actualizacion tecnica reciente

- Validaciones de perfil y direcciones alineadas con registro:
  - nombres/apellidos solo letras y espacios
  - celular 10 digitos
  - documento 6-15 digitos
  - direccion con patron y longitud controlada
- Modal de agregar al carrito en catalogo incluye cantidad y se cierra automaticamente al confirmar.
- Vista de detalle de producto para visitante no logeado prioriza informacion y bloquea compra.
- Flujo admin de "Pedido empacado" habilitado para estados `PENDING`, `PAID` y `PACKING` con checklist completo.
- Nueva migracion: `V27__refresh_products_real_catalog.sql` (catalogo con imagenes reales y datos comerciales mas concretos).
- Accesibilidad base reforzada:
  - anillo de foco global con `:focus-visible`
  - cierre de dialogos con tecla `Esc`
  - galeria expandida con navegacion por flechas y botones prev/sig
- Validaciones frontend centralizadas en `frontend/services/validation.ts` para login, registro, perfil y recuperacion.
- Script de smoke QA: `scripts/qa-smoke.sh` (home, health, productos y busqueda).
- Cobertura adicional en admin:
  - `caption` y `scope` en tablas de pedidos/productos/inventario/cupones/usuarios
  - formularios de cupones/banners con submit por teclado (`Enter`)
  - acciones clave con `aria-label` (editar, eliminar, ver, cambiar estado, ajustes)
- Cobertura cliente en accesibilidad:
  - `/productos`: buscador/filtros/orden con `aria-label` y feedback asistivo
  - `/checkout`: submit por teclado, `aria-label` y `radiogroup` para metodos de pago
  - `/mis-pedidos`: listado semantico (`ul/li`) y labels de navegacion
  - `/mis-pedidos/[id]`: timeline semantico (`ol/li`) con `aria-current`
  - `/mi-perfil`: formularios con submit por `Enter` en datos personales, direcciones y contrasena
- Build fix Next.js:
  - `/recuperar-password` envuelve el componente que usa `useSearchParams` en `Suspense`, evitando error de prerender.
