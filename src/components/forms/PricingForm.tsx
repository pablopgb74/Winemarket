// src/components/forms/PricingForm.tsx
"use client"

import { useState, useMemo } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { calculatePricing, validatePricing, formatPricingForDisplay, PRICING_DEFAULTS, type MarkupMode, type PricingDisplay } from "../../lib/pricing"

import type { PricingInput } from "../../lib/pricing"

export type { PricingInput }
import { cn } from "../../lib/utils"

interface PricingFormProps {
  onChange: (pricing: PricingInput) => void
  initial?: PricingInput
  disabled?: boolean
  showAdvanced?: boolean
}

export function PricingForm({ onChange, initial, disabled = false, showAdvanced = true }: PricingFormProps) {
  const [mode, setMode] = useState<MarkupMode>(initial?.markupMode || PRICING_DEFAULTS.markupMode)
  const [cost, setCost] = useState(initial?.costCents ? initial.costCents / 100 : PRICING_DEFAULTS.minCostCents / 100)
  const [markupValue, setMarkupValue] = useState(initial?.markupValue || PRICING_DEFAULTS.markupValue)
  const [platformSplit, setPlatformSplit] = useState(initial?.platformSplitPct || PRICING_DEFAULTS.platformSplitPct)
  const [currency] = useState(initial?.currency || PRICING_DEFAULTS.currency)

  // Validar y calcular en tiempo real
  const input: PricingInput = useMemo(() => ({
    costCents: Math.round(cost * 100),
    markupMode: mode,
    markupValue,
    platformSplitPct: platformSplit,
    sommelierSplitPct: 100 - platformSplit,
    currency,
  }), [cost, mode, markupValue, platformSplit, currency])

  const result = useMemo(() => calculatePricing(input), [input])
  const display = useMemo(() => formatPricingForDisplay(result, input), [result, input])
  const errors = useMemo(() => validatePricing(input), [input])
  const isValid = errors.length === 0 && input.costCents >= PRICING_DEFAULTS.minCostCents

  // Actualizar markupValue constraints cuando cambia el modo
  const markupMin = mode === 'PERCENTAGE' ? PRICING_DEFAULTS.minPercentageMarkup : PRICING_DEFAULTS.minFixedMarkup
  const markupMax = mode === 'PERCENTAGE' ? PRICING_DEFAULTS.maxPercentageMarkup : PRICING_DEFAULTS.maxFixedMarkup
  const markupStep = mode === 'PERCENTAGE' ? 1 : 0.5
  const markupSuffix = mode === 'PERCENTAGE' ? '%' : ` ${currency}`

  // Llamar onChange cuando cambien valores válidos
  const handleChange = () => {
    if (isValid) {
      onChange(input)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-wine-600">💰</span>
          Pricing de la Selección
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 1. Costo Base */}
        <div className="space-y-2">
          <Label htmlFor="cost">Costo real de la caja (vinos + caja + envío)</Label>
          <div className="flex items-center gap-2">
            <span className="text-wine-600 font-medium">{currency === 'USD' ? '$' : currency}</span>
            <Input
              id="cost"
              type="number"
              min={PRICING_DEFAULTS.minCostCents / 100}
              max={PRICING_DEFAULTS.maxCostCents / 100}
              step={1}
              value={cost}
              onChange={(e) => {
                const val = Math.max(PRICING_DEFAULTS.minCostCents / 100, Math.min(PRICING_DEFAULTS.maxCostCents / 100, Number(e.target.value) || 0))
                setCost(val)
              }}
              className="w-32"
              disabled={disabled}
              required
            />
            <span className="text-dark-500 text-sm">{currency}</span>
          </div>
          <p className="text-xs text-dark-500">Incluye: costo de vinos + empaque + envío estimado</p>
        </div>

        {/* 2. Tipo de Markup */}
        <div className="space-y-2">
          <Label>Tipo de markup</Label>
          <div className="flex gap-3" role="radiogroup">
            <Button
              type="button"
              variant={mode === 'PERCENTAGE' ? 'wine' : 'outline'}
              onClick={() => {
                setMode('PERCENTAGE')
                setMarkupValue(PRICING_DEFAULTS.markupValue)
              }}
              disabled={disabled}
              role="radio"
              aria-checked={mode === 'PERCENTAGE'}
              className="flex-1"
            >
              <span className="font-medium">Porcentaje</span>
              <span className="text-xs text-dark-500 ml-2">(default 20%)</span>
            </Button>
            <Button
              type="button"
              variant={mode === 'FIXED' ? 'wine' : 'outline'}
              onClick={() => {
                setMode('FIXED')
                setMarkupValue(PRICING_DEFAULTS.minFixedMarkup)
              }}
              disabled={disabled}
              role="radio"
              aria-checked={mode === 'FIXED'}
              className="flex-1"
            >
              <span className="font-medium">Cantidad fija</span>
              <span className="text-xs text-dark-500 ml-2">($ fijo)</span>
            </Button>
          </div>
        </div>

        {/* 3. Valor del Markup */}
        <div className="space-y-2">
          <Label htmlFor="markupValue">
            {mode === 'PERCENTAGE' ? 'Markup % sobre costo' : 'Markup fijo'}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="markupValue"
              type="number"
              min={markupMin}
              max={markupMax}
              step={markupStep}
              value={markupValue}
              onChange={(e) => {
                const val = Math.max(markupMin, Math.min(markupMax, Number(e.target.value) || markupMin))
                setMarkupValue(val)
              }}
              className="w-32"
              disabled={disabled}
              required
            />
            <span className="text-dark-500 font-medium">{markupSuffix}</span>
          </div>
          <p className="text-xs text-dark-500">
            {mode === 'PERCENTAGE'
              ? `Rango: ${PRICING_DEFAULTS.minPercentageMarkup}% – ${PRICING_DEFAULTS.maxPercentageMarkup}%`
              : `Rango: $${PRICING_DEFAULTS.minFixedMarkup} – $${PRICING_DEFAULTS.maxFixedMarkup}`}
          </p>
        </div>

        {/* 4. Split Avanzado (colapsable) */}
        {showAdvanced && (
          <details className="border-t pt-4">
            <summary className="cursor-pointer text-sm text-dark-600 font-medium flex items-center gap-2">
              <span>⚙️</span>
              Split de comisión (avanzado)
            </summary>
            <div className="mt-4 space-y-4">
              <div>
                <Label className="flex items-center justify-between">
                  <span>Tu comisión (sommelier)</span>
                  <span className="font-medium text-wine-600">{100 - platformSplit}%</span>
                </Label>
                <Input
                  type="range"
                  min={PRICING_DEFAULTS.minSplitPct}
                  max={PRICING_DEFAULTS.maxSplitPct}
                  value={100 - platformSplit}
                  onChange={(e) => {
                    const val = Math.max(PRICING_DEFAULTS.minSplitPct, Math.min(PRICING_DEFAULTS.maxSplitPct, Number(e.target.value)))
                    setPlatformSplit(100 - val)
                  }}
                  className="w-full"
                  disabled={disabled}
                />
                <p className="text-xs text-dark-500 text-right mt-1">
                  Plataforma: {platformSplit}% | Mínimo {PRICING_DEFAULTS.minSplitPct}% cada uno
                </p>
              </div>
              <div className="p-3 bg-wine-50 rounded-lg text-sm text-wine-700">
                <strong>Regla:</strong> El markup se divide entre plataforma y sommelier.
                Por defecto 50/50. Puedes ajustar si tu selección tiene costos especiales.
              </div>
            </div>
          </details>
        )}

        {/* 5. Preview en Tiempo Real */}
        <div className={cn("p-4 rounded-lg border space-y-3", isValid ? "bg-green-50 border-green-200" : "bg-wine-50 border-wine-200")}>
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-wine-900">Preview del precio final</h4>
            {isValid ? (
              <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">✓ Válido</span>
            ) : (
              <span className="text-xs text-wine-700 bg-wine-100 px-2 py-1 rounded-full">Completa los campos</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-500">Costo base:</span>
              <span className="font-medium">{display.cost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-500">Markup ({mode === 'PERCENTAGE' ? `${markupValue}%` : `${display.markup}`}):</span>
              <span className="font-medium">{display.markup}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-500">Tu comisión ({100 - platformSplit}%):</span>
              <span className="font-medium text-green-600">{display.sommelier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-500">Plataforma ({platformSplit}%):</span>
              <span className="font-medium">{display.platform}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-wine-200 flex justify-between items-baseline">
            <span className="text-dark-600">Precio final al cliente:</span>
            <span className="font-bold text-2xl text-wine-900">{display.price}</span>
          </div>
        </div>

        {/* 6. Errores */}
        {errors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}

        {/* 7. Botón guardar */}
        <Button
          onClick={handleChange}
          disabled={disabled || !isValid}
          variant="wine"
          className="w-full"
          size="lg"
        >
          {disabled ? 'Guardado' : isValid ? 'Guardar pricing' : 'Completa los campos requeridos'}
        </Button>

        {/* Hidden: notificar cambio a padre cuando sea válido */}
        <input type="hidden" value={isValid ? JSON.stringify(input) : ''} onChange={handleChange} />
      </CardContent>
    </Card>
  )
}

// Componente simplificado para vista de solo lectura
export function PricingDisplay({ selection }: { selection: {
  costCents: number
  markupMode: MarkupMode
  markupValue: number
  platformSplitPct: number
  sommelierSplitPct: number
  priceCents: number
  currency: string
} }) {
  const result = calculatePricing({
    costCents: selection.costCents,
    markupMode: selection.markupMode,
    markupValue: selection.markupValue,
    platformSplitPct: selection.platformSplitPct,
    sommelierSplitPct: selection.sommelierSplitPct,
    currency: selection.currency,
  })
  const display = formatPricingForDisplay(result, {
    costCents: selection.costCents,
    markupMode: selection.markupMode,
    markupValue: selection.markupValue,
    platformSplitPct: selection.platformSplitPct,
    sommelierSplitPct: selection.sommelierSplitPct,
    currency: selection.currency,
  })

  return (
    <div className="p-4 bg-wine-50 rounded-lg border border-wine-200 space-y-2">
      <h4 className="font-medium text-wine-900">Pricing actual</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-dark-500">Costo:</span> <span className="font-medium">{display.cost}</span></div>
        <div><span className="text-dark-500">Markup:</span> <span className="font-medium">{display.markup}</span></div>
        <div><span className="text-dark-500">Tu comisión:</span> <span className="font-medium text-green-600">{display.sommelier}</span></div>
        <div><span className="text-dark-500">Plataforma:</span> <span className="font-medium">{display.platform}</span></div>
      </div>
      <div className="pt-2 border-t border-wine-200 flex justify-between items-baseline">
        <span className="text-dark-600">Precio cliente:</span>
        <span className="font-bold text-xl text-wine-900">{display.price}</span>
      </div>
    </div>
  )
}