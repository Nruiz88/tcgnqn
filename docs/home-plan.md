# Plan — Home (base)

Guía de verificación para la página de inicio.

## Interfaz

- [x] Hero oscuro con gradiente, badge, CTAs (Explorar juegos / Ver productos)
- [x] Hub de juegos TCG (8 juegos con gradiente, filtro `?game=`)
- [x] Filtro combinado juego + categoría
- [x] Badge de juego en tarjetas (ProductCard)
- [x] Badge de stock bajo / agotado en tarjetas
- [x] CRUD de juegos en admin (`/admin/games`) + selector en producto
- [x] Features (4 sellos de confianza)
- [x] Categorías (4 tarjetas con emoji)
- [x] Productos destacados (grid, hasta 8)
- [x] CTA final "¿No encontrás lo que buscás?"
- [x] Navbar sticky + footer
- [x] Barra de búsqueda en navbar (base: search, desktop + mobile)
- [x] Filtrado real por categoría (tabla categories + query param `?cat=`)
- [x] Corazón de wishlist en tarjetas (módulo wishlist)
- [x] Badge de stock bajo / agotado en tarjetas
- [x] Sección "Novedades" (recién llegados)
- [x] Tipografía moderna (Space Grotesk en títulos + Geist en texto)
- [x] Hero con patrón de cuadrícula, tarjetas flotantes y marquee de juegos
- [ ] Página "Ver todo" con paginación
- [x] Campo de cupón en checkout (módulo coupons)
- [x] Selección de método de pago en checkout (transferencia / WhatsApp / MP)
- [x] Instrucciones de transferencia según método (alias/CVU)

## Funcionalidad

- [x] `getProducts()` filtra solo productos activos
- [x] `ProductCard` (imagen o placeholder, precio ARS)
- [x] Anclas de navegación (`#productos`)
- [x] Búsqueda funcional por nombre/descripción (`searchProducts` con pg_trgm)
- [x] Filtro por categoría real (consulta a tabla categories + `getProductsByCategory`)
- [ ] Link WhatsApp real en el CTA (módulo payments.whatsapp)
- [ ] Metadata/SEO (og tags, descripción por página)

## Notas

- [x] Categorías ya no hardcodeadas: se leen de la tabla `categories`.
- [x] Productos con `category_id` (relación `products.category_id → categories.id`).
