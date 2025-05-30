import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // 지원하는 모든 언어
  locales,
  // 기본 언어 (한국어)
  defaultLocale,
  // 항상 locale prefix를 사용 (더 명확한 라우팅을 위해)
  localePrefix: 'always'
})

export const config = {
  // 모든 경로에 미들웨어 적용 (API, static files, Next.js internals 제외)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
} 