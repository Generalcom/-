import type React from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if user is authenticated
  if (!session) {
    redirect("/auth?redirect=/admin")
  }

  // Check if user is admin
  if (session.user.email !== "support@vort.co.za") {
    redirect("/")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
