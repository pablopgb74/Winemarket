// src/app/waitlist/page.tsx
"use client"

import { useState } from "react"
import { LanguageProvider, useLanguage } from "../../lib/i18n/LanguageContext"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Wine, User, Mail, CheckCircle, Loader2, Sparkles, Award, Globe, ChevronDown } from "lucide-react"

type FormType = "customer" | "sommelier"

function WaitlistContent() {
  const { t, locale, setLocale } = useLanguage()
  const [activeForm, setActiveForm] = useState<FormType>("customer")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<FormType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    instagram: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: activeForm }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t("form.error"))

      setSuccess(activeForm)
      setFormData({ email: "", name: "", instagram: "", message: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : t("form.error_unknown"))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const localeFlags: Record<string, string> = {
    en: "🇺🇸",
    es: "🇪🇸",
    fr: "🇫🇷",
    it: "🇮🇹",
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wine-50 py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-wine-950 mb-2">
              {success === "customer" ? t("success.customer.title") : t("success.sommelier.title")}
            </h2>
            <p className="text-dark-600 mb-6">
              {success === "customer"
                ? t("success.customer.description")
                : t("success.sommelier.description")}
            </p>
            <Button variant="outline" onClick={() => setSuccess(null)} className="w-full">
              {t("success.another")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wine-50 via-white to-wine-50 py-12 px-4">
      {/* Language Selector - Top Right */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-end">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-dark-200 rounded-lg text-sm font-medium text-dark-700 hover:bg-dark-50 transition-colors"
            aria-expanded={langOpen}
            aria-haspopup="listbox"
          >
            <Globe className="w-4 h-4" />
            <span>{localeFlags[locale]}</span>
            <span className="hidden sm:inline">{locale.toUpperCase()}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {langOpen && (
            <ul className="absolute right-0 top-full mt-1 w-36 bg-white border border-dark-200 rounded-lg shadow-lg z-50" role="listbox">
              {["en", "es", "fr", "it"].map((l) => (
                <li key={l} role="option" aria-selected={locale === l}>
                  <button
                    onClick={() => { setLocale(l); setLangOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${locale === l ? "bg-wine-50 text-wine-700" : "text-dark-600 hover:bg-dark-50"}`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{["🇺🇸", "🇪🇸", "🇫🇷", "🇮🇹"][["en", "es", "fr", "it"].indexOf(l)]}</span>
                      <span>{["English", "Español", "Français", "Italiano"][["en", "es", "fr", "it"].indexOf(l)]}</span>
                      {locale === l && <span className="ml-auto text-wine-600">✓</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div onClick={() => setLangOpen(false)} className="fixed inset-0 z-0" aria-hidden="true" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wine-100 text-wine-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>{t("hero.badge")}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-wine-950 leading-tight mb-6">
            Wine Marketplace
            <br />
            <span className="text-wine-600">{t("hero.subtitle")}</span>
          </h1>
          <p className="text-xl md:text-2xl text-dark-600 mb-10 max-w-2xl mx-auto">
            {t("hero.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-dark-500">
            <span className="flex items-center gap-2"><Wine className="w-4 h-4" /> {t("hero.features.expert")}</span>
            <span className="flex items-center gap-2"><User className="w-4 h-4" /> {t("hero.features.sommeliers")}</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {t("hero.features.delivery")}</span>
          </div>
        </div>

        {/* Two Columns - Customer / Sommelier */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Customer Card */}
          <Card className={`relative overflow-hidden transition-all ${activeForm === "customer" ? "ring-2 ring-wine-500 shadow-xl" : ""}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-wine-600" />
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-wine-100 rounded-full flex items-center justify-center mb-4">
                <Wine className="w-8 h-8 text-wine-600" />
              </div>
              <CardTitle className="text-2xl">{t("card.customer.title")}</CardTitle>
              <CardDescription>{t("card.customer.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant={activeForm === "customer" ? "wine" : "outline"}
                className="w-full mb-4"
                onClick={() => { setActiveForm("customer"); setSuccess(null); setError(null); }}
              >
                {activeForm === "customer" ? t("card.customer.active") : t("card.customer.inactive")}
              </Button>
              <ul className="space-y-2 text-sm text-dark-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t("card.customer.feature1")}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t("card.customer.feature2")}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t("card.customer.feature3")}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t("card.customer.feature4")}</li>
              </ul>
            </CardContent>
          </Card>

          {/* Sommelier Card */}
          <Card className={`relative overflow-hidden transition-all ${activeForm === "sommelier" ? "ring-2 ring-wine-500 shadow-xl" : ""}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-wine-600" />
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">{t("card.sommelier.title")}</CardTitle>
              <CardDescription>{t("card.sommelier.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant={activeForm === "sommelier" ? "wine" : "outline"}
                className="w-full mb-4"
                onClick={() => { setActiveForm("sommelier"); setSuccess(null); setError(null); }}
              >
                {activeForm === "sommelier" ? t("card.sommelier.active") : t("card.sommelier.inactive")}
              </Button>
              <ul className="space-y-2 text-sm text-dark-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t("card.sommelier.feature1")}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t("card.sommelier.feature2")}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t("card.sommelier.feature3")}</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t("card.sommelier.feature4")}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <div className="max-w-md mx-auto mt-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {activeForm === "customer" ? t("form.customer.title") : t("form.sommelier.title")}
              </CardTitle>
              <CardDescription>
                {activeForm === "customer"
                  ? t("form.customer.description")
                  : t("form.sommelier.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t("form.email.label")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("form.email.placeholder")}
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {activeForm === "sommelier" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("form.name.label")}</Label>
                      <Input
                        id="name"
                        placeholder={t("form.name.placeholder")}
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">{t("form.instagram.label")}</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">@</span>
                        <Input
                          id="instagram"
                          placeholder={t("form.instagram.placeholder")}
                          value={formData.instagram}
                          onChange={(e) => handleChange("instagram", e.target.value)}
                          disabled={loading}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">
                    {activeForm === "customer" ? t("form.message.customer") : t("form.message.sommelier")}
                  </Label>
                  <textarea
                    id="message"
                    placeholder={activeForm === "customer" ? t("form.message.customer.placeholder") : t("form.message.sommelier.placeholder")}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={3}
                    className="w-full p-3 border rounded-lg resize-y"
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" variant="wine" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("form.submitting")}
                    </>
                  ) : activeForm === "customer" ? (
                    t("form.submit.customer")
                  ) : (
                    t("form.submit.sommelier")
                  )}
                </Button>

                <p className="text-xs text-dark-400 text-center">
                  {t("form.privacy")}
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function WaitlistPage() {
  return (
    <LanguageProvider>
      <WaitlistContent />
    </LanguageProvider>
  )
}