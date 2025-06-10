"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, User, Key, Mail } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function SetupAdminUserPage() {
  const [email, setEmail] = useState("support@vort.co.za")
  const [password, setPassword] = useState("Junior@2003")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: any
  } | null>(null)

  const createAdminUser = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/create-admin-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        toast({
          title: "Success",
          description: "Admin user created successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating admin user:", error)
      setResult({
        success: false,
        message: "Failed to create admin user. Please try again.",
      })
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkAdminUser = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/check-admin-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error checking admin user:", error)
      setResult({
        success: false,
        message: "Failed to check admin user status.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Admin User Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This page helps you create or verify the admin user account. Use this if you're having trouble logging
                in with admin credentials.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex items-center gap-2"
                />
              </div>

              <div>
                <Label htmlFor="password">Admin Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={checkAdminUser} disabled={loading} variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Check Admin User
              </Button>

              <Button onClick={createAdminUser} disabled={loading} className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                {loading ? "Creating..." : "Create Admin User"}
              </Button>
            </div>

            {result && (
              <Alert className={result.success ? "border-green-500" : "border-red-500"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p>{result.message}</p>
                    {result.details && (
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Manual Setup Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to Authentication → Users</li>
                <li>Click "Add user" and create user with email: support@vort.co.za</li>
                <li>Set password: Junior@2003</li>
                <li>Make sure "Email confirmed" is checked</li>
                <li>Run the SQL script: scripts/create-admin-user-v2.sql</li>
                <li>Try logging in again</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
