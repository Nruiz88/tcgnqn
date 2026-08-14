const { Client } = require('pg')
const { conn } = require('./lib/db')

async function main() {
  const id = process.argv[2]
  if (!id) {
    console.error('usage: node scripts/delete-order.js <order_id>')
    process.exit(1)
  }
  const c = new Client({ connectionString: conn })
  await c.connect()
  await c.query('delete from public.orders where id = $1', [id])
  const r = await c.query('select count(*)::int n from public.orders')
  console.log('Orders left:', r.rows[0].n)
  await c.end()
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})