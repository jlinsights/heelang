import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // 지원하는 모든 언어
  locales,
  // 기본 언어 (한국어)
  defaultLocale,
  // 기본 언어일 때 URL에 언어 코드를 표시하지 않음
  localePrefix: 'as-needed'
})

export const config = {
  // 모든 경로에 미들웨어 적용 (API, static files, Next.js internals 제외)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
} 