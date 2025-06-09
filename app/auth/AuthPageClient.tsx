"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chrome, Mail, User, LogOut, ShoppingBag, BrainIcon, RefreshCw, WifiOff } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function AuthPageClient() {
  const [activeTab, setActiveTab] = useState("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [redirecting, setRedirecting] = useState(false)
  const {
    user,
    profile,
    loading: authLoading,
    error: authError,
    signInWithGoogle,
    signIn,
    signUp,
    signOut,
    retryConnection,
    offlineMode,
  } = useAuth()

  const searchParams = useSearchParams()
  const router = useRouter()
  const redirectPath = searchParams.get("redirect")

  // Simple admin check
  const isAdmin = user?.email === "support@vort.co.za"

  useEffect(() => {
    // Only handle redirects for authenticated users
    if (user && !redirecting) {
      if (isAdmin) {
        setRedirecting(true)
        // Use window.location for admin to avoid React Router conflicts
        window.location.href = "/admin"
      } else if (redirectPath) {
        setRedirecting(true)
        router.push(redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`)
      }
    }
  }, [user, isAdmin, redirectPath, router, redirecting])

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle()
    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message || "Failed to sign in with Google.",
        variant: "destructive",
      })
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await signIn(email, password)
    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message || "Failed to sign in. Please check your credentials.",
        variant: "destructive",
      })
    } else {
      toast({ title: "Signed In", description: "Welcome back!" })
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await signUp(email, password, name)
    if (error) {
      toast({
        title: "Sign Up Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Sign Up Successful",
        description: "Please check your email to verify your account.",
      })
      setActiveTab("signin")
    }
  }

  const handleRetryConnection = () => {
    retryConnection()
    toast({
      title: "Retrying Connection",
      description: "Attempting to reconnect to authentication service...",
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Authentication...</h1>
          <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      </div>
    )
  }

  // Show error state with retry button
  if (authError && !offlineMode) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Authentication Error</h1>
          <p className="text-muted-foreground mb-6">
            We're having trouble connecting to our authentication service. This could be due to network issues or
            service unavailability.
          </p>
          <Button onClick={handleRetryConnection} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Retry Connection
          </Button>
        </div>
      </div>
    )
  }

  if (redirecting) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {isAdmin ? "Redirecting to Admin Dashboard..." : "Redirecting..."}
          </h1>
          <p className="text-muted-foreground">Taking you to your destination...</p>
        </div>
      </div>
    )
  }

  // Show user dashboard for regular authenticated users without redirect
  if (user && !isAdmin && !redirectPath) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-card border-border shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-semibold text-foreground">Welcome Back!</CardTitle>
              <CardDescription className="text-muted-foreground">{profile?.full_name || user.email}</CardDescription>
              {offlineMode && (
                <div className="mt-2 flex items-center justify-center text-amber-500 text-sm">
                  <WifiOff className="h-4 w-4 mr-1" /> Offline Mode
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.full_name || "User Avatar"}
                  className="w-24 h-24 rounded-full mx-auto border-2 border-primary"
                />
              ) : (
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto border-2 border-primary">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-3">
                <Link href="/store" passHref>
                  <Button variant="default" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <ShoppingBag className="mr-2 h-5 w-5" /> Browse Store
                  </Button>
                </Link>
                <Link href="/train-ai" passHref>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-accent">
                    <BrainIcon className="mr-2 h-5 w-5" /> Train AI Models
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="w-full text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="mr-2 h-5 w-5" /> Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card/80 backdrop-blur-md border-b border-border fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Vort
            </Link>
            <div className="flex items-center gap-4">
              {offlineMode && (
                <span className="text-amber-500 text-sm flex items-center">
                  <WifiOff className="h-4 w-4 mr-1" /> Offline Mode
                </span>
              )}
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-card border-border shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-semibold text-foreground">
                {activeTab === "signin" ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {redirectPath ? "Please sign in or sign up to continue" : "Access your Vort account"}
              </CardDescription>
              {offlineMode && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-amber-500 text-sm flex items-center">
                    <WifiOff className="h-4 w-4 mr-1" /> Offline Mode
                  </span>
                  <Button size="sm" variant="outline" onClick={handleRetryConnection} className="h-7 text-xs">
                    <RefreshCw className="h-3 w-3 mr-1" /> Retry
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-secondary">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-6 pt-6">
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={authLoading || offlineMode}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-accent"
                  >
                    <Chrome className="mr-2 h-5 w-5" /> Continue with Google
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background border-input"
                        required
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-background border-input"
                        required
                        placeholder="••••••••"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Mail className="mr-2 h-4 w-4" /> {authLoading ? "Signing In..." : "Sign In"}
                    </Button>
                    {offlineMode && (
                      <p className="text-xs text-center text-amber-500 mt-2">
                        Note: In offline mode, only admin login works with email: support@vort.co.za
                      </p>
                    )}
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6 pt-6">
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={authLoading || offlineMode}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-accent"
                  >
                    <Chrome className="mr-2 h-5 w-5" /> Sign up with Google
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or create account with email</span>
                    </div>
                  </div>
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background border-input"
                        required
                        placeholder="Your Name"
                        disabled={offlineMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background border-input"
                        required
                        placeholder="you@example.com"
                        disabled={offlineMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-background border-input"
                        required
                        placeholder="Create a strong password"
                        disabled={offlineMode}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={authLoading || offlineMode}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <User className="mr-2 h-4 w-4" /> {authLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                    {offlineMode && (
                      <p className="text-xs text-center text-amber-500 mt-2">
                        Sign up is not available in offline mode
                      </p>
                    )}
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
