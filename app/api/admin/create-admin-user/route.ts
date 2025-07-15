import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Try to find existing user by email first (avoid listing all users)
    const { data: existingUserResp, error: getUserError } = await supabase.auth.admin.getUserByEmail(email)

    if (getUserError && !getUserError.message.includes("not found")) {
      return NextResponse.json({
        success: false,
        message: "Error checking existing user",
        details: getUserError.message,
      }, { status: 500 })
    }

    if (existingUserResp?.user) {
      // User already exists - upsert profile with admin role
      const user = existingUserResp.user
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: "System Administrator",
        role: "admin",
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        return NextResponse.json({
          success: false,
          message: "User exists but failed to create/update profile",
          details: profileError.message,
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Admin user already exists and profile updated successfully",
        details: { userId: user.id, email: user.email },
      })
    }

    // User does not exist, so create new admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: "System Administrator",
      },
    })

    if (authError) {
      return NextResponse.json({
        success: false,
        message: `Failed to create admin user: ${authError.message}`,
        details: authError,
      }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json({
        success: false,
        message: "Failed to create user - no user data returned",
      }, { status: 500 })
    }

    // Create profile for new user
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: authData.user.email,
      full_name: "System Administrator",
      role: "admin",
    })

    if (profileError) {
      return NextResponse.json({
        success: false,
        message: "User created but failed to create profile",
        details: profileError.message,
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Admin user and profile created successfully",
      details: {
        userId: authData.user.id,
        email: authData.user.email,
      },
    })
  } catch (error) {
    console.error("Error in create-admin-user API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
