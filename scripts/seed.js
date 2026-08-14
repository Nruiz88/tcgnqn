const { Client } = require('pg')
const { conn } = require('./lib/db')

const products = [
  {
    name: 'Charizard V (Evoluciones Brillantes)',
    description: 'Carta de colección en excelente estado, lista para binder.',
    price: 45000,
    stock: 5,
    image_url: '',
    active: true,
  },
  {
    name: 'Pikachu VMAX (VMAX Climax)',
    description: 'Carta japonesa de alta calidad, centrada y sin marcas.',
    price: 32000,
    stock: 8,
    image_url: '',
    active: true,
  },
  {
    name: 'Sleeves Dragon Shield (Matte 60)',
    description: 'Protectores premium para tus cartas, color rojo.',
    price: 18000,
    stock: 20,
    image_url: '',
    active: true,
  },
  {
    name: 'Toploader Ultra Pro (25 u)',
    description: 'Fundas rígidas para proteger cartas en envíos.',
    price: 9500,
    stock: 30,
    image_url: '',
    active: true,
  },
  {
    name: 'Booster Lost Origin (10 sobres)',
    description: 'Pack sellado de sobres para abrir o coleccionar.',
    price: 78000,
    stock: 3,
    image_url: '',
    active: true,
  },
  {
    name: 'Caja Binder Pikachu',
    description: 'Binder de bolsillo con tapa dura, 4x4. Ideal para guardar tu colección.',
    price: 26000,
    stock: 12,
    image_url: '',
    active: true,
  },
]

async function main() {
  const c = new Client({ connectionString: conn })
  await c.connect()

  const { rowCount } = await c.query(
    'select count(*)::int as n from public.products'
  )
  if (rowCount && rowCount[0]?.n > 0) {
    console.log('Products already exist, skipping seed.')
    await c.end()
    return
  }

  for (const p of products) {
    await c.query(
      `insert into public.products (name, description, price, stock, image_url, active)
       values ($1, $2, $3, $4, $5, $6)`,
      [p.name, p.description, p.price, p.stock, p.image_url, p.active]
    )
  }

  const res = await c.query('select count(*)::int as n from public.products')
  console.log(`Seeded ${res.rows[0].n} products.`)
  await c.end()
}

main().catch((e) => {
  console.error('ERR', e.message)
  process.exit(1)
})