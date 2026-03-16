# Biblia de checklist — Tienda Juanes (estado actual)

## 1) Admin pedidos (objetivos iniciales)
- [x] Vista `/admin/orders/[id]` creada y navegable desde listado
- [x] Muestra info del pedido (cliente, correo, teléfono, dirección, método, estado, fecha, total)
- [x] Checklist visual con checkbox (estado local)
- [x] Botón “Pedido empacado” cambia `PACKING → SHIPPED`
- [x] Endpoint `GET /api/admin/orders/{id}` con `OrderDetailDTO`
- [x] No se devuelven entidades JPA directamente

## 2) Estabilidad / performance
- [x] LazyInitializationException en `Order.items` resuelto con `JOIN FETCH`
- [x] Dashboard usa queries agregadas (no streams en memoria)
- [x] JWT genera `ROLE_ADMIN` (alineado con Spring Security)
- [x] Paginación en `/api/admin/orders?page&size`
- [x] Índices en DB (`orders.status`, `orders.created_at`, `products.ref_code`)
- [x] Optimistic locking en `ProductVariant`
- [x] Handler 409 para conflictos de inventario

## 3) Checklist empaque con persistencia (Feature 1)
- [ ] Campo `packed` en `OrderItem`
- [ ] Endpoint `PATCH /admin/orders/{id}/items/{itemId}/pack`
- [ ] Persistencia real del checklist (solo visual hoy)

## 4) Historial inventario (Feature 2)
- [ ] Tabla `stock_movements`
- [ ] Endpoint `GET /admin/inventory/history`
- [ ] UI en admin

## 5) Export CSV ventas (Feature 3)
- [ ] Endpoint `GET /admin/reports/sales/export`
- [ ] Descarga automática desde admin

## 6) Búsqueda avanzada productos (Feature 4)
- [⚠️] Hay `search` y `filter` separados, falta `/products?search=...` unificado
- [ ] Búsqueda en tiempo real

## 7) Favoritos cliente (Feature 5)
- [ ] Tabla `favorites`
- [ ] Endpoints CRUD
- [ ] Página `/mi-cuenta/favoritos`

## 8) Notas internas admin (Feature 6)
- [ ] Tabla `order_notes`
- [ ] Endpoints admin
- [ ] UI en panel admin

## 9) Features Shopify (1–20)
- [x] Productos destacados (backend + UI)
- [x] Más vendidos (backend + UI)
- [x] Productos nuevos (backend + UI)
- [x] Tags (nuevo/oferta/limitado)
- [x] Badge “OFERTA”
- [x] Banner promocional editable
- [x] Contador productos en carrito
- [x] Historial pedidos cliente (`/mis-pedidos`)
- [x] Reordenar pedido
- [x] Estado visual del pedido (barra tracking en detalle)
- [x] Dirección múltiple cliente (Address)
- [x] Autocompletar dirección guardada en checkout
- [x] Guardar carrito en DB (cart_items)
- [x] Productos relacionados
- [x] Recientemente vistos (localStorage)
- [x] Cupón de descuento en checkout
- [x] Código QR en pedido
- [x] Paginación catálogo (client-side, 20)
- [x] Ordenar productos (precio/nombre/ventas)
- [x] SEO dinámico (meta title/description)

## 10) UX cliente (funciones pedidas previamente)
- [x] Navbar cambia según login y muestra nombre
- [x] Navbar invitado solo muestra Productos + Iniciar sesión
- [x] Botón “Crear cuenta” desaparece al logearse
- [x] Carrito sin refresh al editar cantidades
- [x] No permite checkout si carrito vacío
- [x] Campo “Notas u observaciones” en checkout
- [x] Cupón validado antes de permitir checkout
- [x] Agregar al carrito desde catálogo pide talla y color
- [x] Productos sin stock visibles pero bloquean añadir al carrito
- [x] Mis pedidos muestra fecha y hora
- [x] Detalle de pedido muestra nombre, referencia, precio y subtotal
- [x] Registro con departamento/ciudad dependiente
- [x] “Mi perfil” con edición + reglas de validación
- [x] Múltiples direcciones y añadir nueva
- [x] Editar y eliminar direcciones guardadas
- [x] Tracking con estados (Pago confirmado → Empacando → Enviado → Entregado)
- [⚠️] Regla express ambigua (Medellín vs municipios) sin decisión final de negocio
- [x] Catálogo usa paginación backend (`/api/products/paged`)

## 11) UX admin (pedidos/inventario/cupones)
- [x] Navbar admin solo muestra Panel admin + Cerrar sesión
- [x] Admin no puede acceder a carrito/checkout
- [x] Pedidos admin muestran hora de pago
- [x] Checklist de empaque habilita botón solo si todo está marcado
- [x] Inventario con ajuste por input (+20 / -15) y vista de imagen
- [x] UI de cupones más clara con validaciones básicas
