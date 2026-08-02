// src/app/api/orders/route.ts
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe, createPaymentIntent, getOrCreateCustomer, generateOrderNumber } from "@/lib/stripe"
import { calculatePricingFromSelection } from "@/lib/pricing"
import { createOrderSchema } from "@/lib/validations"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validation = createOrderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 })
    }

    const { selectionId, boxSize, addressId, paymentMethodId, type } = validation.data

    // Obtener selección con pricing
    const selection = await prisma.selection.findUnique({
      where: { id: selectionId },
      include: { sommelier: true, wines: { include: { wine: true } } },
    })

    if (!selection) {
      return NextResponse.json({ error: "Selection not found" }, { status: 404 })
    }

    if (selection.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Selection not available for purchase" }, { status: 400 })
    }

    if (selection.currentSubscribers && selection.maxSubscribers && selection.currentSubscribers >= selection.maxSubscribers) {
      return NextResponse.json({ error: "Selection sold out" }, { status: 400 })
    }

    // Obtener customer profile
    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
      include: { user: true, addresses: true, paymentMethods: true },
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 400 })
    }

    // Verificar dirección
    const address = customer.addresses.find(a => a.id === addressId)
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 400 })
    }

    // Verificar edad (alcohol)
    if (customer.dateOfBirth) {
      const age = Math.floor((Date.now() - new Date(customer.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      if (age < 21) {
        return NextResponse.json({ error: "Must be 21+ to purchase alcohol" }, { status: 400 })
      }
    }

    // Calcular pricing desde selection
    const pricing = calculatePricingFromSelection({
      costCents: selection.costCents,
      markupMode: selection.markupMode,
      markupValue: selection.markupValue,
      platformSplitPct: selection.platformSplitPct,
      sommelierSplitPct: selection.sommelierSplitPct,
      currency: selection.currency,
    })

    // Crear o obtener Stripe customer
    let stripeCustomerId = customer.stripeCustomerId
    if (!stripeCustomerId) {
      const stripeCustomer = await getOrCreateCustomer(customer.user.email!, customer.user.name || undefined, customer.id)
      stripeCustomerId = stripeCustomer.id
      await prisma.customer.update({
        where: { id: customer.id },
        data: { stripeCustomerId },
      })
    }

    // Crear order en DB (PENDING)
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        sommelierId: selection.sommelierId,
        selectionId: selection.id,
        status: "PENDING",
        type,
        boxSize,
        // Pricing snapshot
        costCents: selection.costCents,
        markupMode: selection.markupMode,
        markupValue: selection.markupValue,
        platformSplitPct: selection.platformSplitPct,
        sommelierSplitPct: selection.sommelierSplitPct,
        markupCents: pricing.markupCents,
        platformSplitCents: pricing.platformSplitCents,
        sommelierSplitCents: pricing.sommelierSplitCents,
        priceCents: pricing.priceCents,
        totalCents: pricing.priceCents, // + tax + shipping se puede agregar después
        currency: selection.currency,
        addressId: address.id,
      },
    })

    // Crear PaymentIntent
    const paymentIntent = await createPaymentIntent({
      amountCents: pricing.priceCents,
      currency: selection.currency.toLowerCase(),
      customerId: stripeCustomerId,
      paymentMethodId,
      metadata: {
        orderId: order.id,
        selectionId: selection.id,
        sommelierId: selection.sommelierId,
        customerId: customer.id,
        boxSize,
        type,
      },
      receiptEmail: customer.user.email,
      setupFutureUsage: "off_session",
    })

    // Actualizar order con paymentIntentId
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    })

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      clientSecret: paymentIntent.client_secret,
      amount: pricing.priceCents,
      currency: selection.currency,
      pricing: {
        cost: pricing.priceCents - pricing.markupCents,
        markup: pricing.markupCents,
        platform: pricing.platformSplitCents,
        sommelier: pricing.sommelierSplitCents,
        total: pricing.priceCents,
      },
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 404 })
    }

    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        selection: {
          include: { sommelier: { select: { headline: true, user: { select: { name: true, avatar: true } } } } },
        },
        fulfillment: true,
        address: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}