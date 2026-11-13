import { PWAInstallPrompt } from '@/components/pwa-install-prompt'
import { act, fireEvent, render, screen } from '@testing-library/react'

// 브라우저가 앱 설치를 제안하면(beforeinstallprompt) 화면 아래에 안내가 뜬다.
// 닫기 버튼은 아이콘(✕)뿐이라 이름이 없으면 화면 낭독기가 "버튼"이라고만 읽는다.
function offerInstall() {
  const event = Object.assign(new Event('beforeinstallprompt'), {
    platforms: ['web'],
    userChoice: Promise.resolve({ outcome: 'dismissed', platform: 'web' }),
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
})
