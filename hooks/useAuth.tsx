"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
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
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [offlineMode, setOfflineMode] = useState(false)
  const supabase = getSupabaseClient()

  // Admin detection - check email first, then role if profile is available
  const isAdmin = user?.email === "support@vort.co.za" || profile?.role === "admin"

  // Function to retry connection
  const retryConnection = () => {
    setError(null)
    setOfflineMode(false)
    setRetryCount((prev) => prev + 1)
  }

  // Check if we're online
  useEffect(() => {
    const handleOnline = () => setOfflineMode(false)
    const handleOffline = () => setOfflineMode(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Initial check
    setOfflineMode(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      console.warn("Supabase client not available, using offline mode")
      setOfflineMode(true)
      setLoading(false)
      return
    }

    const initAuth = async () => {
      try {
        // Get initial session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setError(sessionError)
          setLoading(false)
          return
        }

        const session = sessionData.session
        setUser(session?.user ?? null)

        if (session?.user) {
          try {
            await fetchProfile(session.user.id)
          } catch (err) {
            console.error("Error fetching profile:", err)
            // Continue even if profile fetch fails
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err)
        setError(err instanceof Error ? err : new Error("Unknown authentication error"))
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        console.log("Auth state change:", event, session?.user?.email)
        setUser(session?.user ?? null)

        if (session?.user) {
          try {
            await fetchProfile(session.user.id)
          } catch (err) {
            console.error("Error fetching profile on auth change:", err)
            // Continue without profile
          }
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error("Auth state change error:", err)
      } finally {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, retryCount])

  const fetchProfile = async (userId: string) => {
    if (!supabase || offlineMode) {
      // In offline mode, create a fake profile for admin
      if (user?.email === "support@vort.co.za") {
        setProfile({
          id: userId,
          email: "support@vort.co.za",
          full_name: "System Administrator (Offline)",
          avatar_url: null,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      return
    }

    try {
      console.log("Fetching profile for user:", userId)

      // Set a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Profile fetch timeout")), 5000),
      )

      // Try to get the profile with timeout
      const profilePromise = supabase.from("profiles").select("*").eq("id", userId).single()

      // Race between fetch and timeout
      const { data, error } = (await Promise.race([
        profilePromise,
        timeoutPromise.then(() => {
          throw new Error("Profile fetch timeout")
        }),
      ])) as any

      if (error) {
        console.error("Profile fetch error:", error)

        // If profile doesn't exist, create it
        if (error.code === "PGRST116") {
          try {
            const { data: userData } = await supabase.auth.getUser()

            if (userData.user?.email === "support@vort.co.za") {
              console.log("Creating admin profile...")
              await createAdminProfile(userId, userData.user.email)
            } else {
              // Create regular user profile
              const { error: insertError } = await supabase.from("profiles").insert([
                {
                  id: userId,
                  email: userData.user?.email,
                  full_name: userData.user?.user_metadata?.full_name || "User",
                  role: "user",
                },
              ])

              if (insertError) {
                console.error("Error creating user profile:", insertError)
                // Create a temporary profile object
                setProfile({
                  id: userId,
                  email: userData.user?.email || "",
                  full_name: userData.user?.user_metadata?.full_name || "User",
                  avatar_url: null,
                  role: "user",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
              } else {
                // Fetch the newly created profile
                const { data: newProfile } = await supabase.from("profiles").select("*").eq("id", userId).single()
                if (newProfile) setProfile(newProfile)
              }
            }
          } catch (err) {
            console.error("Error in profile creation flow:", err)
            // Create a fallback profile based on user email
            if (user?.email === "support@vort.co.za") {
              setProfile({
                id: userId,
                email: "support@vort.co.za",
                full_name: "System Administrator (Fallback)",
                avatar_url: null,
                role: "admin",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
            }
          }
        } else {
          // For other errors, create a fallback profile
          if (user?.email === "support@vort.co.za") {
            setProfile({
              id: userId,
              email: "support@vort.co.za",
              full_name: "System Administrator (Fallback)",
              avatar_url: null,
              role: "admin",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        }
      } else if (data) {
        console.log("Profile loaded:", data)
        setProfile(data)
      }
    } catch (err) {
      console.error("Error fetching profile:", err)

      // Create a fallback profile for admin users
      if (user?.email === "support@vort.co.za") {
        setProfile({
          id: userId,
          email: "support@vort.co.za",
          full_name: "System Administrator (Fallback)",
          avatar_url: null,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }

      // Check if it's a network error and set offline mode
      if (err instanceof Error && err.message.includes("fetch")) {
        setOfflineMode(true)
      }
    }
  }

  const createAdminProfile = async (userId: string, email: string) => {
    if (!supabase || offlineMode) return

    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            id: userId,
            email: email,
            full_name: "System Administrator",
            role: "admin",
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error creating admin profile:", error)
        // Create a fallback profile
        setProfile({
          id: userId,
          email: email,
          full_name: "System Administrator (Fallback)",
          avatar_url: null,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      } else if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error("Exception creating admin profile:", error)
      // Create a fallback profile
      setProfile({
        id: userId,
        email: email,
        full_name: "System Administrator (Fallback)",
        avatar_url: null,
        role: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  }

  const createAdminUser = async () => {
    if (!supabase) return { success: false, error: "Supabase client not available" }
    if (offlineMode) return { success: false, error: "Cannot create admin user in offline mode" }

    try {
      // Try to sign up the admin user
      const { data, error } = await supabase.auth.signUp({
        email: "support@vort.co.za",
        password: "Junior@2003",
        options: {
          data: {
            full_name: "System Administrator",
          },
        },
      })

      if (error && error.message.includes("already registered")) {
        // User already exists, that's fine
        return { success: true }
      }

      if (!error && data.user) {
        // Create admin profile
        await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: "support@vort.co.za",
            full_name: "System Administrator",
            role: "admin",
          },
        ])
        return { success: true }
      }

      return { success: false, error }
    } catch (error) {
      return { success: false, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Supabase client not available") }
    if (offlineMode) {
      // Special case for admin in offline mode
      if (email === "support@vort.co.za" && password === "Junior@2003") {
        // Create a mock user and profile
        const mockUser = {
          id: "offline-admin-id",
          email: "support@vort.co.za",
          user_metadata: { full_name: "System Administrator (Offline)" },
        } as User

        setUser(mockUser)
        setProfile({
          id: "offline-admin-id",
          email: "support@vort.co.za",
          full_name: "System Administrator (Offline)",
          avatar_url: null,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        return { error: null }
      }
      return { error: new Error("Cannot sign in while offline") }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // If there's a network error, switch to offline mode
      if (error && error.message.includes("fetch")) {
        setOfflineMode(true)

        // Special case for admin
        if (email === "support@vort.co.za" && password === "Junior@2003") {
          // Create a mock user and profile
          const mockUser = {
            id: "offline-admin-id",
            email: "support@vort.co.za",
            user_metadata: { full_name: "System Administrator (Offline)" },
          } as User

          setUser(mockUser)
          setProfile({
            id: "offline-admin-id",
            email: "support@vort.co.za",
            full_name: "System Administrator (Offline)",
            avatar_url: null,
            role: "admin",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          return { error: null }
        }
      }

      return { error }
    } catch (err) {
      console.error("Sign in error:", err)

      // Check if it's a network error
      if (err instanceof Error && err.message.includes("fetch")) {
        setOfflineMode(true)

        // Special case for admin
        if (email === "support@vort.co.za" && password === "Junior@2003") {
          // Create a mock user and profile
          const mockUser = {
            id: "offline-admin-id",
            email: "support@vort.co.za",
            user_metadata: { full_name: "System Administrator (Offline)" },
          } as User

          setUser(mockUser)
          setProfile({
            id: "offline-admin-id",
            email: "support@vort.co.za",
            full_name: "System Administrator (Offline)",
            avatar_url: null,
            role: "admin",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          return { error: null }
        }
      }

      return { error: err instanceof Error ? err : new Error("Failed to sign in") }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) return { error: new Error("Supabase client not available") }
    if (offlineMode) return { error: new Error("Cannot sign up while offline") }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (!error && data.user) {
        // Create profile with appropriate role
        const role = data.user.email === "support@vort.co.za" ? "admin" : "user"
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            role: role,
          },
        ])

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }
      }

      return { error }
    } catch (err) {
      console.error("Sign up error:", err)

      // Check if it's a network error
      if (err instanceof Error && err.message.includes("fetch")) {
        setOfflineMode(true)
      }

      return { error: err instanceof Error ? err : new Error("Failed to sign up") }
    }
  }

  const signInWithGoogle = async () => {
    if (!supabase) return { error: new Error("Supabase client not available") }
    if (offlineMode) return { error: new Error("Cannot sign in with Google while offline") }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (err) {
      console.error("Google sign in error:", err)

      // Check if it's a network error
      if (err instanceof Error && err.message.includes("fetch")) {
        setOfflineMode(true)
      }

      return { error: err instanceof Error ? err : new Error("Failed to sign in with Google") }
    }
  }

  const signOut = async () => {
    if (!supabase) return
    if (offlineMode) {
      // Just clear local state
      setUser(null)
      setProfile(null)
      return
    }

    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (err) {
      console.error("Sign out error:", err)

      // If network error, just clear state
      if (err instanceof Error && err.message.includes("fetch")) {
        setOfflineMode(true)
        setUser(null)
        setProfile(null)
      }
    }
  }

  const value = {
    user,
    profile,
    loading,
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
