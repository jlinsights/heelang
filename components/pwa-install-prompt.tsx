'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

const DECLINED_KEY = 'pwa-install-declined'

/**
 * 브라우저가 앱 설치를 제안할 때(Chrome·Android 의 beforeinstallprompt)만
 * 화면 아래에 한 줄짜리 안내를 띄운다. iOS Safari 는 이 이벤트를 보내지 않아
 * 여기서는 아무것도 띄우지 않는다.
 *
 * 작품을 가리지 않게 낮고 평평하게(그림자 없음, 가는 선) 둔다 — 깊이는 작품에만
 * 있다(DESIGN.md). 닫으면 다시 묻지 않으므로 "나중에" 같은 말을 쓰지 않는다.
 */
export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      if (isStandalone || localStorage.getItem(DECLINED_KEY)) return
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () =>
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
  }, [])

  const decline = () => {
    localStorage.setItem(DECLINED_KEY, 'true')
    setDeferredPrompt(null)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    } else {
      decline()
    }
  }

  if (!deferredPrompt) return null

  return (
    <aside
      aria-label='앱 설치 안내'
      className='fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-md items-center gap-2 rounded-xl border border-border bg-background py-1.5 pl-4 pr-1.5 text-sm'
    >
      <p className='flex-1 text-muted-foreground'>
        홈 화면에 앱으로 설치할 수 있습니다.
      </p>
      <button
        type='button'
        onClick={handleInstall}
        className='h-11 shrink-0 rounded-full bg-foreground px-5 font-medium text-background hover:opacity-85 focus-art'
      >
        설치
      </button>
      <button
        type='button'
        onClick={decline}
        aria-label='설치 안내 닫기'
        className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-art'
      >
        <X className='h-4 w-4' aria-hidden='true' />
      </button>
    </aside>
  )
}
