import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n'

// 루트 경로에서 기본 언어로 리디렉션
export default function RootPage() {
  redirect(`/${defaultLocale}`)
} 