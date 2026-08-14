const { Client } = require('pg')
const { conn } = require('./lib/db')

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('usage: node scripts/make-admin.js <email>')
    process.exit(1)
  }

  const c = new Client({ connectionString: conn })
  await c.connect()

  const { rows } = await c.query(
    'select id from auth.users where email = $1',
    [email]
  )
  if (rows.length === 0) {
    console.error(`No user found with email ${email}`)
    process.exit(1)
  }

  await c.query(
    `insert into public.profiles (id, role) values ($1, 'admin')
     on conflict (id) do update set role = 'admin'`,
    [rows[0].id]
  )
  console.log(`User ${email} is now admin.`)
  await c.end()
}

main().catch((e) => {
  console.error('ERR', e.message)
  process.exit(1)
})