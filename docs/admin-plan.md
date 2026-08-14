# Plan — Panel Admin (base)

Guía de verificación para el panel de administración.

## Interfaz

- [x] Layout `/admin` con auth + rol admin (redirige a `/login` o `/`)
- [x] Navbar del panel: Productos · Pedidos
- [x] Lista de productos: imagen, nombre, precio, stock, badge Oculto
- [x] Botones Publicar/Ocultar y Editar por producto
- [x] Botón "Nuevo producto" → form crear
- [x] Form crear/editar producto (nombre, descripción, precio ARS, stock, URL imagen)
- [x] Lista de pedidos: nombre/tel/dirección, fecha, notas, total, items, selector de estado
- [x] CRUD de categorías (asignar al crear/editar producto)
- [ ] Dashboard con KPIs (productos activos, stock bajo, pedidos pendientes)
- [x] Gestión de cupones (CRUD admin + Pausar/Activar)
- [ ] Búsqueda y filtros en lista de productos
- [ ] Paginación de listas
- [ ] Upload de imagen a Supabase Storage (hoy solo URL)
- [ ] Detalle de pedido + badges de color por estado
- [x] Botón WhatsApp para contactar al cliente del pedido
- [x] Badge de color por estado de pedido
- [x] Descuento de cupón visible en pedido
- [ ] Confirmación en acciones destructivas
- [ ] Vista responsive del panel

## Funcionalidad

- [x] `proxy.ts` protege `/admin` (sesión + rol admin)
- [x] RLS: admin inserta/edita/oculta/borra productos, lee todos los pedidos
- [x] Server Actions: `createProduct`, `updateProduct`, `toggleProduct`, `updateOrderStatus`
- [x] Server Action: CRUD de categorías
- [ ] Generación de guía Correo Argentino desde pedido (módulo shipping)
