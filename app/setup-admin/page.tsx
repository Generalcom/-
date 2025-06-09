"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function SetupAdminPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const { createAdminUser } = useAuth()

  const handleCreateAdmin = async () => {
    setIsCreating(true)
    setResult(null)

    try {
      const { success, error } = await createAdminUser()

      if (success) {
        setResult({
          success: true,
          message: "Admin user created successfully! You can now login with support@vort.co.za",
        })
      } else {
        setResult({
          success: false,
          message: error?.message || "Failed to create admin user",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An unexpected error occurred",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
          <CardDescription>Create the admin user for your Vort application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Admin Credentials:</h3>
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> support@vort.co.za
              <br />
              <strong>Password:</strong> Junior@2003
            </p>
          </div>

          <Button onClick={handleCreateAdmin} disabled={isCreating} className="w-full">
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Admin User...
              </>
            ) : (
              "Create Admin User"
            )}
          </Button>

          {result && (
            <div
              className={`flex items-center space-x-2 p-3 rounded-md ${
                result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {result.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <p className="text-sm">{result.message}</p>
            </div>
          )}

          {result?.success && (
            <div className="space-y-2">
              <Button asChild className="w-full" variant="outline">
                <a href="/auth">Go to Login Page</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
