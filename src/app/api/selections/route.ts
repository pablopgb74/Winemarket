// src/app/api/selections/route.ts
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculatePricing, validatePricing } from "@/lib/pricing"
import { selectionSchema } from "@/lib/validations"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verificar que es sommelier
    const sommelier = await prisma.sommelier.findUnique({
      where: { userId: session.user.id },
    })

    if (!sommelier) {
      return NextResponse.json({ error: "Sommelier profile not found" }, { status: 403 })
    }

    if (!sommelier.isVerified) {
      return NextResponse.json({ error: "Sommelier not verified yet" }, { status: 403 })
    }

    const body = await req.json()
    const validation = selectionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 })
    }

    const { pricing, wines, ...data } = validation.data

    // Validar pricing
    const pricingErrors = validatePricing(pricing)
    if (pricingErrors.length > 0) {
      return NextResponse.json({ error: "Invalid pricing", details: pricingErrors }, { status: 400 })
    }

    // Calcular campos denormalizados
    const calculated = calculatePricing(pricing)

    // Verificar que no existe selección para este mes/año
    const existing = await prisma.selection.findUnique({
      where: { sommelierId_month_year: { sommelierId: sommelier.id, month: data.month, year: data.year } },
    })

    if (existing) {
      return NextResponse.json({ error: "Selection already exists for this month/year" }, { status: 400 })
    }

    // Crear selección con transacción
    const selection = await prisma.$transaction(async (tx) => {
      const sel = await tx.selection.create({
        data: {
          sommelierId: sommelier.id,
          ...data,
          // Pricing fields
          costCents: pricing.costCents,
          markupMode: pricing.markupMode,
          markupValue: pricing.markupValue,
          platformSplitPct: pricing.platformSplitPct,
          sommelierSplitPct: pricing.sommelierSplitPct,
          markupCents: calculated.markupCents,
          platformSplitCents: calculated.platformSplitCents,
          sommelierSplitCents: calculated.sommelierSplitCents,
          priceCents: calculated.priceCents,
          currency: pricing.currency,
        },
      })

      // Crear vinos de la selección
      if (wines && wines.length > 0) {
        await tx.selectionWine.createMany({
          data: wines.map((w, i) => ({
            selectionId: sel.id,
            wineId: w.wineId,
            position: w.position || i + 1,
            tastingNotes: w.tastingNotes,
            pairingSuggestion: w.pairingSuggestion,
            servingTemp: w.servingTemp,
            decantTime: w.decantTime,
          })),
        })
      }

      return sel
    })

    return NextResponse.json({
      selection: {
        ...selection,
        pricing: {
          cost: selection.costCents,
          markup: selection.markupCents,
          platform: selection.platformSplitCents,
          sommelier: selection.sommelierSplitCents,
          price: selection.priceCents,
        },
      },
    }, { status: 201 })
  } catch (error) {
    console.error("Create selection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const selections = await prisma.selection.findMany({
      where: { sommelierId: sommelier.id },
      include: {
        wines: { include: { wine: true } },
        _count: { select: { subscriptions: true, orders: true } },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    })

    return NextResponse.json({ selections })
  } catch (error) {
    console.error("Get selections error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}