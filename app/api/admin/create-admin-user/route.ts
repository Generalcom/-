import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // First, try to create the user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: "System Administrator",
      },
    })

    if (authError) {
      // If user already exists, that's okay
      if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
        // Try to get the existing user
        const { data: existingUser, error: getUserError } = await supabase.auth.admin.listUsers()

        if (!getUserError && existingUser.users) {
          const adminUser = existingUser.users.find((user) => user.email === email)

          if (adminUser) {
            // Create or update profile
            const { error: profileError } = await supabase.from("profiles").upsert({
              id: adminUser.id,
              email: adminUser.email,
              full_name: "System Administrator",
              role: "admin",
              updated_at: new Date().toISOString(),
            })

            if (profileError) {
              return NextResponse.json({
                success: false,
                message: "User exists but failed to create/update profile",
                details: profileError,
              })
            }

            return NextResponse.json({
              success: true,
              message: "Admin user already exists and profile updated successfully",
              details: { userId: adminUser.id, email: adminUser.email },
            })
          }
        }
      }

      return NextResponse.json({
        success: false,
        message: `Failed to create admin user: ${authError.message}`,
        details: authError,
      })
    }

    if (!authData.user) {
      return NextResponse.json({
        success: false,
        message: "Failed to create user - no user data returned",
      })
    }

    // Create the profile
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
        details: profileError,
      })
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
      { status: 500 },
    )
  }
}
