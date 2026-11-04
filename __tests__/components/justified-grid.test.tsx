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
})
