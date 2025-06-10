import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

const protectedPaths = ["/billing", "/checkout", "/payment/success", "/payment/cancel"]
const semiProtectedPaths = ["/train-ai"]
const adminPaths = ["/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for auth callback to prevent loops
  if (pathname === "/auth/callback") {
    return NextResponse.next()
  }

  try {
    const supabase = createServerSupabaseClient()

    // Wait for session with reasonable timeout
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Admin path protection
    if (adminPaths.some((p) => pathname.startsWith(p))) {
      // If no session, redirect to auth
      if (!session) {
        const redirectUrl = new URL("/auth", request.url)
        redirectUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check if user is admin
      const isAdmin = session.user.email === "support@vort.co.za"
      if (!isAdmin) {
        // Try to check profile for admin role as fallback
        try {
          const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()
          if (profile?.role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url))
          }
        } catch (profileError) {
          // If we can't check profile and email isn't admin, redirect
          return NextResponse.redirect(new URL("/", request.url))
        }
      }
    }

    // Protected paths
    if (!session && protectedPaths.some((p) => pathname.startsWith(p))) {
      const redirectUrl = new URL("/auth", request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Semi-protected paths
    if (!session && semiProtectedPaths.some((p) => pathname.startsWith(p))) {
      const url = request.nextUrl.clone()
      url.searchParams.set("auth_attempted", "true")
      return NextResponse.rewrite(url)
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)

    // For admin paths, if there's an error, redirect to auth
    if (adminPaths.some((p) => pathname.startsWith(p))) {
      const redirectUrl = new URL("/auth", request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
}
