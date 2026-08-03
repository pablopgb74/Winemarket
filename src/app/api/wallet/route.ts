// src/app/api/wallet/route.ts
import { auth } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sommelier = await prisma.sommelier.findUnique({
      where: { userId: session.user.id },
    })

    if (!sommelier) {
      return NextResponse.json({ error: "Sommelier profile not found" }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") // "current" | "last" | "all"
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    let where: any = { sommelierId: sommelier.id }

    if (period === "current") {
      const now = new Date()
      const periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1) // 2 meses atrás
      where.periodStart = { gte: periodStart }
    } else if (period === "last") {
      const now = new Date()
      const periodStart = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      const periodEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0)
      where.periodStart = { gte: periodStart, lte: periodEnd }
    }

    const [entries, total, summary] = await Promise.all([
      prisma.walletEntry.findMany({
        where,
        include: {
          order: {
            select: {
              orderNumber: true,
              selection: { select: { title: true } },
              customer: { select: { user: { select: { name: true } } } },
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.walletEntry.count({ where }),
      prisma.walletEntry.groupBy({
        by: ["type"],
        where: { sommelierId: sommelier.id },
        _sum: { amountCents: true },
      }),
    ])

    // Balance actual
    const lastEntry = await prisma.walletEntry.findFirst({
      where: { sommelierId: sommelier.id },
      orderBy: { createdAt: "desc" },
    })

    const summaryMap = summary.reduce((acc, s) => {
      acc[s.type] = s._sum.amountCents || 0
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      entries,
      pagination: { total, limit, offset },
      balance: lastEntry?.balanceCents || 0,
      summary: {
        totalEarned: summaryMap.SALE_COMMISSION || 0,
        totalPaidOut: Math.abs(summaryMap.PAYOUT || 0),
        totalAdjustments: summaryMap.ADJUSTMENT || 0,
        currentBalance: lastEntry?.balanceCents || 0,
      },
    })
  } catch (error) {
    console.error("Get wallet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}