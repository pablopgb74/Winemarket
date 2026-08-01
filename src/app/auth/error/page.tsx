// src/app/auth/error/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "There's a problem with the server configuration. Please contact support.",
    AccessDenied: "Access was denied. You may not have permission to sign in.",
    Verification: "The verification link has expired or has already been used.",
    OAuthSignin: "Error starting the OAuth sign in process.",
    OAuthCallback: "Error handling the OAuth callback.",
    OAuthCreateAccount: "Could not create OAuth account.",
    EmailCreateAccount: "Could not create email account.",
    Callback: "Error in the OAuth callback handler.",
    OAuthAccountNotLinked: "This email is already associated with another account.",
    EmailSignin: "Error sending the sign in email.",
    CredentialsSignin: "Sign in failed. Check your credentials.",
    SessionRequired: "Please sign in to access this page.",
    Default: "An unexpected error occurred. Please try again.",
  }

  const message = errorMessages[error || "Default"] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-wine-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Something Went Wrong</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <Button variant="wine" asChild>
            <Link href="/auth/signin">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}