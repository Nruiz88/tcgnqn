const { Client } = require('pg')
const { conn } = require('./lib/db')

async function main() {
  const c = new Client({ connectionString: conn })
  await c.connect()

  const tables = await c.query(
    "select tablename from pg_tables where schemaname='public' order by tablename"
  )
  console.log('=== public tables ===')
  for (const r of tables.rows) console.log(r.tablename)

  await c.end()
}

main().catch((e) => {
  console.error('ERR', e.message)
  process.exit(1)
})