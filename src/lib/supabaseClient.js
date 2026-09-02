import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não configuradas. Usando catálogo local de contingência.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

