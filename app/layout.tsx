import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/contexts/user-context"
import { ToastProvider } from "@/hooks/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MediTrack - Medicine Management System",
  description: "Track, manage, and get recommendations for your medicines",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            <ToastProvider>
              <Navbar />
              {children}
              <main id="main-content"></main>
            </ToastProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'