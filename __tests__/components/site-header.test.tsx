import { render, screen } from '@testing-library/react'
import { SiteHeader } from '@/components/site-header'
import { I18nProvider } from '@/components/i18n-provider'

// Next.js의 Image 컴포넌트 모킹
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

const renderHeader = () =>
  render(
    <I18nProvider>
      <SiteHeader />
    </I18nProvider>
  )

describe('SiteHeader', () => {
  beforeEach(() => {
    // jsdom 기본 언어(en-US) 대신 기본 로케일(ko) 고정
    localStorage.setItem('locale', 'ko')
  })

  it('렌더링이 올바르게 되는지 확인', () => {
    renderHeader()

    // 로고와 제목이 표시되는지 확인
    expect(screen.getByText('희랑')).toBeInTheDocument()

    // 네비게이션 링크들이 표시되는지 확인
    expect(screen.getByText('갤러리')).toBeInTheDocument()
    expect(screen.getByText('작가')).toBeInTheDocument()
  })

  it('네비게이션 링크들이 올바른 href를 가지는지 확인', () => {
    renderHeader()

    const galleryLink = screen.getByText('갤러리').closest('a')
    const artistLink = screen.getByText('작가').closest('a')

    expect(galleryLink).toHaveAttribute('href', '/gallery')
    expect(artistLink).toHaveAttribute('href', '/artist')
  })

  it('접근성 속성이 올바르게 설정되어 있는지 확인', () => {
    renderHeader()

    const homeLink = screen.getByLabelText('홈으로 가기')
    const navigation = screen.getByRole('navigation')

    expect(homeLink).toBeInTheDocument()
    expect(navigation).toHaveAttribute('aria-label', '메인 네비게이션')
  })

  it('테마 토글과 언어 스위처가 렌더링되는지 확인', () => {
    renderHeader()

    // 버튼들이 존재하는지 확인 (정확한 텍스트 없이)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2) // 테마 토글 + 언어 스위처
  })
})
