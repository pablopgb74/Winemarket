// src/app/dashboard/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Users, Box, Package, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

const stats = [
  { name: "Total Sommeliers", value: "47", change: "+5 this month", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { name: "Active Selections", value: "156", change: "+12 this month", icon: Box, color: "text-purple-600", bg: "bg-purple-100" },
  { name: "Active Subscriptions", value: "2,847", change: "+234 this month", icon: Package, color: "text-green-600", bg: "bg-green-100" },
  { name: "Monthly Revenue", value: "$127,450", change: "+18% vs last month", icon: DollarSign, color: "text-wine-600", bg: "bg-wine-100" },
]

const recentSommeliers = [
  { id: 1, name: "Marcus Johnson", email: "marcus@wineexpert.com", status: "pending", applied: "2024-09-28" },
  { id: 2, name: "Elena Rodriguez", email: "elena@sommelierpro.com", status: "pending", applied: "2024-09-27" },
  { id: 3, name: "David Park", email: "david@wineconsultant.com", status: "approved", applied: "2024-09-25" },
]

const recentOrders = [
  { id: "WM-2024-001234", customer: "John Smith", selection: "Hidden Gems from Jura", total: 150, status: "confirmed", date: "2024-09-28" },
  { id: "WM-2024-001233", customer: "Maria Garcia", selection: "White Burgundy Under $50", total: 180, status: "preparing", date: "2024-09-28" },
  { id: "WM-2024-001232", customer: "Robert Chen", selection: "Natural Reds for Thanksgiving", total: 165, status: "shipped", date: "2024-09-27" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-wine-950">Admin Dashboard</h1>
        <p className="text-dark-600">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark-600">{stat.name}</CardTitle>
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-wine-950">{stat.value}</div>
              <p className="text-xs text-dark-500">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Sommeliers & Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Sommeliers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Pending Sommelier Applications
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/admin/sommeliers">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSommeliers.map((sommelier) => (
                <div key={sommelier.id} className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                  <div>
                    <p className="font-medium text-dark-900">{sommelier.name}</p>
                    <p className="text-sm text-dark-500">{sommelier.email}</p>
                    <p className="text-xs text-dark-400">Applied: {sommelier.applied}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      sommelier.status === "pending" && "bg-yellow-100 text-yellow-800",
                      sommelier.status === "approved" && "bg-green-100 text-green-800",
                      sommelier.status === "rejected" && "bg-red-100 text-red-800"
                    )}>
                      {sommelier.status}
                    </span>
                    {sommelier.status === "pending" && (
                      <>
                        <Button variant="wine" size="sm">Approve</Button>
                        <Button variant="outline" size="sm">Review</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Recent Orders
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/admin/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-900 truncate">{order.selection}</p>
                    <p className="text-sm text-dark-500">{order.customer} • {order.id}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="font-medium text-dark-900">${order.total}</span>
                    <span className={cn(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      order.status === "confirmed" && "bg-blue-100 text-blue-800",
                      order.status === "preparing" && "bg-yellow-100 text-yellow-800",
                      order.status === "shipped" && "bg-green-100 text-green-800",
                      order.status === "delivered" && "bg-gray-100 text-gray-800"
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Manage Sommeliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-dark-600 mb-4">Review applications, manage profiles, and track performance.</p>
            <Button variant="wine" asChild>
              <Link href="/dashboard/admin/sommeliers">Manage</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="w-5 h-5 text-purple-600" />
              Curate Selections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-dark-600 mb-4">Review and feature top selections on the marketplace.</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/admin/selections">Curate</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-dark-600 mb-4">Track platform metrics, revenue, and growth trends.</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/admin/analytics">View</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-wine-600" />
              Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-dark-600 mb-4">Manage sommelier payouts and platform fees.</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/admin/payouts">Manage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}