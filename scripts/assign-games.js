const { conn } = require('./lib/db')
const { Client } = require('pg')

const mapping = [
  { name: 'Charizard V (Evoluciones Brillantes)', game: 'pokemon' },
  { name: 'Pikachu VMAX (VMAX Climax)', game: 'pokemon' },
  { name: 'Sleeves Dragon Shield (Matte 60)', game: 'pokemon' },
  { name: 'Toploader Ultra Pro (25 u)', game: 'pokemon' },
  { name: 'Booster Lost Origin (10 sobres)', game: 'pokemon' },
  { name: 'Caja Binder Pikachu', game: 'pokemon' },
]

;(async () => {
  const c = new Client({ connectionString: conn })
  await c.connect()
  for (const { name, game } of mapping) {
    const g = await c.query('select id from public.games where slug = $1', [game])
    const r = await c.query(
      'update public.products set game_id = $1 where name = $2',
      [g.rows[0]?.id ?? null, name]
    )
    console.log(`${name} -> ${game} (${r.rowCount} actualizado)`)
  }
  await c.end()
})().catch((e) => { console.error(e.message); process.exit(1) })