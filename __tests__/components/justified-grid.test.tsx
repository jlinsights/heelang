import { JustifiedGrid } from '@/components/gallery/justified-grid'
import { render, screen } from '@testing-library/react'
import { mockArtwork } from '../lib/hooks/artwork.mock'

describe('JustifiedGrid 작품 타일', () => {
  it('호버해도 작품을 확대하지 않는다 — 비율 상자 안에서 확대하면 가장자리가 잘린다', () => {
    render(<JustifiedGrid artworks={[mockArtwork]} />)
    const img = screen.getByRole('img', { name: /작품 1/ })
    expect(img.className).toContain('object-contain')
    expect(img.className).not.toMatch(/scale-/)
  })

  it('호버는 캡션(제목 밑줄)으로 알린다', () => {
    render(<JustifiedGrid artworks={[mockArtwork]} />)
    expect(screen.getByText('작품 1').className).toContain(
      'group-hover:underline'
    )
  })

  // 긴 두루마리는 휴대폰에서 칸이 40–80px 라 한 줄로 자르면 "2022 · ···" 만 남았다
  it('연도·재료 줄은 한 줄로 자르지 않고 두 줄까지 넘긴다', () => {
    const { container } = render(
      <JustifiedGrid
        artworks={[{ ...mockArtwork, year: 2022, medium: '화선지에 먹' }]}
      />
    )
    const meta = [...container.querySelectorAll('p')].find((p) =>
      p.textContent?.includes('화선지에 먹')
    )
    expect(meta).toBeDefined()
    expect(meta!.textContent).toBe('2022 · 화선지에 먹')
    expect(meta!.className).toContain('line-clamp-2')
    expect(meta!.className).not.toContain('line-clamp-1')
    expect(meta!.querySelector('.whitespace-nowrap')?.textContent).toBe(
      '2022 · '
    )
  })
})
