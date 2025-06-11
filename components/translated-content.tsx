'use client'

import { useTranslations } from 'next-intl'

interface TranslatedContentProps {
  textKey: string
  namespace?: string
}

export function TranslatedContent({ textKey, namespace = 'common' }: TranslatedContentProps) {
  const t = useTranslations(namespace)
  
  return <>{t(textKey)}</>
} 