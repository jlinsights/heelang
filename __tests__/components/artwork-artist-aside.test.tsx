import { ArtworkArtistAside } from '@/components/artwork/artwork-artist-aside'
import { ARTIST_PROFILE } from '@/lib/artist-profile'
import { render, screen } from '@testing-library/react'

describe('ArtworkArtistAside', () => {
  beforeEach(() => render(<ArtworkArtistAside />))

  it('작가 이름을 제목으로, 소개 글을 인용으로 보여준다', () => {
    expect(
      screen.getByRole('heading', { name: ARTIST_PROFILE.name })
    ).toBeInTheDocument()
    expect(screen.getByText(ARTIST_PROFILE.intro)).toBeInTheDocument()
  })

  it('작가 소개 페이지로 연결한다', () => {
    expect(screen.getByRole('link', { name: /작가 소개/ })).toHaveAttribute(
      'href',
      '/artist'
    )
  })

  it('브러시웨이즈는 새 탭으로, opener 없이 연다', () => {
    const link = screen.getByRole('link', { name: /브러시웨이즈/ })
    expect(link).toHaveAttribute('href', 'https://brushways.org')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })
})
