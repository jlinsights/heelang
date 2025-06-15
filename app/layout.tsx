import { ClientLayout } from "@/components/client-layout"
import type { Metadata } from "next"
import { Inter, Noto_Serif_KR } from "next/font/google"
import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
// import { ErrorBoundary } from "@/components/error-boundary"
// import { SkipToContent } from "@/components/simple-skip-link"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

const notoSerifKR = Noto_Serif_KR({ 
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  preload: true,
  fallback: ['serif', 'Times New Roman']
})

export const metadata: Metadata = {
  title: "희랑 공경순 개인전 | 길 (Way)",
  description: "희랑 공경순 작가의 '길' 전시 - 인생의 여정을 담은 현대 서예 작품을 온라인으로 감상하세요",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* PWA 매니페스트 */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* PWA 메타 태그 */}
        <meta name="application-name" content="묵향 서예전" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="묵향 서예전" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1a1a1a" />
        <meta name="theme-color" content="#1a1a1a" />
        
        {/* Apple Touch 아이콘 */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        
        {/* 파비콘 */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* 폰트 프리로딩 */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+KR:wght@400;500;600;700&display=swap"
        />
        {/* 폰트 폴백 CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Inter-fallback';
              src: local('system-ui'), local('arial');
              ascent-override: 90.2%;
              descent-override: 22.5%;
              line-gap-override: 0%;
            }
            @font-face {
              font-family: 'NotoSerifKR-fallback';
              src: local('serif'), local('Times New Roman');
              ascent-override: 116%;
              descent-override: 29%;
              line-gap-override: 0%;
            }
          `
        }} />
      </head>
      <body 
        className={`${inter.variable} ${notoSerifKR.variable}`}
        suppressHydrationWarning
      >
        <ClientLayout>
          <main id="main-content">
            {children}
          </main>
          {/* Footer */}
          <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm">© 2025 The Asian Society of Calligraphic Arts (ASCA)</p>
            </div>
          </footer>
        </ClientLayout>
      </body>
    </html>
  )
}
