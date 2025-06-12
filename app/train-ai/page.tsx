import { Suspense } from "react"
import TrainAIClientPage from "./TrainAIClientPage"
import { createServerSupabaseClient } from "@/lib/supabase"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Train AI Model - Vort",
  description:
    "Experience the power of AI training with our interactive simulator. Train custom AI models for your business needs.",
  keywords: "AI training, machine learning, custom AI models, AI simulator, business AI solutions",
  openGraph: {
    title: "Train AI Model - Vort",
    description: "Experience the power of AI training with our interactive simulator.",
    url: "https://vort.co.za/train-ai",
    images: [
      {
        url: "https://vort.co.za/og-train-ai.png",
        width: 1200,
        height: 630,
        alt: "Vort AI Training Platform",
      },
    ],
  },
  alternates: {
    canonical: "https://vort.co.za/train-ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
