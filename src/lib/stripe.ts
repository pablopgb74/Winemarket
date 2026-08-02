// src/lib/stripe.ts
import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
})

// ============================================
// TYPES
// ============================================

export interface CreatePaymentIntentParams {
  amountCents: number
  currency?: string
  customerId?: string // Stripe customer ID
  paymentMethodId?: string
  metadata: {
    orderId: string
    selectionId: string
    sommelierId: string
    customerId: string // Internal customer ID
    boxSize: "SIX" | "TWELVE"
    type: "one_time" | "subscription"
  }
  receiptEmail?: string
  setupFutureUsage?: "off_session" // Para guardar método de pago
}

export interface CreateCustomerParams {
  email: string
  name?: string
  metadata?: Record<string, string>
}

export interface WebhookEventTypes {
  "payment_intent.succeeded": Stripe.PaymentIntent
  "payment_intent.payment_failed": Stripe.PaymentIntent
  "payment_intent.canceled": Stripe.PaymentIntent
  "charge.refunded": Stripe.Charge
  "customer.subscription.created": Stripe.Subscription
  "customer.subscription.updated": Stripe.Subscription
  "customer.subscription.deleted": Stripe.Subscription
  "invoice.payment_succeeded": Stripe.Invoice
  "invoice.payment_failed": Stripe.Invoice
}

// ============================================
// HELPERS
// ============================================

export async function createCustomer(params: CreateCustomerParams) {
  return stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata,
  })
}

export async function getOrCreateCustomer(email: string, name?: string, internalId?: string) {
  const existing = await stripe.customers.list({ email, limit: 1 })
  if (existing.data.length > 0) {
    return existing.data[0]
  }
  return createCustomer({ email, name, metadata: { internalId } })
}

export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  return stripe.paymentIntents.create({
    amount: params.amountCents,
    currency: params.currency || "usd",
    customer: params.customerId,
    payment_method: params.paymentMethodId,
    metadata: params.metadata,
    receipt_email: params.receiptEmail,
    setup_future_usage: params.setupFutureUsage,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  })
}

export async function confirmPaymentIntent(paymentIntentId: string, paymentMethodId?: string) {
  return stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethodId,
  })
}

export async function capturePaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.capture(paymentIntentId)
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.cancel(paymentIntentId)
}

export async function createRefund(paymentIntentId: string, amountCents?: number, reason?: "duplicate" | "fraudulent" | "requested_by_customer") {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amountCents,
    reason,
  })
}

export async function attachPaymentMethod(customerId: string, paymentMethodId: string) {
  return stripe.paymentMethods.attach(paymentMethodId, { customer: customerId })
}

export async function detachPaymentMethod(paymentMethodId: string) {
  return stripe.paymentMethods.detach(paymentMethodId)
}

export async function listPaymentMethods(customerId: string, type: "card" | "us_bank_account" = "card") {
  return stripe.paymentMethods.list({ customer: customerId, type })
}

export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0")
  return `WM-${year}-${random}`
}

// ============================================
// SUBSCRIPTION HELPERS (para suscripciones opcionales)
// ============================================

export async function createSubscription(params: {
  customerId: string
  priceId: string
  metadata: Record<string, string>
  trialPeriodDays?: number
}) {
  return stripe.subscriptions.create({
    customer: params.customerId,
    items: [{ price: params.priceId }],
    metadata: params.metadata,
    trial_period_days: params.trialPeriodDays,
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  })
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId)
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

// ============================================
// PRICES (para crear precios dinámicos por selección)
// ============================================

export async function createPrice(params: {
  productId: string
  unitAmount: number
  currency?: string
  recurring?: { interval: "month" | "quarter" | "year" }
  metadata?: Record<string, string>
}) {
  return stripe.prices.create({
    product: params.productId,
    unit_amount: params.unitAmount,
    currency: params.currency || "usd",
    recurring: params.recurring,
    metadata: params.metadata,
  })
}

export async function createProduct(params: {
  name: string
  description?: string
  metadata?: Record<string, string>
  images?: string[]
}) {
  return stripe.products.create({
    name: params.name,
    description: params.description,
    metadata: params.metadata,
    images: params.images,
  })
}

export async function getOrCreateProductForSelection(selectionId: string, title: string) {
  // Buscar producto existente por metadata
  const products = await stripe.products.search({
    query: `metadata['selection_id']:'${selectionId}'`,
    limit: 1,
  })
  if (products.data.length > 0) {
    return products.data[0]
  }
  return createProduct({
    name: title,
    metadata: { selection_id: selectionId },
  })
}