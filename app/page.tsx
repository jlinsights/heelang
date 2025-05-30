import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n'

export default function RootPage() {
  // 기본 언어(한국어)로 리디렉션
  redirect(`/${defaultLocale}`)
}
