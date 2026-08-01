// src/middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAuth = req.nextUrl.pathname.startsWith("/auth")
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isOnAdmin = req.nextUrl.pathname.startsWith("/dashboard/admin")
  const isOnSommelier = req.nextUrl.pathname.startsWith("/dashboard/sommelier")
  const isOnCustomer = req.nextUrl.pathname.startsWith("/dashboard/customer")
  const role = req.auth?.user?.role

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isOnAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  // Protect dashboard routes
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl))
  }

  // Role-based protection
  if (isOnAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }
  if (isOnSommelier && role !== "SOMMELIER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }
  if (isOnCustomer && role !== "CUSTOMER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/api/:path*",
  ],
}