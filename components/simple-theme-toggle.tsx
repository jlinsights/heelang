'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

// 사용자가 토글로 직접 고른 테마만 저장한다. 예전 'theme' 키는 첫 방문 때 OS 설정을
// 자동 저장해 둔 값이라 사용자 선택으로 볼 수 없으므로 읽지 않는다.
export const THEME_STORAGE_KEY = 'heelang-theme-choice'

function readSavedChoice(): 'light' | 'dark' | null {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return saved === 'dark' || saved === 'light' ? saved : null
  } catch {
    return null
  }
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
}

/** 기본은 라이트. 사용자가 고른 적이 있을 때만 그 선택을 따른다(OS 설정은 따르지 않는다). */
export function SimpleThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const dark = readSavedChoice() === 'dark'
    setIsDark(dark)
    applyTheme(dark)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    applyTheme(newIsDark)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newIsDark ? 'dark' : 'light')
    } catch {
      // 저장소를 쓸 수 없으면(사생활 보호 모드 등) 이번 방문에만 적용된다
    }
  }

  // 마운트될 때까지 아무것도 렌더링하지 않음 (hydration 에러 방지)
  if (!mounted) {
    return (
      <div className='w-9 h-9 flex items-center justify-center'>
        {/* 빈 공간 유지 */}
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className='w-9 h-9 flex items-center justify-center rounded-md text-ink-light hover:text-ink hover:bg-ink/5 transition-colors duration-200'
      aria-label='테마 변경'
      type='button'
    >
      {isDark ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
    </button>
  )
}
