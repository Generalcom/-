import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

const protectedPaths = ["/billing", "/checkout", "/train-ai", "/payment/success", "/payment/cancel"]
const authRoutes = ["/auth"]
const adminPaths = ["/admin"] // Add admin paths

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is authenticated and tries to access auth page, redirect to home
  if (session && authRoutes.some((p) => pathname.startsWith(p))) {
    // Check if user is admin
    if (session.user.email === "support@vort.co.za") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Admin path protection
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

  // If user is not authenticated and tries to access a protected path, redirect to auth
  if (!session && protectedPaths.some((p) => pathname.startsWith(p))) {
    const redirectUrl = new URL("/auth", request.url)
    redirectUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
}
