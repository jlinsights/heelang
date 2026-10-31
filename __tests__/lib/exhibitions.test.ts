import {
  EXHIBITIONS_SNAPSHOT,
  groupByYear,
  parseExhibitionLine,
} from '@/lib/exhibitions'

describe('parseExhibitionLine', () => {
  it('"연도 | 구분 | 제목 | 장소" 를 나눈다', () => {
    expect(
      parseExhibitionLine(
        '2024 | 단체전 | Art Beyond Boundaries | 일본 롯폰기 국립신미술관'
      )
    ).toEqual({
      year: 2024,
      kind: '단체전',
      title: 'Art Beyond Boundaries',
      venue: '일본 롯폰기 국립신미술관',
      href: null,
    })
  })

  it('장소가 없으면 venue 는 null', () => {
    expect(parseExhibitionLine('2021 | 개인전 | 첫 전시')).toMatchObject({
      year: 2021,
      kind: '개인전',
      title: '첫 전시',
      venue: null,
    })
  })

  it('형식에 맞지 않는 줄은 통째로 제목이 되고 연도는 null', () => {
    expect(parseExhibitionLine('개인전 다수')).toEqual({
      year: null,
      kind: null,
      title: '개인전 다수',
      venue: null,
      href: null,
    })
  })

  it('2025 개인전 「길」은 전시 기록 페이지로 연결된다', () => {
    expect(
      parseExhibitionLine('2025 | 개인전 | 길(Way) | 인사동 한국미술관').href
    ).toBe('/exhibitions/gil')
  })
})

describe('groupByYear', () => {
  it('최근 연도부터, 같은 해 안에서는 원래 순서대로, 연도 모르는 항목은 맨 끝', () => {
    const groups = groupByYear(
      [
        '2022 | 단체전 | A | x',
        '개인전 다수',
        '2025 | 단체전 | B | y',
        '2022 | 단체전 | C | z',
      ].map(parseExhibitionLine)
    )
    expect(groups.map((g) => g.year)).toEqual([2025, 2022, null])
    expect(groups[1].entries.map((e) => e.title)).toEqual(['A', 'C'])
  })
})

describe('EXHIBITIONS_SNAPSHOT', () => {
  // Airtable Artist.exhibitions 를 옮겨 둔 것. 지어낸 폴백 이력(lib/artist.ts)과 섞이면 안 된다.
  it('모든 줄이 연도·구분·제목·장소를 가진다', () => {
    for (const entry of EXHIBITIONS_SNAPSHOT.map(parseExhibitionLine)) {
      expect(entry.year).not.toBeNull()
      expect(entry.kind).not.toBeNull()
      expect(entry.venue).not.toBeNull()
    }
  })

  it('2025 개인전 「길」이 들어 있다', () => {
    expect(
      EXHIBITIONS_SNAPSHOT.map(parseExhibitionLine).some(
        (e) => e.href === '/exhibitions/gil'
      )
    ).toBe(true)
  })
})
