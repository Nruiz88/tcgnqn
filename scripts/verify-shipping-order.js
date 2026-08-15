// Verificación: el insert de createOrder con campos de envío funciona en la DB.
// Replica el payload exacto de lib/actions.ts -> createOrder.
const fs = require('fs')
const path = require('path')

// Cargar .env.local como scripts/lib/db.js
const envFile = path.resolve(__dirname, '../.env.local')
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
    }
  }
}

const { createClient } = require('@supabase/supabase-js')

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY')

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Buscar un usuario existente para usar como user_id (auth.uid())
  const { data: authUser, error: authErr } = await admin.auth.admin.listUsers({ perPage: 1 })
  if (authErr || !authUser?.users?.[0]) throw new Error('Sin usuarios para probar: ' + (authErr?.message ?? ''))
  const user = authUser.users[0]

  // Replica de createOrder (método correo, con envío)
  const { data: order, error } = await admin
    .from('orders')
    .insert({
      user_id: user.id,
      total: 25000,
      discount: 0,
      status: 'pending',
      shipping_name: 'Test Envío',
      shipping_phone: '2991234567',
      shipping_address: 'Av. Argentina 123',
      shipping_method: 'correo_argentino_d',
      shipping_label: 'Correo Argentino — Paq.AR (domicilio)',
      shipping_price: 4500,
      shipping_cp: '8300',
      notes: null,
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Insert falló:', error.message)
    process.exit(1)
  }

  console.log('✅ Pedido creado:', order.id)
  console.log('   total:', order.total, '| envío:', order.shipping_label, order.shipping_price, '| CP:', order.shipping_cp)

  // Verificar lectura con los campos de envío
  const { data: read, error: readErr } = await admin
    .from('orders')
    .select('id, total, shipping_method, shipping_label, shipping_price, shipping_cp')
    .eq('id', order.id)
    .single()
  if (readErr || !read) {
    console.error('❌ Lectura falló:', readErr?.message)
    process.exit(1)
  }
  console.log('✅ Lectura OK:', JSON.stringify(read))

  // Limpiar la orden de prueba
  const { error: delErr } = await admin.from('orders').delete().eq('id', order.id)
  if (delErr) console.error('⚠️ No se pudo borrar la orden de prueba:', delErr.message)
  else console.log('🧹 Orden de prueba eliminada')
}

main().catch((e) => {
  console.error('ERR', e.message)
  process.exit(1)
})
