// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// src/lib/validations/index.ts
import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
})

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

export const selectionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(50, "Description must be at least 50 characters").max(5000),
  story: z.string().max(5000).optional(),
  theme: z.string().max(100).optional(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2024).max(2030),
  boxSize: z.enum(["SIX", "TWELVE"]),
  priceCents: z.number().int().min(1000).max(1000000),
  currency: z.string().length(3).default("USD"),
  maxSubscribers: z.number().int().min(1).optional(),
  shipsAt: z.string().datetime().optional(),
})

export const wineSchema = z.object({
  name: z.string().min(2).max(200),
  producer: z.string().min(2).max(200),
  region: z.string().min(2).max(200),
  subRegion: z.string().max(200).optional(),
  country: z.string().length(2),
  vintage: z.number().int().min(1900).max(new Date().getFullYear()),
  varietals: z.array(z.string()).min(1),
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