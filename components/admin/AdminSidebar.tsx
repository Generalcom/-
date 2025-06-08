"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, MessageSquare, CreditCard, BarChart3, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-slate-800 text-white p-4 flex flex-col h-screen">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">Vort Admin</h1>
      </div>

      <nav className="flex-1 pt-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                    isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white",
                  )}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-700 pt-4 mt-6">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span>Exit Admin</span>
        </Link>
      </div>
    </div>
  )
}
