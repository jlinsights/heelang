'use client'

interface TranslatedContentProps {
  textKey: string
  namespace?: string
}

// 간단한 텍스트 매핑 - 추후 i18n 라이브러리 도입 시 확장 가능
const textMap: Record<string, string> = {
  'footer.copyright': '© 2025 사단법인 동양서예협회. All rights reserved.',
  'footer.sponsor': '후원: 삼성금융그룹, 서울예술의전당, 국립현대미술관',
  // 추후 필요한 텍스트 추가 가능
}

export function TranslatedContent({ textKey, namespace = 'common' }: TranslatedContentProps) {
  const key = namespace === 'common' ? textKey : `${namespace}.${textKey}`
  return <>{textMap[key] || textKey}</>
} 