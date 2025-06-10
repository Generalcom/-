import { Suspense } from "react"
import TrainAIClientPage from "./TrainAIClientPage"
import { createServerSupabaseClient } from "@/lib/supabase"

export const metadata = {
  title: "Train AI Model - Vort",
  description: "Experience the power of AI training with our interactive simulator.",
}

export default async function TrainAIPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Try to get session, but don't block rendering if it fails
  let user = null
  try {
    const supabase = createServerSupabaseClient()
    const { data } = await supabase.auth.getSession()
    user = data.session?.user || null
  } catch (error) {
    console.error("Error fetching session:", error)
  }

  // Get auth flags from searchParams
  const authAttempted = searchParams.auth_attempted === "true"
  const authError = searchParams.auth_error === "true"

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TrainAIClientPage initialUser={user} authAttempted={authAttempted} authError={authError} />
    </Suspense>
  )
}
