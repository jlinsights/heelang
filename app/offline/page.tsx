'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WifiOff, RefreshCw, Home, Image } from 'lucide-react'
import { FadeInContainer, ScaleInContainer, SlideInContainer } from '@/components/animations'

export default function OfflinePage() {
  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Icon */}
        <ScaleInContainer delay={0.2}>
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-stone-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <WifiOff className="w-12 h-12 text-ink-light" />
            </div>
          </div>
        </ScaleInContainer>

        {/* Title & Description */}
        <FadeInContainer delay={0.4}>
          <div className="space-y-4">
            <h1 className="font-display text-3xl lg:text-4xl text-ink">
              연결이 끊어졌습니다
            </h1>
            <p className="text-ink-light text-lg leading-relaxed">
              인터넷 연결을 확인하고<br />
              다시 시도해주세요
            </p>
          </div>
        </FadeInContainer>

        {/* Cached Content Info */}
        <SlideInContainer delay={0.6} direction="up">
          <div className="bg-stone-50 dark:bg-slate-800 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-ink-light">
              <Image className="w-5 h-5" />
              <span className="text-sm font-medium">캐시된 콘텐츠</span>
            </div>
            <p className="text-sm text-ink-light">
              이전에 방문한 작품들은<br />
              오프라인에서도 볼 수 있습니다
            </p>
          </div>
        </SlideInContainer>

        {/* Action Buttons */}
        <SlideInContainer delay={0.8} direction="up">
          <div className="space-y-3">
            <Button 
              onClick={handleRefresh}
              className="w-full bg-ink hover:bg-ink/90 text-white"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="w-full"
              size="lg"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                홈으로 이동
              </Link>
            </Button>
          </div>
        </SlideInContainer>

        {/* Network Status */}
        <FadeInContainer delay={1.0}>
          <div className="text-xs text-ink-light">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span>오프라인 모드</span>
            </div>
          </div>
        </FadeInContainer>

      </div>
    </div>
  )
} 