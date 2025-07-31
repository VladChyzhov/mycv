import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CV - Vladislav Chizhov",
  description: "Professional resume of Vladislav Chizhov - Entrepreneur & Economist",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className={inter.variable}>
      <body className="font-inter antialiased" suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
