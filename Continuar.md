# Continuar – contexto rápido del proyecto

## Estado general
El ecommerce está construido y funcional, con backend en Spring Boot + PostgreSQL y frontend en Next.js + Tailwind.  
Se añadieron cupones, tracking, emails, analytics, cache Redis, y mejoras de seguridad.

---

## Lo más importante para continuar

### 1) Seed de productos (50)
El seed está en `V15__seed_products_after_fix.sql` y es idempotente.
Si Flyway falla en esa migración:

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
- Email: requiere SMTP real en variables.
- Cloudinary: requiere `CLOUDINARY_URL`.

---

### 4) Frontend

Rutas clave:
- `/productos`, `/producto/[id]`, `/carrito`, `/checkout`
- `/mis-pedidos`, `/mis-pedidos/[id]`
- `/admin/*` con panel completo

---

### 5) Infraestructura

`docker-compose up` levanta todo:
- nginx (proxy)
- backend
- frontend
- postgres
- redis

---

## Próximos pasos sugeridos

1. Confirmar backend y DB en limpio
2. Conectar MercadoPago real
3. Deploy en servidor propio
