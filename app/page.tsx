import { getArtworks } from '@/lib/artworks'
import { pickFeatured } from '@/lib/gallery/ordering'
import { unstable_cache } from 'next/cache'
import HomeClient from './home-client'

export const dynamic = 'force-static' // 'artworks' 태그로 재검증된다

// 홈 전체가 클라이언트 컴포넌트였을 때는 대표작을 JS 실행 뒤 /api/artworks 로 받아
// 서버 HTML 에 첫 작품 이미지가 없었다. 휴대폰에서 이미지 요청이 5초 넘게 늦게 시작됐다.
// 갤러리와 같은 캐시 키·태그로 Airtable 을 직접 읽어 첫 HTML 에 그린다.
const getCachedArtworks = unstable_cache(getArtworks, ['gallery-artworks'], {
  tags: ['artworks'],
  revalidate: 3600,
})

const FEATURED_LIMIT = 8

export default async function HomePage() {
  const artworks = await getCachedArtworks()
  return <HomeClient artworks={pickFeatured(artworks, FEATURED_LIMIT)} />
}
