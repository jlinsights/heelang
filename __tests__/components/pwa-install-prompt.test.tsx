import { PWAInstallPrompt } from '@/components/pwa-install-prompt'
import { act, fireEvent, render, screen } from '@testing-library/react'

// 브라우저가 앱 설치를 제안하면(beforeinstallprompt) 화면 아래에 안내가 뜬다.
// 닫기 버튼은 아이콘(✕)뿐이라 이름이 없으면 화면 낭독기가 "버튼"이라고만 읽는다.
function offerInstall(outcome: 'accepted' | 'dismissed' = 'dismissed') {
  const event = Object.assign(new Event('beforeinstallprompt'), {
    platforms: ['web'],
    userChoice: Promise.resolve({ outcome, platform: 'web' }),
    prompt: jest.fn(() => Promise.resolve()),
  })
  act(() => {
    window.dispatchEvent(event)
  })
}

beforeEach(() => {
  localStorage.clear()
  window.matchMedia = jest.fn().mockReturnValue({ matches: false })
})

describe('앱 설치 안내', () => {
  it('닫기 버튼에 이름이 있고, 누르는 면적이 44px 이다', () => {
    render(<PWAInstallPrompt />)
    offerInstall()
    const close = screen.getByRole('button', { name: '설치 안내 닫기' })
    expect(close).toHaveClass('h-11', 'w-11')
  })

  it('닫으면 안내가 사라지고 다시 띄우지 않는다', () => {
    render(<PWAInstallPrompt />)
    offerInstall()
    fireEvent.click(screen.getByRole('button', { name: '설치 안내 닫기' }))
    expect(
      screen.queryByRole('button', { name: '설치 안내 닫기' })
    ).not.toBeInTheDocument()
    expect(localStorage.getItem('pwa-install-declined')).toBe('true')
  })

  it('작품을 가리지 않게 평평한 한 줄 안내다 — 그림자 없음, 사실만 말한다', () => {
    render(<PWAInstallPrompt />)
    offerInstall()
    const bar = screen.getByRole('complementary', { name: '앱 설치 안내' })
    expect(bar.className).not.toMatch(/shadow/)
    expect(bar).toHaveTextContent('홈 화면에 앱으로 설치할 수 있습니다.')
    expect(bar).not.toHaveTextContent(/빠르고|편리/)
  })

  it('닫으면 다시 묻지 않으므로 "나중에" 버튼이 없다', () => {
    render(<PWAInstallPrompt />)
    offerInstall()
    expect(
      screen.queryByRole('button', { name: '나중에' })
    ).not.toBeInTheDocument()
  })

  it('설치를 받아들이면 안내가 사라지고 거절로 기록하지 않는다', async () => {
    render(<PWAInstallPrompt />)
    offerInstall('accepted')
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '설치' }))
    })
    expect(
      screen.queryByRole('complementary', { name: '앱 설치 안내' })
    ).not.toBeInTheDocument()
    expect(localStorage.getItem('pwa-install-declined')).toBeNull()
  })

  it('한 번 닫았으면 브라우저가 다시 제안해도 띄우지 않는다', () => {
    localStorage.setItem('pwa-install-declined', 'true')
    render(<PWAInstallPrompt />)
    offerInstall()
    expect(
      screen.queryByRole('complementary', { name: '앱 설치 안내' })
    ).not.toBeInTheDocument()
  })
})
