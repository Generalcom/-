import { cookies } from "next/headers"

// Admin session management using secure cookies only
export const setAdminSession = (adminId: string, email: string) => {
  const cookieStore = cookies()
  const sessionData = JSON.stringify({
    adminId,
    email,
    timestamp: Date.now(),
    role: "admin",
  })

  cookieStore.set("vort-admin-session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/admin",
  })
}

export const getAdminSession = () => {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("vort-admin-session")

    if (!sessionCookie) return null

    const sessionData = JSON.parse(sessionCookie.value)

    // Check if session is expired (8 hours)
    if (Date.now() - sessionData.timestamp > 8 * 60 * 60 * 1000) {
      return null
    }

    return sessionData
  } catch {
    return null
  }
}

export const clearAdminSession = () => {
  const cookieStore = cookies()
  cookieStore.set("vort-admin-session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/admin",
  })
}

// Verify admin credentials - completely isolated from user auth
export const verifyAdminCredentials = async (email: string, password: string) => {
  // Hardcoded admin credentials for complete isolation
  const ADMIN_EMAIL = "support@vort.co.za"
  const ADMIN_PASSWORD = "VortAdmin2024!"

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return {
      success: true,
      adminId: "vort-admin-001",
      email,
      role: "admin",
    }
  }

  return { success: false, error: "Invalid admin credentials" }
}

// Check if current request has valid admin session
export const isAdminAuthenticated = () => {
  const session = getAdminSession()
  return session && session.email === "support@vort.co.za" && session.role === "admin"
}

// Get admin data for display
export const getAdminData = () => {
  const session = getAdminSession()
  if (!session) return null

  return {
    email: session.email,
    role: session.role,
    loginTime: new Date(session.timestamp).toLocaleString(),
  }
}
