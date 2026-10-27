import type { Artwork } from '@/lib/types'
import imageRatios from './image-ratios.json'

export type SortKey = 'default' | 'title' | 'year' | 'category' | 'tags'

export interface ArtworkFilter {
  category: string // 'all' 이면 카테고리 필터 없음
  tags: string[] // 모두 포함해야 통과 (AND)
}

const DEFAULT_RATIO = 3 / 4
const MIN_RATIO = 0.25 // 1:4 보다 긴 두루마리는 이 비율로 제한
const MAX_RATIO = 4

function treasureNumber(slug: string): number {
  return parseInt(slug.match(/treasure-(\d+)/)?.[1] || '0')
}

/**
 * 갤러리 정렬. 원본 배열은 바꾸지 않는다.
 * 기본 순서는 문방사우(treasure) 시리즈를 번호순으로 앞에 두고 나머지는 원래 순서를 유지한다.
 */
export function sortArtworks(
  artworks: readonly Artwork[],
  sortBy: SortKey
): Artwork[] {
  const list = [...artworks]

  switch (sortBy) {
    case 'title':
      return list.sort((a, b) => a.title.localeCompare(b.title))
    case 'year':
      return list.sort((a, b) => (b.year || 0) - (a.year || 0))
    case 'category':
      return list.sort((a, b) =>
        (a.category || '').localeCompare(b.category || '')
      )
    case 'tags':
      return list.sort((a, b) =>
        (a.tags?.[0] || '').localeCompare(b.tags?.[0] || '')
      )
    case 'default':
    default: {
      const treasure = list
        .filter((artwork) => artwork.category === 'treasure')
        .sort((a, b) => treasureNumber(a.slug) - treasureNumber(b.slug))
      const others = list.filter((artwork) => artwork.category !== 'treasure')
      return [...treasure, ...others]
    }
  }
}

export function filterArtworks(
  artworks: readonly Artwork[],
  { category, tags }: ArtworkFilter
): Artwork[] {
  return artworks.filter((artwork) => {
    if (category !== 'all' && artwork.category !== category) return false
    if (tags.length === 0) return true
    const own = artwork.tags ?? []
    return tags.every((tag) => own.includes(tag))
  })
}

/** 상세 페이지의 이전/다음 작품 — 갤러리 기본 순서와 일치시킨다 */
export function getNeighbors(
  artworks: readonly Artwork[],
  slug: string
): { prev: Artwork | null; next: Artwork | null } {
  const ordered = sortArtworks(artworks, 'default')
  const index = ordered.findIndex((artwork) => artwork.slug === slug)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: ordered[index - 1] ?? null,
    next: ordered[index + 1] ?? null,
  }
}

function clampRatio(ratio: number): number {
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio))
}

/** "w/h" 문자열 → 가로/세로 숫자. 해석할 수 없으면 null */
function parseRatioString(value: string | undefined): number | null {
  const match = value?.match(/^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/)
  if (!match) return null
  const width = Number(match[1])
  const height = Number(match[2])
  return width && height ? clampRatio(width / height) : null
}

/** "70 x 140 cm", "24.5cm x 33.5cm", "35×135cm" → 가로/세로. 해석할 수 없으면 null */
function parseDimensions(value: string | undefined): number | null {
  const match = value?.match(
    /(\d+(?:\.\d+)?)\s*(?:cm)?\s*[x×X]\s*(\d+(?:\.\d+)?)/
  )
  if (!match) return null
  const width = Number(match[1])
  const height = Number(match[2])
  return width && height ? clampRatio(width / height) : null
}

/** "w/h" 문자열 → 가로/세로 숫자. 잘못된 값은 3/4, 극단값은 [1/4, 4] 범위로 제한 */
export function parseAspectRatio(value: string | undefined): number {
  return parseRatioString(value) ?? DEFAULT_RATIO
}

// 실제 이미지 픽셀 비율 (scripts/image-ratios.js 가 생성)
const MEASURED_RATIOS: Readonly<Record<string, number>> = imageRatios

/**
 * 작품의 가로/세로 비율. 이미지 파일에서 잰 비율이 있으면 그것을 쓴다.
 * 없으면 Airtable aspectRatio 로 추정하는데, "?"나 "70cm x 140cm"처럼 깨진 값이 많아
 * 유효하지 않으면 dimensions(가로 x 세로)로 계산한다.
 * 추정이 틀렸으면 이미지가 로드된 뒤 실제 픽셀 비율로 다시 맞춘다(useImageRatio).
 */
export function ratioFromArtwork(
  artwork: Pick<Artwork, 'aspectRatio' | 'dimensions'> &
    Partial<Pick<Artwork, 'imageUrl'>>
): number {
  const measured = artwork.imageUrl
    ? MEASURED_RATIOS[artwork.imageUrl]
    : undefined
  return (
    (measured && Math.min(MAX_RATIO, Math.max(MIN_RATIO, measured))) ??
    parseRatioString(artwork.aspectRatio) ??
    parseDimensions(artwork.aspectRatio) ??
    parseDimensions(artwork.dimensions) ??
    DEFAULT_RATIO
  )
}
