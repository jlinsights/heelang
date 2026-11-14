import { pickFeatured } from '@/lib/gallery/ordering'
import type { Artwork } from '@/lib/types'
import { readFileSync } from 'fs'
import path from 'path'

const art = (slug: string, featured = false) =>
  ({ id: slug, slug, title: slug, featured }) as unknown as Artwork

describe('pickFeatured — 홈 대표작', () => {
  it('대표작만 앞에서부터 limit 개', () => {
    const list = [art('a'), art('b', true), art('c', true), art('d', true)]
    expect(pickFeatured(list, 2).map((a) => a.slug)).toEqual(['b', 'c'])
  })

  it('대표작이 없으면 앞에서부터 limit 개', () => {
    const list = [art('a'), art('b'), art('c')]
    expect(pickFeatured(list, 2).map((a) => a.slug)).toEqual(['a', 'b'])
  })

  it('원본 배열을 바꾸지 않는다', () => {
    const list = [art('a', true), art('b')]
    pickFeatured(list, 1)
    expect(list.map((a) => a.slug)).toEqual(['a', 'b'])
  })
})

// 홈이 통째로 클라이언트 컴포넌트였을 때는 서버 HTML 에 대표작 이미지가 없어, 휴대폰에서
// JS·API 를 기다리느라 첫 작품이 5초 넘게 늦게 떴다(Lighthouse LCP 지연 5.1~5.4s).
describe('홈 페이지는 서버에서 작품을 읽는다', () => {
  const src = readFileSync(path.join(process.cwd(), 'app/page.tsx'), 'utf8')

  it("'use client' 가 아니다", () => {
    expect(src).not.toMatch(/^['"]use client['"]/m)
  })

  it('갤러리와 같은 캐시·태그로 Airtable 을 읽는다', () => {
    expect(src).toMatch(/unstable_cache\(\s*getArtworks/)
    expect(src).toMatch(/tags:\s*\[\s*'artworks'\s*\]/)
  })
})
