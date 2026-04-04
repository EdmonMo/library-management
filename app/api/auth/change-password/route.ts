import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { hash, compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { changePasswordSchema } from "@/lib/validations"

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = changePasswordSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = validationResult.data

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    const isValid = await compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
