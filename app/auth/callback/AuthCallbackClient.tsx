"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

type CallbackState = "loading" | "success" | "error"

export function AuthCallbackClient() {
  const [state, setState] = useState<CallbackState>("loading")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAdmin } = useAuth()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have the authorization code from the URL
        const code = searchParams.get("code")
        const error_code = searchParams.get("error")
        const error_description = searchParams.get("error_description")

        // Handle OAuth errors
        if (error_code) {
          console.error("OAuth error:", error_code, error_description)
          setError(error_description || "Authentication failed")
          setState("error")
          return
        }

        // If no code, this might be an invalid callback
        if (!code) {
          setError("No authorization code found in URL")
          setState("error")
          return
        }

        console.log("Processing OAuth callback with code:", code)

        // Exchange the code for a session
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

        if (sessionError) {
          console.error("Session exchange error:", sessionError)
          setError(sessionError.message || "Failed to create session")
          setState("error")
          return
        }

        if (!data.session) {
          setError("No session created")
          setState("error")
          return
        }

        console.log("Session created successfully:", data.session.user.email)

        // Check if user has a profile, create one if needed
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single()

        if (profileError && profileError.code === "PGRST116") {
          // Profile doesn't exist, create one
          console.log("Creating profile for new user")

          const { error: insertError } = await supabase.from("profiles").insert([
            {
              id: data.session.user.id,
              email: data.session.user.email,
              full_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || "User",
              avatar_url: data.session.user.user_metadata?.avatar_url || null,
              role: data.session.user.email === "support@vort.co.za" ? "admin" : "user",
            },
          ])

          if (insertError) {
            console.error("Error creating profile:", insertError)
            // Continue anyway, profile will be created later
          }
        }

        setState("success")

        // Wait a moment to show success state, then redirect
        setTimeout(() => {
          // Determine redirect destination based on user role
          if (data.session.user.email === "support@vort.co.za") {
            console.log("Redirecting admin to admin dashboard")
            router.push("/admin")
          } else {
            console.log("Redirecting user to dashboard")
            router.push("/dashboard")
          }
        }, 1500)
      } catch (err) {
        console.error("Callback handling error:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
        setState("error")
      }
    }

    handleAuthCallback()
  }, [searchParams, supabase, router])

  // Handle retry
  const handleRetry = () => {
    setState("loading")
    setError(null)
    // Trigger the effect again by refreshing the page
    window.location.reload()
  }

  // Handle manual redirect
  const handleManualRedirect = () => {
    if (user?.email === "support@vort.co.za") {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {state === "loading" && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">Completing Sign In</h2>
                  <p className="text-gray-600">Please wait while we set up your account...</p>
                </div>
              </>
            )}

            {state === "success" && (
              <>
                <div className="flex justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">Sign In Successful!</h2>
                  <p className="text-gray-600">Redirecting you to your dashboard...</p>
                </div>
                {user && (
                  <div className="text-sm text-gray-500">Welcome, {user.user_metadata?.full_name || user.email}!</div>
                )}
              </>
            )}

            {state === "error" && (
              <>
                <div className="flex justify-center">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">Sign In Failed</h2>
                  <p className="text-gray-600">{error || "An error occurred during authentication"}</p>
                </div>
                <div className="space-y-3">
                  <Button onClick={handleRetry} className="w-full">
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/auth")} className="w-full">
                    Back to Sign In
                  </Button>
                  {user && (
                    <Button variant="ghost" onClick={handleManualRedirect} className="w-full text-sm">
                      Continue to Dashboard
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
