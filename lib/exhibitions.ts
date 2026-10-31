import { fetchArtistFromAirtable } from '@/lib/airtable'

// 전시 이력의 출처는 Airtable Artist.exhibitions (다중선택, "연도 | 구분 | 제목 | 장소").
// 따로 Exhibitions 테이블은 없다.

export interface ExhibitionEntry {
  year: number | null
  kind: string | null
  title: string
  venue: string | null
  /** 이 사이트에 기록 페이지가 있는 전시만 값이 있다 */
  href: string | null
}

export interface ExhibitionYearGroup {
  year: number | null
  entries: ExhibitionEntry[]
}

/** 제목 → 기록 페이지. 페이지가 생기면 여기에 더한다. */
const EXHIBITION_PAGES: Record<string, string> = {
  '길(Way)': '/exhibitions/gil',
}

/**
 * Airtable 을 못 읽을 때(Preview 배포, 키 없음) 쓰는 사본.
 * 2026-10-31 Airtable Artist.exhibitions 를 그대로 옮겼다. lib/artist.ts 의 폴백 작가
 * 데이터는 지어낸 이력이라 쓰지 않는다.
 */
export const EXHIBITIONS_SNAPSHOT: readonly string[] = [
  '2025 | 개인전 | 길(Way) | 인사동 한국미술관',
  '2025 | 단체전 | 중국•닝보 제25회 중일 난정서법 교류전 | 닝보미술관',
  '2025 | 단체전 | 제65회 魁心書法院展 | 일본 긴자 요쿄홀',
  "2024 | 단체전 | 제5회 희랑글씨 회원전 '쉼소리' 전 | 제주민속촌",
  '2024 | 단체전 | Art Beyond Boundaries | 일본 롯폰기 국립신미술관',
  '2023 | 단체전 | 제4회 희랑글씨 회원전 이분법전 | 김포아트홀',
  '2022 | 단체전 | 제3회 희랑글씨 회원전 쓰임전 | 김포아트빌리지',
  '2022 | 단체전 | 제2회 희랑글씨 회원전 울림전 | 김포 장기도서관',
  '2021 | 단체전 | 제1회 희랑글씨 회원전 시간을여행하다전 | 김포 마산도서관',
]

const YEAR = /^\d{4}$/

export function parseExhibitionLine(line: string): ExhibitionEntry {
  const parts = line.split('|').map((part) => part.trim())
  if (parts.length < 3 || !YEAR.test(parts[0])) {
    const title = line.trim()
    return { year: null, kind: null, title, venue: null, href: null }
  }
  const [year, kind, title, ...rest] = parts
  const venue = rest.join(' | ') || null
  return {
    year: Number(year),
    kind,
    title,
    venue,
    href: EXHIBITION_PAGES[title] ?? null,
  }
}

/** 최근 연도부터. 같은 해 안에서는 원래 순서, 연도를 모르는 항목은 맨 끝. */
export function groupByYear(entries: ExhibitionEntry[]): ExhibitionYearGroup[] {
  const byYear = new Map<number | null, ExhibitionEntry[]>()
  for (const entry of entries) {
    byYear.set(entry.year, [...(byYear.get(entry.year) ?? []), entry])
  }
  return [...byYear.entries()]
    .map(([year, list]) => ({ year, entries: list }))
    .sort((a, b) => (b.year ?? -Infinity) - (a.year ?? -Infinity))
}

export async function getExhibitionLines(): Promise<string[]> {
  try {
    const artist = await fetchArtistFromAirtable()
    if (artist?.exhibitions?.length) return artist.exhibitions
  } catch (error) {
    console.warn('전시 이력을 Airtable 에서 읽지 못해 사본을 씁니다:', error)
  }
  return [...EXHIBITIONS_SNAPSHOT]
}
