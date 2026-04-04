import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  if (token.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/users/:path*",
}
