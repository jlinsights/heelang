import { getArtworks } from '@/lib/artworks'
import { SITE_NAME } from '@/lib/site'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import GalleryClient from './gallery-client'

export const dynamic = 'force-static' // can be revalidated via tag

// 자기 /api/artworks 를 HTTP 로 부르면 빌드 시점엔 서버가 없어 빈 목록이 정적 HTML 에 박힌다.
// 그러면 클라이언트가 폴백 → 실데이터로 두 번 갈아 끼우며 레이아웃이 밀린다(CLS 0.13~0.31).
// 작품 상세 페이지처럼 Airtable 을 직접 읽고, 'artworks' 태그로 재검증한다.
const getCachedArtworks = unstable_cache(getArtworks, ['gallery-artworks'], {
  tags: ['artworks'],
  revalidate: 3600,
})

export const metadata: Metadata = {
  title: '갤러리',
  description:
    '서예가 희랑 공경순의 작품을 자르지 않은 원래 비율로 감상하세요.',
  keywords: [
    '갤러리',
    '서예 작품',
    '희랑 공경순',
    '현대서예',
    '한국서예',
    'calligraphy gallery',
    'korean art',
  ],
  openGraph: {
    title: `갤러리 | ${SITE_NAME}`,
    description: '현대 서예 작품 컬렉션',
    url: '/gallery',
    siteName: SITE_NAME,
    type: 'website',
    locale: 'ko_KR',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function GalleryPage() {
  const artworks = await getCachedArtworks()
  return <GalleryClient initialArtworks={artworks} />
}
