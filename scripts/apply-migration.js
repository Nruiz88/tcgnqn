const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
const { conn } = require('./lib/db')

async function main() {
  const file = process.argv[2]
  if (!file) throw new Error('usage: node scripts/apply-migration.js <sql-file>')

  const c = new Client({ connectionString: conn })
  await c.connect()

  const sql = fs.readFileSync(path.resolve(file), 'utf8')
  console.log(`Applying ${file}...`)
  await c.query(sql)
  console.log('Done.')
  await c.end()
}

main().catch((e) => {
  console.error('ERR', e.message)
  process.exit(1)
})