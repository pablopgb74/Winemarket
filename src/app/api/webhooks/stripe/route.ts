// src/app/api/webhooks/stripe/route.ts
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import type { WebhookEventMap } from "@/types/stripe"

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
      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account)
        break
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      case "payout.paid":
        await handlePayoutPaid(event.data.object as Stripe.Payout)
        break
      case "payout.failed":
        await handlePayoutFailed(event.data.object as Stripe.Payout)
        break
    }
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err)
    return NextResponse.json({ error: "Handler error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleAccountUpdated(account: Stripe.Account) {
  const sommelier = await prisma.sommelier.findUnique({
    where: { stripeAccountId: account.id },
  })
  if (!sommelier) return

  await prisma.sommelier.update({
    where: { id: sommelier.id },
    data: {
      stripeOnboardingComplete: account.details_submitted && account.charges_enabled && account.payouts_enabled,
    },
  })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode === "subscription") {
    return
  }
}

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
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  })
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: invoice.subscription as string },
    include: { sommelier: true, selection: true },
  })
  if (!subscription) return

  await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId: subscription.customerId,
      sommelierId: subscription.sommelierId,
      selectionId: subscription.selectionId,
      subscriptionId: subscription.id,
      status: "CONFIRMED",
      type: "subscription",
      subtotalCents: invoice.amount_paid,
      taxCents: invoice.tax || 0,
      shippingCents: 0,
      totalCents: invoice.amount_paid,
      commissionRate: subscription.sommelier.commissionRate,
      commissionCents: Math.round(invoice.amount_paid * subscription.sommelier.commissionRate),
      platformFeeCents: Math.round(invoice.amount_paid * (1 - subscription.sommelier.commissionRate)),
      stripeChargeId: invoice.payment_intent as string,
    },
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: invoice.subscription as string },
    data: { status: "PAST_DUE" },
  })
}

async function handlePayoutPaid(payout: Stripe.Payout) {
  // Record payout to sommelier
}

async function handlePayoutFailed(payout: Stripe.Payout) {
  // Alert sommelier, retry logic
}

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