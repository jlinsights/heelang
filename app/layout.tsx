import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Keep global styles

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | 묵향 서예전",
    default: "묵향 서예전 | Calligraphy Catalog",
  },
  description: "현대 서예가의 작품을 온라인으로 감상할 수 있는 다국어 지원 전시 카탈로그",
  generator: "Next.js",
  applicationName: "Calligraphy Catalog",
  keywords: ["서예", "calligraphy", "art", "exhibition", "Korean art"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // The lang attribute will be set in app/[locale]/layout.tsx
    <html className={inter.className} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
