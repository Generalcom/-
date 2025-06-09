import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Single client instance for client-side usage
let clientInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!clientInstance && typeof window !== "undefined") {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
        storageKey: "vort-auth-token",
      },
    })
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

// Legacy exports for compatibility
export const createSupabaseClient = getSupabaseClient
