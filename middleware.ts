import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

const protectedPaths = ["/billing", "/checkout", "/train-ai", "/payment/success", "/payment/cancel"]
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

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
}
