const { Client } = require('pg')
const { conn } = require('./lib/db')

;(async () => {
  const c = new Client({ connectionString: conn })
  await c.connect()
  const r = await c.query(
    'select p.name, c.slug from public.products p left join public.categories c on c.id = p.category_id order by p.name'
  )
  console.log(r.rows)
  await c.end()
})().catch((e) => {
  console.error(e.message)
  process.exit(1)
})