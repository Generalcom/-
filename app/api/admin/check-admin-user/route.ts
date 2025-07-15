import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // ✅ Efficiently get user directly by email (instead of listing all users)
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(email)

    if (authError || !authUser?.user) {
      return NextResponse.json(
        { success: false, message: "User not found in authentication system.", details: { email } },
        { status: 404 }
      )
    }

    const { id, email: foundEmail, created_at, email_confirmed_at } = authUser.user

    // 🔍 Check if profile exists for the user ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .eq("id", id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        {
          success: false,
          message: "User exists in auth but profile not found.",
          details: {
            authUser: { id, email: foundEmail, created_at, email_confirmed_at },
            error: profileError?.message,
          },
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Admin user and profile found successfully.",
      details: {
        authUser: { id, email: foundEmail, created_at, email_confirmed_at },
        profile,
      },
    })
  } catch (error) {
    console.error("check-admin-user error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
