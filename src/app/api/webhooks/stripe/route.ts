// src/app/api/webhooks/stripe/route.ts
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { calculatePricingFromOrder } from "@/lib/pricing"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
      case "payment_intent.canceled":
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent)
        break
      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case "invoice.payment_succeeded":
        await handleSubscriptionPaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case "invoice.payment_failed":
        await handleSubscriptionPaymentFailed(event.data.object as Stripe.Invoice)
        break
    }
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err)
    return NextResponse.json({ error: "Handler error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// ============================================
// PAYMENT INTENT HANDLERS (One-time purchases)
// ============================================

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId
  if (!orderId) {
    console.warn("PaymentIntent missing orderId metadata", paymentIntent.id)
    return
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      selection: { include: { sommelier: true } },
      customer: { include: { user: true } },
      sommelier: { include: { user: true } },
    },
  })

  if (!order) {
    console.warn("Order not found for payment_intent", paymentIntent.id)
    return
  }

  if (order.status === "CONFIRMED") {
    console.log("Order already confirmed", orderId)
    return
  }

  // Calcular pricing desde el snapshot del order
  const pricing = calculatePricingFromOrder({
    costCents: order.costCents,
    markupMode: order.markupMode,
    markupValue: order.markupValue,
    platformSplitPct: order.platformSplitPct,
    sommelierSplitPct: order.sommelierSplitPct,
    currency: order.currency,
  })

  // Transacción atómica: actualizar order + crear wallet entry + notificación
  await prisma.$transaction(async (tx) => {
    // 1. Actualizar order
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "CONFIRMED",
        stripeChargeId: paymentIntent.latest_charge as string,
        // Los campos de pricing ya están en el order (snapshot)
      },
    })

    // 2. Crear WalletEntry para el sommelier (crédito)
    if (order.sommelierId && pricing.sommelierSplitCents > 0) {
      const lastEntry = await tx.walletEntry.findFirst({
        where: { sommelierId: order.sommelierId },
        orderBy: { createdAt: "desc" },
      })
      const newBalance = (lastEntry?.balanceCents || 0) + pricing.sommelierSplitCents

      const walletEntry = await tx.walletEntry.create({
        data: {
          sommelierId: order.sommelierId,
          orderId: order.id,
          type: "SALE_COMMISSION",
          amountCents: pricing.sommelierSplitCents,
          balanceCents: newBalance,
          description: `Venta: ${order.selection?.title || "Selección"} (${order.boxSize})`,
        },
      })

      // 3. Vincular wallet entry al order
      await tx.order.update({
        where: { id: orderId },
        data: { walletEntryId: walletEntry.id },
      })

      // 4. Crear notificación de venta para el sommelier
      await tx.saleNotification.create({
        data: {
          sommelierId: order.sommelierId,
          orderId: order.id,
          type: "new_sale",
        },
      })

      // 5. Notificación al usuario (email)
      await tx.notification.create({
        data: {
          userId: order.sommelier.userId,
          type: "new_sale",
          title: "¡Nueva venta!",
          message: `Vendiste 1 caja de "${order.selection?.title}". Tu comisión: $${(pricing.sommelierSplitCents / 100).toFixed(2)}`,
          data: { orderId: order.id, amountCents: pricing.sommelierSplitCents },
        },
      })
    }

    // 6. Notificación al cliente (email de confirmación)
    await tx.notification.create({
      data: {
        userId: order.customer.userId,
        type: "order_confirmed",
        title: "Orden confirmada",
        message: `Tu orden #${order.orderNumber} ha sido confirmada. Total: $${(order.totalCents / 100).toFixed(2)}`,
        data: { orderId: order.id },
      },
    })
  })

  console.log(`Order ${orderId} confirmed, wallet entry created for sommelier ${order.sommelierId}`)
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId
  if (!orderId) return

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  })

  // Notificar al cliente
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { customer: { include: { user: true } } },
  })
  if (order) {
    await prisma.notification.create({
      data: {
        userId: order.customer.userId,
        type: "payment_failed",
        title: "Pago fallido",
        message: `No pudimos procesar el pago de tu orden #${order.orderNumber}. Por favor, intenta de nuevo.`,
        data: { orderId: order.id, error: paymentIntent.last_payment_error?.message },
      },
    })
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId
  if (!orderId) return

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  })
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  const orderId = paymentIntent.metadata.orderId
  if (!orderId) return

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { sommelier: true, walletEntry: true },
    })
    if (!order) return

    // Actualizar order
    await tx.order.update({
      where: { id: orderId },
      data: { status: "REFUNDED" },
    })

    // Revertir wallet entry si existe
    if (order.walletEntry && order.sommelierId) {
      const lastEntry = await tx.walletEntry.findFirst({
        where: { sommelierId: order.sommelierId },
        orderBy: { createdAt: "desc" },
      })
      const refundAmount = charge.amount_refunded
      const sommelierRefund = Math.round(refundAmount * (order.sommelierSplitPct / 100))
      const newBalance = (lastEntry?.balanceCents || 0) - sommelierRefund

      await tx.walletEntry.create({
        data: {
          sommelierId: order.sommelierId,
          orderId: order.id,
          type: "ADJUSTMENT",
          amountCents: -sommelierRefund,
          balanceCents: newBalance,
          description: `Reembolso: ${order.selection?.title || "Selección"} (parcial: $${(refundAmount / 100).toFixed(2)})`,
        },
      })
    }
  })
}

