"use client"
import { logoutAction } from "@/actions/auth"
import {
  Book,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  PenLine,
  ShoppingCart,
  Tags,
  UserCircle,
  Users,
  ArrowLeftRight,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "next-auth"

export default function AppSidebar({ user }: { user: User }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    const res = await logoutAction()

    if (res.success) {
      toast.success("تم تسجيل الخروج بنجاح")
      router.push("/login")
    } else toast.error("حدث خطأ ما")
  }
  let menuItems = []
  if (user?.role !== "STUDENT") {
    menuItems = [
      {
        icon: LayoutDashboard,
        label: "لوحة القيادة",
        href: "/",
      },
      { icon: Book, label: "الكتب", href: "/books" },
      { icon: PenLine, label: "المؤلفون", href: "/authors" },
      { icon: Tags, label: "التصنيفات", href: "/categories" },
      { icon: Users, label: "الموظفين", href: "/employees" },
      { icon: GraduationCap, label: "الطلاب", href: "/students" },
      { icon: ArrowLeftRight, label: "إدارة الاستعارات", href: "/rentals" },
    ]
  } else {
    menuItems = [
      {
        icon: LayoutDashboard,
        label: "لوحة القيادة",
        href: "/",
      },
      { icon: Book, label: "الكتب", href: "/books" },
      { icon: ShoppingCart, label: "استعاراتي", href: "/my-loans" },
    ]
  }

  return (
    <Sidebar
      side="right"
      className="border-l border-gray-200 bg-white shadow-xl"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-3 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg">
            <Library className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">نظام المكتبة</h1>
            <p className="text-xs text-gray-500">ادارة ذكية</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="border-t py-4">
        <SidebarMenu className="flex space-y-1 px-3">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                className={`h-10 cursor-pointer ${
                  (item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)) &&
                  "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                }`}
              >
                <Link
                  href={item.href}
                  className="flex w-full items-center gap-3 font-medium"
                >
                  <item.icon />
                  {item.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="space-y-2 border-t p-4">
          <Link href="/profile" className="block">
            <Button
              variant="ghost"
              className={`h-10 w-full justify-start gap-3 ${
                pathname === "/profile" &&
                "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
              }`}
            >
              <UserCircle className="h-4 w-4" />
              الحساب الشخصي
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="h-10 w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
