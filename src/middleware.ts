// src/middleware.ts
import { NextResponse } from "next/server"

// Middleware simplificado sin auth para waitlist MVP
export default function middleware(req: Request) {
  const url = new URL(req.url)
  
  // Skip waitlist API entirely
  if (url.pathname.startsWith("/api/waitlist")) {
    return NextResponse.next()
  }

  // Skip all other API routes for now
  if (url.pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Allow all other routes (auth, dashboard, etc.) - auth handled client-side
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/:path*",
  ],
}