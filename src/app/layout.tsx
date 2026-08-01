// src/app/layout.tsx
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Wine Marketplace - Curated Selections from World-Class Sommeliers",
  description: "Discover hand-picked wine selections from certified sommeliers. Monthly boxes of 6 or 12 bottles, delivered to your door.",
  keywords: ["wine", "sommelier", "wine subscription", "wine club", "curated wine", "wine delivery"],
  authors: [{ name: "Wine Marketplace" }],
  creator: "Wine Marketplace",
  publisher: "Wine Marketplace",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://winemarketplace.com",
    title: "Wine Marketplace - Curated Selections from World-Class Sommeliers",
    description: "Discover hand-picked wine selections from certified sommeliers. Monthly boxes delivered to your door.",
    siteName: "Wine Marketplace",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wine Marketplace",
    description: "Curated wine selections from world-class sommeliers.",
  },
  verification: {
    google: "google-site-verification-code",
  },
}

export const viewport: Viewport = {
  themeColor: "#7a2323",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" class={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}