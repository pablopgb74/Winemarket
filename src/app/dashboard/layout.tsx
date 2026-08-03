// src/app/dashboard/layout.tsx
"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../lib/utils"
import { Wine, Users, Package, DollarSign, Settings, LogOut, LayoutDashboard, Box, TrendingUp, UserPlus, Menu, X, Wallet } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "../../components/ui/button"
import { useState } from "react"

const navigation = {
  sommelier: [
    { name: "Overview", href: "/dashboard/sommelier", icon: LayoutDashboard },
    { name: "My Selections", href: "/dashboard/sommelier/selections", icon: Box },
    { name: "Subscribers", href: "/dashboard/sommelier/subscribers", icon: Users },
    { name: "Wallet", href: "/dashboard/sommelier/wallet", icon: Wallet },
    { name: "Profile", href: "/dashboard/sommelier/profile", icon: Settings },
  ],
  customer: [
    { name: "My Boxes", href: "/dashboard/customer", icon: Package },
    { name: "Subscriptions", href: "/dashboard/customer/subscriptions", icon: Box },
    { name: "Following", href: "/dashboard/customer/following", icon: UserPlus },
    { name: "Order History", href: "/dashboard/customer/orders", icon: TrendingUp },
    { name: "Settings", href: "/dashboard/customer/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Sommeliers", href: "/dashboard/admin/sommeliers", icon: Users },
    { name: "Selections", href: "/dashboard/admin/selections", icon: Box },
    { name: "Orders", href: "/dashboard/admin/orders", icon: Package },
    { name: "Analytics", href: "/dashboard/admin/analytics", icon: TrendingUp },
    { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role || "customer"
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navItems = navigation[role as keyof typeof navigation] || navigation.customer

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <Link href={`/dashboard/${role}`} className="flex items-center gap-2">
              <Wine className="w-8 h-8 text-wine-600" />
              <span className="font-serif text-xl font-bold text-wine-950">Wine Marketplace</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-wine-50 text-wine-700"
                    : "text-dark-600 hover:bg-dark-100 hover:text-wine-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main layout */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-dark-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="hidden lg:block">
                <Link href={`/dashboard/${role}`} className="flex items-center gap-2">
                  <Wine className="w-7 h-7 text-wine-600" />
                  <span className="font-serif text-lg font-bold text-wine-950">Wine Marketplace</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-dark-600">
                {session?.user?.name || session?.user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}