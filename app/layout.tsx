import { Noto_Sans_Arabic } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from "@/components/auth-provider"
import QueryProvider from "@/components/query-provider"
import { cn } from "@/lib/utils"
import { DirectionProvider } from "@base-ui/react"

const fontSans = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-sans",
})

export const metadata = {
  title: "نظام إدارة المكتبة",
  description: "نظام متكامل لإدارة المكتبات",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable)}
    >
      <body>
        <DirectionProvider direction="rtl">
          <ThemeProvider>
            <QueryProvider>
              <AuthProvider>
                <div>{children}</div>
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  )
}
