import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

const protectedPaths = ["/billing", "/checkout", "/payment/success", "/payment/cancel"]
const semiProtectedPaths = ["/train-ai"] // Paths that should try auth but allow fallback
const adminPaths = ["/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Admin path protection only
    if (adminPaths.some((p) => pathname.startsWith(p))) {
      if (!session) {
        const redirectUrl = new URL("/auth", request.url)
        redirectUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check if user is admin
      if (session.user.email !== "support@vort.co.za") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    // Protected paths (excluding auth)
    if (!session && protectedPaths.some((p) => pathname.startsWith(p))) {
      const redirectUrl = new URL("/auth", request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Semi-protected paths - add a flag to indicate auth was attempted
    if (!session && semiProtectedPaths.some((p) => pathname.startsWith(p))) {
      // Instead of redirecting, we'll add a query param to indicate auth was attempted
      // The client can then decide whether to show a login prompt or continue
      const url = request.nextUrl.clone()
      url.searchParams.set("auth_attempted", "true")
      return NextResponse.rewrite(url)
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // For semi-protected paths, allow access even if middleware fails
    if (semiProtectedPaths.some((p) => pathname.startsWith(p))) {
      const url = request.nextUrl.clone()
      url.searchParams.set("auth_error", "true")
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
}
