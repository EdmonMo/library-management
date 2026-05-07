import { Noto_Sans_Arabic } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { DirectionProvider } from "@base-ui/react"
import { Toaster } from "sonner"
import AuthProvider from "@/components/auth-provider"

const fontSans = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-sans",
})

export const metadata = {
  title: "نظام إدارة المكتبة",
  description: "نظام متكامل لإدارة المكتبات",
}

export default async function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable)}
    >
      <body>
        <DirectionProvider direction="rtl">
          <AuthProvider>
            <div>{children}</div>

            {/* مكون عرض الإشعارات (Sonner Toaster) */}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </DirectionProvider>
      </body>
    </html>
  )
}
