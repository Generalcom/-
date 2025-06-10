import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return NextResponse.json({ success: false, error: "Failed to list buckets" }, { status: 500 })
    }

    const bucketExists = buckets.some((bucket) => bucket.name === "job-applications")

    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket("job-applications", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
        return NextResponse.json({ success: false, error: "Failed to create bucket" }, { status: 500 })
      }

      // Set bucket policies
      const { error: policyError } = await supabase.storage.from("job-applications").createPolicy({
        name: "Public Access",
        definition: {
          statements: [
            {
              effect: "allow",
              principal: "*",
              action: "object:get",
              resource: "job-applications/*",
            },
            {
              effect: "allow",
              principal: "authenticated",
              action: "object:upload",
              resource: "job-applications/*",
            },
            {
              effect: "allow",
              principal: "anon",
              action: "object:upload",
              resource: "job-applications/*",
            },
          ],
        },
      })

      if (policyError) {
        console.error("Error setting bucket policy:", policyError)
        return NextResponse.json({ success: false, error: "Failed to set bucket policy" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Bucket created successfully" })
    }

    return NextResponse.json({ success: true, message: "Bucket already exists" })
  } catch (error) {
    console.error("Error setting up storage:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
