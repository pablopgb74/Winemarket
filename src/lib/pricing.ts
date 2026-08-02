// src/lib/pricing.ts
/**
 * Pricing calculation utilities for Wine Marketplace
 * Handles configurable markup (percentage/fixed) and split between platform/sommelier
 */

export type MarkupMode = 'PERCENTAGE' | 'FIXED'

export interface PricingInput {
  costCents: number
  markupMode: MarkupMode
  markupValue: number      // 20 = 20% | 15 = $15
  platformSplitPct?: number // default 50
  sommelierSplitPct?: number // default 50
  currency?: string
}

export interface PricingResult {
  markupCents: number
  platformSplitCents: number
  sommelierSplitCents: number
  priceCents: number
  currency: string
}

export interface PricingDisplay {
  cost: string
  markup: string
  platform: string
  sommelier: string
  price: string
}

/**
 * Calculate pricing based on cost, markup mode, and split percentages
 */
export function calculatePricing(input: PricingInput): PricingResult {
  const {
    costCents,
    markupMode,
    markupValue,
    platformSplitPct = 50,
    sommelierSplitPct = 50,
    currency = 'USD',
  } = input

  // 1. Calcular markup en cents
  let markupCents: number
  if (markupMode === 'PERCENTAGE') {
    markupCents = Math.round(costCents * (markupValue / 100))
  } else {
    markupCents = Math.round(markupValue * 100) // markupValue ya es en dólares
  }

  // 2. Split del markup (evitar errores de redondeo)
  const platformSplitCents = Math.round(markupCents * (platformSplitPct / 100))
  const sommelierSplitCents = markupCents - platformSplitCents

  // 3. Precio final
  const priceCents = costCents + markupCents

  return {
    markupCents,
    platformSplitCents,
    sommelierSplitCents,
    priceCents,
    currency,
  }
}

/**
 * Validate pricing input
 */
export function validatePricing(input: PricingInput): string[] {
  const errors: string[] = {}

  if (input.costCents < 1000) errors.push('Costo mínimo: $10')
  if (input.costCents > 500000) errors.push('Costo máximo: $5,000')

  if (input.markupMode === 'PERCENTAGE') {
    if (input.markupValue < 10) errors.push('Markup mínimo: 10%')
    if (input.markupValue > 100) errors.push('Markup máximo: 100%')
  } else {
    if (input.markupValue < 5) errors.push('Markup fijo mínimo: $5')
    if (input.markupValue > 500) errors.push('Markup fijo máximo: $500')
  }

  const totalSplit = (input.platformSplitPct || 50) + (input.sommelierSplitPct || 50)
  if (Math.abs(totalSplit - 100) > 0.01) {
    errors.push('Los splits deben sumar 100%')
  }
  if ((input.platformSplitPct || 50) < 20) errors.push('Plataforma mínimo 20%')
  if ((input.sommelierSplitPct || 50) < 20) errors.push('Sommelier mínimo 20%')

  return errors
}

/**
 * Format pricing for display
 */
export function formatPricingForDisplay(result: PricingResult, input?: PricingInput): PricingDisplay {
  const fmt = (cents: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: result.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)

  return {
    cost: input ? fmt(input.costCents) : '—',
    markup: fmt(result.markupCents),
    platform: fmt(result.platformSplitCents),
    sommelier: fmt(result.sommelierSplitCents),
    price: fmt(result.priceCents),
  }
}

/**
 * Calculate pricing from Selection model (denormalized fields)
 */
export function calculatePricingFromSelection(selection: {
  costCents: number
  markupMode: MarkupMode
  markupValue: number
  platformSplitPct: number
  sommelierSplitPct: number
  currency: string
}): PricingResult {
  return calculatePricing({
    costCents: selection.costCents,
    markupMode: selection.markupMode,
    markupValue: selection.markupValue,
    platformSplitPct: selection.platformSplitPct,
    sommelierSplitPct: selection.sommelierSplitPct,
    currency: selection.currency,
  })
}

/**
 * Recalculate and return denormalized fields for Selection
 */
export function getSelectionDenormalizedPricing(selection: {
  costCents: number
  markupMode: MarkupMode
  markupValue: number
  platformSplitPct: number
  sommelierSplitPct: number
}) {
  const result = calculatePricing({
    costCents: selection.costCents,
    markupMode: selection.markupMode,
    markupValue: selection.markupValue,
    platformSplitPct: selection.platformSplitPct,
    sommelierSplitPct: selection.sommelierSplitPct,
  })

  return {
    markupCents: result.markupCents,
    platformSplitCents: result.platformSplitCents,
    sommelierSplitCents: result.sommelierSplitCents,
    priceCents: result.priceCents,
  }
}

/**
 * Calculate pricing from Order model (snapshot)
 */
export function calculatePricingFromOrder(order: {
  costCents: number
  markupMode: MarkupMode
  markupValue: number
  platformSplitPct: number
  sommelierSplitPct: number
  currency: string
}): PricingResult {
  return calculatePricing({
    costCents: order.costCents,
    markupMode: order.markupMode,
    markupValue: order.markupValue,
    platformSplitPct: order.platformSplitPct,
    sommelierSplitPct: order.sommelierSplitPct,
    currency: order.currency,
  })
}

/**
 * Default pricing constants
 */
export const PRICING_DEFAULTS = {
  markupMode: 'PERCENTAGE' as MarkupMode,
  markupValue: 20, // 20%
  platformSplitPct: 50,
  sommelierSplitPct: 50,
  currency: 'USD' as const,
  minCostCents: 1000,
  maxCostCents: 500000,
  minPercentageMarkup: 10,
  maxPercentageMarkup: 100,
  minFixedMarkup: 5,
  maxFixedMarkup: 500,
  minSplitPct: 20,
  maxSplitPct: 80,
} as const

/**
 * Example calculations for reference
 */
export const PRICING_EXAMPLES = [
  { cost: 10000, mode: 'PERCENTAGE', markup: 20, split: 50, result: { markup: 2000, platform: 1000, sommelier: 1000, price: 12000 } },
  { cost: 10000, mode: 'PERCENTAGE', markup: 20, split: 40, result: { markup: 2000, platform: 800, sommelier: 1200, price: 12000 } },
  { cost: 10000, mode: 'FIXED', markup: 15, split: 50, result: { markup: 1500, platform: 750, sommelier: 750, price: 11500 } },
  { cost: 40000, mode: 'PERCENTAGE', markup: 15, split: 50, result: { markup: 6000, platform: 3000, sommelier: 3000, price: 46000 } },
  { cost: 100000, mode: 'FIXED', markup: 100, split: 30, result: { markup: 10000, platform: 3000, sommelier: 7000, price: 110000 } },
] as const