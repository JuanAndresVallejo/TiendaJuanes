# GitHub y GitHub Pages (Guía paso a paso)

Este documento explica cómo:
1. Subir el proyecto a un repositorio nuevo en GitHub.
2. Publicar el **frontend** en GitHub Pages (modo estático).

Importante: GitHub Pages **solo sirve contenido estático**. El backend (Spring Boot) y la base de datos **deben estar desplegados en otro servidor** si quieres que la tienda funcione 100% online.

---

## 1) Subir el proyecto a GitHub

Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Initial commit: Tienda Juanes ecommerce"
```

Luego crea un repositorio nuevo en GitHub (web) y copia la URL. Ejemplo:
`https://github.com/tu-usuario/tienda-juanes-ecommerce.git`

```bash
git remote add origin https://github.com/tu-usuario/tienda-juanes-ecommerce.git
git branch -M main
git push -u origin main
```

---

## 2) Publicar en GitHub Pages (solo frontend)

### Limitaciones
- GitHub Pages no ejecuta backend.
- Necesitas un backend público (Render, Railway, Fly.io, etc.).
- El frontend debe apuntar al backend público mediante `NEXT_PUBLIC_API_URL`.

### Pasos

1) Configura una URL pública para tu backend (ejemplo):

```
https://api.tiendajuanes.com
```

2) En GitHub Pages, el frontend debe generar HTML estático.
Para eso, crea una rama o un ajuste exclusivo para Pages:

En `frontend/next.config.js`:

```js
const nextConfig = {
  output: "export",
  basePath: "/tienda-juanes-ecommerce",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" }
    ]
  }
};
```

Nota: el carrusel de marcas usa logos locales en `frontend/public/brands`, no requiere dominios remotos.

3) Construye el sitio estático:

```bash
cd frontend
NEXT_PUBLIC_API_URL=https://api.tiendajuanes.com NEXT_PUBLIC_STATUS_BANNER=false npm run build
```

Esto genera la carpeta `frontend/out`.

4) Publica `out` en GitHub Pages.

Opción rápida:

```bash
npx gh-pages -d out
```

Opción recomendada (GitHub Actions): crea un workflow que compile `frontend` y publique `out` en `gh-pages`.

5) En GitHub:
Repositorio → Settings → Pages → Branch: `gh-pages` / `/ (root)`

---

## 3) URLs finales

- Frontend (GitHub Pages):  
  `https://tu-usuario.github.io/tienda-juanes-ecommerce`

- Backend (ejemplo):  
  `https://api.tiendajuanes.com`

---

## 4) Nota sobre producción real

GitHub Pages sirve para demo rápida.  
Para producción completa se recomienda:

- Frontend en Vercel o Netlify.
- Backend en Render, Railway, Fly.io o un VPS propio.
- PostgreSQL administrado (Railway, Supabase, Render).
