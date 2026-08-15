# Arquitectura — Base reusable de e-commerce

Template reusable de e-commerce (Next.js + Supabase). **Base fija** (siempre incluida)
+ **módulos extras** activables/desactivables por config y env vars.

---

## PARTE A — Base fija (no configurable)

| Componente | Descripción | Estado |
|---|---|---|
| `shop` | Catálogo + detalle de producto | ✅ base |
| `search` | Búsqueda por nombre/descripción (Supabase pg_trgm) + barra en navbar | ✅ base |
| `categories` | Tabla categories, asignación por producto, filtro en home/catálogo | ✅ base |
| `cart` | Carrito (localStorage) | ✅ base |
| `checkout` | Flujo de compra | ✅ base |
| `auth` | Login/registro clientes + cuenta | ✅ base |
| `admin` | Panel admin (productos, pedidos, categorías) | ✅ base |

Archivos clave: `app/(store)/`, `lib/`, `proxy.ts`, `lib/modules/`.

---

## PARTE B — Módulos extras (config.ts + env vars)

### Módulos de pago

| Módulo | Default | Activación | Comportamiento |
|---|---|---|---|
| `payments.transferencia` | ON | siempre | Checkout muestra alias/CBU + instrucciones | ✅ implementado |
| `payments.whatsapp` | ON* | si `NEXT_PUBLIC_WHATSAPP` existe | Botón wa.me con resumen carrito/producto | ✅ implementado |
| `payments.mercadopago` | OFF | toggle en Panel admin → Configuración (token guardado en `payment_settings`) | Preferencia de pago, redirect a MP, webhook de confirmación, auto-confirm del pedido al aprobarse | ✅ implementado |

### Módulos de envío

| Módulo | Default | Activación | Comportamiento |
|---|---|---|---|
| `shipping.correo_argentino` | OFF | `CORREO_ARGENTINO_USER_TOKEN` + `PASSWORD_TOKEN` + `SENDER_CP` | Cotización real (Paq.AR) a domicilio/sucursal, guía desde admin, tracking | ✅ implementado |
| `shipping.pickup` | ON | siempre | Retiro en el local (fallback si no hay credenciales) | ✅ implementado |

### Módulos de negocio

| Módulo | Default | Activación | Comportamiento |
|---|---|---|---|
| `wishlist` | ON | siempre (usa auth) | Favoritos por usuario, corazón en tarjetas, página dedicada | ✅ implementado |
| `coupons` | OFF | env var | Códigos %/fijo, fechas, límite de uso; se aplican en checkout | ✅ implementado |
| `orders_notifications` | ON* | si `NEXT_PUBLIC_WHATSAPP` o email config | Aviso al cliente y admin al crear pedido | ✅ implementado (WhatsApp) |

### Placeholders futuros (patrón a replicar)

`reviews`, `newsletter`, `blog`, `stock_alerts`, `compare`, `related_products`,
`loyalty_points`, `factura`, `terms`, `faq`, `gift_cards`, `preorders`.

---

## Sistema de módulos

- `lib/modules/config.ts` — registro central `{ 'payments.transferencia': true, ... }`
- Override por env var (`NEXT_PUBLIC_MODULES`, `ENABLE_PAYMENTS_*`, etc.)
- Helper `isEnabled('...')` y `requireModule('...')` → 404 si está off
- Navbar/proxy consultan config antes de renderizar/proteger

## Interfaces

- `PaymentGateway { id, label, enabled, renderCheckout(), processOrder() }`
  - Si hay 1 método activo → se usa; si hay varios → el cliente elige
- `ShippingGateway { id, label, enabled, quote(), createLabel(), track() }`

## Env vars

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_MODULES` | Lista de módulos activos (override) |
| `NEXT_PUBLIC_WHATSAPP` | Número del negocio (activa payments.whatsapp y orders_notifications) |
| `ENABLE_COUPONS` | Activa coupons |
| `CORREO_ARGENTINO_API_URL` | URL base de la API MiCorreo (default prod) |
| `CORREO_ARGENTINO_USER_TOKEN` / `PASSWORD_TOKEN` | HTTP Basic → JWT (`POST /token`) |
| `CORREO_ARGENTINO_CUSTOMER_ID` | customerId de MiCorreo (saltea /users/validate) |
| `CORREO_ARGENTINO_EMAIL` / `PASSWORD` | Para `/users/validate` si no hay CUSTOMER_ID |
| `CORREO_ARGENTINO_SENDER_CP` | Código postal de origen (obligatorio) |
| `CORREO_ARGENTINO_PKG_DIMS` | Dimensiones por defecto del paquete `largo,ancho,alto` (cm) |
| `NEXT_PUBLIC_PICKUP_LOCATION` | Dirección del local para el retiro (fallback) |
| Credenciales MP | (ya no se usan por env) — se cargan en Panel admin → Configuración → Mercado Pago |
