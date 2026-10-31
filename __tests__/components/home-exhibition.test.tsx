import { HomeExhibition } from '@/components/home/home-sections'
import { render, screen } from '@testing-library/react'

// 2025 개인전 「길 道」는 끝났다. 홈의 전시 안내는 관람 안내가 아니라 기록이어야 한다.
describe('HomeExhibition', () => {
  it('끝난 전시에 초대하거나 관람 안내를 하지 않는다', () => {
    const { container } = render(<HomeExhibition />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/초대합니다|열리는|휴관|사전 예약|단체 관람/)
  })

  it('지난 전시로 소개하고 기간·장소·주최를 보여 준다', () => {
    render(<HomeExhibition />)
    expect(screen.getByText(/2025년 .*에서 열린 .*개인전/)).toBeInTheDocument()
    expect(screen.getByText('2025. 6. 18 — 6. 24')).toBeInTheDocument()
    expect(screen.getByText('인사동 한국미술관 2층')).toBeInTheDocument()
    expect(screen.getByText('주최')).toBeInTheDocument()
  })

  it('전시 기록과 전체 전시 목록으로 이어진다', () => {
    render(<HomeExhibition />)
    expect(
      screen.getByRole('link', { name: /전시 기록 보기/ })
    ).toHaveAttribute('href', '/exhibitions/gil')
    expect(screen.getByRole('link', { name: /모든 전시/ })).toHaveAttribute(
      'href',
      '/exhibitions'
    )
  })
})
