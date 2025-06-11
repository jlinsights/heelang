"use client"

import { useState, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AccessibleModal } from '@/components/accessibility'
import { cn } from '@/lib/utils'

export type Locale = 'ko' | 'en' | 'ja' | 'zh'

interface Language {
  code: Locale
  name: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
]

interface LanguageSwitcherProps {
  currentLocale: Locale
  onLocaleChange: (locale: Locale) => void
  className?: string
}

export function LanguageSwitcher({ 
  currentLocale, 
  onLocaleChange, 
  className 
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  const handleLanguageChange = (locale: Locale) => {
    onLocaleChange(locale)
    setIsOpen(false)
    
    // 언어 변경을 localStorage에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale)
      
      // 페이지 리로드로 언어 변경 적용
      window.location.reload()
    }
  }

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
        aria-label={`언어 변경 (현재: ${currentLanguage.nativeName})`}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
      </Button>

      <AccessibleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="언어 선택 / Select Language / 言語選択"
        description="원하는 언어를 선택하세요"
        className="max-w-sm"
      >
        <div className="space-y-2">
          {languages.map((language) => {
            const isSelected = language.code === currentLocale
            
            return (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
                  isSelected 
                    ? "bg-ink text-white border-ink" 
                    : "bg-background border-border hover:border-ink hover:bg-stone-50 dark:hover:bg-slate-800"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className={cn(
                      "text-sm",
                      isSelected ? "text-white/80" : "text-ink-light"
                    )}>
                      {language.name}
                    </div>
                  </div>
                </div>
                
                {isSelected && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            )
          })}
        </div>

                 <div className="mt-4 p-3 bg-stone-50 dark:bg-slate-800 rounded-lg">
           <p className="text-xs text-ink-light">
             💡 언어를 변경하면 페이지가 새로고침됩니다. <br />
             The page will refresh when changing language. <br />
             言語を変更するとページが更新されます。<br />
             更换语言时页面将刷新。
           </p>
         </div>
      </AccessibleModal>
    </div>
  )
}

// 간단한 언어 표시기 (현재 언어만 표시)
export function LanguageIndicator({ locale }: { locale: Locale }) {
  const language = languages.find(lang => lang.code === locale) || languages[0]
  
  return (
    <span className="inline-flex items-center gap-1 text-sm text-ink-light">
      <span>{language.flag}</span>
      <span>{language.nativeName}</span>
    </span>
  )
}

// 로케일 감지 및 초기화 훅
export function useLocale() {
  const [locale, setLocale] = useState<Locale>('ko')

  useEffect(() => {
    // 저장된 언어 확인
    const saved = localStorage.getItem('locale') as Locale
    if (saved && languages.some(lang => lang.code === saved)) {
      setLocale(saved)
      return
    }

    // 브라우저 언어 감지
    const browserLang = navigator.language.split('-')[0] as Locale
    if (languages.some(lang => lang.code === browserLang)) {
      setLocale(browserLang)
    }
  }, [])

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  return { locale, changeLocale }
}
