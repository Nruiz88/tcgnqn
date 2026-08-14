const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
const { conn } = require('./lib/db')

async function main() {
  const c = new Client({ connectionString: conn })
  await c.connect()

  console.log('Dropping public schema (removes Medusa tables)...')
  await c.query('drop schema public cascade')
  await c.query('create schema public')

  const file = process.argv[2]
  if (!file) throw new Error('usage: node migrate.js <sql-file>')
  const sql = fs.readFileSync(path.resolve(file), 'utf8')

  console.log(`Applying ${file}...`)
  await c.query(sql)
  console.log('Done.')

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