import { createClient } from "@supabase/supabase-js"

// For client-side usage
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Create a singleton instance for client-side
let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

export const getSupabaseClient = () => {
  if (!clientInstance && typeof window !== "undefined") {
    clientInstance = createSupabaseClient()
  }
  return clientInstance
}

// For server components and server actions
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
