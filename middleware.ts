import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase" // Ensure this path is correct

const protectedPaths = ["/billing", "/checkout", "/train-ai", "/payment/success", "/payment/cancel"] // Added payment status pages
const authRoutes = ["/auth"] // Routes related to authentication

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is authenticated and tries to access auth page, redirect to home
  if (session && authRoutes.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If user is not authenticated and tries to access a protected path, redirect to auth
  if (!session && protectedPaths.some((p) => pathname.startsWith(p))) {
    const redirectUrl = new URL("/auth", request.url)
    redirectUrl.searchParams.set("redirect", pathname) // Keep full path for redirect
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes, assuming these might have their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
}
