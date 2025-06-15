"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase"

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  sessionLoaded: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAdmin: boolean
  createAdminUser: () => Promise<{ success: boolean; error?: any }>
  retryConnection: () => void
  offlineMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [offlineMode, setOfflineMode] = useState(false)

  // Use refs to prevent multiple listeners and initializations
  const authListenerRef = useRef<any>(null)
  const initializingRef = useRef(false)
  const supabaseClientRef = useRef<any>(null)

  // Initialize Supabase client only once
  useEffect(() => {
    if (!supabaseClientRef.current) {
      supabaseClientRef.current = getSupabaseClient()
      console.log("🔧 Auth: Supabase client initialized")
    }
  }, [])

  // Admin detection - prioritize email check, fallback to profile role
  const isAdmin = user?.email === "support@vort.co.za" || profile?.role === "admin"

  // Function to retry connection
  const retryConnection = () => {
    setError(null)
    setOfflineMode(false)
    setLoading(true)
    setSessionLoaded(false)
    initializeAuth()
  }

  // Check if error indicates network issues
  const isNetworkError = (error: any): boolean => {
    if (!error) return false
    const errorMessage = error.message || error.toString()
    const networkErrorPatterns = [
      "Failed to fetch",
      "fetch",
      "timeout",
      "Network request failed",
      "ERR_NETWORK",
      "ERR_INTERNET_DISCONNECTED",
      "Connection failed",
      "Unable to connect",
    ]
    return networkErrorPatterns.some((pattern) => errorMessage.toLowerCase().includes(pattern.toLowerCase()))
  }

  const createProfileFromUser = (user: User): Profile => {
    return {
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
      avatar_url: user.user_metadata?.avatar_url || null,
      role: user.email === "support@vort.co.za" ? "admin" : "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  const fetchProfile = async (userId: string, userEmail?: string) => {
    const supabaseClient = supabaseClientRef.current

    // Don't block auth flow if Supabase client is not available
    if (!supabaseClient) {
      console.log("No Supabase client available, skipping profile fetch")
      return
    }

    try {
      console.log("Attempting to fetch profile for user:", userId)

      // Add a shorter timeout for profile fetch
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .abortSignal(controller.signal)
        .single()

      clearTimeout(timeoutId)

      if (error) {
        console.log("Profile fetch error (non-blocking):", error.message)

        // Don't treat profile fetch errors as critical
        if (isNetworkError(error)) {
          console.log("Network error during profile fetch - continuing without profile")
          setOfflineMode(true)
        }

        // If profile doesn't exist, try to create it (but don't block on this)
        if (error.code === "PGRST116" && userEmail) {
          console.log("Profile doesn't exist, attempting to create (non-blocking)")
          createProfileAsync(userId, userEmail).catch((err) => {
            console.log("Profile creation failed (non-blocking):", err.message)
          })
        }

        return // Don't block auth flow
      }

      if (data) {
        console.log("Profile loaded successfully:", data.email)
        setProfile(data)
      }
    } catch (err) {
      console.log("Profile fetch exception (non-blocking):", err instanceof Error ? err.message : "Unknown error")

      if (isNetworkError(err)) {
        console.log("Network error in profile fetch - continuing without profile")
        setOfflineMode(true)
      }

      // Don't block auth flow for profile errors
      return
    }
  }

  const createProfileAsync = async (userId: string, userEmail: string) => {
    const supabaseClient = supabaseClientRef.current
    if (!supabaseClient) return

    try {
      const role = userEmail === "support@vort.co.za" ? "admin" : "user"
      const fullName =
        userEmail === "support@vort.co.za" ? "System Administrator" : user?.user_metadata?.full_name || "User"

      const { data: newProfile, error: insertError } = await supabaseClient
        .from("profiles")
        .insert([
          {
            id: userId,
            email: userEmail,
            full_name: fullName,
            role: role,
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.log("Profile creation error (non-blocking):", insertError.message)
        return
      }

      if (newProfile) {
        console.log("Profile created successfully")
        setProfile(newProfile)
      }
    } catch (err) {
      console.log("Profile creation exception (non-blocking):", err instanceof Error ? err.message : "Unknown error")
    }
  }

  const initializeAuth = async () => {
    if (initializingRef.current) {
      console.log("Auth already initializing, skipping...")
      return
    }

    initializingRef.current = true
    console.log("🚀 Initializing authentication...")

    try {
      const supabaseClient = supabaseClientRef.current

      if (!supabaseClient) {
        console.log("No Supabase client - auth will work in limited mode")
        setSessionLoaded(true)
        setLoading(false)
        return
      }

      // Get initial session
      console.log("Getting initial session...")
      const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession()

      if (sessionError) {
        console.error("Session error:", sessionError)
        if (isNetworkError(sessionError)) {
          console.log("Network error during session fetch")
          setOfflineMode(true)
        } else {
          setError(sessionError)
        }
      } else {
        const session = sessionData.session
        console.log("Initial session:", session ? `Found for ${session.user.email}` : "None")

        setUser(session?.user ?? null)

        // If we have a user, try to fetch their profile (non-blocking)
        if (session?.user) {
          // Create a basic profile from user data immediately
          const basicProfile = createProfileFromUser(session.user)
          setProfile(basicProfile)

          // Then try to fetch the real profile in the background
          fetchProfile(session.user.id, session.user.email).catch((err) => {
            console.log("Background profile fetch failed:", err.message)
          })
        }
      }

      // Always mark session as loaded, regardless of profile fetch status
      setSessionLoaded(true)
      setLoading(false)
    } catch (err) {
      console.error("Auth initialization error:", err)
      if (isNetworkError(err)) {
        console.log("Network error during auth initialization")
        setOfflineMode(true)
      } else {
        setError(err instanceof Error ? err : new Error("Unknown authentication error"))
      }
      setSessionLoaded(true)
      setLoading(false)
    } finally {
      initializingRef.current = false
    }
  }

  // Initialize auth on mount - only once
  useEffect(() => {
    if (supabaseClientRef.current && !initializingRef.current) {
      initializeAuth()
    }
  }, [])

  // Set up auth state listener - only once
  useEffect(() => {
    const supabaseClient = supabaseClientRef.current

    if (!supabaseClient || authListenerRef.current) {
      return
    }

    console.log("Setting up auth state listener...")

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email || "no user")

      try {
        setUser(session?.user ?? null)

        if (session?.user) {
          // Create basic profile immediately
          const basicProfile = createProfileFromUser(session.user)
          setProfile(basicProfile)

          // Try to fetch real profile in background
          fetchProfile(session.user.id, session.user.email).catch((err) => {
            console.log("Background profile fetch failed on auth change:", err.message)
          })
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error("Error handling auth state change:", err)
        if (isNetworkError(err)) {
          setOfflineMode(true)
        }
      }
    })

    authListenerRef.current = subscription

    return () => {
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe()
        authListenerRef.current = null
      }
    }
  }, [])

  // Network status detection
  useEffect(() => {
    const handleOnline = () => {
      console.log("Network came back online")
      if (offlineMode) {
        setOfflineMode(false)
        retryConnection()
      }
    }

    const handleOffline = () => {
      console.log("Network went offline")
      setOfflineMode(true)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [offlineMode])

  const createAdminUser = async () => {
    const supabaseClient = supabaseClientRef.current
    if (!supabaseClient) return { success: false, error: "Supabase client not available" }
    if (offlineMode) return { success: false, error: "Cannot create admin user in offline mode" }

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: "support@vort.co.za",
        password: "Junior@2003",
        options: {
          data: {
            full_name: "System Administrator",
          },
        },
      })

      if (error && error.message.includes("already registered")) {
        return { success: true }
      }

      if (!error && data.user) {
        // Try to create profile, but don't fail if it doesn't work
        createProfileAsync(data.user.id, "support@vort.co.za").catch(console.log)
        return { success: true }
      }

      return { success: false, error }
    } catch (error) {
      if (isNetworkError(error)) {
        setOfflineMode(true)
      }
      return { success: false, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    const supabaseClient = supabaseClientRef.current
    if (!supabaseClient) return { error: new Error("Authentication client not available") }

    try {
      console.log("Attempting to sign in:", email)

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error && isNetworkError(error)) {
        console.log("Network error during sign in")
        setOfflineMode(true)

        // Special offline mode for admin
        if (email === "support@vort.co.za" && password === "Junior@2003") {
          const mockUser = {
            id: "offline-admin-id",
            email: "support@vort.co.za",
            user_metadata: { full_name: "System Administrator (Offline)" },
          } as User

          setUser(mockUser)
          setProfile(createProfileFromUser(mockUser))
          return { error: null }
        }
      }

      return { error }
    } catch (err) {
      console.error("Sign in error:", err)
      if (isNetworkError(err)) {
        setOfflineMode(true)
      }
      return { error: err instanceof Error ? err : new Error("Failed to sign in") }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const supabaseClient = supabaseClientRef.current
    if (!supabaseClient) return { error: new Error("Authentication client not available") }
    if (offlineMode) return { error: new Error("Cannot sign up while offline") }

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (!error && data.user) {
        // Try to create profile, but don't fail if it doesn't work
        createProfileAsync(data.user.id, data.user.email || email).catch(console.log)
      }

      return { error }
    } catch (err) {
      console.error("Sign up error:", err)
      if (isNetworkError(err)) {
        setOfflineMode(true)
      }
      return { error: err instanceof Error ? err : new Error("Failed to sign up") }
    }
  }

  const signInWithGoogle = async () => {
    const supabaseClient = supabaseClientRef.current
    if (!supabaseClient) return { error: new Error("Authentication client not available") }
    if (offlineMode) return { error: new Error("Cannot sign in with Google while offline") }

    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (err) {
      console.error("Google sign in error:", err)
      if (isNetworkError(err)) {
        setOfflineMode(true)
      }
      return { error: err instanceof Error ? err : new Error("Failed to sign in with Google") }
    }
  }

  const signOut = async () => {
    const supabaseClient = supabaseClientRef.current
    if (!supabaseClient) return

    try {
      await supabaseClient.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (err) {
      console.error("Sign out error:", err)
      // Clear state regardless of error
      setUser(null)
      setProfile(null)
    }
  }

  const value = {
    user,
    profile,
    loading,
    sessionLoaded,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAdmin,
    createAdminUser,
    retryConnection,
    offlineMode,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
