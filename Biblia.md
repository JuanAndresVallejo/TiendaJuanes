# Biblia de checklist - Tienda Juanes (estado actual)

## 1) Admin pedidos (objetivos iniciales)
- [x] Vista `/admin/orders/[id]` creada y navegable desde listado
- [x] Muestra info del pedido (cliente, correo, telefono, direccion, metodo, estado, fecha, total)
- [x] Checklist visual con checkbox (estado local)
- [x] Boton "Pedido empacado" cambia `PACKING -> SHIPPED`
- [x] Endpoint `GET /api/admin/orders/{id}` con `OrderDetailDTO`
- [x] No se devuelven entidades JPA directamente

## 2) Estabilidad / performance
- [x] LazyInitializationException en `Order.items` resuelto con `JOIN FETCH`
- [x] Dashboard usa queries agregadas (no streams en memoria)
- [x] JWT genera `ROLE_ADMIN` (alineado con Spring Security)
- [x] Paginacion en `/api/admin/orders?page&size`
- [x] Indices en DB (`orders.status`, `orders.created_at`, `products.ref_code`)
- [x] Optimistic locking en `ProductVariant`
- [x] Handler 409 para conflictos de inventario

## 3) Checklist empaque con persistencia (Feature 1)
- [x] Campo `packed` en `OrderItem`
- [x] Endpoint `PATCH /admin/orders/{id}/items/{itemId}/pack`
- [x] Persistencia real del checklist

## 4) Historial inventario (Feature 2)
- [x] Tabla `stock_movements`
- [x] Endpoint `GET /admin/inventory/history`
- [x] UI en admin

## 5) Export CSV ventas (Feature 3)
- [x] Endpoint `GET /admin/reports/sales/export`
- [x] Descarga automatica desde admin

## 6) Busqueda avanzada productos (Feature 4)
- [x] Endpoint unificado `/products?search=...`
- [x] Busqueda en tiempo real

## 7) Favoritos cliente (Feature 5)
- [x] Tabla `favorites`
- [x] Endpoints CRUD
- [x] Pagina `/mi-cuenta/favoritos`

## 8) Notas internas admin (Feature 6)
- [x] Tabla `order_notes`
- [x] Endpoints admin
- [x] UI en panel admin

## 9) Features Shopify (1-20)
- [x] Productos destacados (backend + UI)
- [x] Mas vendidos (backend + UI)
- [x] Productos nuevos (backend + UI)
- [x] Tags (nuevo/oferta/limitado)
- [x] Badge "OFERTA"
- [x] Banner promocional editable
- [x] Contador productos en carrito
- [x] Historial pedidos cliente (`/mis-pedidos`)
- [x] Reordenar pedido
- [x] Estado visual del pedido (barra tracking en detalle)
- [x] Direccion multiple cliente (Address)
- [x] Autocompletar direccion guardada en checkout
- [x] Guardar carrito en DB (cart_items)
- [x] Productos relacionados
- [x] Recientemente vistos (localStorage)
- [x] Cupon de descuento en checkout
- [x] Codigo QR en pedido
- [x] Paginacion catalogo (client-side, 20)
- [x] Ordenar productos (precio/nombre/ventas)
- [x] SEO dinamico (meta title/description)

## 10) UX cliente (funciones pedidas previamente)
- [x] Navbar cambia segun login y muestra nombre
- [x] Navbar invitado solo muestra Productos + Iniciar sesion
- [x] Boton "Crear cuenta" desaparece al logearse
- [x] Carrito sin refresh al editar cantidades
- [x] No permite checkout si carrito vacio
- [x] Campo "Notas u observaciones" en checkout
- [x] Cupon validado antes de permitir checkout
- [x] Agregar al carrito desde catalogo pide talla y color
- [x] Productos sin stock visibles pero bloquean anadir al carrito
- [x] Mis pedidos muestra fecha y hora
- [x] Detalle de pedido muestra nombre, referencia, precio y subtotal
- [x] Registro con departamento/ciudad dependiente
- [x] "Mi perfil" con edicion + reglas de validacion
- [x] Multiples direcciones y anadir nueva
- [x] Editar y eliminar direcciones guardadas
- [x] Tracking con estados (Pago confirmado -> Empacando -> Enviado -> Entregado)
- [ ] Regla express ambigua (Medellin vs municipios) sin decision final de negocio
- [x] Catalogo usa paginacion backend (`/api/products/paged`)
- [x] Favoritos cliente disponibles en detalle de producto

## 11) UX admin (pedidos/inventario/cupones)
- [x] Navbar admin solo muestra Panel admin + Cerrar sesion
- [x] Admin no puede acceder a carrito/checkout
- [x] Pedidos admin muestran hora de pago
- [x] Checklist de empaque habilita boton solo si todo esta marcado
- [x] Inventario con ajuste por input (+20 / -15) y vista de imagen
- [x] UI de cupones mas clara con validaciones basicas
- [x] Historial de inventario en admin
- [x] Notas internas en detalle de pedido
- [x] Export CSV desde admin pedidos
