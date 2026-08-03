// src/app/dashboard/sommelier/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Wine, Users, DollarSign, TrendingUp, Plus, Box } from "lucide-react"
import Link from "next/link"

const stats = [
  { name: "Active Selections", value: "3", icon: Box, color: "text-wine-600", bg: "bg-wine-100" },
  { name: "Total Subscribers", value: "127", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { name: "Monthly Earnings", value: "$2,847", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
  { name: "Avg. Rating", value: "4.9", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
]

const recentSelections = [
  { id: 1, title: "October 2024: Hidden Gems from Jura", status: "Published", subscribers: 45, revenue: 6750 },
  { id: 2, title: "September 2024: White Burgundy Under $50", status: "Published", subscribers: 62, revenue: 9300 },
  { id: 3, title: "November 2024: Natural Reds for Thanksgiving", status: "Draft", subscribers: 0, revenue: 0 },
]

export default function SommelierDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-wine-950">Welcome back, Sommelier</h1>
          <p className="text-dark-600">Manage your selections, track earnings, and grow your following</p>
        </div>
        <Button variant="wine" asChild>
          <Link href="/dashboard/sommelier/selections/new">
            <Plus className="w-4 h-4 mr-2" />
            Create New Selection
          </Link>
        </Button>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Selections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-wine-950">Recent Selections</h2>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/sommelier/selections">View All</Link>
          </Button>
        </div>
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Selection</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Subscribers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-200">
              {recentSelections.map((selection) => (
                <tr key={selection.id} className="hover:bg-dark-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-dark-900">{selection.title}</div>
                    <div className="text-sm text-dark-500">6-bottle box • ${(selection.revenue / selection.subscribers || 0).toFixed(0)}/month</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      selection.status === "Published" && "bg-green-100 text-green-800",
                      selection.status === "Draft" && "bg-yellow-100 text-yellow-800",
                      selection.status === "Archived" && "bg-gray-100 text-gray-800"
                    )}>
                      {selection.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-dark-900">{selection.subscribers}</td>
                  <td className="px-6 py-4 text-dark-900">${selection.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/sommelier/selections/${selection.id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="w-5 h-5 text-wine-600" />
              Create Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-dark-600 mb-4">Publish your next monthly curated box for subscribers.</p>
            <Button variant="wine" asChild>
              <Link href="/dashboard/sommelier/selections/new">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              View Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-dark-600 mb-4">See who's subscribed to your selections and engage with them.</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/sommelier/subscribers">View All</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Earnings Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-dark-600 mb-4">Track your monthly earnings and payout history.</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/sommelier/earnings">View Report</Link>
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