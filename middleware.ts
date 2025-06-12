import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareSupabaseClient } from "@/lib/supabase"

const protectedPaths = ["/billing", "/checkout", "/payment/success", "/payment/cancel"]
const semiProtectedPaths = ["/train-ai"]
const adminPaths = ["/admin"]
const adminAuthPath = "/admin/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`🔍 Middleware: ${pathname}`)

  // Skip middleware for auth callback to prevent loops
  if (pathname === "/auth/callback") {
    console.log("✅ Skipping middleware for auth callback")
    return NextResponse.next()
  }

  // Handle admin paths with completely isolated auth system
  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p))

  if (isAdminPath && pathname !== adminAuthPath) {
    console.log("🔐 Checking isolated admin authentication")

    // Check for admin session cookie
    const adminSession = request.cookies.get("vort-admin-session")

    if (!adminSession) {
      console.log("🚫 No admin session, redirecting to admin auth")
      return NextResponse.redirect(new URL(adminAuthPath, request.url))
    }

    try {
      const sessionData = JSON.parse(adminSession.value)

      // Check if session is expired (8 hours)
      if (Date.now() - sessionData.timestamp > 8 * 60 * 60 * 1000) {
        console.log("🚫 Admin session expired")
        const response = NextResponse.redirect(new URL(adminAuthPath, request.url))
        // Clear expired session
        response.cookies.set("vort-admin-session", "", { maxAge: 0, path: "/admin" })
        return response
      }

      // Check if it's the correct admin
      if (sessionData.email !== "support@vort.co.za" || sessionData.role !== "admin") {
        console.log("🚫 Invalid admin session")
        const response = NextResponse.redirect(new URL(adminAuthPath, request.url))
        // Clear invalid session
        response.cookies.set("vort-admin-session", "", { maxAge: 0, path: "/admin" })
        return response
      }

      console.log("✅ Admin access granted via isolated system")
    } catch (error) {
      console.log("🚫 Invalid admin session format")
      const response = NextResponse.redirect(new URL(adminAuthPath, request.url))
      // Clear corrupted session
      response.cookies.set("vort-admin-session", "", { maxAge: 0, path: "/admin" })
      return response
    }
  }

  // Redirect /admin to /admin/dashboard for better UX
  if (pathname === "/admin") {
    console.log("🔄 Redirecting /admin to /admin/dashboard")
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  // Handle regular user protected paths (completely separate from admin)
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    try {
      const supabase = createMiddlewareSupabaseClient(request)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        const redirectUrl = new URL("/auth", request.url)
        redirectUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error("Protected path middleware error:", error)
      const redirectUrl = new URL("/auth", request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Handle semi-protected paths (regular users only)
  if (semiProtectedPaths.some((p) => pathname.startsWith(p))) {
    try {
      const supabase = createMiddlewareSupabaseClient(request)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        const url = request.nextUrl.clone()
        url.searchParams.set("auth_attempted", "true")
        return NextResponse.rewrite(url)
      }
    } catch (error) {
      console.error("Semi-protected path middleware error:", error)
      const url = request.nextUrl.clone()
      url.searchParams.set("auth_error", "true")
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|_next/webpack-hmr).*)"],
}
