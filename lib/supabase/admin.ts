import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente con la service role key. Solo para uso server-side
 * (nunca importar desde componentes cliente).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )
}
