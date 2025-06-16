'use client'

import { Button } from '@/components/ui/button'
import { Home, Image, RefreshCw, WifiOff } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-500">
        
        {/* Icon */}
        <div className="flex justify-center animate-in zoom-in duration-300 delay-200">
          <div className="w-24 h-24 bg-stone-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-ink-light" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-4 animate-in fade-in duration-500 delay-300">
          <h1 className="font-display text-3xl lg:text-4xl text-ink">
            연결이 끊어졌습니다
          </h1>
          <p className="text-ink-light text-lg leading-relaxed">
            인터넷 연결을 확인하고<br />
            다시 시도해주세요
          </p>
        </div>

        {/* Cached Content Info */}
        <div className="bg-stone-50 dark:bg-slate-800 rounded-lg p-6 space-y-3 animate-in slide-in-from-bottom duration-500 delay-500">
          <div className="flex items-center justify-center gap-2 text-ink-light">
            <Image className="w-5 h-5" />
            <span className="text-sm font-medium">캐시된 콘텐츠</span>
          </div>
          <p className="text-sm text-ink-light">
            이전에 방문한 작품들은<br />
            오프라인에서도 볼 수 있습니다
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 animate-in slide-in-from-bottom duration-500 delay-700">
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

        {/* Network Status */}
        <div className="text-xs text-ink-light animate-in fade-in duration-500 delay-1000">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span>오프라인 모드</span>
          </div>
        </div>

      </div>
    </div>
  )
} 