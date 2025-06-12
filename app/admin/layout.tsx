import type React from "react"
import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import AdminSidebar from "@/components/admin/AdminSidebar"

export const metadata = {
  title: "Admin Dashboard - Vort",
  description: "Vort administration panel",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check admin authentication using completely isolated system
  if (!isAdminAuthenticated()) {
    redirect("/admin/auth")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
