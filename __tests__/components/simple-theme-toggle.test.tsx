import { SimpleThemeToggle, THEME_STORAGE_KEY } from '@/components/simple-theme-toggle'
import { fireEvent, render, screen } from '@testing-library/react'

const mockSystemDark = (dark: boolean) => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: dark && query === '(prefers-color-scheme: dark)',
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    onchange: null,
    dispatchEvent: jest.fn(),
  }))
}

describe('SimpleThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('저장된 선택이 없으면 OS 가 다크여도 라이트로 연다', () => {
    mockSystemDark(true)
    render(<SimpleThemeToggle />)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('예전 코드가 자동 저장한 theme=dark 는 무시한다 (사용자 선택이 아님)', () => {
    mockSystemDark(true)
    localStorage.setItem('theme', 'dark')
    render(<SimpleThemeToggle />)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('처음 열 때는 아무것도 저장하지 않는다', () => {
    mockSystemDark(false)
    render(<SimpleThemeToggle />)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
  })

  it('사용자가 다크를 고르면 저장하고, 다음 방문에도 다크로 연다', () => {
    mockSystemDark(false)
    const { unmount } = render(<SimpleThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: '테마 변경' }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

    unmount()
    document.documentElement.classList.remove('dark')
    render(<SimpleThemeToggle />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
