import { ClientLayout } from '@/components/client-layout'
import type { Metadata } from 'next'
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google'
import './globals.css'
// import { ThemeProvider } from "@/components/theme-provider"
// import { ErrorBoundary } from "@/components/error-boundary"
// import { SkipToContent } from "@/components/simple-skip-link"

// 본문은 한글이 주이므로 한글 글리프를 가진 Noto Sans KR로 고정한다.
// (Inter는 라틴 전용이라 한글이 OS 기본 서체로 떨어졌다.) 제목의 Noto Serif KR과 같은 계열.
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
  preload: true,
  fallback: ['Apple SD Gothic Neo', 'Malgun Gothic', 'system-ui', 'sans-serif'],
})

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  variable: '--font-noto-serif-kr',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['serif', 'Times New Roman'],
})

export const metadata: Metadata = {
  title: '희랑 공경순 개인전 | 길 道',
  description:
    "희랑 공경순 작가의 현대 서예 개인전 '길 道' - 인생의 여정을 담은 깊이 있는 서예 작품을 온라인으로 감상하세요. 2025. 6. 18 — 6. 24 인사동 한국미술관 2층 전시",
  keywords: [
    '희랑',
    '공경순',
    '서예',
    '현대서예',
    '길',
    '道',
    '개인전',
    '전시',
    '한국서예',
    '캘리그래피',
  ],
  authors: [{ name: '희랑 공경순' }],
  creator: '희랑 공경순',
  publisher: 'The Asian Society of Calligraphic Arts (ASCA)',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://heelang.orientalcalligraphy.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '희랑 공경순 개인전 | 길 道',
    description:
      "희랑 공경순 작가의 현대 서예 개인전 '길 道' - 인생의 여정을 담은 깊이 있는 서예 작품을 온라인으로 감상하세요",
    url: 'https://heelang.orientalcalligraphy.org',
    siteName: '희랑 공경순 개인전',
    images: [
      {
        url: '/Images/Artworks/2025/heelang-way-2025-large.jpg',
        width: 1200,
        height: 630,
        alt: '희랑 공경순 작품 - 길 (Way) 2025',
        type: 'image/jpeg',
      },
      {
        url: '/Images/Artworks/2025/heelang-way-2025-medium.jpg',
        width: 800,
        height: 600,
        alt: '희랑 공경순 작품 - 길 (Way) 2025',
        type: 'image/jpeg',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '희랑 공경순 개인전 | 길 道',
    description:
      "희랑 공경순 작가의 현대 서예 개인전 '길 道' - 인생의 여정을 담은 깊이 있는 서예 작품",
    images: ['/Images/Artworks/2025/heelang-way-2025-large.jpg'],
    creator: '@heelang_calligraphy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // 실제 구글 서치 콘솔 코드로 교체 필요
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <head>
        {/* PWA 매니페스트 */}
        <link rel='manifest' href='/manifest.json' />

        {/* PWA 메타 태그 */}
        <meta name='application-name' content='묵향 서예전' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='묵향 서예전' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='msapplication-config' content='/browserconfig.xml' />
        <meta name='msapplication-TileColor' content='#292524' />
        <meta name='theme-color' content='#fdfcfa' />

        {/* Apple Touch 아이콘 */}
        <link rel='apple-touch-icon' href='/icons/icon-192x192.png' />
        <link
          rel='apple-touch-icon'
          sizes='152x152'
          href='/icons/icon-152x152.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icons/icon-192x192.png'
        />

        {/* 파비콘 */}
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/icons/icon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/icons/icon-16x16.png'
        />
        <link rel='shortcut icon' href='/favicon.ico' />

        {/* 폰트 프리로딩 최적화 */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />

        {/* 구조화 데이터 */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              {
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': 'ExhibitionEvent',
                    name: '희랑 공경순 개인전 - 길 道',
                    description:
                      '희랑 공경순 작가의 현대 서예 개인전으로, 인생의 여정을 담은 깊이 있는 서예 작품들을 선보입니다.',
                    startDate: '2025-06-18',
                    endDate: '2025-06-24',
                    eventStatus: 'https://schema.org/EventScheduled',
                    eventAttendanceMode:
                      'https://schema.org/OfflineEventAttendanceMode',
                    location: {
                      '@type': 'Place',
                      name: '한국미술관 2층',
                      address: '서울 종로구 인사동',
                    },
                    organizer: {
                      '@type': 'Organization',
                      name: 'The Asian Society of Calligraphic Arts (ASCA)',
                      url: 'https://heelang.orientalcalligraphy.org',
                    },
                    performer: {
                      '@type': 'Person',
                      name: '희랑 공경순',
                      jobTitle: '서예가',
                      description: '현대 서예의 새로운 지평을 여는 작가',
                    },
                    image:
                      'https://heelang.orientalcalligraphy.org/Images/Artworks/2025/heelang-way-2025-large.jpg',
                    url: 'https://heelang.orientalcalligraphy.org',
                  },
                  {
                    '@type': 'WebSite',
                    name: '희랑 공경순 개인전',
                    description:
                      "희랑 공경순 작가의 현대 서예 개인전 '길 道' 온라인 전시관",
                    url: 'https://heelang.orientalcalligraphy.org',
                    inLanguage: 'ko-KR',
                    publisher: {
                      '@type': 'Organization',
                      name: 'The Asian Society of Calligraphic Arts (ASCA)',
                    },
                  },
                  {
                    '@type': 'VisualArtwork',
                    name: '길 (Way)',
                    description:
                      '2025년 작품으로, 인생의 여정과 도(道)의 의미를 현대적 서예로 표현한 작품',
                    creator: {
                      '@type': 'Person',
                      name: '희랑 공경순',
                    },
                    dateCreated: '2025',
                    artMedium: '서예, 먹, 종이',
                    artworkSurface: '종이',
                    image:
                      'https://heelang.orientalcalligraphy.org/Images/Artworks/2025/heelang-way-2025-large.jpg',
                    url: 'https://heelang.orientalcalligraphy.org/gallery/way-2025',
                  },
                ],
              },
              null,
              2
            ),
          }}
        />
      </head>
      <body
        className={`${notoSansKR.variable} ${notoSerifKR.variable}`}
        suppressHydrationWarning
      >
        <ClientLayout>
          <a
            href='#content'
            className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-foreground focus:px-5 focus:py-3 focus:text-sm focus:text-background'
          >
            본문으로 건너뛰기
          </a>
          <main id='main-content'>{children}</main>
          {/* Footer */}
          <footer className='bg-ink text-paper py-8'>
            <div className='container-art text-center'>
              <p className='text-responsive-sm text-paper/75'>
                © 2025 The Asian Society of Calligraphic Arts (ASCA)
              </p>
            </div>
          </footer>
        </ClientLayout>
      </body>
    </html>
  )
}
