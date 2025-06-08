import type React from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import AdminSidebar from "@/components/admin/AdminSidebar"

export const metadata = {
  title: "Vort Admin Panel",
  description: "Manage users, contacts, payments and more",
}

async function checkAdminAccess() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return false
  }

  // Check if user has admin role and is the specific admin
  const { data: profile } = await supabase.from("profiles").select("role, email").eq("id", session.user.id).single()

  return profile?.role === "admin" && profile?.email === "support@vort.co.za"
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await checkAdminAccess()

  if (!isAdmin) {
    redirect("/admin/auth")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  )
}
