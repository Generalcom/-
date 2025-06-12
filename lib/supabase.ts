import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Single client instance for client-side usage
let clientInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!clientInstance && typeof window !== "undefined") {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "sb-auth-token",
        storage: {
          getItem: (key) => {
            if (typeof document === "undefined") return null
            const value = document.cookie
              .split("; ")
              .find((row) => row.startsWith(`${key}=`))
              ?.split("=")[1]
            return value ? decodeURIComponent(value) : null
          },
          setItem: (key, value) => {
            if (typeof document === "undefined") return
            document.cookie = `${key}=${encodeURIComponent(
              value,
            )}; path=/; max-age=2592000; SameSite=Lax; secure=${window.location.protocol === "https:"}`
          },
          removeItem: (key) => {
            if (typeof document === "undefined") return
            document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax; secure=${window.location.protocol === "https:"}`
          },
        },
      },
    })
  }
  return clientInstance
}

// For server components - uses cookies() from Next.js
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  })
}

// For admin operations that need service role
export const createAdminSupabaseClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// For middleware
export const createMiddlewareSupabaseClient = (request: Request) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  })
}

// Legacy exports for compatibility
export const createSupabaseClient = getSupabaseClient
