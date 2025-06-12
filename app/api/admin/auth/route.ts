import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminCredentials, setAdminSession } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    // Log admin login attempt (for security monitoring)
    console.log(`🔐 Admin login attempt: ${email} at ${new Date().toISOString()}`)

    const result = await verifyAdminCredentials(email, password)

    if (result.success) {
      // Set secure admin session
      setAdminSession(result.adminId!, result.email!)

      console.log(`✅ Admin login successful: ${email}`)

      return NextResponse.json({
        success: true,
        message: "Admin authentication successful",
      })
    } else {
      console.log(`❌ Admin login failed: ${email}`)

      return NextResponse.json({ success: false, error: result.error }, { status: 401 })
    }
  } catch (error) {
    console.error("❌ Admin auth error:", error)
    return NextResponse.json({ success: false, error: "Authentication system error" }, { status: 500 })
  }
}
