// src/app/auth/verify-request/page.tsx
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Mail, CheckCircle } from "lucide-react"

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-wine-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a magic link to your email address. Click the link to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="p-4 bg-wine-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-wine-700 mb-2">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Magic link sent!</span>
            </div>
            <p className="text-sm text-wine-600">
              The link expires in 24 hours. If you don't see it, check your spam folder.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/auth/signin">Resend Magic Link</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}