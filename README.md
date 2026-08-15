# TCG NQN — Tienda online

E-commerce de cartas coleccionables construido con **Next.js** + **Supabase** (Auth + Postgres + RLS). Checkout con pago online vía **Mercado Pago** (se activa desde el panel admin con el access token) o coordinado por WhatsApp/transferencia.

## Stack

- Next.js 16 (App Router, Turbopack)
- Supabase (Auth por email, Postgres, Row Level Security)
- Tailwind CSS
- Server Actions para mutaciones

## Estructura

```
app/                 # Páginas (catálogo, carrito, checkout, cuenta, admin)
components/          # Navbar, tarjetas de producto, formularios
lib/                 # Clientes de Supabase, acciones, datos, tipos, carrito
supabase/migrations/ # SQL del schema (products, orders, order_items, profiles + RLS)
scripts/             # Utilidades de base de datos
proxy.ts             # Middleware de auth (protege /account, /checkout, /admin)
```

## Variables de entorno

Creá un archivo `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>
SUPABASE_SECRET_KEY=<secret key>          # solo server, nunca expongas
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Puesta en marcha local

```bash
npm install
npm run dev        # http://localhost:3000
```

### Base de datos (una vez)

```bash
# Aplicar schema (drop + recreate + RLS). Borra el contenido de public.
node scripts/migrate.js

# Restaurar grants por defecto de Supabase (si migraste sobre el schema public)
node scripts/fix-grants.js

# Sembrar productos de ejemplo
node scripts/seed.js

# Promover a un usuario existente como admin
node scripts/make-admin.js email@dominio.com
```

## Roles

- **Cliente**: crea cuenta en `/login`, compra (carrito → checkout), ve sus pedidos en `/account`.
- **Admin**: una vez que su cuenta tiene `role = 'admin'` en `profiles`, accede al panel en `/admin` (productos CRUD + estado de pedidos).

## Deploy en Vercel

1. Subí el repo a GitHub (`git push origin main`).
2. En [vercel.com/new](https://vercel.com/new) importá el repositorio.
3. Agregá las variables de entorno (idénticas a `.env.local`, pero con `NEXT_PUBLIC_SITE_URL=https://<tu-dominio>.vercel.app`).
4. Build: `npm run build` (config por defecto). Deploy.
5. En **Supabase → Authentication → URL Configuration**, agregá la URL de Vercel a *Site URL* y *Redirect URLs* para que el email de confirmación apunte al dominio correcto.

> Nota: si activás la confirmación de email, los clientes nuevos deben confirmar el correo antes de poder iniciar sesión.
