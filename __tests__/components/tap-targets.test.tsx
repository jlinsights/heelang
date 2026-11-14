import ContactPage from '@/app/contact/page'
import { ArtworkArtistAside } from '@/components/artwork/artwork-artist-aside'
import { render, screen } from '@testing-library/react'
import { readFileSync } from 'fs'
import path from 'path'

jest.mock('@/components/art-navigation', () => ({
  ArtNavigation: () => null,
  NavigationSpacer: () => null,
}))

// 20–22px 높이의 글자 링크는 hit-area 로 누르는 면적을 44px 이상으로 넓힌다
// (WCAG 2.5.8, 휴대폰 44px 권장). 실제 면적은 브라우저에서 elementFromPoint 로 확인했다.
describe('글자 링크의 누르는 면적', () => {
  it('hit-area 가 위아래로 12px 씩 넓힌다', () => {
    const css = readFileSync(
      path.join(process.cwd(), 'app/globals.css'),
      'utf8'
    )
    expect(css).toMatch(/\.hit-area::after\s*{[^}]*inset:\s*-12px/)
  })

  it('작품 상세의 작가 소개·브러시웨이즈 링크', () => {
    render(<ArtworkArtistAside />)
    expect(screen.getByRole('link', { name: /작가 소개/ })).toHaveClass(
      'hit-area'
    )
    expect(screen.getByRole('link', { name: /브러시웨이즈/ })).toHaveClass(
      'hit-area'
    )
  })

  it('「길 道」 전시 기록의 전시 목록·작가 소개·전화·이메일 링크', () => {
    const src = readFileSync(
      path.join(process.cwd(), 'app/exhibitions/gil/page.tsx'),
      'utf8'
    )
    for (const marker of [
      "href='/exhibitions'",
      "href='/artist'",
      'href={`tel:',
      'href={`mailto:',
    ]) {
      const at = src.indexOf(marker)
      expect(at).toBeGreaterThan(-1)
      const tag = src.slice(at, src.indexOf('>', at))
      expect(tag).toMatch(/className='[^']*\bhit-area\b/)
    }
  })

  it('문의 페이지의 이메일·전화 링크', () => {
    render(<ContactPage />)
    for (const link of screen.getAllByRole('link')) {
      const href = link.getAttribute('href') ?? ''
      if (href.startsWith('mailto:') || href.startsWith('tel:')) {
        expect(link).toHaveClass('hit-area')
      }
    }
    expect(
      screen
        .getAllByRole('link')
        .filter((l) => /^(mailto|tel):/.test(l.getAttribute('href') ?? ''))
    ).toHaveLength(2)
  })
})

// 갤러리 칩·정렬, 테마 토글, 공유 버튼, 문의 입력칸은 휴대폰에서 31–40px 였다.
// 정렬·토글·입력칸은 어디서나 44px, 칩·공유 버튼은 손가락 기기(pointer: coarse)에서만 키운다.
describe('작은 컨트롤의 누르는 높이', () => {
  const read = (file: string) =>
    readFileSync(path.join(process.cwd(), file), 'utf8')

  it('touch 변형은 pointer: coarse 에 걸린다', () => {
    expect(read('tailwind.config.ts')).toMatch(
      /touch:\s*{\s*raw:\s*'\(pointer: coarse\)'\s*}/
    )
  })

  it('갤러리 칩은 손가락 기기에서 44px, 정렬은 어디서나 44px', () => {
    const src = read('components/gallery/gallery-toolbar.tsx')
    expect(src).toMatch(/const chipBase =\s*'[^']*\btouch:min-h-11\b/)
    expect(src).toMatch(/<select[\s\S]*?className='[^']*\bmin-h-11\b/)
  })

  it('테마 토글과 입력칸은 44px', () => {
    expect(read('components/simple-theme-toggle.tsx')).not.toMatch(/\bh-9\b/)
    expect(read('components/simple-theme-toggle.tsx')).toMatch(/\bw-11 h-11\b/)
    expect(read('components/ui/input.tsx')).toMatch(/'flex h-11 /)
  })

  it('공유하기 버튼은 손가락 기기에서 44px', () => {
    expect(read('components/artwork-detail-client.tsx')).toMatch(
      /className='[^']*\btouch:h-11\b/
    )
  })
})
