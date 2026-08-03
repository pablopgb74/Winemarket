// src/components/ui/LanguageSelector.tsx
"use client"

import { useLanguage } from "../../lib/i18n/LanguageContext"
import { Globe } from "lucide-react"
import { Button } from "../../components/ui/button"
import { cn } from "../../lib/utils"

export function LanguageSelector() {
  const { locale, setLocale, t, availableLocales } = useLanguage()

  const localeLabels: Record<string, string> = {
    en: "English",
    es: "Español",
    fr: "Français",
    it: "Italiano",
  }

  const localeFlags: Record<string, string> = {
    en: "🇺🇸",
    es: "🇪🇸",
    fr: "🇫🇷",
    it: "🇮🇹",
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 px-3 py-1.5"
        onClick={() => {
          // Toggle dropdown - handled by CSS
        }}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{localeFlags[locale]}</span>
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>
      
      {/* Dropdown - CSS only */}
      <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-dark-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {availableLocales.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={cn(
              "w-full px-4 py-2 text-left text-sm transition-colors",
              locale === l ? "bg-wine-50 text-wine-700" : "text-dark-600 hover:bg-dark-50"
            )}
          >
            <span className="flex items-center gap-2">
              <span>{localeFlags[l]}</span>
              <span>{localeLabels[l]}</span>
              {locale === l && <span className="ml-auto text-wine-600">✓</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}