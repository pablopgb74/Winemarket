// src/app/dashboard/sommelier/selections/new/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { PricingForm, type PricingInput } from "../../../../../components/forms/PricingForm"
import { Wine, Calendar, Box, ArrowLeft, Loader2 } from "lucide-react"
import { LucideIcon } from "lucide-react"

const MONTHS = [
  { value: 1, label: "January" }, { value: 2, label: "February" },
  { value: 3, label: "March" }, { value: 4, label: "April" },
  { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" },
  { value: 9, label: "September" }, { value: 10, label: "October" },
  { value: 11, label: "November" }, { value: 12, label: "December" },
]

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i)

const BOX_SIZES = [
  { value: "SIX", label: "6 botellas", description: "Caja estándar" },
  { value: "TWELVE", label: "12 botellas", description: "Caja grande" },
]

export default function NewSelectionPage() {
  const router = useRouter()
  const [step, setStep] = useState<"basic" | "pricing" | "wines" | "review">("basic")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form state
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    description: "",
    story: "",
    theme: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    boxSize: "SIX" as "SIX" | "TWELVE",
    allowsSubscription: true,
    maxSubscribers: "",
    shipsAt: "",
  })

  const [pricing, setPricing] = useState<PricingInput | null>(null)
  const [wines, setWines] = useState<Array<{
    wineId: string
    position: number
    tastingNotes: string
    pairingSuggestion: string
    servingTemp: string
    decantTime: string
  }>>([])

  const validateStep = (s: typeof step) => {
    const newErrors: Record<string, string> = {}
    if (s === "basic") {
      if (!basicInfo.title.trim()) newErrors.title = "Title is required"
      if (basicInfo.title.length < 5) newErrors.title = "Title must be at least 5 characters"
      if (!basicInfo.description.trim()) newErrors.description = "Description is required"
      if (basicInfo.description.length < 50) newErrors.description = "Description must be at least 50 characters"
    }
    if (s === "pricing") {
      if (!pricing) newErrors.pricing = "Pricing is required"
    }
    if (s === "wines") {
      if (wines.length === 0) newErrors.wines = "Add at least one wine"
      if (wines.length !== (basicInfo.boxSize === "SIX" ? 6 : 12)) {
        newErrors.wines = `Must have exactly ${basicInfo.boxSize === "SIX" ? 6 : 12} wines`
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateStep("review")) return

    setLoading(true)
    try {
      const response = await fetch("/api/selections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basicInfo,
          maxSubscribers: basicInfo.maxSubscribers ? Number(basicInfo.maxSubscribers) : undefined,
          shipsAt: basicInfo.shipsAt || undefined,
          pricing,
          wines,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to create selection")
      }

      } catch (error) {
        setErrors({ submit: error instanceof Error ? error.message : "Something went wrong" })
      } finally {
        setLoading(false)
      }
      }

      const steps: { id: "basic" | "pricing" | "wines" | "review"; label: string; icon: LucideIcon }[] = [
      { id: "basic", label: "Basic Info", icon: Wine },
      { id: "pricing", label: "Pricing", icon: Box },
      { id: "wines", label: "Wines", icon: Wine },
      { id: "review", label: "Review", icon: Calendar },
      ]

      return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-wine-950">Create New Selection</h1>
          <p className="text-dark-600">Curate your monthly wine box for subscribers</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="hidden md:flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
              step === s.id ? "bg-wine-600 text-white" :
              steps.findIndex(x => x.id === step) > i ? "bg-green-500 text-white" :
              "bg-dark-100 text-dark-400"
            )}>
              <s.icon className="w-5 h-5" />
            </div>
            {i < steps.length - 1 && <div className="w-16 h-1 bg-dark-200 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {step === "basic" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Selection Title *</Label>
                <Input
                  id="title"
                  value={basicInfo.title}
                  onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
                  placeholder="e.g., October 2024: Hidden Gems from Jura"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                  placeholder="Describe the theme, what makes this selection special, the story behind your choices..."
                  className="w-full p-3 border rounded-lg min-h-[120px] resize-y"
                  rows={5}
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                <p className="text-xs text-dark-500 mt-1">Minimum 50 characters. This is shown to customers.</p>
              </div>

              <div>
                <Label htmlFor="story">Personal Story (optional)</Label>
                <textarea
                  id="story"
                  value={basicInfo.story}
                  onChange={(e) => setBasicInfo({ ...basicInfo, story: e.target.value })}
                  placeholder="Your personal connection to these wines, why you chose them, a memory..."
                  className="w-full p-3 border rounded-lg min-h-[80px] resize-y"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="theme">Theme (optional)</Label>
                  <Input
                    id="theme"
                    value={basicInfo.theme}
                    onChange={(e) => setBasicInfo({ ...basicInfo, theme: e.target.value })}
                    placeholder="e.g., Natural wines, White Burgundy under $50"
                  />
                </div>
                <div>
                  <Label htmlFor="month">Month *</Label>
                  <select
                    id="month"
                    value={basicInfo.month}
                    onChange={(e) => setBasicInfo({ ...basicInfo, month: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  >
                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <select
                    id="year"
                    value={basicInfo.year}
                    onChange={(e) => setBasicInfo({ ...basicInfo, year: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Box Size *</Label>
                  <div className="grid gap-2">
                    {BOX_SIZES.map(b => (
                      <label key={b.value} className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-colors",
                        basicInfo.boxSize === b.value ? "border-wine-500 bg-wine-50" : "border-dark-200 hover:border-wine-300"
                      )}>
                        <input
                          type="radio"
                          name="boxSize"
                          value={b.value}
                          checked={basicInfo.boxSize === b.value}
                          onChange={(e) => setBasicInfo({ ...basicInfo, boxSize: e.target.value as "SIX" | "TWELVE" })}
                          className="sr-only"
                        />
                        <div className="font-medium">{b.label}</div>
                        <div className="text-sm text-dark-500">{b.description}</div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="maxSubscribers">Max Subscribers (optional)</Label>
                  <Input
                    id="maxSubscribers"
                    type="number"
                    min="1"
                    value={basicInfo.maxSubscribers}
                    onChange={(e) => setBasicInfo({ ...basicInfo, maxSubscribers: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="shipsAt">Ships On (optional)</Label>
                  <Input
                    id="shipsAt"
                    type="date"
                    value={basicInfo.shipsAt}
                    onChange={(e) => setBasicInfo({ ...basicInfo, shipsAt: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowsSubscription"
                  checked={basicInfo.allowsSubscription}
                  onChange={(e) => setBasicInfo({ ...basicInfo, allowsSubscription: e.target.checked })}
                  className="rounded border-dark-300 text-wine-600"
                />
                <Label htmlFor="allowsSubscription">Allow monthly subscriptions</Label>
              </div>
            </div>
          )}

          {step === "pricing" && (
            <div className="space-y-6">
              <PricingForm
                onChange={setPricing}
                initial={{
                  costCents: 10000,
                  markupMode: "PERCENTAGE",
                  markupValue: 20,
                  platformSplitPct: 50,
                  sommelierSplitPct: 50,
                }}
              />
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How pricing works</h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li><strong>Costo real:</strong> Lo que te cuesta comprar los vinos + caja + envío</li>
                  <li><strong>Markup:</strong> Tu margen sobre el costo (default 20% o $ fijo)</li>
                  <li><strong>Split 50/50:</strong> El markup se divide: 50% tú, 50% plataforma</li>
                  <li><strong>Precio final:</strong> Costo + Markup = Lo que paga el cliente</li>
                  <li><strong>Ejemplo:</strong> Costo $100 + 20% ($20) = $120 cliente → Tú ganas $10, plataforma $10</li>
                </ul>
              </div>
            </div>
          )}

          {step === "wines" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Wines in this selection</h3>
                <span className="text-sm text-dark-500">
                  {wines.length} / {basicInfo.boxSize === "SIX" ? 6 : 12} wines
                </span>
              </div>

              {wines.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-dark-200 rounded-lg">
                  <Wine className="w-12 h-12 text-dark-300 mx-auto mb-4" />
                  <p className="text-dark-500">Add wines to your selection</p>
                  <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/sommelier/wines/new")}>
                    Create new wine first
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {wines.map((wine, i) => (
                    <div key={wine.wineId} className="flex items-center gap-4 p-3 border rounded-lg">
                      <span className="w-8 text-center font-medium">{wine.position}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">Wine #{wine.position}</p>
                        <p className="text-sm text-dark-500">{wine.tastingNotes?.slice(0, 100)}...</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setWines(wines.filter((_, idx) => idx !== i))}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {wines.length < (basicInfo.boxSize === "SIX" ? 6 : 12) && (
                <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/sommelier/wines/new")}>
                  Add Wine (+{ (basicInfo.boxSize === "SIX" ? 6 : 12) - wines.length } more needed)
                </Button>
              )}

              {errors.wines && <p className="text-sm text-red-600">{errors.wines}</p>}
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Title:</strong> {basicInfo.title}</p>
                    <p><strong>Month/Year:</strong> {MONTHS.find(m => m.value === basicInfo.month)?.label} {basicInfo.year}</p>
                    <p><strong>Box Size:</strong> {basicInfo.boxSize === "SIX" ? "6" : "12"} bottles</p>
                    <p><strong>Subscriptions:</strong> {basicInfo.allowsSubscription ? "Enabled" : "Disabled"}</p>
                    {basicInfo.maxSubscribers && <p><strong>Max Subscribers:</strong> {basicInfo.maxSubscribers}</p>}
                    {basicInfo.shipsAt && <p><strong>Ships:</strong> {basicInfo.shipsAt}</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {pricing && (
                      <>
                        <p><strong>Cost:</strong> ${(pricing.costCents / 100).toFixed(2)}</p>
                        <p><strong>Markup:</strong> {pricing.markupMode === "PERCENTAGE" ? `${pricing.markupValue}%` : `$${pricing.markupValue}`}</p>
                        <p><strong>Your split:</strong> {100 - (pricing.platformSplitPct ?? 50)}%</p>
                        <p><strong>Platform split:</strong> {pricing.platformSplitPct ?? 50}%</p>
                        <div className="pt-2 border-t">
                          <p className="text-lg font-bold text-wine-950">
                            Price: ${(pricing.costCents / 100 + (pricing.markupMode === "PERCENTAGE" ? pricing.costCents * pricing.markupValue / 10000 : pricing.markupValue)).toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Wines ({wines.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {wines.map((w, i) => (
                        <li key={w.wineId} className="text-sm">{i + 1}. Wine #{w.position}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {errors.submit && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="text-red-700">{errors.submit}</CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="ghost"
              onClick={() => setStep(steps[Math.max(0, steps.findIndex(s => s.id === step) - 1)].id)}
              disabled={step === "basic"}
            >
              Back
            </Button>
            <div className="flex gap-3">
              {step !== "review" && (
                <Button
                  onClick={() => {
                    if (validateStep(step)) {
                      setStep(steps[steps.findIndex(s => s.id === step) + 1].id)
                    }
                  }}
                  disabled={loading}
                >
                  Next
                </Button>
              )}
              {step === "review" && (
                <Button
                  variant="wine"
                  onClick={handleSubmit}
                  disabled={loading}
                  size="lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Create Selection"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}