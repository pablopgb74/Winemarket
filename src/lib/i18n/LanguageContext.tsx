// src/lib/i18n/LanguageContext.tsx
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Locale, translations, getTranslation } from "./translations"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  availableLocales: Locale[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get saved locale from localStorage or browser language
    const saved = localStorage.getItem("locale") as Locale | null
    if (saved && translations[saved]) {
      setLocale(saved)
    } else {
      const browserLang = navigator.language.split("-")[0] as Locale
      if (translations[browserLang]) {
        setLocale(browserLang)
      }
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  const t = (key: string) => {
    if (!mounted) return key
    return getTranslation(locale, key)
  }

  const availableLocales: Locale[] = ["en", "es", "fr", "it"]

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t, availableLocales }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}