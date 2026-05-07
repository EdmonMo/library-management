import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./_components/app-sidebar"
import { auth } from "@/lib/auth"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await auth()
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarTrigger />
      <main className="mx-auto py-8">{children}</main>
    </SidebarProvider>
  )
}
