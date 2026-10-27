import {
  filterArtworks,
  getNeighbors,
  parseAspectRatio,
  ratioFromArtwork,
  sortArtworks,
} from '@/lib/gallery/ordering'
import type { Artwork } from '@/lib/types'

const make = (overrides: Partial<Artwork>): Artwork => ({
  id: overrides.slug ?? 'id',
  slug: 'slug',
  title: '제목',
  year: 2024,
  medium: '화선지에 먹',
  dimensions: '70 x 140 cm',
  aspectRatio: '1/2',
  description: '',
  imageUrl: '/img.jpg',
  ...overrides,
})

const works: Artwork[] = [
  make({
    slug: 'heelang-b-2023',
    title: '나',
    year: 2023,
    category: 'calligraphy',
    tags: ['먹'],
  }),
  make({
    slug: 'heelang-treasure-10',
    title: '다',
    year: 2025,
    category: 'treasure',
    tags: ['먹', '붓'],
  }),
  make({
    slug: 'heelang-a-2025',
    title: '가',
    year: 2025,
    category: 'painting',
  }),
  make({
    slug: 'heelang-treasure-2',
    title: '라',
    year: 2024,
    category: 'treasure',
    tags: ['붓'],
  }),
]

describe('sortArtworks', () => {
  it('기본 순서: 문방사우(treasure)를 번호순으로 먼저, 나머지는 원래 순서', () => {
    expect(sortArtworks(works, 'default').map((a) => a.slug)).toEqual([
      'heelang-treasure-2',
      'heelang-treasure-10',
      'heelang-b-2023',
      'heelang-a-2025',
    ])
  })

  it('제목순은 가나다 순', () => {
    expect(sortArtworks(works, 'title').map((a) => a.title)).toEqual([
      '가',
      '나',
      '다',
      '라',
    ])
  })

  it('연도순은 최신 연도부터', () => {
    expect(sortArtworks(works, 'year').map((a) => a.year)).toEqual([
      2025, 2025, 2024, 2023,
    ])
  })

  it('원본 배열을 변경하지 않는다', () => {
    const before = works.map((a) => a.slug)
    sortArtworks(works, 'title')
    expect(works.map((a) => a.slug)).toEqual(before)
  })
})

describe('filterArtworks', () => {
  it('카테고리로 거른다', () => {
    expect(
      filterArtworks(works, { category: 'treasure', tags: [] })
    ).toHaveLength(2)
  })

  it('all이면 카테고리 필터를 적용하지 않는다', () => {
    expect(filterArtworks(works, { category: 'all', tags: [] })).toHaveLength(4)
  })

  it('선택한 태그를 모두 가진 작품만 남긴다', () => {
    expect(
      filterArtworks(works, { category: 'all', tags: ['먹', '붓'] }).map(
        (a) => a.slug
      )
    ).toEqual(['heelang-treasure-10'])
  })
})

describe('getNeighbors', () => {
  it('기본 순서 기준으로 이전/다음 작품을 돌려준다', () => {
    const { prev, next } = getNeighbors(works, 'heelang-treasure-10')
    expect(prev?.slug).toBe('heelang-treasure-2')
    expect(next?.slug).toBe('heelang-b-2023')
  })

  it('처음과 끝에서는 null', () => {
    expect(getNeighbors(works, 'heelang-treasure-2').prev).toBeNull()
    expect(getNeighbors(works, 'heelang-a-2025').next).toBeNull()
  })

  it('없는 slug면 둘 다 null', () => {
    expect(getNeighbors(works, 'missing')).toEqual({ prev: null, next: null })
  })
})

describe('parseAspectRatio', () => {
  it('"w/h" 문자열을 가로/세로 비율 숫자로 바꾼다', () => {
    expect(parseAspectRatio('1/2')).toBe(0.5)
    expect(parseAspectRatio('3 / 2')).toBe(1.5)
  })

  it('잘못된 값이면 3/4로 폴백한다', () => {
    expect(parseAspectRatio('')).toBe(0.75)
    expect(parseAspectRatio('abc')).toBe(0.75)
    expect(parseAspectRatio('1/0')).toBe(0.75)
    expect(parseAspectRatio(undefined)).toBe(0.75)
  })

  it('극단적인 비율은 레이아웃이 깨지지 않게 제한한다', () => {
    expect(parseAspectRatio('1/20')).toBe(0.25)
    expect(parseAspectRatio('20/1')).toBe(4)
  })
})

describe('ratioFromArtwork', () => {
  it('유효한 aspectRatio가 있으면 그것을 쓴다', () => {
    expect(
      ratioFromArtwork({ aspectRatio: '2/3', dimensions: '70 x 140 cm' })
    ).toBeCloseTo(2 / 3)
  })

  it('aspectRatio가 깨졌으면 dimensions(가로 x 세로)에서 계산한다', () => {
    expect(
      ratioFromArtwork({ aspectRatio: '?', dimensions: '24.5cm x 33.5cm' })
    ).toBeCloseTo(24.5 / 33.5)
    expect(
      ratioFromArtwork({
        aspectRatio: '70cm x 140cm',
        dimensions: '70cm x 140cm',
      })
    ).toBe(0.5)
    expect(
      ratioFromArtwork({ aspectRatio: '', dimensions: '35×135cm' })
    ).toBeCloseTo(35 / 135)
  })

  it('둘 다 없으면 3/4', () => {
    expect(ratioFromArtwork({ aspectRatio: '?', dimensions: '' })).toBe(0.75)
  })
})
