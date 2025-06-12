"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  LogOut,
  Shield,
  Menu,
  X,
  CreditCard,
  ShoppingBag,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Control Panel", href: "/admin/control-panel", icon: Shield },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" })
      if (response.ok) {
        router.push("/admin/auth")
        router.refresh()
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Force redirect even if API fails
      router.push("/admin/auth")
    }
  }

  return (
    <div
      className={cn("bg-gray-900 text-white transition-all duration-300 flex flex-col", isCollapsed ? "w-16" : "w-64")}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold">Vort Admin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-800 hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
            isCollapsed ? "justify-center" : "justify-start",
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  )
}
