// src/types/stripe.ts
import Stripe from "stripe"

export interface SommelierStripeAccount {
  id: string
  sommelierId: string
  stripeAccountId: string
  onboardingComplete: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
  detailsSubmitted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateConnectAccountParams {
  email: string
  country: "US"
  businessType: "individual" | "company"
  metadata: { sommelierId: string }
  individual?: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    dob?: { day: number; month: number; year: number }
    address?: {
      line1: string
      line2?: string
      city: string
      state: string
      postalCode: string
    }
  }
  company?: {
    name: string
    taxId?: string
    address?: {
      line1: string
      line2?: string
      city: string
      state: string
      postalCode: string
    }
    owners?: Array<{
      firstName: string
      lastName: string
      email: string
      ownership: number
      dob: { day: number; month: number; year: number }
    }>
  }
}

export interface OnboardingLinkParams {
  stripeAccountId: string
  returnUrl: string
  refreshUrl: string
}

export interface CreateSubscriptionParams {
  customerId: string
  sommelierStripeAccountId: string
  priceId: string
  metadata: {
    selectionId: string
    sommelierId: string
    customerId: string
    boxSize: "SIX" | "TWELVE"
  }
  applicationFeePercent: number
}

export type WebhookEventTypes =
  | "account.updated"
  | "checkout.session.completed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "invoice.payment_succeeded"
  | "invoice.payment_failed"
  | "payout.paid"
  | "payout.failed"

export interface WebhookEventMap {
  "account.updated": Stripe.Account
  "checkout.session.completed": Stripe.Checkout.Session
  "customer.subscription.created": Stripe.Subscription
  "customer.subscription.updated": Stripe.Subscription
  "customer.subscription.deleted": Stripe.Subscription
  "invoice.payment_succeeded": Stripe.Invoice
  "invoice.payment_failed": Stripe.Invoice
  "payout.paid": Stripe.Payout
  "payout.failed": Stripe.Payout
}