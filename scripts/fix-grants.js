const { Client } = require('pg')
const { conn } = require('./lib/db')

async function main() {
  const c = new Client({ connectionString: conn })
  await c.connect()

  const grants = `
    grant usage on schema public to postgres, anon, authenticated, service_role;
    grant all on all tables in schema public to postgres, anon, authenticated, service_role;
    grant all on all routines in schema public to postgres, anon, authenticated, service_role;
    grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
    alter default privileges in schema public grant all on routines to postgres, anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;
  `
  await c.query(grants)
  console.log('Grants applied.')
  await c.end()
}

main().catch((e) => {
  console.error('ERR', e.message)
  process.exit(1)
})