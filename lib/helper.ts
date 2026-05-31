"use server"
import { auth } from "./auth"

export async function checkAdmin(): Promise<boolean> {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return false
  }
  return true
}

export async function checkEmployee(): Promise<boolean> {
  const session = await auth()
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")
  ) {
    return false
  }
  return true
}

export async function getSessionUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

export async function getSessionUserRole(): Promise<string | null> {
  const session = await auth()
  return session?.user?.role ?? null
}
