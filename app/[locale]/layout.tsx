import type React from "react"
import { NextIntlClientProvider, useMessages } from "next-intl"
import { Mona_Sans as FontSans } from "next/font/google"
// import { Playfair_Display } from 'next/font/google' // 예시 세리프 폰트
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
// app/globals.css는 app/layout.tsx에서 이미 import 되었으므로 여기서는 필요 없습니다.

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// const fontSerif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

// metadata는 여기서도 정의할 수 있지만, getTranslations를 사용해야 할 수 있습니다.
// export const metadata = { ... }

export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  const messages = useMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-neutral-50 font-sans antialiased",
          fontSans.variable,
          // fontSerif.variable
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
