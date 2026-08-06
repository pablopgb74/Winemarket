// src/app/onboarding/page.tsx
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card"
import { Wine, ArrowRight, Loader2 } from "lucide-react"

const ROLE_OPTIONS = [
  { value: "customer", label: "I'm a Wine Lover", description: "Discover curated selections from top sommeliers" },
  { value: "sommelier", label: "I'm a Sommelier", description: "Share your expertise and earn from your selections" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [role, setRole] = useState<"customer" | "sommelier">("customer")
  const [loading, setLoading] = useState(false)

  const handleContinue = () => {
    router.push(`/dashboard/${role}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-wine-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-wine-100 rounded-full flex items-center justify-center mb-4">
            <Wine className="w-8 h-8 text-wine-600" />
          </div>
          <CardTitle className="text-2xl">Welcome to Wine Marketplace!</CardTitle>
          <CardDescription>
            Let's set up your account. How would you like to get started?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {ROLE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={role === option.value ? "wine" : "outline"}
                className="w-full text-left gap-4 p-4"
                onClick={() => setRole(option.value)}
              >
                <div className="w-10 h-10 rounded-lg bg-wine-100 flex items-center justify-center flex-shrink-0">
                  <Wine className="w-5 h-5 text-wine-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-dark-500">{option.description}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-dark-400" />
              </Button>
            ))}
          </div>
          {email && (
            <div className="p-3 bg-wine-50 rounded-lg text-sm text-wine-700">
              Signed in as: <span className="font-medium">{email}</span>
            </div>
          )}
          <Button className="w-full" variant="wine" size="lg" onClick={handleContinue} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Continuing...
              </>
            ) : (
              "Continue to Dashboard"
            )}
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-dark-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </CardFooter>
      </Card>
    </div>
  )
}