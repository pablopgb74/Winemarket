// src/lib/stripe.ts
import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
})

// Helper functions
export async function createConnectAccount(params: {
  email: string
  country: "US"
  businessType: "individual" | "company"
  metadata: { sommelierId: string }
}) {
  return stripe.accounts.create({
    type: "express",
    country: params.country,
    email: params.email,
    business_type: params.businessType,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_profile: {
      name: `Sommelier Selection - ${params.email}`,
      url: process.env.NEXTAUTH_URL,
    },
    settings: {
      payouts: {
        schedule: { interval: "monthly" },
      },
    },
    metadata: params.metadata,
  })
}

export async function createOnboardingLink(accountId: string, returnUrl: string, refreshUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    return_url: returnUrl,
    refresh_url: refreshUrl,
    type: "account_onboarding",
  })
  return accountLink.url
}

export async function createSubscriptionWithConnect(params: {
  customerId: string
  sommelierStripeAccountId: string
  priceId: string
  applicationFeePercent: number
  metadata: Record<string, string>
}) {
  return stripe.subscriptions.create({
    customer: params.customerId,
    items: [{ price: params.priceId }],
    application_fee_percent: params.applicationFeePercent,
    transfer_data: {
      destination: params.sommelierStripeAccountId,
    },
    metadata: params.metadata,
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  })
}

export async function getAccountStatus(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId)
  return {
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted,
    requirements: account.requirements,
  }
}

export async function createPortalSession(accountId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    account: accountId,
    return_url: returnUrl,
  })
  return session.url
}

export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0")
  return `WM-${year}-${random}`
}