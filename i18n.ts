import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// 지원하는 언어 목록 (한국어가 기본)
export const locales = ['ko', 'en', 'ja', 'zh'] as const
export const defaultLocale = 'ko' as const

export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // 지원하지 않는 언어인 경우 404 처리
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  }
}) 