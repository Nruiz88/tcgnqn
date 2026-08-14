const { Client } = require('pg')
const { conn } = require('./lib/db')

;(async () => {
  const c = new Client({ connectionString: conn })
  await c.connect()
  await c.query('delete from public.wishlist_items')
  const r = await c.query('select count(*)::int n from public.wishlist_items')
  console.log('wishlist_items left:', r.rows[0].n)
  await c.end()
})().catch((e) => {
  console.error(e.message)
  process.exit(1)
})