import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const { user } = await auth()

  if (!user) redirect("/login")
  redirect("/dashboard")
}
