import { render, screen } from '@testing-library/react'

// 성능 모니터링 버튼은 운영에서 null 을 돌려줘도 5초마다 점수를 읽는 타이머가
// 돌았다. 개발 환경이 아니면 아예 렌더하지 않는다.
const floatingButton = jest.fn(() => null)
const dashboard = jest.fn(() => null)
jest.mock('@/components/performance-dashboard', () => ({
  PerformanceFloatingButton: (props: unknown) => floatingButton(props),
  PerformanceDashboard: (props: unknown) => dashboard(props),
}))
jest.mock('@/components/pwa-install-prompt', () => ({
  PWAInstallPrompt: () => null,
}))
jest.mock('@/components/analytics-provider', () => ({
  AnalyticsProvider: ({ children }: { children: React.ReactNode }) => children,
}))
jest.mock('@/components/service-worker-registration', () => ({
  ServiceWorkerRegistration: () => null,
}))

import { ClientLayout } from '@/components/client-layout'

// 셸에 NODE_ENV=development 가 설정돼 있으면 jest 가 그대로 물려받으므로 직접 정한다
const env = process.env as Record<string, string | undefined>
const originalNodeEnv = env.NODE_ENV
afterEach(() => {
  env.NODE_ENV = originalNodeEnv
  floatingButton.mockClear()
  dashboard.mockClear()
})

describe('ClientLayout', () => {
  it('운영에서는 성능 모니터링을 렌더하지 않는다', () => {
    env.NODE_ENV = 'production'
    render(
      <ClientLayout>
        <p>본문</p>
      </ClientLayout>
    )
    expect(screen.getByText('본문')).toBeInTheDocument()
    expect(floatingButton).not.toHaveBeenCalled()
    expect(dashboard).not.toHaveBeenCalled()
  })

  it('개발 환경에서는 렌더한다', () => {
    env.NODE_ENV = 'development'
    render(
      <ClientLayout>
        <p>본문</p>
      </ClientLayout>
    )
    expect(floatingButton).toHaveBeenCalled()
  })
})
