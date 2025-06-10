"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  CreditCard,
  Settings,
  ShoppingBag,
  BarChart3,
  FileText,
  LogOut,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Control Panel", href: "/admin/control-panel", icon: Settings },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Vort Admin</h1>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"}`}
                />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4">
        <Button onClick={signOut} variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
