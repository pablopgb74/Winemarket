// src/app/dashboard/sommelier/wallet/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Wallet, TrendingUp, DollarSign, ArrowDown, ArrowUp, Minus, Clock, CheckCircle, XCircle, AlertCircle, Download } from "lucide-react"
import { formatPrice, formatDate } from "../../../../lib/utils"

interface WalletEntry {
  id: string
  type: "SALE_COMMISSION" | "PAYOUT" | "ADJUSTMENT"
  amountCents: number
  balanceCents: number
  description: string
  periodStart: string | null
  periodEnd: string | null
  isSettled: boolean
  settledAt: string | null
  createdAt: string
  order?: {
    orderNumber: string
    selection?: { title: string }
    customer?: { user?: { name: string } }
    createdAt: string
  }
}

interface WalletData {
  entries: WalletEntry[]
  pagination: { total: number; limit: number; offset: number }
  balance: number
  summary: {
    totalEarned: number
    totalPaidOut: number
    totalAdjustments: number
    currentBalance: number
  }
}

export default function WalletPage() {
  const [data, setData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<"current" | "last" | "all">("current")

  useEffect(() => {
    fetchWallet()
  }, [period])

  const fetchWallet = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/wallet?period=${period}`)
      if (res.ok) {
        const data = await res.json()
        setData(data)
      }
    } catch (error) {
      console.error("Failed to fetch wallet:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: WalletEntry["type"]) => {
    switch (type) {
      case "SALE_COMMISSION": return <TrendingUp className="w-5 h-5 text-green-600" />
      case "PAYOUT": return <ArrowDown className="w-5 h-5 text-red-600" />
      case "ADJUSTMENT": return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getTypeLabel = (type: WalletEntry["type"]) => {
    switch (type) {
      case "SALE_COMMISSION": return "Venta"
      case "PAYOUT": return "Pago recibido"
      case "ADJUSTMENT": return "Ajuste"
    }
  }

  const getTypeColor = (type: WalletEntry["type"]) => {
    switch (type) {
      case "SALE_COMMISSION": return "text-green-600"
      case "PAYOUT": return "text-red-600"
      case "ADJUSTMENT": return "text-yellow-600"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-wine-950">Wallet</h1>
          <p className="text-dark-600">Your earnings and payouts</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1,2,3,4].map(i => (
            <Card key={i}><CardContent className="py-6"><div className="h-8 bg-dark-100 rounded w-3/4 animate-pulse" /><div className="h-4 bg-dark-100 rounded w-1/2 animate-pulse mt-2" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-wine-950 flex items-center gap-2">
            <Wallet className="w-8 h-8 text-wine-600" />
            Wallet
          </h1>
          <p className="text-dark-600">Transparent view of your earnings, commissions, and payouts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPeriod("current")} className={period === "current" ? "bg-wine-600 text-white" : ""}>
            Current Period
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPeriod("last")} className={period === "last" ? "bg-wine-600 text-white" : ""}>
            Last Period
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPeriod("all")} className={period === "all" ? "bg-wine-600 text-white" : ""}>
            All Time
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-dark-600">Current Balance</CardTitle>
            <div className="p-2 rounded-lg bg-wine-100"><Wallet className="w-4 h-4 text-wine-600" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-wine-950">{formatPrice(data!.balance)}</div>
            <p className="text-xs text-dark-500">Available for next payout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-dark-600">Total Earned</CardTitle>
            <div className="p-2 rounded-lg bg-green-100"><TrendingUp className="w-4 h-4 text-green-600" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatPrice(data!.summary.totalEarned)}</div>
            <p className="text-xs text-dark-500">All time commissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-dark-600">Paid Out</CardTitle>
            <div className="p-2 rounded-lg bg-red-100"><ArrowDown className="w-4 h-4 text-red-600" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{formatPrice(data!.summary.totalPaidOut)}</div>
            <p className="text-xs text-dark-500">Total received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-dark-600">Pending Payout</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-100"><Clock className="w-4 h-4 text-yellow-600" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {formatPrice(Math.max(0, data!.summary.currentBalance))}
            </div>
            <p className="text-xs text-dark-500">Next bi-monthly settlement</p>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <Card className="border-wine-200 bg-wine-50">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div className="p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-wine-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-wine-600" />
              </div>
              <h4 className="font-medium text-wine-950">Every Sale</h4>
              <p className="text-sm text-wine-700">You get notified instantly when a box sells. Your commission appears in wallet.</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-wine-950">Bi-Monthly Payout</h4>
              <p className="text-sm text-wine-700">Every 2 months we settle your wallet. You see the exact amount before transfer.</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-wine-950">Full Transparency</h4>
              <p className="text-sm text-wine-700">Every entry shows order, selection, customer, and exact split. No hidden fees.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transaction History</span>
            <span className="text-sm text-dark-500">{data?.pagination.total} entries</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.entries.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-dark-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-600 mb-2">No transactions yet</h3>
              <p className="text-dark-500">Your commissions will appear here when you make sales</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-dark-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-dark-500 uppercase">Balance</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-dark-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {data!.entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-dark-50">
                      <td className="px-4 py-3 text-sm text-dark-600">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(entry.type)}
                          <span className={cn("text-sm font-medium", getTypeColor(entry.type))}>
                            {getTypeLabel(entry.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-dark-600 max-w-xs truncate">
                        {entry.description}
                        {entry.order && (
                          <div className="text-xs text-dark-400 mt-1">
                            Order: {entry.order.orderNumber}
                            {entry.order.selection && <span> • {entry.order.selection.title}</span>}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn("font-mono font-medium", entry.amountCents >= 0 ? "text-green-600" : "text-red-600")}>
                          {entry.amountCents >= 0 ? "+" : ""}{formatPrice(entry.amountCents)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-dark-600 font-mono">
                        {formatPrice(entry.balanceCents)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {entry.isSettled ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" title="Settled" />
                        ) : entry.type === "PAYOUT" ? (
                          <XCircle className="w-5 h-5 text-red-500 mx-auto" title="Pending transfer" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-500 mx-auto" title="Pending settlement" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data && data.pagination.total > data.pagination.limit && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-dark-500">
                Showing {data.pagination.offset + 1}–{Math.min(data.pagination.offset + data.pagination.limit, data.pagination.total)} of {data.pagination.total}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={data.pagination.offset === 0} onClick={() => fetchWalletPage(data.pagination.offset - data.pagination.limit)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={data.pagination.offset + data.pagination.limit >= data.pagination.total} onClick={() => fetchWalletPage(data.pagination.offset + data.pagination.limit)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function fetchWalletPage(offset: number) {
  // This would need a more complex state management, simplified for now
  window.location.href = `/dashboard/sommelier/wallet?offset=${offset}&period=${period}`
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}