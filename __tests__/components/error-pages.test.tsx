import ErrorPage from '@/app/error'
import NotFound from '@/app/not-found'
import { fireEvent, render, screen } from '@testing-library/react'

jest.mock('@/components/art-navigation', () => ({
  ArtNavigation: () => <nav aria-label='주 메뉴' />,
  NavigationSpacer: () => null,
}))

// 404·오류 화면도 사이트 안의 한 페이지다. 메뉴가 있어야 홈 버튼 말고도 갈 곳이 있다.
describe('404 페이지', () => {
  it('사이트 메뉴와 COPY.md 문구를 쓴다', () => {
    const { container } = render(<NotFound />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404')
    expect(container).toHaveTextContent(
      '죄송합니다. 찾으시는 페이지가 존재하지 않습니다.'
    )
    expect(
      screen.getByRole('link', { name: '홈으로 돌아가기' })
    ).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /작품 보기/ })).toHaveAttribute(
      'href',
      '/gallery'
    )
  })

  it('팔레트 아이콘(회화 도구)을 쓰지 않는다', () => {
    const { container } = render(<NotFound />)
    expect(container.querySelector('svg.lucide-palette')).toBeNull()
  })
})

describe('오류 페이지', () => {
  beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
  afterEach(() => jest.restoreAllMocks())

  it('무엇이 안 됐는지와 다음 행동을 알려 주고, 다시 시도하면 reset 을 부른다', () => {
    const reset = jest.fn()
    render(<ErrorPage error={new Error('boom')} reset={reset} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '페이지를 불러오지 못했습니다'
    )
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }))
    expect(reset).toHaveBeenCalledTimes(1)
    expect(
      screen.getByRole('link', { name: '홈으로 돌아가기' })
    ).toHaveAttribute('href', '/')
  })
})
