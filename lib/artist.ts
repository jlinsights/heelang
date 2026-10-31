import { fetchArtistFromAirtable } from '@/lib/airtable'
import { Artist } from '@/lib/types'

/**
 * 작가 정보는 Airtable Artist 레코드에서만 읽는다. 읽지 못하면 null.
 *
 * 예전에는 Airtable 이 실패할 때 쓰는 폴백 작가 데이터가 여기 있었는데, 실제로 없는
 * 전시·수상 이력이 들어 있었다(2026-10-31 삭제). 사실이 아닌 이력을 보여 주느니
 * 화면에서 "불러올 수 없습니다" 를 띄우는 편이 낫다.
 */
export async function fetchArtist(id: string): Promise<Artist | null> {
  try {
    const artist = await fetchArtistFromAirtable()
    if (!artist) {
      console.warn(`작가 정보를 찾지 못했습니다 (id: ${id})`)
      return null
    }
    return artist
  } catch (error) {
    console.error('작가 정보를 읽는 중 오류:', error)
    return null
  }
}
