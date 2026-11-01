'use client'

import { Button } from '@/components/ui/button'
import { Share } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ArtworkDetailClientProps {
  title: string
  slug: string
}

type CopyStatus = 'idle' | 'copied' | 'failed'

// 공유 결과는 브라우저 대화상자(alert) 대신 버튼 옆 문구로 알린다 (COPY.md).
const STATUS_TEXT: Record<CopyStatus, string> = {
  idle: '',
  copied: '링크를 복사했습니다.',
  failed: '링크를 복사하지 못했습니다. 주소창의 주소를 복사해 주세요.',
}

export function ArtworkDetailClient({ title, slug }: ArtworkDetailClientProps) {
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<CopyStatus>('idle')

  useEffect(() => {
    setMounted(true)
  }, [])

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `${title} - 희랑 공경순`,
      text: `희랑 공경순 작가의 작품 「${title}」을 감상해 보세요.`,
      url: `${window.location.origin}/gallery/${slug}`,
    }

    if (!navigator.share) {
      await copyLink(shareData.url)
      return
    }

    try {
      await navigator.share(shareData)
    } catch (error) {
      // 사용자가 공유 창을 닫은 것은 실패가 아니다
      if (error instanceof DOMException && error.name === 'AbortError') return
      await copyLink(shareData.url)
    }
  }

  return (
    <span className='inline-flex flex-wrap items-center gap-3'>
      <Button
        variant='outline'
        size='sm'
        onClick={handleShare}
        disabled={!mounted}
      >
        <Share className='w-4 h-4 mr-2' aria-hidden='true' />
        공유하기
      </Button>
      <span role='status' className='text-sm text-muted-foreground'>
        {STATUS_TEXT[status]}
      </span>
    </span>
  )
}
