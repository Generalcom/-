import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerSupabaseClient()

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the account page or a specified redirect path
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
