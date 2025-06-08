import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// For client-side usage
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Create a singleton instance for client-side
let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

export const getClientSupabaseClient = () => {
  if (!clientInstance && typeof window !== "undefined") {
    clientInstance = createSupabaseClient()
  }
  return clientInstance
}

// For server components and server actions
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

export function getServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseServiceKey)
}
