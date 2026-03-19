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

Actualizacion de fase (2026-03-18):
- Se reforzo acceso admin en frontend para evitar llamadas prematuras que derivaban en 403.
- Se estabilizo busqueda/filtros en catalogo y busqueda desde navbar.
- Se aplico limite de 300 caracteres a notas de checkout y notas internas admin (frontend + backend).
- Se cambio el sistema de mensajes de toast a pop alerts con cierre manual.
- Se agrego flujo de recuperacion de contraseña con token (`/api/auth/forgot-password`, `/api/auth/reset-password`) y pagina `/recuperar-password`.
- Se actualizaron metodos de pago en checkout a botones visuales con iconos (PSE, Transferencia, Contraentrega).
- Se mejoro detalle de producto con galeria expandible y navegacion por teclado en modal de imagen.
- Se agregaron botones "Atras" en vistas criticas.
- Se movieron redes/soporte para que aparezcan solo en landing.
- Se actualizo modal de "Añadir al carrito" en catalogo con cantidad y cierre automatico tras confirmar.
- Se reforzo vista detalle para usuario no logeado (mas informativa y sin compra habilitada).
- Se habilito "Pedido empacado" desde estados `PENDING`, `PAID` y `PACKING` cuando checklist esta completo.
- Se mejoraron validaciones de perfil/direcciones para alinear reglas de registro.
- Se preparo migracion `V27__refresh_products_real_catalog.sql` para catalogo con imagenes reales y datos comerciales mas concretos.
- Se avanzo accesibilidad de teclado:
  - foco visible global (`:focus-visible`)
  - cierre por `Esc` en modales clave (alerts, detalle usuario admin, selector de especificaciones)
  - visor de galeria con controles prev/next y soporte flechas del teclado
- Se unificaron validaciones frontend (login/registro/perfil/recuperacion) con reglas compartidas.
- Se agrego script de hardening rapido `scripts/qa-smoke.sh` para regresion basica.
- Se amplio accesibilidad en vistas admin restantes:
  - tablas con `caption` y `scope="col"`
  - formularios de cupones y banners enviables con `Enter`
  - controles admin con `aria-label` en acciones criticas
  - inventario soporta `Enter` para aplicar ajuste rapido
- Se amplio accesibilidad en vistas cliente clave:
  - `/productos` con labels ARIA en busqueda, filtros y orden
  - `/checkout` con formulario enviable por teclado, labels ARIA y radiogroup de metodos de pago
  - `/mis-pedidos` y `/mis-pedidos/[id]` con estructura semantica de lista/timeline
  - `/mi-perfil` con formularios enviables por `Enter` (datos, direcciones y contrasena)
- Fix de build Next.js en `/recuperar-password`: `useSearchParams` ahora envuelto en `Suspense`.

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
- Carrusel de marcas en landing
- Filtros en productos con selects (categoria, marca, talla)
- Landing con boton `Redes` desplegable + boton fijo `Soporte`
- Checklist de empaque en detalle de pedido admin (persistente por item)
- Catalogo paginado (20 por pagina) y ordenado (precio/nombre/ventas)
- Busqueda en tiempo real unificada en catalogo
- Carrito con contador en navbar y actualizacion sin refrescar
- Productos sin stock visibles pero bloqueados para compra
- Recuperacion de contraseña disponible desde login

---

### 5) Infraestructura

`docker-compose up` levanta todo:
- nginx (proxy)
- backend
- frontend
- postgres
- redis

Dev-only:
- Banner de estado en footer para monitoreo rapido de servicios.

---

## Proximos pasos sugeridos

1. Confirmar backend y DB en limpio
2. Conectar MercadoPago real
3. Configurar SMTP real para emails
4. Deploy en servidor propio
5. (Opcional) Mejoras adicionales de admin y reportes
6. (Opcional) Mejoras a favoritos (icono en cards, filtros)

## Backlog siguiente revision (pendiente)

1. Revisar accesibilidad en paginas complementarias (landing, login, registro, favoritos, carrito) con lector de pantalla.
2. Construir formulario de direccion estructurada por segmentos (tipo via, numero, complemento) para registro/perfil.
3. Afinar reglas de negocio de estados de pedido para evitar cambios inconsistentes por flujo de pago.
4. Integrar pipeline de QA automatizada (lint + build + pruebas API/frontend) en entorno CI.
5. Revisar contraste visual y lectura con lector de pantalla (NVDA/VoiceOver) en admin + cliente.
