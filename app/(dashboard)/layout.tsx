import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./_components/app-sidebar"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await auth()
  if (!user) redirect("/login")
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarTrigger />
      <main className="mx-auto py-8">{children}</main>
    </SidebarProvider>
  )
}
