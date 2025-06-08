"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext, useCallback } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase" // Ensure this path is correct

interface Profile {
  id: string
  full_name?: string
  avatar_url?: string
  role?: string // Add role field
  // Add other profile fields as needed
}
interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: any | null }>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
  fetchProfile: (userId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = getSupabaseClient()

  const fetchProfile = useCallback(
    async (userId: string) => {
      if (!userId) return
      try {
        const { data, error, status } = await supabase
          .from("profiles")
          .select(`id, full_name, avatar_url, role`)
          .eq("id", userId)
          .single()

        if (error && status !== 406) {
          console.error("Error fetching profile:", error)
          throw error
        }

        if (data) {
          setProfile(data as Profile)
        }
      } catch (error) {
        console.error("Error in fetchProfile:", error)
        setProfile(null)
      }
    },
    [supabase],
  )

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession()

      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      if (initialSession?.user) {
        await fetchProfile(initialSession.user.id)
      }
      setLoading(false)

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        setLoading(true)
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (newSession?.user) {
          await fetchProfile(newSession.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    }
    initializeAuth()
  }, [supabase, fetchProfile])

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error("Google sign in error:", error)
      // Consider showing a toast notification to the user
    } finally {
      // setLoading(false) // OAuth redirect will handle loading state implicitly
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      console.error("Email sign in error:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // This will be available in user.user_metadata
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) throw signUpError
      if (!signUpData.user) throw new Error("Signup successful but no user data returned.")

      // Insert into profiles table. This is often better handled by a trigger.
      // Or ensure RLS allows the user to insert their own profile.
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: signUpData.user.id,
        full_name: name,
        email: email, // Store email in profiles table if needed
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.warn("Error creating profile after signup, but signup was successful:", profileError)
        // Decide if this should be a hard error for the user
      }

      return { error: null }
    } catch (error: any) {
      console.error("Email sign up error:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    fetchProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
