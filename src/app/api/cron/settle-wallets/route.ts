// src/app/api/cron/settle-wallets/route.ts
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(req: Request) {
  // Verificar autorización (solo cron job o admin)
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  try {
    const now = new Date()
    // Período: hace 2 meses completo (ej. si hoy es 15 marzo, período = enero)
    const periodEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59)
    const periodStart = new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0)

    console.log(`Settling wallets for period: ${periodStart.toISOString()} to ${periodEnd.toISOString()}`)

    // Obtener sommeliers con entries no liquidadas en el período
    const sommeliersWithEntries = await prisma.walletEntry.groupBy({
      by: ["sommelierId"],
      where: {
        type: "SALE_COMMISSION",
        isSettled: false,
        createdAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      _sum: { amountCents: true },
    })

    let settledCount = 0
    let totalAmount = 0

    for (const s of sommeliersWithEntries) {
      const totalCommission = s._sum.amountCents || 0
      if (totalCommission <= 0) continue

      // Obtener último balance
      const lastEntry = await prisma.walletEntry.findFirst({
        where: { sommelierId: s.sommelierId },
        orderBy: { createdAt: "desc" },
      })
      const currentBalance = lastEntry?.balanceCents || 0

      // Crear entry de payout (débito) y marcar entries como settled en transacción
      await prisma.$transaction(async (tx) => {
        // 1. Entry de payout (negativo = dinero que sale)
        const payoutEntry = await tx.walletEntry.create({
          data: {
            sommelierId: s.sommelierId,
            type: "PAYOUT",
            amountCents: -totalCommission,
            balanceCents: currentBalance - totalCommission,
            description: `Liquidación ${periodStart.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}–${periodEnd.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}`,
            periodStart,
            periodEnd,
            isSettled: true,
            settledAt: new Date(),
          },
        })

        // 2. Marcar entries del período como settled
        await tx.walletEntry.updateMany({
          where: {
            sommelierId: s.sommelierId,
            type: "SALE_COMMISSION",
            isSettled: false,
            createdAt: { gte: periodStart, lte: periodEnd },
          },
          data: { isSettled: true },
        })

        // 3. Crear notificación
        const sommelier = await tx.sommelier.findUnique({
          where: { id: s.sommelierId },
          select: { userId: true },
        })
        if (sommelier) {
          await tx.notification.create({
            data: {
              userId: sommelier.userId,
              type: "payout_settled",
              title: "Liquidación completada",
              message: `Tu liquidación del período ${periodStart.toLocaleDateString("es-ES", { month: "long" })}–${periodEnd.toLocaleDateString("es-ES", { month: "long" })} ha sido procesada. Monto: $${(totalCommission / 100).toFixed(2)}`,
              data: { periodStart: periodStart.toISOString(), periodEnd: periodEnd.toISOString(), amountCents: totalCommission, walletEntryId: payoutEntry.id },
            },
          })
        }
      })

      settledCount++
      totalAmount += totalCommission
    }

    return NextResponse.json({
      success: true,
      period: { start: periodStart.toISOString(), end: periodEnd.toISOString() },
      settledCount,
      totalAmountCents: totalAmount,
      message: `Settled ${settledCount} sommeliers for $${(totalAmount / 100).toFixed(2)}`,
    })
  } catch (error) {
    console.error("Wallet settlement error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  return GET(req)
}