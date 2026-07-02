import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isAuthPage =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/signup"

  if (isAuthPage) {
    if (isLoggedIn) return NextResponse.redirect(new URL("/", nextUrl))
    return NextResponse.next()
  }

  if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl))

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
