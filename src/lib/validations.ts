// src/lib/validations.ts
import { z } from "zod"
import { calculatePricing, validatePricing, PRICING_DEFAULTS } from "@/lib/pricing"

// ============================================
// AUTH VALIDATIONS
// ============================================

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const onboardingRoleSchema = z.enum(["customer", "sommelier"])

// ============================================
// SOMMELIER PROFILE VALIDATIONS
// ============================================

export const sommelierProfileSchema = z.object({
  headline: z.string().min(10, "Headline must be at least 10 characters").max(200),
  bio: z.string().max(2000).optional(),
  certifications: z.array(z.string()).optional(),
  instagramHandle: z.string().regex(/^[a-zA-Z0-9._]+$/).optional(),
  twitterHandle: z.string().regex(/^[a-zA-Z0-9_]+$/).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  yearsExperience: z.number().int().min(0).max(60).optional(),
  specialties: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
})

// ============================================
// SELECTION VALIDATIONS (con pricing configurable)
// ============================================

export const selectionPricingSchema = z.object({
  costCents: z.number().int().min(PRICING_DEFAULTS.minCostCents, "Minimum cost: $10").max(PRICING_DEFAULTS.maxCostCents, "Maximum cost: $5,000"),
  markupMode: z.enum(["PERCENTAGE", "FIXED"]).default(PRICING_DEFAULTS.markupMode),
  markupValue: z.number().positive(),
  platformSplitPct: z.number().min(PRICING_DEFAULTS.minSplitPct).max(PRICING_DEFAULTS.maxSplitPct).default(PRICING_DEFAULTS.platformSplitPct),
  sommelierSplitPct: z.number().min(PRICING_DEFAULTS.minSplitPct).max(PRICING_DEFAULTS.maxSplitPct).default(PRICING_DEFAULTS.sommelierSplitPct),
  currency: z.string().length(3).default(PRICING_DEFAULTS.currency),
}).refine((data) => {
  const errors = validatePricing(data)
  return errors.length === 0
}, {
  message: "Invalid pricing configuration",
  path: ["markupValue"],
})

export const selectionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(50, "Description must be at least 50 characters").max(5000),
  story: z.string().max(5000).optional(),
  theme: z.string().max(100).optional(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2024).max(2030),
  boxSize: z.enum(["SIX", "TWELVE"]).default("SIX"),
  pricing: selectionPricingSchema,
  maxSubscribers: z.number().int().min(1).optional(),
  shipsAt: z.string().datetime().optional(),
  allowsSubscription: z.boolean().default(true),
})

export const selectionUpdateSchema = selectionSchema.partial().omit({ month: true, year: true, sommelierId: true })

// ============================================
// WINE VALIDATIONS
// ============================================

export const wineSchema = z.object({
  name: z.string().min(2).max(200),
  producer: z.string().min(2).max(200),
  region: z.string().min(2).max(200),
  subRegion: z.string().max(200).optional(),
  country: z.string().length(2),
  vintage: z.number().int().min(1900).max(new Date().getFullYear()),
  varietals: z.array(z.string()).min(1, "At least one varietal required"),
  color: z.enum(["red", "white", "rose", "orange", "sparkling"]),
  abv: z.number().min(0).max(30).optional(),
  bottleSizeMl: z.number().int().default(750),
  imageUrl: z.string().url().optional(),
  labelImageUrl: z.string().url().optional(),
  description: z.string().max(5000).optional(),
  tastingNotes: z.string().max(5000).optional(),
  foodPairing: z.string().max(5000).optional(),
  retailPriceCents: z.number().int().min(0).optional(),
})

export const selectionWineSchema = z.object({
  wineId: z.string().cuid(),
  position: z.number().int().min(1).max(12),
  tastingNotes: z.string().max(5000).optional(),
  pairingSuggestion: z.string().max(1000).optional(),
  servingTemp: z.string().max(50).optional(),
  decantTime: z.string().max(50).optional(),
})

// ============================================
// ADDRESS VALIDATIONS
// ============================================

export const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  line1: z.string().min(2, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().length(2).default("US"),
  phone: z.string().optional(),
  addressType: z.enum(["shipping", "billing"]).default("shipping"),
})

// ============================================
// CUSTOMER PROFILE VALIDATIONS
// ============================================

export const customerProfileSchema = z.object({
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  marketingOptIn: z.boolean().default(false),
})

// ============================================
// ORDER VALIDATIONS
// ============================================

export const createOrderSchema = z.object({
  selectionId: z.string().cuid(),
  boxSize: z.enum(["SIX", "TWELVE"]).default("SIX"),
  addressId: z.string().cuid(),
  paymentMethodId: z.string().optional(),
  type: z.enum(["one_time", "subscription"]).default("one_time"),
})

// ============================================
// SUBSCRIPTION VALIDATIONS
// ============================================

export const createSubscriptionSchema = z.object({
  selectionId: z.string().cuid(),
  boxSize: z.enum(["SIX", "TWELVE"]).default("SIX"),
  billingCycle: z.enum(["monthly", "quarterly", "annual"]).default("monthly"),
  paymentMethodId: z.string(),
  trialDays: z.number().int().min(0).max(30).optional(),
})

// ============================================
// ADMIN VALIDATIONS
// ============================================

export const sommelierApprovalSchema = z.object({
  sommelierId: z.string().cuid(),
  action: z.enum(["approve", "reject", "request_changes"]),
  notes: z.string().max(2000).optional(),
})

// ============================================
// TYPE EXPORTS
// ============================================

export type SignInInput = z.infer<typeof signInSchema>
export type OnboardingRoleInput = z.infer<typeof onboardingRoleSchema>
export type SommelierProfileInput = z.infer<typeof sommelierProfileSchema>
export type SelectionInput = z.infer<typeof selectionSchema>
export type SelectionUpdateInput = z.infer<typeof selectionUpdateSchema>
export type SelectionPricingInput = z.infer<typeof selectionPricingSchema>
export type WineInput = z.infer<typeof wineSchema>
export type SelectionWineInput = z.infer<typeof selectionWineSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CustomerProfileInput = z.infer<typeof customerProfileSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>
export type SommelierApprovalInput = z.infer<typeof sommelierApprovalSchema>