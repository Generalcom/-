import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Check if user exists in auth.users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

    if (usersError) {
      return NextResponse.json({
        success: false,
        message: `Failed to check users: ${usersError.message}`,
        details: usersError,
      })
    }

    const adminUser = users.users.find((user) => user.email === email)

    if (!adminUser) {
      return NextResponse.json({
        success: false,
        message: "Admin user not found in authentication system",
        details: { email, found: false },
      })
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", adminUser.id)
      .single()

    if (profileError) {
      return NextResponse.json({
        success: false,
        message: "Admin user exists in auth but profile not found",
        details: {
          authUser: {
            id: adminUser.id,
            email: adminUser.email,
            created_at: adminUser.created_at,
            email_confirmed_at: adminUser.email_confirmed_at,
          },
          profileError: profileError.message,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Admin user and profile found successfully",
      details: {
        authUser: {
          id: adminUser.id,
          email: adminUser.email,
          created_at: adminUser.created_at,
          email_confirmed_at: adminUser.email_confirmed_at,
        },
        profile: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          created_at: profile.created_at,
        },
      },
    })
  } catch (error) {
    console.error("Error in check-admin-user API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