// ============================================
// SUBSCRIPTION HANDLERS (Optional subscriptions)
// ============================================

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const selectionId = subscription.metadata.selectionId
  const sommelierId = subscription.metadata.sommelierId
  const customerId = subscription.metadata.customerId

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      stripeSubscriptionId: subscription.id,
      customerId,
      sommelierId,
      selectionId: selectionId || undefined,
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  })
}

async function handleSubscriptionPaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: invoice.subscription as string },
    include: { sommelier: true, selection: true, customer: { include: { user: true } } },
  })
  if (!subscription) return

  // Calcular pricing desde la suscripción (usar pricing de la selection)
  const selection = subscription.selection
  if (!selection) return

  const pricing = calculatePricingFromSelection({
    costCents: selection.costCents,
    markupMode: selection.markupMode,
    markupValue: selection.markupValue,
    platformSplitPct: selection.platformSplitPct,
    sommelierSplitPct: selection.sommelierSplitPct,
    currency: selection.currency,
  })

  await prisma.$transaction(async (tx) => {
    // Crear order de renovación
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: subscription.customerId,
        sommelierId: subscription.sommelierId,
        selectionId: subscription.selectionId,
        subscriptionId: subscription.id,
        status: "CONFIRMED",
        type: "subscription",
        costCents: selection.costCents,
        markupMode: selection.markupMode,
        markupValue: selection.markupValue,
        platformSplitPct: selection.platformSplitPct,
        sommelierSplitPct: selection.sommelierSplitPct,
        markupCents: pricing.markupCents,
        platformSplitCents: pricing.platformSplitCents,
        sommelierSplitCents: pricing.sommelierSplitCents,
        priceCents: pricing.priceCents,
        totalCents: invoice.amount_paid,
        currency: subscription.currency,
        stripeChargeId: invoice.payment_intent as string,
      },
    })

    // Wallet entry para sommelier
    if (subscription.sommelierId && pricing.sommelierSplitCents > 0) {
      const lastEntry = await tx.walletEntry.findFirst({
        where: { sommelierId: subscription.sommelierId },
        orderBy: { createdAt: "desc" },
      })
      const newBalance = (lastEntry?.balanceCents || 0) + pricing.sommelierSplitCents

      const walletEntry = await tx.walletEntry.create({
        data: {
          sommelierId: subscription.sommelierId,
          orderId: order.id,
          type: "SALE_COMMISSION",
          amountCents: pricing.sommelierSplitCents,
          balanceCents: newBalance,
          description: `Renovación suscripción: ${selection.title}`,
        },
      })

      await tx.order.update({
        where: { id: order.id },
        data: { walletEntryId: walletEntry.id },
      })

      // Notificación
      await tx.saleNotification.create({
        data: {
          sommelierId: subscription.sommelierId,
          orderId: order.id,
          type: "subscription_renewal",
        },
      })

      await tx.notification.create({
        data: {
          userId: subscription.sommelier.userId,
          type: "subscription_renewal",
          title: "Renovación de suscripción",
          message: `Un cliente renovó su suscripción a "${selection.title}". Tu comisión: $${(pricing.sommelierSplitCents / 100).toFixed(2)}`,
          data: { orderId: order.id, amountCents: pricing.sommelierSplitCents },
        },
      })
    }

    // Notificación al cliente
    await tx.notification.create({
      data: {
        userId: subscription.customer.userId,
        type: "subscription_renewal",
        title: "Suscripción renovada",
        message: `Tu suscripción a "${selection.title}" se ha renovado. Total: $${(invoice.amount_paid / 100).toFixed(2)}`,
        data: { orderId: order.id },
      },
    })
  })
}

async function handleSubscriptionPaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  await prisma.subscription.update({
    where: { stripeSubscriptionId: invoice.subscription as string },
    data: { status: "PAST_DUE" },
  })
}

// ============================================
// HELPERS
// ============================================

function mapStripeStatus(status: Stripe.Subscription.Status): "ACTIVE" | "PAUSED" | "CANCELLED" | "PAST_DUE" | "TRIALING" {
  switch (status) {
    case "active": return "ACTIVE"
    case "past_due": return "PAST_DUE"
    case "canceled": return "CANCELLED"
    case "incomplete":
    case "incomplete_expired":
    case "trialing": return "TRIALING"
    default: return "PAUSED"
  }
}

function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0")
  return `WM-${year}-${random}`
}