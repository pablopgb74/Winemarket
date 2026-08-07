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
  return (<div>Test</div>);
}


export default function WaitlistPage() {
  return (
    <LanguageProvider>
      <WaitlistContent />
    </LanguageProvider>
  )
}
