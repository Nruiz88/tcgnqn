const { Client } = require('pg')
const { conn } = require('./lib/db')

const map = [
  ['Charizard V', 'cartas'],
  ['Pikachu VMAX', 'cartas'],
  ['Sleeves Dragon Shield', 'sleeves'],
  ['Toploader Ultra Pro', 'sleeves'],
  ['Booster Lost Origin', 'boosters'],
  ['Caja Binder Pikachu', 'accesorios'],
]

async function main() {
  const c = new Client({ connectionString: conn })
  await c.connect()
  for (const [name, slug] of map) {
    const { rows } = await c.query(
      'select id from public.categories where slug = $1',
      [slug]
    )
    if (!rows[0]) continue
    const r = await c.query(
      'update public.products set category_id = $1 where name like $2',
      [rows[0].id, `%${name}%`]
    )
    console.log(`${name} -> ${slug} (${r.rowCount})`)
  }
  await c.end()
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})