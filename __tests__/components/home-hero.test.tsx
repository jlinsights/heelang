import { HomeHero } from '@/components/home/home-hero'
import { render, screen } from '@testing-library/react'

// 사이트는 희랑 공경순의 상설 포트폴리오다. 홈 첫 화면의 주인공은 끝난 전시가 아니라 작가다.
describe('HomeHero', () => {
  it('큰 제목은 작가 이름이고 호·이름의 한자를 함께 보여 준다', () => {
    render(<HomeHero artwork={null} />)
    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toHaveTextContent('희랑 공경순')
    expect(title).toHaveTextContent('熙勆 孔慶順')
  })

  it('끝난 전시의 기간·장소·"개인전" 을 첫 화면에 걸지 않는다', () => {
    const { container } = render(<HomeHero artwork={null} />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/개인전|2025\. 6\. 18|한국미술관|WAY/)
  })

  it('작품과 작가 소개로 이어진다', () => {
    render(<HomeHero artwork={null} />)
    expect(screen.getByRole('link', { name: /작품 보기/ })).toHaveAttribute(
      'href',
      '/gallery'
    )
    expect(screen.getByRole('link', { name: /작가 소개/ })).toHaveAttribute(
      'href',
      '/artist'
    )
  })
})
