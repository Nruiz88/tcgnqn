const { Client } = require('pg')
const { conn } = require('./lib/db')

;(async () => {
  const c = new Client({ connectionString: conn })
  await c.connect()
  await c.query(
    `insert into public.coupons (code, type, value, min_total, active) values ('BIENVENIDA10', 'percent', 10, 10000, true)
     on conflict (code) do nothing`
  )
  const r = await c.query('select code, type, value from public.coupons')
  console.log(r.rows)
  await c.end()
})().catch((e) => {
  console.error(e.message)
  process.exit(1)
})