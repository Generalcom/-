"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createSupabaseClient } from "@/lib/supabase"

export default function StorageSetupPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [bucketExists, setBucketExists] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkBucketStatus()
  }, [])

  const checkBucketStatus = async () => {
    try {
      setIsLoading(true)
      const supabase = createSupabaseClient()

      // Check if bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets()

      if (error) {
        console.error("Error checking buckets:", error)
        toast({
          title: "Error checking storage",
          description: "Could not verify storage bucket status",
          variant: "destructive",
        })
        return
      }

      const exists = buckets.some((bucket) => bucket.name === "job-applications")
      setBucketExists(exists)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createBucket = async () => {
    try {
      setIsCreating(true)

      // Call the API route to create the bucket with proper permissions
      const response = await fetch("/api/setup-storage")
      const data = await response.json()

      if (!data.success) {
        toast({
          title: "Error creating bucket",
          description: data.error || "Failed to create storage bucket",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Storage bucket created successfully",
      })

      // Refresh status
      checkBucketStatus()
    } catch (error) {
      console.error("Error creating bucket:", error)
      toast({
        title: "Error",
        description: "Failed to create storage bucket",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Storage Setup</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Job Applications Storage</CardTitle>
          <CardDescription>Setup storage for resume uploads in job applications</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <p>Checking storage status...</p>
            </div>
          ) : bucketExists ? (
            <div className="flex items-center space-x-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <p>Storage bucket is configured and ready</p>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-red-500">
              <XCircle className="h-5 w-5" />
              <p>Storage bucket not configured</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!bucketExists && (
            <Button
              onClick={createBucket}
              disabled={isCreating}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Storage Bucket"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
