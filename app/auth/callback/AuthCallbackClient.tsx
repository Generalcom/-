"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

type CallbackState = "loading" | "processing" | "success" | "error"

export function AuthCallbackClient() {
  const [state, setState] = useState<CallbackState>("loading")
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState("Initializing...")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { sessionLoaded, user, isAdmin } = useAuth()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
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

        setState("processing")
        setProgress("Processing authentication...")
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
        setProgress("Session created successfully...")

        // Force a session refresh to ensure it's properly stored
        setProgress("Refreshing session...")
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()

        if (refreshError) {
          console.warn("Session refresh warning:", refreshError)
        } else {
          console.log("Session refreshed successfully")
        }

        // Wait for session to be fully established
        setProgress("Establishing session...")
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Verify the session is actually available
        const { data: verifySession } = await supabase.auth.getSession()
        if (!verifySession.session) {
          console.error("Session verification failed")
          setError("Session was not properly established")
          setState("error")
          return
        }

        console.log("Session verified successfully")
        setProgress("Session verified...")

        // Create/update profile if needed
        const userId = data.session.user.id
        const userEmail = data.session.user.email
        const isAdminUser = userEmail === "support@vort.co.za"

        setProgress("Setting up profile...")

        try {
          // Check if profile exists
          const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", userId).single()

          if (!existingProfile) {
            // Create profile
            const { error: profileError } = await supabase.from("profiles").insert([
              {
                id: userId,
                email: userEmail,
                full_name:
                  data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || "User",
                avatar_url: data.session.user.user_metadata?.avatar_url || null,
                role: isAdminUser ? "admin" : "user",
              },
            ])

            if (profileError) {
              console.warn("Profile creation warning:", profileError)
            } else {
              console.log("Profile created successfully")
            }
          } else {
            console.log("Profile already exists")
          }
        } catch (profileError) {
          console.warn("Profile setup warning:", profileError)
          // Continue anyway, profile isn't critical for auth
        }

        setState("success")
        setProgress("Authentication complete!")

        // Final wait before redirect to ensure everything is synced
        setTimeout(() => {
          if (isAdminUser) {
            console.log("Redirecting admin to control panel")
            // Use a special URL format to bypass middleware temporarily
            window.location.href = "/admin/control-panel?auth_token=" + encodeURIComponent(data.session.access_token)
          } else {
            console.log("Redirecting user to dashboard")
            window.location.href = "/dashboard"
          }
        }, 2000)
      } catch (err) {
        console.error("Callback handling error:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
        setState("error")
      }
    }

    handleAuthCallback()
  }, [searchParams, supabase])

  // Handle retry
  const handleRetry = () => {
    setState("loading")
    setError(null)
    setProgress("Initializing...")
    window.location.reload()
  }

  // Handle manual redirect
  const handleManualRedirect = () => {
    // Force a page reload to ensure session is recognized
    if (user?.email === "support@vort.co.za") {
      window.location.href = "/admin/control-panel"
    } else {
      window.location.href = "/dashboard"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {(state === "loading" || state === "processing") && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {state === "loading" ? "Loading..." : "Processing Sign In"}
                  </h2>
                  <p className="text-gray-600">{progress}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width:
                          state === "loading"
                            ? "20%"
                            : progress.includes("created")
                              ? "60%"
                              : progress.includes("verified")
                                ? "80%"
                                : progress.includes("complete")
                                  ? "100%"
                                  : "40%",
                      }}
                    />
                  </div>
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
                  <p className="text-gray-600">Redirecting you to your workspace...</p>
                </div>
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
                  <Button variant="outline" onClick={() => (window.location.href = "/auth")} className="w-full">
                    Back to Sign In
                  </Button>
                  <Button variant="ghost" onClick={handleManualRedirect} className="w-full text-sm">
                    Continue Manually
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
