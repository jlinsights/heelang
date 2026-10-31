'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

interface ArtworkLightboxProps {
  open: boolean
  onClose: () => void
  src: string
  title: string
}

/**
 * 전체 화면 작품 보기. role=dialog + aria-modal, Esc로 닫기,
 * 포커스는 닫기 버튼에 가두고 닫으면 열었던 요소로 돌려준다. 배경 스크롤은 잠근다.
 */
export function ArtworkLightbox({
  open,
  onClose,
  src,
  title,
}: ArtworkLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      // 대화상자 안에 포커스 가능한 요소는 닫기 버튼 하나뿐 — Tab을 가둔다
      if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label={`「${title}」 크게 보기`}
      className='fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 md:p-10'
      onClick={onClose}
    >
      <div className='relative h-full w-full'>
        <Image
          src={src}
          alt={`희랑 공경순, 「${title}」`}
          fill
          sizes='100vw'
          className='object-contain'
        />
      </div>
      <button
        ref={closeRef}
        type='button'
        onClick={onClose}
        className='absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white'
        aria-label='닫기'
      >
        <X className='h-6 w-6' aria-hidden='true' />
      </button>
    </div>
  )
}
