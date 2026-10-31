'use client'

import { useEffect, useState } from 'react'
import { AnalyticsProvider } from '@/components/analytics-provider'
import { I18nProvider } from '@/components/i18n-provider'
import { PerformanceDashboard, PerformanceFloatingButton } from '@/components/performance-dashboard'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 프로바이더는 서버·클라이언트 모두 같은 트리로 렌더링한다. 마운트 전후로
  // 트리 모양이 바뀌면 React 가 페이지 전체를 버리고 다시 그린다.
  // 브라우저 전용 위젯만 마운트 뒤에 붙인다.
  return (
    <I18nProvider>
      <AnalyticsProvider>
        <div className='min-h-screen bg-background text-foreground'>
          {children}
          
          {mounted && (
            <>
              {/* PWA 기능 */}
              <ServiceWorkerRegistration />
              <PWAInstallPrompt />

              {/* 성능 모니터링 플로팅 버튼 (개발 환경에서만 표시) */}
              <PerformanceFloatingButton
                onClick={() => setShowPerformanceDashboard(true)}
              />

              {/* 성능 모니터링 대시보드 */}
              <PerformanceDashboard
                isVisible={showPerformanceDashboard}
                onClose={() => setShowPerformanceDashboard(false)}
              />
            </>
          )}
        </div>
      </AnalyticsProvider>
    </I18nProvider>
  )
}
