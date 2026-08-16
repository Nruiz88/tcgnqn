import Link from 'next/link'
import {
  Icon,
  PageHeader,
  type IconName,
} from '@/components/admin-ui'

function Section({
  id,
  icon,
  title,
  children,
}: {
  id: string
  icon: IconName
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
          <Icon name={icon} className="h-4 w-4" />
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-surface p-5 dark:border-neutral-800/60">
      {children}
    </div>
  )
}

function Pill({
  children,
  color = 'bg-neutral-100 text-neutral-600 ring-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-400 dark:ring-neutral-700/60',
}: {
  children: React.ReactNode
  color?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${color}`}
    >
      {children}
    </span>
  )
}

function HomeRow({
  storeSection,
  adminSource,
  sourceLink,
  note,
}: {
  storeSection: string
  adminSource: string
  sourceLink?: string
  note?: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-neutral-50/60 px-4 py-3 dark:border-neutral-800/60 dark:bg-neutral-900/30 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{storeSection}</p>
        {note && <p className="mt-0.5 text-xs text-neutral-500">{note}</p>}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
        <Icon name="arrowLeft" className="h-3.5 w-3.5 rotate-180" />
        {sourceLink ? (
          <Link
            href={sourceLink}
            className="font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
          >
            {adminSource}
          </Link>
        ) : (
          <span>{adminSource}</span>
        )}
      </div>
    </div>
  )
}

const SECTIONS = [
  { href: '#tipos', label: 'Tipos de contenido' },
  { href: '#cargar-producto', label: 'Cargar un producto' },
  { href: '#cargar-carta', label: 'Cargar una carta individual' },
  { href: '#campos', label: 'Campos clave' },
  { href: '#home', label: 'Mapa de la home' },
  { href: '#estados', label: 'Estados: publicado, oculto, destacado' },
  { href: '#pedidos', label: 'Pedidos' },
  { href: '#config', label: 'Configuración' },
]

export default function AdminGuiaPage() {
  return (
    <div>
      <PageHeader
        icon="sparkles"
        title="Guía del panel"
        description="Cómo funciona la carga de productos y dónde aparece cada cosa en la web"
      />

      {/* Índice */}
      <div className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="rounded-full border border-neutral-200 bg-surface px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-indigo-400/60 hover:text-indigo-600 dark:border-neutral-800/60 dark:text-neutral-400 dark:hover:text-indigo-400"
          >
            {s.label}
          </a>
        ))}
      </div>

      <div className="mt-8 space-y-10">
        {/* Tipos de contenido */}
        <Section id="tipos" icon="package" title="Los 3 tipos de contenido">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Icon name="package" className="h-4.5 w-4.5" />
                </span>
                <p className="font-semibold">Productos</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                Sobres, cajas, sleeves, protectores y cualquier ítem que se
                vende por unidad. Se cargan con categoría y juego (opcional).
              </p>
              <p className="mt-3 text-xs text-neutral-400">
                Panel → <b className="text-neutral-600 dark:text-neutral-300">Productos</b>
              </p>
            </Card>
            <Card>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                  <Icon name="fileText" className="h-4.5 w-4.5" />
                </span>
                <p className="font-semibold">Cartas individuales</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                Singles TCG con datos extra: set/expansión, condición, idioma y
                rareza. Se agrupan solas por colección en la home.
              </p>
              <p className="mt-3 text-xs text-neutral-400">
                Panel → <b className="text-neutral-600 dark:text-neutral-300">Cartas</b>
              </p>
            </Card>
            <Card>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Icon name="folder" className="h-4.5 w-4.5" />
                </span>
                <p className="font-semibold">Accesorios</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                Productos de la categoría Accesorios (binders, decks, fundas…).
                Tienen su propia sección en el panel y en la home.
              </p>
              <p className="mt-3 text-xs text-neutral-400">
                Panel → <b className="text-neutral-600 dark:text-neutral-300">Accesorios</b>
              </p>
            </Card>
          </div>
          <div className="mt-4">
            <Card>
              <p className="text-sm font-semibold">¿Cuál elijo?</p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-500">
                <li className="flex gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>
                    <b className="text-neutral-700 dark:text-neutral-200">Carta suelta</b>{' '}
                    (una sola carta de un juego) → <b>Carta individual</b>.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>
                    <b className="text-neutral-700 dark:text-neutral-200">Binder, toploader, sleeves, deckbox</b>{' '}
                    → <b>Accesorio</b>.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>
                    <b className="text-neutral-700 dark:text-neutral-200">Todo lo demás</b>{' '}
                    (boosters, cajas, colecciones selladas, merchandising) →{' '}
                    <b>Producto</b>.
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </Section>

        {/* Cargar producto */}
        <Section id="cargar-producto" icon="plus" title="Cómo cargar un producto">
          <Card>
            <ol className="space-y-4 text-sm text-neutral-500">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">1</span>
                <span>
                  Andá a <b className="text-neutral-700 dark:text-neutral-200">Productos → Nuevo producto</b>{' '}
                  (o <b>Accesorios → Nuevo accesorio</b> si es de esa categoría).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">2</span>
                <span>
                  Completá <b className="text-neutral-700 dark:text-neutral-200">nombre, precio y stock</b>.
                  La descripción es opcional pero recomendada.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">3</span>
                <span>
                  Pegá la <b className="text-neutral-700 dark:text-neutral-200">URL de la imagen</b> (o subí
                  el archivo en el caso de los juegos).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">4</span>
                <span>
                  Elegí <b className="text-neutral-700 dark:text-neutral-200">categoría y juego</b>. La
                  categoría define en qué sección aparece; el juego es opcional.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">5</span>
                <span>
                  Guardá. El producto queda <b className="text-neutral-700 dark:text-neutral-200">publicado</b>{' '}
                  y aparece en la web al instante.
                </span>
              </li>
            </ol>
          </Card>
        </Section>

        {/* Cargar carta */}
        <Section id="cargar-carta" icon="fileText" title="Cómo cargar una carta individual">
          <Card>
            <ol className="space-y-4 text-sm text-neutral-500">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">1</span>
                <span>
                  Andá a <b className="text-neutral-700 dark:text-neutral-200">Cartas → Nueva carta</b>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">2</span>
                <span>
                  Nombre, <b className="text-neutral-700 dark:text-neutral-200">juego</b> y{' '}
                  <b className="text-neutral-700 dark:text-neutral-200">set/expansión</b>{' '}
                  (el campo tiene autocompletado con todos los sets Pokémon).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">3</span>
                <span>
                  Condición (<b>NM, LP, MP, HP, DMG</b>), idioma y rareza. La rareza
                  (Holo, Rara, Ultra Rara…) se muestra como badge en la web.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">4</span>
                <span>
                  Precio, stock y URL de imagen (idealmente el arte de la carta).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">5</span>
                <span>
                  Guardá. La carta entra a la sección <b>Singles</b> de la home,
                  agrupada por su set.
                </span>
              </li>
            </ol>
          </Card>
        </Section>

        {/* Campos clave */}
        <Section id="campos" icon="info" title="Campos clave y cómo afectan a la web">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <p className="text-sm font-semibold">💾 Stock</p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-neutral-500">
                  La web muestra badges automáticos según el stock:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Pill color="bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400">0 · Agotado</Pill>
                  <Pill color="bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400">1–3 · ¡Últimas X!</Pill>
                  <Pill color="bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400">4+ · X disponibles</Pill>
                </div>
                <p className="text-xs text-neutral-400">
                  Con stock 0 el botón de compra queda deshabilitado con «Sin stock».
                </p>
              </div>
            </Card>
            <Card>
              <p className="text-sm font-semibold">🖼️ Imagen</p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-neutral-500">
                  Sin imagen el producto muestra un placeholder con el emoji de su
                  categoría. Las imágenes de los juegos (logos) se usan en la cinta
                  del hero, la sección «Elegí tu juego» y el footer.
                </p>
                <p className="text-xs text-neutral-400">
                  Consejo: imágenes cuadradas o de carta 5:7 se ven mejor.
                </p>
              </div>
            </Card>
            <Card>
              <p className="text-sm font-semibold">🏷️ Categoría</p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-neutral-500">
                  Define la sección donde vive el producto. Hoy existen:{' '}
                  <b className="text-neutral-700 dark:text-neutral-200">Cartas individuales</b>,{' '}
                  <b className="text-neutral-700 dark:text-neutral-200">Sobres y Boosters</b>,{' '}
                  <b className="text-neutral-700 dark:text-neutral-200">Sleeves y Protectores</b> y{' '}
                  <b className="text-neutral-700 dark:text-neutral-200">Accesorios</b>.
                </p>
                <p className="text-xs text-neutral-400">
                  Se gestionan en <b>Panel → Categorías</b>.
                </p>
              </div>
            </Card>
            <Card>
              <p className="text-sm font-semibold">🎮 Juego</p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-neutral-500">
                  Vincula el producto a un juego (Pokémon, Yu-Gi-Oh!, One Piece…).
                  Se usa para filtrar en <b>/cartas?game=…</b> y para armar las
                  tarjetas de juegos de la home.
                </p>
                <p className="text-xs text-neutral-400">
                  Los juegos se gestionan en <b>Panel → Juegos</b> (con logo y color).
                </p>
              </div>
            </Card>
          </div>
        </Section>

        {/* Mapa de la home */}
        <Section id="home" icon="layers" title="Mapa de la home: de dónde sale cada sección">
          <div className="space-y-2.5">
            <HomeRow
              storeSection="Cinta de logos (arriba del todo)"
              adminSource="Juegos → logo de cada juego"
              sourceLink="/admin/games"
              note="Se muestran todos los juegos con imagen cargada; sin imagen usan emoji."
            />
            <HomeRow
              storeSection="Nuevos ingresos (ticker)"
              adminSource="Últimos 10 productos cargados"
              sourceLink="/admin"
              note="Solo productos (no cartas individuales). Se actualiza solo al cargar."
            />
            <HomeRow
              storeSection="Elegí tu juego"
              adminSource="Juegos"
              sourceLink="/admin/games"
              note="Muestra cada juego con su logo y la cantidad de productos que tiene."
            />
            <HomeRow
              storeSection="Categorías"
              adminSource="Categorías + productos"
              sourceLink="/admin/categories"
              note="Cada tarjeta muestra la cantidad de productos de esa categoría."
            />
            <HomeRow
              storeSection="Productos destacados"
              adminSource="Botón «Destacar» en Productos/Accesorios"
              sourceLink="/admin"
              note="Mostrás solo los que marques con la estrella. Si no hay ninguno, usa los primeros 8."
            />
            <HomeRow
              storeSection="Accesorios para tu colección"
              adminSource="Productos con categoría Accesorios"
              sourceLink="/admin/accesorios"
              note="Aparece solo si hay accesorios cargados."
            />
            <HomeRow
              storeSection="Singles · Colecciones de cartas"
              adminSource="Cartas individuales, agrupadas por set"
              sourceLink="/admin/cartas"
              note="Se ordenan por set Pokémon (era SWSH/Scarlet-Violet…) y los demás por set propio."
            />
          </div>
        </Section>

        {/* Estados */}
        <Section id="estados" icon="eye" title="Publicado, oculto y destacado">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <div className="flex items-center gap-2">
                <Icon name="eye" className="h-4 w-4 text-emerald-500" />
                <p className="text-sm font-semibold">Publicado</p>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Visible para todo el mundo en la web. Es el estado por defecto al
                crear.
              </p>
            </Card>
            <Card>
              <div className="flex items-center gap-2">
                <Icon name="eyeOff" className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-semibold">Oculto</p>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                No aparece en la web pero sigue en la base. Útil para sacar algo
                sin borrarlo (agotado temporal, revisión).
              </p>
            </Card>
            <Card>
              <div className="flex items-center gap-2">
                <Icon name="star" className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-semibold">Destacado</p>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Lo marcás con la estrella y aparece en «Productos destacados» de
                la home. Podés destacar varios.
              </p>
            </Card>
          </div>
        </Section>

        {/* Pedidos */}
        <Section id="pedidos" icon="shoppingBag" title="Pedidos">
          <Card>
            <div className="space-y-3 text-sm text-neutral-500">
              <p>
                Los pedidos llegan a <b className="text-neutral-700 dark:text-neutral-200">Panel → Pedidos</b>{' '}
                cuando un cliente completa el checkout. Cada pedido muestra los
                ítems, el total, el envío y el estado.
              </p>
              <p>
                Estados: <Pill>Pendiente</Pill> <Pill color="bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-400">Confirmado</Pill>{' '}
                <Pill color="bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400">Enviado</Pill>{' '}
                <Pill color="bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400">Cancelado</Pill>
              </p>
              <p>
                Desde el pedido podés generar la guía de Correo Argentino (si está
                configurada en <b>Configuración</b>) y avisar al cliente por WhatsApp.
              </p>
            </div>
          </Card>
        </Section>

        {/* Configuración */}
        <Section id="config" icon="share" title="Configuración">
          <Card>
            <div className="space-y-3 text-sm text-neutral-500">
              <p>
                En <b className="text-neutral-700 dark:text-neutral-200">Panel → Configuración</b> se
                gestionan las redes sociales del footer, Mercado Pago (pago
                online), las credenciales de Correo Argentino (envíos con guía) y
                las notificaciones de WhatsApp.
              </p>
              <p className="text-xs text-neutral-400">
                Tip: probá la tienda con un producto de cada categoría para ver
                cómo se arma cada sección de la home.
              </p>
            </div>
          </Card>
        </Section>
      </div>
    </div>
  )
}
