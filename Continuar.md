# Continuar - contexto rapido del proyecto

## Estado general
El ecommerce esta construido y funcional, con backend en Spring Boot + PostgreSQL y frontend en Next.js + Tailwind.
Se anadieron cupones, tracking, emails, analytics, cache Redis, y mejoras de seguridad.
Se incorporo un banner de estado en el footer (solo dev) que consulta `/api/health` para verificar servicios.
Se agrego detalle de pedidos para admin y mejoras de performance en queries (N+1, dashboard).
Se implementaron features tipo Shopify: destacados, mas vendidos, nuevos, tags, descuentos, relacionados y recientemente vistos.
Checkout ahora soporta PSE (MercadoPago), Transferencia y Contraentrega con validacion de cupones.
Se agregaron favoritos cliente, notas internas admin, export CSV de ventas, historial de inventario y persistencia del checklist de empaque.
La busqueda de productos se unifico en `/api/products` con filtros y search.

---

## Lo mas importante para continuar

### 1) Seed de productos (50)
El seed esta en `V15__seed_products_after_fix.sql` y es idempotente.
Ahora genera productos de ropa, calzado y accesorios (con actualizacion de datos si ya existen).
Si Flyway falla en esa migracion:

```bash
sudo docker-compose exec postgres psql -U juanes -d juanes -c "DELETE FROM flyway_schema_history WHERE version='15';"
sudo docker-compose up -d --build backend
```

Verifica:

```bash
sudo docker-compose exec postgres psql -U juanes -d juanes -c "SELECT count(*) FROM products;"
```

Debe ser `50`.

---

### 2) Usuarios de prueba

- Cliente: `cliente@tiendajuanes.com` / `Cliente1234`
- Admin: `admin@tiendajuanes.com` / `Admin1234`

---

### 3) Integraciones pendientes

- MercadoPago: hay estructura, pero falta credencial real en entorno.
- Email: requiere SMTP real en variables (si no existe, el flujo no se bloquea).
- Cloudinary: requiere `CLOUDINARY_URL`.

---

### 4) Frontend

Rutas clave:
- `/productos`, `/producto/[id]`, `/carrito`, `/checkout`
- `/mis-pedidos`, `/mis-pedidos/[id]`
- `/mi-perfil` (perfil cliente)
- `/mi-cuenta/favoritos`
- `/admin/*` con panel completo
- `/admin/orders/[id]` (detalle de pedido para empaque)

UI reciente:
- Carrusel de marcas con logos locales en `frontend/public/brands`
- Filtros en productos con selects (categoria, marca, talla)
- Botones de redes: WhatsApp, Instagram y TikTok
- Checklist de empaque en detalle de pedido admin (persistente por item)
- Catalogo paginado (20 por pagina) y ordenado (precio/nombre/ventas)
- Busqueda en tiempo real unificada en catalogo
- Carrito con contador en navbar y actualizacion sin refrescar
- Productos sin stock visibles pero bloqueados para compra

---

### 5) Infraestructura

`docker-compose up` levanta todo:
- nginx (proxy)
- backend
- frontend
- postgres
- redis

Dev-only:
- Banner de estado en footer. Control por `NEXT_PUBLIC_STATUS_BANNER` (true en docker).

---

## Proximos pasos sugeridos

1. Confirmar backend y DB en limpio
2. Conectar MercadoPago real
3. Configurar SMTP real para emails
4. Deploy en servidor propio
5. (Opcional) Mejoras adicionales de admin y reportes
6. (Opcional) Mejoras a favoritos (icono en cards, filtros)
