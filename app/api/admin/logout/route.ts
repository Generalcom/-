import { NextResponse } from "next/server"
import { clearAdminSession, getAdminSession } from "@/lib/admin-auth"

export async function POST() {
  try {
    const session = getAdminSession()

    if (session) {
      console.log(`🚪 Admin logout: ${session.email} at ${new Date().toISOString()}`)
    }

    clearAdminSession()

    return NextResponse.json({
      success: true,
      message: "Admin logout successful",
    })
  } catch (error) {
    console.error("❌ Admin logout error:", error)
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 })
  }
}
