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

type Point = { x: number; y: number }
type Box = { left: number; top: number; width: number; height: number }

/**
 * object-contain 으로 그린 이미지가 상자 안에서 실제로 차지하는 영역에 점이
 * 들어가는지. 이미지 요소는 여백(레터박스)까지 덮으므로 요소 경계로는 알 수 없다.
 * 원본 크기를 아직 모르면 작품 위로 보고 닫지 않는다.
 */
export function isInsideContainedImage(
  point: Point,
  box: Box,
  natural: { width: number; height: number }
): boolean {
  if (!natural.width || !natural.height) return true
  const scale = Math.min(box.width / natural.width, box.height / natural.height)
  const width = natural.width * scale
  const height = natural.height * scale
  const left = box.left + (box.width - width) / 2
  const top = box.top + (box.height - height) / 2
  return (
    point.x >= left &&
    point.x <= left + width &&
    point.y >= top &&
    point.y <= top + height
  )
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
      onClick={(event) => {
        // 어두운 바탕을 누르면 닫고, 작품 위를 누르면 그대로 둔다
        const img = event.currentTarget.querySelector('img')
        if (
          img &&
          isInsideContainedImage(
            { x: event.clientX, y: event.clientY },
            img.getBoundingClientRect(),
            { width: img.naturalWidth, height: img.naturalHeight }
          )
        ) {
          return
        }
        onClose()
      }}
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
