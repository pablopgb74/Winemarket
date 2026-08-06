// src/app/dashboard/customer/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Box, Heart, Star, Calendar } from "lucide-react"
import Link from "next/link"

const currentSubscription = {
  sommelier: "Sarah Chen, Master Sommelier",
  selection: "October 2024: Hidden Gems from Jura",
  boxSize: "6-bottle",
  nextShipDate: "2024-10-15",
  price: 150,
  status: "active",
}

const upcomingBoxes = [
  { month: "October 2024", selection: "Hidden Gems from Jura", status: "Preparing", shipDate: "2024-10-15" },
  { month: "November 2024", selection: "Natural Reds for Thanksgiving", status: "Upcoming", shipDate: "2024-11-12" },
  { month: "December 2024", selection: "Holiday Sparkling Collection", status: "Upcoming", shipDate: "2024-12-10" },
]

const recentOrders = [
  { id: "WM-2024-001234", date: "2024-09-15", selection: "White Burgundy Under $50", total: 180, status: "Delivered" },
  { id: "WM-2024-001156", date: "2024-08-14", selection: "Summer Rosés from Provence", total: 150, status: "Delivered" },
  { id: "WM-2024-001089", date: "2024-07-15", selection: "Cool Climate Pinot Noirs", total: 165, status: "Delivered" },
]

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-wine-950">Welcome back!</h1>
        <p className="text-dark-600">Your curated wine journey continues</p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <Card className="border-wine-200">
          <CardHeader className="border-b border-wine-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-wine-950">Your Active Subscription</CardTitle>
                <p className="text-dark-600">Curated by {currentSubscription.sommelier}</p>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {currentSubscription.status}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-dark-500">Current Selection</p>
                <p className="font-medium text-dark-900">{currentSubscription.selection}</p>
              </div>
              <div>
                <p className="text-sm text-dark-500">Box Size</p>
                <p className="font-medium text-dark-900">{currentSubscription.boxSize}</p>
              </div>
              <div>
                <p className="text-sm text-dark-500">Next Shipment</p>
                <p className="font-medium text-dark-900 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(currentSubscription.nextShipDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-dark-500">Monthly Price</p>
                <p className="font-medium text-dark-900">${currentSubscription.price}/mo</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/customer/subscriptions">Manage Subscription</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/dashboard/customer/boxes">View All Boxes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Boxes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-wine-950">Upcoming Boxes</h2>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/customer/boxes">View All</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {upcomingBoxes.map((box) => (
            <Card key={box.month} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-wine-100 rounded-full -translate-x-1/2 translate-y-1/2 opacity-20" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark-500">{box.month}</p>
                    <CardTitle className="text-wine-950">{box.selection}</CardTitle>
                  </div>
                  <span className={cn(
                    "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                    box.status === "Preparing" && "bg-blue-100 text-blue-800",
                    box.status === "Upcoming" && "bg-yellow-100 text-yellow-800",
                    box.status === "Shipped" && "bg-green-100 text-green-800"
                  )}>
                    {box.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-dark-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Ships {new Date(box.shipDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-wine-950">Recent Orders</h2>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/customer/orders">View All</Link>
          </Button>
        </div>
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Selection</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-dark-50">
                  <td className="px-6 py-4 font-mono text-sm text-dark-900">{order.id}</td>
                  <td className="px-6 py-4 text-dark-600">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-dark-900">{order.selection}</td>
                  <td className="px-6 py-4 font-medium text-dark-900">${order.total}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {order.status}
                    </span>
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
              <Heart className="w-5 h-5 text-red-600" />
              Discover Sommeliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-dark-600 mb-4">Find new sommeliers to follow and get notified of their selections.</p>
            <Button variant="wine" asChild>
              <Link href="/sommeliers">Browse Sommeliers</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="w-5 h-5 text-blue-600" />
              Browse Selections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-dark-600 mb-4">Explore all available monthly selections from our sommelier community.</p>
            <Button variant="outline" asChild>
              <Link href="/selections">View All</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Loyalty Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-dark-600 mb-4">You have 1,250 points. Redeem for discounts on your next box.</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/customer/rewards">Redeem</Link>
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